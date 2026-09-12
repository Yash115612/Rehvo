// ==============================================================================
// REHVO V5.4.1 — NOTIFICATION SETTINGS SCREEN (PRODUCTION)
// Comprehensive push notification preferences, category toggles, quiet hours,
// sound & vibration controls, lock screen previews, and badge settings.
// ==============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bell,
  MessageSquare,
  CalendarCheck,
  Bookmark,
  TrendingDown,
  Sparkles,
  Users,
  Building2,
  IndianRupee,
  Megaphone,
  Moon,
  Volume2,
  Vibrate,
  Eye,
  Hash,
  RotateCcw,
  Check,
  ShieldAlert,
  Mail,
  Smartphone,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { NotificationPreferences } from '../../../types';
import { DEFAULT_NOTIFICATION_PREFERENCES } from '../../../services/notifications';
import { checkNotificationPermission, requestNotificationPermission } from '../../../services/pushNotifications';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

const QUIET_START_OPTIONS = ['21:00', '22:00', '23:00', '00:00'];
const QUIET_END_OPTIONS = ['06:00', '07:00', '08:00', '09:00'];

const SOUND_OPTIONS = [
  { id: 'default', label: 'System Default' },
  { id: 'emerald_chime', label: 'Emerald Chime' },
  { id: 'gentle_bell', label: 'Gentle Bell' },
  { id: 'luxury_pulse', label: 'REHVO Luxury' },
];

export const V4NotificationSettingsScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    notificationPrefs,
    fetchNotificationPreferences,
    updateNotificationPreferences,
    showToast,
  } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);

  // Load preferences from DB on mount
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoading(true);
      await fetchNotificationPreferences();
      if (Platform.OS !== 'web') {
        const permitted = await checkNotificationPermission();
        if (mounted) setHasPermission(permitted);
      }
      if (mounted) setLoading(false);
    };
    init();
    return () => {
      mounted = false;
    };
  }, [fetchNotificationPreferences]);

  const handleToggle = useCallback(
    async (key: keyof NotificationPreferences, value: any) => {
      await updateNotificationPreferences({ [key]: value });
    },
    [updateNotificationPreferences]
  );

  const handleRequestPermission = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setHasPermission(granted);
    if (granted) {
      showToast('Notification permission granted', 'success');
    } else {
      showToast('Permission not granted. Please enable in device Settings.', 'info');
    }
  }, [showToast]);

  const handleResetDefaults = useCallback(async () => {
    await updateNotificationPreferences(DEFAULT_NOTIFICATION_PREFERENCES);
    showToast('Reset to default notification preferences', 'info');
  }, [updateNotificationPreferences, showToast]);

  const prefs = notificationPrefs || DEFAULT_NOTIFICATION_PREFERENCES;

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Notification Settings</Text>
          <Text style={styles.headerSubtitle}>Alerts, quiet hours & sounds</Text>
        </View>

        <Pressable
          style={styles.resetHeaderBtn}
          onPress={handleResetDefaults}
          accessibilityLabel="Reset to defaults"
        >
          <RotateCcw size={16} color={V4_COLORS.primary} strokeWidth={2.2} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={V4_COLORS.primary} />
          <Text style={styles.loadingText}>Loading preferences...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Permission Alert Banner (if disabled on device) */}
          {!hasPermission && Platform.OS !== 'web' && (
            <View style={styles.permissionBanner}>
              <View style={styles.permissionIconCircle}>
                <ShieldAlert size={20} color="#DC2626" strokeWidth={2.2} />
              </View>
              <View style={styles.permissionTextCol}>
                <Text style={styles.permissionTitle}>Notifications are Disabled</Text>
                <Text style={styles.permissionDesc}>
                  Device push permissions are turned off. Enable them to receive visit gatepasses and instant chat alerts.
                </Text>
                <Pressable
                  style={styles.permissionBtn}
                  onPress={handleRequestPermission}
                >
                  <Text style={styles.permissionBtnText}>Enable Notifications</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Section: Category Toggles */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconWrap}>
                <Bell size={16} color="#0F766E" strokeWidth={2.4} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Alert Categories</Text>
                <Text style={styles.sectionDesc}>Choose the notifications you want to receive</Text>
              </View>
            </View>

            {/* Messages */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.itemIconCircle, { backgroundColor: '#CCFBF1' }]}>
                  <MessageSquare size={16} color="#0F766E" strokeWidth={2.2} />
                </View>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Messages & Chat</Text>
                  <Text style={styles.toggleSubtitle}>Direct messages, landlord chat, and inquiries</Text>
                </View>
              </View>
              <Switch
                value={prefs.messages}
                onValueChange={(val) => handleToggle('messages', val)}
                trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                thumbColor={prefs.messages ? '#0F766E' : '#F8FAFC'}
              />
            </View>

            <View style={styles.divider} />

            {/* Visits */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.itemIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <CalendarCheck size={16} color="#2563EB" strokeWidth={2.2} />
                </View>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Visits & Gatepasses</Text>
                  <Text style={styles.toggleSubtitle}>Booking confirmations, 24h/1h reminders, QR pass</Text>
                </View>
              </View>
              <Switch
                value={prefs.visits}
                onValueChange={(val) => handleToggle('visits', val)}
                trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                thumbColor={prefs.visits ? '#0F766E' : '#F8FAFC'}
              />
            </View>

            <View style={styles.divider} />

            {/* Property Updates */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.itemIconCircle, { backgroundColor: '#FEF3C7' }]}>
                  <Bookmark size={16} color="#D97706" strokeWidth={2.2} />
                </View>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Property Updates</Text>
                  <Text style={styles.toggleSubtitle}>Status changes on saved homes and new matches</Text>
                </View>
              </View>
              <Switch
                value={prefs.property_updates}
                onValueChange={(val) => handleToggle('property_updates', val)}
                trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                thumbColor={prefs.property_updates ? '#0F766E' : '#F8FAFC'}
              />
            </View>

            <View style={styles.divider} />

            {/* Price Changes */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.itemIconCircle, { backgroundColor: '#DCFCE7' }]}>
                  <TrendingDown size={16} color="#16A34A" strokeWidth={2.2} />
                </View>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Price Drop Alerts</Text>
                  <Text style={styles.toggleSubtitle}>Instant notification when saved properties cut rent</Text>
                </View>
              </View>
              <Switch
                value={prefs.price_changes}
                onValueChange={(val) => handleToggle('price_changes', val)}
                trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                thumbColor={prefs.price_changes ? '#0F766E' : '#F8FAFC'}
              />
            </View>

            <View style={styles.divider} />

            {/* Wallet & Rewards */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.itemIconCircle, { backgroundColor: '#FEF3C7' }]}>
                  <Sparkles size={16} color="#D97706" strokeWidth={2.2} />
                </View>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Wallet & Cashback</Text>
                  <Text style={styles.toggleSubtitle}>R-Cash credits, scratch cards, and referral earnings</Text>
                </View>
              </View>
              <Switch
                value={prefs.wallet_rewards}
                onValueChange={(val) => handleToggle('wallet_rewards', val)}
                trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                thumbColor={prefs.wallet_rewards ? '#0F766E' : '#F8FAFC'}
              />
            </View>

            <View style={styles.divider} />

            {/* Flatmates */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.itemIconCircle, { backgroundColor: '#F5F3FF' }]}>
                  <Users size={16} color="#8B5CF6" strokeWidth={2.2} />
                </View>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Flatmates & Waves</Text>
                  <Text style={styles.toggleSubtitle}>Waves, Super Waves, and high-compatibility matches</Text>
                </View>
              </View>
              <Switch
                value={prefs.flatmates}
                onValueChange={(val) => handleToggle('flatmates', val)}
                trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                thumbColor={prefs.flatmates ? '#0F766E' : '#F8FAFC'}
              />
            </View>

            <View style={styles.divider} />

            {/* Owner Leads */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.itemIconCircle, { backgroundColor: '#E6FFFA' }]}>
                  <Building2 size={16} color="#0F766E" strokeWidth={2.2} />
                </View>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Owner & Landlord Leads</Text>
                  <Text style={styles.toggleSubtitle}>Renter inquiries, tenant verification, and visits</Text>
                </View>
              </View>
              <Switch
                value={prefs.owner_leads}
                onValueChange={(val) => handleToggle('owner_leads', val)}
                trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                thumbColor={prefs.owner_leads ? '#0F766E' : '#F8FAFC'}
              />
            </View>

            <View style={styles.divider} />

            {/* Rent Due */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.itemIconCircle, { backgroundColor: '#D1FAE5' }]}>
                  <IndianRupee size={16} color="#059669" strokeWidth={2.2} />
                </View>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Rent Due & AutoPay</Text>
                  <Text style={styles.toggleSubtitle}>Monthly rent reminders, receipts, and AutoPay alerts</Text>
                </View>
              </View>
              <Switch
                value={prefs.rent_due}
                onValueChange={(val) => handleToggle('rent_due', val)}
                trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                thumbColor={prefs.rent_due ? '#0F766E' : '#F8FAFC'}
              />
            </View>

            <View style={styles.divider} />

            {/* Society Alerts */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.itemIconCircle, { backgroundColor: '#E0F2FE' }]}>
                  <Building2 size={16} color="#0284C7" strokeWidth={2.2} />
                </View>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Society & Gatepasses</Text>
                  <Text style={styles.toggleSubtitle}>Visitor entry approvals, package deliveries, circulars</Text>
                </View>
              </View>
              <Switch
                value={prefs.society_enabled !== false}
                onValueChange={(val) => handleToggle('society_enabled', val)}
                trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                thumbColor={prefs.society_enabled !== false ? '#0F766E' : '#F8FAFC'}
              />
            </View>

            <View style={styles.divider} />

            {/* Marketing / Special Offers */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.itemIconCircle, { backgroundColor: '#F1F5F9' }]}>
                  <Megaphone size={16} color="#64748B" strokeWidth={2.2} />
                </View>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Offers & REHVO Perks</Text>
                  <Text style={styles.toggleSubtitle}>Moving discounts, zero deposit specials, and updates</Text>
                </View>
              </View>
              <Switch
                value={prefs.marketing}
                onValueChange={(val) => handleToggle('marketing', val)}
                trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                thumbColor={prefs.marketing ? '#0F766E' : '#F8FAFC'}
              />
            </View>
          </View>

          {/* Section: Delivery Channels (Email & SMS) */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrap, { backgroundColor: '#E6FFFA' }]}>
                <Smartphone size={16} color="#0F766E" strokeWidth={2.4} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Email & SMS Alerts</Text>
                <Text style={styles.sectionDesc}>Fallback delivery channels for receipts & visits</Text>
              </View>
            </View>

            {/* Email */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.itemIconCircle, { backgroundColor: '#F0FDFA' }]}>
                  <Mail size={16} color="#0F766E" strokeWidth={2.2} />
                </View>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Email Notifications</Text>
                  <Text style={styles.toggleSubtitle}>Agreements, payment receipts, and monthly rent invoices</Text>
                </View>
              </View>
              <Switch
                value={prefs.email_enabled !== false}
                onValueChange={(val) => handleToggle('email_enabled', val)}
                trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                thumbColor={prefs.email_enabled !== false ? '#0F766E' : '#F8FAFC'}
              />
            </View>

            <View style={styles.divider} />

            {/* SMS */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.itemIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <Smartphone size={16} color="#2563EB" strokeWidth={2.2} />
                </View>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>SMS Priority Alerts</Text>
                  <Text style={styles.toggleSubtitle}>Visit gatepass OTPs and urgent security broadcasts</Text>
                </View>
              </View>
              <Switch
                value={prefs.sms_enabled !== false}
                onValueChange={(val) => handleToggle('sms_enabled', val)}
                trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                thumbColor={prefs.sms_enabled !== false ? '#0F766E' : '#F8FAFC'}
              />
            </View>
          </View>

          {/* Section: Quiet Hours */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrap, { backgroundColor: '#EDE9FE' }]}>
                <Moon size={16} color="#7C3AED" strokeWidth={2.4} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Quiet Hours (Do Not Disturb)</Text>
                <Text style={styles.sectionDesc}>Mute non-urgent notifications while you rest</Text>
              </View>
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Enable Quiet Hours</Text>
                  <Text style={styles.toggleSubtitle}>
                    Non-urgent alerts are silenced. Urgent security & OTPs bypass quiet hours.
                  </Text>
                </View>
              </View>
              <Switch
                value={prefs.quiet_hours_enabled}
                onValueChange={(val) => handleToggle('quiet_hours_enabled', val)}
                trackColor={{ false: '#CBD5E1', true: '#C4B5FD' }}
                thumbColor={prefs.quiet_hours_enabled ? '#7C3AED' : '#F8FAFC'}
              />
            </View>

            {prefs.quiet_hours_enabled && (
              <View style={styles.quietHoursPickerWrap}>
                {/* Start Time */}
                <View style={styles.timeSelectCol}>
                  <Text style={styles.timeSelectLabel}>Starts At</Text>
                  <View style={styles.chipRow}>
                    {QUIET_START_OPTIONS.map((time) => {
                      const isSelected = prefs.quiet_hours_start === time;
                      return (
                        <Pressable
                          key={time}
                          style={[styles.timeChip, isSelected && styles.timeChipActive]}
                          onPress={() => handleToggle('quiet_hours_start', time)}
                        >
                          <Text
                            style={[
                              styles.timeChipText,
                              isSelected && styles.timeChipTextActive,
                            ]}
                          >
                            {time}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* End Time */}
                <View style={styles.timeSelectCol}>
                  <Text style={styles.timeSelectLabel}>Ends At</Text>
                  <View style={styles.chipRow}>
                    {QUIET_END_OPTIONS.map((time) => {
                      const isSelected = prefs.quiet_hours_end === time;
                      return (
                        <Pressable
                          key={time}
                          style={[styles.timeChip, isSelected && styles.timeChipActive]}
                          onPress={() => handleToggle('quiet_hours_end', time)}
                        >
                          <Text
                            style={[
                              styles.timeChipText,
                              isSelected && styles.timeChipTextActive,
                            ]}
                          >
                            {time}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Section: Sound & Vibration */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrap, { backgroundColor: '#CCFBF1' }]}>
                <Volume2 size={16} color="#0F766E" strokeWidth={2.4} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Sound & Haptics</Text>
                <Text style={styles.sectionDesc}>Customize audio and vibration cues</Text>
              </View>
            </View>

            {/* Sound Switch */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.itemIconCircle, { backgroundColor: '#CCFBF1' }]}>
                  <Volume2 size={16} color="#0F766E" strokeWidth={2.2} />
                </View>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Notification Sound</Text>
                  <Text style={styles.toggleSubtitle}>Play alert tone when receiving push alerts</Text>
                </View>
              </View>
              <Switch
                value={prefs.sound_enabled}
                onValueChange={(val) => handleToggle('sound_enabled', val)}
                trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                thumbColor={prefs.sound_enabled ? '#0F766E' : '#F8FAFC'}
              />
            </View>

            {/* Sound Tone Picker */}
            {prefs.sound_enabled && (
              <View style={styles.soundPickerWrap}>
                <Text style={styles.soundPickerLabel}>Alert Tone</Text>
                <View style={styles.soundOptionsGrid}>
                  {SOUND_OPTIONS.map((snd) => {
                    const isSelected = (prefs.sound_name || 'default') === snd.id;
                    return (
                      <Pressable
                        key={snd.id}
                        style={[
                          styles.soundChip,
                          isSelected && styles.soundChipActive,
                        ]}
                        onPress={() => handleToggle('sound_name', snd.id)}
                      >
                        <Text
                          style={[
                            styles.soundChipText,
                            isSelected && styles.soundChipTextActive,
                          ]}
                        >
                          {snd.label}
                        </Text>
                        {isSelected && (
                          <Check size={14} color="#0F766E" strokeWidth={2.4} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            <View style={styles.divider} />

            {/* Vibration Switch */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.itemIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <Vibrate size={16} color="#2563EB" strokeWidth={2.2} />
                </View>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Haptic Vibration</Text>
                  <Text style={styles.toggleSubtitle}>Vibrate phone upon receiving alerts</Text>
                </View>
              </View>
              <Switch
                value={prefs.vibration_enabled}
                onValueChange={(val) => handleToggle('vibration_enabled', val)}
                trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                thumbColor={prefs.vibration_enabled ? '#0F766E' : '#F8FAFC'}
              />
            </View>
          </View>

          {/* Section: Lock Screen & App Badge */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrap, { backgroundColor: '#F1F5F9' }]}>
                <Eye size={16} color="#0F172A" strokeWidth={2.4} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Privacy & Display</Text>
                <Text style={styles.sectionDesc}>Lock screen previews and app icon count</Text>
              </View>
            </View>

            {/* Lock Screen Previews */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.itemIconCircle, { backgroundColor: '#F1F5F9' }]}>
                  <Eye size={16} color="#0F172A" strokeWidth={2.2} />
                </View>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>Lock Screen Previews</Text>
                  <Text style={styles.toggleSubtitle}>Show alert details and message snippets when locked</Text>
                </View>
              </View>
              <Switch
                value={prefs.lock_screen_previews}
                onValueChange={(val) => handleToggle('lock_screen_previews', val)}
                trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                thumbColor={prefs.lock_screen_previews ? '#0F766E' : '#F8FAFC'}
              />
            </View>

            <View style={styles.divider} />

            {/* App Icon Badge Count */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <View style={[styles.itemIconCircle, { backgroundColor: '#CCFBF1' }]}>
                  <Hash size={16} color="#0F766E" strokeWidth={2.2} />
                </View>
                <View style={styles.toggleTextCol}>
                  <Text style={styles.toggleTitle}>App Icon Badge Count</Text>
                  <Text style={styles.toggleSubtitle}>Display unread notification count badge on home screen icon</Text>
                </View>
              </View>
              <Switch
                value={prefs.badge_enabled}
                onValueChange={(val) => handleToggle('badge_enabled', val)}
                trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                thumbColor={prefs.badge_enabled ? '#0F766E' : '#F8FAFC'}
              />
            </View>
          </View>

          {/* Reset to Defaults CTA */}
          <View style={styles.footerWrap}>
            <Pressable
              style={styles.resetBtn}
              onPress={handleResetDefaults}
              accessibilityLabel="Reset all preferences to default"
            >
              <RotateCcw size={16} color="#0F766E" strokeWidth={2.2} />
              <Text style={styles.resetBtnText}>Reset to Default Preferences</Text>
            </Pressable>

            <Text style={styles.footerNote}>
              REHVO Push Engine v5.4.1 (Production) • End-to-End Encrypted
            </Text>
          </View>
        </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2ECEF',
    ...V4_SHADOWS.soft,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
    gap: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  resetHeaderBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  permissionBanner: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 12,
    alignItems: 'flex-start',
  },
  permissionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionTextCol: {
    flex: 1,
    gap: 4,
  },
  permissionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991B1B',
  },
  permissionDesc: {
    fontSize: 12,
    color: '#B91C1C',
    lineHeight: 16,
  },
  permissionBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  permissionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    ...V4_SHADOWS.soft,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  sectionDesc: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '500',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 12,
  },
  itemIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTextCol: {
    flex: 1,
    gap: 2,
  },
  toggleTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  toggleSubtitle: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    lineHeight: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  quietHoursPickerWrap: {
    backgroundColor: '#FAF5FF',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  timeSelectCol: {
    gap: 6,
  },
  timeSelectLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B21A8',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timeChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8B4FE',
    alignItems: 'center',
  },
  timeChipActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  timeChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B21A8',
  },
  timeChipTextActive: {
    color: '#FFFFFF',
  },
  soundPickerWrap: {
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 8,
  },
  soundPickerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  soundOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  soundChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  soundChipActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0F766E',
  },
  soundChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  soundChipTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  footerWrap: {
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#99F6E4',
    ...V4_SHADOWS.soft,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  footerNote: {
    fontSize: 11,
    color: V4_COLORS.textMuted,
    fontWeight: '500',
    textAlign: 'center',
  },
});
