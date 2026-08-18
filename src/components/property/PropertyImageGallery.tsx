import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { ShieldCheck, Camera } from 'lucide-react-native';
import { PropertyImage } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GALLERY_HEIGHT = 290;

interface PropertyImageGalleryProps {
  images: PropertyImage[];
  isVerified?: boolean;
  onOpenViewer: (index: number) => void;
}

export const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
  images,
  isVerified = false,
  onOpenViewer,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index >= 0 && index < images.length) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item, index }) => (
          <Pressable
            style={styles.imagePressable}
            onPress={() => onOpenViewer(index)}
            accessibilityRole="button"
            accessibilityLabel={`View photo ${index + 1} of ${images.length}`}
          >
            <Image
              source={{ uri: item.url }}
              style={styles.image}
              resizeMode="cover"
            />
          </Pressable>
        )}
      />

      {/* Verified Badge */}
      {isVerified && (
        <View style={styles.verifiedBadge}>
          <ShieldCheck size={12} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      )}

      {/* Photo Count Indicator Pill */}
      <View style={styles.photoCountPill}>
        <Camera size={12} color="#FFFFFF" strokeWidth={2.2} />
        <Text style={styles.photoCountText}>
          {activeIndex + 1} / {images.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: GALLERY_HEIGHT,
    position: 'relative',
    backgroundColor: '#E8E5EC',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  imagePressable: {
    width: SCREEN_WIDTH,
    height: GALLERY_HEIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#32B768',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  photoCountPill: {
    position: 'absolute',
    bottom: 14,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(23, 21, 34, 0.78)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  photoCountText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
