import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { X, Sparkles, ArrowRight } from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { CampaignPopup } from '../../../types';

interface V4CampaignPopupModalProps {
  visible: boolean;
  campaign: CampaignPopup | null;
  onDismiss: () => void;
  onCta: (action: string) => void;
}

export const V4CampaignPopupModalComponent: React.FC<V4CampaignPopupModalProps> = ({
  visible,
  campaign,
  onDismiss,
  onCta,
}) => {
  if (!campaign) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Pressable
            style={styles.closeBtn}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Dismiss campaign"
          >
            <X size={18} color={V4_COLORS.textWhite} />
          </Pressable>

          {campaign.image_url && (
            <Image source={{ uri: campaign.image_url }} style={styles.bannerImage} />
          )}

          <View style={styles.content}>
            <View style={styles.badgeRow}>
              <Sparkles size={12} color={V4_COLORS.primary} />
              <Text style={styles.badgeText}>EXCLUSIVE CAMPAIGN</Text>
            </View>

            <Text style={styles.title}>{campaign.title}</Text>
            <Text style={styles.message}>{campaign.message}</Text>

            <Pressable
              style={styles.ctaButton}
              onPress={() => onCta(campaign.cta_action)}
              accessibilityRole="button"
            >
              <Text style={styles.ctaText}>{campaign.cta_label}</Text>
              <ArrowRight size={16} color={V4_COLORS.textWhite} />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const V4CampaignPopupModal = React.memo(V4CampaignPopupModalComponent);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.xl,
    overflow: 'hidden',
    ...V4_SHADOWS.lg,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: V4_RADIUS.sm,
    gap: 4,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  message: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 48,
    backgroundColor: V4_COLORS.primary,
    borderRadius: V4_RADIUS.md,
    gap: 6,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textWhite,
  },
});
