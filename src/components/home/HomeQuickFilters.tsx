import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import {
  ShieldCheck,
  Train,
  Armchair,
  CheckCircle,
  IndianRupee,
  BedDouble,
  Utensils,
  Wind,
  User,
  Users,
  Sparkles,
  Car,
  Home,
} from 'lucide-react-native';
import { PropertyCategory } from './PropertyCategorySwitcher';

export type QuickFilterId =
  | 'under_15k'
  | 'under_20k'
  | 'under_25k'
  | 'no_brokerage'
  | 'near_metro'
  | 'furnished'
  | 'verified'
  | '1_bhk'
  | '2_bhk'
  | '3_bhk'
  | 'ac'
  | 'food_included'
  | 'single_occupancy'
  | 'private_room'
  | 'shared_room'
  | 'working_professionals'
  | 'bachelors_allowed'
  | 'car_parking'
  | 'instant_move_in'
  | 'pet_friendly';

export interface QuickFilterOption {
  id: QuickFilterId;
  label: string;
  icon?: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}

const CATEGORY_QUICK_FILTERS: Record<PropertyCategory, QuickFilterOption[]> = {
  rent: [
    { id: 'under_15k', label: 'Under ₹15K', icon: IndianRupee },
    { id: 'no_brokerage', label: 'No Brokerage', icon: ShieldCheck },
    { id: 'near_metro', label: 'Near Metro', icon: Train },
    { id: 'furnished', label: 'Fully Furnished', icon: Armchair },
    { id: '1_bhk', label: '1 BHK', icon: BedDouble },
    { id: '2_bhk', label: '2 BHK', icon: BedDouble },
    { id: 'verified', label: 'Verified Only', icon: CheckCircle },
  ],
  pg: [
    { id: 'under_15k', label: 'Under ₹15K', icon: IndianRupee },
    { id: 'near_metro', label: 'Near Metro', icon: Train },
    { id: 'ac', label: 'AC', icon: Wind },
    { id: 'food_included', label: 'Food Included', icon: Utensils },
    { id: 'single_occupancy', label: 'Single Occupancy', icon: User },
    { id: 'no_brokerage', label: 'No Brokerage', icon: ShieldCheck },
  ],
  rooms: [
    { id: 'under_15k', label: 'Under ₹15K', icon: IndianRupee },
    { id: 'private_room', label: 'Private Room', icon: User },
    { id: 'shared_room', label: 'Shared Room', icon: Users },
    { id: 'furnished', label: 'Furnished', icon: Armchair },
    { id: 'near_metro', label: 'Near Metro', icon: Train },
    { id: 'no_brokerage', label: 'No Brokerage', icon: ShieldCheck },
  ],
  flatmates: [
    { id: 'under_20k', label: 'Under ₹20K', icon: IndianRupee },
    { id: 'working_professionals', label: 'Working Professionals', icon: Users },
    { id: 'near_metro', label: 'Near Metro', icon: Train },
    { id: 'furnished', label: 'Furnished', icon: Armchair },
    { id: 'no_brokerage', label: 'No Brokerage', icon: ShieldCheck },
    { id: 'bachelors_allowed', label: 'Bachelors Allowed', icon: CheckCircle },
  ],
  studios: [
    { id: 'under_25k', label: 'Under ₹25K', icon: IndianRupee },
    { id: 'furnished', label: 'Fully Furnished', icon: Armchair },
    { id: 'near_metro', label: 'Near Metro', icon: Train },
    { id: 'no_brokerage', label: 'No Brokerage', icon: ShieldCheck },
    { id: 'instant_move_in', label: 'Instant Move-in', icon: Sparkles },
  ],
};

interface HomeQuickFiltersProps {
  category?: PropertyCategory;
  activeFilterId?: QuickFilterId | null;
  onSelectFilter: (id: QuickFilterId) => void;
}

export const HomeQuickFilters: React.FC<HomeQuickFiltersProps> = ({
  category = 'rent',
  activeFilterId,
  onSelectFilter,
}) => {
  const filters = CATEGORY_QUICK_FILTERS[category] || CATEGORY_QUICK_FILTERS.rent;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((item) => {
          const isSelected = activeFilterId === item.id;
          const Icon = item.icon;

          return (
            <Pressable
              key={item.id}
              style={[styles.pill, isSelected && styles.pillSelected]}
              onPress={() => onSelectFilter(item.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              {Icon && (
                <Icon
                  size={14}
                  color={isSelected ? '#FFFFFF' : '#6C4DFF'}
                  strokeWidth={2.2}
                />
              )}
              <Text
                style={[styles.pillText, isSelected && styles.pillTextSelected]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
    height: 42,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  pillSelected: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
