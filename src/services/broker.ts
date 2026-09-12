/**
 * REHVO Broker Ecosystem Service
 * Handles operations for Real Estate Agents, RERA-verified Brokers & Agencies:
 * - Broker Profile management (Agency Name, RERA, Experience, Office Address)
 * - Exclusive & Shared Inventory portfolio
 * - High-intent Client Leads CRM
 * - Performance Metrics & Commission Pipeline
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BrokerProfile,
  SupabaseBrokerProfile,
  BrokerClientLead,
  BrokerDashboardMetrics,
  Property,
} from '../types';

const BROKER_PROFILE_CACHE_PREFIX = '@rehvo_broker_profile_';
const BROKER_LEADS_CACHE_PREFIX = '@rehvo_broker_leads_';

// ---------------------------------------------------------------------------
// Mock Fallbacks (for offline & instant preview)
// ---------------------------------------------------------------------------

export const DEFAULT_BROKER_PROFILE: BrokerProfile = {
  id: 'broker-prof-1',
  user_id: 'broker-user-1',
  agency_name: 'Emerald Prime Realty & Advisory',
  owner_name: 'Rajesh Singhania',
  company_logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80',
  rera_number: 'A51900028492',
  office_address: 'Level 12, Express Towers, Nariman Point, Mumbai 400021',
  operating_city: 'Mumbai',
  years_experience: 9,
  languages: ['English', 'Hindi', 'Gujarati', 'Marathi'],
  specializations: ['Bandra West Luxury', 'Worli Sea-Facing', 'Commercial BKC'],
  verified: true,
  rating: 4.96,
  properties_count: 28,
  clients_count: 42,
  response_time: '< 10 mins',
  subscription_plan: 'PRO_ENTERPRISE',
  created_at: new Date(Date.now() - 86400000 * 400).toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_BROKER_METRICS: BrokerDashboardMetrics = {
  active_inventory_count: 28,
  total_clients_count: 42,
  active_deals_count: 7,
  visits_this_week: 14,
  commission_earned: 485000,
  pipeline_value: 125000000,
  average_closing_days: 11,
};

export const DEFAULT_BROKER_CLIENTS: BrokerClientLead[] = [
  {
    id: 'b-lead-1',
    broker_id: 'broker-prof-1',
    client_name: 'Karan Malhotra',
    client_phone: '+91 98201 11223',
    client_email: 'karan.m@equityventures.in',
    client_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    requirement: '3 BHK Sea-View Apartment with 2 covered car parks',
    budget_min: 150000,
    budget_max: 225000,
    preferred_locations: ['Worli', 'Lower Parel', 'Prabhadevi'],
    stage: 'VIEWING_SCHEDULED',
    is_verified: true,
    notes: 'Managing Partner at Venture Capital firm. Ready for 2-year lock-in.',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'b-lead-2',
    broker_id: 'broker-prof-1',
    client_name: 'Aanya & Siddharth Sen',
    client_phone: '+91 98192 88440',
    client_email: 'siddharth.sen@techleads.io',
    client_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    requirement: '4 BHK Duplex Penthouse or Ultra-luxury Gated Society',
    budget_min: 275000,
    budget_max: 350000,
    preferred_locations: ['Bandra West', 'Khar', 'Pali Hill'],
    stage: 'NEW',
    is_verified: true,
    notes: 'Relocating from Singapore next month. Prefers turnkey designer furnishing.',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'b-lead-3',
    broker_id: 'broker-prof-1',
    client_name: 'Vikramaditya Rao',
    client_phone: '+91 97690 44321',
    client_email: 'vikram.rao@finlaw.com',
    client_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    requirement: 'Commercial Office Space 2,500 - 4,000 sq.ft (Warm Shell)',
    budget_min: 350000,
    budget_max: 500000,
    preferred_locations: ['BKC G-Block', 'Bandra Kurla Complex'],
    stage: 'OFFER_SUBMITTED',
    is_verified: true,
    notes: 'Commercial lease for Law Chambers. 5-year lock-in proposal submitted.',
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
  {
    id: 'b-lead-4',
    broker_id: 'broker-prof-1',
    client_name: 'Meera Deshmukh',
    client_phone: '+91 98200 99881',
    client_email: 'meera.d@deshmukharts.com',
    client_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    requirement: '2 BHK Boutique Apartment near Bandra Promenade',
    budget_min: 95000,
    budget_max: 120000,
    preferred_locations: ['Carter Road', 'Bandra West'],
    stage: 'CLOSED',
    is_verified: true,
    notes: 'Agreement signed and token received. Commission settled ₹1,10,000.',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

// ---------------------------------------------------------------------------
// Broker Profile Services
// ---------------------------------------------------------------------------

export async function getBrokerProfile(userId: string): Promise<{ success: boolean; data?: BrokerProfile; error?: string }> {
  try {
    // 1. Try local cache first for instant UI response
    const cached = await AsyncStorage.getItem(`${BROKER_PROFILE_CACHE_PREFIX}${userId}`);
    let fallbackData = cached ? JSON.parse(cached) : null;

    if (!isSupabaseConfigured()) {
      return { success: true, data: fallbackData || { ...DEFAULT_BROKER_PROFILE, user_id: userId } };
    }

    // 2. Fetch from Supabase
    const { data, error } = await supabase
      .from('broker_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn('[REHVO Broker Service] fetch error:', error.message);
      return { success: true, data: fallbackData || { ...DEFAULT_BROKER_PROFILE, user_id: userId } };
    }

    if (data) {
      const profile: BrokerProfile = {
        id: data.id,
        user_id: data.user_id,
        agency_name: data.agency_name,
        owner_name: data.owner_name || undefined,
        company_logo: data.company_logo || undefined,
        rera_number: data.rera_number || undefined,
        office_address: data.office_address || undefined,
        operating_city: data.operating_city,
        years_experience: data.years_experience,
        languages: data.languages || [],
        specializations: data.specializations || [],
        verified: data.verified,
        rating: Number(data.rating) || 4.9,
        properties_count: data.properties_count || 0,
        clients_count: data.clients_count || 0,
        response_time: data.response_time || '< 15 mins',
        subscription_plan: data.subscription_plan || 'PRO_BROKER',
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      await AsyncStorage.setItem(`${BROKER_PROFILE_CACHE_PREFIX}${userId}`, JSON.stringify(profile));
      return { success: true, data: profile };
    }

    return { success: true, data: fallbackData || { ...DEFAULT_BROKER_PROFILE, user_id: userId } };
  } catch (err: any) {
    return { success: true, data: { ...DEFAULT_BROKER_PROFILE, user_id: userId } };
  }
}

export async function upsertBrokerProfile(
  userId: string,
  profile: Partial<BrokerProfile>
): Promise<{ success: boolean; data?: BrokerProfile; error?: string }> {
  try {
    const payload = {
      user_id: userId,
      agency_name: profile.agency_name || DEFAULT_BROKER_PROFILE.agency_name,
      owner_name: profile.owner_name,
      company_logo: profile.company_logo,
      rera_number: profile.rera_number,
      office_address: profile.office_address,
      operating_city: profile.operating_city || 'Mumbai',
      years_experience: profile.years_experience ?? 1,
      languages: profile.languages || ['English', 'Hindi'],
      specializations: profile.specializations || ['Luxury Rentals'],
      verified: profile.verified ?? false,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('broker_profiles')
        .upsert(payload, { onConflict: 'user_id' })
        .select('*')
        .single();

      if (error) {
        console.warn('[REHVO Broker] upsert error:', error.message);
      } else if (data) {
        const updated: BrokerProfile = {
          ...profile,
          id: data.id,
          user_id: data.user_id,
          agency_name: data.agency_name,
          updated_at: data.updated_at,
        } as BrokerProfile;

        await AsyncStorage.setItem(`${BROKER_PROFILE_CACHE_PREFIX}${userId}`, JSON.stringify(updated));
        return { success: true, data: updated };
      }
    }

    // Local fallback update
    const merged: BrokerProfile = {
      ...DEFAULT_BROKER_PROFILE,
      ...profile,
      user_id: userId,
      updated_at: new Date().toISOString(),
    };
    await AsyncStorage.setItem(`${BROKER_PROFILE_CACHE_PREFIX}${userId}`, JSON.stringify(merged));
    return { success: true, data: merged };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save broker profile' };
  }
}

// ---------------------------------------------------------------------------
// Broker CRM: Clients & Pipeline
// ---------------------------------------------------------------------------

export async function getBrokerClients(brokerId: string): Promise<BrokerClientLead[]> {
  try {
    const cached = await AsyncStorage.getItem(`${BROKER_LEADS_CACHE_PREFIX}${brokerId}`);
    if (cached) {
      return JSON.parse(cached);
    }
    await AsyncStorage.setItem(
      `${BROKER_LEADS_CACHE_PREFIX}${brokerId}`,
      JSON.stringify(DEFAULT_BROKER_CLIENTS)
    );
    return DEFAULT_BROKER_CLIENTS;
  } catch {
    return DEFAULT_BROKER_CLIENTS;
  }
}

export async function updateBrokerClientStage(
  brokerId: string,
  leadId: string,
  newStage: BrokerClientLead['stage']
): Promise<BrokerClientLead[]> {
  try {
    const current = await getBrokerClients(brokerId);
    const updated = current.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l));
    await AsyncStorage.setItem(`${BROKER_LEADS_CACHE_PREFIX}${brokerId}`, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_BROKER_CLIENTS;
  }
}
