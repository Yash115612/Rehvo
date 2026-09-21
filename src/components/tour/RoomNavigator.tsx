/**
 * REHVO AI Tour™ — Bottom Room Navigator Bar
 * Allows one-tap teleportation across rooms with dimensions and thumbnails.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Room3D } from '../../types/tour';
import { Sparkles, Maximize2 } from 'lucide-react-native';

export interface RoomNavigatorProps {
  rooms: Room3D[];
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
}

export const RoomNavigator: React.FC<RoomNavigatorProps> = ({
  rooms,
  activeRoomId,
  onSelectRoom,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {rooms.map((room) => {
          const isActive = room.id === activeRoomId;

          return (
            <Pressable
              key={room.id}
              style={[styles.roomCard, isActive && styles.roomCardActive]}
              onPress={() => onSelectRoom(room.id)}
            >
              <Image source={{ uri: room.panorama_url }} style={styles.thumbnail} />

              {/* Room Name & Dimensions */}
              <View style={styles.infoOverlay}>
                <Text style={[styles.roomTitle, isActive && styles.roomTitleActive]} numberOfLines={1}>
                  {room.name}
                </Text>
                <Text style={styles.dimensionsText}>
                  {room.dimensions.length_ft}×{room.dimensions.width_ft} ft • {room.dimensions.carpet_area_sqft} sqft
                </Text>
              </View>

              {/* Active Indicator Badge */}
              {isActive && (
                <View style={styles.activePill}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activePillText}>Viewing</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  roomCard: {
    width: 140,
    height: 72,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  roomCardActive: {
    borderColor: '#FF6B35',
    transform: [{ scale: 1.03 }],
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    opacity: 0.68,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
    backgroundColor: 'rgba(3, 27, 42, 0.72)',
  },
  roomTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  roomTitleActive: {
    color: '#FFB899',
  },
  dimensionsText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 1,
  },
  activePill: {
    position: 'absolute',
    top: 5,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    backgroundColor: 'rgba(255, 107, 53, 0.95)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  activePillText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
});
