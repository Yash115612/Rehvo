/**
 * V4CameraModal — Airbnb-style luxury camera modal
 * Multi-shot viewfinder, flash control, photo/video switch, filmstrip preview,
 * category tagging, and photo management.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import {
  X,
  Camera as CameraIcon,
  RefreshCw,
  Zap,
  ZapOff,
  Check,
  Image as ImageIcon,
  Grid,
  Video,
  Trash2,
} from 'lucide-react-native';
import { V4_COLORS } from '../../../theme/v4Theme';
import {
  takePhoto,
  recordVideo,
  pickMultipleImages,
} from '../../../services/cameraService';
import { MediaCaptureResult, PropertyMediaCategory } from '../../../types';

interface V4CameraModalProps {
  visible: boolean;
  onClose: () => void;
  onCaptureComplete: (mediaItems: MediaCaptureResult[]) => void;
  title?: string;
  initialCategory?: PropertyMediaCategory;
  maxItems?: number;
  allowVideo?: boolean;
}

const CATEGORIES: { label: string; value: PropertyMediaCategory }[] = [
  { label: 'Living Room', value: 'living_room' },
  { label: 'Bedroom', value: 'master_bedroom' },
  { label: 'Kitchen', value: 'kitchen' },
  { label: 'Bathroom', value: 'bathroom' },
  { label: 'Balcony', value: 'balcony' },
  { label: 'Exterior', value: 'exterior' },
  { label: 'Amenities', value: 'amenity' },
  { label: 'Floorplan', value: 'floorplan' },
];

export const V4CameraModal: React.FC<V4CameraModalProps> = React.memo(({
  visible,
  onClose,
  onCaptureComplete,
  title = 'Capture Property Photos',
  initialCategory = 'living_room',
  maxItems = 15,
  allowVideo = true,
}) => {
  const [capturedMedia, setCapturedMedia] = useState<MediaCaptureResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PropertyMediaCategory>(initialCategory);
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [flashOn, setFlashOn] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleTakePhoto = useCallback(async () => {
    if (capturedMedia.length >= maxItems) return;
    setIsCapturing(true);

    try {
      if (mode === 'photo') {
        const photo = await takePhoto({
          quality: 0.9,
          category: selectedCategory,
        });
        if (photo) {
          setCapturedMedia((prev) => [...prev, photo]);
        }
      } else {
        const video = await recordVideo({ maxDurationSeconds: 60 });
        if (video) {
          setCapturedMedia((prev) => [...prev, video]);
        }
      }
    } finally {
      setIsCapturing(false);
    }
  }, [capturedMedia.length, maxItems, mode, selectedCategory]);

  const handlePickFromGallery = useCallback(async () => {
    const remaining = maxItems - capturedMedia.length;
    if (remaining <= 0) return;

    const picked = await pickMultipleImages({
      maxImages: remaining,
      quality: 0.9,
      category: selectedCategory,
    });

    if (picked.length > 0) {
      setCapturedMedia((prev) => [...prev, ...picked]);
    }
  }, [capturedMedia.length, maxItems, selectedCategory]);

  const handleRemoveItem = useCallback((index: number) => {
    setCapturedMedia((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDone = useCallback(() => {
    onCaptureComplete(capturedMedia);
    setCapturedMedia([]);
    onClose();
  }, [capturedMedia, onCaptureComplete, onClose]);

  const handleClose = useCallback(() => {
    setCapturedMedia([]);
    onClose();
  }, [onClose]);

  const toggleFlash = useCallback(() => {
    setFlashOn((prev) => !prev);
  }, []);

  const toggleGrid = useCallback(() => {
    setGridVisible((prev) => !prev);
  }, []);

  const countBadge = useMemo(() => {
    return `${capturedMedia.length} / ${maxItems}`;
  }, [capturedMedia.length, maxItems]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Close Camera"
          >
            <X size={24} color={V4_COLORS.textWhite} />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
            <Text style={styles.headerSub}>{countBadge} photos added</Text>
          </View>

          <TouchableOpacity
            style={[styles.donePill, capturedMedia.length > 0 ? styles.donePillActive : styles.donePillDisabled]}
            onPress={handleDone}
            disabled={capturedMedia.length === 0}
            accessibilityLabel="Confirm photos"
          >
            <Check size={16} color={capturedMedia.length > 0 ? V4_COLORS.emeraldDark : '#94A3B8'} />
            <Text style={[styles.doneText, capturedMedia.length > 0 ? styles.doneTextActive : styles.doneTextDisabled]}>
              Done ({capturedMedia.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Viewfinder Canvas Area */}
        <View style={styles.viewfinder}>
          {/* Rule of Thirds Grid Overlay */}
          {gridVisible && (
            <View style={styles.gridOverlay} pointerEvents="none">
              <View style={[styles.gridLineH, { top: '33.3%' }]} />
              <View style={[styles.gridLineH, { top: '66.6%' }]} />
              <View style={[styles.gridLineV, { left: '33.3%' }]} />
              <View style={[styles.gridLineV, { left: '66.6%' }]} />
            </View>
          )}

          {/* Viewfinder Quick Controls Overlay */}
          <View style={styles.viewfinderControls}>
            <TouchableOpacity
              style={styles.quickToolBtn}
              onPress={toggleFlash}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Toggle flash"
            >
              {flashOn ? (
                <Zap size={20} color="#FBBF24" />
              ) : (
                <ZapOff size={20} color={V4_COLORS.textWhite} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickToolBtn}
              onPress={toggleGrid}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Toggle grid"
            >
              <Grid size={20} color={gridVisible ? V4_COLORS.primaryLight : V4_COLORS.textWhite} />
            </TouchableOpacity>
          </View>

          {/* Viewfinder Center Icon Guide */}
          <View style={styles.viewfinderCenter}>
            <CameraIcon size={48} color="rgba(255, 255, 255, 0.4)" />
            <Text style={styles.viewfinderTip}>
              {mode === 'photo'
                ? 'Tap shutter below to capture crisp photo'
                : 'Tap red record button for smooth video walkthrough'}
            </Text>
          </View>

          {/* Category Chip Selector */}
          <View style={styles.categoryBarWrap}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.value;
                return (
                  <TouchableOpacity
                    key={cat.value}
                    style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                    onPress={() => setSelectedCategory(cat.value)}
                    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                  >
                    <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* Filmstrip Strip */}
        {capturedMedia.length > 0 && (
          <View style={styles.filmstripContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filmstripScroll}
            >
              {capturedMedia.map((item, index) => (
                <View key={`${item.uri}_${index}`} style={styles.thumbWrapper}>
                  <Image source={{ uri: item.uri }} style={styles.thumbImage} />
                  <View style={styles.thumbIndexBadge}>
                    <Text style={styles.thumbIndexText}>{index + 1}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.thumbDeleteBtn}
                    onPress={() => handleRemoveItem(index)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityLabel={`Delete photo ${index + 1}`}
                  >
                    <Trash2 size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Shutter & Capture Controls */}
        <View style={styles.controlBar}>
          {/* Gallery Button */}
          <TouchableOpacity
            style={styles.sideControlBtn}
            onPress={handlePickFromGallery}
            accessibilityLabel="Pick photos from gallery"
          >
            <ImageIcon size={24} color={V4_COLORS.textWhite} />
            <Text style={styles.sideControlText}>Gallery</Text>
          </TouchableOpacity>

          {/* Shutter Button */}
          <TouchableOpacity
            style={[
              styles.shutterOuter,
              mode === 'video' && styles.shutterOuterVideo,
              isCapturing && styles.shutterDisabled,
            ]}
            onPress={handleTakePhoto}
            disabled={isCapturing || capturedMedia.length >= maxItems}
            accessibilityLabel={mode === 'photo' ? 'Take Photo' : 'Record Video'}
          >
            <View
              style={[
                styles.shutterInner,
                mode === 'video' && styles.shutterInnerVideo,
              ]}
            />
          </TouchableOpacity>

          {/* Mode Switcher (Photo / Video) */}
          {allowVideo ? (
            <TouchableOpacity
              style={styles.sideControlBtn}
              onPress={() => setMode((m) => (m === 'photo' ? 'video' : 'photo'))}
              accessibilityLabel={`Switch to ${mode === 'photo' ? 'video' : 'photo'} mode`}
            >
              {mode === 'photo' ? (
                <Video size={24} color={V4_COLORS.textWhite} />
              ) : (
                <CameraIcon size={24} color={V4_COLORS.textWhite} />
              )}
              <Text style={styles.sideControlText}>
                {mode === 'photo' ? 'Video' : 'Photo'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.sideControlPlaceholder} />
          )}
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060B11',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: Platform.OS === 'ios' ? 44 : 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: V4_COLORS.textWhite,
  },
  headerSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  donePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    minHeight: 44,
    borderRadius: 22,
    gap: 6,
  },
  donePillActive: {
    backgroundColor: V4_COLORS.primaryLight,
  },
  donePillDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  doneText: {
    fontSize: 14,
    fontWeight: '700',
  },
  doneTextActive: {
    color: V4_COLORS.emeraldDark,
  },
  doneTextDisabled: {
    color: '#94A3B8',
  },
  viewfinder: {
    flex: 1,
    margin: 16,
    borderRadius: 24,
    backgroundColor: '#0C131D',
    overflow: 'hidden',
    justifyContent: 'space-between',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  viewfinderControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 16,
    zIndex: 10,
  },
  quickToolBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  viewfinderTip: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.65)',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
  },
  categoryBarWrap: {
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  categoryScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryChip: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: V4_COLORS.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  filmstripContainer: {
    height: 90,
    paddingVertical: 8,
    backgroundColor: '#060B11',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  filmstripScroll: {
    paddingHorizontal: 16,
    gap: 10,
    alignItems: 'center',
  },
  thumbWrapper: {
    width: 68,
    height: 68,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: V4_COLORS.primary,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbIndexBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  thumbIndexText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  thumbDeleteBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBar: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    backgroundColor: '#060B11',
    marginBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  sideControlBtn: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  sideControlText: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
    marginTop: 4,
  },
  sideControlPlaceholder: {
    width: 56,
    height: 56,
  },
  shutterOuter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuterVideo: {
    borderColor: '#DC2626',
  },
  shutterDisabled: {
    opacity: 0.5,
  },
  shutterInner: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
  },
  shutterInnerVideo: {
    backgroundColor: '#DC2626',
  },
});
