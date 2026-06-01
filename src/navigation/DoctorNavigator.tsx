import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppointmentDetailsScreen } from '../features/doctor/view/AppointmentDetailsScreen';
import { DoctorAppointmentsScreen } from '../features/doctor/view/DoctorAppointmentsScreen';
import { DoctorHomeScreen } from '../features/doctor/view/DoctorHomeScreen';
import type { DoctorStackParamList } from './types';

const Stack = createNativeStackNavigator<DoctorStackParamList>();

export const DoctorNavigator = () => (
  <Stack.Navigator initialRouteName="DoctorHome" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DoctorHome" component={DoctorHomeScreen} />
    <Stack.Screen
      name="DoctorAppointments"
      component={DoctorAppointmentsScreen}
    />
    <Stack.Screen
      name="AppointmentDetails"
      component={AppointmentDetailsScreen}
    />
  </Stack.Navigator>
);
