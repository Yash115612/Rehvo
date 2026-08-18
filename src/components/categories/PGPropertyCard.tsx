import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Heart, MapPin, ShieldCheck, Utensils, Wifi, Wind, Users, BedDouble } from 'lucide-react-native';
import { PG } from '../../types';

interface PGPropertyCardProps {
  pg: PG;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onPress: (pg: PG) => void;
}

export const PGPropertyCard: React.FC<PGPropertyCardProps> = ({
  pg,
  isSaved,
  onToggleSave,
  onPress,
}) => {
  const coverImage =
    pg.images?.[0] ||
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';

  // Calculate lowest room rent
  const lowestRent = pg.rooms?.length
    ? Math.min(...pg.rooms.map((r) => r.rent))
    : 12000;

  // Calculate total vacant beds
  const totalVacantBeds = pg.rooms?.reduce(
    (sum, r) => sum + (r.available_beds || 0),
    0
  );

  const getGenderColor = (gender: string) => {
    if (gender === 'Ladies') return { bg: '#FDF2F8', text: '#DB2777', border: '#FBCFE8' };
    if (gender === 'Gents') return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' };
    return { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' };
  };

  const genderStyle = getGenderColor(pg.gender_allowed);

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(pg)}
      accessibilityRole="button"
      accessibilityLabel={`View ${pg.name}`}
    >
      {/* Top Image & Gender Tag */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: coverImage }} style={styles.image} resizeMode="cover" />

        {/* Top Badges */}
        <View style={styles.topBadgesRow}>
          <View
            style={[
              styles.genderBadge,
              { backgroundColor: genderStyle.bg, borderColor: genderStyle.border },
            ]}
          >
            <Text style={[styles.genderText, { color: genderStyle.text }]}>
              {pg.gender_allowed} PG
            </Text>
          </View>

          {pg.food_provided && (
            <View style={styles.foodBadge}>
              <Utensils size={11} color="#FFFFFF" />
              <Text style={styles.foodBadgeText}>Meals Included</Text>
            </View>
          )}
        </View>

        {/* Save Heart */}
        <Pressable
          style={styles.saveBtn}
          onPress={() => onToggleSave(pg.id)}
          hitSlop={8}
          accessibilityRole="button"
        >
          <Heart
            size={18}
            color={isSaved ? '#E5484D' : '#171522'}
            fill={isSaved ? '#E5484D' : 'none'}
            strokeWidth={2}
          />
        </Pressable>

        {/* Bottom Price Overlay */}
        <View style={styles.priceOverlay}>
          <Text style={styles.priceText}>
            From ₹{lowestRent.toLocaleString('en-IN')}
            <Text style={styles.priceMonthText}> / mo</Text>
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {pg.name}
        </Text>

        <View style={styles.locationRow}>
          <MapPin size={13} color="#777482" />
          <Text style={styles.locationText} numberOfLines={1}>
            {pg.locality}, {pg.city}
          </Text>
        </View>

        {/* Room Sharing Options */}
        <View style={styles.roomsRow}>
          <BedDouble size={14} color="#6C4DFF" strokeWidth={2} />
          <Text style={styles.roomsText}>
            {pg.rooms?.map((r) => `${r.sharing_type} (₹${(r.rent / 1000).toFixed(0)}K)`).join(' · ') ||
              'Single & Double Occupancy'}
          </Text>
        </View>

        {/* PG Amenities Chips */}
        <View style={styles.amenitiesRow}>
          {pg.food_provided && (
            <View style={styles.chip}>
              <Utensils size={11} color="#32B768" />
              <Text style={styles.chipText}>3 Meals</Text>
            </View>
          )}

          <View style={styles.chip}>
            <Wind size={11} color="#6C4DFF" />
            <Text style={styles.chipText}>AC Rooms</Text>
          </View>

          <View style={styles.chip}>
            <Wifi size={11} color="#6C4DFF" />
            <Text style={styles.chipText}>High-Speed Wi-Fi</Text>
          </View>

          {totalVacantBeds > 0 && (
            <View style={[styles.chip, styles.chipAvailable]}>
              <Users size={11} color="#1B8246" />
              <Text style={[styles.chipText, { color: '#1B8246' }]}>
                {totalVacantBeds} Beds Left
              </Text>
            </View>
          )}
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
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 14,
  },
  imageWrap: {
    width: '100%',
    height: 175,
    backgroundColor: '#E8E5EC',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBadgesRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  genderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  genderText: {
    fontSize: 11,
    fontWeight: '800',
  },
  foodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#32B768',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  foodBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  saveBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  priceOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    backgroundColor: 'rgba(23, 21, 34, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  priceMonthText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#E8E5EC',
  },
  content: {
    padding: 14,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '500',
  },
  roomsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  roomsText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#171522',
  },
  amenitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  chipAvailable: {
    backgroundColor: '#EAF8F0',
    borderColor: '#D2F0E0',
  },
  chipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#777482',
  },
});
