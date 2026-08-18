import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
  SafeAreaView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppStore } from '../../../src/store/useAppStore';

export default function ScheduleVisitRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { properties, scheduleVisit, user, showToast } = useAppStore();

  const property = properties.find((p) => p.id === id) || properties[0];
  const [selectedDate, setSelectedDate] = useState('Sat, Aug 15');
  const [selectedTime, setSelectedTime] = useState('02:00 PM');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const actionAreaHeight = 12 + 48 + 12 + insets.bottom;

  const handleConfirm = () => {
    if (!property) return;
    scheduleVisit({
      property_id: property.id,
      property_title: property.title,
      property_image: property.images?.[0]?.url || '',
      property_locality: property.locality,
      rent: property.rent,
      renter_id: user?.id || 'guest',
      renter_name: user?.name || 'Guest User',
      renter_phone: user?.phone || '+91 98765 43210',
      owner_id: property.owner_id,
      owner_name: property.owner_name,
      date: selectedDate,
      time: selectedTime,
      status: 'CONFIRMED',
      notes,
    });
    setConfirmed(true);
    setModalVisible(true);
  };

  const dates = ['Today', 'Tomorrow', 'Sat, Aug 15', 'Sun, Aug 16', 'Mon, Aug 17', 'Tue, Aug 18'];
  const times = ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '05:00 PM', '06:00 PM'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Schedule Visit</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: actionAreaHeight + 24 }]}>
        {property && (
          <View style={styles.propertyCard}>
            <Image
              source={{ uri: property.images?.[0]?.url }}
              style={styles.thumb}
            />
            <View style={styles.propInfo}>
              <Text style={styles.propTitle} numberOfLines={1}>{property.title}</Text>
              <Text style={styles.propLoc}>📍 {property.locality}, {property.city}</Text>
              <Text style={styles.propRent}>₹{property.rent.toLocaleString('en-IN')} / mo</Text>
            </View>
          </View>
        )}

        <Text style={styles.sectionLabel}>SELECT DATE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {dates.map((d) => (
            <Pressable
              key={d}
              onPress={() => setSelectedDate(d)}
              style={[styles.dateChip, selectedDate === d && styles.dateChipActive]}
            >
              <Text style={[styles.dateChipText, selectedDate === d && styles.dateChipTextActive]}>{d}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.sectionLabel}>SELECT TIME SLOT</Text>
        <View style={styles.timeGrid}>
          {times.map((t) => (
            <Pressable
              key={t}
              onPress={() => setSelectedTime(t)}
              style={[styles.timeChip, selectedTime === t && styles.timeChipActive]}
            >
              <Text style={[styles.timeChipText, selectedTime === t && styles.timeChipTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>NOTES (OPTIONAL)</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Any preferences or questions for the owner?"
          multiline
          numberOfLines={3}
          style={styles.notesInput}
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmBtnText}>Confirm Visit • {selectedTime}</Text>
        </Pressable>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.checkIcon}>✅</Text>
            <Text style={styles.modalTitle}>Visit Request Sent!</Text>
            <Text style={styles.modalSub}>
              Your visit for {property?.title} is scheduled for {selectedDate} at {selectedTime}.
            </Text>
            <Pressable
              style={styles.modalBtn}
              onPress={() => {
                setModalVisible(false);
                router.replace('/(renter)/home');
              }}
            >
              <Text style={styles.modalBtnText}>Back to Home</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F5F0' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  backBtn: { width: 48, paddingVertical: 4 },
  backText: { color: '#6C4DFF', fontWeight: '700', fontSize: 14 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#17151F' },
  body: { padding: 16, gap: 8, paddingBottom: 120 },
  propertyCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    padding: 12,
    gap: 12,
    marginBottom: 8,
  },
  thumb: { width: 80, height: 80, borderRadius: 12 },
  propInfo: { flex: 1, gap: 2, justifyContent: 'center' },
  propTitle: { fontSize: 14, fontWeight: '800', color: '#17151F' },
  propLoc: { fontSize: 12, color: '#71717A' },
  propRent: { fontSize: 14, fontWeight: '900', color: '#6C4DFF', marginTop: 2 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#71717A',
    letterSpacing: 0.8,
    marginTop: 12,
    marginBottom: 4,
  },
  chipRow: { gap: 8, paddingVertical: 4 },
  dateChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    marginRight: 8,
  },
  dateChipActive: { backgroundColor: '#6C4DFF', borderColor: '#6C4DFF' },
  dateChipText: { fontSize: 12, fontWeight: '700', color: '#17151F' },
  dateChipTextActive: { color: '#FFFFFF' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: {
    width: '30%',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E2DD',
    alignItems: 'center',
  },
  timeChipActive: { backgroundColor: '#EEE9FF', borderColor: '#6C4DFF' },
  timeChipText: { fontSize: 12, fontWeight: '700', color: '#17151F' },
  timeChipTextActive: { color: '#6C4DFF', fontWeight: '900' },
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E2DD',
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    color: '#17151F',
    minHeight: 72,
    textAlignVertical: 'top',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
    padding: 12,
  },
  confirmBtn: {
    backgroundColor: '#6C4DFF',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  confirmBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  checkIcon: { fontSize: 48 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#17151F' },
  modalSub: { fontSize: 13, color: '#71717A', textAlign: 'center', lineHeight: 18 },
  modalBtn: {
    backgroundColor: '#6C4DFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    marginTop: 8,
  },
  modalBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
});
