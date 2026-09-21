/**
 * REHVO AI Tour™ — Glowing 3D Hotspot Beacon
 * Renders an animated glowing orange teleportation beacon with destination tooltip.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Footprints, ArrowUpRight } from 'lucide-react-native';
import { Hotspot3D } from '../../types/tour';

export interface HotspotProps {
  hotspot: Hotspot3D;
  screenX: number;
  screenY: number;
  onPress: (targetRoomId: string) => void;
}

export const Hotspot: React.FC<HotspotProps> = ({
  hotspot,
  screenX,
  screenY,
  onPress,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringScale = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Continuous pulsating animation
    const pulseLoop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(ringScale, {
            toValue: 2.2,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(ringScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(ringOpacity, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.8,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulseAnim, ringScale, ringOpacity]);

  return (
    <View
      style={[
        styles.container,
        {
          left: screenX - 60,
          top: screenY - 30,
        },
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        style={styles.touchTarget}
        onPress={() => onPress(hotspot.target_room_id)}
        hitSlop={12}
      >
        {/* Pulsating outer beacon wave */}
        <Animated.View
          style={[
            styles.outerPulseRing,
            {
              transform: [{ scale: ringScale }],
              opacity: ringOpacity,
            },
          ]}
        />

        {/* Core Glowing Orb */}
        <Animated.View
          style={[
            styles.coreOrb,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Footprints size={14} color="#FFFFFF" strokeWidth={2.6} />
        </Animated.View>

        {/* Destination Room Badge Tooltip */}
        <View style={styles.tooltipPill}>
          <Text style={styles.tooltipText}>{hotspot.label}</Text>
          <ArrowUpRight size={11} color="#FF6B35" strokeWidth={2.8} />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 120,
    alignItems: 'center',
    zIndex: 100,
  },
  touchTarget: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerPulseRing: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FF6B35',
  },
  coreOrb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B35',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  tooltipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(3, 27, 42, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 10,
    marginTop: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 5,
  },
  tooltipText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
