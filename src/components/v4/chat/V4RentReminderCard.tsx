import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IndianRupee, Clock, ArrowRight, Zap, CheckCircle2 } from 'lucide-react-native';
import { RentReminderMeta } from '../../../types';
import { V4_SHADOWS } from '../../../theme/v4Theme';

interface V4RentReminderCardProps {
  reminder: RentReminderMeta;
  isMe?: boolean;
  onPayNow?: () => void;
}

export const V4RentReminderCard: React.FC<V4RentReminderCardProps> = ({
  reminder,
  isMe = false,
  onPayNow,
}) => {
  const isPaid = reminder.status === 'paid';
  const amountStr = reminder.amount
    ? `₹${reminder.amount.toLocaleString('en-IN')}`
    : '₹35,000';

  return (
    <View style={[styles.card, isMe ? styles.cardMe : styles.cardOther]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <IndianRupee size={16} color="#B45309" strokeWidth={2.4} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.title, isMe && styles.titleMe]}>Rent Collection Notice</Text>
          <Text style={[styles.subText, isMe && styles.subTextMe]}>
            {reminder.month_year || 'Monthly Rental Dues'}
          </Text>
        </View>

        <View style={[styles.statusPill, isPaid && styles.statusPillPaid]}>
          <Text style={[styles.statusText, isPaid && styles.statusTextPaid]}>
            {isPaid ? 'PAID' : 'DUE'}
          </Text>
        </View>
      </View>

      {/* Amount Display */}
      <View style={[styles.amountBox, isMe && styles.amountBoxMe]}>
        <View>
          <Text style={[styles.amountLabel, isMe && styles.amountLabelMe]}>Total Payable</Text>
          <Text style={[styles.amountVal, isMe && styles.amountValMe]}>{amountStr}</Text>
        </View>

        <View style={styles.dueDateCol}>
          <View style={styles.dueRow}>
            <Clock size={11} color={isMe ? '#99F6E4' : '#64748B'} />
            <Text style={[styles.dueText, isMe && styles.dueTextMe]}>
              Due: {reminder.due_date || '5th of this month'}
            </Text>
          </View>
          {reminder.upi_autopay && (
            <View style={styles.autoPayRow}>
              <Zap size={10} color="#16A34A" />
              <Text style={styles.autoPayText}>UPI AutoPay</Text>
            </View>
          )}
        </View>
      </View>

      {/* CTA Button */}
      {!isPaid ? (
        <Pressable style={styles.payBtn} onPress={onPayNow}>
          <Text style={styles.payBtnText}>Pay Rent via UPI / Card</Text>
          <ArrowRight size={13} color="#FFFFFF" strokeWidth={2.6} />
        </Pressable>
      ) : (
        <View style={styles.paidNotice}>
          <CheckCircle2 size={13} color="#15803D" strokeWidth={2.6} />
          <Text style={styles.paidNoticeText}>Settled directly to owner's bank account</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 13,
    width: '100%',
    maxWidth: 290,
    marginVertical: 4,
    borderWidth: 1,
    ...V4_SHADOWS.card,
  },
  cardMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  cardOther: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  titleMe: {
    color: '#FFFFFF',
  },
  subText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  subTextMe: {
    color: '#CCFBF1',
  },
  statusPill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillPaid: {
    backgroundColor: '#DCFCE7',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B91C1C',
  },
  statusTextPaid: {
    color: '#15803D',
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  amountBoxMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  amountLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  amountLabelMe: {
    color: '#CCFBF1',
  },
  amountVal: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F766E',
    marginTop: 1,
  },
  amountValMe: {
    color: '#FFFFFF',
  },
  dueDateCol: {
    alignItems: 'flex-end',
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  dueTextMe: {
    color: '#CCFBF1',
  },
  autoPayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  autoPayText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#16A34A',
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0F766E',
    borderRadius: 10,
    paddingVertical: 9,
    marginTop: 10,
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  paidNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    paddingVertical: 7,
    marginTop: 10,
  },
  paidNoticeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803D',
  },
});
