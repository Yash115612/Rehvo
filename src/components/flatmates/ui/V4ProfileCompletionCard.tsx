import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CheckCircle2, Circle, ChevronRight, Sparkles } from 'lucide-react-native';

export interface V4ChecklistItem {
  key: string;
  label: string;
  isCompleted: boolean;
}

interface V4ProfileCompletionCardProps {
  progressPercentage: number;
  checklist: V4ChecklistItem[];
  onCompletePress?: () => void;
}

export const V4ProfileCompletionCard: React.FC<V4ProfileCompletionCardProps> = ({
  progressPercentage,
  checklist,
  onCompletePress,
}) => {
  const completedCount = checklist.filter((item) => item.isCompleted).length;
  const isFull = progressPercentage >= 100;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} color="#059669" />
            <Text style={styles.title}>Profile Strength</Text>
          </View>
          <Text style={styles.subtitle}>
            {isFull
              ? 'Your profile is 100% complete and boosted to 3x roommates!'
              : `${completedCount} of ${checklist.length} steps complete. Boost your matches!`}
          </Text>
        </View>
        <View style={styles.percentBadge}>
          <Text style={styles.percentText}>{progressPercentage}%</Text>
        </View>
      </View>

      {/* Progress Bar Track */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
      </View>

      {/* Checklist Grid */}
      <View style={styles.checklistGrid}>
        {checklist.map((item) => (
          <View key={item.key} style={styles.checkItem}>
            {item.isCompleted ? (
              <CheckCircle2 size={15} color="#059669" strokeWidth={2.6} />
            ) : (
              <Circle size={15} color="#CBD5E1" strokeWidth={2} />
            )}
            <Text
              style={[
                styles.checkItemText,
                item.isCompleted && styles.checkItemTextDone,
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      {/* CTA Button if incomplete */}
      {!isFull && onCompletePress && (
        <Pressable
          style={styles.ctaBtn}
          onPress={onCompletePress}
          accessibilityRole="button"
          accessibilityLabel="Complete profile"
        >
          <Text style={styles.ctaBtnText}>Complete Profile to 100%</Text>
          <ChevronRight size={15} color="#FFFFFF" strokeWidth={2.4} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  titleWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  percentBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  percentText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#059669',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  checklistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 4,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '47%',
  },
  checkItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  checkItemTextDone: {
    color: '#0F172A',
    fontWeight: '700',
  },
  ctaBtn: {
    height: 44,
    backgroundColor: '#059669',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  ctaBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
