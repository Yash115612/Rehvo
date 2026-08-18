import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { PropertyFilter } from '../../types';

interface SortBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentSort: PropertyFilter['sort_by'];
  onSelectSort: (sortBy: PropertyFilter['sort_by']) => void;
}

const SORT_OPTIONS: { id: PropertyFilter['sort_by']; label: string }[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'newest', label: 'Newest' },
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
  { id: 'most_saved', label: 'Most Saved' },
];

export const SortBottomSheet: React.FC<SortBottomSheetProps> = ({
  isOpen,
  onClose,
  currentSort,
  onSelectSort,
}) => {
  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Sort</Text>

          {SORT_OPTIONS.map((opt) => {
            const isSelected = currentSort === opt.id;
            return (
              <Pressable
                key={opt.id}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => {
                  onSelectSort(opt.id);
                  onClose();
                }}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {opt.label}
                </Text>
                {isSelected && <Text style={styles.check}>✓</Text>}
              </Pressable>
            );
          })}
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
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 8,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E8E5EC',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#171522',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E5EC',
  },
  optionSelected: {},
  optionText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#171522',
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#6C4DFF',
  },
  check: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6C4DFF',
  },
});
