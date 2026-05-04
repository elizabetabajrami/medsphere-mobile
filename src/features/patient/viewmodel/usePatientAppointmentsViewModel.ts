import { useState } from 'react';
import type { PatientAppointment } from '../../appointments/model/Appointment';

export const usePatientAppointmentsViewModel = () => {
  const [appointments] = useState<PatientAppointment[]>([
    {
      id: 'appointment-1',
      doctorName: 'Dr. Emily Johnson',
      specialty: 'General Practitioner',
      date: 'Apr 18, 2026',
      time: '10:30 AM',
      status: 'Confirmed',
    },
    {
      id: 'appointment-2',
      doctorName: 'Dr. Michael Chen',
      specialty: 'Cardiologist',
      date: 'Apr 22, 2026',
      time: '02:30 PM',
      status: 'Confirmed',
    },
  ]);

  return {
    appointments,
  };
};
