'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  UserCog,
  Search,
  Download,
  Plus,
  Ban,
  Lock,
  Trash2,
  X,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { AdminUser, AdminRole } from '@/types/admin';
import {
  ADMIN_ROLE_LABELS,
  ADMIN_ROLE_COLORS,
} from '@/lib/auth/admin-auth';
import { exportToCSV } from '@/lib/export/csv-pdf';
import { getAdminUsers } from '@/lib/supabase/admin-service';

function AdminStaffContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'directory';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [staffList, setStaffList] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Invite Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<AdminRole>('PROPERTY_MODERATOR');
  const [department, setDepartment] = useState('Operations & Verification');
  const [city, setCity] = useState('Mumbai');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminUsers();
      setStaffList(data || []);
    } catch (err) {
      console.warn('Failed to load admin users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = staffList.filter(
    (s) =>
      (s.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.department || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.employee_id || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = (id: string, action: 'SUSPEND' | 'RESET' | 'DELETE') => {
    if (action === 'DELETE') {
      if (window.confirm('Are you sure you want to remove this staff member?')) {
        setStaffList((prev) => prev.filter((s) => s.id !== id));
      }
      return;
    }
    if (action === 'RESET') {
      alert('Password reset link dispatched to staff work email.');
      return;
    }
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED' } : s))
    );
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff: AdminUser = {
      id: `admin_usr_${Date.now()}`,
      user_id: `usr_${Date.now()}`,
      employee_id: `RHV-0${staffList.length + 1}`,
      email,
      full_name: name,
      role,
      status: 'ACTIVE',
      department,
      city,
      phone,
      joining_date: new Date().toISOString().slice(0, 10),
      is_online: true,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStaffList([...staffList, newStaff]);
    setInviteModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-900 dark:text-white">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Staff Management & Team Roster
            </h1>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#10B981]/15 dark:text-[#10B981] dark:border-[#10B981]/30">
              {staffList.length} Active Staff Members
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Provision employee access, assign departmental roles, monitor shift attendance, and audit activity
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
            onClick={() => exportToCSV(staffList, 'rehvo_staff_directory')}
            disabled={staffList.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition disabled:opacity-50"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setInviteModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E8F73] hover:bg-[#10B981] text-white text-xs font-extrabold shadow-sm transition"
          >
            <Plus size={14} />
            <span>Invite Staff</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 text-xs font-bold">
        {[
          { id: 'directory', label: 'Staff Directory' },
          { id: 'attendance', label: 'Attendance & Shifts' },
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
            placeholder="Search by staff name, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#16161A] pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#10B981]"
          />
        </div>
      </div>

      {/* 4. Table */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="animate-spin text-[#10B981] mx-auto mb-3" size={28} />
          <p className="text-xs text-slate-500 font-medium">Loading staff roster from Supabase...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
          <UserCog size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Staff Members Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try clearing your search query or invite a new staff member to the team.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#16161A] text-slate-500 border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Staff Member</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Employee ID</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Role</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Department & City</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Contact</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Shift Status</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Joining Date</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px] text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map((staff) => {
                  const roleStyle = ADMIN_ROLE_COLORS[staff.role] || ADMIN_ROLE_COLORS.ADMIN;
                  return (
                    <tr key={staff.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center font-black text-xs text-slate-700 dark:text-slate-200 shrink-0">
                            {staff.full_name?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-xs">{staff.full_name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{staff.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono text-xs text-slate-600 dark:text-slate-300 font-bold">{staff.employee_id}</span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: roleStyle.bg, color: roleStyle.text, border: `1px solid ${roleStyle.border}` }}
                        >
                          {ADMIN_ROLE_LABELS[staff.role] || staff.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="text-xs text-slate-700 dark:text-slate-200 font-semibold">{staff.department}</div>
                        <div className="text-[10px] text-slate-400">{staff.city}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="text-xs text-slate-600 dark:text-slate-300">{staff.phone}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              staff.is_online ? 'bg-[#10B981] animate-pulse' : 'bg-slate-400'
                            }`}
                          />
                          <span className="text-xs font-semibold text-slate-700 dark:text-white">
                            {staff.is_online ? 'Active' : 'Offline'}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="text-xs text-slate-400">{staff.joining_date}</span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAction(staff.id, 'RESET')}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                            title="Reset Password"
                          >
                            <Lock size={13} />
                          </button>
                          <button
                            onClick={() => handleAction(staff.id, 'SUSPEND')}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-amber-600 transition"
                            title={staff.status === 'SUSPENDED' ? 'Activate Staff' : 'Suspend Access'}
                          >
                            <Ban size={13} />
                          </button>
                          <button
                            onClick={() => handleAction(staff.id, 'DELETE')}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-rose-600 transition"
                            title="Delete Account"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 text-slate-900 dark:text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Invite New Staff Member</h3>
              <button onClick={() => setInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Verma"
                  className="w-full bg-slate-50 dark:bg-[#16161A] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@rehvo.com"
                  className="w-full bg-slate-50 dark:bg-[#16161A] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Role Assignment
                  </label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#16161A] px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#10B981]"
                  >
                    {Object.keys(ADMIN_ROLE_LABELS).map((r) => (
                      <option key={r} value={r}>
                        {ADMIN_ROLE_LABELS[r as AdminRole]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="w-full bg-slate-50 dark:bg-[#16161A] px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E8F73] hover:bg-[#10B981] text-xs font-bold text-white shadow-sm"
                >
                  Create & Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminStaffPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-neutral-500">Loading Staff Directory...</div>}>
      <AdminStaffContent />
    </React.Suspense>
  );
}
