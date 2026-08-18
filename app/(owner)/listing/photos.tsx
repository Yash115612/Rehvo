import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function ListingPhotosRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  ]);

  const actionAreaHeight = 16 + 50 + 16 + insets.bottom;

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (e) {
      Alert.alert('Upload Error', 'Failed to pick image from camera roll.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.stepTitle}>Step 5 of 6</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: actionAreaHeight + 24 }]}>
        <Text style={styles.heading}>Property Photos</Text>
        <Text style={styles.sub}>High-quality photos increase tenant inquiries by 3x.</Text>

        <View style={styles.photoGrid}>
          {images.map((uri, idx) => (
            <View key={idx} style={styles.imgWrapper}>
              <Image source={{ uri }} style={styles.img} />
            </View>
          ))}
          <Pressable style={styles.addCard} onPress={pickImage}>
            <Text style={styles.addIcon}>📷</Text>
            <Text style={styles.addLabel}>Add Photo</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable style={styles.nextBtn} onPress={() => router.push('/(owner)/listing/preview')}>
          <Text style={styles.nextText}>Preview Listing →</Text>
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
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  imgWrapper: { width: 100, height: 100, borderRadius: 12, overflow: 'hidden' },
  img: { width: '100%', height: '100%' },
  addCard: { width: 100, height: 100, borderRadius: 12, borderWidth: 1.5, borderColor: '#6C4DFF', borderStyle: 'dashed', backgroundColor: '#EEE9FF', alignItems: 'center', justifyContent: 'center' },
  addIcon: { fontSize: 24 },
  addLabel: { fontSize: 11, fontWeight: '600', color: '#6C4DFF', marginTop: 2 },
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
