import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Users,
  PlusCircle,
  ChevronRight,
  Sparkles,
  Eye,
  Pencil,
  ArrowRight,
  Sliders,
  Flame,
  Search,
  X,
  MapPin,
} from 'lucide-react-native';
import { FlatmateProfile } from '../../types';
import { FlatmateCard } from './FlatmateCard';
import { FlatmateFilterBar, FlatmateFilterId } from './FlatmateFilterBar';
import { useAppStore } from '../../store/useAppStore';
import { V4_COLORS, V4_SHADOWS } from '../../theme/v4Theme';

const LOCALITY_SHORTCUTS = [
  'Bandra West',
  'Khar West',
  'Santacruz',
  'Pali Hill',
  'Powai',
  'Andheri West',
  'Juhu',
];

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
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocality, setSelectedLocality] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FlatmateFilterId>('all');

  const filteredFlatmates = useMemo(() => {
    // Exclude paused profiles unless they belong to the current user
    let list = flatmates.filter((f) => !f.is_paused);

    // 1. Locality shortcut filter
    if (selectedLocality) {
      list = list.filter((fm) => {
        const matchLoc = (fm.locality || '').toLowerCase().includes(selectedLocality.toLowerCase());
        const matchPrefs = (fm.preferred_locations || fm.preferred_localities || []).some((l) =>
          l.toLowerCase().includes(selectedLocality.toLowerCase())
        );
        return matchLoc || matchPrefs;
      });
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((fm) => {
        const matchName = fm.name.toLowerCase().includes(q);
        const matchLoc = (fm.locality || '').toLowerCase().includes(q);
        const matchCity = (fm.city || '').toLowerCase().includes(q);
        const matchProf = (fm.profession || fm.occupation || '').toLowerCase().includes(q);
        const matchCompany = (fm.company_or_college || '').toLowerCase().includes(q);
        const matchPrefs = (fm.preferred_locations || fm.preferred_localities || []).some((l) =>
          l.toLowerCase().includes(q)
        );
        return matchName || matchLoc || matchCity || matchProf || matchCompany || matchPrefs;
      });
    }

    // 3. Category Filter
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
        list = list.filter((f) => (f.budget_min || 0) <= 15000 || (f.budget_max || 0) <= 20000);
        break;
      case 'under_25k':
        list = list.filter((f) => (f.budget_max || 0) <= 25000);
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
          f.work_style === 'wfh' ||
          f.work_style === 'Work From Home' ||
          f.lifestyle_preferences?.some(
            (p) =>
              p.toLowerCase().includes('work from home') ||
              p.toLowerCase().includes('wfh')
          )
        );
        break;
      case 'pet_friendly':
        list = list.filter((f) =>
          f.pets !== 'not_allowed' &&
          f.lifestyle_preferences?.some((p) =>
            p.toLowerCase().includes('pet')
          )
        );
        break;
    }

    return list;
  }, [flatmates, activeFilter, searchQuery, selectedLocality]);

  return (
    <View style={styles.container}>
      {/* 1. Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTextGroup}>
          <View style={styles.pillBadge}>
            <Sparkles size={12} color="#0F766E" strokeWidth={2.5} />
            <Text style={styles.pillBadgeText}>100% Verified Co-Living</Text>
          </View>
          <Text style={styles.title}>Find your ideal flatmate</Text>
          <Text style={styles.subtitle}>
            Discover verified roommates in Mumbai matching your vibe, budget & schedule.
          </Text>
        </View>
      </View>

      {/* 2. REAL-TIME SEARCH BAR */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Search size={16} color="#0F766E" strokeWidth={2.4} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locality, college, company, or name..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {!!searchQuery && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={6}>
              <X size={15} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      </View>

      {/* 3. LOCALITY SHORTCUT CHIPS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.localityScroll}
      >
        {LOCALITY_SHORTCUTS.map((loc) => {
          const isSelected = selectedLocality === loc;
          return (
            <Pressable
              key={loc}
              style={[styles.localityChip, isSelected && styles.localityChipActive]}
              onPress={() => setSelectedLocality(isSelected ? null : loc)}
            >
              <MapPin size={11} color={isSelected ? '#FFFFFF' : '#0F766E'} />
              <Text style={[styles.localityChipText, isSelected && styles.localityChipTextActive]}>
                {loc}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* 4. SWIPE FEATURE HIGHLIGHT CARD */}
      <View style={styles.swipeBannerWrap}>
        <Pressable
          style={styles.swipeBanner}
          onPress={() => router.push('/(renter)/flatmate/discover' as any)}
        >
          <View style={styles.swipeBannerLeft}>
            <View style={styles.swipeIconCircle}>
              <Flame size={20} color="#D97706" strokeWidth={2.6} />
            </View>
            <View style={styles.swipeTextCol}>
              <View style={styles.swipeTitleRow}>
                <Text style={styles.swipeTitle}>Interactive Swipe Deck</Text>
                <View style={styles.newFeatureBadge}>
                  <Text style={styles.newFeatureText}>NEW</Text>
                </View>
              </View>
              <Text style={styles.swipeSub}>
                Swipe right to wave & match instantly with roommates.
              </Text>
            </View>
          </View>

          <View style={styles.swipeLaunchBtn}>
            <Text style={styles.swipeLaunchBtnText}>Launch</Text>
            <ArrowRight size={13} color="#FFFFFF" strokeWidth={2.6} />
          </View>
        </Pressable>
      </View>

      {/* 5. State-Aware CTA Card (State 1, 2, 3, or 4) */}
      {!myProfile && !flatmateDraft && (
        /* STATE 1 — NO PROFILE EXISTS */
        <View style={styles.createCardWrap}>
          <View style={styles.createCard}>
            <View style={styles.createCardHeader}>
              <View style={styles.createCardIconWrap}>
                <Users size={20} color="#0F766E" strokeWidth={2.4} />
              </View>
              <Text style={styles.createCardTitle}>Want people to discover you too?</Text>
            </View>

            <Text style={styles.createCardSub}>
              Create your Flatmate Profile in 2 minutes and let people looking for a roommate discover you.
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
        /* STATE 3 & 4 — USER'S FLATMATE PROFILE */
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
                    {((myProfile.budget_min || 15000) / 1000).toFixed(0)}K–₹
                    {((myProfile.budget_max || 30000) / 1000).toFixed(0)}K/mo)
                  </Text>
                </View>
              </View>
            </View>

            {/* Responsive Actions Row */}
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
                <Eye size={16} color="#031B2A" strokeWidth={2} />
                <Text style={styles.manageSecondaryBtnText}>View Public</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* 6. Filter Bar */}
      <FlatmateFilterBar
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />

      {/* 7. Section Subheading */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>People looking for a flatmate</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{filteredFlatmates.length}</Text>
        </View>
      </View>

      {/* 8. Profile Cards List with direct Wave & Chat */}
      <View style={styles.listSection}>
        {filteredFlatmates.length === 0 ? (
          <View style={styles.emptyCard}>
            <Users size={32} color="#64748B" strokeWidth={1.8} />
            <Text style={styles.emptyTitle}>No flatmates found</Text>
            <Text style={styles.emptyDesc}>
              Try adjusting your search query, locality chips, or filter parameters.
            </Text>
            <Pressable
              style={styles.emptyResetBtn}
              onPress={() => {
                setSearchQuery('');
                setSelectedLocality(null);
                setActiveFilter('all');
              }}
            >
              <Text style={styles.emptyResetText}>Reset All Filters</Text>
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
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  pillBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#031B2A',
    letterSpacing: -0.4,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 19,
    fontWeight: '500',
  },

  /* SEARCH BAR */
  searchWrap: {
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 11 : 7,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    ...V4_SHADOWS.soft,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#031B2A',
    fontWeight: '500',
  },

  /* LOCALITIES */
  localityScroll: {
    paddingHorizontal: 16,
    gap: 7,
    paddingVertical: 2,
  },
  localityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  localityChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  localityChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  localityChipTextActive: {
    color: '#FFFFFF',
  },

  /* SWIPE FEATURE BANNER */
  swipeBannerWrap: {
    paddingHorizontal: 16,
  },
  swipeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    padding: 12,
    ...V4_SHADOWS.soft,
  },
  swipeBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  swipeIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeTextCol: {
    flex: 1,
    gap: 2,
  },
  swipeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swipeTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#031B2A',
  },
  newFeatureBadge: {
    backgroundColor: '#D97706',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  newFeatureText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  swipeSub: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 15,
  },
  swipeLaunchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginLeft: 8,
  },
  swipeLaunchBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* CREATE CARD */
  createCardWrap: {
    paddingHorizontal: 16,
  },
  createCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    padding: 16,
    gap: 10,
    ...V4_SHADOWS.soft,
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
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#031B2A',
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
    color: '#475569',
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
    backgroundColor: '#0F766E',
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 14,
  },
  createPrimaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  freeListingNote: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  discardDraftBtn: {
    paddingHorizontal: 10,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discardDraftText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#EF4444',
  },

  /* MANAGE PROFILE CARD */
  manageCardWrap: {
    paddingHorizontal: 16,
  },
  manageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E5EEF0',
    padding: 14,
    gap: 12,
    ...V4_SHADOWS.soft,
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
    backgroundColor: '#F0FDFA',
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
    color: '#031B2A',
  },
  manageCardSub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  statusPillLive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#DCFCE7',
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
    backgroundColor: '#16A34A',
  },
  statusDotPaused: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D97706',
  },
  statusPillTextLive: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.2,
  },
  statusPillTextPaused: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.2,
  },
  manageUserName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#031B2A',
    marginTop: 1,
  },
  manageAvatarInitial: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F766E',
  },
  manageActionsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  managePrimaryBtn: {
    flex: 1.2,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#0F766E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  managePrimaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  manageSecondaryBtn: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
  },
  manageSecondaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#031B2A',
  },

  /* FILTER SECTION */
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
    color: '#031B2A',
    letterSpacing: -0.2,
  },
  countBadge: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  countBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  listSection: {
    paddingHorizontal: 16,
    gap: 14,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 28,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#031B2A',
    marginTop: 4,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyResetBtn: {
    marginTop: 8,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  emptyResetText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
});
