import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Users,
  Building,
  Navigation,
  DollarSign,
  AlertCircle,
  ArrowRight,
  School,
  Train,
  CheckCircle2,
} from 'lucide-react-native';
import { Property, PropertyAIQueryType, PropertyAIExplanation } from '../../../types';
import { explainProperty } from '../../../services/rehvoAI';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

interface V4PropertyAICardProps {
  property: Property;
}

const QUERY_CHIPS: { type: PropertyAIQueryType; label: string; icon: any }[] = [
  { type: 'overpriced_check', label: 'Overpriced?', icon: TrendingDown },
  { type: 'safety_check', label: 'Safety & Police', icon: ShieldCheck },
  { type: 'bachelor_fit', label: 'Good for Bachelors?', icon: Users },
  { type: 'family_fit', label: 'Family & Schools', icon: School },
  { type: 'commute_analysis', label: 'Commute Times', icon: Navigation },
  { type: 'investment_analysis', label: 'Rental Yield', icon: Building },
  { type: 'hidden_costs', label: 'Hidden Costs', icon: DollarSign },
  { type: 'metro', label: 'Metro & Transit', icon: Train },
];

export const V4PropertyAICard: React.FC<V4PropertyAICardProps> = React.memo(
  ({ property }) => {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<PropertyAIQueryType>('overpriced_check');
    const [explanation, setExplanation] = useState<PropertyAIExplanation | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      let isMounted = true;
      setLoading(true);
      explainProperty(property, selectedType).then((res) => {
        if (isMounted) {
          setExplanation(res);
          setLoading(false);
        }
      });
      return () => {
        isMounted = false;
      };
    }, [property, selectedType]);

    const handleDeepDive = () => {
      const activeChip = QUERY_CHIPS.find((c) => c.type === selectedType);
      router.push({
        pathname: '/(renter)/ai',
        params: {
          prompt: `Analyze ${activeChip?.label || 'this property'} for ${property.title} in ${property.locality}`,
          propertyId: property.id,
          context: 'property',
        },
      } as any);
    };

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeWrap}>
            <Sparkles size={13} color={V4_COLORS.primary} />
            <Text style={styles.badgeText}>ASK REHVO AI</Text>
          </View>
          <Text style={styles.zeroBrokerageBadge}>100% Verified Comps</Text>
        </View>

        <Text style={styles.title}>AI Property Audit & Intelligence</Text>
        <Text style={styles.subtitle}>
          Instant AI assessment based on 10,000+ Mumbai verified transactions.
        </Text>

        {/* 8 Inquiry Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {QUERY_CHIPS.map((chip) => {
            const isSelected = selectedType === chip.type;
            const Icon = chip.icon;
            return (
              <Pressable
                key={chip.type}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => setSelectedType(chip.type)}
              >
                <Icon
                  size={12}
                  color={isSelected ? '#FFFFFF' : V4_COLORS.primary}
                />
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Answer Card */}
        {explanation && (
          <View style={styles.answerCard}>
            <View style={styles.answerHeader}>
              <View style={styles.headlineCol}>
                <Text style={styles.answerHeadline}>{explanation.headline}</Text>
                <Text style={styles.answerVerdictText}>
                  AI Score: <Text style={styles.scoreHighlight}>{explanation.scoreOutOf100}/100</Text> • {explanation.verdict}
                </Text>
              </View>

              {explanation.metricsBadge && (
                <View style={styles.metricsPill}>
                  <Text style={styles.metricsPillText}>{explanation.metricsBadge}</Text>
                </View>
              )}
            </View>

            <Text style={styles.detailedAnalysis}>{explanation.detailedAnalysis}</Text>

            <View style={styles.bulletsList}>
              {explanation.bulletPoints.map((b, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <CheckCircle2 size={12} color={V4_COLORS.primary} />
                  <Text style={styles.bulletText}>{b}</Text>
                </View>
              ))}
            </View>

            {/* Deep Dive Action */}
            <Pressable style={styles.deepDiveBtn} onPress={handleDeepDive}>
              <Text style={styles.deepDiveText}>Ask follow-up in REHVO AI Chat</Text>
              <ArrowRight size={14} color="#FFFFFF" />
            </Pressable>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.xl,
    padding: 16,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: V4_COLORS.primary,
    letterSpacing: 0.5,
  },
  zeroBrokerageBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 12,
  },
  chipsScroll: {
    gap: 8,
    paddingBottom: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 44,
  },
  chipActive: {
    backgroundColor: V4_COLORS.primary,
    borderColor: V4_COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  answerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  answerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headlineCol: {
    flex: 1,
  },
  answerHeadline: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  answerVerdictText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  scoreHighlight: {
    color: V4_COLORS.primary,
    fontWeight: '800',
  },
  metricsPill: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metricsPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  detailedAnalysis: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 10,
  },
  bulletsList: {
    gap: 6,
    marginBottom: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
    lineHeight: 17,
  },
  deepDiveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: V4_COLORS.primary,
    paddingVertical: 11,
    borderRadius: 10,
    minHeight: 44,
  },
  deepDiveText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
