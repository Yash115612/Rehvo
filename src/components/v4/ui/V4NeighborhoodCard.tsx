import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  Compass,
  ShieldCheck,
  Footprints,
  Volume2,
  Trees,
  GlassWater,
  Users,
  Wifi,
  Droplets,
  Briefcase,
  Plane,
  Train,
  Navigation,
  Car,
  Bike,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { LocalityScoreRecord, CommuteEstimate } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

export interface V4NeighborhoodCardProps {
  localityScore: LocalityScoreRecord;
  commuteEstimates?: CommuteEstimate[];
}

export const V4NeighborhoodCard: React.FC<V4NeighborhoodCardProps> = ({
  localityScore,
  commuteEstimates,
}) => {
  const [expanded, setExpanded] = useState(false);

  const radarMetrics = [
    { label: 'Walk Score', value: localityScore.walk_score, icon: Footprints, color: '#0F766E' },
    { label: 'Safety Score', value: localityScore.safety_score, icon: ShieldCheck, color: '#16A34A' },
    { label: 'Quietness', value: localityScore.noise_score, icon: Volume2, color: '#0284C7' },
    { label: 'Greenery', value: localityScore.greenery_score, icon: Trees, color: '#059669' },
    { label: 'Nightlife', value: localityScore.nightlife_score, icon: GlassWater, color: '#7C3AED' },
    { label: 'Family Friendly', value: localityScore.family_friendly_score, icon: Users, color: '#EA580C' },
    { label: 'Fiber Speed', value: localityScore.internet_quality_score, icon: Wifi, color: '#0D9488' },
    { label: 'Water 24x7', value: localityScore.water_supply_score, icon: Droplets, color: '#0284C7' },
  ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            <Compass size={16} color={V4_COLORS.primary} strokeWidth={2.4} />
          </View>
          <View>
            <Text style={styles.localityName}>{localityScore.locality}</Text>
            <Text style={styles.cityText}>{localityScore.city} • Neighborhood Intelligence</Text>
          </View>
        </View>

        <View style={styles.overallScorePill}>
          <Text style={styles.overallScoreValue}>
            {Math.round(
              (localityScore.walk_score + localityScore.safety_score + localityScore.greenery_score) / 3
            )}
          </Text>
          <Text style={styles.overallScoreLabel}>INDEX</Text>
        </View>
      </View>

      {localityScore.description ? (
        <Text style={styles.descriptionText} numberOfLines={2}>
          {localityScore.description}
        </Text>
      ) : null}

      {/* 8-Metric Radar Grid */}
      <View style={styles.radarGrid}>
        {(expanded ? radarMetrics : radarMetrics.slice(0, 4)).map((item, idx) => {
          const IconComp = item.icon;
          return (
            <View key={idx} style={styles.radarItem}>
              <View style={styles.radarItemHeader}>
                <IconComp size={13} color={item.color} strokeWidth={2.2} />
                <Text style={styles.radarLabel}>{item.label}</Text>
                <Text style={[styles.radarValue, { color: item.color }]}>{item.value}/100</Text>
              </View>
              {/* Progress bar */}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${item.value}%`, backgroundColor: item.color },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Commute Matrix (If provided) */}
      {commuteEstimates && commuteEstimates.length > 0 && (
        <View style={styles.commuteSection}>
          <Text style={styles.commuteTitle}>COMMUTE CALCULATOR</Text>
          <View style={styles.commuteGrid}>
            {commuteEstimates.slice(0, 3).map((est, idx) => (
              <View key={idx} style={styles.commuteRow}>
                <View style={styles.commuteHubInfo}>
                  <Text style={styles.commuteHubName} numberOfLines={1}>
                    {est.hubName}
                  </Text>
                  <Text style={styles.commuteDistance}>{est.distanceKm} km away</Text>
                </View>

                <View style={styles.commuteModes}>
                  <View style={styles.modePill}>
                    <Car size={11} color="#475569" />
                    <Text style={styles.modeText}>{est.carMinutes}m</Text>
                  </View>
                  <View style={styles.modePill}>
                    <Bike size={11} color="#475569" />
                    <Text style={styles.modeText}>{est.bikeMinutes}m</Text>
                  </View>
                  {est.metroMinutes && (
                    <View style={[styles.modePill, styles.modePillMetro]}>
                      <Train size={11} color="#0284C7" />
                      <Text style={[styles.modeText, styles.modeTextMetro]}>{est.metroMinutes}m</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Expand / Collapse Button */}
      <Pressable
        style={styles.expandBtn}
        onPress={() => setExpanded(!expanded)}
        hitSlop={8}
      >
        <Text style={styles.expandBtnText}>
          {expanded ? 'Show Less' : 'View All 8 Neighborhood Scores'}
        </Text>
        {expanded ? (
          <ChevronUp size={14} color={V4_COLORS.primary} strokeWidth={2.4} />
        ) : (
          <ChevronDown size={14} color={V4_COLORS.primary} strokeWidth={2.4} />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginVertical: 12,
    ...V4_SHADOWS.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  localityName: {
    fontSize: 15,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  cityText: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
  },
  overallScorePill: {
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  overallScoreValue: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.primary,
  },
  overallScoreLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    lineHeight: 17,
    marginBottom: 12,
  },
  radarGrid: {
    gap: 10,
  },
  radarItem: {
    gap: 4,
  },
  radarItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  radarLabel: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  radarValue: {
    fontSize: 11.5,
    fontWeight: '900',
  },
  barTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  commuteSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  commuteTitle: {
    fontSize: 10.5,
    fontWeight: '900',
    color: V4_COLORS.textMuted,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  commuteGrid: {
    gap: 8,
  },
  commuteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  commuteHubInfo: {
    flex: 1,
  },
  commuteHubName: {
    fontSize: 12,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  commuteDistance: {
    fontSize: 10,
    color: '#64748B',
  },
  commuteModes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  modePillMetro: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  modeTextMetro: {
    color: '#0284C7',
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 12,
    paddingTop: 8,
  },
  expandBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
});
