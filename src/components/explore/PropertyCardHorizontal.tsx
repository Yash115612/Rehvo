import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Property } from '../../types';

interface PropertyCardHorizontalProps {
  property: Property;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelect: (property: Property) => void;
  style?: any;
}

export const PropertyCardHorizontal: React.FC<PropertyCardHorizontalProps> = ({
  property,
  isSaved,
  onToggleSave,
  onSelect,
  style,
}) => {
  const coverImage = property.images[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  return (
    <Pressable
      onPress={() => onSelect(property)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
    >
      {/* Left Thumbnail Image */}
      <View style={styles.imageBox}>
        <Image source={{ uri: coverImage }} style={styles.image} resizeMode="cover" />

        {property.is_sponsored && (
          <View style={styles.adBadge}>
            <Text style={styles.adText}>Ad</Text>
          </View>
        )}

        {property.verification_status === 'VERIFIED' && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Verified</Text>
          </View>
        )}
      </View>

      {/* Right Details */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.bhkChip}>
            <Text style={styles.bhkChipText}>
              {property.bhk} • {property.property_type.replace('_', ' ')}
            </Text>
          </View>

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleSave(property.id);
            }}
            style={styles.heartBtn}
          >
            <Text style={[styles.heartIcon, isSaved ? styles.heartActive : styles.heartInactive]}>
              {isSaved ? '♥' : '♡'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>

        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {property.locality}, {property.city}
          </Text>
        </View>

        {/* Footer info & Rent */}
        <View style={styles.footerRow}>
          <Text style={styles.priceText}>
            ₹{property.rent.toLocaleString('en-IN')}
            <Text style={styles.moText}>/mo</Text>
          </Text>

          <View style={styles.detailsTag}>
            <Text style={styles.detailsTagText}>Details →</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    marginVertical: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  imageBox: {
    width: 110,
    height: 110,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E4E2DD',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  adBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  adText: {
    color: '#FF6B4A',
    fontSize: 9,
    fontWeight: '900',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#32B768',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bhkChip: {
    backgroundColor: '#EEE9FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  bhkChipText: {
    color: '#6C4DFF',
    fontSize: 10,
    fontWeight: '900',
  },
  heartBtn: {
    padding: 2,
  },
  heartIcon: {
    fontSize: 18,
  },
  heartActive: {
    color: '#FF6B4A',
  },
  heartInactive: {
    color: '#86828F',
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#17151F',
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationIcon: {
    fontSize: 12,
  },
  locationText: {
    fontSize: 11,
    color: '#86828F',
    fontWeight: '600',
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0EEE9',
    marginTop: 4,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#17151F',
  },
  moText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#86828F',
  },
  detailsTag: {
    backgroundColor: '#EEE9FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  detailsTagText: {
    color: '#6C4DFF',
    fontSize: 10,
    fontWeight: '800',
  },
});

