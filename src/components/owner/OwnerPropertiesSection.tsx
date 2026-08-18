import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import {
  MoreVertical,
  Eye,
  MessageCircle,
  MapPin,
  ArrowRight,
} from 'lucide-react-native';
import { Property } from '../../types';

interface OwnerPropertiesSectionProps {
  properties: Property[];
  onViewAll: () => void;
  onSelectProperty: (prop: Property) => void;
  onOpenActions: (prop: Property) => void;
}

export const OwnerPropertiesSection: React.FC<OwnerPropertiesSectionProps> = ({
  properties,
  onViewAll,
  onSelectProperty,
  onOpenActions,
}) => {
  if (!properties || properties.length === 0) return null;

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'DRAFT':
        return { label: 'Draft', bg: '#F3F0EA', text: '#777482' };
      case 'PAUSED':
        return { label: 'Paused', bg: '#FEF3C7', text: '#D97706' };
      case 'RENTED':
        return { label: 'Rented', bg: '#F3F0EA', text: '#777482' };
      case 'ACTIVE':
      default:
        return { label: 'Active', bg: '#EAF8F0', text: '#32B768' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>My properties</Text>
        <Pressable
          style={styles.viewAllBtn}
          onPress={onViewAll}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="View all properties"
        >
          <Text style={styles.viewAllText}>View all</Text>
          <ArrowRight size={14} color="#6C4DFF" strokeWidth={2.2} />
        </Pressable>
      </View>

      {/* Property Cards List */}
      <View style={styles.list}>
        {properties.slice(0, 3).map((item) => {
          const coverImage =
            item.images?.find((img) => img.is_cover)?.url ||
            item.images?.[0]?.url ||
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';

          const statusInfo = getStatusBadge(item.status);
          const viewsCount = item.views_count || 128;
          const enquiriesCount = item.enquiries_count || 6;

          return (
            <Pressable
              key={item.id}
              style={styles.card}
              onPress={() => onSelectProperty(item)}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}, ₹${item.rent.toLocaleString('en-IN')}`}
            >
              {/* Left: Cover Thumbnail */}
              <Image source={{ uri: coverImage }} style={styles.thumbnail} />

              {/* Center: Details */}
              <View style={styles.detailsCol}>
                <View style={styles.titleStatusRow}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View
                    style={[
                      styles.statusPill,
                      { backgroundColor: statusInfo.bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: statusInfo.text },
                      ]}
                    >
                      {statusInfo.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.locRow}>
                  <MapPin size={11} color="#777482" strokeWidth={2} />
                  <Text style={styles.locText} numberOfLines={1}>
                    {item.locality}
                  </Text>
                </View>

                <Text style={styles.rentText}>
                  ₹{item.rent.toLocaleString('en-IN')}{' '}
                  <Text style={styles.rentPeriod}>/ month</Text>
                </Text>

                {/* Stats Footer */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Eye size={12} color="#777482" strokeWidth={2} />
                    <Text style={styles.statItemText}>{viewsCount} views</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <MessageCircle
                      size={12}
                      color="#777482"
                      strokeWidth={2}
                    />
                    <Text style={styles.statItemText}>
                      {enquiriesCount} enquiries
                    </Text>
                  </View>
                </View>
              </View>

              {/* Right: More Overflow Button */}
              <Pressable
                style={styles.moreBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  onOpenActions(item);
                }}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="More property options"
              >
                <MoreVertical size={18} color="#777482" />
              </Pressable>
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
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.2,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 12,
    gap: 12,
    alignItems: 'center',
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: '#E8E5EC',
  },
  detailsCol: {
    flex: 1,
    gap: 3,
  },
  titleStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  statusPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '700',
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
    fontSize: 14,
    fontWeight: '800',
    color: '#171522',
    marginTop: 1,
  },
  rentPeriod: {
    fontSize: 11,
    fontWeight: '500',
    color: '#777482',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statItemText: {
    fontSize: 11,
    color: '#777482',
    fontWeight: '500',
  },
  statDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D1CDD8',
  },
  moreBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
