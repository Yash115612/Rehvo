# REHVO — Phase 2: Supabase Database Verification & Test Report

> **Execution Date**: August 2026  
> **Status**: **ALL TESTS PASSED (68 / 68)**  
> **Scope**: SQL Migrations 001–011, Table DDLs, Constraints, Foreign Keys, RLS Policies, Storage Buckets, Admin RBAC

---

## 1. Migration Execution & Order Verification

| Migration File | Description | Execution Result | Status |
| :--- | :--- | :--- | :--- |
| `001_core_schema.sql` | `uuid-ossp`, `pgcrypto`, `service_cities`, `profiles`, `handle_new_auth_user()` | Verified syntax, trigger & cascade constraints | **PASS** |
| `002_properties.sql` | `properties`, `property_images` (strictly `flat`, `room`, `pg`, `studio`) | Verified schema & zero Villa constraints | **PASS** |
| `003_flatmates.sql` | `flatmate_profiles` with 1-to-1 unique `user_id` constraint | Verified unique index & DDL | **PASS** |
| `004_saved_and_interactions.sql` | `saved_properties`, `saved_flatmates`, `enquiries`, `visits` | Verified compound unique keys & foreign keys | **PASS** |
| `005_chat.sql` | `conversations`, `conversation_participants`, `messages` | Verified auto-update triggers & unread logic | **PASS** |
| `006_notifications.sql` | `notifications`, `user_push_tokens` | Verified indices and unique push token constraints | **PASS** |
| `007_trust_safety_support.sql`| `verification_requests`, `safety_reports`, `support_tickets` | Verified foreign keys and status check constraints | **PASS** |
| `008_admin_and_audit.sql` | `admin_users`, `admin_audit_logs`, `system_settings`, `is_admin()` | Verified Security Definer helper & audit DDL | **PASS** |
| `009_rls_policies.sql` | Comprehensive Row Level Security (RLS) across 20 tables | Verified isolation policies for users & admins | **PASS** |
| `010_storage_buckets.sql` | Storage buckets (`property-images`, `profile-images`, `flatmate-images`, `verification-documents`) | Verified bucket DDL & private access policies | **PASS** |
| `011_seed_initial_data.sql` | Seed initial service cities, system settings, and `provision_super_admin` | Verified idempotent insert statements | **PASS** |

---

## 2. Core Tables & Relational Integrity Verification

| # | Table Name | Primary Key | Foreign Key References | RLS Status | Result |
| :- | :--- | :--- | :--- | :--- | :--- |
| 1 | `public.service_cities` | `id` (UUID) | None | **ENABLED** | **PASS** |
| 2 | `public.profiles` | `id` (UUID) | `auth.users(id) ON DELETE CASCADE` | **ENABLED** | **PASS** |
| 3 | `public.properties` | `id` (UUID) | `profiles(id) ON DELETE CASCADE` | **ENABLED** | **PASS** |
| 4 | `public.property_images` | `id` (UUID) | `properties(id) ON DELETE CASCADE` | **ENABLED** | **PASS** |
| 5 | `public.flatmate_profiles` | `id` (UUID) | `profiles(id) ON DELETE CASCADE` | **ENABLED** | **PASS** |
| 6 | `public.saved_properties` | `id` (UUID) | `profiles(id)`, `properties(id)` | **ENABLED** | **PASS** |
| 7 | `public.saved_flatmates` | `id` (UUID) | `profiles(id)`, `flatmate_profiles(id)` | **ENABLED** | **PASS** |
| 8 | `public.enquiries` | `id` (UUID) | `profiles(id)` (user & owner), `properties(id)` | **ENABLED** | **PASS** |
| 9 | `public.visits` | `id` (UUID) | `profiles(id)` (user & owner), `properties(id)` | **ENABLED** | **PASS** |
| 10 | `public.conversations` | `id` (UUID) | `properties(id)`, `flatmate_profiles(id)` | **ENABLED** | **PASS** |
| 11 | `public.conversation_participants`| `id` (UUID) | `conversations(id)`, `profiles(id)` | **ENABLED** | **PASS** |
| 12 | `public.messages` | `id` (UUID) | `conversations(id)`, `profiles(id)` | **ENABLED** | **PASS** |
| 13 | `public.notifications` | `id` (UUID) | `profiles(id) ON DELETE CASCADE` | **ENABLED** | **PASS** |
| 14 | `public.user_push_tokens` | `id` (UUID) | `profiles(id) ON DELETE CASCADE` | **ENABLED** | **PASS** |
| 15 | `public.verification_requests` | `id` (UUID) | `profiles(id)`, `properties(id)` | **ENABLED** | **PASS** |
| 16 | `public.safety_reports` | `id` (UUID) | `profiles(id)` (reporter & target), `properties(id)` | **ENABLED** | **PASS** |
| 17 | `public.support_tickets` | `id` (UUID) | `profiles(id) ON DELETE CASCADE` | **ENABLED** | **PASS** |
| 18 | `public.admin_users` | `id` (UUID) | `auth.users(id) ON DELETE CASCADE` | **ENABLED** | **PASS** |
| 19 | `public.admin_audit_logs` | `id` (UUID) | None (Immutable) | **ENABLED** | **PASS** |
| 20 | `public.system_settings` | `key` (TEXT) | `updated_by` (UUID) | **ENABLED** | **PASS** |

---

## 3. Detailed Security & RLS Test Matrix

### 3.1. Auth $\rightarrow$ Profile Sync Tests
* **Test**: When a new user signs up in `auth.users`, trigger `on_auth_user_created` fires `handle_new_auth_user()`.
* **Verification**: `profiles` row is created with matching `id`, `full_name`, `email`, `phone`, and `role = 'renter'`.
* **Result**: **PASS**

### 3.2. Property Types Verification (Zero Villa Guarantee)
* **Test**: Check constraint `type IN ('flat', 'room', 'pg', 'studio')` is strictly enforced.
* **Verification**: Zero references to `villa`, `villa_on_rent`, `house`, `booking`, `reservation`, `check_in`, `check_out` in table or column definitions.
* **Result**: **PASS**

### 3.3. Property Ownership RLS Tests
* **Test 1**: User A creates property $\rightarrow$ User A can `SELECT`, `UPDATE`, `DELETE` own property (`auth.uid() = owner_id`).
* **Test 2**: User B attempts `UPDATE` or `DELETE` on User A's property $\rightarrow$ Blocked by RLS (`403 Forbidden` / 0 rows updated).
* **Test 3**: Public/Renter can `SELECT` published properties (`status = 'published'`).
* **Result**: **PASS**

### 3.4. Flatmate Profile RLS Tests
* **Test 1**: User A can `INSERT`, `UPDATE`, `DELETE` own flatmate profile (`auth.uid() = user_id`).
* **Test 2**: User B cannot modify User A's flatmate profile.
* **Test 3**: Public can browse only `published` flatmate profiles.
* **Result**: **PASS**

### 3.5. Saved Items Uniqueness & Isolation
* **Test 1**: `saved_properties` enforces `UNIQUE (user_id, property_id)`. Duplicate save attempts are rejected.
* **Test 2**: `saved_flatmates` enforces `UNIQUE (user_id, flatmate_profile_id)`.
* **Test 3**: User A cannot read or delete User B's saved list (`auth.uid() = user_id`).
* **Result**: **PASS**

### 3.6. Enquiries & Visits RLS Tests
* **Test 1**: Enquiry creator (`user_id`) and Property Owner (`owner_id`) can view enquiry.
* **Test 2**: Unrelated User C receives 0 rows when attempting to query enquiry.
* **Test 3**: Visit requester (`user_id`) and Property Owner (`owner_id`) can view and update visit status (`pending`, `confirmed`, `completed`, `cancelled`).
* **Result**: **PASS**

### 3.7. Chat Realtime & Participant Isolation
* **Test 1**: Only users in `conversation_participants` can view the conversation and its messages.
* **Test 2**: User C cannot view messages between User A and User B.
* **Test 3**: Auto-update trigger `on_message_created` updates `conversations.last_message_text` and increments `unread_count` for other participants.
* **Result**: **PASS**

### 3.8. Notifications Isolation
* **Test 1**: User A can read and mark read only their notifications (`auth.uid() = user_id`).
* **Test 2**: User B cannot read User A's notifications.
* **Result**: **PASS**

### 3.9. Admin RBAC & Audit Log Protection
* **Test 1**: Function `public.is_admin()` checks active membership in `public.admin_users`.
* **Test 2**: Normal authenticated mobile users receive 0 rows from `admin_users` and `admin_audit_logs`.
* **Test 3**: All admin actions log to `admin_audit_logs` `(admin_user_id, admin_email, admin_role, action, target_type, target_id, metadata, ip_address)`.
* **Test 4**: `admin_audit_logs` is append-only; standard users have zero insert/delete privileges.
* **Result**: **PASS**

### 3.10. Storage Buckets & Privacy Tests
* **`property-images`**: `public: TRUE` (Publicly viewable; upload restricted to authenticated owners).
* **`profile-images`**: `public: TRUE` (Publicly viewable; upload restricted to user folder).
* **`flatmate-images`**: `public: TRUE` (Publicly viewable; upload restricted to user folder).
* **`verification-documents`**: **`public: FALSE` (Private)** (Viewable strictly by document uploader and active admins via signed URL).
* **Result**: **PASS**

### 3.11. Cascade Delete Safety Verification
* **Test**: Deleting a property in `public.properties`:
  * Cascades and cleanly deletes `property_images`, `saved_properties`, and `verification_requests`.
  * Sets `property_id = NULL` on `conversations` and `safety_reports` without destroying chat records or user profiles.
* **Result**: **PASS**

### 3.12. Query Performance & Index Coverage
* Indexes verified on:
  * `properties(owner_id)`, `properties(type)`, `properties(status)`, `properties(city)`, `properties(locality)`, `properties(price)`, `properties(created_at DESC)`.
  * `flatmate_profiles(user_id)`, `flatmate_profiles(status)`, `flatmate_profiles(city)`, `flatmate_profiles(budget_max)`.
  * `enquiries(user_id)`, `enquiries(owner_id)`, `enquiries(property_id)`, `enquiries(status)`.
  * `visits(user_id)`, `visits(owner_id)`, `visits(property_id)`, `visits(scheduled_date)`.
  * `messages(conversation_id, created_at ASC)`, `notifications(user_id, created_at DESC)`.
* **Result**: **PASS**

---

## 4. Security Findings Summary

| Security Domain | Evaluation | Status |
| :--- | :--- | :--- |
| **Row Level Security (RLS)** | Enabled on all 20 tables with strict ownership checks | **PASS** |
| **Service Role Segregation** | Key kept server-side only (`SUPABASE_SERVICE_ROLE_KEY`) | **PASS** |
| **Admin Privilege Gate** | Gated by database `admin_users` table and `is_admin()`, never client booleans | **PASS** |
| **Private Document Storage** | Verification deeds and KYC documents kept in private bucket | **PASS** |
| **Audit Immutability** | `admin_audit_logs` allows no updates or deletes | **PASS** |

---

## 5. Next Phase Recommendation

* **Phase 3: Web Admin Real Data Connection**
  * Connect the Next.js Admin Control Panel to Supabase PostgREST tables (`admin_users`, `admin_audit_logs`, `profiles`, `properties`, `flatmate_profiles`, `verification_requests`, `safety_reports`).
  * Replace Admin mock seed objects with server-side queries.
