import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CustomHead from "@/utils/CustomHead";
import { Image } from "antd";
import { signIn, useSession } from "next-auth/react";

import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "@/components/layout/Loader";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"RP 24-25J-126 ©"}
      {new Date().getFullYear()}
      {". All rights reserved."}
      <br />
      <Link color="inherit" href="#">
        Thera&apos;UP Solutions
      </Link>
    </Typography>
  );
}

export default function SignInSide() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State for managing email and password errors
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // State for managing password visibility
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  // Redirect to home if already logged in (only on first load)
  useEffect(() => {
    if (status === "loading") return; // Avoid doing anything until session is loaded

    if (session) {
      router.push("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  // Show Loader during session check
  if (status === "loading") {
    return <Loader />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (!data.get("email")) {
      setEmailError("Email is required.");
      return;
    }

    if (!data.get("password")) {
      setPasswordError("Password is required.");
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      username: data.get("email"),
      password: data.get("password"),
    });

    if (result.error) {
      console.error("Login Error:", result.error);
      toast.error(result.error, {
        toastId: "loginError",
      });
    } else if (result.ok) {
      toast.success("Login Success", {
        toastId: "loginSuccess",
      });

      const callBackURL =
        result?.url && result.url.includes("?callbackUrl=")
          ? decodeURIComponent(result.url.split("?callbackUrl=")[1])
          : "/";
      console.log("callbackUrl", callBackURL);

      router.push(callBackURL);
    }
  };

  return (
    <>
      <CustomHead title="Login" />
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          md={8}
          sx={{
            backgroundImage: "url(/images/background/login.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover", // Fill the container with the image
            backgroundPosition: "center",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        />

        <Grid item xs={12} md={4} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 5,
              mx: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Image
              src="/images/logo/NEWLOGO.png"
              alt="logo"
              width="auto"
              height={95}
              preview={false}
            />
            <Typography
              variant="h4"
              fontWeight={600}
              sx={{
                textAlign: "center",
                mt: 2,
              }}
            >
              Welcome to
              <br />
              Thera&apos;UP E-Therapy
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={emailError.length > 0}
                helperText={emailError}
                onChange={() => setEmailError("")}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={passwordVisibility ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                error={passwordError.length > 0}
                helperText={passwordError}
                onChange={() => setPasswordError("")}
                InputProps={{
                  endAdornment: (
                    <Icon
                      style={{ cursor: "pointer" }}
                      icon={
                        passwordVisibility
                          ? "mdi:eye-outline"
                          : "mdi:eye-off-outline"
                      }
                      fontSize={25}
                      onClick={() => setPasswordVisibility(!passwordVisibility)}
                    />
                  ),
                }}
              />
              {/* <Link
                href="/auth/forgot-password"
                variant="body2"
                sx={{
                  float: "right",
                }}
              >
                Forgot password?
              </Link> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
              >
                Sign In
              </Button>

              <Typography sx={{py:2, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                Don&apos;t have an account?
              </Typography>

              <Button
                fullWidth
                variant="contained"
              >
                create an account
              </Button>
              <Copyright sx={{py: 3}} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
