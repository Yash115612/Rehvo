import React from 'react';
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { V4_COLORS } from '../../../theme/v4Theme';
import { triggerHaptic } from '../../../utils/haptics';

export interface V4SectionHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  badgeText?: string;
  badgeColor?: string;
  badgeBg?: string;
  actionText?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const V4SectionHeaderComponent: React.FC<V4SectionHeaderProps> = ({
  title,
  subtitle,
  count,
  badgeText,
  badgeColor = V4_COLORS.primary,
  badgeBg = 'rgba(15, 118, 110, 0.1)',
  actionText = 'See All',
  onActionPress,
  style,
  testID,
}) => {
  const handleAction = () => {
    triggerHaptic('light');
    onActionPress?.();
  };

  return (
    <View testID={testID} style={[styles.container, style]}>
      <View style={styles.titleCol}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {count !== undefined && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{count}</Text>
            </View>
          )}
          {badgeText && (
            <View style={[styles.badge, { backgroundColor: badgeBg }]}>
              <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeText}</Text>
            </View>
          )}
        </View>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {onActionPress && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${actionText} for ${title}`}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.actionBtn}
          onPress={handleAction}
        >
          <Text style={styles.actionText}>{actionText}</Text>
          {!actionText.includes('→') && (
            <ChevronRight size={13} color={V4_COLORS.primary} strokeWidth={2.6} />
          )}
        </Pressable>
      )}
    </View>
  );
};

export const V4SectionHeader = React.memo(V4SectionHeaderComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  titleCol: {
    flex: 1,
    paddingRight: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 19,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.4,
  },
  countBadge: {
    backgroundColor: V4_COLORS.surfaceSubtle,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  countText: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.textSecondary,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(15, 118, 110, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    minHeight: 32,
  },
  actionText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
});

