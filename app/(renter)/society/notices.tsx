import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bell,
  Pin,
  Calendar,
  Download,
  CheckCircle2,
  ChevronRight,
  Filter,
  X,
  FileText,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../src/theme/v4Theme';
import { triggerHapticFeedback } from '../../../src/utils/haptics';
import { SocietyNoticeRecord } from '../../../src/types';

export default function SocietyNoticesRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    properties,
    leaseAgreements,
    societyNotices,
    fetchSocietyNotices,
    showToast,
  } = useAppStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNotice, setSelectedNotice] = useState<SocietyNoticeRecord | null>(null);

  const activeLease = useMemo(
    () => leaseAgreements?.find((l) => l.status === 'active') || leaseAgreements?.[0],
    [leaseAgreements]
  );
  const activeProperty = useMemo(
    () => properties?.find((p) => p.id === activeLease?.property_id) || properties?.[0],
    [properties, activeLease]
  );

  const societyName = activeProperty?.society_name || activeProperty?.title || 'Prestige Green Gables';

  useEffect(() => {
    fetchSocietyNotices(societyName);
  }, [societyName]);

  const categories = [
    { id: 'all', label: 'All Notices' },
    { id: 'general', label: 'General' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'events', label: 'Events' },
    { id: 'emergency', label: 'Emergency' },
  ];

  const filteredNotices = useMemo(() => {
    if (selectedCategory === 'all') return societyNotices;
    return societyNotices.filter((n) => n.category === selectedCategory);
  }, [societyNotices, selectedCategory]);

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
          <Text style={styles.headerTitle}>Digital Notice Board</Text>
          <Text style={styles.headerSubtitle}>{societyName}</Text>
        </View>
      </View>

      {/* Categories Horizontal Scroll */}
      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              style={[styles.filterPill, selectedCategory === cat.id && styles.filterPillActive]}
              onPress={() => {
                triggerHapticFeedback('selection');
                setSelectedCategory(cat.id);
              }}
            >
              <Text style={[styles.filterPillText, selectedCategory === cat.id && styles.filterPillTextActive]}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredNotices.length === 0 ? (
          <View style={styles.emptyCard}>
            <Bell size={44} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No Notices Published</Text>
            <Text style={styles.emptySubtitle}>You are completely up to date with society news</Text>
          </View>
        ) : (
          filteredNotices.map((notice) => (
            <Pressable
              key={notice.id}
              style={[styles.noticeCard, notice.is_pinned && styles.noticeCardPinned]}
              onPress={() => {
                triggerHapticFeedback('selection');
                setSelectedNotice(notice);
              }}
            >
              <View style={styles.noticeCardHeader}>
                {notice.is_pinned ? (
                  <View style={styles.pinnedBadge}>
                    <Pin size={12} color="#B45309" />
                    <Text style={styles.pinnedBadgeText}>PINNED NOTICE</Text>
                  </View>
                ) : (
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{notice.category.toUpperCase()}</Text>
                  </View>
                )}
                <Text style={styles.noticeDate}>
                  {new Date(notice.created_at).toLocaleDateString()}
                </Text>
              </View>

              <Text style={styles.noticeTitle}>{notice.title}</Text>
              <Text style={styles.noticeContent} numberOfLines={2}>
                {notice.content}
              </Text>

              <View style={styles.noticeFooter}>
                <Text style={styles.noticeAuthor}>Published by Society Office</Text>
                <View style={styles.readMoreRow}>
                  <Text style={styles.readMoreText}>Read Details</Text>
                  <ChevronRight size={14} color="#0F766E" />
                </View>
              </View>
            </Pressable>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Notice Detail Modal */}
      <Modal visible={!!selectedNotice} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <View style={styles.modalCategoryRow}>
                  {selectedNotice?.is_pinned && (
                    <View style={styles.pinnedBadge}>
                      <Pin size={12} color="#B45309" />
                      <Text style={styles.pinnedBadgeText}>PINNED</Text>
                    </View>
                  )}
                  <Text style={styles.modalNoticeDate}>
                    {selectedNotice && new Date(selectedNotice.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.modalTitle}>{selectedNotice?.title}</Text>
              </View>
              <Pressable
                onPress={() => setSelectedNotice(null)}
                style={styles.modalCloseBtn}
              >
                <X size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 350, marginVertical: 14 }}>
              <Text style={styles.modalNoticeBody}>{selectedNotice?.content}</Text>
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.downloadBtn}
                onPress={() => {
                  triggerHapticFeedback('notificationSuccess');
                  showToast?.('Official notice PDF downloaded', 'success');
                  setSelectedNotice(null);
                }}
              >
                <Download size={16} color="#FFFFFF" />
                <Text style={styles.downloadBtnText}>Download Official PDF</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  filterWrap: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: '#0F766E',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    gap: 12,
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
  noticeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    ...V4_SHADOWS.card,
  },
  noticeCardPinned: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFDF5',
  },
  noticeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pinnedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  noticeDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  noticeContent: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  noticeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    marginTop: 4,
  },
  noticeAuthor: {
    fontSize: 11,
    color: '#94A3B8',
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 14,
  },
  modalCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  modalNoticeDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  modalNoticeBody: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  modalActions: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 14,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 12,
    height: 46,
    gap: 8,
  },
  downloadBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
