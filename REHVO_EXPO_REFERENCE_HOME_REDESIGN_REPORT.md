# REHVO Expo Mobile App — Reference-Driven Home Screen Redesign Report

---

## 1. Reference Analysis & Executive Summary

The **REHVO Expo Mobile Home Screen** has been redesigned following the **clean, minimal, premium, image-first mobile architecture** demonstrated in the reference design.

Instead of a long marketing landing page or admin dashboard, the new Home focuses squarely on **focused marketplace discovery**:
- Clean personal welcome header with avatar, greeting, and notification
- Large rounded search pill with dedicated filter button
- Elegant category shortcuts with minimal icons and active underline indicators
- Dominant "Recommend for You" horizontal snapping property carousel with peek
- Contextual "Popular Nearby" secondary property carousel
- Floating sculpted bottom navigation with primary central creation action

---

## 2. Information Architecture & Hierarchy

```
┌────────────────────────────────────────────────────────┐
│ [Avatar]   Good evening, Yash             [📍 Mumbai]  │
│            What are you looking for?      [🔔 (dot)]   │
│                                                        │
│ [ 🔍 Search locality, property or area      ]  [ 🎛️ ] │
│                                                        │
│    🏠            🏢           🛏️           👥        │
│   Homes      Commercial    PG & Rooms    Flatmates     │
│   ━━━━━                                                │
│                                                        │
│ Recommend for You                                  (→) │
│ ┌────────────────────────────────────────────────────┐ │
│ │ ┌────────────────────────────────────────────────┐ │ │
│ │ │ [0% BROKERAGE]                      [♡ Save]   │ │ │
│ │ │                                                │ │ │
│ │ │             HIGH-RES PHOTOGRAPHY               │ │ │
│ │ └────────────────────────────────────────────────┘ │ │
│ │ Modern 2 BHK Sea View                              │ │
│ │ 📍 Andheri West                                    │ │
│ │ 2 BHK · 2 Bath · 850 sq ft                         │ │
│ │ ₹32,000 / month                 [View details (→)] │ │
│ └────────────────────────────────────────────────────┘ │
│       [next card peeking →]                            │
│                                                        │
│ [Optional: Sponsored / Featured Spotlight Card]        │
│                                                        │
│ Popular Nearby                                     (→) │
│ ┌──────────────────────┐ ┌───────────────────────────┐ │
│ │ [Photo]              │ │ [Photo]                   │ │
│ │ Bandra West · 2 BHK  │ │ Powai · 1 BHK             │ │
│ │ ₹48,000 / mo     (→) │ │ ₹24,000 / mo          (→) │ │
│ └──────────────────────┘ └───────────────────────────┘ │
│                                                        │
│ ────────────────────────────────────────────────────── │
│ [ 🏠 Home    🔍 Search    (+) List    ♡ Saved    👤 Profile ] │
└────────────────────────────────────────────────────────┘
```

---

## 3. Section-by-Section Details

### A. Top Header ([`HomeTopHeader.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeTopHeader.tsx))
- **Personalized Greeting**: Dynamic time-aware greeting (*"Good morning"*, *"Good afternoon"*, *"Good evening"* + user's first name).
- **Sub-greeting**: *"What are you looking for?"* in refined muted typography.
- **Avatar**: 44px circular avatar with subtle white border and soft drop shadow.
- **Location Tag**: Compact `📍 Mumbai` badge. Tap opens the neighbourhood picker modal.
- **Notification Action**: 40px circular button with unread indicator dot.

### B. Search & Filter Bar ([`HomeSearchBar.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeSearchBar.tsx))
- **Search Pill**: 50px high white rounded capsule with search icon and placeholder *"Search locality, property or area"*.
- **Filter Button**: 50px rounded square touch target with sliders icon `🎛️` to quickly open filters.

### C. Category Shortcuts ([`HomeCategoryShortcuts.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeCategoryShortcuts.tsx))
- **Categories**: `Homes`, `Commercial`, `PG & Rooms`, `Flatmates`.
- **Styling**: Minimal clean icon inside 44px circular container, short label, and a smooth bottom indicator underline (`#FF5533`) for the active tab.

### D. Recommend for You ([`HomeRecommendedCarousel.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeRecommendedCarousel.tsx))
- **Layout**: Large, image-first rounded property cards (`74vw` width with peek).
- **Elements**: High-res cover image, floating `0% BROKERAGE` badge, heart save button, property title, locality (`📍 Andheri West`), specs row (`2 BHK · 850 sq ft`), price (`₹32,000 / month`), and sleek "View details" capsule with circular arrow.

### E. Spotlight / In-Between Placement ([`HomeSpotlightCard.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeSpotlightCard.tsx))
- **Purpose**: Minimal between-section placement for real verified or sponsored properties without cluttering the top of the screen.

### F. Popular Nearby ([`HomePopularNearby.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomePopularNearby.tsx))
- **Layout**: Secondary horizontal snapping carousel with location-aware listings.
- **Elements**: Image, 0% brokerage badge, heart save, title, locality, price, and circular arrow.

### G. Floating Bottom Navigation ([`FloatingBottomNav.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/navigation/FloatingBottomNav.tsx))
- **Structure**: 5 slots: `Home`, `Search`, `+ (List Property)` (primary circular action in `#FF5533`), `Saved`, and `Profile`.
- **Design**: Floating white capsule, safe-area aware, with subtle drop shadow.

---

## 4. Brand Design Tokens Applied

- **Global Canvas**: Warm linen `#FAF8F5`
- **Surfaces**: Pure white `#FFFFFF`
- **Primary Brand Accent**: Vibrant Coral `#FF5533`
- **Typography / Text**: Dark `#171522`
- **Secondary / Muted Text**: `#5C5866` & `#8E8A99`
- **Borders**: `#E8E5EC` & `#F0EDE8`
- **Semantic Badges**: Emerald Green `#10B981` (Verification) & Amber `#F59E0B` (Sponsored)

---

## 5. Verification & Typecheck

| Check | Tool / Command | Result |
| :--- | :--- | :--- |
| **Mobile App Typecheck** | `npx tsc --noEmit` in root | **0 errors (Exit code 0)** |
| **3-App Architecture Boundary Audit** | `python3 scripts/audit_architecture_separation.py` | **0 violations (Exit code 0)** |
| **Public Website Isolation** | `web/` verified untouched | **PASS (FROZEN)** |
| **Admin Panel Isolation** | `admin/` verified untouched | **PASS (FROZEN)** |
