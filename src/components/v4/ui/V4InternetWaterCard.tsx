import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wifi, Droplet, CheckCircle2, ShieldCheck, Gauge, Clock } from 'lucide-react-native';
import { InternetProviderRecord, WaterSupplyScheduleRecord } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

interface V4InternetWaterCardProps {
  internetProviders: InternetProviderRecord[];
  waterSchedule: WaterSupplyScheduleRecord;
}

export const V4InternetWaterCard: React.FC<V4InternetWaterCardProps> = React.memo(
  ({ internetProviders, waterSchedule }) => {
    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.iconCircle}>
            <Wifi size={20} color={V4_COLORS.primary} />
          </View>
          <View style={styles.headerTextCol}>
            <Text style={styles.title}>Internet & Water Reliability</Text>
            <Text style={styles.subtitle}>
              Verified broadband speeds & municipal supply schedules
            </Text>
          </View>
        </View>

        {/* 1. Broadband Providers Matrix */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Available Fiber Broadband ISPs</Text>
          <View style={styles.ispList}>
            {internetProviders.map((isp) => (
              <View key={isp.id || isp.provider} style={styles.ispRow}>
                <View style={styles.ispMainCol}>
                  <Text style={styles.ispName}>{isp.provider}</Text>
                  <Text style={styles.ispDetails}>
                    Up to {isp.speed_mbps} Mbps • {isp.latency}ms ping
                  </Text>
                </View>
                <View style={styles.ispBadgeCol}>
                  <View style={styles.reliabilityBadge}>
                    <CheckCircle2 size={12} color="#059669" />
                    <Text style={styles.reliabilityText}>{isp.reliability}%</Text>
                  </View>
                  <Text style={styles.ispPrice}>From ₹{isp.plan_starting_price}/mo</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 2. Water Supply Schedule */}
        <View style={styles.sectionBlock}>
          <View style={styles.waterHeaderRow}>
            <Droplet size={16} color="#0284C7" />
            <Text style={styles.sectionTitle}>Water Supply Schedule</Text>
          </View>

          <View style={styles.waterGrid}>
            <View style={styles.waterCell}>
              <View style={styles.waterCellHeader}>
                <Clock size={13} color="#0284C7" />
                <Text style={styles.waterCellLabel}>Municipal Timings</Text>
              </View>
              <Text style={styles.waterCellValue}>{waterSchedule.municipal_supply_hours}</Text>
            </View>

            <View style={styles.waterCell}>
              <View style={styles.waterCellHeader}>
                <ShieldCheck size={13} color="#059669" />
                <Text style={styles.waterCellLabel}>Tanker Reliance</Text>
              </View>
              <Text style={styles.waterCellHighlight}>{waterSchedule.tanker_frequency}</Text>
            </View>

            <View style={styles.waterCell}>
              <View style={styles.waterCellHeader}>
                <Gauge size={13} color="#0F766E" />
                <Text style={styles.waterCellLabel}>TDS & Pressure</Text>
              </View>
              <Text style={styles.waterCellValue}>
                {waterSchedule.tds_level} PPM • {waterSchedule.pressure_rating}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
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
  sectionBlock: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  ispList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  ispRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  ispMainCol: {
    flex: 1,
  },
  ispName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  ispDetails: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  ispBadgeCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  reliabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  reliabilityText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  ispPrice: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  waterHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  waterGrid: {
    gap: 8,
  },
  waterCell: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  waterCellHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  waterCellLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  waterCellValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  waterCellHighlight: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#059669',
  },
});
