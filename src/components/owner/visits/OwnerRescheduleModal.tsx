import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Calendar, Clock, X, ArrowRight } from 'lucide-react-native';
import { Visit } from '../../../types';

interface OwnerRescheduleModalProps {
  visit: Visit | null;
  visible: boolean;
  onClose: () => void;
  onConfirmReschedule: (newDate: string, newTime: string, note?: string) => void;
}

const DATES = [
  'Today',
  'Tomorrow',
  'Sat 16 Aug',
  'Sun 17 Aug',
  'Mon 18 Aug',
];

const TIME_SLOTS = [
  '10:00 AM',
  '12:00 PM',
  '03:00 PM',
  '04:30 PM',
  '06:00 PM',
];

export const OwnerRescheduleModal: React.FC<OwnerRescheduleModalProps> = ({
  visit,
  visible,
  onClose,
  onConfirmReschedule,
}) => {
  const [selectedDate, setSelectedDate] = useState(DATES[1]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[2]);
  const [note, setNote] = useState('');

  if (!visit) return null;

  const handleSubmit = () => {
    onConfirmReschedule(selectedDate, selectedTime, note);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Clock size={18} color="#6C4DFF" strokeWidth={2.2} />
              <Text style={styles.title}>Reschedule Visit</Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
              <X size={18} color="#777482" />
            </Pressable>
          </View>

          <Text style={styles.label}>Select New Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {DATES.map((d) => {
              const isSelected = selectedDate === d;
              return (
                <Pressable
                  key={d}
                  style={[
                    styles.chip,
                    isSelected && styles.chipSelected,
                  ]}
                  onPress={() => setSelectedDate(d)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextSelected,
                    ]}
                  >
                    {d}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.label}>Select Time Slot</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((t) => {
              const isSelected = selectedTime === t;
              return (
                <Pressable
                  key={t}
                  style={[
                    styles.timeChip,
                    isSelected && styles.timeChipSelected,
                  ]}
                  onPress={() => setSelectedTime(t)}
                >
                  <Text
                    style={[
                      styles.timeChipText,
                      isSelected && styles.timeChipTextSelected,
                    ]}
                  >
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Note for Renter (Optional)</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Let the renter know why the time changed..."
            placeholderTextColor="#8C8994"
            style={styles.input}
          />

          <Pressable style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Send New Time</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0EA',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#171522',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
    marginTop: 4,
  },
  chipsScroll: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
  },
  chipSelected: {
    backgroundColor: '#6C4DFF',
    borderColor: '#6C4DFF',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    width: '31%',
    alignItems: 'center',
  },
  timeChipSelected: {
    backgroundColor: '#F0ECFF',
    borderColor: '#6C4DFF',
  },
  timeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#171522',
  },
  timeChipTextSelected: {
    color: '#6C4DFF',
    fontWeight: '700',
  },
  input: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    paddingHorizontal: 12,
    fontSize: 13.5,
    color: '#171522',
  },
  submitBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
