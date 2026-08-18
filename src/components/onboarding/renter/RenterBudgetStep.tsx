import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { IndianRupee, ArrowRight, CheckCircle2 } from 'lucide-react-native';

export interface BudgetPreset {
  id: string;
  label: string;
  min: number;
  max: number;
  subtitle: string;
}

const BUDGET_PRESETS: BudgetPreset[] = [
  {
    id: 'under_15k',
    label: 'Under ₹15,000',
    min: 5000,
    max: 15000,
    subtitle: 'Great for PG, co-living & shared spaces',
  },
  {
    id: '15k_25k',
    label: '₹15,000 – ₹25,000',
    min: 15000,
    max: 25000,
    subtitle: '1 RKs, private rooms & standard 1 BHKs',
  },
  {
    id: '25k_40k',
    label: '₹25,000 – ₹40,000',
    min: 25000,
    max: 40000,
    subtitle: 'Spacious 1 BHK & modern 2 BHK apartments',
  },
  {
    id: '40k_60k',
    label: '₹40,000 – ₹60,000',
    min: 40000,
    max: 60000,
    subtitle: 'Premium 2 BHK & 3 BHK flats near metro',
  },
  {
    id: '60k_plus',
    label: '₹60,000+',
    min: 60000,
    max: 200000,
    subtitle: 'Luxury sea view & penthouse homes',
  },
];

interface RenterBudgetStepProps {
  selectedPresetId: string;
  onSelectBudget: (preset: BudgetPreset) => void;
  onContinue: () => void;
}

export const RenterBudgetStep: React.FC<RenterBudgetStepProps> = ({
  selectedPresetId,
  onSelectBudget,
  onContinue,
}) => {
  const currentPreset =
    BUDGET_PRESETS.find((p) => p.id === selectedPresetId) || BUDGET_PRESETS[1];

  return (
    <View style={styles.container}>
      <View style={styles.titleGroup}>
        <Text style={styles.heading}>What's your monthly budget?</Text>
        <Text style={styles.subheading}>
          Choose a comfortable rental range to prioritize matching properties.
        </Text>
      </View>

      {/* Selected Range Display Banner */}
      <View style={styles.displayCard}>
        <Text style={styles.displaySub}>Selected target budget</Text>
        <View style={styles.displayRow}>
          <IndianRupee size={20} color="#6C4DFF" strokeWidth={2.5} />
          <Text style={styles.displayText}>
            {currentPreset.min.toLocaleString('en-IN')} –{' '}
            {currentPreset.max >= 200000
              ? '2,00,000+'
              : currentPreset.max.toLocaleString('en-IN')}
            <Text style={styles.displayPeriod}> / month</Text>
          </Text>
        </View>
      </View>

      {/* Presets List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {BUDGET_PRESETS.map((item) => {
          const isSelected = selectedPresetId === item.id;

          return (
            <Pressable
              key={item.id}
              style={[styles.card, isSelected && styles.cardActive]}
              onPress={() => onSelectBudget(item)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${item.label}, ${item.subtitle}`}
            >
              <View style={styles.textCol}>
                <Text
                  style={[styles.cardTitle, isSelected && styles.cardTitleActive]}
                >
                  {item.label}
                </Text>
                <Text style={styles.cardSub}>{item.subtitle}</Text>
              </View>

              {isSelected && (
                <CheckCircle2 size={20} color="#6C4DFF" strokeWidth={2.5} />
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={styles.continueBtn}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to space requirements"
        >
          <Text style={styles.continueBtnText}>Continue</Text>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  titleGroup: {
    paddingVertical: 12,
    gap: 6,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
  },
  subheading: {
    fontSize: 14,
    color: '#777482',
    lineHeight: 20,
    fontWeight: '500',
  },
  displayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#6C4DFF',
    padding: 16,
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  displaySub: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  displayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  displayText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#171522',
  },
  displayPeriod: {
    fontSize: 13,
    fontWeight: '500',
    color: '#777482',
  },
  scrollContent: {
    paddingVertical: 8,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    gap: 14,
  },
  cardActive: {
    borderColor: '#6C4DFF',
    backgroundColor: '#FAF9FF',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#171522',
  },
  cardTitleActive: {
    color: '#6C4DFF',
    fontWeight: '800',
  },
  cardSub: {
    fontSize: 12,
    color: '#777482',
    lineHeight: 16,
    fontWeight: '500',
  },
  footer: {
    paddingVertical: 12,
  },
  continueBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
