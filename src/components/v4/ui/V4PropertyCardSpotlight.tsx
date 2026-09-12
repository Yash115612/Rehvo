import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Crown, Sparkles, MapPin, ChevronRight, ShieldCheck, Star } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Image } from './V4Image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface V4PropertyCardSpotlightProps {
  title?: string;
  developer?: string;
  locality?: string;
  price?: string;
  offer?: string;
  badge?: string;
  imageUrl?: string;
  onPress?: () => void;
}

const V4PropertyCardSpotlightComponent: React.FC<V4PropertyCardSpotlightProps> = ({
  title = 'Lodha Altamount Signature Sky Villa',
  developer = 'Lodha Luxury Collection',
  locality = 'Altamount Road, South Mumbai',
  price = '₹1,85,000/mo',
  offer = '1 Month Free Club Membership • Zero Deposit',
  badge = 'VIP LAUNCH • VERIFIED LISTING',
  imageUrl = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&auto=format&fit=crop&q=80',
  onPress,
}) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <V4Image
        source={{ uri: imageUrl }}
        style={styles.image}
        containerStyle={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      <View style={styles.content}>
        {/* Top Badges Row */}
        <View style={styles.topRow}>
          <View style={styles.vipPill}>
            <Crown size={11} color="#F59E0B" />
            <Text style={styles.vipPillText}>VIP SPOTLIGHT</Text>
          </View>

          <View style={styles.ratingBadge}>
            <Star size={11} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>5.0</Text>
          </View>
        </View>

        {/* Bottom Details */}
        <View style={styles.bottomSection}>
          <View style={styles.tagRow}>
            <Sparkles size={11} color="#FDE047" />
            <Text style={styles.tagText}>{badge}</Text>
          </View>

          <Text style={styles.title} numberOfLines={1}>{title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.locCol}>
              <Text style={styles.localityText}>📍 {locality}</Text>
              <Text style={styles.offerText}>{offer}</Text>
            </View>

            <View style={styles.priceBox}>
              <Text style={styles.priceText}>{price}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export const V4PropertyCardSpotlight = React.memo(V4PropertyCardSpotlightComponent);

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 32,
    height: 190,
    backgroundColor: '#0F172A',
    borderRadius: V4_RADIUS.card,
    overflow: 'hidden',
    position: 'relative',
    ...V4_SHADOWS.card,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 27, 42, 0.48)',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    padding: 14,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(3, 27, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  vipPillText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 0.5,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(3, 27, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bottomSection: {
    gap: 4,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FDE047',
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  locCol: {
    flex: 1,
    paddingRight: 8,
  },
  localityText: {
    fontSize: 11.5,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  offerText: {
    fontSize: 10.5,
    color: '#5EEAD4',
    fontWeight: '700',
    marginTop: 1,
  },
  priceBox: {
    backgroundColor: 'rgba(15, 118, 110, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  priceText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
