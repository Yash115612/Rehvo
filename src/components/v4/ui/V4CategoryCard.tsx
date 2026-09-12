import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { V4_SHADOWS } from '../../../theme/v4Theme';

export interface V4CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  tag?: string;
  tagColor?: string;
  tagBg?: string;
  imageUrl?: string;
  icon?: any;
  iconColor?: string;
  iconBg?: string;
  cardBg?: string;
  color?: string;
  bg?: string;
}

interface V4CategoryCardProps {
  item: V4CategoryItem;
  variant?: 'tall' | 'compact' | 'square';
  onPress?: () => void;
}

export const V4CategoryCard: React.FC<V4CategoryCardProps> = ({
  item,
  variant = 'compact',
  onPress,
}) => {
  const IconComp = item.icon;
  const accent = item.iconColor || '#0F766E';
  const iconBg = item.iconBg || accent + '12';

  // ─── TALL CARD ─────────────────────────────────────────────────────────────
  if (variant === 'tall') {
    return (
      <Pressable style={styles.tallCard} onPress={onPress}>
        {item.tag && (
          <View style={[styles.tagPill, { backgroundColor: accent + '12' }]}>
            <Text style={[styles.tagText, { color: accent }]}>{item.tag}</Text>
          </View>
        )}

        {/* Title */}
        <Text style={styles.tallTitle}>{item.title}</Text>
        <Text style={styles.tallSubtitle}>{item.subtitle}</Text>

        {/* Icon — centered, large, in a tinted rounded square, just like host earn */}
        <View style={styles.tallIconArea}>
          <View style={[styles.tallIconBox, { backgroundColor: iconBg }]}>
            {IconComp && <IconComp size={54} color={accent} strokeWidth={1.6} />}
          </View>
        </View>

        {/* Explore CTA */}
        <View style={[styles.tallCTA, { backgroundColor: accent }]}>
          <Text style={styles.tallCTAText}>Explore Now</Text>
          <ArrowRight size={13} color="#fff" strokeWidth={2.5} />
        </View>
      </Pressable>
    );
  }

  // ─── COMPACT CARD ──────────────────────────────────────────────────────────
  // Same white bg + border — title top-left, icon bottom-right
  return (
    <Pressable style={styles.compactCard} onPress={onPress}>
      {/* Left text */}
      <View style={styles.compactLeft}>
        {item.tag && (
          <View style={[styles.tagPill, { backgroundColor: accent + '12' }]}>
            <Text style={[styles.tagText, { color: accent }]}>{item.tag}</Text>
          </View>
        )}
        <Text style={styles.compactTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.compactSubtitle} numberOfLines={1}>{item.subtitle}</Text>
      </View>

      {/* Icon box — right side */}
      {IconComp && (
        <View style={[styles.compactIconBox, { backgroundColor: iconBg }]}>
          <IconComp size={32} color={accent} strokeWidth={1.7} />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // ── shared ──────────────────────────────────────────────────────────────
  tagPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  // ── TALL ────────────────────────────────────────────────────────────────
  tallCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    padding: 14,
    justifyContent: 'flex-start',
    ...V4_SHADOWS.soft,
  },
  tallTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  tallSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 3,
    lineHeight: 14,
  },
  tallIconArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  tallIconBox: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tallCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 12,
  },
  tallCTAText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },

  // ── COMPACT ─────────────────────────────────────────────────────────────
  compactCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...V4_SHADOWS.soft,
  },
  compactLeft: {
    flex: 1,
    paddingRight: 8,
  },
  compactTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 18,
  },
  compactSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 14,
  },
  compactIconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
