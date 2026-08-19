import { createClient } from '@/lib/supabase/client';
import { Enquiry } from '@/lib/types';

const supabase = createClient();

export interface EnquiryServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Create an enquiry for a property listing */
export async function createEnquiry(payload: {
  userId: string;
  propertyId: string;
  ownerId: string;
  message: string;
}): Promise<EnquiryServiceResult<Enquiry>> {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .insert({
        user_id: payload.userId,
        property_id: payload.propertyId,
        owner_id: payload.ownerId,
        message: payload.message.trim(),
        status: 'pending',
      })
      .select(`
        *,
        properties (id, title, locality, city, price, property_images (*))
      `)
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || 'Failed to submit enquiry.' };
    }

    // Increment enquiries_count on property
    try {
      await supabase.rpc('increment_property_enquiries', { p_property_id: payload.propertyId });
    } catch {
      // Fallback
    }

    return { success: true, data: data as Enquiry };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to submit enquiry.' };
  }
}

/** Fetch enquiries sent by the current user (Renter view) */
export async function getMyEnquiries(
  userId: string
): Promise<EnquiryServiceResult<Enquiry[]>> {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select(`
        *,
        properties (id, title, locality, city, price, bedrooms, property_images (*)),
        owner_profile:profiles!enquiries_owner_id_fkey (id, full_name, phone, email, profile_photo)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: (data || []) as Enquiry[] };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}

/** Fetch enquiries received for properties owned by current user (Owner view) */
export async function getOwnerEnquiries(
  ownerId: string
): Promise<EnquiryServiceResult<Enquiry[]>> {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select(`
        *,
        properties (id, title, locality, city, price, bedrooms, property_images (*)),
        renter_profile:profiles!enquiries_user_id_fkey (id, full_name, phone, email, profile_photo)
      `)
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: (data || []) as Enquiry[] };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}

/** Update status of an enquiry */
export async function updateEnquiryStatus(
  enquiryId: string,
  status: 'pending' | 'replied' | 'scheduled' | 'closed'
): Promise<EnquiryServiceResult> {
  try {
    const { error } = await supabase
      .from('enquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', enquiryId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
