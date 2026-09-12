# REHVO Expo Mobile App — Section Differentiation & Premium Visual Rhythm Report

---

## 1. Section-by-Section Visual Strategy & Personality Map

To eliminate visual monotony and template-like repetition across the REHVO Home screen, every section has been re-architected with its own **distinct composition, card geometry, content density, and interaction style** while sharing the same neutral luxury design tokens:

| Section | Role / Visual Personality | Composition & Geometry | Content Density & Image Treatment |
| :--- | :--- | :--- | :--- |
| **`01. Header & Location`** | Personal & Calm Greeting | Non-carded, directly on `#F7F5F0` canvas. 48px avatar + 20px greeting + 36px white location pill `[📍 Mumbai ▾]` + 44px notification circle. | Minimal metadata, high whitespace, no heavy outer containers. |
| **`02. Search & Filter`** | Dominant Search Gateway | 58px white capsule (29px radius) + 50px separate circular filter button `[ 🎛️ ]`. | Clean placeholder, dark line icons, soft ambient shadow. |
| **`03. Category Switcher`** | In-Place Navigation Switcher | 48px circular white surfaces (*Homes*, *Commercial*, *PG & Rooms*, *Flatmates*), dark active text, 2px `#FF5533` sliding underline. | Minimal line icons, no colored cards or filled pills. |
| **`05. Featured / Sponsored`** | **Cinematic Promotional Hero** | Full-bleed horizontal banner (195px height, 24px radius), dark gradient text overlay, **NO white lower info box**. | Large lifestyle photography, white text overlay, small `FEATURED` glass tag, 5s autoplay with small dots. |
| **`06. Recommend for You`** | **Large Marketplace Property Cards** | 76vw width snapping carousel with next card peeking, 24px radius, large cover image with floating `0% BROKERAGE` badge & heart save, white lower box. | High-detail specs (`2 BHK · 950 sq ft`), price (`₹32,000 / month`), and sleek "View details" capsule with dark circular arrow. |
| **`07. Popular Nearby`** | **Compact Quick-Discovery Cards** | 58vw width horizontal rail, 120px compact image height, 20px radius. | Denser layout, quick locality tag, price per month, instant dark circle arrow button. |
| **`08. Explore REHVO`** | **Asymmetric Editorial Product Grid** | **1 Large Hero Tile** (*Find a Home*, 155px height) + **3 Smaller Tiles** (*Commercial*, *PG & Rooms*, *Flatmates*, 110px height). | Image-led, dark glass badges, white text overlay directly on photos, **no white info boxes**. |
| **`09. Where REHVO is Live`** | **Geographic Destination Discovery** | **1 Large Destination Card** (*Mumbai*, 155px height with `LIVE NOW` badge, sub-hubs, and "Explore Mumbai →" pill) + **2 Smaller City Tiles** (*Thane*, *Navi Mumbai*). | Destination travel-inspired photography, dark image gradient, white destination typography. Completely distinct from product tiles! |
| **`10. Popular Properties`** | **Dense Marketplace Rail** | 52vw width compact rail, 110px image height, 18px radius. | Fast browsing density: cover image, heart save, title, locality, price, and instant arrow button. |
| **`11. Why REHVO?`** | **Minimal Trust Grid** | Compact 2x2 trust modules with soft-tinted icon containers, dark line icons, bold title, 1-line benefit. **NO images.** | 100% informational & trust-oriented (*0% Brokerage*, *Verified Listings*, *Direct Chat*, *Easy Visits*). |
| **`12. Have a Property to Rent?`** | **Editorial Landlord Conversion Banner** | Architectural interior photo header with `FOR OWNERS & HOSTS` tag + clean white body with strong headline, dark pill CTA (*List Your Property →*), and secondary link. | Conversion-focused landlord acquisition card. |
| **`13. Create Flatmate Profile`** | **Social Community Lifestyle Banner** | Candid social lifestyle photo header with `FLATMATE COMMUNITY` tag + clean white body with "Looking for the right flatmate?", dark pill CTA (*Create Your Flatmate Profile →*), and secondary link. | Social & community matching focus. |
| **`14. Floating Bottom Navigation`** | **Floating App Navigation** | 64px floating white capsule with dark active indicator bubble, center `+` button in approved REHVO accent (`#FF5533`), and 120px safe area bottom clearance. | Fixed native navigation bar. |

---

## 2. Background Rhythm & Depth

The Home alternates naturally between different visual densities to create vertical rhythm and depth:

```
Canvas (#F7F5F0) ──► Non-carded Header & Search
      │
      ▼
Cinematic Dark Hero ──► Full-bleed image with text overlay (Featured/Sponsored)
      │
      ▼
Marketplace Cards ──► White rounded surface cards with lower info boxes (Recommend)
      │
      ▼
Compact Discovery ──► Denser mini cards (Popular Nearby)
      │
      ▼
Asymmetric Product Grid ──► 1 Large + 3 Small product tiles (Explore REHVO)
      │
      ▼
Geographic Destination Grid ──► Destination cards with sub-hubs (Where REHVO is Live)
      │
      ▼
Dense Marketplace Rail ──► Compact 52vw browsing cards (Popular Properties)
      │
      ▼
Minimal Trust Modules ──► 2x2 clean surface cards with line icons (Why REHVO?)
      │
      ▼
Editorial Host Conversion ──► Architectural photo + white conversion body
      │
      ▼
Social Community Lifestyle ──► Social photo + white conversion body
      │
      ▼
Floating Capsule Nav ──► Fixed white capsule with center (+) button
```

---

## 3. Master Palette Consistency ([`src/theme/colors.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/theme/colors.ts))

- **Canvas (`80%`)**: `#F7F5F0` (warm off-white neutral canvas)
- **Surfaces (`15%`)**: `#FFFFFF` (clean white cards with `#E9E6E0` subtle borders)
- **Typography**: `#19181C` (deep charcoal primary) & `#77747C` (medium neutral gray secondary)
- **Accent (`5%`)**: `#FF5533` (approved REHVO coral accent, used with extreme restraint for active underlines, heart saves, and the center `+` action button)

---

## 4. In-Place Dynamic Category Switching

When switching categories (*Homes*, *Commercial*, *PG & Rooms*, *Flatmates*):
- The top marketplace shell (Header, Location, Search, Category Switcher, Bottom Nav) **remains fixed without screen reloads or navigations**.
- The underline indicator smoothly animates to the selected category.
- The upper dynamic content section performs a **smooth fade & translateY transition (300ms)**.
- Category-specific listings render instantaneously with zero layout shift.

---

## 5. Verification & Quality Assurance

| Verification Item | Command | Result |
| :--- | :--- | :--- |
| **Mobile TypeScript Compilation** | `npx tsc --noEmit` in root | **0 errors (Exit code 0)** |
| **3-App Architecture Boundary Audit** | `python3 scripts/audit_architecture_separation.py` | **0 violations (Exit code 0)** |
| **Public Website Isolation** | `web/` verified untouched | **PASS (FROZEN)** |
| **Admin Panel Isolation** | `admin/` verified untouched | **PASS (FROZEN)** |
