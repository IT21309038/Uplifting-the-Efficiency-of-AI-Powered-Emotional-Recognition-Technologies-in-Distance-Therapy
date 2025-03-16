import { useRef, useEffect } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

const JitsiMeetingComponent = ({ roomName, onVideoTrackReceived }) => {
  const jitsiApiRef = useRef(null);
  const videoElementRef = useRef(null);

  const handleApiReady = (externalApi) => {
    jitsiApiRef.current = externalApi;
    externalApi.addListener("videoConferenceJoined", () => {
      console.log("Therapist joined the conference");
    });
    externalApi.addListener("participantJoined", (participant) => {
      console.log("Participant joined:", participant);
    });
    externalApi.addListener("trackAdded", (track) => {
      if (track.getType() === "video" && !track.isLocal()) {
        console.log("Remote participant video track detected");
        const mediaStream = new MediaStream([track.getOriginalStream().getVideoTracks()[0]]);
        onVideoTrackReceived(mediaStream);
        attachVideoStream(mediaStream);
      }
    });
  };

  const attachVideoStream = (stream) => {
    if (!videoElementRef.current) {
      videoElementRef.current = document.createElement("video");
      videoElementRef.current.autoplay = true;
      videoElementRef.current.style.display = "none";
      document.body.appendChild(videoElementRef.current);
    }
    videoElementRef.current.srcObject = stream;
  };

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