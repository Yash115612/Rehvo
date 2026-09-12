// ==============================================================================
// REHVO V5.5 — HOME UTILITIES & METER TRANSFER ECOSYSTEM (PRODUCTION)
// Live Supabase integration with CRED/Airbnb luxury experience
// Multi-provider electricity bill pay, high-speed broadband scheduler,
// water tanker booking, piped gas PNG setup & society ERP sync
// ==============================================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  ActivityIndicator,
  Switch,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Zap,
  Droplets,
  Flame,
  Wifi,
  Building2,
  Car,
  CheckCircle2,
  Clock,
  Plus,
  X,
  ChevronRight,
  ShieldCheck,
  FileText,
  AlertCircle,
  QrCode,
  Sparkles,
  Camera,
  Upload,
  Calendar,
  Check,
  Ban,
  ArrowRight,
  CreditCard,
  Tv,
  ExternalLink,
  Smartphone,
  Users,
  Share2,
  Receipt,
  Download,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4AuthGate } from '../ui/V4AuthGate';
import { rentalOperationsService } from '../../../services/rentalOperations';
import {
  UtilityProviderRecord,
  UtilityRequestRecord,
  UtilityType,
  ElectricityBillRecord,
  BroadbandPlanRecord,
} from '../../../types';

export type UtilityCategory =
  | 'electricity'
  | 'water'
  | 'gas'
  | 'broadband'
  | 'mobile'
  | 'dth'
  | 'maintenance'
  | 'history';

export interface V4UtilitiesScreenProps {
  initialCategory?: UtilityCategory;
}

const CATEGORIES: { id: UtilityCategory; label: string; icon: any; color: string; desc: string }[] = [
  { id: 'electricity', label: 'Electricity', icon: Zap, color: '#EAB308', desc: 'Tata Power, Adani, BESCOM' },
  { id: 'water', label: 'Water Supply', icon: Droplets, color: '#0EA5E9', desc: 'Tanker & Municipal meter' },
  { id: 'gas', label: 'Piped Gas', icon: Flame, color: '#F97316', desc: 'MGL PNG, IGL, LPG cylinder' },
  { id: 'broadband', label: 'Fiber WiFi', icon: Wifi, color: '#8B5CF6', desc: 'Airtel Xstream, JioFiber' },
  { id: 'mobile', label: 'Mobile Recharge', icon: Smartphone, color: '#10B981', desc: 'Prepaid & Postpaid bills' },
  { id: 'dth', label: 'DTH TV', icon: Tv, color: '#EC4899', desc: 'Tata Play, Airtel Digital' },
  { id: 'maintenance', label: 'Society ERP', icon: Building2, color: '#0F766E', desc: 'Society dues & ledger' },
  { id: 'history', label: 'Bill History', icon: FileText, color: '#64748B', desc: 'Receipts & Tax Invoices' },
];

export const V4UtilitiesScreen: React.FC<V4UtilitiesScreenProps> = React.memo(({ initialCategory = 'electricity' }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    isAuthenticated,
    utilityRequests,
    fetchUtilityRequests,
    createUtilityRequest,
    updateUtilityStatus,
    electricityBills,
    fetchElectricityBills,
    payElectricityBill,
    broadbandPlans,
    fetchBroadbandPlans,
    bookBroadbandInstallation,
    bookWaterTanker,
    bookPngGas,
    showToast,
    leaseAgreements,
    properties,
    utilityAccounts,
    utilityTransactions,
    utilityAutopaySettings,
    fetchUtilityAccounts,
    fetchUtilityTransactions,
    payUtilityBill,
    toggleUtilityAutopay,
    maintenancePayments,
    payMaintenanceBill,
    fetchMaintenancePayments,
  } = useAppStore();

  const [activeCategory, setActiveCategory] = useState<UtilityCategory>(initialCategory);
  const [providers, setProviders] = useState<UtilityProviderRecord[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  // Property Selection
  const activeLease = useMemo(() => leaseAgreements?.find((l) => l.status === 'active') || leaseAgreements?.[0], [leaseAgreements]);
  const activeProperty = useMemo(() => properties?.find((p) => p.id === activeLease?.property_id) || properties?.[0], [properties, activeLease]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(activeProperty?.id || '');

  // Quick Pay & Flatmates Split
  const QUICK_AMOUNTS = [500, 1000, 2000, 5000];
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [splitBillModalVisible, setSplitBillModalVisible] = useState(false);
  const [selectedSplitBill, setSelectedSplitBill] = useState<{ title: string; amount: number } | null>(null);
  const [selectedFlatmateCount, setSelectedFlatmateCount] = useState(2);

  // Mobile Recharge
  const [mobileNumber, setMobileNumber] = useState(user?.phone || '');
  const [mobileOperator, setMobileOperator] = useState('Jio 5G');
  const [selectedMobilePlan, setSelectedMobilePlan] = useState<{ amount: number; desc: string; validity: string } | null>(null);
  const [isRechargingMobile, setIsRechargingMobile] = useState(false);

  // DTH Recharge
  const [dthVcNumber, setDthVcNumber] = useState('');
  const [dthOperator, setDthOperator] = useState('Tata Play HD');
  const [selectedDthPlan, setSelectedDthPlan] = useState<{ amount: number; desc: string; validity: string } | null>(null);
  const [isRechargingDth, setIsRechargingDth] = useState(false);

  // Maintenance & Master AutoPay
  const [isPayingMaint, setIsPayingMaint] = useState(false);
  const [masterAutopay, setMasterAutopay] = useState(true);

  // Setup / Transfer Modal
  const [setupModalVisible, setSetupModalVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<UtilityProviderRecord | null>(null);
  const [consumerNumber, setConsumerNumber] = useState('');
  const [initialMeterReading, setInitialMeterReading] = useState('');
  const [meterPhotoAttached, setMeterPhotoAttached] = useState(false);
  const [billPdfAttached, setBillPdfAttached] = useState(false);
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bill Pay Modal
  const [billPayModalVisible, setBillPayModalVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState<ElectricityBillRecord | null>(null);
  const [isPayingBill, setIsPayingBill] = useState(false);

  // Broadband Booking Modal
  const [broadbandModalVisible, setBroadbandModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<BroadbandPlanRecord | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('Tomorrow');
  const [appointmentSlot, setAppointmentSlot] = useState('Morning (10:00 AM - 01:00 PM)');
  const [isBookingBroadband, setIsBookingBroadband] = useState(false);

  // Water Tanker Modal
  const [tankerModalVisible, setTankerModalVisible] = useState(false);
  const [tankerCapacity, setTankerCapacity] = useState<5000 | 10000>(5000);
  const [waterType, setWaterType] = useState<'potable' | 'domestic'>('potable');
  const [tankerSlot, setTankerSlot] = useState('Morning (08:00 AM - 11:00 AM)');
  const [isBookingTanker, setIsBookingTanker] = useState(false);

  // PNG Gas Modal
  const [pngModalVisible, setPngModalVisible] = useState(false);
  const [pngProvider, setPngProvider] = useState('Mahanagar Gas Limited (MGL)');
  const [pngBpNumber, setPngBpNumber] = useState('');
  const [pngReading, setPngReading] = useState('');
  const [isBookingPng, setIsBookingPng] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUtilityRequests();
      fetchElectricityBills();
      fetchBroadbandPlans();
      fetchUtilityAccounts();
      fetchUtilityTransactions();
      fetchMaintenancePayments();
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    let isMounted = true;
    setLoadingProviders(true);
    rentalOperationsService.getUtilityProviders(activeCategory).then((res) => {
      if (isMounted) {
        setProviders(res.data || []);
        setLoadingProviders(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  const handleOpenSetup = useCallback((provider: UtilityProviderRecord) => {
    setSelectedProvider(provider);
    setConsumerNumber('');
    setInitialMeterReading('');
    setMeterPhotoAttached(false);
    setBillPdfAttached(false);
    setSetupModalVisible(true);
  }, []);

  const handleSubmitSetup = useCallback(async () => {
    if (!consumerNumber.trim()) {
      showToast?.('Please enter your consumer/meter account number', 'error');
      return;
    }
    if (!user?.id) return;

    setIsSubmitting(true);
    const utilityTypeMap: Record<UtilityCategory, UtilityType> = {
      electricity: 'electricity',
      water: 'water',
      gas: 'gas',
      broadband: 'wifi',
      mobile: 'wifi',
      dth: 'wifi',
      maintenance: 'society_reg',
      history: 'electricity',
    };

    const targetProp = properties?.find((p) => p.id === selectedPropertyId) || activeProperty;

    const res = await createUtilityRequest({
      user_id: user.id,
      property_id: targetProp?.id,
      lease_id: activeLease?.id,
      utility_type: utilityTypeMap[activeCategory],
      title: `${selectedProvider?.provider_name || 'Utility'} Connection`,
      provider: selectedProvider?.provider_name || 'Official Provider',
      consumer_number: consumerNumber.trim(),
      meter_reading_initial: initialMeterReading ? Number(initialMeterReading) : 0,
      reading_photo_url: meterPhotoAttached ? `https://rehvo.com/docs/meter_${Date.now()}.jpg` : undefined,
      bill_pdf_url: billPdfAttached ? `https://rehvo.com/docs/bill_${Date.now()}.pdf` : undefined,
      auto_pay_enabled: autoPayEnabled,
      status: 'scheduled',
      scheduled_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      notes: `Property: ${targetProp?.title || 'Home'}. Initial reading: ${initialMeterReading || 'Pending verification'}.`,
    });

    setIsSubmitting(false);
    setSetupModalVisible(false);

    if (res.success) {
      showToast?.('🎉 Utility connection requested! Concierge team notified.', 'success');
    }
  }, [
    consumerNumber,
    user?.id,
    activeCategory,
    properties,
    selectedPropertyId,
    activeProperty,
    activeLease?.id,
    selectedProvider?.provider_name,
    initialMeterReading,
    meterPhotoAttached,
    billPdfAttached,
    autoPayEnabled,
    createUtilityRequest,
    showToast,
  ]);

  const handlePayBill = useCallback(async () => {
    if (!selectedBill) return;
    setIsPayingBill(true);
    const res = await payElectricityBill(selectedBill.id, 'upi');
    setIsPayingBill(false);
    if (res.success) {
      setBillPayModalVisible(false);
    }
  }, [selectedBill, payElectricityBill]);

  const handleBookBroadband = useCallback(async () => {
    if (!selectedPlan) return;
    setIsBookingBroadband(true);
    const targetAddress = activeProperty?.address || `${activeProperty?.title}, Mumbai`;
    const res = await bookBroadbandInstallation({
      property_id: activeProperty?.id,
      plan_id: selectedPlan.id,
      provider: selectedPlan.provider,
      plan_name: selectedPlan.plan_name,
      installation_address: targetAddress,
      appointment_date: appointmentDate,
      appointment_slot: appointmentSlot,
      monthly_price: selectedPlan.price_monthly,
    });
    setIsBookingBroadband(false);
    if (res.success) {
      setBroadbandModalVisible(false);
    }
  }, [selectedPlan, activeProperty, appointmentDate, appointmentSlot, bookBroadbandInstallation]);

  const handleBookTanker = useCallback(async () => {
    setIsBookingTanker(true);
    const targetAddress = activeProperty?.address || `${activeProperty?.title}, Mumbai`;
    const res = await bookWaterTanker({
      property_id: activeProperty?.id,
      capacity_litres: tankerCapacity,
      water_type: waterType,
      delivery_address: targetAddress,
      delivery_date: 'Today',
      delivery_slot: tankerSlot,
      amount: tankerCapacity === 10000 ? 2100 : 1200,
    });
    setIsBookingTanker(false);
    if (res.success) {
      setTankerModalVisible(false);
    }
  }, [activeProperty, tankerCapacity, waterType, tankerSlot, bookWaterTanker]);

  const handleBookPng = useCallback(async () => {
    setIsBookingPng(true);
    const res = await bookPngGas({
      property_id: activeProperty?.id,
      provider: pngProvider,
      consumer_bp_number: pngBpNumber.trim() || undefined,
      connection_type: 'new',
      initial_meter_reading: pngReading ? Number(pngReading) : undefined,
    });
    setIsBookingPng(false);
    if (res.success) {
      setPngModalVisible(false);
      setPngBpNumber('');
      setPngReading('');
    }
  }, [activeProperty?.id, pngProvider, pngBpNumber, pngReading, bookPngGas]);

  if (!isAuthenticated) {
    return (
      <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) + 4 }]}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={19} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
          </Pressable>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Home Utilities</Text>
            <Text style={styles.headerSubtitle}>Electricity, Gas, Water & WiFi</Text>
          </View>
        </View>
        <V4AuthGate
          title="Home Utilities & Meter Setup"
          description="Sign in to manage meter transfers, electricity bills, high-speed fiber broadband, and society gatepasses."
          featureName="Home Utilities"
          badgeText="CONCIERGE GRADE"
          icon={<Zap size={32} color="#0F766E" strokeWidth={2.4} />}
          benefits={[
            'Instant meter reading handover documentation',
            'Pre-vetted high-speed JioFiber and Airtel Xstream connections',
            'Piped gas PNG registration with zero landlord paperwork',
            'Automated monthly utility bills via AutoPay',
          ]}
          fullScreen={false}
        />
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) + 4 }]}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={19} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>Home Utilities</Text>
          <Text style={styles.headerSubtitle}>Digital Meter Handover & Billing</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. PROPERTY LINKED CARD */}
        <View style={styles.propertyCard}>
          <View style={styles.propIcon}>
            <Building2 size={20} color="#0F766E" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.propTitle}>
              {activeProperty?.title || 'Selected Tenancy Home'}
            </Text>
            <Text style={styles.propLocality}>
              {activeProperty?.locality ? `${activeProperty.locality}, ${activeProperty.city}` : 'Bandra West, Mumbai'}
            </Text>
          </View>
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={13} color="#0F766E" />
            <Text style={styles.verifiedBadgeText}>Linked</Text>
          </View>
        </View>

        {/* UPCOMING BILL REMINDER (3-day notice) */}
        <View style={styles.reminderBanner}>
          <View style={styles.reminderIconBox}>
            <Clock size={20} color="#0F766E" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.reminderTitle}>Tata Power Bill Due</Text>
              <View style={styles.reminderDuePill}>
                <Text style={styles.reminderDuePillTxt}>DUE IN 3 DAYS</Text>
              </View>
            </View>
            <Text style={styles.reminderSub}>Amount: ₹1,840 • Pay via UPI/Wallet for 2% cashback</Text>
          </View>
          <Pressable
            style={styles.reminderPayBtn}
            onPress={() => {
              setActiveCategory('electricity');
              if (electricityBills[0]) {
                setSelectedBill(electricityBills[0]);
                setBillPayModalVisible(true);
              }
            }}
          >
            <Text style={styles.reminderPayBtnTxt}>Pay Now</Text>
          </Pressable>
        </View>

        {/* 8-CARD RESIDENT UTILITIES HUB */}
        <View style={styles.gridContainer}>
          <View style={styles.gridHeaderRow}>
            <Text style={styles.gridHeader}>RESIDENT SERVICES & BILLS</Text>
            <Text style={styles.gridHeaderBadge}>8 MODULES</Text>
          </View>
          <View style={styles.gridWrap}>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  style={[styles.gridCard, isSelected && styles.gridCardActive]}
                  onPress={() => setActiveCategory(cat.id)}
                >
                  <View style={[styles.gridIconBox, { backgroundColor: `${cat.color}15` }]}>
                    <Icon size={20} color={cat.color} strokeWidth={2.2} />
                  </View>
                  <Text style={[styles.gridCardTitle, isSelected && styles.gridCardTitleActive]} numberOfLines={1}>
                    {cat.label}
                  </Text>
                  <Text style={styles.gridCardSub} numberOfLines={1}>
                    {cat.desc}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* QUICK PAY CHIPS & AUTOPAY TOGGLE */}
        <View style={styles.quickPayCard}>
          <View style={styles.quickPayHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.quickPayTitle}>Quick Pay Utilities</Text>
              <Text style={styles.quickPaySub}>Instant bill clearance with 2% R-Cash cashback</Text>
            </View>
            <View style={styles.autopaySwitchBox}>
              <Text style={styles.autopaySwitchLabel}>AutoPay</Text>
              <Switch
                value={masterAutopay}
                onValueChange={(val) => {
                  setMasterAutopay(val);
                  showToast?.(val ? 'REHVO AutoPay enabled for all bills' : 'AutoPay paused', 'info');
                }}
                trackColor={{ false: '#CBD5E1', true: '#0F766E' }}
              />
            </View>
          </View>
          <View style={styles.quickChipsRow}>
            {QUICK_AMOUNTS.map((amt) => (
              <Pressable
                key={amt}
                style={[styles.quickChip, customAmount === amt && styles.quickChipActive]}
                onPress={() => {
                  setCustomAmount(amt);
                  showToast?.(`Quick pay ₹${amt} selected`, 'info');
                }}
              >
                <Text style={[styles.quickChipTxt, customAmount === amt && styles.quickChipTxtActive]}>
                  ₹{amt}
                </Text>
              </Pressable>
            ))}
            <Pressable
              style={styles.splitBillTrigger}
              onPress={() => {
                setSelectedSplitBill({ title: 'Tata Power Electricity', amount: 1840 });
                setSplitBillModalVisible(true);
              }}
            >
              <Users size={14} color="#0F766E" />
              <Text style={styles.splitBillTriggerTxt}>Split Bill</Text>
            </Pressable>
          </View>
        </View>

        {/* 3. CATEGORY SELECTOR CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Icon size={16} color={isSelected ? '#0F766E' : V4_COLORS.textMuted} />
                <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 4. CATEGORY SPECIFIC MODULES */}

        {/* --- ELECTRICITY MODULE --- */}
        {activeCategory === 'electricity' && (
          <View style={styles.categoryBlock}>
            {/* Live Bills Section */}
            <Text style={styles.sectionHeader}>ELECTRICITY BILLS & REMINDERS</Text>
            {electricityBills.length === 0 ? (
              <View style={styles.emptyCard}>
                <Zap size={28} color="#EAB308" />
                <Text style={styles.emptyTitle}>No pending electricity bills</Text>
                <Text style={styles.emptySub}>
                  Link your consumer number below to track monthly units and automate bill payments.
                </Text>
              </View>
            ) : (
              electricityBills.map((b) => (
                <View key={b.id} style={styles.billCard}>
                  <View style={styles.billTopRow}>
                    <View>
                      <Text style={styles.billProvider}>{b.provider}</Text>
                      <Text style={styles.billConsumer}>Acc: {b.consumer_number}</Text>
                    </View>
                    <View style={[styles.billStatusPill, b.status === 'paid' ? styles.billPaidPill : styles.billDuePill]}>
                      <Text style={[styles.billStatusTxt, b.status === 'paid' ? styles.billPaidTxt : styles.billDueTxt]}>
                        {b.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.billDetailsRow}>
                    <View>
                      <Text style={styles.billAmount}>₹{b.amount.toLocaleString()}</Text>
                      <Text style={styles.billUnits}>{b.units_consumed} kWh Consumed • Due {b.due_date}</Text>
                    </View>
                    {b.status !== 'paid' && (
                      <Pressable
                        style={styles.payBillBtn}
                        onPress={() => {
                          setSelectedBill(b);
                          setBillPayModalVisible(true);
                        }}
                      >
                        <CreditCard size={15} color="#FFFFFF" />
                        <Text style={styles.payBillBtnTxt}>Pay Now</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* --- BROADBAND MODULE --- */}
        {activeCategory === 'broadband' && (
          <View style={styles.categoryBlock}>
            <Text style={styles.sectionHeader}>VERIFIED HIGH-SPEED FIBER PLANS</Text>
            <View style={styles.plansList}>
              {broadbandPlans.map((plan) => (
                <View key={plan.id} style={styles.planCard}>
                  <View style={styles.planTopRow}>
                    <View>
                      <Text style={styles.planProvider}>{plan.provider}</Text>
                      <Text style={styles.planName}>{plan.plan_name}</Text>
                    </View>
                    {plan.badge && (
                      <View style={styles.planBadge}>
                        <Text style={styles.planBadgeTxt}>{plan.badge}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.speedPriceRow}>
                    <View style={styles.speedBox}>
                      <Text style={styles.speedNumber}>{plan.speed_mbps}</Text>
                      <Text style={styles.speedUnit}>Mbps</Text>
                    </View>
                    <View style={styles.priceBox}>
                      <Text style={styles.priceNumber}>₹{plan.price_monthly}</Text>
                      <Text style={styles.pricePeriod}>/month + GST</Text>
                    </View>
                  </View>

                  {/* OTT Benefits */}
                  <View style={styles.ottRow}>
                    <Tv size={14} color="#7C3AED" />
                    <Text style={styles.ottText}>Includes {plan.ott_benefits.join(' • ')}</Text>
                  </View>

                  <Pressable
                    style={styles.bookPlanBtn}
                    onPress={() => {
                      setSelectedPlan(plan);
                      setBroadbandModalVisible(true);
                    }}
                  >
                    <Wifi size={15} color="#FFFFFF" />
                    <Text style={styles.bookPlanBtnTxt}>Book Free Installation</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* --- WATER MODULE --- */}
        {activeCategory === 'water' && (
          <View style={styles.categoryBlock}>
            <Text style={styles.sectionHeader}>MUNICIPAL WATER & TANKER LOGISTICS</Text>
            <View style={styles.tankerHeroCard}>
              <View style={styles.tankerIconBox}>
                <Droplets size={26} color="#0EA5E9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tankerHeroTitle}>Verified Water Tanker Dispatch</Text>
                <Text style={styles.tankerHeroSub}>
                  Direct municipal BMC/BWSSB certified drinking and domestic water tankers with guaranteed 2-hr delivery.
                </Text>
              </View>
              <Pressable
                style={styles.tankerHeroBtn}
                onPress={() => setTankerModalVisible(true)}
              >
                <Plus size={16} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.tankerHeroBtnTxt}>Book Tanker</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* --- GAS MODULE --- */}
        {activeCategory === 'gas' && (
          <View style={styles.categoryBlock}>
            <Text style={styles.sectionHeader}>PIPED NATURAL GAS (PNG) REGISTRATION</Text>
            <View style={styles.pngHeroCard}>
              <View style={styles.pngIconBox}>
                <Flame size={26} color="#F97316" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pngHeroTitle}>MGL & IGL Piped Gas Setup</Text>
                <Text style={styles.pngHeroSub}>
                  Record opening meter reading or transfer billing to avoid paying predecessor arrears.
                </Text>
              </View>
              <Pressable
                style={styles.pngHeroBtn}
                onPress={() => setPngModalVisible(true)}
              >
                <Plus size={16} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.pngHeroBtnTxt}>Setup PNG</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* --- SOCIETY ERP / MAINTENANCE --- */}
        {activeCategory === 'maintenance' && (
          <View style={styles.categoryBlock}>
            <Text style={styles.sectionHeader}>SOCIETY MAINTENANCE & COMMUNITY DESK</Text>
            
            {/* Society Due Bill Card */}
            <View style={styles.maintDueCard}>
              <View style={styles.maintTopRow}>
                <View>
                  <Text style={styles.maintSocietyName}>Godrej Platinum Woods Society</Text>
                  <Text style={styles.maintFlatNo}>Unit: Tower A • Suite 402</Text>
                </View>
                <View style={styles.maintDueBadge}>
                  <Text style={styles.maintDueBadgeTxt}>DUE</Text>
                </View>
              </View>

              <View style={styles.maintAmountBox}>
                <Text style={styles.maintAmountLabel}>SEPTEMBER 2026 MAINTENANCE</Text>
                <Text style={styles.maintAmountVal}>₹4,850</Text>
                <Text style={styles.maintDueDate}>Due by 15 Sept 2026 • 1.5% cashback on pay</Text>
              </View>

              <View style={styles.maintBreakdownBox}>
                <View style={styles.maintItemRow}>
                  <Text style={styles.maintItemLabel}>Common Electricity & Security</Text>
                  <Text style={styles.maintItemVal}>₹2,900</Text>
                </View>
                <View style={styles.maintItemRow}>
                  <Text style={styles.maintItemLabel}>Sinking & Repair Reserve Fund</Text>
                  <Text style={styles.maintItemVal}>₹1,200</Text>
                </View>
                <View style={styles.maintItemRow}>
                  <Text style={styles.maintItemLabel}>Lift AMC & Water Cess</Text>
                  <Text style={styles.maintItemVal}>₹750</Text>
                </View>
              </View>

              <Pressable
                style={[styles.payMaintBtn, isPayingMaint && { opacity: 0.7 }]}
                disabled={isPayingMaint}
                onPress={async () => {
                  setIsPayingMaint(true);
                  await payMaintenanceBill({
                    society_name: 'Godrej Platinum Woods Society',
                    unit_number: 'Tower A • Suite 402',
                    bill_month: 'September 2026',
                    amount: 4850,
                  });
                  setIsPayingMaint(false);
                }}
              >
                {isPayingMaint ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.payMaintBtnTxt}>Pay Maintenance ₹4,850</Text>
                )}
              </Pressable>
            </View>

            {/* Quick Links to Society Hub */}
            <Text style={[styles.sectionHeader, { marginTop: 18 }]}>COMMUNITY PORTAL SHORTCUTS</Text>
            <View style={styles.societyShortcutsGrid}>
              <Pressable style={styles.shortcutCard} onPress={() => router.push('/(renter)/society/visitor-pass' as any)}>
                <View style={[styles.shortcutIcon, { backgroundColor: '#CCFBF1' }]}>
                  <QrCode size={18} color="#0F766E" />
                </View>
                <Text style={styles.shortcutTxt}>Visitor Pass</Text>
              </Pressable>
              <Pressable style={styles.shortcutCard} onPress={() => router.push('/(renter)/society/delivery-pass' as any)}>
                <View style={[styles.shortcutIcon, { backgroundColor: '#FEF3C7' }]}>
                  <ShieldCheck size={18} color="#D97706" />
                </View>
                <Text style={styles.shortcutTxt}>Delivery Pass</Text>
              </Pressable>
              <Pressable style={styles.shortcutCard} onPress={() => router.push('/(renter)/society/complaints' as any)}>
                <View style={[styles.shortcutIcon, { backgroundColor: '#FEE2E2' }]}>
                  <AlertCircle size={18} color="#DC2626" />
                </View>
                <Text style={styles.shortcutTxt}>Complaints</Text>
              </Pressable>
              <Pressable style={styles.shortcutCard} onPress={() => router.push('/(renter)/society/notices' as any)}>
                <View style={[styles.shortcutIcon, { backgroundColor: '#E0E7FF' }]}>
                  <FileText size={18} color="#4F46E5" />
                </View>
                <Text style={styles.shortcutTxt}>Notice Board</Text>
              </Pressable>
              <Pressable style={styles.shortcutCard} onPress={() => router.push('/(renter)/society/amenities' as any)}>
                <View style={[styles.shortcutIcon, { backgroundColor: '#F3E8FF' }]}>
                  <Sparkles size={18} color="#9333EA" />
                </View>
                <Text style={styles.shortcutTxt}>Amenities</Text>
              </Pressable>
              <Pressable style={styles.shortcutCard} onPress={() => router.push('/(renter)/society/sos' as any)}>
                <View style={[styles.shortcutIcon, { backgroundColor: '#FFE4E6' }]}>
                  <AlertCircle size={18} color="#E11D48" />
                </View>
                <Text style={styles.shortcutTxt}>SOS Emergency</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* --- MOBILE RECHARGE MODULE --- */}
        {activeCategory === 'mobile' && (
          <View style={styles.categoryBlock}>
            <Text style={styles.sectionHeader}>MOBILE RECHARGE & POSTPAID BILLS</Text>
            <View style={styles.rechargeCard}>
              <Text style={styles.rechargeLabel}>SELECT OPERATOR</Text>
              <View style={styles.operatorRow}>
                {['Jio 5G', 'Airtel 5G', 'Vi Hero', 'BSNL'].map((op) => (
                  <Pressable
                    key={op}
                    style={[styles.operatorPill, mobileOperator === op && styles.operatorPillActive]}
                    onPress={() => setMobileOperator(op)}
                  >
                    <Text style={[styles.operatorTxt, mobileOperator === op && styles.operatorTxtActive]}>{op}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.rechargeLabel}>MOBILE NUMBER</Text>
              <TextInput
                style={styles.modalInput}
                value={mobileNumber}
                onChangeText={setMobileNumber}
                placeholder="Enter 10-digit mobile number"
                placeholderTextColor={V4_COLORS.textMuted}
                keyboardType="phone-pad"
                maxLength={10}
              />

              <Text style={styles.rechargeLabel}>POPULAR PLANS (2% CASHBACK)</Text>
              <View style={styles.planList}>
                {[
                  { amount: 299, desc: '1.5 GB/day • Unlimited 5G • 100 SMS/day', validity: '28 Days' },
                  { amount: 479, desc: '1.5 GB/day • Unlimited Voice • Weekend rollover', validity: '56 Days' },
                  { amount: 719, desc: '2 GB/day • Disney+ Hotstar Mobile 3mo • 5G', validity: '84 Days' },
                  { amount: 2999, desc: '2.5 GB/day • Annual Luxury Pass • Unlimited 5G', validity: '365 Days' },
                ].map((plan) => (
                  <Pressable
                    key={plan.amount}
                    style={[styles.rechargePlanCard, selectedMobilePlan?.amount === plan.amount && styles.rechargePlanCardActive]}
                    onPress={() => setSelectedMobilePlan(plan)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rechargePlanAmount}>₹{plan.amount}</Text>
                      <Text style={styles.rechargePlanDesc}>{plan.desc}</Text>
                    </View>
                    <View style={styles.rechargePlanValidityBox}>
                      <Text style={styles.rechargePlanValidity}>{plan.validity}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>

              <Pressable
                style={[styles.submitBtn, (!selectedMobilePlan || isRechargingMobile) && { opacity: 0.6 }]}
                disabled={!selectedMobilePlan || isRechargingMobile}
                onPress={async () => {
                  if (!mobileNumber || mobileNumber.length < 10) {
                    showToast?.('Please enter a valid 10-digit mobile number', 'error');
                    return;
                  }
                  setIsRechargingMobile(true);
                  const res = await payUtilityBill({
                    billerName: `${mobileOperator} Recharge`,
                    category: 'mobile',
                    consumerNumber: mobileNumber,
                    amount: selectedMobilePlan?.amount || 299,
                    paymentMethod: 'upi',
                  });
                  setIsRechargingMobile(false);
                  if (res.success) {
                    setSelectedMobilePlan(null);
                  }
                }}
              >
                {isRechargingMobile ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitBtnText}>
                    Pay ₹{selectedMobilePlan ? selectedMobilePlan.amount : '---'} & Recharge
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        )}

        {/* --- DTH RECHARGE MODULE --- */}
        {activeCategory === 'dth' && (
          <View style={styles.categoryBlock}>
            <Text style={styles.sectionHeader}>DTH SATELLITE TV RECHARGE</Text>
            <View style={styles.rechargeCard}>
              <Text style={styles.rechargeLabel}>SELECT DTH OPERATOR</Text>
              <View style={styles.operatorRow}>
                {['Tata Play HD', 'Airtel Digital TV', 'Dish TV', 'Sun Direct'].map((op) => (
                  <Pressable
                    key={op}
                    style={[styles.operatorPill, dthOperator === op && styles.operatorPillActive]}
                    onPress={() => setDthOperator(op)}
                  >
                    <Text style={[styles.operatorTxt, dthOperator === op && styles.operatorTxtActive]}>{op}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.rechargeLabel}>SUBSCRIBER ID / VC NUMBER</Text>
              <TextInput
                style={styles.modalInput}
                value={dthVcNumber}
                onChangeText={setDthVcNumber}
                placeholder="e.g. 1098273641 or Smart Card No"
                placeholderTextColor={V4_COLORS.textMuted}
                keyboardType="numeric"
              />

              <Text style={styles.rechargeLabel}>POPULAR MONTHLY PACKS</Text>
              <View style={styles.planList}>
                {[
                  { amount: 250, desc: 'Hindi Value Lite • 120 Channels • SD Quality', validity: '30 Days' },
                  { amount: 450, desc: 'Family HD Delight • 280 Channels • 65 HD Channels', validity: '30 Days' },
                  { amount: 750, desc: 'Mega Sports Ultra HD • 420 Channels • All Sports + 4K', validity: '30 Days' },
                ].map((pack) => (
                  <Pressable
                    key={pack.amount}
                    style={[styles.rechargePlanCard, selectedDthPlan?.amount === pack.amount && styles.rechargePlanCardActive]}
                    onPress={() => setSelectedDthPlan(pack)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rechargePlanAmount}>₹{pack.amount}</Text>
                      <Text style={styles.rechargePlanDesc}>{pack.desc}</Text>
                    </View>
                    <View style={styles.rechargePlanValidityBox}>
                      <Text style={styles.rechargePlanValidity}>{pack.validity}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>

              <Pressable
                style={[styles.submitBtn, (!selectedDthPlan || isRechargingDth) && { opacity: 0.6 }]}
                disabled={!selectedDthPlan || isRechargingDth}
                onPress={async () => {
                  if (!dthVcNumber || dthVcNumber.length < 8) {
                    showToast?.('Please enter a valid Subscriber ID', 'error');
                    return;
                  }
                  setIsRechargingDth(true);
                  const res = await payUtilityBill({
                    billerName: `${dthOperator}`,
                    category: 'dth',
                    consumerNumber: dthVcNumber,
                    amount: selectedDthPlan?.amount || 450,
                    paymentMethod: 'upi',
                  });
                  setIsRechargingDth(false);
                  if (res.success) {
                    setSelectedDthPlan(null);
                  }
                }}
              >
                {isRechargingDth ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitBtnText}>
                    Recharge ₹{selectedDthPlan ? selectedDthPlan.amount : '---'}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        )}

        {/* --- UTILITY HISTORY & TAX RECEIPTS --- */}
        {activeCategory === 'history' && (
          <View style={styles.categoryBlock}>
            <Text style={styles.sectionHeader}>PAID UTILITIES & TAX RECEIPTS</Text>
            {utilityTransactions.length === 0 && maintenancePayments.filter((m) => m.status === 'paid').length === 0 ? (
              <View style={styles.emptyCard}>
                <FileText size={28} color={V4_COLORS.textMuted} />
                <Text style={styles.emptyTitle}>No transaction history yet</Text>
                <Text style={styles.emptySub}>
                  Cleared bills and downloadable GST tax invoices will automatically appear here.
                </Text>
              </View>
            ) : (
              <View style={styles.historyList}>
                {utilityTransactions.map((tx) => (
                  <View key={tx.id} style={styles.historyCard}>
                    <View style={styles.historyTopRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.historyProvider}>{tx.provider}</Text>
                        <Text style={styles.historyMeta}>
                          Acc: {tx.consumer_number} • {new Date(tx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.historyAmount}>₹{tx.amount.toLocaleString()}</Text>
                        <View style={styles.historyBadge}>
                          <Text style={styles.historyBadgeTxt}>PAID ✓</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.historyActionsRow}>
                      <Pressable
                        style={styles.historyActionBtn}
                        onPress={() => showToast?.(`📄 Downloading receipt ${tx.id.toUpperCase()}.pdf`, 'success')}
                      >
                        <Download size={14} color="#0F766E" />
                        <Text style={styles.historyActionTxt}>Tax Receipt</Text>
                      </Pressable>
                      <Pressable
                        style={styles.historyActionBtn}
                        onPress={() => {
                          setSelectedSplitBill({ title: tx.provider, amount: tx.amount });
                          setSplitBillModalVisible(true);
                        }}
                      >
                        <Users size={14} color="#0F766E" />
                        <Text style={styles.historyActionTxt}>Split with Flatmates</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}

                {maintenancePayments.filter((m) => m.status === 'paid').map((m) => (
                  <View key={m.id} style={styles.historyCard}>
                    <View style={styles.historyTopRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.historyProvider}>{m.society_name}</Text>
                        <Text style={styles.historyMeta}>{m.billing_month} • {m.flat_number}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.historyAmount}>₹{m.amount.toLocaleString()}</Text>
                        <View style={styles.historyBadge}>
                          <Text style={styles.historyBadgeTxt}>SOCIETY PAID ✓</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.historyActionsRow}>
                      <Pressable
                        style={styles.historyActionBtn}
                        onPress={() => showToast?.(`📄 Society Receipt downloaded for ${m.billing_month}`, 'success')}
                      >
                        <Download size={14} color="#0F766E" />
                        <Text style={styles.historyActionTxt}>Official Receipt</Text>
                      </Pressable>
                      <Pressable
                        style={styles.historyActionBtn}
                        onPress={() => {
                          setSelectedSplitBill({ title: `${m.society_name} (${m.billing_month})`, amount: m.amount });
                          setSplitBillModalVisible(true);
                        }}
                      >
                        <Users size={14} color="#0F766E" />
                        <Text style={styles.historyActionTxt}>Split with Flatmates</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* 5. VERIFIED UTILITY PROVIDERS (METER TRANSFER) */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeader}>OFFICIAL UTILITY PROVIDERS</Text>
          {loadingProviders ? (
            <ActivityIndicator color="#0F766E" style={{ marginVertical: 24 }} />
          ) : providers.length === 0 ? (
            <View style={styles.emptyCard}>
              <AlertCircle size={28} color={V4_COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No verified providers listed</Text>
              <Text style={styles.emptySub}>
                Contact your property concierge to initiate custom meter transfer.
              </Text>
            </View>
          ) : (
            providers.map((prov) => (
              <View key={prov.id} style={styles.providerCard}>
                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{prov.provider_name}</Text>
                  <Text style={styles.providerMeta}>
                    {prov.region} {prov.customer_care ? `• Helpline: ${prov.customer_care}` : ''}
                  </Text>
                </View>
                <Pressable
                  style={styles.connectBtn}
                  onPress={() => handleOpenSetup(prov)}
                >
                  <Text style={styles.connectBtnText}>Setup</Text>
                  <ChevronRight size={14} color="#0F766E" />
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* SETUP UTILITY MODAL */}
      <Modal
        visible={setupModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSetupModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Setup {selectedProvider?.provider_name}</Text>
              <Pressable onPress={() => setSetupModalVisible(false)} hitSlop={10}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>CONSUMER / ACCOUNT NUMBER *</Text>
              <TextInput
                style={styles.modalInput}
                value={consumerNumber}
                onChangeText={setConsumerNumber}
                placeholder="e.g. 1029384728 or RR Number"
                placeholderTextColor={V4_COLORS.textMuted}
              />

              <Text style={styles.inputLabel}>INITIAL METER READING (OPTIONAL)</Text>
              <TextInput
                style={styles.modalInput}
                value={initialMeterReading}
                onChangeText={setInitialMeterReading}
                placeholder="e.g. 04821.5 kWh or Units"
                placeholderTextColor={V4_COLORS.textMuted}
                keyboardType="numeric"
              />

              {/* UPLOAD METER PHOTO & BILL PDF */}
              <Text style={styles.inputLabel}>VERIFICATION ATTACHMENTS</Text>
              <View style={styles.attachmentRow}>
                <Pressable
                  style={[styles.attachBtn, meterPhotoAttached && styles.attachBtnActive]}
                  onPress={() => {
                    setMeterPhotoAttached(!meterPhotoAttached);
                    showToast?.(meterPhotoAttached ? 'Photo removed' : '📸 Meter photo attached', 'info');
                  }}
                >
                  <Camera size={16} color={meterPhotoAttached ? '#0F766E' : '#64748B'} />
                  <Text style={[styles.attachBtnTxt, meterPhotoAttached && styles.attachBtnTxtActive]}>
                    {meterPhotoAttached ? 'Photo Added ✓' : 'Meter Photo'}
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.attachBtn, billPdfAttached && styles.attachBtnActive]}
                  onPress={() => {
                    setBillPdfAttached(!billPdfAttached);
                    showToast?.(billPdfAttached ? 'Bill removed' : '📄 Previous bill PDF attached', 'info');
                  }}
                >
                  <Upload size={16} color={billPdfAttached ? '#0F766E' : '#64748B'} />
                  <Text style={[styles.attachBtnTxt, billPdfAttached && styles.attachBtnTxtActive]}>
                    {billPdfAttached ? 'Bill Added ✓' : 'Previous Bill'}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.switchRow}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={styles.switchTitle}>Enable AutoPay for Bills</Text>
                  <Text style={styles.switchSub}>Automatically clear future verified bills on due date.</Text>
                </View>
                <Switch
                  value={autoPayEnabled}
                  onValueChange={setAutoPayEnabled}
                  trackColor={{ false: '#CBD5E1', true: '#0F766E' }}
                />
              </View>

              <Pressable
                style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
                onPress={handleSubmitSetup}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitBtnText}>Confirm Connection Setup</Text>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* BILL PAY MODAL */}
      <Modal
        visible={billPayModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBillPayModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pay Electricity Bill</Text>
              <Pressable onPress={() => setBillPayModalVisible(false)}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            <View style={styles.billSummaryBox}>
              <Text style={styles.summaryLabel}>TOTAL AMOUNT DUE</Text>
              <Text style={styles.summaryAmount}>₹{selectedBill?.amount.toLocaleString()}</Text>
              <Text style={styles.summarySub}>
                {selectedBill?.provider} • Consumer: {selectedBill?.consumer_number}
              </Text>
            </View>

            <View style={styles.paymentMethodRow}>
              <CreditCard size={20} color="#0F766E" />
              <View style={{ flex: 1 }}>
                <Text style={styles.paymentMethodTitle}>Instant UPI / R-Cash AutoPay</Text>
                <Text style={styles.paymentMethodSub}>Zero convenience fee & instant official receipt</Text>
              </View>
              <CheckCircle2 size={18} color="#16A34A" />
            </View>

            <Pressable
              style={[styles.submitBtn, isPayingBill && { opacity: 0.7 }]}
              onPress={handlePayBill}
              disabled={isPayingBill}
            >
              {isPayingBill ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Confirm Payment ₹{selectedBill?.amount.toLocaleString()}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* BROADBAND BOOKING MODAL */}
      <Modal
        visible={broadbandModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBroadbandModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book Installation</Text>
              <Pressable onPress={() => setBroadbandModalVisible(false)}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            <View style={styles.billSummaryBox}>
              <Text style={styles.summaryLabel}>{selectedPlan?.provider.toUpperCase()}</Text>
              <Text style={styles.summaryAmount}>₹{selectedPlan?.price_monthly} / mo</Text>
              <Text style={styles.summarySub}>
                {selectedPlan?.plan_name} • {selectedPlan?.speed_mbps} Mbps High-Speed Fiber
              </Text>
            </View>

            <Text style={styles.inputLabel}>SELECT APPOINTMENT DATE</Text>
            <View style={styles.dateSlotRow}>
              {['Today', 'Tomorrow', 'This Weekend'].map((d) => (
                <Pressable
                  key={d}
                  style={[styles.dateChip, appointmentDate === d && styles.dateChipActive]}
                  onPress={() => setAppointmentDate(d)}
                >
                  <Text style={[styles.dateChipTxt, appointmentDate === d && styles.dateChipTxtActive]}>
                    {d}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputLabel}>PREFERRED TIME SLOT</Text>
            <View style={styles.slotList}>
              {[
                'Morning (10:00 AM - 01:00 PM)',
                'Afternoon (02:00 PM - 05:00 PM)',
                'Evening (05:00 PM - 08:00 PM)',
              ].map((slot) => (
                <Pressable
                  key={slot}
                  style={[styles.slotItem, appointmentSlot === slot && styles.slotItemActive]}
                  onPress={() => setAppointmentSlot(slot)}
                >
                  <Text style={[styles.slotItemTxt, appointmentSlot === slot && styles.slotItemTxtActive]}>
                    {slot}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[styles.submitBtn, isBookingBroadband && { opacity: 0.7 }]}
              onPress={handleBookBroadband}
              disabled={isBookingBroadband}
            >
              {isBookingBroadband ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Confirm Technician Visit</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* WATER TANKER MODAL */}
      <Modal
        visible={tankerModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTankerModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book Water Tanker</Text>
              <Pressable onPress={() => setTankerModalVisible(false)}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>SELECT CAPACITY</Text>
            <View style={styles.tankerCapacityRow}>
              {[5000, 10000].map((cap) => (
                <Pressable
                  key={cap}
                  style={[styles.tankerCapChip, tankerCapacity === cap && styles.tankerCapChipActive]}
                  onPress={() => setTankerCapacity(cap as any)}
                >
                  <Text style={[styles.tankerCapTitle, tankerCapacity === cap && styles.tankerCapTitleActive]}>
                    {cap.toLocaleString()} Litres
                  </Text>
                  <Text style={[styles.tankerCapPrice, tankerCapacity === cap && styles.tankerCapPriceActive]}>
                    ₹{cap === 10000 ? '2,100' : '1,200'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputLabel}>WATER QUALITY TYPE</Text>
            <View style={styles.waterTypeRow}>
              {[
                { id: 'potable' as const, label: 'Potable Drinking Water' },
                { id: 'domestic' as const, label: 'Domestic / Utility Water' },
              ].map((wt) => (
                <Pressable
                  key={wt.id}
                  style={[styles.wtChip, waterType === wt.id && styles.wtChipActive]}
                  onPress={() => setWaterType(wt.id)}
                >
                  <Text style={[styles.wtChipTxt, waterType === wt.id && styles.wtChipTxtActive]}>
                    {wt.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[styles.submitBtn, isBookingTanker && { opacity: 0.7 }]}
              onPress={handleBookTanker}
              disabled={isBookingTanker}
            >
              {isBookingTanker ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>
                  Dispatch Tanker (₹{tankerCapacity === 10000 ? '2,100' : '1,200'})
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* PNG GAS MODAL */}
      <Modal
        visible={pngModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPngModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Setup Piped Gas (PNG)</Text>
              <Pressable onPress={() => setPngModalVisible(false)}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>GAS PROVIDER</Text>
            <View style={styles.pngProviderRow}>
              {['Mahanagar Gas Limited (MGL)', 'Indraprastha Gas Limited (IGL)'].map((p) => (
                <Pressable
                  key={p}
                  style={[styles.pngProvChip, pngProvider === p && styles.pngProvChipActive]}
                  onPress={() => setPngProvider(p)}
                >
                  <Text style={[styles.pngProvTxt, pngProvider === p && styles.pngProvTxtActive]}>
                    {p}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputLabel}>CONSUMER BP NUMBER</Text>
            <TextInput
              style={styles.modalInput}
              value={pngBpNumber}
              onChangeText={setPngBpNumber}
              placeholder="e.g. 2001928472"
              placeholderTextColor={V4_COLORS.textMuted}
            />

            <Text style={styles.inputLabel}>INITIAL METER READING (SCM)</Text>
            <TextInput
              style={styles.modalInput}
              value={pngReading}
              onChangeText={setPngReading}
              placeholder="e.g. 0142.5"
              placeholderTextColor={V4_COLORS.textMuted}
              keyboardType="numeric"
            />

            <Pressable
              style={[styles.submitBtn, isBookingPng && { opacity: 0.7 }]}
              onPress={handleBookPng}
              disabled={isBookingPng}
            >
              {isBookingPng ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Submit PNG Registration</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* SPLIT BILL WITH FLATMATES MODAL */}
      <Modal
        visible={splitBillModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSplitBillModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Users size={20} color="#0F766E" />
                <Text style={styles.modalTitle}>Split Bill with Flatmates</Text>
              </View>
              <Pressable onPress={() => setSplitBillModalVisible(false)}>
                <X size={20} color={V4_COLORS.textMuted} />
              </Pressable>
            </View>

            <View style={styles.billSummaryBox}>
              <Text style={styles.summaryLabel}>{selectedSplitBill?.title || 'Utility Bill'}</Text>
              <Text style={styles.summaryAmount}>₹{selectedSplitBill?.amount.toLocaleString() || '1,840'}</Text>
              <Text style={styles.summarySub}>Total household utility expense</Text>
            </View>

            <Text style={styles.inputLabel}>SELECT NUMBER OF ROOMMATES</Text>
            <View style={styles.splitCountRow}>
              {[2, 3, 4, 5].map((cnt) => (
                <Pressable
                  key={cnt}
                  style={[styles.splitCountChip, selectedFlatmateCount === cnt && styles.splitCountChipActive]}
                  onPress={() => setSelectedFlatmateCount(cnt)}
                >
                  <Text style={[styles.splitCountTxt, selectedFlatmateCount === cnt && styles.splitCountTxtActive]}>
                    {cnt} People
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.splitResultBox}>
              <Text style={styles.splitResultLabel}>EACH FLATPERSON OWES</Text>
              <Text style={styles.splitResultAmount}>
                ₹{Math.round((selectedSplitBill?.amount || 1840) / selectedFlatmateCount).toLocaleString('en-IN')}
              </Text>
              <Text style={styles.splitResultSub}>
                Calculated equally among {selectedFlatmateCount} flatmates
              </Text>
            </View>

            <Pressable
              style={styles.submitBtn}
              onPress={() => {
                setSplitBillModalVisible(false);
                showToast?.(
                  `📲 WhatsApp payment request generated: ₹${Math.round((selectedSplitBill?.amount || 1840) / selectedFlatmateCount)}/share`,
                  'success'
                );
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Share2 size={16} color="#FFFFFF" />
                <Text style={styles.submitBtnText}>Share Payment Request Link</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  propertyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...V4_SHADOWS.sm,
  },
  propIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  propTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  propLocality: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  categoriesRow: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 44,
  },
  categoryChipActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0F766E',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryChipTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  categoryBlock: {
    gap: 12,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.7,
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...V4_SHADOWS.sm,
  },
  billTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  billProvider: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  billConsumer: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  billStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  billPaidPill: {
    backgroundColor: '#DCFCE7',
  },
  billDuePill: {
    backgroundColor: '#FEF3C7',
  },
  billStatusTxt: {
    fontSize: 10,
    fontWeight: '800',
  },
  billPaidTxt: {
    color: '#16A34A',
  },
  billDueTxt: {
    color: '#D97706',
  },
  billDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  billAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  billUnits: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  payBillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F766E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minHeight: 44,
  },
  payBillBtnTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  plansList: {
    gap: 12,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...V4_SHADOWS.sm,
  },
  planTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planProvider: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
  },
  planName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  planBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  planBadgeTxt: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
  },
  speedPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  speedBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  speedNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F766E',
  },
  speedUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  priceNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  pricePeriod: {
    fontSize: 11,
    color: '#64748B',
  },
  ottRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ottText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    flex: 1,
  },
  bookPlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 12,
    minHeight: 44,
  },
  bookPlanBtnTxt: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tankerHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  tankerIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tankerHeroTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  tankerHeroSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  tankerHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    minHeight: 44,
  },
  tankerHeroBtnTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pngHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  pngIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pngHeroTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  pngHeroSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  pngHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F97316',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    minHeight: 44,
  },
  pngHeroBtnTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  erpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    minHeight: 70,
  },
  erpIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  erpTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  erpSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  sectionBlock: {
    gap: 10,
    marginTop: 8,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  providerMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    minHeight: 44,
  },
  connectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    minHeight: 48,
  },
  attachmentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  attachBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  attachBtnActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0F766E',
  },
  attachBtnTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  attachBtnTxtActive: {
    color: '#0F766E',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  switchSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 20,
    minHeight: 48,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  billSummaryBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#064E3B',
    marginVertical: 4,
  },
  summarySub: {
    fontSize: 12,
    color: '#0F766E',
    fontWeight: '600',
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 10,
  },
  paymentMethodTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  paymentMethodSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  dateSlotRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dateChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  dateChipActive: {
    backgroundColor: '#0F766E',
  },
  dateChipTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  dateChipTxtActive: {
    color: '#FFFFFF',
  },
  slotList: {
    gap: 8,
  },
  slotItem: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    minHeight: 44,
    justifyContent: 'center',
  },
  slotItemActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0F766E',
  },
  slotItemTxt: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  slotItemTxtActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  tankerCapacityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tankerCapChip: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    minHeight: 70,
    justifyContent: 'center',
  },
  tankerCapChipActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0EA5E9',
  },
  tankerCapTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  tankerCapTitleActive: {
    color: '#0369A1',
  },
  tankerCapPrice: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  tankerCapPriceActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  waterTypeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  wtChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  wtChipActive: {
    backgroundColor: '#0EA5E9',
  },
  wtChipTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
  },
  wtChipTxtActive: {
    color: '#FFFFFF',
  },
  pngProviderRow: {
    gap: 8,
  },
  pngProvChip: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    minHeight: 44,
    justifyContent: 'center',
  },
  pngProvChipActive: {
    backgroundColor: '#FFEDD5',
    borderColor: '#F97316',
  },
  pngProvTxt: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  pngProvTxtActive: {
    color: '#C2410C',
    fontWeight: '800',
  },

  // Reminder Banner
  reminderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  reminderIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  reminderDuePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  reminderDuePillTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  reminderSub: {
    fontSize: 11,
    color: '#0D9488',
    marginTop: 2,
  },
  reminderPayBtn: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  reminderPayBtnTxt: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // 8-Card Grid
  gridContainer: {
    gap: 8,
  },
  gridHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  gridHeaderBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  gridCardActive: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  gridIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  gridCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  gridCardTitleActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  gridCardSub: {
    fontSize: 11,
    color: '#64748B',
  },

  // Quick Pay Card
  quickPayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  quickPayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickPayTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  quickPaySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  autopaySwitchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  autopaySwitchLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  quickChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    minHeight: 44,
    justifyContent: 'center',
  },
  quickChipActive: {
    backgroundColor: '#0F766E',
  },
  quickChipTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  quickChipTxtActive: {
    color: '#FFFFFF',
  },
  splitBillTrigger: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#CCFBF1',
    minHeight: 44,
  },
  splitBillTriggerTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },

  // Maintenance Due Card
  maintDueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  maintTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  maintSocietyName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  maintFlatNo: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  maintDueBadge: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  maintDueBadgeTxt: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
  },
  maintAmountBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  maintAmountLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  maintAmountVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 4,
  },
  maintDueDate: {
    fontSize: 11,
    color: '#0F766E',
    fontWeight: '600',
    marginTop: 2,
  },
  maintBreakdownBox: {
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  maintItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  maintItemLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  maintItemVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  payMaintBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  payMaintBtnTxt: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  societyShortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  shortcutCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 44,
  },
  shortcutIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },

  // Recharge Cards (Mobile & DTH)
  rechargeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  rechargeLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  operatorRow: {
    flexDirection: 'row',
    gap: 6,
  },
  operatorPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 44,
  },
  operatorPillActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0F766E',
  },
  operatorTxt: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  operatorTxtActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  planList: {
    gap: 8,
  },
  rechargePlanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    minHeight: 44,
  },
  rechargePlanCardActive: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  rechargePlanAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  rechargePlanDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  rechargePlanValidityBox: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rechargePlanValidity: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },

  // History List
  historyList: {
    gap: 10,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  historyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  historyProvider: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  historyMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  historyBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  historyBadgeTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#16A34A',
  },
  historyActionsRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  historyActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    minHeight: 44,
  },
  historyActionTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },

  // Split Bill Modal Styles
  splitCountRow: {
    flexDirection: 'row',
    gap: 8,
  },
  splitCountChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  splitCountChipActive: {
    backgroundColor: '#0F766E',
  },
  splitCountTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  splitCountTxtActive: {
    color: '#FFFFFF',
  },
  splitResultBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#99F6E4',
    alignItems: 'center',
    gap: 4,
  },
  splitResultLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.5,
  },
  splitResultAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F766E',
  },
  splitResultSub: {
    fontSize: 11,
    color: '#0D9488',
  },
});
