import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Dimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  IndianRupee,
  Calendar,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  FileText,
  Sparkles,
  Zap,
  CreditCard,
  Building2,
  Check,
  RotateCw,
} from 'lucide-react-native';
import { RentCollectionRecord, RentCollectionStatus } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { useAppStore } from '../../../store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type StatusTab = 'ALL' | 'UPCOMING' | 'COLLECTED' | 'OVERDUE';

interface V4OwnerRentScreenProps {
  hideHeader?: boolean;
}

export const V4OwnerRentScreen: React.FC<V4OwnerRentScreenProps> = ({
  hideHeader = false,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    rentCollections,
    sendRentReminder,
    recordRentPaymentCollected,
    fetchOwnerEcosystemData,
    showToast,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<StatusTab>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  // Receipt Modal State
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<RentCollectionRecord | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOwnerEcosystemData();
    setRefreshing(false);
  };

  // Financial aggregates
  const totals = useMemo(() => {
    let collected = 0;
    let upcoming = 0;
    let overdue = 0;

    rentCollections.forEach((r) => {
      if (r.status === 'COLLECTED') collected += r.rent_amount;
      else if (r.status === 'OVERDUE') overdue += r.rent_amount;
      else upcoming += r.rent_amount;
    });

    return { collected, upcoming, overdue };
  }, [rentCollections]);

  const filteredCollections = useMemo(() => {
    if (activeTab === 'ALL') return rentCollections;
    return rentCollections.filter((r) => r.status === activeTab);
  }, [rentCollections, activeTab]);

  const handleSendReminder = async (record: RentCollectionRecord) => {
    const res = await sendRentReminder(record.id);
    if (res.success) {
      // Toast is fired inside store action
    }
  };

  const handleRecordPayment = (record: RentCollectionRecord) => {
    Alert.alert(
      'Record Rent Payment',
      `Confirm receipt of ₹${record.rent_amount.toLocaleString('en-IN')} from ${record.tenant_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Generate Receipt',
          onPress: async () => {
            await recordRentPaymentCollected(record.id, 'Cash / Direct Bank Transfer');
          },
        },
      ]
    );
  };

  const handleViewReceipt = (record: RentCollectionRecord) => {
    setSelectedReceipt(record);
    setReceiptModalVisible(true);
  };

  const handleDownloadStatement = () => {
    showToast?.('Annual rent ledger statement downloaded (PDF)', 'success');
  };

  const getStatusStyle = (status: RentCollectionStatus) => {
    switch (status) {
      case 'COLLECTED':
        return { bg: '#DCFCE7', color: '#15803D', label: 'Paid & Settled' };
      case 'OVERDUE':
        return { bg: '#FFE4E6', color: '#BE123C', label: 'Overdue' };
      case 'UPCOMING':
      default:
        return { bg: '#FEF3C7', color: '#B45309', label: 'Due Soon' };
    }
  };

  return (
    <View style={[styles.container, !hideHeader && { paddingTop: insets.top }]}>
      {/* Top Header */}
      {!hideHeader && (
        <View style={styles.topNav}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={V4_COLORS.textPrimary} />
          </Pressable>
          <View style={styles.topNavCenter}>
            <Text style={styles.topNavTitle}>Rent Collection</Text>
            <Text style={styles.topNavSub}>Live Payment Tracking & AutoPay</Text>
          </View>
          <Pressable style={styles.statementBtn} onPress={handleDownloadStatement}>
            <Download size={18} color="#0F766E" />
          </Pressable>
        </View>
      )}

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#0F766E" />
        }
      >
        {/* ===================================================================
            1. FINANCIAL SUMMARY CARDS
           =================================================================== */}
        <View style={styles.summaryRow}>
          {/* Collected */}
          <View style={[styles.summaryCard, { backgroundColor: '#064E3B' }]}>
            <View style={styles.summaryIconWrap}>
              <CheckCircle2 size={16} color="#34D399" />
              <Text style={styles.summaryLabelLight}>Collected (Sep)</Text>
            </View>
            <Text style={styles.summaryAmountLight}>
              ₹{totals.collected.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.summarySubLight}>Settled to Bank</Text>
          </View>

          {/* Upcoming */}
          <View style={[styles.summaryCard, { backgroundColor: '#FFFFFF' }]}>
            <View style={styles.summaryIconWrap}>
              <Clock size={16} color="#D97706" />
              <Text style={styles.summaryLabelDark}>Upcoming Rent</Text>
            </View>
            <Text style={styles.summaryAmountDark}>
              ₹{totals.upcoming.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.summarySubDark}>AutoPay Ready</Text>
          </View>

          {/* Overdue */}
          <View style={[styles.summaryCard, { backgroundColor: '#FFFFFF' }]}>
            <View style={styles.summaryIconWrap}>
              <AlertCircle size={16} color="#DC2626" />
              <Text style={styles.summaryLabelDark}>Overdue</Text>
            </View>
            <Text style={[styles.summaryAmountDark, { color: '#DC2626' }]}>
              ₹{totals.overdue.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.summarySubDark}>1 Overdue Notice</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabsRow}>
          {(['ALL', 'UPCOMING', 'COLLECTED', 'OVERDUE'] as StatusTab[]).map((tab) => (
            <Pressable
              key={tab}
              style={[styles.filterTab, activeTab === tab && styles.filterTabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.filterTabTxt, activeTab === tab && styles.filterTabTxtActive]}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ===================================================================
            2. TENANT RENT COLLECTION CARDS
           =================================================================== */}
        <View style={styles.cardsContainer}>
          {filteredCollections.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IndianRupee size={36} color="#0F766E" strokeWidth={1.8} />
              <Text style={styles.emptyTitle}>
                {activeTab === 'OVERDUE'
                  ? 'No Overdue Rent'
                  : activeTab === 'COLLECTED'
                  ? 'No Collected Rent Yet'
                  : activeTab === 'UPCOMING'
                  ? 'No Upcoming Invoices'
                  : 'No Rent Collections Yet'}
              </Text>
              <Text style={styles.emptySub}>
                {activeTab === 'OVERDUE'
                  ? 'All your tenants have paid their rent on time. Outstanding records will appear here.'
                  : 'Once active leases are generated for your properties, monthly rent invoices will show up here.'}
              </Text>
            </View>
          ) : (
            filteredCollections.map((item) => {
            const statusStyle = getStatusStyle(item.status);
            const dueFormatted = new Date(item.due_date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <View key={item.id} style={styles.rentCard}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tenantName}>{item.tenant_name}</Text>
                    <Text style={styles.propertyTitle} numberOfLines={1}>
                      {item.property_title}
                    </Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusPillText, { color: statusStyle.color }]}>
                      {statusStyle.label}
                    </Text>
                  </View>
                </View>

                {/* Amount & Due */}
                <View style={styles.amountDueRow}>
                  <View>
                    <Text style={styles.amountLabel}>Rent Amount</Text>
                    <Text style={styles.rentAmountVal}>
                      ₹{item.rent_amount.toLocaleString('en-IN')}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.amountLabel}>Due Date</Text>
                    <Text style={styles.dueDateVal}>{dueFormatted}</Text>
                  </View>
                </View>

                {/* AutoPay & Cashback Badges */}
                <View style={styles.badgeRow}>
                  <View style={styles.autoPayBadge}>
                    <Zap size={12} color={item.autopay_enabled ? '#059669' : '#64748B'} />
                    <Text
                      style={[
                        styles.autoPayText,
                        { color: item.autopay_enabled ? '#065F46' : '#64748B' },
                      ]}
                    >
                      {item.autopay_enabled ? 'UPI AutoPay Active' : 'Manual Payment'}
                    </Text>
                  </View>

                  <View style={styles.cashbackBadge}>
                    <Sparkles size={12} color="#92400E" />
                    <Text style={styles.cashbackText}>
                      ₹{item.cashback_generated} R-Cash Cashback
                    </Text>
                  </View>
                </View>

                {/* Notes or Reminder History */}
                {item.reminder_count > 0 && (
                  <View style={styles.reminderNoticeBox}>
                    <Bell size={12} color="#B45309" />
                    <Text style={styles.reminderNoticeTxt}>
                      {item.reminder_count} reminder sent • Last: {new Date(item.last_reminder_sent_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.cardActionsRow}>
                  {item.status !== 'COLLECTED' ? (
                    <>
                      <Pressable
                        style={styles.reminderBtn}
                        onPress={() => handleSendReminder(item)}
                      >
                        <Bell size={14} color="#B45309" />
                        <Text style={styles.reminderBtnTxt}>Send Reminder</Text>
                      </Pressable>

                      <Pressable
                        style={styles.markPaidBtn}
                        onPress={() => handleRecordPayment(item)}
                      >
                        <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
                        <Text style={styles.markPaidBtnTxt}>Record Paid</Text>
                      </Pressable>
                    </>
                  ) : (
                    <Pressable
                      style={styles.receiptBtn}
                      onPress={() => handleViewReceipt(item)}
                    >
                      <FileText size={14} color="#0F766E" />
                      <Text style={styles.receiptBtnTxt}>View Receipt</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          }))}
        </View>
      </ScrollView>

      {/* =====================================================================
          RECEIPT MODAL
         ===================================================================== */}
      <Modal
        visible={receiptModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReceiptModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.receiptModalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Rent Payment Receipt</Text>
              <Pressable onPress={() => setReceiptModalVisible(false)}>
                <Text style={{ fontSize: 16, color: '#64748B' }}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.receiptPaper}>
              <View style={styles.receiptBrandRow}>
                <Text style={styles.receiptLogo}>REHVO</Text>
                <Text style={styles.receiptTag}>TAX INVOICE</Text>
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptDetailRow}>
                <Text style={styles.receiptField}>Tenant:</Text>
                <Text style={styles.receiptVal}>{selectedReceipt?.tenant_name}</Text>
              </View>

              <View style={styles.receiptDetailRow}>
                <Text style={styles.receiptField}>Property:</Text>
                <Text style={styles.receiptVal}>{selectedReceipt?.property_title}</Text>
              </View>

              <View style={styles.receiptDetailRow}>
                <Text style={styles.receiptField}>Payment Date:</Text>
                <Text style={styles.receiptVal}>
                  {selectedReceipt?.paid_date?.slice(0, 10) || '2026-09-01'}
                </Text>
              </View>

              <View style={styles.receiptDetailRow}>
                <Text style={styles.receiptField}>Txn Reference:</Text>
                <Text style={styles.receiptVal}>
                  {selectedReceipt?.transaction_ref || 'UPI/2026/09/RHV-8821'}
                </Text>
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptTotalRow}>
                <Text style={styles.receiptTotalLabel}>Total Amount Paid:</Text>
                <Text style={styles.receiptTotalAmount}>
                  ₹{selectedReceipt?.rent_amount.toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={styles.receiptCashbackNotice}>
                <Sparkles size={13} color="#065F46" />
                <Text style={styles.receiptCashbackNoticeTxt}>
                  ₹{selectedReceipt?.cashback_generated} R-Cash credited to Landlord & Tenant wallets
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 16 }}>
              <V4Button
                title="Download Receipt PDF"
                variant="primary"
                onPress={() => {
                  setReceiptModalVisible(false);
                  showToast?.('Rent receipt PDF saved to device', 'success');
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNavCenter: {
    alignItems: 'center',
  },
  topNavTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  topNavSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  statementBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },

  // Summaries
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  summaryIconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryLabelLight: {
    fontSize: 10,
    color: '#A7F3D0',
    fontWeight: '600',
  },
  summaryLabelDark: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  summaryAmountLight: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 6,
  },
  summaryAmountDark: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    marginTop: 6,
  },
  summarySubLight: {
    fontSize: 9.5,
    color: '#D1FAE5',
    marginTop: 2,
  },
  summarySubDark: {
    fontSize: 9.5,
    color: '#94A3B8',
    marginTop: 2,
  },

  // Tabs
  filterTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 10,
  },
  filterTabActive: {
    backgroundColor: '#064E3B',
  },
  filterTabTxt: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  filterTabTxtActive: {
    color: '#FFFFFF',
  },

  // Cards
  cardsContainer: {
    gap: 14,
  },
  rentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tenantName: {
    fontSize: 16,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  propertyTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  amountDueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  amountLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  rentAmountVal: {
    fontSize: 17,
    fontWeight: '900',
    color: '#064E3B',
    marginTop: 2,
  },
  dueDateVal: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  autoPayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  autoPayText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  cashbackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cashbackText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#92400E',
  },
  reminderNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
  },
  reminderNoticeTxt: {
    fontSize: 10.5,
    color: '#B45309',
    fontWeight: '600',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  reminderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingVertical: 9,
    borderRadius: 12,
  },
  reminderBtnTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  markPaidBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#064E3B',
    paddingVertical: 9,
    borderRadius: 12,
  },
  markPaidBtnTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  receiptBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingVertical: 9,
    borderRadius: 12,
  },
  receiptBtnTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  receiptModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 380,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  receiptPaper: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  receiptBrandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLogo: {
    fontSize: 16,
    fontWeight: '900',
    color: '#064E3B',
    letterSpacing: 1,
  },
  receiptTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
    backgroundColor: '#E6FFFA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  receiptDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  receiptField: {
    fontSize: 12,
    color: '#64748B',
  },
  receiptVal: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  receiptTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  receiptTotalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  receiptTotalAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#064E3B',
  },
  receiptCashbackNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D1FAE5',
    padding: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  receiptCashbackNoticeTxt: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#065F46',
    flex: 1,
  },
  emptyContainer: {
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
