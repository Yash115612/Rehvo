import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  X,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  ShieldCheck,
  Sparkles,
  Pencil,
  CheckCircle2,
  ArrowRight,
  Armchair,
  Car,
  Calendar,
  Building2,
} from 'lucide-react-native';
import { useAppStore } from '../../../src/store/useAppStore';
import { ListingExitModal } from '../../../src/components/listing/ListingExitModal';

export default function ListingPreviewRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { listingDraft, resetListingDraft, showToast } = useAppStore();
  const [exitModalVisible, setExitModalVisible] = useState(false);

  const coverImage =
    listingDraft.images?.find((img) => img.is_cover)?.url ||
    listingDraft.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80';

  const formatAmount = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const handleSaveDraft = () => {
    setExitModalVisible(false);
    showToast('Listing draft saved', 'success');
    router.replace('/(renter)/home');
  };

  const handleDiscard = () => {
    resetListingDraft();
    setExitModalVisible(false);
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

        <Text style={styles.headerTitle}>Listing Preview</Text>

        <Pressable
          onPress={() => setExitModalVisible(true)}
          style={styles.navBtn}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Close and save draft"
        >
          <X size={20} color="#777482" strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
      >
        <View style={styles.introBanner}>
          <Sparkles size={18} color="#6C4DFF" strokeWidth={2.2} />
          <Text style={styles.introText}>
            This is how renters will view your listing on REHVO.
          </Text>
        </View>

        {/* Realistic Property Card Preview */}
        <View style={styles.previewCard}>
          {/* Cover Hero */}
          <View style={styles.heroWrap}>
            <Image
              source={{ uri: coverImage }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroBadgeLeft}>
              <ShieldCheck size={13} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.heroBadgeText}>Verified Listing</Text>
            </View>
            <View style={styles.heroBadgeRight}>
              <Text style={styles.heroBadgeText}>
                {listingDraft.images?.length || 1} Photos
              </Text>
            </View>
          </View>

          {/* Core Info */}
          <View style={styles.cardBody}>
            <View style={styles.titlePriceRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.propTitle} numberOfLines={2}>
                  {listingDraft.title || 'Modern Apartment in Andheri West'}
                </Text>
                <View style={styles.locRow}>
                  <MapPin size={13} color="#777482" strokeWidth={2} />
                  <Text style={styles.locText} numberOfLines={1}>
                    {listingDraft.locality || 'Andheri West'},{' '}
                    {listingDraft.city || 'Mumbai'}
                  </Text>
                </View>
              </View>

              <View style={styles.priceCol}>
                <Text style={styles.priceAmount}>
                  {formatAmount(listingDraft.rent || 35000)}
                </Text>
                <Text style={styles.pricePeriod}>/ month</Text>
              </View>
            </View>

            {/* Spec Chips */}
            <View style={styles.specsRow}>
              <View style={styles.specBadge}>
                <BedDouble size={13} color="#171522" strokeWidth={2} />
                <Text style={styles.specBadgeText}>
                  {listingDraft.bhk || '2 BHK'}
                </Text>
              </View>
              <View style={styles.specBadge}>
                <Bath size={13} color="#171522" strokeWidth={2} />
                <Text style={styles.specBadgeText}>
                  {listingDraft.bathrooms || 2} Baths
                </Text>
              </View>
              <View style={styles.specBadge}>
                <Ruler size={13} color="#171522" strokeWidth={2} />
                <Text style={styles.specBadgeText}>
                  {listingDraft.area_sqft || 950} sqft
                </Text>
              </View>
              {listingDraft.brokerage === 0 && (
                <View style={styles.noBrokerageChip}>
                  <Text style={styles.noBrokerageChipText}>No Brokerage</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Section Review & Edit Triggers */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Review & Edit Details</Text>

          {/* Pricing Row */}
          <View style={styles.reviewRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewLabel}>Rent & Deposit</Text>
              <Text style={styles.reviewVal}>
                Rent: {formatAmount(listingDraft.rent || 35000)}/mo · Deposit:{' '}
                {formatAmount(listingDraft.deposit || 100000)}
              </Text>
            </View>
            <Pressable
              style={styles.editBtn}
              onPress={() => router.push('/(renter)/listing/pricing')}
            >
              <Pencil size={13} color="#6C4DFF" strokeWidth={2.2} />
              <Text style={styles.editBtnText}>Edit</Text>
            </Pressable>
          </View>

          {/* Location Row */}
          <View style={styles.reviewRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewLabel}>Address & Location</Text>
              <Text style={styles.reviewVal} numberOfLines={1}>
                {listingDraft.address || 'Address details'}, {listingDraft.locality}
              </Text>
            </View>
            <Pressable
              style={styles.editBtn}
              onPress={() => router.push('/(renter)/listing/location')}
            >
              <Pencil size={13} color="#6C4DFF" strokeWidth={2.2} />
              <Text style={styles.editBtnText}>Edit</Text>
            </Pressable>
          </View>

          {/* Amenities Row */}
          <View style={styles.reviewRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewLabel}>Amenities & Features</Text>
              <Text style={styles.reviewVal} numberOfLines={1}>
                {listingDraft.amenities?.join(', ') || 'Wi-Fi, Lift, Security'}
              </Text>
            </View>
            <Pressable
              style={styles.editBtn}
              onPress={() => router.push('/(renter)/listing/amenities')}
            >
              <Pencil size={13} color="#6C4DFF" strokeWidth={2.2} />
              <Text style={styles.editBtnText}>Edit</Text>
            </Pressable>
          </View>

          {/* Photos Row */}
          <View style={styles.reviewRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewLabel}>Property Photos</Text>
              <Text style={styles.reviewVal}>
                {listingDraft.images?.length || 1} photos attached
              </Text>
            </View>
            <Pressable
              style={styles.editBtn}
              onPress={() => router.push('/(renter)/listing/photos')}
            >
              <Pencil size={13} color="#6C4DFF" strokeWidth={2.2} />
              <Text style={styles.editBtnText}>Edit</Text>
            </Pressable>
          </View>

          {/* Description Row */}
          <View style={[styles.reviewRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewLabel}>Description</Text>
              <Text style={styles.reviewVal} numberOfLines={2}>
                {listingDraft.description || 'Description details...'}
              </Text>
            </View>
            <Pressable
              style={styles.editBtn}
              onPress={() => router.push('/(renter)/listing/description')}
            >
              <Pencil size={13} color="#6C4DFF" strokeWidth={2.2} />
              <Text style={styles.editBtnText}>Edit</Text>
            </Pressable>
          </View>
        </View>

        {/* Quality Checklist */}
        <View style={styles.qualityCard}>
          <Text style={styles.qualityTitle}>Listing Quality Checklist</Text>
          <View style={styles.qualityItem}>
            <CheckCircle2 size={16} color="#32B768" strokeWidth={2.2} />
            <Text style={styles.qualityItemText}>Property details complete</Text>
          </View>
          <View style={styles.qualityItem}>
            <CheckCircle2 size={16} color="#32B768" strokeWidth={2.2} />
            <Text style={styles.qualityItemText}>Locality & address verified</Text>
          </View>
          <View style={styles.qualityItem}>
            <CheckCircle2 size={16} color="#32B768" strokeWidth={2.2} />
            <Text style={styles.qualityItemText}>Rent & security deposit set</Text>
          </View>
          <View style={styles.qualityItem}>
            <CheckCircle2 size={16} color="#32B768" strokeWidth={2.2} />
            <Text style={styles.qualityItemText}>
              {listingDraft.images?.length || 0} Photos uploaded
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
        <Pressable
          style={styles.publishCta}
          onPress={() => router.push('/(renter)/listing/publish')}
          accessibilityRole="button"
          accessibilityLabel="Continue to publish listing"
        >
          <Text style={styles.publishCtaText}>Continue to Publish</Text>
          <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.2} />
        </Pressable>
      </View>

      {/* Exit Confirmation Modal */}
      <ListingExitModal
        visible={exitModalVisible}
        onSaveDraft={handleSaveDraft}
        onDiscard={handleDiscard}
        onCancel={() => setExitModalVisible(false)}
      />
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
    paddingTop: 14,
    gap: 16,
  },
  introBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0ECFF',
    borderWidth: 1,
    borderColor: '#D4C8FF',
    borderRadius: 14,
    padding: 12,
  },
  introText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#171522',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    overflow: 'hidden',
  },
  heroWrap: {
    height: 200,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E8E5EC',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroBadgeLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(50, 183, 104, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroBadgeRight: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(23, 21, 34, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardBody: {
    padding: 16,
    gap: 12,
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  propTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171522',
    lineHeight: 22,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locText: {
    fontSize: 13,
    color: '#777482',
    fontWeight: '500',
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
  },
  pricePeriod: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#777482',
  },
  specsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F0EA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  specBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#171522',
  },
  noBrokerageChip: {
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  noBrokerageChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#32B768',
  },
  reviewSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 16,
    gap: 4,
  },
  reviewSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#171522',
    marginBottom: 8,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0EA',
    gap: 10,
  },
  reviewLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#777482',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  reviewVal: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#171522',
    marginTop: 2,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F0ECFF',
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C4DFF',
  },
  qualityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E5EC',
    padding: 16,
    gap: 10,
  },
  qualityTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#171522',
  },
  qualityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qualityItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171522',
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
  publishCta: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#6C4DFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  publishCtaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
