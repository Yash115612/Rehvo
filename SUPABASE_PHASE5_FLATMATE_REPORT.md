# REHVO — Phase 5: Flatmate System Supabase Migration Report

> **Execution Date**: August 2026  
> **Status**: **MIGRATION COMPLETE (0 TypeScript Errors across Mobile & Admin)**  
> **Scope**: Flatmate/Roommate discovery system migration from local/seed storage to Supabase (`public.flatmate_profiles` and `flatmate-images` storage bucket)

---

## 1. Flatmate Data Flow & Architecture

From Phase 5 onward, **Supabase is the authoritative source of truth for all flatmate profiles and roommate discovery data**.

```mermaid
graph TD
    subgraph Supabase Project [REHVO Mumbai Supabase]
        DB_Fm[(public.flatmate_profiles)]
        DB_Prof[(public.profiles)]
        Storage[(flatmate-images bucket)]
    end

    subgraph Service Layer [src/services/flatmates.ts]
        Query[getPublishedFlatmates]
        GetProfile[getFlatmateProfile / getMyFlatmateProfile]
        Create[createFlatmateProfile]
        Update[updateFlatmateProfile]
        Delete[deleteFlatmateProfile]
        Photo[uploadFlatmatePhoto]
    end

    subgraph Mobile UI & State [Zustand Cache & Expo Screens]
        Store[useAppStore.ts]
        Feed[FlatmateDiscoveryFeed.tsx / RenterHome]
        Details[flatmate/[id].tsx]
        CreateWizard[FlatmateCreateFlowScreen.tsx]
        ManageProfile[MyFlatmateProfileScreen.tsx]
        ProfileHub[app/(renter)/profile.tsx]
    end

    Query --> DB_Fm
    GetProfile --> DB_Fm
    Create --> DB_Fm
    Photo --> Storage
    Update --> DB_Fm
    Delete --> DB_Fm
    Delete --> Storage

    Store --> Service Layer
    Feed --> Store
    Details --> Service Layer
    CreateWizard --> Store
    ManageProfile --> Store
    ProfileHub --> Store
```

---

## 2. Database Mapping: App $\leftrightarrow$ Supabase

| App Model (`FlatmateProfile`) | DB Column (`flatmate_profiles`) | Data Type / Format | Transformation Details |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` | Primary Key (`gen_random_uuid()`) |
| `user_id` | `user_id` | `UUID` | Strictly derived from `auth.uid()` (`UNIQUE`) |
| `name`, `phone`, `email` | `profiles:user_id (...)` | Joined relation | Fetched via relation join on `public.profiles` |
| `avatar` | `photo` | `TEXT` | Public URL from `flatmate-images` bucket |
| `age` | `age` | `INTEGER` | Direct |
| `gender` | `gender` | `TEXT` (`male`, `female`, `any`, `other`) | Normalized lowercase enum |
| `occupation` | `profession` | `TEXT` | Direct mapping (`occupation` $\leftrightarrow$ `profession`) |
| `city`, `locality` | `city`, `locality` | `TEXT` | Direct |
| `preferred_locations` | `preferred_locations` | `TEXT[]` | Postgres string array |
| `bio` | `bio` | `TEXT` | Direct |
| `budget_min`, `budget_max` | `budget_min`, `budget_max` | `INTEGER` | Direct |
| `room_preference` | `room_preference` | `TEXT` (`private_room`, `shared_room`, `any`) | Normalized lowercase enum |
| `move_in_date` / `move_in_timing` | `move_in_date` | `TEXT` | Direct |
| `lifestyle_preferences` | `lifestyle_preferences` | `TEXT[]` | Postgres string array |
| `is_published`, `is_paused` | `status` | `TEXT` (`draft`, `published`, `paused`) | Mapped (`published` $\leftrightarrow$ `is_published: true, is_paused: false`) |
| `created_at`, `updated_at` | `created_at`, `updated_at` | `TIMESTAMPTZ` | Managed by database triggers |

---

## 3. Photo Storage Flow

1. **Upload Pipeline**:
   - User picks/crops photo from camera/gallery via `expo-image-picker`.
   - `flatmateService.uploadFlatmatePhoto(userId, uri)` uploads the image blob to `flatmate-images/${userId}/${timestamp}_${random}.jpg`.
   - Obtains public URL from Supabase Storage and persists in `flatmate_profiles.photo`.
2. **Deletion & Cleanup**:
   - On `deleteFlatmateProfile(profileId)`, the service deletes the record from `public.flatmate_profiles`.
   - Storage RLS policy enforces that only the owner (`auth.uid()`) can upload/delete objects in their folder.

---

## 4. Capability Logic & State Transitions

* **Strict Backend Derivation**:
  $$\text{hasFlatmateProfile} = \text{Boolean}(\text{state.myFlatmateProfile})$$
* **Capability Matrix**:
  | State | DB Status | `hasFlatmateProfile` | `hasPublishedFlatmateProfile` | `isFlatmatePaused` | Discovery Visible | Profile Screen UI |
  | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
  | **No Profile** | *No row* | `false` | `false` | `false` | ❌ No | "Create Flatmate Profile" CTA |
  | **Published** | `'published'` | `true` | `true` | `false` | ✅ Yes | Live Flatmate card + Dashboard + Pause CTA |
  | **Paused** | `'paused'` | `true` | `false` | `true` | ❌ No | Paused Flatmate card + Dashboard + Resume CTA |
  | **Deleted** | *Deleted row* | `false` | `false` | `false` | ❌ No | Reverts to "Create Flatmate Profile" |

* **Safe Route Guard**:
  - If a user with no flatmate profile attempts to open `/flatmate/my-profile`, `MyFlatmateProfilePage` executes a single safe redirect to `/flatmate/create` or `/(renter)/profile` without render loops.

---

## 5. Screens Migrated to Real Supabase

| Screen / Component | File Path | Migration Status |
| :--- | :--- | :--- |
| **Discovery Feed** | [`src/components/flatmates/FlatmateDiscoveryFeed.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/flatmates/FlatmateDiscoveryFeed.tsx) | Live queries published flatmates with 8 chip filters |
| **Creation Wizard** | [`src/components/flatmates/FlatmateCreateFlowScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/flatmates/FlatmateCreateFlowScreen.tsx) | Creates real Supabase flatmate profile & uploads photo |
| **Manage Profile** | [`src/components/flatmates/MyFlatmateProfileScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/flatmates/MyFlatmateProfileScreen.tsx) | Manages live/paused profile, allows resuming & real deletion |
| **My Profile Route** | [`app/(renter)/flatmate/my-profile.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(renter)/flatmate/my-profile.tsx) | Route guard checking `hasFlatmateProfile` |
| **Flatmate Details** | [`app/(renter)/flatmate/[id].tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(renter)/flatmate/[id].tsx) | Direct DB ID lookup with loading & 404 fallback |
| **Profile Hub** | [`app/(renter)/profile.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(renter)/profile.tsx) | Renders live flatmate card or activation CTA |
| **Home Screen** | [`src/components/home/RenterHomeScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/RenterHomeScreen.tsx) | Fetches live flatmates and user profile on pull-to-refresh |

---

## 6. Seed Data & Local Dependencies Audit

* **Seed Flatmates in Production**: `flatmates` in `useAppStore` now initializes to `[]` (empty list). Seed flatmates no longer pollute production discovery feeds.
* **Remaining Mock Domains (Phases 6+)**:
  - `conversations` / `messages` (Chat seed data preserved for next phase)
  - `visits` / `applications` / `enquiries` (Interaction seed data preserved for next phase)
  - `notifications` (Notification seed data preserved for next phase)
  - `saved_properties` / `saved_flatmates` (Saved interactions preserved for next phase)

---

## 7. Security & RLS Compliance

1. **Authentication Enforcement**: `createFlatmateProfile` rejects unauthenticated users; `user_id` is derived from authenticated session (`auth.uid()`).
2. **Row Level Security**:
   - `Anyone can view published flatmate profiles`: `USING (status = 'published' OR auth.uid() = user_id OR public.is_admin())`
   - `Users can insert own flatmate profile`: `WITH CHECK (auth.uid() = user_id)`
   - `Users can update own flatmate profile`: `USING (auth.uid() = user_id OR public.is_admin())`
   - `Users can delete own flatmate profile`: `USING (auth.uid() = user_id OR public.is_admin())`
3. **Storage Security**: Only owners can upload to `flatmate-images/${userId}/*`.

---

## 8. Verification Results

| # | Check | Expected Result | Status |
|---|---|---|---|
| 1 | Mobile TypeScript Compilation (`npx tsc --noEmit`) | 0 errors | **PASS** |
| 2 | Admin TypeScript Compilation (`npm run typecheck`) | 0 errors | **PASS** |
| 3 | Initial Flatmate List | Empty `[]` for new users | **PASS** |
| 4 | Flatmate Creation | Row in `public.flatmate_profiles` | **PASS** |
| 5 | Single Profile Constraint | `user_id UNIQUE` enforced | **PASS** |
| 6 | Pause & Resume Visibility | Paused hidden from discovery, visible to owner | **PASS** |
| 7 | Deletion Cleanup | Storage & DB removed, capability reset to false | **PASS** |
| 8 | Error Sanitization | User-friendly feedback; zero raw SQL/Postgres errors | **PASS** |
