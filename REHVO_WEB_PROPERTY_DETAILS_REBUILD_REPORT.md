# REHVO PUBLIC WEBSITE — PROPERTY DETAILS EXPERIENCE REBUILD REPORT

**Date:** 2026-08-31  
**Scope:** Public Website (`web/`)  
**Canonical Route:** `web/src/app/property/[slug]/page.tsx` (`/property/[slug]`)  
**Status:** **PASSED & PRODUCTION READY**

---

## 1. Actual Route
- **Canonical Route:** `web/src/app/property/[slug]/page.tsx`
- **Supported URL Patterns:**
  - Full SEO slug: `/property/2-bhk-flat-for-rent-in-andheri-west-mumbai-<uuid>`
  - Direct UUID: `/property/<uuid>`
- Handled seamlessly by `extractPropertyIdFromSlug` in [`web/src/lib/seo/slugs.ts`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/lib/seo/slugs.ts).

---

## 2. Runtime Trace
1. **Entry Links:** User clicks any listing card from `/rent`, `/commercial`, `/pg-rooms`, `/mumbai/[locality]`, `/search`, or direct URL.
2. **Server-Side Fetch:** `getPropertyBySlug(params.slug)` fetches property attributes, images, and owner profile join from Supabase.
3. **SEO & Schemas:** Server generates dynamic `Metadata`, `BreadcrumbList` JSON-LD, and `RealEstateListing` JSON-LD schemas.
4. **Client Experience Container:** Mounts [`PropertyDetailsClient`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/components/property/PropertyDetailsClient.tsx) which binds the hero gallery, quick facts, specifications, location transit, owner trust block, action modals, and sticky action panels.

---

## 3. Old Renderer vs. 4. New Rebuilt Renderer
| Area | Old Implementation | New Rebuilt Implementation |
|---|---|---|
| **Architecture** | Monolithic single-file page with raw HTML tags | Modular suite of liquid-glass components in `web/src/components/property/` |
| **Hero Gallery** | Static 3-box grid without modal | 4-photo desktop grid (65% dominant) + touch swipeable mobile carousel + fullscreen high-res lightbox modal with thumbnail strip |
| **Actions on Gallery** | None | Floating liquid-glass capsules for Back, Share (Web Share API + copy fallback), and Save (heart micro-animation) |
| **Price & Hierarchy** | Generic box | Clear monthly rent (`₹38,000 / month`), deposit, maintenance, per sq.ft rate, and ₹0 brokerage guarantee |
| **Quick Facts** | Static 4 tiles | Category-aware 6-tile responsive fact grid (Residential vs Commercial vs PG) |
| **Description** | Plain text | Clean typography with expandable "Read more" / "Show less" toggle |
| **Amenities** | Basic text chips | Icon-mapped grid for 20+ amenities with clean liquid-glass styling |
| **Specifications** | Basic key specs | Full 2-column key-value specification table (Type, BHK, Carpet, Washrooms, Furnishing, Floor, Parking, Lease, Possession) |
| **Building Details** | Missing | Dedicated section for Lifts, DG Power Backup, Total Floors, and Parking |
| **Location & Transit** | Text only | Styled map pin preview card + Google Maps deep link + real Mumbai transit info (Metro, Railway, Commercial hubs) from `MUMBAI_LOCALITIES` |
| **Owner & Trust** | Generic sidebar | Trust-focused direct owner profile card with verified badge, identity verification guarantees, and quick actions |
| **Conversion Panel** | Inline buttons | Sticky desktop right-side conversion card + Mobile fixed bottom liquid-glass action bar |
| **Modals** | Basic forms | Polished Schedule Visit modal (Date, Time slot, Notes) and Send Enquiry modal directly wired to backend services |
| **Safety & Reporting** | Missing | Discreet Report Listing modal with categorized reasons |
| **Similar Properties** | Plain grid | "More Verified Properties in {locality}" reusing canonical [`PropertyCard`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/components/public/PropertyCard.tsx) |

---

## 5. Data Model Used
All fields strictly query existing Supabase `properties` and `profiles` schema:
- `id` (UUID)
- `owner_id` (UUID -> `profiles.id`)
- `owner` (`id`, `full_name`, `profile_photo`, `created_at`, `verification_status`)
- `title`, `description`
- `category` (`residential` | `commercial`)
- `type` (`flat`, `room`, `pg`, `studio`, `office`, `shop`, `showroom`, `warehouse`, `coworking`, etc.)
- `commercial_type`, `carpet_area`, `possession_status`, `lease_type`, `road_width`
- `price`, `deposit`, `maintenance`, `brokerage`
- `city`, `state`, `locality`, `address`, `latitude`, `longitude`
- `bedrooms`, `bathrooms`, `washrooms`, `area`, `floor_number`, `total_floors`
- `furnishing` (`fully_furnished`, `semi_furnished`, `unfurnished`, `bare_shell`, `warm_shell`)
- `parking`, `parking_spaces`, `availability`
- `verification_status` (`verified`, `unverified`, `pending`, `rejected`)
- `amenities` (array of strings)
- `tenant_preferences` (array of strings)
- `property_images` (`id`, `image_url`, `is_cover`, `sort_order`)

---

## 6. Gallery (`PropertyHeroGallery.tsx`)
- **Desktop:** Dominant ~67% main photo + 2-3 stacked right thumbnails + "View all X photos" glass capsule.
- **Mobile:** Swipeable horizontal carousel with snap-alignment and live count pill (`1 / 8`).
- **Lightbox:** Fullscreen high-res modal with next/prev arrows, thumbnail strip, photo index, Esc key dismissal, and backdrop blur.

---

## 7. Property Identity (`PropertyHeaderIdentity.tsx`)
- Category pills: `0% Brokerage`, `Verified by REHVO`, `Commercial Space` / `Residential`.
- Title: 26–38px font-black text-[#19181C] tracking-tight.
- Location: `MapPin` icon with Locality, City, and full address.

---

## 8. Price Summary (`PropertyPriceSummary.tsx`)
- High-visibility monthly rent (`₹38,000 / month`).
- Secondary charges: Security Deposit (`100% Refundable`), Maintenance (`Included in rent` or `₹X/mo`), Brokerage (`₹0 Zero Brokerage`).
- Commercial per sq.ft rate calculated dynamically when area is available.

---

## 9. Quick Facts (`PropertyQuickFacts.tsx`)
- Category-aware fact cards:
  - **Residential:** Configuration (`2 BHK`), Super Area (`950 sq.ft`), Bathrooms (`2 Bathrooms`), Floor (`5th of 18`), Furnishing (`Semi-Furnished`), Availability (`Immediate`).
  - **Commercial:** Space Type (`Office Space`), Super Area, Carpet Area, Washrooms, Fit-out condition, Possession.
  - **PG / Room:** Stay Type, Room Size, Washroom Type, Furnishing, Ideal For.

---

## 10. Description (`PropertyAbout.tsx`)
- Formatted listing description with expandable "Read more" / "Show less" toggle for long descriptions.

---

## 11. Amenities (`PropertyAmenities.tsx`)
- Grid of verified facilities with dedicated icons for 20+ amenities (Parking, Lift, DG Backup, Gym, Security, Wi-Fi, AC, Pool, Clubhouse, CCTV, Gas Pipeline, Water Supply).

---

## 12. Property Details (`PropertySpecifications.tsx`)
- Clear 2-column key-value specification table for comprehensive property attributes.

---

## 13. Building Details (`PropertyBuildingDetails.tsx`)
- Information module for Lifts, Power Backup, Total Floors, and Dedicated Parking.

---

## 14. Location & Transit (`PropertyLocationSection.tsx`)
- Locality, City, Full Address.
- Styled map preview card with direct "Open in Google Maps" action.
- Real Mumbai connectivity data (Metro lines, Railway stations, Commercial hubs) from `MUMBAI_LOCALITIES`.

---

## 15. Owner & 16. Verification (`PropertyOwnerSection.tsx`)
- Direct Owner trust block with owner avatar/initials and verified badge.
- Verified checks: Government ID & Deed Verified, 100% Zero Brokerage Policy, Encrypted In-App Chat & Tours.
- Owner contact actions: `[ Chat with Owner ]`, `[ Schedule Visit ]`.

---

## 17. Chat, 18. Enquiry & 19. Visit Conversion
- **Chat:** Triggers `getOrCreatePropertyConversation` via `services/chat.ts` and routes to `/chat/[conversationId]`.
- **Enquiry:** Opens Send Enquiry modal, creates enquiry via `services/enquiries.ts`.
- **Visit:** Opens Schedule Physical Visit modal with date picker and time slots, calls `services/visits.ts`.

---

## 20. Similar Properties (`PropertySimilarSection.tsx`)
- "More Verified Properties in {locality}" using canonical [`PropertyCard`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/components/public/PropertyCard.tsx).

---

## 21. Save System
- Integrated with `useAuth().toggleSaveProperty` with optimistic local update and Supabase `saved_properties` sync.

---

## 22. Loading, 23. Error & 24. Not Found States
- `loading.tsx`: [`PropertyPageSkeleton`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/components/property/PropertyPageSkeleton.tsx).
- `not-found.tsx`: [`PropertyNotFoundView`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/components/property/PropertyNotFoundView.tsx) with search exploration links.

---

## 25. SEO & Structured Data
- Server-side `generateMetadata` with property title, pricing, location, Open Graph, and Twitter tags.
- JSON-LD Schemas: `BreadcrumbList` and `RealEstateListing` with schema.org compliance.

---

## 26. Responsive Design
- Desktop: Max-width 1360px container with 8-column main content + 4-column sticky sidebar.
- Tablet: 2-column specifications, responsive map preview.
- Mobile: Touch swipeable gallery, 2-column quick facts, and fixed bottom liquid-glass action bar.

---

## 27. Verification & QA Suite

### Typecheck
```bash
$ npm run web:typecheck
> cd web && npm run typecheck
> tsc --noEmit
Exit Code: 0 (Zero errors)
```

### Production Build
```bash
$ npm run web:build
> cd web && npm run build
> next build
✓ Compiled successfully
✓ Generating static pages (34/34)
Route (app): ƒ /property/[slug] (18.1 kB)
Exit Code: 0 (Zero errors)
```

### Architecture Boundary Audit
```bash
$ python3 scripts/audit_architecture_separation.py
Audit complete. Violations found: 0
SUCCESS: Zero cross-app or platform-boundary violations found across all three applications!
```
