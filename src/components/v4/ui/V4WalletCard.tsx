import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Wallet, Users, Gift, ArrowUpRight, Sparkles, ChevronRight } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

interface V4WalletCardProps {
  cashBalance?: number;
  creditsBalance?: number;
  activeRewardsCount?: number;
  onPayRent?: () => void;
  onViewWallet?: () => void;
  onViewRCash?: () => void;
  onViewRewards?: () => void;
  onViewShareEarn?: () => void;
}

export const V4WalletCard: React.FC<V4WalletCardProps> = ({
  cashBalance = 0,
  creditsBalance = 400,
  activeRewardsCount = 1,
  onPayRent,
  onViewWallet,
  onViewRCash,
  onViewRewards,
  onViewShareEarn,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Top Header */}
        <View style={styles.topRow}>
          <View style={styles.titleRow}>
            <Wallet size={16} color={V4_COLORS.primary} strokeWidth={2.4} />
            <Text style={styles.title}>REHVO Smart Wallet</Text>
          </View>

          <Pressable style={styles.viewAllBtn} onPress={onViewRCash || onViewWallet}>
            <Text style={styles.viewAllText}>Details</Text>
            <ChevronRight size={12} color={V4_COLORS.primary} strokeWidth={2.6} />
          </Pressable>
        </View>

        {/* 3 Metrics Row */}
        <View style={styles.metricsRow}>
          {/* Box 1: R-Cash */}
          <Pressable style={styles.metricBox} onPress={onViewRCash || onViewWallet}>
            <Text style={styles.metricLabel}>R-Cash (UPI)</Text>
            <Text style={styles.metricValue}>₹{cashBalance.toLocaleString('en-IN')}</Text>
            <Text style={styles.metricSub}>1% Rent Cashback</Text>
          </Pressable>

          <View style={styles.metricDivider} />

          {/* Box 2: Rewards */}
          <Pressable style={styles.metricBox} onPress={onViewRewards || onViewWallet}>
            <Text style={styles.metricLabel}>Active Rewards</Text>
            <Text style={[styles.metricValue, { color: '#8B5CF6' }]}>3 Deals</Text>
            <Text style={styles.metricSub}>Flat ₹1.5k Off</Text>
          </Pressable>

          <View style={styles.metricDivider} />

          {/* Box 3: Share & Earn */}
          <Pressable
            style={[styles.metricBox, styles.metricBoxHighlight]}
            onPress={onViewShareEarn || onViewWallet}
          >
            <View style={styles.creditsTag}>
              <Users size={10} color="#B45309" />
              <Text style={styles.creditsTagText}>SHARE & EARN</Text>
            </View>
            <Text style={[styles.metricValue, { color: '#B45309' }]}>₹250</Text>
            <Text style={styles.metricSub}>Per Friend</Text>
          </Pressable>
        </View>

        {/* Bottom CTA Bar */}
        {onPayRent && (
          <Pressable style={styles.payRentBar} onPress={onPayRent}>
            <View style={styles.payRentLeft}>
              <Sparkles size={13} color="#FFFFFF" />
              <Text style={styles.payRentTitle}>Pay Rent & Earn 1% Instant Cashback</Text>
            </View>
            <ArrowUpRight size={14} color="#FFFFFF" strokeWidth={2.4} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.card,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#D7EBEA',
    ...V4_SHADOWS.card,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 14.5,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(15, 118, 110, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  metricBoxHighlight: {
    backgroundColor: '#FFFBEB',
    paddingVertical: 6,
    borderRadius: 12,
  },
  creditsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  creditsTagText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 0.4,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  metricSub: {
    fontSize: 9.5,
    fontWeight: '600',
    color: V4_COLORS.textMuted,
  },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E2E8F0',
  },
  payRentBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
    ...V4_SHADOWS.soft,
  },
  payRentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  payRentTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
