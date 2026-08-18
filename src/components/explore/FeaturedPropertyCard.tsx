import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Property } from '../../types';

interface FeaturedPropertyCardProps {
  property: Property;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelect: (property: Property) => void;
}

export const FeaturedPropertyCard: React.FC<FeaturedPropertyCardProps> = ({
  property,
  isSaved,
  onToggleSave,
  onSelect,
}) => {
  const coverImage =
    property.images[0]?.url ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  const isFurnished =
    property.furnishing === 'FULLY_FURNISHED'
      ? 'Fully Furnished'
      : property.furnishing === 'SEMI_FURNISHED'
      ? 'Semi Furnished'
      : 'Unfurnished';

  return (
    <Pressable onPress={() => onSelect(property)} style={styles.card}>
      {/* Image Banner */}
      <View style={styles.imageBox}>
        <Image source={{ uri: coverImage }} style={styles.image} resizeMode="cover" />

        <View style={styles.topBar}>
          <View style={styles.badgeGroup}>
            {property.is_sponsored ? (
              <View style={styles.sponsoredBadge}>
                <Text style={styles.sponsoredText}>⚡ Sponsored</Text>
              </View>
            ) : (
              property.verification_status === 'VERIFIED' && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓ Verified</Text>
                </View>
              )
            )}
            <View style={styles.bhkBadge}>
              <Text style={styles.bhkText}>{property.bhk}</Text>
            </View>
          </View>

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleSave(property.id);
            }}
            style={styles.saveBtn}
          >
            <Text style={{ fontSize: 18 }}>{isSaved ? '❤️' : '🤍'}</Text>
          </Pressable>
        </View>

        <View style={styles.bottomBar}>
          {property.brokerage === 0 && (
            <View style={styles.zeroBrokerageBadge}>
              <Text style={styles.zeroBrokerageText}>Zero Brokerage</Text>
            </View>
          )}
        </View>
      </View>

      {/* Info Container */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.title} numberOfLines={1}>
              {property.title}
            </Text>
            <Text style={styles.location}>📍 {property.locality}, Mumbai</Text>
          </View>
          <View style={styles.arrowCircle}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.priceLabel}>MONTHLY RENT</Text>
            <Text style={styles.price}>
              ₹{property.rent.toLocaleString('en-IN')}
              <Text style={styles.period}> / mo</Text>
            </Text>
          </View>

          <View style={styles.featureGroup}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{isFurnished}</Text>
            </View>
            <Text style={styles.availableText}>🟢 Available</Text>
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
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  imageBox: {
    height: 220,
    width: '100%',
    position: 'relative',
    backgroundColor: '#EAE8E3',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  sponsoredBadge: {
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sponsoredText: {
    color: '#FF6B4A',
    fontSize: 10,
    fontWeight: '900',
  },
  verifiedBadge: {
    backgroundColor: '#32B768',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  bhkBadge: {
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bhkText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  saveBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  zeroBrokerageBadge: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  zeroBrokerageText: {
    color: '#17151F',
    fontSize: 10,
    fontWeight: '900',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#17151F',
  },
  location: {
    fontSize: 12,
    fontWeight: '600',
    color: '#86828F',
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEE9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: '#6C4DFF',
    fontSize: 16,
    fontWeight: '800',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0EEE9',
  },
  priceLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#86828F',
  },
  price: {
    fontSize: 18,
    fontWeight: '900',
    color: '#17151F',
  },
  period: {
    fontSize: 11,
    color: '#86828F',
    fontWeight: '500',
  },
  featureGroup: {
    alignItems: 'flex-end',
    gap: 4,
  },
  chip: {
    backgroundColor: '#F7F5F0',
    borderWidth: 1,
    borderColor: '#E4E2DD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#17151F',
  },
  availableText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#32B768',
  },
});
