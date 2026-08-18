import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { Property, PropertyType, FurnishingType } from '../../../src/types';

export default function ListingPublishRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    user,
    listingDraft,
    addProperty,
    resetListingDraft,
    showToast,
  } = useAppStore();

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (isPublishing) return;

    if (!user?.id) {
      showToast('You must be signed in to publish a property.', 'error');
      return;
    }

    if (!listingDraft.title || listingDraft.title.trim().length === 0) {
      showToast('Please enter a property title before publishing.', 'error');
      return;
    }

    if (!listingDraft.rent || listingDraft.rent <= 0) {
      showToast('Please specify a valid monthly rent amount.', 'error');
      return;
    }

    if (!listingDraft.locality || listingDraft.locality.trim().length === 0) {
      showToast('Please enter the property locality.', 'error');
      return;
    }

    setIsPublishing(true);

    try {
      const newProperty: Omit<
        Property,
        | 'id'
        | 'created_at'
        | 'updated_at'
        | 'views_count'
        | 'saves_count'
        | 'enquiries_count'
      > = {
        owner_id: user.id,
        owner_name: user.name || 'Owner',
        owner_avatar: user.avatar || '',
        owner_phone: user.phone || '',
        title: listingDraft.title.trim(),
        description:
          listingDraft.description?.trim() ||
          'Spacious, well-ventilated property in prime Mumbai neighbourhood with modern amenities.',
        property_type: (listingDraft.property_type || 'FLAT') as PropertyType,
        listing_type: 'RENT',
        city: listingDraft.city?.trim() || 'Mumbai',
        locality: listingDraft.locality.trim(),
        address:
          listingDraft.address?.trim() ||
          `${listingDraft.locality.trim()}, ${listingDraft.city?.trim() || 'Mumbai'}`,
        latitude: 19.076,
        longitude: 72.8777,
        rent: listingDraft.rent,
        deposit: listingDraft.deposit || 0,
        maintenance: listingDraft.maintenance || 0,
        brokerage: listingDraft.brokerage ?? 0,
        bhk: listingDraft.bhk || '1 BHK',
        bathrooms: listingDraft.bathrooms || 1,
        area_sqft: listingDraft.area_sqft || 500,
        floor: 1,
        total_floors: 5,
        furnishing:
          (listingDraft.furnishing as FurnishingType) || 'SEMI_FURNISHED',
        parking: 'Car & Bike',
        available_from: listingDraft.available_from || 'Available Immediately',
        status: 'ACTIVE',
        verification_status: 'UNVERIFIED',
        images: listingDraft.images || [],
        amenities: listingDraft.amenities || ['High-Speed Wi-Fi', '24/7 Security'],
        tenant_preferences: listingDraft.tenant_preferences || ['All Welcome'],
      };

      const res = await addProperty(newProperty);
      if (res.success) {
        resetListingDraft();
        router.replace('/(renter)/listing/success');
      } else {
        showToast(res.error || "Couldn't publish this property. Please try again.", 'error');
      }
    } catch (e: any) {
      showToast(e?.message || "Couldn't create this property. Please try again.", 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = () => {
    showToast('Listing draft saved', 'success');
    router.replace('/(renter)/home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Pressable
          onPress={() => router.back()}
          style={styles.navBtn}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color="#171522" strokeWidth={2.2} />
        </Pressable>

        <Text style={styles.headerTitle}>Publish Listing</Text>

        <Pressable
          onPress={handleSaveDraft}
          style={styles.navBtn}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Save draft and exit"
        >
          <X size={20} color="#777482" strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 100 },
        ]}
      >
        <View style={styles.heroBox}>
          <View style={styles.sparkleCircle}>
            <Sparkles size={28} color="#6C4DFF" strokeWidth={2.2} />
          </View>
          <Text style={styles.heroTitle}>Ready to go live?</Text>
          <Text style={styles.heroSub}>
            Your listing will be instantly discoverable by verified renters across Mumbai on REHVO.
          </Text>
        </View>

        {/* Benefits Card */}
        <View style={styles.benefitCard}>
          <View style={styles.benefitRow}>
            <ShieldCheck size={18} color="#32B768" strokeWidth={2.2} />
            <Text style={styles.benefitText}>
              Direct verified renter enquiries with zero spam.
            </Text>
          </View>
          <View style={styles.benefitRow}>
            <CheckCircle2 size={18} color="#32B768" strokeWidth={2.2} />
            <Text style={styles.benefitText}>
              Manage scheduled visits and tenant chats right from REHVO.
            </Text>
          </View>
          <View style={styles.benefitRow}>
            <Lock size={18} color="#32B768" strokeWidth={2.2} />
            <Text style={styles.benefitText}>
              Your contact details stay encrypted and secure.
            </Text>
          </View>
        </View>

        {/* Listing Summary Preview Box */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryBoxTitle}>Listing Summary</Text>
          <View style={styles.summaryDetails}>
            <Text style={styles.summaryPropTitle}>
              {listingDraft.title || 'Modern 2 BHK Apartment'}
            </Text>
            <Text style={styles.summaryPropLoc}>
              {listingDraft.locality || 'Andheri West'},{' '}
              {listingDraft.city || 'Mumbai'}
            </Text>
            <Text style={styles.summaryPropPrice}>
              ₹{(listingDraft.rent || 35000).toLocaleString('en-IN')} / month
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <View style={styles.actionRow}>
          <Pressable
            style={styles.secondaryDraftBtn}
            onPress={handleSaveDraft}
            disabled={isPublishing}
            accessibilityRole="button"
            accessibilityLabel="Save as draft"
          >
            <Text style={styles.secondaryDraftText}>Save Draft</Text>
          </Pressable>

          <Pressable
            style={[styles.publishBtn, isPublishing && { opacity: 0.8 }]}
            onPress={handlePublish}
            disabled={isPublishing}
            accessibilityRole="button"
            accessibilityLabel="Publish property"
          >
            {isPublishing ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.publishBtnText}>Publishing...</Text>
              </>
            ) : (
              <>
                <Text style={styles.publishBtnText}>Publish Property</Text>
                <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.2} />
              </>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8F7F4',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E5EC',
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  heroBox: {
    alignItems: 'center',
    backgroundColor: '#F0ECFF',
    borderWidth: 1.5,
    borderColor: '#D4C8FF',
    borderRadius: 24,
    padding: 24,
    textAlign: 'center',
  },
  sparkleCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#171522',
    letterSpacing: -0.4,
  },
  heroSub: {
    fontSize: 13.5,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
    fontWeight: '500',
  },
  benefitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 18,
    gap: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  benefitText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
    lineHeight: 18,
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 18,
    gap: 10,
  },
  summaryBoxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  summaryDetails: {
    gap: 4,
  },
  summaryPropTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
  },
  summaryPropLoc: {
    fontSize: 13,
    color: '#777482',
    fontWeight: '500',
  },
  summaryPropPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#6C4DFF',
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E5EC',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryDraftBtn: {
    width: 110,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryDraftText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#171522',
  },
  publishBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  publishBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
