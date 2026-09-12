import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';

interface V4CompatibilityRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  labelText?: string;
  showSparkle?: boolean;
}

export const V4CompatibilityRing: React.FC<V4CompatibilityRingProps> = ({
  score,
  size = 56,
  strokeWidth = 4,
  showLabel = false,
  labelText = 'MATCH',
  showSparkle = false,
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Color selection based on match tier
  const getColors = (s: number) => {
    if (s >= 90) return { ring: '#059669', bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' };
    if (s >= 75) return { ring: '#0F766E', bg: '#F0FDFA', text: '#0F766E', border: '#99F6E4' };
    if (s >= 60) return { ring: '#D97706', bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' };
    return { ring: '#64748B', bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0' };
  };

  const colors = getColors(clampedScore);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.outerRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: colors.ring,
            backgroundColor: colors.bg,
          },
        ]}
      >
        <View style={styles.contentWrap}>
          <View style={styles.scoreRow}>
            {showSparkle && <Sparkles size={size * 0.2} color={colors.text} />}
            <Text style={[styles.scoreText, { fontSize: Math.max(10, size * 0.3), color: colors.text }]}>
              {clampedScore}%
            </Text>
          </View>
          {showLabel && (
            <Text style={[styles.labelText, { fontSize: Math.max(8, size * 0.16), color: colors.text }]}>
              {labelText}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  scoreText: {
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  labelText: {
    fontWeight: '800',
    letterSpacing: 0.4,
    marginTop: -1,
  },
});
