# REHVO Expo Mobile App — Master Home Screen Rebuild & Design Implementation Report

---

## 1. Existing Home Audit & Architecture Boundary

- **Scope & Independence**: All modifications strictly confined to the Expo mobile app (`app/`, `src/`, `assets/`). The public website (`web/`) and admin panel (`admin/`) remain 100% frozen and untouched.
- **Zero Cross-App Violations**: Automated boundary audit confirmed 0 violations across all 3 applications.
- **Business Logic Preserved**: Supabase authentication, database queries, saved listing state, direct in-app chat, and creation flows remain fully intact.

---

## 2. Master Reference Design Analysis & Philosophy

The mobile home screen has been rebuilt from the ground up according to the **master reference design**:
- **Canvas & Surfaces**: Very light warm off-white canvas (`#FAF8F5`) + pure white surfaces (`#FFFFFF`) with whisper-thin borders (`#EDEBF0`) and soft ambient shadows.
- **Typography Hierarchy**: Deep charcoal / near-black (`#171522`) for primary titles, headings, and prices; soft cool gray (`#5C5866`) and muted gray (`#8E8A99`) for secondary copy.
- **Restrained Brand Accent**: Loud orange-heavy blocks removed. REHVO coral accent (`#FF5533`) is reserved exclusively for select micro-interactions (heart saves, small unread dots).
- **Navigation Rhythm**: Floating sculpted white capsule with dark active indicator and clean center `+` button.

---

## 3. Master Theme Tokens (`src/theme/colors.ts`)

```typescript
export const colors = {
  // Canvas & Surfaces
  background: '#FAF8F5',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSecondary: '#F5F3F0',
  surfaceVariant: '#EDEBF0',
  darkContainer: '#171522',
  pureWhite: '#FFFFFF',

  // Typography & Text
  text: '#171522',
  textPrimary: '#171522',
  textSecondary: '#5C5866',
  textMuted: '#8E8A99',
  heading: '#171522',

  // Borders & Dividers
  border: '#EDEBF0',
  borderLight: '#F3F1F5',
  borderFocus: '#171522',
  divider: '#EDEBF0',

  // Icons
  iconDefault: '#8E8A99',
  iconActive: '#171522',
  iconMuted: '#AEAAB8',

  // Restrained Brand Accent
  accent: '#FF5533',
  accentSoft: '#FFF5F0',
  accentBorder: '#FFD9CC',

  // Semantic Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};
```

---

## 4. Single Unified Marketplace Shell & In-Place Category Switching

The REHVO app operates as **ONE UNIFIED MARKETPLACE HOME**:

```
┌────────────────────────────────────────────────────────┐
│ 01. HEADER               → Avatar, Greeting, Location & 🔔
│ 02. SEARCH & FILTER      → [ 🔍 Search... ] [ 🎛️ ]      │
│ 03. CATEGORY SWITCHER    → 🏠 Homes 🏢 Comm 🛏️ PG 👥 Fm 🔑 Rent
│                                                        │
│ ── [DYNAMIC CATEGORY CONTENT (Smooth In-Place Transition)] ──
│ 04. CATEGORY SPOTLIGHT   → Recommend / Commercial / PG / Flatmates
│ 05. POPULAR NEARBY       → Contextual Location Inventory
│                                                        │
│ ── [SHARED MARKETPLACE DISCOVERY] ──────────────────── │
│ 06. FEATURED / SPONSORED → 5s Auto-Sliding Promo Cards │
│ 07. WHERE REHVO IS LIVE  → Active Destination Cities   │
│ 08. EXPLORE REHVO        → Product Discovery Tiles     │
│ 09. POPULAR PROPERTIES   → Trending Residences         │
│ 10. WHY REHVO?           → 2x2 Compact Trust Strip     │
│ 11. HOST CTA             → Have a Property to Rent?    │
│ 12. FLATMATE CTA         → Looking for a Flatmate?     │
│ 13. BOTTOM NAVIGATION    → Floating Capsule (Fixed)    │
└────────────────────────────────────────────────────────┘
```

When switching categories (*Homes*, *Commercial*, *PG & Rooms*, *Flatmates*, *Rent*):
- The top marketplace shell (Header, Location, Search, Category Switcher, Bottom Nav) **remains fixed without screen reloads or navigations**.
- The underline indicator smoothly animates to the active category.
- The dynamic content area smoothly transitions (fade + translateY, 220ms) to display category-specific listings:

| Category | Upper Dynamic Content |
| :--- | :--- |
| **Homes** (Default) | `Recommend for You` (Residential flats & penthouses) + `Popular Nearby` (Location-based nearby homes) |
| **Commercial** | `Commercial Spaces` (Grade-A corporate offices, shops, coworking) + `Nearby Workspaces` |
| **PG & Rooms** | `PG & Rooms` (Managed stays with meals, private rooms, student stays, studios) + `Nearby Stays` |
| **Flatmates** | `Find Your Flatmate` (Social roommate profile cards with photos, budgets, occupations) |
| **Rent** | `Find Your Next Home` (All residential rental listings & studios) + `Nearby Rentals` |

---

## 5. Pixel-Level Component Breakdown

1. **Header ([`HomeTopHeader.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeTopHeader.tsx))**:
   - Left: 48px circular user avatar + *"Good evening, Yash"* (17px bold `#171522`) + *"What are you looking for?"* (12.5px muted `#8E8A99`).
   - Right: 36px high location pill `[📍 Mumbai ▾]` + 44px circular notification button with unread dot.

2. **Search & Filter Bar ([`HomeSearchBar.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeSearchBar.tsx))**:
   - 56px height search capsule with 28px radius, dark line search icon, and muted placeholder + 56px circular filter button `[ 🎛️ ]`.

3. **Category Switcher ([`HomeCategoryShortcuts.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeCategoryShortcuts.tsx))**:
   - 46px circular containers with minimal line icons (*Homes*, *Commercial*, *PG & Rooms*, *Flatmates*, *Rent*) and smooth sliding horizontal underline indicator.

4. **Recommend for You ([`HomeRecommendedCarousel.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeRecommendedCarousel.tsx))**:
   - Large image-first rounded property cards (`74vw` width with next card peeking).
   - High-res cover photo, floating subtle `0% BROKERAGE` badge in dark charcoal/white, heart save button, title, location (`📍 Andheri West`), specs row (`2 BHK · 950 sq ft`), price (`₹32,000 / month`), and sleek "View details" capsule with circular dark arrow.

5. **Popular Nearby ([`HomePopularNearby.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomePopularNearby.tsx))**:
   - Secondary horizontal carousel with location-aware inventory matching the same neutral luxury card style.

6. **Promotions ([`HomePromotionalCarousel.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomePromotionalCarousel.tsx))**:
   - 5-second auto-sliding carousel with pause-on-drag/interaction, pagination indicators, and `FEATURED` / `SPONSORED` labels.

7. **Residential ([`HomeResidentialSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeResidentialSection.tsx))**:
   - *"Find your next home"* • *"Flats, rooms and studios across Mumbai."*

8. **Commercial ([`HomeCommercialSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeCommercialSection.tsx))**:
   - *"Commercial"* • *"Offices, shops and workspaces."*

9. **PG & Rooms ([`HomePgRoomsSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomePgRoomsSection.tsx))**:
   - Curated stay cards for *Managed PGs*, *Private Rooms*, *Shared Student Stays*, and *Studios*.

10. **Flatmates ([`HomeFlatmatesSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeFlatmatesSection.tsx))**:
    - Social roommate cards with photo, name, locality, budget, and dual CTAs.

11. **Featured Property ([`HomeFeaturedStory.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeFeaturedStory.tsx))**:
    - Major editorial property spotlight card with full specs and verified landlord tag.

12. **Where REHVO is Live ([`HomeCitiesLiveSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeCitiesLiveSection.tsx))**:
    - Geographic destination discovery (*Mumbai*, *Thane*, *Navi Mumbai*).

13. **Explore REHVO ([`HomeExploreGrid.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeExploreGrid.tsx))**:
    - Product category discovery tiles.

14. **Popular Properties ([`HomePopularPropertiesSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomePopularPropertiesSection.tsx))**:
    - Trending residences carousel.

15. **Why REHVO ([`HomeWhyRehvo.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeWhyRehvo.tsx))**:
    - Compact 2x2 trust strip (*0% Brokerage*, *Verified Listings*, *Direct Chat*, *Easy Visits*).

16. **Host CTA ([`HomeHostCTA.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeHostCTA.tsx))**:
    - Clean landlord host conversion card with *List Your Property →*.

17. **Flatmate CTA ([`HomeCreateFlatmateCTA.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeCreateFlatmateCTA.tsx))**:
    - Clean social lifestyle conversion card with *Create Your Flatmate Profile →*.

18. **Bottom Navigation ([`FloatingCapsuleNav.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/navigation/FloatingCapsuleNav.tsx))**:
    - Floating white capsule with soft subtle border, soft drop shadow, dark active tab icon, and clean center `+` button.

---

## 6. Verification & Quality Assurance

| Verification Item | Command | Result |
| :--- | :--- | :--- |
| **Mobile TypeScript Compilation** | `npx tsc --noEmit` in root | **0 errors (Exit code 0)** |
| **3-App Architecture Boundary Audit** | `python3 scripts/audit_architecture_separation.py` | **0 violations (Exit code 0)** |
| **Public Website Isolation** | `web/` verified untouched | **PASS (FROZEN)** |
| **Admin Panel Isolation** | `admin/` verified untouched | **PASS (FROZEN)** |
