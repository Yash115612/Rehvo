import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Truck,
  Package,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Plus,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../src/theme/v4Theme';
import { triggerHapticFeedback } from '../../../src/utils/haptics';
import { DeliveryPassRecord } from '../../../src/types';

export default function DeliveryPassRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    properties,
    leaseAgreements,
    deliveryPasses,
    fetchDeliveryPasses,
    createDeliveryPass,
    showToast,
  } = useAppStore();

  const [selectedCompany, setSelectedCompany] = useState('Swiggy');
  const [deliveryAgentName, setDeliveryAgentName] = useState('');
  const [orderId, setOrderId] = useState('');
  const [leaveAtGate, setLeaveAtGate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'active'>('quick');

  const activeLease = useMemo(
    () => leaseAgreements?.find((l) => l.status === 'active') || leaseAgreements?.[0],
    [leaseAgreements]
  );
  const activeProperty = useMemo(
    () => properties?.find((p) => p.id === activeLease?.property_id) || properties?.[0],
    [properties, activeLease]
  );

  const societyName = activeProperty?.society_name || activeProperty?.title || 'Prestige Green Gables';
  const unitNumber = activeProperty?.unit_number || 'Tower 4 - Flat 1204';

  useEffect(() => {
    fetchDeliveryPasses();
  }, []);

  const companies = [
    { name: 'Swiggy', color: '#FC8019', bg: '#FFF7ED' },
    { name: 'Zomato', color: '#CB202D', bg: '#FEF2F2' },
    { name: 'Blinkit', color: '#F8CB46', bg: '#FEFCE8' },
    { name: 'Zepto', color: '#8800EC', bg: '#FAF5FF' },
    { name: 'Amazon', color: '#FF9900', bg: '#FFFBEB' },
    { name: 'Flipkart', color: '#2874F0', bg: '#EFF6FF' },
    { name: 'Dunzo', color: '#00D290', bg: '#ECFDF5' },
    { name: 'Courier', color: '#0F766E', bg: '#F0FDFA' },
  ];

  const handleCreatePass = async () => {
    setIsSubmitting(true);
    triggerHapticFeedback('impactMedium');

    const validUntil = new Date(Date.now() + 2 * 3600 * 1000).toISOString();

    const res = await createDeliveryPass({
      company_name: selectedCompany,
      delivery_person_name: deliveryAgentName.trim() || undefined,
      order_id: orderId.trim() || undefined,
      unit_number: unitNumber,
      society_name: societyName,
      valid_until: validUntil,
    });

    setIsSubmitting(false);

    if (res.success) {
      triggerHapticFeedback('notificationSuccess');
      showToast?.(`Entry pass issued for ${selectedCompany}!`, 'success');
      setDeliveryAgentName('');
      setOrderId('');
      setActiveTab('active');
    } else {
      triggerHapticFeedback('notificationError');
      showToast?.(res.error || 'Failed to issue delivery pass', 'error');
    }
  };

  const activePasses = useMemo(
    () => deliveryPasses.filter((p) => p.status === 'approved'),
    [deliveryPasses]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            triggerHapticFeedback('selection');
            router.back();
          }}
          hitSlop={12}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Delivery Gate Pass</Text>
          <Text style={styles.headerSubtitle}>{societyName} • {unitNumber}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabBtn, activeTab === 'quick' && styles.tabBtnActive]}
          onPress={() => {
            triggerHapticFeedback('selection');
            setActiveTab('quick');
          }}
        >
          <Plus size={16} color={activeTab === 'quick' ? '#0F766E' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'quick' && styles.tabTextActive]}>1-Tap Pass</Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, activeTab === 'active' && styles.tabBtnActive]}
          onPress={() => {
            triggerHapticFeedback('selection');
            setActiveTab('active');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            Active Passes ({activePasses.length})
          </Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'quick' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <Truck size={22} color="#0F766E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Quick Delivery Approval</Text>
                <Text style={styles.cardSubtitle}>Valid for 2 hours at the main security gate</Text>
              </View>
            </View>

            {/* Provider Grid */}
            <Text style={styles.inputLabel}>SELECT DELIVERY PROVIDER</Text>
            <View style={styles.companyGrid}>
              {companies.map((c) => (
                <Pressable
                  key={c.name}
                  style={[
                    styles.companyTile,
                    selectedCompany === c.name && styles.companyTileActive,
                  ]}
                  onPress={() => {
                    triggerHapticFeedback('selection');
                    setSelectedCompany(c.name);
                  }}
                >
                  <View style={[styles.companyDot, { backgroundColor: c.color }]} />
                  <Text
                    style={[
                      styles.companyTileText,
                      selectedCompany === c.name && styles.companyTileTextActive,
                    ]}
                  >
                    {c.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Leave at Gate Toggle */}
            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>Leave at Security Gate</Text>
                <Text style={styles.toggleDesc}>
                  Delivery partner will deposit package with tower guard
                </Text>
              </View>
              <Switch
                value={leaveAtGate}
                onValueChange={(val) => {
                  triggerHapticFeedback('selection');
                  setLeaveAtGate(val);
                }}
                trackColor={{ false: '#CBD5E1', true: '#0F766E' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Optional Order ID */}
            <Text style={styles.inputLabel}>ORDER / TRACKING ID (OPTIONAL)</Text>
            <TextInput
              style={styles.input}
              value={orderId}
              onChangeText={setOrderId}
              placeholder="e.g. 1982736412"
              placeholderTextColor="#94A3B8"
            />

            {/* Optional Agent Name */}
            <Text style={styles.inputLabel}>RIDER NAME (IF KNOWN)</Text>
            <TextInput
              style={styles.input}
              value={deliveryAgentName}
              onChangeText={setDeliveryAgentName}
              placeholder="e.g. Ramesh"
              placeholderTextColor="#94A3B8"
            />

            {/* Submit */}
            <Pressable
              style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
              disabled={isSubmitting}
              onPress={handleCreatePass}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Approve {selectedCompany} Delivery</Text>
              )}
            </Pressable>
          </View>
        )}

        {/* ACTIVE PASSES */}
        {activeTab === 'active' && (
          <View style={{ gap: 12 }}>
            {activePasses.length === 0 ? (
              <View style={styles.emptyCard}>
                <Package size={44} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No Active Delivery Passes</Text>
                <Text style={styles.emptySubtitle}>Approve upcoming grocery and food deliveries</Text>
                <Pressable
                  style={styles.emptyBtn}
                  onPress={() => {
                    triggerHapticFeedback('selection');
                    setActiveTab('quick');
                  }}
                >
                  <Text style={styles.emptyBtnText}>Create 1-Tap Pass</Text>
                </Pressable>
              </View>
            ) : (
              activePasses.map((pass) => (
                <View key={pass.id} style={styles.passCard}>
                  <View style={styles.passCardTop}>
                    <View style={styles.passIconBox}>
                      <Truck size={22} color="#0284C7" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.passName}>{pass.company_name} Delivery</Text>
                      <Text style={styles.passSubtext}>
                        Unit: {pass.unit_number || unitNumber} {pass.order_id ? `• #${pass.order_id}` : ''}
                      </Text>
                    </View>
                    <View style={styles.approvedBadge}>
                      <Text style={styles.approvedBadgeText}>APPROVED</Text>
                    </View>
                  </View>

                  <View style={styles.codeBox}>
                    <Text style={styles.codeLabel}>SECURITY GATE ENTRY PIN</Text>
                    <Text style={styles.codeDigits}>{pass.pass_code}</Text>
                    <Text style={styles.codeValidity}>
                      Valid until {new Date(pass.valid_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>

                  <Pressable
                    style={styles.shareBtn}
                    onPress={async () => {
                      triggerHapticFeedback('selection');
                      await Share.share({
                        message: `Delivery Gate Pass for ${pass.company_name} at ${societyName}, Unit ${unitNumber}. Entry PIN: ${pass.pass_code}`,
                      });
                    }}
                  >
                    <Share2 size={16} color="#0F766E" />
                    <Text style={styles.shareBtnText}>Share PIN with Delivery Agent</Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
    gap: 6,
    backgroundColor: '#F1F5F9',
  },
  tabBtnActive: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#0F766E',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0F766E',
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.6,
    marginTop: 14,
    marginBottom: 8,
  },
  companyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  companyTile: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 8,
    minHeight: 46,
  },
  companyTileActive: {
    borderColor: '#0F766E',
    backgroundColor: '#F0FDFA',
  },
  companyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  companyTileText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  companyTileTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 16,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  toggleDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    minHeight: 46,
  },
  submitBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    ...V4_SHADOWS.card,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  passCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
    ...V4_SHADOWS.card,
  },
  passCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  passIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  passSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  approvedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  approvedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  codeBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.8,
  },
  codeDigits: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 4,
    marginVertical: 4,
  },
  codeValidity: {
    fontSize: 11,
    color: '#0F766E',
    fontWeight: '600',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 10,
    height: 42,
    gap: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  emptyBtn: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 16,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
