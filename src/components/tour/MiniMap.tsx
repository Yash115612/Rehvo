/**
 * REHVO AI Tour™ — Interactive 2D Mini-Map & Architectural Floor Plan
 * Shows real-time user position, 360 camera viewing cone, room boundaries,
 * and expandable architectural layout with dimensions.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import Svg, { Polygon, Circle, Line, Text as SvgText, Path, G } from 'react-native-svg';
import { Maximize2, Minimize2, X, Compass, Layers } from 'lucide-react-native';
import { FloorPlan2D, Room3D } from '../../types/tour';

export interface MiniMapProps {
  floorplan: FloorPlan2D;
  activeRoomId: string;
  cameraYawDeg: number;
  rooms: Room3D[];
  onSelectRoom: (roomId: string) => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  floorplan,
  activeRoomId,
  cameraYawDeg,
  rooms,
  onSelectRoom,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Find active room center point on floorplan
  const activeRoomPolygon = floorplan.rooms.find((r) => r.room_id === activeRoomId) || floorplan.rooms[0];
  const userX = activeRoomPolygon?.center[0] || 90;
  const userY = activeRoomPolygon?.center[1] || 75;

  // Viewing cone calculation
  const coneLength = 32;
  const coneSpreadDeg = 38;
  const yawRad = (cameraYawDeg * Math.PI) / 180;
  const leftAngleRad = yawRad - (coneSpreadDeg * Math.PI) / 180;
  const rightAngleRad = yawRad + (coneSpreadDeg * Math.PI) / 180;

  const coneLeftX = userX + coneLength * Math.sin(leftAngleRad);
  const coneLeftY = userY - coneLength * Math.cos(leftAngleRad);
  const coneRightX = userX + coneLength * Math.sin(rightAngleRad);
  const coneRightY = userY - coneLength * Math.cos(rightAngleRad);

  const conePath = `M ${userX} ${userY} L ${coneLeftX} ${coneLeftY} A ${coneLength} ${coneLength} 0 0 1 ${coneRightX} ${coneRightY} Z`;

  const renderSvgFloorplan = (width: number, height: number, isExpanded: boolean) => {
    return (
      <Svg width={width} height={height} viewBox={`0 0 ${floorplan.width} ${floorplan.height}`}>
        {/* Rooms Polygons */}
        {floorplan.rooms.map((room) => {
          const isActive = room.room_id === activeRoomId;
          const pointsString = room.points.map((p) => `${p[0]},${p[1]}`).join(' ');

          return (
            <G key={room.room_id} onPress={() => onSelectRoom(room.room_id)}>
              <Polygon
                points={pointsString}
                fill={isActive ? 'rgba(255, 107, 53, 0.28)' : 'rgba(30, 41, 59, 0.75)'}
                stroke={isActive ? '#FF6B35' : 'rgba(148, 163, 184, 0.45)'}
                strokeWidth={isActive ? 2.5 : 1.2}
              />

              {/* Room Name & Area Labels in Fullscreen or High Res */}
              {isExpanded && (
                <>
                  <SvgText
                    x={room.center[0]}
                    y={room.center[1] - 4}
                    fill="#FFFFFF"
                    fontSize={11}
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {room.name}
                  </SvgText>
                  <SvgText
                    x={room.center[0]}
                    y={room.center[1] + 10}
                    fill="#94A3B8"
                    fontSize={9}
                    textAnchor="middle"
                  >
                    {room.area_sqft} sq.ft
                  </SvgText>
                </>
              )}
            </G>
          );
        })}

        {/* Doors */}
        {floorplan.doors.map((door, idx) => (
          <Circle
            key={`door-${idx}`}
            cx={door.position[0]}
            cy={door.position[1]}
            r={3.5}
            fill="#38BDF8"
            opacity={0.85}
          />
        ))}

        {/* Windows */}
        {floorplan.windows.map((win, idx) => (
          <Line
            key={`win-${idx}`}
            x1={win.position[0] - win.width_px / 2}
            y1={win.position[1]}
            x2={win.position[0] + win.width_px / 2}
            y2={win.position[1]}
            stroke="#FDE047"
            strokeWidth={3}
            strokeDasharray="4 2"
          />
        ))}

        {/* 360 Camera Viewing Cone */}
        <Path d={conePath} fill="rgba(255, 107, 53, 0.22)" stroke="#FF6B35" strokeWidth={1} />

        {/* User Position Beacon */}
        <Circle cx={userX} cy={userY} r={7} fill="#FF6B35" />
        <Circle cx={userX} cy={userY} r={3} fill="#FFFFFF" />
      </Svg>
    );
  };

  return (
    <>
      {/* Small Floating Corner Mini-Map */}
      <View style={styles.miniMapContainer}>
        <View style={styles.miniMapHeader}>
          <Text style={styles.miniMapLabel}>FLOOR PLAN</Text>
          <Pressable onPress={() => setIsFullscreen(true)} hitSlop={8}>
            <Maximize2 size={12} color="#FFFFFF" strokeWidth={2.4} />
          </Pressable>
        </View>

        <Pressable onPress={() => setIsFullscreen(true)} style={styles.svgWrapper}>
          {renderSvgFloorplan(110, 130, false)}
        </Pressable>
      </View>

      {/* Fullscreen Architectural Floor Plan Modal */}
      <Modal visible={isFullscreen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <View style={styles.headerBadge}>
                  <Compass size={12} color="#0E8F73" />
                  <Text style={styles.headerBadgeText}>AI 2D ARCHITECTURAL LAYOUT</Text>
                </View>
                <Text style={styles.modalTitle}>Interactive Floor Plan</Text>
                <Text style={styles.modalSubtitle}>
                  {floorplan.total_carpet_sqft} sq.ft Carpet • {floorplan.total_area_sqft} sq.ft Super Built-up
                </Text>
              </View>

              <Pressable
                style={styles.closeBtn}
                onPress={() => setIsFullscreen(false)}
                hitSlop={8}
              >
                <X size={18} color="#031B2A" strokeWidth={2.4} />
              </Pressable>
            </View>

            {/* Floorplan Svg Container */}
            <View style={styles.expandedSvgCard}>
              {renderSvgFloorplan(280, 310, true)}
            </View>

            {/* Legend & Room Buttons */}
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF6B35' }]} />
                <Text style={styles.legendText}>Active Room</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#38BDF8' }]} />
                <Text style={styles.legendText}>Doors</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FDE047' }]} />
                <Text style={styles.legendText}>Windows</Text>
              </View>
            </View>

            <Pressable
              style={styles.teleportBtn}
              onPress={() => setIsFullscreen(false)}
            >
              <Text style={styles.teleportBtnText}>Back to 3D Spatial Tour</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  miniMapContainer: {
    backgroundColor: 'rgba(3, 27, 42, 0.88)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    padding: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  miniMapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  miniMapLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFB899',
    letterSpacing: 0.5,
  },
  svgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  headerBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0E8F73',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#031B2A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  expandedSvgCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  teleportBtn: {
    backgroundColor: '#0E8F73',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  teleportBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
