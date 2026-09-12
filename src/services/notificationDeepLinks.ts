// ==============================================================================
// REHVO V6.1 — NOTIFICATION DEEP LINKING ENGINE (PRODUCTION)
// Resolves notification payloads, data objects, and deep links into exact
// Expo Router paths for Renters, Owners, and Flatmates across Android, iOS, and Web.
// ==============================================================================

import { router } from 'expo-router';

export interface NotificationDeepLinkData {
  type?: string;
  category?: string;
  url?: string;
  deepLink?: string;
  conversationId?: string;
  conversation_id?: string;
  propertyId?: string;
  property_id?: string;
  visitId?: string;
  visit_id?: string;
  leadId?: string;
  lead_id?: string;
  flatmateId?: string;
  flatmate_id?: string;
  profileId?: string;
  profile_id?: string;
  noticeId?: string;
  notice_id?: string;
  amount?: number;
  [key: string]: any;
}

/**
 * Resolves any notification payload or data packet into a verified app route
 */
export function resolveNotificationDeepLink(
  data?: NotificationDeepLinkData | null
): string {
  if (!data) return '/(renter)/home';

  // 1. If explicit valid URL or deepLink is provided
  const explicitPath = data.deepLink || data.url;
  if (explicitPath && typeof explicitPath === 'string') {
    // Sanitize path
    let cleaned = explicitPath.trim();
    if (cleaned.startsWith('rehvo://')) {
      cleaned = cleaned.replace('rehvo://', '/');
    }
    // Convert shorthand links to full group routes
    if (cleaned.startsWith('/chat/')) {
      return `/(renter)/chat/${cleaned.replace('/chat/', '')}`;
    }
    if (cleaned.startsWith('/property/')) {
      return `/(renter)/property/${cleaned.replace('/property/', '')}`;
    }
    if (cleaned === '/visits' || cleaned === '/(renter)/visit/schedule') {
      return '/(renter)/visits';
    }
    if (cleaned === '/wallet') {
      return '/(renter)/wallet';
    }
    if (cleaned === '/rewards') {
      return '/(renter)/rewards';
    }
    if (cleaned === '/society') {
      return '/(renter)/society';
    }
    if (cleaned.startsWith('/flatmate/')) {
      const fid = cleaned.replace('/flatmate/', '');
      return fid ? `/(renter)/flatmate/compatibility/${fid}` : '/(renter)/flatmates';
    }
    if (cleaned === '/leads' || cleaned === '(owner)/leads') {
      return '/(owner)/leads';
    }
    if (cleaned.startsWith('/')) {
      return cleaned;
    }
    return `/${cleaned}`;
  }

  // 2. Identify by notification type / category
  const type = (data.type || data.category || '').toLowerCase();

  // CHAT
  if (
    type === 'chat_message' ||
    type === 'message' ||
    type === 'chat' ||
    type === 'enquiry'
  ) {
    const convId = data.conversationId || data.conversation_id;
    if (convId) {
      return `/(renter)/chat/${convId}`;
    }
    return '/(renter)/chat';
  }

  // PROPERTY & PRICE DROPS
  if (
    type === 'property_saved' ||
    type === 'price_drop' ||
    type === 'price' ||
    type === 'property_updates'
  ) {
    const propId = data.propertyId || data.property_id;
    if (propId) {
      return `/(renter)/property/${propId}`;
    }
    return '/(renter)/explore';
  }

  // VISITS & TOURS
  if (
    type === 'visit_booking' ||
    type === 'visit_reminder' ||
    type === 'visit' ||
    type === 'visits'
  ) {
    return '/(renter)/visits';
  }

  // WALLET & CASHBACK & PAYMENTS
  if (
    type === 'cashback' ||
    type === 'wallet_cashback' ||
    type === 'withdrawal' ||
    type === 'wallet'
  ) {
    return '/(renter)/wallet';
  }

  if (type === 'reward' || type === 'rewards' || type === 'reward_unlocked') {
    return '/(renter)/rewards';
  }

  if (type === 'rent_due' || type === 'pay_rent') {
    return '/(renter)/pay-rent';
  }

  // FLATMATES & VIBEMATCH
  if (
    type === 'flatmate_wave' ||
    type === 'flatmate_match' ||
    type === 'flatmates'
  ) {
    const fId = data.profileId || data.profile_id || data.flatmateId || data.flatmate_id;
    if (fId) {
      return `/(renter)/flatmate/compatibility/${fId}`;
    }
    return '/(renter)/flatmates';
  }

  // OWNER CRM & LEADS
  if (type === 'owner_lead' || type === 'lead') {
    return '/(owner)/leads';
  }

  if (type === 'rent_collection' || type === 'owner_rent') {
    return '/(owner)/rent-collection';
  }

  if (type === 'listing_approved' || type === 'listing_paused') {
    return '/(owner)/listings';
  }

  // SOCIETY & GATE PASSES
  if (
    type === 'delivery_arrived' ||
    type === 'visitor_arrived' ||
    type === 'society_notice' ||
    type === 'society'
  ) {
    if (type === 'society_notice') {
      return '/(renter)/society/notices';
    }
    return '/(renter)/society';
  }

  // UTILITIES & MAINTENANCE
  if (type === 'utility_due') {
    return '/(renter)/utilities';
  }

  if (type === 'maintenance_due' || type === 'maintenance') {
    return '/(renter)/maintenance';
  }

  // MOVE-IN CONCIERGE
  if (type === 'move_in_reminder' || type === 'checklist_reminder') {
    return '/(renter)/move-in';
  }

  return '/(renter)/notifications';
}

/**
 * Executes router navigation safely for any notification payload
 */
export function navigateToNotificationDestination(
  notificationOrData: any
): boolean {
  try {
    const data = notificationOrData?.data || notificationOrData;
    const path = resolveNotificationDeepLink(data);
    if (path) {
      router.push(path as any);
      return true;
    }
  } catch {
    // Fail silently without crashing the app
  }
  return false;
}
