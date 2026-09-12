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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageSquare,
  ShieldCheck,
  Calendar,
  IndianRupee,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Clock,
  X,
  Sparkles,
} from 'lucide-react-native';
import { V4_COLORS, V4_SHADOWS, V4_RADIUS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { useAppStore } from '../../../store/useAppStore';
import { BrokerClientLead } from '../../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PipelineStage = 'ALL' | 'NEW' | 'CONTACTED' | 'VIEWING_SCHEDULED' | 'NEGOTIATION' | 'CLOSED_WON' | 'LOST';

const PIPELINE_STAGES: { id: PipelineStage; label: string; color: string; bg: string }[] = [
  { id: 'ALL', label: 'All Leads', color: '#0F172A', bg: '#F1F5F9' },
  { id: 'NEW', label: 'New Inquiries', color: '#2563EB', bg: '#EFF6FF' },
  { id: 'VIEWING_SCHEDULED', label: 'Site Visits', color: '#7C3AED', bg: '#F5F3FF' },
  { id: 'NEGOTIATION', label: 'Negotiation', color: '#D97706', bg: '#FEF3C7' },
  { id: 'CLOSED_WON', label: 'Closed Won', color: '#059669', bg: '#D1FAE5' },
];

export const V4BrokerClientsScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    brokerClients,
    updateBrokerClientStage,
    showToast,
  } = useAppStore();

  const [selectedStage, setSelectedStage] = useState<PipelineStage>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lead Form State
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newLocality, setNewLocality] = useState('');
  const [newBudget, setNewBudget] = useState('');

  const filteredClients = useMemo(() => {
    return (brokerClients || []).filter((client) => {
      const matchesSearch =
        client.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.requirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.preferred_locations || []).some((loc) =>
          loc.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesStage = selectedStage === 'ALL' || client.stage === selectedStage;
      return matchesSearch && matchesStage;
    });
  }, [brokerClients, searchQuery, selectedStage]);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      showToast('Could not initiate call', 'error');
    });
  };

  const handleStageChange = async (client: BrokerClientLead, nextStage: BrokerClientLead['stage']) => {
    await updateBrokerClientStage(client.id, nextStage);
    showToast(`Updated ${client.client_name}'s stage to ${nextStage.replace('_', ' ')}`, 'success');
  };

  const handleAddClientSubmit = () => {
    if (!newClientName.trim() || !newClientPhone.trim()) {
      showToast('Please enter client name and phone number', 'error');
      return;
    }
    showToast(`Lead for ${newClientName} added to CRM!`, 'success');
    setShowAddModal(false);
    setNewClientName('');
    setNewClientPhone('');
    setNewRequirement('');
    setNewLocality('');
    setNewBudget('');
  };

  return (
    <View style={styles.root}>
      {/* SEARCH AND ADD BAR */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBox}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            placeholder="Search leads by name, locality, BHK..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        <Pressable style={styles.addClientBtn} onPress={() => setShowAddModal(true)}>
          <Plus size={18} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.addClientBtnTxt}>Lead</Text>
        </Pressable>
      </View>

      {/* HORIZONTAL PIPELINE STAGES SCROLL */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stagesScroll}
      >
        {PIPELINE_STAGES.map((stage) => {
          const isActive = selectedStage === stage.id;
          const count =
            stage.id === 'ALL'
              ? (brokerClients || []).length
              : (brokerClients || []).filter((c) => c.stage === stage.id).length;

          return (
            <Pressable
              key={stage.id}
              style={[
                styles.stagePill,
                isActive && { backgroundColor: '#064E3B' },
              ]}
              onPress={() => setSelectedStage(stage.id)}
            >
              <Text
                style={[
                  styles.stagePillLabel,
                  isActive && { color: '#FFFFFF', fontWeight: '800' },
                ]}
              >
                {stage.label} ({count})
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* CLIENTS LIST */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: insets.bottom + 110 },
        ]}
      >
        {filteredClients.map((client) => {
          const currentStageMeta =
            PIPELINE_STAGES.find((s) => s.id === client.stage) || PIPELINE_STAGES[1];

          return (
            <View key={client.id} style={styles.clientCard}>
              {/* Top Row: Client Info + Status */}
              <View style={styles.clientHeader}>
                <Image
                  source={{
                    uri:
                      client.client_avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                  }}
                  style={styles.avatar}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.clientName}>{client.client_name}</Text>
                    {client.is_verified && (
                      <View style={styles.verifiedBadge}>
                        <ShieldCheck size={12} color="#059669" />
                        <Text style={styles.verifiedBadgeTxt}>KYC</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.clientPhone}>{client.client_phone}</Text>
                </View>

                {/* Stage Badge */}
                <View style={[styles.stageCardBadge, { backgroundColor: currentStageMeta.bg }]}>
                  <Text style={[styles.stageCardBadgeTxt, { color: currentStageMeta.color }]}>
                    {client.stage.replace('_', ' ')}
                  </Text>
                </View>
              </View>

              {/* Requirement & Preferences */}
              <View style={styles.requirementBox}>
                <Text style={styles.requirementTitle}>Requirement:</Text>
                <Text style={styles.requirementDesc}>{client.requirement}</Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <MapPin size={13} color="#64748B" />
                    <Text style={styles.metaTxt}>
                      {(client.preferred_locations || []).join(', ')}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <IndianRupee size={13} color="#065F46" />
                    <Text style={[styles.metaTxt, { color: '#065F46', fontWeight: '800' }]}>
                      ₹{(client.budget_min / 1000).toFixed(0)}k - ₹
                      {(client.budget_max / 1000).toFixed(0)}k/mo
                    </Text>
                  </View>
                </View>

                {client.notes && (
                  <View style={styles.notesBox}>
                    <Text style={styles.notesTxt}>“{client.notes}”</Text>
                  </View>
                )}
              </View>

              {/* Stage Transition Bar */}
              <View style={styles.stageMoveSection}>
                <Text style={styles.stageMoveTitle}>Move Stage:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stageMoveScroll}>
                  {[
                    { stage: 'NEW', label: 'New' },
                    { stage: 'VIEWING_SCHEDULED', label: 'Visit' },
                    { stage: 'NEGOTIATION', label: 'Negotiation' },
                    { stage: 'CLOSED_WON', label: 'Won 🎉' },
                  ].map((s) => (
                    <Pressable
                      key={s.stage}
                      style={[
                        styles.stageMoveChip,
                        client.stage === s.stage && styles.stageMoveChipActive,
                      ]}
                      onPress={() => handleStageChange(client, s.stage as any)}
                    >
                      <Text
                        style={[
                          styles.stageMoveChipTxt,
                          client.stage === s.stage && styles.stageMoveChipTxtActive,
                        ]}
                      >
                        {s.label}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* Contact Actions */}
              <View style={styles.actionsRow}>
                <Pressable
                  style={styles.actionCallBtn}
                  onPress={() => handleCall(client.client_phone)}
                >
                  <Phone size={14} color="#065F46" />
                  <Text style={styles.actionCallBtnTxt}>Call</Text>
                </Pressable>

                <Pressable
                  style={styles.actionChatBtn}
                  onPress={() => router.push('/(broker)/messages' as any)}
                >
                  <MessageSquare size={14} color="#5B21B6" />
                  <Text style={styles.actionChatBtnTxt}>Chat & Send Flats</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* ADD LEAD MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Client Lead</Text>
              <Pressable onPress={() => setShowAddModal(false)} hitSlop={8}>
                <X size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Client Full Name *</Text>
                <TextInput
                  placeholder="e.g. Siddharth Sen"
                  placeholderTextColor="#94A3B8"
                  value={newClientName}
                  onChangeText={setNewClientName}
                  style={styles.textInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mobile Number *</Text>
                <TextInput
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#94A3B8"
                  value={newClientPhone}
                  onChangeText={setNewClientPhone}
                  keyboardType="phone-pad"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Requirement (BHK / Type)</Text>
                <TextInput
                  placeholder="e.g. 3 BHK Sea View Apartment"
                  placeholderTextColor="#94A3B8"
                  value={newRequirement}
                  onChangeText={setNewRequirement}
                  style={styles.textInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Preferred Locality</Text>
                <TextInput
                  placeholder="e.g. Bandra West, Worli, BKC"
                  placeholderTextColor="#94A3B8"
                  value={newLocality}
                  onChangeText={setNewLocality}
                  style={styles.textInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Budget Range</Text>
                <TextInput
                  placeholder="e.g. ₹1.5L - ₹2.5L / mo"
                  placeholderTextColor="#94A3B8"
                  value={newBudget}
                  onChangeText={setNewBudget}
                  style={styles.textInput}
                />
              </View>
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <V4Button
                label="Save Client Lead"
                variant="primary"
                fullWidth
                onPress={handleAddClientSubmit}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
  },
  addClientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#064E3B',
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 14,
    ...V4_SHADOWS.soft,
  },
  addClientBtnTxt: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  stagesScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  stagePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stagePillLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  clientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...V4_SHADOWS.soft,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  verifiedBadgeTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#065F46',
  },
  clientPhone: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  stageCardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stageCardBadgeTxt: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  requirementBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    gap: 6,
  },
  requirementTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  requirementDesc: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaTxt: {
    fontSize: 11.5,
    color: '#475569',
  },
  notesBox: {
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0F766E',
  },
  notesTxt: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
  },
  stageMoveSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  stageMoveTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  stageMoveScroll: {
    flexGrow: 0,
  },
  stageMoveChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    marginRight: 6,
  },
  stageMoveChipActive: {
    backgroundColor: '#064E3B',
  },
  stageMoveChipTxt: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  stageMoveChipTxtActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  actionCallBtnTxt: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#065F46',
  },
  actionChatBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FAF5FF',
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  actionChatBtnTxt: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#5B21B6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    ...V4_SHADOWS.card,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 13.5,
    color: '#0F172A',
  },
  modalBtnRow: {
    marginTop: 14,
  },
});
