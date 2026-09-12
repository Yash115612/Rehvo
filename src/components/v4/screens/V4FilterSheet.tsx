import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Check,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Home,
  ShieldCheck,
  Zap,
  Building2,
  Users,
  Car,
  Dog,
  Wind,
  Flame,
  KeyRound,
  Compass,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS, V4_TYPOGRAPHY } from '../../../theme/v4Theme';
import { V4BottomSheet } from '../ui/V4BottomSheet';
import { V4Button } from '../ui/V4Button';
import { AdvancedFilterPayload } from '../../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// -----------------------------------------------------------------------------
// FILTER PRESET CONSTANTS (45+ FILTERS)
// -----------------------------------------------------------------------------

const BUDGET_PRESETS = [
  { id: 'all', label: 'All Budgets', min: 0, max: 300000 },
  { id: 'under25', label: 'Under ₹25k', min: 0, max: 25000 },
  { id: '25to50', label: '₹25k - ₹50k', min: 25000, max: 50000 },
  { id: '50to100', label: '₹50k - ₹1L', min: 50000, max: 100000 },
  { id: '100to200', label: '₹1L - ₹2L', min: 100000, max: 200000 },
  { id: 'above200', label: '₹2L+', min: 200000, max: 1000000 },
];

const DEPOSIT_PRESETS = [
  { id: 'any', label: 'Any Deposit', maxMonths: 12 },
  { id: 'zero', label: '0 Deposit Pass', maxMonths: 1, zeroDeposit: true },
  { id: '1to2', label: '1 - 2 Months', maxMonths: 2 },
  { id: '3to5', label: '3 - 5 Months', maxMonths: 5 },
];

const BHK_OPTIONS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'];
const PROPERTY_TYPE_OPTIONS = ['Apartment', 'Studio', 'Villa', 'Penthouse', 'Independent Floor'];
const BATHROOM_OPTIONS = [1, 2, 3];
const BALCONY_OPTIONS = [1, 2, 3];

const FURNISHING_OPTIONS = [
  { id: 'ALL', label: 'Any' },
  { id: 'FULLY_FURNISHED', label: 'Fully Furnished' },
  { id: 'SEMI_FURNISHED', label: 'Semi-Furnished' },
  { id: 'UNFURNISHED', label: 'Unfurnished' },
];

const TENANT_OPTIONS = [
  { id: 'FAMILY', label: 'Families Only' },
  { id: 'BACHELOR', label: 'Bachelors Welcome' },
  { id: 'WORKING_PROFESSIONALS', label: 'Working Pros' },
  { id: 'GIRLS', label: 'Girls Only' },
  { id: 'BOYS', label: 'Boys Only' },
];

const MOVE_IN_OPTIONS = [
  { id: 'ANY', label: 'Anytime' },
  { id: 'IMMEDIATE', label: 'Immediate' },
  { id: 'WITHIN_15_DAYS', label: 'Within 15 Days' },
  { id: 'WITHIN_30_DAYS', label: 'Within 30 Days' },
];

const FLOOR_OPTIONS = [
  { id: 'ANY', label: 'Any Floor' },
  { id: 'GROUND', label: 'Ground Floor' },
  { id: 'LOW', label: 'Low (1st - 4th)' },
  { id: 'MID', label: 'Mid (5th - 10th)' },
  { id: 'HIGH', label: 'High (10th+)' },
];

const FACING_OPTIONS = [
  { id: 'ANY', label: 'Any Direction' },
  { id: 'EAST', label: 'East Facing (Vastu)' },
  { id: 'NORTH', label: 'North Facing' },
  { id: 'SEA_FACING', label: 'Sea Facing' },
  { id: 'GARDEN_FACING', label: 'Garden Facing' },
];

const SOCIETY_AMENITIES = [
  { key: 'gated_society', label: 'Gated Society' },
  { key: 'security_24x7', label: '24/7 Security Guard' },
  { key: 'cctv', label: 'CCTV Surveillance' },
  { key: 'lift', label: 'High-Speed Lift' },
  { key: 'power_backup', label: '100% Power Backup' },
  { key: 'covered_car_parking', label: 'Covered Car Parking' },
  { key: 'bike_parking', label: 'Bike Parking' },
  { key: 'ev_charging', label: 'EV Charging Station' },
  { key: 'gym', label: 'Gym & Fitness' },
  { key: 'swimming_pool', label: 'Swimming Pool' },
  { key: 'clubhouse', label: 'Clubhouse' },
  { key: 'children_play_area', label: 'Children Play Area' },
  { key: 'jogging_track', label: 'Jogging Track' },
  { key: 'intercom', label: 'Intercom Facility' },
];

const APARTMENT_AMENITIES = [
  { key: 'has_ac', label: 'Air Conditioner (AC)' },
  { key: 'modular_kitchen', label: 'Modular Kitchen' },
  { key: 'wardrobes', label: 'Built-in Wardrobes' },
  { key: 'gas_pipeline', label: 'Piped Natural Gas (PNG)' },
  { key: 'water_purifier', label: 'RO Water Purifier' },
];

const LIFESTYLE_RULES = [
  { key: 'pet_friendly', label: 'Pet Friendly' },
  { key: 'flatmate_compatible', label: 'Flatmate Compatible' },
  { key: 'pure_veg_only', label: 'Pure Veg Preferred' },
  { key: 'non_veg_allowed', label: 'Non-Veg Allowed' },
  { key: 'visitors_allowed', label: 'Visitors Welcome' },
];

export interface V4FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  initialFilters?: Partial<AdvancedFilterPayload>;
  onApply?: (filters: AdvancedFilterPayload) => void;
}

export const V4FilterSheet: React.FC<V4FilterSheetProps> = ({
  visible,
  onClose,
  initialFilters = {},
  onApply,
}) => {
  // 1. Economics
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedDeposit, setSelectedDeposit] = useState('any');
  const [zeroBrokerageOnly, setZeroBrokerageOnly] = useState(false);
  const [zeroDepositOnly, setZeroDepositOnly] = useState(false);

  // 2. Unit Configuration
  const [selectedBhk, setSelectedBhk] = useState<string[]>([]);
  const [selectedPropTypes, setSelectedPropTypes] = useState<string[]>([]);
  const [selectedBaths, setSelectedBaths] = useState<number[]>([]);
  const [selectedBalconies, setSelectedBalconies] = useState<number[]>([]);

  // 3. Furnishing
  const [selectedFurnish, setSelectedFurnish] = useState('ALL');

  // 4. Availability & Trust
  const [selectedMoveIn, setSelectedMoveIn] = useState('ANY');
  const [ownerVerifiedOnly, setOwnerVerifiedOnly] = useState(false);
  const [videoTourOnly, setVideoTourOnly] = useState(false);
  const [nearMetroOnly, setNearMetroOnly] = useState(false);

  // 5. Tenant Preferences
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);

  // 6. Amenities & Rules toggles
  const [boolFilters, setBoolFilters] = useState<Record<string, boolean>>({});

  // 7. Floor & Facing
  const [selectedFloor, setSelectedFloor] = useState('ANY');
  const [selectedFacing, setSelectedFacing] = useState('ANY');

  const toggleBhk = (bhk: string) => {
    setSelectedBhk((prev) =>
      prev.includes(bhk) ? prev.filter((b) => b !== bhk) : [...prev, bhk]
    );
  };

  const togglePropType = (t: string) => {
    setSelectedPropTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const toggleBath = (n: number) => {
    setSelectedBaths((prev) =>
      prev.includes(n) ? prev.filter((b) => b !== n) : [...prev, n]
    );
  };

  const toggleBalcony = (n: number) => {
    setSelectedBalconies((prev) =>
      prev.includes(n) ? prev.filter((b) => b !== n) : [...prev, n]
    );
  };

  const toggleTenant = (t: string) => {
    setSelectedTenants((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const toggleBoolFilter = (key: string) => {
    setBoolFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Active filters count calculation
  const activeCount = useMemo(() => {
    let count = 0;
    if (selectedBudget !== 'all') count++;
    if (selectedDeposit !== 'any' || zeroDepositOnly) count++;
    if (zeroBrokerageOnly) count++;
    if (selectedBhk.length > 0) count += selectedBhk.length;
    if (selectedPropTypes.length > 0) count += selectedPropTypes.length;
    if (selectedBaths.length > 0) count += selectedBaths.length;
    if (selectedBalconies.length > 0) count += selectedBalconies.length;
    if (selectedFurnish !== 'ALL') count++;
    if (selectedMoveIn !== 'ANY') count++;
    if (ownerVerifiedOnly) count++;
    if (videoTourOnly) count++;
    if (nearMetroOnly) count++;
    if (selectedTenants.length > 0) count += selectedTenants.length;
    if (selectedFloor !== 'ANY') count++;
    if (selectedFacing !== 'ANY') count++;
    count += Object.values(boolFilters).filter(Boolean).length;
    return count;
  }, [
    selectedBudget,
    selectedDeposit,
    zeroDepositOnly,
    zeroBrokerageOnly,
    selectedBhk,
    selectedPropTypes,
    selectedBaths,
    selectedBalconies,
    selectedFurnish,
    selectedMoveIn,
    ownerVerifiedOnly,
    videoTourOnly,
    nearMetroOnly,
    selectedTenants,
    selectedFloor,
    selectedFacing,
    boolFilters,
  ]);

  const handleReset = () => {
    setSelectedBudget('all');
    setSelectedDeposit('any');
    setZeroBrokerageOnly(false);
    setZeroDepositOnly(false);
    setSelectedBhk([]);
    setSelectedPropTypes([]);
    setSelectedBaths([]);
    setSelectedBalconies([]);
    setSelectedFurnish('ALL');
    setSelectedMoveIn('ANY');
    setOwnerVerifiedOnly(false);
    setVideoTourOnly(false);
    setNearMetroOnly(false);
    setSelectedTenants([]);
    setBoolFilters({});
    setSelectedFloor('ANY');
    setSelectedFacing('ANY');
  };

  const handleApply = () => {
    const budgetConfig = BUDGET_PRESETS.find((b) => b.id === selectedBudget);
    const depositConfig = DEPOSIT_PRESETS.find((d) => d.id === selectedDeposit);

    const payload: AdvancedFilterPayload = {
      rent_min: budgetConfig?.min,
      rent_max: budgetConfig?.max,
      deposit_max_months: depositConfig?.maxMonths,
      zero_deposit_only: zeroDepositOnly || depositConfig?.zeroDeposit,
      zero_brokerage_only: zeroBrokerageOnly,
      bhk: selectedBhk.length > 0 ? selectedBhk : undefined,
      property_types: selectedPropTypes.length > 0 ? selectedPropTypes : undefined,
      bathrooms: selectedBaths.length > 0 ? selectedBaths : undefined,
      balconies: selectedBalconies.length > 0 ? selectedBalconies : undefined,
      furnishing: selectedFurnish,
      move_in_timeline: selectedMoveIn as any,
      owner_verified_only: ownerVerifiedOnly,
      video_tour_available: videoTourOnly,
      near_metro_only: nearMetroOnly,
      tenant_types: selectedTenants.length > 0 ? selectedTenants : undefined,
      floor_preference: selectedFloor as any,
      facing: selectedFacing as any,
      ...boolFilters,
    };

    onApply?.(payload);
    onClose();
  };

  return (
    <V4BottomSheet
      visible={visible}
      onClose={onClose}
      title="Advanced Search Filters"
      subtitle={`${activeCount} filters applied • 45+ parameters`}
      maxHeightRatio={0.9}
    >
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Quick Economics Row: Verified Listing & 0 Deposit */}
          <View style={styles.quickBannerRow}>
            <Pressable
              style={[styles.highlightPill, zeroBrokerageOnly && styles.highlightPillActive]}
              onPress={() => setZeroBrokerageOnly(!zeroBrokerageOnly)}
            >
              <Zap size={14} color={zeroBrokerageOnly ? '#FFFFFF' : V4_COLORS.primary} strokeWidth={2.4} />
              <Text style={[styles.highlightPillText, zeroBrokerageOnly && styles.highlightPillTextActive]}>
                Verified Listing Only
              </Text>
            </Pressable>

            <Pressable
              style={[styles.highlightPill, zeroDepositOnly && styles.highlightPillActive]}
              onPress={() => setZeroDepositOnly(!zeroDepositOnly)}
            >
              <KeyRound size={14} color={zeroDepositOnly ? '#FFFFFF' : '#D97706'} strokeWidth={2.4} />
              <Text style={[styles.highlightPillText, zeroDepositOnly && styles.highlightPillTextActive]}>
                0 Deposit Pass
              </Text>
            </Pressable>
          </View>

          {/* 1. Monthly Budget */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Rent Range</Text>
            <View style={styles.chipGrid}>
              {BUDGET_PRESETS.map((b) => (
                <Pressable
                  key={b.id}
                  style={[styles.chip, selectedBudget === b.id && styles.chipActive]}
                  onPress={() => setSelectedBudget(b.id)}
                >
                  <Text style={[styles.chipText, selectedBudget === b.id && styles.chipTextActive]}>
                    {b.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* 2. Security Deposit */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security Deposit</Text>
            <View style={styles.chipGrid}>
              {DEPOSIT_PRESETS.map((d) => (
                <Pressable
                  key={d.id}
                  style={[styles.chip, selectedDeposit === d.id && styles.chipActive]}
                  onPress={() => setSelectedDeposit(d.id)}
                >
                  <Text style={[styles.chipText, selectedDeposit === d.id && styles.chipTextActive]}>
                    {d.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* 3. BHK Configuration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BHK Configuration</Text>
            <View style={styles.chipGrid}>
              {BHK_OPTIONS.map((bhk) => {
                const isSelected = selectedBhk.includes(bhk);
                return (
                  <Pressable
                    key={bhk}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => toggleBhk(bhk)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {bhk}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* 4. Furnishing Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Furnishing Status</Text>
            <View style={styles.chipGrid}>
              {FURNISHING_OPTIONS.map((f) => (
                <Pressable
                  key={f.id}
                  style={[styles.chip, selectedFurnish === f.id && styles.chipActive]}
                  onPress={() => setSelectedFurnish(f.id)}
                >
                  <Text style={[styles.chipText, selectedFurnish === f.id && styles.chipTextActive]}>
                    {f.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* 5. Bathrooms & Balconies */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bathrooms</Text>
            <View style={styles.chipGrid}>
              {BATHROOM_OPTIONS.map((n) => {
                const isSelected = selectedBaths.includes(n);
                return (
                  <Pressable
                    key={`bath-${n}`}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => toggleBath(n)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {n}+ Baths
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 14 }]}>Balconies</Text>
            <View style={styles.chipGrid}>
              {BALCONY_OPTIONS.map((n) => {
                const isSelected = selectedBalconies.includes(n);
                return (
                  <Pressable
                    key={`balc-${n}`}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => toggleBalcony(n)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {n}+ Balconies
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* 6. Tenant & Lifestyle Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tenant Preferences</Text>
            <View style={styles.chipGrid}>
              {TENANT_OPTIONS.map((t) => {
                const isSelected = selectedTenants.includes(t.id);
                return (
                  <Pressable
                    key={t.id}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => toggleTenant(t.id)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {t.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 14 }]}>House & Food Rules</Text>
            <View style={styles.chipGrid}>
              {LIFESTYLE_RULES.map((rule) => {
                const isSelected = Boolean(boolFilters[rule.key]);
                return (
                  <Pressable
                    key={rule.key}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => toggleBoolFilter(rule.key)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {rule.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* 7. Society Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Society & Building Infrastructure</Text>
            <View style={styles.chipGrid}>
              {SOCIETY_AMENITIES.map((item) => {
                const isSelected = Boolean(boolFilters[item.key]);
                return (
                  <Pressable
                    key={item.key}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => toggleBoolFilter(item.key)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* 8. Apartment In-Unit Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>In-Unit Furnishings & Appliances</Text>
            <View style={styles.chipGrid}>
              {APARTMENT_AMENITIES.map((item) => {
                const isSelected = Boolean(boolFilters[item.key]);
                return (
                  <Pressable
                    key={item.key}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => toggleBoolFilter(item.key)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* 9. Availability & Verification */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Move-In Timeline & Verification</Text>
            <View style={styles.chipGrid}>
              {MOVE_IN_OPTIONS.map((m) => (
                <Pressable
                  key={m.id}
                  style={[styles.chip, selectedMoveIn === m.id && styles.chipActive]}
                  onPress={() => setSelectedMoveIn(m.id)}
                >
                  <Text style={[styles.chipText, selectedMoveIn === m.id && styles.chipTextActive]}>
                    {m.label}
                  </Text>
                </Pressable>
              ))}
              <Pressable
                style={[styles.chip, ownerVerifiedOnly && styles.chipActive]}
                onPress={() => setOwnerVerifiedOnly(!ownerVerifiedOnly)}
              >
                <Text style={[styles.chipText, ownerVerifiedOnly && styles.chipTextActive]}>
                  🛡️ Verified Landlords Only
                </Text>
              </Pressable>
              <Pressable
                style={[styles.chip, nearMetroOnly && styles.chipActive]}
                onPress={() => setNearMetroOnly(!nearMetroOnly)}
              >
                <Text style={[styles.chipText, nearMetroOnly && styles.chipTextActive]}>
                  🚇 Near Metro Station
                </Text>
              </Pressable>
            </View>
          </View>

          {/* 10. Floor & Facing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Floor Preference</Text>
            <View style={styles.chipGrid}>
              {FLOOR_OPTIONS.map((fl) => (
                <Pressable
                  key={fl.id}
                  style={[styles.chip, selectedFloor === fl.id && styles.chipActive]}
                  onPress={() => setSelectedFloor(fl.id)}
                >
                  <Text style={[styles.chipText, selectedFloor === fl.id && styles.chipTextActive]}>
                    {fl.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 14 }]}>Facing Direction</Text>
            <View style={styles.chipGrid}>
              {FACING_OPTIONS.map((fc) => (
                <Pressable
                  key={fc.id}
                  style={[styles.chip, selectedFacing === fc.id && styles.chipActive]}
                  onPress={() => setSelectedFacing(fc.id)}
                >
                  <Text style={[styles.chipText, selectedFacing === fc.id && styles.chipTextActive]}>
                    {fc.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Sticky Action Footer */}
        <View style={styles.footer}>
          <Pressable style={styles.resetBtn} onPress={handleReset}>
            <RotateCcw size={15} color={V4_COLORS.textSecondary} />
            <Text style={styles.resetBtnText}>Clear All</Text>
          </Pressable>

          <Pressable style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyBtnText}>
              Apply {activeCount > 0 ? `(${activeCount})` : ''} Filters
            </Text>
          </Pressable>
        </View>
      </View>
    </V4BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 110,
    gap: 20,
  },
  quickBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  highlightPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    paddingVertical: 10,
    borderRadius: 12,
  },
  highlightPillActive: {
    backgroundColor: V4_COLORS.primary,
    borderColor: V4_COLORS.primary,
  },
  highlightPillText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  highlightPillTextActive: {
    color: '#FFFFFF',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7.5,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: 'rgba(15, 118, 110, 0.12)',
    borderColor: V4_COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: V4_COLORS.primary,
    fontWeight: '800',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...V4_SHADOWS.card,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  applyBtn: {
    flex: 1,
    backgroundColor: V4_COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...V4_SHADOWS.soft,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
