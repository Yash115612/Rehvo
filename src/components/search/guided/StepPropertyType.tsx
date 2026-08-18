import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import {
  Building2,
  Users,
  BedDouble,
  Users2,
  Sparkles,
  Home,
  Layout,
  Check,
} from 'lucide-react-native';
import { GuidedPropertyCategory } from './guidedSearchTypes';

interface StepPropertyTypeProps {
  selected: GuidedPropertyCategory;
  onSelect: (category: GuidedPropertyCategory) => void;
}

interface CategoryOption {
  id: GuidedPropertyCategory;
  title: string;
  description: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: 'FLAT',
    title: 'Flat / Apartment',
    description: 'An entire home for yourself or your family.',
    icon: Building2,
  },
  {
    id: 'PG',
    title: 'PG / Co-living',
    description: 'Move into a managed shared space with meals & amenities.',
    icon: Users,
  },
  {
    id: 'PRIVATE_ROOM',
    title: 'Private Room',
    description: 'Your own private room in a shared home.',
    icon: BedDouble,
  },
  {
    id: 'SHARED_ROOM',
    title: 'Shared Room',
    description: 'Share a room with a roommate and save more.',
    icon: Users2,
  },
  {
    id: 'FLATMATE',
    title: 'Flatmate',
    description: 'Find a place with compatible roommates.',
    icon: Sparkles,
  },
  {
    id: 'STUDIO',
    title: 'Studio',
    description: 'Compact, efficient private living.',
    icon: Layout,
  },
];

export const StepPropertyType: React.FC<StepPropertyTypeProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What are you looking for?</Text>
        <Text style={styles.subtitle}>
          Tell us what kind of place you want.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {CATEGORY_OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          const Icon = opt.icon;

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
                  <Icon
                    size={22}
                    color={isSelected ? '#6C4DFF' : '#171522'}
                    strokeWidth={1.9}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}
                  >
                    {opt.title}
                  </Text>
                  <Text style={styles.cardDescription}>{opt.description}</Text>
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
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F3F0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleSelected: {
    backgroundColor: '#ECE7FF',
  },
  textContainer: {
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
  cardDescription: {
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
