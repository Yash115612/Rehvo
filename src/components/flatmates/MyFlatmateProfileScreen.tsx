import React, { useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Users,
  PlusCircle,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  MapPin,
  IndianRupee,
  BedDouble,
  Calendar,
  Sparkles,
  MessageCircle,
  ChevronRight,
  Sliders,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  UserCheck,
} from 'lucide-react-native';
import { useAppStore, selectUserCapabilities } from '../../store/useAppStore';

export const MyFlatmateProfileScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    properties,
    myFlatmateProfile,
    flatmateDraft,
    conversations,
    pauseFlatmateProfile,
    resumeFlatmateProfile,
    deleteFlatmateProfile,
    showToast,
  } = useAppStore();

  const { hasPublishedFlatmateProfile } = useMemo(() => {
    return selectUserCapabilities({
      user,
      properties,
      myFlatmateProfile,
      flatmateDraft,
    });
  }, [user, properties, myFlatmateProfile, flatmateDraft]);

  const isLive = myFlatmateProfile?.is_published && !myFlatmateProfile?.is_paused;

  // Real active user conversations
  const flatmateConversations = useMemo(() => {
    return conversations.slice(0, 3);
  }, [conversations]);

  const handleTogglePause = () => {
    if (!myFlatmateProfile) return;
    if (myFlatmateProfile.is_paused) {
      resumeFlatmateProfile(myFlatmateProfile.id);
      showToast('Flatmate Profile published live', 'success');
    } else {
      pauseFlatmateProfile(myFlatmateProfile.id);
      showToast('Flatmate Profile paused and hidden', 'info');
    }
  };

  const handleDelete = () => {
    if (!myFlatmateProfile) return;
    Alert.alert(
      'Delete Flatmate Profile?',
      'This will remove your profile from Flatmate discovery. Your main REHVO account will remain active.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Profile',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteFlatmateProfile(myFlatmateProfile.id);
            if (res.success) {
              router.replace('/(renter)/profile');
            }
          },
        },
      ],
    );
  };

  if (!myFlatmateProfile) {
    return null;
  }

  const initials =
    myFlatmateProfile?.name
      ?.split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'FP';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Header */}
      <View style={styles.headerBar}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={20} color="#171522" strokeWidth={2.2} />
        </Pressable>

        <Text style={styles.headerTitle}>My Flatmate Profile</Text>

        <Pressable
          style={styles.headerBtn}
          onPress={() => router.push('/(renter)/flatmate/edit')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Edit Profile"
        >
          <Pencil size={18} color="#171522" strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 40 },
          ]}
        >
          {/* 2. Profile Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              {myFlatmateProfile.avatar ? (
                <Image
                  source={{ uri: myFlatmateProfile.avatar }}
                  style={styles.heroAvatar}
                />
              ) : (
                <View style={styles.heroAvatarPlaceholder}>
                  <Text style={styles.avatarInitialText}>{initials}</Text>
                </View>
              )}

              <View style={styles.heroInfo}>
                <View style={styles.heroNameRow}>
                  <Text style={styles.heroName} numberOfLines={1}>
                    {myFlatmateProfile.name}
                  </Text>
                  {isLive ? (
                    <View style={styles.liveBadge}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveBadgeText}>Live</Text>
                    </View>
                  ) : (
                    <View style={styles.pausedBadge}>
                      <Clock size={10} color="#B45309" strokeWidth={2} />
                      <Text style={styles.pausedBadgeText}>Paused</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.heroOcc} numberOfLines={1}>
                  {myFlatmateProfile.occupation || 'Working Professional'}
                </Text>

                <View style={styles.heroLocRow}>
                  <MapPin size={12} color="#777482" strokeWidth={2} />
                  <Text style={styles.heroLocText} numberOfLines={1}>
                    {myFlatmateProfile.preferred_locations?.join(', ') ||
                      myFlatmateProfile.locality ||
                      'Mumbai'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Hero Actions (100% inside card, responsive) */}
            <View style={styles.heroActionsRow}>
              <Pressable
                style={styles.heroPrimaryBtn}
                onPress={() => router.push('/(renter)/flatmate/edit')}
                accessibilityRole="button"
                accessibilityLabel="Edit Profile"
              >
                <Pencil size={15} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.heroPrimaryBtnText}>Edit Profile</Text>
              </Pressable>

              <Pressable
                style={styles.heroSecondaryBtn}
                onPress={() =>
                  router.push(`/(renter)/flatmate/${myFlatmateProfile.id}`)
                }
                accessibilityRole="button"
                accessibilityLabel="Preview Public Profile"
              >
                <Eye size={15} color="#171522" strokeWidth={2.2} />
                <Text style={styles.heroSecondaryBtnText}>Preview Public</Text>
              </Pressable>
            </View>
          </View>

          {/* 3. Visibility Controls Card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>VISIBILITY CONTROLS</Text>
            <View
              style={[
                styles.visibilityCard,
                isLive ? styles.visibilityCardLive : styles.visibilityCardPaused,
              ]}
            >
              <View style={styles.visibilityHeaderRow}>
                <View style={styles.visibilityStatusIcon}>
                  {isLive ? (
                    <CheckCircle2 size={20} color="#16A34A" strokeWidth={2.2} />
                  ) : (
                    <EyeOff size={20} color="#D97706" strokeWidth={2.2} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.visibilityTitle,
                      isLive
                        ? styles.visibilityTitleLive
                        : styles.visibilityTitlePaused,
                    ]}
                  >
                    {isLive
                      ? 'Profile is Live in Discovery'
                      : 'Profile is Currently Hidden'}
                  </Text>
                  <Text style={styles.visibilityDesc}>
                    {isLive
                      ? 'Your flatmate profile is visible to verified roommates searching in Mumbai.'
                      : 'Your profile is hidden from search results. Potential flatmates cannot see or message you.'}
                  </Text>
                </View>
              </View>

              <Pressable
                style={[
                  styles.visibilityToggleBtn,
                  isLive
                    ? styles.visibilityToggleBtnPause
                    : styles.visibilityToggleBtnResume,
                ]}
                onPress={handleTogglePause}
                accessibilityRole="button"
                accessibilityLabel={isLive ? 'Pause Profile' : 'Resume Profile'}
              >
                {isLive ? (
                  <>
                    <EyeOff size={16} color="#777482" strokeWidth={2} />
                    <Text style={styles.visibilityToggleBtnPauseText}>
                      Pause Profile (Hide from Discovery)
                    </Text>
                  </>
                ) : (
                  <>
                    <Eye size={16} color="#FFFFFF" strokeWidth={2.2} />
                    <Text style={styles.visibilityToggleBtnResumeText}>
                      Resume Profile (Publish Live)
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>

          {/* 4. Activity & Real Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>YOUR ACTIVITY</Text>
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricNum}>
                  {flatmateConversations.length}
                </Text>
                <Text style={styles.metricLabel}>Conversations</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricNum}>
                  ₹{(myFlatmateProfile.budget_max / 1000).toFixed(0)}K
                </Text>
                <Text style={styles.metricLabel}>Max Budget</Text>
              </View>
              <View style={styles.metricCard}>
                <Text
                  style={[
                    styles.metricNum,
                    { color: isLive ? '#16A34A' : '#D97706' },
                  ]}
                >
                  {isLive ? 'Live' : 'Paused'}
                </Text>
                <Text style={styles.metricLabel}>Discovery</Text>
              </View>
            </View>
          </View>

          {/* 5. Messages Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>MESSAGES</Text>
              <Pressable onPress={() => router.push('/(renter)/chat')} hitSlop={8}>
                <Text style={styles.sectionActionLink}>View All</Text>
              </Pressable>
            </View>

            <View style={styles.groupedCard}>
              {flatmateConversations.length === 0 ? (
                <View style={styles.emptyMessagesWrap}>
                  <MessageCircle size={24} color="#777482" strokeWidth={1.8} />
                  <Text style={styles.emptyMessagesTitle}>No messages yet</Text>
                  <Text style={styles.emptyMessagesSub}>
                    When potential flatmates discover your profile and message you,
                    conversations will appear here.
                  </Text>
                </View>
              ) : (
                flatmateConversations.slice(0, 3).map((conv, idx) => {
                  const participantName =
                    (user?.role === 'RENTER' ? conv.owner_name : conv.renter_name) ||
                    conv.property_title ||
                    'REHVO User';
                  const participantAvatar =
                    (user?.role === 'RENTER' ? conv.owner_avatar : conv.renter_avatar) ||
                    conv.property_image ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';

                  return (
                    <React.Fragment key={conv.id}>
                      {idx > 0 && <View style={styles.divider} />}
                      <Pressable
                        style={styles.messageRow}
                        onPress={() => router.push(`/(renter)/chat/${conv.id}`)}
                      >
                        <Image
                          source={{ uri: participantAvatar }}
                          style={styles.msgAvatar}
                        />
                        <View style={{ flex: 1, gap: 2 }}>
                          <View style={styles.msgTopLine}>
                            <Text style={styles.msgName} numberOfLines={1}>
                              {participantName}
                            </Text>
                            <Text style={styles.msgTime}>{conv.updated_at}</Text>
                          </View>
                          <Text style={styles.msgSnippet} numberOfLines={1}>
                            {conv.last_message || 'Started a conversation'}
                          </Text>
                        </View>
                        {conv.unread_count > 0 && (
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadBadgeText}>
                              {conv.unread_count}
                            </Text>
                          </View>
                        )}
                        <ChevronRight size={16} color="#A39EB0" strokeWidth={2} />
                      </Pressable>
                    </React.Fragment>
                  );
                })
              )}
            </View>
          </View>

          {/* 6. Your Flatmate Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>YOUR FLATMATE DETAILS</Text>
              <Pressable
                onPress={() => router.push('/(renter)/flatmate/edit')}
                hitSlop={8}
              >
                <Text style={styles.sectionActionLink}>Edit</Text>
              </Pressable>
            </View>

            <View style={styles.groupedCard}>
              <DetailRow
                icon={<BedDouble size={16} color="#6C4DFF" strokeWidth={2} />}
                label="Looking for"
                value={
                  myFlatmateProfile.looking_for ||
                  myFlatmateProfile.room_preference ||
                  'Private Room'
                }
              />
              <View style={styles.divider} />
              <DetailRow
                icon={<MapPin size={16} color="#6C4DFF" strokeWidth={2} />}
                label="Preferred Locations"
                value={
                  myFlatmateProfile.preferred_locations?.join(', ') ||
                  myFlatmateProfile.locality ||
                  'Mumbai'
                }
              />
              <View style={styles.divider} />
              <DetailRow
                icon={<IndianRupee size={16} color="#6C4DFF" strokeWidth={2} />}
                label="Monthly Budget"
                value={`₹${(myFlatmateProfile.budget_min || 15000).toLocaleString('en-IN')} – ₹${(myFlatmateProfile.budget_max || 30000).toLocaleString('en-IN')}`}
              />
              <View style={styles.divider} />
              <DetailRow
                icon={<Calendar size={16} color="#6C4DFF" strokeWidth={2} />}
                label="Move-in Timing"
                value={
                  myFlatmateProfile.move_in_timing ||
                  myFlatmateProfile.move_in_date ||
                  'Immediate'
                }
              />
              {myFlatmateProfile.lifestyle_preferences?.length ? (
                <>
                  <View style={styles.divider} />
                  <View style={styles.lifestyleBlock}>
                    <View style={styles.lifestyleHeader}>
                      <Sparkles size={16} color="#6C4DFF" strokeWidth={2} />
                      <Text style={styles.lifestyleLabel}>Lifestyle & Habits</Text>
                    </View>
                    <View style={styles.tagWrap}>
                      {myFlatmateProfile.lifestyle_preferences.map((tag, idx) => (
                        <View key={idx} style={styles.tagPill}>
                          <Text style={styles.tagPillText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </>
              ) : null}
            </View>
          </View>

          {/* 7. About You (Bio) */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>ABOUT YOU</Text>
              <Pressable
                onPress={() => router.push('/(renter)/flatmate/edit')}
                hitSlop={8}
              >
                <Text style={styles.sectionActionLink}>Edit</Text>
              </Pressable>
            </View>

            <View style={styles.bioCard}>
              <Text style={styles.bioText}>
                {myFlatmateProfile.bio ||
                  'Add a short bio to tell potential roommates about your lifestyle, work, and preferences.'}
              </Text>
            </View>
          </View>

          {/* 8. Public Profile Preview ("How People See You") */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HOW PEOPLE SEE YOU</Text>
            <View style={styles.previewContainer}>
              <View style={styles.previewTopRow}>
                {myFlatmateProfile.avatar ? (
                  <Image
                    source={{ uri: myFlatmateProfile.avatar }}
                    style={styles.previewAvatar}
                  />
                ) : (
                  <View style={styles.previewAvatarPlaceholder}>
                    <Text style={styles.previewAvatarInitial}>{initials}</Text>
                  </View>
                )}
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.previewName}>{myFlatmateProfile.name}</Text>
                  <Text style={styles.previewOcc}>
                    {myFlatmateProfile.occupation} • {myFlatmateProfile.locality}
                  </Text>
                  <Text style={styles.previewBudget}>
                    Budget: ₹
                    {(myFlatmateProfile.budget_min / 1000).toFixed(0)}K – ₹
                    {(myFlatmateProfile.budget_max / 1000).toFixed(0)}K / mo
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.previewCtaBtn}
                onPress={() =>
                  router.push(`/(renter)/flatmate/${myFlatmateProfile.id}`)
                }
                accessibilityRole="button"
                accessibilityLabel="Preview Public Profile"
              >
                <Eye size={16} color="#6C4DFF" strokeWidth={2.2} />
                <Text style={styles.previewCtaBtnText}>
                  Preview Full Public Profile
                </Text>
              </Pressable>
            </View>
          </View>

          {/* 9. Discovery Marketplace Shortcut */}
          <Pressable
            style={styles.exploreMarketplaceCard}
            onPress={() => router.push('/(renter)/flatmates')}
            accessibilityRole="button"
            accessibilityLabel="Explore Flatmates Marketplace"
          >
            <View style={styles.exploreIconCircle}>
              <Compass size={20} color="#6C4DFF" strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.exploreTitle}>
                Explore Flatmates Marketplace
              </Text>
              <Text style={styles.exploreSub}>
                Browse other verified flatmates looking for rooms in Mumbai
              </Text>
            </View>
            <ChevronRight size={18} color="#A39EB0" strokeWidth={2} />
          </Pressable>

          {/* 10. Delete Flatmate Profile */}
          <View style={styles.section}>
            <View style={styles.groupedCard}>
              <Pressable
                style={styles.deleteRow}
                onPress={handleDelete}
                accessibilityRole="button"
                accessibilityLabel="Delete Flatmate Profile"
              >
                <View style={styles.deleteIconWrap}>
                  <Trash2 size={16} color="#E5484D" strokeWidth={2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deleteTitle}>Delete Flatmate Profile</Text>
                  <Text style={styles.deleteSubtitle}>
                    Removes your profile from discovery. REHVO account remains active.
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
};

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLeft}>
        <View style={styles.detailIconWrap}>{icon}</View>
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue} numberOfLines={1}>
        {value}
      </Text>
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
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.2,
  },
  scrollContent: {
    padding: 16,
    gap: 20,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 16,
    gap: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#171522',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  heroAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
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
    fontSize: 17,
    fontWeight: '800',
    color: '#171522',
    flexShrink: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  liveBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#10B981',
  },
  pausedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pausedBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#B45309',
  },
  heroOcc: {
    fontSize: 13,
    color: '#777482',
    fontWeight: '500',
  },
  heroLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroLocText: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '500',
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F0EA',
  },
  heroPrimaryBtn: {
    flex: 1.2,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  heroPrimaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroSecondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
  },
  heroSecondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171522',
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
  sectionActionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  visibilityCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  visibilityCardLive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  visibilityCardPaused: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  visibilityHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  visibilityStatusIcon: {
    marginTop: 2,
  },
  visibilityTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  visibilityTitleLive: {
    color: '#15803D',
  },
  visibilityTitlePaused: {
    color: '#B45309',
  },
  visibilityDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
    marginTop: 2,
  },
  visibilityToggleBtn: {
    height: 42,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  visibilityToggleBtnPause: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  visibilityToggleBtnPauseText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#4B5563',
  },
  visibilityToggleBtnResume: {
    backgroundColor: '#6C4DFF',
  },
  visibilityToggleBtnResumeText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  metricNum: {
    fontSize: 17,
    fontWeight: '800',
    color: '#171522',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#777482',
    marginTop: 2,
  },
  groupedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    overflow: 'hidden',
  },
  divider: {
    height: 0.5,
    backgroundColor: '#F0EDF5',
    marginLeft: 44,
  },
  emptyMessagesWrap: {
    padding: 20,
    alignItems: 'center',
    gap: 6,
  },
  emptyMessagesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  emptyMessagesSub: {
    fontSize: 12,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 17,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  msgAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  msgTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  msgName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
    flex: 1,
  },
  msgTime: {
    fontSize: 11,
    color: '#A39EB0',
  },
  msgSnippet: {
    fontSize: 12,
    color: '#777482',
  },
  unreadBadge: {
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#777482',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171522',
    maxWidth: '50%',
    textAlign: 'right',
  },
  lifestyleBlock: {
    padding: 14,
    gap: 8,
  },
  lifestyleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lifestyleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#777482',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagPillText: {
    fontSize: 12,
    color: '#171522',
    fontWeight: '600',
  },
  bioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 14,
  },
  bioText: {
    fontSize: 13,
    color: '#171522',
    lineHeight: 19,
  },
  previewContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 14,
    gap: 12,
  },
  previewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  previewAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewAvatarInitial: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  previewName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171522',
  },
  previewOcc: {
    fontSize: 12,
    color: '#777482',
  },
  previewBudget: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C4DFF',
  },
  previewCtaBtn: {
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F0ECFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  previewCtaBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  exploreMarketplaceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 14,
    gap: 12,
  },
  exploreIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  exploreSub: {
    fontSize: 11.5,
    color: '#777482',
    marginTop: 1,
  },
  deleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  deleteIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E5484D',
  },
  deleteSubtitle: {
    fontSize: 11.5,
    color: '#777482',
    marginTop: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 14,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#171522',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 20,
  },
  createProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 10,
  },
  createProfileBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
