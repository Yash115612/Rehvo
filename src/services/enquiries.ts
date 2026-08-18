/**
 * REHVO Enquiries Service
 * Centralized Supabase operations for property enquiries.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { createNotification } from './notifications';
import type { Enquiry, SupabaseEnquiry } from '../types';

// ---------------------------------------------------------------------------
// Response Envelope
// ---------------------------------------------------------------------------

export interface EnquiryServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ---------------------------------------------------------------------------
// Error Mapping
// ---------------------------------------------------------------------------

function getUserFriendlyEnquiryError(error: unknown, fallback: string): string {
  if (!error) return fallback;
  const msg = (error as { message?: string })?.message || String(error);

  if (msg.includes('fetch') || msg.includes('network') || msg.includes('ENOTFOUND')) {
    return "Couldn't connect to server. Please check your connection.";
  }
  if (msg.includes('row-level security') || msg.includes('policy') || msg.includes('42501')) {
    return 'You do not have permission to perform this enquiry action.';
  }
  if (msg.includes('foreign key') || msg.includes('violates foreign key')) {
    return 'Property or user session not found.';
  }

  return fallback;
}

// ---------------------------------------------------------------------------
// Status Normalization
// ---------------------------------------------------------------------------

export function mapAppStatusToDb(
  status: Enquiry['status'] | SupabaseEnquiry['status']
): SupabaseEnquiry['status'] {
  switch (status) {
    case 'NEW':
    case 'pending':
      return 'pending';
    case 'CONTACTED':
    case 'APPLIED':
    case 'replied':
      return 'replied';
    case 'VISIT_SCHEDULED':
    case 'scheduled':
      return 'scheduled';
    case 'CLOSED':
    case 'closed':
      return 'closed';
    default:
      return 'pending';
  }
}

export function mapDbStatusToApp(
  status: SupabaseEnquiry['status'] | string
): Enquiry['status'] {
  switch (status) {
    case 'replied':
      return 'CONTACTED';
    case 'scheduled':
      return 'VISIT_SCHEDULED';
    case 'closed':
      return 'CLOSED';
    case 'pending':
    default:
      return 'NEW';
  }
}

export function mapSupabaseEnquiryToApp(
  row: any,
  propertyData?: any,
  renterData?: any
): Enquiry {
  const prop = propertyData || row.properties;
  const renter = renterData || row.renter_profile;

  return {
    id: row.id,
    property_id: row.property_id,
    property_title: prop?.title || 'Rental Property',
    renter_id: row.user_id,
    renter_name: renter?.full_name || 'Renter',
    renter_phone: renter?.phone || '+91 98765 43210',
    owner_id: row.owner_id,
    message: row.message,
    status: mapDbStatusToApp(row.status),
    created_at: row.created_at,
  };
}

// ---------------------------------------------------------------------------
// Enquiries CRUD Operations
// ---------------------------------------------------------------------------

/** Submit a new enquiry for a property */
export async function createEnquiry(
  propertyId: string,
  message: string
): Promise<EnquiryServiceResult<Enquiry>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;

    if (!userId) {
      return { success: false, error: 'You must be signed in to send an enquiry.' };
    }

    if (!message || !message.trim()) {
      return { success: false, error: 'Please enter a message for the host.' };
    }

    // 1. Fetch target property to verify existence and get owner_id
    const { data: propData, error: propError } = await supabase
      .from('properties')
      .select('id, title, owner_id, status')
      .eq('id', propertyId)
      .single();

    if (propError || !propData) {
      return { success: false, error: 'Property not found or unavailable.' };
    }

    if (propData.owner_id === userId) {
      return { success: false, error: 'You cannot send an enquiry on your own property.' };
    }

    // 2. Insert into public.enquiries
    const { data: enquiryData, error: insertError } = await supabase
      .from('enquiries')
      .insert({
        user_id: userId,
        property_id: propertyId,
        owner_id: propData.owner_id,
        message: message.trim(),
        status: 'pending',
      })
      .select(`
        *,
        properties (id, title),
        renter_profile:profiles!enquiries_user_id_fkey (full_name, phone)
      `)
      .single();

    if (insertError) {
      return {
        success: false,
        error: getUserFriendlyEnquiryError(insertError, "Couldn't send this enquiry."),
      };
    }

    const appEnquiry = mapSupabaseEnquiryToApp(enquiryData);

    // Asynchronously notify property owner
    (async () => {
      try {
        await createNotification({
          userId: propData.owner_id,
          type: 'application',
          title: 'New property enquiry',
          body: `You received an enquiry for "${propData.title || 'your property'}".`,
          data: { enquiry_id: enquiryData.id, property_id: propertyId },
        });
      } catch (_) {
        // Non-blocking notification dispatch
      }
    })();

    return { success: true, data: appEnquiry };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyEnquiryError(err, "Couldn't send this enquiry."),
    };
  }
}

/** Get all enquiries sent by the current authenticated user (renter view) */
export async function getMyEnquiries(
  userId?: string
): Promise<EnquiryServiceResult<Enquiry[]>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected', data: [] };
  }

  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const { data: authData } = await supabase.auth.getUser();
      targetUserId = authData?.user?.id;
    }
    if (!targetUserId) {
      return { success: false, error: 'User not signed in', data: [] };
    }

    const { data, error } = await supabase
      .from('enquiries')
      .select(`
        *,
        properties (id, title, city, locality, rent),
        renter_profile:profiles!enquiries_user_id_fkey (full_name, phone)
      `)
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });

    if (error) {
      return {
        success: false,
        error: getUserFriendlyEnquiryError(error, "Couldn't load enquiries."),
        data: [],
      };
    }

    const enquiries = (data || []).map((row) => mapSupabaseEnquiryToApp(row));
    return { success: true, data: enquiries };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyEnquiryError(err, "Couldn't load enquiries."),
      data: [],
    };
  }
}

/** Get all enquiries received for properties owned by current user (owner view) */
export async function getOwnerEnquiries(
  ownerId?: string
): Promise<EnquiryServiceResult<Enquiry[]>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected', data: [] };
  }

  try {
    let targetOwnerId = ownerId;
    if (!targetOwnerId) {
      const { data: authData } = await supabase.auth.getUser();
      targetOwnerId = authData?.user?.id;
    }
    if (!targetOwnerId) {
      return { success: false, error: 'User not signed in', data: [] };
    }

    const { data, error } = await supabase
      .from('enquiries')
      .select(`
        *,
        properties (id, title, city, locality, rent),
        renter_profile:profiles!enquiries_user_id_fkey (full_name, phone)
      `)
      .eq('owner_id', targetOwnerId)
      .order('created_at', { ascending: false });

    if (error) {
      return {
        success: false,
        error: getUserFriendlyEnquiryError(error, "Couldn't load enquiries."),
        data: [],
      };
    }

    const enquiries = (data || []).map((row) => mapSupabaseEnquiryToApp(row));
    return { success: true, data: enquiries };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyEnquiryError(err, "Couldn't load enquiries."),
      data: [],
    };
  }
}

/** Get a single enquiry by ID */
export async function getEnquiryById(
  enquiryId: string
): Promise<EnquiryServiceResult<Enquiry>> {
  if (!isSupabaseConfigured() || !enquiryId) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select(`
        *,
        properties (id, title, city, locality, rent),
        renter_profile:profiles!enquiries_user_id_fkey (full_name, phone)
      `)
      .eq('id', enquiryId)
      .single();

    if (error || !data) {
      return {
        success: false,
        error: getUserFriendlyEnquiryError(error, "Couldn't load this enquiry."),
      };
    }

    return { success: true, data: mapSupabaseEnquiryToApp(data) };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyEnquiryError(err, "Couldn't load this enquiry."),
    };
  }
}

/** Update status of an enquiry */
export async function updateEnquiryStatus(
  enquiryId: string,
  status: Enquiry['status'] | SupabaseEnquiry['status']
): Promise<EnquiryServiceResult<Enquiry>> {
  if (!isSupabaseConfigured() || !enquiryId) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const dbStatus = mapAppStatusToDb(status);

    const { data, error } = await supabase
      .from('enquiries')
      .update({ status: dbStatus })
      .eq('id', enquiryId)
      .select(`
        *,
        properties (id, title, city, locality, rent),
        renter_profile:profiles!enquiries_user_id_fkey (full_name, phone)
      `)
      .single();

    if (error) {
      return {
        success: false,
        error: getUserFriendlyEnquiryError(error, "Couldn't update the enquiry."),
      };
    }

    return { success: true, data: mapSupabaseEnquiryToApp(data) };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyEnquiryError(err, "Couldn't update the enquiry."),
    };
  }
}
