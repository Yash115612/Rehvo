import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  X,
} from 'lucide-react-native';
import { Property } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS, V4_TYPOGRAPHY } from '../../../theme/v4Theme';
import { V4Badge } from './V4Badge';
import { V4Image } from './V4Image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;

export interface V4PropertyCardLargeProps {
  property: Property;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onSelect?: (property: Property) => void;
  onBookVisit?: (property: Property) => void;
  aiMatchScore?: number;
  whyThisBadge?: string;
  onNotInterested?: (propertyId: string) => void;
  isZeroDeposit?: boolean;
  cardWidth?: number;
}

const V4PropertyCardLargeComponent: React.FC<V4PropertyCardLargeProps> = ({
  property,
  isSaved = false,
  onToggleSave,
  onSelect,
  onBookVisit,
  aiMatchScore,
  whyThisBadge,
  onNotInterested,
  isZeroDeposit,
  cardWidth,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = property.images && property.images.length > 0
    ? property.images.map((img) => img.url)
    : [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&auto=format&fit=crop&q=80',
      ];

  const handleImageScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideSize);
    if (index !== activeImageIndex && index >= 0 && index < images.length) {
      setActiveImageIndex(index);
    }
  };

  const effectiveWidth = cardWidth || CARD_WIDTH;

  return (
    <Pressable
      style={[
        styles.card,
        cardWidth ? { width: cardWidth, marginHorizontal: 8 } : undefined,
      ]}
      onPress={() => onSelect?.(property)}
    >
      {/* 1. TOP IMAGE CAROUSEL WITH OVERLAYS */}
      <View style={styles.imageContainer}>
        {cardWidth ? (
          <V4Image
            source={{ uri: images[0] }}
            style={[styles.propertyImage, { width: effectiveWidth }]}
            containerStyle={[styles.propertyImage, { width: effectiveWidth }]}
            resizeMode="cover"
          />
        ) : (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            scrollEventThrottle={32}
            style={styles.imageScroll}
          >
            {images.map((imgUrl, idx) => (
              <V4Image
                key={idx}
                source={{ uri: imgUrl }}
                style={[styles.propertyImage, { width: effectiveWidth }]}
                containerStyle={[styles.propertyImage, { width: effectiveWidth }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        <View style={styles.imageGradientBottom} />

        {/* Top Floating Left: AI Match & Badges */}
        <View style={styles.topLeftBadges}>
          {aiMatchScore !== undefined && (
            <View style={styles.badgeAiMatch}>
              <Sparkles size={11} color="#2DD4BF" strokeWidth={2.4} />
              <Text style={styles.badgeAiMatchText}>{aiMatchScore}% MATCH</Text>
            </View>
          )}
          {whyThisBadge && (
            <View style={styles.badgeWhy}>
              <Text style={styles.badgeWhyText} numberOfLines={1}>{whyThisBadge}</Text>
            </View>
          )}
          {isZeroDeposit && (
            <View style={styles.badgeZeroDeposit}>
              <Text style={styles.badgeZeroDepositText}>0 DEPOSIT</Text>
            </View>
          )}
          <View style={styles.badgeZero}>
            <Sparkles size={11} color="#0F766E" />
            <Text style={styles.badgeZeroText}>VERIFIED LISTING</Text>
          </View>
        </View>

        {/* Top Floating Right: Not Interested & Save Heart Button */}
        <View style={styles.topRightActions}>
          {onNotInterested && (
            <Pressable
              style={styles.notInterestedButton}
              onPress={() => onNotInterested(property.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Not interested in this recommendation"
              accessibilityRole="button"
            >
              <X size={15} color="#475569" strokeWidth={2.5} />
            </Pressable>
          )}

          <Pressable
            style={[styles.heartButton, isSaved && styles.heartButtonActive]}
            onPress={() => onToggleSave?.(property.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Save property"
            accessibilityRole="button"
          >
            <Heart
              size={18}
              color={isSaved ? '#EF4444' : '#031B2A'}
              fill={isSaved ? '#EF4444' : 'none'}
              strokeWidth={2.4}
            />
          </Pressable>
        </View>

        {/* Bottom Image Indicators & Rating */}
        <View style={styles.imageBottomRow}>
          <View style={styles.ratingPill}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>4.92</Text>
            <Text style={styles.ratingCount}>(28)</Text>
          </View>

          {/* Dots Indicator */}
          <View style={styles.dotsRow}>
            {images.slice(0, 5).map((_, dotIdx) => (
              <View
                key={dotIdx}
                style={[
                  styles.dot,
                  dotIdx === activeImageIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* 2. CARD CONTENT & METRICS */}
      <View style={styles.cardContent}>
        {/* Row A: Rent & Instant Schedule CTA */}
        <View style={styles.priceRow}>
          <View>
            <View style={styles.priceSubRow}>
              <Text style={styles.rentAmount}>
                ₹{(property.rent || 35000).toLocaleString('en-IN')}
              </Text>
              <Text style={styles.rentPerMonth}>/ month</Text>
            </View>
            <Text style={styles.depositHint}>
              Deposit: ₹{((property.deposit || (property.rent || 35000) * 2)).toLocaleString('en-IN')} • Zero Fee
            </Text>
          </View>

          {onBookVisit && (
            <Pressable
              style={styles.bookVisitBtn}
              onPress={() => onBookVisit(property)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Calendar size={13} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.bookVisitBtnText}>Book Visit</Text>
            </Pressable>
          )}
        </View>

        {/* Row B: Property Title & Locality */}
        <Text style={styles.propertyTitle} numberOfLines={1}>
          {property.title || 'Spacious 2 BHK Sea-Facing High Rise Apartment'}
        </Text>

        <View style={styles.locationRow}>
          <MapPin size={13} color={V4_COLORS.primary} strokeWidth={2.4} />
          <Text style={styles.locationText} numberOfLines={1}>
            {property.locality || 'Bandra West'}, {property.city || 'Mumbai'}
          </Text>
        </View>

        {/* Row C: Specs Pills (BHK, Bath, Area, Furnishing) */}
        <View style={styles.specsRow}>
          <View style={styles.specChip}>
            <Bed size={12} color="#475569" strokeWidth={2} />
            <Text style={styles.specText}>{property.bhk || '2 BHK'}</Text>
          </View>

          <View style={styles.specChip}>
            <Bath size={12} color="#475569" strokeWidth={2} />
            <Text style={styles.specText}>{property.bathrooms || 2} Baths</Text>
          </View>

          <View style={styles.specChip}>
            <Maximize2 size={12} color="#475569" strokeWidth={2} />
            <Text style={styles.specText}>{property.area_sqft || 980} sqft</Text>
          </View>

          <View style={styles.furnishChip}>
            <Text style={styles.furnishText}>
              {property.furnishing === 'FULLY_FURNISHED'
                ? 'Furnished'
                : property.furnishing === 'SEMI_FURNISHED'
                ? 'Semi-Furnished'
                : 'Unfurnished'}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export const V4PropertyCardLarge = React.memo(V4PropertyCardLargeComponent, (prev, next) => {
  return (
    prev.property.id === next.property.id &&
    prev.isSaved === next.isSaved &&
    prev.aiMatchScore === next.aiMatchScore &&
    prev.whyThisBadge === next.whyThisBadge &&
    prev.isZeroDeposit === next.isZeroDeposit &&
    prev.cardWidth === next.cardWidth &&
    prev.property.rent === next.property.rent &&
    prev.property.title === next.property.title
  );
});

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginHorizontal: 16,
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.card,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    marginBottom: 16,
    ...V4_SHADOWS.card,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
    backgroundColor: '#0F172A',
    borderTopLeftRadius: V4_RADIUS.card,
    borderTopRightRadius: V4_RADIUS.card,
    overflow: 'hidden',
  },
  imageScroll: {
    width: '100%',
    height: '100%',
  },
  propertyImage: {
    width: CARD_WIDTH,
    height: 220,
  },
  imageGradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    backgroundColor: 'rgba(3, 27, 42, 0.45)',
  },
  topLeftBadges: {
    position: 'absolute',
    top: 12,
    left: 12,
    gap: 6,
  },
  badgeAiMatch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(3, 27, 42, 0.90)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2DD4BF',
    ...V4_SHADOWS.soft,
  },
  badgeAiMatchText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#2DD4BF',
    letterSpacing: 0.5,
  },
  badgeWhy: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    maxWidth: 180,
    ...V4_SHADOWS.soft,
  },
  badgeWhyText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  badgeZeroDeposit: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    ...V4_SHADOWS.soft,
  },
  badgeZeroDepositText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 0.5,
  },
  badgeZero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    ...V4_SHADOWS.soft,
  },
  badgeZeroText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  badgeVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    ...V4_SHADOWS.soft,
  },
  badgeVerifiedText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#16A34A',
    letterSpacing: 0.5,
  },
  topRightActions: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notInterestedButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...V4_SHADOWS.soft,
  },
  heartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...V4_SHADOWS.soft,
  },
  heartButtonActive: {
    backgroundColor: '#FFF1F2',
  },
  imageBottomRow: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(3, 27, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ratingCount: {
    fontSize: 10,
    color: '#CBD5E1',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  dotActive: {
    width: 14,
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    padding: 16,
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceSubRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  rentAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.4,
  },
  rentPerMonth: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  depositHint: {
    fontSize: 11,
    color: V4_COLORS.textMuted,
    marginTop: 1,
  },
  bookVisitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    minHeight: 38,
    borderRadius: 14,
    ...V4_SHADOWS.soft,
  },
  bookVisitBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  propertyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  specText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  furnishChip: {
    backgroundColor: 'rgba(15, 118, 110, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  furnishText: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
});
