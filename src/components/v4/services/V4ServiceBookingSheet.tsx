import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Tag,
  CreditCard,
  Wallet,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { triggerHapticFeedback } from '../../../utils/haptics';
import { useAppStore } from '../../../store/useAppStore';

interface V4ServiceBookingSheetProps {
  visible: boolean;
  onClose: () => void;
  serviceName: string;
  categoryId?: string;
  basePrice: number;
  defaultAddress?: string;
  technicianId?: string;
  onBookingSuccess?: (bookingId: string) => void;
}

export const V4ServiceBookingSheet: React.FC<V4ServiceBookingSheetProps> = ({
  visible,
  onClose,
  serviceName,
  categoryId,
  basePrice,
  defaultAddress = 'Tower 4, Flat 1204, Prestige Green Gables',
  technicianId,
  onBookingSuccess,
}) => {
  const { bookHomeService, wallet, user, showToast } = useAppStore();

  const [selectedDay, setSelectedDay] = useState('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState('09:00 AM - 12:00 PM');
  const [address, setAddress] = useState(defaultAddress);
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'wallet' | 'card'>('upi');
  const [isBooking, setIsBooking] = useState(false);

  const walletBalance = wallet?.balance ?? user?.walletBalance ?? 0;

  const platformFee = 29;
  const subtotal = basePrice + platformFee;
  const tax = Math.round(subtotal * 0.18);
  const totalAmount = Math.max(0, subtotal + tax - discount);

  const applyCoupon = () => {
    triggerHapticFeedback('selection');
    if (couponCode.toUpperCase().trim() === 'REHVO50') {
      setDiscount(50);
      setCouponApplied(true);
      showToast?.('Coupon REHVO50 applied! ₹50 OFF', 'success');
    } else if (couponCode.toUpperCase().trim() === 'FIRST100') {
      setDiscount(100);
      setCouponApplied(true);
      showToast?.('Coupon FIRST100 applied! ₹100 OFF', 'success');
    } else {
      showToast?.('Invalid coupon code. Try REHVO50', 'error');
    }
  };

  const handleBook = async () => {
    if (!address.trim()) {
      showToast?.('Please confirm service address', 'error');
      triggerHapticFeedback('notificationError');
      return;
    }

    setIsBooking(true);
    triggerHapticFeedback('impactMedium');

    const scheduledDate =
      selectedDay === 'Today'
        ? new Date().toISOString().split('T')[0]
        : new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const res = await bookHomeService({
      category_id: categoryId,
      service_type: serviceName,
      technician_id: technicianId,
      scheduled_date: scheduledDate,
      time_slot: selectedSlot,
      address: address.trim(),
      amount: totalAmount,
      payment_method: paymentMethod,
      notes: notes.trim() || undefined,
    });

    setIsBooking(false);

    if (res.success && res.data) {
      triggerHapticFeedback('notificationSuccess');
      showToast?.(`Booking confirmed for ${serviceName}! 2% R-Cash cashback credited.`, 'success');
      onClose();
      if (onBookingSuccess) {
        onBookingSuccess(res.data.id);
      }
    } else {
      triggerHapticFeedback('notificationError');
      showToast?.(res.error || 'Booking failed. Please try again.', 'error');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Book {serviceName}</Text>
              <Text style={styles.subtitle}>REHVO Assured • 30-Day Rework Warranty</Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={10}>
              <X size={20} color="#64748B" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {/* Day Selector */}
            <Text style={styles.sectionLabel}>CHOOSE DATE</Text>
            <View style={styles.pillRow}>
              {['Today', 'Tomorrow', 'In 2 Days'].map((day) => (
                <Pressable
                  key={day}
                  style={[styles.pill, selectedDay === day && styles.pillActive]}
                  onPress={() => {
                    triggerHapticFeedback('selection');
                    setSelectedDay(day);
                  }}
                >
                  <Text style={[styles.pillText, selectedDay === day && styles.pillTextActive]}>
                    {day}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Time Slot */}
            <Text style={styles.sectionLabel}>TIME SLOT</Text>
            <View style={styles.slotGrid}>
              {[
                '09:00 AM - 12:00 PM',
                '12:00 PM - 03:00 PM',
                '03:00 PM - 06:00 PM',
                '06:00 PM - 09:00 PM',
              ].map((slot) => (
                <Pressable
                  key={slot}
                  style={[styles.slotCard, selectedSlot === slot && styles.slotCardActive]}
                  onPress={() => {
                    triggerHapticFeedback('selection');
                    setSelectedSlot(slot);
                  }}
                >
                  <Clock size={14} color={selectedSlot === slot ? '#0F766E' : '#64748B'} />
                  <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive]}>
                    {slot}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Address Confirmation */}
            <Text style={styles.sectionLabel}>SERVICE ADDRESS</Text>
            <View style={styles.addressBox}>
              <MapPin size={18} color="#0F766E" />
              <TextInput
                style={styles.addressInput}
                value={address}
                onChangeText={setAddress}
                placeholder="Apartment, Tower, Society Name, Locality"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Special Instructions */}
            <Text style={styles.sectionLabel}>SPECIAL INSTRUCTIONS (OPTIONAL)</Text>
            <TextInput
              style={styles.input}
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g. Ring bell twice, bring tall ladder"
              placeholderTextColor="#94A3B8"
            />

            {/* Coupon Code */}
            <Text style={styles.sectionLabel}>APPLY COUPON</Text>
            <View style={styles.couponRow}>
              <Tag size={16} color="#0F766E" />
              <TextInput
                style={styles.couponInput}
                value={couponCode}
                onChangeText={setCouponCode}
                placeholder="Enter promo code (e.g. REHVO50)"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
              />
              <Pressable style={styles.couponBtn} onPress={applyCoupon}>
                <Text style={styles.couponBtnText}>Apply</Text>
              </Pressable>
            </View>

            {/* Payment Method */}
            <Text style={styles.sectionLabel}>PAYMENT METHOD</Text>
            <View style={styles.paymentMethodRow}>
              {[
                { id: 'upi', label: 'UPI / QR', icon: CreditCard },
                { id: 'wallet', label: `R-Cash (₹${walletBalance})`, icon: Wallet },
                { id: 'card', label: 'Card', icon: CreditCard },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <Pressable
                    key={m.id}
                    style={[styles.payMethodPill, paymentMethod === m.id && styles.payMethodPillActive]}
                    onPress={() => {
                      triggerHapticFeedback('selection');
                      setPaymentMethod(m.id as any);
                    }}
                  >
                    <Icon size={14} color={paymentMethod === m.id ? '#0F766E' : '#64748B'} />
                    <Text style={[styles.payMethodText, paymentMethod === m.id && styles.payMethodTextActive]}>
                      {m.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Price Breakdown */}
            <View style={styles.breakdownBox}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Service Base Price</Text>
                <Text style={styles.breakdownVal}>₹{basePrice}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Platform & Safety Fee</Text>
                <Text style={styles.breakdownVal}>₹{platformFee}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>GST (18%)</Text>
                <Text style={styles.breakdownVal}>₹{tax}</Text>
              </View>
              {discount > 0 && (
                <View style={styles.breakdownRow}>
                  <Text style={[styles.breakdownLabel, { color: '#059669' }]}>Coupon Discount</Text>
                  <Text style={[styles.breakdownVal, { color: '#059669' }]}>-₹{discount}</Text>
                </View>
              )}
              <View style={styles.breakdownDivider} />
              <View style={styles.breakdownRow}>
                <Text style={styles.totalLabel}>Total Payable</Text>
                <Text style={styles.totalVal}>₹{totalAmount}</Text>
              </View>
            </View>

            {/* Submit Button */}
            <Pressable
              style={[styles.bookBtn, isBooking && { opacity: 0.6 }]}
              disabled={isBooking}
              onPress={handleBook}
            >
              {isBooking ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.bookBtnText}>
                  Confirm & Book • ₹{totalAmount}
                </Text>
              )}
            </Pressable>

            <View style={styles.assuranceRow}>
              <ShieldCheck size={14} color="#0F766E" />
              <Text style={styles.assuranceText}>
                No cancellation fee up to 2 hours before scheduled slot.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#0F766E',
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    padding: 20,
    gap: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.6,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  pillActive: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  pillTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  slotGrid: {
    gap: 8,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 8,
    minHeight: 44,
  },
  slotCardActive: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  slotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  slotTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    gap: 8,
  },
  addressInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    height: 46,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 46,
    fontSize: 13,
    color: '#0F172A',
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    gap: 8,
  },
  couponInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    height: 46,
    fontWeight: '700',
  },
  couponBtn: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  couponBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  paymentMethodRow: {
    flexDirection: 'row',
    gap: 8,
  },
  payMethodPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  payMethodPillActive: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  payMethodText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  payMethodTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  breakdownBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    gap: 8,
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
  breakdownDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F766E',
  },
  bookBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...V4_SHADOWS.card,
  },
  bookBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  assuranceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  assuranceText: {
    fontSize: 11,
    color: '#64748B',
  },
});
