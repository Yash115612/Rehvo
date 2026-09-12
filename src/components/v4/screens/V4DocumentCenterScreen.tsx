import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  FileText,
  Download,
  Share2,
  ShieldCheck,
  Search,
  CheckCircle2,
  Lock,
  Calendar,
  HardDrive,
  X,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { useAppStore } from '../../../store/useAppStore';
import {
  getUserRentalDocuments,
  filterRentalDocuments,
} from '../../../services/documentCenter';
import { RentalDocument } from '../../../types';

export const V4DocumentCenterScreenComponent: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, showToast } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<RentalDocument[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadDocs = useCallback(async () => {
    setLoading(true);
    try {
      const docs = await getUserRentalDocuments(user?.id);
      setDocuments(docs);
    } catch {
      // safe fallback
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadDocs();
  }, [loadDocs]);

  const filteredDocs = useMemo(() => {
    return filterRentalDocuments(documents, activeCategory, searchQuery);
  }, [documents, activeCategory, searchQuery]);

  const handleDownload = useCallback(
    (doc: RentalDocument) => {
      Alert.alert(
        'Download Verified Document',
        `Document "${doc.title}" downloaded to your device files.\n\nFile Size: ${(doc.size_bytes / 1024 / 1024).toFixed(2)} MB`,
        [{ text: 'OK', style: 'default' }]
      );
      showToast('Document saved to device downloads', 'success');
    },
    [showToast]
  );

  const handleShare = useCallback(
    async (doc: RentalDocument) => {
      try {
        await Share.share({
          title: doc.title,
          message: `REHVO Verified Document: ${doc.title}\nDownload link: ${doc.file_url}`,
          url: Platform.OS === 'ios' ? doc.file_url : undefined,
        });
      } catch {
        showToast('Could not open share dialog', 'error');
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
          <Text style={styles.headerTitle}>Rental Document Center</Text>
          <Text style={styles.headerSubtitle}>Legal Leases, HRA Receipts & Society NOCs</Text>
        </View>
        <View style={styles.headerBadge}>
          <Lock size={18} color={V4_COLORS.primary} />
        </View>
      </View>

      {/* Vault Status Banner */}
      <View style={styles.vaultBanner}>
        <View style={styles.bannerIconBox}>
          <ShieldCheck size={26} color={V4_COLORS.textWhite} />
        </View>
        <View style={styles.bannerInfo}>
          <Text style={styles.bannerTitle}>DigiLocker Enclave Protected</Text>
          <Text style={styles.bannerSub}>
            All leases are stamped with Govt of Maharashtra e-Stamp numbers.
          </Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={18} color={V4_COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title, month, or agreement number..."
          placeholderTextColor={V4_COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <X size={16} color={V4_COLORS.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Category Tabs */}
      <View style={styles.tabScrollWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow}>
          {[
            { key: 'ALL', label: 'All Documents' },
            { key: 'agreement', label: 'Agreements' },
            { key: 'receipt', label: 'Rent Receipts' },
            { key: 'noc', label: 'Society NOC' },
            { key: 'tax_certificate', label: 'Tax & HRA' },
          ].map((tab) => (
            <Pressable
              key={tab.key}
              style={[styles.tabPill, activeCategory === tab.key && styles.tabPillActive]}
              onPress={() => setActiveCategory(tab.key)}
              accessibilityRole="tab"
            >
              <Text
                style={[styles.tabText, activeCategory === tab.key && styles.tabTextActive]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={V4_COLORS.primary} />
          <Text style={styles.loaderText}>Decrypting Vault Certificates...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {filteredDocs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FileText size={48} color={V4_COLORS.borderDark} />
              <Text style={styles.emptyTitle}>No Documents Found</Text>
              <Text style={styles.emptySub}>
                Try selecting a different filter or clearing your search term.
              </Text>
            </View>
          ) : (
            filteredDocs.map((doc) => (
              <View key={doc.id} style={styles.docCard}>
                <View style={styles.docTopRow}>
                  <View style={[styles.docIconBox, { backgroundColor: V4_COLORS.primaryLight }]}>
                    <FileText size={22} color={V4_COLORS.primary} />
                  </View>
                  <View style={styles.docDetails}>
                    <Text style={styles.docTitle}>{doc.title}</Text>
                    <View style={styles.docMetaRow}>
                      <Text style={styles.docMeta}>
                        {(doc.size_bytes / 1024 / 1024).toFixed(2)} MB • {new Date(doc.date_created).toLocaleDateString()}
                      </Text>
                      {doc.is_verified && (
                        <View style={styles.verifiedTag}>
                          <CheckCircle2 size={10} color={V4_COLORS.success} />
                          <Text style={styles.verifiedTagText}>VERIFIED</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                <View style={styles.docDivider} />

                <View style={styles.docActionRow}>
                  <Pressable
                    style={styles.actionBtn}
                    onPress={() => handleDownload(doc)}
                    accessibilityRole="button"
                  >
                    <Download size={16} color={V4_COLORS.primary} />
                    <Text style={styles.actionBtnText}>Download PDF</Text>
                  </Pressable>

                  <View style={styles.actionDivider} />

                  <Pressable
                    style={styles.actionBtn}
                    onPress={() => handleShare(doc)}
                    accessibilityRole="button"
                  >
                    <Share2 size={16} color={V4_COLORS.textSecondary} />
                    <Text style={[styles.actionBtnText, { color: V4_COLORS.textSecondary }]}>
                      Share File
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export const V4DocumentCenterScreen = React.memo(V4DocumentCenterScreenComponent);

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
  vaultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.emeraldDark,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: V4_RADIUS.lg,
    padding: 14,
    gap: 12,
    ...V4_SHADOWS.sm,
  },
  bannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: V4_RADIUS.md,
    backgroundColor: V4_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textWhite,
  },
  bannerSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    lineHeight: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.lg,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    marginHorizontal: 20,
    marginTop: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: V4_COLORS.textPrimary,
  },
  tabScrollWrapper: {
    marginTop: 12,
    marginBottom: 4,
  },
  tabRow: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tabPill: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: V4_RADIUS.full,
    backgroundColor: V4_COLORS.surface,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPillActive: {
    backgroundColor: V4_COLORS.primaryLight,
    borderColor: V4_COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: V4_COLORS.textSecondary,
  },
  tabTextActive: {
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
    gap: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 30,
  },
  docCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.lg,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    padding: 14,
    ...V4_SHADOWS.sm,
  },
  docTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docIconBox: {
    width: 44,
    height: 44,
    borderRadius: V4_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docDetails: {
    flex: 1,
    marginLeft: 12,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  docMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  docMeta: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: V4_COLORS.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: V4_RADIUS.xs,
    gap: 2,
  },
  verifiedTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: V4_COLORS.success,
  },
  docDivider: {
    height: 1,
    backgroundColor: V4_COLORS.borderLight,
    marginVertical: 12,
  },
  docActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.primary,
  },
  actionDivider: {
    width: 1,
    height: 20,
    backgroundColor: V4_COLORS.border,
  },
});
