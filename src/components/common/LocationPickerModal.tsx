import React from 'react';
import { View, Text, Pressable, Modal, ScrollView, StyleSheet } from 'react-native';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocality: string;
  onSelectLocality: (locality: string) => void;
}

const MUMBAI_LOCALITIES = [
  'All Mumbai',
  'Andheri West',
  'Andheri East',
  'Powai',
  'Bandra West',
  'Bandra East',
  'Lower Parel',
  'Lokhandwala',
  'Worli',
  'Juhu',
  'Versova',
  'Ghatkopar East',
  'Thane West',
  'Navi Mumbai',
  'Malad West',
  'Goregaon West',
];

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  selectedLocality,
  onSelectLocality,
}) => {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Select Location in Mumbai</Text>
              <Text style={styles.subtitle}>Filter rentals by your preferred neighborhood.</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {/* Locality Grid */}
          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.grid}>
            {MUMBAI_LOCALITIES.map((loc) => {
              const isSelected = selectedLocality === loc || (loc === 'All Mumbai' && selectedLocality === 'ALL');
              return (
                <React.Fragment key={loc}>
                  <Pressable
                    onPress={() => {
                      onSelectLocality(loc === 'All Mumbai' ? 'ALL' : loc);
                      onClose();
                    }}
                    style={({ pressed }) => [
                      styles.item,
                      isSelected ? styles.itemSelected : styles.itemNormal,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={[styles.itemText, isSelected ? styles.itemTextSelected : styles.itemTextNormal]}>
                      📍 {loc}
                    </Text>
                    {isSelected && <Text style={styles.checkText}>✓</Text>}
                  </Pressable>
                </React.Fragment>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '80%',
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEE9',
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#17151F',
  },
  subtitle: {
    fontSize: 12,
    color: '#86828F',
    fontWeight: '500',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    color: '#17151F',
    fontWeight: '700',
  },
  scrollArea: {
    maxHeight: 400,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 8,
  },
  item: {
    width: '48%',
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  itemNormal: {
    backgroundColor: '#F7F5F0',
    borderColor: '#E4E2DD',
  },
  itemSelected: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  pressed: {
    opacity: 0.8,
  },
  itemText: {
    fontSize: 12,
    fontWeight: '800',
  },
  itemTextNormal: {
    color: '#17151F',
  },
  itemTextSelected: {
    color: '#FFFFFF',
  },
  checkText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
});

