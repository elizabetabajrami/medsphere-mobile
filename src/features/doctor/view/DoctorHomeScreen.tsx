import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { DoctorStackParamList, DoctorTabParamList } from '../../../navigation/types';
import type { Appointment } from '../../appointments/model/Appointment';
import {
  formatAppointmentDate,
  formatAppointmentTime,
  formatStatus,
  getAppointmentId,
} from '../utils/appointmentFormatters';
import { useDoctorHomeViewModel } from '../viewmodel/useDoctorHomeViewModel';

type DoctorHomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<DoctorTabParamList, 'DoctorHome'>,
  NativeStackScreenProps<DoctorStackParamList>
>;

export const DoctorHomeScreen = ({ navigation }: DoctorHomeScreenProps) => {
  const viewModel = useDoctorHomeViewModel();
  const { loadHome } = viewModel;

  useFocusEffect(
    useCallback(() => {
      loadHome();
    }, [loadHome]),
  );

  const openDetails = (appointment: Appointment) => {
    const appointmentId = getAppointmentId(appointment);

    if (appointmentId) {
      navigation.navigate('AppointmentDetails', { appointmentId });
    }
  };

  const goToAppointments = () => {
    navigation.navigate('DoctorTabs', { screen: 'DoctorAppointments' });
  };

  const goToChat = () => {
    navigation.navigate('DoctorTabs', { screen: 'DoctorChat' });
  };

  const goToNotifications = () => {
    navigation.navigate('DoctorNotifications');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeDecor} />
          <View style={styles.welcomeHeader}>
            <View style={styles.logoBadge}>
              <Ionicons name="medical" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.welcomeCopy}>
              <Text style={styles.welcomeTitle}>{viewModel.welcomeMessage}</Text>
              <Text style={styles.welcomeSubtitle}>Here is your clinical schedule for today.</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <DoctorStatBox
            icon="calendar-outline"
            value={String(viewModel.todayAppointments.length)}
            label="Today"
            onPress={goToAppointments}
          />
          <DoctorStatBox
            icon="chatbubble-ellipses-outline"
            value={String(viewModel.unreadMessages)}
            label={viewModel.unreadMessages === 1 ? 'Message' : 'Messages'}
            onPress={goToChat}
          />
          <DoctorStatBox
            icon="notifications-outline"
            value={String(viewModel.unreadNotifications)}
            label="Alerts"
            onPress={goToNotifications}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today&apos;s Agenda</Text>
          <Text style={styles.sectionMeta}>{viewModel.todayAppointments.length} scheduled</Text>
        </View>

        {viewModel.error ? (
          <Text style={styles.errorText}>{viewModel.error}</Text>
        ) : null}

        {viewModel.isLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#6B941F" />
            <Text style={styles.loadingText}>Loading agenda</Text>
          </View>
        ) : null}

        {!viewModel.isLoading && viewModel.todayAppointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="calendar-clear-outline" size={28} color="#6B941F" />
            </View>
            <Text style={styles.emptyTitle}>No appointments today</Text>
            <Text style={styles.emptyText}>Your agenda is clear for the day.</Text>
          </View>
        ) : null}

        {!viewModel.isLoading ? (
          viewModel.todayAppointments.map((appointment) => (
            <AgendaCard
              key={getAppointmentId(appointment)}
              appointment={appointment}
              onViewDetails={() => openDetails(appointment)}
            />
          ))
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

type AgendaCardProps = {
  appointment: Appointment;
  onViewDetails: () => void;
};

type DoctorStatBoxProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  onPress: () => void;
};

const DoctorStatBox = ({ icon, value, label, onPress }: DoctorStatBoxProps) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [
      styles.statBox,
      pressed && styles.statBoxPressed,
    ]}
  >
    <View style={styles.statIcon}>
      <Ionicons name={icon} size={19} color="#6B941F" />
    </View>
    <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
      {value}
    </Text>
    <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>
      {label}
    </Text>
  </Pressable>
);

const AgendaCard = ({ appointment, onViewDetails }: AgendaCardProps) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardIcon}>
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
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 110,
  },
  welcomeCard: {
    overflow: 'hidden',
    backgroundColor: '#6B941F',
    borderRadius: 26,
    padding: 18,
    shadowColor: '#23330D',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 5,
  },
  welcomeDecor: {
    position: 'absolute',
    right: -56,
    top: -70,
    width: 180,
    height: 180,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 90,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 18,
    marginRight: 12,
  },
  welcomeCopy: {
    flex: 1,
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
  },
  welcomeSubtitle: {
    color: '#EEF6E4',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  statBox: {
    flex: 1,
    minHeight: 112,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 12,
    shadowColor: '#23330D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  statBoxPressed: {
    backgroundColor: '#F2F6EC',
  },
  statIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 12,
    marginBottom: 9,
  },
  statValue: {
    color: '#1F271A',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  statLabel: {
    color: '#66715E',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#303A28',
    fontSize: 20,
    fontWeight: '800',
  },
  sectionMeta: {
    color: '#66715E',
    fontSize: 13,
    fontWeight: '800',
  },
  errorText: {
    color: '#B42318',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  loadingCard: {
    minHeight: 128,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 22,
    borderWidth: 1,
  },
  loadingText: {
    color: '#66715E',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },
  emptyCard: {
    minHeight: 184,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 22,
    borderWidth: 1,
    padding: 22,
  },
  emptyIcon: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 19,
  },
  emptyTitle: {
    color: '#303A28',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 12,
  },
  emptyText: {
    color: '#66715E',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
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
  cardIcon: {
    width: 50,
    height: 50,
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
    fontSize: 16,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    color: '#6B941F',
    fontSize: 11,
    fontWeight: '800',
  },
  detailsButton: {
    alignItems: 'center',
    backgroundColor: '#6B941F',
    borderRadius: 14,
    marginTop: 14,
    paddingVertical: 12,
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
