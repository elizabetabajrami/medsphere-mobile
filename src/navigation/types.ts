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
    token?: string;
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
  PatientProfile: undefined;
};

export type DoctorStackParamList = {
  DoctorHome: undefined;
  DoctorAppointments: undefined;
  AppointmentDetails: {
    appointmentId: string;
  };
};
