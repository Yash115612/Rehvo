# REHVO Mobile App — Phase 3 Real Implementation Plan: Marketplace Shell & Home

---

## 1. Current Runtime Route & Component Trace

```
EXPO RUNTIME EXECUTION PATH:
app/index.tsx (Entry Point & Auth Guard)
  │
  ├── [If Not Authenticated / First Launch] ──► app/(auth)/onboarding.tsx or app/(auth)/login.tsx
  │     └─ On successful auth ─────────────────► router.replace('/(renter)/home')
  │
  └── [If Authenticated as Renter] ────────────► app/(renter)/_layout.tsx (Tabs Layout)
        │
        ├── Root Layout Container ─────────────► <View style={styles.root}>
        │     │
        │     ├── Hidden Native Tabs Container ─► <Tabs screenOptions={{ tabBarStyle: { display: 'none' } }}>
        │     │     │
        │     │     └── Active Tab Route ──────► app/(renter)/home.tsx
        │     │           │
        │     │           └── HomeRoute ───────► <MarketplaceShell initialCategory="homes" />
        │     │
        │     └── Floating Bottom Navigation ──► <FloatingBottomNav activeTab={activeTab} />
```

### Exact Runtime Hierarchy:
1. **Entry Point**: [`app/index.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/index.tsx) initializes storage and evaluates auth session.
2. **Renter Layout Shell**: [`app/(renter)/_layout.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/_layout.tsx) mounts the hidden tabs and persistent floating navigation capsule.
3. **Home Route**: [`app/(renter)/home.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/home.tsx) mounts `MarketplaceShell`.
4. **Marketplace Shell Root**: [`src/components/marketplace/MarketplaceShell.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/marketplace/MarketplaceShell.tsx) orchestrates the persistent top header, search dock, category shortcuts, in-place animated container, and location bottom sheet.

---

## 2. Actual Component Tree & Visible Layout Analysis

### Current Rendered Component Tree:
```
<MarketplaceShell>
  ├── <SafeAreaView edges={['top']}>
  │     └── <ScrollView showsVerticalScrollIndicator={false}>
  │           │
  │           ├── [TOP] <HomeTopHeader />
  │           │     ├── Avatar (RehvoImage with skeleton fallback)
  │           │     ├── Greeting ("Good morning/afternoon/evening, {Name}")
  │           │     ├── Subtitle ("What are you looking for?")
  │           │     ├── Location Pill ("📍 Mumbai" + Chevron)
  │           │     └── Notification Bell (with unread badge)
  │           │
  │           ├── [TOP] <HomeSearchBar />
  │           │     ├── Search Pill ("Search locality, property or area")
  │           │     └── SlidersHorizontal Filter Button
  │           │
  │           ├── [TOP] <HomeCategoryShortcuts />
  │           │     └── 4 Minimalist Line Tabs: [ Homes ] [ Commercial ] [ PG & Rooms ] [ Flatmates ]
  │           │
  │           ├── [MIDDLE] <Animated.View> (In-Place 320ms Dynamic Content Area)
  │           │     │
  │           │     └── [When activeCategory === 'homes'] ──► <HomeMarketplaceContent>
  │           │           ├── 01 <HomePromotionalCarousel /> (RehvoFeaturedCard, 5s autoplay)
  │           │           ├── 02 <HomeRecommendedCarousel /> (RehvoPropertyCard, 78vw hero)
  │           │           ├── 03 <HomePopularNearby /> (RehvoCompactPropertyCard, 52vw rail)
  │           │           ├── 04 <HomeExploreGrid /> (Asymmetric: 1 Large "Find a Home" + 3 Small)
  │           │           ├── 05 <HomeCitiesLiveSection /> (RehvoCityCard: Mumbai, Thane, Navi Mumbai)
  │           │           ├── 06 <HomePopularPropertiesSection /> (RehvoCompactPropertyCard dense rail)
  │           │           ├── 07 <HomeWhyRehvo /> (RehvoTrustCard: 2x2 trust guarantee grid)
  │           │           ├── 08 <HomeHostCTA /> (Editorial banner: "Have a property to rent?")
  │           │           └── 09 <HomeCreateFlatmateCTA /> (Social banner: "Looking for the right flatmate?")
  │           │
  │           └── [BOTTOM MODAL] <Modal visible={locationModalVisible}> (Real MMR Localities)
  │
  └── [FLOATING OVERLAY] <FloatingBottomNav /> (64px white capsule with soft shadow)
```

---

## 3. Existing vs. Target Comparison Table

| Visual Area | Current Actual Screen State | Target Master Design Spec | Implementation Status & Action Required |
| :--- | :--- | :--- | :--- |
| **01. Top Header** | `HomeTopHeader.tsx` renders avatar, greeting, location pill, notification bell | Minimal, luxury neutral `#F7F5F0`, no dashboard clutter, live user name | **Ready for viewport test** |
| **02. Location Selector** | Location pill taps open modal with 10 real Mumbai localities | Actual selected city/locality, real bottom sheet, zero fake GPS | **Ready for viewport test** |
| **03. Search Dock** | `HomeSearchBar.tsx` with category-adaptive placeholder & filter button | 58px capsule, placeholder changes per active category | **Ready for viewport test** |
| **04. Category Switcher** | `HomeCategoryShortcuts.tsx` with 4 minimalist line tabs and accent line | Exactly `Homes`, `Commercial`, `PG & Rooms`, `Flatmates`, dark active text, no heavy colored pills | **Ready for viewport test** |
| **05. In-Place Switching** | `MarketplaceShell.tsx` with 320ms crossfade & translateY | Persistent shell; switching category updates content without route navigation | **Ready for viewport test** |
| **06. Section 01: Featured** | `HomePromotionalCarousel.tsx` using `RehvoFeaturedCard` | Cinematic hero cards, manual swipe + 5s autoplay + pagination dots | **Ready for viewport test** |
| **07. Section 02: Recommend** | `HomeRecommendedCarousel.tsx` using `RehvoPropertyCard` | 78vw hero cards, next card peeking, real Supabase inventory, save heart | **Ready for viewport test** |
| **08. Section 03: Popular Nearby** | `HomePopularNearby.tsx` using `RehvoCompactPropertyCard` | Location-aware compact rail (52vw width) | **Ready for viewport test** |
| **09. Section 04: Explore REHVO** | `HomeExploreGrid.tsx` | Asymmetric product discovery: 1 large "Find a Home" + 3 smaller editorial tiles | **Ready for viewport test** |
| **10. Section 05: Where Live** | `HomeCitiesLiveSection.tsx` using `RehvoCityCard` | Destination discovery: 1 large Mumbai tile + Thane, Navi Mumbai, South Mumbai | **Ready for viewport test** |
| **11. Section 06: Popular** | `HomePopularPropertiesSection.tsx` using `RehvoCompactPropertyCard` | Dense horizontal marketplace rail | **Ready for viewport test** |
| **12. Section 07: Why REHVO** | `HomeWhyRehvo.tsx` using `RehvoTrustCard` | 2x2 trust guarantee grid: 0% Brokerage, Verified, Direct Chat, Easy Visits | **Ready for viewport test** |
| **13. Section 08: Host CTA** | `HomeHostCTA.tsx` | Editorial conversion banner: "Have a property to rent?" | **Ready for viewport test** |
| **14. Section 09: Flatmate CTA** | `HomeCreateFlatmateCTA.tsx` | Social community banner: "Looking for the right flatmate?" | **Ready for viewport test** |
| **15. Commercial Mode** | `CommercialMarketplaceContent.tsx` | Grade-A offices, shops, warehouses, coworking | **Ready for in-place test** |
| **16. PG & Rooms Mode** | `PgMarketplaceContent.tsx` | Stays, private/shared rooms, studios, managed coliving | **Ready for in-place test** |
| **17. Flatmates Mode** | `FlatmateMarketplaceContent.tsx` | Roommate cards, lifestyle chips, create profile trigger | **Ready for in-place test** |
| **18. Bottom Navigation** | `FloatingBottomNav.tsx` in `_layout.tsx` | 64px floating white capsule, soft shadow, center accent action | **Ready for viewport test** |

---

## 4. Route Mounting & Component Usage Audit

| Component File | Created? | Imported? | Rendered in Root? | Mounted by `app/(renter)/home.tsx`? | Visible at Runtime? |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `MarketplaceShell.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| `HomeTopHeader.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| `HomeSearchBar.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| `HomeCategoryShortcuts.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| `HomeMarketplaceContent.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| `HomePromotionalCarousel.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| `HomeRecommendedCarousel.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| `HomePopularNearby.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| `HomeExploreGrid.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| `HomeCitiesLiveSection.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| `HomePopularPropertiesSection.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| `HomeWhyRehvo.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| `HomeHostCTA.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| `HomeCreateFlatmateCTA.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| `CommercialMarketplaceContent.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES (on Commercial tab) | ✅ YES |
| `PgMarketplaceContent.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES (on PG tab) | ✅ YES |
| `FlatmateMarketplaceContent.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES (on Flatmate tab) | ✅ YES |
| `FloatingBottomNav.tsx` | ✅ YES | ✅ YES | ✅ YES | ✅ YES (via `_layout.tsx`) | ✅ YES |
| `HomeResidentialSection.tsx` (Legacy) | ✅ YES | ❌ NO | ❌ NO | ❌ NO | ❌ NO (Unused) |
| `HomeCommercialSection.tsx` (Legacy) | ✅ YES | ❌ NO | ❌ NO | ❌ NO | ❌ NO (Unused) |
| `HomePgRoomsSection.tsx` (Legacy) | ✅ YES | ❌ NO | ❌ NO | ❌ NO | ❌ NO (Unused) |
| `HomeFlatmatesSection.tsx` (Legacy) | ✅ YES | ❌ NO | ❌ NO | ❌ NO | ❌ NO (Unused) |

---

## 5. Classification of Conflicting Implementations

1. **`MarketplaceShell.tsx`**: **CANONICAL ROOT**. Orchestrates the entire marketplace experience with persistent shell and in-place category switching.
2. **`HomeMarketplaceContent.tsx`**: **CANONICAL HOME CONTENT**. Implements the 9 differentiated sections for the default `homes` category.
3. **`RenterHomeScreen.tsx`**: **COMPATIBILITY WRAPPER**. Forwards directly to `MarketplaceShell`.
4. **`HomeResidentialSection.tsx`, `HomeCommercialSection.tsx`, `HomePgRoomsSection.tsx`, `HomeFlatmatesSection.tsx`**: **LEGACY UNUSED**. Old monolithic section files from previous iterations, not imported in the canonical tree.

---

## 6. Shell & Category Switching Mechanism

- **State Model**: Managed inside `MarketplaceShell` via `activeCategory: 'homes' | 'commercial' | 'pg' | 'flatmates'`.
- **Switching Function**: `handleSelectCategory(cat)` initiates an animated transition:
  1. `contentFadeAnim` fades from $1 \rightarrow 0$ in 120ms with $translateY \rightarrow -6$.
  2. State updates: `setActiveCategory(cat)`.
  3. `contentFadeAnim` fades from $0 \rightarrow 1$ in 200ms with $translateY: 8 \rightarrow 0$.
- **Navigation Safety**: Zero calls to `router.push` or `router.replace` when changing categories. Header, search, category switcher, and bottom nav stay mounted and flicker-free.

---

## 7. Master Design System Primitives Integration

| Master Primitive | Imported In | Runtime Role |
| :--- | :--- | :--- |
| **`RehvoImage`** | `HomeTopHeader`, `HomeExploreGrid`, `HomeHostCTA`, `HomeCreateFlatmateCTA`, `HomeCitiesLiveSection` | Image loader with skeleton fallback, error recovery, and rounded clipping |
| **`RehvoButton`** | `HomeHostCTA`, `HomeCreateFlatmateCTA` | Primary dark / accent buttons with active touch feedback |
| **`RehvoPropertyCard`** | `HomeRecommendedCarousel` | 78vw hero cards with price pill, verification badge, and save toggle |
| **`RehvoCompactPropertyCard`** | `HomePopularNearby`, `HomePopularPropertiesSection` | Compact rail cards for dense horizontal discovery |
| **`RehvoFeaturedCard`** | `HomePromotionalCarousel` | Cinematic promotional hero cards with dark gradient overlays |
| **`RehvoCityCard`** | `HomeCitiesLiveSection` | Geographic destination cards with photo and count subtext |
| **`RehvoTrustCard`** | `HomeWhyRehvo` | 2x2 trust guarantee modules |
| **`RehvoBottomNav` / `FloatingBottomNav`** | `app/(renter)/_layout.tsx` | 64px sculpted floating capsule navigation |

---

## 8. Root Cause Analysis of Previous Phase 3 Verification Gap

1. **Premature Completion Claim**: The previous report claimed full completion of Phase 3 without presenting an interactive step-by-step implementation plan for user review.
2. **Missing Device Verification Steps**: The verification relied primarily on TypeScript build and Metro Android export bundling rather than presenting sequential visual checkpoints for the first viewport.
3. **Legacy File Confusion**: Unused legacy files (`HomeResidentialSection.tsx`, etc.) remained in the directory, creating ambiguity around which component was actively rendering.

---

## 9. Code Preservation & Replacement Strategy

### A. What Must Be Preserved (100% Intact):
- **All Supabase Services**: `src/services/` (`properties.ts`, `flatmates.ts`, `auth.ts`, `chat.ts`, `visits.ts`, `enquiries.ts`, `profile.ts`, `saved.ts`, `notifications.ts`).
- **Zustand State Store**: `src/store/useAppStore.ts` with real database querying, save toggles, category filtering, and location handling.
- **Master Tokens**: `src/theme/colors.ts` (`#F7F5F0` background, `#FFFFFF` surfaces, `#19181C` typography, `#FF5533` brand accent).
- **Master Primitives**: `src/components/primitives/index.ts`.
- **Boundaries**: `web/` and `admin/` remain **100% frozen**.

### B. What Must Be Replaced / Cleaned Up:
- Disconnect and clean up legacy unused files (`HomeResidentialSection.tsx`, `HomeCommercialSection.tsx`, `HomePgRoomsSection.tsx`, `HomeFlatmatesSection.tsx`) only after verification.
- Ensure `MarketplaceShell` remains the single canonical root component mounted by `app/(renter)/home.tsx`.

---

## 10. Step-by-Step Implementation & Visual Verification Sequence

### STEP 1: First Viewport Verification (Header, Location, Search, Category Switcher)
- **Action**: Launch Metro bundler (`npx expo start -c`) and open the real app on device / simulator.
- **Target Viewport**:
  1. Top Header: User avatar + Greeting ("Good morning/afternoon/evening, Yash") + Location Pill ("📍 Mumbai") + Notification Bell.
  2. Search Dock: 58px capsule with placeholder "Search locality, property or area" + filter button.
  3. Category Switcher: 4 minimalist line tabs [ Homes ] [ Commercial ] [ PG & Rooms ] [ Flatmates ] with active dark text and accent line.
- **Verification Gate**: Stop and visually confirm top viewport before scrolling down.

### STEP 2: Hero & Recommended Properties Verification
- **Action**: Inspect Section 01 (`Featured / Sponsored`) and Section 02 (`Recommend for You`).
- **Target UI**:
  1. Featured Carousel: Cinematic wide card with 5s autoplay, swipe gesture, and pagination dots.
  2. Recommend for You: 78vw `RehvoPropertyCard` carousel with next card partially peeking, live rent prices, verification badges, and save heart buttons.
- **Verification Gate**: Stop and visually confirm cards render live Supabase data with zero broken images.

### STEP 3: Popular Nearby & Asymmetric Explore REHVO Verification
- **Action**: Inspect Section 03 (`Popular Nearby`) and Section 04 (`Explore REHVO`).
- **Target UI**:
  1. Popular Nearby: 52vw `RehvoCompactPropertyCard` horizontal rail.
  2. Explore REHVO: 1 large hero tile ("Find a Home") + 3 smaller supporting tiles ("Commercial", "PG & Rooms", "Flatmates").
- **Verification Gate**: Stop and visually confirm layout responsiveness.

### STEP 4: Destinations, Dense Rail, Trust Grid & CTAs Verification
- **Action**: Scroll to bottom of Home (Sections 05 through 09).
- **Target UI**:
  1. Where REHVO is Live: Destination cards for Mumbai, Thane, Navi Mumbai.
  2. Popular Properties: Dense compact card rail.
  3. Why REHVO: 2x2 trust guarantee grid with icons.
  4. Have a Property to Rent: Editorial conversion card.
  5. Create Flatmate Profile: Social community card.
  6. Floating Bottom Navigation: 64px white capsule hovering above bottom edge with 120px scroll padding clearance.
- **Verification Gate**: Stop and visually confirm entire Home scrolling lifecycle.

### STEP 5: In-Place Category Switching Verification
- **Action**: Tap each category in the switcher without leaving the shell:
  1. Tap `[ Commercial ]` $\rightarrow$ Content crossfades to Commercial Hero, Grade-A Offices, Shops, Warehouses, Coworking.
  2. Tap `[ PG & Rooms ]` $\rightarrow$ Content crossfades to Featured PG, Managed Rooms, Co-living Stays.
  3. Tap `[ Flatmates ]` $\rightarrow$ Content crossfades to Roommate cards with lifestyle tags.
  4. Tap `[ Homes ]` $\rightarrow$ Returns seamlessly to default Home.
- **Verification Gate**: Confirm zero page reloads, zero route jumps, and smooth 320ms transition.

---

## 11. Strict Boundary Compliance & Freeze Verification

```
BOUNDARY AUDIT RULE:
- web/   ──► 0 modifications (100% frozen)
- admin/ ──► 0 modifications (100% frozen)
- Mobile ──► Strict isolation in app/, src/, assets/
```

- Verification Command: `python3 scripts/audit_architecture_separation.py`
- Git Diff Check: `git diff --stat web/ admin/` (Expected: 0 changes).

---

## 12. Final Approval Request

This plan establishes a concrete, step-by-step, screen-by-screen execution strategy with strict visual verification checkpoints for Phase 3.

**No code modifications have been made in this step.** Implementation will commence only upon your explicit review and approval of this plan.
