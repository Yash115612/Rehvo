import { createClient } from '@/lib/supabase/client';
import { Notification } from '@/lib/types';

const supabase = createClient();

export interface NotificationServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Get all notifications for user */
export async function getNotifications(
  userId: string
): Promise<NotificationServiceResult<Notification[]>> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: (data || []) as Notification[] };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}

/** Get unread notification count */
export async function getUnreadNotificationCount(
  userId: string
): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('read_at', null);

    if (error || count === null) return 0;
    return count;
  } catch {
    return 0;
  }
}

/** Mark notification as read */
export async function markNotificationAsRead(
  id: string
): Promise<void> {
  try {
    await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id);
  } catch {
    // Non-blocking
  }
}

/** Mark all notifications as read */
export async function markAllNotificationsAsRead(
  userId: string
): Promise<void> {
  try {
    await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('read_at', null);
  } catch {
    // Non-blocking
  }
}

/** Delete a notification */
export async function deleteNotification(
  id: string
): Promise<void> {
  try {
    await supabase.from('notifications').delete().eq('id', id);
  } catch {
    // Non-blocking
  }
}
