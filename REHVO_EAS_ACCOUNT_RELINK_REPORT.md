# REHVO — EAS Account & Project Relinking Report

**Date**: August 18, 2026  
**Active Account**: `yash115`  
**EAS Project Slug**: `rehvo`  
**Backend**: Supabase South Asia (Mumbai / `ap-south-1`) — `https://xoskechmxzgfajkfpssv.supabase.co`

---

## 1. Account & Project Summary

| Parameter | Previous Stale State | Current Active State |
|---|---|---|
| **EAS Account Owner** | `yashchoudhary.work` | `yash115` |
| **EAS Project Full Name** | `@yashchoudhary.work/rehvo` | `@yash115/rehvo` |
| **Project Dashboard** | *(inaccessible)* | [https://expo.dev/accounts/yash115/projects/rehvo](https://expo.dev/accounts/yash115/projects/rehvo) |

---

## 2. Actions Executed

1. **Account Verification**:
   - Verified active login as `yash115` (Role: Owner).
2. **Purged Stale References**:
   - Aligned `app.json` owner to `yash115`.
   - Verified zero remaining references to previous accounts.
3. **Initialized EAS Project**:
   - Linked `@yash115/rehvo`.
4. **Configured EAS Remote Environment Variables**:
   - Populated both `preview` and `production` environments on EAS with:
     - `EXPO_PUBLIC_SUPABASE_URL`: `https://xoskechmxzgfajkfpssv.supabase.co` (Plaintext)
     - `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Sensitive)
     - `APP_URL`: `rehvo://` (Plaintext)
5. **Preserved Google OAuth & Deep Linking Settings**:
   - App scheme: `rehvo://`
   - Callback endpoints: `rehvo://auth/callback`
   - Native modules: `expo-web-browser`, `expo-auth-session`, `expo-crypto`

---

## 3. Verification & Quality Gates

- Project Owner $\rightarrow$ `@yash115/rehvo`
- `npx tsc --noEmit` $\rightarrow$ **0 errors**
- `cd admin && npm run typecheck` $\rightarrow$ **0 errors**

---

## 4. Build Readiness

The local REHVO codebase is completely synchronized with `@yash115/rehvo`.

When you are ready to build the new preview APK, run:
```bash
eas build --profile preview --platform android
```
*(No builds were triggered in this step as instructed).*
