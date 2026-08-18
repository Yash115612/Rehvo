import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  MapPin,
  Train,
  ShoppingCart,
  Building,
  HeartPulse,
  Navigation,
} from 'lucide-react-native';
import { Property } from '../../types';

interface PropertyLocationSectionProps {
  property: Property;
}

export const PropertyLocationSection: React.FC<
  PropertyLocationSectionProps
> = ({ property }) => {
  const nearbyPoints = [
    {
      icon: Train,
      name: `${property.locality} Metro Station`,
      time: '8 min walk',
    },
    {
      icon: ShoppingCart,
      name: 'Supermarket & Daily Needs',
      time: '4 min walk',
    },
    {
      icon: HeartPulse,
      name: 'Multi-Speciality Hospital',
      time: '9 min drive',
    },
    {
      icon: Building,
      name: 'Commercial Tech & Business Hub',
      time: '12 min drive',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Location</Text>

      {/* Address Text */}
      <View style={styles.addressBox}>
        <MapPin size={16} color="#6C4DFF" strokeWidth={2} />
        <Text style={styles.addressText} numberOfLines={2}>
          {property.address || `${property.locality}, ${property.city}`}
        </Text>
      </View>

      {/* Clean Stylized Map Box */}
      <View style={styles.mapCard}>
        <View style={styles.mapPinWrap}>
          <View style={styles.pinCircle}>
            <MapPin size={22} color="#FFFFFF" strokeWidth={2.2} />
          </View>
          <View style={styles.pinTag}>
            <Text style={styles.pinTagText}>{property.locality}</Text>
          </View>
        </View>
      </View>

      {/* Nearby Amenities */}
      <View style={styles.nearbySection}>
        <Text style={styles.nearbyTitle}>Nearby Transit & Conveniences</Text>
        <View style={styles.nearbyGrid}>
          {nearbyPoints.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <View key={idx} style={styles.nearbyRow}>
                <View style={styles.iconCircle}>
                  <Icon size={16} color="#6C4DFF" strokeWidth={2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.nearbyName} numberOfLines={1}>
                    {pt.name}
                  </Text>
                  <Text style={styles.nearbyTime}>{pt.time}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
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
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  addressText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#171522',
  },
  mapCard: {
    height: 140,
    backgroundColor: '#E5E0D8',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mapPinWrap: {
    alignItems: 'center',
    gap: 6,
  },
  pinCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  pinTag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  pinTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#171522',
  },
  nearbySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 16,
    gap: 12,
  },
  nearbyTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  nearbyGrid: {
    gap: 10,
  },
  nearbyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearbyName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  nearbyTime: {
    fontSize: 11.5,
    color: '#777482',
    fontWeight: '500',
    marginTop: 1,
  },
});
