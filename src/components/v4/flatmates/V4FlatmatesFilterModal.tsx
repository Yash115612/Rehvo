import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Sparkles,
  ShieldCheck,
  Users,
  Utensils,
  Cigarette,
  Wine,
  Dog,
  Languages,
  Calendar,
} from 'lucide-react-native';
import { FlatmateFilter } from '../../../types';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';

interface V4FlatmatesFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FlatmateFilter;
  onApplyFilters?: (newFilters: FlatmateFilter) => void;
  onResetFilters?: () => void;
  onApply?: (newFilters: FlatmateFilter) => void;
  onReset?: () => void;
}

const GENDERS = ['All', 'Female', 'Male'];
const BUDGET_PRESETS = [
  { label: 'Any Budget', min: 0, max: 100000 },
  { label: 'Under ₹20K', min: 0, max: 20000 },
  { label: '₹20K – ₹35K', min: 20000, max: 35000 },
  { label: '₹35K – ₹50K', min: 35000, max: 50000 },
  { label: '₹50K+', min: 50000, max: 150000 },
];
const FOOD_OPTIONS = ['All', 'Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'];
const SMOKING_OPTIONS = ['All', 'Non-smoker', 'Social', 'Regular'];
const DRINKING_OPTIONS = ['All', 'Non-drinker', 'Social', 'Regular'];
const PET_OPTIONS = ['All', 'Pet Friendly', 'No Pets'];
const MOVE_IN_OPTIONS = ['All', 'Immediate', 'Within 15 Days', 'Next Month', 'Flexible'];
const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Gujarati'];

export const V4FlatmatesFilterModal: React.FC<V4FlatmatesFilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  onApply,
  onReset,
}) => {
  const [localFilters, setLocalFilters] = useState<FlatmateFilter>(filters);

  const handleApply = () => {
    if (onApply) {
      onApply(localFilters);
    } else if (onApplyFilters) {
      onApplyFilters(localFilters);
    }
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({});
    if (onReset) {
      onReset();
    } else if (onResetFilters) {
      onResetFilters();
    }
  };

  const toggleLanguage = (lang: string) => {
    const current = localFilters.languages || [];
    if (current.includes(lang)) {
      setLocalFilters({
        ...localFilters,
        languages: current.filter((l) => l !== lang),
      });
    } else {
      setLocalFilters({
        ...localFilters,
        languages: [...current, lang],
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          {/* Top Handle */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <SlidersHorizontal size={18} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.title}>Filter Flatmates</Text>
            </View>

            <View style={styles.headerRight}>
              <Pressable style={styles.resetBtn} onPress={handleReset} hitSlop={8}>
                <RotateCcw size={13} color="#64748B" strokeWidth={2.2} />
                <Text style={styles.resetText}>Reset</Text>
              </Pressable>

              <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
                <X size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
              </Pressable>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* 1. GENDER PREFERENCE */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>GENDER PREFERENCE</Text>
              <View style={styles.chipRow}>
                {GENDERS.map((g) => {
                  const isSelected = (localFilters.gender || 'All') === g;
                  return (
                    <Pressable
                      key={g}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          gender: g as any,
                        })
                      }
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {g}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 2. BUDGET RANGE */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>MONTHLY BUDGET BAND</Text>
              <View style={styles.chipRow}>
                {BUDGET_PRESETS.map((b) => {
                  const isSelected =
                    localFilters.budgetMax === b.max &&
                    (localFilters.budgetMin || 0) === b.min;
                  return (
                    <Pressable
                      key={b.label}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          budgetMin: b.min,
                          budgetMax: b.max,
                        })
                      }
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {b.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 3. DIETARY & FOOD PREFERENCE */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Utensils size={13} color="#0F766E" strokeWidth={2.4} />
                <Text style={styles.sectionLabel}>DIETARY & FOOD HABIT</Text>
              </View>
              <View style={styles.chipRow}>
                {FOOD_OPTIONS.map((f) => {
                  const isSelected = (localFilters.foodPreference || 'All') === f;
                  return (
                    <Pressable
                      key={f}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          foodPreference: f as any,
                        })
                      }
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {f}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 4. SMOKING PREFERENCE */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Cigarette size={13} color="#0F766E" strokeWidth={2.4} />
                <Text style={styles.sectionLabel}>SMOKING HABIT</Text>
              </View>
              <View style={styles.chipRow}>
                {SMOKING_OPTIONS.map((s) => {
                  const isSelected = (localFilters.smoking || 'All') === s;
                  return (
                    <Pressable
                      key={s}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          smoking: s as any,
                        })
                      }
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {s}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 5. DRINKING PREFERENCE */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Wine size={13} color="#0F766E" strokeWidth={2.4} />
                <Text style={styles.sectionLabel}>DRINKING HABIT</Text>
              </View>
              <View style={styles.chipRow}>
                {DRINKING_OPTIONS.map((d) => {
                  const isSelected = (localFilters.drinking || 'All') === d;
                  return (
                    <Pressable
                      key={d}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          drinking: d as any,
                        })
                      }
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {d}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 6. PET FRIENDLY */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Dog size={13} color="#0F766E" strokeWidth={2.4} />
                <Text style={styles.sectionLabel}>PETS</Text>
              </View>
              <View style={styles.chipRow}>
                {PET_OPTIONS.map((p) => {
                  const isSelected = (localFilters.pets || 'All') === p;
                  return (
                    <Pressable
                      key={p}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          pets: p as any,
                        })
                      }
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {p}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 7. MOVE-IN TIMING */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Calendar size={13} color="#0F766E" strokeWidth={2.4} />
                <Text style={styles.sectionLabel}>TARGET MOVE-IN DATE</Text>
              </View>
              <View style={styles.chipRow}>
                {MOVE_IN_OPTIONS.map((m) => {
                  const isSelected = (localFilters.moveInTiming || 'All') === m;
                  return (
                    <Pressable
                      key={m}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          moveInTiming: m as any,
                        })
                      }
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {m}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 8. LANGUAGES SPOKEN */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Languages size={13} color="#0F766E" strokeWidth={2.4} />
                <Text style={styles.sectionLabel}>LANGUAGES SPOKEN</Text>
              </View>
              <View style={styles.chipRow}>
                {LANGUAGES.map((lang) => {
                  const isSelected = (localFilters.languages || []).includes(lang);
                  return (
                    <Pressable
                      key={lang}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => toggleLanguage(lang)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {lang}
                      </Text>
                      {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} style={{ marginLeft: 4 }} />}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* 9. VERIFIED KYC ONLY TOGGLE */}
            <Pressable
              style={[
                styles.verifiedToggleCard,
                localFilters.verifiedOnly && styles.verifiedToggleCardActive,
              ]}
              onPress={() =>
                setLocalFilters({
                  ...localFilters,
                  verifiedOnly: !localFilters.verifiedOnly,
                })
              }
            >
              <ShieldCheck
                size={20}
                color={localFilters.verifiedOnly ? '#0F766E' : '#64748B'}
                strokeWidth={2.4}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.verifiedToggleTitle}>
                  100% KYC & DigiLocker Verified Only
                </Text>
                <Text style={styles.verifiedToggleDesc}>
                  Show only Aadhaar, Phone, and Workplace verified roommates
                </Text>
              </View>
              <View
                style={[
                  styles.toggleCheckbox,
                  localFilters.verifiedOnly && styles.toggleCheckboxActive,
                ]}
              >
                {localFilters.verifiedOnly && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>
            </Pressable>
          </ScrollView>

          {/* Bottom Action CTA */}
          <View style={styles.bottomBar}>
            <Pressable style={styles.applyBtn} onPress={handleApply}>
              <Sparkles size={15} color="#FFFFFF" strokeWidth={2.6} />
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '85%',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    ...V4_SHADOWS.floating,
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2ECEF',
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resetText: {
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
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    gap: 18,
  },
  section: {
    gap: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 7.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2ECEF',
  },
  chipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  verifiedToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2ECEF',
    marginTop: 4,
  },
  verifiedToggleCardActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#99F6E4',
  },
  verifiedToggleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  verifiedToggleDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  toggleCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  toggleCheckboxActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    paddingVertical: 14,
    borderRadius: 18,
    gap: 6,
    ...V4_SHADOWS.soft,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
