import { Card, CardContent, Grid2, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import JitsiMeeting from "@/components/extras/JitsiMeeting";

const VideoConference = () => {
  const [roomName, setRoomName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [processedStreamUrl, setProcessedStreamUrl] = useState(null);
  const wsRef = useRef(null);
  const videoElementRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const [wsConnected, setWsConnected] = useState(false); // Track WebSocket status

  // WebSocket setup and cleanup
  useEffect(() => {
    let frameBuffer = [];
    const connectWebSocket = () => {
      wsRef.current = new WebSocket("ws://localhost:8000/ws");
      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setWsConnected(true);
        frameBuffer.forEach((frame) => wsRef.current.send(frame));
        frameBuffer = [];
      };
      wsRef.current.onmessage = (event) => {
        if (typeof event.data === "string") {
          console.log("Connection ID received:", event.data);
        } else {
          console.log("Received processed frame from backend");
          const blob = new Blob([event.data], { type: "image/jpeg" });
          setProcessedStreamUrl((prevUrl) => {
            if (prevUrl) URL.revokeObjectURL(prevUrl);
            return URL.createObjectURL(blob);
          });
        }
      };
      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setWsConnected(false);
        setTimeout(connectWebSocket, 1000);
      };
      wsRef.current.onclose = () => {
        console.log("WebSocket closed");
        setWsConnected(false);
      };
    };
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Parse URL parameters
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

  // Handle video track and frame capture
  const handleVideoTrackReceived = (videoTrack) => {
    console.log("Received remote video track:", videoTrack);
    const stream = new MediaStream([videoTrack]);

    // Setup video element
    if (!videoElementRef.current) {
      videoElementRef.current = document.createElement("video");
      videoElementRef.current.autoplay = true;
      videoElementRef.current.style.display = "none";
      document.body.appendChild(videoElementRef.current);
    }
    videoElementRef.current.srcObject = stream;

    // Setup canvas
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
      canvasRef.current.width = 640;
      canvasRef.current.height = 480;
    }
    const ctx = canvasRef.current.getContext("2d");

    let lastSent = 0;
    const captureFrame = () => {
      if (!videoElementRef.current || !wsRef.current) {
        console.log(
          "Video element or WebSocket not ready, stopping frame capture"
        );
        return;
      }

      const now = Date.now();
      if (
        now - lastSent >= 100 &&
        videoElementRef.current.readyState ===
          videoElementRef.current.HAVE_ENOUGH_DATA
      ) {
        console.log(
          "Capturing frame, readyState:",
          videoElementRef.current.readyState
        );
        ctx.drawImage(videoElementRef.current, 0, 0, 640, 480);
        const base64Frame = canvasRef.current.toDataURL("image/jpeg", 0.5);
        if (wsRef.current.readyState === WebSocket.OPEN) {
          console.log("Sending base64 frame to backend");
          wsRef.current.send(base64Frame);
        } else {
          console.warn("WebSocket not open, buffering frame");
          frameBuffer.push(base64Frame);
        }
        lastSent = now;
      } else {
        console.log(
          "Frame not captured, readyState:",
          videoElementRef.current.readyState
        );
      }
      animationFrameId.current = requestAnimationFrame(captureFrame);
    };

    // Wait for video to be ready before starting capture
    const startCapture = () => {
      if (
        videoElementRef.current.readyState >=
        videoElementRef.current.HAVE_ENOUGH_DATA
      ) {
        console.log("Video ready, starting frame capture");
        animationFrameId.current = requestAnimationFrame(captureFrame);
      } else {
        console.log(
          "Waiting for video to be ready, current readyState:",
          videoElementRef.current.readyState
        );
        setTimeout(startCapture, 100);
      }
    };
    startCapture();

    // Cleanup
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (videoElementRef.current) {
        videoElementRef.current.srcObject = null;
        document.body.removeChild(videoElementRef.current);
        videoElementRef.current = null;
      }
      if (canvasRef.current) {
        canvasRef.current = null;
      }
    };
  };

  // Cleanup processed stream URL on unmount
  useEffect(() => {
    return () => {
      if (processedStreamUrl) {
        URL.revokeObjectURL(processedStreamUrl);
      }
    };
  }, [processedStreamUrl]);

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
                    Waiting for processed stream... (WebSocket:{" "}
                    {wsConnected ? "Connected" : "Disconnected"})
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
