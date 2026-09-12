# REHVO Web Styling Health Matrix

**Audit Date:** 2026-08-31  
**Architecture:** Next.js 14 App Router + Tailwind CSS 3.4 + PostCSS 8  
**Global Stylesheet:** `web/src/app/globals.css` (imported centrally in `web/src/app/layout.tsx`)  
**Design Tokens:** Single Source of Truth (`--rehvo-*` CSS variables in `:root`)  
**Typography:** Plus Jakarta Sans with universal anti-aliasing & cross-browser element resets  

---

## Critical Route Health Matrix

| Route | Root Layout | Global CSS Loaded | Font Loaded | Design Tokens Loaded | Component Styles Loaded | Browser Verified | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`/`** (Home / Landing) | `layout.tsx` | ✅ `globals.css` | ✅ Plus Jakarta Sans | ✅ Full Palette | ✅ Liquid Glass, Hero, Search, Cards | ✅ Yes | **PASS** |
| **`/rent`** (Rentals Marketplace) | `layout.tsx` | ✅ `globals.css` | ✅ Plus Jakarta Sans | ✅ Full Palette | ✅ Filter Pills, Property Grid, Badges | ✅ Yes | **PASS** |
| **`/commercial`** (Commercial) | `layout.tsx` | ✅ `globals.css` | ✅ Plus Jakarta Sans | ✅ Full Palette | ✅ Commercial Types, Spec Cards, Glass | ✅ Yes | **PASS** |
| **`/pg-rooms`** (PG & Rooms) | `layout.tsx` | ✅ `globals.css` | ✅ Plus Jakarta Sans | ✅ Full Palette | ✅ Occupancy Tags, Amenities, Prices | ✅ Yes | **PASS** |
| **`/flatmates`** (Flatmates Hub) | `layout.tsx` | ✅ `globals.css` | ✅ Plus Jakarta Sans | ✅ Full Palette | ✅ Discovery Cards, Lifestyle Badges | ✅ Yes | **PASS** |
| **`/localities`** (Mumbai Localities) | `layout.tsx` | ✅ `globals.css` | ✅ Plus Jakarta Sans | ✅ Full Palette | ✅ Locality Cards, Transit Metrics | ✅ Yes | **PASS** |
| **`/about`** (About REHVO) | `layout.tsx` | ✅ `globals.css` | ✅ Plus Jakarta Sans | ✅ Full Palette | ✅ Zero Brokerage Story, Features | ✅ Yes | **PASS** |
| **`/owner/properties/new`** (Create Property Listing) | `layout.tsx` | ✅ `globals.css` | ✅ Plus Jakarta Sans | ✅ Full Palette | ✅ Classification Cards, Steps, Inputs, Buttons | ✅ Yes | **PASS** |
| **`/owner/properties`** (My Properties) | `layout.tsx` | ✅ `globals.css` | ✅ Plus Jakarta Sans | ✅ Full Palette | ✅ Dashboard Tables, Status Badges | ✅ Yes | **PASS** |
| **`/owner/properties/[id]/edit`** (Edit Property) | `layout.tsx` | ✅ `globals.css` | ✅ Plus Jakarta Sans | ✅ Full Palette | ✅ Edit Form, Amenity Selectors | ✅ Yes | **PASS** |
| **`/property/[slug]`** (Property Details) | `layout.tsx` | ✅ `globals.css` | ✅ Plus Jakarta Sans | ✅ Full Palette | ✅ Hero Gallery, Sticky Bar, Specs | ✅ Yes | **PASS** |

---

## Verification Criteria Summary

1. **Root Layout Wrapping**: 100% of canonical routes in `web/src/app` are wrapped by `web/src/app/layout.tsx`.
2. **Zero Duplicate Stylesheets**: No page or route group defines a rogue layout or isolated stylesheet.
3. **Typography Reset**: No browser-default serif (Times New Roman) or unstyled blue/purple links appear on any route.
4. **Form Controls & Buttons**: All form inputs utilize `.input-rehvo`, `.select-rehvo`, `.textarea-rehvo`, and buttons utilize `.btn-primary`, `.btn-secondary`, `.btn-dark`.
5. **Liquid Glass System**: Universal utility classes (`.rehvo-glass-card`, `.rehvo-glass-capsule`, `.glass-subtle`, `.glass-medium`, `.glass-strong`) apply consistently across all viewport breakpoints.
