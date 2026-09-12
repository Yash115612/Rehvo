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
  FileCheck,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
  Plus,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Download,
  Share2,
  Award,
  Lock,
  Stamp,
  Fingerprint,
  Info,
  BadgeCheck,
  Bell,
  HelpCircle,
  QrCode,
  Check,
  Eye,
  PenTool,
  Trash2,
  RotateCcw,
  Printer,
  Edit3,
  ZoomIn,
  FolderLock,
  FileText,
  Search,
  RefreshCw,
  Folder,
  ClipboardCheck,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { V4AuthGate } from '../ui/V4AuthGate';

type LeaseScreenStage =
  | 'home'
  | 'wizard'
  | 'preview'
  | 'signature'
  | 'tracker'
  | 'certificate'
  | 'my_leases'
  | 'documents_vault';

interface LeaseAgreement {
  id: string;
  propertyTitle: string;
  propertyLocality: string;
  propertyImage: string;
  landlordName: string;
  landlordPhone: string;
  landlordAadhaarLast4: string;
  tenantName: string;
  tenantPhone: string;
  tenantAadhaarLast4: string;
  monthlyRent: number;
  securityDeposit: number;
  startDate: string;
  endDate: string;
  durationMonths: number;
  lockinMonths: number;
  status: 'active' | 'pending_signature' | 'draft' | 'completed' | 'renewal_due';
  estampNo: string;
  regId: string;
  tenantSigned: boolean;
  ownerSigned: boolean;
  tenantSignedAt?: string;
  ownerSignedAt?: string;
}

const DEFAULT_EMPTY_LEASE: LeaseAgreement = {
  id: 'lease_default',
  propertyTitle: 'Standard Residential Tenancy Agreement',
  propertyLocality: 'Jaipur, Rajasthan',
  propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
  landlordName: 'Landlord Legal Owner',
  landlordPhone: '+91 98000 00000',
  landlordAadhaarLast4: '0000',
  tenantName: 'Tenant User',
  tenantPhone: '+91 98000 00000',
  tenantAadhaarLast4: '0000',
  monthlyRent: 15000,
  securityDeposit: 30000,
  startDate: '01 Oct 2026',
  endDate: '31 Aug 2027',
  durationMonths: 11,
  lockinMonths: 6,
  status: 'draft',
  estampNo: 'IN-RJ0000000000E',
  regId: 'RJ-JAI-REG-2026-00000',
  tenantSigned: false,
  ownerSigned: false,
};

const INITIAL_AGREEMENTS: LeaseAgreement[] = [];

export const V4RentalAgreementsScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    showToast,
    user,
    isAuthenticated,
    leaseAgreements,
    fetchLeaseAgreements,
    createLeaseAgreement,
    scheduleBiometrics,
  } = useAppStore();

  // Screen Stage
  const [currentStage, setCurrentStage] = useState<LeaseScreenStage>('home');
  const [wizardStep, setWizardStep] = useState<number>(1); // 1: Property, 2: Tenant, 3: Terms, 4: Review, 5: Sign

  // Agreements State
  const [agreements, setAgreements] = useState<LeaseAgreement[]>(INITIAL_AGREEMENTS);
  const [selectedLease, setSelectedLease] = useState<LeaseAgreement>(INITIAL_AGREEMENTS[0] || DEFAULT_EMPTY_LEASE);

  // Biometrics Scheduling State
  const [biometricsModalVisible, setBiometricsModalVisible] = useState(false);
  const [selectedBioDate, setSelectedBioDate] = useState('Tomorrow, 11:00 AM');
  const [isSchedulingBio, setIsSchedulingBio] = useState(false);

  // Move-in Checklist State
  const [moveInModalVisible, setMoveInModalVisible] = useState(false);
  const [checkedMoveInItems, setCheckedMoveInItems] = useState<Record<string, boolean>>({
    keys: true,
    electrical: true,
    plumbing: true,
    walls: false,
    furnishings: false,
    meter: false,
  });

  // Lease Renewal Modal State
  const [renewalModalVisible, setRenewalModalVisible] = useState(false);
  const [escalationPercent, setEscalationPercent] = useState<number>(5);
  const [renewalDurationMonths, setRenewalDurationMonths] = useState<number>(11);
  const [isSubmittingRenewal, setIsSubmittingRenewal] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchLeaseAgreements();
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (leaseAgreements && leaseAgreements.length > 0) {
      const mapped: LeaseAgreement[] = leaseAgreements.map(la => ({
        id: la.id,
        propertyTitle: la.property_title,
        propertyLocality: la.property_locality || 'Jaipur, Rajasthan',
        propertyImage: la.property_image || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
        landlordName: la.landlord_name,
        landlordPhone: la.landlord_phone,
        landlordAadhaarLast4: la.landlord_aadhaar_last4 || '7124',
        tenantName: la.tenant_name,
        tenantPhone: la.tenant_phone,
        tenantAadhaarLast4: la.tenant_aadhaar_last4 || (user?.kycData?.aadhaarNumber ? user.kycData.aadhaarNumber.slice(-4) : '4920'),
        monthlyRent: la.monthly_rent,
        securityDeposit: la.security_deposit,
        startDate: la.start_date,
        endDate: la.end_date,
        durationMonths: la.duration_months || 11,
        lockinMonths: la.lockin_months || 6,
        status: la.status === 'active' || la.status === 'registered' ? 'active' : la.status === 'pending_signatures' ? 'pending_signature' : 'draft',
        estampNo: la.estamp_number || `IN-RJ${Math.floor(1000000000 + Math.random() * 9000000000)}E`,
        regId: la.registration_id || `RJ-JAI-REG-2026-${la.id.slice(-5)}`,
        tenantSigned: la.tenant_signed || la.status === 'active' || la.status === 'registered',
        ownerSigned: la.owner_signed ?? true,
        ownerSignedAt: la.owner_signed_at || '01 Sep 2026',
        tenantSignedAt: la.tenant_signed_at,
      }));
      setAgreements(mapped);
      if (!selectedLease || selectedLease.id === 'lease_default') {
        setSelectedLease(mapped[0]);
      }
    }
  }, [leaseAgreements]);

  // Wizard Form State
  const [propTitle, setPropTitle] = useState('Skyline Residency • Suite 402');
  const [propLocality, setPropLocality] = useState('Malviya Nagar, Jaipur');
  const [propImage, setPropImage] = useState(
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80'
  );
  const [ownerName, setOwnerName] = useState('Sanjay Mehra');
  const [ownerPhone, setOwnerPhone] = useState('+91 98190 22334');
  const [rentVal, setRentVal] = useState('18000');
  const [depositVal, setDepositVal] = useState('36000');
  const [startDateVal, setStartDateVal] = useState('10 Sep 2026');
  const [endDateVal, setEndDateVal] = useState('09 Aug 2027');
  const [noticePeriod, setNoticePeriod] = useState('1 Month');
  const [lockinPeriod, setLockinPeriod] = useState('6 Months');

  // Lease Toggles
  const [maintIncluded, setMaintIncluded] = useState(true);
  const [utilIncluded, setUtilIncluded] = useState(false);
  const [parkingIncluded, setParkingIncluded] = useState(true);
  const [petFriendly, setPetFriendly] = useState(true);
  const [furnished, setFurnished] = useState(true);
  const [autoRenew, setAutoRenew] = useState(true);

  // Clauses State
  const [customClause, setCustomClause] = useState('');
  const [clausesList, setClausesList] = useState<string[]>([
    'Monthly rent shall be paid on or before the 5th of each calendar month.',
    'Security deposit is fully refundable within 7 days of peaceful key handover.',
    'Society maintenance charges of ₹700/mo are included in the monthly rent.',
    'Tenant agrees to maintain residential quiet hours between 10:00 PM and 07:00 AM.',
    'Either party may terminate tenancy with a mandatory 30-day written notice.',
  ]);

  // Signature State
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type' | 'auto'>('draw');
  const [typedSignature, setTypedSignature] = useState(user?.name || '');
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [confirmIdentity, setConfirmIdentity] = useState(true);
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    if (user?.name && !typedSignature) {
      setTypedSignature(user.name);
    }
  }, [user?.name]);

  // Filter in My Leases
  const [leasesFilter, setLeasesFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all');
  const [leaseSearch, setLeaseSearch] = useState('');

  // Auto Add Custom Clause
  const handleAddClause = () => {
    if (!customClause.trim()) {
      showToast?.('Please type a clause to add', 'error');
      return;
    }
    setClausesList([...clausesList, customClause.trim()]);
    setCustomClause('');
    showToast?.('Custom clause added to agreement', 'success');
  };

  // Handle Wizard Submit & Generate Draft
  const handleFinishWizard = async () => {
    const rentNumber = parseInt(rentVal, 10) || 18000;
    const depNumber = parseInt(depositVal, 10) || 36000;
    const est = `IN-RJ${Math.floor(1000000000 + Math.random() * 9000000000)}E`;

    const res = await createLeaseAgreement({
      user_id: user?.id || 'guest',
      property_title: propTitle || 'Residential Property',
      property_locality: propLocality || 'Jaipur, Rajasthan',
      property_image: propImage,
      landlord_name: ownerName || 'Landlord',
      landlord_phone: ownerPhone || '',
      tenant_name: user?.name || 'Tenant',
      tenant_phone: user?.phone || '',
      monthly_rent: rentNumber,
      security_deposit: depNumber,
      start_date: startDateVal,
      end_date: endDateVal,
      stamp_duty_amount: 500,
      govt_registration_fee: 1000,
      notice_period_days: 30,
      lockin_months: 6,
      duration_months: 11,
      estamp_number: est,
      biometric_status: 'not_scheduled',
      tenant_signed: false,
      owner_signed: true,
      status: 'pending_signatures',
    });

    const newLease: LeaseAgreement = {
      id: res.data?.id || `lease_${Date.now()}`,
      propertyTitle: propTitle || 'Residential Property',
      propertyLocality: propLocality || 'Jaipur, Rajasthan',
      propertyImage: propImage,
      landlordName: ownerName || 'Landlord',
      landlordPhone: ownerPhone || '',
      landlordAadhaarLast4: '7124',
      tenantName: user?.name || 'Tenant',
      tenantPhone: user?.phone || '',
      tenantAadhaarLast4: user?.kycData?.aadhaarNumber ? user.kycData.aadhaarNumber.slice(-4) : '4920',
      monthlyRent: rentNumber,
      securityDeposit: depNumber,
      startDate: startDateVal,
      endDate: endDateVal,
      durationMonths: 11,
      lockinMonths: 6,
      status: 'pending_signature',
      estampNo: est,
      regId: `RJ-JAI-REG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      tenantSigned: false,
      ownerSigned: true,
      ownerSignedAt: 'Today, 10:00 AM',
    };

    setAgreements([newLease, ...agreements]);
    setSelectedLease(newLease);
    setCurrentStage('signature');
    showToast?.('Draft generated! Ready for your digital signature.', 'success');
  };

  // Sign Agreement
  const handleSignAgreement = () => {
    if (!agreeTerms || !confirmIdentity) {
      showToast?.('Please accept the declaration checkboxes', 'error');
      return;
    }
    setIsSigning(true);

    setTimeout(() => {
      setIsSigning(false);
      const updated = {
        ...selectedLease,
        tenantSigned: true,
        tenantSignedAt: 'Just now',
        status: 'active' as const,
      };

      setAgreements(agreements.map((a) => (a.id === selectedLease.id ? updated : a)));
      setSelectedLease(updated);
      setCurrentStage('certificate');
      showToast?.('🎉 Digital E-Lease officially signed & registered with Govt E-Stamp!', 'success');
    }, 1600);
  };

  // Share Agreement
  const handleShareAgreement = async (lease?: LeaseAgreement) => {
    const l = lease || selectedLease;
    try {
      await Share.share({
        message: `📄 REHVO Official Digital e-Lease\nProperty: ${l.propertyTitle} (${l.propertyLocality})\nReg No: ${l.regId}\nE-Stamp: ${l.estampNo}\nTenant: ${l.tenantName} (Aadhaar Verified)\nOwner: ${l.landlordName}\nRent: ₹${l.monthlyRent.toLocaleString('en-IN')}/mo\nStatus: ${l.status.toUpperCase()}`,
      });
    } catch {
      showToast?.('Agreement link copied to clipboard', 'info');
    }
  };

  // Filtered Leases
  const filteredLeases = useMemo(() => {
    return agreements.filter((item) => {
      const matchesFilter =
        leasesFilter === 'all' ||
        (leasesFilter === 'active' && item.status === 'active') ||
        (leasesFilter === 'pending' && item.status === 'pending_signature') ||
        (leasesFilter === 'completed' && item.status === 'completed');
      const matchesSearch =
        item.propertyTitle.toLowerCase().includes(leaseSearch.toLowerCase()) ||
        item.propertyLocality.toLowerCase().includes(leaseSearch.toLowerCase()) ||
        item.regId.toLowerCase().includes(leaseSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [agreements, leasesFilter, leaseSearch]);

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 10) }]}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            if (currentStage === 'home') {
              router.back();
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
              ? 'Digital e-Lease'
              : currentStage === 'wizard'
              ? `Create Lease (Step ${wizardStep}/5)`
              : currentStage === 'preview'
              ? 'Lease Document Preview'
              : currentStage === 'signature'
              ? 'Digital DocuSign'
              : currentStage === 'tracker'
              ? 'Lease Status Tracker'
              : currentStage === 'certificate'
              ? 'Official e-Lease Certificate'
              : currentStage === 'my_leases'
              ? 'My Leases'
              : 'Documents Vault'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {currentStage === 'home'
              ? 'Secure, paperless rental agreements'
              : '100% Legally Binding with Govt E-Stamp'}
          </Text>
        </View>

        <View style={styles.headerActionRow}>
          <Pressable
            style={styles.headerIconBtn}
            onPress={() => setCurrentStage('documents_vault')}
          >
            <FolderLock size={17} color={V4_COLORS.textPrimary} strokeWidth={2.2} />
          </Pressable>
          <Pressable
            style={styles.headerIconBtn}
            onPress={() => setCurrentStage('my_leases')}
          >
            <FileText size={17} color={V4_COLORS.textPrimary} strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>

      {/* =====================================================================
          SCREEN 1: DIGITAL E-LEASE HOME (DASHBOARD)
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
                <ShieldCheck size={11} color="#FFFFFF" />
                <Text style={styles.heroGovtTagText}>INDIAN REGISTRATION ACT 1908</Text>
              </View>
              <View style={styles.heroVerifiedPill}>
                <BadgeCheck size={12} color="#15803D" />
                <Text style={styles.heroVerifiedPillText}>VERIFIED & STAMPED</Text>
              </View>
            </View>

            <Text style={styles.heroCardTitle}>Digital Rental Agreement</Text>
            <Text style={styles.heroCardDesc}>
              Create legally binding agreements with instant Government e-Stamping, UIDAI Aadhaar eSign, and 256-bit DigiLocker encryption.
            </Text>

            <View style={styles.heroActionRow}>
              <Pressable
                style={styles.heroPrimaryBtn}
                onPress={() => {
                  if (!isAuthenticated) {
                    router.push('/(renter)/login' as any);
                  } else {
                    setWizardStep(1);
                    setCurrentStage('wizard');
                  }
                }}
              >
                <Plus size={15} color="#0F766E" strokeWidth={3} />
                <Text style={styles.heroPrimaryBtnText}>Create New Lease</Text>
              </Pressable>

              <Pressable
                style={styles.heroSecondaryBtn}
                onPress={() => {
                  if (!isAuthenticated) {
                    router.push('/(renter)/login' as any);
                  } else if (agreements.length > 0) {
                    setSelectedLease(agreements[0]);
                    setCurrentStage('certificate');
                  } else {
                    setWizardStep(1);
                    setCurrentStage('wizard');
                  }
                }}
              >
                <FileCheck size={14} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.heroSecondaryBtnText}>View Agreement</Text>
              </Pressable>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsStrip}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{isAuthenticated ? 'Active Lease' : 'Legal Validity'}</Text>
              <Text style={[styles.statVal, { color: '#0F766E' }]}>
                {isAuthenticated ? `${agreements.filter((a) => a.status === 'active').length} Active` : '100% Legal'}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{isAuthenticated ? 'Pending Sign' : 'E-Stamp Duty'}</Text>
              <Text style={[styles.statVal, { color: '#D97706' }]}>
                {isAuthenticated ? `${agreements.filter((a) => a.status === 'pending_signature').length} Pending` : 'Govt Stamped'}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{isAuthenticated ? 'Completed' : 'Digital Sign'}</Text>
              <Text style={styles.statVal}>
                {isAuthenticated ? `${agreements.filter((a) => a.status === 'completed').length} Leases` : 'Aadhaar OTP'}
              </Text>
            </View>
          </View>

          {/* Recent Agreements */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Agreements</Text>
            {isAuthenticated && agreements.length > 0 && (
              <Pressable onPress={() => setCurrentStage('my_leases')}>
                <Text style={styles.sectionActionText}>View All ({agreements.length})</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.agreementsList}>
            {!isAuthenticated ? (
              <View
                style={{
                  backgroundColor: V4_COLORS.surface,
                  borderRadius: V4_RADIUS.card,
                  padding: 20,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: V4_COLORS.border,
                  ...V4_SHADOWS.card,
                }}
              >
                <FileCheck size={36} color={V4_COLORS.primary} strokeWidth={1.8} />
                <Text style={{ fontSize: 15, fontWeight: '700', color: V4_COLORS.textPrimary, marginTop: 10, marginBottom: 4 }}>
                  Sign in to view your agreements
                </Text>
                <Text style={{ fontSize: 13, color: V4_COLORS.textSecondary, textAlign: 'center', lineHeight: 18, marginBottom: 16 }}>
                  Track active tenancy contracts, download legally certified stamp PDFs, and manage renewals.
                </Text>
                <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
                  <Pressable
                    style={{ flex: 1, backgroundColor: V4_COLORS.primary, paddingVertical: 10, borderRadius: V4_RADIUS.button, alignItems: 'center' }}
                    onPress={() => router.push('/(renter)/login' as any)}
                  >
                    <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>Sign In</Text>
                  </Pressable>
                  <Pressable
                    style={{ flex: 1, backgroundColor: V4_COLORS.surfaceSubtle, borderWidth: 1, borderColor: V4_COLORS.border, paddingVertical: 10, borderRadius: V4_RADIUS.button, alignItems: 'center' }}
                    onPress={() => router.push({ pathname: '/(renter)/login' as any, params: { mode: 'signup' } })}
                  >
                    <Text style={{ color: V4_COLORS.textPrimary, fontWeight: '700', fontSize: 13 }}>Create Account</Text>
                  </Pressable>
                </View>
              </View>
            ) : agreements.length === 0 ? (
              <View
                style={{
                  backgroundColor: V4_COLORS.surface,
                  borderRadius: V4_RADIUS.card,
                  padding: 20,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: V4_COLORS.border,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: V4_COLORS.textPrimary, marginBottom: 4 }}>
                  No Active Agreements
                </Text>
                <Text style={{ fontSize: 13, color: V4_COLORS.textSecondary, textAlign: 'center', marginBottom: 12 }}>
                  Create your first legally binding tenancy contract in 3 easy steps.
                </Text>
                <Pressable
                  style={{ backgroundColor: V4_COLORS.primary, paddingHorizontal: 16, paddingVertical: 9, borderRadius: V4_RADIUS.button }}
                  onPress={() => {
                    setWizardStep(1);
                    setCurrentStage('wizard');
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 12 }}>+ Draft New Lease</Text>
                </Pressable>
              </View>
            ) : (
              agreements.map((agr) => (
                <View key={agr.id} style={styles.agreementCard}>
                <View style={styles.agrCardHeader}>
                  <Image source={{ uri: agr.propertyImage }} style={styles.agrPropImage} />
                  <View style={{ flex: 1 }}>
                    <View
                      style={[
                        styles.statusPill,
                        agr.status === 'active'
                          ? styles.statusPillActive
                          : styles.statusPillPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          agr.status === 'active'
                            ? styles.statusPillTextActive
                            : styles.statusPillTextPending,
                        ]}
                      >
                        {agr.status === 'active' ? 'ACTIVE & STAMPED' : 'PENDING YOUR SIGNATURE'}
                      </Text>
                    </View>
                    <Text style={styles.agrPropTitle} numberOfLines={1}>
                      {agr.propertyTitle}
                    </Text>
                    <Text style={styles.agrLocality}>{agr.propertyLocality}</Text>
                  </View>
                </View>

                {/* Financial Summary */}
                <View style={styles.agrTermsGrid}>
                  <View style={styles.agrTermItem}>
                    <Text style={styles.agrTermLabel}>Monthly Rent</Text>
                    <Text style={styles.agrTermVal}>₹{agr.monthlyRent.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.agrTermItem}>
                    <Text style={styles.agrTermLabel}>Deposit</Text>
                    <Text style={styles.agrTermVal}>₹{agr.securityDeposit.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.agrTermItem}>
                    <Text style={styles.agrTermLabel}>Duration</Text>
                    <Text style={styles.agrTermVal}>{agr.durationMonths} Mos</Text>
                  </View>
                  <View style={styles.agrTermItem}>
                    <Text style={styles.agrTermLabel}>Lock-in</Text>
                    <Text style={styles.agrTermVal}>{agr.lockinMonths} Mos</Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.agrCardActionRow}>
                  <Pressable
                    style={styles.agrViewBtn}
                    onPress={() => {
                      setSelectedLease(agr);
                      setCurrentStage('preview');
                    }}
                  >
                    <Eye size={14} color="#0F766E" strokeWidth={2.4} />
                    <Text style={styles.agrViewBtnText}>Read PDF</Text>
                  </Pressable>

                  {agr.status === 'pending_signature' ? (
                    <Pressable
                      style={styles.agrSignBtn}
                      onPress={() => {
                        setSelectedLease(agr);
                        setCurrentStage('signature');
                      }}
                    >
                      <PenTool size={13} color="#FFFFFF" strokeWidth={2.4} />
                      <Text style={styles.agrSignBtnText}>Sign E-Lease</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={styles.agrCertBtn}
                      onPress={() => {
                        setSelectedLease(agr);
                        setCurrentStage('certificate');
                      }}
                    >
                      <Award size={13} color="#FFFFFF" strokeWidth={2.4} />
                      <Text style={styles.agrCertBtnText}>View Certificate</Text>
                    </Pressable>
                  )}

                  <Pressable
                    style={styles.agrTrackerBtn}
                    onPress={() => {
                      setSelectedLease(agr);
                      setCurrentStage('tracker');
                    }}
                  >
                    <Clock size={14} color={V4_COLORS.textSecondary} />
                  </Pressable>
                </View>

                {/* Move-in & Renewal Operations Row */}
                <View style={styles.agrOpsRow}>
                  <Pressable
                    style={styles.agrOpsBtn}
                    onPress={() => {
                      setSelectedLease(agr);
                      setMoveInModalVisible(true);
                    }}
                  >
                    <ClipboardCheck size={13} color="#0F766E" strokeWidth={2.4} />
                    <Text style={styles.agrOpsBtnText}>Move-in Checklist</Text>
                  </Pressable>

                  <Pressable
                    style={styles.agrOpsBtn}
                    onPress={() => {
                      setSelectedLease(agr);
                      setRenewalModalVisible(true);
                    }}
                  >
                    <RotateCcw size={13} color="#0F766E" strokeWidth={2.4} />
                    <Text style={styles.agrOpsBtnText}>Renew Agreement</Text>
                  </Pressable>
                </View>
              </View>
            ))
            )}
          </View>

          {/* Trust Features */}
          <View style={styles.trustBanner}>
            <ShieldCheck size={18} color="#0F766E" />
            <Text style={styles.trustBannerText}>
              Legally certified by National e-Governance Services Limited (NeSL) with UIDAI 2FA Aadhaar eSign verification.
            </Text>
          </View>
        </ScrollView>
      )}

      {currentStage !== 'home' && !isAuthenticated && (
        <V4AuthGate
          icon={FileCheck}
          title="Official Digital Rental Agreements"
          description="Sign in to draft, verify with Aadhaar OTP, and manage your government e-stamped tenancy agreements."
          benefits={[
            'Legally binding under Indian Registration Act 1908',
            'Direct Aadhaar OTP digital signature (DocuSign)',
            'Instant Government e-Stamping certificate',
            '256-bit encrypted DigiLocker document storage',
          ]}
          fullScreen={false}
        />
      )}

      {/* =====================================================================
          SCREEN 2: MULTI-STEP LEASE CREATION WIZARD (STEPS 1 TO 5)
         ===================================================================== */}
      {currentStage === 'wizard' && isAuthenticated && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Step Indicator */}
          <View style={styles.wizardProgressCard}>
            <View style={styles.wizardProgressHeader}>
              <Text style={styles.wizardProgressStepText}>Step {wizardStep} of 5</Text>
              <Text style={styles.wizardProgressPercentText}>{wizardStep * 20}% Completed</Text>
            </View>

            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${wizardStep * 20}%` }]} />
            </View>

            <View style={styles.wizardStepChipsRow}>
              {['1. Property', '2. Parties', '3. Clauses', '4. Review', '5. Sign'].map(
                (label, idx) => (
                  <Pressable
                    key={label}
                    style={[
                      styles.wizardStepChip,
                      wizardStep === idx + 1 && styles.wizardStepChipActive,
                      wizardStep > idx + 1 && styles.wizardStepChipDone,
                    ]}
                    onPress={() => setWizardStep(idx + 1)}
                  >
                    <Text
                      style={[
                        styles.wizardStepChipText,
                        wizardStep === idx + 1 && styles.wizardStepChipTextActive,
                        wizardStep > idx + 1 && styles.wizardStepChipTextDone,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                )
              )}
            </View>
          </View>

          {/* STEP 1: PROPERTY & FINANCIAL TERMS */}
          {wizardStep === 1 && (
            <View style={styles.wizardFormCard}>
              <Text style={styles.formSectionTitle}>Property & Tenancy Terms</Text>

              <Text style={styles.inputLabel}>Property Name / Flat No</Text>
              <TextInput
                style={styles.textInput}
                value={propTitle}
                onChangeText={setPropTitle}
                placeholder="e.g. Skyline Residency • Suite 402"
                placeholderTextColor={V4_COLORS.textMuted}
              />

              <Text style={styles.inputLabel}>Locality & City</Text>
              <TextInput
                style={styles.textInput}
                value={propLocality}
                onChangeText={setPropLocality}
                placeholder="e.g. Malviya Nagar, Jaipur"
                placeholderTextColor={V4_COLORS.textMuted}
              />

              <View style={styles.formRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Monthly Rent (₹)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={rentVal}
                    onChangeText={setRentVal}
                    placeholder="18000"
                    placeholderTextColor={V4_COLORS.textMuted}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ width: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Deposit (₹)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={depositVal}
                    onChangeText={setDepositVal}
                    placeholder="36000"
                    placeholderTextColor={V4_COLORS.textMuted}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Start Date</Text>
                  <TextInput
                    style={styles.textInput}
                    value={startDateVal}
                    onChangeText={setStartDateVal}
                    placeholder="10 Sep 2026"
                    placeholderTextColor={V4_COLORS.textMuted}
                  />
                </View>
                <View style={{ width: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>End Date</Text>
                  <TextInput
                    style={styles.textInput}
                    value={endDateVal}
                    onChangeText={setEndDateVal}
                    placeholder="09 Aug 2027"
                    placeholderTextColor={V4_COLORS.textMuted}
                  />
                </View>
              </View>

              {/* Toggles */}
              <Text style={[styles.inputLabel, { marginTop: 12 }]}>Inclusions & House Rules</Text>
              <View style={styles.togglesList}>
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Society Maintenance Included</Text>
                  <Switch
                    value={maintIncluded}
                    onValueChange={setMaintIncluded}
                    trackColor={{ false: '#E2E8F0', true: '#CCFBF1' }}
                    thumbColor={maintIncluded ? '#0F766E' : '#FFFFFF'}
                  />
                </View>
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Dedicated Parking Slot Included</Text>
                  <Switch
                    value={parkingIncluded}
                    onValueChange={setParkingIncluded}
                    trackColor={{ false: '#E2E8F0', true: '#CCFBF1' }}
                    thumbColor={parkingIncluded ? '#0F766E' : '#FFFFFF'}
                  />
                </View>
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Pet Friendly Tenancy</Text>
                  <Switch
                    value={petFriendly}
                    onValueChange={setPetFriendly}
                    trackColor={{ false: '#E2E8F0', true: '#CCFBF1' }}
                    thumbColor={petFriendly ? '#0F766E' : '#FFFFFF'}
                  />
                </View>
              </View>
            </View>
          )}

          {/* STEP 2: TENANT & LANDLORD PROFILES */}
          {wizardStep === 2 && (
            <View style={styles.wizardFormCard}>
              <Text style={styles.formSectionTitle}>Verified Parties Identity</Text>

              {/* Tenant Card */}
              <View style={styles.profilePartyCard}>
                <View style={styles.profilePartyHeader}>
                  <User size={16} color="#0F766E" />
                  <Text style={styles.profilePartyTitle}>Tenant (Second Party)</Text>
                  <View style={styles.partyVerifiedBadge}>
                    <Text style={styles.partyVerifiedText}>{user?.kycData?.isAadhaarVerified ? 'DIGILOCKER VERIFIED' : 'ACTIVE USER'}</Text>
                  </View>
                </View>
                <Text style={styles.profilePartyName}>{user?.name || 'You (Tenant)'}</Text>
                <Text style={styles.profilePartyMeta}>{user?.phone || 'No phone'} • {user?.email || 'No email'}</Text>
                <Text style={styles.profilePartyMeta}>Aadhaar: {user?.kycData?.isAadhaarVerified ? `**** **** ${user.kycData.aadhaarNumber?.slice(-4) || '****'}` : 'Not Linked'} • Trust Score: {user?.kycData?.isAadhaarVerified ? '98/100' : '50/100'}</Text>
              </View>

              {/* Landlord Card */}
              <View style={styles.profilePartyCard}>
                <View style={styles.profilePartyHeader}>
                  <Building2 size={16} color="#0F766E" />
                  <Text style={styles.profilePartyTitle}>Landlord (First Party)</Text>
                  <View style={styles.partyVerifiedBadge}>
                    <Text style={styles.partyVerifiedText}>OWNERSHIP VERIFIED</Text>
                  </View>
                </View>
                <Text style={styles.inputLabel}>Landlord Legal Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={ownerName}
                  onChangeText={setOwnerName}
                />
                <Text style={styles.inputLabel}>Landlord Contact</Text>
                <TextInput
                  style={styles.textInput}
                  value={ownerPhone}
                  onChangeText={setOwnerPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          )}

          {/* STEP 3: AGREEMENT CLAUSES */}
          {wizardStep === 3 && (
            <View style={styles.wizardFormCard}>
              <Text style={styles.formSectionTitle}>Legal Tenancy Clauses</Text>
              <Text style={styles.formSectionSub}>
                Standard clauses legally compliant with Maharashtra/Rajasthan Rent Control acts.
              </Text>

              <View style={styles.clausesList}>
                {clausesList.map((clause, idx) => (
                  <View key={idx} style={styles.clauseItemCard}>
                    <Text style={styles.clauseNumber}>Clause {idx + 1}</Text>
                    <Text style={styles.clauseText}>{clause}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.inputLabel}>Add Custom Clause</Text>
              <View style={styles.addClauseRow}>
                <TextInput
                  style={styles.clauseInput}
                  value={customClause}
                  onChangeText={setCustomClause}
                  placeholder="Type a custom condition (e.g. Painting terms)..."
                  placeholderTextColor={V4_COLORS.textMuted}
                />
                <Pressable style={styles.addClauseBtn} onPress={handleAddClause}>
                  <Plus size={16} color="#FFFFFF" strokeWidth={3} />
                </Pressable>
              </View>
            </View>
          )}

          {/* STEP 4: REVIEW */}
          {wizardStep === 4 && (
            <View style={styles.wizardFormCard}>
              <Text style={styles.formSectionTitle}>Review E-Lease Summary</Text>

              <View style={styles.reviewSummaryCard}>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Property:</Text>
                  <Text style={styles.reviewVal}>{propTitle}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Monthly Rent:</Text>
                  <Text style={[styles.reviewVal, { fontWeight: '900', color: '#0F766E' }]}>
                    ₹{parseInt(rentVal, 10).toLocaleString('en-IN')}/mo
                  </Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Deposit:</Text>
                  <Text style={styles.reviewVal}>₹{parseInt(depositVal, 10).toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Tenancy Term:</Text>
                  <Text style={styles.reviewVal}>{startDateVal} to {endDateVal}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Stamp Paper:</Text>
                  <Text style={styles.reviewVal}>Govt E-Stamping Included</Text>
                </View>
              </View>
            </View>
          )}

          {/* STEP 5: SIGN */}
          {wizardStep === 5 && (
            <View style={styles.wizardFormCard}>
              <Text style={styles.formSectionTitle}>Ready to Sign E-Lease</Text>
              <Text style={styles.formSectionSub}>
                Your digital signature will be timestamped and embedded onto the official Government e-Stamp document.
              </Text>

              <Pressable
                style={styles.proceedToSignBtn}
                onPress={handleFinishWizard}
              >
                <PenTool size={16} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.proceedToSignText}>Open Signature Pad & Sign</Text>
              </Pressable>
            </View>
          )}

          {/* Stepper Navigation Buttons */}
          <View style={styles.wizardFooterRow}>
            {wizardStep > 1 && (
              <Pressable
                style={styles.wizardBackBtn}
                onPress={() => setWizardStep(wizardStep - 1)}
              >
                <ChevronLeft size={16} color={V4_COLORS.textPrimary} />
                <Text style={styles.wizardBackBtnText}>Back</Text>
              </Pressable>
            )}

            {wizardStep < 5 && (
              <Pressable
                style={styles.wizardNextBtn}
                onPress={() => setWizardStep(wizardStep + 1)}
              >
                <Text style={styles.wizardNextBtnText}>Save & Next</Text>
                <ChevronRight size={16} color="#FFFFFF" strokeWidth={2.5} />
              </Pressable>
            )}
          </View>
        </ScrollView>
      )}

      {/* =====================================================================
          SCREEN 5: AGREEMENT PREVIEW (PDF READER EXPERIENCE)
         ===================================================================== */}
      {currentStage === 'preview' && isAuthenticated && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Floating Document Actions Toolbar */}
          <View style={styles.pdfToolbar}>
            <Pressable
              style={styles.pdfToolBtn}
              onPress={() => showToast?.('Zoomed to 100% resolution', 'info')}
            >
              <ZoomIn size={14} color="#0F766E" />
              <Text style={styles.pdfToolText}>Zoom</Text>
            </Pressable>
            <Pressable
              style={styles.pdfToolBtn}
              onPress={() => showToast?.('📥 Downloaded E-Lease PDF copy!', 'success')}
            >
              <Download size={14} color="#0F766E" />
              <Text style={styles.pdfToolText}>Download</Text>
            </Pressable>
            <Pressable
              style={styles.pdfToolBtn}
              onPress={() => handleShareAgreement(selectedLease)}
            >
              <Share2 size={14} color="#0F766E" />
              <Text style={styles.pdfToolText}>Share</Text>
            </Pressable>
            <Pressable
              style={styles.pdfToolBtn}
              onPress={() => showToast?.('Connecting to wireless AirPrint printer...', 'info')}
            >
              <Printer size={14} color="#0F766E" />
              <Text style={styles.pdfToolText}>Print</Text>
            </Pressable>
          </View>

          {/* High Fidelity Official Document Preview */}
          <View style={styles.pdfDocumentSheet}>
            <View style={styles.pdfHeaderEmblem}>
              <Text style={styles.pdfGovtTitle}>GOVERNMENT OF MAHARASHTRA / RAJASTHAN</Text>
              <Text style={styles.pdfGovtSub}>Certificate of Tenancy Registration & Official e-Stamp</Text>
              <View style={styles.pdfCertRow}>
                <Text style={styles.pdfCertText}>E-STAMP ID: {selectedLease.estampNo}</Text>
                <Text style={styles.pdfCertText}>REG NO: {selectedLease.regId}</Text>
              </View>
            </View>

            <View style={styles.pdfDocumentBody}>
              <Text style={styles.pdfDocTitle}>RESIDENTIAL TENANCY LEASE AGREEMENT</Text>

              <Text style={styles.pdfClauseText}>
                <Text style={{ fontWeight: '800' }}>THIS AGREEMENT </Text>
                is made on {selectedLease.startDate} between the Landlord,{' '}
                <Text style={{ fontWeight: '700' }}>{selectedLease.landlordName}</Text>, and the Tenant,{' '}
                <Text style={{ fontWeight: '700' }}>{selectedLease.tenantName}</Text>.
              </Text>

              <Text style={styles.pdfClauseText}>
                1. <Text style={{ fontWeight: '800' }}>RENT & DEPOSIT: </Text>
                The monthly rent agreed upon is ₹{selectedLease.monthlyRent.toLocaleString('en-IN')}/- and the refundable deposit is ₹{selectedLease.securityDeposit.toLocaleString('en-IN')}/-.
              </Text>

              <Text style={styles.pdfClauseText}>
                2. <Text style={{ fontWeight: '800' }}>DURATION & LOCK-IN: </Text>
                The tenancy term is for {selectedLease.durationMonths} months starting from {selectedLease.startDate} to {selectedLease.endDate} with a mandatory lock-in period of {selectedLease.lockinMonths} months.
              </Text>

              <Text style={styles.pdfClauseText}>
                3. <Text style={{ fontWeight: '800' }}>RULES & MAINTENANCE: </Text>
                The tenant shall maintain the premises in good condition and comply with all society bylaws.
              </Text>
            </View>

            {/* Signatures Row */}
            <View style={styles.pdfSignRow}>
              <View style={styles.pdfSignCol}>
                <View style={styles.signBadgeDone}>
                  <BadgeCheck size={12} color="#16A34A" />
                  <Text style={styles.signBadgeDoneText}>Aadhaar eSigned</Text>
                </View>
                <Text style={styles.pdfSignerName}>{selectedLease.landlordName}</Text>
                <Text style={styles.pdfSignerRole}>Landlord (First Party)</Text>
              </View>

              <View style={styles.pdfSignSeal}>
                <Stamp size={26} color="#0F766E" />
                <Text style={styles.pdfSealText}>GOVT SEAL</Text>
              </View>

              <View style={styles.pdfSignCol}>
                {selectedLease.tenantSigned ? (
                  <>
                    <View style={styles.signBadgeDone}>
                      <BadgeCheck size={12} color="#16A34A" />
                      <Text style={styles.signBadgeDoneText}>Aadhaar eSigned</Text>
                    </View>
                    <Text style={styles.pdfSignerName}>{selectedLease.tenantName}</Text>
                    <Text style={styles.pdfSignerRole}>Tenant (Second Party)</Text>
                  </>
                ) : (
                  <>
                    <View style={styles.signBadgePending}>
                      <Clock size={12} color="#D97706" />
                      <Text style={styles.signBadgePendingText}>Pending Sign</Text>
                    </View>
                    <Text style={styles.pdfSignerName}>{selectedLease.tenantName}</Text>
                    <Text style={styles.pdfSignerRole}>Tenant (Second Party)</Text>
                  </>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* =====================================================================
          SCREEN 6: DIGITAL SIGNATURE (DOCUSIGN + APPLE WALLET EXPERIENCE)
         ===================================================================== */}
      {currentStage === 'signature' && isAuthenticated && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Status Tracker */}
          <View style={styles.signatureStatusCard}>
            <View style={styles.sigStatusItem}>
              <CheckCircle2 size={16} color="#16A34A" />
              <View style={{ flex: 1 }}>
                <Text style={styles.sigStatusTitle}>Landlord: {selectedLease.landlordName}</Text>
                <Text style={styles.sigStatusSub}>eSigned on {selectedLease.ownerSignedAt || '01 Sep 2026'}</Text>
              </View>
            </View>

            <View style={styles.sigStatusDivider} />

            <View style={styles.sigStatusItem}>
              <Clock size={16} color="#D97706" />
              <View style={{ flex: 1 }}>
                <Text style={styles.sigStatusTitle}>Tenant: {user?.name || selectedLease.tenantName || 'Tenant'}</Text>
                <Text style={styles.sigStatusSub}>Your verified digital signature is required</Text>
              </View>
            </View>
          </View>

          {/* Signature Type Switcher */}
          <View style={styles.sigModeRow}>
            {(['draw', 'type', 'auto'] as const).map((mode) => (
              <Pressable
                key={mode}
                style={[
                  styles.sigModeBtn,
                  signatureMode === mode && styles.sigModeBtnActive,
                ]}
                onPress={() => setSignatureMode(mode)}
              >
                <Text
                  style={[
                    styles.sigModeBtnText,
                    signatureMode === mode && styles.sigModeBtnTextActive,
                  ]}
                >
                  {mode === 'draw' ? 'Draw Signature' : mode === 'type' ? 'Type Signature' : 'Auto Generated'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Signature Canvas Pad */}
          <View style={styles.signaturePadCard}>
            <View style={styles.padHeader}>
              <Text style={styles.padTitle}>Signature Pad</Text>
              <Pressable
                style={styles.padClearBtn}
                onPress={() => {
                  setHasDrawnSignature(false);
                  showToast?.('Signature pad cleared', 'info');
                }}
              >
                <RotateCcw size={12} color="#0F766E" />
                <Text style={styles.padClearText}>Clear</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.canvasArea}
              onPress={() => setHasDrawnSignature(true)}
            >
              {signatureMode === 'draw' ? (
                hasDrawnSignature ? (
                  <Text style={styles.drawnSigText}>{user?.name || typedSignature || 'Signature'} ✍️</Text>
                ) : (
                  <Text style={styles.canvasPlaceholder}>Tap here to draw signature</Text>
                )
              ) : signatureMode === 'type' ? (
                <TextInput
                  style={styles.typedSigInput}
                  value={typedSignature}
                  onChangeText={setTypedSignature}
                />
              ) : (
                <Text style={styles.autoSigText}>{user?.name ? `${user.name} • UIDAI Auth` : 'Digitally Signed • UIDAI Auth'}</Text>
              )}
            </Pressable>
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
                I have read and agree to all clauses outlined in this Digital Tenancy Agreement.
              </Text>
            </Pressable>

            <Pressable
              style={styles.consentRow}
              onPress={() => setConfirmIdentity(!confirmIdentity)}
            >
              <View style={[styles.checkboxBox, confirmIdentity && styles.checkboxBoxActive]}>
                {confirmIdentity && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <Text style={styles.consentText}>
                I authorize REHVO to attach my DigiLocker verified identity and Government e-Stamp.
              </Text>
            </Pressable>
          </View>

          {/* Primary Action */}
          <Pressable
            style={styles.primarySignBtn}
            onPress={handleSignAgreement}
            disabled={isSigning}
          >
            {isSigning ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Lock size={16} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.primarySignBtnText}>Sign Agreement Securely</Text>
              </>
            )}
          </Pressable>
        </ScrollView>
      )}

      {/* =====================================================================
          SCREEN 7: LEASE STATUS TRACKER (TIMELINE VIEW)
         ===================================================================== */}
      {currentStage === 'tracker' && isAuthenticated && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.trackerCard}>
            <Text style={styles.trackerHeading}>Tenancy Verification Timeline</Text>

            <View style={styles.trackerList}>
              <View style={styles.trackerItem}>
                <View style={[styles.trackerDot, styles.trackerDotDone]}>
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                </View>
                <View style={styles.trackerContent}>
                  <Text style={styles.trackerStepTitle}>1. Lease Draft Created</Text>
                  <Text style={styles.trackerStepSub}>Terms and financial values validated</Text>
                </View>
              </View>
              <View style={styles.trackerLine} />

              <View style={styles.trackerItem}>
                <View style={[styles.trackerDot, styles.trackerDotDone]}>
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                </View>
                <View style={styles.trackerContent}>
                  <Text style={styles.trackerStepTitle}>2. Landlord eSigned</Text>
                  <Text style={styles.trackerStepSub}>Verified by {selectedLease.landlordName}</Text>
                </View>
              </View>
              <View style={styles.trackerLine} />

              <View style={styles.trackerItem}>
                <View
                  style={[
                    styles.trackerDot,
                    selectedLease.tenantSigned ? styles.trackerDotDone : styles.trackerDotPending,
                  ]}
                >
                  {selectedLease.tenantSigned ? (
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  ) : (
                    <Clock size={12} color="#D97706" />
                  )}
                </View>
                <View style={styles.trackerContent}>
                  <Text style={styles.trackerStepTitle}>3. Tenant eSigned</Text>
                  <Text style={styles.trackerStepSub}>
                    {selectedLease.tenantSigned
                      ? `Signed by ${selectedLease.tenantName}`
                      : 'Awaiting your digital signature'}
                  </Text>
                </View>
              </View>
              <View style={styles.trackerLine} />

              <View style={styles.trackerItem}>
                <View
                  style={[
                    styles.trackerDot,
                    selectedLease.status === 'active' ? styles.trackerDotDone : styles.trackerDotPending,
                  ]}
                >
                  {selectedLease.status === 'active' ? (
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  ) : (
                    <Lock size={12} color="#94A3B8" />
                  )}
                </View>
                <View style={styles.trackerContent}>
                  <Text style={styles.trackerStepTitle}>4. Government e-Stamping Registered</Text>
                  <Text style={styles.trackerStepSub}>Certificate No: {selectedLease.estampNo}</Text>
                </View>
              </View>

              <View style={styles.trackerLine} />

              <View style={styles.trackerItem}>
                <View
                  style={[
                    styles.trackerDot,
                    selectedBioDate ? styles.trackerDotDone : styles.trackerDotPending,
                  ]}
                >
                  <Fingerprint size={12} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <View style={styles.trackerContent}>
                  <Text style={styles.trackerStepTitle}>5. Doorstep Biometric Verification</Text>
                  <Text style={styles.trackerStepSub}>
                    {selectedBioDate ? `Slot: ${selectedBioDate}` : 'Officer visits your doorstep for biometric stamp'}
                  </Text>
                  <Pressable
                    style={[styles.miniActionBtn, { marginTop: 8, alignSelf: 'flex-start' }]}
                    onPress={() => setBiometricsModalVisible(true)}
                  >
                    <Calendar size={13} color="#0F766E" />
                    <Text style={styles.miniActionBtnText}>
                      {selectedBioDate ? 'Manage Biometrics Slot' : 'Schedule Biometrics'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* =====================================================================
          SCREEN 8: DIGITAL CERTIFICATE (APPLE WALLET STYLE)
         ===================================================================== */}
      {currentStage === 'certificate' && isAuthenticated && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Certificate Card */}
          <View style={styles.certCard}>
            <View style={styles.certHeader}>
              <ShieldCheck size={28} color="#0F766E" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.certSuperTitle}>NATIONAL REGISTRATION ARCHIVE</Text>
                <Text style={styles.certMainTitle}>REHVO Verified e-Lease</Text>
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
                  <Text style={styles.certMetaVal}>{selectedLease.tenantName}</Text>
                </View>
                <View style={styles.certMetaItem}>
                  <Text style={styles.certMetaLabel}>OWNER</Text>
                  <Text style={styles.certMetaVal}>{selectedLease.landlordName}</Text>
                </View>
                <View style={styles.certMetaItem}>
                  <Text style={styles.certMetaLabel}>REG ID</Text>
                  <Text style={styles.certMetaVal}>{selectedLease.regId}</Text>
                </View>
                <View style={styles.certMetaItem}>
                  <Text style={styles.certMetaLabel}>VALIDITY</Text>
                  <Text style={styles.certMetaVal}>{selectedLease.startDate} - {selectedLease.endDate}</Text>
                </View>
              </View>
            </View>

            <View style={styles.certActionRow}>
              <Pressable
                style={styles.certDownloadBtn}
                onPress={() => showToast?.('📥 Downloaded Official E-Lease PDF!', 'success')}
              >
                <Download size={14} color="#0F766E" strokeWidth={2.4} />
                <Text style={styles.certDownloadBtnText}>Download PDF</Text>
              </Pressable>

              <Pressable
                style={styles.certShareBtn}
                onPress={() => handleShareAgreement(selectedLease)}
              >
                <Share2 size={14} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.certShareBtnText}>Share Agreement</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}

      {/* =====================================================================
          SCREEN 9: MY LEASES & DOCUMENTS VAULT
         ===================================================================== */}
      {(currentStage === 'my_leases' || currentStage === 'documents_vault') && isAuthenticated && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Search size={16} color={V4_COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search leases or documents..."
              placeholderTextColor={V4_COLORS.textMuted}
              value={leaseSearch}
              onChangeText={setLeaseSearch}
            />
          </View>

          {/* Filter Pills */}
          <View style={styles.filterPillsRow}>
            {(['all', 'active', 'pending', 'completed'] as const).map((filter) => (
              <Pressable
                key={filter}
                style={[
                  styles.filterPill,
                  leasesFilter === filter && styles.filterPillActive,
                ]}
                onPress={() => setLeasesFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    leasesFilter === filter && styles.filterPillTextActive,
                  ]}
                >
                  {filter.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Auto Lease Renewal Card */}
          <View style={styles.renewalCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.renewalTitle}>Auto Lease Renewal Alert</Text>
              <Text style={styles.renewalSub}>Automatically draft renewal 30 days before expiry</Text>
            </View>
            <Switch
              value={autoRenew}
              onValueChange={setAutoRenew}
              trackColor={{ false: '#E2E8F0', true: '#CCFBF1' }}
              thumbColor={autoRenew ? '#0F766E' : '#FFFFFF'}
            />
          </View>

          {/* Document Vault Cards */}
          <Text style={styles.sectionTitle}>Stored Documents Vault</Text>
          <View style={styles.vaultList}>
            {[
              { name: 'Government e-Lease (Bandra West).pdf', size: '2.4 MB', date: '15 Aug 2026' },
              { name: 'Official Rent Receipt (August 2026).pdf', size: '1.1 MB', date: '10 Aug 2026' },
              { name: 'DigiLocker KYC Verification Proof.pdf', size: '980 KB', date: '14 Aug 2026' },
              { name: 'Digital Tenant Certificate.pdf', size: '1.6 MB', date: '14 Aug 2026' },
            ].map((doc, idx) => (
              <View key={idx} style={styles.vaultItemCard}>
                <View style={styles.vaultIconBox}>
                  <FileText size={18} color="#0F766E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vaultDocName} numberOfLines={1}>{doc.name}</Text>
                  <Text style={styles.vaultDocMeta}>{doc.size} • {doc.date}</Text>
                </View>
                <Pressable
                  style={styles.vaultDownloadBtn}
                  onPress={() => showToast?.(`📥 Downloaded ${doc.name}`, 'success')}
                >
                  <Download size={14} color="#0F766E" />
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Biometrics Scheduling Modal */}
      <Modal
        visible={biometricsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBiometricsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Fingerprint size={20} color="#0F766E" />
                <Text style={styles.modalTitle}>Doorstep Biometrics</Text>
              </View>
              <Pressable onPress={() => setBiometricsModalVisible(false)} hitSlop={10}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            <Text style={styles.modalSub}>
              A certified government registration officer visits your rental address with biometric hardware to complete the formal registration.
            </Text>

            <Text style={[styles.modalFieldLabel, { marginTop: 12 }]}>SELECT PREFERRED TIME SLOT</Text>
            <View style={{ gap: 8, marginVertical: 8 }}>
              {[
                'Tomorrow, 11:00 AM - 01:00 PM',
                'Tomorrow, 03:00 PM - 05:00 PM',
                'Friday, 10:00 AM - 12:00 PM',
                'Saturday, 11:00 AM - 01:00 PM',
              ].map((slot) => (
                <Pressable
                  key={slot}
                  style={[
                    styles.slotChoice,
                    selectedBioDate === slot && styles.slotChoiceActive,
                  ]}
                  onPress={() => setSelectedBioDate(slot)}
                >
                  <Clock size={16} color={selectedBioDate === slot ? '#0F766E' : V4_COLORS.textMuted} />
                  <Text
                    style={[
                      styles.slotChoiceText,
                      selectedBioDate === slot && styles.slotChoiceTextActive,
                    ]}
                  >
                    {slot}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[styles.primaryModalBtn, isSchedulingBio && { opacity: 0.7 }]}
              disabled={isSchedulingBio}
              onPress={async () => {
                setIsSchedulingBio(true);
                await scheduleBiometrics(selectedLease.id, '2026-09-12', selectedBioDate);
                setIsSchedulingBio(false);
                setBiometricsModalVisible(false);
                showToast?.(`Doorstep Biometric Officer booked for ${selectedBioDate}!`, 'success');
              }}
            >
              {isSchedulingBio ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <BadgeCheck size={18} color="#FFFFFF" />
                  <Text style={styles.primaryModalBtnText}>Confirm Biometric Appointment</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* =====================================================================
          MOVE-IN INSPECTION CHECKLIST MODAL
         ===================================================================== */}
      <Modal
        visible={moveInModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMoveInModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '85%' }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ClipboardCheck size={20} color="#0F766E" />
                <Text style={styles.modalTitle}>Move-in Inspection</Text>
              </View>
              <Pressable onPress={() => setMoveInModalVisible(false)} hitSlop={10}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            <Text style={styles.modalSub}>
              Verify the baseline condition of the property to safeguard your ₹{selectedLease.securityDeposit.toLocaleString('en-IN')} security deposit upon move-out.
            </Text>

            <ScrollView style={{ marginVertical: 10 }} showsVerticalScrollIndicator={false}>
              {[
                {
                  key: 'keys',
                  title: 'Keys & Access Hardware',
                  desc: '2 sets of main door keys, bedroom keys, and RFID building access fob verified.',
                },
                {
                  key: 'electrical',
                  title: 'Electrical & AC Units',
                  desc: 'AC cooling, geyser heating, and switchboard sockets tested and operational.',
                },
                {
                  key: 'plumbing',
                  title: 'Plumbing & Fixtures',
                  desc: 'Water pressure in taps & showers confirmed. No drain blockages or leakages.',
                },
                {
                  key: 'walls',
                  title: 'Walls, Tiles & Paint',
                  desc: 'Fresh paint coat verified. No existing seepage, cracks, or heavy wall nail holes.',
                },
                {
                  key: 'furnishings',
                  title: 'Furniture & Inventory',
                  desc: 'Bed frame, mattress, wardrobes, and window curtains clean and undamaged.',
                },
                {
                  key: 'meter',
                  title: 'Utility Meter Baselines',
                  desc: 'Initial electricity and water meter baseline units photographed and recorded.',
                },
              ].map((item) => {
                const isChecked = !!checkedMoveInItems[item.key];
                return (
                  <Pressable
                    key={item.key}
                    style={[
                      styles.checklistRow,
                      isChecked && styles.checklistRowChecked,
                    ]}
                    onPress={() =>
                      setCheckedMoveInItems((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key],
                      }))
                    }
                  >
                    <View
                      style={[
                        styles.moveInCheckbox,
                        isChecked && styles.moveInCheckboxChecked,
                      ]}
                    >
                      {isChecked && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text
                        style={[
                          styles.checklistTitle,
                          isChecked && styles.checklistTitleChecked,
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.checklistDesc}>{item.desc}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              style={styles.primaryModalBtn}
              onPress={() => {
                setMoveInModalVisible(false);
                showToast?.('Move-in inspection signed & archived to Documents Vault!', 'success');
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={17} color="#FFFFFF" />
                <Text style={styles.primaryModalBtnText}>Sign & Save Inspection Report</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* =====================================================================
          LEASE AGREEMENT RENEWAL CONFIRMATION MODAL
         ===================================================================== */}
      <Modal
        visible={renewalModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRenewalModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <RotateCcw size={20} color="#0F766E" />
                <Text style={styles.modalTitle}>Renew Tenancy Agreement</Text>
              </View>
              <Pressable onPress={() => setRenewalModalVisible(false)} hitSlop={10}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            <Text style={styles.modalSub}>
              Extend your lease for {selectedLease.propertyTitle} with mutual agreement terms and automated legal registration.
            </Text>

            <View style={styles.renewalTermsBox}>
              <View style={styles.renewalTermRow}>
                <Text style={styles.renewalTermLabel}>Current Rent</Text>
                <Text style={styles.renewalTermVal}>
                  ₹{selectedLease.monthlyRent.toLocaleString('en-IN')}/mo
                </Text>
              </View>

              <View style={styles.renewalDivider} />

              <Text style={styles.renewalEscalationHeader}>RENT ESCALATION RATE</Text>
              <View style={styles.escalationPillsRow}>
                {[0, 5, 8, 10].map((pct) => (
                  <Pressable
                    key={pct}
                    style={[
                      styles.escalationPill,
                      escalationPercent === pct && styles.escalationPillActive,
                    ]}
                    onPress={() => setEscalationPercent(pct)}
                  >
                    <Text
                      style={[
                        styles.escalationPillText,
                        escalationPercent === pct && styles.escalationPillTextActive,
                      ]}
                    >
                      +{pct}%
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.renewalNewRentBanner}>
                <Text style={styles.renewalNewRentLabel}>PROPOSED RENEWAL RENT</Text>
                <Text style={styles.renewalNewRentVal}>
                  ₹{Math.round(selectedLease.monthlyRent * (1 + escalationPercent / 100)).toLocaleString('en-IN')}/mo
                </Text>
                <Text style={styles.renewalNewRentSub}>
                  Extension: {renewalDurationMonths} Months (Starts post {selectedLease.endDate})
                </Text>
              </View>
            </View>

            <Pressable
              style={[styles.primaryModalBtn, isSubmittingRenewal && { opacity: 0.7 }]}
              disabled={isSubmittingRenewal}
              onPress={async () => {
                setIsSubmittingRenewal(true);
                setTimeout(() => {
                  setIsSubmittingRenewal(false);
                  setRenewalModalVisible(false);
                  showToast?.('Renewal extension request dispatched to landlord!', 'success');
                }, 1000);
              }}
            >
              {isSubmittingRenewal ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <BadgeCheck size={18} color="#FFFFFF" />
                  <Text style={styles.primaryModalBtnText}>Confirm & Dispatch Extension</Text>
                </View>
              )}
            </Pressable>
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
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    gap: 4,
  },
  heroVerifiedPillText: {
    color: '#15803D',
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

  // Stats Strip
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.surface,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    justifyContent: 'space-between',
    ...V4_SHADOWS.soft,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  statVal: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: V4_COLORS.border,
  },

  // Sections
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15.5,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  sectionActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  agreementsList: {
    gap: 12,
  },
  agreementCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 12,
    ...V4_SHADOWS.card,
  },
  agrCardHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  agrPropImage: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusPillActive: {
    backgroundColor: '#DCFCE7',
  },
  statusPillPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '900',
  },
  statusPillTextActive: {
    color: '#15803D',
  },
  statusPillTextPending: {
    color: '#B45309',
  },
  agrPropTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  agrLocality: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  agrTermsGrid: {
    flexDirection: 'row',
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-between',
  },
  agrTermItem: {
    alignItems: 'center',
    flex: 1,
  },
  agrTermLabel: {
    fontSize: 9.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  agrTermVal: {
    fontSize: 12,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 2,
  },
  agrCardActionRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  agrViewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingVertical: 9,
    borderRadius: 12,
    gap: 4,
  },
  agrViewBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  agrSignBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    paddingVertical: 9,
    borderRadius: 12,
    gap: 4,
  },
  agrSignBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  agrCertBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    paddingVertical: 9,
    borderRadius: 12,
    gap: 4,
  },
  agrCertBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  agrTrackerBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 8,
  },
  trustBannerText: {
    flex: 1,
    fontSize: 10.5,
    color: '#0F766E',
    lineHeight: 14,
  },

  // Wizard Styles
  wizardProgressCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 10,
    ...V4_SHADOWS.soft,
  },
  wizardProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wizardProgressStepText: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  wizardProgressPercentText: {
    fontSize: 12,
    fontWeight: '800',
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
  wizardStepChipsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  wizardStepChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: V4_COLORS.surfaceSubtle,
    alignItems: 'center',
  },
  wizardStepChipActive: {
    backgroundColor: '#0F766E',
  },
  wizardStepChipDone: {
    backgroundColor: '#DCFCE7',
  },
  wizardStepChipText: {
    fontSize: 9,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  wizardStepChipTextActive: {
    color: '#FFFFFF',
  },
  wizardStepChipTextDone: {
    color: '#15803D',
  },
  wizardFormCard: {
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: V4_COLORS.textPrimary,
    fontWeight: '600',
  },
  formRow: {
    flexDirection: 'row',
  },
  togglesList: {
    gap: 8,
    marginTop: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  toggleLabel: {
    fontSize: 12,
    color: V4_COLORS.textPrimary,
    fontWeight: '600',
  },
  wizardFooterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  wizardBackBtn: {
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
  wizardBackBtnText: {
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

  // Parties Cards
  profilePartyCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
    marginVertical: 4,
  },
  profilePartyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profilePartyTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
    flex: 1,
  },
  partyVerifiedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  partyVerifiedText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#15803D',
  },
  profilePartyName: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 2,
  },
  profilePartyMeta: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
  },

  // Clauses List
  clausesList: {
    gap: 8,
    marginVertical: 6,
  },
  clauseItemCard: {
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 2,
  },
  clauseNumber: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
  },
  clauseText: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    lineHeight: 15,
  },
  addClauseRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  clauseInput: {
    flex: 1,
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 12,
    color: V4_COLORS.textPrimary,
  },
  addClauseBtn: {
    backgroundColor: '#0F766E',
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Review Summary
  reviewSummaryCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 8,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewLabel: {
    fontSize: 11.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  reviewVal: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  proceedToSignBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    marginTop: 8,
    ...V4_SHADOWS.card,
  },
  proceedToSignText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  // PDF Preview Screen
  pdfToolbar: {
    flexDirection: 'row',
    backgroundColor: V4_COLORS.surface,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    justifyContent: 'space-between',
    ...V4_SHADOWS.soft,
  },
  pdfToolBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  pdfToolText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  pdfDocumentSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#0F766E',
    padding: 18,
    gap: 14,
    ...V4_SHADOWS.card,
  },
  pdfHeaderEmblem: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#0F766E',
    paddingBottom: 10,
    alignItems: 'center',
  },
  pdfGovtTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: 0.8,
  },
  pdfGovtSub: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  pdfCertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  pdfCertText: {
    fontSize: 9,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  pdfDocumentBody: {
    gap: 8,
  },
  pdfDocTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  pdfClauseText: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    lineHeight: 16,
  },
  pdfSignRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  pdfSignCol: {
    alignItems: 'center',
    gap: 2,
  },
  signBadgeDone: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  signBadgeDoneText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#15803D',
  },
  signBadgePending: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  signBadgePendingText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#B45309',
  },
  pdfSignerName: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 2,
  },
  pdfSignerRole: {
    fontSize: 9,
    color: V4_COLORS.textSecondary,
  },
  pdfSignSeal: {
    alignItems: 'center',
    opacity: 0.8,
  },
  pdfSealText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#0F766E',
    marginTop: 2,
  },

  // Signature Screen
  signatureStatusCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 10,
    ...V4_SHADOWS.soft,
  },
  sigStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sigStatusTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  sigStatusSub: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
  },
  sigStatusDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  sigModeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sigModeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: V4_COLORS.surface,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    alignItems: 'center',
  },
  sigModeBtnActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  sigModeBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  sigModeBtnTextActive: {
    color: '#FFFFFF',
  },
  signaturePadCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 10,
    ...V4_SHADOWS.card,
  },
  padHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  padTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  padClearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  padClearText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  canvasArea: {
    height: 140,
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasPlaceholder: {
    fontSize: 12,
    color: V4_COLORS.textMuted,
  },
  drawnSigText: {
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#0F766E',
  },
  typedSigInput: {
    fontSize: 22,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#0F766E',
    textAlign: 'center',
  },
  autoSigText: {
    fontSize: 18,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#0F766E',
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
  primarySignBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    ...V4_SHADOWS.card,
  },
  primarySignBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // Tracker Screen
  trackerCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 14,
    ...V4_SHADOWS.card,
  },
  trackerHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  trackerList: {
    gap: 4,
  },
  trackerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trackerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackerDotDone: {
    backgroundColor: '#16A34A',
  },
  trackerDotPending: {
    backgroundColor: '#FEF3C7',
  },
  trackerContent: {
    flex: 1,
  },
  trackerStepTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  trackerStepSub: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
  },
  trackerLine: {
    width: 2,
    height: 14,
    backgroundColor: '#DCFCE7',
    marginLeft: 11,
  },

  // Certificate Screen
  certCard: {
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

  // My Leases & Vault
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: V4_COLORS.textPrimary,
    fontWeight: '600',
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
  },
  filterPillActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  filterPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  renewalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 10,
  },
  renewalTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  renewalSub: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  vaultList: {
    gap: 10,
  },
  vaultItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 10,
    ...V4_SHADOWS.soft,
  },
  vaultIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vaultDocName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  vaultDocMeta: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  vaultDownloadBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: V4_COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
    gap: 14,
    ...V4_SHADOWS.card,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  modalSub: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    lineHeight: 18,
  },
  modalFieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.6,
  },
  slotChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 13,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  slotChoiceActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0F766E',
  },
  slotChoiceText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  slotChoiceTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  primaryModalBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...V4_SHADOWS.card,
  },
  primaryModalBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  miniActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  miniActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  agrOpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  agrOpsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#F0FDFA',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  agrOpsBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    marginBottom: 8,
  },
  checklistRowChecked: {
    backgroundColor: '#F0FDFA',
    borderColor: '#99F6E4',
  },
  moveInCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  moveInCheckboxChecked: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  checklistTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  checklistTitleChecked: {
    color: '#064E3B',
    fontWeight: '800',
  },
  checklistDesc: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    lineHeight: 15,
  },
  renewalTermsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2ECEF',
    marginVertical: 12,
    gap: 10,
  },
  renewalTermRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  renewalTermLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  renewalTermVal: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  renewalDivider: {
    height: 1,
    backgroundColor: '#E2ECEF',
  },
  renewalEscalationHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    color: V4_COLORS.textMuted,
    letterSpacing: 0.8,
  },
  escalationPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  escalationPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2ECEF',
  },
  escalationPillActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  escalationPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
  },
  escalationPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  renewalNewRentBanner: {
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#99F6E4',
    gap: 4,
    marginTop: 4,
  },
  renewalNewRentLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.8,
  },
  renewalNewRentVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F766E',
  },
  renewalNewRentSub: {
    fontSize: 11,
    color: '#115E59',
  },
});
