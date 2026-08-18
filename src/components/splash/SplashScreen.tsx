import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

interface SplashScreenProps {
  onFinish: () => void;
  isReady?: boolean;
}

const LETTERS = ['R', 'E', 'H', 'V', 'O'];
const TAGLINE = 'Find a place. Find your people.';

const BG_COLOR = '#F8F7F4';
const BRAND_NAVY = '#171522';
const TAGLINE_COLOR = '#777482';
const MIN_SPLASH_DURATION_MS = 1750;

/**
 * SplashScreen — Final Approved REHVO Brand Reveal
 *
 * Visual Stages:
 * 1. Clean, calm #F8F7F4 background canvas
 * 2. Uppercase "REHVO" reveals letter-by-letter: R -> E -> H -> V -> O (150ms - 850ms)
 * 3. Tagline "Find a place. Find your people." appears underneath (600ms - 950ms)
 * 4. Complete brand lockup holds steadily (950ms - 1450ms)
 * 5. Smooth upward fade-out & scale exit transition (1450ms - 1750ms)
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  isReady = true,
}) => {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();

  const [hasCompletedMinTime, setHasCompletedMinTime] = useState(false);
  const finishTriggered = useRef(false);

  // Shared values for each letter
  const l0Opacity = useSharedValue(0);
  const l0TranslateY = useSharedValue(8);
  const l0Scale = useSharedValue(0.94);

  const l1Opacity = useSharedValue(0);
  const l1TranslateY = useSharedValue(8);
  const l1Scale = useSharedValue(0.94);

  const l2Opacity = useSharedValue(0);
  const l2TranslateY = useSharedValue(8);
  const l2Scale = useSharedValue(0.94);

  const l3Opacity = useSharedValue(0);
  const l3TranslateY = useSharedValue(8);
  const l3Scale = useSharedValue(0.94);

  const l4Opacity = useSharedValue(0);
  const l4TranslateY = useSharedValue(8);
  const l4Scale = useSharedValue(0.94);

  // Tagline shared values
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(6);

  // Global exit animation values
  const exitOpacity = useSharedValue(1);
  const exitTranslateY = useSharedValue(0);
  const exitScale = useSharedValue(1);

  const triggerFinish = useCallback(() => {
    if (finishTriggered.current) return;
    finishTriggered.current = true;

    // Smooth upward fade exit transition
    exitOpacity.value = withTiming(0, { duration: 280, easing: Easing.in(Easing.cubic) });
    exitTranslateY.value = withTiming(-6, { duration: 280, easing: Easing.in(Easing.cubic) });
    exitScale.value = withTiming(1.02, { duration: 280, easing: Easing.out(Easing.quad) }, (finished) => {
      if (finished) {
        runOnJS(onFinish)();
      }
    });
  }, [exitOpacity, exitTranslateY, exitScale, onFinish]);

  useEffect(() => {
    const animateLetter = (
      opSv: typeof l0Opacity,
      trSv: typeof l0TranslateY,
      scSv: typeof l0Scale,
      delayMs: number,
    ) => {
      opSv.value = withDelay(
        delayMs,
        withTiming(1, { duration: 380, easing: Easing.out(Easing.cubic) }),
      );
      trSv.value = withDelay(
        delayMs,
        withTiming(0, { duration: 380, easing: Easing.out(Easing.cubic) }),
      );
      scSv.value = withDelay(
        delayMs,
        withTiming(1, { duration: 380, easing: Easing.out(Easing.cubic) }),
      );
    };

    // Staggered letters sequence: R (150ms), E (210ms), H (270ms), V (330ms), O (390ms)
    animateLetter(l0Opacity, l0TranslateY, l0Scale, 150);
    animateLetter(l1Opacity, l1TranslateY, l1Scale, 210);
    animateLetter(l2Opacity, l2TranslateY, l2Scale, 270);
    animateLetter(l3Opacity, l3TranslateY, l3Scale, 330);
    animateLetter(l4Opacity, l4TranslateY, l4Scale, 390);

    // Tagline reveal (starts at 600ms)
    taglineOpacity.value = withDelay(
      600,
      withTiming(1, { duration: 360, easing: Easing.out(Easing.cubic) }),
    );
    taglineTranslateY.value = withDelay(
      600,
      withTiming(0, { duration: 360, easing: Easing.out(Easing.cubic) }),
    );

    // Minimum display timer
    const minTimer = setTimeout(() => {
      setHasCompletedMinTime(true);
    }, MIN_SPLASH_DURATION_MS);

    return () => {
      clearTimeout(minTimer);
    };
  }, [
    l0Opacity,
    l0TranslateY,
    l0Scale,
    l1Opacity,
    l1TranslateY,
    l1Scale,
    l2Opacity,
    l2TranslateY,
    l2Scale,
    l3Opacity,
    l3TranslateY,
    l3Scale,
    l4Opacity,
    l4TranslateY,
    l4Scale,
    taglineOpacity,
    taglineTranslateY,
  ]);

  // When both min duration has elapsed and app is ready, trigger finish
  useEffect(() => {
    if (hasCompletedMinTime && isReady) {
      triggerFinish();
    }
  }, [hasCompletedMinTime, isReady, triggerFinish]);

  // Animated styles for letters
  const l0Style = useAnimatedStyle(() => ({
    opacity: l0Opacity.value,
    transform: [
      { translateY: l0TranslateY.value },
      { scale: l0Scale.value },
    ],
  } as ViewStyle));

  const l1Style = useAnimatedStyle(() => ({
    opacity: l1Opacity.value,
    transform: [
      { translateY: l1TranslateY.value },
      { scale: l1Scale.value },
    ],
  } as ViewStyle));

  const l2Style = useAnimatedStyle(() => ({
    opacity: l2Opacity.value,
    transform: [
      { translateY: l2TranslateY.value },
      { scale: l2Scale.value },
    ],
  } as ViewStyle));

  const l3Style = useAnimatedStyle(() => ({
    opacity: l3Opacity.value,
    transform: [
      { translateY: l3TranslateY.value },
      { scale: l3Scale.value },
    ],
  } as ViewStyle));

  const l4Style = useAnimatedStyle(() => ({
    opacity: l4Opacity.value,
    transform: [
      { translateY: l4TranslateY.value },
      { scale: l4Scale.value },
    ],
  } as ViewStyle));

  // Animated style for tagline
  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  } as ViewStyle));

  // Exit transition wrapper style
  const exitAnimatedStyle = useAnimatedStyle(() => ({
    opacity: exitOpacity.value,
    transform: [
      { translateY: exitTranslateY.value },
      { scale: exitScale.value },
    ],
  } as ViewStyle));

  const letterStyles = [l0Style, l1Style, l2Style, l3Style, l4Style];
  const isCompactScreen = windowWidth < 375;
  const wordmarkFontSize = isCompactScreen ? 50 : 58;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.lockupWrapper, exitAnimatedStyle]}
        accessible
        accessibilityRole="header"
        accessibilityLabel="REHVO. Find a place. Find your people."
      >
        {/* Hero: Uppercase REHVO Wordmark with Staggered Letter Assembly */}
        <View style={styles.wordmarkRow}>
          {LETTERS.map((char, index) => (
            <Animated.View key={index} style={[styles.letterCell, letterStyles[index]]}>
              <Text
                style={[
                  styles.letterText,
                  { fontSize: wordmarkFontSize },
                ]}
              >
                {char}
              </Text>
            </Animated.View>
          ))}
        </View>

        {/* Secondary: Approved Tagline */}
        <Animated.View style={[styles.taglineWrapper, taglineAnimatedStyle]}>
          <Text style={styles.taglineText}>{TAGLINE}</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockupWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  letterCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterText: {
    fontWeight: '900',
    color: BRAND_NAVY,
    letterSpacing: Platform.select({ ios: -1.2, android: -0.8, default: -1 }),
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  taglineWrapper: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taglineText: {
    fontSize: 16,
    fontWeight: '500',
    color: TAGLINE_COLOR,
    letterSpacing: -0.15,
    textAlign: 'center',
  },
});
