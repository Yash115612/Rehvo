import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { ArrowLeft } from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS, V4_SPACING } from '../../../theme/v4Theme';
import { triggerHaptic } from '../../../utils/haptics';

export interface V4HeaderRightAction {
  icon: React.ReactNode;
  onPress: () => void;
  badgeCount?: number;
  accessibilityLabel: string;
  testID?: string;
}

export interface V4HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  leftComponent?: React.ReactNode;
  rightActions?: V4HeaderRightAction[];
  rightComponent?: React.ReactNode;
  isTransparent?: boolean;
  isBlur?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const V4HeaderComponent: React.FC<V4HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  leftComponent,
  rightActions = [],
  rightComponent,
  isTransparent = false,
  isBlur = false,
  style,
  testID,
}) => {
  const router = useRouter();

  const handleBack = () => {
    triggerHaptic('light');
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  const renderContent = () => (
    <View style={styles.innerRow}>
      {/* Left Slot */}
      <View style={styles.leftSlot}>
        {leftComponent ? (
          leftComponent
        ) : showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.iconBtn}
            onPress={handleBack}
          >
            <ArrowLeft size={20} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
          </Pressable>
        ) : null}
      </View>

      {/* Center Slot (Title + Subtitle) */}
      <View style={styles.centerSlot}>
        {title && (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right Slot */}
      <View style={styles.rightSlot}>
        {rightComponent ? (
          rightComponent
        ) : (
          rightActions.slice(0, 2).map((action, index) => (
            <Pressable
              key={index}
              testID={action.testID}
              accessibilityRole="button"
              accessibilityLabel={action.accessibilityLabel}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.iconBtn}
              onPress={() => {
                triggerHaptic('light');
                action.onPress();
              }}
            >
              {action.icon}
              {action.badgeCount !== undefined && action.badgeCount > 0 && (
                <View style={styles.badgeWrap}>
                  <Text style={styles.badgeText}>
                    {action.badgeCount > 99 ? '99+' : action.badgeCount}
                  </Text>
                </View>
              )}
            </Pressable>
          ))
        )}
      </View>
    </View>
  );

  if (isBlur) {
    return (
      <BlurView
        testID={testID}
        intensity={Platform.OS === 'ios' ? 70 : 85}
        tint="light"
        style={[styles.container, styles.blurBorder, style]}
      >
        {renderContent()}
      </BlurView>
    );
  }

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        !isTransparent && styles.solidContainer,
        style,
      ]}
    >
      {renderContent()}
    </View>
  );
};

export const V4Header = React.memo(V4HeaderComponent);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  solidContainer: {
    backgroundColor: V4_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: V4_COLORS.borderLight,
    ...V4_SHADOWS.soft,
  },
  blurBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 236, 239, 0.6)',
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  leftSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 44,
    justifyContent: 'flex-start',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  rightSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 44,
    justifyContent: 'flex-end',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11.5,
    fontWeight: '500',
    color: V4_COLORS.textSecondary,
    marginTop: 1,
    textAlign: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: V4_COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeWrap: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: V4_COLORS.danger,
    minWidth: 17,
    height: 17,
    borderRadius: 8.5,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
