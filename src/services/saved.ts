/**
 * REHVO Saved Service
 * Centralized Supabase operations for saved properties and saved flatmates.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type {
  Property,
  FlatmateProfile,
  PropertyImage,
  SupabasePropertyImage,
} from '../types';
import { mapSupabasePropertyToApp } from './properties';
import { mapSupabaseFlatmateToApp } from './flatmates';

// ---------------------------------------------------------------------------
// Response Envelope
// ---------------------------------------------------------------------------

export interface SavedServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ---------------------------------------------------------------------------
// Error Mapping
// ---------------------------------------------------------------------------

function getUserFriendlySavedError(error: unknown, fallback: string): string {
  if (!error) return fallback;
  const msg = (error as { message?: string })?.message || String(error);

  if (msg.includes('fetch') || msg.includes('network') || msg.includes('ENOTFOUND')) {
    return "Couldn't connect to server. Please check your connection.";
  }
  if (msg.includes('row-level security') || msg.includes('policy') || msg.includes('42501')) {
    return 'You do not have permission to modify saved items.';
  }
  if (msg.includes('foreign key') || msg.includes('violates foreign key')) {
    return 'Item not found or session invalid.';
  }

  return fallback;
}

// ---------------------------------------------------------------------------
// Property Saves Operations
// ---------------------------------------------------------------------------

/** Check if a property is saved by current user */
export async function isPropertySaved(propertyId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !propertyId) return false;
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) return false;

    const { data, error } = await supabase
      .from('saved_properties')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .maybeSingle();

    if (error || !data) return false;
    return true;
  } catch {
    return false;
  }
}

/** Save a property for the authenticated user */
export async function saveProperty(
  propertyId: string
): Promise<SavedServiceResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;

    if (!userId) {
      return { success: false, error: 'You must be signed in to save properties.' };
    }

    const { error } = await supabase
      .from('saved_properties')
      .upsert(
        { user_id: userId, property_id: propertyId },
        { onConflict: 'user_id,property_id', ignoreDuplicates: true }
      );

    if (error) {
      return {
        success: false,
        error: getUserFriendlySavedError(error, "Couldn't save this property."),
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlySavedError(err, "Couldn't save this property."),
    };
  }
}

/** Unsave a property for the authenticated user */
export async function unsaveProperty(
  propertyId: string
): Promise<SavedServiceResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;

    if (!userId) {
      return { success: false, error: 'You must be signed in to modify saved items.' };
    }

    const { error } = await supabase
      .from('saved_properties')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);

    if (error) {
      return {
        success: false,
        error: getUserFriendlySavedError(error, "Couldn't remove this property."),
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlySavedError(err, "Couldn't remove this property."),
    };
  }
}

/** Toggle save/unsave for a property */
export async function toggleSavedProperty(
  propertyId: string
): Promise<SavedServiceResult<{ isSaved: boolean }>> {
  const currentlySaved = await isPropertySaved(propertyId);
  if (currentlySaved) {
    const res = await unsaveProperty(propertyId);
    if (!res.success) return { success: false, error: res.error };
    return { success: true, data: { isSaved: false } };
  } else {
    const res = await saveProperty(propertyId);
    if (!res.success) return { success: false, error: res.error };
    return { success: true, data: { isSaved: true } };
  }
}

/** Get list of saved property IDs for a user */
export async function getSavedPropertyIds(
  userId?: string
): Promise<SavedServiceResult<string[]>> {
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
      .from('saved_properties')
      .select('property_id')
      .eq('user_id', targetUserId);

    if (error) {
      return {
        success: false,
        error: getUserFriendlySavedError(error, "Couldn't load your saved properties."),
        data: [],
      };
    }

    const ids = (data || []).map((r) => r.property_id);
    return { success: true, data: ids };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlySavedError(err, "Couldn't load your saved properties."),
      data: [],
    };
  }
}

/** Fetch full details for all saved properties */
export async function getSavedProperties(
  userId?: string
): Promise<SavedServiceResult<Property[]>> {
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
      .from('saved_properties')
      .select(`
        created_at,
        properties (
          *,
          property_images (*),
          profiles:owner_id (full_name, phone, profile_photo)
        )
      `)
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });

    if (error) {
      return {
        success: false,
        error: getUserFriendlySavedError(error, "Couldn't load your saved properties."),
        data: [],
      };
    }

    const properties: Property[] = [];

    for (const row of data || []) {
      const propData = (row as any).properties;
      // Skip if property was deleted/null or removed
      if (!propData || propData.status === 'removed') continue;

      const images: PropertyImage[] = (propData.property_images || [])
        .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((img: SupabasePropertyImage) => ({
          id: img.id,
          property_id: img.property_id,
          url: img.image_url,
          is_cover: img.is_cover,
          sort_order: img.sort_order,
        }));

      properties.push(
        mapSupabasePropertyToApp(propData, images, propData.profiles)
      );
    }

    return { success: true, data: properties };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlySavedError(err, "Couldn't load your saved properties."),
      data: [],
    };
  }
}

// ---------------------------------------------------------------------------
// Flatmate Saves Operations
// ---------------------------------------------------------------------------

/** Check if a flatmate profile is saved by current user */
export async function isFlatmateSaved(flatmateProfileId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !flatmateProfileId) return false;
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) return false;

    const { data, error } = await supabase
      .from('saved_flatmates')
      .select('id')
      .eq('user_id', userId)
      .eq('flatmate_profile_id', flatmateProfileId)
      .maybeSingle();

    if (error || !data) return false;
    return true;
  } catch {
    return false;
  }
}

/** Save a flatmate profile for the authenticated user */
export async function saveFlatmate(
  flatmateProfileId: string
): Promise<SavedServiceResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;

    if (!userId) {
      return { success: false, error: 'You must be signed in to save flatmates.' };
    }

    const { error } = await supabase
      .from('saved_flatmates')
      .upsert(
        { user_id: userId, flatmate_profile_id: flatmateProfileId },
        { onConflict: 'user_id,flatmate_profile_id', ignoreDuplicates: true }
      );

    if (error) {
      return {
        success: false,
        error: getUserFriendlySavedError(error, "Couldn't save this profile."),
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlySavedError(err, "Couldn't save this profile."),
    };
  }
}

/** Unsave a flatmate profile for the authenticated user */
export async function unsaveFlatmate(
  flatmateProfileId: string
): Promise<SavedServiceResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;

    if (!userId) {
      return { success: false, error: 'You must be signed in to modify saved items.' };
    }

    const { error } = await supabase
      .from('saved_flatmates')
      .delete()
      .eq('user_id', userId)
      .eq('flatmate_profile_id', flatmateProfileId);

    if (error) {
      return {
        success: false,
        error: getUserFriendlySavedError(error, "Couldn't remove this profile."),
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlySavedError(err, "Couldn't remove this profile."),
    };
  }
}

/** Toggle save/unsave for a flatmate */
export async function toggleSavedFlatmate(
  flatmateProfileId: string
): Promise<SavedServiceResult<{ isSaved: boolean }>> {
  const currentlySaved = await isFlatmateSaved(flatmateProfileId);
  if (currentlySaved) {
    const res = await unsaveFlatmate(flatmateProfileId);
    if (!res.success) return { success: false, error: res.error };
    return { success: true, data: { isSaved: false } };
  } else {
    const res = await saveFlatmate(flatmateProfileId);
    if (!res.success) return { success: false, error: res.error };
    return { success: true, data: { isSaved: true } };
  }
}

/** Get list of saved flatmate profile IDs for a user */
export async function getSavedFlatmateIds(
  userId?: string
): Promise<SavedServiceResult<string[]>> {
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
      .from('saved_flatmates')
      .select('flatmate_profile_id')
      .eq('user_id', targetUserId);

    if (error) {
      return {
        success: false,
        error: getUserFriendlySavedError(error, "Couldn't load your saved flatmates."),
        data: [],
      };
    }

    const ids = (data || []).map((r) => r.flatmate_profile_id);
    return { success: true, data: ids };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlySavedError(err, "Couldn't load your saved flatmates."),
      data: [],
    };
  }
}

/** Fetch full details for all saved flatmates */
export async function getSavedFlatmates(
  userId?: string
): Promise<SavedServiceResult<FlatmateProfile[]>> {
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
      .from('saved_flatmates')
      .select(`
        created_at,
        flatmate_profiles (
          *,
          profiles:user_id (full_name, phone, email, profile_photo)
        )
      `)
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });

    if (error) {
      return {
        success: false,
        error: getUserFriendlySavedError(error, "Couldn't load your saved flatmates."),
        data: [],
      };
    }

    const flatmates: FlatmateProfile[] = [];

    for (const row of data || []) {
      const fmData = (row as any).flatmate_profiles;
      // Skip if flatmate profile was deleted/null
      if (!fmData) continue;

      flatmates.push(
        mapSupabaseFlatmateToApp(fmData, fmData.profiles)
      );
    }

    return { success: true, data: flatmates };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlySavedError(err, "Couldn't load your saved flatmates."),
      data: [],
    };
  }
}
