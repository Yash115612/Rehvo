import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  ViewStyle,
  ImageStyle,
} from 'react-native';

const REHVO_LOGO_DARK = require('../../../../assets/brand/rehvo-logo.png');
const REHVO_LOGO_WHITE = require('../../../../assets/brand/rehvo-logo-white.png');
const REHVO_APP_ICON = require('../../../../assets/icon.png');

export interface V4BrandLogoProps {
  variant?: 'icon-only' | 'horizontal' | 'stacked' | 'badge' | 'monogram';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  theme?: 'dark' | 'light' | 'color' | 'white';
  showTagline?: boolean;
  taglineText?: string;
  showZeroBadge?: boolean;
  animated?: boolean;
  style?: ViewStyle;
}

// Wordmark aspect ratio is ~2.99 : 1
const ASPECT_RATIO = 2.99;

export const V4BrandLogo: React.FC<V4BrandLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  theme = 'color',
  showTagline = false,
  taglineText = 'VERIFIED LISTING • DIRECT HOMES',
  showZeroBadge = false,
  animated = false,
  style,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.04,
            duration: 1600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 1600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated, pulseAnim]);

  // Size dimensions
  const getDimensions = () => {
    switch (size) {
      case 'xs':
        return { height: 16, width: Math.round(16 * ASPECT_RATIO), tagSize: 8, iconDim: 24, badgeScale: 0.7 };
      case 'sm':
        return { height: 22, width: Math.round(22 * ASPECT_RATIO), tagSize: 9, iconDim: 32, badgeScale: 0.8 };
      case 'lg':
        return { height: 42, width: Math.round(42 * ASPECT_RATIO), tagSize: 11, iconDim: 56, badgeScale: 1.0 };
      case 'xl':
        return { height: 56, width: Math.round(56 * ASPECT_RATIO), tagSize: 13, iconDim: 72, badgeScale: 1.1 };
      case 'hero':
        return { height: 72, width: Math.round(72 * ASPECT_RATIO), tagSize: 14, iconDim: 96, badgeScale: 1.3 };
      case 'md':
      default:
        return { height: 30, width: Math.round(30 * ASPECT_RATIO), tagSize: 10, iconDim: 44, badgeScale: 0.9 };
    }
  };

  const { height, width, tagSize, iconDim } = getDimensions();
  const isDarkSurface = theme === 'dark' || theme === 'white';
  const logoSource = isDarkSurface ? REHVO_LOGO_WHITE : REHVO_LOGO_DARK;

  // 1. Icon-only / Monogram: Centered Luxury App Icon Emblem
  if (variant === 'icon-only' || variant === 'monogram') {
    return (
      <Animated.View
        style={[
          styles.emblemBox,
          {
            width: iconDim,
            height: iconDim,
            borderRadius: Math.round(iconDim * 0.26),
            transform: animated ? [{ scale: pulseAnim }] : undefined,
          },
          style,
        ]}
      >
        <Image
          source={REHVO_APP_ICON}
          style={{
            width: iconDim,
            height: iconDim,
            borderRadius: Math.round(iconDim * 0.26),
          }}
          resizeMode="cover"
        />
      </Animated.View>
    );
  }

  // 2. Stacked Variant (Splash & Hero Centerpiece)
  if (variant === 'stacked') {
    return (
      <View style={[styles.stackedContainer, style]}>
        <Animated.View style={{ transform: animated ? [{ scale: pulseAnim }] : undefined }}>
          <Image
            source={logoSource}
            style={{ width, height }}
            resizeMode="contain"
          />
        </Animated.View>

        {showTagline && (
          <Text
            style={[
              styles.tagline,
              {
                fontSize: tagSize,
                color: isDarkSurface ? '#5EEAD4' : '#0F766E',
                letterSpacing: tagSize * 0.12,
              },
            ]}
          >
            {taglineText}
          </Text>
        )}

        {showZeroBadge && (
          <View style={[styles.zeroBadgePill, isDarkSurface && styles.zeroBadgePillDark]}>
            <View style={styles.zeroBadgeDot} />
            <Text style={[styles.zeroBadgeText, isDarkSurface && styles.zeroBadgeTextDark]}>
              VERIFIED LISTING
            </Text>
          </View>
        )}
      </View>
    );
  }

  // 3. Badge Variant
  if (variant === 'badge') {
    return (
      <View style={[styles.badgeContainer, style]}>
        <Image
          source={logoSource}
          style={{ width: Math.round(height * ASPECT_RATIO), height }}
          resizeMode="contain"
        />
        <View style={styles.badgeDivider} />
        <Text style={[styles.badgeLabel, { color: isDarkSurface ? '#99F6E4' : '#0F766E' }]}>
          OFFICIAL
        </Text>
      </View>
    );
  }

  // 4. Horizontal Variant (Header / Standard)
  return (
    <View style={[styles.horizontalContainer, style]}>
      <Animated.View style={{ transform: animated ? [{ scale: pulseAnim }] : undefined }}>
        <Image
          source={logoSource}
          style={{ width, height }}
          resizeMode="contain"
        />
      </Animated.View>

      {showTagline && (
        <View style={styles.horizontalTaglineCol}>
          <Text
            style={[
              styles.tagline,
              {
                fontSize: tagSize,
                color: isDarkSurface ? '#5EEAD4' : '#0F766E',
                letterSpacing: tagSize * 0.08,
              },
            ]}
          >
            {taglineText}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalTaglineCol: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  emblemBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  tagline: {
    fontWeight: '700',
    marginTop: 6,
    textTransform: 'uppercase',
  },
  zeroBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 118, 110, 0.10)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.25)',
  },
  zeroBadgePillDark: {
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    borderColor: 'rgba(45, 212, 191, 0.3)',
  },
  zeroBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0F766E',
  },
  zeroBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.8,
  },
  zeroBadgeTextDark: {
    color: '#5EEAD4',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  badgeDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});
