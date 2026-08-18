# REHVO — Owner/Lister Dashboard Real Metrics & Analytics Audit Report

**Date**: August 18, 2026  
**Target Environments**: Mobile App (Expo Go & Standalone Native APK) & Admin Web  
**Backend**: Supabase South Asia (Mumbai / `ap-south-1`) — `https://xoskechmxzgfajkfpssv.supabase.co`

---

## 1. Executive Summary & Root Cause Analysis

### Previous Issues Identified:
1. **Property Views Had No Tracking Engine**:
   - There was no `property_views` table or event-logging system in Supabase.
   - UI components had hardcoded fallback placeholders (`viewsCount = item.views_count || 128` in [`OwnerPropertiesSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/OwnerPropertiesSection.tsx) and [`OwnerPropertyManagementCard.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/properties/OwnerPropertyManagementCard.tsx)).
   - In [`OwnerPerformanceSnapshot.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/OwnerPerformanceSnapshot.tsx), metrics were completely static: `"1,248"` views, `"36"` enquiries, and `"8 min"` response time.
2. **Enquiries Hardcoded Fallbacks**:
   - `enquiriesCount` fell back to `6` in [`OwnerPropertiesSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/OwnerPropertiesSection.tsx) and [`OwnerPropertyManagementCard.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/properties/OwnerPropertyManagementCard.tsx).
   - In [`OwnerRecentEnquiries.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/OwnerRecentEnquiries.tsx), timestamp was hardcoded as `"10 min ago"`.
   - In [`OwnerDashboardScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/OwnerDashboardScreen.tsx), `enquiriesCount` in Overview Stats only counted pending enquiries rather than total enquiries.
3. **Visits Metric**:
   - In [`OwnerPropertyManagementCard.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/properties/OwnerPropertyManagementCard.tsx), `visitsCount = 2` was hardcoded.

---

## 2. Database Migrations Applied

### Migration `012_property_views.sql`
- **Table**: `public.property_views`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE`
  - `viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL`
  - `session_id TEXT`
  - `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
- **Indexes**:
  - `idx_property_views_property_id`
  - `idx_property_views_viewer_id`
  - `idx_property_views_created_at`
  - `idx_property_views_dedupe`
- **Database Trigger**:
  - `trg_property_view_increment`: Auto-increments `properties.views_count` on valid insertions into `public.property_views`.
- **Database Function (RPC)**:
  - `record_property_view(p_property_id, p_viewer_id, p_session_id)`:
    - **Deduplication Rule**: Maximum 1 view event per viewer/session per property within a 30-minute rolling window.
    - **Owner Exclusion Rule**: Property owners viewing their own properties are excluded from inflating metrics.
- **Row-Level Security (RLS)**:
  - Enabled on `public.property_views`.
  - `INSERT`: Allowed for all users (authenticated or anonymous).
  - `SELECT`: Restricted to the owner of the property (`property_id IN (SELECT id FROM properties WHERE owner_id = auth.uid())`) and active Admins.

### Migration `013_owner_dashboard_metrics.sql`
- **Database Function (RPC)**:
  - `get_owner_dashboard_metrics(p_owner_id UUID)`: Single round-trip database function computing exact real metrics:
    - `total_properties`, `active_properties`, `paused_properties`, `draft_properties`, `rented_properties`
    - `total_views`, `views_this_week`, `views_last_week`
    - `total_enquiries`, `pending_enquiries`, `contacted_enquiries`, `scheduled_enquiries`, `closed_enquiries`
    - `total_visits`, `pending_visits`, `confirmed_visits`, `completed_visits`, `cancelled_visits`
    - `total_saves`

---

## 3. Real Event Pipeline Architecture

```
User opens PropertyDetailsScreen.tsx (app/(renter)/property/[id].tsx)
                ↓
recordPropertyView(property.id, viewer_id)
                ↓
Supabase RPC: public.record_property_view()
   • Check owner: viewer_id != property.owner_id
   • Check deduplication: No view within last 30 minutes
   • Insert into public.property_views
   • Trigger auto-increments public.properties.views_count
                ↓
Owner Opens / Pulls-to-Refresh OwnerDashboardScreen.tsx
                ↓
useAppStore.fetchOwnerMetrics() + fetchMyProperties() + fetchEnquiries() + fetchVisits()
                ↓
Supabase RPC: public.get_owner_dashboard_metrics(owner_id)
                ↓
UI displays 100% genuine database counts (0 if zero, never fabricated)
```

---

## 4. Multi-User Integration Test Results

Verified using live Supabase test accounts against `https://xoskechmxzgfajkfpssv.supabase.co`:
- **Owner User A**: `rehvo.beta.test.1787039625735@gmail.com` (`ID: a7417958-b492-4bef-af69-5ceacb270113`)
- **Renter User B**: `rehvo.beta.test.1787039573606@gmail.com` (`ID: 474f5b91-d467-4447-9222-191fe9014a31`)
- **Test Property**: `Premium Sea-Facing 2 BHK Bandra West` (`ID: d65e9b6c-67b2-4f40-91c8-9f4d3b918c19`)

| Test Scenario | Action | Expected Behavior | Database Result | Status |
|---|---|---|---|:---:|
| **1. Legitimate View Recording** | User B views Owner A property | RPC inserts row in `property_views` & increments `views_count` | `true`, `views_count = 1` | **PASS** |
| **2. View Deduplication** | User B views property again within 30 min | Deduplication rejects duplicate view increment | `false`, count unchanged | **PASS** |
| **3. Owner Self-View Prevention** | Owner A views own property | Owner view rejected from inflating metrics | `false`, count unchanged | **PASS** |
| **4. Real Enquiry Creation** | User B submits enquiry | Row inserted in `public.enquiries` with `owner_id = Owner A` | `status: pending` row created | **PASS** |
| **5. Enquiry Status Progression** | Owner A replies to enquiry | Row updated in `public.enquiries` with `status: replied` | `status: replied` (`CONTACTED` in app) | **PASS** |
| **6. Aggregated Metrics RPC** | `get_owner_dashboard_metrics` called | Exact breakdown of properties, views, enquiries, visits | Matches exact DB row counts | **PASS** |
| **7. Privacy & RLS Scoping** | User B queries Owner A view logs | Supabase RLS returns 0 rows to unauthorized users | `0 rows returned` | **PASS** |

---

## 5. Audit of All Owner/Lister Dashboard Metrics

| Metric | Source Table & Column | Scoping Condition | Aggregation Rule | Status |
|---|---|---|---|:---:|
| **Active Listings** | `public.properties.status` | `owner_id = auth.uid()` | `COUNT(*) WHERE status = 'published'` | **PASS** |
| **Draft Properties** | `public.properties.status` | `owner_id = auth.uid()` | `COUNT(*) WHERE status = 'draft'` | **PASS** |
| **Paused Properties** | `public.properties.status` | `owner_id = auth.uid()` | `COUNT(*) WHERE status = 'paused'` | **PASS** |
| **Total Properties** | `public.properties` | `owner_id = auth.uid()` | `COUNT(*)` | **PASS** |
| **Total Property Views** | `public.property_views` / `properties.views_count` | `properties.owner_id = auth.uid()` | `SUM(views_count)` from live events | **PASS** |
| **Views This Week** | `public.property_views.created_at` | `properties.owner_id = auth.uid()` | `COUNT(*) WHERE created_at >= NOW() - 7d` | **PASS** |
| **Total Enquiries** | `public.enquiries` | `owner_id = auth.uid()` | `COUNT(*)` | **PASS** |
| **Pending Enquiries** | `public.enquiries.status` | `owner_id = auth.uid()` | `COUNT(*) WHERE status = 'pending'` | **PASS** |
| **Contacted Enquiries** | `public.enquiries.status` | `owner_id = auth.uid()` | `COUNT(*) WHERE status = 'replied'` | **PASS** |
| **Upcoming / Pending Visits** | `public.visits.status` | `owner_id = auth.uid()` | `COUNT(*) WHERE status = 'pending'` | **PASS** |
| **Total Visits** | `public.visits` | `owner_id = auth.uid()` | `COUNT(*)` | **PASS** |
| **Saved / Bookmarked Count** | `public.properties.saves_count` | `owner_id = auth.uid()` | `SUM(saves_count)` | **PASS** |

---

## 6. Codebase Quality & Typecheck Verification

- Mobile TypeScript (`npx tsc --noEmit`): **0 errors**
- Admin TypeScript (`cd admin && npm run typecheck`): **0 errors**
- Admin Next.js Production Build (`cd admin && npm run build`): **0 errors** (20/20 static pages compiled)
- No mock, seed, or hardcoded fallbacks remain in the owner dashboard pipeline.
