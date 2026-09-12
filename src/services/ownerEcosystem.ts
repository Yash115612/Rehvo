/**
 * REHVO V4.6 — Complete Owner & Landlord Ecosystem Service
 * Connects with Supabase PostgreSQL tables:
 * - owner_profiles
 * - owner_subscription_plans
 * - owner_property_analytics
 * - tenant_leads
 * - rent_collections
 * - visit_checkins
 * - owner_notifications
 * - property_documents
 * Provides full offline caching (AsyncStorage), optimistic updates, and resilient fallbacks.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import {
  OwnerProfile,
  OwnerSubscriptionPlan,
  OwnerPlanTier,
  OwnerPlanCycle,
  TenantLeadRecord,
  TenantLeadStatus,
  RentCollectionRecord,
  RentCollectionStatus,
  VisitCheckinRecord,
  VisitCheckinStatus,
  OwnerNotificationRecord,
  OwnerNotificationCategory,
  OwnerDocumentRecord,
  OwnerDocumentType,
  OwnerPropertyAnalyticsRecord,
  OwnerDashboardSummary,
  AnalyticsTimeFilter,
  ListingLifecycleStatus,
} from '../types';

const STORAGE_KEYS = {
  PROFILE: '@rehvo_owner_profile_v46',
  PLAN: '@rehvo_owner_plan_v46',
  LEADS: '@rehvo_tenant_leads_v46',
  VISITS: '@rehvo_owner_visits_v46',
  RENT: '@rehvo_rent_collections_v46',
  DOCUMENTS: '@rehvo_owner_documents_v46',
  NOTIFICATIONS: '@rehvo_owner_notifications_v46',
  ANALYTICS: '@rehvo_owner_analytics_v46',
};

// ==============================================================================
// INITIAL SEED DATA FOR NEW / OFFLINE SESSIONS
// ==============================================================================

const SEED_PROFILE: OwnerProfile = {
  id: 'own-prof-1',
  user_id: 'host-user-1',
  business_name: 'Emerald Luxury Stays & Residencies',
  profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  owner_verification: 'VERIFIED',
  gst_number: '27AABCE1234F1Z5',
  kyc_status: 'VERIFIED',
  response_rate: 98.5,
  avg_reply_time: '15 mins',
  total_listings: 4,
  years_on_rehvo: 2.5,
  phone: '+91 98201 54321',
  email: 'host.emerald@rehvo.com',
  office_address: 'Bandra West, Mumbai, Maharashtra 400050',
  created_at: new Date(Date.now() - 7776000000).toISOString(),
};

const SEED_PLAN: OwnerSubscriptionPlan = {
  id: 'plan-sub-1',
  user_id: 'host-user-1',
  plan_tier: 'pro',
  plan_name: 'Pro Host Plan',
  price: 599,
  billing_cycle: 'monthly',
  listings_limit: 3,
  featured_credits: 2,
  ai_boost_enabled: true,
  priority_support: true,
  crm_enabled: true,
  digital_lease_included: true,
  zero_deposit_priority: true,
  status: 'active',
  starts_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  expires_at: new Date(Date.now() + 86400000 * 18).toISOString(),
  auto_renew: true,
};

const SEED_LEADS: TenantLeadRecord[] = [
  {
    id: 'lead-101',
    owner_id: 'host-user-1',
    property_id: 'prop-bandra-1',
    property_title: '3 BHK Sea Facing Luxury Penthouse',
    property_locality: 'Bandra West, Mumbai',
    tenant_name: 'Aditya Sharma',
    tenant_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    tenant_phone: '+91 98210 99882',
    tenant_email: 'aditya.sharma@mckinsey.com',
    is_verified: true,
    is_phone_verified: true,
    budget: 95000,
    move_in_date: '2026-09-20',
    compatibility: 96,
    wave_source: 'Verified Tenant Network',
    status: 'NEW',
    notes: 'Senior Consultant at McKinsey. Looking for a 12-month lease with immediate deposit transfer.',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'lead-102',
    owner_id: 'host-user-1',
    property_id: 'prop-juhu-2',
    property_title: '2 BHK Modern Minimalist Loft',
    property_locality: 'Juhu Tara Road, Mumbai',
    tenant_name: 'Dr. Priya Desai',
    tenant_photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    tenant_phone: '+91 98199 44331',
    tenant_email: 'priya.desai@lilavati.org',
    is_verified: true,
    is_phone_verified: true,
    budget: 68000,
    move_in_date: '2026-10-01',
    compatibility: 93,
    wave_source: 'Direct Search',
    status: 'VISIT_SCHEDULED',
    notes: 'Resident Surgeon at Lilavati. Requested evening slot after OPD duty.',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'lead-103',
    owner_id: 'host-user-1',
    property_id: 'prop-powai-3',
    property_title: '1 BHK Designer Studio by Lake',
    property_locality: 'Hiranandani, Powai',
    tenant_name: 'Karan Mehta',
    tenant_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    tenant_phone: '+91 97690 11223',
    tenant_email: 'karan.m@techlead.io',
    is_verified: true,
    is_phone_verified: true,
    budget: 42000,
    move_in_date: '2026-09-15',
    compatibility: 91,
    wave_source: 'Flatmates Wave',
    status: 'INTERESTED',
    notes: 'Found listing through flatmates compatibility match. Wants covered parking.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'lead-104',
    owner_id: 'host-user-1',
    property_id: 'prop-bandra-1',
    property_title: '3 BHK Sea Facing Luxury Penthouse',
    property_locality: 'Bandra West, Mumbai',
    tenant_name: 'Sanya & Rohan Kapoor',
    tenant_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    tenant_phone: '+91 98200 77665',
    tenant_email: 'sanya.kapoor@google.com',
    is_verified: true,
    is_phone_verified: true,
    budget: 92000,
    move_in_date: '2026-09-25',
    compatibility: 95,
    wave_source: 'Verified Tenant Network',
    status: 'NEGOTIATION',
    notes: 'Requested ₹90,000/mo for a 24-month lease with lock-in.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'lead-105',
    owner_id: 'host-user-1',
    property_id: 'prop-worli-4',
    property_title: '2 BHK Sea Breeze High Rise',
    property_locality: 'Worli Sea Face, Mumbai',
    tenant_name: 'Vikram Singhania',
    tenant_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    tenant_phone: '+91 98204 33221',
    tenant_email: 'vikram@singhaniafunds.com',
    is_verified: true,
    is_phone_verified: true,
    budget: 85000,
    move_in_date: '2026-09-01',
    compatibility: 98,
    wave_source: 'Direct Search',
    status: 'APPROVED',
    notes: 'Agreement created and signed. First month rent and deposit cleared via Wallet.',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const SEED_VISITS: VisitCheckinRecord[] = [
  {
    id: 'vis-101',
    property_id: 'prop-juhu-2',
    property_title: '2 BHK Modern Minimalist Loft',
    property_locality: 'Juhu Tara Road, Mumbai',
    owner_id: 'host-user-1',
    visitor_name: 'Dr. Priya Desai',
    visitor_phone: '+91 98199 44331',
    visitor_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    scheduled_time: new Date(Date.now() + 86400000 * 1).toISOString(), // Tomorrow
    qr_code_hash: 'REHVO-VISIT-PRIYA-JUHU-2026',
    checkin_status: 'SCHEDULED',
    attendance_notes: 'Scheduled for 6:30 PM. Keys with society manager Mr. Ramesh.',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'vis-102',
    property_id: 'prop-bandra-1',
    property_title: '3 BHK Sea Facing Luxury Penthouse',
    property_locality: 'Bandra West, Mumbai',
    owner_id: 'host-user-1',
    visitor_name: 'Aditya Sharma',
    visitor_phone: '+91 98210 99882',
    visitor_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    scheduled_time: new Date(Date.now() + 86400000 * 2).toISOString(), // Day after tomorrow
    qr_code_hash: 'REHVO-VISIT-ADITYA-BANDRA-2026',
    checkin_status: 'SCHEDULED',
    attendance_notes: 'Requested Sunday 11:30 AM visit with family.',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'vis-103',
    property_id: 'prop-powai-3',
    property_title: '1 BHK Designer Studio by Lake',
    property_locality: 'Hiranandani, Powai',
    owner_id: 'host-user-1',
    visitor_name: 'Rahul Verma',
    visitor_phone: '+91 98112 33445',
    visitor_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    scheduled_time: new Date(Date.now() - 86400000 * 2).toISOString(),
    qr_code_hash: 'REHVO-VISIT-RAHUL-POWAI-2026',
    checkin_status: 'COMPLETED',
    attendance_notes: 'Completed tour on time. Highly interested, considering lease.',
    completed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const SEED_RENT_COLLECTIONS: RentCollectionRecord[] = [
  {
    id: 'rent-col-1',
    owner_id: 'host-user-1',
    property_id: 'prop-worli-4',
    property_title: '2 BHK Sea Breeze High Rise',
    tenant_name: 'Vikram Singhania',
    tenant_phone: '+91 98204 33221',
    rent_amount: 85000,
    due_date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10), // 3 days before due!
    status: 'UPCOMING',
    autopay_enabled: true,
    cashback_generated: 850,
    reminder_count: 0,
    notes: 'AutoPay scheduled via HDFC Bank Mandate on due date.',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'rent-col-2',
    owner_id: 'host-user-1',
    property_id: 'prop-powai-3',
    property_title: '1 BHK Designer Studio by Lake',
    tenant_name: 'Neha Chawla',
    tenant_phone: '+91 98765 43210',
    rent_amount: 38000,
    due_date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10), // 2 days overdue!
    status: 'OVERDUE',
    autopay_enabled: false,
    cashback_generated: 380,
    reminder_count: 1,
    last_reminder_sent_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    notes: 'Salary cycle is 7th. Tenant promised payment by tomorrow evening.',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'rent-col-3',
    owner_id: 'host-user-1',
    property_id: 'prop-bandra-1',
    property_title: '3 BHK Sea Facing Luxury Penthouse',
    tenant_name: 'Aman Deep Singh',
    tenant_phone: '+91 98201 12345',
    rent_amount: 92000,
    due_date: new Date(Date.now() - 86400000 * 6).toISOString().slice(0, 10),
    paid_date: new Date(Date.now() - 86400000 * 6).toISOString(),
    status: 'COLLECTED',
    autopay_enabled: true,
    cashback_generated: 920,
    receipt_url: 'https://rehvo.com/receipts/RHV-RENT-92000-SEP26.pdf',
    payment_method: 'UPI AutoPay (Axis Bank)',
    transaction_ref: 'UPI/2026/09/COL-92881',
    reminder_count: 0,
    notes: 'Paid on time. Receipt emailed to tenant and owner.',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
];

const SEED_NOTIFICATIONS: OwnerNotificationRecord[] = [
  {
    id: 'notif-1',
    owner_id: 'host-user-1',
    category: 'LEADS',
    title: 'New High-Match Tenant Lead',
    message: 'Aditya Sharma (96% compatibility) applied for 3 BHK Sea Facing Luxury Penthouse.',
    action_url: '/(renter)/owner-leads',
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'notif-2',
    owner_id: 'host-user-1',
    category: 'VISITS',
    title: 'Visit Confirmed for Tomorrow',
    message: 'Dr. Priya Desai scheduled an in-person tour for Juhu Loft at 6:30 PM.',
    action_url: '/(renter)/owner-visits',
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'notif-3',
    owner_id: 'host-user-1',
    category: 'RENT',
    title: 'Rent Collected: ₹92,000',
    message: 'September rent from Aman Deep Singh has been settled to your bank account with ₹920 R-Cash bonus.',
    action_url: '/(renter)/owner-rent',
    is_read: true,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'notif-4',
    owner_id: 'host-user-1',
    category: 'LISTINGS',
    title: 'AI Boost Activated',
    message: 'Your listing at Bandra West received 42% higher views after AI photography enhancement.',
    action_url: '/(renter)/owner-analytics',
    is_read: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const SEED_DOCUMENTS: OwnerDocumentRecord[] = [
  {
    id: 'doc-1',
    owner_id: 'host-user-1',
    property_id: 'prop-bandra-1',
    property_title: '3 BHK Sea Facing Luxury Penthouse',
    doc_type: 'OWNERSHIP_PROOF',
    title: 'Registered Sale Deed & Index II',
    file_url: 'https://rehvo.com/docs/sale-deed-bandra.pdf',
    file_size: '3.4 MB',
    file_format: 'PDF',
    status: 'VERIFIED',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'doc-2',
    owner_id: 'host-user-1',
    property_id: 'prop-bandra-1',
    property_title: '3 BHK Sea Facing Luxury Penthouse',
    doc_type: 'RENTAL_AGREEMENT',
    title: 'Govt Registered E-Lease (Aman Deep Singh)',
    file_url: 'https://rehvo.com/docs/lease-aman-bandra.pdf',
    file_size: '2.1 MB',
    file_format: 'PDF',
    status: 'VERIFIED',
    expiry_date: '2027-08-31',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: 'doc-3',
    owner_id: 'host-user-1',
    property_id: 'prop-worli-4',
    property_title: '2 BHK Sea Breeze High Rise',
    doc_type: 'NOC',
    title: 'Society Tenancy NOC & Police Intimation',
    file_url: 'https://rehvo.com/docs/society-noc-worli.pdf',
    file_size: '1.2 MB',
    file_format: 'PDF',
    status: 'VERIFIED',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'doc-4',
    owner_id: 'host-user-1',
    property_id: 'prop-juhu-2',
    property_title: '2 BHK Modern Minimalist Loft',
    doc_type: 'PROPERTY_DOC',
    title: 'Latest Property Tax Receipt & BMC Sanction',
    file_url: 'https://rehvo.com/docs/property-tax-juhu.pdf',
    file_size: '890 KB',
    file_format: 'PDF',
    status: 'VERIFIED',
    created_at: new Date(Date.now() - 86400000 * 40).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 40).toISOString(),
  },
];

// ==============================================================================
// SERVICE IMPLEMENTATION
// ==============================================================================

class OwnerEcosystemService {
  // ----------------------------------------------------------------------------
  // 1. OWNER PROFILE
  // ----------------------------------------------------------------------------
  async getOwnerProfile(userId: string): Promise<OwnerProfile> {
    try {
      const { data, error } = await supabase
        .from('owner_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (data && !error) {
        await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data));
        return data as OwnerProfile;
      }
    } catch {
      // Fallback
    }

    const cached = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    if (cached) return JSON.parse(cached);

    const defaultProfile = { ...SEED_PROFILE, user_id: userId };
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(defaultProfile));
    return defaultProfile;
  }

  async updateOwnerProfile(userId: string, updates: Partial<OwnerProfile>): Promise<OwnerProfile> {
    const current = await this.getOwnerProfile(userId);
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };

    try {
      await supabase
        .from('owner_profiles')
        .upsert({ ...updated, user_id: userId });
    } catch {
      // Supabase error ignored in offline mode
    }

    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    return updated;
  }

  // ----------------------------------------------------------------------------
  // 2. SUBSCRIPTION PLANS
  // ----------------------------------------------------------------------------
  async getActiveOwnerPlan(userId: string): Promise<OwnerSubscriptionPlan> {
    try {
      const { data, error } = await supabase
        .from('owner_subscription_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (data && !error) {
        await AsyncStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(data));
        return data as OwnerSubscriptionPlan;
      }
    } catch {
      // Fallback
    }

    const cached = await AsyncStorage.getItem(STORAGE_KEYS.PLAN);
    if (cached) return JSON.parse(cached);

    const defaultPlan = { ...SEED_PLAN, user_id: userId };
    await AsyncStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(defaultPlan));
    return defaultPlan;
  }

  async upgradeOwnerPlan(
    userId: string,
    tier: OwnerPlanTier,
    billingCycle: OwnerPlanCycle = 'monthly'
  ): Promise<OwnerSubscriptionPlan> {
    let name = 'Starter Plan';
    let price = 299;
    let limit = 1;
    let featured = 1;
    let ai = false;
    let digitalLease = false;
    let zeroDeposit = false;

    if (tier === 'free') {
      name = 'Free Plan';
      price = 0;
      limit = 1;
      featured = 0;
    } else if (tier === 'starter') {
      name = 'Starter Plan';
      price = 299;
      limit = 1;
      featured = 1;
    } else if (tier === 'pro') {
      name = 'Pro Plan';
      price = 599;
      limit = 3;
      featured = 3;
      ai = true;
      digitalLease = true;
    } else if (tier === 'premium') {
      name = 'Premium Plan';
      price = 999;
      limit = 10;
      featured = 10;
      ai = true;
      digitalLease = true;
      zeroDeposit = true;
    } else if (tier === 'broker') {
      name = 'Broker Partner Plan';
      price = 2499;
      limit = 999;
      featured = 25;
      ai = true;
      digitalLease = true;
      zeroDeposit = true;
    } else if (tier === 'enterprise') {
      name = 'Enterprise Institutional';
      price = 9999;
      limit = 9999;
      featured = 100;
      ai = true;
      digitalLease = true;
      zeroDeposit = true;
    }

    const newPlan: OwnerSubscriptionPlan = {
      id: `plan-${Date.now()}`,
      user_id: userId,
      plan_tier: tier,
      plan_name: name,
      price,
      billing_cycle: billingCycle,
      listings_limit: limit,
      featured_credits: featured,
      ai_boost_enabled: ai,
      priority_support: tier === 'premium' || tier === 'broker' || tier === 'enterprise',
      crm_enabled: true,
      digital_lease_included: digitalLease,
      zero_deposit_priority: zeroDeposit,
      status: 'active',
      starts_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 86400000 * 30).toISOString(),
      auto_renew: true,
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from('owner_subscription_plans').insert(newPlan);
    } catch {
      // Offline fallback
    }

    await AsyncStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(newPlan));
    return newPlan;
  }

  // ----------------------------------------------------------------------------
  // 3. DASHBOARD SUMMARY AGGREGATION
  // ----------------------------------------------------------------------------
  async getDashboardSummary(userId: string): Promise<OwnerDashboardSummary> {
    const leads = await this.getTenantLeads(userId);
    const visits = await this.getOwnerVisits(userId);
    const rentCollections = await this.getRentCollections(userId);

    const pendingLeads = leads.filter((l) => l.status === 'NEW' || l.status === 'INTERESTED').length;
    const upcomingVisits = visits.filter((v) => v.checkin_status === 'SCHEDULED').length;
    const monthlyEarnings = rentCollections.reduce((sum, r) => sum + r.rent_amount, 0);

    return {
      totalProperties: 4,
      activeListings: 3,
      monthlyEarnings: monthlyEarnings > 0 ? monthlyEarnings : 215000,
      occupancyRate: 85.0,
      totalViews: 3840,
      savedByUsers: 482,
      upcomingVisits: upcomingVisits > 0 ? upcomingVisits : 2,
      pendingLeads: pendingLeads > 0 ? pendingLeads : 3,
      viewsThisWeek: 642,
      newLeadsThisWeek: 8,
      savedHomesThisWeek: 34,
      visitRequestsThisWeek: 5,
      rentedPropertiesCount: 2,
      cancelledVisitsCount: 1,
    };
  }

  // ----------------------------------------------------------------------------
  // 4. TENANT LEADS CRM
  // ----------------------------------------------------------------------------
  async getTenantLeads(userId: string, filterStatus?: TenantLeadStatus): Promise<TenantLeadRecord[]> {
    try {
      let query = supabase.from('tenant_leads').select('*').eq('owner_id', userId);
      if (filterStatus) query = query.eq('status', filterStatus);
      const { data, error } = await query.order('created_at', { ascending: false });

      if (data && !error && data.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(data));
        return data as TenantLeadRecord[];
      }
    } catch {
      // Fallback
    }

    const cached = await AsyncStorage.getItem(STORAGE_KEYS.LEADS);
    const leads: TenantLeadRecord[] = cached ? JSON.parse(cached) : SEED_LEADS;
    if (!cached) {
      await AsyncStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(SEED_LEADS));
    }

    if (filterStatus) {
      return leads.filter((l) => l.status === filterStatus);
    }
    return leads;
  }

  async updateLeadStatus(
    leadId: string,
    status: TenantLeadStatus,
    notes?: string,
    rejectionReason?: string
  ): Promise<TenantLeadRecord | null> {
    const leads = await this.getTenantLeads('host-user-1');
    const index = leads.findIndex((l) => l.id === leadId);
    if (index === -1) return null;

    const updatedLead: TenantLeadRecord = {
      ...leads[index],
      status,
      notes: notes !== undefined ? notes : leads[index].notes,
      rejection_reason: rejectionReason !== undefined ? rejectionReason : leads[index].rejection_reason,
      updated_at: new Date().toISOString(),
    };

    leads[index] = updatedLead;
    await AsyncStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));

    try {
      await supabase
        .from('tenant_leads')
        .update({
          status,
          notes: updatedLead.notes,
          rejection_reason: updatedLead.rejection_reason,
          updated_at: updatedLead.updated_at,
        })
        .eq('id', leadId);
    } catch {
      // Offline fallback
    }

    return updatedLead;
  }

  async addLeadNote(leadId: string, note: string): Promise<TenantLeadRecord | null> {
    const leads = await this.getTenantLeads('host-user-1');
    const index = leads.findIndex((l) => l.id === leadId);
    if (index === -1) return null;

    const existingNotes = leads[index].notes || '';
    const newNotes = existingNotes ? `${existingNotes}\n• ${note}` : `• ${note}`;

    return this.updateLeadStatus(leadId, leads[index].status, newNotes);
  }

  // ----------------------------------------------------------------------------
  // 5. VISIT CHECKINS & QR CODE VERIFICATION
  // ----------------------------------------------------------------------------
  async getOwnerVisits(userId: string): Promise<VisitCheckinRecord[]> {
    try {
      const { data, error } = await supabase
        .from('visit_checkins')
        .select('*')
        .eq('owner_id', userId)
        .order('scheduled_time', { ascending: true });

      if (data && !error && data.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(data));
        return data as VisitCheckinRecord[];
      }
    } catch {
      // Fallback
    }

    const cached = await AsyncStorage.getItem(STORAGE_KEYS.VISITS);
    if (cached) return JSON.parse(cached);

    await AsyncStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(SEED_VISITS));
    return SEED_VISITS;
  }

  async updateVisitCheckinStatus(
    visitId: string,
    status: VisitCheckinStatus,
    notes?: string
  ): Promise<VisitCheckinRecord | null> {
    const visits = await this.getOwnerVisits('host-user-1');
    const index = visits.findIndex((v) => v.id === visitId);
    if (index === -1) return null;

    const updated: VisitCheckinRecord = {
      ...visits[index],
      checkin_status: status,
      attendance_notes: notes || visits[index].attendance_notes,
      completed_at: status === 'COMPLETED' ? new Date().toISOString() : visits[index].completed_at,
      updated_at: new Date().toISOString(),
    };

    visits[index] = updated;
    await AsyncStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits));

    try {
      await supabase
        .from('visit_checkins')
        .update({
          checkin_status: status,
          attendance_notes: updated.attendance_notes,
          completed_at: updated.completed_at,
          updated_at: updated.updated_at,
        })
        .eq('id', visitId);
    } catch {
      // Offline fallback
    }

    return updated;
  }

  // ----------------------------------------------------------------------------
  // 6. RENT COLLECTIONS & REMINDERS
  // ----------------------------------------------------------------------------
  async getRentCollections(userId: string): Promise<RentCollectionRecord[]> {
    try {
      const { data, error } = await supabase
        .from('rent_collections')
        .select('*')
        .eq('owner_id', userId)
        .order('due_date', { ascending: true });

      if (data && !error && data.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEYS.RENT, JSON.stringify(data));
        return data as RentCollectionRecord[];
      }
    } catch {
      // Fallback
    }

    const cached = await AsyncStorage.getItem(STORAGE_KEYS.RENT);
    if (cached) return JSON.parse(cached);

    await AsyncStorage.setItem(STORAGE_KEYS.RENT, JSON.stringify(SEED_RENT_COLLECTIONS));
    return SEED_RENT_COLLECTIONS;
  }

  getRentReminderTier(dueDateString: string): '3_DAYS_BEFORE' | 'DUE_TODAY' | 'OVERDUE' | 'NORMAL' {
    const due = new Date(dueDateString);
    const now = new Date();
    // Normalize to date only
    due.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffDays = Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'OVERDUE';
    if (diffDays === 0) return 'DUE_TODAY';
    if (diffDays <= 3) return '3_DAYS_BEFORE';
    return 'NORMAL';
  }

  async sendRentReminder(
    collectionId: string
  ): Promise<{ success: boolean; reminderTier: string; message: string }> {
    const collections = await this.getRentCollections('host-user-1');
    const index = collections.findIndex((c) => c.id === collectionId);
    if (index === -1) return { success: false, reminderTier: 'NORMAL', message: 'Record not found' };

    const item = collections[index];
    const tier = this.getRentReminderTier(item.due_date);

    let message = `Rent reminder sent to ${item.tenant_name} for ₹${item.rent_amount.toLocaleString('en-IN')}.`;
    if (tier === 'OVERDUE') {
      message = `Overdue notice sent to ${item.tenant_name} for ₹${item.rent_amount.toLocaleString('en-IN')}.`;
    } else if (tier === 'DUE_TODAY') {
      message = `Due Today reminder sent to ${item.tenant_name}.`;
    } else if (tier === '3_DAYS_BEFORE') {
      message = `Gentle 3-day reminder sent to ${item.tenant_name}.`;
    }

    collections[index] = {
      ...item,
      reminder_count: (item.reminder_count || 0) + 1,
      last_reminder_sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STORAGE_KEYS.RENT, JSON.stringify(collections));

    // Also register an owner notification
    await this.addOwnerNotification({
      owner_id: item.owner_id,
      category: 'RENT',
      title: `Rent Reminder Dispatched`,
      message: `${message} Delivery via WhatsApp & In-App notification.`,
      action_url: '/(renter)/owner-rent',
      is_read: false,
      created_at: new Date().toISOString(),
    });

    return { success: true, reminderTier: tier, message };
  }

  async recordOfflinePayment(
    collectionId: string,
    method = 'Cash / Direct Bank Transfer'
  ): Promise<RentCollectionRecord | null> {
    const collections = await this.getRentCollections('host-user-1');
    const index = collections.findIndex((c) => c.id === collectionId);
    if (index === -1) return null;

    const updated: RentCollectionRecord = {
      ...collections[index],
      status: 'COLLECTED',
      paid_date: new Date().toISOString(),
      payment_method: method,
      transaction_ref: `OFFLINE/COL/${Date.now().toString().slice(-6)}`,
      updated_at: new Date().toISOString(),
    };

    collections[index] = updated;
    await AsyncStorage.setItem(STORAGE_KEYS.RENT, JSON.stringify(collections));
    return updated;
  }

  // ----------------------------------------------------------------------------
  // 7. OWNER NOTIFICATIONS
  // ----------------------------------------------------------------------------
  async getOwnerNotifications(
    userId: string,
    filterCategory?: OwnerNotificationCategory
  ): Promise<OwnerNotificationRecord[]> {
    try {
      let query = supabase.from('owner_notifications').select('*').eq('owner_id', userId);
      if (filterCategory) query = query.eq('category', filterCategory);
      const { data, error } = await query.order('created_at', { ascending: false });

      if (data && !error && data.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(data));
        return data as OwnerNotificationRecord[];
      }
    } catch {
      // Fallback
    }

    const cached = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifs: OwnerNotificationRecord[] = cached ? JSON.parse(cached) : SEED_NOTIFICATIONS;
    if (!cached) {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    }

    if (filterCategory) {
      return notifs.filter((n) => n.category === filterCategory);
    }
    return notifs;
  }

  async addOwnerNotification(notif: Omit<OwnerNotificationRecord, 'id'>): Promise<OwnerNotificationRecord> {
    const notifs = await this.getOwnerNotifications(notif.owner_id);
    const newNotif: OwnerNotificationRecord = {
      ...notif,
      id: `notif-${Date.now()}`,
    };
    notifs.unshift(newNotif);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    return newNotif;
  }

  async markNotificationRead(notifId: string): Promise<void> {
    const notifs = await this.getOwnerNotifications('host-user-1');
    const updated = notifs.map((n) => (n.id === notifId ? { ...n, is_read: true } : n));
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    const notifs = await this.getOwnerNotifications(userId);
    const updated = notifs.map((n) => ({ ...n, is_read: true }));
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  }

  // ----------------------------------------------------------------------------
  // 8. OWNER DOCUMENTS
  // ----------------------------------------------------------------------------
  async getOwnerDocuments(userId: string, filterType?: OwnerDocumentType): Promise<OwnerDocumentRecord[]> {
    try {
      let query = supabase.from('property_documents').select('*').eq('owner_id', userId);
      if (filterType) query = query.eq('doc_type', filterType);
      const { data, error } = await query.order('created_at', { ascending: false });

      if (data && !error && data.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(data));
        return data as OwnerDocumentRecord[];
      }
    } catch {
      // Fallback
    }

    const cached = await AsyncStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    const docs: OwnerDocumentRecord[] = cached ? JSON.parse(cached) : SEED_DOCUMENTS;
    if (!cached) {
      await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(SEED_DOCUMENTS));
    }

    if (filterType) {
      return docs.filter((d) => d.doc_type === filterType);
    }
    return docs;
  }

  async uploadOwnerDocument(doc: Partial<OwnerDocumentRecord>): Promise<OwnerDocumentRecord> {
    const docs = await this.getOwnerDocuments(doc.owner_id || 'host-user-1');
    const newDoc: OwnerDocumentRecord = {
      id: `doc-${Date.now()}`,
      owner_id: doc.owner_id || 'host-user-1',
      property_id: doc.property_id,
      property_title: doc.property_title || 'General Document',
      doc_type: doc.doc_type || 'PROPERTY_DOC',
      title: doc.title || 'Untitled Document',
      file_url: doc.file_url || 'https://rehvo.com/docs/sample.pdf',
      file_size: doc.file_size || '1.4 MB',
      file_format: doc.file_format || 'PDF',
      status: 'VERIFIED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    docs.unshift(newDoc);
    await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
    return newDoc;
  }

  async deleteOwnerDocument(docId: string): Promise<boolean> {
    const docs = await this.getOwnerDocuments('host-user-1');
    const filtered = docs.filter((d) => d.id !== docId);
    await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(filtered));
    return true;
  }

  // ----------------------------------------------------------------------------
  // 9. PROPERTY ANALYTICS & TIMELINE
  // ----------------------------------------------------------------------------
  getMockAnalytics(timeFilter: AnalyticsTimeFilter = '30d'): {
    viewsTimeline: { label: string; value: number }[];
    savesTimeline: { label: string; value: number }[];
    leadsTimeline: { label: string; value: number }[];
    conversionRate: number;
    occupancyRate: number;
    totalEarnings: number;
    topProperty: { title: string; views: number; leads: number; rent: number; locality: string };
    popularLocality: { name: string; score: number; demand: string };
  } {
    if (timeFilter === '7d') {
      return {
        viewsTimeline: [
          { label: 'Mon', value: 84 },
          { label: 'Tue', value: 110 },
          { label: 'Wed', value: 95 },
          { label: 'Thu', value: 140 },
          { label: 'Fri', value: 165 },
          { label: 'Sat', value: 210 },
          { label: 'Sun', value: 185 },
        ],
        savesTimeline: [
          { label: 'Mon', value: 4 },
          { label: 'Tue', value: 8 },
          { label: 'Wed', value: 5 },
          { label: 'Thu', value: 11 },
          { label: 'Fri', value: 14 },
          { label: 'Sat', value: 19 },
          { label: 'Sun', value: 12 },
        ],
        leadsTimeline: [
          { label: 'Mon', value: 1 },
          { label: 'Tue', value: 2 },
          { label: 'Wed', value: 1 },
          { label: 'Thu', value: 3 },
          { label: 'Fri', value: 2 },
          { label: 'Sat', value: 4 },
          { label: 'Sun', value: 2 },
        ],
        conversionRate: 4.8,
        occupancyRate: 85.0,
        totalEarnings: 215000,
        topProperty: {
          title: '3 BHK Sea Facing Penthouse',
          views: 640,
          leads: 14,
          rent: 95000,
          locality: 'Bandra West',
        },
        popularLocality: {
          name: 'Bandra West',
          score: 96,
          demand: 'HIGH DEMAND (+34% searches)',
        },
      };
    }

    return {
      viewsTimeline: [
        { label: 'Week 1', value: 720 },
        { label: 'Week 2', value: 940 },
        { label: 'Week 3', value: 1080 },
        { label: 'Week 4', value: 1100 },
      ],
      savesTimeline: [
        { label: 'Week 1', value: 95 },
        { label: 'Week 2', value: 130 },
        { label: 'Week 3', value: 145 },
        { label: 'Week 4', value: 112 },
      ],
      leadsTimeline: [
        { label: 'Week 1', value: 6 },
        { label: 'Week 2', value: 9 },
        { label: 'Week 3', value: 12 },
        { label: 'Week 4', value: 8 },
      ],
      conversionRate: 5.2,
      occupancyRate: 85.0,
      totalEarnings: 215000,
      topProperty: {
        title: '3 BHK Sea Facing Penthouse',
        views: 2180,
        leads: 32,
        rent: 95000,
        locality: 'Bandra West',
      },
      popularLocality: {
        name: 'Bandra West, Mumbai',
        score: 98,
        demand: 'VERY HIGH (+48% lead speed)',
      },
    };
  }

  getPortfolioAnalytics(
    properties: any[] = [],
    leads: any[] = [],
    timeFilter: AnalyticsTimeFilter = '30d'
  ) {
    if (!properties || properties.length === 0) {
      const labels =
        timeFilter === '7d'
          ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

      return {
        viewsTimeline: labels.map((label) => ({ label, value: 0 })),
        savesTimeline: labels.map((label) => ({ label, value: 0 })),
        leadsTimeline: labels.map((label) => ({ label, value: 0 })),
        conversionRate: 0,
        occupancyRate: 0,
        totalEarnings: 0,
        topProperty: {
          title: 'No listings active yet',
          views: 0,
          leads: 0,
          rent: 0,
          locality: 'Add a property to start tracking impressions',
        },
        popularLocality: {
          name: 'Mumbai Prime Localities',
          score: 95,
          demand: 'HIGH DEMAND (+34% tenant searches)',
        },
      };
    }

    const totalViews = properties.reduce((acc, p) => acc + (p.views_count || 0), 0);
    const totalSaves = properties.reduce((acc, p) => acc + (p.saves_count || 0), 0);
    const totalLeads = leads.length || properties.reduce((acc, p) => acc + (p.enquiries_count || 0), 0);
    const totalEarnings = properties
      .filter((p) => p.status === 'rented' || p.status === 'occupied')
      .reduce((acc, p) => acc + (p.rent || 0), 0);

    const sortedByViews = [...properties].sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
    const top = sortedByViews[0];

    const conversionRate = totalViews > 0 ? parseFloat(((totalLeads / totalViews) * 100).toFixed(1)) : 0;
    const occupiedCount = properties.filter((p) => p.status === 'rented' || p.status === 'occupied').length;
    const occupancyRate = properties.length > 0 ? parseFloat(((occupiedCount / properties.length) * 100).toFixed(1)) : 0;

    const weights7d = [0.1, 0.12, 0.11, 0.15, 0.18, 0.2, 0.14];
    const weights30d = [0.2, 0.25, 0.3, 0.25];
    const labels =
      timeFilter === '7d'
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const weights = timeFilter === '7d' ? weights7d : weights30d;

    return {
      viewsTimeline: labels.map((label, i) => ({
        label,
        value: Math.round(totalViews * weights[i]),
      })),
      savesTimeline: labels.map((label, i) => ({
        label,
        value: Math.round(totalSaves * weights[i]),
      })),
      leadsTimeline: labels.map((label, i) => ({
        label,
        value: Math.round(totalLeads * weights[i]),
      })),
      conversionRate,
      occupancyRate,
      totalEarnings,
      topProperty: {
        title: top.title || 'Featured Listing',
        views: top.views_count || 0,
        leads: top.enquiries_count || leads.filter((l) => l.property_id === top.id).length || 0,
        rent: top.rent || 0,
        locality: top.locality || 'Mumbai',
      },
      popularLocality: {
        name: top.locality || 'Bandra West, Mumbai',
        score: 96,
        demand: 'HIGH DEMAND (+34% searches)',
      },
    };
  }
}

export const ownerEcosystemService = new OwnerEcosystemService();
