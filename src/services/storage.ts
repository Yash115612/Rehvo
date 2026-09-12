/**
 * REHVO Storage Service
 * Multi-bucket media uploads, signed URLs, and file lifecycle management
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type StorageBucket =
  | 'property-images'
  | 'profile-images'
  | 'flatmate-images'
  | 'verification-documents'
  | 'chat-media'
  | 'flatmate-media'
  | 'verification-selfies'
  | 'agreements'
  | 'document-vault';

export interface StorageUploadResult {
  success: boolean;
  publicUrl?: string;
  signedUrl?: string;
  path?: string;
  error?: string;
}

/**
 * Universal upload helper for native and web environments
 */
export async function uploadFile(
  bucket: StorageBucket,
  fileUri: string,
  options: {
    folder?: string;
    customFileName?: string;
    contentType?: string;
    isPrivate?: boolean;
  } = {}
): Promise<StorageUploadResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Storage service is currently unavailable',
    };
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'anonymous';
    const folder = options.folder || userId;
    const fileExt = fileUri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = options.customFileName || `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Read file blob
    let fileBlob: Blob | ArrayBuffer;

    if (fileUri.startsWith('data:')) {
      const response = await fetch(fileUri);
      fileBlob = await response.blob();
    } else if (fileUri.startsWith('http://') || fileUri.startsWith('https://')) {
      const response = await fetch(fileUri);
      fileBlob = await response.blob();
    } else {
      // Local file URI on React Native
      const response = await fetch(fileUri);
      fileBlob = await response.blob();
    }

    const contentType = options.contentType || (fileExt === 'png' ? 'image/png' : 'image/jpeg');

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBlob, {
        contentType,
        upsert: true,
      });

    if (error) throw error;

    if (options.isPrivate) {
      // Create signed URL for private bucket
      const { data: signedData, error: signErr } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (signErr) throw signErr;

      return {
        success: true,
        signedUrl: signedData?.signedUrl,
        path: filePath,
      };
    } else {
      // Get public URL
      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        success: true,
        publicUrl: publicData.publicUrl,
        path: filePath,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'File upload failed. Please try again.',
    };
  }
}

/**
 * Generate a signed URL for private buckets (KYC, agreements, chat media)
 */
export async function getPrivateSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresInSeconds: number = 3600
): Promise<string | null> {
  if (!isSupabaseConfigured() || !path) return path || null;

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresInSeconds);

    if (error) throw error;
    return data?.signedUrl || null;
  } catch {
    return null;
  }
}

/**
 * Delete a file from storage bucket
 */
export async function deleteStorageFile(
  bucket: StorageBucket,
  path: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;

  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
    return true;
  } catch {
    return false;
  }
}
