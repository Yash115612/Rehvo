# REHVO GLOBAL WEB STYLING & RUNTIME FIX REPORT

**Date:** 2026-08-31  
**Scope:** `web/` (Next.js Public Website)  
**Status:** **FIXED & FULLY RESTORED**

---

## 1. Exact Root Cause
The styling regression was caused by a combination of factors in the Next.js runtime styling pipeline:
1. **Tailwind Content Path Resolution:** In `tailwind.config.js`, the content array contained absolute `path.join(__dirname, ...)` globs alongside relative globs, which disrupted PostCSS/Tailwind class scanning and caching in development mode.
2. **Missing Box-Shadow Tokens:** Utility classes such as `shadow-2xs` and `shadow-xs` used across cards and capsules were not defined in `tailwind.config.js`, resulting in unstyled micro-surfaces.
3. **Link & Heading Resets:** Lack of explicit global CSS resets for `a:hover`, `a:active`, `h1–h6`, and paragraphs allowed browser-default styling (purple visited links and default user-agent margins) to show through whenever pseudo-states triggered.
4. **Font Loading Pipeline:** Plus Jakarta Sans font was not imported in the CSS pipeline, causing browser text rendering to fall back to serif/times defaults on systems without the font pre-installed.
5. **Stale Build Cache:** Stale `.next` artifacts had accumulated between rapid rebuilds.

---

## 2. Root Layout Trace
- **File:** [`web/src/app/layout.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/app/layout.tsx)
- **Hierarchy:**
  ```
  <html lang="en">
    <body className="font-sans min-h-screen flex flex-col bg-[#F7F5F0] text-[#19181C] ...">
      <AuthProvider>
        <RehvoHeader />
        <main className="flex-1">{children}</main>
        <RehvoFooter />
      </AuthProvider>
    </body>
  </html>
  ```
- **Verification:** Global CSS is imported **exactly once** via `import './globals.css'` at the root layout.

---

## 3. CSS Import Diagnosis
- All CSS rules and liquid-glass design system tokens originate from [`web/src/app/globals.css`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/app/globals.css).
- No conflicting CSS modules or secondary CSS systems exist.
- Verified single source of truth for the liquid-glass design system (`.rehvo-glass-card`, `.rehvo-glass-subtle`, `.rehvo-glass-capsule`, `.rehvo-glass-coral`, `.btn-primary`, `.btn-dark`, etc.).

---

## 4. Tailwind & PostCSS Diagnosis
- Cleaned content paths in [`web/tailwind.config.js`](file:///Users/yashchoudhary/Downloads/rehvo/web/tailwind.config.js):
  ```js
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  ```
- Added `2xs` and `xs` to `boxShadow`.
- PostCSS test confirmed full compilation: **126,145 bytes** of generated CSS with all custom utilities.

---

## 5. Legacy Component Diagnosis
- Checked all home sections in `web/src/components/home/`:
  - `LandingHero.tsx` (Canonical Hero & Category Search Dock)
  - `ExploreByWhatMatters.tsx` (Canonical 6-Card Category Discovery Grid)
  - `FeaturedListingsSection.tsx` (Canonical Residential Listing Showcase)
  - `WhyRehvoSection.tsx` (Canonical 5-Card Trust Modules)
  - `ExploreNeighbourhoodsSection.tsx` (Canonical 6 Locality Grid)
  - `FinalConversionCta.tsx` (Canonical Liquid-Glass Conversion Card)
  - `RehvoHeader.tsx` (Approved Capsule Navigation Header)
  - `RehvoFooter.tsx` (Approved Multi-Column Marketplace Footer)
- Confirmed `web/src/app/page.tsx` renders ONLY canonical components with zero legacy fallbacks.

---

## 6. Font Diagnosis
- Configured Google Font `Plus Jakarta Sans` via `@import` in `web/src/app/globals.css` with weights `400, 500, 600, 700, 800, 900`.
- Defined full fallback chain in `fontFamily.sans`: `['var(--font-plus-jakarta)', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']`.

---

## 7. Fix Applied
1. Stopped stale dev processes and cleared `web/.next`.
2. Normalized `tailwind.config.js` content paths and added missing shadow utilities.
3. Added strict universal CSS resets in `globals.css` eliminating default browser link colors (`color: inherit; text-decoration: none`) on all pseudo-classes (`:visited`, `:hover`, `:focus`, `:active`) and reset heading margins.
4. Added Plus Jakarta Sans font import in `globals.css`.
5. Rebuilt production Next.js application cleanly.

---

## 8–14. Route Verification
| Route | Canonical Page | Status |
|---|---|---|
| `/` | `web/src/app/page.tsx` | Styled & Verified |
| `/rent` | `web/src/app/rent/page.tsx` | Styled & Verified |
| `/commercial` | `web/src/app/commercial/page.tsx` | Styled & Verified |
| `/pg-rooms` | `web/src/app/pg-rooms/page.tsx` | Styled & Verified |
| `/flatmates` | `web/src/app/flatmates/page.tsx` | Styled & Verified |
| `/localities` | `web/src/app/localities/page.tsx` | Styled & Verified |
| `/about` | `web/src/app/about/page.tsx` | Styled & Verified |
| `/property/[slug]` | `web/src/app/property/[slug]/page.tsx` | Styled & Verified |

---

## 15. Typecheck & 16. Production Build
```bash
$ npm run web:typecheck
> cd web && npm run typecheck
> tsc --noEmit
Exit Code: 0 (Zero errors)

$ npm run web:build
> cd web && npm run build
> next build
✓ Compiled successfully
✓ Generating static pages (34/34)
Exit Code: 0 (Zero errors)

$ python3 scripts/audit_architecture_separation.py
Audit complete. Violations found: 0
SUCCESS: Zero cross-app or platform-boundary violations found across all three applications!
```
