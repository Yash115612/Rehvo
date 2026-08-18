import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';

interface HomeHeroProps {
  onSearchClick: () => void;
  userType?: string;
  userName?: string;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onSearchClick }) => {
  return (
    <View style={styles.container}>
      <View style={styles.heroBox}>
        {/* Background Realistic Photography */}
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
          }}
          style={styles.heroImage}
        />

        {/* Gradient Overlay */}
        <View style={styles.overlay} />

        {/* Top Trust Badge */}
        <View style={styles.topBadgeRow}>
          <View style={styles.badgePill}>
            <View style={styles.greenDot} />
            <Text style={styles.badgeText}>VERIFIED RENTALS</Text>
          </View>
        </View>

        {/* Hero Content */}
        <View style={styles.contentBox}>
          <Text style={styles.brandSubtitle}>REHVO RENTALS</Text>

          <Text style={styles.heroTitle}>
            Find a place {'\n'}
            that feels like home.
          </Text>

          <Text style={styles.heroSubtext}>
            Flats, PGs, rooms and shared spaces — all in one place.
          </Text>

          {/* Integrated CTA Pill */}
          <View style={styles.ctaWrapper}>
            <Pressable onPress={onSearchClick} style={styles.ctaBtn}>
              <Text style={styles.ctaText}>Explore rentals</Text>
              <Text style={styles.arrowIcon}>→</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  heroBox: {
    width: '100%',
    height: 280,
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#17151F',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(23, 21, 31, 0.45)',
  },
  topBadgeRow: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  badgePill: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#32B768',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  contentBox: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    gap: 4,
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#EEE9FF',
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  heroSubtext: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  ctaWrapper: {
    paddingTop: 8,
    flexDirection: 'row',
  },
  ctaBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#17151F',
  },
  arrowIcon: {
    fontSize: 14,
    fontWeight: '900',
    color: '#6C4DFF',
  },
});

