import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Share } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  Copy,
  Share2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  DollarSign,
  Briefcase,
  Check,
  Building,
} from 'lucide-react-native';
import { Property, NegotiationAIResult, AgreementAISummary, MovingChecklist, AIBudgetPlan } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';

// -----------------------------------------------------------------------------
// 1. PROPERTY CARD EMBED
// -----------------------------------------------------------------------------
export const PropertyCardEmbed: React.FC<{ property: Property }> = React.memo(({ property }) => {
  const router = useRouter();
  const rawImg = property.images?.[0];
  const imgUri =
    (typeof rawImg === 'string' ? rawImg : (rawImg as any)?.url) ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.badgePill}>
          <Sparkles size={11} color={V4_COLORS.primary} />
          <Text style={styles.badgeText}>AI Match</Text>
        </View>
        <Text style={styles.zeroBrokerageTag}>Verified Listing</Text>
      </View>

      <View style={styles.propRow}>
        <Image source={{ uri: imgUri }} style={styles.propThumb} />
        <View style={styles.propInfoCol}>
          <Text style={styles.propTitle} numberOfLines={1}>
            {property.title}
          </Text>
          <View style={styles.propLocRow}>
            <MapPin size={11} color="#64748B" />
            <Text style={styles.propLocText} numberOfLines={1}>
              {property.locality || 'Mumbai'}
            </Text>
          </View>
          <Text style={styles.propRentText}>
            ₹{(property.rent || 45000).toLocaleString('en-IN')}
            <Text style={styles.propRentSub}>/month</Text>
          </Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          style={styles.outlineBtn}
          onPress={() => router.push(`/(renter)/property/${property.id}` as any)}
        >
          <Text style={styles.outlineBtnText}>View Details</Text>
        </Pressable>

        <Pressable
          style={styles.solidBtn}
          onPress={() => router.push(`/(renter)/property/${property.id}` as any)}
        >
          <Calendar size={13} color="#FFFFFF" />
          <Text style={styles.solidBtnText}>Book Visit</Text>
        </Pressable>
      </View>
    </View>
  );
});

// -----------------------------------------------------------------------------
// 2. NEGOTIATION CARD EMBED
// -----------------------------------------------------------------------------
export const NegotiationCardEmbed: React.FC<{ data: NegotiationAIResult }> = React.memo(({ data }) => {
  const [copiedLang, setCopiedLang] = useState<'en' | 'hi' | null>(null);

  const handleCopy = (text: string, lang: 'en' | 'hi') => {
    Share.share({ message: text });
    setCopiedLang(lang);
    setTimeout(() => setCopiedLang(null), 2500);
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeaderRow}>
        <View style={[styles.badgePill, { backgroundColor: '#FEF3C7' }]}>
          <TrendingDown size={12} color="#D97706" />
          <Text style={[styles.badgeText, { color: '#D97706' }]}>AI Negotiation</Text>
        </View>
        <View style={styles.confidencePill}>
          <Text style={styles.confidenceText}>{data.negotiationConfidencePercent}% Confidence</Text>
        </View>
      </View>

      <View style={styles.rentTargetRow}>
        <View style={styles.rentTargetCol}>
          <Text style={styles.rentTargetLabel}>Asking Rent</Text>
          <Text style={styles.askingRentVal}>₹{data.askingRent.toLocaleString('en-IN')}</Text>
        </View>
        <ArrowRight size={18} color="#94A3B8" />
        <View style={styles.rentTargetCol}>
          <Text style={styles.rentTargetLabel}>AI Target Rent</Text>
          <Text style={styles.targetRentVal}>₹{data.aiTargetRent.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      <View style={styles.savingsBanner}>
        <Text style={styles.savingsBannerText}>
          Estimated Annual Savings: <Text style={styles.savingsHighlight}>₹{data.estimatedSavingsAnnual.toLocaleString('en-IN')}</Text>
        </Text>
      </View>

      <Text style={styles.strategyTitle}>Strategy: {data.bestAngle}</Text>

      <View style={styles.actionsRow}>
        <Pressable
          style={styles.outlineBtn}
          onPress={() => handleCopy(data.whatsappMessageEnglish, 'en')}
        >
          {copiedLang === 'en' ? <Check size={13} color={V4_COLORS.primary} /> : <Copy size={13} color={V4_COLORS.primary} />}
          <Text style={styles.outlineBtnText}>{copiedLang === 'en' ? 'Copied' : 'WhatsApp (EN)'}</Text>
        </Pressable>

        <Pressable
          style={styles.solidBtn}
          onPress={() => handleCopy(data.whatsappMessageHindi, 'hi')}
        >
          {copiedLang === 'hi' ? <Check size={13} color="#FFFFFF" /> : <Share2 size={13} color="#FFFFFF" />}
          <Text style={styles.solidBtnText}>{copiedLang === 'hi' ? 'Copied' : 'WhatsApp (हिन्दी)'}</Text>
        </Pressable>
      </View>
    </View>
  );
});

// -----------------------------------------------------------------------------
// 3. AGREEMENT CARD EMBED
// -----------------------------------------------------------------------------
export const AgreementCardEmbed: React.FC<{ data: AgreementAISummary }> = React.memo(({ data }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeaderRow}>
        <View style={[styles.badgePill, { backgroundColor: '#DCFCE7' }]}>
          <ShieldCheck size={12} color="#16A34A" />
          <Text style={[styles.badgeText, { color: '#16A34A' }]}>Agreement Health: {data.overallAgreementHealthGrade}</Text>
        </View>
        <Text style={styles.neutralTag}>{data.lockInPeriodMonths} Mo Lock-in</Text>
      </View>

      <View style={styles.clausesList}>
        {data.keyClausesExplained.slice(0, 3).map((clause, idx) => (
          <View key={idx} style={styles.clauseItem}>
            <View style={styles.clauseHeader}>
              <Text style={styles.clauseName}>{clause.clauseName}</Text>
              {clause.riskLevel === 'caution' && (
                <View style={styles.cautionBadge}>
                  <AlertTriangle size={10} color="#D97706" />
                  <Text style={styles.cautionText}>Review</Text>
                </View>
              )}
            </View>
            <Text style={styles.clauseDesc}>{clause.plainEnglish}</Text>
          </View>
        ))}
      </View>

      <View style={styles.questionsBox}>
        <Text style={styles.questionsBoxTitle}>Questions to Ask Owner:</Text>
        {data.questionsForLandlord.slice(0, 2).map((q, idx) => (
          <Text key={idx} style={styles.questionText}>• {q}</Text>
        ))}
      </View>
    </View>
  );
});

// -----------------------------------------------------------------------------
// 4. CHECKLIST CARD EMBED
// -----------------------------------------------------------------------------
export const ChecklistCardEmbed: React.FC<{ data: MovingChecklist }> = React.memo(({ data }) => {
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  const toggleTask = (taskId: string) => {
    setCompletedMap((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const allTasks = data.weeksOutChecklist.flatMap((w) => w.tasks);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.badgePill}>
          <CheckCircle2 size={12} color={V4_COLORS.primary} />
          <Text style={styles.badgeText}>Move-In Master Plan</Text>
        </View>
        <Text style={styles.neutralTag}>{allTasks.filter((t) => completedMap[t.id]).length}/{allTasks.length} Done</Text>
      </View>

      <View style={styles.checklistItems}>
        {allTasks.slice(0, 5).map((task) => {
          const isDone = !!completedMap[task.id];
          return (
            <Pressable
              key={task.id}
              style={[styles.taskRow, isDone && styles.taskRowDone]}
              onPress={() => toggleTask(task.id)}
            >
              <View style={[styles.checkbox, isDone && styles.checkboxDone]}>
                {isDone && <Check size={11} color="#FFFFFF" />}
              </View>
              <Text style={[styles.taskTitle, isDone && styles.taskTitleDone]}>
                {task.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});

// -----------------------------------------------------------------------------
// 5. WALLET CARD EMBED
// -----------------------------------------------------------------------------
export const WalletCardEmbed: React.FC<{ data: AIBudgetPlan }> = React.memo(({ data }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.badgePill}>
          <DollarSign size={12} color={V4_COLORS.primary} />
          <Text style={styles.badgeText}>30% Budget Rule</Text>
        </View>
        <Text style={styles.savingsHighlight}>Verified Listing Saving</Text>
      </View>

      <View style={styles.budgetStatsRow}>
        <View style={styles.budgetStatCol}>
          <Text style={styles.budgetStatLabel}>Recommended Rent</Text>
          <Text style={styles.budgetStatVal}>₹{data.recommendedRent.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.budgetStatDivider} />
        <View style={styles.budgetStatCol}>
          <Text style={styles.budgetStatLabel}>Max Safe Ceiling</Text>
          <Text style={styles.budgetStatVal}>₹{data.maxRentLimit.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      <View style={styles.billsList}>
        <Text style={styles.billsTitle}>Estimated Monthly Bills: ₹{data.monthlyBillsEstimate.totalBills.toLocaleString('en-IN')}</Text>
        <Text style={styles.billsSub}>
          Power: ₹{data.monthlyBillsEstimate.electricity} • Maint: ₹{data.monthlyBillsEstimate.maintenance} • Wi-Fi: ₹{data.monthlyBillsEstimate.broadbandWifi}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.lg,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.primary,
  },
  zeroBrokerageTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  confidencePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  neutralTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  propRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  propThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  propInfoCol: {
    flex: 1,
  },
  propTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  propLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  propLocText: {
    fontSize: 12,
    color: '#64748B',
  },
  propRentText: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  propRentSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: V4_COLORS.primary,
    minHeight: 44,
  },
  outlineBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: V4_COLORS.primary,
  },
  solidBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: V4_COLORS.primary,
    minHeight: 44,
  },
  solidBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rentTargetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  rentTargetCol: {
    alignItems: 'center',
  },
  rentTargetLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  askingRentVal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  targetRentVal: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  savingsBanner: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  savingsBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
  },
  savingsHighlight: {
    fontWeight: '800',
    color: '#047857',
  },
  strategyTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 10,
  },
  clausesList: {
    gap: 8,
    marginBottom: 10,
  },
  clauseItem: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
  },
  clauseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  clauseName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  cautionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  cautionText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#B45309',
  },
  clauseDesc: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
  },
  questionsBox: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  questionsBoxTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  questionText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  checklistItems: {
    gap: 8,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    minHeight: 44,
  },
  taskRowDone: {
    backgroundColor: '#F1F5F9',
    opacity: 0.65,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: V4_COLORS.primary,
    borderColor: V4_COLORS.primary,
  },
  taskTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  budgetStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  budgetStatCol: {
    flex: 1,
    alignItems: 'center',
  },
  budgetStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  budgetStatLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  budgetStatVal: {
    fontSize: 16,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  billsList: {
    backgroundColor: '#F0FDFA',
    padding: 10,
    borderRadius: 8,
  },
  billsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
    marginBottom: 2,
  },
  billsSub: {
    fontSize: 11,
    color: '#115E59',
  },
});
