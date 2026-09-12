import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  ReceiptText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingDown,
} from 'lucide-react-native';
import { Property, HiddenCostBreakdown } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { calculateHiddenCosts } from '../../../services/propertyCompare';

interface V4HiddenCostCardProps {
  property: Property;
}

export const V4HiddenCostCard: React.FC<V4HiddenCostCardProps> = React.memo(({ property }) => {
  const costs: HiddenCostBreakdown = useMemo(() => calculateHiddenCosts(property), [property]);

  const traditionalBrokerFee = property.rent || 35000;

  const formatRupees = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const oneTimeItems = [
    { label: 'Security Deposit', amount: costs.securityDeposit, note: 'Refundable at lease end' },
    {
      label: 'REHVO Fee',
      amount: 0,
      note: `100% Free (Saved ₹${traditionalBrokerFee.toLocaleString('en-IN')})`,
      highlightFree: true,
    },
    { label: 'Agreement & Stamp Duty', amount: costs.agreementAndStampDuty, note: 'Govt e-registration' },
    { label: 'Society Move-In Fee', amount: costs.societyMoveInCharges, note: 'One-time association charge' },
    { label: 'Professional Movers', amount: costs.movingAndPacking, note: 'Packing & transport estimate' },
    { label: 'Deep Cleaning & Sanitization', amount: costs.deepCleaningAndSanitization, note: 'Prior to possession' },
    { label: 'Utility Security Deposit', amount: costs.utilitySecurityDeposits, note: 'Gas & Power meter setup' },
  ];

  const monthlyItems = [
    { label: 'Monthly Base Rent', amount: costs.monthlyRent },
    { label: 'Society Maintenance', amount: costs.monthlyMaintenance },
    { label: 'Electricity (Est.)', amount: costs.monthlyElectricityEst },
    { label: 'Piped Gas & Water (Est.)', amount: costs.monthlyWaterAndGasEst },
    { label: 'High-Speed Wi-Fi', amount: costs.monthlyWifiEst },
    ...(costs.furnitureRentalMonthly > 0
      ? [{ label: 'Furniture Rental', amount: costs.furnitureRentalMonthly }]
      : []),
  ];

  const totalMonthly = monthlyItems.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <ReceiptText size={20} color={V4_COLORS.primary} />
        </View>
        <View style={styles.headerTextCol}>
          <Text style={styles.title}>All-Inclusive Cost Breakdown</Text>
          <Text style={styles.subtitle}>
            True move-in expenses with zero hidden surprises
          </Text>
        </View>
      </View>

      {/* REHVO Verified Marketplace Banner */}
      <View style={styles.zeroBrokerageBanner}>
        <Sparkles size={16} color="#065F46" />
        <Text style={styles.zeroBrokerageText}>
          You save <Text style={styles.boldText}>{formatRupees(traditionalBrokerFee)}</Text> in
          fees with verified owner & broker leasing on REHVO.
        </Text>
      </View>

      {/* Summary Highlight Boxes */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Move-In Out of Pocket</Text>
          <Text style={styles.summaryValueHighlight}>
            {formatRupees(costs.totalInitialMoveInCost)}
          </Text>
          <Text style={styles.summaryNote}>Deposit + setup expenses</Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Estimated Monthly Outflow</Text>
          <Text style={styles.summaryValue}>{formatRupees(totalMonthly)}</Text>
          <Text style={styles.summaryNote}>Rent + maintenance + utilities</Text>
        </View>
      </View>

      {/* 1. One-time Setup Expenses List */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeading}>One-Time Move-In Expenses</Text>
        <View style={styles.itemsList}>
          {oneTimeItems.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={styles.itemNote}>{item.note}</Text>
              </View>
              <Text
                style={[
                  styles.itemAmount,
                  item.highlightFree && styles.itemAmountFree,
                ]}
              >
                {item.amount === 0 ? 'FREE' : formatRupees(item.amount)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 2. Monthly Recurring Expenses List */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeading}>Monthly Living Overhead</Text>
        <View style={styles.itemsList}>
          {monthlyItems.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemAmount}>{formatRupees(item.amount)}/mo</Text>
            </View>
          ))}
        </View>
      </View>

      {/* First-Year Grand Total */}
      <View style={styles.grandTotalBar}>
        <View>
          <Text style={styles.grandTotalLabel}>Estimated First-Year Total</Text>
          <Text style={styles.grandTotalSub}>Including all living & one-time overheads</Text>
        </View>
        <Text style={styles.grandTotalAmount}>{formatRupees(costs.totalFirstYearCost)}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: V4_RADIUS.card,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
    ...V4_SHADOWS.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: V4_COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  zeroBrokerageBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  zeroBrokerageText: {
    fontSize: 12,
    color: '#065F46',
    flex: 1,
    lineHeight: 16,
  },
  boldText: {
    fontWeight: '800',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  summaryValueHighlight: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.primary,
    marginTop: 4,
  },
  summaryNote: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  sectionContainer: {
    gap: 10,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  itemsList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemLeft: {
    flex: 1,
    paddingRight: 8,
  },
  itemLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  itemNote: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  itemAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  itemAmountFree: {
    color: '#059669',
    fontWeight: '900',
  },
  grandTotalBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#031B2A',
    padding: 16,
    borderRadius: 14,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  grandTotalSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  grandTotalAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2DD4BF',
  },
});
