'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Bell, Send, CheckCircle2, Smartphone, ShieldCheck, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logAdminAction } from '@/lib/supabase/admin-service';
import { formatDate } from '@/lib/utils';

const supabase = createClient();

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('ALL');
  const [tokenCounts, setTokenCounts] = useState({ total: 0, ios: 0, android: 0, web: 0 });
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tokensRes, notifsRes] = await Promise.all([
        supabase.from('user_push_tokens').select('id, device_os'),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(10),
      ]);

      const tokens = tokensRes.data || [];
      const total = tokens.length;
      const ios = tokens.filter((t) => t.device_os === 'ios').length;
      const android = tokens.filter((t) => t.device_os === 'android').length;
      const web = tokens.filter((t) => t.device_os === 'web').length;

      setTokenCounts({ total, ios, android, web });
      setRecentNotifications(notifsRes.data || []);
    } catch (err) {
      console.warn('[Admin Notifications] Load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      // Create broadcast system alert record
      await logAdminAction({
        action: 'BROADCAST_SYSTEM_NOTIFICATION',
        targetType: 'notification',
        targetId: 'global_broadcast',
        metadata: { title, message, target_audience: targetAudience },
      });

      setSentSuccess(true);
      setTimeout(() => {
        setTitle('');
        setMessage('');
        setSentSuccess(false);
        loadData();
      }, 2500);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Broadcast & Push Notifications"
        subtitle="Manage system alert queue, registered mobile device tokens, and platform announcements"
        badge={`${tokenCounts.total} Device Tokens`}
      />

      {/* Device Tokens KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-brand-border p-4 shadow-xs">
          <p className="text-xs font-bold text-brand-muted uppercase">Total Device Tokens</p>
          <p className="text-2xl font-extrabold text-brand-dark mt-1">{tokenCounts.total}</p>
          <p className="text-[11px] text-brand-muted mt-0.5">Registered Expo push endpoints</p>
        </div>
        <div className="bg-white rounded-xl border border-brand-border p-4 shadow-xs">
          <p className="text-xs font-bold text-brand-muted uppercase">iOS Devices</p>
          <p className="text-2xl font-extrabold text-brand-dark mt-1">{tokenCounts.ios}</p>
          <p className="text-[11px] text-brand-muted mt-0.5">Apple APNs configured</p>
        </div>
        <div className="bg-white rounded-xl border border-brand-border p-4 shadow-xs">
          <p className="text-xs font-bold text-brand-muted uppercase">Android Devices</p>
          <p className="text-2xl font-extrabold text-brand-dark mt-1">{tokenCounts.android}</p>
          <p className="text-[11px] text-brand-muted mt-0.5">FCM v1 configured</p>
        </div>
        <div className="bg-white rounded-xl border border-brand-border p-4 shadow-xs">
          <p className="text-xs font-bold text-brand-muted uppercase">Web & Other</p>
          <p className="text-2xl font-extrabold text-brand-dark mt-1">{tokenCounts.web}</p>
          <p className="text-[11px] text-brand-muted mt-0.5">Web standard endpoints</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Broadcast Form */}
        <div className="bg-white rounded-xl border border-brand-border p-6 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4 flex items-center gap-1.5">
            <Bell size={16} className="text-brand-primary" />
            <span>Compose System Announcement</span>
          </h3>

          {sentSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Broadcast announcement queued & logged to audit trail!</span>
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-brand-canvas px-3 py-2 rounded-lg border border-brand-border text-xs font-semibold text-brand-dark focus:outline-none focus:border-brand-primary"
              >
                <option value="ALL">All Registered Users ({tokenCounts.total} push tokens)</option>
                <option value="RENTERS">Active Renters Only</option>
                <option value="OWNERS">Verified Property Owners Only</option>
                <option value="FLATMATES">Flatmate Profile Seekers Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5">
                Notification Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Zero-Brokerage Verified Listings Update"
                className="w-full bg-brand-canvas px-3 py-2 rounded-lg border border-brand-border text-xs text-brand-dark placeholder:text-brand-muted focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5">
                Message Body
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write concise and actionable information..."
                className="w-full bg-brand-canvas px-3 py-2 rounded-lg border border-brand-border text-xs text-brand-dark placeholder:text-brand-muted focus:outline-none focus:border-brand-primary"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-dark hover:bg-brand-primary text-white text-xs font-bold rounded-lg transition-colors shadow-xs disabled:opacity-60"
            >
              {isSending ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Dispatch System Broadcast</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Recent In-App Notifications Stream */}
        <div className="bg-white rounded-xl border border-brand-border p-6 shadow-xs flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4">
            Recent In-App User Notifications
          </h3>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-xs text-brand-muted gap-2">
              <Loader2 size={16} className="animate-spin text-brand-primary" />
              <span>Loading notifications history...</span>
            </div>
          ) : recentNotifications.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-xs text-brand-muted">
              No recent notifications generated yet.
            </div>
          ) : (
            <div className="divide-y divide-brand-border/60 overflow-y-auto max-h-96">
              {recentNotifications.map((n) => (
                <div key={n.id} className="py-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-brand-dark">{n.title}</p>
                    <span className="text-[10px] text-brand-muted">{formatDate(n.created_at)}</span>
                  </div>
                  <p className="text-[11.5px] text-brand-muted mt-0.5">{n.body}</p>
                  <span className="inline-block text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-brand-canvas text-brand-dark border border-brand-border mt-1">
                    {n.type?.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
