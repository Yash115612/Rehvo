import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Sparkles,
  ArrowRight,
} from 'lucide-react-native';
import { Property } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface ScheduleVisitModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const { user, scheduleVisit, fetchVisits } = useAppStore();

  const isOwner = user?.id === property.owner_id;

  // Generate dynamic next 7 days
  const dates = useMemo(() => {
    const list = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const value = `${yyyy}-${mm}-${dd}`;
      const dayName = days[d.getDay()];
      const monthName = months[d.getMonth()];
      const label =
        i === 0
          ? 'Today'
          : i === 1
          ? 'Tomorrow'
          : `${dayName}, ${monthName} ${d.getDate()}`;
      list.push({ label, value, display: `${dayName}, ${monthName} ${d.getDate()}` });
    }
    return list;
  }, []);

  const [selectedDate, setSelectedDate] = useState(dates[0]?.value || '');
  const [selectedTime, setSelectedTime] = useState('02:00 PM');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const timeSlots = [
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '04:00 PM',
    '05:30 PM',
    '07:00 PM',
  ];

  const handleClose = () => {
    setIsConfirmed(false);
    setErrorMsg(null);
    setNotes('');
    onClose();
  };

  const handleConfirm = async () => {
    if (isSubmitting) return;

    if (!user?.id) {
      setErrorMsg('Please log in to schedule a visit.');
      return;
    }

    if (!selectedDate || !selectedTime) {
      setErrorMsg('Please select a date and time slot.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await scheduleVisit({
        property_id: property.id,
        property_title: property.title,
        property_image: property.images[0]?.url || '',
        property_locality: property.locality,
        rent: property.rent,
        date: selectedDate,
        time: selectedTime,
        notes: notes.trim(),
      });

      if (res.success && res.data) {
        setIsConfirmed(true);
        fetchVisits(); // Asynchronous reconciliation
      } else {
        setErrorMsg(res.error || "Couldn't schedule this visit. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDateDisplay =
    dates.find((d) => d.value === selectedDate)?.display || selectedDate;

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Pressable
            onPress={handleClose}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Close modal"
          >
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#17151F' }}>
              ✕
            </Text>
          </Pressable>

          {isConfirmed ? (
            /* Explicit Success Confirmation Screen */
            <View style={styles.confirmedContainer}>
              <View style={styles.successBadge}>
                <CheckCircle2 size={48} color="#10B981" strokeWidth={2.4} />
              </View>

              <Text style={styles.confirmedTitle}>Visit Request Sent! 🎉</Text>
              <Text style={styles.confirmedSubtitle}>
                The property host has received your request and will confirm your slot shortly.
              </Text>

              {/* Booking Summary Card */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Image
                    source={{ uri: property.images[0]?.url }}
                    style={styles.summaryImg}
                  />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.summaryPropTitle} numberOfLines={1}>
                      {property.title}
                    </Text>
                    <Text style={styles.summaryPropLocality} numberOfLines={1}>
                      {property.locality}, {property.city}
                    </Text>
                    <Text style={styles.summaryPropPrice}>
                      ₹{property.rent.toLocaleString('en-IN')}/mo
                    </Text>
                  </View>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Calendar size={14} color="#6C4DFF" strokeWidth={2.2} />
                    <Text style={styles.detailText}>{selectedDateDisplay}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Clock size={14} color="#6C4DFF" strokeWidth={2.2} />
                    <Text style={styles.detailText}>{selectedTime}</Text>
                  </View>
                </View>

                <View style={styles.statusPill}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusPillText}>Status: Pending Host Confirmation</Text>
                </View>
              </View>

              <Pressable
                onPress={handleClose}
                style={styles.doneBtn}
                accessibilityRole="button"
                accessibilityLabel="Done and close modal"
              >
                <Text style={styles.doneBtnText}>Done</Text>
              </Pressable>
            </View>
          ) : (
            /* Booking Form */
            <>
              <Text style={styles.title}>Schedule Visit</Text>
              <Text style={styles.subtitle}>
                Select your preferred date & time slot for an in-person tour.
              </Text>

              {/* Property Mini Preview */}
              <View style={styles.previewCard}>
                <Image
                  source={{ uri: property.images[0]?.url }}
                  style={styles.previewImg}
                />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.previewTitle} numberOfLines={1}>
                    {property.title}
                  </Text>
                  <Text style={styles.previewPrice}>
                    ₹{property.rent.toLocaleString('en-IN')}/mo
                  </Text>
                </View>
              </View>

              {/* Error Message if any */}
              {errorMsg && (
                <View style={styles.errorBox}>
                  <AlertCircle size={16} color="#DC2626" strokeWidth={2} />
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              )}

              {/* Self Visit Warning */}
              {isOwner ? (
                <View style={styles.warningBox}>
                  <Text style={styles.warningText}>
                    You are listed as the owner of this property. You cannot schedule a visit for your own property.
                  </Text>
                </View>
              ) : (
                <>
                  {/* Date Picker */}
                  <Text style={styles.label}>SELECT DATE</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8 }}
                  >
                    {dates.map((d) => (
                      <React.Fragment key={d.value}>
                        <Pressable
                          onPress={() => {
                            setSelectedDate(d.value);
                            if (errorMsg) setErrorMsg(null);
                          }}
                          style={[
                            styles.dateChip,
                            selectedDate === d.value && styles.activeDateChip,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dateChipText,
                              selectedDate === d.value && styles.activeDateText,
                            ]}
                          >
                            {d.label}
                          </Text>
                        </Pressable>
                      </React.Fragment>
                    ))}
                  </ScrollView>

                  {/* Time Picker */}
                  <Text style={styles.label}>SELECT TIME</Text>
                  <View style={styles.timeGrid}>
                    {timeSlots.map((t) => (
                      <React.Fragment key={t}>
                        <Pressable
                          onPress={() => {
                            setSelectedTime(t);
                            if (errorMsg) setErrorMsg(null);
                          }}
                          style={[
                            styles.timeChip,
                            selectedTime === t && styles.activeTimeChip,
                          ]}
                        >
                          <Text
                            style={[
                              styles.timeChipText,
                              selectedTime === t && styles.activeTimeText,
                            ]}
                          >
                            {t}
                          </Text>
                        </Pressable>
                      </React.Fragment>
                    ))}
                  </View>

                  <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Notes or questions for host (optional)..."
                    placeholderTextColor="#8C8994"
                    style={styles.input}
                  />

                  <Pressable
                    onPress={handleConfirm}
                    disabled={isSubmitting}
                    style={[
                      styles.confirmBtn,
                      isSubmitting && styles.confirmBtnDisabled,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Confirm Visit Slot"
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.confirmText}>
                        Confirm Visit Slot →
                      </Text>
                    )}
                  </Pressable>
                </>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    gap: 12,
    position: 'relative',
    maxHeight: '90%',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F7F5F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#17151F',
  },
  subtitle: {
    fontSize: 12,
    color: '#86828F',
    lineHeight: 16,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F7F5F0',
    padding: 10,
    borderRadius: 16,
  },
  previewImg: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  previewTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#17151F',
  },
  previewPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6C4DFF',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#86828F',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  dateChip: {
    backgroundColor: '#F7F5F0',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  activeDateChip: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  dateChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#17151F',
  },
  activeDateText: {
    color: '#FFFFFF',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    width: '30.5%',
    backgroundColor: '#F7F5F0',
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  activeTimeChip: {
    backgroundColor: '#EEE9FF',
    borderWidth: 2,
    borderColor: '#6C4DFF',
  },
  timeChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#17151F',
  },
  activeTimeText: {
    color: '#6C4DFF',
  },
  input: {
    backgroundColor: '#F7F5F0',
    borderWidth: 1,
    borderColor: '#E4E2DD',
    borderRadius: 12,
    padding: 12,
    fontSize: 12,
    color: '#17151F',
  },
  confirmBtn: {
    backgroundColor: '#6C4DFF',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmBtnDisabled: {
    backgroundColor: '#C5B7FD',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginVertical: 10,
  },
  warningText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
    fontWeight: '500',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: '#B91C1C',
    fontWeight: '600',
  },
  // Confirmed Screen Styles
  confirmedContainer: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  successBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  confirmedTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#17151F',
    letterSpacing: -0.3,
  },
  confirmedSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    gap: 10,
    marginTop: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryImg: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  summaryPropTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  summaryPropLocality: {
    fontSize: 12,
    color: '#6B7280',
  },
  summaryPropPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: '#6C4DFF',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderRadius: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D97706',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  doneBtn: {
    width: '100%',
    backgroundColor: '#6C4DFF',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 8,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
