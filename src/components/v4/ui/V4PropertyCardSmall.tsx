import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Heart, MapPin, Star, Bed, Sparkles } from 'lucide-react-native';
import { Property } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Image } from './V4Image';

interface V4PropertyCardSmallProps {
  property: Property;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onSelect?: (property: Property) => void;
}

const V4PropertyCardSmallComponent: React.FC<V4PropertyCardSmallProps> = ({
  property,
  isSaved = false,
  onToggleSave,
  onSelect,
}) => {
  const coverImage = property.images && property.images.length > 0
    ? property.images[0].url
    : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';

  return (
    <Pressable
      style={styles.card}
      onPress={() => onSelect?.(property)}
    >
      {/* Image Thumbnail */}
      <View style={styles.imageContainer}>
        <V4Image
          source={{ uri: coverImage }}
          style={styles.image}
          containerStyle={styles.image}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />

        {/* Top 0% Fee Pill */}
        <View style={styles.zeroPill}>
          <Sparkles size={9} color="#0F766E" />
          <Text style={styles.zeroPillText}>0% FEE</Text>
        </View>

        {/* Heart Icon */}
        <Pressable
          style={styles.heartBtn}
          onPress={() => onToggleSave?.(property.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Save property"
          accessibilityRole="button"
        >
          <Heart
            size={14}
            color={isSaved ? '#EF4444' : '#FFFFFF'}
            fill={isSaved ? '#EF4444' : 'none'}
            strokeWidth={2.4}
          />
        </Pressable>

        {/* Rating on bottom left */}
        <View style={styles.ratingBadge}>
          <Star size={10} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.ratingText}>4.9</Text>
        </View>
      </View>

      {/* Info Body */}
      <View style={styles.body}>
        <View style={styles.rentRow}>
          <Text style={styles.rent}>₹{(property.rent || 32000).toLocaleString('en-IN')}</Text>
          <Text style={styles.period}>/mo</Text>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {property.title || '2 BHK Luxury Apartment'}
        </Text>

        <View style={styles.locRow}>
          <MapPin size={11} color={V4_COLORS.primary} strokeWidth={2.2} />
          <Text style={styles.locText} numberOfLines={1}>
            {property.locality || 'Bandra West'}
          </Text>
        </View>

        <View style={styles.specsRow}>
          <View style={styles.specItem}>
            <Bed size={10} color="#64748B" />
            <Text style={styles.specLabel}>{property.bhk || '2 BHK'}</Text>
          </View>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.furnishLabel}>
            {property.furnishing === 'FULLY_FURNISHED' ? 'Furnished' : 'Semi'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export const V4PropertyCardSmall = React.memo(V4PropertyCardSmallComponent, (prev, next) => {
  return (
    prev.property.id === next.property.id &&
    prev.isSaved === next.isSaved &&
    prev.property.rent === next.property.rent &&
    prev.property.title === next.property.title
  );
});

const styles = StyleSheet.create({
  card: {
    width: 175,
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.lg,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    ...V4_SHADOWS.soft,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
    backgroundColor: '#0F172A',
    borderTopLeftRadius: V4_RADIUS.lg,
    borderTopRightRadius: V4_RADIUS.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 27, 42, 0.15)',
  },
  zeroPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 6,
    ...V4_SHADOWS.soft,
  },
  zeroPillText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.4,
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(3, 27, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 6,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(3, 27, 42, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  body: {
    padding: 10,
    gap: 3,
  },
  rentRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  rent: {
    fontSize: 15,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  period: {
    fontSize: 10,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  title: {
    fontSize: 12.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locText: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    fontWeight: '500',
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  specLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  dotSeparator: {
    fontSize: 10,
    color: '#94A3B8',
  },
  furnishLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: V4_COLORS.primary,
  },
});
