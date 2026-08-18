import React, { useEffect, useRef } from 'react';
import { StyleSheet, PanResponder, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { PropertyCategory, PROPERTY_CATEGORIES } from './PropertyCategorySwitcher';

const CATEGORY_KEYS = PROPERTY_CATEGORIES.map((c) => c.id);

const CATEGORY_INDEX: Record<PropertyCategory, number> = {
  rent: 0,
  pg: 1,
  rooms: 2,
  flatmates: 3,
  studios: 4,
};

interface AnimatedCategoryContentProps {
  category: PropertyCategory;
  onSwipeCategory?: (newCategory: PropertyCategory) => void;
  children: React.ReactNode;
}

export const AnimatedCategoryContent: React.FC<AnimatedCategoryContentProps> = ({
  category,
  onSwipeCategory,
  children,
}) => {
  const prevCategoryRef = useRef<PropertyCategory>(category);
  const currentCategoryRef = useRef<PropertyCategory>(category);
  currentCategoryRef.current = category;

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Pan responder for horizontal swipe detection without blocking vertical scrolling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only activate if horizontal swipe is prominent (|dx| > 24 and |dx| > 2 * |dy|)
        return (
          Math.abs(gestureState.dx) > 24 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        if (!onSwipeCategory) return;

        const currentIdx = CATEGORY_INDEX[currentCategoryRef.current] ?? 0;

        // Swiped Left -> Move to Next Category
        if (gestureState.dx < -45 && currentIdx < CATEGORY_KEYS.length - 1) {
          const nextCategory = CATEGORY_KEYS[currentIdx + 1];
          onSwipeCategory(nextCategory);
        }
        // Swiped Right -> Move to Previous Category
        else if (gestureState.dx > 45 && currentIdx > 0) {
          const prevCategory = CATEGORY_KEYS[currentIdx - 1];
          onSwipeCategory(prevCategory);
        }
      },
    })
  ).current;

  useEffect(() => {
    if (prevCategoryRef.current === category) return;

    const oldIndex = CATEGORY_INDEX[prevCategoryRef.current] ?? 0;
    const newIndex = CATEGORY_INDEX[category] ?? 0;
    const isMovingForward = newIndex > oldIndex;

    // Set initial offset based on direction
    const entryOffset = isMovingForward ? 36 : -36;

    // Reset and animate smoothly in
    translateX.value = entryOffset;
    opacity.value = 0.25;

    translateX.value = withTiming(0, {
      duration: 260,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    });

    opacity.value = withTiming(1, {
      duration: 240,
      easing: Easing.out(Easing.quad),
    });

    prevCategoryRef.current = category;
  }, [category, translateX, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
