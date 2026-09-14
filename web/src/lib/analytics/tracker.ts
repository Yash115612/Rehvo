// REHVO Production Analytics & Event Dispatcher
// Integrated with Google Analytics 4, Microsoft Clarity, and custom backend event bus

import {
  trackEvent as trackGAEvent,
  trackPropertyView as trackGAPropertyView,
  trackSearchPerformed,
  trackShowreelPlay,
  trackDownloadApp,
  trackContactOwner as trackGAContactOwner,
  trackScheduleVisit,
  trackFavoriteProperty,
  trackShareProperty,
  trackPageView,
  BasePropertyAnalyticsParams,
} from '../analytics';

export * from '../analytics';

declare global {
  interface Window {
    dataLayer?: Object[];
    gtag?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
  }
}

export interface AnalyticsEventParams {
  [key: string]: string | number | boolean | undefined | null;
}

/**
 * Dispatch generic custom event to GA4 and Clarity
 */
export function trackEvent(eventName: string, params?: AnalyticsEventParams) {
  if (typeof window === 'undefined') return;

  try {
    trackGAEvent(eventName, params || {});

    if (typeof window.clarity === 'function') {
      window.clarity('event', eventName);
    }
  } catch (err) {
    console.debug('[Analytics] Failed to track event:', eventName, err);
  }
}

/**
 * Track property view (supports both legacy object and new BasePropertyAnalyticsParams)
 */
export function trackPropertyView(property: {
  id?: string | number;
  propertyId?: string | number;
  title?: string;
  price?: number | string;
  rent?: number | string;
  locality?: string;
  city?: string;
  propertyType?: string;
  listingType?: string;
  bhk?: string | number;
  [key: string]: any;
}) {
  const pId = property.propertyId || property.id;
  const pRent = property.rent !== undefined ? property.rent : property.price;
  const pType = property.listingType || property.propertyType || 'rental_flat';

  trackGAPropertyView({
    propertyId: pId,
    locality: property.locality,
    city: property.city,
    bhk: property.bhk,
    rent: pRent,
    listingType: pType,
    title: property.title,
    ...property,
  });
}

/**
 * Track schedule visit booking click / submission
 */
export function trackVisitBooking(data: {
  propertyId: string | number;
  title?: string;
  visitType: 'physical' | 'video_walkthrough';
  preferredDate?: string;
  preferredSlot?: string;
  locality?: string;
  city?: string;
  bhk?: string | number;
  rent?: number | string;
  listingType?: string;
}) {
  trackScheduleVisit({
    propertyId: data.propertyId,
    visitType: data.visitType,
    date: data.preferredDate,
    timeSlot: data.preferredSlot,
    locality: data.locality,
    city: data.city,
    bhk: data.bhk,
    rent: data.rent,
    listingType: data.listingType,
    title: data.title,
  });
}

/**
 * Track contact owner / inquiry initiated
 */
export function trackContactOwner(
  propertyId: string | number,
  channel: 'whatsapp' | 'call' | 'chat',
  extra?: Partial<BasePropertyAnalyticsParams>
) {
  trackGAContactOwner({
    propertyId,
    method: channel,
    locality: extra?.locality,
    city: extra?.city,
    bhk: extra?.bhk,
    rent: extra?.rent,
    listingType: extra?.listingType,
    ...extra,
  });
}

/**
 * Track user search queries and filters
 */
export function trackSearch(query: string, resultsCount?: number, filters?: Record<string, any>) {
  trackSearchPerformed({
    searchTerm: query,
    resultsCount,
    locality: filters?.locality,
    city: filters?.city,
    bhk: filters?.bhk,
    rent: filters?.rent || filters?.maxPrice,
    listingType: filters?.listingType || filters?.type,
    ...filters,
  });
}

/**
 * Track AI Concierge search prompts
 */
export function trackAiSearch(prompt: string, category?: string) {
  trackEvent('ai_concierge_query', {
    prompt_length: prompt.length,
    category: category || 'general',
  });
}

/**
 * Track ShowReel vertical video interactions
 */
export function trackShowReelWatch(reelId: string | number, propertyId?: string | number, durationSec?: number) {
  trackShowreelPlay({
    showreelId: reelId,
    propertyId,
    duration: durationSec,
  });
}
