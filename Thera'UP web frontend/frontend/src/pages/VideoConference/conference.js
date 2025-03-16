import { Card, CardContent, Grid2, Typography } from "@mui/material";

import { useState, useEffect, useRef } from "react";
import JitsiMeeting from "@/components/extras/JitsiMeeting";

const VideoConference = () => {
  const [roomName, setRoomName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [streamUrl, setStreamUrl] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection to FastAPI
    wsRef.current = new WebSocket("ws://localhost:8000/ws"); // Replace with your FastAPI WS URL
    wsRef.current.onopen = () => console.log("WebSocket connected");
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setEmotion(data.emotion);
    };
    wsRef.current.onerror = (error) => console.error("WebSocket error:", error);
    wsRef.current.onclose = () => console.log("WebSocket closed");

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  //get the meeting room name from url params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomName = urlParams.get("session_id");
    const patientName = urlParams.get("patient_name");
    setRoomName(roomName);
    setPatientName(patientName);
  }, []);

  const handleVideoTrackReceived = (videoTrack) => {
    const stream = new MediaStream([videoTrack]);
    const videoElement = document.createElement("video");
    videoElement.srcObject = stream;
    videoElement.play();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = videoElement.videoWidth || 640; // Default if not available yet
    canvas.height = videoElement.videoHeight || 480;

    function captureFrame() {
      if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const frameData = canvas.toDataURL("image/jpeg", 0.5); // Compress to reduce bandwidth
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ frame: frameData }));
        }
      }
      requestAnimationFrame(captureFrame); // Continuous loop
    }
    requestAnimationFrame(captureFrame);
  };

  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 item size={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight={600}>
                Video Conference with {patientName}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 item size={12}>
          <Card>
            <CardContent>
              <Grid2 container spacing={2}>
                <Grid2 item size={5} sx={{ height: 600 }}>
                  <JitsiMeeting
                    roomName={roomName}
                    onVideoTrackReceived={handleVideoTrackReceived}
                  />
                </Grid2>
                <Grid2
                  item
                  size={7}
                  sx={{ height: 600, background: "black" }}
                ></Grid2>
                <Grid2
                  item
                  size={6}
                  sx={{ height: 300, background: "black" }}
                ></Grid2>
                <Grid2
                  item
                  size={6}
                  sx={{ height: 300, background: "black" }}
                ></Grid2>
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  );
};

export default VideoConference;