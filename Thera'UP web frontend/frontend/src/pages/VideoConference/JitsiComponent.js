import { useEffect, useState } from "react";
import { JitsiMeetExternalAPI } from "@jitsi/react-sdk";

const JitsiComponent = ({ setRemoteStream }) => {
  let api = null;

  useEffect(() => {
    api = new JitsiMeetExternalAPI("meet.jit.si", {
      roomName: "TestRoom",
      parentNode: document.getElementById("jitsi-container"),
    });

    api.on("participantJoined", (participant) => {
      console.log("Participant joined:", participant);
    });

    api.on("trackAdded", (track) => {
      if (track.getType() === "video" && !track.isLocal()) {
        setRemoteStream(track.getOriginalStream()); // Capture the remote stream
      }
    });

    return () => {
      api.dispose();
    };
  }, []);

  return (
    <div id="jitsi-container" style={{ height: "500px", width: "100%" }} />
  );
};

export default JitsiComponent;
