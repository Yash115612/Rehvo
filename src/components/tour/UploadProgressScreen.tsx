/**
 * REHVO AI Tour™ — Upload Progress Screen Component
 * Streams compressed walkthrough video to Supabase Storage bucket 'tour-videos'
 * Displays live progress percentage, upload speed in MB/s, ETA, Cancel & Retry,
 * and background upload status notification.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import {
  UploadCloud,
  Database,
  Wifi,
  Clock,
  XCircle,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  AlertCircle,
} from 'lucide-react-native';

export interface UploadProgressScreenProps {
  progress: number; // 0 to 100
  speedMbps: number;
  remainingSeconds: number;
  isCancelled: boolean;
  error: string | null;
  fileName: string;
  totalSizeBytes: number;
  bucketName?: string;
  onCancel: () => void;
  onRetry: () => void;
}

export const UploadProgressScreen: React.FC<UploadProgressScreenProps> = ({
  progress,
  speedMbps,
  remainingSeconds,
  isCancelled,
  error,
  fileName,
  totalSizeBytes,
  bucketName = 'tour-videos',
  onCancel,
  onRetry,
}) => {
  const totalMB = (totalSizeBytes / (1024 * 1024)).toFixed(1);
  const uploadedMB = ((totalSizeBytes * (progress / 100)) / (1024 * 1024)).toFixed(1);

  const formatETA = (sec: number) => {
    if (sec <= 0) return 'Few moments';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m > 0) return `${m}m ${s}s left`;
    return `${s}s left`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Bucket Badge Header */}
        <View style={styles.topHeader}>
          <View style={styles.bucketPill}>
            <Database size={12} color="#FF6B35" />
            <Text style={styles.bucketText}>Bucket: {bucketName}</Text>
          </View>
          <View style={styles.bgSyncBadge}>
            <Smartphone size={11} color="#0E8F73" />
            <Text style={styles.bgSyncText}>Background Upload Active</Text>
          </View>
        </View>

        {/* Status Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            {error || isCancelled
              ? 'Upload Interrupted'
              : progress >= 100
              ? 'Upload Completed!'
              : 'Uploading Video Asset'}
          </Text>
          <Text style={styles.fileNameText} numberOfLines={1}>
            {fileName} • {uploadedMB} / {totalMB} MB
          </Text>
        </View>

        {/* Circular / Large Progress Ring Display */}
        <View style={styles.progressCenterWrap}>
          <View
            style={[
              styles.circleRing,
              (error || isCancelled) && styles.circleRingError,
              progress >= 100 && styles.circleRingComplete,
            ]}
          >
            {error || isCancelled ? (
              <XCircle size={36} color="#DC2626" />
            ) : progress >= 100 ? (
              <CheckCircle2 size={40} color="#0E8F73" />
            ) : (
              <UploadCloud size={34} color="#FF6B35" strokeWidth={2.2} />
            )}
            <Text
              style={[
                styles.percentNumber,
                (error || isCancelled) && { color: '#DC2626' },
                progress >= 100 && { color: '#0E8F73' },
              ]}
            >
              {Math.round(progress)}%
            </Text>
          </View>
        </View>

        {/* Live Progress Bar */}
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              { width: `${Math.max(4, progress)}%` },
              (error || isCancelled) && { backgroundColor: '#DC2626' },
              progress >= 100 && { backgroundColor: '#0E8F73' },
            ]}
          />
        </View>

        {/* Live Speed & Remaining Time Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <View style={styles.statLabelRow}>
              <Wifi size={12} color="#64748B" />
              <Text style={styles.statLabel}>UPLOAD SPEED</Text>
            </View>
            <Text style={styles.statVal}>
              {error || isCancelled ? '0.0 MB/s' : `${speedMbps} MB/s`}
            </Text>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statLabelRow}>
              <Clock size={12} color="#64748B" />
              <Text style={styles.statLabel}>ESTIMATED TIME</Text>
            </View>
            <Text style={styles.statVal}>
              {error || isCancelled ? 'Paused' : formatETA(remainingSeconds)}
            </Text>
          </View>
        </View>

        {/* Background Support Guarantee */}
        <View style={styles.guaranteeBox}>
          <ShieldCheck size={14} color="#0E8F73" />
          <Text style={styles.guaranteeText}>
            Safe to minimize or switch apps. Upload pipeline continues asynchronously in the background.
          </Text>
        </View>

        {/* Error or Cancelled Banner */}
        {(error || isCancelled) && (
          <View style={styles.errorBox}>
            <AlertCircle size={15} color="#DC2626" />
            <Text style={styles.errorText}>
              {error || 'Upload cancelled by user.'}
            </Text>
          </View>
        )}

        {/* Action Buttons: Cancel & Retry */}
        <View style={styles.actionsRow}>
          {error || isCancelled ? (
            <Pressable style={styles.retryBtn} onPress={onRetry}>
              <RotateCcw size={16} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.retryBtnText}>Retry Upload</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.cancelBtn} onPress={onCancel}>
              <XCircle size={16} color="#64748B" strokeWidth={2} />
              <Text style={styles.cancelBtnText}>Cancel Upload</Text>
            </Pressable>
          )}
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bucketPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bucketText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FF6B35',
  },
  bgSyncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bgSyncText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0E8F73',
  },
  titleSection: {
    gap: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A1A2E',
    textAlign: 'center',
  },
  fileNameText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
  progressCenterWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  circleRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#FF6B35',
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  circleRingError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  circleRingComplete: {
    borderColor: '#0E8F73',
    backgroundColor: '#ECFDF5',
  },
  percentNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FF6B35',
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
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    gap: 4,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  statVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1A1A2E',
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 10,
    borderRadius: 12,
  },
  guaranteeText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
    flex: 1,
    lineHeight: 15,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 10,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 11.5,
    color: '#B91C1C',
    fontWeight: '700',
    flex: 1,
  },
  actionsRow: {
    marginTop: 4,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 14,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FF6B35',
    paddingVertical: 13,
    borderRadius: 14,
  },
  retryBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
