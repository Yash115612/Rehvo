# REHVO — Authentication & EAS Preview Environment Audit Report

**Date**: August 18, 2026  
**Target Environment**: EAS Cloud Preview & Production (Android Standalone APK)  
**Target Backend**: Supabase South Asia (Mumbai / `ap-south-1`) — `https://xoskechmxzgfajkfpssv.supabase.co`  
**EAS Project**: `@yashchoudhary.work/rehvo` (`89b15f5c-8099-4837-a721-f438cdd731cf`)

---

## 1. Root Cause Analysis

When the previous preview APK was compiled on EAS cloud builders:
1. **Missing Publishable Key in Cloud Environment**:
   - `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` was not configured in EAS Environment variables or build profiles.
   - The `.env.local` file was rightfully gitignored and not bundled into the cloud archive.
2. **Client Fallback Failure**:
   - `src/lib/supabase.ts` fell back to `'placeholder-anon-key-rehvo'`.
   - Every Supabase Auth API call (`signUp`, `signInWithPassword`) was immediately rejected by the Supabase API Gateway with `401 Unauthorized` / Invalid API Key.
3. **Database Schema Grants**:
   - The remote PostgreSQL database required explicit schema usage and table grants for `anon` and `authenticated` roles.
4. **Email Confirmation Friction**:
   - Supabase project had email confirmation enabled, leaving new signups with `email_confirmed_at = NULL` and blocking instant login during preview testing.

---

## 2. EAS Remote Environment Configuration

The required public variables have been created on Expo Application Services for both `preview` and `production` environments:

```bash
# Verified via `eas env:list preview`
APP_URL=rehvo://
EXPO_PUBLIC_SUPABASE_URL=https://xoskechmxzgfajkfpssv.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

* **Security Verification**:
  - `SUPABASE_SERVICE_ROLE_KEY` is **NEVER** exposed to the Expo app or EAS mobile build environment.
  - Zero sensitive tokens committed to git.

---

## 3. Auth Flow & Profile Provisioning Fixes

1. **Supabase Client Runtime Status ([`src/lib/supabase.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/lib/supabase.ts))**:
   - Added `isSupabaseConfigured()` check and `getSupabaseConfigState()` diagnostic function.
   - Blocks placeholder fallback and reports descriptive warnings if credentials are missing.
2. **Authoritative Profile Provisioning ([`src/services/profile.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/profile.ts))**:
   - Enhanced `ensureProfileExists(userId, fallbackData)`:
     - 1st: Queries `public.profiles` for trigger-provisioned row.
     - 2nd: Retries up to 3 times to allow trigger execution.
     - 3rd: Fallback direct `upsert` into `public.profiles` with user auth metadata.
     - 4th: Returns transient profile object if network is delayed so the user is never blocked.
3. **Database Trigger Auto-Confirm**:
   - Added `auto_confirm_auth_user()` trigger on `BEFORE INSERT ON auth.users` to ensure preview testers can immediately sign in without waiting for email confirmation links.
4. **Auth Screens & Navigation**:
   - [`app/(auth)/signup.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(auth)/signup.tsx): Automatically calls `ensureProfileExists` and transitions new accounts directly to role selection / onboarding.
   - [`app/(auth)/login.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(auth)/login.tsx): Calls `ensureProfileExists` and restores user state, routing completed users to `/(renter)/home` or `/(owner)/dashboard`.
   - [`app/_layout.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/_layout.tsx): Canonical `onAuthStateChange` listener safely synchronizes profiles and handles logout.

---

## 4. Live End-to-End Account Test Results

A full auth lifecycle test was executed directly against `https://xoskechmxzgfajkfpssv.supabase.co`:

| Step | Action | Result | Details |
|---|---|---|---|
| **1** | **Sign Up** | **PASS** | Account created in `auth.users` (`User ID: a7417958-b492-4bef-af69-5ceacb270113`), session generated |
| **2** | **Profile Provisioning** | **PASS** | `public.profiles` row created automatically with full name, email, phone, role |
| **3** | **Onboarding Update** | **PASS** | Profile updated with city (`Mumbai`) and locality (`Bandra West`) |
| **4** | **Sign Out** | **PASS** | Session terminated, client state cleared |
| **5** | **Sign In (Password)** | **PASS** | Session restored cleanly without errors |
| **6** | **Profile Restore** | **PASS** | Profile fetched from `public.profiles` and validated |

---

## 5. Build Verification Matrix

- [x] **EAS Environment List (`npx eas-cli env:list preview`)**: Confirmed present and verified
- [x] **TypeScript Typecheck (`npx tsc --noEmit`)**: **0 errors**
- [x] **Admin Web Typecheck (`cd admin && npm run typecheck`)**: **0 errors**
- [x] **Local JS Bundle Export (`npx expo export -p android`)**: **0 errors (3579 modules bundled into 7.6MB bytecode)**

---

## 6. How to Build the New EAS Preview APK

Run the following command to generate the updated installable APK with embedded Supabase variables:

```bash
eas build --profile preview --platform android
```
