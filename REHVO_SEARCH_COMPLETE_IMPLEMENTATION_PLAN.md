# REHVO Mobile App — Unified Search Experience Complete Implementation Plan

---

## 1. Executive Summary & Product Objective

**REHVO Search** is the **Primary Discovery Engine** across the entire REHVO mobile ecosystem. It provides an intelligent, lightning-fast, category-aware discovery experience across all 4 marketplace verticals:

$$\text{Unified Search} \longrightarrow \begin{cases} \textbf{Homes} & \text{(Residential Flats, BHKs, Villas)} \\ \textbf{Commercial} & \text{(Offices, Retails, Showrooms, Coworking)} \\ \textbf{PG \& Rooms} & \text{(Managed PGs, Private Rooms, Co-Living, Studios)} \\ \textbf{Flatmates} & \text{(Social Roommate Discovery, Seekers, Profiles)} \end{cases}$$

### Core Design Principles:
- **Unified & Category-Aware**: ONE search route (`app/(renter)/search.tsx`) seamlessly serving all 4 marketplace modes with category-specific cards, filters, and query sources.
- **Fast, Focused & Mobile-First**: Large 54px input, instant debounced search (250ms), recent searches history, and inline suggestions.
- **Category Preservation**: Retains origin context when navigating from Home, Commercial, PG, or Flatmates.
- **Zero Clutter**: Pure discovery utility — zero marketing banners, zero fake results, zero duplicate forms.

---

## 2. Current Search Route & Architecture Audit

### A. Current Runtime Route Trace:
```
CANONICAL SEARCH ROUTE:
app/(renter)/search.tsx
  ├── REHVOSearchBar.tsx (Search input pill)
  ├── ResultsHeader.tsx (Count + sort button + list/map toggle)
  ├── FilterBottomSheet.tsx (Homes residential filter sheet)
  ├── SortBottomSheet.tsx (Sorting options)
  ├── SearchPropertyCard.tsx (Homes property card)
  ├── SearchSkeletonCard.tsx (Loading skeleton)
  ├── SearchEmptyState.tsx (No results state)
  ├── MapDiscoveryView.tsx (List/map toggle view)
  └── GuidedSearchModal.tsx (Multi-step wizard overlay)
```

### B. Problems Identified in Current Search:
1. **Residential-Only Query Scope**: Current `search.tsx` exclusively filters residential `properties` and completely ignores **Commercial**, **PG & Rooms**, and **Flatmate Profiles**.
2. **Missing Category Switcher**: Search does not expose a 4-category switcher (`Homes`, `Commercial`, `PG & Rooms`, `Flatmates`), preventing users from searching commercial spaces, PGs, or flatmates from the global search route.
3. **Card Type Mismatch**: Renders all results using a single card format (`SearchPropertyCard`), failing to show commercial area metrics, PG meal indicators, or portrait-first flatmate profiles.
4. **Guided Search Wizard Intrusion**: `GuidedSearchModal` adds unnecessary modal overhead when users simply want instant search results.

---

## 3. Real Data Model & Searchable Fields Matrix

The search engine queries real PostgreSQL tables via Supabase services and `useAppStore.ts`:

| Vertical | Source Data | Searchable Fields | Filterable Attributes | Rendered Result Card |
| :--- | :--- | :--- | :--- | :--- |
| **Homes** | `properties` (`category='residential'`) | `title`, `locality`, `city`, `address`, `bhk`, `description` | Rent range, BHK, Furnishing, Verified, No Brokerage | `RehvoPropertyCard` |
| **Commercial** | `properties` (`category='commercial'`) | `title`, `locality`, `city`, `address`, `commercial_type`, `description` | Lease range, Commercial Type (*Office, Shop, Showroom, Coworking*), Area sq.ft, Furnishing | `CommercialPropertyCard` |
| **PG & Rooms** | `properties` (`property_type IN ('PG','PRIVATE_ROOM','SHARED_ROOM','CO_LIVING','STUDIO')`) | `title`, `locality`, `city`, `address`, `description`, `amenities` | Rent range, Stay Type (*Private Room, Shared, Co-Living, Studio*), Meals Included, Gender, AC | `PgRoomCard` |
| **Flatmates** | `flatmate_profiles` (`status='published'`) | `name`, `display_name`, `locality`, `city`, `preferred_locations`, `profession`, `bio` | Budget limit, Room Preference (*Private vs Shared*), Gender, Move-in, Lifestyle tags (*WFH, Non-Smoker*) | `FlatmateProfileCard` |

---

## 4. Search Modes & Category-Aware Switching

The user can switch the active search category at any moment using a compact 4-tab category switcher:

```
┌──────────────────────────────────────────────────────────┐
│ [BACK]  🔍 "Search locality, property or area..."  [CLR] │
├──────────────────────────────────────────────────────────┤
│ [ Homes ]    [ Commercial ]    [ PG & Rooms ]    [ Flatmates ] │
│   ─────                                                  │
└──────────────────────────────────────────────────────────┘
```

### Category-Specific Dynamic Adaptations:
1. **Dynamic Placeholder**:
   - `Homes`: *"Search locality, residential flat, area..."*
   - `Commercial`: *"Search office, shop, showroom, area..."*
   - `PG & Rooms`: *"Search PG, room, co-living, area..."*
   - `Flatmates`: *"Search flatmates, occupation, locality..."*
2. **Dynamic Quick Filters**: Quick filter chips update immediately to match the selected category.
3. **Dynamic Filter Sheet**: Opening Filters presents category-specific parameters.
4. **Dynamic Card Geometry**: Results render using the canonical card for that category.

---

## 5. Search Header & Input UX Specification

- **Capsule Geometry**: 54px height, `#FFFFFF` surface, 1px `#E9E6E0` border, 27px border radius.
- **Left Icon**: `Search` icon (`#19181C`).
- **Input Field**: Auto-focused or focused on tap, keyboard search return key, instant clear `(X)` button when text is present.
- **Right Action**: Filter trigger button (`SlidersHorizontal`) with active filter dot indicator.
- **Origin Category Memory**:
  - `Home (Commercial)` $\rightarrow$ `Search` opens with `Commercial` pre-selected.
  - `Home (PG)` $\rightarrow$ `Search` opens with `PG & Rooms` pre-selected.
  - `Home (Flatmates)` $\rightarrow$ `Search` opens with `Flatmates` pre-selected.
  - `Home (Homes)` $\rightarrow$ `Search` opens with `Homes` pre-selected.

---

## 6. Suggestions & Recent Searches Architecture

When the search input is focused or query is being typed, an overlay suggestion panel appears above results:

```
┌──────────────────────────────────────────────────────────┐
│ RECENT SEARCHES                                [Clear]   │
│ 🕒 Andheri West (Homes)                                   │
│ 🕒 Bandra West (Commercial)                               │
│ 🕒 Powai (Flatmates)                                      │
├──────────────────────────────────────────────────────────┤
│ POPULAR LOCALITIES IN MUMBAI                             │
│ 📍 Andheri West                                           │
│ 📍 Bandra West                                            │
│ 📍 Powai                                                  │
│ 📍 BKC (Bandra Kurla Complex)                             │
│ 📍 Lower Parel                                            │
│ 📍 Thane West                                             │
└──────────────────────────────────────────────────────────┘
```

- **Recent Searches Storage**: Local state in `useAppStore` with max 5 items. Tapping reuses query; `(X)` removes item.
- **Locality Suggestions**: Quick taps auto-fill locality and execute search.

---

## 7. Category-Adaptive Quick Filter Rails

Context-aware quick filter chips rendered directly below category switcher:

### A. Homes Quick Filters:
`[ All Homes ]` `[ 1 BHK ]` `[ 2 BHK ]` `[ 3 BHK ]` `[ Under ₹30k ]` `[ Under ₹60k ]` `[ Fully Furnished ]` `[ 0% Brokerage ]`

### B. Commercial Quick Filters:
`[ All Spaces ]` `[ Office ]` `[ Retail / Shop ]` `[ Showroom ]` `[ Coworking ]` `[ Under ₹50k ]` `[ Bare Shell ]`

### C. PG & Rooms Quick Filters:
`[ All Stays ]` `[ PG / Hostel ]` `[ Private Room ]` `[ Shared Stay ]` `[ Co-Living ]` `[ Studio / 1 RK ]` `[ Meals Incl. ]`

### D. Flatmates Quick Filters:
`[ All Flatmates ]` `[ Private Room ]` `[ Shared Room ]` `[ Under ₹15k ]` `[ Under ₹25k ]` `[ WFH Friendly ]` `[ Near Metro ]`

---

## 8. Category-Specific Filter Bottom Sheet (`SearchFilterSheet`)

Tapping the Filter button opens a unified, category-adaptive bottom sheet:

- **Homes Mode**: Rent Range, BHK selection (*1, 2, 3, 4+*), Furnishing, Brokerage Free, Verified Only.
- **Commercial Mode**: Monthly Rent, Commercial Type (*Office, Shop, Showroom, Coworking, Warehouse*), Area Range (sq.ft), Furnishing (*Bare Shell, Warm Shell, Fully Furnished*).
- **PG & Rooms Mode**: Monthly Budget, Stay Type (*PG, Private Room, Shared, Co-Living, Studio*), Meals Included toggle, Gender (*Girls, Boys, Unisex*), AC toggle.
- **Flatmates Mode**: Budget limit, Room Preference (*Private vs Shared*), Gender rule, Move-in timeline, Lifestyle tags (*WFH, Non-Smoker, Pet Friendly*).
- **Footer**: `[ Reset All ]` and `[ Show {N} Results ]`.

---

## 9. Search Sort Bottom Sheet (`SearchSortSheet`)

Category-specific sorting options:
- **Homes & Commercial**: `Recommended`, `Price: Low to High`, `Price: High to Low`, `Newest Listed`, `Most Saved`.
- **PG & Rooms**: `Recommended`, `Rent: Low to High`, `Rent: High to Low`, `Newest Listed`.
- **Flatmates**: `Recommended`, `Budget: Low to High`, `Budget: High to Low`, `Recently Active`.

---

## 10. Results Feed & Category-Specific Card Mapping

The search results list dynamically maps data to its dedicated component:

```typescript
// SEARCH RESULT CARD SELECTION:
switch (activeCategory) {
  case 'commercial':
    return <CommercialPropertyCard property={item} ... />;
  case 'pg':
    return <PgRoomCard property={item} ... />;
  case 'flatmates':
    return <FlatmateProfileCard profile={item} ... />;
  case 'homes':
  default:
    return <RehvoPropertyCard property={item} ... />;
}
```

---

## 11. Search Layout Structure & Flow

```
┌──────────────────────────────────────────────────────────┐
│ [SEARCH HEADER (Back + 54px Capsule + Filter)]           │
├──────────────────────────────────────────────────────────┤
│ [CATEGORY SWITCHER (Homes | Commercial | PG | Flatmates)]│
├──────────────────────────────────────────────────────────┤
│ [QUICK FILTER RAIL (Category-Adaptive Chips)]            │
├──────────────────────────────────────────────────────────┤
│ [RESULTS CONTROL STRIP]                                  │
│ "24 Commercial Spaces found"         [ Sort: Recommended ]│
├──────────────────────────────────────────────────────────┤
│ [ACTIVE FILTER PILLS (Removable)]                        │
│ [ 📍 Andheri West (x) ] [ ₹20k–₹50k (x) ] [ Office (x) ] │
├──────────────────────────────────────────────────────────┤
│ [RESULTS FEED (Vertically Scrollable FlatList)]          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Category-Specific Result Card #1                     │ │
│ └──────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Category-Specific Result Card #2                     │ │
│ └──────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Category-Specific Result Card #3                     │ │
│ └──────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────┤
│ [FLOATING BOTTOM NAVIGATION (Persistent Shell)]          │
│ (Home)  (Search: Active)  (+)  (Saved)  (Profile)        │
└──────────────────────────────────────────────────────────┘
```

---

## 12. Loading, Empty & Error States

1. **Loading State**: Category-matched skeleton cards (`SearchSkeletonCard` adapting height: 260px for Homes/Commercial, 220px for PG, 200px for Flatmates).
2. **Empty State**: `RehvoEmptyState` with dynamic messaging:
   - *"No {category} found in this area"*
   - Subtitle: *"Try clearing filters or searching another MMR locality."*
   - Actions: `[ Reset Filters ]` and `[ Clear Search ]`.
3. **Error State**: `RehvoErrorState` with retry action.

---

## 13. Map Discovery Assessment

- **Current Status**: `MapDiscoveryView.tsx` exists for residential properties in Mumbai.
- **Assessment**: Map mode will remain an optional toggle for Homes and Commercial where geospatial latitude/longitude coordinates exist. For Flatmates, search strictly uses portrait-first list view to prioritize human profiles.

---

## 14. Performance & Debouncing Strategy

- **Debounce Input**: 250ms debounce on keyword input using `useMemo`/`useCallback` to eliminate unnecessary database calls.
- **Memoized Filtering**: Instant client-side filtering over cached store items before network fetching.
- **FlatList Optimization**: `initialNumToRender={6}`, `maxToRenderPerBatch={8}`, `windowSize={5}`, `removeClippedSubviews={true}`.

---

## 15. Component Architecture & File Plan

| File Path | Action | Description |
| :--- | :--- | :--- |
| [`app/(renter)/search.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/search.tsx) | **REBUILD** | Canonical search container orchestrating all 4 categories |
| `src/components/search/SearchTopHeader.tsx` | **CREATE** | Back button + search input + filter button |
| `src/components/search/SearchCategoryTabs.tsx` | **CREATE** | 4-tab category switcher (`Homes`, `Commercial`, `PG & Rooms`, `Flatmates`) |
| `src/components/search/SearchQuickFilterRail.tsx`| **CREATE** | Category-adaptive quick filter chips |
| `src/components/search/SearchFilterSheet.tsx` | **CREATE** | Unified multi-category filter bottom sheet |
| `src/components/search/SearchSortSheet.tsx` | **CREATE** | Unified multi-category sort bottom sheet |
| `src/components/search/SearchSuggestionsView.tsx`| **CREATE** | Recent searches & locality suggestions overlay |
| `src/components/search/SearchResultsFeed.tsx` | **CREATE** | Category-mapped FlatList feed |
| `src/components/search/REHVOSearchBar.tsx` | **DEPRECATE / MERGE** | Merged into `SearchTopHeader.tsx` |
| `src/components/search/SearchPropertyCard.tsx` | **DEPRECATE** | Replaced by canonical `RehvoPropertyCard` |
| `src/components/search/guided/*` | **DISCONNECT** | Removed from active search path (deferred to dedicated wizard) |

---

## 16. Step-by-Step Implementation Sequence (Once Approved)

### STEP 1: Engineer `SearchTopHeader.tsx` & `SearchCategoryTabs.tsx`
- Build the 54px search header with back navigation, clear button, filter trigger, and 4-tab category selector.

### STEP 2: Engineer `SearchQuickFilterRail.tsx`
- Build dynamic quick filters that instantly adapt based on active category (`Homes`, `Commercial`, `PG`, `Flatmates`).

### STEP 3: Engineer `SearchFilterSheet.tsx` & `SearchSortSheet.tsx`
- Build the category-aware filter bottom sheet and sort bottom sheet.

### STEP 4: Engineer `SearchSuggestionsView.tsx`
- Build recent search history and popular MMR locality suggestions overlay.

### STEP 5: Engineer `SearchResultsFeed.tsx`
- Build the unified results feed dynamically rendering `RehvoPropertyCard`, `CommercialPropertyCard`, `PgRoomCard`, or `FlatmateProfileCard`.

### STEP 6: Rebuild `app/(renter)/search.tsx`
- Assemble the complete search page with category preservation, debounced query, and state management.

### STEP 7: Connect Search Navigation from Home & Listing Pages
- Pass category and location route params from Home category shortcuts and search docks into `search.tsx`.

### STEP 8: Clean up Deprecated Legacy Files
- Remove unused legacy search files (`SearchPropertyCard.tsx`, disconnected components).

### STEP 9: Verification & Testing Gates
1. Run `npx tsc --noEmit` $\rightarrow$ 0 errors.
2. Run Metro Android Export Bundle $\rightarrow$ 0 errors.
3. Architecture Separation Scanner $\rightarrow$ 0 violations.
4. Git Diff Check $\rightarrow$ `web/` and `admin/` 100% frozen.
5. Verify on real Expo runtime across all 4 categories.

---

## 17. Strict Boundary Compliance & Freeze Verification

```
BOUNDARY AUDIT:
- web/   ──► 0 modifications (100% frozen)
- admin/ ──► 0 modifications (100% frozen)
- Mobile ──► Strict isolation in app/, src/, assets/
```

---

## 18. Approval Request

This plan establishes a unified, intelligent, category-aware Search Experience across all 4 REHVO marketplace verticals.

**No code has been modified in this step.** Implementation will begin only upon your explicit approval of this plan.
