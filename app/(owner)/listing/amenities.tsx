import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const ALL_AMENITIES = [
  'WiFi', 'Air Conditioner', 'Washing Machine', 'Refrigerator',
  'Power Backup', 'Lift', 'Parking', 'Gym',
  'Swimming Pool', 'Security Guard', 'Balcony', 'Modular Kitchen'
];

export default function ListingAmenitiesRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string[]>(['WiFi', 'Air Conditioner', 'Lift', 'Security Guard']);

  const actionAreaHeight = 16 + 50 + 16 + insets.bottom;

  const toggleAmenity = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((a) => a !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.stepTitle}>Step 4 of 6</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: actionAreaHeight + 24 }]}>
        <Text style={styles.heading}>Select Amenities</Text>
        <Text style={styles.sub}>Highlight features and society facilities available for tenants.</Text>

        <View style={styles.grid}>
          {ALL_AMENITIES.map((item) => {
            const isSelected = selected.includes(item);
            return (
              <Pressable
                key={item}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => toggleAmenity(item)}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                  {isSelected ? '✓ ' : '+ '}{item}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable style={styles.nextBtn} onPress={() => router.push('/(owner)/listing/photos')}>
          <Text style={styles.nextText}>Continue to Photos →</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F5F0' },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E4E4E7' },
  backBtn: { padding: 4 },
  backText: { color: '#6C4DFF', fontWeight: '600' },
  stepTitle: { fontSize: 13, color: '#71717A', fontWeight: '500' },
  content: { padding: 20, gap: 16 },
  heading: { fontSize: 22, fontWeight: '700', color: '#17151F' },
  sub: { fontSize: 14, color: '#71717A' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#D4D4D8', backgroundColor: '#FFFFFF' },
  chipActive: { borderColor: '#6C4DFF', backgroundColor: '#EEE9FF' },
  chipText: { fontSize: 14, color: '#3F3F46' },
  chipTextActive: { color: '#6C4DFF', fontWeight: '600' },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
  },
  nextBtn: { backgroundColor: '#6C4DFF', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  nextText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
});
