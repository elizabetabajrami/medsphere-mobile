import { useState } from 'react';
import type { PatientDoctor } from '../model/Patient';

export const usePatientDoctorsViewModel = () => {
  const [doctors] = useState<PatientDoctor[]>([
    {
      id: 'doctor-1',
      name: 'Dr. Emily Johnson',
      specialty: 'General Practitioner',
      rating: 4.9,
      reviews: 124,
    },
    {
      id: 'doctor-2',
      name: 'Dr. Michael Chen',
      specialty: 'Cardiologist',
      rating: 4.8,
      reviews: 98,
    },
    {
      id: 'doctor-3',
      name: 'Dr. Anna Smith',
      specialty: 'Dermatologist',
      rating: 4.7,
      reviews: 87,
    },
    {
      id: 'doctor-4',
      name: 'Dr. David Wilson',
      specialty: 'Neurologist',
      rating: 4.9,
      reviews: 76,
    },
  ]);

  return {
    doctors,
  };
};
