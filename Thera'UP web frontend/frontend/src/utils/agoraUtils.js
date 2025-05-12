export const playRemoteAudioTrack = (user, videoElement) => {
  try {
    if (user.audioTrack && typeof user.audioTrack.play === "function") {
      user.audioTrack.play();
      console.log(`🎧 Audio track playing for user ${user.uid}`);
    }

    if (videoElement instanceof HTMLVideoElement) {
      videoElement.muted = false;
      videoElement.volume = 1.0;
      console.log(`🔊 Video element unmuted for user ${user.uid}`);
    }
  } catch (err) {
    console.error(`❌ Error playing audio for user ${user.uid}:`, err);
  }
};
