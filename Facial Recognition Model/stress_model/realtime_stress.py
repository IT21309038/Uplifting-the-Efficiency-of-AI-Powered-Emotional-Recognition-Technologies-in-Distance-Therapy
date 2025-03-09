import cv2
import dlib
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
from keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from collections import deque, Counter

# Load the pre-trained emotion detection model
emotion_model = load_model("emotion_stress_model.h5")

# Emotion labels (ensure these match the model's output order)
emotion_labels = ["Anger", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]

# Stress Mapping based on emotions
emotion_to_stress = {
    "Anger": 1.0,
    "Disgust": 0.7,
    "Fear": 0.9,
    "Happy": -0.5,
    "Neutral": 0.0,
    "Sad": 0.5,
    "Surprise": -0.2
}

# Decay factor for stress reduction during neutral states
decay_factor = 0.2

# Initialize webcam
webcam_video_stream = cv2.VideoCapture(0)
if not webcam_video_stream.isOpened():
    print("Error: Could not open webcam.")
    exit()

# Initialize Dlib face detector and shape predictor
face_detector = dlib.get_frontal_face_detector()
shape_predictor = dlib.shape_predictor("../pre models/shape_predictor_5_face_landmarks.dat")

# Parameters for windowing
fps = 30  # Assuming ~30 FPS
window_duration = 2  # 1-minute window
frames_per_window = fps * window_duration

# Buffers and data storage
current_window_emotions = deque(maxlen=frames_per_window)
stress_levels = []  # Store stress levels for the session
window_emotions = []  # Store emotions for the current window
current_stress_level = 0  # Start at a baseline stress level

while True:
    ret, frame = webcam_video_stream.read()
    if not ret:
        print("Failed to capture frame. Exiting.")
        break

    # Convert frame to grayscale for Dlib
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces using Dlib
    detected_faces = face_detector(gray_frame, 1)

    for face_rect in detected_faces:
        # Get aligned face chip
        landmarks = shape_predictor(gray_frame, face_rect)
        face_chip = dlib.get_face_chip(frame, landmarks, size=48, padding=0.25)

        # Preprocess the face chip
        face_gray = cv2.cvtColor(face_chip, cv2.COLOR_BGR2GRAY)
        face_gray = face_gray.astype("float32") / 255.0
        face_input = img_to_array(face_gray)
        face_input = np.expand_dims(face_input, axis=0)

        # Predict emotion
        emotion_probs, _ = emotion_model.predict(face_input)
        dominant_emotion = emotion_labels[np.argmax(emotion_probs)]  # Get the dominant emotion

        # Add detected emotion to the current window
        current_window_emotions.append(dominant_emotion)

        # Draw rectangle around face and display emotion
        x, y, w, h = face_rect.left(), face_rect.top(), face_rect.width(), face_rect.height()
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(frame, f"Emotion: {dominant_emotion}", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

    # Check if the window is complete
    if len(current_window_emotions) == frames_per_window:
        # Determine the dominant emotion for the window
        emotion_counts = Counter(current_window_emotions)
        window_dominant_emotion = emotion_counts.most_common(1)[0][0]

        # Map the dominant emotion to stress
        if window_dominant_emotion == "Neutral":
            # Apply decay when transitioning toward neutral (both from positive and negative levels)
            if current_stress_level > 0:  # Reduce positive stress
                current_stress_level = max(0, current_stress_level - decay_factor)
            elif current_stress_level < 0:  # Reduce negative stress (move toward neutral)
                current_stress_level = min(0, current_stress_level + decay_factor)
        else:
            # Adjust stress level based on the mapped stress value
            stress_change = emotion_to_stress[window_dominant_emotion]
            current_stress_level += stress_change

        if window_dominant_emotion in emotion_labels:
            window_emotions.append(window_dominant_emotion)

        # Store the stress level
        stress_levels.append(current_stress_level)

        # Clear the current window buffer
        current_window_emotions.clear()

    # Create a real-time stress fluctuation graph
    fig = Figure(figsize=(4, 2))
    canvas = FigureCanvas(fig)
    ax = fig.add_subplot(111)
    ax.plot(stress_levels, color='b', marker='o', linestyle='-')
    ax.axhline(0, color='gray', linestyle='--', linewidth=0.8, label='Neutral Stress Level')
    ax.set_title("Real-Time Stress Trend")
    ax.set_xlabel("Minutes")
    ax.set_ylabel("Stress Level")
    ax.legend()
    ax.grid(True)
    canvas.draw()

    # Convert the graph to an image
    buf = np.frombuffer(canvas.tostring_rgb(), dtype=np.uint8)
    buf = buf.reshape(canvas.get_width_height()[::-1] + (3,))
    buf = cv2.cvtColor(buf, cv2.COLOR_RGB2BGR)

    # Combine video feed and graph side-by-side
    combined_frame = cv2.hconcat([cv2.resize(frame, (640, 480)), cv2.resize(buf, (640, 480))])
    cv2.imshow("Real-Time Emotion Detection with Stress Trend", combined_frame)

    # Exit on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
webcam_video_stream.release()
cv2.destroyAllWindows()

# Generate Final Stress Fluctuation Plot
plt.figure(figsize=(10, 6))
plt.plot(range(1, len(stress_levels) + 1), stress_levels, marker='o', linestyle='-', color='b')
plt.title("Stress Fluctuation Over Session")
plt.xlabel("Time (Minutes)")
plt.ylabel("Stress Level")
plt.axhline(0, color='gray', linestyle='--', linewidth=0.8, label='Neutral Stress Level')
plt.legend()
plt.grid(True)
plt.show()


# Generate Emotion Fluctuation Plot
if window_emotions:
    plt.figure(figsize=(10, 6))
    emotion_indices = [emotion_labels.index(e) for e in window_emotions]
    plt.step(range(1, len(emotion_indices) + 1), emotion_indices, where='mid', color='r', label='Emotion Fluctuation')
    plt.yticks(range(len(emotion_labels)), emotion_labels)
    plt.title("Emotion Fluctuation Over Session")
    plt.xlabel("Time (minutes)")
    plt.ylabel("Dominant Emotion")
    plt.grid(True)
    plt.legend()
    plt.show()
