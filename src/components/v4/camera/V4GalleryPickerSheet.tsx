/**
 * V4GalleryPickerSheet — Emerald luxury multi-select gallery picker sheet
 * Interactive media selection grid, category tagging, and batch import.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import { X, Check, Plus, Image as ImageIcon } from 'lucide-react-native';
import { V4_COLORS } from '../../../theme/v4Theme';
import { pickMultipleImages } from '../../../services/cameraService';
import { MediaCaptureResult, PropertyMediaCategory } from '../../../types';

interface V4GalleryPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedItems: MediaCaptureResult[]) => void;
  maxSelection?: number;
  initialCategory?: PropertyMediaCategory;
}

export const V4GalleryPickerSheet: React.FC<V4GalleryPickerSheetProps> = React.memo(({
  visible,
  onClose,
  onConfirm,
  maxSelection = 10,
  initialCategory = 'living_room',
}) => {
  const [items, setItems] = useState<MediaCaptureResult[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const handleOpenSystemPicker = useCallback(async () => {
    const picked = await pickMultipleImages({
      maxImages: maxSelection,
      quality: 0.9,
      category: initialCategory,
    });

    if (picked.length > 0) {
      setItems((prev) => [...prev, ...picked]);
      // Auto-select picked items
      const startIndex = items.length;
      const newIndices = picked.map((_, i) => startIndex + i);
      setSelectedIndices((prev) => [...prev, ...newIndices].slice(0, maxSelection));
    }
  }, [initialCategory, items.length, maxSelection]);

  const toggleSelectIndex = useCallback((index: number) => {
    setSelectedIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }
      if (prev.length >= maxSelection) {
        return prev;
      }
      return [...prev, index];
    });
  }, [maxSelection]);

  const handleConfirm = useCallback(() => {
    const selected = selectedIndices.map((i) => items[i]).filter(Boolean);
    onConfirm(selected);
    setItems([]);
    setSelectedIndices([]);
    onClose();
  }, [items, onClose, onConfirm, selectedIndices]);

  const handleClose = useCallback(() => {
    setItems([]);
    setSelectedIndices([]);
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          {/* Sheet Handle */}
          <View style={styles.handleBarWrap}>
            <View style={styles.handleBar} />
          </View>

          {/* Sheet Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Close gallery picker"
            >
              <X size={22} color={V4_COLORS.textPrimary} />
            </TouchableOpacity>

            <View style={styles.titleWrap}>
              <Text style={styles.title}>Select Photos</Text>
              <Text style={styles.subtitle}>
                {selectedIndices.length} of {maxSelection} chosen
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.confirmBtn,
                selectedIndices.length > 0 ? styles.confirmBtnActive : styles.confirmBtnDisabled,
              ]}
              onPress={handleConfirm}
              disabled={selectedIndices.length === 0}
              accessibilityLabel="Confirm selection"
            >
              <Check size={16} color={selectedIndices.length > 0 ? '#FFFFFF' : '#94A3B8'} />
              <Text
                style={[
                  styles.confirmText,
                  selectedIndices.length > 0 ? styles.confirmTextActive : styles.confirmTextDisabled,
                ]}
              >
                Add ({selectedIndices.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Trigger Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.importLibraryBtn}
              onPress={handleOpenSystemPicker}
              accessibilityLabel="Browse device photo library"
            >
              <Plus size={18} color={V4_COLORS.primary} />
              <Text style={styles.importLibraryText}>Browse Device Library</Text>
            </TouchableOpacity>
          </View>

          {/* Photos Grid */}
          {items.length === 0 ? (
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIconCircle}>
                <ImageIcon size={36} color={V4_COLORS.primary} />
              </View>
              <Text style={styles.emptyTitle}>No Photos Selected Yet</Text>
              <Text style={styles.emptyDesc}>
                Tap &ldquo;Browse Device Library&rdquo; to pick high-res photos for your listing or profile.
              </Text>
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item, index) => `${item.uri}_${index}`}
              numColumns={3}
              contentContainerStyle={styles.gridContainer}
              renderItem={({ item, index }) => {
                const isSelected = selectedIndices.includes(index);
                const selectionNum = selectedIndices.indexOf(index) + 1;

                return (
                  <TouchableOpacity
                    style={[styles.gridCell, isSelected && styles.gridCellSelected]}
                    onPress={() => toggleSelectIndex(index)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: item.uri }} style={styles.cellImage} />
                    <View
                      style={[
                        styles.selectBadge,
                        isSelected ? styles.selectBadgeActive : styles.selectBadgeInactive,
                      ]}
                    >
                      {isSelected ? (
                        <Text style={styles.badgeNumber}>{selectionNum}</Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: V4_COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    minHeight: 440,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  handleBarWrap: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: V4_COLORS.borderLight,
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    minHeight: 44,
    borderRadius: 22,
    gap: 6,
  },
  confirmBtnActive: {
    backgroundColor: V4_COLORS.primary,
  },
  confirmBtnDisabled: {
    backgroundColor: V4_COLORS.surfaceSubtle,
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '700',
  },
  confirmTextActive: {
    color: '#FFFFFF',
  },
  confirmTextDisabled: {
    color: '#94A3B8',
  },
  actionRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  importLibraryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: V4_COLORS.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.2)',
    gap: 8,
  },
  importLibraryText: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.primary,
  },
  emptyWrap: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: V4_COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 8,
  },
  gridCell: {
    flex: 1 / 3,
    aspectRatio: 1,
    margin: 4,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: V4_COLORS.surfaceSubtle,
  },
  gridCellSelected: {
    borderWidth: 3,
    borderColor: V4_COLORS.primary,
  },
  cellImage: {
    width: '100%',
    height: '100%',
  },
  selectBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectBadgeActive: {
    backgroundColor: V4_COLORS.primary,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  selectBadgeInactive: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
