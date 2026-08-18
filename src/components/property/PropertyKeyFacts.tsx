import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  BedDouble,
  Bath,
  Ruler,
  Armchair,
  Building,
  Car,
  Users,
} from 'lucide-react-native';
import { Property } from '../../types';

interface PropertyKeyFactsProps {
  property: Property;
}

export const PropertyKeyFacts: React.FC<PropertyKeyFactsProps> = ({
  property,
}) => {
  const formatFurnishing = (f: string) => {
    if (f === 'FULLY_FURNISHED') return 'Fully Furnished';
    if (f === 'SEMI_FURNISHED') return 'Semi Furnished';
    return 'Unfurnished';
  };

  const facts = [
    {
      icon: BedDouble,
      value: property.bhk,
      label: 'Configuration',
    },
    {
      icon: Bath,
      value: `${property.bathrooms} ${property.bathrooms === 1 ? 'Bath' : 'Baths'}`,
      label: 'Bathrooms',
    },
    {
      icon: Ruler,
      value: `${property.area_sqft} sq ft`,
      label: property.plot_area_sqft ? 'Built-up Area' : 'Carpet Area',
    },
    ...(property.plot_area_sqft
      ? [
          {
            icon: Ruler,
            value: `${property.plot_area_sqft} sq ft`,
            label: 'Plot Area',
          },
        ]
      : []),
    {
      icon: Armchair,
      value: formatFurnishing(property.furnishing),
      label: 'Furnishing',
    },
    {
      icon: Building,
      value: `Floor ${property.floor || 1} of ${property.total_floors || 4}`,
      label: 'Floor Level',
    },
    {
      icon: Car,
      value: property.parking || 'Car & Bike',
      label: 'Parking',
    },
    ...(property.has_pool
      ? [
          {
            icon: Users,
            value: 'Private Pool',
            label: 'Luxury Amenity',
          },
        ]
      : []),
    ...(property.has_garden
      ? [
          {
            icon: Users,
            value: 'Lawn Garden',
            label: 'Outdoor Space',
          },
        ]
      : []),
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>Property Facts</Text>
      <View style={styles.grid}>
        {facts.map((item, idx) => {
          const Icon = item.icon;
          return (
            <View key={idx} style={styles.factCard}>
              <View style={styles.iconCircle}>
                <Icon size={18} color="#6C4DFF" strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.valueText} numberOfLines={1}>
                  {item.value}
                </Text>
                <Text style={styles.labelText}>{item.label}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  factCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#171522',
  },
  labelText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#777482',
    marginTop: 1,
  },
});
