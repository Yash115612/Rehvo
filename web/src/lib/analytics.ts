// REHVO Google Analytics 4 (GA4) Dispatcher & Event Helpers
// Exposes type-safe event tracking functions according to REHVO V13 specifications

import { sendGAEvent } from '@next/third-parties/google';

declare global {
  interface Window {
    dataLayer?: Object[];
    gtag?: (...args: any[]) => void;
  }
}

export interface BasePropertyAnalyticsParams {
  propertyId?: string | number;
  locality?: string;
  city?: string;
  bhk?: string | number;
  rent?: number | string;
  listingType?: string;
  [key: string]: any;
}

/**
 * Generic event tracker that safely dispatches to gtag, dataLayer, and @next/third-parties
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
      // Ignore if not initialized
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[GA4 Track Error] ${eventName}:`, err);
    }
  }
}

/**
 * Track page view on route changes
 */
export function trackPageView(url: string, title?: string) {
  if (typeof window === 'undefined') return;

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return;

  try {
    const pageTitle = title || (typeof document !== 'undefined' ? document.title : '');

    if (typeof window.gtag === 'function') {
      window.gtag('config', gaId, {
        page_path: url,
        page_location: window.location.href,
        page_title: pageTitle,
      });
      window.gtag('event', 'page_view', {
        page_path: url,
        page_location: window.location.href,
        page_title: pageTitle,
      });
    } else if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: url,
        page_location: window.location.href,
        page_title: pageTitle,
      });
    }

    try {
      sendGAEvent('event', 'page_view', {
        page_path: url,
        page_location: typeof window !== 'undefined' ? window.location.href : url,
        page_title: pageTitle,
      });
    } catch {
      // Ignore if not yet initialized
    }
  } catch (err) {
    console.debug('[GA4 PageView Error]:', err);
  }
}

/**
 * 1. Track property_view
 */
export function trackPropertyView(params: BasePropertyAnalyticsParams) {
  const payload = {
    propertyId: params.propertyId ? String(params.propertyId) : undefined,
    locality: params.locality || 'Unknown Locality',
    city: params.city || 'Mumbai',
    bhk: params.bhk !== undefined ? String(params.bhk) : undefined,
    rent: typeof params.rent === 'number' ? params.rent : Number(params.rent) || undefined,
    listingType: params.listingType || 'rent',
    ...params,
  };

  // Dispatch custom REHVO event
  trackEvent('property_view', payload);

  // Also dispatch standard GA4 Ecommerce view_item
  trackEvent('view_item', {
    item_id: payload.propertyId,
    item_name: params.title || `Property ${payload.propertyId}`,
    item_category: payload.listingType,
    item_location_id: payload.locality,
    city: payload.city,
    price: payload.rent,
    currency: 'INR',
  });
}

/**
 * 2. Track search_performed
 */
export function trackSearchPerformed(params: {
  searchTerm?: string;
  resultsCount?: number;
} & BasePropertyAnalyticsParams) {
  const payload = {
    search_term: params.searchTerm,
    results_count: params.resultsCount,
    propertyId: params.propertyId ? String(params.propertyId) : undefined,
    locality: params.locality,
    city: params.city,
    bhk: params.bhk !== undefined ? String(params.bhk) : undefined,
    rent: params.rent,
    listingType: params.listingType,
    ...params,
  };

  trackEvent('search_performed', payload);
  trackEvent('search', {
    search_term: params.searchTerm || params.locality || 'all',
    results_count: params.resultsCount,
  });
}

/**
 * 3. Track showreel_play
 */
export function trackShowreelPlay(params: {
  showreelId?: string | number;
  duration?: number;
} & BasePropertyAnalyticsParams) {
  const payload = {
    showreel_id: params.showreelId ? String(params.showreelId) : undefined,
    duration: params.duration,
    propertyId: params.propertyId ? String(params.propertyId) : undefined,
    locality: params.locality,
    city: params.city,
    bhk: params.bhk !== undefined ? String(params.bhk) : undefined,
    rent: params.rent,
    listingType: params.listingType,
    ...params,
  };

  trackEvent('showreel_play', payload);
}

/**
 * 4. Track download_app
 */
export function trackDownloadApp(params: {
  source?: string;
  platform?: 'ios' | 'android' | 'web';
} & BasePropertyAnalyticsParams = {}) {
  const payload = {
    source: params.source || 'website_cta',
    platform: params.platform || 'web',
    propertyId: params.propertyId ? String(params.propertyId) : undefined,
    locality: params.locality,
    city: params.city,
    bhk: params.bhk !== undefined ? String(params.bhk) : undefined,
    rent: params.rent,
    listingType: params.listingType,
    ...params,
  };

  trackEvent('download_app', payload);
}

/**
 * 5. Track contact_owner
 */
export function trackContactOwner(params: {
  method?: 'whatsapp' | 'call' | 'chat';
} & BasePropertyAnalyticsParams) {
  const payload = {
    contact_method: params.method || 'whatsapp',
    propertyId: params.propertyId ? String(params.propertyId) : undefined,
    locality: params.locality,
    city: params.city,
    bhk: params.bhk !== undefined ? String(params.bhk) : undefined,
    rent: params.rent,
    listingType: params.listingType,
    ...params,
  };

  trackEvent('contact_owner', payload);
}

/**
 * 6. Track schedule_visit
 */
export function trackScheduleVisit(params: {
  visitType?: 'physical' | 'video_walkthrough';
  date?: string;
  timeSlot?: string;
} & BasePropertyAnalyticsParams) {
  const payload = {
    visit_type: params.visitType || 'physical',
    preferred_date: params.date,
    preferred_slot: params.timeSlot,
    propertyId: params.propertyId ? String(params.propertyId) : undefined,
    locality: params.locality,
    city: params.city,
    bhk: params.bhk !== undefined ? String(params.bhk) : undefined,
    rent: params.rent,
    listingType: params.listingType,
    ...params,
  };

  trackEvent('schedule_visit', payload);
}

/**
 * 7. Track favorite_property
 */
export function trackFavoriteProperty(params: BasePropertyAnalyticsParams) {
  const payload = {
    propertyId: params.propertyId ? String(params.propertyId) : undefined,
    locality: params.locality,
    city: params.city,
    bhk: params.bhk !== undefined ? String(params.bhk) : undefined,
    rent: params.rent,
    listingType: params.listingType,
    ...params,
  };

  trackEvent('favorite_property', payload);
}

/**
 * 8. Track share_property
 */
export function trackShareProperty(params: {
  platform?: string;
} & BasePropertyAnalyticsParams) {
  const payload = {
    share_platform: params.platform || 'clipboard',
    propertyId: params.propertyId ? String(params.propertyId) : undefined,
    locality: params.locality,
    city: params.city,
    bhk: params.bhk !== undefined ? String(params.bhk) : undefined,
    rent: params.rent,
    listingType: params.listingType,
    ...params,
  };

  trackEvent('share_property', payload);
}
