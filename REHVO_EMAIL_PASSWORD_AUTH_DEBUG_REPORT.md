# REHVO — Email/Password Authentication End-to-End Debug & Fix Report

**Date**: August 18, 2026  
**Target Environments**: Expo Go (Local Development) & Native EAS Builds  
**Backend**: Supabase South Asia (Mumbai / `ap-south-1`) — `https://xoskechmxzgfajkfpssv.supabase.co`

---

## 1. Executive Summary & Root Cause Analysis

### What Was Failing:
1. **Unconfirmed User Login Masking**:
   - In Supabase Auth, when an unconfirmed user attempts to log in with `signInWithPassword()`, Supabase returns HTTP status `400` with `message: "Email not confirmed"` (`code: "email_not_confirmed"`).
   - In [`src/services/auth.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/auth.ts), `status === 400` was evaluated as a blanket check before specific error message checks, erroneously converting **all** 400 errors into `"Incorrect email or password. Please check your credentials and try again."`
2. **Signup Confirmation Navigation Flow**:
   - When "Confirm Email" is active in Supabase, `signUpWithEmail()` creates the user without an active session (`session: null`).
   - The signup screen was previously calling `login()` and navigating immediately to `/(auth)/onboarding`, where the app attempted to perform authenticated RLS updates without a valid JWT token (`auth.uid() = null`), resulting in RLS rejections (`PGRST116`).
3. **Password Character Handling**:
   - Verified that passwords are never trimmed or altered by UI input handlers, preserving special characters and exact whitespace.

---

## 2. Fixes Applied

### 2.1. Refactored Error Mapping & Safe Diagnostics ([`src/services/auth.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/auth.ts))
- Reordered error matching so specific Supabase error codes (`email_not_confirmed`, `user_already_exists`, `weak_password`, `over_email_send_rate_limit`, `invalid_credentials`) are evaluated **before** generic status codes.
- Added safe development diagnostics:
  ```typescript
  if (__DEV__) {
    console.log('[REHVO Auth Diagnostic]', { status, code, message });
  }
  ```
  *(Passwords, JWTs, client secrets, and service-role keys are never logged).*

### 2.2. Handled Email Confirmation State in Signup ([`app/(auth)/signup.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28auth%29/signup.tsx))
- **Case A (Confirmation Required)**: When `result.requiresEmailConfirmation === true`, the app displays a toast prompting the user to verify their email, and safely routes back to `/(auth)/login`.
- **Case B (Confirmation Disabled / Instant Session)**: Provisions the profile, synchronizes the Zustand store, and navigates to `/(auth)/onboarding`.

### 2.3. Form Validation Integrity ([`src/components/auth/SignUpScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/auth/SignUpScreen.tsx))
- Passwords are passed verbatim to `signUpWithEmail()`.
- `onSuccessSignUp()` is only invoked when `!requiresVerification`, preventing unauthenticated users from entering the onboarding flow prematurely.

---

## 3. Direct Supabase Verification Results

Verified against the live Mumbai Supabase backend (`https://xoskechmxzgfajkfpssv.supabase.co`):

| # | Scenario | Supabase Response | User Message Displayed | Result |
|---|---|---|---|:---:|
| **1** | **Confirmed User Login** | `HTTP 200` + Session + User ID | Restores profile and logs in | **PASS** |
| **2** | **Unconfirmed User Login** | `HTTP 400` (`email_not_confirmed`) | *"Please confirm your email before logging in. Check your inbox for a confirmation link."* | **PASS** |
| **3** | **Wrong Password** | `HTTP 400` (`invalid_credentials`) | *"Invalid email or password. Please check your credentials and try again."* | **PASS** |
| **4** | **New Signup Creation** | `HTTP 200` + `auth.users` insertion | Account created + confirmation prompt | **PASS** |
| **5** | **Duplicate Signup** | User exists | *"An account with this email already exists. Please sign in instead."* | **PASS** |
| **6** | **Profile Provisioning** | `on_auth_user_created` trigger | Matching `public.profiles` row provisioned | **PASS** |
| **7** | **Logout Cleanup** | `signOut()` | All session tokens and cached storage cleared | **PASS** |

---

## 4. Test User Audit: `rehvo.test@gmail.com`

- **Database Table**: `auth.users`
- **User ID**: `72c7850d-6fae-4275-aad4-107fce310691`
- **Email**: `rehvo.test@gmail.com`
- **Confirmation State**: `email_confirmed_at: 2026-08-18 08:34:48 UTC` (Confirmed)
- **Profile Row**: `public.profiles` row exists (`id: 72c7850d-6fae-4275-aad4-107fce310691`, `role: renter`, `is_blocked: false`).
- **Account Status**: Active, not banned, and fully functional for login.

---

## 5. Quality & Typecheck Verification

- `npx tsc --noEmit` $\rightarrow$ **0 errors**
- `cd admin && npm run typecheck` $\rightarrow$ **0 errors**
- No changes made to Google OAuth configuration or database schemas.
- No EAS build commands executed.
