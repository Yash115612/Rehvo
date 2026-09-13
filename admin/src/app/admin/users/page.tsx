'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  Search, Filter, Shield, UserCheck, Phone, Mail, Ban, RotateCcw, 
  Loader2, Download, Building2, User, Users, ArrowUpRight 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { getUsers, toggleUserSuspension, AdminUserRecord } from '@/lib/supabase/admin-service';
import { exportToCSV } from '@/lib/export/csv-pdf';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [verificationFilter, setVerificationFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
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

  const handleExport = () => {
    exportToCSV(
      users.map((u) => ({
        ID: u.id,
        Name: u.name,
        Email: u.email,
        Phone: u.phone,
        Role: u.role,
        Verification: u.verification_status,
        PropertiesCount: u.properties_count,
        Suspended: u.is_blocked ? 'YES' : 'NO',
        CreatedAt: u.created_at,
      })),
      'rehvo_users_directory'
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Unified User Directory"
        subtitle="Cross-platform directory covering Renters, Property Owners, and Flatmates"
        badge={`${totalCount} Registered Accounts`}
        actions={
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16161A] hover:bg-[#1E1E24] text-neutral-300 text-xs font-semibold border border-white/10 transition-colors"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        }
      />

      {/* Navigation Sub-Tabs to Dedicated CRMs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/admin/owners"
          className="flex items-center justify-between p-3.5 rounded-xl bg-[#121215] border border-white/5 hover:border-emerald-500/30 group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Building2 size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                Owners CRM
              </div>
              <div className="text-[11px] text-neutral-500">Deeds, KYC, payouts & impersonation</div>
            </div>
          </div>
          <ArrowUpRight size={14} className="text-neutral-500 group-hover:text-emerald-400" />
        </Link>

        <Link
          href="/admin/renters"
          className="flex items-center justify-between p-3.5 rounded-xl bg-[#121215] border border-white/5 hover:border-blue-500/30 group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <User size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                Renters CRM
              </div>
              <div className="text-[11px] text-neutral-500">Saved homes, AI tours & R-Cash</div>
            </div>
          </div>
          <ArrowUpRight size={14} className="text-neutral-500 group-hover:text-blue-400" />
        </Link>

        <Link
          href="/admin/flatmates"
          className="flex items-center justify-between p-3.5 rounded-xl bg-[#121215] border border-white/5 hover:border-purple-500/30 group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <Users size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                Flatmates Moderation
              </div>
              <div className="text-[11px] text-neutral-500">VibeMatch & lifestyle tags</div>
            </div>
          </div>
          <ArrowUpRight size={14} className="text-neutral-500 group-hover:text-purple-400" />
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#121215] rounded-xl border border-white/5 p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#16161A] pl-9 pr-3 py-1.5 rounded-lg border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#16161A] border border-white/10 text-xs text-neutral-200 font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Roles</option>
            <option value="RENTER">Renters</option>
            <option value="OWNER">Property Owners</option>
            <option value="FLATMATE">Flatmates</option>
          </select>

          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="bg-[#16161A] border border-white/10 text-xs text-neutral-200 font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Verification</option>
            <option value="VERIFIED">Verified Only</option>
            <option value="PENDING">Pending Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#121215] rounded-xl border border-white/5 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-2 text-xs text-neutral-400">
            <Loader2 size={16} className="animate-spin text-emerald-500" />
            <span>Loading user profiles from Supabase...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 text-xs">
            <p className="font-semibold text-neutral-300 mb-1">No users found</p>
            <p>No user accounts matched your active filters or search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-dense">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>KYC Status</th>
                  <th>State</th>
                  <th>Listings</th>
                  <th>Created</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={user.is_blocked ? 'bg-rose-500/5' : ''}>
                    <td>
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">{user.id.slice(0, 16)}...</div>
                    </td>
                    <td>
                      <div className="text-xs text-neutral-300">{user.phone || '—'}</div>
                      <div className="text-[11px] text-neutral-500">{user.email || '—'}</div>
                    </td>
                    <td>
                      <span className="text-[10.5px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10">
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={user.verification_status} />
                    </td>
                    <td>
                      {user.is_blocked ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          SUSPENDED
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="text-xs font-semibold text-neutral-300">
                        {user.properties_count}
                      </span>
                    </td>
                    <td className="text-xs text-neutral-500">{formatDate(user.created_at)}</td>
                    <td className="text-right">
                      <button
                        onClick={() => handleToggleSuspension(user)}
                        disabled={actionLoading}
                        className={`p-1.5 rounded text-xs font-bold transition-colors inline-flex items-center gap-1 ${
                          user.is_blocked
                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                        }`}
                        title={user.is_blocked ? 'Restore User Access' : 'Suspend User'}
                      >
                        {user.is_blocked ? (
                          <>
                            <RotateCcw size={12} />
                            <span>Restore</span>
                          </>
                        ) : (
                          <>
                            <Ban size={12} />
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
