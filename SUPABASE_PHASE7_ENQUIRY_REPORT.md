# REHVO — Phase 7: Property Enquiry System Supabase Migration Report

> **Execution Date**: August 2026  
> **Status**: **MIGRATION COMPLETE (0 TypeScript Errors across Mobile & Admin)**  
> **Scope**: Property Enquiry system migration from local mock/Zustand fixtures to real Supabase PostgreSQL (`public.enquiries`)

---

## 1. Enquiry Data Flow & Architecture

From Phase 7 onward, **Supabase is the authoritative source of truth for all property enquiries**.

```mermaid
graph TD
    subgraph Supabase Project [REHVO Mumbai Supabase]
        DB_Enquiries[(public.enquiries)]
        DB_Properties[(public.properties)]
        DB_Profiles[(public.profiles)]
    end

    subgraph Service Layer [src/services/enquiries.ts]
        Create[createEnquiry]
        GetMy[getMyEnquiries]
        GetOwner[getOwnerEnquiries]
        GetById[getEnquiryById]
        UpdateStatus[updateEnquiryStatus]
    end

    subgraph Mobile UI & State [Zustand Cache & Expo Screens]
        Store[useAppStore.ts - enquiries, fetchEnquiries, submitEnquiry, updateEnquiryStatus]
        PropDetails[PropertyDetailsScreen.tsx / SendEnquiryModal.tsx]
        RenterProfile[profile.tsx / EnquiriesModal.tsx - My Enquiries]
        OwnerEnquiries[OwnerEnquiriesScreen.tsx / OwnerEnquiryDetailsModal.tsx]
        OwnerDashboard[OwnerDashboardScreen.tsx - Pending Enquiries Badge & Attention Row]
    end

    Create --> DB_Enquiries
    GetMy --> DB_Enquiries
    GetOwner --> DB_Enquiries
    GetById --> DB_Enquiries
    UpdateStatus --> DB_Enquiries

    Store --> Service Layer
    PropDetails --> Store
    RenterProfile --> Store
    OwnerEnquiries --> Store
    OwnerDashboard --> Store
```

---

## 2. Database Schema & Status Mapping

### `public.enquiries` Table
* **Schema**:
  * `id` (`UUID PRIMARY KEY DEFAULT gen_random_uuid()`)
  * `user_id` (`UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE`)
  * `property_id` (`UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE`)
  * `owner_id` (`UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE`)
  * `message` (`TEXT NOT NULL`)
  * `status` (`TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'replied', 'scheduled', 'closed'))`)
  * `created_at` (`TIMESTAMPTZ NOT NULL DEFAULT NOW()`)
  * `updated_at` (`TIMESTAMPTZ NOT NULL DEFAULT NOW()`)

### Status Mapping: App $\leftrightarrow$ Database

| App Status (`Enquiry['status']`) | DB Status (`enquiries.status`) | Meaning |
| :--- | :--- | :--- |
| `'NEW'` | `'pending'` | New enquiry submitted by renter, awaiting owner response |
| `'CONTACTED'` / `'APPLIED'` | `'replied'` | Host has opened or sent reply to the prospective tenant |
| `'VISIT_SCHEDULED'` | `'scheduled'` | Property tour/visit date arranged with renter |
| `'CLOSED'` | `'closed'` | Enquiry resolved, rented, or dismissed |

---

## 3. User & Owner Relationships and Self-Enquiry Prevention

1. **Self-Enquiry Prevention**:
   - `createEnquiry(propertyId, message)` inspects the property's `owner_id` from the database.
   - If `authenticated user.id === property.owner_id`, the creation is rejected with an explanatory message: *"You cannot send an enquiry on your own property."*
   - `SendEnquiryModal.tsx` also displays an advisory alert preventing owners from accidental self-enquiries.
2. **Owner Resolution**:
   - `owner_id` is resolved from `public.properties.owner_id` on the server/service side and never trusted blindly from untrusted client parameters.

---

## 4. RLS / Security Compliance

* **Row Level Security**:
  ```sql
  CREATE POLICY "Enquiry participants and admins can view enquiries"
      ON public.enquiries FOR SELECT
      USING (auth.uid() = user_id OR auth.uid() = owner_id OR public.is_admin());

  CREATE POLICY "Authenticated users can create enquiries"
      ON public.enquiries FOR INSERT
      WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Participants and admins can update enquiry status"
      ON public.enquiries FOR UPDATE
      USING (auth.uid() = user_id OR auth.uid() = owner_id OR public.is_admin())
      WITH CHECK (auth.uid() = user_id OR auth.uid() = owner_id OR public.is_admin());
  ```
* **Enforcement**:
  - Renter A and Owner B can only access enquiries in which they are either the sender (`user_id`) or the property owner (`owner_id`).
  - Unrelated User C is blocked by RLS from reading or modifying A & B's enquiries.

---

## 5. Property Deletion & Foreign Key Cascading

* `public.enquiries.property_id` is defined with `ON DELETE CASCADE`.
* When a host deletes a property, associated enquiries are removed automatically by Postgres.
* `getMyEnquiries` and `getOwnerEnquiries` queries gracefully handle joins and ensure UI lists remain stable without breaking.

---

## 6. Screen Integrations

| Screen / Component | File Path | Migration Status |
| :--- | :--- | :--- |
| **Send Enquiry Modal** | [`src/components/property/SendEnquiryModal.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/property/SendEnquiryModal.tsx) | Live modal on property details with quick message chips |
| **Property Details** | [`src/components/property/PropertyDetailsScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/property/PropertyDetailsScreen.tsx) | Connected "Enquire" action in `PropertyOwnerSection` |
| **My Enquiries Modal** | [`src/components/profile/EnquiriesModal.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/profile/EnquiriesModal.tsx) | Live list of renter enquiries with status tabs |
| **Owner Enquiries Hub** | [`src/components/owner/enquiries/OwnerEnquiriesScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/enquiries/OwnerEnquiriesScreen.tsx) | Live owner inbox with filtering, search, and details modal |
| **Owner Enquiry Details** | [`src/components/owner/enquiries/OwnerEnquiryDetailsModal.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/enquiries/OwnerEnquiryDetailsModal.tsx) | Reply composer and close actions with status sync |
| **Owner Dashboard** | [`src/components/owner/OwnerDashboardScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/owner/OwnerDashboardScreen.tsx) | Live pending enquiries count & action item banner |

---

## 7. Seed Data Removed & Session Isolation

* **Zero Mock Enquiries**: `enquiries` in `useAppStore` initializes to `[]`. `SEED_ENQUIRIES` is disconnected from production sessions.
* **Session Lifecycle**:
  - `logout()` and `deleteAccount()` reset `enquiries: []`.
  - `login()` and `switchRole()` trigger `fetchEnquiries()` to load the active user's records.

---

## 8. Verification Results

| # | Check | Expected Result | Status |
|---|---|---|---|
| 1 | Mobile TypeScript Compilation (`npx tsc --noEmit`) | 0 errors | **PASS** |
| 2 | Admin TypeScript Compilation (`npm run typecheck`) | 0 errors | **PASS** |
| 3 | Initial Enquiry List | Empty `[]` for new users | **PASS** |
| 4 | Create Enquiry | Row inserted in `public.enquiries` with correct `owner_id` | **PASS** |
| 5 | Self-Enquiry Prevention | Blocked when `user_id === owner_id` | **PASS** |
| 6 | Owner Enquiries Query | Returns only enquiries for owner's properties | **PASS** |
| 7 | Status Update | Updates status in Supabase (`pending` $\rightarrow$ `replied` / `closed`) | **PASS** |
| 8 | Property Deletion Cascade | Handled safely by Postgres cascade; no broken UI | **PASS** |
| 9 | Error Sanitization | User-friendly feedback; zero raw SQL/Postgres errors | **PASS** |
| 10 | Session Isolation | Enquiries cleared on logout; loaded per active user on login | **PASS** |
