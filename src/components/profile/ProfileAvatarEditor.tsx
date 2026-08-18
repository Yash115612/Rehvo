import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, Trash2, X, Check } from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';

interface ProfileAvatarEditorProps {
  uri?: string | null;
  name?: string;
  size?: number;
  editable?: boolean;
  onAvatarChange?: (newUri: string | null) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export const ProfileAvatarEditor: React.FC<ProfileAvatarEditorProps> = ({
  uri,
  name = 'User',
  size = 64,
  editable = true,
  onAvatarChange,
  containerStyle,
}) => {
  const { user, updateProfile, myFlatmateProfile, showToast } = useAppStore();

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [pickedImageUri, setPickedImageUri] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Derive display avatar and initials
  const currentAvatar = uri !== undefined ? uri : user?.avatar;
  const displayName = name || user?.name || 'User';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  const badgeSize = Math.max(22, Math.round(size * 0.36));
  const badgeIconSize = Math.max(12, Math.round(badgeSize * 0.52));

  // Request Permissions & Launch Camera
  const handleTakePhoto = async () => {
    setIsOptionsOpen(false);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Access Required',
          'REHVO needs camera access to take a profile photo. Please enable permissions in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setPickedImageUri(result.assets[0].uri);
        setIsPreviewOpen(true);
      }
    } catch (err) {
      console.warn('[ProfileAvatarEditor] Camera error:', err);
      showToast('Could not open camera', 'error');
    }
  };

  // Request Permissions & Launch Gallery
  const handleChooseFromGallery = async () => {
    setIsOptionsOpen(false);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Photo Library Access Required',
          'REHVO needs access to your photo library to select a profile photo. Please enable permissions in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setPickedImageUri(result.assets[0].uri);
        setIsPreviewOpen(true);
      }
    } catch (err) {
      console.warn('[ProfileAvatarEditor] Gallery error:', err);
      showToast('Could not open photo library', 'error');
    }
  };

  // Confirm and Save Uploaded Avatar
  const handleConfirmSave = async () => {
    if (!pickedImageUri) return;
    setIsUploading(true);

    try {
      // Simulate real storage persist delay for smooth UX transition
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update primary user profile in store & AsyncStorage
      updateProfile({ avatar: pickedImageUri });

      if (onAvatarChange) {
        onAvatarChange(pickedImageUri);
      }

      setIsPreviewOpen(false);
      setPickedImageUri(null);
      showToast('Profile photo updated successfully', 'success');
    } catch (err) {
      console.warn('[ProfileAvatarEditor] Save error:', err);
      showToast("Couldn't update profile photo. Please try again.", 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Remove Photo
  const handleRemovePhoto = () => {
    setIsOptionsOpen(false);
    Alert.alert(
      'Remove Profile Photo?',
      'Your profile will display your initials instead of a photo.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            updateProfile({ avatar: '' });
            if (onAvatarChange) {
              onAvatarChange(null);
            }
            showToast('Profile photo removed', 'info');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.root, containerStyle]}>
      {/* Avatar Container */}
      <Pressable
        onPress={() => editable && setIsOptionsOpen(true)}
        disabled={!editable}
        style={({ pressed }) => [
          styles.avatarContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          pressed && editable && styles.avatarPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Change profile photo"
      >
        {currentAvatar ? (
          <Image
            source={{ uri: currentAvatar }}
            style={[
              styles.avatarImage,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.placeholderContainer,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          >
            <Text
              style={[
                styles.initialsText,
                { fontSize: Math.max(14, Math.round(size * 0.36)) },
              ]}
            >
              {initials}
            </Text>
          </View>
        )}

        {/* Edit / Camera Badge */}
        {editable && (
          <View
            style={[
              styles.badge,
              {
                width: badgeSize,
                height: badgeSize,
                borderRadius: badgeSize / 2,
                bottom: -2,
                right: -2,
              },
            ]}
          >
            <Camera size={badgeIconSize} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        )}
      </Pressable>

      {/* 1. Action Sheet / Options Modal */}
      <Modal
        visible={isOptionsOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsOptionsOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsOptionsOpen(false)}
        >
          <View style={styles.sheetContent}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Profile Photo</Text>
            <Text style={styles.sheetSubtitle}>
              Update your photo across REHVO
            </Text>

            <View style={styles.optionsList}>
              {/* Option 1: Take Photo */}
              <Pressable
                style={({ pressed }) => [
                  styles.optionRow,
                  pressed && styles.optionRowPressed,
                ]}
                onPress={handleTakePhoto}
                accessibilityRole="button"
                accessibilityLabel="Take photo with camera"
              >
                <View style={[styles.optionIconCircle, { backgroundColor: '#F0ECFF' }]}>
                  <Camera size={18} color="#6C4DFF" strokeWidth={2.2} />
                </View>
                <Text style={styles.optionText}>Take Photo</Text>
              </Pressable>

              <View style={styles.optionDivider} />

              {/* Option 2: Choose from Gallery */}
              <Pressable
                style={({ pressed }) => [
                  styles.optionRow,
                  pressed && styles.optionRowPressed,
                ]}
                onPress={handleChooseFromGallery}
                accessibilityRole="button"
                accessibilityLabel="Choose from photo library"
              >
                <View style={[styles.optionIconCircle, { backgroundColor: '#E0F2FE' }]}>
                  <ImageIcon size={18} color="#0EA5E9" strokeWidth={2.2} />
                </View>
                <Text style={styles.optionText}>Choose from Gallery</Text>
              </Pressable>

              {/* Option 3: Remove Photo (if existing) */}
              {Boolean(currentAvatar) && (
                <>
                  <View style={styles.optionDivider} />
                  <Pressable
                    style={({ pressed }) => [
                      styles.optionRow,
                      pressed && styles.optionRowPressed,
                    ]}
                    onPress={handleRemovePhoto}
                    accessibilityRole="button"
                    accessibilityLabel="Remove profile photo"
                  >
                    <View style={[styles.optionIconCircle, { backgroundColor: '#FEE2E2' }]}>
                      <Trash2 size={18} color="#E5484D" strokeWidth={2.2} />
                    </View>
                    <Text style={[styles.optionText, { color: '#E5484D' }]}>
                      Remove Photo
                    </Text>
                  </Pressable>
                </>
              )}
            </View>

            {/* Cancel Button */}
            <Pressable
              style={styles.cancelBtn}
              onPress={() => setIsOptionsOpen(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* 2. Image Preview Modal */}
      <Modal
        visible={isPreviewOpen}
        animationType="slide"
        transparent
        onRequestClose={() => !isUploading && setIsPreviewOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.previewSheet}>
            {/* Header */}
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Preview Profile Photo</Text>
              {!isUploading && (
                <Pressable
                  onPress={() => setIsPreviewOpen(false)}
                  hitSlop={8}
                  style={styles.closeBtn}
                >
                  <X size={20} color="#171522" strokeWidth={2} />
                </Pressable>
              )}
            </View>

            {/* Preview Image */}
            <View style={styles.previewCenterContainer}>
              {pickedImageUri ? (
                <Image
                  source={{ uri: pickedImageUri }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              ) : null}
              {isUploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color="#6C4DFF" />
                  <Text style={styles.uploadingText}>Saving photo...</Text>
                </View>
              )}
            </View>

            <Text style={styles.previewHelperText}>
              Your photo will be visible to owners, roommates, and connections.
            </Text>

            {/* Actions */}
            <View style={styles.previewBtnRow}>
              <Pressable
                style={[styles.previewSecondaryBtn, isUploading && styles.btnDisabled]}
                onPress={() => setIsPreviewOpen(false)}
                disabled={isUploading}
              >
                <Text style={styles.previewSecondaryBtnText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.previewPrimaryBtn, isUploading && styles.btnDisabled]}
                onPress={handleConfirmSave}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.previewPrimaryBtnText}>Use Photo</Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'relative',
  },
  avatarContainer: {
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#6C4DFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatarPressed: {
    opacity: 0.88,
  },
  avatarImage: {
    backgroundColor: '#F0ECFF',
  },
  placeholderContainer: {
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  badge: {
    position: 'absolute',
    backgroundColor: '#6C4DFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 21, 34, 0.48)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    gap: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E8E5EC',
    alignSelf: 'center',
    marginBottom: 4,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
    textAlign: 'center',
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#777482',
    textAlign: 'center',
    marginTop: -6,
    marginBottom: 6,
  },
  optionsList: {
    backgroundColor: '#F8F7F4',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
    minHeight: 52,
  },
  optionRowPressed: {
    backgroundColor: '#F0EEEA',
  },
  optionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171522',
  },
  optionDivider: {
    height: 0.5,
    backgroundColor: '#E8E5EC',
    marginLeft: 66,
  },
  cancelBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F0EEEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171522',
  },
  previewSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    gap: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCenterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    position: 'relative',
  },
  previewImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#6C4DFF',
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  previewHelperText: {
    fontSize: 13,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 18,
  },
  previewBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  previewSecondaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewSecondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  previewPrimaryBtn: {
    flex: 1.4,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  previewPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
