import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Pressable,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { V4BrandLogo } from '../ui/V4BrandLogo';
import { useAppStore } from '../../../store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LETTERS = ['r', 'e', 'h', 'v', 'o'];

export const V4SplashScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [hasNavigated, setHasNavigated] = useState(false);

  // Phase 1: Initial Kinetic Text Assembly (r - e - h - v - o)
  const l0Y = useRef(new Animated.Value(24)).current;
  const l0Op = useRef(new Animated.Value(0)).current;
  const l1Y = useRef(new Animated.Value(24)).current;
  const l1Op = useRef(new Animated.Value(0)).current;
  const l2Y = useRef(new Animated.Value(24)).current;
  const l2Op = useRef(new Animated.Value(0)).current;
  const l3Y = useRef(new Animated.Value(24)).current;
  const l3Op = useRef(new Animated.Value(0)).current;
  const l4Y = useRef(new Animated.Value(24)).current;
  const l4Op = useRef(new Animated.Value(0)).current;

  // Phase 2: Morph / Transition to Official Brand Logotype
  const initialTextOp = useRef(new Animated.Value(1)).current;
  const initialTextScale = useRef(new Animated.Value(1)).current;

  const logoScale = useRef(new Animated.Value(0.75)).current;
  const logoOp = useRef(new Animated.Value(0)).current;
  const logoY = useRef(new Animated.Value(15)).current;

  // Camera Exit Zoom
  const exitOp = useRef(new Animated.Value(1)).current;
  const exitScale = useRef(new Animated.Value(1)).current;

  const letterAnims = [
    { y: l0Y, op: l0Op },
    { y: l1Y, op: l1Op },
    { y: l2Y, op: l2Op },
    { y: l3Y, op: l3Op },
    { y: l4Y, op: l4Op },
  ];

  const navigateForward = () => {
    if (hasNavigated) return;
    setHasNavigated(true);

    const activeMode = useAppStore.getState().activeMode;
    const destination =
      activeMode === 'broker'
        ? '/(broker)/dashboard'
        : activeMode === 'owner'
        ? '/(owner)/dashboard'
        : '/(renter)/home';

    router.replace(destination as any);
  };

  useEffect(() => {
    // -------------------------------------------------------------
    // PHASE 1: Kinetic Text Assembly (0ms - 500ms)
    // Staggered letters float up with 'h' in signature emerald
    // -------------------------------------------------------------
    letterAnims.forEach((anim, idx) => {
      const delay = 80 + idx * 65;
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(anim.y, {
            toValue: 0,
            friction: 6,
            tension: 65,
            useNativeDriver: true,
          }),
          Animated.timing(anim.op, {
            toValue: 1,
            duration: 220,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);
    });

    // -------------------------------------------------------------
    // PHASE 2: Text to Official Logotype Transformation (600ms - 1100ms)
    // The initial staggered letters transition into the official brand logo
    // -------------------------------------------------------------
    const morphTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(initialTextOp, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(initialTextScale, {
          toValue: 0.92,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 45,
          useNativeDriver: true,
        }),
        Animated.timing(logoOp, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoY, {
          toValue: 0,
          friction: 6,
          tension: 45,
          useNativeDriver: true,
        }),
      ]).start();
    }, 600);

    // -------------------------------------------------------------
    // PHASE 3: Graceful Exit Transition (2250ms)
    // -------------------------------------------------------------
    const exitTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(exitOp, {
          toValue: 0,
          duration: 320,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(exitScale, {
          toValue: 1.05,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigateForward();
      });
    }, Platform.OS === 'web' ? 600 : 2250);

    // Guaranteed fallback timer to ensure web/mobile never hangs on splash
    const safetyTimer = setTimeout(() => {
      navigateForward();
    }, Platform.OS === 'web' ? 900 : 3000);

    return () => {
      clearTimeout(morphTimer);
      clearTimeout(exitTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  const isCompact = SCREEN_WIDTH < 375;
  const initialLetterSize = isCompact ? 46 : 56;

  return (
    <Pressable style={styles.root} onPress={navigateForward}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* TOP SKIP BAR */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 14) + 6 }]}>
        <View />
        <Pressable
          style={({ pressed }) => [styles.skipBtn, pressed && styles.btnPressed]}
          onPress={navigateForward}
          hitSlop={12}
        >
          <Text style={styles.skipBtnText}>Skip</Text>
        </Pressable>
      </View>

      {/* CENTERPIECE: TEXT TO LOGOTYPE MORPH CONTAINER */}
      <Animated.View
        style={[
          styles.centerContainer,
          {
            opacity: exitOp,
            transform: [{ scale: exitScale }],
          },
        ]}
      >
        {/* =========================================================
            STAGE 1: INITIAL RAW TEXT ANIMATION (r - e - h - v - o)
           ========================================================= */}
        <Animated.View
          style={[
            styles.initialTextStage,
            {
              opacity: initialTextOp,
              transform: [{ scale: initialTextScale }],
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.initialLettersRow}>
            {LETTERS.map((char, idx) => {
              const { y, op } = letterAnims[idx];
              const isGreenH = char === 'h';
              return (
                <Animated.View
                  key={idx}
                  style={[
                    styles.initialLetterBox,
                    {
                      opacity: op,
                      transform: [{ translateY: y }],
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.initialLetterText,
                      {
                        fontSize: initialLetterSize,
                        color: isGreenH ? '#00875A' : '#02201A',
                      },
                    ]}
                  >
                    {char}
                  </Text>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* =========================================================
            STAGE 2: MORPHED OFFICIAL BRAND LOGOTYPE
           ========================================================= */}
        <Animated.View
          style={[
            styles.logotypeStage,
            {
              opacity: logoOp,
              transform: [{ translateY: logoY }, { scale: logoScale }],
            },
          ]}
        >
          <V4BrandLogo
            variant="stacked"
            size="hero"
            theme="color"
            showTagline={true}
            taglineText="VERIFIED LISTING • DIRECT HOMES"
            showZeroBadge={true}
          />
        </Animated.View>
      </Animated.View>

      {/* BOTTOM SUBTLE FOOTER */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <Text style={styles.bottomNote}>Tap anywhere to enter</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  skipBtn: {
    paddingHorizontal: 14,
    minHeight: 44,
    borderRadius: 100,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.7,
  },
  skipBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
    letterSpacing: 0.4,
  },
  centerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: -20,
  },
  // Stage 1: Initial Raw Text
  initialTextStage: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  initialLettersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Platform.select({ ios: 4, android: 3, default: 4 }),
  },
  initialLetterBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialLetterText: {
    fontWeight: '800',
    letterSpacing: Platform.select({ ios: 2, android: 1, default: 2 }),
    includeFontPadding: false,
  },
  // Stage 2: Official Logotype
  logotypeStage: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  bottomBar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNote: {
    fontSize: 11,
    color: '#94A3B8',
    letterSpacing: 0.4,
    fontWeight: '500',
  },
});

export default V4SplashScreen;

