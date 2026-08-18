import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import {
  Heart,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Building2,
} from 'lucide-react-native';
import { Property } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.82);

interface HomeRecommendedCarouselProps {
  title?: string;
  subtitle?: string;
  properties: Property[];
  savedPropertyIds: string[];
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onViewAll: () => void;
  onResetCategory?: () => void;
}

export const HomeRecommendedCarousel: React.FC<HomeRecommendedCarouselProps> = ({
  title = 'Recommended for you',
  subtitle = 'Places picked for your preferences',
  properties,
  savedPropertyIds,
  onToggleSave,
  onSelectProperty,
  onViewAll,
  onResetCategory,
}) => {
  const formatFurnishing = (f: string) => {
    if (f === 'FULLY_FURNISHED') return 'Fully Furnished';
    if (f === 'SEMI_FURNISHED') return 'Semi Furnished';
    return 'Unfurnished';
  };

  return (
    <View style={styles.section}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {properties.length > 0 && (
          <Pressable
            style={styles.viewAllBtn}
            onPress={onViewAll}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="View all recommended properties"
          >
            <Text style={styles.viewAllText}>View all</Text>
            <ArrowRight size={14} color="#6C4DFF" strokeWidth={2.2} />
          </Pressable>
        )}
      </View>

      {/* Horizontal Property Carousel or Empty State */}
      {properties.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <Building2 size={26} color="#6C4DFF" strokeWidth={1.8} />
          </View>
          <Text style={styles.emptyTitle}>No places found</Text>
          <Text style={styles.emptySub}>
            We couldn't find matching properties in this category yet.
          </Text>
          <Pressable
            style={styles.exploreBtn}
            onPress={onResetCategory || onViewAll}
            accessibilityRole="button"
            accessibilityLabel="Explore all rentals"
          >
            <Text style={styles.exploreBtnText}>Explore all rentals</Text>
            <ArrowRight size={14} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + 12}
        >
          {properties.map((item) => {
            const isSaved = savedPropertyIds.includes(item.id);
            const coverImage =
              item.images?.find((img) => img.is_cover)?.url ||
              item.images?.[0]?.url ||
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80';

            return (
              <Pressable
                key={item.id}
                style={styles.card}
                onPress={() => onSelectProperty(item)}
                accessibilityRole="button"
                accessibilityLabel={`${item.title} in ${item.locality}, ₹${item.rent.toLocaleString('en-IN')} per month`}
              >
                {/* Image Hero */}
                <View style={styles.imageContainer}>
                  <Image source={{ uri: coverImage }} style={styles.image} />

                  {/* Verification Badge */}
                  {item.verification_status === 'VERIFIED' && (
                    <View style={styles.verifiedBadge}>
                      <ShieldCheck
                        size={12}
                        color="#FFFFFF"
                        strokeWidth={2.5}
                      />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  )}

                  {/* Heart Save Button */}
                  <Pressable
                    style={styles.heartBtn}
                    onPress={() => onToggleSave(item.id)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={
                      isSaved ? 'Remove from saved' : 'Save property'
                    }
                  >
                    <Heart
                      size={18}
                      color={isSaved ? '#FF4B4B' : '#171522'}
                      fill={isSaved ? '#FF4B4B' : 'transparent'}
                      strokeWidth={2}
                    />
                  </Pressable>
                </View>

                {/* Card Body */}
                <View style={styles.body}>
                  <View style={styles.titlePriceRow}>
                    <Text style={styles.propTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.priceAmount}>
                      ₹{item.rent.toLocaleString('en-IN')}
                      <Text style={styles.pricePeriod}> / mo</Text>
                    </Text>
                  </View>

                  <View style={styles.locRow}>
                    <MapPin size={13} color="#777482" strokeWidth={2} />
                    <Text style={styles.locText} numberOfLines={1}>
                      {item.locality}, {item.city}
                    </Text>
                  </View>

                  {/* Specs & Tags */}
                  <View style={styles.specsRow}>
                    <Text style={styles.specsText}>
                      {item.bhk} · {item.bathrooms} Bath · {item.area_sqft} sq ft
                    </Text>
                  </View>

                  <View style={styles.tagRow}>
                    <View style={styles.tagPill}>
                      <Text style={styles.tagPillText}>
                        {formatFurnishing(item.furnishing)}
                      </Text>
                    </View>

                    {item.brokerage === 0 && (
                      <View style={styles.noBrokeragePill}>
                        <Text style={styles.noBrokerageText}>No Brokerage</Text>
                      </View>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
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
    marginTop: 4,
    fontWeight: '500',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    overflow: 'hidden',
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 170,
    position: 'relative',
    backgroundColor: '#E8E5EC',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#32B768',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
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
    padding: 14,
    gap: 6,
  },
  titlePriceRow: {
    gap: 2,
  },
  propTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#171522',
  },
  priceAmount: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#171522',
    marginTop: 2,
  },
  pricePeriod: {
    fontSize: 12,
    fontWeight: '500',
    color: '#777482',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locText: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '500',
  },
  specsRow: {
    marginTop: 2,
  },
  specsText: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '600',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  tagPill: {
    backgroundColor: '#F3F0EA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#171522',
  },
  noBrokeragePill: {
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
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    marginHorizontal: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
  },
  emptySub: {
    fontSize: 13,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 6,
  },
  exploreBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
