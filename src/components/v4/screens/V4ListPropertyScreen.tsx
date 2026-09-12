import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Building,
  Home,
  MapPin,
  IndianRupee,
  Sparkles,
  Check,
  Calendar,
  Layers,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { useAppStore } from '../../../store/useAppStore';
import { V4HostPlanGateModal } from '../ui/V4HostPlanGateModal';
import { V4AuthGate } from '../ui/V4AuthGate';

const PROPERTY_TYPES = [
  { id: 'apartment', label: 'Property for Rent (Flat/House)' },
  { id: 'villa', label: 'Luxury Villa' },
  { id: 'house', label: 'Independent House' },
  { id: 'penthouse', label: 'Sky Penthouse' },
  { id: 'pg', label: 'PG & Hostel' },
  { id: 'commercial', label: 'Commercial Office' },
];

const BHK_OPTIONS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];
const FURNISHING_OPTIONS = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
const TENANT_OPTIONS = ['All Welcome', 'Family Only', 'Bachelors / Working Pros', 'Couples'];

const AMENITY_TAGS = [
  '24x7 Security',
  'Covered Parking',
  'Swimming Pool',
  'Clubhouse / Gym',
  'Power Backup',
  'High-Speed Elevators',
  'Modular Kitchen',
  'Sea / Skyline View',
  'Pet Friendly',
  'Balcony Deck',
  'Gas Pipeline',
  'EV Charging Point',
];

export const V4ListPropertyScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { canListNewProperty, propertyDraft, savePropertyDraft, clearPropertyDraft, isAuthenticated, activeMode } = useAppStore();

  const [gateModalVisible, setGateModalVisible] = useState(false);
  const [gateReason, setGateReason] = useState<'NO_PLAN' | 'LIMIT_REACHED'>('LIMIT_REACHED');

  const [propType, setPropType] = useState(propertyDraft?.propType || 'apartment');
  const [bhk, setBhk] = useState(propertyDraft?.bhk || '2 BHK');
  const [title, setTitle] = useState(propertyDraft?.title || '');
  const [society, setSociety] = useState(propertyDraft?.society || '');
  const [locality, setLocality] = useState(propertyDraft?.locality || '');
  const [city, setCity] = useState(propertyDraft?.city || 'Mumbai');
  const [areaSqft, setAreaSqft] = useState(propertyDraft?.areaSqft || '');
  const [rent, setRent] = useState(propertyDraft?.rent || '');
  const [deposit, setDeposit] = useState(propertyDraft?.deposit || '');
  const [furnishing, setFurnishing] = useState(propertyDraft?.furnishing || 'Fully Furnished');
  const [tenantType, setTenantType] = useState(propertyDraft?.tenantType || 'All Welcome');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    propertyDraft?.selectedAmenities || [
      '24x7 Security',
      'Covered Parking',
      'Power Backup',
    ]
  );

  const persistDraft = () => {
    savePropertyDraft({
      propType,
      bhk,
      title,
      society,
      locality,
      city,
      areaSqft,
      rent,
      deposit,
      furnishing,
      tenantType,
      selectedAmenities,
    });
  };

  const toggleAmenity = (item: string) => {
    let updated: string[];
    if (selectedAmenities.includes(item)) {
      updated = selectedAmenities.filter((a) => a !== item);
    } else {
      updated = [...selectedAmenities, item];
    }
    setSelectedAmenities(updated);
    savePropertyDraft({ selectedAmenities: updated });
  };

  const handleNext = () => {
    persistDraft();
    const check = canListNewProperty();
    if (!check.allowed) {
      setGateReason(check.reason || 'LIMIT_REACHED');
      setGateModalVisible(true);
      return;
    }
    if (!title && !society) {
      Alert.alert('Required Fields', 'Please enter property or society name to proceed.');
      return;
    }
    const prefix = activeMode === 'owner' ? '/(owner)' : '/(renter)';
    router.push(`${prefix}/listing/photos` as any);
  };

  const handleClearDraft = () => {
    clearPropertyDraft();
    setTitle('');
    setSociety('');
    setLocality('');
    setAreaSqft('');
    setRent('');
    setDeposit('');
    setPropType('apartment');
    setBhk('2 BHK');
    setFurnishing('Fully Furnished');
    setTenantType('All Welcome');
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            persistDraft();
            router.back();
          }}
        >
          <ArrowLeft size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>List Your Property</Text>
          <Text style={styles.headerSubtitle}>Step 1 of 3: Basic Details</Text>
        </View>
        <View style={{ width: 38 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: '33%' }]} />
      </View>

      {/* Draft Restored Banner */}
      {!!(propertyDraft && (propertyDraft.title || propertyDraft.society || propertyDraft.rent)) && (
        <View style={styles.draftRestoredBar}>
          <View style={styles.draftRestoredLeft}>
            <Sparkles size={13} color="#0F766E" strokeWidth={2.5} />
            <Text style={styles.draftRestoredText}>
              Draft restored from your last session
            </Text>
          </View>
          <Pressable onPress={handleClearDraft} hitSlop={8}>
            <Text style={styles.draftClearText}>Clear</Text>
          </Pressable>
        </View>
      )}

      {!isAuthenticated ? (
        <V4AuthGate
          icon={Building}
          title="List Your Property on REHVO"
          description="Sign in to post your flat, house, or PG listing, reach verified tenants directly, and enjoy verified listing."
          benefits={[
            'Reach 50,000+ active renters & flatmate seekers',
            'Free listing with instant AI property descriptions',
            'Direct tenant chat and visit scheduling',
            'Automated rent agreements and payment collection',
          ]}
          fullScreen={false}
        />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
        {/* Verified Marketplace Badge Card */}
        <View style={styles.zeroFeePill}>
          <Sparkles size={14} color="#0F766E" strokeWidth={2.5} />
          <Text style={styles.zeroFeePillText}>
            100% Free Listing • 0% Owner Commission • ₹5,000 Bonus on First Lease
          </Text>
        </View>

        {/* Property Type Selection */}
        <Text style={styles.sectionHeading}>1. PROPERTY TYPE</Text>
        <View style={styles.grid2}>
          {PROPERTY_TYPES.map((pt) => {
            const isSelected = propType === pt.id;
            return (
              <Pressable
                key={pt.id}
                style={[styles.typeCard, isSelected && styles.typeCardActive]}
                onPress={() => setPropType(pt.id)}
              >
                <Text style={[styles.typeCardText, isSelected && styles.typeCardTextActive]}>
                  {pt.label}
                </Text>
                {isSelected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
              </Pressable>
            );
          })}
        </View>

        {/* BHK Config */}
        <Text style={styles.sectionHeading}>2. BEDROOM CONFIGURATION (BHK)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalChips}>
          {BHK_OPTIONS.map((item) => {
            const isSelected = bhk === item;
            return (
              <Pressable
                key={item}
                style={[styles.bhkChip, isSelected && styles.bhkChipActive]}
                onPress={() => setBhk(item)}
              >
                <Text style={[styles.bhkChipText, isSelected && styles.bhkChipTextActive]}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Location & Title */}
        <Text style={styles.sectionHeading}>3. LOCATION & NAME</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Property / Listing Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Modern Sea-Facing 2 BHK in Lodha Park"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Society / Tower / Building Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Lodha World Towers"
            placeholderTextColor="#94A3B8"
            value={society}
            onChangeText={setSociety}
          />
        </View>

        <View style={styles.row2}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>Locality / Area</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Worli / Lower Parel"
              placeholderTextColor="#94A3B8"
              value={locality}
              onChangeText={setLocality}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.inputLabel}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="Mumbai"
              placeholderTextColor="#94A3B8"
              value={city}
              onChangeText={setCity}
            />
          </View>
        </View>

        {/* Area & Pricing */}
        <Text style={styles.sectionHeading}>4. CARPET AREA & PRICING</Text>
        <View style={styles.row2}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>Carpet Area (sqft)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 1250"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={areaSqft}
              onChangeText={setAreaSqft}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.inputLabel}>Monthly Rent (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 65000"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={rent}
              onChangeText={setRent}
            />
          </View>
        </View>

        {/* Furnishing */}
        <Text style={styles.sectionHeading}>5. FURNISHING STATUS</Text>
        <View style={styles.row3}>
          {FURNISHING_OPTIONS.map((f) => {
            const isSelected = furnishing === f;
            return (
              <Pressable
                key={f}
                style={[styles.pillSelect, isSelected && styles.pillSelectActive]}
                onPress={() => setFurnishing(f)}
              >
                <Text style={[styles.pillSelectText, isSelected && styles.pillSelectTextActive]}>
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Amenities Selection */}
        <Text style={styles.sectionHeading}>6. AMENITIES & HIGHLIGHTS</Text>
        <View style={styles.amenitiesWrap}>
          {AMENITY_TAGS.map((am) => {
            const isSelected = selectedAmenities.includes(am);
            return (
              <Pressable
                key={am}
                style={[styles.amenityChip, isSelected && styles.amenityChipActive]}
                onPress={() => toggleAmenity(am)}
              >
                {isSelected ? (
                  <Check size={12} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 4 }} />
                ) : (
                  <Text style={{ marginRight: 4, fontSize: 11 }}>+</Text>
                )}
                <Text style={[styles.amenityChipText, isSelected && styles.amenityChipTextActive]}>
                  {am}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Next Button */}
        <V4Button
          title="Continue to Photos & Media →"
          variant="primary"
          size="lg"
          onPress={handleNext}
          style={styles.nextBtn}
        />
      </ScrollView>
      )}

      <V4HostPlanGateModal
        visible={gateModalVisible}
        onClose={() => {
          setGateModalVisible(false);
          router.back();
        }}
        reason={gateReason}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E6EEF0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: V4_COLORS.primary,
    marginTop: 2,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#E2ECEF',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: V4_COLORS.primary,
  },
  draftRestoredBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDFA',
    borderBottomWidth: 1,
    borderBottomColor: '#CCFBF1',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  draftRestoredLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  draftRestoredText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  draftClearText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  zeroFeePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FFFA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  zeroFeePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
    marginLeft: 6,
    flex: 1,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 6,
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  typeCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2ECEF',
  },
  typeCardActive: {
    backgroundColor: V4_COLORS.primary,
    borderColor: V4_COLORS.primary,
  },
  typeCardText: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  typeCardTextActive: {
    color: '#FFFFFF',
  },
  horizontalChips: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  bhkChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2ECEF',
  },
  bhkChipActive: {
    backgroundColor: V4_COLORS.primary,
    borderColor: V4_COLORS.primary,
  },
  bhkChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  bhkChipTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2ECEF',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
  },
  row2: {
    flexDirection: 'row',
  },
  row3: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  pillSelect: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2ECEF',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillSelectActive: {
    backgroundColor: V4_COLORS.primary,
    borderColor: V4_COLORS.primary,
  },
  pillSelectText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  pillSelectTextActive: {
    color: '#FFFFFF',
  },
  amenitiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2ECEF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  amenityChipActive: {
    backgroundColor: V4_COLORS.primary,
    borderColor: V4_COLORS.primary,
  },
  amenityChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
  },
  amenityChipTextActive: {
    color: '#FFFFFF',
  },
  nextBtn: {
    marginTop: 6,
    marginBottom: 24,
  },
});
