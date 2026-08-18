# REHVO — Authentication System Complete & Stable in Expo Go Report

**Date**: August 18, 2026  
**Target Environment**: Expo Go (Local Development & Testing)  
**Backend**: Supabase South Asia (Mumbai / `ap-south-1`) — `https://xoskechmxzgfajkfpssv.supabase.co`  
**Mobile Framework**: Expo SDK 54 / React Native 0.76 (New Architecture)

---

## 1. Auth Architecture Overview

| Component | Source of Truth | Location | Details |
|---|---|---|---|
| **Auth Gateway** | Supabase Auth (GoTrue) | [`src/lib/supabase.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/lib/supabase.ts) | Reads `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from `.env.local` / `.env`. Token stored in `AsyncStorage` (`rehvo_supabase_auth_token`). |
| **Auth Service** | Supabase Auth API wrapper | [`src/services/auth.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/auth.ts) | `signUpWithEmail`, `signInWithEmail`, `signInWithPhone`, `verifyPhoneOtp`, `signOut`, `resetPassword`, `getSession`, `deleteAccount`. |
| **Profile Service** | `public.profiles` table | [`src/services/profile.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/profile.ts) | `getProfile`, `updateProfile`, `uploadProfilePhoto`, `ensureProfileExists`. |
| **Client State** | Zustand Store | [`src/store/useAppStore.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/store/useAppStore.ts) | Manages `user`, `isAuthenticated`, `isOnboarded`, `currentRole`, real properties, flatmates, visits, enquiries, conversations, notifications. Zero mock seed users. |
| **Auth Lifecycle** | Root App Listener | [`app/_layout.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/_layout.tsx) | Exactly **ONE** canonical `supabase.auth.onAuthStateChange()` listener handling `SIGNED_IN`, `SIGNED_OUT`, `TOKEN_REFRESHED`, and `USER_UPDATED`. |

---

## 2. Detailed Flow Specifications

### 2.1. Signup Flow
1. User enters Full Name, Email, Phone, Password ($\ge 8$ chars), and Confirm Password on [`SignUpScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/auth/SignUpScreen.tsx).
2. `authService.signUpWithEmail()` executes `supabase.auth.signUp()`.
3. Supabase Auth inserts record into `auth.users` with metadata (`full_name`, `phone`, `role: 'renter'`).
4. Real database trigger `on_auth_user_created` fires `AFTER INSERT ON auth.users`, automatically inserting a corresponding row into `public.profiles` (`id = NEW.id`).
5. Safe reconciliation `ensureProfileExists()` verifies the profile row and synchronizes it with client state.
6. User proceeds to role selection / onboarding flow.

### 2.2. Login Flow
1. User enters Email and Password on [`LoginScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/auth/LoginScreen.tsx).
2. `authService.signInWithEmail()` executes `supabase.auth.signInWithPassword()`.
3. On authentication success, `ensureProfileExists()` fetches the verified profile from `public.profiles`.
4. Zustand store syncs `user`, `isAuthenticated: true`, and loads saved properties, flatmate profile, enquiries, visits, and notifications.
5. If `onboarding_completed: false`, navigates to onboarding; otherwise routes directly to `/(renter)/home` or `/(owner)/dashboard`.

### 2.3. Email Confirmation Behavior
* **When "Confirm Email" is ENABLED**:
  - `signUpWithEmail()` creates the user with `email_confirmed_at = NULL`.
  - Unconfirmed sign-in returns `AuthApiError: Email not confirmed` (400), mapped cleanly to: `"Please verify your email address before signing in. Check your inbox for a confirmation link."`
* **When "Confirm Email" is DISABLED / After Confirmation**:
  - `signInWithEmail()` succeeds, generates JWT session, and loads user profile into app.

### 2.4. Session Restoration
* On app startup, `RootLayout` invokes `initializeFromStorage()` and queries `supabase.auth.getSession()`.
* If a valid refresh token exists in `AsyncStorage`, the session is restored silently and the full profile is loaded from `public.profiles` without requiring password re-entry.

### 2.5. Logout & Account Switch Isolation
* `logout()` executes `supabase.auth.signOut()` and wipes all client state:
  - Clears `user`, `isAuthenticated`, `savedPropertyIds`, `savedFlatmateIds`, `myFlatmateProfile`, `flatmateDraft`, `visits`, `enquiries`, `conversations`, `notifications`.
  - Removes storage keys: `rehvo_auth_session`, `rehvo_saved_ids`, `rehvo_saved_flatmate_ids`, `rehvo_my_flatmate_profile`, `rehvo_flatmate_draft`, `rehvo_supabase_auth_token`.
* When User B logs in following User A's logout, **ZERO** private data from User A is retained or visible.

### 2.6. Password Reset Flow
* `resetPassword(email)` triggers `supabase.auth.resetPasswordForEmail()`.
* Success screen displays a confirmation notice with masked email address (`yo***y@gmail.com`) and direct email client launcher.

### 2.7. Account Deletion Path
* `deleteAccount(userId)` soft-deletes the profile in `public.profiles` (`full_name: 'Deleted User'`, `is_blocked: true`, `profile_photo: null`), wipes all client storage, and signs out.
* Complete purge of `auth.users` record is preserved for privileged backend Admin operations via Supabase service-role.

---

## 3. Expo Go Test Matrix Results

All 12 required test cases were executed and validated against the live Mumbai Supabase database:

| # | Test Scenario | Expected Outcome | Result |
|---|---|---|:---:|
| **1** | **Fresh App (No session)** | Client starts in unauthenticated state; no active session | **PASS** |
| **2** | **Signup New User** | Real `auth.users` row created via `signUp()` | **PASS** |
| **3** | **Profile Provisioning** | Matching `public.profiles` row created (`profiles.id = auth.users.id`) by `on_auth_user_created` trigger | **PASS** |
| **4** | **Complete Onboarding** | Authenticated user profile updated (`city`, `locality`, `occupation`) | **PASS** |
| **5A** | **Unconfirmed Email Attempt** | Unconfirmed login safely rejected with friendly "Email not confirmed" error | **PASS** |
| **5B** | **Logout Cleanup** | `signOut()` clears session, profile cache, and all user data | **PASS** |
| **6** | **Login Existing User** | `signInWithPassword()` succeeds, restores profile from `public.profiles` | **PASS** |
| **7** | **Session Restoration** | Active session restored on relaunch from `AsyncStorage` token cache | **PASS** |
| **8** | **Wrong Password Handling** | Invalid credentials rejected with friendly error (Status 400) | **PASS** |
| **9** | **Forgot Password Request** | `resetPasswordForEmail()` accepted by Supabase | **PASS** |
| **10** | **Account Switch Isolation** | User A logout $\rightarrow$ User B login; ZERO User A data visible | **PASS** |
| **11** | **Profile Photo Storage** | Storage bucket `profile-images` verified and active | **PASS** |
| **12** | **RLS Cross-User Protection** | User B blocked from modifying User A's profile by PostgreSQL RLS | **PASS** |

---

## 4. Security & Quality Assurance

* [x] **Zero Mock Users / Seed User Spreading**: Verified all initial state defaults to empty arrays (`[]`) and fetches live data from Supabase.
* [x] **Zero Hardcoded Secrets**: `SUPABASE_SERVICE_ROLE_KEY` is completely omitted from the mobile codebase.
* [x] **TypeScript Typecheck (`npx tsc --noEmit`)**: **0 errors**
* [x] **Admin Web Typecheck (`cd admin && npm run typecheck`)**: **0 errors**

---

## 5. Scope Boundaries for Next Phases

1. **Google Sign-In**: Deferred to the subsequent OAuth phase as instructed.
2. **Native EAS Builds**: No EAS build commands were run in this phase (`eas build` / `eas submit` skipped).
3. **Password Reset Deep Link Callback**: The email request flow is active. Native deep linking configuration (`rehvo://reset-password`) will be paired with the native EAS build phase.
