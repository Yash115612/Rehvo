import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  Search,
  Mic,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  CreditCard,
  FileCheck2,
} from 'lucide-react-native';
import { V4_COLORS } from '../../../theme/v4Theme';

export type V4QuickChipType =
  | 'Property for Rent'
  | 'PG & Hostel'
  | 'Commercial'
  | 'Flatmates'
  | 'Villas'
  | 'Rent'
  | 'Buy'
  | 'Hotel'
  | 'Farmhouse';

const CATEGORY_TABS: { id: V4QuickChipType; label: string; icon: string }[] = [
  { id: 'Property for Rent', label: 'Property for Rent', icon: '🏠' },
  { id: 'PG & Hostel', label: 'PG & Hostel', icon: '👥' },
  { id: 'Commercial', label: 'Commercial', icon: '🏢' },
  { id: 'Flatmates', label: 'Flatmates', icon: '✨' },
  { id: 'Villas', label: 'Villas & Penthouses', icon: '🏖️' },
];

const QUICK_FILTERS = [
  { id: 'instant', label: '⚡ Instant Visit' },
  { id: 'under40k', label: '🏷️ Under ₹40,000' },
  { id: 'luxury', label: '💎 Luxury VIP' },
  { id: 'pet', label: '🐾 Pet Friendly' },
  { id: 'parking', label: '🚗 Covered Parking' },
  { id: 'verified', label: '🛡️ 100% DigiLocker' },
  { id: 'furnished', label: '🛋️ Fully Furnished' },
];

const PLACEHOLDER_PROMPTS = [
  'Search "2 BHK in Bandra West"...',
  'Search "Sea-Facing Penthouse in Worli"...',
  'Search "Furnished PG in Powai under ₹25k"...',
  'Search "Commercial Office in BKC"...',
  'Search "Luxury Villa in Juhu (0% Fee)"...',
];

interface V4FloatingSearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
  onPressSearch?: () => void;
  onVoiceSearch?: () => void;
  onOpenFilters?: () => void;
  selectedChip?: V4QuickChipType;
  onSelectChip?: (chip: V4QuickChipType) => void;
  placeholder?: string;
  editable?: boolean;
}

export const V4FloatingSearchBar: React.FC<V4FloatingSearchBarProps> = ({
  value = '',
  onChangeText,
  onSubmit,
  onPressSearch,
  onVoiceSearch,
  onOpenFilters,
  selectedChip = 'Property for Rent',
  onSelectChip,
  placeholder,
  editable = true,
}) => {
  const [activeFilterIds, setActiveFilterIds] = useState<string[]>(['instant']);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_PROMPTS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const dynamicPlaceholder = placeholder || PLACEHOLDER_PROMPTS[placeholderIndex];

  const toggleQuickFilter = (id: string) => {
    setActiveFilterIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.cardContainer}>
      {/* iOS 26 Liquid Frosted Glass Blur Backdrop */}
      <BlurView
        intensity={Platform.OS === 'ios' ? 65 : 80}
        tint="light"
        style={styles.blurBackdrop}
      >
        {/* Top Specular Reflection Highlight */}
        <View style={styles.topSpecularLine} />

        <View style={styles.innerContent}>
          {/* 1. Liquid Glass Category Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryTabsScroll}
          >
            {CATEGORY_TABS.map((tab) => {
              const isSelected = selectedChip === tab.id;

              return (
                <Pressable
                  key={tab.id}
                  style={[
                    styles.categoryTab,
                    isSelected && styles.categoryTabActive,
                  ]}
                  onPress={() => onSelectChip?.(tab.id)}
                >
                  <Text style={styles.categoryTabIcon}>{tab.icon}</Text>
                  <Text
                    style={[
                      styles.categoryTabText,
                      isSelected && styles.categoryTabTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                  {isSelected && <View style={styles.tabActiveBar} />}
                </Pressable>
              );
            })}
          </ScrollView>

          {/* 2. Main Omnisearch Liquid Input Pill */}
          <View style={styles.searchPillWrapper}>
            <Pressable
              style={styles.searchPill}
              onPress={!editable ? onPressSearch : undefined}
            >
              <View style={styles.searchIconCircle}>
                <Search size={16} color="#FFFFFF" strokeWidth={2.8} />
              </View>

              {editable ? (
                <TextInput
                  placeholder={dynamicPlaceholder}
                  placeholderTextColor="#64748B"
                  value={value}
                  onChangeText={onChangeText}
                  onSubmitEditing={onSubmit}
                  returnKeyType="search"
                  style={styles.searchInput}
                />
              ) : (
                <Text style={styles.placeholderText} numberOfLines={1}>
                  {dynamicPlaceholder}
                </Text>
              )}

              {value.length > 0 && (
                <Pressable
                  style={styles.clearBtn}
                  onPress={() => onChangeText?.('')}
                >
                  <X size={13} color="#94A3B8" strokeWidth={2.6} />
                </Pressable>
              )}

              {/* Right Actions: Voice & Filter Trigger */}
              <View style={styles.rightIcons}>
                {onVoiceSearch && (
                  <Pressable style={styles.iconBtn} onPress={onVoiceSearch}>
                    <Mic size={16} color={V4_COLORS.primary} strokeWidth={2.4} />
                  </Pressable>
                )}

                <Pressable
                  style={styles.filterBtn}
                  onPress={onOpenFilters || onPressSearch}
                >
                  <SlidersHorizontal size={14} color="#FFFFFF" strokeWidth={2.6} />
                  <Text style={styles.filterBtnText}>Filters</Text>
                </Pressable>
              </View>
            </Pressable>
          </View>

          {/* 3. Fast Filter Pills Horizon */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickFiltersScroll}
          >
            {QUICK_FILTERS.map((qf) => {
              const isActive = activeFilterIds.includes(qf.id);
              return (
                <Pressable
                  key={qf.id}
                  style={[
                    styles.quickFilterChip,
                    isActive && styles.quickFilterChipActive,
                  ]}
                  onPress={() => toggleQuickFilter(qf.id)}
                >
                  {isActive && (
                    <Check
                      size={11}
                      color="#0F766E"
                      strokeWidth={3}
                      style={{ marginRight: 4 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.quickFilterText,
                      isActive && styles.quickFilterTextActive,
                    ]}
                  >
                    {qf.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* 4. Micro Trust Bar at Bottom of Search Box */}
          <View style={styles.trustBarRow}>
            <View style={styles.trustItem}>
              <ShieldCheck size={12} color="#16A34A" strokeWidth={2.6} />
              <Text style={styles.trustItemText}>Verified Listing</Text>
            </View>

            <View style={styles.trustDot} />

            <View style={styles.trustItem}>
              <FileCheck2 size={12} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.trustItemText}>Free E-Agreement</Text>
            </View>

            <View style={styles.trustDot} />

            <View style={styles.trustItem}>
              <CreditCard size={12} color="#F59E0B" strokeWidth={2.4} />
              <Text style={styles.trustItemText}>1% Rent Cashback</Text>
            </View>
          </View>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.90)',
    shadowColor: '#031B2A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  blurBackdrop: {
    width: '100%',
    position: 'relative',
  },
  topSpecularLine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 1,
    zIndex: 10,
  },
  innerContent: {
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 14,
  },
  categoryTabsScroll: {
    paddingBottom: 8,
    gap: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.70)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    position: 'relative',
  },
  categoryTabActive: {
    backgroundColor: 'rgba(204, 251, 241, 0.85)',
    borderColor: '#99F6E4',
  },
  categoryTabIcon: {
    fontSize: 13,
    marginRight: 5,
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  categoryTabTextActive: {
    color: V4_COLORS.primary,
    fontWeight: '800',
  },
  tabActiveBar: {
    position: 'absolute',
    bottom: -1,
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: V4_COLORS.primary,
    borderRadius: 1,
  },
  searchPillWrapper: {
    marginVertical: 4,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1.2,
    borderColor: 'rgba(226, 236, 239, 0.8)',
    shadowColor: '#031B2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: V4_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
    paddingVertical: 0,
  },
  placeholderText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  clearBtn: {
    padding: 6,
    marginRight: 2,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(230, 255, 250, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 14,
    gap: 4,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  filterBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  quickFiltersScroll: {
    paddingTop: 10,
    paddingBottom: 6,
    gap: 8,
  },
  quickFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.90)',
  },
  quickFilterChipActive: {
    backgroundColor: 'rgba(204, 251, 241, 0.90)',
    borderColor: '#99F6E4',
  },
  quickFilterText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  quickFilterTextActive: {
    color: V4_COLORS.primary,
    fontWeight: '800',
  },
  trustBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustItemText: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginLeft: 5,
  },
  trustDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CBD5E1',
  },
});
