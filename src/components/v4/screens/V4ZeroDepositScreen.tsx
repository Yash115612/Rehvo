import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  Share,
  Platform,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Download,
  Share2,
  Award,
  BadgeCheck,
  Check,
  Building2,
  Calendar,
  Clock,
  User,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  X,
  Bell,
  HelpCircle,
  QrCode,
  Zap,
  Tag,
  Search,
  Filter,
  Calculator,
  ArrowRight,
  Phone,
  MessageCircle,
  AlertCircle,
  KeyRound,
  FileCheck,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';

type ZeroDepositStage =
  | 'home'
  | 'eligibility'
  | 'result'
  | 'properties'
  | 'details'
  | 'agreement'
  | 'certificate'
  | 'dashboard';

interface ZeroDepositProperty {
  id: string;
  title: string;
  locality: string;
  city: string;
  image: string;
  monthlyRent: number;
  originalDeposit: number;
  depositRequired: number;
  bedrooms: number;
  bathrooms: number;
  ownerName: string;
  verifiedOwner: boolean;
  instantMoveIn: boolean;
}

import { V4AuthGate } from '../ui/V4AuthGate';

export const V4ZeroDepositScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    showToast,
    user,
    isAuthenticated,
    zeroDepositPass,
    fetchZeroDepositPass,
    applyZeroDepositPass,
    properties,
    fetchProperties,
  } = useAppStore();

  useEffect(() => {
    fetchProperties?.();
  }, [fetchProperties]);

  const zdProperties = useMemo<ZeroDepositProperty[]>(() => {
    if (properties && properties.length > 0) {
      return properties.map((p) => ({
        id: p.id,
        title: p.title,
        locality: p.locality,
        city: p.city,
        image:
          p.images?.[0]?.url ||
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
        monthlyRent: p.rent,
        originalDeposit: p.deposit || p.rent * 2,
        depositRequired: 0,
        bedrooms: parseInt(p.bhk) || 2,
        bathrooms: p.bathrooms || 2,
        ownerName: p.owner_name || 'Verified Landlord',
        verifiedOwner: p.verification_status === 'VERIFIED',
        instantMoveIn: true,
      }));
    }
    return [
      {
        id: 'zd_prop_1',
        title: 'Skyline Luxury Suite • 2 BHK',
        locality: 'Malviya Nagar',
        city: 'Jaipur',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
        monthlyRent: 20000,
        originalDeposit: 60000,
        depositRequired: 0,
        bedrooms: 2,
        bathrooms: 2,
        ownerName: 'Sanjay Mehra',
        verifiedOwner: true,
        instantMoveIn: true,
      },
    ];
  }, [properties]);

  // Screen Stage
  const [currentStage, setCurrentStage] = useState<ZeroDepositStage>('home');
  const [selectedProperty, setSelectedProperty] = useState<ZeroDepositProperty>(zdProperties[0]);

  useEffect(() => {
    if (zdProperties.length > 0 && (!selectedProperty || selectedProperty.id === 'zd_prop_1')) {
      setSelectedProperty(zdProperties[0]);
    }
  }, [zdProperties]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchZeroDepositPass();
    }
  }, [isAuthenticated, user?.id]);

  // Calculator State
  const [calcRent, setCalcRent] = useState('25000');
  const estimatedCoverage = useMemo(() => {
    const rentNum = parseInt(calcRent, 10) || 25000;
    return rentNum * 3; // 3 months deposit covered
  }, [calcRent]);

  // Agreement Form State
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeGuarantee, setAgreeGuarantee] = useState(true);
  const [agreeDamage, setAgreeDamage] = useState(true);
  const [requestingApproval, setRequestingApproval] = useState(false);

  // Property Filters
  const [propFilter, setPropFilter] = useState<'all' | 'under25k' | '2bhk' | 'instant'>('all');

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Submit Approval
  const handleRequestApproval = async () => {
    if (!agreeTerms || !agreeGuarantee || !agreeDamage) {
      showToast?.('Please accept all agreement conditions', 'error');
      return;
    }
    setRequestingApproval(true);
    await applyZeroDepositPass(760, selectedProperty.originalDeposit || 60000);
    setRequestingApproval(false);
    setCurrentStage('certificate');
    showToast?.('🎉 Zero Deposit Pass activated! ₹100 Welcome R-Cash credited.', 'success');
  };

  // Share Certificate
  const handleShareCertificate = async () => {
    try {
      const code = zeroDepositPass?.certificate_id || 'REHVO-ZD-2026-88912';
      await Share.share({
        message: `🛡️ REHVO Official Zero Deposit Certificate\nCoverage ID: ${code}\nTenant: ${user?.name || 'Yash Choudhary'}\nProperty: ${selectedProperty.title}\nCoverage Limit: ₹${selectedProperty.originalDeposit.toLocaleString('en-IN')}\nStatus: ACTIVE & VERIFIED`,
      });
    } catch {
      showToast?.('Certificate link copied to clipboard', 'info');
    }
  };

  // Filtered Properties
  const filteredProperties = useMemo(() => {
    return zdProperties.filter((p) => {
      if (propFilter === 'under25k') return p.monthlyRent <= 25000;
      if (propFilter === '2bhk') return p.bedrooms === 2;
      if (propFilter === 'instant') return p.instantMoveIn;
      return true;
    });
  }, [zdProperties, propFilter]);

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 10) }]}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            if (currentStage === 'home') {
              router.back();
            } else if (currentStage === 'details') {
              setCurrentStage('properties');
            } else if (currentStage === 'agreement') {
              setCurrentStage('details');
            } else {
              setCurrentStage('home');
            }
          }}
        >
          <ArrowLeft size={19} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>
            {currentStage === 'home'
              ? 'Zero Deposit'
              : currentStage === 'eligibility'
              ? 'Eligibility Check'
              : currentStage === 'result'
              ? 'Eligibility Result'
              : currentStage === 'properties'
              ? 'Zero Deposit Homes'
              : currentStage === 'details'
              ? 'Coverage Details'
              : currentStage === 'agreement'
              ? 'Approval Request'
              : currentStage === 'certificate'
              ? 'Zero Deposit Certificate'
              : 'My Coverage Dashboard'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {currentStage === 'home'
              ? 'Move in without upfront security deposit'
              : '100% REHVO Guaranteed Protection Bond'}
          </Text>
        </View>

        <View style={styles.headerActionRow}>
          <Pressable
            style={styles.headerIconBtn}
            onPress={() => setCurrentStage('dashboard')}
          >
            <ShieldCheck size={17} color={V4_COLORS.textPrimary} strokeWidth={2.2} />
          </Pressable>
          <Pressable
            style={styles.headerIconBtn}
            onPress={() => {
              showToast?.('24/7 Zero Deposit Concierge is active for your account.', 'info');
            }}
          >
            <HelpCircle size={17} color={V4_COLORS.textPrimary} strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>

      {/* =====================================================================
          SCREEN 1: ZERO DEPOSIT HOME (DASHBOARD)
         ===================================================================== */}
      {currentStage === 'home' && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroTopBadgeRow}>
              <View style={styles.heroGovtTag}>
                <Sparkles size={11} color="#FFFFFF" />
                <Text style={styles.heroGovtTagText}>REHVO TRUST GUARANTEE</Text>
              </View>
              <View style={styles.heroVerifiedPill}>
                <Lock size={11} color="#4338CA" />
                <Text style={styles.heroVerifiedPillText}>0% CASH LOCK-IN</Text>
              </View>
            </View>

            <Text style={styles.heroCardTitle}>Move In With ₹0 Deposit</Text>
            <Text style={styles.heroCardDesc}>
              Verified tenants can unlock zero deposit rental homes. REHVO provides 100% security deposit guarantee bonds to landlords.
            </Text>

            <View style={styles.heroActionRow}>
              <Pressable
                style={styles.heroPrimaryBtn}
                onPress={() => {
                  if (!isAuthenticated) {
                    router.push('/(renter)/login' as any);
                  } else {
                    setCurrentStage('eligibility');
                  }
                }}
              >
                <Zap size={15} color="#0F766E" strokeWidth={2.8} />
                <Text style={styles.heroPrimaryBtnText}>
                  {isAuthenticated ? 'Check Eligibility' : 'Sign in to check eligibility'}
                </Text>
              </Pressable>

              <Pressable
                style={styles.heroSecondaryBtn}
                onPress={() => setCurrentStage('properties')}
              >
                <Building2 size={14} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.heroSecondaryBtnText}>Explore Homes</Text>
              </Pressable>
            </View>
          </View>

          {/* Savings Highlight Card */}
          <View style={styles.savingsCard}>
            <View style={styles.savingsIconCircle}>
              <Award size={22} color="#0F766E" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.savingsCardTitle}>Save Up To ₹1,50,000 Upfront</Text>
              <Text style={styles.savingsCardDesc}>
                Keep your hard-earned cash for investments, interior setups, and emergency savings.
              </Text>
            </View>
          </View>

          {/* 4-Step How It Works */}
          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <Text style={styles.sectionSub}>4 simple steps to your deposit-free home</Text>
          </View>

          <View style={styles.howItWorksGrid}>
            {[
              { step: '1', title: 'Verify Identity', desc: '10-min DigiLocker KYC & Trust check' },
              { step: '2', title: 'Unlock Limit', desc: 'Get up to ₹1,50,000 deposit coverage' },
              { step: '3', title: 'Pick Home', desc: 'Select any Zero Deposit verified flat' },
              { step: '4', title: 'Move In ₹0', desc: 'Pay 1st month rent only & collect keys' },
            ].map((item) => (
              <View key={item.step} style={styles.howItWorksCard}>
                <View style={styles.stepNumberCircle}>
                  <Text style={styles.stepNumberText}>{item.step}</Text>
                </View>
                <Text style={styles.stepCardTitle}>{item.title}</Text>
                <Text style={styles.stepCardDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>

          {/* Interactive Coverage Calculator */}
          <View style={styles.calculatorCard}>
            <View style={styles.calcHeader}>
              <Calculator size={18} color="#0F766E" />
              <Text style={styles.calcTitle}>Coverage Limit Calculator</Text>
            </View>

            <Text style={styles.inputLabel}>Enter Target Monthly Rent (₹)</Text>
            <TextInput
              style={styles.calcInput}
              value={calcRent}
              onChangeText={setCalcRent}
              placeholder="e.g. 25000"
              placeholderTextColor={V4_COLORS.textMuted}
              keyboardType="numeric"
            />

            <View style={styles.calcResultBox}>
              <Text style={styles.calcResultLabel}>Estimated Security Deposit Covered by REHVO:</Text>
              <Text style={styles.calcResultAmount}>₹{estimatedCoverage.toLocaleString('en-IN')}</Text>
              <Text style={styles.calcResultSub}>✓ 100% Guaranteed Deposit Protection</Text>
            </View>
          </View>

          {/* FAQ Accordion */}
          <View style={styles.faqSection}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {[
              {
                q: 'What is REHVO Zero Deposit?',
                a: 'Zero Deposit allows eligible tenants to rent homes without paying a traditional 2-3 month security deposit. REHVO issues a legally backed guarantee bond directly to the landlord.',
              },
              {
                q: 'Who is eligible for Zero Deposit?',
                a: 'Any tenant with completed DigiLocker KYC, a REHVO Trust Score above 85, and stable verified income is eligible for up to ₹1,50,000 in deposit coverage.',
              },
              {
                q: 'How are property damages handled?',
                a: 'REHVO covers accidental damages up to ₹50,000. Tenants are only liable for intentional damages as outlined in the Digital Tenancy Agreement.',
              },
            ].map((faq, idx) => (
              <Pressable
                key={idx}
                style={styles.faqItem}
                onPress={() => toggleFaq(idx)}
              >
                <View style={styles.faqQuestionRow}>
                  <Text style={styles.faqQuestionText}>{faq.q}</Text>
                  {expandedFaq === idx ? (
                    <ChevronUp size={16} color="#0F766E" />
                  ) : (
                    <ChevronDown size={16} color={V4_COLORS.textSecondary} />
                  )}
                </View>
                {expandedFaq === idx && <Text style={styles.faqAnswerText}>{faq.a}</Text>}
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Guest Mode Auth Gate for Personal Stages */}
      {!isAuthenticated &&
        currentStage !== 'home' &&
        currentStage !== 'properties' &&
        currentStage !== 'details' && (
          <V4AuthGate
            title="Check Zero Deposit Eligibility"
            description="Sign in to verify your DigiLocker identity and unlock up to ₹1,50,000 Zero Deposit rental coverage."
            featureName="Zero Deposit Pass"
            badgeText="PRE-APPROVED ELIGIBILITY"
            benefits={[
              'Move into verified flats with ₹0 cash deposit',
              'REHVO 100% landlord security guarantee bond',
              'Instant approval via DigiLocker trust index',
              'No hidden processing fees for verified renters',
            ]}
            fullScreen={false}
          />
        )}

      {/* =====================================================================
          SCREEN 2: ELIGIBILITY CHECK
         ===================================================================== */}
      {currentStage === 'eligibility' && isAuthenticated && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Trust Score Radial Card */}
          <View style={styles.trustScoreHero}>
            <Text style={styles.trustHeroSub}>REHVO TRUST ENGINE EVALUATION</Text>
            <View style={styles.trustBigCircle}>
              <Text style={styles.trustBigScore}>92</Text>
              <Text style={styles.trustScoreDenom}>/ 100</Text>
            </View>
            <View style={styles.goldBadge}>
              <BadgeCheck size={14} color="#15803D" />
              <Text style={styles.goldBadgeText}>GOLD VERIFIED TENANT</Text>
            </View>
            <Text style={styles.trustHeroTitle}>You're Eligible for Zero Deposit!</Text>
          </View>

          {/* Requirements Checklist */}
          <View style={styles.checklistCard}>
            <Text style={styles.checklistTitle}>Eligibility Checklist</Text>

            {[
              { title: 'Tenant Verification', sub: 'DigiLocker UIDAI Authenticated', status: 'passed' },
              { title: 'Police Clearance NOC', sub: 'Online Intimation Filed', status: 'passed' },
              { title: 'REHVO Trust Score (85+ Req)', sub: 'Score 92/100 (Excellent)', status: 'passed' },
              { title: 'Income & Employment', sub: 'Verified Monthly Cashflow', status: 'passed' },
              { title: 'Rental History Track', sub: 'Zero Payment Defaults On Record', status: 'passed' },
            ].map((req, idx) => (
              <View key={idx} style={styles.checklistItem}>
                <View style={styles.checkCirclePassed}>
                  <Check size={13} color="#16A34A" strokeWidth={3} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.checklistName}>{req.title}</Text>
                  <Text style={styles.checklistSub}>{req.sub}</Text>
                </View>
              </View>
            ))}
          </View>

          <Pressable
            style={styles.primaryActionBtn}
            onPress={() => setCurrentStage('result')}
          >
            <Text style={styles.primaryActionBtnText}>View Eligibility Limit</Text>
            <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>
        </ScrollView>
      )}

      {/* =====================================================================
          SCREEN 3: ELIGIBILITY RESULT
         ===================================================================== */}
      {currentStage === 'result' && isAuthenticated && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Result Card */}
          <View style={styles.resultCard}>
            <View style={styles.resultCheckCircle}>
              <Check size={36} color="#FFFFFF" strokeWidth={3.5} />
            </View>
            <Text style={styles.resultMainTitle}>Congratulations!</Text>
            <Text style={styles.resultMainSub}>You are approved for 100% Zero Deposit</Text>

            <View style={styles.coverageLimitBox}>
              <Text style={styles.coverageLimitLabel}>APPROVED DEPOSIT COVERAGE LIMIT</Text>
              <Text style={styles.coverageLimitVal}>Up to ₹1,50,000</Text>
              <Text style={styles.coverageLimitValidity}>Valid for next 90 Days</Text>
            </View>

            <View style={styles.coveragePerksList}>
              <View style={styles.coveragePerkItem}>
                <CheckCircle2 size={15} color="#16A34A" />
                <Text style={styles.coveragePerkText}>100% Security Deposit Guaranteed</Text>
              </View>
              <View style={styles.coveragePerkItem}>
                <CheckCircle2 size={15} color="#16A34A" />
                <Text style={styles.coveragePerkText}>₹50,000 Accidental Damage Protection</Text>
              </View>
              <View style={styles.coveragePerkItem}>
                <CheckCircle2 size={15} color="#16A34A" />
                <Text style={styles.coveragePerkText}>Free Digital e-Lease & Stamping</Text>
              </View>
            </View>
          </View>

          <Pressable
            style={styles.primaryActionBtn}
            onPress={() => setCurrentStage('properties')}
          >
            <Text style={styles.primaryActionBtnText}>Browse Zero Deposit Homes</Text>
            <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>
        </ScrollView>
      )}

      {/* =====================================================================
          SCREEN 4: ZERO DEPOSIT PROPERTY LISTING FEED
         ===================================================================== */}
      {currentStage === 'properties' && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Filter Chips */}
          <View style={styles.propFilterRow}>
            {[
              { id: 'all', label: 'All Homes' },
              { id: 'under25k', label: 'Under ₹25k' },
              { id: '2bhk', label: '2 BHK' },
              { id: 'instant', label: 'Instant Move-in' },
            ].map((f) => (
              <Pressable
                key={f.id}
                style={[styles.propFilterChip, propFilter === f.id && styles.propFilterChipActive]}
                onPress={() => setPropFilter(f.id as any)}
              >
                <Text
                  style={[
                    styles.propFilterText,
                    propFilter === f.id && styles.propFilterTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Properties List */}
          <View style={styles.propFeedList}>
            {filteredProperties.map((prop) => (
              <Pressable
                key={prop.id}
                style={styles.propFeedCard}
                onPress={() => {
                  setSelectedProperty(prop);
                  setCurrentStage('details');
                }}
              >
                <Image source={{ uri: prop.image }} style={styles.propFeedImage} />

                <View style={styles.propFeedBody}>
                  <View style={styles.propFeedBadgeRow}>
                    <View style={styles.zeroDepBadge}>
                      <Lock size={10} color="#0F766E" />
                      <Text style={styles.zeroDepBadgeText}>₹0 DEPOSIT</Text>
                    </View>
                    <View style={styles.savingsTag}>
                      <Text style={styles.savingsTagText}>
                        Save ₹{prop.originalDeposit.toLocaleString('en-IN')} Deposit
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.propFeedTitle}>{prop.title}</Text>
                  <Text style={styles.propFeedLocality}>{prop.locality}, {prop.city}</Text>

                  <View style={styles.propFeedBottomRow}>
                    <View>
                      <Text style={styles.propFeedRentLabel}>Monthly Rent</Text>
                      <Text style={styles.propFeedRentVal}>₹{prop.monthlyRent.toLocaleString('en-IN')}/mo</Text>
                    </View>

                    <View style={styles.propFeedViewBtn}>
                      <Text style={styles.propFeedViewText}>View Details</Text>
                      <ArrowRight size={13} color="#0F766E" strokeWidth={2.8} />
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}

      {/* =====================================================================
          SCREEN 5: ZERO DEPOSIT DETAILS
         ===================================================================== */}
      {currentStage === 'details' && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          <Image source={{ uri: selectedProperty.image }} style={styles.detailHeroImage} />

          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>{selectedProperty.title}</Text>
            <Text style={styles.detailLocality}>{selectedProperty.locality}, {selectedProperty.city}</Text>
            <Text style={styles.detailOwnerText}>Verified Landlord: {selectedProperty.ownerName}</Text>

            {/* Comparison Box */}
            <View style={styles.comparisonCard}>
              <View style={styles.comparisonCol}>
                <Text style={styles.compLabel}>Traditional Deposit</Text>
                <Text style={styles.compOldVal}>₹{selectedProperty.originalDeposit.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.compArrowBox}>
                <ArrowRight size={16} color="#0F766E" strokeWidth={2.5} />
              </View>
              <View style={styles.comparisonCol}>
                <Text style={styles.compLabel}>Deposit with REHVO</Text>
                <Text style={styles.compNewVal}>₹0</Text>
              </View>
            </View>

            {/* Savings Banner */}
            <View style={styles.savingsBanner}>
              <Sparkles size={16} color="#0F766E" />
              <Text style={styles.savingsBannerText}>
                You save <Text style={{ fontWeight: '900' }}>₹{selectedProperty.originalDeposit.toLocaleString('en-IN')}</Text> upfront cash on this property!
              </Text>
            </View>

            {/* What's Included */}
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>What's Included with Zero Deposit</Text>
            <View style={styles.inclusionsList}>
              <View style={styles.inclusionItem}>
                <CheckCircle2 size={16} color="#16A34A" />
                <Text style={styles.inclusionText}>100% Security Deposit Guaranteed by REHVO</Text>
              </View>
              <View style={styles.inclusionItem}>
                <CheckCircle2 size={16} color="#16A34A" />
                <Text style={styles.inclusionText}>₹50,000 Damage Protection Coverage</Text>
              </View>
              <View style={styles.inclusionItem}>
                <CheckCircle2 size={16} color="#16A34A" />
                <Text style={styles.inclusionText}>Free Digital e-Lease with Government Stamp</Text>
              </View>
              <View style={styles.inclusionItem}>
                <CheckCircle2 size={16} color="#16A34A" />
                <Text style={styles.inclusionText}>Direct Key Handover & Fast Move-in</Text>
              </View>
            </View>
          </View>

          <Pressable
            style={styles.primaryActionBtn}
            onPress={() => setCurrentStage('agreement')}
          >
            <Text style={styles.primaryActionBtnText}>Apply Zero Deposit for this Home</Text>
            <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>
        </ScrollView>
      )}

      {/* =====================================================================
          SCREEN 6: AGREEMENT & APPROVAL
         ===================================================================== */}
      {currentStage === 'agreement' && isAuthenticated && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryHeading}>Zero Deposit Application Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Property:</Text>
              <Text style={styles.summaryVal}>{selectedProperty.title}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Monthly Rent:</Text>
              <Text style={styles.summaryVal}>₹{selectedProperty.monthlyRent.toLocaleString('en-IN')}/mo</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Covered Deposit:</Text>
              <Text style={[styles.summaryVal, { color: '#0F766E', fontWeight: '900' }]}>
                ₹{selectedProperty.originalDeposit.toLocaleString('en-IN')} (₹0 Paid by You)
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Landlord:</Text>
              <Text style={styles.summaryVal}>{selectedProperty.ownerName} (Verified)</Text>
            </View>
          </View>

          {/* Consent Checkboxes */}
          <View style={styles.consentCard}>
            <Pressable
              style={styles.consentRow}
              onPress={() => setAgreeTerms(!agreeTerms)}
            >
              <View style={[styles.checkboxBox, agreeTerms && styles.checkboxBoxActive]}>
                {agreeTerms && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <Text style={styles.consentText}>
                I agree to the REHVO Zero Deposit terms and timely monthly rent payments.
              </Text>
            </Pressable>

            <Pressable
              style={styles.consentRow}
              onPress={() => setAgreeGuarantee(!agreeGuarantee)}
            >
              <View style={[styles.checkboxBox, agreeGuarantee && styles.checkboxBoxActive]}>
                {agreeGuarantee && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <Text style={styles.consentText}>
                I authorize REHVO to issue a deposit guarantee bond to the landlord.
              </Text>
            </Pressable>

            <Pressable
              style={styles.consentRow}
              onPress={() => setAgreeDamage(!agreeDamage)}
            >
              <View style={[styles.checkboxBox, agreeDamage && styles.checkboxBoxActive]}>
                {agreeDamage && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <Text style={styles.consentText}>
                I understand the standard damage protection policy and quiet hours rule.
              </Text>
            </Pressable>
          </View>

          {/* Approval Action */}
          <Pressable
            style={styles.primaryActionBtn}
            onPress={handleRequestApproval}
            disabled={requestingApproval}
          >
            {requestingApproval ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Lock size={16} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.primaryActionBtnText}>Request Zero Deposit Approval</Text>
              </>
            )}
          </Pressable>
        </ScrollView>
      )}

      {/* =====================================================================
          SCREEN 7: ZERO DEPOSIT CERTIFICATE (APPLE WALLET STYLE)
         ===================================================================== */}
      {currentStage === 'certificate' && isAuthenticated && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.certificateCard}>
            <View style={styles.certHeader}>
              <ShieldCheck size={28} color="#0F766E" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.certSuperTitle}>REHVO TRUST PROTOCOL</Text>
                <Text style={styles.certMainTitle}>Zero Deposit Guarantee Certificate</Text>
              </View>
            </View>

            <View style={styles.certQrRow}>
              <View style={styles.certQrBox}>
                <QrCode size={64} color="#0F766E" />
                <Text style={styles.certQrCaption}>Scan to Verify</Text>
              </View>

              <View style={styles.certMetaGrid}>
                <View style={styles.certMetaItem}>
                  <Text style={styles.certMetaLabel}>TENANT</Text>
                  <Text style={styles.certMetaVal}>Yash Choudhary</Text>
                </View>
                <View style={styles.certMetaItem}>
                  <Text style={styles.certMetaLabel}>COVERAGE ID</Text>
                  <Text style={styles.certMetaVal}>REHVO-ZD-2026-88912</Text>
                </View>
                <View style={styles.certMetaItem}>
                  <Text style={styles.certMetaLabel}>DEPOSIT COVERED</Text>
                  <Text style={[styles.certMetaVal, { color: '#0F766E', fontWeight: '900' }]}>
                    ₹{selectedProperty.originalDeposit.toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.certMetaItem}>
                  <Text style={styles.certMetaLabel}>STATUS</Text>
                  <Text style={[styles.certMetaVal, { color: '#16A34A' }]}>100% Guaranteed & Active</Text>
                </View>
              </View>
            </View>

            <View style={styles.certActionRow}>
              <Pressable
                style={styles.certDownloadBtn}
                onPress={() => showToast?.('📥 Downloaded Zero Deposit Certificate PDF!', 'success')}
              >
                <Download size={14} color="#0F766E" strokeWidth={2.4} />
                <Text style={styles.certDownloadBtnText}>Download PDF</Text>
              </Pressable>

              <Pressable style={styles.certShareBtn} onPress={handleShareCertificate}>
                <Share2 size={14} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.certShareBtnText}>Share Certificate</Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            style={styles.returnHomeBtn}
            onPress={() => setCurrentStage('dashboard')}
          >
            <Text style={styles.returnHomeBtnText}>Go to Zero Deposit Dashboard</Text>
          </Pressable>
        </ScrollView>
      )}

      {/* =====================================================================
          SCREEN 8: MY ZERO DEPOSIT DASHBOARD
         ===================================================================== */}
      {currentStage === 'dashboard' && isAuthenticated && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Active Coverage Card */}
          <View style={styles.activeCoverageCard}>
            <View style={styles.activeCoverageHeader}>
              <View style={styles.activeCoverageBadge}>
                <BadgeCheck size={12} color="#15803D" />
                <Text style={styles.activeCoverageBadgeText}>ACTIVE ZERO DEPOSIT COVERAGE</Text>
              </View>
              <Text style={styles.activeCoverageDate}>Approved 14 Aug 2026</Text>
            </View>

            <Text style={styles.activeCoverageProperty}>{selectedProperty.title}</Text>
            <Text style={styles.activeCoverageLocality}>{selectedProperty.locality}, {selectedProperty.city}</Text>

            <View style={styles.activeCoverageAmountRow}>
              <View>
                <Text style={styles.activeCoverageAmountLabel}>Deposit Covered by REHVO</Text>
                <Text style={styles.activeCoverageAmountVal}>₹{selectedProperty.originalDeposit.toLocaleString('en-IN')}</Text>
              </View>

              <Pressable
                style={styles.viewCertMiniBtn}
                onPress={() => setCurrentStage('certificate')}
              >
                <Award size={13} color="#0F766E" />
                <Text style={styles.viewCertMiniText}>Certificate</Text>
              </Pressable>
            </View>
          </View>

          {/* 24/7 Concierge Support Card */}
          <View style={styles.supportCard}>
            <Text style={styles.supportHeading}>Need Help With Your Coverage?</Text>
            <Text style={styles.supportSub}>Direct access to REHVO Zero Deposit relationship managers.</Text>

            <View style={styles.supportBtnRow}>
              <Pressable
                style={styles.supportBtn}
                onPress={() => showToast?.('Connected to 24/7 Zero Deposit Concierge Chat.', 'info')}
              >
                <MessageCircle size={15} color="#0F766E" />
                <Text style={styles.supportBtnText}>Chat Support</Text>
              </Pressable>
              <Pressable
                style={styles.supportBtn}
                onPress={() => showToast?.('Calling Dedicated Relationship Manager...', 'info')}
              >
                <Phone size={15} color="#0F766E" />
                <Text style={styles.supportBtnText}>Call Concierge</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
    backgroundColor: V4_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EEF0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    ...V4_SHADOWS.soft,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17.5,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '500',
  },
  headerActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: V4_COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: V4_COLORS.border,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },

  // Hero Card
  heroCard: {
    backgroundColor: '#0F766E',
    borderRadius: 24,
    padding: 18,
    gap: 12,
    ...V4_SHADOWS.card,
  },
  heroTopBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroGovtTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    gap: 4,
  },
  heroGovtTagText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  heroVerifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    gap: 4,
  },
  heroVerifiedPillText: {
    color: '#4338CA',
    fontSize: 9,
    fontWeight: '900',
  },
  heroCardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroCardDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.88)',
    lineHeight: 17,
  },
  heroActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  heroPrimaryBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
  },
  heroPrimaryBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F766E',
  },
  heroSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heroSecondaryBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Savings Card
  savingsCard: {
    flexDirection: 'row',
    backgroundColor: '#F0FDFA',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 12,
    alignItems: 'center',
  },
  savingsIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsCardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  savingsCardDesc: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    lineHeight: 15,
  },

  // How It Works
  sectionHeaderWrap: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  sectionSub: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '500',
  },
  howItWorksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  howItWorksCard: {
    width: '48%',
    backgroundColor: V4_COLORS.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 4,
    ...V4_SHADOWS.soft,
  },
  stepNumberCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F766E',
  },
  stepCardTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  stepCardDesc: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
    lineHeight: 14,
  },

  // Calculator Card
  calculatorCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 10,
    ...V4_SHADOWS.card,
  },
  calcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calcTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  calcInput: {
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: V4_COLORS.textPrimary,
    fontWeight: '700',
  },
  calcResultBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 2,
    marginTop: 4,
  },
  calcResultLabel: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  calcResultAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F766E',
  },
  calcResultSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
  },

  // FAQ
  faqSection: {
    gap: 10,
  },
  faqItem: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 6,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  faqAnswerText: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    lineHeight: 15,
    marginTop: 4,
  },

  // Eligibility Screen
  trustScoreHero: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    ...V4_SHADOWS.card,
  },
  trustHeroSub: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.6,
  },
  trustBigCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F0FDFA',
    borderWidth: 3,
    borderColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustBigScore: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F766E',
    lineHeight: 36,
  },
  trustScoreDenom: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  goldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    gap: 4,
  },
  goldBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#15803D',
  },
  trustHeroTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  checklistCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 12,
  },
  checklistTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkCirclePassed: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklistName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  checklistSub: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
  },
  primaryActionBtn: {
    backgroundColor: '#0F766E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    ...V4_SHADOWS.card,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  // Result Screen
  resultCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    ...V4_SHADOWS.card,
  },
  resultCheckCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultMainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  resultMainSub: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
  },
  coverageLimitBox: {
    width: '100%',
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    gap: 4,
    marginVertical: 4,
  },
  coverageLimitLabel: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  coverageLimitVal: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F766E',
  },
  coverageLimitValidity: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  coveragePerksList: {
    width: '100%',
    gap: 8,
  },
  coveragePerkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coveragePerkText: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },

  // Property Feed
  propFilterRow: {
    flexDirection: 'row',
    gap: 6,
  },
  propFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: V4_COLORS.surface,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
  },
  propFilterChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  propFilterText: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  propFilterTextActive: {
    color: '#FFFFFF',
  },
  propFeedList: {
    gap: 14,
  },
  propFeedCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    ...V4_SHADOWS.card,
  },
  propFeedImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#E2E8F0',
  },
  propFeedBody: {
    padding: 14,
    gap: 6,
  },
  propFeedBadgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  zeroDepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 3,
  },
  zeroDepBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0F766E',
  },
  savingsTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  savingsTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#15803D',
  },
  propFeedTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  propFeedLocality: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
  },
  propFeedBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    marginTop: 4,
  },
  propFeedRentLabel: {
    fontSize: 9.5,
    color: V4_COLORS.textSecondary,
  },
  propFeedRentVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F766E',
  },
  propFeedViewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  propFeedViewText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },

  // Details Screen
  detailHeroImage: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  detailCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 10,
  },
  detailTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  detailLocality: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
  },
  detailOwnerText: {
    fontSize: 11,
    color: '#0F766E',
    fontWeight: '700',
  },
  comparisonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  comparisonCol: {
    alignItems: 'center',
    flex: 1,
  },
  compLabel: {
    fontSize: 10,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  compOldVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#DC2626',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  compNewVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#16A34A',
    marginTop: 2,
  },
  compArrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 8,
  },
  savingsBannerText: {
    fontSize: 11.5,
    color: '#0F766E',
    flex: 1,
  },
  inclusionsList: {
    gap: 6,
  },
  inclusionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inclusionText: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },

  // Agreement & Summary
  summaryCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 8,
    ...V4_SHADOWS.card,
  },
  summaryHeading: {
    fontSize: 15,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  consentCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 10,
  },
  consentRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: V4_COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxBoxActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  consentText: {
    flex: 1,
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    lineHeight: 15,
  },

  // Certificate Card
  certificateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#0F766E',
    padding: 18,
    gap: 14,
    ...V4_SHADOWS.card,
  },
  certHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E6EEF0',
    paddingBottom: 10,
  },
  certSuperTitle: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.6,
  },
  certMainTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  certQrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  certQrBox: {
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 4,
  },
  certQrCaption: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  certMetaGrid: {
    flex: 1,
    gap: 6,
  },
  certMetaItem: {
    justifyContent: 'center',
  },
  certMetaLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.4,
  },
  certMetaVal: {
    fontSize: 11.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  certActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  certDownloadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
  },
  certDownloadBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
  certShareBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
  },
  certShareBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  returnHomeBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  returnHomeBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },

  // Dashboard
  activeCoverageCard: {
    backgroundColor: '#0F766E',
    borderRadius: 22,
    padding: 18,
    gap: 10,
    ...V4_SHADOWS.card,
  },
  activeCoverageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeCoverageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  activeCoverageBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#15803D',
  },
  activeCoverageDate: {
    fontSize: 10.5,
    color: '#CCFBF1',
    fontWeight: '600',
  },
  activeCoverageProperty: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  activeCoverageLocality: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  activeCoverageAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 10,
    marginTop: 4,
  },
  activeCoverageAmountLabel: {
    fontSize: 10,
    color: '#CCFBF1',
    fontWeight: '600',
  },
  activeCoverageAmountVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  viewCertMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 4,
  },
  viewCertMiniText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#0F766E',
  },
  supportCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 10,
    ...V4_SHADOWS.soft,
  },
  supportHeading: {
    fontSize: 14.5,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  supportSub: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    lineHeight: 15,
  },
  supportBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  supportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  supportBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
});

export default V4ZeroDepositScreen;
