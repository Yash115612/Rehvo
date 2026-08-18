import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  Camera,
  Plus,
  Trash2,
  Star,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { ListingHeader } from '../../../src/components/listing/ListingHeader';
import { ListingExitModal } from '../../../src/components/listing/ListingExitModal';
import { PropertyImage } from '../../../src/types';

const SAMPLE_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=80',
];

export default function ListingPhotosRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { listingDraft, updateListingDraft, resetListingDraft, showToast } =
    useAppStore();

  const [images, setImages] = useState<PropertyImage[]>(
    listingDraft.images && listingDraft.images.length > 0
      ? listingDraft.images
      : SAMPLE_FALLBACK_IMAGES.map((url, idx) => ({
          id: `img_${idx}`,
          url,
          is_cover: idx === 0,
          sort_order: idx,
        })),
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [exitModalVisible, setExitModalVisible] = useState(false);

  const handlePickImages = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Camera roll access is needed to upload property photos.',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newImages: PropertyImage[] = result.assets.map((asset, i) => ({
          id: `picked_${Date.now()}_${i}`,
          url: asset.uri,
          is_cover: images.length === 0 && i === 0,
          sort_order: images.length + i,
        }));

        const combined = [...images, ...newImages].slice(0, 20);
        setImages(combined);
        if (errorMsg) setErrorMsg('');
      }
    } catch (e) {
      console.warn('Error launching image library:', e);
    }
  };

  const handleSetCover = (id: string) => {
    const updated = images.map((img) => ({
      ...img,
      is_cover: img.id === id,
    }));
    setImages(updated);
  };

  const handleRemoveImage = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    if (filtered.length > 0 && !filtered.some((img) => img.is_cover)) {
      filtered[0].is_cover = true;
    }
    setImages(filtered);
  };

  const handleContinue = () => {
    if (images.length === 0) {
      setErrorMsg('Please add at least 1 property photo to continue');
      return;
    }

    updateListingDraft({ images });
    router.push('/(renter)/listing/description');
  };

  const handleSaveDraft = () => {
    updateListingDraft({ images });
    setExitModalVisible(false);
    showToast('Listing draft saved', 'success');
    router.replace('/(renter)/home');
  };

  const handleDiscard = () => {
    resetListingDraft();
    setExitModalVisible(false);
    router.replace('/(renter)/home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ListingHeader
        currentStep={7}
        totalSteps={10}
        onBack={() => router.back()}
        onClose={() => setExitModalVisible(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
      >
        <View style={styles.headingBlock}>
          <Text style={styles.titleText}>Add property photos</Text>
          <Text style={styles.subtitle}>
            Listings with 5+ bright photos receive 3x more renter enquiries.
          </Text>
        </View>

        {/* Tip Box */}
        <View style={styles.tipBox}>
          <Info size={16} color="#6C4DFF" strokeWidth={2.2} />
          <Text style={styles.tipText}>
            First photo will be your Cover Photo. Tap any photo to set as cover.
          </Text>
        </View>

        {/* Upload Button Box */}
        <Pressable
          style={styles.uploadBox}
          onPress={handlePickImages}
          accessibilityRole="button"
          accessibilityLabel="Add photos from camera roll"
        >
          <View style={styles.cameraCircle}>
            <Camera size={24} color="#6C4DFF" strokeWidth={2} />
          </View>
          <Text style={styles.uploadBoxTitle}>Upload photos</Text>
          <Text style={styles.uploadBoxSub}>
            Tap to select from library (Max 20 photos)
          </Text>
        </Pressable>

        {/* Photo Gallery Grid */}
        <View style={styles.galleryHeader}>
          <Text style={styles.galleryCount}>
            {images.length} photos added (Min 1, Recommended 5+)
          </Text>
        </View>

        <View style={styles.photoGrid}>
          {images.map((img, index) => (
            <View key={img.id} style={styles.photoCard}>
              <Image
                source={{ uri: img.url }}
                style={styles.photoThumb}
                resizeMode="cover"
              />

              {img.is_cover && (
                <View style={styles.coverBadge}>
                  <Star size={11} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.coverBadgeText}>Cover Photo</Text>
                </View>
              )}

              <View style={styles.photoOverlayActions}>
                {!img.is_cover && (
                  <Pressable
                    style={styles.setCoverBtn}
                    onPress={() => handleSetCover(img.id)}
                    hitSlop={6}
                  >
                    <Text style={styles.setCoverBtnText}>Make Cover</Text>
                  </Pressable>
                )}

                <Pressable
                  style={styles.deletePhotoBtn}
                  onPress={() => handleRemoveImage(img.id)}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityLabel="Delete photo"
                >
                  <Trash2 size={14} color="#FFFFFF" strokeWidth={2.2} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {Boolean(errorMsg) && (
          <Text style={styles.errorText}>{errorMsg}</Text>
        )}
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <Pressable
          style={styles.continueBtn}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to description"
        >
          <Text style={styles.continueBtnText}>Continue</Text>
          <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.2} />
        </Pressable>
      </View>

      {/* Exit Confirmation Modal */}
      <ListingExitModal
        visible={exitModalVisible}
        onSaveDraft={handleSaveDraft}
        onDiscard={handleDiscard}
        onCancel={() => setExitModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16,
  },
  headingBlock: {
    marginBottom: 2,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    color: '#777482',
    fontWeight: '500',
    marginTop: 4,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0ECFF',
    borderWidth: 1,
    borderColor: '#D4C8FF',
    borderRadius: 14,
    padding: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#171522',
    lineHeight: 17,
  },
  uploadBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#6C4DFF',
    borderRadius: 18,
    paddingVertical: 24,
    gap: 6,
  },
  cameraCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  uploadBoxTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171522',
  },
  uploadBoxSub: {
    fontSize: 12.5,
    color: '#777482',
    fontWeight: '500',
  },
  galleryHeader: {
    marginTop: 4,
  },
  galleryCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171522',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoCard: {
    width: '48%',
    aspectRatio: 1.25,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E8E5EC',
    position: 'relative',
  },
  photoThumb: {
    width: '100%',
    height: '100%',
  },
  coverBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(23, 21, 34, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  coverBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  photoOverlayActions: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setCoverBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  setCoverBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#171522',
  },
  deletePhotoBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(229, 72, 77, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  errorText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#E5484D',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E5EC',
  },
  continueBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
