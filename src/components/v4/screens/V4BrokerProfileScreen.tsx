import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Briefcase,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  LogOut,
  MapPin,
  FileText,
  CreditCard,
  Headphones,
  Sparkles,
  ArrowLeftRight,
  Compass,
  X,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS, V4_RADIUS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { useAppStore } from '../../../store/useAppStore';

export const V4BrokerProfileScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    brokerProfile,
    switchMode,
    logout,
    showToast,
  } = useAppStore();

  const [showSwitchModal, setShowSwitchModal] = useState(false);

  const agencyName =
    brokerProfile?.agency_name ||
    brokerProfile?.company_name ||
    (user?.name ? `${user?.name}'s Agency` : 'Prime Realty Partners');
  const brokerName = user?.name || brokerProfile?.owner_name || 'Rajesh Singhania';
  const reraNumber = brokerProfile?.rera_number || 'A51800098762';
  const operatingCity = brokerProfile?.operating_city || 'Mumbai';
  const isReraVerified = brokerProfile?.is_rera_verified ?? brokerProfile?.verified ?? true;

  const handleRoleSwitch = async (mode: 'renter' | 'owner' | 'broker') => {
    setShowSwitchModal(false);
    await switchMode(mode);
    if (mode === 'renter') {
      router.replace('/(renter)/home' as any);
    } else if (mode === 'owner') {
      router.replace('/(owner)/dashboard' as any);
    } else {
      router.replace('/(broker)/dashboard' as any);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of REHVO Pro?', [
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
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 110 },
        ]}
      >
        {/* 1. BROKER IDENTITY CARD */}
        <View style={styles.profileHeroCard}>
          <View style={styles.profileHeroTop}>
            <Image
              source={{
                uri:
                  brokerProfile?.company_logo ||
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&q=80',
              }}
              style={styles.avatarImg}
            />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={styles.roleTagRow}>
                <View style={styles.rolePill}>
                  <Text style={styles.rolePillTxt}>RERA REGISTERED BROKER</Text>
                </View>
                {isReraVerified && (
                  <View style={styles.verifiedTag}>
                    <ShieldCheck size={11} color="#FFFFFF" strokeWidth={2.4} />
                    <Text style={styles.verifiedTagTxt}>VERIFIED</Text>
                  </View>
                )}
              </View>

              <Text style={styles.agencyName} numberOfLines={1}>
                {agencyName}
              </Text>
              <Text style={styles.brokerName}>{brokerName}</Text>
              <Text style={styles.reraNumberTxt}>MahaRERA: {reraNumber}</Text>
            </View>
          </View>

          {/* Quick Metrics Strip */}
          <View style={styles.statsStrip}>
            <View style={styles.statUnit}>
              <Text style={styles.statUnitVal}>14</Text>
              <Text style={styles.statUnitLbl}>Properties</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statUnit}>
              <Text style={styles.statUnitVal}>4.9 ★</Text>
              <Text style={styles.statUnitLbl}>Rating</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statUnit}>
              <Text style={styles.statUnitVal}>12</Text>
              <Text style={styles.statUnitLbl}>Deals Closed</Text>
            </View>
          </View>
        </View>

        {/* 2. SWITCH EXPERIENCE BANNER */}
        <Pressable
          style={styles.switchBanner}
          onPress={() => setShowSwitchModal(true)}
        >
          <View style={styles.switchIconBox}>
            <ArrowLeftRight size={20} color="#5B21B6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchBannerTitle}>Switch App Experience</Text>
            <Text style={styles.switchBannerSub}>
              Switch seamlessly to Renter or Owner Mode without logging out
            </Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </Pressable>

        {/* 3. AGENCY SETTINGS & CREDENTIALS */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Agency & Credentials</Text>

          <View style={styles.settingsCard}>
            <Pressable
              style={styles.settingsRow}
              onPress={() => showToast('MahaRERA certificate verified by DigiLocker', 'success')}
            >
              <View style={[styles.settingIconBox, { backgroundColor: '#EDE9FE' }]}>
                <ShieldCheck size={18} color="#5B21B6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingRowTitle}>MahaRERA Registration Certificate</Text>
                <Text style={styles.settingRowSub}>{reraNumber} • Active & Compliant</Text>
              </View>
              <CheckCircle2 size={18} color="#059669" />
            </Pressable>

            <View style={styles.rowDivider} />

            <Pressable
              style={styles.settingsRow}
              onPress={() => showToast('Operating City: Mumbai Metropolitan Region', 'info')}
            >
              <View style={[styles.settingIconBox, { backgroundColor: '#ECFDF5' }]}>
                <MapPin size={18} color="#059669" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingRowTitle}>Operating Corridors</Text>
                <Text style={styles.settingRowSub}>Bandra, Worli, BKC, Powai, Juhu</Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </Pressable>

            <View style={styles.rowDivider} />

            <Pressable
              style={styles.settingsRow}
              onPress={() => showToast('Commission settlement account verified', 'info')}
            >
              <View style={[styles.settingIconBox, { backgroundColor: '#FEF3C7' }]}>
                <CreditCard size={18} color="#B45309" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingRowTitle}>Commission Payout Bank Account</Text>
                <Text style={styles.settingRowSub}>HDFC Bank •••• 4092</Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </Pressable>
          </View>
        </View>

        {/* 4. SUPPORT & LEGAL */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Support & Policies</Text>

          <View style={styles.settingsCard}>
            <Pressable
              style={styles.settingsRow}
              onPress={() => showToast('REHVO Pro Priority Desk: support@rehvo.com', 'info')}
            >
              <View style={[styles.settingIconBox, { backgroundColor: '#F1F5F9' }]}>
                <Headphones size={18} color="#475569" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingRowTitle}>Broker Priority Support</Text>
                <Text style={styles.settingRowSub}>Dedicated account manager available</Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </Pressable>

            <View style={styles.rowDivider} />

            <Pressable
              style={styles.settingsRow}
              onPress={() => showToast('REHVO RERA Broker Terms & Code of Ethics', 'info')}
            >
              <View style={[styles.settingIconBox, { backgroundColor: '#F1F5F9' }]}>
                <FileText size={18} color="#475569" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingRowTitle}>Terms & Broker Code of Conduct</Text>
                <Text style={styles.settingRowSub}>MahaRERA compliance standards</Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </Pressable>
          </View>
        </View>

        {/* 5. LOGOUT BUTTON */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color="#EF4444" />
          <Text style={styles.logoutBtnTxt}>Sign Out of Broker Account</Text>
        </Pressable>
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
              Select which role you want to experience right now. Your data in all modes remains safe.
            </Text>

            <View style={styles.modalOptions}>
              {/* Option 1: Renter */}
              <Pressable
                style={styles.switchOptionCard}
                onPress={() => handleRoleSwitch('renter')}
              >
                <View style={[styles.switchOptionIcon, { backgroundColor: '#ECFDF5' }]}>
                  <Compass size={22} color="#059669" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchOptionTitle}>Renter Experience</Text>
                  <Text style={styles.switchOptionDesc}>
                    Search verified listing flats, roommates & lifestyle waves
                  </Text>
                </View>
                <ChevronRight size={18} color="#94A3B8" />
              </Pressable>

              {/* Option 2: Owner */}
              <Pressable
                style={styles.switchOptionCard}
                onPress={() => handleRoleSwitch('owner')}
              >
                <View style={[styles.switchOptionIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Building2 size={22} color="#B45309" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchOptionTitle}>Owner / Lister Experience</Text>
                  <Text style={styles.switchOptionDesc}>
                    List flats, screen tenants & collect rent via AutoPay
                  </Text>
                </View>
                <ChevronRight size={18} color="#94A3B8" />
              </Pressable>

              {/* Option 3: Broker (Current) */}
              <View style={[styles.switchOptionCard, styles.switchOptionCardActive]}>
                <View style={[styles.switchOptionIcon, { backgroundColor: '#EDE9FE' }]}>
                  <Briefcase size={22} color="#5B21B6" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchOptionTitle}>Broker Pro Experience (Active)</Text>
                  <Text style={styles.switchOptionDesc}>
                    Exclusive inventory, high-intent client CRM & commissions
                  </Text>
                </View>
                <CheckCircle2 size={18} color="#5B21B6" />
              </View>
            </View>
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
  scrollContent: {
    padding: 16,
  },
  profileHeroCard: {
    backgroundColor: '#064E3B',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    ...V4_SHADOWS.card,
  },
  profileHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  roleTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  rolePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rolePillTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A7F3D0',
    letterSpacing: 0.5,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#047857',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedTagTxt: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  agencyName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  brokerName: {
    fontSize: 13,
    color: '#D1FAE5',
    marginTop: 2,
    fontWeight: '600',
  },
  reraNumberTxt: {
    fontSize: 11,
    color: '#A7F3D0',
    marginTop: 2,
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 12,
  },
  statUnit: {
    alignItems: 'center',
  },
  statUnitVal: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statUnitLbl: {
    fontSize: 10,
    color: '#D1FAE5',
    fontWeight: '600',
    marginTop: 2,
  },
  statSep: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  switchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginBottom: 20,
    gap: 12,
    ...V4_SHADOWS.soft,
  },
  switchIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5B21B6',
  },
  switchBannerSub: {
    fontSize: 11.5,
    color: '#7C3AED',
    marginTop: 2,
    lineHeight: 15,
  },
  settingsSection: {
    marginBottom: 20,
  },
  settingsSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...V4_SHADOWS.soft,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  settingIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingRowTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  settingRowSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 64,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginTop: 10,
  },
  logoutBtnTxt: {
    fontSize: 14,
    fontWeight: '800',
    color: '#DC2626',
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
    borderColor: '#7C3AED',
    backgroundColor: '#FAF5FF',
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
