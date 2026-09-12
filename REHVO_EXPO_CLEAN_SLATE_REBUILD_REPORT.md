# REHVO Expo Mobile App — Clean-Slate Rebuild & Master Architecture Report

---

## 1. Executive Summary

The **REHVO Expo Mobile Application** has undergone a clean-slate UI reset and complete rebuild across the entire mobile presentation layer while preserving **100%** of the Supabase backend services, database schema, authentication lifecycle, and data contracts.

### Strict Boundaries & Preservation:
- **`web/`** (Public Next.js Website) and **`admin/`** (Admin Portal) remain **FROZEN & UNTOUCHED**.
- **Backend Services Preserved**: `src/services/` (auth, properties, flatmates, chat, visits, enquiries, profile, notifications, saved).
- **Zustand State Store Preserved**: `src/store/useAppStore.ts` with real Supabase synchronization.
- **Canonical Routes Maintained**: 58 canonical routes in `app/` with zero duplicate routes (`HomeV2`, `PropertyNew`, etc.).

---

## 2. Master UI Primitives Suite (`src/components/primitives/`)

A single, canonical set of 19 UI primitives was engineered and exported from [`src/components/primitives/index.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/index.ts):

| Primitive Component | Source File | Key Capabilities |
| :--- | :--- | :--- |
| **`RehvoImage`** | [`RehvoImage.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoImage.tsx) | Image loader with skeleton fallback, error recovery, and rounded clipping |
| **`RehvoButton`** | [`RehvoButton.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoButton.tsx) | Primary dark, accent coral, outline, ghost, and surface buttons with loading states |
| **`RehvoIconButton`** | [`RehvoIconButton.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoIconButton.tsx) | Accessible 44px+ touch target icon buttons |
| **`RehvoInput`** | [`RehvoInput.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoInput.tsx) | Inputs with focus border (`#19181C`), error state, left icon, and password visibility toggle |
| **`RehvoSearchBar`** | [`RehvoSearchBar.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoSearchBar.tsx) | 48px search pill with filter trigger and active filter dots |
| **`RehvoSectionHeader`** | [`RehvoSectionHeader.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoSectionHeader.tsx) | Section headers with title, subtitle, and "View all" action |
| **`RehvoChip`** | [`RehvoChip.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoChip.tsx) | Filter and selection chips with active states |
| **`RehvoPropertyCard`** | [`RehvoPropertyCard.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoPropertyCard.tsx) | 78vw hero cards with price pill, verification badge, and save toggle |
| **`RehvoCompactPropertyCard`** | [`RehvoCompactPropertyCard.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoCompactPropertyCard.tsx) | Compact rail cards for dense horizontal discovery |
| **`RehvoFeaturedCard`** | [`RehvoFeaturedCard.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoFeaturedCard.tsx) | Cinematic promotional hero cards with dark gradient overlays |
| **`RehvoCityCard`** | [`RehvoCityCard.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoCityCard.tsx) | Geographic destination cards with photo and count subtext |
| **`RehvoFlatmateCard`** | [`RehvoFlatmateCard.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoFlatmateCard.tsx) | Portrait format roommate cards with lifestyle chips |
| **`RehvoTrustCard`** | [`RehvoTrustCard.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoTrustCard.tsx) | 2x2 trust guarantee modules |
| **`RehvoModal`** | [`RehvoModal.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoModal.tsx) | Centered dialog modals with backdrop dismiss |
| **`RehvoBottomSheet`** | [`RehvoBottomSheet.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoBottomSheet.tsx) | Slide-up bottom sheets with drag handle |
| **`RehvoSkeleton`** | [`RehvoSkeleton.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoSkeleton.tsx) | Animated pulsing loading placeholders |
| **`RehvoEmptyState`** | [`RehvoEmptyState.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoEmptyState.tsx) | Illustrations with action buttons |
| **`RehvoErrorState`** | [`RehvoErrorState.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoErrorState.tsx) | Alert illustrations with retry buttons |
| **`RehvoBottomNav`** | [`RehvoBottomNav.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoBottomNav.tsx) | 64px sculpted floating capsule navigation |

---

## 3. Rebuilt Canonical Screens & Navigation Architecture

```
CANONICAL MOBILE PRODUCT ARCHITECTURE:
├── Auth Flow ────────► app/(auth)/*
│   ├── splash.tsx ───► SplashScreen.tsx (Brand reveal)
│   ├── onboarding.tsx ► OnboardingFlowScreen.tsx (3 core value props)
│   ├── login.tsx ────► LoginScreen.tsx (Email / Phone +91 tabs)
│   ├── signup.tsx ───► SignUpScreen.tsx (Account creation)
│   ├── otp.tsx ──────► OtpRoute (6-digit auto-advance)
│   └── role-selection.tsx ► RoleSelectionScreen.tsx (Renter vs Owner)
│
├── Unified Marketplace Shell ──► app/(renter)/home.tsx (MarketplaceShell.tsx)
│   ├── Persistent Top Header ──► HomeTopHeader.tsx (Avatar, Greeting, 📍 Mumbai, Bell)
│   ├── Persistent Search Dock ─► HomeSearchBar.tsx (Adaptive placeholder + filter)
│   ├── Category Switcher ──────► HomeCategoryShortcuts.tsx ([ Homes ] [ Commercial ] [ PG ] [ Flatmates ])
│   ├── In-Place Dynamic Content:
│   │   ├── [ Homes ] ──────────► HomeMarketplaceContent.tsx (9 differentiated sections)
│   │   ├── [ Commercial ] ─────► CommercialMarketplaceContent.tsx (Grade-A business spaces)
│   │   ├── [ PG & Rooms ] ─────► PgMarketplaceContent.tsx (Stays, Private/Shared, Studios)
│   │   └── [ Flatmates ] ──────► FlatmateMarketplaceContent.tsx (Community roommate discovery)
│   └── Floating Capsule Nav ───► FloatingBottomNav.tsx (64px height, 32px radius)
│
├── Search Experience ──► app/(renter)/search.tsx (Guided search modal, Sort/Filter sheets, Map mode)
├── Property Details ───► app/(renter)/property/[id].tsx (Flagship gallery, Key facts, Sticky actions)
├── Saved Collection ───► app/(renter)/saved.tsx (Properties & Flatmates tabs)
├── Messaging & Chat ───► app/(renter)/chat/[id].tsx & app/(owner)/chat/[id].tsx (SharedConversationScreen)
├── Visits & Enquiries ─► app/(owner)/visits.tsx & app/(owner)/enquiries.tsx
├── Profile Hub ────────► app/(renter)/profile.tsx (ProfileHubScreen with live role switcher)
├── App Settings ───────► app/(renter)/settings.tsx (SettingsScreen)
└── Owner Experience ───► app/(owner)/dashboard.tsx, properties.tsx, and app/(renter)/listing/* (12-step wizard)
```

---

## 4. Verification & Quality Assurance Results

| Verification Check | Target Command | Result |
| :--- | :--- | :--- |
| **Mobile TypeScript Compilation** | `npx tsc --noEmit` in root | **0 errors (Exit code 0)** |
| **3-App Architecture Boundary Scanner** | `python3 scripts/audit_architecture_separation.py` | **0 violations (Exit code 0)** |
| **Public Website Isolation** | `web/` verified untouched | **PASS (FROZEN)** |
| **Admin Panel Isolation** | `admin/` verified untouched | **PASS (FROZEN)** |
| **Duplicate Routes Check** | No duplicate route files created | **PASS (0 duplicates)** |
