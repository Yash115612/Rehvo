import React from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

export type REHVOLogoSize = 'compact' | 'small' | 'medium' | 'large' | 'splash';

export interface REHVOLogoProps {
  /** Size preset for consistent visual hierarchy */
  size?: REHVOLogoSize;
  /** Explicit width override (aspect ratio preserved via contain) */
  width?: number;
  /** Explicit height override (aspect ratio preserved via contain) */
  height?: number;
  /** Custom image style */
  style?: StyleProp<ImageStyle>;
  /** Optional container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Accessibility flag (default: true) */
  accessible?: boolean;
  /** Accessibility label (default: "REHVO") */
  accessibilityLabel?: string;
}

export const REHVO_LOGO_ASSET = require('../../../assets/brand/rehvo-logo.png');

const SIZE_PRESETS: Record<REHVOLogoSize, { width: number; height: number }> = {
  compact: { width: 88, height: 30 },
  small: { width: 108, height: 36 },
  medium: { width: 144, height: 48 },
  large: { width: 184, height: 62 },
  splash: { width: 220, height: 75 },
};

/**
 * REHVOLogo — Single Canonical Brand Component
 * 
 * Renders the locked, approved "rehvô" brand asset across all screens.
 * Preserves exact typography, proportions, colors, and composition.
 */
export const REHVOLogo: React.FC<REHVOLogoProps> = ({
  size = 'medium',
  width,
  height,
  style,
  containerStyle,
  accessible = true,
  accessibilityLabel = 'REHVO',
}) => {
  const preset = SIZE_PRESETS[size] || SIZE_PRESETS.medium;
  const targetWidth = width ?? preset.width;
  const targetHeight = height ?? preset.height;

  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={REHVO_LOGO_ASSET}
        style={[
          {
            width: targetWidth,
            height: targetHeight,
          },
          styles.image,
          style,
        ]}
        resizeMode="contain"
        accessible={accessible}
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    backgroundColor: 'transparent',
  },
});
