import React from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import AgoraProvider from "./agoraprovider";
import { Grid2 } from "@mui/material";

const agorabuild = () => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  //get session_id from the url params
  const urlParams = new URLSearchParams(window.location.search);
  const session_id = urlParams.get("session_id");
  const patient_id = urlParams.get("patient_id");
  const doctor_id = urlParams.get("doctor_id");
  const session_date = urlParams.get("session_date");
  const session_time = urlParams.get("session_time");

  return (
    <Grid2 container spacing={2}>
      <Grid2 item size={12} sx={{ height: 400 }}>
        <AgoraRTCProvider client={client}>
          <AgoraProvider
            session_id={session_id}
            patient_id={patient_id}
            doctor_id={doctor_id}
            session_date={session_date}
            session_time={session_time}
          />
        </AgoraRTCProvider>
      </Grid2>
    </Grid2>
  );
};

export default agorabuild;
