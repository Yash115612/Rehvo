import React, { useState, memo } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Image, Dimensions } from 'react-native';
import { X, ZoomIn, Download, Share2 } from 'lucide-react-native';
import { V4Image } from '../ui/V4Image';
import { triggerHaptic } from '../../../utils/haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface V4ImageBubbleProps {
  imageUrl: string;
  caption?: string;
  isMe: boolean;
}

const V4ImageBubbleComponent: React.FC<V4ImageBubbleProps> = ({
  imageUrl,
  caption,
  isMe,
}) => {
  const [lightboxVisible, setLightboxVisible] = useState(false);

  const openLightbox = () => {
    triggerHaptic();
    setLightboxVisible(true);
  };

  return (
    <>
      <Pressable
        style={[styles.container, isMe ? styles.containerMe : styles.containerOther]}
        onPress={openLightbox}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="View full image"
      >
        <View style={styles.imageWrapper}>
          <V4Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.zoomPill}>
            <ZoomIn size={12} color="#FFFFFF" />
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

      {/* Fullscreen Lightbox Modal */}
      <Modal
        visible={lightboxVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLightboxVisible(false)}
      >
        <View style={styles.lightboxBackdrop}>
          <View style={styles.lightboxHeader}>
            <Pressable
              style={styles.closeBtn}
              onPress={() => setLightboxVisible(false)}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close image preview"
            >
              <X size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.lightboxImageWrapper}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.lightboxImage}
              resizeMode="contain"
            />
          </View>

          {caption ? (
            <View style={styles.lightboxFooter}>
              <Text style={styles.lightboxCaption}>{caption}</Text>
            </View>
          ) : null}
        </View>
      </Modal>
    </>
  );
};

export const V4ImageBubble = memo(V4ImageBubbleComponent);

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
  imageWrapper: {
    width: 250,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  zoomPill: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(3, 27, 42, 0.7)',
    borderRadius: 12,
    padding: 6,
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
  lightboxBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.95)',
    justifyContent: 'space-between',
  },
  lightboxHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightboxImageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightboxImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.75,
  },
  lightboxFooter: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  lightboxCaption: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
