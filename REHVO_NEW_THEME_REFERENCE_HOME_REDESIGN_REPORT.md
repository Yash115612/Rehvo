# REHVO Expo Mobile App — New Master Design System & Reference Home Redesign Report

---

## 1. Reference Analysis & Master Design Direction

The **REHVO Expo Mobile App** has been transformed to embody the **neutral luxury, minimal, spacious, image-first design language** established by the master reference design.

### Defining Visual Characteristics
- **Background**: Soft warm off-white canvas (`#FAF8F5`).
- **Surfaces**: Clean pure white (`#FFFFFF`) with whisper-thin borders (`#EDEBF0`) and soft ambient shadows.
- **Primary Typography**: Deep charcoal / near-black (`#171522`) for strong headings and prices.
- **Secondary Typography**: Soft cool gray (`#5C5866`) and muted text (`#8E8A99`).
- **Accent Restraint**: Removed the loud orange-heavy treatment across the Home. Accents are now used with extreme restraint (active category underline, heart save toggle, select micro-badges).
- **Navigation**: Floating sculpted white capsule with dark active indicator and clean center `+` button.

---

## 2. Master Mobile Theme Tokens (`src/theme/colors.ts`)

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

## 3. Information Architecture & Section Breakdown

```
┌────────────────────────────────────────────────────────┐
│ 01. HEADER               → Avatar, Greeting, Location & 🔔
│ 02. SEARCH & FILTER      → [ 🔍 Search... ] [ 🎛️ ]      │
│ 03. CATEGORIES           → 🏠 Homes  🏢 Comm  🛏️ PG  👥 Fm│
│ 04. RECOMMEND FOR YOU    → Primary Snapping Carousel   │
│ 05. POPULAR NEARBY       → Secondary Snapping Carousel │
│ 06. PROMOTIONS / SLIDER  → 5s Auto-Sliding Cards       │
│ 07. RENT / RESIDENTIAL   → Find Your Next Home         │
│ 08. COMMERCIAL           → Commercial Spaces           │
│ 09. PG & ROOMS           → Curated Stays               │
│ 10. FLATMATES            → Social Roommate Profiles    │
│ 11. FEATURED PROPERTY    → Editorial Showcase          │
│ 12. WHERE REHVO IS LIVE  → Destination Cities          │
│ 13. EXPLORE REHVO        → Product Category Tiles      │
│ 14. POPULAR PROPERTIES   → Trending Residences         │
│ 15. WHY REHVO?           → 2x2 Trust Strip             │
│ 16. HOST CTA             → Have a Property to Rent?    │
│ 17. FLATMATE CTA         → Looking for a Flatmate?     │
│ 18. BOTTOM NAVIGATION    → Floating Capsule (Fixed)    │
└────────────────────────────────────────────────────────┘
```

---

## 4. Section Details & Aesthetics

1. **Header ([`HomeTopHeader.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeTopHeader.tsx))**:
   - Left: User Avatar + *"Good evening, Yash"* (bold dark) + *"What are you looking for?"* (muted gray).
   - Right: Compact location pill `[📍 Mumbai]` + circular notification button with unread dot.

2. **Search ([`HomeSearchBar.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeSearchBar.tsx))**:
   - Large white rounded search pill (52px height, 26px radius, dark search icon, muted placeholder) + separate rounded filter button `[ 🎛️ ]`.

3. **Categories ([`HomeCategoryShortcuts.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeCategoryShortcuts.tsx))**:
   - Minimal line icons (*Homes*, *Commercial*, *PG & Rooms*, *Flatmates*). Active state uses dark icon and dark horizontal underline indicator. Inactive uses muted gray.

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
   - *"PG & Rooms"* • *"PGs, private rooms and shared stays."*

10. **Flatmates ([`HomeFlatmatesSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeFlatmatesSection.tsx))**:
    - Social portrait roommate cards with photo, name, locality, budget, and dual CTAs.

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

## 5. Verification & Quality Assurance

| Verification Item | Command | Result |
| :--- | :--- | :--- |
| **Mobile TypeScript Compilation** | `npx tsc --noEmit` in root | **0 errors (Exit code 0)** |
| **3-App Architecture Boundary Audit** | `python3 scripts/audit_architecture_separation.py` | **0 violations (Exit code 0)** |
| **Public Website Isolation** | `web/` verified untouched | **PASS (FROZEN)** |
| **Admin Panel Isolation** | `admin/` verified untouched | **PASS (FROZEN)** |
