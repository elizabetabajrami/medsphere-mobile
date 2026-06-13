import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { DoctorStackParamList } from '../../../navigation/types';
import { AppFeedbackModal } from '../../../shared/components/AppFeedbackModal';
import { AppHeader } from '../../../shared/components/AppHeader';
import {
  formatAppointmentDate,
  formatAppointmentTime,
  formatStatus,
  getAppointmentDateTime,
  getPatientName,
  getServiceName,
} from '../utils/appointmentFormatters';
import { useDoctorAppointmentDetailsViewModel } from '../viewmodel/useDoctorAppointmentDetailsViewModel';

type AppointmentDetailsScreenProps = NativeStackScreenProps<
  DoctorStackParamList,
  'AppointmentDetails'
>;

export const AppointmentDetailsScreen = ({ navigation, route }: AppointmentDetailsScreenProps) => {
  const viewModel = useDoctorAppointmentDetailsViewModel();
  const { appointment, loadAppointment } = viewModel;
  const appointmentId = route.params.appointmentId;
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadAppointment(appointmentId);
    }, [appointmentId, loadAppointment]),
  );

  const isAppointmentInFuture = useMemo(() => {
    if (!appointment) {
      return false;
    }

    const appointmentDate = getAppointmentDateTime(appointment);

    return Boolean(
      appointmentDate &&
      !Number.isNaN(appointmentDate.getTime()) &&
      appointmentDate.getTime() > Date.now(),
    );
  }, [appointment]);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleStatusAction = async (
    action: 'complete' | 'no-show' | 'cancel',
    successMessage: string,
    reason?: string,
  ) => {
    const didUpdate = await viewModel.updateStatus(appointmentId, action, reason);

    if (didUpdate) {
      setIsCancelModalVisible(false);
      setSuccessMessage(successMessage);
      await loadAppointment(appointmentId);
    }
  };

  const markCompleted = () =>
    handleStatusAction('complete', 'Appointment marked as completed.');
  const markNoShow = () =>
    handleStatusAction('no-show', 'Appointment marked as no-show.');
  const cancelAppointment = () =>
    setIsCancelModalVisible(true);
  const confirmCancelAppointment = () =>
    handleStatusAction('cancel', 'Appointment cancelled successfully.', 'Cancelled by doctor');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title="Appointment Details" showBack onBackPress={handleBack} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {viewModel.isLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#6B941F" />
            <Text style={styles.loadingText}>Loading appointment</Text>
          </View>
        ) : null}

        {viewModel.error ? <Text style={styles.errorText}>{viewModel.error}</Text> : null}

        {!viewModel.isLoading && appointment ? (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Ionicons name="person-outline" size={30} color="#6B941F" />
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.patientName}>{getPatientName(appointment)}</Text>
                  <Text style={styles.patientMeta}>{appointment.patient?.email || 'Email not provided'}</Text>
                </View>
              </View>

              <View style={styles.infoList}>
                <InfoRow icon="mail-outline" label="Patient Email" value={appointment.patient?.email || 'Not provided'} />
                <InfoRow icon="call-outline" label="Patient Phone" value={appointment.patient?.phone || 'Not provided'} />
                <InfoRow icon="calendar-outline" label="Date" value={formatAppointmentDate(appointment)} />
                <InfoRow icon="time-outline" label="Time" value={formatAppointmentTime(appointment)} />
                <InfoRow icon="business-outline" label="Service / Department" value={getServiceName(appointment)} />
                <InfoRow icon="pulse-outline" label="Current Status" value={formatStatus(appointment.status)} />
              </View>
            </View>

            <View style={styles.actionsCard}>
              <Text style={styles.actionsTitle}>Actions</Text>
              {isAppointmentInFuture ? (
                <View style={styles.helperRow}>
                  <Ionicons name="time-outline" size={18} color="#6B941F" />
                  <Text style={styles.helperText}>
                    This action becomes available after the appointment time.
                  </Text>
                </View>
              ) : null}
              <ActionButton
                icon="checkmark-circle-outline"
                label="Mark as Completed"
                onPress={markCompleted}
                disabled={viewModel.isUpdating || isAppointmentInFuture}
              />
              <ActionButton
                icon="remove-circle-outline"
                label="Mark as No Show"
                onPress={markNoShow}
                disabled={viewModel.isUpdating || isAppointmentInFuture}
                variant="secondary"
              />
              <ActionButton
                icon="close-circle-outline"
                label="Cancel Appointment"
                onPress={cancelAppointment}
                disabled={viewModel.isUpdating}
                variant="danger"
              />
            </View>
          </>
        ) : null}
      </ScrollView>

      <AppFeedbackModal
        visible={isCancelModalVisible}
        type="error"
        title="Cancel appointment?"
        message="This appointment will be marked as cancelled."
        primaryButtonText={viewModel.isUpdating ? 'Cancelling...' : 'Cancel Appointment'}
        primaryButtonDisabled={viewModel.isUpdating}
        secondaryButtonText="Keep Appointment"
        onPrimaryPress={confirmCancelAppointment}
        onClose={() => setIsCancelModalVisible(false)}
      />

      <AppFeedbackModal
        visible={Boolean(successMessage)}
        type="success"
        title="Status updated"
        message={successMessage || ''}
        primaryButtonText="Done"
        onClose={() => setSuccessMessage(null)}
      />
    </SafeAreaView>
  );
};

type InfoRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>
      <Ionicons name={icon} size={20} color="#6B941F" />
    </View>
    <View style={styles.infoText}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

type ActionButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  disabled: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
};

const ActionButton = ({
  icon,
  label,
  onPress,
  disabled,
  variant = 'primary',
}: ActionButtonProps) => (
  <Pressable
    accessibilityRole="button"
    disabled={disabled}
    onPress={onPress}
    style={[
      styles.actionButton,
      variant === 'secondary' && styles.secondaryButton,
      variant === 'danger' && styles.dangerButton,
      disabled && styles.disabledButton,
    ]}
  >
    <Ionicons
      name={icon}
      size={19}
      color={variant === 'primary' ? '#FFFFFF' : variant === 'danger' ? '#B42318' : '#6B941F'}
    />
    <Text
      style={[
        styles.actionButtonText,
        variant === 'secondary' && styles.secondaryButtonText,
        variant === 'danger' && styles.dangerButtonText,
      ]}
    >
      {label}
    </Text>
  </Pressable>
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
  loadingCard: {
    minHeight: 150,
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
  errorText: {
    color: '#B42318',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#23330D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 20,
    marginRight: 14,
  },
  headerText: {
    flex: 1,
  },
  patientName: {
    color: '#1F271A',
    fontSize: 21,
    fontWeight: '800',
  },
  patientMeta: {
    color: '#66715E',
    fontSize: 14,
    marginTop: 5,
  },
  infoList: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCFDF9',
    borderColor: '#E8EEDF',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  infoIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 14,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    color: '#66715E',
    fontSize: 12,
    fontWeight: '700',
  },
  infoValue: {
    color: '#1F271A',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 22,
    borderWidth: 1,
    marginTop: 16,
    padding: 18,
  },
  actionsTitle: {
    color: '#303A28',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  helperRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F6EC',
    borderColor: '#DDE6D2',
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  helperText: {
    flex: 1,
    color: '#526249',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
  },
  actionButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B941F',
    borderRadius: 16,
    gap: 8,
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE6D2',
    borderWidth: 1,
  },
  dangerButton: {
    backgroundColor: '#FFF1EF',
    borderColor: '#F1CFCF',
    borderWidth: 1,
  },
  disabledButton: {
    opacity: 0.65,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButtonText: {
    color: '#6B941F',
  },
  dangerButtonText: {
    color: '#B42318',
  },
});
