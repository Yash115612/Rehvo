import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ListingLocationRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [city, setCity] = useState('Mumbai');
  const [locality, setLocality] = useState('Bandra West');
  const [address, setAddress] = useState('Hill Road, Bandra West, Mumbai 400050');

  const actionAreaHeight = 16 + 50 + 16 + insets.bottom;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.stepTitle}>Step 2 of 6</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: actionAreaHeight + 24 }]}>
        <Text style={styles.heading}>Where is your property located?</Text>
        <Text style={styles.sub}>Enter the locality details so tenants can find it on the map.</Text>

        <View style={styles.field}>
          <Text style={styles.label}>City</Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="e.g. Mumbai" />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Locality / Neighborhood</Text>
          <TextInput style={styles.input} value={locality} onChangeText={setLocality} placeholder="e.g. Bandra West" />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Full Address</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            value={address}
            onChangeText={setAddress}
            placeholder="Building name, street, pincode..."
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable style={styles.nextBtn} onPress={() => router.push('/(owner)/listing/details')}>
          <Text style={styles.nextText}>Continue to Details →</Text>
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
