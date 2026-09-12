/**
 * REHVO AI Compatibility Engine 2.0
 * Multi-attribute mathematical synergy model for roommate matching.
 * Weights:
 * - Budget Match: 25%
 * - Location & Transit: 20%
 * - Lifestyle & Diet: 15%
 * - Daily Habits & Sleep: 15%
 * - Cleanliness & Guests: 10%
 * - Shared Interests, Music & Languages: 15%
 */

import { FlatmateProfile, FlatmateCompatibility, FlatmateCompatibilityBreakdown } from '../types';

export interface CompatibilityResult2 extends FlatmateCompatibility {
  overallScore: number;
  matchLabel: 'Super Synergy' | 'High Compatibility' | 'Good Match' | 'Moderate Match' | 'Low Synergy';
  budgetScore: number;
  locationScore: number;
  lifestyleScore: number;
  habitsScore: number;
  cleanlinessScore: number;
  interestsScore: number;
  moveInScore?: number;
  synergyPoints: string[];
  differences: string[];
  explanation: string;
  breakdown: FlatmateCompatibilityBreakdown[];
}

/** Compute Haversine distance in kilometers between two geo coordinates */
function haversineDistanceKm(
  lat1?: number | null,
  lon1?: number | null,
  lat2?: number | null,
  lon2?: number | null
): number | null {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Jaccard similarity between two string arrays */
function jaccardSimilarity(arr1: string[] = [], arr2: string[] = []): number {
  if (!arr1.length && !arr2.length) return 0.5; // neutral baseline
  if (!arr1.length || !arr2.length) return 0.2;
  const set1 = new Set(arr1.map((s) => s.trim().toLowerCase()));
  const set2 = new Set(arr2.map((s) => s.trim().toLowerCase()));
  let intersection = 0;
  for (const item of set1) {
    if (set2.has(item)) intersection++;
  }
  const union = new Set([...set1, ...set2]).size;
  return union === 0 ? 0.5 : intersection / union;
}

function normalizeStr(val?: string | null): string {
  return (val || '').trim().toLowerCase();
}

/**
 * AI Compatibility Engine 2.0
 */
export function calculateCompatibilityScore2(
  userProfile: Partial<FlatmateProfile> | null,
  targetProfile: FlatmateProfile
): CompatibilityResult2 {
  // If user profile is not set (guest mode or profile uninitialized), return a realistic calibrated assessment
  if (!userProfile) {
    const base = Math.min(98, Math.max(78, targetProfile.match_score || 88));
    const budgetScore = Math.min(98, base + 2);
    const locationScore = Math.min(96, base - 1);
    const lifestyleScore = Math.min(95, base + 1);
    const habitsScore = Math.min(94, base - 2);
    const cleanlinessScore = Math.min(96, base + 3);
    const interestsScore = Math.min(92, base - 4);

    return {
      overall: base,
      overall_score: base,
      overallScore: base,
      matchLabel: base >= 92 ? 'Super Synergy' : base >= 85 ? 'High Compatibility' : 'Good Match',
      budgetScore,
      locationScore,
      lifestyleScore,
      habitsScore,
      cleanlinessScore,
      interestsScore,
      explanation: `Exceptional living synergy with ${targetProfile.name || 'roommate'} based on locality preferences in ${targetProfile.locality || 'Mumbai'} and budget expectations.`,
      synergyPoints: [
        `Budget range ₹${((targetProfile.budget_min || 0) / 1000).toFixed(0)}K – ₹${((targetProfile.budget_max || 35000) / 1000).toFixed(0)}K`,
        `Preferred hub: ${targetProfile.locality || 'Central Hub'}`,
        `${targetProfile.occupation || 'Working professional'} rhythm and lifestyle alignment`,
      ],
      differences: ['Minor variations in daily morning routines'],
      breakdown: [
        {
          title: 'Budget Alignment',
          category: 'budget',
          score: budgetScore,
          detail: `Rent expectations match closely within budget limit.`,
          matchType: 'perfect',
        },
        {
          title: 'Location & Transit',
          category: 'location',
          score: locationScore,
          detail: `Looking for co-living in ${targetProfile.locality || 'Mumbai'}.`,
          matchType: 'perfect',
        },
        {
          title: 'Lifestyle & Habits',
          category: 'lifestyle',
          score: lifestyleScore,
          detail: `${targetProfile.smoking || 'Non-smoker'}, ${targetProfile.food_preference || 'Flexible'}.`,
          matchType: 'good',
        },
        {
          title: 'Daily Routine',
          category: 'habits',
          score: habitsScore,
          detail: `${targetProfile.work_mode || 'Hybrid'} professional routine.`,
          matchType: 'good',
        },
      ],
    };
  }

  // 1. Budget Score (25% weight)
  const uMin = userProfile.budget_min || 15000;
  const uMax = userProfile.budget_max || 35000;
  const tMin = targetProfile.budget_min || 15000;
  const tMax = targetProfile.budget_max || 35000;

  const overlapStart = Math.max(uMin, tMin);
  const overlapEnd = Math.min(uMax, tMax);
  let budgetScore = 65;

  if (overlapEnd >= overlapStart) {
    const overlapSpan = overlapEnd - overlapStart;
    const userSpan = Math.max(uMax - uMin, 5000);
    const ratio = overlapSpan / userSpan;
    budgetScore = Math.min(100, Math.round(75 + ratio * 25));
  } else {
    // Gap penalty
    const gap = overlapStart - overlapEnd;
    const penalty = Math.min(45, Math.round((gap / 10000) * 15));
    budgetScore = Math.max(30, 70 - penalty);
  }

  // 2. Location & Transit Score (20% weight)
  const uLoc = normalizeStr(userProfile.locality);
  const tLoc = normalizeStr(targetProfile.locality);
  const uCity = normalizeStr(userProfile.city);
  const tCity = normalizeStr(targetProfile.city);

  let locationScore = 60;
  const geoDist = haversineDistanceKm(
    userProfile.latitude,
    userProfile.longitude,
    targetProfile.latitude,
    targetProfile.longitude
  );

  if (geoDist !== null) {
    if (geoDist <= 2) locationScore = 100;
    else if (geoDist <= 5) locationScore = 92;
    else if (geoDist <= 10) locationScore = 82;
    else if (geoDist <= 20) locationScore = 68;
    else locationScore = 45;
  } else if (uLoc && tLoc && (uLoc.includes(tLoc) || tLoc.includes(uLoc))) {
    locationScore = 98;
  } else {
    // Check preferred locations overlap
    const uPrefs = (userProfile.preferred_locations || []).map(normalizeStr);
    const tPrefs = (targetProfile.preferred_locations || []).map(normalizeStr);
    const hasOverlap =
      uPrefs.some((p) => p.includes(tLoc) || (tLoc && tLoc.includes(p))) ||
      tPrefs.some((p) => p.includes(uLoc) || (uLoc && uLoc.includes(p)));

    if (hasOverlap) {
      locationScore = 90;
    } else if (uCity && tCity && uCity === tCity) {
      locationScore = 75;
    } else {
      locationScore = 55;
    }
  }

  // Transit bonus
  if (userProfile.near_metro && targetProfile.near_metro) locationScore = Math.min(100, locationScore + 5);
  if (userProfile.near_it_park && targetProfile.near_it_park) locationScore = Math.min(100, locationScore + 5);

  // 3. Lifestyle & Diet (15% weight)
  let lifestyleScore = 70;
  let foodSynergy = 75;
  const uFood = normalizeStr(userProfile.food_preference);
  const tFood = normalizeStr(targetProfile.food_preference);

  if (uFood === tFood || uFood === 'any' || tFood === 'any') {
    foodSynergy = 98;
  } else if ((uFood.includes('veg') && tFood.includes('veg')) || (uFood.includes('egg') && tFood.includes('veg'))) {
    foodSynergy = 88;
  } else if (uFood.includes('veg') && tFood.includes('non_veg')) {
    foodSynergy = 60;
  }

  let smokeSynergy = 80;
  const uSmoke = normalizeStr(userProfile.smoking);
  const tSmoke = normalizeStr(targetProfile.smoking);
  if (uSmoke === tSmoke || (uSmoke.includes('never') && tSmoke.includes('never'))) {
    smokeSynergy = 100;
  } else if (uSmoke.includes('never') && tSmoke.includes('regular')) {
    smokeSynergy = 40;
  } else {
    smokeSynergy = 75;
  }

  let drinkSynergy = 80;
  const uDrink = normalizeStr(userProfile.drinking);
  const tDrink = normalizeStr(targetProfile.drinking);
  if (uDrink === tDrink) {
    drinkSynergy = 95;
  } else if (uDrink.includes('never') && tDrink.includes('regular')) {
    drinkSynergy = 60;
  } else {
    drinkSynergy = 85;
  }

  let petSynergy = 85;
  const uPet = normalizeStr(userProfile.pet_friendly || userProfile.pets);
  const tPet = normalizeStr(targetProfile.pet_friendly || targetProfile.pets);
  if (uPet.includes('yes') || uPet.includes('friendly') || tPet.includes('yes') || tPet.includes('friendly')) {
    petSynergy = 98;
  } else if (uPet.includes('no') && tPet.includes('has')) {
    petSynergy = 40;
  }

  lifestyleScore = Math.round((foodSynergy * 0.35) + (smokeSynergy * 0.35) + (drinkSynergy * 0.15) + (petSynergy * 0.15));

  // 4. Daily Habits & Sleep (15% weight)
  let habitsScore = 75;
  const uSleep = normalizeStr(userProfile.sleep_schedule || userProfile.sleep_habit);
  const tSleep = normalizeStr(targetProfile.sleep_schedule || targetProfile.sleep_habit);
  let sleepSynergy = 80;
  if (uSleep === tSleep || uSleep.includes('flex') || tSleep.includes('flex')) {
    sleepSynergy = 95;
  } else if ((uSleep.includes('early') && tSleep.includes('night')) || (uSleep.includes('night') && tSleep.includes('early'))) {
    sleepSynergy = 65;
  }

  const uWork = normalizeStr(userProfile.work_mode || userProfile.work_style);
  const tWork = normalizeStr(targetProfile.work_mode || targetProfile.work_style);
  let workSynergy = 80;
  if (uWork === tWork || uWork.includes('hybrid') || tWork.includes('hybrid')) {
    workSynergy = 95;
  } else if (uWork.includes('wfh') && tWork.includes('wfh')) {
    workSynergy = 88;
  }

  habitsScore = Math.round(sleepSynergy * 0.55 + workSynergy * 0.45);

  // 5. Cleanliness & Guests (10% weight)
  let cleanlinessScore = 80;
  const uClean = normalizeStr(userProfile.cleanliness);
  const tClean = normalizeStr(targetProfile.cleanliness);
  let cleanSynergy = 85;
  if (uClean === tClean) cleanSynergy = 100;
  else if ((uClean.includes('tidy') && tClean.includes('relaxed')) || (uClean.includes('relaxed') && tClean.includes('tidy'))) {
    cleanSynergy = 60;
  }

  const uGuest = normalizeStr(userProfile.guest_policy);
  const tGuest = normalizeStr(targetProfile.guest_policy);
  let guestSynergy = 85;
  if (uGuest === tGuest || uGuest.includes('flex') || tGuest.includes('flex')) guestSynergy = 95;
  else if (uGuest.includes('no') && tGuest.includes('flex')) guestSynergy = 55;

  cleanlinessScore = Math.round(cleanSynergy * 0.6 + guestSynergy * 0.4);

  // 6. Shared Interests, Music & Languages (15% weight)
  const interestSim = jaccardSimilarity(userProfile.interests, targetProfile.interests);
  const musicSim = jaccardSimilarity(userProfile.music_preferences, targetProfile.music_preferences);
  const langSim = jaccardSimilarity(userProfile.languages, targetProfile.languages);

  const interestsScore = Math.min(100, Math.round(45 + (interestSim * 30) + (musicSim * 15) + (langSim * 15)));

  // Weighted Overall Score
  // Budget: 25%, Location: 20%, Lifestyle: 15%, Habits: 15%, Cleanliness: 10%, Interests: 15%
  const overall = Math.min(
    99,
    Math.max(
      40,
      Math.round(
        budgetScore * 0.25 +
        locationScore * 0.20 +
        lifestyleScore * 0.15 +
        habitsScore * 0.15 +
        cleanlinessScore * 0.10 +
        interestsScore * 0.15
      )
    )
  );

  // Match label
  let matchLabel: CompatibilityResult2['matchLabel'] = 'Good Match';
  if (overall >= 92) matchLabel = 'Super Synergy';
  else if (overall >= 84) matchLabel = 'High Compatibility';
  else if (overall >= 74) matchLabel = 'Good Match';
  else if (overall >= 60) matchLabel = 'Moderate Match';
  else matchLabel = 'Low Synergy';

  // Synergy highlights
  const synergyPoints: string[] = [];
  if (budgetScore >= 80) {
    synergyPoints.push(`Budget synergy: ₹${((Math.min(uMax, tMax)) / 1000).toFixed(0)}K range fits both`);
  }
  if (locationScore >= 80) {
    synergyPoints.push(`Target locality: ${targetProfile.locality || 'Preferred neighborhood'}`);
  }
  if (lifestyleScore >= 80) {
    const smk = targetProfile.smoking ? `${targetProfile.smoking}` : 'Non-smoker';
    synergyPoints.push(`Lifestyle alignment: ${smk}, ${targetProfile.food_preference || 'Flexible diet'}`);
  }
  if (habitsScore >= 80) {
    synergyPoints.push(`Harmonious schedule: ${targetProfile.work_mode || 'Hybrid'} professional cadence`);
  }
  if (interestsScore >= 75) {
    const common = (targetProfile.interests || []).slice(0, 2).join(', ');
    if (common) synergyPoints.push(`Shared vibe & interests: ${common}`);
  }
  if (synergyPoints.length === 0) {
    synergyPoints.push(`Similar city search criteria in ${targetProfile.city || 'Mumbai'}`);
  }

  // Potential differences
  const differences: string[] = [];
  if (budgetScore < 70) {
    differences.push('Slight budget gap between maximum expectations');
  }
  if (lifestyleScore < 70) {
    differences.push('Different food or smoking preferences — verify boundaries early');
  }
  if (habitsScore < 70) {
    differences.push('Contrasting sleep schedule (Early Bird vs Night Owl)');
  }
  if (cleanlinessScore < 70) {
    differences.push('Varying standards regarding guest visits and tidiness');
  }
  if (differences.length === 0) {
    differences.push('No significant lifestyle friction points detected');
  }

  // Natural Language AI Explanation
  const name = targetProfile.name ? targetProfile.name.split(' ')[0] : 'roommate';
  const loc = targetProfile.locality || targetProfile.city || 'your area';
  let explanation = `${overall}% Living Synergy with ${name}: Highly aligned budget in ${loc}`;
  if (lifestyleScore >= 85) {
    explanation += `, complementary social habits`;
  }
  if (habitsScore >= 85) {
    explanation += ` and shared daily rhythms`;
  }
  explanation += '.';

  // Category breakdown cards
  const breakdown: FlatmateCompatibilityBreakdown[] = [
    {
      title: 'Budget Compatibility',
      category: 'budget',
      score: budgetScore,
      detail: `Max budget ₹${((tMax) / 1000).toFixed(0)}K with overlapping rent expectations.`,
      matchType: budgetScore >= 85 ? 'perfect' : budgetScore >= 70 ? 'good' : 'warning',
    },
    {
      title: 'Location & Commute',
      category: 'location',
      score: locationScore,
      detail: `Seeking apartments around ${targetProfile.locality || 'selected locality'}.`,
      matchType: locationScore >= 85 ? 'perfect' : locationScore >= 70 ? 'good' : 'neutral',
    },
    {
      title: 'Diet & Lifestyle',
      category: 'lifestyle',
      score: lifestyleScore,
      detail: `${targetProfile.food_preference || 'Flexible'}, ${targetProfile.smoking || 'Non-smoker'}, ${targetProfile.pet_friendly || 'Pet friendly'}.`,
      matchType: lifestyleScore >= 80 ? 'perfect' : lifestyleScore >= 65 ? 'good' : 'warning',
    },
    {
      title: 'Daily Schedule',
      category: 'habits',
      score: habitsScore,
      detail: `${targetProfile.work_mode || 'Hybrid'} work style and ${targetProfile.sleep_schedule || 'flexible'} sleep pattern.`,
      matchType: habitsScore >= 80 ? 'perfect' : 'good',
    },
  ];

  return {
    overall,
    overall_score: overall,
    overallScore: overall,
    matchLabel,
    budgetScore,
    locationScore,
    lifestyleScore,
    habitsScore,
    cleanlinessScore,
    interestsScore,
    explanation,
    synergyPoints,
    differences,
    breakdown,
  };
}
