/**
 * V4ImageCropper — Precision aspect ratio and rotation editor
 * Supports 1:1, 4:3, and 16:9 aspect ratios, 90-degree rotations,
 * and high-fidelity preview frames.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
} from 'react-native';
import { X, Check, RotateCw, Crop, Square, RectangleHorizontal } from 'lucide-react-native';
import { V4_COLORS } from '../../../theme/v4Theme';

export type AspectRatioType = '1:1' | '4:3' | '16:9';

interface V4ImageCropperProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
  onCropComplete: (croppedUri: string, ratio: AspectRatioType, rotation: number) => void;
  initialRatio?: AspectRatioType;
}

export const V4ImageCropper: React.FC<V4ImageCropperProps> = React.memo(({
  visible,
  imageUri,
  onClose,
  onCropComplete,
  initialRatio = '4:3',
}) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(initialRatio);
  const [rotation, setRotation] = useState<number>(0);

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleDone = useCallback(() => {
    if (!imageUri) return;
    onCropComplete(imageUri, aspectRatio, rotation);
    onClose();
  }, [aspectRatio, imageUri, onClose, onCropComplete, rotation]);

  if (!imageUri) return null;

  const getAspectRatioStyle = () => {
    switch (aspectRatio) {
      case '1:1':
        return { aspectRatio: 1 };
      case '16:9':
        return { aspectRatio: 16 / 9 };
      case '4:3':
      default:
        return { aspectRatio: 4 / 3 };
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Cancel Crop"
          >
            <X size={24} color={V4_COLORS.textWhite} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Crop & Rotate</Text>

          <TouchableOpacity
            style={styles.doneBtn}
            onPress={handleDone}
            accessibilityLabel="Apply Crop"
          >
            <Check size={18} color={V4_COLORS.emeraldDark} />
            <Text style={styles.doneBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Center Viewport Frame */}
        <View style={styles.viewport}>
          <View style={[styles.cropFrame, getAspectRatioStyle()]}>
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.previewImage,
                { transform: [{ rotate: `${rotation}deg` }] },
              ]}
              resizeMode="contain"
            />
            {/* Rule of Thirds Guide Lines */}
            <View style={styles.cropGrid} pointerEvents="none">
              <View style={[styles.gridH, { top: '33%' }]} />
              <View style={[styles.gridH, { top: '66%' }]} />
              <View style={[styles.gridV, { left: '33%' }]} />
              <View style={[styles.gridV, { left: '66%' }]} />
            </View>
          </View>
        </View>

        {/* Toolbar Controls */}
        <View style={styles.footerToolbar}>
          {/* Rotate Button */}
          <TouchableOpacity
            style={styles.toolBtn}
            onPress={handleRotate}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Rotate 90 degrees"
          >
            <RotateCw size={22} color={V4_COLORS.textWhite} />
            <Text style={styles.toolBtnLabel}>Rotate ({rotation}°)</Text>
          </TouchableOpacity>

          {/* Aspect Ratio Options */}
          <View style={styles.ratioGroup}>
            <TouchableOpacity
              style={[styles.ratioPill, aspectRatio === '1:1' && styles.ratioPillActive]}
              onPress={() => setAspectRatio('1:1')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="1 to 1 square aspect ratio"
            >
              <Square size={16} color={aspectRatio === '1:1' ? '#FFFFFF' : '#94A3B8'} />
              <Text style={[styles.ratioText, aspectRatio === '1:1' && styles.ratioTextActive]}>
                1:1
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratioPill, aspectRatio === '4:3' && styles.ratioPillActive]}
              onPress={() => setAspectRatio('4:3')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="4 to 3 standard aspect ratio"
            >
              <Crop size={16} color={aspectRatio === '4:3' ? '#FFFFFF' : '#94A3B8'} />
              <Text style={[styles.ratioText, aspectRatio === '4:3' && styles.ratioTextActive]}>
                4:3
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratioPill, aspectRatio === '16:9' && styles.ratioPillActive]}
              onPress={() => setAspectRatio('16:9')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="16 to 9 widescreen hero aspect ratio"
            >
              <RectangleHorizontal size={16} color={aspectRatio === '16:9' ? '#FFFFFF' : '#94A3B8'} />
              <Text style={[styles.ratioText, aspectRatio === '16:9' && styles.ratioTextActive]}>
                16:9
              </Text>
            </TouchableOpacity>
          </View>
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
  headerBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: V4_COLORS.textWhite,
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: V4_COLORS.primaryLight,
    gap: 6,
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.emeraldDark,
  },
  viewport: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  cropFrame: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: V4_COLORS.primary,
    backgroundColor: '#000000',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  cropGrid: {
    ...StyleSheet.absoluteFillObject,
  },
  gridH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  gridV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  footerToolbar: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#0A121D',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  toolBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  toolBtnLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 4,
  },
  ratioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 22,
    padding: 4,
    gap: 4,
  },
  ratioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 18,
    gap: 6,
  },
  ratioPillActive: {
    backgroundColor: V4_COLORS.primary,
  },
  ratioText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  ratioTextActive: {
    color: '#FFFFFF',
  },
});
