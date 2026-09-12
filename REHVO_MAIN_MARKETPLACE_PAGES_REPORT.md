# REHVO — Main Marketplace Architecture Report

**Release Status**: Complete & Fully Verified  
**Date**: August 20, 2026  
**Scope**: Complete Web & Mobile Marketplace Information Architecture with Dedicated Discovery Pages (`/rent`, `/commercial`, `/pg-rooms`, `/flatmates`, `/localities`), Shared `PageContainer` Framing, Single-Header/Footer Layout, Dynamic Search Engine Utility, Active Navigation States, Real Supabase Querying, SEO Schemas, and Mobile App Parity.  

---

## 1. Marketplace Top-Level Architecture

The REHVO platform now features clear, dedicated main destinations for each market segment rather than funneling all categories through a generic search filter:

```
REHVO Core Marketplace Architecture
├── / (Home) ────────────── Broad Discovery Hub & Ecosystem Overview
├── /rent ───────────────── Dedicated Residential Rentals Marketplace
├── /commercial ─────────── Dedicated Grade-A Commercial & Workspaces Marketplace
├── /pg-rooms ───────────── Dedicated PG, Co-Living & Private Rooms Marketplace
├── /flatmates ──────────── Dedicated Social Flatmate & Roommate Discovery
├── /localities ─────────── Comprehensive Mumbai Locality Directory
└── /search ─────────────── Dynamic Multi-Category Filter & Results Engine
```

---

## 2. Dedicated Discovery Pages Breakdown

### A. Home (`/`) — Ecosystem Discovery Hub
- **Purpose**: Welcomes users, communicates the breadth of REHVO (*"Rent. Live. Belong."*), and provides fast discovery gateways.
- **Order**:
  1. Floating Global Header with Active State
  2. Hero + Floating Search Bar + Trust Badges (100% Zero Brokerage, Verified Owners)
  3. Quick Explore Locality Tiles (5 major Mumbai hubs with live listing counts)
  4. Featured Residential Homes (1 large dominant card + 2 stacked feature cards)
  5. Category Panels (Flats, Commercial, Rooms, PGs, Flatmates)
  6. Social Flatmates Showcase (4 social profile cards)
  7. Why Choose REHVO (Zero Brokerage, Verified Listings, Direct Owner Chat, Legal Agreements)
  8. Dual Promos (Owner Hosting CTA on Left, Mobile App Download on Right)
  9. Global Footer

### B. Rent (`/rent`) — Residential Rental Marketplace
- **Hero**: *"Find a home you'll love to live in."*
- **Search Dock**: Locality selector, Configuration (1 BHK, 2 BHK, 3 BHK, Studio), Monthly Rent budget tiers, and instant search.
- **Category Tiles**: *1 BHK Flats*, *2 BHK Flats*, *3+ BHK Apartments*, *Studio Apartments*, *Fully Furnished*, *Gated Societies*.
- **Inventory**: Real published residential flats from Supabase with rent, BHK, carpet area, furnishing, and save toggles.
- **Localities**: Rent benchmarks across Bandra, Andheri, Powai, Juhu, Goregaon, Lower Parel, Thane, and Vashi.
- **Owner CTA**: *"Got a flat to rent out in Mumbai? List Your Flat Free."*

### C. Commercial (`/commercial`) — Business Workspaces Marketplace
- **Hero**: *"Commercial spaces that accelerate your business."*
- **Search Dock**: Locality selector, Commercial Type (Office Space, Retail Shop, Showroom, Warehouse, Coworking, Commercial Building), Budget.
- **Categories**: Office Spaces, Retail Outlets, High-Visibility Showrooms, Managed Coworking, Industrial Warehouses, Corporate Campuses.
- **Inventory**: Real published commercial spaces with verified carpet area, washrooms, power backup, and floor specs.
- **Business Hubs**: BKC (₹280/sq ft), Lower Parel (₹190/sq ft), Andheri East (₹110/sq ft), Powai (₹140/sq ft).
- **Owner CTA**: *"List Your Commercial Space."*

### D. PG & Rooms (`/pg-rooms`) — Shared & Budget Stays
- **Hero**: *"Find the right room, PG or co-living space."*
- **Search Dock**: Locality, Accommodation Type (Managed PG, Private Single Room, Shared Twin Room, 1 RK Studio), Monthly Budget.
- **Categories**: *Managed PGs & Co-Living*, *Private Single Rooms*, *Shared Twin Rooms*, *1 RK & Studio Homes*.
- **Inventory**: Real published PG and room listings with meal inclusions, Wi-Fi, housekeeping, and zero deposit indicators.
- **Student & Corporate Hubs**: Powai (IIT / Tech), Andheri East (SEEPZ / MIDC), Vile Parle (NMIMS / Colleges), Malad (Mindspace).
- **Owner CTA**: *"Manage your PG or fill empty rooms fast."*

### E. Flatmates (`/flatmates`) — Social Roommate Discovery
- **Hero**: *"Find someone you’ll actually want to live with."*
- **Search Dock**: Preferred Locality, Room Preference (Private Room, Shared Room, Has Flat / Need Roommate), Max Budget.
- **Social Profile Cards**: Photo, Name, Age, Occupation, Preferred Locality, Budget, and Compatibility match tags.
- **Budget Tiers**: Budget Friendly (<₹15k), Mid-Tier Comfort (₹15k–₹25k), Premium Living (₹25k–₹40k), Luxury Residences (₹40k+).
- **Process Guide**: 3-step guide (*Create Profile*, *Discover & Filter*, *Chat & Meet Up*).
- **Dual CTAs**: *Browse Profiles* & *Create Flatmate Profile*.

### F. Localities (`/localities`) — Neighbourhood Directory
- **Hero**: *"Explore All Mumbai Localities."*
- **Purpose Tabs**: Fast access to *Rental Homes*, *Commercial Hubs*, *PG & Room Hubs*, *Flatmate Hotspots*.
- **Zone Directory**: Categorized by Western Suburbs, South Mumbai, Central Suburbs, Thane, and Navi Mumbai.
- **Locality Cards**: Pincode, highlights, average 1 BHK and 2 BHK rent benchmarks, and deep links to `/mumbai/[locality]`.

### G. Search Engine (`/search`) — Dynamic Filtering Utility
- **Role**: Dedicated utility for faceted filtering, sorting, and pagination.
- **Dynamic Facets**: Automatically switches filter controls and empty states based on selected category (`residential`, `commercial`, `pg`, `flatmates`).

---

## 3. Global Page Framing & Navigation System

- **Shared Frame ([`PageContainer.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/components/layout/PageContainer.tsx))**:
  - Enforces `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` across all pages.
  - Ensures heroes, search forms, card grids, section headings, and CTAs align to the same pixel-perfect container grid.
- **Single Header / Footer Hierarchy ([`layout.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/app/layout.tsx))**:
  - Global `RootLayout` renders `<RehvoHeader />` and `<RehvoFooter />` once.
  - Zero duplicate header/footer renders on any public route.
- **Active Navigation Indicator ([`RehvoHeader.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/components/home/RehvoHeader.tsx))**:
  - Subtly highlights the current section (`Rent`, `Commercial`, `PG & Rooms`, `Flatmates`, `Localities`, `About`) with coral accents and soft background pill based on `usePathname()`.

---

## 4. Mobile Application Parity

- **Dedicated Mobile Routes in `app/(renter)/`**:
  - `home.tsx` $\rightarrow$ Product Discovery Hub
  - `rent.tsx` $\rightarrow$ Dedicated Residential category discovery
  - `commercial.tsx` $\rightarrow$ Dedicated Commercial category discovery
  - `pg.tsx` $\rightarrow$ Dedicated PG & Co-Living category discovery
  - `rooms.tsx` $\rightarrow$ Dedicated Private Rooms category discovery
  - `studios.tsx` $\rightarrow$ Dedicated Studios category discovery
  - `flatmates.tsx` $\rightarrow$ Dedicated Flatmates social discovery
- **Global Back Navigation**: Preserved consistent back-stack navigation without jumping to root home screen.

---

## 5. Verification Matrix & Build Results

| Application | Test Suite / Command | Status | Result |
| :--- | :--- | :---: | :--- |
| **Web App** | `npm run typecheck` (`web/`) | **PASSED** | 0 TypeScript errors |
| **Web App** | `npm run build` (`web/`) | **PASSED** | 34/34 static/dynamic routes compiled |
| **Admin App** | `npm run typecheck` (`admin/`) | **PASSED** | 0 TypeScript errors |
| **Admin App** | `npm run build` (`admin/`) | **PASSED** | 20/20 static routes compiled |
| **Mobile App** | `npx tsc --noEmit` (root) | **PASSED** | 0 TypeScript errors |
| **Live Dev Server** | `GET /` (Home) | **PASSED** | Status 200 OK \| 1 Header \| 1 Footer |
| **Live Dev Server** | `GET /rent` (Rent) | **PASSED** | Status 200 OK \| 1 Header \| 1 Footer |
| **Live Dev Server** | `GET /commercial` (Commercial) | **PASSED** | Status 200 OK \| 1 Header \| 1 Footer |
| **Live Dev Server** | `GET /pg-rooms` (PG & Rooms) | **PASSED** | Status 200 OK \| 1 Header \| 1 Footer |
| **Live Dev Server** | `GET /flatmates` (Flatmates) | **PASSED** | Status 200 OK \| 1 Header \| 1 Footer |
| **Live Dev Server** | `GET /localities` (Localities) | **PASSED** | Status 200 OK \| 1 Header \| 1 Footer |
| **Live Dev Server** | `GET /search` (Search Engine) | **PASSED** | Status 200 OK \| 1 Header \| 1 Footer |
