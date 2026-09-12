# REHVO Mobile App — PG & Rooms Marketplace Implementation Plan

---

## 1. Executive Summary & Product Objective

The **REHVO PG & Rooms Page** is being completely redesigned from an ad-heavy, multi-carousel promotional landing page into a **focused, high-utility Accommodation & Stay Discovery Marketplace**.

### Core Product Principle:
$$\text{PG \& Rooms Page} = \textbf{Stay Discovery} \quad (\text{NOT marketing}, \text{NOT ads}, \text{NOT long storytelling})$$

The user opens PG & Rooms and immediately gains the ability to:
1. **Search PGs & rooms** (*locality, metro station, stay name, landmark*).
2. **Select accommodation category** (*All Stays, PG, Private Room, Shared Room, Co-Living, Studio / 1 RK*).
3. **Filter by stay-specific attributes** (*Monthly rent, Food/Meals included, Gender rules: Girls / Boys / Unisex, AC, Attached Washroom, Wi-Fi*).
4. **Sort listings** (*Price: Low to High, Price: High to Low, Newest, Recommended*).
5. **Browse a clean, vertical listing feed** with dedicated accommodation cards (*rent with meals subtext, occupancy badge, amenities, save heart*).
6. **Open canonical Property Details** adapted for accommodation stays.
7. **Save, Chat with Host, Enquire, and Schedule a physical walkthrough**.

---

## 2. Current PG & Rooms Route & Architecture Audit

### A. Current Runtime Route Trace:
```
app/(renter)/pg-rooms.tsx  or  app/(renter)/pg.tsx
  └── <MarketplaceShell initialCategory="pg" />
        └── <PgMarketplaceContent />
```

### B. Current Component Tree & Problems Identified:
Currently, `PgMarketplaceContent.tsx` is an 871-line file rendering **8 separate marketing and carousel sections**:
```
CURRENT CLUTTERED STRUCTURE (TO BE REPLACED):
├── 01 PgHero (Large promotional banner)
├── 02 StayTypeShortcuts (Old icon pill rail)
├── 03 FeaturedPgSection (Large promotional card)
├── 04 PopularPgCarousel (Horizontal carousel #1)
├── 05 PrivateRoomsCarousel (Horizontal carousel #2)
├── 06 SharedStaysCarousel (Horizontal carousel #3)
├── 07 WhyRehvoPgSection (Marketing benefits wall)
└── 08 PgHostCTA (Large host promotion)
```

### Root Cause of Poor UX:
1. **Fragmented Horizontal Carousels**: 3 different carousels hiding inventory sideways rather than providing a unified, filterable feed.
2. **Excessive Marketing**: 3 separate promotional blocks (*Hero, Featured, Why REHVO*) push real listings far down the viewport.
3. **Low Information Density**: Generic cards lack stay-first metrics (*meals included, gender rules, occupancy type, geyser, daily housekeeping*).

---

## 3. Real Data Model & Supported Stay Categories

The redesign strictly leverages existing Supabase schema and TypeScript domain models from [`src/types/index.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/types/index.ts). Zero fabricated categories.

### Supported Accommodation Types (`PropertyType`):
- `PG`: Managed paying guest accommodations with daily housekeeping and meals.
- `PRIVATE_ROOM`: Private single occupancy bedroom inside a shared apartment/house.
- `SHARED_ROOM`: Twin/triple sharing bedroom in a managed residence.
- `CO_LIVING`: Modern managed community living with shared workspaces and social spaces.
- `STUDIO`: Independent 1 RK / studio apartment with private kitchenette.

### Stay-Specific Data Attributes Available in `Property`:
- `rent: number`: Monthly rent in INR (inclusive of meals/maintenance when applicable).
- `deposit: number`: Security deposit (e.g. 1–2 months rent).
- `brokerage: number`: Zero on REHVO direct stays.
- `pg_food_included?: boolean`: 3 Meals / Breakfast & Dinner included in rent.
- `pg_gender_allowed?: 'Gents' | 'Ladies' | 'Unisex' | 'Any'`: Gender restriction / preference.
- `pg_occupancy?: string`: Single, Twin Sharing, Triple Sharing, Studio.
- `furnishing: FurnishingType`: `FULLY_FURNISHED` | `SEMI_FURNISHED` | `UNFURNISHED`.
- `amenities: string[]`: `Wi-Fi`, `AC`, `Daily Housekeeping`, `Meals Included`, `Geyser`, `Laundry`, `Gym Access`, `Power Backup`, `Attached Bathroom`.
- `verification_status: VerificationStatus`: `VERIFIED` badge.
- `is_sponsored?: boolean`: Subtle sponsored flag in feed.

---

## 4. Target PG & Rooms Marketplace Architecture

The new PG & Rooms page replaces the 8 fragmented sections with **ONE streamlined, high-utility accommodation discovery feed**:

```
TARGET PG & ROOMS MARKETPLACE STRUCTURE:
┌──────────────────────────────────────────────────────────┐
│ [TOP PERSISTENT SHELL]                                   │
│ Avatar  ·  "Good morning, Yash"  ·  📍 Mumbai  ·  Bell   │
├──────────────────────────────────────────────────────────┤
│ [PG & ROOMS SEARCH DOCK]                                 │
│ 🔍 "Search PG, room, co-living, area..."     [ Filter ]  │
├──────────────────────────────────────────────────────────┤
│ [STAY TYPE FILTER RAIL (Horizontal Chips)]               │
│ [ All Stays ] [ PG ] [ Private Room ] [ Shared Room ]    │
│ [ Co-Living ] [ Studio / 1 RK ]                          │
├──────────────────────────────────────────────────────────┤
│ [CONTROL & COUNT STRIP]                                  │
│ "18 PGs & Rooms in Mumbai"           [ Sort: Recommended ]│
├──────────────────────────────────────────────────────────┤
│ [ACCOMMODATION LISTING FEED (Vertically Scrollable)]     │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ PgRoomCard #1 (Managed PG / Co-Living)               │ │
│ │ • High-res bedroom photo + [VERIFIED PG] + [♥ Save]  │ │
│ │ • ₹14,000 / month  (3 Meals Included)                │ │
│ │ • Premium Co-Living Stay & Meals                     │ │
│ │ • Near Chakala Metro, Andheri East, Mumbai           │ │
│ │ • [ Private Room ] [ Unisex ] [ Fully Furnished ]    │ │
│ │ • 3 Meals Included · Wi-Fi · AC & Geyser · Daily Maid│ │
│ │ • [ View Stay ] [ Enquire ]                          │ │
│ └──────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ PgRoomCard #2 (Twin Sharing Stay)                    │ │
│ └──────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ PgRoomCard #3 (Private Studio / 1 RK)                │ │
│ └──────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────┤
│ [CONTEXTUAL HOST FOOTER TILE (Compact/Minimal)]          │
│ "Have a PG or room to list? List it on REHVO →"         │
├──────────────────────────────────────────────────────────┤
│ [FLOATING BOTTOM NAVIGATION (Persistent Shell)]          │
│ (Home)  (Search)  (+)  (Saved)  (Profile)                │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Detailed Component Specifications

### A. Accommodation Search Component (`PgSearchBar`)
- **Visuals**: 54px capsule matching master tokens (`#FFFFFF` surface, `#E9E6E0` border, `#77747C` muted text).
- **Placeholder**: *"Search PG, room, co-living, area..."*
- **Actions**:
  - Typing filters listings by locality, landmark, stay name, or address.
  - Tapping filter button opens the dedicated **PG Filter Bottom Sheet**.

### B. Stay Type Selector (`PgTypeFilterRail`)
- **Pills**: `All Stays`, `PG`, `Private Room`, `Shared Room`, `Co-Living`, `Studio / 1 RK`.
- **Interaction**:
  - Tapping a pill immediately filters the feed in-place with zero page reload.
  - Active pill: `#19181C` background + `#FFFFFF` text + count badge.
  - Inactive pill: `#FFFFFF` surface + `#E9E6E0` border + `#77747C` text.

### C. Accommodation Filter Bottom Sheet (`PgFilterSheet`)
- Accessed via the Filter icon in the search bar or control strip.
- **Filter Controls**:
  1. **Monthly Budget Slider / Presets**: Under ₹8k, ₹8k–₹15k, ₹15k–₹25k, ₹25k+.
  2. **Food / Meals Included Toggle**: "3 Meals Included" or "Breakfast & Dinner".
  3. **Gender Preference / Rules**: Any / All, Girls Only, Boys Only, Unisex.
  4. **Occupancy Preference**: Single Room, Twin Sharing, Triple Sharing, Studio.
  5. **Key Amenities**: AC, High-Speed Wi-Fi, Daily Housekeeping, Attached Washroom, Laundry / Washing Machine, Power Backup, Gym.
  6. **Move-in Availability**: Immediate, Within 15 Days, Within 30 Days.
- **Actions**: *Clear All* (resets filters) and *Show {Count} Stays* (applies filters).

### D. Sort Control (`PgSortSheet`)
- Options:
  1. **Recommended** (Default: Verified & high relevance first)
  2. **Rent: Low to High** (Most affordable stays first)
  3. **Rent: High to Low** (Premium co-living & private studios first)
  4. **Newest Listed**

### E. Dedicated Accommodation Listing Card (`PgRoomCard`)
- **Card Anatomy**:
  1. **Hero Image (180px)**: Uses [`RehvoImage`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoImage.tsx) with rounded 18px clipping, loading skeleton, and error fallback.
  2. **Top Overlay**: `[VERIFIED PG]` badge on top-left, `[♥ Save]` heart on top-right.
  3. **Price Tag**: `₹{Rent}/mo` formatted in Indian numbering (`₹14,000/mo` or `₹9,500/mo`) with meals indicator subtext (`Meals Incl.` or `Zero Deposit`).
  4. **Title & Locality**: Bold title (`Premium Co-Living Stay & Meals`) + location (`Chakala Metro, Andheri East`).
  5. **Stay Specs Badges**:
     - Stay Type: `Private Room` / `Twin Sharing` / `Studio`
     - Gender Rule: `Girls Only` / `Boys Only` / `Unisex`
     - Furnishing: `Fully Furnished`
  6. **Key Amenities Strip**: `Meals Included` · `Wi-Fi` · `AC & Geyser` · `Daily Maid`.
  7. **Quick Action Buttons**:
     - *View Stay* (`RehvoButton` primary dark)
     - *Enquire* (`RehvoButton` outline)

### F. Result Count & Contextual Feedback Bar
- Displays active count: *"Showing 18 Verified PGs & Rooms in Mumbai"*.
- If filters are active, displays an *"Active Filters (2) · Reset"* chip.

### G. Empty & No-Results States (`RehvoEmptyState`)
- When no stays match active filters/location:
  - Icon: `BedDouble`
  - Title: *"No PGs or rooms found"*
  - Subtitle: *"Try adjusting your rent range, stay type, or gender preference."*
  - CTA Button: *"Reset Filters"* or *"Explore All Stays"*.

---

## 6. Shared Marketplace Shell Integration

- **Single Persistent Shell**: `MarketplaceShell.tsx` remains mounted as the root container.
- **Category Switching**: Selecting `PG & Rooms` in `HomeCategoryShortcuts` displays `PgMarketplaceContent` with the 320ms in-place crossfade.
- **Location Synchronization**: Changing the location pill (`📍 Mumbai` $\rightarrow$ `📍 Andheri East` or `📍 Powai`) immediately updates the PG feed query.
- **Zero Shell Duplication**: `PgMarketplaceContent` does NOT render a redundant top header or redundant bottom navigation.

---

## 7. Navigation & Interaction Workflows

```
USER INTERACTION WORKFLOW:
1. Tap [ PG & Rooms ] in Category Switcher ──► Opens PG Marketplace Feed in-place (320ms)
2. Tap [ Private Room ] Chip ────────────────► Feed instantly filters to Private Room inventory
3. Tap [ Filters ] ──────────────────────────► PgFilterSheet slides up (Rent, Meals, Gender, AC)
4. Select "3 Meals Included" + "Unisex" ──────► Tap "Show 12 Stays" ──► Feed updates
5. Tap PG Room Card ─────────────────────────► Opens canonical app/(renter)/property/[id].tsx
6. Tap [ Save Heart ] ───────────────────────► Toggles saved state in useAppStore
7. Tap [ Enquire ] ──────────────────────────► Starts/opens chat in app/(renter)/chat/[id].tsx
8. Tap [ Schedule Visit ] ───────────────────► Opens visit modal for physical inspection
```

---

## 8. Mobile Responsiveness & Performance Plan

- **Viewport Standards**: Tested for 375px (iPhone SE/mini), 390px (iPhone 14/15), and 430px (iPhone Plus/Max).
- **Layout Safety**: Single vertical scroll container, zero horizontal overflow, 120px bottom clearance for floating navigation.
- **Memory & Rendering**:
  - Memoized filtering with `useMemo` based on active search, stay type chip, and filter criteria.
  - Image lazy-loading via `RehvoImage`.
  - Incremental batch rendering to maintain 60fps scrolling.

---

## 9. Code Replacement & Cleanup Plan

| Target File | Current Role | Action |
| :--- | :--- | :--- |
| [`PgMarketplaceContent.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/pg/PgMarketplaceContent.tsx) | 871-line fragmented carousels file | **REPLACE** with unified, category-wise accommodation discovery feed |
| `PgRoomCard.tsx` | New component | **CREATE** dedicated stay & accommodation listing card |
| `PgTypeFilterRail.tsx` | New component | **CREATE** stay type selector rail with count badges |
| `PgFilterSheet.tsx` | New component | **CREATE** dedicated accommodation filter bottom sheet |
| `PgSortSheet.tsx` | New component | **CREATE** dedicated accommodation sort bottom sheet |
| `PgRoomsDiscoveryScreen.tsx` | Legacy wrapper | **CLEAN UP** (Replaced by unified `PgMarketplaceContent`) |

---

## 10. Step-by-Step Implementation Sequence (Once Approved)

### STEP 1: Engineer `PgRoomCard.tsx`
- Build the dedicated accommodation card displaying rent with meals subtext, stay type, gender suitability, furnishing, key amenities, and quick action buttons.

### STEP 2: Engineer `PgTypeFilterRail.tsx`
- Build the horizontal stay type selector (`All Stays`, `PG`, `Private Room`, `Shared Room`, `Co-Living`, `Studio / 1 RK`) with count badges.

### STEP 3: Engineer `PgFilterSheet.tsx` & `PgSortSheet.tsx`
- Build the accommodation filter bottom sheet (Rent range, Meals included, Gender preference, Attached bath, AC, Wi-Fi) and sort sheet.

### STEP 4: Rebuild `PgMarketplaceContent.tsx`
- Assemble the unified discovery feed:
  1. Stay type filter chips
  2. Control & count strip with real-time count
  3. Vertically scrollable listing feed rendering `PgRoomCard`
  4. `RehvoSkeleton` loading state
  5. `RehvoEmptyState` for zero matching listings
  6. Compact non-intrusive host footer CTA.

### STEP 5: Connect with Supabase Data & Zustand State
- Query live PG/room inventory from `useAppStore.properties` (`property_type === 'PG' | 'PRIVATE_ROOM' | 'SHARED_ROOM' | 'CO_LIVING' | 'STUDIO'`).
- Connect save toggles, chat navigation, and visit scheduling.

### STEP 6: Verification & Testing Gates
1. Run `npx tsc --noEmit` $\rightarrow$ 0 errors.
2. Run Metro Android Export Bundle $\rightarrow$ 0 errors.
3. Architecture Separation Scanner $\rightarrow$ 0 violations.
4. Git Diff Check $\rightarrow$ `web/` and `admin/` 100% frozen.
5. Visually inspect on real Expo app across all accommodation categories.

---

## 11. Strict Boundary Compliance & Freeze Verification

```
BOUNDARY AUDIT:
- web/   ──► 0 modifications (100% frozen)
- admin/ ──► 0 modifications (100% frozen)
- Mobile ──► Strict isolation in app/, src/, assets/
```

---

## 12. Approval Request

This plan establishes a concrete, accommodation-first, zero-marketing architecture for the REHVO PG & Rooms Marketplace.

**No code has been modified in this step.** Implementation will begin only upon your explicit approval of this plan.
