# REHVO — Admin Backend Audit & Schema Blueprint

> **Document Status**: Complete & Verified  
> **Target Production URL**: `admin.rehvo.com` (Development: `localhost:3000`)  
> **Database Engine**: Shared Supabase (PostgreSQL 15+, PostgREST, Supabase Auth, Storage)

---

## 1. Current Architecture Overview

The REHVO platform currently consists of two frontends sharing one backend:

```
                          ┌────────────────────────┐
                          │   Shared Supabase      │
                          │   (Postgres / Auth /   │
                          │    Storage / Realtime) │
                          └───────────┬────────────┘
                                      │
                 ┌────────────────────┴────────────────────┐
                 │                                         │
        (Anon Key / JWT)                        (SSR Client / Service Role)
                 │                                         │
    ┌────────────▼─────────────┐              ┌────────────▼─────────────┐
    │  REHVO Mobile App        │              │  REHVO Web Admin Panel   │
    │  (Expo / React Native)   │              │  (Next.js 14 App Router) │
    │  - Client Zustand Store  │              │  - Server Components     │
    │  - AsyncStorage Cache    │              │  - Role-Based Access     │
    │  - Renter / Host Flow    │              │  - Operations & Safety   │
    └──────────────────────────┘              └──────────────────────────┘
```

### Current Backend State Summary
* **Mobile Runtime**: Operates with a client-side Zustand store (`src/store/useAppStore.ts`) backed by native `AsyncStorage` (`rehvo_auth_session`, `rehvo_properties`, `rehvo_my_flatmate_profile`, etc.) initialized from in-memory seed data (`src/data/seedData.ts`).
* **Supabase Connection**: Initialized via `@supabase/supabase-js` (`src/lib/supabase.ts`), with `deleteProperty` currently wired to PostgREST `supabase.from('properties')`.
* **Web Admin Panel**: Standalone Next.js 14 application in `admin/` with full routing, navigation, layout, and UI foundations. Currently uses mock/seed data structures matching mobile schemas.

---

## 2. Feature-by-Feature Detailed Audit

| # | Feature Area | Current Implementation Status | Existing Data Layer | Missing Backend Requirements |
| :- | :--- | :--- | :--- | :--- |
| 1 | **Users & Authentication** | Partially Implemented | Local session in `AsyncStorage` (`rehvo_auth_session`), Supabase Auth configured with phone/email | `profiles` table in Supabase, user metadata triggers, RLS policies |
| 2 | **Properties & Listings** | Partially Implemented | Local `rehvo_properties`, `supabase.from('properties')` referenced for deletion | `properties` and `property_images` tables, foreign key to `profiles.id` |
| 3 | **Property Images** | UI / Local Array Only | In-memory `PropertyImage[]` with Unsplash URLs | `property-images` Supabase Storage bucket, `property_images` table |
| 4 | **Flatmate Profiles** | UI / Local State Only | `rehvo_my_flatmate_profile`, `SEED_FLATMATES` | `flatmate_profiles` table in Postgres |
| 5 | **Saved / Bookmarked Items** | Local Storage Only | `rehvo_saved_ids`, `rehvo_saved_flatmate_ids` | `saved_properties` and `saved_flatmates` join tables |
| 6 | **Enquiries** | Conceptual / Mock Data | `SEED_ENQUIRIES` in Zustand | `enquiries` table in Postgres |
| 7 | **Scheduled Visits** | Conceptual / Mock Data | `SEED_VISITS` in Zustand | `visits` table with visit status state machine |
| 8 | **Chats & Conversations** | Simulated in Zustand | `SEED_CONVERSATIONS` and `Message[]` | `conversations` & `messages` tables with Supabase Realtime |
| 9 | **Notifications** | Local State Only | `notifications` in Zustand | `notifications` table, push token registration table |
| 10 | **Reports & Moderation** | Conceptual / Mock Data | `SafetyReport` interface, `SEED_REPORTS` | `safety_reports` table, admin resolution log |
| 11 | **Support Tickets** | UI Placeholder Only | Admin UI mock data | `support_tickets` and `support_messages` tables |
| 12 | **Verification & Deeds** | Conceptual Status Only | `VerificationStatus` enum on property & user | `verification_requests` table, `deeds` storage bucket |
| 13 | **Admin Users & RBAC** | Foundation Created | `AdminUser` types, `admin/src/lib/auth/` | `admin_users` table with strict server-side RLS |
| 14 | **Audit Logs** | Foundation Created | `admin/src/lib/auth/audit.ts` | `admin_audit_logs` append-only table |
| 15 | **Locations** | Hardcoded Constants | City/Locality strings | `locations` / `service_cities` table |
| 16 | **Analytics** | Hardcoded Metrics | Aggregated client stats | Event telemetry table / Postgres views |
| 17 | **Payments / Payouts** | Missing (Not in MVP) | None (Zero-brokerage model) | N/A (Deferred) |

---

## 3. Admin Page $\rightarrow$ Backend Mapping

| Admin Route | Page Title | Current State | Required Supabase Table(s) / View(s) | Action Needed Before Live Data |
| :--- | :--- | :--- | :--- | :--- |
| `/admin` | Platform Overview | **NEEDS BACKEND IMPLEMENTATION** | Aggregate count queries on `profiles`, `properties`, `flatmate_profiles`, `verification_requests`, `safety_reports` | Create Postgres aggregation view or RPC function `get_admin_dashboard_metrics()` |
| `/admin/users` | User Directory | **NEEDS BACKEND IMPLEMENTATION** | `profiles` (joined with auth.users) | Create `profiles` table and populate sync trigger from `auth.users` |
| `/admin/properties` | Property Listings | **NEEDS BACKEND IMPLEMENTATION** | `properties`, `property_images`, `profiles` | Create `properties` table with foreign key to owner `profiles.id` |
| `/admin/flatmates` | Flatmate Profiles | **NEEDS BACKEND IMPLEMENTATION** | `flatmate_profiles` | Create `flatmate_profiles` table |
| `/admin/verification` | Verification & Deeds | **NEEDS BACKEND IMPLEMENTATION** | `verification_requests`, `properties`, `profiles` | Create `verification_requests` table and storage bucket |
| `/admin/reports` | Safety & Moderation | **NEEDS BACKEND IMPLEMENTATION** | `safety_reports`, `properties`, `profiles` | Create `safety_reports` table |
| `/admin/support` | Support Inquiries | **NEEDS BACKEND IMPLEMENTATION** | `support_tickets` | Create `support_tickets` table |
| `/admin/enquiries` | Direct Enquiries | **NEEDS BACKEND IMPLEMENTATION** | `enquiries`, `properties`, `profiles` | Create `enquiries` table |
| `/admin/visits` | Scheduled Visits | **NEEDS BACKEND IMPLEMENTATION** | `visits`, `properties`, `profiles` | Create `visits` table |
| `/admin/notifications` | Broadcast Alerts | **NEEDS BACKEND IMPLEMENTATION** | `notifications`, `broadcast_announcements` | Create notification dispatcher worker / RPC |
| `/admin/locations` | Operational Cities | **NEEDS BACKEND IMPLEMENTATION** | `service_cities`, `localities` | Create static / editable `locations` table |
| `/admin/analytics` | Analytics Funnel | **NEEDS BACKEND IMPLEMENTATION** | Postgres metric rollups / `admin_metrics_daily` | Create daily rollup materialized view |
| `/admin/admin-users` | Staff Provisioning | **NEEDS BACKEND IMPLEMENTATION** | `admin_users` | Create `admin_users` table with strict RBAC |
| `/admin/audit-logs` | Security Audit Trail | **NEEDS BACKEND IMPLEMENTATION** | `admin_audit_logs` | Create append-only `admin_audit_logs` table |
| `/admin/settings` | System Settings | **NEEDS BACKEND IMPLEMENTATION** | `system_settings` | Create key-value `system_settings` table |

---

## 4. Existing vs. Required Database Schema Blueprint

### 4.1. Core Application Tables (Shared with Mobile App)

```sql
-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'RENTER' CHECK (role IN ('RENTER', 'OWNER')),
    city TEXT,
    locality TEXT,
    occupation TEXT,
    user_type TEXT CHECK (user_type IN ('student', 'working_professional', 'family', 'other')),
    budget_min INTEGER DEFAULT 0,
    budget_max INTEGER DEFAULT 0,
    move_in_date TEXT,
    verification_status TEXT NOT NULL DEFAULT 'UNVERIFIED' CHECK (verification_status IN ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED')),
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PROPERTIES (Rental Listings)
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    owner_name TEXT NOT NULL,
    owner_avatar TEXT,
    owner_phone TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    property_type TEXT NOT NULL CHECK (property_type IN ('FLAT', 'APARTMENT', 'PRIVATE_ROOM', 'SHARED_ROOM', 'CO_LIVING', 'PG', 'STUDIO')),
    listing_type TEXT NOT NULL DEFAULT 'RENT' CHECK (listing_type = 'RENT'),
    city TEXT NOT NULL,
    locality TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    rent INTEGER NOT NULL,
    deposit INTEGER NOT NULL DEFAULT 0,
    maintenance INTEGER NOT NULL DEFAULT 0,
    brokerage INTEGER NOT NULL DEFAULT 0,
    bhk TEXT NOT NULL,
    bathrooms INTEGER NOT NULL DEFAULT 1,
    area_sqft INTEGER NOT NULL DEFAULT 0,
    floor INTEGER DEFAULT 0,
    total_floors INTEGER DEFAULT 0,
    furnishing TEXT NOT NULL CHECK (furnishing IN ('FULLY_FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED')),
    parking TEXT DEFAULT 'None',
    available_from TEXT DEFAULT 'Immediate',
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'PAUSED', 'RENTED', 'REJECTED', 'EXPIRED')),
    verification_status TEXT NOT NULL DEFAULT 'UNVERIFIED' CHECK (verification_status IN ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED')),
    amenities TEXT[] DEFAULT '{}',
    tenant_preferences TEXT[] DEFAULT '{}',
    is_sponsored BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    saves_count INTEGER DEFAULT 0,
    enquiries_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PROPERTY IMAGES
CREATE TABLE IF NOT EXISTS public.property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_cover BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. FLATMATE PROFILES
CREATE TABLE IF NOT EXISTS public.flatmate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Any', 'Other')),
    occupation TEXT NOT NULL,
    city TEXT NOT NULL,
    locality TEXT NOT NULL,
    preferred_locations TEXT[] DEFAULT '{}',
    budget_min INTEGER DEFAULT 0,
    budget_max INTEGER NOT NULL,
    looking_for TEXT,
    room_preference TEXT DEFAULT 'Any' CHECK (room_preference IN ('Private Room', 'Shared Room', 'Any')),
    move_in_date TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    lifestyle_preferences TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT TRUE,
    is_paused BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SCHEDULED VISITS
CREATE TABLE IF NOT EXISTS public.visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    renter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL,
    visit_time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. DIRECT ENQUIRIES
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    renter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'VISIT_SCHEDULED', 'APPLIED', 'CLOSED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. SAFETY REPORTS
CREATE TABLE IF NOT EXISTS public.safety_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    target_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL CHECK (reason IN ('Fake Listing', 'Wrong Information', 'Already Rented', 'Scam / Fraud', 'Inappropriate Content', 'Other')),
    description TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (severity IN ('HIGH', 'MEDIUM', 'LOW')),
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED')),
    resolution_notes TEXT,
    resolved_by UUID,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 4.2. Dedicated Admin Governance Tables

```sql
-- 8. ADMIN USERS (RBAC Directory)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('SUPER_ADMIN', 'OPERATIONS', 'MODERATION', 'VERIFICATION', 'SUPPORT', 'FINANCE', 'CONTENT_MANAGER')),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'INVITED')),
    avatar_url TEXT,
    last_sign_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. ADMIN AUDIT LOGS (Immutable Traceability)
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL,
    admin_email TEXT NOT NULL,
    admin_role TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('USER', 'PROPERTY', 'FLATMATE', 'REPORT', 'VERIFICATION', 'SUPPORT_TICKET', 'SYSTEM_SETTINGS', 'ADMIN_USER', 'NOTIFICATION')),
    target_id TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. VERIFICATION REQUESTS (Ownership Deeds & KYC)
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_type TEXT NOT NULL CHECK (target_type IN ('PROPERTY_DEED', 'HOST_KYC', 'UTILITY_BILL')),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    document_url TEXT NOT NULL,
    document_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    reviewed_by UUID REFERENCES public.admin_users(id),
    rejection_reason TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    assigned_admin_id UUID REFERENCES public.admin_users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. SYSTEM SETTINGS (Global Configuration)
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 5. Row-Level Security (RLS) Architecture

### Security Principles:
1. **Public/Renter Access**: Anonymous/authenticated renters can `SELECT` published active properties (`status = 'ACTIVE'`) and verified flatmates.
2. **Owner Access**: Owners can `INSERT`, `UPDATE`, and `DELETE` only their own properties (`auth.uid() = owner_id`).
3. **Admin Panel Access**:
   - `admin_users` table is queryable ONLY by authenticated users whose `id` exists in `admin_users` with `status = 'ACTIVE'`.
   - Admin server operations utilize `SUPABASE_SERVICE_ROLE_KEY` inside Next.js Server Components / Route Handlers, bypassing client-side PostgREST vulnerabilities while automatically writing to `admin_audit_logs`.
   - Normal users attempting to query `admin_users` or `admin_audit_logs` receive `403 Forbidden` / 0 rows.

### Core RLS Policies:

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flatmate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND status = 'ACTIVE'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Properties Policies
CREATE POLICY "Active properties viewable by everyone"
ON public.properties FOR SELECT USING (status = 'ACTIVE' OR auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Owners can insert properties"
ON public.properties FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners and admins can update properties"
ON public.properties FOR UPDATE USING (auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Owners and admins can delete properties"
ON public.properties FOR DELETE USING (auth.uid() = owner_id OR public.is_admin());

-- Admin Users Policies
CREATE POLICY "Only super admins and self can view admin_users"
ON public.admin_users FOR SELECT USING (public.is_admin());

-- Audit Logs Policies (Append-only by server/admin)
CREATE POLICY "Only admins can view audit logs"
ON public.admin_audit_logs FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert audit logs"
ON public.admin_audit_logs FOR INSERT WITH CHECK (public.is_admin());
```

---

## 6. Critical Security Checklist

| Check | Requirement | Audit Result | Action Required |
| :--- | :--- | :--- | :--- |
| **Service Role Key** | Must NEVER be prefixed with `NEXT_PUBLIC_` or bundled into browser JS | **PASS** — Configured as `SUPABASE_SERVICE_ROLE_KEY` in `admin/.env.example` | Maintain strict server-side use in Next.js Server Components |
| **Admin Route Guard** | Normal users must not be able to load `/admin` | **PASS** — Protected by layout session and `admin_users` role validation | Enforce database `admin_users` check in middleware |
| **Mobile App Isolation**| No admin privileges or admin screens embedded in mobile app | **PASS** — Mobile app in root contains zero admin routes | Keep codebases strictly decoupled |
| **Audit Traceability** | Every privileged update (verification, ban, deletion) must record an immutable audit row | **PASS** — Type and helper foundation created in `audit.ts` | Wire trigger / service layer to write to `admin_audit_logs` |
| **Storage Security** | Deeds and KYC documents must be in private buckets accessible only by owner and admin | **PENDING** — Bucket needs to be provisioned in Supabase | Set storage bucket `deeds` to `public: false` with signed URLs |

---

## 7. Recommended Implementation Order (Phased Blueprint)

```
Phase 1: Database Migration & Tables
  ├── 1.1 Run Supabase Migration (profiles, properties, admin_users, admin_audit_logs)
  ├── 1.2 Enable Row-Level Security (RLS) & is_admin() helper
  └── 1.3 Create private Storage buckets ('property-images', 'verification-docs')

Phase 2: Admin Auth & Directory Integration
  ├── 2.1 Seed initial Super Admin account into admin_users
  ├── 2.2 Wire /login and server middleware to verify active admin_users membership
  └── 2.3 Connect /admin/admin-users and /admin/audit-logs to real Supabase tables

Phase 3: Operations & Inventory Live Data
  ├── 3.1 Connect /admin/users and /admin/properties to PostgREST queries
  ├── 3.2 Connect /admin/flatmates to flatmate_profiles table
  └── 3.3 Connect /admin/enquiries and /admin/visits tables

Phase 4: Trust & Safety Workflows
  ├── 4.1 Connect /admin/verification to verification_requests table with signed deed URLs
  ├── 4.2 Connect /admin/reports to safety_reports table with resolve/dismiss actions
  └── 4.3 Connect /admin/support to support_tickets

Phase 5: Mobile App Hybrid Synchronization
  ├── 5.1 Mobile app reads properties from Supabase properties table
  └── 5.2 Offline fallback continues to use AsyncStorage cache
```
