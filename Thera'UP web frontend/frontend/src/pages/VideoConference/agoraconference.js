import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { useState } from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import { Container, Button, TextField, Paper, Grid2 } from "@mui/material";

export const VideoCalling = () => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return (
    <AgoraRTCProvider client={client}>
      <VideoCallUI />
    </AgoraRTCProvider>
  );
};

const VideoCallUI = () => {
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  const [appId, setAppId] = useState("b62636e82bae4d77a10929859b2d798f");
  const [channel, setChannel] = useState("TEST-001");
  const [token, setToken] = useState("");
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  useJoin(
    { appid: appId, channel: channel, token: token ? token : null },
    calling
  );
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();

  return (
    <Container
      maxWidth="lg"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#222",
        color: "white",
      }}
    >
      {isConnected ? (
        <>
          <Grid2
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            style={{ height: "80%" }}
          >
            {/* Remote Users Section */}
            <Grid2 item xs={12} md={9}>
              <Paper
                elevation={3}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#000",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                {remoteUsers.length > 0 ? (
                  remoteUsers.map((user) => (
                    <div
                      key={user.uid}
                      style={{
                        width: "50%",
                        height: "50%",
                        position: "relative",
                      }}
                    >
                      {user.videoTrack ? (
                        <RemoteUser
                          user={user}
                          playAudio={true}
                          playVideo={true}
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        <p>No video available for User {user.uid}</p>
                      )}
                      <span
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "10px",
                          // background: "rgba(0, 0, 0, 0.5)",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "5px",
                        }}
                      >
                        User {user.uid}
                      </span>
                    </div>
                  ))
                ) : (
                  <p>No remote users</p>
                )}
              </Paper>
            </Grid2>
          </Grid2>

          {/* Local User Preview */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              width: "200px",
              height: "150px",
              border: "2px solid white",
              borderRadius: "10px",
              overflow: "hidden",
              background: "#000",
            }}
          >
            <LocalUser
              audioTrack={localMicrophoneTrack}
              cameraOn={cameraOn}
              micOn={micOn}
              playAudio={true}
              videoTrack={localCameraTrack}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          {/* Control Buttons */}
          <Grid2
            container
            spacing={2}
            justifyContent="center"
            style={{ marginTop: "20px" }}
          >
            <Grid2 item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setMic(!micOn)}
              >
                {micOn ? "Disable Mic" : "Enable Mic"}
              </Button>
            </Grid2>
            <Grid2 item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setCamera(!cameraOn)}
              >
                {cameraOn ? "Disable Camera" : "Enable Camera"}
              </Button>
            </Grid2>
            <Grid2 item>
              <Button
                variant="contained"
                color="error"
                onClick={() => setCalling(false)}
              >
                End Call
              </Button>
            </Grid2>
          </Grid2>
        </>
      ) : (
        <Paper
          style={{ padding: "20px", maxWidth: "400px", textAlign: "center" }}
        >
          <Grid2 container spacing={2} direction="column">
            <Grid2 item>
              <TextField
                fullWidth
                label="App ID"
                variant="outlined"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
              />
            </Grid2>
            <Grid2 item>
              <TextField
                fullWidth
                label="Channel Name"
                variant="outlined"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
              />
            </Grid2>
            <Grid2 item>
              <TextField
                fullWidth
                label="Token"
                variant="outlined"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </Grid2>
            <Grid2 item>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={!appId || !channel}
                onClick={() => setCalling(true)}
              >
                Join Channel
              </Button>
            </Grid2>
          </Grid2>
        </Paper>
      )}
    </Container>
  );
};

export default VideoCalling;
