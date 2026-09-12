import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polygon, Line, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { NeighborhoodScoresRecord } from '../../../types';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface V4NeighborhoodRadarProps {
  scores?: Partial<NeighborhoodScoresRecord>;
  size?: number;
  darkMode?: boolean;
}

interface RadarMetric {
  key: string;
  label: string;
  score: number;
}

export const V4NeighborhoodRadar: React.FC<V4NeighborhoodRadarProps> = React.memo(
  ({ scores, size = Math.min(SCREEN_WIDTH - 64, 320), darkMode = false }) => {
    const metrics: RadarMetric[] = useMemo(() => {
      return [
        { key: 'walk', label: 'Walk', score: scores?.walk_score ?? 8.5 },
        { key: 'safety', label: 'Safety', score: scores?.safety_score ?? 9.2 },
        { key: 'greenery', label: 'Greenery', score: scores?.greenery_score ?? 7.8 },
        { key: 'noise', label: 'Peace', score: 10 - (scores?.pollution_score ?? 6.0) * 0.5 },
        { key: 'internet', label: 'Internet', score: scores?.internet_score ?? 9.5 },
        { key: 'water', label: 'Water', score: scores?.water_score ?? 8.8 },
        { key: 'family', label: 'Family', score: scores?.family_score ?? 8.6 },
        { key: 'nightlife', label: 'Nightlife', score: scores?.nightlife_score ?? 8.4 },
      ];
    }, [scores]);

    const numAxes = metrics.length;
    const center = size / 2;
    const radius = size * 0.38;

    // Helper to calculate coordinates on axis
    const getCoordinates = (value: number, index: number, maxVal = 10) => {
      const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
      const normalizedDist = (Math.max(1, Math.min(10, value)) / maxVal) * radius;
      const x = center + normalizedDist * Math.cos(angle);
      const y = center + normalizedDist * Math.sin(angle);
      return { x, y };
    };

    // Calculate concentric rings (4 rings: 2.5, 5, 7.5, 10)
    const concentricPolygons = useMemo(() => {
      return [0.25, 0.5, 0.75, 1.0].map((fraction) => {
        const points = metrics
          .map((_, i) => {
            const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
            const r = radius * fraction;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          })
          .join(' ');
        return { fraction, points };
      });
    }, [center, radius, numAxes, metrics]);

    // Data polygon points
    const dataPointsString = useMemo(() => {
      return metrics
        .map((m, i) => {
          const { x, y } = getCoordinates(m.score, i);
          return `${x},${y}`;
        })
        .join(' ');
    }, [metrics, center, radius]);

    // Radial axis lines
    const axisLines = useMemo(() => {
      return metrics.map((_, i) => {
        const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
        const x2 = center + radius * Math.cos(angle);
        const y2 = center + radius * Math.sin(angle);
        return { x1: center, y1: center, x2, y2 };
      });
    }, [center, radius, numAxes, metrics]);

    // Label positions slightly outside radius
    const labelPositions = useMemo(() => {
      const labelRadius = radius + 24;
      return metrics.map((m, i) => {
        const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return { label: m.label, score: m.score.toFixed(1), x, y };
      });
    }, [center, radius, numAxes, metrics]);

    const gridColor = darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 118, 110, 0.14)';
    const axisColor = darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 118, 110, 0.1)';
    const polygonStroke = V4_COLORS.primary; // #0F766E
    const polygonFill = darkMode ? 'rgba(45, 212, 191, 0.28)' : 'rgba(15, 118, 110, 0.22)';
    const textColor = darkMode ? '#F1F5F9' : '#0F172A';
    const subTextColor = darkMode ? '#94A3B8' : '#64748B';

    return (
      <View style={[styles.container, darkMode && styles.darkContainer]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <LinearGradient id="radarEmeraldGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#0F766E" stopOpacity="0.15" />
            </LinearGradient>
          </Defs>

          {/* 1. Concentric Guide Polygons */}
          {concentricPolygons.map(({ fraction, points }) => (
            <Polygon
              key={`ring_${fraction}`}
              points={points}
              fill="none"
              stroke={gridColor}
              strokeWidth={fraction === 1.0 ? 1.5 : 1}
              strokeDasharray={fraction === 1.0 ? undefined : '3,3'}
            />
          ))}

          {/* 2. Radial Axis Lines */}
          {axisLines.map((line, idx) => (
            <Line
              key={`axis_${idx}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={axisColor}
              strokeWidth={1}
            />
          ))}

          {/* 3. Data Area Polygon */}
          <Polygon
            points={dataPointsString}
            fill="url(#radarEmeraldGrad)"
            stroke={polygonStroke}
            strokeWidth={2.5}
          />

          {/* 4. Vertex Circles */}
          {metrics.map((m, idx) => {
            const { x, y } = getCoordinates(m.score, idx);
            return (
              <G key={`vertex_${idx}`}>
                <Circle cx={x} cy={y} r={5.5} fill="#FFFFFF" stroke={polygonStroke} strokeWidth={2} />
                <Circle cx={x} cy={y} r={2.5} fill={polygonStroke} />
              </G>
            );
          })}
        </Svg>

        {/* 5. Clean HTML / React Native Floating Metric Badges */}
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          {labelPositions.map((pos, idx) => {
            const isLeft = pos.x < center - 10;
            const isRight = pos.x > center + 10;
            const isTop = pos.y < center - 10;

            const left = Math.max(8, Math.min(size - 60, pos.x - 28));
            const top = Math.max(8, Math.min(size - 30, pos.y - 12));

            return (
              <View
                key={`badge_${idx}`}
                style={[
                  styles.metricLabelBadge,
                  { left, top },
                  darkMode && styles.metricLabelBadgeDark,
                ]}
              >
                <Text style={[styles.metricLabelText, { color: textColor }]}>
                  {pos.label}
                </Text>
                <Text style={[styles.metricScoreText, { color: V4_COLORS.primary }]}>
                  {pos.score}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  darkContainer: {
    backgroundColor: 'transparent',
  },
  metricLabelBadge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  metricLabelBadgeDark: {
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  metricLabelText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  metricScoreText: {
    fontSize: 10,
    fontWeight: '900',
  },
});
