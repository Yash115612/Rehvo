// ==============================================================================
// REHVO V5.4.1 — NOTIFICATION PERMISSION EXPLAINER MODAL (EMERALD LUXURY)
// Two-step permission UX: Brand explanation before native system prompt
// ==============================================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import {
  Bell,
  MessageSquare,
  CalendarCheck,
  Gift,
  ShieldCheck,
  X,
  Sparkles,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';

interface V4NotificationPermissionModalProps {
  visible: boolean;
  onAllow: () => void;
  onDismiss: () => void;
}

export const V4NotificationPermissionModal: React.FC<V4NotificationPermissionModalProps> = ({
  visible,
  onAllow,
  onDismiss,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* TOP CLOSE BUTTON */}
          <Pressable
            style={styles.closeBtn}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Dismiss notification prompt"
          >
            <X size={20} color={V4_COLORS.textMuted} />
          </Pressable>

          {/* ICON & BADGE */}
          <View style={styles.iconContainer}>
            <View style={styles.iconBg}>
              <Bell size={32} color="#0F766E" strokeWidth={2.4} />
            </View>
            <View style={styles.badgePill}>
              <Sparkles size={11} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.badgeText}>REALTIME ALERTS</Text>
            </View>
          </View>

          {/* HEADINGS */}
          <Text style={styles.title}>Turn on Push Notifications</Text>
          <Text style={styles.subtitle}>
            Never miss critical updates about your home, scheduled visits, and instant cashback rewards.
          </Text>

          {/* VALUE PROPOSITION LIST */}
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <View style={[styles.benefitIcon, { backgroundColor: '#F0FDFA' }]}>
                <MessageSquare size={16} color="#0F766E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.benefitTitle}>Chat & Flatmate Waves</Text>
                <Text style={styles.benefitDesc}>
                  Instant replies from verified landlords, prospective flatmates, and maintenance technicians.
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <View style={[styles.benefitIcon, { backgroundColor: '#EFF6FF' }]}>
                <CalendarCheck size={16} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.benefitTitle}>Visit Approvals & Gatepasses</Text>
                <Text style={styles.benefitDesc}>
                  Get 1-hour visit arrival alerts and instant 6-digit society gate entry passes.
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <View style={[styles.benefitIcon, { backgroundColor: '#FEF3C7' }]}>
                <Gift size={16} color="#D97706" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.benefitTitle}>Cashback, RentPay & Due Dates</Text>
                <Text style={styles.benefitDesc}>
                  Credit alerts for R-Cash rewards, scratch cards, and automatic rent due reminders.
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <View style={[styles.benefitIcon, { backgroundColor: '#F5F3FF' }]}>
                <ShieldCheck size={16} color="#7C3AED" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.benefitTitle}>Trust & Safety Center</Text>
                <Text style={styles.benefitDesc}>
                  Important security broadcasts, verified lease updates, and building emergency notices.
                </Text>
              </View>
            </View>
          </View>

          {/* ACTION BUTTONS */}
          <Pressable
            style={styles.primaryBtn}
            onPress={onAllow}
            accessibilityRole="button"
            accessibilityLabel="Allow notifications"
          >
            <Text style={styles.primaryBtnText}>Enable Notifications</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Maybe later"
          >
            <Text style={styles.secondaryBtnText}>Maybe Later</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 27, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 34,
    alignItems: 'center',
    position: 'relative',
    ...V4_SHADOWS.card,
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    zIndex: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  iconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
    marginBottom: 18,
  },
  benefitsList: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  benefitDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#0F766E',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    marginBottom: 8,
    ...V4_SHADOWS.soft,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});
