# REHVO — Phase 4: Property System Supabase Migration Report

> **Execution Date**: August 2026  
> **Status**: **MIGRATION COMPLETE (0 TypeScript Errors across Mobile & Admin)**  
> **Scope**: Property system migration from local/seed storage to Supabase (`public.properties`, `public.property_images`, and `property-images` storage bucket)

---

## 1. Property Data Flow & Architecture

From Phase 4 onward, **Supabase is the authoritative source of truth for all property listings and images**.

```mermaid
graph TD
    subgraph Supabase Project [REHVO Mumbai Supabase]
        DB_Prop[(public.properties)]
        DB_Img[(public.property_images)]
        Storage[(property-images bucket)]
    end

    subgraph Service Layer [src/services/properties.ts]
        Query[getPublishedProperties / getPropertyById]
        MyProps[getMyProperties]
        Create[createProperty]
        Update[updateProperty]
        Delete[deleteProperty]
        UploadImg[uploadPropertyImage]
    end

    subgraph Mobile UI & State [Zustand Cache & Expo Screens]
        Store[useAppStore.ts]
        Home[RenterHomeScreen / Home]
        Search[search.tsx / Filter]
        Details[property/[id].tsx]
        ListWizard[listing/publish.tsx]
        OwnerDash[OwnerDashboardScreen]
        MyProperties[OwnerMyPropertiesScreen]
    end

    Query --> DB_Prop
    MyProps --> DB_Prop
    Create --> DB_Prop
    Create --> DB_Img
    UploadImg --> Storage
    Delete --> DB_Prop
    Delete --> Storage

    Store --> Service Layer
    Home --> Store
    Search --> Store
    Details --> Service Layer
    ListWizard --> Store
    OwnerDash --> Store
    MyProperties --> Store
```

---

## 2. Database Mapping: App $\leftrightarrow$ Supabase

| App Model (`Property`) | DB Column (`properties`) | Data Type / Format | Transformation Details |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` | Direct |
| `owner_id` | `owner_id` | `UUID` | Strictly derived from `auth.uid()` |
| `owner_name`, `owner_avatar`, `owner_phone` | `profiles:owner_id (...)` | Joined relation | Fetched via relation join on `public.profiles` |
| `title` | `title` | `TEXT` | Direct |
| `description` | `description` | `TEXT` | Direct |
| `property_type` | `type` | `TEXT` (`flat`, `room`, `pg`, `studio`) | Mapped (`FLAT` $\rightarrow$ `'flat'`, `PRIVATE_ROOM` $\rightarrow$ `'room'`, etc.) |
| `rent` | `price` | `INTEGER` | Direct integer mapping |
| `deposit` | `deposit` | `INTEGER` | Direct |
| `maintenance` | `maintenance` | `INTEGER` | Direct |
| `brokerage` | `brokerage` | `INTEGER` | Direct (`0` = no brokerage) |
| `city`, `state`, `locality`, `address` | `city`, `state`, `locality`, `address` | `TEXT` | Direct |
| `latitude`, `longitude` | `latitude`, `longitude` | `DOUBLE PRECISION` | Direct |
| `bhk` | `bedrooms` | `TEXT` | e.g. `"2 BHK"`, `"1 RK"`, `"Studio"` |
| `bathrooms` | `bathrooms` | `INTEGER` | Direct |
| `area_sqft` | `area` | `INTEGER` | Direct |
| `furnishing` | `furnishing` | `TEXT` (`fully_furnished`, `semi_furnished`, `unfurnished`) | Normalized lowercase enum |
| `parking` | `parking` | `TEXT` | Direct |
| `available_from` | `availability` | `TEXT` | Direct |
| `status` | `status` | `TEXT` (`draft`, `published`, `paused`, `removed`) | Mapped (`ACTIVE` $\rightarrow$ `'published'`) |
| `verification_status` | `verification_status` | `TEXT` (`unverified`, `pending`, `verified`, `rejected`) | Normalized lowercase enum |
| `amenities` | `amenities` | `TEXT[]` | Postgres string array |
| `tenant_preferences` | `tenant_preferences` | `TEXT[]` | Postgres string array |
| `images` | Relational table | `public.property_images` | Joined and sorted by `sort_order ASC` |

---

## 3. Image Storage Flow

1. **Upload Pipeline**:
   - User selects images via device picker (`file://`, `blob:`, `ph://`).
   - `propertyService.uploadPropertyImage(propertyId, uri, isCover, sortOrder)` uploads image binary to `property-images/${propertyId}/${timestamp}_${random}.jpg`.
   - Obtains public URL from Supabase Storage.
   - Inserts record into `public.property_images` storing `property_id`, `image_url`, `storage_path`, `is_cover`, `sort_order`.
2. **Cascade Deletion Pipeline**:
   - On `deleteProperty(propertyId)`, the service queries `public.property_images` for all associated `storage_path` values.
   - Invokes `supabase.storage.from('property-images').remove(paths)`.
   - Foreign key `ON DELETE CASCADE` automatically cleans up `property_images` rows.

---

## 4. Owner Capability & Route Protection

* **Strict Source of Truth**: Capability `hasPropertyListing` is derived directly from live user properties:
  $$\text{hasPropertyListing} = \text{userProperties.length} > 0$$
* **First Property Creation**:
  - User lists property $\rightarrow$ created in Supabase $\rightarrow$ stored in `userProperties` $\rightarrow$ `hasPropertyListing = true` $\rightarrow$ Owner Dashboard & My Properties unlock immediately.
* **Last Property Deletion**:
  - User deletes sole property $\rightarrow$ deleted from Supabase $\rightarrow$ `userProperties.length = 0` $\rightarrow$ `hasPropertyListing = false` $\rightarrow$ `currentRole` resets to `'RENTER'` $\rightarrow$ `OwnerLayout` redirects to `/(renter)/profile` safely once without render loops.

---

## 5. Screens Migrated to Real Supabase

| Screen / Component | File Path | Migration Status |
| :--- | :--- | :--- |
| **Home Screen** | [`src/components/home/RenterHomeScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/RenterHomeScreen.tsx) | Live queries `published` properties with pull-to-refresh |
| **Search Screen** | [`app/(renter)/search.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(renter)/search.tsx) | Searches real Supabase properties with multi-criteria filters |
| **Property Details** | [`app/(renter)/property/[id].tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(renter)/property/[id].tsx) | Direct ID lookup with 404 handling (no stale fallback) |
| **Renter Listing Wizard** | [`app/(renter)/listing/publish.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(renter)/listing/publish.tsx) | Creates real Supabase property and uploads photos |
| **Owner Listing Wizard** | [`app/(owner)/listing/preview.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(owner)/listing/preview.tsx) | Creates real Supabase property and transitions status |
| **My Properties** | [`src/components/owner/properties/OwnerMyPropertiesScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/properties/OwnerMyPropertiesScreen.tsx) | Fetches and manages user's properties (`owner_id = user.id`) |
| **Owner Dashboard** | [`src/components/owner/OwnerDashboardScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/OwnerDashboardScreen.tsx) | Displays real computed listing metrics (Active, Draft, Paused) |
| **Owner Layout Guard** | [`app/(owner)/_layout.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(owner)/_layout.tsx) | Single-pass redirect protection on zero property listings |

---

## 6. Seed Data & Local Dependencies Audit

* **Seed Properties in Production**: `properties` in `useAppStore` now initializes to `[]` (empty list). Seed properties no longer pollute production property lists.
* **Remaining Mock Domains (Phase 5+)**:
  - `flatmate_profiles` (Mock seed data preserved for next phase)
  - `conversations` / `messages` (Chat seed data preserved for next phase)
  - `visits` / `applications` / `enquiries` (Interaction seed data preserved for next phase)
  - `notifications` (Notification seed data preserved for next phase)

---

## 7. Security & RLS Compliance

1. **Authentication Enforcement**: `createProperty` rejects unauthenticated requests; `owner_id` is derived from authenticated session (`auth.uid()`).
2. **Row Level Security**:
   - Anyone can view `published` properties.
   - Only property owners can update or delete their own listings (`owner_id = auth.uid()`).
   - Admin users have global moderation access via `is_admin()`.
3. **Storage Security**: Only owners can upload to `property-images/${propertyId}/*`.

---

## 8. Verification Results

| # | Check | Expected Result | Status |
|---|---|---|---|
| 1 | Mobile TypeScript Compilation (`npx tsc --noEmit`) | 0 errors | **PASS** |
| 2 | Admin TypeScript Compilation (`npm run typecheck`) | 0 errors | **PASS** |
| 3 | Initial Property List | Empty `[]` for new users | **PASS** |
| 4 | Property Creation | Row in `public.properties` | **PASS** |
| 5 | Owner Capability Derivation | `hasPropertyListing` true only with $\ge 1$ listing | **PASS** |
| 6 | Property Details 404 | "Property not found" without stale seed fallback | **PASS** |
| 7 | Zero Villa Schema | Strictly `flat`, `room`, `pg`, `studio` | **PASS** |
| 8 | Error Sanitization | User-friendly feedback; zero raw SQL/Postgres errors | **PASS** |
