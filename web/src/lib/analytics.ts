// REHVO V13.3 Production Analytics (Google Analytics 4 + Microsoft Clarity)
// GA4 Measurement ID: G-TN238M20RT (or process.env.NEXT_PUBLIC_GA_ID)
// Clarity Project ID: yi2c5nllws (or process.env.NEXT_PUBLIC_CLARITY_ID)
// Global Event Dispatcher & Reusable Event Helpers

import { sendGAEvent } from '@next/third-parties/google';

declare global {
  interface Window {
    dataLayer?: Object[];
    gtag?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-TN238M20RT';
export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_ID || 'yi2c5nllws';

export interface BasePropertyAnalyticsParams {
  propertyId?: string | number;
  city?: string;
  locality?: string;
  listingType?: string;
  rent?: number | string;
  bhk?: string | number;
  sourcePage?: string;
  [key: string]: any;
}

/**
 * Normalizes all event parameters according to REHVO V13 specification:
 * - propertyId
 * - city
 * - locality
 * - listingType
 * - rent
 * - bhk
 * - sourcePage
 */
export function buildStandardPayload(params: BasePropertyAnalyticsParams = {}): Record<string, any> {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  return {
    propertyId: params.propertyId !== undefined ? String(params.propertyId) : undefined,
    city: params.city || 'Mumbai',
    locality: params.locality || 'Mumbai',
    listingType: params.listingType || 'rent',
    rent:
      params.rent !== undefined
        ? typeof params.rent === 'number'
          ? params.rent
          : Number(params.rent) || params.rent
        : undefined,
    bhk: params.bhk !== undefined ? String(params.bhk) : undefined,
    sourcePage: params.sourcePage || currentPath,
    ...params,
  };
}

/**
 * Track Microsoft Clarity custom events and custom dimensions/tags
 * Safely fails gracefully if Clarity ID is missing or script is not loaded
 */
export function trackClarityEvent(name: string, payload?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  try {
    const clarity = window.clarity;
    if (typeof clarity === 'function') {
      // 1. Dispatch custom event to Microsoft Clarity
      clarity('event', name);

      // 2. Set key-value tags in Clarity for recording filtering and session segmentation
      if (payload && typeof payload === 'object') {
        Object.entries(payload).forEach(([key, val]) => {
          if (val !== undefined && val !== null && typeof val !== 'object') {
            clarity('set', `${name}_${key}`, String(val));
          }
        });
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[Clarity Track Error] ${name}:`, err);
    }
  }
}

/**
 * Generic event tracker that safely dispatches to gtag, dataLayer, Clarity, and @next/third-parties
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  try {
    // 1. Dispatch via window.gtag if available
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    } else if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...params });
    }

    // 2. Dispatch via @next/third-parties sendGAEvent
    try {
      sendGAEvent('event', eventName, params);
    } catch {
      // Ignore if not yet initialized
    }

    // 3. Dispatch via Microsoft Clarity
    trackClarityEvent(eventName, params);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[Track Error] ${eventName}:`, err);
    }
  }
}

/**
 * Track page view on route changes (supports GA4 Realtime, DebugView, and Microsoft Clarity)
 */
export function trackPageView(url: string, title?: string) {
  if (typeof window === 'undefined') return;

  const gaId = GA_MEASUREMENT_ID;

  try {
    const pageTitle = title || (typeof document !== 'undefined' ? document.title : '');
    const pageLocation = typeof window !== 'undefined' ? window.location.href : url;

    // GA4 config + page_view event
    if (gaId) {
      if (typeof window.gtag === 'function') {
        window.gtag('config', gaId, {
          page_path: url,
          page_location: pageLocation,
          page_title: pageTitle,
        });
        window.gtag('event', 'page_view', {
          page_path: url,
          page_location: pageLocation,
          page_title: pageTitle,
        });
      } else if (window.dataLayer && Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: 'page_view',
          page_path: url,
          page_location: pageLocation,
          page_title: pageTitle,
        });
      }

      try {
        sendGAEvent('event', 'page_view', {
          page_path: url,
          page_location: pageLocation,
          page_title: pageTitle,
        });
      } catch {
        // Ignore if not yet initialized
      }
    }

    // Microsoft Clarity SPA Route update
    const clarity = window.clarity;
    if (typeof clarity === 'function') {
      try {
        clarity('set', 'page_path', url);
        clarity('event', 'page_view');
      } catch {}
    }
  } catch (err) {
    console.debug('[PageView Error]:', err);
  }
}

/**
 * 1. Track property_view (Connected to GA4 & Microsoft Clarity)
 */
export function trackPropertyView(params: BasePropertyAnalyticsParams = {}) {
  const payload = buildStandardPayload(params);

  // Dispatch custom REHVO event
  trackEvent('property_view', payload);

  // Microsoft Clarity custom event
  trackClarityEvent('property_view', payload);

  // GA4 Ecommerce view_item
  trackEvent('view_item', {
    item_id: payload.propertyId,
    item_name: params.title || `Property ${payload.propertyId || ''}`,
    item_category: payload.listingType,
    item_location_id: payload.locality,
    city: payload.city,
    price: payload.rent,
    currency: 'INR',
    source_page: payload.sourcePage,
  });
}

/**
 * 2. Track search_performed (Connected to GA4 & Microsoft Clarity)
 */
export function trackSearchPerformed(
  params: {
    searchTerm?: string;
    resultsCount?: number;
  } & BasePropertyAnalyticsParams = {}
) {
  const payload = buildStandardPayload({
    search_term: params.searchTerm,
    results_count: params.resultsCount,
    ...params,
  });

  trackEvent('search_performed', payload);
  trackClarityEvent('search_performed', payload);

  trackEvent('search', {
    search_term: params.searchTerm || params.locality || 'all',
    results_count: params.resultsCount,
    source_page: payload.sourcePage,
  });
}

/**
 * 3. Track showreel_play (Connected to GA4 & Microsoft Clarity)
 */
export function trackShowreelPlay(
  params: {
    showreelId?: string | number;
    duration?: number;
  } & BasePropertyAnalyticsParams = {}
) {
  const payload = buildStandardPayload({
    showreel_id: params.showreelId ? String(params.showreelId) : undefined,
    duration: params.duration,
    ...params,
  });

  trackEvent('showreel_play', payload);
  trackClarityEvent('showreel_play', payload);
}

/**
 * 4. Track download_app
 */
export function trackDownloadApp(
  params: {
    source?: string;
    platform?: 'ios' | 'android' | 'web';
  } & BasePropertyAnalyticsParams = {}
) {
  const payload = buildStandardPayload({
    download_source: params.source || 'website_cta',
    platform: params.platform || 'web',
    ...params,
  });

  trackEvent('download_app', payload);
  trackClarityEvent('download_app', payload);
}

/**
 * 5. Track contact_owner (Connected to GA4 & Microsoft Clarity)
 */
export function trackContactOwner(
  params: {
    method?: 'whatsapp' | 'call' | 'chat';
  } & BasePropertyAnalyticsParams = {}
) {
  const payload = buildStandardPayload({
    contact_method: params.method || 'whatsapp',
    ...params,
  });

  trackEvent('contact_owner', payload);
  trackClarityEvent('contact_owner', payload);
}

/**
 * 6. Track schedule_visit (Connected to GA4 & Microsoft Clarity)
 */
export function trackScheduleVisit(
  params: {
    visitType?: 'physical' | 'video_walkthrough';
    date?: string;
    timeSlot?: string;
  } & BasePropertyAnalyticsParams = {}
) {
  const payload = buildStandardPayload({
    visit_type: params.visitType || 'physical',
    preferred_date: params.date,
    preferred_slot: params.timeSlot,
    ...params,
  });

  trackEvent('schedule_visit', payload);
  trackClarityEvent('schedule_visit', payload);
}

/**
 * 7. Track favorite_property (Connected to GA4 & Microsoft Clarity)
 */
export function trackFavoriteProperty(params: BasePropertyAnalyticsParams = {}) {
  const payload = buildStandardPayload(params);
  trackEvent('favorite_property', payload);
  trackClarityEvent('favorite_property', payload);
}

/**
 * 8. Track share_property (Connected to GA4 & Microsoft Clarity)
 */
export function trackShareProperty(
  params: {
    platform?: string;
  } & BasePropertyAnalyticsParams = {}
) {
  const payload = buildStandardPayload({
    share_platform: params.platform || 'clipboard',
    ...params,
  });

  trackEvent('share_property', payload);
  trackClarityEvent('share_property', payload);
}

/**
 * 9. Track submit_listing (Connected to GA4 & Microsoft Clarity)
 */
export function trackSubmitListing(
  params: {
    status?: 'draft' | 'completed' | 'in_review';
    propertyCategory?: string;
  } & BasePropertyAnalyticsParams = {}
) {
  const payload = buildStandardPayload({
    listing_status: params.status || 'completed',
    property_category: params.propertyCategory || 'flat',
    ...params,
  });

  trackEvent('submit_listing', payload);
  trackClarityEvent('submit_listing', payload);
}

/**
 * 10. Track login
 */
export function trackLogin(
  params: {
    method?: 'otp' | 'google' | 'phone' | 'email' | string;
    userId?: string;
  } & BasePropertyAnalyticsParams = {}
) {
  const payload = buildStandardPayload({
    method: params.method || 'otp',
    user_id: params.userId,
    ...params,
  });

  trackEvent('login', payload);
  trackClarityEvent('login', payload);
}

/**
 * 11. Track signup
 */
export function trackSignup(
  params: {
    method?: 'otp' | 'google' | 'phone' | 'email' | string;
    userRole?: 'tenant' | 'owner' | 'flatmate' | 'broker' | string;
    userId?: string;
  } & BasePropertyAnalyticsParams = {}
) {
  const payload = buildStandardPayload({
    method: params.method || 'otp',
    user_role: params.userRole || 'tenant',
    user_id: params.userId,
    ...params,
  });

  trackEvent('signup', payload);
  trackClarityEvent('signup', payload);
}
