import { useState } from "react";
import { authService } from "../service/authService";

export const useRegisterViewModel = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (): Promise<boolean> => {
    setError(null);

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setError("First name, last name, email, and password are required.");
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
      });

      if (response.verificationToken) {
        await authService.verifyEmail(response.verificationToken);
      }

      return true;
    } catch (err: any) {
      console.log("REGISTER ERROR FULL:", err?.response?.data || err);
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
    isLoading,
    error,
    setPassword,
    register,
  };
};
