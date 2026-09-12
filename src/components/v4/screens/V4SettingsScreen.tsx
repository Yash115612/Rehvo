import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bell,
  MessageSquare,
  Shield,
  Fingerprint,
  Globe,
  Trash2,
  ChevronRight,
  Database,
  Lock,
  Sun,
  Moon,
  Sparkles,
  CreditCard,
  CheckCircle2,
  Plus,
  Phone,
  Laptop,
  LogOut,
  KeyRound,
  EyeOff,
  FileDown,
  ShieldCheck,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { runMemoryCleanup } from '../../../services/performanceEngine';

const V4SettingsScreenComponent: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { deleteAccount, user, showToast } = useAppStore();

  const [themeMode, setThemeMode] = useState<'system' | 'light' | 'dark'>('system');
  const [cacheSize, setCacheSize] = useState('14.2 MB');
  const [otherDevicesActive, setOtherDevicesActive] = useState(true);

  const [pushNotifs, setPushNotifs] = useState(true);
  const [whatsappNotifs, setWhatsappNotifs] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [biometrics, setBiometrics] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [passcodeEnabled, setPasscodeEnabled] = useState(false);
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [phoneMasking, setPhoneMasking] = useState(true);

  const handleClearCache = async () => {
    await runMemoryCleanup();
    setCacheSize('0.0 KB');
    showToast?.('🧹 Temporary cache files cleared and memory freed!', 'success');
  };

  const handleLogoutOtherDevices = () => {
    Alert.alert(
      'Log Out Other Devices',
      'This will end all active sessions on other phones and web browsers. You will remain signed in here.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out Others',
          style: 'destructive',
          onPress: () => {
            setOtherDevicesActive(false);
            showToast?.('🔒 All other active sessions terminated.', 'success');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Personal Data',
      'Under the Digital Personal Data Protection Act (DPDP), your complete account history, visits, agreements and transactions will be securely packaged as a JSON file.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Archive',
          onPress: () => {
            showToast?.('📦 Data archive link sent to your verified email.', 'success');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is irreversible. All your bookings, verified documents, and wallet balance will be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: () => {
            deleteAccount();
            router.replace('/(auth)/login' as any);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>
        <Text style={styles.headerTitle}>App Settings</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance & Display Section */}
        <Text style={styles.sectionHeading}>APPEARANCE & DISPLAY</Text>
        <View style={styles.groupCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>App Theme</Text>
              <Text style={styles.settingSubtitle}>Select your visual appearance mode</Text>
            </View>
          </View>
          <View style={styles.themeSelectorRow}>
            {(['system', 'light', 'dark'] as const).map((mode) => (
              <Pressable
                key={mode}
                style={[styles.themeOptionBtn, themeMode === mode && styles.themeOptionBtnActive]}
                onPress={() => {
                  setThemeMode(mode);
                  showToast?.(`Theme changed to ${mode === 'system' ? 'System Default' : mode === 'light' ? 'Light Mode' : 'Dark Mode'}`, 'info');
                }}
              >
                {mode === 'light' ? (
                  <Sun size={15} color={themeMode === mode ? '#FFFFFF' : '#64748B'} strokeWidth={2.4} />
                ) : mode === 'dark' ? (
                  <Moon size={15} color={themeMode === mode ? '#FFFFFF' : '#64748B'} strokeWidth={2.4} />
                ) : (
                  <Sparkles size={15} color={themeMode === mode ? '#FFFFFF' : '#64748B'} strokeWidth={2.4} />
                )}
                <Text style={[styles.themeOptionText, themeMode === mode && styles.themeOptionTextActive]}>
                  {mode === 'system' ? 'System' : mode === 'light' ? 'Light' : 'Dark'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Notifications Section */}
        <Text style={styles.sectionHeading}>NOTIFICATIONS & ALERTS</Text>
        <View style={styles.groupCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingSubtitle}>Instant visit alerts, price drops & messages</Text>
            </View>
            <Switch
              value={pushNotifs}
              onValueChange={setPushNotifs}
              trackColor={{ false: '#E2E8F0', true: V4_COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>WhatsApp Notifications</Text>
              <Text style={styles.settingSubtitle}>Site visit location maps & owner chats</Text>
            </View>
            <Switch
              value={whatsappNotifs}
              onValueChange={setWhatsappNotifs}
              trackColor={{ false: '#E2E8F0', true: V4_COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Offers & Cashback Digest</Text>
              <Text style={styles.settingSubtitle}>Weekly exclusive property deals & rent cashback</Text>
            </View>
            <Switch
              value={emailAlerts}
              onValueChange={setEmailAlerts}
              trackColor={{ false: '#E2E8F0', true: V4_COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Saved Payment Methods Section */}
        <Text style={styles.sectionHeading}>SAVED PAYMENT METHODS</Text>
        <View style={styles.groupCard}>
          {/* Primary UPI */}
          <View style={styles.paymentMethodRow}>
            <View style={[styles.paymentIconWrap, { backgroundColor: '#F0FDFA' }]}>
              <CreditCard size={18} color="#0F766E" strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.paymentTitle}>
                  {user?.email ? `${user.email.split('@')[0]}@okhdfcbank` : 'user@okhdfcbank'}
                </Text>
                <View style={styles.primaryPill}>
                  <Text style={styles.primaryPillText}>PRIMARY</Text>
                </View>
              </View>
              <Text style={styles.paymentSub}>Default UPI ID for Rent & Token Payment</Text>
            </View>
            <CheckCircle2 size={16} color="#0F766E" strokeWidth={2.4} />
          </View>

          <View style={styles.settingDivider} />

          {/* Credit Card */}
          <View style={styles.paymentMethodRow}>
            <View style={[styles.paymentIconWrap, { backgroundColor: '#FAF5FF' }]}>
              <CreditCard size={18} color="#7C3AED" strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentTitle}>HDFC Regalia Credit Card •••• 4092</Text>
              <Text style={styles.paymentSub}>Active for Auto-Pay • 2% R-Cash Cashback</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </View>

          <View style={styles.settingDivider} />

          <Pressable
            style={styles.addPaymentBtn}
            onPress={() => showToast?.('💳 Add Card / UPI flow opened', 'info')}
          >
            <Plus size={15} color="#0F766E" strokeWidth={2.4} />
            <Text style={styles.addPaymentText}>Add New Payment Method</Text>
          </Pressable>
        </View>

        {/* Security Section */}
        <Text style={styles.sectionHeading}>SECURITY & AUTHENTICATION</Text>
        <View style={styles.groupCard}>
          <Pressable
            style={styles.settingNavRow}
            onPress={() => router.push('/(renter)/security' as any)}
          >
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Security Center Pro</Text>
              <Text style={styles.settingSubtitle}>Hardware Keystore, Active Sessions & DPDP Rights</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" strokeWidth={2.2} />
          </Pressable>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Face ID / Biometric Login</Text>
              <Text style={styles.settingSubtitle}>Instant secure biometric unlock</Text>
            </View>
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ false: '#E2E8F0', true: V4_COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Passcode Lock</Text>
              <Text style={styles.settingSubtitle}>Require 4-digit PIN to open REHVO</Text>
            </View>
            <Switch
              value={passcodeEnabled}
              onValueChange={(val) => {
                setPasscodeEnabled(val);
                showToast?.(val ? '🔒 4-digit passcode protection enabled.' : 'Passcode protection disabled.', 'info');
              }}
              trackColor={{ false: '#E2E8F0', true: V4_COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Two-Factor SMS Verification</Text>
              <Text style={styles.settingSubtitle}>Require OTP on new device sign-ins</Text>
            </View>
            <Switch
              value={twoFactor}
              onValueChange={setTwoFactor}
              trackColor={{ false: '#E2E8F0', true: V4_COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Privacy & Incognito Controls */}
        <Text style={styles.sectionHeading}>PRIVACY & INCOGNITO CONTROLS</Text>
        <View style={styles.groupCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Incognito Browsing Mode</Text>
              <Text style={styles.settingSubtitle}>Browse properties without saving history or viewing activity</Text>
            </View>
            <Switch
              value={incognitoMode}
              onValueChange={(val) => {
                setIncognitoMode(val);
                showToast?.(val ? '🕶️ Incognito Mode Active. Search history paused.' : 'Incognito Mode Off.', 'info');
              }}
              trackColor={{ false: '#E2E8F0', true: V4_COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Phone Number Masking</Text>
              <Text style={styles.settingSubtitle}>Show virtual proxy numbers to owners for privacy</Text>
            </View>
            <Switch
              value={phoneMasking}
              onValueChange={setPhoneMasking}
              trackColor={{ false: '#E2E8F0', true: V4_COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Active Devices & Sessions */}
        <Text style={styles.sectionHeading}>ACTIVE DEVICES & SESSIONS</Text>
        <View style={styles.groupCard}>
          <View style={styles.deviceRow}>
            <View style={[styles.deviceIconWrap, { backgroundColor: '#F0FDF4' }]}>
              <Phone size={18} color="#16A34A" strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.deviceTitle}>Apple iPhone 16 Pro</Text>
                <View style={styles.currentDevicePill}>
                  <Text style={styles.currentDevicePillText}>THIS DEVICE</Text>
                </View>
              </View>
              <Text style={styles.deviceSub}>REHVO v6.0 • Active Now • Jaipur, India</Text>
            </View>
          </View>

          {otherDevicesActive && (
            <>
              <View style={styles.settingDivider} />

              <View style={styles.deviceRow}>
                <View style={[styles.deviceIconWrap, { backgroundColor: '#EFF6FF' }]}>
                  <Laptop size={18} color="#2563EB" strokeWidth={2.2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deviceTitle}>MacBook Pro 16” • Chrome Web</Text>
                  <Text style={styles.deviceSub}>Active 2 hours ago • Mumbai, India</Text>
                </View>
              </View>

              <View style={styles.settingDivider} />

              <Pressable style={styles.logoutOtherBtn} onPress={handleLogoutOtherDevices}>
                <LogOut size={14} color="#D97706" strokeWidth={2.2} />
                <Text style={styles.logoutOtherText}>Log Out All Other Devices</Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Storage & Preferences */}
        <Text style={styles.sectionHeading}>DATA & LANGUAGE</Text>
        <View style={styles.groupCard}>
          <Pressable
            style={styles.settingNavRow}
            onPress={() => router.push('/(renter)/document-center' as any)}
          >
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Rental Document Center & Vault</Text>
              <Text style={styles.settingSubtitle}>e-Stamped Leases, HRA Receipts & Society NOCs</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" strokeWidth={2.2} />
          </Pressable>

          <View style={styles.settingDivider} />

          <Pressable
            style={styles.settingNavRow}
            onPress={() => router.push('/(renter)/admin-cms' as any)}
          >
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Admin CMS & Control OS</Text>
              <Text style={styles.settingSubtitle}>Feature Flags, Broadcasts & Moderation</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" strokeWidth={2.2} />
          </Pressable>

          <View style={styles.settingDivider} />

          <Pressable
            style={styles.settingNavRow}
            onPress={() => Alert.alert('App Language', 'English (India) is active.')}
          >
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Language</Text>
              <Text style={styles.settingSubtitle}>English (India)</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" strokeWidth={2.2} />
          </Pressable>

          <View style={styles.settingDivider} />

          <Pressable style={styles.settingNavRow} onPress={handleExportData}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Export Personal Data (JSON)</Text>
              <Text style={styles.settingSubtitle}>DPDP Act & GDPR compliant archive</Text>
            </View>
            <FileDown size={16} color="#0F766E" strokeWidth={2.2} />
          </Pressable>

          <View style={styles.settingDivider} />

          <Pressable style={styles.settingNavRow} onPress={handleClearCache}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Clear Temporary Cache</Text>
              <Text style={styles.settingSubtitle}>{cacheSize} cached files</Text>
            </View>
            <Database size={16} color="#64748B" strokeWidth={2.2} />
          </Pressable>
        </View>

        {/* Danger Zone */}
        <Text style={[styles.sectionHeading, { color: '#DC2626' }]}>DANGER ZONE</Text>
        <View style={[styles.groupCard, { borderColor: '#FEE2E2' }]}>
          <Pressable style={styles.dangerRow} onPress={handleDeleteAccount}>
            <Trash2 size={16} color="#DC2626" strokeWidth={2.2} />
            <Text style={styles.dangerText}>Delete REHVO Account Permanently</Text>
          </Pressable>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E6EEF0',
    ...V4_SHADOWS.soft,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    paddingHorizontal: 16,
    marginBottom: 24,
    ...V4_SHADOWS.soft,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  settingNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  settingTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  settingSubtitle: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  themeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 14,
  },
  themeOptionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  themeOptionBtnActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  themeOptionText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  themeOptionTextActive: {
    color: '#FFFFFF',
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 12,
  },
  paymentIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  paymentSub: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  primaryPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  primaryPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#16A34A',
  },
  addPaymentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
  },
  addPaymentText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 12,
  },
  deviceIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  deviceSub: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  currentDevicePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  currentDevicePillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#16A34A',
  },
  logoutOtherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  logoutOtherText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#D97706',
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  dangerText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#DC2626',
    marginLeft: 10,
  },
});

export const V4SettingsScreen = React.memo(V4SettingsScreenComponent);
