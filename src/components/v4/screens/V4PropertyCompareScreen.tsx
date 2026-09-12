import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle2,
  XCircle,
  X,
  Crown,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Plus,
  Coins,
  Building,
  TrendingUp,
  ReceiptText,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { Property, ComparisonMatrix } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import {
  compareProperties,
  generateAIDecisionSummary,
  saveCompareSession,
} from '../../../services/propertyCompare';
import { V4AIDecisionCard } from '../ui/V4AIDecisionCard';
import { V4HiddenCostCard } from '../ui/V4HiddenCostCard';
import { V4RentVsBuyCalculator } from '../ui/V4RentVsBuyCalculator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = Math.max(140, Math.min(180, (SCREEN_WIDTH - 110) / 2));

type CompareTab = 'matrix' | 'verdict' | 'proscons' | 'costs' | 'rentvsbuy';

export const V4PropertyCompareScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ ids?: string }>();

  const properties = useAppStore((s) => s.properties);
  const comparePropertyIds = useAppStore((s) => s.comparePropertyIds);
  const removeFromCompare = useAppStore((s) => s.removeFromCompare);
  const showToast = useAppStore((s) => s.showToast);
  const user = useAppStore((s) => s.user);

  const [activeTab, setActiveTab] = useState<CompareTab>('matrix');
  const [selectedCostPropId, setSelectedCostPropId] = useState<string>('');

  // Selected properties to compare (priority: route params > store ids > fallback first 2)
  const activeProperties: Property[] = useMemo(() => {
    let ids: string[] = [];
    if (params.ids) {
      ids = params.ids.split(',').filter(Boolean);
    } else if (comparePropertyIds.length > 0) {
      ids = comparePropertyIds;
    }

    if (ids.length > 0) {
      const matched = properties.filter((p) => ids.includes(p.id));
      if (matched.length > 0) return matched.slice(0, 4);
    }

    // Fallback default: first 2 published properties
    return properties.slice(0, 2);
  }, [params.ids, comparePropertyIds, properties]);

  // Compute comparison matrix & winners
  const comparisonData: ComparisonMatrix = useMemo(() => {
    return compareProperties(activeProperties);
  }, [activeProperties]);

  const winningProperty = useMemo(() => {
    return (
      activeProperties.find(
        (p) => p.id === comparisonData.overallRecommendedPropertyId
      ) || activeProperties[0]
    );
  }, [activeProperties, comparisonData.overallRecommendedPropertyId]);

  const aiDecisionSummary = useMemo(() => {
    return generateAIDecisionSummary(
      activeProperties,
      comparisonData.overallRecommendedPropertyId
    );
  }, [activeProperties, comparisonData.overallRecommendedPropertyId]);

  const activeCostProperty = useMemo(() => {
    if (selectedCostPropId) {
      const found = activeProperties.find((p) => p.id === selectedCostPropId);
      if (found) return found;
    }
    return activeProperties[0] || null;
  }, [activeProperties, selectedCostPropId]);

  // Actions
  const handleRemove = useCallback(
    (id: string) => {
      removeFromCompare(id);
      if (activeProperties.length <= 2) {
        showToast('At least 2 properties recommended for compare', 'info');
      }
    },
    [removeFromCompare, activeProperties.length, showToast]
  );

  const handleShare = useCallback(async () => {
    try {
      const titles = activeProperties.map((p) => p.title).join(' vs ');
      await Share.share({
        title: 'REHVO Property Comparison',
        message: `Compare Homes on REHVO: ${titles}\nAI Recommended: ${winningProperty?.title}\nView detailed intelligence report on REHVO app.`,
      });
    } catch {
      // Ignore
    }
  }, [activeProperties, winningProperty]);

  const handleSaveSession = useCallback(async () => {
    const ids = activeProperties.map((p) => p.id);
    await saveCompareSession(user?.id, ids);
    showToast('Comparison report saved to your profile!', 'success');
  }, [activeProperties, user?.id, showToast]);

  const formatRupees = (amt: number) => {
    if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)}L`;
    return `₹${Math.round(amt / 1000)}k`;
  };

  return (
    <View style={styles.root}>
      {/* 1. TOP HEADER */}
      <View style={[styles.topHeader, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.headerIconBtn}
          accessibilityLabel="Back"
        >
          <ArrowLeft size={20} color="#0F172A" />
        </Pressable>

        <View style={styles.headerCenterCol}>
          <Text style={styles.headerTitle}>AI Property Compare</Text>
          <Text style={styles.headerSub}>
            {activeProperties.length} of 4 Homes Selected
          </Text>
        </View>

        <View style={styles.headerActionsRow}>
          <Pressable
            onPress={handleSaveSession}
            style={styles.headerIconBtn}
            accessibilityLabel="Save Comparison"
          >
            <Bookmark size={18} color="#0F766E" />
          </Pressable>
          <Pressable
            onPress={handleShare}
            style={styles.headerIconBtn}
            accessibilityLabel="Share Comparison"
          >
            <Share2 size={18} color="#0F172A" />
          </Pressable>
        </View>
      </View>

      {/* 2. TAB SELECTOR */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {[
            { key: 'matrix', label: 'Matrix' },
            { key: 'verdict', label: 'AI Verdict' },
            { key: 'proscons', label: 'Pros & Cons' },
            { key: 'costs', label: 'Hidden Costs' },
            { key: 'rentvsbuy', label: 'Rent vs Buy' },
          ].map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key as CompareTab)}
              style={[
                styles.tabPill,
                activeTab === tab.key && styles.tabPillActive,
              ]}
            >
              <Text
                style={[
                  styles.tabPillText,
                  activeTab === tab.key && styles.tabPillTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* 3. MAIN SCROLL BODY */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollBody,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* STICKY-LIKE PROPERTY HEADER CARDS */}
        <View style={styles.stickyPropsRow}>
          <View style={styles.labelsColumnHeader}>
            <Text style={styles.labelsHeaderTitle}>Properties</Text>
            <Text style={styles.labelsHeaderSub}>Side-by-side</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {activeProperties.map((p) => {
              const isOverallWinner = p.id === winningProperty?.id;
              const rent = p.rent || 35000;
              const rawImg = p.images?.[0];
              const imgUri =
                (typeof rawImg === 'string' ? rawImg : rawImg?.url) ||
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';

              return (
                <View key={p.id} style={[styles.propHeaderCard, { width: COLUMN_WIDTH }]}>
                  {/* Remove Button */}
                  <Pressable
                    onPress={() => handleRemove(p.id)}
                    style={styles.removeBtn}
                  >
                    <X size={12} color="#FFFFFF" />
                  </Pressable>

                  {/* Thumbnail Image */}
                  <Image source={{ uri: imgUri }} style={styles.propThumb} />

                  {/* Winner Crown Badge */}
                  {isOverallWinner && (
                    <View style={styles.winnerBadgePill}>
                      <Crown size={10} color="#FFFFFF" />
                      <Text style={styles.winnerBadgeText}>Top Pick</Text>
                    </View>
                  )}

                  {/* Info */}
                  <Text style={styles.propTitle} numberOfLines={1}>
                    {p.title}
                  </Text>
                  <Text style={styles.propLocality} numberOfLines={1}>
                    {p.locality || 'Mumbai'}
                  </Text>
                  <Text style={styles.propPrice}>{formatRupees(rent)}/mo</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* TAB CONTENT: 1. MATRIX */}
        {activeTab === 'matrix' && (
          <View style={styles.matrixContainer}>
            {comparisonData.rows.map((row, rIdx) => (
              <View key={rIdx} style={styles.matrixRow}>
                {/* Row Label */}
                <View style={styles.matrixRowLabelCol}>
                  <Text style={styles.matrixCategoryTag}>{row.category}</Text>
                  <Text style={styles.matrixRowLabelText}>{row.label}</Text>
                </View>

                {/* Values columns */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {activeProperties.map((p) => {
                    const val = row.values[p.id];
                    const isBool = typeof val === 'boolean';

                    return (
                      <View
                        key={p.id}
                        style={[styles.matrixValueCol, { width: COLUMN_WIDTH }]}
                      >
                        {isBool ? (
                          val ? (
                            <CheckCircle2 size={18} color="#059669" />
                          ) : (
                            <XCircle size={18} color="#CBD5E1" />
                          )
                        ) : (
                          <Text style={styles.matrixValueText} numberOfLines={2}>
                            {val !== undefined ? String(val) : '—'}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            ))}
          </View>
        )}

        {/* TAB CONTENT: 2. AI VERDICT */}
        {activeTab === 'verdict' && (
          <View style={styles.verdictContainer}>
            {/* AI Decision Summary Card */}
            {winningProperty && (
              <V4AIDecisionCard
                property={winningProperty}
                summary={aiDecisionSummary}
                onBookVisit={() => router.push(`/(renter)/property/${winningProperty.id}` as any)}
              />
            )}

            {/* Category Winners */}
            <Text style={styles.sectionHeader}>Category Champions</Text>
            <View style={styles.winnersGrid}>
              {comparisonData.winners.map((win, idx) => {
                const prop = activeProperties.find((p) => p.id === win.propertyId);
                if (!prop) return null;

                return (
                  <View key={idx} style={styles.winnerCard}>
                    <View style={styles.winnerCardTop}>
                      <View style={styles.winnerIconWrap}>
                        <Crown size={16} color="#0F766E" />
                      </View>
                      <View style={styles.winnerTitleWrap}>
                        <Text style={styles.winnerCategory}>{win.title}</Text>
                        <Text style={styles.winnerPropName}>{prop.title}</Text>
                      </View>
                      <View style={styles.winnerBadgeTag}>
                        <Text style={styles.winnerBadgeTagText}>{win.badge}</Text>
                      </View>
                    </View>
                    <Text style={styles.winnerRationale}>{win.rationale}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* TAB CONTENT: 3. PROS & CONS */}
        {activeTab === 'proscons' && (
          <View style={styles.prosConsContainer}>
            {activeProperties.map((p) => {
              const pc = comparisonData.prosCons[p.id];
              if (!pc) return null;

              return (
                <View key={p.id} style={styles.prosConsCard}>
                  <Text style={styles.prosConsPropTitle}>{p.title}</Text>
                  <Text style={styles.prosConsPropLoc}>{p.locality}</Text>

                  {/* Pros */}
                  <View style={styles.prosList}>
                    <Text style={styles.prosHeader}>Strengths</Text>
                    {pc.pros.map((pro, idx) => (
                      <View key={idx} style={styles.proRow}>
                        <CheckCircle2 size={15} color="#059669" />
                        <Text style={styles.proText}>{pro}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Cons */}
                  <View style={styles.consList}>
                    <Text style={styles.consHeader}>Tradeoffs to Consider</Text>
                    {pc.cons.map((con, idx) => (
                      <View key={idx} style={styles.conRow}>
                        <XCircle size={15} color="#DC2626" />
                        <Text style={styles.conText}>{con}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* TAB CONTENT: 4. HIDDEN COSTS */}
        {activeTab === 'costs' && (
          <View style={styles.costsContainer}>
            {/* Property Switcher for Costs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.propPillRow}
            >
              {activeProperties.map((p) => {
                const isSelected = p.id === activeCostProperty?.id;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => setSelectedCostPropId(p.id)}
                    style={[
                      styles.propCostPill,
                      isSelected && styles.propCostPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.propCostPillText,
                        isSelected && styles.propCostPillTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {p.title}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {activeCostProperty && <V4HiddenCostCard property={activeCostProperty} />}
          </View>
        )}

        {/* TAB CONTENT: 5. RENT VS BUY */}
        {activeTab === 'rentvsbuy' && (
          <View style={styles.rentVsBuyContainer}>
            <V4RentVsBuyCalculator
              initialRent={winningProperty?.rent || 45000}
              initialHomePrice={(winningProperty?.rent || 45000) * 320}
            />
          </View>
        )}
      </ScrollView>

      {/* 4. BOTTOM FLOATING ACTION BAR */}
      <View style={[styles.bottomActionBar, { paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.bottomWinnerCol}>
          <Text style={styles.bottomSubtext}>Recommended Choice</Text>
          <Text style={styles.bottomWinningTitle} numberOfLines={1}>
            {winningProperty?.title}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push(`/(renter)/property/${winningProperty?.id}` as any)}
          style={styles.bottomBookBtn}
        >
          <ShieldCheck size={16} color="#FFFFFF" />
          <Text style={styles.bottomBookBtnText}>Schedule Free Tour</Text>
          <ChevronRight size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenterCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  headerActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
  },
  tabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabPill: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPillActive: {
    backgroundColor: V4_COLORS.primary,
  },
  tabPillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  tabPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  scrollBody: {
    padding: 16,
    gap: 16,
  },
  stickyPropsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    ...V4_SHADOWS.soft,
  },
  labelsColumnHeader: {
    width: 90,
    justifyContent: 'center',
    paddingRight: 6,
  },
  labelsHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  labelsHeaderSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  propHeaderCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 3,
    position: 'relative',
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  propThumb: {
    width: '100%',
    height: 70,
    borderRadius: 8,
  },
  winnerBadgePill: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 10,
  },
  winnerBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  propTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 3,
  },
  propLocality: {
    fontSize: 10,
    color: '#64748B',
  },
  propPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: V4_COLORS.primary,
  },
  matrixContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...V4_SHADOWS.soft,
  },
  matrixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  matrixRowLabelCol: {
    width: 100,
    paddingRight: 8,
  },
  matrixCategoryTag: {
    fontSize: 8.5,
    fontWeight: '800',
    color: V4_COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  matrixRowLabelText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
    marginTop: 2,
  },
  matrixValueCol: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  matrixValueText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  verdictContainer: {
    gap: 16,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
  },
  winnersGrid: {
    gap: 10,
  },
  winnerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    ...V4_SHADOWS.soft,
  },
  winnerCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  winnerIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: V4_COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerTitleWrap: {
    flex: 1,
  },
  winnerCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  winnerPropName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  winnerBadgeTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  winnerBadgeTagText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#065F46',
  },
  winnerRationale: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
  },
  prosConsContainer: {
    gap: 14,
  },
  prosConsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...V4_SHADOWS.soft,
  },
  prosConsPropTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  prosConsPropLoc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: -8,
  },
  prosList: {
    gap: 6,
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 10,
  },
  prosHeader: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 2,
  },
  proRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  proText: {
    fontSize: 11.5,
    color: '#1E293B',
    flex: 1,
  },
  consList: {
    gap: 6,
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
  },
  consHeader: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 2,
  },
  conRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  conText: {
    fontSize: 11.5,
    color: '#1E293B',
    flex: 1,
  },
  costsContainer: {
    gap: 14,
  },
  propPillRow: {
    gap: 8,
    paddingBottom: 4,
  },
  propCostPill: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  propCostPillActive: {
    backgroundColor: V4_COLORS.primary,
  },
  propCostPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  propCostPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  rentVsBuyContainer: {
    gap: 14,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    ...V4_SHADOWS.card,
  },
  bottomWinnerCol: {
    flex: 1,
    paddingRight: 10,
  },
  bottomSubtext: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  bottomWinningTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  bottomBookBtn: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  bottomBookBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
