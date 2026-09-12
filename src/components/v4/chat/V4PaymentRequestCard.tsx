import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IndianRupee, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react-native';
import { PaymentRequestMeta } from '../../../types';
import { triggerHaptic } from '../../../utils/haptics';

interface V4PaymentRequestCardProps {
  payment: PaymentRequestMeta;
  isMe: boolean;
  onPayPress?: () => void;
}

const V4PaymentRequestCardComponent: React.FC<V4PaymentRequestCardProps> = ({
  payment,
  isMe,
  onPayPress,
}) => {
  const isPaid = payment.status === 'completed';

  return (
    <View style={[styles.card, isMe ? styles.cardMe : styles.cardOther]}>
      {/* Header Badge */}
      <View style={styles.topRow}>
        <View style={styles.tagWrap}>
          <ShieldCheck size={13} color="#0F766E" />
          <Text style={styles.tagText}>SECURE ESCROW PAYMENT</Text>
        </View>
        <View style={[styles.statusBadge, isPaid ? styles.statusPaid : styles.statusPending]}>
          <Text style={[styles.statusText, isPaid ? styles.statusTextPaid : styles.statusTextPending]}>
            {isPaid ? 'PAID' : 'PENDING'}
          </Text>
        </View>
      </View>

      {/* Amount & Title */}
      <View style={styles.amountSection}>
        <Text style={[styles.title, isMe ? styles.textLight : styles.textDark]}>
          {payment.title || 'Security Token / Rent'}
        </Text>
        <View style={styles.amountRow}>
          <Text style={[styles.currency, isMe ? styles.textLight : styles.emeraldText]}>₹</Text>
          <Text style={[styles.amount, isMe ? styles.textLight : styles.textDark]}>
            {payment.amount?.toLocaleString('en-IN') || '0'}
          </Text>
        </View>
        {payment.dueDate ? (
          <Text style={[styles.dueText, isMe ? styles.subtextLight : styles.subtextDark]}>
            Due by {payment.dueDate}
          </Text>
        ) : null}
      </View>

      {/* Action CTA */}
      {!isMe && !isPaid ? (
        <Pressable
          style={styles.payButton}
          onPress={() => {
            triggerHaptic();
            onPayPress?.();
          }}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Pay ₹${payment.amount} now`}
        >
          <Text style={styles.payButtonText}>Pay with UPI / Card</Text>
          <ArrowRight size={15} color="#FFFFFF" />
        </Pressable>
      ) : isPaid ? (
        <View style={styles.paidNotice}>
          <CheckCircle2 size={16} color="#16A34A" />
          <Text style={styles.paidNoticeText}>Transferred to Landlord Escrow</Text>
        </View>
      ) : (
        <View style={styles.sentNotice}>
          <Text style={styles.sentNoticeText}>Payment request sent to tenant</Text>
        </View>
      )}
    </View>
  );
};

export const V4PaymentRequestCard = memo(V4PaymentRequestCardComponent);

const styles = StyleSheet.create({
  card: {
    width: 250,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
  },
  cardMe: {
    backgroundColor: '#0F766E',
    borderColor: '#0D6860',
  },
  cardOther: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CCFBF1',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tagWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPaid: {
    backgroundColor: '#DCFCE7',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
  },
  statusTextPending: {
    color: '#D97706',
  },
  statusTextPaid: {
    color: '#16A34A',
  },
  amountSection: {
    marginVertical: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  currency: {
    fontSize: 18,
    fontWeight: '900',
    marginRight: 2,
  },
  amount: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  dueText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  textLight: {
    color: '#FFFFFF',
  },
  textDark: {
    color: '#031B2A',
  },
  emeraldText: {
    color: '#0F766E',
  },
  subtextLight: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  subtextDark: {
    color: '#64748B',
  },
  payButton: {
    backgroundColor: '#0F766E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  paidNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  paidNoticeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  sentNotice: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  sentNoticeText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
  },
});
