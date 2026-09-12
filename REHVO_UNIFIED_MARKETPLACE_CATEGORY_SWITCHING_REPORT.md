# REHVO Expo Mobile — Unified Marketplace Category Switching Architecture Report

---

## 1. Executive Summary

The **REHVO Expo Mobile App** has been unified into a single, cohesive **MarketplaceShell** experience across all primary discovery modes:
- **HOMES** (`app/(renter)/home.tsx`, `app/(renter)/rent.tsx`)
- **COMMERCIAL** (`app/(renter)/commercial.tsx`)
- **PG & ROOMS** (`app/(renter)/pg-rooms.tsx`, `app/(renter)/pg.tsx`, `app/(renter)/rooms.tsx`, `app/(renter)/studios.tsx`)
- **FLATMATES** (`app/(renter)/flatmates.tsx`)

The app no longer feels like four disconnected applications. Instead, the persistent outer shell (Header, Location, Search, Category Switcher, Bottom Navigation) remains mounted while only the dynamic marketplace content transitions smoothly in-place with a native 250–320ms crossfade and translateY animation.

---

## 2. Canonical Architecture Map

```
CANONICAL ENTRY ROUTES:
├── app/(renter)/home.tsx ──────► <MarketplaceShell initialCategory="homes" />
├── app/(renter)/commercial.tsx ──► <MarketplaceShell initialCategory="commercial" />
├── app/(renter)/pg-rooms.tsx ───► <MarketplaceShell initialCategory="pg" />
├── app/(renter)/flatmates.tsx ──► <MarketplaceShell initialCategory="flatmates" />
└── app/(renter)/rent.tsx ───────► <MarketplaceShell initialCategory="homes" />
```

### Component Structure:
```
src/components/marketplace/
└── MarketplaceShell.tsx ───────────► Master persistent shell
    ├── HomeTopHeader.tsx ──────────► Persistent User Avatar, Greeting, Location & Notifications
    ├── HomeSearchBar.tsx ──────────► Persistent Category-Adaptive Search Capsule + Filter
    ├── HomeCategoryShortcuts.tsx ──► Persistent Category Switcher (Homes | Commercial | PG | Flatmates)
    └── Dynamic Animated Content Area:
        ├── HomeMarketplaceContent.tsx ───────► Residential & rental discovery
        ├── CommercialMarketplaceContent.tsx ─► Commercial workspaces & retail discovery
        ├── PgMarketplaceContent.tsx ─────────► PG, co-living & shared room discovery
        └── FlatmateMarketplaceContent.tsx ──► Social roommate community discovery
```

---

## 3. Detailed Architectural Breakdown

### 3.1 Persistent Header ([`HomeTopHeader.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeTopHeader.tsx))
- Displays user avatar with link to Profile Hub.
- Time-aware greeting (*"Good morning / afternoon / evening, {Name}"*).
- Interactive location selector pill (`📍 Mumbai ▾`).
- Notification bell with live unread counter badge.
- **Never unmounts or flickers during category switches**.

### 3.2 Persistent Location State
- Selected location is managed globally at the `MarketplaceShell` level.
- Selecting any business hub or residential area (e.g. *Bandra West*, *BKC*, *Andheri*, *Powai*, *Lower Parel*) persists across all four discovery modes without resetting.

### 3.3 Adaptive Search & Filters ([`HomeSearchBar.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeSearchBar.tsx))
The search capsule placeholder dynamically adapts to the active category context:
- **Homes**: *"Search locality, residential flat, area..."*
- **Commercial**: *"Search office, shop, showroom, area..."*
- **PG & Rooms**: *"Search PG, room, co-living, area..."*
- **Flatmates**: *"Search flatmates, occupation, locality..."*
- Direct tap navigates to `app/(renter)/search.tsx` with pre-filled category filters.

### 3.4 Category Switcher ([`HomeCategoryShortcuts.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeCategoryShortcuts.tsx))
- Minimal 48px circle icon containers with active `#F7F5F0` background and `#19181C` border.
- Active state: `#19181C` deep charcoal text + 18px sliding `#FF5533` accent underline.
- Inactive state: `#77747C` muted text with no underline.
- Accessible 44px+ touch targets.

### 3.5 Smooth In-Place Content Transition
- Category switching triggers an in-place `Animated.parallel`:
  - Current content: Opacity $1 \rightarrow 0$, TranslateY $0 \rightarrow -6\text{px}$ (120ms)
  - New content: Opacity $0 \rightarrow 1$, TranslateY $8\text{px} \rightarrow 0$ (200ms)
- **Zero full-page white flashes**.
- **Zero routing stack mutations**.

### 3.6 Category Content Modules
1. **Homes (`HomeMarketplaceContent.tsx`)**:
   - Promotional Hero Carousel, Recommended Residences, Popular Nearby, Explore REHVO, Where REHVO is Live, Popular Properties, Why REHVO, Host CTA, Flatmate CTA.
2. **Commercial (`CommercialMarketplaceContent.tsx`)**:
   - Commercial Hero, Property Type Shortcuts, Featured Commercial Space, Offices for Rent, Shops & Showrooms, Warehouses & Industrial, Coworking & Flex Spaces, Business Hubs, All Commercial Spaces, Why REHVO for Business, List Commercial Property CTA.
3. **PG & Rooms (`PgMarketplaceContent.tsx`)**:
   - PG Hero, Stay Type Shortcuts (PG, Private Room, Shared Room, Studio), Featured PG Stay, Popular Rooms & Stays Carousel, Why REHVO PG, List PG CTA.
4. **Flatmates (`FlatmateMarketplaceContent.tsx`)**:
   - Flatmate Community Feed, Filter Chips, State-aware Profile CTA, Active Member Grid, Lifestyle Preference Tags.

---

## 4. Back Navigation & Deep Linking

- **Category Switching**: Modifies local `activeCategory` state in-place.
- **Drill-down Navigation**:
  - `Commercial Mode` $\rightarrow$ `Property Details [id]` $\rightarrow$ `Back` $\rightarrow$ Returns to **Commercial Mode**.
  - `PG Mode` $\rightarrow$ `Property Details [id]` $\rightarrow$ `Back` $\rightarrow$ Returns to **PG Mode**.
  - `Flatmate Mode` $\rightarrow$ `Flatmate Profile [id]` $\rightarrow$ `Back` $\rightarrow$ Returns to **Flatmate Mode**.
- **Deep Links & Canonical URLs**:
  - Accessing `/(renter)/commercial` directly initializes `activeCategory="commercial"` inside the shared shell.

---

## 5. Verification & Quality Assurance

| Verification Test | Command | Result |
| :--- | :--- | :--- |
| **Mobile TypeScript Compilation** | `npx tsc --noEmit` in root | **0 errors (Exit code 0)** |
| **3-App Architecture Boundary Scanner** | `python3 scripts/audit_architecture_separation.py` | **0 violations (Exit code 0)** |
| **Web & Admin Preservation** | `web/` and `admin/` verified untouched | **PASS (FROZEN)** |
