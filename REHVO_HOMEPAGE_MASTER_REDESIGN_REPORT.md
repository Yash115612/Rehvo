# REHVO Web — Complete Premium Homepage Rebuild Report

**Platform**: REHVO Public Web Marketplace (`/web`, Next.js 14 App Router, ISR + Server Components)  
**Scope**: Complete Ground-Up Rebuild from Header $\rightarrow$ Hero $\rightarrow$ Search $\rightarrow$ Trust $\rightarrow$ Locations $\rightarrow$ Properties $\rightarrow$ Categories $\rightarrow$ Flatmates $\rightarrow$ Why REHVO $\rightarrow$ How It Works $\rightarrow$ Host CTA $\rightarrow$ App CTA $\rightarrow$ Final CTA $\rightarrow$ Footer  
**Backend**: Live Supabase (`ap-south-1`, Mumbai)

---

## 1. Reference-Inspired Design Direction & Philosophy

| Principle | Execution on REHVO |
|---|---|
| **Editorial Rhythm** | Alternating section themes (Midnight `#121118`, Linen `#F8F7F4`, Crisp White `#FFFFFF`, Dark Obsidian `#171522`) ensuring no repeating "card-soup" or visual fatigue. |
| **Asymmetric Layouts** | Left-heavy typography paired with architectural photography; 1 dominant featured home + 2 stacked supporting units; 1 flagship locality + 4 compact tiles. |
| **Property-First Hierarchy** | Prices (`₹32,000 / month`) are the strongest typographic anchor, followed by locality branding, minimal specs, and verified host credentials. |
| **Human & Social Tone** | Flatmates section designed with personal portrait tiles, lifestyle badges, and budget indicators—distinct from property listings. |

---

## 2. REHVO Official Brand Implementation

- **Brand Tokens**:
  - Primary Accent: `#6C4DFF` (purple-600) with gradient text transitions
  - Dark Surfaces: `#121118`, `#171522`, `#0E0D14`, `#0A090F`
  - Light Surfaces: `#F8F7F4`, `#FFFFFF`, `#FAF9F6`, `stone-50`
  - Verified / Savings Accents: `#10B981` (emerald-500)
  - Typography: Confident Plus Jakarta Sans with geometric display headings and tight letter spacing (`tracking-tight`).

---

## 3. Detailed Breakdown of the 12 Rebuilt Sections

### 1. Floating Curved Header ([`PublicNavbar.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/components/public/PublicNavbar.tsx))
- Inset floating capsule navbar with subtle border and backdrop blur (`bg-white/95 backdrop-blur-xl`).
- Left: Signature dark `R` icon + `REHVO.` wordmark.
- Center: Segmented pills for Properties, Flatmates, PG & Rooms, Locations, Compare.
- Right: Saved heart counter + Login + Unified **"Start on REHVO"** action popover (List Property / Create Flatmate Profile).

### 2. Editorial Hero Section
- Left: Eyebrow pill `RENT. LIVE. BELONG.`, display headline `"Find a place that feels like home."` with accent gradient on *"home."*, concise supporting text, dual action buttons (`Explore Homes` & `List Your Property`), and trust checkmarks.
- Right: High-resolution modern apartment frame with gradient overlay, locality caption, and two floating depth beacons:
  - *Guaranteed Zero Fee* (Savings indicator: ₹45,000 - ₹90,000)
  - *Physical Tour Booked* (Confirmed walkthrough beacon)

### 3. Tactile Hero Search Console ([`HeroSearch.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/components/public/HeroSearch.tsx))
- Overlapping the lower hero container.
- Segmented category tabs: `All Rentals`, `Flats & BHKs`, `Single Rooms`, `PG / Co-Living`, `Flatmates`.
- Three input fields: Location autocomplete (real Mumbai hubs), Format/Bedrooms selector, and Max Budget selector.
- Direct URL search submission to `/search?city=mumbai&locality=...&type=...`.

### 4. Trust & Value Strip
- Attached below search:
  - `Verified Listings` (100% genuine homeowners)
  - `Direct Conversations` (Live in-app chat with hosts)
  - `Easy Scheduling` (Pick walkthrough time slots)
  - `Secure & Trusted` (Zero broker commissions)

### 5. Popular Locations ("Explore Mumbai by neighbourhood")
- Left: Flagship Bandra West tile with average rent benchmarks and lifestyle description.
- Right: 4 compact locality tiles for Andheri West, Powai, Worli, and Juhu.
- All linking directly to `/mumbai/[locality]`.

### 6. Featured Property Showcase ([`PropertyShowcase.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/components/public/PropertyShowcase.tsx))
- Live Supabase query (`getPublishedProperties`).
- Asymmetric 1+2 hero layout: 1 panoramic dominant residence + 2 vertically stacked compact listings + tertiary row.
- Interactive optimistic heart save button syncing with `public.saved_properties`.

### 7. Browse by Category
- 5 large image tiles:
  1. *Flats & Apartments* (`/mumbai?type=flat`)
  2. *Private Single Rooms* (`/rooms/mumbai`)
  3. *PG & Co-Living* (`/pg/mumbai`)
  4. *Studio Apartments* (`/studios/mumbai`)
  5. *Flatmate Discovery* (`/flatmates/mumbai`)

### 8. Flatmates ("Live with people you actually like")
- Real flatmate profiles queried from Supabase `public.flatmate_profiles`.
- Editorial roommate cards with user photo/initial, profession, locality, budget, and lifestyle tags.

### 9. Why REHVO (Statement-Driven Section)
- Midnight surface (`#121118`) with headline:
  ```
  Find better.
  Connect directly.
  Move with confidence.
  ```
- 3 visual pillars: `01 — 100% Zero Brokerage`, `02 — Direct Real-Time Chat`, `03 — Scheduled On-Site Visits`.

### 10. How It Works
- Light canvas (`#FAF9F6`): 3-step sequence:
  - `01. Discover & Filter`
  - `02. Chat & Schedule Tour`
  - `03. Move In Direct`

### 11. Host / List Property Split Section
- Contrast container (`#171522`): Left exterior architecture + Right call-to-action `"Have a place to rent? List it on REHVO."` linking to `/owner/properties/new`.

### 12. App Promotion & Final Closing CTA
- App showcase container with iOS and Android badges.
- Final closing section on `#0E0D14`: `"Your next place could be closer than you think."` with dual CTAs.

### 13. Comprehensive Footer ([`PublicFooter.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/web/src/components/public/PublicFooter.tsx))
- 5 clean columns: Brand & Contact, Explore, For Renters, For Hosts, Company & Legal.

---

## 4. Verification & Test Matrix

### 1. 33-Endpoint Integration Test Suite (`test_web_full_product_suite.js`)
- **Result**: `33 PASSED / 0 FAILED (100% Success)`.
- All routes returned **HTTP 200 OK**.

### 2. Multi-Target TypeScript Compilation

| Target | Command | Result |
|---|---|:---:|
| **Public Web Platform (`web/`)** | `npm run typecheck && npm run build` | **0 errors (30 static & dynamic routes compiled)** |
| **Admin Control Panel (`admin/`)** | `npm run typecheck && npm run build` | **0 errors (20 pages compiled)** |
| **Mobile React Native App (`/`)** | `npx tsc --noEmit` | **0 errors** |
