import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import {
  Building2,
  BedDouble,
  DoorClosed,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react-native';

export type OwnerListingIntent = 'RENT' | 'PG' | 'ROOM';

interface IntentOption {
  id: OwnerListingIntent;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}

const INTENT_OPTIONS: IntentOption[] = [
  {
    id: 'RENT',
    title: 'Standard Rental Property',
    subtitle: 'Entire apartment, floor, flat, or independent house',
    icon: Building2,
  },
  {
    id: 'PG',
    title: 'PG & Co-Living Stay',
    subtitle: 'Managed accommodation with food, Wi-Fi & housekeeping',
    icon: BedDouble,
  },
  {
    id: 'ROOM',
    title: 'Individual Room Rental',
    subtitle: 'Private room or shared space in an occupied flat',
    icon: DoorClosed,
  },
];

interface OwnerIntentStepProps {
  selectedIntent: OwnerListingIntent;
  onSelectIntent: (intent: OwnerListingIntent) => void;
  onContinue: () => void;
}

export const OwnerIntentStep: React.FC<OwnerIntentStepProps> = ({
  selectedIntent,
  onSelectIntent,
  onContinue,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleGroup}>
        <Text style={styles.heading}>What are you planning to list?</Text>
        <Text style={styles.subheading}>
          Select your primary listing model on REHVO.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {INTENT_OPTIONS.map((item) => {
          const isSelected = selectedIntent === item.id;
          const Icon = item.icon;

          return (
            <Pressable
              key={item.id}
              style={[styles.card, isSelected && styles.cardActive]}
              onPress={() => onSelectIntent(item.id)}
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
                <Icon
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
          accessibilityLabel="Continue to owner profile setup"
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
