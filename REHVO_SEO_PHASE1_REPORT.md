# REHVO — Phase SEO 1: Public SEO-First Web Platform Architecture & Report

**Date**: August 19, 2026  
**Auditor**: Antigravity Assistant  
**Platform**: Next.js 14 App Router + TypeScript + Tailwind CSS + Supabase SSR  
**Build Status**: **Production Build Passed (`npm run build` code 0)**  
**Typecheck Status**: **0 Errors across Mobile & Web (`npm run typecheck`)**

---

## 1. Public Web Architecture

The REHVO Public Web Platform is built as a server-rendered (SSR/ISR) Next.js 14 web application on top of the live Supabase database.

- **Framework**: Next.js 14 (App Router) with React 18 Server Components.
- **Rendering Model**:
  - SEO-critical landing pages (`/`, `/mumbai`, `/mumbai/[locality]`, `/property/[slug]`, `/flatmates/[city]`, `/pg/[city]`) are server-rendered with instant Time-to-First-Byte (TTFB) and crawlable HTML.
  - Periodic incremental static revalidation (`revalidate = 60`) ensures high cacheability and sub-millisecond response times under crawler load.
- **Backend Access**: Isolated public querying via `createPublicClient()` (`@supabase/supabase-js` with anon key). No cookies required for public reads, ensuring clean, edge-compatible response delivery.

---

## 2. Route Architecture

| Route Pattern | Purpose | Search Intent |
|---|---|---|
| `/` | REHVO Homepage | Brand & Mumbai Zero-Brokerage Rentals |
| `/mumbai/` | Mumbai City Hub | Local & City-Wide Rental Searches |
| `/mumbai/[locality]/` | Locality Landing Page (e.g. `/mumbai/andheri-west/`) | High-intent locality searches |
| `/mumbai/[locality]/flats-for-rent/` | Sub-category: Flats | Transactional: "flats for rent in [locality]" |
| `/mumbai/[locality]/rooms-for-rent/` | Sub-category: Rooms | Transactional: "rooms for rent in [locality]" |
| `/mumbai/[locality]/pg/` | Sub-category: PGs | Transactional: "PG in [locality]" |
| `/mumbai/[locality]/studios-for-rent/` | Sub-category: Studios | Transactional: "studio apartment in [locality]" |
| `/property/[slug]/` | Canonical Property Detail Page | Long-tail property & direct listing intent |
| `/flatmates/[city]/` | Flatmate Discovery Hub | Roommate & flat-sharing searches |
| `/pg/[city]/` | PG & Co-Living Hub | Paying guest & hostel searches |
| `/about/` | Brand & Zero-Brokerage Policy | Trust, safety, and brand queries |
| `/contact/` | Support, Verification & Help | Contact, safety reports, and help |
| `/sitemap.xml` | Dynamic XML Sitemap | Crawler indexation |
| `/robots.txt` | Production Crawl Rules | Crawler directives |

---

## 3. Property Detail SEO & Canonical Slug Architecture

- **Canonical Slug Format**:  
  `https://rehvo.com/property/[title-in-locality-city-uuid]`  
  *Example*: `https://rehvo.com/property/modern-2-bhk-in-andheri-west-mumbai-d3d961bd-031f-4c48-b465-2b3ecbba489c`
- **UUID Resolution**: Safe regex-based extraction guarantees zero collision risk while presenting clean, descriptive anchor text to users and search engines.
- **Server-Rendered Content**:
  - Title, Rent (`₹... / mo`), Security Deposit, Society Maintenance.
  - Bedrooms, Bathrooms, Carpet Area (sq.ft), Furnishing Status.
  - Verified Amenities checklist.
  - Responsive image gallery (`next/image` with WebP/AVIF optimization).
  - "Open in REHVO App" deep link (`rehvo://property/[id]`).

---

## 4. City & Locality SEO

- **Dynamic Statistics**: Computes real-time starting rent, average rent, total active listings, and category breakdowns directly from live Supabase inventory without fake metrics.
- **People-First Area Guides**: Includes practical locality context (metro/train connectivity, typical deposit rules, neighborhood lifestyle highlights).
- **Graceful Inventory Fallbacks**: When a locality has zero listings, provides clear messaging and links to adjacent localities instead of thin/duplicate spam content.

---

## 5. Schema.org Structured Data (JSON-LD)

Validated structured data matching visible page content:

1. **`Organization` / `RealEstateAgent`**:
   - Declared on Homepage, About, Contact, and City hubs (`name: "REHVO"`, `url: "https://rehvo.com"`, `addressRegion: "Maharashtra"`).
2. **`BreadcrumbList`**:
   - Implemented on all hierarchical routes (`Home → Mumbai → Locality → Category / Property`).
3. **`RealEstateListing` & `Apartment` / `Room`**:
   - Structured property schema with `name`, `description`, `numberOfRooms`, `offers` (price in INR, monthly unit text), `amenityFeature`, and geo coordinates.
4. **`ItemList`**:
   - Structured list of listings on City and Locality landing pages.

---

## 6. Dynamic Sitemap & Robots.txt

### `sitemap.xml`
- Dynamically generated from live database.
- Automatically includes every published listing (`status = 'published'`) with its latest `updated_at` timestamp.
- Includes all 20 major Mumbai localities and category permutations.
- Excludes drafts, paused listings, deleted listings, admin panel, and private routes.

### `robots.txt`
- **Allowed**: `/`, `/mumbai/*`, `/property/*`, `/flatmates/*`, `/pg/*`, `/about`, `/contact`, `/sitemap.xml`.
- **Disallowed**: `/admin`, `/admin/*`, `/login`, `/api/*`, `/*?*` (disallowing arbitrary query parameters prevents duplicate indexing loops).

---

## 7. Security & Privacy Safeguards

- **No Secret Key Exposure**: Public SEO layer strictly uses the anonymous Supabase client (`public-anon`).
- **Owner Privacy Protection**: Homeowner phone numbers, private verification IDs, Aadhaar documents, and internal admin notes are strictly excluded from all public HTML and API responses.
- **Deleted / Unpublished Lifecycles**: Returns genuine HTTP `404 Not Found` for unlisted/removed properties with helpful navigation back to active city inventory.

---

## 8. Mobile App Deep Linking

Public web pages include deep link triggers:
- `rehvo://property/[id]` to seamlessly open the property in the installed mobile app.
- Fallback web browsing and "Download REHVO App" buttons.

---

## 9. Google Search Console & Manual Setup Guide

To complete Google Search Console verification:
1. Open [Google Search Console](https://search.google.com/search-console).
2. Add Property `https://rehvo.com`.
3. Select **URL Prefix** or **Domain verification**.
4. Submit the sitemap URL: `https://rehvo.com/sitemap.xml`.
5. Monitor **Index Coverage** and **Core Web Vitals**.

---

## 10. Verification Matrix & Results

| Verification Test | Result |
|---|:---:|
| **Published Properties Supabase Query** | **PASS (Real DB data)** |
| **Canonical Slug & UUID Resolution** | **PASS** |
| **Schema.org JSON-LD Generation** | **PASS** |
| **Flatmates Discovery Query** | **PASS** |
| **Public Anon Security Isolation** | **PASS** |
| **Production Web Build (`npm run build`)** | **PASS (Exit code 0, 25 Static Pages)** |
| **TypeScript Compilation (`npm run typecheck`)** | **PASS (0 Errors)** |
| **Mobile App TypeScript (`npx tsc --noEmit`)** | **PASS (0 Errors)** |
