import { createClient } from '@/lib/supabase/client';
import { FlatmateProfile } from '@/lib/types';

const supabase = createClient();

export interface FlatmateServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface FlatmateInput {
  name?: string;
  age?: number;
  gender?: 'male' | 'female' | 'any' | 'other';
  profession: string;
  city: string;
  locality: string;
  preferred_locations?: string[];
  bio?: string;
  budget_min?: number;
  budget_max: number;
  room_preference: 'private_room' | 'shared_room' | 'any';
  move_in_date: string;
  lifestyle_preferences?: string[];
}

/** Upload photo to 'flatmate-images' storage bucket */
export async function uploadFlatmatePhoto(
  userId: string,
  file: File
): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const storagePath = `${userId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('flatmate-images')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error || !data) {
      console.error('[uploadFlatmatePhoto] Error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('flatmate-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (err) {
    console.error('[uploadFlatmatePhoto] Exception:', err);
    return null;
  }
}

/** Fetch user's own flatmate profile */
export async function getMyFlatmateProfile(
  userId: string
): Promise<FlatmateServiceResult<FlatmateProfile | null>> {
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
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data: data as FlatmateProfile | null };
  } catch (err: any) {
    return { success: false, error: err.message, data: null };
  }
}

/** Fetch flatmate profile by ID */
export async function getFlatmateById(
  id: string
): Promise<FlatmateServiceResult<FlatmateProfile>> {
  try {
    const { data, error } = await supabase
      .from('flatmate_profiles')
      .select(`
        *,
        profiles:user_id (full_name, phone, email, profile_photo)
      `)
      .or(`id.eq.${id},user_id.eq.${id}`)
      .single();

    if (error || !data) {
      return { success: false, error: 'Flatmate profile not found.' };
    }

    return { success: true, data: data as FlatmateProfile };
  } catch (err: any) {
    return { success: false, error: err.message || 'Flatmate profile not found.' };
  }
}

/** Create new flatmate profile */
export async function createFlatmateProfile(
  userId: string,
  input: FlatmateInput,
  photoFile?: File | null
): Promise<FlatmateServiceResult<FlatmateProfile>> {
  try {
    let photoUrl: string | null = null;
    if (photoFile) {
      photoUrl = await uploadFlatmatePhoto(userId, photoFile);
    }

    const { data, error } = await supabase
      .from('flatmate_profiles')
      .insert({
        user_id: userId,
        photo: photoUrl,
        age: input.age || null,
        gender: input.gender || 'any',
        profession: input.profession.trim(),
        city: input.city.trim(),
        locality: input.locality.trim(),
        preferred_locations: input.preferred_locations || [],
        bio: input.bio?.trim() || null,
        budget_min: Number(input.budget_min || 0),
        budget_max: Number(input.budget_max),
        room_preference: input.room_preference,
        move_in_date: input.move_in_date,
        lifestyle_preferences: input.lifestyle_preferences || [],
        status: 'published',
      })
      .select(`
        *,
        profiles:user_id (full_name, phone, email, profile_photo)
      `)
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || 'Failed to create Flatmate profile.' };
    }

    return { success: true, data: data as FlatmateProfile };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create Flatmate profile.' };
  }
}

/** Update existing flatmate profile */
export async function updateFlatmateProfile(
  userId: string,
  input: Partial<FlatmateInput>,
  photoFile?: File | null
): Promise<FlatmateServiceResult<FlatmateProfile>> {
  try {
    let updatePayload: any = {
      ...input,
      updated_at: new Date().toISOString(),
    };

    if (photoFile) {
      const photoUrl = await uploadFlatmatePhoto(userId, photoFile);
      if (photoUrl) {
        updatePayload.photo = photoUrl;
      }
    }

    const { data, error } = await supabase
      .from('flatmate_profiles')
      .update(updatePayload)
      .eq('user_id', userId)
      .select(`
        *,
        profiles:user_id (full_name, phone, email, profile_photo)
      `)
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || 'Failed to update Flatmate profile.' };
    }

    return { success: true, data: data as FlatmateProfile };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update Flatmate profile.' };
  }
}

/** Pause / Resume flatmate profile */
export async function updateFlatmateStatus(
  userId: string,
  status: 'published' | 'paused'
): Promise<FlatmateServiceResult> {
  try {
    const { error } = await supabase
      .from('flatmate_profiles')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Delete flatmate profile */
export async function deleteFlatmateProfile(
  userId: string
): Promise<FlatmateServiceResult> {
  try {
    const { error } = await supabase
      .from('flatmate_profiles')
      .delete()
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
