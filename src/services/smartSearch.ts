/**
 * REHVO AI Smart Search Engine
 * Natural Language Query Parser, Typo Correction, Categorized Autocomplete,
 * Advanced 45+ Filter Matching, and Supabase Persistence.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Property,
  AdvancedFilterPayload,
  SearchSuggestionItem,
  SearchHistoryRecord,
  SavedSearchRecord,
} from '../types';
import { getPublishedProperties } from './properties';

// -----------------------------------------------------------------------------
// 1. TYPO CORRECTION & FUZZY MATCH DICTIONARY
// -----------------------------------------------------------------------------

const TYPO_MAP: Record<string, string> = {
  // Localities
  bndra: 'Bandra',
  bandra: 'Bandra',
  bandrawest: 'Bandra West',
  powi: 'Powai',
  powaii: 'Powai',
  andhri: 'Andheri',
  andheri: 'Andheri',
  andherieast: 'Andheri East',
  andheriwest: 'Andheri West',
  wrli: 'Worli',
  worly: 'Worli',
  lowr: 'Lower',
  parel: 'Parel',
  lowerparel: 'Lower Parel',
  khar: 'Khar',
  kharwest: 'Khar West',
  jhu: 'Juhu',
  juhu: 'Juhu',
  gorgaon: 'Goregaon',
  gorgaoneast: 'Goregaon East',
  malad: 'Malad',
  dadar: 'Dadar',
  bkc: 'BKC',
  hiranandani: 'Hiranandani',

  // Unit configurations
  '1bkh': '1 BHK',
  '2bkh': '2 BHK',
  '3bkh': '3 BHK',
  '4bkh': '4 BHK',
  '1bhk': '1 BHK',
  '2bhk': '2 BHK',
  '3bhk': '3 BHK',
  '4bhk': '4 BHK',
  '1rk': '1 RK',
  studio: 'Studio',
  penthouse: 'Penthouse',
  villa: 'Villa',

  // Economics & Amenities
  furished: 'furnished',
  furnish: 'furnished',
  unfurnish: 'unfurnished',
  semifurnished: 'semi furnished',
  deposite: 'deposit',
  balcny: 'balcony',
  prking: 'parking',
  swim: 'swimming pool',
  pool: 'swimming pool',
  metr: 'metro',
};

export function correctQueryTypos(query: string): {
  correctedQuery: string;
  hasCorrection: boolean;
  suggestionPill?: string;
} {
  if (!query || !query.trim()) {
    return { correctedQuery: '', hasCorrection: false };
  }

  const words = query.trim().split(/\s+/);
  let hasCorrection = false;

  const correctedWords = words.map((w) => {
    const cleanWord = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (TYPO_MAP[cleanWord] && TYPO_MAP[cleanWord].toLowerCase() !== cleanWord) {
      hasCorrection = true;
      return TYPO_MAP[cleanWord];
    }
    return w;
  });

  const correctedQuery = correctedWords.join(' ');
  return {
    correctedQuery,
    hasCorrection,
    suggestionPill: hasCorrection ? correctedQuery : undefined,
  };
}

// -----------------------------------------------------------------------------
// 2. NATURAL LANGUAGE SEARCH PARSER
// -----------------------------------------------------------------------------

export interface ParsedNLPSearch {
  rawQuery: string;
  cleanQuery: string;
  parsedFilters: Partial<AdvancedFilterPayload>;
  detectedLocality?: string;
  detectedBhk?: string;
  detectedMaxBudget?: number;
  detectedMinBudget?: number;
  detectedZeroDeposit?: boolean;
  detectedZeroCommission?: boolean;
  detectedAmenities?: string[];
  detectedTenant?: string;
  summaryText: string;
}

export function parseNaturalLanguageQuery(inputQuery: string): ParsedNLPSearch {
  const { correctedQuery } = correctQueryTypos(inputQuery);
  const q = correctedQuery.toLowerCase();

  const parsedFilters: Partial<AdvancedFilterPayload> = {};
  const detectedAmenities: string[] = [];
  let detectedLocality: string | undefined;
  let detectedBhk: string | undefined;
  let detectedMaxBudget: number | undefined;
  let detectedMinBudget: number | undefined;
  let detectedZeroDeposit = false;
  let detectedZeroCommission = false;
  let detectedTenant: string | undefined;

  // 1. BHK Detection
  if (/\b(1\s*rk)\b/.test(q)) {
    detectedBhk = '1 RK';
    parsedFilters.bhk = ['1 RK'];
  } else if (/\b(1\s*bhk)\b/.test(q)) {
    detectedBhk = '1 BHK';
    parsedFilters.bhk = ['1 BHK'];
  } else if (/\b(2\s*bhk)\b/.test(q)) {
    detectedBhk = '2 BHK';
    parsedFilters.bhk = ['2 BHK'];
  } else if (/\b(3\s*bhk)\b/.test(q)) {
    detectedBhk = '3 BHK';
    parsedFilters.bhk = ['3 BHK'];
  } else if (/\b(4\s*bhk|4\+\s*bhk)\b/.test(q)) {
    detectedBhk = '4+ BHK';
    parsedFilters.bhk = ['4+ BHK'];
  }

  // 2. Budget Detection
  // Under / below XXk or XX000
  const underMatch = q.match(/(?:under|below|less than|<|within)\s*(?:₹|rs\.?|inr)?\s*(\d+)(k|l|lac|lakh)?/i);
  if (underMatch) {
    let amt = parseInt(underMatch[1], 10);
    const unit = underMatch[2]?.toLowerCase();
    if (unit === 'k') amt *= 1000;
    else if (unit === 'l' || unit === 'lac' || unit === 'lakh') amt *= 100000;
    else if (amt < 500) amt *= 1000; // e.g. "under 35" -> 35,000

    detectedMaxBudget = amt;
    parsedFilters.rent_max = amt;
  }

  // Range: "between 30k and 50k"
  const rangeMatch = q.match(/(?:between|from)\s*(\d+)(k)?\s*(?:to|and|-)\s*(\d+)(k)?/i);
  if (rangeMatch) {
    let min = parseInt(rangeMatch[1], 10);
    let max = parseInt(rangeMatch[3], 10);
    if (rangeMatch[2]?.toLowerCase() === 'k' || min < 500) min *= 1000;
    if (rangeMatch[4]?.toLowerCase() === 'k' || max < 500) max *= 1000;
    detectedMinBudget = min;
    detectedMaxBudget = max;
    parsedFilters.rent_min = min;
    parsedFilters.rent_max = max;
  }

  // 3. Economics: Zero Deposit / Verified Marketplace
  if (/\b(zero deposit|0 deposit|no deposit|without deposit)\b/.test(q)) {
    detectedZeroDeposit = true;
    parsedFilters.zero_deposit_only = true;
  }
  if (/\b(verified marketplace|verified listings|zero commission|no commission|owner direct|direct owner)\b/.test(q)) {
    detectedZeroCommission = true;
    parsedFilters.zero_commission_only = true;
  }

  // 4. Locality Detection
  const LOCALITY_CANDIDATES = [
    'bandra west', 'bandra east', 'bandra',
    'khar west', 'khar',
    'powai', 'hiranandani',
    'andheri west', 'andheri east', 'andheri',
    'worli', 'lower parel', 'parel',
    'juhu', 'santacruz',
    'goregaon east', 'goregaon west', 'goregaon',
    'malad west', 'malad',
    'bkc', 'dadar', 'colaba', 'thane', 'navi mumbai'
  ];

  for (const loc of LOCALITY_CANDIDATES) {
    if (q.includes(loc)) {
      detectedLocality = loc.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (loc === 'bkc') detectedLocality = 'BKC';
      break;
    }
  }

  // 5. Furnishing
  if (/\b(fully furnished|full furnished)\b/.test(q)) {
    parsedFilters.furnishing = 'FULLY_FURNISHED';
  } else if (/\b(semi furnished)\b/.test(q)) {
    parsedFilters.furnishing = 'SEMI_FURNISHED';
  } else if (/\b(unfurnished|raw flat)\b/.test(q)) {
    parsedFilters.furnishing = 'UNFURNISHED';
  }

  // 6. Amenities
  if (/\b(gym|fitness|workout)\b/.test(q)) {
    parsedFilters.gym = true;
    detectedAmenities.push('Gym');
  }
  if (/\b(pool|swimming)\b/.test(q)) {
    parsedFilters.swimming_pool = true;
    detectedAmenities.push('Swimming Pool');
  }
  if (/\b(parking|car park|garage)\b/.test(q)) {
    parsedFilters.covered_car_parking = true;
    detectedAmenities.push('Covered Parking');
  }
  if (/\b(balcony|terrace|sitout)\b/.test(q)) {
    parsedFilters.balconies = [1, 2, 3];
    detectedAmenities.push('Balcony');
  }
  if (/\b(lift|elevator)\b/.test(q)) {
    parsedFilters.lift = true;
    detectedAmenities.push('Lift');
  }
  if (/\b(ac|air conditioner|air conditioning)\b/.test(q)) {
    parsedFilters.has_ac = true;
    detectedAmenities.push('AC');
  }
  if (/\b(pet friendly|pets allowed|dogs allowed|cats allowed)\b/.test(q)) {
    parsedFilters.pet_friendly = true;
    detectedAmenities.push('Pet Friendly');
  }
  if (/\b(gated|gated society|secure society)\b/.test(q)) {
    parsedFilters.gated_society = true;
    detectedAmenities.push('Gated Society');
  }
  if (/\b(near metro|metro station|walking distance to metro)\b/.test(q)) {
    parsedFilters.near_metro_only = true;
    detectedAmenities.push('Near Metro');
  }

  // 7. Tenant Preferences
  if (/\b(bachelor|bachelors|students|single)\b/.test(q)) {
    detectedTenant = 'Bachelors';
    parsedFilters.tenant_types = ['BACHELOR', 'WORKING_PROFESSIONALS'];
  } else if (/\b(family|families)\b/.test(q)) {
    detectedTenant = 'Families';
    parsedFilters.tenant_types = ['FAMILY'];
  } else if (/\b(girls|female|women)\b/.test(q)) {
    detectedTenant = 'Girls Only';
    parsedFilters.tenant_types = ['GIRLS'];
  }

  // Summary generation
  const summaryParts: string[] = [];
  if (detectedBhk) summaryParts.push(detectedBhk);
  if (detectedLocality) summaryParts.push(`in ${detectedLocality}`);
  if (detectedMaxBudget) summaryParts.push(`under ₹${(detectedMaxBudget / 1000).toFixed(0)}k`);
  if (detectedZeroDeposit) summaryParts.push('Zero Deposit');
  if (detectedZeroCommission) summaryParts.push('Verified Listing');
  if (detectedAmenities.length) summaryParts.push(`with ${detectedAmenities.join(', ')}`);

  return {
    rawQuery: inputQuery,
    cleanQuery: correctedQuery,
    parsedFilters,
    detectedLocality,
    detectedBhk,
    detectedMaxBudget,
    detectedMinBudget,
    detectedZeroDeposit,
    detectedZeroCommission,
    detectedAmenities,
    detectedTenant,
    summaryText: summaryParts.length ? summaryParts.join(' • ') : correctedQuery,
  };
}

// -----------------------------------------------------------------------------
// 3. SEARCH SUGGESTIONS DATABASE (LOCALITIES, SOCIETIES, METROS, TECH PARKS)
// -----------------------------------------------------------------------------

const COMPREHENSIVE_SUGGESTIONS: SearchSuggestionItem[] = [
  // Localities
  { id: 'loc-1', title: 'Bandra West', subtitle: 'Prime Coastal Hub • Linking Rd, Bandstand', category: 'locality', locality: 'Bandra West', city: 'Mumbai', latitude: 19.0596, longitude: 72.8295 },
  { id: 'loc-2', title: 'Powai', subtitle: 'Hiranandani Gardens • Lake View High-Rises', category: 'locality', locality: 'Powai', city: 'Mumbai', latitude: 19.1176, longitude: 72.9060 },
  { id: 'loc-3', title: 'Andheri West', subtitle: 'Lokhandwala & Versova • Metro Line 1 & 2A', category: 'locality', locality: 'Andheri West', city: 'Mumbai', latitude: 19.1363, longitude: 72.8277 },
  { id: 'loc-4', title: 'Andheri East', subtitle: 'MIDC & SEEPZ Tech Corridor • Metro Nexus', category: 'locality', locality: 'Andheri East', city: 'Mumbai', latitude: 19.1136, longitude: 72.8697 },
  { id: 'loc-5', title: 'Worli', subtitle: 'Sea Face & Sea Link • Luxury Skyscrapers', category: 'locality', locality: 'Worli', city: 'Mumbai', latitude: 19.0178, longitude: 72.8181 },
  { id: 'loc-6', title: 'Lower Parel', subtitle: 'Financial District & High Street Phoenix', category: 'locality', locality: 'Lower Parel', city: 'Mumbai', latitude: 18.9953, longitude: 72.8300 },
  { id: 'loc-7', title: 'Khar West', subtitle: 'Leafy Suburb • Boutique Apartments', category: 'locality', locality: 'Khar West', city: 'Mumbai', latitude: 19.0700, longitude: 72.8339 },
  { id: 'loc-8', title: 'Juhu', subtitle: 'Beachfront Haven • Celebrities & Sea Breeze', category: 'locality', locality: 'Juhu', city: 'Mumbai', latitude: 19.1075, longitude: 72.8263 },
  { id: 'loc-9', title: 'Goregaon East', subtitle: 'Nesco IT Park & Oberoi Garden City', category: 'locality', locality: 'Goregaon East', city: 'Mumbai', latitude: 19.1663, longitude: 72.8526 },

  // Societies & High Rises
  { id: 'soc-1', title: 'Hiranandani Gardens', subtitle: 'European Architecture • Powai Lake', category: 'society', locality: 'Powai', city: 'Mumbai' },
  { id: 'soc-2', title: 'Oberoi Springs', subtitle: 'Luxury High-Rise • Andheri West', category: 'society', locality: 'Andheri West', city: 'Mumbai' },
  { id: 'soc-3', title: 'Lodha Park', subtitle: 'Trump Tower & 7-Acre Private Park • Worli', category: 'society', locality: 'Worli', city: 'Mumbai' },
  { id: 'soc-4', title: 'Rustomjee Elements', subtitle: 'Celebrity Address • Upper Juhu', category: 'society', locality: 'Juhu', city: 'Mumbai' },
  { id: 'soc-5', title: 'Godrej Platinum', subtitle: 'Eco Luxury High-Rise • Vikhroli', category: 'society', locality: 'Vikhroli East', city: 'Mumbai' },

  // Metro Stations
  { id: 'met-1', title: 'DN Nagar Metro Station', subtitle: 'Interchange: Line 1 (Blue) & Line 2A (Yellow)', category: 'metro', locality: 'Andheri West', city: 'Mumbai' },
  { id: 'met-2', title: 'Gundavali Metro Station', subtitle: 'Line 7 (Red) • Western Express Highway', category: 'metro', locality: 'Andheri East', city: 'Mumbai' },
  { id: 'met-3', title: 'Marol Naka Metro Station', subtitle: 'Line 1 & Underground Line 3 (Aqua Line)', category: 'metro', locality: 'Andheri East', city: 'Mumbai' },
  { id: 'met-4', title: 'Ghatkopar Metro Station', subtitle: 'Line 1 Terminal & Central Railway Junction', category: 'metro', locality: 'Ghatkopar East', city: 'Mumbai' },

  // Tech Parks & Offices
  { id: 'tp-1', title: 'BKC Commercial Complex', subtitle: 'Corporate Headquarters & Financial Hub', category: 'tech_park', locality: 'Bandra East', city: 'Mumbai' },
  { id: 'tp-2', title: 'Nesco IT Park', subtitle: 'Western Suburbs IT Campus • Goregaon East', category: 'tech_park', locality: 'Goregaon East', city: 'Mumbai' },
  { id: 'tp-3', title: 'Mindspace Malad', subtitle: '2 Million Sq.Ft Tech Hub • Link Road', category: 'tech_park', locality: 'Malad West', city: 'Mumbai' },
  { id: 'tp-4', title: 'One World Center', subtitle: 'Grade A Commercial Tower • Lower Parel', category: 'tech_park', locality: 'Lower Parel', city: 'Mumbai' },

  // Colleges
  { id: 'col-1', title: 'IIT Bombay', subtitle: 'Premier Technology Campus • Powai Lake', category: 'college', locality: 'Powai', city: 'Mumbai' },
  { id: 'col-2', title: 'NMIMS University', subtitle: 'Management & Technology • Vile Parle West', category: 'college', locality: 'Vile Parle West', city: 'Mumbai' },
  { id: 'col-3', title: 'St. Xavier\'s College', subtitle: 'Historic Heritage College • Fort', category: 'college', locality: 'Fort', city: 'Mumbai' },

  // Landmarks
  { id: 'lm-1', title: 'Bandra Bandstand', subtitle: 'Sea View Promenade & Jogger\'s Track', category: 'landmark', locality: 'Bandra West', city: 'Mumbai' },
  { id: 'lm-2', title: 'Juhu Beach', subtitle: 'Famous Coastal Strip & Food Street', category: 'landmark', locality: 'Juhu', city: 'Mumbai' },
  { id: 'lm-3', title: 'Worli Sea Face', subtitle: 'Bandra-Worli Sea Link Panorama', category: 'landmark', locality: 'Worli', city: 'Mumbai' },
  { id: 'lm-4', title: 'Phoenix Palladium', subtitle: 'Luxury Fashion & Dining Mall • Lower Parel', category: 'landmark', locality: 'Lower Parel', city: 'Mumbai' },
];

export function getSearchSuggestions(query: string): SearchSuggestionItem[] {
  if (!query || !query.trim()) {
    // Return trending default suggestions
    return COMPREHENSIVE_SUGGESTIONS.slice(0, 8);
  }

  const clean = query.trim().toLowerCase();
  const matched = COMPREHENSIVE_SUGGESTIONS.filter((s) => {
    return (
      s.title.toLowerCase().includes(clean) ||
      s.subtitle.toLowerCase().includes(clean) ||
      s.locality?.toLowerCase().includes(clean) ||
      s.category.toLowerCase().includes(clean)
    );
  });

  return matched.slice(0, 10);
}

// -----------------------------------------------------------------------------
// 4. ADVANCED 45+ FILTER PROPERTY SEARCH EXECUTION
// -----------------------------------------------------------------------------

export interface SmartSearchOptions {
  query?: string;
  filters?: Partial<AdvancedFilterPayload>;
  sortBy?: 'RECOMMENDED' | 'PRICE_ASC' | 'PRICE_DESC' | 'NEWEST' | 'VERIFIED' | 'WALK_SCORE';
  limit?: number;
  offset?: number;
  userId?: string;
}

export interface SmartSearchResult {
  properties: (Property & { aiMatchScore?: number; whyThisBadge?: string })[];
  totalCount: number;
  parsedQuery?: ParsedNLPSearch;
  didYouMean?: string;
}

export async function executeSmartSearch(
  options: SmartSearchOptions
): Promise<SmartSearchResult> {
  const { query = '', filters = {}, sortBy = 'RECOMMENDED', limit = 20, offset = 0, userId } = options;

  // 1. Natural language parsing and typo correction
  const nlp = parseNaturalLanguageQuery(query);
  const didYouMean = nlp.cleanQuery !== nlp.rawQuery ? nlp.cleanQuery : undefined;

  // Merge explicit filters with NLP detected filters (explicit overrides NLP)
  const mergedFilters: Partial<AdvancedFilterPayload> = {
    ...nlp.parsedFilters,
    ...filters,
  };

  // 2. Fetch base active properties from Supabase / Mock fallback
  const res = await getPublishedProperties();
  let properties = res.data || [];

  // 3. Filter Execution
  properties = properties.filter((prop) => {
    const rent = prop.rent || 0;
    const deposit = prop.deposit || rent * 2;

    // Rent bounds
    if (mergedFilters.rent_min !== undefined && rent < mergedFilters.rent_min) return false;
    if (mergedFilters.rent_max !== undefined && rent > mergedFilters.rent_max) return false;

    // Zero deposit
    if (mergedFilters.zero_deposit_only && deposit > rent) return false;

    // Verified listings
    if (mergedFilters.zero_commission_only && ((prop as any).commission || 0) > 0) return false;

    // BHK Configuration
    if (mergedFilters.bhk && mergedFilters.bhk.length > 0) {
      const matchBhk = mergedFilters.bhk.some((b) =>
        prop.bhk?.toLowerCase().includes(b.toLowerCase())
      );
      if (!matchBhk) return false;
    }

    // Locality / Query match
    if (nlp.detectedLocality) {
      const locTarget = `${prop.locality} ${prop.address} ${prop.city}`.toLowerCase();
      if (!locTarget.includes(nlp.detectedLocality.toLowerCase())) return false;
    } else if (query.trim() && !nlp.detectedBhk && !nlp.detectedMaxBudget) {
      // General text match
      const fullText = `${prop.title} ${prop.locality} ${prop.city} ${prop.address} ${prop.description}`.toLowerCase();
      const searchWords = nlp.cleanQuery.toLowerCase().split(/\s+/);
      const matchesText = searchWords.some((w) => fullText.includes(w));
      if (!matchesText) return false;
    }

    // Furnishing
    if (mergedFilters.furnishing && mergedFilters.furnishing !== 'ALL') {
      const furnishApp = prop.furnishing?.toUpperCase() || '';
      if (mergedFilters.furnishing === 'FULLY_FURNISHED' && !furnishApp.includes('FULLY')) return false;
      if (mergedFilters.furnishing === 'SEMI_FURNISHED' && !furnishApp.includes('SEMI')) return false;
      if (mergedFilters.furnishing === 'UNFURNISHED' && !furnishApp.includes('UNFURNISHED')) return false;
    }

    // Tenant types
    if (mergedFilters.tenant_types && mergedFilters.tenant_types.length > 0) {
      const propTenants = (prop.tenant_preferences || []).map((t) => t.toUpperCase());
      const matchedTenant = mergedFilters.tenant_types.some((t) => propTenants.includes(t));
      if (propTenants.length > 0 && !matchedTenant && !propTenants.includes('ANY')) return false;
    }

    // Pet friendly
    if (mergedFilters.pet_friendly) {
      const hasPetAmenity = prop.amenities?.some((a) => a.toLowerCase().includes('pet'));
      if (!hasPetAmenity && !prop.description?.toLowerCase().includes('pet')) return false;
    }

    // Amenities matching
    const amenities = prop.amenities || [];
    if (mergedFilters.gym && !amenities.some((a) => /gym|fitness/i.test(a))) return false;
    if (mergedFilters.swimming_pool && !amenities.some((a) => /pool|swimming/i.test(a))) return false;
    if (mergedFilters.lift && !amenities.some((a) => /lift|elevator/i.test(a))) return false;
    if (mergedFilters.covered_car_parking && !amenities.some((a) => /parking/i.test(a))) return false;
    if (mergedFilters.gated_society && !amenities.some((a) => /gated|security/i.test(a))) return false;

    // Owner verified
    if (mergedFilters.owner_verified_only && prop.verification_status !== 'VERIFIED') return false;

    return true;
  });

  // 4. Calculate AI Match Scores for each matched property
  const scoredProperties = properties.map((prop) => {
    let matchScore = 78; // Base quality threshold
    let whyBadge = 'Top Match';

    // Boost if verified
    if (prop.verification_status === 'VERIFIED') matchScore += 6;

    // Boost if zero deposit
    if ((prop.deposit || 0) <= prop.rent) {
      matchScore += 8;
      whyBadge = '0 Deposit Deal';
    }

    // Boost if matches locality exactly
    if (nlp.detectedLocality && prop.locality?.toLowerCase().includes(nlp.detectedLocality.toLowerCase())) {
      matchScore += 10;
      whyBadge = `Near ${nlp.detectedLocality}`;
    }

    // Boost if amenity matches
    if (nlp.detectedAmenities?.length) {
      matchScore += 5;
      whyBadge = `Has ${nlp.detectedAmenities[0]}`;
    }

    const clampedScore = Math.min(Math.max(matchScore, 65), 99);

    return {
      ...prop,
      aiMatchScore: clampedScore,
      whyThisBadge: whyBadge,
    };
  });

  // 5. Sorting
  scoredProperties.sort((a, b) => {
    switch (sortBy) {
      case 'PRICE_ASC':
        return (a.rent || 0) - (b.rent || 0);
      case 'PRICE_DESC':
        return (b.rent || 0) - (a.rent || 0);
      case 'NEWEST':
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case 'VERIFIED':
        return (b.verification_status === 'VERIFIED' ? 1 : 0) - (a.verification_status === 'VERIFIED' ? 1 : 0);
      case 'RECOMMENDED':
      default:
        return (b.aiMatchScore || 0) - (a.aiMatchScore || 0);
    }
  });

  const totalCount = scoredProperties.length;
  const paginated = scoredProperties.slice(offset, offset + limit);

  // Background logging
  if (query.trim()) {
    logSearchHistory(userId, query, mergedFilters, totalCount).catch(() => {});
  }

  return {
    properties: paginated,
    totalCount,
    parsedQuery: nlp,
    didYouMean,
  };
}

// -----------------------------------------------------------------------------
// 5. SUPABASE SEARCH HISTORY & SAVED SEARCHES
// -----------------------------------------------------------------------------

export async function logSearchHistory(
  userId?: string,
  queryText?: string,
  parsedFilters: Record<string, any> = {},
  resultsCount: number = 0
): Promise<void> {
  if (!isSupabaseConfigured() || !queryText?.trim()) return;

  try {
    const row = {
      user_id: userId && userId !== 'guest_user' ? userId : null,
      query_text: queryText.trim(),
      parsed_filters: parsedFilters,
      results_count: resultsCount,
      device_type: 'mobile',
    };

    Promise.resolve(
      supabase.from('search_history').insert(row)
    ).catch(() => {});
  } catch {
    // Non-blocking telemetry
  }
}

export async function getUserSearchHistory(userId?: string): Promise<SearchHistoryRecord[]> {
  if (!isSupabaseConfigured() || !userId || userId === 'guest_user') return [];

  try {
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) return [];
    return (data || []) as SearchHistoryRecord[];
  } catch {
    return [];
  }
}

export async function saveUserSearch(
  userId: string,
  name: string,
  filters: Partial<AdvancedFilterPayload>,
  notifyPush: boolean = true,
  notifyEmail: boolean = true
): Promise<{ success: boolean; data?: SavedSearchRecord; error?: string }> {
  if (!isSupabaseConfigured() || !userId || userId === 'guest_user') {
    return { success: true };
  }

  try {
    const row = {
      user_id: userId,
      name: name || 'Custom Mumbai Search',
      city: 'Mumbai',
      locality: filters.bhk?.join(', ') || 'All Localities',
      min_price: filters.rent_min || null,
      max_price: filters.rent_max || null,
      bhk_types: filters.bhk || [],
      furnishing: filters.furnishing || null,
      filters,
      is_active: true,
      notify_push: notifyPush,
      notify_email: notifyEmail,
    };

    const { data, error } = await supabase
      .from('saved_searches')
      .insert(row)
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as SavedSearchRecord };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save search' };
  }
}

export async function getUserSavedSearches(userId: string): Promise<SavedSearchRecord[]> {
  if (!isSupabaseConfigured() || !userId || userId === 'guest_user') return [];

  try {
    const { data, error } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) return [];
    return (data || []) as SavedSearchRecord[];
  } catch {
    return [];
  }
}

export async function deleteSavedSearch(id: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !id) return true;

  try {
    const { error } = await supabase.from('saved_searches').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export function getTrendingSearches(): string[] {
  return [
    '2 BHK near BKC under 45k',
    'Zero Deposit in Powai',
    'Sea Facing in Worli',
    'Pet Friendly in Bandra West',
    '1 BHK near Andheri Metro',
    'Direct Owner Furnished in Khar',
  ];
}
