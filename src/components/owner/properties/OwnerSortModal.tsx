import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { Check, X, ArrowUpDown } from 'lucide-react-native';

export type OwnerSortOption =
  | 'RECENT_UPDATED'
  | 'NEWEST'
  | 'MOST_VIEWED'
  | 'MOST_ENQUIRIES'
  | 'RENT_LOW_HIGH'
  | 'RENT_HIGH_LOW';

interface SortItem {
  id: OwnerSortOption;
  label: string;
}

const SORT_OPTIONS: SortItem[] = [
  { id: 'RECENT_UPDATED', label: 'Recently updated' },
  { id: 'NEWEST', label: 'Newest first' },
  { id: 'MOST_VIEWED', label: 'Most viewed' },
  { id: 'MOST_ENQUIRIES', label: 'Most enquiries' },
  { id: 'RENT_LOW_HIGH', label: 'Rent: Low to High' },
  { id: 'RENT_HIGH_LOW', label: 'Rent: High to Low' },
];

interface OwnerSortModalProps {
  visible: boolean;
  activeSort: OwnerSortOption;
  onSelectSort: (sort: OwnerSortOption) => void;
  onClose: () => void;
}

export const OwnerSortModal: React.FC<OwnerSortModalProps> = ({
  visible,
  activeSort,
  onSelectSort,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <ArrowUpDown size={18} color="#6C4DFF" strokeWidth={2.2} />
              <Text style={styles.title}>Sort Properties</Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
              <X size={18} color="#777482" />
            </Pressable>
          </View>

          <View style={styles.list}>
            {SORT_OPTIONS.map((item) => {
              const isSelected = activeSort === item.id;
              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.row,
                    isSelected && styles.rowSelected,
                  ]}
                  onPress={() => {
                    onSelectSort(item.id);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.rowLabel,
                      isSelected && styles.rowLabelSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Check size={18} color="#6C4DFF" strokeWidth={2.5} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0EA',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#171522',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  rowSelected: {
    backgroundColor: '#F0ECFF',
  },
  rowLabel: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#171522',
  },
  rowLabelSelected: {
    color: '#6C4DFF',
    fontWeight: '700',
  },
});
