import { useRef, useEffect } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

const JitsiMeetingComponent = ({ roomName, onVideoTrackReceived }) => {
  const jitsiApiRef = useRef(null);
  const videoElementRef = useRef(null);

  // Handle Jitsi API readiness and event listeners
  const handleApiReady = (externalApi) => {
    jitsiApiRef.current = externalApi;

    // Log when therapist joins
    externalApi.addListener("videoConferenceJoined", () => {
      console.log("Therapist joined the conference");
    });

    // Log when a participant joins
    externalApi.addListener("participantJoined", (participant) => {
      console.log("Participant joined:", participant);
    });

    // Handle remote track addition
    externalApi.addListener("trackAdded", (track) => {
      console.log("Track added:", {
        type: track.getType(),
        isLocal: track.isLocal(),
        participantId: track.getParticipantId(),
      });

      if (track.getType() === "video" && !track.isLocal()) {
        console.log("Remote participant video track detected");
        try {
          const mediaStream = track.getTrack
            ? new MediaStream([track.getTrack()]) // For newer Jitsi API versions
            : new MediaStream([track.getOriginalStream().getVideoTracks()[0]]); // Fallback for older versions
          
          // Pass the MediaStream to the parent component
          onVideoTrackReceived(mediaStream);
          attachVideoStream(mediaStream);
        } catch (error) {
          console.error("Error processing remote video track:", error);
        }
      }
    });
  };

  // Attach the video stream to a hidden video element
  const attachVideoStream = (stream) => {
    if (!videoElementRef.current) {
      videoElementRef.current = document.createElement("video");
      videoElementRef.current.autoplay = true;
      videoElementRef.current.muted = true; // Ensure no audio feedback
      videoElementRef.current.style.display = "none";
      document.body.appendChild(videoElementRef.current);
      console.log("Video element created and appended");
    }

    if (videoElementRef.current.srcObject !== stream) {
      videoElementRef.current.srcObject = stream;
      console.log("Video stream attached to video element");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        console.log("Jitsi API disposed");
      }
      if (videoElementRef.current) {
        videoElementRef.current.srcObject = null;
        document.body.removeChild(videoElementRef.current);
        videoElementRef.current = null;
        console.log("Video element cleaned up");
      }
    };
  }, []);

  return (
    <JitsiMeeting
      domain="meetings.pixelcore.lk"
      roomName={roomName}
      configOverwrite={{
        startWithAudioMuted: false,
        disableModeratorIndicator: true,
        startScreenSharing: false,
        enableEmailInStats: false,
      }}
      interfaceConfigOverwrite={{
        TOOLBAR_BUTTONS: ["microphone", "camera", "hangup", "chat"],
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
      }}
      userInfo={{ displayName: "Therapist" }}
      onApiReady={handleApiReady}
      getIFrameRef={(iframeRef) => {
        iframeRef.style.width = "100%";
        iframeRef.style.height = "100%";
      }}
    />
  );
};

export default JitsiMeetingComponent;