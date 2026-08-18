import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Heart, MapPin, Sparkles, Utensils, Ruler, Bath, ShieldCheck } from 'lucide-react-native';
import { Property } from '../../types';

interface StudioPropertyCardProps {
  property: Property;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onPress: (property: Property) => void;
}

export const StudioPropertyCard: React.FC<StudioPropertyCardProps> = ({
  property,
  isSaved,
  onToggleSave,
  onPress,
}) => {
  const coverImage =
    property.images?.find((img) => img.is_cover)?.url ||
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(property)}
      accessibilityRole="button"
      accessibilityLabel={`View studio: ${property.title}`}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: coverImage }} style={styles.image} resizeMode="cover" />

        {/* Top Badges */}
        <View style={styles.topBadgesRow}>
          <View style={styles.studioBadge}>
            <Sparkles size={11} color="#6C4DFF" strokeWidth={2.5} />
            <Text style={styles.studioBadgeText}>Studio Apartment</Text>
          </View>

          {property.verification_status === 'VERIFIED' && (
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={11} color="#FFFFFF" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>

        {/* Save Heart */}
        <Pressable
          style={styles.saveBtn}
          onPress={() => onToggleSave(property.id)}
          hitSlop={8}
          accessibilityRole="button"
        >
          <Heart
            size={18}
            color={isSaved ? '#E5484D' : '#171522'}
            fill={isSaved ? '#E5484D' : 'none'}
            strokeWidth={2}
          />
        </Pressable>

        {/* Rent Overlay */}
        <View style={styles.priceOverlay}>
          <Text style={styles.priceText}>
            ₹{property.rent.toLocaleString('en-IN')}
            <Text style={styles.priceMonthText}> / mo</Text>
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>

        <View style={styles.locationRow}>
          <MapPin size={13} color="#777482" />
          <Text style={styles.locationText} numberOfLines={1}>
            {property.locality}, {property.city}
          </Text>
        </View>

        {/* Studio Specs */}
        <View style={styles.specsRow}>
          <View style={styles.specItem}>
            <Ruler size={13} color="#6C4DFF" />
            <Text style={styles.specText}>{property.area_sqft} sqft</Text>
          </View>
          <Text style={styles.dot}>·</Text>
          <View style={styles.specItem}>
            <Bath size={13} color="#6C4DFF" />
            <Text style={styles.specText}>{property.bathrooms} Bath</Text>
          </View>
          <Text style={styles.dot}>·</Text>
          <View style={styles.specItem}>
            <Utensils size={13} color="#6C4DFF" />
            <Text style={styles.specText}>Modular Kitchen</Text>
          </View>
        </View>

        {/* Chips */}
        <View style={styles.chipsRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {property.furnishing === 'FULLY_FURNISHED' ? 'Fully Furnished' : 'Semi Furnished'}
            </Text>
          </View>

          {property.brokerage === 0 && (
            <View style={styles.chip}>
              <Text style={[styles.chipText, { color: '#171522', fontWeight: '700' }]}>
                Zero Brokerage
              </Text>
            </View>
          )}

          {property.parking && property.parking !== 'None' && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{property.parking}</Text>
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
    height: 175,
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
  studioBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DED6FD',
  },
  studioBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6C4DFF',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#32B768',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
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
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#777482',
  },
});
