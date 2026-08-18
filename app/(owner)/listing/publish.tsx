import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ListingPublishRoute() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🎉</Text>
        <Text style={styles.title}>Property Listed!</Text>
        <Text style={styles.sub}>
          Your property is now live on REHVO and visible to thousands of verified renters.
        </Text>

        <Pressable style={styles.primaryBtn} onPress={() => router.replace('/(owner)/dashboard')}>
          <Text style={styles.primaryText}>Go to Owner Dashboard</Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={() => router.replace('/(renter)/home')}>
          <Text style={styles.secondaryText}>Switch to Renter Mode</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F5F0', justifyContent: 'center' },
  content: { padding: 32, alignItems: 'center', gap: 16 },
  icon: { fontSize: 64 },
  title: { fontSize: 26, fontWeight: '800', color: '#17151F', textAlign: 'center' },
  sub: { fontSize: 15, color: '#71717A', textAlign: 'center', lineHeight: 22 },
  primaryBtn: { backgroundColor: '#6C4DFF', width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  primaryText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  secondaryBtn: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D4D4D8', width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  secondaryText: { color: '#17151F', fontWeight: '600', fontSize: 15 },
});
