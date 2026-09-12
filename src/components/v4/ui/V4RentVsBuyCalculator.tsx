import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  TrendingUp,
  Building,
  Coins,
  ShieldCheck,
  ChevronRight,
  Info,
  Calendar,
  Zap,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { RentVsBuyInput } from '../../../types';
import { calculateRentVsBuy } from '../../../services/propertyCompare';

interface V4RentVsBuyCalculatorProps {
  initialRent?: number;
  initialHomePrice?: number;
}

export const V4RentVsBuyCalculator: React.FC<V4RentVsBuyCalculatorProps> = React.memo(
  ({ initialRent = 45000, initialHomePrice = 14000000 }) => {
    // Inputs State
    const [homePrice, setHomePrice] = useState<number>(initialHomePrice);
    const [currentRent, setCurrentRent] = useState<number>(initialRent);
    const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
    const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
    const [interestRatePercent, setInterestRatePercent] = useState<number>(8.6);

    const calculationInput: RentVsBuyInput = useMemo(
      () => ({
        homePrice,
        currentRent,
        downPaymentPercent,
        loanTenureYears,
        interestRatePercent,
        annualRentIncreasePercent: 5.0,
        propertyAppreciationPercent: 6.5,
        equityReturnPercent: 11.5,
        monthlyMaintenance: Math.round(currentRent * 0.08),
      }),
      [
        homePrice,
        currentRent,
        downPaymentPercent,
        loanTenureYears,
        interestRatePercent,
      ]
    );

    const result = useMemo(() => calculateRentVsBuy(calculationInput), [calculationInput]);

    const formatCurrency = (amount: number) => {
      if (amount >= 10000000) {
        return `₹${(amount / 10000000).toFixed(2)} Cr`;
      }
      if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(1)} L`;
      }
      return `₹${amount.toLocaleString('en-IN')}`;
    };

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerIconWrapper}>
            <TrendingUp size={20} color={V4_COLORS.primary} />
          </View>
          <View style={styles.headerTextCol}>
            <Text style={styles.headerTitle}>AI Rent vs. Buy Calculator</Text>
            <Text style={styles.headerSubtitle}>
              20-year wealth simulation & break-even engine
            </Text>
          </View>
        </View>

        {/* Dynamic AI Recommendation Verdict Banner */}
        <View
          style={[
            styles.verdictBanner,
            result.recommendation === 'BUY'
              ? styles.verdictBannerBuy
              : styles.verdictBannerRent,
          ]}
        >
          <View style={styles.verdictIconWrap}>
            <Zap
              size={18}
              color={result.recommendation === 'BUY' ? '#065F46' : '#1E40AF'}
            />
          </View>
          <View style={styles.verdictTextCol}>
            <Text
              style={[
                styles.verdictTitle,
                result.recommendation === 'BUY'
                  ? styles.verdictTitleBuy
                  : styles.verdictTitleRent,
              ]}
            >
              {result.verdictTitle}
            </Text>
            <Text style={styles.verdictDescription}>{result.verdictDescription}</Text>
          </View>
        </View>

        {/* Key Result Matrix Cards */}
        <View style={styles.resultGrid}>
          <View style={styles.resultCell}>
            <Text style={styles.cellLabel}>Monthly Home Loan EMI</Text>
            <Text style={styles.cellValueHighlight}>{formatCurrency(result.monthlyEmi)}</Text>
            <Text style={styles.cellSubtext}>@ {interestRatePercent}% for {loanTenureYears} yrs</Text>
          </View>

          <View style={styles.resultCell}>
            <Text style={styles.cellLabel}>Break-Even Horizon</Text>
            <Text style={styles.cellValue}>
              Year {result.breakEvenYear}
            </Text>
            <Text style={styles.cellSubtext}>Buyer net worth surpasses renter</Text>
          </View>

          <View style={styles.resultCell}>
            <Text style={styles.cellLabel}>Down Payment ({downPaymentPercent}%)</Text>
            <Text style={styles.cellValue}>{formatCurrency(result.downPaymentAmount)}</Text>
            <Text style={styles.cellSubtext}>Loan: {formatCurrency(result.loanAmount)}</Text>
          </View>

          <View style={styles.resultCell}>
            <Text style={styles.cellLabel}>Total Rent in {loanTenureYears} Yrs</Text>
            <Text style={styles.cellValue}>{formatCurrency(result.totalRentPaidOverTenure)}</Text>
            <Text style={styles.cellSubtext}>Factoring 5% annual escalation</Text>
          </View>
        </View>

        {/* 20-Year Wealth Projection Comparison */}
        <View style={styles.wealthComparisonBlock}>
          <Text style={styles.wealthSectionTitle}>Projected Assets at Year {loanTenureYears}</Text>

          {/* Buying Outcome Bar */}
          <View style={styles.wealthBarRow}>
            <View style={styles.wealthBarHeader}>
              <View style={styles.barLabelGroup}>
                <Building size={14} color="#0F766E" />
                <Text style={styles.barTitle}>Buying: Property Value</Text>
              </View>
              <Text style={styles.barAmount}>{formatCurrency(result.propertyValueAtTenure)}</Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${Math.min(
                      100,
                      (result.propertyValueAtTenure /
                        Math.max(
                          result.propertyValueAtTenure,
                          result.renterInvestmentValueAtTenure
                        )) *
                        100
                    )}%`,
                    backgroundColor: '#0F766E',
                  },
                ]}
              />
            </View>
          </View>

          {/* Renting + Investing Outcome Bar */}
          <View style={styles.wealthBarRow}>
            <View style={styles.wealthBarHeader}>
              <View style={styles.barLabelGroup}>
                <Coins size={14} color="#2563EB" />
                <Text style={styles.barTitle}>Renting + SIP Wealth</Text>
              </View>
              <Text style={styles.barAmount}>{formatCurrency(result.renterInvestmentValueAtTenure)}</Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${Math.min(
                      100,
                      (result.renterInvestmentValueAtTenure /
                        Math.max(
                          result.propertyValueAtTenure,
                          result.renterInvestmentValueAtTenure
                        )) *
                        100
                    )}%`,
                    backgroundColor: '#2563EB',
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Interactive Property Price & Rent Quick Selector Pills */}
        <View style={styles.selectorSection}>
          <Text style={styles.selectorSectionTitle}>Quick Adjust Property Price</Text>
          <View style={styles.pillsRow}>
            {[8000000, 12000000, 15000000, 20000000].map((price) => (
              <Pressable
                key={price}
                onPress={() => setHomePrice(price)}
                style={[
                  styles.pillBtn,
                  homePrice === price && styles.pillBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.pillBtnText,
                    homePrice === price && styles.pillBtnTextActive,
                  ]}
                >
                  {formatCurrency(price)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.selectorSection}>
          <Text style={styles.selectorSectionTitle}>Down Payment Ratio</Text>
          <View style={styles.pillsRow}>
            {[10, 20, 25, 30].map((pct) => (
              <Pressable
                key={pct}
                onPress={() => setDownPaymentPercent(pct)}
                style={[
                  styles.pillBtn,
                  downPaymentPercent === pct && styles.pillBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.pillBtnText,
                    downPaymentPercent === pct && styles.pillBtnTextActive,
                  ]}
                >
                  {pct}%
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    );
  }
);

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
  headerIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: V4_COLORS.secondary, // #CCFBF1
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  verdictBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  verdictBannerBuy: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  verdictBannerRent: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  verdictIconWrap: {
    marginTop: 2,
  },
  verdictTextCol: {
    flex: 1,
  },
  verdictTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  verdictTitleBuy: {
    color: '#065F46',
  },
  verdictTitleRent: {
    color: '#1E40AF',
  },
  verdictDescription: {
    fontSize: 12,
    color: '#475569',
    marginTop: 3,
    lineHeight: 17,
  },
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  resultCell: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cellLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  cellValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  cellValueHighlight: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.primary,
    marginTop: 4,
  },
  cellSubtext: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  wealthComparisonBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  wealthSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  wealthBarRow: {
    gap: 6,
  },
  wealthBarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  barLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  barAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  barTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  selectorSection: {
    gap: 8,
  },
  selectorSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pillBtn: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 6,
  },
  pillBtnActive: {
    backgroundColor: V4_COLORS.primary,
    borderColor: V4_COLORS.primary,
  },
  pillBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  pillBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
