# REHVO — Critical Fix Report: Property Image Pipeline & Public Web Image Safety

**Date**: August 19, 2026  
**Auditor**: Antigravity Assistant  
**Status**: **RESOLVED & VERIFIED END-TO-END**  
**Live Endpoint Tests**: **12 Passed / 0 Failed (100% Success)**

---

## 1. Exact Cause of Crash

`next/image` in the Next.js App Router crashed when server-rendering property cards and detail pages containing device-local paths:
```
Invalid src prop (file:///data/user/0/com.rehvo.app/cache/ImagePicker/...) on next/image
```
`next/image` is an image optimization server layer that only accepts valid relative paths or whitelisted remote `https://` URLs. Device-local file paths like `file:///data/user/0/...`, `content://`, `ph://`, or `data:` cannot be fetched by a web server and must never be stored as public property image URLs.

---

## 2. Audit of Existing Records in Supabase

- **Table Inspected**: `public.property_images` (in Supabase Mumbai project `xoskechmxzgfajkfpssv`)
- **Total Initial Records**: 13
- **Bad / Local URI Records Found**: **2**
  1. `Image ID: 8d566871-8971-4d8e-8670-b9d65a85fe89`  
     `Property ID: 153d500a-1ba1-48d2-916b-dbbbd9c7c912`  
     `Bad URL: file:///data/user/0/com.rehvo.app/cache/ImagePicker/7c7e6c16-5948-4f13-85da-cf5f8f5ffec9.jpeg`
  2. `Image ID: 95eb4922-9729-4605-abde-6aee0f333035`  
     `Property ID: 153d500a-1ba1-48d2-916b-dbbbd9c7c912`  
     `Bad URL: file:///data/user/0/com.rehvo.app/cache/ImagePicker/c6761f53-a2b1-4850-ad7a-28d00798bc7f.jpeg`
- **Valid HTTPS Records**: 11 (all hosted on Supabase Storage or verified CDN)

---

## 3. Database Cleanup & Migration

Because the local files on the Android device cache cannot be retrieved by a remote server, the 2 invalid metadata rows were safely deleted from `public.property_images`.

- **Property `153d500a-1ba1-48d2-916b-dbbbd9c7c912`**: Preserved 100% intact.
- **Remaining `property_images` rows**: **11 (100% Valid HTTPS URLs)**.
- **Bad image records remaining**: **0**.

---

## 4. Mobile Write-Path Hardening (`src/services/properties.ts`)

The property creation and image upload service was hardened with unbypassable remote HTTPS assertions:

1. **`uploadPropertyImage`**:
   - Any local URI (`file:`, `content:`, `ph:`, `blob:`, `data:`, or raw filesystem path) is read into binary via `readUriAsArrayBufferOrBlob()` and uploaded to Supabase Storage at:
     `${ownerId}/${propertyId}/${fileName}.jpg`
   - Obtains public URL via `supabase.storage.from('property-images').getPublicUrl(...)`.
   - **Strict Assertion**: Rejects and aborts if the generated URL does not start with `https://`.
2. **`createProperty`**:
   - Loops through all candidate images.
   - If image URL is not already a remote `https://` URL, it MUST go through `uploadPropertyImage()`.
   - If upload fails or returns a non-HTTPS URL, atomic rollback triggers, deleting the property record to prevent orphan or corrupted listings.

---

## 5. Public Web Defense Layer (`web/src/lib/seo/queries.ts` & UI Components)

1. **Query-Level Sanitization**:
   - Created `sanitizePropertyImages()` and `sanitizeImageUrl()` helpers in `web/src/lib/seo/queries.ts`.
   - Strips any non-HTTPS image URLs at the query layer before data reaches React components.
2. **UI Component Fallbacks**:
   - `PropertyCard.tsx`: Validates `coverImage.startsWith('https://')` and falls back to a verified placeholder image if missing or invalid.
   - `property/[slug]/page.tsx`: Filters `validImages`. If a property has 0 images, renders a dedicated "Verified REHVO Listing" banner without crashing `next/image`.
   - `FlatmateCard.tsx`: Safely sanitizes profile avatars.

---

## 6. Next.js Remote Image Configuration

In `web/next.config.js` and `admin/next.config.js`, wildcard `hostname: '**'` was removed and replaced with explicit, secure hostnames:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xoskechmxzgfajkfpssv.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;
```

---

## 7. Live Public Web End-to-End Verification

Tested on running local server `http://localhost:3001`:

| Endpoint | Test Case | Status |
|---|---|:---:|
| `/` | Homepage with Property Cards | **200 OK** |
| `/mumbai` | Mumbai City Hub | **200 OK** |
| `/mumbai/andheri-west` | Locality Hub | **200 OK** |
| `/mumbai/andheri-west/flats-for-rent` | Category Page | **200 OK** |
| `/property/yoyoo-in-andheri-west-mumbai-...` | **Property with 0 images (Fallback Test)** | **200 OK** |
| `/property/bdhdhdnn-in-andheri-west-mumbai-...` | **Property with Valid HTTPS Images** | **200 OK** |
| `/flatmates/mumbai` | Flatmates Hub | **200 OK** |
| `/pg/mumbai` | PG & Co-Living Hub | **200 OK** |
| `/about` | About REHVO | **200 OK** |
| `/contact` | Contact & Support | **200 OK** |
| `/sitemap.xml` | Dynamic XML Sitemap | **200 OK** |
| `/robots.txt` | Crawler Directives | **200 OK** |

**Result: 12 Passed / 0 Failed**.

---

## 8. TypeScript & Production Build Verification

- **Mobile TypeScript (`npx tsc --noEmit`)**: **PASSED (0 errors)**
- **Public Web App (`cd web && npm run typecheck && npm run build`)**: **PASSED (0 errors, 9 static pages + dynamic SSR routes)**
- **Admin App (`cd admin && npm run typecheck && npm run build`)**: **PASSED (0 errors, 20 static pages)**
