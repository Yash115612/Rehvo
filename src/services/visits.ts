/**
 * REHVO Scheduled Visits Service
 * Centralized Supabase operations for scheduled property tours and visits.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { createNotification } from './notifications';
import type { Visit, VisitStatus, SupabaseVisit } from '../types';

// ---------------------------------------------------------------------------
// Response Envelope
// ---------------------------------------------------------------------------

export interface VisitServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ---------------------------------------------------------------------------
// Error Mapping
// ---------------------------------------------------------------------------

function getUserFriendlyVisitError(error: unknown, fallback: string): string {
  if (!error) return fallback;
  const msg = (error as { message?: string })?.message || String(error);

  if (msg.includes('fetch') || msg.includes('network') || msg.includes('ENOTFOUND')) {
    return "Couldn't connect to server. Please check your connection.";
  }
  if (msg.includes('row-level security') || msg.includes('policy') || msg.includes('42501')) {
    return 'You do not have permission to manage this visit.';
  }
  if (msg.includes('foreign key') || msg.includes('violates foreign key')) {
    return 'Property or user session not found.';
  }

  return fallback;
}

// ---------------------------------------------------------------------------
// Status Normalization
// ---------------------------------------------------------------------------

export function mapAppVisitStatusToDb(
  status: VisitStatus | SupabaseVisit['status']
): SupabaseVisit['status'] {
  switch (status) {
    case 'REQUESTED':
    case 'pending':
      return 'pending';
    case 'CONFIRMED':
    case 'confirmed':
      return 'confirmed';
    case 'COMPLETED':
    case 'completed':
      return 'completed';
    case 'CANCELLED':
    case 'cancelled':
    case 'RESCHEDULED':
      return 'cancelled';
    default:
      return 'pending';
  }
}

export function mapDbVisitStatusToApp(
  status: SupabaseVisit['status'] | string
): VisitStatus {
  switch (status) {
    case 'confirmed':
      return 'CONFIRMED';
    case 'completed':
      return 'COMPLETED';
    case 'cancelled':
      return 'CANCELLED';
    case 'pending':
    default:
      return 'REQUESTED';
  }
}

export function mapSupabaseVisitToApp(
  row: any,
  propertyData?: any,
  renterData?: any,
  ownerData?: any
): Visit {
  const prop = propertyData || row.properties;
  const renter = renterData || row.renter_profile;
  const owner = ownerData || row.owner_profile;

  const coverImage =
    prop?.property_images?.find((img: any) => img.is_cover)?.image_url ||
    prop?.property_images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';

  return {
    id: row.id,
    property_id: row.property_id,
    property_title: prop?.title || 'Rental Property',
    property_image: coverImage,
    property_locality: prop?.locality ? `${prop.locality}, ${prop.city || 'Mumbai'}` : 'Mumbai',
    rent: prop?.price ?? prop?.rent ?? 0,
    renter_id: row.user_id,
    renter_name: renter?.full_name || 'Renter',
    renter_phone: renter?.phone || '+91 98765 43210',
    owner_id: row.owner_id,
    owner_name: owner?.full_name || 'Owner',
    date: row.scheduled_date,
    time: row.scheduled_time,
    status: mapDbVisitStatusToApp(row.status),
    notes: row.notes || undefined,
    created_at: row.created_at,
  };
}

// ---------------------------------------------------------------------------
// Visits CRUD Operations
// ---------------------------------------------------------------------------

/** Create a new scheduled visit request */
export async function createVisit(
  propertyId: string,
  scheduledDate: string,
  scheduledTime: string,
  notes?: string
): Promise<VisitServiceResult<Visit>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;

    if (!userId) {
      return { success: false, error: 'You must be signed in to schedule a visit.' };
    }

    if (!scheduledDate || !scheduledTime) {
      return { success: false, error: 'Please select a valid date and time for the visit.' };
    }

    // Date validation: ensure selected date is not in the past
    const todayStr = new Date().toISOString().split('T')[0];
    if (scheduledDate < todayStr) {
      return { success: false, error: 'Please select an upcoming date for your visit.' };
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
      return { success: false, error: 'You cannot schedule a visit for your own property.' };
    }

    // 2. Insert into public.visits
    const { data: visitData, error: insertError } = await supabase
      .from('visits')
      .insert({
        user_id: userId,
        property_id: propertyId,
        owner_id: propData.owner_id,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        status: 'pending',
        notes: notes?.trim() || null,
      })
      .select(`
        *,
        properties (id, title, locality, city, price, property_images (*)),
        renter_profile:profiles!visits_user_id_fkey (full_name, phone),
        owner_profile:profiles!visits_owner_id_fkey (full_name, phone)
      `)
      .single();

    if (insertError) {
      return {
        success: false,
        error: getUserFriendlyVisitError(insertError, "Couldn't schedule this visit."),
      };
    }

    const appVisit = mapSupabaseVisitToApp(visitData);

    // Asynchronously notify property owner
    (async () => {
      try {
        await createNotification({
          userId: propData.owner_id,
          type: 'visit',
          title: 'New visit scheduled',
          body: `A visit for "${propData.title || 'your property'}" was requested for ${scheduledDate} at ${scheduledTime}.`,
          data: { visit_id: visitData.id, property_id: propertyId },
        });
      } catch (_) {
        // Non-blocking notification dispatch
      }
    })();

    return { success: true, data: appVisit };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyVisitError(err, "Couldn't schedule this visit."),
    };
  }
}

/** Get all visits scheduled by the current authenticated user (renter view) */
export async function getMyVisits(
  userId?: string
): Promise<VisitServiceResult<Visit[]>> {
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
      .from('visits')
      .select(`
        *,
        properties (id, title, locality, city, price, property_images (*)),
        renter_profile:profiles!visits_user_id_fkey (full_name, phone),
        owner_profile:profiles!visits_owner_id_fkey (full_name, phone)
      `)
      .eq('user_id', targetUserId)
      .order('scheduled_date', { ascending: false });

    if (error) {
      return {
        success: false,
        error: getUserFriendlyVisitError(error, "Couldn't load your visits."),
        data: [],
      };
    }

    const visits = (data || []).map((row) => mapSupabaseVisitToApp(row));
    return { success: true, data: visits };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyVisitError(err, "Couldn't load your visits."),
      data: [],
    };
  }
}

/** Get all visit requests received for properties owned by current user (owner view) */
export async function getOwnerVisits(
  ownerId?: string
): Promise<VisitServiceResult<Visit[]>> {
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
      .from('visits')
      .select(`
        *,
        properties (id, title, locality, city, price, property_images (*)),
        renter_profile:profiles!visits_user_id_fkey (full_name, phone),
        owner_profile:profiles!visits_owner_id_fkey (full_name, phone)
      `)
      .eq('owner_id', targetOwnerId)
      .order('scheduled_date', { ascending: false });

    if (error) {
      return {
        success: false,
        error: getUserFriendlyVisitError(error, "Couldn't load visit requests."),
        data: [],
      };
    }

    const visits = (data || []).map((row) => mapSupabaseVisitToApp(row));
    return { success: true, data: visits };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyVisitError(err, "Couldn't load visit requests."),
      data: [],
    };
  }
}

/** Get a single visit by ID */
export async function getVisitById(
  visitId: string
): Promise<VisitServiceResult<Visit>> {
  if (!isSupabaseConfigured() || !visitId) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        properties (id, title, locality, city, price, property_images (*)),
        renter_profile:profiles!visits_user_id_fkey (full_name, phone),
        owner_profile:profiles!visits_owner_id_fkey (full_name, phone)
      `)
      .eq('id', visitId)
      .single();

    if (error || !data) {
      return {
        success: false,
        error: getUserFriendlyVisitError(error, "Couldn't load this visit."),
      };
    }

    return { success: true, data: mapSupabaseVisitToApp(data) };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyVisitError(err, "Couldn't load this visit."),
    };
  }
}

/** Update status of a visit */
export async function updateVisitStatus(
  visitId: string,
  status: VisitStatus | SupabaseVisit['status']
): Promise<VisitServiceResult<Visit>> {
  if (!isSupabaseConfigured() || !visitId) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const dbStatus = mapAppVisitStatusToDb(status);

    const { data, error } = await supabase
      .from('visits')
      .update({ status: dbStatus })
      .eq('id', visitId)
      .select(`
        *,
        properties (id, title, locality, city, price, property_images (*)),
        renter_profile:profiles!visits_user_id_fkey (full_name, phone),
        owner_profile:profiles!visits_owner_id_fkey (full_name, phone)
      `)
      .single();

    if (error) {
      return {
        success: false,
        error: getUserFriendlyVisitError(error, "Couldn't update this visit."),
      };
    }

    const appVisit = mapSupabaseVisitToApp(data);

    // Asynchronously notify affected party based on transition
    (async () => {
      try {
        const propTitle = data.properties?.title || 'the property';
        if (dbStatus === 'confirmed') {
          await createNotification({
            userId: data.user_id,
            type: 'visit',
            title: 'Visit confirmed',
            body: `Your visit for "${propTitle}" on ${data.scheduled_date} has been confirmed.`,
            data: { visit_id: data.id, property_id: data.property_id },
          });
        } else if (dbStatus === 'cancelled') {
          const { data: authData } = await supabase.auth.getUser();
          const callerId = authData?.user?.id;
          const targetUserId = callerId === data.owner_id ? data.user_id : data.owner_id;
          await createNotification({
            userId: targetUserId,
            type: 'visit',
            title: 'Visit cancelled',
            body: `The visit for "${propTitle}" scheduled on ${data.scheduled_date} was cancelled.`,
            data: { visit_id: data.id, property_id: data.property_id },
          });
        } else if (dbStatus === 'completed') {
          await createNotification({
            userId: data.user_id,
            type: 'visit',
            title: 'Visit completed',
            body: `Your visit for "${propTitle}" has been marked completed.`,
            data: { visit_id: data.id, property_id: data.property_id },
          });
        }
      } catch (_) {
        // Non-blocking notification dispatch
      }
    })();

    return { success: true, data: appVisit };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyVisitError(err, "Couldn't update this visit."),
    };
  }
}

/** Confirm a visit request (owner action) */
export async function confirmVisit(visitId: string): Promise<VisitServiceResult<Visit>> {
  return updateVisitStatus(visitId, 'confirmed');
}

/** Cancel a scheduled visit (renter or owner action) */
export async function cancelVisit(visitId: string, notes?: string): Promise<VisitServiceResult<Visit>> {
  if (notes) {
    await supabase.from('visits').update({ notes }).eq('id', visitId);
  }
  return updateVisitStatus(visitId, 'cancelled');
}

/** Mark a visit as completed */
export async function completeVisit(visitId: string): Promise<VisitServiceResult<Visit>> {
  return updateVisitStatus(visitId, 'completed');
}
