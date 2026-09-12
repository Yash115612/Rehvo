import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import { X, Check, RotateCcw, Sparkles, SlidersHorizontal, ShieldCheck } from 'lucide-react-native';

export interface V4FlatmateFilterState {
  gender?: string;
  roomType?: string;
  budgetMin?: number;
  budgetMax?: number;
  foodPreference?: string;
  smoking?: string;
  drinking?: string;
  pets?: string;
  sleepHabit?: string;
  workStyle?: string;
  moveInTiming?: string;
  verifiedOnly?: boolean;
  nearMetro?: boolean;
  nearItPark?: boolean;
  nearCollege?: boolean;
  radiusKm?: number;
  cleanliness?: string;
  guestPolicy?: string;
}

interface V4FilterBottomSheetProps {
  visible: boolean;
  filters: V4FlatmateFilterState;
  onClose: () => void;
  onApply: (newFilters: V4FlatmateFilterState) => void;
  onReset: () => void;
}

export const V4FilterBottomSheet: React.FC<V4FilterBottomSheetProps> = ({
  visible,
  filters,
  onClose,
  onApply,
  onReset,
}) => {
  const [localFilters, setLocalFilters] = useState<V4FlatmateFilterState>(filters);

  // Sync with prop when opened
  React.useEffect(() => {
    if (visible) {
      setLocalFilters(filters);
    }
  }, [visible, filters]);

  const toggleOption = (key: keyof V4FlatmateFilterState, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? undefined : value,
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({});
    onReset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <SlidersHorizontal size={18} color="#059669" strokeWidth={2.4} />
              <Text style={styles.title}>Filter Flatmates</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Pressable style={styles.resetBtn} onPress={handleReset} hitSlop={8}>
                <RotateCcw size={14} color="#64748B" />
                <Text style={styles.resetBtnText}>Reset</Text>
              </Pressable>

              <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
                <X size={20} color="#0F172A" />
              </Pressable>
            </View>
          </View>

          {/* Scrollable Filter Categories */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* 1. Verified Only Toggle */}
            <View style={styles.toggleRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                <View style={styles.verifiedIconWrap}>
                  <ShieldCheck size={18} color="#059669" strokeWidth={2.4} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleTitle}>DigiLocker KYC Verified Only</Text>
                  <Text style={styles.toggleSub}>Show roommates with validated Govt Aadhaar ID</Text>
                </View>
              </View>
              <Switch
                value={Boolean(localFilters.verifiedOnly)}
                onValueChange={(val) => setLocalFilters((prev) => ({ ...prev, verifiedOnly: val }))}
                trackColor={{ false: '#E2E8F0', true: '#A7F3D0' }}
                thumbColor={localFilters.verifiedOnly ? '#059669' : '#FFFFFF'}
              />
            </View>

            {/* 2. Gender Preference */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Roommate Gender</Text>
              <View style={styles.chipsRow}>
                {[
                  { label: 'Any Gender', value: 'Any' },
                  { label: '👩 Girls Only', value: 'Female' },
                  { label: '👨 Boys Only', value: 'Male' },
                ].map((item) => {
                  const isSelected = localFilters.gender === item.value;
                  return (
                    <Pressable
                      key={item.value}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => toggleOption('gender', item.value)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 3. Room Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Room Type Preference</Text>
              <View style={styles.chipsRow}>
                {['Private Room', 'Shared Room', 'Entire Flat'].map((type) => {
                  const isSelected = localFilters.roomType === type;
                  return (
                    <Pressable
                      key={type}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => toggleOption('roomType', type)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {type}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 4. Budget Range Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Budget Bandwidth (per month)</Text>
              <View style={styles.chipsRow}>
                {[
                  { label: 'Under ₹15k', min: 0, max: 15000 },
                  { label: '₹15k – ₹25k', min: 15000, max: 25000 },
                  { label: '₹25k – ₹40k', min: 25000, max: 40000 },
                  { label: '₹40k – ₹60k+', min: 40000, max: 80000 },
                ].map((bracket) => {
                  const isSelected =
                    localFilters.budgetMin === bracket.min && localFilters.budgetMax === bracket.max;
                  return (
                    <Pressable
                      key={bracket.label}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => {
                        if (isSelected) {
                          setLocalFilters((prev) => ({
                            ...prev,
                            budgetMin: undefined,
                            budgetMax: undefined,
                          }));
                        } else {
                          setLocalFilters((prev) => ({
                            ...prev,
                            budgetMin: bracket.min,
                            budgetMax: bracket.max,
                          }));
                        }
                      }}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {bracket.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 5. Food & Diet Preference */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Diet & Kitchen</Text>
              <View style={styles.chipsRow}>
                {['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'].map((food) => {
                  const isSelected = localFilters.foodPreference === food;
                  return (
                    <Pressable
                      key={food}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => toggleOption('foodPreference', food)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {food}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 6. Smoking Policy */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Smoking Policy</Text>
              <View style={styles.chipsRow}>
                {['Non-smoker', 'Outside Only', 'Social Smoker'].map((smoke) => {
                  const isSelected = localFilters.smoking === smoke;
                  return (
                    <Pressable
                      key={smoke}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => toggleOption('smoking', smoke)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {smoke}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 7. Pets Preference */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pet Policy</Text>
              <View style={styles.chipsRow}>
                {['Pet Friendly', 'Have Pets', 'No Pets'].map((pet) => {
                  const isSelected = localFilters.pets === pet;
                  return (
                    <Pressable
                      key={pet}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => toggleOption('pets', pet)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {pet}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 8. Sleep & Schedule */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sleep Schedule</Text>
              <View style={styles.chipsRow}>
                {['Early Riser', 'Night Owl', 'Flexible'].map((sleep) => {
                  const isSelected = localFilters.sleepHabit === sleep;
                  return (
                    <Pressable
                      key={sleep}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => toggleOption('sleepHabit', sleep)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {sleep}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 9. Work Style */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Work Routine</Text>
              <View style={styles.chipsRow}>
                {['Work From Home', 'Office Goer', 'Hybrid'].map((work) => {
                  const isSelected = localFilters.workStyle === work;
                  return (
                    <Pressable
                      key={work}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => toggleOption('workStyle', work)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {work}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 10. Transit & Anchor Hubs */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Transit & Commute Hubs</Text>
              <View style={styles.chipsRow}>
                {[
                  { label: '🚇 Near Metro', key: 'nearMetro' as const },
                  { label: '💼 Near Tech Park', key: 'nearItPark' as const },
                  { label: '🎓 Near College', key: 'nearCollege' as const },
                ].map((hub) => {
                  const isSelected = Boolean(localFilters[hub.key]);
                  return (
                    <Pressable
                      key={hub.key}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          [hub.key]: !prev[hub.key],
                        }))
                      }
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {hub.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 11. Nearby Search Radius */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nearby Radius</Text>
              <View style={styles.chipsRow}>
                {[
                  { label: 'Within 2 km', value: 2 },
                  { label: 'Within 5 km', value: 5 },
                  { label: 'Within 10 km', value: 10 },
                ].map((r) => {
                  const isSelected = localFilters.radiusKm === r.value;
                  return (
                    <Pressable
                      key={r.value}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          radiusKm: prev.radiusKm === r.value ? undefined : r.value,
                        }))
                      }
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {r.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 12. Cleanliness Standard */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cleanliness Standard</Text>
              <View style={styles.chipsRow}>
                {['Tidy & Spotless', 'Moderate', 'Relaxed'].map((clean) => {
                  const isSelected = localFilters.cleanliness === clean;
                  return (
                    <Pressable
                      key={clean}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => toggleOption('cleanliness', clean)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {clean}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer Action */}
          <View style={styles.footer}>
            <Pressable style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '88%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDFA',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  verifiedIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  toggleSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  chipSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextSelected: {
    color: '#059669',
    fontWeight: '800',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  applyBtn: {
    height: 52,
    backgroundColor: '#059669',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
