/**
 * REHVO Flatmate Service
 * Centralized Supabase operations for flatmate profiles and photo storage.
 * Handles bidirectional mapping between DB columns and app-level FlatmateProfile models.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type {
  FlatmateProfile,
  SupabaseFlatmateProfile,
  SupabaseProfile,
} from '../types';

// ---------------------------------------------------------------------------
// Types & Response Envelopes
// ---------------------------------------------------------------------------

export interface FlatmateServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export type FlatmateProfileInput = Omit<
  FlatmateProfile,
  'id' | 'created_at' | 'updated_at'
>;

// ---------------------------------------------------------------------------
// Error Mapping
// ---------------------------------------------------------------------------

function getUserFriendlyFlatmateError(error: unknown, fallback: string): string {
  if (!error) return fallback;
  const msg = (error as { message?: string })?.message || String(error);

  if (msg.includes('fetch') || msg.includes('network') || msg.includes('ENOTFOUND')) {
    return "Couldn't connect to server. Please check your connection.";
  }
  if (msg.includes('row-level security') || msg.includes('policy') || msg.includes('42501')) {
    return 'You do not have permission to modify this profile.';
  }
  if (msg.includes('unique') || msg.includes('duplicate key') || msg.includes('23505')) {
    return 'You already have a Flatmate Profile. You can update your existing profile.';
  }
  if (msg.includes('foreign key') || msg.includes('violates foreign key')) {
    return 'Your user session is invalid. Please log in again.';
  }
  if (msg.includes('not found') || msg.includes('PGRST116')) {
    return 'Flatmate profile not found.';
  }

  return fallback;
}

// ---------------------------------------------------------------------------
// Bidirectional Type & Field Mappers
// ---------------------------------------------------------------------------

export function mapAppGenderToDb(g?: string): 'male' | 'female' | 'any' | 'other' {
  switch (g?.toLowerCase()) {
    case 'male':
      return 'male';
    case 'female':
      return 'female';
    case 'other':
      return 'other';
    default:
      return 'any';
  }
}

export function mapDbGenderToApp(g?: string | null): 'Male' | 'Female' | 'Any' | 'Other' {
  switch (g?.toLowerCase()) {
    case 'male':
      return 'Male';
    case 'female':
      return 'Female';
    case 'other':
      return 'Other';
    default:
      return 'Any';
  }
}

export function mapAppRoomPrefToDb(r?: string): 'private_room' | 'shared_room' | 'any' {
  switch (r?.toLowerCase()) {
    case 'private room':
    case 'private_room':
      return 'private_room';
    case 'shared room':
    case 'shared_room':
      return 'shared_room';
    default:
      return 'any';
  }
}

export function mapDbRoomPrefToApp(r?: string): 'Private Room' | 'Shared Room' | 'Any' {
  switch (r?.toLowerCase()) {
    case 'private_room':
    case 'private room':
      return 'Private Room';
    case 'shared_room':
    case 'shared room':
      return 'Shared Room';
    default:
      return 'Any';
  }
}

export function mapAppStatusToDb(isPublished?: boolean, isPaused?: boolean): 'draft' | 'published' | 'paused' {
  if (isPaused) return 'paused';
  if (isPublished) return 'published';
  return 'draft';
}

/** Convert a raw Supabase flatmate_profiles row + joined user profile into an App FlatmateProfile */
export function mapSupabaseFlatmateToApp(
  dbRow: SupabaseFlatmateProfile,
  ownerProfile?: Partial<SupabaseProfile> | null
): FlatmateProfile {
  const isPublished = dbRow.status === 'published';
  const isPaused = dbRow.status === 'paused';

  const defaultAvatar =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

  return {
    id: dbRow.id,
    user_id: dbRow.user_id,
    name: ownerProfile?.full_name || 'Flatmate',
    display_name: ownerProfile?.full_name || 'Flatmate',
    age: dbRow.age || 25,
    gender: mapDbGenderToApp(dbRow.gender),
    occupation: dbRow.profession || 'Professional',
    city: dbRow.city || 'Mumbai',
    locality: dbRow.locality || 'Mumbai',
    preferred_locations: dbRow.preferred_locations || [],
    budget_min: dbRow.budget_min || 0,
    budget_max: dbRow.budget_max || 35000,
    looking_for: 'Looking for a flatmate',
    room_preference: mapDbRoomPrefToApp(dbRow.room_preference),
    move_in_date: dbRow.move_in_date || 'Immediately',
    move_in_timing: dbRow.move_in_date || 'Immediately',
    bio: dbRow.bio || '',
    avatar: dbRow.photo || ownerProfile?.profile_photo || defaultAvatar,
    lifestyle_preferences: dbRow.lifestyle_preferences || [],
    match_score: 90,
    match_reasons: [
      `Location preference (${dbRow.locality || 'Mumbai'})`,
      `Budget: ₹${((dbRow.budget_min || 0) / 1000).toFixed(0)}K–₹${((dbRow.budget_max || 35000) / 1000).toFixed(0)}K`,
    ],
    is_published: isPublished,
    is_paused: isPaused,
    phone: ownerProfile?.phone || undefined,
    email: ownerProfile?.email || undefined,
    created_at: dbRow.created_at,
    updated_at: dbRow.updated_at,
  };
}

/** Convert frontend FlatmateProfile into Supabase `flatmate_profiles` columns */
export function mapAppFlatmateToDb(
  appData: Partial<FlatmateProfileInput | FlatmateProfile>
): Partial<SupabaseFlatmateProfile> {
  const mapped: Partial<SupabaseFlatmateProfile> = {};

  if (appData.avatar !== undefined) mapped.photo = appData.avatar;
  if (appData.age !== undefined) mapped.age = appData.age;
  if (appData.gender !== undefined) mapped.gender = mapAppGenderToDb(appData.gender);
  if (appData.occupation !== undefined) mapped.profession = appData.occupation;
  if (appData.city !== undefined) mapped.city = appData.city;
  if (appData.locality !== undefined) mapped.locality = appData.locality;
  if (appData.preferred_locations !== undefined) mapped.preferred_locations = appData.preferred_locations;
  if (appData.bio !== undefined) mapped.bio = appData.bio;
  if (appData.budget_min !== undefined) mapped.budget_min = appData.budget_min;
  if (appData.budget_max !== undefined) mapped.budget_max = appData.budget_max;
  if (appData.room_preference !== undefined) mapped.room_preference = mapAppRoomPrefToDb(appData.room_preference);
  if (appData.move_in_date !== undefined) mapped.move_in_date = appData.move_in_date;
  if (appData.lifestyle_preferences !== undefined) mapped.lifestyle_preferences = appData.lifestyle_preferences;

  if (appData.is_paused !== undefined || appData.is_published !== undefined) {
    mapped.status = mapAppStatusToDb(appData.is_published, appData.is_paused);
  }

  return mapped;
}

// ---------------------------------------------------------------------------
// Core Query Operations
// ---------------------------------------------------------------------------

/** Fetch all published flatmate profiles for discovery feed */
export async function getPublishedFlatmates(filter?: {
  city?: string;
  locality?: string;
  roomPreference?: string;
  budgetMax?: number;
  gender?: string;
}): Promise<FlatmateServiceResult<FlatmateProfile[]>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected', data: [] };
  }

  try {
    let query = supabase
      .from('flatmate_profiles')
      .select(`
        *,
        profiles:user_id (full_name, phone, email, profile_photo)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (filter?.city && filter.city !== 'ALL') {
      query = query.ilike('city', `%${filter.city}%`);
    }
    if (filter?.locality && filter.locality !== 'ALL') {
      query = query.ilike('locality', `%${filter.locality}%`);
    }
    if (filter?.roomPreference && filter.roomPreference !== 'Any') {
      query = query.eq('room_preference', mapAppRoomPrefToDb(filter.roomPreference));
    }
    if (filter?.budgetMax && filter.budgetMax > 0) {
      query = query.lte('budget_max', filter.budgetMax);
    }
    if (filter?.gender && filter.gender !== 'Any') {
      query = query.eq('gender', mapAppGenderToDb(filter.gender));
    }

    const { data, error } = await query;

    if (error) {
      return {
        success: false,
        error: getUserFriendlyFlatmateError(error, "Couldn't load flatmates."),
        data: [],
      };
    }

    const flatmates: FlatmateProfile[] = (data || []).map((row: any) =>
      mapSupabaseFlatmateToApp(row, row.profiles)
    );

    return { success: true, data: flatmates };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyFlatmateError(err, "Couldn't load flatmates."),
      data: [],
    };
  }
}

/** Fetch a single flatmate profile by ID or user_id */
export async function getFlatmateProfile(
  idOrUserId: string
): Promise<FlatmateServiceResult<FlatmateProfile>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    // Attempt match on profile id or user_id
    const { data, error } = await supabase
      .from('flatmate_profiles')
      .select(`
        *,
        profiles:user_id (full_name, phone, email, profile_photo)
      `)
      .or(`id.eq.${idOrUserId},user_id.eq.${idOrUserId}`)
      .single();

    if (error || !data) {
      return {
        success: false,
        error: getUserFriendlyFlatmateError(error, 'Flatmate profile not found.'),
      };
    }

    const profile = mapSupabaseFlatmateToApp(data, data.profiles);
    return { success: true, data: profile };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyFlatmateError(err, 'Flatmate profile not found.'),
    };
  }
}

/** Fetch flatmate profile belonging to a specific user */
export async function getMyFlatmateProfile(
  userId: string
): Promise<FlatmateServiceResult<FlatmateProfile | null>> {
  if (!isSupabaseConfigured() || !userId) {
    return { success: false, error: 'Database not connected', data: null };
  }

  try {
    const { data, error } = await supabase
      .from('flatmate_profiles')
      .select(`
        *,
        profiles:user_id (full_name, phone, email, profile_photo)
      `)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      return {
        success: false,
        error: getUserFriendlyFlatmateError(error, "Couldn't load your Flatmate Profile."),
        data: null,
      };
    }

    if (!data) {
      return { success: true, data: null };
    }

    const profile = mapSupabaseFlatmateToApp(data, data.profiles);
    return { success: true, data: profile };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyFlatmateError(err, "Couldn't load your Flatmate Profile."),
      data: null,
    };
  }
}

// ---------------------------------------------------------------------------
// Mutation Operations (Create, Update, Status, Delete, Photo)
// ---------------------------------------------------------------------------

/** Create a new Flatmate profile for the authenticated user */
export async function createFlatmateProfile(
  input: FlatmateProfileInput,
  photoUri?: string
): Promise<FlatmateServiceResult<FlatmateProfile>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    // 1. Enforce authenticated user
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData?.user?.id;

    if (!currentUserId) {
      return { success: false, error: 'You must be signed in to create a Flatmate Profile.' };
    }

    // 2. Upload photo if local file URI provided
    let photoUrl = input.avatar;
    if (photoUri && (photoUri.startsWith('file:') || photoUri.startsWith('blob:') || photoUri.startsWith('ph:') || photoUri.startsWith('content:'))) {
      const uploadRes = await uploadFlatmatePhoto(currentUserId, photoUri);
      if (uploadRes.success && uploadRes.data) {
        photoUrl = uploadRes.data;
      }
    }

    // 3. Prepare payload
    const dbPayload = mapAppFlatmateToDb({ ...input, avatar: photoUrl });
    dbPayload.user_id = currentUserId; // Strictly enforce authenticated user id
    dbPayload.status = 'published';

    // 4. Insert into flatmate_profiles
    const { data: createdRow, error: insertError } = await supabase
      .from('flatmate_profiles')
      .insert(dbPayload)
      .select(`
        *,
        profiles:user_id (full_name, phone, email, profile_photo)
      `)
      .single();

    if (insertError || !createdRow) {
      return {
        success: false,
        error: getUserFriendlyFlatmateError(insertError, "Couldn't create your Flatmate Profile."),
      };
    }

    const createdProfile = mapSupabaseFlatmateToApp(createdRow, createdRow.profiles);
    return { success: true, data: createdProfile };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyFlatmateError(err, "Couldn't create your Flatmate Profile."),
    };
  }
}

/** Update an existing Flatmate profile */
export async function updateFlatmateProfile(
  profileId: string,
  input: Partial<FlatmateProfileInput | FlatmateProfile>,
  photoUri?: string
): Promise<FlatmateServiceResult<FlatmateProfile>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData?.user?.id;

    // 1. Upload new photo if local URI provided
    let photoUrl = input.avatar;
    if (photoUri && currentUserId && (photoUri.startsWith('file:') || photoUri.startsWith('blob:') || photoUri.startsWith('ph:') || photoUri.startsWith('content:'))) {
      const uploadRes = await uploadFlatmatePhoto(currentUserId, photoUri);
      if (uploadRes.success && uploadRes.data) {
        photoUrl = uploadRes.data;
      }
    }

    const dbPayload = mapAppFlatmateToDb({
      ...input,
      ...(photoUrl ? { avatar: photoUrl } : {}),
    });

    const { data: updatedRow, error: updateError } = await supabase
      .from('flatmate_profiles')
      .update(dbPayload)
      .eq('id', profileId)
      .select(`
        *,
        profiles:user_id (full_name, phone, email, profile_photo)
      `)
      .single();

    if (updateError || !updatedRow) {
      return {
        success: false,
        error: getUserFriendlyFlatmateError(updateError, "Couldn't update your Flatmate Profile."),
      };
    }

    const updatedProfile = mapSupabaseFlatmateToApp(updatedRow, updatedRow.profiles);
    return { success: true, data: updatedProfile };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyFlatmateError(err, "Couldn't update your Flatmate Profile."),
    };
  }
}

/** Delete a flatmate profile */
export async function deleteFlatmateProfile(
  profileId: string
): Promise<FlatmateServiceResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { error } = await supabase
      .from('flatmate_profiles')
      .delete()
      .eq('id', profileId);

    if (error) {
      return {
        success: false,
        error: getUserFriendlyFlatmateError(error, "Couldn't delete your Flatmate Profile."),
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyFlatmateError(err, "Couldn't delete your Flatmate Profile."),
    };
  }
}

/** Publish a flatmate profile (status = 'published') */
export async function publishFlatmateProfile(
  profileId: string
): Promise<FlatmateServiceResult<FlatmateProfile>> {
  return updateFlatmateProfile(profileId, { is_published: true, is_paused: false });
}

/** Pause a flatmate profile (status = 'paused') */
export async function pauseFlatmateProfile(
  profileId: string
): Promise<FlatmateServiceResult<FlatmateProfile>> {
  return updateFlatmateProfile(profileId, { is_published: false, is_paused: true });
}

/** Resume a paused flatmate profile (status = 'published') */
export async function resumeFlatmateProfile(
  profileId: string
): Promise<FlatmateServiceResult<FlatmateProfile>> {
  return updateFlatmateProfile(profileId, { is_published: true, is_paused: false });
}

/** Upload a flatmate avatar photo to the `flatmate-images` storage bucket */
export async function uploadFlatmatePhoto(
  userId: string,
  uri: string
): Promise<FlatmateServiceResult<string>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const storagePath = `${userId}/${fileName}`;

    if (uri.startsWith('file:') || uri.startsWith('blob:') || uri.startsWith('ph:') || uri.startsWith('content:')) {
      const response = await fetch(uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from('flatmate-images')
        .upload(storagePath, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        return {
          success: false,
          error: getUserFriendlyFlatmateError(uploadError, "Couldn't upload the profile photo."),
        };
      }

      const { data: urlData } = supabase.storage
        .from('flatmate-images')
        .getPublicUrl(storagePath);

      return { success: true, data: urlData.publicUrl };
    }

    return { success: true, data: uri };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyFlatmateError(err, "Couldn't upload the profile photo."),
    };
  }
}
