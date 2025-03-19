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

export const AgoraProvider = () => {
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  const [appId, setAppId] = useState("b62636e82bae4d77a10929859b2d798f");
  const [channel, setChannel] = useState("TEST-001");
  const [token, setToken] = useState("");

  const agoraClient = useRTCClient();
  useJoin({ appid: appId, channel: channel, token: token ? token : null }, calling);

  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();
  const videoRefs = useRef({});
  const frameIntervals = useRef({});

  useEffect(() => {
    const handleUserPublished = async (user, mediaType) => {
      if (mediaType === "video") {
        console.log(`User ${user.uid} published video stream`);
        await agoraClient.subscribe(user, "video");
        const videoTrack = user.videoTrack;
        console.log(`User ${user.uid} videoTrack:`, videoTrack);

        if (videoTrack) {
          const videoElement = videoRefs.current[user.uid];
          console.log(`User ${user.uid} videoElement:`, videoElement);

          if (videoElement) {
            try {
              await videoTrack.play(videoElement);
              console.log(`User ${user.uid} video playback started`);

              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d");

              console.log(`User ${user.uid} video element canvas and context`, canvas, context);

              const startCapture = () => {
                canvas.width = videoElement.videoWidth || 640;
                canvas.height = videoElement.videoHeight || 480;

                console.log(`Started capturing frames for User ${user.uid} at ${canvas.width}x${canvas.height}`);
                const intervalId = setInterval(() => {
                  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                  const imageData = canvas.toDataURL("image/jpeg");
                  console.log(`Sending Frame Data for User ${user.uid}`, imageData);
                }, 33);
                frameIntervals.current[user.uid] = intervalId;
              };

              console.log(`User ${user.uid} video readyState: ${videoElement.readyState}`);
              if (videoElement.readyState >= 2) {
                console.log(`User ${user.uid} video is ready, starting capture immediately`);
                startCapture();
              } else {
                console.log(`User ${user.uid} waiting for metadata`);
                videoElement.onloadedmetadata = () => {
                  console.log(`User ${user.uid} metadata loaded, readyState: ${videoElement.readyState}`);
                  startCapture();
                };
              }
            } catch (error) {
              console.error(`Error processing video for User ${user.uid}:`, error);
            }
          }
        }
      } else if (mediaType === "audio") {
        console.log(`User ${user.uid} published audio stream`);
        await agoraClient.subscribe(user, "audio");
        const audioTrack = user.audioTrack;
        console.log(`User ${user.uid} audioTrack:`, audioTrack);

        if (audioTrack) {
          try {
            audioTrack.play(); // Play the audio track directly
            console.log(`User ${user.uid} audio playback started`);
          } catch (error) {
            console.error(`Error playing audio for User ${user.uid}:`, error);
          }
        }
      }
    };

    const handleUserUnpublished = (user, mediaType) => {
      if (mediaType === "video" && frameIntervals.current[user.uid]) {
        clearInterval(frameIntervals.current[user.uid]);
        delete frameIntervals.current[user.uid];
        console.log(`Stopped capturing frames for User ${user.uid}`);
      }
      if (mediaType === "audio") {
        console.log(`User ${user.uid} unpublished audio stream`);
        const audioTrack = user.audioTrack;
        if (audioTrack) {
          audioTrack.stop(); // Stop the audio track when unpublished
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
      });
    };
  }, [agoraClient]);

  return (
    <>
      <div className="room">
        {isConnected ? (
          <div className="user-list">
            <div className="user">
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
              <div className="user" key={user.uid}>
                <video
                  className="remort-user-video"
                  ref={(ref) => {
                    if (ref) {
                      videoRefs.current[user.uid] = ref;
                    }
                  }}
                  autoPlay
                  muted={false}
                  playsInline
                />
                <samp className="user-name">{user.uid}</samp>
              </div>
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
            {calling ? <i className="i-phone-hangup" /> : <i className="i-mdi-phone" />}
          </button>
        </div>
      )}
    </>
  );
};

export default AgoraProvider;
