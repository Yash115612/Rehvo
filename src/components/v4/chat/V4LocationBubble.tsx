import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { MapPin, Navigation, ExternalLink } from 'lucide-react-native';
import { triggerHaptic } from '../../../utils/haptics';

interface V4LocationBubbleProps {
  location: { latitude: number; longitude: number; name?: string };
  isMe: boolean;
}

const V4LocationBubbleComponent: React.FC<V4LocationBubbleProps> = ({ location, isMe }) => {
  const openMaps = () => {
    triggerHaptic();
    const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={[styles.card, isMe ? styles.cardMe : styles.cardOther]}>
      {/* Mini Map Visual Representation */}
      <View style={styles.mapPreview}>
        <View style={styles.mapGridPattern} />
        <View style={styles.pinWrapper}>
          <View style={styles.pinPulse} />
          <View style={styles.pinCircle}>
            <MapPin size={18} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, isMe ? styles.textLight : styles.textDark]} numberOfLines={1}>
          {location.name || 'Shared Live Location'}
        </Text>
        <Text style={[styles.coords, isMe ? styles.subtextLight : styles.subtextDark]}>
          {location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E
        </Text>

        <Pressable
          style={[styles.openBtn, isMe ? styles.openBtnMe : styles.openBtnOther]}
          onPress={openMaps}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Open location in Maps"
        >
          <Navigation size={13} color={isMe ? '#0F766E' : '#FFFFFF'} />
          <Text style={[styles.openBtnText, isMe ? styles.openBtnTextMe : styles.openBtnTextOther]}>
            Open in Maps
          </Text>
          <ExternalLink size={12} color={isMe ? '#0F766E' : '#FFFFFF'} />
        </Pressable>
      </View>
    </View>
  );
};

export const V4LocationBubble = memo(V4LocationBubbleComponent);

const styles = StyleSheet.create({
  card: {
    width: 240,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardMe: {
    backgroundColor: '#0F766E',
    borderColor: '#0D6860',
  },
  cardOther: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2ECEF',
  },
  mapPreview: {
    height: 100,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mapGridPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E0F2FE',
    opacity: 0.6,
  },
  pinWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinPulse: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(15, 118, 110, 0.25)',
  },
  pinCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
  },
  coords: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 10,
    fontWeight: '600',
  },
  textLight: {
    color: '#FFFFFF',
  },
  textDark: {
    color: '#031B2A',
  },
  subtextLight: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  subtextDark: {
    color: '#64748B',
  },
  openBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  openBtnMe: {
    backgroundColor: '#FFFFFF',
  },
  openBtnOther: {
    backgroundColor: '#0F766E',
  },
  openBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  openBtnTextMe: {
    color: '#0F766E',
  },
  openBtnTextOther: {
    color: '#FFFFFF',
  },
});
