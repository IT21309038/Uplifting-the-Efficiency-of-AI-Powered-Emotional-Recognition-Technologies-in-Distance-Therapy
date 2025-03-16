import { Card, CardContent, Grid2, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import JitsiMeeting from "@/components/extras/JitsiMeeting";

const VideoConference = () => {
  const [roomName, setRoomName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [processedStreamUrl, setProcessedStreamUrl] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    let frameBuffer = [];
    const connectWebSocket = () => {
      wsRef.current = new WebSocket("ws://localhost:8000/ws");
      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        frameBuffer.forEach((frame) => wsRef.current.send(frame));
        frameBuffer = [];
      };
      wsRef.current.onmessage = (event) => {
        if (typeof event.data === "string") {
          console.log("Connection ID received:", event.data);
        } else {
          console.log("Received processed frame from backend");
          const blob = new Blob([event.data], { type: "image/jpeg" });
          setProcessedStreamUrl(URL.createObjectURL(blob));
        }
      };
      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setTimeout(connectWebSocket, 1000);
      };
      wsRef.current.onclose = () => console.log("WebSocket closed");
    };
    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomName = urlParams.get("session_id");
    const patientName = urlParams.get("patient_name");
    console.log(
      "Parsed URL params - session_id:",
      roomName,
      "patient_name:",
      patientName
    );
    setRoomName(roomName);
    setPatientName(patientName);
  }, []);

  const handleVideoTrackReceived = (videoTrack) => {
    console.log("Received remote video track:", videoTrack);
    const stream = new MediaStream([videoTrack]);
    const videoElement = document.createElement("video");
    videoElement.srcObject = stream;
    videoElement.autoplay = true;
    videoElement.style.display = "none";
    document.body.appendChild(videoElement);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 640;
    canvas.height = 480;

    let lastSent = 0;
    function captureFrame() {
      const now = Date.now();
      if (now - lastSent >= 100) {
        if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
          console.log("Capturing frame from video element");
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (
                wsRef.current &&
                wsRef.current.readyState === WebSocket.OPEN
              ) {
                console.log("Sending frame to backend");
                wsRef.current.send(blob);
              } else {
                console.warn("WebSocket not open, skipping frame send");
              }
            },
            "image/jpeg",
            0.5
          );
          lastSent = now;
        } else {
          console.log(
            "Video element not ready, state:",
            videoElement.readyState
          );
        }
      }
      requestAnimationFrame(captureFrame);
    }
    console.log("Starting frame capture loop");
    requestAnimationFrame(captureFrame);
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 item size={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" fontWeight={600}>
              Video Conference with {patientName || "Patient"}
            </Typography>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 item size={12}>
        <Card>
          <CardContent>
            <Grid2 container spacing={2}>
              <Grid2 item size={5} sx={{ height: 600 }}>
                {roomName ? (
                  <JitsiMeeting
                    roomName={roomName}
                    onVideoTrackReceived={handleVideoTrackReceived}
                  />
                ) : (
                  <Typography>Loading conference...</Typography>
                )}
              </Grid2>
              <Grid2 item size={7} sx={{ height: 600, background: "black" }}>
                {processedStreamUrl ? (
                  <img
                    src={processedStreamUrl}
                    alt="Processed Stream"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Typography color="white">
                    Waiting for processed stream...
                  </Typography>
                )}
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
};

export default VideoConference;
