import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { DownloadCloud, Sparkles, X, ArrowRight } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { openAppStore } from '../../../services/appUpdateService';

interface V4AppUpdateModalProps {
  visible: boolean;
  isForceUpdate: boolean;
  latestVersion: string;
  releaseNotes?: string;
  storeUrl?: string;
  onDismiss: () => void;
}

export const V4AppUpdateModalComponent: React.FC<V4AppUpdateModalProps> = ({
  visible,
  isForceUpdate,
  latestVersion,
  releaseNotes,
  storeUrl,
  onDismiss,
}) => {
  const handleUpdate = useCallback(() => {
    openAppStore(storeUrl);
  }, [storeUrl]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={isForceUpdate ? undefined : onDismiss}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {!isForceUpdate && (
            <Pressable
              style={styles.closeBtn}
              onPress={onDismiss}
              accessibilityRole="button"
            >
              <X size={18} color={V4_COLORS.textSecondary} />
            </Pressable>
          )}

          <View style={styles.iconBox}>
            <DownloadCloud size={32} color={V4_COLORS.primary} />
          </View>

          <View style={styles.badgeRow}>
            <Sparkles size={12} color={V4_COLORS.primary} />
            <Text style={styles.badgeText}>VERSION {latestVersion}</Text>
          </View>

          <Text style={styles.title}>
            {isForceUpdate ? 'Important Update Required' : 'New REHVO Update Ready'}
          </Text>

          <Text style={styles.description}>
            {releaseNotes ||
              'Includes high-performance FlashList optimizations, biometric hardware lock, instant zero-fee UPI rent payments, and new verified properties.'}
          </Text>

          <View style={styles.actionButtons}>
            {!isForceUpdate && (
              <Pressable
                style={styles.laterBtn}
                onPress={onDismiss}
                accessibilityRole="button"
              >
                <Text style={styles.laterBtnText}>Maybe Later</Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.updateBtn, isForceUpdate && { flex: 1 }]}
              onPress={handleUpdate}
              accessibilityRole="button"
            >
              <Text style={styles.updateBtnText}>Update Now</Text>
              <ArrowRight size={16} color={V4_COLORS.textWhite} />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const V4AppUpdateModal = React.memo(V4AppUpdateModalComponent);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.xl,
    padding: 24,
    alignItems: 'center',
    ...V4_SHADOWS.lg,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: V4_COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: V4_RADIUS.sm,
    gap: 4,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  laterBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: V4_RADIUS.md,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  laterBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  updateBtn: {
    flex: 1.5,
    flexDirection: 'row',
    minHeight: 48,
    borderRadius: V4_RADIUS.md,
    backgroundColor: V4_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  updateBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textWhite,
  },
});
