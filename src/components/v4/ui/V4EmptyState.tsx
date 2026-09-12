import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SPACING } from '../../../theme/v4Theme';
import { V4Button, V4ButtonVariant } from './V4Button';

export interface V4EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  actionVariant?: V4ButtonVariant;
  secondaryActionLabel?: string;
  onSecondaryActionPress?: () => void;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const V4EmptyStateComponent: React.FC<V4EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onActionPress,
  actionVariant = 'primary',
  secondaryActionLabel,
  onSecondaryActionPress,
  compact = false,
  style,
  testID,
}) => {
  return (
    <View
      testID={testID}
      accessibilityRole="text"
      style={[
        styles.root,
        compact ? styles.rootCompact : styles.rootFull,
        style,
      ]}
    >
      <View style={[styles.iconBox, compact && styles.iconBoxCompact]}>
        {icon || <Sparkles size={compact ? 22 : 32} color={V4_COLORS.primary} strokeWidth={2.2} />}
      </View>

      <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>

      {description && (
        <Text style={[styles.description, compact && styles.descriptionCompact]}>
          {description}
        </Text>
      )}

      {(actionLabel || secondaryActionLabel) && (
        <View style={[styles.buttonRow, compact && styles.buttonRowCompact]}>
          {actionLabel && onActionPress && (
            <V4Button
              title={actionLabel}
              variant={actionVariant}
              size={compact ? 'sm' : 'md'}
              onPress={onActionPress}
            />
          )}

          {secondaryActionLabel && onSecondaryActionPress && (
            <V4Button
              title={secondaryActionLabel}
              variant="outline"
              size={compact ? 'sm' : 'md'}
              onPress={onSecondaryActionPress}
            />
          )}
        </View>
      )}
    </View>
  );
};

export const V4EmptyState = React.memo(V4EmptyStateComponent);

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  rootFull: {
    paddingVertical: V4_SPACING['4xl'],
    paddingHorizontal: V4_SPACING.xl,
  },
  rootCompact: {
    paddingVertical: V4_SPACING.lg,
    paddingHorizontal: V4_SPACING.md,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: V4_COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: V4_SPACING.md,
  },
  iconBoxCompact: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: V4_SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  titleCompact: {
    fontSize: 15,
  },
  description: {
    fontSize: 13.5,
    fontWeight: '500',
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
    maxWidth: 320,
  },
  descriptionCompact: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
    maxWidth: 240,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: V4_SPACING.lg,
  },
  buttonRowCompact: {
    marginTop: V4_SPACING.md,
    gap: 8,
  },
});
