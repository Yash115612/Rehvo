import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  AlertCircle,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Send,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../src/theme/v4Theme';
import { triggerHapticFeedback } from '../../../src/utils/haptics';
import { SocietyComplaintRecord } from '../../../src/types';

export default function SocietyComplaintsRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    properties,
    leaseAgreements,
    societyComplaints,
    fetchSocietyComplaints,
    createSocietyComplaint,
    resolveSocietyComplaint,
    showToast,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'active' | 'new' | 'resolved'>('active');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SocietyComplaintRecord['category']>('plumbing');
  const [priority, setPriority] = useState<SocietyComplaintRecord['priority']>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    fetchSocietyComplaints(societyName);
  }, [societyName]);

  const categories = [
    { id: 'plumbing', label: 'Plumbing / Water' },
    { id: 'electrical', label: 'Electrical / Power' },
    { id: 'lift', label: 'Elevator / Lift' },
    { id: 'security', label: 'Gate Security' },
    { id: 'noise', label: 'Noise Disturbance' },
    { id: 'cleanliness', label: 'Housekeeping' },
    { id: 'parking', label: 'Parking Issue' },
    { id: 'other', label: 'General / Other' },
  ];

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      showToast?.('Please provide title and description', 'error');
      triggerHapticFeedback('notificationError');
      return;
    }

    setIsSubmitting(true);
    triggerHapticFeedback('impactMedium');

    const res = await createSocietyComplaint({
      society_name: societyName,
      unit_number: unitNumber,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
    });

    setIsSubmitting(false);

    if (res.success) {
      triggerHapticFeedback('notificationSuccess');
      showToast?.('Ticket lodged with Society Management Committee', 'success');
      setTitle('');
      setDescription('');
      setActiveTab('active');
    } else {
      triggerHapticFeedback('notificationError');
      showToast?.(res.error || 'Failed to lodge complaint', 'error');
    }
  };

  const activeTickets = useMemo(
    () => societyComplaints.filter((c) => c.status !== 'resolved' && c.status !== 'closed'),
    [societyComplaints]
  );

  const resolvedTickets = useMemo(
    () => societyComplaints.filter((c) => c.status === 'resolved' || c.status === 'closed'),
    [societyComplaints]
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
          <Text style={styles.headerTitle}>Society Helpdesk</Text>
          <Text style={styles.headerSubtitle}>{societyName} • {unitNumber}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabBtn, activeTab === 'active' && styles.tabBtnActive]}
          onPress={() => {
            triggerHapticFeedback('selection');
            setActiveTab('active');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            Active ({activeTickets.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, activeTab === 'new' && styles.tabBtnActive]}
          onPress={() => {
            triggerHapticFeedback('selection');
            setActiveTab('new');
          }}
        >
          <Plus size={16} color={activeTab === 'new' ? '#0F766E' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'new' && styles.tabTextActive]}>Raise Ticket</Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, activeTab === 'resolved' && styles.tabBtnActive]}
          onPress={() => {
            triggerHapticFeedback('selection');
            setActiveTab('resolved');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'resolved' && styles.tabTextActive]}>
            Resolved ({resolvedTickets.length})
          </Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* TAB: ACTIVE TICKETS */}
        {activeTab === 'active' && (
          <View style={{ gap: 12 }}>
            {activeTickets.length === 0 ? (
              <View style={styles.emptyCard}>
                <CheckCircle2 size={44} color="#10B981" />
                <Text style={styles.emptyTitle}>No Active Complaints</Text>
                <Text style={styles.emptySubtitle}>All society facilities and services are running smoothly</Text>
                <Pressable
                  style={styles.emptyBtn}
                  onPress={() => {
                    triggerHapticFeedback('selection');
                    setActiveTab('new');
                  }}
                >
                  <Text style={styles.emptyBtnText}>Raise a Ticket</Text>
                </Pressable>
              </View>
            ) : (
              activeTickets.map((t) => (
                <View key={t.id} style={styles.ticketCard}>
                  <View style={styles.ticketCardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.ticketTitle}>{t.title}</Text>
                      <Text style={styles.ticketSub}>
                        {t.category.toUpperCase()} • Priority: {t.priority.toUpperCase()}
                      </Text>
                    </View>
                    <View style={[styles.ticketBadge, t.status === 'in_progress' ? styles.badgeProgress : styles.badgePending]}>
                      <Text style={[styles.ticketBadgeText, t.status === 'in_progress' ? styles.badgeProgressText : styles.badgePendingText]}>
                        {t.status === 'in_progress' ? 'IN PROGRESS' : 'SUBMITTED'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.ticketDesc}>{t.description}</Text>

                  {/* Escalate & Resolve actions */}
                  <View style={styles.ticketActionsRow}>
                    <Pressable
                      style={styles.escalateBtn}
                      onPress={() => {
                        triggerHapticFeedback('impactMedium');
                        showToast?.('Escalated to Society Management Committee Chairman', 'info');
                      }}
                    >
                      <ShieldAlert size={14} color="#B45309" />
                      <Text style={styles.escalateBtnText}>Escalate to MC</Text>
                    </Pressable>

                    <Pressable
                      style={styles.resolveBtn}
                      onPress={async () => {
                        triggerHapticFeedback('notificationSuccess');
                        await resolveSocietyComplaint(t.id);
                        showToast?.('Complaint marked as resolved', 'success');
                      }}
                    >
                      <CheckCircle2 size={14} color="#0F766E" />
                      <Text style={styles.resolveBtnText}>Mark Resolved</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* TAB: RAISE NEW COMPLAINT */}
        {activeTab === 'new' && (
          <View style={styles.formCard}>
            <View style={styles.formCardHeader}>
              <View style={styles.formIconBox}>
                <AlertCircle size={22} color="#E11D48" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.formTitle}>Lodge Society Complaint</Text>
                <Text style={styles.formSub}>Notified instantly to Facility Manager</Text>
              </View>
            </View>

            {/* Category selection */}
            <Text style={styles.inputLabel}>SELECT CATEGORY</Text>
            <View style={styles.categoryGrid}>
              {categories.map((c) => (
                <Pressable
                  key={c.id}
                  style={[styles.categoryPill, category === c.id && styles.categoryPillActive]}
                  onPress={() => {
                    triggerHapticFeedback('selection');
                    setCategory(c.id as any);
                  }}
                >
                  <Text style={[styles.categoryPillText, category === c.id && styles.categoryPillTextActive]}>
                    {c.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Urgency */}
            <Text style={styles.inputLabel}>URGENCY LEVEL</Text>
            <View style={styles.priorityRow}>
              {[
                { id: 'low', label: 'Low' },
                { id: 'medium', label: 'Normal' },
                { id: 'high', label: 'High' },
                { id: 'emergency', label: '🚨 Urgent' },
              ].map((p) => (
                <Pressable
                  key={p.id}
                  style={[styles.priorityPill, priority === p.id && styles.priorityPillActive]}
                  onPress={() => {
                    triggerHapticFeedback('selection');
                    setPriority(p.id as any);
                  }}
                >
                  <Text style={[styles.priorityPillText, priority === p.id && styles.priorityPillTextActive]}>
                    {p.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Title */}
            <Text style={styles.inputLabel}>ISSUE SUMMARY *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Lift #2 in Tower 4 making loud screeching sound"
              placeholderTextColor="#94A3B8"
            />

            {/* Description */}
            <Text style={styles.inputLabel}>DETAILED DESCRIPTION *</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Provide exact location, floor, and when the issue started..."
              placeholderTextColor="#94A3B8"
              multiline
            />

            {/* Submit */}
            <Pressable
              style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
              disabled={isSubmitting}
              onPress={handleSubmit}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Society Ticket</Text>
              )}
            </Pressable>
          </View>
        )}

        {/* TAB: RESOLVED */}
        {activeTab === 'resolved' && (
          <View style={{ gap: 10 }}>
            {resolvedTickets.length === 0 ? (
              <View style={styles.emptyCard}>
                <Clock size={44} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No Resolved Tickets</Text>
                <Text style={styles.emptySubtitle}>Tickets marked as resolved will appear here</Text>
              </View>
            ) : (
              resolvedTickets.map((t) => (
                <View key={t.id} style={styles.resolvedCard}>
                  <View style={styles.resolvedIconBox}>
                    <CheckCircle2 size={20} color="#15803D" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resolvedTitle}>{t.title}</Text>
                    <Text style={styles.resolvedSub}>
                      {t.category} • Resolved
                    </Text>
                  </View>
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
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...V4_SHADOWS.card,
  },
  ticketCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  ticketSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  ticketBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ticketBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  badgePending: {
    backgroundColor: '#FEF3C7',
  },
  badgePendingText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  badgeProgress: {
    backgroundColor: '#E0F2FE',
  },
  badgeProgressText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369A1',
  },
  ticketDesc: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  ticketActionsRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  escalateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 10,
    height: 40,
    gap: 6,
  },
  escalateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  resolveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 10,
    height: 40,
    gap: 6,
  },
  resolveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.card,
  },
  formCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  formIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  formSub: {
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  categoryPillActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  priorityPillActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  priorityPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  priorityPillTextActive: {
    color: '#FFFFFF',
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
    marginTop: 22,
    ...V4_SHADOWS.card,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  resolvedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  resolvedIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resolvedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  resolvedSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
