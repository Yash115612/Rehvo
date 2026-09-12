# REHVO Expo Mobile App — Pre-Reset Backup & Safety Report

---

## 1. Executive Safety Summary

Prior to initiating the Clean-Slate UI Reset and Screen Rebuild for the REHVO Expo Mobile App (`app/`, `src/`, `assets/`), this report records the exact canonical routes, preserved backend services, database schema bindings, and environment variables.

### Strict Boundaries:
- **`web/`** (Next.js Public Website) remains **FROZEN & UNTOUCHED**.
- **`admin/`** (Next.js Admin Panel) remains **FROZEN & UNTOUCHED**.
- All backend services (`src/services/`), state store (`src/store/useAppStore.ts`), Supabase connection (`src/lib/supabase.ts`), and types (`src/types/index.ts`) are **PRESERVED**.

---

## 2. Preserved Backend Services & Data Infrastructure

| Service / Infrastructure Layer | File Path | Status | Purpose |
| :--- | :--- | :--- | :--- |
| **Supabase Client** | `src/lib/supabase.ts` | **PRESERVED** | Client initialization with AsyncStorage auth storage |
| **Local Storage Utility** | `src/lib/storage.ts` | **PRESERVED** | Secure AsyncStorage wrapper for token & draft caching |
| **Central App Store** | `src/store/useAppStore.ts` | **PRESERVED** | Zustand store managing auth, properties, flatmates, chats, visits, enquiries |
| **Authentication Service** | `src/services/auth.ts` | **PRESERVED** | Email, OTP phone auth, Google/Apple OAuth, password resets |
| **Profile Service** | `src/services/profile.ts` | **PRESERVED** | User profile fetching, avatar uploads, role switching |
| **Property Service** | `src/services/properties.ts` | **PRESERVED** | Property discovery, CRUD, image uploads, search filtering |
| **Flatmate Service** | `src/services/flatmates.ts` | **PRESERVED** | Flatmate profile publishing, pausing, discovery feed |
| **Chat Service** | `src/services/chat.ts` | **PRESERVED** | Conversations, realtime Supabase subscriptions, message sending |
| **Enquiries Service** | `src/services/enquiries.ts` | **PRESERVED** | Renter enquiries and owner enquiry status workflows |
| **Visits Service** | `src/services/visits.ts` | **PRESERVED** | In-person visit scheduling, status updates, rescheduling |
| **Notifications Service** | `src/services/notifications.ts` | **PRESERVED** | Push/in-app notifications, badge counters, read receipts |
| **Saved Listings Service** | `src/services/saved.ts` | **PRESERVED** | Saved property & flatmate bookmark persistence |
| **Data Types & Contracts** | `src/types/index.ts` | **PRESERVED** | Full TypeScript definitions for all domain entities |

---

## 3. Environment Variables (Redacted / Safe Keys)

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `APP_URL`

---

## 4. Canonical Mobile Route Inventory

```
app/
├── index.tsx                         (Boot / Splash / Auth Router)
├── _layout.tsx                       (Root Layout with Auth State Listener)
│
├── (auth)/
│   ├── _layout.tsx                   (Auth Stack Layout)
│   ├── splash.tsx                    (Splash Screen)
│   ├── onboarding.tsx                (Onboarding Screen)
│   ├── login.tsx                     (Login Screen)
│   ├── signup.tsx                    (Signup Screen)
│   ├── otp.tsx                       (OTP Verification)
│   ├── role-selection.tsx            (Role Selection Step)
│   ├── forgot-password.tsx           (Password Reset)
│   └── reset-password.tsx            (Update Password)
│
├── (renter)/
│   ├── _layout.tsx                   (Renter Tab Layout with Floating Capsule)
│   ├── home.tsx                      (Unified Marketplace Shell)
│   ├── search.tsx                    (Search & Filters)
│   ├── saved.tsx                     (Saved Properties & Flatmates)
│   ├── commercial.tsx                (Commercial Marketplace)
│   ├── pg-rooms.tsx                  (PG & Rooms Discovery)
│   ├── flatmates.tsx                 (Flatmates Community)
│   ├── profile.tsx                   (Profile Hub)
│   ├── settings.tsx                  (App Settings)
│   ├── property/[id].tsx             (Property Details)
│   ├── chat/[id].tsx                 (Shared Conversation Screen)
│   ├── visit/schedule.tsx            (Schedule Visit)
│   └── listing/*                     (12-Step Listing Wizard)
│
└── (owner)/
    ├── _layout.tsx                   (Owner Stack Layout)
    ├── dashboard.tsx                 (Owner Dashboard)
    ├── properties.tsx                (Owner My Properties)
    ├── enquiries.tsx                 (Owner Enquiries)
    ├── visits.tsx                    (Owner Visits)
    └── profile.tsx                   (Owner Profile)
```
