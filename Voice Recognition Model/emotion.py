import logging
import os
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, HTTPException, UploadFile, File, WebSocket
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
import asyncio


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


def extract_features_from_stream(audio_chunk, sample_rate=16000):
    """Extract features directly from audio stream chunks"""
    features = np.array([])

    # Ensure the chunk isn't silent
    if np.max(np.abs(audio_chunk)) < 0.001:
        raise ValueError("Silent audio chunk received")

    # Apply noise reduction
    audio_chunk = reduce_noise(audio_chunk, sample_rate)

    # Extract features
    features = np.hstack((features, np.mean(
        librosa.feature.zero_crossing_rate(y=audio_chunk).T, axis=0)))
    features = np.hstack((features, np.mean(librosa.feature.chroma_stft(
        S=np.abs(librosa.stft(audio_chunk)), sr=sample_rate).T, axis=0)))
    features = np.hstack((features, np.mean(librosa.feature.mfcc(
        y=audio_chunk, sr=sample_rate, n_mfcc=13).T, axis=0)))
    features = np.hstack(
        (features, np.mean(librosa.feature.rms(y=audio_chunk).T, axis=0)))
    features = np.hstack((features, np.mean(
        librosa.feature.melspectrogram(y=audio_chunk, sr=sample_rate).T, axis=0)))

    return features


def calculate_stress_level(probabilities):
    """Calculate stress level from probabilities"""
    stress_values = {
        'neutral': 0,
        'calm': -20,
        'happy': -30,
        'sad': 60,
        'angry': 90,
        'fear': 75,
        'disgust': 70,
        'surprise': -5
    }

    stress_level = 0
    dominant_emotion = max(probabilities.items(), key=lambda x: x[1])[0]

    for emotion, probability in probabilities.items():
        stress_value = stress_values.get(emotion, 0)
        weight = 2 if emotion == dominant_emotion else 1
        stress_level += probability * stress_value * weight

    # Normalize to 0-100 range
    min_stress = -30
    max_stress = 90
    normalized_stress = ((stress_level - min_stress) /
                         (max_stress - min_stress)) * 100

    return max(0, min(100, normalized_stress))

# WebSocket endpoint for real-time audio stream processing


@app.websocket("/ws/audio-stream")
async def websocket_audio_stream(websocket: WebSocket):
    await websocket.accept()
    logging.info("WebSocket connection established for audio streaming")

    try:
        while True:
            try:
                # Receive audio data from WebSocket (expecting raw PCM or Opus frames)
                data = await websocket.receive_bytes()

                # Convert bytes to numpy array for processing
                audio_array = np.frombuffer(data, dtype=np.float32)

                # Ensure we have enough audio data (at least 1 second)
                if len(audio_array) < 16000:  # Assuming 16kHz sample rate
                    await asyncio.sleep(0.1)
                    continue

                # Process audio in chunks
                try:
                    # Extract features directly from the stream
                    features = extract_features_from_stream(
                        audio_array, sample_rate=16000)
                    features = np.expand_dims(features, axis=0)
                    features = np.expand_dims(features, axis=2)

                    # Predict emotion
                    predictions = model.predict(features)[0]
                    predicted_emotion = emotion_labels[np.argmax(predictions)]

                    # Calculate stress level
                    probabilities = {emotion: float(pred) for emotion, pred in zip(
                        emotion_labels, predictions)}
                    stress_level = calculate_stress_level(probabilities)

                    # Send back the results
                    response = {
                        "emotion": predicted_emotion,
                        "stressLevel": stress_level,
                        "probabilities": probabilities,
                        "timestamp": datetime.utcnow().isoformat()
                    }
                    logging.info(response)

                    await websocket.send_json(response)

                except Exception as e:
                    logging.error(f"Audio processing error: {e}")
                    await websocket.send_json({"error": str(e)})

            except asyncio.CancelledError:
                logging.info("WebSocket connection cancelled")
                break

    except WebSocketDisconnect as e:
        logging.info(f"WebSocket disconnected: {e.code} - {e.reason}")
    except Exception as e:
        logging.error(f"WebSocket error: {e}")
    finally:
        try:
            await websocket.close()
        except:
            pass
        logging.info("WebSocket connection closed")


# Run the FastAPI app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
