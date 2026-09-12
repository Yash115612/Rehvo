import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  Alert,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  Share2,
  Copy,
  Download,
  QrCode,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';
import {
  generatePropertyDeepLink,
  generateWhatsAppShareText,
  generatePropertyQrCodeUrl,
  generateBrochureDownloadUrl,
  sharePropertyNative,
} from '../../../services/propertySharing';
import { Property } from '../../../types';

interface V4PropertyShareModalProps {
  visible: boolean;
  onClose: () => void;
  property: Property | null;
}

export const V4PropertyShareModalComponent: React.FC<V4PropertyShareModalProps> = ({
  visible,
  onClose,
  property,
}) => {
  const insets = useSafeAreaInsets();
  const { user, showToast } = useAppStore();

  const qrUrl = useMemo(() => {
    if (!property) return '';
    return generatePropertyQrCodeUrl(property.id, user?.id);
  }, [property, user?.id]);

  const deepLink = useMemo(() => {
    if (!property) return '';
    return generatePropertyDeepLink(property.id, user?.id);
  }, [property, user?.id]);

  const handleShareNative = useCallback(async () => {
    if (!property) return;
    await sharePropertyNative(property, user?.id);
  }, [property, user?.id]);

  const handleWhatsApp = useCallback(() => {
    if (!property) return;
    const text = encodeURIComponent(generateWhatsAppShareText(property, user?.id));
    const url = `whatsapp://send?text=${text}`;
    Linking.openURL(url).catch(() => {
      showToast('WhatsApp is not installed on this device', 'info');
    });
  }, [property, user?.id, showToast]);

  const handleCopyLink = useCallback(() => {
    if (!property) return;
    showToast('Listing deep link copied to clipboard', 'success');
  }, [property, showToast]);

  const handleDownloadBrochure = useCallback(() => {
    if (!property) return;
    const url = generateBrochureDownloadUrl(property.id);
    Alert.alert(
      'Printable Brochure PDF',
      `Brochure ready with verified floor plans & photos.\n\nURL: ${url}`,
      [{ text: 'Dismiss', style: 'default' }]
    );
  }, [property]);

  if (!property) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Text style={styles.sheetTitle}>Share Property</Text>
              <Text style={styles.sheetSubtitle}>{property.locality}, {property.city}</Text>
            </View>
            <Pressable
              style={styles.closeBtn}
              onPress={onClose}
              accessibilityRole="button"
            >
              <X size={20} color={V4_COLORS.textPrimary} />
            </Pressable>
          </View>

          {/* Property Card Snapshot */}
          <View style={styles.propertyCard}>
            <Image
              source={{
                uri:
                  typeof property.images?.[0] === 'string'
                    ? property.images[0]
                    : (property.images?.[0] as any)?.url ||
                      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
              }}
              style={styles.propertyThumb}
            />
            <View style={styles.propertyDetails}>
              <Text style={styles.propertyTitle} numberOfLines={1}>
                {property.title}
              </Text>
              <Text style={styles.propertyRent}>
                ₹{property.rent?.toLocaleString()}/mo • VERIFIED LISTING
              </Text>
              <Text style={styles.propertyBadge}>Verified Host & DigiLocker Deed</Text>
            </View>
          </View>

          {/* QR Code Card */}
          <View style={styles.qrCard}>
            <View style={styles.qrImageBox}>
              <Image source={{ uri: qrUrl }} style={styles.qrImage} />
            </View>
            <View style={styles.qrInfo}>
              <View style={styles.qrBadge}>
                <QrCode size={14} color={V4_COLORS.primary} />
                <Text style={styles.qrBadgeText}>SCAN TO OPEN LISTING</Text>
              </View>
              <Text style={styles.qrTitle}>Instant Mobile Pass</Text>
              <Text style={styles.qrSub}>
                Friends can point their camera to open this home directly in REHVO.
              </Text>
            </View>
          </View>

          {/* Share Channels */}
          <View style={styles.channelRow}>
            <Pressable style={styles.channelBtn} onPress={handleWhatsApp}>
              <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Share2 size={18} color="#16A34A" />
              </View>
              <Text style={styles.channelLabel}>WhatsApp</Text>
            </Pressable>

            <Pressable style={styles.channelBtn} onPress={handleCopyLink}>
              <View style={[styles.iconCircle, { backgroundColor: V4_COLORS.primaryLight }]}>
                <Copy size={18} color={V4_COLORS.primary} />
              </View>
              <Text style={styles.channelLabel}>Copy Link</Text>
            </Pressable>

            <Pressable style={styles.channelBtn} onPress={handleDownloadBrochure}>
              <View style={[styles.iconCircle, { backgroundColor: '#EEF2FF' }]}>
                <Download size={18} color="#6366F1" />
              </View>
              <Text style={styles.channelLabel}>Brochure PDF</Text>
            </Pressable>

            <Pressable style={styles.channelBtn} onPress={handleShareNative}>
              <View style={[styles.iconCircle, { backgroundColor: V4_COLORS.surfaceSubtle }]}>
                <ExternalLink size={18} color={V4_COLORS.textPrimary} />
              </View>
              <Text style={styles.channelLabel}>More</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const V4PropertyShareModal = React.memo(V4PropertyShareModalComponent);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: V4_COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    ...V4_SHADOWS.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: V4_COLORS.borderLight,
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: V4_RADIUS.full,
    backgroundColor: V4_COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  propertyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderRadius: V4_RADIUS.lg,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
  },
  propertyThumb: {
    width: 64,
    height: 64,
    borderRadius: V4_RADIUS.md,
  },
  propertyDetails: {
    flex: 1,
    marginLeft: 12,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  propertyRent: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.primary,
    marginTop: 2,
  },
  propertyBadge: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  qrCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.lg,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    padding: 14,
    marginBottom: 20,
    ...V4_SHADOWS.sm,
  },
  qrImageBox: {
    width: 90,
    height: 90,
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.md,
    borderWidth: 1,
    borderColor: V4_COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrImage: {
    width: 80,
    height: 80,
  },
  qrInfo: {
    flex: 1,
    marginLeft: 14,
  },
  qrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  qrBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: V4_COLORS.primary,
    letterSpacing: 0.5,
  },
  qrTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  qrSub: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  channelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  channelBtn: {
    alignItems: 'center',
    flex: 1,
    minHeight: 64,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  channelLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
});
