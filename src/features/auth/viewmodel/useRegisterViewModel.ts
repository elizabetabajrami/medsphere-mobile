import { useState } from "react";
import { authService } from "../service/authService";

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
      });

      console.log("REGISTER RESPONSE:", response);

      return true;
    } catch (err: any) {
      console.log("REGISTER ERROR STATUS:", err.response?.status);
      console.log("REGISTER ERROR DATA:", err.response?.data);
      console.log("REGISTER ERROR FULL:", JSON.stringify(err.response?.data));
      setError("Unable to register. Please try again.");
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
