import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FileText, ShieldCheck, Download, Eye, PenTool } from 'lucide-react-native';
import { AgreementMessageMeta } from '../../../types';
import { V4_SHADOWS } from '../../../theme/v4Theme';

interface V4AgreementMessageCardProps {
  agreement: AgreementMessageMeta;
  isMe?: boolean;
  onView?: () => void;
  onDownload?: () => void;
  onSign?: () => void;
}

export const V4AgreementMessageCard: React.FC<V4AgreementMessageCardProps> = ({
  agreement,
  isMe = false,
  onView,
  onDownload,
  onSign,
}) => {
  const isSigned = agreement.status === 'signed' || agreement.status === 'active';
  const rentStr = agreement.monthly_rent
    ? `₹${agreement.monthly_rent.toLocaleString('en-IN')}/mo`
    : '₹75,000/mo';
  const depositStr = agreement.security_deposit
    ? `₹${agreement.security_deposit.toLocaleString('en-IN')}`
    : '₹1.5 Lakh';

  return (
    <View style={[styles.card, isMe ? styles.cardMe : styles.cardOther]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <FileText size={16} color="#0F766E" strokeWidth={2.4} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.title, isMe && styles.titleMe]}>
            {agreement.title || 'Digital Rental Agreement'}
          </Text>
          <Text style={[styles.subText, isMe && styles.subTextMe]}>
            {agreement.lease_term || '11-Month State E-Stamped Lease'}
          </Text>
        </View>

        <View style={styles.stampBadge}>
          <ShieldCheck size={11} color="#065F46" strokeWidth={2.6} />
          <Text style={styles.stampBadgeText}>E-STAMPED</Text>
        </View>
      </View>

      {/* Metrics Row */}
      <View style={[styles.metricsRow, isMe && styles.metricsRowMe]}>
        <View style={styles.metricCol}>
          <Text style={[styles.metricLabel, isMe && styles.metricLabelMe]}>Monthly Rent</Text>
          <Text style={[styles.metricVal, isMe && styles.metricValMe]}>{rentStr}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricCol}>
          <Text style={[styles.metricLabel, isMe && styles.metricLabelMe]}>Security Deposit</Text>
          <Text style={[styles.metricVal, isMe && styles.metricValMe]}>{depositStr}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <Pressable style={[styles.actionBtn, styles.actionBtnSecondary]} onPress={onView}>
          <Eye size={12} color="#0F766E" strokeWidth={2.4} />
          <Text style={styles.actionBtnSecondaryText}>View</Text>
        </Pressable>

        <Pressable style={[styles.actionBtn, styles.actionBtnSecondary]} onPress={onDownload}>
          <Download size={12} color="#0F766E" strokeWidth={2.4} />
          <Text style={styles.actionBtnSecondaryText}>PDF</Text>
        </Pressable>

        {!isSigned ? (
          <Pressable style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={onSign}>
            <PenTool size={12} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.actionBtnPrimaryText}>Sign Lease</Text>
          </Pressable>
        ) : (
          <View style={styles.signedPill}>
            <Text style={styles.signedPillText}>✓ Signed & Active</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 13,
    width: '100%',
    maxWidth: 290,
    marginVertical: 4,
    borderWidth: 1,
    ...V4_SHADOWS.card,
  },
  cardMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  cardOther: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  titleMe: {
    color: '#FFFFFF',
  },
  subText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  subTextMe: {
    color: '#CCFBF1',
  },
  stampBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stampBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#065F46',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 9,
    marginTop: 10,
  },
  metricsRowMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  metricCol: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '600',
  },
  metricLabelMe: {
    color: '#CCFBF1',
  },
  metricVal: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  metricValMe: {
    color: '#FFFFFF',
  },
  metricDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 8,
    paddingVertical: 7,
    minHeight: 34,
  },
  actionBtnSecondary: {
    flex: 1,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  actionBtnSecondaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  actionBtnPrimary: {
    flex: 1.4,
    backgroundColor: '#0F766E',
  },
  actionBtnPrimaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  signedPill: {
    flex: 1.4,
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
  },
  signedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
});
