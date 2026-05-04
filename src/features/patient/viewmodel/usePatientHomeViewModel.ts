import { useState } from 'react';

export const usePatientHomeViewModel = () => {
  const [patientName] = useState('Sarah');
  const [stats] = useState([
    { label: 'Heart Rate', value: '72' },
    { label: 'Steps', value: '8.5K' },
    { label: 'Sleep', value: '7.2h' },
  ]);
  const [nextAppointment] = useState({
    doctorName: 'Dr. Emily Johnson',
    specialty: 'General Practitioner',
    date: 'Apr 18, 2026',
    time: '10:30 AM',
    status: 'Confirmed',
  });
  const [quickActions] = useState(['Book Appointment', 'Find Doctors', 'Messages']);
  const [healthSummary] = useState([
    { label: 'Blood Pressure', value: '120/80' },
    { label: 'Weight', value: '65 kg' },
  ]);

  return {
    patientName,
    stats,
    nextAppointment,
    quickActions,
    healthSummary,
  };
};
