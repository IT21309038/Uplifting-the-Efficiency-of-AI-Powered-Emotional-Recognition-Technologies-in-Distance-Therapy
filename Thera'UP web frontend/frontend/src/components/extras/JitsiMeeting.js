import { useEffect, useRef } from "react";

const JitsiMeeting = ({ roomName, onVideoTrackReceived }) => {
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  useEffect(() => {
    const loadJitsiScript = () => {
      if (!window.JitsiMeetExternalAPI) {
        const script = document.createElement("script");
        // Corrected script URL: It should point to the external_api.js file
        script.src = "https://meetings.pixelcore.lk/external_api.js"; // Ensure this is the correct path
        script.async = true;
        script.onload = () => initializeJitsi();
        script.onerror = () => console.error("Failed to load Jitsi script");
        document.body.appendChild(script);
      } else {
        initializeJitsi();
      }
    };

    const initializeJitsi = () => {
      const domain = "meetings.pixelcore.lk"; // Your custom Jitsi domain
      const options = {
        roomName: roomName,
        width: "100%",
        height: "100%",
        parentNode: jitsiContainerRef.current,
        userInfo: { displayName: "Therapist" },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: ["microphone", "camera", "hangup", "chat"],
        },
      };

      try {
        jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

        // Event listeners
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
          // Note: _getParticipantVideo is an internal method and may not be reliable
          const videoTrack = jitsiApiRef.current._getParticipantVideo(participantId);
          if (videoTrack) {
            console.log("Video track found for participant:", participantId);
            onVideoTrackReceived(videoTrack); // Pass video track to parent
          } else {
            console.warn("No video track available for participant:", participantId);
          }
        }
      });
    };

    loadJitsiScript();

    // Cleanup
    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [roomName, onVideoTrackReceived]);

  return (
    <div ref={jitsiContainerRef} style={{ width: "100%", height: "400px" }} />
  );
};

export default JitsiMeeting;