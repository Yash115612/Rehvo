import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Heart, ShieldCheck, MapPin } from 'lucide-react-native';
import { Property } from '../../types';

interface HomePropertyGridProps {
  title?: string;
  subtitle?: string;
  properties: Property[];
  savedPropertyIds: string[];
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const HomePropertyGrid: React.FC<HomePropertyGridProps> = ({
  title = 'More places for you',
  subtitle = 'Fresh rentals worth exploring across Mumbai',
  properties,
  savedPropertyIds,
  onToggleSave,
  onSelectProperty,
}) => {
  if (properties.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.grid}>
        {properties.map((item) => {
          const isSaved = savedPropertyIds.includes(item.id);
          const coverImage =
            item.images?.find((img) => img.is_cover)?.url ||
            item.images?.[0]?.url ||
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80';

          return (
            <Pressable
              key={item.id}
              style={styles.gridCard}
              onPress={() => onSelectProperty(item)}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}, ${item.locality}`}
            >
              {/* Image Hero */}
              <View style={styles.imageWrap}>
                <Image
                  source={{ uri: coverImage }}
                  style={styles.image}
                  resizeMode="cover"
                />

                {item.verification_status === 'VERIFIED' && (
                  <View style={styles.verifiedBadge}>
                    <ShieldCheck size={11} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}

                <Pressable
                  style={styles.heartBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    onToggleSave(item.id);
                  }}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityLabel={isSaved ? 'Remove save' : 'Save'}
                >
                  <Heart
                    size={16}
                    color={isSaved ? '#6C4DFF' : '#171522'}
                    fill={isSaved ? '#6C4DFF' : 'transparent'}
                    strokeWidth={2}
                  />
                </Pressable>
              </View>

              {/* Card Body */}
              <View style={styles.body}>
                <Text style={styles.propTitle} numberOfLines={1}>
                  {item.title}
                </Text>

                <View style={styles.locRow}>
                  <MapPin size={11} color="#777482" strokeWidth={2} />
                  <Text style={styles.locText} numberOfLines={1}>
                    {item.locality}
                  </Text>
                </View>

                <Text style={styles.priceAmount}>
                  ₹{item.rent.toLocaleString('en-IN')}
                  <Text style={styles.pricePeriod}> / mo</Text>
                </Text>

                <View style={styles.footerRow}>
                  <Text style={styles.specsText}>{item.bhk}</Text>
                  {item.brokerage === 0 && (
                    <Text style={styles.noBrokerageText}>No Brokerage</Text>
                  )}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 30,
  },
  header: {
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    overflow: 'hidden',
  },
  imageWrap: {
    width: '100%',
    height: 125,
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
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  body: {
    padding: 10,
    gap: 4,
  },
  propTitle: {
    fontSize: 13.5,
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
  priceAmount: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#171522',
    marginTop: 2,
  },
  pricePeriod: {
    fontSize: 10.5,
    fontWeight: '500',
    color: '#777482',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F3F0EA',
  },
  specsText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#777482',
  },
  noBrokerageText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#32B768',
  },
});
