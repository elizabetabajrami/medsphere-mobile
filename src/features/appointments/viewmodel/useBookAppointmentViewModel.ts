import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { getUser } from '../../../storage/tokenStorage';
import { patientService } from '../../patient/service/patientService';
import { appointmentService } from '../service/appointmentService';
import type { AvailableSlot } from '../model/Appointment';

type DateOption = {
  id: string;
  day: string;
  date: string;
  month: string;
};

const formatDateForApi = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const createDateOptions = () => {
  const options: DateOption[] = [];

  for (let index = 0; index < 21; index += 1) {
    const date = new Date();
    date.setDate(date.getDate() + index);

    options.push({
      id: formatDateForApi(date),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.toLocaleDateString('en-US', { day: 'numeric' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    });
  }

  return options;
};

const getBookingErrorMessage = (err: unknown) => {
  if (!isAxiosError(err)) {
    return 'Unable to book appointment. Please try again.';
  }

  const status = err.response?.status;
  const data = err.response?.data;

  if (typeof data === 'string') {
    return status ? `${status}: ${data}` : data;
  }

  if (data && typeof data === 'object') {
    const responseData = data as {
      message?: string | string[];
      error?: string;
      detail?: string;
    };
    const message = Array.isArray(responseData.message)
      ? responseData.message.join(', ')
      : responseData.message;

    if (message || responseData.error || responseData.detail) {
      return [status, message || responseData.error || responseData.detail]
        .filter(Boolean)
        .join(': ');
    }
  }

  return status
    ? `${status}: Unable to book appointment.`
    : 'Unable to book appointment. Please try again.';
};

const isPatientProfileAlreadyCreated = (err: unknown) => {
  if (!isAxiosError(err)) {
    return false;
  }

  const status = err.response?.status;
  const data = err.response?.data;
  const message =
    typeof data === 'object' && data
      ? String((data as { message?: unknown }).message || '')
      : typeof data === 'string'
        ? data
        : '';

  return status === 409 || message.toLowerCase().includes('already');
};

const ensurePatientProfile = async () => {
  const user = await getUser();

  if (!user?.email) {
    throw new Error('Unable to find your patient account.');
  }

  const firstName = user.firstName?.trim() || user.name?.trim().split(' ')[0] || 'Patient';
  const lastName =
    user.lastName?.trim() ||
    user.name
      ?.trim()
      .split(' ')
      .slice(1)
      .join(' ') ||
    'User';

  try {
    await patientService.createPatientProfile({
      firstName,
      lastName,
      email: user.email,
    });
  } catch (err) {
    if (!isPatientProfileAlreadyCreated(err)) {
      throw err;
    }
  }
};

export const useBookAppointmentViewModel = (doctorId: string) => {
  const [dateOptions] = useState(createDateOptions);
  const [timeSlots, setTimeSlots] = useState<AvailableSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]?.id || '');
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canConfirm = Boolean(selectedDate && selectedTime) && !isLoadingSlots;

  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!doctorId || !selectedDate) {
        setTimeSlots([]);
        setSelectedTime('');
        return;
      }

      try {
        setIsLoadingSlots(true);
        setError(null);
        setSelectedTime('');

        const slots = await appointmentService.getAvailableSlots(doctorId, selectedDate);
        setTimeSlots(slots);
      } catch (err) {
        setTimeSlots([]);
        setError(getBookingErrorMessage(err));
      } finally {
        setIsLoadingSlots(false);
      }
    };

    loadAvailableSlots();
  }, [doctorId, selectedDate]);

  const confirmBooking = async () => {
    if (!canConfirm || isLoading) {
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      await ensurePatientProfile();

      await appointmentService.bookAppointment({
        doctorId,
        date: selectedTime,
        reason: 'General consultation',
      });

      return true;
    } catch (err) {
      setError(getBookingErrorMessage(err));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dateOptions,
    timeSlots,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    canConfirm,
    isLoading,
    isLoadingSlots,
    error,
    confirmBooking,
  };
};
