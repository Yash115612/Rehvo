# REHVO Mobile App — Dedicated Commercial & PG/Rooms Discovery Pages Report

**Release Status**: Complete & Fully Verified  
**Date**: August 20, 2026  
**Scope**: Implementation of dedicated native mobile discovery screens for **Commercial** (`app/(renter)/commercial.tsx`) and **PG & Rooms** (`app/(renter)/pg-rooms.tsx`), integrated directly with the Home screen quick actions, real Supabase published data, standard save/enquiry/chat/visit services, and zero-error TypeScript validation.

---

## 1. Commercial Discovery Screen

### Route
- `app/(renter)/commercial.tsx` rendering [`CommercialDiscoveryScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/commercial/CommercialDiscoveryScreen.tsx).

### Native UI & Structure
- **Header Bar**: Top bar with back button, screen title *"Commercial Spaces"*, subtitle *"Grade-A offices, retail shops & business hubs"*, and direct *"List"* button.
- **Search & Locality Filter**: Dedicated instant area search (e.g. *BKC, Andheri East, Lower Parel, Powai*).
- **Horizontal Category Pills**:
  - `All Spaces`
  - `Offices`
  - `Retail Shops`
  - `Showrooms`
  - `Co-Working`
  - `Warehouses`
  - `Plots & Land`
- **Results Counter**: Real-time counter of available spaces + `100% ZERO BROKERAGE` badge.
- **Listing Cards**: Rendered with [`CommercialPropertyCard.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/categories/CommercialPropertyCard.tsx) with photo cover, commercial type tag, rent per month, price per sq ft, carpet area, locality, verification shield, and save heart button.

---

## 2. PG & Rooms Discovery Screen

### Route
- `app/(renter)/pg-rooms.tsx` (and direct aliases `pg.tsx` & `rooms.tsx`) rendering [`PgRoomsDiscoveryScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/pg/PgRoomsDiscoveryScreen.tsx).

### Native UI & Structure
- **Header Bar**: Top bar with back button, screen title *"PG & Rooms"*, subtitle *"Find PGs, private rooms and shared spaces"*, and direct *"List"* button.
- **Search & Locality Filter**: Dedicated instant college & employment hub search (e.g. *Powai, Vile Parle, Andheri East, Malad*).
- **Horizontal Category Pills**:
  - `All Stays`
  - `PG & Co-Living`
  - `Private Rooms`
  - `Shared Rooms`
  - `1 RK / Studios`
- **Results Counter**: Real-time count of stays found + `MOVE-IN READY` badge.
- **Listing Cards**: Image cover, stay type badge, rent/month, property title, locality, food inclusion pill, Wi-Fi pill, 0% brokerage badge, and direct save heart button.

---

## 3. Data Flow & Shared Services Integration

- **Real Published Inventory**: Loaded from `useAppStore()` and synced via Supabase (`fetchProperties()`).
- **Save / Unsave**: Uses standard `toggleSaveProperty(id)` with real-time UI synchronization across cards.
- **Property Details Navigation**: Tapping any card navigates to `/(renter)/property/[id]`.
- **Preserved Back Navigation**: Back button on Property Details uses `router.canGoBack() ? router.back() : router.replace(...)`, returning the user directly to the calling Commercial or PG & Rooms screen without resetting to Home.
- **Enquiry / Chat / Schedule Visit**: Property details screen reuses standard chat and visit scheduling workflows for commercial and PG/room listings.

---

## 4. Home Screen Integration

On [`RenterHomeScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/RenterHomeScreen.tsx):
1. **Quick Actions Row**:
   - `Homes` $\rightarrow$ `router.push('/(renter)/search')`
   - `Commercial` $\rightarrow$ `router.push('/(renter)/commercial')`
   - `PG / Rooms` $\rightarrow$ `router.push('/(renter)/pg-rooms')`
   - `Flatmates` $\rightarrow$ `router.push('/(renter)/flatmates')`
2. **Commercial Showcase Section**:
   - Tap *"Explore Commercial"* $\rightarrow$ `router.push('/(renter)/commercial')`
3. **PG / Rooms Showcase Section**:
   - Tap *"Browse PGs"* / *"Browse Rooms"* $\rightarrow$ `router.push('/(renter)/pg-rooms')`

---

## 5. Loading, Empty, and Error States

- **Loading State**: Pull-to-refresh indicators with category-tailored tint colors (`#FF5533` for Commercial, `#D97706` for PG & Rooms).
- **Empty State**: Friendly icon, contextual description based on active search queries, and a *"Reset filters"* CTA button.
- **Error State**: Non-intrusive error banner with a clear *"Retry"* button triggering `handleRefresh()`.

---

## 6. Multi-Platform Support & Typecheck

- **iOS & Android**: Safe area insets handled via `react-native-safe-area-context` with standard touch targets (min 44px) and native elevation/shadows.
- **TypeScript Verification**:
  ```bash
  npx tsc --noEmit  # 0 errors
  ```
- **Web Verification**:
  ```bash
  npm run typecheck # 0 errors
  ```

---

## 7. Verification Summary

| Suite / Check | Command | Status | Result |
| :--- | :--- | :---: | :--- |
| Mobile TypeScript | `npx tsc --noEmit` | **PASSED** | 0 errors |
| Web TypeScript | `npm run typecheck` (`web/`) | **PASSED** | 0 errors |
| Route Registration | Expo Router file resolution | **PASSED** | `app/(renter)/commercial.tsx` & `app/(renter)/pg-rooms.tsx` resolved |
| Home Navigation | Quick Actions & Section CTAs | **PASSED** | Routed to dedicated screens |
| Shared Property Flow | Property Details Back Stack | **PASSED** | Returns to calling category screen |
