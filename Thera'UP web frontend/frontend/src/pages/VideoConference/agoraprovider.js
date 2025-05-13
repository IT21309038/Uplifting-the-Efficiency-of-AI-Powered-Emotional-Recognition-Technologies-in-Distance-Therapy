import {
  LocalUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
  useRTCClient,
} from "agora-rtc-react";
import React, { useState, useEffect, useRef } from "react";
import "../../styles/styles.css";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import * as faceapi from "face-api.js";

import { Line } from "react-chartjs-2";

import Grid from "@mui/material/Grid";
import { Grid2 } from "@mui/material";

import { playRemoteAudioTrack } from "../../utils/agoraUtils";
import apiDefinitions from "@/api/apiDefinitions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const audioBuffers = {}; // Store recorded chunks for each remote user

const loadModels = async () => {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  console.log("✅ FaceAPI models loaded");
};

export const AgoraProvider = ({
  session_id,
  patient_id,
  doctor_id,
  session_date,
  session_time,
}) => {
  const router = useRouter();
  const sessionID = session_id;
  const patientID = patient_id;
  const doctorID = doctor_id;
  const sessionDate = session_date;
  const sessionTime = session_time;
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  const [appId, setAppId] = useState("b62636e82bae4d77a10929859b2d798f");
  const [channel, setChannel] = useState(sessionID);
  const [token, setToken] = useState("");

  //graph data
  const [stressHistory, setStressHistory] = useState([]);
  const [emotionHistory, setEmotionHistory] = useState([]);

  const agoraClient = useRTCClient();
  useJoin(
    { appid: appId, channel: channel, token: token ? token : null },
    calling
  );

  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();
  const videoRefs = useRef({});
  const frameIntervals = useRef({});
  const wsRef = useRef(null);
  const processedRefs = useRef({}); // Fix the typo here

  //webrtc refs
  const peerConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);

  const audioRecorders = useRef({}); // Store active MediaRecorders
  const audioIntervals = useRef({}); // Store setIntervals for audio capture
  const emotionData1 = useRef([]); // Store detected emotions and stress levels
  const [sessionReport, setSessionReport] = useState(null); // Store session report
  const audioSockets = useRef({});
  const audioBuffers = useRef({}); // Store 15-second audio buffers
  const [audioEmotionHistory, setAudioEmotionHistory] = useState([]);

  const [audioClips, setAudioClips] = useState([]); // Store audio clips and responses

  //Report generation ref
  const reportGeneratedForUser = useRef(new Set());

  const fetchPlotAsBlob = async (uid, type) => {
    const response = await fetch(
      `http://localhost:8000/final_${type}_plot/${uid}`
    );
    if (!response.ok) throw new Error(`Failed to fetch ${type} plot`);
    return await response.blob(); // Returns image/png blob
  };

  //Report generation payload
  const payload = {
    patient_id: patientID,
    doctor_id: doctorID,
    session_date: sessionDate,
    session_time: sessionTime,
  };

  //Report generation
  const formDataFaceEmotion = new FormData();
  const formDataFaceStress = new FormData();
  const formDataAudioEmotion = new FormData();
  const formDataAudioStress = new FormData();

  const handleCreateFaceEmotionReport = (blob) => {
    formDataFaceEmotion.append(
      "report",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );

    formDataFaceEmotion.append("file", blob);

    apiDefinitions
      .crearteReport(formDataFaceEmotion)
      .then((response) => {
        if (response.status === 201) {
          console.log("Face Emotion report created successfully");
        } else {
          console.error("Failed to create Face Emotion report");
        }
      })
      .catch((error) => {
        console.error("Error creating Face Emotion report:", error);
      });
  };

  const handleCreateFaceStressReport = (blob) => {
    formDataFaceStress.append(
      "report",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );

    formDataFaceStress.append("file", blob);

    apiDefinitions
      .crearteReport(formDataFaceStress)
      .then((response) => {
        if (response.status === 201) {
          console.log("Face Stress report created successfully");
        } else {
          console.error("Failed to create Face Stress report");
        }
      })
      .catch((error) => {
        console.error("Error creating Face Stress report:", error);
      });
  };

  //WebRTC connection management
  const setupWebRTCConnection = async () => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // Public STUN server
    });

    // Create a data channel
    const dataChannel = peerConnection.createDataChannel("faceFramesChannel");

    dataChannel.onopen = () => {
      console.log("✅ WebRTC DataChannel open and ready for frames");
    };

    dataChannel.onclose = () => {
      console.log("❌ WebRTC DataChannel closed");
    };

    dataChannel.onerror = (error) => {
      console.error("❌ WebRTC DataChannel error:", error);
    };

    dataChannel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📥 Real-time Emotion/Stress from backend:", data);

        const timestamp = new Date().toISOString();

        setStressHistory((prev) => [
          ...prev,
          { timestamp, userId: data.userId, stress: data.stressLevel },
        ]);

        setEmotionHistory((prev) => [
          ...prev,
          { timestamp, userId: data.userId, emotion: data.emotion },
        ]);
      } catch (err) {
        console.error("❌ Failed to parse WebRTC message:", err);
      }
    };

    // Save to refs
    peerConnectionRef.current = peerConnection;
    dataChannelRef.current = dataChannel;

    // Connect to FastAPI's WebRTC endpoint (we'll build that later)

    // Create offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    console.log("🛰️ Sending offer to FastAPI server...");

    // Send offer to FastAPI backend
    const response = await fetch("http://localhost:8000/webrtc-offer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(offer),
    });

    const answer = await response.json();
    console.log("📡 Received answer from FastAPI server");

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  // Process remote audio streams
  const processRemoteAudio = async (user) => {
    try {
      await agoraClient.subscribe(user, "audio");
      const audioTrack = user.audioTrack;

      if (!audioTrack) {
        console.log(`No audio track for user ${user.uid}`);
        return;
      }

      // Constants for 15-second audio chunks
      const SAMPLE_RATE = 16000; // 16kHz
      const CHUNK_DURATION = 45; // seconds
      const TARGET_BUFFER_SIZE = SAMPLE_RATE * CHUNK_DURATION;
      const CHUNK_SIZE = 4096; // Processing chunk size

      // Initialize audio buffer for this user if it doesn't exist
      if (!audioBuffers.current[user.uid]) {
        audioBuffers.current[user.uid] = new Float32Array(TARGET_BUFFER_SIZE);
      }

      let bufferIndex = 0;

      console.log("Buffer state:", {
        bufferExists: !!audioBuffers.current[user.uid],
        bufferLength: audioBuffers.current[user.uid]?.length,
        bufferIndex,
      });

      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(
        new MediaStream([audioTrack.getMediaStreamTrack()])
      );

      const processor = audioContext.createScriptProcessor(CHUNK_SIZE, 1, 1);

      processor.onaudioprocess = (e) => {
        // Ensure buffer exists
        if (!audioBuffers.current[user.uid]) {
          console.error(`Audio buffer not initialized for user ${user.uid}`);
          return;
        }
        const audioData = e.inputBuffer.getChannelData(0);

        // Calculate remaining space in buffer
        const remainingSpace = TARGET_BUFFER_SIZE - bufferIndex;
        const samplesToCopy = Math.min(audioData.length, remainingSpace);

        // Copy audio data to buffer
        audioBuffers.current[user.uid].set(
          audioData.subarray(0, samplesToCopy),
          bufferIndex
        );
        bufferIndex += samplesToCopy;

        // When buffer is full (15 seconds collected)
        if (bufferIndex >= TARGET_BUFFER_SIZE) {
          const ws = audioSockets.current[user.uid];
          if (ws && ws.readyState === WebSocket.OPEN) {
            // Send the exact 15-second chunk
            ws.send(audioBuffers.current[user.uid].buffer);

            // Debug log
            console.log(`📤 Sent 15-second audio chunk for user ${user.uid}`, {
              samples: bufferIndex,
              duration: `${bufferIndex / SAMPLE_RATE} seconds`,
            });
          }

          // Reset buffer
          audioBuffers.current[user.uid] = new Float32Array(TARGET_BUFFER_SIZE);
          bufferIndex = 0;

          // If there's remaining audio data, add it to the new buffer
          if (samplesToCopy < audioData.length) {
            const remainingData = audioData.subarray(samplesToCopy);
            audioBuffers.current[user.uid].set(remainingData);
            bufferIndex = remainingData.length;
          }
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      // WebSocket connection
      const ws = new WebSocket(
        `ws://localhost:8001/ws/audio-stream?userId=${user.uid}`
      );
      audioSockets.current[user.uid] = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("🔊 Received analysis:", data);
          updateChart(data);
        } catch (error) {
          console.error("Error processing prediction:", error);
        }
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error for user ${user.uid}:`, error);
      };

      ws.onclose = () => {
        console.log(`WebSocket closed for user ${user.uid}`);
        cleanupRemoteAudio(user.uid);
      };

      console.log(`🎤 Started 15-sec audio streaming for user ${user.uid}`);
    } catch (error) {
      console.error(`Error processing audio for user ${user.uid}:`, error);
      cleanupRemoteAudio(user.uid);
    }
  };

  // Cleanup function
  const cleanupRemoteAudio = (userId) => {
    if (audioSockets.current[userId]) {
      audioSockets.current[userId].close();
      delete audioSockets.current[userId];
    }
    delete audioBuffers.current[userId];
  };

  useEffect(() => {
    const handleUserPublished = async (user, mediaType) => {
      if (mediaType === "video") {
        console.log(`User ${user.uid} published video stream`);
        await agoraClient.subscribe(user, "video");
        const videoTrack = user.videoTrack;

        if (videoTrack) {
          const videoElement = videoRefs.current[user.uid];

          if (videoElement) {
            try {
              await videoTrack.play(videoElement);
              console.log(`User ${user.uid} video playback started`);
              playRemoteAudioTrack(user, videoElement);

              // videoElement.muted = false; // Explicitly unmute after play
              // videoElement.volume = 1.0; // Ensure volume is max

              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d");
              if (!context) {
                console.error(
                  `Failed to get canvas context for User ${user.uid}`
                );
                return;
              }

              const startCapture = () => {
                if (
                  !remoteUsers.some((u) => u.uid === user.uid) ||
                  !videoElement ||
                  !videoTrack.isPlaying
                ) {
                  console.log(
                    `User ${
                      user.uid
                    } not valid for capture: UserExists=${remoteUsers.some(
                      (u) => u.uid === user.uid
                    )}, Video=${!!videoElement}, Playing=${
                      videoTrack.isPlaying
                    }`
                  );
                  return;
                }

                canvas.width = videoElement.videoWidth || 640;
                canvas.height = videoElement.videoHeight || 480;

                if (frameIntervals.current[user.uid]) {
                  clearInterval(frameIntervals.current[user.uid]);
                }

                const intervalId = setInterval(async () => {
                  try {
                    if (
                      videoElement.videoWidth === 0 ||
                      videoElement.videoHeight === 0
                    ) {
                      console.log(
                        `User ${user.uid} video dimensions not ready`
                      );
                      return;
                    }

                    context.drawImage(
                      videoElement,
                      0,
                      0,
                      canvas.width,
                      canvas.height
                    );

                    const detection = await faceapi.detectSingleFace(
                      videoElement,
                      new faceapi.TinyFaceDetectorOptions()
                    );

                    if (!detection) {
                      console.log(`😢 No face detected for user ${user.uid}`);
                      return;
                    }

                    const { x, y, width, height } = detection.box;

                    const faceCanvas = document.createElement("canvas");
                    faceCanvas.width = width;
                    faceCanvas.height = height;

                    const faceCtx = faceCanvas.getContext("2d");
                    faceCtx.drawImage(
                      canvas,
                      x,
                      y,
                      width,
                      height,
                      0,
                      0,
                      width,
                      height
                    );

                    const croppedDataUrl = faceCanvas.toDataURL(
                      "image/jpeg",
                      0.7
                    ); // Compressed

                    if (
                      dataChannelRef.current &&
                      dataChannelRef.current.readyState === "open"
                    ) {
                      const payload = {
                        userId: user.uid,
                        frameData: croppedDataUrl,
                        timestamp: Date.now(),
                      };
                      dataChannelRef.current.send(JSON.stringify(payload));
                      console.log(
                        `📤 Sent cropped frame via WebRTC for User ${user.uid}`
                      );
                    } else {
                      console.warn("❌ DataChannel not ready to send frame");
                    }
                  } catch (error) {
                    console.error(
                      `Frame capture error for User ${user.uid}:`,
                      error
                    );
                  }
                }, 300); // Roughly 3 frames per second for face detection

                frameIntervals.current[user.uid] = intervalId;
              };

              const checkVideoReady = (retries = 10) => {
                if (retries <= 0) {
                  console.error(`Max retries reached for User ${user.uid}`);
                  return;
                }
                if (
                  videoElement.readyState >= 2 &&
                  videoElement.videoWidth > 0
                  // wsRef.current?.readyState === WebSocket.OPEN
                ) {
                  console.log(`User ${user.uid} video ready, starting capture`);
                  startCapture();
                } else {
                  setTimeout(() => checkVideoReady(retries - 1), 100);
                }
              };

              videoElement.onloadedmetadata = () => {
                console.log(`User ${user.uid} metadata loaded`);
                checkVideoReady();
              };

              videoElement.onplaying = () => {
                // 👈 ADD THIS NEW LISTENER
                console.log(`User ${user.uid} started playing`);
                checkVideoReady();
              };

              if (videoElement.readyState >= 2) {
                checkVideoReady();
              }
            } catch (error) {
              console.error(
                `Error processing video for User ${user.uid}:`,
                error
              );
            }
          }
        }
      } else if (mediaType === "audio") {
        console.log(`User ${user.uid} published audio stream`);
        await processRemoteAudio(user);
        playRemoteAudioTrack(user);
      }
    };

    const handleUserUnpublished = async (user, mediaType) => {
      if (mediaType === "video") {
        if (frameIntervals.current[user.uid]) {
          clearInterval(frameIntervals.current[user.uid]);
          delete frameIntervals.current[user.uid];
          console.log(`Stopped capturing frames for User ${user.uid}`);
        }
      }
      if (mediaType === "audio") {
        cleanupRemoteAudio(user.uid);
      }
      // ✅ Prevent duplicate report generation
      if (reportGeneratedForUser.current.has(user.uid)) {
        console.log(
          `⛔ Reports already generated for user ${user.uid}, skipping.`
        );
        return;
      }

      // ✅ Only proceed for 'video' mediaType to reduce trigger risk
      if (mediaType !== "video") return;
      try {
        console.log(
          `📤 Remote user ${user.uid} left — fetching final plots...`
        );
        const [stressBlob, emotionBlob] = await Promise.all([
          fetchPlotAsBlob(String(user.uid), "stress"),
          fetchPlotAsBlob(String(user.uid), "emotion"),
        ]);

        console.log("📤 Generating reports...");
        handleCreateFaceEmotionReport(emotionBlob);
        handleCreateFaceStressReport(stressBlob);

        reportGeneratedForUser.current.add(user.uid);
        console.log(`✅ Reports created for user ${user.uid}`);
      } catch (err) {
        console.error("❌ Failed to fetch plots:", err);
      }
    };

    agoraClient.on("user-published", handleUserPublished);
    agoraClient.on("user-unpublished", handleUserUnpublished);

    return () => {
      agoraClient.off("user-published", handleUserPublished);
      agoraClient.off("user-unpublished", handleUserUnpublished);
      Object.keys(frameIntervals.current).forEach((userId) => {
        clearInterval(frameIntervals.current[userId]);
        delete frameIntervals.current[userId];
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agoraClient, remoteUsers]);

  // Hangup function
  const handleHangup = async () => {
    try {
      // Stop local tracks
      if (localMicrophoneTrack) {
        localMicrophoneTrack.stop();
        localMicrophoneTrack.close();
      }
      if (localCameraTrack) {
        localCameraTrack.stop();
        localCameraTrack.close();
      }

      // Stop and unsubscribe remote users if still connected
      if (agoraClient.connection?.state === "CONNECTED") {
        remoteUsers.forEach((user) => {
          if (user.audioTrack) user.audioTrack.stop();
          if (user.videoTrack) user.videoTrack.stop();

          try {
            agoraClient.unsubscribe(user);
          } catch (err) {
            console.warn(`⚠️ Unsubscribe failed for ${user.uid}:`, err.message);
          }
        });

        await agoraClient.leave(); // only after unsubscribing
      }

      // Clear intervals
      Object.keys(frameIntervals.current).forEach((userId) => {
        clearInterval(frameIntervals.current[userId]);
        delete frameIntervals.current[userId];
      });

      setCalling(false);
      router.push("/VideoConference");
    } catch (error) {
      console.error("Error during hangup:", error);
      setCalling(false);
      router.push("/VideoConference");
    }
  };

  const stressValues = {
    angry: 1.0,
    disgust: 0.7,
    fear: 0.9,
    sad: 0.5,
    neutral: 0.0,
    happy: -0.5,
    surprise: -0.2,
  };

  const calculateStress = (probabilities) => {
    if (!probabilities || typeof probabilities !== "object") {
      console.error("⚠️ Invalid probabilities object:", probabilities);
      return 0.0; // Default stress level if data is missing
    }
    let stressLevel = 0;
    let dominantEmotion = null;
    let maxProbability = 0;

    for (const [emotion, probability] of Object.entries(probabilities)) {
      if (probability > maxProbability) {
        maxProbability = probability;
        dominantEmotion = emotion;
      }
    }

    for (const [emotion, probability] of Object.entries(probabilities)) {
      const stressValue = stressValues[emotion] || 0;
      const weight = emotion === dominantEmotion ? 2 : 1;
      stressLevel += probability * stressValue * weight;
    }

    const minStress = -30;
    const maxStress = 90;
    const normalizedStress =
      ((stressLevel - minStress) / (maxStress - minStress)) * 100;

    return Math.min(100, Math.max(0, normalizedStress));
  };

  const calculateMovingAverage = (data, windowSize) => {
    if (data.length < windowSize) return null;

    const movingAverage =
      data.slice(-windowSize).reduce((sum, clip) => sum + clip.stressLevel, 0) /
      windowSize;

    return movingAverage;
  };

  const movingAverages = audioClips.map((_, index) =>
    calculateMovingAverage(audioClips.slice(0, index + 1), 5)
  );

  const webRTCStarted = useRef(false);

  useEffect(() => {
    loadModels();

    if (calling && isConnected && !webRTCStarted.current) {
      webRTCStarted.current = true;
      setupWebRTCConnection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calling, isConnected]);

  const emotionLabels = [
    "Anger",
    "Disgust",
    "Fear",
    "Happy",
    "Neutral",
    "Sad",
    "Surprise",
  ];

  // Prepare two datasets based on stressHistory
  const positiveStressData = stressHistory.map((entry) =>
    entry.stress >= 0 ? entry.stress : null
  );
  const negativeStressData = stressHistory.map((entry) =>
    entry.stress < 0 ? entry.stress : null
  );

  const stressData = {
    labels: stressHistory.map((entry) =>
      new Date(entry.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    ),
    datasets: [
      {
        label: "Positive Stress",
        data: positiveStressData,
        borderColor: "#ff4d4d", // red
        backgroundColor: "rgba(255, 77, 77, 0.2)",
        tension: 0.4,
        spanGaps: true, // allow skipping nulls
      },
      {
        label: "Negative Stress",
        data: negativeStressData,
        borderColor: "#00cc66", // green
        backgroundColor: "rgba(0, 204, 102, 0.2)",
        tension: 0.4,
        spanGaps: true, // allow skipping nulls
      },
    ],
  };

  const stressValuesArray = stressHistory.map((entry) => entry.stress);

  // If no data yet, fallback to default
  const minStress =
    stressValuesArray.length > 0 ? Math.min(...stressValuesArray) : -1;
  const maxStress =
    stressValuesArray.length > 0 ? Math.max(...stressValuesArray) : 1.2;

  // Add some headroom (padding)
  const padding = 0.2; // add 0.2 up and down
  const dynamicMin = minStress - padding;
  const dynamicMax = maxStress + padding;

  const stressOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Stress Level Over Time" },
      legend: {
        display: true,
        position: "top",
      },
      animation: {
        duration: 500,
        easing: "easeOutQuart",
      },
    },
    scales: {
      y: {
        min: dynamicMin,
        max: dynamicMax,
        ticks: {
          stepSize: (dynamicMax - dynamicMin) / 10, // 10 steps dynamically
          callback: function (value) {
            return value.toFixed(1);
          },
        },
        title: {
          display: true,
          text: "Stress Level",
        },
      },
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
    },
  };

  const emotionData = {
    labels: emotionHistory.map((entry) =>
      new Date(entry.timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Emotion",
        data: emotionHistory.map((entry) =>
          emotionLabels.indexOf(entry.emotion)
        ),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        stepped: true,
        tension: 0.1,
      },
    ],
  };

  const emotionOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Emotion Over Time" },
    },
    scales: {
      y: {
        ticks: {
          callback: (val) => emotionLabels[val] ?? "",
        },
        stepSize: 1,
        min: 0,
        max: emotionLabels.length - 1,
      },
    },
  };

  const chartData = {
    labels: audioClips.map((clip) => {
      const localTime = new Date(clip.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      return localTime; // Use formatted local time instead of raw timestamp
    }),
    datasets: [
      {
        label: "Stress Level",
        data: audioClips.map((clip) => clip.stressLevel),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
      {
        label: "Average Stress Level (Last 5 Clips)",
        data: movingAverages,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Stress Levels Over Time",
      },
    },
    scales: {
      x: {
        type: "category",
        ticks: {
          autoSkip: false,
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  const updateChart = (response) => {
    if (!response) return;

    try {
      const stressLevel = response.stressLevel ?? 0.0; // Use server-provided stress level
      const timestamp = response.timestamp || new Date().toISOString(); // Use server timestamp or fallback to now
      const emotion = response.emotion ?? "neutral"; // Emotion if needed

      setAudioClips((prev) => [
        ...prev,
        {
          stressLevel,
          timestamp,
          emotion,
          probabilities: response.probabilities || {},
        },
      ]);
      setAudioEmotionHistory((prev) => [...prev, { timestamp, emotion }]);

      // Optionally, you can store emotionData.current[] also here if you need
      emotionData1.current.push({
        timestamp: timestamp,
        emotion: emotion,
        stress_level: stressLevel,
      });
    } catch (error) {
      console.error("⚠️ Error updating chart with response:", error);
    }
  };

  const audioEmotionLabels = [
    "neutral",
    "calm",
    "happy",
    "sad",
    "angry",
    "fear",
    "disgust",
    "surprise",
  ];

  const audioEmotionData = {
    labels: audioEmotionHistory.map((entry) =>
      new Date(entry.timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Detected Audio Emotion",
        data: audioEmotionHistory.map((entry) =>
          audioEmotionLabels.indexOf(entry.emotion)
        ),
        borderColor: "rgba(255, 165, 0, 1)", // orange line
        backgroundColor: "rgba(255, 165, 0, 0.2)",
        stepped: true,
        tension: 0.1,
      },
    ],
  };

  const audioEmotionOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Audio Emotion Over Time" },
    },
    scales: {
      y: {
        ticks: {
          callback: (val) => audioEmotionLabels[val] ?? "",
        },
        stepSize: 1,
        min: 0,
        max: audioEmotionLabels.length - 1,
      },
    },
  };
  return (
    <>
      {isConnected ? (
        <Grid2 container spacing={2}>
          <Grid2 size={7}>
            <Grid2
              container
              spacing={2}
              sx={{ display: "flex", flexDirection: "row" }}
            >
              <Grid2 size={12}>
                <Grid2 container spacing={2}>
                  <Grid2 size={3} sx={{ height: "200px" }}>
                    <LocalUser
                      audioTrack={localMicrophoneTrack}
                      cameraOn={cameraOn}
                      micOn={micOn}
                      videoTrack={localCameraTrack}
                      cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
                    >
                      <samp className="user-name">You</samp>
                    </LocalUser>
                  </Grid2>
                  <Grid2
                    size={9}
                    sx={{
                      height: "430px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {remoteUsers.map((user) => (
                      <video
                        key={user.uid}
                        ref={(ref) => {
                          if (ref) videoRefs.current[user.uid] = ref;
                        }}
                        autoPlay
                        muted={false}
                        playsInline
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover", // or "contain" depending on your preference
                          display: "block",
                        }}
                      />
                    ))}
                  </Grid2>
                </Grid2>
              </Grid2>
              <Grid2 size={12} sx={{ height: "70px" }}>
                <div className="control">
                  <div className="left-control">
                    <button className="btn" onClick={() => setMic((a) => !a)}>
                      <i className={`i-microphone ${!micOn ? "off" : ""}`} />
                    </button>
                    <button
                      className="btn"
                      onClick={() => setCamera((a) => !a)}
                    >
                      <i className={`i-camera ${!cameraOn ? "off" : ""}`} />
                    </button>
                  </div>
                  <button
                    className={`btn btn-phone ${
                      calling ? "btn-phone-active" : ""
                    }`}
                    onClick={() => {
                      if (calling) {
                        handleHangup(); // Call hangup function
                        // generateSessionReport();
                      } else {
                        setCalling(true); // Join call
                      }
                    }}
                  >
                    {calling ? (
                      <i className="i-phone-hangup" />
                    ) : (
                      <i className="i-mdi-phone" />
                    )}
                  </button>
                </div>
              </Grid2>
            </Grid2>
          </Grid2>
          <Grid2 size={5}>
            <Grid2
              container
              spacing={2}
              sx={{ display: "flex", flexDirection: "row" }}
            >
              <Grid2 size={12} sx={{ height: "250px" }}>
                <Line data={emotionData} options={emotionOptions} />
              </Grid2>
              <Grid2 size={12} sx={{ height: "250px" }}>
                <Line data={stressData} options={stressOptions} />
              </Grid2>
            </Grid2>
          </Grid2>
          <Grid2 size={6} sx={{ height: "400px", pb: 5 }}>
            <Line data={chartData} options={chartOptions} />
          </Grid2>
          <Grid2 size={6} sx={{ height: "400px", pb: 5 }}>
            <Line data={audioEmotionData} options={audioEmotionOptions} />
          </Grid2>
          <Grid2 size={6} sx={{ height: "10px", pb: 5 }}></Grid2>
          <Grid2 size={6} sx={{ height: "10px", pb: 5 }}></Grid2>
        </Grid2>
      ) : (
        <Grid2 container spacing={2}>
          <Grid2
            size={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="join-room">
              <input
                onChange={(e) => setAppId(e.target.value)}
                placeholder="<Your app ID>"
                value={appId}
                disabled
              />
              <input
                onChange={(e) => setChannel(e.target.value)}
                placeholder="<Your channel Name>"
                value={channel}
                disabled
              />
              <button
                className={`join-channel ${
                  !appId || !channel ? "disabled" : ""
                }`}
                disabled={!appId || !channel}
                onClick={() => setCalling(true)}
              >
                <span>Join Channel</span>
              </button>
            </div>
          </Grid2>
        </Grid2>
      )}
    </>
  );
};

// Inline styles for the report UI
const styles = {
  container: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "20px auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    height: "200px",
    marginBottom: "200px",
  },
  title: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#333",
  },
  report: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "5px",
    boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
    fontFamily: "monospace",
    whiteSpace: "pre-wrap",
    maxHeight: "300px",
    overflowY: "auto",
  },
  buttonContainer: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default AgoraProvider;
