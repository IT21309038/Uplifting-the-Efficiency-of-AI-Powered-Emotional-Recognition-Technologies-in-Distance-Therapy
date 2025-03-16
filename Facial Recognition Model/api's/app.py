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
import base64
import uuid
from fastapi import FastAPI, WebSocket, Response
import asyncio
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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


class ConnectionState:
    def __init__(self):
        self.current_window_emotions = deque(maxlen=frames_per_window)
        self.current_stress_level = 0
        self.stress_levels = []
        self.window_emotions = []


connection_states = {}


def decode_base64_frame(base64_string):
    try:
        img_data = base64.b64decode(base64_string.split(',')[1])
        np_arr = np.frombuffer(img_data, np.uint8)
        return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    except Exception as e:
        logger.error(f"Error decoding frame: {e}")
        return None


def process_frame(frame, state):
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
        state.current_window_emotions.append(dominant_emotion)
        x, y, w, h = face_rect.left(), face_rect.top(), face_rect.width(), face_rect.height()
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(frame, f"Emotion: {dominant_emotion}", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255),
                    2)

    if len(state.current_window_emotions) == frames_per_window:
        emotion_counts = Counter(state.current_window_emotions)
        window_dominant_emotion = emotion_counts.most_common(1)[0][0]
        if window_dominant_emotion == "Neutral":
            if state.current_stress_level > 0:
                state.current_stress_level = max(0, state.current_stress_level - decay_factor)
            elif state.current_stress_level < 0:
                state.current_stress_level = min(0, state.current_stress_level + decay_factor)
        else:
            state.current_stress_level += emotion_to_stress[window_dominant_emotion]
        state.window_emotions.append(window_dominant_emotion)
        state.stress_levels.append(state.current_stress_level)
        state.current_window_emotions.clear()
    return frame, state.current_stress_level


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


def generate_final_plots(stress_levels, window_emotions):
    stress_buf = BytesIO()
    plt.figure(figsize=(10, 6))
    plt.plot(range(1, len(stress_levels) + 1), stress_levels, marker='o', linestyle='-', color='b')
    plt.title("Stress Fluctuation Over Session")
    plt.xlabel("Time (Minutes)")
    plt.ylabel("Stress Level")
    plt.axhline(0, color='gray', linestyle='--', label='Neutral Stress Level')
    plt.legend()
    plt.grid(True)
    plt.savefig(stress_buf, format='png')
    plt.close()
    stress_buf.seek(0)

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
    return stress_buf.getvalue(), emotion_buf.getvalue()


app = FastAPI()


# app.py (partial update, only showing the WebSocket endpoint)
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connection_id = str(uuid.uuid4())
    connection_states[connection_id] = ConnectionState()
    await websocket.send_text(connection_id)
    logger.info(f"WebSocket connection established: {connection_id}")

    try:
        while True:
            try:
                data = await websocket.receive_text()
                logger.info(f"Received data for connection {connection_id}, length: {len(data)}")
                if not data.startswith("data:image"):
                    logger.info(f"Non-image data received: {data[:20]}... skipping")
                    continue
                frame = decode_base64_frame(data)
                if frame is None:
                    logger.warning(f"Failed to decode frame for {connection_id}, skipping")
                    continue
                processed_frame, _ = process_frame(frame, connection_states[connection_id])
                graph = generate_stress_graph(connection_states[connection_id].stress_levels)
                combined_frame = cv2.hconcat([cv2.resize(processed_frame, (640, 480)), cv2.resize(graph, (640, 480))])
                ret, jpeg = cv2.imencode('.jpg', combined_frame)
                if ret:
                    await websocket.send_bytes(jpeg.tobytes())
                    logger.info(f"Sent processed frame for connection {connection_id}")
            except Exception as e:
                logger.error(f"Error processing frame for {connection_id}: {e}")
    except Exception as e:
        logger.error(f"WebSocket error for {connection_id}: {e}")
    finally:
        if connection_id in connection_states:
            del connection_states[connection_id]
            logger.info(f"Cleaned up state for connection {connection_id}")


@app.get("/final_stress_plot/{connection_id}")
async def get_final_stress_plot(connection_id: str):
    if connection_id not in connection_states:
        return {"error": "No data available for this session"}
    stress_plot, _ = generate_final_plots(connection_states[connection_id].stress_levels,
                                          connection_states[connection_id].window_emotions)
    return Response(content=stress_plot, media_type="image/png")


@app.get("/final_emotion_plot/{connection_id}")
async def get_final_emotion_plot(connection_id: str):
    if connection_id not in connection_states:
        return {"error": "No data available for this session"}
    _, emotion_plot = generate_final_plots(connection_states[connection_id].stress_levels,
                                           connection_states[connection_id].window_emotions)
    return Response(content=emotion_plot, media_type="image/png")