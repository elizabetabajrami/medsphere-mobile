export const endpoints = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    verifyEmail: "/api/auth/verify-email",
    forgotPassword: "/api/auth/forgot-password",
  },

  doctors: {
    list: "/api/users/doctors",
    byId: (doctorId: string) => `/doctors/${doctorId}`,
    appointments: (doctorId: string) => `/doctors/${doctorId}/appointments`,
  },

  patients: {
    me: "/api/users/me",
    byId: (patientId: string) => `/patients/${patientId}`,
    appointments: (patientId: string) => `/patients/${patientId}/appointments`,
  },

  appointments: {
    create: "/appointments",
    book: "/appointments",
    patientMine: "/appointments/my",
    doctorMine: "/appointments/doctor/my",
    byId: (appointmentId: string) => `/appointments/${appointmentId}`,
    updateStatus: (appointmentId: string) =>
      `/appointments/${appointmentId}/status`,
  },
};
