import { supabase } from '../lib/supabase';
import { FeatureFlag, CmsAnnouncement, CmsBanner } from '../types';

export const getFeatureFlags = async (): Promise<FeatureFlag[]> => {
  try {
    const { data, error } = await supabase.from('feature_flags').select('*').order('key', { ascending: true });
    if (!error && data && data.length > 0) {
      return data as FeatureFlag[];
    }
    return [
      { key: 'biometric_auth_v72', enabled: true, description: 'Face ID & Fingerprint App Lock', rollout_percentage: 100 },
      { key: 'voice_search_ai', enabled: true, description: 'Multi-lingual Voice Property AI', rollout_percentage: 100 },
      { key: 'instant_rent_autopay', enabled: true, description: 'Zero-fee UPI AutoPay recurring mandate', rollout_percentage: 100 },
      { key: 'digital_agreement_signing', enabled: true, description: 'Legal e-Stamp Lease execution', rollout_percentage: 100 },
      { key: 'flashlist_optimization', enabled: true, description: 'High-FPS list virtualization', rollout_percentage: 100 },
    ];
  } catch {
    return [
      { key: 'biometric_auth_v72', enabled: true, description: 'Face ID & Fingerprint App Lock', rollout_percentage: 100 },
      { key: 'voice_search_ai', enabled: true, description: 'Multi-lingual Voice Property AI', rollout_percentage: 100 },
      { key: 'instant_rent_autopay', enabled: true, description: 'Zero-fee UPI AutoPay recurring mandate', rollout_percentage: 100 },
      { key: 'digital_agreement_signing', enabled: true, description: 'Legal e-Stamp Lease execution', rollout_percentage: 100 },
      { key: 'flashlist_optimization', enabled: true, description: 'High-FPS list virtualization', rollout_percentage: 100 },
    ];
  }
};

export const updateFeatureFlag = async (key: string, enabled: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('feature_flags')
      .update({ enabled, updated_at: new Date().toISOString() })
      .eq('key', key);
    return !error;
  } catch {
    return false;
  }
};

export const getCmsAnnouncements = async (
  audience: 'all' | 'renter' | 'owner' | 'broker' = 'all'
): Promise<CmsAnnouncement[]> => {
  try {
    const { data, error } = await supabase
      .from('cms_announcements')
      .select('*')
      .eq('is_active', true)
      .order('start_date', { ascending: false });

    if (!error && data) {
      return data as CmsAnnouncement[];
    }

    return [];
  } catch {
    return [];
  }
};

export const createCmsAnnouncement = async (
  announcement: Omit<CmsAnnouncement, 'id' | 'created_at'>
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('cms_announcements').insert({
      ...announcement,
      created_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
};

export const getCmsBanners = async (placement = 'home'): Promise<CmsBanner[]> => {
  try {
    const { data, error } = await supabase
      .from('cms_banners')
      .select('*')
      .eq('placement', placement)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && data) {
      return data as CmsBanner[];
    }

    return [];
  } catch {
    return [];
  }
};

export const togglePropertyApproval = async (
  propertyId: string,
  approved: boolean
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('properties')
      .update({
        is_verified: approved,
        status: approved ? 'AVAILABLE' : 'UNDER_REVIEW',
        updated_at: new Date().toISOString(),
      })
      .eq('id', propertyId);
    return !error;
  } catch {
    return false;
  }
};

export const toggleUserSuspension = async (
  userId: string,
  isSuspended: boolean
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        is_active: !isSuspended,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
    return !error;
  } catch {
    return false;
  }
};
