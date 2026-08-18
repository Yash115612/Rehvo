import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Home } from 'lucide-react-native';
import { Property, PropertyImage } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { PropertyTopBar } from './PropertyTopBar';
import { PropertyImageGallery } from './PropertyImageGallery';
import { FullScreenImageViewerModal } from './FullScreenImageViewerModal';
import { PropertyPriceSection } from './PropertyPriceSection';
import { PropertyKeyFacts } from './PropertyKeyFacts';
import { PropertyTrustSection } from './PropertyTrustSection';
import { PropertyAboutSection } from './PropertyAboutSection';
import { PropertyAmenitiesSection } from './PropertyAmenitiesSection';
import { PropertyLocationSection } from './PropertyLocationSection';
import { PropertyOwnerSection } from './PropertyOwnerSection';
import { PropertySafetySection } from './PropertySafetySection';
import { PropertyReportModal, ReportReason } from './PropertyReportModal';
import { PropertySimilarCarousel } from './PropertySimilarCarousel';
import { PropertyBottomBar } from './PropertyBottomBar';
import { ScheduleVisitModal } from './ScheduleVisitModal';
import { OwnerPropertyActionSheet } from '../owner/OwnerPropertyActionSheet';
import { DeletePropertyConfirmModal } from '../owner/properties/DeletePropertyConfirmModal';
import { SendEnquiryModal } from './SendEnquiryModal';

interface PropertyDetailsScreenProps {
  property: Property | null;
  onBack: () => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onScheduleVisit?: (property: Property) => void;
  onContactOwner?: (property: Property) => void;
  isLoading?: boolean;
}

export const PropertyDetailsScreen: React.FC<PropertyDetailsScreenProps> = ({
  property,
  onBack,
  isSaved = false,
  onToggleSave,
  onScheduleVisit,
  onContactOwner,
  isLoading = false,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    user,
    properties,
    toggleSaveProperty,
    updateProperty,
    deleteProperty,
    reportProperty,
    startOrGetConversation,
    showToast,
  } = useAppStore();

  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [ownerActionSheetOpen, setOwnerActionSheetOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);

  const isOwnerOfProperty = useMemo(() => {
    if (!user || !property) return false;
    return (
      property.owner_id === user.id ||
      (user.phone && property.owner_phone === user.phone)
    );
  }, [user, property]);

  const handleEditProperty = (prop: Property) => {
    showToast('Editing property listing...', 'info');
    router.push('/(renter)/listing/property-type');
  };

  const handleToggleStatus = (prop: Property) => {
    const nextStatus = prop.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED';
    updateProperty(prop.id, { status: nextStatus });
    showToast(
      nextStatus === 'PAUSED'
        ? 'Listing paused. It will not appear in renter search.'
        : 'Listing resumed and is now active.',
      'info'
    );
  };

  const handleMarkRented = (prop: Property) => {
    updateProperty(prop.id, { status: 'RENTED' });
    showToast('Listing marked as rented out.', 'info');
  };

  const handleDeleteProperty = () => {
    setOwnerActionSheetOpen(false);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!property) return;
    setIsDeleting(true);
    try {
      const res = await deleteProperty(property.id);
      if (res.success) {
        setDeleteModalOpen(false);
        const userRemaining = user
          ? properties.filter(
              (p) =>
                p.id !== property.id &&
                (p.owner_id === user.id ||
                  (user.phone && p.owner_phone === user.phone))
            )
          : [];
        if (userRemaining.length <= 0) {
          router.replace('/(renter)/profile');
        } else {
          router.replace('/(owner)/properties');
        }
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Similar properties from same locality or general pool
  const similarProperties = useMemo(() => {
    if (!property) return [];
    return properties
      .filter((p) => p.id !== property.id)
      .slice(0, 5);
  }, [properties, property]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C4DFF" />
        <Text style={styles.loadingText}>Loading property details...</Text>
      </SafeAreaView>
    );
  }

  if (!property) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Property unavailable</Text>
          <Text style={styles.errorSubtitle}>
            This listing may have been rented out, paused, or removed by the host.
          </Text>
          <Pressable
            style={styles.errorBtn}
            onPress={() => router.push('/(renter)/search')}
          >
            <Text style={styles.errorBtnText}>Explore other rentals</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const galleryImages: PropertyImage[] =
    property.images && property.images.length > 0
      ? property.images
      : [
          {
            id: 'img_0',
            url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
            is_cover: true,
            sort_order: 0,
          },
        ];

  const handleOpenViewer = (index: number) => {
    setViewerIndex(index);
    setViewerVisible(true);
  };

  const handleToggle = (id: string) => {
    if (onToggleSave) {
      onToggleSave(id);
    } else {
      toggleSaveProperty(id);
    }
  };

  const handleReportSubmit = (reason: ReportReason, details: string) => {
    reportProperty({
      property_id: property.id,
      property_title: property.title,
      reason,
      description: details,
    });
    showToast('Report submitted. Our team will review this listing.', 'info');
  };

  return (
    <View style={styles.root}>
      {/* 1. Floating Top Bar with Back, Share, Save, and Owner Actions */}
      <PropertyTopBar
        property={property}
        isSaved={isSaved}
        isOwner={isOwnerOfProperty}
        onBack={onBack}
        onToggleSave={handleToggle}
        onOpenOwnerActions={() => setOwnerActionSheetOpen(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 95 },
        ]}
      >
        {/* 2. Full-Width Image Gallery */}
        <PropertyImageGallery
          images={galleryImages}
          isVerified={property.verification_status === 'VERIFIED'}
          onOpenViewer={handleOpenViewer}
        />

        {/* 3. Title, Badges, Rent & Cost Breakdown */}
        <PropertyPriceSection property={property} />

        {/* 4. Key Facts Grid */}
        <PropertyKeyFacts property={property} />

        {/* 5. Trust & Verification Section */}
        <PropertyTrustSection property={property} />

        {/* 6. About This Property */}
        <PropertyAboutSection description={property.description} />

        {/* 7. Amenities Grid */}
        <PropertyAmenitiesSection amenities={property.amenities} />

        {/* 8. Location & Transit Points */}
        <PropertyLocationSection property={property} />

        {/* 9. Owner & Response Information */}
        <PropertyOwnerSection
          property={property}
          onEnquire={() => setEnquiryModalOpen(true)}
        />

        {/* 10. Safety & Report Listing */}
        <PropertySafetySection
          onReportPress={() => setReportModalOpen(true)}
        />

        {/* 11. Similar Properties Carousel */}
        <PropertySimilarCarousel
          properties={similarProperties}
          onSelectProperty={(p) => router.push(`/(renter)/property/${p.id}`)}
        />
      </ScrollView>

      {/* 12. Fixed Bottom Action Bar */}
      <PropertyBottomBar
        property={property}
        isStartingChat={isStartingChat}
        onChatWithOwner={async () => {
          if (isStartingChat) return;
          if (__DEV__) {
            console.log('[REHVO CHAT DEBUG] STEP 1 button_pressed on property:', property?.id);
          }
          setIsStartingChat(true);
          try {
            const convId = await startOrGetConversation(property);
            if (convId) {
              if (__DEV__) {
                console.log('[REHVO CHAT DEBUG] STEP 8 navigation_started to route: /(renter)/chat/' + convId);
              }
              router.push(`/(renter)/chat/${convId}`);
            }
          } catch (err: any) {
            if (__DEV__) {
              console.warn('[REHVO CHAT DEBUG] Error in button handler:', err?.message);
            }
            showToast("Unable to start chat. Please try again.", 'error');
          } finally {
            setIsStartingChat(false);
          }
        }}
        onScheduleVisit={() => setScheduleModalOpen(true)}
      />

      {/* Full-Screen Image Viewer Modal */}
      <FullScreenImageViewerModal
        visible={viewerVisible}
        images={galleryImages}
        initialIndex={viewerIndex}
        onClose={() => setViewerVisible(false)}
      />

      {/* Schedule Visit Modal */}
      <ScheduleVisitModal
        property={property}
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
      />

      {/* Send Enquiry Modal */}
      <SendEnquiryModal
        property={property}
        visible={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
      />

      {/* Report Modal */}
      <PropertyReportModal
        visible={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmitReport={handleReportSubmit}
      />

      {/* Owner Manage Action Sheet */}
      <OwnerPropertyActionSheet
        property={property}
        visible={ownerActionSheetOpen}
        onClose={() => setOwnerActionSheetOpen(false)}
        onView={() => setOwnerActionSheetOpen(false)}
        onEdit={handleEditProperty}
        onToggleStatus={handleToggleStatus}
        onMarkRented={handleMarkRented}
        onDelete={handleDeleteProperty}
      />

      {/* Delete Confirmation Modal */}
      <DeletePropertyConfirmModal
        visible={deleteModalOpen}
        property={property}
        isDeleting={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  scrollContent: {
    gap: 24,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777482',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E8E5EC',
    padding: 24,
    alignItems: 'center',
    gap: 10,
    maxWidth: 340,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171522',
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 13.5,
    color: '#777482',
    textAlign: 'center',
    lineHeight: 19,
  },
  errorBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  errorBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
