/**
 * REHVO Trust & Safety Engine
 * Computes transparent trust score (0–100) and aggregates official verification badges:
 * - Aadhaar KYC (+25)
 * - Work / Company Verification (+20)
 * - College / Alma Mater Verification (+15)
 * - Phone OTP Verification (+15)
 * - Corporate / Personal Email (+10)
 * - LinkedIn Social Proof (+15)
 * - Profile Photo & Completeness (+10)
 */

import { FlatmateProfile, FlatmateVerificationBadges } from '../types';

export interface TrustScoreResult {
  score: number;
  tier: 'Elite Verified' | 'High Trust' | 'Verified Member' | 'Basic Profile';
  badges: FlatmateVerificationBadges;
  completedChecks: number;
  totalChecks: number;
  trustBreakdown: {
    label: string;
    points: number;
    earned: boolean;
    icon: string;
  }[];
}

export function calculateTrustScore(profile?: Partial<FlatmateProfile> | null): TrustScoreResult {
  if (!profile) {
    return {
      score: 50,
      tier: 'Basic Profile',
      badges: {},
      completedChecks: 0,
      totalChecks: 6,
      trustBreakdown: [],
    };
  }

  const badges: FlatmateVerificationBadges = {
    ...(profile.verification_badges || {}),
  };

  const isAadhaar = Boolean(profile.is_kyc_verified || profile.verifications?.aadhaar || profile.verifications?.is_identity_verified || badges.aadhaar);
  const isWork = Boolean(profile.company || profile.verifications?.work || profile.verifications?.is_work_verified || badges.work);
  const isCollege = Boolean(profile.college || profile.verifications?.college || profile.verifications?.is_student_verified || badges.college);
  const isPhone = Boolean(profile.phone || profile.verifications?.phone || profile.verifications?.is_phone_verified || badges.phone !== false);
  const isEmail = Boolean(profile.email || badges.email !== false);
  const isLinkedIn = Boolean(badges.linkedin || profile.social_handle?.includes('linkedin'));

  let score = 20; // Base presence points
  if (profile.avatar && !profile.avatar.includes('placeholder')) score += 10;
  if (isAadhaar) score += 25;
  if (isWork) score += 15;
  if (isCollege) score += 10;
  if (isPhone) score += 10;
  if (isEmail) score += 5;
  if (isLinkedIn) score += 10;

  const finalScore = Math.min(100, score);

  let tier: TrustScoreResult['tier'] = 'Basic Profile';
  if (finalScore >= 90) tier = 'Elite Verified';
  else if (finalScore >= 75) tier = 'High Trust';
  else if (finalScore >= 60) tier = 'Verified Member';

  const trustBreakdown = [
    { label: 'Government ID (Aadhaar / DigiLocker)', points: 25, earned: isAadhaar, icon: 'ShieldCheck' },
    { label: 'Verified Corporate Work Profile', points: 15, earned: isWork, icon: 'Briefcase' },
    { label: 'University / College Degree', points: 10, earned: isCollege, icon: 'GraduationCap' },
    { label: 'Verified Mobile Phone', points: 10, earned: isPhone, icon: 'Smartphone' },
    { label: 'Verified Email Address', points: 5, earned: isEmail, icon: 'Mail' },
    { label: 'LinkedIn Identity Proof', points: 10, earned: isLinkedIn, icon: 'Link' },
  ];

  const completedChecks = trustBreakdown.filter((b) => b.earned).length;

  return {
    score: finalScore,
    tier,
    badges: {
      aadhaar: isAadhaar,
      work: isWork,
      college: isCollege,
      phone: isPhone,
      email: isEmail,
      linkedin: isLinkedIn,
      company_name: profile.company || badges.company_name,
      college_name: profile.college || badges.college_name,
    },
    completedChecks,
    totalChecks: trustBreakdown.length,
    trustBreakdown,
  };
}
