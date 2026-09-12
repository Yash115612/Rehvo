# REHVO Mobile — 3 Home Sections Visual Redesign Report

**Release Status**: Complete & Fully Verified  
**Date**: August 20, 2026  
**Scope**: Complete visual and editorial redesign of 3 previously generic Home screen sections: (1) Budget & Shared Stays ("Stay your way"), (2) Find Your Flatmate, and (3) Explore Mumbai ("City Spots").

---

## 1. Executive Summary & Design System Alignment

All 3 sections were redesigned to replace generic white cards and text-heavy lists with **image-led, editorial discovery modules**:

- **No Random Multi-Color Boxes**: Unified with the approved REHVO color system (`#171522` dark canvas/text, `#FFFFFF` surface, `#E8E5EC` / `#2D2A3E` hairline borders, `#FAF8F5` warm linen, `#FF5533` coral brand accent).
- **Asymmetrical Editorial Anchors**: Each section now features a dominant, high-impact hero visual paired with 2–3 supporting visual cards.
- **Zero Fake Data**: Removed invented average rent estimates and fake popularity counters. All cards use authentic Supabase listings, active flatmate profiles, and genuine Mumbai locality hubs.

---

## 2. Section-by-Section Redesign

### Section 1: Budget & Shared Stays → "Stay your way" ([`HomePgRoomsSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomePgRoomsSection.tsx))
- **Header**: Eyebrow `CO-LIVING & ROOMS` · Title `Stay your way` · Subtitle `"PGs, private rooms and shared spaces for every budget."`
- **Large Hero Card**:
  - Full-bleed photo of a modern co-living space.
  - `PG & CO-LIVING` badge with dark gradient protection.
  - Title: `Managed Stays & PGs`
  - Subtitle: `Meals, Wi-Fi, housekeeping & zero brokerage`
  - Direct CTA: `Explore PGs →` (`/pg-rooms`)
- **Supporting Visual Cards**:
  - `Private Rooms` (Photo of cozy private room, subtitle *"Single rooms & 1 RKs"*, arrow `→`).
  - `Shared Stays` (Photo of modern studio/dorm, subtitle *"Affordable community living"*, arrow `→`).

---

### Section 2: Find Your Flatmate ([`HomeFlatmatesSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeFlatmatesSection.tsx))
- **Header**: Eyebrow `COMMUNITY` · Title `Find your flatmate` · Subtitle `"Meet people looking for a place like yours."`
- **Large Featured Profile**:
  - High-res portrait photo of the top active flatmate.
  - `VERIFIED ROOMMATE` badge with dark gradient overlay.
  - Name, locality, and occupation (*"Aditi · Andheri West · UI Designer"*).
  - Budget (*"Budget: ₹18,000/mo"*).
  - Save heart toggle + direct tap to flatmate detail (`/flatmate/[id]`).
- **Supporting Profile Visuals**:
  - 2 side-by-side cards with portrait photos, name, locality, and budget.
- **Integrated Actions**:
  - Primary: `Browse all →` (`/flatmates`)
  - Empty state CTA: `Create Profile` (`/flatmate/create`)

---

### Section 3: Explore Mumbai ([`HomeLocalitySpotlight.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeLocalitySpotlight.tsx))
- **Header**: Eyebrow `CITY SPOTS` · Title `Explore Mumbai` · Subtitle `"Find the right neighbourhood for your next move."`
- **Large Hero Locality Card**:
  - Full-bleed cityscape visual of **Andheri West**.
  - `TRENDING NEIGHBOURHOOD` badge.
  - Title: `Andheri West`
  - Subtitle: `Dual metro lines, Lokhandwala cafes & media hubs`
  - Action: `Explore Area →` (`/search?locality=Andheri West`)
- **3 Supporting Visual Locality Cards**:
  - **Bandra West** (*Sea Link & Cafes* photo thumbnail + arrow `→`).
  - **Powai** (*Hiranandani & Tech* photo thumbnail + arrow `→`).
  - **Lower Parel** (*Corporate Towers* photo thumbnail + arrow `→`).
  - Removed all fabricated rent prices for 100% data authenticity.

---

## 3. Visual Grid & Geometry Matrix

```
3 Redesigned Sections Flow
┌─────────────────────────────────────────────────────────────┐
│ Stay your way (PG & Co-Living Hero + 2 Supporting Stays)    │
├─────────────────────────────────────────────────────────────┤
│ Find your flatmate (Large Roommate Profile + 2 Sub Profiles)│
├─────────────────────────────────────────────────────────────┤
│ Explore Mumbai (Andheri West Hero + Bandra, Powai, Parel)   │
└─────────────────────────────────────────────────────────────┘
```

- **Margins & Frame**: Uniform `paddingHorizontal: 16px` with `gap: 8px`.
- **Card Radii**: `18px` for hero cards, `16px` for supporting visual cards.
- **Image Treatment**: `StyleSheet.absoluteFillObject` with dark overlay (`rgba(23, 21, 34, 0.52)`).
- **Motion**: Subtle press scale down (`0.985`) with arrow slide response.

---

## 4. Verification Matrix & Typecheck

| Check / Suite | Command | Status | Result |
| :--- | :--- | :---: | :--- |
| Mobile TypeScript | `npx tsc --noEmit` | **PASSED** | 0 errors |
| Web TypeScript | `npm run typecheck` (`web/`) | **PASSED** | 0 errors |
| Navigation Flow | PG, Flatmates, Localities | **PASSED** | Direct routing to dedicated destinations |
| Image Safety | Fallbacks & URL integrity | **PASSED** | Safe Unsplash + Supabase URLs |
| No Fabricated Data | Average rents & ratings | **PASSED** | Zero fake metrics |
