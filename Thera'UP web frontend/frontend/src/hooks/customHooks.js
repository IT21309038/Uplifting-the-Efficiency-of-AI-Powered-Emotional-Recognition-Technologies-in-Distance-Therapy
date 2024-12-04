import apiDefinitions from "@/api/apiDefinitions";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";

export const GetUserRole = () => {
  const { data: session } = useSession();

  if (!session) return null;

  return session?.user?.role || null;
};

export const GetUserID = () => {
  const { data: session } = useSession();

  if (!session) return null;

  return session?.user?.id || null;
};

export const ValidColorCodes = [
  "success",
  "warning",
  "info",
  "error",
  "secondary",
  "primary",
];

export const FormatDate = (date) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options)
    .format(date)
    .replace(",", "");
};

export const EmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export const ValidatePassword = (password) => {
  const errors = [];

  // Check length
  if (password.length < 8) {
    errors.push("Be at least 8 characters long.");
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Contain at least one uppercase letter.");
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Contain at least one lowercase letter.");
  }

  // Check for digit
  if (!/[0-9]/.test(password)) {
    errors.push("Contain at least one digit.");
  }

  // Check for special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Contain at least one special character.");
  }

  return errors || [];
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const CapitalizeFirstLetterMultipleWords = (string) => {
  return string
    .split(" ")
    .map((word) => capitalizeFirstLetter(word))
    .join(" ");
};

export const CheckBackendAlive = async () => {
  try {
    const response = await apiDefinitions.checkAlive(); // Await the promise
    if (response.status === 200) {
      console.log("Backend is alive", response);
      return {
        alive: true,
        data: response.data.data, // Return data if the backend is alive
      };
    } else {
      throw new Error(response.data.message || "Backend is not alive");
    }
  } catch (error) {
    console.error("Error checking backend status:", error);
    return {
      alive: false,
      message: error.message || "Error occurred while checking backend status", // Return an error message
    };
  }
};
