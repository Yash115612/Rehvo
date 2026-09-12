// ==============================================================================
// REHVO V5.5 — SOCIETY ENTRY PASS & GATE SECURITY (PRODUCTION)
// Instant QR & 6-Digit Passcodes, Guest Invites, Delivery & Cab Entry Passes,
// Realtime Status Tracking, Sharing & Pass History
// ==============================================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Share,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  QrCode,
  Plus,
  Share2,
  X,
  CheckCircle2,
  Clock,
  Car,
  Package,
  Users,
  Wrench,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle,
  Copy,
  Ban,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { SocietyEntryPassRecord, SocietyPassType } from '../../../types';

export const V4SocietyPassScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    isAuthenticated,
    societyPasses,
    fetchSocietyPasses,
    createSocietyPass,
    cancelSocietyPass,
    showToast,
    properties,
    leaseAgreements,
  } = useAppStore();

  const activeLease = useMemo(
    () => leaseAgreements?.find((l) => l.status === 'active') || leaseAgreements?.[0],
    [leaseAgreements]
  );
  const activeProperty = useMemo(
    () => properties?.find((p) => p.id === activeLease?.property_id) || properties?.[0],
    [properties, activeLease]
  );

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPass, setSelectedPass] = useState<SocietyEntryPassRecord | null>(null);
  const [passViewerVisible, setPassViewerVisible] = useState(false);

  // Form State
  const [passType, setPassType] = useState<SocietyPassType>('guest');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [validHours, setValidHours] = useState(6);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSocietyPasses();
    }
  }, [isAuthenticated, fetchSocietyPasses]);

  const activePasses = useMemo(() => {
    return societyPasses.filter((p) => p.status === 'active');
  }, [societyPasses]);

  const historyPasses = useMemo(() => {
    return societyPasses.filter((p) => p.status !== 'active');
  }, [societyPasses]);

  const handleOpenCreate = useCallback((type: SocietyPassType = 'guest') => {
    setPassType(type);
    setVisitorName('');
    setVisitorPhone('');
    setCompanyName(type === 'delivery' ? 'Swiggy' : type === 'cab' ? 'Uber' : '');
    setVehicleNumber('');
    setValidHours(type === 'delivery' ? 2 : type === 'cab' ? 2 : 6);
    setModalVisible(true);
  }, []);

  const handleCreatePass = useCallback(async () => {
    if (!visitorName.trim()) {
      showToast?.('Please enter visitor name', 'error');
      return;
    }
    if (!isAuthenticated) {
      showToast?.('Sign in to generate entry passes', 'info');
      return;
    }

    setIsSubmitting(true);
    const res = await createSocietyPass({
      property_id: activeProperty?.id,
      pass_type: passType,
      visitor_name: visitorName.trim(),
      visitor_phone: visitorPhone.trim() || undefined,
      company_name: companyName.trim() || undefined,
      vehicle_number: vehicleNumber.trim() || undefined,
      valid_hours: validHours,
    });
    setIsSubmitting(false);

    if (res.success && res.data) {
      setModalVisible(false);
      setSelectedPass(res.data);
      setPassViewerVisible(true);
    }
  }, [
    visitorName,
    visitorPhone,
    companyName,
    vehicleNumber,
    validHours,
    passType,
    isAuthenticated,
    activeProperty?.id,
    createSocietyPass,
    showToast,
  ]);

  const handleCancelPass = useCallback(async (passId: string) => {
    const res = await cancelSocietyPass(passId);
    if (res.success) {
      if (selectedPass?.id === passId) {
        setPassViewerVisible(false);
      }
    }
  }, [cancelSocietyPass, selectedPass?.id]);

  const handleSharePass = useCallback((pass: SocietyEntryPassRecord) => {
    const message = `🎟️ REHVO Society Entry Pass\nSociety: ${activeProperty?.title || 'Residential Society'}\nVisitor: ${pass.visitor_name}\nPass Type: ${pass.pass_type.toUpperCase()}\nAccess Code: ${pass.access_code}\nValid until: ${new Date(pass.valid_to).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\nShow this code at the security gate for quick check-in.`;
    Share.share({ message });
  }, [activeProperty?.title]);

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) + 4 }]}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>Society Entry Pass</Text>
          <Text style={styles.headerSubtitle}>Digital Visitor Passcodes & Security ERP</Text>
        </View>
        <Pressable
          style={styles.headerNewBtn}
          onPress={() => handleOpenCreate('guest')}
          accessibilityRole="button"
          accessibilityLabel="Generate new pass"
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.headerNewBtnTxt}>New Pass</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. SOCIETY INFO CARD */}
        <View style={styles.societyCard}>
          <View style={styles.societyIconBox}>
            <Building2 size={22} color="#0F766E" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.societyTitle}>{activeProperty?.title || 'Palisades Luxury Residences'}</Text>
            <Text style={styles.societyLocality}>
              {activeProperty?.locality ? `${activeProperty.locality}, ${activeProperty.city}` : 'Bandra West, Mumbai'}
            </Text>
          </View>
          <View style={styles.societyStatusBadge}>
            <ShieldCheck size={12} color="#16A34A" />
            <Text style={styles.societyStatusTxt}>Gate Active</Text>
          </View>
        </View>

        {/* 3. QUICK PASS CREATION BUTTONS */}
        <View style={styles.quickCreateSection}>
          <Text style={styles.sectionTitle}>QUICK GENERATE PASS</Text>
          <View style={styles.quickGrid}>
            {[
              { type: 'guest' as const, label: 'Guest Invite', icon: Users, color: '#0F766E', bg: '#CCFBF1' },
              { type: 'delivery' as const, label: 'Delivery Pass', icon: Package, color: '#D97706', bg: '#FEF3C7' },
              { type: 'cab' as const, label: 'Cab Entry', icon: Car, color: '#2563EB', bg: '#DBEAFE' },
              { type: 'service' as const, label: 'Home Service', icon: Wrench, color: '#7C3AED', bg: '#EDE9FE' },
            ].map((q) => {
              const Icon = q.icon;
              return (
                <Pressable
                  key={q.type}
                  style={styles.quickCard}
                  onPress={() => handleOpenCreate(q.type)}
                  accessibilityRole="button"
                >
                  <View style={[styles.quickIconBox, { backgroundColor: q.bg }]}>
                    <Icon size={20} color={q.color} />
                  </View>
                  <Text style={styles.quickLabel}>{q.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 4. TABS: ACTIVE VS HISTORY */}
        <View style={styles.tabsRow}>
          <Pressable
            style={[styles.tabBtn, activeTab === 'active' && styles.tabBtnActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabBtnTxt, activeTab === 'active' && styles.tabBtnTxtActive]}>
              Active Passes ({activePasses.length})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, activeTab === 'history' && styles.tabBtnActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabBtnTxt, activeTab === 'history' && styles.tabBtnTxtActive]}>
              History ({historyPasses.length})
            </Text>
          </Pressable>
        </View>

        {/* 5. PASSES LIST */}
        {activeTab === 'active' ? (
          activePasses.length === 0 ? (
            <View style={styles.emptyCard}>
              <QrCode size={36} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No active entry passes</Text>
              <Text style={styles.emptySub}>
                Generate an instant pass for your guests, delivery drivers, or Uber cabs to clear the security gate smoothly.
              </Text>
              <Pressable
                style={styles.emptyCtaBtn}
                onPress={() => handleOpenCreate('guest')}
              >
                <Plus size={16} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.emptyCtaTxt}>Invite Guest</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.passList}>
              {activePasses.map((p) => (
                <Pressable
                  key={p.id}
                  style={styles.passCard}
                  onPress={() => {
                    setSelectedPass(p);
                    setPassViewerVisible(true);
                  }}
                  accessibilityRole="button"
                >
                  <View style={styles.passLeftBadge}>
                    <QrCode size={26} color="#0F766E" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.passNameRow}>
                      <Text style={styles.passName}>{p.visitor_name}</Text>
                      <View style={styles.passTypePill}>
                        <Text style={styles.passTypeTxt}>{p.pass_type.toUpperCase()}</Text>
                      </View>
                    </View>
                    <Text style={styles.passCompany}>
                      {p.company_name ? `${p.company_name} • ` : ''}{p.vehicle_number ? `Vehicle: ${p.vehicle_number}` : 'Pedestrian Entry'}
                    </Text>
                    <View style={styles.passCodeRow}>
                      <Text style={styles.passCodeLabel}>CODE: </Text>
                      <Text style={styles.passCodeValue}>{p.access_code}</Text>
                    </View>
                  </View>
                  <Pressable
                    style={styles.passShareBtn}
                    onPress={() => handleSharePass(p)}
                    accessibilityLabel="Share pass"
                  >
                    <Share2 size={16} color="#0F766E" />
                  </Pressable>
                </Pressable>
              ))}
            </View>
          )
        ) : historyPasses.length === 0 ? (
          <View style={styles.emptyCard}>
            <Clock size={32} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No pass history yet</Text>
            <Text style={styles.emptySub}>Expired and used society passes will appear here.</Text>
          </View>
        ) : (
          <View style={styles.passList}>
            {historyPasses.map((p) => (
              <View key={p.id} style={[styles.passCard, { opacity: 0.75 }]}>
                <View style={[styles.passLeftBadge, { backgroundColor: '#F1F5F9' }]}>
                  <CheckCircle2 size={22} color="#64748B" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.passName}>{p.visitor_name}</Text>
                  <Text style={styles.passCompany}>{p.company_name || p.pass_type.toUpperCase()}</Text>
                  <Text style={styles.historyDate}>
                    Status: {p.status.toUpperCase()} • {new Date(p.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* CREATE PASS MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Issue Entry Pass</Text>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Close modal"
              >
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* PASS TYPE CHIPS */}
              <Text style={styles.modalLabel}>PASS CATEGORY</Text>
              <View style={styles.typeRow}>
                {[
                  { id: 'guest' as const, label: 'Guest' },
                  { id: 'delivery' as const, label: 'Delivery' },
                  { id: 'cab' as const, label: 'Cab' },
                  { id: 'service' as const, label: 'Service' },
                ].map((t) => (
                  <Pressable
                    key={t.id}
                    style={[styles.typeSelectChip, passType === t.id && styles.typeSelectChipActive]}
                    onPress={() => {
                      setPassType(t.id);
                      if (t.id === 'delivery' && !companyName) setCompanyName('Swiggy');
                      if (t.id === 'cab' && !companyName) setCompanyName('Uber');
                    }}
                  >
                    <Text style={[styles.typeSelectTxt, passType === t.id && styles.typeSelectTxtActive]}>
                      {t.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.modalLabel}>VISITOR NAME *</Text>
              <TextInput
                style={styles.modalInput}
                value={visitorName}
                onChangeText={setVisitorName}
                placeholder="e.g. Rahul Verma or Delivery Agent"
                placeholderTextColor={V4_COLORS.textMuted}
              />

              <Text style={styles.modalLabel}>PHONE NUMBER (OPTIONAL)</Text>
              <TextInput
                style={styles.modalInput}
                value={visitorPhone}
                onChangeText={setVisitorPhone}
                placeholder="e.g. +91 98201 54321"
                placeholderTextColor={V4_COLORS.textMuted}
                keyboardType="phone-pad"
              />

              <Text style={styles.modalLabel}>COMPANY / SERVICE (OPTIONAL)</Text>
              <TextInput
                style={styles.modalInput}
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="e.g. Swiggy, Amazon, Urban Company"
                placeholderTextColor={V4_COLORS.textMuted}
              />

              <Text style={styles.modalLabel}>VEHICLE NUMBER (OPTIONAL)</Text>
              <TextInput
                style={styles.modalInput}
                value={vehicleNumber}
                onChangeText={setVehicleNumber}
                placeholder="e.g. MH 02 AB 1234"
                placeholderTextColor={V4_COLORS.textMuted}
                autoCapitalize="characters"
              />

              <Text style={styles.modalLabel}>VALIDITY DURATION</Text>
              <View style={styles.hoursRow}>
                {[2, 6, 12, 24].map((hrs) => (
                  <Pressable
                    key={hrs}
                    style={[styles.hourChip, validHours === hrs && styles.hourChipActive]}
                    onPress={() => setValidHours(hrs)}
                  >
                    <Text style={[styles.hourChipTxt, validHours === hrs && styles.hourChipTxtActive]}>
                      {hrs} Hours
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable
                style={[styles.createSubmitBtn, isSubmitting && { opacity: 0.7 }]}
                onPress={handleCreatePass}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.createSubmitTxt}>Generate Gate Pass</Text>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* PASS VIEWER MODAL */}
      <Modal
        visible={passViewerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPassViewerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.passTicketSheet}>
            <View style={styles.ticketTop}>
              <View style={styles.ticketLogoBox}>
                <Building2 size={24} color="#0F766E" />
              </View>
              <Text style={styles.ticketSociety}>{activeProperty?.title || 'Residential Society'}</Text>
              <Text style={styles.ticketPassType}>
                {selectedPass?.pass_type.toUpperCase()} ENTRY PASS
              </Text>
            </View>

            <View style={styles.qrCenterBox}>
              <QrCode size={130} color="#0F172A" />
              <View style={styles.ticketCodePill}>
                <Text style={styles.ticketCodeLabel}>GATE CODE: </Text>
                <Text style={styles.ticketCodeDigits}>{selectedPass?.access_code}</Text>
              </View>
            </View>

            <View style={styles.ticketDetails}>
              <View style={styles.ticketRow}>
                <Text style={styles.ticketRowLabel}>Visitor</Text>
                <Text style={styles.ticketRowVal}>{selectedPass?.visitor_name}</Text>
              </View>
              {selectedPass?.company_name ? (
                <View style={styles.ticketRow}>
                  <Text style={styles.ticketRowLabel}>Company</Text>
                  <Text style={styles.ticketRowVal}>{selectedPass.company_name}</Text>
                </View>
              ) : null}
              {selectedPass?.vehicle_number ? (
                <View style={styles.ticketRow}>
                  <Text style={styles.ticketRowLabel}>Vehicle</Text>
                  <Text style={styles.ticketRowVal}>{selectedPass.vehicle_number}</Text>
                </View>
              ) : null}
              <View style={styles.ticketRow}>
                <Text style={styles.ticketRowLabel}>Valid Until</Text>
                <Text style={styles.ticketRowVal}>
                  {selectedPass?.valid_to
                    ? new Date(selectedPass.valid_to).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </Text>
              </View>
            </View>

            <View style={styles.ticketActions}>
              <Pressable
                style={styles.shareTicketBtn}
                onPress={() => selectedPass && handleSharePass(selectedPass)}
              >
                <Share2 size={16} color="#FFFFFF" />
                <Text style={styles.shareTicketTxt}>Share Pass</Text>
              </Pressable>
              <Pressable
                style={styles.revokeTicketBtn}
                onPress={() => selectedPass && handleCancelPass(selectedPass.id)}
              >
                <Ban size={16} color="#DC2626" />
                <Text style={styles.revokeTicketTxt}>Revoke</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.closeTicketBtn}
              onPress={() => setPassViewerVisible(false)}
            >
              <Text style={styles.closeTicketTxt}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  headerNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
    minHeight: 44,
  },
  headerNewBtnTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 20,
  },
  societyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...V4_SHADOWS.sm,
  },
  societyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  societyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  societyLocality: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  societyStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  societyStatusTxt: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
  },
  quickCreateSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.7,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 76,
    justifyContent: 'center',
  },
  quickIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    ...V4_SHADOWS.sm,
  },
  tabBtnTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTxtActive: {
    fontWeight: '800',
    color: '#0F766E',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#334155',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 17,
  },
  emptyCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    minHeight: 44,
  },
  emptyCtaTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  passList: {
    gap: 10,
  },
  passCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...V4_SHADOWS.sm,
  },
  passLeftBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  passName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  passTypePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  passTypeTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
  },
  passCompany: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  passCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  passCodeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  passCodeValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 1,
  },
  passShareBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyDate: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 6,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeSelectChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  typeSelectChipActive: {
    backgroundColor: '#0F766E',
  },
  typeSelectTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  typeSelectTxtActive: {
    color: '#FFFFFF',
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    minHeight: 48,
  },
  hoursRow: {
    flexDirection: 'row',
    gap: 8,
  },
  hourChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  hourChipActive: {
    backgroundColor: '#0F766E',
  },
  hourChipTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  hourChipTxtActive: {
    color: '#FFFFFF',
  },
  createSubmitBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    minHeight: 48,
  },
  createSubmitTxt: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  passTicketSheet: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...V4_SHADOWS.lg,
  },
  ticketTop: {
    alignItems: 'center',
    marginBottom: 16,
  },
  ticketLogoBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  ticketSociety: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  ticketPassType: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 1,
    marginTop: 2,
  },
  qrCenterBox: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
  },
  ticketCodePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 12,
  },
  ticketCodeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  ticketCodeDigits: {
    fontSize: 20,
    fontWeight: '900',
    color: '#064E3B',
    letterSpacing: 2,
  },
  ticketDetails: {
    width: '100%',
    marginVertical: 16,
    gap: 8,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  ticketRowLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  ticketRowVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  ticketActions: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginTop: 4,
  },
  shareTicketBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
    minHeight: 48,
  },
  shareTicketTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  revokeTicketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
    minHeight: 48,
  },
  revokeTicketTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#DC2626',
  },
  closeTicketBtn: {
    marginTop: 12,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  closeTicketTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
});
