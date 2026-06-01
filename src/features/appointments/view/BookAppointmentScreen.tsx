import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PatientStackParamList } from '../../../navigation/types';
import { AppFeedbackModal } from '../../../shared/components/AppFeedbackModal';
import { useBookAppointmentViewModel } from '../viewmodel/useBookAppointmentViewModel';

type BookAppointmentScreenProps = NativeStackScreenProps<PatientStackParamList, 'BookAppointment'>;

export const BookAppointmentScreen = ({ navigation, route }: BookAppointmentScreenProps) => {
  const { doctor } = route.params;
  const viewModel = useBookAppointmentViewModel(doctor.id);
  const timeSlots = Array.isArray(viewModel.timeSlots) ? viewModel.timeSlots : [];
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    if (viewModel.error) {
      setBookingError(viewModel.error);
    }
  }, [viewModel.error]);

  const handleConfirm = async () => {
    const didBook = await viewModel.confirmBooking();

    if (!didBook) {
      return;
    }

    setIsSuccessModalVisible(true);
  };

  const handleSuccessClose = () => {
    setIsSuccessModalVisible(false);
    navigation.navigate('PatientTabs', {
      screen: 'PatientAppointments',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#303A28" />
        </Pressable>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.doctorCard}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={30} color="#6B941F" />
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.specialty}>{doctor.specialty}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateList}
        >
          {viewModel.dateOptions.map((date) => {
            const isSelected = viewModel.selectedDate === date.id;

            return (
              <Pressable
                key={date.id}
                accessibilityRole="button"
                onPress={() => viewModel.setSelectedDate(date.id)}
                style={[styles.dateCard, isSelected && styles.selectedOption]}
              >
                <Text style={[styles.dateDay, isSelected && styles.selectedText]}>{date.day}</Text>
                <Text style={[styles.dateNumber, isSelected && styles.selectedText]}>{date.date}</Text>
                <Text style={[styles.dateMonth, isSelected && styles.selectedText]}>{date.month}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Select Time</Text>
        {viewModel.isLoadingSlots ? <Text style={styles.emptyText}>Loading available times...</Text> : null}
        {!viewModel.isLoadingSlots && viewModel.selectedDate && timeSlots.length === 0 ? (
          <Text style={styles.emptyText}>No available times for this date.</Text>
        ) : null}
        <View style={styles.timeGrid}>
          {timeSlots.map((slot) => {
            const isSelected = viewModel.selectedTime === slot.start;

            return (
              <Pressable
                key={slot.start}
                accessibilityRole="button"
                onPress={() => viewModel.setSelectedTime(slot.start)}
                style={[styles.timeSlot, isSelected && styles.selectedOption]}
              >
                <Text style={[styles.timeText, isSelected && styles.selectedText]}>
                  {slot.startTime}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          disabled={!viewModel.canConfirm || viewModel.isLoading}
          onPress={handleConfirm}
          style={[
            styles.confirmButton,
            (!viewModel.canConfirm || viewModel.isLoading) && styles.confirmButtonDisabled,
          ]}
        >
          <Text style={styles.confirmButtonText}>
            {viewModel.isLoading ? 'Booking...' : 'Confirm Booking'}
          </Text>
        </Pressable>
      </View>

      <AppFeedbackModal
        visible={isSuccessModalVisible}
        type="success"
        title="Appointment Booked"
        message="Your appointment request has been submitted successfully."
        primaryButtonText="View Appointments"
        onClose={handleSuccessClose}
      />

      <AppFeedbackModal
        visible={Boolean(bookingError)}
        type="error"
        title="Booking Failed"
        message={bookingError || ''}
        primaryButtonText="Try Again"
        onClose={() => setBookingError(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 14,
    borderWidth: 1,
  },
  headerTitle: {
    color: '#303A28',
    fontSize: 18,
    fontWeight: '800',
  },
  headerSpacer: {
    width: 42,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 120,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#23330D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  avatar: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 18,
    marginRight: 14,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    color: '#1F271A',
    fontSize: 18,
    fontWeight: '800',
  },
  specialty: {
    color: '#66715E',
    fontSize: 14,
    marginTop: 5,
  },
  sectionTitle: {
    color: '#303A28',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 26,
    marginBottom: 14,
  },
  dateList: {
    gap: 10,
    paddingRight: 20,
  },
  dateCard: {
    width: 78,
    minHeight: 96,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 18,
    borderWidth: 1,
  },
  selectedOption: {
    backgroundColor: '#F2F6EC',
    borderColor: '#6B941F',
    borderWidth: 2,
  },
  dateDay: {
    color: '#66715E',
    fontSize: 12,
    fontWeight: '700',
  },
  dateNumber: {
    color: '#1F271A',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
  },
  dateMonth: {
    color: '#66715E',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
  selectedText: {
    color: '#6B941F',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    width: '47%',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 16,
    borderWidth: 1,
  },
  timeText: {
    color: '#303A28',
    fontSize: 14,
    fontWeight: '800',
  },
  emptyText: {
    color: '#66715E',
    fontSize: 14,
    marginBottom: 12,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F8FAF5',
    borderTopColor: '#E8EEDF',
    borderTopWidth: 1,
    padding: 20,
  },
  confirmButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B941F',
    borderRadius: 16,
  },
  confirmButtonDisabled: {
    backgroundColor: '#C9DDB1',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
