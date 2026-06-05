import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppointmentDetailsScreen } from '../features/doctor/view/AppointmentDetailsScreen';
import { DoctorAppointmentsScreen } from '../features/doctor/view/DoctorAppointmentsScreen';
import { DoctorHomeScreen } from '../features/doctor/view/DoctorHomeScreen';
import { DoctorProfileScreen } from '../features/doctor/view/DoctorProfileScreen';
import { NotificationsScreen } from '../features/notifications/view/NotificationsScreen';
import { useNotificationBadgeViewModel } from '../features/notifications/viewmodel/useNotificationBadgeViewModel';
import type { DoctorStackParamList, DoctorTabParamList } from './types';

const Stack = createNativeStackNavigator<DoctorStackParamList>();
const Tab = createBottomTabNavigator<DoctorTabParamList>();

type DoctorNavigatorProps = {
  onLogout: () => void;
};

const formatBadge = (count: number) => {
  if (count <= 0) {
    return undefined;
  }

  return count > 9 ? '9+' : count;
};

const DoctorTabs = ({ onLogout }: DoctorNavigatorProps) => {
  const notificationBadge = useNotificationBadgeViewModel();

  return (
    <Tab.Navigator
      backBehavior="history"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6B941F',
        tabBarInactiveTintColor: '#98A2B3',
        tabBarBadge:
          route.name === 'DoctorNotifications'
            ? formatBadge(notificationBadge.unreadCount)
            : undefined,
        tabBarBadgeStyle: {
          backgroundColor: '#D92D20',
          color: '#FFFFFF',
          fontSize: 10,
          fontWeight: '800',
        },
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
            DoctorHome: 'home-outline',
            DoctorAppointments: 'calendar-outline',
            DoctorNotifications: 'notifications-outline',
            DoctorProfile: 'person-outline',
          } as const;

          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="DoctorHome" component={DoctorHomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen
        name="DoctorAppointments"
        component={DoctorAppointmentsScreen}
        options={{ title: 'Appointments' }}
      />
      <Tab.Screen name="DoctorNotifications" options={{ title: 'Notifications' }}>
        {() => (
          <NotificationsScreen onUnreadCountChange={notificationBadge.setUnreadCount} />
        )}
      </Tab.Screen>
      <Tab.Screen name="DoctorProfile" options={{ title: 'Profile' }}>
        {() => <DoctorProfileScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export const DoctorNavigator = ({ onLogout }: DoctorNavigatorProps) => (
  <Stack.Navigator
    initialRouteName="DoctorTabs"
    screenOptions={{
      animation: 'slide_from_right',
      fullScreenGestureEnabled: true,
      gestureEnabled: true,
      headerShown: false,
    }}
  >
    <Stack.Screen name="DoctorTabs">
      {() => <DoctorTabs onLogout={onLogout} />}
    </Stack.Screen>
    <Stack.Screen
      name="AppointmentDetails"
      component={AppointmentDetailsScreen}
    />
  </Stack.Navigator>
);
