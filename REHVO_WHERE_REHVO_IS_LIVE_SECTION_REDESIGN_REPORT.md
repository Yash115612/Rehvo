# REHVO Expo Mobile App — "Where REHVO is Live" Section Redesign Report

---

## 1. Section Purpose & Differentiation from "Explore REHVO"

While **"Explore REHVO"** serves as a **Product/Category Discovery Gateway** (*"What can I do on REHVO?"* with an asymmetric 1 + 3 grid), **"Where REHVO is Live"** serves as a **Geographic Destination & City Discovery Experience** (*"Where can I use REHVO?"*). 

To ensure clear visual distinction and eliminate layout repetition, **"Where REHVO is Live"** has been rebuilt as a **Featured Destination Story + Horizontal City Rail**:

```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  [ 📍 LIVE NOW ]                                          │
│                                                           │
│  MUMBAI                                                   │
│  Bandra · Andheri · Powai · BKC                           │
│  [ Explore Mumbai  → ]                                    │
│                                                           │
└───────────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬─────────────────────────────┐
│ Thane        │ Navi Mumbai  │ South Mumbai                │
│ Ghodbunder   │ Vashi        │ Colaba                      │
│ Explore [→]  │ Explore [→]  │ Explore [→]                 │
└──────────────┴──────────────┴─────────────────────────────┘
```

---

## 2. Component Structure & Specifications

### 2.1 Section Header
- **Heading**: `Where REHVO is Live` (21px, bold, deep charcoal `#19181C`).
- **Supporting**: `Verified zero-brokerage listings in our active cities.` (13.5px, muted gray `#77747C`).
- **Right Action**: 32px circular white button with dark arrow for full locality exploration.

### 2.2 Featured Destination Story — Mumbai
- **Dimensions**: Full available width, **205px height**, **26px border radius**.
- **Imagery**: High-res Mumbai skyline/landmark photo with subtle bottom dark gradient (`rgba(25, 24, 28, 0.58)`).
- **Status Badge**: Glass dark translucent pill `[ 📍 LIVE NOW ]`.
- **Typography**: `Mumbai` (24px, bold, white) + `Bandra · Andheri · Powai · BKC` (13px, `#E8E5EC`).
- **CTA**: Compact white pill button `[ Explore Mumbai  → ]` (`#FFFFFF` surface, `#19181C` text).
- **Interaction**: Tap navigates directly to Mumbai listings.

### 2.3 Compact Horizontal City Rail
- **Layout**: Smooth horizontal scroll with next card peeking.
- **Card Dimensions**: **140px width**, **120px height**, **20px border radius**.
- **Active Hubs**:
  - **Thane**: Photo + `Thane` + `Ghodbunder & Majiwada` + `Explore [→]`.
  - **Navi Mumbai**: Photo + `Navi Mumbai` + `Vashi & Kharghar` + `Explore [→]`.
  - **South Mumbai**: Photo + `South Mumbai` + `Colaba & Marine Drive` + `Explore [→]`.
- **Interaction**: Tap filters by the chosen city/locality.

---

## 3. Strict Scope & Quality Assurance

| Verification Item | Command | Result |
| :--- | :--- | :--- |
| **Mobile TypeScript Compilation** | `npx tsc --noEmit` in root | **0 errors (Exit code 0)** |
| **3-App Architecture Boundary Audit** | `python3 scripts/audit_architecture_separation.py` | **0 violations (Exit code 0)** |
| **Isolated Section Change** | Only `HomeCitiesLiveSection.tsx` modified | **PASS (ISOLATED)** |
| **Public Website Isolation** | `web/` verified untouched | **PASS (FROZEN)** |
| **Admin Panel Isolation** | `admin/` verified untouched | **PASS (FROZEN)** |
