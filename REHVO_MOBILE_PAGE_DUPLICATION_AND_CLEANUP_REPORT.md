# REHVO Expo Mobile App — Screen & Route Duplication & Cleanup Report

---

## 1. Executive Summary & Metrics

An exhaustive architectural audit of the entire **REHVO Expo Mobile App** (`app/`, `src/`, `assets/`) was conducted. All active user journeys, route trees, components, navigation targets, and services were cataloged and cross-referenced.

| Metric | Pre-Audit | Post-Cleanup | Status |
| :--- | :--- | :--- | :--- |
| **Total Route Files (`app/`)** | 66 | 58 | Cleaned & Consolidated |
| **Total UI Components (`src/components/`)** | 235 | 164 | **71 dead files removed** |
| **Active Canonical Service Modules** | 9 | 9 | Fully verified |
| **Duplicate Listing Wizards** | 2 (Renter 12-step & Owner 6-step) | **1 Canonical 12-step Wizard** | Consolidated |
| **TypeScript Compilation Errors** | 0 | **0 Errors (`npx tsc --noEmit`)** | **PASS** |
| **Architecture Boundary Violations** | 0 | **0 Violations (`audit_architecture_separation.py`)** | **PASS** |
| **Web & Admin Status** | Frozen | **100% Untouched** | **PASS** |

---

## 2. Feature-by-Feature Duplicate Audit & Canonical Mapping

### 2.1 Home Screen
- **Canonical Route**: `app/(renter)/home.tsx`
- **Canonical Component**: [`src/components/home/RenterHomeScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/RenterHomeScreen.tsx)
- **Active Subcomponents (16)**: `HomeTopHeader`, `HomeSearchBar`, `HomeCategoryShortcuts`, `HomePromotionalCarousel`, `HomeRecommendedCarousel`, `HomePopularNearby`, `HomeResidentialSection`, `HomeCommercialSection`, `HomePgRoomsSection`, `HomeFlatmatesSection`, `HomeExploreGrid`, `HomeCitiesLiveSection`, `HomePopularPropertiesSection`, `HomeWhyRehvo`, `HomeHostCTA`, `HomeCreateFlatmateCTA`, `HomeSkeleton`.
- **Removed Dead Components (26)**: `AdCarousel`, `AnimatedCategoryContent`, `HomeActivitySection`, `HomeCapabilitySection`, `HomeCategoryCarousel`, `HomeCreationSection`, `HomeDiscoveryCTA`, `HomeFeaturedPlacement`, `HomeFeaturedSection`, `HomeFeaturedStory`, `HomeFlatmatePromoCard`, `HomeHeader`, `HomeHero`, `HomeLocalitySpotlight`, `HomeLocationCarousel`, `HomeLocationRow`, `HomeNotificationsCard`, `HomePrimarySearch`, `HomeProductFeaturesStrip`, `HomePromoBanner`, `HomePropertyGrid`, `HomeQuickActionsRow`, `HomeQuickFilters`, `HomeSearchModule`, `HomeSecondaryDiscovery`, `HomeSpotlightCard`.

### 2.2 Property Details Screen
- **Canonical Route**: `app/(renter)/property/[id].tsx`
- **Canonical Component**: [`src/components/property/PropertyDetailsScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/property/PropertyDetailsScreen.tsx)
- **Active Subcomponents**: `PropertyTopBar`, `PropertyImageGallery`, `PropertyKeyFacts`, `PropertyAboutSection`, `PropertyAmenitiesSection`, `PropertyLocationSection`, `PropertyOwnerSection`, `PropertyPriceSection`, `PropertySafetySection`, `PropertyTrustSection`, `PropertySimilarCarousel`, `PropertyBottomBar`, `ScheduleVisitModal`, `SendEnquiryModal`, `FullScreenImageViewerModal`, `PropertyReportModal`.
- **Removed Dead Components (2)**: `ApplicationModal.tsx`, `PropertyDetailModal.tsx`.

### 2.3 Commercial Discovery
- **Canonical Route**: `app/(renter)/commercial.tsx`
- **Canonical Component**: [`src/components/commercial/CommercialDiscoveryScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/commercial/CommercialDiscoveryScreen.tsx)
- **Active Subcomponents**: `CommercialPropertyCard`, `CategorySkeleton`.
- **Removed Dead Components**: Obsolete category prototypes (`RentPropertyCard`, `PGPropertyCard`, etc.).

### 2.4 PG & Rooms Discovery
- **Canonical Route**: `app/(renter)/pg-rooms.tsx` (with aliases `pg.tsx`, `rooms.tsx`)
- **Canonical Component**: [`src/components/pg/PgRoomsDiscoveryScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/pg/PgRoomsDiscoveryScreen.tsx)
- **Removed Dead Components**: `PGFilterModal.tsx`, `RoomFilterModal.tsx`, `StudioFilterModal.tsx`.

### 2.5 Flatmates Community
- **Canonical Feed Route**: `app/(renter)/flatmates.tsx` $\rightarrow$ `FlatmateDiscoveryFeed.tsx`
- **Canonical Profile Route**: `app/(renter)/flatmate/[id].tsx` $\rightarrow$ `FlatmateDetailsScreen.tsx`
- **Canonical Create/Edit Route**: `app/(renter)/flatmate/create.tsx` & `edit.tsx` $\rightarrow$ `FlatmateCreateFlowScreen.tsx`
- **Canonical My Profile Route**: `app/(renter)/flatmate/my-profile.tsx` $\rightarrow$ `MyFlatmateProfileScreen.tsx`

### 2.6 Search Screen
- **Canonical Route**: `app/(renter)/search.tsx`
- **Canonical Components**: `REHVOSearchBar.tsx`, `SearchPropertyCard.tsx`, `SearchSkeletonCard.tsx`, `SearchEmptyState.tsx`, `ResultsHeader.tsx`, `GuidedSearchModal.tsx`, `MapDiscoveryView.tsx`, `FilterBottomSheet.tsx`, `SortBottomSheet.tsx`.
- **Removed Dead Components (7)**: `SearchBar.tsx`, `SearchHeader.tsx`, `SearchSuggestions.tsx`, `QuickFilterRow.tsx`, `ActiveFilterChips.tsx`, `PropertyTypeFilter.tsx`, `SearchModal.tsx`.

### 2.7 Saved Screen
- **Canonical Route**: `app/(renter)/saved.tsx`
- **Active Subcomponents**: `SavedCard.tsx`, `SavedEmptyState.tsx`, `SavedSkeleton.tsx`, `SavedSortModal.tsx`.
- **Removed Dead Component (1)**: `SavedScreen.tsx` (subsumed by route file).

### 2.8 Chat & Messaging
- **Canonical Renter Chat List**: `app/(renter)/chat/index.tsx` $\rightarrow$ `RenterChatListScreen.tsx`
- **Canonical Owner Chat List**: `app/(owner)/chat/index.tsx` $\rightarrow$ `OwnerChatListScreen.tsx`
- **Canonical Conversation Screen**: `app/(renter)/chat/[id].tsx` & `app/(owner)/chat/[id].tsx` $\rightarrow$ [`src/components/chat/SharedConversationScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/chat/SharedConversationScreen.tsx)
- **Removed Dead Component (1)**: `src/components/owner/chat/OwnerChatScreen.tsx`.

### 2.9 Visits & Scheduling
- **Canonical Renter Schedule Route**: `app/(renter)/visit/schedule.tsx`
- **Canonical Owner Visits Screen**: `app/(owner)/visits.tsx` $\rightarrow$ `OwnerVisitsScreen.tsx`
- **Active Subcomponents**: `ScheduleVisitModal`, `OwnerVisitCard`, `OwnerVisitDetailsModal`, `OwnerCancelVisitModal`, `OwnerRescheduleModal`.

### 2.10 Profile & Role Management
- **Canonical Profile Screen**: [`src/components/profile/ProfileHubScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/profile/ProfileHubScreen.tsx) (Unified for Renters & Owners with seamless role-switching)
- **Active Subcomponents**: `EditProfileModal`, `EditPreferencesModal`, `ProfileAvatarEditor`, `ApplicationsModal`, `EnquiriesModal`, `VisitsModal`, `InfoSheetModal`, `ModeSwitcherModal`.
- **Removed Dead Components (10)**: 10 duplicate legacy owner profile files in `src/components/owner/profile/*`.

### 2.11 Owner Dashboard & Management
- **Canonical Owner Dashboard**: `app/(owner)/dashboard.tsx` $\rightarrow$ `OwnerDashboardScreen.tsx`
- **Canonical Owner Properties**: `app/(owner)/properties.tsx` $\rightarrow$ `OwnerMyPropertiesScreen.tsx`
- **Canonical Owner Enquiries**: `app/(owner)/enquiries.tsx` $\rightarrow$ `OwnerEnquiriesScreen.tsx`
- **Canonical Owner Visits**: `app/(owner)/visits.tsx` $\rightarrow$ `OwnerVisitsScreen.tsx`

### 2.12 Property Listing Wizard (Consolidated)
- **Canonical 12-Step Property Listing Wizard**: `app/(renter)/listing/*` (13 step routes + `ListingExitModal`, `ListingHeader`).
- **Removed Duplicate Wizard (8 files)**: `app/(owner)/listing/*` (8 duplicate legacy files removed; all owner entry points now navigate to the canonical 12-step wizard).

---

## 3. List of Removed Dead Files (79 Total)

```
REMOVED LEGACY FILES:
├── app/(owner)/listing/ (8 files)
│   ├── _layout.tsx
│   ├── property-type.tsx
│   ├── details.tsx
│   ├── location.tsx
│   ├── amenities.tsx
│   ├── photos.tsx
│   ├── preview.tsx
│   └── publish.tsx
├── src/components/home/ (26 files)
│   ├── AdCarousel.tsx, AnimatedCategoryContent.tsx, HomeActivitySection.tsx
│   ├── HomeCapabilitySection.tsx, HomeCategoryCarousel.tsx, HomeCreationSection.tsx
│   ├── HomeDiscoveryCTA.tsx, HomeFeaturedPlacement.tsx, HomeFeaturedSection.tsx
│   ├── HomeFeaturedStory.tsx, HomeFlatmatePromoCard.tsx, HomeHeader.tsx
│   ├── HomeHero.tsx, HomeLocalitySpotlight.tsx, HomeLocationCarousel.tsx
│   ├── HomeLocationRow.tsx, HomeNotificationsCard.tsx, HomePrimarySearch.tsx
│   ├── HomeProductFeaturesStrip.tsx, HomePromoBanner.tsx, HomePropertyGrid.tsx
│   ├── HomeQuickActionsRow.tsx, HomeQuickFilters.tsx, HomeSearchModule.tsx
│   └── HomeSecondaryDiscovery.tsx, HomeSpotlightCard.tsx
├── src/components/categories/ (10 files)
│   ├── CategoryEmptyState.tsx, CategoryHeader.tsx, PGFilterModal.tsx, PGPropertyCard.tsx
│   ├── RentFilterModal.tsx, RentPropertyCard.tsx, RoomFilterModal.tsx
│   └── RoomPropertyCard.tsx, StudioFilterModal.tsx, StudioPropertyCard.tsx
├── src/components/explore/ (5 files)
│   ├── ExploreSkeletonLoading.tsx, FeaturedPropertyCard.tsx, PropertyCardHorizontal.tsx
│   └── PropertyCardVertical.tsx, SearchModal.tsx
├── src/components/owner/profile/ (10 files)
│   ├── OwnerAccountActionsSection.tsx, OwnerActivityOverview.tsx, OwnerManageActionsSection.tsx
│   ├── OwnerPreferencesSection.tsx, OwnerProfileHeader.tsx, OwnerProfileHero.tsx
│   ├── OwnerProfileScreen.tsx, OwnerSettingsSection.tsx, OwnerSwitchToRenterCard.tsx
│   └── OwnerVerificationSection.tsx
├── src/components/search/ (6 files)
│   ├── ActiveFilterChips.tsx, PropertyTypeFilter.tsx, QuickFilterRow.tsx
│   └── SearchBar.tsx, SearchHeader.tsx, SearchSuggestions.tsx
├── src/components/owner/ (3 files)
│   ├── OwnerDashboardPlaceholder.tsx, OwnerChatScreen.tsx, OwnerPropertySkeleton.tsx
├── src/components/navigation/ (2 files)
│   ├── AppBackButton.tsx, BottomNavigation.tsx
├── src/components/auth/ (2 files)
│   ├── AuthModal.tsx, EmailVerificationScreen.tsx
├── src/components/common/ (4 files)
│   ├── FilterModal.tsx, LocationPickerModal.tsx, PropertyDetailModal.tsx, SuccessState.tsx
├── src/components/saved/ (1 file)
│   └── SavedScreen.tsx
├── src/components/property/ (1 file)
│   └── ApplicationModal.tsx
└── src/components/ui/ (1 file)
    └── Toast.tsx
```

---

## 4. Canonical Route Architecture

```
REHVO MOBILE CANONICAL ENTRY POINTS:
├── Auth & Onboarding ────► app/(auth)/*
├── Renter Home ──────────► app/(renter)/home.tsx (RenterHomeScreen)
├── Search ───────────────► app/(renter)/search.tsx (REHVOSearchBar + GuidedSearch)
├── Saved ────────────────► app/(renter)/saved.tsx (SavedCard + Tabs)
├── Property Details ─────► app/(renter)/property/[id].tsx (PropertyDetailsScreen)
├── Commercial ───────────► app/(renter)/commercial.tsx (CommercialDiscoveryScreen)
├── PG & Rooms ───────────► app/(renter)/pg-rooms.tsx (PgRoomsDiscoveryScreen)
├── Flatmate Community ───► app/(renter)/flatmates.tsx (FlatmateDiscoveryFeed)
├── Chat & Messaging ─────► app/(renter)/chat/[id].tsx & app/(owner)/chat/[id].tsx (SharedConversationScreen)
├── Unified Profile ──────► app/(renter)/profile.tsx & app/(owner)/profile.tsx (ProfileHubScreen)
├── Owner Dashboard ──────► app/(owner)/dashboard.tsx (OwnerDashboardScreen)
├── Owner Properties ─────► app/(owner)/properties.tsx (OwnerMyPropertiesScreen)
├── Owner Enquiries ──────► app/(owner)/enquiries.tsx (OwnerEnquiriesScreen)
├── Owner Visits ─────────► app/(owner)/visits.tsx (OwnerVisitsScreen)
└── 12-Step Listing Wizard ► app/(renter)/listing/property-type.tsx -> publish.tsx
```

---

## 5. Verification & Quality Assurance

| Verification Item | Command | Result |
| :--- | :--- | :--- |
| **Mobile TypeScript Compilation** | `npx tsc --noEmit` in root | **0 errors (Exit code 0)** |
| **3-App Architecture Boundary Audit** | `python3 scripts/audit_architecture_separation.py` | **0 violations (Exit code 0)** |
| **Public Website Isolation** | `web/` verified untouched | **PASS (FROZEN)** |
| **Admin Panel Isolation** | `admin/` verified untouched | **PASS (FROZEN)** |
