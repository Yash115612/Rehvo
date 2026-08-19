'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CalendarCheck,
  MessageSquare,
  ShieldCheck,
  Trash2,
  CheckCheck,
  Loader2,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '@/services/notifications';
import { Notification } from '@/lib/types';

export default function NotificationsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, refreshUserData } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?next=/notifications');
      return;
    }

    async function loadData() {
      if (user) {
        setLoading(true);
        const res = await getNotifications(user.id);
        if (res.success && res.data) {
          setNotifications(res.data);
        }
        setLoading(false);
      }
    }

    if (user) {
      loadData();
    }
  }, [user, isAuthenticated, authLoading, router]);

  const handleMarkAllRead = async () => {
    if (!user) return;
    await markAllNotificationsAsRead(user.id);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
    );
    await refreshUserData();
  };

  const handleItemClick = async (notif: Notification) => {
    if (!notif.read_at) {
      await markNotificationAsRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read_at: new Date().toISOString() } : n))
      );
      await refreshUserData();
    }

    if (notif.type === 'message') {
      router.push('/chat');
    } else if (notif.type === 'visit') {
      router.push('/visits');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await refreshUserData();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block">
            Activity Alerts
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Notifications ({unreadCount} New)
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Updates on your visit confirmations, messages, and property alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-2xl transition"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
            <Bell className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">All caught up!</h3>
          <p className="text-xs text-stone-500">
            You will receive instant in-app alerts when homeowners respond to your enquiries or confirm your scheduled visits.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden divide-y divide-stone-100">
          {notifications.map((notif) => {
            const isUnread = !notif.read_at;

            const iconMap = {
              visit: <CalendarCheck className="w-5 h-5 text-emerald-600" />,
              message: <MessageSquare className="w-5 h-5 text-purple-600" />,
              verification: <ShieldCheck className="w-5 h-5 text-blue-600" />,
              application: <Bell className="w-5 h-5 text-stone-600" />,
              price: <Bell className="w-5 h-5 text-amber-600" />,
              system: <Bell className="w-5 h-5 text-stone-600" />,
            };

            return (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`p-5 flex items-start justify-between gap-4 cursor-pointer transition ${
                  isUnread ? 'bg-purple-50/40 hover:bg-purple-50/70' : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2.5 rounded-2xl bg-stone-100 flex-shrink-0">
                    {iconMap[notif.type] || <Bell className="w-5 h-5 text-stone-600" />}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-bold ${isUnread ? 'text-stone-900 font-extrabold' : 'text-stone-700'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-stone-400 font-semibold">
                        {new Date(notif.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">{notif.body}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDelete(notif.id, e)}
                  className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
