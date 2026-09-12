import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ShieldCheck,
  Zap,
  FileCheck,
  CreditCard,
  BadgeCheck,
  Lock,
  CalendarCheck,
  Headphones,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

export const REHVO_BENEFITS = [
  {
    id: 'b1',
    title: '100% Verified Homes',
    sub: 'Every property is physically verified by REHVO for authenticity and safety.',
    icon: ShieldCheck,
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    route: '/(renter)/search',
  },
  {
    id: 'b2',
    title: 'Verified Marketplace',
    sub: 'Rent from verified owners and trusted brokers with transparent pricing.',
    icon: Zap,
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
    route: '/(renter)/search',
  },
  {
    id: 'b3',
    title: 'Digital e-Lease',
    sub: 'Create and sign legally valid rental agreements completely online.',
    icon: FileCheck,
    color: '#0F766E',
    bg: 'rgba(15, 118, 110, 0.12)',
    route: '/(renter)/rental-agreements',
  },
  {
    id: 'b4',
    title: 'Pay Rent Online',
    sub: 'Pay rent securely through UPI, cards or bank transfer and download receipts instantly.',
    icon: CreditCard,
    color: '#059669',
    bg: 'rgba(5, 150, 105, 0.12)',
    route: '/(renter)/pay-rent',
  },
  {
    id: 'b5',
    title: 'Verified Tenant',
    sub: 'Complete KYC once and unlock trusted homes and faster approvals.',
    icon: BadgeCheck,
    color: '#6366F1',
    bg: 'rgba(99, 102, 241, 0.12)',
    route: '/(renter)/kyc',
  },
  {
    id: 'b6',
    title: 'Zero Deposit',
    sub: 'Eligible tenants can move into selected homes without paying a large security deposit.',
    icon: Lock,
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.12)',
    route: '/(renter)/zero-deposit',
  },
  {
    id: 'b7',
    title: 'Instant Visit Booking',
    sub: 'Schedule property visits online with real-time confirmation.',
    icon: CalendarCheck,
    color: '#0284C7',
    bg: 'rgba(2, 132, 199, 0.12)',
    route: '/(renter)/bookings',
  },
  {
    id: 'b8',
    title: '24×7 REHVO Support',
    sub: 'Get chat, phone and email support before, during and after your move.',
    icon: Headphones,
    color: '#EC4899',
    bg: 'rgba(236, 72, 153, 0.12)',
    route: '/(renter)/help',
  },
];

export const V4BenefitCard: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.grid}>
      {REHVO_BENEFITS.map((b) => {
        const IconComp = b.icon;
        return (
          <Pressable
            key={b.id}
            style={styles.card}
            onPress={() => router.push(b.route as any)}
          >
            <View style={[styles.iconCircle, { backgroundColor: b.bg }]}>
              <IconComp size={18} color={b.color} strokeWidth={2.4} />
            </View>
            <Text style={styles.title}>{b.title}</Text>
            <Text style={styles.sub}>{b.sub}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  card: {
    width: '48.5%',
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.card,
    padding: 14,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    ...V4_SHADOWS.soft,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginBottom: 3,
  },
  sub: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    lineHeight: 15,
  },
});

