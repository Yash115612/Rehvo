import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ShieldCheck,
  Crown,
  FileText,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ArrowRightLeft,
  ChevronRight,
  Sparkles,
  Building2,
  Calendar,
  IndianRupee,
  Users,
  Compass,
  Briefcase,
  CheckCircle2,
  X,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { useAppStore } from '../../../store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const V4OwnerProfileScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    ownerProfile,
    ownerPlan,
    switchRole,
    logout,
    showToast,
  } = useAppStore();

  const [showSwitchModal, setShowSwitchModal] = useState(false);

  const handleRoleSelect = async (mode: 'renter' | 'owner') => {
    setShowSwitchModal(false);
    await switchRole(mode);
    if (mode === 'renter') {
      router.replace('/(renter)/home' as any);
    } else {
      router.replace('/(owner)/dashboard' as any);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of REHVO Host?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(renter)/home' as any);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ===================================================================
            1. OWNER BUSINESS IDENTITY CARD
           =================================================================== */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri:
                ownerProfile?.profile_photo ||
                user?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            }}
            style={styles.avatarImg}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.businessName}>
              {ownerProfile?.business_name || 'Emerald Luxury Stays'}
            </Text>
            <Text style={styles.ownerEmail}>
              {ownerProfile?.email || user?.email || 'host.emerald@rehvo.com'}
            </Text>

            <View style={styles.badgeRow}>
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={12} color="#065F46" />
                <Text style={styles.verifiedBadgeTxt}>VERIFIED LANDLORD</Text>
              </View>
              <View style={styles.yearsBadge}>
                <Text style={styles.yearsBadgeTxt}>2.5 Yrs on REHVO</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ===================================================================
            2. SWITCH TO MULTI-ROLE EXPERIENCE
           =================================================================== */}
        <Pressable style={styles.switchModeCard} onPress={() => setShowSwitchModal(true)}>
          <View style={styles.switchIconBox}>
            <ArrowRightLeft size={18} color="#0F766E" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchTitle}>Switch App Experience</Text>
            <Text style={styles.switchSub}>
              Switch seamlessly to Renter Mode
            </Text>
          </View>
          <ChevronRight size={18} color="#0F766E" />
        </Pressable>

        {/* ===================================================================
            3. SUBSCRIPTION PLAN SUMMARY
           =================================================================== */}
        <Text style={styles.sectionHeaderTitle}>SUBSCRIPTION & BILLING</Text>
        <Pressable
          style={styles.planCard}
          onPress={() => router.push('/(owner)/subscription' as any)}
        >
          <View style={styles.planIconBox}>
            <Crown size={22} color="#D97706" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.planTitleRow}>
              <Text style={styles.planName}>{ownerPlan?.plan_name || 'Pro Plan'}</Text>
              <View style={styles.activePlanBadge}>
                <Text style={styles.activePlanTxt}>ACTIVE</Text>
              </View>
            </View>
            <Text style={styles.planSubtitle}>
              ₹{ownerPlan?.price || 599}/month • Renews on Oct 1, 2026
            </Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </Pressable>

        {/* ===================================================================
            4. BUSINESS SPECIFICATIONS & METRICS
           =================================================================== */}
        <Text style={styles.sectionHeaderTitle}>BUSINESS VERIFICATION</Text>
        <View style={styles.specsCard}>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>GST Number</Text>
            <Text style={styles.specVal}>{ownerProfile?.gst_number || '27AABCE1234F1Z5'}</Text>
          </View>
          <View style={styles.specDivider} />
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Response Rate</Text>
            <Text style={styles.specVal}>{ownerProfile?.response_rate || 98.5}%</Text>
          </View>
          <View style={styles.specDivider} />
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Average Reply Time</Text>
            <Text style={styles.specVal}>{ownerProfile?.avg_reply_time || '15 mins'}</Text>
          </View>
          <View style={styles.specDivider} />
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>KYC Status</Text>
            <Text style={[styles.specVal, { color: '#059669' }]}>
              {ownerProfile?.kyc_status || 'VERIFIED'}
            </Text>
          </View>
        </View>

        {/* ===================================================================
            5. OWNER OPERATIONS MENU
           =================================================================== */}
        <Text style={styles.sectionHeaderTitle}>TOOLS & SETTINGS</Text>
        <View style={styles.menuCard}>
          <Pressable
            style={styles.menuRow}
            onPress={() => router.push('/(renter)/owner-documents' as any)}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#F1F5F9' }]}>
              <FileText size={18} color="#475569" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>Document Center</Text>
              <Text style={styles.menuSub}>Deeds, E-Leases & tenant KYC proofs</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable
            style={styles.menuRow}
            onPress={() => router.push('/(renter)/owner-notifications' as any)}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#F0FDFA' }]}>
              <Bell size={18} color="#0F766E" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>Notification Preferences</Text>
              <Text style={styles.menuSub}>SMS, WhatsApp & app alert settings</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable
            style={styles.menuRow}
            onPress={() => router.push('/(renter)/help' as any)}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#EFF6FF' }]}>
              <HelpCircle size={18} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>Host Help & Concierge Support</Text>
              <Text style={styles.menuSub}>24/7 dedicated landlord relationship line</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </Pressable>
        </View>

        {/* Logout Button */}
        <View style={{ marginTop: 10 }}>
          <V4Button
            title="Sign Out of Host Account"
            variant="outline"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>

      {/* SWITCH EXPERIENCE MODAL */}
      <Modal visible={showSwitchModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Switch Experience</Text>
              <Pressable onPress={() => setShowSwitchModal(false)} hitSlop={8}>
                <X size={20} color="#64748B" />
              </Pressable>
            </View>

            <Text style={styles.modalSub}>
              Switch between Renter and Owner experiences without creating another account.
            </Text>

            <View style={styles.modalOptions}>
              {/* Option 1: Renter */}
              <Pressable
                style={styles.switchOptionCard}
                onPress={() => handleRoleSelect('renter')}
              >
                <View style={[styles.switchOptionIcon, { backgroundColor: '#ECFDF5' }]}>
                  <Compass size={22} color="#059669" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchOptionTitle}>Renter Experience</Text>
                  <Text style={styles.switchOptionDesc}>
                    Search verified listing flats, verified flatmates & leases
                  </Text>
                </View>
                <ChevronRight size={18} color="#94A3B8" />
              </Pressable>

              {/* Option 2: Owner (Active) */}
              <View style={[styles.switchOptionCard, styles.switchOptionCardActive]}>
                <View style={[styles.switchOptionIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Building2 size={22} color="#B45309" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchOptionTitle}>Owner / Lister Experience (Active)</Text>
                  <Text style={styles.switchOptionDesc}>
                    List properties, screen tenant leads & auto-collect rent
                  </Text>
                </View>
                <CheckCircle2 size={18} color="#059669" />
              </View>
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
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  avatarImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
  },
  businessName: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  ownerEmail: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedBadgeTxt: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#065F46',
  },
  yearsBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  yearsBadgeTxt: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#475569',
  },
  switchModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 12,
  },
  switchIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#064E3B',
  },
  switchSub: {
    fontSize: 11,
    color: '#0F766E',
    marginTop: 1,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...V4_SHADOWS.soft,
  },
  planIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  activePlanBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  activePlanTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
  },
  planSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  specsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  specLabel: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  specVal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  specDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...V4_SHADOWS.soft,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  menuSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 62,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    ...V4_SHADOWS.card,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 18,
  },
  modalOptions: {
    gap: 10,
  },
  switchOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  switchOptionCardActive: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  switchOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchOptionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  switchOptionDesc: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
});

