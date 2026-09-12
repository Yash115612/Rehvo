# REHVO Expo Mobile App — Phase 3 Actual Implementation Report: Marketplace Shell & Home Rebuild

---

## 1. Actual Runtime Route & Execution Hierarchy

```
CANONICAL RUNTIME RESOLUTION:
app/index.tsx (Entry Point)
  │
  ├── [If Not Authenticated] ──► app/(auth)/onboarding.tsx or app/(auth)/login.tsx
  │     └─ On Auth Success ────► router.replace('/(renter)/home')
  │
  └── [If Authenticated Renter] ─► app/(renter)/_layout.tsx (Persistent Shell Layout)
        │
        ├── Hidden Native Tabs ─► <Tabs screenOptions={{ tabBarStyle: { display: 'none' } }}>
        │     │
        │     └── Active Tab ───► app/(renter)/home.tsx
        │           │
        │           └── HomeRoute ──► <MarketplaceShell initialCategory="homes" />
        │
        └── Floating Bottom Nav ─► <FloatingBottomNav activeTab={activeTab} />
```

- **Actual Home Root**: [`src/components/marketplace/MarketplaceShell.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/marketplace/MarketplaceShell.tsx) mounted by [`app/(renter)/home.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/home.tsx).
- **Persistent Overlay**: [`FloatingBottomNav.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/navigation/FloatingBottomNav.tsx) rendered in [`app/(renter)/_layout.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/_layout.tsx) with 120px scroll padding clearance.

---

## 2. Header, Location & Search Implementation

### A. Top Header ([`HomeTopHeader.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeTopHeader.tsx))
- **Left**: User avatar using [`RehvoImage`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoImage.tsx) with skeleton fallback $\rightarrow$ time-aware greeting (*"Good morning/afternoon/evening, {FirstName}"*) $\rightarrow$ subtitle (*"What are you looking for?"*).
- **Right**: Location pill (*"📍 Mumbai"* + Chevron) $\rightarrow$ Notification bell with live unread counter badge.

### B. Location Bottom Sheet Modal
- Tapping the location pill opens a centered modal with 10 real Mumbai Metropolitan localities (All Mumbai, Bandra West, Andheri West, Powai, BKC, Lower Parel, Worli, Juhu, Thane, Navi Mumbai). Zero fabricated GPS.

### C. Search Dock ([`HomeSearchBar.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeSearchBar.tsx))
- 58px search pill with luxury neutral styling (`#FFFFFF` surface, `#E9E6E0` border, `#77747C` muted text) and a dedicated filter button.
- **Adaptive Placeholders**:
  - `homes`: *"Search locality, property or area"*
  - `commercial`: *"Search office, shop, showroom, area..."*
  - `pg`: *"Search PG, room, co-living, area..."*
  - `flatmates`: *"Search flatmates, occupation, locality..."*

---

## 3. Category Switcher & In-Place Switching

### A. Category Switcher ([`HomeCategoryShortcuts.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeCategoryShortcuts.tsx))
- Exactly 4 categories: `Homes`, `Commercial`, `PG & Rooms`, `Flatmates`.
- Minimal line icons, muted text when inactive, dark `#19181C` text when active, with an accent underline indicator. No heavy colored pills.

### B. In-Place Switching Mechanism ([`MarketplaceShell.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/marketplace/MarketplaceShell.tsx))
- State: `activeCategory: 'homes' | 'commercial' | 'pg' | 'flatmates'`.
- 320ms transition: 120ms fade-out/slide-up ($-6$) $\rightarrow$ category state change $\rightarrow$ 200ms fade-in/slide-down ($8 \rightarrow 0$) using React Native Native Driver.
- Zero full-page reloads, zero route jumps (`router.push` / `router.replace` are NOT called for category changes).

---

## 4. The 9 REHVO Home Sections ([`HomeMarketplaceContent.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeMarketplaceContent.tsx))

| Section Order | Section Name | Underlying Component | Primitive Used & Visual Role |
| :---: | :--- | :--- | :--- |
| **01** | **Featured / Sponsored** | [`HomePromotionalCarousel.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomePromotionalCarousel.tsx) | [`RehvoFeaturedCard`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoFeaturedCard.tsx): Cinematic wide cards with 5s autoplay, manual swipe, pagination dots. |
| **02** | **Recommend for You** | [`HomeRecommendedCarousel.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeRecommendedCarousel.tsx) | [`RehvoPropertyCard`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoPropertyCard.tsx): 78vw hero cards with next card peeking, live rent prices, verification badges, save heart toggle. |
| **03** | **Popular Nearby** | [`HomePopularNearby.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomePopularNearby.tsx) | [`RehvoCompactPropertyCard`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoCompactPropertyCard.tsx): 52vw location-aware compact horizontal rail. |
| **04** | **Explore REHVO** | [`HomeExploreGrid.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeExploreGrid.tsx) | Asymmetric editorial product discovery: 1 large "Find a Home" tile + 3 supporting tiles ("Commercial", "PG & Rooms", "Flatmates"). |
| **05** | **Where REHVO is Live** | [`HomeCitiesLiveSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeCitiesLiveSection.tsx) | [`RehvoCityCard`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoCityCard.tsx): Destination discovery cards (Mumbai, Thane, Navi Mumbai, South Mumbai). |
| **06** | **Popular Properties** | [`HomePopularPropertiesSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomePopularPropertiesSection.tsx) | [`RehvoCompactPropertyCard`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoCompactPropertyCard.tsx): Dense marketplace inventory rail. |
| **07** | **Why REHVO** | [`HomeWhyRehvo.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeWhyRehvo.tsx) | [`RehvoTrustCard`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoTrustCard.tsx): 2x2 trust guarantee modules (0% Brokerage, Verified Listings, Direct Chat, Easy Visits). |
| **08** | **Have a Property to Rent** | [`HomeHostCTA.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeHostCTA.tsx) | Editorial conversion card with "List Your Property" and "List Commercial Property" actions. |
| **09** | **Create Flatmate Profile** | [`HomeCreateFlatmateCTA.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeCreateFlatmateCTA.tsx) | Social community card with "Create Your Flatmate Profile" and "Browse Flatmates" actions. |

---

## 5. Other Category Modes & Single Shell Architecture

- **Commercial Mode** ([`CommercialMarketplaceContent.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/commercial/CommercialMarketplaceContent.tsx)): Grade-A offices, shops, warehouses, coworking, business hubs. Renders pure content; no duplicate headers or navigation.
- **PG & Rooms Mode** ([`PgMarketplaceContent.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/pg/PgMarketplaceContent.tsx)): Featured PG, managed stays, private/shared rooms, studios. Renders pure content; no duplicate headers or navigation.
- **Flatmates Mode** ([`FlatmateMarketplaceContent.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/flatmates/FlatmateMarketplaceContent.tsx)): Discovery feed, profile cards, lifestyle chips. Renders pure content; no duplicate headers or navigation.

---

## 6. Verification & Quality Assurance Results

| Quality Gate | Command Executed | Result |
| :--- | :--- | :--- |
| **TypeScript Compilation** | `npx tsc --noEmit` in root | **0 errors (Exit code 0)** |
| **Metro Android Export Bundle** | `EXPO_NO_TELEMETRY=1 CI=1 npx expo export -p android --no-bytecode -c` | **Bundled 3,643 modules in 9.4s (0 errors)** |
| **3-App Architecture Boundary Scanner** | `python3 scripts/audit_architecture_separation.py` | **0 violations (Exit code 0)** |
| **Public Website Isolation** | `web/` verified untouched | **PASS (FROZEN)** |
| **Admin Panel Isolation** | `admin/` verified untouched | **PASS (FROZEN)** |
| **Legacy Conflicting Cleanup** | Old unused section files (`HomeResidentialSection.tsx`, etc.) removed | **PASS (0 duplicate files)** |

---

## 7. Confirmation

✅ **Phase 3 (Unified Marketplace Shell & Home Rebuild) is fully implemented and bundled with zero errors.**
