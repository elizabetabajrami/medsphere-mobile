import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PatientStackParamList, PatientTabParamList } from '../../../navigation/types';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { LoadingView } from '../../../shared/components/LoadingView';
import { usePatientAppointmentsViewModel } from '../viewmodel/usePatientAppointmentsViewModel';
import type { PatientAppointment } from '../../appointments/model/Appointment';

type PatientAppointmentsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<PatientTabParamList, 'PatientAppointments'>,
  NativeStackScreenProps<PatientStackParamList>
>;

const isCancelledAppointment = (appointment: PatientAppointment) =>
  appointment.status.toLowerCase() === 'cancelled';

export const PatientAppointmentsScreen = ({ navigation }: PatientAppointmentsScreenProps) => {
  const viewModel = usePatientAppointmentsViewModel();
  const { loadAppointments } = viewModel;

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, [loadAppointments])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Appointments</Text>
        <ErrorMessage message={viewModel.error} />
        {viewModel.isLoading && <LoadingView />}

        {!viewModel.isLoading && !viewModel.error && viewModel.appointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No appointments yet</Text>
          </View>
        ) : null}

        {!viewModel.isLoading && !viewModel.error ? (
          viewModel.appointments.map((appointment) => {
            const isCancelled = isCancelledAppointment(appointment);

            return (
            <View key={appointment.id} style={[styles.card, isCancelled && styles.cancelledCard]}>
              <View style={styles.cardHeader}>
                <View style={[styles.avatar, isCancelled && styles.cancelledAvatar]}>
                  <Ionicons
                    name={isCancelled ? 'close-circle-outline' : 'person-outline'}
                    size={26}
                    color={isCancelled ? '#B42318' : '#6B941F'}
                  />
                </View>
                <View style={styles.doctorInfo}>
                  <Text style={[styles.doctorName, isCancelled && styles.cancelledText]}>
                    {appointment.doctorName}
                  </Text>
                  <Text style={styles.specialty}>{appointment.specialty}</Text>
                </View>
                <View style={[styles.statusBadge, isCancelled && styles.cancelledStatusBadge]}>
                  <Text style={[styles.statusText, isCancelled && styles.cancelledStatusText]}>
                    {appointment.status}
                  </Text>
                </View>
              </View>

              <View style={styles.appointmentInfo}>
                <View style={styles.infoRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={isCancelled ? '#B42318' : '#6B941F'}
                  />
                  <Text style={[styles.infoText, isCancelled && styles.cancelledText]}>
                    {appointment.date}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={isCancelled ? '#B42318' : '#6B941F'}
                  />
                  <Text style={[styles.infoText, isCancelled && styles.cancelledText]}>
                    {appointment.time}
                  </Text>
                </View>
              </View>

              {isCancelled ? (
                <View style={styles.cancelledNotice}>
                  <Ionicons name="information-circle-outline" size={17} color="#B42318" />
                  <Text style={styles.cancelledNoticeText}>This appointment was cancelled.</Text>
                </View>
              ) : null}

              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('AppointmentDetails', { appointment })}
                style={[styles.detailsButton, isCancelled && styles.cancelledDetailsButton]}
              >
                <Text
                  style={[
                    styles.detailsButtonText,
                    isCancelled && styles.cancelledDetailsButtonText,
                  ]}
                >
                  View Details
                </Text>
              </Pressable>
            </View>
            );
          })
        ) : null}
      </ScrollView>
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  title: {
    color: '#303A28',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    padding: 18,
    shadowColor: '#23330D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  cancelledCard: {
    backgroundColor: '#FFFDFD',
    borderColor: '#F1CFCF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 16,
    marginRight: 12,
  },
  cancelledAvatar: {
    backgroundColor: '#FFF1EF',
  },
  doctorInfo: {
    flex: 1,
    paddingRight: 8,
  },
  doctorName: {
    color: '#1F271A',
    fontSize: 17,
    fontWeight: '800',
  },
  specialty: {
    color: '#66715E',
    fontSize: 13,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#F2F6EC',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    color: '#6B941F',
    fontSize: 12,
    fontWeight: '800',
  },
  cancelledStatusBadge: {
    backgroundColor: '#FFF1EF',
    borderColor: '#F1CFCF',
    borderWidth: 1,
  },
  cancelledStatusText: {
    color: '#B42318',
  },
  appointmentInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    color: '#303A28',
    fontSize: 13,
    fontWeight: '700',
  },
  cancelledText: {
    color: '#6F2A25',
  },
  cancelledNotice: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1EF',
    borderColor: '#F1CFCF',
    borderRadius: 13,
    borderWidth: 1,
    gap: 7,
    marginTop: 16,
    paddingHorizontal: 12,
  },
  cancelledNoticeText: {
    flex: 1,
    color: '#8F1F17',
    fontSize: 12,
    fontWeight: '800',
  },
  detailsButton: {
    alignItems: 'center',
    backgroundColor: '#6B941F',
    borderRadius: 14,
    marginTop: 18,
    paddingVertical: 13,
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  cancelledDetailsButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7C6C6',
    borderWidth: 1,
  },
  cancelledDetailsButtonText: {
    color: '#B42318',
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 20,
    borderWidth: 1,
    padding: 28,
  },
  emptyText: {
    color: '#66715E',
    fontSize: 15,
    fontWeight: '700',
  },
});
