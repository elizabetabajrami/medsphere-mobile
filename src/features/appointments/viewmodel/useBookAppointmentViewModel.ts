import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { getUser } from '../../../storage/tokenStorage';
import { patientService } from '../../patient/service/patientService';
import { appointmentService } from '../service/appointmentService';
import type { Appointment, AvailableSlot } from '../model/Appointment';

type DateOption = {
  id: string;
  day: string;
  date: string;
  month: string;
};

const DEFAULT_SLOT_DURATION_MINUTES = 30;
const DEFAULT_WORK_START_HOUR = 8;
const DEFAULT_WORK_END_HOUR = 17;

const formatDateForApi = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getDatePart = (value?: string) => {
  if (!value) {
    return '';
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? '' : formatDateForApi(parsedDate);
};

const getTimePart = (value?: string) => {
  if (!value) {
    return '';
  }

  const timeMatch = value.match(/T?(\d{2}:\d{2})/);

  if (timeMatch) {
    return timeMatch[1];
  }

  const parsedDate = new Date(value);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toTimeString().slice(0, 5);
  }

  return '';
};

const normalizeTimeForApi = (time?: string) => {
  if (!time) {
    return '';
  }

  const timeMatch = time.match(/(\d{2}:\d{2})(?::\d{2})?/);

  if (!timeMatch) {
    return '';
  }

  return `${timeMatch[1]}:00`;
};

export const getSlotStartDateTime = (slot: AvailableSlot, selectedDate: string) => {
  if (slot.start) {
    return slot.start;
  }

  const startTime = normalizeTimeForApi(slot.startTime || slot.time);

  if (!selectedDate || !startTime) {
    return '';
  }

  return `${selectedDate}T${startTime}.000Z`;
};

export const getSlotDisplayTime = (slot: AvailableSlot) =>
  slot.startTime || slot.time || getTimePart(slot.start) || '';

const formatMinutesAsTime = (minutes: number) => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const getSlotDuration = (slots: AvailableSlot[]) =>
  slots.find((slot) => slot.durationMinutes)?.durationMinutes || DEFAULT_SLOT_DURATION_MINUTES;

const getAppointmentDateTime = (appointment: Appointment) =>
  appointment.date || appointment.appointmentDate || appointment.scheduledAt || appointment.start;

const getAppointmentTime = (appointment: Appointment) =>
  getTimePart(getAppointmentDateTime(appointment)) || getTimePart(appointment.startTime);

const getAppointmentId = (appointment: Appointment) => appointment.id || appointment._id || '';

const isBlockingAppointment = (appointment: Appointment, appointmentId?: string) => {
  const status = appointment.status.toLowerCase();

  if (status === 'cancelled' || status === 'completed') {
    return false;
  }

  if (appointmentId && getAppointmentId(appointment) === appointmentId) {
    return false;
  }

  return true;
};

const createDailySlots = (selectedDate: string, durationMinutes: number): AvailableSlot[] => {
  const slots: AvailableSlot[] = [];
  const startMinutes = DEFAULT_WORK_START_HOUR * 60;
  const endMinutes = DEFAULT_WORK_END_HOUR * 60;

  for (let minutes = startMinutes; minutes < endMinutes; minutes += durationMinutes) {
    const startTime = formatMinutesAsTime(minutes);
    const endTime = formatMinutesAsTime(minutes + durationMinutes);

    slots.push({
      start: `${selectedDate}T${startTime}:00.000Z`,
      end: `${selectedDate}T${endTime}:00.000Z`,
      startTime,
      endTime,
      durationMinutes,
      isAvailable: false,
    });
  }

  return slots;
};

const createBookableSlots = (
  availableSlots: AvailableSlot[],
  appointments: Appointment[],
  selectedDate: string,
  appointmentId?: string,
) => {
  const availableSlotsByTime = new Map(
    availableSlots
      .map((slot) => {
        const time =
          getTimePart(getSlotStartDateTime(slot, selectedDate)) ||
          getTimePart(slot.startTime || slot.time);

        return time ? [time, slot] : null;
      })
      .filter((entry): entry is [string, AvailableSlot] => Boolean(entry)),
  );

  const bookedTimes = new Set(
    appointments
      .filter((appointment) => isBlockingAppointment(appointment, appointmentId))
      .filter((appointment) => getDatePart(getAppointmentDateTime(appointment)) === selectedDate)
      .map(getAppointmentTime)
      .filter(Boolean),
  );

  return createDailySlots(selectedDate, getSlotDuration(availableSlots)).map((slot) => {
    const slotTime = getSlotDisplayTime(slot);
    const availableSlot = availableSlotsByTime.get(slotTime);
    const isBooked = bookedTimes.has(slotTime);

    return {
      ...slot,
      ...availableSlot,
      isAvailable: Boolean(availableSlot) && !isBooked,
    };
  });
};

const filterSlotsForSelectedDate = (
  slots: AvailableSlot[],
  appointments: Appointment[],
  selectedDate: string,
  appointmentId?: string,
) =>
  createBookableSlots(slots.filter((slot) => {
    const slotStart = getSlotStartDateTime(slot, selectedDate);
    const slotDate = getDatePart(slotStart) || selectedDate;

    return Boolean(slotStart) && slotDate === selectedDate;
  }), appointments, selectedDate, appointmentId);

const createDateOptions = () => {
  const options: DateOption[] = [];

  for (let index = 1; index <= 21; index += 1) {
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

type BookingMode = 'book' | 'reschedule';

export const useBookAppointmentViewModel = (
  doctorId: string,
  options?: {
    appointmentId?: string;
    mode?: BookingMode;
  },
) => {
  const [dateOptions] = useState(createDateOptions);
  const [timeSlots, setTimeSlots] = useState<AvailableSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]?.id || '');
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unavailableSlotMessage, setUnavailableSlotMessage] = useState<string | null>(null);

  const canConfirm = Boolean(selectedDate && selectedTime) && !isLoadingSlots;
  const mode = options?.mode || 'book';
  const appointmentId = options?.appointmentId;

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

        const [slots, doctorAppointments] = await Promise.all([
          appointmentService.getAvailableSlots(doctorId, selectedDate),
          appointmentService.getDoctorAppointments(doctorId).catch(() => []),
        ]);

        setTimeSlots(filterSlotsForSelectedDate(
          slots,
          doctorAppointments,
          selectedDate,
          appointmentId,
        ));
      } catch (err) {
        setTimeSlots([]);
        setError(getBookingErrorMessage(err));
      } finally {
        setIsLoadingSlots(false);
      }
    };

    loadAvailableSlots();
  }, [appointmentId, doctorId, selectedDate]);

  const confirmBooking = async () => {
    if (!canConfirm || isLoading) {
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (mode === 'reschedule' && appointmentId) {
        await appointmentService.rescheduleAppointment(appointmentId, {
          doctorId,
          date: selectedTime,
        });

        return true;
      }

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

  const selectTimeSlot = (slot: AvailableSlot) => {
    if (!slot.isAvailable) {
      setSelectedTime('');
      setUnavailableSlotMessage('No appointment is available for this time on the selected date.');
      return;
    }

    setUnavailableSlotMessage(null);
    setSelectedTime(getSlotStartDateTime(slot, selectedDate));
  };

  return {
    mode,
    dateOptions,
    timeSlots,
    selectedDate,
    setSelectedDate,
    selectedTime,
    selectTimeSlot,
    canConfirm,
    isLoading,
    isLoadingSlots,
    error,
    unavailableSlotMessage,
    clearUnavailableSlotMessage: () => setUnavailableSlotMessage(null),
    confirmBooking,
  };
};
