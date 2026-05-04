import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, StyleSheet, Text, View } from 'react-native';
import type { DoctorStackParamList } from '../../../navigation/types';
import { useDoctorHomeViewModel } from '../viewmodel/useDoctorHomeViewModel';

type DoctorHomeScreenProps = NativeStackScreenProps<DoctorStackParamList, 'DoctorHome'>;

export const DoctorHomeScreen = ({ navigation }: DoctorHomeScreenProps) => {
  const { welcomeMessage } = useDoctorHomeViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{welcomeMessage}</Text>
      <Button title="View Appointments" onPress={() => navigation.navigate('DoctorAppointments')} />
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
