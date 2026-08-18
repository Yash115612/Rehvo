import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ListingDetailsRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [rent, setRent] = useState('45000');
  const [deposit, setDeposit] = useState('150000');
  const [bhk, setBhk] = useState('2 BHK');
  const [furnishing, setFurnishing] = useState('Fully Furnished');

  const actionAreaHeight = 16 + 50 + 16 + insets.bottom;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.stepTitle}>Step 3 of 6</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: actionAreaHeight + 24 }]}>
        <Text style={styles.heading}>Pricing & Space Details</Text>
        <Text style={styles.sub}>Set rent expectations and layout specifications.</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Monthly Rent (₹)</Text>
          <TextInput style={styles.input} keyboardType="number-pad" value={rent} onChangeText={setRent} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Security Deposit (₹)</Text>
          <TextInput style={styles.input} keyboardType="number-pad" value={deposit} onChangeText={setDeposit} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>BHK Configuration</Text>
          <View style={styles.rowWrap}>
            {['1 BHK', '2 BHK', '3 BHK', 'Studio'].map((b) => (
              <Pressable
                key={b}
                style={[styles.chip, bhk === b && styles.chipActive]}
                onPress={() => setBhk(b)}
              >
                <Text style={[styles.chipText, bhk === b && styles.chipTextActive]}>{b}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Furnishing Status</Text>
          <View style={styles.rowWrap}>
            {['Unfurnished', 'Semi-Furnished', 'Fully Furnished'].map((f) => (
              <Pressable
                key={f}
                style={[styles.chip, furnishing === f && styles.chipActive]}
                onPress={() => setFurnishing(f)}
              >
                <Text style={[styles.chipText, furnishing === f && styles.chipTextActive]}>{f}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable style={styles.nextBtn} onPress={() => router.push('/(owner)/listing/amenities')}>
          <Text style={styles.nextText}>Continue to Amenities →</Text>
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
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: '#3F3F46' },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D4D4D8', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: '#17151F' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#D4D4D8', backgroundColor: '#FFFFFF' },
  chipActive: { borderColor: '#6C4DFF', backgroundColor: '#EEE9FF' },
  chipText: { fontSize: 13, color: '#3F3F46' },
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
