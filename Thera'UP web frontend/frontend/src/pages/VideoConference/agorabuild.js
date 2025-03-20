import React from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import AgoraProvider from "./agoraprovider";
import { Grid2 } from "@mui/material";

const agorabuild = () => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  //get session_id from the url params
  const urlParams = new URLSearchParams(window.location.search);
  const session_id = urlParams.get("session_id");

  return (
    <Grid2 container spacing={2}>
      <Grid2 item size={12} sx={{ height: 400 }}>
        <AgoraRTCProvider client={client} session_id={session_id}>
          <AgoraProvider />
        </AgoraRTCProvider>
      </Grid2>
    </Grid2>
  );
};

export default agorabuild;
