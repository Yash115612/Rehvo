import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import {
  Camera,
  Image as ImageIcon,
  Building2,
  Calendar,
  FileText,
  IndianRupee,
  Paperclip,
  X,
  Sparkles,
  MapPin,
  Mic,
} from 'lucide-react-native';
import { V4_SHADOWS } from '../../../theme/v4Theme';

export interface V4AttachmentAction {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  bg: string;
  onPress: () => void;
}

interface V4ChatAttachmentsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCamera: () => void;
  onSelectGallery: () => void;
  onSelectProperty: () => void;
  onSelectVisit: () => void;
  onSelectAgreement: () => void;
  onSelectRentReminder: () => void;
  onSelectDocument: () => void;
  onSelectVideo?: () => void;
  onSelectLocation?: () => void;
  onSelectVoiceNote?: () => void;
}

export const V4ChatAttachmentsModal: React.FC<V4ChatAttachmentsModalProps> = ({
  visible,
  onClose,
  onSelectCamera,
  onSelectGallery,
  onSelectVideo,
  onSelectProperty,
  onSelectVisit,
  onSelectAgreement,
  onSelectRentReminder,
  onSelectDocument,
  onSelectLocation,
  onSelectVoiceNote,
}) => {
  const actions: V4AttachmentAction[] = [
    {
      id: 'camera',
      title: 'Camera',
      subtitle: 'Capture property photo',
      icon: Camera,
      color: '#0F766E',
      bg: '#CCFBF1',
      onPress: () => {
        onClose();
        onSelectCamera();
      },
    },
    {
      id: 'gallery',
      title: 'Gallery',
      subtitle: 'Upload photo from phone',
      icon: ImageIcon,
      color: '#2563EB',
      bg: '#DBEAFE',
      onPress: () => {
        onClose();
        onSelectGallery();
      },
    },
    {
      id: 'video',
      title: 'Video Tour',
      subtitle: 'Upload walkthrough video',
      icon: Sparkles,
      color: '#7C3AED',
      bg: '#EDE9FE',
      onPress: () => {
        onClose();
        onSelectVideo?.();
      },
    },
    {
      id: 'property',
      title: 'Share Property',
      subtitle: 'Send luxury listing card',
      icon: Building2,
      color: '#059669',
      bg: '#D1FAE5',
      onPress: () => {
        onClose();
        onSelectProperty();
      },
    },
    {
      id: 'visit',
      title: 'Invite for Visit',
      subtitle: 'Schedule physical tour & QR',
      icon: Calendar,
      color: '#7C3AED',
      bg: '#EDE9FE',
      onPress: () => {
        onClose();
        onSelectVisit();
      },
    },
    {
      id: 'agreement',
      title: 'Digital E-Lease',
      subtitle: 'State-stamped 11-month draft',
      icon: FileText,
      color: '#D97706',
      bg: '#FEF3C7',
      onPress: () => {
        onClose();
        onSelectAgreement();
      },
    },
    {
      id: 'rent',
      title: 'Rent Reminder',
      subtitle: 'Request monthly rent / token',
      icon: IndianRupee,
      color: '#DC2626',
      bg: '#FEE2E2',
      onPress: () => {
        onClose();
        onSelectRentReminder();
      },
    },
    {
      id: 'document',
      title: 'Document / PDF',
      subtitle: 'Electricity bill, KYC, NOC',
      icon: Paperclip,
      color: '#0891B2',
      bg: '#CFFAFE',
      onPress: () => {
        onClose();
        onSelectDocument();
      },
    },
    {
      id: 'location',
      title: 'Location',
      subtitle: 'Share society location',
      icon: MapPin,
      color: '#0284C7',
      bg: '#E0F2FE',
      onPress: () => {
        onClose();
        onSelectLocation?.();
      },
    },
    {
      id: 'voice',
      title: 'Voice Note',
      subtitle: 'Send 30s voice clip',
      icon: Mic,
      color: '#0D9488',
      bg: '#CCFBF1',
      onPress: () => {
        onClose();
        onSelectVoiceNote?.();
      },
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {/* Sheet Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Sparkles size={16} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.headerTitle}>REHVO Chat Attachments</Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <X size={18} color="#64748B" />
            </Pressable>
          </View>

          <Text style={styles.subText}>
            Share verified properties, schedule tours, or dispatch digital rental agreements.
          </Text>

          {/* Grid of Actions */}
          <View style={styles.grid}>
            {actions.map((act) => {
              const IconComp = act.icon;
              return (
                <Pressable
                  key={act.id}
                  style={styles.gridItem}
                  onPress={act.onPress}
                >
                  <View style={[styles.iconWrap, { backgroundColor: act.bg }]}>
                    <IconComp size={20} color={act.color} strokeWidth={2.4} />
                  </View>
                  <Text style={styles.itemTitle}>{act.title}</Text>
                  <Text style={styles.itemSubtitle} numberOfLines={1}>
                    {act.subtitle}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    paddingBottom: 36,
    ...V4_SHADOWS.floating,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '31%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  itemSubtitle: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
});
