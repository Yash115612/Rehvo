import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { Sparkles, ChevronRight, BadgePercent } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface V4BannerSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  offerText: string;
  ctaText: string;
  imageUrl: string;
}

const DEFAULT_BANNERS: V4BannerSlide[] = [
  {
    id: 'b1',
    badge: 'ANNUAL LEASE • VERIFIED LISTING',
    title: 'MORE MONTHS = MORE SAVINGS',
    subtitle: '11-Month Direct Owner Lease with Instant Agreement',
    offerText: 'Save ₹25,000 + Zero Security Deposit Option',
    ctaText: 'Explore Plans',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'b2',
    badge: 'VIP LAUNCH • SEA FACING',
    title: 'LODHA ALTAMOUNT SKY VILLA',
    subtitle: 'Ultra-Luxury Penthouses in South Mumbai',
    offerText: '1 Month Free Club & Spa Membership',
    ctaText: 'View Project',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'b3',
    badge: 'CO-LIVING SPECIAL',
    title: 'VERIFIED MARKETPLACE PG BEDS',
    subtitle: 'Fully Furnished • WiFi & Homely Food Included',
    offerText: 'Flat ₹2,000 Off on 1st Month Rent',
    ctaText: 'Book Room',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'b4',
    badge: 'BUSINESS & COWORKING',
    title: 'PLUG & PLAY WORKSPACES',
    subtitle: 'Boutique Offices & High-Footfall Commercial Shops',
    offerText: 'Zero Lock-In Period Guarantee',
    ctaText: 'Explore Offices',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'b5',
    badge: 'E-STAMP LEGAL SETUP',
    title: 'INSTANT DIGITAL AGREEMENT',
    subtitle: 'Government Biometric & 100% Legal E-Stamp',
    offerText: 'Delivered in 15 Minutes to your WhatsApp',
    ctaText: 'Create Agreement',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1000&auto=format&fit=crop&q=80',
  },
];

interface V4OfferBannerProps {
  banners?: V4BannerSlide[];
  onBannerPress?: (banner: V4BannerSlide) => void;
}

export const V4OfferBanner: React.FC<V4OfferBannerProps> = ({
  banners = DEFAULT_BANNERS,
  onBannerPress,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const current = banners[currentIndex];

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.bannerCard}
        onPress={() => onBannerPress?.(current)}
      >
        <Image source={{ uri: current.imageUrl }} style={styles.bgImage} resizeMode="cover" />
        <View style={styles.overlay} />

        <View style={styles.content}>
          {/* Top Tag & Dots */}
          <View style={styles.topRow}>
            <View style={styles.badgePill}>
              <Sparkles size={11} color="#FDE047" />
              <Text style={styles.badgeText}>{current.badge}</Text>
            </View>

            <View style={styles.dotsRow}>
              {banners.map((_, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => setCurrentIndex(idx)}
                  style={[
                    styles.dot,
                    currentIndex === idx && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Headline & Subtitle */}
          <View style={styles.middleCol}>
            <Text style={styles.title} numberOfLines={1}>{current.title}</Text>
            <Text style={styles.subtitle} numberOfLines={1}>{current.subtitle}</Text>
          </View>

          {/* Bottom Offer Strip & CTA */}
          <View style={styles.bottomRow}>
            <View style={styles.offerPill}>
              <BadgePercent size={12} color="#10B981" />
              <Text style={styles.offerText} numberOfLines={1}>{current.offerText}</Text>
            </View>

            <View style={styles.ctaBtn}>
              <Text style={styles.ctaText}>{current.ctaText}</Text>
              <ChevronRight size={12} color="#FFFFFF" strokeWidth={2.6} />
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  bannerCard: {
    width: '100%',
    height: 160,
    backgroundColor: '#0F172A',
    borderRadius: V4_RADIUS.card,
    overflow: 'hidden',
    position: 'relative',
    ...V4_SHADOWS.card,
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 27, 42, 0.55)',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    padding: 14,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(3, 27, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(253, 224, 71, 0.4)',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FDE047',
    letterSpacing: 0.5,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  dotActive: {
    width: 16,
    backgroundColor: '#14B8A6',
  },
  middleCol: {
    gap: 2,
  },
  title: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  offerPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.8,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  offerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  ctaText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
