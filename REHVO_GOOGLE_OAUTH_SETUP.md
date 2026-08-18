# REHVO — Google OAuth & Supabase Configuration Guide

This guide details the exact steps required to configure Google OAuth credentials in Google Cloud Console and link them to the REHVO Supabase backend.

---

## 1. Google Cloud Console Configuration

### Step 1.1: Create or Select Google Cloud Project
1. Navigate to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select your existing project (e.g. `rehvo-production` or `rehvo-app`).

### Step 1.2: Configure OAuth Consent Screen
1. Go to **APIs & Services** $\rightarrow$ **OAuth consent screen**.
2. Select **External** and click **Create**.
3. Fill in the App Information:
   - **App name**: `REHVO`
   - **User support email**: Your support or admin email (e.g. `support@rehvo.app` or your Google account)
   - **App logo**: Optional (upload `assets/icon.png`)
   - **Developer contact information**: Your developer email
4. Click **Save and Continue**.
5. Under **Scopes**, click **Add or Remove Scopes** and select:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
6. Click **Save and Continue** $\rightarrow$ Back to Dashboard.
7. Under **Test users** (if in Testing status), add test Google email accounts for closed beta testing.

### Step 1.3: Create Web Application OAuth Client (Required by Supabase)
Supabase handles the server-side OAuth exchange using a **Web application** credential:
1. Go to **APIs & Services** $\rightarrow$ **Credentials**.
2. Click **Create Credentials** $\rightarrow$ **OAuth client ID**.
3. Application Type: **Web application**.
4. Name: `REHVO Supabase Web Client`.
5. **Authorized JavaScript origins**:
   ```
   https://xoskechmxzgfajkfpssv.supabase.co
   ```
6. **Authorized redirect URIs**:
   ```
   https://xoskechmxzgfajkfpssv.supabase.co/auth/v1/callback
   ```
7. Click **Create**.
8. Copy the generated:
   - **Client ID** (e.g. `123456789-abcdef.apps.googleusercontent.com`)
   - **Client Secret** (e.g. `GOCSPX-xxxxxxxxxxxxxx`)

> [!IMPORTANT]
> The **Client Secret** must NEVER be embedded in the mobile application codebase, `.env`, or client bundle. It is entered exclusively into the Supabase Dashboard.

---

## 2. Supabase Dashboard Configuration

### Step 2.1: Enable Google Provider
1. Open your [Supabase Dashboard](https://supabase.com/dashboard/project/xoskechmxzgfajkfpssv).
2. Go to **Authentication** $\rightarrow$ **Providers** $\rightarrow$ **Google**.
3. Toggle **Enable Google provider** to **ON**.
4. Paste the credentials obtained from Step 1.3:
   - **Client ID**: `<Your Google Web Client ID>`
   - **Client Secret**: `<Your Google Client Secret>`
5. Click **Save**.

### Step 2.2: Configure Redirect URLs in Supabase
1. Go to **Authentication** $\rightarrow$ **URL Configuration**.
2. Set **Site URL**:
   ```
   rehvo://
   ```
3. In **Redirect URLs**, add:
   ```
   rehvo://**
   rehvo://auth/callback
   exp://**
   ```
4. Click **Save**.

---

## 3. Real Project Identifiers (From Base Configuration)

| Parameter | Value | Source |
|---|---|---|
| **App Scheme** | `rehvo://` | [`app.json`](file:///Users/yashchoudhary/Downloads/rehvo/app.json) |
| **Android Package Name** | `com.rehvo.app` | [`app.json`](file:///Users/yashchoudhary/Downloads/rehvo/app.json) |
| **iOS Bundle Identifier** | `com.rehvo.app` | [`app.json`](file:///Users/yashchoudhary/Downloads/rehvo/app.json) |
| **Supabase Project URL** | `https://xoskechmxzgfajkfpssv.supabase.co` | `.env.local` / `eas.json` |
| **Supabase OAuth Callback** | `https://xoskechmxzgfajkfpssv.supabase.co/auth/v1/callback` | Supabase Auth Standard |
| **App Deep Link Callback** | `rehvo://auth/callback` | Expo Auth Session Standard |

---

## 4. Native EAS Build Requirement

When creating future native Android/iOS preview builds with EAS:
- Android intent filters and iOS URL schemes are automatically configured by Expo from `"scheme": "rehvo"` in `app.json`.
- `expo-web-browser` launches the secure in-app browser and redirects back to `rehvo://auth/callback`.
