'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicProperty } from '@/lib/seo/types';
import { PropertyHeroGallery } from './PropertyHeroGallery';
import { PropertyHeaderIdentity } from './PropertyHeaderIdentity';
import { PropertyPriceSummary } from './PropertyPriceSummary';
import { PropertyQuickFacts } from './PropertyQuickFacts';
import { PropertyAbout } from './PropertyAbout';
import { PropertyAmenities } from './PropertyAmenities';
import { PropertySpecifications } from './PropertySpecifications';
import { PropertyBuildingDetails } from './PropertyBuildingDetails';
import { PropertyLocationSection } from './PropertyLocationSection';
import { PropertyOwnerSection } from './PropertyOwnerSection';
import { PropertyStickyActionPanel } from './PropertyStickyActionPanel';
import { PropertyActionModals } from './PropertyActionModals';
import { PropertySimilarSection } from './PropertySimilarSection';
import { AppDownloadBanner } from '@/components/public/AppDownloadBanner';
import { useAuth } from '@/lib/auth/AuthContext';
import { getOrCreatePropertyConversation } from '@/services/chat';

interface PropertyDetailsClientProps {
  property: PublicProperty;
  similarProperties: PublicProperty[];
}

export const PropertyDetailsClient: React.FC<PropertyDetailsClientProps> = ({
  property,
  similarProperties,
}) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const handleOpenChat = async () => {
    if (!isAuthenticated || !user) {
      router.push('/download');
      return;
    }

    if (user.id === property.owner_id) {
      alert('This is your own listing.');
      return;
    }

    const res = await getOrCreatePropertyConversation(property.id, user.id);
    if (res.success && res.data) {
      router.push(`/chat/${res.data}`);
    } else {
      alert(res.error || 'Failed to open conversation.');
    }
  };

  return (
    <>
      <div className="space-y-6 sm:space-y-8 pb-20 lg:pb-12">
        {/* 1. Property Hero / Image Gallery (with Lightbox, Back, Share, Save) */}
        <PropertyHeroGallery property={property} />

        {/* 2. Main Content & Sticky Conversion Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 Cols on Desktop): Core Property Decisions */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Title & Location Bar */}
            <PropertyHeaderIdentity property={property} />

            {/* Price Breakdown */}
            <PropertyPriceSummary property={property} />

            {/* Quick Facts Grid */}
            <PropertyQuickFacts property={property} />

            {/* About this Property Description */}
            <PropertyAbout property={property} />

            {/* Amenities Grid */}
            <PropertyAmenities property={property} />

            {/* Detailed Key-Value Specifications */}
            <PropertySpecifications property={property} />

            {/* Building / Society Info */}
            <PropertyBuildingDetails property={property} />

            {/* Location & Neighborhood Transit Highlights */}
            <PropertyLocationSection property={property} />

            {/* Direct Owner Trust & Conversion Section */}
            <PropertyOwnerSection
              property={property}
              onOpenVisitModal={() => setVisitModalOpen(true)}
              onOpenEnquiryModal={() => setEnquiryModalOpen(true)}
            />
          </div>

          {/* Right Column (4 Cols on Desktop): Sticky Conversion Panel */}
          <div className="lg:col-span-4">
            <PropertyStickyActionPanel
              property={property}
              onOpenVisitModal={() => setVisitModalOpen(true)}
              onOpenEnquiryModal={() => setEnquiryModalOpen(true)}
              onOpenReportModal={() => setReportModalOpen(true)}
            />
          </div>
        </div>

        {/* 3. Similar Nearby Properties */}
        <PropertySimilarSection
          currentProperty={property}
          similarProperties={similarProperties}
        />

        {/* 4. App Download CTA */}
        <AppDownloadBanner propertyId={property.id} />
      </div>

      {/* Interactive Conversion & Safety Modals */}
      <PropertyActionModals
        property={property}
        visitModalOpen={visitModalOpen}
        onCloseVisitModal={() => setVisitModalOpen(false)}
        enquiryModalOpen={enquiryModalOpen}
        onCloseEnquiryModal={() => setEnquiryModalOpen(false)}
        reportModalOpen={reportModalOpen}
        onCloseReportModal={() => setReportModalOpen(false)}
        onOpenChat={handleOpenChat}
      />
    </>
  );
};
