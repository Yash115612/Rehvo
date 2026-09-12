import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Sparkles,
  Building2,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Zap,
  Check,
  ChevronRight,
  ChevronDown,
  Info,
  Calendar,
  Layers,
  Award,
  DollarSign,
  Car,
  Home,
  CheckCircle2,
  Sliders,
  Eye,
  Heart,
  Users,
  Clock,
  ArrowUpRight,
  Briefcase,
  SlidersHorizontal,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS, V4_TYPOGRAPHY } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';
import { triggerHaptic } from '../../../utils/haptics';
import {
  estimateRent,
  PropertyEstimateInput,
  RentEstimateResult,
  EstimatorBHK,
  EstimatorFurnishing,
  EstimatorPropertyType,
  EstimatorParking,
  POPULAR_CITIES,
  POPULAR_LOCALITIES_BY_CITY,
  DEFAULT_CARPET_AREA,
} from '../../../services/rentEstimator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AMENITY_LIST = [
  'Gym',
  'Pool',
  'Lift',
  'Security',
  'Power Backup',
  'Clubhouse',
  'Garden',
  'Pet Friendly',
  'Metro Nearby',
  'Covered Parking',
  'EV Charging',
  'AC',
  'WiFi Ready',
  'Furnished Kitchen',
];

interface V4RentalIncomeEstimatorScreenProps {
  initialCity?: string;
  initialLocality?: string;
  initialBhk?: EstimatorBHK;
  onApplyToDraft?: (rent: number) => void;
  hideBackButton?: boolean;
}

export const V4RentalIncomeEstimatorScreen: React.FC<V4RentalIncomeEstimatorScreenProps> = ({
  initialCity = 'Mumbai',
  initialLocality = 'Bandra West',
  initialBhk = '2 BHK',
  onApplyToDraft,
  hideBackButton = false,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, showToast } = useAppStore();

  // Core Calculator Input States
  const [city, setCity] = useState<string>(initialCity);
  const [locality, setLocality] = useState<string>(initialLocality);
  const [propertyType, setPropertyType] = useState<EstimatorPropertyType>('Apartment');
  const [bhk, setBhk] = useState<EstimatorBHK>(initialBhk);
  const [carpetArea, setCarpetArea] = useState<number>(DEFAULT_CARPET_AREA[initialBhk]);
  const [furnishing, setFurnishing] = useState<EstimatorFurnishing>('Semi Furnished');
  const [parking, setParking] = useState<EstimatorParking>('Car & Bike');
  const [balconies, setBalconies] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [buildingAge, setBuildingAge] = useState<number>(4);
  const [floorNumber, setFloorNumber] = useState<number>(5);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Lift',
    'Security',
    'Power Backup',
    'Covered Parking',
  ]);
  const [enteredRentInput, setEnteredRentInput] = useState<string>('');

  // Projections
  const [projectionYears, setProjectionYears] = useState<1 | 3 | 5 | 10>(3);
  const [annualRentHikeRate, setAnnualRentHikeRate] = useState<number>(5); // 5% yearly hike standard

  // Calculation Result State
  const [result, setResult] = useState<RentEstimateResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(true);

  // Debounced Real-Time Calculation Engine
  useEffect(() => {
    let isMounted = true;
    setIsCalculating(true);

    const timer = setTimeout(async () => {
      const enteredRentNum = parseInt(enteredRentInput.replace(/[^0-9]/g, ''), 10) || undefined;
      const input: PropertyEstimateInput = {
        city,
        locality,
        propertyType,
        bhk,
        carpetArea: carpetArea > 0 ? carpetArea : DEFAULT_CARPET_AREA[bhk],
        furnishing,
        buildingAge,
        parking,
        balconies,
        societyAmenities: selectedAmenities,
        floorNumber,
        bathrooms,
        enteredRent: enteredRentNum,
      };

      try {
        const est = await estimateRent(input);
        if (isMounted) {
          setResult(est);
          setIsCalculating(false);
        }
      } catch {
        if (isMounted) setIsCalculating(false);
      }
    }, 280);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [
    city,
    locality,
    propertyType,
    bhk,
    carpetArea,
    furnishing,
    parking,
    balconies,
    bathrooms,
    buildingAge,
    floorNumber,
    selectedAmenities,
    enteredRentInput,
  ]);

  // When BHK changes, dynamically update recommended carpet area if default
  const handleBhkChange = (newBhk: EstimatorBHK) => {
    triggerHaptic('light');
    setBhk(newBhk);
    setCarpetArea(DEFAULT_CARPET_AREA[newBhk]);
  };

  const handleCityChange = (newCity: string) => {
    triggerHaptic('light');
    setCity(newCity);
    const localities = POPULAR_LOCALITIES_BY_CITY[newCity] || [];
    if (localities.length > 0) {
      setLocality(localities[0]);
    }
  };

  const toggleAmenity = (amenity: string) => {
    triggerHaptic('selection');
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  // Cumulative Projected Earnings Calculation
  const projectedEarnings = useMemo(() => {
    if (!result) return 0;
    let total = 0;
    let currentAnnual = result.estimatedMonthlyRent * 12;
    for (let i = 0; i < projectionYears; i++) {
      total += currentAnnual;
      currentAnnual *= 1 + annualRentHikeRate / 100;
    }
    return Math.round(total);
  }, [result, projectionYears, annualRentHikeRate]);

  // Handle Publish / Apply Action
  const handlePublishPress = () => {
    triggerHaptic('medium');
    if (!result) return;

    if (onApplyToDraft) {
      onApplyToDraft(result.estimatedMonthlyRent);
      showToast?.(`Applied ₹${result.estimatedMonthlyRent.toLocaleString('en-IN')}/mo to listing!`, 'success');
      router.back();
      return;
    }

    if (!isAuthenticated) {
      showToast?.('Please sign in to list your property and manage tenants.', 'info');
      router.push('/(renter)/login' as any);
      return;
    }

    // Direct to Listing Wizard with pre-filled state
    router.push({
      pathname: '/(owner)/listing',
      params: {
        prefillCity: city,
        prefillLocality: locality,
        prefillBhk: bhk,
        prefillRent: result.estimatedMonthlyRent.toString(),
        prefillDeposit: result.suggestedDeposit.toString(),
      },
    } as any);
  };

  return (
    <View style={styles.rootContainer}>
      {/* =====================================================================
          1. HEADER NAV BAR
         ===================================================================== */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 14) + 4 }]}>
        {!hideBackButton && (
          <Pressable
            style={styles.backButton}
            onPress={() => {
              triggerHaptic('light');
              router.back();
            }}
            hitSlop={8}
          >
            <ArrowLeft size={20} color={V4_COLORS.textPrimary} />
          </Pressable>
        )}

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>AI Rental Estimator</Text>
          <View style={styles.headerBadge}>
            <Sparkles size={11} color="#0F766E" strokeWidth={2.4} />
            <Text style={styles.headerBadgeText}>V5.2 AI Valuation</Text>
          </View>
        </View>

        <Pressable
          style={styles.headerInfoBtn}
          onPress={() => {
            triggerHaptic('light');
            showToast?.('Calculated with hedonic pricing & live marketplace transactions.', 'info');
          }}
          hitSlop={8}
        >
          <Info size={19} color="#64748B" />
        </Pressable>
      </View>

      {/* =====================================================================
          MAIN SCROLLABLE BODY
         ===================================================================== */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* =====================================================================
            2. HERO RESULT VALUATION CARD (SIGNATURE EMERALD)
           ===================================================================== */}
        <View style={styles.heroCard}>
          {/* Top Banner Row */}
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <Sparkles size={12} color="#A7F3D0" strokeWidth={2.6} />
              <Text style={styles.heroBadgeText}>
                {result?.isLiveSupabaseData ? 'LIVE MARKET BENCHMARK' : 'AI STATISTICAL ESTIMATE'}
              </Text>
            </View>
            <View style={styles.heroConfidencePill}>
              <ShieldCheck size={12} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.heroConfidenceText}>{result?.confidenceScore || 92}% Confidence</Text>
            </View>
          </View>

          {/* Large Primary Rent Display */}
          <Text style={styles.heroSubtitle}>Estimated Monthly Rent</Text>
          <View style={styles.heroRentRow}>
            <Text style={styles.heroCurrencySymbol}>₹</Text>
            <Text style={styles.heroRentNumber}>
              {result ? result.estimatedMonthlyRent.toLocaleString('en-IN') : '...'}
            </Text>
            <Text style={styles.heroMonthUnit}>/mo</Text>
            {isCalculating && (
              <ActivityIndicator size="small" color="#A7F3D0" style={{ marginLeft: 10 }} />
            )}
          </View>

          {/* Expected Rent Range */}
          <View style={styles.heroRangeBox}>
            <Text style={styles.heroRangeLabel}>Expected Range:</Text>
            <Text style={styles.heroRangeValue}>
              ₹{result ? result.rentRangeMin.toLocaleString('en-IN') : '0'} – ₹
              {result ? result.rentRangeMax.toLocaleString('en-IN') : '0'}
            </Text>
          </View>

          {/* 3 Metric Pills Row */}
          <View style={styles.heroMetricsGrid}>
            <View style={styles.heroMetricCol}>
              <Text style={styles.heroMetricLabel}>Annual Return</Text>
              <Text style={styles.heroMetricValue}>
                ₹{result ? (result.annualGrossIncome / 100000).toFixed(1) : '0'} L
              </Text>
            </View>
            <View style={styles.heroMetricDivider} />
            <View style={styles.heroMetricCol}>
              <Text style={styles.heroMetricLabel}>Rental Yield</Text>
              <Text style={[styles.heroMetricValue, { color: '#6EE7B7' }]}>
                {result?.rentalYield || 5.6}%
              </Text>
            </View>
            <View style={styles.heroMetricDivider} />
            <View style={styles.heroMetricCol}>
              <Text style={styles.heroMetricLabel}>Avg Deposit</Text>
              <Text style={styles.heroMetricValue}>
                ₹{result ? (result.suggestedDeposit / 1000).toFixed(0) : '0'}k
              </Text>
            </View>
          </View>
        </View>

        {/* =====================================================================
            3. PROPERTY LOCATION SELECTOR
           ===================================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <MapPin size={17} color="#0F766E" strokeWidth={2.4} />
            <Text style={styles.sectionTitle}>1. Location & Locality</Text>
          </View>

          {/* City Scroll Bar */}
          <Text style={styles.inputFieldLabel}>SELECT CITY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cityPillScroll}>
            {POPULAR_CITIES.map((c) => {
              const isActive = city === c;
              return (
                <Pressable
                  key={c}
                  style={[styles.cityPill, isActive && styles.cityPillActive]}
                  onPress={() => handleCityChange(c)}
                >
                  <Text style={[styles.cityPillText, isActive && styles.cityPillTextActive]}>
                    {c}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Locality Input + Quick Chips */}
          <Text style={[styles.inputFieldLabel, { marginTop: 14 }]}>LOCALITY / NEIGHBORHOOD</Text>
          <View style={styles.localityInputWrap}>
            <MapPin size={16} color="#64748B" />
            <TextInput
              style={styles.localityTextInput}
              value={locality}
              onChangeText={(txt) => setLocality(txt)}
              placeholder="Enter locality (e.g. Bandra West, Koramangala)"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Quick localities suggestions */}
          <View style={styles.localityChipRow}>
            {(POPULAR_LOCALITIES_BY_CITY[city] || []).slice(0, 4).map((loc) => {
              const isSelected = locality.toLowerCase() === loc.toLowerCase();
              return (
                <Pressable
                  key={loc}
                  style={[styles.locSugChip, isSelected && styles.locSugChipActive]}
                  onPress={() => {
                    triggerHaptic('light');
                    setLocality(loc);
                  }}
                >
                  <Text style={[styles.locSugText, isSelected && styles.locSugTextActive]}>
                    {loc}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* =====================================================================
            4. PROPERTY CONFIGURATION & SPECIFICATIONS
           ===================================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Building2 size={17} color="#0F766E" strokeWidth={2.4} />
            <Text style={styles.sectionTitle}>2. Property Details</Text>
          </View>

          {/* Property Type */}
          <Text style={styles.inputFieldLabel}>PROPERTY TYPE</Text>
          <View style={styles.optionsWrap}>
            {(['Apartment', 'Independent House', 'Villa', 'Commercial', 'Studio'] as EstimatorPropertyType[]).map(
              (type) => {
                const isSelected = propertyType === type;
                return (
                  <Pressable
                    key={type}
                    style={[styles.selectChip, isSelected && styles.selectChipActive]}
                    onPress={() => {
                      triggerHaptic('light');
                      setPropertyType(type);
                    }}
                  >
                    <Text style={[styles.selectChipText, isSelected && styles.selectChipTextActive]}>
                      {type}
                    </Text>
                  </Pressable>
                );
              }
            )}
          </View>

          {/* BHK Selector */}
          <Text style={[styles.inputFieldLabel, { marginTop: 14 }]}>BHK CONFIGURATION</Text>
          <View style={styles.optionsWrap}>
            {(['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'] as EstimatorBHK[]).map((b) => {
              const isSelected = bhk === b;
              return (
                <Pressable
                  key={b}
                  style={[styles.bhkChip, isSelected && styles.bhkChipActive]}
                  onPress={() => handleBhkChange(b)}
                >
                  <Text style={[styles.bhkChipText, isSelected && styles.bhkChipTextActive]}>
                    {b}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Carpet Area Control */}
          <View style={styles.stepperRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputFieldLabel}>CARPET AREA (SQ FT)</Text>
              <Text style={styles.stepperSubtext}>Usable carpet area</Text>
            </View>
            <View style={styles.stepperControls}>
              <Pressable
                style={styles.stepBtn}
                onPress={() => {
                  triggerHaptic('light');
                  setCarpetArea((prev) => Math.max(200, prev - 50));
                }}
              >
                <Text style={styles.stepBtnText}>–</Text>
              </Pressable>
              <Text style={styles.stepValueText}>{carpetArea} sqft</Text>
              <Pressable
                style={styles.stepBtn}
                onPress={() => {
                  triggerHaptic('light');
                  setCarpetArea((prev) => prev + 50);
                }}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          {/* Furnishing Status */}
          <Text style={[styles.inputFieldLabel, { marginTop: 16 }]}>FURNISHING STATUS</Text>
          <View style={styles.optionsWrap}>
            {(['Fully Furnished', 'Semi Furnished', 'Unfurnished'] as EstimatorFurnishing[]).map(
              (furn) => {
                const isSelected = furnishing === furn;
                return (
                  <Pressable
                    key={furn}
                    style={[styles.selectChip, isSelected && styles.selectChipActive]}
                    onPress={() => {
                      triggerHaptic('light');
                      setFurnishing(furn);
                    }}
                  >
                    <Text style={[styles.selectChipText, isSelected && styles.selectChipTextActive]}>
                      {furn}
                    </Text>
                  </Pressable>
                );
              }
            )}
          </View>

          {/* Parking Options */}
          <Text style={[styles.inputFieldLabel, { marginTop: 16 }]}>PARKING AVAILABILITY</Text>
          <View style={styles.optionsWrap}>
            {(['Car & Bike', 'Car Only', 'Bike Only', 'None'] as EstimatorParking[]).map((park) => {
              const isSelected = parking === park;
              return (
                <Pressable
                  key={park}
                  style={[styles.selectChip, isSelected && styles.selectChipActive]}
                  onPress={() => {
                    triggerHaptic('light');
                    setParking(park);
                  }}
                >
                  <Text style={[styles.selectChipText, isSelected && styles.selectChipTextActive]}>
                    {park}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Quick Dual Stepper: Balcony & Bathrooms */}
          <View style={styles.dualStepperRow}>
            {/* Balconies */}
            <View style={styles.dualStepCol}>
              <Text style={styles.inputFieldLabel}>BALCONIES</Text>
              <View style={styles.miniStepper}>
                <Pressable
                  style={styles.miniStepBtn}
                  onPress={() => {
                    triggerHaptic('light');
                    setBalconies((prev) => Math.max(0, prev - 1));
                  }}
                >
                  <Text style={styles.miniStepBtnTxt}>–</Text>
                </Pressable>
                <Text style={styles.miniStepVal}>{balconies}</Text>
                <Pressable
                  style={styles.miniStepBtn}
                  onPress={() => {
                    triggerHaptic('light');
                    setBalconies((prev) => prev + 1);
                  }}
                >
                  <Text style={styles.miniStepBtnTxt}>+</Text>
                </Pressable>
              </View>
            </View>

            {/* Bathrooms */}
            <View style={styles.dualStepCol}>
              <Text style={styles.inputFieldLabel}>BATHROOMS</Text>
              <View style={styles.miniStepper}>
                <Pressable
                  style={styles.miniStepBtn}
                  onPress={() => {
                    triggerHaptic('light');
                    setBathrooms((prev) => Math.max(1, prev - 1));
                  }}
                >
                  <Text style={styles.miniStepBtnTxt}>–</Text>
                </Pressable>
                <Text style={styles.miniStepVal}>{bathrooms}</Text>
                <Pressable
                  style={styles.miniStepBtn}
                  onPress={() => {
                    triggerHaptic('light');
                    setBathrooms((prev) => prev + 1);
                  }}
                >
                  <Text style={styles.miniStepBtnTxt}>+</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Building Age Slider / Stepper */}
          <View style={[styles.stepperRow, { marginTop: 14 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputFieldLabel}>BUILDING AGE</Text>
              <Text style={styles.stepperSubtext}>
                {buildingAge <= 2 ? 'Brand New (< 2 yrs)' : `${buildingAge} Years old`}
              </Text>
            </View>
            <View style={styles.stepperControls}>
              <Pressable
                style={styles.stepBtn}
                onPress={() => {
                  triggerHaptic('light');
                  setBuildingAge((prev) => Math.max(0, prev - 2));
                }}
              >
                <Text style={styles.stepBtnText}>–</Text>
              </Pressable>
              <Text style={styles.stepValueText}>{buildingAge} yrs</Text>
              <Pressable
                style={styles.stepBtn}
                onPress={() => {
                  triggerHaptic('light');
                  setBuildingAge((prev) => Math.min(30, prev + 2));
                }}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* =====================================================================
            5. AMENITIES SELECTION GRID
           ===================================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Sparkles size={17} color="#0F766E" strokeWidth={2.4} />
            <Text style={styles.sectionTitle}>3. Society & Unit Amenities</Text>
          </View>
          <Text style={styles.sectionHelpText}>
            Select amenities to see the exact rental premium added to your baseline valuation.
          </Text>

          <View style={styles.amenitiesGrid}>
            {AMENITY_LIST.map((item) => {
              const isSelected = selectedAmenities.includes(item);
              return (
                <Pressable
                  key={item}
                  style={[styles.amenityChip, isSelected && styles.amenityChipActive]}
                  onPress={() => toggleAmenity(item)}
                >
                  <View style={[styles.amenityCheckCircle, isSelected && styles.amenityCheckCircleActive]}>
                    {isSelected ? (
                      <Check size={11} color="#FFFFFF" strokeWidth={3} />
                    ) : (
                      <View style={styles.amenityEmptyDot} />
                    )}
                  </View>
                  <Text style={[styles.amenityText, isSelected && styles.amenityTextActive]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* =====================================================================
            6. REHVO AI INSIGHTS CARD
           ===================================================================== */}
        {result && (
          <View style={styles.insightsCard}>
            <View style={styles.insightsHeader}>
              <View style={styles.insightsTitleWrap}>
                <Sparkles size={18} color="#0F766E" strokeWidth={2.4} />
                <Text style={styles.insightsTitle}>REHVO AI Market Intelligence</Text>
              </View>
              <View style={styles.demandPill}>
                <Text style={styles.demandPillText}>{result.insights.demandLevel} Demand</Text>
              </View>
            </View>

            <View style={styles.insightsGrid}>
              <View style={styles.insightItem}>
                <Clock size={16} color="#0F766E" />
                <View style={{ marginLeft: 8, flex: 1 }}>
                  <Text style={styles.insightItemLabel}>Time to Rent</Text>
                  <Text style={styles.insightItemValue}>{result.insights.timeToRent}</Text>
                </View>
              </View>

              <View style={styles.insightItem}>
                <Users size={16} color="#0F766E" />
                <View style={{ marginLeft: 8, flex: 1 }}>
                  <Text style={styles.insightItemLabel}>Target Audience</Text>
                  <Text style={styles.insightItemValue} numberOfLines={1}>
                    {result.insights.targetTenantType}
                  </Text>
                </View>
              </View>

              <View style={styles.insightItem}>
                <Eye size={16} color="#0F766E" />
                <View style={{ marginLeft: 8, flex: 1 }}>
                  <Text style={styles.insightItemLabel}>Active Listings</Text>
                  <Text style={styles.insightItemValue}>
                    {result.insights.nearbyListingsCount} in {locality}
                  </Text>
                </View>
              </View>

              <View style={styles.insightItem}>
                <Calendar size={16} color="#0F766E" />
                <View style={{ marginLeft: 8, flex: 1 }}>
                  <Text style={styles.insightItemLabel}>Best Post Time</Text>
                  <Text style={styles.insightItemValue}>Thursday–Saturday</Text>
                </View>
              </View>
            </View>

            {/* Price Advice Banner */}
            <View style={styles.priceAdviceBox}>
              <Info size={15} color="#0F766E" style={{ marginTop: 2 }} />
              <Text style={styles.priceAdviceText}>{result.insights.priceAdvice}</Text>
            </View>
          </View>
        )}

        {/* =====================================================================
            7. RENTAL BREAKDOWN CARD
           ===================================================================== */}
        {result && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Layers size={17} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.sectionTitle}>4. Valuation Breakdown</Text>
            </View>

            <View style={styles.breakdownList}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Base Area Rent ({carpetArea} sqft)</Text>
                <Text style={styles.breakdownVal}>
                  ₹{result.breakdown.baseRent.toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Furnishing Premium ({furnishing})</Text>
                <Text
                  style={[
                    styles.breakdownVal,
                    {
                      color:
                        result.breakdown.furnishingAdjustment >= 0 ? '#16A34A' : '#DC2626',
                    },
                  ]}
                >
                  {result.breakdown.furnishingAdjustment >= 0 ? '+' : ''}₹
                  {result.breakdown.furnishingAdjustment.toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Parking Value ({parking})</Text>
                <Text
                  style={[
                    styles.breakdownVal,
                    {
                      color: result.breakdown.parkingAdjustment >= 0 ? '#16A34A' : '#DC2626',
                    },
                  ]}
                >
                  {result.breakdown.parkingAdjustment >= 0 ? '+' : ''}₹
                  {result.breakdown.parkingAdjustment.toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>
                  Amenities & Facilities ({selectedAmenities.length} selected)
                </Text>
                <Text style={[styles.breakdownVal, { color: '#16A34A' }]}>
                  +₹{result.breakdown.amenitiesAdjustment.toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Floor & Age Adjustment</Text>
                <Text
                  style={[
                    styles.breakdownVal,
                    {
                      color:
                        result.breakdown.floorAgeAdjustment >= 0 ? '#16A34A' : '#64748B',
                    },
                  ]}
                >
                  {result.breakdown.floorAgeAdjustment >= 0 ? '+' : ''}₹
                  {result.breakdown.floorAgeAdjustment.toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={styles.breakdownDivider} />

              <View style={styles.breakdownTotalRow}>
                <Text style={styles.breakdownTotalLabel}>Net Estimated Rent</Text>
                <Text style={styles.breakdownTotalVal}>
                  ₹{result.estimatedMonthlyRent.toLocaleString('en-IN')}/mo
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* =====================================================================
            8. RENTAL YIELD & PERFORMANCE METRICS
           ===================================================================== */}
        {result && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <TrendingUp size={17} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.sectionTitle}>5. Host Yield & Analytics</Text>
            </View>

            <View style={styles.yieldGrid}>
              <View style={styles.yieldCard}>
                <Text style={styles.yieldCardLabel}>Gross Rental Yield</Text>
                <Text style={[styles.yieldCardVal, { color: '#0F766E' }]}>
                  {result.rentalYield}%
                </Text>
                <Text style={styles.yieldCardSub}>Annualized return</Text>
              </View>

              <View style={styles.yieldCard}>
                <Text style={styles.yieldCardLabel}>Est. Occupancy</Text>
                <Text style={[styles.yieldCardVal, { color: '#16A34A' }]}>
                  {result.occupancyRate}%
                </Text>
                <Text style={styles.yieldCardSub}>~345 days/year</Text>
              </View>

              <View style={styles.yieldCard}>
                <Text style={styles.yieldCardLabel}>Expected Inquiries</Text>
                <Text style={[styles.yieldCardVal, { color: '#0284C7' }]}>
                  {Math.round(18 + result.insights.demandScore * 0.2)}/mo
                </Text>
                <Text style={styles.yieldCardSub}>Verified tenant leads</Text>
              </View>

              <View style={styles.yieldCard}>
                <Text style={styles.yieldCardLabel}>Property Value</Text>
                <Text style={styles.yieldCardVal}>
                  ₹{(result.estimatedPropertyValue / 10000000).toFixed(2)} Cr
                </Text>
                <Text style={styles.yieldCardSub}>Estimated asset worth</Text>
              </View>
            </View>

            {result.cashflowAnalysis && (
              <View style={[styles.projectionBox, { marginTop: 14, backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
                <Text style={[styles.projectionLabel, { color: '#166534' }]}>Net Cashflow Simulator (Post-Tax & Maintenance):</Text>
                <Text style={[styles.projectionNumber, { color: '#15803D' }]}>
                  ₹{result.cashflowAnalysis.netMonthlyCashflow.toLocaleString('en-IN')}/mo
                </Text>
                <Text style={[styles.projectionSubtext, { color: '#166534' }]}>
                  Net Yield: {result.cashflowAnalysis.netYieldPercentage}% • Net Annual Operating Income: ₹{(result.cashflowAnalysis.netAnnualOperatingIncome / 100000).toFixed(2)} Lakhs (accounting for maintenance, property tax & 4% vacancy reserve).
                </Text>
              </View>
            )}
          </View>
        )}

        {/* =====================================================================
            9. LONG-TERM MULTI-YEAR INCOME PROJECTION
           ===================================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <DollarSign size={17} color="#0F766E" strokeWidth={2.4} />
            <Text style={styles.sectionTitle}>6. Long-Term Income Forecast</Text>
          </View>

          {/* Period Selector Tabs */}
          <View style={styles.yearTabsRow}>
            {([1, 3, 5, 10] as const).map((yr) => {
              const isSelected = projectionYears === yr;
              return (
                <Pressable
                  key={yr}
                  style={[styles.yearTab, isSelected && styles.yearTabActive]}
                  onPress={() => {
                    triggerHaptic('light');
                    setProjectionYears(yr);
                  }}
                >
                  <Text style={[styles.yearTabText, isSelected && styles.yearTabTextActive]}>
                    {yr} {yr === 1 ? 'Year' : 'Years'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Projection Display Box */}
          <View style={styles.projectionBox}>
            <Text style={styles.projectionLabel}>
              Projected Gross Revenue ({projectionYears} {projectionYears === 1 ? 'Year' : 'Years'}):
            </Text>
            <Text style={styles.projectionNumber}>
              ₹{(projectedEarnings / 100000).toFixed(2)} Lakhs
            </Text>
            <Text style={styles.projectionSubtext}>
              *Assumes standard {annualRentHikeRate}% compound annual lease revision per Model Tenancy Act.
            </Text>
          </View>
        </View>

        {/* =====================================================================
            10. MARKET COMPARISON LISTINGS
           ===================================================================== */}
        {result && result.comparisons.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Award size={17} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.sectionTitle}>7. Similar Area Listings</Text>
            </View>

            <View style={styles.compList}>
              {result.comparisons.map((comp) => (
                <View key={comp.id} style={styles.compItem}>
                  <Image source={{ uri: comp.imageUrl }} style={styles.compImage} />
                  <View style={styles.compDetails}>
                    <Text style={styles.compTitle} numberOfLines={1}>
                      {comp.title}
                    </Text>
                    <Text style={styles.compSub}>
                      {comp.areaSqft} sqft • {comp.distanceKm} km away
                    </Text>
                    <View style={styles.compRentRow}>
                      <Text style={styles.compRent}>₹{comp.rent.toLocaleString('en-IN')}/mo</Text>
                      <View style={styles.compDaysTag}>
                        <Text style={styles.compDaysTxt}>{comp.daysListed}d ago</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* =====================================================================
          11. FIXED BOTTOM CTA DOCK
         ===================================================================== */}
      <View style={[styles.bottomDock, { paddingBottom: Math.max(insets.bottom, 14) + 6 }]}>
        <View style={styles.dockPriceCol}>
          <Text style={styles.dockPriceLabel}>AI Recommended Price</Text>
          <Text style={styles.dockPriceVal}>
            ₹{result ? result.estimatedMonthlyRent.toLocaleString('en-IN') : '...'}
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748B' }}>/mo</Text>
          </Text>
        </View>

        <Pressable style={styles.dockPublishBtn} onPress={handlePublishPress}>
          <Text style={styles.dockPublishBtnText}>
            {onApplyToDraft ? 'Apply Rent' : 'List Property'}
          </Text>
          <ChevronRight size={17} color="#FFFFFF" strokeWidth={2.6} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // 1. Header Bar
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.4,
  },
  headerInfoBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Main Scroll
  scrollContent: {
    padding: 16,
    gap: 16,
  },

  // 2. Hero Card
  heroCard: {
    backgroundColor: '#064E3B',
    borderRadius: 24,
    padding: 20,
    ...V4_SHADOWS.card,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#A7F3D0',
    letterSpacing: 0.6,
  },
  heroConfidencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 7,
  },
  heroConfidenceText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.3,
  },
  heroRentRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  heroCurrencySymbol: {
    fontSize: 26,
    fontWeight: '900',
    color: '#34D399',
    marginRight: 2,
  },
  heroRentNumber: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.6,
  },
  heroMonthUnit: {
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
    marginLeft: 4,
  },
  heroRangeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 10,
  },
  heroRangeLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '600',
  },
  heroRangeValue: {
    fontSize: 11.5,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  heroMetricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 18,
  },
  heroMetricCol: {
    flex: 1,
    alignItems: 'center',
  },
  heroMetricDivider: {
    width: 1,
    height: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  heroMetricLabel: {
    fontSize: 10.5,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '600',
  },
  heroMetricValue: {
    fontSize: 14.5,
    color: '#FFFFFF',
    fontWeight: '900',
    marginTop: 2,
  },

  // General Section Card
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  sectionHelpText: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 12,
  },
  inputFieldLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  // City Picker
  cityPillScroll: {
    gap: 8,
  },
  cityPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  cityPillActive: {
    backgroundColor: '#0F766E',
  },
  cityPillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  cityPillTextActive: {
    color: '#FFFFFF',
  },

  // Locality Input
  localityInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  localityTextInput: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
    padding: 0,
  },
  localityChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  locSugChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  locSugChipActive: {
    backgroundColor: '#CCFBF1',
  },
  locSugText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  locSugTextActive: {
    color: '#0F766E',
  },

  // Options & Chips Wrap
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectChip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectChipActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0F766E',
  },
  selectChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  selectChipTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },

  // BHK Chips
  bhkChip: {
    flex: 1,
    minWidth: 55,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bhkChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  bhkChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  bhkChipTextActive: {
    color: '#FFFFFF',
  },

  // Steppers
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    marginTop: 14,
  },
  stepperSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  stepValueText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    minWidth: 70,
    textAlign: 'center',
  },

  // Dual Stepper
  dualStepperRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  dualStepCol: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
  },
  miniStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  miniStepBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniStepBtnTxt: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  miniStepVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },

  // Amenities Grid
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 11,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  amenityChipActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#14B8A6',
  },
  amenityCheckCircle: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityCheckCircleActive: {
    backgroundColor: '#0F766E',
  },
  amenityEmptyDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
  },
  amenityText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  amenityTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },

  // AI Insights Card
  insightsCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    ...V4_SHADOWS.soft,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  insightsTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#065F46',
  },
  demandPill: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  demandPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  insightItem: {
    width: (SCREEN_WIDTH - 32 - 36 - 12) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
  },
  insightItemLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  insightItemValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  priceAdviceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
  },
  priceAdviceText: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '700',
    color: '#065F46',
    lineHeight: 16,
  },

  // Breakdown List
  breakdownList: {
    gap: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  breakdownVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  breakdownTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownTotalLabel: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  breakdownTotalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F766E',
  },

  // Yield Grid
  yieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  yieldCard: {
    width: (SCREEN_WIDTH - 32 - 32 - 10) / 2,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  yieldCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  yieldCardVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  yieldCardSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },

  // Projections
  yearTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  yearTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  yearTabActive: {
    backgroundColor: '#FFFFFF',
    ...V4_SHADOWS.soft,
  },
  yearTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  yearTabTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  projectionBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  projectionLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  projectionNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F766E',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  projectionSubtext: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 14,
  },

  // Comparable Listings
  compList: {
    gap: 10,
  },
  compItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  compImage: {
    width: 65,
    height: 65,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  compDetails: {
    flex: 1,
    gap: 2,
  },
  compTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  compSub: {
    fontSize: 11,
    color: '#64748B',
  },
  compRentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  compRent: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F766E',
  },
  compDaysTag: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  compDaysTxt: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#475569',
  },

  // Bottom Fixed Dock
  bottomDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 12,
    ...V4_SHADOWS.card,
  },
  dockPriceCol: {
    gap: 2,
  },
  dockPriceLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  dockPriceVal: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
  },
  dockPublishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F766E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    ...V4_SHADOWS.soft,
  },
  dockPublishBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
