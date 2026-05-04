export const endpoints = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    forgotPassword: "/api/auth/forgot-password",
  },

  doctors: {
    list: "/doctors",
    byId: (doctorId: string) => `/doctors/${doctorId}`,
  },

  patients: {
    me: "/api/users/me",
  },

  appointments: {
    create: "/appointments",
    patientMine: "/appointments/my",
    doctorMine: "/appointments/doctor/my",
    updateStatus: (appointmentId: string) =>
      `/appointments/${appointmentId}/status`,
  },
};
