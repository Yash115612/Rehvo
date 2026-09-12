import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Building2, MapPin, Users, Star, ShieldCheck } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

export const V4StatsCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.glassCard}>
        <View style={styles.headerRow}>
          <ShieldCheck size={16} color={V4_COLORS.primary} strokeWidth={2.4} />
          <Text style={styles.heading}>REHVO LIVE STATS</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>12,400+</Text>
            <Text style={styles.statLabel}>Active Homes</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statBox}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Metro Cities</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statBox}>
            <Text style={styles.statValue}>500+</Text>
            <Text style={styles.statLabel}>Top Builders</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#F59E0B' }]}>4.92 ★</Text>
            <Text style={styles.statLabel}>App Rating</Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.liveDot} />
          <Text style={styles.footerText}>100% Direct Owners & DigiLocker KYC Verified</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  glassCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.card,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#D7EBEA',
    ...V4_SHADOWS.card,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heading: {
    fontSize: 10.5,
    fontWeight: '900',
    color: V4_COLORS.primary,
    letterSpacing: 0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  footerText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
});
