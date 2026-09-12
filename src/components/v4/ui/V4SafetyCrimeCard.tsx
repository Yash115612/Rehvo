import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { Shield, ShieldAlert, PhoneCall, MapPin, Eye, CheckCircle2 } from 'lucide-react-native';
import { LocalityCrimeStatsRecord } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

interface V4SafetyCrimeCardProps {
  stats: LocalityCrimeStatsRecord;
}

export const V4SafetyCrimeCard: React.FC<V4SafetyCrimeCardProps> = React.memo(({ stats }) => {
  const handleCallEmergency = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() => {});
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Shield size={20} color="#059669" />
        </View>
        <View style={styles.headerTextCol}>
          <Text style={styles.title}>Safety & Security Index</Text>
          <Text style={styles.subtitle}>
            Verified police records, women safety & surveillance
          </Text>
        </View>
        <View style={styles.gradeBadge}>
          <Text style={styles.gradeText}>{stats.safety_grade}</Text>
        </View>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCell}>
          <Text style={styles.metricLabel}>Women Safety</Text>
          <Text style={styles.metricValueGreen}>{stats.women_safety}</Text>
          <Text style={styles.metricSub}>Well-lit & active</Text>
        </View>

        <View style={styles.metricCell}>
          <Text style={styles.metricLabel}>Crime Index</Text>
          <Text style={styles.metricValue}>{stats.crime_index}</Text>
          <Text style={styles.metricSub}>Low (City avg: 31.4)</Text>
        </View>

        <View style={styles.metricCell}>
          <Text style={styles.metricLabel}>CCTV Surveillance</Text>
          <Text style={styles.metricValueHighlight}>High</Text>
          <Text style={styles.metricSub}>{stats.cctv_coverage}</Text>
        </View>
      </View>

      {/* Nearest Police Station Box */}
      <View style={styles.stationBox}>
        <MapPin size={16} color="#0F766E" />
        <View style={styles.stationTextCol}>
          <Text style={styles.stationName}>{stats.police_station}</Text>
          <Text style={styles.stationDistance}>
            {stats.police_distance_km} km away • Active patrol beat
          </Text>
        </View>
      </View>

      {/* Emergency Helpline One-Tap Pills */}
      <View style={styles.emergencySection}>
        <Text style={styles.emergencyTitle}>Quick Emergency SOS Contacts</Text>
        <View style={styles.emergencyPillsRow}>
          {stats.emergency_numbers.map((num, idx) => (
            <Pressable
              key={idx}
              onPress={() => handleCallEmergency(num)}
              style={({ pressed }) => [
                styles.emergencyBtn,
                pressed && styles.emergencyBtnPressed,
              ]}
            >
              <PhoneCall size={13} color="#B91C1C" />
              <Text style={styles.emergencyBtnText}>{num}</Text>
            </Pressable>
          ))}
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
    backgroundColor: '#ECFDF5',
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
  gradeBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#059669',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricCell: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 3,
  },
  metricValueGreen: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#059669',
    marginTop: 3,
  },
  metricValueHighlight: {
    fontSize: 14,
    fontWeight: '900',
    color: V4_COLORS.primary,
    marginTop: 3,
  },
  metricSub: {
    fontSize: 9.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  stationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(15, 118, 110, 0.06)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.15)',
  },
  stationTextCol: {
    flex: 1,
  },
  stationName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  stationDistance: {
    fontSize: 11,
    color: '#0F766E',
    marginTop: 1,
  },
  emergencySection: {
    gap: 8,
  },
  emergencyTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  emergencyPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emergencyBtn: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  emergencyBtnPressed: {
    opacity: 0.8,
  },
  emergencyBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#B91C1C',
  },
});
