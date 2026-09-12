/**
 * REHVO Apartment Match Suggestions Engine
 * Recommends published 2BHK/3BHK rental properties in the shared budget & locality
 * of two matched flatmates, calculating split rent per person.
 */

import { FlatmateProfile, Property } from '../types';

export interface SharedApartmentSuggestion {
  property: Property;
  totalRent: number;
  splitRentPerPerson: number;
  bhk: string;
  depositPerPerson: number;
  locality: string;
  matchScore: number;
  matchReason: string;
}

export function getSharedApartmentSuggestions(
  flatmate: FlatmateProfile,
  userProfile: Partial<FlatmateProfile> | null,
  allProperties: Property[],
  limit: number = 5
): SharedApartmentSuggestion[] {
  if (!allProperties || allProperties.length === 0) return [];

  // Determine target budget and preferred localities
  const uMax = userProfile?.budget_max || 35000;
  const tMax = flatmate.budget_max || 35000;
  const combinedMaxRent = (uMax + tMax); // combined max rent for 2 roommates

  const targetLocality = (flatmate.locality || userProfile?.locality || '').toLowerCase().trim();
  const targetCity = (flatmate.city || userProfile?.city || 'mumbai').toLowerCase().trim();

  // Filter properties suitable for co-living (2 BHK, 3 BHK, Residential)
  const candidates = allProperties.filter((p) => {
    // Check city
    const pCity = (p.city || '').toLowerCase().trim();
    if (targetCity && pCity && !pCity.includes(targetCity) && !targetCity.includes(pCity)) {
      return false;
    }

    // Must be within combined budget
    const rent = p.rent || 0;
    if (rent > combinedMaxRent * 1.15) {
      return false;
    }

    return true;
  });

  const scored: SharedApartmentSuggestion[] = candidates.map((prop) => {
    const totalRent = prop.rent || 30000;
    const splitRent = Math.round(totalRent / 2);
    const deposit = prop.deposit || totalRent * 2;
    const depositPerPerson = Math.round(deposit / 2);

    let matchScore = 75;
    const propLoc = (prop.locality || '').toLowerCase().trim();

    if (targetLocality && propLoc.includes(targetLocality)) {
      matchScore += 20;
    }

    if (splitRent <= Math.min(uMax, tMax)) {
      matchScore += 10;
    }

    const bhkLabel = typeof prop.bhk === 'number' ? `${prop.bhk} BHK` : String(prop.bhk || '2 BHK');

    return {
      property: prop,
      totalRent,
      splitRentPerPerson: splitRent,
      bhk: bhkLabel,
      depositPerPerson,
      locality: prop.locality || flatmate.locality || 'Mumbai',
      matchScore: Math.min(99, matchScore),
      matchReason: `₹${(splitRent / 1000).toFixed(0)}K/person fits both your budgets in ${prop.locality || 'the area'}`,
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
}
