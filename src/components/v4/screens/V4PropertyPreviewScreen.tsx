import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  MapPin,
  Building,
  ShieldCheck,
  Zap,
  Gift,
  Share2,
} from 'lucide-react-native';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Button } from '../ui/V4Button';
import { useAppStore } from '../../../store/useAppStore';
import { V4HostPlanGateModal } from '../ui/V4HostPlanGateModal';

export const V4PropertyPreviewScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    propertyDraft,
    canListNewProperty,
    addProperty,
    clearPropertyDraft,
    showToast,
    activeMode,
  } = useAppStore();

  const [publishing, setPublishing] = useState(false);
  const [gateModalVisible, setGateModalVisible] = useState(false);
  const [gateReason, setGateReason] = useState<'NO_PLAN' | 'LIMIT_REACHED'>('LIMIT_REACHED');

  const displayTitle =
    propertyDraft?.title ||
    (propertyDraft?.society
      ? `${propertyDraft.bhk || '2 BHK'} in ${propertyDraft.society}`
      : 'Luxury 2 BHK Apartment in Worli');

  const displayLocality = `${propertyDraft?.locality || 'Worli'}, ${
    propertyDraft?.city || 'South Mumbai'
  }`;

  const displayRent = propertyDraft?.rent
    ? `₹${Number(propertyDraft.rent).toLocaleString('en-IN')}`
    : '₹65,000';

  const displayBhk = propertyDraft?.bhk || '2 BHK';
  const displaySqft = propertyDraft?.areaSqft
    ? `${propertyDraft.areaSqft} sqft`
    : '1,250 sqft';
  const displayFurnishing = propertyDraft?.furnishing || 'Fully Furnished';

  const displayCoverImage =
    propertyDraft?.photos && propertyDraft.photos.length > 0
      ? propertyDraft.photos[propertyDraft.coverIndex || 0] || propertyDraft.photos[0]
      : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  const handlePublish = async () => {
    const check = canListNewProperty();
    if (!check.allowed) {
      setGateReason(check.reason || 'LIMIT_REACHED');
      setGateModalVisible(true);
      return;
    }

    setPublishing(true);
    try {
      const newProp = {
        title: displayTitle,
        type: (propertyDraft?.propType as any) || 'apartment',
        category: 'RESIDENTIAL' as const,
        bhk: (propertyDraft?.bhk as any) || '2 BHK',
        rent: Number(propertyDraft?.rent) || 65000,
        deposit: Number(propertyDraft?.deposit) || 150000,
        locality: propertyDraft?.locality || 'Worli',
        city: propertyDraft?.city || 'Mumbai',
        carpet_area: Number(propertyDraft?.areaSqft) || 1250,
        furnishing: (propertyDraft?.furnishing as any) || 'Fully Furnished',
        tenant_preference: (propertyDraft?.tenantType as any) || 'ALL',
        amenities: propertyDraft?.selectedAmenities || [
          '24x7 Security',
          'Covered Parking',
          'Power Backup',
        ],
        images: [],
        status: 'ACTIVE' as const,
        is_verified: true,
        available_from: new Date().toISOString(),
        floor_plan_url: propertyDraft?.floorPlanUri || null,
        virtual_tour_url: propertyDraft?.virtualTourUri || null,
      };

      const imagesToUpload = (propertyDraft?.photos || []).map((uri, idx) => ({
        uri,
        isCover: idx === (propertyDraft?.coverIndex ?? 0),
      }));

      const res = await addProperty(newProp as any, imagesToUpload);
      if (res.success) {
        clearPropertyDraft();
        setPublishing(false);
        showToast?.('🎉 Property published successfully with verified listing!', 'success');
        if (activeMode === 'owner') {
          router.replace('/(owner)/listings' as any);
        } else {
          router.replace('/(renter)/manage-properties' as any);
        }
      } else {
        setPublishing(false);
        Alert.alert('Publish Failed', res.error || 'Unable to publish listing. Please try again.');
      }
    } catch (e: any) {
      setPublishing(false);
      Alert.alert('Publish Failed', e?.message || 'Unable to publish listing. Please try again.');
    }
  };

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 14) }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={18} color={V4_COLORS.textPrimary} strokeWidth={2.4} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Listing Preview</Text>
          <Text style={styles.headerSubtitle}>Step 3 of 3: Final Review</Text>
        </View>
        <Pressable
          style={styles.backBtn}
          onPress={() => Alert.alert('Share Preview', 'Copy link to share preview with family.')}
        >
          <Share2 size={16} color={V4_COLORS.textPrimary} strokeWidth={2.2} />
        </Pressable>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: '100%' }]} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Preview Label */}
        <View style={styles.previewTagRow}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>PREVIEW AS TENANT</Text>
          </View>
          <Text style={styles.previewHint}>This is how seekers will see your home</Text>
        </View>

        {/* Property Card Mock */}
        <View style={styles.previewCard}>
          <View style={styles.cardImageContainer}>
            <Image
              source={{
                uri: displayCoverImage,
              }}
              style={styles.cardImage}
            />
            <View style={styles.zeroBadge}>
              <Text style={styles.zeroBadgeText}>VERIFIED LISTING</Text>
            </View>
            <View style={styles.pricePill}>
              <Text style={styles.priceText}>{displayRent}<Text style={styles.priceMonth}>/mo</Text></Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{displayTitle}</Text>
            <View style={styles.locationRow}>
              <MapPin size={13} color="#64748B" strokeWidth={2.2} />
              <Text style={styles.locationText}>{displayLocality}</Text>
            </View>

            {/* Specs Row */}
            <View style={styles.specsRow}>
              <View style={styles.specItem}>
                <Text style={styles.specVal}>{displayBhk}</Text>
                <Text style={styles.specLabel}>Layout</Text>
              </View>
              <View style={styles.specDivider} />
              <View style={styles.specItem}>
                <Text style={styles.specVal}>{displaySqft}</Text>
                <Text style={styles.specLabel}>Carpet Area</Text>
              </View>
              <View style={styles.specDivider} />
              <View style={styles.specItem}>
                <Text style={styles.specVal}>{displayFurnishing}</Text>
                <Text style={styles.specLabel}>Status</Text>
              </View>
            </View>

            {/* Host DigiLocker Guarantee */}
            <View style={styles.ownerRow}>
              <ShieldCheck size={16} color="#16A34A" strokeWidth={2.4} />
              <Text style={styles.ownerText}>
                Hosted by <Text style={{ fontWeight: '800' }}>You</Text> (DigiLocker Verified Host)
              </Text>
            </View>
          </View>
        </View>

        {/* Architectural Floor Plan (If Uploaded) */}
        {propertyDraft?.floorPlanUri && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionHeading}>ARCHITECTURAL FLOOR PLAN</Text>
            <View style={styles.floorPlanCard}>
              <View style={styles.floorPlanBadge}>
                <CheckCircle2 size={12} color="#0F766E" />
                <Text style={styles.floorPlanBadgeText}>2D Layout Attached</Text>
              </View>
              <Image
                source={{ uri: propertyDraft.floorPlanUri }}
                style={styles.floorPlanImage}
                resizeMode="cover"
              />
            </View>
          </View>
        )}

        {/* Landlord Launch Perks */}
        <Text style={styles.sectionHeading}>REHVO OWNER PRIVILEGES INCLUDED</Text>
        <View style={styles.perksCard}>
          <View style={styles.perkRow}>
            <View style={[styles.perkIconBox, { backgroundColor: '#DCFCE7' }]}>
              <CheckCircle2 size={16} color="#16A34A" strokeWidth={2.4} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.perkTitle}>Digital Lease Agreement & E-Sign</Text>
              <Text style={styles.perkDesc}>Free Government stamp paper + Aadhaar e-sign generated automatically.</Text>
            </View>
          </View>

          <View style={styles.perkRow}>
            <View style={[styles.perkIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Gift size={16} color="#D97706" strokeWidth={2.4} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.perkTitle}>₹5,000 Host Launch Bonus</Text>
              <Text style={styles.perkDesc}>Instant cash reward deposited into your bank upon your first verified tenant.</Text>
            </View>
          </View>

          <View style={styles.perkRow}>
            <View style={[styles.perkIconBox, { backgroundColor: '#E6FFFA' }]}>
              <Zap size={16} color="#0F766E" strokeWidth={2.4} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.perkTitle}>Direct Tenant WhatsApp & Calls</Text>
              <Text style={styles.perkDesc}>No unverified contacts spamming you. Speak directly to verified owners & brokers.</Text>
            </View>
          </View>
        </View>

        {/* Publish Action Button */}
        <V4Button
          title={publishing ? 'Publishing Listing...' : '🚀 Publish Property Listing'}
          variant="primary"
          size="lg"
          onPress={handlePublish}
          loading={publishing}
          style={styles.publishBtn}
        />
      </ScrollView>

      <V4HostPlanGateModal
        visible={gateModalVisible}
        onClose={() => setGateModalVisible(false)}
        reason={gateReason}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E6EEF0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: V4_COLORS.primary,
    marginTop: 2,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#E2ECEF',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: V4_COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  previewTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  liveBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  previewHint: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E6EEF0',
    marginBottom: 24,
    ...V4_SHADOWS.card,
  },
  cardImageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  zeroBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#0F766E',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  zeroBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pricePill: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(3, 27, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  priceMonth: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
  },
  cardBody: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
    fontWeight: '500',
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFB',
    borderRadius: 16,
    paddingVertical: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#EAF0F2',
  },
  specItem: {
    alignItems: 'center',
  },
  specVal: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  specLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  specDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  ownerText: {
    fontSize: 12,
    color: V4_COLORS.textPrimary,
    marginLeft: 6,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  perksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    gap: 14,
    marginBottom: 24,
    ...V4_SHADOWS.soft,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  perkIconBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  perkDesc: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  floorPlanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    marginTop: 6,
    ...V4_SHADOWS.soft,
  },
  floorPlanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6FFFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  floorPlanBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F766E',
  },
  floorPlanImage: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  publishBtn: {
    marginBottom: 20,
  },
});
