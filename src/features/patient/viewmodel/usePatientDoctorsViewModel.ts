import { useCallback, useEffect, useState } from 'react';
import type { PatientDoctor } from '../model/Patient';
import { patientService } from '../../../services/patientService';

export const usePatientDoctorsViewModel = () => {
  const [doctors, setDoctors] = useState<PatientDoctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDoctors = useCallback(async () => {
    setError(null);

    try {
      setIsLoading(true);
      const result = await patientService.getDoctors();
      setDoctors(result);
    } catch {
      setError('Unable to load doctors.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  return {
    doctors,
    isLoading,
    error,
    refresh: loadDoctors,
  };
};
