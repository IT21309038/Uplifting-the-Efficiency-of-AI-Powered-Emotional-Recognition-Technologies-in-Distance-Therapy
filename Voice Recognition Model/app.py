import logging
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import uvicorn
import numpy as np
import tensorflow as tf
from keras.models import load_model
import librosa
from librosa.effects import preemphasis
from fastapi.middleware.cors import CORSMiddleware

# Load the saved model
model = load_model("emotion_recognition_model.h5")

# Define a FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific domains for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    file_path: str


# Define emotion labels (modify if needed based on your model's output)
emotion_labels = ['neutral', 'calm', 'happy',
                  'sad', 'angry', 'fear', 'disgust', 'surprise']

# Audio feature extraction function
logging.basicConfig(level=logging.INFO)


def reduce_noise(audio, sample_rate):
    """
    Perform basic noise reduction on the audio using spectral gating.
    """
    try:
        # Apply a pre-emphasis filter to enhance signal-to-noise ratio
        audio = preemphasis(audio)

        # Perform spectral gating for noise reduction
        stft = librosa.stft(audio)
        magnitude, phase = librosa.magphase(stft)

        # Estimate noise profile
        noise_profile = np.median(magnitude, axis=1, keepdims=True)

        # Reduce noise
        threshold = 1.5 * noise_profile
        reduced_magnitude = np.maximum(0, magnitude - threshold)

        # Reconstruct the signal
        reduced_stft = reduced_magnitude * phase
        reduced_audio = librosa.istft(reduced_stft)

        return reduced_audio
    except Exception as e:
        logging.error(f"Noise reduction error: {e}")
        raise


def extract_features(file_path):
    try:
        logging.info(f"Loading audio from: {file_path}")

        # Attempt to load the audio file
        data, sample_rate = librosa.load(file_path, duration=2.5, offset=0.6)
        logging.info(
            f"Audio loaded successfully. Samples: {len(data)}, Sample Rate: {sample_rate}")

        # Check for silent or insufficient data
        if len(data) < sample_rate * 0.5:  # Less than 0.5 seconds of audio
            raise ValueError("Audio is too short.")
        if np.max(np.abs(data)) < 0.001:  # Silence threshold
            raise ValueError("Audio is silent.")

        logging.info("Starting noise reduction")
        data = reduce_noise(data, sample_rate)
        logging.info("Noise reduction completed")

        logging.info("Starting feature extraction")

        # Feature extraction
        result = np.array([])
        zcr = np.mean(librosa.feature.zero_crossing_rate(y=data).T, axis=0)
        result = np.hstack((result, zcr))
        chroma_stft = np.mean(librosa.feature.chroma_stft(
            S=np.abs(librosa.stft(data)), sr=sample_rate).T, axis=0)
        result = np.hstack((result, chroma_stft))
        mfcc = np.mean(librosa.feature.mfcc(y=data, sr=sample_rate).T, axis=0)
        result = np.hstack((result, mfcc))
        rms = np.mean(librosa.feature.rms(y=data).T, axis=0)
        result = np.hstack((result, rms))
        mel = np.mean(librosa.feature.melspectrogram(
            y=data, sr=sample_rate).T, axis=0)
        result = np.hstack((result, mel))

        logging.info(
            f"Feature extraction completed successfully. Feature vector shape: {result.shape}")
        return result
    except Exception as e:
        logging.error(f"Feature extraction error: {e}")
        raise


@app.post("/predict/")
async def predict_emotion(file: UploadFile = File(...)):
    try:
        # Save the uploaded file
        temp_file = f"temp_{file.filename}"
        with open(temp_file, "wb") as buffer:
            file_content = await file.read()
            buffer.write(file_content)
        logging.info(
            f"File saved successfully: {temp_file} (size: {len(file_content)} bytes)")

        # Extract features
        features = extract_features(temp_file)
        features = np.expand_dims(features, axis=0)  # Add batch dimension
        features = np.expand_dims(features, axis=2)  # Add channel dimension

        # Predict
        predictions = model.predict(features)[0]
        predicted_emotion = emotion_labels[np.argmax(predictions)]

        # Clean up temporary file
        import os
        os.remove(temp_file)

        # Format response
        probabilities = {emotion: float(pred) for emotion, pred in zip(
            emotion_labels, predictions)}
        return {"predicted_emotion": predicted_emotion, "probabilities": probabilities}

    except Exception as e:
        logging.error(f"Prediction error: {e}")
        return {"error": f"Failed to process audio: {e}"}


# Run the app
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
