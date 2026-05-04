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

      await authService.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });

      return true;
    } catch {
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
    setPassword,
    isLoading,
    error,
    register,
  };
};
