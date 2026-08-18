'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Search, Filter, Shield, UserCheck, Phone, Mail, MoreHorizontal, CheckCircle2, Ban, RotateCcw, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { getUsers, toggleUserSuspension, AdminUserRecord } from '@/lib/supabase/admin-service';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [verificationFilter, setVerificationFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getUsers({
        search,
        role: roleFilter,
        verification: verificationFilter,
        page: 1,
        limit: 50,
      });
      setUsers(res.data);
      setTotalCount(res.count);
    } catch (err) {
      console.warn('[Admin Users] Failed to load:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, roleFilter, verificationFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggleSuspension = async (user: AdminUserRecord) => {
    const nextState = !user.is_blocked;
    const confirmPrompt = nextState
      ? `Are you sure you want to suspend ${user.name}? This will revoke their access to REHVO.`
      : `Are you sure you want to restore access for ${user.name}?`;

    if (!window.confirm(confirmPrompt)) return;

    setActionLoading(true);
    try {
      const res = await toggleUserSuspension(user.id, nextState);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, is_blocked: nextState } : u))
        );
      } else {
        alert(res.error || 'Failed to update user status.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Directory"
        subtitle="Manage renter, owner, and flatmate profiles across REHVO"
        badge={`${totalCount} Total Registered`}
      />

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-brand-border p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Search by name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-brand-canvas pl-9 pr-3 py-1.5 rounded-lg border border-brand-border text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-brand-canvas border border-brand-border text-xs text-brand-dark font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-brand-primary"
          >
            <option value="ALL">All Roles</option>
            <option value="RENTER">Renters</option>
            <option value="OWNER">Property Owners</option>
            <option value="FLATMATE">Flatmates</option>
          </select>

          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="bg-brand-canvas border border-brand-border text-xs text-brand-dark font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-brand-primary"
          >
            <option value="ALL">All Verification</option>
            <option value="VERIFIED">Verified Only</option>
            <option value="PENDING">Pending Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-2 text-xs text-brand-muted">
            <Loader2 size={16} className="animate-spin text-brand-primary" />
            <span>Loading user profiles from Supabase...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-brand-muted text-xs">
            <p className="font-semibold text-brand-dark mb-1">No users found</p>
            <p>No user accounts matched your active filters or search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-dense">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Phone / Contact</th>
                  <th>Role</th>
                  <th>Verification</th>
                  <th>Status</th>
                  <th>Listings</th>
                  <th>Joined</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={user.is_blocked ? 'bg-rose-50/40' : ''}>
                    <td>
                      <div className="font-bold text-brand-dark">{user.name}</div>
                      <div className="text-[11px] text-brand-muted font-mono">{user.id.slice(0, 13)}...</div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-brand-dark">{user.phone}</div>
                      <div className="text-[11px] text-brand-muted">{user.email}</div>
                    </td>
                    <td>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-canvas text-brand-dark border border-brand-border">
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={user.verification_status} />
                    </td>
                    <td>
                      {user.is_blocked ? (
                        <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                          SUSPENDED
                        </span>
                      ) : (
                        <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="text-xs font-bold text-brand-dark">
                        {user.properties_count}
                      </span>
                    </td>
                    <td className="text-xs text-brand-muted">{formatDate(user.created_at)}</td>
                    <td className="text-right">
                      <button
                        onClick={() => handleToggleSuspension(user)}
                        disabled={actionLoading}
                        className={`p-1.5 rounded text-xs font-bold transition-colors inline-flex items-center gap-1 ${
                          user.is_blocked
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                        title={user.is_blocked ? 'Restore User Access' : 'Suspend User'}
                      >
                        {user.is_blocked ? (
                          <>
                            <RotateCcw size={13} />
                            <span>Restore</span>
                          </>
                        ) : (
                          <>
                            <Ban size={13} />
                            <span>Suspend</span>
                          </>
                        )}
                      </button>
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
