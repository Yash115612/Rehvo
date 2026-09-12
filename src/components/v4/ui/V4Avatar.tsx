import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { V4_COLORS } from '../../../theme/v4Theme';

export type V4AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface V4AvatarProps {
  source?: string | null;
  name?: string;
  size?: V4AvatarSize;
  isOnline?: boolean;
  isVerified?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const SIZE_MAP: Record<V4AvatarSize, { dimension: number; fontSize: number; badgeSize: number }> = {
  sm: { dimension: 28, fontSize: 11, badgeSize: 8 },
  md: { dimension: 40, fontSize: 15, badgeSize: 10 },
  lg: { dimension: 56, fontSize: 20, badgeSize: 14 },
  xl: { dimension: 80, fontSize: 28, badgeSize: 18 },
};

const EMERALD_TONES = [
  '#0F766E', // Primary Teal
  '#115E59', // Teal Dark
  '#065F46', // Emerald 800
  '#047857', // Emerald 700
  '#0D9488', // Teal 600
  '#059669', // Emerald 600
];

function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'R';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getDeterministicColor(name?: string): string {
  if (!name) return EMERALD_TONES[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % EMERALD_TONES.length;
  return EMERALD_TONES[index];
}

export const V4AvatarComponent: React.FC<V4AvatarProps> = ({
  source,
  name,
  size = 'md',
  isOnline = false,
  isVerified = false,
  style,
  testID,
}) => {
  const [imageError, setImageError] = useState(false);
  const { dimension, fontSize, badgeSize } = SIZE_MAP[size];

  const hasValidImage = Boolean(source && source.trim() !== '' && !imageError);
  const initials = getInitials(name);
  const bgColor = getDeterministicColor(name);

  return (
    <View
      testID={testID}
      accessibilityRole="image"
      accessibilityLabel={name ? `${name}'s avatar` : 'User avatar'}
      style={[
        styles.root,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
        },
        style,
      ]}
    >
      {hasValidImage ? (
        <Image
          source={{ uri: source! }}
          style={[
            styles.image,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
            },
          ]}
          onError={() => setImageError(true)}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
              backgroundColor: bgColor,
            },
          ]}
        >
          <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
        </View>
      )}

      {/* Online indicator */}
      {isOnline && (
        <View
          style={[
            styles.onlineBadge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
            },
          ]}
        />
      )}

      {/* Verified Shield Badge (shown if verified and not small) */}
      {isVerified && !isOnline && size !== 'sm' && (
        <View style={styles.verifiedBadgeWrap}>
          <ShieldCheck
            size={badgeSize + 4}
            color="#FFFFFF"
            fill={V4_COLORS.primary}
          />
        </View>
      )}
    </View>
  );
};

export const V4Avatar = React.memo(V4AvatarComponent);

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: V4_COLORS.success,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  verifiedBadgeWrap: {
    position: 'absolute',
    bottom: -2,
    right: -2,
  },
});
