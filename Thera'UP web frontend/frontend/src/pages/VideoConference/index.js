import CustomHead from "@/utils/CustomHead";
import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import dynamic from "next/dynamic";

// Dynamically import JitsiMeeting to ensure it runs only on the client-side
const JitsiMeeting = dynamic(
  () => import("@jitsi/react-sdk").then((mod) => mod.JitsiMeeting),
  { ssr: false }
);

const VideoConference = () => {
  // Dummy Data for Graphs
  const data = [
    { name: "Jan", value: 30 },
    { name: "Feb", value: 50 },
    { name: "Mar", value: 80 },
    { name: "Apr", value: 40 },
    { name: "May", value: 90 },
  ];

  return (
    <>
      <CustomHead title="Conference" />
      <div
        style={{
          display: "flex",
          height: "100vh",
          padding: "20px",
          gap: "20px",
        }}
      >
        {/* Left Side - Video Conference */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#f4f4f4",
            borderRadius: "8px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            overflow: "hidden", // Prevents expansion
            height: "100%", // Makes sure the div takes full height
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "10px",
            }}
          >
            Video Conference
          </h2>

          {/* Expandable Video Conference Container */}
          <div style={{ flexGrow: 1, overflow: "hidden", height: "100%" }}>
            <JitsiMeeting
              roomName="TheraUP-Conference"
              configOverwrite={{
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                prejoinPageEnabled: false,
                disableModeratorIndicator: true,
                disableProfile: true,
                startAudioOnly: false,
                toolbarButtons: [
                  "microphone",
                  "camera",
                  "hangup",
                  "settings",
                  "tileview",
                  "volume",
                ],
              }}
              interfaceConfigOverwrite={{
                SHOW_JITSI_WATERMARK: false,
                SHOW_BRAND_WATERMARK: false,
              }}
              userInfo={{ displayName: "Doctor" }}
              //style={{ width: "100%", height: "100%", minHeight: "800px" }} // Ensures it fully fills the container
              style={{
                flexGrow: 1,
                overflow: "hidden",
                height: "100%",
                width: "80%",
                minHeight: "800px",
              }}
            />
          </div>
        </div>

        {/* Right Side - Graphs (Stacked One Below Another) */}
        <div
          style={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "10px",
            height: "100%", // Ensures the height matches the video container
          }}
        >
          {/* Line Chart */}
          <div
            style={{
              backgroundColor: "#fff",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              padding: "20px",
              height: "50%",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              Patient Trends
            </h2>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div
            style={{
              backgroundColor: "#fff",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              padding: "20px",
              height: "50%",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              Appointments
            </h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoConference;
