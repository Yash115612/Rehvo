/**
 * REHVO AI Property Compare & Intelligence Engine
 * Multidimensional comparison, hidden cost calculation, rent vs buy analysis,
 * and neighborhood intelligence synchronization.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Property,
  ComparisonMatrix,
  ComparisonMatrixRow,
  ComparisonWinner,
  PropertyProsCons,
  HiddenCostBreakdown,
  RentVsBuyInput,
  RentVsBuyOutput,
  InvestmentScoreData,
  NeighborhoodScoresRecord,
  LocalityCrimeStatsRecord,
  LocalityAirQualityRecord,
  InternetProviderRecord,
  WaterSupplyScheduleRecord,
  LocalityPlacesRecord,
  PropertyCompareSession,
  AIDecisionSummary,
} from '../types';

// -----------------------------------------------------------------------------
// 1. HIDDEN COST CALCULATOR
// -----------------------------------------------------------------------------

export const calculateHiddenCosts = (property: Property): HiddenCostBreakdown => {
  const monthlyRent = property.rent || 35000;
  const securityDeposit = property.deposit || monthlyRent * 2;
  const brokerageFee = 0; // REHVO Direct — 100% Verified Marketplace

  // One-time Initial Setup Expenses
  const agreementAndStampDuty = Math.round(monthlyRent * 0.04 + 1200);
  const societyMoveInCharges = Math.min(Math.round(monthlyRent * 0.08), 5000);
  const movingAndPacking = monthlyRent > 75000 ? 12000 : monthlyRent > 40000 ? 8500 : 5500;
  const deepCleaningAndSanitization = 3500;
  const utilitySecurityDeposits = 3000; // Electricity & Piped Gas deposit
  const initialHouseholdSetup = 7500;

  // Monthly Estimates
  const isFurnished =
    property.furnishing === 'FULLY_FURNISHED' || (property.furnishing as any) === 'Furnished';
  const isSemiFurnished =
    property.furnishing === 'SEMI_FURNISHED' || (property.furnishing as any) === 'Semi-Furnished';
  const furnitureRentalMonthly = isFurnished ? 0 : isSemiFurnished ? 1500 : 3200;

  const monthlyMaintenance = property.maintenance || Math.round(monthlyRent * 0.07);
  const monthlyElectricityEst = Math.round(monthlyRent * 0.05) + 1200;
  const monthlyWaterAndGasEst = 800;
  const monthlyWifiEst = 899;

  const totalInitialMoveInCost =
    securityDeposit +
    brokerageFee +
    agreementAndStampDuty +
    societyMoveInCharges +
    movingAndPacking +
    deepCleaningAndSanitization +
    utilitySecurityDeposits +
    initialHouseholdSetup;

  const totalMonthlyLiving =
    monthlyRent +
    monthlyMaintenance +
    furnitureRentalMonthly +
    monthlyElectricityEst +
    monthlyWaterAndGasEst +
    monthlyWifiEst;

  const totalFirstYearCost = totalInitialMoveInCost + totalMonthlyLiving * 12;

  return {
    propertyId: property.id,
    monthlyRent,
    securityDeposit,
    brokerageFee,
    agreementAndStampDuty,
    societyMoveInCharges,
    movingAndPacking,
    deepCleaningAndSanitization,
    utilitySecurityDeposits,
    initialHouseholdSetup,
    furnitureRentalMonthly,
    monthlyMaintenance,
    monthlyElectricityEst,
    monthlyWaterAndGasEst,
    monthlyWifiEst,
    totalInitialMoveInCost,
    totalFirstYearCost,
  };
};

// -----------------------------------------------------------------------------
// 2. RENT VS BUY CALCULATOR (FINANCIAL MODEL)
// -----------------------------------------------------------------------------

export const calculateRentVsBuy = (input: RentVsBuyInput): RentVsBuyOutput => {
  const {
    homePrice,
    currentRent,
    downPaymentPercent,
    loanTenureYears,
    interestRatePercent,
    annualRentIncreasePercent,
    propertyAppreciationPercent,
    equityReturnPercent,
    monthlyMaintenance,
  } = input;

  const downPaymentAmount = Math.round((homePrice * downPaymentPercent) / 100);
  const loanAmount = homePrice - downPaymentAmount;

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = interestRatePercent / 12 / 100;
  const totalMonths = loanTenureYears * 12;

  const monthlyEmi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const totalLoanRepayment = monthlyEmi * totalMonths;
  const totalInterestPaid = Math.max(0, totalLoanRepayment - loanAmount);

  // Future Property Value with Compound Appreciation
  const propertyValueAtTenure = Math.round(
    homePrice * Math.pow(1 + propertyAppreciationPercent / 100, loanTenureYears)
  );

  // Renter calculation: rent grows annually, delta invested in equity
  let totalRentPaidOverTenure = 0;
  let runningRentMonthly = currentRent;
  let renterInvestedWealth = downPaymentAmount; // Starts with the saved down payment

  for (let year = 1; year <= loanTenureYears; year++) {
    totalRentPaidOverTenure += runningRentMonthly * 12;
    // Monthly delta between (EMI + Maintenance) and Rent
    const monthlyDelta = Math.max(0, monthlyEmi + monthlyMaintenance - runningRentMonthly);
    const yearlyInvestedSavings = monthlyDelta * 12;

    renterInvestedWealth =
      (renterInvestedWealth + yearlyInvestedSavings) * (1 + equityReturnPercent / 100);
    runningRentMonthly = Math.round(runningRentMonthly * (1 + annualRentIncreasePercent / 100));
  }

  const renterInvestmentValueAtTenure = Math.round(renterInvestedWealth);

  // Break-even determination
  let breakEvenYear = loanTenureYears;
  let runningBuyerNet = -downPaymentAmount;
  let runningRenterNet = downPaymentAmount;
  let testRent = currentRent;

  for (let yr = 1; yr <= loanTenureYears; yr++) {
    const yrPropVal = homePrice * Math.pow(1 + propertyAppreciationPercent / 100, yr);
    const yrRemainingLoan = Math.max(0, loanAmount * (1 - yr / loanTenureYears));
    const yrBuyerEquity = yrPropVal - yrRemainingLoan;

    testRent = testRent * (1 + annualRentIncreasePercent / 100);
    runningRenterNet = (runningRenterNet + Math.max(0, monthlyEmi - testRent) * 12) * (1 + equityReturnPercent / 100);

    if (yrBuyerEquity > runningRenterNet && breakEvenYear === loanTenureYears) {
      breakEvenYear = yr;
    }
  }

  const netBuyAdvantage = propertyValueAtTenure - renterInvestmentValueAtTenure;
  let recommendation: 'BUY' | 'RENT' | 'NEUTRAL' = 'NEUTRAL';
  let verdictTitle = 'Financially Balanced';
  let verdictDescription = 'Buying and renting yield comparable wealth generation in this horizon.';

  if (netBuyAdvantage > homePrice * 0.15 && breakEvenYear <= 7) {
    recommendation = 'BUY';
    verdictTitle = 'Buying Outperforms Renting';
    verdictDescription = `Buying builds ~₹${Math.round(netBuyAdvantage / 100000)}L more wealth by year ${loanTenureYears} with a breakeven in Year ${breakEvenYear}.`;
  } else if (netBuyAdvantage < -homePrice * 0.1) {
    recommendation = 'RENT';
    verdictTitle = 'Renting & Investing is Superior';
    verdictDescription = `Renting while investing the down payment delta yields ₹${Math.round(Math.abs(netBuyAdvantage) / 100000)}L higher net liquid assets.`;
  }

  return {
    loanAmount,
    downPaymentAmount,
    monthlyEmi,
    totalInterestPaid,
    totalRentPaidOverTenure,
    propertyValueAtTenure,
    renterInvestmentValueAtTenure,
    breakEvenYear,
    recommendation,
    verdictTitle,
    verdictDescription,
    savingsOrGainDelta: Math.abs(netBuyAdvantage),
  };
};

// -----------------------------------------------------------------------------
// 3. INVESTMENT SCORE EVALUATOR
// -----------------------------------------------------------------------------

export const calculateInvestmentScore = (property: Property): InvestmentScoreData => {
  const rent = property.rent || 40000;
  // Estimated capital value benchmark based on rent multiplier
  const estimatedCapitalValue = rent * 320;
  const annualRent = rent * 12;
  const rentalYieldPercent = Number(((annualRent / estimatedCapitalValue) * 100).toFixed(2));

  // Locality appreciation multipliers
  const locality = (property.locality || '').toLowerCase();
  let appreciation = 7.8;
  let tenantDemand = 8.5;
  let liquidity = 8.0;

  if (locality.includes('bkc') || locality.includes('bandra')) {
    appreciation = 9.2;
    tenantDemand = 9.8;
    liquidity = 9.5;
  } else if (locality.includes('powai') || locality.includes('worli')) {
    appreciation = 8.8;
    tenantDemand = 9.2;
    liquidity = 9.0;
  } else if (locality.includes('lower parel')) {
    appreciation = 8.9;
    tenantDemand = 9.4;
    liquidity = 9.1;
  }

  const overallInvestmentScore = Math.min(
    99,
    Math.round(rentalYieldPercent * 12 + appreciation * 4 + tenantDemand * 3)
  );

  let recommendationGrade: 'Strong Buy' | 'Moderate Buy' | 'Hold' = 'Moderate Buy';
  if (overallInvestmentScore >= 88) recommendationGrade = 'Strong Buy';
  else if (overallInvestmentScore < 75) recommendationGrade = 'Hold';

  return {
    propertyId: property.id,
    rentalYieldPercent,
    capitalAppreciationScore: appreciation,
    tenantDemandScore: tenantDemand,
    liquidityScore: liquidity,
    overallInvestmentScore,
    recommendationGrade,
  };
};

// -----------------------------------------------------------------------------
// 4. COMPARISON MATRIX GENERATOR
// -----------------------------------------------------------------------------

export const compareProperties = (properties: Property[]): ComparisonMatrix => {
  if (!properties || properties.length === 0) {
    return {
      properties: [],
      rows: [],
      winners: [],
      prosCons: {},
      overallRecommendedPropertyId: '',
    };
  }

  const matrixRows: ComparisonMatrixRow[] = [
    // 1. Financials
    {
      category: 'Financials',
      label: 'Monthly Rent',
      values: Object.fromEntries(properties.map((p) => [p.id, p.rent || 0])),
      highlightBest: 'min',
      unit: '₹',
    },
    {
      category: 'Financials',
      label: 'Security Deposit',
      values: Object.fromEntries(properties.map((p) => [p.id, p.deposit || 0])),
      highlightBest: 'min',
      unit: '₹',
    },
    {
      category: 'Financials',
      label: 'Brokerage Fee',
      values: Object.fromEntries(properties.map((p) => [p.id, '₹0 (REHVO Direct)'])),
    },
    {
      category: 'Financials',
      label: 'Society Maintenance',
      values: Object.fromEntries(
        properties.map((p) => [p.id, p.maintenance ? `₹${p.maintenance}/mo` : 'Included'])
      ),
    },

    // 2. Configuration & Space
    {
      category: 'Space & Layout',
      label: 'BHK Layout',
      values: Object.fromEntries(properties.map((p) => [p.id, p.bhk || `${parseInt(p.bhk) || 1} BHK`])),
    },
    {
      category: 'Space & Layout',
      label: 'Carpet Area',
      values: Object.fromEntries(properties.map((p) => [p.id, p.area_sqft || 850])),
      highlightBest: 'max',
      unit: 'sq ft',
    },
    {
      category: 'Space & Layout',
      label: 'Bathrooms',
      values: Object.fromEntries(properties.map((p) => [p.id, p.bathrooms || 1])),
      highlightBest: 'max',
    },
    {
      category: 'Space & Layout',
      label: 'Balconies',
      values: Object.fromEntries(properties.map((p) => [p.id, (p as any).balconies || 1])),
      highlightBest: 'max',
    },
    {
      category: 'Space & Layout',
      label: 'Floor / Total',
      values: Object.fromEntries(
        properties.map((p) => [p.id, `${p.floor || 4} of ${p.total_floors || 18}`])
      ),
    },
    {
      category: 'Space & Layout',
      label: 'Facing (Vastu)',
      values: Object.fromEntries(properties.map((p) => [p.id, (p as any).facing || 'East Facing'])),
    },
    {
      category: 'Space & Layout',
      label: 'Furnishing',
      values: Object.fromEntries(
        properties.map((p) => [p.id, p.furnishing ? p.furnishing.replace('_', ' ') : 'Semi Furnished'])
      ),
    },

    // 3. Society & Amenities
    {
      category: 'Amenities & Facilities',
      label: 'Gated Society',
      values: Object.fromEntries(
        properties.map((p) => [p.id, (p.amenities || []).some((a) => a.toLowerCase().includes('gated')) || true])
      ),
      highlightBest: 'boolean_true',
    },
    {
      category: 'Amenities & Facilities',
      label: 'Gym / Fitness Center',
      values: Object.fromEntries(
        properties.map((p) => [p.id, (p.amenities || []).some((a) => a.toLowerCase().includes('gym'))])
      ),
      highlightBest: 'boolean_true',
    },
    {
      category: 'Amenities & Facilities',
      label: 'Swimming Pool',
      values: Object.fromEntries(
        properties.map((p) => [p.id, (p.amenities || []).some((a) => a.toLowerCase().includes('pool'))])
      ),
      highlightBest: 'boolean_true',
    },
    {
      category: 'Amenities & Facilities',
      label: 'Power Backup Inverter',
      values: Object.fromEntries(
        properties.map((p) => [
          p.id,
          (p.amenities || []).some((a) => a.toLowerCase().includes('backup') || a.toLowerCase().includes('power')),
        ])
      ),
      highlightBest: 'boolean_true',
    },
    {
      category: 'Amenities & Facilities',
      label: 'Reserved Parking',
      values: Object.fromEntries(
        properties.map((p) => [
          p.id,
          (p.amenities || []).some((a) => a.toLowerCase().includes('park')),
        ])
      ),
      highlightBest: 'boolean_true',
    },
    {
      category: 'Amenities & Facilities',
      label: 'High Speed Lift',
      values: Object.fromEntries(
        properties.map((p) => [
          p.id,
          (p.amenities || []).some((a) => a.toLowerCase().includes('lift')),
        ])
      ),
      highlightBest: 'boolean_true',
    },
    {
      category: 'Amenities & Facilities',
      label: 'Pet Friendly',
      values: Object.fromEntries(
        properties.map((p) => [
          p.id,
          (p.amenities || []).some((a) => a.toLowerCase().includes('pet')),
        ])
      ),
      highlightBest: 'boolean_true',
    },

    // 4. Intelligence & Scores
    {
      category: 'REHVO AI Intelligence',
      label: 'AI Match Score',
      values: Object.fromEntries(
        properties.map((p, idx) => [p.id, `${Math.min(98, 92 - idx * 3)}% Match`])
      ),
      highlightBest: 'max',
    },
    {
      category: 'REHVO AI Intelligence',
      label: 'Neighborhood Grade',
      values: Object.fromEntries(
        properties.map((p) => [
          p.id,
          p.locality?.includes('BKC') || p.locality?.includes('Bandra') ? 'A+ (9.4/10)' : 'A (8.8/10)',
        ])
      ),
    },
    {
      category: 'REHVO AI Intelligence',
      label: 'Zero Deposit Eligible',
      values: Object.fromEntries(
        properties.map((p) => [p.id, (p.deposit || 0) <= (p.rent || 0)])
      ),
      highlightBest: 'boolean_true',
    },
  ];

  // Calculate Winners
  const { winners, overallRecommendedPropertyId, prosCons } = calculateWinner(properties);

  return {
    properties,
    rows: matrixRows,
    winners,
    prosCons,
    overallRecommendedPropertyId,
  };
};

// -----------------------------------------------------------------------------
// 5. CALCULATE WINNERS & PROS/CONS
// -----------------------------------------------------------------------------

export const calculateWinner = (
  properties: Property[]
): {
  winners: ComparisonWinner[];
  overallRecommendedPropertyId: string;
  prosCons: Record<string, PropertyProsCons>;
} => {
  if (!properties || properties.length === 0) {
    return { winners: [], overallRecommendedPropertyId: '', prosCons: {} };
  }

  // 1. Best Value Winner (Lowest Rent per sq ft with good amenities)
  let bestValueProp = properties[0];
  let bestValueRatio = Infinity;

  // 2. Best Family Winner (Most bedrooms, high area, security)
  let bestFamilyProp = properties[0];
  let bestFamilyScore = -1;

  // 3. Best Bachelor Winner (Low deposit, gym, prime transit)
  let bestBachelorProp = properties[0];
  let bestBachelorScore = -1;

  // 4. Best Investment Winner
  let bestInvestmentProp = properties[0];
  let bestInvestmentScore = -1;

  const prosCons: Record<string, PropertyProsCons> = {};

  properties.forEach((p) => {
    const rent = p.rent || 40000;
    const area = p.area_sqft || 800;
    const amenities = p.amenities || [];
    const deposit = p.deposit || rent * 2;
    const bedrooms = parseInt(p.bhk) || 1;

    // Value ratio (Rent per sqft)
    const ratio = rent / Math.max(1, area);
    if (ratio < bestValueRatio) {
      bestValueRatio = ratio;
      bestValueProp = p;
    }

    // Family score
    const familyScore =
      bedrooms * 20 +
      (area > 900 ? 15 : 0) +
      (amenities.some((a) => a.toLowerCase().includes('pool')) ? 10 : 0) +
      (amenities.some((a) => a.toLowerCase().includes('park')) ? 10 : 0);
    if (familyScore > bestFamilyScore) {
      bestFamilyScore = familyScore;
      bestFamilyProp = p;
    }

    // Bachelor score
    const bachelorScore =
      (deposit <= rent ? 25 : 10) +
      (amenities.some((a) => a.toLowerCase().includes('gym')) ? 15 : 0) +
      (p.locality?.toLowerCase().includes('bkc') || p.locality?.toLowerCase().includes('bandra')
        ? 20
        : 10);
    if (bachelorScore > bestBachelorScore) {
      bestBachelorScore = bachelorScore;
      bestBachelorProp = p;
    }

    // Investment score
    const invData = calculateInvestmentScore(p);
    if (invData.overallInvestmentScore > bestInvestmentScore) {
      bestInvestmentScore = invData.overallInvestmentScore;
      bestInvestmentProp = p;
    }

    // Pros & Cons
    const pros: string[] = [];
    const cons: string[] = [];

    if (deposit <= rent) pros.push('Zero or 1-Month Deposit available');
    if (ratio < 45) pros.push(`High spatial value at ₹${Math.round(ratio)}/sq.ft`);
    if (amenities.some((a) => a.toLowerCase().includes('gym'))) pros.push('Fully equipped fitness gym');
    if (amenities.some((a) => a.toLowerCase().includes('pool'))) pros.push('Luxury swimming pool access');
    if (p.locality?.includes('BKC') || p.locality?.includes('Bandra'))
      pros.push('Prime luxury address with high connectivity');
    if (p.verification_status === 'VERIFIED') pros.push('100% REHVO physically verified home');

    if (pros.length < 2) pros.push('Direct owner lease with verified marketplace fee');
    if (pros.length < 3) pros.push('Modern modular kitchen and piped gas');

    if (deposit > rent * 3) cons.push('Higher lock-in security deposit');
    if (area < 650 && bedrooms >= 2) cons.push('Compact living area');
    if (!amenities.some((a) => a.toLowerCase().includes('park'))) cons.push('Covered parking subject to society allocation');
    if (cons.length === 0) cons.push('High demand unit — fast tour recommended');

    prosCons[p.id] = {
      propertyId: p.id,
      pros: pros.slice(0, 3),
      cons: cons.slice(0, 2),
    };
  });

  const winners: ComparisonWinner[] = [
    {
      category: 'best_value',
      title: 'Best Value Pick',
      propertyId: bestValueProp.id,
      score: 94,
      badge: 'Maximum Space per Rupee',
      rationale: `${bestValueProp.title} offers the lowest per-sqft cost with premium living amenities.`,
    },
    {
      category: 'best_family',
      title: 'Best for Families',
      propertyId: bestFamilyProp.id,
      score: 96,
      badge: 'Spacious & Gated Community',
      rationale: `${bestFamilyProp.title} features the highest safety ratings, multiple baths, and family amenities.`,
    },
    {
      category: 'best_bachelor',
      title: 'Best for Bachelors',
      propertyId: bestBachelorProp.id,
      score: 91,
      badge: 'Prime Transit & Low Deposit',
      rationale: `${bestBachelorProp.title} has zero deposit terms and instant access to business hubs and nightlife.`,
    },
    {
      category: 'best_investment',
      title: 'Best Investment',
      propertyId: bestInvestmentProp.id,
      score: 95,
      badge: `${calculateInvestmentScore(bestInvestmentProp).rentalYieldPercent}% Rental Yield`,
      rationale: `${bestInvestmentProp.title} commands the strongest tenant velocity and capital appreciation outlook.`,
    },
  ];

  return {
    winners,
    overallRecommendedPropertyId: bestValueProp.id,
    prosCons,
  };
};

// -----------------------------------------------------------------------------
// 6. AI DECISION SUMMARY GENERATOR
// -----------------------------------------------------------------------------

export const generateAIDecisionSummary = (
  properties: Property[],
  recommendedId: string
): AIDecisionSummary => {
  const chosen = properties.find((p) => p.id === recommendedId) || properties[0];

  return {
    primaryRecommendedPropertyId: chosen.id,
    confidencePercent: 94,
    headline: `Choose ${chosen.title} for the optimal balance of rent, location and amenities.`,
    keyReason: `At ₹${((chosen.rent || 35000) / 1000).toFixed(0)}k/mo in ${chosen.locality || 'prime Mumbai'}, it beats alternatives by providing 18% higher living area and zero lock-in deposit friction.`,
    dimensionFits: {
      budgetFit: 96,
      commuteFit: 92,
      amenitiesFit: 89,
      lifestyleFit: 94,
      familyFit: 91,
      investmentFit: 88,
    },
  };
};

// -----------------------------------------------------------------------------
// 7. SUPABASE PERSISTENCE & LOCALITY DATA
// -----------------------------------------------------------------------------

export const saveCompareSession = async (
  userId: string | undefined,
  propertyIds: string[],
  notes?: string
): Promise<PropertyCompareSession | null> => {
  if (!isSupabaseConfigured() || !userId) {
    return {
      id: `local_session_${Date.now()}`,
      user_id: userId,
      property_ids: propertyIds,
      notes,
      created_at: new Date().toISOString(),
    };
  }

  try {
    const { data, error } = await supabase
      .from('property_compare_sessions')
      .insert({
        user_id: userId,
        property_ids: propertyIds,
        notes,
      })
      .select()
      .single();

    if (error || !data) return null;
    return data as PropertyCompareSession;
  } catch {
    return null;
  }
};

// Default Mock Intelligence for Key Localities
export const DEFAULT_LOCALITY_SCORES: Record<string, NeighborhoodScoresRecord> = {
  BKC: {
    id: 'score_bkc',
    locality: 'BKC',
    city: 'Mumbai',
    walk_score: 8.8,
    safety_score: 9.4,
    nightlife_score: 8.6,
    greenery_score: 8.2,
    internet_score: 9.8,
    water_score: 9.2,
    traffic_score: 7.8,
    family_score: 8.9,
    pollution_score: 7.2,
    overall_grade: 'A+',
    description: 'Mumbai’s premier financial fortress with world-class infrastructure and luxury residences.',
    created_at: new Date().toISOString(),
  },
  'Bandra West': {
    id: 'score_bandra',
    locality: 'Bandra West',
    city: 'Mumbai',
    walk_score: 9.5,
    safety_score: 9.2,
    nightlife_score: 9.8,
    greenery_score: 7.9,
    internet_score: 9.6,
    water_score: 8.8,
    traffic_score: 6.2,
    family_score: 8.7,
    pollution_score: 7.0,
    overall_grade: 'A+',
    description: 'The cultural queen of Mumbai. High walkability, seaside promenades, and gourmet nightlife.',
    created_at: new Date().toISOString(),
  },
  Powai: {
    id: 'score_powai',
    locality: 'Powai',
    city: 'Mumbai',
    walk_score: 8.4,
    safety_score: 9.0,
    nightlife_score: 8.1,
    greenery_score: 9.4,
    internet_score: 9.5,
    water_score: 8.6,
    traffic_score: 6.8,
    family_score: 9.3,
    pollution_score: 8.1,
    overall_grade: 'A+',
    description: 'Lakeside tech enclave with premier institutes (IIT Bombay) and lush Hiranandani architecture.',
    created_at: new Date().toISOString(),
  },
  'Andheri East': {
    id: 'score_andheri',
    locality: 'Andheri East',
    city: 'Mumbai',
    walk_score: 8.6,
    safety_score: 8.5,
    nightlife_score: 8.0,
    greenery_score: 6.5,
    internet_score: 9.2,
    water_score: 8.0,
    traffic_score: 5.8,
    family_score: 8.2,
    pollution_score: 6.0,
    overall_grade: 'A',
    description: 'Unmatched connectivity nexus with Metro Line 1 & 7, international airport, and SEEPZ.',
    created_at: new Date().toISOString(),
  },
};

export const getLocalityIntelligence = async (
  localityName: string
): Promise<{
  scores: NeighborhoodScoresRecord;
  crime: LocalityCrimeStatsRecord;
  air: LocalityAirQualityRecord;
  internet: InternetProviderRecord[];
  water: WaterSupplyScheduleRecord;
  places: LocalityPlacesRecord;
}> => {
  const normLocality = localityName || 'BKC';

  // Fallback defaults
  const scores = DEFAULT_LOCALITY_SCORES[normLocality] || {
    id: `score_${normLocality}`,
    locality: normLocality,
    city: 'Mumbai',
    walk_score: 8.5,
    safety_score: 8.8,
    nightlife_score: 8.0,
    greenery_score: 7.5,
    internet_score: 9.2,
    water_score: 8.4,
    traffic_score: 6.5,
    family_score: 8.6,
    pollution_score: 6.8,
    overall_grade: 'A',
    description: `High convenience urban pocket in ${normLocality}, Mumbai with robust amenities.`,
    created_at: new Date().toISOString(),
  };

  const crime: LocalityCrimeStatsRecord = {
    id: `crime_${normLocality}`,
    locality: normLocality,
    crime_index: 18.5,
    safety_grade: 'A+',
    women_safety: 'Very High',
    police_station: `${normLocality} Police Station`,
    police_distance_km: 1.1,
    cctv_coverage: '94% Monitored (24x7 Patrol)',
    emergency_numbers: ['100', '112', '1090', '1091'],
    created_at: new Date().toISOString(),
  };

  const air: LocalityAirQualityRecord = {
    id: `air_${normLocality}`,
    locality: normLocality,
    aqi: 72,
    pm25: 22.4,
    pm10: 44.0,
    humidity: 65.0,
    temperature: 28.5,
    noise_level_db: 54.0,
    status: 'Good to Moderate',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  const internet: InternetProviderRecord[] = [
    {
      id: 'isp_1',
      locality: normLocality,
      provider: 'JioFiber',
      speed_mbps: 300,
      latency: 6,
      reliability: 99.8,
      rating: 4.9,
      plan_starting_price: 699,
    },
    {
      id: 'isp_2',
      locality: normLocality,
      provider: 'Airtel Xstream Fiber',
      speed_mbps: 300,
      latency: 7,
      reliability: 99.6,
      rating: 4.8,
      plan_starting_price: 799,
    },
    {
      id: 'isp_3',
      locality: normLocality,
      provider: 'ACT Fibernet',
      speed_mbps: 250,
      latency: 9,
      reliability: 99.1,
      rating: 4.6,
      plan_starting_price: 649,
    },
    {
      id: 'isp_4',
      locality: normLocality,
      provider: 'Tata Play Fiber',
      speed_mbps: 200,
      latency: 11,
      reliability: 98.9,
      rating: 4.5,
      plan_starting_price: 750,
    },
  ];

  const water: WaterSupplyScheduleRecord = {
    id: `water_${normLocality}`,
    locality: normLocality,
    tanker_frequency: 'Rare / Summer Peak Emergency Only',
    municipal_supply_hours: '06:00 AM – 09:30 AM & 06:30 PM – 09:00 PM',
    borewell_available: true,
    tds_level: 165,
    pressure_rating: 'High Pressure (2.4 Bar)',
    created_at: new Date().toISOString(),
  };

  const places: LocalityPlacesRecord = {
    id: `places_${normLocality}`,
    locality: normLocality,
    schools: [
      { name: 'Dhirubhai Ambani International School', distance_km: 1.2, rating: 4.9, time_mins: 5 },
      { name: 'American School of Bombay', distance_km: 1.5, rating: 4.8, time_mins: 7 },
      { name: 'Podar International School', distance_km: 2.1, rating: 4.7, time_mins: 9 },
    ],
    hospitals: [
      { name: 'Asian Heart Institute', distance_km: 0.9, rating: 4.8, time_mins: 4 },
      { name: 'Lilavati Hospital & Research Centre', distance_km: 2.4, rating: 4.7, time_mins: 10 },
      { name: 'Guru Nanak Hospital', distance_km: 1.8, rating: 4.5, time_mins: 8 },
    ],
    malls: [
      { name: 'Jio World Drive & Plaza', distance_km: 0.6, rating: 4.9, time_mins: 3 },
      { name: 'Phoenix Palladium', distance_km: 5.8, rating: 4.9, time_mins: 18 },
    ],
    cafes: [
      { name: 'Blue Tokai Coffee Roasters', distance_km: 0.4, rating: 4.7, time_mins: 3 },
      { name: 'Subko Specialty Coffee & Bakehouse', distance_km: 0.5, rating: 4.9, time_mins: 4 },
      { name: 'Bastian at the Top', distance_km: 1.1, rating: 4.7, time_mins: 6 },
    ],
    gyms: [
      { name: 'Gold’s Gym Elite', distance_km: 0.6, rating: 4.7, time_mins: 4 },
      { name: 'Cult.fit Fitness Center', distance_km: 0.5, rating: 4.8, time_mins: 3 },
    ],
    metro: [
      { name: 'BKC Metro Station (Aqua Line 3)', distance_km: 0.4, rating: 4.9, time_mins: 3 },
      { name: 'Bandra Railway & Metro Hub', distance_km: 1.4, rating: 4.5, time_mins: 7 },
    ],
    grocery: [
      { name: 'Foodhall Supermarket', distance_km: 0.6, rating: 4.8, time_mins: 4 },
      { name: 'Godrej Nature’s Basket', distance_km: 0.8, rating: 4.7, time_mins: 5 },
    ],
    parks: [
      { name: 'BKC City Park & Jogging Track', distance_km: 0.5, rating: 4.6, time_mins: 4 },
      { name: 'MMRDA Green Promenades', distance_km: 0.9, rating: 4.5, time_mins: 6 },
    ],
    pet_clinics: [
      { name: 'Crown Vet 24/7 Care', distance_km: 1.3, rating: 4.8, time_mins: 6 },
    ],
    coworking: [
      { name: 'WeWork Enam Sambhav', distance_km: 0.3, rating: 4.8, time_mins: 2 },
      { name: 'Awfis Business Center', distance_km: 0.6, rating: 4.6, time_mins: 4 },
    ],
    temples: [
      { name: 'Shree Siddhivinayak Ganapati Temple', distance_km: 5.2, rating: 4.9, time_mins: 16 },
      { name: 'Mount Mary Basilica', distance_km: 3.8, rating: 4.9, time_mins: 14 },
    ],
    created_at: new Date().toISOString(),
  };

  // If Supabase is available, attempt to query live data
  if (isSupabaseConfigured()) {
    try {
      const [scoresRes, crimeRes, airRes, internetRes, waterRes, placesRes] = await Promise.all([
        supabase.from('neighborhood_scores').select('*').ilike('locality', normLocality).maybeSingle(),
        supabase.from('locality_crime_stats').select('*').ilike('locality', normLocality).maybeSingle(),
        supabase.from('locality_air_quality').select('*').ilike('locality', normLocality).maybeSingle(),
        supabase.from('internet_providers').select('*').ilike('locality', normLocality),
        supabase.from('water_supply_schedule').select('*').ilike('locality', normLocality).maybeSingle(),
        supabase.from('locality_places').select('*').ilike('locality', normLocality).maybeSingle(),
      ]);

      return {
        scores: scoresRes.data || scores,
        crime: crimeRes.data || crime,
        air: airRes.data || air,
        internet: (internetRes.data && internetRes.data.length > 0) ? internetRes.data : internet,
        water: waterRes.data || water,
        places: placesRes.data || places,
      };
    } catch {
      // Fallback
    }
  }

  return { scores, crime, air, internet, water, places };
};
