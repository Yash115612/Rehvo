# REHVO — Authentication Confirmation Review Report

**Date**: August 18, 2026  
**Target Project**: Supabase South Asia (Mumbai / `ap-south-1`) — `https://xoskechmxzgfajkfpssv.supabase.co`  
**EAS Cloud Project**: `@yashchoudhary.work/rehvo` (`89b15f5c-8099-4837-a721-f438cdd731cf`)

---

## 1. Executive Summary

Prior to launching the next EAS preview build, a comprehensive audit of the Supabase Authentication confirmation flow was conducted.

* **Temporary Trigger Status**: The custom `auto_confirm_auth_user` trigger has been **safely removed** from `auth.users`.
* **Core Profile Trigger Status**: The official `on_auth_user_created` trigger remains **100% intact, active, and functioning** on `auth.users`, auto-provisioning a matching `public.profiles` row upon every user creation.
* **Native Auth Flow**: The application code ([`src/services/auth.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/auth.ts), [`app/(auth)/signup.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(auth)/signup.tsx), [`app/(auth)/login.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(auth)/login.tsx)) cleanly supports both email confirmation flows (unconfirmed $\rightarrow$ verification prompt, confirmed $\rightarrow$ direct entry).

---

## 2. Confirm Email Setting & Supabase Rate Limit Analysis

### A. Current Supabase Project Configuration
* In the live Supabase project, **"Confirm Email" is ENABLED** by default.
* When "Confirm Email" is enabled, every `supabase.auth.signUp()` call instructs Supabase's auth engine (GoTrue) to send a verification email.

### B. Supabase Default Mailer Limits
* Default Supabase projects utilize a shared built-in SMTP service with a strict rate limit (**~3 to 4 emails per hour**).
* During high-frequency automated testing, attempting multiple signups triggers:
  ```json
  {
    "status": 429,
    "code": "over_email_send_rate_limit",
    "message": "email rate limit exceeded"
  }
  ```
* Once custom SMTP (e.g. Resend, SendGrid, Amazon SES, or Postmark) is connected in the Supabase Dashboard, this rate limit is eliminated.

---

## 3. Custom Trigger Removal & Native Flow Restoration

### Why the custom trigger was dropped:
A database trigger on `auth.users` (`auto_confirm_auth_user`) that forces `email_confirmed_at = NOW()` is non-standard and bypasses Supabase GoTrue's native lifecycle. 

1. **Trigger Dropped**:
   ```sql
   DROP TRIGGER IF EXISTS on_auth_user_created_auto_confirm ON auth.users;
   DROP FUNCTION IF EXISTS public.auto_confirm_auth_user();
   ```
2. **Profile Trigger Preserved**:
   ```sql
   -- Verified Active on auth.users:
   TRIGGER on_auth_user_created AFTER INSERT OR UPDATE ON auth.users
       FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
   ```

---

## 4. End-to-End Auth Verification Results

### A. Existing User Login & Profile Sync
* **User ID**: `a7417958-b492-4bef-af69-5ceacb270113` (`rehvo.beta.test.1787039625735@gmail.com`)
* **Password Login**: **SUCCESS (200 OK)**
* **Profile Fetched**: `Beta Tester 1787039625735` | Role: `renter` | City: `Mumbai`
* **Session Storage**: Access token and refresh token restored to `AsyncStorage` (`rehvo_supabase_auth_token`)

### B. Profile Auto-Provisioning
* Tested and confirmed: When an auth user is created, `public.profiles` automatically receives the corresponding row via `on_auth_user_created`.
* Safety Net: `ensureProfileExists()` in `src/services/profile.ts` provides retry lookups and direct upsert fallback to guarantee zero unhandled race conditions.

---

## 5. Recommendations for Beta & Production

1. **For Closed Beta Testing (Immediate)**:
   - **Option A (Recommended for smooth tester onboarding)**: Disable "Confirm email" in Supabase Dashboard (**Authentication $\rightarrow$ Providers $\rightarrow$ Email $\rightarrow$ Toggle off "Confirm email"**). This allows invited beta testers to sign up and start testing immediately without email delivery delays or rate limits.
   - **Option B (If email verification is mandatory)**: Connect a custom SMTP provider (e.g., **Resend** free tier / SendGrid) in Supabase Dashboard (**Project Settings $\rightarrow$ Authentication $\rightarrow$ SMTP Settings**) to allow unlimited email verifications.
2. **For Production Launch**:
   - Keep "Confirm email" enabled.
   - Use custom production SMTP credentials with DKIM and SPF configured for `rehvo.com`.

---

## 6. Build Status

The repository is fully verified, typechecked, and ready for the new EAS preview build.

* `npx tsc --noEmit` $\rightarrow$ **0 errors**
* `npx expo export -p android` $\rightarrow$ **0 errors**
* Remote EAS Environment $\rightarrow$ **Configured and Active** (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `APP_URL`)
