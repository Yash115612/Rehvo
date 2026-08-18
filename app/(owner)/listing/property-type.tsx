import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const TYPES = [
  { id: 'APARTMENT', label: 'Full Apartment', icon: '🏢', desc: 'Entire 1, 2, or 3 BHK apartment for rent' },
  { id: 'STUDIO', label: 'Studio Apartment', icon: '✨', desc: 'Compact independent studio apartment' },
  { id: 'PRIVATE_ROOM', label: 'Private Room', icon: '🛏️', desc: 'Single room inside a shared flat' },
  { id: 'CO_LIVING', label: 'Co-Living / PG', icon: '🤝', desc: 'Managed stay with meals & amenities' },
];

export default function PropertyTypeRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedType, setSelectedType] = useState('APARTMENT');

  const actionAreaHeight = 16 + 50 + 16 + insets.bottom;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.stepTitle}>Step 1 of 6</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: actionAreaHeight + 24 }]}>
        <Text style={styles.heading}>What type of property are you listing?</Text>
        <Text style={styles.sub}>Choose the category that best describes your accommodation.</Text>

        <View style={styles.grid}>
          {TYPES.map((t) => {
            const isSelected = selectedType === t.id;
            return (
              <Pressable
                key={t.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelectedType(t.id)}
              >
                <Text style={styles.icon}>{t.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, isSelected && styles.textSelected]}>{t.label}</Text>
                  <Text style={styles.desc}>{t.desc}</Text>
                </View>
                {isSelected && <Text style={styles.check}>✓</Text>}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable style={styles.nextBtn} onPress={() => router.push('/(owner)/listing/location')}>
          <Text style={styles.nextText}>Continue to Location →</Text>
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
  grid: { gap: 12, marginTop: 8 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1.5, borderColor: '#E4E4E7', flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardSelected: { borderColor: '#6C4DFF', backgroundColor: '#F5F3FF' },
  icon: { fontSize: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#17151F' },
  textSelected: { color: '#6C4DFF' },
  desc: { fontSize: 12, color: '#71717A', marginTop: 2 },
  check: { color: '#6C4DFF', fontWeight: '700', fontSize: 18 },
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
