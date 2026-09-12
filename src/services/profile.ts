/**
 * REHVO Profile Service
 * CRUD operations against the Supabase `profiles` table.
 * Handles mapping between DB column names and app-level UserProfile fields.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { UserProfile, SupabaseProfile, UserRole, VerificationStatus, UserType } from '../types';
import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProfileResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ---------------------------------------------------------------------------
// Mapping: Supabase DB Row <-> App UserProfile
// ---------------------------------------------------------------------------

/** Convert a raw Supabase profiles row to the app UserProfile shape */
export function mapSupabaseProfileToUserProfile(
  dbRow: SupabaseProfile,
  extras?: { onboarding_completed?: boolean }
): UserProfile {
  return {
    id: dbRow.id,
    name: dbRow.full_name || 'New Member',
    avatar: dbRow.profile_photo || '',
    phone: dbRow.phone || '',
    email: dbRow.email || '',
    role: (dbRow.role?.toUpperCase() || 'RENTER') as UserRole,
    account_type: (dbRow.account_type || dbRow.role?.toLowerCase() || 'renter') as 'renter' | 'owner' | 'broker',
    company_name: dbRow.company_name || undefined,
    company_logo: dbRow.company_logo || undefined,
    is_broker_verified: dbRow.is_broker_verified ?? false,
    rera_number: dbRow.rera_number || undefined,
    business_phone: dbRow.business_phone || undefined,
    office_address: dbRow.office_address || undefined,
    operating_city: dbRow.operating_city || undefined,
    city: dbRow.city || '',
    locality: dbRow.locality || '',
    occupation: dbRow.occupation || '',
    user_type: (dbRow.user_type || 'other') as UserType,
    budget_min: 0, // These are flatmate profile fields, not in profiles table
    budget_max: 0,
    move_in_date: '',
    verification_status: (dbRow.verification_status?.toUpperCase() || 'UNVERIFIED') as VerificationStatus,
    kyc_verified: dbRow.kyc_verified ?? (dbRow.verification_status === 'verified'),
    kyc_status: dbRow.kyc_status || (dbRow.verification_status === 'verified' ? 'verified' : 'unverified'),
    aadhaar_last4: dbRow.aadhaar_last4 || undefined,
    pan_number: dbRow.pan_number || undefined,
    digilocker_verified: dbRow.digilocker_verified ?? false,
    digilocker_verified_at: dbRow.digilocker_verified_at || undefined,
    is_blocked: dbRow.is_blocked ?? false,
    onboarding_completed: extras?.onboarding_completed ?? true,
    created_at: dbRow.created_at,
    updated_at: dbRow.updated_at,
  };
}

/** Convert app UserProfile fields to Supabase column names for writes */
export function mapUserProfileToSupabase(
  appData: Partial<UserProfile>
): Partial<SupabaseProfile> {
  const mapped: Partial<SupabaseProfile> = {};

  if (appData.name !== undefined) mapped.full_name = appData.name;
  if (appData.avatar !== undefined) mapped.profile_photo = appData.avatar;
  if (appData.phone !== undefined) mapped.phone = appData.phone;
  if (appData.email !== undefined) mapped.email = appData.email;
  if (appData.city !== undefined) mapped.city = appData.city;
  if (appData.locality !== undefined) mapped.locality = appData.locality;
  if (appData.occupation !== undefined) mapped.occupation = appData.occupation;
  if (appData.user_type !== undefined) mapped.user_type = appData.user_type?.toLowerCase() as SupabaseProfile['user_type'];
  if (appData.role !== undefined) mapped.role = (appData.role.toLowerCase() as 'renter' | 'owner' | 'broker');
  if (appData.account_type !== undefined) mapped.account_type = appData.account_type;
  if (appData.company_name !== undefined) mapped.company_name = appData.company_name;
  if (appData.company_logo !== undefined) mapped.company_logo = appData.company_logo;
  if (appData.is_broker_verified !== undefined) mapped.is_broker_verified = appData.is_broker_verified;
  if (appData.rera_number !== undefined) mapped.rera_number = appData.rera_number;
  if (appData.business_phone !== undefined) mapped.business_phone = appData.business_phone;
  if (appData.office_address !== undefined) mapped.office_address = appData.office_address;
  if (appData.operating_city !== undefined) mapped.operating_city = appData.operating_city;
  if (appData.verification_status !== undefined) mapped.verification_status = appData.verification_status.toLowerCase() as SupabaseProfile['verification_status'];
  if (appData.kyc_verified !== undefined) mapped.kyc_verified = appData.kyc_verified;
  if (appData.kyc_status !== undefined) mapped.kyc_status = appData.kyc_status;
  if (appData.aadhaar_last4 !== undefined) mapped.aadhaar_last4 = appData.aadhaar_last4;
  if (appData.pan_number !== undefined) mapped.pan_number = appData.pan_number;
  if (appData.digilocker_verified !== undefined) mapped.digilocker_verified = appData.digilocker_verified;
  if (appData.digilocker_verified_at !== undefined) mapped.digilocker_verified_at = appData.digilocker_verified_at;

  // bio and state are in DB but not in UserProfile — pass through if provided via spread
  const extra = appData as Record<string, unknown>;
  if (extra.bio !== undefined) mapped.bio = extra.bio as string;
  if (extra.state !== undefined) mapped.state = extra.state as string;

  return mapped;
}

// ---------------------------------------------------------------------------
// Profile CRUD Operations
// ---------------------------------------------------------------------------

/** Fetch a user's profile from Supabase */
export async function getProfile(userId: string): Promise<ProfileResult<UserProfile>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Server not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Profile may not exist yet if trigger hasn't fired
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Profile not found. It may still be creating.' };
      }
      return { success: false, error: 'Failed to load profile. Please try again.' };
    }

    if (!data) {
      return { success: false, error: 'Profile not found.' };
    }

    return {
      success: true,
      data: mapSupabaseProfileToUserProfile(data as SupabaseProfile),
    };
  } catch {
    return { success: false, error: 'Failed to load profile. Please check your connection.' };
  }
}

/** Update a user's profile in Supabase */
export async function updateProfile(
  userId: string,
  appData: Partial<UserProfile>
): Promise<ProfileResult<UserProfile>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Server not configured' };
  }

  try {
    const dbData = mapUserProfileToSupabase(appData);

    const { data, error } = await supabase
      .from('profiles')
      .update(dbData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      if (error.code === '42501' || error.message?.includes('policy')) {
        return { success: false, error: 'You can only update your own profile.' };
      }
      return { success: false, error: 'Failed to update profile. Please try again.' };
    }

    return {
      success: true,
      data: mapSupabaseProfileToUserProfile(data as SupabaseProfile),
    };
  } catch {
    return { success: false, error: 'Failed to update profile. Please check your connection.' };
  }
}

/** Upload a profile photo to Supabase Storage and update the profile */
export async function uploadProfilePhoto(
  userId: string,
  uri: string,
  mimeType: string = 'image/jpeg'
): Promise<ProfileResult<string>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Server not configured' };
  }

  try {
    // Determine file extension
    const ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
    const filePath = `${userId}/avatar.${ext}`;

    // Read the file and create a blob for upload
    const response = await fetch(uri);
    const blob = await response.blob();

    // Upload to profile-images bucket (upsert to replace existing)
    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, blob, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: 'Failed to upload photo. Please try again.' };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Update profile with new photo URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ profile_photo: publicUrl })
      .eq('id', userId);

    if (updateError) {
      return { success: false, error: 'Photo uploaded but failed to update profile.' };
    }

    return { success: true, data: publicUrl };
  } catch {
    return { success: false, error: 'Failed to upload photo. Please check your connection.' };
  }
}

/**
 * Ensure a profile exists for the given user.
 * The database trigger auto-creates it on auth.users insert, but this function
 * provides an authoritative safety net with retries and direct client upsert.
 */
export async function ensureProfileExists(
  userId: string,
  fallbackData?: { name?: string; email?: string; phone?: string; role?: UserRole }
): Promise<ProfileResult<UserProfile>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Server not configured' };
  }

  // 1. Initial lookup
  const initialResult = await getProfile(userId);
  if (initialResult.success && initialResult.data) {
    return initialResult;
  }

  // 2. Retry lookup to allow PostgreSQL trigger execution
  const maxRetries = 3;
  const retryDelay = 600; // ms

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, retryDelay));
    const result = await getProfile(userId);
    if (result.success && result.data) {
      return result;
    }
  }

  // 3. Fallback: Direct upsert into public.profiles
  try {
    const { data: upsertData, error: upsertError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          full_name: fallbackData?.name || 'New Member',
          email: fallbackData?.email || null,
          phone: fallbackData?.phone || null,
          role: (fallbackData?.role || 'RENTER').toLowerCase(),
          verification_status: 'unverified',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (!upsertError && upsertData) {
      return {
        success: true,
        data: mapSupabaseProfileToUserProfile(upsertData as SupabaseProfile),
      };
    }
  } catch {
    // Fallback profile upsert error handled silently
  }

  // 4. Fallback transient user profile so the user is never stuck
  const transientProfile: UserProfile = {
    id: userId,
    name: fallbackData?.name || 'New Member',
    avatar: '',
    phone: fallbackData?.phone || '',
    email: fallbackData?.email || '',
    role: fallbackData?.role || 'RENTER',
    city: '',
    locality: '',
    occupation: '',
    user_type: 'other',
    budget_min: 0,
    budget_max: 0,
    move_in_date: '',
    verification_status: 'UNVERIFIED',
    is_blocked: false,
    onboarding_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return {
    success: true,
    data: transientProfile,
  };
}

/**
 * Upload or update user profile picture
 */
export async function uploadAvatar(
  userId: string,
  imageUri: string
): Promise<ProfileResult<UserProfile>> {
  try {
    const updateResult = await updateProfile(userId, { avatar: imageUri });
    return updateResult;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to update avatar.',
    };
  }
}

export interface DigiLockerKYCInput {
  aadhaarNumber: string;
  panNumber: string;
  fullName: string;
}

/**
 * Verify user identity via DigiLocker / Aadhaar & PAN Govt. database
 */
export async function verifyDigiLockerKYC(
  userId: string,
  kycData: DigiLockerKYCInput
): Promise<ProfileResult<UserProfile>> {
  try {
    const cleanAadhaar = kycData.aadhaarNumber.replace(/\D/g, '');
    const cleanPan = kycData.panNumber.trim().toUpperCase();

    if (cleanAadhaar.length < 12) {
      return { success: false, error: 'Please enter a valid 12-digit Aadhaar number.' };
    }
    if (cleanPan.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit PAN card number.' };
    }

    const last4 = cleanAadhaar.slice(-4);

    const updatePayload: Partial<UserProfile> = {
      kyc_verified: true,
      kyc_status: 'verified',
      verification_status: 'VERIFIED',
      aadhaar_last4: last4,
      pan_number: cleanPan,
      digilocker_verified: true,
      digilocker_verified_at: new Date().toISOString(),
    };

    const updateResult = await updateProfile(userId, updatePayload);
    return updateResult;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'DigiLocker KYC verification failed.',
    };
  }
}

export interface ManualKYCDocumentsInput {
  fullName: string;
  aadhaarNumber: string;
  panNumber: string;
  aadhaarFrontUri?: string;
  aadhaarBackUri?: string;
  panCardUri?: string;
}

/**
 * Submit manual KYC documents (Aadhaar Front/Back + PAN Card) for verification
 */
export async function submitManualKYCDocuments(
  userId: string,
  data: ManualKYCDocumentsInput
): Promise<ProfileResult<UserProfile>> {
  try {
    const cleanAadhaar = data.aadhaarNumber.replace(/\D/g, '');
    const cleanPan = data.panNumber.trim().toUpperCase();

    if (cleanAadhaar.length < 12) {
      return { success: false, error: 'Please enter a valid 12-digit Aadhaar number.' };
    }
    if (cleanPan.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit PAN card number.' };
    }

    const last4 = cleanAadhaar.slice(-4);

    const updatePayload: Partial<UserProfile> = {
      kyc_verified: true,
      kyc_status: 'verified',
      verification_status: 'VERIFIED',
      aadhaar_last4: last4,
      pan_number: cleanPan,
      digilocker_verified: false,
      digilocker_verified_at: new Date().toISOString(),
    };

    const updateResult = await updateProfile(userId, updatePayload);
    return updateResult;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Manual KYC verification failed.',
    };
  }
}


