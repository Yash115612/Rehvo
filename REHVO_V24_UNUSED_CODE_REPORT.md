# REHVO V24 — Dead Code, Duplicate Screens & Deprecation Audit

**Version:** REHVO V24.5 Deep Clean Audit  
**Scope:** 41 Unreferenced Components, 11 Duplicate Routes, Legacy Dead Code  
**Strategy:** Preserve in repository (strict non-destructive audit mode); flag for post-V1 pruning  

---

## 1. Executive Summary

| Category | Count | Status | Recommendation |
|---|---|---|---|
| **Unreferenced Components** | **41 Components** | 0 active screen imports | Deprecate or repurpose in V2 |
| **Duplicate Owner Routes** | **11 Routes** | Legacy duplicate routes in `(renter)` | Redirect to canonical `app/(owner)/*` |
| **Dead Broker Services** | **1 Service** | `src/services/broker.ts` | Gate behind feature flag |

---

## 2. Inventory of 41 Dead / Unreferenced Components

These components are present in `src/components/` but have zero active inbound references across `app/` routes or screens:

| # | Component Name | File Path | Sub-Dependencies | Recommended Action |
|---|---|---|---|---|
| 1 | `V4AppUpdateModal` | `src/components/v4/ui/V4AppUpdateModal.tsx` | None | Archive / Safely Remove Post-Launch |
| 2 | `V4NeighborhoodCard` | `src/components/v4/ui/V4NeighborhoodCard.tsx` | None | Archive / Safely Remove Post-Launch |
| 3 | `V4MaintenanceBanner` | `src/components/v4/ui/V4MaintenanceBanner.tsx` | None | Archive / Safely Remove Post-Launch |
| 4 | `V4PropertyShareModal` | `src/components/v4/ui/V4PropertyShareModal.tsx` | None | Archive / Safely Remove Post-Launch |
| 5 | `V4CampaignPopupModal` | `src/components/v4/ui/V4CampaignPopupModal.tsx` | None | Archive / Safely Remove Post-Launch |
| 6 | `V4FloatingSearchBar` | `src/components/v4/ui/V4FloatingSearchBar.tsx` | None | Archive / Safely Remove Post-Launch |
| 7 | `V4PaymentCheckoutModal` | `src/components/v4/ui/V4PaymentCheckoutModal.tsx` | None | Archive / Safely Remove Post-Launch |
| 8 | `V4ReactionBar` | `src/components/v4/chat/V4ReactionBar.tsx` | None | Archive / Safely Remove Post-Launch |
| 9 | `V4DocumentBubble` | `src/components/v4/chat/V4DocumentBubble.tsx` | None | Archive / Safely Remove Post-Launch |
| 10 | `V4VoiceNoteBubble` | `src/components/v4/chat/V4VoiceNoteBubble.tsx` | None | Archive / Safely Remove Post-Launch |
| 11 | `V4ReplyPreview` | `src/components/v4/chat/V4ReplyPreview.tsx` | None | Archive / Safely Remove Post-Launch |
| 12 | `V4PropertyShareCard` | `src/components/v4/chat/V4PropertyShareCard.tsx` | `V4PropertyShareCard` | Archive / Safely Remove Post-Launch |
| 13 | `V4LocationBubble` | `src/components/v4/chat/V4LocationBubble.tsx` | None | Archive / Safely Remove Post-Launch |
| 14 | `V4OwnerLeadCard` | `src/components/v4/chat/V4OwnerLeadCard.tsx` | `V4OwnerLeadCard` | Archive / Safely Remove Post-Launch |
| 15 | `V4ImageBubble` | `src/components/v4/chat/V4ImageBubble.tsx` | `V4Image` | Archive / Safely Remove Post-Launch |
| 16 | `V4UploadProgressCard` | `src/components/v4/camera/V4UploadProgressCard.tsx` | None | Archive / Safely Remove Post-Launch |
| 17 | `V4GalleryPickerSheet` | `src/components/v4/camera/V4GalleryPickerSheet.tsx` | `index` | Archive / Safely Remove Post-Launch |
| 18 | `V4ImageCropper` | `src/components/v4/camera/V4ImageCropper.tsx` | None | Archive / Safely Remove Post-Launch |
| 19 | `V4Header` | `src/components/v4/navigation/V4Header.tsx` | `index` | Archive / Safely Remove Post-Launch |
| 20 | `V4CompatibilityInsightsScreen` | `src/components/v4/screens/V4CompatibilityInsightsScreen.tsx` | None | Archive / Safely Remove Post-Launch |
| 21 | `V4HostDashboardScreen` | `src/components/v4/screens/V4HostDashboardScreen.tsx` | `V4HostPlanGateModal`, `V4AuthGate`, `V4Button` | Archive / Safely Remove Post-Launch |
| 22 | `V4VoiceSearchModal` | `src/components/v4/search/V4VoiceSearchModal.tsx` | None | Archive / Safely Remove Post-Launch |
| 23 | `V4VoiceVisualizerModal` | `src/components/v4/ai/V4VoiceVisualizerModal.tsx` | `index` | Archive / Safely Remove Post-Launch |
| 24 | `V4FloatingAIBadge` | `src/components/v4/ai/V4FloatingAIBadge.tsx` | None | Archive / Safely Remove Post-Launch |
| 25 | `V4ScreenContainer` | `src/components/v4/screen/V4ScreenContainer.tsx` | `V4EmptyState`, `V4Skeleton`, `V4Button` | Archive / Safely Remove Post-Launch |
| 26 | `V4FlatmateCard` | `src/components/v4/flatmates/V4FlatmateCard.tsx` | `V4FlatmateCard` | Archive / Safely Remove Post-Launch |
| 27 | `V4AnalyticsDashboardModal` | `src/components/v4/analytics/V4AnalyticsDashboardModal.tsx` | None | Archive / Safely Remove Post-Launch |
| 28 | `ProcessingCard` | `src/components/tour/ProcessingCard.tsx` | None | Archive / Safely Remove Post-Launch |
| 29 | `FlatmateCreateFlowScreen` | `src/components/flatmates/FlatmateCreateFlowScreen.tsx` | None | Archive / Safely Remove Post-Launch |
| 30 | `FlatmateChatListScreen` | `src/components/flatmates/FlatmateChatListScreen.tsx` | `V4AuthGate` | Archive / Safely Remove Post-Launch |
| 31 | `SavedFlatmatesScreen` | `src/components/flatmates/SavedFlatmatesScreen.tsx` | `V4WaveButton` | Archive / Safely Remove Post-Launch |
| 32 | `MatchesScreen` | `src/components/flatmates/MatchesScreen.tsx` | `V4MatchCard` | Archive / Safely Remove Post-Launch |
| 33 | `FlatmateDiscoveryFeed` | `src/components/flatmates/FlatmateDiscoveryFeed.tsx` | `FlatmateCard`, `FlatmateFilterBar` | Archive / Safely Remove Post-Launch |
| 34 | `FlatmateDetailsScreen` | `src/components/flatmates/FlatmateDetailsScreen.tsx` | None | Archive / Safely Remove Post-Launch |
| 35 | `FlatmatesHomeScreen` | `src/components/flatmates/FlatmatesHomeScreen.tsx` | `V4FlatmateCard`, `Hotspot`, `MatchCelebrationModal`, `V4CompatibilityRing`, `V4FilterBottomSheet` | Archive / Safely Remove Post-Launch |
| 36 | `MyFlatmateProfileScreen` | `src/components/flatmates/MyFlatmateProfileScreen.tsx` | `V4ProfileCompletionCard` | Archive / Safely Remove Post-Launch |
| 37 | `V4LifestyleChip` | `src/components/flatmates/ui/V4LifestyleChip.tsx` | None | Archive / Safely Remove Post-Launch |
| 38 | `V4TrustBadge` | `src/components/flatmates/ui/V4TrustBadge.tsx` | None | Archive / Safely Remove Post-Launch |
| 39 | `V4InterestChip` | `src/components/flatmates/ui/V4InterestChip.tsx` | None | Archive / Safely Remove Post-Launch |
| 40 | `index` | `src/components/v4/ui/index.ts` | `V4ShimmerLoader`, `V4Avatar`, `V4EmptyState`, `V4OfferBanner`, `V4PropertyCardSmall`, `V4HostPlanGateModal`, `V4FilterChip`, `V4Input`, `V4PropertyCardSpotlight`, `V4Image`, `V4Modal`, `V4CategoryCard`, `V4Toast`, `V4PropertyCardLarge`, `V4Card`, `V4AuthGate`, `V4Badge`, `V4Skeleton`, `V4FloatingNavBar`, `V4BottomSheet`, `V4Button`, `V4Chip`, `V4OwnerCard`, `V4BrandLogo`, `V4BenefitCard`, `V4ErrorBoundary`, `V4SearchBar`, `V4NotificationPermissionModal`, `V4StatsCard`, `V4OfflineNotice`, `V4SectionHeader`, `V4PostActionModal`, `V4BookingCard`, `V4WalletCard` | Archive / Safely Remove Post-Launch |
| 41 | `index` | `src/components/v4/leads/index.ts` | `V4OwnerLeadCard`, `V4LeadActionButton` | Archive / Safely Remove Post-Launch |

---

## 3. Duplicate Route Mappings (11 Legacy Routes)

During the rapid evolution of REHVO, 11 owner routes were initially placed inside `app/(renter)/owner-*`. These have modern canonical equivalents inside `app/(owner)/*`:

| # | Legacy Route Path | Canonical Replacement Route | Launch Strategy |
|---|---|---|---|
| 1 | `app/(renter)/owner-dashboard.tsx` | `app/(owner)/dashboard.tsx` | Auto-redirect to canonical |
| 2 | `app/(renter)/owner-properties.tsx` | `app/(owner)/properties.tsx` | Auto-redirect to canonical |
| 3 | `app/(renter)/owner-listings.tsx` | `app/(owner)/properties.tsx` | Auto-redirect to canonical |
| 4 | `app/(renter)/owner-add-property.tsx`| `app/(owner)/listings/new.tsx` | Auto-redirect to canonical |
| 5 | `app/(renter)/owner-analytics.tsx` | `app/(owner)/analytics.tsx` | Auto-redirect to canonical |
| 6 | `app/(renter)/owner-chat.tsx` | `app/(owner)/chat.tsx` | Auto-redirect to canonical |
| 7 | `app/(renter)/owner-profile.tsx` | `app/(owner)/profile.tsx` | Auto-redirect to canonical |
| 8 | `app/(renter)/owner-settings.tsx` | `app/(owner)/settings.tsx` | Auto-redirect to canonical |
| 9 | `app/(renter)/owner-notifications.tsx`| `app/(owner)/notifications.tsx`| Auto-redirect to canonical |
| 10| `app/(renter)/owner-wallet.tsx` | `app/(owner)/wallet.tsx` | Auto-redirect to canonical |
| 11| `app/(renter)/owner-help.tsx` | `app/(owner)/help.tsx` | Auto-redirect to canonical |

---

## 4. Preservation & Safety Guarantee

In accordance with strict audit directives:
- **No files have been deleted**.
- **No code paths have been broken**.
- All dead code and duplicate routes remain intact and safely preserved.
