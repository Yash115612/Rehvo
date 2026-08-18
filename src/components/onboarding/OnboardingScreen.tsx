import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ArrowRight } from 'lucide-react-native';
import { REHVOLogo } from '../brand/REHVOLogo';

interface OnboardingScreenProps {
  onComplete: () => void;
  onSkip: () => void;
  onSignIn: () => void;
}

interface SlideData {
  id: string;
  image: string;
  headline: string;
  supporting: string;
  badges?: string[];
}

const SLIDES: SlideData[] = [
  {
    id: 'slide_1',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    headline: "Find a place you'll love.",
    supporting: 'Discover flats, rooms and stays made for the way you live.',
  },
  {
    id: 'slide_2',
    image:
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200',
    headline: 'Real places. Better choices.',
    supporting: 'Explore verified listings with clear prices, photos and availability.',
    badges: ['Verified', 'Clear pricing', 'Fresh listings'],
  },
  {
    id: 'slide_3',
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
    headline: 'Rent without the headache.',
    supporting: 'Search, save, chat and schedule visits — all in one place.',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  onSkip,
  onSignIn,
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const isLastSlide = activeIndex === SLIDES.length - 1;

  // Handle horizontal swipe momentum
  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / screenWidth);
      if (index >= 0 && index < SLIDES.length) {
        setActiveIndex(index);
      }
    },
    [screenWidth],
  );

  const handleContinue = () => {
    if (activeIndex < SLIDES.length - 1) {
      const nextIndex = activeIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    } else {
      onComplete();
    }
  };

  const imageCardHeight = Math.min(Math.max(screenHeight * 0.42, 280), 380);

  const renderSlideItem = ({ item }: { item: SlideData }) => {
    return (
      <View style={[styles.slideContainer, { width: screenWidth }]}>
        {/* Large Rounded Hero Image */}
        <View style={[styles.imageCard, { height: imageCardHeight }]}>
          <Image
            source={{ uri: item.image }}
            style={styles.slideImage}
            resizeMode="cover"
          />
        </View>

        {/* Text & Content Panel */}
        <View style={styles.textContainer}>
          {item.badges && item.badges.length > 0 && (
            <View style={styles.badgeRow}>
              {item.badges.map((badge, idx) => (
                <View key={idx} style={styles.badgeItem}>
                  <Check size={13} color="#32B768" strokeWidth={2.5} />
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.headline} numberOfLines={2}>
            {item.headline}
          </Text>
          <Text style={styles.supporting}>{item.supporting}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* 1. Top Bar: REHVO Logo + Skip CTA */}
      <View style={styles.topBar}>
        <REHVOLogo size="small" />

        {!isLastSlide ? (
          <Pressable
            onPress={onSkip}
            hitSlop={8}
            style={styles.skipBtn}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
          >
            <Text style={styles.skipBtnText}>Skip</Text>
          </Pressable>
        ) : (
          <View style={styles.skipPlaceholder} />
        )}
      </View>

      {/* 2. Horizontal Swipable Content */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderSlideItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={styles.flatList}
      />

      {/* 3. Bottom Controls: Progress Dots + Actions */}
      <View
        style={[
          styles.bottomControls,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        {/* Progress Indicator */}
        <View style={styles.progressRow}>
          {SLIDES.map((_, idx) => {
            const isActive = idx === activeIndex;
            return (
              <View
                key={idx}
                style={[
                  styles.progressDot,
                  isActive
                    ? styles.progressDotActive
                    : styles.progressDotInactive,
                ]}
              />
            );
          })}
        </View>

        {/* Action Button Section */}
        <View style={styles.actionsWrap}>
          {isLastSlide ? (
            <View style={styles.finalActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  pressed && styles.primaryBtnPressed,
                ]}
                onPress={onComplete}
                accessibilityRole="button"
                accessibilityLabel="Get started"
              >
                <Text style={styles.primaryBtnText}>Get started</Text>
                <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
              </Pressable>

              <Pressable
                style={styles.signInBtn}
                onPress={onSignIn}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel="Already have an account? Sign in"
              >
                <Text style={styles.signInBtnPrompt}>
                  Already have an account?{' '}
                  <Text style={styles.signInBtnLink}>Sign in</Text>
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.primaryBtnPressed,
              ]}
              onPress={handleContinue}
              accessibilityRole="button"
              accessibilityLabel="Continue"
            >
              <Text style={styles.primaryBtnText}>Continue</Text>
              <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },

  skipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#EAE7E1',
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#777482',
  },
  skipPlaceholder: {
    width: 48,
    height: 28,
  },
  flatList: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  imageCard: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#EAE7E1',
    ...Platform.select({
      ios: {
        shadowColor: '#171522',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    paddingTop: 16,
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#32B768',
  },
  headline: {
    fontSize: 27,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
    lineHeight: 33,
  },
  supporting: {
    fontSize: 14.5,
    color: '#777482',
    lineHeight: 21,
    fontWeight: '400',
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressDot: {
    height: 6,
    borderRadius: 3,
  },
  progressDotActive: {
    width: 26,
    backgroundColor: '#6C4DFF',
  },
  progressDotInactive: {
    width: 6,
    backgroundColor: '#E8E5EC',
  },
  actionsWrap: {
    width: '100%',
  },
  finalActions: {
    gap: 10,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#6C4DFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.24,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  primaryBtnPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  signInBtn: {
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInBtnPrompt: {
    fontSize: 13.5,
    color: '#777482',
  },
  signInBtnLink: {
    fontWeight: '700',
    color: '#6C4DFF',
  },
});
