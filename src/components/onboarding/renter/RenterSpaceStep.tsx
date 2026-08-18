import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { BedDouble, CheckCircle2, ArrowRight } from 'lucide-react-native';
import { RenterPropertyTypeChoice } from './RenterPropertyTypeStep';

interface SpaceOption {
  id: string;
  title: string;
  subtitle: string;
}

const APARTMENT_SPACES: SpaceOption[] = [
  { id: '1 RK', title: '1 RK / Studio', subtitle: 'Compact independent unit' },
  { id: '1 BHK', title: '1 BHK', subtitle: 'Ideal for singles & couples' },
  { id: '2 BHK', title: '2 BHK', subtitle: 'Spacious for small families & flatmates' },
  { id: '3 BHK', title: '3 BHK', subtitle: 'Large family homes with extra space' },
  { id: '4+ BHK', title: '4+ BHK', subtitle: 'Expansive luxury living' },
];

const ROOM_SPACES: SpaceOption[] = [
  { id: 'Private Room', title: 'Private Room', subtitle: 'Single occupancy with full privacy' },
  { id: 'Shared Room', title: 'Shared Room (Twin)', subtitle: '2 beds in one room' },
  { id: 'Single Occupancy', title: 'Single Occupancy PG', subtitle: 'Dedicated room with food options' },
  { id: 'Double Occupancy', title: 'Double Occupancy PG', subtitle: 'Shared PG accommodation' },
];

interface RenterSpaceStepProps {
  propertyType: RenterPropertyTypeChoice;
  selectedSpace: string;
  onSelectSpace: (space: string) => void;
  onContinue: () => void;
}

export const RenterSpaceStep: React.FC<RenterSpaceStepProps> = ({
  propertyType,
  selectedSpace,
  onSelectSpace,
  onContinue,
}) => {
  const isRoomOrPG =
    propertyType === 'PG' ||
    propertyType === 'PRIVATE_ROOM' ||
    propertyType === 'SHARED_ROOM' ||
    propertyType === 'FLATMATE';

  const spaces = isRoomOrPG ? ROOM_SPACES : APARTMENT_SPACES;

  return (
    <View style={styles.container}>
      <View style={styles.titleGroup}>
        <Text style={styles.heading}>How much space do you need?</Text>
        <Text style={styles.subheading}>
          {isRoomOrPG
            ? 'Select your preferred occupancy type.'
            : 'Select the bedroom configuration you prefer.'}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {spaces.map((item) => {
          const isSelected = selectedSpace === item.id;

          return (
            <Pressable
              key={item.id}
              style={[styles.card, isSelected && styles.cardActive]}
              onPress={() => onSelectSpace(item.id)}
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
                <BedDouble
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
          accessibilityLabel="Continue to furnishing selection"
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
