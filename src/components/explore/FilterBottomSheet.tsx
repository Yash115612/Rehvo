import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Pressable, Modal, ScrollView, StyleSheet } from 'react-native';
import { PropertyFilter, PropertyType, FurnishingType } from '../../types';
import { Property } from '../../types';
import { MUMBAI_LOCALITIES } from '../../constants/theme';
import { filterProperties } from '../search/useSearchResults';
import { SearchPropertyCategory } from '../search/searchConstants';

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilter: PropertyFilter;
  onApplyFilter: (
    filter: Partial<PropertyFilter>,
    extended?: { availability: 'ALL' | 'IMMEDIATE' | 'WITHIN_MONTH'; nearMetro: boolean },
  ) => void;
  onResetFilter: () => void;
  properties: Property[];
  category: SearchPropertyCategory;
  nearMetro: boolean;
  availability: 'ALL' | 'IMMEDIATE' | 'WITHIN_MONTH';
}

const BUDGET_OPTIONS = [
  { label: '₹0', min: 0, max: 200000 },
  { label: '₹10K', min: 0, max: 10000 },
  { label: '₹20K', min: 0, max: 20000 },
  { label: '₹30K', min: 0, max: 30000 },
  { label: '₹50K+', min: 50000, max: 200000 },
  { label: '₹1L+', min: 100000, max: 200000 },
];

const BHK_OPTIONS = ['ALL', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'];

const FURNISHING_OPTIONS: { id: FurnishingType | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'Any' },
  { id: 'FULLY_FURNISHED', label: 'Fully Furnished' },
  { id: 'SEMI_FURNISHED', label: 'Semi Furnished' },
  { id: 'UNFURNISHED', label: 'Unfurnished' },
];

const PROPERTY_TYPES: { type: PropertyType | 'ALL'; label: string }[] = [
  { type: 'ALL', label: 'All' },
  { type: 'FLAT', label: 'Flats' },
  { type: 'PG', label: 'PG' },
  { type: 'CO_LIVING', label: 'Co-living' },
  { type: 'PRIVATE_ROOM', label: 'Rooms' },
];

const AMENITY_OPTIONS = ['Parking', 'AC', 'Wi-Fi', 'Lift', 'Power Backup'];

const AVAILABILITY_OPTIONS: { id: 'ALL' | 'IMMEDIATE' | 'WITHIN_MONTH'; label: string }[] = [
  { id: 'ALL', label: 'Any' },
  { id: 'IMMEDIATE', label: 'Immediately' },
  { id: 'WITHIN_MONTH', label: 'Within 1 month' },
];

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  isOpen,
  onClose,
  activeFilter,
  onApplyFilter,
  onResetFilter,
  properties,
  category,
  nearMetro,
  availability,
}) => {
  const [draftFilter, setDraftFilter] = useState<PropertyFilter>({ ...activeFilter });
  const [draftAvailability, setDraftAvailability] = useState(availability);
  const [draftNearMetro, setDraftNearMetro] = useState(nearMetro);

  useEffect(() => {
    if (isOpen) {
      setDraftFilter({ ...activeFilter });
      setDraftAvailability(availability);
      setDraftNearMetro(nearMetro);
    }
  }, [isOpen, activeFilter, availability, nearMetro]);

  const draftCount = useMemo(
    () =>
      filterProperties(properties, activeFilter.query, draftFilter, {
        category,
        nearMetro: draftNearMetro,
        availability: draftAvailability,
      }).length,
    [properties, activeFilter.query, draftFilter, category, draftNearMetro, draftAvailability],
  );

  const isBudgetSelected = (min: number, max: number) =>
    draftFilter.rent_min === min && draftFilter.rent_max === max;

  const handleApply = () => {
    onApplyFilter(draftFilter, {
      availability: draftAvailability,
      nearMetro: draftNearMetro,
    });
    onClose();
  };

  const handleClearAll = () => {
    onResetFilter();
    onClose();
  };

  const toggleAmenity = (amenity: string) => {
    setDraftFilter((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <Pressable onPress={handleClearAll}>
              <Text style={styles.clearAll}>Clear all</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Budget */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Budget</Text>
              <View style={styles.chipRow}>
                {BUDGET_OPTIONS.map((opt) => {
                  const selected = isBudgetSelected(opt.min, opt.max);
                  return (
                    <Pressable
                      key={opt.label}
                      style={[styles.chip, selected && styles.chipSelected]}
                      onPress={() =>
                        setDraftFilter((prev) => ({
                          ...prev,
                          rent_min: opt.min,
                          rent_max: opt.max,
                        }))
                      }
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Property Type */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Property Type</Text>
              <View style={styles.chipRow}>
                {PROPERTY_TYPES.map((opt) => {
                  const selected = draftFilter.property_type === opt.type;
                  return (
                    <Pressable
                      key={opt.type}
                      style={[styles.chip, selected && styles.chipSelected]}
                      onPress={() =>
                        setDraftFilter((prev) => ({ ...prev, property_type: opt.type }))
                      }
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* BHK */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>BHK</Text>
              <View style={styles.chipRow}>
                {BHK_OPTIONS.map((bhk) => {
                  const selected = draftFilter.bhk === bhk;
                  return (
                    <Pressable
                      key={bhk}
                      style={[styles.chip, selected && styles.chipSelected]}
                      onPress={() => setDraftFilter((prev) => ({ ...prev, bhk }))}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {bhk === 'ALL' ? 'Any' : bhk.replace(' BHK', '').replace('+', '+')}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Furnishing */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Furnishing</Text>
              <View style={styles.chipRow}>
                {FURNISHING_OPTIONS.map((opt) => {
                  const selected = draftFilter.furnishing === opt.id;
                  return (
                    <Pressable
                      key={opt.id}
                      style={[styles.chip, selected && styles.chipSelected]}
                      onPress={() =>
                        setDraftFilter((prev) => ({ ...prev, furnishing: opt.id }))
                      }
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Brokerage */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Brokerage</Text>
              <View style={styles.chipRow}>
                <Pressable
                  style={[styles.chip, !draftFilter.brokerage_free_only && styles.chipSelected]}
                  onPress={() =>
                    setDraftFilter((prev) => ({ ...prev, brokerage_free_only: false }))
                  }
                >
                  <Text
                    style={[
                      styles.chipText,
                      !draftFilter.brokerage_free_only && styles.chipTextSelected,
                    ]}
                  >
                    Any
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.chip, draftFilter.brokerage_free_only && styles.chipSelected]}
                  onPress={() =>
                    setDraftFilter((prev) => ({ ...prev, brokerage_free_only: true }))
                  }
                >
                  <Text
                    style={[
                      styles.chipText,
                      draftFilter.brokerage_free_only && styles.chipTextSelected,
                    ]}
                  >
                    No Brokerage
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Availability */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Availability</Text>
              <View style={styles.chipRow}>
                {AVAILABILITY_OPTIONS.map((opt) => {
                  const selected = draftAvailability === opt.id;
                  return (
                    <Pressable
                      key={opt.id}
                      style={[styles.chip, selected && styles.chipSelected]}
                      onPress={() => setDraftAvailability(opt.id)}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Location */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Location</Text>
              <View style={styles.chipRow}>
                <Pressable
                  style={[
                    styles.chip,
                    draftFilter.locality === 'ALL' && styles.chipSelected,
                  ]}
                  onPress={() => setDraftFilter((prev) => ({ ...prev, locality: 'ALL' }))}
                >
                  <Text
                    style={[
                      styles.chipText,
                      draftFilter.locality === 'ALL' && styles.chipTextSelected,
                    ]}
                  >
                    Any
                  </Text>
                </Pressable>
                {MUMBAI_LOCALITIES.slice(0, 8).map((loc) => {
                  const selected = draftFilter.locality === loc;
                  return (
                    <Pressable
                      key={loc}
                      style={[styles.chip, selected && styles.chipSelected]}
                      onPress={() => setDraftFilter((prev) => ({ ...prev, locality: loc }))}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {loc}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Amenities */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Amenities</Text>
              <View style={styles.chipRow}>
                {AMENITY_OPTIONS.map((amenity) => {
                  const selected = draftFilter.amenities.includes(amenity);
                  return (
                    <Pressable
                      key={amenity}
                      style={[styles.chip, selected && styles.chipSelected]}
                      onPress={() => toggleAmenity(amenity)}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {amenity}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={{ height: 24 }} />
          </ScrollView>

          <Pressable style={styles.cta} onPress={handleApply}>
            <Text style={styles.ctaText}>Show {draftCount} places</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '88%',
    paddingBottom: 24,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E8E5EC',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E5EC',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#171522',
  },
  clearAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C4DFF',
  },
  scroll: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  chipSelected: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#171522',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cta: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
