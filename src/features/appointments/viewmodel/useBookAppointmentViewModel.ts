import { useState } from 'react';

const createDateOptions = () => {
  const options = [];

  for (let index = 0; index < 7; index += 1) {
    const date = new Date();
    date.setDate(date.getDate() + index);

    options.push({
      id: date.toISOString(),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.toLocaleDateString('en-US', { day: 'numeric' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    });
  }

  return options;
};

export const useBookAppointmentViewModel = () => {
  const [dateOptions] = useState(createDateOptions);
  const [timeSlots] = useState(['09:00 AM', '09:30 AM', '10:30 AM', '11:00 AM', '01:00 PM', '02:30 PM', '03:00 PM', '04:30 PM']);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const canConfirm = Boolean(selectedDate && selectedTime);

  const confirmBooking = () => canConfirm;

  return {
    dateOptions,
    timeSlots,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    canConfirm,
    confirmBooking,
  };
};
