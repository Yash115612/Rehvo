# REHVO — Critical Architecture Audit & Application Separation Report

---

## 1. Executive Summary

This architecture audit verifies that the **REHVO codebase is strictly segregated into three independent, decoupled applications** sharing a common Supabase database backend without any cross-application runtime, UI, stylesheet, or route coupling.

```
                                  ┌───────────────────────────┐
                                  │      SUPABASE BACKEND     │
                                  │   (Shared Database & Auth)│
                                  └─────────────┬─────────────┘
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 │                              │                              │
                 ▼                              ▼                              ▼
    ┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
    │     REHVO MOBILE APP    │    │    REHVO PUBLIC WEB     │    │    REHVO ADMIN PANEL    │
    │   (Expo / React Native) │    │        (Next.js)        │    │        (Next.js)        │
    │ ─────────────────────── │    │ ─────────────────────── │    │ ─────────────────────── │
    │ • root app/ & src/      │    │ • web/src/ & web/public │    │ • admin/src/ & public   │
    │ • root package.json     │    │ • web/package.json      │    │ • admin/package.json    │
    │ • StyleSheet tokens     │    │ • Tailwind / globals.css│    │ • Tailwind / globals.css│
    │ • Expo Router           │    │ • Next.js App Router    │    │ • Next.js App Router    │
    └─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
```

---

## 2. Application Ownership Map

### A. Mobile Application (`Expo / React Native`)
- **Root Directory**: `/` (root)
- **App Router Directory**: `app/` (`(renter)`, `(owner)`, `(auth)`, `(tabs)`, `_layout.tsx`)
- **Source Code Directory**: `src/` (`components/`, `theme/`, `lib/`, `store/`, `services/`, `types/`, `data/`)
- **Asset Directory**: `assets/` (`icon.png`, `splash.png`, `adaptive-icon.png`, `brand/`)
- **Package Manifest**: `package.json` (React Native `0.81.5`, Expo `~54.0.37`, Expo Router `~6.0.24`, Zustand, Lucide React Native)

### B. Public Website Application (`Next.js App Router`)
- **Root Directory**: `web/`
- **App Router Directory**: `web/src/app/` (`/rent`, `/commercial`, `/pg-rooms`, `/flatmates`, `/mumbai`, `/property/[slug]`, `/login`, etc.)
- **Source Code Directory**: `web/src/` (`components/home/`, `components/public/`, `components/ui/`, `lib/`, `styles/`)
- **Asset Directory**: `web/public/`
- **Package Manifest**: `web/package.json` (Next.js `14.2.21`, React `18.3.1`, Tailwind CSS, `@supabase/ssr`, Lucide React)

### C. Admin Control Panel (`Next.js App Router`)
- **Root Directory**: `admin/`
- **App Router Directory**: `admin/src/app/` (`/admin`, `/admin/properties`, `/admin/users`, `/admin/verification`, `/admin/visits`, etc.)
- **Source Code Directory**: `admin/src/` (`components/`, `lib/`, `types/`)
- **Asset Directory**: `admin/public/`
- **Package Manifest**: `admin/package.json` (Next.js `14.2.21`, React `18.3.1`, Tailwind CSS, `@supabase/ssr`, Lucide React)

---

## 3. Deep Boundary & Cross-Import Audit Results

An automated scanner script (`scripts/audit_architecture_separation.py`) was executed across every TypeScript/JavaScript file in the repository.

| Check | Search Query / Scope | Result | Status |
| :--- | :--- | :--- | :--- |
| **Next.js in Mobile** | `next/`, `next/image`, `next/navigation`, `next/link` in `app/`, `src/` | **0 occurrences** | ✅ PASS |
| **Web Paths in Mobile** | `../web`, `../../web`, `web/src` in `app/`, `src/` | **0 occurrences** | ✅ PASS |
| **Admin Paths in Mobile** | `../admin`, `../../admin`, `admin/src` in `app/`, `src/` | **0 occurrences** | ✅ PASS |
| **React Native in Web** | `react-native`, `expo-`, `expo-router` in `web/src/` | **0 occurrences** | ✅ PASS |
| **Mobile Paths in Web** | `../src`, `../../src`, `src/components` in `web/src/` | **0 occurrences** | ✅ PASS |
| **Admin Paths in Web** | `../admin`, `../../admin`, `admin/src` in `web/src/` | **0 occurrences** | ✅ PASS |
| **React Native in Admin**| `react-native`, `expo-`, `expo-router` in `admin/src/` | **0 occurrences** | ✅ PASS |
| **Mobile Paths in Admin**| `../src`, `../../src`, `src/components` in `admin/src/` | **0 occurrences** | ✅ PASS |
| **Web Paths in Admin** | `../web`, `../../web`, `web/src` in `admin/src/` | **0 occurrences** | ✅ PASS |

---

## 4. CSS, Styling & Asset Isolation

1. **Global CSS Isolation**:
   - `web/src/app/globals.css` and `web/src/styles/theme.css` are scoped exclusively to the `web/` application.
   - `admin/src/app/globals.css` is scoped exclusively to the `admin/` application.
   - The Expo Mobile app contains **zero** CSS files; it uses React Native `StyleSheet.create` and platform-native theme tokens in `src/theme/colors.ts`.

2. **Asset Directory Isolation**:
   - Mobile assets reside exclusively in `assets/`.
   - Web static assets reside in `web/public/`.
   - Admin static assets reside in `admin/public/`.
   - No cross-app asset imports exist.

3. **Image Pipeline Isolation**:
   - Mobile uses standard React Native `<Image source={{ uri }} />` and Expo Image handlers.
   - Web uses Next.js-optimized `<RehvoImage />` with SVG category fallbacks and responsive `sizes`.

---

## 5. Environment Variables & Secret Scoping

1. **Mobile (`.env.local`)**:
   - Uses `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
   - Only public anon keys are present.

2. **Web (`web/.env.local`)**:
   - Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
   - Only public anon keys are present.

3. **Admin (`admin/.env.local`)**:
   - Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
   - Server-only keys (e.g. `SUPABASE_SERVICE_ROLE_KEY`) are restricted strictly to server execution in `admin/`.

---

## 6. Build & Typecheck Verification Across All 3 Apps

### A. Mobile Application
```bash
npx tsc --noEmit
# Exit Code: 0 (0 errors)
```

### B. Public Web Application
```bash
cd web
npm run typecheck
# Exit Code: 0 (0 errors)

npm run build
# Exit Code: 0 (34/34 routes successfully built)
```

### C. Admin Control Panel
```bash
cd admin
npm run typecheck
# Exit Code: 0 (0 errors)

npm run build
# Exit Code: 0 (20/20 routes successfully built)
```

---

## 7. Operational Guarantee

- When modifying the **Public Website**, edits are strictly confined to `web/`.
- When modifying the **Mobile App**, edits are strictly confined to `app/`, `src/`, and `assets/`.
- When modifying the **Admin Panel**, edits are strictly confined to `admin/`.
- Neither application will leak dependencies, layouts, stylesheets, or routes into any other.
