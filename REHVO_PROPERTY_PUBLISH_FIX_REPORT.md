# REHVO — Property Publishing Failure Root Cause Analysis & Fix Report

**Date**: August 18, 2026  
**Target Platform**: Expo / React Native App & Admin Web  
**Backend**: Supabase Production Cloud (Mumbai / `ap-south-1`) — `https://xoskechmxzgfajkfpssv.supabase.co`

---

## 1. Executive Summary & Root Cause Analysis

### Identified Root Causes:
1. **Unchecked Local Image URIs**:
   - In [`photos.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/listing/photos.tsx), photos selected via Expo ImagePicker stored local sandbox filesystem URIs (`file:///...`, `content://...`, `ph://...`).
   - [`publish.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/listing/publish.tsx) passed `newProperty` with local `file://` URLs in `newProperty.images`.
   - In [`properties.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/properties.ts), `createProperty()` previously inserted `file:///...` directly as `image_url` into the database without uploading the local image binaries to Supabase Storage `property-images` bucket.
2. **Storage Path & RLS Delete Mismatch**:
   - In [`010_storage_buckets.sql`](file:///Users/yashchoudhary/Downloads/rehvo/supabase/migrations/010_storage_buckets.sql), storage deletion policy required `auth.uid()::text = (storage.foldername(name))[1]`.
   - `uploadPropertyImage()` previously constructed `storagePath = ${propertyId}/${fileName}`, placing `propertyId` in the top folder instead of `owner_id`. When attempting to delete or replace photos, Supabase Storage rejected the request due to folder owner mismatch.
3. **Missing Authentication & Pre-Publish Validation in UI**:
   - In [`publish.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/listing/publish.tsx) and [`preview.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28owner%29/listing/preview.tsx), `owner_id` fell back to `'usr_current'` if `user?.id` was undefined.
   - If an error occurred, the catch block swallowed the actual database error and displayed a generic toast: `"Couldn't create this property. Please try again."`
4. **Lack of Atomic Rollback on Image Failure**:
   - If a network failure occurred mid-image upload, the property row remained half-created in the database without images.

---

## 2. Comprehensive Code & Service Fixes

### 1. Robust Service Implementation ([`src/services/properties.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/properties.ts))
- **`createProperty(input, imagesToUpload)`**:
  - Validates authenticated user via `supabase.auth.getUser()`. Rejects unauthenticated requests with `"You must be signed in to publish a property."`
  - Validates required non-empty fields: `title`, `rent` $> 0$, `city`, `locality`, `property_type`.
  - Strictly maps `property_type` to valid database enum values (`'flat'`, `'room'`, `'pg'`, `'studio'`).
  - Sets default `status = 'published'` for immediate discovery visibility.
  - Inserts property row into `public.properties`.
  - Iterates through all images:
    - If local URI (`file:`, `blob:`, `ph:`, `content:`, `data:`): Uploads to `property-images` at `${ownerId}/${propertyId}/${fileName}`, extracts public URL, and inserts into `public.property_images`.
    - If remote HTTP/HTTPS URL: Inserts directly into `public.property_images`.
  - **Atomic Rollback**: If any image upload fails, immediately deletes the newly created property row and storage files so zero orphan records remain in the database.
  - Automatically synchronizes `public.profiles` role to `'owner'` upon successful listing.
- **`uploadPropertyImage()`**:
  - Resolves `ownerId` from `supabase.auth.getUser()`.
  - Uses storage folder structure: `${resolvedOwnerId}/${propertyId}/${fileName}` to strictly satisfy Supabase Storage RLS policies.

### 2. State & Reconciliation Updates ([`src/store/useAppStore.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/store/useAppStore.ts))
- In `addProperty`:
  - Automatically updates `properties` state and AsyncStorage cache.
  - Updates `user.role` to `'OWNER'` and sets `currentRole: 'OWNER'`, `role: 'OWNER'`.
  - Dispatches `fetchMyProperties()`, `fetchProperties()`, and `fetchOwnerMetrics()` to immediately refresh owner dashboard metrics.
  - Returns `{ success: true, data: created }` or specific `{ success: false, error: res.error }`.

### 3. Listing UI Routes Refactored
- [`app/(renter)/listing/publish.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/listing/publish.tsx):
  - Added pre-flight authentication verification (`!user?.id`).
  - Added pre-publish validation for `title`, `rent`, and `locality`.
  - Navigates to `/(renter)/listing/success` **only after** confirmed backend success.
  - On failure: remains on screen, displays the exact user-friendly error message, and allows instant retry.
- [`app/(owner)/listing/preview.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28owner%29/listing/preview.tsx):
  - Synchronized publish handler with same auth verification, validation, and error reporting.

---

## 3. End-to-End Live Supabase Verification Matrix

Executed with live authenticated accounts against `https://xoskechmxzgfajkfpssv.supabase.co`:
- **Owner Account A**: `rehvo.beta.test.1787039625735@gmail.com` (`ID: a7417958-b492-4bef-af69-5ceacb270113`)
- **Renter Account B**: `rehvo.beta.test.1787039573606@gmail.com` (`ID: 474f5b91-d467-4447-9222-191fe9014a31`)

| Test Scenario | Validation Steps | Live Database Result | Status |
|---|---|---|:---:|
| **1. Property Publish with Photos** | 1. Authenticate Owner A<br>2. Insert property with photos<br>3. Upload storage image<br>4. Insert `property_images` row<br>5. Query public discovery | Property ID: `b8f1c39f-3c67-434a-ad85-ff95027030f2`<br>Image ID: `a6c82cb7-f6af-4aac-9d1c-527e5c7a4553`<br>Storage: `.../1787072042288_cover.jpg` | **PASS** |
| **2. Zero-Image Property Publish** | 1. Create property without images<br>2. Verify status = 'published' | Property ID: `cd721f5d-bb09-4731-b227-fb82426e39a3`<br>Status: `published` | **PASS** |
| **3. User Isolation & RLS Security** | 1. Renter B attempts to update Owner A's property<br>2. Renter B attempts to delete Owner A's property | Postgres RLS blocked update (0 affected rows)<br>Postgres RLS blocked delete (0 affected rows) | **PASS** |
| **4. Rollback on Image Upload Failure** | 1. Simulate image failure<br>2. Trigger atomic delete | Property `7c062633-7b25-4b0c-b306-9dd2bde6002f` deleted. 0 orphan rows. | **PASS** |

---

## 4. Code Quality & Compilation Verification

- Mobile TypeScript (`npx tsc --noEmit`): **0 errors**
- Admin Web TypeScript (`cd admin && npm run typecheck`): **0 errors**
- Storage bucket permissions: Verified upload and delete permissions for authenticated owners.
