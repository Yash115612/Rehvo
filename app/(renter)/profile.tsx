import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
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
  AlertCircle,
  CheckCircle2,
  Clock,
  Settings,
  MessageSquareText,
  Building,
  ArrowRight,
} from 'lucide-react-native';
import { useAppStore, selectUserCapabilities } from '../../src/store/useAppStore';
import { REHVOLogo } from '../../src/components/brand/REHVOLogo';
import { ProfileAvatarEditor } from '../../src/components/profile/ProfileAvatarEditor';
import { EditProfileModal } from '../../src/components/profile/EditProfileModal';
import { EditPreferencesModal } from '../../src/components/profile/EditPreferencesModal';
import { VisitsModal } from '../../src/components/profile/VisitsModal';
import { ApplicationsModal } from '../../src/components/profile/ApplicationsModal';
import { EnquiriesModal } from '../../src/components/profile/EnquiriesModal';
import { ModeSwitcherModal } from '../../src/components/common/ModeSwitcherModal';
import { InfoSheetModal, InfoSheetType } from '../../src/components/profile/InfoSheetModal';
import { NotificationsModal } from '../../src/components/notifications/NotificationsModal';

export default function RenterProfileRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    properties,
    savedPropertyIds,
    savedFlatmateIds,
    visits,
    applications,
    enquiries,
    conversations,
    myFlatmateProfile,
    flatmateDraft,
    pauseFlatmateProfile,
    resumeFlatmateProfile,
    updateProfile,
    switchRole,
    fetchVisits,
    fetchEnquiries,
    unreadNotificationCount,
    logout,
    deleteAccount,
    showToast,
  } = useAppStore();

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditPrefsOpen, setIsEditPrefsOpen] = useState(false);
  const [isVisitsOpen, setIsVisitsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  React.useEffect(() => {
    fetchVisits();
    fetchEnquiries();
  }, [fetchVisits, fetchEnquiries]);
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);
  const [isEnquiriesOpen, setIsEnquiriesOpen] = useState(false);
  const [isModeSwitcherOpen, setIsModeSwitcherOpen] = useState(false);
  const [infoSheetType, setInfoSheetType] = useState<InfoSheetType>(null);

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
    isNormalUserOnly,
    isOwnerOnly,
    isFlatmateOnly,
    isBothOwnerAndFlatmate,
  } = capabilities;

  const isVerified = user?.verification_status === 'VERIFIED';

  // Dynamic role badge in profile hero
  const roleBadgeText = useMemo(() => {
    if (isBothOwnerAndFlatmate) return 'Owner & Flatmate';
    if (hasPropertyListing) return 'Property Owner';
    if (hasPublishedFlatmateProfile) return isFlatmatePaused ? 'Flatmate (Paused)' : 'Verified Flatmate';
    return 'Verified Renter';
  }, [isBothOwnerAndFlatmate, hasPropertyListing, hasPublishedFlatmateProfile, isFlatmatePaused]);

  // Logout handler
  const handleLogout = useCallback(() => {
    Alert.alert(
      'Log Out of REHVO?',
      'You will need to log in again to access your saved homes, visits, and rental preferences.',
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
      'This action is permanent and cannot be undone. All your saved properties, scheduled visits, applications, and preference data will be permanently removed.',
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 1. Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
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
          { paddingBottom: Math.max(insets.bottom, 20) + 110 },
        ]}
      >
        {/* 2. Profile Hero */}
        <View style={styles.heroCard}>
          <ProfileAvatarEditor
            uri={user?.avatar}
            name={user?.name}
            size={56}
            editable={true}
            containerStyle={{ marginRight: 12 }}
          />

          <View style={styles.heroInfo}>
            <View style={styles.heroNameRow}>
              <Text style={styles.heroName} numberOfLines={1}>
                {user?.name || 'Renter User'}
              </Text>
              <View
                style={[
                  styles.roleBadge,
                  (hasPropertyListing || hasPublishedFlatmateProfile) && { backgroundColor: '#ECE8FF' },
                ]}
              >
                <Text
                  style={[
                    styles.roleBadgeText,
                    (hasPropertyListing || hasPublishedFlatmateProfile) && { color: '#6C4DFF' },
                  ]}
                >
                  {roleBadgeText}
                </Text>
              </View>
            </View>

            <Text style={styles.heroContact} numberOfLines={1}>
              {user?.email || user?.phone || '+91 98765 43210'}
            </Text>

            <View style={styles.verificationRow}>
              {isVerified ? (
                <View style={styles.verifiedTag}>
                  <CheckCircle2 size={12} color="#32B768" strokeWidth={2.2} />
                  <Text style={styles.verifiedTagText}>Verified phone</Text>
                </View>
              ) : (
                <View style={styles.unverifiedTag}>
                  <Clock size={12} color="#777482" strokeWidth={2} />
                  <Text style={styles.unverifiedTagText}>Phone verified</Text>
                </View>
              )}
            </View>
          </View>

          <Pressable
            onPress={() => setIsEditProfileOpen(true)}
            style={styles.editHeroBtn}
            accessibilityRole="button"
            accessibilityLabel="Edit Profile"
          >
            <Pencil size={14} color="#6C4DFF" strokeWidth={2} />
            <Text style={styles.editHeroBtnText}>Edit</Text>
          </Pressable>
        </View>

        {/* 3. Section: My Activity (Normal user / renter activity) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MY ACTIVITY</Text>
          <View style={styles.groupedCard}>
            <ProfileRow
              icon={<Heart size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="Saved Properties"
              subtitle="Shortlisted flats, rooms & PGs"
              badgeCount={savedPropertyIds.length}
              onPress={() => router.push('/(renter)/saved')}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<Users size={18} color="#0EA5E9" strokeWidth={2} />}
              iconBg="#E0F2FE"
              title="Saved Flatmates"
              subtitle="Shortlisted roommates & connections"
              badgeCount={savedFlatmateIds.length}
              onPress={() => router.push('/(renter)/saved')}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<MessageSquareText size={18} color="#8B5CF6" strokeWidth={2} />}
              iconBg="#EDE9FE"
              title="My Enquiries"
              subtitle="Responses & queries sent to owners"
              badgeCount={enquiries.length}
              onPress={() => setIsEnquiriesOpen(true)}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<CalendarDays size={18} color="#0EA5E9" strokeWidth={2} />}
              iconBg="#E0F2FE"
              title="Scheduled Visits"
              subtitle="Your upcoming property visits"
              badgeCount={visits.length}
              onPress={() => setIsVisitsOpen(true)}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<MessageCircle size={18} color="#10B981" strokeWidth={2} />}
              iconBg="#D1FAE5"
              title="Messages"
              subtitle="Your conversations with owners & flatmates"
              badgeCount={conversations.filter((c) => c.unread_count > 0).length}
              onPress={() => router.push('/(renter)/chat')}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<FileText size={18} color="#F59E0B" strokeWidth={2} />}
              iconBg="#FEF3C7"
              title="Rental Applications"
              subtitle="Track your submitted applications"
              badgeCount={applications.length}
              onPress={() => setIsApplicationsOpen(true)}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<Bell size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="Notifications"
              subtitle="Alerts for messages, visits & enquiries"
              badgeCount={unreadNotificationCount}
              onPress={() => setIsNotificationsOpen(true)}
            />
          </View>
        </View>

        {/* 4. Section: PROPERTY OWNER WORKSPACE (Shown ONLY when user has property listings) */}
        {hasPropertyListing && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>PROPERTY OWNER</Text>
              <View style={styles.ownerBadgePill}>
                <Text style={styles.ownerBadgeText}>
                  {userProperties.length} {userProperties.length === 1 ? 'Listing' : 'Listings'}
                </Text>
              </View>
            </View>
            <View style={styles.groupedCard}>
              <ProfileRow
                icon={<Building size={18} color="#10B981" strokeWidth={2.2} />}
                iconBg="#D1FAE5"
                title="Property Owner Dashboard"
                subtitle="Overview, occupancy, enquiries & scheduled visits"
                badge="Workspace"
                onPress={() => {
                  switchRole('OWNER');
                  router.push('/(owner)/dashboard');
                }}
              />
              <View style={styles.divider} />
              <ProfileRow
                icon={<Building2 size={18} color="#6C4DFF" strokeWidth={2} />}
                iconBg="#F0ECFF"
                title="My Properties"
                subtitle="Manage pricing, availability & edit details"
                badgeCount={userProperties.length}
                onPress={() => {
                  switchRole('OWNER');
                  router.push('/(owner)/properties');
                }}
              />
              <View style={styles.divider} />
              <ProfileRow
                icon={<MessageSquareText size={18} color="#0EA5E9" strokeWidth={2} />}
                iconBg="#E0F2FE"
                title="Tenant Enquiries"
                subtitle="Incoming prospective renter chats"
                badgeCount={conversations.filter((c) => c.unread_count > 0).length}
                onPress={() => {
                  switchRole('OWNER');
                  router.push('/(owner)/enquiries');
                }}
              />
              <View style={styles.divider} />
              <ProfileRow
                icon={<CalendarDays size={18} color="#F59E0B" strokeWidth={2} />}
                iconBg="#FEF3C7"
                title="Scheduled Visits"
                subtitle="Confirmed & requested property tours"
                badgeCount={visits.filter((v) => v.status === 'REQUESTED').length}
                onPress={() => {
                  switchRole('OWNER');
                  router.push('/(owner)/visits');
                }}
              />
              <View style={styles.divider} />
              <ProfileRow
                icon={<PlusCircle size={18} color="#6C4DFF" strokeWidth={2} />}
                iconBg="#F0ECFF"
                title="List Another Property"
                subtitle="Add a flat, room, PG or studio listing"
                onPress={() => router.push('/(renter)/listing/property-type')}
              />
            </View>
          </View>
        )}

        {/* 5. Section: YOUR FLATMATE PROFILE (Shown when user has a flatmate profile) */}
        {hasFlatmateProfile && myFlatmateProfile && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>FLATMATE</Text>
              <View
                style={[
                  styles.liveBadge,
                  isFlatmatePaused && styles.pausedBadge,
                ]}
              >
                <View style={[styles.liveDot, isFlatmatePaused && styles.pausedDot]} />
                <Text
                  style={[
                    styles.liveBadgeText,
                    isFlatmatePaused && styles.pausedBadgeText,
                  ]}
                >
                  {isFlatmatePaused ? 'Paused / Hidden' : 'Active & Live'}
                </Text>
              </View>
            </View>

            <View style={styles.groupedCard}>
              <View style={styles.flatmateLiveCard}>
                <View style={styles.flatmateHeaderRow}>
                  <View style={styles.flatmateIconBadge}>
                    <Users size={18} color="#6C4DFF" strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.flatmateTitle} numberOfLines={1}>
                      {myFlatmateProfile.name}
                    </Text>
                    <Text style={styles.flatmateSubtitle}>
                      {myFlatmateProfile.locality || 'Mumbai'} • ₹
                      {(myFlatmateProfile.budget_max || 35000).toLocaleString('en-IN')}/mo
                    </Text>
                  </View>
                </View>

                {/* Actions row */}
                <View style={styles.flatmateActionsRow}>
                  <Pressable
                    onPress={() => router.push('/(renter)/flatmate/my-profile')}
                    style={styles.flatmateActionBtn}
                    accessibilityRole="button"
                    accessibilityLabel="View Flatmate Dashboard"
                  >
                    <Eye size={14} color="#171522" strokeWidth={2} />
                    <Text style={styles.flatmateActionBtnText}>Dashboard</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => router.push('/(renter)/flatmate/edit')}
                    style={styles.flatmateActionBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Edit Flatmate Profile"
                  >
                    <Pencil size={14} color="#171522" strokeWidth={2} />
                    <Text style={styles.flatmateActionBtnText}>Edit</Text>
                  </Pressable>

                  {isFlatmatePaused ? (
                    <Pressable
                      onPress={async () => {
                        await resumeFlatmateProfile(myFlatmateProfile.id);
                      }}
                      style={[styles.flatmateActionBtn, styles.resumeBtn]}
                      accessibilityRole="button"
                      accessibilityLabel="Resume Flatmate Profile"
                    >
                      <PlayCircle size={14} color="#32B768" strokeWidth={2} />
                      <Text style={styles.resumeBtnText}>Resume</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={async () => {
                        await pauseFlatmateProfile(myFlatmateProfile.id);
                      }}
                      style={[styles.flatmateActionBtn, styles.pauseBtn]}
                      accessibilityRole="button"
                      accessibilityLabel="Pause Flatmate Profile"
                    >
                      <PauseCircle size={14} color="#777482" strokeWidth={2} />
                      <Text style={styles.pauseBtnText}>Pause</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 6. Section: ACTIVATION / DISCOVER CARDS (Shown when user lacks Property Owner OR Flatmate capability) */}
        {(!hasPropertyListing || !hasFlatmateProfile) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isNormalUserOnly
                ? 'BECOME A LISTER OR FLATMATE'
                : !hasPropertyListing
                ? 'LIST A PROPERTY'
                : 'FLATMATE PROFILE'}
            </Text>

            <View style={styles.groupedCard}>
              {/* Activation CTA: List a Property (Shown only if user has NO properties) */}
              {!hasPropertyListing && (
                <>
                  <ProfileRow
                    icon={<Building2 size={18} color="#6C4DFF" strokeWidth={2} />}
                    iconBg="#F0ECFF"
                    title="List a Property"
                    subtitle="Have a place to rent? Add your first listing."
                    badge="Zero Brokerage"
                    onPress={() => router.push('/(renter)/listing/property-type')}
                  />
                  {!hasFlatmateProfile && <View style={styles.divider} />}
                </>
              )}

              {/* Activation CTA: Flatmate Profile (Shown only if user has NO flatmate profile) */}
              {!hasFlatmateProfile && (
                <ProfileRow
                  icon={<Users size={18} color="#0EA5E9" strokeWidth={2} />}
                  iconBg="#E0F2FE"
                  title={hasFlatmateDraft ? 'Continue Flatmate Profile' : 'Create Flatmate Profile'}
                  subtitle={
                    hasFlatmateDraft
                      ? 'You have an incomplete draft saved'
                      : 'Let people looking for a flatmate discover you.'
                  }
                  badge={hasFlatmateDraft ? 'Draft' : undefined}
                  onPress={() => router.push('/(renter)/flatmate/create')}
                />
              )}
            </View>
          </View>
        )}

        {/* 7. Section: Rental Preferences */}
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
              icon={<Building2 size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="Property Type"
              subtitle="Apartment, Studio, PG, Room"
              onPress={() => setIsEditPrefsOpen(true)}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<MapPin size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="Preferred Locations"
              subtitle={user?.locality || 'Andheri West, Bandra, Powai'}
              onPress={() => setIsEditPrefsOpen(true)}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<Wallet size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="Monthly Budget"
              subtitle={budgetFormatted}
              onPress={() => setIsEditPrefsOpen(true)}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<Sliders size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="BHK / Space"
              subtitle="1 BHK, 2 BHK, 3 BHK, Studio"
              onPress={() => setIsEditPrefsOpen(true)}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<Sparkles size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="Furnishing"
              subtitle="Fully / Semi-Furnished"
              onPress={() => setIsEditPrefsOpen(true)}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<Calendar size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="Move-in Date"
              subtitle={user?.move_in_date || 'Immediate'}
              onPress={() => setIsEditPrefsOpen(true)}
            />
          </View>
        </View>

        {/* 8. Section: Account & System */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.groupedCard}>
            <ProfileRow
              icon={<ArrowRightLeft size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="Switch Experience"
              subtitle="Toggle between Renter, Flatmate, and Lister modes"
              onPress={() => setIsModeSwitcherOpen(true)}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<Settings size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="Settings"
              subtitle="Account, privacy and app preferences"
              onPress={() => router.push('/(renter)/settings')}
            />
            <View style={styles.divider} />
            <ProfileRow
              icon={<LogOut size={18} color="#E5484D" strokeWidth={2} />}
              iconBg="#FEE2E2"
              title="Log Out"
              subtitle="Sign out of your REHVO account"
              titleColor="#E5484D"
              onPress={handleLogout}
            />
          </View>
        </View>

        {/* 9. Brand Stamp Footer */}
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
}

// Grouped Row Component
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
        <ChevronRight size={16} color="#A39EB0" strokeWidth={2} />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F7F4',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 22,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    ...Platform.select({
      ios: {
        shadowColor: '#171522',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  heroAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  heroInfo: {
    flex: 1,
    gap: 3,
  },
  heroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171522',
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  roleBadge: {
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6C4DFF',
    letterSpacing: 0.2,
  },
  heroContact: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '400',
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#32B768',
  },
  unverifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unverifiedTagText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#777482',
  },
  editHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#F0ECFF',
    marginLeft: 8,
  },
  editHeroBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  section: {
    gap: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777482',
    letterSpacing: 0.6,
  },
  editSectionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C4DFF',
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
    minHeight: 52,
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
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '400',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },
  countBadge: {
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  divider: {
    height: 0.5,
    backgroundColor: '#F0EDF5',
    marginLeft: 58,
  },
  flatmateLiveCard: {
    padding: 14,
    gap: 12,
  },
  flatmateHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flatmateIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatmateTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171522',
  },
  ownerBadgePill: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  ownerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  pausedDot: {
    backgroundColor: '#9CA3AF',
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  pausedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pausedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
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
  flatmateSubtitle: {
    fontSize: 12,
    color: '#777482',
    marginTop: 2,
  },
  flatmateActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flatmateActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    backgroundColor: '#FFFFFF',
  },
  flatmateActionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#171522',
  },
  pauseBtn: {
    backgroundColor: '#F8F7F4',
  },
  pauseBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777482',
  },
  resumeBtn: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  resumeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  flatmatePromoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  flatmatePromoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  flatmatePromoSubtitle: {
    fontSize: 12,
    color: '#777482',
    marginTop: 2,
  },
  flatmateCreateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  flatmateCreateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footerStamp: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  footerVersion: {
    fontSize: 11,
    color: '#A39EB0',
    fontWeight: '500',
  },
});
