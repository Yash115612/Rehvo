import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Armchair, CheckCircle2, ArrowRight } from 'lucide-react-native';

export type FurnishingChoice = 'ANY' | 'FULLY_FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED';

interface FurnishingOption {
  id: FurnishingChoice;
  title: string;
  subtitle: string;
}

const FURNISHING_OPTIONS: FurnishingOption[] = [
  {
    id: 'ANY',
    title: 'Any Furnishing',
    subtitle: 'Show all properties regardless of furnishings',
  },
  {
    id: 'FULLY_FURNISHED',
    title: 'Fully Furnished',
    subtitle: 'Beds, sofa, TV, fridge, washing machine & kitchen',
  },
  {
    id: 'SEMI_FURNISHED',
    title: 'Semi Furnished',
    subtitle: 'Modular kitchen cabinets, wardrobes, lights & fans',
  },
  {
    id: 'UNFURNISHED',
    title: 'Unfurnished',
    subtitle: 'Clean blank space to bring your own furniture',
  },
];

interface RenterFurnishingStepProps {
  selectedFurnishing: FurnishingChoice;
  onSelectFurnishing: (furnishing: FurnishingChoice) => void;
  onContinue: () => void;
}

export const RenterFurnishingStep: React.FC<RenterFurnishingStepProps> = ({
  selectedFurnishing,
  onSelectFurnishing,
  onContinue,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleGroup}>
        <Text style={styles.heading}>How would you like it furnished?</Text>
        <Text style={styles.subheading}>
          Choose your desired move-in readiness level.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FURNISHING_OPTIONS.map((item) => {
          const isSelected = selectedFurnishing === item.id;

          return (
            <Pressable
              key={item.id}
              style={[styles.card, isSelected && styles.cardActive]}
              onPress={() => onSelectFurnishing(item.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${item.title}, ${item.subtitle}`}
            >
              <View
                style={[
                  styles.iconWrap,
                  isSelected && styles.iconWrapActive,
                ]}
              >
                <Armchair
                  size={22}
                  color={isSelected ? '#6C4DFF' : '#171522'}
                  strokeWidth={2}
                />
              </View>

              <View style={styles.textCol}>
                <Text
                  style={[styles.cardTitle, isSelected && styles.cardTitleActive]}
                >
                  {item.title}
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

      <View style={styles.footer}>
        <Pressable
          style={styles.continueBtn}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to lifestyle preferences"
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
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#F0ECFF',
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
