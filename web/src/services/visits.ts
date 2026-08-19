import { createClient } from '@/lib/supabase/client';
import { Visit } from '@/lib/types';

const supabase = createClient();

export interface VisitServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Schedule an in-person property visit */
export async function scheduleVisit(payload: {
  userId: string;
  propertyId: string;
  ownerId: string;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
}): Promise<VisitServiceResult<Visit>> {
  try {
    const { data, error } = await supabase
      .from('visits')
      .insert({
        user_id: payload.userId,
        property_id: payload.propertyId,
        owner_id: payload.ownerId,
        scheduled_date: payload.scheduledDate,
        scheduled_time: payload.scheduledTime,
        notes: payload.notes?.trim() || null,
        status: 'pending',
      })
      .select(`
        *,
        properties (id, title, locality, city, price, address, property_images (*))
      `)
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || 'Failed to schedule visit.' };
    }

    return { success: true, data: data as Visit };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to schedule visit.' };
  }
}

/** Fetch visits booked by current user (Renter view) */
export async function getMyVisits(
  userId: string
): Promise<VisitServiceResult<Visit[]>> {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        properties (id, title, locality, city, price, address, bedrooms, property_images (*)),
        owner_profile:profiles!visits_owner_id_fkey (id, full_name, phone, email, profile_photo)
      `)
      .eq('user_id', userId)
      .order('scheduled_date', { ascending: true });

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: (data || []) as Visit[] };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}

/** Fetch visits booked for owner's properties (Owner view) */
export async function getOwnerVisits(
  ownerId: string
): Promise<VisitServiceResult<Visit[]>> {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        properties (id, title, locality, city, price, address, bedrooms, property_images (*)),
        renter_profile:profiles!visits_user_id_fkey (id, full_name, phone, email, profile_photo)
      `)
      .eq('owner_id', ownerId)
      .order('scheduled_date', { ascending: true });

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: (data || []) as Visit[] };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}

/** Update status of a visit */
export async function updateVisitStatus(
  visitId: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<VisitServiceResult> {
  try {
    const { error } = await supabase
      .from('visits')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', visitId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
