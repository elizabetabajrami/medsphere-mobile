export const endpoints = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    verifyEmail: "/api/auth/verify-email",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
  },

  doctors: {
    list: "/api/staff/doctors",
    byId: (doctorId: string) => `/doctors/${doctorId}`,
    appointments: (doctorId: string) => `/doctors/${doctorId}/appointments`,
    availableSlots: (doctorId: string, date: string) =>
      `/api/staff/doctors/${doctorId}/available-slots?date=${date}`,
  },

  patients: {
    create: "/api/patients",
    me: "/api/users/me",
    byId: (patientId: string) => `/patients/${patientId}`,
    appointments: (patientId: string) => `/patients/${patientId}/appointments`,
  },

  appointments: {
    create: "/api/appointments",
    book: "/api/appointments",
    patientMine: "/api/appointments/my",
    doctorMine: "/api/appointments/doctor/my",
    byId: (appointmentId: string) => `/api/appointments/${appointmentId}`,
    reschedule: (appointmentId: string) =>
      `/api/appointments/${appointmentId}/reschedule`,
    updateStatus: (appointmentId: string) =>
      `/api/appointments/${appointmentId}/status`,
  },
};
