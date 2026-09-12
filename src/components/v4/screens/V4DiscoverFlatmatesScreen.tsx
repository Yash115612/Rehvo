import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  X,
  Star,
  Bookmark,
  ShieldCheck,
  Sparkles,
  MapPin,
  Briefcase,
  SlidersHorizontal,
  RotateCcw,
  Info,
  Building2,
  GraduationCap,
  Flame,
  Clock,
  Compass,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS, V4_TYPOGRAPHY, V4_RADIUS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';
import { FlatmateProfile } from '../../../types';
import { V4Image } from '../ui/V4Image';
import { calculateCompatibilityScore2 } from '../../../services/flatmateCompatibility';
import { calculateTrustScore } from '../../../services/trustSafety';
import { V4MatchCelebrationModal } from '../flatmates/V4MatchCelebrationModal';
import { V4FlatmatesFilterModal } from '../flatmates/V4FlatmatesFilterModal';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 110;
const VERTICAL_SUPER_THRESHOLD = -100;

export const V4DiscoverFlatmatesScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    flatmates,
    myFlatmateProfile,
    swipeFlatmate,
    undoLastSwipe,
    superWaveFlatmate,
    saveFlatmate,
    unsaveFlatmate,
    isFlatmateSaved,
    swipeHistory,
    fetchPublishedFlatmates,
  } = useAppStore();

  const [activeCategory, setActiveCategory] = useState<'daily' | 'nearby' | 'recent' | 'compatible'>('daily');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [matchedProfile, setMatchedProfile] = useState<FlatmateProfile | null>(null);
  const [isCelebrationVisible, setIsCelebrationVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Sync latest profiles on mount
  useEffect(() => {
    fetchPublishedFlatmates();
  }, [fetchPublishedFlatmates]);

  // Filter deck based on active category
  const deck = useMemo(() => {
    let list = [...flatmates];

    switch (activeCategory) {
      case 'nearby': {
        const userLoc = (myFlatmateProfile?.locality || '').toLowerCase();
        if (userLoc) {
          list = list.filter(
            (f) =>
              (f.locality && f.locality.toLowerCase().includes(userLoc)) ||
              (f.city && f.city.toLowerCase() === (myFlatmateProfile?.city || '').toLowerCase())
          );
        }
        break;
      }
      case 'recent': {
        list.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        break;
      }
      case 'compatible': {
        list = list
          .map((f) => ({ profile: f, synergy: calculateCompatibilityScore2(myFlatmateProfile, f).overallScore }))
          .filter((item) => item.synergy >= 80)
          .sort((a, b) => b.synergy - a.synergy)
          .map((item) => item.profile);
        break;
      }
      case 'daily':
      default: {
        list.sort((a, b) => (b.match_score || 88) - (a.match_score || 88));
        break;
      }
    }

    return list;
  }, [flatmates, activeCategory, myFlatmateProfile]);

  const currentCard = deck[currentIndex];
  const nextCard = deck[currentIndex + 1];

  // Prefetch upcoming card images
  useEffect(() => {
    if (currentCard?.avatar) {
      V4Image.prefetch([currentCard.avatar, ...(currentCard.photos || [])]);
    }
    if (nextCard?.avatar) {
      V4Image.prefetch([nextCard.avatar, ...(nextCard.photos || [])]);
    }
  }, [currentCard, nextCard]);

  // Reset photo index when card changes
  useEffect(() => {
    setPhotoIndex(0);
  }, [currentIndex]);

  // Pan and animation values
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-9deg', '0deg', '9deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [15, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const skipOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -15],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const superWaveOpacity = position.y.interpolate({
    inputRange: [VERTICAL_SUPER_THRESHOLD, -20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [1, 0.94, 1],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > 10 || Math.abs(gesture.dy) > 10;
      },
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < VERTICAL_SUPER_THRESHOLD) {
          handleSwipe('superlike');
        } else if (gesture.dx > SWIPE_THRESHOLD) {
          handleSwipe('like');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          handleSwipe('skip');
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: Platform.OS !== 'web',
          }).start();
        }
      },
    })
  ).current;

  const handleSwipe = async (action: 'like' | 'skip' | 'superlike') => {
    if (!currentCard) return;

    let xDest = 0;
    let yDest = 0;

    if (action === 'superlike') {
      yDest = -height;
    } else if (action === 'like') {
      xDest = width + 100;
    } else {
      xDest = -width - 100;
    }

    Animated.timing(position, {
      toValue: { x: xDest, y: yDest },
      duration: 250,
      useNativeDriver: Platform.OS !== 'web',
    }).start(async () => {
      position.setValue({ x: 0, y: 0 });
      setCurrentIndex((prev) => prev + 1);

      if (action === 'superlike') {
        const res = await superWaveFlatmate(currentCard.id);
        if (res.isMatched) {
          setMatchedProfile(currentCard);
          setIsCelebrationVisible(true);
        }
      } else {
        const res = await swipeFlatmate(currentCard.id, action);
        if (res.isMatch) {
          setMatchedProfile(currentCard);
          setIsCelebrationVisible(true);
        }
      }
    });
  };

  const handleUndo = () => {
    if (swipeHistory.length === 0 || currentIndex === 0) return;
    const restored = undoLastSwipe();
    if (restored) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
      position.setValue({ x: 0, y: 0 });
    }
  };

  const handleNextPhoto = () => {
    const photos = currentCard?.photos && currentCard.photos.length > 0 ? currentCard.photos : [currentCard?.avatar];
    if (photoIndex < photos.length - 1) {
      setPhotoIndex(photoIndex + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
    }
  };

  // Card details
  const cardPhotos = currentCard?.photos && currentCard.photos.length > 0 ? currentCard.photos : [currentCard?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'];
  const synergy = currentCard ? calculateCompatibilityScore2(myFlatmateProfile, currentCard) : null;
  const trust = currentCard ? calculateTrustScore(currentCard) : null;
  const isSaved = currentCard ? isFlatmateSaved(currentCard.id) : false;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={22} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Discover Roommates</Text>
          <Text style={styles.headerSubtitle}>
            {deck.length > 0 ? `${Math.min(currentIndex + 1, deck.length)} of ${deck.length} Verified Profiles` : 'Realtime Matches'}
          </Text>
        </View>

        <Pressable
          style={styles.filterBtn}
          onPress={() => setIsFilterVisible(true)}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Filters"
        >
          <SlidersHorizontal size={20} color={V4_COLORS.primary} strokeWidth={2.2} />
        </Pressable>
      </View>

      {/* 4 Category Feeds Strip */}
      <View style={styles.categoryStripContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryStrip}
        >
          <Pressable
            style={[styles.categoryTab, activeCategory === 'daily' && styles.categoryTabActive]}
            onPress={() => {
              setActiveCategory('daily');
              setCurrentIndex(0);
            }}
          >
            <Flame size={14} color={activeCategory === 'daily' ? '#FFFFFF' : V4_COLORS.textSecondary} />
            <Text style={[styles.categoryTabText, activeCategory === 'daily' && styles.categoryTabTextActive]}>
              Daily Picks
            </Text>
          </Pressable>

          <Pressable
            style={[styles.categoryTab, activeCategory === 'compatible' && styles.categoryTabActive]}
            onPress={() => {
              setActiveCategory('compatible');
              setCurrentIndex(0);
            }}
          >
            <Sparkles size={14} color={activeCategory === 'compatible' ? '#FFFFFF' : V4_COLORS.textSecondary} />
            <Text style={[styles.categoryTabText, activeCategory === 'compatible' && styles.categoryTabTextActive]}>
              Compatible Today
            </Text>
          </Pressable>

          <Pressable
            style={[styles.categoryTab, activeCategory === 'nearby' && styles.categoryTabActive]}
            onPress={() => {
              setActiveCategory('nearby');
              setCurrentIndex(0);
            }}
          >
            <Compass size={14} color={activeCategory === 'nearby' ? '#FFFFFF' : V4_COLORS.textSecondary} />
            <Text style={[styles.categoryTabText, activeCategory === 'nearby' && styles.categoryTabTextActive]}>
              Nearby Hubs
            </Text>
          </Pressable>

          <Pressable
            style={[styles.categoryTab, activeCategory === 'recent' && styles.categoryTabActive]}
            onPress={() => {
              setActiveCategory('recent');
              setCurrentIndex(0);
            }}
          >
            <Clock size={14} color={activeCategory === 'recent' ? '#FFFFFF' : V4_COLORS.textSecondary} />
            <Text style={[styles.categoryTabText, activeCategory === 'recent' && styles.categoryTabTextActive]}>
              Recently Joined
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Swipe Deck Area */}
      <View style={styles.deckContainer}>
        {currentIndex < deck.length && currentCard ? (
          <>
            {/* Background Card */}
            {nextCard && (
              <Animated.View
                style={[
                  styles.card,
                  styles.backgroundCard,
                  {
                    transform: [{ scale: nextCardScale }],
                  },
                ]}
              >
                <V4Image
                  source={{ uri: nextCard.avatar || nextCard.photos?.[0] }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardGradientOverlay} />
                <View style={styles.cardBottomInfo}>
                  <Text style={styles.cardName}>{nextCard.name}, {nextCard.age || 25}</Text>
                  <Text style={styles.cardOccupation}>{nextCard.occupation || nextCard.profession}</Text>
                </View>
              </Animated.View>
            )}

            {/* Foreground Interactive Card */}
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.card,
                styles.activeCard,
                {
                  transform: [
                    { translateX: position.x },
                    { translateY: position.y },
                    { rotate: rotate },
                  ],
                },
              ]}
            >
              {/* Photo Carousel Area */}
              <View style={styles.photoContainer}>
                <V4Image
                  source={{ uri: cardPhotos[photoIndex] }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />

                {/* Left/Right Tap Zones for Photo Navigation */}
                <Pressable
                  style={styles.photoTapLeft}
                  onPress={handlePrevPhoto}
                  accessibilityLabel="Previous photo"
                />
                <Pressable
                  style={styles.photoTapRight}
                  onPress={handleNextPhoto}
                  accessibilityLabel="Next photo"
                />

                {/* Story-Style Photo Dots */}
                {cardPhotos.length > 1 && (
                  <View style={styles.photoDotsRow}>
                    {cardPhotos.map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.photoDot,
                          i === photoIndex ? styles.photoDotActive : styles.photoDotInactive,
                        ]}
                      />
                    ))}
                  </View>
                )}

                {/* Floating Swipe Overlays (Like, Skip, Super Wave) */}
                <Animated.View style={[styles.swipeIndicator, styles.likeIndicator, { opacity: likeOpacity }]}>
                  <Text style={styles.likeIndicatorText}>WAVE 👋</Text>
                </Animated.View>

                <Animated.View style={[styles.swipeIndicator, styles.skipIndicator, { opacity: skipOpacity }]}>
                  <Text style={styles.skipIndicatorText}>PASS ✖</Text>
                </Animated.View>

                <Animated.View style={[styles.swipeIndicator, styles.superIndicator, { opacity: superWaveOpacity }]}>
                  <Text style={styles.superIndicatorText}>SUPER WAVE ⭐</Text>
                </Animated.View>

                {/* Top Floating Badges: Compatibility + Trust Shield */}
                <View style={styles.cardTopBadgeRow}>
                  {synergy && (
                    <View style={styles.synergyPill}>
                      <Sparkles size={12} color="#064E3B" strokeWidth={2.5} />
                      <Text style={styles.synergyPillText}>{synergy.overallScore}% Synergy</Text>
                    </View>
                  )}

                  {trust && trust.score >= 70 && (
                    <View style={styles.trustShieldPill}>
                      <ShieldCheck size={12} color="#0F766E" strokeWidth={2.5} />
                      <Text style={styles.trustShieldText}>Trust {trust.score}</Text>
                    </View>
                  )}

                  <Pressable
                    style={styles.saveBookmarkBtn}
                    onPress={() => {
                      if (isSaved) unsaveFlatmate(currentCard.id);
                      else saveFlatmate(currentCard.id);
                    }}
                    hitSlop={10}
                    accessibilityLabel="Save profile"
                  >
                    <Bookmark
                      size={16}
                      color={isSaved ? V4_COLORS.primary : '#FFFFFF'}
                      fill={isSaved ? V4_COLORS.primary : 'rgba(0,0,0,0.3)'}
                    />
                  </Pressable>
                </View>

                {/* Card Gradient Overlay */}
                <View style={styles.cardGradientOverlay} />

                {/* Card Main Info Block */}
                <Pressable
                  style={styles.cardBottomInfo}
                  onPress={() => router.push(`/(renter)/flatmate/${currentCard.id}`)}
                >
                  <View style={styles.nameRow}>
                    <Text style={styles.cardName}>
                      {currentCard.name}, {currentCard.age || 25}
                    </Text>
                    {currentCard.is_kyc_verified && (
                      <ShieldCheck size={18} color="#10B981" strokeWidth={2.6} />
                    )}
                  </View>

                  {/* Work & Alma Mater */}
                  <View style={styles.professionRow}>
                    <Briefcase size={14} color="#CCFBF1" />
                    <Text style={styles.professionText} numberOfLines={1}>
                      {currentCard.occupation || currentCard.profession || 'Professional'}
                      {currentCard.company ? ` at ${currentCard.company}` : ''}
                    </Text>
                  </View>

                  {currentCard.college && (
                    <View style={styles.collegeRow}>
                      <GraduationCap size={13} color="#99F6E4" />
                      <Text style={styles.collegeText} numberOfLines={1}>
                        {currentCard.college}
                      </Text>
                    </View>
                  )}

                  {/* Locality & Budget */}
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <MapPin size={13} color="#F0FDFA" />
                      <Text style={styles.metaText}>{currentCard.locality || currentCard.city}</Text>
                    </View>
                    <Text style={styles.metaDot}>•</Text>
                    <View style={styles.metaItem}>
                      <Text style={styles.budgetText}>
                        ₹{((currentCard.budget_min || 0) / 1000).toFixed(0)}K – ₹{((currentCard.budget_max || 35000) / 1000).toFixed(0)}K
                      </Text>
                    </View>
                  </View>

                  {/* Lifestyle Chips Preview */}
                  <View style={styles.lifestyleChipRow}>
                    {currentCard.food_preference && (
                      <View style={styles.lifestyleChip}>
                        <Text style={styles.lifestyleChipText}>{currentCard.food_preference}</Text>
                      </View>
                    )}
                    {currentCard.smoking && (
                      <View style={styles.lifestyleChip}>
                        <Text style={styles.lifestyleChipText}>{currentCard.smoking}</Text>
                      </View>
                    )}
                    {currentCard.work_mode && (
                      <View style={styles.lifestyleChip}>
                        <Text style={styles.lifestyleChipText}>{currentCard.work_mode.toUpperCase()}</Text>
                      </View>
                    )}
                  </View>

                  {/* Hinge-style Prompt Preview */}
                  {currentCard.prompts && currentCard.prompts.length > 0 && (
                    <View style={styles.promptSnippetBox}>
                      <Text style={styles.promptSnippetQ}>
                        {currentCard.prompts[0].prompt_question}
                      </Text>
                      <Text style={styles.promptSnippetA} numberOfLines={1}>
                        "{currentCard.prompts[0].prompt_answer}"
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </Animated.View>
          </>
        ) : (
          /* Empty Deck State */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <Sparkles size={36} color={V4_COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>You're All Caught Up!</Text>
            <Text style={styles.emptySubtitle}>
              New flatmate profiles matching your preferences join REHVO daily. Try switching categories or adjust your filters.
            </Text>
            <Pressable
              style={styles.refreshBtn}
              onPress={() => {
                setCurrentIndex(0);
                fetchPublishedFlatmates();
              }}
            >
              <RotateCcw size={16} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.refreshBtnText}>Review Profiles Again</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Floating Bottom Action Bar */}
      {currentIndex < deck.length && currentCard && (
        <View style={[styles.actionBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          {/* Undo */}
          <Pressable
            style={[styles.actionBtn, styles.undoBtn, swipeHistory.length === 0 && styles.actionBtnDisabled]}
            onPress={handleUndo}
            disabled={swipeHistory.length === 0}
            hitSlop={8}
            accessibilityLabel="Undo last swipe"
          >
            <RotateCcw size={20} color={swipeHistory.length > 0 ? '#F59E0B' : '#9CA3AF'} strokeWidth={2.4} />
          </Pressable>

          {/* Pass (Skip) */}
          <Pressable
            style={[styles.actionBtn, styles.passBtn]}
            onPress={() => handleSwipe('skip')}
            hitSlop={8}
            accessibilityLabel="Pass flatmate"
          >
            <X size={26} color="#EF4444" strokeWidth={2.6} />
          </Pressable>

          {/* Super Wave */}
          <Pressable
            style={[styles.actionBtn, styles.superWaveBtn]}
            onPress={() => handleSwipe('superlike')}
            hitSlop={8}
            accessibilityLabel="Super wave flatmate"
          >
            <Star size={24} color="#F59E0B" fill="#F59E0B" strokeWidth={2} />
          </Pressable>

          {/* Wave (Connect) */}
          <Pressable
            style={[styles.actionBtn, styles.waveBtn]}
            onPress={() => handleSwipe('like')}
            hitSlop={8}
            accessibilityLabel="Wave to flatmate"
          >
            <Sparkles size={26} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>

          {/* Details */}
          <Pressable
            style={[styles.actionBtn, styles.infoBtn]}
            onPress={() => router.push(`/(renter)/flatmate/${currentCard.id}`)}
            hitSlop={8}
            accessibilityLabel="View full profile"
          >
            <Info size={20} color="#0F766E" strokeWidth={2.4} />
          </Pressable>
        </View>
      )}

      {/* Celebration & Filter Modals */}
      {matchedProfile && (
        <V4MatchCelebrationModal
          visible={isCelebrationVisible}
          onClose={() => setIsCelebrationVisible(false)}
          flatmate={matchedProfile}
          onSendMessage={(profile) => {
            setIsCelebrationVisible(false);
            router.push(`/(renter)/flatmate/${profile.id}`);
          }}
        />
      )}

      <V4FlatmatesFilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        filters={{}}
        onApplyFilters={() => setIsFilterVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: V4_COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryStripContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryStrip: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  categoryTabActive: {
    backgroundColor: V4_COLORS.primary,
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },
  deckContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 80,
  },
  card: {
    position: 'absolute',
    width: width - 32,
    height: '100%',
    maxHeight: 580,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    overflow: 'hidden',
    ...V4_SHADOWS.card,
  },
  activeCard: {
    zIndex: 10,
  },
  backgroundCard: {
    zIndex: 5,
  },
  photoContainer: {
    flex: 1,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  photoTapLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '40%',
    height: '75%',
    zIndex: 15,
  },
  photoTapRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '40%',
    height: '75%',
    zIndex: 15,
  },
  photoDotsRow: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 6,
    zIndex: 25,
  },
  photoDot: {
    flex: 1,
    height: 3.5,
    borderRadius: 2,
  },
  photoDotActive: {
    backgroundColor: '#FFFFFF',
  },
  photoDotInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  cardTopBadgeRow: {
    position: 'absolute',
    top: 26,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 25,
  },
  synergyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#CCFBF1',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  synergyPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#064E3B',
  },
  trustShieldPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  trustShieldText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  saveBookmarkBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: 'transparent',
    // Gradient simulation
    opacity: 0.95,
  },
  cardBottomInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 22,
    paddingTop: 40,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  cardOccupation: {
    fontSize: 14,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  professionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  professionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CCFBF1',
  },
  collegeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  collegeText: {
    fontSize: 12,
    color: '#99F6E4',
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#F0FDFA',
    fontWeight: '600',
  },
  metaDot: {
    color: '#94A3B8',
    fontSize: 13,
  },
  budgetText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#34D399',
  },
  lifestyleChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  lifestyleChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  lifestyleChipText: {
    fontSize: 11,
    color: '#F8FAFC',
    fontWeight: '600',
  },
  promptSnippetBox: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#2DD4BF',
  },
  promptSnippetQ: {
    fontSize: 11,
    fontWeight: '700',
    color: '#99F6E4',
    textTransform: 'uppercase',
  },
  promptSnippetA: {
    fontSize: 12,
    color: '#FFFFFF',
    fontStyle: 'italic',
    marginTop: 2,
  },
  swipeIndicator: {
    position: 'absolute',
    top: 60,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 3,
    zIndex: 30,
  },
  likeIndicator: {
    left: 30,
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    transform: [{ rotate: '-18deg' }],
  },
  likeIndicatorText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#10B981',
  },
  skipIndicator: {
    right: 30,
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    transform: [{ rotate: '18deg' }],
  },
  skipIndicatorText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#EF4444',
  },
  superIndicator: {
    alignSelf: 'center',
    top: 90,
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
  },
  superIndicatorText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F59E0B',
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    ...V4_SHADOWS.floating,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    ...V4_SHADOWS.soft,
  },
  undoBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF3C7',
  },
  actionBtnDisabled: {
    opacity: 0.4,
  },
  passBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEE2E2',
  },
  superWaveBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#FCD34D',
  },
  waveBtn: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#0F766E',
    ...V4_SHADOWS.medium,
  },
  infoBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDFA',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: V4_COLORS.primary,
  },
  refreshBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
