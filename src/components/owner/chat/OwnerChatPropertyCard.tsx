import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { MapPin, ArrowRight } from 'lucide-react-native';
import { Property } from '../../../types';

interface OwnerChatPropertyCardProps {
  property: Property | null;
  onPress: () => void;
}

export const OwnerChatPropertyCard: React.FC<OwnerChatPropertyCardProps> = ({
  property,
  onPress,
}) => {
  if (!property) return null;

  const coverImage =
    property.images?.find((img) => img.is_cover)?.url ||
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View listing for ${property.title}`}
    >
      <Image source={{ uri: coverImage }} style={styles.thumbnail} />
      <View style={styles.infoCol}>
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>
        <View style={styles.locRow}>
          <MapPin size={11} color="#777482" strokeWidth={2} />
          <Text style={styles.locText} numberOfLines={1}>
            {property.locality}, Mumbai
          </Text>
        </View>
        <Text style={styles.rentText}>
          ₹{property.rent.toLocaleString('en-IN')} / month
        </Text>
      </View>
      <View style={styles.viewBadge}>
        <Text style={styles.viewText}>Listing</Text>
        <ArrowRight size={12} color="#6C4DFF" strokeWidth={2.5} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 10,
    gap: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  thumbnail: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#E8E5EC',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  title: {
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
  rentText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#6C4DFF',
  },
  viewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  viewText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C4DFF',
  },
});
