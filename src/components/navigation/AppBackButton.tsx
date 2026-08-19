import React from 'react';
import { Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export interface AppBackButtonProps {
  onPress?: () => void;
  fallbackRoute?: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  hitSlop?: number;
  accessibilityLabel?: string;
}

/**
 * Universal canonical Back button for REHVO.
 * Preserves navigation stack history via router.back().
 * Only uses fallbackRoute when there is no previous history (e.g. direct deep links).
 */
export const AppBackButton: React.FC<AppBackButtonProps> = ({
  onPress,
  fallbackRoute,
  color = '#171522',
  size = 20,
  strokeWidth = 2.2,
  style,
  hitSlop = 8,
  accessibilityLabel = 'Go back',
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (router.canGoBack()) {
      router.back();
    } else if (fallbackRoute) {
      router.replace(fallbackRoute as any);
    } else {
      router.back();
    }
  };

  return (
    <Pressable
      onPress={handleBack}
      hitSlop={hitSlop}
      style={[styles.btn, style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <ArrowLeft size={size} color={color} strokeWidth={strokeWidth} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
