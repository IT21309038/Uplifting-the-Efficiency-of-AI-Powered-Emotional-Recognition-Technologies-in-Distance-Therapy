// ** MUI Components
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// ** Styled Components
const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    width: "90vw",
  },
}));

const Error500 = () => {
  return (
    <Box
      className="content-center"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          p: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        <BoxWrapper>
          <Typography variant="h2" sx={{ mb: 1.5 }}>
            Oops, something went wrong!
          </Typography>
          <Typography sx={{ mb: 6, color: "text.secondary" }}>
            There was an error with the internal server. Please contact your
            site administrator.
          </Typography>
          <Button href="/" variant="contained">
            Back to Home
          </Button>
        </BoxWrapper>
        <Box sx={{ mt: 5 }}>
          <img
            height="350"
            alt="error-illustration"
            src="/images/error-fallbacks/ErrorImage_500.png"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Error500;
