import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import {
  Heart,
  ShieldCheck,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Sparkles,
} from 'lucide-react-native';
import { Property } from '../../types';

interface HomeFeaturedSectionProps {
  property: Property | null;
  savedPropertyIds: string[];
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const HomeFeaturedSection: React.FC<HomeFeaturedSectionProps> = ({
  property,
  savedPropertyIds,
  onToggleSave,
  onSelectProperty,
}) => {
  if (!property) return null;

  const isSaved = savedPropertyIds.includes(property.id);
  const coverImage =
    property.images?.find((img) => img.is_cover)?.url ||
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80';

  const formatFurnishing = (f: string) => {
    if (f === 'FULLY_FURNISHED') return 'Fully Furnished';
    if (f === 'SEMI_FURNISHED') return 'Semi Furnished';
    return 'Unfurnished';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Featured rentals</Text>
        <Text style={styles.subtitle}>
          Verified places worth checking out
        </Text>
      </View>

      <Pressable
        style={styles.card}
        onPress={() => onSelectProperty(property)}
        accessibilityRole="button"
        accessibilityLabel={`Featured: ${property.title}`}
      >
        {/* Large Cover Hero */}
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: coverImage }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Badges Left */}
          <View style={styles.badgeLeftStack}>
            <View style={styles.featuredBadge}>
              <Sparkles size={11} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.badgeText}>Featured</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={11} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.badgeText}>Verified</Text>
            </View>
          </View>

          {/* Sponsored Ad Disclosure */}
          <View style={styles.sponsoredBadge}>
            <Text style={styles.sponsoredText}>Sponsored · Ad</Text>
          </View>

          {/* Floating Heart Save */}
          <Pressable
            style={styles.heartBtn}
            onPress={(e) => {
              e.stopPropagation();
              onToggleSave(property.id);
            }}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={isSaved ? 'Remove from saved' : 'Save property'}
          >
            <Heart
              size={18}
              color={isSaved ? '#6C4DFF' : '#171522'}
              fill={isSaved ? '#6C4DFF' : 'transparent'}
              strokeWidth={2}
            />
          </Pressable>
        </View>

        {/* Card Details */}
        <View style={styles.body}>
          <View style={styles.titlePriceRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.propTitle} numberOfLines={1}>
                {property.title}
              </Text>
              <View style={styles.locRow}>
                <MapPin size={13} color="#777482" strokeWidth={2} />
                <Text style={styles.locText} numberOfLines={1}>
                  {property.locality} · {property.city}
                </Text>
              </View>
            </View>

            <View style={styles.priceCol}>
              <Text style={styles.priceAmount}>
                ₹{property.rent.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.pricePeriod}>/ month</Text>
            </View>
          </View>

          {/* Specs & Benefits */}
          <View style={styles.metaRow}>
            <Text style={styles.specsText}>
              {property.bhk} · {property.bathrooms} Bath · {property.area_sqft} sqft
            </Text>
            <View style={styles.chipsWrap}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  {formatFurnishing(property.furnishing)}
                </Text>
              </View>
              {property.brokerage === 0 && (
                <View style={styles.noBrokerageChip}>
                  <Text style={styles.noBrokerageText}>No Brokerage</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
  },
  header: {
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#777482',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    overflow: 'hidden',
  },
  imageWrap: {
    width: '100%',
    height: 200,
    position: 'relative',
    backgroundColor: '#E8E5EC',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeLeftStack: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#32B768',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sponsoredBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(23, 21, 34, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sponsoredText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  body: {
    padding: 16,
    gap: 10,
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  propTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171522',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  locText: {
    fontSize: 13,
    color: '#777482',
    fontWeight: '500',
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 17,
    fontWeight: '800',
    color: '#171522',
  },
  pricePeriod: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#777482',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F0EA',
    paddingTop: 10,
  },
  specsText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#777482',
  },
  chipsWrap: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    backgroundColor: '#F3F0EA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#171522',
  },
  noBrokerageChip: {
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  noBrokerageText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#32B768',
  },
});
