import { useState } from "react";
import { saveRole, saveToken, saveUser } from "../../../storage/tokenStorage";
import type { UserRole } from "../model/AuthTypes";
import { authService } from "../service/authService";

const getLoginErrorMessage = (err: any) => {
  const message = err.response?.data?.message;

  if (typeof message === "string") {
    return message;
  }

  return "Unable to log in. Please try again.";
};

export const useLoginViewModel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (): Promise<UserRole | null> => {
    setError(null);

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

      await saveToken(token);
      await saveUser(user);

      try {
        await authService.debugGetMe();
      } catch (debugErr: any) {
        console.log("DEBUG /api/users/me ERROR STATUS:", debugErr.response?.status);
        console.log("DEBUG /api/users/me ERROR DATA:", debugErr.response?.data);
      }

      if (role) {
        await saveRole(role);
        return role as UserRole;
      }

      return "Patient" as UserRole;
    } catch (err: any) {
      console.log("LOGIN ERROR STATUS:", err.response?.status);
      console.log("LOGIN ERROR DATA:", err.response?.data);
      console.log("LOGIN ERROR FULL:", JSON.stringify(err.response?.data));
      console.log("LOGIN ERROR:", err);
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
    login,
  };
};
