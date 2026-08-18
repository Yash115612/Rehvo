import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Calendar, Clock, Sparkles, Check } from 'lucide-react-native';
import { GuidedMoveInTime } from './guidedSearchTypes';

interface StepMoveInProps {
  moveInTime: GuidedMoveInTime;
  onSelect: (time: GuidedMoveInTime) => void;
}

const MOVE_IN_OPTIONS: {
  id: GuidedMoveInTime;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}[] = [
  {
    id: 'IMMEDIATE',
    title: 'Immediately',
    subtitle: 'Ready to finalize and move in right now.',
    icon: Sparkles,
  },
  {
    id: 'WITHIN_2_WEEKS',
    title: 'Within 2 weeks',
    subtitle: 'Looking for fast occupancy this month.',
    icon: Clock,
  },
  {
    id: 'WITHIN_1_MONTH',
    title: 'Within 1 month',
    subtitle: 'Planning for the upcoming month.',
    icon: Calendar,
  },
  {
    id: 'IN_2_3_MONTHS',
    title: 'In 2–3 months',
    subtitle: 'Exploring and shortlisting in advance.',
    icon: Calendar,
  },
  {
    id: 'NOT_DECIDED',
    title: 'Not decided yet',
    subtitle: 'Just browsing homes and comparing prices.',
    icon: Clock,
  },
];

export const StepMoveIn: React.FC<StepMoveInProps> = ({
  moveInTime,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>When are you planning to move?</Text>
        <Text style={styles.subtitle}>
          Let owners know your preferred timeline.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {MOVE_IN_OPTIONS.map((opt) => {
          const isSelected = moveInTime === opt.id;
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
