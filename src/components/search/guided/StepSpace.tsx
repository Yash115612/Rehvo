import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { BedDouble, Check } from 'lucide-react-native';
import { GuidedPropertyCategory, GuidedSpaceType } from './guidedSearchTypes';

interface StepSpaceProps {
  category: GuidedPropertyCategory;
  spaceType: GuidedSpaceType | 'ANY';
  onSelect: (space: GuidedSpaceType | 'ANY') => void;
}

interface SpaceOption {
  id: GuidedSpaceType | 'ANY';
  title: string;
  subtitle: string;
}

export const StepSpace: React.FC<StepSpaceProps> = ({
  category,
  spaceType,
  onSelect,
}) => {
  const getOptions = (): SpaceOption[] => {
    if (category === 'PG') {
      return [
        {
          id: 'SINGLE_OCCUPANCY',
          title: 'Single Occupancy',
          subtitle: 'Private personal bedroom inside managed PG.',
        },
        {
          id: 'DOUBLE_OCCUPANCY',
          title: 'Double Occupancy',
          subtitle: '2 sharing room with comfortable separate bed.',
        },
        {
          id: 'TRIPLE_OCCUPANCY',
          title: 'Triple Occupancy',
          subtitle: '3 sharing setup with maximum rent savings.',
        },
        {
          id: 'ANY',
          title: 'Any Occupancy',
          subtitle: 'Show all available room types in PG / Co-living.',
        },
      ];
    }

    if (
      category === 'PRIVATE_ROOM' ||
      category === 'SHARED_ROOM' ||
      category === 'FLATMATE'
    ) {
      return [
        {
          id: 'PRIVATE_ROOM',
          title: 'Private Room',
          subtitle: 'Your own private room with access to shared hall & kitchen.',
        },
        {
          id: 'SHARED_ROOM',
          title: 'Shared Room',
          subtitle: 'Share a room with compatible flatmates for lower rent.',
        },
        {
          id: 'ANY',
          title: 'Any Room Setup',
          subtitle: 'Open to both private and shared room options.',
        },
      ];
    }

    // Default for Flat / Apartment / Studio
    return [
      {
        id: '1 RK',
        title: '1 RK',
        subtitle: '1 Room + Kitchen studio layout.',
      },
      {
        id: '1 BHK',
        title: '1 BHK',
        subtitle: '1 Bedroom, Living Room, Kitchen & Bath.',
      },
      {
        id: '2 BHK',
        title: '2 BHK',
        subtitle: '2 Bedrooms, Living Room, Kitchen & 2 Baths.',
      },
      {
        id: '3 BHK',
        title: '3 BHK',
        subtitle: '3 Bedrooms with generous family living space.',
      },
      {
        id: '4+ BHK',
        title: '4+ BHK',
        subtitle: 'Expansive multi-bedroom homes and luxury layouts.',
      },
      {
        id: 'ANY',
        title: 'Any BHK',
        subtitle: 'Show all available apartment sizes.',
      },
    ];
  };

  const options = getOptions();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>How much space do you need?</Text>
        <Text style={styles.subtitle}>
          Choose the configuration that fits your lifestyle.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {options.map((opt) => {
          const isSelected = spaceType === opt.id;
          return (
            <Pressable
              key={opt.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => onSelect(opt.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
            >
              <View style={styles.cardLeft}>
                <View
                  style={[
                    styles.iconCircle,
                    isSelected && styles.iconCircleSelected,
                  ]}
                >
                  <BedDouble
                    size={20}
                    color={isSelected ? '#6C4DFF' : '#171522'}
                    strokeWidth={1.9}
                  />
                </View>
                <View style={styles.textWrap}>
                  <Text
                    style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}
                  >
                    {opt.title}
                  </Text>
                  <Text style={styles.cardSubtitle}>{opt.subtitle}</Text>
                </View>
              </View>

              <View
                style={[
                  styles.checkbox,
                  isSelected && styles.checkboxSelected,
                ]}
              >
                {isSelected && <Check size={14} color="#FFFFFF" strokeWidth={2.5} />}
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
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
  },
  cardSelected: {
    backgroundColor: '#F7F4FF',
    borderColor: '#6C4DFF',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    marginRight: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleSelected: {
    backgroundColor: '#ECE7FF',
  },
  textWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#171522',
  },
  cardTitleSelected: {
    color: '#171522',
  },
  cardSubtitle: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '500',
    marginTop: 2,
    lineHeight: 17,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
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
