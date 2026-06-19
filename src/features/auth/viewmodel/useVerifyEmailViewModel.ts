import { useState } from "react";
import { authService } from "../../../services/authService";

export const useVerifyEmailViewModel = (email: string) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const verifyEmail = async (): Promise<boolean> => {
    setError(null);
    setMessage(null);

    if (!code.trim()) {
      setError("Verification code is required.");
      return false;
    }

    try {
      setIsLoading(true);
      await authService.verifyEmail({ code: code.trim() });
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

  const resendVerification = async () => {
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError("Email is required to resend the verification code.");
      return;
    }

    try {
      setIsResending(true);
      await authService.resendVerification({
        email: email.trim(),
        platform: "mobile",
      });
      setMessage("A new verification code was sent to your email.");
    } catch (err: any) {
      console.log("RESEND VERIFICATION ERROR STATUS:", err.response?.status);
      console.log("RESEND VERIFICATION ERROR DATA:", err.response?.data);
      console.log("RESEND VERIFICATION ERROR FULL:", JSON.stringify(err.response?.data));
      setError("Unable to resend verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return {
    code,
    setCode,
    isLoading,
    isResending,
    error,
    message,
    verifyEmail,
    resendVerification,
  };
};
