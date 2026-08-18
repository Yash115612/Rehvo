import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, Switch } from 'react-native';
import { X, Check } from 'lucide-react-native';

export interface RentFilterState {
  budgetRange: 'ALL' | 'UNDER_30K' | '30K_60K' | 'ABOVE_60K';
  bhk: string;
  furnishing: string;
  noBrokerageOnly: boolean;
  nearMetroOnly: boolean;
  parkingOnly: boolean;
}

interface RentFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: RentFilterState;
  onApply: (filters: RentFilterState) => void;
  onReset: () => void;
}

export const RentFilterModal: React.FC<RentFilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApply,
  onReset,
}) => {
  const [localFilters, setLocalFilters] = React.useState<RentFilterState>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, visible]);

  const bhkOptions = ['ALL', '1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'];
  const furnishingOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Fully Furnished', value: 'FULLY_FURNISHED' },
    { label: 'Semi Furnished', value: 'SEMI_FURNISHED' },
    { label: 'Unfurnished', value: 'UNFURNISHED' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filter Rentals</Text>
            <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
              <X size={20} color="#171522" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            {/* Budget */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Monthly Budget</Text>
              <View style={styles.chipsWrap}>
                {[
                  { label: 'All Budgets', value: 'ALL' },
                  { label: 'Under ₹30,000', value: 'UNDER_30K' },
                  { label: '₹30,000 - ₹60,000', value: '30K_60K' },
                  { label: '₹60,000+', value: 'ABOVE_60K' },
                ].map((b) => {
                  const isSelected = localFilters.budgetRange === b.value;
                  return (
                    <Pressable
                      key={b.value}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          budgetRange: b.value as RentFilterState['budgetRange'],
                        }))
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

            {/* BHK */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Apartment Space (BHK)</Text>
              <View style={styles.chipsWrap}>
                {bhkOptions.map((bhk) => {
                  const isSelected = localFilters.bhk === bhk;
                  return (
                    <Pressable
                      key={bhk}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => setLocalFilters((prev) => ({ ...prev, bhk }))}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {bhk === 'ALL' ? 'Any BHK' : bhk}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Furnishing */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Furnishing Status</Text>
              <View style={styles.chipsWrap}>
                {furnishingOptions.map((f) => {
                  const isSelected = localFilters.furnishing === f.value;
                  return (
                    <Pressable
                      key={f.value}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => setLocalFilters((prev) => ({ ...prev, furnishing: f.value }))}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {f.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Toggles */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences & Amenities</Text>

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Zero Brokerage</Text>
                  <Text style={styles.toggleSub}>Direct from verified owners</Text>
                </View>
                <Switch
                  value={localFilters.noBrokerageOnly}
                  onValueChange={(val) =>
                    setLocalFilters((prev) => ({ ...prev, noBrokerageOnly: val }))
                  }
                  trackColor={{ false: '#E8E5EC', true: '#6C4DFF' }}
                />
              </View>

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Near Metro Station</Text>
                  <Text style={styles.toggleSub}>Within walking distance</Text>
                </View>
                <Switch
                  value={localFilters.nearMetroOnly}
                  onValueChange={(val) =>
                    setLocalFilters((prev) => ({ ...prev, nearMetroOnly: val }))
                  }
                  trackColor={{ false: '#E8E5EC', true: '#6C4DFF' }}
                />
              </View>

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Dedicated Parking</Text>
                  <Text style={styles.toggleSub}>Car or 2-wheeler parking</Text>
                </View>
                <Switch
                  value={localFilters.parkingOnly}
                  onValueChange={(val) =>
                    setLocalFilters((prev) => ({ ...prev, parkingOnly: val }))
                  }
                  trackColor={{ false: '#E8E5EC', true: '#6C4DFF' }}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <Pressable
              style={styles.resetBtn}
              onPress={() => {
                onReset();
                onClose();
              }}
            >
              <Text style={styles.resetBtnText}>Reset</Text>
            </Pressable>

            <Pressable
              style={styles.applyBtn}
              onPress={() => {
                onApply(localFilters);
                onClose();
              }}
            >
              <Text style={styles.applyBtnText}>Show Results</Text>
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
    backgroundColor: 'rgba(23, 21, 34, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEE9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 20,
    gap: 20,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#171522',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  chipActive: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F7F4',
  },
  toggleTextCol: {
    flex: 1,
    gap: 2,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  toggleSub: {
    fontSize: 12,
    color: '#777482',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0EEE9',
  },
  resetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  resetBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#777482',
  },
  applyBtn: {
    flex: 2,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
