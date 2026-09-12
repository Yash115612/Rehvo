import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Crown,
  Zap,
  ShieldCheck,
  Check,
  ChevronRight,
  X,
  Building2,
  Sparkles,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';

interface V4HostPlanGateModalProps {
  visible: boolean;
  onClose: () => void;
  reason?: 'NO_PLAN' | 'LIMIT_REACHED';
}

export const V4HostPlanGateModal: React.FC<V4HostPlanGateModalProps> = ({
  visible,
  onClose,
  reason = 'LIMIT_REACHED',
}) => {
  const router = useRouter();
  const { activeHostPlan, myProperties } = useAppStore();

  const handleUpgrade = () => {
    onClose();
    setTimeout(() => {
      router.push('/(renter)/host-plans' as any);
    }, 150);
  };

  const handleManage = () => {
    onClose();
    setTimeout(() => {
      router.push('/(renter)/manage-properties' as any);
    }, 150);
  };

  const isLimitReached = reason === 'LIMIT_REACHED' || myProperties.length >= 1;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          {/* Top Handle */}
          <View style={styles.dragHandle} />

          {/* Close Button */}
          <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={10}>
            <X size={18} color="#031B2A" strokeWidth={2.4} />
          </Pressable>

          {/* Icon Badge */}
          <View style={styles.iconCircle}>
            <Crown size={28} color="#0F766E" strokeWidth={2.4} />
          </View>

          {/* Title & Subtitle */}
          <View style={styles.headerTextWrap}>
            <View style={styles.badgePill}>
              <Sparkles size={11} color="#92400E" strokeWidth={2.5} />
              <Text style={styles.badgePillText}>
                {isLimitReached ? 'LISTING LIMIT REACHED' : 'HOST PLAN REQUIRED'}
              </Text>
            </View>

            <Text style={styles.title}>
              {isLimitReached ? 'Upgrade to List More Properties' : 'Choose an Active Host Plan'}
            </Text>

            <Text style={styles.subtitle}>
              {isLimitReached
                ? `You've used all listing slots on your current ${
                    activeHostPlan ? activeHostPlan.toUpperCase() : 'STARTER'
                  } plan (${myProperties.length} active). Upgrade now to post more homes with verified listing.`
                : 'Publish your properties with verified reach, priority ranking & direct tenant inquiries.'}
            </Text>
          </View>

          {/* Perks Summary Box */}
          <View style={styles.perksBox}>
            <View style={styles.perkRow}>
              <View style={styles.checkDot}>
                <Check size={11} color="#0F766E" strokeWidth={3} />
              </View>
              <Text style={styles.perkText}>
                <Text style={{ fontWeight: '800' }}>3x More Views</Text> with priority locality ranking
              </Text>
            </View>

            <View style={styles.perkRow}>
              <View style={styles.checkDot}>
                <Check size={11} color="#0F766E" strokeWidth={3} />
              </View>
              <Text style={styles.perkText}>
                <Text style={{ fontWeight: '800' }}>DigiLocker Verified Badge</Text> for instant tenant trust
              </Text>
            </View>

            <View style={styles.perkRow}>
              <View style={styles.checkDot}>
                <Check size={11} color="#0F766E" strokeWidth={3} />
              </View>
              <Text style={styles.perkText}>
                <Text style={{ fontWeight: '800' }}>Direct WhatsApp & Calls</Text> without middleman brokers
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <Pressable style={styles.primaryBtn} onPress={handleUpgrade}>
              <Zap size={16} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.primaryBtnText}>View Host Plans (From ₹299/mo)</Text>
              <ChevronRight size={15} color="#FFFFFF" strokeWidth={2.6} />
            </Pressable>

            <Pressable style={styles.secondaryBtn} onPress={handleManage}>
              <Building2 size={15} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.secondaryBtnText}>Manage Existing Listings</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    gap: 14,
    ...V4_SHADOWS.floating,
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2ECEF',
    alignSelf: 'center',
    marginBottom: 4,
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 4,
  },
  headerTextWrap: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  badgePillText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#92400E',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
  },
  perksBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2ECEF',
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkText: {
    fontSize: 12,
    color: V4_COLORS.textPrimary,
    flex: 1,
  },
  actionsContainer: {
    gap: 8,
    marginTop: 4,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    paddingVertical: 13,
    borderRadius: 16,
    gap: 6,
    ...V4_SHADOWS.soft,
  },
  primaryBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    gap: 6,
  },
  secondaryBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
  },
});
