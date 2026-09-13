'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  LifeBuoy,
  Search,
  Download,
  Clock,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { exportToCSV } from '@/lib/export/csv-pdf';
import { getSupportTickets, updateSupportTicketStatus } from '@/lib/supabase/admin-service';

function AdminSupportContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getSupportTickets();
      setTickets(data || []);
    } catch (err) {
      console.warn('Failed to load tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = tickets.filter((t) => {
    const ticketNum = t.ticket_number || t.id || '';
    const subject = t.subject || t.title || '';
    const userName = t.user_name || t.user_profile?.full_name || '';
    const matchesSearch =
      ticketNum.toLowerCase().includes(search.toLowerCase()) ||
      subject.toLowerCase().includes(search.toLowerCase()) ||
      userName.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'complaints' && (t.department === 'PROPERTY' || t.category === 'complaint')) ||
      (activeTab === 'bugs' && (t.department === 'BUG' || t.category === 'bug')) ||
      (activeTab === 'contact' && (t.status === 'open' || t.status === 'OPEN'));
    return matchesSearch && matchesTab;
  });

  const handleResolve = async (id: string) => {
    await updateSupportTicketStatus(id, 'resolved');
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'resolved' } : t))
    );
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-900 dark:text-white">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Support Center & Ticket Desk
            </h1>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30">
              {tickets.length} Open Tickets
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Resolve tenant inquiries, owner onboarding questions, transaction disputes, and bug triage with SLA timers
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
          <button
            onClick={() => exportToCSV(tickets, 'rehvo_support_tickets')}
            disabled={tickets.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition disabled:opacity-50"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 text-xs font-bold">
        {[
          { id: 'all', label: 'All Tickets' },
          { id: 'complaints', label: 'Safety & Complaints' },
          { id: 'contact', label: 'Contact Inquiries' },
          { id: 'bugs', label: 'Technical Bug Reports' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === tab.id
                ? 'bg-[#0E8F73] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search ticket by number, subject, or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#16161A] pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#10B981]"
          />
        </div>
      </div>

      {/* 4. Table or Honest Empty State */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="animate-spin text-[#10B981] mx-auto mb-3" size={28} />
          <p className="text-xs text-slate-500 font-medium">Querying support tickets from Supabase...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
          <LifeBuoy size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {tickets.length === 0 ? '0 Open Support Tickets in Database' : 'No Tickets Match Your Filter'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {tickets.length === 0
              ? 'Zero mock support tickets are loaded. When users report issues, file safety complaints, or request assistance in the app, tickets will populate here with automated priority triage.'
              : 'Try clearing your search query or switching tabs.'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#16161A] text-slate-500 border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Ticket ID</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Subject & Description</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Department</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Submitted By</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Priority</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Status</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition">
                    <td className="p-3.5">
                      <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">{t.ticket_number || t.id.slice(0, 8)}</div>
                      <div className="text-[10px] text-slate-400">{formatDate(t.created_at)}</div>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{t.subject || t.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{t.description}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                        {t.department || 'SUPPORT'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{t.user_name || t.user_profile?.full_name || 'User'}</div>
                      <div className="text-[10px] text-slate-400">{t.user_role || 'Member'}</div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          t.priority === 'HIGH' || t.priority === 'high'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
                        }`}
                      >
                        {t.priority || 'NORMAL'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          t.status === 'open' || t.status === 'OPEN'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
                            : t.status === 'in_progress'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                        }`}
                      >
                        {(t.status || 'OPEN').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {t.status !== 'resolved' && t.status !== 'closed' ? (
                        <button
                          onClick={() => handleResolve(t.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#0E8F73] hover:bg-[#10B981] text-white text-xs font-bold transition shadow-xs"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold">Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSupportPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-neutral-500">Loading Support Tickets...</div>}>
      <AdminSupportContent />
    </React.Suspense>
  );
}
