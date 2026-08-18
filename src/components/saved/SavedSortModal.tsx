import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { X, Check, ArrowDownUp } from 'lucide-react-native';

export type SavedSortOption =
  | 'RECENTLY_SAVED'
  | 'PRICE_LOW_TO_HIGH'
  | 'PRICE_HIGH_TO_LOW'
  | 'NEWEST';

interface SavedSortModalProps {
  visible: boolean;
  currentSort: SavedSortOption;
  onSelectSort: (sort: SavedSortOption) => void;
  onClose: () => void;
}

const SORT_ITEMS: { id: SavedSortOption; label: string }[] = [
  { id: 'RECENTLY_SAVED', label: 'Recently saved' },
  { id: 'PRICE_LOW_TO_HIGH', label: 'Price: Low to High' },
  { id: 'PRICE_HIGH_TO_LOW', label: 'Price: High to Low' },
  { id: 'NEWEST', label: 'Newest listings' },
];

export const SavedSortModal: React.FC<SavedSortModalProps> = ({
  visible,
  currentSort,
  onSelectSort,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <ArrowDownUp size={18} color="#171522" strokeWidth={2} />
              <Text style={styles.title}>Sort saved places</Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <X size={18} color="#171522" strokeWidth={2} />
            </Pressable>
          </View>

          {/* Options */}
          <View style={styles.optionsList}>
            {SORT_ITEMS.map((item) => {
              const isSelected = currentSort === item.id;
              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.optionRow,
                    isSelected && styles.optionRowSelected,
                  ]}
                  onPress={() => {
                    onSelectSort(item.id);
                    onClose();
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
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
    backgroundColor: 'rgba(23, 21, 34, 0.45)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingHorizontal: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEE9',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#171522',
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    gap: 6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  optionRowSelected: {
    backgroundColor: '#F0ECFF',
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#171522',
  },
  optionLabelSelected: {
    color: '#6C4DFF',
    fontWeight: '700',
  },
});
