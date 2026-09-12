import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wind, Volume2, Thermometer, Droplets, Sparkles, Activity } from 'lucide-react-native';
import { LocalityAirQualityRecord } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

interface V4AirQualityCardProps {
  airQuality: LocalityAirQualityRecord;
}

export const V4AirQualityCard: React.FC<V4AirQualityCardProps> = React.memo(({ airQuality }) => {
  const isGood = airQuality.aqi <= 75;
  const aqiColor = isGood ? '#059669' : airQuality.aqi <= 120 ? '#D97706' : '#DC2626';
  const aqiBg = isGood ? '#ECFDF5' : airQuality.aqi <= 120 ? '#FFFBEB' : '#FEF2F2';
  const aqiBorder = isGood ? '#A7F3D0' : airQuality.aqi <= 120 ? '#FDE68A' : '#FECACA';

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Wind size={20} color={V4_COLORS.primary} />
        </View>
        <View style={styles.headerTextCol}>
          <Text style={styles.title}>Air Quality & Environment</Text>
          <Text style={styles.subtitle}>
            Continuous atmospheric & acoustic telemetry
          </Text>
        </View>
      </View>

      {/* Main AQI Hero Block */}
      <View style={[styles.aqiHero, { backgroundColor: aqiBg, borderColor: aqiBorder }]}>
        <View style={styles.aqiNumberCol}>
          <Text style={[styles.aqiNumber, { color: aqiColor }]}>{airQuality.aqi}</Text>
          <Text style={styles.aqiUnit}>AQI INDEX</Text>
        </View>

        <View style={styles.aqiStatusCol}>
          <View style={styles.statusRow}>
            <Activity size={14} color={aqiColor} />
            <Text style={[styles.statusTitle, { color: aqiColor }]}>{airQuality.status}</Text>
          </View>
          <Text style={styles.statusSub}>
            PM2.5: {airQuality.pm25} µg/m³ • PM10: {airQuality.pm10} µg/m³
          </Text>
        </View>
      </View>

      {/* Environmental Grid: Noise, Humidity, Temperature */}
      <View style={styles.envGrid}>
        <View style={styles.envCell}>
          <View style={styles.envCellHeader}>
            <Volume2 size={15} color="#0F766E" />
            <Text style={styles.envCellLabel}>Noise Level</Text>
          </View>
          <Text style={styles.envCellValue}>{airQuality.noise_level_db} dB</Text>
          <Text style={styles.envCellSub}>Quiet Residential</Text>
        </View>

        <View style={styles.envCell}>
          <View style={styles.envCellHeader}>
            <Droplets size={15} color="#2563EB" />
            <Text style={styles.envCellLabel}>Humidity</Text>
          </View>
          <Text style={styles.envCellValue}>{airQuality.humidity}%</Text>
          <Text style={styles.envCellSub}>Pleasant</Text>
        </View>

        <View style={styles.envCell}>
          <View style={styles.envCellHeader}>
            <Thermometer size={15} color="#EA580C" />
            <Text style={styles.envCellLabel}>Temperature</Text>
          </View>
          <Text style={styles.envCellValue}>{airQuality.temperature}°C</Text>
          <Text style={styles.envCellSub}>Normal</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
    ...V4_SHADOWS.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: V4_COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  aqiHero: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 16,
  },
  aqiNumberCol: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.08)',
    paddingRight: 16,
  },
  aqiNumber: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  aqiUnit: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  aqiStatusCol: {
    flex: 1,
    gap: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  statusSub: {
    fontSize: 11,
    color: '#475569',
  },
  envGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  envCell: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 2,
  },
  envCellHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  envCellLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  envCellValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  envCellSub: {
    fontSize: 9.5,
    color: '#94A3B8',
  },
});
