import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Heart,
  CalendarDays,
  MessageCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
  Building2,
  Bell,
  Lock,
  LifeBuoy,
  HelpCircle,
  LogOut,
  Trash2,
  MapPin,
  Sparkles,
  Sliders,
  Users,
  PlusCircle,
  Eye,
  PauseCircle,
  PlayCircle,
  Pencil,
  ArrowRightLeft,
  Wallet,
  Calendar,
  CheckCircle2,
  Clock,
  Settings,
  MessageSquareText,
  Building,
  Shield,
  FileCheck,
  ExternalLink,
} from 'lucide-react-native';
import { useAppStore, selectUserCapabilities } from '../../store/useAppStore';
import { REHVOLogo } from '../brand/REHVOLogo';
import { ProfileAvatarEditor } from './ProfileAvatarEditor';
import { EditProfileModal } from './EditProfileModal';
import { EditPreferencesModal } from './EditPreferencesModal';
import { VisitsModal } from './VisitsModal';
import { ApplicationsModal } from './ApplicationsModal';
import { EnquiriesModal } from './EnquiriesModal';
import { ModeSwitcherModal } from '../common/ModeSwitcherModal';
import { InfoSheetModal, InfoSheetType } from './InfoSheetModal';
import { NotificationsModal } from '../notifications/NotificationsModal';

interface ProfileHubScreenProps {
  initialRole?: 'RENTER' | 'OWNER';
}

export const ProfileHubScreen: React.FC<ProfileHubScreenProps> = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    user,
    isAuthenticated,
    properties,
    myProperties,
    savedPropertyIds,
    savedFlatmateIds,
    visits,
    applications,
    enquiries,
    conversations,
    myFlatmateProfile,
    flatmateDraft,
    unreadNotificationCount,
    pauseFlatmateProfile,
    resumeFlatmateProfile,
    updateProfile,
    switchRole,
    fetchVisits,
    fetchEnquiries,
    fetchNotifications,
    fetchConversations,
    fetchMyProperties,
    initializeFromStorage,
    logout,
    deleteAccount,
    showToast,
  } = useAppStore();

  // Active Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditPrefsOpen, setIsEditPrefsOpen] = useState(false);
  const [isVisitsOpen, setIsVisitsOpen] = useState(false);
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);
  const [isEnquiriesOpen, setIsEnquiriesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isModeSwitcherOpen, setIsModeSwitcherOpen] = useState(false);
  const [infoSheetType, setInfoSheetType] = useState<InfoSheetType>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initial Real Data Fetch
  useEffect(() => {
    fetchVisits();
    fetchEnquiries();
    fetchNotifications();
    fetchConversations();
    fetchMyProperties();
  }, [fetchVisits, fetchEnquiries, fetchNotifications, fetchConversations, fetchMyProperties]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        initializeFromStorage(),
        fetchVisits(),
        fetchEnquiries(),
        fetchNotifications(),
        fetchConversations(),
        fetchMyProperties(),
      ]);
    } catch (e) {
      console.warn('[REHVO PROFILE] Refresh error:', e);
    } finally {
      setIsRefreshing(false);
    }
  }, [initializeFromStorage, fetchVisits, fetchEnquiries, fetchNotifications, fetchConversations, fetchMyProperties]);

  // Derive real capabilities from data
  const capabilities = useMemo(() => {
    return selectUserCapabilities({
      user,
      properties,
      myFlatmateProfile,
      flatmateDraft,
    });
  }, [user, properties, myFlatmateProfile, flatmateDraft]);

  const {
    userProperties,
    hasPropertyListing,
    hasFlatmateProfile,
    hasPublishedFlatmateProfile,
    hasFlatmateDraft,
    isFlatmatePaused,
    isBothOwnerAndFlatmate,
  } = capabilities;

  const isVerified = user?.verification_status === 'VERIFIED';

  // Dynamic role badge in profile hero
  const roleBadgeText = useMemo(() => {
    if (isBothOwnerAndFlatmate) return 'Owner & Flatmate';
    if (hasPropertyListing) return 'Property Owner';
    if (hasPublishedFlatmateProfile) return isFlatmatePaused ? 'Flatmate (Paused)' : 'Verified Flatmate';
    return 'Verified Member';
  }, [isBothOwnerAndFlatmate, hasPropertyListing, hasPublishedFlatmateProfile, isFlatmatePaused]);

  // Unread counts from real data
  const unreadMessagesCount = useMemo(() => {
    return conversations.filter((c) => (c.unread_count || 0) > 0).length;
  }, [conversations]);

  // Logout handler
  const handleLogout = useCallback(() => {
    Alert.alert(
      'Log Out of REHVO?',
      'You will need to log in again to access your saved homes, visits, and account activity.',
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
      'Delete your account?',
      'This action is permanent and cannot be undone. All your saved properties, scheduled visits, applications, and profile information will be permanently removed.',
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

  // Format Budget String
  const budgetFormatted = `₹${(user?.budget_min || 20000).toLocaleString('en-IN')} – ₹${(user?.budget_max || 60000).toLocaleString('en-IN')} / mo`;

  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loggedOutWrap}>
          <View style={styles.loggedOutIconBox}>
            <Users size={36} color="#6C4DFF" strokeWidth={2} />
          </View>
          <Text style={styles.loggedOutTitle}>Sign in to REHVO</Text>
          <Text style={styles.loggedOutSub}>
            Access your saved homes, inquiries, flatmate connections, and account settings.
          </Text>
          <Pressable
            style={styles.signInBtn}
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text style={styles.signInBtnText}>Log In or Sign Up</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 1. Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile Hub</Text>
        <Pressable
          onPress={() => router.push('/(renter)/settings')}
          hitSlop={8}
          style={styles.headerIconBtn}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <Settings size={20} color="#171522" strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 100 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#6C4DFF"
            colors={['#6C4DFF']}
          />
        }
      >
        {/* 2. Compact Profile Header Card */}
        <View style={styles.heroCard}>
          <ProfileAvatarEditor
            uri={user?.avatar}
            name={user?.name}
            size={58}
            editable={true}
            containerStyle={{ marginRight: 14 }}
          />

          <View style={styles.heroInfo}>
            <View style={styles.heroNameRow}>
              <Text style={styles.heroName} numberOfLines={1}>
                {user?.name || 'Member'}
              </Text>
            </View>

            <Text style={styles.heroContact} numberOfLines={1}>
              {user?.email || user?.phone || 'Verified Account'}
            </Text>

            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.roleBadge,
                  (hasPropertyListing || hasPublishedFlatmateProfile) && styles.roleBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.roleBadgeText,
                    (hasPropertyListing || hasPublishedFlatmateProfile) && styles.roleBadgeTextActive,
                  ]}
                >
                  {roleBadgeText}
                </Text>
              </View>

              {isVerified ? (
                <View style={styles.verifiedTag}>
                  <CheckCircle2 size={12} color="#10B981" strokeWidth={2.4} />
                  <Text style={styles.verifiedTagText}>Verified</Text>
                </View>
              ) : (
                <Pressable
                  onPress={() => setInfoSheetType('verification')}
                  style={styles.unverifiedTag}
                  hitSlop={4}
                >
                  <Clock size={11} color="#6C4DFF" strokeWidth={2} />
                  <Text style={styles.unverifiedTagText}>Get Verified</Text>
                </Pressable>
              )}
            </View>
          </View>

          <Pressable
            onPress={() => setIsEditProfileOpen(true)}
            style={styles.editHeroBtn}
            accessibilityRole="button"
            accessibilityLabel="Edit Profile"
          >
            <Pencil size={13} color="#6C4DFF" strokeWidth={2.2} />
            <Text style={styles.editHeroBtnText}>Edit</Text>
          </Pressable>
        </View>

        {/* 3. Section: MY ACTIVITY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MY ACTIVITY</Text>
          <View style={styles.groupedCard}>
            <ProfileRow
              icon={<Heart size={18} color="#6C4DFF" strokeWidth={2.2} />}
              iconBg="#F0ECFF"
              title="Saved Properties"
              subtitle="Shortlisted homes & rentals"
              badgeCount={savedPropertyIds.length}
              onPress={() => router.push('/(renter)/saved')}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<Users size={18} color="#0EA5E9" strokeWidth={2.2} />}
              iconBg="#E0F2FE"
              title="Saved Flatmates"
              subtitle="Shortlisted roommate profiles"
              badgeCount={savedFlatmateIds.length}
              onPress={() => router.push('/(renter)/saved')}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<MessageSquareText size={18} color="#8B5CF6" strokeWidth={2.2} />}
              iconBg="#EDE9FE"
              title="My Inquiries"
              subtitle="Questions sent to property owners"
              badgeCount={enquiries.length}
              onPress={() => setIsEnquiriesOpen(true)}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<CalendarDays size={18} color="#10B981" strokeWidth={2.2} />}
              iconBg="#D1FAE5"
              title="Scheduled Visits"
              subtitle="Confirmed & upcoming property tours"
              badgeCount={visits.length}
              onPress={() => setIsVisitsOpen(true)}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<MessageCircle size={18} color="#3B82F6" strokeWidth={2.2} />}
              iconBg="#DBEAFE"
              title="Messages & Chats"
              subtitle="Direct chats with hosts & flatmates"
              badgeCount={unreadMessagesCount}
              onPress={() => router.push('/(renter)/chat')}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<Bell size={18} color="#F59E0B" strokeWidth={2.2} />}
              iconBg="#FEF3C7"
              title="Notifications"
              subtitle="System updates, visits & enquiry alerts"
              badgeCount={unreadNotificationCount}
              onPress={() => setIsNotificationsOpen(true)}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<FileText size={18} color="#6366F1" strokeWidth={2.2} />}
              iconBg="#EEF2FF"
              title="Rental Applications"
              subtitle="Track submitted rental applications"
              badgeCount={applications.length}
              onPress={() => setIsApplicationsOpen(true)}
            />
          </View>
        </View>

        {/* 4. Section: PROPERTY & HOSTING */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>PROPERTY & HOSTING</Text>
            {hasPropertyListing && (
              <View style={styles.ownerBadgePill}>
                <Text style={styles.ownerBadgeText}>
                  {userProperties.length} {userProperties.length === 1 ? 'Listing' : 'Listings'}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.groupedCard}>
            {hasPropertyListing ? (
              <>
                <ProfileRow
                  icon={<Building2 size={18} color="#6C4DFF" strokeWidth={2.2} />}
                  iconBg="#F0ECFF"
                  title="My Properties"
                  subtitle="Manage pricing, photos & availability"
                  badgeCount={userProperties.length}
                  onPress={() => {
                    switchRole('OWNER');
                    router.push('/(owner)/properties');
                  }}
                />
                <View style={styles.divider} />
                <ProfileRow
                  icon={<Building size={18} color="#10B981" strokeWidth={2.2} />}
                  iconBg="#D1FAE5"
                  title="Owner Dashboard"
                  subtitle="Occupancy, metrics & inquiry overview"
                  badge="Workspace"
                  onPress={() => {
                    switchRole('OWNER');
                    router.push('/(owner)/dashboard');
                  }}
                />
                <View style={styles.divider} />
                <ProfileRow
                  icon={<PlusCircle size={18} color="#6C4DFF" strokeWidth={2.2} />}
                  iconBg="#F0ECFF"
                  title="List Another Property"
                  subtitle="Add a flat, room, PG or studio"
                  onPress={() => router.push('/(renter)/listing/property-type')}
                />
              </>
            ) : (
              <ProfileRow
                icon={<Building2 size={18} color="#6C4DFF" strokeWidth={2.2} />}
                iconBg="#F0ECFF"
                title="List a Property"
                subtitle="Rent out your apartment, room or PG"
                badge="Zero Brokerage"
                onPress={() => router.push('/(renter)/listing/property-type')}
              />
            )}
          </View>
        </View>

        {/* 5. Section: FLATMATE COMMUNITY */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>FLATMATE COMMUNITY</Text>
            {hasFlatmateProfile && (
              <View style={[styles.liveBadge, isFlatmatePaused && styles.pausedBadge]}>
                <View style={[styles.liveDot, isFlatmatePaused && styles.pausedDot]} />
                <Text style={[styles.liveBadgeText, isFlatmatePaused && styles.pausedBadgeText]}>
                  {isFlatmatePaused ? 'Paused' : 'Live'}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.groupedCard}>
            {hasFlatmateProfile && myFlatmateProfile ? (
              <>
                <ProfileRow
                  icon={<Users size={18} color="#0EA5E9" strokeWidth={2.2} />}
                  iconBg="#E0F2FE"
                  title="My Flatmate Profile"
                  subtitle={`${myFlatmateProfile.locality || 'Mumbai'} • ₹${(myFlatmateProfile.budget_max || 35000).toLocaleString('en-IN')}/mo`}
                  onPress={() => router.push('/(renter)/flatmate/my-profile')}
                />
                <View style={styles.divider} />
                <ProfileRow
                  icon={<Pencil size={18} color="#6C4DFF" strokeWidth={2.2} />}
                  iconBg="#F0ECFF"
                  title="Edit Flatmate Profile"
                  subtitle="Update budget, photos & lifestyle preferences"
                  onPress={() => router.push('/(renter)/flatmate/edit')}
                />
                <View style={styles.divider} />
                <ProfileRow
                  icon={
                    isFlatmatePaused ? (
                      <PlayCircle size={18} color="#10B981" strokeWidth={2.2} />
                    ) : (
                      <PauseCircle size={18} color="#716E7D" strokeWidth={2.2} />
                    )
                  }
                  iconBg={isFlatmatePaused ? '#D1FAE5' : '#F4F4F5'}
                  title={isFlatmatePaused ? 'Resume Flatmate Profile' : 'Pause Flatmate Profile'}
                  subtitle={
                    isFlatmatePaused
                      ? 'Make your roommate card visible in feed'
                      : 'Temporarily hide profile from discovery'
                  }
                  onPress={async () => {
                    if (isFlatmatePaused) {
                      await resumeFlatmateProfile(myFlatmateProfile.id);
                      showToast('Flatmate profile is now live', 'success');
                    } else {
                      await pauseFlatmateProfile(myFlatmateProfile.id);
                      showToast('Flatmate profile paused', 'info');
                    }
                  }}
                />
              </>
            ) : (
              <>
                <ProfileRow
                  icon={<Users size={18} color="#0EA5E9" strokeWidth={2.2} />}
                  iconBg="#E0F2FE"
                  title="Find Flatmates"
                  subtitle="Explore verified prospective roommates"
                  onPress={() => router.push('/(renter)/flatmates')}
                />
                <View style={styles.divider} />
                <ProfileRow
                  icon={<PlusCircle size={18} color="#6C4DFF" strokeWidth={2.2} />}
                  iconBg="#F0ECFF"
                  title={hasFlatmateDraft ? 'Continue Flatmate Profile' : 'Create Flatmate Profile'}
                  subtitle="Get discovered by people looking for roommates"
                  badge={hasFlatmateDraft ? 'Draft' : undefined}
                  onPress={() => router.push('/(renter)/flatmate/create')}
                />
              </>
            )}
          </View>
        </View>

        {/* 6. Section: RENTAL PREFERENCES */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>RENTAL PREFERENCES</Text>
            <Pressable
              onPress={() => setIsEditPrefsOpen(true)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Edit rental preferences"
            >
              <Text style={styles.editSectionLink}>Edit</Text>
            </Pressable>
          </View>

          <View style={styles.groupedCard}>
            <ProfileRow
              icon={<Wallet size={18} color="#6C4DFF" strokeWidth={2.2} />}
              iconBg="#F0ECFF"
              title="Target Budget"
              subtitle={budgetFormatted}
              onPress={() => setIsEditPrefsOpen(true)}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<MapPin size={18} color="#6C4DFF" strokeWidth={2.2} />}
              iconBg="#F0ECFF"
              title="Preferred Localities"
              subtitle={user?.locality || 'Mumbai Localities'}
              onPress={() => setIsEditPrefsOpen(true)}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<Building2 size={18} color="#6C4DFF" strokeWidth={2.2} />}
              iconBg="#F0ECFF"
              title="BHK & Furnishing"
              subtitle="1 BHK / 2 BHK • Furnished / Semi"
              onPress={() => setIsEditPrefsOpen(true)}
            />
          </View>
        </View>

        {/* 7. Section: TRUST & SAFETY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TRUST & SAFETY</Text>
          <View style={styles.groupedCard}>
            <ProfileRow
              icon={<ShieldCheck size={18} color="#10B981" strokeWidth={2.2} />}
              iconBg="#D1FAE5"
              title="Identity & Verification"
              subtitle="Government ID verification standards"
              badge={isVerified ? 'Verified' : 'Pending'}
              onPress={() => setInfoSheetType('verification')}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<Shield size={18} color="#3B82F6" strokeWidth={2.2} />}
              iconBg="#DBEAFE"
              title="Safety & Rental Guidelines"
              subtitle="Zero-scam policy & secure visitation rules"
              onPress={() => setInfoSheetType('safety')}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<Lock size={18} color="#6C4DFF" strokeWidth={2.2} />}
              iconBg="#F0ECFF"
              title="Privacy & Data Control"
              subtitle="How your information is protected & shared"
              onPress={() => setInfoSheetType('privacy')}
            />
          </View>
        </View>

        {/* 8. Section: SUPPORT & HELP */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT & HELP</Text>
          <View style={styles.groupedCard}>
            <ProfileRow
              icon={<HelpCircle size={18} color="#0EA5E9" strokeWidth={2.2} />}
              iconBg="#E0F2FE"
              title="Help Center & FAQs"
              subtitle="Common questions about renting & hosting"
              onPress={() => setInfoSheetType('help')}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<LifeBuoy size={18} color="#8B5CF6" strokeWidth={2.2} />}
              iconBg="#EDE9FE"
              title="Terms & Community Standards"
              subtitle="REHVO community code of conduct"
              onPress={() => setInfoSheetType('terms')}
            />
          </View>
        </View>

        {/* 9. Section: SETTINGS & SYSTEM */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SETTINGS & SYSTEM</Text>
          <View style={styles.groupedCard}>
            <ProfileRow
              icon={<ArrowRightLeft size={18} color="#6C4DFF" strokeWidth={2.2} />}
              iconBg="#F0ECFF"
              title="Switch Experience Mode"
              subtitle="Toggle between Renter, Lister and Flatmate modes"
              onPress={() => setIsModeSwitcherOpen(true)}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<Settings size={18} color="#6C4DFF" strokeWidth={2.2} />}
              iconBg="#F0ECFF"
              title="App & Account Settings"
              subtitle="Notifications, security & preferences"
              onPress={() => router.push('/(renter)/settings')}
            />
          </View>
        </View>

        {/* 10. Section: ACCOUNT ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT ACTIONS</Text>
          <View style={styles.groupedCard}>
            <ProfileRow
              icon={<LogOut size={18} color="#E5484D" strokeWidth={2.2} />}
              iconBg="#FEE2E2"
              title="Log Out"
              subtitle="Sign out of this device"
              titleColor="#E5484D"
              onPress={handleLogout}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<Trash2 size={18} color="#DC2626" strokeWidth={2.2} />}
              iconBg="#FEE2E2"
              title="Delete Account"
              subtitle="Permanently erase account data"
              titleColor="#DC2626"
              onPress={handleDeleteAccount}
            />
          </View>
        </View>

        {/* 11. Brand Stamp Footer */}
        <View style={styles.footerStamp}>
          <REHVOLogo size="small" containerStyle={{ marginBottom: 6 }} />
          <Text style={styles.footerVersion}>REHVO v1.0.0 • Mumbai, India</Text>
        </View>
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        visible={isEditProfileOpen}
        user={user}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={(data) => {
          updateProfile(data);
          showToast('Profile updated successfully', 'success');
        }}
      />

      <EditPreferencesModal
        visible={isEditPrefsOpen}
        user={user}
        onClose={() => setIsEditPrefsOpen(false)}
        onSave={(data) => {
          updateProfile(data);
          showToast('Rental preferences saved', 'success');
        }}
      />

      <VisitsModal
        visible={isVisitsOpen}
        visits={visits}
        onClose={() => setIsVisitsOpen(false)}
      />

      <ApplicationsModal
        visible={isApplicationsOpen}
        applications={applications}
        onClose={() => setIsApplicationsOpen(false)}
      />

      <EnquiriesModal
        visible={isEnquiriesOpen}
        onClose={() => setIsEnquiriesOpen(false)}
      />

      <NotificationsModal
        visible={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <ModeSwitcherModal
        visible={isModeSwitcherOpen}
        onClose={() => setIsModeSwitcherOpen(false)}
      />

      <InfoSheetModal
        type={infoSheetType}
        onClose={() => setInfoSheetType(null)}
        onToast={showToast}
      />
    </SafeAreaView>
  );
};

// Reusable Profile Row Component
interface ProfileRowProps {
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeCount?: number;
  titleColor?: string;
  onPress?: () => void;
}

function ProfileRow({
  icon,
  iconBg = '#F0ECFF',
  title,
  subtitle,
  badge,
  badgeCount,
  titleColor = '#171522',
  onPress,
}: ProfileRowProps) {
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

      <View style={styles.rowRight}>
        {badge ? (
          <View style={styles.textPillBadge}>
            <Text style={styles.textPillBadgeText}>{badge}</Text>
          </View>
        ) : badgeCount !== undefined && badgeCount > 0 ? (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{badgeCount}</Text>
          </View>
        ) : null}
        <ChevronRight size={17} color="#A19EAA" strokeWidth={2.2} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEE9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F4F2EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Hero Card
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFECE6',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#171522',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  heroInfo: {
    flex: 1,
  },
  heroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  heroName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  heroContact: {
    fontSize: 13,
    fontWeight: '500',
    color: '#716E7D',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleBadge: {
    backgroundColor: '#F4F2EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleBadgeActive: {
    backgroundColor: '#ECE8FF',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#716E7D',
  },
  roleBadgeTextActive: {
    color: '#6C4DFF',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  unverifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  unverifiedTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  editHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4DCFD',
  },
  editHeroBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C4DFF',
  },

  // Sections
  section: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8E8B99',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  editSectionLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  ownerBadgePill: {
    backgroundColor: '#ECE8FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ownerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pausedBadge: {
    backgroundColor: '#F4F4F5',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  pausedDot: {
    backgroundColor: '#A19EAA',
  },
  liveBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  pausedBadgeText: {
    color: '#716E7D',
  },

  // Grouped Cards
  groupedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFECE6',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#171522',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  divider: {
    height: 1,
    backgroundColor: '#F4F2EC',
    marginLeft: 56,
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  rowPressed: {
    backgroundColor: '#FAF9F6',
  },
  rowIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#171522',
    letterSpacing: -0.2,
    marginBottom: 1,
  },
  rowSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8B99',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    backgroundColor: '#6C4DFF',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  textPillBadge: {
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  textPillBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C4DFF',
  },

  // Footer
  footerStamp: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 24,
  },
  footerVersion: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A19EAA',
    letterSpacing: 0.2,
  },

  // Logged out
  loggedOutWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loggedOutIconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#ECE8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loggedOutTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  loggedOutSub: {
    fontSize: 14,
    fontWeight: '500',
    color: '#716E7D',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  signInBtn: {
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  signInBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
