import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, ArrowRight } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

interface V4FloatingAIBadgeProps {
  label?: string;
  subLabel?: string;
  initialPrompt?: string;
  context?: string;
  propertyId?: string;
  isFloating?: boolean;
}

export const V4FloatingAIBadge: React.FC<V4FloatingAIBadgeProps> = React.memo(
  ({
    label = 'Ask REHVO AI',
    subLabel = 'Instant negotiation, legal & commute help',
    initialPrompt = 'How can REHVO AI help me rent smarter in Mumbai?',
    context = 'general',
    propertyId,
    isFloating = false,
  }) => {
    const router = useRouter();

    const handlePress = () => {
      router.push({
        pathname: '/(renter)/ai',
        params: {
          prompt: initialPrompt,
          context,
          ...(propertyId ? { propertyId } : {}),
        },
      } as any);
    };

    if (isFloating) {
      return (
        <Pressable style={styles.floatingButton} onPress={handlePress}>
          <View style={styles.floatingIconGlow}>
            <Sparkles size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.floatingText}>{label}</Text>
        </Pressable>
      );
    }

    return (
      <Pressable style={styles.inlineBanner} onPress={handlePress}>
        <View style={styles.leftCol}>
          <View style={styles.sparkleWrap}>
            <Sparkles size={16} color={V4_COLORS.primary} />
          </View>
          <View style={styles.textCol}>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>GPT-4o POWERED</Text>
            </View>
            <Text style={styles.bannerTitle}>{label}</Text>
            {subLabel && <Text style={styles.bannerSub}>{subLabel}</Text>}
          </View>
        </View>

        <View style={styles.arrowCircle}>
          <ArrowRight size={14} color="#FFFFFF" />
        </View>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    minHeight: 44,
    ...V4_SHADOWS.floating,
    zIndex: 999,
  },
  floatingIconGlow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  inlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDFA',
    borderRadius: V4_RADIUS.lg,
    padding: 14,
    marginVertical: 10,
    borderWidth: 1.2,
    borderColor: '#CCFBF1',
    minHeight: 52,
    ...V4_SHADOWS.card,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sparkleWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
  },
  badgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#0F766E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  bannerSub: {
    fontSize: 11.5,
    color: '#0F766E',
    lineHeight: 16,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: V4_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
