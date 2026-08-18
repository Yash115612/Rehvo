import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  LayoutChangeEvent,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  WithTimingConfig,
  WithSpringConfig,
} from 'react-native-reanimated';
import { LucideIcon } from 'lucide-react-native';

export interface NavSlotItem<T extends string = string> {
  id: T;
  icon: LucideIcon;
  label: string;
  isPrimaryAction?: boolean;
}

export interface FloatingCapsuleNavProps<T extends string = string> {
  activeTab: T;
  slots: NavSlotItem<T>[];
  onTabPress: (tab: T) => void;
  onPrimaryAction?: () => void;
}

// ---- Approved REHVO Color Palette ----
const NAV_BG = '#FFFFFF';
const ACTIVE_BG = '#6C4DFF';
const ACTIVE_ICON_COLOR = '#FFFFFF';
const INACTIVE_ICON_COLOR = '#86828F';
const PRIMARY_ACTION_BG = '#6C4DFF';
const PRIMARY_ACTION_ICON_COLOR = '#FFFFFF';
const BORDER_COLOR = Platform.select({
  ios: 'rgba(232, 229, 236, 0.85)',
  android: '#EDEBF2',
  default: '#E8E5EC',
});
const SHADOW_COLOR = '#171522';

// ---- Sculpted Dimensions ----
const HORIZONTAL_MARGIN = 16;
const BOTTOM_MARGIN = 8;
const CAPSULE_HEIGHT = 66;
const CAPSULE_RADIUS = 34;
const ACTIVE_BUBBLE_SIZE = 46;
const PRIMARY_BTN_SIZE = 52;
const ICON_SIZE = 21;
const ICON_STROKE_INACTIVE = 1.9;
const ICON_STROKE_ACTIVE = 2.2;

const SPRING_CONFIG: WithSpringConfig = {
  damping: 24,
  stiffness: 280,
  mass: 0.6,
};
const PRESS_TIMING: WithTimingConfig = { duration: 110 };
const HIT_SLOP = { top: 10, bottom: 10, left: 6, right: 6 };

export function FloatingCapsuleNav<T extends string = string>({
  activeTab,
  slots,
  onTabPress,
  onPrimaryAction,
}: FloatingCapsuleNavProps<T>) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const [rowWidth, setRowWidth] = useState(0);

  // Defensive fallback to prevent any runtime crashes
  const safeSlots = Array.isArray(slots) ? slots : [];
  const numSlots = safeSlots.length;

  const bubbleX = useSharedValue(0);
  const bubbleScale = useSharedValue(1);
  const bubbleInitialized = useRef(false);

  const slotCenterX = useCallback(
    (slotIndex: number) => {
      if (!rowWidth || numSlots === 0) return 0;
      const slotW = rowWidth / numSlots;
      return slotIndex * slotW + slotW / 2;
    },
    [rowWidth, numSlots],
  );

  const activeSlotIndex = safeSlots.findIndex(
    (s) => s.id === activeTab && !s.isPrimaryAction,
  );

  const bubbleLeftForIndex = useCallback(
    (idx: number) => {
      if (idx < 0) return 0;
      return slotCenterX(idx) - ACTIVE_BUBBLE_SIZE / 2;
    },
    [slotCenterX],
  );

  const syncBubble = useCallback(
    (tab: T, animate: boolean) => {
      const idx = safeSlots.findIndex((s) => s.id === tab && !s.isPrimaryAction);
      if (idx < 0) return;
      const target = bubbleLeftForIndex(idx);
      if (animate) {
        bubbleScale.value = withTiming(0.92, { duration: 90 }, () => {
          bubbleScale.value = withSpring(1, { damping: 16, stiffness: 300 });
        });
        bubbleX.value = withSpring(target, SPRING_CONFIG);
      } else {
        bubbleX.value = target;
      }
    },
    [bubbleX, bubbleScale, bubbleLeftForIndex, safeSlots],
  );

  useEffect(() => {
    if (!rowWidth || numSlots === 0) return;
    if (!bubbleInitialized.current) {
      syncBubble(activeTab, false);
      bubbleInitialized.current = true;
    } else {
      syncBubble(activeTab, true);
    }
  }, [activeTab, rowWidth, numSlots, syncBubble]);

  const handleRowLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && Math.abs(w - rowWidth) > 0.5) {
      setRowWidth(w);
    }
  };

  const handleSlotPress = (slot: NavSlotItem<T>) => {
    if (slot.isPrimaryAction) {
      if (onPrimaryAction) onPrimaryAction();
    } else {
      if (activeTab !== slot.id) {
        syncBubble(slot.id, true);
        onTabPress(slot.id);
      }
    }
  };

  const bubbleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: bubbleX.value },
        { scale: bubbleScale.value },
      ],
    } as ViewStyle;
  });

  if (numSlots === 0) {
    return null;
  }

  const activeSlot = safeSlots.find((s) => s.id === activeTab);
  const ActiveIcon = activeSlot?.icon;

  const capsulePaddingH = 8;
  const capsulePaddingV = (CAPSULE_HEIGHT - ACTIVE_BUBBLE_SIZE) / 2;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        {
          paddingBottom: Math.max(insets.bottom, 8) + BOTTOM_MARGIN,
        },
      ]}
    >
      <View
        pointerEvents="box-none"
        style={[styles.container, { paddingHorizontal: HORIZONTAL_MARGIN }]}
      >
        <View
          style={[
            styles.capsule,
            {
              paddingHorizontal: capsulePaddingH,
              paddingVertical: capsulePaddingV,
              borderRadius: CAPSULE_RADIUS,
            },
          ]}
        >
          {/* Animated Active Purple Bubble */}
          {rowWidth > 0 && activeSlotIndex >= 0 && (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                paddingHorizontal: capsulePaddingH,
                paddingVertical: capsulePaddingV,
              }}
            >
              <View style={{ flex: 1, position: 'relative' }}>
                <Animated.View
                  style={[styles.activeBubble, bubbleAnimatedStyle]}
                >
                  {ActiveIcon && (
                    <ActiveIcon
                      size={ICON_SIZE}
                      color={ACTIVE_ICON_COLOR}
                      strokeWidth={ICON_STROKE_ACTIVE}
                    />
                  )}
                </Animated.View>
              </View>
            </View>
          )}

          {/* Navigation Slots Row */}
          <View style={styles.row} onLayout={handleRowLayout}>
            {safeSlots.map((slot) => {
              const isActive = activeTab === slot.id && !slot.isPrimaryAction;
              return (
                <NavSlotButton<T>
                  key={slot.id}
                  slot={slot}
                  isActive={isActive}
                  onPress={() => handleSlotPress(slot)}
                />
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

// Individual Slot Button with isolated scale hook
interface NavSlotButtonProps<T extends string> {
  slot: NavSlotItem<T>;
  isActive: boolean;
  onPress: () => void;
}

function NavSlotButton<T extends string>({
  slot,
  isActive,
  onPress,
}: NavSlotButtonProps<T>) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    } as ViewStyle;
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.92, PRESS_TIMING);
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, PRESS_TIMING);
  };

  const Icon = slot.icon;

  if (slot.isPrimaryAction) {
    return (
      <View style={styles.primarySlotWrap}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          accessibilityLabel={slot.label}
          hitSlop={HIT_SLOP}
          style={styles.primarySlotPressable}
        >
          <Animated.View style={animatedStyle}>
            <View style={styles.primaryActionBtn}>
              <Icon
                size={23}
                color={PRIMARY_ACTION_ICON_COLOR}
                strokeWidth={2.4}
              />
            </View>
          </Animated.View>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.slot}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={slot.label}
        hitSlop={HIT_SLOP}
        style={styles.slotPressable}
      >
        <Animated.View style={animatedStyle}>
          <Icon
            size={ICON_SIZE}
            color={isActive ? 'transparent' : INACTIVE_ICON_COLOR}
            strokeWidth={ICON_STROKE_INACTIVE}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 99,
  },
  container: {
    width: '100%',
    maxWidth: 500,
  },
  capsule: {
    height: CAPSULE_HEIGHT,
    backgroundColor: NAV_BG,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: SHADOW_COLOR,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.09,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotPressable: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primarySlotWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primarySlotPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8, // Contoured elevation above capsule
  },
  activeBubble: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: ACTIVE_BUBBLE_SIZE,
    height: ACTIVE_BUBBLE_SIZE,
    borderRadius: ACTIVE_BUBBLE_SIZE / 2,
    backgroundColor: ACTIVE_BG,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: ACTIVE_BG,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  primaryActionBtn: {
    width: PRIMARY_BTN_SIZE,
    height: PRIMARY_BTN_SIZE,
    borderRadius: PRIMARY_BTN_SIZE / 2,
    backgroundColor: PRIMARY_ACTION_BG,
    borderWidth: 3,
    borderColor: '#FFFFFF', // Seamless organic bevel into white capsule
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: PRIMARY_ACTION_BG,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
