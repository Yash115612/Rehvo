# REHVO — Phase 6: Saved Properties & Flatmates Supabase Migration Report

> **Execution Date**: August 2026  
> **Status**: **MIGRATION COMPLETE (0 TypeScript Errors across Mobile & Admin)**  
> **Scope**: Saved/Shortlist system migration from local/AsyncStorage to Supabase (`public.saved_properties` and `public.saved_flatmates`)

---

## 1. Saved Data Flow & Architecture

From Phase 6 onward, **Supabase is the authoritative source of truth for saved properties and saved flatmates**.

```mermaid
graph TD
    subgraph Supabase Project [REHVO Mumbai Supabase]
        DB_SavedProps[(public.saved_properties)]
        DB_SavedFm[(public.saved_flatmates)]
    end

    subgraph Service Layer [src/services/saved.ts]
        SaveProp[saveProperty / unsaveProperty / toggleSavedProperty]
        GetProps[getSavedPropertyIds / getSavedProperties]
        SaveFm[saveFlatmate / unsaveFlatmate / toggleSavedFlatmate]
        GetFm[getSavedFlatmateIds / getSavedFlatmates]
    end

    subgraph Mobile UI & State [Zustand Cache & Expo Screens]
        Store[useAppStore.ts - savedPropertyIds, savedFlatmateIds]
        Home[RenterHomeScreen.tsx / Home Recommended & Grid]
        Search[search.tsx / SearchPropertyCard]
        PropDetails[property/[id].tsx / PropertyDetailsScreen]
        FmFeed[FlatmateDiscoveryFeed.tsx / FlatmateCard]
        SavedScreen[app/(renter)/saved.tsx - Properties & Flatmates Tabs]
        ProfileHub[app/(renter)/profile.tsx - Shortlists Pill]
    end

    SaveProp --> DB_SavedProps
    GetProps --> DB_SavedProps
    SaveFm --> DB_SavedFm
    GetFm --> DB_SavedFm

    Store --> Service Layer
    Home --> Store
    Search --> Store
    PropDetails --> Store
    FmFeed --> Store
    SavedScreen --> Store
    ProfileHub --> Store
```

---

## 2. Database Schema & Constraint Mapping

### `public.saved_properties`
* **Schema**:
  * `id` (`UUID PRIMARY KEY DEFAULT gen_random_uuid()`)
  * `user_id` (`UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE`)
  * `property_id` (`UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE`)
  * `created_at` (`TIMESTAMPTZ NOT NULL DEFAULT NOW()`)
  * `CONSTRAINT uq_saved_properties UNIQUE (user_id, property_id)`

### `public.saved_flatmates`
* **Schema**:
  * `id` (`UUID PRIMARY KEY DEFAULT gen_random_uuid()`)
  * `user_id` (`UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE`)
  * `flatmate_profile_id` (`UUID NOT NULL REFERENCES public.flatmate_profiles(id) ON DELETE CASCADE`)
  * `created_at` (`TIMESTAMPTZ NOT NULL DEFAULT NOW()`)
  * `CONSTRAINT uq_saved_flatmates UNIQUE (user_id, flatmate_profile_id)`

---

## 3. Duplicate Prevention & Cascade Deletion Safety

1. **Duplicate Prevention**:
   - `saveProperty` and `saveFlatmate` use `upsert` with `ignoreDuplicates: true` and explicit unique constraints `(user_id, property_id)` and `(user_id, flatmate_profile_id)`.
   - Rapid multiple taps are handled safely without duplicate rows or runtime exceptions.
2. **Foreign Key Cascade Deletion**:
   - If a property is deleted by its owner, `ON DELETE CASCADE` removes all associated `saved_properties` rows automatically.
   - If a flatmate profile is deleted, `ON DELETE CASCADE` removes all associated `saved_flatmates` rows automatically.
   - `saved.tsx` safely filters null/missing records so the UI never crashes on stale references.

---

## 4. RLS / Security Compliance

* **Row Level Security**:
  ```sql
  CREATE POLICY "Users can manage own saved properties"
      ON public.saved_properties FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can manage own saved flatmates"
      ON public.saved_flatmates FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  ```
* **Enforcement**:
  - Signed-in users can only save, unsave, and view their own shortlist.
  - User B cannot read or delete User A's saved items.
  - Signed-out users are prevented from creating anonymous saved records.

---

## 5. Session Persistence & Cross-User Isolation

1. **App Restart / Cold Start**:
   - On app launch, `initializeFromStorage()` restores the user session and invokes `fetchSavedIds()`, querying Supabase for the authenticated user's live saved property and flatmate IDs.
2. **Logout Cleanup**:
   - `logout()` and `deleteAccount()` explicitly reset `savedPropertyIds: []` and `savedFlatmateIds: []` and remove cached keys (`'rehvo_saved_ids'`, `'rehvo_saved_flatmate_ids'`).
3. **Login Transition**:
   - When a new user logs in, `fetchSavedIds()` runs immediately, guaranteeing that no previous user's saved items leak into the new session.

---

## 6. Stale-Reference & Status Handling

* **Deleted Properties / Flatmates**: Foreign keys use `ON DELETE CASCADE`, automatically removing the relationship. Additionally, client queries in `savedService.getSavedProperties` and `savedService.getSavedFlatmates` filter out null or removed items.
* **Paused Properties**: Follow existing product rules (visible in saved list with status indicator, but hidden from public search).
* **Paused Flatmates**: Preserved in user's saved items while hidden from public discovery feeds.

---

## 7. Screen Integrations

| Screen / Component | File Path | Migration Status |
| :--- | :--- | :--- |
| **Saved Hub** | [`app/(renter)/saved.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(renter)/saved.tsx) | Live queries saved properties & flatmates with category & sort filters |
| **Property Details** | [`src/components/property/PropertyDetailsScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/property/PropertyDetailsScreen.tsx) | Synchronized heart icon with live Supabase save/unsave |
| **Search Screen** | [`app/(renter)/search.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(renter)/search.tsx) | Real-time heart toggle with immediate optimistic feedback |
| **Home Screen** | [`src/components/home/RenterHomeScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/RenterHomeScreen.tsx) | Synchronized save state across carousels and grids |
| **Flatmate Discovery** | [`src/components/flatmates/FlatmateDiscoveryFeed.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/flatmates/FlatmateDiscoveryFeed.tsx) | Real-time flatmate bookmark toggle |
| **Profile Screen** | [`app/(renter)/profile.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(renter)/profile.tsx) | Saved badges link to `/(renter)/saved?tab=flatmates` |

---

## 8. Local State Migration

* **Zero Mock Shortlists**: `savedPropertyIds` and `savedFlatmateIds` now initialize to `[]`. Seed IDs (`'prop_01'`, `'prop_02'`) no longer pollute fresh accounts.
* **Storage Key Fix**: Fixed `'rehvo_saved_flatmates'` vs `'rehvo_saved_flatmate_ids'` mismatch across session storage.
* **Remaining Non-Migrated Domains (Phases 7+)**:
  - `conversations` / `messages` (Chat seed data preserved for next phase)
  - `visits` / `applications` / `enquiries` (Interaction seed data preserved for next phase)
  - `notifications` (Notification seed data preserved for next phase)

---

## 9. Known Limitations

* Real-time Supabase postgres subscriptions for live cross-device saved synchronization are planned for subsequent optimization phases; current implementation relies on instant optimistic client state + immediate Supabase REST persistence.

---

## 10. Verification Test Matrix

| # | Check | Expected Result | Status |
|---|---|---|---|
| 1 | Mobile TypeScript Compilation (`npx tsc --noEmit`) | 0 errors | **PASS** |
| 2 | Admin TypeScript Compilation (`npm run typecheck`) | 0 errors | **PASS** |
| 3 | Initial Saved Lists | Empty `[]` for new users | **PASS** |
| 4 | Save Property | Upsert to `public.saved_properties` | **PASS** |
| 5 | Unsave Property | Row deleted from `public.saved_properties` | **PASS** |
| 6 | Save Flatmate | Upsert to `public.saved_flatmates` | **PASS** |
| 7 | Unsave Flatmate | Row deleted from `public.saved_flatmates` | **PASS** |
| 8 | Duplicate Save Protection | Handled gracefully without error | **PASS** |
| 9 | Cascade Deletion | No broken saved records on item deletion | **PASS** |
| 10 | Error Sanitization | User-friendly feedback; zero raw SQL/Postgres errors | **PASS** |
| 11 | Session Isolation | Saved items cleared on logout and refreshed per user | **PASS** |
