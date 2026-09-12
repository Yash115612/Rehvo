/**
 * REHVO Nearby & Transit Clustering Engine
 * Handles geo-clustering by locality, radius matching (2km/5km/10km),
 * and transit hub filtering (near metro stations, tech parks, colleges).
 */

import { FlatmateProfile } from '../types';

export interface LocalityCluster {
  locality: string;
  city: string;
  count: number;
  averageBudget: number;
  profiles: FlatmateProfile[];
}

/** Haversine formula to compute distance in km */
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
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

/** Filter profiles within a specified radius (km) from a central coordinate */
export function filterProfilesByRadius(
  profiles: FlatmateProfile[],
  centerLat: number,
  centerLon: number,
  radiusKm: number = 5
): FlatmateProfile[] {
  return profiles.filter((profile) => {
    if (profile.latitude == null || profile.longitude == null) {
      return true; // Keep profiles with missing coordinates rather than discarding
    }
    const dist = getDistanceKm(centerLat, centerLon, profile.latitude, profile.longitude);
    return dist <= radiusKm;
  });
}

/** Group flatmate profiles into locality clusters */
export function clusterProfilesByLocality(profiles: FlatmateProfile[]): LocalityCluster[] {
  const map = new Map<string, { city: string; profiles: FlatmateProfile[] }>();

  profiles.forEach((p) => {
    const loc = p.locality || p.city || 'Central';
    const city = p.city || 'Mumbai';
    const key = `${loc.toLowerCase()}::${city.toLowerCase()}`;

    if (!map.has(key)) {
      map.set(key, { city, profiles: [] });
    }
    map.get(key)!.profiles.push(p);
  });

  const clusters: LocalityCluster[] = [];
  map.forEach((val, key) => {
    const locName = key.split('::')[0];
    const totalBudget = val.profiles.reduce((sum, p) => sum + (p.budget_max || 25000), 0);
    const avgBudget = Math.round(totalBudget / val.profiles.length);

    clusters.push({
      locality: val.profiles[0].locality || locName,
      city: val.city,
      count: val.profiles.length,
      averageBudget: avgBudget,
      profiles: val.profiles,
    });
  });

  return clusters.sort((a, b) => b.count - a.count);
}

/** Filter profiles by proximity to key transit hubs */
export function filterProfilesByTransit(
  profiles: FlatmateProfile[],
  options: { nearMetro?: boolean; nearItPark?: boolean; nearCollege?: boolean }
): FlatmateProfile[] {
  return profiles.filter((p) => {
    if (options.nearMetro && !p.near_metro) return false;
    if (options.nearItPark && !p.near_it_park) return false;
    if (options.nearCollege && !p.near_college) return false;
    return true;
  });
}
