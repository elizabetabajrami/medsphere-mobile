import { useState } from "react";
import { authService } from "../service/authService";

export const useVerifyEmailViewModel = () => {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyEmail = async (): Promise<boolean> => {
    setError(null);

    if (!token.trim()) {
      setError("Verification code is required.");
      return false;
    }

    try {
      setIsLoading(true);
      await authService.verifyEmail({ token: token.trim() });
      return true;
    } catch (err: any) {
      console.log("VERIFY EMAIL ERROR STATUS:", err.response?.status);
      console.log("VERIFY EMAIL ERROR DATA:", err.response?.data);
      console.log("VERIFY EMAIL ERROR FULL:", JSON.stringify(err.response?.data));
      setError("Unable to verify email. Please check the code and try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    token,
    setToken,
    isLoading,
    error,
    verifyEmail,
  };
};
