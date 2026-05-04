import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, StyleSheet, Text, View } from 'react-native';
import type { DoctorStackParamList } from '../../../navigation/types';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { LoadingView } from '../../../shared/components/LoadingView';
import { useDoctorAppointmentsViewModel } from '../viewmodel/useDoctorAppointmentsViewModel';

type DoctorAppointmentsScreenProps = NativeStackScreenProps<
  DoctorStackParamList,
  'DoctorAppointments'
>;

export const DoctorAppointmentsScreen = ({ navigation }: DoctorAppointmentsScreenProps) => {
  const viewModel = useDoctorAppointmentsViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctor Appointments</Text>
      <ErrorMessage message={viewModel.error} />
      {viewModel.isLoading && <LoadingView />}
      <Text>Appointments loaded: {viewModel.appointments.length}</Text>
      <Button title="Load appointments" onPress={() => viewModel.loadAppointments('doctor-id')} />
      <Button
        title="Open appointment details"
        onPress={() => navigation.navigate('AppointmentDetails', { appointmentId: 'appointment-id' })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
  },
});
