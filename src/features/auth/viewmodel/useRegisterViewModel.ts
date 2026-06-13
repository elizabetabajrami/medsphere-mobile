import { useState } from "react";
import { savePendingPersonalNumber } from "../../../storage/tokenStorage";
import { authService } from "../service/authService";

const getRegisterErrorMessage = (err: any) => {
  const status = err.response?.status;
  const message = err.response?.data?.message;
  const normalizedMessage = Array.isArray(message)
    ? message.join(" ").toLowerCase()
    : typeof message === "string"
      ? message.toLowerCase()
      : "";

  if (
    status === 409 ||
    normalizedMessage.includes("already") ||
    normalizedMessage.includes("exists") ||
    normalizedMessage.includes("duplicate") ||
    normalizedMessage.includes("taken") ||
    normalizedMessage.includes("used")
  ) {
    return "This email is already in use. Please sign in or use another email.";
  }

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  if (typeof message === "string") {
    return message;
  }

  return "Unable to register. Please try again.";
};

export const useRegisterViewModel = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [personalNumber, setPersonalNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (): Promise<boolean> => {
    setError(null);

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !personalNumber.trim()
    ) {
      setError(
        "First name, last name, email, password, and personal number are required.",
      );
      return false;
    }

    if (password.length < 12) {
      setError("Password must be at least 12 characters.");
      return false;
    }

    try {
      setIsLoading(true);

      const response: any = await authService.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        personalNumber: personalNumber.trim(),
        platform: "mobile",
      });

      console.log("REGISTER RESPONSE:", response);

      try {
        await savePendingPersonalNumber(email.trim(), personalNumber.trim());
      } catch (storageErr) {
        console.log("SAVE PENDING PERSONAL NUMBER ERROR:", storageErr);
      }

      return true;
    } catch (err: any) {
      console.log("REGISTER ERROR STATUS:", err.response?.status);
      console.log("REGISTER ERROR DATA:", err.response?.data);
      console.log("REGISTER ERROR FULL:", JSON.stringify(err.response?.data));
      setError(getRegisterErrorMessage(err));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    personalNumber,
    setPersonalNumber,
    isLoading,
    error,
    setPassword,
    register,
  };
};
