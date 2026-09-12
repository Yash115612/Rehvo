import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Dimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Plus,
  FileText,
  ShieldCheck,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  Building2,
  Check,
  AlertCircle,
} from 'lucide-react-native';
import { OwnerDocumentRecord, OwnerDocumentType } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { useAppStore } from '../../../store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DOC_TYPES: { key: OwnerDocumentType | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'All Documents' },
  { key: 'OWNERSHIP_PROOF', label: 'Sale Deeds' },
  { key: 'RENTAL_AGREEMENT', label: 'E-Leases' },
  { key: 'PROPERTY_DOC', label: 'Property Tax' },
  { key: 'NOC', label: 'Society NOC' },
  { key: 'RECEIPT', label: 'Rent Receipts' },
  { key: 'TENANT_DOC', label: 'Tenant KYC' },
];

export const V4OwnerDocumentsScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    ownerDocuments,
    uploadOwnerDocument,
    deleteOwnerDocument,
    fetchOwnerEcosystemData,
    showToast,
  } = useAppStore();

  const [activeType, setActiveType] = useState<OwnerDocumentType | 'ALL'>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  // Upload Modal State
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<OwnerDocumentType>('PROPERTY_DOC');

  // Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<OwnerDocumentRecord | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOwnerEcosystemData();
    setRefreshing(false);
  };

  const filteredDocs = useMemo(() => {
    if (activeType === 'ALL') return ownerDocuments;
    return ownerDocuments.filter((d) => d.doc_type === activeType);
  }, [ownerDocuments, activeType]);

  const handleUpload = async () => {
    if (!newTitle.trim()) {
      showToast?.('Please enter a document title', 'error');
      return;
    }

    await uploadOwnerDocument({
      title: newTitle.trim(),
      doc_type: newType,
      file_format: 'PDF',
      file_size: '2.1 MB',
      file_url: 'https://rehvo.com/vault/user-doc.pdf',
    });

    setUploadModalVisible(false);
    setNewTitle('');
  };

  const handleDelete = (docId: string, title: string) => {
    Alert.alert(
      'Remove Document',
      `Delete "${title}" from your secure vault?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteOwnerDocument(docId);
          },
        },
      ]
    );
  };

  const handleDownload = (doc: OwnerDocumentRecord) => {
    showToast?.(`Downloading "${doc.title}"...`, 'info');
    setTimeout(() => {
      showToast?.('Document saved to device storage', 'success');
    }, 1000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.topNav}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color={V4_COLORS.textPrimary} />
        </Pressable>
        <View style={styles.topNavCenter}>
          <Text style={styles.topNavTitle}>Owner Document Center</Text>
          <Text style={styles.topNavSub}>Encrypted Cloud Repository</Text>
        </View>
        <Pressable
          style={styles.addBtn}
          onPress={() => setUploadModalVisible(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Categories Filter Strip */}
      <View style={styles.categoryStripWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {DOC_TYPES.map((type) => {
            const active = activeType === type.key;
            return (
              <Pressable
                key={type.key}
                style={[styles.catPill, active && styles.catPillActive]}
                onPress={() => setActiveType(type.key)}
              >
                <Text style={[styles.catPillTxt, active && styles.catPillTxtActive]}>
                  {type.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Documents List */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#0F766E" />
        }
      >
        {filteredDocs.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText size={44} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Documents in this Folder</Text>
            <Text style={styles.emptySub}>
              Upload your property title deeds, tax receipts, or tenant KYC for encrypted storage.
            </Text>
          </View>
        ) : (
          filteredDocs.map((doc) => (
            <View key={doc.id} style={styles.docCard}>
              <View style={styles.docIconBox}>
                <FileText size={22} color="#0F766E" />
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.docTitleRow}>
                  <Text style={styles.docTitle} numberOfLines={1}>
                    {doc.title}
                  </Text>
                </View>

                {doc.property_title && (
                  <Text style={styles.docProperty} numberOfLines={1}>
                    {doc.property_title}
                  </Text>
                )}

                <View style={styles.docMetaRow}>
                  <View style={styles.docFormatPill}>
                    <Text style={styles.docFormatTxt}>{doc.file_format}</Text>
                  </View>
                  <Text style={styles.docSizeTxt}>{doc.file_size}</Text>
                  <View style={styles.verifiedBadge}>
                    <ShieldCheck size={11} color="#065F46" />
                    <Text style={styles.verifiedBadgeTxt}>VERIFIED</Text>
                  </View>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.docActionsCol}>
                <Pressable
                  style={styles.actionIconBtn}
                  onPress={() => setPreviewDoc(doc)}
                >
                  <Eye size={17} color="#0F766E" />
                </Pressable>

                <Pressable
                  style={styles.actionIconBtn}
                  onPress={() => handleDownload(doc)}
                >
                  <Download size={17} color="#0284C7" />
                </Pressable>

                <Pressable
                  style={styles.actionIconBtn}
                  onPress={() => handleDelete(doc.id, doc.title)}
                >
                  <Trash2 size={16} color="#DC2626" />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* =====================================================================
          UPLOAD DOCUMENT MODAL
         ===================================================================== */}
      <Modal
        visible={uploadModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setUploadModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Upload To Document Vault</Text>
              <Pressable onPress={() => setUploadModalVisible(false)}>
                <Text style={{ fontSize: 16, color: '#64748B' }}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              Select category and title to store in REHVO’s encrypted vault.
            </Text>

            <View style={{ gap: 12, marginVertical: 14 }}>
              <View>
                <Text style={styles.inputLabel}>Document Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Registered Sale Deed 2026"
                  placeholderTextColor="#94A3B8"
                  value={newTitle}
                  onChangeText={setNewTitle}
                />
              </View>

              <View>
                <Text style={styles.inputLabel}>Select Category</Text>
                <View style={styles.typeOptionGrid}>
                  {DOC_TYPES.filter((t) => t.key !== 'ALL').map((t) => (
                    <Pressable
                      key={t.key}
                      style={[
                        styles.typeOptionBtn,
                        newType === t.key && styles.typeOptionBtnActive,
                      ]}
                      onPress={() => setNewType(t.key as OwnerDocumentType)}
                    >
                      <Text
                        style={[
                          styles.typeOptionTxt,
                          newType === t.key && styles.typeOptionTxtActive,
                        ]}
                      >
                        {t.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              <V4Button
                title="Select File & Upload (PDF/JPG)"
                variant="primary"
                onPress={handleUpload}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* =====================================================================
          PREVIEW MODAL
         ===================================================================== */}
      <Modal
        visible={!!previewDoc}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewDoc(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.previewModalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>{previewDoc?.title}</Text>
              <Pressable onPress={() => setPreviewDoc(null)}>
                <Text style={{ fontSize: 16, color: '#64748B' }}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.previewCanvas}>
              <FileText size={64} color="#064E3B" />
              <Text style={styles.previewFileName}>{previewDoc?.title}.pdf</Text>
              <View style={styles.previewVerifiedBadge}>
                <ShieldCheck size={14} color="#065F46" />
                <Text style={styles.previewVerifiedTxt}>DIGILOCKER ENCRYPTED REPO</Text>
              </View>
              <Text style={styles.previewMeta}>
                Size: {previewDoc?.file_size} • Verified on {previewDoc?.created_at.slice(0, 10)}
              </Text>
            </View>

            <View style={{ marginTop: 16, gap: 8 }}>
              <V4Button
                title="Download Document"
                variant="primary"
                onPress={() => {
                  setPreviewDoc(null);
                  if (previewDoc) handleDownload(previewDoc);
                }}
              />
              <V4Button
                title="Close"
                variant="outline"
                onPress={() => setPreviewDoc(null)}
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
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryStripWrap: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  catPillActive: {
    backgroundColor: '#064E3B',
  },
  catPillTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  catPillTxtActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
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
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...V4_SHADOWS.soft,
  },
  docIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  docProperty: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  docMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  docFormatPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  docFormatTxt: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#475569',
  },
  docSizeTxt: {
    fontSize: 11,
    color: '#94A3B8',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedBadgeTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#065F46',
  },
  docActionsCol: {
    gap: 6,
  },
  actionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 380,
  },
  previewModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
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
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 13,
    color: V4_COLORS.textPrimary,
  },
  typeOptionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  typeOptionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  typeOptionBtnActive: {
    backgroundColor: '#064E3B',
  },
  typeOptionTxt: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  typeOptionTxtActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  previewCanvas: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#F0FDFA',
    borderRadius: 18,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  previewFileName: {
    fontSize: 15,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 10,
  },
  previewVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 8,
  },
  previewVerifiedTxt: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#065F46',
  },
  previewMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 8,
  },
});
