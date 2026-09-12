# REHVO Expo Mobile App — "Explore REHVO" Section Redesign Report

---

## 1. Existing Section Problem

Previously, the "Explore REHVO" section risked feeling like another generic card grid or property carousel, blending into inventory sections like *Popular Nearby* and *Where REHVO is Live*. Because its purpose is **Product Discovery** (*"What can I do on REHVO?"* rather than *"What property is available?"*), it needed its own distinct, editorial visual personality.

---

## 2. New Asymmetric Editorial Product Grid

The section has been rebuilt with a **1 Large Hero Tile + 3 Smaller Supporting Tiles** asymmetric layout:

```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  [ 0% BROKERAGE ]                                         │
│                                                           │
│  FIND A HOME                                              │
│  Flats, rooms & studios                                   │
│  Explore Homes ─────────► [ → ]                           │
│                                                           │
└───────────────────────────────────────────────────────────┘

┌─────────────────┬─────────────────┬───────────────────────┐
│ Commercial      │ PG & Rooms      │ Flatmates             │
│ Offices & shops │ PGs & stays     │ Find your match       │
│           [ → ] │           [ → ] │                 [ → ] │
└─────────────────┴─────────────────┴───────────────────────┘
```

---

## 3. Component Details & Specifications

### 3.1 Primary Hero Tile — Find a Home
- **Dimensions**: Full available width, **200px height**, **26px border radius**.
- **Imagery**: Full-bleed high-res property photo with dark gradient overlay (`rgba(25, 24, 28, 0.58)`).
- **Badge**: Subtle dark glass tag `[ 0% BROKERAGE ]` with white text.
- **Typography**: `Find a Home` (22px, bold, white) + `Flats, rooms & studios` (13.5px, medium, `#E8E5EC`).
- **Action**: `Explore Homes` (13.5px semibold, white) + **24px circular white control with dark arrow**.
- **Interaction**: Tap routes directly to residential discovery (`/(renter)/rent`).

### 3.2 Supporting Tile 1 — Commercial
- **Dimensions**: Equal 1/3 width, **120px height**, **22px border radius**.
- **Imagery**: Corporate workspace/office photo with dark gradient overlay.
- **Typography**: `Commercial` (15px semibold, white) + `Offices & shops` (11.5px, `#E8E5EC`).
- **Control**: **20px circular white button** with dark arrow.
- **Interaction**: Tap routes to commercial discovery (`/(renter)/commercial`).

### 3.3 Supporting Tile 2 — PG & Rooms
- **Dimensions**: Equal 1/3 width, **120px height**, **22px border radius**.
- **Imagery**: Co-living / modern private stay photo with dark gradient overlay.
- **Typography**: `PG & Rooms` (15px semibold, white) + `PGs & stays` (11.5px, `#E8E5EC`).
- **Control**: **20px circular white button** with dark arrow.
- **Interaction**: Tap routes to PG & rooms discovery (`/(renter)/pg-rooms`).

### 3.4 Supporting Tile 3 — Flatmates
- **Dimensions**: Equal 1/3 width, **120px height**, **22px border radius**.
- **Imagery**: Social community/lifestyle photo with dark gradient overlay.
- **Typography**: `Flatmates` (15px semibold, white) + `Find your match` (11.5px, `#E8E5EC`).
- **Control**: **20px circular white button** with dark arrow.
- **Interaction**: Tap routes to flatmates discovery (`/(renter)/flatmates`).

---

## 4. Color System & Typography Consistency

- **Canvas**: Direct placement on `#F7F5F0` warm background (no outer white container box).
- **Section Heading**: `Explore REHVO` (21px, bold, deep charcoal `#19181C`).
- **Section Subtitle**: `Find a home, workspace, room or flatmate.` (13.5px, muted gray `#77747C`).
- **Tile Text**: 100% white overlay typography with high contrast over dark photographic gradients.
- **Zero Color Fragmentation**: No arbitrary section colors (no blue/yellow/green/purple cards). Single unified REHVO brand.

---

## 5. Spacing & Responsive Design

- **Horizontal Screen Padding**: 20px.
- **Spacing below Section Header**: 16px.
- **Vertical Gap between Hero & Supporting Row**: 12px.
- **Horizontal Gap between Supporting Tiles**: 10px.
- **Bottom Section Margin**: 32px.
- **Tested Device Widths**: 375px (compact), 390px (standard iPhone), 430px (Pro Max) with zero text truncation or layout shift.

---

## 6. Verification & Quality Assurance

| Verification Item | Command | Result |
| :--- | :--- | :--- |
| **Mobile TypeScript Compilation** | `npx tsc --noEmit` in root | **0 errors (Exit code 0)** |
| **3-App Architecture Boundary Audit** | `python3 scripts/audit_architecture_separation.py` | **0 violations (Exit code 0)** |
| **Public Website Isolation** | `web/` verified untouched | **PASS (FROZEN)** |
| **Admin Panel Isolation** | `admin/` verified untouched | **PASS (FROZEN)** |
| **Surrounding Home Sections** | Verified completely untouched | **PASS (UNTOUCHED)** |
