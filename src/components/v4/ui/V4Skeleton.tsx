import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { V4_COLORS, V4_RADIUS } from '../../../theme/v4Theme';

export type V4SkeletonShape = 'text' | 'circle' | 'rect';

export interface V4SkeletonProps {
  shape?: V4SkeletonShape;
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const V4SkeletonComponent: React.FC<V4SkeletonProps> = ({
  shape = 'rect',
  width,
  height,
  borderRadius,
  style,
  testID,
}) => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.85, {
        duration: 900,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Resolve shape defaults
  let resolvedWidth: DimensionValue = width || '100%';
  let resolvedHeight: DimensionValue = height || 16;
  let resolvedRadius = borderRadius;

  if (shape === 'circle') {
    const dim = width || height || 44;
    resolvedWidth = dim;
    resolvedHeight = dim;
    resolvedRadius = typeof dim === 'number' ? dim / 2 : 22;
  } else if (shape === 'text') {
    resolvedHeight = height || 14;
    resolvedRadius = borderRadius ?? 6;
  } else {
    // rect
    resolvedRadius = borderRadius ?? V4_RADIUS.md;
  }

  return (
    <Animated.View
      testID={testID}
      style={[
        styles.skeleton,
        {
          width: resolvedWidth,
          height: resolvedHeight,
          borderRadius: resolvedRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export const V4SkeletonCard: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
  return (
    <View style={[styles.cardContainer, style]}>
      <V4SkeletonComponent shape="rect" width="100%" height={170} borderRadius={V4_RADIUS.lg} />
      <View style={styles.cardContent}>
        <V4SkeletonComponent shape="text" width="80%" height={18} />
        <V4SkeletonComponent shape="text" width="55%" height={14} />
        <View style={styles.row}>
          <V4SkeletonComponent shape="text" width="35%" height={14} />
          <V4SkeletonComponent shape="text" width="25%" height={14} />
        </View>
      </View>
    </View>
  );
};

export const V4SkeletonFeed: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <View style={styles.feed}>
      {Array.from({ length: count }).map((_, i) => (
        <V4SkeletonCard key={i} />
      ))}
    </View>
  );
};

export const V4SkeletonListItem: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
  return (
    <View style={[styles.listItem, style]}>
      <V4SkeletonComponent shape="circle" width={44} height={44} />
      <View style={styles.listItemContent}>
        <V4SkeletonComponent shape="text" width="60%" height={15} />
        <V4SkeletonComponent shape="text" width="40%" height={12} />
      </View>
    </View>
  );
};

export const V4Skeleton = Object.assign(React.memo(V4SkeletonComponent), {
  Card: React.memo(V4SkeletonCard),
  Feed: React.memo(V4SkeletonFeed),
  ListItem: React.memo(V4SkeletonListItem),
});

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E2E8F0',
  },
  cardContainer: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.card,
    padding: 12,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    marginBottom: 14,
  },
  cardContent: {
    paddingTop: 12,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  feed: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  listItemContent: {
    flex: 1,
    gap: 6,
  },
});
