import React, { useState, memo } from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { Play, Video } from 'lucide-react-native';
import { triggerHaptic } from '../../../utils/haptics';

interface V4VideoBubbleProps {
  videoUrl?: string;
  duration?: string;
  caption?: string;
  isMe: boolean;
}

const V4VideoBubbleComponent: React.FC<V4VideoBubbleProps> = ({
  videoUrl,
  duration = '0:28',
  caption,
  isMe,
}) => {
  const handlePlayVideo = () => {
    triggerHaptic();
    if (videoUrl) {
      Linking.openURL(videoUrl).catch(() => {});
    }
  };

  return (
    <Pressable
      style={[styles.container, isMe ? styles.containerMe : styles.containerOther]}
      onPress={handlePlayVideo}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Play video"
    >
      <View style={styles.thumbnailPlaceholder}>
        <View style={styles.gridOverlay} />
        <View style={styles.playIconCircle}>
          <Play size={20} color="#0F766E" fill="#0F766E" style={{ marginLeft: 2 }} />
        </View>
        <View style={styles.durationBadge}>
          <Video size={10} color="#FFFFFF" style={{ marginRight: 3 }} />
          <Text style={styles.durationText}>{duration}</Text>
        </View>
      </View>

      {caption ? (
        <View style={styles.captionRow}>
          <Text style={[styles.captionText, isMe ? styles.captionTextMe : styles.captionTextOther]}>
            {caption}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
};

export const V4VideoBubble = memo(V4VideoBubbleComponent);

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    overflow: 'hidden',
    maxWidth: 260,
    borderWidth: 1,
  },
  containerMe: {
    backgroundColor: '#0F766E',
    borderColor: '#0D6860',
  },
  containerOther: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2ECEF',
  },
  thumbnailPlaceholder: {
    width: 250,
    height: 160,
    backgroundColor: '#031B2A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 118, 110, 0.2)',
  },
  playIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(3, 27, 42, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  durationText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  captionRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  captionText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  captionTextMe: {
    color: '#FFFFFF',
  },
  captionTextOther: {
    color: '#031B2A',
  },
});
