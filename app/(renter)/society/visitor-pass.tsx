import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Share,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  UserCheck,
  QrCode,
  Share2,
  Clock,
  Car,
  CheckCircle2,
  XCircle,
  Plus,
  Copy,
  Calendar,
  Shield,
  Trash2,
  Users,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../src/theme/v4Theme';
import { triggerHapticFeedback } from '../../../src/utils/haptics';
import { VisitorPassRecord } from '../../../src/types';

export default function VisitorPassRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    properties,
    leaseAgreements,
    visitorPasses,
    fetchVisitorPasses,
    createVisitorPass,
    showToast,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'create' | 'active' | 'history'>('create');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorType, setVisitorType] = useState<VisitorPassRecord['visitor_type']>('guest');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [purpose, setPurpose] = useState('Casual Visit / Guest');
  const [durationHours, setDurationHours] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPass, setCreatedPass] = useState<VisitorPassRecord | null>(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

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
    fetchVisitorPasses();
  }, []);

  const handleCreatePass = async () => {
    if (!visitorName.trim()) {
      showToast?.('Please enter visitor name', 'error');
      triggerHapticFeedback('notificationError');
      return;
    }

    setIsSubmitting(true);
    triggerHapticFeedback('impactMedium');

    const validFrom = new Date();
    const validUntil = new Date(Date.now() + durationHours * 3600 * 1000);

    const res = await createVisitorPass({
      visitor_name: visitorName.trim(),
      visitor_phone: visitorPhone.trim() || undefined,
      visitor_type: visitorType,
      purpose: purpose.trim() || undefined,
      vehicle_number: vehicleNumber.trim() ? vehicleNumber.toUpperCase().trim() : undefined,
      unit_number: unitNumber,
      society_name: societyName,
      valid_from: validFrom.toISOString(),
      valid_until: validUntil.toISOString(),
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      triggerHapticFeedback('notificationSuccess');
      setCreatedPass(res.data);
      setSuccessModalVisible(true);
      setVisitorName('');
      setVisitorPhone('');
      setVehicleNumber('');
      showToast?.('Visitor pass issued successfully!', 'success');
    } else {
      triggerHapticFeedback('notificationError');
      showToast?.(res.error || 'Failed to generate pass', 'error');
    }
  };

  const handleSharePass = async (pass: VisitorPassRecord) => {
    triggerHapticFeedback('selection');
    try {
      const shareMsg = `🏢 *REHVO Gate Entry Pass*\n\n` +
        `Hi ${pass.visitor_name},\n` +
        `You have been invited to visit:\n` +
        `📍 *${pass.society_name || societyName}*\n` +
        `🏠 Unit: *${pass.unit_number || unitNumber}*\n\n` +
        `🔐 *Entry PIN: ${pass.pass_code}*\n` +
        `⏰ Valid Until: ${new Date(pass.valid_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n\n` +
        `Show this PIN or QR at the security gate for quick check-in.`;

      await Share.share({ message: shareMsg });
    } catch {
      // Ignored
    }
  };

  const activePasses = useMemo(
    () => visitorPasses.filter((p) => p.status === 'approved' || p.status === 'checked_in'),
    [visitorPasses]
  );

  const pastPasses = useMemo(
    () => visitorPasses.filter((p) => p.status === 'checked_out' || p.status === 'expired' || p.status === 'rejected'),
    [visitorPasses]
  );

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
          <Text style={styles.headerTitle}>Visitor Entry Pass</Text>
          <Text style={styles.headerSubtitle}>{societyName} • {unitNumber}</Text>
        </View>
      </View>

      {/* Segment Tabs */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabBtn, activeTab === 'create' && styles.tabBtnActive]}
          onPress={() => {
            triggerHapticFeedback('selection');
            setActiveTab('create');
          }}
        >
          <Plus size={16} color={activeTab === 'create' ? '#0F766E' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'create' && styles.tabTextActive]}>New Pass</Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, activeTab === 'active' && styles.tabBtnActive]}
          onPress={() => {
            triggerHapticFeedback('selection');
            setActiveTab('active');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            Active ({activePasses.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, activeTab === 'history' && styles.tabBtnActive]}
          onPress={() => {
            triggerHapticFeedback('selection');
            setActiveTab('history');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>History</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* TAB 1: CREATE PASS */}
        {activeTab === 'create' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.badgeIconBox}>
                <UserCheck size={20} color="#0F766E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Pre-Approve Visitor</Text>
                <Text style={styles.cardSubtitle}>Security gate will verify PIN instantly</Text>
              </View>
            </View>

            {/* Visitor Type Selector */}
            <Text style={styles.inputLabel}>VISITOR TYPE</Text>
            <View style={styles.pillRow}>
              {[
                { type: 'guest', label: 'Guest' },
                { type: 'cab', label: 'Cab / Driver' },
                { type: 'service', label: 'Service' },
                { type: 'delivery', label: 'Delivery' },
                { type: 'other', label: 'Other' },
              ].map((item) => (
                <Pressable
                  key={item.type}
                  style={[styles.pill, visitorType === item.type && styles.pillActive]}
                  onPress={() => {
                    triggerHapticFeedback('selection');
                    setVisitorType(item.type as any);
                    if (item.type === 'cab') setPurpose('Cab Pick / Drop');
                    else if (item.type === 'service') setPurpose('Home Maintenance / Repair');
                    else if (item.type === 'guest') setPurpose('Casual Visit / Guest');
                  }}
                >
                  <Text style={[styles.pillText, visitorType === item.type && styles.pillTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Visitor Name */}
            <Text style={styles.inputLabel}>VISITOR FULL NAME *</Text>
            <TextInput
              style={styles.input}
              value={visitorName}
              onChangeText={setVisitorName}
              placeholder="e.g. Rahul Sharma"
              placeholderTextColor="#94A3B8"
            />

            {/* Visitor Phone */}
            <Text style={styles.inputLabel}>MOBILE NUMBER (OPTIONAL)</Text>
            <TextInput
              style={styles.input}
              value={visitorPhone}
              onChangeText={setVisitorPhone}
              placeholder="e.g. 9876543210"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              maxLength={10}
            />

            {/* Purpose */}
            <Text style={styles.inputLabel}>PURPOSE OF VISIT</Text>
            <TextInput
              style={styles.input}
              value={purpose}
              onChangeText={setPurpose}
              placeholder="e.g. Dinner, Package Delivery, AC Servicing"
              placeholderTextColor="#94A3B8"
            />

            {/* Vehicle Number */}
            <Text style={styles.inputLabel}>VEHICLE NUMBER (OPTIONAL)</Text>
            <TextInput
              style={styles.input}
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
              placeholder="e.g. KA-01-AB-1234"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
            />

            {/* Duration Selector */}
            <Text style={styles.inputLabel}>VALIDITY DURATION</Text>
            <View style={styles.pillRow}>
              {[
                { hours: 2, label: '2 Hours' },
                { hours: 4, label: '4 Hours' },
                { hours: 8, label: '8 Hours' },
                { hours: 24, label: '24 Hours' },
              ].map((d) => (
                <Pressable
                  key={d.hours}
                  style={[styles.pill, durationHours === d.hours && styles.pillActive]}
                  onPress={() => {
                    triggerHapticFeedback('selection');
                    setDurationHours(d.hours);
                  }}
                >
                  <Text style={[styles.pillText, durationHours === d.hours && styles.pillTextActive]}>
                    {d.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Submit Button */}
            <Pressable
              style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
              disabled={isSubmitting}
              onPress={handleCreatePass}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Generate Entry Pass</Text>
              )}
            </Pressable>
          </View>
        )}

        {/* TAB 2: ACTIVE PASSES */}
        {activeTab === 'active' && (
          <View style={{ gap: 12 }}>
            {activePasses.length === 0 ? (
              <View style={styles.emptyCard}>
                <Shield size={44} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No Active Passes</Text>
                <Text style={styles.emptySubtitle}>Generate a pass for upcoming visitors or cabs</Text>
                <Pressable
                  style={styles.emptyBtn}
                  onPress={() => {
                    triggerHapticFeedback('selection');
                    setActiveTab('create');
                  }}
                >
                  <Text style={styles.emptyBtnText}>Create New Pass</Text>
                </Pressable>
              </View>
            ) : (
              activePasses.map((pass) => (
                <View key={pass.id} style={styles.passCard}>
                  <View style={styles.passCardTop}>
                    <View style={styles.passIconBox}>
                      <UserCheck size={22} color="#0F766E" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.passName}>{pass.visitor_name}</Text>
                      <Text style={styles.passSubtext}>
                        {pass.visitor_type.toUpperCase()} • {pass.purpose || 'Visit'}
                      </Text>
                    </View>
                    <View style={styles.approvedBadge}>
                      <Text style={styles.approvedBadgeText}>ACTIVE</Text>
                    </View>
                  </View>

                  {/* Passcode Box */}
                  <View style={styles.codeBox}>
                    <Text style={styles.codeLabel}>ENTRY PASSCODE</Text>
                    <Text style={styles.codeDigits}>{pass.pass_code}</Text>
                    <Text style={styles.codeValidity}>
                      Valid until {new Date(pass.valid_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>

                  {/* Actions */}
                  <View style={styles.passActionsRow}>
                    <Pressable
                      style={styles.shareBtn}
                      onPress={() => handleSharePass(pass)}
                    >
                      <Share2 size={16} color="#0F766E" />
                      <Text style={styles.shareBtnText}>Share on WhatsApp</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* TAB 3: HISTORY */}
        {activeTab === 'history' && (
          <View style={{ gap: 12 }}>
            {pastPasses.length === 0 ? (
              <View style={styles.emptyCard}>
                <Clock size={44} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No Past Passes</Text>
                <Text style={styles.emptySubtitle}>Completed and expired passes will appear here</Text>
              </View>
            ) : (
              pastPasses.map((pass) => (
                <View key={pass.id} style={styles.historyCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyName}>{pass.visitor_name}</Text>
                    <Text style={styles.historySub}>
                      {pass.visitor_type} • {new Date(pass.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.historyStatus}>
                    <Text style={styles.historyStatusText}>{pass.status.toUpperCase()}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalCheckCircle}>
              <CheckCircle2 size={36} color="#10B981" />
            </View>
            <Text style={styles.modalSuccessTitle}>Pass Generated!</Text>
            <Text style={styles.modalSuccessSubtitle}>
              Share this 6-digit entry PIN with {createdPass?.visitor_name}
            </Text>

            <View style={styles.modalPinBox}>
              <Text style={styles.modalPinText}>{createdPass?.pass_code}</Text>
            </View>

            <Text style={styles.modalInfoText}>
              Security gate at {createdPass?.society_name || societyName} will allow entry upon entering this code.
            </Text>

            <Pressable
              style={styles.modalShareBtn}
              onPress={() => {
                if (createdPass) handleSharePass(createdPass);
              }}
            >
              <Share2 size={18} color="#FFFFFF" />
              <Text style={styles.modalShareBtnText}>Share via WhatsApp</Text>
            </Pressable>

            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => {
                triggerHapticFeedback('selection');
                setSuccessModalVisible(false);
                setActiveTab('active');
              }}
            >
              <Text style={styles.modalCloseBtnText}>Done</Text>
            </Pressable>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
    gap: 6,
    backgroundColor: '#F1F5F9',
  },
  tabBtnActive: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#0F766E',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0F766E',
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  badgeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.6,
    marginTop: 14,
    marginBottom: 6,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    minHeight: 46,
  },
  submitBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    ...V4_SHADOWS.card,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  passCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
    ...V4_SHADOWS.card,
  },
  passCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  passIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  passSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  approvedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  approvedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  codeBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.8,
  },
  codeDigits: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 4,
    marginVertical: 4,
  },
  codeValidity: {
    fontSize: 11,
    color: '#0F766E',
    fontWeight: '600',
  },
  passActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 10,
    height: 42,
    gap: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  emptyBtn: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 16,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  historySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  historyStatus: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  historyStatusText: {
    fontSize: 10,
    fontWeight: '700',
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
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalCheckCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalSuccessTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSuccessSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  modalPinBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 28,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#0F766E',
  },
  modalPinText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 6,
  },
  modalInfoText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 20,
  },
  modalShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 14,
    width: '100%',
    height: 50,
    gap: 8,
  },
  modalShareBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalCloseBtn: {
    width: '100%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  modalCloseBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
});
