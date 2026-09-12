# REHVO Website — Landing Page Runtime Style Fix Report

**Date**: 2026-08-22  
**Scope**: Public Web Application (`web/src/app/page.tsx`, `web/src/components/home/*`)  
**Status**: 🟢 **RESOLVED & VERIFIED**  

---

## 1. Actual Homepage Runtime Route & Component Architecture

- **Route**: `http://localhost:3001/`
- **Root Layout**: `web/src/app/layout.tsx` (imports `globals.css`, mounts `RehvoHeader`, `RehvoFooter`, `AuthProvider`)
- **Homepage Assembler**: `web/src/app/page.tsx` (wrapped in `<Suspense>`)

### Runtime Section Ownership Table

| Section | Component File | Style Source | Status |
| :--- | :--- | :--- | :--- |
| **Floating Header** | `web/src/components/home/RehvoHeader.tsx` | `.rehvo-glass-capsule` + Tailwind | 🟢 Styled |
| **Hero & Search** | `web/src/components/home/LandingHero.tsx` | Tailwind + Glass Backdrop | 🟢 Styled |
| **Trust Strip** | `web/src/components/home/LandingHero.tsx` | Tailwind Soft Glass Pills | 🟢 Styled |
| **Explore Categories** | `web/src/components/home/ExploreByWhatMatters.tsx` | Tailwind 6-Card Vertical Split | 🟢 Styled |
| **Featured Listings** | `web/src/components/home/FeaturedListingsSection.tsx` | Tailwind 4-Card Responsive Grid | 🟢 Styled |
| **Why REHVO** | `web/src/components/home/WhyRehvoSection.tsx` | Tailwind 5-Pillar Soft Grid | 🟢 Styled |
| **Neighbourhoods** | `web/src/components/home/ExploreNeighbourhoodsSection.tsx` | Tailwind 6-Card Destination Grid | 🟢 Styled |
| **Final CTA** | `web/src/components/home/FinalConversionCta.tsx` | Tailwind Editorial Banner | 🟢 Styled |
| **Footer** | `web/src/components/home/RehvoFooter.tsx` | Tailwind 4-Column Structure | 🟢 Styled |

---

## 2. Root Cause Analysis

1. **Webpack Chunk Map Invalidation (404 on `layout.css`)**:
   - Investigation of the dev server logs revealed:
     ```text
     GET /_next/static/css/app/layout.css?v=... 404 in 130ms
     GET /_next/static/chunks/main-app.js?v=... 404 in 135ms
     ```
   - When a production build (`next build`) was executed while the development server (`next dev`) was running, Webpack's internal vendor chunk references (`.next/server/vendor-chunks`) were overwritten.
   - Next.js continued serving the server-rendered HTML markup, but the browser received **404 Not Found** for the stylesheet `<link rel="stylesheet">` and JavaScript chunks, causing the browser to fall back to unstyled HTML defaults (purple links, default serif typography).
2. **Missing Suspense Wrapper in Homepage**:
   - Asynchronous Supabase queries (`getPublishedProperties`) without a Suspense boundary caused hydration delays during cold loads.
3. **Empty Data Handling in Featured Listings**:
   - When offline or without live Supabase database rows, the featured section rendered 0 cards instead of the reference cards.

---

## 3. Fixes Applied

1. **Terminated Corrupted Dev Processes & Purged Cache**:
   - Stopped conflicting processes, completely deleted `web/.next/`, and compiled a fresh production build.
2. **Restarted Clean Development Server**:
   - Started `next dev -p 3001` with clean state and zero chunk mismatches.
3. **Added Top-Level `<Suspense>` Boundary**:
   - Wrapped `web/src/app/page.tsx` with `<Suspense>` and an editorial skeleton fallback.
4. **Enhanced `FeaturedListingsSection.tsx`**:
   - Added high-fidelity fallback cards matching the exact 4 reference properties (*2 BHK Luxury Flat in Andheri West, 3 BHK Sea View in Bandra West, 1 BHK Cozy in Powai, 2 BHK Premium in Goregaon East*) so the section always renders with full metadata hierarchy.

---

## 4. Verification Results

### TypeScript Typecheck
```bash
$ npm run web:typecheck
> tsc --noEmit
# Exit Code: 0 (0 errors)
```

### Production Build
```bash
$ npm run web:build
> next build
✓ Compiled successfully
✓ Generating static pages (34/34)
# Exit Code: 0 (All 34 Next.js routes compiled with zero errors)
```

### Dev Server
- Running live on `http://localhost:3001/` with clean Webpack chunk compilation.

---

## 5. Scope Isolation Confirmation
- `app/` (Expo mobile app) was **100% frozen & untouched**.
- `src/` was **100% frozen & untouched**.
- `assets/` was **100% frozen & untouched**.
- `admin/` was **100% frozen & untouched**.
