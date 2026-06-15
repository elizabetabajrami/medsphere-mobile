import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { notificationService } from './notificationService';
import { isAppointmentBookedNotification } from '../utils/notificationFilters';

let currentPushToken: string | null = null;

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const content = notification.request.content;
    const shouldHideAppointmentBooked = isAppointmentBookedNotification({
      title: content.title,
      body: content.body,
      data: content.data as Record<string, unknown>,
    });

    return {
      shouldShowBanner: !shouldHideAppointmentBooked,
      shouldShowList: !shouldHideAppointmentBooked,
      shouldPlaySound: !shouldHideAppointmentBooked,
      shouldSetBadge: false,
    };
  },
});

export const pushNotificationService = {
  async registerCurrentDevice(): Promise<string | null> {
    if (!Device.isDevice) {
      console.log('PUSH REGISTRATION SKIPPED: physical device required');
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'MedSphere notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6B941F',
        sound: 'default',
      });
    }

    const existingPermissions = await Notifications.getPermissionsAsync();
    let finalStatus = existingPermissions.status;

    if (finalStatus !== 'granted') {
      const requestedPermissions = await Notifications.requestPermissionsAsync();
      finalStatus = requestedPermissions.status;
    }

    if (finalStatus !== 'granted') {
      console.log('PUSH REGISTRATION SKIPPED: permission not granted');
      return null;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      throw new Error('EAS project ID is missing');
    }

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;

    await notificationService.registerPushToken({
      token,
      platform: Platform.OS === 'ios' ? 'ios' : 'android',
      deviceName: Device.deviceName ?? undefined,
    });

    currentPushToken = token;
    console.log('EXPO PUSH TOKEN REGISTERED:', token);
    return token;
  },

  async unregisterCurrentDevice(): Promise<void> {
    if (!currentPushToken) return;

    try {
      await notificationService.unregisterPushToken(currentPushToken);
    } finally {
      currentPushToken = null;
    }
  },
};
