import React, { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView, StyleSheet, Switch } from 'react-native';
import { PropertyFilter } from '../../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilter: PropertyFilter;
  onApplyFilter: (updated: Partial<PropertyFilter>) => void;
  onResetFilter: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  activeFilter,
  onApplyFilter,
  onResetFilter,
}) => {
  const [bhk, setBhk] = useState<string>(activeFilter.bhk || 'ALL');
  const [propType, setPropType] = useState<string>(activeFilter.property_type || 'ALL');
  const [maxRent, setMaxRent] = useState<number>(activeFilter.rent_max || 100000);
  const [brokerageFree, setBrokerageFree] = useState<boolean>(activeFilter.brokerage_free_only || false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(activeFilter.verified_only || false);

  const handleApply = () => {
    onApplyFilter({
      bhk,
      property_type: propType as any,
      rent_max: maxRent,
      brokerage_free_only: brokerageFree,
      verified_only: verifiedOnly,
    });
    onClose();
  };

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
              <Text style={styles.title}>Filter Properties</Text>
              <Text style={styles.subtitle}>Customize your rental requirements.</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.scrollArea}>
            {/* BHK Selector */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>BHK Configuration</Text>
              <View style={styles.rowWrap}>
                {['ALL', '1 BHK', '2 BHK', '3 BHK', 'Studio'].map((item) => (
                  <React.Fragment key={item}>
                    <Pressable
                      onPress={() => setBhk(item)}
                      style={[
                        styles.chip,
                        bhk === item ? styles.chipSelected : styles.chipNormal,
                      ]}
                    >
                      <Text style={[styles.chipText, bhk === item ? styles.chipTextSelected : styles.chipTextNormal]}>
                        {item}
                      </Text>
                    </Pressable>
                  </React.Fragment>
                ))}
              </View>
            </View>

            {/* Property Type */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Property Type</Text>
              <View style={styles.rowWrap}>
                {[
                  { id: 'ALL', label: 'All Types' },
                  { id: 'FLAT', label: 'Flats' },
                  { id: 'PG', label: 'PG' },
                  { id: 'PRIVATE_ROOM', label: 'Private Room' },
                  { id: 'CO_LIVING', label: 'Co-Living' },
                ].map((item) => (
                  <React.Fragment key={item.id}>
                    <Pressable
                      onPress={() => setPropType(item.id)}
                      style={[
                        styles.chip,
                        propType === item.id ? styles.chipSelected : styles.chipNormal,
                      ]}
                    >
                      <Text style={[styles.chipText, propType === item.id ? styles.chipTextSelected : styles.chipTextNormal]}>
                        {item.label}
                      </Text>
                    </Pressable>
                  </React.Fragment>
                ))}
              </View>
            </View>

            {/* Toggles */}
            <View style={styles.sectionBorder}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>⚡ Zero Brokerage Only</Text>
                <Switch
                  value={brokerageFree}
                  onValueChange={setBrokerageFree}
                  trackColor={{ false: '#E4E2DD', true: '#6C4DFF' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>✓ Verified Listings Only</Text>
                <Switch
                  value={verifiedOnly}
                  onValueChange={setVerifiedOnly}
                  trackColor={{ false: '#E4E2DD', true: '#6C4DFF' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.footer}>
            <Pressable
              onPress={() => {
                onResetFilter();
                onClose();
              }}
              style={styles.resetBtn}
            >
              <Text style={styles.resetText}>Reset All</Text>
            </Pressable>
            <Pressable onPress={handleApply} style={styles.applyBtn}>
              <Text style={styles.applyText}>Apply Filters</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '85%',
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
    maxHeight: 380,
  },
  section: {
    marginBottom: 20,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#17151F',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  chipNormal: {
    backgroundColor: '#F7F5F0',
    borderColor: '#E4E2DD',
  },
  chipSelected: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '800',
  },
  chipTextNormal: {
    color: '#17151F',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  sectionBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F0EEE9',
    paddingTop: 16,
    gap: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#17151F',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F0EEE9',
    paddingTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  resetBtn: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#F7F5F0',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#17151F',
  },
  applyBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#6C4DFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

