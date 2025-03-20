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

export const AgoraProvider = ({ session_id }) => {

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

  // WebSocket connection management
  useEffect(() => {
    let reconnectTimeout;

    const connectWebSocket = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      wsRef.current = new WebSocket("ws://localhost:8000/ws");

      wsRef.current.onopen = () => {
        console.log("WebSocket connection established");
        if (remoteUsers.length > 0) {
          const initialUserId = remoteUsers[0].uid;
          wsRef.current.send(
            JSON.stringify({ userId: initialUserId, action: "start" })
          );
          console.log(`Sent initial userId: ${initialUserId}`);
        }
      };

      wsRef.current.onmessage = (event) => {
        if (typeof event.data === "string") {
          console.log("Received string message:", event.data);
        } else {
          const blob = new Blob([event.data], { type: "image/jpeg" });
          const url = URL.createObjectURL(blob);
          window.open(url, "_blank");
          remoteUsers.forEach((user) => {
            const img = processedRefs.current[user.uid];
            if (img) {
              img.onload = () => {
                URL.revokeObjectURL(url);
                console.log(`Image loaded for user ${user.uid} at ${url}`);
              };
              img.onerror = () => {
                console.error(
                  `Image failed to load for user ${user.uid} at ${url}`
                );
              };
              img.src = url;
              console.log(`Assigned URL to img: ${url}`);
            } else {
              console.warn(`No img element found for user ${user.uid}`);
              URL.revokeObjectURL(url); // Clean up if no img is available
            }
          });
        }
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket connection closed");
        if (remoteUsers.length > 0) {
          reconnectTimeout = setTimeout(connectWebSocket, 1000);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    if (remoteUsers.length > 0) {
      connectWebSocket();
    }

    return () => {
      clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [remoteUsers]);

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
                const ws = wsRef.current;
                if (
                  !ws ||
                  ws.readyState !== WebSocket.OPEN ||
                  !remoteUsers.some((u) => u.uid === user.uid) ||
                  !videoElement ||
                  !videoTrack.isPlaying
                ) {
                  console.log(
                    `User ${user.uid} not valid for capture: WS=${!!ws}, Open=${
                      ws?.readyState === WebSocket.OPEN
                    }, UserExists=${remoteUsers.some(
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

                const intervalId = setInterval(() => {
                  try {
                    if (
                      !wsRef.current ||
                      wsRef.current.readyState !== WebSocket.OPEN
                    ) {
                      console.log(
                        `WebSocket not available for User ${user.uid}`
                      );
                      clearInterval(frameIntervals.current[user.uid]);
                      delete frameIntervals.current[user.uid];
                      return;
                    }

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
                    const imageData = canvas.toDataURL("image/jpeg", 0.5);

                    wsRef.current.send(
                      JSON.stringify({
                        userId: user.uid,
                        frameData: imageData,
                        action: "frame",
                      })
                    );
                    console.log(`Sent frame data for User ${user.uid}`);
                  } catch (error) {
                    console.error(
                      `Frame capture error for User ${user.uid}:`,
                      error
                    );
                  }
                }, 33);

                frameIntervals.current[user.uid] = intervalId;
              };

              const checkVideoReady = (retries = 10) => {
                if (retries <= 0) {
                  console.error(`Max retries reached for User ${user.uid}`);
                  return;
                }
                if (
                  videoElement.readyState >= 2 &&
                  videoElement.videoWidth > 0 &&
                  wsRef.current?.readyState === WebSocket.OPEN
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
            audioTrack.play();
            console.log(`User ${user.uid} audio playback started`);
          } catch (error) {
            console.error(`Error playing audio for User ${user.uid}:`, error);
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

          // Notify backend that this user's stream has stopped
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({
                userId: user.uid,
                action: "stop",
              })
            );
            console.log(`Sent stop signal for User ${user.uid} to backend`);
          }
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
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              userId: userId,
              action: "stop",
            })
          );
        }
      });
    };
  }, [agoraClient, remoteUsers]);

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
                      if (ref) processedRefs.current[user.uid] = ref; // This is already correct
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
            />
            <input
              onChange={(e) => setChannel(e.target.value)}
              placeholder="<Your channel Name>"
              value={channel}
            />
            <input
              onChange={(e) => setToken(e.target.value)}
              placeholder="<Your token>"
              value={token}
            />
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
            onClick={() => setCalling((a) => !a)}
          >
            {calling ? (
              <i className="i-phone-hangup" />
            ) : (
              <i className="i-mdi-phone" />
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default AgoraProvider;
