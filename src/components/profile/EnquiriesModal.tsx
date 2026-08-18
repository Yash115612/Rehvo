import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  X,
  MessageSquareText,
  Building2,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';
import { Enquiry } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface EnquiriesModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectProperty?: (propertyId: string) => void;
}

type EnquiryTab = 'ALL' | 'NEW' | 'CONTACTED' | 'VISIT_SCHEDULED' | 'CLOSED';

const STATUS_TABS: { id: EnquiryTab; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'NEW', label: 'Pending' },
  { id: 'CONTACTED', label: 'Replied' },
  { id: 'VISIT_SCHEDULED', label: 'Visit Scheduled' },
  { id: 'CLOSED', label: 'Closed' },
];

export const EnquiriesModal: React.FC<EnquiriesModalProps> = ({
  visible,
  onClose,
  onSelectProperty,
}) => {
  const router = useRouter();
  const { enquiries, properties, startOrGetConversation, fetchEnquiries } = useAppStore();
  const [activeTab, setActiveTab] = useState<EnquiryTab>('ALL');

  React.useEffect(() => {
    if (visible) {
      fetchEnquiries();
    }
  }, [visible, fetchEnquiries]);

  const filteredEnquiries = useMemo(() => {
    if (activeTab === 'ALL') return enquiries;
    return enquiries.filter((e) => e.status === activeTab);
  }, [enquiries, activeTab]);

  const handleOpenChat = async (enquiry: Enquiry) => {
    onClose();
    const prop = properties.find((p) => p.id === enquiry.property_id);
    if (prop) {
      const convId = await startOrGetConversation(prop, enquiry.id);
      if (convId) {
        router.push(`/(renter)/chat/${convId}`);
      }
    } else {
      router.push('/(renter)/chat');
    }
  };

  const getStatusBadge = (status: Enquiry['status']) => {
    switch (status) {
      case 'NEW':
        return { label: 'Pending Reply', bg: '#FEF3C7', color: '#D97706' };
      case 'CONTACTED':
        return { label: 'Owner Replied', bg: '#DCFCE7', color: '#16A34A' };
      case 'VISIT_SCHEDULED':
        return { label: 'Visit Scheduled', bg: '#E0F2FE', color: '#0284C7' };
      case 'CLOSED':
        return { label: 'Closed', bg: '#F3F4F6', color: '#6B7280' };
      default:
        return { label: status, bg: '#F0ECFF', color: '#6C4DFF' };
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>My Enquiries</Text>
              <Text style={styles.subtitle}>
                {enquiries.length} {enquiries.length === 1 ? 'enquiry' : 'enquiries'} sent to property owners
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <X size={20} color="#171522" strokeWidth={2} />
            </Pressable>
          </View>

          {/* Status Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            {STATUS_TABS.map((tab) => {
              const count =
                tab.id === 'ALL'
                  ? enquiries.length
                  : enquiries.filter((e) => e.status === tab.id).length;
              const isActive = activeTab === tab.id;

              return (
                <Pressable
                  key={tab.id}
                  style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <Text
                    style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}
                  >
                    {tab.label}
                  </Text>
                  <View
                    style={[
                      styles.tabBadge,
                      isActive && styles.tabBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabBadgeText,
                        isActive && styles.tabBadgeTextActive,
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Enquiries List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}
          >
            {filteredEnquiries.length === 0 ? (
              <View style={styles.emptyWrap}>
                <View style={styles.emptyIconCircle}>
                  <MessageSquareText size={28} color="#6C4DFF" strokeWidth={1.8} />
                </View>
                <Text style={styles.emptyTitle}>No enquiries found</Text>
                <Text style={styles.emptyDesc}>
                  When you inquire about flats, rooms, or PGs, your conversations and responses will be organized here.
                </Text>
              </View>
            ) : (
              filteredEnquiries.map((enquiry) => {
                const badge = getStatusBadge(enquiry.status);
                const property = properties.find((p) => p.id === enquiry.property_id);

                return (
                  <View key={enquiry.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.titleWrap}>
                        <Text style={styles.propertyTitle} numberOfLines={1}>
                          {enquiry.property_title}
                        </Text>
                        <Text style={styles.propertyLocality}>
                          {property ? `${property.locality}, ${property.city}` : 'Mumbai'}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: badge.bg },
                        ]}
                      >
                        <Text
                          style={[styles.statusText, { color: badge.color }]}
                        >
                          {badge.label}
                        </Text>
                      </View>
                    </View>

                    {/* Message Snippet */}
                    <View style={styles.messageBox}>
                      <Text style={styles.messageLabel}>Your message:</Text>
                      <Text style={styles.messageText} numberOfLines={2}>
                        "{enquiry.message}"
                      </Text>
                    </View>

                    {/* Actions */}
                    <View style={styles.cardFooter}>
                      <Pressable
                        style={styles.chatBtn}
                        onPress={() => handleOpenChat(enquiry)}
                      >
                        <MessageSquareText size={15} color="#6C4DFF" strokeWidth={2.2} />
                        <Text style={styles.chatBtnText}>Open Chat</Text>
                      </Pressable>

                      {property && onSelectProperty && (
                        <Pressable
                          style={styles.viewPropertyBtn}
                          onPress={() => {
                            onClose();
                            onSelectProperty(property.id);
                          }}
                        >
                          <Text style={styles.viewPropertyBtnText}>
                            View Property
                          </Text>
                          <ArrowRight size={13} color="#777482" strokeWidth={2} />
                        </Pressable>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 21, 34, 0.48)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '86%',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#777482',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: '#F0ECFF',
    borderColor: '#6C4DFF',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#777482',
  },
  tabBtnTextActive: {
    color: '#6C4DFF',
    fontWeight: '700',
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    backgroundColor: '#E8E5EC',
  },
  tabBadgeActive: {
    backgroundColor: '#6C4DFF',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#777482',
  },
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 12,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
    gap: 8,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171522',
  },
  emptyDesc: {
    fontSize: 13,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 16,
    gap: 12,
    shadowColor: '#171522',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  titleWrap: {
    flex: 1,
    gap: 2,
  },
  propertyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.2,
  },
  propertyLocality: {
    fontSize: 12,
    color: '#777482',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  messageBox: {
    backgroundColor: '#F8F7F4',
    padding: 10,
    borderRadius: 10,
    gap: 2,
  },
  messageLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#777482',
  },
  messageText: {
    fontSize: 13,
    color: '#171522',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F0ECFF',
  },
  chatBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  viewPropertyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewPropertyBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777482',
  },
});
