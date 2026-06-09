import type { NavigatorScreenParams } from '@react-navigation/native';
import type { PatientAppointment } from '../features/appointments/model/Appointment';
import type { PatientDoctor } from '../features/patient/model/Patient';

export type AuthStackParamList = {
  Splash: undefined;
  Landing: undefined;
  Login: undefined;
  Register: undefined;
  VerifyEmail: {
    email: string;
    from?: 'Register' | 'Login';
  };
  ForgotPassword: undefined;
  ResetPassword: {
    email?: string;
    code?: string;
  };
};

export type PatientStackParamList = {
  PatientTabs: NavigatorScreenParams<PatientTabParamList> | undefined;
  DoctorDetails: {
    doctor: PatientDoctor;
  };
  BookAppointment: {
    doctor: PatientDoctor;
    appointment?: PatientAppointment;
  };
  AppointmentDetails: {
    appointment: PatientAppointment;
  };
  ProfileEdit: undefined;
};

export type PatientTabParamList = {
  PatientHome: undefined;
  PatientDoctors: undefined;
  PatientAppointments: undefined;
  PatientNotifications: undefined;
  PatientProfile: undefined;
};

export type DoctorStackParamList = {
  DoctorTabs: NavigatorScreenParams<DoctorTabParamList> | undefined;
  AppointmentDetails: {
    appointmentId: string;
  };
};

export type DoctorTabParamList = {
  DoctorHome: undefined;
  DoctorAppointments: undefined;
  DoctorNotifications: undefined;
  DoctorProfile: undefined;
};
