import { AdminUser, AdminRole } from '@/types/admin';

// Default mock admin user for local development and demonstration
export const MOCK_ADMIN_USER: AdminUser = {
  id: 'admin_usr_01',
  user_id: 'usr_super_admin',
  email: 'admin@rehvo.com',
  full_name: 'Antigravity Super Admin',
  role: 'SUPER_ADMIN',
  status: 'ACTIVE',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  created_at: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
};

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  OPERATIONS: 'Operations',
  MODERATION: 'Moderation',
  VERIFICATION: 'Verification',
  SUPPORT: 'Support',
  FINANCE: 'Finance',
  CONTENT_MANAGER: 'Content Manager',
};

export const ADMIN_ROLE_COLORS: Record<AdminRole, { bg: string; text: string; border: string }> = {
  SUPER_ADMIN: { bg: '#ECE8FF', text: '#6C4DFF', border: '#D3C9FF' },
  OPERATIONS: { bg: '#E0F2FE', text: '#0284C7', border: '#BAE6FD' },
  MODERATION: { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
  VERIFICATION: { bg: '#EAF8F0', text: '#16A34A', border: '#BBF7D0' },
  SUPPORT: { bg: '#EDE9FE', text: '#7C3AED', border: '#DDD6FE' },
  FINANCE: { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
  CONTENT_MANAGER: { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' },
};

/**
 * Checks whether an admin user holds any of the permitted roles
 */
export function hasAdminPermission(
  userRole: AdminRole,
  allowedRoles: AdminRole[]
): boolean {
  if (userRole === 'SUPER_ADMIN') return true;
  return allowedRoles.includes(userRole);
}
