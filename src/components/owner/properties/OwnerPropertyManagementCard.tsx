import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import {
  MoreHorizontal,
  MapPin,
  Eye,
  MessageCircle,
  CalendarDays,
  Sparkles,
  ArrowRight,
} from 'lucide-react-native';
import { Property } from '../../../types';

interface OwnerPropertyManagementCardProps {
  property: Property;
  onPress: () => void;
  onOpenActions: () => void;
  onContinueDraft?: () => void;
}

export const OwnerPropertyManagementCard: React.FC<
  OwnerPropertyManagementCardProps
> = ({ property, onPress, onOpenActions, onContinueDraft }) => {
  const coverImage =
    property.images?.find((img) => img.is_cover)?.url ||
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80';

  const getStatusInfo = (status?: string) => {
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

  const statusInfo = getStatusInfo(property.status);
  const viewsCount = property.views_count || 128;
  const enquiriesCount = property.enquiries_count || 6;
  const visitsCount = 2;
  const isDraft = property.status === 'DRAFT';

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${property.title}, ${property.locality}`}
    >
      {/* Large Cover Hero */}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: coverImage }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Status Badge Top-Left */}
        <View
          style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}
        >
          <Text style={[styles.statusBadgeText, { color: statusInfo.text }]}>
            {statusInfo.label}
          </Text>
        </View>

        {/* Promoted / Featured if applicable */}
        {property.is_sponsored && (
          <View style={styles.featuredBadge}>
            <Sparkles size={11} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}

        {/* More Menu Top-Right */}
        <Pressable
          style={styles.moreBtn}
          onPress={(e) => {
            e.stopPropagation();
            onOpenActions();
          }}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="More property options"
        >
          <MoreHorizontal size={20} color="#171522" strokeWidth={2.2} />
        </Pressable>
      </View>

      {/* Card Body */}
      <View style={styles.body}>
        <View style={styles.titlePriceRow}>
          <Text style={styles.title} numberOfLines={1}>
            {property.title}
          </Text>
          <Text style={styles.priceAmount}>
            ₹{property.rent.toLocaleString('en-IN')}
            <Text style={styles.pricePeriod}> / month</Text>
          </Text>
        </View>

        {/* Location Row */}
        <View style={styles.locRow}>
          <MapPin size={12.5} color="#777482" strokeWidth={2} />
          <Text style={styles.locText} numberOfLines={1}>
            {property.locality}, {property.city}
          </Text>
        </View>

        {/* Specs Row */}
        <Text style={styles.specsText}>
          {property.bhk} · {property.bathrooms} Bath · {property.area_sqft} sq ft
        </Text>

        {/* Draft Notice if Incomplete */}
        {isDraft && (
          <View style={styles.draftBox}>
            <View style={{ flex: 1 }}>
              <Text style={styles.draftTitle}>Continue your listing</Text>
              <Text style={styles.draftSub}>4 / 8 sections complete</Text>
            </View>
            <Pressable
              style={styles.draftBtn}
              onPress={(e) => {
                e.stopPropagation();
                if (onContinueDraft) onContinueDraft();
              }}
            >
              <Text style={styles.draftBtnText}>Continue</Text>
              <ArrowRight size={13} color="#6C4DFF" strokeWidth={2.5} />
            </Pressable>
          </View>
        )}

        {/* Performance Summary Footer */}
        {!isDraft && (
          <View style={styles.performanceRow}>
            <View style={styles.metricItem}>
              <Eye size={13} color="#777482" strokeWidth={2} />
              <Text style={styles.metricText}>{viewsCount} views</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <MessageCircle size={13} color="#777482" strokeWidth={2} />
              <Text style={styles.metricText}>{enquiriesCount} enquiries</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <CalendarDays size={13} color="#777482" strokeWidth={2} />
              <Text style={styles.metricText}>{visitsCount} visits</Text>
            </View>
          </View>
        )}
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
    marginBottom: 14,
  },
  imageWrap: {
    width: '100%',
    height: 180,
    position: 'relative',
    backgroundColor: '#E8E5EC',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  featuredText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  moreBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  body: {
    padding: 16,
    gap: 8,
  },
  titlePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#171522',
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
  },
  pricePeriod: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#777482',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locText: {
    fontSize: 13,
    color: '#777482',
    fontWeight: '500',
  },
  specsText: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '600',
  },
  draftBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7F5F0',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  draftTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171522',
  },
  draftSub: {
    fontSize: 11.5,
    color: '#777482',
    marginTop: 1,
  },
  draftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  draftBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  performanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F3F0EA',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metricText: {
    fontSize: 12,
    color: '#777482',
    fontWeight: '500',
  },
  metricDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D1CDD8',
  },
});
