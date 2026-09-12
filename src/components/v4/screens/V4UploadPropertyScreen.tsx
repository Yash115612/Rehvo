import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle2,
  Video,
  FileText,
  Sparkles,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { V4CameraModal } from '../camera/V4CameraModal';
import { MediaCaptureResult } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';

const INITIAL_PHOTOS: string[] = [];

export const V4UploadPropertyScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { propertyDraft, savePropertyDraft, activeMode } = useAppStore();

  const [photos, setPhotos] = useState<string[]>(
    propertyDraft?.photos && propertyDraft.photos.length > 0
      ? propertyDraft.photos
      : INITIAL_PHOTOS
  );
  const [coverIndex, setCoverIndex] = useState<number>(propertyDraft?.coverIndex ?? 0);
  const [floorPlanUri, setFloorPlanUri] = useState<string>(propertyDraft?.floorPlanUri || '');
  const [virtualTourUri, setVirtualTourUri] = useState<string>(propertyDraft?.virtualTourUri || '');
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const handlePickFromGallery = async () => {
    setPickerModalVisible(false);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant access to your photo library in settings to upload property photos.'
        );
        return;
      }

      setLoadingMedia(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: Math.max(1, 10 - photos.length),
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newUris = result.assets.map((a) => a.uri).filter(Boolean);
        const updated = [...photos, ...newUris].slice(0, 10);
        setPhotos(updated);
        savePropertyDraft({ photos: updated, coverIndex, floorPlanUri, virtualTourUri });
      }
    } catch {
      Alert.alert('Upload Error', 'Could not open photo gallery. Please try again.');
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleTakeWithCamera = async () => {
    setPickerModalVisible(false);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please allow REHVO to use your camera to capture property photos.'
        );
        return;
      }

      setLoadingMedia(true);
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (uri) {
          const updated = [...photos, uri].slice(0, 10);
          setPhotos(updated);
          savePropertyDraft({ photos: updated, coverIndex, floorPlanUri, virtualTourUri });
        }
      }
    } catch {
      Alert.alert('Camera Error', 'Could not capture photo. Please try again.');
    } finally {
      setLoadingMedia(false);
    }
  };

  const handlePickFloorPlan = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to upload a 2D floor plan.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (uri) {
          setFloorPlanUri(uri);
          savePropertyDraft({ floorPlanUri: uri });
        }
      }
    } catch (e) {
      Alert.alert('Upload Error', 'Could not select floor plan image. Please try again.');
    }
  };

  const handleRemoveFloorPlan = () => {
    setFloorPlanUri('');
    savePropertyDraft({ floorPlanUri: undefined });
  };

  const handlePickVideoTour = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your media library to upload a walkthrough video.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (uri) {
          setVirtualTourUri(uri);
          savePropertyDraft({ virtualTourUri: uri });
        }
      }
    } catch (e) {
      Alert.alert('Upload Error', 'Could not select video. Please try again.');
    }
  };

  const handleRemoveVideoTour = () => {
    setVirtualTourUri('');
    savePropertyDraft({ virtualTourUri: undefined });
  };

  const handleMovePhoto = (idx: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= photos.length) return;
    const updated = [...photos];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    let nextCover = coverIndex;
    if (coverIndex === idx) nextCover = targetIdx;
    else if (coverIndex === targetIdx) nextCover = idx;

    setPhotos(updated);
    setCoverIndex(nextCover);
    savePropertyDraft({ photos: updated, coverIndex: nextCover, floorPlanUri, virtualTourUri });
  };

  const handleOpenPicker = () => {
    if (photos.length >= 10) {
      Alert.alert('Maximum Photos Reached', 'You can upload up to 10 photos per property.');
      return;
    }
    setPickerModalVisible(true);
  };

  const handleRemovePhoto = (idx: number) => {
    const updated = photos.filter((_, i) => i !== idx);
    const nextCover = coverIndex >= updated.length ? Math.max(0, updated.length - 1) : coverIndex;
    setPhotos(updated);
    setCoverIndex(nextCover);
    savePropertyDraft({ photos: updated, coverIndex: nextCover, floorPlanUri, virtualTourUri });
  };

  const handleSetCover = (idx: number) => {
    setCoverIndex(idx);
    savePropertyDraft({ photos, coverIndex: idx, floorPlanUri, virtualTourUri });
  };

  const handleNext = () => {
    if (photos.length === 0) {
      Alert.alert('Photo Required', 'Please upload at least 1 photo for your property listing.');
      return;
    }
    savePropertyDraft({ photos, coverIndex, floorPlanUri, virtualTourUri });
    const prefix = activeMode === 'owner' ? '/(owner)' : '/(renter)';
    router.push(`${prefix}/listing/preview` as any);
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            savePropertyDraft({ photos, coverIndex, floorPlanUri, virtualTourUri });
            router.back();
          }}
        >
          <ArrowLeft size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Upload Photos & Media</Text>
          <Text style={styles.headerSubtitle}>Step 2 of 3: Property Visuals</Text>
        </View>
        <View style={{ width: 38 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: '66%' }]} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Quality Banner */}
        <View style={styles.tipCard}>
          <Sparkles size={16} color="#0F766E" strokeWidth={2.4} />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.tipTitle}>Listings with 4+ Photos get 4x more tenant visits</Text>
            <Text style={styles.tipDesc}>
              Upload crisp, bright photos of Living Room, Bedrooms, Kitchen and Balcony.
            </Text>
          </View>
        </View>

        {/* Photos Grid */}
        <Text style={styles.sectionHeading}>UPLOADED PHOTOS ({photos.length}/10)</Text>
        <View style={styles.photosGrid}>
          {photos.map((uri, idx) => {
            const isCover = idx === coverIndex;
            return (
              <View key={idx} style={styles.photoItem}>
                <Image source={{ uri }} style={styles.photoImg} />

                {isCover && (
                  <View style={styles.coverPill}>
                    <Star size={10} color="#FFFFFF" strokeWidth={3} />
                    <Text style={styles.coverPillText}>COVER</Text>
                  </View>
                )}

                {/* Reorder Buttons Top Right */}
                <View style={styles.reorderControls}>
                  {idx > 0 && (
                    <Pressable
                      style={styles.reorderBtn}
                      onPress={() => handleMovePhoto(idx, 'left')}
                    >
                      <ChevronLeft size={12} color="#FFFFFF" strokeWidth={2.6} />
                    </Pressable>
                  )}
                  {idx < photos.length - 1 && (
                    <Pressable
                      style={styles.reorderBtn}
                      onPress={() => handleMovePhoto(idx, 'right')}
                    >
                      <ChevronRight size={12} color="#FFFFFF" strokeWidth={2.6} />
                    </Pressable>
                  )}
                </View>

                <View style={styles.photoActions}>
                  {!isCover && (
                    <Pressable style={styles.makeCoverBtn} onPress={() => handleSetCover(idx)}>
                      <Text style={styles.makeCoverText}>Set Cover</Text>
                    </Pressable>
                  )}
                  <Pressable style={styles.deletePhotoBtn} onPress={() => handleRemovePhoto(idx)}>
                    <Trash2 size={12} color="#DC2626" strokeWidth={2.5} />
                  </Pressable>
                </View>
              </View>
            );
          })}

          {/* Add More Box */}
          {photos.length < 10 && (
            <Pressable style={styles.addPhotoCard} onPress={handleOpenPicker}>
              {loadingMedia ? (
                <ActivityIndicator color={V4_COLORS.primary} size="small" />
              ) : (
                <>
                  <View style={styles.addPhotoCircle}>
                    <Plus size={20} color={V4_COLORS.primary} strokeWidth={2.6} />
                  </View>
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                  <Text style={styles.addPhotoSub}>Camera / Gallery</Text>
                </>
              )}
            </Pressable>
          )}
        </View>

        {/* Floor Plan Section */}
        <Text style={styles.sectionHeading}>FLOOR PLAN & 2D ARCHITECTURAL MAP</Text>
        {floorPlanUri ? (
          <View style={styles.uploadedExtraCard}>
            <Image source={{ uri: floorPlanUri }} style={styles.extraThumb} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.attachedBadge}>
                <CheckCircle2 size={12} color="#0F766E" />
                <Text style={styles.attachedBadgeText}>Floor Plan Attached</Text>
              </View>
              <Text style={styles.extraTitle} numberOfLines={1}>Architectural Layout</Text>
              <Text style={styles.extraDesc}>Visible to tenants on listing details</Text>
            </View>
            <Pressable style={styles.removeExtraBtn} onPress={handleRemoveFloorPlan}>
              <Trash2 size={16} color="#DC2626" />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.extraUploadCard} onPress={handlePickFloorPlan}>
            <View style={[styles.extraIconBox, { backgroundColor: '#E0F2FE' }]}>
              <FileText size={20} color="#0284C7" strokeWidth={2.4} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.extraTitle}>Upload Floor Plan / 2D Map</Text>
              <Text style={styles.extraDesc}>Help tenants understand room dimensions and layout.</Text>
            </View>
            <Text style={styles.extraUploadLink}>+ Add</Text>
          </Pressable>
        )}

        {/* Video Walkthrough Section */}
        <Text style={styles.sectionHeading}>VIDEO TOUR & 3D WALKTHROUGH (OPTIONAL)</Text>
        {virtualTourUri ? (
          <View style={styles.uploadedExtraCard}>
            <View style={[styles.extraIconBox, { backgroundColor: '#F3E8FF', width: 54, height: 54 }]}>
              <Video size={24} color="#8B5CF6" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.attachedBadge}>
                <CheckCircle2 size={12} color="#0F766E" />
                <Text style={styles.attachedBadgeText}>Video Tour Attached</Text>
              </View>
              <Text style={styles.extraTitle}>Video Walkthrough</Text>
              <Text style={styles.extraDesc}>30-second tour attached to listing</Text>
            </View>
            <Pressable style={styles.removeExtraBtn} onPress={handleRemoveVideoTour}>
              <Trash2 size={16} color="#DC2626" />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.extraUploadCard} onPress={handlePickVideoTour}>
            <View style={[styles.extraIconBox, { backgroundColor: '#F3E8FF' }]}>
              <Video size={20} color="#8B5CF6" strokeWidth={2.4} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.extraTitle}>Add Video Walkthrough</Text>
              <Text style={styles.extraDesc}>Tenants prefer properties with real video tours.</Text>
            </View>
            <Text style={styles.extraUploadLink}>+ Add</Text>
          </Pressable>
        )}

        {/* Continue Button */}
        <V4Button
          title="Review & Preview Listing →"
          variant="primary"
          size="lg"
          onPress={handleNext}
          style={styles.nextBtn}
        />
      </ScrollView>

      {/* Photo Source Modal */}
      <Modal
        visible={pickerModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setPickerModalVisible(false)}
        >
          <Pressable style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 16) + 10 }]} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Property Photos</Text>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setPickerModalVisible(false)}
              >
                <X size={18} color="#64748B" />
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              Select photos showing the living room, bedrooms, kitchen, and bathroom.
            </Text>

            <View style={styles.modalOptions}>
              <Pressable
                style={styles.modalOptionCard}
                onPress={() => {
                  setPickerModalVisible(false);
                  setCameraModalVisible(true);
                }}
              >
                <View style={[styles.modalOptionIcon, { backgroundColor: '#E6FFFA' }]}>
                  <Camera size={22} color="#0F766E" strokeWidth={2.4} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalOptionTitle}>Take Photo</Text>
                  <Text style={styles.modalOptionDesc}>Multi-shot luxury camera with room tags</Text>
                </View>
              </Pressable>

              <Pressable
                style={styles.modalOptionCard}
                onPress={handlePickFromGallery}
              >
                <View style={[styles.modalOptionIcon, { backgroundColor: '#EEF2FF' }]}>
                  <ImageIcon size={22} color="#6366F1" strokeWidth={2.4} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalOptionTitle}>Choose from Gallery</Text>
                  <Text style={styles.modalOptionDesc}>Select up to {10 - photos.length} photos from your library</Text>
                </View>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Flagship V7.1 Luxury Camera Viewfinder Modal */}
      <V4CameraModal
        visible={cameraModalVisible}
        onClose={() => setCameraModalVisible(false)}
        onCaptureComplete={(captured: MediaCaptureResult[]) => {
          if (captured.length > 0) {
            const newUris = captured.map((c) => c.uri);
            const updated = [...photos, ...newUris].slice(0, 15);
            setPhotos(updated);
            savePropertyDraft({ photos: updated, coverIndex, floorPlanUri, virtualTourUri });
          }
        }}
        maxItems={15 - photos.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E6EEF0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: V4_COLORS.primary,
    marginTop: 2,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#E2ECEF',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: V4_COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FFFA',
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  tipDesc: {
    fontSize: 11,
    color: '#115E59',
    marginTop: 2,
    lineHeight: 16,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  photoItem: {
    width: '48%',
    height: 140,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  coverPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#0F766E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  coverPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 3,
    letterSpacing: 0.5,
  },
  photoActions: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  makeCoverBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  makeCoverText: {
    fontSize: 10,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  deletePhotoBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 5,
    borderRadius: 8,
  },
  addPhotoCard: {
    width: '48%',
    height: 140,
    borderRadius: 18,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6FFFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  addPhotoText: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  addPhotoSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  reorderControls: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
  },
  reorderBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadedExtraCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    ...V4_SHADOWS.soft,
  },
  extraThumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  attachedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6FFFA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  attachedBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  removeExtraBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
  },
  extraUploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2ECEF',
    ...V4_SHADOWS.soft,
  },
  extraIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  extraDesc: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  extraUploadLink: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.primary,
    paddingHorizontal: 8,
  },
  nextBtn: {
    marginTop: 16,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalSubtitle: {
    fontSize: 12.5,
    color: V4_COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
  },
  modalOptions: {
    gap: 12,
  },
  modalOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  modalOptionIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginBottom: 2,
  },
  modalOptionDesc: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
  },
});
