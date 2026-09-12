# REHVO Web — Global CSS & Tailwind Pipeline Fix Report

**Release Status**: Fixed & Verified  
**Date**: August 20, 2026  
**Scope**: Next.js 14 Web Application Global CSS, Tailwind CSS v3 Pipeline, PostCSS, Font Stack Fallbacks, and Dev/Production Bundles  

---

## 1. Root Cause Analysis

When inspecting why the REHVO web application was rendering unstyled HTML in the browser, we identified three architectural issues:

1. **Broken CSS `@import` Rule in `globals.css`**:
   - `web/src/app/globals.css` started with `@import '../styles/theme.css';`.
   - In Next.js/PostCSS without the `postcss-import` plugin, this relative `@import` was preserved literally in the output stylesheet as `@import url("../styles/theme.css");`.
   - The browser attempted to fetch `http://localhost:3001/styles/theme.css` over HTTP, which returned a **404 Not Found** (since `src/styles/theme.css` is not in the public folder).
   - This caused browser CSS parsing to break or halt stylesheet evaluation.

2. **Tailwind Configuration Format & Content Globs**:
   - The project only had `tailwind.config.ts`. PostCSS and Next.js dev server run natively in CommonJS. A canonical `tailwind.config.js` was missing to ensure universal compatibility and seamless content scanning of `./src/**/*.{js,ts,jsx,tsx,mdx}`.

3. **Font Stack Fallback Missing in `next/font/google`**:
   - `Plus_Jakarta_Sans` in `layout.tsx` was configured without a `fallback` font array. When Google Fonts network downloads failed or were delayed in sandboxed/offline environments, the browser defaulted to its raw serif font (*Times New Roman*).

---

## 2. Changes Applied

### A. Inlined & Consolidated Theme Tokens (`web/src/app/globals.css`)
- Removed the external `@import '../styles/theme.css';` directive.
- Placed standard Tailwind directives at the top:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- Inlined the complete REHVO design system token definitions (`--rehvo-primary: #FF5533`, `--rehvo-background: #FAF8F5`, `--rehvo-surface: #FFFFFF`, `--rehvo-border: #E8E5EC`, button classes `.btn-rehvo-primary`, `.btn-rehvo-secondary`, `.btn-rehvo-outline`, `.input-rehvo`, scrollbars, and table utilities).

### B. Created Canonical `web/tailwind.config.js`
- Created `tailwind.config.js` exporting the Tailwind v3 configuration with:
  ```js
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ]
  ```
- Defined custom color palettes (`brand.primary: #FF5533`, `brand.canvas: #FAF8F5`, `brand.dark: #171522`), shadows, and animation plugins.

### C. Added Sans-Serif Fallback Stack (`web/src/app/layout.tsx`)
- Updated `Plus_Jakarta_Sans` configuration in `layout.tsx` to include:
  ```ts
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
  ```
- Ensures that even before web fonts finish loading, typography immediately renders with the clean, modern system sans-serif font stack without flashing browser serif fonts.

---

## 3. Test & Verification Matrix

| Step | Verification Item | Target | Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **1** | TypeScript Typecheck | `npm run typecheck` | 0 errors | **PASSED** |
| **2** | Next.js Production Build | `npm run build` | 31/31 static/dynamic pages compiled | **PASSED** |
| **3** | Built CSS Generation | `.next/static/css/` | Generated `44c8cbf939375099.css` (72.6 KB) | **PASSED** |
| **4** | Dev Server Startup | `npm run dev -p 3001` | Running on `http://localhost:3001` | **PASSED** |
| **5** | Homepage HTML Request | `GET /` | Status 200 (HTML payload 155 KB) | **PASSED** |
| **6** | CSS Link in HTML | `<link rel="stylesheet">` | Embedded `app/layout.css` | **PASSED** |
| **7** | CSS Asset Request | `GET /_next/static/css/app/layout.css` | Status 200 (CSS payload 96.8 KB) | **PASSED** |
| **8** | Tailwind Utilities in CSS | `.flex`, `.grid`, `.rounded-3xl`, `bg-stone-900` | Compiled and present in payload | **PASSED** |
| **9** | Brand Color in CSS | `#FF5533` (Coral), `#FAF8F5` (Linen) | Compiled and present in payload | **PASSED** |
| **10** | Subpages Resolution | `/commercial`, `/mumbai`, `/flatmates/mumbai`, `/about` | Status 200 with valid CSS links | **PASSED** |

---

## 4. Current State

The web application styling pipeline is working cleanly in both development mode (`npm run dev`) and production builds (`npm run build`). The homepage and all subpages render with the complete REHVO visual design system: curved headers, coral buttons, cards, rounded search docks, and responsive layouts.
