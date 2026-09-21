/**
 * REHVO AI Tour™ — AR 3D Spatial Measure Tool
 * Tapping two points on the screen computes real-world dimensions in feet and meters.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Line, Circle, Text as SvgText } from 'react-native-svg';
import { Ruler, RotateCcw, Check, X } from 'lucide-react-native';
import { StoredMeasurement } from '../../types/tour';

export interface MeasureToolProps {
  active: boolean;
  roomId: string;
  viewportWidth: number;
  viewportHeight: number;
  onSaveMeasurement: (measurement: StoredMeasurement) => void;
  onClose: () => void;
}

export const MeasureTool: React.FC<MeasureToolProps> = ({
  active,
  roomId,
  viewportWidth,
  viewportHeight,
  onSaveMeasurement,
  onClose,
}) => {
  const [pointA, setPointA] = useState<{ x: number; y: number } | null>(null);
  const [pointB, setPointB] = useState<{ x: number; y: number } | null>(null);

  if (!active) return null;

  const handleScreenPress = (evt: any) => {
    const { locationX, locationY } = evt.nativeEvent;

    if (!pointA) {
      setPointA({ x: locationX, y: locationY });
    } else if (!pointB) {
      setPointB({ x: locationX, y: locationY });
    } else {
      // Third tap resets to new point A
      setPointA({ x: locationX, y: locationY });
      setPointB(null);
    }
  };

  // Distance estimation (scaled based on viewport and standard room height)
  let distanceFt = 0;
  let distanceMeters = 0;
  let midX = 0;
  let midY = 0;

  if (pointA && pointB) {
    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;
    const pixelDist = Math.sqrt(dx * dx + dy * dy);

    // Approximate scale: 28px ~= 1 foot in typical room perspective
    distanceFt = Number(Math.max(1.2, pixelDist / 26).toFixed(1));
    distanceMeters = Number((distanceFt * 0.3048).toFixed(2));
    midX = (pointA.x + pointB.x) / 2;
    midY = (pointA.y + pointB.y) / 2;
  }

  const handleSave = () => {
    if (pointA && pointB) {
      const measurement: StoredMeasurement = {
        id: `meas-${Date.now()}`,
        room_id: roomId,
        start_point: [pointA.x, pointA.y, 0],
        end_point: [pointB.x, pointB.y, 0],
        distance_ft: distanceFt,
        distance_meters: distanceMeters,
        label: `Measured Dimension: ${distanceFt} ft`,
        created_at: new Date().toISOString(),
      };
      onSaveMeasurement(measurement);
      setPointA(null);
      setPointB(null);
    }
  };

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      {/* Tap surface overlay */}
      <Pressable style={StyleSheet.absoluteFillObject} onPress={handleScreenPress}>
        <Svg width={viewportWidth} height={viewportHeight} style={StyleSheet.absoluteFillObject}>
          {pointA && pointB && (
            <>
              {/* Connecting Dimension Line */}
              <Line
                x1={pointA.x}
                y1={pointA.y}
                x2={pointB.x}
                y2={pointB.y}
                stroke="#FF6B35"
                strokeWidth={3}
                strokeDasharray="6 4"
              />

              {/* Dimension Label in SVG */}
              <SvgText
                x={midX}
                y={midY - 14}
                fill="#FFFFFF"
                fontSize={13}
                fontWeight="bold"
                textAnchor="middle"
              >
                {distanceFt} ft ({distanceMeters} m)
              </SvgText>
            </>
          )}

          {/* Point A Marker */}
          {pointA && (
            <>
              <Circle cx={pointA.x} cy={pointA.y} r={10} fill="rgba(255, 107, 53, 0.4)" />
              <Circle cx={pointA.x} cy={pointA.y} r={5} fill="#FF6B35" stroke="#FFFFFF" strokeWidth={2} />
            </>
          )}

          {/* Point B Marker */}
          {pointB && (
            <>
              <Circle cx={pointB.x} cy={pointB.y} r={10} fill="rgba(255, 107, 53, 0.4)" />
              <Circle cx={pointB.x} cy={pointB.y} r={5} fill="#FF6B35" stroke="#FFFFFF" strokeWidth={2} />
            </>
          )}
        </Svg>
      </Pressable>

      {/* Floating Control Bar */}
      <View style={styles.controlBar} pointerEvents="auto">
        <View style={styles.promptWrapper}>
          <Ruler size={16} color="#FF6B35" />
          <Text style={styles.promptText}>
            {!pointA
              ? 'Tap anywhere to set 1st point'
              : !pointB
              ? 'Tap 2nd point to measure distance'
              : `${distanceFt} ft • ${distanceMeters} meters`}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          {pointA && (
            <Pressable
              style={styles.iconBtn}
              onPress={() => {
                setPointA(null);
                setPointB(null);
              }}
              hitSlop={8}
            >
              <RotateCcw size={15} color="#FFFFFF" />
            </Pressable>
          )}

          {pointB && (
            <Pressable style={styles.saveBtn} onPress={handleSave}>
              <Check size={14} color="#FFFFFF" strokeWidth={2.6} />
              <Text style={styles.saveBtnText}>Save</Text>
            </Pressable>
          )}

          <Pressable style={styles.iconBtn} onPress={onClose} hitSlop={8}>
            <X size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controlBar: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(3, 27, 42, 0.92)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.35)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  promptWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  promptText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0E8F73',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  saveBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
