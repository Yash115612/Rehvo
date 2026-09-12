import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import {
  ShieldCheck,
  Phone,
  MessageSquare,
  Calendar,
  FileText,
  Check,
  XCircle,
  Sparkles,
  MapPin,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
} from 'lucide-react-native';
import { TenantLeadRecord, TenantLeadStatus } from '../../../types';
import { V4_COLORS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4LeadActionButton } from './V4LeadActionButton';

export interface V4OwnerLeadCardProps {
  lead: TenantLeadRecord;
  onCall?: (phone: string) => void;
  onChat?: (lead: TenantLeadRecord) => void;
  onScheduleVisit?: (lead: TenantLeadRecord) => void;
  onOpenNotes?: (lead: TenantLeadRecord) => void;
  onSetReminder?: (lead: TenantLeadRecord) => void;
  onApprove?: (leadId: string) => Promise<void> | void;
  onReject?: (leadId: string) => Promise<void> | void;
  isCompact?: boolean;
}

export const V4OwnerLeadCard: React.FC<V4OwnerLeadCardProps> = ({
  lead,
  onCall,
  onChat,
  onScheduleVisit,
  onOpenNotes,
  onSetReminder,
  onApprove,
  onReject,
  isCompact = false,
}) => {
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);

  const handleCallPress = () => {
    if (onCall) {
      onCall(lead.tenant_phone);
    } else {
      Linking.openURL(`tel:${lead.tenant_phone.replace(/\s+/g, '')}`).catch(() => {});
    }
  };

  const handleChatPress = () => {
    onChat?.(lead);
  };

  const handleVisitPress = () => {
    onScheduleVisit?.(lead);
  };

  const handleNotesPress = () => {
    onOpenNotes?.(lead);
  };

  const handleApprovePress = async () => {
    if (!onApprove) return;
    try {
      setApproving(true);
      await onApprove(lead.id);
    } finally {
      setApproving(false);
    }
  };

  const handleRejectPress = async () => {
    if (!onReject) return;
    try {
      setRejecting(true);
      await onReject(lead.id);
    } finally {
      setRejecting(false);
    }
  };

  const getStatusConfig = (status: TenantLeadStatus) => {
    switch (status) {
      case 'NEW':
        return { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A', label: 'New Lead' };
      case 'CONTACTED':
        return { bg: '#E0F2FE', color: '#0284C7', border: '#BAE6FD', label: 'Contacted' };
      case 'INTERESTED':
        return { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE', label: 'Interested' };
      case 'VISIT_SCHEDULED':
        return { bg: '#F3E8FF', color: '#7E22CE', border: '#E9D5FF', label: 'Visit Scheduled' };
      case 'NEGOTIATION':
        return { bg: '#FDF2F8', color: '#BE185D', border: '#FBCFE8', label: 'Negotiation' };
      case 'CLOSED':
        return { bg: '#DCFCE7', color: '#15803D', border: '#BBF7D0', label: 'Closed' };
      case 'LOST':
        return { bg: '#F1F5F9', color: '#64748B', border: '#CBD5E1', label: 'Lost' };
      case 'APPROVED':
        return { bg: '#DCFCE7', color: '#15803D', border: '#BBF7D0', label: 'Approved' };
      case 'REJECTED':
        return { bg: '#FFE4E6', color: '#BE123C', border: '#FECDD3', label: 'Rejected' };
      default:
        return { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0', label: status };
    }
  };

  const statusConfig = getStatusConfig(lead.status);

  return (
    <View style={styles.cardContainer}>
      {/* =====================================================================
          1. TOP SECTION: Avatar, Name, Verification & Compatibility Ring
         ===================================================================== */}
      <View style={styles.topSection}>
        {/* Profile Avatar */}
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri:
                lead.tenant_photo ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            }}
            style={styles.avatarImage}
          />
          {lead.is_verified && (
            <View style={styles.avatarVerifiedBadge}>
              <ShieldCheck size={12} color="#FFFFFF" strokeWidth={2.5} />
            </View>
          )}
        </View>

        {/* Identity & Property Text */}
        <View style={styles.nameBlock}>
          <View style={styles.nameRow}>
            <Text
              style={styles.tenantNameText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {lead.tenant_name}
            </Text>
            {lead.is_verified && (
              <View style={styles.verifiedInlineBadge}>
                <Text style={styles.verifiedInlineText}>VERIFIED</Text>
              </View>
            )}
          </View>

          {/* Property Applied */}
          <Text
            style={styles.propertyAppliedText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Applied for:{' '}
            <Text style={styles.propertyTitleHighlight}>
              {lead.property_title}
            </Text>
          </Text>

          {/* Location / Locality if present */}
          {lead.property_locality && (
            <View style={styles.localityRow}>
              <MapPin size={11} color="#64748B" />
              <Text
                style={styles.localityText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {lead.property_locality}
              </Text>
            </View>
          )}
        </View>

        {/* Fixed Circular Compatibility Ring */}
        <View style={styles.compatRing}>
          <Text style={styles.compatScoreText}>{lead.compatibility || 85}%</Text>
          <Text style={styles.compatScoreLabel}>MATCH</Text>
        </View>
      </View>

      {/* =====================================================================
          2. MIDDLE SECTION: Status Badges, Budget & Move-in Specifications
         ===================================================================== */}
      <View style={styles.badgeRow}>
        {/* Vertically Aligned Status Pill (Auto Width) */}
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: statusConfig.bg,
              borderColor: statusConfig.border,
            },
          ]}
        >
          <View
            style={[styles.statusDot, { backgroundColor: statusConfig.color }]}
          />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>

        {/* Source Pill */}
        {lead.wave_source && (
          <View style={styles.sourcePill}>
            <Sparkles size={11} color="#065F46" />
            <Text
              style={styles.sourcePillText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {lead.wave_source}
            </Text>
          </View>
        )}
      </View>

      {/* Budget & Move-in Metric Strip */}
      <View style={styles.metricsBar}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Monthly Budget</Text>
          <Text
            style={styles.metricValue}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            ₹{lead.budget.toLocaleString('en-IN')}/mo
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Move-in Date</Text>
          <Text
            style={styles.metricValue}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {lead.move_in_date || 'Immediate'}
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Phone Verified</Text>
          <Text
            style={[
              styles.metricValue,
              { color: lead.is_phone_verified ? '#059669' : '#D97706' },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {lead.is_phone_verified ? 'Yes (OTP)' : 'Pending'}
          </Text>
        </View>

        {lead.occupation ? (
          <>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Occupation</Text>
              <Text style={styles.metricValue} numberOfLines={1} ellipsizeMode="tail">
                {lead.occupation}
              </Text>
            </View>
          </>
        ) : null}
      </View>

      {/* Reminder Banner */}
      {lead.reminder_date && (
        <View style={styles.reminderBanner}>
          <Clock size={12} color="#0F766E" strokeWidth={2.4} />
          <Text style={styles.reminderBannerText}>Follow-up: {lead.reminder_date}</Text>
        </View>
      )}

      {/* Optional Screening Notes Box */}
      {lead.notes ? (
        <Pressable
          style={styles.notesContainer}
          onPress={() => setNotesExpanded(!notesExpanded)}
        >
          <View style={styles.notesHeaderRow}>
            <Text style={styles.notesTitleText}>OWNER SCREENING NOTES</Text>
            {notesExpanded ? (
              <ChevronUp size={14} color="#92400E" />
            ) : (
              <ChevronDown size={14} color="#92400E" />
            )}
          </View>
          <Text
            style={styles.notesBodyText}
            numberOfLines={notesExpanded ? undefined : 2}
            ellipsizeMode="tail"
          >
            {lead.notes}
          </Text>
        </Pressable>
      ) : null}

      {/* =====================================================================
          3. BOTTOM SECTION: Fully Responsive, Wrapped Action Buttons
         ===================================================================== */}
      {!isCompact && (
        <View style={styles.actionsContainer}>
          {/* Row 1: Quick Actions (Chat, Call, Notes, Reminder) - Flex Wraps Cleanly */}
          <View style={styles.buttonFlexRow}>
            <V4LeadActionButton
              label="Call"
              icon={Phone}
              variant="secondary"
              flex={1}
              minWidth={74}
              onPress={handleCallPress}
              accessibilityLabel={`Call ${lead.tenant_name}`}
            />
            <V4LeadActionButton
              label="Chat"
              icon={MessageSquare}
              variant="secondary"
              flex={1}
              minWidth={74}
              onPress={handleChatPress}
              accessibilityLabel={`Chat with ${lead.tenant_name}`}
            />
            <V4LeadActionButton
              label="Notes"
              icon={FileText}
              variant="outline"
              flex={1}
              minWidth={74}
              onPress={handleNotesPress}
              accessibilityLabel={`Add notes for ${lead.tenant_name}`}
            />
            {onSetReminder && (
              <V4LeadActionButton
                label="Reminder"
                icon={Clock}
                variant="outline"
                flex={1}
                minWidth={74}
                onPress={() => onSetReminder(lead)}
                accessibilityLabel={`Set reminder for ${lead.tenant_name}`}
              />
            )}
          </View>

          {/* Row 2: Schedule Visit (Primary Emerald CTA) */}
          <V4LeadActionButton
            label="Schedule Visit"
            icon={Calendar}
            variant="primary"
            fullWidth
            onPress={handleVisitPress}
            accessibilityLabel={`Schedule visit with ${lead.tenant_name}`}
          />

          {/* Row 3: Decision CTAs (Equal Width, Consistent Spacing) */}
          {lead.status !== 'APPROVED' && lead.status !== 'REJECTED' ? (
            <View style={styles.decisionFlexRow}>
              <V4LeadActionButton
                label="Reject"
                icon={XCircle}
                variant="destructive"
                flex={1}
                loading={rejecting}
                onPress={handleRejectPress}
                accessibilityLabel={`Reject ${lead.tenant_name}`}
              />
              <V4LeadActionButton
                label="Approve"
                icon={Check}
                variant="success"
                flex={1}
                loading={approving}
                onPress={handleApprovePress}
                accessibilityLabel={`Approve ${lead.tenant_name}`}
              />
            </View>
          ) : lead.status === 'APPROVED' ? (
            <View style={styles.decisionStatusRow}>
              <CheckCircle2 size={16} color="#059669" strokeWidth={2.5} />
              <Text style={styles.decisionStatusText}>
                Lead Approved • Ready for Digital E-Lease
              </Text>
            </View>
          ) : (
            <View style={[styles.decisionStatusRow, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
              <XCircle size={16} color="#DC2626" />
              <Text style={[styles.decisionStatusText, { color: '#DC2626' }]}>
                Lead Rejected
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...V4_SHADOWS.card,
  },
  // 1. Top Section
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
    width: 52,
    height: 52,
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F1F5F9',
  },
  avatarVerifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#059669',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameBlock: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0, // critical for flexShrink text truncation
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tenantNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    flexShrink: 1,
  },
  verifiedInlineBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  verifiedInlineText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.3,
  },
  propertyAppliedText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  propertyTitleHighlight: {
    color: '#0F766E',
    fontWeight: '700',
  },
  localityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  localityText: {
    fontSize: 10.5,
    color: '#64748B',
    flexShrink: 1,
  },
  // Compatibility Ring
  compatRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  compatScoreText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#064E3B',
    lineHeight: 13,
  },
  compatScoreLabel: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.4,
  },
  // 2. Middle Section
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  sourcePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    maxWidth: 160,
  },
  sourcePillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#065F46',
    flexShrink: 1,
  },
  // Metrics Bar
  metricsBar: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: '75%',
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
  },
  // Notes
  notesContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  notesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  notesTitleText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: 0.5,
  },
  notesBodyText: {
    fontSize: 11.5,
    color: '#78350F',
    lineHeight: 16,
    fontWeight: '500',
  },
  // 3. Actions Container
  actionsContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  buttonFlexRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  decisionFlexRow: {
    flexDirection: 'row',
    gap: 8,
  },
  decisionStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  decisionStatusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
  reminderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  reminderBannerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
});
