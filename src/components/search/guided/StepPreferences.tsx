import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import {
  ShieldCheck,
  Train,
  Car,
  Snowflake,
  Wifi,
  Building,
  Zap,
  Sun,
  Heart,
  Shield,
  Check,
} from 'lucide-react-native';

interface StepPreferencesProps {
  preferences: string[];
  onChange: (prefs: string[]) => void;
}

interface PreferenceItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}

const PREFERENCE_OPTIONS: PreferenceItem[] = [
  { id: 'No Brokerage', label: 'No Brokerage', icon: ShieldCheck },
  { id: 'Near Metro', label: 'Near Metro', icon: Train },
  { id: 'Parking', label: 'Dedicated Parking', icon: Car },
  { id: 'AC', label: 'Air Conditioning (AC)', icon: Snowflake },
  { id: 'Wi-Fi', label: 'High-Speed Wi-Fi', icon: Wifi },
  { id: 'Lift', label: 'Elevator / Lift', icon: Building },
  { id: 'Power Backup', label: '24/7 Power Backup', icon: Zap },
  { id: 'Balcony', label: 'Private Balcony', icon: Sun },
  { id: 'Pet Friendly', label: 'Pet Friendly', icon: Heart },
  { id: 'Security', label: 'Gated 24/7 Security', icon: Shield },
];

export const StepPreferences: React.FC<StepPreferencesProps> = ({
  preferences,
  onChange,
}) => {
  const togglePreference = (id: string) => {
    if (preferences.includes(id)) {
      onChange(preferences.filter((p) => p !== id));
    } else {
      onChange([...preferences, id]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Anything else that matters?</Text>
        <Text style={styles.subtitle}>
          Select amenities and perks you'd love to have. (Optional)
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      >
        {PREFERENCE_OPTIONS.map((item) => {
          const isSelected = preferences.includes(item.id);
          const Icon = item.icon;

          return (
            <Pressable
              key={item.id}
              style={[styles.chipCard, isSelected && styles.chipCardSelected]}
              onPress={() => togglePreference(item.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
            >
              <View
                style={[
                  styles.iconWrap,
                  isSelected && styles.iconWrapSelected,
                ]}
              >
                <Icon
                  size={19}
                  color={isSelected ? '#6C4DFF' : '#171522'}
                  strokeWidth={2}
                />
              </View>

              <Text
                style={[styles.label, isSelected && styles.labelSelected]}
                numberOfLines={1}
              >
                {item.label}
              </Text>

              <View
                style={[
                  styles.checkbox,
                  isSelected && styles.checkboxSelected,
                ]}
              >
                {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>
            </Pressable>
          );
        })}
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
  grid: {
    gap: 10,
    paddingBottom: 24,
  },
  chipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
  },
  chipCardSelected: {
    backgroundColor: '#F7F4FF',
    borderColor: '#6C4DFF',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F0EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconWrapSelected: {
    backgroundColor: '#ECE7FF',
  },
  label: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#171522',
  },
  labelSelected: {
    color: '#171522',
    fontWeight: '700',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D4D0DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
});
