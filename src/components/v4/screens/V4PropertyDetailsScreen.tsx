import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  Share,
  Linking,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Star,
  CheckCircle2,
  Phone,
  MessageSquare,
  Video,
  Eye,
  FileText,
  ChevronRight,
  Info,
  Flag,
  X,
  Check,
  Clock,
  Compass,
  Layers,
  Play,
  Navigation,
  Mic,
} from 'lucide-react-native';
import { Property } from '../../../types';
import { V4_COLORS, V4_RADIUS, V4_SHADOWS } from '../../../theme/v4Theme';
import { V4Badge } from '../ui/V4Badge';
import { V4Button } from '../ui/V4Button';
import { V4OwnerCard } from '../ui/V4OwnerCard';
import { V4PropertyCardSmall } from '../ui/V4PropertyCardSmall';
import { V4PropertyAICard } from '../ai/V4PropertyAICard';
import { V4NegotiationAssistant } from '../ai/V4NegotiationAssistant';
import { V4PropertyDirectionsModal } from '../ui/V4PropertyDirectionsModal';
import { V4VoiceAssistantModal } from '../ai/V4VoiceAssistantModal';
import { useAppStore } from '../../../store/useAppStore';
import * as propertyService from '../../../services/properties';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface V4PropertyDetailsScreenProps {
  property?: Property;
}

export const V4PropertyDetailsScreen: React.FC<V4PropertyDetailsScreenProps> = ({
  property,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    savedPropertyIds,
    toggleSaveProperty,
    startOrGetConversation,
    recordPropertyView,
    reportPropertyListing,
    scheduleVisit,
    isAuthenticated,
  } = useAppStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // Report Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Fraudulent / Fake Listing');
  const [reportDescription, setReportDescription] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Visit Booking Modal State
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [visitNotes, setVisitNotes] = useState('');
  const [isBookingVisit, setIsBookingVisit] = useState(false);

  // Floor Plan & Virtual Tour States
  const [floorPlanModalOpen, setFloorPlanModalOpen] = useState(false);
  const [virtualTourModalOpen, setVirtualTourModalOpen] = useState(false);
  const [virtualTourRoom, setVirtualTourRoom] = useState<'living' | 'master' | 'kitchen' | 'balcony'>('living');

  // Directions & Voice AI States (V7.1)
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);

  const isSaved = property?.id ? savedPropertyIds.includes(property.id) : false;

  useEffect(() => {
    if (property?.id) {
      recordPropertyView(property.id).catch(() => {});
      setLoadingSimilar(true);
      propertyService
        .getSimilarProperties(property.id, property.locality, property.city, 6)
        .then((res) => {
          if (res.success && res.data) {
            setSimilarProperties(res.data);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingSimilar(false));
    }
  }, [property?.id, property?.locality, property?.city]);

  const images = property?.images && property.images.length > 0
    ? property.images.map((i) => i.url)
    : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
      ];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this Verified Listing listing on REHVO: ${property?.title || 'Luxury Apartment in Mumbai'} - ₹${(property?.rent || 0).toLocaleString('en-IN')}/mo in ${property?.locality || 'Mumbai'}`,
      });
    } catch {
      // Share error handled silently
    }
  };

  const handleToggleSave = async () => {
    if (!property?.id) return;
    if (!isAuthenticated) {
      router.push('/(renter)/login' as any);
      return;
    }
    await toggleSaveProperty(property.id);
  };

  const handleStartChat = async () => {
    if (!property) return;
    if (!isAuthenticated) {
      router.push('/(renter)/login' as any);
      return;
    }
    try {
      const convId = await startOrGetConversation(property);
      if (convId) {
        router.push(`/(renter)/chat/${convId}` as any);
      } else {
        router.push('/(renter)/chat' as any);
      }
    } catch (e) {
      router.push('/(renter)/chat' as any);
    }
  };

  const handleCallOwner = () => {
    if (property?.owner_phone) {
      Linking.openURL(`tel:${property.owner_phone}`).catch(() => {
        handleStartChat();
      });
    } else {
      handleStartChat();
    }
  };

  const handleOpenGallery = () => {
    if (property?.id) {
      router.push(`/(renter)/property/${property.id}/gallery` as any);
    }
  };

  const amenitiesList = property?.amenities && property.amenities.length > 0
    ? property.amenities
    : [
        'High Speed WiFi',
        'Power Backup',
        'Covered Car Parking',
        '24/7 Security & CCTV',
        'Elevator / Lift',
        'Water Supply 24/7',
        'Pet Friendly',
        'Gated Community',
      ];

  return (
    <View style={styles.root}>
      {/* 1. IMMERSIVE SCROLLABLE CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
      >
        {/* Photo Gallery Header */}
        <View style={styles.heroImageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = e.nativeEvent.layoutMeasurement.width;
              const offset = e.nativeEvent.contentOffset.x;
              setActiveImageIndex(Math.round(offset / slide));
            }}
            scrollEventThrottle={16}
          >
            {images.map((img, idx) => (
              <Image key={idx} source={{ uri: img }} style={styles.heroImage} resizeMode="cover" />
            ))}
          </ScrollView>

          <View style={styles.imageOverlay} />

          {/* Floating Action Bar (Back, Share, Heart) */}
          <View style={[styles.floatingTopBar, { paddingTop: Math.max(insets.top, 14) + 4 }]}>
            <Pressable style={styles.glassCircleBtn} onPress={() => router.back()}>
              <ArrowLeft size={18} color="#031B2A" strokeWidth={2.4} />
            </Pressable>

            <View style={styles.topRightBtns}>
              <Pressable style={styles.glassCircleBtn} onPress={handleShare}>
                <Share2 size={16} color="#031B2A" strokeWidth={2.2} />
              </Pressable>

              <Pressable
                style={[styles.glassCircleBtn, isSaved && styles.heartActive]}
                onPress={handleToggleSave}
              >
                <Heart
                  size={16}
                  color={isSaved ? '#EF4444' : '#031B2A'}
                  fill={isSaved ? '#EF4444' : 'none'}
                  strokeWidth={2.4}
                />
              </Pressable>
            </View>
          </View>

          {/* Bottom Floating Triggers: 360 Tour, Gallery Count */}
          <View style={styles.imageBottomRow}>
            <Pressable
              style={styles.tourPill}
              onPress={() => router.push(`/(renter)/tour/${property?.id || 'prop-1'}` as any)}
            >
              <Video size={12} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.tourPillText}>AI 3D Tour™</Text>
            </Pressable>

            <Pressable style={styles.countPill} onPress={handleOpenGallery}>
              <Eye size={12} color="#FFFFFF" />
              <Text style={styles.countPillText}>{activeImageIndex + 1} / {images.length} Photos</Text>
            </Pressable>
          </View>
        </View>

        {/* Property Overview */}
        <View style={styles.mainContent}>
          {/* Badges Row */}
          <View style={styles.badgesRow}>
            <View style={styles.badgeZero}>
              <Sparkles size={11} color="#0F766E" />
              <Text style={styles.badgeZeroText}>VERIFIED LISTING</Text>
            </View>
            <View style={styles.badgeKyc}>
              <ShieldCheck size={11} color="#16A34A" />
              <Text style={styles.badgeKycText}>DIGILOCKER TITLE VERIFIED</Text>
            </View>
          </View>

          {/* Title & Location */}
          <Text style={styles.title}>
            {property?.title || 'Luxury Apartment'}
          </Text>

          <View style={styles.locationRow}>
            <MapPin size={14} color={V4_COLORS.primary} strokeWidth={2.4} />
            <Text style={styles.locationText}>
              {property?.address || `${property?.locality || 'Bandra West'}, ${property?.city || 'Mumbai'}`}
            </Text>
          </View>

          {/* V7.1 Quick Directions & Voice Action Chips */}
          <View style={styles.locationActionRow}>
            <Pressable
              style={styles.directionsBtn}
              onPress={() => setDirectionsModalOpen(true)}
              hitSlop={8}
            >
              <Navigation size={13} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.directionsBtnText}>Get Directions</Text>
            </Pressable>

            <Pressable
              style={styles.voiceAssistantBtn}
              onPress={() => setVoiceAssistantOpen(true)}
              hitSlop={8}
            >
              <Mic size={13} color="#0F766E" strokeWidth={2.4} />
              <Text style={styles.voiceAssistantBtnText}>Ask Voice AI</Text>
            </Pressable>
          </View>

          {/* Key Specs Row */}
          <View style={styles.specsGrid}>
            <View style={styles.specBox}>
              <Bed size={16} color={V4_COLORS.primary} />
              <Text style={styles.specVal}>{property?.bhk || '2 BHK'}</Text>
              <Text style={styles.specLbl}>Bedrooms</Text>
            </View>
            <View style={styles.specBox}>
              <Bath size={16} color={V4_COLORS.primary} />
              <Text style={styles.specVal}>{property?.bathrooms || 2} Baths</Text>
              <Text style={styles.specLbl}>Bathrooms</Text>
            </View>
            <View style={styles.specBox}>
              <Maximize2 size={16} color={V4_COLORS.primary} />
              <Text style={styles.specVal}>{property?.area_sqft || 1150} sqft</Text>
              <Text style={styles.specLbl}>Carpet Area</Text>
            </View>
          </View>

          {/* Pricing & Deposit Breakdown */}
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Monthly Rent</Text>
              <Text style={styles.priceAmount}>
                ₹{(property?.rent || 65000).toLocaleString('en-IN')}/mo
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceSubLabel}>Security Deposit</Text>
              <Text style={styles.priceSubVal}>
                ₹{((property?.deposit || (property?.rent || 65000) * 2)).toLocaleString('en-IN')} (Escrow Safe)
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceSubLabel}>Brokerage Fee</Text>
              <Text style={[styles.priceSubVal, { color: '#16A34A', fontWeight: '900' }]}>
                ₹0 (Zero Commission)
              </Text>
            </View>
          </View>

          {/* About this Property Section */}
          {property?.description ? (
            <View style={styles.aboutSection}>
              <Text style={styles.sectionTitle}>About this Home</Text>
              <Text style={styles.descriptionText}>{property.description}</Text>
            </View>
          ) : null}

          {/* Verified Owner Profile Card */}
          <V4OwnerCard
            name={property?.owner_name || 'Verified Landlord'}
            avatarUrl={property?.owner_avatar}
            onChat={handleStartChat}
            onCall={handleCallOwner}
          />

          {/* Amenities Grid */}
          <View style={styles.amenitiesSection}>
            <Text style={styles.sectionTitle}>Amenities & Features</Text>
            <View style={styles.amenitiesGrid}>
              {amenitiesList.map((am, i) => (
                <View key={i} style={styles.amenityChip}>
                  <CheckCircle2 size={12} color="#16A34A" />
                  <Text style={styles.amenityText}>{am}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Floor Plan Section */}
          <View style={styles.featureSectionCard}>
            <View style={styles.featureSectionHeader}>
              <View style={styles.featureHeaderLeft}>
                <View style={[styles.featureIconBubble, { backgroundColor: '#F0FDF4' }]}>
                  <Layers size={18} color="#0F766E" strokeWidth={2.4} />
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Architectural Floor Plan</Text>
                  <Text style={styles.featureSubtitle}>
                    {property?.area_sqft || 1150} sq.ft • {property?.bhk || 2} BHK Luxury Layout
                  </Text>
                </View>
              </View>
              <Pressable
                style={styles.featureHeaderAction}
                onPress={() => setFloorPlanModalOpen(true)}
              >
                <Eye size={13} color="#0F766E" strokeWidth={2.4} />
                <Text style={styles.featureActionText}>View Full Plan</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.floorPlanPreviewContainer}
              onPress={() => setFloorPlanModalOpen(true)}
            >
              <Image
                source={{
                  uri:
                    property?.floor_plan_url ||
                    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80',
                }}
                style={styles.floorPlanImage}
                resizeMode="cover"
              />
              <View style={styles.floorPlanOverlay}>
                <View style={styles.floorPlanOverlayBadge}>
                  <Layers size={12} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.floorPlanOverlayText}>Detailed Room Dimensions</Text>
                </View>
              </View>
            </Pressable>

            <View style={styles.floorPlanMetricsRow}>
              <View style={styles.floorMetricCol}>
                <Text style={styles.floorMetricLabel}>Carpet Area</Text>
                <Text style={styles.floorMetricVal}>{property?.area_sqft || 980} sq.ft</Text>
              </View>
              <View style={styles.floorMetricDivider} />
              <View style={styles.floorMetricCol}>
                <Text style={styles.floorMetricLabel}>Super Built-up</Text>
                <Text style={styles.floorMetricVal}>{Math.round((property?.area_sqft || 980) * 1.25)} sq.ft</Text>
              </View>
              <View style={styles.floorMetricDivider} />
              <View style={styles.floorMetricCol}>
                <Text style={styles.floorMetricLabel}>Facing</Text>
                <Text style={styles.floorMetricVal}>East / Vastu</Text>
              </View>
            </View>
          </View>

          {/* 360° Virtual Tour Showcase */}
          <View style={styles.featureSectionCard}>
            <View style={styles.featureSectionHeader}>
              <View style={styles.featureHeaderLeft}>
                <View style={[styles.featureIconBubble, { backgroundColor: '#EFF6FF' }]}>
                  <Compass size={18} color="#2563EB" strokeWidth={2.4} />
                </View>
                <View>
                  <Text style={styles.sectionTitle}>REHVO AI Tour™ (3D Walkthrough)</Text>
                  <Text style={styles.featureSubtitle}>Interactive spatial walkthrough & floorplan</Text>
                </View>
              </View>
              <View style={styles.tourBadge}>
                <Text style={styles.tourBadgeText}>AI 3D</Text>
              </View>
            </View>

            <Pressable
              style={styles.virtualTourCard}
              onPress={() => router.push(`/(renter)/tour/${property?.id || 'prop-1'}` as any)}
            >
              <Image
                source={{
                  uri:
                    property?.virtual_tour_url ||
                    images[0] ||
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
                }}
                style={styles.virtualTourImage}
                resizeMode="cover"
              />
              <View style={styles.tourScrim}>
                <View style={styles.tourPlayButton}>
                  <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
                </View>
                <View style={styles.tourMetaTextWrapper}>
                  <Text style={styles.tourMetaTitle}>Tap to Start 360° Walkthrough</Text>
                  <Text style={styles.tourMetaSub}>Explore Living Room, Master Suite & Balcony</Text>
                </View>
              </View>
            </Pressable>
          </View>

          {/* Report Listing Button */}
          <Pressable
            style={styles.reportListingRow}
            onPress={() => setReportModalOpen(true)}
          >
            <Flag size={13} color="#94A3B8" />
            <Text style={styles.reportListingText}>Report an issue with this listing</Text>
          </Pressable>

          {/* Ask REHVO AI Section */}
          {property && <V4PropertyAICard property={property} />}

          {/* Similar Properties Section */}
          {similarProperties.length > 0 && (
            <View style={styles.similarSection}>
              <View style={styles.similarHeaderRow}>
                <Text style={styles.sectionTitle}>Similar Homes Nearby</Text>
                <Text style={styles.similarSub}>Verified Listing</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarScroll}
              >
                {similarProperties.map((simProp) => (
                  <V4PropertyCardSmall
                    key={simProp.id}
                    property={simProp}
                    isSaved={savedPropertyIds.includes(simProp.id)}
                    onToggleSave={() => toggleSaveProperty(simProp.id)}
                    onSelect={() => router.push(`/(renter)/property/${simProp.id}` as any)}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 2. STICKY BOTTOM ACTION BAR */}
      <View style={[styles.stickyBottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomRentLabel}>Rent per month</Text>
          <Text style={styles.bottomRentVal}>
            ₹{(property?.rent || 65000).toLocaleString('en-IN')}
          </Text>
        </View>

        <View style={styles.bottomBtnsRow}>
          {/* Ask REHVO AI Quick Action */}
          <Pressable
            style={[styles.chatIconBtn, { backgroundColor: '#CCFBF1' }]}
            onPress={() => {
              if (property) {
                router.push({
                  pathname: '/(renter)/ai',
                  params: {
                    prompt: `Analyze this property: ${property.title} in ${property.locality}`,
                    propertyId: property.id,
                    context: 'property',
                  },
                } as any);
              }
            }}
            hitSlop={8}
          >
            <Sparkles size={18} color={V4_COLORS.primary} strokeWidth={2.4} />
          </Pressable>

          {/* Voice AI Trigger Button */}
          <Pressable
            style={[styles.chatIconBtn, { backgroundColor: '#E6FFFA' }]}
            onPress={() => setVoiceAssistantOpen(true)}
            hitSlop={8}
            accessibilityLabel="Voice Assistant"
          >
            <Mic size={18} color={V4_COLORS.primary} strokeWidth={2.4} />
          </Pressable>

          <Pressable
            style={styles.chatIconBtn}
            onPress={handleStartChat}
            hitSlop={8}
          >
            <MessageSquare size={18} color={V4_COLORS.primary} strokeWidth={2.4} />
          </Pressable>

          <V4Button
            label="Book Free Visit"
            size="md"
            icon={<Calendar size={14} color="#FFFFFF" strokeWidth={2.4} />}
            onPress={() => setVisitModalOpen(true)}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      {/* Quick Visit Booking Modal */}
      <Modal
        visible={visitModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setVisitModalOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setVisitModalOpen(false)}>
          <Pressable style={styles.sheetContainer} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Schedule Physical Visit</Text>
                <Text style={styles.sheetSubtitle}>Verified Listing Direct Owner Meet</Text>
              </View>
              <Pressable hitSlop={12} onPress={() => setVisitModalOpen(false)}>
                <X size={20} color="#64748B" />
              </Pressable>
            </View>

            <Text style={styles.sheetSectionLabel}>Select Preferred Day</Text>
            <View style={styles.optionsRow}>
              {['Tomorrow', 'In 2 Days', 'This Saturday', 'This Sunday'].map((d) => (
                <Pressable
                  key={d}
                  style={[styles.choiceChip, selectedDate === d && styles.choiceChipActive]}
                  onPress={() => setSelectedDate(d)}
                >
                  <Text style={[styles.choiceChipText, selectedDate === d && styles.choiceChipTextActive]}>
                    {d}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.sheetSectionLabel, { marginTop: 14 }]}>Select Time Slot</Text>
            <View style={styles.optionsRow}>
              {['11:00 AM', '02:30 PM', '05:30 PM', '07:00 PM'].map((t) => (
                <Pressable
                  key={t}
                  style={[styles.choiceChip, selectedTime === t && styles.choiceChipActive]}
                  onPress={() => setSelectedTime(t)}
                >
                  <Text style={[styles.choiceChipText, selectedTime === t && styles.choiceChipTextActive]}>
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>

            <V4Button
              label={isBookingVisit ? "Confirming..." : "Confirm Free Visit Request"}
              size="lg"
              loading={isBookingVisit}
              onPress={async () => {
                if (!property?.id) return;
                if (!isAuthenticated) {
                  setVisitModalOpen(false);
                  router.push('/(renter)/login' as any);
                  return;
                }
                setIsBookingVisit(true);
                await scheduleVisit({
                  property_id: property.id,
                  date: selectedDate,
                  time: selectedTime,
                  notes: visitNotes,
                  property_title: property.title,
                  property_image: property.images?.[0]?.url,
                  property_locality: property.locality,
                  rent: property.rent,
                  owner_id: property.owner_id,
                  owner_name: property.owner_name,
                });
                setIsBookingVisit(false);
                setVisitModalOpen(false);
                router.push('/(renter)/visits' as any);
              }}
              style={{ marginTop: 20 }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Report Listing Modal */}
      <Modal
        visible={reportModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setReportModalOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setReportModalOpen(false)}>
          <Pressable style={styles.sheetContainer} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Report this Listing</Text>
                <Text style={styles.sheetSubtitle}>Help us keep REHVO 100% verified & safe</Text>
              </View>
              <Pressable hitSlop={12} onPress={() => setReportModalOpen(false)}>
                <X size={20} color="#64748B" />
              </Pressable>
            </View>

            <Text style={styles.sheetSectionLabel}>Reason for Report</Text>
            {[
              'Fraudulent / Fake Listing',
              'Incorrect Rent or Hidden Fees',
              'Photos / Info Don\'t Match',
              'Property Already Rented',
              'Other Issue',
            ].map((reason) => {
              const isSelected = reportReason === reason;
              return (
                <Pressable
                  key={reason}
                  style={styles.reasonRow}
                  onPress={() => setReportReason(reason)}
                >
                  <Text style={[styles.reasonText, isSelected && styles.reasonTextActive]}>
                    {reason}
                  </Text>
                  {isSelected && <Check size={18} color="#0F766E" strokeWidth={2.5} />}
                </Pressable>
              );
            })}

            <TextInput
              style={styles.reportInput}
              placeholder="Additional details (optional)..."
              placeholderTextColor="#94A3B8"
              value={reportDescription}
              onChangeText={setReportDescription}
              multiline
              numberOfLines={3}
            />

            <V4Button
              label={isSubmittingReport ? "Submitting..." : "Submit Report"}
              size="lg"
              loading={isSubmittingReport}
              onPress={async () => {
                if (!property?.id) return;
                setIsSubmittingReport(true);
                await reportPropertyListing(property.id, reportReason, reportDescription);
                setIsSubmittingReport(false);
                setReportModalOpen(false);
                setReportDescription('');
              }}
              style={{ marginTop: 14 }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Floor Plan Fullscreen Modal */}
      <Modal
        visible={floorPlanModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setFloorPlanModalOpen(false)}
      >
        <View style={styles.fullscreenModalOverlay}>
          <View style={styles.fullscreenModalContainer}>
            <View style={styles.modalSheetHeader}>
              <View>
                <Text style={styles.modalTitle}>Architectural Floor Plan</Text>
                <Text style={styles.modalSub}>
                  {property?.area_sqft || 1150} sq.ft • {property?.bhk || 2} BHK Layout
                </Text>
              </View>
              <Pressable
                style={styles.closeCircleBtn}
                onPress={() => setFloorPlanModalOpen(false)}
              >
                <X size={18} color="#0F172A" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
              <View style={styles.blueprintContainer}>
                <Image
                  source={{
                    uri:
                      property?.floor_plan_url ||
                      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80',
                  }}
                  style={styles.blueprintImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.breakdownHeader}>Room-by-Room Dimensions</Text>
              <View style={styles.dimensionsTable}>
                {[
                  { room: 'Living & Dining Hall', size: '21\'4" × 14\'6"', type: 'Carpet Area: 310 sq.ft' },
                  { room: 'Master Suite Bedroom', size: '15\'0" × 13\'2"', type: 'Ensuite bath attached' },
                  { room: 'Guest Bedroom', size: '13\'6" × 11\'4"', type: 'Wardrobe niche included' },
                  { room: 'Modular Kitchen', size: '11\'0" × 8\'6"', type: 'Dry balcony attached' },
                  { room: 'Open Sundeck Balcony', size: '14\'0" × 5\'0"', type: 'Panoramic view deck' },
                ].map((item, idx) => (
                  <View key={idx} style={styles.dimensionRow}>
                    <View>
                      <Text style={styles.dimRoomName}>{item.room}</Text>
                      <Text style={styles.dimRoomType}>{item.type}</Text>
                    </View>
                    <Text style={styles.dimSizeText}>{item.size}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.complianceCard}>
                <ShieldCheck size={18} color="#0F766E" />
                <Text style={styles.complianceText}>
                  Verified Architectural Blueprint • 100% Vastu Compliant (East Facing Entry)
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 360° Virtual Tour Fullscreen Modal */}
      <Modal
        visible={virtualTourModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setVirtualTourModalOpen(false)}
      >
        <View style={styles.tourModalOverlay}>
          <View style={styles.tourModalContainer}>
            <View style={styles.tourTopBar}>
              <View>
                <Text style={styles.tourTitle}>360° Virtual Walkthrough</Text>
                <Text style={styles.tourSubtitle}>{property?.title || 'Luxury Residence'}</Text>
              </View>
              <Pressable
                style={styles.closeTourBtn}
                onPress={() => setVirtualTourModalOpen(false)}
              >
                <X size={18} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Room Switcher Tabs */}
            <View style={styles.tourTabsRow}>
              {[
                { id: 'living', label: 'Living Room' },
                { id: 'master', label: 'Master Suite' },
                { id: 'kitchen', label: 'Kitchen' },
                { id: 'balcony', label: 'Balcony Deck' },
              ].map((tab) => {
                const isActive = virtualTourRoom === tab.id;
                return (
                  <Pressable
                    key={tab.id}
                    style={[styles.tourTabPill, isActive && styles.tourTabPillActive]}
                    onPress={() => setVirtualTourRoom(tab.id as any)}
                  >
                    <Text style={[styles.tourTabText, isActive && styles.tourTabTextActive]}>
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* 360 View Frame */}
            <View style={styles.tour360Canvas}>
              <Image
                source={{
                  uri:
                    virtualTourRoom === 'living'
                      ? images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'
                      : virtualTourRoom === 'master'
                      ? images[1] || 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=1200&auto=format&fit=crop&q=80'
                      : virtualTourRoom === 'kitchen'
                      ? images[2] || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80'
                      : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
                }}
                style={styles.tourCanvasImage}
                resizeMode="cover"
              />
              <View style={styles.tourGyroPill}>
                <Compass size={14} color="#FFFFFF" />
                <Text style={styles.tourGyroText}>Interactive 360° Sphere Active</Text>
              </View>

              <View style={styles.tourHotspotBadge}>
                <Sparkles size={12} color="#FBBF24" />
                <Text style={styles.tourHotspotText}>
                  {virtualTourRoom === 'living'
                    ? 'Italian Marble Flooring • Double Glazed Glass'
                    : virtualTourRoom === 'master'
                    ? 'Engineered Hardwood • Walk-in Wardrobe'
                    : virtualTourRoom === 'kitchen'
                    ? 'Quartz Countertops • Hafele Fittings'
                    : 'Unobstructed Green Garden View'}
                </Text>
              </View>
            </View>

            <View style={styles.tourBottomActions}>
              <V4Button
                label="Book In-Person Site Visit"
                variant="primary"
                size="lg"
                onPress={() => {
                  setVirtualTourModalOpen(false);
                  setVisitModalOpen(true);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Realtime Multi-Modal Transit Directions Modal (V7.1) */}
      <V4PropertyDirectionsModal
        visible={directionsModalOpen}
        onClose={() => setDirectionsModalOpen(false)}
        propertyTitle={property?.title || 'Property'}
        propertyLocality={property?.locality || 'Bandra West'}
        propertyCoordinates={{
          latitude: property?.latitude || 19.0596,
          longitude: property?.longitude || 72.8295,
        }}
      />

      {/* Flagship Voice AI Assistant Modal (V7.1) */}
      <V4VoiceAssistantModal
        visible={voiceAssistantOpen}
        onClose={() => setVoiceAssistantOpen(false)}
        initialQuery={property ? `Tell me about ${property.title} in ${property.locality}` : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: V4_COLORS.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroImageContainer: {
    width: '100%',
    height: 320,
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: 320,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 27, 42, 0.25)',
  },
  floatingTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  glassCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...V4_SHADOWS.soft,
  },
  topRightBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  heartActive: {
    backgroundColor: '#FFF1F2',
  },
  imageBottomRow: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tourPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(3, 27, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tourPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(3, 27, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  countPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  mainContent: {
    padding: 16,
    gap: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badgeZero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6FFFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeZeroText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#0F766E',
  },
  badgeKyc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeKycText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#16A34A',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    letterSpacing: -0.4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  locationActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: V4_COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.25)',
    minHeight: 44,
  },
  directionsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.primary,
  },
  voiceAssistantBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    minHeight: 44,
  },
  voiceAssistantBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: V4_COLORS.primary,
  },
  specsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  specBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 2,
    ...V4_SHADOWS.soft,
  },
  specVal: {
    fontSize: 13,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
    marginTop: 4,
  },
  specLbl: {
    fontSize: 10,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    gap: 8,
    ...V4_SHADOWS.soft,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: V4_COLORS.primary,
  },
  priceSubLabel: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
  },
  priceSubVal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  amenitiesSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  amenityText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
  aboutSection: {
    gap: 8,
  },
  descriptionText: {
    fontSize: 13.5,
    color: V4_COLORS.textSecondary,
    lineHeight: 20,
    fontWeight: '500',
  },
  similarSection: {
    gap: 12,
    marginTop: 8,
  },
  similarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  similarSub: {
    fontSize: 11.5,
    fontWeight: '800',
    color: V4_COLORS.primary,
  },
  similarScroll: {
    gap: 12,
    paddingRight: 16,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2ECEF',
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...V4_SHADOWS.floating,
  },
  bottomPriceCol: {
    gap: 1,
  },
  bottomRentLabel: {
    fontSize: 10,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  bottomRentVal: {
    fontSize: 18,
    fontWeight: '900',
    color: V4_COLORS.textPrimary,
  },
  bottomBtnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 0.65,
  },
  chatIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 118, 110, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportListingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginVertical: 4,
  },
  reportListingText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  sheetSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  sheetSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choiceChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  choiceChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  choiceChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  choiceChipTextActive: {
    color: '#FFFFFF',
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  reasonText: {
    fontSize: 13.5,
    color: '#334155',
    fontWeight: '600',
  },
  reasonTextActive: {
    color: '#0F766E',
    fontWeight: '800',
  },
  reportInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    marginTop: 12,
    minHeight: 64,
    textAlignVertical: 'top',
  },
  featureSectionCard: {
    backgroundColor: V4_COLORS.surface,
    borderRadius: V4_RADIUS.card,
    borderWidth: 1,
    borderColor: V4_COLORS.border,
    padding: 16,
    marginTop: 16,
    ...V4_SHADOWS.card,
  },
  featureSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featureHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  featureIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureSubtitle: {
    fontSize: 12,
    color: V4_COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  featureHeaderAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
  },
  featureActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  floorPlanPreviewContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  floorPlanImage: {
    width: '100%',
    height: '100%',
  },
  floorPlanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
    justifyContent: 'flex-end',
    padding: 10,
  },
  floorPlanOverlayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 118, 110, 0.85)',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  floorPlanOverlayText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  floorPlanMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  floorMetricCol: {
    alignItems: 'center',
  },
  floorMetricLabel: {
    fontSize: 10.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '600',
  },
  floorMetricVal: {
    fontSize: 13,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 2,
  },
  floorMetricDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#E2E8F0',
  },
  tourBadge: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  tourBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },
  virtualTourCard: {
    width: '100%',
    height: 190,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  virtualTourImage: {
    width: '100%',
    height: '100%',
  },
  tourScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.38)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  tourPlayButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(15, 118, 110, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...V4_SHADOWS.card,
  },
  tourMetaTextWrapper: {
    alignItems: 'center',
    marginTop: 10,
  },
  tourMetaTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tourMetaSub: {
    fontSize: 11.5,
    color: '#E2E8F0',
    marginTop: 2,
  },
  fullscreenModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  fullscreenModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
  },
  modalSub: {
    fontSize: 12.5,
    color: V4_COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  closeCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueprintContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueprintImage: {
    width: '100%',
    height: '100%',
  },
  breakdownHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: V4_COLORS.textPrimary,
    marginTop: 18,
    marginBottom: 10,
  },
  dimensionsTable: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
  },
  dimensionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dimRoomName: {
    fontSize: 13,
    fontWeight: '700',
    color: V4_COLORS.textPrimary,
  },
  dimRoomType: {
    fontSize: 11,
    color: V4_COLORS.textSecondary,
    marginTop: 1,
  },
  dimSizeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  complianceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginTop: 16,
    marginBottom: 24,
  },
  complianceText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#15803D',
    flex: 1,
  },
  tourModalOverlay: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  tourModalContainer: {
    flex: 1,
    paddingTop: 48,
    justifyContent: 'space-between',
  },
  tourTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tourTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tourSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeTourBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tourTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  tourTabPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  tourTabPillActive: {
    backgroundColor: '#0F766E',
  },
  tourTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tourTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  tour360Canvas: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 12,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  tourCanvasImage: {
    width: '100%',
    height: '100%',
  },
  tourGyroPill: {
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tourGyroText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tourHotspotBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  tourHotspotText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  tourBottomActions: {
    padding: 16,
    backgroundColor: '#0F172A',
  },
});
