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

export const AgoraProvider = ({ session_id }) => {
  const router = useRouter();
  const sessionID = session_id;
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  const [appId, setAppId] = useState("b62636e82bae4d77a10929859b2d798f");
  const [channel, setChannel] = useState(sessionID);
  const [token, setToken] = useState("");

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
  const emotionData = useRef([]); // Store detected emotions and stress levels
  const [sessionReport, setSessionReport] = useState(null); // Store session report

  const [audioClips, setAudioClips] = useState([]); // Store audio clips and responses

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
    
        // Update your chart or session state
        updateChart({
          predicted_emotion: data.emotion,
          stressLevel: data.stressLevel,
          probabilities: {}, // optional, structure compatibility
        });
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
      body: JSON.stringify({ offer: offer }),
    });

    const answer = await response.json();
    console.log("📡 Received answer from FastAPI server");

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  // WebSocket connection management
  // useEffect(() => {
  //   let reconnectTimeout;

  //   const connectWebSocket = () => {
  //     if (wsRef.current?.readyState === WebSocket.OPEN) return;

  //     wsRef.current = new WebSocket("ws://localhost:8000/ws");

  //     wsRef.current.onopen = () => {
  //       console.log("WebSocket connection established");
  //       if (remoteUsers.length > 0) {
  //         const initialUserId = remoteUsers[0].uid;
  //         wsRef.current.send(
  //           JSON.stringify({ userId: initialUserId, action: "start" })
  //         );
  //         console.log(`Sent initial userId: ${initialUserId}`);
  //       }
  //     };

  //     wsRef.current.onmessage = (event) => {
  //       if (typeof event.data === "string") {
  //         console.log("Received string message:", event.data);
  //       } else {
  //         const blob = new Blob([event.data], { type: "image/jpeg" });
  //         const url = URL.createObjectURL(blob);
  //         window.open(url, "_blank");
  //         remoteUsers.forEach((user) => {
  //           const img = processedRefs.current[user.uid];
  //           if (img) {
  //             img.onload = () => {
  //               URL.revokeObjectURL(url);
  //               console.log(`Image loaded for user ${user.uid} at ${url}`);
  //             };
  //             img.onerror = () => {
  //               console.error(
  //                 `Image failed to load for user ${user.uid} at ${url}`
  //               );
  //             };
  //             img.src = url;
  //             console.log(`Assigned URL to img: ${url}`);
  //           } else {
  //             console.warn(`No img element found for user ${user.uid}`);
  //             URL.revokeObjectURL(url); // Clean up if no img is available
  //           }
  //         });
  //       }
  //     };

  //     wsRef.current.onclose = () => {
  //       console.log("WebSocket connection closed");
  //       if (remoteUsers.length > 0) {
  //         reconnectTimeout = setTimeout(connectWebSocket, 1000);
  //       }
  //     };

  //     wsRef.current.onerror = (error) => {
  //       console.error("WebSocket error:", error);
  //     };
  //   };

  //   if (remoteUsers.length > 0) {
  //     connectWebSocket();
  //   }

  //   return () => {
  //     clearTimeout(reconnectTimeout);
  //     if (wsRef.current) {
  //       wsRef.current.close();
  //       wsRef.current = null;
  //     }
  //   };
  // }, [remoteUsers]);

  // Frame capture and media handling
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
        await agoraClient.subscribe(user, "audio");
        const audioTrack = user.audioTrack;
        if (audioTrack) {
          try {
            console.log(`🔊 Remote User ${user.uid} audio track detected`);
            audioTrack.play(); // Ensures track is active

            // ✅ Log track details
            console.log(
              `🔍 Track readyState: ${
                audioTrack.getMediaStreamTrack().readyState
              }`
            );

            // ✅ Create a MediaStream from the Agora remote audio track
            const stream = new MediaStream([audioTrack.getMediaStreamTrack()]);
            console.log("✅ Created MediaStream for audio recording", stream);

            const mediaRecorder = new MediaRecorder(stream, {
              mimeType: "audio/webm;codecs=opus",
            });

            audioBuffers[user.uid] = []; // Store recorded chunks per user

            try {
              console.log(`🎤 Starting MediaRecorder for User ${user.uid}...`);

              mediaRecorder.start();
              console.log(`🎥 MediaRecorder state: ${mediaRecorder.state}`);
            } catch (error) {
              console.error(
                `❌ Failed to start MediaRecorder for User ${user.uid}:`,
                error
              );
            }

            mediaRecorder.ondataavailable = async (event) => {
              if (event.data.size > 0) {
                console.log(`✅ Received audio chunk from User ${user.uid}`);
                audioBuffers[user.uid].push(event.data);
              }
            };
            console.log("aaaaa");
            // ✅ Send audio to API every 10 seconds
            // audioIntervals[user.uid] = setInterval(async () => {
            //   console.log(
            //     `🛑 Stopping MediaRecorder for User ${user.uid} to finalize WebM file.`
            //   );

            //   mediaRecorder.stop();
            //   setTimeout(async () => {
            //     console.log(
            //       `🔄 Restarting MediaRecorder for User ${user.uid}...`
            //     );
            //     mediaRecorder.start();
            //   }, 500);
            //   console.log("hhhhhhhh");
            //   if (audioBuffers[user.uid].length > 0) {
            //     const webmBlob = new Blob(audioBuffers[user.uid], {
            //       type: "audio/webm",
            //     });

            //     // ✅ Convert WebM to WAV
            //     const wavBlob = await convertWebMtoWAV(webmBlob);

            //     // ✅ Send to API
            //     await sendAudioToAPI(wavBlob, user.uid);

            //     // ✅ Clear buffer after sending
            //     audioBuffers[user.uid] = [];
            //   }
            // }, 10000);

            audioIntervals[user.uid] = setInterval(async () => {
              if (mediaRecorder.state === "recording") {
                console.log(
                  `🛑 Stopping MediaRecorder for User ${user.uid} to finalize WebM file.`
                );

                mediaRecorder.stop(); // Stop ensures WebM file is finalized

                mediaRecorder.onstop = async () => {
                  console.log(
                    `✅ MediaRecorder stopped for User ${user.uid}, processing audio...`
                  );

                  if (audioBuffers[user.uid].length > 0) {
                    const webmBlob = new Blob(audioBuffers[user.uid], {
                      type: "audio/webm",
                    });

                    // ✅ Convert WebM to WAV
                    const wavBlob = await convertWebMtoWAV(webmBlob);

                    // ✅ Send to API
                    await sendAudioToAPI(wavBlob, user.uid);

                    // ✅ Clear buffer after sending
                    audioBuffers[user.uid] = [];
                  }

                  setTimeout(() => {
                    console.log(
                      `🔄 Restarting MediaRecorder for User ${user.uid}...`
                    );
                    try {
                      mediaRecorder.start();
                      console.log(
                        `🎥 MediaRecorder state: ${mediaRecorder.state}`
                      );
                    } catch (error) {
                      console.error(
                        `❌ Failed to start MediaRecorder for User ${user.uid}:`,
                        error
                      );
                    }
                  }, 500);
                };
              }
            }, 15000);

            // ✅ Manually trigger `ondataavailable`
            setInterval(() => {
              if (mediaRecorder.state === "recording") {
                // ✅ Check if recording
                console.log(
                  `🔄 Forcing ondataavailable for User ${user.uid}...`
                );
                mediaRecorder.requestData();
              } else {
                console.warn(
                  `⚠️ MediaRecorder is in '${mediaRecorder.state}' state, skipping requestData()`
                );
              }
            }, 3000);

            mediaRecorder.ondataavailable = async (event) => {
              if (event.data.size > 0) {
                console.log(`✅ Received audio chunk from User ${user.uid}`);
                audioBuffers[user.uid].push(event.data);
              }
            };
          } catch (error) {
            console.error(
              `❌ Error processing audio for User ${user.uid}:`,
              error
            );
          }
        }
      }
    };

    const handleUserUnpublished = (user, mediaType) => {
      if (mediaType === "video") {
        if (frameIntervals.current[user.uid]) {
          clearInterval(frameIntervals.current[user.uid]);
          delete frameIntervals.current[user.uid];
          console.log(`Stopped capturing frames for User ${user.uid}`);

          // // Notify backend that this user's stream has stopped
          // if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          //   wsRef.current.send(
          //     JSON.stringify({
          //       userId: user.uid,
          //       action: "stop",
          //     })
          //   );
          //   console.log(`Sent stop signal for User ${user.uid} to backend`);
          // }
        }
      }
      if (mediaType === "audio") {
        console.log(`User ${user.uid} unpublished audio stream`);
        const audioTrack = user.audioTrack;
        if (audioTrack) {
          audioTrack.stop();
          console.log(`User ${user.uid} audio playback stopped`);
        }
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
        // if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        //   wsRef.current.send(
        //     JSON.stringify({
        //       userId: userId,
        //       action: "stop",
        //     })
        //   );
        // }
      });
    };
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

      // Stop remote tracks and unsubscribe
      remoteUsers.forEach((user) => {
        if (user.audioTrack) user.audioTrack.stop();
        if (user.videoTrack) user.videoTrack.stop();
        agoraClient.unsubscribe(user);
      });

      // Clear frame intervals
      Object.keys(frameIntervals.current).forEach((userId) => {
        clearInterval(frameIntervals.current[userId]);
        delete frameIntervals.current[userId];
      });

      // Close WebSocket and send stop signal
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            userId: remoteUsers[0]?.uid || "unknown",
            action: "stop",
          })
        );
        wsRef.current.close();
        wsRef.current = null;
      }

      // Leave the Agora channel
      await agoraClient.leave();

      // Update calling state
      setCalling(false);

      // Navigate to the specific page
      router.push("/VideoConference"); // Replace with your target page
    } catch (error) {
      console.error("Error during hangup:", error);
      // Still attempt navigation even if cleanup fails
      setCalling(false);
      router.push("/VideoConference");
    }
  };

  const stressValues = {
    angry: 90,
    calm: -20,
    disgust: 70,
    fear: 75,
    happy: -30,
    neutral: 0,
    sad: 60,
    surprise: -5,
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
    const stressLevel = response.stressLevel ?? calculateStress(response.probabilities);
    const timestamp = new Date().toISOString();
  
    setAudioClips((prev) => [...prev, { response, stressLevel, timestamp }]);
  
    if (response && !response.error) {
      emotionData.current.push({
        timestamp,
        emotion: response.predicted_emotion || response.emotion,
        stress_level: stressLevel,
      });
    }
  };
  

  const generateSessionReport = async () => {
    if (emotionData.current.length === 0) return;

    const requestData = {
      session_id: "TEST-001",
      data: emotionData.current,
    };

    console.log("oooooo", JSON.stringify(requestData));
    try {
      const response = await fetch(
        "http://127.0.0.1:8001/generate-session-report/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        const report = await response.json();
        setSessionReport(report.report);
        console.log("✅ Session Report:", report.report);
      } else {
        console.error("❌ Failed to generate session report");
      }
    } catch (error) {
      console.error("❌ Error connecting to session report API:", error);
    }
  };

  async function sendAudioToAPI(wavBlob, userId) {
    try {
      const formData = new FormData();
      formData.append("file", wavBlob, `audio_${userId}.wav`);

      console.log(`🚀 Sending WAV to FastAPI for Remote User ${userId}...`);

      const response = await fetch("http://127.0.0.1:8001/predict/", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      updateChart(result);
      console.log(`✅ Emotion Prediction for User ${userId}:`, result);
    } catch (error) {
      console.error(`❌ Error sending audio for User ${userId}:`, error);
    }
  }

  async function convertWebMtoWAV(webmBlob) {
    console.log("eeeeeeeeeeeeee");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(webmBlob);

      reader.onloadend = async () => {
        try {
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();

          const arrayBuffer = reader.result;

          if (!arrayBuffer || arrayBuffer.byteLength < 1000) {
            reject("⚠️ WebM file is empty or corrupt!");
            return;
          }

          // ✅ Decode WebM to AudioBuffer
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          console.log("✅ Successfully decoded WebM audio");

          // ✅ Convert AudioBuffer to WAV
          const wavBuffer = AudioBufferToWav(audioBuffer);
          const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });

          console.log("🎤 Converted WAV File Size:", wavBlob.size);

          if (wavBlob.size < 1000) {
            reject("⚠️ Converted WAV file is empty!");
            return;
          }

          resolve(wavBlob);
        } catch (error) {
          reject("❌ Error decoding WebM audio: " + error.message);
        }
      };

      reader.onerror = reject;
    });
  }

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(sessionReport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "session_report.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(sessionReport, null, 2));
    alert("📋 Session report copied to clipboard!");
  };

  const webRTCStarted = useRef(false);

  useEffect(() => {
    loadModels();

    if (calling && isConnected && !webRTCStarted.current) {
      webRTCStarted.current = true;
      setupWebRTCConnection();
    }
  }, [calling, isConnected]);

  return (
    <>
      <div className="room">
        {isConnected ? (
          <div className="user-list">
            <div className="user" style={{ width: "250px", height: "400px" }}>
              <LocalUser
                audioTrack={localMicrophoneTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                videoTrack={localCameraTrack}
                cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
              >
                <samp className="user-name">You</samp>
              </LocalUser>
            </div>
            {remoteUsers.map((user) => (
              <>
                <div className="user" key={user.uid}>
                  <video
                    style={{ width: "105% ", height: "175%" }}
                    ref={(ref) => {
                      if (ref) videoRefs.current[user.uid] = ref;
                    }}
                    autoPlay
                    muted={false}
                    playsInline
                  />
                  <samp className="user-name">{user.uid}</samp>
                </div>
                <div className="user" key={user.uid}>
                  <Image
                    ref={(ref) => {
                      processedRefs.current[user.uid] = ref; // This is already correct
                    }}
                    alt={`Processed frame for ${user.uid}`}
                    style={{
                      width: "240%",
                      height: "130%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </>
            ))}
          </div>
        ) : (
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
            {/* <input
                              onChange={(e) => setToken(e.target.value)}
                              placeholder="<Your token>"
                              value={token}
                              disabled
                            /> */}
            <button
              className={`join-channel ${!appId || !channel ? "disabled" : ""}`}
              disabled={!appId || !channel}
              onClick={() => setCalling(true)}
            >
              <span>Join Channel</span>
            </button>
          </div>
        )}
      </div>
      {isConnected && (
        <div className="control">
          <div className="left-control">
            <button className="btn" onClick={() => setMic((a) => !a)}>
              <i className={`i-microphone ${!micOn ? "off" : ""}`} />
            </button>
            <button className="btn" onClick={() => setCamera((a) => !a)}>
              <i className={`i-camera ${!cameraOn ? "off" : ""}`} />
            </button>
          </div>
          <button
            className={`btn btn-phone ${calling ? "btn-phone-active" : ""}`}
            onClick={() => {
              if (calling) {
                handleHangup(); // Call hangup function
                generateSessionReport();
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
      )}
      {isConnected && (
        <div style={{ width: "100%", height: "400px", marginTop: "100px" }}>
          <h2>📊Vocal Stress Level Graph</h2>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      {!isConnected && sessionReport !== null && (
        <div style={styles.container}>
          <h2 style={styles.title}>📄 Session Report</h2>
          <pre style={styles.report}>
            {JSON.stringify(sessionReport, null, 2)}
          </pre>

          <div style={styles.buttonContainer}>
            <button style={styles.button} onClick={handleCopy}>
              📋 Copy
            </button>
            <button style={styles.button} onClick={handleDownload}>
              ⬇️ Download
            </button>
          </div>
        </div>
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
