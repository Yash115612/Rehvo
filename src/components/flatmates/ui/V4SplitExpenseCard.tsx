import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Receipt, IndianRupee, ShieldCheck, ChevronRight } from 'lucide-react-native';

export interface V4ExpenseItem {
  label: string;
  amount: number;
}

interface V4SplitExpenseCardProps {
  title?: string;
  totalAmount: number;
  myShare: number;
  status?: 'pending' | 'paid';
  dueDate?: string;
  items: V4ExpenseItem[];
  onPay?: () => void;
}

export const V4SplitExpenseCard: React.FC<V4SplitExpenseCardProps> = ({
  title = 'Monthly Flat Share',
  totalAmount,
  myShare,
  status = 'pending',
  dueDate = '5th of this month',
  items,
  onPay,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Receipt size={18} color="#059669" strokeWidth={2.4} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerCategory}>CO-LIVING SPLIT BILL</Text>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View
          style={[
            styles.statusPill,
            status === 'paid' ? styles.statusPaid : styles.statusPending,
          ]}
        >
          <Text
            style={
              status === 'paid' ? styles.statusPaidText : styles.statusPendingText
            }
          >
            {status === 'paid' ? 'Paid' : 'Due Soon'}
          </Text>
        </View>
      </View>

      {/* Main Amount Spotlight */}
      <View style={styles.amountBox}>
        <Text style={styles.amountLabel}>Your Share</Text>
        <Text style={styles.amountValue}>₹{myShare.toLocaleString('en-IN')}</Text>
        <Text style={styles.amountSub}>Total Flat Bill: ₹{totalAmount.toLocaleString('en-IN')} · Due {dueDate}</Text>
      </View>

      {/* Expense Line Items */}
      <View style={styles.itemsList}>
        {items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.itemAmount}>₹{item.amount.toLocaleString('en-IN')}</Text>
          </View>
        ))}
      </View>

      {/* Footer / Pay Action */}
      {status === 'pending' ? (
        <Pressable
          style={styles.payBtn}
          onPress={onPay}
          accessibilityRole="button"
          accessibilityLabel={`Pay ₹${myShare} via Escrow`}
        >
          <ShieldCheck size={16} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.payBtnText}>Pay ₹{myShare.toLocaleString('en-IN')} via Escrow</Text>
        </Pressable>
      ) : (
        <View style={styles.paidBadge}>
          <ShieldCheck size={16} color="#059669" strokeWidth={2.4} />
          <Text style={styles.paidBadgeText}>Settled via REHVO Escrow</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 12,
    maxWidth: 320,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCategory: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.6,
  },
  headerTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusPending: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  statusPendingText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#D97706',
  },
  statusPaid: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  statusPaidText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#059669',
  },
  amountBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    padding: 12,
    alignItems: 'center',
    gap: 2,
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  amountValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#031B2A',
    letterSpacing: -0.4,
  },
  amountSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  itemsList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  itemAmount: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  payBtn: {
    height: 42,
    backgroundColor: '#059669',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  payBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  paidBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
});
