# app.py
import cv2
import dlib
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from collections import deque, Counter
from io import BytesIO

# Load model and predictors (global setup)
emotion_model = load_model("../stress_model/emotion_stress_model.h5")
face_detector = dlib.get_frontal_face_detector()
shape_predictor = dlib.shape_predictor("../pre models/shape_predictor_5_face_landmarks.dat")

# Constants
emotion_labels = ["Anger", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]
emotion_to_stress = {"Anger": 1.0, "Disgust": 0.7, "Fear": 0.9, "Happy": -0.5, "Neutral": 0.0, "Sad": 0.5,
                     "Surprise": -0.2}
decay_factor = 0.2
fps = 30
window_duration = 2
frames_per_window = fps * window_duration


# Function to process a single frame
def process_frame(frame, current_window_emotions, current_stress_level, stress_levels, window_emotions):
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    detected_faces = face_detector(gray_frame, 1)

    for face_rect in detected_faces:
        landmarks = shape_predictor(gray_frame, face_rect)
        face_chip = dlib.get_face_chip(frame, landmarks, size=48, padding=0.25)
        face_gray = cv2.cvtColor(face_chip, cv2.COLOR_BGR2GRAY)
        face_gray = face_gray.astype("float32") / 255.0
        face_input = img_to_array(face_gray)
        face_input = np.expand_dims(face_input, axis=0)

        emotion_probs = emotion_model.predict(face_input)[0]
        dominant_emotion = emotion_labels[np.argmax(emotion_probs)]
        current_window_emotions.append(dominant_emotion)

        x, y, w, h = face_rect.left(), face_rect.top(), face_rect.width(), face_rect.height()
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(frame, f"Emotion: {dominant_emotion}", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255),
                    2)

    if len(current_window_emotions) == frames_per_window:
        emotion_counts = Counter(current_window_emotions)
        window_dominant_emotion = emotion_counts.most_common(1)[0][0]

        if window_dominant_emotion == "Neutral":
            if current_stress_level > 0:
                current_stress_level = max(0, current_stress_level - decay_factor)
            elif current_stress_level < 0:
                current_stress_level = min(0, current_stress_level + decay_factor)
        else:
            current_stress_level += emotion_to_stress[window_dominant_emotion]

        window_emotions.append(window_dominant_emotion)
        stress_levels.append(current_stress_level)
        current_window_emotions.clear()

    return frame, current_stress_level


# Function to generate real-time stress graph
def generate_stress_graph(stress_levels):
    fig = plt.figure(figsize=(4, 2))
    ax = fig.add_subplot(111)
    ax.plot(stress_levels, color='b', marker='o', linestyle='-')
    ax.axhline(0, color='gray', linestyle='--', linewidth=0.8, label='Neutral Stress Level')
    ax.set_title("Real-Time Stress Trend")
    ax.set_xlabel("Minutes")
    ax.set_ylabel("Stress Level")
    ax.legend()
    ax.grid(True)
    canvas = FigureCanvas(fig)
    canvas.draw()
    buf = np.frombuffer(canvas.tostring_rgb(), dtype=np.uint8)
    buf = buf.reshape(canvas.get_width_height()[::-1] + (3,))
    plt.close(fig)
    return cv2.cvtColor(buf, cv2.COLOR_RGB2BGR)


# Function to generate final plots
def generate_final_plots(stress_levels, window_emotions):
    # Stress Plot
    plt.figure(figsize=(10, 6))
    plt.plot(range(1, len(stress_levels) + 1), stress_levels, marker='o', linestyle='-', color='b')
    plt.title("Stress Fluctuation Over Session")
    plt.xlabel("Time (Minutes)")
    plt.ylabel("Stress Level")
    plt.axhline(0, color='gray', linestyle='--', label='Neutral Stress Level')
    plt.legend()
    plt.grid(True)
    stress_buf = BytesIO()
    plt.savefig(stress_buf, format='png')
    plt.close()
    stress_buf.seek(0)

    # Emotion Plot
    emotion_buf = BytesIO()
    if window_emotions:
        plt.figure(figsize=(10, 6))
        emotion_indices = [emotion_labels.index(e) for e in window_emotions]
        plt.step(range(1, len(emotion_indices) + 1), emotion_indices, where='mid', color='r',
                 label='Emotion Fluctuation')
        plt.yticks(range(len(emotion_labels)), emotion_labels)
        plt.title("Emotion Fluctuation Over Session")
        plt.xlabel("Time (minutes)")
        plt.ylabel("Dominant Emotion")
        plt.grid(True)
        plt.legend()
        plt.savefig(emotion_buf, format='png')
        plt.close()
    emotion_buf.seek(0)

    return stress_buf.getvalue(), emotion_buf.getvalue()  # Return bytes for API response

# app.py (continued)
from fastapi import FastAPI, Response
from fastapi.responses import StreamingResponse
import asyncio

app = FastAPI()

# API 1: Webcam Feed
async def webcam_stream():
    webcam = cv2.VideoCapture(0)
    if not webcam.isOpened():
        return

    current_window_emotions = deque(maxlen=frames_per_window)
    stress_levels = []
    window_emotions = []
    current_stress_level = 0

    while True:
        ret, frame = webcam.read()
        if not ret:
            break

        frame, current_stress_level = process_frame(frame, current_window_emotions, current_stress_level, stress_levels, window_emotions)
        graph = generate_stress_graph(stress_levels)
        combined_frame = cv2.hconcat([cv2.resize(frame, (640, 480)), cv2.resize(graph, (640, 480))])

        ret, jpeg = cv2.imencode('.jpg', combined_frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')

        await asyncio.sleep(1 / fps)  # Control frame rate

    webcam.release()
    # Store final plots globally (for simplicity; in production, use a better method)
    global last_stress_plot, last_emotion_plot
    last_stress_plot, last_emotion_plot = generate_final_plots(stress_levels, window_emotions)

@app.get("/webcam")
async def get_webcam_feed():
    return StreamingResponse(webcam_stream(), media_type="multipart/x-mixed-replace; boundary=frame")

# API 2: Video Stream (e.g., RTSP or uploaded file)
from fastapi import File, UploadFile

async def video_stream(video_source):
    if not video_source.isOpened():
        return

    current_window_emotions = deque(maxlen=frames_per_window)
    stress_levels = []
    window_emotions = []
    current_stress_level = 0

    while True:
        ret, frame = video_source.read()
        if not ret:
            break

        frame, current_stress_level = process_frame(frame, current_window_emotions, current_stress_level, stress_levels, window_emotions)
        graph = generate_stress_graph(stress_levels)
        combined_frame = cv2.hconcat([cv2.resize(frame, (640, 480)), cv2.resize(graph, (640, 480))])

        ret, jpeg = cv2.imencode('.jpg', combined_frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')

        await asyncio.sleep(1 / fps)

    video_source.release()
    global last_stress_plot, last_emotion_plot
    last_stress_plot, last_emotion_plot = generate_final_plots(stress_levels, window_emotions)

@app.post("/video_stream")
async def process_video_stream(rtsp_url: str = None, file: UploadFile = File(None)):
    if rtsp_url:
        video_source = cv2.VideoCapture(rtsp_url)
    elif file:
        # Save uploaded file temporarily
        with open("temp_video.mp4", "wb") as f:
            f.write(await file.read())
        video_source = cv2.VideoCapture("temp_video.mp4")
    else:
        return {"error": "Provide RTSP URL or upload a video file"}

    return StreamingResponse(video_stream(video_source), media_type="multipart/x-mixed-replace; boundary=frame")

# Endpoint to get final plots
last_stress_plot = None
last_emotion_plot = None

@app.get("/final_plots")
async def get_final_plots():
    if last_stress_plot is None or last_emotion_plot is None:
        return {"error": "No plots available yet"}
    return {
        "stress_plot": Response(content=last_stress_plot, media_type="image/png"),
        "emotion_plot": Response(content=last_emotion_plot, media_type="image/png")
    }