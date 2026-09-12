# REHVO Mobile — "Explore REHVO" Visual Cards Redesign Report

**Release Status**: Complete & Fully Verified  
**Date**: August 20, 2026  
**Scope**: Complete visual redesign of the "Explore REHVO" discovery cards into image-led, graphic product tiles replacing plain text-heavy boxes with real architectural and lifestyle photography.

---

## 1. Old Card Problems & Deficiencies

### Limitations of the Previous Implementation
- **Plain & Empty**: Cards contained large white empty boxes with a single small icon at the top, a title, a subtitle, and a text CTA.
- **Text-Heavy**: Depended on reading descriptions rather than communicating instantly through visual imagery.
- **Random Category Colors**: Used disparate colored backgrounds (pink, yellow, green, purple boxes) rather than a coherent REHVO brand system.

---

## 2. New Visual & Image-Led Approach

### Core Architectural Principle
`IMAGERY + COMPOSITION > TEXT + ICONS`

- **Visual Dominance**: Real lifestyle, architectural, and city photography occupies 50–65% of each card (or full-bleed with protective dark gradients).
- **Concise Copy**: Strictly limited to `Title + ONE supporting line + arrow (→)`.
- **Cohesive Brand Palette**: Clean dark backdrops (`#171522`), pure white surfaces (`#FFFFFF`), subtle hairline borders (`#E8E5EC` / `#2D2A3E`), and REHVO coral accent (`#FF5533`).

---

## 3. Card-by-Card Visual Design

| Card | Hierarchy Scale | Visual Asset | Title | Supporting Line | Action Route |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **Find a Home** | **Large Hero (Left)** | Aspirational modern apartment interior | *Find a Home* | *Flats, rooms & studios* | `/rent` |
| **Commercial** | **Medium (Top-Right)** | Open-plan contemporary corporate workspace | *Commercial* | *Offices & retail* | `/commercial` |
| **PG & Rooms** | **Medium (Stacked Right)** | Cozy modern bedroom / student stay | *PG & Rooms* | *Stays & co-living* | `/pg-rooms` |
| **Flatmates** | **Small (Bottom Row 1)** | Social roommates community photo | *Flatmates* | *Find roommates* | `/flatmates` |
| **Rooms** | **Small (Bottom Row 2)** | Private 1 RK / studio interior photo | *Rooms* | *Single & shared* | `/pg-rooms` |
| **Localities** | **Small (Bottom Row 3)** | Mumbai skyline / Sea Link photo | *Localities* | *Explore Mumbai* | `/search` |

---

## 4. Grid Geometry & Responsive Layout

```
Explore REHVO Visual Grid Layout
┌──────────────────────────────┬──────────────────────────────┐
│                              │ Commercial                   │
│                              │ (Office Image + Text)        │
│ Find a Home                  ├──────────────────────────────┤
│ (Large Full-Bleed Photo +    │ PG & Rooms                   │
│  Gradient + Overlay Text)    │ (Co-living Image + Text)     │
└──────────────────────────────┴──────────────────────────────┘
┌───────────────────┬───────────────────┬─────────────────────┐
│ Flatmates         │ Rooms             │ Localities          │
│ (Roommate Photo)  │ (1RK Room Photo)  │ (Mumbai City Photo) │
└───────────────────┴───────────────────┴─────────────────────┘
```

- **Top Row**: 195px height with `flex: 1.15` for Hero and `flex: 1` for Right Stack.
- **Bottom Row**: 3 equal columns with top image wrapper (`height: 64px`) and compact text footer.
- **Interactions**: Micro press scale down (`0.985`), smooth touch targets, and coral arrow animation.

---

## 5. Verification Matrix & Typecheck

| Check / Suite | Command | Status | Result |
| :--- | :--- | :---: | :--- |
| Mobile TypeScript | `npx tsc --noEmit` | **PASSED** | 0 errors |
| Web TypeScript | `npm run typecheck` (`web/`) | **PASSED** | 0 errors |
| Visual Density | Image-to-text ratio audit | **PASSED** | >60% visual content per card |
| Route Navigation | 6 Explore Categories | **PASSED** | Direct navigation to all dedicated destinations |
| Color System Audit | Brand tokens consistency | **PASSED** | Zero multi-color random boxes |
