import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS, V4_SPACING } from '../../../theme/v4Theme';
import { V4Button, V4ButtonVariant } from './V4Button';
import { triggerHaptic } from '../../../utils/haptics';

export interface V4ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  primaryActionVariant?: V4ButtonVariant;
  primaryActionLoading?: boolean;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  dismissible?: boolean;
  testID?: string;
}

export const V4ModalComponent: React.FC<V4ModalProps> = ({
  visible,
  onClose,
  title,
  description,
  children,
  icon,
  primaryActionLabel,
  onPrimaryAction,
  primaryActionVariant = 'primary',
  primaryActionLoading = false,
  secondaryActionLabel,
  onSecondaryAction,
  dismissible = true,
  testID,
}) => {
  const handleClose = () => {
    if (!dismissible) return;
    triggerHaptic('light');
    onClose();
  };

  return (
    <Modal
      testID={testID}
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={handleClose}
        accessibilityRole="button"
        accessibilityLabel="Dismiss modal backdrop"
      >
        <Pressable
          accessibilityRole="alert"
          style={styles.dialog}
          onPress={(e) => e.stopPropagation()}
        >
          {dismissible && (
            <Pressable
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={handleClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
            >
              <X size={18} color={V4_COLORS.textSecondary} />
            </Pressable>
          )}

          {icon && <View style={styles.iconBox}>{icon}</View>}

          <Text style={styles.title}>{title}</Text>

          {description && <Text style={styles.description}>{description}</Text>}

          {children && <View style={styles.body}>{children}</View>}

          {(primaryActionLabel || secondaryActionLabel) && (
            <View style={styles.actionRow}>
              {secondaryActionLabel && onSecondaryAction && (
                <View style={styles.btnCol}>
                  <V4Button
                    title={secondaryActionLabel}
                    variant="outline"
                    size="md"
                    fullWidth
                    onPress={onSecondaryAction}
                  />
                </View>
              )}

              {primaryActionLabel && onPrimaryAction && (
                <View style={styles.btnCol}>
                  <V4Button
                    title={primaryActionLabel}
                    variant={primaryActionVariant}
                    loading={primaryActionLoading}
                    size="md"
                    fullWidth
                    onPress={onPrimaryAction}
                  />
                </View>
              )}
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export const V4Modal = React.memo(V4ModalComponent);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: V4_COLORS.overlayDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: V4_SPACING.xl,
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    padding: V4_SPACING.xl,
    borderWidth: 1.2,
    borderColor: V4_COLORS.borderLight,
    ...V4_SHADOWS.floating,
    position: 'relative',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: V4_COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: V4_COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: V4_SPACING.md,
  },
  title: {
    fontSize: 19,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  body: {
    width: '100%',
    marginVertical: V4_SPACING.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    marginTop: V4_SPACING.lg,
  },
  btnCol: {
    flex: 1,
  },
});
