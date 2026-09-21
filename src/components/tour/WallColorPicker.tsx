/**
 * REHVO AI Tour™ — Interactive Wall Color Paint Preview
 * Live paint palette letting users test wall colors in the 3D room.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Palette, Check, X } from 'lucide-react-native';
import { RoomWallColorOption } from '../../types/tour';

export interface WallColorPickerProps {
  colors: RoomWallColorOption[];
  selectedColorHex: string;
  onSelectColor: (hex: string) => void;
  onClose: () => void;
}

export const WallColorPicker: React.FC<WallColorPickerProps> = ({
  colors,
  selectedColorHex,
  onSelectColor,
  onClose,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Palette size={14} color="#FF6B35" />
          <Text style={styles.title}>AI Wall Color Preview</Text>
        </View>
        <Pressable onPress={onClose} hitSlop={8}>
          <X size={15} color="#94A3B8" />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.swatchList}>
        {colors.map((c) => {
          const isSelected = selectedColorHex.toLowerCase() === c.hex.toLowerCase();

          return (
            <Pressable
              key={c.hex}
              style={[styles.swatchItem, isSelected && styles.swatchItemActive]}
              onPress={() => onSelectColor(c.hex)}
            >
              <View style={[styles.colorCircle, { backgroundColor: c.hex }]}>
                {isSelected && <Check size={12} color={c.hex === '#FAF7F2' ? '#031B2A' : '#FFFFFF'} strokeWidth={3} />}
              </View>
              <Text style={styles.colorName} numberOfLines={1}>
                {c.name}
              </Text>
              <Text style={styles.finishText}>{c.finish}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(3, 27, 42, 0.94)',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  swatchList: {
    gap: 8,
    paddingVertical: 2,
  },
  swatchItem: {
    alignItems: 'center',
    padding: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    minWidth: 64,
  },
  swatchItemActive: {
    borderColor: '#FF6B35',
    backgroundColor: 'rgba(255, 107, 53, 0.12)',
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  colorName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  finishText: {
    fontSize: 8.5,
    fontWeight: '500',
    color: '#94A3B8',
    textTransform: 'capitalize',
  },
});
