import React from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import AgoraProvider from "./agoraprovider";

const agorabuild = () => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  return (
    <AgoraRTCProvider client={client}>
      <AgoraProvider />
    </AgoraRTCProvider>
  );
};

export default agorabuild;
