import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Crown,
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  Building2,
  Users,
  CheckCircle2,
  Lock,
  PhoneCall,
  Mail,
  HelpCircle,
  TrendingUp,
} from 'lucide-react-native';
import { OwnerPlanTier } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { useAppStore } from '../../../store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HostPlanConfig {
  tier: OwnerPlanTier;
  name: string;
  price: string;
  priceNum: number;
  period: string;
  badge?: string;
  badgeBg?: string;
  badgeColor?: string;
  headline: string;
  features: string[];
  cta: string;
  isPopular?: boolean;
  isCustomCta?: boolean;
}

const PLANS: HostPlanConfig[] = [
  {
    tier: 'free',
    name: 'Free Plan',
    price: '₹0',
    priceNum: 0,
    period: '/month',
    badge: 'ENTRY LEVEL',
    badgeBg: '#F1F5F9',
    badgeColor: '#475569',
    headline: 'Start listing your first home',
    features: [
      '1 Listing',
      'Verified Listing Badge',
      'Basic Analytics',
      'Lead Inbox',
      'Direct Tenant Chat',
    ],
    cta: 'Select Free Plan',
  },
  {
    tier: 'starter',
    name: 'Starter Plan',
    price: '₹299',
    priceNum: 299,
    period: '/month',
    badge: 'FOR INDIVIDUALS',
    badgeBg: '#E0F2FE',
    badgeColor: '#0284C7',
    headline: 'Boost visibility for single apartments',
    features: [
      '1 Active Listing',
      'Priority Search Placement',
      'Featured Gold Badge',
      'Unlimited Tenant Leads',
      'Advanced Analytics & Views',
    ],
    cta: 'Upgrade to Starter',
  },
  {
    tier: 'pro',
    name: 'Pro Plan',
    price: '₹599',
    priceNum: 599,
    period: '/month',
    badge: 'MOST POPULAR',
    badgeBg: '#DCFCE7',
    badgeColor: '#15803D',
    headline: 'Ideal for multi-property owners',
    features: [
      '3 Active Listings',
      'Featured Locality Placement',
      'Unlimited HD Photos & 3D Tours',
      'Visit Management & QR Check-in',
      'Tenant Verification Discount',
      'Portfolio Analytics Suite',
    ],
    cta: 'Upgrade to Pro Plan',
    isPopular: true,
  },
  {
    tier: 'premium',
    name: 'Premium Plan',
    price: '₹999',
    priceNum: 999,
    period: '/month',
    badge: 'MAXIMUM YIELD',
    badgeBg: '#FEF3C7',
    badgeColor: '#B45309',
    headline: 'Flagship tier for luxury landlords',
    features: [
      '10 Active Listings',
      'Top-Rank Featured Placement',
      'AI Photography & Title Boost',
      '24/7 Dedicated Priority Support',
      'Rent Collection & AutoPay Dashboard',
      'Digital E-Lease Agreements Included',
      'Zero Deposit Pass Priority',
    ],
    cta: 'Upgrade to Premium',
  },
  {
    tier: 'enterprise',
    name: 'Enterprise Institutional',
    price: 'Custom',
    priceNum: 0,
    period: 'Annual agreement',
    badge: 'BUILDERS & CO-LIVING',
    badgeBg: '#FFE4E6',
    badgeColor: '#BE123C',
    headline: 'PG chains, developers & institutional funds',
    features: [
      'Institutional Portfolio Dashboard',
      'REST API Access & Webhooks',
      'Bulk Property CSV Upload',
      'Multiple Branch Managers',
      'Custom White-Label Contracts',
      'Advanced Predictive Analytics',
    ],
    cta: 'Contact Sales',
    isCustomCta: true,
  },
];

interface V4HostPlansScreenProps {
  hideHeader?: boolean;
}

export const V4HostPlansScreen: React.FC<V4HostPlansScreenProps> = ({ hideHeader = false }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { ownerPlan, upgradeOwnerPlanState, showToast } = useAppStore();

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<HostPlanConfig | null>(null);

  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [contactType, setContactType] = useState<'ENTERPRISE'>('ENTERPRISE');

  const currentTier = ownerPlan?.plan_tier || 'pro';

  const handlePlanClick = (plan: HostPlanConfig) => {
    if (plan.isCustomCta) {
      setContactType('ENTERPRISE');
      setContactModalVisible(true);
      return;
    }

    if (plan.tier === currentTier) {
      showToast?.('You are currently on this plan', 'info');
      return;
    }

    setSelectedPlan(plan);
    setConfirmModalVisible(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPlan) return;
    const ok = await upgradeOwnerPlanState(selectedPlan.tier);
    if (ok) {
      setConfirmModalVisible(false);
      router.back();
    }
  };

  return (
    <View style={[styles.container, !hideHeader && { paddingTop: insets.top }]}>
      {/* Top Header */}
      {!hideHeader && (
        <View style={styles.topNav}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={V4_COLORS.textPrimary} />
          </Pressable>
          <View style={styles.topNavCenter}>
            <Text style={styles.topNavTitle}>Subscription Plans</Text>
            <Text style={styles.topNavSub}>Owner & Landlord Plans</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      )}

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.headerBanner}>
          <View style={styles.crownCircle}>
            <Crown size={24} color="#064E3B" />
          </View>
          <Text style={styles.bannerTitle}>Unlock Unlimited Landlord Power</Text>
          <Text style={styles.bannerSubtitle}>
            Scale your rental yield, automate leases, and screen top-tier verified tenants with transparent pricing.
          </Text>
        </View>

        {/* Plans Carousel/Cards */}
        <View style={styles.plansWrap}>
          {PLANS.map((plan) => {
            const isCurrent = plan.tier === currentTier;

            return (
              <View
                key={plan.tier}
                style={[
                  styles.planCard,
                  plan.isPopular && styles.planCardPopular,
                  isCurrent && styles.planCardCurrent,
                ]}
              >
                {/* Badge Row */}
                <View style={styles.planBadgeRow}>
                  {plan.badge && (
                    <View style={[styles.planPillBadge, { backgroundColor: plan.badgeBg }]}>
                      <Text style={[styles.planPillBadgeTxt, { color: plan.badgeColor }]}>
                        {plan.badge}
                      </Text>
                    </View>
                  )}
                  {isCurrent && (
                    <View style={styles.currentActiveBadge}>
                      <Check size={11} color="#065F46" strokeWidth={3} />
                      <Text style={styles.currentActiveBadgeTxt}>ACTIVE PLAN</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planHeadline}>{plan.headline}</Text>

                {/* Pricing Display */}
                <View style={styles.priceRow}>
                  <Text style={styles.priceVal}>{plan.price}</Text>
                  <Text style={styles.pricePeriod}> {plan.period}</Text>
                </View>

                <View style={styles.featuresDivider} />

                {/* Features List */}
                <View style={styles.featuresList}>
                  {plan.features.map((feat, i) => (
                    <View key={i} style={styles.featureRow}>
                      <CheckCircle2 size={16} color="#059669" />
                      <Text style={styles.featureTxt}>{feat}</Text>
                    </View>
                  ))}
                </View>

                {/* Action CTA */}
                <View style={{ marginTop: 18 }}>
                  <V4Button
                    title={isCurrent ? 'Current Plan' : plan.cta}
                    variant={isCurrent ? 'outline' : plan.isPopular ? 'primary' : 'secondary'}
                    disabled={isCurrent}
                    onPress={() => handlePlanClick(plan)}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* 100% Satisfaction Guarantee */}
        <View style={styles.guaranteeBox}>
          <ShieldCheck size={24} color="#059669" />
          <View style={{ flex: 1 }}>
            <Text style={styles.guaranteeTitle}>Verified Listing & 100% Verified Tenants</Text>
            <Text style={styles.guaranteeSub}>
              All plans include DigiLocker tenant background checks and instant UPI AutoPay settlement.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* =====================================================================
          CONFIRM UPGRADE MODAL
         ===================================================================== */}
      <Modal
        visible={confirmModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.upgradeModalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Confirm Subscription</Text>
              <Pressable onPress={() => setConfirmModalVisible(false)}>
                <Text style={{ fontSize: 16, color: '#64748B' }}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.planHighlightBox}>
              <Text style={styles.highlightName}>{selectedPlan?.name}</Text>
              <Text style={styles.highlightPrice}>
                {selectedPlan?.price} {selectedPlan?.period}
              </Text>
            </View>

            <View style={styles.benefitsSummaryBox}>
              <Text style={styles.benefitSummaryTitle}>Instant Host Benefits:</Text>
              {selectedPlan?.features.slice(0, 4).map((f, idx) => (
                <View key={idx} style={styles.benefitSummaryRow}>
                  <Check size={14} color="#059669" />
                  <Text style={styles.benefitSummaryTxt}>{f}</Text>
                </View>
              ))}
            </View>

            <View style={{ marginTop: 18, gap: 8 }}>
              <V4Button
                title={`Pay ${selectedPlan?.price} & Activate Plan`}
                variant="primary"
                onPress={handleConfirmUpgrade}
              />
              <V4Button
                title="Cancel"
                variant="outline"
                onPress={() => setConfirmModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* =====================================================================
          CONTACT MODAL (ENTERPRISE)
         ===================================================================== */}
      <Modal
        visible={contactModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.upgradeModalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Institutional Inquiries</Text>
              <Pressable onPress={() => setContactModalVisible(false)}>
                <Text style={{ fontSize: 16, color: '#64748B' }}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.contactSubtitle}>
              For developers, PG chains, and coliving brands managing 50+ units.
            </Text>

            <View style={styles.contactMethodsBox}>
              <Pressable
                style={styles.contactMethodRow}
                onPress={() => Linking.openURL('tel:+919820154321').catch(() => {})}
              >
                <PhoneCall size={18} color="#0F766E" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactMethodTitle}>Call Host Concierge</Text>
                  <Text style={styles.contactMethodSub}>+91 98201 54321 (10 AM - 8 PM)</Text>
                </View>
              </Pressable>

              <Pressable
                style={styles.contactMethodRow}
                onPress={() => Linking.openURL('mailto:partners@rehvo.com').catch(() => {})}
              >
                <Mail size={18} color="#0F766E" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactMethodTitle}>Email Institutional Team</Text>
                  <Text style={styles.contactMethodSub}>partners@rehvo.com</Text>
                </View>
              </Pressable>
            </View>

            <View style={{ marginTop: 16 }}>
              <V4Button
                title="Close"
                variant="outline"
                onPress={() => setContactModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNavCenter: {
    alignItems: 'center',
  },
  topNavTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  topNavSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  headerBanner: {
    backgroundColor: '#064E3B',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    ...V4_SHADOWS.card,
  },
  crownCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  bannerTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 12.5,
    color: '#A7F3D0',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  plansWrap: {
    gap: 16,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  planCardPopular: {
    borderColor: '#10B981',
    borderWidth: 2,
  },
  planCardCurrent: {
    backgroundColor: '#F0FDF4',
    borderColor: '#059669',
  },
  planBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planPillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  planPillBadgeTxt: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  currentActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  currentActiveBadgeTxt: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#065F46',
  },
  planName: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  planHeadline: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 12,
  },
  priceVal: {
    fontSize: 28,
    fontWeight: '900',
    color: '#064E3B',
  },
  pricePeriod: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  featuresDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  featuresList: {
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureTxt: {
    fontSize: 12.5,
    color: '#334155',
    fontWeight: '500',
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#064E3B',
  },
  guaranteeSub: {
    fontSize: 11,
    color: '#0F766E',
    marginTop: 2,
    lineHeight: 15,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  upgradeModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 380,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  planHighlightBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
  },
  highlightName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#064E3B',
  },
  highlightPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#064E3B',
    marginTop: 2,
  },
  benefitsSummaryBox: {
    marginTop: 14,
    gap: 6,
  },
  benefitSummaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  benefitSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  benefitSummaryTxt: {
    fontSize: 12,
    color: '#334155',
  },
  contactSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 14,
  },
  contactMethodsBox: {
    gap: 10,
  },
  contactMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  contactMethodTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  contactMethodSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
});
