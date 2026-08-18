import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  Wifi,
  Snowflake,
  Car,
  Building2,
  Zap,
  ShieldCheck,
  Waves,
  Sun,
  Dumbbell,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

interface PropertyAmenitiesSectionProps {
  amenities: string[];
}

const AMENITY_ICON_MAP: Record<
  string,
  React.ComponentType<{ size: number; color: string; strokeWidth?: number }>
> = {
  'Wi-Fi': Wifi,
  'High-Speed Wi-Fi': Wifi,
  'Air Conditioning': Snowflake,
  'AC': Snowflake,
  'Dedicated Parking': Car,
  'Parking': Car,
  'Elevator / Lift': Building2,
  'Lift': Building2,
  'Power Backup': Zap,
  '24/7 Power Backup': Zap,
  '24/7 Security': ShieldCheck,
  'Security': ShieldCheck,
  'Washing Machine': Waves,
  'Balcony': Sun,
  'Private Balcony': Sun,
  'Gym': Dumbbell,
  'Swimming Pool': Waves,
};

export const PropertyAmenitiesSection: React.FC<
  PropertyAmenitiesSectionProps
> = ({ amenities }) => {
  const [showAll, setShowAll] = useState(false);

  const list =
    amenities && amenities.length > 0
      ? amenities
      : [
          'High-Speed Wi-Fi',
          'Air Conditioning',
          'Dedicated Parking',
          'Elevator / Lift',
          '24/7 Power Backup',
          '24/7 Security',
          'Private Balcony',
        ];

  const displayedList = showAll ? list : list.slice(0, 6);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Amenities</Text>

      <View style={styles.grid}>
        {displayedList.map((item, idx) => {
          const Icon = AMENITY_ICON_MAP[item] || Sparkles;
          return (
            <View key={idx} style={styles.amenityPill}>
              <View style={styles.iconCircle}>
                <Icon size={16} color="#6C4DFF" strokeWidth={2} />
              </View>
              <Text style={styles.amenityText} numberOfLines={1}>
                {item}
              </Text>
            </View>
          );
        })}
      </View>

      {list.length > 6 && (
        <Pressable
          style={styles.viewAllBtn}
          onPress={() => setShowAll(!showAll)}
          hitSlop={8}
        >
          <Text style={styles.viewAllText}>
            {showAll ? 'Show fewer amenities' : `View all ${list.length} amenities`}
          </Text>
          {showAll ? (
            <ChevronUp size={15} color="#6C4DFF" strokeWidth={2.2} />
          ) : (
            <ChevronDown size={15} color="#6C4DFF" strokeWidth={2.2} />
          )}
        </Pressable>
      )}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityPill: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
});
