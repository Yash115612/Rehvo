import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  Coins,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Lock,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';
import {
  createPaymentOrder,
  processPaymentCapture,
} from '../../../services/paymentGateway';
import { PaymentMethodV72 } from '../../../types';

interface V4PaymentCheckoutModalProps {
  visible: boolean;
  onClose: () => void;
  amount: number;
  purpose: string;
  propertyTitle?: string;
  onSuccess?: (receipt: { orderId: string; invoiceUrl: string }) => void;
}

export const V4PaymentCheckoutModalComponent: React.FC<V4PaymentCheckoutModalProps> = ({
  visible,
  onClose,
  amount,
  purpose,
  propertyTitle,
  onSuccess,
}) => {
  const insets = useSafeAreaInsets();
  const { user, showToast } = useAppStore();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodV72>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred'>('gpay');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState('');

  const cashbackEarned = useMemo(() => Math.round(amount * 0.01), [amount]);

  const handlePayNow = useCallback(async () => {
    setProcessing(true);
    try {
      const order = await createPaymentOrder({
        user_id: user?.id,
        amount,
        purpose: 'rent',
        property_title: propertyTitle,
      });

      // Simulate payment capture
      setTimeout(async () => {
        const capture = await processPaymentCapture(order.order_id, selectedMethod, user?.id);
        setProcessing(false);
        if (capture.success) {
          setCompleted(true);
          setInvoiceUrl(capture.invoiceUrl);
          showToast(`Payment of ₹${amount.toLocaleString()} successful!`, 'success');
          if (onSuccess) {
            onSuccess({ orderId: order.order_id, invoiceUrl: capture.invoiceUrl });
          }
        } else {
          showToast('Payment processing failed. Please try another method.', 'error');
        }
      }, 1500);
    } catch {
      setProcessing(false);
      showToast('Error initializing payment gateway', 'error');
    }
  }, [amount, selectedMethod, propertyTitle, user?.id, showToast, onSuccess]);

  const resetAndClose = useCallback(() => {
    setCompleted(false);
    setProcessing(false);
    onClose();
  }, [onClose]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={resetAndClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Text style={styles.sheetTitle}>Checkout & Pay</Text>
              <Text style={styles.sheetSubtitle}>{purpose}</Text>
            </View>
            <Pressable
              style={styles.closeBtn}
              onPress={resetAndClose}
              accessibilityRole="button"
            >
              <X size={20} color={V4_COLORS.textPrimary} />
            </Pressable>
          </View>

          {completed ? (
            <View style={styles.successContainer}>
              <View style={styles.successIconBox}>
                <CheckCircle2 size={48} color={V4_COLORS.success} />
              </View>
              <Text style={styles.successTitle}>Payment Completed!</Text>
              <Text style={styles.successAmount}>₹{amount.toLocaleString()}</Text>
              <Text style={styles.successSubtitle}>
                Verified digitally with 0% convenience fees.
              </Text>

              <View style={styles.cashbackBox}>
                <Sparkles size={16} color={V4_COLORS.primary} />
                <Text style={styles.cashbackText}>
                  +₹{cashbackEarned} R-Cash credited to your wallet
                </Text>
              </View>

              <Pressable
                style={styles.doneButton}
                onPress={resetAndClose}
                accessibilityRole="button"
              >
                <Text style={styles.doneButtonText}>Done & View Receipt</Text>
              </Pressable>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Amount Breakdown Card */}
              <View style={styles.breakdownCard}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Rent / Payment Amount</Text>
                  <Text style={styles.breakdownValue}>₹{amount.toLocaleString()}</Text>
                </View>

                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>REHVO Convenience Fee</Text>
                  <View style={styles.freeBadge}>
                    <Text style={styles.freeBadgeText}>FREE (₹0)</Text>
                  </View>
                </View>

                <View style={styles.breakdownDivider} />

                <View style={styles.breakdownRow}>
                  <Text style={styles.totalLabel}>Total Payable</Text>
                  <Text style={styles.totalAmount}>₹{amount.toLocaleString()}</Text>
                </View>

                <View style={styles.cashbackPill}>
                  <Sparkles size={12} color={V4_COLORS.primary} />
                  <Text style={styles.cashbackPillText}>
                    Earn ₹{cashbackEarned} instant R-Cash cashback
                  </Text>
                </View>
              </View>

              {/* Payment Methods */}
              <Text style={styles.sectionHeader}>SELECT PAYMENT METHOD</Text>

              {/* UPI Option */}
              <Pressable
                style={[
                  styles.methodCard,
                  selectedMethod === 'upi' && styles.methodCardActive,
                ]}
                onPress={() => setSelectedMethod('upi')}
              >
                <View style={styles.methodHeader}>
                  <View style={[styles.iconBox, { backgroundColor: V4_COLORS.primaryLight }]}>
                    <Smartphone size={20} color={V4_COLORS.primary} />
                  </View>
                  <View style={styles.methodText}>
                    <Text style={styles.methodTitle}>Instant UPI (Zero Charges)</Text>
                    <Text style={styles.methodSubtitle}>Google Pay, PhonePe, Paytm, CRED</Text>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      selectedMethod === 'upi' && styles.radioCircleActive,
                    ]}
                  />
                </View>

                {selectedMethod === 'upi' && (
                  <View style={styles.upiAppsRow}>
                    {(['gpay', 'phonepe', 'paytm', 'cred'] as const).map((app) => (
                      <Pressable
                        key={app}
                        style={[
                          styles.upiAppPill,
                          selectedUpiApp === app && styles.upiAppPillActive,
                        ]}
                        onPress={() => setSelectedUpiApp(app)}
                      >
                        <Text
                          style={[
                            styles.upiAppText,
                            selectedUpiApp === app && styles.upiAppTextActive,
                          ]}
                        >
                          {app.toUpperCase()}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </Pressable>

              {/* Cards Option */}
              <Pressable
                style={[
                  styles.methodCard,
                  selectedMethod === 'card' && styles.methodCardActive,
                ]}
                onPress={() => setSelectedMethod('card')}
              >
                <View style={styles.methodHeader}>
                  <View style={[styles.iconBox, { backgroundColor: V4_COLORS.infoLight }]}>
                    <CreditCard size={20} color={V4_COLORS.info} />
                  </View>
                  <View style={styles.methodText}>
                    <Text style={styles.methodTitle}>Credit / Debit Cards</Text>
                    <Text style={styles.methodSubtitle}>Visa, Mastercard, RuPay, Amex</Text>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      selectedMethod === 'card' && styles.radioCircleActive,
                    ]}
                  />
                </View>
              </Pressable>

              {/* Net Banking */}
              <Pressable
                style={[
                  styles.methodCard,
                  selectedMethod === 'netbanking' && styles.methodCardActive,
                ]}
                onPress={() => setSelectedMethod('netbanking')}
              >
                <View style={styles.methodHeader}>
                  <View style={[styles.iconBox, { backgroundColor: V4_COLORS.purpleLight }]}>
                    <Building2 size={20} color={V4_COLORS.purple} />
                  </View>
                  <View style={styles.methodText}>
                    <Text style={styles.methodTitle}>Net Banking</Text>
                    <Text style={styles.methodSubtitle}>All Major Indian Banks Supported</Text>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      selectedMethod === 'netbanking' && styles.radioCircleActive,
                    ]}
                  />
                </View>
              </Pressable>

              {/* Security Shield Note */}
              <View style={styles.securityNote}>
                <ShieldCheck size={16} color={V4_COLORS.primary} />
                <Text style={styles.securityText}>
                  256-bit Bank Grade Encrypted • RBI Payment Aggregator Gateway
                </Text>
              </View>

              {/* Submit Pay Button */}
              <Pressable
                style={[styles.payButton, processing && styles.payButtonDisabled]}
                onPress={handlePayNow}
                disabled={processing}
                accessibilityRole="button"
              >
                {processing ? (
                  <ActivityIndicator size="small" color={V4_COLORS.textWhite} />
                ) : (
                  <>
                    <Lock size={16} color={V4_COLORS.textWhite} />
                    <Text style={styles.payButtonText}>
                      Pay ₹{amount.toLocaleString()} Securely
                    </Text>
                  </>
                )}
              </Pressable>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

export const V4PaymentCheckoutModal = React.memo(V4PaymentCheckoutModalComponent);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: V4_COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    maxHeight: '90%',
    ...V4_SHADOWS.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: V4_COLORS.borderLight,
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: V4_RADIUS.full,
    backgroundColor: V4_COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownCard: {
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderRadius: V4_RADIUS.lg,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  breakdownLabel: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
  },
  freeBadge: {
    backgroundColor: V4_COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: V4_RADIUS.xs,
  },
  freeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: V4_COLORS.success,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: V4_COLORS.border,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  cashbackPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: V4_RADIUS.sm,
    marginTop: 10,
    gap: 6,
  },
  cashbackPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.primary,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  methodCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: V4_COLORS.border,
    padding: 14,
    marginBottom: 12,
  },
  methodCardActive: {
    borderColor: V4_COLORS.primary,
    backgroundColor: '#F0FDFA',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: V4_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodText: {
    flex: 1,
    marginLeft: 12,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  methodSubtitle: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: V4_COLORS.borderDark,
  },
  radioCircleActive: {
    borderColor: V4_COLORS.primary,
    borderWidth: 6,
  },
  upiAppsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: V4_COLORS.borderLight,
  },
  upiAppPill: {
    flex: 1,
    minHeight: 44,
    borderRadius: V4_RADIUS.md,
    backgroundColor: V4_COLORS.surface,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upiAppPillActive: {
    borderColor: V4_COLORS.primary,
    backgroundColor: V4_COLORS.primaryLight,
  },
  upiAppText: {
    fontSize: 10,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  upiAppTextActive: {
    color: V4_COLORS.primary,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 14,
  },
  securityText: {
    fontSize: 10,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    backgroundColor: V4_COLORS.primary,
    borderRadius: V4_RADIUS.lg,
    gap: 8,
    ...V4_SHADOWS.md,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textWhite,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  successIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: V4_COLORS.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  successAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: V4_COLORS.primary,
    marginVertical: 6,
  },
  successSubtitle: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    marginBottom: 16,
  },
  cashbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: V4_RADIUS.full,
    marginBottom: 24,
    gap: 8,
  },
  cashbackText: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.primary,
  },
  doneButton: {
    width: '100%',
    minHeight: 50,
    backgroundColor: V4_COLORS.primary,
    borderRadius: V4_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: V4_COLORS.textWhite,
  },
});
