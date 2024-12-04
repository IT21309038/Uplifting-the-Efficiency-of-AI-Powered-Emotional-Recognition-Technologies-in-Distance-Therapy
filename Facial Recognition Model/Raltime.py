import cv2
import dlib
import numpy as np
from keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from collections import deque

# Load the pre-trained emotion detection model
emotion_model = load_model("fer2013_model.h5")

# Emotion labels (ensure these match your model's output order)
emotion_labels = ["Anger", "Contempt", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]

# Initialize webcam
webcam_video_stream = cv2.VideoCapture(0)
if not webcam_video_stream.isOpened():
    print("Error: Could not open webcam.")
    exit()

# Initialize dlib face detector and shape predictor
face_detector = dlib.get_frontal_face_detector()
shape_predictor = dlib.shape_predictor("pre models/shape_predictor_5_face_landmarks.dat")

# Rolling average buffer for smoothing predictions
rolling_predictions = deque(maxlen=5)

# Frame skipping to improve performance
frame_skip = 2
frame_count = 0

while True:
    ret, current_frame = webcam_video_stream.read()
    if not ret:
        print("Failed to capture frame. Exiting.")
        break

    frame_count += 1
    if frame_count % frame_skip != 0:
        continue

    # Convert frame to grayscale for dlib
    gray_frame = cv2.cvtColor(current_frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the frame
    detected_faces = face_detector(gray_frame, 1)

    # Create a dlib.full_object_detections object
    face_landmarks = dlib.full_object_detections()

    for face_rect in detected_faces:
        # Get facial landmarks and add them to the full_object_detections object
        landmarks = shape_predictor(gray_frame, face_rect)
        face_landmarks.append(landmarks)

    # Get aligned face chips (aligned face crops)
    if len(face_landmarks) > 0:
        face_chips = dlib.get_face_chips(current_frame, face_landmarks, size=48, padding=0.25)

        for chip, landmarks in zip(face_chips, face_landmarks):
            # Preprocess the face chip
            face_gray = cv2.cvtColor(chip, cv2.COLOR_BGR2GRAY)
            face_gray = face_gray.astype("float32") / 255.0
            face_input = img_to_array(face_gray)
            face_input = np.expand_dims(face_input, axis=0)

            # Debugging: Check preprocessing details
            print(f"Processed face shape: {face_input.shape}, Pixel range: {face_gray.min()} - {face_gray.max()}")

            # Make emotion prediction
            emotion_prediction = emotion_model.predict(face_input, verbose=0)
            rolling_predictions.append(emotion_prediction)

            # Average predictions for smoother results
            averaged_prediction = np.mean(rolling_predictions, axis=0)
            emotion_label = emotion_labels[np.argmax(averaged_prediction)]

            # Debugging: Display prediction probabilities
            print(f"Predicted Probabilities: {averaged_prediction}")
            print(f"Predicted Emotion: {emotion_label}")

            # Draw rectangle and label around the face in the original frame
            x, y, width, height = face_rect.left(), face_rect.top(), face_rect.width(), face_rect.height()
            cv2.rectangle(current_frame, (x, y), (x + width, y + height), (0, 255, 0), 2)
            cv2.putText(
                current_frame,
                emotion_label,
                (x, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 255, 0),
                2,
                cv2.LINE_AA,
            )

    # Display the frame with detections
    cv2.imshow("Emotion Detection - Press 'q' to Quit", current_frame)

    # Exit on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
webcam_video_stream.release()
cv2.destroyAllWindows()
