// ==============================================================================
// REHVO V5.4.1 — USE PUSH NOTIFICATIONS HOOK (PRODUCTION)
// Realtime listener setup, badge synchronization & deep-link routing on tap
// ==============================================================================

import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useAppStore } from '../store/useAppStore';
import { registerPushToken, setAppBadgeCount } from '../services/pushNotifications';
import { navigateToNotificationDestination } from '../services/notificationDeepLinks';

export function usePushNotifications() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    unreadNotificationCount,
    fetchUnreadNotificationCount,
    fetchNotifications,
  } = useAppStore();

  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  // 1. Register Token on Auth / Session Restore
  useEffect(() => {
    if (isAuthenticated && user?.id && Platform.OS !== 'web') {
      registerPushToken(user.id);
    }
  }, [isAuthenticated, user?.id]);

  // 2. Sync App Badge Count whenever unread count changes
  useEffect(() => {
    if (Platform.OS !== 'web') {
      setAppBadgeCount(unreadNotificationCount);
    }
  }, [unreadNotificationCount]);

  // 3. Setup Notification Listeners
  useEffect(() => {
    if (Platform.OS === 'web') return;

    // Foreground notification received listener
    notificationListener.current = Notifications.addNotificationReceivedListener(
      () => {
        // Refresh notifications & unread count in state
        fetchUnreadNotificationCount();
        fetchNotifications();
      }
    );

    // Notification tapped / clicked response listener (Deep Linking)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification?.request?.content?.data || {};
        const handled = navigateToNotificationDestination(data);
        if (!handled) {
          router.push('/(renter)/notifications' as any);
        }
      }
    );

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [router, fetchUnreadNotificationCount, fetchNotifications]);
}
