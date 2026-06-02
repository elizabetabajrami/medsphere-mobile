import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppointmentDetailsScreen } from '../features/appointments/view/AppointmentDetailsScreen';
import { BookAppointmentScreen } from '../features/appointments/view/BookAppointmentScreen';
import { DoctorDetailsScreen } from '../features/patient/view/DoctorDetailsScreen';
import { PatientAppointmentsScreen } from '../features/patient/view/PatientAppointmentsScreen';
import { PatientDoctorsScreen } from '../features/patient/view/PatientDoctorsScreen';
import { PatientHomeScreen } from '../features/patient/view/PatientHomeScreen';
import { PatientProfileScreen } from '../features/patient/view/PatientProfileScreen';
import { ProfileEditScreen } from '../features/patient/view/ProfileEditScreen';
import type { PatientStackParamList, PatientTabParamList } from './types';

const Stack = createNativeStackNavigator<PatientStackParamList>();
const Tab = createBottomTabNavigator<PatientTabParamList>();

type PatientNavigatorProps = {
  onLogout: () => void;
};

const PatientTabs = ({ onLogout }: PatientNavigatorProps) => (
  <Tab.Navigator
    backBehavior="history"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#6B941F',
      tabBarInactiveTintColor: '#98A2B3',
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#E8EEDF',
        height: 68,
        paddingBottom: 10,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '700',
      },
      tabBarIcon: ({ color, size }) => {
        const icons = {
          PatientHome: 'home-outline',
          PatientDoctors: 'medkit-outline',
          PatientAppointments: 'calendar-outline',
          PatientProfile: 'person-outline',
        } as const;

        return <Ionicons name={icons[route.name]} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="PatientHome" component={PatientHomeScreen} options={{ title: 'Home' }} />
    <Tab.Screen name="PatientDoctors" component={PatientDoctorsScreen} options={{ title: 'Doctors' }} />
    <Tab.Screen
      name="PatientAppointments"
      component={PatientAppointmentsScreen}
      options={{ title: 'Appointments' }}
    />
    <Tab.Screen name="PatientProfile" options={{ title: 'Profile' }}>
      {() => <PatientProfileScreen onLogout={onLogout} />}
    </Tab.Screen>
  </Tab.Navigator>
);

export const PatientNavigator = ({ onLogout }: PatientNavigatorProps) => (
  <Stack.Navigator
    initialRouteName="PatientTabs"
    screenOptions={{
      animation: 'slide_from_right',
      fullScreenGestureEnabled: true,
      gestureEnabled: true,
      headerShown: false,
    }}
  >
    <Stack.Screen name="PatientTabs">
      {() => <PatientTabs onLogout={onLogout} />}
    </Stack.Screen>
    <Stack.Screen name="DoctorDetails" component={DoctorDetailsScreen} />
    <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
    <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
    <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
  </Stack.Navigator>
);
