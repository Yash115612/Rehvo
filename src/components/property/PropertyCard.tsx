import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Property } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const { savedPropertyIds, toggleSaveProperty } = useAppStore();
  const isSaved = savedPropertyIds.includes(property.id);

  const coverImage = property.images.find((img) => img.is_cover)?.url || property.images[0]?.url;

  return (
    <Pressable onPress={() => onSelect(property)} style={styles.card}>
      {/* Image Container */}
      <View style={styles.imageBox}>
        <Image source={{ uri: coverImage }} style={styles.image} resizeMode="cover" />

        {/* Badges */}
        <View style={styles.badgeRow}>
          <View style={styles.badgeGroup}>
            {property.verification_status === 'VERIFIED' && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            )}
            {property.brokerage === 0 && (
              <View style={styles.brokerageBadge}>
                <Text style={styles.brokerageText}>Zero Brokerage</Text>
              </View>
            )}
          </View>

          {/* Save Button */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              toggleSaveProperty(property.id);
            }}
            style={styles.saveBtn}
          >
            <Text style={{ fontSize: 16 }}>{isSaved ? '❤️' : '🤍'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            ₹{property.rent.toLocaleString('en-IN')}
            <Text style={styles.period}>/mo</Text>
          </Text>
          <View style={styles.bhkChip}>
            <Text style={styles.bhkText}>{property.bhk}</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>

        <Text style={styles.location}>
          📍 {property.locality}, Mumbai
        </Text>

        {/* Features Chips */}
        <View style={styles.featureRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{property.furnishing.replace('_', ' ')}</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{property.area_sqft} sq.ft</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Flr {property.floor}</Text>
          </View>
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
    borderColor: '#E4E2DD',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  imageBox: {
    height: 180,
    width: '100%',
    position: 'relative',
    backgroundColor: '#EAE8E3',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  verifiedBadge: {
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: '#32B768',
    fontSize: 10,
    fontWeight: '900',
  },
  brokerageBadge: {
    backgroundColor: '#EEE9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  brokerageText: {
    color: '#6C4DFF',
    fontSize: 10,
    fontWeight: '900',
  },
  saveBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 14,
    gap: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '900',
    color: '#17151F',
  },
  period: {
    fontSize: 12,
    color: '#86828F',
    fontWeight: '500',
  },
  bhkChip: {
    backgroundColor: '#EEE9FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  bhkText: {
    color: '#6C4DFF',
    fontSize: 11,
    fontWeight: '800',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#17151F',
  },
  location: {
    fontSize: 12,
    color: '#86828F',
    fontWeight: '600',
    marginBottom: 6,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0EEE9',
  },
  chip: {
    backgroundColor: '#F5F3EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 10,
    color: '#48464B',
    fontWeight: '700',
  },
});
