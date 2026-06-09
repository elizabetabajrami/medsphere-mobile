import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChatScreen } from '../features/chat/view/ChatScreen';
import { useChatBadgeViewModel } from '../features/chat/viewmodel/useChatBadgeViewModel';
import { AppointmentDetailsScreen } from '../features/doctor/view/AppointmentDetailsScreen';
import { DoctorAppointmentsScreen } from '../features/doctor/view/DoctorAppointmentsScreen';
import { DoctorHomeScreen } from '../features/doctor/view/DoctorHomeScreen';
import { DoctorProfileScreen } from '../features/doctor/view/DoctorProfileScreen';
import { NotificationBellButton } from '../features/notifications/components/NotificationBellButton';
import { NotificationsScreen } from '../features/notifications/view/NotificationsScreen';
import { useNotificationBadgeViewModel } from '../features/notifications/viewmodel/useNotificationBadgeViewModel';
import type { DoctorStackParamList, DoctorTabParamList } from './types';

const Stack = createNativeStackNavigator<DoctorStackParamList>();
const Tab = createBottomTabNavigator<DoctorTabParamList>();

type DoctorNavigatorProps = {
  onLogout: () => void;
};

const DoctorTabs = ({ onLogout }: DoctorNavigatorProps) => {
  const chatBadge = useChatBadgeViewModel();
  const notificationBadge = useNotificationBadgeViewModel();
  const stackNavigation = useNavigation<NativeStackNavigationProp<DoctorStackParamList>>();
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
            route.name === 'DoctorChat' && chatBadge.unreadCount > 0
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
              DoctorHome: 'home-outline',
              DoctorAppointments: 'calendar-outline',
              DoctorChat: 'chatbubbles-outline',
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
        <Tab.Screen name="DoctorChat" options={{ title: 'Chat' }}>
          {() => <ChatScreen role="doctor" />}
        </Tab.Screen>
        <Tab.Screen name="DoctorProfile" options={{ title: 'Profile' }}>
          {() => <DoctorProfileScreen onLogout={onLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
      <View pointerEvents="box-none" style={styles.notificationOverlay}>
        <NotificationBellButton
          unreadCount={unreadCount}
          onPress={() => stackNavigation.navigate('DoctorNotifications')}
        />
      </View>
    </View>
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
    <Stack.Screen name="DoctorNotifications">
      {({ navigation }) => <NotificationsScreen onBackPress={navigation.goBack} />}
    </Stack.Screen>
    <Stack.Screen
      name="AppointmentDetails"
      component={AppointmentDetailsScreen}
    />
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
