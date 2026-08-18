import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, Switch } from 'react-native';
import { X } from 'lucide-react-native';

export interface RoomFilterState {
  budgetRange: 'ALL' | 'UNDER_15K' | '15K_25K' | 'ABOVE_25K';
  roomType: 'ALL' | 'PRIVATE' | 'SHARED';
  attachedBathOnly: boolean;
  furnishedOnly: boolean;
  nearMetroOnly: boolean;
}

interface RoomFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: RoomFilterState;
  onApply: (filters: RoomFilterState) => void;
  onReset: () => void;
}

export const RoomFilterModal: React.FC<RoomFilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApply,
  onReset,
}) => {
  const [localFilters, setLocalFilters] = React.useState<RoomFilterState>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filter Rooms</Text>
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
                          budgetRange: b.value as RoomFilterState['budgetRange'],
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

            {/* Room Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Room Privacy</Text>
              <View style={styles.chipsWrap}>
                {[
                  { label: 'All Rooms', value: 'ALL' },
                  { label: 'Private Room', value: 'PRIVATE' },
                  { label: 'Shared Room', value: 'SHARED' },
                ].map((t) => {
                  const isSelected = localFilters.roomType === t.value;
                  return (
                    <Pressable
                      key={t.value}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          roomType: t.value as RoomFilterState['roomType'],
                        }))
                      }
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {t.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Toggles */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities & Features</Text>

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Attached Washroom</Text>
                  <Text style={styles.toggleSub}>Private ensuite bathroom</Text>
                </View>
                <Switch
                  value={localFilters.attachedBathOnly}
                  onValueChange={(val) =>
                    setLocalFilters((prev) => ({ ...prev, attachedBathOnly: val }))
                  }
                  trackColor={{ false: '#E8E5EC', true: '#6C4DFF' }}
                />
              </View>

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Fully Furnished</Text>
                  <Text style={styles.toggleSub}>Bed, wardrobe & study desk</Text>
                </View>
                <Switch
                  value={localFilters.furnishedOnly}
                  onValueChange={(val) =>
                    setLocalFilters((prev) => ({ ...prev, furnishedOnly: val }))
                  }
                  trackColor={{ false: '#E8E5EC', true: '#6C4DFF' }}
                />
              </View>

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Near Metro Station</Text>
                  <Text style={styles.toggleSub}>Walking distance</Text>
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
              <Text style={styles.applyBtnText}>Show Rooms</Text>
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
