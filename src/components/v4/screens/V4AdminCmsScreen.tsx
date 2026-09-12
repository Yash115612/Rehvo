import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Sliders,
  Bell,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Shield,
  Plus,
  Radio,
  ExternalLink,
  ChevronRight,
  Eye,
  AlertCircle,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import {
  getFeatureFlags,
  updateFeatureFlag,
  getCmsAnnouncements,
  createCmsAnnouncement,
  getCmsBanners,
  togglePropertyApproval,
} from '../../../services/adminCms';
import { FeatureFlag, CmsAnnouncement, CmsBanner } from '../../../types';

type AdminTab = 'flags' | 'announcements' | 'banners' | 'moderation';

export const V4AdminCmsScreenComponent: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('flags');
  const [loading, setLoading] = useState(true);
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [announcements, setAnnouncements] = useState<CmsAnnouncement[]>([]);
  const [banners, setBanners] = useState<CmsBanner[]>([]);

  // Announcement Modal
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedFlags, fetchedAnn, fetchedBanners] = await Promise.all([
        getFeatureFlags(),
        getCmsAnnouncements('all'),
        getCmsBanners('home'),
      ]);
      setFlags(fetchedFlags);
      setAnnouncements(fetchedAnn);
      setBanners(fetchedBanners);
    } catch {
      // safe fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleFlag = useCallback(
    async (key: string, currentValue: boolean) => {
      const newValue = !currentValue;
      setFlags((prev) =>
        prev.map((f) => (f.key === key ? { ...f, enabled: newValue } : f))
      );
      const success = await updateFeatureFlag(key, newValue);
      if (success) {
        showToast(`Feature flag "${key}" updated`, 'success');
      } else {
        showToast(`Could not update feature flag`, 'error');
      }
    },
    [showToast]
  );

  const handleCreateAnnouncement = useCallback(async () => {
    if (!newTitle.trim() || !newBody.trim()) {
      showToast('Title and body are required', 'error');
      return;
    }

    const success = await createCmsAnnouncement({
      title: newTitle.trim(),
      body: newBody.trim(),
      audience: 'all',
      priority: newPriority,
      start_date: new Date().toISOString(),
      is_active: true,
    });

    if (success) {
      showToast('Broadcast published globally', 'success');
      setCreateModalVisible(false);
      setNewTitle('');
      setNewBody('');
      loadData();
    } else {
      showToast('Failed to create announcement', 'error');
    }
  }, [newTitle, newBody, newPriority, showToast, loadData]);

  const handleApproveListing = useCallback(
    async (propId: string, title: string) => {
      const success = await togglePropertyApproval(propId, true);
      if (success) {
        showToast(`Property "${title}" approved and verified!`, 'success');
      }
    },
    [showToast]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={V4_COLORS.textPrimary} />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Admin CMS & Control OS</Text>
          <Text style={styles.headerSubtitle}>Remote Config, Moderation & Broadcasts</Text>
        </View>
        <View style={styles.headerBadge}>
          <Shield size={18} color={V4_COLORS.primary} />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {[
          { key: 'flags', label: 'Feature Flags', icon: Sliders },
          { key: 'announcements', label: 'Broadcasts', icon: Bell },
          { key: 'banners', label: 'Banners', icon: ImageIcon },
          { key: 'moderation', label: 'Moderation', icon: CheckCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => setActiveTab(tab.key as AdminTab)}
              accessibilityRole="tab"
            >
              <Icon size={16} color={isActive ? V4_COLORS.primary : V4_COLORS.textSecondary} />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={V4_COLORS.primary} />
          <Text style={styles.loaderText}>Syncing Admin Gateway...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Tab 1: Feature Flags */}
          {activeTab === 'flags' && (
            <View>
              <Text style={styles.sectionHeader}>RUNTIME FEATURE FLAGS ({flags.length})</Text>
              <View style={styles.card}>
                {flags.map((flag, idx) => (
                  <React.Fragment key={flag.key}>
                    {idx > 0 && <View style={styles.divider} />}
                    <View style={styles.flagRow}>
                      <View style={styles.flagInfo}>
                        <View style={styles.flagTitleRow}>
                          <Text style={styles.flagKey}>{flag.key}</Text>
                          <View style={styles.rolloutPill}>
                            <Text style={styles.rolloutPillText}>{flag.rollout_percentage}% LIVE</Text>
                          </View>
                        </View>
                        <Text style={styles.flagDesc}>
                          {flag.description || 'System controlled remote toggle'}
                        </Text>
                      </View>
                      <Switch
                        value={flag.enabled}
                        onValueChange={() => handleToggleFlag(flag.key, flag.enabled)}
                        trackColor={{ false: V4_COLORS.surfaceMuted, true: V4_COLORS.primary }}
                        thumbColor={V4_COLORS.surface}
                      />
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </View>
          )}

          {/* Tab 2: Announcements */}
          {activeTab === 'announcements' && (
            <View>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeader}>SYSTEM BROADCASTS ({announcements.length})</Text>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => setCreateModalVisible(true)}
                  accessibilityRole="button"
                >
                  <Plus size={16} color={V4_COLORS.textWhite} />
                  <Text style={styles.actionButtonText}>New Broadcast</Text>
                </Pressable>
              </View>

              <View style={styles.card}>
                {announcements.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    {idx > 0 && <View style={styles.divider} />}
                    <View style={styles.announcementCard}>
                      <View style={styles.annHeaderRow}>
                        <View
                          style={[
                            styles.priorityPill,
                            {
                              backgroundColor:
                                item.priority === 'critical' || item.priority === 'high'
                                  ? V4_COLORS.dangerLight
                                  : V4_COLORS.primaryLight,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.priorityPillText,
                              {
                                color:
                                  item.priority === 'critical' || item.priority === 'high'
                                    ? V4_COLORS.danger
                                    : V4_COLORS.primary,
                              },
                            ]}
                          >
                            {item.priority.toUpperCase()}
                          </Text>
                        </View>
                        <Text style={styles.audienceText}>Audience: {item.audience}</Text>
                      </View>
                      <Text style={styles.annTitle}>{item.title}</Text>
                      <Text style={styles.annBody}>{item.body}</Text>
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </View>
          )}

          {/* Tab 3: Banners */}
          {activeTab === 'banners' && (
            <View>
              <Text style={styles.sectionHeader}>HOMEPAGE HERO BANNERS ({banners.length})</Text>
              <View style={styles.card}>
                {banners.map((ban, idx) => (
                  <React.Fragment key={ban.id}>
                    {idx > 0 && <View style={styles.divider} />}
                    <View style={styles.bannerRow}>
                      <View style={styles.bannerDetails}>
                        <View style={styles.bannerMeta}>
                          <Text style={styles.bannerOrder}>Order #{ban.display_order}</Text>
                          <View style={styles.activePill}>
                            <Text style={styles.activePillText}>ACTIVE</Text>
                          </View>
                        </View>
                        <Text style={styles.bannerTitle}>{ban.title}</Text>
                        <Text style={styles.bannerSubtitle}>{ban.subtitle}</Text>
                        <Text style={styles.bannerCta}>CTA: {ban.cta_text} → {ban.cta_link}</Text>
                      </View>
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </View>
          )}

          {/* Tab 4: Moderation Queue */}
          {activeTab === 'moderation' && (
            <View>
              <Text style={styles.sectionHeader}>PENDING PROPERTY AUDIT QUEUE</Text>
              <View style={styles.card}>
                {[
                  {
                    id: 'prop_pending_01',
                    title: 'Sea-Facing 2BHK Carter Road',
                    locality: 'Bandra West, Mumbai',
                    owner: 'Ramesh Shah (Verified Owner)',
                    rent: '₹85,000/mo',
                  },
                  {
                    id: 'prop_pending_02',
                    title: 'Furnished Studio near One BKC',
                    locality: 'BKC, Mumbai',
                    owner: 'Pooja Mehta (Verified Owner)',
                    rent: '₹48,000/mo',
                  },
                ].map((item, idx) => (
                  <React.Fragment key={item.id}>
                    {idx > 0 && <View style={styles.divider} />}
                    <View style={styles.moderationRow}>
                      <View style={styles.moderationDetails}>
                        <Text style={styles.moderationTitle}>{item.title}</Text>
                        <Text style={styles.moderationLoc}>{item.locality}</Text>
                        <Text style={styles.moderationOwner}>{item.owner} • {item.rent}</Text>
                      </View>
                      <View style={styles.moderationActions}>
                        <Pressable
                          style={[styles.modButton, styles.modButtonApprove]}
                          onPress={() => handleApproveListing(item.id, item.title)}
                        >
                          <CheckCircle size={16} color={V4_COLORS.textWhite} />
                          <Text style={styles.modButtonApproveText}>Approve</Text>
                        </Pressable>
                      </View>
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* Create Broadcast Modal */}
      <Modal visible={createModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Create Global Announcement</Text>
            <Text style={styles.modalSubheading}>
              Broadcast will appear on user dashboards in real-time.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.modalInput}
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="e.g., Festival Rent Cashback 10%"
                placeholderTextColor={V4_COLORS.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Body Message</Text>
              <TextInput
                style={[styles.modalInput, { height: 80 }]}
                value={newBody}
                onChangeText={setNewBody}
                placeholder="Enter complete broadcast message..."
                placeholderTextColor={V4_COLORS.textMuted}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.priorityOptions}>
                {(['low', 'medium', 'high', 'critical'] as const).map((p) => (
                  <Pressable
                    key={p}
                    style={[
                      styles.priorityOptionPill,
                      newPriority === p && styles.priorityOptionPillActive,
                    ]}
                    onPress={() => setNewPriority(p)}
                  >
                    <Text
                      style={[
                        styles.priorityOptionText,
                        newPriority === p && styles.priorityOptionTextActive,
                      ]}
                    >
                      {p.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelModalBtn}
                onPress={() => setCreateModalVisible(false)}
              >
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </Pressable>

              <Pressable style={styles.submitModalBtn} onPress={handleCreateAnnouncement}>
                <Text style={styles.submitModalBtnText}>Publish Broadcast</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const V4AdminCmsScreen = React.memo(V4AdminCmsScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: V4_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: V4_COLORS.border,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: V4_RADIUS.full,
    backgroundColor: V4_COLORS.surfaceSubtle,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  headerBadge: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: V4_COLORS.primaryLight,
    borderRadius: V4_RADIUS.full,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: V4_COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: V4_COLORS.border,
    gap: 8,
  },
  tabItem: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: V4_RADIUS.md,
    gap: 6,
  },
  tabItemActive: {
    backgroundColor: V4_COLORS.primaryLight,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  tabLabelActive: {
    color: V4_COLORS.primary,
    fontWeight: '700',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: V4_COLORS.textSecondary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    backgroundColor: V4_COLORS.primary,
    paddingHorizontal: 12,
    borderRadius: V4_RADIUS.md,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textWhite,
  },
  card: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.lg,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    paddingHorizontal: 16,
    marginBottom: 20,
    ...V4_SHADOWS.sm,
  },
  divider: {
    height: 1,
    backgroundColor: V4_COLORS.borderLight,
  },
  flagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingVertical: 12,
  },
  flagInfo: {
    flex: 1,
    marginRight: 12,
  },
  flagTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flagKey: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  rolloutPill: {
    backgroundColor: V4_COLORS.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: V4_RADIUS.xs,
  },
  rolloutPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: V4_COLORS.primary,
  },
  flagDesc: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  announcementCard: {
    paddingVertical: 14,
  },
  annHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  priorityPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: V4_RADIUS.sm,
  },
  priorityPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  audienceText: {
    fontSize: 11,
    color: V4_COLORS.textMuted,
  },
  annTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginBottom: 4,
  },
  annBody: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    lineHeight: 18,
  },
  bannerRow: {
    paddingVertical: 14,
  },
  bannerDetails: {
    flex: 1,
  },
  bannerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  bannerOrder: {
    fontSize: 11,
    fontWeight: '700',
    color: V4_COLORS.primary,
  },
  activePill: {
    backgroundColor: V4_COLORS.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: V4_RADIUS.xs,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '700',
    color: V4_COLORS.success,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
  },
  bannerCta: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.textMuted,
    marginTop: 4,
  },
  moderationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 70,
    paddingVertical: 12,
  },
  moderationDetails: {
    flex: 1,
    marginRight: 12,
  },
  moderationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  moderationLoc: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  moderationOwner: {
    fontSize: 11,
    fontWeight: '600',
    color: V4_COLORS.primary,
    marginTop: 2,
  },
  moderationActions: {
    flexDirection: 'row',
  },
  modButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: V4_RADIUS.md,
    gap: 4,
  },
  modButtonApprove: {
    backgroundColor: V4_COLORS.primary,
  },
  modButtonApproveText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.textWhite,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.xl,
    padding: 24,
    ...V4_SHADOWS.lg,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  modalSubheading: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
    marginBottom: 6,
  },
  modalInput: {
    minHeight: 46,
    backgroundColor: V4_COLORS.surfaceSubtle,
    borderRadius: V4_RADIUS.md,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    paddingHorizontal: 14,
    fontSize: 14,
    color: V4_COLORS.textPrimary,
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOptionPill: {
    flex: 1,
    minHeight: 44,
    borderRadius: V4_RADIUS.md,
    backgroundColor: V4_COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: V4_COLORS.border,
  },
  priorityOptionPillActive: {
    backgroundColor: V4_COLORS.primaryLight,
    borderColor: V4_COLORS.primary,
  },
  priorityOptionText: {
    fontSize: 11,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  priorityOptionTextActive: {
    color: V4_COLORS.primary,
    fontWeight: '700',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelModalBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: V4_RADIUS.md,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelModalBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  submitModalBtn: {
    flex: 2,
    minHeight: 48,
    borderRadius: V4_RADIUS.md,
    backgroundColor: V4_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitModalBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textWhite,
  },
});
