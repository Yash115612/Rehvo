import { createClient } from '@/lib/supabase/client';
import { UserProfile } from '@/lib/types';

const supabase = createClient();

export interface ProfileServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Get user profile */
export async function getProfile(
  userId: string
): Promise<ProfileServiceResult<UserProfile>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || 'Profile not found.' };
    }

    return { success: true, data: data as UserProfile };
  } catch (err: any) {
    return { success: false, error: err.message || 'Profile not found.' };
  }
}

/** Upload avatar to 'profile-images' bucket */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}_avatar.${fileExt}`;
    const storagePath = `${userId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error || !data) {
      console.error('[uploadAvatar] Error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('profile-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (err) {
    console.error('[uploadAvatar] Exception:', err);
    return null;
  }
}

/** Update profile fields */
export async function updateProfile(
  userId: string,
  input: Partial<UserProfile>,
  avatarFile?: File | null
): Promise<ProfileServiceResult<UserProfile>> {
  try {
    let updatePayload: any = {
      ...input,
      updated_at: new Date().toISOString(),
    };

    if (avatarFile) {
      const avatarUrl = await uploadAvatar(userId, avatarFile);
      if (avatarUrl) {
        updatePayload.profile_photo = avatarUrl;
      }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', userId)
      .select()
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || 'Failed to update profile.' };
    }

    return { success: true, data: data as UserProfile };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update profile.' };
  }
}

/** Account deletion request */
export async function deleteAccount(
  userId: string
): Promise<ProfileServiceResult> {
  try {
    // Delete profile (cascades to all user data in DB via foreign keys)
    const { error } = await supabase.from('profiles').delete().eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    await supabase.auth.signOut();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
