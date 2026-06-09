import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PatientStackParamList, PatientTabParamList } from '../../../navigation/types';
import { usePatientHomeViewModel } from '../viewmodel/usePatientHomeViewModel';

type PatientHomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<PatientTabParamList, 'PatientHome'>,
  NativeStackScreenProps<PatientStackParamList>
>;

export const PatientHomeScreen = ({ navigation }: PatientHomeScreenProps) => {
  const viewModel = usePatientHomeViewModel();
  const { loadHome } = viewModel;

  useFocusEffect(
    useCallback(() => {
      loadHome();
    }, [loadHome])
  );

  const goToDoctors = () => {
    navigation.navigate('PatientDoctors');
  };

  const handleQuickAction = (action: string) => {
    if (action === 'Book Appointment' || action === 'Find Doctors') {
      navigation.navigate('PatientDoctors');
      return;
    }

    if (action === 'My Appointments') {
      navigation.navigate('PatientAppointments');
      return;
    }

    navigation.navigate('PatientProfile');
  };

  const handleViewDetails = () => {
    if (!viewModel.nextAppointment) {
      return;
    }

    navigation.navigate('AppointmentDetails', {
      appointment: viewModel.nextAppointment,
    });
  };

  const goToNotifications = () => {
    navigation.navigate('PatientNotifications');
  };

  const goToChat = () => {
    navigation.navigate('PatientTabs', { screen: 'PatientChat' });
  };

  const goToNextVisit = () => {
    if (viewModel.nextAppointment) {
      navigation.navigate('AppointmentDetails', {
        appointment: viewModel.nextAppointment,
      });
      return;
    }

    navigation.navigate('PatientAppointments');
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
              <Ionicons name="heart" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.welcomeCopy}>
              <Text style={styles.welcomeTitle}>Welcome, {viewModel.patientName}</Text>
              <Text style={styles.welcomeSubtitle}>Ready to manage your health today?</Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={goToDoctors}
            style={({ pressed }) => [
              styles.heroButton,
              pressed && styles.heroButtonPressed,
            ]}
          >
            <Text style={styles.heroButtonText}>Book Appointment</Text>
            <Ionicons name="arrow-forward" size={18} color="#6B941F" />
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Next Appointment</Text>
        </View>

        <View style={styles.appointmentCard}>
          {viewModel.isLoadingAppointment ? (
            <View style={styles.loadingState}>
              <ActivityIndicator color="#6B941F" />
              <Text style={styles.loadingText}>Loading appointment</Text>
            </View>
          ) : viewModel.nextAppointment ? (
            <>
              <View style={styles.appointmentHeader}>
                <View style={styles.doctorAvatar}>
                  <Ionicons name="person-outline" size={24} color="#6B941F" />
                </View>
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{viewModel.nextAppointment.doctorName}</Text>
                  <Text style={styles.specialty}>{viewModel.nextAppointment.specialty}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{viewModel.nextAppointment.status}</Text>
                </View>
              </View>

              <View style={styles.appointmentInfo}>
                <View style={styles.infoPill}>
                  <Ionicons name="calendar-outline" size={16} color="#6B941F" />
                  <Text style={styles.infoText}>{viewModel.nextAppointment.date}</Text>
                </View>
                <View style={styles.infoPill}>
                  <Ionicons name="time-outline" size={16} color="#6B941F" />
                  <Text style={styles.infoText}>{viewModel.nextAppointment.time}</Text>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={handleViewDetails}
                style={({ pressed }) => [
                  styles.detailsButton,
                  pressed && styles.detailsButtonPressed,
                ]}
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="calendar-clear-outline" size={26} color="#6B941F" />
              </View>
              <Text style={styles.emptyTitle}>No upcoming appointments</Text>
              <Pressable
                accessibilityRole="button"
                onPress={goToDoctors}
                style={({ pressed }) => [
                  styles.emptyButton,
                  pressed && styles.emptyButtonPressed,
                ]}
              >
                <Text style={styles.emptyButtonText}>Book Appointment</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.quickActionsGrid}>
          {viewModel.quickActions.map((action) => (
            <Pressable
              key={action}
              accessibilityRole="button"
              onPress={() => handleQuickAction(action)}
              style={({ pressed }) => [
                styles.quickAction,
                pressed && styles.quickActionPressed,
              ]}
            >
              <Ionicons name={getQuickActionIcon(action)} size={21} color="#6B941F" />
              <Text style={styles.quickActionText}>{action}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Care updates</Text>
        </View>
        <View style={styles.careUpdatesRow}>
          <CareUpdateItem
            icon="chatbubble-ellipses-outline"
            value={String(viewModel.unreadMessages)}
            label={viewModel.unreadMessages === 1 ? 'Message' : 'Messages'}
            onPress={goToChat}
          />
          <CareUpdateItem
            icon="notifications-outline"
            value={String(viewModel.unreadNotifications)}
            label="Notifications"
            onPress={goToNotifications}
          />
          <CareUpdateItem
            icon="calendar-outline"
            value={viewModel.nextVisitLabel}
            label="Next visit"
            onPress={goToNextVisit}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

type CareUpdateItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  onPress: () => void;
};

const CareUpdateItem = ({ icon, value, label, onPress }: CareUpdateItemProps) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [
      styles.careUpdateBox,
      pressed && styles.careUpdateBoxPressed,
    ]}
  >
    <View style={styles.careUpdateIcon}>
      <Ionicons name={icon} size={19} color="#6B941F" />
    </View>
    <Text style={styles.careUpdateValue} numberOfLines={1} adjustsFontSizeToFit>
      {value}
    </Text>
    <Text style={styles.careUpdateText} numberOfLines={1} adjustsFontSizeToFit>
      {label}
    </Text>
  </Pressable>
);

const getQuickActionIcon = (action: string) => {
  if (action === 'Book Appointment') {
    return 'add-circle-outline';
  }

  if (action === 'Find Doctors') {
    return 'search-outline';
  }

  if (action === 'My Appointments') {
    return 'calendar-outline';
  }

  return 'person-outline';
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
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 92,
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
  heroButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    gap: 8,
    marginTop: 18,
  },
  heroButtonPressed: {
    opacity: 0.9,
  },
  heroButtonText: {
    color: '#6B941F',
    fontSize: 15,
    fontWeight: '800',
  },
  sectionHeader: {
    marginTop: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#303A28',
    fontSize: 18,
    fontWeight: '800',
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#23330D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  loadingState: {
    minHeight: 118,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#66715E',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 16,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
    paddingRight: 8,
  },
  doctorName: {
    color: '#1F271A',
    fontSize: 16,
    fontWeight: '800',
  },
  specialty: {
    color: '#66715E',
    fontSize: 13,
    marginTop: 3,
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
  appointmentInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF5',
    borderRadius: 999,
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  infoText: {
    color: '#303A28',
    fontSize: 12,
    fontWeight: '800',
  },
  detailsButton: {
    alignItems: 'center',
    backgroundColor: '#6B941F',
    borderRadius: 14,
    marginTop: 14,
    paddingVertical: 12,
  },
  detailsButtonPressed: {
    opacity: 0.88,
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  emptyState: {
    minHeight: 154,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 18,
  },
  emptyTitle: {
    color: '#303A28',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },
  emptyButton: {
    backgroundColor: '#6B941F',
    borderRadius: 14,
    marginTop: 14,
    paddingHorizontal: 22,
    paddingVertical: 11,
  },
  emptyButtonPressed: {
    opacity: 0.88,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickAction: {
    width: '48.5%',
    minHeight: 78,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 18,
    borderWidth: 1,
    padding: 10,
  },
  quickActionPressed: {
    backgroundColor: '#F2F6EC',
  },
  quickActionText: {
    color: '#303A28',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 7,
    textAlign: 'center',
  },
  careUpdatesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  careUpdateBox: {
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
  careUpdateBoxPressed: {
    backgroundColor: '#F2F6EC',
  },
  careUpdateIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 12,
    marginBottom: 9,
  },
  careUpdateValue: {
    color: '#1F271A',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  careUpdateText: {
    color: '#66715E',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
    textAlign: 'center',
  },
});
