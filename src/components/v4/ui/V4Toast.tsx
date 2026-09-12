import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { triggerHaptic } from '../../../utils/haptics';

export type V4ToastType = 'success' | 'error' | 'warning' | 'info';

export interface V4ToastProps {
  visible: boolean;
  message: string;
  type?: V4ToastType;
  duration?: number;
  onDismiss: () => void;
  actionLabel?: string;
  onActionPress?: () => void;
  testID?: string;
}

export const V4ToastComponent: React.FC<V4ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
  actionLabel,
  onActionPress,
  testID,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-80);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      triggerHaptic(type === 'error' ? 'medium' : 'light');
      translateY.value = withSpring(0, { damping: 15 });
      opacity.value = withTiming(1, { duration: 200 });

      if (duration > 0) {
        const timer = setTimeout(() => {
          hideToast();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      translateY.value = withTiming(-80, { duration: 220 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, duration]);

  const hideToast = () => {
    translateY.value = withTiming(-80, { duration: 220 });
    opacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onDismiss)();
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible && opacity.value === 0) {
    return null;
  }

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color={V4_COLORS.success} strokeWidth={2.4} />;
      case 'error':
        return <AlertCircle size={18} color={V4_COLORS.danger} strokeWidth={2.4} />;
      case 'warning':
        return <AlertTriangle size={18} color={V4_COLORS.warning} strokeWidth={2.4} />;
      case 'info':
      default:
        return <Info size={18} color={V4_COLORS.primary} strokeWidth={2.4} />;
    }
  };

  return (
    <Animated.View
      testID={testID}
      accessibilityRole="alert"
      accessibilityLabel={message}
      style={[
        styles.container,
        { top: Math.max(insets.top, 16) + 8 },
        animatedStyle,
      ]}
      pointerEvents="box-none"
    >
      <View style={[styles.toastCard, styles[`card_${type}`]]}>
        <View style={styles.iconWrap}>{renderIcon()}</View>

        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>

        {actionLabel && onActionPress && (
          <Pressable
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={onActionPress}
            style={styles.actionBtn}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
          >
            <Text style={styles.actionText}>{actionLabel}</Text>
          </Pressable>
        )}

        <Pressable
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={hideToast}
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
        >
          <X size={15} color={V4_COLORS.textMuted} strokeWidth={2.2} />
        </Pressable>
      </View>
    </Animated.View>
  );
};

export const V4Toast = React.memo(V4ToastComponent);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastCard: {
    width: '100%',
    maxWidth: 480,
    minHeight: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.2,
    borderColor: V4_COLORS.border,
    ...V4_SHADOWS.floating,
  },
  card_success: {
    borderLeftWidth: 4,
    borderLeftColor: V4_COLORS.success,
  },
  card_error: {
    borderLeftWidth: 4,
    borderLeftColor: V4_COLORS.danger,
  },
  card_warning: {
    borderLeftWidth: 4,
    borderLeftColor: V4_COLORS.warning,
  },
  card_info: {
    borderLeftWidth: 4,
    borderLeftColor: V4_COLORS.primary,
  },
  iconWrap: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
    lineHeight: 18,
  },
  actionBtn: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  closeBtn: {
    marginLeft: 6,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
