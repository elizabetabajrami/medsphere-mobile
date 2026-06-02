import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import type { DoctorStackParamList } from '../../../navigation/types';
import { AppHeader } from '../../../shared/components/AppHeader';

type AppointmentDetailsScreenProps = NativeStackScreenProps<
  DoctorStackParamList,
  'AppointmentDetails'
>;

export const AppointmentDetailsScreen = ({ navigation, route }: AppointmentDetailsScreenProps) => {
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('DoctorAppointments');
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Appointment Details"
        showBack
        onBackPress={handleBack}
      />
      <Text style={styles.title}>Appointment Details</Text>
      <Text>Appointment ID: {route.params.appointmentId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF5',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
});
