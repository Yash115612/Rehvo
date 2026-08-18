import React, { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { X, Calendar, Clock, MapPin, CheckCircle2, Clock3, XCircle } from 'lucide-react-native';
import { Visit } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface VisitsModalProps {
  visible: boolean;
  visits?: Visit[];
  onClose: () => void;
  onSelectProperty?: (propertyId: string) => void;
}

export const VisitsModal: React.FC<VisitsModalProps> = ({
  visible,
  visits: propVisits,
  onClose,
  onSelectProperty,
}) => {
  const { visits: storeVisits, fetchVisits, cancelVisit } = useAppStore();
  const visits = propVisits !== undefined ? propVisits : storeVisits;

  useEffect(() => {
    if (visible) {
      fetchVisits();
    }
  }, [visible, fetchVisits]);

  const handleCancelVisit = (visit: Visit) => {
    Alert.alert(
      'Cancel Visit Request',
      `Are you sure you want to cancel your scheduled visit for "${visit.property_title}"?`,
      [
        { text: 'Keep Visit', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            await cancelVisit(visit.id);
          },
        },
      ]
    );
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
              <Text style={styles.title}>Scheduled Visits</Text>
              <Text style={styles.subtitle}>
                {visits.length} {visits.length === 1 ? 'visit' : 'visits'} scheduled
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

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}
          >
            {visits.length === 0 ? (
              <View style={styles.emptyWrap}>
                <View style={styles.emptyIconCircle}>
                  <Calendar size={28} color="#6C4DFF" strokeWidth={1.8} />
                </View>
                <Text style={styles.emptyTitle}>No scheduled visits yet</Text>
                <Text style={styles.emptyDesc}>
                  When you schedule property viewings, they will appear here with confirmation details and timings.
                </Text>
              </View>
            ) : (
              visits.map((visit) => {
                const isConfirmed = visit.status === 'CONFIRMED';
                return (
                  <Pressable
                    key={visit.id}
                    style={styles.card}
                    onPress={() => {
                      if (onSelectProperty && visit.property_id) {
                        onClose();
                        onSelectProperty(visit.property_id);
                      }
                    }}
                  >
                    {visit.property_image ? (
                      <Image
                        source={{ uri: visit.property_image }}
                        style={styles.cardImg}
                      />
                    ) : (
                      <View style={[styles.cardImg, styles.imgPlaceholder]}>
                        <Calendar size={24} color="#777482" />
                      </View>
                    )}

                    <View style={styles.cardContent}>
                      <View style={styles.topRow}>
                        <Text style={styles.propertyTitle} numberOfLines={1}>
                          {visit.property_title}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            isConfirmed
                              ? styles.statusConfirmed
                              : styles.statusPending,
                          ]}
                        >
                          {isConfirmed ? (
                            <CheckCircle2 size={12} color="#32B768" strokeWidth={2} />
                          ) : (
                            <Clock3 size={12} color="#6C4DFF" strokeWidth={2} />
                          )}
                          <Text
                            style={[
                              styles.statusText,
                              isConfirmed
                                ? styles.statusTextConfirmed
                                : styles.statusTextPending,
                            ]}
                          >
                            {visit.status}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.metaRow}>
                        <MapPin size={13} color="#777482" />
                        <Text style={styles.metaText} numberOfLines={1}>
                          {visit.property_locality}
                        </Text>
                      </View>

                      <View style={styles.dateTimeRow}>
                        <View style={styles.pillItem}>
                          <Calendar size={13} color="#6C4DFF" />
                          <Text style={styles.pillItemText}>{visit.date}</Text>
                        </View>
                        <View style={styles.pillItem}>
                          <Clock size={13} color="#6C4DFF" />
                          <Text style={styles.pillItemText}>{visit.time}</Text>
                        </View>
                      </View>

                      {visit.notes ? (
                        <Text style={styles.notesText} numberOfLines={2}>
                          Note: {visit.notes}
                        </Text>
                      ) : null}

                      {(visit.status === 'REQUESTED' || visit.status === 'CONFIRMED') && (
                        <Pressable
                          style={styles.cancelLink}
                          onPress={() => handleCancelVisit(visit)}
                          accessibilityRole="button"
                          accessibilityLabel="Cancel this scheduled visit"
                        >
                          <XCircle size={13} color="#E5484D" />
                          <Text style={styles.cancelLinkText}>Cancel Visit Request</Text>
                        </Pressable>
                      )}
                    </View>
                  </Pressable>
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
    backgroundColor: 'rgba(23, 21, 34, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEE9',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171522',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#777482',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    gap: 10,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171522',
  },
  emptyDesc: {
    fontSize: 13,
    fontWeight: '400',
    color: '#777482',
    textAlign: 'center',
    lineHeight: 18,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    borderRadius: 16,
    overflow: 'hidden',
    padding: 10,
    gap: 12,
  },
  cardImg: {
    width: 84,
    height: 84,
    borderRadius: 12,
  },
  imgPlaceholder: {
    backgroundColor: '#F0EEE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  propertyTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#171522',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusConfirmed: {
    backgroundColor: '#EAF8F0',
  },
  statusPending: {
    backgroundColor: '#F0ECFF',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  statusTextConfirmed: {
    color: '#32B768',
  },
  statusTextPending: {
    color: '#6C4DFF',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#777482',
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  pillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8F7F4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillItemText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#171522',
  },
  notesText: {
    fontSize: 11,
    color: '#777482',
    fontStyle: 'italic',
    marginTop: 2,
  },
  cancelLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  cancelLinkText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#E5484D',
  },
});
