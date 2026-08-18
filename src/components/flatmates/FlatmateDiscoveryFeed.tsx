import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Users,
  PlusCircle,
  UserRoundCheck,
  ChevronRight,
  Sparkles,
  Eye,
  Pencil,
  EyeOff,
  UserCheck,
  ArrowRight,
  Trash2,
  Sliders,
} from 'lucide-react-native';
import { FlatmateProfile } from '../../types';
import { FlatmateCard } from './FlatmateCard';
import { FlatmateFilterBar, FlatmateFilterId } from './FlatmateFilterBar';
import { useAppStore } from '../../store/useAppStore';

interface FlatmateDiscoveryFeedProps {
  flatmates: FlatmateProfile[];
  myProfile: FlatmateProfile | null;
  savedFlatmateIds: string[];
  onToggleSave: (id: string) => void;
  onSelectFlatmate: (profile: FlatmateProfile) => void;
  onCreateProfile: () => void;
  onManageMyProfile: () => void;
}

export const FlatmateDiscoveryFeed: React.FC<FlatmateDiscoveryFeedProps> = ({
  flatmates,
  myProfile,
  savedFlatmateIds,
  onToggleSave,
  onSelectFlatmate,
  onCreateProfile,
  onManageMyProfile,
}) => {
  const router = useRouter();
  const {
    flatmateDraft,
    clearFlatmateDraft,
    pauseFlatmateProfile,
    resumeFlatmateProfile,
  } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<FlatmateFilterId>('all');

  const filteredFlatmates = useMemo(() => {
    // Exclude paused profiles unless they belong to the current user
    let list = flatmates.filter((f) => !f.is_paused);

    switch (activeFilter) {
      case 'private_room':
        list = list.filter((f) => f.room_preference === 'Private Room');
        break;
      case 'shared_room':
        list = list.filter(
          (f) =>
            f.room_preference === 'Shared Room' ||
            f.looking_for?.toLowerCase().includes('shared')
        );
        break;
      case 'under_15k':
        list = list.filter((f) => f.budget_min <= 15000 || f.budget_max <= 20000);
        break;
      case 'under_25k':
        list = list.filter((f) => f.budget_max <= 25000);
        break;
      case 'near_metro':
        list = list.filter((f) =>
          f.lifestyle_preferences?.some((p) =>
            p.toLowerCase().includes('metro')
          )
        );
        break;
      case 'wfh':
        list = list.filter((f) =>
          f.lifestyle_preferences?.some(
            (p) =>
              p.toLowerCase().includes('work from home') ||
              p.toLowerCase().includes('wfh')
          )
        );
        break;
      case 'pet_friendly':
        list = list.filter((f) =>
          f.lifestyle_preferences?.some((p) =>
            p.toLowerCase().includes('pet')
          )
        );
        break;
    }

    return list;
  }, [flatmates, activeFilter]);

  const handleTogglePause = () => {
    if (!myProfile) return;
    if (myProfile.is_paused) {
      resumeFlatmateProfile(myProfile.id);
    } else {
      pauseFlatmateProfile(myProfile.id);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTextGroup}>
          <View style={styles.pillBadge}>
            <Sparkles size={12} color="#6C4DFF" strokeWidth={2.5} />
            <Text style={styles.pillBadgeText}>Roommate Marketplace</Text>
          </View>
          <Text style={styles.title}>Find your flatmate</Text>
          <Text style={styles.subtitle}>
            Discover people looking for a place like you.
          </Text>
        </View>
      </View>

      {/* 2. State-Aware CTA Card (State 1, 2, 3, or 4) */}
      {!myProfile && !flatmateDraft && (
        /* STATE 1 — NO PROFILE EXISTS (RESPONSIVE NON-OVERFLOWING CARD) */
        <View style={styles.createCardWrap}>
          <View style={styles.createCard}>
            <View style={styles.createCardHeader}>
              <View style={styles.createCardIconWrap}>
                <Users size={20} color="#6C4DFF" strokeWidth={2.2} />
              </View>
              <Text style={styles.createCardTitle}>Want people to discover you too?</Text>
            </View>

            <Text style={styles.createCardSub}>
              Create your Flatmate Profile and let people looking for a roommate discover you.
            </Text>

            <View style={styles.createCardFooter}>
              <Pressable
                style={styles.createPrimaryBtn}
                onPress={onCreateProfile}
                accessibilityRole="button"
                accessibilityLabel="Create Flatmate Profile"
              >
                <PlusCircle size={16} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.createPrimaryBtnText}>Create Flatmate Profile</Text>
              </Pressable>

              <Text style={styles.freeListingNote}>Free · Verified renters</Text>
            </View>
          </View>
        </View>
      )}

      {!myProfile && flatmateDraft && (
        /* STATE 2 — DRAFT EXISTS BUT NOT PUBLISHED */
        <View style={styles.createCardWrap}>
          <View style={[styles.createCard, styles.draftCardBorder]}>
            <View style={styles.createCardHeader}>
              <View style={[styles.createCardIconWrap, { backgroundColor: '#FEF3C7' }]}>
                <Pencil size={18} color="#D97706" strokeWidth={2.2} />
              </View>
              <View style={styles.draftHeaderCol}>
                <Text style={styles.createCardTitle}>Continue your Flatmate Profile</Text>
                <View style={styles.draftBadge}>
                  <Text style={styles.draftBadgeText}>Draft Saved</Text>
                </View>
              </View>
            </View>

            <Text style={styles.createCardSub}>
              You have an unfinished setup for {flatmateDraft.name || 'your profile'}. Finish it to get discovered.
            </Text>

            <View style={styles.createCardFooter}>
              <Pressable
                style={styles.createPrimaryBtn}
                onPress={onCreateProfile}
                accessibilityRole="button"
                accessibilityLabel="Continue Flatmate Profile Setup"
              >
                <Text style={styles.createPrimaryBtnText}>Continue Setup</Text>
                <ArrowRight size={14} color="#FFFFFF" strokeWidth={2.5} />
              </Pressable>

              <Pressable
                style={styles.discardDraftBtn}
                onPress={clearFlatmateDraft}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Discard draft"
              >
                <Text style={styles.discardDraftText}>Discard</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {myProfile && (
        /* STATE 3 & 4 — USER'S FLATMATE PROFILE (RESPONSIVE NON-OVERFLOWING CARD) */
        <View style={styles.manageCardWrap}>
          <View style={[styles.manageCard, myProfile.is_paused && styles.pausedCardBorder]}>
            <View style={styles.manageTopRow}>
              <View style={styles.manageUserCol}>
                {myProfile.avatar ? (
                  <Image
                    source={{ uri: myProfile.avatar }}
                    style={styles.manageAvatar}
                  />
                ) : (
                  <View style={styles.manageAvatarPlaceholder}>
                    <Text style={styles.manageAvatarInitial}>
                      {myProfile.name?.[0]?.toUpperCase() || 'F'}
                    </Text>
                  </View>
                )}
                <View style={{ gap: 2, flex: 1 }}>
                  <View style={styles.manageStatusRow}>
                    <Text style={styles.manageCardTitle} numberOfLines={1}>
                      Your Flatmate Profile
                    </Text>
                    {myProfile.is_paused ? (
                      <View style={styles.statusPillPaused}>
                        <View style={styles.statusDotPaused} />
                        <Text style={styles.statusPillTextPaused}>Paused</Text>
                      </View>
                    ) : (
                      <View style={styles.statusPillLive}>
                        <View style={styles.statusDotLive} />
                        <Text style={styles.statusPillTextLive}>Live</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.manageUserName} numberOfLines={1}>
                    {myProfile.name}
                  </Text>
                  <Text style={styles.manageCardSub} numberOfLines={1}>
                    {myProfile.locality || 'Mumbai'} • {myProfile.room_preference} (₹
                    {(myProfile.budget_min / 1000).toFixed(0)}K–₹
                    {(myProfile.budget_max / 1000).toFixed(0)}K/mo)
                  </Text>
                </View>
              </View>
            </View>

            {/* Responsive Actions Row: All buttons fit 100% inside card */}
            <View style={styles.manageActionsRow}>
              <Pressable
                style={styles.managePrimaryBtn}
                onPress={onManageMyProfile}
                accessibilityRole="button"
                accessibilityLabel="Manage Flatmate Profile"
              >
                <Sliders size={16} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.managePrimaryBtnText}>Manage Profile</Text>
              </Pressable>

              <Pressable
                style={styles.manageSecondaryBtn}
                onPress={() => onSelectFlatmate(myProfile)}
                accessibilityRole="button"
                accessibilityLabel="View Public Profile"
              >
                <Eye size={16} color="#171522" strokeWidth={2} />
                <Text style={styles.manageSecondaryBtnText}>View Public</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* 3. Filter Bar */}
      <FlatmateFilterBar
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />

      {/* 4. Section Subheading */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>People looking for a flatmate</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{filteredFlatmates.length}</Text>
        </View>
      </View>

      {/* 5. Profile Cards List */}
      <View style={styles.listSection}>
        {filteredFlatmates.length === 0 ? (
          <View style={styles.emptyCard}>
            <Users size={32} color="#777482" strokeWidth={1.8} />
            <Text style={styles.emptyTitle}>No flatmates found</Text>
            <Text style={styles.emptyDesc}>
              Try adjusting your filter or create your own profile to connect with
              people searching in this area.
            </Text>
            <Pressable
              style={styles.emptyResetBtn}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={styles.emptyResetText}>View All Flatmates</Text>
            </Pressable>
          </View>
        ) : (
          filteredFlatmates.map((item) => (
            <FlatmateCard
              key={item.id}
              profile={item}
              isSaved={savedFlatmateIds.includes(item.id)}
              onToggleSave={onToggleSave}
              onPress={onSelectFlatmate}
            />
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    paddingHorizontal: 16,
  },
  headerTextGroup: {
    gap: 4,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#DED6FD',
  },
  pillBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 13.5,
    color: '#777482',
    lineHeight: 19,
    fontWeight: '500',
  },
  createCardWrap: {
    paddingHorizontal: 16,
  },
  createCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#DED6FD',
    padding: 16,
    gap: 10,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  draftCardBorder: {
    borderColor: '#FDE68A',
  },
  createCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  draftHeaderCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    flexWrap: 'wrap',
  },
  createCardIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171522',
    flex: 1,
    flexShrink: 1,
  },
  draftBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  draftBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#D97706',
  },
  createCardSub: {
    fontSize: 13,
    color: '#5B5768',
    lineHeight: 18,
  },
  createCardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  createPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 14,
  },
  createPrimaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  freeListingNote: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '500',
  },
  discardDraftBtn: {
    paddingHorizontal: 10,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discardDraftText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#E5484D',
  },
  manageCardWrap: {
    paddingHorizontal: 16,
  },
  manageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    padding: 14,
    gap: 12,
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  pausedCardBorder: {
    borderColor: '#FDE68A',
  },
  manageTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  manageUserCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  manageAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  manageAvatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  manageCardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#171522',
  },
  manageCardSub: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '500',
  },
  statusPillLive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#EAF8F0',
  },
  statusPillPaused: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#FEF3C7',
  },
  statusDotLive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#32B768',
  },
  statusDotPaused: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D97706',
  },
  statusPillTextLive: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1B8246',
    letterSpacing: 0.2,
  },
  statusPillTextPaused: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 0.2,
  },
  manageUserName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171522',
    marginTop: 1,
  },
  manageAvatarInitial: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6C4DFF',
  },
  manageActionsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F0EA',
  },
  managePrimaryBtn: {
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
  managePrimaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  manageSecondaryBtn: {
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
  manageSecondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171522',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.2,
  },
  countBadge: {
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  listSection: {
    paddingHorizontal: 16,
    gap: 14,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 28,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171522',
    marginTop: 4,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyResetBtn: {
    marginTop: 8,
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  emptyResetText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C4DFF',
  },
});
