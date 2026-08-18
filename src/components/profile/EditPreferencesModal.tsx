import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { UserProfile } from '../../types';

interface EditPreferencesModalProps {
  visible: boolean;
  user: UserProfile | null;
  onClose: () => void;
  onSave: (data: Partial<UserProfile>) => void;
}

const BHK_OPTIONS = ['1 RK', '1 BHK', '2 BHK', '3+ BHK'];
const FURNISHING_OPTIONS = [
  { id: 'FULLY_FURNISHED', label: 'Fully Furnished' },
  { id: 'SEMI_FURNISHED', label: 'Semi Furnished' },
  { id: 'UNFURNISHED', label: 'Unfurnished' },
];

export const EditPreferencesModal: React.FC<EditPreferencesModalProps> = ({
  visible,
  user,
  onClose,
  onSave,
}) => {
  const [budgetMin, setBudgetMin] = useState(
    user?.budget_min ? String(user.budget_min) : '20000',
  );
  const [budgetMax, setBudgetMax] = useState(
    user?.budget_max ? String(user.budget_max) : '60000',
  );
  const [locality, setLocality] = useState(user?.locality || 'Andheri West');
  const [moveIn, setMoveIn] = useState(user?.move_in_date || 'Immediate');
  const [selectedBhk, setSelectedBhk] = useState<string>('2 BHK');
  const [furnishing, setFurnishing] = useState<string>('FULLY_FURNISHED');

  const handleSave = () => {
    const minVal = parseInt(budgetMin.replace(/\D/g, ''), 10) || 15000;
    const maxVal = parseInt(budgetMax.replace(/\D/g, ''), 10) || 50000;

    onSave({
      budget_min: minVal,
      budget_max: maxVal,
      locality: locality.trim() || 'Mumbai',
      move_in_date: moveIn.trim() || 'Immediate',
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Rental Preferences</Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <X size={20} color="#171522" strokeWidth={2} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}
          >
            {/* Preferred Locality */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferred Locality</Text>
              <TextInput
                style={styles.input}
                value={locality}
                onChangeText={setLocality}
                placeholder="e.g. Andheri West, Bandra, Powai"
                placeholderTextColor="#777482"
              />
            </View>

            {/* Monthly Budget Range */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monthly Budget (₹)</Text>
              <View style={styles.budgetRow}>
                <View style={styles.budgetInputWrap}>
                  <Text style={styles.prefix}>Min ₹</Text>
                  <TextInput
                    style={styles.budgetInput}
                    value={budgetMin}
                    onChangeText={setBudgetMin}
                    keyboardType="numeric"
                    placeholder="15000"
                    placeholderTextColor="#777482"
                  />
                </View>
                <Text style={styles.hyphen}>—</Text>
                <View style={styles.budgetInputWrap}>
                  <Text style={styles.prefix}>Max ₹</Text>
                  <TextInput
                    style={styles.budgetInput}
                    value={budgetMax}
                    onChangeText={setBudgetMax}
                    keyboardType="numeric"
                    placeholder="60000"
                    placeholderTextColor="#777482"
                  />
                </View>
              </View>
            </View>

            {/* BHK Types */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Apartment / Configuration</Text>
              <View style={styles.pillRow}>
                {BHK_OPTIONS.map((bhk) => {
                  const active = selectedBhk === bhk;
                  return (
                    <Pressable
                      key={bhk}
                      onPress={() => setSelectedBhk(bhk)}
                      style={[styles.pill, active && styles.pillActive]}
                    >
                      <Text style={[styles.pillText, active && styles.pillTextActive]}>
                        {bhk}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Furnishing */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Furnishing Status</Text>
              <View style={styles.pillRow}>
                {FURNISHING_OPTIONS.map((f) => {
                  const active = furnishing === f.id;
                  return (
                    <Pressable
                      key={f.id}
                      onPress={() => setFurnishing(f.id)}
                      style={[styles.pill, active && styles.pillActive]}
                    >
                      <Text style={[styles.pillText, active && styles.pillTextActive]}>
                        {f.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Target Move-in Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Target Move-in Date</Text>
              <TextInput
                style={styles.input}
                value={moveIn}
                onChangeText={setMoveIn}
                placeholder="e.g. Immediate, Next Month, Sept 2026"
                placeholderTextColor="#777482"
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable
              onPress={onClose}
              style={styles.cancelBtn}
              accessibilityRole="button"
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={styles.saveBtn}
              accessibilityRole="button"
            >
              <Check size={18} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={styles.saveBtnText}>Save Preferences</Text>
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
    backgroundColor: 'rgba(23, 21, 34, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEE9',
  },
  title: {
    fontSize: 18,
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
  body: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#171522',
    backgroundColor: '#FBFBFA',
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  budgetInputWrap: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FBFBFA',
  },
  prefix: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777482',
    marginRight: 4,
  },
  budgetInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#171522',
    paddingVertical: 0,
  },
  hyphen: {
    fontSize: 16,
    color: '#777482',
    fontWeight: '600',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    backgroundColor: '#FFFFFF',
  },
  pillActive: {
    borderColor: '#6C4DFF',
    backgroundColor: '#F0ECFF',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#777482',
  },
  pillTextActive: {
    color: '#6C4DFF',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0EEE9',
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#777482',
  },
  saveBtn: {
    flex: 1.5,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
