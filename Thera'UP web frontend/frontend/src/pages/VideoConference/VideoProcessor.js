import { useEffect, useRef } from "react";

const VideoProcessor = ({ remoteStream }) => {
  const ws = useRef(null);

  useEffect(() => {
    if (!remoteStream) return;

    ws.current = new WebSocket("ws://localhost:8000/ws");

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      const videoTrack = remoteStream.getVideoTracks()[0];
      const mediaRecorder = new MediaRecorder(new MediaStream([videoTrack]), { mimeType: "video/webm" });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(event.data);
        }
      };

      mediaRecorder.start(100);
    };

    return () => {
      ws.current?.close();
    };
  }, [remoteStream]);

  return <div>Processing Video...</div>;
};

export default VideoProcessor;
