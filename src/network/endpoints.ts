export const endpoints = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    verifyEmail: "/api/auth/verify-email",
    resendVerification: "/api/auth/resend-verification",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
  },

  doctors: {
    list: "/api/public/staff",
    byId: (doctorId: string) => `/doctors/${doctorId}`,
    appointments: (doctorId: string) => `/api/staff/doctors/${doctorId}/appointments`,
    availableSlots: (doctorId: string, date: string) =>
      `/api/staff/doctors/${doctorId}/available-slots?date=${date}`,
  },

  patients: {
    list: "/api/patients",
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

  notifications: {
    list: "/api/notifications",
    pushTokens: "/api/notifications/push-tokens",
    pushTest: "/api/notifications/push-test",
    markAllRead: "/api/notifications/read-all",
    markRead: (notificationId: string) =>
      `/api/notifications/${notificationId}/read`,
    delete: (notificationId: string) => `/api/notifications/${notificationId}`,
  },

  chat: {
    rooms: "/api/chat/rooms",
    messages: (roomId: string) => `/api/chat/rooms/${roomId}/messages`,
    markRead: (roomId: string) => `/api/chat/rooms/${roomId}/read`,
    upload: (roomId: string) => `/api/chat/rooms/${roomId}/upload`,
  },
};
