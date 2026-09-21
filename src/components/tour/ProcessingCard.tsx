/**
 * REHVO AI Tour™ — Owner Dashboard AI Tour Status Card
 * Displays 3D tour status, performance metrics, and landlord management actions.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  Box,
  Eye,
  Clock,
  RotateCcw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react-native';
import { TourStatus } from '../../types/tour';

export interface ProcessingCardProps {
  status: TourStatus;
  uploadDate: string;
  processingTimeSeconds?: number;
  viewsCount?: number;
  completionRatePercent?: number;
  onPreviewTour: () => void;
  onReprocessTour: () => void;
  onDeleteTour?: () => void;
}

export const ProcessingCard: React.FC<ProcessingCardProps> = ({
  status,
  uploadDate,
  processingTimeSeconds = 118,
  viewsCount = 384,
  completionRatePercent = 89,
  onPreviewTour,
  onReprocessTour,
  onDeleteTour,
}) => {
  const isCompleted = status === 'Completed';
  const isFailed = status === 'Failed';
  const isProcessing = !isCompleted && !isFailed;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <View style={styles.badge}>
            <Sparkles size={11} color="#0E8F73" />
            <Text style={styles.badgeText}>REHVO AI TOUR™</Text>
          </View>
          <Text style={styles.title}>3D Virtual Walkthrough</Text>
          <Text style={styles.sub}>Uploaded on {uploadDate}</Text>
        </View>

        {/* Status Tag */}
        <View
          style={[
            styles.statusTag,
            isCompleted && styles.statusTagSuccess,
            isProcessing && styles.statusTagProcessing,
            isFailed && styles.statusTagFailed,
          ]}
        >
          {isCompleted ? (
            <CheckCircle2 size={12} color="#0E8F73" strokeWidth={2.6} />
          ) : isProcessing ? (
            <Box size={12} color="#D97706" />
          ) : (
            <AlertCircle size={12} color="#EF4444" />
          )}
          <Text
            style={[
              styles.statusText,
              isCompleted && styles.statusTextSuccess,
              isProcessing && styles.statusTextProcessing,
              isFailed && styles.statusTextFailed,
            ]}
          >
            {status}
          </Text>
        </View>
      </View>

      {/* Metrics Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <View style={styles.metricIconWrap}>
            <Eye size={13} color="#0E8F73" />
          </View>
          <Text style={styles.metricVal}>{viewsCount}</Text>
          <Text style={styles.metricLbl}>3D Opens</Text>
        </View>

        <View style={styles.metricSep} />

        <View style={styles.metricItem}>
          <View style={styles.metricIconWrap}>
            <Clock size={13} color="#2563EB" />
          </View>
          <Text style={styles.metricVal}>{processingTimeSeconds}s</Text>
          <Text style={styles.metricLbl}>Build Time</Text>
        </View>

        <View style={styles.metricSep} />

        <View style={styles.metricItem}>
          <View style={styles.metricIconWrap}>
            <CheckCircle2 size={13} color="#FF6B35" />
          </View>
          <Text style={styles.metricVal}>{completionRatePercent}%</Text>
          <Text style={styles.metricLbl}>Completion</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        {isCompleted && (
          <Pressable style={styles.primaryBtn} onPress={onPreviewTour}>
            <ExternalLink size={13} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.primaryBtnText}>Preview 3D Tour</Text>
          </Pressable>
        )}

        <Pressable style={styles.secondaryBtn} onPress={onReprocessTour}>
          <RotateCcw size={13} color="#031B2A" strokeWidth={2.2} />
          <Text style={styles.secondaryBtnText}>Reprocess</Text>
        </Pressable>

        {onDeleteTour && (
          <Pressable style={styles.deleteBtn} onPress={onDeleteTour} hitSlop={8}>
            <Trash2 size={14} color="#EF4444" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleCol: {
    gap: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#0E8F73',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 15,
    fontWeight: '900',
    color: '#031B2A',
    marginTop: 2,
  },
  sub: {
    fontSize: 11,
    color: '#64748B',
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  statusTagSuccess: {
    backgroundColor: '#DCFCE7',
  },
  statusTagProcessing: {
    backgroundColor: '#FEF3C7',
  },
  statusTagFailed: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  statusTextSuccess: {
    color: '#0E8F73',
  },
  statusTextProcessing: {
    color: '#B45309',
  },
  statusTextFailed: {
    color: '#DC2626',
  },
  metricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  metricIconWrap: {
    marginBottom: 2,
  },
  metricVal: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#031B2A',
  },
  metricLbl: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  metricSep: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  primaryBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FF6B35',
    paddingVertical: 10,
    borderRadius: 12,
  },
  primaryBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 12,
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#031B2A',
  },
  deleteBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
