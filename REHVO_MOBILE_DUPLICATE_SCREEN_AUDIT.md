# REHVO Expo Mobile App — Complete Screen & Route Duplicate Audit

---

## 1. Executive Summary

This comprehensive audit inspects the entire **REHVO Expo Mobile App** (`app/`, `src/`, `assets/`) across all navigation paths, feature domains, and UI components. 

The audit evaluated:
- **66 route files** across `(auth)`, `(renter)`, `(owner)`, and root navigation
- **235 UI components** across 24 component domains
- **11 service modules** in `src/services/`
- **100+ navigation targets and redirects** (`router.push`, `router.replace`, `router.navigate`, `href`)

---

## 2. Complete Route Inventory & Classification Map

| Route Path | File Location | Rendered Component / Purpose | Classification | Action / Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `app/index.tsx` | Entry Router & Auth Redirect | **ACTIVE CANONICAL** | **KEEP** |
| `/_layout` | `app/_layout.tsx` | Root Layout & Context Providers | **ACTIVE CANONICAL** | **KEEP** |
| `/auth/callback` | `app/auth/callback.tsx` | Deep-link OAuth redirect alias | **ACTIVE ALIAS** | **KEEP** |
| `/(auth)/login` | `app/(auth)/login.tsx` | Login Screen | **ACTIVE CANONICAL** | **KEEP** |
| `/(auth)/signup` | `app/(auth)/signup.tsx` | Signup Screen | **ACTIVE CANONICAL** | **KEEP** |
| `/(auth)/otp` | `app/(auth)/otp.tsx` | OTP Verification Screen | **ACTIVE CANONICAL** | **KEEP** |
| `/(auth)/onboarding` | `app/(auth)/onboarding.tsx` | Multi-step Onboarding Flow | **ACTIVE CANONICAL** | **KEEP** |
| `/(auth)/role-selection` | `app/(auth)/role-selection.tsx` | Renter vs Owner Role Selector | **ACTIVE CANONICAL** | **KEEP** |
| `/(auth)/forgot-password` | `app/(auth)/forgot-password.tsx` | Forgot Password Route | **ACTIVE CANONICAL** | **KEEP** |
| `/(auth)/reset-password` | `app/(auth)/reset-password.tsx` | Password Reset Route | **ACTIVE CANONICAL** | **KEEP** |
| `/(auth)/callback` | `app/(auth)/callback.tsx` | Auth Callback Route | **ACTIVE CANONICAL** | **KEEP** |
| `/(auth)/splash` | `app/(auth)/splash.tsx` | Splash Screen Route | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/home` | `app/(renter)/home.tsx` | Renter Home Screen (`RenterHomeScreen`) | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/search` | `app/(renter)/search.tsx` | Search Screen with Map & Guided Filters | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/saved` | `app/(renter)/saved.tsx` | Saved Properties & Flatmates Screen | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/profile` | `app/(renter)/profile.tsx` | Unified Profile Hub (`ProfileHubScreen`) | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/settings` | `app/(renter)/settings.tsx` | Settings Screen | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/property/[id]` | `app/(renter)/property/[id].tsx` | Property Details Screen (`PropertyDetailsScreen`) | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/commercial` | `app/(renter)/commercial.tsx` | Commercial Discovery Screen | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/pg-rooms` | `app/(renter)/pg-rooms.tsx` | PG & Rooms Discovery Screen | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/flatmates` | `app/(renter)/flatmates.tsx` | Flatmate Community Discovery Feed | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/flatmate/[id]` | `app/(renter)/flatmate/[id].tsx` | Flatmate Profile Details Screen | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/flatmate/create` | `app/(renter)/flatmate/create.tsx` | Flatmate Profile Creator | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/flatmate/edit` | `app/(renter)/flatmate/edit.tsx` | Flatmate Profile Editor | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/flatmate/my-profile` | `app/(renter)/flatmate/my-profile.tsx` | My Flatmate Profile Screen | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/chat/index` | `app/(renter)/chat/index.tsx` | Renter Chat List (`RenterChatListScreen`) | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/chat/[id]` | `app/(renter)/chat/[id].tsx` | Conversation Screen (`SharedConversationScreen`) | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/visit/schedule` | `app/(renter)/visit/schedule.tsx` | Schedule Visit Screen | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/add` | `app/(renter)/add.tsx` | Create Listing Shortcut | **ACTIVE CANONICAL** | **KEEP** |
| `/(renter)/rent` | `app/(renter)/rent.tsx` | Category Shortcut Alias | **ACTIVE ALIAS** | **KEEP** |
| `/(renter)/pg` | `app/(renter)/pg.tsx` | Category Shortcut Alias | **ACTIVE ALIAS** | **KEEP** |
| `/(renter)/rooms` | `app/(renter)/rooms.tsx` | Category Shortcut Alias | **ACTIVE ALIAS** | **KEEP** |
| `/(renter)/studios` | `app/(renter)/studios.tsx` | Category Shortcut Alias | **ACTIVE ALIAS** | **KEEP** |
| `/(renter)/listing/*` (13 files) | `app/(renter)/listing/*` | Canonical 12-Step Property Listing Wizard | **ACTIVE CANONICAL** | **KEEP** |
| `/(owner)/dashboard` | `app/(owner)/dashboard.tsx` | Owner Dashboard Screen (`OwnerDashboardScreen`) | **ACTIVE CANONICAL** | **KEEP** |
| `/(owner)/properties` | `app/(owner)/properties.tsx` | Owner My Properties Screen | **ACTIVE CANONICAL** | **KEEP** |
| `/(owner)/enquiries` | `app/(owner)/enquiries.tsx` | Owner Enquiries Screen | **ACTIVE CANONICAL** | **KEEP** |
| `/(owner)/visits` | `app/(owner)/visits.tsx` | Owner Visits Screen | **ACTIVE CANONICAL** | **KEEP** |
| `/(owner)/profile` | `app/(owner)/profile.tsx` | Owner Profile Screen (`ProfileHubScreen`) | **ACTIVE CANONICAL** | **KEEP** |
| `/(owner)/settings` | `app/(owner)/settings.tsx` | Owner Settings Screen | **ACTIVE CANONICAL** | **KEEP** |
| `/(owner)/chat/index` | `app/(owner)/chat/index.tsx` | Owner Chat List (`OwnerChatListScreen`) | **ACTIVE CANONICAL** | **KEEP** |
| `/(owner)/chat/[id]` | `app/(owner)/chat/[id].tsx` | Owner Conversation Screen (`SharedConversationScreen`) | **ACTIVE CANONICAL** | **KEEP** |
| `/(owner)/listing/*` (8 files) | `app/(owner)/listing/*` | Prototype 6-step owner listing wizard | **LEGACY DUPLICATE** | **SAFE TO CLEAN / REDIRECT TO CANONICAL WIZARD** |

---

## 3. Domain-by-Domain Audit Findings

### 3.1 Home Screen Audit
- **Canonical Home Component**: [`src/components/home/RenterHomeScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/RenterHomeScreen.tsx)
- **Active Canonical Subcomponents (12)**:
  - `HomeTopHeader.tsx`
  - `HomeSearchBar.tsx`
  - `HomeCategoryShortcuts.tsx`
  - `HomePromotionalCarousel.tsx`
  - `HomeRecommendedCarousel.tsx`
  - `HomePopularNearby.tsx`
  - `HomeResidentialSection.tsx`
  - `HomeCommercialSection.tsx`
  - `HomePgRoomsSection.tsx`
  - `HomeFlatmatesSection.tsx`
  - `HomeExploreGrid.tsx`
  - `HomeCitiesLiveSection.tsx`
  - `HomePopularPropertiesSection.tsx`
  - `HomeWhyRehvo.tsx`
  - `HomeHostCTA.tsx`
  - `HomeCreateFlatmateCTA.tsx`
  - `HomeSkeleton.tsx`
- **Dead / Unreferenced Legacy Home Components (26)**:
  - `AdCarousel.tsx`, `AnimatedCategoryContent.tsx`, `HomeActivitySection.tsx`, `HomeCapabilitySection.tsx`, `HomeCategoryCarousel.tsx`, `HomeCreationSection.tsx`, `HomeDiscoveryCTA.tsx`, `HomeFeaturedPlacement.tsx`, `HomeFeaturedSection.tsx`, `HomeFeaturedStory.tsx`, `HomeFlatmatePromoCard.tsx`, `HomeHeader.tsx`, `HomeHero.tsx`, `HomeLocalitySpotlight.tsx`, `HomeLocationCarousel.tsx`, `HomeLocationRow.tsx`, `HomeNotificationsCard.tsx`, `HomePrimarySearch.tsx`, `HomeProductFeaturesStrip.tsx`, `HomePromoBanner.tsx`, `HomePropertyGrid.tsx`, `HomeQuickActionsRow.tsx`, `HomeQuickFilters.tsx`, `HomeSearchModule.tsx`, `HomeSecondaryDiscovery.tsx`, `HomeSpotlightCard.tsx`.

### 3.2 Property Details Screen Audit
- **Canonical Route**: `app/(renter)/property/[id].tsx`
- **Canonical Screen Component**: [`src/components/property/PropertyDetailsScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/property/PropertyDetailsScreen.tsx)
- **Active Subcomponents**: `PropertyTopBar`, `PropertyImageGallery`, `PropertyKeyFacts`, `PropertyAboutSection`, `PropertyAmenitiesSection`, `PropertyLocationSection`, `PropertyOwnerSection`, `PropertyPriceSection`, `PropertySafetySection`, `PropertyTrustSection`, `PropertySimilarCarousel`, `PropertyBottomBar`, `ScheduleVisitModal`, `SendEnquiryModal`, `FullScreenImageViewerModal`, `PropertyReportModal`.
- **Legacy Components**: `ApplicationModal.tsx`, `src/components/common/PropertyDetailModal.tsx`.

### 3.3 Commercial & PG/Rooms Screen Audit
- **Canonical Commercial Route**: `app/(renter)/commercial.tsx` $\rightarrow$ [`src/components/commercial/CommercialDiscoveryScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/commercial/CommercialDiscoveryScreen.tsx)
- **Canonical PG/Rooms Route**: `app/(renter)/pg-rooms.tsx` $\rightarrow$ [`src/components/pg/PgRoomsDiscoveryScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/pg/PgRoomsDiscoveryScreen.tsx)
- **Legacy Components**: Entire `src/components/categories/` directory (10 obsolete prototype files).

### 3.4 Flatmate Community Screen Audit
- **Canonical Discovery Route**: `app/(renter)/flatmates.tsx` $\rightarrow$ `FlatmateDiscoveryFeed.tsx`
- **Canonical Details Route**: `app/(renter)/flatmate/[id].tsx` $\rightarrow$ `FlatmateDetailsScreen.tsx`
- **Canonical Create/Edit Route**: `app/(renter)/flatmate/create.tsx` & `edit.tsx` $\rightarrow$ `FlatmateCreateFlowScreen.tsx`
- **Canonical My Profile Route**: `app/(renter)/flatmate/my-profile.tsx` $\rightarrow$ `MyFlatmateProfileScreen.tsx`

### 3.5 Search Screen Audit
- **Canonical Search Route**: `app/(renter)/search.tsx`
- **Active Search Components**: `REHVOSearchBar.tsx`, `SearchPropertyCard.tsx`, `SearchSkeletonCard.tsx`, `SearchEmptyState.tsx`, `ResultsHeader.tsx`, `GuidedSearchModal.tsx`.
- **Legacy Components**: `SearchBar.tsx`, `SearchHeader.tsx`, `SearchSuggestions.tsx`, `QuickFilterRow.tsx`, `ActiveFilterChips.tsx`, `PropertyTypeFilter.tsx`, `src/components/explore/SearchModal.tsx`.

### 3.6 Chat & Messaging Screen Audit
- **Canonical Renter Chat List**: `app/(renter)/chat/index.tsx` $\rightarrow$ `RenterChatListScreen.tsx`
- **Canonical Owner Chat List**: `app/(owner)/chat/index.tsx` $\rightarrow$ `OwnerChatListScreen.tsx`
- **Canonical Unified Conversation**: `app/(renter)/chat/[id].tsx` & `app/(owner)/chat/[id].tsx` $\rightarrow$ [`src/components/chat/SharedConversationScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/chat/SharedConversationScreen.tsx)
- **Legacy Component**: `src/components/owner/chat/OwnerChatScreen.tsx`.

### 3.7 Profile & Role Management Audit
- **Canonical Profile Screen**: [`src/components/profile/ProfileHubScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/profile/ProfileHubScreen.tsx) (Unified for Renters & Owners with live role-switching)
- **Legacy Components**: 10 obsolete duplicate files in `src/components/owner/profile/*`.

### 3.8 Listing Wizard Flow Audit
- **Canonical 12-Step Listing Wizard**: `app/(renter)/listing/*` (13 step routes + `ListingExitModal`, `ListingHeader`).
- **Legacy Prototype Wizard**: `app/(owner)/listing/*` (8 duplicate step files).

---

## 4. Canonical Single-Source-of-Truth Architecture

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
