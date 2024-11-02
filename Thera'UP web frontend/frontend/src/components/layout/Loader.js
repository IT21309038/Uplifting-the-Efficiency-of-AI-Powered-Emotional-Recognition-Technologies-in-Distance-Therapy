import React from "react";
import { Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const Loader = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#212427",
        color: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ textAlign: "center", m: 0, p: 0 }}>
          <img src="/images/logo/NEWLOGO.png" alt="logo" width="250px" />
          <Typography variant="h3" sx={{ mb: 3 }}>
            Thera&apos;UP
          </Typography>
        </Box>
        <CircularProgress
          size={40}
          sx={{
            color: "white",
          }}
        />
      </Box>
    </Box>
  );
};

export default Loader;
