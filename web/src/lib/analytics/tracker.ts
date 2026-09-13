// REHVO Production Analytics & Event Dispatcher
// Integrated with Google Analytics 4, Microsoft Clarity, and custom backend event bus

declare global {
  interface Window {
    dataLayer?: any[];
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
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }

    if (typeof window.clarity === 'function') {
      window.clarity('event', eventName);
    }
  } catch (err) {
    console.debug('[Analytics] Failed to track event:', eventName, err);
  }
}

/**
 * Track property view
 */
export function trackPropertyView(property: {
  id: string | number;
  title: string;
  price?: number | string;
  locality?: string;
  city?: string;
  propertyType?: string;
}) {
  trackEvent('view_item', {
    item_id: String(property.id),
    item_name: property.title,
    item_category: property.propertyType || 'rental_flat',
    item_location_id: property.locality,
    city: property.city || 'Mumbai',
    price: typeof property.price === 'number' ? property.price : undefined,
    currency: 'INR',
  });
}

/**
 * Track schedule visit booking click / submission
 */
export function trackVisitBooking(data: {
  propertyId: string | number;
  title: string;
  visitType: 'physical' | 'video_walkthrough';
  preferredDate?: string;
  preferredSlot?: string;
}) {
  trackEvent('schedule_visit', {
    item_id: String(data.propertyId),
    item_name: data.title,
    visit_type: data.visitType,
    preferred_date: data.preferredDate,
    preferred_slot: data.preferredSlot,
  });
}

/**
 * Track contact owner / inquiry initiated
 */
export function trackContactOwner(propertyId: string | number, channel: 'whatsapp' | 'call' | 'chat') {
  trackEvent('contact_owner', {
    item_id: String(propertyId),
    contact_channel: channel,
  });
}

/**
 * Track user search queries and filters
 */
export function trackSearch(query: string, resultsCount?: number, filters?: Record<string, any>) {
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount,
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
  trackEvent('showreel_watch', {
    reel_id: String(reelId),
    property_id: propertyId ? String(propertyId) : undefined,
    watch_duration: durationSec,
  });
}
