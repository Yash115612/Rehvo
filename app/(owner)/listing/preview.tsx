import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../../src/store/useAppStore';

export default function ListingPreviewRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast, addProperty, listingDraft, resetListingDraft, user } = useAppStore();

  const handlePublish = async () => {
    const res = await addProperty({
      owner_id: user?.id || '',
      owner_name: user?.name || 'Owner',
      owner_avatar: user?.avatar || '',
      owner_phone: user?.phone || '',
      title: listingDraft.title || 'Modern 2 BHK Apartment in Bandra West',
      description:
        listingDraft.description ||
        'Spacious, well-ventilated apartment in a prime residential society.',
      property_type: listingDraft.property_type || 'FLAT',
      listing_type: 'RENT',
      city: listingDraft.city || 'Mumbai',
      locality: listingDraft.locality || 'Bandra West',
      address:
        listingDraft.address || 'Hill Road, Bandra West, Mumbai 400050',
      latitude: 19.0596,
      longitude: 72.8295,
      rent: listingDraft.rent || 45000,
      deposit: listingDraft.deposit || 150000,
      maintenance: listingDraft.maintenance || 3000,
      brokerage: listingDraft.brokerage || 0,
      bhk: listingDraft.bhk || '2 BHK',
      bathrooms: listingDraft.bathrooms || 2,
      area_sqft: listingDraft.area_sqft || 1200,
      floor: 4,
      total_floors: 12,
      furnishing: listingDraft.furnishing || 'FULLY_FURNISHED',
      parking: 'Car & Bike',
      available_from: listingDraft.available_from || 'Immediate',
      status: 'ACTIVE',
      verification_status: 'VERIFIED',
      images:
        listingDraft.images && listingDraft.images.length > 0
          ? listingDraft.images
          : [
              {
                id: 'img_preview_1',
                url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
                is_cover: true,
                sort_order: 0,
              },
            ],
      amenities:
        listingDraft.amenities && listingDraft.amenities.length > 0
          ? listingDraft.amenities
          : ['Wi-Fi', 'AC', 'Lift', 'Security 24/7', 'Power Backup'],
      tenant_preferences: listingDraft.tenant_preferences || ['All Welcome'],
    });

    if (res.success) {
      resetListingDraft();
      router.push('/(owner)/listing/publish');
    }
  };

  const actionAreaHeight = 16 + 50 + 16 + insets.bottom;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Edit</Text>
        </Pressable>
        <Text style={styles.stepTitle}>Step 6 of 6 (Preview)</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: actionAreaHeight + 24 }]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80' }}
          style={styles.heroImg}
        />
        <View style={styles.card}>
          <Text style={styles.rent}>₹45,000 / mo</Text>
          <Text style={styles.title}>Modern 2 BHK Apartment in Bandra West</Text>
          <Text style={styles.sub}>Hill Road, Bandra West, Mumbai • Fully Furnished</Text>

          <View style={styles.tagRow}>
            <Text style={styles.tag}>2 BHK</Text>
            <Text style={styles.tag}>1200 sq.ft</Text>
            <Text style={styles.tag}>Deposit: ₹1,50,000</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Included Amenities</Text>
          <Text style={styles.bodyText}>• WiFi • Air Conditioner • Lift • Security Guard • Power Backup</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          style={styles.nextBtn}
          onPress={handlePublish}
        >
          <Text style={styles.nextText}>Publish Listing Now 🚀</Text>
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
  content: { padding: 16, gap: 16 },
  heroImg: { width: '100%', height: 200, borderRadius: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, gap: 8, borderWidth: 1, borderColor: '#E4E4E7' },
  rent: { fontSize: 24, fontWeight: '800', color: '#6C4DFF' },
  title: { fontSize: 18, fontWeight: '700', color: '#17151F' },
  sub: { fontSize: 13, color: '#71717A' },
  tagRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  tag: { backgroundColor: '#EEE9FF', color: '#6C4DFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, fontSize: 12, fontWeight: '600' },
  sectionHeading: { fontSize: 15, fontWeight: '700', color: '#17151F' },
  bodyText: { fontSize: 13, color: '#3F3F46', lineHeight: 20 },
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
  nextBtn: { backgroundColor: '#16A34A', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  nextText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
