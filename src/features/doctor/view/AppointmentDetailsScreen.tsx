import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import type { DoctorStackParamList } from '../../../navigation/types';

type AppointmentDetailsScreenProps = NativeStackScreenProps<
  DoctorStackParamList,
  'AppointmentDetails'
>;

export const AppointmentDetailsScreen = ({ route }: AppointmentDetailsScreenProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>Appointment Details</Text>
    <Text>Appointment ID: {route.params.appointmentId}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
});
