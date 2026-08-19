import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, SlidersHorizontal, MapPin, X } from 'lucide-react-native';
import { PropertyCategory, PropertyCategorySwitcher } from '../home/PropertyCategorySwitcher';

interface CategoryHeaderProps {
  currentCategory: PropertyCategory;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearchSubmit?: () => void;
  activeFilterCount?: number;
  onOpenFilters: () => void;
  onCategoryChange?: (category: PropertyCategory) => void;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  currentCategory,
  title,
  subtitle,
  searchPlaceholder,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  activeFilterCount = 0,
  onOpenFilters,
  onCategoryChange,
}) => {
  const router = useRouter();

  const handleCategorySwitch = (category: PropertyCategory) => {
    if (onCategoryChange) {
      onCategoryChange(category);
      return;
    }

    if (category === currentCategory) return;

    if (category === 'rent') router.push('/(renter)/rent');
    else if (category === 'pg') router.push('/(renter)/pg');
    else if (category === 'rooms') router.push('/(renter)/rooms');
    else if (category === 'flatmates') router.push('/(renter)/flatmates');
    else if (category === 'studios') router.push('/(renter)/studios');
  };

  return (
    <View style={styles.container}>
      {/* Top Bar: Back & Category Switcher */}
      <View style={styles.topBar}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(renter)/home');
            }
          }}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back to previous screen"
        >
          <ArrowLeft size={20} color="#171522" strokeWidth={2.2} />
        </Pressable>

        <View style={styles.switcherWrapper}>
          <PropertyCategorySwitcher
            selectedCategory={currentCategory}
            onCategoryChange={handleCategorySwitch}
          />
        </View>
      </View>

      {/* Category Heading Info */}
      <View style={styles.titleSection}>
        <Text style={styles.heading}>{title}</Text>
        <Text style={styles.subheading}>{subtitle}</Text>
      </View>

      {/* Category-Specific Search Bar & Filter Button */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrap}>
          <Search size={18} color="#777482" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder={searchPlaceholder}
            placeholderTextColor="#777482"
            value={searchQuery}
            onChangeText={onSearchChange}
            onSubmitEditing={onSearchSubmit}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => onSearchChange('')} hitSlop={6}>
              <X size={16} color="#777482" />
            </Pressable>
          )}
        </View>

        <Pressable
          style={[
            styles.filterBtn,
            activeFilterCount > 0 && styles.filterBtnActive,
          ]}
          onPress={onOpenFilters}
          accessibilityRole="button"
          accessibilityLabel="Open filters"
        >
          <SlidersHorizontal
            size={18}
            color={activeFilterCount > 0 ? '#FFFFFF' : '#171522'}
            strokeWidth={2}
          />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F7F4',
    paddingBottom: 10,
    gap: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    gap: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switcherWrapper: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 16,
    gap: 3,
  },
  heading: {
    fontSize: 23,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
  },
  subheading: {
    fontSize: 13.5,
    color: '#777482',
    fontWeight: '500',
    lineHeight: 18,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 2,
  },
  searchInputWrap: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '500',
    color: '#171522',
    padding: 0,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBtnActive: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#171522',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
