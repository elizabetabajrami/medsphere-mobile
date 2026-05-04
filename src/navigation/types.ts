import type { NavigatorScreenParams } from '@react-navigation/native';
import type { PatientAppointment } from '../features/appointments/model/Appointment';
import type { PatientDoctor } from '../features/patient/model/Patient';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type PatientStackParamList = {
  PatientTabs: NavigatorScreenParams<PatientTabParamList> | undefined;
  BookAppointment: {
    doctor: PatientDoctor;
  };
  AppointmentDetails: {
    appointment: PatientAppointment;
  };
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
