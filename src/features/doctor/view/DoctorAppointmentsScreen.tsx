import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { DoctorStackParamList, DoctorTabParamList } from '../../../navigation/types';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { LoadingView } from '../../../shared/components/LoadingView';
import type { Appointment } from '../../appointments/model/Appointment';
import {
  formatAppointmentDate,
  formatAppointmentTime,
  formatStatus,
  getAppointmentId,
} from '../utils/appointmentFormatters';
import {
  DoctorAppointmentFilter,
  useDoctorAppointmentsViewModel,
} from '../viewmodel/useDoctorAppointmentsViewModel';

type DoctorAppointmentsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<DoctorTabParamList, 'DoctorAppointments'>,
  NativeStackScreenProps<DoctorStackParamList>
>;

const filters: { key: DoctorAppointmentFilter; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'no-show', label: 'No Show' },
];

export const DoctorAppointmentsScreen = ({ navigation }: DoctorAppointmentsScreenProps) => {
  const viewModel = useDoctorAppointmentsViewModel();
  const { loadAppointments } = viewModel;

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, [loadAppointments]),
  );

  const openDetails = (appointment: Appointment) => {
    const appointmentId = getAppointmentId(appointment);

    if (appointmentId) {
      navigation.navigate('AppointmentDetails', { appointmentId });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Appointments</Text>
        <Text style={styles.subtitle}>All appointments assigned to you</Text>

        <ScrollView
          horizontal
          contentContainerStyle={styles.filterList}
          showsHorizontalScrollIndicator={false}
        >
          {filters.map((filter) => {
            const isSelected = viewModel.selectedFilter === filter.key;

            return (
              <Pressable
                key={filter.key}
                accessibilityRole="button"
                onPress={() => viewModel.setSelectedFilter(filter.key)}
                style={[styles.filterTab, isSelected && styles.filterTabActive]}
              >
                <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ErrorMessage message={viewModel.error} />
        {viewModel.isLoading ? <LoadingView /> : null}

        {!viewModel.isLoading && !viewModel.error && viewModel.filteredAppointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="calendar-clear-outline" size={26} color="#6B941F" />
            </View>
            <Text style={styles.emptyTitle}>No appointments found</Text>
            <Text style={styles.emptyText}>There are no appointments in this view.</Text>
          </View>
        ) : null}

        {!viewModel.isLoading && !viewModel.error
          ? viewModel.filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={getAppointmentId(appointment)}
                appointment={appointment}
                onViewDetails={() => openDetails(appointment)}
              />
            ))
          : null}
      </ScrollView>
    </SafeAreaView>
  );
};

type AppointmentCardProps = {
  appointment: Appointment;
  onViewDetails: () => void;
};

const AppointmentCard = ({ appointment, onViewDetails }: AppointmentCardProps) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.avatar}>
        <Ionicons name="calendar-outline" size={24} color="#6B941F" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardDate}>{formatAppointmentDate(appointment)}</Text>
        <Text style={styles.cardTime}>{formatAppointmentTime(appointment)}</Text>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{formatStatus(appointment.status)}</Text>
      </View>
    </View>

    <Pressable accessibilityRole="button" onPress={onViewDetails} style={styles.detailsButton}>
      <Text style={styles.detailsButtonText}>View Details</Text>
    </Pressable>
  </View>
);

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
  },
  subtitle: {
    color: '#66715E',
    fontSize: 15,
    marginTop: 6,
    marginBottom: 16,
  },
  filterList: {
    gap: 8,
    paddingBottom: 16,
  },
  filterTab: {
    minHeight: 38,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE6D2',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  filterTabActive: {
    backgroundColor: '#6B941F',
    borderColor: '#6B941F',
  },
  filterText: {
    color: '#66715E',
    fontSize: 13,
    fontWeight: '800',
  },
  filterTextActive: {
    color: '#FFFFFF',
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
  cardInfo: {
    flex: 1,
    paddingRight: 8,
  },
  cardDate: {
    color: '#1F271A',
    fontSize: 17,
    fontWeight: '800',
  },
  cardTime: {
    color: '#66715E',
    fontSize: 13,
    fontWeight: '700',
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
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 20,
    borderWidth: 1,
    padding: 28,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 18,
    marginBottom: 10,
  },
  emptyTitle: {
    color: '#303A28',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyText: {
    color: '#66715E',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
});
