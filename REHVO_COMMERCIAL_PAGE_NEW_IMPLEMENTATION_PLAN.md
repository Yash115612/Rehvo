# REHVO Mobile App — Commercial Marketplace Page Implementation Plan

---

## 1. Executive Summary & Product Objective

The **REHVO Commercial Page** is being completely redesigned from an ad-heavy, multi-section promotional landing page into a **focused, high-utility Commercial Property Inventory Discovery Marketplace**.

### Core Product Principle:
$$\text{Commercial Page} = \textbf{Inventory Discovery} \quad (\text{NOT marketing}, \text{NOT ads}, \text{NOT long storytelling})$$

The user opens Commercial and immediately gains the ability to:
1. **Search commercial properties** (*Office, Shop, Showroom, Warehouse, Coworking, Locality*).
2. **Filter by commercial category** (*All, Office, Shop, Showroom, Warehouse, Coworking, Commercial Plot*).
3. **Apply commercial-specific filters** (*Rent, Carpet/Built-up Area, Bare/Warm Shell Furnishing, Parking, Power Backup*).
4. **Sort listings** (*Price, Area, Newest, Recommended*).
5. **Browse a clean, vertical listing feed** with dedicated commercial data cards (*sq ft, rent, commercial specs, verified badges*).
6. **Open canonical Property Details** adapted for commercial workspaces.
7. **Save, Chat, Enquire, and Schedule a physical walkthrough**.

---

## 2. Current Commercial Route & Architecture Audit

### A. Current Runtime Route Trace:
```
app/(renter)/commercial.tsx
  └── <MarketplaceShell initialCategory="commercial" />
        └── <CommercialMarketplaceContent />
```

### B. Current Component Tree & Problems Identified:
Currently, `CommercialMarketplaceContent.tsx` renders **11 separate marketing & storytelling sections**:
```
CURRENT CLUTTERED STRUCTURE (TO BE REPLACED):
├── 01 CommercialHero (Large promotional banner)
├── 02 CommercialTypeShortcuts
├── 03 CommercialFeaturedSection (Sponsored banner block)
├── 04 CommercialOfficesSection (Horizontal office carousel)
├── 05 CommercialShopsSection (Horizontal shop carousel)
├── 06 CommercialWarehousesSection (Horizontal warehouse carousel)
├── 07 CommercialCoworkingSection (Horizontal coworking carousel)
├── 08 CommercialBusinessHubsSection (Marketing locations list)
├── 09 CommercialAllPropertiesSection (Duplicate vertical list)
├── 10 CommercialWhyRehvo (Marketing benefits wall)
└── 11 CommercialHostCTA (Large host promotion)
```

### Root Cause of Poor UX:
1. **Ad-Heavy & Fragmented**: 5 different horizontal carousels splitting inventory into disjointed chunks rather than providing a unified, filterable feed.
2. **Excessive Marketing**: 4 separate promotional blocks (*Hero, Featured, Why REHVO, Business Hubs*) push real listings far down the viewport.
3. **Low Information Density**: Cards lack commercial-first hierarchy (*carpet area, built-up sq ft, power backup, parking spaces, bare shell status*).

---

## 3. Real Data Model & Supported Commercial Categories

The redesign strictly leverages existing Supabase schema and TypeScript domain models from [`src/types/index.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/types/index.ts). Zero fabricated categories or mock structures.

### Supported Commercial Property Types (`PropertyType`):
- `OFFICE`: Corporate offices, IT suites, plug-and-play startup floors.
- `SHOP`: Retail outlets, high-street shops.
- `SHOWROOM`: Large commercial retail showrooms, brand stores.
- `WAREHOUSE`: Industrial godowns, logistics and storage spaces.
- `COWORKING`: Dedicated desks, private team cabins, flex spaces.
- `COMMERCIAL_BUILDING`: Independent commercial buildings, full floors.
- `COMMERCIAL_PLOT`: Commercial land parcels.
- `OTHER_COMMERCIAL`: Institutional, healthcare, and specialized commercial spaces.

### Commercial-Specific Data Attributes Available in `Property`:
- `area_sqft: number`: Total built-up area.
- `carpet_area?: number`: Usable carpet area.
- `rent: number`: Monthly lease/rent amount in INR.
- `deposit: number`: Security deposit.
- `maintenance: number`: Monthly society/building maintenance.
- `brokerage: number`: Zero on REHVO direct listings.
- `furnishing: FurnishingType`: `BARE_SHELL` | `WARM_SHELL` | `FULLY_FURNISHED` | `SEMI_FURNISHED` | `UNFURNISHED`.
- `parking: string` & `parking_spaces?: string`: Dedicated parking capacity.
- `power_backup?: boolean`: 100% DG power backup availability.
- `lift?: boolean`: High-speed passenger/freight elevators.
- `washrooms?: number`: Private vs common washrooms.
- `floor_number?: string` / `floor: number` & `total_floors: number`.
- `verification_status: VerificationStatus`: `VERIFIED` badge.
- `is_sponsored?: boolean`: Subtle sponsored flag in feed (no giant banners).

---

## 4. Target Commercial Marketplace Architecture

The new Commercial page replaces the 11 fragmented sections with **ONE streamlined, high-utility marketplace feed**:

```
TARGET COMMERCIAL MARKETPLACE STRUCTURE:
┌──────────────────────────────────────────────────────────┐
│ [TOP PERSISTENT SHELL]                                   │
│ Avatar  ·  "Good morning, Yash"  ·  📍 Mumbai  ·  Bell   │
├──────────────────────────────────────────────────────────┤
│ [COMMERCIAL SEARCH DOCK]                                 │
│ 🔍 "Search office, shop, showroom, area..."  [ Filter ]  │
├──────────────────────────────────────────────────────────┤
│ [PROPERTY TYPE CHIPS (Horizontal Rail)]                  │
│ [ All ] [ Office ] [ Shop ] [ Showroom ] [ Warehouse ]   │
│ [ Coworking ] [ Commercial Plot ]                        │
├──────────────────────────────────────────────────────────┤
│ [CONTROL & COUNT STRIP]                                  │
│ "24 Commercial Spaces"               [ Sort: Recommended ]│
├──────────────────────────────────────────────────────────┤
│ [COMMERCIAL LISTING FEED (Vertically Scrollable)]        │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ CommercialPropertyCard #1                            │ │
│ │ • High-res cover + [VERIFIED] pill + [♥ Save]       │ │
│ │ • ₹1.45L / month  (₹8,000 maint)                     │ │
│ │ • Grade-A Executive Office Suite                     │ │
│ │ • G Block, BKC, Mumbai                               │ │
│ │ • 2,200 sq ft Built-up • 1,800 sq ft Carpet          │ │
│ │ • Fully Furnished • 4 Covered Cars • Power Backup    │ │
│ │ • [ Chat ] [ Schedule Walkthrough ]                  │ │
│ └──────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ CommercialPropertyCard #2 (Shop / Retail)            │ │
│ └──────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ CommercialPropertyCard #3 (Warehouse / Storage)      │ │
│ └──────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────┤
│ [CONTEXTUAL LANDLORD FOOTER TILE (Optional/Compact)]    │
│ "Have a commercial property? List it on REHVO →"       │
├──────────────────────────────────────────────────────────┤
│ [FLOATING BOTTOM NAVIGATION (Persistent Shell)]          │
│ (Home)  (Search)  (+)  (Saved)  (Profile)                │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Detailed Component Specifications

### A. Commercial Search Component (`CommercialSearchBar`)
- **Visuals**: 54px capsule matching master tokens (`#FFFFFF` background, `#E9E6E0` border, `#77747C` muted text).
- **Placeholder**: *"Search office, shop, showroom, area..."*
- **Actions**:
  - Tapping input text allows immediate inline typing or opens keyword search.
  - Tapping filter button opens the dedicated **Commercial Filter Bottom Sheet**.

### B. Commercial Property Type Selector (`CommercialTypeFilterRail`)
- **Pills**: `All Spaces`, `Office`, `Shop`, `Showroom`, `Warehouse`, `Coworking`, `Plot`.
- **Interaction**:
  - Tapping a pill immediately filters the commercial feed in-place without page reloading.
  - Active pill: `#19181C` background + `#FFFFFF` text.
  - Inactive pill: `#FFFFFF` surface + `#E9E6E0` border + `#77747C` text.

### C. Commercial Filter Bottom Sheet (`CommercialFilterSheet`)
- Accessed via the Filter icon in the search bar or the filter pill strip.
- **Filter Controls**:
  1. **Budget / Monthly Rent Slider**: ₹0 to ₹10L+ with common price milestones.
  2. **Minimum Area (Sq. Ft.)**: Any, 500+ sq ft, 1,000+ sq ft, 2,500+ sq ft, 5,000+ sq ft, 10,000+ sq ft.
  3. **Furnishing Status**: All, Bare Shell, Warm Shell, Fully Furnished, Semi Furnished.
  4. **Key Commercial Amenities**: Dedicated Parking, 100% Power Backup, Elevators / Lifts, Metro Proximity (<500m), Fire Safety NOC.
  5. **Possession / Availability**: Immediate, Within 30 Days.
- **Actions**: *Clear All* (resets filters) and *Show {Count} Spaces* (applies filters and closes sheet).

### D. Sort Control (`CommercialSortSheet`)
- Options:
  1. **Recommended** (Default: High relevance & verified first)
  2. **Rent: Low to High**
  3. **Rent: High to Low**
  4. **Area: High to Low** (Largest floor plates first)
  5. **Newest Listed**

### E. Dedicated Commercial Listing Card (`CommercialPropertyCard`)
- **Card Anatomy**:
  1. **Hero Image (180px)**: Uses [`RehvoImage`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoImage.tsx) with rounded 18px clipping, skeleton loader, and error fallback.
  2. **Top Overlay**: `[VERIFIED]` dark badge on top-left, `[♥ Save]` button on top-right.
  3. **Price Tag**: `₹{Rent}/mo` formatted in Indian numbering (`₹1,45,000/mo` or `₹1.45L/mo`) with maintenance subtext.
  4. **Title & Locality**: Bold title (`Grade-A Executive Office Suite`) + location (`BKC, Mumbai`).
  5. **Specs Badges**:
     - Area: `2,200 sq ft`
     - Type: `Office` / `Retail Shop` / `Warehouse`
     - Status: `Bare Shell` / `Fully Furnished`
     - Parking: `4 Covered Cars`
  6. **Quick Actions Row**:
     - *Chat with Owner/Rep* (`RehvoButton` outline)
     - *Schedule Visit* (`RehvoButton` primary dark)

### F. Result Count & Contextual Feedback Bar
- Displays active result count: *"Showing 18 Verified Commercial Spaces in Mumbai"*.
- If filters are active, displays an *"Active Filters (3) · Reset"* chip.

### G. Empty & No-Results States (`RehvoEmptyState`)
- When no commercial listings match active filters/location:
  - Icon: `Building2` or `Search`
  - Title: *"No commercial spaces found"*
  - Subtitle: *"Try adjusting your rent range, property type, or location filters."*
  - CTA Button: *"Reset Filters"* or *"Explore All Commercial"*.

---

## 6. Shared Marketplace Shell Integration

- **Single Persistent Shell**: `MarketplaceShell.tsx` remains mounted as the root container.
- **Category Switching**: Selecting `Commercial` in `HomeCategoryShortcuts` displays `CommercialMarketplaceContent` with the 320ms in-place crossfade.
- **Location Synchronization**: Changing the location pill (`📍 Mumbai` $\rightarrow$ `📍 BKC` or `📍 Thane`) immediately updates the commercial listing feed query.
- **Zero Shell Duplication**: `CommercialMarketplaceContent` does NOT render a redundant top header or redundant bottom navigation.

---

## 7. Navigation & Interaction Workflows

```
USER INTERACTION WORKFLOW:
1. Tap [ Commercial ] in Category Switcher ──► Content crossfades to Commercial Marketplace Feed
2. Tap [ Office ] Chip ─────────────────────► Feed instantly filters to Office spaces (Count updates)
3. Tap [ Filter ] ──────────────────────────► CommercialFilterSheet slides up
4. Select Min 1,500 sq ft + Bare Shell ──────► Tap "Show 8 Spaces" ──► Feed updates
5. Tap Commercial Card ─────────────────────► Opens canonical app/(renter)/property/[id].tsx
6. Tap [ Save Heart ] ──────────────────────► Toggles saved state in useAppStore
7. Tap [ Chat ] ────────────────────────────► Starts/opens chat in app/(renter)/chat/[id].tsx
8. Tap [ Schedule Visit ] ──────────────────► Opens visit modal for physical inspection
```

---

## 8. Mobile Responsiveness & Performance Plan

- **Viewport Standards**: Tested for 375px (iPhone SE/mini), 390px (iPhone 14/15), and 430px (iPhone Plus/Max).
- **Layout Safety**: Single vertical scroll container, zero horizontal overflow, 120px bottom clearance for floating navigation.
- **Memory & Rendering**:
  - Memoized filtering with `useMemo` based on active search, type chip, and filter criteria.
  - Image lazy-loading via `RehvoImage`.
  - Incremental batch rendering to maintain 60fps scrolling.

---

## 9. Code Replacement & Cleanup Plan

| Target File | Current Role | Action |
| :--- | :--- | :--- |
| [`CommercialMarketplaceContent.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/commercial/CommercialMarketplaceContent.tsx) | 11 fragmented marketing sections | **REPLACE** with unified, category-wise inventory discovery feed |
| `CommercialPropertyCard.tsx` | New component | **CREATE** dedicated commercial listing card primitive |
| `CommercialFilterSheet.tsx` | New component / adapt existing | **CREATE** dedicated commercial bottom sheet filter |
| `CommercialHero.tsx` | Marketing banner | **DEPRECATE / REMOVE** from commercial feed |
| `CommercialFeaturedSection.tsx` | Sponsored banner | **DEPRECATE / REMOVE** from commercial feed |
| `CommercialOfficesSection.tsx` | Fragmented carousel | **DEPRECATE / REMOVE** (Replaced by unified feed) |
| `CommercialShopsSection.tsx` | Fragmented carousel | **DEPRECATE / REMOVE** (Replaced by unified feed) |
| `CommercialWarehousesSection.tsx` | Fragmented carousel | **DEPRECATE / REMOVE** (Replaced by unified feed) |
| `CommercialCoworkingSection.tsx` | Fragmented carousel | **DEPRECATE / REMOVE** (Replaced by unified feed) |
| `CommercialBusinessHubsSection.tsx` | Marketing hubs | **DEPRECATE / REMOVE** from commercial feed |
| `CommercialWhyRehvo.tsx` | Marketing wall | **DEPRECATE / REMOVE** from commercial feed |
| `CommercialHostCTA.tsx` | Large host banner | **REPLACE** with compact contextual footer card |

---

## 10. Step-by-Step Implementation Sequence (Once Approved)

### STEP 1: Engineer `CommercialPropertyCard.tsx`
- Build the dedicated commercial listing card displaying area, rent, commercial specs, furnishing status, parking, verified badges, and quick action buttons.

### STEP 2: Engineer `CommercialFilterSheet.tsx` & `CommercialSortSheet.tsx`
- Build the commercial filter bottom sheet (Rent range, Sq ft area, Bare/Furnished, Parking, Power Backup) and sort sheet.

### STEP 3: Rebuild `CommercialMarketplaceContent.tsx`
- Assemble the unified discovery feed:
  1. Commercial search bar
  2. Property type selector pills (`All`, `Office`, `Shop`, `Showroom`, `Warehouse`, `Coworking`, `Plot`)
  3. Filter & Sort control bar with real-time count
  4. Vertically scrollable listing feed rendering `CommercialPropertyCard`
  5. `RehvoEmptyState` for zero matching listings
  6. Compact non-intrusive landlord footer CTA.

### STEP 4: Connect with Supabase Data & Zustand State
- Query live commercial listings from `useAppStore.properties` (`property.category === 'commercial'` or commercial `property_type`).
- Connect save toggles, chat navigation, and visit scheduling.

### STEP 5: Verification & Testing Gates
1. Run `npx tsc --noEmit` $\rightarrow$ 0 errors.
2. Run Metro Android Export Bundle $\rightarrow$ 0 errors.
3. Architecture Separation Scanner $\rightarrow$ 0 violations.
4. Git Diff Check $\rightarrow$ `web/` and `admin/` 100% frozen.
5. Visually inspect on real Expo app across all commercial categories.

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

This plan establishes a concrete, inventory-first, zero-marketing architecture for the REHVO Commercial Marketplace.

**No code has been modified in this step.** Implementation will begin only upon your explicit approval of this plan.
