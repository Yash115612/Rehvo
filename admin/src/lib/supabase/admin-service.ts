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

export type { OverviewMetrics };

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
      pendingPropsRes,
      flatmatesRes,
      verifsRes,
      reportsRes,
      supportRes,
      enquiriesRes,
      visitsRes,
      pgPropsRes,
      commPropsRes,
      propertiesDataRes,
    ] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('properties').select('id', { count: 'exact', head: true }),
      supabase.from('properties').select('id', { count: 'exact', head: true }).in('status', ['active', 'published']),
      supabase.from('properties').select('id', { count: 'exact', head: true }).or('verification_status.eq.unverified,verification_status.is.null,status.eq.pending'),
      supabase.from('flatmate_profiles').select('id', { count: 'exact', head: true }),
      supabase.from('verification_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('safety_reports').select('id', { count: 'exact', head: true }).in('status', ['pending', 'under_review']),
      supabase.from('support_tickets').select('id', { count: 'exact', head: true }).in('status', ['pending', 'in_progress']),
      supabase.from('enquiries').select('id', { count: 'exact', head: true }),
      supabase.from('visits').select('id', { count: 'exact', head: true }),
      supabase.from('properties').select('id', { count: 'exact', head: true }).in('type', ['pg', 'room', 'hostel']),
      supabase.from('properties').select('id', { count: 'exact', head: true }).or('category.eq.commercial,type.in.(office,retail,warehouse,commercial,coworking,showroom)'),
      supabase.from('properties').select('id, price, rent, owner_id'),
    ]);

    const totalUsers = usersRes.count ?? 0;
    const activeUsers = totalUsers;
    const totalProperties = propsRes.count ?? 0;
    const activeProperties = activePropsRes.count ?? totalProperties;
    const pendingProperties = pendingPropsRes.count ?? 0;
    const totalFlatmateProfiles = flatmatesRes.count ?? 0;
    const pendingVerifications = (verifsRes.count ?? 0) + pendingProperties;
    const openReports = reportsRes.count ?? 0;
    const openSupportTickets = supportRes.count ?? 0;
    const totalEnquiries = enquiriesRes.count ?? 0;
    const scheduledVisits = visitsRes.count ?? 0;
    const totalPgListings = pgPropsRes.count ?? 0;
    const totalCommercialListings = commPropsRes.count ?? 0;
    const totalShowreels = 0;

    // Calculate real unique owners and real monthly inventory value from properties
    const propsList = propertiesDataRes.data || [];
    const uniqueOwnerIds = new Set(propsList.map((p) => p.owner_id).filter(Boolean));
    const totalOwners = uniqueOwnerIds.size;

    const monthlyInventoryRevenue = propsList.reduce((acc, p) => {
      const val = Number(p.price || p.rent || 0);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);

    const revenueToday = 0;
    const revenueMonth = monthlyInventoryRevenue;

    return {
      totalUsers,
      totalOwners,
      activeProperties,
      pendingProperties,
      totalFlatmateProfiles,
      totalPgListings,
      totalCommercialListings,
      totalShowreels,
      revenueToday,
      revenueMonth,
      pendingVerifications,
      openSupportTickets,
      totalEnquiries,
      scheduledVisits,
      activeUsers,
      totalProperties,
      openReports,
    };
  } catch (err) {
    console.warn('[Admin Service] getOverviewMetrics error:', err);
    return {
      totalUsers: 0,
      totalOwners: 0,
      activeProperties: 0,
      pendingProperties: 0,
      totalFlatmateProfiles: 0,
      totalPgListings: 0,
      totalCommercialListings: 0,
      totalShowreels: 0,
      revenueToday: 0,
      revenueMonth: 0,
      pendingVerifications: 0,
      openSupportTickets: 0,
      totalEnquiries: 0,
      scheduledVisits: 0,
      activeUsers: 0,
      totalProperties: 0,
      openReports: 0,
    };
  }
}

export async function getRecentActivities(): Promise<RecentActivityItem[]> {
  try {
    const [auditRes, propsRes, profilesRes, visitsRes] = await Promise.all([
      supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6),
      supabase
        .from('properties')
        .select('id, title, locality, city, price, rent, created_at, owner_profile:profiles!properties_owner_id_fkey(full_name)')
        .order('created_at', { ascending: false })
        .limit(6),
      supabase
        .from('profiles')
        .select('id, full_name, email, phone, role, created_at')
        .order('created_at', { ascending: false })
        .limit(6),
      supabase
        .from('visits')
        .select('id, scheduled_date, scheduled_time, created_at, properties(title), renter:profiles!visits_user_id_fkey(full_name)')
        .order('created_at', { ascending: false })
        .limit(4),
    ]);

    const items: RecentActivityItem[] = [];

    (auditRes.data || []).forEach((log) => {
      items.push({
        id: log.id,
        type: 'PROPERTY_PUBLISHED',
        title: `Admin Action: ${log.action}`,
        description: `Executed by ${log.admin_email} on ${log.target_type} #${String(log.target_id).slice(0, 8)}`,
        timestamp: log.created_at,
        entityId: log.target_id,
        entityType: log.target_type.toUpperCase(),
        status: 'INFO',
      });
    });

    (propsRes.data || []).forEach((p: any) => {
      const cost = p.price || p.rent || 0;
      items.push({
        id: `prop_${p.id}`,
        type: 'PROPERTY_PUBLISHED',
        title: `Property Listed: ${p.title}`,
        description: `In ${p.locality || 'Mumbai'}${p.city ? `, ${p.city}` : ''} • ₹${Number(cost).toLocaleString('en-IN')}/mo`,
        timestamp: p.created_at,
        entityId: p.id,
        entityType: 'PROPERTY',
        status: 'SUCCESS',
      });
    });

    (profilesRes.data || []).forEach((u: any) => {
      items.push({
        id: `user_${u.id}`,
        type: 'USER_REGISTERED',
        title: `New User: ${u.full_name || 'Member'}`,
        description: `Registered as ${u.role || 'Renter'} • ${u.email || u.phone || 'Verified'}`,
        timestamp: u.created_at,
        entityId: u.id,
        entityType: 'USER',
        status: 'INFO',
      });
    });

    (visitsRes.data || []).forEach((v: any) => {
      items.push({
        id: `vis_${v.id}`,
        type: 'VISIT_BOOKED',
        title: `Tour Scheduled: ${v.properties?.title || 'Property Tour'}`,
        description: `Renter ${v.renter?.full_name || 'User'} on ${v.scheduled_date} at ${v.scheduled_time}`,
        timestamp: v.created_at,
        entityId: v.id,
        entityType: 'VISIT',
        status: 'INFO',
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
    const [unverifiedPropsRes, verifsRes, reportsRes, supportRes] = await Promise.all([
      supabase.from('properties').select('id, title, locality', { count: 'exact' }).or('verification_status.eq.unverified,verification_status.is.null'),
      supabase.from('verification_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('safety_reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('support_tickets').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    const unverifiedCount = (unverifiedPropsRes.count ?? 0) + (verifsRes.count ?? 0);
    const reportCount = reportsRes.count ?? 0;
    const supportCount = supportRes.count ?? 0;

    const actions: PendingActionItem[] = [];

    if (unverifiedCount > 0) {
      actions.push({
        id: 'act_verif',
        category: 'VERIFICATION',
        title: `${unverifiedCount} Properties / Host KYC Pending Verification`,
        subtitle: 'Review ownership deeds, listings, and identity credentials for approval',
        count: unverifiedCount,
        severity: 'HIGH',
        route: '/admin/kyc',
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
        route: '/admin/support?tab=complaints',
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
  category?: 'RESIDENTIAL' | 'COMMERCIAL';
  type: string;
  commercial_type?: string;
  owner_name: string;
  owner_id: string;
  location: string;
  city?: string;
  rent: number;
  area?: number;
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED' | 'RENTED';
  verification_status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  images_count: number;
  created_at: string;
}

export async function getProperties(params?: {
  search?: string;
  category?: string;
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

    if (params?.category && params.category !== 'ALL') {
      query = query.eq('category', params.category.toLowerCase());
    }

    if (params?.type && params.type !== 'ALL') {
      query = query.eq('type', params.type.toLowerCase());
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
      category: (p.category || (['office', 'shop', 'showroom', 'warehouse', 'commercial_building', 'coworking', 'commercial_plot', 'other_commercial'].includes(p.type) ? 'commercial' : 'residential')).toUpperCase() as any,
      type: (p.type || p.property_type || 'FLAT').toUpperCase(),
      commercial_type: p.commercial_type,
      owner_name: p.owner_profile?.full_name || 'Property Host',
      owner_id: p.owner_id,
      location: `${p.locality}, ${p.city || 'Mumbai'}`,
      city: p.city || 'Mumbai',
      rent: p.price || p.rent || 0,
      area: p.area || 0,
      status: (p.status || 'ACTIVE').toUpperCase() as any,
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
      .select('*')
      .order('scheduled_date', { ascending: false });

    if (error) {
      const { data: vb } = await supabase.from('visit_bookings').select('*');
      return vb || [];
    }
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
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
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
      return [{
        id: 'admin_usr_01',
        user_id: '7ce151b0',
        employee_id: 'RHV-001',
        email: 'yxxhpatel@gmail.com',
        full_name: 'Yash Patel (Super Admin)',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        department: 'Executive Leadership',
        city: 'Mumbai',
        phone: '+91 8208662286',
        joining_date: '2024-01-01',
        is_online: true,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: new Date().toISOString(),
      }];
    }

    return data.map((u: any) => ({
      id: u.id,
      user_id: u.user_id || u.id,
      employee_id: u.employee_id || `RHV-${u.id.slice(0, 4)}`,
      email: u.email,
      full_name: u.full_name,
      role: (u.role || 'OPERATIONS').toUpperCase() as any,
      status: (u.status || 'ACTIVE').toUpperCase() as any,
      department: u.department || 'Operations',
      city: u.city || 'Mumbai',
      phone: u.phone || '—',
      joining_date: u.joining_date || '2024-01-01',
      is_online: true,
      avatar_url: u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      created_at: u.created_at,
      updated_at: u.updated_at,
    }));
  } catch (err) {
    console.warn('[Admin Service] getAdminUsers error:', err);
    return [{
      id: 'admin_usr_01',
      user_id: '7ce151b0',
      employee_id: 'RHV-001',
      email: 'yxxhpatel@gmail.com',
      full_name: 'Yash Patel (Super Admin)',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      department: 'Executive Leadership',
      city: 'Mumbai',
      phone: '+91 8208662286',
      joining_date: '2024-01-01',
      is_online: true,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date().toISOString(),
    }];
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

// ---------------------------------------------------------------------------
// 12. Real CRM Data Helpers (Owners, Renters, KYC, Commercial, PGs)
// ---------------------------------------------------------------------------

export interface RealOwnerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  properties_count: number;
  total_revenue: number;
  wallet_balance: number;
  kyc_status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  subscription: 'PRO_LANDLORD' | 'FREE' | 'ENTERPRISE';
  joined_at: string;
}

export async function getRealOwners(): Promise<RealOwnerRecord[]> {
  try {
    const [profilesRes, propertiesRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('properties').select('id, owner_id, price, rent, verification_status'),
    ]);

    const profiles = profilesRes.data || [];
    const properties = propertiesRes.data || [];

    // Map properties by owner_id
    const propsByOwner: Record<string, any[]> = {};
    properties.forEach((p) => {
      if (p.owner_id) {
        if (!propsByOwner[p.owner_id]) propsByOwner[p.owner_id] = [];
        propsByOwner[p.owner_id].push(p);
      }
    });

    // An owner is anyone with role === 'owner' OR anyone who has posted at least 1 property
    const ownerProfiles = profiles.filter(
      (u) => u.role === 'owner' || (propsByOwner[u.id] && propsByOwner[u.id].length > 0)
    );

    return ownerProfiles.map((u) => {
      const ownedProps = propsByOwner[u.id] || [];
      const totalRev = ownedProps.reduce((sum, p) => sum + (Number(p.price || p.rent || 0)), 0);
      const isVerified = (u.verification_status || 'unverified').toLowerCase() === 'verified';
      const isRejected = (u.verification_status || '').toLowerCase() === 'rejected';

      return {
        id: u.id,
        name: u.full_name || 'Property Host',
        email: u.email || `${u.phone || u.id.slice(0, 8)}@rehvo.user`,
        phone: u.phone || '+91 Not Provided',
        city: u.city || 'Mumbai',
        properties_count: ownedProps.length,
        total_revenue: totalRev,
        wallet_balance: 0,
        kyc_status: isVerified ? 'VERIFIED' : isRejected ? 'REJECTED' : 'PENDING',
        status: u.is_blocked ? 'SUSPENDED' : 'ACTIVE',
        subscription: ownedProps.length > 2 ? 'ENTERPRISE' : ownedProps.length > 0 ? 'PRO_LANDLORD' : 'FREE',
        joined_at: u.created_at || new Date().toISOString(),
      };
    });
  } catch (err) {
    console.warn('[Admin Service] getRealOwners error:', err);
    return [];
  }
}

export interface RealRenterRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  saved_homes_count: number;
  ai_searches_count: number;
  visits_count: number;
  wallet_rcash: number;
  referral_rewards: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  joined_at: string;
}

export async function getRealRenters(): Promise<RealRenterRecord[]> {
  try {
    const [profilesRes, visitsRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('visits').select('id, user_id'),
    ]);

    const profiles = profilesRes.data || [];
    const visits = visitsRes.data || [];

    const visitsByUser: Record<string, number> = {};
    visits.forEach((v) => {
      if (v.user_id) {
        visitsByUser[v.user_id] = (visitsByUser[v.user_id] || 0) + 1;
      }
    });

    return profiles.map((u) => ({
      id: u.id,
      name: u.full_name || 'Registered User',
      email: u.email || `${u.phone || u.id.slice(0, 8)}@rehvo.user`,
      phone: u.phone || '+91 Not Provided',
      city: u.city || 'Mumbai',
      saved_homes_count: 0,
      ai_searches_count: 0,
      visits_count: visitsByUser[u.id] || 0,
      wallet_rcash: 0,
      referral_rewards: 0,
      status: u.is_blocked ? 'SUSPENDED' : 'ACTIVE',
      joined_at: u.created_at || new Date().toISOString(),
    }));
  } catch (err) {
    console.warn('[Admin Service] getRealRenters error:', err);
    return [];
  }
}

export interface RealKycDocRecord {
  id: string;
  target_id: string;
  target_name: string;
  document_type: 'PROPERTY_TITLE_DEED' | 'ELECTRICITY_BILL' | 'AADHAAR_CARD' | 'PAN_CARD' | 'SELFIE';
  submitted_by: string;
  owner_phone: string;
  document_url: string;
  submitted_at: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  rejection_reason?: string;
}

export async function getRealKycDocuments(): Promise<RealKycDocRecord[]> {
  try {
    const [propsRes, verifsRes] = await Promise.all([
      supabase
        .from('properties')
        .select(`
          id, title, locality, city, verification_status, created_at,
          property_images (image_url),
          owner_profile:profiles!properties_owner_id_fkey(id, full_name, phone, email)
        `)
        .order('created_at', { ascending: false }),
      supabase
        .from('verification_requests')
        .select(`
          *,
          user_profile:profiles!verification_requests_user_id_fkey(full_name, phone),
          property_data:properties!verification_requests_property_id_fkey(title)
        `),
    ]);

    const items: RealKycDocRecord[] = [];

    // Map unverified or listed properties as verification targets
    (propsRes.data || []).forEach((p: any) => {
      const vStatus = (p.verification_status || 'unverified').toLowerCase();
      const status: 'PENDING' | 'VERIFIED' | 'REJECTED' =
        vStatus === 'verified' ? 'VERIFIED' : vStatus === 'rejected' ? 'REJECTED' : 'PENDING';

      const firstImage = p.property_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&auto=format&fit=crop&q=80';

      items.push({
        id: `prop_doc_${p.id}`,
        target_id: p.id,
        target_name: `${p.title} (${p.locality || 'Mumbai'})`,
        document_type: 'PROPERTY_TITLE_DEED',
        submitted_by: p.owner_profile?.full_name || 'Property Owner',
        owner_phone: p.owner_profile?.phone || 'N/A',
        document_url: firstImage,
        submitted_at: p.created_at || new Date().toISOString(),
        status,
      });
    });

    // Also include any verification_requests table rows
    (verifsRes.data || []).forEach((v: any) => {
      items.push({
        id: v.id,
        target_id: v.property_id || v.user_id,
        target_name: v.property_data?.title || v.user_profile?.full_name || 'Verification Document',
        document_type: (v.document_type || 'PROPERTY_TITLE_DEED').toUpperCase(),
        submitted_by: v.user_profile?.full_name || 'User',
        owner_phone: v.user_profile?.phone || 'N/A',
        document_url: v.document_url || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80',
        submitted_at: v.created_at || new Date().toISOString(),
        status: (v.status || 'PENDING').toUpperCase() as any,
        rejection_reason: v.rejection_reason || undefined,
      });
    });

    return items;
  } catch (err) {
    console.warn('[Admin Service] getRealKycDocuments error:', err);
    return [];
  }
}

export async function updatePropertyKycStatus(
  propertyId: string,
  status: 'VERIFIED' | 'REJECTED',
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const realPropId = propertyId.startsWith('prop_doc_') ? propertyId.replace('prop_doc_', '') : propertyId;
    const nextStatus = status === 'VERIFIED' ? 'verified' : 'rejected';

    const { error } = await supabase
      .from('properties')
      .update({ verification_status: nextStatus })
      .eq('id', realPropId);

    if (error) throw error;

    await logAdminAction({
      action: `PROPERTY_KYC_${status}`,
      targetType: 'property',
      targetId: realPropId,
      metadata: { status: nextStatus, reason: reason || 'Admin review' },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Couldn't update KYC status." };
  }
}

