# REHVO — Phase 1: Database Foundation Report

> **Execution Date**: August 2026  
> **Target Environment**: Production Supabase Database Engine  
> **Status**: Complete, Validated & Ready for Phased Integration

---

## 1. What Already Existed Prior to Phase 1

1. **Client-Side State Storage**: The mobile app relied on local `AsyncStorage` (`rehvo_auth_session`, `rehvo_properties`, `rehvo_my_flatmate_profile`, etc.) populated with seed mock data from `src/data/seedData.ts`.
2. **Supabase Client Library**: `@supabase/supabase-js` was installed and configured in `src/lib/supabase.ts`, with only isolated table calls (e.g. `deleteProperty`).
3. **Admin Web Control Panel UI Shell**: Newly scaffolded Next.js 14 web app in `admin/` with desktop layout, routing, and mock UI data.
4. **No Schema / Migration Files**: The repository contained no prior `.sql` migration files or database definitions.

---

## 2. What Was Created in Phase 1

### A. Numbered Migration Files in `supabase/migrations/`
* `001_core_schema.sql`: Core PostgreSQL extensions, `service_cities`, `profiles` table, and `auth.users` sync trigger.
* `002_properties.sql`: `properties` and `property_images` tables restricted to `flat`, `room`, `pg`, `studio` (Zero Villa concept).
* `003_flatmates.sql`: `flatmate_profiles` table linked 1-to-1 with `profiles.id`.
* `004_saved_and_interactions.sql`: Relational tables for `saved_properties`, `saved_flatmates`, `enquiries`, and `visits` with unique constraints.
* `005_chat.sql`: `conversations`, `conversation_participants`, and `messages` tables with auto-updating triggers for last message and unread counts.
* `006_notifications.sql`: `notifications` and `user_push_tokens` tables.
* `007_trust_safety_support.sql`: `verification_requests` (deeds/KYC), `safety_reports`, and `support_tickets`.
* `008_admin_and_audit.sql`: `admin_users`, `admin_audit_logs`, `system_settings`, and the `is_admin()` Security Definer function.
* `009_rls_policies.sql`: Complete, fine-grained Row Level Security policies across all 20 tables.
* `010_storage_buckets.sql`: Storage bucket provisioning and storage object RLS policies.
* `011_seed_initial_data.sql`: Seed data for service cities, system settings, and `provision_super_admin` helper.

### B. Consolidated Schema File
* `supabase/schema.sql`: Single-file consolidated script for one-click deployment in the Supabase SQL Editor.

### C. Comprehensive Documentation
* `SUPABASE_SCHEMA.md`: Complete relational reference, column types, constraints, storage policies, and capability logic.

---

## 3. What Remains (Next Phases)

* **Phase 2 (Admin Live Data)**: Connect the Web Admin Control Panel to live Supabase tables for Users, Properties, Verifications, Reports, and Audit Logs.
* **Phase 3 (Mobile Supabase Hydration)**: Wire the mobile app's Zustand store to hydrate listings, flatmates, and user profiles from Supabase with offline AsyncStorage fallback.
* **Phase 4 (Storage Upload Integration)**: Connect listing creation and deed verification to Supabase Storage signed upload URLs.
* **Phase 5 (Realtime Subscriptions)**: Enable Supabase Realtime for chat messages and notifications.

---

## 4. Migration & Security Risks Assessment

| Risk Item | Impact | Mitigation Implemented |
| :--- | :--- | :--- |
| **Accidental Data Overwrite** | Low | All migrations use `CREATE TABLE IF NOT EXISTS`, `ON CONFLICT DO UPDATE`, and non-destructive checks. |
| **Unauthorized Admin Escalation** | Critical | Admin authorization is derived strictly from `public.admin_users` via server-side Security Definer `is_admin()`, never client booleans. |
| **Deed Document Leakage** | High | The `verification-documents` bucket is set to `public: FALSE` with explicit RLS limiting access strictly to the uploader and verified active admins. |
| **Villa Schema Pollution** | Medium | No Villa, house, vacation, or booking tables were created. Property types are strictly constrained to `flat`, `room`, `pg`, `studio`. |

---

## 5. Steps to Apply Migrations in Supabase Dashboard

If using the Supabase Web Dashboard:
1. Open the **REHVO Supabase Project** dashboard.
2. Navigate to the **SQL Editor** tab.
3. Paste the contents of `supabase/schema.sql` (or run migrations `001` through `011` sequentially) and click **Run**.
4. To provision the initial Super Admin, run:
   ```sql
   SELECT public.provision_super_admin('admin@rehvo.com', 'Antigravity Super Admin');
   ```
5. Navigate to **Storage** to confirm the 4 buckets (`property-images`, `profile-images`, `flatmate-images`, `verification-documents`) are active with their policies.
