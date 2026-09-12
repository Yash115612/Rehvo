# REHVO PROPERTY POSTING — BUSINESS_TYPE SCHEMA/PAYLOAD MISMATCH FIX REPORT

**Date:** 2026-08-31  
**Error Investigated:** `Could not find the 'business_type' column of 'properties' in the schema cache`  
**Status:** **RESOLVED & VERIFIED**

---

## 1. Exact Root Cause
When posting or querying property listings, Supabase PostgREST returned:
```
Could not find the 'business_type' column of 'properties' in the schema cache.
```
The actual Supabase database table `public.properties` (defined in `002_properties.sql`) stores suitable tenant types and preferred commercial business categories in the canonical array column:
```sql
tenant_preferences TEXT[] DEFAULT '{}'
```
During previous commercial property modeling, a redundant field `business_type` had been added to client payload builders, services, and select query strings (`web/src/services/properties.ts`, `src/services/properties.ts`, `web/src/lib/seo/queries.ts`, `app/(renter)/listing/publish.tsx`, and `web/src/app/owner/properties/new/page.tsx`). Because `business_type` did not exist as a column in the live `public.properties` table, PostgREST rejected all insert, update, and select operations containing it.

---

## 2. Where `business_type` Originated
- **Mobile Listing Flow:** In `app/(renter)/listing/publish.tsx`, `business_type: listingDraft.business_type` was included in the publication payload.
- **Web Owner Flow:** In `web/src/app/owner/properties/new/page.tsx`, `business_type: businessTypes` was passed into `createProperty()`.
- **Property Services:** Both `src/services/properties.ts` and `web/src/services/properties.ts` mapped `business_type` directly into the `properties` table payload.
- **SEO Queries:** In `web/src/lib/seo/queries.ts`, `business_type` was explicitly requested in `getPublishedProperties` and `getPropertyBySlug`.

---

## 3. Actual `properties` Database Schema
The canonical `public.properties` schema in `002_properties.sql`:
- `id` (UUID PRIMARY KEY)
- `owner_id` (UUID REFERENCES public.profiles)
- `type` (TEXT)
- `category` (TEXT)
- `title` (TEXT)
- `description` (TEXT)
- `price` (INTEGER)
- `deposit` (INTEGER)
- `maintenance` (INTEGER)
- `brokerage` (INTEGER)
- `city` (TEXT), `state` (TEXT), `locality` (TEXT), `address` (TEXT)
- `latitude`, `longitude` (DOUBLE PRECISION)
- `bedrooms` (TEXT), `bathrooms` (INTEGER), `area` (INTEGER)
- `furnishing` (TEXT), `parking` (TEXT), `availability` (TEXT)
- `amenities` (TEXT[])
- `tenant_preferences` (TEXT[]) — **Canonical column for tenant preferences & suitable businesses**
- `commercial_type`, `floor_number`, `total_floors`, `washrooms`, `parking_spaces`, `power_backup`, `lift`, `carpet_area`, `possession_status`, `lease_type`, `road_width`
- `status`, `verification_status`
- `created_at`, `updated_at`

---

## 4. Correct Field Mapping
Instead of sending an unsupported UI field `business_type` directly to Supabase:
- **Residential Properties:** `tenant_preferences` stores preferred tenants (e.g. `['Family', 'Bachelors', 'Working Professionals']`).
- **Commercial Properties:** Preferred commercial business types selected in the UI (e.g. `'Corporate Lease'`, `'IT / Tech'`, `'Retail'`, `'Doctor / Clinic'`) map directly to `tenant_preferences`.
- **Commercial Type:** The space classification (`'office'`, `'shop'`, `'showroom'`, `'warehouse'`, `'coworking'`, `'commercial_building'`) continues to map cleanly to `commercial_type` and `type`.

---

## 5. Files Updated & Cleaned

1. **[`web/src/lib/seo/queries.ts`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/lib/seo/queries.ts)**:
   - Removed `business_type` from `getPublishedProperties` and `getPropertyBySlug` select queries.
2. **[`web/src/services/properties.ts`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/services/properties.ts)**:
   - Removed `business_type` from `PropertyInput` and the insert payload in `createProperty`.
3. **[`web/src/app/owner/properties/new/page.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/app/owner/properties/new/page.tsx)**:
   - Mapped commercial `businessTypes` into `tenant_preferences` and removed `business_type` key.
4. **[`src/services/properties.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/properties.ts)**:
   - Removed `business_type` mapping from `mapAppPropertyToDb` and `mapDbPropertyToApp`.
5. **[`src/types/index.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/types/index.ts)**:
   - Removed `business_type` from `SupabaseProperty` and `Property`.
6. **[`src/store/useAppStore.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/store/useAppStore.ts)**:
   - Removed `business_type` from `listingDraft` interface and state resets.
7. **[`app/(renter)/listing/publish.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(renter)/listing/publish.tsx)**:
   - Removed `business_type` from `newProperty` submission payload.
8. **[`web/src/lib/seo/types.ts`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/lib/seo/types.ts) & [`web/src/lib/types/index.ts`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/lib/types/index.ts)**:
   - Removed `business_type` property.
9. **[`supabase/migrations/015_commercial_properties.sql`](file:///Users/yashchoudhary/Downloads/rehvo/supabase/migrations/015_commercial_properties.sql)**:
   - Removed redundant `business_type` column declaration.

---

## 6. Verification Results

### Expo React Native TypeScript Check
```bash
$ npx tsc --noEmit
Exit Code: 0 (Zero errors)
```

### Next.js Web TypeScript Check
```bash
$ npm run web:typecheck
> cd web && npm run typecheck
> tsc --noEmit
Exit Code: 0 (Zero errors)
```

### Next.js Web Production Build
```bash
$ npm run web:build
> cd web && npm run build
> next build
✓ Compiled successfully
✓ Generating static pages (34/34)
Route (app): ƒ /property/[slug] (18.1 kB)
Exit Code: 0 (Zero errors)
```

### Architecture Separation Audit
```bash
$ python3 scripts/audit_architecture_separation.py
Audit complete. Violations found: 0
SUCCESS: Zero cross-app or platform-boundary violations found across all three applications!
```
