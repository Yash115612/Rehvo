# REHVO PROPERTY CANONICAL FIELD MAPPING & DATABASE CONTRACT REPORT

**Audit Date:** 2026-08-31  
**Status:** **PERMANENTLY RESOLVED & VERIFIED**  
**Contract Validator:** `scripts/verify_property_payload_contract.py` (100% Passing)

---

## 1. Actual `properties` Database Schema
Derived strictly from canonical migration [`supabase/migrations/002_properties.sql`](file:///Users/yashchoudhary/Downloads/rehvo/supabase/migrations/002_properties.sql):

| Column | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, `gen_random_uuid()` | Property identifier |
| `owner_id` | UUID | NOT NULL, REFERENCES `public.profiles(id)` | Property owner |
| `type` | TEXT | NOT NULL, CHECK (`'flat'`, `'room'`, `'pg'`, `'studio'`) | Property listing type |
| `title` | TEXT | NOT NULL | Listing headline |
| `description` | TEXT | NOT NULL | Detailed description |
| `price` | INTEGER | NOT NULL | Monthly rent in INR (₹) |
| `deposit` | INTEGER | NOT NULL DEFAULT 0 | Security deposit in INR (₹) |
| `maintenance` | INTEGER | NOT NULL DEFAULT 0 | Monthly maintenance / CAM in INR (₹) |
| `brokerage` | INTEGER | NOT NULL DEFAULT 0 | Strictly 0 (100% Zero Brokerage) |
| `city` | TEXT | NOT NULL | Service city (e.g. `'Mumbai'`) |
| `state` | TEXT | NOT NULL | State (e.g. `'Maharashtra'`) |
| `locality` | TEXT | NOT NULL | Neighborhood / locality |
| `address` | TEXT | NOT NULL | Building & street address |
| `latitude` | DOUBLE PRECISION | NULLABLE | Geospatial latitude |
| `longitude` | DOUBLE PRECISION | NULLABLE | Geospatial longitude |
| `bedrooms` | TEXT | NOT NULL | BHK count (e.g. `'1'`, `'2'`, `'3'`, `'4+'`, `'0'`, `'Studio'`) |
| `bathrooms` | INTEGER | NOT NULL DEFAULT 1 | Bathroom / washroom count |
| `area` | INTEGER | NOT NULL DEFAULT 0 | **Canonical Area in sq.ft** |
| `furnishing` | TEXT | NOT NULL, CHECK (`'fully_furnished'`, `'semi_furnished'`, `'unfurnished'`) | Furnishing status |
| `parking` | TEXT | DEFAULT `'None'` | Parking availability |
| `availability` | TEXT | DEFAULT `'Immediate'` | Move-in date / possession status |
| `status` | TEXT | NOT NULL DEFAULT `'published'`, CHECK (`'draft'`, `'published'`, `'paused'`, `'removed'`) | Listing status |
| `verification_status` | TEXT | NOT NULL DEFAULT `'unverified'`, CHECK (`'unverified'`, `'pending'`, `'verified'`, `'rejected'`) | Trust & verification |
| `amenities` | TEXT[] | DEFAULT `'{}'` | **Consolidated Amenities array** |
| `tenant_preferences` | TEXT[] | DEFAULT `'{}'` | **Consolidated Tenant / Business Suitability array** |
| `views_count` | INTEGER | DEFAULT 0 | View tracking |
| `saves_count` | INTEGER | DEFAULT 0 | Save tracking |
| `enquiries_count` | INTEGER | DEFAULT 0 | Enquiry tracking |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT `NOW()` | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT `NOW()` | Last update timestamp |

---

## 2. Frontend Form Fields & Canonical Field Mapping

The listing form collects rich inputs that are transformed by the canonical mappers (`mapListingFormToPropertyInsert` and `mapListingFormToPropertyUpdate`):

| Frontend / UI Field | Canonical DB Column | Mapping Transformation |
| :--- | :--- | :--- |
| `title` | `title` | `input.title.trim()` |
| `description` | `description` | `input.description.trim()` |
| `price` / `rent` | `price` | `Number(input.price)` |
| `deposit` | `deposit` | `Number(input.deposit \|\| 0)` |
| `maintenance` | `maintenance` | `Number(input.maintenance \|\| 0)` |
| `city` | `city` | `input.city.trim()` |
| `state` | `state` | `input.state?.trim() \|\| 'Maharashtra'` |
| `locality` | `locality` | `input.locality.trim()` |
| `address` | `address` | `input.address.trim()` |
| `bedrooms` | `bedrooms` | `input.bedrooms ? String(input.bedrooms) : '0'` |
| **`bathrooms` / `washrooms`** | **`bathrooms`** | `Number(input.bathrooms \|\| input.washrooms \|\| 1)` |
| **`area` / `carpetArea` / `carpet_area`** | **`area`** | `Number(input.area \|\| input.carpet_area \|\| input.carpetArea \|\| 0)` |
| **`furnishing`** | **`furnishing`** | Normalized: `'fully_furnished' \| 'semi_furnished' \| 'unfurnished'` |
| **`parking` / `parking_spaces`** | **`parking`** | `input.parking \|\| input.parking_spaces \|\| 'None'` |
| **`availability` / `possession_status`** | **`availability`** | `input.availability \|\| input.possession_status \|\| 'Immediate'` |
| **`amenities` (+ `lift`, `power_backup`)** | **`amenities`** | `Set<string>` merged into `TEXT[]` containing all features |
| **`tenant_preferences` (+ `business_type`)** | **`tenant_preferences`** | `Set<string>` merged into `TEXT[]` for preferred tenants & suitable businesses |
| `type` / `category` | `type` | Normalized to valid DB type: `'flat' \| 'room' \| 'pg' \| 'studio'` |
| `status` | `status` | `'published'` |
| `verification_status` | `verification_status` | `'unverified'` |

---

## 3. Resolution of Specific Field Mismatches

### A. `carpet_area` Resolution
- **Problem:** Client was sending `carpet_area` as a distinct column to Supabase, which rejected it with schema cache error because the database table has column `area`.
- **Solution:** The canonical area is stored in `properties.area` (`INTEGER`). `mapListingFormToPropertyInsert` and `mapListingFormToPropertyUpdate` accept `area`, `carpet_area`, or `carpetArea` and map the value directly into `properties.area`. No data is lost.

### B. `business_type` Resolution
- **Problem:** Commercial suitable business types (e.g. `'IT / Tech'`, `'Retail'`) were sent as a distinct column `business_type`.
- **Solution:** `properties.tenant_preferences` (`TEXT[]`) stores both residential preferred tenants and commercial suitable business types. Any business types are merged directly into `tenant_preferences`.

### C. `washrooms` & `bathrooms` Resolution
- **Problem:** Commercial spaces use "Washrooms" in the UI.
- **Solution:** Mapped into the canonical integer column `bathrooms`.

### D. `lift` & `power_backup` Resolution
- **Problem:** Boolean flags `lift: true` / `power_backup: true` were sent as individual columns.
- **Solution:** Merged into the `amenities` array (`['lift', 'power_backup', ...]`).

### E. `possession_status` Resolution
- **Problem:** UI passed `possession_status: 'Immediate'`.
- **Solution:** Mapped into the canonical column `availability`.

---

## 4. Elimination of Object Spreading (`...formData`)
In [`web/src/services/properties.ts`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/services/properties.ts), all dynamic `...input` object spreads into `.insert()` and `.update()` have been replaced with explicit whitelist mappers (`mapListingFormToPropertyInsert` and `mapListingFormToPropertyUpdate`). Only columns present in `002_properties.sql` can ever be sent to Supabase.

---

## 5. Verification Matrix

| Test Layer | Tool / Script | Result |
| :--- | :--- | :--- |
| **Payload Contract Test** | `python3 scripts/verify_property_payload_contract.py` | **24 insert keys & 19 update keys strictly match 002_properties.sql (PASS)** |
| **Web TypeScript Compilation** | `npm run web:typecheck` | **0 errors (PASS)** |
| **Web Production Build** | `npm run web:build` | **34/34 pages compiled (PASS)** |
| **Expo TypeScript Compilation** | `npx tsc --noEmit` | **0 errors (PASS)** |
| **3-App Boundary Verification** | `python3 scripts/audit_architecture_separation.py` | **0 violations (PASS)** |
| **Live Route Styling Audit** | `python3 scripts/verify_web_styling.py` | **All 8 critical routes PASS** |
