export type AdminRole =
  | 'SUPER_ADMIN'
  | 'OPERATIONS'
  | 'MODERATION'
  | 'VERIFICATION'
  | 'SUPPORT'
  | 'FINANCE'
  | 'CONTENT_MANAGER';

export type AdminStatus = 'ACTIVE' | 'SUSPENDED' | 'INVITED';

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  status: AdminStatus;
  avatar_url?: string;
  last_sign_in_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_user_id: string;
  admin_email: string;
  admin_role: AdminRole;
  action: string;
  target_type:
    | 'USER'
    | 'PROPERTY'
    | 'FLATMATE'
    | 'REPORT'
    | 'VERIFICATION'
    | 'SUPPORT_TICKET'
    | 'SYSTEM_SETTINGS'
    | 'ADMIN_USER'
    | 'NOTIFICATION';
  target_id: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface OverviewMetrics {
  totalUsers: number;
  activeUsers: number;
  totalProperties: number;
  activeProperties: number;
  totalFlatmateProfiles: number;
  pendingVerifications: number;
  openReports: number;
  openSupportTickets: number;
  totalEnquiries: number;
  scheduledVisits: number;
}

export interface RecentActivityItem {
  id: string;
  type: 'PROPERTY_PUBLISHED' | 'USER_REGISTERED' | 'REPORT_FILED' | 'VERIFICATION_REQUESTED' | 'VISIT_BOOKED';
  title: string;
  description: string;
  timestamp: string;
  entityId: string;
  entityType: string;
  status?: 'SUCCESS' | 'WARNING' | 'DANGER' | 'INFO';
}

export interface PendingActionItem {
  id: string;
  category: 'VERIFICATION' | 'REPORT' | 'SUPPORT' | 'MODERATION';
  title: string;
  subtitle: string;
  count: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  route: string;
}
