import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  X,
  Sparkles,
  MapPin,
  Check,
  Building2,
  Users,
  Briefcase,
  Home,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  RotateCcw,
  Search,
  Compass,
  ArrowRight,
  Edit3,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export type IntakeCategoryType = 'rental' | 'pg' | 'commercial';

interface V4CategoryIntakeModalProps {
  visible: boolean;
  category: IntakeCategoryType;
  onClose: () => void;
  onApply: (filters: any) => void;
  onSkip: () => void;
}

// -----------------------------------------------------------------------------
// PRESETS FOR RENTAL (Property for Rent)
// -----------------------------------------------------------------------------
const RENTAL_BHK = ['1 BHK', '2 BHK', '3 BHK', '4+ BHK', 'Studio', 'Penthouse'];
const RENTAL_BUDGET = [
  { id: 'under_30k', label: 'Under ₹30k' },
  { id: '30k_50k', label: '₹30k - ₹50k' },
  { id: '50k_80k', label: '₹50k - ₹80k' },
  { id: '80k_1.5L', label: '₹80k - ₹1.5L' },
  { id: '1.5L_plus', label: 'Luxury ₹1.5L+' },
];
const RENTAL_LOCALITIES = [
  'All Mumbai Metro',
  'Bandra West',
  'Andheri West',
  'Powai',
  'Juhu',
  'Worli',
  'Lower Parel',
  'Goregaon West',
];
const RENTAL_FURNISHING = ['Any Furnishing', 'Fully Furnished', 'Semi-Furnished', 'Unfurnished'];

// -----------------------------------------------------------------------------
// PRESETS FOR PG & HOSTEL
// -----------------------------------------------------------------------------
const PG_GENDERS = [
  { id: 'girls', label: '👩 Girls Only PG' },
  { id: 'boys', label: '👨 Boys Only PG' },
  { id: 'unisex', label: '👥 Unisex Co-Living' },
  { id: 'any', label: 'Any Gender' },
];
const PG_SHARING = ['Private Single Room', 'Double Sharing', 'Triple Sharing'];
const PG_BUDGET = [
  { id: 'under_12k', label: 'Under ₹12k/mo' },
  { id: '12k_20k', label: '₹12k - ₹20k/mo' },
  { id: '20k_30k', label: '₹20k - ₹30k/mo' },
  { id: '30k_plus', label: 'Luxury ₹30k+/mo' },
];
const PG_LOCALITIES = ['All Mumbai', 'Powai (IIT/Tech)', 'Bandra West', 'Andheri West', 'BKC Hub', 'Juhu (Colleges)'];
const PG_FOOD = ['🍲 3 Meals Included', '🍳 Breakfast & Dinner', 'No Food Needed'];

// -----------------------------------------------------------------------------
// PRESETS FOR COMMERCIAL
// -----------------------------------------------------------------------------
const COMM_TYPES = [
  { id: 'office', label: '🏢 Corporate Office' },
  { id: 'plot', label: '📐 Commercial Plot' },
  { id: 'studio', label: '🎨 Creator Studio' },
  { id: 'shop', label: '🛍️ Retail Showroom' },
  { id: 'warehouse', label: '📦 Logistics Warehouse' },
];
const COMM_CARPET = ['< 1,000 sqft', '1,000 - 3,000 sqft', '3,000 - 8,000 sqft', '8,000+ sqft'];
const COMM_BUDGET = [
  { id: 'under_50k', label: 'Under ₹50k/mo' },
  { id: '50k_1.5L', label: '₹50k - ₹1.5L/mo' },
  { id: '1.5L_5L', label: '₹1.5L - ₹5L/mo' },
  { id: '5L_plus', label: 'Enterprise ₹5L+/mo' },
];
const COMM_LOCALITIES = ['All Business Hubs', 'BKC Financial Hub', 'Lower Parel', 'Andheri East MIDC', 'Navi Mumbai & Thane'];
const COMM_FURNISHING = ['Plug & Play Furnished', 'Warm Shell', 'Bare Shell'];

// POPULAR CITIES & LOCALITIES FOR QUICK SELECTION
const POPULAR_CITY_SUGGESTIONS = [
  'All Mumbai Metro',
  'Bandra West, Mumbai',
  'Andheri West, Mumbai',
  'Powai, Mumbai',
  'Worli, Mumbai',
  'Lower Parel, Mumbai',
  'Juhu, Mumbai',
  'BKC, Mumbai',
  'Thane West',
  'Navi Mumbai (Vashi/Airoli)',
  'Pune (Koregaon / Hinjewadi)',
  'Bangalore (Indiranagar / HSR)',
  'Delhi NCR (Gurgaon / Noida)',
];

export const V4CategoryIntakeModal: React.FC<V4CategoryIntakeModalProps> = ({
  visible,
  category,
  onClose,
  onApply,
  onSkip,
}) => {
  // Rental States
  const [rentalBhk, setRentalBhk] = useState<string>('2 BHK');
  const [rentalBudget, setRentalBudget] = useState<string>('30k_50k');
  const [rentalLocality, setRentalLocality] = useState<string>('All Mumbai Metro');
  const [rentalFurnish, setRentalFurnish] = useState<string>('Fully Furnished');

  // PG States
  const [pgGender, setPgGender] = useState<string>('any');
  const [pgSharing, setPgSharing] = useState<string>('Double Sharing');
  const [pgBudget, setPgBudget] = useState<string>('12k_20k');
  const [pgLocality, setPgLocality] = useState<string>('All Mumbai');
  const [pgFood, setPgFood] = useState<string>('🍲 3 Meals Included');

  // Commercial States
  const [commType, setCommType] = useState<string>('office');
  const [commCarpet, setCommCarpet] = useState<string>('1,000 - 3,000 sqft');
  const [commBudget, setCommBudget] = useState<string>('50k_1.5L');
  const [commLocality, setCommLocality] = useState<string>('All Business Hubs');
  const [commFurnish, setCommFurnish] = useState<string>('Plug & Play Furnished');

  // Manual City & Locality Input Inline Expansion State
  const [isManualLocOpen, setIsManualLocOpen] = useState(false);
  const [manualCityInput, setManualCityInput] = useState('');

  const getCurrentLocality = () => {
    if (category === 'rental') return rentalLocality;
    if (category === 'pg') return pgLocality;
    return commLocality;
  };

  const handleSelectCustomLocality = (loc: string) => {
    if (category === 'rental') setRentalLocality(loc);
    else if (category === 'pg') setPgLocality(loc);
    else setCommLocality(loc);
    setIsManualLocOpen(false);
    setManualCityInput('');
  };

  const handleConfirmManualCity = () => {
    if (manualCityInput.trim().length > 0) {
      handleSelectCustomLocality(manualCityInput.trim());
    }
  };

  const handleReset = () => {
    if (category === 'rental') {
      setRentalBhk('2 BHK');
      setRentalBudget('30k_50k');
      setRentalLocality('All Mumbai Metro');
      setRentalFurnish('Fully Furnished');
    } else if (category === 'pg') {
      setPgGender('any');
      setPgSharing('Double Sharing');
      setPgBudget('12k_20k');
      setPgLocality('All Mumbai');
      setPgFood('🍲 3 Meals Included');
    } else {
      setCommType('office');
      setCommCarpet('1,000 - 3,000 sqft');
      setCommBudget('50k_1.5L');
      setCommLocality('All Business Hubs');
      setCommFurnish('Plug & Play Furnished');
    }
    setIsManualLocOpen(false);
    setManualCityInput('');
  };

  const handleApply = () => {
    if (category === 'rental') {
      onApply({
        bhk: rentalBhk,
        priceId: rentalBudget,
        locality: rentalLocality,
        furnishing: rentalFurnish,
      });
    } else if (category === 'pg') {
      onApply({
        gender: pgGender,
        sharing: pgSharing,
        priceId: pgBudget,
        locality: pgLocality,
        food: pgFood,
      });
    } else {
      onApply({
        commType,
        carpetArea: commCarpet,
        priceId: commBudget,
        locality: commLocality,
        furnishing: commFurnish,
      });
    }
  };

  const getHeaderInfo = () => {
    if (category === 'rental') {
      return {
        title: 'Find Your Ideal Home',
        subtitle: 'Tell us what you need for a verified listing direct owner match',
        icon: Home,
        color: '#0F766E',
      };
    }
    if (category === 'pg') {
      return {
        title: 'Find Your Ideal PG & Hostel',
        subtitle: 'Choose sharing, meals & budget for verified accommodations',
        icon: Users,
        color: '#8B5CF6',
      };
    }
    return {
      title: 'Find Your Commercial Space',
      subtitle: 'Specify office, plot, studio, or retail size & corridor',
      icon: Briefcase,
      color: '#0F766E',
    };
  };

  const info = getHeaderInfo();
  const Icon = info.icon;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View style={styles.modalCard}>
          {/* Top Drag Indicator */}
          <View style={styles.dragHandle} />

          {/* Modal Header */}
          <View style={styles.headerRow}>
            <View style={[styles.headerIconBox, { backgroundColor: '#F0FDFA' }]}>
              <Icon size={20} color={info.color} strokeWidth={2.4} />
            </View>

            <View style={styles.headerTextCol}>
              <Text style={styles.headerTitle}>{info.title}</Text>
              <Text style={styles.headerSub}>{info.subtitle}</Text>
            </View>

            <Pressable style={styles.closeBtn} onPress={onClose}>
              <X size={17} color="#64748B" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollBodyContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* ============================================================= */}
            {/* 0. LOCATION BAR WITH ARROW & MANUAL CITY ENTRY                */}
            {/* ============================================================= */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Target City / Locality</Text>
                <Pressable
                  style={styles.enterCityLink}
                  onPress={() => setIsManualLocOpen(!isManualLocOpen)}
                >
                  <Text style={styles.enterCityLinkText}>
                    {isManualLocOpen ? 'Close City Input' : 'Type Custom City ➔'}
                  </Text>
                </Pressable>
              </View>

              {/* Location Bar with Arrow */}
              <Pressable
                style={[
                  styles.manualLocationBar,
                  isManualLocOpen && styles.manualLocationBarActive,
                ]}
                onPress={() => setIsManualLocOpen(!isManualLocOpen)}
              >
                <View style={styles.manualLocationLeft}>
                  <MapPin size={16} color="#0F766E" strokeWidth={2.4} />
                  <View style={styles.manualLocationTextCol}>
                    <Text style={styles.manualLocationLabel}>Current Selected City / Area</Text>
                    <Text style={styles.manualLocationValue} numberOfLines={1}>
                      {getCurrentLocality()}
                    </Text>
                  </View>
                </View>

                <View style={styles.arrowCircle}>
                  {isManualLocOpen ? (
                    <ChevronDown size={16} color="#0F766E" strokeWidth={2.6} />
                  ) : (
                    <ChevronRight size={16} color="#0F766E" strokeWidth={2.6} />
                  )}
                </View>
              </Pressable>

              {/* INLINE MANUAL CITY INPUT CARD */}
              {isManualLocOpen ? (
                <View style={styles.inlineManualCard}>
                  <Text style={styles.inlineCardHeading}>
                    Enter Any City or Neighborhood:
                  </Text>
                  
                  <View style={styles.inlineInputRow}>
                    <Search size={15} color="#0F766E" strokeWidth={2.4} />
                    <TextInput
                      style={styles.inlineTextInput}
                      placeholder="e.g. Pune, Dadar, Thane, Bangalore, Delhi..."
                      placeholderTextColor="#94A3B8"
                      value={manualCityInput}
                      onChangeText={setManualCityInput}
                      onSubmitEditing={handleConfirmManualCity}
                      returnKeyType="done"
                      autoFocus
                    />
                    {manualCityInput.length > 0 && (
                      <Pressable
                        onPress={() => setManualCityInput('')}
                        style={{ padding: 4 }}
                      >
                        <X size={14} color="#64748B" />
                      </Pressable>
                    )}
                  </View>

                  {/* Apply Custom City Button */}
                  {manualCityInput.trim().length > 0 && (
                    <Pressable
                      style={styles.useCustomCityBtn}
                      onPress={handleConfirmManualCity}
                    >
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                      <Text style={styles.useCustomCityBtnText}>
                        Apply "{manualCityInput.trim()}"
                      </Text>
                    </Pressable>
                  )}

                  {/* Quick Select Popular Cities */}
                  <Text style={styles.popularHeading}>Popular Cities Across India:</Text>
                  <View style={styles.popularCitiesGrid}>
                    {POPULAR_CITY_SUGGESTIONS.map((cityOpt) => {
                      const isSelected = getCurrentLocality() === cityOpt;
                      return (
                        <Pressable
                          key={cityOpt}
                          style={[
                            styles.popularCityChip,
                            isSelected && styles.popularCityChipActive,
                          ]}
                          onPress={() => handleSelectCustomLocality(cityOpt)}
                        >
                          <MapPin
                            size={10}
                            color={isSelected ? '#FFFFFF' : '#0F766E'}
                            strokeWidth={2.4}
                          />
                          <Text
                            style={[
                              styles.popularCityText,
                              isSelected && styles.popularCityTextActive,
                            ]}
                          >
                            {cityOpt}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ) : (
                /* Quick Locality Horizontal Chips when inline card is closed */
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsScroll}
                >
                  {(category === 'rental'
                    ? RENTAL_LOCALITIES
                    : category === 'pg'
                    ? PG_LOCALITIES
                    : COMM_LOCALITIES
                  ).map((loc) => {
                    const isSelected = getCurrentLocality() === loc;
                    return (
                      <Pressable
                        key={loc}
                        style={[styles.chip, isSelected && styles.chipActive]}
                        onPress={() => handleSelectCustomLocality(loc)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isSelected && styles.chipTextActive,
                          ]}
                        >
                          {loc}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              )}
            </View>

            {/* ------------------------------------------------------------- */}
            {/* 1. RENTAL (PROPERTY FOR RENT) FORM FIELDS                     */}
            {/* ------------------------------------------------------------- */}
            {category === 'rental' && (
              <>
                {/* BHK Config */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Space Layout (BHK)</Text>
                  <View style={styles.chipsGrid}>
                    {RENTAL_BHK.map((bhk) => {
                      const isSelected = rentalBhk === bhk;
                      return (
                        <Pressable
                          key={bhk}
                          style={[styles.gridChip, isSelected && styles.gridChipActive]}
                          onPress={() => setRentalBhk(bhk)}
                        >
                          {isSelected && (
                            <Check size={12} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 4 }} />
                          )}
                          <Text
                            style={[
                              styles.gridChipText,
                              isSelected && styles.gridChipTextActive,
                            ]}
                          >
                            {bhk}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* Budget */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Monthly Rent Budget</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsScroll}
                  >
                    {RENTAL_BUDGET.map((b) => {
                      const isSelected = rentalBudget === b.id;
                      return (
                        <Pressable
                          key={b.id}
                          style={[styles.chip, isSelected && styles.chipActive]}
                          onPress={() => setRentalBudget(b.id)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextActive,
                            ]}
                          >
                            {b.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Furnishing */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Furnishing Status</Text>
                  <View style={styles.chipsRow}>
                    {RENTAL_FURNISHING.map((f) => {
                      const isSelected = rentalFurnish === f;
                      return (
                        <Pressable
                          key={f}
                          style={[styles.chip, isSelected && styles.chipActive]}
                          onPress={() => setRentalFurnish(f)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextActive,
                            ]}
                          >
                            {f}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 2. PG & HOSTEL FORM FIELDS                                    */}
            {/* ------------------------------------------------------------- */}
            {category === 'pg' && (
              <>
                {/* Gender Allowed */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Gender / Resident Type</Text>
                  <View style={styles.chipsGrid}>
                    {PG_GENDERS.map((g) => {
                      const isSelected = pgGender === g.id;
                      return (
                        <Pressable
                          key={g.id}
                          style={[styles.gridChip, isSelected && styles.gridChipActive]}
                          onPress={() => setPgGender(g.id)}
                        >
                          <Text
                            style={[
                              styles.gridChipText,
                              isSelected && styles.gridChipTextActive,
                            ]}
                          >
                            {g.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* Sharing Preference */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Room Sharing Preference</Text>
                  <View style={styles.chipsRow}>
                    {PG_SHARING.map((s) => {
                      const isSelected = pgSharing === s;
                      return (
                        <Pressable
                          key={s}
                          style={[styles.chip, isSelected && styles.chipActive]}
                          onPress={() => setPgSharing(s)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextActive,
                            ]}
                          >
                            {s}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* Budget */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Monthly Budget per Bed</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsScroll}
                  >
                    {PG_BUDGET.map((b) => {
                      const isSelected = pgBudget === b.id;
                      return (
                        <Pressable
                          key={b.id}
                          style={[styles.chip, isSelected && styles.chipActive]}
                          onPress={() => setPgBudget(b.id)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextActive,
                            ]}
                          >
                            {b.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Meal Preference */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Meal & Food Plan</Text>
                  <View style={styles.chipsRow}>
                    {PG_FOOD.map((food) => {
                      const isSelected = pgFood === food;
                      return (
                        <Pressable
                          key={food}
                          style={[styles.chip, isSelected && styles.chipActive]}
                          onPress={() => setPgFood(food)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextActive,
                            ]}
                          >
                            {food}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 3. COMMERCIAL FORM FIELDS                                     */}
            {/* ------------------------------------------------------------- */}
            {category === 'commercial' && (
              <>
                {/* Commercial Type */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Commercial Space Type</Text>
                  <View style={styles.chipsGrid}>
                    {COMM_TYPES.map((t) => {
                      const isSelected = commType === t.id;
                      return (
                        <Pressable
                          key={t.id}
                          style={[styles.gridChip, isSelected && styles.gridChipActive]}
                          onPress={() => setCommType(t.id)}
                        >
                          <Text
                            style={[
                              styles.gridChipText,
                              isSelected && styles.gridChipTextActive,
                            ]}
                          >
                            {t.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* Carpet Area */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Carpet Area / Scale</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsScroll}
                  >
                    {COMM_CARPET.map((c) => {
                      const isSelected = commCarpet === c;
                      return (
                        <Pressable
                          key={c}
                          style={[styles.chip, isSelected && styles.chipActive]}
                          onPress={() => setCommCarpet(c)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextActive,
                            ]}
                          >
                            {c}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Monthly Rent Budget */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Monthly Commercial Budget</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsScroll}
                  >
                    {COMM_BUDGET.map((b) => {
                      const isSelected = commBudget === b.id;
                      return (
                        <Pressable
                          key={b.id}
                          style={[styles.chip, isSelected && styles.chipActive]}
                          onPress={() => setCommBudget(b.id)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextActive,
                            ]}
                          >
                            {b.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Commercial Furnishing */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Office Furnishing</Text>
                  <View style={styles.chipsRow}>
                    {COMM_FURNISHING.map((f) => {
                      const isSelected = commFurnish === f;
                      return (
                        <Pressable
                          key={f}
                          style={[styles.chip, isSelected && styles.chipActive]}
                          onPress={() => setCommFurnish(f)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextActive,
                            ]}
                          >
                            {f}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </>
            )}

            {/* Verified Marketplace Reassurance Strip */}
            <View style={styles.trustStrip}>
              <ShieldCheck size={14} color="#16A34A" strokeWidth={2.4} />
              <Text style={styles.trustStripText}>
                All matches are direct verified listings with 100% verified listing.
              </Text>
            </View>
          </ScrollView>

          {/* Footer CTAs */}
          <View style={styles.footerRow}>
            <Pressable style={styles.resetBtn} onPress={handleReset}>
              <RotateCcw size={14} color="#64748B" />
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>

            <Pressable style={styles.skipBtn} onPress={onSkip}>
              <Text style={styles.skipBtnText}>View All</Text>
            </Pressable>

            <Pressable style={styles.applyBtn} onPress={handleApply}>
              <Sparkles size={14} color="#FFFFFF" strokeWidth={2.6} />
              <Text style={styles.applyBtnText}>Show Matches</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 18,
    maxHeight: SCREEN_HEIGHT * 0.86,
    ...V4_SHADOWS.floating,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  headerTextCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    maxHeight: SCREEN_HEIGHT * 0.58,
  },
  scrollBodyContent: {
    paddingBottom: 10,
  },
  section: {
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 2,
  },
  enterCityLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  enterCityLinkText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  manualLocationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginBottom: 10,
    ...V4_SHADOWS.soft,
  },
  manualLocationBarActive: {
    borderColor: '#0F766E',
    backgroundColor: '#E6FFFA',
  },
  manualLocationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  manualLocationTextCol: {
    flex: 1,
  },
  manualLocationLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F766E',
    letterSpacing: 0.3,
  },
  manualLocationValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  inlineManualCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  inlineCardHeading: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  inlineInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 42,
    borderWidth: 1,
    borderColor: '#0F766E',
    marginBottom: 8,
  },
  inlineTextInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    paddingVertical: 0,
  },
  useCustomCityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0F766E',
    paddingVertical: 9,
    borderRadius: 10,
    marginBottom: 10,
  },
  useCustomCityBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  popularHeading: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  popularCitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  popularCityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  popularCityChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  popularCityText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  popularCityTextActive: {
    color: '#FFFFFF',
  },
  chipsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  gridChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gridChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  gridChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  gridChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  trustStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  trustStripText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  resetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  skipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  skipBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  applyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0F766E',
    paddingVertical: 11,
    borderRadius: 14,
    ...V4_SHADOWS.soft,
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
