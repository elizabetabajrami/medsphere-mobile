import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
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
const SLOT_REFRESH_INTERVAL_MS = 15_000;

const isWeekendDate = (dateValue: string) => {
  const [year, month, day] = dateValue.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();

  return dayOfWeek === 0 || dayOfWeek === 6;
};

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

  const timeMatch = value.match(/T?(\d{1,2}):(\d{2})(?::\d{2})?/);

  if (timeMatch) {
    return `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
  }

  const parsedDate = new Date(value);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toTimeString().slice(0, 5);
  }

  return '';
};

const normalizeTimePart = (value?: string) => {
  if (!value) {
    return '';
  }

  const timeMatch = value.match(/(\d{1,2}):(\d{2})(?::\d{2})?/);

  if (!timeMatch) {
    return '';
  }

  return `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
};

const normalizeTimeForApi = (time?: string) => {
  const normalizedTime = normalizeTimePart(time);

  if (!normalizedTime) {
    return '';
  }

  return `${normalizedTime}:00`;
};

const createLocalDateTimeIso = (selectedDate: string, time?: string) => {
  const normalizedTime = normalizeTimeForApi(time);

  if (!selectedDate || !normalizedTime) {
    return '';
  }

  const [year, month, day] = selectedDate.split('-').map(Number);
  const [hour, minute] = normalizedTime.split(':').map(Number);
  const date = new Date(year, month - 1, day, hour, minute, 0, 0);

  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
};

const getLocalTimePart = (value?: string) => {
  if (!value) {
    return '';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return normalizeTimePart(value);
  }

  return parsedDate.toTimeString().slice(0, 5);
};

export const getSlotStartDateTime = (slot: AvailableSlot, selectedDate: string) => {
  if (slot.start) {
    return slot.start;
  }

  const startTime = slot.startTime || slot.time;
  const localDateTimeIso = createLocalDateTimeIso(selectedDate, startTime);

  if (localDateTimeIso) {
    return localDateTimeIso;
  }

  return '';
};

export const getSlotDisplayTime = (slot: AvailableSlot) =>
  normalizeTimePart(slot.startTime)
    || normalizeTimePart(slot.time)
    || normalizeTimePart(getLocalTimePart(slot.start))
    || '';

const formatMinutesAsTime = (minutes: number) => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const getAppointmentDateTime = (appointment: Appointment) =>
  appointment.date || appointment.appointmentDate || appointment.scheduledAt || appointment.start;

const getAppointmentTime = (appointment: Appointment) =>
  getTimePart(getAppointmentDateTime(appointment))
    || normalizeTimePart(appointment.startTime);

const getAppointmentId = (appointment: Appointment) => appointment.id || appointment._id || '';

const isBlockingAppointment = (appointment: Appointment, appointmentId?: string) => {
  if (appointmentId && getAppointmentId(appointment) === appointmentId) {
    return false;
  }

  const status = String(appointment.status || '').toLowerCase();
  return status === 'pending' || status === 'confirmed' || status === 'scheduled';
};

const createDailySlots = (selectedDate: string, durationMinutes: number): AvailableSlot[] => {
  const slots: AvailableSlot[] = [];
  const startMinutes = DEFAULT_WORK_START_HOUR * 60;
  const endMinutes = DEFAULT_WORK_END_HOUR * 60;

  for (let minutes = startMinutes; minutes < endMinutes; minutes += durationMinutes) {
    const startTime = formatMinutesAsTime(minutes);
    const endTime = formatMinutesAsTime(minutes + durationMinutes);

    slots.push({
      start: createLocalDateTimeIso(selectedDate, startTime),
      end: createLocalDateTimeIso(selectedDate, endTime),
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
  occupiedSlots: AvailableSlot[],
  appointments: Appointment[],
  selectedDate: string,
  appointmentId?: string,
) => {
  const availableSlotsByTime = new Map(
    availableSlots
      .map((slot) => [getSlotDisplayTime(slot), slot] as const)
      .filter(([time]) => Boolean(time)),
  );
  const occupiedSlotsByTime = new Map(
    occupiedSlots
      .map((slot) => [getSlotDisplayTime(slot), slot] as const)
      .filter(([time]) => Boolean(time)),
  );

  const bookedTimes = new Set([
    ...occupiedSlotsByTime.keys(),
    ...appointments
      .filter((appointment) => isBlockingAppointment(appointment, appointmentId))
      .filter((appointment) => getDatePart(getAppointmentDateTime(appointment)) === selectedDate)
      .map(getAppointmentTime)
      .filter(Boolean),
  ]);

  return createDailySlots(selectedDate, DEFAULT_SLOT_DURATION_MINUTES)
    .filter((slot) => {
      const slotTime = getSlotDisplayTime(slot);
      return availableSlotsByTime.has(slotTime) || bookedTimes.has(slotTime);
    })
    .map((slot) => {
      const slotTime = getSlotDisplayTime(slot);
      const isBooked = bookedTimes.has(slotTime);
      const serverSlot = availableSlotsByTime.get(slotTime)
        ?? occupiedSlotsByTime.get(slotTime);

      return {
        ...slot,
        ...serverSlot,
        isAvailable: availableSlotsByTime.has(slotTime) && !isBooked,
      };
    });
};

const filterSlotsForSelectedDate = (
  slots: AvailableSlot[],
  occupiedSlots: AvailableSlot[],
  appointments: Appointment[],
  selectedDate: string,
  appointmentId?: string,
) =>
  createBookableSlots(slots, occupiedSlots, appointments, selectedDate, appointmentId);

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

const getBookingErrorMessage = (err: unknown, mode: BookingMode = 'book') => {
  const action = mode === 'reschedule' ? 'reschedule appointment' : 'book appointment';

  if (!isAxiosError(err)) {
    return err instanceof Error ? err.message : `Unable to ${action}. Please try again.`;
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
    ? `${status}: Unable to ${action}.`
    : `Unable to ${action}. Please try again.`;
};

type BookingMode = 'book' | 'reschedule';

export const useBookAppointmentViewModel = (
  doctorId: string,
  options?: {
    appointmentId?: string;
    mode?: BookingMode;
    staffProfileId?: string;
  },
) => {
  const [dateOptions] = useState(createDateOptions);
  const [timeSlots, setTimeSlots] = useState<AvailableSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]?.id || '');
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsRefreshKey, setSlotsRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [unavailableSlotMessage, setUnavailableSlotMessage] = useState<string | null>(null);

  const canConfirm = Boolean(selectedDate && selectedTime) && !isLoadingSlots;
  const mode = options?.mode || 'book';
  const appointmentId = options?.appointmentId;
  const staffProfileId = options?.staffProfileId || doctorId;
  const selectedDateIsWeekend = isWeekendDate(selectedDate);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlotsRefreshKey((current) => current + 1);
    }, SLOT_REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setSelectedTime('');
    setUnavailableSlotMessage(null);
  }, [doctorId, selectedDate]);

  useEffect(() => {
    let isCurrentRequest = true;

    const loadAvailableSlots = async () => {
      if (!doctorId || !selectedDate) {
        if (isCurrentRequest) {
          setTimeSlots([]);
          setSelectedTime('');
        }
        return;
      }

      if (isWeekendDate(selectedDate)) {
        if (isCurrentRequest) {
          setTimeSlots([]);
          setError(null);
          setIsLoadingSlots(false);
        }
        return;
      }

      try {
        if (isCurrentRequest) {
          setIsLoadingSlots(true);
          setError(null);
        }

        const [slotAvailability, doctorAppointments] = await Promise.all([
          appointmentService.getAvailableSlots(doctorId, selectedDate),
          appointmentService.getDoctorAppointments(doctorId).catch(() => []),
        ]);

        if (isCurrentRequest) {
          const nextTimeSlots = filterSlotsForSelectedDate(
            slotAvailability.availableSlots,
            slotAvailability.occupiedSlots,
            doctorAppointments,
            selectedDate,
            appointmentId,
          );

          setTimeSlots(nextTimeSlots);
          setSelectedTime((current) => {
            const remainsAvailable = nextTimeSlots.some(
              (slot) =>
                slot.isAvailable &&
                getSlotStartDateTime(slot, selectedDate) === current,
            );

            return current && !remainsAvailable ? '' : current;
          });
        }
      } catch (err) {
        if (isCurrentRequest) {
          setTimeSlots([]);
          setError(getBookingErrorMessage(err));
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoadingSlots(false);
        }
      }
    };

    loadAvailableSlots();

    return () => {
      isCurrentRequest = false;
    };
  }, [appointmentId, doctorId, selectedDate, slotsRefreshKey]);

  const confirmBooking = async () => {
    if (!canConfirm || isLoading) {
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (mode === 'reschedule' && appointmentId) {
        await appointmentService.rescheduleAppointment(appointmentId, {
          doctorId: staffProfileId,
          date: selectedTime,
        });

        return true;
      }

      await appointmentService.bookAppointment({
        doctorId,
        staffProfileId,
        date: selectedTime,
        reason: 'General consultation',
      });

      return true;
    } catch (err) {
      setError(getBookingErrorMessage(err, mode));

      if (isAxiosError(err) && err.response?.status === 409) {
        setSelectedTime('');
        setSlotsRefreshKey((current) => current + 1);
      }

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
    emptySlotsMessage: selectedDateIsWeekend
      ? 'The doctor does not work on weekends. Please select a weekday.'
      : 'No available times for this date.',
    unavailableSlotMessage,
    clearUnavailableSlotMessage: () => setUnavailableSlotMessage(null),
    confirmBooking,
  };
};
