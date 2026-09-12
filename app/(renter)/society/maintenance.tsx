import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Wallet,
  Download,
  Calendar,
  Building,
  ShieldCheck,
  ChevronRight,
  Receipt,
  X,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../src/theme/v4Theme';
import { triggerHapticFeedback } from '../../../src/utils/haptics';
import { MaintenancePaymentRecord } from '../../../src/types';

export default function SocietyMaintenanceRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    properties,
    leaseAgreements,
    maintenancePayments,
    fetchMaintenancePayments,
    payMaintenanceBill,
    wallet,
    showToast,
  } = useAppStore();

  const walletBalance = wallet?.balance ?? user?.walletBalance ?? 0;

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'wallet' | 'card'>('upi');
  const [isPaying, setIsPaying] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<MaintenancePaymentRecord | null>(null);

  const activeLease = useMemo(
    () => leaseAgreements?.find((l) => l.status === 'active') || leaseAgreements?.[0],
    [leaseAgreements]
  );
  const activeProperty = useMemo(
    () => properties?.find((p) => p.id === activeLease?.property_id) || properties?.[0],
    [properties, activeLease]
  );

  const societyName = activeProperty?.society_name || activeProperty?.title || 'Prestige Green Gables';
  const unitNumber = activeProperty?.unit_number || 'Tower 4 - Flat 1204';

  useEffect(() => {
    fetchMaintenancePayments();
  }, []);

  const pendingBill = useMemo(
    () => maintenancePayments.find((p) => p.payment_status === 'pending'),
    [maintenancePayments]
  );

  const dueAmount = pendingBill?.amount || 4850;
  const billMonth = pendingBill?.bill_month || 'September 2026';
  const dueDate = pendingBill?.due_date || '15 Sep 2026';

  const breakdownItems = [
    { label: 'Common Area Maintenance (CAM)', amount: 3200 },
    { label: 'Water & Sewage Supply Charges', amount: 650 },
    { label: 'Sinking Fund Contribution', amount: 400 },
    { label: 'DG Power Backup & Diesel Fuel', amount: 350 },
    { label: 'Dedicated Stilt Parking Fee', amount: 250 },
  ];

  const handlePayBill = async () => {
    setIsPaying(true);
    triggerHapticFeedback('impactMedium');

    const res = await payMaintenanceBill({
      society_name: societyName,
      unit_number: unitNumber,
      bill_month: billMonth,
      amount: dueAmount,
      due_date: dueDate,
      payment_method: paymentMethod,
    });

    setIsPaying(false);

    if (res.success && res.data) {
      triggerHapticFeedback('notificationSuccess');
      showToast?.(`Maintenance for ${billMonth} paid successfully! Earned 1.5% cashback.`, 'success');
      setSelectedReceipt(res.data);
    } else {
      triggerHapticFeedback('notificationError');
      showToast?.(res.error || 'Payment failed. Please retry.', 'error');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            triggerHapticFeedback('selection');
            router.back();
          }}
          hitSlop={12}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Society Maintenance</Text>
          <Text style={styles.headerSubtitle}>{societyName} • {unitNumber}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Bill Due Card */}
        <View style={styles.dueCard}>
          <View style={styles.dueCardTop}>
            <View>
              <Text style={styles.dueLabel}>
                {pendingBill ? 'CURRENT MAINTENANCE DUE' : 'NO DUES PENDING'}
              </Text>
              <Text style={styles.dueAmount}>₹{dueAmount.toLocaleString('en-IN')}</Text>
            </View>
            <View style={[styles.statusBadge, pendingBill ? styles.badgePending : styles.badgePaid]}>
              <Text style={[styles.statusBadgeText, pendingBill ? styles.badgePendingText : styles.badgePaidText]}>
                {pendingBill ? 'PAYMENT DUE' : 'PAID IN FULL'}
              </Text>
            </View>
          </View>

          <View style={styles.dueMetaRow}>
            <View style={styles.dueMetaItem}>
              <Calendar size={14} color="#64748B" />
              <Text style={styles.dueMetaText}>Billing Month: <Text style={styles.dueMetaBold}>{billMonth}</Text></Text>
            </View>
            <View style={styles.dueMetaItem}>
              <AlertTriangle size={14} color="#D97706" />
              <Text style={styles.dueMetaText}>Due Date: <Text style={styles.dueMetaBold}>{dueDate}</Text></Text>
            </View>
          </View>

          {/* Itemized Breakdown Accordion */}
          <View style={styles.breakdownBox}>
            <Text style={styles.breakdownHeader}>ITEMIZED BREAKDOWN</Text>
            {breakdownItems.map((item) => (
              <View key={item.label} style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>{item.label}</Text>
                <Text style={styles.breakdownVal}>₹{item.amount.toLocaleString('en-IN')}</Text>
              </View>
            ))}
            <View style={styles.breakdownTotalRow}>
              <Text style={styles.breakdownTotalLabel}>Total Monthly Charges</Text>
              <Text style={styles.breakdownTotalVal}>₹{dueAmount.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          {/* Payment Method Selector (if pending) */}
          {pendingBill && (
            <View style={{ marginTop: 16 }}>
              <Text style={styles.inputLabel}>SELECT PAYMENT METHOD</Text>
              <View style={styles.methodGrid}>
                {[
                  { id: 'upi', label: 'Instant UPI', sub: 'GPay / PhonePe / Paytm', icon: CreditCard },
                  { id: 'wallet', label: 'R-Cash Wallet', sub: `Balance ₹${walletBalance}`, icon: Wallet },
                  { id: 'card', label: 'Card / Netbanking', sub: 'Debit or Credit card', icon: CreditCard },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <Pressable
                      key={m.id}
                      style={[styles.methodCard, paymentMethod === m.id && styles.methodCardActive]}
                      onPress={() => {
                        triggerHapticFeedback('selection');
                        setPaymentMethod(m.id as any);
                      }}
                    >
                      <Icon size={18} color={paymentMethod === m.id ? '#0F766E' : '#64748B'} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.methodTitle, paymentMethod === m.id && styles.methodTitleActive]}>
                          {m.label}
                        </Text>
                        <Text style={styles.methodSub}>{m.sub}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              {/* Pay Now Button */}
              <Pressable
                style={[styles.payBtn, isPaying && { opacity: 0.6 }]}
                disabled={isPaying}
                onPress={handlePayBill}
              >
                {isPaying ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.payBtnText}>
                    Pay ₹{dueAmount.toLocaleString('en-IN')} & Earn 1.5% Cashback
                  </Text>
                )}
              </Pressable>
            </View>
          )}
        </View>

        {/* 12-Month Payment Ledger */}
        <Text style={styles.sectionTitle}>12-MONTH PAYMENT LEDGER</Text>
        <View style={{ gap: 10 }}>
          {maintenancePayments.length === 0 ? (
            <View style={styles.emptyCard}>
              <FileText size={36} color="#CBD5E1" />
              <Text style={styles.emptyText}>No historical receipts found</Text>
            </View>
          ) : (
            maintenancePayments.map((record) => (
              <Pressable
                key={record.id}
                style={styles.ledgerCard}
                onPress={() => {
                  triggerHapticFeedback('selection');
                  setSelectedReceipt(record);
                }}
              >
                <View style={styles.ledgerIconBox}>
                  <Receipt size={20} color="#0F766E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ledgerMonth}>{record.bill_month}</Text>
                  <Text style={styles.ledgerSub}>
                    {record.payment_status === 'paid' ? `Paid on ${new Date(record.created_at).toLocaleDateString()}` : 'Payment Pending'}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.ledgerAmount}>₹{record.amount.toLocaleString('en-IN')}</Text>
                  <View style={[styles.ledgerBadge, record.payment_status === 'paid' ? styles.ledgerBadgePaid : styles.ledgerBadgeDue]}>
                    <Text style={[styles.ledgerBadgeText, record.payment_status === 'paid' ? styles.ledgerBadgeTextPaid : styles.ledgerBadgeTextDue]}>
                      {record.payment_status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={18} color="#94A3B8" />
              </Pressable>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Receipt Modal */}
      <Modal visible={!!selectedReceipt} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Receipt size={22} color="#0F766E" />
                <Text style={styles.modalTitle}>Maintenance Receipt</Text>
              </View>
              <Pressable
                onPress={() => setSelectedReceipt(null)}
                style={styles.modalCloseBtn}
              >
                <X size={20} color="#64748B" />
              </Pressable>
            </View>

            {selectedReceipt && (
              <View style={styles.receiptBody}>
                <View style={styles.receiptTop}>
                  <Text style={styles.receiptSociety}>{selectedReceipt.society_name || societyName}</Text>
                  <Text style={styles.receiptUnit}>Unit: {selectedReceipt.unit_number || unitNumber}</Text>
                  <Text style={styles.receiptMonth}>Bill Month: {selectedReceipt.bill_month}</Text>
                  <Text style={styles.receiptTotal}>₹{selectedReceipt.amount.toLocaleString('en-IN')}</Text>
                  <View style={styles.verifiedStamp}>
                    <CheckCircle2 size={14} color="#15803D" />
                    <Text style={styles.verifiedStampText}>OFFICIAL RECEIPT VERIFIED</Text>
                  </View>
                </View>

                <View style={styles.receiptDetails}>
                  <View style={styles.receiptDetailRow}>
                    <Text style={styles.receiptKey}>Transaction Ref</Text>
                    <Text style={styles.receiptVal}>{selectedReceipt.transaction_ref || 'TXN-SOCIETY-782910'}</Text>
                  </View>
                  <View style={styles.receiptDetailRow}>
                    <Text style={styles.receiptKey}>Payment Method</Text>
                    <Text style={styles.receiptVal}>{(selectedReceipt.payment_method || 'UPI').toUpperCase()}</Text>
                  </View>
                  <View style={styles.receiptDetailRow}>
                    <Text style={styles.receiptKey}>Payment Date</Text>
                    <Text style={styles.receiptVal}>{new Date(selectedReceipt.created_at).toLocaleDateString()}</Text>
                  </View>
                </View>

                <Pressable
                  style={styles.downloadBtn}
                  onPress={() => {
                    triggerHapticFeedback('notificationSuccess');
                    showToast?.('Receipt downloaded to device storage', 'success');
                    setSelectedReceipt(null);
                  }}
                >
                  <Download size={18} color="#FFFFFF" />
                  <Text style={styles.downloadBtnText}>Download PDF Receipt</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  dueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  dueCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  dueLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  dueAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  badgePending: {
    backgroundColor: '#FEF3C7',
  },
  badgePendingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  badgePaid: {
    backgroundColor: '#DCFCE7',
  },
  badgePaidText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  dueMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dueMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dueMetaText: {
    fontSize: 12,
    color: '#64748B',
  },
  dueMetaBold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  breakdownBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    gap: 8,
  },
  breakdownHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  breakdownVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  breakdownTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    marginTop: 4,
  },
  breakdownTotalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  breakdownTotalVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F766E',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  methodGrid: {
    gap: 8,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
    minHeight: 46,
  },
  methodCardActive: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  methodTitleActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  methodSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  payBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    ...V4_SHADOWS.card,
  },
  payBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginTop: 8,
  },
  ledgerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  ledgerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ledgerMonth: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  ledgerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  ledgerAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  ledgerBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  ledgerBadgePaid: {
    backgroundColor: '#DCFCE7',
  },
  ledgerBadgeDue: {
    backgroundColor: '#FEF3C7',
  },
  ledgerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  ledgerBadgeTextPaid: {
    color: '#15803D',
  },
  ledgerBadgeTextDue: {
    color: '#B45309',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  receiptBody: {
    marginTop: 16,
    gap: 16,
  },
  receiptTop: {
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  receiptSociety: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  receiptUnit: {
    fontSize: 12,
    color: '#0F766E',
    fontWeight: '600',
    marginTop: 2,
  },
  receiptMonth: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  receiptTotal: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0F172A',
    marginVertical: 8,
  },
  verifiedStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedStampText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  receiptDetails: {
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  receiptDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptKey: {
    fontSize: 12,
    color: '#64748B',
  },
  receiptVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 14,
    height: 48,
    gap: 8,
  },
  downloadBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
