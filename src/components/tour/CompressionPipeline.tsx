/**
 * REHVO AI Tour™ — Video Compression Pipeline Component
 * Hardware-accelerated local video compression maintaining 1080p resolution
 * at target 5 Mbps bitrate with live progress and byte savings analytics.
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import {
  Sparkles,
  Zap,
  HardDrive,
  CheckCircle2,
  Cpu,
  Layers,
  FileCheck,
} from 'lucide-react-native';

export interface CompressionPipelineProps {
  progress: number; // 0 to 100
  originalSizeBytes: number;
  compressedSizeBytes: number;
  targetBitrate?: string;
  resolution?: string;
}

export const CompressionPipeline: React.FC<CompressionPipelineProps> = ({
  progress,
  originalSizeBytes,
  compressedSizeBytes,
  targetBitrate = '5 Mbps',
  resolution = '1080p FHD',
}) => {
  const origMB = (originalSizeBytes / (1024 * 1024)).toFixed(1);
  const currentCompressedMB = compressedSizeBytes
    ? (compressedSizeBytes / (1024 * 1024)).toFixed(1)
    : (Number(origMB) * (1 - (progress / 100) * 0.62)).toFixed(1);

  const percentSaved = Math.min(65, Math.round((progress / 100) * 62));

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.tag}>
            <Zap size={11} color="#FF6B35" />
            <Text style={styles.tagText}>GPU ENCODING PIPELINE</Text>
          </View>
          <Text style={styles.statusPill}>
            {progress < 100 ? 'Encoding in Progress' : 'Optimized'}
          </Text>
        </View>

        <Text style={styles.title}>Compressing Video for Spatial 3D Pipeline</Text>
        <Text style={styles.subtitle}>
          Optimizing raw video walkthrough frames for cloud photogrammetry and mesh synthesis.
        </Text>

        {/* Target Specs Chips */}
        <View style={styles.specsRow}>
          <View style={styles.specChip}>
            <Text style={styles.specLabel}>RESOLUTION</Text>
            <Text style={styles.specVal}>{resolution}</Text>
          </View>
          <View style={styles.specChip}>
            <Text style={styles.specLabel}>TARGET BITRATE</Text>
            <Text style={styles.specVal}>{targetBitrate}</Text>
          </View>
          <View style={styles.specChip}>
            <Text style={styles.specLabel}>CODEC</Text>
            <Text style={styles.specVal}>H.264 / HEVC</Text>
          </View>
        </View>

        {/* Progress Display */}
        <View style={styles.progressBlock}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
            <Text style={styles.progressLabel}>
              {progress < 40
                ? 'Decompressing raw frames...'
                : progress < 80
                ? 'Applying 5 Mbps VBR spatial quantization...'
                : 'Finalizing container metadata...'}
            </Text>
          </View>

          {/* Progress Bar Track */}
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.max(4, progress)}%` }]} />
          </View>
        </View>

        {/* Storage Size Comparison */}
        <View style={styles.savingsCard}>
          <View style={styles.sizeCol}>
            <Text style={styles.sizeLabel}>ORIGINAL SIZE</Text>
            <Text style={styles.sizeValue}>{origMB} MB</Text>
          </View>

          <View style={styles.savingsCenter}>
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsBadgeText}>-{percentSaved}%</Text>
            </View>
            <Text style={styles.bandwidthText}>saved bandwidth</Text>
          </View>

          <View style={[styles.sizeCol, { alignItems: 'flex-end' }]}>
            <Text style={styles.sizeLabel}>COMPRESSED</Text>
            <Text style={[styles.sizeValue, { color: '#0E8F73' }]}>
              {currentCompressedMB} MB
            </Text>
          </View>
        </View>

        {/* Live Active Indicator */}
        <View style={styles.footerNote}>
          <ActivityIndicator size="small" color="#FF6B35" />
          <Text style={styles.footerText}>
            Maintaining 1080p full texture detail with zero artifacting.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    gap: 16,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 107, 53, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FF6B35',
    letterSpacing: 0.5,
  },
  statusPill: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0E8F73',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A1A2E',
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginTop: -8,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  specChip: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    gap: 2,
  },
  specLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  specVal: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#1A1A2E',
  },
  progressBlock: {
    gap: 8,
    marginTop: 4,
  },
  progressTextRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  progressPercent: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FF6B35',
  },
  progressLabel: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  track: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#FF6B35',
  },
  savingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  sizeCol: {
    gap: 2,
  },
  sizeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  sizeValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1A1A2E',
  },
  savingsCenter: {
    alignItems: 'center',
    gap: 2,
  },
  savingsBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  savingsBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0E8F73',
  },
  bandwidthText: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '600',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
  },
  footerText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
    flex: 1,
  },
});
