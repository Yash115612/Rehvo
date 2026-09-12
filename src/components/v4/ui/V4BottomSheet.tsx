import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { V4_COLORS, V4_RADIUS } from '../../../theme/v4Theme';
import { triggerHaptic } from '../../../utils/haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface V4BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxHeightRatio?: number;
  footer?: React.ReactNode;
  testID?: string;
}

export const V4BottomSheetComponent: React.FC<V4BottomSheetProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  maxHeightRatio = 0.85,
  footer,
  testID,
}) => {
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    triggerHaptic('light');
    onClose();
  };

  return (
    <Modal
      testID={testID}
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <Pressable
          style={styles.backdrop}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss sheet overlay"
        >
          <Pressable
            accessibilityRole="alert"
            style={[styles.sheet, { maxHeight: SCREEN_HEIGHT * maxHeightRatio }]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Top Glass Specular Line */}
            <View style={styles.topSpecular} />

            {/* Top Glass Handle Bar */}
            <View style={styles.handle} />

            {/* Sheet Frosted Header */}
            {(title || subtitle) && (
              <BlurView
                intensity={Platform.OS === 'ios' ? 60 : 75}
                tint="light"
                style={styles.header}
              >
                <View style={styles.titleCol}>
                  {title && <Text style={styles.title}>{title}</Text>}
                  {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>

                <Pressable
                  style={styles.closeBtn}
                  onPress={handleClose}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Close bottom sheet"
                >
                  <X size={16} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
                </Pressable>
              </BlurView>
            )}

            {/* Body Content */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.scrollBody,
                !footer && { paddingBottom: Math.max(insets.bottom, 20) },
              ]}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>

            {/* Sticky Bottom Footer Actions with Safe Area Insets */}
            {footer && (
              <View style={[styles.footerWrap, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                {footer}
              </View>
            )}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export const V4BottomSheet = React.memo(V4BottomSheetComponent);

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.50)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: V4_RADIUS.sheet,
    borderTopRightRadius: V4_RADIUS.sheet,
    paddingTop: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.90)',
    shadowColor: '#031B2A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 20,
    overflow: 'hidden',
  },
  topSpecular: {
    position: 'absolute',
    top: 0,
    left: 40,
    right: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 1,
    zIndex: 10,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 236, 239, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  titleCol: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(241, 245, 249, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 16,
  },
  footerWrap: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
});

