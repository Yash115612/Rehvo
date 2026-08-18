import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  User,
  Phone,
  Sliders,
  Calendar,
  Users,
  Bell,
  MessageCircle,
  Clock,
  Building2,
  Sparkles,
  ShieldCheck,
  Lock,
  HelpCircle,
  LifeBuoy,
  AlertCircle,
  FileText,
  LogOut,
  Trash2,
  ChevronRight,
  Shield,
  FileCheck,
  MapPin,
  Wallet,
  CalendarDays,
  KeyRound,
  Info,
  BadgeCheck,
} from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { REHVOLogo } from '../brand/REHVOLogo';
import { EditProfileModal } from '../profile/EditProfileModal';
import { EditPreferencesModal } from '../profile/EditPreferencesModal';
import { InfoSheetModal, InfoSheetType } from '../profile/InfoSheetModal';
import { UserRole } from '../../types';

interface SettingsScreenProps {
  role?: UserRole;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  role = 'RENTER',
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    notificationPrefs,
    updateNotificationPrefs,
    updateProfile,
    logout,
    deleteAccount,
    showToast,
    myFlatmateProfile,
  } = useAppStore();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditPrefsOpen, setIsEditPrefsOpen] = useState(false);
  const [infoSheetType, setInfoSheetType] = useState<InfoSheetType>(null);

  // Toggle notification preference
  const handleTogglePref = useCallback(
    (key: keyof typeof notificationPrefs) => {
      const updatedValue = !notificationPrefs[key];
      updateNotificationPrefs({ [key]: updatedValue });
    },
    [notificationPrefs, updateNotificationPrefs],
  );

  // Logout handler
  const handleLogout = useCallback(() => {
    Alert.alert(
      'Log Out of REHVO?',
      'You will need to sign in again to access your account, saved homes, and messages.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ],
    );
  }, [logout, router]);

  // Delete account handler
  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete your REHVO account?',
      'This action is permanent and cannot be undone. All your profile data, saved properties, visits, listings, and messages will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            deleteAccount();
            logout();
            router.replace('/(auth)/login');
          },
        },
      ],
    );
  }, [deleteAccount, logout, router]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Header */}
      <View style={styles.headerBar}>
        <Pressable
          style={styles.headerBackBtn}
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back to profile"
        >
          <ArrowLeft size={20} color="#171522" strokeWidth={2.2} />
        </Pressable>

        <Text style={styles.headerTitle}>Settings</Text>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
      >
        {/* 2. ACCOUNT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.groupedCard}>
            <SettingsActionRow
              icon={<User size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="Personal Information"
              subtitle={user?.name ? `${user.name} • ${user.occupation || 'Member'}` : 'Name & occupation'}
              onPress={() => setIsEditProfileOpen(true)}
            />
            <View style={styles.divider} />
            <SettingsActionRow
              icon={<Phone size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="Email & Phone"
              subtitle={user?.email || user?.phone || 'Manage contact details'}
              badgeText="Verified"
              badgeType="success"
              onPress={() => setIsEditProfileOpen(true)}
            />
            <View style={styles.divider} />
            <SettingsActionRow
              icon={<BadgeCheck size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="Verification Hub"
              subtitle="Phone, email & government ID review"
              badgeText={user?.verification_status === 'VERIFIED' ? 'Verified' : 'Under Review'}
              badgeType={user?.verification_status === 'VERIFIED' ? 'success' : 'warning'}
              onPress={() => setInfoSheetType('verification')}
            />
            <View style={styles.divider} />
            <SettingsActionRow
              icon={<KeyRound size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="Change Password"
              subtitle="Update account login password"
              onPress={() => setInfoSheetType('password')}
            />
          </View>
        </View>

        {/* 3. PREFERENCES (Role-Aware) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {role === 'RENTER' ? 'RENTAL PREFERENCES' : 'LISTING PREFERENCES'}
          </Text>
          <View style={styles.groupedCard}>
            {role === 'RENTER' ? (
              <>
                <SettingsActionRow
                  icon={<Sliders size={18} color="#6C4DFF" strokeWidth={2} />}
                  iconBg="#F0ECFF"
                  title="Rental Preferences"
                  subtitle="Budget, locations, BHK & furnishing"
                  onPress={() => setIsEditPrefsOpen(true)}
                />
                <View style={styles.divider} />
                <SettingsActionRow
                  icon={<MapPin size={18} color="#6C4DFF" strokeWidth={2} />}
                  iconBg="#F0ECFF"
                  title="Preferred Locations"
                  subtitle={
                    user?.locality
                      ? `${user.locality}, ${user.city || 'Mumbai'}`
                      : 'Andheri West, Bandra, Powai'
                  }
                  onPress={() => setIsEditPrefsOpen(true)}
                />
                <View style={styles.divider} />
                <SettingsActionRow
                  icon={<Wallet size={18} color="#6C4DFF" strokeWidth={2} />}
                  iconBg="#F0ECFF"
                  title="Budget & Property Type"
                  subtitle={
                    user?.budget_max
                      ? `Up to ₹${(user.budget_max / 1000).toFixed(0)}K / mo`
                      : 'Set budget limits'
                  }
                  onPress={() => setIsEditPrefsOpen(true)}
                />
                <View style={styles.divider} />
                <SettingsActionRow
                  icon={<CalendarDays size={18} color="#6C4DFF" strokeWidth={2} />}
                  iconBg="#F0ECFF"
                  title="Move-in Preferences"
                  subtitle={user?.move_in_date ? `Target: ${user.move_in_date}` : 'Set move-in readiness'}
                  onPress={() => setIsEditPrefsOpen(true)}
                />
                <View style={styles.divider} />
                <SettingsActionRow
                  icon={<Users size={18} color="#6C4DFF" strokeWidth={2} />}
                  iconBg="#F0ECFF"
                  title="Flatmate Preferences"
                  subtitle={
                    myFlatmateProfile
                      ? `${myFlatmateProfile.looking_for || 'Roommate'} • ${myFlatmateProfile.locality || 'Mumbai'}`
                      : 'Roommate discovery & lifestyle preferences'
                  }
                  onPress={() => {
                    if (myFlatmateProfile) {
                      router.push('/(renter)/flatmate/my-profile');
                    } else {
                      router.push('/(renter)/flatmate/create');
                    }
                  }}
                />
              </>
            ) : (
              <>
                <SettingsActionRow
                  icon={<Building2 size={18} color="#6C4DFF" strokeWidth={2} />}
                  iconBg="#F0ECFF"
                  title="Listing Preferences"
                  subtitle="Manage pricing, availability & deposits"
                  onPress={() => router.push('/(owner)/properties')}
                />
                <View style={styles.divider} />
                <SettingsActionRow
                  icon={<MessageCircle size={18} color="#6C4DFF" strokeWidth={2} />}
                  iconBg="#F0ECFF"
                  title="Enquiry Preferences"
                  subtitle="Tenant screening & instant enquiry chats"
                  onPress={() => router.push('/(owner)/enquiries')}
                />
                <View style={styles.divider} />
                <SettingsActionRow
                  icon={<CalendarDays size={18} color="#6C4DFF" strokeWidth={2} />}
                  iconBg="#F0ECFF"
                  title="Visit Preferences"
                  subtitle="Visit scheduling & inspection hours"
                  onPress={() => router.push('/(owner)/visits')}
                />
              </>
            )}
          </View>
        </View>

        {/* 4. NOTIFICATIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          <View style={styles.groupedCard}>
            <SettingsSwitchRow
              icon={<Bell size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="Push Notifications"
              subtitle="Master alerts on your device"
              value={notificationPrefs.messages}
              onValueChange={() => handleTogglePref('messages')}
            />
            <View style={styles.divider} />
            <SettingsSwitchRow
              icon={<MessageCircle size={18} color="#10B981" strokeWidth={2} />}
              iconBg="#D1FAE5"
              title="New Messages & Chats"
              subtitle="Direct messages and conversation alerts"
              value={notificationPrefs.messages}
              onValueChange={() => handleTogglePref('messages')}
            />
            <View style={styles.divider} />
            <SettingsSwitchRow
              icon={<Clock size={18} color="#0EA5E9" strokeWidth={2} />}
              iconBg="#E0F2FE"
              title={role === 'RENTER' ? 'Visit Reminders' : 'Visit Requests & Reminders'}
              subtitle="Notifications for upcoming visits"
              value={notificationPrefs.visits}
              onValueChange={() => handleTogglePref('visits')}
            />
            <View style={styles.divider} />
            <SettingsSwitchRow
              icon={<Building2 size={18} color="#8B5CF6" strokeWidth={2} />}
              iconBg="#EDE9FE"
              title={role === 'RENTER' ? 'Listing Updates & Price Drops' : 'Listing Approvals & Updates'}
              subtitle="Price alerts and property status updates"
              value={notificationPrefs.property_updates}
              onValueChange={() => handleTogglePref('property_updates')}
            />
            <View style={styles.divider} />
            <SettingsSwitchRow
              icon={<Sparkles size={18} color="#F59E0B" strokeWidth={2} />}
              iconBg="#FEF3C7"
              title="Recommendations & News"
              subtitle="Personalized property suggestions"
              value={notificationPrefs.marketing}
              onValueChange={() => handleTogglePref('marketing')}
            />
          </View>
        </View>

        {/* 5. PRIVACY & SECURITY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRIVACY & SECURITY</Text>
          <View style={styles.groupedCard}>
            <SettingsActionRow
              icon={<ShieldCheck size={18} color="#777482" strokeWidth={2} />}
              title="Privacy Settings"
              subtitle="Profile visibility & contact privacy"
              onPress={() => setInfoSheetType('privacy')}
            />
            <View style={styles.divider} />
            <SettingsActionRow
              icon={<Lock size={18} color="#777482" strokeWidth={2} />}
              title="Security"
              subtitle="Active sessions & authentication protection"
              onPress={() => setInfoSheetType('password')}
            />
          </View>
        </View>

        {/* 6. SUPPORT & SAFETY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT & SAFETY</Text>
          <View style={styles.groupedCard}>
            <SettingsActionRow
              icon={<HelpCircle size={18} color="#777482" strokeWidth={2} />}
              title="Help & Support"
              subtitle="FAQs, WhatsApp & Email concierge"
              onPress={() => setInfoSheetType('help')}
            />
            <View style={styles.divider} />
            <SettingsActionRow
              icon={<LifeBuoy size={18} color="#777482" strokeWidth={2} />}
              title="Safety Center"
              subtitle="Verification tips & fraud prevention"
              onPress={() => setInfoSheetType('safety')}
            />
            <View style={styles.divider} />
            <SettingsActionRow
              icon={<AlertCircle size={18} color="#777482" strokeWidth={2} />}
              title="Report a Problem"
              subtitle="Report suspicious listing, user, or bug"
              onPress={() => setInfoSheetType('safety')}
            />
          </View>
        </View>

        {/* 7. LEGAL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LEGAL</Text>
          <View style={styles.groupedCard}>
            <SettingsActionRow
              icon={<FileText size={18} color="#777482" strokeWidth={2} />}
              title="Terms of Service"
              subtitle="Platform usage terms and zero-brokerage rules"
              onPress={() => setInfoSheetType('terms')}
            />
            <View style={styles.divider} />
            <SettingsActionRow
              icon={<Shield size={18} color="#777482" strokeWidth={2} />}
              title="Privacy Policy"
              subtitle="How REHVO protects and handles your data"
              onPress={() => setInfoSheetType('terms')}
            />
          </View>
        </View>

        {/* 8. ABOUT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <View style={styles.groupedCard}>
            <SettingsActionRow
              icon={<Info size={18} color="#777482" strokeWidth={2} />}
              title="About REHVO"
              subtitle="Brand story, technology & mission"
              onPress={() => setInfoSheetType('about')}
            />
            <View style={styles.divider} />
            <View style={styles.row}>
              <View style={[styles.rowIconContainer, { backgroundColor: '#F8F7F4' }]}>
                <Building2 size={18} color="#777482" strokeWidth={2} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>App Version</Text>
                <Text style={styles.rowSubtitle}>v1.0.0 (Production Build)</Text>
              </View>
              <View style={styles.staticPill}>
                <Text style={styles.staticPillText}>Latest</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 9. ACCOUNT ACTIONS */}
        <View style={styles.section}>
          <View style={styles.groupedCard}>
            <SettingsActionRow
              icon={<LogOut size={18} color="#E5484D" strokeWidth={2} />}
              iconBg="#FEE2E2"
              title="Log Out"
              subtitle="Sign out of your REHVO account"
              titleColor="#E5484D"
              onPress={handleLogout}
            />
            <View style={styles.divider} />
            <SettingsActionRow
              icon={<Trash2 size={18} color="#E5484D" strokeWidth={2} />}
              iconBg="#FEE2E2"
              title="Delete Account"
              subtitle="Permanently delete account and all saved data"
              titleColor="#E5484D"
              onPress={handleDeleteAccount}
            />
          </View>
        </View>

        {/* 10. BRAND FOOTER */}
        <View style={styles.footerBrandSection}>
          <REHVOLogo size="small" containerStyle={{ marginBottom: 6 }} />
          <Text style={styles.copyrightText}>Find a place. Find your people.</Text>
          <Text style={styles.copyrightSub}>Engineered for Mumbai, India</Text>
        </View>
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        visible={isEditProfileOpen}
        user={user}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={(data) => {
          updateProfile(data);
          showToast('Profile updated', 'success');
        }}
      />

      <EditPreferencesModal
        visible={isEditPrefsOpen}
        user={user}
        onClose={() => setIsEditPrefsOpen(false)}
        onSave={(data) => {
          updateProfile(data);
          showToast('Preferences saved', 'success');
        }}
      />

      <InfoSheetModal
        type={infoSheetType}
        onClose={() => setInfoSheetType(null)}
        onToast={showToast}
      />
    </SafeAreaView>
  );
};

// Row Components
interface SettingsActionRowProps {
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  titleColor?: string;
  badgeText?: string;
  badgeType?: 'success' | 'warning' | 'neutral';
  onPress: () => void;
}

function SettingsActionRow({
  icon,
  iconBg = '#F8F7F4',
  title,
  subtitle,
  titleColor = '#171522',
  badgeText,
  badgeType = 'neutral',
  onPress,
}: SettingsActionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && styles.rowPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${title}${subtitle ? `, ${subtitle}` : ''}`}
    >
      <View style={[styles.rowIconContainer, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowTitle, { color: titleColor }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.rowSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {badgeText ? (
        <View
          style={[
            styles.badgePill,
            badgeType === 'success' && styles.badgeSuccess,
            badgeType === 'warning' && styles.badgeWarning,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              badgeType === 'success' && styles.badgeTextSuccess,
              badgeType === 'warning' && styles.badgeTextWarning,
            ]}
          >
            {badgeText}
          </Text>
        </View>
      ) : null}
      <ChevronRight size={16} color="#A39EB0" strokeWidth={2} />
    </Pressable>
  );
}

interface SettingsSwitchRowProps {
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}

function SettingsSwitchRow({
  icon,
  iconBg = '#F8F7F4',
  title,
  subtitle,
  value,
  onValueChange,
}: SettingsSwitchRowProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.rowIconContainer, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.rowSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E5E7EB', true: '#6C4DFF' }}
        thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEE9',
  },
  headerBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 22,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777482',
    letterSpacing: 0.6,
  },
  groupedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    minHeight: 54,
  },
  rowPressed: {
    backgroundColor: '#F9F8F6',
  },
  rowIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
    gap: 2,
    paddingRight: 8,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
    color: '#171522',
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '400',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#F0ECFF',
    marginRight: 6,
  },
  badgeSuccess: {
    backgroundColor: '#DCFCE7',
  },
  badgeWarning: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  badgeTextSuccess: {
    color: '#16A34A',
  },
  badgeTextWarning: {
    color: '#D97706',
  },
  staticPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  staticPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  divider: {
    height: 0.5,
    backgroundColor: '#F0EDF5',
    marginLeft: 58,
  },
  footerBrandSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 8,
    gap: 3,
  },
  copyrightText: {
    fontSize: 13,
    color: '#171522',
    fontWeight: '700',
  },
  copyrightSub: {
    fontSize: 11,
    color: '#A39EB0',
    fontWeight: '500',
  },
});
