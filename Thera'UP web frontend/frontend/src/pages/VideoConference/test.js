import { useState } from "react";
import JitsiComponent from "./JitsiComponent";
import VideoProcessor from "./VideoProcessor";
import ProcessedVideo from "./ProcessedVideo";

const Test = () => {
  const [remoteStream, setRemoteStream] = useState(null);

  return (
    <div>
      <JitsiComponent setRemoteStream={setRemoteStream} />
      {remoteStream && <VideoProcessor remoteStream={remoteStream} />}
      <ProcessedVideo />
    </div>
  );
};

export default Test;
