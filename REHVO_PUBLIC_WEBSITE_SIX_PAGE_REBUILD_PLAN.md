# REHVO Public Website — Six Marketplace Pages Complete Rebuild Plan

**Scope**: Public Web Application (`web/` directory only)  
**Status**: 🟡 **PLANNING — PENDING USER APPROVAL**  
**Target Routes**:  
1. `/rent` — Residential Rental Marketplace  
2. `/commercial` — Commercial Workspaces & Business Inventory  
3. `/pg-rooms` — PG & Co-Living Stays Marketplace  
4. `/flatmates` — Flatmate & Roommate Discovery Platform  
5. `/localities` — Neighbourhood & Geographic Discovery Directory  
6. `/about` — Brand Storytelling & Trust Experience  

---

## 1. Current Architecture & Route Map

| Route | Current Implementation | Data Source | Primary Issue | Target Experience |
|---|---|---|---|---|
| `/rent` | Next.js Server Component + `RentMarketplace` controller | `getPublishedProperties({ category: 'residential' })` | Needs full alignment with the shared 6-page design system | Inventory-first residential marketplace |
| `/commercial` | Static SSR page with form redirecting to `/search` | `getPublishedProperties({ category: 'commercial' })` | Non-reactive form, uses residential card hierarchy, no commercial fit-out filters | Inventory-first commercial workspace marketplace |
| `/pg-rooms` | Static SSR page with form redirecting to `/search` | `getPublishedProperties({ type: 'pg' })` | Missing room/co-living queries, static sort/filters, uses generic property cards | Comfort & lifestyle-focused stay discovery |
| `/flatmates` | Basic SSR page with static search inputs | `getPublishedFlatmates('Mumbai')` | Non-reactive search, static filter tabs, lacks lifestyle filter drawer | People-first social discovery platform |
| `/localities` | Directory page grouping static Mumbai localities | `MUMBAI_LOCALITIES` static map | Lacks interactive locality search, rent benchmark cards, and zone filters | Editorial geographic discovery directory |
| `/about` | Static brand information page | Static content | Under-designed sections, lacks rich editorial hierarchy and interactive trust timeline | High-impact brand storytelling & trust experience |

---

## 2. Shared Global Design System & Token Foundation

All six pages share the unified REHVO luxury design foundation:
- **Canvas Background**: `#F7F5F0`
- **Surface**: `#FFFFFF`
- **Primary Text**: `#19181C`
- **Secondary Text**: `#77747C`
- **Border / Divider**: `#E9E6E0`
- **Master REHVO Accent**: `#FF5533` (Coral strictly for primary actions, active states, price emphasis, and key brand badges)

### Category-Specific Secondary Accent System
Used strictly for subtle badge pills, icon backgrounds, small chips, and micro-accents:

| Page | Secondary Accent | Color Token | Surface Soft Token | Sub-Brand Purpose |
|---|---|---|---|---|
| `/rent` | REHVO Coral | `#FF5533` | `#FFF0ED` | Core residential rental accent |
| `/commercial` | Professional Blue | `#4263EB` | `#EEF2FF` | Architectural workspaces & corporate hubs |
| `/pg-rooms` | Warm Amber | `#D69E2E` | `#FEF9C3` | Co-living, comfort & move-in stays |
| `/flatmates` | Soft Sage Green | `#3C8D68` | `#EBF5F0` | Community, roommates & lifestyle matching |
| `/localities` | Muted Teal | `#4C7A86` | `#EDF6F8` | Neighbourhood discovery & geographic hubs |
| `/about` | Charcoal + Coral | `#19181C` / `#FF5533` | `#F7F5F0` | Editorial brand narrative |

---

## 3. Detailed Page-by-Page Rebuild Plans

---

### Page 1: `/rent` — Residential Rental Marketplace
- **Personality**: Residential, Calm, Practical, Inventory-First, Premium.
- **Purpose**: Help renters find, filter, sort, and inspect verified flats and homes.
- **Target Layout**:
  1. Global Header (Rent active)
  2. Rent Discovery Header (*"Find your next home."* / *"Browse verified homes across Mumbai with zero brokerage."*)
  3. Primary Search Surface (Locality/Society search, BHK selector, Budget selector, Search CTA)
  4. Quick Configuration Rail (`All`, `1 RK`, `1 BHK`, `2 BHK`, `3 BHK`, `4+ BHK`, `Studio`)
  5. Results Summary & Sort Bar (Real count, Active filter tags, Sort selector: Recommended, Newest, Price Low-to-High, Price High-to-Low)
  6. Residential Property Feed (Responsive 3-col grid with 16:10 cover photos, 0% Brokerage badge, specs bar, and save button)
  7. Numbered Pagination / Load More
  8. Property Owner Conversion CTA (*"Have a property to rent? List on REHVO"*)
  9. Global Footer

---

### Page 2: `/commercial` — Commercial Workspaces Marketplace
- **Personality**: Professional, Business-Oriented, Architecture-Driven, Inventory-First.
- **Purpose**: Help businesses and founders find grade-A offices, retail shops, showrooms, warehouses, and coworking spaces.
- **Target Layout**:
  1. Global Header (Commercial active)
  2. Commercial Search Header (*"Find the right space for your business."* with `#4263EB` professional blue accent)
  3. Commercial Type Rail (`All Spaces`, `Office Space`, `Retail Shop`, `Showroom`, `Co-working`, `Warehouse`, `Full Building`)
  4. Results Summary & Sort Bar (Total count, active filter tags, Rate/sq.ft sort, Area sort)
  5. Commercial Inventory Feed with **Dedicated Commercial Card**:
     - Commercial Type badge (`OFFICE`, `RETAIL`, `SHOWROOM`)
     - Monthly Rent + Rate per sq.ft (`₹220/sq.ft`)
     - Carpet Area & Super Built-up Area
     - Fit-out / Furnishing (Bare Shell, Warm Shell, Fully Furnished)
     - Parking, Power Backup, Washrooms specs
     - Save & "View Commercial Space →" CTA
  6. Prime Business Hub Shortcuts (BKC, Andheri East, Lower Parel, Powai, Vashi)
  7. Commercial Landlord Conversion CTA (*"List Your Commercial Property →"*)
  8. Global Footer

---

### Page 3: `/pg-rooms` — PG & Co-Living Stays Marketplace
- **Personality**: Warm, Lifestyle-Oriented, Comfort-Focused, Accommodation-First.
- **Purpose**: Help students and young professionals discover move-in ready managed PGs, private rooms, and shared stays.
- **Target Layout**:
  1. Global Header (PG & Rooms active)
  2. PG & Rooms Search Header (*"Find a PG or room that fits your life."* with `#D69E2E` warm amber accent)
  3. Stay Type Rail (`All Stays`, `Managed PG`, `Private Single Room`, `Twin Sharing`, `Co-Living Hub`, `Studio`)
  4. Results Summary & Sort Bar (Total count, sort by rent/popularity, occupancy filter)
  5. Stay Inventory Feed with **Dedicated Stay Card**:
     - Stay Type pill (`MANAGED PG`, `PRIVATE ROOM`, `CO-LIVING`)
     - Monthly Rent with Deposit & Included Services
     - Occupancy badge (Single, Double, Triple)
     - Included Amenities tags (`Meals Included`, `High-Speed Wi-Fi`, `Housekeeping`)
     - Direct Host Contact & "View Stay Details →" CTA
  6. PG & Co-Living Host Conversion CTA (*"Host Your PG on REHVO →"*)
  7. Global Footer

---

### Page 4: `/flatmates` — Flatmate & Roommate Discovery Platform
- **Personality**: Human, Social, Warm, Profile-First (NOT a property listing grid).
- **Purpose**: Help individuals find compatible people with aligned budgets, routines, and lifestyles to share a home with.
- **Target Layout**:
  1. Global Header (Flatmates active)
  2. Social Search Header (*"Find someone you’ll actually enjoy living with."* with `#3C8D68` sage green accent)
  3. Quick Preference Rail (`All Seekers`, `Private Room Seekers`, `Shared Room Seekers`, `Under ₹20k Budget`, `Working Professionals`, `Students`)
  4. Flatmates Feed with **Dedicated Flatmate Profile Card**:
     - Portrait photograph with verified badge
     - Name, Age, Profession / Industry
     - Budget Range (`₹18,000 - ₹25,000/mo`)
     - Room Preference (Private / Shared) & Preferred Localities
     - Lifestyle Chips (Non-smoker, Vegan/Veg, Early bird, Pet-friendly)
     - Direct In-App Message & "View Profile →" CTAs
  5. "Create Your Flatmate Profile" Conversion Banner
  6. Global Footer

---

### Page 5: `/localities` — Neighbourhood & Geographic Discovery Directory
- **Personality**: Geographic, Editorial, Discovery-Oriented.
- **Purpose**: Help renters research Mumbai neighbourhoods, rent benchmarks, commute connectivity, and vibes before deciding on a home.
- **Target Layout**:
  1. Global Header (Localities active)
  2. Locality Search Header (*"Explore neighbourhoods before you choose a home."* with `#4C7A86` muted teal accent)
  3. Popular Living Regions (Mumbai Metropolitan, Thane Township, Navi Mumbai Corridor)
  4. Featured Neighbourhood Spotlights (Bandra West, Andheri West, Powai, Worli, BKC) with:
     - Average 1BHK / 2BHK Rent Benchmarks
     - Metro & Transit Connectivity
     - Lifestyle & Cafe Hub Ratings
     - Active Listings count with direct link
  5. Zone-Grouped Locality Directory (Western Suburbs, South Mumbai, Central Mumbai, Thane, Navi Mumbai)
  6. Neighbourhood Exploration CTA
  7. Global Footer

---

### Page 6: `/about` — Brand Storytelling & Trust Experience
- **Personality**: Editorial, Brand-Driven, Trust-Building, Human (NOT a marketplace).
- **Purpose**: Educate renters, landlords, and partners on why REHVO exists, how it eliminates brokerage, and the end-to-end user journey.
- **Target Layout**:
  1. Global Header (About active)
  2. Brand Editorial Hero (*"A better way to find where you belong."* with high-res lifestyle photography)
  3. The Marketplace Problem (4 Editorial cards: Ghost Listings, Heavy Broker Commissions, Opaque Pricing, Fragmented Communication)
  4. What REHVO Does (4 Structured Pillar Modules: Residential Homes, Commercial Workspaces, PG & Rooms, Flatmates)
  5. The REHVO 5-Step Journey (Discover $\rightarrow$ Compare $\rightarrow$ Connect $\rightarrow$ Visit $\rightarrow$ Move)
  6. Trust & Transparency Standards (100% Physical Inspection, Zero Hidden Fees, Direct Owner Chat)
  7. Community & Founder Vision
  8. Final Conversion CTA (*"Ready to find your next place? Explore REHVO →"*)
  9. Global Footer

---

## 4. Component Architecture & Directory Structure

```
web/src/
├── app/
│   ├── rent/page.tsx                  # Residential marketplace route
│   ├── commercial/page.tsx            # Commercial marketplace route
│   ├── pg-rooms/page.tsx              # PG & Co-living marketplace route
│   ├── flatmates/page.tsx             # Flatmate discovery route
│   ├── localities/page.tsx            # Locality directory route
│   └── about/page.tsx                 # Brand storytelling route
├── components/
│   ├── rent/                          # Dedicated Rent components
│   │   ├── RentMarketplace.tsx
│   │   ├── RentSearchHeader.tsx
│   │   ├── RentQuickBhkRail.tsx
│   │   ├── RentFilterDrawer.tsx
│   │   ├── RentResultsHeader.tsx
│   │   ├── RentPropertyGrid.tsx
│   │   ├── RentPropertySkeleton.tsx
│   │   ├── RentPagination.tsx
│   │   ├── RentEmptyState.tsx
│   │   ├── RentErrorState.tsx
│   │   └── RentOwnerCta.tsx
│   ├── commercial/                    # Dedicated Commercial components
│   │   ├── CommercialMarketplace.tsx
│   │   ├── CommercialSearchHeader.tsx
│   │   ├── CommercialTypeRail.tsx
│   │   ├── CommercialFilterDrawer.tsx
│   │   ├── CommercialResultsHeader.tsx
│   │   ├── CommercialGrid.tsx
│   │   ├── CommercialCard.tsx
│   │   ├── CommercialSkeleton.tsx
│   │   ├── CommercialHubsSection.tsx
│   │   └── CommercialOwnerCta.tsx
│   ├── pg/                            # Dedicated PG & Rooms components
│   │   ├── PgMarketplace.tsx
│   │   ├── PgSearchHeader.tsx
│   │   ├── PgTypeRail.tsx
│   │   ├── PgFilterDrawer.tsx
│   │   ├── PgResultsHeader.tsx
│   │   ├── PgGrid.tsx
│   │   ├── PgCard.tsx
│   │   ├── PgSkeleton.tsx
│   │   └── PgHostCta.tsx
│   ├── flatmates/                     # Dedicated Flatmates components
│   │   ├── FlatmateMarketplace.tsx
│   │   ├── FlatmateSearchHeader.tsx
│   │   ├── FlatmatePreferenceRail.tsx
│   │   ├── FlatmateFilterDrawer.tsx
│   │   ├── FlatmateResultsHeader.tsx
│   │   ├── FlatmateGrid.tsx
│   │   ├── FlatmateProfileCard.tsx
│   │   ├── FlatmateSkeleton.tsx
│   │   └── FlatmateCreateCta.tsx
│   ├── localities/                    # Dedicated Localities components
│   │   ├── LocalitiesMarketplace.tsx
│   │   ├── LocalitiesSearchHeader.tsx
│   │   ├── LocalitiesFeaturedSpotlight.tsx
│   │   ├── LocalitiesZoneGrid.tsx
│   │   └── LocalityCard.tsx
│   └── about/                         # Dedicated About components
│       ├── AboutHero.tsx
│       ├── AboutPainPoints.tsx
│       ├── AboutWhatWeDo.tsx
│       ├── AboutJourneySteps.tsx
│       ├── AboutTrustStandards.tsx
│       └── AboutFinalCta.tsx
```

---

## 5. Phased Implementation Sequence (Post-Approval)

- **Phase 1**: Rebuild **`/commercial`** with `CommercialMarketplace`, `CommercialCard` (Rate/sq.ft, fit-out specs), `CommercialFilterDrawer`, and business hub shortcuts.
- **Phase 2**: Rebuild **`/pg-rooms`** with `PgMarketplace`, `PgCard` (Stay type, meals/Wi-Fi tags, occupancy), `PgFilterDrawer`, and stay type rails.
- **Phase 3**: Rebuild **`/flatmates`** with `FlatmateMarketplace`, `FlatmateProfileCard` (Portrait photo, budget, lifestyle chips), and social filter drawer.
- **Phase 4**: Rebuild **`/localities`** with `LocalitiesMarketplace`, interactive locality search, rent benchmarks showcase, and zone directory.
- **Phase 5**: Rebuild **`/about`** with editorial brand narrative, pain-point cards, 5-step journey timeline, and trust standards.
- **Phase 6**: Global responsive testing (375px to 1920px), accessibility audit, typecheck, and production build.

---

## 6. Verification Plan

1. **TypeScript Verification**: `npm run web:typecheck` (0 errors).
2. **Production Build**: `npm run web:build` (All 34 routes compiled with zero errors).
3. **Runtime Verification**: Test all 6 routes in localhost browser (`/rent`, `/commercial`, `/pg-rooms`, `/flatmates`, `/localities`, `/about`).
4. **Boundary Check**: Ensure `app/`, `src/`, `assets/`, and `admin/` have zero modifications (`git diff -- app/ src/ admin/`).
