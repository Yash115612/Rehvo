// ==============================================================================
// REHVO V5.5 — MOVE-IN CONCIERGE & ONBOARDING OS (PRODUCTION)
// SVG Circular Progress Ring, 30-Point Categorized Checklist, Utility Setup Tracker,
// Furniture/Grocery Checklists, Address Change Reminders & Building Manager Desk
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
  Share,
  Linking,
  Platform,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CheckCircle2,
  Circle as CircleIcon,
  Wifi,
  Zap,
  Flame,
  Droplets,
  Key,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
  X,
  Phone,
  Clock,
  Share2,
  Home,
  Check,
  AlertCircle,
  FileText,
  Copy,
  MessageSquare,
  Building2,
  Wrench,
  Layers,
  MapPin,
  Package,
  ShoppingCart,
  CheckSquare,
  ExternalLink,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4AuthGate } from '../ui/V4AuthGate';
import { MoveIn30ChecklistRecord } from '../../../types';

type MainSectionTab = 'checklist' | 'furniture' | 'grocery' | 'address_change';
type ChecklistFilterCategory = 'all' | 'pre_move' | 'day_of_move' | 'home_inspection' | 'utility_setup' | 'settling_in';

export const V4MoveInConciergeScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    user,
    isAuthenticated,
    moveIn30Checklist,
    fetchMoveIn30Checklist,
    toggleMoveIn30ChecklistItem,
    showToast,
    leaseAgreements,
    properties,
  } = useAppStore();

  const activeLease = useMemo(
    () => leaseAgreements?.find((l) => l.status === 'active') || leaseAgreements?.[0],
    [leaseAgreements]
  );
  const activeProperty = useMemo(
    () => properties?.find((p) => p.id === activeLease?.property_id) || properties?.[0],
    [properties, activeLease]
  );
  const propertyTitle = activeProperty
    ? `${activeProperty.title}${activeProperty.locality ? ` • ${activeProperty.locality}` : ''}`
    : 'Bandra West Apartment 402';

  const [activeTab, setActiveTab] = useState<MainSectionTab>('checklist');
  const [activeChecklistCategory, setActiveChecklistCategory] = useState<ChecklistFilterCategory>('all');
  const [gatepassCopied, setGatepassCopied] = useState(false);

  // Furniture items state
  const [furnitureItems, setFurnitureItems] = useState([
    { id: 'f_bed', name: 'Queen Size Bed & Mattress', completed: true, category: 'Bedroom' },
    { id: 'f_wardrobe', name: 'Wardrobe Organizers & Hangers', completed: true, category: 'Bedroom' },
    { id: 'f_desk', name: 'Ergonomic Work Desk & Chair', completed: false, category: 'Workstation' },
    { id: 'f_curtains', name: 'Blackout Curtains & Rods', completed: false, category: 'Living' },
    { id: 'f_sofa', name: 'Living Room Sofa & Center Table', completed: true, category: 'Living' },
    { id: 'f_ro', name: 'RO Water Purifier System', completed: false, category: 'Kitchen' },
    { id: 'f_fridge', name: 'Refrigerator & Microwave', completed: true, category: 'Kitchen' },
    { id: 'f_washing', name: 'Washing Machine Installation', completed: false, category: 'Utility' },
  ]);

  // Grocery pantry items state
  const [groceryItems, setGroceryItems] = useState([
    { id: 'g_rice', name: 'Basmati Rice & Wheat Atta (5kg)', completed: true },
    { id: 'g_pulses', name: 'Toor Dal, Moong Dal & Chana', completed: true },
    { id: 'g_oil', name: 'Cooking Oil & Ghee', completed: true },
    { id: 'g_spices', name: 'Salt, Turmeric, Chilli & Garam Masala', completed: false },
    { id: 'g_tea', name: 'Tea Leaves, Coffee & Sugar', completed: true },
    { id: 'g_cleaning', name: 'Floor Cleaner, Detergent & Sponges', completed: false },
    { id: 'g_toiletries', name: 'Toilet Paper, Handwash & Toothpaste', completed: true },
    { id: 'g_trash', name: 'Dustbins & Biodegradable Garbage Bags', completed: false },
  ]);

  // Address change checklist state
  const [addressItems, setAddressItems] = useState([
    { id: 'a_aadhaar', title: 'Aadhaar Card Address Update', sub: 'Update online via UIDAI with rent agreement', completed: false, link: 'https://myaadhaar.uidai.gov.in' },
    { id: 'a_bank', title: 'Bank Accounts & Credit Cards', sub: 'Update communication address on netbanking', completed: false, link: 'https://rehvo.com' },
    { id: 'a_gas', title: 'LPG / PNG Gas Connection Transfer', sub: 'Transfer connection with consumer BP number', completed: true, link: '/(renter)/utilities' },
    { id: 'a_ecommerce', title: 'Amazon, Swiggy & Zomato Delivery Address', sub: 'Add new flat number and gate entry directions', completed: true, link: 'https://amazon.in' },
    { id: 'a_voter', title: 'National Voter Service Portal', sub: 'Form 8 assembly constituency update', completed: false, link: 'https://voters.eci.gov.in' },
  ]);

  useEffect(() => {
    fetchMoveIn30Checklist();
  }, [fetchMoveIn30Checklist]);

  // Filtered 30 checklist items
  const filteredChecklist = useMemo(() => {
    if (activeChecklistCategory === 'all') return moveIn30Checklist;
    return moveIn30Checklist.filter((item) => item.category === activeChecklistCategory);
  }, [moveIn30Checklist, activeChecklistCategory]);

  const completedCount = useMemo(() => {
    return moveIn30Checklist.filter((c) => c.completed).length;
  }, [moveIn30Checklist]);

  const totalCount = moveIn30Checklist.length || 30;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // SVG Progress Ring calculations
  const size = 110;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100;

  const handleToggleChecklist = useCallback(async (itemId: string, currentCompleted: boolean) => {
    await toggleMoveIn30ChecklistItem(itemId, !currentCompleted);
  }, [toggleMoveIn30ChecklistItem]);

  const handleToggleFurniture = useCallback((id: string) => {
    setFurnitureItems((prev) =>
      prev.map((f) => (f.id === id ? { ...f, completed: !f.completed } : f))
    );
  }, []);

  const handleToggleGrocery = useCallback((id: string) => {
    setGroceryItems((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  }, []);

  const handleToggleAddress = useCallback((id: string) => {
    setAddressItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  }, []);

  const handleCopyGatepass = useCallback(() => {
    setGatepassCopied(true);
    showToast?.('Delivery instructions copied to clipboard!', 'success');
    setTimeout(() => setGatepassCopied(false), 3000);
  }, [showToast]);

  const handleShareChecklist = useCallback(() => {
    const text = `🏡 REHVO Move-In Progress: ${completedCount}/${totalCount} (${progressPercent}% Ready)\nProperty: ${propertyTitle}\nTracked via REHVO Concierge OS.`;
    Share.share({ message: text });
  }, [completedCount, totalCount, progressPercent, propertyTitle]);

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) + 4 }]}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>Move-In Concierge</Text>
          <Text style={styles.headerSubtitle}>30-Point Move-In & Settling OS</Text>
        </View>
        <Pressable
          style={styles.shareBtn}
          onPress={handleShareChecklist}
          accessibilityLabel="Share progress"
        >
          <Share2 size={18} color="#0F766E" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. PROGRESS RING HERO BANNER */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <View style={styles.heroLeft}>
            <View style={styles.badgeRow}>
              <Sparkles size={13} color="#CCFBF1" />
              <Text style={styles.badgeText}>CONCIERGE ONBOARDING</Text>
            </View>
            <Text style={styles.heroHeading}>
              {progressPercent === 100
                ? 'Fully Settled In!'
                : progressPercent > 50
                ? 'Almost Ready to Unpack'
                : 'Move-In Checklist Active'}
            </Text>
            <Text style={styles.heroSub}>
              {completedCount} of {totalCount} essentials verified for {propertyTitle}.
            </Text>
          </View>

          {/* CIRCULAR SVG PROGRESS */}
          <View style={styles.progressRingBox}>
            <Svg width={size} height={size}>
              <Circle
                stroke="rgba(255, 255, 255, 0.15)"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
              />
              <Circle
                stroke="#34D399"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </Svg>
            <View style={styles.progressTextCenter}>
              <Text style={styles.progressPercent}>{progressPercent}%</Text>
              <Text style={styles.progressLabel}>COMPLETED</Text>
            </View>
          </View>
        </View>

        {/* 3. MAIN SECTION TABS */}
        <View style={styles.mainTabsRow}>
          {[
            { id: 'checklist' as const, label: '30-Pt Checklist' },
            { id: 'furniture' as const, label: 'Furniture' },
            { id: 'grocery' as const, label: 'Pantry' },
            { id: 'address_change' as const, label: 'Address Update' },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.mainTabBtn, isSelected && styles.mainTabBtnActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={[styles.mainTabTxt, isSelected && styles.mainTabTxtActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 4. TAB CONTENT */}

        {/* --- TAB 1: 30-POINT CATEGORIZED CHECKLIST --- */}
        {activeTab === 'checklist' && (
          <View style={styles.sectionBlock}>
            {/* Category Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryChipsScroll}
            >
              {[
                { id: 'all' as const, label: 'All 30' },
                { id: 'pre_move' as const, label: '1. Pre-Move (6)' },
                { id: 'day_of_move' as const, label: '2. Move Day (6)' },
                { id: 'home_inspection' as const, label: '3. Inspection (6)' },
                { id: 'utility_setup' as const, label: '4. Utilities (6)' },
                { id: 'settling_in' as const, label: '5. Settling (6)' },
              ].map((c) => {
                const isSelected = activeChecklistCategory === c.id;
                return (
                  <Pressable
                    key={c.id}
                    style={[styles.checkCatChip, isSelected && styles.checkCatChipActive]}
                    onPress={() => setActiveChecklistCategory(c.id)}
                  >
                    <Text style={[styles.checkCatTxt, isSelected && styles.checkCatTxtActive]}>
                      {c.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.checklistList}>
              {filteredChecklist.map((item) => (
                <View key={item.id} style={styles.checkItemCard}>
                  <Pressable
                    style={styles.checkToggleBtn}
                    onPress={() => handleToggleChecklist(item.id, item.completed)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: item.completed }}
                  >
                    {item.completed ? (
                      <CheckCircle2 size={24} color="#10B981" />
                    ) : (
                      <CircleIcon size={24} color="#CBD5E1" />
                    )}
                  </Pressable>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.checkItemTitle,
                        item.completed && styles.checkItemTitleCompleted,
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.checkItemSub}>{item.subtitle}</Text>
                  </View>

                  {item.action_text && item.route_target && (
                    <Pressable
                      style={styles.checkActionBtn}
                      onPress={() => router.push(item.route_target as any)}
                    >
                      <Text style={styles.checkActionTxt}>{item.action_text}</Text>
                      <ChevronRight size={12} color="#0F766E" />
                    </Pressable>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* --- TAB 2: FURNITURE & APPLIANCE CHECKLIST --- */}
        {activeTab === 'furniture' && (
          <View style={styles.sectionBlock}>
            <View style={styles.tabIntroRow}>
              <View>
                <Text style={styles.tabIntroTitle}>Home Furnishings & Setup</Text>
                <Text style={styles.tabIntroSub}>Essential living, bedroom and appliance setup items.</Text>
              </View>
              <Pressable
                style={styles.serviceLinkBtn}
                onPress={() => router.push('/(renter)/cleaning')}
              >
                <Sparkles size={14} color="#0F766E" />
                <Text style={styles.serviceLinkTxt}>Deep Clean</Text>
              </Pressable>
            </View>

            <View style={styles.checklistList}>
              {furnitureItems.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.checkItemCard}
                  onPress={() => handleToggleFurniture(item.id)}
                >
                  {item.completed ? (
                    <CheckCircle2 size={22} color="#10B981" />
                  ) : (
                    <CircleIcon size={22} color="#CBD5E1" />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.checkItemTitle, item.completed && styles.checkItemTitleCompleted]}>
                      {item.name}
                    </Text>
                    <Text style={styles.checkItemSub}>Zone: {item.category}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* --- TAB 3: GROCERY & PANTRY STARTER KIT --- */}
        {activeTab === 'grocery' && (
          <View style={styles.sectionBlock}>
            <View style={styles.tabIntroRow}>
              <View>
                <Text style={styles.tabIntroTitle}>Kitchen & Pantry Starter Kit</Text>
                <Text style={styles.tabIntroSub}>Day 1 essentials to stock up before your first home-cooked meal.</Text>
              </View>
              <Pressable
                style={styles.serviceLinkBtn}
                onPress={() => Linking.openURL('https://blinkit.com')}
              >
                <ShoppingCart size={14} color="#0F766E" />
                <Text style={styles.serviceLinkTxt}>Order 10m</Text>
              </Pressable>
            </View>

            <View style={styles.checklistList}>
              {groceryItems.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.checkItemCard}
                  onPress={() => handleToggleGrocery(item.id)}
                >
                  {item.completed ? (
                    <CheckCircle2 size={22} color="#10B981" />
                  ) : (
                    <CircleIcon size={22} color="#CBD5E1" />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.checkItemTitle, item.completed && styles.checkItemTitleCompleted]}>
                      {item.name}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* --- TAB 4: ADDRESS CHANGE REMINDERS --- */}
        {activeTab === 'address_change' && (
          <View style={styles.sectionBlock}>
            <Text style={styles.tabIntroTitle}>Legal & Financial Address Updates</Text>
            <Text style={styles.tabIntroSub}>
              Update your registered address across statutory authorities with your stamped rental agreement.
            </Text>

            <View style={styles.checklistList}>
              {addressItems.map((item) => (
                <View key={item.id} style={styles.checkItemCard}>
                  <Pressable
                    style={styles.checkToggleBtn}
                    onPress={() => handleToggleAddress(item.id)}
                  >
                    {item.completed ? (
                      <CheckCircle2 size={22} color="#10B981" />
                    ) : (
                      <CircleIcon size={22} color="#CBD5E1" />
                    )}
                  </Pressable>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.checkItemTitle, item.completed && styles.checkItemTitleCompleted]}>
                      {item.title}
                    </Text>
                    <Text style={styles.checkItemSub}>{item.sub}</Text>
                  </View>
                  <Pressable
                    style={styles.checkActionBtn}
                    onPress={() => {
                      if (item.link.startsWith('http')) {
                        Linking.openURL(item.link);
                      } else {
                        router.push(item.link as any);
                      }
                    }}
                  >
                    <Text style={styles.checkActionTxt}>Open</Text>
                    <ExternalLink size={12} color="#0F766E" />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 5. DELIVERY INSTRUCTIONS CARD */}
        <View style={styles.deliveryCard}>
          <View style={styles.deliveryIconBox}>
            <MapPin size={22} color="#0F766E" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.deliveryTitle}>Quick Gatepass Note</Text>
            <Text style={styles.deliveryText}>
              "Tower B, Flat 402, Intercom 0402. Gate entry code available at security desk."
            </Text>
          </View>
          <Pressable
            style={styles.copyBtn}
            onPress={handleCopyGatepass}
          >
            {gatepassCopied ? (
              <Check size={16} color="#16A34A" />
            ) : (
              <Copy size={16} color="#0F766E" />
            )}
            <Text style={[styles.copyBtnTxt, gatepassCopied && { color: '#16A34A' }]}>
              {gatepassCopied ? 'Copied!' : 'Copy'}
            </Text>
          </Pressable>
        </View>

        {/* 6. CONCIERGE HELPLINE CARD */}
        <View style={styles.conciergeCard}>
          <View style={styles.conciergeIconBox}>
            <ShieldCheck size={22} color="#16A34A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.conciergeTitle}>REHVO Move-In Concierge Team</Text>
            <Text style={styles.conciergeSub}>Need elevator reservation, gate permission or painter dispatch?</Text>
          </View>
          <Pressable
            style={styles.conciergeCallBtn}
            onPress={() => Linking.openURL('tel:+919820155432')}
          >
            <Phone size={15} color="#0F766E" />
            <Text style={styles.conciergeCallTxt}>Call</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

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
  shareBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 18,
  },
  heroCard: {
    backgroundColor: '#064E3B',
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    ...V4_SHADOWS.md,
  },
  heroGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(15, 118, 110, 0.4)',
  },
  heroLeft: {
    flex: 1,
    paddingRight: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#CCFBF1',
    letterSpacing: 0.6,
  },
  heroHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 12,
    color: '#E2E8F0',
    lineHeight: 16,
  },
  progressRingBox: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressTextCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  progressLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#A7F3D0',
    letterSpacing: 0.5,
  },
  mainTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
  },
  mainTabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  mainTabBtnActive: {
    backgroundColor: '#FFFFFF',
    ...V4_SHADOWS.sm,
  },
  mainTabTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  mainTabTxtActive: {
    fontWeight: '800',
    color: '#0F766E',
  },
  sectionBlock: {
    gap: 12,
  },
  categoryChipsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  checkCatChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 44,
    justifyContent: 'center',
  },
  checkCatChipActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0F766E',
  },
  checkCatTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  checkCatTxtActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  checklistList: {
    gap: 10,
  },
  checkItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    minHeight: 64,
  },
  checkToggleBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  checkItemTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  checkItemSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  checkActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    minHeight: 44,
  },
  checkActionTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  tabIntroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tabIntroTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  tabIntroSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  serviceLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minHeight: 44,
  },
  serviceLinkTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  deliveryIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  deliveryText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontStyle: 'italic',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    minHeight: 44,
  },
  copyBtnTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  conciergeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 12,
  },
  conciergeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conciergeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  conciergeSub: {
    fontSize: 11,
    color: '#0F766E',
    marginTop: 2,
  },
  conciergeCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    minHeight: 44,
  },
  conciergeCallTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
