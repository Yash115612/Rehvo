import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Heart, MapPin, ShieldCheck, Sparkles, Train, Car } from 'lucide-react-native';
import { Property } from '../../types';

interface RentPropertyCardProps {
  property: Property;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onPress: (property: Property) => void;
}

export const RentPropertyCard: React.FC<RentPropertyCardProps> = ({
  property,
  isSaved,
  onToggleSave,
  onPress,
}) => {
  const coverImage =
    property.images?.find((img) => img.is_cover)?.url ||
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';

  const formatFurnishing = (furn: string) => {
    if (furn === 'FULLY_FURNISHED') return 'Fully Furnished';
    if (furn === 'SEMI_FURNISHED') return 'Semi Furnished';
    return 'Unfurnished';
  };

  const hasMetro = property.amenities?.some((a) =>
    a.toLowerCase().includes('metro')
  ) || property.description?.toLowerCase().includes('metro');

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(property)}
      accessibilityRole="button"
      accessibilityLabel={`View ${property.title}`}
    >
      {/* Property Image Container */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: coverImage }} style={styles.image} resizeMode="cover" />

        {/* Top Badges */}
        <View style={styles.topBadgesRow}>
          {property.verification_status === 'VERIFIED' && (
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={12} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}

          {property.brokerage === 0 && (
            <View style={styles.noBrokerageBadge}>
              <Text style={styles.noBrokerageText}>Zero Brokerage</Text>
            </View>
          )}

          {property.is_sponsored && (
            <View style={styles.sponsoredBadge}>
              <Sparkles size={11} color="#6C4DFF" strokeWidth={2.5} />
              <Text style={styles.sponsoredText}>Featured</Text>
            </View>
          )}
        </View>

        {/* Save Heart Button */}
        <Pressable
          style={styles.saveBtn}
          onPress={() => onToggleSave(property.id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={isSaved ? 'Remove from saved' : 'Save property'}
        >
          <Heart
            size={18}
            color={isSaved ? '#E5484D' : '#171522'}
            fill={isSaved ? '#E5484D' : 'none'}
            strokeWidth={2}
          />
        </Pressable>

        {/* Bottom Image Overlay: Rent */}
        <View style={styles.priceOverlay}>
          <Text style={styles.priceText}>
            ₹{property.rent.toLocaleString('en-IN')}
            <Text style={styles.priceMonthText}> / mo</Text>
          </Text>
        </View>
      </View>

      {/* Property Details Content */}
      <View style={styles.content}>
        {/* Title & Location */}
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>

        <View style={styles.locationRow}>
          <MapPin size={13} color="#777482" />
          <Text style={styles.locationText} numberOfLines={1}>
            {property.locality}, {property.city}
          </Text>
        </View>

        {/* Apartment Specs Grid: BHK · Bathrooms · Area */}
        <View style={styles.specsRow}>
          <View style={styles.specBadge}>
            <Text style={styles.specBadgeText}>{property.bhk}</Text>
          </View>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.specText}>{property.bathrooms} Bath</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.specText}>{property.area_sqft} sqft</Text>
        </View>

        {/* Feature Pills */}
        <View style={styles.featurePillsRow}>
          <View style={styles.featurePill}>
            <Text style={styles.featurePillText}>
              {formatFurnishing(property.furnishing)}
            </Text>
          </View>

          {hasMetro && (
            <View style={styles.featurePill}>
              <Train size={11} color="#6C4DFF" />
              <Text style={styles.featurePillText}>Near Metro</Text>
            </View>
          )}

          {property.parking && property.parking !== 'None' && (
            <View style={styles.featurePill}>
              <Car size={11} color="#777482" />
              <Text style={styles.featurePillText}>{property.parking}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    overflow: 'hidden',
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 14,
  },
  imageWrap: {
    width: '100%',
    height: 180,
    backgroundColor: '#E8E5EC',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBadgesRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#32B768',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  noBrokerageBadge: {
    backgroundColor: '#171522',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  noBrokerageText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sponsoredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FAF9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DED6FD',
  },
  sponsoredText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6C4DFF',
  },
  saveBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  priceOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    backgroundColor: 'rgba(23, 21, 34, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  priceMonthText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#E8E5EC',
  },
  content: {
    padding: 14,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '500',
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  specBadge: {
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  specBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6C4DFF',
  },
  dot: {
    fontSize: 12,
    color: '#A5A2AD',
  },
  specText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#171522',
  },
  featurePillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  featurePillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#777482',
  },
});
