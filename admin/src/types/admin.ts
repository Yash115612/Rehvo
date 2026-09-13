export type AdminRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'PROPERTY_MODERATOR'
  | 'SUPPORT_EXECUTIVE'
  | 'FINANCE_MANAGER'
  | 'SALES_EXECUTIVE'
  | 'CONTENT_MANAGER'
  | 'MARKETING_MANAGER'
  | 'AI_MANAGER'
  | 'OPERATIONS_MANAGER';

export const ADMIN_ROLES: Record<AdminRole, { label: string; department: string; color: string; description: string }> = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    department: 'Executive Operations',
    color: 'emerald',
    description: 'Unrestricted full access across all platform systems and settings',
  },
  ADMIN: {
    label: 'Platform Admin',
    department: 'General Administration',
    color: 'emerald',
    description: 'High-level administration across CRM, CMS, and operations',
  },
  PROPERTY_MODERATOR: {
    label: 'Property Moderator',
    department: 'Listing Moderation & Quality',
    color: 'blue',
    description: 'Verification of listings, media quality, deeds, and sanctions',
  },
  SUPPORT_EXECUTIVE: {
    label: 'Support Executive',
    department: 'Customer Care & Resolution',
    color: 'purple',
    description: 'Ticket resolution, live user chat, and escalation handling',
  },
  FINANCE_MANAGER: {
    label: 'Finance Manager',
    department: 'Treasury, Billing & Invoicing',
    color: 'amber',
    description: 'Razorpay transactions, payouts, GST invoices, and refunds',
  },
  SALES_EXECUTIVE: {
    label: 'Sales Executive',
    department: 'Growth & Account Onboarding',
    color: 'cyan',
    description: 'Owner onboarding, lead follow-ups, and visit conversions',
  },
  CONTENT_MANAGER: {
    label: 'Content Manager',
    department: 'Marketing & Editorial',
    color: 'rose',
    description: 'Website CMS, Showreels, hero banners, and promotional cards',
  },
  MARKETING_MANAGER: {
    label: 'Marketing Manager',
    department: 'Acquisition & Campaigns',
    color: 'pink',
    description: 'Push notifications, WhatsApp blasts, campaigns, and funnels',
  },
  AI_MANAGER: {
    label: 'AI Systems Manager',
    department: 'AI Engine & Concierge',
    color: 'indigo',
    description: 'System prompts, Knowledge Base vectors, token quotas & models',
  },
  OPERATIONS_MANAGER: {
    label: 'Operations Manager',
    department: 'Field Visits & Society Ops',
    color: 'orange',
    description: 'Physical property visits, agent dispatch, and society onboarding',
  },
};

export type AdminStatus = 'ACTIVE' | 'SUSPENDED' | 'INVITED';

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  status: AdminStatus;
  avatar_url?: string;
  employee_id?: string;
  phone?: string;
  department?: string;
  city?: string;
  joining_date?: string;
  last_sign_in_at?: string;
  is_online?: boolean;
  assigned_tickets_count?: number;
  assigned_visits_count?: number;
  created_at: string;
  updated_at: string;
}

export interface StaffAttendance {
  id: string;
  staff_id: string;
  staff_name: string;
  date: string;
  login_time: string;
  logout_time?: string;
  is_active: boolean;
  ip_address: string;
  device: string;
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
    | 'NOTIFICATION'
    | 'PAYMENT'
    | 'SHOWREEL'
    | 'CMS';
  target_id: string;
  previous_value?: string;
  new_value?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface OverviewMetrics {
  totalUsers: number;
  totalOwners: number;
  totalRenters?: number;
  activeProperties: number;
  pendingProperties: number;
  totalFlatmateProfiles: number;
  totalPgListings: number;
  totalCommercialListings: number;
  totalShowreels: number;
  revenueToday: number;
  revenueMonth: number;
  monthlyRevenue?: number;
  pendingVerifications: number;
  openSupportTickets: number;
  totalEnquiries: number;
  scheduledVisits: number;
  pendingVisits?: number;
  activeUsers: number;
  totalProperties: number;
  openReports: number;
}

export interface RecentActivityItem {
  id: string;
  type:
    | 'PROPERTY_PUBLISHED'
    | 'USER_REGISTERED'
    | 'REPORT_FILED'
    | 'VERIFICATION_REQUESTED'
    | 'VISIT_BOOKED'
    | 'PAYMENT_RECEIVED'
    | 'SHOWREEL_UPLOADED';
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

export interface ShowReelItem {
  id: string;
  title: string;
  src: string;
  poster?: string;
  category: 'RESIDENTIAL' | 'COMMERCIAL' | 'PG' | 'FLATMATES' | 'LIFESTYLE';
  locality: string;
  city: string;
  property_id?: string;
  caption: string;
  tags: string[];
  views_count: number;
  watch_time_mins: number;
  shares_count: number;
  saves_count: number;
  ctr_percent: number;
  is_featured: boolean;
  is_trending: boolean;
  status: 'PUBLISHED' | 'SCHEDULED' | 'DRAFT' | 'EXPIRED';
  publish_at?: string;
  expires_at?: string;
  created_at: string;
}

export interface VisitBooking {
  id: string;
  property_id: string;
  property_title: string;
  property_locality: string;
  property_city: string;
  renter_id: string;
  renter_name: string;
  renter_phone: string;
  owner_id: string;
  owner_name: string;
  owner_phone: string;
  assigned_executive_id?: string;
  assigned_executive_name?: string;
  scheduled_date: string;
  scheduled_time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  otp_verified: boolean;
  gps_checked_in: boolean;
  notes?: string;
  created_at: string;
}

export interface PaymentTransaction {
  id: string;
  transaction_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  type: 'BROKERAGE' | 'SUBSCRIPTION' | 'FEATURED_LISTING' | 'REFUND' | 'WALLET_RELOAD' | 'SOCIETY_ONBOARDING';
  amount: number;
  gst_amount: number;
  total_amount: number;
  gateway: 'RAZORPAY' | 'UPI' | 'WALLET' | 'BANK_TRANSFER';
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  invoice_number: string;
  created_at: string;
}

export interface SupportTicketItem {
  id: string;
  ticket_number: string;
  user_id: string;
  user_name: string;
  user_role: 'renter' | 'owner' | 'flatmate';
  subject: string;
  description: string;
  department: 'PROPERTY' | 'PAYMENTS' | 'AI' | 'SHOWREEL' | 'SOCIETY' | 'BUG';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  sla_deadline: string;
  assigned_to?: string;
  internal_notes?: string;
  created_at: string;
}
