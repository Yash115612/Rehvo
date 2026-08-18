import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Building2,
  CalendarDays,
  MessageCircle,
  Bell,
  Lock,
  LifeBuoy,
  HelpCircle,
  LogOut,
  Trash2,
  Pencil,
  ArrowRightLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Plus,
  ChevronRight,
  Eye,
  Phone,
  Mail,
  FileCheck,
  Settings,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { REHVOLogo } from '../../brand/REHVOLogo';
import { ProfileAvatarEditor } from '../../profile/ProfileAvatarEditor';
import { EditProfileModal } from '../../profile/EditProfileModal';
import { InfoSheetModal, InfoSheetType } from '../../profile/InfoSheetModal';

export const OwnerProfileScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    user,
    myProperties,
    enquiries,
    visits,
    ownerMetrics,
    updateProfile,
    switchRole,
    logout,
    deleteAccount,
    initializeFromStorage,
    fetchOwnerMetrics,
    showToast,
  } = useAppStore();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [infoSheetType, setInfoSheetType] = useState<InfoSheetType>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([initializeFromStorage(), fetchOwnerMetrics()]);
    } finally {
      setIsRefreshing(false);
    }
  }, [initializeFromStorage, fetchOwnerMetrics]);

  const userProperties = useMemo(() => {
    if (!user?.id) return [];
    return myProperties.filter((p) => p.owner_id === user.id);
  }, [myProperties, user]);

  const hasPropertyListing = userProperties.length > 0;

  // Real Metrics
  const activePropertiesCount = useMemo(() => {
    if (ownerMetrics?.active_properties !== undefined) {
      return ownerMetrics.active_properties;
    }
    return userProperties.filter((p) => p.status === 'ACTIVE' || !p.status).length;
  }, [ownerMetrics, userProperties]);

  const totalViewsCount = useMemo(() => {
    if (ownerMetrics?.total_views !== undefined) {
      return ownerMetrics.total_views;
    }
    return userProperties.reduce((acc, p) => acc + (p.views_count || 0), 0);
  }, [ownerMetrics, userProperties]);

  const initials =
    user?.name
      ?.split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'OW';

  const isVerified = user?.verification_status === 'VERIFIED';

  const handleSwitchToRenter = () => {
    switchRole('RENTER');
    showToast('Switched to Renter Mode', 'success');
    router.replace('/(renter)/home');
  };

  const handleCompleteVerification = () => {
    showToast('Verification documents submitted for review', 'success');
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out of REHVO?',
      'You will need to log in again to manage your listings and enquiries.',
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
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Owner Account?',
      'This will permanently delete your account and associated listings according to REHVO policy. This action cannot be undone.',
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
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 1. Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Owner Profile</Text>
        <Pressable
          onPress={() => router.push('/(owner)/settings')}
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#6C4DFF']}
            tintColor="#6C4DFF"
          />
        }
      >
        {/* 2. Owner Hero */}
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
                {user?.name || 'Property Owner'}
              </Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>Owner</Text>
              </View>
            </View>

            <Text style={styles.heroContact} numberOfLines={1}>
              {user?.email || user?.phone || '+91 98765 43210'}
            </Text>

            <View style={styles.verificationRow}>
              {isVerified ? (
                <View style={styles.verifiedTag}>
                  <CheckCircle2 size={12} color="#32B768" strokeWidth={2.2} />
                  <Text style={styles.verifiedTagText}>Verified Owner</Text>
                </View>
              ) : (
                <View style={styles.unverifiedTag}>
                  <Clock size={12} color="#777482" strokeWidth={2} />
                  <Text style={styles.unverifiedTagText}>Verification pending</Text>
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

        {/* 3. Section: Verification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VERIFICATION</Text>
          <View style={styles.groupedCard}>
            <View style={styles.verificationRowItem}>
              <View style={styles.verificationLeft}>
                <Phone size={16} color="#6C4DFF" strokeWidth={2} />
                <Text style={styles.verificationLabel}>Phone Number</Text>
              </View>
              <View style={styles.verificationStatusBadge}>
                <CheckCircle2 size={12} color="#32B768" strokeWidth={2.2} />
                <Text style={styles.verificationStatusVerified}>Verified</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.verificationRowItem}>
              <View style={styles.verificationLeft}>
                <Mail size={16} color="#6C4DFF" strokeWidth={2} />
                <Text style={styles.verificationLabel}>Email Address</Text>
              </View>
              <View style={styles.verificationStatusBadge}>
                <CheckCircle2 size={12} color="#32B768" strokeWidth={2.2} />
                <Text style={styles.verificationStatusVerified}>Verified</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.verificationRowItem}>
              <View style={styles.verificationLeft}>
                <FileCheck size={16} color="#6C4DFF" strokeWidth={2} />
                <Text style={styles.verificationLabel}>Ownership Documents</Text>
              </View>
              <View style={styles.verificationStatusBadge}>
                {isVerified ? (
                  <>
                    <CheckCircle2 size={12} color="#32B768" strokeWidth={2.2} />
                    <Text style={styles.verificationStatusVerified}>Verified</Text>
                  </>
                ) : (
                  <>
                    <Clock size={12} color="#F59E0B" strokeWidth={2.2} />
                    <Text style={styles.verificationStatusPending}>In Review</Text>
                  </>
                )}
              </View>
            </View>

            {!isVerified && (
              <View style={styles.verificationCtaWrap}>
                <Pressable
                  onPress={handleCompleteVerification}
                  style={styles.verificationCtaBtn}
                >
                  <Text style={styles.verificationCtaBtnText}>Upload Additional Proof</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* 4. Section: Your Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR ACTIVITY</Text>

          {/* Quick Metrics Banner */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricNum}>{activePropertiesCount}</Text>
              <Text style={styles.metricLabel}>Properties</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricNum}>{enquiries.length}</Text>
              <Text style={styles.metricLabel}>Enquiries</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricNum}>{visits.length}</Text>
              <Text style={styles.metricLabel}>Visits</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricNum}>{totalViewsCount}</Text>
              <Text style={styles.metricLabel}>Total Views</Text>
            </View>
          </View>

          <View style={styles.groupedCard}>
            <OwnerRow
              icon={<Building2 size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="My Properties"
              subtitle="View & manage active listings"
              badgeCount={activePropertiesCount}
              onPress={() => router.push('/(owner)/properties')}
            />
            <View style={styles.divider} />
            <OwnerRow
              icon={<MessageCircle size={18} color="#10B981" strokeWidth={2} />}
              iconBg="#D1FAE5"
              title="Tenant Enquiries"
              subtitle="Incoming leads and booking queries"
              badgeCount={enquiries.length}
              onPress={() => router.push('/(owner)/enquiries')}
            />
            <View style={styles.divider} />
            <OwnerRow
              icon={<CalendarDays size={18} color="#0EA5E9" strokeWidth={2} />}
              iconBg="#E0F2FE"
              title="Scheduled Visits"
              subtitle="Confirmed buyer and tenant visits"
              badgeCount={visits.length}
              onPress={() => router.push('/(owner)/visits')}
            />
            <View style={styles.divider} />
            <OwnerRow
              icon={<MessageCircle size={18} color="#8B5CF6" strokeWidth={2} />}
              iconBg="#EDE9FE"
              title="Messages"
              subtitle="Direct chats with interested renters"
              onPress={() => router.push('/(owner)/chat')}
            />
          </View>
        </View>

        {/* 5. Section: Manage Your Listings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MANAGE YOUR LISTINGS</Text>

          {/* Primary List Property CTA */}
          <Pressable
            onPress={() => router.push('/(renter)/listing/property-type')}
            style={styles.primaryListCta}
            accessibilityRole="button"
            accessibilityLabel="List a new property"
          >
            <View style={styles.listCtaIconCircle}>
              <Plus size={20} color="#FFFFFF" strokeWidth={2.4} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listCtaTitle}>List a New Property</Text>
              <Text style={styles.listCtaSubtitle}>
                Add apartments, rooms, studios, or PGs in minutes
              </Text>
            </View>
            <ChevronRight size={18} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>

          <View style={styles.groupedCard}>
            <OwnerRow
              icon={<Building2 size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="All Listed Properties"
              subtitle="Edit pricing, photos, and availability"
              onPress={() => router.push('/(owner)/properties')}
            />
          </View>
        </View>

        {/* 6. Section: Account & System */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.groupedCard}>
            <OwnerRow
              icon={<Settings size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="Settings"
              subtitle="Account, privacy and app preferences"
              onPress={() => router.push('/(owner)/settings')}
            />
            <View style={styles.divider} />
            <OwnerRow
              icon={<ArrowRightLeft size={18} color="#6C4DFF" strokeWidth={2} />}
              iconBg="#F0ECFF"
              title="Switch to Renter Mode"
              subtitle="Browse homes, search rooms & find flatmates"
              onPress={handleSwitchToRenter}
            />
            <View style={styles.divider} />
            <OwnerRow
              icon={<LogOut size={18} color="#E5484D" strokeWidth={2} />}
              iconBg="#FEE2E2"
              title="Log Out"
              subtitle="Sign out of your REHVO account"
              titleColor="#E5484D"
              onPress={handleLogout}
            />
          </View>
        </View>

        {/* 7. Brand Stamp Footer */}
        <View style={styles.footerStamp}>
          <REHVOLogo size="small" containerStyle={{ marginBottom: 6 }} />
          <Text style={styles.footerVersion}>REHVO Owner Portal v1.0.0 • Mumbai, India</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      {user && (
        <EditProfileModal
          visible={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          user={user}
          onSave={(data) => {
            updateProfile(data);
            showToast('Owner profile updated', 'success');
          }}
        />
      )}

      {/* Info Sheet Modal */}
      <InfoSheetModal
        type={infoSheetType}
        onClose={() => setInfoSheetType(null)}
        onToast={showToast}
      />
    </SafeAreaView>
  );
};

interface OwnerRowProps {
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  badgeCount?: number;
  titleColor?: string;
  onPress: () => void;
}

function OwnerRow({
  icon,
  iconBg = '#F8F7F4',
  title,
  subtitle,
  badgeCount,
  titleColor = '#171522',
  onPress,
}: OwnerRowProps) {
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
        {badgeCount !== undefined && badgeCount > 0 ? (
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
  verificationRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  verificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  verificationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171522',
  },
  verificationStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verificationStatusVerified: {
    fontSize: 12,
    fontWeight: '600',
    color: '#32B768',
  },
  verificationStatusPending: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  verificationCtaWrap: {
    padding: 12,
    backgroundColor: '#FBFBFA',
    borderTopWidth: 1,
    borderTopColor: '#F0EDF5',
  },
  verificationCtaBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#6C4DFF',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationCtaBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 2,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  metricNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#777482',
    marginTop: 2,
  },
  primaryListCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C4DFF',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#6C4DFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  listCtaIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listCtaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listCtaSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 1,
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
