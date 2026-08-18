'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { CheckCircle2, XCircle, FileText, ExternalLink, ShieldAlert, Building2, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  getVerifications,
  resolveVerification,
  AdminVerificationRecord,
} from '@/lib/supabase/admin-service';

export default function AdminVerificationPage() {
  const [items, setItems] = useState<AdminVerificationRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadVerifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getVerifications({
        status: statusFilter,
        page: 1,
        limit: 50,
      });
      setItems(res.data);
      setTotalCount(res.count);
    } catch (err) {
      console.warn('[Admin Verification] Failed to load:', err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadVerifications();
  }, [loadVerifications]);

  const handleAction = async (id: string, newStatus: 'VERIFIED' | 'REJECTED') => {
    let rejectionReason: string | undefined;

    if (newStatus === 'REJECTED') {
      const input = window.prompt('Please enter the reason for rejecting this verification request:');
      if (!input || !input.trim()) {
        alert('A rejection reason is required to reject verification.');
        return;
      }
      rejectionReason = input.trim();
    } else {
      if (!window.confirm('Are you sure you want to approve this verification request?')) {
        return;
      }
    }

    setActionLoading(true);
    try {
      const res = await resolveVerification(id, newStatus, rejectionReason);
      if (res.success) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: newStatus,
                  rejection_reason: rejectionReason,
                }
              : item
          )
        );
      } else {
        alert(res.error || 'Failed to update verification request.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = items.filter((i) => i.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification & Trust Queue"
        subtitle="Review proof of ownership deeds, utility bills, and host identity credentials"
        badge={`${pendingCount} Awaiting Review`}
        badgeColor={
          pendingCount > 0
            ? 'bg-amber-100 text-amber-800 border-amber-200'
            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
        }
      />

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-brand-border p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-brand-canvas border border-brand-border text-xs text-brand-dark font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-brand-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-2 text-xs text-brand-muted">
            <Loader2 size={16} className="animate-spin text-brand-primary" />
            <span>Loading verification queue from Supabase...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-brand-muted text-xs">
            <p className="font-semibold text-brand-dark mb-1">Queue is empty</p>
            <p>No verification requests matched the selected filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-dense">
              <thead>
                <tr>
                  <th>Verification Target</th>
                  <th>Document Type</th>
                  <th>Submitted By</th>
                  <th>Document Link</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th className="text-right">Decision</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="font-bold text-brand-dark">{item.target_name}</div>
                      <div className="text-[11px] text-brand-muted font-mono">{item.id.slice(0, 8)}...</div>
                    </td>
                    <td>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-canvas text-brand-dark border border-brand-border">
                        {item.document_type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-brand-dark">{item.submitted_by}</div>
                      <div className="text-[11px] text-brand-muted font-mono">{item.target_id.slice(0, 8)}...</div>
                    </td>
                    <td>
                      <a
                        href={item.document_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
                      >
                        <FileText size={13} />
                        <span>View Document</span>
                        <ExternalLink size={11} />
                      </a>
                    </td>
                    <td className="text-xs text-brand-muted">{formatDate(item.created_at)}</td>
                    <td>
                      <StatusBadge status={item.status} />
                      {item.rejection_reason && (
                        <p className="text-[10px] text-rose-700 mt-0.5 max-w-xs truncate">
                          Reason: {item.rejection_reason}
                        </p>
                      )}
                    </td>
                    <td className="text-right">
                      {item.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAction(item.id, 'VERIFIED')}
                            disabled={actionLoading}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                          >
                            <CheckCircle2 size={13} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleAction(item.id, 'REJECTED')}
                            disabled={actionLoading}
                            className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                          >
                            <XCircle size={13} />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-brand-muted">Action Recorded</span>
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
