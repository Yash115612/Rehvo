import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import {
  Home,
  Users,
  Building2,
  X,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Crown,
  Zap,
  Check,
  ArrowLeft,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';

interface V4PostActionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const V4PostActionModal: React.FC<V4PostActionModalProps> = ({
  visible,
  onClose,
}) => {
  const router = useRouter();
  const { canListNewProperty, activeHostPlan, myProperties } = useAppStore();
  const [viewMode, setViewMode] = useState<'menu' | 'gate'>('menu');
  const [gateReason, setGateReason] = useState<'NO_PLAN' | 'LIMIT_REACHED'>('LIMIT_REACHED');

  useEffect(() => {
    if (visible) {
      setViewMode('menu');
    }
  }, [visible]);

  const handleAction = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 120);
  };

  const handlePropertyListPress = (route: string) => {
    const check = canListNewProperty();
    if (!check.allowed) {
      setGateReason(check.reason || 'LIMIT_REACHED');
      setViewMode('gate');
      return;
    }
    handleAction(route);
  };

  const isLimitReached = gateReason === 'LIMIT_REACHED' || myProperties.length >= 1;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.sheetContainer}>
          {/* Top Specular Reflection Highlight */}
          <View style={styles.topSpecular} />

          {/* Top Liquid Glass Drag Handle */}
          <View style={styles.dragHandle} />

          {viewMode === 'menu' ? (
            <>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTextWrap}>
                  <View style={styles.headerBadge}>
                    <Sparkles size={13} color={V4_COLORS.primary} />
                    <Text style={styles.headerBadgeText}>POST & CONNECT</Text>
                  </View>
                  <Text style={styles.title}>What would you like to post?</Text>
                  <Text style={styles.subtitle}>
                    Reach 50,000+ verified tenants & flatmate seekers with ₹verified listings.
                  </Text>
                </View>

                <Pressable
                  style={styles.closeBtn}
                  onPress={onClose}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <X size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
                </Pressable>
              </View>

              {/* Options List */}
              <View style={styles.optionsContainer}>
                {/* Option 1: List Property */}
                <Pressable
                  style={({ pressed }) => [
                    styles.optionCard,
                    styles.optionCardTeal,
                    pressed && styles.optionCardPressed,
                  ]}
                  onPress={() => handlePropertyListPress('/(renter)/listing')}
                >
                  <View style={[styles.iconCircle, { backgroundColor: '#0F766E' }]}>
                    <Home size={22} color="#FFFFFF" strokeWidth={2.2} />
                  </View>

                  <View style={styles.optionContent}>
                    <View style={styles.optionHeaderRow}>
                      <Text style={styles.optionTitle}>List Property for Rent / PG</Text>
                      <View style={styles.tagPill}>
                        <Text style={styles.tagPillText}>Verified Listing</Text>
                      </View>
                    </View>
                    <Text style={styles.optionDescription}>
                      Flats, apartments, villas, independent houses, or PG rooms.
                    </Text>
                  </View>

                  <ChevronRight size={18} color={V4_COLORS.textSecondary} strokeWidth={2.2} />
                </Pressable>

                {/* Option 2: Create Flatmate Profile */}
                <Pressable
                  style={({ pressed }) => [
                    styles.optionCard,
                    styles.optionCardIndigo,
                    pressed && styles.optionCardPressed,
                  ]}
                  onPress={() => handleAction('/(renter)/flatmate/create')}
                >
                  <View style={[styles.iconCircle, { backgroundColor: '#0284C7' }]}>
                    <Users size={22} color="#FFFFFF" strokeWidth={2.2} />
                  </View>

                  <View style={styles.optionContent}>
                    <View style={styles.optionHeaderRow}>
                      <Text style={styles.optionTitle}>Create Flatmate Profile</Text>
                      <View style={[styles.tagPill, { backgroundColor: '#E0F2FE' }]}>
                        <Text style={[styles.tagPillText, { color: '#0284C7' }]}>Find Roommate</Text>
                      </View>
                    </View>
                    <Text style={styles.optionDescription}>
                      Set your budget, lifestyle preferences & find matching roommates.
                    </Text>
                  </View>

                  <ChevronRight size={18} color={V4_COLORS.textSecondary} strokeWidth={2.2} />
                </Pressable>

                {/* Option 3: List Commercial Space */}
                <Pressable
                  style={({ pressed }) => [
                    styles.optionCard,
                    styles.optionCardAmber,
                    pressed && styles.optionCardPressed,
                  ]}
                  onPress={() => handlePropertyListPress('/(renter)/commercial')}
                >
                  <View style={[styles.iconCircle, { backgroundColor: '#0D9488' }]}>
                    <Building2 size={22} color="#FFFFFF" strokeWidth={2.2} />
                  </View>

                  <View style={styles.optionContent}>
                    <View style={styles.optionHeaderRow}>
                      <Text style={styles.optionTitle}>List Commercial Space</Text>
                      <View style={[styles.tagPill, { backgroundColor: '#CCFBF1' }]}>
                        <Text style={[styles.tagPillText, { color: '#0F766E' }]}>Commercial</Text>
                      </View>
                    </View>
                    <Text style={styles.optionDescription}>
                      Corporate offices, retail shops, showrooms, coworking & plots.
                    </Text>
                  </View>

                  <ChevronRight size={18} color={V4_COLORS.textSecondary} strokeWidth={2.2} />
                </Pressable>
              </View>

              {/* Guarantee Footer */}
              <View style={styles.footerTrust}>
                <ShieldCheck size={16} color={V4_COLORS.primary} strokeWidth={2.2} />
                <Text style={styles.footerTrustText}>
                  100% Verified Listings • Instant Approval • Zero Hidden Fees
                </Text>
              </View>
            </>
          ) : (
            <>
              {/* Gate View: Header with Back & Close */}
              <View style={styles.gateTopBar}>
                <Pressable
                  style={styles.gateBackBtn}
                  onPress={() => setViewMode('menu')}
                  hitSlop={8}
                >
                  <ArrowLeft size={16} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
                  <Text style={styles.gateBackText}>Back</Text>
                </Pressable>

                <Pressable
                  style={styles.closeBtn}
                  onPress={onClose}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <X size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
                </Pressable>
              </View>

              {/* Icon Badge */}
              <View style={styles.gateIconCircle}>
                <Crown size={28} color="#0F766E" strokeWidth={2.4} />
              </View>

              {/* Gate Title & Subtitle */}
              <View style={styles.gateHeaderTextWrap}>
                <View style={styles.gateBadgePill}>
                  <Sparkles size={11} color="#92400E" strokeWidth={2.5} />
                  <Text style={styles.gateBadgePillText}>
                    {isLimitReached ? 'LISTING LIMIT REACHED' : 'HOST PLAN REQUIRED'}
                  </Text>
                </View>

                <Text style={styles.gateTitle}>
                  {isLimitReached ? 'Upgrade to List More Properties' : 'Choose an Active Host Plan'}
                </Text>

                <Text style={styles.gateSubtitle}>
                  {isLimitReached
                    ? `You've used all listing slots on your current ${
                        activeHostPlan ? activeHostPlan.toUpperCase() : 'STARTER'
                      } plan (${myProperties.length} active). Upgrade now to post more homes with verified listing.`
                    : 'Publish your properties with verified reach, priority ranking & direct tenant inquiries.'}
                </Text>
              </View>

              {/* Perks Summary Box */}
              <View style={styles.gatePerksBox}>
                <View style={styles.gatePerkRow}>
                  <View style={styles.gateCheckDot}>
                    <Check size={11} color="#0F766E" strokeWidth={3} />
                  </View>
                  <Text style={styles.gatePerkText}>
                    <Text style={{ fontWeight: '800' }}>3x More Views</Text> with priority locality ranking
                  </Text>
                </View>

                <View style={styles.gatePerkRow}>
                  <View style={styles.gateCheckDot}>
                    <Check size={11} color="#0F766E" strokeWidth={3} />
                  </View>
                  <Text style={styles.gatePerkText}>
                    <Text style={{ fontWeight: '800' }}>DigiLocker Verified Badge</Text> for instant tenant trust
                  </Text>
                </View>

                <View style={styles.gatePerkRow}>
                  <View style={styles.gateCheckDot}>
                    <Check size={11} color="#0F766E" strokeWidth={3} />
                  </View>
                  <Text style={styles.gatePerkText}>
                    <Text style={{ fontWeight: '800' }}>Direct WhatsApp & Calls</Text> without middleman fees
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.gateActionsContainer}>
                <Pressable
                  style={styles.gatePrimaryBtn}
                  onPress={() => handleAction('/(renter)/host-plans')}
                >
                  <Zap size={16} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.gatePrimaryBtnText}>View Host Plans (From ₹299/mo)</Text>
                  <ChevronRight size={15} color="#FFFFFF" strokeWidth={2.6} />
                </Pressable>

                <Pressable
                  style={styles.gateSecondaryBtn}
                  onPress={() => handleAction('/(renter)/manage-properties')}
                >
                  <Building2 size={15} color="#0F766E" strokeWidth={2.4} />
                  <Text style={styles.gateSecondaryBtnText}>Manage Existing Listings</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.90)',
    shadowColor: '#031B2A',
    shadowOffset: { width: 0, height: -8 },
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
  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E6F4F1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: V4_COLORS.primary,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: V4_COLORS.textSecondary,
    lineHeight: 17,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(241, 245, 249, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 18,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#EAE5D9',
  },
  optionCardTeal: {
    borderColor: '#CCFBF1',
    backgroundColor: '#F0FDFA',
  },
  optionCardIndigo: {
    borderColor: '#E0F2FE',
    backgroundColor: '#F8FAFC',
  },
  optionCardAmber: {
    borderColor: '#E2ECEF',
    backgroundColor: '#FAF8F5',
  },
  optionCardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#031B2A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  optionContent: {
    flex: 1,
    marginRight: 8,
  },
  optionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
    flexWrap: 'wrap',
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  tagPill: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  optionDescription: {
    fontSize: 11,
    fontWeight: '500',
    color: V4_COLORS.textSecondary,
    lineHeight: 15,
  },
  footerTrust: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerTrustText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  // Gate View Styles
  gateTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gateBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  gateBackText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  gateIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 2,
  },
  gateHeaderTextWrap: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    marginTop: 10,
  },
  gateBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  gateBadgePillText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#92400E',
    letterSpacing: 0.6,
  },
  gateTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  gateSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
  },
  gatePerksBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2ECEF',
    marginTop: 12,
  },
  gatePerkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gateCheckDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gatePerkText: {
    fontSize: 12,
    color: V4_COLORS.textPrimary,
    flex: 1,
  },
  gateActionsContainer: {
    gap: 8,
    marginTop: 14,
    marginBottom: 4,
  },
  gatePrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    paddingVertical: 13,
    borderRadius: 16,
    gap: 6,
    ...V4_SHADOWS.soft,
  },
  gatePrimaryBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  gateSecondaryBtn: {
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
  gateSecondaryBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
  },
});
