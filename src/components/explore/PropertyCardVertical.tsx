import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Property } from '../../types';

interface PropertyCardVerticalProps {
  property: Property;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelect: (property: Property) => void;
}

function getPropertyTypeLabel(type: Property['property_type']): string {
  switch (type) {
    case 'FLAT':
    case 'APARTMENT':
      return 'Flat';
    case 'PG':
      return 'PG';
    case 'CO_LIVING':
      return 'Co-living';
    case 'PRIVATE_ROOM':
      return 'Private Room';
    case 'SHARED_ROOM':
      return 'Shared Room';
    default:
      return String(type).replace('_', ' ');
  }
}

function getFurnishingLabel(furnishing: Property['furnishing']): string {
  switch (furnishing) {
    case 'FULLY_FURNISHED':
      return 'Furnished';
    case 'SEMI_FURNISHED':
      return 'Semi Furnished';
    default:
      return 'Unfurnished';
  }
}

export const PropertyCardVertical: React.FC<PropertyCardVerticalProps> = ({
  property,
  isSaved,
  onToggleSave,
  onSelect,
}) => {
  const coverImage =
    property.images[0]?.url ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  const benefits: string[] = [];
  if (property.brokerage === 0) benefits.push('No Brokerage');
  benefits.push(getFurnishingLabel(property.furnishing));

  return (
    <Pressable
      onPress={() => onSelect(property)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: coverImage }} style={styles.image} resizeMode="cover" />

        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            onToggleSave(property.id);
          }}
          style={[styles.saveBtn, isSaved && styles.saveBtnActive]}
          hitSlop={8}
        >
          <Text style={[styles.heart, isSaved && styles.heartActive]}>
            {isSaved ? '♥' : '♡'}
          </Text>
        </Pressable>

        {property.is_sponsored && (
          <View style={styles.sponsoredBadge}>
            <Text style={styles.sponsoredText}>Sponsored · Ad</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.badgeRow}>
          <Text style={styles.typeLabel}>{getPropertyTypeLabel(property.property_type)}</Text>
          {property.verification_status === 'VERIFIED' && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {property.title}
        </Text>

        <Text style={styles.location} numberOfLines={1}>
          {property.locality}, {property.city}
        </Text>

        <Text style={styles.price}>
          ₹{property.rent.toLocaleString('en-IN')}
          <Text style={styles.pricePeriod}> / month</Text>
        </Text>

        <Text style={styles.details}>
          {property.bhk} · {property.bathrooms} Bath · {property.area_sqft.toLocaleString('en-IN')} sqft
        </Text>

        <Text style={styles.benefits} numberOfLines={1}>
          {benefits.join(' · ')}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    overflow: 'hidden',
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.96,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    backgroundColor: '#E8E5EC',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  saveBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnActive: {
    backgroundColor: '#FF735C',
  },
  heart: {
    fontSize: 18,
    color: '#171522',
  },
  heartActive: {
    color: '#FFFFFF',
  },
  sponsoredBadge: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sponsoredText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#777482',
  },
  body: {
    padding: 14,
    gap: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  verifiedBadge: {
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    color: '#32B768',
    fontSize: 10,
    fontWeight: '600',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#171522',
    lineHeight: 20,
  },
  location: {
    fontSize: 13,
    fontWeight: '400',
    color: '#777482',
    marginTop: 2,
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
    color: '#171522',
    marginTop: 6,
  },
  pricePeriod: {
    fontSize: 13,
    fontWeight: '400',
    color: '#777482',
  },
  details: {
    fontSize: 12,
    fontWeight: '400',
    color: '#777482',
    marginTop: 2,
  },
  benefits: {
    fontSize: 12,
    fontWeight: '400',
    color: '#777482',
    marginTop: 4,
  },
});
