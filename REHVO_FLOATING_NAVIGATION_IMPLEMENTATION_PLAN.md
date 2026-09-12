# REHVO Mobile App — Floating Bottom Navigation Complete Redesign & Implementation Plan

---

## 1. Executive Summary & Design Vision

The **REHVO Floating Bottom Navigation** is the primary navigation anchor across the entire mobile application. It is being redesigned from a standard bottom pill into a **sculpted, floating, tactile navigation dock** that embodies REHVO's brand identity:

$$\textbf{Floating Navigation Identity} \longrightarrow \begin{cases} \textbf{Sculpted Geometry} & \text{(Floating capsule with elevated center action)} \\ \textbf{Tactile Animations} & \text{(Fluid spring-driven active bubble transitions)} \\ \textbf{Zero Content Obstruction} & \text{(Dynamic safe-area offsets and calculated scroll clearances)} \\ \textbf{Contextual Alignment} & \text{(Seamless compatibility with 4-category marketplace)} \end{cases}$$

### Core Design Principles:
- **Floating & Layered**: Rendered at the root layout level (`app/(renter)/_layout.tsx`), visually floating over scrolling screen content with subtle elevation and soft ambient shadows.
- **Sculpted Center Action**: The primary creation button (`+`) is visually elevated and highlighted with the REHVO coral accent (`#FF5533`), creating an iconic focal point.
- **Fluid Micro-Interactions**: Active tab indicator smoothly glides across tabs using Reanimated spring physics (`damping: 24`, `stiffness: 280`, `mass: 0.6`).
- **Never Obstruct Content**: Strict bottom padding formulas across all root scroll views guarantee that prices, cards, and primary actions are never hidden behind the navigation dock.

---

## 2. Current Navigation Runtime Trace & Component Audit

### A. Runtime Layout Hierarchy:
```
ROOT LAYOUT: app/_layout.tsx (Stack Navigator)
  └── RENTER LAYOUT: app/(renter)/_layout.tsx (Tabs with hidden tab bar)
        ├── Tabs (Routing Infrastructure - Hidden native tab bar)
        │     ├── (renter)/home.tsx
        │     ├── (renter)/search.tsx
        │     ├── (renter)/saved.tsx
        │     └── (renter)/profile.tsx
        ├── FloatingBottomNav.tsx (Layout-level custom navigation dock)
        │     └── FloatingCapsuleNav.tsx (Generic reanimated floating capsule)
        └── ContextualCreateSheet.tsx (Modal overlay triggered by center '+')
```

### B. Component Classification:

| Component Path | Status | Role / Evaluation |
| :--- | :--- | :--- |
| [`app/(renter)/_layout.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/_layout.tsx) | **CANONICAL LAYOUT** | Houses hidden Expo Tabs routing and mounts floating navigation at layout level |
| [`src/components/navigation/FloatingBottomNav.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/navigation/FloatingBottomNav.tsx) | **CANONICAL RENTER NAV** | Defines renter navigation slots: `Home`, `Search`, `(+)`, `Saved`, `Profile` |
| [`src/components/navigation/FloatingCapsuleNav.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/navigation/FloatingCapsuleNav.tsx) | **CANONICAL ENGINE** | Generic Reanimated capsule with animated active bubble and safe-area calculation |
| [`src/components/navigation/FloatingOwnerNav.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/navigation/FloatingOwnerNav.tsx) | **CANONICAL OWNER NAV** | Dedicated owner dashboard navigation dock |
| [`src/components/navigation/ContextualCreateSheet.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/navigation/ContextualCreateSheet.tsx) | **CANONICAL ACTION SHEET** | Contextual bottom sheet launched by the central `(+)` button |

---

## 3. Navigation Information Architecture & Destination Map

The navigation dock contains 5 distinct slots in exact ergonomic order:

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│     [ 🏠 ]       [ 🔍 ]       ( + )       [ ♡ ]       [ 👤 ]     │
│      Home        Search       List        Saved      Profile     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

1. **Home (`house`)**: Navigates to `/(renter)/home`. Root marketplace discovery hub (Homes, Commercial, PG & Rooms, Flatmates).
2. **Search (`search`)**: Navigates to `/(renter)/search`. Universal category-aware discovery engine.
3. **Primary Action (`plus`)**: Triggers `ContextualCreateSheet` allowing users to quickly List a Property or Create a Flatmate Profile.
4. **Saved (`heart`)**: Navigates to `/(renter)/saved`. Saved properties and shortlisted flatmate profiles.
5. **Profile (`user-round`)**: Navigates to `/(renter)/profile`. User account settings, identity verification, visits, and safety reports.

---

## 4. Visual Design System & Palette

| Token | Hex Value | Application in Navigation |
| :--- | :--- | :--- |
| **Surface Background** | `#FFFFFF` | Capsule container background |
| **Active Bubble** | `#19181C` | Charcoal circular pill sliding behind active item |
| **Active Icon** | `#FFFFFF` | High-contrast white icon on charcoal bubble |
| **Inactive Icon** | `#77747C` | Muted neutral gray for unselected tabs |
| **Primary Action BG** | `#FF5533` | REHVO signature coral on center `(+)` button |
| **Primary Action Icon**| `#FFFFFF` | Crisp white plus symbol (`strokeWidth: 2.6`) |
| **Border** | `#E9E6E0` | Ultra-fine 1px structural boundary |
| **Shadow** | `rgba(25, 24, 28, 0.08)` | Diffused ambient shadow (Radius: 16px, Offset: {0, 6}) |

---

## 5. Sculpted Geometry & Dimension Specifications

```
                       52px Elevated Primary (+) Button
                             ┌─────────┐
                             │    +    │
      ┌──────────────────────┴─────────┴──────────────────────┐
      │   [ 🏠 ]       [ 🔍 ]               [ ♡ ]       [ 👤 ]  │  64px Capsule
      └───────────────────────────────────────────────────────┘
                                 │
                   12px Dynamic Safe-Area Bottom Offset
```

### Exact Sizing Matrix:
- **Capsule Height**: `64px`
- **Capsule Border Radius**: `32px`
- **Max Width**: `min(windowWidth - 32px, 420px)` (Centered on screen)
- **Active Bubble Size**: `46px` diameter circle (`borderRadius: 23px`)
- **Center Action Button**: `52px` diameter circle (`borderRadius: 26px`), elevated `4px` above capsule center line
- **Icon Size**: `21px` (Inactive stroke: `1.9px`, Active stroke: `2.2px`, Primary `+` stroke: `2.6px`)
- **Touch Targets**: Each slot maintains a minimum `56px x 64px` hit area (exceeding WCAG 44px standard).

---

## 6. Fluid Spring Animation System

The active indicator bubble glides smoothly using `react-native-reanimated`:

```typescript
// REANIMATED SPRING PARAMETERS:
const SPRING_CONFIG: WithSpringConfig = {
  damping: 24,    // High damping prevents distracting oscillations
  stiffness: 280, // Snappy response on tab press
  mass: 0.6,      // Light inertia for instantaneous feedback
};

// PRESS INTERACTION DYNAMICS:
// 1. Tab press -> Active bubble scales to 0.94 during transition, springing back to 1.0.
// 2. Center (+) press -> Scales to 0.92 on press, returning with subtle bounce.
```

---

## 7. Safe-Area & Device Inset Formulas

The navigation dock dynamically adapts to any device viewport geometry using `react-native-safe-area-context`:

$$\text{Dock Bottom Offset} = \max(\text{insets.bottom}, 12\text{px}) + 8\text{px}$$

$$\text{Total Nav Footprint Height} = 64\text{px (Capsule)} + \text{Dock Bottom Offset} \approx 100\text{px to } 116\text{px}$$

$$\text{Scroll Container Bottom Padding} = \max(\text{insets.bottom}, 20\text{px}) + 120\text{px}$$

This formula ensures:
1. **Dynamic Island / Home Indicator (iPhone 14/15/16)**: 34px bottom inset + 8px margin = 42px offset from bottom edge.
2. **Standard Android Gesture Bar**: 16px bottom inset + 8px margin = 24px offset from bottom edge.
3. **Zero Content Clipping**: All screen content has 120px+ bottom clearance.

---

## 8. Marketplace Category Switching Compatibility

The floating bottom navigation is **completely decoupled** from the marketplace category selector:

- **Top Category Selector** (`Homes`, `Commercial`, `PG & Rooms`, `Flatmates`): Controls in-place category data feeds.
- **Bottom Navigation** (`Home`, `Search`, `(+)`, `Saved`, `Profile`): Controls root app destination routing.

> [!NOTE]
> Switching between top categories does NOT change the bottom navigation state. Tapping `Home` on the bottom bar always returns to the marketplace root without resetting user filters unexpectedly.

---

## 9. Hidden Screen Management

The floating navigation is automatically hidden on detail and focused creation screens to maximize screen real estate:

```typescript
const isHiddenScreen =
  pathname.includes('/property/') ||
  pathname.includes('/visit/') ||
  pathname.includes('/listing/') ||
  pathname.includes('/chat') ||
  pathname.includes('/notification') ||
  pathname.includes('/settings') ||
  pathname.includes('/edit') ||
  pathname.includes('/add') ||
  pathname.includes('/flatmate');
```

---

## 10. Contextual Creation Flow (`ContextualCreateSheet`)

When the user taps the center `(+)` button, a bottom sheet slides up presenting two distinct, high-contrast actions:

1. **List a Property**:
   - Icon: `Building2`
   - Description: *"Residential flats, commercial offices, shops, PGs, or rooms"*
   - Navigation: `/(renter)/listing/property-type`
2. **Find / Become a Flatmate**:
   - Icon: `Users2`
   - Description: *"Create a seeker profile or find compatible room partners"*
   - Navigation: `/(renter)/flatmate/create` (or `my-profile` if profile exists)

---

## 11. Accessibility & Touch Standards

- **Touch Targets**: 56px x 64px per slot (WCAG 2.1 AA compliant).
- **Accessibility Roles**: `role="tab"` with `accessibilityState={{ selected: isActive }}` for normal slots; `role="button"` for center `(+)` action.
- **Screen Reader Labels**: Explicit labels: *"Home tab"*, *"Search tab"*, *"List property or create flatmate profile"*, *"Saved properties tab"*, *"Profile tab"*.

---

## 12. Step-by-Step Implementation Sequence (Once Approved)

### STEP 1: Audit Current Layout Level Mounts
- Verify `app/(renter)/_layout.tsx` is the sole layout mounting `FloatingBottomNav`.

### STEP 2: Refine `FloatingCapsuleNav.tsx` Engine
- Refine capsule dimensions (64px height, 32px radius, 52px elevated `+` button).
- Update spring configuration and reanimated bubble geometry.
- Enforce clean elevation shadows and fine borders.

### STEP 3: Refine `FloatingBottomNav.tsx` Slot Configurations
- Ensure icon family consistency (`House`, `Search`, `Plus`, `Heart`, `UserRound`) with 2.2 stroke width.

### STEP 4: Refine `ContextualCreateSheet.tsx`
- Ensure smooth modal backdrop animation and clean navigation routing.

### STEP 5: Audit and Enforce Scroll Bottom Padding across Screens
- Verify `home.tsx`, `search.tsx`, `saved.tsx`, `profile.tsx`, `commercial.tsx`, `pg.tsx`, `flatmates.tsx` all use `paddingBottom: Math.max(insets.bottom, 20) + 120`.

### STEP 6: Execute Verification & QA Gates
- Run `npx tsc --noEmit` $\rightarrow$ 0 errors.
- Run Metro Android Export Bundle $\rightarrow$ 0 errors.
- Run 3-App Architecture Boundary Scanner $\rightarrow$ 0 violations.
- Verify `web/` and `admin/` 100% frozen.

---

## 13. Runtime Verification & Test Matrix

| Test Case | Interaction Flow | Expected Outcome |
| :--- | :--- | :--- |
| **TEST 1: Tab Navigation** | Tap `Home` $\rightarrow$ `Search` $\rightarrow$ `Saved` $\rightarrow$ `Profile` | Active bubble glides smoothly; screen updates without flickering |
| **TEST 2: Center (+) Action** | Tap `(+)` button | `ContextualCreateSheet` opens with "List Property" and "Flatmate Profile" |
| **TEST 3: Scroll Clearance** | Scroll to bottom of Search, Saved, Home feeds | Last card is completely visible with 24px+ margin above floating bar |
| **TEST 4: Hidden Screens** | Open Property Details or Chat | Floating navigation smoothly hides; unhides on back navigation |
| **TEST 5: Device Insets** | Test on 375px, 390px, 430px devices | Dock remains centered, 16px side margins, correct bottom gesture inset |

---

## 14. Strict Boundary & Code Freeze Confirmation

```
BOUNDARY VERIFICATION:
- web/   ──► 0 modifications (100% frozen)
- admin/ ──► 0 modifications (100% frozen)
- Mobile ──► Strict isolation in app/(renter)/_layout.tsx and src/components/navigation/
```

---

## 15. Approval Request

This plan establishes a sculpted, elevated, floating bottom navigation system for REHVO Mobile.

**No code has been written or modified in this planning phase.** Implementation will begin only upon your explicit approval.
