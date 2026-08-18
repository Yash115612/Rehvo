import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import {
  ShieldCheck,
  Train,
  Car,
  Wind,
  Wifi,
  Building,
  Zap,
  Sun,
  Shield,
  Dog,
  Dumbbell,
  Check,
  ArrowRight,
} from 'lucide-react-native';

interface PreferenceOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}

const PREFERENCE_OPTIONS: PreferenceOption[] = [
  { id: 'No Brokerage', label: 'No Brokerage', icon: ShieldCheck },
  { id: 'Near Metro', label: 'Near Metro', icon: Train },
  { id: 'Parking', label: 'Car Parking', icon: Car },
  { id: 'AC', label: 'Air Conditioning', icon: Wind },
  { id: 'Wi-Fi', label: 'High-speed Wi-Fi', icon: Wifi },
  { id: 'Lift', label: 'Elevator / Lift', icon: Building },
  { id: 'Power Backup', label: 'Power Backup', icon: Zap },
  { id: 'Balcony', label: 'Balcony / Open View', icon: Sun },
  { id: 'Security 24/7', label: 'Gated Security 24/7', icon: Shield },
  { id: 'Pet Friendly', label: 'Pet Friendly', icon: Dog },
  { id: 'Gym', label: 'Fitness Gym', icon: Dumbbell },
];

interface RenterPreferencesStepProps {
  selectedPreferences: string[];
  onTogglePreference: (pref: string) => void;
  onContinue: () => void;
  onSkip: () => void;
}

export const RenterPreferencesStep: React.FC<RenterPreferencesStepProps> = ({
  selectedPreferences,
  onTogglePreference,
  onContinue,
  onSkip,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleGroup}>
        <Text style={styles.heading}>Anything else that matters?</Text>
        <Text style={styles.subheading}>
          Pick the amenities and preferences that make a place feel right.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.grid}>
          {PREFERENCE_OPTIONS.map((item) => {
            const isSelected = selectedPreferences.includes(item.id);
            const Icon = item.icon;

            return (
              <Pressable
                key={item.id}
                style={[styles.pill, isSelected && styles.pillSelected]}
                onPress={() => onTogglePreference(item.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={item.label}
              >
                <Icon
                  size={16}
                  color={isSelected ? '#6C4DFF' : '#777482'}
                  strokeWidth={2}
                />
                <Text
                  style={[
                    styles.pillText,
                    isSelected && styles.pillTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
                {isSelected && (
                  <Check size={14} color="#6C4DFF" strokeWidth={2.5} />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer with Skip and Continue */}
      <View style={styles.footer}>
        <Pressable
          style={styles.continueBtn}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to move-in timing"
        >
          <Text style={styles.continueBtnText}>Continue</Text>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
        </Pressable>

        <Pressable
          style={styles.skipBtn}
          onPress={onSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip preferences"
        >
          <Text style={styles.skipBtnText}>Skip for now</Text>
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
  scrollContent: {
    paddingVertical: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 8,
  },
  pillSelected: {
    borderColor: '#6C4DFF',
    backgroundColor: '#FAF9FF',
  },
  pillText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#171522',
  },
  pillTextSelected: {
    color: '#6C4DFF',
    fontWeight: '700',
  },
  footer: {
    paddingVertical: 12,
    gap: 8,
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
  skipBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  skipBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777482',
  },
});
