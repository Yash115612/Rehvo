# REHVO Public Website — Visual Refinement & Design Polish Plan

**Scope**: Public Web Application (`web/` directory only)  
**Objective**: Elevate the visual quality, consistency, and premium aesthetic of the existing REHVO website without altering information architecture, routes, or business logic.  
**Guiding Principle**: **Refinement, not reinvention.** Keep the current design direction, polish execution to top-tier standards.  
**Status**: 📋 **PLAN ONLY — DO NOT IMPLEMENT YET**  

---

## 1. Executive Summary & Design Philosophy

The current REHVO Next.js website has a strong, modern foundation with a rich 15-section discovery homepage, category marketplace pages (`/rent`, `/commercial`, `/pg-rooms`, `/flatmates`), search filters, and SEO landing pages. 

However, visual audit reveals **micro-inconsistencies** across colors, typography hierarchy, card paddings, container max-widths, and button radii that detract from a unified, ultra-premium product experience.

### The Goal: Current REHVO + One Level More Premium
```
Current Website Structure & Logic
               +
Unified Master Design Tokens (#F7F5F0, #FFFFFF, #19181C, #77747C, #E9E6E0, restrained #FF5533)
               +
Systematized Typography Scale (Display down to Metadata)
               +
Canonical Card Systems (Residential, Commercial, PG, Flatmates)
               +
Standardized Button & Form Elements
               +
Harmonious Spacing Rhythm & Global Container Width
               =
Ultra-Polished, Cohesive, Trustworthy REHVO Experience
```

---

## 2. Current Website Audit: Strengths vs. Visual Friction

### Strengths (To Keep & Enhance)
- **Floating Capsule Header**: Distinctive, clean aesthetic that gives REHVO an app-like modern feel.
- **Rich Multi-Marketplace Coverage**: Seamless coexistence of Residential, Commercial, PG & Rooms, and Flatmate discovery.
- **Search Dock & Quick Filters**: Intuitive category switching on hero with instant search capability.
- **Direct Owner & Zero Brokerage Positioning**: Clear value proposition communicated across badges and headlines.
- **Comprehensive Footprint**: Complete footer with structured navigation links and social icons.

### Visual Friction & Inconsistencies (To Refine)
1. **Color Drift & Category Theming Contamination**:
   - `/flatmates` introduced emerald green backgrounds (`from-emerald-50/70`, `text-emerald-600`), breaking brand cohesion.
   - `/pg-rooms` introduced amber/yellow hero backgrounds (`from-amber-50/70`, `border-amber-100/80`).
   - Commercial pages have separate peach-tinted gradients (`from-[#FFF5F0]/60`).
   - Different shades of dark text (`#171522` vs `#19181C` vs `stone-900`).
   - Multiple background canvas values (`#FAF8F5` vs `#F7F5F0` vs `stone-50`).
2. **Typography Scale Inconsistency**:
   - Random jumps in heading font weights (`font-black`, `font-extrabold`, `font-bold`).
   - Variable price badge sizing across cards (some 2xl, some xl, different suffix positions).
3. **Card Radius & Shadow Disparity**:
   - `PropertyCard` uses `rounded-3xl` with hover shadow `shadow-xl`.
   - Category shortcut cards use `rounded-2xl` with `shadow-md`.
   - Inconsistent border opacity (`border-stone-200/90`, `border-[#E8E5EC]`, `border-[#FFD9CC]`).
4. **Button & CTA Inconsistencies**:
   - Mix of pill buttons (`rounded-full`), squircle buttons (`rounded-2xl`), and standard radius (`rounded-xl`).
   - Overuse of orange accent on non-critical secondary buttons.
5. **Container Max-Width Variance**:
   - Header is `max-w-[1440px]`.
   - Search section is `max-w-[1360px]`.
   - Footer is `max-w-[1320px]`.
   - Commercial page uses `max-w-7xl` (`1280px`).

---

## 3. Master Design Tokens & Color System

A single, authoritative token system will govern all components in `web/tailwind.config.js` and `web/src/app/globals.css`.

### Unified Palette Specification

| Token Name | Hex Value | Role & Usage Rule |
|---|---|---|
| **Background (Canvas)** | `#F7F5F0` | Warm, neutral linen background across all pages (replaces `#FAF8F5` and random category tints). |
| **Surface (Card / Sheet)** | `#FFFFFF` | Pure white for cards, elevated modals, search boxes, and dropdown menus. |
| **Surface Muted** | `#EFECE6` | Subtle background for tag pills, input backgrounds, and inactive category toggles. |
| **Primary Text** | `#19181C` | High-contrast deep slate for headings, property titles, prices, and active labels. |
| **Secondary Text** | `#77747C` | Muted neutral for subtitles, locality labels, specs, and helper text. |
| **Border / Divider** | `#E9E6E0` | Subtle hairline borders on cards, inputs, and section dividers. |
| **Border Focus** | `#D5D0C6` | Slightly deeper border for hover and focus states. |
| **Accent (Restrained)** | `#FF5533` | Primary CTAs, active tab indicator, price highlights, and key icons **only**. |
| **Accent Hover** | `#EE4422` | Hover state for primary action buttons. |
| **Accent Soft** | `#FFF0ED` | Soft peach background for active pills, save button background, and verified badges. |
| **Success (Semantic)** | `#16A34A` | Verification checkmarks, "Zero Brokerage" assurance badge. |
| **Success Soft** | `#ECFDF5` | Soft green pill background for verified host status. |

> [!IMPORTANT]
> **Accent Restraint Rule**: `#FF5533` must never be used as a full section background or on large background fills. It is strictly reserved for actionable interaction focal points and key badges.

---

## 4. Typography Hierarchy & Standardization

All typography will use **Plus Jakarta Sans** with calibrated optical sizing, tracking, and leading.

```
Display (Hero):     text-4xl sm:text-5xl lg:text-6xl  | font-extrabold (800) | tracking-[-0.03em] | leading-[1.1]
H1 (Page Title):    text-3xl sm:text-4xl lg:text-5xl  | font-extrabold (800) | tracking-[-0.025em] | leading-[1.15]
H2 (Section Head):  text-2xl sm:text-3xl lg:text-4xl  | font-extrabold (800) | tracking-[-0.02em] | leading-[1.2]
H3 (Card Title):    text-base sm:text-lg              | font-bold (700)      | tracking-[-0.01em] | leading-[1.3]
H4 (Sub-Section):   text-xs sm:text-sm                | font-extrabold (800) | tracking-[0.05em]  | uppercase
Body Large:         text-base sm:text-lg              | font-medium (500)    | tracking-normal    | leading-[1.6]
Body (Standard):    text-sm                           | font-normal (400)    | tracking-normal    | leading-[1.5]
Body Small:         text-xs                           | font-medium (500)    | tracking-normal    | leading-[1.4]
Caption / Meta:     text-[11px]                       | font-medium (500)    | tracking-wide      | leading-none
Button Text:        text-xs sm:text-sm                | font-bold (700)      | tracking-[-0.01em] | leading-none
Price Display:      text-2xl sm:text-[26px]           | font-black (900)     | tracking-tight     | leading-none
```

---

## 5. Header & Navigation Polish

### What Stays:
- Floating capsule container concept with backdrop blur.
- Logo placement on the left, navigation items in center, live location + auth on the right.

### Refinements:
1. **Container Consistency**: Set fixed height (56px desktop / 50px mobile), border `1px solid #E9E6E0`, and refined shadow `0 8px 24px rgba(25, 24, 28, 0.05)`.
2. **Active Link Indicator**: Replace harsh orange box with clean pill badge: `text-[#19181C] font-bold bg-[#EFECE6]` or restrained `text-[#FF5533] bg-[#FFF0ED]`.
3. **Location Selector Pill**: Subtle `#FFFFFF` background with border `#E9E6E0`, smooth dropdown shadow, and clean active checkmark.
4. **Saved & Auth Controls**: Micro-badge for saved count, polished user avatar circle with crisp typography.
5. **Mobile Drawer**: Cohesive `#FFFFFF` container with matching border and typography, eliminating random padding jumps.

---

## 6. Hero & Primary Search Polish

### What Stays:
- Category selection tabs (Rent Flats, Commercial, PG & Rooms, Flatmates).
- Search input fields for Location, Region, and Budget.
- Search submit button and popular quick tags below.

### Refinements:
1. **Hero Spacing & Background**: Neutral background `#F7F5F0` without multi-colored gradient blends.
2. **Search Dock Frame**:
   - Clean `#FFFFFF` surface with `rounded-[24px]` and border `1.5px solid #E9E6E0`.
   - Shadow: `0 12px 36px rgba(25, 24, 28, 0.06)`.
3. **Category Switcher Tabs**:
   - Subtle segmented control bar on `#EFECE6` background.
   - Active tab: `#19181C` dark pill with `#FFFFFF` text and subtle orange icon highlight.
4. **Field Dividers & Inputs**:
   - Clean inset inputs with `#F7F5F0` surface and `#E9E6E0` border.
   - Clear labels (`10px font-extrabold text-[#77747C] uppercase tracking-wider`).
   - Sharp placeholder text with matching icon alignments.
5. **Search CTA Button**:
   - `#FF5533` with hover `#EE4422`, height 52px, `rounded-xl`, bold label + arrow icon.

---

## 7. Canonical Card Systems

### A. Residential Property Card (`PropertyCard.tsx`)
- **Container**: `bg-[#FFFFFF]`, `rounded-[20px]`, `border: 1px solid #E9E6E0`, hover `border-[#D5D0C6]`, hover shadow `0 8px 24px rgba(25, 24, 28, 0.08)`.
- **Image Container**: Aspect ratio `16:10`, radius `16px` (inset with 4px card margin or seamless top border).
- **Badges**:
  - `0% Brokerage`: `#19181C` semi-transparent backdrop blur pill.
  - `Verified`: Emerald `#16A34A` with white checkmark.
  - `Heart / Save`: 36px round button with backdrop blur and smooth scale animation.
- **Price Block**: `text-2xl font-black text-[#19181C]` + `text-xs text-[#77747C] font-medium /month`.
- **Specs Row**: Light `#F7F5F0` pill bar with 3 clean columns (BHK, Bath, Area sqft).
- **Footer**: `Direct Owner` assurance on left, `View Details →` CTA in `#FF5533` on right.

### B. Commercial Property Card (`CommercialPropertyCard.tsx` / `CommercialSection.tsx`)
- **Card Identity**: Retains commercial specificity without looking like residential.
- **Key Metrics Highlighted**: Space Type (Office/Shop/Showroom), Built-up / Carpet Area, Washrooms, Furnishing Status, and Rate/sq.ft.
- **Styling**: Same canonical border `#E9E6E0`, `rounded-[20px]`, white surface, and consistent hover interaction.

### C. PG & Rooms Card (`PgRoomsSection.tsx` / `PropertyCard.tsx`)
- **Key Metrics Highlighted**: Monthly Rent, Sharing/Occupancy Type (Single / Twin / Triple), Food / Meal status, High-speed Wi-Fi, and Locality.
- **Layout**: Compact, easily scannable grid layout matching the canonical card system.

### D. Flatmate Card (`FlatmateCard.tsx`)
- **Avatar & Identity**: 56px squircle avatar (`rounded-2xl`) with verified checkmark badge.
- **Information Hierarchy**: Flatmate Name $\rightarrow$ Profession $\rightarrow$ Looking in Locality $\rightarrow$ Max Budget $\rightarrow$ Room Preference.
- **Visual Feel**: Social, clean, human, and distinct from a real-estate listing while using the same REHVO card container token.

---

## 8. Button & Interactive Control System

| Button Variant | Background | Border | Text | Hover State | Usage Context |
|---|---|---|---|---|---|
| **Primary CTA** | `#FF5533` | None | `#FFFFFF` (Bold) | `#EE4422` + soft glow shadow | Main action (Search, List Property, Contact Owner) |
| **Dark Primary** | `#19181C` | None | `#FFFFFF` (Bold) | `#2A272E` | Category switchers, app download action |
| **Secondary Surface** | `#FFFFFF` | `1px solid #E9E6E0` | `#19181C` (Bold) | `#F7F5F0` + `border-[#D5D0C6]` | Filters, View All, Manage, Edit |
| **Ghost / Text Link** | Transparent | None | `#19181C` or `#FF5533` | Underline / `#EE4422` | "View Details →", "See all 12 properties →" |
| **Icon Action** | `#FFFFFF` | `1px solid #E9E6E0` | `#19181C` | Scale 1.05 + `#FF5533` text | Save heart, Share, Carousel next/prev |

---

## 9. Section Rhythm & Global Content Width

### Global Max-Width
- **Standard Content Width**: Fixed at `max-w-[1360px]` across all sections (Header, Hero, Marketplace Feeds, Promo Banners, and Footer).
- **Narrow Reader Content**: `max-w-4xl` for search forms, FAQ items, and trust testimonials.

### Section Vertical Padding & Alternation Scale
To eliminate monotonous "white card fatigue", sections will alternate rhythmically:
1. **Primary Search**: `#F7F5F0` canvas, `py-10 sm:py-14`.
2. **Auto-Sliding Ads**: `#FFFFFF` surface strip, `py-6 sm:py-8`.
3. **Residential Rent Section**: `#F7F5F0` canvas with `#FFFFFF` cards, `py-14 sm:py-18`.
4. **Commercial Section**: `#FFFFFF` surface container with subtle `#E9E6E0` border, `py-14 sm:py-18`.
5. **PG & Rooms Section**: `#F7F5F0` canvas, `py-14 sm:py-18`.
6. **Flatmate Showcase**: `#FFFFFF` surface with light neutral backdrop, `py-14 sm:py-18`.
7. **Featured Single Property**: Elevated `#FFFFFF` spotlight card, `py-12 sm:py-16`.
8. **Cities / Localities**: `#F7F5F0` canvas, `py-12 sm:py-16`.
9. **Explore REHVO**: Clean tag grid on `#FFFFFF`, `py-12 sm:py-16`.
10. **Why REHVO (Trust & Comparison)**: `#F7F5F0` canvas with 3 trust feature cards, `py-14 sm:py-18`.
11. **Host / List CTA**: Premium dark or warm-surface banner with direct CTAs, `py-12 sm:py-16`.
12. **Footer**: Clean `#FFFFFF` base with border `#E9E6E0`, `py-14 sm:py-18`.

---

## 10. Imagery, Animations & Motion Polish

- **Aspect Ratios**: Enforce standard `16:10` for horizontal property cards and `1:1` for avatars/localities.
- **Image Fallbacks**: Robust handling using the existing `RehvoImage` component with category-specific fallback images.
- **Micro-Interactions**:
  - Card hover: Subtle `translate-y-[-3px]` with smooth cubic-bezier transition (`transition-all duration-300 ease-out`).
  - Button press: `active:scale-[0.98]`.
  - Dropdowns & sheets: Fade-in + slide-in from top (`duration-200`).
  - No disruptive bouncing or excessive parallax.

---

## 11. Responsive Behavior & Viewport Guidelines

- **Mobile (< 640px)**:
  - Single-column card grid (`grid-cols-1`).
  - Horizontal scrolling carousels for category tags and locality pills.
  - Sticky bottom contact/action bars on property detail pages.
- **Tablet (640px – 1024px)**:
  - 2-column card grid (`grid-cols-2`).
  - Simplified 2-row search dock.
- **Desktop (1024px – 1360px)**:
  - 3-column or 4-column card grid (`grid-cols-3` / `grid-cols-4`).
  - Inline search dock with full filter dropdowns.
- **Large Desktop (> 1360px)**:
  - Centered `max-w-[1360px]` with balanced margins.

---

## 12. Component Cleanup & Classification

| Component File | Role | Classification | Proposed Action |
|---|---|---|---|
| `web/src/components/home/RehvoHeader.tsx` | Main Website Navigation | **CANONICAL** | Polish colors, spacing, active indicators |
| `web/src/components/home/RehvoFooter.tsx` | Main Website Footer | **CANONICAL** | Align tokens, improve typography and contrast |
| `web/src/components/home/PrimarySearchSection.tsx` | Hero & Search Dock | **CANONICAL** | Refine dock container, inputs, button tokens |
| `web/src/components/public/PropertyCard.tsx` | Residential Property Card | **CANONICAL** | Refine radius, shadow, specs bar, and CTA |
| `web/src/components/public/FlatmateCard.tsx` | Flatmate Profile Card | **CANONICAL** | Normalize container border, colors, and badge |
| `web/src/components/ui/RehvoImage.tsx` | Safe Image Pipeline | **CANONICAL** | Keep as primary image renderer |
| `web/src/components/public/PublicNavbar.tsx` | Legacy Stub | **UNUSED** | Mark for deprecation |
| `web/src/components/public/PublicFooter.tsx` | Legacy Stub | **UNUSED** | Mark for deprecation |

---

## 13. Phased Implementation Roadmap

```
PHASE 1: Master Design Tokens (tailwind.config.js + globals.css)
  ↓
PHASE 2: Header & Navigation Polish (RehvoHeader.tsx)
  ↓
PHASE 3: Hero & Primary Search Polish (PrimarySearchSection.tsx)
  ↓
PHASE 4: Canonical Card Systems (PropertyCard.tsx, FlatmateCard.tsx)
  ↓
PHASE 5: Homepage Section Rhythm & Visual Polish (app/page.tsx + home/*)
  ↓
PHASE 6: Category Discovery Pages (/rent, /commercial, /pg-rooms, /flatmates)
  ↓
PHASE 7: Property Details Page (/property/[slug])
  ↓
PHASE 8: Auxiliary Pages (/about, /contact, /localities, /saved, /login, /signup)
  ↓
PHASE 9: Footer Polish (RehvoFooter.tsx)
  ↓
PHASE 10: Responsive & Accessibility QA
  ↓
PHASE 11: End-to-End Visual Verification & Screenshot Proof
```

---

## 14. Visual Verification Checklist

For each phase during future implementation, verification will validate:
- [ ] No layout shifts or text overflow on Mobile (390px), Tablet (768px), and Desktop (1440px).
- [ ] Neutral `#F7F5F0` background consistently applied across all pages without rogue color bands.
- [ ] Restrained `#FF5533` accent strictly limited to primary CTAs and active states.
- [ ] Card radii and shadows uniform across residential, commercial, PG, and flatmate feeds.
- [ ] All typography renders in Plus Jakarta Sans with proper optical hierarchy.
- [ ] TypeScript (`npm run web:typecheck`) passes with 0 errors.
- [ ] Production build (`npm run web:build`) compiles all 34 routes cleanly.
- [ ] Live runtime test on `http://localhost:3001` matches reference aesthetic.
