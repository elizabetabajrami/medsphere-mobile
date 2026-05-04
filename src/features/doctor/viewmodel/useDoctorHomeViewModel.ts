import { useState } from 'react';

export const useDoctorHomeViewModel = () => {
  const [welcomeMessage] = useState('Welcome, Doctor');

  return {
    welcomeMessage,
  };
};
