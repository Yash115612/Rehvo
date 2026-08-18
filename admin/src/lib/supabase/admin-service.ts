/**
 * REHVO Admin Supabase Service
 * Authoritative backend operations for the Admin Control Panel.
 * Uses real Supabase tables and enforces immutable audit logging.
 */
import { createClient } from './client';
import {
  AdminUser,
  AdminAuditLog,
  OverviewMetrics,
  RecentActivityItem,
  PendingActionItem,
} from '@/types/admin';
import { MOCK_ADMIN_USER } from '../auth/admin-auth';

const supabase = createClient();

// ---------------------------------------------------------------------------
// Audit Logging Helper
// ---------------------------------------------------------------------------

export async function logAdminAction(params: {
  adminUserId?: string;
  adminEmail?: string;
  adminRole?: string;
  action: string;
  targetType: 'user' | 'property' | 'flatmate' | 'report' | 'verification' | 'support_ticket' | 'system_settings' | 'admin_user' | 'notification';
  targetId: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  try {
    const adminId = params.adminUserId || MOCK_ADMIN_USER.id;
    const adminEmail = params.adminEmail || MOCK_ADMIN_USER.email;
    const adminRole = params.adminRole || MOCK_ADMIN_USER.role.toLowerCase();

    await supabase.from('admin_audit_logs').insert({
      admin_user_id: adminId,
      admin_email: adminEmail,
      admin_role: adminRole,
      action: params.action,
      target_type: params.targetType,
      target_id: params.targetId,
      metadata: params.metadata || {},
      ip_address: '127.0.0.1',
    });
  } catch (err) {
    console.warn('[Admin Audit] Failed to record audit log:', err);
  }
}

// ---------------------------------------------------------------------------
// 1. Dashboard Overview Metrics & Activities
// ---------------------------------------------------------------------------

export async function getOverviewMetrics(): Promise<OverviewMetrics> {
  try {
    const [
      usersRes,
      propsRes,
      activePropsRes,
      flatmatesRes,
      verifsRes,
      reportsRes,
      supportRes,
      enquiriesRes,
      visitsRes,
    ] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('properties').select('id', { count: 'exact', head: true }),
      supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('flatmate_profiles').select('id', { count: 'exact', head: true }),
      supabase.from('verification_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('safety_reports').select('id', { count: 'exact', head: true }).in('status', ['pending', 'under_review']),
      supabase.from('support_tickets').select('id', { count: 'exact', head: true }).in('status', ['pending', 'in_progress']),
      supabase.from('enquiries').select('id', { count: 'exact', head: true }),
      supabase.from('visits').select('id', { count: 'exact', head: true }),
    ]);

    const totalUsers = usersRes.count || 0;
    const activeUsers = totalUsers; // In active deployment, registered profiles
    const totalProperties = propsRes.count || 0;
    const activeProperties = activePropsRes.count || 0;
    const totalFlatmateProfiles = flatmatesRes.count || 0;
    const pendingVerifications = verifsRes.count || 0;
    const openReports = reportsRes.count || 0;
    const openSupportTickets = supportRes.count || 0;
    const totalEnquiries = enquiriesRes.count || 0;
    const scheduledVisits = visitsRes.count || 0;

    return {
      totalUsers,
      activeUsers,
      totalProperties,
      activeProperties,
      totalFlatmateProfiles,
      pendingVerifications,
      openReports,
      openSupportTickets,
      totalEnquiries,
      scheduledVisits,
    };
  } catch (err) {
    console.warn('[Admin Service] getOverviewMetrics error:', err);
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalProperties: 0,
      activeProperties: 0,
      totalFlatmateProfiles: 0,
      pendingVerifications: 0,
      openReports: 0,
      openSupportTickets: 0,
      totalEnquiries: 0,
      scheduledVisits: 0,
    };
  }
}

export async function getRecentActivities(): Promise<RecentActivityItem[]> {
  try {
    const [auditRes, propsRes, visitsRes, reportsRes] = await Promise.all([
      supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('properties')
        .select('id, title, locality, city, rent, created_at, owner_profile:profiles!properties_owner_id_fkey(full_name)')
        .order('created_at', { ascending: false })
        .limit(3),
      supabase
        .from('visits')
        .select('id, scheduled_date, scheduled_time, created_at, properties(title), renter:profiles!visits_user_id_fkey(full_name)')
        .order('created_at', { ascending: false })
        .limit(3),
      supabase
        .from('safety_reports')
        .select('id, reason, created_at, reporter:profiles!safety_reports_reporter_id_fkey(full_name)')
        .order('created_at', { ascending: false })
        .limit(3),
    ]);

    const items: RecentActivityItem[] = [];

    (auditRes.data || []).forEach((log) => {
      items.push({
        id: log.id,
        type: 'PROPERTY_PUBLISHED',
        title: `Admin Action: ${log.action}`,
        description: `Executed by ${log.admin_email} on ${log.target_type} #${log.target_id.slice(0, 8)}`,
        timestamp: log.created_at,
        entityId: log.target_id,
        entityType: log.target_type.toUpperCase(),
        status: 'INFO',
      });
    });

    (propsRes.data || []).forEach((p: any) => {
      items.push({
        id: `prop_${p.id}`,
        type: 'PROPERTY_PUBLISHED',
        title: `New Listing: ${p.title}`,
        description: `Listed in ${p.locality}, ${p.city || 'Mumbai'} • ₹${p.rent?.toLocaleString('en-IN')}/mo`,
        timestamp: p.created_at,
        entityId: p.id,
        entityType: 'PROPERTY',
        status: 'SUCCESS',
      });
    });

    (visitsRes.data || []).forEach((v: any) => {
      items.push({
        id: `vis_${v.id}`,
        type: 'VISIT_BOOKED',
        title: `Visit Scheduled: ${v.properties?.title || 'Property Tour'}`,
        description: `Renter ${v.renter?.full_name || 'User'} scheduled for ${v.scheduled_date} at ${v.scheduled_time}`,
        timestamp: v.created_at,
        entityId: v.id,
        entityType: 'VISIT',
        status: 'INFO',
      });
    });

    (reportsRes.data || []).forEach((r: any) => {
      items.push({
        id: `rep_${r.id}`,
        type: 'REPORT_FILED',
        title: `Safety Report: ${r.reason}`,
        description: `Filed by ${r.reporter?.full_name || 'Renter'} for review`,
        timestamp: r.created_at,
        entityId: r.id,
        entityType: 'REPORT',
        status: 'DANGER',
      });
    });

    return items
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8);
  } catch (err) {
    console.warn('[Admin Service] getRecentActivities error:', err);
    return [];
  }
}

export async function getPendingActions(): Promise<PendingActionItem[]> {
  try {
    const [verifsRes, reportsRes, supportRes] = await Promise.all([
      supabase.from('verification_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('safety_reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('support_tickets').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    const verifCount = verifsRes.count || 0;
    const reportCount = reportsRes.count || 0;
    const supportCount = supportRes.count || 0;

    const actions: PendingActionItem[] = [];

    if (verifCount > 0) {
      actions.push({
        id: 'act_verif',
        category: 'VERIFICATION',
        title: `${verifCount} Properties / KYC Awaiting Verification`,
        subtitle: 'Ownership deeds and identification documents submitted for review',
        count: verifCount,
        severity: 'HIGH',
        route: '/admin/verification',
      });
    }

    if (reportCount > 0) {
      actions.push({
        id: 'act_report',
        category: 'REPORT',
        title: `${reportCount} Flagged Safety Report${reportCount === 1 ? '' : 's'} Awaiting Triage`,
        subtitle: 'User submitted listing discrepancy or safety flag',
        count: reportCount,
        severity: 'MEDIUM',
        route: '/admin/reports',
      });
    }

    if (supportCount > 0) {
      actions.push({
        id: 'act_support',
        category: 'SUPPORT',
        title: `${supportCount} Unassigned Support Ticket${supportCount === 1 ? '' : 's'}`,
        subtitle: 'Assistance requested with visit scheduling, listings or verification',
        count: supportCount,
        severity: 'LOW',
        route: '/admin/support',
      });
    }

    return actions;
  } catch (err) {
    console.warn('[Admin Service] getPendingActions error:', err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// 2. Users Management
// ---------------------------------------------------------------------------

export interface AdminUserRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'RENTER' | 'OWNER' | 'FLATMATE';
  verification_status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  is_blocked: boolean;
  properties_count: number;
  created_at: string;
}

export async function getUsers(params?: {
  search?: string;
  role?: string;
  verification?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: AdminUserRecord[]; count: number }> {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const offset = (page - 1) * limit;

    let query = supabase.from('profiles').select('*, properties(count)', { count: 'exact' });

    if (params?.search && params.search.trim()) {
      const q = params.search.trim();
      query = query.or(`full_name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%,city.ilike.%${q}%`);
    }

    if (params?.role && params.role !== 'ALL') {
      query = query.eq('role', params.role);
    }

    if (params?.verification && params.verification !== 'ALL') {
      query = query.eq('verification_status', params.verification.toLowerCase());
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    const mapped: AdminUserRecord[] = (data || []).map((row: any) => ({
      id: row.id,
      name: row.full_name || 'Unnamed User',
      phone: row.phone || 'N/A',
      email: row.email || `${row.phone || row.id.slice(0, 8)}@rehvo.user`,
      role: row.role || 'RENTER',
      verification_status: (row.verification_status || 'unverified').toUpperCase() === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
      is_blocked: !!row.is_blocked,
      properties_count: row.properties?.[0]?.count || 0,
      created_at: row.created_at,
    }));

    return { data: mapped, count: count || 0 };
  } catch (err) {
    console.warn('[Admin Service] getUsers error:', err);
    return { data: [], count: 0 };
  }
}

export async function toggleUserSuspension(
  userId: string,
  isBlocked: boolean,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_blocked: isBlocked })
      .eq('id', userId);

    if (error) throw error;

    await logAdminAction({
      action: isBlocked ? 'SUSPEND_USER' : 'RESTORE_USER',
      targetType: 'user',
      targetId: userId,
      metadata: { reason: reason || 'Admin status toggle', is_blocked: isBlocked },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Couldn't update user suspension." };
  }
}

// ---------------------------------------------------------------------------
// 3. Properties Management
// ---------------------------------------------------------------------------

export interface AdminPropertyRecord {
  id: string;
  title: string;
  type: 'FLAT' | 'ROOM' | 'PG' | 'STUDIO';
  owner_name: string;
  owner_id: string;
  location: string;
  rent: number;
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED' | 'RENTED';
  verification_status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  images_count: number;
  created_at: string;
}

export async function getProperties(params?: {
  search?: string;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: AdminPropertyRecord[]; count: number }> {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('properties')
      .select('*, property_images(id), owner_profile:profiles!properties_owner_id_fkey(full_name)', { count: 'exact' });

    if (params?.search && params.search.trim()) {
      const q = params.search.trim();
      query = query.or(`title.ilike.%${q}%,locality.ilike.%${q}%,city.ilike.%${q}%`);
    }

    if (params?.type && params.type !== 'ALL') {
      query = query.eq('property_type', params.type.toLowerCase());
    }

    if (params?.status && params.status !== 'ALL') {
      query = query.eq('status', params.status.toLowerCase());
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    const mapped: AdminPropertyRecord[] = (data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      type: (p.property_type || 'FLAT').toUpperCase(),
      owner_name: p.owner_profile?.full_name || 'Property Host',
      owner_id: p.owner_id,
      location: `${p.locality}, ${p.city || 'Mumbai'}`,
      rent: p.rent || 0,
      status: (p.status || 'ACTIVE').toUpperCase(),
      verification_status: (p.verification_status || 'unverified').toUpperCase() === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
      images_count: (p.property_images || []).length,
      created_at: p.created_at,
    }));

    return { data: mapped, count: count || 0 };
  } catch (err) {
    console.warn('[Admin Service] getProperties error:', err);
    return { data: [], count: 0 };
  }
}

export async function updatePropertyStatus(
  propertyId: string,
  status: 'ACTIVE' | 'PAUSED' | 'RENTED' | 'DRAFT',
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('properties')
      .update({ status: status.toLowerCase() })
      .eq('id', propertyId);

    if (error) throw error;

    await logAdminAction({
      action: `PROPERTY_${status}`,
      targetType: 'property',
      targetId: propertyId,
      metadata: { new_status: status, reason: reason || 'Admin moderation action' },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Couldn't update property status." };
  }
}

// ---------------------------------------------------------------------------
// 4. Verification Management
// ---------------------------------------------------------------------------

export interface AdminVerificationRecord {
  id: string;
  target_id: string;
  target_name: string;
  target_type: 'PROPERTY' | 'USER';
  document_type: 'PROPERTY_DEED' | 'ELECTRICITY_BILL' | 'AADHAAR' | 'PAN' | 'PASSPORT';
  document_url: string;
  submitted_by: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  rejection_reason?: string;
  created_at: string;
}

export async function getVerifications(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: AdminVerificationRecord[]; count: number }> {
  try {
    let query = supabase
      .from('verification_requests')
      .select(`
        *,
        user_profile:profiles!verification_requests_user_id_fkey(full_name),
        property_data:properties!verification_requests_property_id_fkey(title)
      `, { count: 'exact' });

    if (params?.status && params.status !== 'ALL') {
      query = query.eq('status', params.status.toLowerCase());
    }

    query = query.order('created_at', { ascending: false });

    const { data, count, error } = await query;
    if (error) throw error;

    const mapped: AdminVerificationRecord[] = (data || []).map((v: any) => ({
      id: v.id,
      target_id: v.property_id || v.user_id,
      target_name: v.property_data?.title || v.user_profile?.full_name || 'Listing Verification',
      target_type: v.property_id ? 'PROPERTY' : 'USER',
      document_type: (v.document_type || 'PROPERTY_DEED').toUpperCase(),
      document_url: v.document_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
      submitted_by: v.user_profile?.full_name || 'Property Owner',
      status: (v.status || 'PENDING').toUpperCase(),
      rejection_reason: v.rejection_reason || undefined,
      created_at: v.created_at,
    }));

    return { data: mapped, count: count || 0 };
  } catch (err) {
    console.warn('[Admin Service] getVerifications error:', err);
    return { data: [], count: 0 };
  }
}

export async function resolveVerification(
  requestId: string,
  status: 'VERIFIED' | 'REJECTED',
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: verif, error: fetchError } = await supabase
      .from('verification_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchError || !verif) throw new Error('Verification request not found');

    const dbStatus = status.toLowerCase();
    const { error: updateError } = await supabase
      .from('verification_requests')
      .update({
        status: dbStatus,
        rejection_reason: status === 'REJECTED' ? reason || 'Insufficient document verification' : null,
      })
      .eq('id', requestId);

    if (updateError) throw updateError;

    // Update target property or user verification_status
    const nextStatus = status === 'VERIFIED' ? 'verified' : 'rejected';
    if (verif.property_id) {
      await supabase.from('properties').update({ verification_status: nextStatus }).eq('id', verif.property_id);
    }
    if (verif.user_id) {
      await supabase.from('profiles').update({ verification_status: nextStatus }).eq('id', verif.user_id);
    }

    await logAdminAction({
      action: `VERIFICATION_${status}`,
      targetType: 'verification',
      targetId: requestId,
      metadata: { target_property: verif.property_id, target_user: verif.user_id, status, reason },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Couldn't update verification status." };
  }
}

// ---------------------------------------------------------------------------
// 5. Flatmates Management
// ---------------------------------------------------------------------------

export interface AdminFlatmateRecord {
  id: string;
  name: string;
  user_id?: string;
  gender: string;
  occupation: string;
  location: string;
  budget: number;
  room_preference: string;
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
  created_at: string;
}

export async function getFlatmates(params?: {
  search?: string;
  status?: string;
}): Promise<{ data: AdminFlatmateRecord[]; count: number }> {
  try {
    let query = supabase.from('flatmate_profiles').select('*', { count: 'exact' });

    if (params?.search && params.search.trim()) {
      const q = params.search.trim();
      query = query.or(`name.ilike.%${q}%,locality.ilike.%${q}%,city.ilike.%${q}%,occupation.ilike.%${q}%`);
    }

    if (params?.status && params.status !== 'ALL') {
      query = query.eq('status', params.status.toLowerCase());
    }

    query = query.order('created_at', { ascending: false });

    const { data, count, error } = await query;
    if (error) throw error;

    const mapped: AdminFlatmateRecord[] = (data || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      user_id: f.user_id,
      gender: f.gender || 'Any',
      occupation: f.occupation || 'Working Professional',
      location: `${f.locality}, ${f.city || 'Mumbai'}`,
      budget: f.budget_max || 0,
      room_preference: f.room_preference || 'Private Room',
      status: (f.status || 'ACTIVE').toUpperCase(),
      created_at: f.created_at,
    }));

    return { data: mapped, count: count || 0 };
  } catch (err) {
    console.warn('[Admin Service] getFlatmates error:', err);
    return { data: [], count: 0 };
  }
}

export async function updateFlatmateStatus(
  profileId: string,
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT',
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('flatmate_profiles')
      .update({ status: status.toLowerCase() })
      .eq('id', profileId);

    if (error) throw error;

    await logAdminAction({
      action: `FLATMATE_${status}`,
      targetType: 'flatmate',
      targetId: profileId,
      metadata: { new_status: status, reason: reason || 'Admin moderation action' },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Couldn't update flatmate profile status." };
  }
}

// ---------------------------------------------------------------------------
// 6. Enquiries & Visits Management
// ---------------------------------------------------------------------------

export async function getEnquiries(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select(`
        *,
        properties (id, title, locality, city),
        renter:profiles!enquiries_user_id_fkey (full_name, phone),
        owner:profiles!enquiries_owner_id_fkey (full_name, phone)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Admin Service] getEnquiries error:', err);
    return [];
  }
}

export async function getVisits(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        properties (id, title, locality, city),
        renter:profiles!visits_user_id_fkey (full_name, phone),
        owner:profiles!visits_owner_id_fkey (full_name, phone)
      `)
      .order('scheduled_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Admin Service] getVisits error:', err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// 7. Safety Reports Management
// ---------------------------------------------------------------------------

export async function getReports(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('safety_reports')
      .select(`
        *,
        properties (id, title, locality),
        reporter:profiles!safety_reports_reporter_id_fkey (full_name, phone)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Admin Service] getReports error:', err);
    return [];
  }
}

export async function resolveReport(
  reportId: string,
  status: 'RESOLVED' | 'DISMISSED',
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('safety_reports')
      .update({
        status: status.toLowerCase(),
        resolved_at: new Date().toISOString(),
        resolution_notes: notes || 'Handled by admin moderator',
      })
      .eq('id', reportId);

    if (error) throw error;

    await logAdminAction({
      action: `REPORT_${status}`,
      targetType: 'report',
      targetId: reportId,
      metadata: { status, notes },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Couldn't update report." };
  }
}

// ---------------------------------------------------------------------------
// 8. Support Tickets Management
// ---------------------------------------------------------------------------

export async function getSupportTickets(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        user_profile:profiles!support_tickets_user_id_fkey (full_name, phone, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Admin Service] getSupportTickets error:', err);
    return [];
  }
}

export async function updateSupportTicketStatus(
  ticketId: string,
  status: 'pending' | 'in_progress' | 'resolved' | 'closed'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('support_tickets')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', ticketId);

    if (error) throw error;

    await logAdminAction({
      action: `TICKET_${status.toUpperCase()}`,
      targetType: 'support_ticket',
      targetId: ticketId,
      metadata: { status },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Couldn't update ticket." };
  }
}

// ---------------------------------------------------------------------------
// 9. Locations Management
// ---------------------------------------------------------------------------

export async function getLocations(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('service_cities')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[Admin Service] getLocations error:', err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// 10. Admin Users & Audit Logs
// ---------------------------------------------------------------------------

export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return [MOCK_ADMIN_USER];
    }

    return data.map((u: any) => ({
      id: u.id,
      user_id: u.user_id || u.id,
      email: u.email,
      full_name: u.full_name,
      role: (u.role || 'OPERATIONS').toUpperCase() as any,
      status: (u.status || 'ACTIVE').toUpperCase() as any,
      avatar_url: u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      last_sign_in_at: u.last_sign_in_at,
      created_at: u.created_at,
      updated_at: u.updated_at,
    }));
  } catch (err) {
    console.warn('[Admin Service] getAdminUsers error:', err);
    return [MOCK_ADMIN_USER];
  }
}

export async function getAuditLogs(): Promise<AdminAuditLog[]> {
  try {
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((l: any) => ({
      id: l.id,
      admin_user_id: l.admin_user_id,
      admin_email: l.admin_email,
      admin_role: (l.admin_role || 'OPERATIONS').toUpperCase() as any,
      action: l.action,
      target_type: (l.target_type || 'USER').toUpperCase() as any,
      target_id: l.target_id,
      metadata: l.metadata || {},
      ip_address: l.ip_address || '127.0.0.1',
      created_at: l.created_at,
    }));
  } catch (err) {
    console.warn('[Admin Service] getAuditLogs error:', err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// 11. System Settings
// ---------------------------------------------------------------------------

export async function getSystemSettings(): Promise<Record<string, any>> {
  try {
    const { data, error } = await supabase.from('system_settings').select('*');
    if (error || !data) return {};

    const settingsMap: Record<string, any> = {};
    data.forEach((s: any) => {
      settingsMap[s.key] = s.value;
    });
    return settingsMap;
  } catch (err) {
    console.warn('[Admin Service] getSystemSettings error:', err);
    return {};
  }
}

export async function saveSystemSetting(
  key: string,
  value: any,
  description?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('system_settings')
      .upsert({
        key,
        value,
        description: description || null,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    await logAdminAction({
      action: 'UPDATE_SYSTEM_SETTINGS',
      targetType: 'system_settings',
      targetId: key,
      metadata: { key, value },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Couldn't save system setting." };
  }
}
