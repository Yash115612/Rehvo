import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Property } from '../../types';

export type PropertyCardVariant = 'standard' | 'compact' | 'featured';

interface PropertyCardProps {
  property: Property;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onPress?: () => void;
  variant?: PropertyCardVariant;
  overrideWidth?: number;
  /** @deprecated Use variant="compact" instead */
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isSaved = false,
  onToggleSave,
  onPress,
  variant = 'standard',
  overrideWidth,
  compact = false,
}) => {
  const coverImage =
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  const furnishingLabel =
    property.furnishing === 'FULLY_FURNISHED'
      ? 'Furnished'
      : property.furnishing === 'SEMI_FURNISHED'
      ? 'Semi'
      : 'Unfurnished';

  const resolvedVariant: PropertyCardVariant = compact ? 'compact' : variant;
  const isStandard = resolvedVariant === 'standard';
  const isCompact = resolvedVariant === 'compact';
  const isFeatured = resolvedVariant === 'featured';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isStandard && styles.cardStandard,
        overrideWidth != null && isStandard && { width: overrideWidth },
        isCompact && styles.cardCompact,
        isFeatured && styles.cardFeatured,
        pressed && styles.cardPressed,
      ]}
    >
      <View
        style={[
          styles.imageWrap,
          isStandard && styles.imageWrapStandard,
          isCompact && styles.imageWrapCompact,
          isFeatured && styles.imageWrapFeatured,
        ]}
      >
        <Image source={{ uri: coverImage }} style={styles.image} resizeMode="cover" />

        <View style={styles.badgeRow}>
          {property.verification_status === 'VERIFIED' && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeIcon}>✓</Text>
              {!isCompact && <Text style={styles.verifiedBadgeText}>Verified</Text>}
            </View>
          )}
          {property.brokerage === 0 && (
            <View style={styles.brokerBadge}>
              <Text style={styles.brokerBadgeText}>No Brokerage</Text>
            </View>
          )}
        </View>

        {property.is_sponsored && (
          <View style={styles.sponsoredBadge}>
            <Text style={styles.sponsoredBadgeText}>Sponsored · Ad</Text>
          </View>
        )}

        <View style={styles.propertyTypeBadge}>
          <Text style={styles.propertyTypeText} numberOfLines={1}>
            {property.bhk}
          </Text>
        </View>

        {onToggleSave && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            style={[
              styles.saveBtn,
              isSaved && styles.saveBtnActive,
            ]}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <Text style={[styles.saveIcon, isSaved && styles.saveIconActive]}>
              {isSaved ? '♥' : '♡'}
            </Text>
          </Pressable>
        )}
      </View>

      <View style={[styles.body, isCompact && styles.bodyCompact, isFeatured && styles.bodyFeatured]}>
        {isFeatured && (
          <View style={styles.featuredLabelRow}>
            <View style={styles.featuredLabelBadge}>
              <Text style={styles.featuredLabelText}>SPONSORED · AD</Text>
            </View>
          </View>
        )}

        <View style={styles.priceRow}>
          <Text style={[styles.price, isCompact && styles.priceCompact]}>
            ₹{property.rent.toLocaleString('en-IN')}
            <Text style={styles.priceMonth}> / month</Text>
          </Text>
        </View>

        <Text style={[styles.title, isCompact && styles.titleCompact]} numberOfLines={1}>
          {property.title}
        </Text>

        <View style={styles.locationRow}>
          <Text style={styles.locationPin}>📍</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {property.locality}, {property.city}
          </Text>
        </View>

        <View style={[styles.metaRow, isCompact && styles.metaRowCompact]}>
          <Text style={styles.metaText}>🛏 {property.bhk}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.metaText}>🛁 {property.bathrooms} Bath</Text>
          <View style={styles.metaDot} />
          <Text style={styles.metaText}>📐 {property.area_sqft} sqft</Text>
        </View>

        {!isCompact && (
          <View style={styles.bottomMeta}>
            <Text style={styles.furnishingTag}>{furnishingLabel}</Text>
            {property.brokerage === 0 && (
              <Text style={styles.zeroBrokerTag}>Zero Brokerage</Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  cardStandard: {
    borderRadius: 20,
    width: 300,
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  cardCompact: {
    borderRadius: 18,
    width: '100%',
  },
  cardFeatured: {
    borderRadius: 22,
    width: '100%',
    borderColor: '#EDE9FB',
    borderWidth: 1.5,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  cardPressed: {
    opacity: 0.93,
    transform: [{ scale: 0.996 }],
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#F0EEE9',
  },
  imageWrapStandard: {
    height: 212,
  },
  imageWrapCompact: {
    height: 144,
  },
  imageWrapFeatured: {
    height: 220,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    zIndex: 2,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(50, 183, 104, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedBadgeIcon: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  verifiedBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  brokerBadge: {
    backgroundColor: 'rgba(108, 77, 255, 0.95)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },
  brokerBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  sponsoredBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 115, 92, 0.95)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    zIndex: 2,
  },
  sponsoredBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  propertyTypeBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    zIndex: 2,
  },
  propertyTypeText: {
    color: '#171522',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  saveBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  saveBtnActive: {
    backgroundColor: 'rgba(255, 115, 92, 0.12)',
  },
  saveIcon: {
    fontSize: 16,
    color: '#777482',
    marginTop: 1,
  },
  saveIconActive: {
    color: '#FF735C',
  },
  body: {
    padding: 13,
    gap: 4,
  },
  bodyCompact: {
    padding: 11,
    gap: 3,
  },
  bodyFeatured: {
    padding: 16,
    gap: 6,
  },
  featuredLabelRow: {
    marginBottom: 2,
  },
  featuredLabelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featuredLabelText: {
    color: '#6C4DFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.2,
  },
  priceCompact: {
    fontSize: 16,
  },
  priceMonth: {
    fontSize: 11,
    fontWeight: '500',
    color: '#777482',
  },
  title: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
    letterSpacing: -0.05,
    marginTop: 2,
  },
  titleCompact: {
    fontSize: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  locationPin: {
    fontSize: 10.5,
  },
  locationText: {
    fontSize: 10.5,
    color: '#777482',
    fontWeight: '500',
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  metaRowCompact: {
    marginTop: 3,
  },
  metaText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#777482',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#D6D2DB',
    marginHorizontal: 6,
  },
  bottomMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  furnishingTag: {
    backgroundColor: '#F8F7F4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: '700',
    color: '#48464B',
  },
  zeroBrokerTag: {
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: '700',
    color: '#32B768',
  },
});
