# REHVO — EAS Account & Project Relinking Report

**Date**: August 18, 2026  
**Active Account**: `yashchoudhary1155` (`yashchoudhary47235@gmail.com`)  
**EAS Project Slug**: `rehvo`  
**Backend**: Supabase South Asia (Mumbai / `ap-south-1`) — `https://xoskechmxzgfajkfpssv.supabase.co`

---

## 1. Account & Project Summary

| Parameter | Previous Stale State | Current Active State |
|---|---|---|
| **EAS Account Owner** | `yashchoudhary.work` | `yashchoudhary1155` |
| **EAS Account Email** | *(inaccessible)* | `yashchoudhary47235@gmail.com` |
| **EAS Project ID** | `3a035748-ef87-409c-aa5e-4cefcc914e7c` *(purged)* | `0a82c7ce-1ade-457b-8d67-8a9640ebed53` |
| **EAS Project Full Name** | `@yashchoudhary.work/rehvo` | `@yashchoudhary1155/rehvo` |
| **Project Dashboard** | *(inaccessible)* | [https://expo.dev/accounts/yashchoudhary1155/projects/rehvo](https://expo.dev/accounts/yashchoudhary1155/projects/rehvo) |

---

## 2. Actions Executed

1. **Account Verification**:
   - Ran `eas whoami` and verified active login as `yashchoudhary1155` (Role: Owner).
2. **Purged Inaccessible Project References**:
   - Removed stale `extra.eas.projectId` and outdated owner from [`app.json`](file:///Users/yashchoudhary/Downloads/rehvo/app.json).
   - Verified zero remaining references in active configuration.
3. **Initialized & Linked New EAS Project**:
   - Created `@yashchoudhary1155/rehvo` via `eas project:init`.
   - New Project ID: `0a82c7ce-1ade-457b-8d67-8a9640ebed53`.
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

- `eas project:info` $\rightarrow$ `@yashchoudhary1155/rehvo` (`ID: 0a82c7ce-1ade-457b-8d67-8a9640ebed53`)
- `eas env:list --environment preview` $\rightarrow$ `APP_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `EXPO_PUBLIC_SUPABASE_URL` verified
- `eas env:list --environment production` $\rightarrow$ `APP_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `EXPO_PUBLIC_SUPABASE_URL` verified
- `npx tsc --noEmit` $\rightarrow$ **0 errors**
- `cd admin && npm run typecheck` $\rightarrow$ **0 errors**

---

## 4. Build Readiness

The local REHVO codebase is completely detached from the previous account and fully synchronized with `@yashchoudhary1155/rehvo`.

When you are ready to build the new preview APK, run:
```bash
eas build --profile preview --platform android
```
*(No builds were triggered in this step as instructed).*
