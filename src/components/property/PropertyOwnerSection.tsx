import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { ShieldCheck, Clock, MessageSquareText } from 'lucide-react-native';
import { Property } from '../../types';

interface PropertyOwnerSectionProps {
  property: Property;
  onContact?: () => void;
  onEnquire?: () => void;
}

export const PropertyOwnerSection: React.FC<PropertyOwnerSectionProps> = ({
  property,
  onContact,
  onEnquire,
}) => {
  const avatarUri =
    property.owner_avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Listed by</Text>

      <View style={styles.card}>
        <Image
          source={{ uri: avatarUri }}
          style={styles.avatar}
          resizeMode="cover"
        />

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.ownerName}>{property.owner_name}</Text>
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={12} color="#32B768" strokeWidth={2.5} />
              <Text style={styles.verifiedText}>Verified Owner</Text>
            </View>
          </View>

          <View style={styles.responseRow}>
            <Clock size={12.5} color="#777482" strokeWidth={2} />
            <Text style={styles.responseText}>
              Usually responds within 10 minutes
            </Text>
          </View>
        </View>

        {onEnquire && (
          <Pressable
            style={styles.enquireBtn}
            onPress={onEnquire}
            accessibilityRole="button"
            accessibilityLabel="Send direct enquiry to host"
          >
            <MessageSquareText size={16} color="#6C4DFF" strokeWidth={2.2} />
            <Text style={styles.enquireBtnText}>Enquire</Text>
          </Pressable>
        )}
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8E5EC',
  },
  infoCol: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  ownerName: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#171522',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#32B768',
  },
  responseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  responseText: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '500',
  },
  enquireBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F0ECFF',
    borderWidth: 1,
    borderColor: '#DED6FD',
  },
  enquireBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#6C4DFF',
  },
});
