# REHVO — SEO Phase 1.5: Public Web + Admin Architecture Audit Report

**Date**: August 19, 2026  
**Auditor**: Antigravity Assistant  
**Platforms Audited**:
1. **REHVO Mobile App** (`/` root — React Native Expo)
2. **REHVO Public SEO Web Platform** (`web/` — Next.js 14 App Router)
3. **REHVO Admin Control Panel** (`admin/` — Next.js 14 App Router)

**Build & Compilation Status**: **100% CLEAN (0 errors across all 3 platforms)**

---

## 1. Executive Summary: Architectural Audit & Clean Decoupling

Following the implementation of the SEO Phase 1 platform, an architectural audit identified that public SEO routes and admin control features were co-located in the `admin/` directory.

To ensure **strict domain isolation**, **zero privilege leakage**, and **clean independent deployments**, the architecture was decoupled into two distinct Next.js applications sharing the same live Supabase backend:

```
                          ┌──────────────────────────┐
                          │   Live Supabase DB       │
                          │   (Postgres, Auth, RLS)  │
                          └─────────────┬────────────┘
                                        │
           ┌────────────────────────────┼───────────────────────────┐
           ▼                            ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│   REHVO Mobile App   │    │  REHVO Public Web    │    │  REHVO Admin Panel   │
│   (React Native)     │    │  (Next.js 14 SSR)    │    │  (Next.js 14 Control)│
│   Root Directory     │    │  Directory: web/     │    │  Directory: admin/   │
│   iOS / Android      │    │  Domain: rehvo.com   │    │  admin.rehvo.com     │
└──────────────────────┘    └──────────────────────┘    └──────────────────────┘
```

---

## 2. Directory Structure & App Locations

### 1. REHVO Mobile App
- **Location**: Root directory (`/Users/yashchoudhary/Downloads/rehvo/`)
- **Key Files**: `app/`, `src/`, `app.json`, `package.json`, `eas.json`
- **Typecheck Command**: `npm run typecheck` (`npx tsc --noEmit`)

### 2. REHVO Public SEO Web Platform
- **Location**: `/Users/yashchoudhary/Downloads/rehvo/web/`
- **Target Domain**: `https://rehvo.com`
- **Scope**: Exclusively public, indexable SEO routes backed by SSR/ISR:
  - `/` (Homepage)
  - `/mumbai/` (City Hub)
  - `/mumbai/[locality]/` (Locality landing pages)
  - `/mumbai/[locality]/flats-for-rent/`
  - `/mumbai/[locality]/rooms-for-rent/`
  - `/mumbai/[locality]/pg/`
  - `/mumbai/[locality]/studios-for-rent/`
  - `/property/[slug]/` (Canonical Property detail pages)
  - `/flatmates/[city]/` (Roommate discovery)
  - `/pg/[city]/` (PG & Co-living)
  - `/about/` & `/contact/`
  - `/sitemap.xml` & `/robots.txt`
- **Build / Dev Commands**: `npm run web:dev`, `npm run web:typecheck`, `npm run web:build`

### 3. REHVO Admin Control Panel
- **Location**: `/Users/yashchoudhary/Downloads/rehvo/admin/`
- **Target Domain**: `https://admin.rehvo.com`
- **Scope**: Exclusively private administrative management routes:
  - `/` $\rightarrow$ Redirects to `/admin`
  - `/login` (Admin authentication)
  - `/admin` (Executive Dashboard)
  - `/admin/users`, `/admin/properties`, `/admin/verification`, `/admin/flatmates`
  - `/admin/enquiries`, `/admin/visits`, `/admin/reports`, `/admin/support`
  - `/admin/notifications`, `/admin/locations`, `/admin/analytics`, `/admin/admin-users`, `/admin/audit-logs`, `/admin/settings`
- **Build / Dev Commands**: `npm run admin:dev`, `npm run admin:typecheck`, `npm run admin:build`

---

## 3. Route Collision Analysis

| Path | `web/` (rehvo.com) | `admin/` (admin.rehvo.com) | Collision Risk |
|---|---|---|:---:|
| **`/`** | Public SEO Homepage | Redirects to `/admin` | **None (Separated Domains)** |
| **`/admin/*`** | Returns `404 Not Found` | Admin Management Screens | **None (Isolated)** |
| **`/login`** | Returns `404 Not Found` | Admin Login Screen | **None (Isolated)** |
| **`/property/*`** | Public Property SEO Page | Admin property management at `/admin/properties` | **None** |
| **`/mumbai/*`** | Locality & City Landing Pages | Not present in admin | **None** |
| **`/sitemap.xml`**| Dynamic public XML sitemap | Not present in admin | **None** |
| **`/robots.txt`** | Public crawler rules | Disallows all crawling | **None** |

---

## 4. Supabase Client & Secret Security Audit

1. **Public Web (`web/`)**:
   - Strictly uses `createPublicClient()` with `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (`public-anon` key).
   - **`SUPABASE_SERVICE_ROLE_KEY` is completely absent** from `web/.env.local`, `web/next.config.js`, and client JS bundles.
   - Owner private phone numbers, Aadhaar/identity verification documents, and internal staff notes are never queried or transmitted in public SSR output.
2. **Admin Panel (`admin/`)**:
   - Uses server-side admin client (`admin-service.ts`) with service-role security strictly on the server layer for admin overrides.

---

## 5. Build & Typecheck Verification Matrix

| Application | Command | Result | Output Details |
|---|---|:---:|---|
| **Mobile App** | `npx tsc --noEmit` | **PASS** | 0 TypeScript errors |
| **Public Web App** | `cd web && npm run typecheck` | **PASS** | 0 TypeScript errors |
| **Public Web App** | `cd web && npm run build` | **PASS** | 9 static pages + dynamic SSR routes generated |
| **Admin Panel** | `cd admin && npm run typecheck` | **PASS** | 0 TypeScript errors |
| **Admin Panel** | `cd admin && npm run build` | **PASS** | 20 static admin management pages generated |

---

## 6. Recommended Vercel / Cloud Deployment Configuration

Deploy the repository as **Two Independent Vercel Projects**:

### Project 1: REHVO Public Web
- **Root Directory**: `web`
- **Domain**: `rehvo.com` (and `www.rehvo.com`)
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL=https://xoskechmxzgfajkfpssv.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon_key>`
  - `NEXT_PUBLIC_APP_URL=https://rehvo.com`

### Project 2: REHVO Admin Control Panel
- **Root Directory**: `admin`
- **Domain**: `admin.rehvo.com`
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL=https://xoskechmxzgfajkfpssv.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon_key>`
  - `NEXT_PUBLIC_APP_URL=https://admin.rehvo.com`
  - `SUPABASE_SERVICE_ROLE_KEY=<service_role_key>` (Server-only)

---

## 7. Next Steps & Readiness for SEO Phase 2

- **Blockers Identified**: **NONE**.
- The architecture is decoupled, securely partitioned, and verified ready for **SEO Phase 2** (expanded programmatic locality landing pages, filter clusters, and performance benchmarking).
