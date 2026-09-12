import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Share, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Building2,
  MapPin,
  IndianRupee,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Phone,
  Share2,
} from 'lucide-react-native';
import { PropertyMessageMeta } from '../../../types';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';

interface V4PropertyShareCardProps {
  property: PropertyMessageMeta;
  isMe?: boolean;
  onPress?: () => void;
  onScheduleVisit?: () => void;
  onCallOwner?: () => void;
  onShareListing?: () => void;
}

export const V4PropertyShareCard: React.FC<V4PropertyShareCardProps> = ({
  property,
  isMe = false,
  onPress,
  onScheduleVisit,
  onCallOwner,
  onShareListing,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (property.property_id) {
      router.push(`/(renter)/property/${property.property_id}` as any);
    }
  };

  const handleScheduleVisit = () => {
    if (onScheduleVisit) {
      onScheduleVisit();
    } else if (property.property_id) {
      router.push(`/(renter)/property/${property.property_id}?tab=visit` as any);
    }
  };

  const handleCallOwner = () => {
    if (onCallOwner) {
      onCallOwner();
    } else {
      Linking.openURL('tel:+919820012345').catch(() => {});
    }
  };

  const handleShareListing = () => {
    if (onShareListing) {
      onShareListing();
    } else {
      Share.share({
        title: property.title || 'REHVO Luxury Flat',
        message: `Check out this verified property in ${property.locality || 'Mumbai'} on REHVO (Verified Listing): ${property.title} - ₹${(property.rent || 75000).toLocaleString('en-IN')}/month.`,
      }).catch(() => {});
    }
  };

  const formattedRent = property.rent ? `₹${property.rent.toLocaleString('en-IN')}/mo` : '₹75,000/mo';
  const formattedDeposit = property.deposit
    ? `₹${property.deposit.toLocaleString('en-IN')} Deposit`
    : 'Standard Deposit';

  return (
    <Pressable
      style={[
        styles.card,
        isMe ? styles.cardMe : styles.cardOther,
      ]}
      onPress={handlePress}
    >
      {/* Property Hero Image */}
      <View style={styles.imageWrap}>
        <Image
          source={{
            uri:
              property.image ||
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.verifiedTag}>
          <ShieldCheck size={11} color="#FFFFFF" strokeWidth={2.6} />
          <Text style={styles.verifiedTagText}>VERIFIED LISTING</Text>
        </View>
      </View>

      {/* Details Body */}
      <View style={styles.body}>
        <Text style={[styles.title, isMe && styles.titleMe]} numberOfLines={1}>
          {property.title || 'Luxury Verified Flat'}
        </Text>

        <View style={styles.localityRow}>
          <MapPin size={11} color={isMe ? '#CCFBF1' : '#64748B'} />
          <Text style={[styles.localityText, isMe && styles.localityTextMe]} numberOfLines={1}>
            {property.locality || 'Mumbai'}, {property.city || 'Maharashtra'}
          </Text>
        </View>

        {/* Bedroom & Furnishing Tag Strip */}
        <View style={styles.tagStrip}>
          <View style={[styles.miniBadge, isMe && styles.miniBadgeMe]}>
            <Text style={[styles.miniBadgeText, isMe && styles.miniBadgeTextMe]}>
              {property.bhk || '2 BHK'}
            </Text>
          </View>
          <View style={[styles.miniBadge, isMe && styles.miniBadgeMe]}>
            <Text style={[styles.miniBadgeText, isMe && styles.miniBadgeTextMe]}>
              {property.furnishing || 'Furnished'}
            </Text>
          </View>
        </View>

        {/* Pricing Metrics Strip */}
        <View style={[styles.metricsStrip, isMe && styles.metricsStripMe]}>
          <View>
            <Text style={[styles.rentText, isMe && styles.rentTextMe]}>
              {formattedRent}
            </Text>
            <Text style={[styles.depositText, isMe && styles.depositTextMe]}>
              {formattedDeposit}
            </Text>
          </View>
        </View>

        {/* 4 Interactive CTAs */}
        <View style={styles.ctaGrid}>
          <Pressable
            style={[styles.ctaBtn, styles.ctaBtnPrimary, isMe && styles.ctaBtnPrimaryMe]}
            onPress={handlePress}
          >
            <Text style={[styles.ctaBtnPrimaryText, isMe && styles.ctaBtnPrimaryTextMe]}>
              View Listing
            </Text>
            <ArrowRight size={11} color={isMe ? '#064E3B' : '#FFFFFF'} strokeWidth={2.4} />
          </Pressable>

          <Pressable
            style={[styles.ctaBtn, styles.ctaBtnSecondary, isMe && styles.ctaBtnSecondaryMe]}
            onPress={handleScheduleVisit}
          >
            <Calendar size={11} color={isMe ? '#FFFFFF' : '#0F766E'} />
            <Text style={[styles.ctaBtnSecondaryText, isMe && styles.ctaBtnSecondaryTextMe]}>
              Visit
            </Text>
          </Pressable>

          <Pressable
            style={[styles.ctaBtn, styles.ctaBtnSecondary, isMe && styles.ctaBtnSecondaryMe]}
            onPress={handleCallOwner}
          >
            <Phone size={11} color={isMe ? '#FFFFFF' : '#0F766E'} />
            <Text style={[styles.ctaBtnSecondaryText, isMe && styles.ctaBtnSecondaryTextMe]}>
              Call
            </Text>
          </Pressable>

          <Pressable
            style={[styles.ctaBtn, styles.ctaBtnSecondary, isMe && styles.ctaBtnSecondaryMe]}
            onPress={handleShareListing}
          >
            <Share2 size={11} color={isMe ? '#FFFFFF' : '#0F766E'} />
            <Text style={[styles.ctaBtnSecondaryText, isMe && styles.ctaBtnSecondaryTextMe]}>
              Share
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 290,
    marginVertical: 4,
    borderWidth: 1,
    ...V4_SHADOWS.card,
  },
  cardMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  cardOther: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  imageWrap: {
    width: '100%',
    height: 120,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  verifiedTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  body: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  titleMe: {
    color: '#FFFFFF',
  },
  localityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  localityText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  localityTextMe: {
    color: '#CCFBF1',
  },
  metricsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  metricsStripMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  rentText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  rentTextMe: {
    color: '#FFFFFF',
  },
  depositText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  depositTextMe: {
    color: '#A7F3D0',
  },
  tagStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  miniBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  miniBadgeMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  miniBadgeTextMe: {
    color: '#CCFBF1',
  },
  ctaGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 8,
    minHeight: 32,
    gap: 3,
  },
  ctaBtnPrimary: {
    flex: 2,
    backgroundColor: '#0F766E',
    paddingHorizontal: 8,
  },
  ctaBtnPrimaryMe: {
    backgroundColor: '#FFFFFF',
  },
  ctaBtnPrimaryText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ctaBtnPrimaryTextMe: {
    color: '#064E3B',
  },
  ctaBtnSecondary: {
    flex: 1,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 6,
  },
  ctaBtnSecondaryMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  ctaBtnSecondaryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F766E',
  },
  ctaBtnSecondaryTextMe: {
    color: '#FFFFFF',
  },
});
