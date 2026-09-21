/**
 * REHVO AI Tour™ — Sunlight Simulation Selector
 * Allows dynamic time-of-day lighting adjustments across Morning, Afternoon, Golden Hour, and Night.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Sun, Sunset, Moon, Sunrise } from 'lucide-react-native';
import { SunlightTime } from '../../types/tour';
import { SUNLIGHT_PRESETS } from '../../lib/ai-tour/sunlight';

export interface SunlightControlProps {
  currentMode: SunlightTime;
  onChangeMode: (mode: SunlightTime) => void;
}

export const SunlightControl: React.FC<SunlightControlProps> = ({
  currentMode,
  onChangeMode,
}) => {
  const options: { id: SunlightTime; label: string; icon: any }[] = [
    { id: 'morning', label: 'Morning', icon: Sunrise },
    { id: 'afternoon', label: 'Midday', icon: Sun },
    { id: 'golden_hour', label: 'Golden Hour', icon: Sunset },
    { id: 'night', label: 'Night', icon: Moon },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.pillTrack}>
        {options.map((opt) => {
          const isActive = currentMode === opt.id;
          const IconComp = opt.icon;

          return (
            <Pressable
              key={opt.id}
              style={[styles.pillItem, isActive && styles.pillItemActive]}
              onPress={() => onChangeMode(opt.id)}
            >
              <IconComp
                size={13}
                color={isActive ? '#FFFFFF' : '#94A3B8'}
                strokeWidth={2.4}
              />
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  pillTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 27, 42, 0.88)',
    borderRadius: 20,
    padding: 3.5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 4,
  },
  pillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 16,
  },
  pillItemActive: {
    backgroundColor: '#FF6B35',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
