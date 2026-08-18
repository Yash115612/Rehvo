import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { MapPin, ShieldCheck } from 'lucide-react-native';
import { Property } from '../../types';

interface PropertySimilarCarouselProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const PropertySimilarCarousel: React.FC<
  PropertySimilarCarouselProps
> = ({ properties, onSelectProperty }) => {
  if (!properties || properties.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Similar places</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {properties.map((item) => {
          const coverImage =
            item.images?.find((img) => img.is_cover)?.url ||
            item.images?.[0]?.url ||
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';

          return (
            <Pressable
              key={item.id}
              style={styles.card}
              onPress={() => onSelectProperty(item)}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}, ${item.locality}`}
            >
              <View style={styles.imageWrap}>
                <Image
                  source={{ uri: coverImage }}
                  style={styles.image}
                  resizeMode="cover"
                />
                {item.verification_status === 'VERIFIED' && (
                  <View style={styles.verifiedBadge}>
                    <ShieldCheck size={10} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>

              <View style={styles.body}>
                <Text style={styles.priceAmount}>
                  ₹{item.rent.toLocaleString('en-IN')}{' '}
                  <Text style={styles.pricePeriod}>/ mo</Text>
                </Text>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.locRow}>
                  <MapPin size={11} color="#777482" strokeWidth={2} />
                  <Text style={styles.locText} numberOfLines={1}>
                    {item.locality}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  scrollContent: {
    gap: 12,
  },
  card: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    overflow: 'hidden',
  },
  imageWrap: {
    width: '100%',
    height: 120,
    position: 'relative',
    backgroundColor: '#E8E5EC',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#32B768',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  body: {
    padding: 10,
    gap: 3,
  },
  priceAmount: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#171522',
  },
  pricePeriod: {
    fontSize: 11,
    fontWeight: '500',
    color: '#777482',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171522',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locText: {
    fontSize: 11.5,
    color: '#777482',
    fontWeight: '500',
  },
});
