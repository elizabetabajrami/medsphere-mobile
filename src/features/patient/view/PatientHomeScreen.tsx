import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PatientStackParamList, PatientTabParamList } from '../../../navigation/types';
import { usePatientHomeViewModel } from '../viewmodel/usePatientHomeViewModel';

type PatientHomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<PatientTabParamList, 'PatientHome'>,
  NativeStackScreenProps<PatientStackParamList>
>;

export const PatientHomeScreen = ({ navigation }: PatientHomeScreenProps) => {
  const viewModel = usePatientHomeViewModel();

  const handleQuickAction = (action: string) => {
    if (action === 'Book Appointment' || action === 'Find Doctors') {
      navigation.navigate('PatientDoctors');
    }
  };

  const handleViewDetails = () => {
    navigation.navigate('AppointmentDetails', {
      appointment: {
        id: 'next-appointment',
        doctorName: viewModel.nextAppointment.doctorName,
        specialty: viewModel.nextAppointment.specialty,
        date: viewModel.nextAppointment.date,
        time: viewModel.nextAppointment.time,
        status: 'Confirmed',
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome, {viewModel.patientName}</Text>
          <Text style={styles.welcomeSubtitle}>How are you feeling today?</Text>

          <View style={styles.statsRow}>
            {viewModel.stats.map((stat) => (
              <View key={stat.label} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.reminderCard}>
          <View style={styles.reminderIcon}>
            <Ionicons name="notifications-outline" size={22} color="#6B941F" />
          </View>
          <View style={styles.reminderTextContainer}>
            <Text style={styles.cardTitle}>Appointment Reminder</Text>
            <Text style={styles.cardText}>You have an upcoming visit scheduled this week.</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Next Appointment</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{viewModel.nextAppointment.status}</Text>
            </View>
          </View>

          <Text style={styles.doctorName}>{viewModel.nextAppointment.doctorName}</Text>
          <Text style={styles.specialty}>{viewModel.nextAppointment.specialty}</Text>

          <View style={styles.appointmentInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={18} color="#6B941F" />
              <Text style={styles.infoText}>{viewModel.nextAppointment.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={18} color="#6B941F" />
              <Text style={styles.infoText}>{viewModel.nextAppointment.time}</Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleViewDetails}
            style={styles.detailsButton}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </Pressable>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {viewModel.quickActions.map((action) => (
              <Pressable
                key={action}
                style={styles.quickAction}
                accessibilityRole="button"
                onPress={() => handleQuickAction(action)}
              >
                <Ionicons name={getQuickActionIcon(action)} size={22} color="#6B941F" />
                <Text style={styles.quickActionText}>{action}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Health Summary</Text>
          <View style={styles.summaryGrid}>
            {viewModel.healthSummary.map((item) => (
              <View key={item.label} style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>{item.label}</Text>
                <Text style={styles.summaryValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getQuickActionIcon = (action: string) => {
  if (action === 'Book Appointment') {
    return 'add-circle-outline';
  }

  if (action === 'Find Doctors') {
    return 'search-outline';
  }

  return 'chatbubble-ellipses-outline';
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
  welcomeCard: {
    backgroundColor: '#6B941F',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#23330D',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 5,
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  welcomeSubtitle: {
    color: '#EEF6E4',
    fontSize: 15,
    marginTop: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 16,
    padding: 12,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },
  statLabel: {
    color: '#EEF6E4',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 18,
    padding: 16,
    shadowColor: '#23330D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  reminderIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 14,
    marginRight: 12,
  },
  reminderTextContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 18,
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
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#303A28',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 12,
  },
  cardTitle: {
    color: '#303A28',
    fontSize: 15,
    fontWeight: '800',
  },
  cardText: {
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
  doctorName: {
    color: '#1F271A',
    fontSize: 20,
    fontWeight: '800',
  },
  specialty: {
    color: '#66715E',
    fontSize: 14,
    marginTop: 4,
  },
  appointmentInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 16,
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
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  quickAction: {
    flex: 1,
    minHeight: 92,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 18,
    borderWidth: 1,
    padding: 10,
  },
  quickActionText: {
    color: '#303A28',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  summaryLabel: {
    color: '#66715E',
    fontSize: 13,
    fontWeight: '700',
  },
  summaryValue: {
    color: '#1F271A',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 8,
  },
});
