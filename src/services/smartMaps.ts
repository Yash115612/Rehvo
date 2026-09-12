/**
 * REHVO Smart Maps 2.0 Service
 * Neighborhood Intelligence Scores, Commute Matrix Calculations,
 * 7 POI Commute Hub Overlays, and Rent Heatmap Data.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  LocalityScoreRecord,
  CommuteHubRecord,
  CommuteHubType,
  CommuteEstimate,
  Property,
} from '../types';

// -----------------------------------------------------------------------------
// 1. CURATED LOCALITY SCORES (FALLBACK & SEED DATA)
// -----------------------------------------------------------------------------

const FALLBACK_LOCALITY_SCORES: Record<string, LocalityScoreRecord> = {
  'bandra west': {
    id: 'score-bandra-w',
    locality: 'Bandra West',
    city: 'Mumbai',
    latitude: 19.0596,
    longitude: 72.8295,
    walk_score: 96,
    safety_score: 94,
    noise_score: 68,
    greenery_score: 78,
    nightlife_score: 98,
    family_friendly_score: 89,
    internet_quality_score: 98,
    water_supply_score: 95,
    average_rent_1bhk: 45000,
    average_rent_2bhk: 85000,
    average_rent_3bhk: 160000,
    description: 'Queen of suburbs with world-class cafes, coastal promenades, and vibrant lifestyle.',
  },
  'khar west': {
    id: 'score-khar-w',
    locality: 'Khar West',
    city: 'Mumbai',
    latitude: 19.0700,
    longitude: 72.8339,
    walk_score: 93,
    safety_score: 92,
    noise_score: 74,
    greenery_score: 80,
    nightlife_score: 92,
    family_friendly_score: 90,
    internet_quality_score: 96,
    water_supply_score: 94,
    average_rent_1bhk: 40000,
    average_rent_2bhk: 75000,
    average_rent_3bhk: 135000,
    description: 'Serene, leafy neighborhood right next to Bandra with premium boutique apartments.',
  },
  'powai': {
    id: 'score-powai',
    locality: 'Powai',
    city: 'Mumbai',
    latitude: 19.1176,
    longitude: 72.9060,
    walk_score: 89,
    safety_score: 96,
    noise_score: 85,
    greenery_score: 92,
    nightlife_score: 82,
    family_friendly_score: 95,
    internet_quality_score: 98,
    water_supply_score: 92,
    average_rent_1bhk: 38000,
    average_rent_2bhk: 68000,
    average_rent_3bhk: 110000,
    description: 'Planned European township overlooking Powai Lake, home to IIT Bombay & major tech MNCs.',
  },
  'andheri west': {
    id: 'score-andheri-w',
    locality: 'Andheri West',
    city: 'Mumbai',
    latitude: 19.1363,
    longitude: 72.8277,
    walk_score: 95,
    safety_score: 90,
    noise_score: 65,
    greenery_score: 72,
    nightlife_score: 95,
    family_friendly_score: 87,
    internet_quality_score: 97,
    water_supply_score: 90,
    average_rent_1bhk: 35000,
    average_rent_2bhk: 62000,
    average_rent_3bhk: 95000,
    description: 'Dynamic entertainment hub connected via Versova-Ghatkopar & Metro Line 2A.',
  },
  'andheri east': {
    id: 'score-andheri-e',
    locality: 'Andheri East',
    city: 'Mumbai',
    latitude: 19.1136,
    longitude: 72.8697,
    walk_score: 88,
    safety_score: 88,
    noise_score: 62,
    greenery_score: 70,
    nightlife_score: 78,
    family_friendly_score: 85,
    internet_quality_score: 95,
    water_supply_score: 92,
    average_rent_1bhk: 30000,
    average_rent_2bhk: 52000,
    average_rent_3bhk: 80000,
    description: 'Prime commercial nexus near MIDC, SEEPZ, Metro Line 1 & International Airport.',
  },
  'worli': {
    id: 'score-worli',
    locality: 'Worli',
    city: 'Mumbai',
    latitude: 19.0178,
    longitude: 72.8181,
    walk_score: 91,
    safety_score: 95,
    noise_score: 76,
    greenery_score: 84,
    nightlife_score: 90,
    family_friendly_score: 92,
    internet_quality_score: 99,
    water_supply_score: 96,
    average_rent_1bhk: 60000,
    average_rent_2bhk: 115000,
    average_rent_3bhk: 220000,
    description: 'Prestigious sea-facing luxury corridor with ultra-luxury sky villas and Sea Link access.',
  },
  'lower parel': {
    id: 'score-lower-parel',
    locality: 'Lower Parel',
    city: 'Mumbai',
    latitude: 18.9953,
    longitude: 72.8300,
    walk_score: 94,
    safety_score: 93,
    noise_score: 70,
    greenery_score: 70,
    nightlife_score: 96,
    family_friendly_score: 86,
    internet_quality_score: 99,
    water_supply_score: 94,
    average_rent_1bhk: 50000,
    average_rent_2bhk: 90000,
    average_rent_3bhk: 165000,
    description: 'Corporate financial district with high-end dining, Palladium Mall, and high-rise towers.',
  },
  'juhu': {
    id: 'score-juhu',
    locality: 'Juhu',
    city: 'Mumbai',
    latitude: 19.1075,
    longitude: 72.8263,
    walk_score: 90,
    safety_score: 93,
    noise_score: 72,
    greenery_score: 85,
    nightlife_score: 91,
    family_friendly_score: 91,
    internet_quality_score: 96,
    water_supply_score: 93,
    average_rent_1bhk: 55000,
    average_rent_2bhk: 95000,
    average_rent_3bhk: 180000,
    description: 'Iconic beachfront haven famous for celebrities, boutique bistros, and coastal luxury.',
  },
  'bkc': {
    id: 'score-bkc',
    locality: 'Bandra Kurla Complex (BKC)',
    city: 'Mumbai',
    latitude: 19.0657,
    longitude: 72.8687,
    walk_score: 88,
    safety_score: 98,
    noise_score: 74,
    greenery_score: 82,
    nightlife_score: 89,
    family_friendly_score: 88,
    internet_quality_score: 99,
    water_supply_score: 96,
    average_rent_1bhk: 50000,
    average_rent_2bhk: 90000,
    average_rent_3bhk: 170000,
    description: 'India\'s premier financial hub hosting global headquarters, consulate offices & gourmet dining.',
  },
};

// -----------------------------------------------------------------------------
// 2. CURATED COMMUTE HUBS (OVERLAYS)
// -----------------------------------------------------------------------------

export const CURATED_COMMUTE_HUBS: CommuteHubRecord[] = [
  // Offices
  { id: 'hub-off-1', name: 'BKC Commercial Complex', hub_type: 'office', city: 'Mumbai', locality: 'Bandra East', latitude: 19.0657, longitude: 72.8687, icon_name: 'Briefcase' },
  { id: 'hub-off-2', name: 'Nesco IT Park', hub_type: 'office', city: 'Mumbai', locality: 'Goregaon East', latitude: 19.1551, longitude: 72.8530, icon_name: 'Building2' },
  { id: 'hub-off-3', name: 'Mindspace Malad', hub_type: 'office', city: 'Mumbai', locality: 'Malad West', latitude: 19.1834, longitude: 72.8360, icon_name: 'Building2' },
  { id: 'hub-off-4', name: 'One World Center', hub_type: 'office', city: 'Mumbai', locality: 'Lower Parel', latitude: 18.9986, longitude: 72.8277, icon_name: 'Briefcase' },
  { id: 'hub-off-5', name: 'Hiranandani Business Park', hub_type: 'office', city: 'Mumbai', locality: 'Powai', latitude: 19.1197, longitude: 72.9051, icon_name: 'Building2' },

  // Metro Stations
  { id: 'hub-met-1', name: 'DN Nagar Metro (Line 1 & 2A)', hub_type: 'metro', city: 'Mumbai', locality: 'Andheri West', latitude: 19.1303, longitude: 72.8329, icon_name: 'Train' },
  { id: 'hub-met-2', name: 'Gundavali Metro (Line 7)', hub_type: 'metro', city: 'Mumbai', locality: 'Andheri East', latitude: 19.1172, longitude: 72.8596, icon_name: 'Train' },
  { id: 'hub-met-3', name: 'Marol Naka Metro (Line 1 & 3)', hub_type: 'metro', city: 'Mumbai', locality: 'Andheri East', latitude: 19.1102, longitude: 72.8872, icon_name: 'Train' },
  { id: 'hub-met-4', name: 'Ghatkopar Metro (Line 1)', hub_type: 'metro', city: 'Mumbai', locality: 'Ghatkopar East', latitude: 19.0856, longitude: 72.9080, icon_name: 'Train' },
  { id: 'hub-met-5', name: 'Lower Parel Monorail', hub_type: 'metro', city: 'Mumbai', locality: 'Lower Parel', latitude: 18.9950, longitude: 72.8310, icon_name: 'Train' },

  // Colleges
  { id: 'hub-col-1', name: 'IIT Bombay', hub_type: 'college', city: 'Mumbai', locality: 'Powai', latitude: 19.1334, longitude: 72.9133, icon_name: 'GraduationCap' },
  { id: 'hub-col-2', name: 'NMIMS University', hub_type: 'college', city: 'Mumbai', locality: 'Vile Parle West', latitude: 19.1032, longitude: 72.8373, icon_name: 'GraduationCap' },
  { id: 'hub-col-3', name: 'St. Xavier\'s College', hub_type: 'college', city: 'Mumbai', locality: 'Fort', latitude: 18.9431, longitude: 72.8316, icon_name: 'GraduationCap' },

  // Hospitals
  { id: 'hub-hosp-1', name: 'Lilavati Hospital & Research Centre', hub_type: 'hospital', city: 'Mumbai', locality: 'Bandra West', latitude: 19.0514, longitude: 72.8290, icon_name: 'HeartPulse' },
  { id: 'hub-hosp-2', name: 'Kokilaben Dhirubhai Ambani Hospital', hub_type: 'hospital', city: 'Mumbai', locality: 'Andheri West', latitude: 19.1317, longitude: 72.8252, icon_name: 'HeartPulse' },
  { id: 'hub-hosp-3', name: 'Hinduja Healthcare Surgical', hub_type: 'hospital', city: 'Mumbai', locality: 'Khar West', latitude: 19.0694, longitude: 72.8335, icon_name: 'HeartPulse' },

  // Gyms
  { id: 'hub-gym-1', name: 'Gold\'s Gym Bandra', hub_type: 'gym', city: 'Mumbai', locality: 'Bandra West', latitude: 19.0601, longitude: 72.8312, icon_name: 'Dumbbell' },
  { id: 'hub-gym-2', name: 'Cult.fit Powai Lake', hub_type: 'gym', city: 'Mumbai', locality: 'Powai', latitude: 19.1189, longitude: 72.9065, icon_name: 'Dumbbell' },

  // Groceries
  { id: 'hub-groc-1', name: 'Nature\'s Basket Pali Hill', hub_type: 'grocery', city: 'Mumbai', locality: 'Bandra West', latitude: 19.0625, longitude: 72.8298, icon_name: 'ShoppingBag' },
  { id: 'hub-groc-2', name: 'Foodhall Linking Road', hub_type: 'grocery', city: 'Mumbai', locality: 'Santacruz West', latitude: 19.0820, longitude: 72.8380, icon_name: 'ShoppingBag' },

  // Restaurants
  { id: 'hub-rest-1', name: 'Bastian Bandra', hub_type: 'restaurant', city: 'Mumbai', locality: 'Bandra West', latitude: 19.0605, longitude: 72.8340, icon_name: 'Utensils' },
  { id: 'hub-rest-2', name: 'The Clearing House', hub_type: 'restaurant', city: 'Mumbai', locality: 'Ballard Estate', latitude: 18.9325, longitude: 72.8400, icon_name: 'Utensils' },

  // Airports & Railways
  { id: 'hub-air-1', name: 'CSMIA Terminal 2', hub_type: 'airport', city: 'Mumbai', locality: 'Sahar', latitude: 19.0968, longitude: 72.8747, icon_name: 'Plane' },
  { id: 'hub-rail-1', name: 'Bandra Terminus', hub_type: 'railway', city: 'Mumbai', locality: 'Bandra East', latitude: 19.0620, longitude: 72.8407, icon_name: 'Navigation' },
];

// -----------------------------------------------------------------------------
// 3. HAVERSINE DISTANCE & COMMUTE CALCULATION
// -----------------------------------------------------------------------------

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function calculateCommute(
  fromLat: number,
  fromLng: number,
  toHub: CommuteHubRecord
): CommuteEstimate {
  const distKm = calculateDistanceKm(fromLat, fromLng, toHub.latitude, toHub.longitude);

  // Speed assumptions in Mumbai urban congestion:
  // Walking: ~4.5 km/h -> ~13.3 min/km
  const walkingMinutes = Math.max(Math.round(distKm * 13.3), 3);

  // Bike: ~22 km/h -> ~2.7 min/km + 2 min buffer
  const bikeMinutes = Math.max(Math.round(distKm * 2.7 + 2), 4);

  // Car: ~18 km/h in city traffic -> ~3.3 min/km + 5 min signal buffer
  const carMinutes = Math.max(Math.round(distKm * 3.3 + 5), 6);

  // Metro (if applicable): ~30 km/h + 6 min station walk/wait
  const metroMinutes = distKm < 20 ? Math.max(Math.round(distKm * 2.0 + 6), 8) : undefined;

  return {
    hubName: toHub.name,
    hubType: toHub.hub_type,
    distanceKm: distKm,
    walkingMinutes,
    bikeMinutes,
    carMinutes,
    metroMinutes,
  };
}

// -----------------------------------------------------------------------------
// 4. LOCALITY SCORES API (NEIGHBORHOOD INTELLIGENCE)
// -----------------------------------------------------------------------------

export async function getLocalityScores(
  locality: string = 'Bandra West',
  city: string = 'Mumbai'
): Promise<LocalityScoreRecord> {
  const key = locality.toLowerCase().trim();

  // 1. Check fallback dictionary first for instant response
  for (const [k, score] of Object.entries(FALLBACK_LOCALITY_SCORES)) {
    if (key.includes(k) || k.includes(key)) {
      return score;
    }
  }

  // 2. Fetch from Supabase if connected
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('locality_scores')
        .select('*')
        .ilike('locality', `%${locality}%`)
        .maybeSingle();

      if (!error && data) {
        return data as LocalityScoreRecord;
      }
    } catch {
      // Fall through to default
    }
  }

  // 3. Generic default score for Mumbai neighborhood
  return {
    id: `score-default-${locality}`,
    locality,
    city,
    latitude: 19.0760,
    longitude: 72.8777,
    walk_score: 88,
    safety_score: 91,
    noise_score: 72,
    greenery_score: 78,
    nightlife_score: 84,
    family_friendly_score: 90,
    internet_quality_score: 96,
    water_supply_score: 92,
    average_rent_1bhk: 35000,
    average_rent_2bhk: 65000,
    average_rent_3bhk: 105000,
    description: `Centrally positioned Mumbai neighborhood with complete social infrastructure and metro transit.`,
  };
}

// -----------------------------------------------------------------------------
// 5. NEARBY COMMUTE HUBS BY OVERLAY TYPE
// -----------------------------------------------------------------------------

export async function getNearbyCommuteHubs(
  lat: number = 19.0596,
  lng: number = 72.8295,
  radiusKm: number = 10,
  hubType?: CommuteHubType
): Promise<CommuteHubRecord[]> {
  // Try Supabase first
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('commute_hubs').select('*');
      if (hubType) {
        query = query.eq('hub_type', hubType);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const withDist = (data as CommuteHubRecord[])
          .map((h) => ({
            ...h,
            distanceKm: calculateDistanceKm(lat, lng, h.latitude, h.longitude),
          }))
          .filter((h) => h.distanceKm <= radiusKm)
          .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

        return withDist;
      }
    } catch {
      // Fallback
    }
  }

  // Fallback to curated dataset
  return CURATED_COMMUTE_HUBS
    .filter((h) => !hubType || h.hub_type === hubType)
    .map((h) => ({
      ...h,
      distanceKm: calculateDistanceKm(lat, lng, h.latitude, h.longitude),
    }))
    .filter((h) => h.distanceKm <= radiusKm)
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
}

// -----------------------------------------------------------------------------
// 6. RENT HEATMAP BUCKETS
// -----------------------------------------------------------------------------

export interface RentHeatmapPoint {
  id: string;
  latitude: number;
  longitude: number;
  rent: number;
  color: string;
  label: string;
  tier: 'affordable' | 'mid' | 'luxury';
}

export function getHeatMapData(properties: Property[]): RentHeatmapPoint[] {
  return properties.map((p, idx) => {
    const rent = p.rent || 35000;
    let color = '#10B981'; // Green: Affordable (< 35k)
    let tier: 'affordable' | 'mid' | 'luxury' = 'affordable';
    let label = 'Affordable (< ₹35k)';

    if (rent > 75000) {
      color = '#0F766E'; // Luxury Emerald / Purple (> 75k)
      tier = 'luxury';
      label = 'Luxury (> ₹75k)';
    } else if (rent >= 35000) {
      color = '#F59E0B'; // Amber: Mid-range (35k - 75k)
      tier = 'mid';
      label = 'Mid-Range (₹35k - ₹75k)';
    }

    // Default coords distributed around Mumbai center if missing
    const baseLat = p.latitude || 19.0596 + (idx % 5 - 2) * 0.015;
    const baseLng = p.longitude || 72.8295 + (idx % 4 - 2) * 0.012;

    return {
      id: p.id,
      latitude: baseLat,
      longitude: baseLng,
      rent,
      color,
      label,
      tier,
    };
  });
}
