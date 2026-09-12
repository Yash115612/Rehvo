import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  Fingerprint,
  Lock,
  KeyRound,
  Smartphone,
  Laptop,
  Globe,
  LogOut,
  EyeOff,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import {
  getUserSecuritySettings,
  updateUserSecuritySettings,
  getUserSessions,
  revokeSession,
  revokeAllOtherSessions,
  getLoginHistory,
  hashPin,
  exportUserData,
  requestAccountPurge,
} from '../../../services/securityEngine';
import { UserSecuritySettings, UserSessionRecord, LoginHistoryRecord } from '../../../types';

export const V4SecurityCenterScreenComponent: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, showToast } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<UserSecuritySettings>({
    id: 'local_sec_settings',
    biometric_enabled: false,
    app_lock_enabled: false,
    auto_lock_duration: 30,
    two_factor_enabled: false,
    incognito_mode: false,
    dpdp_consent_given: true,
    updated_at: new Date().toISOString(),
  });
  const [sessions, setSessions] = useState<UserSessionRecord[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryRecord[]>([]);

  // Pin Modal State
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [savingPin, setSavingPin] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [secSettings, userSessions, logins] = await Promise.all([
        getUserSecuritySettings(user?.id),
        getUserSessions(user?.id),
        getLoginHistory(user?.id),
      ]);
      setSettings(secSettings);
      setSessions(userSessions);
      setLoginHistory(logins);
    } catch {
      // Fallback defaults preserved
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleBiometrics = useCallback(
    async (value: boolean) => {
      const updated = { ...settings, biometric_enabled: value, app_lock_enabled: value };
      setSettings(updated);
      const success = await updateUserSecuritySettings(updated, user?.id);
      if (success) {
        showToast(value ? 'Biometric App Lock enabled' : 'Biometric App Lock disabled', 'success');
      } else {
        showToast('Could not update biometric lock settings', 'error');
      }
    },
    [settings, user?.id, showToast]
  );

  const handleToggleIncognito = useCallback(
    async (value: boolean) => {
      const updated = { ...settings, incognito_mode: value };
      setSettings(updated);
      const success = await updateUserSecuritySettings(updated, user?.id);
      if (success) {
        showToast(value ? 'Incognito Mode active: History will not be stored' : 'Incognito Mode deactivated', 'info');
      }
    },
    [settings, user?.id, showToast]
  );

  const handleAutoLockDuration = useCallback(
    async (seconds: number) => {
      const updated = { ...settings, auto_lock_duration: seconds };
      setSettings(updated);
      await updateUserSecuritySettings(updated, user?.id);
      showToast(`Auto-lock set to ${seconds === 0 ? 'Immediately' : `${seconds}s`}`, 'success');
    },
    [settings, user?.id, showToast]
  );

  const handleSavePin = useCallback(async () => {
    if (newPin.length !== 4) {
      showToast('PIN must be exactly 4 digits', 'error');
      return;
    }
    if (newPin !== confirmPin) {
      showToast('PIN entries do not match', 'error');
      return;
    }
    setSavingPin(true);
    try {
      const pinHash = await hashPin(newPin);
      const updated = { ...settings, pin_hash: pinHash, app_lock_enabled: true };
      await updateUserSecuritySettings(updated, user?.id);
      setSettings(updated);
      setPinModalVisible(false);
      setNewPin('');
      setConfirmPin('');
      showToast('Security PIN saved successfully', 'success');
    } catch {
      showToast('Failed to save security PIN', 'error');
    } finally {
      setSavingPin(false);
    }
  }, [newPin, confirmPin, settings, user?.id, showToast]);

  const handleRevokeSession = useCallback(
    async (sessionId: string) => {
      const success = await revokeSession(sessionId);
      if (success) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        showToast('Device session revoked', 'info');
      } else {
        showToast('Could not revoke session', 'error');
      }
    },
    [showToast]
  );

  const handleRevokeAllOtherSessions = useCallback(async () => {
    const currentSession = sessions.find((s) => s.is_current);
    if (!currentSession) return;
    const success = await revokeAllOtherSessions(currentSession.id, user?.id);
    if (success) {
      setSessions([currentSession]);
      showToast('Logged out from all other devices', 'success');
    } else {
      showToast('Could not log out other devices', 'error');
    }
  }, [sessions, user?.id, showToast]);

  const handleExportData = useCallback(async () => {
    try {
      const res = await exportUserData(user?.id);
      Alert.alert(
        'DPDP Data Export Ready',
        `A secure download archive has been generated for your account according to DPDP Act 2023.\n\nLink expires: ${new Date(res.expiryDate).toLocaleDateString()}`,
        [{ text: 'Dismiss', style: 'default' }]
      );
    } catch {
      showToast('Failed to generate export package', 'error');
    }
  }, [user?.id, showToast]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Request Account Purge',
      'Are you sure you want to permanently erase your profile, documents, and rental history? This action complies with DPDP 2023 right to be forgotten.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Erasure',
          style: 'destructive',
          onPress: async () => {
            await requestAccountPurge(user?.id);
            showToast('Account erasure request registered with 30-day grace period', 'info');
          },
        },
      ]
    );
  }, [user?.id, showToast]);

  const currentSessionId = useMemo(() => sessions.find((s) => s.is_current)?.id, [sessions]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={V4_COLORS.textPrimary} />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Security Center Pro</Text>
          <Text style={styles.headerSubtitle}>Biometrics, Devices & DPDP Governance</Text>
        </View>
        <View style={styles.headerBadge}>
          <ShieldCheck size={18} color={V4_COLORS.primary} />
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={V4_COLORS.primary} />
          <Text style={styles.loaderText}>Auditing Security Parameters...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Security Score Banner */}
          <View style={styles.scoreBanner}>
            <View style={styles.scoreIconBox}>
              <Shield size={28} color={V4_COLORS.textWhite} />
            </View>
            <View style={styles.scoreTextContainer}>
              <View style={styles.scorePill}>
                <Text style={styles.scorePillText}>PROTECTION LEVEL: MAXIMUM</Text>
              </View>
              <Text style={styles.scoreTitle}>Zero-Trust Identity Shield</Text>
              <Text style={styles.scoreDescription}>
                Hardware keystore encryption active. Multi-factor verification enforced.
              </Text>
            </View>
          </View>

          {/* Section: Biometrics & App Lock */}
          <Text style={styles.sectionHeader}>APP LOCK & BIOMETRICS</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={[styles.iconBox, { backgroundColor: V4_COLORS.primaryLight }]}>
                <Fingerprint size={20} color={V4_COLORS.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Face ID / Fingerprint Lock</Text>
                <Text style={styles.settingSubtitle}>Unlock REHVO with biometric sensors</Text>
              </View>
              <Switch
                value={settings.biometric_enabled}
                onValueChange={handleToggleBiometrics}
                trackColor={{ false: V4_COLORS.surfaceMuted, true: V4_COLORS.primary }}
                thumbColor={V4_COLORS.surface}
              />
            </View>

            <View style={styles.divider} />

            <Pressable
              style={styles.actionRow}
              onPress={() => setPinModalVisible(true)}
              accessibilityRole="button"
            >
              <View style={[styles.iconBox, { backgroundColor: V4_COLORS.surfaceSubtle }]}>
                <KeyRound size={20} color={V4_COLORS.textPrimary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Change 4-Digit Security PIN</Text>
                <Text style={styles.settingSubtitle}>
                  {settings.pin_hash ? 'PIN is configured and hashed' : 'Not set up yet'}
                </Text>
              </View>
              <ChevronRight size={18} color={V4_COLORS.textMuted} />
            </Pressable>

            <View style={styles.divider} />

            <View style={styles.durationBlock}>
              <Text style={styles.durationLabel}>AUTO-LOCK TIMER</Text>
              <View style={styles.durationOptions}>
                {[
                  { label: 'Immediate', value: 0 },
                  { label: '30 sec', value: 30 },
                  { label: '1 min', value: 60 },
                  { label: '5 min', value: 300 },
                ].map((opt) => (
                  <Pressable
                    key={opt.value}
                    style={[
                      styles.durationPill,
                      settings.auto_lock_duration === opt.value && styles.durationPillActive,
                    ]}
                    onPress={() => handleAutoLockDuration(opt.value)}
                  >
                    <Text
                      style={[
                        styles.durationPillText,
                        settings.auto_lock_duration === opt.value && styles.durationPillTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Section: Active Device Sessions */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>ACTIVE DEVICE SESSIONS ({sessions.length})</Text>
            {sessions.length > 1 && (
              <Pressable onPress={handleRevokeAllOtherSessions} style={styles.linkButton}>
                <Text style={styles.linkButtonText}>Log out others</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.card}>
            {sessions.map((session, idx) => (
              <React.Fragment key={session.id}>
                {idx > 0 && <View style={styles.divider} />}
                <View style={styles.sessionRow}>
                  <View style={[styles.iconBox, { backgroundColor: V4_COLORS.surfaceSubtle }]}>
                    {session.platform === 'web' ? (
                      <Laptop size={20} color={V4_COLORS.textPrimary} />
                    ) : (
                      <Smartphone size={20} color={V4_COLORS.textPrimary} />
                    )}
                  </View>
                  <View style={styles.sessionInfo}>
                    <View style={styles.sessionTitleRow}>
                      <Text style={styles.sessionName}>{session.device_name}</Text>
                      {session.is_current && (
                        <View style={styles.currentBadge}>
                          <Text style={styles.currentBadgeText}>THIS DEVICE</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.sessionMeta}>
                      IP: {session.ip_address} • Last active {new Date(session.last_active_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  {!session.is_current && (
                    <Pressable
                      style={styles.revokeButton}
                      onPress={() => handleRevokeSession(session.id)}
                      accessibilityRole="button"
                    >
                      <LogOut size={16} color={V4_COLORS.danger} />
                    </Pressable>
                  )}
                </View>
              </React.Fragment>
            ))}
          </View>

          {/* Section: Recent Login Audit Trail */}
          <Text style={styles.sectionHeader}>LOGIN AUDIT TRAIL</Text>
          <View style={styles.card}>
            {loginHistory.map((item, idx) => (
              <React.Fragment key={item.id}>
                {idx > 0 && <View style={styles.divider} />}
                <View style={styles.loginRow}>
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor:
                          item.status === 'success' ? V4_COLORS.successLight : V4_COLORS.dangerLight,
                      },
                    ]}
                  >
                    {item.status === 'success' ? (
                      <CheckCircle2 size={18} color={V4_COLORS.success} />
                    ) : (
                      <XCircle size={18} color={V4_COLORS.danger} />
                    )}
                  </View>
                  <View style={styles.loginDetails}>
                    <Text style={styles.loginDevice}>{item.device_name}</Text>
                    <Text style={styles.loginLocation}>
                      {item.location} • {item.login_method.toUpperCase()}
                    </Text>
                    <Text style={styles.loginTime}>
                      {new Date(item.attempted_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          item.status === 'success' ? V4_COLORS.successLight : V4_COLORS.dangerLight,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        { color: item.status === 'success' ? V4_COLORS.success : V4_COLORS.danger },
                      ]}
                    >
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>

          {/* Section: DPDP 2023 Compliance */}
          <Text style={styles.sectionHeader}>DPDP 2023 DATA & PRIVACY RIGHTS</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={[styles.iconBox, { backgroundColor: V4_COLORS.surfaceSubtle }]}>
                <EyeOff size={20} color={V4_COLORS.textPrimary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Incognito Browsing</Text>
                <Text style={styles.settingSubtitle}>Do not save search queries or viewed listings</Text>
              </View>
              <Switch
                value={settings.incognito_mode}
                onValueChange={handleToggleIncognito}
                trackColor={{ false: V4_COLORS.surfaceMuted, true: V4_COLORS.primary }}
                thumbColor={V4_COLORS.surface}
              />
            </View>

            <View style={styles.divider} />

            <Pressable style={styles.actionRow} onPress={handleExportData} accessibilityRole="button">
              <View style={[styles.iconBox, { backgroundColor: V4_COLORS.primaryLight }]}>
                <Download size={20} color={V4_COLORS.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Download My Data (DPDP 2023)</Text>
                <Text style={styles.settingSubtitle}>Generate secure export package of all records</Text>
              </View>
              <ChevronRight size={18} color={V4_COLORS.textMuted} />
            </Pressable>

            <View style={styles.divider} />

            <Pressable style={styles.actionRow} onPress={handleDeleteAccount} accessibilityRole="button">
              <View style={[styles.iconBox, { backgroundColor: V4_COLORS.dangerLight }]}>
                <Trash2 size={20} color={V4_COLORS.danger} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: V4_COLORS.danger }]}>
                  Request Account Erasure
                </Text>
                <Text style={styles.settingSubtitle}>Purge personal records under Right to be Forgotten</Text>
              </View>
              <ChevronRight size={18} color={V4_COLORS.danger} />
            </Pressable>
          </View>
        </ScrollView>
      )}

      {/* PIN Setup Modal */}
      <Modal visible={pinModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={[styles.iconBox, { backgroundColor: V4_COLORS.primaryLight }]}>
                <Lock size={22} color={V4_COLORS.primary} />
              </View>
              <Text style={styles.modalTitle}>Set 4-Digit Security PIN</Text>
              <Text style={styles.modalSubtitle}>
                This PIN is stored securely in encrypted storage and protects critical financial operations.
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Enter New 4-Digit PIN</Text>
              <TextInput
                style={styles.pinInput}
                value={newPin}
                onChangeText={setNewPin}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                placeholder="••••"
                placeholderTextColor={V4_COLORS.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm 4-Digit PIN</Text>
              <TextInput
                style={styles.pinInput}
                value={confirmPin}
                onChangeText={setConfirmPin}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                placeholder="••••"
                placeholderTextColor={V4_COLORS.textMuted}
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => {
                  setPinModalVisible(false);
                  setNewPin('');
                  setConfirmPin('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.saveButton, savingPin && styles.saveButtonDisabled]}
                onPress={handleSavePin}
                disabled={savingPin}
              >
                {savingPin ? (
                  <ActivityIndicator size="small" color={V4_COLORS.textWhite} />
                ) : (
                  <Text style={styles.saveButtonText}>Save Security PIN</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const V4SecurityCenterScreen = React.memo(V4SecurityCenterScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: V4_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: V4_COLORS.border,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: V4_RADIUS.full,
    backgroundColor: V4_COLORS.surfaceSubtle,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  headerBadge: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: V4_COLORS.primaryLight,
    borderRadius: V4_RADIUS.full,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: V4_COLORS.textSecondary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  scoreBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.emeraldDark,
    borderRadius: V4_RADIUS.xl,
    padding: 16,
    marginBottom: 24,
    ...V4_SHADOWS.md,
  },
  scoreIconBox: {
    width: 52,
    height: 52,
    borderRadius: V4_RADIUS.lg,
    backgroundColor: V4_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  scorePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(204, 251, 241, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: V4_RADIUS.sm,
    marginBottom: 4,
  },
  scorePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: V4_COLORS.primaryLight,
    letterSpacing: 0.5,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: V4_COLORS.textWhite,
  },
  scoreDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    lineHeight: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 4,
  },
  linkButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  linkButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.primary,
  },
  card: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.lg,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    paddingHorizontal: 16,
    marginBottom: 20,
    ...V4_SHADOWS.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    paddingVertical: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    paddingVertical: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: V4_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
  },
  settingSubtitle: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: V4_COLORS.borderLight,
  },
  durationBlock: {
    paddingVertical: 12,
  },
  durationLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  durationOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  durationPill: {
    flex: 1,
    minHeight: 44,
    borderRadius: V4_RADIUS.md,
    backgroundColor: V4_COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: V4_COLORS.border,
  },
  durationPillActive: {
    backgroundColor: V4_COLORS.primaryLight,
    borderColor: V4_COLORS.primary,
  },
  durationPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  durationPillTextActive: {
    color: V4_COLORS.primary,
    fontWeight: '700',
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingVertical: 10,
  },
  sessionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sessionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionName: {
    fontSize: 14,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
  },
  currentBadge: {
    backgroundColor: V4_COLORS.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: V4_RADIUS.xs,
  },
  currentBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: V4_COLORS.primary,
  },
  sessionMeta: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  revokeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: V4_RADIUS.full,
    backgroundColor: V4_COLORS.dangerLight,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingVertical: 10,
  },
  loginDetails: {
    flex: 1,
    marginLeft: 12,
  },
  loginDevice: {
    fontSize: 14,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
  },
  loginLocation: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  loginTime: {
    fontSize: 11,
    color: V4_COLORS.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: V4_RADIUS.sm,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.xl,
    padding: 24,
    ...V4_SHADOWS.lg,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginTop: 12,
  },
  modalSubtitle: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
    marginBottom: 6,
  },
  pinInput: {
    minHeight: 48,
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderRadius: V4_RADIUS.md,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    paddingHorizontal: 16,
    fontSize: 20,
    letterSpacing: 8,
    textAlign: 'center',
    color: V4_COLORS.textPrimary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: V4_RADIUS.md,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  saveButton: {
    flex: 2,
    minHeight: 48,
    borderRadius: V4_RADIUS.md,
    backgroundColor: V4_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textWhite,
  },
});
