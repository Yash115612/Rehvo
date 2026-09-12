import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { MapPin, ChevronRight, IndianRupee, BedDouble } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export interface V4PropertyShareData {
  id: string;
  title: string;
  image: string;
  rent: number | string;
  locality: string;
  city?: string;
  bhk?: string;
  distance?: string;
}

interface V4PropertyShareCardProps {
  property: V4PropertyShareData;
  onPress?: () => void;
  senderLabel?: string;
}

export const V4PropertyShareCard: React.FC<V4PropertyShareCardProps> = ({
  property,
  onPress,
  senderLabel,
}) => {
  const router = useRouter();

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    } else if (property.id) {
      router.push(`/(renter)/property/${property.id}`);
    }
  };

  const formattedRent =
    typeof property.rent === 'number'
      ? `₹${property.rent.toLocaleString('en-IN')}/mo`
      : property.rent.startsWith('₹')
      ? property.rent
      : `₹${property.rent}`;

  return (
    <Pressable
      style={styles.container}
      onPress={handleCardPress}
      accessibilityRole="button"
      accessibilityLabel={`View property ${property.title}`}
    >
      {!!senderLabel && (
        <View style={styles.senderHeader}>
          <Text style={styles.senderText}>🏠 {senderLabel}</Text>
        </View>
      )}

      <View style={styles.imageWrap}>
        <Image source={{ uri: property.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.pricePill}>
          <Text style={styles.priceText}>{formattedRent}</Text>
        </View>
        {!!property.bhk && (
          <View style={styles.bhkPill}>
            <BedDouble size={12} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.bhkText}>{property.bhk}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>

        <View style={styles.metaRow}>
          <MapPin size={13} color="#059669" strokeWidth={2.2} />
          <Text style={styles.localityText} numberOfLines={1}>
            {property.locality}{property.city ? `, ${property.city}` : ''}
          </Text>
          {!!property.distance && (
            <Text style={styles.distanceText}>· {property.distance}</Text>
          )}
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.viewDetailsText}>View Property Details</Text>
          <ChevronRight size={14} color="#059669" strokeWidth={2.4} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    marginVertical: 4,
    maxWidth: 320,
  },
  senderHeader: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  senderText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#059669',
  },
  imageWrap: {
    width: '100%',
    height: 140,
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pricePill: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(3, 27, 42, 0.85)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  bhkPill: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(5, 150, 105, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bhkText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  content: {
    padding: 12,
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  localityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    flex: 1,
  },
  distanceText: {
    fontSize: 11.5,
    color: '#94A3B8',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 2,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
});
