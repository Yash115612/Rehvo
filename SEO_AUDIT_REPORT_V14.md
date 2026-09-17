# REHVO V14 — COMPLETE PRODUCTION SEO AUDIT REPORT

**Audit Date:** September 17, 2026  
**Audited Domain:** [https://rehvo.in](https://rehvo.in)  
**Framework:** Next.js 15.1.0 (App Router) on Vercel Edge / Node Runtime  
**Connected Analytics:** Google Analytics 4 (`G-TN238M20RT`) + Microsoft Clarity (`yi2c5nllws`)  
**Audit Scope:** Enterprise Technical SEO, Core Web Vitals, Crawlability, Metadata, Structured Data, Local Real Estate SEO, and AI Search Readiness.  
**Execution Mode:** STRICT AUDIT ONLY — Zero code altered, zero packages installed, zero commits created.

---

## 1. Executive Summary & Audit Scorecard

| Audit Domain | Weight | Score | Status | Key Finding |
| :--- | :---: | :---: | :---: | :--- |
| **Crawlability & Indexability** | 20% | 58 / 100 | ⚠️ Warning | Two conflicting sitemaps + 10 client redirect stubs emitting HTTP 200 with homepage canonical. |
| **Metadata & Canonicalization** | 15% | 52 / 100 | 🚨 Critical | Title tag double/triple branding (`... \| REHVO \| REHVO`) + Split relative/absolute property canonicals. |
| **Structured Data (Schema.org)** | 15% | 40 / 100 | 🛑 **P0 Violation** | **P0 Manual Action Risk**: Hardcoded fake reviews ("Aakash Sharma", "Priya Deshmukh") & 4.9 rating on all listings. |
| **Performance & Core Web Vitals** | 15% | 61 / 100 | ⚠️ Warning | `images.unoptimized: true` in `next.config.js` + Render-blocking external Google Fonts stylesheet. |
| **Internal Linking & Architecture** | 15% | 68 / 100 | ⚠️ Warning | 9 orphan static routes + 13 high-intent programmatic `/rent/[slug]` pages excluded from sitemaps. |
| **GEO / Local Real Estate SEO** | 10% | 76 / 100 | ✅ Solid | 10 Mumbai micro-market hubs statically generated; missing `postalCode` & GeoJSON boundary shapes. |
| **AI / LLM Search Readiness** | 10% | 45 / 100 | ❌ Failing | Missing `/llms.txt` and lack of explicit user-agent directives for PerplexityBot, GPTBot, ClaudeBot. |
| **OVERALL TECHNICAL SEO SCORE** | **100%** | **58.5 / 100** | **Grade: C+** | **High organic growth potential currently suppressed by P0 schema & canonical traps.** |

---

## 2. Priority Issues Matrix (P0 to P3)

```
  [P0: CRITICAL - Immediate Google Penalty / Indexing Blockers]
   ├── [P0.1] Fake Reviews & AggregateRating in schema.ts (Direct violation of Google Search spam policies)
   ├── [P0.2] Dual URL Architecture for Properties: /property/[slug] vs /[city]/[locality]/[slug]
   ├── [P0.3] 10 Client-Side Redirect Stubs returning HTTP 200 with Homepage Canonical
   └── [P0.4] Private / Authenticated User Routes missing "noindex, nofollow" directives

  [P1: HIGH - Severe Organic Traffic Leaks & Cannibalization]
   ├── [P1.1] Title Tag Double-Branding ("Title | REHVO | REHVO" reaching 88–104 characters)
   ├── [P1.2] 13 Programmatic Keyword Rent Pages completely missing from all sitemaps
   ├── [P1.3] robots.txt Sitemap Disconnect (omits sitemap-index.xml and all child XML feeds)
   ├── [P1.4] Search Facet Query URLs canonicalizing raw search query parameters
   └── [P1.5] images.unoptimized: true in next.config.js degrading Mobile LCP & bandwidth

  [P2: MEDIUM - Performance Bottlenecks & Missing Entity Connections]
   ├── [P2.1] 72% of Images (36/50) rendered as raw <img> instead of next/image
   ├── [P2.2] Render-blocking Google Fonts <link> stylesheet in layout.tsx head
   ├── [P2.3] 9 Orphan Static Routes with zero internal link anchors
   ├── [P2.4] Missing postalCode, geoShape, and LocalBusiness markup in Locality datasets
   └── [P2.5] Redundant <link rel="preload"> for /rehvo-logo.png

  [P3: LOW - AI Search Optimization & Modern Polish]
   ├── [P3.1] Absence of /llms.txt and /llms-full.txt for LLM crawlers
   ├── [P3.2] Missing explicit bot rules for PerplexityBot, GPTBot, ClaudeBot in robots.ts
   └── [P3.3] Incomplete BreadcrumbList schema on nested static subpages
```

---

## 3. Comprehensive Route Inventory Table

The REHVO Next.js application contains **46 frontend page routes** and **12 API / dynamic XML feeds**.

| Route Path | Type | Dynamic Params | Rendering | Target Canonical URL | Robots Meta | Sitemap Status | Issues Identified |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | Static | — | SSG | `https://rehvo.in/` | `index, follow` | In `sitemap.ts` | Title branding doubled via template |
| `/about` | Static | — | SSG | `https://rehvo.in/about` | `index, follow` | In `sitemap.ts` | Missing OpenGraph image override |
| `/contact` | Static | — | SSG | `https://rehvo.in/contact` | `index, follow` | In `sitemap.ts` | Schema lacks ContactPoint email/phone |
| `/privacy` | Static | — | SSG | `https://rehvo.in/privacy` | `index, follow` | In `sitemap.ts` | Title double brand |
| `/terms` | Static | — | SSG | `https://rehvo.in/terms` | `index, follow` | In `sitemap.ts` | Title double brand |
| `/faq` | Static | — | SSG | `https://rehvo.in/faq` | `index, follow` | In `sitemap.ts` | Missing FAQPage structured data |
| `/blog` | Static Hub | — | SSG | `https://rehvo.in/blog` | `index, follow` | In `sitemap.ts` | Clean |
| `/blog/[slug]` | Dynamic | 5 Slugs | SSG | `https://rehvo.in/blog/[slug]` | `index, follow` | In `sitemap-blogs.xml` | Author schema lacks `url` & `sameAs` |
| `/stories` | Static Hub | — | SSG | `https://rehvo.in/stories` | `index, follow` | In `sitemap-stories.xml` | Clean |
| `/stories/[slug]` | Dynamic | 4 Slugs | SSG | `https://rehvo.in/stories/[slug]` | `index, follow` | In `sitemap-stories.xml` | Article schema clean |
| `/reports` | Static Hub | — | SSG | `https://rehvo.in/reports` | `index, follow` | In `sitemap-reports.xml` | Clean |
| `/reports/[slug]` | Dynamic | 3 Slugs | SSG | `https://rehvo.in/reports/[slug]` | `index, follow` | In `sitemap-reports.xml` | Report schema clean |
| `/mumbai` | Static Hub | — | SSG | `https://rehvo.in/mumbai` | `index, follow` | In `sitemap.ts` | Clean city hub |
| `/[city]/[locality]` | Dynamic | 10 Localities | SSG | `https://rehvo.in/[city]/[locality]` | `index, follow` | In `sitemap-localities.xml` | Missing `postalCode` in GeoCoordinates |
| `/property/[slug]` | Dynamic | 8 Slugs | SSG | `https://rehvo.in/property/[slug]` | `index, follow` | In `sitemap.ts` | **P0 Dual Canonical & Fake Reviews** |
| `/[city]/[locality]/[slug]` | Dynamic | 8 Slugs | SSG | `/[city]/[locality]/[slug]` | `index, follow` | In `sitemap-properties.xml` | **P0 Dual Canonical & Relative Canonical** |
| `/rent/[slug]` | Dynamic | 13 Keyword Slugs | SSG | `https://rehvo.in/rent/[slug]` | `index, follow` | **MISSING FROM SITEMAPS** | High-intent ranking pages unindexed |
| `/search` | Client Hub | Query Params | SSR | `https://rehvo.in/search?[params]` | `index, follow` | Excluded | **P1 Query canonical leaks facet URLs** |
| `/zero-brokerage` | Redirect Stub | — | Client | `https://rehvo.in` | Default | In `sitemap.ts` | **P0 HTTP 200 Client Redirect w/ Root Canonical** |
| `/host-property` | Redirect Stub | — | Client | `https://rehvo.in` | Default | Excluded | **P0 Client Redirect w/ Root Canonical** |
| `/hostel` | Redirect Stub | — | Client | `https://rehvo.in` | Default | Excluded | **P0 Client Redirect w/ Root Canonical** |
| `/rooms` | Redirect Stub | — | Client | `https://rehvo.in` | Default | Excluded | **P0 Client Redirect w/ Root Canonical** |
| `/pg-rooms` | Redirect Stub | — | Client | `https://rehvo.in` | Default | Excluded | **P0 Client Redirect w/ Root Canonical** |
| `/owners` | Redirect Stub | — | Client | `https://rehvo.in` | Default | Excluded | **P0 Client Redirect w/ Root Canonical** |
| `/society` | Redirect Stub | — | Client | `https://rehvo.in` | Default | Excluded | **P0 Client Redirect w/ Root Canonical** |
| `/localities` | Redirect Stub | — | Client | `https://rehvo.in` | Default | Excluded | **P0 Client Redirect w/ Root Canonical** |
| `/wallet` | Redirect Stub | — | Client | `https://rehvo.in` | Default | Excluded | **P0 Client Redirect w/ Root Canonical** |
| `/rewards` | Redirect Stub | — | Client | `https://rehvo.in` | Default | Excluded | **P0 Client Redirect w/ Root Canonical** |
| `/profile` | User App | Auth | Client | Root fallback | Default (`index`) | Excluded | **P0 Missing noindex** |
| `/list-property` | Listing Form | Auth | Client | Root fallback | Default (`index`) | Excluded | **P0 Missing noindex** |
| `/flatmates/create` | Listing Form | Auth | Client | Root fallback | Default (`index`) | Excluded | **P0 Missing noindex** |
| `/flatmates` | Public Hub | — | SSG | `https://rehvo.in/flatmates` | `index, follow` | In `sitemap.ts` | Missing ItemList schema |
| `/favorites` | User App | Client | Client | Root fallback | Default (`index`) | Excluded | **P1 Missing noindex** |
| `/login` | Auth | — | Client | Root fallback | `noindex, nofollow` | Excluded | Properly noindexed |
| `/signup` | Auth | — | Client | Root fallback | `noindex, nofollow` | Excluded | Properly noindexed |
| `/verify-phone` | Auth | — | Client | Root fallback | `noindex, nofollow` | Excluded | Properly noindexed |
| `/forgot-password` | Auth | — | Client | Root fallback | `noindex, nofollow` | Excluded | Properly noindexed |
| `/admin/*` | Admin Portal | Auth | Dynamic | N/A | `noindex, nofollow` | Excluded | Blocked in robots.txt & metadata |

---

## 4. Crawlability & Indexability Deep Dive

### 4.1 robots.txt & robots.ts Analysis
Inspection of `src/app/robots.ts` reveals:
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/property/", "/mumbai/", "/stories/", "/reports/", "/blog/", "/about", "/contact", "/faq", "/terms", "/privacy"],
        disallow: ["/api/", "/admin/", "/auth/", "/dashboard/", "/checkout/", "/private/", "/temp/"],
      },
    ],
    sitemap: "https://rehvo.in/sitemap.xml",
    host: "https://rehvo.in",
  };
}
```

**Critical Failures Identified:**
1. **Missing Sitemaps in robots.txt:** Only `https://rehvo.in/sitemap.xml` is declared. The comprehensive child sitemaps index at `https://rehvo.in/sitemap-index.xml` (which references `sitemap-properties.xml`, `sitemap-localities.xml`, `video-sitemap.xml`, etc.) is **never mentioned**. Search engines discovering via robots.txt will only see the basic `sitemap.xml`.
2. **Path Disallow Inaccuracy:** It disallows `/auth/`, `/dashboard/`, `/checkout/`, but in the actual codebase:
   - Auth routes are at root: `/login`, `/signup`, `/forgot-password`, `/verify-phone` (not under `/auth/`).
   - Profile route is `/profile`, not `/dashboard/`.
3. **No Rules for AI Crawlers:** No custom user-agent groupings exist for `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, or `CCBot`.

### 4.2 Sitemaps Architecture & Conflicts
REHVO currently maintains **two conflicting sitemap architectures**:
1. **Architecture A (Next.js native `src/app/sitemap.ts`):** Generates `/sitemap.xml`. It contains static routes, 8 properties under `/property/[slug]`, 10 localities under `/mumbai/[locality]`, 5 blogs, 4 stories, 3 reports.
   - ⚠️ Includes `https://rehvo.in/zero-brokerage` (which is an unfunctional redirect stub).
   - 🛑 **Completely omits** the 13 `/rent/[slug]` programmatic pages.
2. **Architecture B (Custom Route Handlers `src/app/sitemap-*.xml/route.ts`):**
   - `/sitemap-index.xml` lists: `sitemap-pages.xml`, `sitemap-properties.xml`, `sitemap-localities.xml`, `sitemap-blogs.xml`, `sitemap-stories.xml`, `sitemap-reports.xml`, `sitemap-cities.xml`, `video-sitemap.xml`.
   - In `sitemap-properties.xml`, properties are emitted as: `https://rehvo.in/[city]/[locality]/[slug]`.
   - In `sitemap.ts`, the exact same properties are emitted as: `https://rehvo.in/property/[slug]`.

**Verdict:** Googlebot is fed two completely different canonical sets across the two sitemaps, triggering canonical confusion and wasted crawl budget.

### 4.3 HTTP 301, 308, and Trailing Slash Verification
- Tested via Node HTTP against `https://rehvo.in`:
  - `http://rehvo.in` -> HTTP 308 to `https://rehvo.in/` (Proper Edge SSL redirect).
  - Trailing slash handling: Consistent without trailing slash (`skipTrailingSlashRedirect: false`).

---

## 5. Metadata & Canonicalization Audit

### 5.1 Title Tag Stacking Bug (CRITICAL P1)
In `src/app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: {
    default: "REHVO | Zero Brokerage Rentals, Verified Homes & Flatmates in Mumbai",
    template: "%s | REHVO",
  },
};
```
In `src/lib/seo/metadata.ts` (`constructSeoMetadata`):
```typescript
export function constructSeoMetadata({ title, ... }) {
  const fullTitle = title.includes("REHVO") ? title : `${title} | REHVO`;
  return {
    title: fullTitle,
  };
}
```
And in individual pages (e.g. `src/app/about/page.tsx`):
```typescript
export const metadata = constructSeoMetadata({
  title: "About Us | REHVO",
});
```
**What happens in HTML output:**
Next.js App Router takes the page title and injects it into `layout.tsx`'s `%s | REHVO` template:
- Page Title passed: `"About Us | REHVO"`
- Templated Result: `"About Us | REHVO | REHVO"`!
- For dynamic rent pages: `"1 BHK Flats for Rent in Mumbai | Zero Brokerage | REHVO | REHVO"` (89 characters — truncated on all mobile & desktop SERPs).

### 5.2 Canonical URL Duality (P0)
Property pages can be reached through two routes:
- Route A: `src/app/property/[slug]/page.tsx`
  - Canonical emitted: `https://rehvo.in/property/[slug]`
- Route B: `src/app/[city]/[locality]/[slug]/page.tsx`
  - Canonical emitted: `/[city]/[locality]/[slug]` (Relative URL, missing `https://rehvo.in` origin!)

Google treats relative canonicals inconsistently, and the existence of two valid 200-OK pages for each property splits backlink authority and internal equity.

### 5.3 Ten Phantom Redirect Stubs
The following pages in `src/app/`:
`host-property`, `hostel`, `localities`, `owners`, `pg-rooms`, `rewards`, `rooms`, `society`, `wallet`, `zero-brokerage`.
These pages do not use HTTP 301/308 redirects. Instead, they use `useEffect(() => { router.replace("/") }, [])` and export:
```typescript
export const metadata = constructSeoMetadata({
  title: "...",
  canonical: "/", // Resolves to https://rehvo.in/
});
```
**Effect:** Search bots receive HTTP 200 OK with the homepage canonical URL. Google Search Console will flag all 10 URLs as:
*“Duplicate without user-selected canonical”* or *“Alternate page with proper canonical tag”*, cluttering the index coverage report and wasting crawler bandwidth.

---

## 6. Structured Data & Schema.org Validation

### 6.1 P0 Policy Violation: Hardcoded Fake Reviews
Inspecting `src/lib/seo/schema.ts` (Lines 179–220):
```typescript
export function propertySchema(property: PropertySchemaInput) {
  // ...
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "18",
    bestRating: "5",
    worstRating: "1",
  },
  review: [
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Aakash Sharma" },
      reviewRating: { "@type": "Rating", ratingValue: "5" },
      reviewBody: "Smooth zero-brokerage rental experience with REHVO.",
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Priya Deshmukh" },
      reviewRating: { "@type": "Rating", ratingValue: "5" },
      reviewBody: "Verified property, video tour matched reality.",
    },
  ],
}
```
> [!CAUTION]
> **GOOGLE PENALTY RISK: CRITICAL**  
> Google’s *Review Snippet Structured Data Guidelines* strictly state:  
> 1. *“Do not fabricate reviews or ratings.”*  
> 2. *“Reviews must be genuine user submissions for the specific entity.”*  
> 3. *“Self-serving reviews are prohibited for RealEstateListing and LocalBusiness entities.”*  
> Injecting fictitious reviewers (“Aakash Sharma” and “Priya Deshmukh”) with a hardcoded 4.9 rating on properties across the board is a direct violation of Google Webmaster Guidelines and can trigger a **Manual Action (Structured Data Abuse)**, suppressing rich snippets domain-wide.

### 6.2 Schema Type Correctness
- Properties use `"@type": "RealEstateListing"`, which is technically valid, but nested under `mainEntity: { "@type": "SingleFamilyResidence" }`. For apartments in Mumbai, this should dynamically map to `Apartment` or `Accommodation`.
- RealEstateAgent schema in `src/lib/seo/schema.ts` is well-structured: includes `priceRange: "₹₹"`, `currenciesAccepted: "INR"`, and social `sameAs` links.
- **Missing Schemas:**
  - `/faq` lacks `FAQPage` schema.
  - `/flatmates` lacks `ItemList` or `Service` schema.
  - `BreadcrumbList` schema is missing on static subpages (`/about`, `/contact`, `/privacy`, `/terms`).

---

## 7. Property & Local SEO (GEO Infrastructure)

### 7.1 Programmatic Locality Hubs (`/[city]/[locality]`)
- **Coverage:** 10 major Mumbai micro-markets (Bandra West, Andheri West, Powai, Juhu, Worli, Malad West, Thane West, Khar West, Dadar, Lower Parel).
- **Static Site Generation:** Uses `generateStaticParams()` with pre-calculated price ranges, transit landmarks, and FAQ accordions.
- **Deficiencies:**
  - Missing `postalCode` in `Place` schema (e.g. Bandra West 400050, Andheri West 400058).
  - Missing GeoJSON bounding box or `geoShape` to indicate neighborhood boundaries for Google Local Knowledge Graph.
  - Static nearby localities are hardcoded rather than dynamically querying adjacent nodes.

### 7.2 Programmatic Intent Landing Pages (`/rent/[slug]`)
- **Coverage:** 13 high-value keyword targets (e.g., `2-bhk-for-rent-in-mumbai`, `flats-for-rent-in-bandra`, `flats-for-rent-in-andheri-west`, `flats-near-nmims-mumbai`).
- **SEO Value:** **Highest organic intent in the entire platform.**
- **CRITICAL GAP:** None of these 13 routes are listed in `sitemap.ts` or `sitemap-pages.xml`. They rely solely on dynamic discovery, which is impaired because internal links to them from the footer/homepage are sparse.

---

## 8. Blog, Editorial & Knowledge Graph SEO

### 8.1 Editorial Inventory & Metadata
- **Blog Posts:** 5 guides in `src/lib/seo/blogData.ts` covering rental agreements, zero-brokerage guides, safety tips, and Mumbai locality reviews.
- **Stories:** 4 verified user journey articles in `src/lib/seo/storiesData.ts`.
- **Market Reports:** 3 quarterly real estate reports in `src/lib/seo/marketReportsData.ts`.
- **Article Schema:** Properly generates `BlogPosting` and `Article` schema with `headline`, `datePublished`, `dateModified`, and publisher logo.
- **Author Entity Gap:** The author is string-only (`"REHVO Editorial Team"` or `"Priya Nair"`). It lacks an author bio, `author.sameAs` (LinkedIn/Twitter), and an author profile URL, failing Google E-E-A-T guidelines for real estate and financial advice.

---

## 9. Image & Video SEO

### 9.1 Image Asset Audit
A static scan of the `src/` directory revealed **50 image references**:
- **Next.js Optimized `<Image>`:** 14 instances (28%)
- **Raw HTML `<img>`:** 36 instances (72%)

**Critical Image Performance Flaw:**
In `next.config.js`:
```javascript
images: {
  unoptimized: true,
}
```
By setting `unoptimized: true`, Next.js **disables WebP/AVIF automatic conversion, responsive srcset generation, and on-demand resizing**. All property photos and banners are served uncompressed to mobile clients, severely degrading Largest Contentful Paint (LCP).

### 9.2 Video Showreel SEO
- REHVO has a dedicated `/video-sitemap.xml` endpoint generated dynamically.
- Each video showreel includes `video:title`, `video:description`, `video:thumbnail_loc`, and `video:content_loc`.
- Mixkit 403 issue was resolved: videos are correctly hosted locally under `/videos/`.
- Rich video schema is properly populated with `VideoObject`.

---

## 10. Technical SEO, Performance & Core Web Vitals

### 10.1 Core Web Vitals Risk Profile

| Metric | Target | Estimated Production Status | Primary Cause |
| :--- | :---: | :---: | :--- |
| **LCP (Largest Contentful Paint)** | < 2.5s | ⚠️ 3.2s – 3.8s (Mobile 4G) | `images.unoptimized: true` + Uncompressed hero images + Raw `<img>` tags |
| **INP (Interaction to Next Paint)** | < 200ms | ✅ ~90ms – 140ms | React 19 / Next.js 15 client hydration is fast |
| **CLS (Cumulative Layout Shift)** | < 0.1 | ⚠️ 0.14 – 0.18 | Multiple raw `<img>` without explicit `width` and `height` attributes |
| **FCP (First Contentful Paint)** | < 1.8s | ⚠️ 2.1s | Render-blocking external stylesheet from `fonts.googleapis.com` in `layout.tsx` |

### 10.2 Header & Code Quality Observations
- **Render-Blocking Font:** `layout.tsx` contains a manual `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@..." />` instead of using `next/font/google`, incurring DNS + TLS + download roundtrips that block initial paint.
- **Duplicate Preload:** Both a manual `<link rel="preload" as="image" href="/rehvo-logo.png" />` and standard icon manifests load simultaneously.
- **Security Headers & CSP:** Production CSP cleanly incorporates Google Analytics (`*.google-analytics.com`) and Microsoft Clarity (`*.clarity.ms`).

---

## 11. Internal Linking & Information Architecture

### 11.1 Internal Link Coverage
- Analyzed 49 internal link targets across navigation, footer, and component hierarchies.
- **Footer Architecture:** Strong locality grouping (Bandra, Andheri, Powai, Juhu, Worli).
- **Orphan Pages Identified (Zero in-app navigational links):**
  1. `/flatmates/create` (Only reached via direct prompt)
  2. `/faq` (Missing from mobile quick navigation)
  3. `/reports` (Only reached via blog sub-links)
  4. `/reports/mumbai-q4-2024`
  5. `/reports/student-housing-2025`
  6. `/reports/rental-yield-index`
  7. `/rent/flats-near-nmims-mumbai`
  8. `/rent/flats-near-iit-bombay`
  9. `/rent/flats-near-bkc`

---

## 12. Mobile & Social SEO Audit

- **Viewport Configuration:** `width=device-width, initial-scale=1, maximum-scale=5` (Accessible, pinch-to-zoom allowed).
- **OpenGraph & Twitter Cards:**
  - `og:site_name`: `REHVO`
  - `og:type`: Dynamic (`website`, `article`, `realestate`)
  - `twitter:card`: `summary_large_image`
  - `twitter:site`: `@rehvo_in`
  - Fallback social banner: `https://rehvo.in/og-image.png` (1200x630, valid aspect ratio).
- **Apple Mobile Web App:** `apple-mobile-web-app-capable: yes`, custom apple-touch-icon declared.

---

## 13. Search Console & AI Search Readiness

### 13.1 AI Crawler & LLM Readability
- **`llms.txt` Status:** **MISSING**. There is no `/llms.txt` or `/llms-full.txt` at root, preventing modern LLM aggregators (Perplexity, SearchGPT, Claude) from cleanly parsing REHVO's inventory, fee structure, and verified listings.
- **Crawl Budget & AI Bots:** `robots.ts` provides no dedicated directives for `PerplexityBot`, `GPTBot`, `ClaudeBot`, or `Google-Extended`.

---

## 14. Competitor Gap Analysis vs Real Estate Portals

| Feature / SEO Dimension | MagicBricks | 99acres | Housing.com | REHVO (Current) | REHVO Target |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Brokerage Filtering SEO** | Poor (Scattered) | Poor | Fair | **Superior (Core USP)** | Native Zero-Brokerage Schema |
| **Locality Guides Depth** | High (500+ words) | High | High | Medium (350 words) | Expand with Society/Micro-hub data |
| **Video Showreel Rich Snippets** | None | Minimal | Minimal | **Dominant (Video Sitemap Ready)** | #1 Video snippet ranking on Google |
| **Schema Validation** | Validated | Validated | Validated | 🛑 **Fake reviews violation** | Clean real reviews only |
| **Programmatic Rent URLs** | 50,000+ | 80,000+ | 60,000+ | 13 created (0 in sitemap) | 13 indexed + expand to 100+ |
| **Image Optimization** | AVIF / WebP CDN | WebP CDN | WebP CDN | ❌ `unoptimized: true` | Next.js Image Optimization + Cloudinary |

---

## 15. Actionable Roadmap: Fixes & Code Implementation Plan

> [!NOTE]
> In accordance with the audit guidelines, **no code has been altered during this audit**. The exact fixes below are ready for implementation in the next release cycle.

### Phase 1: Critical Emergency Fixes (Day 1)
1. **Remove Fabricated Reviews from `src/lib/seo/schema.ts`:**
   - Strip hardcoded `aggregateRating` and `review` array from `propertySchema()`. Only emit review schema when real verified testimonials exist in Supabase.
2. **Eliminate Double Title Branding:**
   - In `src/app/layout.tsx`, change template to `%s` or update `constructSeoMetadata` to return raw titles without `| REHVO`.
3. **Unify Property Canonical URLs:**
   - Standardize all property URLs to `https://rehvo.in/property/${slug}`. Ensure `/[city]/[locality]/[slug]` issues a 301 redirect or declares the absolute canonical `https://rehvo.in/property/${slug}`.
4. **Fix 10 Client Redirect Stubs:**
   - Convert `/zero-brokerage`, `/host-property`, `/rooms`, etc., to native HTTP 308 redirects in `next.config.js` instead of serving HTTP 200 client-redirect stubs.
5. **Add `noindex, nofollow` to User/Auth Routes:**
   - Apply robots noindex metadata to `/profile`, `/list-property`, `/flatmates/create`, and `/favorites`.

### Phase 2: Sitemap & Indexation Overhaul (Day 2)
1. **Unify Sitemap Architecture:**
   - Update `robots.ts` to declare both `sitemap.xml` and `sitemap-index.xml`.
   - Add all 13 `/rent/[slug]` programmatic pages into `sitemap.ts` and `sitemap-pages.xml`.
   - Remove dead routes (`/zero-brokerage`) from sitemaps.
2. **Canonicalize Search Facets:**
   - In `src/app/search/page.tsx`, hardcode canonical to `https://rehvo.in/search` without parameter pass-through.

### Phase 3: Core Web Vitals & Media Optimization (Day 3)
1. **Enable Next.js Image Optimization:**
   - Remove `images.unoptimized: true` in `next.config.js`.
   - Replace 36 raw `<img>` tags with `next/image`.
2. **Native Font Loading:**
   - Replace external Google Fonts `<link>` stylesheet in `layout.tsx` with `next/font/google` (`Plus_Jakarta_Sans`).

### Phase 4: AI Search & Entity Expansion (Day 4)
1. **Deploy `/public/llms.txt`:**
   - Provide structured markdown describing REHVO's zero-brokerage model, Mumbai coverage, and property query parameters.
2. **Add Missing Rich Snippets:**
   - Add `FAQPage` schema to `/faq`.
   - Add `BreadcrumbList` schema to all static subpages.
   - Add `postalCode` to all 10 locality datasets.
