/**
 * V4UploadProgressCard — Upload status, progress indicator, and retry controller
 * Luxury Emerald progress bar, thumbnail preview, retry, and cancellation handling.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { CheckCircle2, AlertCircle, RefreshCw, X, FileText } from 'lucide-react-native';
import { V4_COLORS } from '../../../theme/v4Theme';
import { MediaUploadStatus } from '../../../types';

interface V4UploadProgressCardProps {
  fileName: string;
  fileSizeText?: string;
  thumbnailUri?: string;
  status: MediaUploadStatus;
  progressPercent: number;
  errorMessage?: string;
  onRetry?: () => void;
  onCancel?: () => void;
}

export const V4UploadProgressCard: React.FC<V4UploadProgressCardProps> = React.memo(({
  fileName,
  fileSizeText,
  thumbnailUri,
  status,
  progressPercent,
  errorMessage,
  onRetry,
  onCancel,
}) => {
  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';
  const isUploading = status === 'uploading' || status === 'pending';

  return (
    <View style={styles.card}>
      <View style={styles.contentRow}>
        {/* Thumbnail or File Icon */}
        <View style={styles.thumbnailBox}>
          {thumbnailUri ? (
            <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} />
          ) : (
            <FileText size={22} color={V4_COLORS.primary} />
          )}
        </View>

        {/* Info Column */}
        <View style={styles.infoCol}>
          <Text style={styles.fileName} numberOfLines={1}>
            {fileName}
          </Text>
          <View style={styles.statusRow}>
            {fileSizeText ? (
              <Text style={styles.fileSize}>{fileSizeText} • </Text>
            ) : null}
            <Text
              style={[
                styles.statusText,
                isCompleted && styles.statusCompleted,
                isFailed && styles.statusFailed,
                isUploading && styles.statusUploading,
              ]}
            >
              {isCompleted
                ? 'Uploaded successfully'
                : isFailed
                ? errorMessage || 'Upload failed'
                : `Uploading ${progressPercent}%`}
            </Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.actionCol}>
          {isCompleted && (
            <CheckCircle2 size={22} color={V4_COLORS.success} />
          )}

          {isFailed && onRetry && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={onRetry}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Retry upload"
            >
              <RefreshCw size={20} color={V4_COLORS.primary} />
            </TouchableOpacity>
          )}

          {isUploading && onCancel && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={onCancel}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Cancel upload"
            >
              <X size={20} color={V4_COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Progress Bar */}
      {isUploading && (
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(100, Math.max(0, progressPercent))}%` },
            ]}
          />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: V4_COLORS.borderLight,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumbnailBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: V4_COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  infoCol: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
    marginBottom: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileSize: {
    fontSize: 12,
    color: V4_COLORS.textMuted,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusCompleted: {
    color: V4_COLORS.success,
  },
  statusFailed: {
    color: V4_COLORS.danger,
  },
  statusUploading: {
    color: V4_COLORS.primary,
  },
  actionCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: V4_COLORS.surfaceSubtle,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: V4_COLORS.primary,
    borderRadius: 2,
  },
});
