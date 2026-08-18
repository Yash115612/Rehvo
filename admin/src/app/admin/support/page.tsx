'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LifeBuoy, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { getSupportTickets, updateSupportTicketStatus } from '@/lib/supabase/admin-service';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getSupportTickets()
      .then((data) => setTickets(data))
      .finally(() => setIsLoading(false));
  }, []);

  const handleStatusChange = async (ticketId: string, newStatus: 'pending' | 'in_progress' | 'resolved' | 'closed') => {
    setActionLoading(true);
    try {
      const res = await updateSupportTicketStatus(ticketId, newStatus);
      if (res.success) {
        setTickets((prev) =>
          prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
        );
      } else {
        alert(res.error || 'Failed to update ticket status.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const openTicketsCount = tickets.filter((t) => t.status === 'pending' || t.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support & Inquiries"
        subtitle="Manage member assistance requests, visit escalations, and account inquiries"
        badge={`${openTicketsCount} Open Tickets`}
      />

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-2 text-xs text-brand-muted">
            <Loader2 size={16} className="animate-spin text-brand-primary" />
            <span>Loading support tickets from Supabase...</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center text-brand-muted text-xs">
            <p className="font-semibold text-brand-dark mb-1">No support tickets</p>
            <p>All member support inquiries are currently resolved.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-dense">
              <thead>
                <tr>
                  <th>Ticket Subject</th>
                  <th>User / Account</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className="font-bold text-brand-dark">{t.subject}</div>
                      <div className="text-[11px] text-brand-muted font-mono">{t.id.slice(0, 8)}...</div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-brand-dark">{t.user_profile?.full_name || 'Member'}</div>
                      <div className="text-[11px] text-brand-muted">{t.user_profile?.email || t.user_profile?.phone || 'N/A'}</div>
                    </td>
                    <td>
                      <StatusBadge status={(t.priority || 'MEDIUM').toUpperCase()} />
                    </td>
                    <td>
                      <StatusBadge status={(t.status || 'PENDING').toUpperCase()} />
                    </td>
                    <td className="text-xs text-brand-muted">{formatDate(t.created_at)}</td>
                    <td className="text-right">
                      {t.status !== 'resolved' && t.status !== 'closed' ? (
                        <button
                          onClick={() => handleStatusChange(t.id, 'resolved')}
                          disabled={actionLoading}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-brand-muted">Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
