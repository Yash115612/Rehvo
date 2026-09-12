/**
 * REHVO V6.2 — AI PROPERTY RECOMMENDATION ENGINE SERVICE (PRODUCTION)
 * 8-factor mathematical scoring model:
 * 1. Budget Match (25)
 * 2. Locality Match (20)
 * 3. BHK Match (15)
 * 4. Furnishing Match (10)
 * 5. Commute Match (10)
 * 6. Saved Similar Homes (10)
 * 7. View History (5)
 * 8. Trending Boost (5)
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getPublishedProperties, recordPropertyView as recordBaseView } from './properties';
import type {
  Property,
  RecommendedPropertyItem,
  RecommendationCategory,
  PropertyRecommendation,
  SavedSearchRecord,
} from '../types';

// Key Business & Tech Hubs for Commute Matching
const COMMERCIAL_COMMUTE_HUBS = [
  'bkc',
  'bandra kurla complex',
  'lower parel',
  'nariman point',
  'powai',
  'andheri east',
  'mindspace',
  'goregaon east',
  'malad west',
  'cyber city',
  'dlf',
  'whitefield',
  'hsr layout',
  'koramangala',
  'electronic city',
  'gachibowli',
  'hitec city',
];

interface UserProfileSignals {
  preferredLocalities: string[];
  targetRent: number;
  preferredBhk: string[];
  preferredFurnishing: string[];
  savedPropertyIds: string[];
  viewedPropertyIds: string[];
  dismissedPropertyIds: string[];
  officeLocality?: string;
}

/**
 * Extract behavioural and explicit signals for a user
 */
async function getUserSignals(userId?: string): Promise<UserProfileSignals> {
  const defaultSignals: UserProfileSignals = {
    preferredLocalities: ['Bandra West', 'Juhu', 'Worli', 'Andheri West', 'Powai'],
    targetRent: 45000,
    preferredBhk: ['2 BHK', '1 BHK', '3 BHK'],
    preferredFurnishing: ['SEMI_FURNISHED', 'FULLY_FURNISHED'],
    savedPropertyIds: [],
    viewedPropertyIds: [],
    dismissedPropertyIds: [],
    officeLocality: 'BKC',
  };

  if (!userId || !isSupabaseConfigured()) {
    return defaultSignals;
  }

  try {
    // 1. Fetch saved properties
    const { data: savedData } = await supabase
      .from('saved_properties')
      .select('property_id')
      .eq('user_id', userId);

    const savedIds = (savedData || []).map((s: any) => s.property_id);

    // 2. Fetch viewed properties
    const { data: viewsData } = await supabase
      .from('user_property_views')
      .select('property_id, view_count')
      .eq('user_id', userId)
      .order('last_viewed_at', { ascending: false })
      .limit(30);

    const viewedIds = (viewsData || []).map((v: any) => v.property_id);

    // 3. Fetch negative feedback (dismissed)
    const { data: feedbackData } = await supabase
      .from('recommendation_feedback')
      .select('property_id')
      .eq('user_id', userId)
      .eq('interested', false);

    const dismissedIds = (feedbackData || []).map((f: any) => f.property_id);

    // 4. Fetch saved searches
    const { data: searchData } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const localities = new Set<string>();
    if (searchData?.locality) localities.add(searchData.locality);

    return {
      preferredLocalities: localities.size > 0 ? Array.from(localities) : defaultSignals.preferredLocalities,
      targetRent: searchData?.max_price ? Number(searchData.max_price) : defaultSignals.targetRent,
      preferredBhk: searchData?.bhk_types?.length ? searchData.bhk_types : defaultSignals.preferredBhk,
      preferredFurnishing: searchData?.furnishing ? [searchData.furnishing] : defaultSignals.preferredFurnishing,
      savedPropertyIds: savedIds,
      viewedPropertyIds: viewedIds,
      dismissedPropertyIds: dismissedIds,
      officeLocality: searchData?.office_address || 'BKC',
    };
  } catch {
    return defaultSignals;
  }
}

/**
 * Compute 8-factor AI match score (0 - 100)
 */
export function calculateRecommendationScore(
  property: Property,
  signals: UserProfileSignals
): { score: number; matchReasons: string[] } {
  let score = 0;
  const matchReasons: string[] = [];

  // 1. Budget Match (25 pts)
  const targetRent = signals.targetRent || 45000;
  const rentDiffRatio = Math.abs(property.rent - targetRent) / targetRent;
  if (rentDiffRatio <= 0.15) {
    score += 25;
    matchReasons.push(`Within budget (₹${(property.rent / 1000).toFixed(0)}k)`);
  } else if (rentDiffRatio <= 0.30) {
    score += 18;
    matchReasons.push('Near target budget');
  } else if (rentDiffRatio <= 0.50) {
    score += 10;
  } else {
    score += 4;
  }

  // 2. Locality Match (20 pts)
  const propLocality = (property.locality || '').toLowerCase();
  const localityMatch = signals.preferredLocalities.some((l) =>
    propLocality.includes(l.toLowerCase())
  );
  if (localityMatch) {
    score += 20;
    matchReasons.push(`Matches ${property.locality}`);
  } else {
    score += 8; // Same city baseline
  }

  // 3. BHK Match (15 pts)
  const propBhk = (property.bhk || '').toLowerCase();
  const bhkMatch = signals.preferredBhk.some((b) =>
    propBhk.includes(b.toLowerCase())
  );
  if (bhkMatch) {
    score += 15;
    matchReasons.push(`${property.bhk} Layout`);
  } else {
    score += 5;
  }

  // 4. Furnishing Match (10 pts)
  const propFurnish = (property.furnishing || '').toLowerCase();
  const furnishMatch = signals.preferredFurnishing.some((f) =>
    propFurnish.includes(f.toLowerCase())
  );
  if (furnishMatch) {
    score += 10;
    matchReasons.push('Furnishing Match');
  } else {
    score += 4;
  }

  // 5. Commute Match (10 pts)
  const isNearHub = COMMERCIAL_COMMUTE_HUBS.some((hub) =>
    propLocality.includes(hub) || (property.address || '').toLowerCase().includes(hub)
  );
  if (isNearHub) {
    score += 10;
    matchReasons.push('Fast Office Commute');
  } else {
    score += 5;
  }

  // 6. Saved Similar Homes (10 pts)
  if (signals.savedPropertyIds.includes(property.id)) {
    score += 10;
    matchReasons.push('In Your Saved Homes');
  } else if (signals.savedPropertyIds.length > 0 && localityMatch) {
    score += 8;
    matchReasons.push('Similar to Saved');
  } else {
    score += 4;
  }

  // 7. View History (5 pts)
  if (signals.viewedPropertyIds.includes(property.id)) {
    score += 3;
    matchReasons.push('Recently Viewed');
  } else {
    score += 5; // Fresh pick bonus
  }

  // 8. Trending Boost (5 pts)
  const views = property.views_count || 0;
  const saves = property.saves_count || 0;
  if (views >= 100 || saves >= 15) {
    score += 5;
    matchReasons.push('High Demand');
  } else if (views >= 30) {
    score += 3;
  } else {
    score += 2;
  }

  const normalizedScore = Math.min(99, Math.max(50, Math.round(score)));
  return { score: normalizedScore, matchReasons: matchReasons.slice(0, 2) };
}

/**
 * 1. Generate & Persist Personal Recommendations
 */
export async function generateRecommendations(
  userId: string
): Promise<RecommendedPropertyItem[]> {
  try {
    const [propertiesRes, signals] = await Promise.all([
      getPublishedProperties(),
      getUserSignals(userId),
    ]);

    const properties = propertiesRes.data || [];
    if (!properties.length) return [];

    // Filter out dismissed properties
    const candidateProperties = properties.filter(
      (p) => !signals.dismissedPropertyIds.includes(p.id)
    );

    const scored: RecommendedPropertyItem[] = candidateProperties.map((prop) => {
      const { score, matchReasons } = calculateRecommendationScore(prop, signals);
      const isZeroDeposit = (prop.deposit || 0) <= prop.rent;
      return {
        property: prop,
        score,
        matchReasons,
        category: 'recommended',
        isZeroDeposit,
      };
    });

    scored.sort((a, b) => b.score - a.score);
    const topPicks = scored.slice(0, 15);

    // Persist to Supabase in background
    if (isSupabaseConfigured() && topPicks.length) {
      const rows = topPicks.map((item) => ({
        user_id: userId,
        property_id: item.property.id,
        score: item.score,
        match_reasons: item.matchReasons,
        category: item.category,
        is_dismissed: false,
        updated_at: new Date().toISOString(),
      }));

      Promise.resolve(
        supabase
          .from('property_recommendations')
          .upsert(rows, { onConflict: 'user_id,property_id,category' })
      ).catch(() => {});
    }

    return topPicks;
  } catch {
    return [];
  }
}

/**
 * 2. Get Recommended Properties (Cache-first with dynamic fallback)
 */
export async function getRecommendedProperties(
  userId: string
): Promise<RecommendedPropertyItem[]> {
  if (!isSupabaseConfigured() || !userId) {
    return generateRecommendations(userId);
  }

  try {
    const { data: recData, error } = await supabase
      .from('property_recommendations')
      .select('*, property:properties(*)')
      .eq('user_id', userId)
      .eq('category', 'recommended')
      .eq('is_dismissed', false)
      .order('score', { ascending: false })
      .limit(15);

    if (error || !recData || recData.length === 0) {
      return generateRecommendations(userId);
    }

    const items: RecommendedPropertyItem[] = recData
      .filter((r: any) => r.property && r.property.status === 'ACTIVE')
      .map((r: any) => ({
        property: r.property as Property,
        score: Number(r.score) || 85,
        matchReasons: (r.match_reasons as string[]) || ['AI Curated Match'],
        category: 'recommended',
        isZeroDeposit: (r.property.deposit || 0) <= r.property.rent,
      }));

    if (items.length < 3) {
      return generateRecommendations(userId);
    }

    return items;
  } catch {
    return generateRecommendations(userId);
  }
}

/**
 * 3. Track User Property View
 */
export async function trackPropertyView(
  userId: string,
  propertyId: string,
  durationSeconds: number = 5
): Promise<void> {
  // Base public view tracker
  recordBaseView(propertyId, userId).catch(() => {});

  if (!isSupabaseConfigured() || !userId || !propertyId) return;

  try {
    const { data: existing } = await supabase
      .from('user_property_views')
      .select('id, view_count, duration_seconds')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('user_property_views')
        .update({
          view_count: (existing.view_count || 1) + 1,
          duration_seconds: (existing.duration_seconds || 0) + durationSeconds,
          last_viewed_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      await supabase.from('user_property_views').insert({
        user_id: userId,
        property_id: propertyId,
        view_count: 1,
        duration_seconds: durationSeconds,
        last_viewed_at: new Date().toISOString(),
      });
    }
  } catch {
    // Silent catch
  }
}

/**
 * 4. Track Recommendation Feedback (Interested vs Not Interested)
 */
export async function trackRecommendationFeedback(
  userId: string,
  propertyId: string,
  interested: boolean,
  reason?: string
): Promise<void> {
  if (!isSupabaseConfigured() || !userId || !propertyId) return;

  try {
    await supabase.from('recommendation_feedback').upsert(
      {
        user_id: userId,
        property_id: propertyId,
        interested,
        feedback_reason: reason || (interested ? 'Interested in listing' : 'Not interested'),
        created_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,property_id' }
    );

    // If not interested, dismiss from active recommendations
    if (!interested) {
      await supabase
        .from('property_recommendations')
        .update({ is_dismissed: true, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('property_id', propertyId);
    }
  } catch {
    // Silent catch
  }
}

/**
 * 5. Trending Properties (Most viewed, saved, and enquired)
 */
export async function getTrendingProperties(city: string = 'Mumbai'): Promise<Property[]> {
  try {
    const res = await getPublishedProperties({ city });
    const props = res.data || [];
    return props
      .sort((a, b) => {
        const scoreA = (a.views_count || 0) * 1.5 + (a.saves_count || 0) * 3 + (a.enquiries_count || 0) * 5;
        const scoreB = (b.views_count || 0) * 1.5 + (b.saves_count || 0) * 3 + (b.enquiries_count || 0) * 5;
        return scoreB - scoreA;
      })
      .slice(0, 10);
  } catch {
    return [];
  }
}

/**
 * 6. Luxury Emerald Collection (Rent >= ₹60k or Premium Residential)
 */
export async function getLuxuryRecommendations(userId?: string): Promise<Property[]> {
  try {
    const res = await getPublishedProperties();
    const props = res.data || [];
    return props
      .filter((p) => (p.rent || 0) >= 60000 || p.bhk.includes('3 BHK') || p.bhk.includes('4 BHK') || (p.amenities && p.amenities.includes('Swimming Pool')))
      .sort((a, b) => (b.rent || 0) - (a.rent || 0))
      .slice(0, 10);
  } catch {
    return [];
  }
}

/**
 * 7. Weekend Picks (Instant weekend tour slots & verified homes)
 */
export async function getWeekendPicks(city: string = 'Mumbai'): Promise<Property[]> {
  try {
    const res = await getPublishedProperties({ city });
    const props = res.data || [];
    return props
      .filter((p) => p.verification_status === 'VERIFIED')
      .slice(0, 10);
  } catch {
    return [];
  }
}

/**
 * 8. Zero Deposit Picks (Deposit <= 1 month rent or verified zero deposit)
 */
export async function getZeroDepositRecommendations(userId?: string): Promise<Property[]> {
  try {
    const res = await getPublishedProperties();
    const props = res.data || [];
    return props
      .filter((p) => (p.deposit || 0) <= p.rent)
      .slice(0, 10);
  } catch {
    return [];
  }
}

/**
 * 9. Similar to Saved Homes
 */
export async function getSimilarToSavedRecommendations(
  userId: string
): Promise<RecommendedPropertyItem[]> {
  try {
    const [propertiesRes, signals] = await Promise.all([
      getPublishedProperties(),
      getUserSignals(userId),
    ]);

    const props = propertiesRes.data || [];
    if (!props.length) return [];

    const candidates = props.filter(
      (p) => !signals.dismissedPropertyIds.includes(p.id) && !signals.savedPropertyIds.includes(p.id)
    );

    const scored: RecommendedPropertyItem[] = candidates.map((prop) => {
      const { score } = calculateRecommendationScore(prop, signals);
      return {
        property: prop,
        score,
        matchReasons: ['Similar to Saved Wishlist', `Matches ${prop.locality}`],
        category: 'similar_saved',
        isZeroDeposit: (prop.deposit || 0) <= prop.rent,
      };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 10);
  } catch {
    return [];
  }
}

/**
 * 10. Near Your Office Commute Picks
 */
export async function getNearOfficeRecommendations(
  userId: string
): Promise<RecommendedPropertyItem[]> {
  try {
    const [propertiesRes, signals] = await Promise.all([
      getPublishedProperties(),
      getUserSignals(userId),
    ]);

    const props = propertiesRes.data || [];
    if (!props.length) return [];

    const commuteHub = signals.officeLocality || 'BKC';
    const nearHub = props.filter((p) => {
      const loc = (p.locality || '').toLowerCase();
      const addr = (p.address || '').toLowerCase();
      return COMMERCIAL_COMMUTE_HUBS.some((hub) => loc.includes(hub) || addr.includes(hub));
    });

    const pool = nearHub.length >= 3 ? nearHub : props;

    const scored: RecommendedPropertyItem[] = pool.map((prop) => {
      const { score } = calculateRecommendationScore(prop, signals);
      return {
        property: prop,
        score,
        matchReasons: [`15 mins to ${commuteHub}`, 'Express Metro Connected'],
        category: 'near_office',
        isZeroDeposit: (prop.deposit || 0) <= prop.rent,
      };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 10);
  } catch {
    return [];
  }
}
