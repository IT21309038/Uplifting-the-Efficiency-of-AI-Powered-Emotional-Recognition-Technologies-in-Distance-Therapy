import logging
import os
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import uvicorn
import librosa
import soundfile as sf
from keras.models import load_model
from fastapi.middleware.cors import CORSMiddleware
from collections import Counter
from datetime import datetime
import json
import subprocess
from pydub import AudioSegment
from typing import Optional

# AudioSegment.converter = "C:\Users\Thanish\ffmpeg\ffmpeg\bin\ffmpeg.exe"

# Load the saved model
model = load_model("emotion_recognition_model.h5")

# Define a FastAPI app
app = FastAPI()

# Enable CORS to allow Flutter API calls
app.add_middleware(
    CORSMiddleware,
    # Replace "*" with specific Flutter app domain in production
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define emotion labels (modify based on your model's output)
emotion_labels = ['neutral', 'calm', 'happy',
                  'sad', 'angry', 'fear', 'disgust', 'surprise']

# Set up logging
logging.basicConfig(level=logging.INFO)

# Noise Reduction Function


def reduce_noise(audio, sample_rate):
    try:
        # Apply spectral gating for noise reduction
        stft = librosa.stft(audio)
        magnitude, phase = librosa.magphase(stft)
        noise_profile = np.median(magnitude, axis=1, keepdims=True)
        threshold = 1.5 * noise_profile
        reduced_magnitude = np.maximum(0, magnitude - threshold)
        reduced_audio = librosa.istft(reduced_magnitude * phase)
        return reduced_audio
    except Exception as e:
        logging.error(f"Noise reduction error: {e}")
        return audio  # Return original if noise reduction fails

# Audio Feature Extraction


def extract_features(file_path):
    try:
        logging.info(f"Processing audio: {file_path}")

        # Read the audio file
        data, sample_rate = sf.read(file_path)

        # Convert stereo to mono
        if len(data.shape) > 1:
            data = np.mean(data, axis=1)

        # Ensure the audio has enough signal
        if len(data) == 0 or np.max(np.abs(data)) < 0.001:
            raise ValueError("Invalid or silent audio file.")

        # Apply noise reduction
        data = reduce_noise(data, sample_rate)

        # Extract Features
        features = np.array([])
        features = np.hstack(
            (features, np.mean(librosa.feature.zero_crossing_rate(y=data).T, axis=0)))
        features = np.hstack((features, np.mean(librosa.feature.chroma_stft(
            S=np.abs(librosa.stft(data)), sr=sample_rate).T, axis=0)))
        features = np.hstack((features, np.mean(librosa.feature.mfcc(
            y=data, sr=sample_rate, n_mfcc=13).T, axis=0)))
        features = np.hstack(
            (features, np.mean(librosa.feature.rms(y=data).T, axis=0)))
        features = np.hstack((features, np.mean(
            librosa.feature.melspectrogram(y=data, sr=sample_rate).T, axis=0)))

        return features
    except Exception as e:
        logging.error(f"Feature extraction error: {e}")
        raise

# API Route to Accept Audio Uploads from Flutter


@app.post("/predict/")
async def predict_emotion(file: UploadFile = File(...)):
    try:
        # Save the uploaded file temporarily
        temp_file = f"temp_{file.filename}"
        with open(temp_file, "wb") as buffer:
            buffer.write(await file.read())

        logging.info(f"Received file: {temp_file}")

        # Extract features
        features = extract_features(temp_file)
        features = np.expand_dims(features, axis=0)  # Add batch dimension
        features = np.expand_dims(features, axis=2)  # Add channel dimension

        # Predict Emotion
        predictions = model.predict(features)[0]
        predicted_emotion = emotion_labels[np.argmax(predictions)]

        # Clean up temporary file
        os.remove(temp_file)

        # Return JSON response to Flutter
        probabilities = {emotion: float(pred) for emotion, pred in zip(
            emotion_labels, predictions)}
        return {"predicted_emotion": predicted_emotion, "probabilities": probabilities}

    except Exception as e:
        logging.error(f"Prediction error: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to process audio: {e}")


@app.post("/predict-emotion/")
async def predict_emotion(file: UploadFile = File(...)):
    try:
        # ✅ Save WebM File Temporarily
        temp_webm = f"temp_{file.filename}"
        with open(temp_webm, "wb") as buffer:
            buffer.write(await file.read())

        logging.info(f"Received file: {temp_webm}")

        # ✅ Convert WebM to WAV Using `pydub`
        temp_wav = temp_webm.replace(".webm", ".wav")
        audio = AudioSegment.from_file(temp_webm, format="webm")
        audio = audio.set_channels(1).set_frame_rate(
            16000)  # Convert to 16kHz Mono
        audio.export(temp_wav, format="wav")

        # ✅ Extract Features and Predict Emotion
        features = extract_features(temp_wav)
        features = np.expand_dims(features, axis=0)  # Add batch dimension
        features = np.expand_dims(features, axis=2)  # Add channel dimension

        predictions = model.predict(features)[0]
        predicted_emotion = emotion_labels[np.argmax(predictions)]

        # ✅ Clean Up Temporary Files
        os.remove(temp_webm)
        os.remove(temp_wav)

        # ✅ Return JSON Response
        probabilities = {emotion: float(pred) for emotion, pred in zip(
            emotion_labels, predictions)}
        return {"predicted_emotion": predicted_emotion, "probabilities": probabilities}

    except Exception as e:
        logging.error(f"Prediction error: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to process audio: {e}")


class EmotionData(BaseModel):
    timestamp: str  # Time when the emotion was detected (ISO format)
    emotion: Optional[str] = None
    stress_level: float  # Stress level (0-100)


class SessionData(BaseModel):
    session_id: str
    data: list[EmotionData]  # List of time-based emotion data

# ✅ API Route to Generate a Time-based Report


@app.post("/generate-session-report/")
async def generate_session_report(session_data: SessionData):
    try:
        # Debugging
        logging.info(f"Received session data: {session_data.dict()}")

        if not session_data.data:
            raise HTTPException(status_code=400, detail="No data provided.")
        logging.info(
            f"Generating session report for: {session_data.session_id}")

        if not session_data.data:
            raise HTTPException(status_code=400, detail="No data provided.")

        # Extract emotion data
        # ✅ Assign "neutral" if missing
        emotions = [
        entry.emotion if entry.emotion else "neutral" for entry in session_data.data]
        timestamps = [entry.timestamp for entry in session_data.data]
        stress_levels = [entry.stress_level for entry in session_data.data]

        # Count emotion occurrences
        emotion_count = Counter(emotions)
        total_emotions = sum(emotion_count.values())

        # Calculate emotion distribution in percentage
        emotion_distribution = {emotion: round((count / total_emotions) * 100, 2)
                                for emotion, count in emotion_count.items()}

        # Analyze stress trends
        avg_stress = round(sum(stress_levels) / len(stress_levels), 2)
        stress_trend = "Increasing" if stress_levels[-1] > stress_levels[
            0] else "Stable" if stress_levels[-1] == stress_levels[0] else "Decreasing"

        # Identify highest & lowest stress points
        highest_stress = max(stress_levels)
        lowest_stress = min(stress_levels)

        # Identify dominant emotion
        dominant_emotion = max(emotion_count, key=emotion_count.get)

        # Generate session summary
        session_summary = {
            "session_id": session_data.session_id,
            "total_emotion_samples": total_emotions,
            "dominant_emotion": dominant_emotion,
            "emotion_distribution": emotion_distribution,
            "stress_levels": {
                "average": avg_stress,
                "trend": stress_trend,
                "highest": highest_stress,
                "lowest": lowest_stress,
            },
            "report_generated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
            "emotion_timeline": [
                {"timestamp": timestamps[i], "emotion": emotions[i],
                    "stress_level": stress_levels[i]}
                for i in range(len(timestamps))
            ]
        }

        # Save as JSON file (optional)
        report_filename = f"session_report_{session_data.session_id}.json"
        with open(report_filename, "w") as report_file:
            json.dump(session_summary, report_file, indent=4)

        logging.info(f"Session report saved as: {report_filename}")

        return {"message": "Report generated successfully", "report": session_summary}

    except Exception as e:
        logging.error(f"Report generation error: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to generate report: {e}")

# Run the FastAPI app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
