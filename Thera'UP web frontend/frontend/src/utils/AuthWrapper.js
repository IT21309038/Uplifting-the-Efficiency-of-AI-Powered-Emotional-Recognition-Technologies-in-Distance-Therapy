import React from "react";
import { useSession, signIn } from "next-auth/react";
import Loader from "@/components/layout/Loader";
import { useRouter } from "next/router";

const AuthWrapper = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Array of allowed paths
  const allowedUnauthenticatedPaths = [
    "/404",
    "/500",
    "/401",
    "/auth",
    "/insecure",
  ];

  // Build regex from the array of allowed paths
  const allowedPathsRegex = new RegExp(
    `^/(${allowedUnauthenticatedPaths
      .map((path) => path.replace("/", ""))
      .join("|")})(?:/.*)?$`
  );

  // If the session is still loading, show the loader
  if (status === "loading") {
    return <Loader />;
  }

  // If authenticated, allow access
  if (status === "authenticated") {
    return <>{children}</>;
  }

  // If unauthenticated, allow access to specific paths based on regex
  if (status === "unauthenticated") {
    if (allowedPathsRegex.test(router.pathname)) {
      return <>{children}</>;
    } else {
      signIn();
      return <Loader />;
    }
  }

  return <Loader />;
};

export default AuthWrapper;
