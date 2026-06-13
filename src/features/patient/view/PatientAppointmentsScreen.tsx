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
import {
  type PatientAppointmentFilter,
  usePatientAppointmentsViewModel,
} from '../viewmodel/usePatientAppointmentsViewModel';

type PatientAppointmentsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<PatientTabParamList, 'PatientAppointments'>,
  NativeStackScreenProps<PatientStackParamList>
>;

const filters: { key: PatientAppointmentFilter; label: string }[] = [
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'completed', label: 'Completed' },
];

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
        <View style={styles.filterList}>
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
        </View>
        <ErrorMessage message={viewModel.error} />
        {viewModel.isLoading && <LoadingView />}

        {!viewModel.isLoading && !viewModel.error && viewModel.filteredAppointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No {viewModel.selectedFilter} appointments.
            </Text>
          </View>
        ) : null}

        {!viewModel.isLoading && !viewModel.error ? (
          viewModel.filteredAppointments.map((appointment) => {
            const isCompleted = appointment.status === 'Completed';

            return (
            <View key={appointment.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.avatar, isCompleted && styles.completedAvatar]}>
                  <Ionicons
                    name={isCompleted ? 'checkmark-circle-outline' : 'person-outline'}
                    size={26}
                    color="#6B941F"
                  />
                </View>
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{appointment.doctorName}</Text>
                  <Text style={styles.specialty}>{appointment.specialty}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{appointment.status}</Text>
                </View>
              </View>

              <View style={styles.appointmentInfo}>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={18} color="#6B941F" />
                  <Text style={styles.infoText}>{appointment.date}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={18} color="#6B941F" />
                  <Text style={styles.infoText}>{appointment.time}</Text>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('AppointmentDetails', { appointment })}
                style={styles.detailsButton}
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
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
  filterList: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  filterTab: {
    minHeight: 38,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE6D2',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
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
  completedAvatar: {
    backgroundColor: '#EAF4DD',
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
  emptyText: {
    color: '#66715E',
    fontSize: 15,
    fontWeight: '700',
  },
});
