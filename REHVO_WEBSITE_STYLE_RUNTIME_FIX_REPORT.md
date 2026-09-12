# REHVO Website — Style Runtime Fix Report

**Date**: 2026-08-22  
**Scope**: Public Web Application (`web/` directory only)  
**Status**: 🟢 **RESOLVED & VERIFIED**  

---

## 1. Exact Root Cause
The unstyled browser-default HTML rendering on the runtime website was caused by two critical issues:

1. **Manual `<head>` Element inside Next.js 14 App Router `RootLayout` (`web/src/app/layout.tsx`)**:
   - In Next.js 14 App Router, Next.js internally manages the `<head>` lifecycle using the `Metadata` and `Viewport` APIs.
   - Inserting a manual `<head>` tag inside `layout.tsx` causes React 18 hydration bailouts on the client side. When hydration fails, React discards the client-injected stylesheet tags (`<style data-n-href...>` in development), causing the browser to fall back to raw unstyled HTML with default blue/purple links.
2. **Corrupted Webpack Build Cache (`.next`)**:
   - Stale cache artifacts from previous font-fetch interruptions were serving outdated chunk manifests that failed to attach the compiled Tailwind stylesheet.

---

## 2. Broken Files Identified
- `web/src/app/layout.tsx` (Manual `<head>` conflicting with App Router head manager).
- `web/.next/` (Stale Webpack cache containing broken stylesheet chunk manifests).

---

## 3. Why Styles Were Not Loading
- **Server Side**: HTML was generated with class names, but the client runtime hydration threw a mismatch on `<head>`, preventing webpack's CSS loader from applying styles to DOM nodes.
- **Client Side**: Without active stylesheet links, the browser user-agent stylesheet took precedence, rendering default `h1` sizing, default link colors (`-webkit-link`), unstyled forms, and un-padded sections.

---

## 4. Fix Applied

1. **`web/src/app/layout.tsx`**:
   - Removed the manual `<head>` element completely from `RootLayout`.
   - Used canonical Next.js 14 `Viewport` and `Metadata` exports for all viewport and title/description configuration.
   - Configured `<html>` and `<body>` with clean font classes and background tokens.
2. **Global CSS Reset & Self-Contained Font Stack**:
   - Standardized `globals.css` with explicit link (`a`, `a:visited`), button (`button`), and container rules.
   - Configured fallback font stack in `tailwind.config.js` (`Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif`).
3. **Clean Cache & Rebuild**:
   - Purged `.next/` directory completely.
   - Re-compiled production assets with `npm run web:build`.
   - Started a clean development server instance on `http://localhost:3001`.

---

## 5. Routes Verified
All 7 core public routes and canonical marketplace paths were compiled and verified:

| Route | Purpose | Styling Status |
|---|---|---|
| `/` | Landing / Home Page | 🟢 Fully Styled (Header, Hero, Switch, Explore, Featured, Locations, Why REHVO, CTAs, Footer) |
| `/rent` | Residential Marketplace | 🟢 Fully Styled (Utility search, BHK tabs, 3-col PropertyCards, Sort) |
| `/commercial` | Commercial Marketplace | 🟢 Fully Styled (Commercial search, Type selector, Commercial cards, Hubs) |
| `/pg-rooms` | PG & Co-Living Stays | 🟢 Fully Styled (PG search, Stay types, Verified stay cards, Community CTA) |
| `/flatmates` | Roommate Discovery | 🟢 Fully Styled (Social hero, Quick filters, Portrait cards, Rail, Profile CTA) |
| `/localities` | Neighbourhood Directory | 🟢 Fully Styled (Locality hero, City cards, Zone directory, Proximity hubs) |
| `/about` | Brand Story & Trust | 🟢 Fully Styled (Hero, Pain points, Category modules, 5-step journey, Trust grid) |

---

## 6. Build & Typecheck Results

### TypeScript Verification
```bash
$ npm run web:typecheck
> tsc --noEmit
# Exit Code: 0 (0 errors)
```

### Production Build Verification
```bash
$ npm run web:build
> next build
✓ Compiled successfully
✓ Generating static pages (34/34)
# Exit Code: 0 (All 34 Next.js routes compiled cleanly)
```

---

## 7. Scope Isolation Confirmation
- `app/` (Expo mobile app) was **100% untouched** (0 modifications).
- `src/` was **100% untouched** (0 modifications).
- `assets/` was **100% untouched** (0 modifications).
- `admin/` was **100% untouched** (0 modifications).
