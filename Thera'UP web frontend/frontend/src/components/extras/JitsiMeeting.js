import { Container, Grid2 } from "@mui/material";
import { useEffect, useRef } from "react";

const JitsiMeeting = ({ roomName, onVideoTrackReceived }) => {
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  useEffect(() => {
    const loadJitsiScript = () => {
      if (!window.JitsiMeetExternalAPI) {
        const script = document.createElement("script");
        script.src = "https://meetings.pixelcore.lk/external_api.js";
        script.async = true;
        script.onload = () => initializeJitsi();
        script.onerror = () => console.error("Failed to load Jitsi script");
        document.body.appendChild(script);
      } else {
        initializeJitsi();
      }
    };

    const initializeJitsi = () => {
      const domain = "meetings.pixelcore.lk";
      const options = {
        roomName: roomName,
        parentNode: jitsiContainerRef.current,
        userInfo: { displayName: "Therapist" },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: ["microphone", "camera", "hangup", "chat"],
        },
        // Add width and height to fill container
        width: "100%",
        height: "100%",
      };

      try {
        jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

        jitsiApiRef.current.addListener("videoConferenceJoined", () => {
          console.log("Therapist joined the conference");
        });

        jitsiApiRef.current.addListener("participantJoined", (participant) => {
          console.log("Participant joined:", participant);
          checkParticipantVideo(participant.participantId);
        });

        jitsiApiRef.current.addListener("videoConferenceLeft", () => {
          console.log("Conference ended");
        });
      } catch (error) {
        console.error("Failed to initialize Jitsi Meet:", error);
      }
    };

    const checkParticipantVideo = (participantId) => {
      const participants = jitsiApiRef.current.getParticipantsInfo();
      participants.forEach((participant) => {
        if (
          participant.participantId === participantId &&
          participant.displayName !== "Therapist"
        ) {
          const videoTrack =
            jitsiApiRef.current._getParticipantVideo(participantId);
          if (videoTrack) {
            console.log("Video track found for participant:", participantId);
            onVideoTrackReceived(videoTrack);
          } else {
            console.warn(
              "No video track available for participant:",
              participantId
            );
          }
        }
      });
    };

    loadJitsiScript();

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [roomName, onVideoTrackReceived]);

  return (
    <Grid2 container spacing={2}>
      <Grid2
        item
        xs={12} // Changed from xs={4} to use full width
        sx={{
          height: 600, // Keep your desired height
          width: "100%",
        }}
      >
        <div
          ref={jitsiContainerRef}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </Grid2>
    </Grid2>
  );
};

export default JitsiMeeting;
