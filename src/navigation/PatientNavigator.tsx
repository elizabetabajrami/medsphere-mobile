import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppointmentDetailsScreen } from '../features/appointments/view/AppointmentDetailsScreen';
import { BookAppointmentScreen } from '../features/appointments/view/BookAppointmentScreen';
import { ChatScreen } from '../features/chat/view/ChatScreen';
import { useChatBadgeViewModel } from '../features/chat/viewmodel/useChatBadgeViewModel';
import { NotificationBellButton } from '../features/notifications/components/NotificationBellButton';
import { NotificationsScreen } from '../features/notifications/view/NotificationsScreen';
import { useNotificationBadgeViewModel } from '../features/notifications/viewmodel/useNotificationBadgeViewModel';
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

const PatientTabs = ({ onLogout }: PatientNavigatorProps) => {
  const chatBadge = useChatBadgeViewModel();
  const notificationBadge = useNotificationBadgeViewModel();
  const stackNavigation = useNavigation<NativeStackNavigationProp<PatientStackParamList>>();
  const { loadUnreadCount: loadChatUnreadCount } = chatBadge;
  const { loadUnreadCount, unreadCount } = notificationBadge;

  useFocusEffect(
    useCallback(() => {
      loadUnreadCount();
      loadChatUnreadCount();
    }, [loadChatUnreadCount, loadUnreadCount]),
  );

  return (
    <View style={styles.tabsShell}>
      <Tab.Navigator
        backBehavior="history"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#6B941F',
          tabBarInactiveTintColor: '#98A2B3',
          tabBarBadge:
            route.name === 'PatientChat' && chatBadge.unreadCount > 0
              ? chatBadge.unreadCount > 9 ? '9+' : chatBadge.unreadCount
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
              PatientHome: 'home-outline',
              PatientDoctors: 'medkit-outline',
              PatientAppointments: 'calendar-outline',
              PatientChat: 'chatbubbles-outline',
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
        <Tab.Screen name="PatientChat" options={{ title: 'Chat' }}>
          {() => <ChatScreen role="patient" />}
        </Tab.Screen>
        <Tab.Screen name="PatientProfile" options={{ title: 'Profile' }}>
          {() => <PatientProfileScreen onLogout={onLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
      <View pointerEvents="box-none" style={styles.notificationOverlay}>
        <NotificationBellButton
          unreadCount={unreadCount}
          onPress={() => stackNavigation.navigate('PatientNotifications')}
        />
      </View>
    </View>
  );
};

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
    <Stack.Screen name="PatientNotifications">
      {({ navigation }) => <NotificationsScreen onBackPress={navigation.goBack} />}
    </Stack.Screen>
    <Stack.Screen name="DoctorDetails" component={DoctorDetailsScreen} />
    <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
    <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
    <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  tabsShell: {
    flex: 1,
  },
  notificationOverlay: {
    position: 'absolute',
    right: 18,
    top: 56,
    zIndex: 20,
  },
});
