import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import {
  Heart,
  MapPin,
  CheckCircle2,
  Sparkles,
} from 'lucide-react-native';
import { Property } from '../../types';

interface SearchPropertyCardProps {
  property: Property;
  isSaved: boolean;
  onPress: (property: Property) => void;
  onToggleSave: (propertyId: string) => void;
}

export const SearchPropertyCard: React.FC<SearchPropertyCardProps> = ({
  property,
  isSaved,
  onPress,
  onToggleSave,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const cover =
    property.images.find((i) => i.is_cover) || property.images[0];
  const coverUrl =
    cover?.url ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  const handleHeartPress = useCallback(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.8,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onToggleSave(property.id);
    });
  }, [scaleAnim, onToggleSave, property.id]);

  const isVerified = property.verification_status === 'VERIFIED';

  const furnishingLabel =
    property.furnishing === 'FULLY_FURNISHED'
      ? 'Fully Furnished'
      : property.furnishing === 'SEMI_FURNISHED'
      ? 'Semi Furnished'
      : 'Unfurnished';

  const brokerageLabel =
    property.brokerage === 0
      ? 'No Brokerage'
      : `₹${property.brokerage} Brokerage`;

  return (
    <Pressable
      onPress={() => onPress(property)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Property: ${property.title}, Rent: ${property.rent} rupees per month`}
    >
      {/* Property Hero Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: coverUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Top Badges (Verified & Sponsored) */}
        <View style={styles.imageTopLeft}>
          {isVerified && (
            <View style={styles.verifiedBadge}>
              <CheckCircle2 size={12} color="#32B768" strokeWidth={2.5} />
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          )}

          {property.is_sponsored && (
            <View style={styles.sponsoredBadge}>
              <Sparkles size={10} color="#6C4DFF" strokeWidth={2} />
              <Text style={styles.sponsoredText}>Sponsored · Ad</Text>
            </View>
          )}
        </View>

        {/* Floating Heart Button */}
        <Animated.View
          style={[
            styles.heartBtnWrap,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Pressable
            onPress={handleHeartPress}
            hitSlop={10}
            style={styles.heartBtn}
            accessibilityRole="button"
            accessibilityLabel={isSaved ? 'Remove from saved' : 'Save property'}
          >
            <Heart
              size={18}
              color={isSaved ? '#FF735C' : '#171522'}
              fill={isSaved ? '#FF735C' : 'none'}
              strokeWidth={isSaved ? 1.5 : 2}
            />
          </Pressable>
        </Animated.View>
      </View>

      {/* Card Body */}
      <View style={styles.body}>
        {/* Title & Monthly Rent */}
        <View style={styles.titlePriceRow}>
          <Text style={styles.title} numberOfLines={1}>
            {property.title}
          </Text>
          <View style={styles.priceWrap}>
            <Text style={styles.price}>
              ₹{property.rent.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.pricePeriod}>/ month</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <MapPin size={13} color="#777482" strokeWidth={1.8} />
          <Text style={styles.locationText} numberOfLines={1}>
            {property.locality}, {property.city}
          </Text>
        </View>

        {/* Specs: BHK · Bathrooms · Area */}
        <View style={styles.specsRow}>
          <Text style={styles.specText}>{property.bhk}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.specText}>
            {property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}
          </Text>
          {property.area_sqft > 0 && (
            <>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.specText}>
                {property.area_sqft.toLocaleString('en-IN')} sqft
              </Text>
            </>
          )}
        </View>

        {/* Benefits & Tags */}
        <View style={styles.tagsRow}>
          <Text style={styles.tagText}>{furnishingLabel}</Text>
          <Text style={styles.dot}>·</Text>
          <Text
            style={[
              styles.tagText,
              property.brokerage === 0 && styles.noBrokerageText,
            ]}
          >
            {brokerageLabel}
          </Text>
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
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#171522',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },
  imageContainer: {
    width: '100%',
    height: 215,
    position: 'relative',
    backgroundColor: '#EAE7E1',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageTopLeft: {
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#32B768',
  },
  sponsoredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sponsoredText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  heartBtnWrap: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  heartBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  body: {
    padding: 16,
    gap: 6,
  },
  titlePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 17.5,
    fontWeight: '700',
    color: '#171522',
    letterSpacing: -0.3,
  },
  priceWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: '#171522',
  },
  pricePeriod: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#777482',
    marginLeft: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: -1,
  },
  locationText: {
    fontSize: 13.5,
    color: '#777482',
    fontWeight: '500',
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  specText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagText: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '500',
  },
  noBrokerageText: {
    color: '#6C4DFF',
    fontWeight: '700',
  },
  dot: {
    fontSize: 12,
    color: '#A5A2AD',
  },
});
