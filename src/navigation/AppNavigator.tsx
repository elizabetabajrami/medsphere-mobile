import { NavigationContainer } from "@react-navigation/native";
import { useState } from "react";
import type { UserRole } from "../features/auth/model/AuthTypes";
import { AuthNavigator } from "./AuthNavigator";
import { DoctorNavigator } from "./DoctorNavigator";
import { PatientNavigator } from "./PatientNavigator";

const linking = {
  prefixes: ["medspheremobile://"],
  config: {
    screens: {
      ResetPassword: "reset-password",
    },
  },
};

export const AppNavigator = () => {
  const [role, setRole] = useState<UserRole | string | null>(null);

  const handleAuthenticated = (nextRole: UserRole | string) => {
    setRole(nextRole);
  };

  const handleLogout = () => {
    setRole(null);
  };

  const normalizedRole = role?.toLowerCase();

  return (
    <NavigationContainer linking={linking}>
      {!role ? (
        <AuthNavigator onAuthenticated={handleAuthenticated} />
      ) : normalizedRole === "doctor" ? (
        <DoctorNavigator onLogout={handleLogout} />
      ) : (
        <PatientNavigator onLogout={handleLogout} />
      )}
    </NavigationContainer>
  );
};
