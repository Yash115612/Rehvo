import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Modal,
  Linking,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Phone,
  MessageSquare,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronRight,
  Filter,
  UserCheck,
  Check,
} from 'lucide-react-native';
import { TenantLeadRecord, TenantLeadStatus } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { V4OwnerLeadCard } from '../leads/V4OwnerLeadCard';
import { useAppStore } from '../../../store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LEAD_TABS: { key: TenantLeadStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'NEW', label: 'New' },
  { key: 'CONTACTED', label: 'Contacted' },
  { key: 'VISIT_SCHEDULED', label: 'Visits' },
  { key: 'NEGOTIATION', label: 'Negotiation' },
  { key: 'CLOSED', label: 'Closed' },
  { key: 'LOST', label: 'Lost' },
];

interface V4OwnerLeadsScreenProps {
  hideHeader?: boolean;
}

export const V4OwnerLeadsScreen: React.FC<V4OwnerLeadsScreenProps> = ({ hideHeader = false }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    tenantLeads,
    updateTenantLeadStatus,
    addTenantLeadNote,
    setTenantLeadReminder,
    fetchOwnerEcosystemData,
    createOrGetLeadConversation,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<TenantLeadStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Note Modal State
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState<TenantLeadRecord | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // Schedule Visit Modal State
  const [visitModalVisible, setVisitModalVisible] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('Tomorrow, 6:00 PM');

  // Follow-up Reminder Modal State
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [reminderLead, setReminderLead] = useState<TenantLeadRecord | null>(null);
  const [selectedReminderPreset, setSelectedReminderPreset] = useState('Tomorrow, 10:00 AM');

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOwnerEcosystemData();
    setRefreshing(false);
  };

  const filteredLeads = useMemo(() => {
    return tenantLeads.filter((l) => {
      const matchTab = activeTab === 'ALL' || l.status === activeTab;
      const matchQuery =
        !searchQuery ||
        l.tenant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.property_title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchQuery;
    });
  }, [tenantLeads, activeTab, searchQuery]);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`).catch(() => {});
  };

  const handleOpenChat = async (lead: TenantLeadRecord) => {
    const convId = await createOrGetLeadConversation(lead);
    router.push(`/(owner)/chat/${convId}` as any);
  };

  const handleApprove = async (leadId: string) => {
    await updateTenantLeadStatus(leadId, 'APPROVED');
  };

  const handleReject = async (leadId: string) => {
    await updateTenantLeadStatus(leadId, 'REJECTED');
  };

  const handleOpenNoteModal = (lead: TenantLeadRecord) => {
    setSelectedLead(lead);
    setNewNoteText('');
    setNoteModalVisible(true);
  };

  const handleOpenReminderModal = (lead: TenantLeadRecord) => {
    setReminderLead(lead);
    setSelectedReminderPreset(lead.reminder_date || 'Tomorrow, 10:00 AM');
    setReminderModalVisible(true);
  };

  const handleConfirmReminder = async () => {
    if (reminderLead) {
      await setTenantLeadReminder(reminderLead.id, selectedReminderPreset);
      setReminderModalVisible(false);
    }
  };

  const handleSaveNote = async () => {
    if (selectedLead && newNoteText.trim()) {
      await addTenantLeadNote(selectedLead.id, newNoteText.trim());
      setNoteModalVisible(false);
      setNewNoteText('');
    }
  };

  const handleOpenVisitModal = (lead: TenantLeadRecord) => {
    setSelectedLead(lead);
    setVisitModalVisible(true);
  };

  const handleConfirmVisit = async () => {
    if (selectedLead) {
      await updateTenantLeadStatus(
        selectedLead.id,
        'VISIT_SCHEDULED',
        `Visit scheduled for: ${scheduledDate}`
      );
      setVisitModalVisible(false);
    }
  };

  return (
    <View style={[styles.container, !hideHeader && { paddingTop: insets.top }]}>
      {/* Top Header */}
      {!hideHeader && (
        <View style={styles.topNav}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={V4_COLORS.textPrimary} />
          </Pressable>
          <View style={styles.topNavCenter}>
            <Text style={styles.topNavTitle}>Tenant Leads CRM</Text>
            <Text style={styles.topNavSub}>{tenantLeads.length} Total Applicants</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      )}

      {/* Search Input Bar */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Search size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search leads by name or property..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {LEAD_TABS.map((tab) => {
            const active = activeTab === tab.key;
            const count =
              tab.key === 'ALL'
                ? tenantLeads.length
                : tenantLeads.filter((l) => l.status === tab.key).length;

            return (
              <Pressable
                key={tab.key}
                style={[styles.tabPill, active && styles.tabPillActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabPillText, active && styles.tabPillTextActive]}>
                  {tab.label}
                </Text>
                {count > 0 && (
                  <View style={[styles.tabBadge, active && styles.tabBadgeActive]}>
                    <Text style={[styles.tabBadgeText, active && styles.tabBadgeTextActive]}>
                      {count}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Leads List */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#0F766E" />
        }
      >
        {filteredLeads.length === 0 ? (
          <View style={styles.emptyState}>
            <UserCheck size={44} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Leads in this Stage</Text>
            <Text style={styles.emptySub}>
              Leads from interested verified tenants will appear here automatically in real time.
            </Text>
          </View>
        ) : (
          filteredLeads.map((lead) => (
            <V4OwnerLeadCard
              key={lead.id}
              lead={lead}
              onCall={handleCall}
              onChat={handleOpenChat}
              onScheduleVisit={handleOpenVisitModal}
              onOpenNotes={handleOpenNoteModal}
              onSetReminder={handleOpenReminderModal}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </ScrollView>

      {/* =====================================================================
          NOTE MODAL
         ===================================================================== */}
      <Modal
        visible={noteModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNoteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Lead Notes & Screening</Text>
              <Pressable onPress={() => setNoteModalVisible(false)}>
                <Text style={{ fontSize: 16, color: '#64748B' }}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              Notes for {selectedLead?.tenant_name} ({selectedLead?.property_title})
            </Text>

            {selectedLead?.notes ? (
              <View style={styles.existingNotesBox}>
                <Text style={styles.existingNotesText}>{selectedLead.notes}</Text>
              </View>
            ) : null}

            <TextInput
              style={styles.modalNoteInput}
              placeholder="Add observation (e.g., Prefers 2-year lock-in, pet owner)..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={newNoteText}
              onChangeText={setNewNoteText}
            />

            <View style={{ marginTop: 14 }}>
              <V4Button title="Save Note" variant="primary" onPress={handleSaveNote} />
            </View>
          </View>
        </View>
      </Modal>

      {/* =====================================================================
          SCHEDULE VISIT MODAL
         ===================================================================== */}
      <Modal
        visible={visitModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisitModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Schedule Tenant Visit</Text>
              <Pressable onPress={() => setVisitModalVisible(false)}>
                <Text style={{ fontSize: 16, color: '#64748B' }}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              Set up tour time for {selectedLead?.tenant_name}
            </Text>

            <View style={styles.slotOptionRow}>
              {[
                'Today, 5:30 PM',
                'Tomorrow, 11:00 AM',
                'Tomorrow, 6:00 PM',
                'Sunday, 12:00 PM',
              ].map((slot) => (
                <Pressable
                  key={slot}
                  style={[
                    styles.slotPill,
                    scheduledDate === slot && styles.slotPillActive,
                  ]}
                  onPress={() => setScheduledDate(slot)}
                >
                  <Text
                    style={[
                      styles.slotPillText,
                      scheduledDate === slot && styles.slotPillTextActive,
                    ]}
                  >
                    {slot}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={{ marginTop: 16 }}>
              <V4Button
                title="Confirm & Generate QR Pass"
                variant="primary"
                onPress={handleConfirmVisit}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* =====================================================================
          REMINDER PICKER MODAL
         ===================================================================== */}
      <Modal
        visible={reminderModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReminderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Set Follow-up Reminder</Text>
              <Pressable onPress={() => setReminderModalVisible(false)}>
                <Text style={{ fontSize: 16, color: '#64748B' }}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              Reminder for lead {reminderLead?.tenant_name} ({reminderLead?.property_title})
            </Text>

            <View style={styles.slotOptionRow}>
              {[
                'Today, 5:00 PM',
                'Tomorrow, 10:00 AM',
                'Tomorrow, 6:00 PM',
                'In 2 Days, 11:00 AM',
                'This Weekend',
                'Next Monday, 10:00 AM',
              ].map((preset) => (
                <Pressable
                  key={preset}
                  style={[
                    styles.slotPill,
                    selectedReminderPreset === preset && styles.slotPillActive,
                  ]}
                  onPress={() => setSelectedReminderPreset(preset)}
                >
                  <Text
                    style={[
                      styles.slotPillText,
                      selectedReminderPreset === preset && styles.slotPillTextActive,
                    ]}
                  >
                    {preset}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={{ marginTop: 16 }}>
              <V4Button
                title="Save Reminder"
                variant="primary"
                onPress={handleConfirmReminder}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNavCenter: {
    alignItems: 'center',
  },
  topNavTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  topNavSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  searchWrap: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: V4_COLORS.textPrimary,
  },
  tabsWrap: {
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabPillActive: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  tabPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tabPillTextActive: {
    color: '#FFFFFF',
  },
  tabBadge: {
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
  },
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 14,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 12,
  },
  existingNotesBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  existingNotesText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  modalNoteInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 13,
    color: V4_COLORS.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  slotOptionRow: {
    gap: 8,
  },
  slotPill: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  slotPillActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#059669',
  },
  slotPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: V4_COLORS.textPrimary,
  },
  slotPillTextActive: {
    color: '#064E3B',
    fontWeight: '800',
  },
});
