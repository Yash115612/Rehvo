import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  StyleSheet,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HORIZONTAL_PADDING = 16;
const CARD_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
const CARD_HEIGHT = Math.round(CARD_WIDTH / 2);
const CORNER_RADIUS = 22;
const AUTO_ADVANCE_MS = 4500;
const RESUME_DELAY_MS = 2200;
const PAGE_WIDTH = SCREEN_WIDTH;

export type AdAction =
  | { type: 'search' }
  | { type: 'filter'; key: string; value: any }
  | { type: 'route'; path: string };

export interface AdSlide {
  id: string;
  image: string;
  badge?: string;
  badgeTone?: 'primary' | 'success' | 'coral' | 'neutral';
  title: string;
  description: string;
  cta: string;
  action: AdAction;
}

export interface AdCarouselProps {
  slides?: AdSlide[];
}

const AD_SLIDES: AdSlide[] = [
  {
    id: 'verified-homes',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1400',
    badge: 'REHVO VERIFIED',
    badgeTone: 'success',
    title: "Find a home you'll love.",
    description: 'Discover verified homes across Mumbai.',
    cta: 'Explore homes',
    action: { type: 'filter', key: 'verified_only', value: true },
  },
  {
    id: 'no-brokerage',
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1400',
    badge: 'NO BROKERAGE',
    badgeTone: 'primary',
    title: 'More home. Less hassle.',
    description: 'Discover owner-listed properties and save big.',
    cta: 'Explore now',
    action: { type: 'filter', key: 'brokerage_free_only', value: true },
  },
  {
    id: 'moving-soon',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1400',
    badge: 'TOP NEIGHBOURHOODS',
    badgeTone: 'coral',
    title: 'Moving soon?',
    description: 'Discover homes near your favourite neighbourhood.',
    cta: 'Browse areas',
    action: { type: 'search' },
  },
  {
    id: 'search-confidence',
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1400',
    badge: '100% TRUSTED',
    badgeTone: 'success',
    title: 'Verified properties.',
    description: 'Every listing is checked. Search with confidence.',
    cta: 'See verified',
    action: { type: 'filter', key: 'verified_only', value: true },
  },
  {
    id: 'list-property',
    image:
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1400',
    badge: 'FOR OWNERS',
    badgeTone: 'primary',
    title: 'List your property.',
    description: 'Reach serious renters on REHVO.',
    cta: 'Start listing',
    action: { type: 'route', path: '/(renter)/listing/property-type' },
  },
];

const getBadgeColors = (tone?: AdSlide['badgeTone']) => {
  switch (tone) {
    case 'success':
      return { dot: '#32B768', border: 'rgba(50,183,104,0.35)' };
    case 'primary':
      return { dot: '#6C4DFF', border: 'rgba(108,77,255,0.4)' };
    case 'coral':
      return { dot: '#FF735C', border: 'rgba(255,115,92,0.4)' };
    case 'neutral':
    default:
      return { dot: '#FFFFFF', border: 'rgba(255,255,255,0.22)' };
  }
};

export const AdCarousel: React.FC<AdCarouselProps> = ({ slides = AD_SLIDES }) => {
  const router = useRouter();
  const { setFilter, showToast } = useAppStore();

  const slideCount = slides.length;
  const LOOP_SIZE = slideCount + 2;

  const [activeRealIndex, setActiveRealIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInteractingRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrolledIndexRef = useRef(1);
  const isProgrammaticScrollRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    clearTimers();
    intervalRef.current = setInterval(() => {
      if (isInteractingRef.current) return;
      isProgrammaticScrollRef.current = true;
      const nextScrollIndex = lastScrolledIndexRef.current + 1;
      flatRef.current?.scrollToOffset({
        offset: nextScrollIndex * PAGE_WIDTH,
        animated: true,
      });
      lastScrolledIndexRef.current = nextScrollIndex;
    }, AUTO_ADVANCE_MS);
  }, [clearTimers]);

  useEffect(() => {
    startAutoplay();
    return clearTimers;
  }, [startAutoplay, clearTimers]);

  const handleScrollBegin = useCallback(() => {
    isInteractingRef.current = true;
  }, []);

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = e.nativeEvent.contentOffset.x;
      const loopIdx = Math.max(0, Math.round(offset / PAGE_WIDTH));
      let realIdx = loopIdx - 1;

      if (loopIdx === 0) {
        isProgrammaticScrollRef.current = true;
        realIdx = slideCount - 1;
        setTimeout(() => {
          flatRef.current?.scrollToOffset({
            offset: slideCount * PAGE_WIDTH,
            animated: false,
          });
          lastScrolledIndexRef.current = slideCount;
        }, 50);
      } else if (loopIdx === LOOP_SIZE - 1) {
        isProgrammaticScrollRef.current = true;
        realIdx = 0;
        setTimeout(() => {
          flatRef.current?.scrollToOffset({
            offset: PAGE_WIDTH,
            animated: false,
          });
          lastScrolledIndexRef.current = 1;
        }, 50);
      } else {
        lastScrolledIndexRef.current = loopIdx;
      }

      const clampedReal = (realIdx + slideCount) % slideCount;
      setActiveRealIndex(clampedReal);

      if (isInteractingRef.current) {
        isInteractingRef.current = false;
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = setTimeout(() => {
          startAutoplay();
        }, RESUME_DELAY_MS);
      }
    },
    [slideCount, LOOP_SIZE, startAutoplay]
  );

  const onScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isProgrammaticScrollRef.current) {
        isInteractingRef.current = true;
      }
      isProgrammaticScrollRef.current = false;
    },
    []
  );

  const handleSlidePress = useCallback(
    (slide: AdSlide) => {
      switch (slide.action.type) {
        case 'search':
          router.push('/(renter)/search');
          break;
        case 'filter': {
          const { key, value } = slide.action;
          setFilter({ [key]: value } as any);
          showToast('Filter applied', 'info');
          router.push('/(renter)/search');
          break;
        }
        case 'route':
          router.push(slide.action.path as any);
          break;
      }
    },
    [router, setFilter, showToast]
  );

  const getLoopData = () => {
    if (slideCount === 0) return [];
    const last = slides[slideCount - 1];
    const first = slides[0];
    return [last, ...slides, first];
  };

  const loopData = useMemo(() => getLoopData(), [slides, slideCount]);

  const renderSlide = ({ item }: { item: AdSlide }) => {
    const colors = getBadgeColors(item.badgeTone);
    return (
      <View style={styles.slideWrapper}>
        <Pressable
          onPress={() => handleSlidePress(item)}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          hitSlop={2}
        >
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.overlayTop} />
          <View style={styles.overlayBottom} />
          <View style={styles.content}>
            {item.badge && (
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.badge,
                    { borderColor: colors.border },
                  ]}
                >
                  <View style={[styles.badgeDot, { backgroundColor: colors.dot }]} />
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              </View>
            )}
            <View style={styles.textBlock}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <View style={styles.ctaRow}>
              <View style={styles.ctaButton}>
                <Text style={styles.ctaText}>{item.cta}</Text>
                <Text style={styles.ctaArrow}>→</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <FlatList
        ref={flatRef}
        data={loopData}
        keyExtractor={(item, idx) => `${item.id}-${idx}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        snapToInterval={PAGE_WIDTH}
        decelerationRate="fast"
        snapToAlignment="start"
        initialScrollIndex={1}
        getItemLayout={(_, index) => ({
          length: PAGE_WIDTH,
          offset: PAGE_WIDTH * index,
          index,
        })}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={renderSlide}
        initialNumToRender={3}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
      />
      <View style={styles.pagination}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === activeRealIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {},
  slideWrapper: {
    width: PAGE_WIDTH,
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginLeft: HORIZONTAL_PADDING,
    borderRadius: CORNER_RADIUS,
    overflow: 'hidden',
    backgroundColor: '#171522',
    ...Platform.select({
      ios: {
        shadowColor: '#171522',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardPressed: {
    opacity: 0.97,
    transform: [{ scale: 0.992 }],
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2A2540',
  },
  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(23, 21, 34, 0.22)',
  },
  overlayBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '72%',
    backgroundColor: 'rgba(23, 21, 34, 0.52)',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  badgeRow: {
    alignSelf: 'flex-start',
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  textBlock: {
    marginTop: 0,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.86)',
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 17,
    marginTop: 4,
    maxWidth: '92%',
  },
  ctaRow: {
    marginTop: 8,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 9.5,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaText: {
    color: '#171522',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  ctaArrow: {
    color: '#171522',
    fontSize: 13,
    fontWeight: '700',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D6D2DB',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#6C4DFF',
    borderRadius: 4,
  },
});
