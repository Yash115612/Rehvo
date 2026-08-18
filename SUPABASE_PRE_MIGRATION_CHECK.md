# REHVO — Supabase Pre-Migration Verification Check

> **Target Project URL**: `https://xoskechmxzgfajkfpssv.supabase.co`  
> **Region**: South Asia (Mumbai, `ap-south-1`)  
> **Verification Status**: **READY FOR MIGRATION**  
> **Database Modification Status**: **NO MIGRATIONS APPLIED (Awaiting user trigger)**

---

## 1. Target Project Verification

| Check Item | Configured Value | Verification Status |
| :--- | :--- | :--- |
| **Project URL** | `https://xoskechmxzgfajkfpssv.supabase.co` | **MATCHED (Exact)** |
| **Region** | South Asia (Mumbai, `ap-south-1`) | **VERIFIED** |
| **Mobile App (`.env.local`)** | `EXPO_PUBLIC_SUPABASE_URL=https://xoskechmxzgfajkfpssv.supabase.co` | **VERIFIED** |
| **Admin App (`admin/.env.local`)**| `NEXT_PUBLIC_SUPABASE_URL=https://xoskechmxzgfajkfpssv.supabase.co` | **VERIFIED** |

---

## 2. Migration History & Schema State

* **Applied Migrations**: None (Clean initial deployment state)
* **Prepared Migrations Suite**: 11 sequential migration files in [`supabase/migrations/`](file:///Users/yashchoudhary/Downloads/rehvo/supabase/migrations):
  1. `001_core_schema.sql` (Extensions, `service_cities`, `profiles`, auth sync trigger)
  2. `002_properties.sql` (`properties`, `property_images` — flat, room, pg, studio only)
  3. `003_flatmates.sql` (`flatmate_profiles` linked 1-to-1 with profiles)
  4. `004_saved_and_interactions.sql` (`saved_properties`, `saved_flatmates`, `enquiries`, `visits`)
  5. `005_chat.sql` (`conversations`, `conversation_participants`, `messages`)
  6. `006_notifications.sql` (`notifications`, `user_push_tokens`)
  7. `007_trust_safety_support.sql` (`verification_requests`, `safety_reports`, `support_tickets`)
  8. `008_admin_and_audit.sql` (`admin_users`, `admin_audit_logs`, `system_settings`, `is_admin()`)
  9. `009_rls_policies.sql` (Complete Row Level Security across all 20 tables)
  10. `010_storage_buckets.sql` (Storage buckets provisioning & RLS policies)
  11. `011_seed_initial_data.sql` (Initial service cities, platform settings, super admin helper)

---

## 3. Planned Public Tables (20 Tables)

1. `public.service_cities`
2. `public.profiles`
3. `public.properties`
4. `public.property_images`
5. `public.flatmate_profiles`
6. `public.saved_properties`
7. `public.saved_flatmates`
8. `public.enquiries`
9. `public.visits`
10. `public.conversations`
11. `public.conversation_participants`
12. `public.messages`
13. `public.notifications`
14. `public.user_push_tokens`
15. `public.verification_requests`
16. `public.safety_reports`
17. `public.support_tickets`
18. `public.admin_users`
19. `public.admin_audit_logs`
20. `public.system_settings`

---

## 4. Planned Storage Buckets (4 Buckets)

| Bucket Name | Access Type | Max Size | Allowed MIME Types |
| :--- | :--- | :--- | :--- |
| `property-images` | Public | 10 MB | `image/png, image/jpeg, image/webp` |
| `profile-images` | Public | 5 MB | `image/png, image/jpeg, image/webp` |
| `flatmate-images` | Public | 5 MB | `image/png, image/jpeg, image/webp` |
| `verification-documents` | **Private (Signed Access Only)** | 25 MB | `application/pdf, image/png, image/jpeg, image/webp` |

---

## 5. Safety & Conflict Assessment

| Domain | Assessment | Result |
| :--- | :--- | :--- |
| **Destructive Commands** | Zero `DROP DATABASE` or `DROP SCHEMA CASCADE` in migration files | **PASS** |
| **Zero Villa Guarantee** | Strict restriction to `flat`, `room`, `pg`, `studio` with 0 villa tables | **PASS** |
| **RLS Coverage** | 100% table coverage enabled in `009_rls_policies.sql` | **PASS** |
| **Service Role Isolation** | Key strictly excluded from mobile client and browser bundles | **PASS** |
| **Schema Conflicts** | Zero conflicting tables or circular foreign keys | **PASS** |

---

## 6. Pre-Migration Verdict

* **Target Confirmed**: `https://xoskechmxzgfajkfpssv.supabase.co`
* **Region Confirmed**: South Asia (Mumbai)
* **Ready to Migrate**: **YES**
* **Status**: **READY FOR MIGRATION**
