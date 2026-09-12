# REHVO Mobile App — Saved Experience Complete Redesign & Implementation Plan

---

## 1. Executive Summary & Product Objective

The **REHVO Saved Experience** is the user's **Personal Property Collection** — a centralized, private workspace where users organize, review, compare, and manage the properties and flatmate profiles they have shortlisted across the entire app.

$$\textbf{Saved Collection Engine} \longrightarrow \begin{cases} \textbf{All} & \text{(Unified personal collection stream)} \\ \textbf{Homes} & \text{(Shortlisted residential apartments, flats, BHKs)} \\ \textbf{Commercial} & \text{(Saved office spaces, shops, showrooms, coworking)} \\ \textbf{PG \& Rooms} & \text{(Shortlisted managed PGs, co-living, private stays)} \\ \textbf{Flatmates} & \text{(Saved compatible roommate profiles)} \end{cases}$$

### Core Product Principles:
- **Personal Collection, Not a Generic List**: Focused, calm, organized utility — zero marketing banners, zero ads, zero duplicate search filters.
- **Unified 5-Tab Collection Architecture**: Seamlessly organizes all 4 marketplace verticals (`All`, `Homes`, `Commercial`, `PG & Rooms`, `Flatmates`) within a single unified route.
- **Category-Specific Card Mapping**: Renders each saved item using its canonical card component rather than a generic card.
- **Instant Two-Way State Synchronization**: Optimistic unsave with micro-animations; unsaving immediately updates store state and persists to Supabase.
- **Contextual Empty State Recovery**: Context-aware CTAs directing users back to the relevant marketplace discovery vertical.

---

## 2. Current Saved Route & Component Audit

### A. Current Runtime Route Trace:
```
CANONICAL ROUTE:
app/(renter)/saved.tsx
  ├── SegmentedControl (Properties vs Flatmates)
  ├── CategoryFilterRail (Flats | PG | Rooms | Studios)
  ├── SavedSortModal.tsx (Recently Saved | Price Low/High | Newest)
  ├── SavedCard.tsx (Generic custom card with complex overlays)
  ├── FlatmateProfileCard.tsx (Flatmate profile card)
  ├── SavedEmptyState.tsx (Basic empty state)
  └── SavedSkeleton.tsx (Generic skeleton)
```

### B. Identified Problems in Existing Saved Screen:
1. **Commercial Properties Omitted**: Current `saved.tsx` only handles residential flats, PGs, and flatmates — completely ignoring saved **Commercial spaces**.
2. **Dual-Layer Tab Clutter**: Uses an awkward two-level segmented tab (`Properties vs Flatmates` + sub-categories `Flats | PG | Rooms | Studios`), creating visual confusion.
3. **Legacy Card Divergence**: Uses a bespoke `SavedCard.tsx` instead of the canonical `RehvoPropertyCard`, `CommercialPropertyCard`, and `PgRoomCard`, causing UI inconsistency.
4. **Weak Empty State Guidance**: Generic empty states lack direct routing to category discovery.

---

## 3. Real Data Model & Supported Saved Entities

The Saved system connects to real Supabase tables via `src/services/saved.ts` and `src/store/useAppStore.ts`:

| Vertical | Backend Table | Store State | Unique ID | Detail Route | Rendered Card Component |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Homes** | `saved_properties` | `savedPropertyIds` | `property.id` | `/(renter)/property/[id]` | [`RehvoPropertyCard`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoPropertyCard.tsx) |
| **Commercial** | `saved_properties` | `savedPropertyIds` | `property.id` | `/(renter)/property/[id]` | [`CommercialPropertyCard`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/commercial/CommercialPropertyCard.tsx) |
| **PG & Rooms** | `saved_properties` | `savedPropertyIds` | `property.id` | `/(renter)/property/[id]` | [`PgRoomCard`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/pg/PgRoomCard.tsx) |
| **Flatmates** | `saved_flatmates` | `savedFlatmateIds` | `flatmate_profile.id` | `/(renter)/flatmate/[id]` | [`FlatmateProfileCard`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/flatmates/FlatmateProfileCard.tsx) |

---

## 4. Visual Layout & Information Architecture

```
┌──────────────────────────────────────────────────────────┐
│ Saved                                                    │
│ Your personal property collection                        │
├──────────────────────────────────────────────────────────┤
│ ◄── [ All (14) ] [ Homes (6) ] [ Commercial (3) ] ... ──► │  ◄── HORIZONTAL SWIPEABLE TABS
│       ────────                                           │
├──────────────────────────────────────────────────────────┤
│ 14 saved items                        [ Sort: Recently ] │  ◄── CONTROL STRIP
├──────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────┐ │
│ │  Saved Result Card #1 (Category-Specific)           │ │
│ └──────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │  Saved Result Card #2 (Category-Specific)           │ │  ◄── VERTICAL SCROLL FEED
│ └──────────────────────────────────────────────────────┘ │      (Single FlatList)
│ ┌──────────────────────────────────────────────────────┐ │
│ │  Saved Result Card #3 (Category-Specific)           │ │
│ └──────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────┤
│ [FLOATING BOTTOM NAVIGATION (Layout level)]              │
│ (Home)  (Search)  (+)  (Saved: Active)  (Profile)        │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Header & Saved Summary Design

- **Title**: `Saved` (`fontSize: 24`, `fontWeight: '900'`, `#19181C`).
- **Subtitle**: `Your personal property collection` (`fontSize: 13`, `fontWeight: '500'`, `#77747C`).
- **Control Strip**:
  - Left: Live count (e.g. `14 saved items` or `6 homes saved`).
  - Right: Sort trigger button with active sort indicator (`ArrowUpDown` icon + active label).

---

## 6. Unified Horizontal Category Tabs

Single continuous horizontal row supporting swipe with `showsHorizontalScrollIndicator={false}`:

1. **All (`ALL`)**: Unified stream of all saved items.
2. **Homes (`HOMES`)**: Residential properties (`category === 'residential'`).
3. **Commercial (`COMMERCIAL`)**: Commercial properties (`category === 'commercial'`).
4. **PG & Rooms (`PG`)**: Managed PGs, private rooms, co-living (`property_type IN ('PG','PRIVATE_ROOM','SHARED_ROOM','CO_LIVING','STUDIO')`).
5. **Flatmates (`FLATMATES`)**: Shortlisted flatmate profiles (`savedFlatmateIds`).

Each tab displays a live count badge (e.g., `Homes (6)`), styled with REHVO's active underline indicator.

---

## 7. Category-Specific Card Mapping

The Saved list dynamically maps items to their canonical card:

```typescript
// DYNAMIC CARD SELECTION IN SAVED LIST:
if (item.type === 'flatmate') {
  return (
    <FlatmateProfileCard
      profile={item}
      isSaved={true}
      onToggleSave={() => handleRemoveFlatmate(item.id)}
      onPress={() => router.push(`/(renter)/flatmate/${item.id}`)}
    />
  );
}

if (item.category === 'commercial') {
  return (
    <CommercialPropertyCard
      property={item}
      isSaved={true}
      onToggleSave={() => handleRemoveProperty(item.id)}
      onPress={() => router.push(`/(renter)/property/${item.id}`)}
    />
  );
}

if (isPgOrRoom(item)) {
  return (
    <PgRoomCard
      property={item}
      isSaved={true}
      onToggleSave={() => handleRemoveProperty(item.id)}
      onPress={() => router.push(`/(renter)/property/${item.id}`)}
    />
  );
}

return (
  <RehvoPropertyCard
    property={item}
    isSaved={true}
    onToggleSave={() => handleRemoveProperty(item.id)}
    onPress={() => router.push(`/(renter)/property/${item.id}`)}
  />
);
```

---

## 8. Saved Sorting System

Supported sorting modes:
- **Recently Saved** (`RECENTLY_SAVED`): Preserves natural saved order.
- **Price: Low to High** (`PRICE_LOW_TO_HIGH`): Ascending monthly rent / budget.
- **Price: High to Low** (`PRICE_HIGH_TO_LOW`): Descending monthly rent / budget.
- **Newest Listed** (`NEWEST`): Sorted by listing creation date (`created_at`).

---

## 9. Immediate Unsave & State Synchronization

- Tapping the active heart icon triggers an optimistic removal:
  1. Item is immediately removed from the active saved list.
  2. A discreet toast confirmation appears: *"Removed from Saved"*.
  3. Supabase deletion operation executes asynchronously in the background.
  4. If user navigates back to Home, Search, or Marketplace pages, the source cards immediately reflect the unsaved state.

---

## 10. Contextual Empty & Recovery States

### A. Global Empty State (Zero items saved across all categories):
- **Headline**: *"Nothing saved yet"*
- **Subtitle**: *"Save homes, commercial spaces, PGs or flatmates to find them here later."*
- **Primary CTA**: `[ Explore REHVO → ]` $\rightarrow$ navigates to `/(renter)/home`.

### B. Category-Specific Empty States:
- **Homes**: *"No saved homes yet"* $\rightarrow$ `[ Explore Homes → ]` (`/(renter)/home`).
- **Commercial**: *"No saved commercial spaces yet"* $\rightarrow$ `[ Explore Commercial → ]` (`/(renter)/commercial`).
- **PG & Rooms**: *"No saved PGs or rooms yet"* $\rightarrow$ `[ Explore PGs & Rooms → ]` (`/(renter)/pg-rooms`).
- **Flatmates**: *"No saved flatmates yet"* $\rightarrow$ `[ Find Flatmates → ]` (`/(renter)/flatmates`).

---

## 11. Loading & Error States

1. **Loading State**: Category-matched loading skeletons ([`RehvoSkeleton`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoSkeleton.tsx)).
2. **Error State**: [`RehvoErrorState`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoErrorState.tsx) with a `[ Retry ]` button.

---

## 12. Safe Area & Bottom Navigation Clearance

- `FlatList` container enforces `paddingBottom: Math.max(insets.bottom, 20) + 120` so property cards and actions are never hidden behind the floating bottom navigation dock.

---

## 13. File Architecture & Directory Plan

| File Path | Action | Description |
| :--- | :--- | :--- |
| [`app/(renter)/saved.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/saved.tsx) | **REBUILD** | Master Saved collection container supporting all 4 categories |
| `src/components/saved/SavedTabs.tsx` | **CREATE** | Horizontal category tabs (`All`, `Homes`, `Commercial`, `PG`, `Flatmates`) |
| `src/components/saved/SavedSortModal.tsx` | **REFINE** | Clean sort bottom sheet using `RehvoBottomSheet` |
| `src/components/saved/SavedCard.tsx` | **DEPRECATE / DELETE** | Replaced by canonical `RehvoPropertyCard`, `CommercialPropertyCard`, `PgRoomCard` |
| `src/components/saved/SavedSkeleton.tsx` | **REFINE** | Category-matched skeleton cards |
| `src/components/saved/SavedEmptyState.tsx` | **REFINE** | Category-contextual empty state |

---

## 14. Step-by-Step Implementation Sequence (Once Approved)

### STEP 1: Engineer `SavedTabs.tsx`
- Build the 5-category horizontal tab bar with active underline and live count badges.

### STEP 2: Refine `SavedSortModal.tsx`
- Ensure sort modal adheres to REHVO modal standards (`RehvoBottomSheet`).

### STEP 3: Refine `SavedEmptyState.tsx`
- Update empty state to provide contextual routing based on selected category.

### STEP 4: Rebuild `app/(renter)/saved.tsx`
- Connect unified multi-category saved query, optimistic unsave handling, and dynamic card rendering.

### STEP 5: Delete Deprecated `SavedCard.tsx`
- Clean up unused legacy card code.

### STEP 6: Execute Automated Verification & QA Gates
- Run `npx tsc --noEmit` $\rightarrow$ 0 errors.
- Run Metro Android Export Bundle $\rightarrow$ 0 errors.
- Run 3-App Architecture Boundary Scanner $\rightarrow$ 0 violations.
- Verify `web/` and `admin/` 100% frozen.

---

## 15. Runtime Verification & Test Matrix

| Test Case | Interaction Flow | Expected Outcome |
| :--- | :--- | :--- |
| **TEST 1: Multi-Category Saved Feed** | Save 1 Home, 1 Commercial, 1 PG, 1 Flatmate $\rightarrow$ Open Saved | All 4 items appear in `All` tab; count badges reflect exact tallies |
| **TEST 2: Category Filtering** | Switch to `Commercial` $\rightarrow$ `PG` $\rightarrow$ `Flatmates` | Feed filters immediately; category-specific card renders correctly |
| **TEST 3: Remove from Saved** | Tap heart icon on Saved card | Item vanishes immediately with toast; unsaved state persists to backend |
| **TEST 4: Empty Category State** | Select category with 0 items | Contextual empty state appears with dedicated discovery button |
| **TEST 5: Detail Navigation & Back** | Tap saved item $\rightarrow$ Open details $\rightarrow$ Tap Back | Returns directly to Saved page with scroll position preserved |

---

## 16. Strict Boundary & Code Freeze Confirmation

```
BOUNDARY VERIFICATION:
- web/   ──► 0 modifications (100% frozen)
- admin/ ──► 0 modifications (100% frozen)
- Mobile ──► Strict isolation in app/(renter)/saved.tsx and src/components/saved/
```

---

## 17. Approval Request

This plan establishes a personal, clean, category-aware Saved Collection experience for REHVO Mobile.

**No code has been modified in this planning phase.** Implementation will begin only upon your explicit approval.
