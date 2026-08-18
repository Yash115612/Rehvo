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
import { Calendar, Clock, Sparkles } from 'lucide-react-native';
import { Property } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface ScheduleVisitModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({ property, isOpen, onClose }) => {
  const { user, scheduleVisit } = useAppStore();

  const isOwner = user?.id === property.owner_id;

  // Generate dynamic next 7 days
  const dates = useMemo(() => {
    const list = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${dayName}, ${monthName} ${d.getDate()}`;
      list.push({ label, value });
    }
    return list;
  }, []);

  const [selectedDate, setSelectedDate] = useState(dates[0]?.value || '');
  const [selectedTime, setSelectedTime] = useState('02:00 PM');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const timeSlots = ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '05:30 PM', '07:00 PM'];

  const handleConfirm = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await scheduleVisit({
        property_id: property.id,
        property_title: property.title,
        property_image: property.images[0]?.url || '',
        property_locality: property.locality,
        rent: property.rent,
        date: selectedDate,
        time: selectedTime,
        notes,
      });
      if (res.success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Pressable onPress={onClose} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Close modal">
            <Text style={{ fontSize: 16, fontWeight: '800' }}>✕</Text>
          </Pressable>

          <Text style={styles.title}>Schedule Visit</Text>
          <Text style={styles.subtitle}>Select your preferred date & time slot.</Text>

          {/* Property Mini Preview */}
          <View style={styles.previewCard}>
            <Image source={{ uri: property.images[0]?.url }} style={styles.previewImg} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.previewTitle} numberOfLines={1}>{property.title}</Text>
              <Text style={styles.previewPrice}>₹{property.rent.toLocaleString('en-IN')}/mo</Text>
            </View>
          </View>

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
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {dates.map((d) => (
                  <React.Fragment key={d.value}>
                    <Pressable
                      onPress={() => setSelectedDate(d.value)}
                      style={[styles.dateChip, selectedDate === d.value && styles.activeDateChip]}
                    >
                      <Text style={[styles.dateChipText, selectedDate === d.value && styles.activeDateText]}>
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
                      onPress={() => setSelectedTime(t)}
                      style={[styles.timeChip, selectedTime === t && styles.activeTimeChip]}
                    >
                      <Text style={[styles.timeChipText, selectedTime === t && styles.activeTimeText]}>
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
                style={[styles.confirmBtn, isSubmitting && styles.confirmBtnDisabled]}
                accessibilityRole="button"
                accessibilityLabel="Confirm Visit Slot"
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmText}>Confirm Visit Slot →</Text>
                )}
              </Pressable>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    gap: 12,
    position: 'relative',
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
  },
  dateChip: {
    backgroundColor: '#F7F5F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  activeDateChip: {
    backgroundColor: '#6C4DFF',
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
    width: '30%',
    backgroundColor: '#F7F5F0',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
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
});
