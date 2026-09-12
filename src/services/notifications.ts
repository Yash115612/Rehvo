/**
 * REHVO Notifications & Push Token Service
 * Centralized Supabase operations for in-app notification inbox, unread counts, push tokens, and realtime updates.
 */
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { NotificationItem, SupabaseNotification, SupabaseUserPushToken, NotificationPreferences } from '../types';
import { ENABLE_IOS_PUSH } from '../config/buildConfig';

// ---------------------------------------------------------------------------
// Response Envelope
// ---------------------------------------------------------------------------

export interface NotificationServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ---------------------------------------------------------------------------
// Error Mapping
// ---------------------------------------------------------------------------

function getUserFriendlyNotificationError(error: unknown, fallback: string): string {
  if (!error) return fallback;
  const msg = (error as { message?: string })?.message || String(error);

  if (msg.includes('fetch') || msg.includes('network') || msg.includes('ENOTFOUND')) {
    return "Couldn't connect to server. Please check your connection.";
  }
  if (msg.includes('row-level security') || msg.includes('policy') || msg.includes('42501')) {
    return 'You do not have permission to perform this notification action.';
  }

  return fallback;
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

export function mapSupabaseNotificationToApp(row: any): NotificationItem {
  const data = row.data || {};
  const linkId =
    data.conversation_id ||
    data.property_id ||
    data.visit_id ||
    data.enquiry_id ||
    data.verification_request_id;

  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    body: row.body,
    message: row.body, // Backwards compatibility for UI reading .message
    type: row.type || 'system',
    data,
    read: !!row.read_at,
    read_at: row.read_at,
    created_at: row.created_at,
    link_id: linkId,
  };
}

// ---------------------------------------------------------------------------
// Notifications CRUD Operations
// ---------------------------------------------------------------------------

/** Get notifications for the current authenticated user */
export async function getNotifications(
  userId?: string,
  limit: number = 50
): Promise<NotificationServiceResult<NotificationItem[]>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected', data: [] };
  }

  try {
    let currentUserId = userId;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) {
      return { success: false, error: 'User not signed in', data: [] };
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', currentUserId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return {
        success: false,
        error: getUserFriendlyNotificationError(error, "Couldn't load notifications."),
        data: [],
      };
    }

    const items = (data || []).map(mapSupabaseNotificationToApp);
    return { success: true, data: items };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyNotificationError(err, "Couldn't load notifications."),
      data: [],
    };
  }
}

/** Get the count of unread notifications for the current authenticated user */
export async function getUnreadNotificationCount(
  userId?: string
): Promise<NotificationServiceResult<number>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected', data: 0 };
  }

  try {
    let currentUserId = userId;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) {
      return { success: true, data: 0 };
    }

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', currentUserId)
      .is('read_at', null);

    if (error) {
      return {
        success: false,
        error: getUserFriendlyNotificationError(error, "Couldn't load unread count."),
        data: 0,
      };
    }

    return { success: true, data: count || 0 };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyNotificationError(err, "Couldn't load unread count."),
      data: 0,
    };
  }
}

/** Mark a specific notification as read */
export async function markNotificationAsRead(
  notificationId: string
): Promise<NotificationServiceResult<void>> {
  if (!isSupabaseConfigured() || !notificationId) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData?.user?.id;
    if (!currentUserId) {
      return { success: false, error: 'User not signed in' };
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', currentUserId);

    if (error) {
      return {
        success: false,
        error: getUserFriendlyNotificationError(error, "Couldn't update this notification."),
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyNotificationError(err, "Couldn't update this notification."),
    };
  }
}

/** Mark all unread notifications as read for current authenticated user */
export async function markAllNotificationsAsRead(
  userId?: string
): Promise<NotificationServiceResult<void>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    let currentUserId = userId;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) {
      return { success: false, error: 'User not signed in' };
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', currentUserId)
      .is('read_at', null);

    if (error) {
      return {
        success: false,
        error: getUserFriendlyNotificationError(error, "Couldn't update notifications."),
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyNotificationError(err, "Couldn't update notifications."),
    };
  }
}

/** Delete a specific notification */
export async function deleteNotification(
  notificationId: string
): Promise<NotificationServiceResult<void>> {
  if (!isSupabaseConfigured() || !notificationId) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData?.user?.id;
    if (!currentUserId) {
      return { success: false, error: 'User not signed in' };
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', currentUserId);

    if (error) {
      return {
        success: false,
        error: getUserFriendlyNotificationError(error, "Couldn't delete notification."),
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyNotificationError(err, "Couldn't delete notification."),
    };
  }
}

/** Bulk mark notifications as read */
export async function bulkMarkNotificationsAsRead(
  notificationIds: string[],
  userId?: string
): Promise<NotificationServiceResult<void>> {
  if (!isSupabaseConfigured() || !notificationIds || notificationIds.length === 0) {
    return { success: true };
  }

  try {
    let currentUserId = userId;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) {
      return { success: false, error: 'User not signed in' };
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .in('id', notificationIds)
      .eq('user_id', currentUserId);

    if (error) {
      return {
        success: false,
        error: getUserFriendlyNotificationError(error, "Couldn't update notifications."),
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyNotificationError(err, "Couldn't update notifications."),
    };
  }
}

/** Bulk delete notifications */
export async function bulkDeleteNotifications(
  notificationIds: string[],
  userId?: string
): Promise<NotificationServiceResult<void>> {
  if (!isSupabaseConfigured() || !notificationIds || notificationIds.length === 0) {
    return { success: true };
  }

  try {
    let currentUserId = userId;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) {
      return { success: false, error: 'User not signed in' };
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .in('id', notificationIds)
      .eq('user_id', currentUserId);

    if (error) {
      return {
        success: false,
        error: getUserFriendlyNotificationError(error, "Couldn't delete notifications."),
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyNotificationError(err, "Couldn't delete notifications."),
    };
  }
}

// ---------------------------------------------------------------------------
// Notification Preferences Management
// ---------------------------------------------------------------------------

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  chat_enabled: true,
  property_enabled: true,
  visit_enabled: true,
  wallet_enabled: true,
  rewards_enabled: true,
  society_enabled: true,
  marketing_enabled: false,
  email_enabled: true,
  sms_enabled: true,
  quiet_hours_enabled: false,
  quiet_start: '22:00',
  quiet_end: '08:00',
  messages: true,
  visits: true,
  property_updates: true,
  price_changes: true,
  wallet_rewards: true,
  flatmates: true,
  owner_leads: true,
  rent_due: true,
  marketing: false,
  quiet_hours_start: '22:00',
  quiet_hours_end: '08:00',
  sound_enabled: true,
  sound_name: 'default',
  vibration_enabled: true,
  lock_screen_previews: true,
  badge_enabled: true,
};

/** Get notification preferences for a user */
export async function getNotificationPreferences(
  userId?: string
): Promise<NotificationServiceResult<NotificationPreferences>> {
  if (!isSupabaseConfigured()) {
    return { success: true, data: { ...DEFAULT_NOTIFICATION_PREFERENCES } };
  }

  try {
    let currentUserId = userId;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) {
      return { success: true, data: { ...DEFAULT_NOTIFICATION_PREFERENCES } };
    }

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', currentUserId)
      .maybeSingle();

    if (error) {
      return {
        success: false,
        error: getUserFriendlyNotificationError(error, "Couldn't load preferences."),
        data: { ...DEFAULT_NOTIFICATION_PREFERENCES },
      };
    }

    if (!data) {
      // Initialize default preferences in DB
      const initialPrefs = {
        user_id: currentUserId,
        ...DEFAULT_NOTIFICATION_PREFERENCES,
        updated_at: new Date().toISOString(),
      };
      await supabase.from('notification_preferences').upsert(initialPrefs, { onConflict: 'user_id' });
      return { success: true, data: initialPrefs };
    }

    return {
      success: true,
      data: {
        user_id: data.user_id,
        messages: data.messages ?? true,
        visits: data.visits ?? true,
        property_updates: data.property_updates ?? true,
        price_changes: data.price_changes ?? true,
        wallet_rewards: data.wallet_rewards ?? true,
        flatmates: data.flatmates ?? true,
        owner_leads: data.owner_leads ?? true,
        rent_due: data.rent_due ?? true,
        marketing: data.marketing ?? false,
        quiet_hours_enabled: data.quiet_hours_enabled ?? false,
        quiet_hours_start: data.quiet_hours_start || '22:00',
        quiet_hours_end: data.quiet_hours_end || '08:00',
        sound_enabled: data.sound_enabled ?? true,
        sound_name: data.sound_name || 'default',
        vibration_enabled: data.vibration_enabled ?? true,
        lock_screen_previews: data.lock_screen_previews ?? true,
        badge_enabled: data.badge_enabled ?? true,
        updated_at: data.updated_at,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyNotificationError(err, "Couldn't load preferences."),
      data: { ...DEFAULT_NOTIFICATION_PREFERENCES },
    };
  }
}

/** Update notification preferences for current user */
export async function updateNotificationPreferences(
  prefs: Partial<NotificationPreferences>,
  userId?: string
): Promise<NotificationServiceResult<void>> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    let currentUserId = userId;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) {
      return { success: false, error: 'User not signed in' };
    }

    const { error } = await supabase
      .from('notification_preferences')
      .upsert(
        {
          user_id: currentUserId,
          ...prefs,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      return {
        success: false,
        error: getUserFriendlyNotificationError(error, "Couldn't save preferences."),
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyNotificationError(err, "Couldn't save preferences."),
    };
  }
}

/** Create an in-app notification event */
export async function createNotification(params: {
  userId: string;
  type:
    | 'visit'
    | 'message'
    | 'application'
    | 'price'
    | 'system'
    | 'verification'
    | 'flatmate_wave'
    | 'property_saved'
    | 'enquiry';
  title: string;
  body: string;
  data?: Record<string, any>;
}): Promise<NotificationServiceResult<NotificationItem>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    if (!params.userId) {
      return { success: false, error: 'Target user ID is required.' };
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: params.userId,
        type: params.type,
        title: params.title,
        body: params.body,
        data: params.data || {},
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: getUserFriendlyNotificationError(error, "Couldn't create notification."),
      };
    }

    return { success: true, data: mapSupabaseNotificationToApp(data) };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyNotificationError(err, "Couldn't create notification."),
    };
  }
}

// ---------------------------------------------------------------------------
// Push Token Management
// ---------------------------------------------------------------------------

/** Get device Expo push token */
export async function getExpoPushToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') return null;
    if (Platform.OS === 'ios' && !ENABLE_IOS_PUSH) return null;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return null;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    const tokenData = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );
    return tokenData.data || null;
  } catch {
    return null;
  }
}

/** Register push token to Supabase for current authenticated user */
export async function registerPushToken(
  token: string,
  deviceOs?: 'ios' | 'android' | 'web'
): Promise<NotificationServiceResult<void>> {
  if (!isSupabaseConfigured() || !token) {
    return { success: false, error: 'Database not connected or token missing' };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData?.user?.id;
    if (!currentUserId) {
      return { success: false, error: 'User not signed in' };
    }

    const os = deviceOs || (Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web');

    const { error } = await supabase
      .from('user_push_tokens')
      .upsert(
        {
          user_id: currentUserId,
          push_token: token,
          device_os: os,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,push_token' }
      );

    if (error) {
      return {
        success: false,
        error: getUserFriendlyNotificationError(error, 'Notifications could not be enabled right now.'),
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyNotificationError(err, 'Notifications could not be enabled right now.'),
    };
  }
}

/** Remove push token for current authenticated user */
export async function removePushToken(
  token?: string
): Promise<NotificationServiceResult<void>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData?.user?.id;
    if (!currentUserId) {
      return { success: true };
    }

    let query = supabase.from('user_push_tokens').delete().eq('user_id', currentUserId);
    if (token) {
      query = query.eq('push_token', token);
    }

    const { error } = await query;
    if (error) {
      return {
        success: false,
        error: getUserFriendlyNotificationError(error, "Couldn't remove push token."),
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyNotificationError(err, "Couldn't remove push token."),
    };
  }
}

/** Get registered push tokens for a user */
export async function getUserPushTokens(
  userId?: string
): Promise<NotificationServiceResult<SupabaseUserPushToken[]>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected', data: [] };
  }

  try {
    let currentUserId = userId;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) {
      return { success: false, error: 'User not signed in', data: [] };
    }

    const { data, error } = await supabase
      .from('user_push_tokens')
      .select('*')
      .eq('user_id', currentUserId);

    if (error) {
      return {
        success: false,
        error: getUserFriendlyNotificationError(error, "Couldn't load push tokens."),
        data: [],
      };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyNotificationError(err, "Couldn't load push tokens."),
      data: [],
    };
  }
}

// ---------------------------------------------------------------------------
// Supabase Realtime Subscriptions
// ---------------------------------------------------------------------------

/** Subscribe to realtime notifications for the current authenticated user */
export function subscribeToNotifications(
  userId: string,
  onNewNotification: (notif: NotificationItem) => void
): { unsubscribe: () => void } {
  if (!isSupabaseConfigured() || !userId) {
    return { unsubscribe: () => {} };
  }

  const topic = `user_notifications:${userId}`;

  // 1. Remove existing channel with the same topic to avoid duplicate / invalid state
  try {
    const existingChannels = supabase.getChannels();
    for (const ch of existingChannels) {
      if (ch.topic === topic || ch.topic === `realtime:${topic}`) {
        supabase.removeChannel(ch);
      }
    }
  } catch {
    // Channel cleanup handled silently
  }

  // 2. Create channel once
  const channel = supabase.channel(topic);

  // 3. Register ALL .on("postgres_changes", ...) listeners BEFORE calling .subscribe()
  channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      if (payload.new) {
        const mapped = mapSupabaseNotificationToApp(payload.new);
        onNewNotification(mapped);
      }
    }
  );

  // 4. Finally call .subscribe()
  channel.subscribe();

  return {
    unsubscribe: () => {
      try {
        supabase.removeChannel(channel);
      } catch {}
    },
  };
}
