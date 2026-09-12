// ==============================================================================
// REHVO V6.1 — COMPLETE PUSH NOTIFICATION SERVICE (PRODUCTION)
// Expo Notifications (iOS APNs + Android FCM + Web), Android Channels,
// Token Lifecycle, Supabase Database Sync, Badge Management, Local Reminders,
// and Deep Link Event Listeners.
// ==============================================================================

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PushTokenRecord } from '../types';
import { navigateToNotificationDestination } from './notificationDeepLinks';
import { ENABLE_IOS_PUSH } from '../config/buildConfig';

const PUSH_TOKEN_STORAGE_KEY = 'rehvo_expo_push_token';
const APP_VERSION_STORAGE_KEY = 'rehvo_app_version';
const BADGE_COUNT_STORAGE_KEY = 'rehvo_app_badge_count';

// Configure foreground presentation behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Configure Android Notification Channels for high deliverability & sound priority
 */
export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  try {
    await Promise.all([
      Notifications.setNotificationChannelAsync('default', {
        name: 'General Alerts',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#0F766E',
        sound: 'default',
      }),
      Notifications.setNotificationChannelAsync('messages', {
        name: 'Chat & Enquiries',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#0F766E',
        sound: 'default',
      }),
      Notifications.setNotificationChannelAsync('visits', {
        name: 'Visits & Gatepasses',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 300, 200, 300],
        lightColor: '#2563EB',
        sound: 'default',
      }),
      Notifications.setNotificationChannelAsync('wallet', {
        name: 'Cashback & RentPay',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 200, 100, 200],
        lightColor: '#D97706',
        sound: 'default',
      }),
      Notifications.setNotificationChannelAsync('urgent', {
        name: 'Security & SOS Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 200, 500],
        lightColor: '#DC2626',
        sound: 'default',
      }),
    ]);
  } catch {
    // Graceful fallback if channel creation is not supported
  }
}

/**
 * Check if the user has granted notification permissions
 */
export async function checkNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const settings = await Notifications.getPermissionsAsync();
    return (
      settings.granted ||
      settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
      settings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED
    );
  } catch {
    return false;
  }
}

/**
 * Request native system notification permissions (iOS APNs / Android 13+ POST_NOTIFICATIONS)
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    return status === 'granted';
  } catch {
    return false;
  }
}

/**
 * Register device for push notifications and sync token to Supabase `push_tokens` table
 */
export async function registerForPushNotifications(
  userId: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  if (Platform.OS === 'web' || !userId) {
    return { success: false, error: 'Push not supported on web or userId missing' };
  }

  // Gracefully bypass remote APNs registration for local iOS development builds
  if (Platform.OS === 'ios' && !ENABLE_IOS_PUSH) {
    return {
      success: false,
      error: 'Push notifications disabled for local iOS development build',
    };
  }

  try {
    await setupNotificationChannels();

    const isPermitted = await checkNotificationPermission();
    if (!isPermitted) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        return { success: false, error: 'Push permission not granted' };
      }
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId ??
      'c850259e-9d2a-436d-b8d9-2911b3e811c0';

    const tokenResponse = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );
    const pushToken = tokenResponse.data;

    if (!pushToken) {
      return { success: false, error: 'Failed to retrieve Expo push token' };
    }

    const currentVersion = Constants?.expoConfig?.version || '9.0.0';
    const platform = Platform.OS === 'ios' ? 'ios' : 'android';
    const deviceName = Constants.deviceName || `${Platform.OS} device`;
    const deviceModel = (Platform.constants as any)?.Model || Platform.OS;

    // Persist locally
    await AsyncStorage.setItem(PUSH_TOKEN_STORAGE_KEY, pushToken);
    await AsyncStorage.setItem(APP_VERSION_STORAGE_KEY, currentVersion);

    // Sync to Supabase `push_tokens` table
    if (isSupabaseConfigured()) {
      await supabase.from('push_tokens').upsert(
        {
          user_id: userId,
          expo_push_token: pushToken,
          push_token: pushToken,
          platform,
          device_os: platform,
          device_name: deviceName,
          device_model: String(deviceModel),
          app_version: currentVersion,
          is_active: true,
          last_seen_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,expo_push_token' }
      );
    }

    return { success: true, token: pushToken };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Push registration failed' };
  }
}

// Backwards-compatible alias
export const registerPushToken = registerForPushNotifications;

/**
 * Deactivate token on user logout
 */
export async function unregisterPushToken(userId?: string): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    const cachedToken = await AsyncStorage.getItem(PUSH_TOKEN_STORAGE_KEY);
    if (cachedToken && userId && isSupabaseConfigured()) {
      await supabase
        .from('push_tokens')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .or(`push_token.eq.${cachedToken},expo_push_token.eq.${cachedToken}`);
    }
    await AsyncStorage.removeItem(PUSH_TOKEN_STORAGE_KEY);
  } catch {
    // Fail silently
  }
}

/**
 * Update app icon badge count in real-time
 */
export async function updateBadgeCount(count: number): Promise<void> {
  const safeCount = Math.max(0, count);
  try {
    await AsyncStorage.setItem(BADGE_COUNT_STORAGE_KEY, String(safeCount));
    if (Platform.OS !== 'web' && (Platform.OS !== 'ios' || ENABLE_IOS_PUSH)) {
      await Notifications.setBadgeCountAsync(safeCount);
    }
  } catch {
    // Not supported on some Android OEM launchers
  }
}

// Backwards-compatible alias
export const setAppBadgeCount = updateBadgeCount;

/**
 * Reset app icon badge count to 0
 */
export async function clearBadge(): Promise<void> {
  await updateBadgeCount(0);
}

/**
 * Schedule a local notification (e.g. visit or rent reminder)
 */
export async function scheduleLocalNotification(params: {
  title: string;
  body: string;
  data?: Record<string, any>;
  triggerSeconds?: number;
  channelId?: 'default' | 'messages' | 'visits' | 'wallet' | 'urgent';
}): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: params.title,
        body: params.body,
        data: params.data || {},
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(1, params.triggerSeconds ?? 1),
      },
    });
    return id;
  } catch {
    return null;
  }
}

/**
 * Cancel a scheduled local notification
 */
export async function cancelScheduledNotification(identifier: string): Promise<boolean> {
  if (Platform.OS === 'web' || !identifier) return false;
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
    return true;
  } catch {
    return false;
  }
}

/**
 * Cancel all scheduled local notifications
 */
export async function cancelAllScheduledNotifications(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // Fail silently
  }
}

/**
 * Notification Listeners for Foreground, Background, and Tap Interactivity
 */
export function setupNotificationListeners(handlers?: {
  onNotificationReceived?: (notification: Notifications.Notification) => void;
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void;
}): () => void {
  if (Platform.OS === 'web') {
    return () => {};
  }

  // 1. Foreground listener (app is open)
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      handlers?.onNotificationReceived?.(notification);
    }
  );

  // 2. Response listener (user tapped notification in tray / background / lock screen)
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const data = response.notification?.request?.content?.data;
      if (data) {
        navigateToNotificationDestination(data);
      }
      handlers?.onNotificationResponse?.(response);
    }
  );

  // Return unsubscribe cleanup function
  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}
