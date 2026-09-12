# REHVO PROPERTY PUBLIC VISIBILITY & DISCOVERY FLOW REPORT

**Audit Date:** 2026-08-31  
**Status:** **PERMANENTLY RESOLVED & VERIFIED**  
**Automated Validator:** `scripts/verify_property_discovery_flow.py` (100% Passing)

---

## 1. Executive Summary & Root Cause Diagnosis

### The Problem
When an owner created and published a property through `/owner/properties/new`, the database row was successfully created in `public.properties` with `status = 'published'`, but the property was **NOT** appearing on the public marketplace pages (`/rent`, `/commercial`, `/pg-rooms`, `/`).

### The Root Cause
1. **Category Filter on Non-Existent Column**:
   - The public marketplace pages (`/rent`, `/commercial`, `/`, `/search`) pass `category: 'residential'` or `category: 'commercial'` to `getPublishedProperties`.
   - In [`web/src/lib/seo/queries.ts`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/lib/seo/queries.ts) and [`web/src/services/properties.ts`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/services/properties.ts), the query builder had:
     ```ts
     if (options?.category && options.category !== 'all') {
       query = query.eq('category', options.category);
     }
     ```
   - In the database schema ([`002_properties.sql`](file:///Users/yashchoudhary/Downloads/rehvo/supabase/migrations/002_properties.sql)), property space types are stored in the canonical column **`type`** (`'flat'`, `'room'`, `'pg'`, `'studio'`), NOT a separate column `category`.
   - Because `category` does not exist as a column in the database table, querying `.eq('category', 'residential')` caused Supabase PostgREST to return an error or zero rows, causing the marketplace to show zero properties.

2. **Select Column Incompatibilities**:
   - `getPublishedProperties` and `getPropertyBySlug` were selecting columns like `carpet_area`, `floor_number`, `washrooms`, `lift`, etc., which triggered schema cache lookup errors on PostgREST.

---

## 2. Comprehensive Field & Query Trace

### Publishing Lifecycle
```
Owner Listing Form (/owner/properties/new)
  ↓
mapListingFormToPropertyInsert(ownerId, input, 'published')
  ↓ (Strict Whitelist Mapping)
Supabase Database (public.properties)
  ├─ type: 'flat' | 'room' | 'pg' | 'studio'
  ├─ status: 'published'
  ├─ area: 950 (sq.ft)
  ├─ bathrooms: 2
  ├─ amenities: ['lift', 'power_backup', ...]
  └─ tenant_preferences: ['Family', 'Bachelors', ...]
  ↓
Public Marketplace Query (getPublishedProperties)
  ├─ category: 'residential' → query.in('type', ['flat', 'room', 'pg', 'studio'])
  ├─ category: 'commercial' → query.in('type', ['office', 'shop', 'showroom', ...])
  └─ status: 'published'
  ↓
Row-Level Security (009_rls_policies.sql)
  └─ USING (status = 'published' OR auth.uid() = owner_id) → ALLOWED PUBLIC READ
  ↓
Sanitization & Virtual Mapping (PublicProperty)
  ├─ category = inferred from type ('residential' | 'commercial')
  ├─ carpet_area = row.area
  ├─ washrooms = row.bathrooms
  ├─ parking_spaces = row.parking
  └─ possession_status = row.availability
  ↓
Public Marketplace Card & Details Route (/property/[slug])
```

---

## 3. Row Level Security (RLS) Policy Verification
From [`supabase/migrations/009_rls_policies.sql`](file:///Users/yashchoudhary/Downloads/rehvo/supabase/migrations/009_rls_policies.sql):
- **Policy:** `"Anyone can view published properties"`
  ```sql
  CREATE POLICY "Anyone can view published properties"
      ON public.properties FOR SELECT
      USING (status = 'published' OR auth.uid() = owner_id OR public.is_admin());
  ```
- **Image Policy:** `"Anyone can view property images"`
  ```sql
  CREATE POLICY "Anyone can view property images"
      ON public.property_images FOR SELECT
      USING (TRUE);
  ```
- **Conclusion:** Public/anonymous users are permitted by RLS to read any property row where `status = 'published'`.

---

## 4. Fixes Applied

1. **Canonical Category-to-Type Mapping**:
   In [`web/src/lib/seo/queries.ts`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/lib/seo/queries.ts):
   ```ts
   export const RESIDENTIAL_TYPES = ['flat', 'room', 'pg', 'studio'];
   export const COMMERCIAL_TYPES = [
     'office',
     'shop',
     'showroom',
     'warehouse',
     'commercial_building',
     'coworking',
     'commercial_plot',
     'other_commercial',
   ];

   if (options?.category && options.category !== 'all') {
     if (options.category === 'commercial') {
       query = query.in('type', COMMERCIAL_TYPES);
     } else if (options.category === 'residential') {
       query = query.in('type', RESIDENTIAL_TYPES);
     }
   }
   ```
2. **Canonical Mapping in Service Functions**:
   Updated `getMyProperties` and `searchProperties` in [`web/src/services/properties.ts`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/services/properties.ts) to filter using `COMMERCIAL_TYPES` and `RESIDENTIAL_TYPES` instead of non-existent `category` column.
3. **Virtual Field Sanitization**:
   Ensured `getPublishedProperties` and `getPropertyBySlug` dynamically populate `category`, `carpet_area`, `washrooms`, `parking_spaces`, `possession_status`, `power_backup`, and `lift` from database columns `area`, `bathrooms`, `parking`, `availability`, and `amenities`.
4. **Cache & Revalidation**:
   All discovery pages configure `export const revalidate = 60;` (Next.js Incremental Static Regeneration) ensuring fast response times while regularly checking for new listings.

---

## 5. Verification Matrix

| Verification Layer | Command / Tool | Status |
| :--- | :--- | :--- |
| **Property Discovery Flow Audit** | `python3 scripts/verify_property_discovery_flow.py` | **100% PASS** |
| **Property Schema Contract** | `python3 scripts/verify_property_payload_contract.py` | **100% PASS** |
| **Live CSS & Route Delivery** | `python3 scripts/verify_web_styling.py` | **8/8 routes PASS with 97.2KB CSS** |
| **TypeScript Typecheck** | `npm run web:typecheck` | **0 errors (PASS)** |
| **Production Build** | `npm run web:build` | **34/34 pages compiled (PASS)** |
| **Architecture Separation Audit** | `python3 scripts/audit_architecture_separation.py` | **0 violations (PASS)** |
