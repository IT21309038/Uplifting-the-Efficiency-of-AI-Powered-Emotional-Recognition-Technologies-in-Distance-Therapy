import React from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import AgoraProvider from "./agoraprovider";
import { Grid2 } from "@mui/material";

const agorabuild = () => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  return (
    <Grid2 container spacing={2}>
      <Grid2 item size={6} sx={{ height: 400 }}>
        <AgoraRTCProvider client={client}>
          <AgoraProvider />
        </AgoraRTCProvider>
      </Grid2>
    </Grid2>
  );
};

export default agorabuild;
