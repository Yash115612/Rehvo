import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Sparkles, CheckCircle, Award, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { Property, AIDecisionSummary } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

interface V4AIDecisionCardProps {
  property: Property;
  summary: AIDecisionSummary;
  onSelectProperty?: () => void;
  onBookVisit?: () => void;
}

export const V4AIDecisionCard: React.FC<V4AIDecisionCardProps> = React.memo(
  ({ property, summary, onSelectProperty, onBookVisit }) => {
    const dimensions = [
      { label: 'Budget Fit', score: summary.dimensionFits.budgetFit, color: '#0F766E' },
      { label: 'Commute Fit', score: summary.dimensionFits.commuteFit, color: '#2563EB' },
      { label: 'Amenities Fit', score: summary.dimensionFits.amenitiesFit, color: '#7C3AED' },
      { label: 'Lifestyle Fit', score: summary.dimensionFits.lifestyleFit, color: '#EA580C' },
      { label: 'Family Safety', score: summary.dimensionFits.familyFit, color: '#059669' },
      { label: 'Investment Yield', score: summary.dimensionFits.investmentFit, color: '#D97706' },
    ];

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.topRow}>
          <View style={styles.badgeWrap}>
            <Sparkles size={14} color="#0F766E" />
            <Text style={styles.badgeText}>REHVO AI DECISION SUMMARY</Text>
          </View>
          <View style={styles.confidencePill}>
            <Award size={13} color="#065F46" />
            <Text style={styles.confidenceText}>{summary.confidencePercent}% Match</Text>
          </View>
        </View>

        {/* Headline & Reason */}
        <View style={styles.headlineCol}>
          <Text style={styles.headline}>{summary.headline}</Text>
          <Text style={styles.keyReason}>{summary.keyReason}</Text>
        </View>

        {/* 6 Dimensional Fits Grid */}
        <View style={styles.dimensionsGrid}>
          {dimensions.map((dim, idx) => (
            <View key={idx} style={styles.dimRow}>
              <View style={styles.dimHeader}>
                <Text style={styles.dimLabel}>{dim.label}</Text>
                <Text style={styles.dimScore}>{dim.score}%</Text>
              </View>
              <View style={styles.dimTrack}>
                <View
                  style={[
                    styles.dimFill,
                    { width: `${dim.score}%`, backgroundColor: dim.color },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Action Button */}
        {onBookVisit && (
          <Pressable
            onPress={onBookVisit}
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.actionBtnPressed,
            ]}
          >
            <ShieldCheck size={18} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>Schedule Free Visit for Winner</Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </Pressable>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(15, 118, 110, 0.25)',
    gap: 14,
    ...V4_SHADOWS.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: V4_COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: V4_COLORS.primary,
    letterSpacing: 0.5,
  },
  confidencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  headlineCol: {
    gap: 6,
  },
  headline: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  keyReason: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  dimensionsGrid: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dimRow: {
    gap: 4,
  },
  dimHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dimLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
  dimScore: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  dimTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  dimFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionBtn: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    ...V4_SHADOWS.card,
  },
  actionBtnPressed: {
    opacity: 0.88,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
