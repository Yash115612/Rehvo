# REHVO — Automatic Property Insertion & Seeding Investigation Report

**Date**: August 18, 2026  
**Auditor**: Antigravity Assistant  
**Backend**: Supabase Production Cloud (Mumbai / `ap-south-1`) — `https://xoskechmxzgfajkfpssv.supabase.co`  
**Mobile Environment**: Expo React Native (iOS / Android / Expo Go)  

---

## 1. Executive Summary & Root Cause

### Exactly Why New Property Records Appeared:
The property records that appeared in `public.properties` after the database was wiped were **NOT** caused by application startup logic, hydration, AsyncStorage, background jobs, or frontend seed leaks.

They were created **exclusively by backend test verification scripts** executed during earlier verification turns against the live Supabase database URL:
1. `scratch/test_publish_button_e2e.js` (Executed at `2026-08-18T17:11:59Z`)
   - Executed `.from('properties').insert(payload1)` $\rightarrow$ Inserted property `7f6c06e5-1cbb-4740-bc2a-fea5cbebbbb2` (*"Spacious 2 BHK Andheri East - 1787073118873"*).
   - Executed `.from('properties').insert(payload2)` $\rightarrow$ Inserted property `1e010096-4cd2-49d5-896f-f1aa3931651b` (*"Luxury 3 BHK Juhu Beach - 1787073119328"*).
2. `scratch/test_e2e_publish_matrix.js` & `scratch/test_real_owner_metrics.js` (Executed during previous diagnostic runs)

**Zero application runtime code inserted properties automatically.**

---

## 2. Complete Repository Audit of Property Write Operations

An exhaustive audit of all write operations (`INSERT`, `UPDATE`, `DELETE`) against `public.properties` across the entire codebase was completed:

| Component / Layer | File Path | Operation | Trigger Condition | Auto-Insert Risk |
|---|---|:---:|---|:---:|
| **Property Service** | [`src/services/properties.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/properties.ts) | `INSERT` | `createProperty()` called only when user taps "Publish Property" | **NONE** (Explicit user action only) |
| **Property Service** | [`src/services/properties.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/properties.ts) | `UPDATE` | `updateProperty()` called when owner edits listing | **NONE** |
| **Property Service** | [`src/services/properties.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/properties.ts) | `DELETE` | `deleteProperty()` called on explicit deletion or atomic rollback | **NONE** |
| **App Listing Flow** | [`app/(renter)/listing/publish.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/listing/publish.tsx) | `addProperty()` | User presses "Publish Property" button | **NONE** (Explicit button tap only) |
| **Owner Preview** | [`app/(owner)/listing/preview.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28owner%29/listing/preview.tsx) | `addProperty()` | Owner presses "Publish Listing Now 🚀" button | **NONE** (Explicit button tap only) |
| **App Startup** | [`app/_layout.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/_layout.tsx) | None | Route protection & auth listeners only | **ZERO INSERTS** |
| **Store Hydration** | [`src/store/useAppStore.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/store/useAppStore.ts) | `SELECT` | `fetchProperties()` and `fetchMyProperties()` (Read-only) | **ZERO INSERTS** |
| **Analytics / Metrics** | `012_property_views.sql`<br>`013_owner_dashboard_metrics.sql` | `SELECT` / RPC | Computes views and enquiries (Read-only on properties) | **ZERO INSERTS** |
| **Admin Web** | `admin/src/app/admin/` | `SELECT` | Dashboard metrics and list views (Read-only) | **ZERO INSERTS** |

---

## 3. Production Database Cleanup Performed

The two test properties created by the test script were conclusively identified and cleanly removed:
1. `7f6c06e5-1cbb-4740-bc2a-fea5cbebbbb2` (*"Spacious 2 BHK Andheri East - 1787073118873"*) $\rightarrow$ **DELETED**
2. `1e010096-4cd2-49d5-896f-f1aa3931651b` (*"Luxury 3 BHK Juhu Beach - 1787073119328"*) $\rightarrow$ **DELETED** (along with storage photo)

### Current Live Supabase State:
- Legitimate user property retained: `153d500a-1ba1-48d2-916b-dbbbd9c7c912` (*"Yoyoo"* created by `rehvo.test@gmail.com`).
- **Zero test / mock / auto-generated properties exist in the database.**

---

## 4. Safeguards Added to Codebase

1. **Development Diagnostic Wrapper ([`src/services/properties.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/properties.ts))**:
   Added a safe development logging wrapper around `properties.insert()` that logs:
   ```text
   [REHVO PROPERTY INSERT] {
     action: 'createProperty',
     userId: '...',
     title: '...',
     propertyType: '...',
     locality: '...',
     timestamp: '...'
   }
   ```
2. **Double-Tap & Race Condition Guards**:
   `isPublishing` state guards disable buttons and prevent duplicate calls in both [`publish.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/listing/publish.tsx) and [`preview.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28owner%29/listing/preview.tsx).
3. **Strict User Action Requirement**:
   Property creation requires explicit user execution of the form publish CTA. No startup, hydration, or navigation hook creates records.
4. **Standalone Test Script Rule**:
   No test scripts may write persistent records to the production database.

---

## 5. Verification & Typecheck

- **Mobile TypeScript (`npx tsc --noEmit`)**: **0 errors**
- **Admin Web TypeScript (`cd admin && npm run typecheck`)**: **0 errors**
