import { Platform, Linking } from 'react-native';
import { supabase } from '../lib/supabase';
import { AppVersionRecord, CampaignPopup } from '../types';

export const CURRENT_APP_VERSION = '9.0.0';

export interface VersionCheckResult {
  currentVersion: string;
  latestVersion: string;
  isUpdateAvailable: boolean;
  isForceUpdate: boolean;
  releaseNotes?: string;
  storeUrl?: string;
}

const compareVersions = (v1: string, v2: string): number => {
  const p1 = v1.split('.').map(Number);
  const p2 = v2.split('.').map(Number);
  for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
    const num1 = p1[i] || 0;
    const num2 = p2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
};

export const checkAppVersion = async (): Promise<VersionCheckResult> => {
  const currentPlatform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';

  try {
    const { data, error } = await supabase
      .from('app_versions')
      .select('*')
      .eq('platform', currentPlatform)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      const record = data as AppVersionRecord;
      const needsUpdate = compareVersions(record.latest_version, CURRENT_APP_VERSION) > 0;
      const isForce =
        record.force_update ||
        compareVersions(record.min_supported_version, CURRENT_APP_VERSION) > 0;

      return {
        currentVersion: CURRENT_APP_VERSION,
        latestVersion: record.latest_version,
        isUpdateAvailable: needsUpdate,
        isForceUpdate: isForce,
        releaseNotes: record.release_notes,
        storeUrl: record.store_url,
      };
    }
  } catch {
    // Failover
  }

  return {
    currentVersion: CURRENT_APP_VERSION,
    latestVersion: '9.0.0',
    isUpdateAvailable: false,
    isForceUpdate: false,
  };
};

export const openAppStore = async (storeUrl?: string): Promise<void> => {
  const defaultUrl =
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/app/rehvo/id123456789'
      : 'https://play.google.com/store/apps/details?id=com.rehvo.app';
  
  const url = storeUrl || defaultUrl;
  try {
    await Linking.openURL(url);
  } catch {
    // safe fallback
  }
};

export const getActiveCampaignPopup = async (): Promise<CampaignPopup | null> => {
  return {
    id: 'camp_v72_launch',
    title: 'Zero-Deposit Festival is Live!',
    message: 'Move into any verified home in Mumbai without paying 2-month rental security deposits.',
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    cta_label: 'Claim Zero Deposit Pass',
    cta_action: '/(renter)/rewards',
    is_active: true,
  };
};
