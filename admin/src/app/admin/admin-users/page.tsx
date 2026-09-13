'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { UserPlus, UserCog, MoreHorizontal, ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';
import { ADMIN_ROLE_LABELS, ADMIN_ROLE_COLORS } from '@/lib/auth/admin-auth';
import { AdminRole, AdminUser } from '@/types/admin';
import { formatDate } from '@/lib/utils';
import { getAdminUsers, logAdminAction } from '@/lib/supabase/admin-service';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export default function AdminUsersDirectoryPage() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('OPERATIONS_MANAGER');
  const [adminList, setAdminList] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAdminUsers = async () => {
    setIsLoading(true);
    try {
      const users = await getAdminUsers();
      setAdminList(users);
    } catch (err) {
      console.warn('[Admin Directory] Failed to load admins:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dbRole = inviteRole.toLowerCase();
      const { data, error } = await supabase
        .from('admin_users')
        .insert({
          email: inviteEmail.trim().toLowerCase(),
          full_name: inviteName.trim(),
          role: dbRole,
          status: 'invited',
        })
        .select()
        .single();

      if (error) throw error;

      await logAdminAction({
        action: 'INVITE_ADMIN_USER',
        targetType: 'admin_user',
        targetId: data.id,
        metadata: { email: inviteEmail, role: inviteRole, full_name: inviteName },
      });

      setInviteEmail('');
      setInviteName('');
      setInviteModalOpen(false);
      loadAdminUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to provision admin user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Users & Permissions"
        subtitle="Manage control panel operators, role assignments, and privileged access tokens"
        badge={`${adminList.length} Staff Provisioned`}
      >
        <button
          onClick={() => setInviteModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-dark hover:bg-brand-primary text-white text-xs font-bold transition-colors shadow-xs"
        >
          <UserPlus size={14} />
          <span>Invite Admin User</span>
        </button>
      </PageHeader>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-brand-border p-6 max-w-md w-full shadow-popover space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="text-sm font-bold text-brand-dark">Invite Operational Admin</h3>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="text-xs text-brand-muted hover:text-brand-dark font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-brand-canvas px-3 py-2 rounded-lg border border-brand-border text-xs text-brand-dark focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="rahul@rehvo.com"
                  className="w-full bg-brand-canvas px-3 py-2 rounded-lg border border-brand-border text-xs text-brand-dark focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                  Admin Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as AdminRole)}
                  className="w-full bg-brand-canvas px-3 py-2 rounded-lg border border-brand-border text-xs font-semibold text-brand-dark focus:outline-none focus:border-brand-primary"
                >
                  <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
                  <option value="OPERATIONS">Operations</option>
                  <option value="VERIFICATION">Verification & Deeds</option>
                  <option value="MODERATION">Moderation & Reports</option>
                  <option value="SUPPORT">Support</option>
                  <option value="CONTENT_MANAGER">Content Manager</option>
                  <option value="FINANCE">Finance</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-brand-border text-xs font-bold text-brand-dark hover:bg-brand-canvas"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-xs disabled:opacity-60"
                >
                  {isSubmitting ? 'Provisioning...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Users Table */}
      <div className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-2 text-xs text-brand-muted">
            <Loader2 size={16} className="animate-spin text-brand-primary" />
            <span>Loading admin staff directory...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-dense">
              <thead>
                <tr>
                  <th>Admin Profile</th>
                  <th>Assigned Role</th>
                  <th>Access Status</th>
                  <th>Provisioned Date</th>
                  <th>Account ID</th>
                </tr>
              </thead>
              <tbody>
                {adminList.map((adm) => {
                  const style = ADMIN_ROLE_COLORS[adm.role] || ADMIN_ROLE_COLORS.OPERATIONS_MANAGER;
                  return (
                    <tr key={adm.id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-brand-dark text-white text-xs font-bold flex items-center justify-center border border-brand-border">
                            {adm.full_name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-brand-dark">{adm.full_name}</div>
                            <div className="text-[11px] text-brand-muted">{adm.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className="inline-block text-[11px] font-bold px-2 py-0.5 rounded border"
                          style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}
                        >
                          {ADMIN_ROLE_LABELS[adm.role] || adm.role}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={adm.status} />
                      </td>
                      <td className="text-xs text-brand-muted">{formatDate(adm.created_at)}</td>
                      <td className="text-xs text-brand-muted font-mono">{adm.id.slice(0, 10)}...</td>
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
