import { FlatmateProfile, FlatmateCompatibility, FlatmateCompatibilityBreakdown } from '../types';
import { calculateCompatibilityScore2, CompatibilityResult2 } from './flatmateCompatibility';

/**
 * Curated flatmates list.
 * In live mode, flatmate profiles are strictly fetched from live Supabase `flatmate_profiles` database table.
 */
export const CURATED_FLATMATES: FlatmateProfile[] = [];

export interface CompatibilityResult extends FlatmateCompatibility {
  overallScore: number;
  matchLabel: 'Perfect Match' | 'Great Match' | 'Good Match' | 'Average Match' | 'Low Match';
  budgetScore: number;
  locationScore: number;
  lifestyleScore: number;
  habitsScore: number;
  moveInScore: number;
  interestsScore: number;
  synergyPoints: string[];
}

export { calculateCompatibilityScore2 };

/**
 * AI Compatibility Engine 2.0 delegation wrapper
 */
export function calculateCompatibilityScore(
  userProfile: Partial<FlatmateProfile> | null,
  targetProfile: FlatmateProfile
): CompatibilityResult {
  const res = calculateCompatibilityScore2(userProfile, targetProfile);
  let label: CompatibilityResult['matchLabel'] = 'Good Match';
  if (res.overallScore >= 95) label = 'Perfect Match';
  else if (res.overallScore >= 88) label = 'Great Match';
  else if (res.overallScore >= 75) label = 'Good Match';
  else if (res.overallScore >= 60) label = 'Average Match';
  else label = 'Low Match';

  return {
    ...res,
    overallScore: res.overallScore,
    matchLabel: label,
    moveInScore: res.habitsScore,
  };
}

export function getMatchLabel(score: number): 'Perfect Match' | 'Great Match' | 'Good Match' | 'Average Match' | 'Low Match' {
  if (score >= 90) return 'Perfect Match';
  if (score >= 80) return 'Great Match';
  if (score >= 70) return 'Good Match';
  if (score >= 55) return 'Average Match';
  return 'Low Match';
}
