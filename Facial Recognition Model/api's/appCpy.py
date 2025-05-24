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
import json
from fastapi import FastAPI, Request
from fastapi.responses import Response
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from aiortc import RTCPeerConnection, RTCSessionDescription
import logging
import time

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("webrtc-server")

# Load ML models
emotion_model = load_model("../stress_model/emotion_stress_model.h5")
face_detector = dlib.get_frontal_face_detector()
shape_predictor = dlib.shape_predictor("../pre models/shape_predictor_5_face_landmarks.dat")

# Constants
emotion_labels = ["Anger", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]
emotion_to_stress = {
    "Anger": 1.0, "Disgust": 0.7, "Fear": 0.9,
    "Happy": -0.5, "Neutral": 0.0, "Sad": 0.5, "Surprise": -0.2
}
decay_factor = 0.2
fps = 10
window_duration = 20
frames_per_window = fps * window_duration

class ConnectionState:
    def __init__(self):
        self.current_window_emotions = deque(maxlen=frames_per_window)
        self.current_stress_level = 0
        self.stress_levels = []
        self.window_emotions = []
        self.window_counter = 1

connection_states = {}

def decode_base64_frame(base64_string):
    try:
        img_data = base64.b64decode(base64_string.split(',')[1])
        np_arr = np.frombuffer(img_data, np.uint8)
        return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    except Exception as e:
        logger.error(f"Error decoding frame: {e}")
        return None

def process_frame(frame, state: ConnectionState):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_detector(gray, 1)

    for face in faces:
        landmarks = shape_predictor(gray, face)
        face_chip = dlib.get_face_chip(frame, landmarks, size=48, padding=0.25)
        face_gray = cv2.cvtColor(face_chip, cv2.COLOR_BGR2GRAY)
        face_gray = face_gray.astype("float32") / 255.0
        face_input = np.expand_dims(img_to_array(face_gray), axis=0)
        probs = emotion_model.predict(face_input)[0]
        dominant_emotion = emotion_labels[np.argmax(probs)]

        state.current_window_emotions.append(dominant_emotion)
        x, y, w, h = face.left(), face.top(), face.width(), face.height()
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        cv2.putText(frame, f"{dominant_emotion}", (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

    if len(state.current_window_emotions) == frames_per_window:
        emotion_counts = Counter(state.current_window_emotions)
        top_emotion = emotion_counts.most_common(1)[0][0]
        if top_emotion == "Neutral":
            if state.current_stress_level > 0:
                state.current_stress_level = max(0, state.current_stress_level - decay_factor)
            elif state.current_stress_level < 0:
                state.current_stress_level = min(0, state.current_stress_level + decay_factor)
        else:
            state.current_stress_level += emotion_to_stress[top_emotion]
        state.stress_levels.append(state.current_stress_level)
        state.window_emotions.append(top_emotion)
        state.current_window_emotions.clear()
        state.window_counter += 1

    return frame, state.current_stress_level

def generate_final_plots(stress_levels, window_emotions):
    stress_buf, emotion_buf = BytesIO(), BytesIO()

    plt.figure(figsize=(10, 6))
    plt.plot(stress_levels, marker='o', color='blue', label="Stress Level")
    plt.axhline(0, linestyle='--', color='gray', label='Neutral')
    plt.title("Stress Over Time From Facial Emotion Recognition")
    plt.xlabel("Time")
    plt.ylabel("Stress")
    plt.grid(True)
    plt.legend()
    plt.tight_layout()
    plt.savefig(stress_buf, format='png')
    plt.close()

    if window_emotions:
        plt.figure(figsize=(10, 6))
        indices = [emotion_labels.index(e) for e in window_emotions]
        plt.step(range(len(indices)), indices, color='red', where='mid', label="Emotions")
        plt.yticks(range(len(emotion_labels)), emotion_labels)
        plt.title("Emotion Changes From Facial Emotion Recognition")
        plt.xlabel("Time")
        plt.ylabel("Emotion")
        plt.grid(True)
        plt.legend()
        plt.tight_layout()
        plt.savefig(emotion_buf, format='png')
        plt.close()

    stress_buf.seek(0)
    emotion_buf.seek(0)
    return stress_buf.read(), emotion_buf.read()

class WebRTCServer:
    def __init__(self):
        self.peer_connection = None

    async def create_peer_connection(self, offer):
        pc = RTCPeerConnection()
        self.peer_connection = pc

        @pc.on("datachannel")
        def on_datachannel(channel):
            logger.info(f"✅ DataChannel opened: {channel.label}")

            @channel.on("message")
            async def on_message(message):
                try:
                    payload = json.loads(message)
                    uid = str(payload.get("userId"))  # 🔑 Normalize to string

                    logger.info(f"📥 Frame received for UID: {uid} (type: {type(uid)})")
                    logger.info(f"🗂️ Current keys in connection_states: {list(connection_states.keys())}")
                    base64_frame = payload.get("frameData")
                    if not uid or not base64_frame:
                        return

                    if uid not in connection_states:
                        connection_states[uid] = ConnectionState()
                        logger.info(f"👤 Initialized state for UID: {uid}")

                    frame = decode_base64_frame(base64_frame)
                    if frame is not None:
                        process_frame(frame, connection_states[uid])
                        logger.info(f"🧠 Frame processed for UID: {uid}")

                        # ✅ Send emotion/stress response back to frontend
                        current_state = connection_states[uid]
                        response = {
                            "userId": uid,
                            "emotion": current_state.window_emotions[
                                -1] if current_state.window_emotions else "Neutral",
                            "stressLevel": current_state.stress_levels[-1] if current_state.stress_levels else 0.0,
                            "windowCounter": current_state.window_counter
                        }

                        # Send only if channel is open
                        if channel.readyState == "open":
                            channel.send(json.dumps(response))
                            logger.info(f"📤 Sent emotion/stress response for UID {uid}: {response}")
                except Exception as e:
                    logger.error(f"❌ Error processing message: {e}")

        await pc.setRemoteDescription(RTCSessionDescription(**offer))
        answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        return pc.localDescription

# App setup
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

webrtc_server = WebRTCServer()

@app.post("/webrtc-offer")
async def handle_offer(request: Request):
    try:
        offer = await request.json()
        logger.info(f"🔧 Incoming offer: {offer}")
        answer = await webrtc_server.create_peer_connection(offer)
        return {"sdp": answer.sdp, "type": answer.type}
    except Exception as e:
        logger.error(f"Failed to handle offer: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/final_stress_plot/{uid}")
async def final_stress(uid: str):
    uid = str(uid)  # 🔑 Normalize
    logger.info(f"📊 Stress plot request for UID: {uid}")
    logger.info(f"🗂️ Current keys in connection_states: {list(connection_states.keys())}")

    if uid not in connection_states:
        return JSONResponse(content={"error": "No data found"}, status_code=404)

    stress_plot, _ = generate_final_plots(
        connection_states[uid].stress_levels, connection_states[uid].window_emotions
    )
    return Response(content=stress_plot, media_type="image/png")

@app.get("/final_emotion_plot/{uid}")
async def final_emotion(uid: str):
    uid = str(uid)  # 🔑 Normalize
    logger.info(f"📊 Emotion plot request for UID: {uid}")
    logger.info(f"🗂️ Current keys in connection_states: {list(connection_states.keys())}")

    if uid not in connection_states:
        return JSONResponse(content={"error": "No data found"}, status_code=404)

    _, emotion_plot = generate_final_plots(
        connection_states[uid].stress_levels, connection_states[uid].window_emotions
    )
    return Response(content=emotion_plot, media_type="image/png")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
