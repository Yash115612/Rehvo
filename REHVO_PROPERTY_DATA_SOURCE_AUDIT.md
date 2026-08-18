# REHVO — Property Data Source & Isolation Audit Report

**Date**: August 18, 2026  
**Auditor**: Antigravity Assistant  
**Backend**: Supabase Production Cloud (Mumbai / `ap-south-1`) — `https://xoskechmxzgfajkfpssv.supabase.co`  
**Mobile Environment**: Expo React Native (iOS / Android / Expo Go)  

---

## 1. Inventory of Properties in Live Supabase Database

An exhaustive audit of `public.properties` was performed on the live database.  
**Total properties existing in the database**: **5 records** (Zero mock or seed records).

| # | Property Title | Type | Locality, City | Rent | Status | Created At (UTC) | Owner Email & ID | Origin / Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | **Cozy Studio Apartment Bandra - 1787072042704** | `studio` | Bandra West, Mumbai | ₹32,000 | `published` | 2026-08-18 16:54:02 | `rehvo.beta.test.1787039625735@gmail.com`<br>`a7417958-b492-4bef-af69-5ceacb270113` | Created during E2E verification matrix (Zero image test) |
| 2 | **Sea-Facing 3 BHK Marine Drive - 1787072041736** | `flat` | Marine Drive, Mumbai | ₹1,25,000 | `published` | 2026-08-18 16:54:02 | `rehvo.beta.test.1787039625735@gmail.com`<br>`a7417958-b492-4bef-af69-5ceacb270113` | Created during E2E verification matrix (Image upload test) |
| 3 | **Test Published 2 BHK Khar West** | `flat` | Khar West, Mumbai | ₹65,000 | `published` | 2026-08-18 16:50:46 | `rehvo.beta.test.1787039625735@gmail.com`<br>`a7417958-b492-4bef-af69-5ceacb270113` | Created during publishing flow diagnostic run |
| 4 | **Premium Sea-Facing 2 BHK Bandra West** | `flat` | Bandra West, Mumbai | ₹85,000 | `published` | 2026-08-18 16:18:05 | `rehvo.beta.test.1787039625735@gmail.com`<br>`a7417958-b492-4bef-af69-5ceacb270113` | Created during real owner metrics verification test |
| 5 | **Yoyoo** | `flat` | Andheri West, Mumbai | ₹35,000 | `published` | 2026-08-18 15:41:34 | `rehvo.test@gmail.com`<br>`72c7850d-6fae-4275-aad4-107fce310691` | Manually created property via Mobile App Listing Form |

---

## 2. Why Unexpected Properties Were Appearing to Users

### Root Cause 1: Intentional Public Marketplace Feed vs. Private Owner Dashboard
- **Public Discovery (`Home`, `Search`, `Rent`, `PG`, `Rooms`, `Studios`)**:
  - The Home and Search feeds are designed as a **public real-estate marketplace**. They fetch all active published listings (`status = 'published'`) across Mumbai using `propertyService.getPublishedProperties()`.
  - When the user logged in as `rehvo.test@gmail.com` (creator of `"Yoyoo"`), the Home and Search feeds displayed all 5 published properties (including the 4 properties listed by `rehvo.beta.test.1787039625735@gmail.com`). This is the intended behavior for public browsing.

### Root Cause 2: Single-Array Store Mixing Public & Private Listings
- In [`src/store/useAppStore.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/store/useAppStore.ts), both public discovery listings and owner listings previously shared a single `properties: Property[]` array.
- When `fetchMyProperties()` and `fetchProperties()` executed, they merged results into `get().properties`.
- Owner components like `OwnerDashboardScreen` and `OwnerMyPropertiesScreen` had to rely on client-side filter expressions like `properties.filter(p => p.owner_id === user.id || ...)`.

### Root Cause 3: Stale Properties Retained in AsyncStorage on Logout
- When a user logged out, `logout()` cleared user session state but did not remove `rehvo_properties` from `AsyncStorage` or reset `properties: []`.
- If an account switch occurred on the same device, old cached properties from previous sessions remained present in local memory until overwritten.

---

## 3. Architecture & Codebase Fixes Applied

### 1. Strict State Separation in Zustand ([`src/store/useAppStore.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/store/useAppStore.ts))
- Separated `myProperties: Property[]` from `properties: Property[]`:
  - `properties`: Exclusively holds public discovery properties returned from `getPublishedProperties()`.
  - `myProperties`: Exclusively holds properties created by the current authenticated user returned from `getMyProperties(user.id)`.
- Updated `fetchMyProperties`:
  ```typescript
  fetchMyProperties: async () => {
    const { user } = get();
    if (!user?.id) {
      set({ myProperties: [] });
      return [];
    }
    const res = await propertyService.getMyProperties(user.id);
    if (res.success && res.data) {
      set({ myProperties: res.data });
      setItem('rehvo_my_properties', JSON.stringify(res.data));
      return res.data;
    }
    return get().myProperties;
  }
  ```
- Updated `fetchProperties`:
  ```typescript
  fetchProperties: async (filter) => {
    const res = await propertyService.getPublishedProperties(filter);
    if (res.success && res.data) {
      set({ properties: res.data });
      setItem('rehvo_properties', JSON.stringify(res.data));
      return res.data;
    }
    return get().properties;
  }
  ```

### 2. Complete Session Purge on Logout & Account Deletion
- `logout()` and `deleteAccount()` now explicitly clear:
  - `properties: []`
  - `myProperties: []`
  - `removeItem('rehvo_properties')`
  - `removeItem('rehvo_my_properties')`

### 3. Owner Screens Updated to `myProperties`
- [`OwnerMyPropertiesScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/properties/OwnerMyPropertiesScreen.tsx): Directly reads `myProperties` and filters strictly by `p.owner_id === user.id`.
- [`OwnerDashboardScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/OwnerDashboardScreen.tsx): Directly reads `myProperties` and filters strictly by `p.owner_id === user.id`.
- [`OwnerProfileScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/profile/OwnerProfileScreen.tsx): Directly reads `myProperties` and filters strictly by `p.owner_id === user.id`.
- [`selectUserCapabilities`](file:///Users/yashchoudhary/Downloads/rehvo/src/store/useAppStore.ts): Scoped strictly to `myProperties.filter(p => p.owner_id === user.id)`.

### 4. Idempotent Publishing & Double-Submission Prevention
- Both [`app/(renter)/listing/publish.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/listing/publish.tsx) and [`app/(owner)/listing/preview.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28owner%29/listing/preview.tsx) now enforce `isPublishing` state guards, disabling buttons and displaying activity indicators during network transit to prevent duplicate submissions on double tap.

---

## 4. Screen-by-Screen Data Source & Query Mapping

| Screen / Feature | Route / Component | Data Source | Supabase Query / Method | Scope |
|---|---|---|---|---|
| **Public Home** | `app/(renter)/home.tsx`<br>`RenterHomeScreen.tsx` | `useAppStore.properties` | `getPublishedProperties()`<br>`WHERE status = 'published'` | **Public** (All users' published listings) |
| **Search & Filters** | `app/(renter)/search.tsx`<br>`SearchScreen.tsx` | `useAppStore.properties` | `getPublishedProperties(filter)`<br>`WHERE status = 'published'` | **Public** (All users' published listings) |
| **Category Feeds** | `rent.tsx`, `pg.tsx`, `rooms.tsx`, `studios.tsx` | `useAppStore.properties` | `getPublishedProperties(category)`<br>`WHERE status = 'published'` | **Public** (All users' published listings) |
| **Property Details** | `app/(renter)/property/[id].tsx` | Store / Supabase ID fetch | `getPropertyById(id)` | **Public** (Any valid property ID) |
| **Owner Dashboard** | `app/(owner)/dashboard.tsx`<br>`OwnerDashboardScreen.tsx` | `useAppStore.myProperties`<br>`ownerMetrics` | `getMyProperties(user.id)`<br>`get_owner_dashboard_metrics` | **Private** (Current authenticated user only) |
| **My Properties** | `app/(owner)/properties.tsx`<br>`OwnerMyPropertiesScreen.tsx` | `useAppStore.myProperties` | `getMyProperties(user.id)`<br>`WHERE owner_id = user.id` | **Private** (Current authenticated user only) |
| **Owner Profile** | `app/(owner)/profile.tsx`<br>`OwnerProfileScreen.tsx` | `useAppStore.myProperties` | `getMyProperties(user.id)` | **Private** (Current authenticated user only) |

---

## 5. Live Supabase Verification Matrix Results

Automated matrix executed via [`test_property_data_source_matrix.js`](file:///Users/yashchoudhary/.gemini/antigravity/brain/15a6164c-db6f-4ac8-a471-38c7119d2e02/scratch/test_property_data_source_matrix.js):

| Test Scenario | Validation Steps | Result | Status |
|---|---|---|:---:|
| **TEST 1: Public Discovery Feed** | Fetch `getPublishedProperties()` as User B | Returned 5 published listings. 100% have `status = published`. | **PASS** |
| **TEST 2: Owner A Private Scope** | Query `getMyProperties(userA.id)` | Returned 4 properties. 0 alien records. | **PASS** |
| **TEST 3: Owner B Private Scope** | Query `getMyProperties(userB.id)` | Returned 0 properties. 0 alien records. | **PASS** |
| **TEST 4: Cross-User Isolation** | Compare User A & User B `myProperties` sets | 0 overlap. User B cannot see User A's private listings in owner views. | **PASS** |
| **TEST 5: Zero Seed In Database** | Grep DB records for `usr_current`, `mock_`, `seed_` | 0 matching records found. | **PASS** |

---

## 6. Typecheck & Compilation Verification

- Mobile App: `npx tsc --noEmit` $\rightarrow$ **0 errors**
- Admin Web: `cd admin && npm run typecheck` $\rightarrow$ **0 errors**
