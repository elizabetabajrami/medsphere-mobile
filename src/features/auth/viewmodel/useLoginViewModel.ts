import { useState } from "react";
import {
  clearPendingPersonalNumber,
  getPendingPersonalNumber,
  saveRole,
  saveToken,
  saveUser,
} from "../../../storage/tokenStorage";
import type { UserRole } from "../model/AuthTypes";
import { authService } from "../service/authService";

const getLoginErrorMessage = (err: any) => {
  const message = err.response?.data?.message;

  if (typeof message === "string") {
    return message;
  }

  return "Unable to log in. Please try again.";
};

const needsEmailVerification = (err: any) => {
  const status = err.response?.status;
  const message = err.response?.data?.message;

  return (
    status === 403 &&
    typeof message === "string" &&
    (message.toLowerCase().includes("inactive") ||
      message.toLowerCase().includes("verify"))
  );
};

export const useLoginViewModel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);

  const login = async (): Promise<UserRole | null> => {
    setError(null);
    setPendingVerificationEmail(null);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return null;
    }

    try {
      setIsLoading(true);

      const response: any = await authService.login({
        email: email.trim(),
        password,
      });

      console.log("LOGIN RESPONSE:", response);

      const token = response.token || response.accessToken;
      const user = response.user;

      const role =
        response.role ||
        response.user?.role ||
        response.user?.roles?.[0]?.name ||
        response.user?.roles?.[0];

      if (!token) {
        throw new Error("Token missing from login response");
      }

      const loginEmail = user?.email || email.trim();
      let pendingPersonalNumber: string | null = null;

      try {
        pendingPersonalNumber = await getPendingPersonalNumber(loginEmail);
      } catch (storageErr) {
        console.log("GET PENDING PERSONAL NUMBER ERROR:", storageErr);
      }

      await saveToken(token);
      await saveUser({
        ...user,
        personalNumber: user?.personalNumber || pendingPersonalNumber || undefined,
      });

      try {
        const currentUser = await authService.debugGetMe();
        await saveUser({
          ...user,
          ...currentUser,
          personalNumber:
            currentUser.personalNumber ||
            user?.personalNumber ||
            pendingPersonalNumber ||
            undefined,
          role: (currentUser.role || role) as UserRole,
        });
      } catch (debugErr: any) {
        console.log("DEBUG /api/users/me ERROR STATUS:", debugErr.response?.status);
        console.log("DEBUG /api/users/me ERROR DATA:", debugErr.response?.data);
      }

      if (role) {
        await saveRole(role);
        try {
          await clearPendingPersonalNumber(loginEmail);
        } catch (storageErr) {
          console.log("CLEAR PENDING PERSONAL NUMBER ERROR:", storageErr);
        }
        return role as UserRole;
      }

      try {
        await clearPendingPersonalNumber(loginEmail);
      } catch (storageErr) {
        console.log("CLEAR PENDING PERSONAL NUMBER ERROR:", storageErr);
      }
      return "Patient" as UserRole;
    } catch (err: any) {
      console.log("LOGIN ERROR STATUS:", err.response?.status);
      console.log("LOGIN ERROR DATA:", err.response?.data);
      console.log("LOGIN ERROR FULL:", JSON.stringify(err.response?.data));
      console.log("LOGIN ERROR:", err);
      if (needsEmailVerification(err)) {
        setPendingVerificationEmail(email.trim());
        return null;
      }

      setError(getLoginErrorMessage(err));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    pendingVerificationEmail,
    login,
  };
};
