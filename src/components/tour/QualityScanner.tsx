/**
 * REHVO AI Tour™ — Local Video Quality Scanner Component
 * Evaluates video stability, lighting, blur, room coverage, missing rooms,
 * circular health score (0-100), and warning badges before upload.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  Sun,
  Eye,
  Camera,
  ArrowRight,
} from 'lucide-react-native';
import { VideoQualityReport } from '../../types/tour';

export interface QualityScannerProps {
  report: VideoQualityReport;
  onProceed: () => void;
  onReRecord: () => void;
}

export const QualityScanner: React.FC<QualityScannerProps> = ({
  report,
  onProceed,
  onReRecord,
}) => {
  const isHealthy = report.overall_score >= 70;
  const isOptimal = report.overall_score >= 85;

  const scoreColor = isOptimal ? '#0E8F73' : isHealthy ? '#F59E0B' : '#EF4444';
  const scoreBgColor = isOptimal ? '#ECFDF5' : isHealthy ? '#FFFBEB' : '#FEF2F2';

  const metrics = [
    {
      label: 'Camera Stability',
      value: report.camera_stability,
      sub: report.camera_stability >= 75 ? 'Smooth handheld motion' : 'Shaky motion detected',
      icon: Camera,
      color: report.camera_stability >= 75 ? '#0E8F73' : '#F59E0B',
    },
    {
      label: 'Lighting & Brightness',
      value: report.brightness,
      sub: report.brightness >= 70 ? 'Adequate ambient lux' : 'Underexposed sections',
      icon: Sun,
      color: report.brightness >= 70 ? '#0E8F73' : '#F59E0B',
    },
    {
      label: 'Image Sharpness',
      value: report.blur,
      sub: report.blur >= 75 ? 'Sharp texture edges' : 'Motion blur present',
      icon: Eye,
      color: report.blur >= 75 ? '#0E8F73' : '#F59E0B',
    },
    {
      label: 'Spatial Room Coverage',
      value: report.coverage,
      sub: report.coverage >= 80 ? 'Full property mapped' : 'Some rooms skipped',
      icon: Layers,
      color: report.coverage >= 80 ? '#0E8F73' : '#F59E0B',
    },
  ];

  // Derive warning list from report
  const warningsList: string[] = [];
  if (report.warnings && report.warnings.length > 0) {
    warningsList.push(...report.warnings);
  } else {
    if (report.camera_stability < 75) warningsList.push('Video shaky during room transitions');
    if (report.brightness < 70) warningsList.push('Low light detected; turned-off lamps in corridor');
    if (report.blur < 70) warningsList.push('Motion blur detected while turning corners');
    if (report.coverage < 75) warningsList.push('Incomplete room coverage detected');
    if (report.missing_rooms && report.missing_rooms.length > 0) {
      report.missing_rooms.forEach((r) => warningsList.push(`${r} not detected in walkthrough`));
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Banner */}
      <View style={styles.topCard}>
        <View style={styles.badgeRow}>
          <View style={styles.pillBadge}>
            <Sparkles size={11} color="#FF6B35" />
            <Text style={styles.pillBadgeText}>AI QUALITY SCAN COMPLETE</Text>
          </View>
          <Text style={styles.resBadge}>
            {report.resolution || '1080p'} • {report.duration_seconds || 60}s
          </Text>
        </View>

        {/* Circular Health Score Display */}
        <View style={styles.scoreRow}>
          <View style={[styles.circleContainer, { borderColor: scoreColor, backgroundColor: scoreBgColor }]}>
            <Text style={[styles.scoreNumber, { color: scoreColor }]}>{report.overall_score}</Text>
            <Text style={styles.scoreScale}>/100</Text>
          </View>

          <View style={styles.scoreTextCol}>
            <Text style={styles.healthTitle}>
              {isOptimal
                ? 'Excellent Quality'
                : isHealthy
                ? 'Good Quality (Ready)'
                : 'Needs Improvement'}
            </Text>
            <Text style={styles.healthDesc}>{report.feedback_message}</Text>
          </View>
        </View>
      </View>

      {/* 4 Core Quality Metrics Grid */}
      <View style={styles.metricsGrid}>
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <View key={idx} style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <View style={[styles.metricIconCircle, { backgroundColor: `${m.color}15` }]}>
                  <Icon size={14} color={m.color} strokeWidth={2.4} />
                </View>
                <Text style={[styles.metricValue, { color: m.color }]}>{m.value}%</Text>
              </View>

              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text style={styles.metricSub}>{m.sub}</Text>

              {/* Mini progress bar */}
              <View style={styles.metricBarTrack}>
                <View
                  style={[
                    styles.metricBarFill,
                    { width: `${m.value}%`, backgroundColor: m.color },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Missing Rooms Alerts */}
      {report.missing_rooms && report.missing_rooms.length > 0 && (
        <View style={styles.missingRoomsBox}>
          <View style={styles.alertHeaderRow}>
            <AlertTriangle size={16} color="#DC2626" />
            <Text style={styles.alertHeaderTitle}>Missing Room Alerts</Text>
          </View>
          <Text style={styles.alertSubtitle}>
            Our AI spatial detector could not identify the following rooms:
          </Text>
          <View style={styles.chipsRow}>
            {report.missing_rooms.map((room, idx) => (
              <View key={idx} style={styles.missingRoomChip}>
                <Text style={styles.missingRoomText}>⚠️ {room} missing</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Warnings List */}
      {warningsList.length > 0 && (
        <View style={styles.warningsBox}>
          <View style={styles.warningHeaderRow}>
            <AlertTriangle size={15} color="#D97706" />
            <Text style={styles.warningHeaderTitle}>Quality Advisory Warnings</Text>
          </View>
          <View style={styles.warningItems}>
            {warningsList.map((warn, idx) => (
              <View key={idx} style={styles.warningItem}>
                <View style={styles.warningBullet} />
                <Text style={styles.warningText}>{warn}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <Pressable style={styles.reRecordBtn} onPress={onReRecord}>
          <RotateCcw size={15} color="#1A1A2E" strokeWidth={2.4} />
          <Text style={styles.reRecordBtnText}>Re-Record</Text>
        </Pressable>

        <Pressable
          style={[styles.proceedBtn, !isHealthy && styles.proceedBtnWarning]}
          onPress={onProceed}
        >
          <Text style={styles.proceedBtnText}>
            {isHealthy ? 'Proceed to Compression' : 'Proceed Anyway'}
          </Text>
          <ArrowRight size={15} color="#FFFFFF" strokeWidth={2.4} />
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
  },
  topCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    gap: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 107, 53, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FF6B35',
    letterSpacing: 0.5,
  },
  resBadge: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  circleContainer: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 30,
  },
  scoreScale: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    marginTop: -2,
  },
  scoreTextCol: {
    flex: 1,
    gap: 3,
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1A1A2E',
  },
  healthDesc: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    width: '48.3%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    gap: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metricIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  metricSub: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 13,
  },
  metricBarTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    marginTop: 6,
  },
  metricBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  missingRoomsBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertHeaderTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#B91C1C',
  },
  alertSubtitle: {
    fontSize: 11,
    color: '#7F1D1D',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  missingRoomChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F87171',
  },
  missingRoomText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B91C1C',
  },
  warningsBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  warningHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  warningHeaderTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#92400E',
  },
  warningItems: {
    gap: 5,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningBullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#D97706',
  },
  warningText: {
    fontSize: 11.5,
    color: '#78350F',
    fontWeight: '600',
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    marginBottom: 20,
  },
  reRecordBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 16,
  },
  reRecordBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  proceedBtn: {
    flex: 1.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  proceedBtnWarning: {
    backgroundColor: '#D97706',
  },
  proceedBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
