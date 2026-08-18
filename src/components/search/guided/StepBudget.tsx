import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Wallet, IndianRupee } from 'lucide-react-native';

interface StepBudgetProps {
  rentMin: number;
  rentMax: number;
  onChange: (min: number, max: number) => void;
}

const PRESET_RANGES = [
  { label: 'Under ₹15K', min: 0, max: 15000 },
  { label: '₹15K–₹25K', min: 15000, max: 25000 },
  { label: '₹25K–₹40K', min: 25000, max: 40000 },
  { label: '₹40K–₹60K', min: 40000, max: 60000 },
  { label: '₹60K+', min: 60000, max: 200000 },
];

const MIN_OPTIONS = [
  { label: '₹0', value: 0 },
  { label: '₹10K', value: 10000 },
  { label: '₹15K', value: 15000 },
  { label: '₹20K', value: 20000 },
  { label: '₹30K', value: 30000 },
  { label: '₹50K', value: 50000 },
];

const MAX_OPTIONS = [
  { label: '₹15K', value: 15000 },
  { label: '₹25K', value: 25000 },
  { label: '₹35K', value: 35000 },
  { label: '₹50K', value: 50000 },
  { label: '₹75K', value: 75000 },
  { label: '₹1L+', value: 200000 },
];

export const StepBudget: React.FC<StepBudgetProps> = ({
  rentMin,
  rentMax,
  onChange,
}) => {
  const formatAmount = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
  };

  const isPresetActive = (pMin: number, pMax: number) =>
    rentMin === pMin && rentMax === pMax;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What's your budget?</Text>
        <Text style={styles.subtitle}>
          Choose a monthly budget that feels comfortable.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Selected Highlight Card */}
        <View style={styles.displayCard}>
          <View style={styles.walletIcon}>
            <IndianRupee size={22} color="#6C4DFF" strokeWidth={2.2} />
          </View>
          <View>
            <Text style={styles.displayLabel}>Target Monthly Rent</Text>
            <Text style={styles.displayValue}>
              {rentMin === 0
                ? `Up to ${formatAmount(rentMax)} / month`
                : `${formatAmount(rentMin)} – ${formatAmount(rentMax)} / month`}
            </Text>
          </View>
        </View>

        {/* Quick Presets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Budget Presets</Text>
          <View style={styles.presetWrap}>
            {PRESET_RANGES.map((preset) => {
              const active = isPresetActive(preset.min, preset.max);
              return (
                <Pressable
                  key={preset.label}
                  style={[styles.presetChip, active && styles.presetChipActive]}
                  onPress={() => onChange(preset.min, preset.max)}
                >
                  <Text
                    style={[
                      styles.presetText,
                      active && styles.presetTextActive,
                    ]}
                  >
                    {preset.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Minimum Budget Row */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minimum Rent</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rangeScroll}
          >
            {MIN_OPTIONS.map((opt) => {
              const selected = rentMin === opt.value;
              return (
                <Pressable
                  key={`min-${opt.value}`}
                  style={[styles.rangePill, selected && styles.rangePillActive]}
                  onPress={() => {
                    const newMin = opt.value;
                    const newMax = Math.max(rentMax, newMin + 5000);
                    onChange(newMin, newMax);
                  }}
                >
                  <Text
                    style={[
                      styles.rangePillText,
                      selected && styles.rangePillTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Maximum Budget Row */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maximum Rent</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rangeScroll}
          >
            {MAX_OPTIONS.map((opt) => {
              const selected = rentMax === opt.value;
              return (
                <Pressable
                  key={`max-${opt.value}`}
                  style={[styles.rangePill, selected && styles.rangePillActive]}
                  onPress={() => {
                    const newMax = opt.value;
                    const newMin = Math.min(rentMin, newMax - 5000);
                    onChange(Math.max(0, newMin), newMax);
                  }}
                >
                  <Text
                    style={[
                      styles.rangePillText,
                      selected && styles.rangePillTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    color: '#777482',
    fontWeight: '500',
    marginTop: 4,
  },
  scrollContent: {
    gap: 20,
    paddingBottom: 24,
  },
  displayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#F0ECFF',
    borderWidth: 1.5,
    borderColor: '#D4C8FF',
  },
  walletIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C4DFF',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  displayValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
    marginTop: 2,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  presetWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  presetChipActive: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  presetText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  presetTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  rangeScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  rangePill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    minWidth: 64,
    alignItems: 'center',
  },
  rangePillActive: {
    backgroundColor: '#171522',
    borderColor: '#171522',
  },
  rangePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  rangePillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
