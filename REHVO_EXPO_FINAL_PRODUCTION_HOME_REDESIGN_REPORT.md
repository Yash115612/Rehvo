# REHVO Expo Mobile App — Final Production Home Screen Redesign Report

---

## 1. Master Color System & 80/15/5 Visual Ratio

The entire REHVO Mobile Home screen has been visually unified into a **neutral luxury, editorial design language** governed by centralized tokens in [`src/theme/colors.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/theme/colors.ts):

| Token | Hex Value | Semantic Usage |
| :--- | :--- | :--- |
| **`background`** | `#F7F5F0` | Very light warm off-white canvas (80% visual weight) |
| **`surface`** | `#FFFFFF` | Clean white cards, search pill, and floating nav (15% visual weight) |
| **`surfaceMuted`** | `#F1EFEA` | Soft warm gray containers and icon backgrounds |
| **`textPrimary`** | `#19181C` | Deep charcoal for headings, property titles, prices |
| **`textSecondary`** | `#77747C` | Medium neutral gray for locations, subtitles |
| **`textMuted`** | `#A3A0A7` | Lighter gray for specifications and placeholders |
| **`border`** | `#E9E6E0` | Whisper-thin 1px subtle card borders |
| **`borderStrong`** | `#D1CDC6` | Active input and pressed state borders |
| **`accent`** | `#FF5533` | Approved REHVO brand accent (5% restraint: active category underline, heart saves, center `+` button) |
| **`accentSoft`** | `#FFF5F0` | Subtle coral background for saved items |
| **`accentPressed`** | `#E64522` | Pressed feedback state for primary actions |

---

## 2. Canonical Section Flow

The Home screen executes the exact requested marketplace flow:

```
┌────────────────────────────────────────────────────────┐
│ 01. HEADER               → Avatar, Greeting, Location & 🔔
│ 02. LIVE LOCATION        → Interactive Modal (Choose location)
│ 03. SEARCH & FILTER      → [ 🔍 Search... ] [ 🎛️ ]      │
│ 04. CATEGORY SWITCHER    → 🏠 Homes  🏢 Comm  🛏️ PG  👥 Fm│
│ 05. FEATURED / SPONSORED → 5s Auto-Sliding Promo Cards │
│                                                        │
│ ── [DYNAMIC IN-PLACE CATEGORY CONTENT (Smooth 300ms)] ─│
│ 06. RECOMMEND FOR YOU    → Primary Snapping 76vw Cards │
│ 07. POPULAR NEARBY       → Contextual Nearby Inventory │
│                                                        │
│ ── [SHARED MARKETPLACE DISCOVERY] ──────────────────── │
│ 08. EXPLORE REHVO        → 1 Main + 3 Supporting Tiles │
│ 09. WHERE REHVO IS LIVE  → Destination Cities (Mumbai) │
│ 10. POPULAR PROPERTIES   → Trending Residences         │
│ 11. WHY REHVO?           → 2x2 Compact Trust Strip     │
│ 12. HAVE A PROPERTY TO RENT? → Landlord Host CTA       │
│ 13. CREATE FLATMATE PROFILE  → Flatmate Community CTA  │
│ 14. BOTTOM NAVIGATION    → Floating Capsule (Fixed)    │
└────────────────────────────────────────────────────────┘
```

---

## 3. Dynamic In-Place Category Switching

Selecting any category (*Homes*, *Commercial*, *PG & Rooms*, *Flatmates*):
- Keeps the **top shell completely fixed** (Header, Location, Search, Category Switcher, Bottom Nav).
- Smoothly slides the **2px accent underline**.
- Performs a **crossfade + translateY transition (300ms)** to render category-specific inventory:

| Mode | In-Place Dynamic Content |
| :--- | :--- |
| **Homes** (Default) | `Recommend for You` (Residential flats & penthouses) + `Popular Nearby` (Nearby homes) |
| **Commercial** | `Commercial Spaces` (Grade-A offices, shops, coworking) + `Nearby Workspaces` |
| **PG & Rooms** | `PG & Rooms` (Managed stays with meals, private rooms, student stays) + `Nearby Stays` |
| **Flatmates** | `Find Your Flatmate` (Social roommate profile cards with photo, budget, occupation) |

---

## 4. Section-by-Section Specifications

1. **Header ([`HomeTopHeader.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeTopHeader.tsx))**:
   - Left: 48px avatar + 20px bold greeting (*"Good evening, Yash"*) + 13px muted subtitle (*"What are you looking for?"*).
   - Right: 36px white location pill `[📍 Mumbai ▾]` + 44px notification circle with `#FF5533` unread dot.

2. **Search Bar ([`HomeSearchBar.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeSearchBar.tsx))**:
   - 58px dominant white search capsule with 29px radius, subtle `#E9E6E0` border + 50px circular filter button `[ 🎛️ ]`.

3. **Category Switcher ([`HomeCategoryShortcuts.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeCategoryShortcuts.tsx))**:
   - 48px circular white surfaces with clean line icons (*Homes*, *Commercial*, *PG & Rooms*, *Flatmates*), dark active text, and 2px `#FF5533` underline indicator.

4. **Featured / Sponsored Banner ([`HomePromotionalCarousel.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomePromotionalCarousel.tsx))**:
   - Positioned immediately below category switcher. 185px high banner cards, 5s autoplay with pause-on-touch, pagination dots.

5. **Recommend for You ([`HomeRecommendedCarousel.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeRecommendedCarousel.tsx))**:
   - 76vw width cards with next card peeking, 24px radius, high-res photo, floating `0% BROKERAGE` badge, heart save button, specs `2 BHK · 950 sq ft`, price `₹32,000 / month`, and sleek "View details" capsule.

6. **Popular Nearby ([`HomePopularNearby.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomePopularNearby.tsx))**:
   - Location-aware 62vw secondary carousel.

7. **Explore REHVO ([`HomeExploreGrid.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeExploreGrid.tsx))**:
   - 1 large hero card (*Find a Home*) + 3 supporting product tiles (*Commercial*, *PG & Rooms*, *Flatmates*).

8. **Where REHVO is Live ([`HomeCitiesLiveSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeCitiesLiveSection.tsx))**:
   - Geographic destination discovery (*Mumbai*, *Thane*, *Navi Mumbai*).

9. **Popular Properties ([`HomePopularPropertiesSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomePopularPropertiesSection.tsx))**:
   - Trending residences carousel.

10. **Why REHVO? ([`HomeWhyRehvo.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeWhyRehvo.tsx))**:
    - Compact 2x2 trust strip (*0% Brokerage*, *Verified Listings*, *Direct Chat*, *Easy Visits*).

11. **Have a Property to Rent? ([`HomeHostCTA.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeHostCTA.tsx))**:
    - Landlord host conversion card with *List Your Property →* and *List Commercial Space →*.

12. **Looking for a Flatmate? ([`HomeCreateFlatmateCTA.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeCreateFlatmateCTA.tsx))**:
    - Social flatmate community card with *Create Your Flatmate Profile →* and *Browse Flatmate Feed →*.

13. **Floating Bottom Navigation ([`FloatingCapsuleNav.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/navigation/FloatingCapsuleNav.tsx))**:
    - 64px floating white capsule with dark active indicator bubble, center `+` button in approved REHVO accent (`#FF5533`), and 120px safe area bottom clearance.

---

## 5. Verification & Quality Assurance

| Verification Item | Command | Result |
| :--- | :--- | :--- |
| **Mobile TypeScript Compilation** | `npx tsc --noEmit` in root | **0 errors (Exit code 0)** |
| **3-App Architecture Boundary Audit** | `python3 scripts/audit_architecture_separation.py` | **0 violations (Exit code 0)** |
| **Public Website Isolation** | `web/` verified untouched | **PASS (FROZEN)** |
| **Admin Panel Isolation** | `admin/` verified untouched | **PASS (FROZEN)** |
