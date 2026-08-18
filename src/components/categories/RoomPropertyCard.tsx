import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Heart, MapPin, Bath, BedDouble, Users, Home, Sparkles } from 'lucide-react-native';
import { Property } from '../../types';

interface RoomPropertyCardProps {
  property: Property;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onPress: (property: Property) => void;
}

export const RoomPropertyCard: React.FC<RoomPropertyCardProps> = ({
  property,
  isSaved,
  onToggleSave,
  onPress,
}) => {
  const coverImage =
    property.images?.find((img) => img.is_cover)?.url ||
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80';

  const isPrivate =
    property.property_type === 'PRIVATE_ROOM' ||
    property.title?.toLowerCase().includes('private') ||
    property.bhk?.toLowerCase().includes('private');

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(property)}
      accessibilityRole="button"
      accessibilityLabel={`View room: ${property.title}`}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: coverImage }} style={styles.image} resizeMode="cover" />

        {/* Room Type Badge */}
        <View style={styles.topBadgesRow}>
          <View style={[styles.roomTypeBadge, isPrivate ? styles.privateBadge : styles.sharedBadge]}>
            <BedDouble size={12} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.roomTypeText}>
              {isPrivate ? 'Private Room' : 'Shared Room'}
            </Text>
          </View>

          {property.brokerage === 0 && (
            <View style={styles.zeroBrokerageBadge}>
              <Text style={styles.zeroBrokerageText}>No Brokerage</Text>
            </View>
          )}
        </View>

        {/* Save Heart */}
        <Pressable
          style={styles.saveBtn}
          onPress={() => onToggleSave(property.id)}
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

        {/* Rent Overlay */}
        <View style={styles.priceOverlay}>
          <Text style={styles.priceText}>
            ₹{property.rent.toLocaleString('en-IN')}
            <Text style={styles.priceMonthText}> / mo</Text>
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>

        <View style={styles.locationRow}>
          <MapPin size={13} color="#777482" />
          <Text style={styles.locationText} numberOfLines={1}>
            {property.locality}, {property.city}
          </Text>
        </View>

        {/* Flat / Home Context */}
        <View style={styles.contextRow}>
          <Home size={13} color="#6C4DFF" />
          <Text style={styles.contextText}>
            In a {property.bhk || '3 BHK'} apartment · {property.bathrooms > 1 ? 'Attached Bath' : 'Shared Bath'}
          </Text>
        </View>

        {/* Highlight Chips */}
        <View style={styles.chipsRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {property.furnishing === 'FULLY_FURNISHED' ? 'Furnished Room' : 'Semi Furnished'}
            </Text>
          </View>

          <View style={styles.chip}>
            <Bath size={11} color="#6C4DFF" />
            <Text style={styles.chipText}>
              {property.bathrooms > 1 ? 'Attached Bath' : 'Private Washroom'}
            </Text>
          </View>

          {property.tenant_preferences?.[0] && (
            <View style={[styles.chip, styles.chipPref]}>
              <Users size={11} color="#777482" />
              <Text style={styles.chipText} numberOfLines={1}>
                {property.tenant_preferences[0]}
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
  roomTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  privateBadge: {
    backgroundColor: '#6C4DFF',
  },
  sharedBadge: {
    backgroundColor: '#3B82F6',
  },
  roomTypeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  zeroBrokerageBadge: {
    backgroundColor: '#171522',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  zeroBrokerageText: {
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
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  contextText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#171522',
  },
  chipsRow: {
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
  chipPref: {
    maxWidth: 160,
  },
  chipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#777482',
  },
});
