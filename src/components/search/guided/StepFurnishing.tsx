import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Armchair, Sparkles, Box, Check } from 'lucide-react-native';
import { FurnishingType } from '../../../types';

interface StepFurnishingProps {
  furnishing: FurnishingType | 'ALL';
  onSelect: (type: FurnishingType | 'ALL') => void;
}

const FURNISHING_OPTIONS: {
  id: FurnishingType | 'ALL';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}[] = [
  {
    id: 'ALL',
    title: 'Any Furnishing',
    subtitle: 'Show all properties regardless of furnishing level.',
    icon: Sparkles,
  },
  {
    id: 'FULLY_FURNISHED',
    title: 'Fully Furnished',
    subtitle: 'Ready to move in with sofa, beds, TV, appliances & kitchen.',
    icon: Armchair,
  },
  {
    id: 'SEMI_FURNISHED',
    title: 'Semi Furnished',
    subtitle: 'Includes built-in wardrobes, modular kitchen, lights & fans.',
    icon: Box,
  },
  {
    id: 'UNFURNISHED',
    title: 'Unfurnished',
    subtitle: 'Clean blank canvas to bring all your own furniture.',
    icon: Box,
  },
];

export const StepFurnishing: React.FC<StepFurnishingProps> = ({
  furnishing,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>How would you like it furnished?</Text>
        <Text style={styles.subtitle}>
          Select your preferred furnishing level.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {FURNISHING_OPTIONS.map((opt) => {
          const isSelected = furnishing === opt.id;
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
