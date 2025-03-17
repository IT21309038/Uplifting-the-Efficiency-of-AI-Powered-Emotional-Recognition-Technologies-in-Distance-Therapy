import { useEffect, useRef } from "react";

const ProcessedVideo = () => {
  const videoRef = useRef(null);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws");

    ws.current.onmessage = (event) => {
      if (videoRef.current) {
        const videoURL = URL.createObjectURL(event.data);
        videoRef.current.src = videoURL;
      }
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  return <video ref={videoRef} autoPlay controls />;
};

export default ProcessedVideo;
