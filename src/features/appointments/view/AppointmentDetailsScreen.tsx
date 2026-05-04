import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PatientStackParamList } from '../../../navigation/types';
import { useAppointmentDetailsViewModel } from '../viewmodel/useAppointmentDetailsViewModel';

type AppointmentDetailsScreenProps = NativeStackScreenProps<
  PatientStackParamList,
  'AppointmentDetails'
>;

export const AppointmentDetailsScreen = ({ navigation, route }: AppointmentDetailsScreenProps) => {
  const viewModel = useAppointmentDetailsViewModel(route.params.appointment);
  const { appointment, details } = viewModel;

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
        <Text style={styles.headerTitle}>Appointment Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={28} color="#6B941F" />
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{appointment.doctorName}</Text>
              <Text style={styles.specialty}>{appointment.specialty}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{appointment.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Date and Time</Text>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#6B941F" />
            <Text style={styles.detailText}>{appointment.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color="#6B941F" />
            <Text style={styles.detailText}>{appointment.time}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Appointment Info</Text>
          <InfoItem label="Location" value={details.location} icon="location-outline" />
          <InfoItem label="Type" value={details.type} icon="medkit-outline" />
          <InfoItem label="Notes" value={details.notes} icon="document-text-outline" />
        </View>

        <Pressable accessibilityRole="button" style={styles.rescheduleButton}>
          <Text style={styles.rescheduleButtonText}>Reschedule</Text>
        </Pressable>
        <Pressable accessibilityRole="button" style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

type InfoItemProps = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const InfoItem = ({ label, value, icon }: InfoItemProps) => (
  <View style={styles.infoItem}>
    <View style={styles.infoIcon}>
      <Ionicons name={icon} size={20} color="#6B941F" />
    </View>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
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
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 42,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
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
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 17,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
    paddingRight: 8,
  },
  doctorName: {
    color: '#1F271A',
    fontSize: 18,
    fontWeight: '800',
  },
  specialty: {
    color: '#66715E',
    fontSize: 14,
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
  sectionTitle: {
    color: '#303A28',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  detailText: {
    color: '#303A28',
    fontSize: 15,
    fontWeight: '700',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  infoIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 13,
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    color: '#66715E',
    fontSize: 12,
    fontWeight: '700',
  },
  infoValue: {
    color: '#1F271A',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 3,
  },
  rescheduleButton: {
    alignItems: 'center',
    backgroundColor: '#6B941F',
    borderRadius: 16,
    marginTop: 4,
    paddingVertical: 14,
  },
  rescheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E7C6C6',
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
    paddingVertical: 14,
  },
  cancelButtonText: {
    color: '#B42318',
    fontSize: 15,
    fontWeight: '800',
  },
});
