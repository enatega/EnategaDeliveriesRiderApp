import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import apiClient from './apiClient';

let cachedToken: string | null = null;
let inFlightTokenPromise: Promise<string | null> | null = null;

async function getPushToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const permissions = await Notifications.getPermissionsAsync();
    const status = permissions.granted
      ? permissions.status
      : (await Notifications.requestPermissionsAsync()).status;
    if (status !== 'granted') return null;

    const projectId =
      Constants.easConfig?.projectId ??
      Constants.expoConfig?.extra?.eas?.projectId ??
      process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
    const response = projectId
      ? await Notifications.getExpoPushTokenAsync({ projectId })
      : await Notifications.getExpoPushTokenAsync();

    return response.data || null;
  } catch {
    return null;
  }
}

export async function getExpoPushTokenForAuth(): Promise<string | null> {
  if (cachedToken) return cachedToken;
  if (inFlightTokenPromise) return inFlightTokenPromise;

  inFlightTokenPromise = getPushToken();
  try {
    const token = await inFlightTokenPromise;
    if (token) cachedToken = token;
    return token;
  } finally {
    inFlightTokenPromise = null;
  }
}

export async function syncExpoPushToken(): Promise<void> {
  const pushToken = await getExpoPushTokenForAuth();
  if (pushToken) await apiClient.patch('/users/push-token', { pushToken });
}

export async function unregisterExpoPushToken(): Promise<void> {
  await apiClient.patch('/users/push-token', { pushToken: null });
}
