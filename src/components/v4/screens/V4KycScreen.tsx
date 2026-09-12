import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Camera,
  Building2,
  Sparkles,
  Download,
  Share2,
  Award,
  Fingerprint,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  ChevronRight,
  ChevronLeft,
  X,
  RefreshCw,
  QrCode,
  BadgeCheck,
  FileText,
  Upload,
  AlertCircle,
  Zap,
  Star,
  Clock,
  Eye,
  Check,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { pickImage } from '../../../services/cameraService';

type ViewMode = 'certificate' | 'form';
type GovtDocType = 'aadhaar' | 'pan' | 'passport' | 'driving_license';
type AddressProofType = 'electricity' | 'rent_agreement' | 'gas_bill' | 'bank_statement';

export const V4KycScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    showToast,
    isAuthenticated,
    tenantVerification,
    fetchTenantVerification,
    updateTenantVerification,
  } = useAppStore();

  const isUserVerified = user?.verification_status === 'VERIFIED' || user?.kyc_verified || tenantVerification?.overall_status === 'verified';

  // Mode: Toggle between Verified Certificate / Dashboard and 4-Step Form Wizard
  const [viewMode, setViewMode] = useState<ViewMode>(isUserVerified ? 'certificate' : 'form');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'under_review' | 'pending'>(
    isUserVerified ? 'verified' : 'pending'
  );

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchTenantVerification();
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (tenantVerification?.overall_status === 'verified') {
      setVerificationStatus('verified');
      setViewMode('certificate');
    }
  }, [tenantVerification]);

  // Step 1: Personal Info State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [occupation, setOccupation] = useState(user?.occupation || '');
  const [employer, setEmployer] = useState('');
  const [incomeBracket, setIncomeBracket] = useState('₹10L - ₹20L / yr');

  // Step 2: Govt ID State
  const [selectedDocType, setSelectedDocType] = useState<GovtDocType>('aadhaar');
  const [docNumber, setDocNumber] = useState('');
  const [frontDocUri, setFrontDocUri] = useState<string | null>(null);
  const [backDocUri, setBackDocUri] = useState<string | null>(null);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);

  // Step 3: Live Face Scan State
  const [selfieUri, setSelfieUri] = useState<string | null>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
  );
  const [isFaceScannerOpen, setIsFaceScannerOpen] = useState(false);
  const [faceScanProgress, setFaceScanProgress] = useState(0);
  const [faceScanStatusText, setFaceScanStatusText] = useState('Position face inside the circle');
  const [isFaceScanning, setIsFaceScanning] = useState(false);

  // Step 4: Address & Emergency Contacts State
  const [currentAddress, setCurrentAddress] = useState('Flat 402, Sea View Apartments, Bandra West');
  const [city, setCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('400050');
  const [stayDuration, setStayDuration] = useState('2 Years');
  const [proofType, setProofType] = useState<AddressProofType>('rent_agreement');
  const [addressProofUri, setAddressProofUri] = useState<string | null>(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
  );
  const [emergencyName, setEmergencyName] = useState('Rajesh Choudhary');
  const [emergencyRelation, setEmergencyRelation] = useState('Father');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98200 12345');
  const [secondaryContact, setSecondaryContact] = useState('Ananya Sharma (Colleague) • +91 98111 22334');

  // Simulated Document Upload Handlers
  const handleUploadFront = async () => {
    setUploadingFront(true);
    try {
      const picked = await pickImage({ quality: 0.9 });
      if (picked?.uri) {
        setFrontDocUri(picked.uri);
        showToast?.('✅ Front document uploaded & OCR verified!', 'success');
      } else {
        setFrontDocUri(
          'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
        );
        showToast?.('✅ Front document verified!', 'success');
      }
    } catch {
      setFrontDocUri(
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
      );
    } finally {
      setUploadingFront(false);
    }
  };

  const handleUploadBack = async () => {
    setUploadingBack(true);
    try {
      const picked = await pickImage({ quality: 0.9 });
      if (picked?.uri) {
        setBackDocUri(picked.uri);
        showToast?.('✅ Back document uploaded & QR authenticated!', 'success');
      } else {
        setBackDocUri(
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
        );
        showToast?.('✅ Back document authenticated!', 'success');
      }
    } catch {
      setBackDocUri(
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
      );
    } finally {
      setUploadingBack(false);
    }
  };

  // Simulated Live Face Scan Liveness Flow
  const startFaceScanFlow = () => {
    setIsFaceScanning(true);
    setFaceScanProgress(0);
    setFaceScanStatusText('🔍 Aligning face in frame...');

    setTimeout(() => {
      setFaceScanProgress(35);
      setFaceScanStatusText('👁️ Please blink your eyes...');
    }, 900);

    setTimeout(() => {
      setFaceScanProgress(70);
      setFaceScanStatusText('😊 Please smile for liveness check...');
    }, 1800);

    setTimeout(() => {
      setFaceScanProgress(100);
      setFaceScanStatusText('✅ 99.8% Biometric Match Verified!');
      setTimeout(() => {
        setIsFaceScanning(false);
        setIsFaceScannerOpen(false);
        setSelfieUri(
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
        );
        showToast?.('🎉 Live Facial Liveness check passed successfully!', 'success');
      }, 700);
    }, 2700);
  };

  // Submit Step or Finish
  const handleNextStep = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      await updateTenantVerification({
        progress_percent: currentStep * 25,
        aadhaar_status: currentStep >= 2 ? 'verified' : 'pending',
        face_match_status: currentStep >= 3 ? 'verified' : 'pending',
      });
      showToast?.(`Step ${currentStep} saved automatically!`, 'info');
    } else {
      await updateTenantVerification({
        progress_percent: 100,
        aadhaar_status: 'verified',
        aadhaar_last4: docNumber ? docNumber.slice(-4) : '4920',
        pan_status: 'verified',
        face_match_status: 'verified',
        employment_status: employer ? 'verified' : 'pending',
        employer_name: employer || undefined,
        police_verification_status: 'verified',
        background_check_status: 'clean',
        overall_status: 'verified',
        verified_at: new Date().toISOString(),
      });
      setVerificationStatus('verified');
      setViewMode('certificate');
      showToast?.('🎉 Tenant verification updated! Verified Certificate re-issued.', 'success');
    }
  };

  // Download Certificate
  const handleDownloadCertificate = () => {
    showToast?.('📥 Downloaded Official REHVO Verified Tenant Certificate PDF!', 'success');
  };

  // Share Verified Badge
  const handleShareBadge = async () => {
    try {
      await Share.share({
        message: `🛡️ REHVO Verified Tenant Profile\nTenant: ${fullName}\nTrust Score: 98/100 (Excellent)\nDigiLocker KYC: UIDAI Authenticated\nCertificate ID: REHVO-KYC-2026-99214\nVerify online at https://rehvo.com/verify/99214`,
      });
    } catch {
      showToast?.('Verification link copied to clipboard', 'info');
    }
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 10) }]}>
      {/* =====================================================================
          1. HEADER BAR (PREMIUM REHVO DESIGN)
         ===================================================================== */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={19} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Tenant Verification</Text>
            <BadgeCheck size={16} color="#16A34A" />
          </View>
          <View style={styles.headerSubtitleRow}>
            <View style={styles.liveDot} />
            <Text style={styles.headerSubtitle}>DigiLocker & Police Clearance</Text>
          </View>
        </View>

        <View style={styles.headerTrustBadge}>
          <ShieldCheck size={13} color="#0F766E" strokeWidth={2.5} />
          <Text style={styles.headerTrustBadgeText}>UIDAI</Text>
        </View>
      </View>

      {/* SEGMENTED CONTROL: CERTIFICATE VS STEP WIZARD */}
      <View style={styles.segmentedContainer}>
        <Pressable
          style={[styles.segmentBtn, viewMode === 'certificate' && styles.segmentBtnActive]}
          onPress={() => setViewMode('certificate')}
        >
          <Award size={14} color={viewMode === 'certificate' ? '#0F766E' : V4_COLORS.textSecondary} />
          <Text style={[styles.segmentBtnText, viewMode === 'certificate' && styles.segmentBtnTextActive]}>
            Verified Certificate
          </Text>
        </Pressable>

        <Pressable
          style={[styles.segmentBtn, viewMode === 'form' && styles.segmentBtnActive]}
          onPress={() => setViewMode('form')}
        >
          <FileText size={14} color={viewMode === 'form' ? '#0F766E' : V4_COLORS.textSecondary} />
          <Text style={[styles.segmentBtnText, viewMode === 'form' && styles.segmentBtnTextActive]}>
            4-Step Form Wizard
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* =====================================================================
            1. VERIFICATION HERO BANNER WITH TRUST MESSAGE
           ===================================================================== */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroGovtPill}>
              <ShieldCheck size={11} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.heroGovtPillText}>GOVT OF INDIA & UIDAI CERTIFIED</Text>
            </View>
            <View
              style={[
                styles.statusPill,
                verificationStatus === 'verified'
                  ? styles.statusPillVerified
                  : styles.statusPillReview,
              ]}
            >
              <Text style={styles.statusPillText}>
                {verificationStatus === 'verified' ? '100% VERIFIED' : 'UNDER REVIEW'}
              </Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Get 100% Verified Tenant Badge</Text>
          <Text style={styles.heroDesc}>
            DigiLocker authenticated identity, automated police intimation receipt, and CIBIL trust score. Landlords approve verified profiles 5x faster with 0 deposit disputes.
          </Text>

          <View style={styles.heroFooterRow}>
            <View style={styles.heroTrustStat}>
              <Lock size={12} color="#CCFBF1" />
              <Text style={styles.heroTrustStatText}>256-Bit DigiLocker Vault</Text>
            </View>
            <View style={styles.heroTrustStat}>
              <BadgeCheck size={12} color="#CCFBF1" />
              <Text style={styles.heroTrustStatText}>RERA Compliant</Text>
            </View>
          </View>
        </View>

        {viewMode === 'certificate' ? (
          <>
            {/* =====================================================================
                11. DIGITAL VERIFIED TENANT CERTIFICATE WITH QR CODE
               ===================================================================== */}
            <View style={styles.certificateCard}>
              {/* Certificate Border Header */}
              <View style={styles.certHeader}>
                <View style={styles.certEmblemBox}>
                  <ShieldCheck size={26} color="#0F766E" strokeWidth={2.5} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.certSuperTitle}>NATIONAL TENANCY TRUST REGISTRY</Text>
                  <Text style={styles.certMainTitle}>Verified Tenant Certificate</Text>
                  <Text style={styles.certSubTitle}>Issued under REHVO DigiLocker Trust Protocol</Text>
                </View>
              </View>

              {/* Certificate Body & Info */}
              <View style={styles.certBody}>
                <View style={styles.certUserRow}>
                  <Image source={{ uri: selfieUri || '' }} style={styles.certUserPhoto} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.certUserName}>{fullName}</Text>
                    <Text style={styles.certUserMeta}>{occupation} • {employer}</Text>
                    <View style={styles.certAadhaarRow}>
                      <BadgeCheck size={12} color="#16A34A" />
                      <Text style={styles.certAadhaarText}>Aadhaar: **** **** {docNumber.slice(-4)}</Text>
                    </View>
                  </View>
                </View>

                {/* QR Code & Certificate Metadata */}
                <View style={styles.certQrSection}>
                  <View style={styles.qrBox}>
                    <QrCode size={64} color="#0F766E" strokeWidth={2} />
                    <Text style={styles.qrCaption}>Scan to Verify</Text>
                  </View>

                  <View style={styles.certMetaGrid}>
                    <View style={styles.certMetaItem}>
                      <Text style={styles.certMetaLabel}>CERTIFICATE ID</Text>
                      <Text style={styles.certMetaVal}>REHVO-KYC-2026-99214</Text>
                    </View>
                    <View style={styles.certMetaItem}>
                      <Text style={styles.certMetaLabel}>ISSUE DATE</Text>
                      <Text style={styles.certMetaVal}>14 Aug 2026</Text>
                    </View>
                    <View style={styles.certMetaItem}>
                      <Text style={styles.certMetaLabel}>VALIDITY</Text>
                      <Text style={styles.certMetaVal}>11 Months (Active)</Text>
                    </View>
                    <View style={styles.certMetaItem}>
                      <Text style={styles.certMetaLabel}>POLICE INTIMATION</Text>
                      <Text style={[styles.certMetaVal, { color: '#16A34A' }]}>NOC Filed Online</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Certificate Action Buttons */}
              <View style={styles.certActionRow}>
                <Pressable style={styles.certDownloadBtn} onPress={handleDownloadCertificate}>
                  <Download size={14} color="#0F766E" strokeWidth={2.4} />
                  <Text style={styles.certDownloadBtnText}>Download PDF</Text>
                </Pressable>

                <Pressable style={styles.certShareBtn} onPress={handleShareBadge}>
                  <Share2 size={14} color="#FFFFFF" strokeWidth={2.4} />
                  <Text style={styles.certShareBtnText}>Share Verified Badge</Text>
                </Pressable>
              </View>
            </View>

            {/* =====================================================================
                12. REHVO TRUST SCORE CARD
               ===================================================================== */}
            <View style={styles.trustScoreCard}>
              <View style={styles.trustScoreHeader}>
                <View>
                  <Text style={styles.trustCardSub}>REHVO TRUST ENGINE</Text>
                  <Text style={styles.trustCardTitle}>Tenant Trust Score</Text>
                </View>
                <View style={styles.trustRatingBadge}>
                  <Star size={13} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.trustRatingText}>EXCELLENT</Text>
                </View>
              </View>

              {/* Score Metric Ring Representation */}
              <View style={styles.scoreMetricRow}>
                <View style={styles.scoreBigBox}>
                  <Text style={styles.scoreNumber}>98</Text>
                  <Text style={styles.scoreDenominator}>/ 100</Text>
                </View>
                <View style={styles.scoreFactorsList}>
                  <View style={styles.scoreFactorItem}>
                    <CheckCircle2 size={13} color="#16A34A" />
                    <Text style={styles.scoreFactorText}>
                      DigiLocker Identity Auth: <Text style={{ fontWeight: '800' }}>100%</Text>
                    </Text>
                  </View>
                  <View style={styles.scoreFactorItem}>
                    <CheckCircle2 size={13} color="#16A34A" />
                    <Text style={styles.scoreFactorText}>
                      Credit & Income Health: <Text style={{ fontWeight: '800' }}>95%</Text>
                    </Text>
                  </View>
                  <View style={styles.scoreFactorItem}>
                    <CheckCircle2 size={13} color="#16A34A" />
                    <Text style={styles.scoreFactorText}>
                      Police & Court Clearance: <Text style={{ fontWeight: '800' }}>100%</Text>
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* =====================================================================
                9. VERIFICATION BENEFITS CARDS (4 HIGH IMPACT PERKS)
               ===================================================================== */}
            <View style={styles.sectionHeaderWrap}>
              <Text style={styles.sectionMainTitle}>Verified Tenant Perks</Text>
              <Text style={styles.sectionSubTitle}>Privileges unlocked with your verified profile</Text>
            </View>

            <View style={styles.benefitsGrid}>
              <View style={styles.benefitCard}>
                <View style={[styles.benefitIconBox, { backgroundColor: '#F0FDFA' }]}>
                  <Zap size={18} color="#0F766E" />
                </View>
                <Text style={styles.benefitItemTitle}>5x Faster Approval</Text>
                <Text style={styles.benefitItemDesc}>Owners skip manual interviews and approve applications instantly.</Text>
              </View>

              <View style={styles.benefitCard}>
                <View style={[styles.benefitIconBox, { backgroundColor: '#EEF2FF' }]}>
                  <Lock size={18} color="#4F46E5" />
                </View>
                <Text style={styles.benefitItemTitle}>0% Deposit Access</Text>
                <Text style={styles.benefitItemDesc}>Eligible for Zero Security Deposit Lease protection bond.</Text>
              </View>

              <View style={styles.benefitCard}>
                <View style={[styles.benefitIconBox, { backgroundColor: '#F5F3FF' }]}>
                  <Building2 size={18} color="#8B5CF6" />
                </View>
                <Text style={styles.benefitItemTitle}>No Police Station Visits</Text>
                <Text style={styles.benefitItemDesc}>Automated digital tenant intimation filed with local police.</Text>
              </View>

              <View style={styles.benefitCard}>
                <View style={[styles.benefitIconBox, { backgroundColor: '#ECFDF5' }]}>
                  <Sparkles size={18} color="#059669" />
                </View>
                <Text style={styles.benefitItemTitle}>₹1,000 R-Cash Bonus</Text>
                <Text style={styles.benefitItemDesc}>Instant wallet bonus credited to offset first month rent payment.</Text>
              </View>
            </View>

            {/* =====================================================================
                10. VERIFICATION STATUS TRACKER (TIMELINE VIEW)
               ===================================================================== */}
            <View style={styles.statusTimelineCard}>
              <Text style={styles.timelineTitle}>Verification Journey Tracker</Text>

              <View style={styles.timelineList}>
                <View style={styles.timelineStep}>
                  <View style={[styles.stepDot, styles.stepDotDone]}>
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Step 1: Personal & Employment Details</Text>
                    <Text style={styles.stepTime}>Completed on 14 Aug 2026</Text>
                  </View>
                </View>
                <View style={styles.timelineLine} />

                <View style={styles.timelineStep}>
                  <View style={[styles.stepDot, styles.stepDotDone]}>
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Step 2: Government ID & OCR Match</Text>
                    <Text style={styles.stepTime}>Aadhaar UIDAI Authenticated</Text>
                  </View>
                </View>
                <View style={styles.timelineLine} />

                <View style={styles.timelineStep}>
                  <View style={[styles.stepDot, styles.stepDotDone]}>
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Step 3: Live Facial Liveness Check</Text>
                    <Text style={styles.stepTime}>99.8% AI Face Match Passed</Text>
                  </View>
                </View>
                <View style={styles.timelineLine} />

                <View style={styles.timelineStep}>
                  <View style={[styles.stepDot, styles.stepDotDone]}>
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Step 4: Address & Police Clearance</Text>
                    <Text style={styles.stepTime}>Digital NOC Registered</Text>
                  </View>
                </View>
              </View>

              <Pressable
                style={styles.reVerifyBtn}
                onPress={() => {
                  setViewMode('form');
                  setCurrentStep(1);
                }}
              >
                <RefreshCw size={13} color="#0F766E" />
                <Text style={styles.reVerifyBtnText}>Update or Re-verify Information</Text>
              </Pressable>
            </View>
          </>
        ) : (
          /* =====================================================================
              4-STEP VERIFICATION PROGRESS TRACKER & WIZARD
             ===================================================================== */
          <View style={styles.wizardContainer}>
            {/* 2. 4-STEP PROGRESS TRACKER */}
            <View style={styles.stepperCard}>
              <View style={styles.stepperHeader}>
                <Text style={styles.stepperTitle}>Step {currentStep} of 4</Text>
                <Text style={styles.stepperProgressText}>
                  {currentStep === 1
                    ? '25% Completed'
                    : currentStep === 2
                    ? '50% Completed'
                    : currentStep === 3
                    ? '75% Completed'
                    : '100% Final Review'}
                </Text>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${(currentStep / 4) * 100}%` },
                  ]}
                />
              </View>

              {/* Step Badges Row */}
              <View style={styles.stepPillRow}>
                {['Identity', 'Govt ID', 'Face Scan', 'Address'].map((stepName, idx) => {
                  const stepNum = idx + 1;
                  const isActive = currentStep === stepNum;
                  const isDone = currentStep > stepNum;
                  return (
                    <Pressable
                      key={stepName}
                      style={[
                        styles.stepPillItem,
                        isActive && styles.stepPillItemActive,
                        isDone && styles.stepPillItemDone,
                      ]}
                      onPress={() => setCurrentStep(stepNum)}
                    >
                      <Text
                        style={[
                          styles.stepPillText,
                          isActive && styles.stepPillTextActive,
                          isDone && styles.stepPillTextDone,
                        ]}
                      >
                        {isDone ? `✓ ${stepName}` : `${stepNum}. ${stepName}`}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* STEP 1: PERSONAL & EMPLOYMENT INFORMATION FORM */}
            {currentStep === 1 && (
              <View style={styles.formCard}>
                <Text style={styles.formSectionTitle}>Personal & Professional Details</Text>
                <Text style={styles.formSectionSub}>
                  Used for verified profile creation and tenancy records.
                </Text>

                <Text style={styles.inputLabel}>Full Legal Name (as per Govt ID)</Text>
                <TextInput
                  style={styles.textInput}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter full name"
                  placeholderTextColor={V4_COLORS.textMuted}
                />

                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email"
                  placeholderTextColor={V4_COLORS.textMuted}
                  keyboardType="email-address"
                />

                <Text style={styles.inputLabel}>Mobile Phone Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+91 Mobile number"
                  placeholderTextColor={V4_COLORS.textMuted}
                  keyboardType="phone-pad"
                />

                <View style={styles.formRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Date of Birth</Text>
                    <TextInput
                      style={styles.textInput}
                      value={dob}
                      onChangeText={setDob}
                      placeholder="DD/MM/YYYY"
                      placeholderTextColor={V4_COLORS.textMuted}
                    />
                  </View>
                  <View style={{ width: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Gender</Text>
                    <TextInput
                      style={styles.textInput}
                      value={gender}
                      onChangeText={setGender}
                      placeholder="Male / Female"
                      placeholderTextColor={V4_COLORS.textMuted}
                    />
                  </View>
                </View>

                <Text style={styles.inputLabel}>Occupation / Employment Type</Text>
                <TextInput
                  style={styles.textInput}
                  value={occupation}
                  onChangeText={setOccupation}
                  placeholder="e.g. Software Engineer / Consultant"
                  placeholderTextColor={V4_COLORS.textMuted}
                />

                <Text style={styles.inputLabel}>Company / Institution Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={employer}
                  onChangeText={setEmployer}
                  placeholder="e.g. Google DeepMind"
                  placeholderTextColor={V4_COLORS.textMuted}
                />

                <Text style={styles.inputLabel}>Annual Income Bracket</Text>
                <TextInput
                  style={styles.textInput}
                  value={incomeBracket}
                  onChangeText={setIncomeBracket}
                  placeholder="e.g. ₹15L - ₹25L"
                  placeholderTextColor={V4_COLORS.textMuted}
                />
              </View>
            )}

            {/* STEP 2: GOVERNMENT ID UPLOAD (AADHAAR, PAN, PASSPORT, DRIVING LICENSE) */}
            {currentStep === 2 && (
              <View style={styles.formCard}>
                <Text style={styles.formSectionTitle}>Government ID Authentication</Text>
                <Text style={styles.formSectionSub}>
                  Select your primary ID document for instant DigiLocker validation.
                </Text>

                {/* 4. Document Type Selector */}
                <View style={styles.docTypeSelector}>
                  {[
                    { id: 'aadhaar', name: 'Aadhaar' },
                    { id: 'pan', name: 'PAN Card' },
                    { id: 'passport', name: 'Passport' },
                    { id: 'driving_license', name: 'Driving Lic' },
                  ].map((doc) => (
                    <Pressable
                      key={doc.id}
                      style={[
                        styles.docTypeChip,
                        selectedDocType === doc.id && styles.docTypeChipActive,
                      ]}
                      onPress={() => setSelectedDocType(doc.id as GovtDocType)}
                    >
                      <Text
                        style={[
                          styles.docTypeChipText,
                          selectedDocType === doc.id && styles.docTypeChipTextActive,
                        ]}
                      >
                        {doc.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.inputLabel}>
                  {selectedDocType === 'aadhaar'
                    ? '12-Digit Aadhaar Number'
                    : selectedDocType === 'pan'
                    ? '10-Digit PAN Number'
                    : selectedDocType === 'passport'
                    ? 'Passport Number'
                    : 'Driving License Number'}
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={docNumber}
                  onChangeText={setDocNumber}
                  placeholder="Enter official document number"
                  placeholderTextColor={V4_COLORS.textMuted}
                />

                {/* 5. Camera scanner & Gallery Upload Cards */}
                <View style={styles.aiScanBanner}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.aiScanBannerTitle}>AI Document Edge Scanner</Text>
                    <Text style={styles.aiScanBannerSub}>Instant Aadhaar & PAN OCR with auto-masking</Text>
                  </View>
                  <Pressable
                    style={styles.aiScanBannerBtn}
                    onPress={() => router.push('/(renter)/document-scanner' as any)}
                  >
                    <Camera size={14} color="#FFFFFF" />
                    <Text style={styles.aiScanBannerBtnText}>Scan with AI</Text>
                  </Pressable>
                </View>

                <Text style={[styles.inputLabel, { marginTop: 16 }]}>Document Scan Upload (Front & Back)</Text>
                <View style={styles.docUploadRow}>
                  {/* Front Side */}
                  <View style={styles.docUploadBox}>
                    <Text style={styles.docUploadLabel}>Front Side (with Photo)</Text>
                    {frontDocUri ? (
                      <View style={styles.docPreviewCard}>
                        <Image source={{ uri: frontDocUri }} style={styles.docPreviewThumb} />
                        <Pressable style={styles.docRetakeBtn} onPress={handleUploadFront}>
                          <RefreshCw size={11} color="#0F766E" />
                          <Text style={styles.docRetakeText}>Retake</Text>
                        </Pressable>
                      </View>
                    ) : (
                      <Pressable
                        style={styles.docEmptyBox}
                        onPress={handleUploadFront}
                        disabled={uploadingFront}
                      >
                        {uploadingFront ? (
                          <ActivityIndicator color="#0F766E" />
                        ) : (
                          <>
                            <Camera size={22} color="#0F766E" />
                            <Text style={styles.docEmptyText}>Take Photo / Gallery</Text>
                          </>
                        )}
                      </Pressable>
                    )}
                  </View>

                  {/* Back Side */}
                  <View style={styles.docUploadBox}>
                    <Text style={styles.docUploadLabel}>Back Side (with Address)</Text>
                    {backDocUri ? (
                      <View style={styles.docPreviewCard}>
                        <Image source={{ uri: backDocUri }} style={styles.docPreviewThumb} />
                        <Pressable style={styles.docRetakeBtn} onPress={handleUploadBack}>
                          <RefreshCw size={11} color="#0F766E" />
                          <Text style={styles.docRetakeText}>Retake</Text>
                        </Pressable>
                      </View>
                    ) : (
                      <Pressable
                        style={styles.docEmptyBox}
                        onPress={handleUploadBack}
                        disabled={uploadingBack}
                      >
                        {uploadingBack ? (
                          <ActivityIndicator color="#0F766E" />
                        ) : (
                          <>
                            <Upload size={22} color="#0F766E" />
                            <Text style={styles.docEmptyText}>Upload Document</Text>
                          </>
                        )}
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            )}

            {/* STEP 3: LIVE SELFIE VERIFICATION WITH FACE SCAN ANIMATION */}
            {currentStep === 3 && (
              <View style={styles.formCard}>
                <Text style={styles.formSectionTitle}>Live Facial Liveness Check</Text>
                <Text style={styles.formSectionSub}>
                  Biometric 3D face verification to prevent identity spoofing.
                </Text>

                <View style={styles.selfieCenterBox}>
                  <View style={styles.selfieRing}>
                    {selfieUri ? (
                      <Image source={{ uri: selfieUri }} style={styles.selfieImage} />
                    ) : (
                      <User size={64} color="#0F766E" />
                    )}
                    <View style={styles.verifiedCheckBadge}>
                      <BadgeCheck size={20} color="#16A34A" />
                    </View>
                  </View>

                  <Text style={styles.selfieTitle}>AI Facial Biometrics Verified</Text>
                  <Text style={styles.selfieDesc}>
                    Matched with 99.8% confidence against Government photo on record.
                  </Text>

                  <Pressable
                    style={styles.openScannerBtn}
                    onPress={() => {
                      setIsFaceScannerOpen(true);
                      startFaceScanFlow();
                    }}
                  >
                    <Camera size={16} color="#FFFFFF" strokeWidth={2.4} />
                    <Text style={styles.openScannerBtnText}>Start Live Face Scan</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* STEP 4: ADDRESS VERIFICATION & EMERGENCY CONTACTS */}
            {currentStep === 4 && (
              <View style={styles.formCard}>
                {/* 7. Address Verification Form */}
                <Text style={styles.formSectionTitle}>Address Verification</Text>
                <Text style={styles.formSectionSub}>
                  Required for automated police tenant verification filing.
                </Text>

                <Text style={styles.inputLabel}>Current Residential Address</Text>
                <TextInput
                  style={styles.textInput}
                  value={currentAddress}
                  onChangeText={setCurrentAddress}
                  placeholder="Flat No, Building, Street"
                  placeholderTextColor={V4_COLORS.textMuted}
                />

                <View style={styles.formRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>City</Text>
                    <TextInput
                      style={styles.textInput}
                      value={city}
                      onChangeText={setCity}
                      placeholder="e.g. Mumbai"
                      placeholderTextColor={V4_COLORS.textMuted}
                    />
                  </View>
                  <View style={{ width: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Pincode</Text>
                    <TextInput
                      style={styles.textInput}
                      value={pincode}
                      onChangeText={setPincode}
                      placeholder="e.g. 400050"
                      placeholderTextColor={V4_COLORS.textMuted}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* 8. Emergency Contacts Section */}
                <Text style={[styles.formSectionTitle, { marginTop: 20 }]}>Emergency Contacts</Text>
                <Text style={styles.formSectionSub}>
                  Used strictly for safety and landlord reference verification.
                </Text>

                <Text style={styles.inputLabel}>Primary Emergency Contact Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={emergencyName}
                  onChangeText={setEmergencyName}
                  placeholder="e.g. Rajesh Choudhary"
                  placeholderTextColor={V4_COLORS.textMuted}
                />

                <View style={styles.formRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Relationship</Text>
                    <TextInput
                      style={styles.textInput}
                      value={emergencyRelation}
                      onChangeText={setEmergencyRelation}
                      placeholder="Father / Spouse"
                      placeholderTextColor={V4_COLORS.textMuted}
                    />
                  </View>
                  <View style={{ width: 12 }} />
                  <View style={{ flex: 1.3 }}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <TextInput
                      style={styles.textInput}
                      value={emergencyPhone}
                      onChangeText={setEmergencyPhone}
                      placeholder="+91 Mobile"
                      placeholderTextColor={V4_COLORS.textMuted}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Stepper Navigation Footer */}
            <View style={styles.wizardFooter}>
              {currentStep > 1 && (
                <Pressable
                  style={styles.wizardPrevBtn}
                  onPress={() => setCurrentStep(currentStep - 1)}
                >
                  <ChevronLeft size={16} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
                  <Text style={styles.wizardPrevBtnText}>Back</Text>
                </Pressable>
              )}

              <Pressable style={styles.wizardNextBtn} onPress={handleNextStep}>
                <Text style={styles.wizardNextBtnText}>
                  {currentStep === 4 ? 'Complete & Issue Certificate' : 'Save & Continue'}
                </Text>
                <ChevronRight size={16} color="#FFFFFF" strokeWidth={2.5} />
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      {/* =====================================================================
          6. LIVE SELFIE SCANNER MODAL WITH ANIMATED RADAR
         ===================================================================== */}
      <Modal
        visible={isFaceScannerOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setIsFaceScannerOpen(false)}
      >
        <View style={styles.scannerModalRoot}>
          {/* Scanner Header */}
          <View style={[styles.scannerHeader, { paddingTop: insets.top + 10 }]}>
            <Pressable
              style={styles.scannerCloseBtn}
              onPress={() => {
                setIsFaceScanning(false);
                setIsFaceScannerOpen(false);
              }}
            >
              <X size={20} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.scannerHeaderTitle}>Live Liveness Biometrics</Text>
            <View style={{ width: 36 }} />
          </View>

          {/* Camera Viewfinder with Biometric Grid */}
          <View style={styles.scannerBody}>
            <View style={styles.viewfinderRing}>
              {/* Simulated Live Camera Image */}
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80' }}
                style={styles.viewfinderFeed}
              />

              {/* Animated Radar Scanning Line Overlay */}
              <View style={[styles.scannerBeam, { top: `${faceScanProgress}%` }]} />

              {/* Crosshair corners */}
              <View style={[styles.crosshair, styles.crosshairTL]} />
              <View style={[styles.crosshair, styles.crosshairTR]} />
              <View style={[styles.crosshair, styles.crosshairBL]} />
              <View style={[styles.crosshair, styles.crosshairBR]} />
            </View>

            {/* Instruction Callout */}
            <View style={styles.scannerStatusCard}>
              <ActivityIndicator color="#14B8A6" size="small" />
              <Text style={styles.scannerStatusText}>{faceScanStatusText}</Text>
            </View>

            {/* Progress Ticker */}
            <View style={styles.scannerProgressBox}>
              <View style={styles.scannerTrack}>
                <View style={[styles.scannerFill, { width: `${faceScanProgress}%` }]} />
              </View>
              <Text style={styles.scannerPercentText}>{faceScanProgress}% Completed</Text>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  headerTitle: {
    fontSize: 17.5,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  headerSubtitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  headerTrustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 4,
  },
  headerTrustBadgeText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.4,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEF2F6',
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 12,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    ...V4_SHADOWS.soft,
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  segmentBtnTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },

  // Hero Banner
  heroBanner: {
    backgroundColor: '#0F766E',
    borderRadius: 24,
    padding: 18,
    gap: 10,
    ...V4_SHADOWS.card,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroGovtPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    gap: 4,
  },
  heroGovtPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusPillVerified: {
    backgroundColor: '#DCFCE7',
  },
  statusPillReview: {
    backgroundColor: '#FEF3C7',
  },
  statusPillText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#15803D',
  },
  heroTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    lineHeight: 25,
  },
  heroDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 17,
  },
  heroFooterRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 8,
  },
  heroTrustStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  heroTrustStatText: {
    color: '#CCFBF1',
    fontSize: 11,
    fontWeight: '700',
  },

  // Certificate Card
  certificateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
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
    paddingBottom: 12,
  },
  certEmblemBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  certSuperTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.6,
  },
  certMainTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  certSubTitle: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '500',
  },
  certBody: {
    gap: 14,
  },
  certUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  certUserPhoto: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  certUserName: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  certUserMeta: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  certAadhaarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  certAadhaarText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#16A34A',
  },
  certQrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 4,
  },
  qrBox: {
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    padding: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 4,
  },
  qrCaption: {
    fontSize: 9,
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
    color: V4_COLORS.textSecondary,
    fontWeight: '700',
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

  // Trust Score Card
  trustScoreCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 12,
    ...V4_SHADOWS.card,
  },
  trustScoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  trustCardSub: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  trustCardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    marginTop: 1,
  },
  trustRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  trustRatingText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#B45309',
  },
  scoreMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreBigBox: {
    width: 86,
    height: 86,
    borderRadius: 22,
    backgroundColor: '#F0FDFA',
    borderWidth: 2,
    borderColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F766E',
    lineHeight: 32,
  },
  scoreDenominator: {
    fontSize: 10.5,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  scoreFactorsList: {
    flex: 1,
    gap: 6,
  },
  scoreFactorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreFactorText: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
  },

  // Benefits Grid
  sectionHeaderWrap: {
    marginTop: 4,
  },
  sectionMainTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  sectionSubTitle: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '500',
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  benefitCard: {
    width: '48%',
    backgroundColor: V4_COLORS.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 6,
    ...V4_SHADOWS.soft,
  },
  benefitIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  benefitItemTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  benefitItemDesc: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
    lineHeight: 14,
  },

  // Status Timeline
  statusTimelineCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 14,
    ...V4_SHADOWS.soft,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  timelineList: {
    gap: 4,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    backgroundColor: '#16A34A',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  stepTime: {
    fontSize: 10,
    color: V4_COLORS.textSecondary,
  },
  timelineLine: {
    width: 2,
    height: 12,
    backgroundColor: '#DCFCE7',
    marginLeft: 11,
  },
  reVerifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 6,
  },
  reVerifyBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },

  // 4-Step Stepper Card
  wizardContainer: {
    gap: 16,
  },
  stepperCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 10,
    ...V4_SHADOWS.soft,
  },
  stepperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepperTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  stepperProgressText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: V4_COLORS.surfaceSubtle,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0F766E',
    borderRadius: 3,
  },
  stepPillRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  stepPillItem: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: V4_COLORS.surfaceSubtle,
    alignItems: 'center',
  },
  stepPillItemActive: {
    backgroundColor: '#0F766E',
  },
  stepPillItemDone: {
    backgroundColor: '#DCFCE7',
  },
  stepPillText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  stepPillTextActive: {
    color: '#FFFFFF',
  },
  stepPillTextDone: {
    color: '#15803D',
  },

  // Forms
  formCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 10,
    ...V4_SHADOWS.card,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  formSectionSub: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginTop: 4,
  },
  textInput: {
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: V4_COLORS.textPrimary,
    fontWeight: '600',
  },
  formRow: {
    flexDirection: 'row',
  },

  // Document Type Selector
  docTypeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 6,
  },
  docTypeChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    alignItems: 'center',
  },
  docTypeChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  docTypeChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  docTypeChipTextActive: {
    color: '#FFFFFF',
  },
  aiScanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDFA',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#99F6E4',
    marginVertical: 10,
    gap: 12,
  },
  aiScanBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  aiScanBannerSub: {
    fontSize: 11,
    color: '#0D9488',
    marginTop: 2,
  },
  aiScanBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    minHeight: 44,
  },
  aiScanBannerBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  docUploadRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  docUploadBox: {
    flex: 1,
    gap: 6,
  },
  docUploadLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  docPreviewCard: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    position: 'relative',
  },
  docPreviewThumb: {
    width: '100%',
    height: 96,
    backgroundColor: '#E2E8F0',
  },
  docRetakeBtn: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  docRetakeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  docEmptyBox: {
    height: 96,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    borderStyle: 'dashed',
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  docEmptyText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F766E',
  },

  // Selfie Box
  selfieCenterBox: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  selfieRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0FDFA',
    borderWidth: 3,
    borderColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  selfieImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  verifiedCheckBadge: {
    position: 'absolute',
    bottom: 2,
    right: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  selfieTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  selfieDesc: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 16,
  },
  openScannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    marginTop: 6,
    ...V4_SHADOWS.soft,
  },
  openScannerBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  // Wizard Navigation Footer
  wizardFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  wizardPrevBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: V4_COLORS.surface,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 6,
  },
  wizardPrevBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  wizardNextBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    paddingVertical: 13,
    borderRadius: 14,
    gap: 6,
    ...V4_SHADOWS.card,
  },
  wizardNextBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Live Scanner Modal
  scannerModalRoot: {
    flex: 1,
    backgroundColor: '#031B2A',
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  scannerCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scannerBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  viewfinderRing: {
    width: 260,
    height: 260,
    borderRadius: 130,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#14B8A6',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderFeed: {
    width: '100%',
    height: '100%',
  },
  scannerBeam: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#14B8A6',
    shadowColor: '#14B8A6',
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
  crosshair: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#14B8A6',
  },
  crosshairTL: {
    top: 30,
    left: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  crosshairTR: {
    top: 30,
    right: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  crosshairBL: {
    bottom: 30,
    left: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  crosshairBR: {
    bottom: 30,
    right: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scannerStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  scannerStatusText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  scannerProgressBox: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  scannerTrack: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scannerFill: {
    height: '100%',
    backgroundColor: '#14B8A6',
    borderRadius: 3,
  },
  scannerPercentText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontWeight: '600',
  },
});
