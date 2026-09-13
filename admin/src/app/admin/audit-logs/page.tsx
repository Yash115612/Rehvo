'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { ScrollText, Search, Shield, Filter, Terminal, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { ADMIN_ROLE_LABELS, ADMIN_ROLE_COLORS } from '@/lib/auth/admin-auth';
import { getAuditLogs } from '@/lib/supabase/admin-service';
import { AdminAuditLog, AdminRole } from '@/types/admin';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAuditLogs()
      .then((data) => setLogs(data))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.admin_email.toLowerCase().includes(search.toLowerCase()) ||
      log.target_id.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || log.target_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Audit Logs"
        subtitle="Immutable security trail of all operational actions and platform modifications"
        badge="Security Trace"
      />

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-brand-border p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Search by action, email, or entity ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-brand-canvas pl-9 pr-3 py-1.5 rounded-lg border border-brand-border text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-brand-canvas border border-brand-border text-xs text-brand-dark font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-brand-primary"
          >
            <option value="ALL">All Target Types</option>
            <option value="PROPERTY">Properties</option>
            <option value="REPORT">Safety Reports</option>
            <option value="VERIFICATION">Verification</option>
            <option value="USER">Users</option>
            <option value="SYSTEM_SETTINGS">Settings</option>
            <option value="ADMIN_USER">Admin User</option>
            <option value="NOTIFICATION">Notification</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-2 text-xs text-brand-muted">
            <Loader2 size={16} className="animate-spin text-brand-primary" />
            <span>Loading audit log trace from Supabase...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-brand-muted text-xs">
            <p className="font-semibold text-brand-dark mb-1">No audit records</p>
            <p>No audit trail logs matched your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-dense">
              <thead>
                <tr>
                  <th>Operator</th>
                  <th>Executed Action</th>
                  <th>Target Type / ID</th>
                  <th>Metadata Payload</th>
                  <th>IP / Origin</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => {
                  const style = ADMIN_ROLE_COLORS[log.admin_role as AdminRole] || ADMIN_ROLE_COLORS.OPERATIONS_MANAGER;
                  return (
                    <tr key={log.id}>
                      <td>
                        <div className="text-xs font-bold text-brand-dark">{log.admin_email}</div>
                        <span
                          className="inline-block text-[9.5px] font-bold px-1.5 py-0.2 rounded border mt-0.5"
                          style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}
                        >
                          {ADMIN_ROLE_LABELS[log.admin_role] || log.admin_role}
                        </span>
                      </td>
                      <td>
                        <span className="font-mono text-xs font-bold text-brand-primary bg-brand-primary-light px-2 py-0.5 rounded border border-brand-primary/20">
                          {log.action}
                        </span>
                      </td>
                      <td>
                        <div className="text-xs font-semibold text-brand-dark">{log.target_type}</div>
                        <div className="text-[11px] font-mono text-brand-muted">{log.target_id}</div>
                      </td>
                      <td>
                        <pre className="text-[10.5px] font-mono bg-brand-canvas p-1.5 rounded border border-brand-border max-w-xs overflow-x-auto text-brand-dark/90">
                          {JSON.stringify(log.metadata || {}, null, 1)}
                        </pre>
                      </td>
                      <td className="text-xs text-brand-muted font-mono">{log.ip_address || '127.0.0.1'}</td>
                      <td className="text-xs text-brand-muted">{formatDate(log.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
