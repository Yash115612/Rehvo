# REHVO — Phase 12: Production Security & RLS Audit Report

> **Execution Date**: August 2026  
> **Status**: **AUDIT COMPLETE — ALL SECURITY POLICIES PASS**  
> **Scope**: Authentication security, Supabase client security, environment variable exposure, RLS validation across all 11 database domains, storage bucket privacy, and administrative RBAC.

---

## 1. Authentication & Session Lifecycle Security

| Test Item | Verification Method | Result | Evidence / Implementation Details | Fix Applied | Retest Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **No Fallback Fake Auth** | Code inspection of `src/store/useAppStore.ts` & `src/lib/supabase.ts` | **PASS** | Session tokens and user profiles are driven exclusively by Supabase Auth sessions. | None needed | **PASS** |
| **No Cross-User Session Leakage** | Audit `logout` and `deleteAccount` routines | **PASS** | `logout` and `deleteAccount` explicitly invoke `supabase.auth.signOut()`, unregister device push tokens, and clear `AsyncStorage` (`rehvo_auth_session`, `rehvo_saved_ids`, `rehvo_saved_flatmate_ids`, `rehvo_my_flatmate_profile`, `rehvo_flatmate_draft`, `rehvo_supabase_auth_token`). | Hardened `deleteAccount` to clear push tokens and notifications | **PASS** |
| **Canonical Auth State Listener** | Root layout auth guard in `app/_layout.tsx` | **PASS** | Single canonical listener synchronizes profile state on auth state changes. | None needed | **PASS** |
| **User Isolation on Re-login** | User A login → Logout → User B login simulation | **PASS** | User B initializes fresh state from Supabase (`fetchSavedIds`, `fetchMyProperties`, `fetchMyFlatmateProfile`, `fetchEnquiries`, `fetchVisits`, `fetchConversations`, `fetchNotifications`). | None needed | **PASS** |

---

## 2. Supabase Client & Secret Key Auditing

| Test Item | Target Files | Result | Evidence / Details | Fix Applied | Retest Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Publishable Key Client-Side** | `src/lib/supabase.ts`, `admin/src/lib/supabase/client.ts` | **PASS** | Only publishable/anon keys are used in client bundles and mobile runtime. | None needed | **PASS** |
| **Service Role Segregation** | `admin/src/lib/supabase/admin.ts` | **PASS** | `SUPABASE_SERVICE_ROLE_KEY` is loaded only in Node.js server context with runtime safety guards throwing on browser execution. | None needed | **PASS** |
| **Zero Secret Token Exposure in Git** | Global repo search (`SUPABASE_SERVICE_ROLE_KEY`, `sbp_`, `eyJ`) | **PASS** | Zero unencrypted JWTs, private keys, or credentials committed. Both `.gitignore` files ignore `.env*` and exclude `.env.example`. | None needed | **PASS** |

---

## 3. PostgreSQL Row-Level Security (RLS) Matrix

All tables have `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` verified.

| Database Table | RLS Policy Configuration | Unauthorized Actor Result | Verified Status |
| :--- | :--- | :--- | :--- |
| **`public.profiles`** | Public read for discoverable user cards. Self-only update (`auth.uid() = id`). | Blocked from updating other user rows | **PASS** |
| **`public.properties`** | Public read for `active` properties. Owner-only CRUD (`auth.uid() = owner_id`). | Cannot update or delete another owner's property | **PASS** |
| **`public.property_images`** | Public read. Owner-only insert/delete linked via property ownership check. | Cannot add or delete images on unowned properties | **PASS** |
| **`public.flatmate_profiles`** | Public read for `active` status. Self-only insert/update/delete (`auth.uid() = user_id`). | Paused/draft profiles invisible to search | **PASS** |
| **`public.saved_properties`** | Self-only select/insert/delete (`auth.uid() = user_id`). | Blocked from reading or modifying another user's bookmarks | **PASS** |
| **`public.saved_flatmates`** | Self-only select/insert/delete (`auth.uid() = user_id`). | Blocked from reading or modifying another user's bookmarks | **PASS** |
| **`public.enquiries`** | Accessible only by renter (`auth.uid() = user_id`) or property owner (`auth.uid() = owner_id`). | Unrelated users blocked from viewing enquiries | **PASS** |
| **`public.visits`** | Accessible only by renter (`auth.uid() = user_id`) or property owner (`auth.uid() = owner_id`). | Unrelated users blocked from viewing tours | **PASS** |
| **`public.conversations`** | Accessible only by conversation participants. | Direct route with unjoined ID returns 0 rows | **PASS** |
| **`public.messages`** | Accessible only by participants of the conversation. Sender ID validated against `auth.uid()`. | Cannot inject messages into third-party conversations | **PASS** |
| **`public.notifications`** | Self-only select/update (`auth.uid() = user_id`). | Blocked from viewing or marking read other user notifications | **PASS** |
| **`public.user_push_tokens`** | Self-only insert/update/delete (`auth.uid() = user_id`). | Cannot hijack or read push endpoints of other devices | **PASS** |
| **`public.admin_users`** | Read/write restricted to active admin staff and service-role. | Regular mobile users have 0 access | **PASS** |
| **`public.admin_audit_logs`** | Append-only. No UPDATE or DELETE policies exist. | Audit logs cannot be tampered with or deleted | **PASS** |
| **`public.system_settings`** | Public read for global flags. Mutations restricted to Super Admins. | Regular users blocked from changing platform parameters | **PASS** |

---

## 4. Storage Bucket Security

| Bucket Name | Public / Private | Allowed MIME Types | Access Policy | Result |
| :--- | :--- | :--- | :--- | :--- |
| **`property-images`** | Public | JPEG, PNG, WebP | Owner authenticated upload; Public read | **PASS** |
| **`profile-images`** | Public | JPEG, PNG, WebP | User authenticated upload; Public read | **PASS** |
| **`flatmate-images`** | Public | JPEG, PNG, WebP | Seeker authenticated upload; Public read | **PASS** |
| **`verification-documents`** | **PRIVATE** | PDF, JPEG, PNG, WebP | **Uploader & Admin only**; Signed URL required | **PASS** |

---

## 5. Security Verdict

* **Vulnerabilities Discovered**: 0 Critical, 0 High, 0 Medium.
* **RLS Enforcement**: 100% of public tables have Row-Level Security actively enabled.
* **Data Leakage Risk**: Verified zero cross-session or client bundle leakage.
