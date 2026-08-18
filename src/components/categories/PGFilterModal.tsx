import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, Switch } from 'react-native';
import { X } from 'lucide-react-native';

export interface PGFilterState {
  budgetRange: 'ALL' | 'UNDER_15K' | '15K_25K' | 'ABOVE_25K';
  sharingType: string;
  gender: string;
  foodOnly: boolean;
  acOnly: boolean;
  wifiOnly: boolean;
  nearMetroOnly: boolean;
}

interface PGFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: PGFilterState;
  onApply: (filters: PGFilterState) => void;
  onReset: () => void;
}

export const PGFilterModal: React.FC<PGFilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApply,
  onReset,
}) => {
  const [localFilters, setLocalFilters] = React.useState<PGFilterState>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filter PGs & Co-Living</Text>
            <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
              <X size={20} color="#171522" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            {/* Monthly Budget */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Monthly Rent</Text>
              <View style={styles.chipsWrap}>
                {[
                  { label: 'All', value: 'ALL' },
                  { label: 'Under ₹15,000', value: 'UNDER_15K' },
                  { label: '₹15,000 - ₹25,000', value: '15K_25K' },
                  { label: '₹25,000+', value: 'ABOVE_25K' },
                ].map((b) => {
                  const isSelected = localFilters.budgetRange === b.value;
                  return (
                    <Pressable
                      key={b.value}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          budgetRange: b.value as PGFilterState['budgetRange'],
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

            {/* Room Sharing Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Room Occupancy</Text>
              <View style={styles.chipsWrap}>
                {[
                  { label: 'Any Occupancy', value: 'ALL' },
                  { label: 'Single Room', value: 'SINGLE' },
                  { label: 'Double Sharing', value: 'DOUBLE' },
                  { label: 'Triple Sharing', value: 'TRIPLE' },
                ].map((s) => {
                  const isSelected = localFilters.sharingType === s.value;
                  return (
                    <Pressable
                      key={s.value}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => setLocalFilters((prev) => ({ ...prev, sharingType: s.value }))}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {s.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Gender Allowed */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gender Preference</Text>
              <View style={styles.chipsWrap}>
                {[
                  { label: 'All PGs', value: 'ALL' },
                  { label: 'Ladies Only', value: 'Ladies' },
                  { label: 'Gents Only', value: 'Gents' },
                  { label: 'Unisex / Co-ed', value: 'Unisex' },
                ].map((g) => {
                  const isSelected = localFilters.gender === g.value;
                  return (
                    <Pressable
                      key={g.value}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => setLocalFilters((prev) => ({ ...prev, gender: g.value }))}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {g.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Toggles */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Included Services & Amenities</Text>

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Meals Included</Text>
                  <Text style={styles.toggleSub}>Breakfast, lunch & dinner</Text>
                </View>
                <Switch
                  value={localFilters.foodOnly}
                  onValueChange={(val) => setLocalFilters((prev) => ({ ...prev, foodOnly: val }))}
                  trackColor={{ false: '#E8E5EC', true: '#6C4DFF' }}
                />
              </View>

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Air Conditioned (AC)</Text>
                  <Text style={styles.toggleSub}>AC in every room</Text>
                </View>
                <Switch
                  value={localFilters.acOnly}
                  onValueChange={(val) => setLocalFilters((prev) => ({ ...prev, acOnly: val }))}
                  trackColor={{ false: '#E8E5EC', true: '#6C4DFF' }}
                />
              </View>

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>High-Speed Wi-Fi</Text>
                  <Text style={styles.toggleSub}>Unlimited fiber broadband</Text>
                </View>
                <Switch
                  value={localFilters.wifiOnly}
                  onValueChange={(val) => setLocalFilters((prev) => ({ ...prev, wifiOnly: val }))}
                  trackColor={{ false: '#E8E5EC', true: '#6C4DFF' }}
                />
              </View>

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Near Metro Station</Text>
                  <Text style={styles.toggleSub}>Walking distance to metro</Text>
                </View>
                <Switch
                  value={localFilters.nearMetroOnly}
                  onValueChange={(val) =>
                    setLocalFilters((prev) => ({ ...prev, nearMetroOnly: val }))
                  }
                  trackColor={{ false: '#E8E5EC', true: '#6C4DFF' }}
                />
              </View>
            </View>
          </ScrollView>

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
              <Text style={styles.applyBtnText}>Show PGs</Text>
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
