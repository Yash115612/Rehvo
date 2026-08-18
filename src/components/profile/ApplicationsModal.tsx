import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { X, FileText, MapPin, CheckCircle2, Clock3 } from 'lucide-react-native';
import { Application } from '../../types';

interface ApplicationsModalProps {
  visible: boolean;
  applications: Application[];
  onClose: () => void;
  onSelectProperty?: (propertyId: string) => void;
}

export const ApplicationsModal: React.FC<ApplicationsModalProps> = ({
  visible,
  applications,
  onClose,
  onSelectProperty,
}) => {
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
              <Text style={styles.title}>Rental Applications</Text>
              <Text style={styles.subtitle}>
                {applications.length} {applications.length === 1 ? 'application' : 'applications'} submitted
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
            {applications.length === 0 ? (
              <View style={styles.emptyWrap}>
                <View style={styles.emptyIconCircle}>
                  <FileText size={28} color="#6C4DFF" strokeWidth={1.8} />
                </View>
                <Text style={styles.emptyTitle}>No active applications</Text>
                <Text style={styles.emptyDesc}>
                  When you apply for a rental home, you can track landlord approvals and agreement status here.
                </Text>
              </View>
            ) : (
              applications.map((app) => {
                const isAccepted = app.status === 'ACCEPTED';
                const isReview = app.status === 'UNDER_REVIEW';

                return (
                  <Pressable
                    key={app.id}
                    style={styles.card}
                    onPress={() => {
                      if (onSelectProperty && app.property_id) {
                        onClose();
                        onSelectProperty(app.property_id);
                      }
                    }}
                  >
                    {app.property_image ? (
                      <Image
                        source={{ uri: app.property_image }}
                        style={styles.cardImg}
                      />
                    ) : (
                      <View style={[styles.cardImg, styles.imgPlaceholder]}>
                        <FileText size={24} color="#777482" />
                      </View>
                    )}

                    <View style={styles.cardContent}>
                      <View style={styles.topRow}>
                        <Text style={styles.propertyTitle} numberOfLines={1}>
                          {app.property_title}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            isAccepted
                              ? styles.statusAccepted
                              : isReview
                                ? styles.statusReview
                                : styles.statusNeutral,
                          ]}
                        >
                          {isAccepted ? (
                            <CheckCircle2 size={12} color="#32B768" strokeWidth={2} />
                          ) : (
                            <Clock3 size={12} color="#6C4DFF" strokeWidth={2} />
                          )}
                          <Text
                            style={[
                              styles.statusText,
                              isAccepted
                                ? styles.statusTextAccepted
                                : isReview
                                  ? styles.statusTextReview
                                  : styles.statusTextNeutral,
                            ]}
                          >
                            {app.status.replace('_', ' ')}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.metaRow}>
                        <MapPin size={13} color="#777482" />
                        <Text style={styles.metaText} numberOfLines={1}>
                          {app.locality}
                        </Text>
                        <Text style={styles.dot}>·</Text>
                        <Text style={styles.rentText}>
                          ₹{app.rent.toLocaleString('en-IN')}/mo
                        </Text>
                      </View>

                      {app.message ? (
                        <Text style={styles.messageText} numberOfLines={2}>
                          "{app.message}"
                        </Text>
                      ) : null}
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
  statusAccepted: {
    backgroundColor: '#EAF8F0',
  },
  statusReview: {
    backgroundColor: '#F0ECFF',
  },
  statusNeutral: {
    backgroundColor: '#F8F7F4',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  statusTextAccepted: {
    color: '#32B768',
  },
  statusTextReview: {
    color: '#6C4DFF',
  },
  statusTextNeutral: {
    color: '#777482',
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
  dot: {
    color: '#777482',
    fontSize: 12,
  },
  rentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#171522',
  },
  messageText: {
    fontSize: 11,
    color: '#777482',
    fontStyle: 'italic',
    marginTop: 2,
  },
});
