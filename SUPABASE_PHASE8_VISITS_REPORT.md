# REHVO — Phase 8: Scheduled Visits System Supabase Migration Report

> **Execution Date**: August 2026  
> **Status**: **MIGRATION COMPLETE (0 TypeScript Errors across Mobile & Admin)**  
> **Scope**: Scheduled Visits & Tour booking migration from local mock fixtures to live Supabase PostgreSQL (`public.visits`)

---

## 1. Visit Data Flow & Architecture

From Phase 8 onward, **Supabase is the authoritative source of truth for all scheduled visits and property viewings**.

```mermaid
graph TD
    subgraph Supabase Project [REHVO Mumbai Supabase]
        DB_Visits[(public.visits)]
        DB_Properties[(public.properties)]
        DB_Profiles[(public.profiles)]
    end

    subgraph Service Layer [src/services/visits.ts]
        Create[createVisit]
        GetMy[getMyVisits]
        GetOwner[getOwnerVisits]
        GetById[getVisitById]
        Confirm[confirmVisit]
        Cancel[cancelVisit]
        Complete[completeVisit]
        UpdateStatus[updateVisitStatus]
    end

    subgraph Mobile UI & State [Zustand Cache & Expo Screens]
        Store[useAppStore.ts - visits, fetchVisits, scheduleVisit, updateVisitStatus, confirmVisit, cancelVisit, completeVisit]
        ScheduleModal[ScheduleVisitModal.tsx]
        RenterVisits[VisitsModal.tsx / profile.tsx]
        OwnerVisits[OwnerVisitsScreen.tsx / OwnerVisitCard.tsx / OwnerVisitDetailsModal.tsx]
        OwnerDashboard[OwnerDashboardScreen.tsx - Pending Visits Badge & Attention Items]
    end

    Create --> DB_Visits
    GetMy --> DB_Visits
    GetOwner --> DB_Visits
    GetById --> DB_Visits
    Confirm --> DB_Visits
    Cancel --> DB_Visits
    Complete --> DB_Visits
    UpdateStatus --> DB_Visits

    Store --> Service Layer
    ScheduleModal --> Store
    RenterVisits --> Store
    OwnerVisits --> Store
    OwnerDashboard --> Store
```

---

## 2. Database Schema & Status Mapping

### `public.visits` Table
* **Schema**:
  * `id` (`UUID PRIMARY KEY DEFAULT gen_random_uuid()`)
  * `property_id` (`UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE`)
  * `user_id` (`UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE`)
  * `owner_id` (`UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE`)
  * `scheduled_date` (`DATE NOT NULL`)
  * `scheduled_time` (`TEXT NOT NULL`)
  * `status` (`TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))`)
  * `notes` (`TEXT`)
  * `created_at` (`TIMESTAMPTZ NOT NULL DEFAULT NOW()`)
  * `updated_at` (`TIMESTAMPTZ NOT NULL DEFAULT NOW()`)

### Status Mapping: App $\leftrightarrow$ Database

| App Status (`VisitStatus`) | DB Status (`visits.status`) | Meaning |
| :--- | :--- | :--- |
| `'REQUESTED'` | `'pending'` | Visit request booked by renter, awaiting host approval |
| `'CONFIRMED'` | `'confirmed'` | Host approved date & time for property tour |
| `'COMPLETED'` | `'completed'` | Property tour successfully conducted |
| `'CANCELLED'` | `'cancelled'` | Visit cancelled by either renter or property host |
| `'RESCHEDULED'` | `'pending'` / `'cancelled'` | Rescheduled slot proposal |

---

## 3. User & Owner Relationships and Self-Visit Prevention

1. **Self-Visit Prevention**:
   - `createVisit(propertyId, scheduledDate, scheduledTime, notes)` inspects `properties.owner_id` from the database.
   - If `authenticated user.id === property.owner_id`, the action is blocked: *"You cannot schedule a visit for your own property."*
   - `ScheduleVisitModal.tsx` displays an advisory warning and disables visit booking for listings owned by the current user.
2. **Authoritative Owner Resolution**:
   - `owner_id` is fetched directly from the target property on the backend/service and never trusted from frontend body payloads.

---

## 4. Date / Time Validation

1. **Dynamic Upcoming Dates**:
   - `ScheduleVisitModal.tsx` generates a dynamic 7-day rolling window starting from today.
2. **Past Date Guard**:
   - `createVisit` validates that `scheduled_date >= today's date` (`YYYY-MM-DD`). Past dates are rejected with a clear user-facing error message: *"Please select an upcoming date for your visit."*

---

## 5. RLS / Security Compliance

* **Row Level Security**:
  ```sql
  CREATE POLICY "Visit participants and admins can view visits"
      ON public.visits FOR SELECT
      USING (auth.uid() = user_id OR auth.uid() = owner_id OR public.is_admin());

  CREATE POLICY "Users can book visits"
      ON public.visits FOR INSERT
      WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Participants and admins can update visit status"
      ON public.visits FOR UPDATE
      USING (auth.uid() = user_id OR auth.uid() = owner_id OR public.is_admin());
  ```
* **Enforcement**:
  - Renters only read visits where `user_id = auth.uid()`.
  - Owners only read visits where `owner_id = auth.uid()`.
  - External users cannot read or tamper with other users' visits.

---

## 6. Property Deletion Behavior

* `public.visits.property_id` is configured with `ON DELETE CASCADE`.
* When a property is removed, associated visits are deleted by Postgres cascade, preventing orphan rows.
* Queries use foreign key relations with null-safe fallbacks to avoid UI crashes.

---

## 7. Screen Integrations

| Screen / Component | File Path | Migration Status |
| :--- | :--- | :--- |
| **Schedule Visit Modal** | [`src/components/property/ScheduleVisitModal.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/property/ScheduleVisitModal.tsx) | Live modal on Property Details with dynamic 7-day slot selector |
| **Renter Visits Hub** | [`src/components/profile/VisitsModal.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/profile/VisitsModal.tsx) | Live list of renter scheduled visits with instant cancellation |
| **Owner Visits Hub** | [`src/components/owner/visits/OwnerVisitsScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/visits/OwnerVisitsScreen.tsx) | Live owner visits inbox with date filter, status tabs & pull-to-refresh |
| **Owner Visit Details Modal** | [`src/components/owner/visits/OwnerVisitDetailsModal.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/visits/OwnerVisitDetailsModal.tsx) | Confirm, reschedule, complete & cancel actions with direct phone/WhatsApp |
| **Owner Dashboard** | [`src/components/owner/OwnerDashboardScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/OwnerDashboardScreen.tsx) | Live pending visits count badge and priority attention banner |

---

## 8. Seed Data Disconnection & Session Isolation

* **Zero Mock Visits**: `visits` in `useAppStore` defaults to `[]`. `SEED_VISITS` is completely disconnected from active sessions.
* **Session Lifecycle**:
  - `logout()` and `deleteAccount()` reset `visits: []`.
  - `login()` and `switchRole()` trigger `fetchVisits()` to load the active user's records.

---

## 9. Verification Results

| # | Check | Expected Result | Status |
|---|---|---|---|
| 1 | Mobile TypeScript Compilation (`npx tsc --noEmit`) | 0 errors | **PASS** |
| 2 | Admin TypeScript Compilation (`npm run typecheck`) | 0 errors | **PASS** |
| 3 | Initial Visit List | Empty `[]` for new users | **PASS** |
| 4 | Schedule Visit | Row inserted in `public.visits` with correct `owner_id` | **PASS** |
| 5 | Self-Visit Prevention | Blocked when `user_id === owner_id` | **PASS** |
| 6 | Past Date Booking | Blocked when `scheduled_date < today` | **PASS** |
| 7 | Owner Visits Query | Returns only visits for properties owned by user | **PASS** |
| 8 | Confirm Visit | Updates status to `confirmed` in Supabase | **PASS** |
| 9 | Complete Visit | Updates status to `completed` in Supabase | **PASS** |
| 10 | Cancel Visit | Updates status to `cancelled` in Supabase (renter or owner) | **PASS** |
| 11 | Property Deletion Cascade | Handled safely by Postgres cascade; no broken UI | **PASS** |
| 12 | Error Sanitization | User-friendly feedback; zero raw SQL/Postgres errors | **PASS** |
| 13 | Session Isolation | Visits cleared on logout; loaded per active user on login | **PASS** |
