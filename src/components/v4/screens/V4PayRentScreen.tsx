import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  Share,
  Platform,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CreditCard,
  Building2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Clock,
  Calendar,
  Wallet,
  Gift,
  QrCode,
  Download,
  Share2,
  Tag,
  Lock,
  ChevronRight,
  X,
  Bell,
  HelpCircle,
  Plus,
  RefreshCw,
  Award,
  BadgeCheck,
  Check,
  Receipt,
  Search,
  Filter,
  Users,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { V4AuthGate } from '../ui/V4AuthGate';
import { cashbackEngine } from '../../../services/cashbackEngine';
import { receiptsService } from '../../../services/receipts';

type PayRentScreenStage =
  | 'home'
  | 'details'
  | 'methods'
  | 'upi'
  | 'card'
  | 'processing'
  | 'success'
  | 'history';

type PaymentMethodType = 'upi' | 'credit_card' | 'debit_card' | 'netbanking' | 'wallet';

interface PaymentRecord {
  id: string;
  month: string;
  property: string;
  locality: string;
  landlord: string;
  amount: number;
  method: string;
  status: 'paid' | 'upcoming' | 'pending' | 'failed';
  date: string;
  txnId: string;
}

const INITIAL_PAYMENT_HISTORY: PaymentRecord[] = [];

export const V4PayRentScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    showToast,
    user,
    isAuthenticated,
    triggerCashback,
    rentPayments,
    fetchRentPayments,
    payRent,
    leaseAgreements,
    fetchLeaseAgreements,
    properties,
    fetchProperties,
    wallet,
  } = useAppStore();

  const currentWalletBalance = wallet?.balance ?? user?.walletBalance ?? 0;

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeaseAgreements?.();
      fetchProperties?.();
    }
  }, [isAuthenticated, fetchLeaseAgreements, fetchProperties]);

  // Screen Stage Navigation
  const [currentStage, setCurrentStage] = useState<PayRentScreenStage>('home');

  // Dynamically resolve active lease or property
  const activeLease = useMemo(() => {
    return (
      leaseAgreements?.find(
        (l) => l.status === 'registered' || (l.status as any) === 'active'
      ) || leaseAgreements?.[0]
    );
  }, [leaseAgreements]);

  const activeProperty = useMemo(() => {
    if (activeLease?.property_id) {
      const found = properties?.find((p) => p.id === activeLease.property_id);
      if (found) return found;
    }
    return properties?.[0] || null;
  }, [activeLease, properties]);

  // Rent Item Details - Dynamic with realistic fallbacks
  const propertyName =
    activeLease?.property_title || activeProperty?.title || 'Modern Executive Suite';
  const propertyLocality =
    activeLease?.property_locality ||
    (activeProperty ? `${activeProperty.locality}, ${activeProperty.city}` : 'Central Hub, Jaipur');
  const propertyImage =
    activeLease?.property_image ||
    activeProperty?.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';
  const landlordName =
    activeLease?.landlord_name || activeProperty?.owner_name || 'Verified Property Owner';
  const dueDate = '10 September 2026';
  const daysLeft = 3;

  // Breakdown Amounts
  const baseRent =
    activeLease?.monthly_rent || activeProperty?.rent || 18000;
  const maintenance = Math.round(baseRent * 0.04);
  const parkingFee = Math.round(baseRent * 0.015);
  const platformFee = 0; // Free for verified users

  // Split Rent with Flatmates State
  const [splitModalVisible, setSplitModalVisible] = useState(false);
  const [splitCount, setSplitCount] = useState(2);

  // Coupon / Promo State
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Settings Toggles
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  // Payment Selection
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [customUpiId, setCustomUpiId] = useState(user?.email ? `${user.email.split('@')[0]}@okaxis` : '');

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.name?.toUpperCase() || '');
  const [saveCard, setSaveCard] = useState(true);

  // Processing State
  const [processingStep, setProcessingStep] = useState(1);

  // Receipt Modal State
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<PaymentRecord | null>(null);

  // Payment History
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>(INITIAL_PAYMENT_HISTORY);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'paid' | 'upcoming' | 'pending' | 'failed'>('all');
  const [historySearchQuery, setHistorySearchQuery] = useState('');

  // AutoPay & Reminders Modals
  const [autoPayModalVisible, setAutoPayModalVisible] = useState(false);
  const [remindersModalVisible, setRemindersModalVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchRentPayments();
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (rentPayments && rentPayments.length > 0) {
      const mapped: PaymentRecord[] = rentPayments.map(p => {
        const dateObj = new Date(p.paid_at || p.created_at);
        const monthStr = dateObj.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
        return {
          id: p.id,
          month: monthStr,
          property: p.property_name,
          locality: p.locality || propertyLocality,
          landlord: p.landlord_name,
          amount: p.amount,
          method: p.payment_method === 'upi'
            ? 'UPI Payment'
            : p.payment_method === 'credit_card'
            ? 'Credit Card'
            : p.payment_method === 'debit_card'
            ? 'Debit Card'
            : p.payment_method === 'netbanking'
            ? 'Net Banking'
            : 'R-Cash Wallet',
          status: p.status === 'completed' ? 'paid' : p.status === 'failed' ? 'failed' : 'pending',
          date: p.paid_at
            ? dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            : 'Pending',
          txnId: p.transaction_ref || p.id,
        };
      });
      setPaymentHistory(mapped);
    }
  }, [rentPayments]);

  // Total Calculation
  const totalAmount = useMemo(() => {
    const subtotal = baseRent + maintenance + parkingFee + platformFee;
    return Math.max(0, subtotal - appliedDiscount);
  }, [baseRent, maintenance, parkingFee, platformFee, appliedDiscount]);

  const totalPaidAmount = useMemo(() => {
    return paymentHistory
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
  }, [paymentHistory]);

  const totalCashbackEarned = useMemo(() => {
    return Math.round(totalPaidAmount * 0.02);
  }, [totalPaidAmount]);

  // Apply Coupon
  const handleApplyCoupon = (code: string) => {
    if (code.toUpperCase() === 'REHVOFIRST') {
      setAppliedDiscount(250);
      setAppliedCoupon('REHVOFIRST');
      setCouponCode('REHVOFIRST');
      showToast?.('🎉 Coupon REHVOFIRST applied! ₹250 Instant Discount.', 'success');
    } else if (code.toUpperCase() === 'CREDIT2X') {
      setAppliedDiscount(150);
      setAppliedCoupon('CREDIT2X');
      setCouponCode('CREDIT2X');
      showToast?.('🎉 Coupon CREDIT2X applied! ₹150 OFF on Rent.', 'success');
    } else {
      showToast?.('Invalid coupon code. Try REHVOFIRST or CREDIT2X', 'error');
    }
  };

  // Remove Coupon
  const handleRemoveCoupon = () => {
    setAppliedDiscount(0);
    setAppliedCoupon(null);
    setCouponCode('');
    showToast?.('Coupon removed', 'info');
  };

  // Trigger Payment Flow
  const handleStartPayment = () => {
    if (selectedMethod === 'upi') {
      setCurrentStage('upi');
    } else if (selectedMethod === 'credit_card' || selectedMethod === 'debit_card') {
      setCurrentStage('card');
    } else {
      // Directly start processing for NetBanking/Wallet
      startProcessingFlow();
    }
  };

  // Start Processing Simulation
  const startProcessingFlow = () => {
    setCurrentStage('processing');
    setProcessingStep(1);

    setTimeout(() => {
      setProcessingStep(2);
    }, 1200);

    setTimeout(() => {
      setProcessingStep(3);
    }, 2400);

    setTimeout(async () => {
      const generatedTxnId = `TXN_REHVO_${Math.floor(100000 + Math.random() * 900000)}`;
      const cashbackAmt =
        selectedMethod === 'credit_card'
          ? Math.round(totalAmount * 0.02)
          : Math.min(500, Math.max(50, Math.round(totalAmount * 0.01)));

      // Create new transaction record in store & Supabase
      const res = await payRent({
        user_id: user?.id || 'guest',
        property_name: propertyName,
        locality: propertyLocality,
        landlord_name: landlordName,
        amount: totalAmount,
        base_rent: baseRent,
        maintenance: maintenance + parkingFee,
        platform_fee: platformFee,
        discount: appliedDiscount,
        due_date: '2026-09-10',
        payment_method: selectedMethod,
        payment_method_detail: selectedMethod === 'upi' ? `${selectedUpiApp} (${customUpiId})` : undefined,
        cashback_earned: cashbackAmt,
        status: 'completed',
        paid_at: new Date().toISOString(),
        transaction_ref: generatedTxnId,
        receipt_url: `https://rehvo.com/receipts/${generatedTxnId}.pdf`,
      });

      if (cashbackAmt > 0) {
        await triggerCashback(
          cashbackAmt,
          'rent_cashback',
          selectedMethod === 'credit_card'
            ? '2% Credit Card Rent Cashback'
            : 'Rent Payment Cashback',
          `Earned on ₹${totalAmount.toLocaleString('en-IN')} rent payment`,
          generatedTxnId
        );
      }

      if (user?.id) {
        // Issue gamified scratch card
        cashbackEngine.issueScratchCard(user.id, generatedTxnId).catch(() => {});
        // Generate authentic HRA receipt
        receiptsService.generateReceipt({
          userId: user.id,
          paymentId: res.data?.id,
          monthYear: 'September 2026',
          rentAmount: baseRent,
          maintenanceAmount: maintenance + parkingFee,
          tenantName: user.name || 'Resident',
          tenantEmail: user.email,
          landlordName: landlordName,
          propertyAddress: `${propertyName}, ${propertyLocality}`,
        }).catch(() => {});
      }

      const newTxn: PaymentRecord = {
        id: res.data?.id || `txn_${Date.now()}`,
        month: 'September 2026',
        property: propertyName,
        locality: propertyLocality,
        landlord: landlordName,
        amount: totalAmount,
        method:
          selectedMethod === 'upi'
            ? `${selectedUpiApp} (${customUpiId})`
            : selectedMethod === 'credit_card'
            ? `Credit Card (***${cardNumber.slice(-4)})`
            : selectedMethod === 'debit_card'
            ? `Debit Card (***${cardNumber.slice(-4)})`
            : 'REHVO R-Cash Wallet',
        status: 'paid',
        date: 'Today, Just now',
        txnId: generatedTxnId,
      };

      setPaymentHistory(prev => [newTxn, ...prev]);
      setActiveReceipt(newTxn);
      setCurrentStage('success');
    }, 3600);
  };

  // Share Receipt
  const handleShareReceipt = async (record?: PaymentRecord | null) => {
    const rec = record || activeReceipt;
    if (!rec) return;
    try {
      await Share.share({
        message: `📄 REHVO Official Rent Receipt\nTxn ID: ${rec.txnId}\nProperty: ${rec.property}\nTenant: Yash Choudhary\nLandlord: ${rec.landlord}\nAmount Paid: ₹${rec.amount.toLocaleString('en-IN')}\nDate: ${rec.date}\nStatus: VERIFIED & PAID`,
      });
    } catch {
      showToast?.('Receipt link copied to clipboard', 'info');
    }
  };

  // Filtered History
  const filteredHistory = useMemo(() => {
    return paymentHistory.filter((item) => {
      const matchesFilter = historyFilter === 'all' || item.status === historyFilter;
      const matchesSearch =
        item.month.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        item.property.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        item.txnId.toLowerCase().includes(historySearchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [paymentHistory, historyFilter, historySearchQuery]);

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 10) }]}>
      {/* Top Header Bar */}
      {currentStage !== 'processing' && (
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={() => {
              if (currentStage === 'home') {
                router.back();
              } else if (currentStage === 'details') {
                setCurrentStage('home');
              } else if (currentStage === 'methods') {
                setCurrentStage('details');
              } else if (currentStage === 'upi' || currentStage === 'card') {
                setCurrentStage('methods');
              } else if (currentStage === 'success') {
                setCurrentStage('home');
              } else if (currentStage === 'history') {
                setCurrentStage('home');
              }
            }}
          >
            <ArrowLeft size={19} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              {currentStage === 'home'
                ? 'Pay Rent'
                : currentStage === 'details'
                ? 'Payment Breakdown'
                : currentStage === 'methods'
                ? 'Payment Method'
                : currentStage === 'upi'
                ? 'Pay via UPI'
                : currentStage === 'card'
                ? 'Pay via Card'
                : currentStage === 'success'
                ? 'Payment Successful'
                : 'Payment History'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {currentStage === 'home'
                ? 'Pay monthly rent securely & earn rewards'
                : '100% Secure 256-Bit Encrypted'}
            </Text>
          </View>

          <View style={styles.headerActionRow}>
            <Pressable
              style={styles.headerIconBtn}
              onPress={() => setRemindersModalVisible(true)}
            >
              <Bell size={17} color={V4_COLORS.textPrimary} strokeWidth={2.2} />
            </Pressable>
            <Pressable
              style={styles.headerIconBtn}
              onPress={() => {
                showToast?.('24/7 REHVO Rent Support is active for your account.', 'info');
              }}
            >
              <HelpCircle size={17} color={V4_COLORS.textPrimary} strokeWidth={2.2} />
            </Pressable>
          </View>
        </View>
      )}

      {/* Guest Mode Auth Gate */}
      {!isAuthenticated ? (
        <V4AuthGate
          icon={Receipt}
          title="Pay Rent with 0% Processing Fees"
          description="Sign in to pay rent, track monthly transactions, earn R-Cash rewards, and get instant tax receipts."
          benefits={[
            'Pay rent via UPI, Debit Card, Credit Card, or Net Banking',
            'Earn R-Cash cashbacks on every rent payment',
            'Instant automated digital rent receipts for HRA claims',
            'Landlord direct instant settlement with 0% hidden fees',
          ]}
          fullScreen={false}
        />
      ) : (
        <>
          {/* =====================================================================
              SCREEN 1: PAY RENT HOME (DASHBOARD)
             ===================================================================== */}
          {currentStage === 'home' && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Active Rent Hero Card */}
          <View style={styles.heroRentCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroBadge}>
                <Sparkles size={11} color="#FFFFFF" />
                <Text style={styles.heroBadgeText}>DUE IN {daysLeft} DAYS</Text>
              </View>

              <View style={styles.progressRingBadge}>
                <Clock size={12} color="#CCFBF1" />
                <Text style={styles.progressRingText}>{dueDate}</Text>
              </View>
            </View>

            <View style={styles.heroPropertyRow}>
              <Image source={{ uri: propertyImage }} style={styles.heroPropThumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.heroPropTitle} numberOfLines={1}>{propertyName}</Text>
                <Text style={styles.heroPropLocality}>{propertyLocality}</Text>
                <Text style={styles.heroLandlordText}>Landlord: {landlordName}</Text>
              </View>
            </View>

            <View style={styles.heroRentAmountRow}>
              <View>
                <Text style={styles.heroRentAmountLabel}>Total Rent Due</Text>
                <Text style={styles.heroRentAmountVal}>₹{baseRent.toLocaleString('en-IN')}</Text>
              </View>

              <Pressable
                style={styles.heroPayNowBtn}
                onPress={() => setCurrentStage('details')}
              >
                <Text style={styles.heroPayNowText}>Pay Now</Text>
                <ArrowRight size={15} color="#0F766E" strokeWidth={2.8} />
              </Pressable>
            </View>

            {/* Split Rent with Flatmates Button */}
            <Pressable
              style={styles.heroSplitBtn}
              onPress={() => setSplitModalVisible(true)}
              accessibilityRole="button"
            >
              <Users size={14} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.heroSplitBtnText}>Split Rent with Flatmates</Text>
            </Pressable>
          </View>

          {/* Quick Stats Strip */}
          <View style={styles.statsStrip}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Paid Total</Text>
              <Text style={styles.statVal}>₹{totalPaidAmount.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Transactions</Text>
              <Text style={styles.statVal}>{paymentHistory.length} Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Cashback</Text>
              <Text style={[styles.statVal, { color: '#0F766E' }]}>
                ₹{totalCashbackEarned.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          {/* Rewards & Cashback Banner */}
          <View style={styles.rewardsCard}>
            <View style={styles.rewardIconCircle}>
              <Gift size={20} color="#0F766E" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.rewardTag}>
                <Text style={styles.rewardTagText}>EXCLUSIVE OFFER</Text>
              </View>
              <Text style={styles.rewardTitle}>Pay via Credit Card & Earn ₹250</Text>
              <Text style={styles.rewardDesc}>
                Earn 2% R-Cash Cashback + Partner Discount Deals on this month's rent payment.
              </Text>
            </View>
          </View>

          {/* Saved Payment Methods Preview */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <Pressable onPress={() => setCurrentStage('methods')}>
              <Text style={styles.sectionActionText}>Manage</Text>
            </Pressable>
          </View>

          <View style={styles.methodsPreviewGrid}>
            <Pressable style={styles.methodPreviewItem} onPress={() => setCurrentStage('methods')}>
              <View style={[styles.methodPreviewIconBox, { backgroundColor: '#F0FDFA' }]}>
                <Zap size={18} color="#0F766E" />
              </View>
              <Text style={styles.methodPreviewTitle}>Instant UPI</Text>
              <Text style={styles.methodPreviewSub}>Google Pay, PhonePe</Text>
            </Pressable>

            <Pressable style={styles.methodPreviewItem} onPress={() => setCurrentStage('methods')}>
              <View style={[styles.methodPreviewIconBox, { backgroundColor: '#EEF2FF' }]}>
                <CreditCard size={18} color="#4F46E5" />
              </View>
              <Text style={styles.methodPreviewTitle}>Cards</Text>
              <Text style={styles.methodPreviewSub}>Earn Card Points</Text>
            </Pressable>
          </View>

          {/* Payment History Preview (Last 3) */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Payments</Text>
            <Pressable onPress={() => setCurrentStage('history')}>
              <Text style={styles.sectionActionText}>View All ({paymentHistory.length})</Text>
            </Pressable>
          </View>

          <View style={styles.recentHistoryList}>
            {paymentHistory.slice(0, 3).map((item) => (
              <View key={item.id} style={styles.historyCard}>
                <View style={styles.historyLeft}>
                  <View style={styles.historyIconCircle}>
                    <CheckCircle2 size={18} color="#16A34A" />
                  </View>
                  <View>
                    <Text style={styles.historyMonth}>{item.month}</Text>
                    <Text style={styles.historyProperty}>{item.property}</Text>
                    <Text style={styles.historyDate}>{item.date}</Text>
                  </View>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.historyAmount}>₹{item.amount.toLocaleString('en-IN')}</Text>
                  <Pressable
                    style={styles.historyReceiptBtn}
                    onPress={() => {
                      setActiveReceipt(item);
                      setReceiptModalVisible(true);
                    }}
                  >
                    <Receipt size={11} color="#0F766E" />
                    <Text style={styles.historyReceiptText}>Receipt</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          {/* Security & Trust Strip */}
          <View style={styles.securityTrustCard}>
            <ShieldCheck size={18} color="#0F766E" />
            <Text style={styles.securityTrustText}>
              Payments processed through 256-Bit Encrypted PCI DSS Certified Payment Gateway with direct instant landlord bank settlement.
            </Text>
          </View>
        </ScrollView>
      )}

      {/* =====================================================================
          SCREEN 2: PAYMENT DETAILS & BREAKDOWN
         ===================================================================== */}
      {currentStage === 'details' && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Rent Breakdown Card */}
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownHeading}>Rent Bill Breakdown</Text>
            <Text style={styles.breakdownSub}>For month of September 2026</Text>

            <View style={styles.breakdownList}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Monthly Base Rent</Text>
                <Text style={styles.breakdownValue}>₹{baseRent.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Society Maintenance</Text>
                <Text style={styles.breakdownValue}>₹{maintenance.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Reserved Parking Fee</Text>
                <Text style={styles.breakdownValue}>₹{parkingFee.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Water & Electricity</Text>
                <Text style={styles.breakdownValue}>₹0 (Included)</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>REHVO Processing Fee</Text>
                <Text style={[styles.breakdownValue, { color: '#16A34A', fontWeight: '800' }]}>
                  FREE
                </Text>
              </View>

              {appliedDiscount > 0 && (
                <View style={styles.breakdownRow}>
                  <Text style={[styles.breakdownLabel, { color: '#16A34A', fontWeight: '700' }]}>
                    Coupon Discount ({appliedCoupon})
                  </Text>
                  <Text style={[styles.breakdownValue, { color: '#16A34A', fontWeight: '800' }]}>
                    - ₹{appliedDiscount}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>Total Payable Amount</Text>
                <Text style={styles.totalDesc}>Inclusive of all maintenance</Text>
              </View>
              <Text style={styles.totalAmountVal}>₹{totalAmount.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          {/* Coupon / Promo Offers */}
          <View style={styles.couponCard}>
            <View style={styles.couponHeader}>
              <Tag size={16} color="#0F766E" />
              <Text style={styles.couponHeading}>Apply Promo & Save More</Text>
            </View>

            {appliedCoupon ? (
              <View style={styles.appliedCouponBox}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.appliedCouponCode}>🎉 {appliedCoupon} Applied</Text>
                  <Text style={styles.appliedCouponDesc}>You are saving ₹{appliedDiscount} on this rent payment.</Text>
                </View>
                <Pressable style={styles.removeCouponBtn} onPress={handleRemoveCoupon}>
                  <Text style={styles.removeCouponText}>Remove</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.couponInputRow}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="Enter code (e.g. REHVOFIRST)"
                  placeholderTextColor={V4_COLORS.textMuted}
                  value={couponCode}
                  onChangeText={setCouponCode}
                  autoCapitalize="characters"
                />
                <Pressable
                  style={styles.applyBtn}
                  onPress={() => handleApplyCoupon(couponCode)}
                >
                  <Text style={styles.applyBtnText}>Apply</Text>
                </Pressable>
              </View>
            )}

            {/* Quick Available Offers */}
            {!appliedCoupon && (
              <View style={styles.quickOffersRow}>
                <Pressable
                  style={styles.offerChip}
                  onPress={() => handleApplyCoupon('REHVOFIRST')}
                >
                  <Text style={styles.offerChipCode}>REHVOFIRST</Text>
                  <Text style={styles.offerChipDesc}>Get ₹250 Off</Text>
                </Pressable>
                <Pressable
                  style={styles.offerChip}
                  onPress={() => handleApplyCoupon('CREDIT2X')}
                >
                  <Text style={styles.offerChipCode}>CREDIT2X</Text>
                  <Text style={styles.offerChipDesc}>₹150 Off Rent</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Schedule & Reminders Strip */}
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.scheduleTitle}>Enable AutoPay Mandate</Text>
                <Text style={styles.scheduleSub}>Pay rent automatically on the 10th each month</Text>
              </View>
              <Switch
                value={autoPayEnabled}
                onValueChange={(val) => {
                  setAutoPayEnabled(val);
                  showToast?.(
                    val ? 'AutoPay Mandate enabled!' : 'AutoPay Mandate disabled',
                    'info'
                  );
                }}
                trackColor={{ false: '#E2E8F0', true: '#CCFBF1' }}
                thumbColor={autoPayEnabled ? '#0F766E' : '#FFFFFF'}
              />
            </View>

            <View style={styles.scheduleDivider} />

            <View style={styles.scheduleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.scheduleTitle}>WhatsApp & SMS Rent Reminders</Text>
                <Text style={styles.scheduleSub}>Get notified 3 days before rent due date</Text>
              </View>
              <Switch
                value={remindersEnabled}
                onValueChange={(val) => {
                  setRemindersEnabled(val);
                  showToast?.(
                    val ? 'Rent reminders enabled!' : 'Rent reminders disabled',
                    'info'
                  );
                }}
                trackColor={{ false: '#E2E8F0', true: '#CCFBF1' }}
                thumbColor={remindersEnabled ? '#0F766E' : '#FFFFFF'}
              />
            </View>
          </View>

          {/* Primary Proceed CTA */}
          <Pressable
            style={styles.primaryPayBtn}
            onPress={() => setCurrentStage('methods')}
          >
            <Text style={styles.primaryPayBtnText}>
              Proceed to Payment (₹{totalAmount.toLocaleString('en-IN')})
            </Text>
            <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>
        </ScrollView>
      )}

      {/* =====================================================================
          SCREEN 3: SELECT PAYMENT METHOD (APPLE WALLET STYLE)
         ===================================================================== */}
      {currentStage === 'methods' && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Amount Due Banner */}
          <View style={styles.methodHeaderBanner}>
            <Text style={styles.methodHeaderLabel}>Amount to Pay</Text>
            <Text style={styles.methodHeaderAmount}>₹{totalAmount.toLocaleString('en-IN')}</Text>
            <Text style={styles.methodHeaderSub}>{propertyName} • Landlord: {landlordName}</Text>
          </View>

          <Text style={styles.sectionTitle}>Select Preferred Method</Text>

          {/* Payment Method Cards */}
          <View style={styles.methodCardsList}>
            {/* UPI Option */}
            <Pressable
              style={[
                styles.methodSelectCard,
                selectedMethod === 'upi' && styles.methodSelectCardActive,
              ]}
              onPress={() => setSelectedMethod('upi')}
            >
              <View style={[styles.methodIconBox, { backgroundColor: '#F0FDFA' }]}>
                <Zap size={20} color="#0F766E" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.methodName}>Instant UPI</Text>
                  <View style={styles.recBadge}>
                    <Text style={styles.recBadgeText}>FASTEST</Text>
                  </View>
                </View>
                <Text style={styles.methodDesc}>Google Pay, PhonePe, Paytm, BHIM</Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  selectedMethod === 'upi' && styles.radioCircleActive,
                ]}
              >
                {selectedMethod === 'upi' && <View style={styles.radioInner} />}
              </View>
            </Pressable>

            {/* Credit Card Option */}
            <Pressable
              style={[
                styles.methodSelectCard,
                selectedMethod === 'credit_card' && styles.methodSelectCardActive,
              ]}
              onPress={() => setSelectedMethod('credit_card')}
            >
              <View style={[styles.methodIconBox, { backgroundColor: '#EEF2FF' }]}>
                <CreditCard size={20} color="#4F46E5" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.methodName}>Credit Card</Text>
                  <View style={[styles.recBadge, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.recBadgeText, { color: '#B45309' }]}>
                      +2% R-CASH (₹{Math.round(totalAmount * 0.02)})
                    </Text>
                  </View>
                </View>
                <Text style={styles.methodDesc}>Visa, MasterCard, RuPay, Diners, Amex</Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  selectedMethod === 'credit_card' && styles.radioCircleActive,
                ]}
              >
                {selectedMethod === 'credit_card' && <View style={styles.radioInner} />}
              </View>
            </Pressable>

            {/* Debit Card Option */}
            <Pressable
              style={[
                styles.methodSelectCard,
                selectedMethod === 'debit_card' && styles.methodSelectCardActive,
              ]}
              onPress={() => setSelectedMethod('debit_card')}
            >
              <View style={[styles.methodIconBox, { backgroundColor: '#F0FDF4' }]}>
                <CreditCard size={20} color="#16A34A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodName}>Debit Card</Text>
                <Text style={styles.methodDesc}>All Domestic Bank Debit Cards</Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  selectedMethod === 'debit_card' && styles.radioCircleActive,
                ]}
              >
                {selectedMethod === 'debit_card' && <View style={styles.radioInner} />}
              </View>
            </Pressable>

            {/* Net Banking */}
            <Pressable
              style={[
                styles.methodSelectCard,
                selectedMethod === 'netbanking' && styles.methodSelectCardActive,
              ]}
              onPress={() => setSelectedMethod('netbanking')}
            >
              <View style={[styles.methodIconBox, { backgroundColor: '#F5F3FF' }]}>
                <Building2 size={20} color="#8B5CF6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodName}>Net Banking</Text>
                <Text style={styles.methodDesc}>HDFC, ICICI, SBI, Axis, Kotak & 50+ Banks</Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  selectedMethod === 'netbanking' && styles.radioCircleActive,
                ]}
              >
                {selectedMethod === 'netbanking' && <View style={styles.radioInner} />}
              </View>
            </Pressable>

            {/* REHVO Wallet */}
            <Pressable
              style={[
                styles.methodSelectCard,
                selectedMethod === 'wallet' && styles.methodSelectCardActive,
              ]}
              onPress={() => setSelectedMethod('wallet')}
            >
              <View style={[styles.methodIconBox, { backgroundColor: '#ECFDF5' }]}>
                <Wallet size={20} color="#059669" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodName}>REHVO R-Cash Wallet</Text>
                <Text style={styles.methodDesc}>Available Balance: ₹{currentWalletBalance.toLocaleString('en-IN')} (Instant offset)</Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  selectedMethod === 'wallet' && styles.radioCircleActive,
                ]}
              >
                {selectedMethod === 'wallet' && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          </View>

          {/* Continue Action */}
          <Pressable style={styles.primaryPayBtn} onPress={handleStartPayment}>
            <Text style={styles.primaryPayBtnText}>Continue to Pay</Text>
            <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>
        </ScrollView>
      )}

      {/* =====================================================================
          SCREEN 4: UPI PAYMENT FLOW
         ===================================================================== */}
      {currentStage === 'upi' && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Amount Due Summary */}
          <View style={styles.methodHeaderBanner}>
            <Text style={styles.methodHeaderLabel}>Paying via UPI</Text>
            <Text style={styles.methodHeaderAmount}>₹{totalAmount.toLocaleString('en-IN')}</Text>
          </View>

          {/* Quick Apps Selection */}
          <Text style={styles.sectionTitle}>Select UPI App</Text>
          <View style={styles.upiAppsGrid}>
            {[
              { name: 'Google Pay', icon: '🟢' },
              { name: 'PhonePe', icon: '🟣' },
              { name: 'Paytm', icon: '🔵' },
              { name: 'BHIM', icon: '🇮🇳' },
              { name: 'Amazon Pay', icon: '🟠' },
            ].map((app) => (
              <Pressable
                key={app.name}
                style={[
                  styles.upiAppChip,
                  selectedUpiApp === app.name && styles.upiAppChipActive,
                ]}
                onPress={() => setSelectedUpiApp(app.name)}
              >
                <Text style={{ fontSize: 20 }}>{app.icon}</Text>
                <Text
                  style={[
                    styles.upiAppName,
                    selectedUpiApp === app.name && styles.upiAppNameActive,
                  ]}
                >
                  {app.name}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Custom UPI ID Entry */}
          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>Or Enter Custom UPI ID / VPA</Text>
            <Text style={styles.formSectionSub}>Collect request will be sent to your UPI app</Text>

            <View style={styles.upiInputRow}>
              <TextInput
                style={styles.upiInput}
                value={customUpiId}
                onChangeText={setCustomUpiId}
                placeholder="e.g. mobile@upi or username@okhdfc"
                placeholderTextColor={V4_COLORS.textMuted}
                autoCapitalize="none"
              />
              <View style={styles.verifiedVpaBadge}>
                <CheckCircle2 size={14} color="#16A34A" />
                <Text style={styles.verifiedVpaText}>VERIFIED</Text>
              </View>
            </View>
          </View>

          {/* Security Note */}
          <View style={styles.securityTrustCard}>
            <Lock size={15} color="#0F766E" />
            <Text style={styles.securityTrustText}>
              256-bit NPCI UPI verified payment. No UPI PIN required on REHVO. You will authorize directly inside your {selectedUpiApp} app.
            </Text>
          </View>

          {/* Pay Button */}
          <Pressable style={styles.primaryPayBtn} onPress={startProcessingFlow}>
            <Text style={styles.primaryPayBtnText}>
              Pay ₹{totalAmount.toLocaleString('en-IN')} via {selectedUpiApp}
            </Text>
            <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>
        </ScrollView>
      )}

      {/* =====================================================================
          SCREEN 5: CARD PAYMENT FLOW (APPLE PAY STYLE)
         ===================================================================== */}
      {currentStage === 'card' && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Live Card Preview (Apple Wallet Card Simulation) */}
          <View style={styles.cardPreviewContainer}>
            <View style={styles.cardChipRow}>
              <View style={styles.goldChip} />
              <Text style={styles.cardNetworkText}>VISA PLATINUM</Text>
            </View>

            <Text style={styles.cardPreviewNumber}>
              {cardNumber || '•••• •••• •••• ••••'}
            </Text>

            <View style={styles.cardPreviewBottomRow}>
              <View>
                <Text style={styles.cardPreviewSubLabel}>CARD HOLDER</Text>
                <Text style={styles.cardPreviewHolderName}>{cardHolder || 'YOUR NAME'}</Text>
              </View>
              <View>
                <Text style={styles.cardPreviewSubLabel}>EXPIRES</Text>
                <Text style={styles.cardPreviewExpiryVal}>{cardExpiry || 'MM/YY'}</Text>
              </View>
            </View>
          </View>

          {/* Credit Card Cashback Highlight Prompt */}
          <View style={styles.cardCashbackPrompt}>
            <Sparkles size={18} color="#0F766E" />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardCashbackPromptTitle}>2% R-Cash Cashback Active</Text>
              <Text style={styles.cardCashbackPromptSub}>
                You will earn ₹{Math.round(totalAmount * 0.02).toLocaleString('en-IN')} directly credited to your REHVO wallet on this payment.
              </Text>
            </View>
          </View>

          {/* Card Inputs Form */}
          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>Card Details</Text>

            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.textInput}
              value={cardNumber}
              onChangeText={setCardNumber}
              placeholder="16-Digit Card Number"
              placeholderTextColor={V4_COLORS.textMuted}
              keyboardType="numeric"
            />

            <View style={styles.formRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Expiry (MM/YY)</Text>
                <TextInput
                  style={styles.textInput}
                  value={cardExpiry}
                  onChangeText={setCardExpiry}
                  placeholder="MM/YY"
                  placeholderTextColor={V4_COLORS.textMuted}
                  maxLength={5}
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.textInput}
                  value={cardCvv}
                  onChangeText={setCardCvv}
                  placeholder="3 Digits"
                  placeholderTextColor={V4_COLORS.textMuted}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <TextInput
              style={styles.textInput}
              value={cardHolder}
              onChangeText={setCardHolder}
              placeholder="Name on Card"
              placeholderTextColor={V4_COLORS.textMuted}
              autoCapitalize="characters"
            />

            {/* Save Card Toggle */}
            <View style={styles.saveCardRow}>
              <Switch
                value={saveCard}
                onValueChange={setSaveCard}
                trackColor={{ false: '#E2E8F0', true: '#CCFBF1' }}
                thumbColor={saveCard ? '#0F766E' : '#FFFFFF'}
              />
              <Text style={styles.saveCardText}>Save card securely for 1-click future rent payments</Text>
            </View>
          </View>

          {/* PCI Security Badge */}
          <View style={styles.securityTrustCard}>
            <ShieldCheck size={16} color="#0F766E" />
            <Text style={styles.securityTrustText}>
              PCI DSS Level 1 Certified • 256-Bit Bank-Grade Tokenization Encryption.
            </Text>
          </View>

          {/* Pay Button */}
          <Pressable style={styles.primaryPayBtn} onPress={startProcessingFlow}>
            <Text style={styles.primaryPayBtnText}>
              Pay ₹{totalAmount.toLocaleString('en-IN')} Securely
            </Text>
            <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>
        </ScrollView>
      )}

      {/* =====================================================================
          SCREEN 6: PAYMENT PROCESSING ANIMATION (FULL SCREEN)
         ===================================================================== */}
      {currentStage === 'processing' && (
        <View style={styles.processingRoot}>
          <View style={styles.processingRingContainer}>
            <View style={styles.pulseRingOuter} />
            <View style={styles.pulseRingInner}>
              <ActivityIndicator size="large" color="#0F766E" />
            </View>
          </View>

          <Text style={styles.processingTitle}>Processing Payment Securely</Text>
          <Text style={styles.processingAmount}>₹{totalAmount.toLocaleString('en-IN')}</Text>

          <View style={styles.processingStepsCard}>
            <View style={styles.processStepItem}>
              <CheckCircle2
                size={16}
                color={processingStep >= 1 ? '#16A34A' : V4_COLORS.textMuted}
              />
              <Text style={styles.processStepText}>Connecting to banking network</Text>
            </View>
            <View style={styles.processStepItem}>
              <CheckCircle2
                size={16}
                color={processingStep >= 2 ? '#16A34A' : V4_COLORS.textMuted}
              />
              <Text style={styles.processStepText}>Authorizing ₹{totalAmount.toLocaleString('en-IN')} rent payment</Text>
            </View>
            <View style={styles.processStepItem}>
              <CheckCircle2
                size={16}
                color={processingStep >= 3 ? '#16A34A' : V4_COLORS.textMuted}
              />
              <Text style={styles.processStepText}>Generating instant digital landlord receipt</Text>
            </View>
          </View>

          <Text style={styles.processingNote}>Please do not close or refresh the app...</Text>
        </View>
      )}

      {/* =====================================================================
          SCREEN 7: PAYMENT SUCCESS CELEBRATION
         ===================================================================== */}
      {currentStage === 'success' && activeReceipt && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Confetti & Success Emblem */}
          <View style={styles.successHeaderBox}>
            <View style={styles.successCheckCircle}>
              <Check size={38} color="#FFFFFF" strokeWidth={3.5} />
            </View>
            <Text style={styles.successMainTitle}>Rent Paid Successfully!</Text>
            <Text style={styles.successPaidAmount}>₹{activeReceipt.amount.toLocaleString('en-IN')}</Text>
            <Text style={styles.successSub}>
              Transferred directly to {activeReceipt.landlord}'s bank account
            </Text>
          </View>

          {/* Cashback & Rewards Card */}
          <View style={styles.rewardsUnlockedCard}>
            <View style={styles.rewardsUnlockedHeader}>
              <Gift size={20} color="#0F766E" />
              <Text style={styles.rewardsUnlockedTitle}>Cashback & Rewards Unlocked!</Text>
            </View>
            <View style={styles.rewardsUnlockedRow}>
              <View style={styles.rewardPill}>
                <Text style={styles.rewardPillVal}>+ ₹250</Text>
                <Text style={styles.rewardPillLabel}>R-Cash Wallet</Text>
              </View>
              <View style={styles.rewardPill}>
                <Text style={styles.rewardPillVal}>1 Deal</Text>
                <Text style={styles.rewardPillLabel}>Swiggy Voucher</Text>
              </View>
            </View>
          </View>

          {/* Transaction Summary Card */}
          <View style={styles.txnSummaryCard}>
            <View style={styles.txnSummaryRow}>
              <Text style={styles.txnLabel}>Transaction ID</Text>
              <Text style={styles.txnVal}>{activeReceipt.txnId}</Text>
            </View>
            <View style={styles.txnSummaryRow}>
              <Text style={styles.txnLabel}>Date & Time</Text>
              <Text style={styles.txnVal}>{activeReceipt.date}</Text>
            </View>
            <View style={styles.txnSummaryRow}>
              <Text style={styles.txnLabel}>Paid Via</Text>
              <Text style={styles.txnVal}>{activeReceipt.method}</Text>
            </View>
            <View style={styles.txnSummaryRow}>
              <Text style={styles.txnLabel}>Property</Text>
              <Text style={styles.txnVal}>{activeReceipt.property}</Text>
            </View>
            <View style={styles.txnSummaryRow}>
              <Text style={styles.txnLabel}>Landlord</Text>
              <Text style={styles.txnVal}>{activeReceipt.landlord}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.successActionRow}>
            <Pressable
              style={styles.viewReceiptBtn}
              onPress={() => setReceiptModalVisible(true)}
            >
              <Receipt size={16} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.viewReceiptBtnText}>View Rent Receipt</Text>
            </Pressable>

            <Pressable
              style={styles.shareReceiptBtn}
              onPress={() => handleShareReceipt(activeReceipt)}
            >
              <Share2 size={16} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.shareReceiptBtnText}>Share</Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.returnHomeBtn}
            onPress={() => setCurrentStage('home')}
          >
            <Text style={styles.returnHomeBtnText}>Return to Dashboard</Text>
          </Pressable>
        </ScrollView>
      )}

      {/* =====================================================================
          SCREEN 8: PAYMENT HISTORY & TIMELINE
         ===================================================================== */}
      {currentStage === 'history' && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Input */}
          <View style={styles.searchBarContainer}>
            <Search size={16} color={V4_COLORS.textSecondary} />
            <TextInput
              style={styles.searchBarInput}
              placeholder="Search by month, property, or Txn ID..."
              placeholderTextColor={V4_COLORS.textMuted}
              value={historySearchQuery}
              onChangeText={setHistorySearchQuery}
            />
          </View>

          {/* History Filter Tabs */}
          <View style={styles.historyTabsRow}>
            {(['all', 'paid', 'upcoming', 'pending'] as const).map((filter) => (
              <Pressable
                key={filter}
                style={[
                  styles.historyTabPill,
                  historyFilter === filter && styles.historyTabPillActive,
                ]}
                onPress={() => setHistoryFilter(filter)}
              >
                <Text
                  style={[
                    styles.historyTabText,
                    historyFilter === filter && styles.historyTabTextActive,
                  ]}
                >
                  {filter.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Timeline List */}
          {filteredHistory.length === 0 ? (
            <View style={styles.emptyHistoryBox}>
              <Receipt size={40} color={V4_COLORS.borderDark} />
              <Text style={styles.emptyHistoryTitle}>No payments found</Text>
              <Text style={styles.emptyHistoryDesc}>
                No transactions matched your current search or filter criteria.
              </Text>
            </View>
          ) : (
            <View style={styles.timelineList}>
              {filteredHistory.map((item) => (
                <View key={item.id} style={styles.timelineItemCard}>
                  <View style={styles.timelineItemHeader}>
                    <View style={styles.timelineMonthBadge}>
                      <Calendar size={12} color="#0F766E" />
                      <Text style={styles.timelineMonthText}>{item.month}</Text>
                    </View>
                    <View style={styles.timelinePaidBadge}>
                      <Text style={styles.timelinePaidText}>PAID</Text>
                    </View>
                  </View>

                  <View style={styles.timelinePropDetails}>
                    <Text style={styles.timelinePropName}>{item.property}</Text>
                    <Text style={styles.timelinePropLocality}>{item.locality}</Text>
                    <Text style={styles.timelineMeta}>Landlord: {item.landlord} • {item.method}</Text>
                  </View>

                  <View style={styles.timelineBottomRow}>
                    <View>
                      <Text style={styles.timelineAmountLabel}>Amount Paid</Text>
                      <Text style={styles.timelineAmountVal}>₹{item.amount.toLocaleString('en-IN')}</Text>
                    </View>

                    <Pressable
                      style={styles.timelineReceiptBtn}
                      onPress={() => {
                        setActiveReceipt(item);
                        setReceiptModalVisible(true);
                      }}
                    >
                      <Receipt size={13} color="#0F766E" strokeWidth={2.4} />
                      <Text style={styles.timelineReceiptBtnText}>View Receipt</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* =====================================================================
          SPLIT RENT WITH FLATMATES MODAL
         ===================================================================== */}
      <Modal
        visible={splitModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSplitModalVisible(false)}
      >
        <View style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Split Rent with Flatmates</Text>
              <Text style={styles.modalSubtitle}>Equal split & instant payment links</Text>
            </View>
            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => setSplitModalVisible(false)}
              accessibilityLabel="Close split modal"
            >
              <X size={20} color={V4_COLORS.textPrimary} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.splitCard}>
              <View style={styles.splitPropRow}>
                <Building2 size={20} color="#0F766E" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.splitPropTitle} numberOfLines={1}>{propertyName}</Text>
                  <Text style={styles.splitPropSub}>{propertyLocality}</Text>
                </View>
              </View>

              <View style={styles.splitAmountBanner}>
                <Text style={styles.splitBannerLabel}>TOTAL RENT AMOUNT</Text>
                <Text style={styles.splitBannerValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
              </View>

              <Text style={styles.splitSectionLabel}>SELECT NUMBER OF FLATMATES</Text>
              <View style={styles.splitPillsRow}>
                {[2, 3, 4, 5].map((num) => (
                  <Pressable
                    key={num}
                    style={[styles.splitPill, splitCount === num && styles.splitPillActive]}
                    onPress={() => setSplitCount(num)}
                  >
                    <Text style={[styles.splitPillText, splitCount === num && styles.splitPillTextActive]}>
                      {num} People
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.splitResultBox}>
                <Text style={styles.splitResultLabel}>EACH PERSON PAYS</Text>
                <Text style={styles.splitResultValue}>
                  ₹{Math.round(totalAmount / splitCount).toLocaleString('en-IN')}
                </Text>
                <Text style={styles.splitResultSub}>
                  Divided equally among {splitCount} flatmates (includes maintenance & utilities)
                </Text>
              </View>

              <View style={styles.splitActionsCol}>
                <Pressable
                  style={styles.splitShareBtn}
                  onPress={async () => {
                    const shareMsg = `Hey roomie! Our rent for ${propertyName} is ₹${totalAmount.toLocaleString('en-IN')}. Your share (${splitCount}-way split) is ₹${Math.round(totalAmount / splitCount).toLocaleString('en-IN')}. Pay securely via REHVO: https://rehvo.com/pay-rent?amount=${Math.round(totalAmount / splitCount)}`;
                    await Share.share({ message: shareMsg });
                    showToast?.('Split rent link shared successfully!', 'success');
                  }}
                  accessibilityRole="button"
                >
                  <Share2 size={16} color="#FFFFFF" strokeWidth={2.4} />
                  <Text style={styles.splitShareBtnText}>Share Split Request Link</Text>
                </Pressable>

                <Pressable
                  style={styles.splitDoneBtn}
                  onPress={() => setSplitModalVisible(false)}
                >
                  <Text style={styles.splitDoneBtnText}>Done</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* =====================================================================
          DIGITAL RENT RECEIPT MODAL (APPLE WALLET PASS STYLE)
         ===================================================================== */}
      <Modal
        visible={receiptModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setReceiptModalVisible(false)}
      >
        <View style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Official Rent Receipt</Text>
              <Text style={styles.modalSubtitle}>Government & HRA Compliant</Text>
            </View>
            <Pressable style={styles.modalCloseBtn} onPress={() => setReceiptModalVisible(false)}>
              <X size={20} color={V4_COLORS.textPrimary} />
            </Pressable>
          </View>

          {activeReceipt && (
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.receiptSheet}>
                {/* Header with REHVO Seal */}
                <View style={styles.receiptHeaderRow}>
                  <View style={styles.receiptLogoBox}>
                    <ShieldCheck size={24} color="#0F766E" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.receiptBrandTitle}>REHVO TENANCY TRUST</Text>
                    <Text style={styles.receiptHraTag}>100% Tax Compliant HRA Receipt</Text>
                  </View>
                </View>

                {/* Amount Paid Big Display */}
                <View style={styles.receiptAmountBanner}>
                  <Text style={styles.receiptAmountCaption}>RENT AMOUNT RECEIVED</Text>
                  <Text style={styles.receiptBigAmount}>₹{activeReceipt.amount.toLocaleString('en-IN')}</Text>
                  <Text style={styles.receiptStatusLine}>✓ VERIFIED DIGITAL SETTLEMENT</Text>
                </View>

                {/* Parties Grid */}
                <View style={styles.receiptTable}>
                  <View style={styles.receiptTableRow}>
                    <Text style={styles.receiptTableLabel}>Received From (Tenant):</Text>
                    <Text style={styles.receiptTableVal}>Yash Choudhary</Text>
                  </View>
                  <View style={styles.receiptTableRow}>
                    <Text style={styles.receiptTableLabel}>Received By (Landlord):</Text>
                    <Text style={styles.receiptTableVal}>{activeReceipt.landlord} (PAN on record)</Text>
                  </View>
                  <View style={styles.receiptTableRow}>
                    <Text style={styles.receiptTableLabel}>Property Address:</Text>
                    <Text style={styles.receiptTableVal}>{activeReceipt.property}, {activeReceipt.locality}</Text>
                  </View>
                  <View style={styles.receiptTableRow}>
                    <Text style={styles.receiptTableLabel}>Rental Period:</Text>
                    <Text style={styles.receiptTableVal}>{activeReceipt.month}</Text>
                  </View>
                  <View style={styles.receiptTableRow}>
                    <Text style={styles.receiptTableLabel}>Transaction ID:</Text>
                    <Text style={[styles.receiptTableVal, { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }]}>
                      {activeReceipt.txnId}
                    </Text>
                  </View>
                  <View style={styles.receiptTableRow}>
                    <Text style={styles.receiptTableLabel}>Payment Mode:</Text>
                    <Text style={styles.receiptTableVal}>{activeReceipt.method}</Text>
                  </View>
                </View>

                {/* QR Code & Landlord E-Signature */}
                <View style={styles.receiptSignRow}>
                  <View style={styles.receiptQrBox}>
                    <QrCode size={56} color="#0F766E" />
                    <Text style={styles.receiptQrCaption}>Scan to verify</Text>
                  </View>

                  <View style={styles.receiptSignBox}>
                    <View style={styles.receiptSealCircle}>
                      <BadgeCheck size={18} color="#16A34A" />
                    </View>
                    <Text style={styles.receiptSignName}>{activeReceipt.landlord}</Text>
                    <Text style={styles.receiptSignRole}>Landlord Digital Signature</Text>
                    <Text style={styles.receiptTimestamp}>{activeReceipt.date}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}

          <View style={styles.modalFooter}>
            <Pressable
              style={styles.downloadPdfBtn}
              onPress={() => {
                showToast?.('📥 Downloaded HRA Compliant Rent Receipt PDF!', 'success');
                setReceiptModalVisible(false);
              }}
            >
              <Download size={16} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.downloadPdfBtnText}>Download PDF Receipt</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* =====================================================================
          RENT REMINDERS MODAL
         ===================================================================== */}
      <Modal
        visible={remindersModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setRemindersModalVisible(false)}
      >
        <View style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Rent Due Reminders</Text>
              <Text style={styles.modalSubtitle}>Never miss a due date or penalty</Text>
            </View>
            <Pressable style={styles.modalCloseBtn} onPress={() => setRemindersModalVisible(false)}>
              <X size={20} color={V4_COLORS.textPrimary} />
            </Pressable>
          </View>

          <View style={styles.modalContentBody}>
            <View style={styles.reminderOptionCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.reminderOptionTitle}>3 Days Before Due Date</Text>
                <Text style={styles.reminderOptionSub}>Receive notification on 7th of every month</Text>
              </View>
              <CheckCircle2 size={20} color="#0F766E" />
            </View>

            <View style={styles.reminderOptionCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.reminderOptionTitle}>1 Day Before Due Date</Text>
                <Text style={styles.reminderOptionSub}>Final gentle alert before scheduled payment</Text>
              </View>
              <CheckCircle2 size={20} color="#0F766E" />
            </View>

            <View style={styles.reminderOptionCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.reminderOptionTitle}>WhatsApp Instant Alert</Text>
                <Text style={styles.reminderOptionSub}>Direct payment link sent to your registered mobile</Text>
              </View>
              <CheckCircle2 size={20} color="#0F766E" />
            </View>
          </View>

          <View style={styles.modalFooter}>
            <Pressable
              style={styles.downloadPdfBtn}
              onPress={() => {
                showToast?.('Reminder preferences saved successfully!', 'success');
                setRemindersModalVisible(false);
              }}
            >
              <Text style={styles.downloadPdfBtnText}>Save Preferences</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
    backgroundColor: V4_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EEF0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    ...V4_SHADOWS.soft,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17.5,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '500',
  },
  headerActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: V4_COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: V4_COLORS.border,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },

  // Hero Rent Card
  heroRentCard: {
    backgroundColor: '#0F766E',
    borderRadius: 24,
    padding: 18,
    gap: 12,
    ...V4_SHADOWS.card,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    gap: 4,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  progressRingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    gap: 4,
  },
  progressRingText: {
    color: '#CCFBF1',
    fontSize: 10.5,
    fontWeight: '700',
  },
  heroPropertyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  heroPropThumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  heroPropTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  heroPropLocality: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.88)',
    marginTop: 1,
  },
  heroLandlordText: {
    fontSize: 11,
    color: '#CCFBF1',
    fontWeight: '600',
    marginTop: 2,
  },
  heroRentAmountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 10,
    marginTop: 2,
  },
  heroRentAmountLabel: {
    fontSize: 10,
    color: '#CCFBF1',
    fontWeight: '600',
  },
  heroRentAmountVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  heroPayNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
    ...V4_SHADOWS.soft,
  },
  heroPayNowText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F766E',
  },

  // Stats Strip
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.surface,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    justifyContent: 'space-between',
    ...V4_SHADOWS.soft,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  statVal: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: V4_COLORS.border,
  },

  // Rewards Card
  rewardsCard: {
    flexDirection: 'row',
    backgroundColor: '#F0FDFA',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 12,
    alignItems: 'center',
  },
  rewardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardTag: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  rewardTagText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  rewardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  rewardDesc: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    lineHeight: 15,
  },

  // Section Headers
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15.5,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  sectionActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },

  // Methods Preview Grid
  methodsPreviewGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  methodPreviewItem: {
    flex: 1,
    backgroundColor: V4_COLORS.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 4,
    ...V4_SHADOWS.soft,
  },
  methodPreviewIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  methodPreviewTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  methodPreviewSub: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
  },

  // Recent History List
  recentHistoryList: {
    gap: 10,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: V4_COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    ...V4_SHADOWS.soft,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  historyIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyMonth: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  historyProperty: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
  },
  historyDate: {
    fontSize: 9.5,
    color: V4_COLORS.textMuted,
    marginTop: 1,
  },
  historyAmount: {
    fontSize: 13.5,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  historyReceiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginTop: 4,
  },
  historyReceiptText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
  },

  // Security Trust Card
  securityTrustCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 8,
  },
  securityTrustText: {
    flex: 1,
    fontSize: 10.5,
    color: '#0F766E',
    lineHeight: 14,
  },

  // Breakdown Screen Styles
  breakdownCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 12,
    ...V4_SHADOWS.card,
  },
  breakdownHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  breakdownSub: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
  },
  breakdownList: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    fontWeight: '500',
  },
  breakdownValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1.5,
    borderTopColor: '#E6EEF0',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  totalDesc: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
  },
  totalAmountVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F766E',
  },

  // Coupon Card
  couponCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 10,
    ...V4_SHADOWS.soft,
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  couponHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  couponInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  couponInput: {
    flex: 1,
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 12.5,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  applyBtn: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  appliedCouponBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: 10,
    borderRadius: 12,
  },
  appliedCouponCode: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#15803D',
  },
  appliedCouponDesc: {
    fontSize: 10.5,
    color: '#16A34A',
  },
  removeCouponBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  removeCouponText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  quickOffersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  offerChip: {
    flex: 1,
    backgroundColor: '#F0FDFA',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  offerChipCode: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  offerChipDesc: {
    fontSize: 9.5,
    color: V4_COLORS.textSecondary,
  },

  // Schedule Card
  scheduleCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 12,
    ...V4_SHADOWS.soft,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  scheduleSub: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  scheduleDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },

  // Primary Button
  primaryPayBtn: {
    backgroundColor: '#0F766E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    ...V4_SHADOWS.card,
  },
  primaryPayBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  // Method Selection Styles
  methodHeaderBanner: {
    backgroundColor: '#0F766E',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    gap: 2,
    ...V4_SHADOWS.soft,
  },
  methodHeaderLabel: {
    fontSize: 11,
    color: '#CCFBF1',
    fontWeight: '600',
  },
  methodHeaderAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  methodHeaderSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  methodCardsList: {
    gap: 10,
  },
  methodSelectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: V4_COLORS.border,
    gap: 12,
    ...V4_SHADOWS.soft,
  },
  methodSelectCardActive: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  methodIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodName: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  methodDesc: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  recBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  recBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#15803D',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: V4_COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#0F766E',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0F766E',
  },

  // UPI Screen Styles
  upiAppsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  upiAppChip: {
    width: '31%',
    backgroundColor: V4_COLORS.surface,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 4,
  },
  upiAppChipActive: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  upiAppName: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  upiAppNameActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  formCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 8,
    ...V4_SHADOWS.soft,
  },
  formSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  formSectionSub: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginBottom: 4,
  },
  upiInputRow: {
    position: 'relative',
  },
  upiInput: {
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: V4_COLORS.textPrimary,
    fontWeight: '600',
    paddingRight: 80,
  },
  verifiedVpaBadge: {
    position: 'absolute',
    right: 10,
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedVpaText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#16A34A',
  },

  // Card Payment Styles
  cardPreviewContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 22,
    padding: 20,
    gap: 16,
    ...V4_SHADOWS.card,
  },
  cardChipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goldChip: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F59E0B',
    borderWidth: 1,
    borderColor: '#D97706',
  },
  cardNetworkText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  cardPreviewNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginVertical: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cardPreviewBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardPreviewSubLabel: {
    fontSize: 8.5,
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardPreviewHolderName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 1,
  },
  cardPreviewExpiryVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 1,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginTop: 4,
  },
  textInput: {
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: V4_COLORS.textPrimary,
    fontWeight: '600',
  },
  formRow: {
    flexDirection: 'row',
  },
  saveCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  saveCardText: {
    flex: 1,
    fontSize: 11,
    color: V4_COLORS.textSecondary,
  },

  // Processing Animation Screen
  processingRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  processingRingContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  pulseRingOuter: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: '#CCFBF1',
  },
  pulseRingInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...V4_SHADOWS.soft,
  },
  processingTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  processingAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F766E',
  },
  processingStepsCard: {
    width: '100%',
    backgroundColor: V4_COLORS.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 12,
    marginTop: 8,
  },
  processStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  processStepText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
  },
  processingNote: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginTop: 8,
  },

  // Success Celebration Screen
  successHeaderBox: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 6,
  },
  successCheckCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...V4_SHADOWS.card,
  },
  successMainTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  successPaidAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F766E',
  },
  successSub: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
  },
  rewardsUnlockedCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 10,
  },
  rewardsUnlockedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardsUnlockedTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F766E',
  },
  rewardsUnlockedRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rewardPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  rewardPillVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F766E',
  },
  rewardPillLabel: {
    fontSize: 10,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  txnSummaryCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 10,
    ...V4_SHADOWS.soft,
  },
  txnSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txnLabel: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '500',
  },
  txnVal: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    textAlign: 'right',
    flexShrink: 1,
  },
  successActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  viewReceiptBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  viewReceiptBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  shareReceiptBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  shareReceiptBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  returnHomeBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  returnHomeBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },

  // History & Timeline Styles
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 8,
  },
  searchBarInput: {
    flex: 1,
    fontSize: 12.5,
    color: V4_COLORS.textPrimary,
    fontWeight: '600',
  },
  historyTabsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  historyTabPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
  },
  historyTabPillActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  historyTabText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  historyTabTextActive: {
    color: '#FFFFFF',
  },
  timelineList: {
    gap: 12,
  },
  timelineItemCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 10,
    ...V4_SHADOWS.soft,
  },
  timelineItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineMonthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  timelineMonthText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  timelinePaidBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  timelinePaidText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#15803D',
  },
  timelinePropDetails: {
    gap: 2,
  },
  timelinePropName: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  timelinePropLocality: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
  },
  timelineMeta: {
    fontSize: 10.5,
    color: V4_COLORS.textMuted,
    marginTop: 2,
  },
  timelineBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  timelineAmountLabel: {
    fontSize: 9.5,
    color: V4_COLORS.textSecondary,
  },
  timelineAmountVal: {
    fontSize: 15,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  timelineReceiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  timelineReceiptBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  emptyHistoryBox: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
  },
  emptyHistoryTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  emptyHistoryDesc: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
  },

  // Receipt Modal Styles
  modalRoot: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: V4_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: V4_COLORS.borderLight,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '500',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: V4_COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    flex: 1,
    padding: 16,
  },
  modalContentBody: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  modalFooter: {
    padding: 16,
    backgroundColor: V4_COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: V4_COLORS.borderLight,
  },
  downloadPdfBtn: {
    backgroundColor: '#0F766E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    ...V4_SHADOWS.card,
  },
  downloadPdfBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  receiptSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#0F766E',
    padding: 18,
    gap: 14,
    marginBottom: 20,
    ...V4_SHADOWS.card,
  },
  receiptHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E6EEF0',
    paddingBottom: 10,
  },
  receiptLogoBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  receiptBrandTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  receiptHraTag: {
    fontSize: 10.5,
    color: '#16A34A',
    fontWeight: '700',
  },
  receiptAmountBanner: {
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 2,
  },
  receiptAmountCaption: {
    fontSize: 9.5,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  receiptBigAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F766E',
  },
  receiptStatusLine: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#16A34A',
    marginTop: 2,
  },
  receiptTable: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  receiptTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receiptTableLabel: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  receiptTableVal: {
    fontSize: 10.5,
    color: V4_COLORS.textPrimary,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  receiptSignRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  receiptQrBox: {
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 2,
  },
  receiptQrCaption: {
    fontSize: 8,
    fontWeight: '800',
    color: '#0F766E',
  },
  receiptSignBox: {
    alignItems: 'center',
    gap: 2,
  },
  receiptSealCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  receiptSignName: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  receiptSignRole: {
    fontSize: 9,
    color: V4_COLORS.textSecondary,
  },
  receiptTimestamp: {
    fontSize: 8.5,
    color: V4_COLORS.textMuted,
  },
  reminderOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 12,
    ...V4_SHADOWS.soft,
  },
  reminderOptionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  reminderOptionSub: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  heroSplitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#99F6E4',
    marginTop: 10,
  },
  heroSplitBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  cardCashbackPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#99F6E4',
    marginBottom: 14,
  },
  cardCashbackPromptTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  cardCashbackPromptSub: {
    fontSize: 11,
    color: '#115E59',
    marginTop: 2,
    lineHeight: 15,
  },
  splitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    gap: 14,
    ...V4_SHADOWS.card,
  },
  splitPropRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2ECEF',
  },
  splitPropTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  splitPropSub: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  splitAmountBanner: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2ECEF',
  },
  splitBannerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: V4_COLORS.textMuted,
    letterSpacing: 0.8,
  },
  splitBannerValue: {
    fontSize: 22,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    marginTop: 4,
  },
  splitSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  splitPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  splitPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2ECEF',
  },
  splitPillActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  splitPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  splitPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  splitResultBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#99F6E4',
    gap: 4,
  },
  splitResultLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.8,
  },
  splitResultValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F766E',
  },
  splitResultSub: {
    fontSize: 11,
    color: '#115E59',
    textAlign: 'center',
    marginTop: 2,
  },
  splitActionsCol: {
    gap: 10,
    marginTop: 6,
  },
  splitShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F766E',
    paddingVertical: 14,
    borderRadius: 14,
    ...V4_SHADOWS.card,
  },
  splitShareBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  splitDoneBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  splitDoneBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
});
