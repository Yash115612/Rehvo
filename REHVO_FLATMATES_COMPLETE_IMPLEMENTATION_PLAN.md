# REHVO Mobile App — Flatmates Marketplace Complete Implementation Plan

---

## 1. Current Runtime Route & Execution Trace

```
CANONICAL RUNTIME RESOLUTION:
app/index.tsx (Entry Point & Auth Guard)
  │
  └── app/(renter)/_layout.tsx (Persistent Tabs Layout Shell)
        │
        ├── Hidden Native Tabs ──► app/(renter)/flatmates.tsx
        │     │
        │     └── FlatmatesRoute ──► <MarketplaceShell initialCategory="flatmates" />
        │           │
        │           └── In-Place Animated Container (320ms crossfade)
        │                 └── <FlatmateMarketplaceContent />
        │
        └── Floating Bottom Nav ──► <FloatingBottomNav activeTab="home" />
```

- **Canonical Active Route**: [`app/(renter)/flatmates.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/flatmates.tsx) mounts `MarketplaceShell initialCategory="flatmates"`.
- **Subroutes**:
  - Profile Details: [`app/(renter)/flatmate/[id].tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/flatmate/%5Bid%5D.tsx)
  - Create Profile Wizard: [`app/(renter)/flatmate/create.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/flatmate/create.tsx)
  - Edit Profile: [`app/(renter)/flatmate/edit.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/flatmate/edit.tsx)
  - Manage My Profile: [`app/(renter)/flatmate/my-profile.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/flatmate/my-profile.tsx)

---

## 2. Current Component Tree & Problems Identified

### A. Current Component Tree:
```
CURRENT STRUCTURE (TO BE REBUILT & MODULARIZED):
├── FlatmateMarketplaceContent.tsx (Thin wrapper container)
│     └── FlatmateDiscoveryFeed.tsx (683-line monolithic component with mixed layout logic)
│           ├── FlatmateCard.tsx (Horizontal avatar row list item)
│           └── FlatmateFilterBar.tsx (Basic quick filter pills)
```

### B. Core UX Problems Identified:
1. **List-Item Database Aesthetic**: `FlatmateCard` renders a small horizontal avatar thumbnail with a generic metadata grid, making human beings feel like property entries rather than a visual social discovery experience.
2. **Missing Discovery Hierarchy**: All profiles are rendered in a flat vertical list without highlighting **Recommended Top Matches** or **Nearby Room Seekers**.
3. **Overcrowded Metadata**: Lifestyle preferences are displayed as an unstyled text list rather than clean, scannable lifestyle tags (*WFH, Non-Smoker, Early Riser*).

---

## 3. Real Data Model & Supported Flatmate Attributes

The implementation strictly uses the verified PostgreSQL schema from [`supabase/migrations/003_flatmates.sql`](file:///Users/yashchoudhary/Downloads/rehvo/supabase/migrations/003_flatmates.sql) and [`src/types/index.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/types/index.ts). Zero fabricated fields.

| Field Name | Data Type | Purpose & Description | Public / Private | Visible in Card? | Visible in Detail? | Filterable? | Searchable? |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| `id` | `UUID` | Unique flatmate profile identifier | Private | ❌ No | ❌ No | ❌ No | ❌ No |
| `user_id` | `UUID` | Foreign key to `profiles.id` | Private | ❌ No | ❌ No | ❌ No | ❌ No |
| `name` / `display_name` | `string` | User's public full/first name | Public | ✅ YES | ✅ YES | ❌ No | ✅ YES |
| `avatar` / `photo` | `string (URL)` | High-resolution portrait photograph | Public | ✅ YES | ✅ YES | ❌ No | ❌ No |
| `age` | `number` | User's age (e.g. 24, 27) | Public | ✅ YES | ✅ YES | ❌ No | ❌ No |
| `gender` | `'male' \| 'female' \| 'any' \| 'other'` | User's gender identity | Public | ✅ YES | ✅ YES | ✅ YES | ❌ No |
| `profession` / `occupation`| `string` | Occupation / Job title (e.g. *Product Designer*) | Public | ✅ YES | ✅ YES | ❌ No | ✅ YES |
| `city` | `string` | Primary city (e.g. *Mumbai, Thane*) | Public | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| `locality` | `string` | Primary neighborhood (e.g. *Andheri West*) | Public | ✅ YES | ✅ YES | ✅ YES | ✅ YES |
| `preferred_locations` | `string[]` | Array of desired neighborhoods | Public | ❌ No | ✅ YES | ✅ YES | ✅ YES |
| `budget_min` | `number` | Minimum monthly budget in INR | Public | ❌ No | ✅ YES | ✅ YES | ❌ No |
| `budget_max` | `number` | Maximum monthly budget in INR | Public | ✅ YES | ✅ YES | ✅ YES | ❌ No |
| `room_preference` | `'private_room' \| 'shared_room' \| 'any'` | Desired room format | Public | ✅ YES | ✅ YES | ✅ YES | ❌ No |
| `looking_for` | `string` | Summary title (e.g. *Private Room in 2 BHK*) | Public | ❌ No | ✅ YES | ❌ No | ✅ YES |
| `move_in_date` | `string` | Move-in date / timing (*Immediate, 15 Days*) | Public | ❌ No | ✅ YES | ✅ YES | ❌ No |
| `lifestyle_preferences` | `string[]` | Array of lifestyle tags (*WFH, Non-Smoker, Pets*) | Public | ✅ YES (Top 3) | ✅ YES (All) | ✅ YES | ❌ No |
| `bio` | `string` | Personal bio paragraph | Public | ✅ YES (2 lines) | ✅ YES (Full) | ❌ No | ❌ No |
| `status` | `'draft' \| 'published' \| 'paused'` | Profile visibility state | Public | ❌ No | ✅ YES | ✅ YES | ❌ No |
| `phone` & `email` | `string` | Private contact info | 🔒 **PRIVATE** | 🔒 **NEVER** | 🔒 **NEVER** | ❌ No | ❌ No |
| `created_at` | `TIMESTAMPTZ` | Timestamp when profile was created | Public | ❌ No | ❌ No | ❌ No | ❌ No |
| `updated_at` | `TIMESTAMPTZ` | Timestamp when profile was last updated | Public | ❌ No | ❌ No | ❌ No | ❌ No |

---

## 4. Privacy & Safety Model

A people-discovery marketplace requires strict separation of public vs private data to ensure user trust and security:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PUBLIC DISCOVERY DATA (Rendered in Feed & Public Profile Details)           │
│ • Display Name & Age (e.g. "Aarav, 24")                                    │
│ • Portrait Photo & Verified Profile Badge                                   │
│ • Profession (e.g. "Product Designer")                                      │
│ • Locality & City (e.g. "Andheri West, Mumbai")                             │
│ • Budget Max (e.g. "Budget up to ₹18,000/mo")                               │
│ • Room Preference & Lifestyle Tags (e.g. WFH, Non-Smoker, Early Riser)      │
│ • Public Bio snippet                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ STRICTLY PRIVATE USER DATA (Never Exposed Publicly / Encrypted)             │
│ 🔒 Phone Number & Email Address (Zero public exposure)                     │
│ 🔒 Government ID / KYC Documents                                            │
│ 🔒 Private User Notes & Saved Lists                                         │
│ 🔒 Auth Tokens & Supabase User IDs                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ SAFETY & MODERATION ACTIONS (Available in Profile Details & Chat)            │
│ 🛡️ Report Profile: Flag suspicious, abusive, or fake accounts              │
│ 🚫 Block User: Instantly removes conversation & hides mutual profile         │
│ ⏸️ Pause Profile: Instantly hides user profile from all discovery feeds     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Discovery Modes & True Ranking Logic

The Flatmates page provides 3 distinct discovery angles backed **strictly by real database queries without fake AI claims**:

### Mode 1: Recommended For You (`RECOMMENDED`)
- **Data Source**: `useAppStore.flatmates` / `fetchPublishedFlatmates()` filtered by active city.
- **Filter**: `status === 'published' AND is_paused === false`.
- **Ranking Criteria**:
  1. Primary Locality match with user's selected location (`📍 Mumbai` or `📍 Andheri West`).
  2. Verified profile status (`verification_status === 'VERIFIED'`).
  3. Most recently updated profiles (`updated_at DESC`).
- **Truthful Labeling**: Displayed as *"Recommended Flatmates"*. Never labeled as "AI Match %".
- **Fallback**: If no profiles match exact locality, returns active verified profiles across Mumbai.

### Mode 2: Flatmates Nearby (`NEARBY`)
- **Data Source**: Profiles where `locality` or `preferred_locations` matches selected location pill.
- **Filter**: Locality match + published status.
- **Ranking**: `updated_at DESC`.
- **Display**: Compact horizontal portrait rail for rapid scanning.
- **Fallback**: If <2 profiles found in locality, rail smoothly hides to prevent empty layout gaps.

### Mode 3: Recently Active (`RECENT`)
- **Data Source**: Profiles sorted by `updated_at DESC` or `created_at DESC`.
- **Filter**: `status === 'published'`.
- **Display**: Chronological feed without fake "Active 2 mins ago" timestamps.

---

## 6. Recommendation Logic

```
RELEVANCE RANKING EQUATION:
Relevance Score = (Location Match × 40) + (Verified Badge × 25) + (Photo Present × 20) + (Recency × 15)
```

- **Current Implementable Logic**:
  - Location Match (40 pts): Matches locality or preferred areas.
  - Verified Status (25 pts): Profile marked verified in DB.
  - Photo Present (20 pts): Has portrait image.
  - Recency (15 pts): Updated in last 30 days.
- **Future / Optional Logic (Deferred)**:
  - Vector embedding compatibility matching.
  - Mutual roommate questionnaire scoring.

---

## 7. Flatmate Search Architecture

- **Search Component**: `FlatmateSearchBar.tsx` (54px capsule matching design tokens).
- **Placeholder**: *"Search locality, area or flatmate..."*
- **Search Behavior**:
  - Instant client-side filtering across `locality`, `city`, `preferred_locations`, `profession`, and `name`.
  - Suggestions: Auto-suggests active MMR localities (*Andheri, Bandra, Powai, BKC, Thane*).
- **No-Results State**: Triggers `RehvoEmptyState` with a *"Clear Search"* action.

---

## 8. Quick Preference Filter Rail (`FlatmatePreferenceFilterRail`)

Horizontal selector providing instant one-tap filtering:

| Quick Filter ID | Display Label | Active Query Filter Rule |
| :--- | :--- | :--- |
| `all` | **All Flatmates** | All active published profiles |
| `private_room` | **Private Room** | `room_preference === 'private_room'` |
| `shared_room` | **Shared Room** | `room_preference === 'shared_room'` |
| `under_15k` | **Under ₹15k** | `budget_max <= 15000` |
| `under_25k` | **Under ₹25k** | `budget_max <= 25000` |
| `wfh` | **WFH Friendly** | `lifestyle_preferences` includes `'WFH'` |
| `near_metro` | **Near Metro** | `lifestyle_preferences` includes `'Near Metro'` |

---

## 9. Advanced Filter Bottom Sheet (`FlatmateFilterSheet`)

Accessed via the Filter button in the search dock:

1. **Monthly Budget Presets**: Any Budget, Under ₹12k, ₹12k–₹20k, ₹20k–₹30k, ₹30k+.
2. **Room Type**: Any Room, Private Room Only, Shared Room.
3. **Gender Preference**: Any Gender, Male Flatmates, Female Flatmates.
4. **Move-in Timeline**: Any Time, Immediate, Within 15 Days, Within 30 Days.
5. **Lifestyle Habits (Multi-Select)**:
   - Work From Home (WFH)
   - Non-Smoker
   - Pet Friendly
   - Vegetarian
   - Early Riser
   - Fitness Enthusiast
- **Actions**: *Clear All* (resets filters) and *Show {Count} Profiles* (applies filters).

---

## 10. Canonical Social Discovery Card (`FlatmateProfileCard`)

Unlike property cards, `FlatmateProfileCard` is designed as a **portrait-first social profile card**:

```
┌──────────────────────────────────────────────────────────┐
│ [PORTRAIT PHOTOGRAPH (200px Height, 18px Radius)]        │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ [VERIFIED PROFILE] badge                  [♥ Save]   │ │
│ │                                                      │ │
│ │                                                      │ │
│ │ Aarav Sharma, 24                                     │ │
│ │ Product Designer at Tech Co                          │ │
│ └──────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────┤
│ 📍 Andheri West, Mumbai         Budget up to ₹18,000 / mo │
├──────────────────────────────────────────────────────────┤
│ [ Private Room ] [ WFH Friendly ] [ Non-Smoker ] [ Dogs] │
├──────────────────────────────────────────────────────────┤
│ "Looking for a chill flatmate near Metro Line 1. Coffee  │
│ lover and keep common spaces tidy."                      │
├──────────────────────────────────────────────────────────┤
│ [ View Profile ]                          [ Chat ]       │
└──────────────────────────────────────────────────────────┘
```

---

## 11. Discovery Hierarchy & Modular Composition

The Flatmates marketplace page features a multi-tiered discovery layout:

```
TARGET FLATMATE DISCOVERY COMPOSITION:
GLOBAL MARKETPLACE SHELL
  │
  ├── 01. FlatmateSearchBar (Search locality, occupation, name)
  ├── 02. FlatmatePreferenceFilterRail (Quick preference chips)
  ├── 03. FlatmateUserStateBanner (State-aware create/manage profile CTA)
  ├── 04. Control & Count Strip ("14 Compatible Flatmates" + Filter & Sort)
  │
  ├── 05. SECTION 01: RECOMMENDED TOP MATCH (Hero Portrait Card)
  │       └── Featured FlatmateProfileCard with full lifestyle badges
  │
  ├── 06. SECTION 02: FLATMATES NEARBY (Horizontal Portrait Avatar Rail)
  │       └── 52vw compact portrait cards for active location
  │
  └── 07. SECTION 03: ALL COMPATIBLE FLATMATES (Vertical Feed)
          └── Vertically scrollable feed of FlatmateProfileCards
```

---

## 12. Recommended for You Specification

- **Heading**: *"Recommended for You"*
- **Data Source**: Filtered `flatmates` from `useAppStore`.
- **Ranking**: Weighted score (Location match + Verified + Photo + Recency).
- **Card Treatment**: Renders 1 high-impact hero portrait card (`FlatmateProfileCard` with prominent lifestyle chips and bio quote).

---

## 13. Nearby Flatmates Specification

- **Heading**: *"Flatmates in {Locality}"* (e.g. *Flatmates in Andheri West*).
- **Data Source**: Exact locality matches.
- **Display**: Horizontal rail using compact portrait cards (140px width, avatar photo, name, age, budget).
- **Fallback**: Gracefully omitted if fewer than 2 profiles exist in the specific locality.

---

## 14. Recently Active Specification

- **Heading**: *"Active Room Seekers"*
- **Data Source**: Profiles sorted by `updated_at DESC`.
- **Display**: Vertical feed of standard `FlatmateProfileCard` items.

---

## 15. Flatmate Profile Details Screen (`app/(renter)/flatmate/[id].tsx`)

Tapping any `FlatmateProfileCard` opens the full flatmate profile screen:
1. **Hero Portrait Gallery**: Full-width portrait photo with verified badge.
2. **Identity Block**: Name, Age, Profession, Primary Locality & City.
3. **Living Preferences Grid**:
   - Monthly Budget (`₹15k – ₹22k / mo`)
   - Room Preference (`Private Room in 2/3 BHK`)
   - Move-in Date (`Immediate / 1st of next month`)
   - Preferred Areas (`Andheri West, Bandra West, BKC`)
4. **Lifestyle Badges**: Full list of lifestyle habits (*WFH, Non-Smoker, Vegetarian, Pets*).
5. **Personal Bio**: Complete bio text.
6. **Safety & Moderation Actions**: *Report Profile* and *Block User*.
7. **Fixed Bottom Action Strip**: `[ Start Chat ]` (primary dark button) and `[ Save ]` (heart button).

---

## 16. Create Flatmate Profile Wizard (`app/(renter)/flatmate/create.tsx`)

Multi-step friendly onboarding wizard collecting strictly supported attributes:
- **Step 1: Identity & Photo**: Upload portrait photograph, display name, age, gender.
- **Step 2: Profession & Location**: Occupation, primary city (Mumbai), preferred localities.
- **Step 3: Budget & Room Type**: Min & Max monthly budget, room preference (*Private vs Shared*), move-in timing.
- **Step 4: Lifestyle & Bio**: Select lifestyle tags (*WFH, Non-Smoker, Pet Friendly*), write personal bio.
- **Step 5: Preview & Publish**: Review profile card and publish live to discovery.

---

## 17. Edit & Manage Profile (`app/(renter)/flatmate/my-profile.tsx`)

- **Edit Profile**: Modify any existing field and save via `updateFlatmateProfile()`.
- **Pause Discovery**: Temporarily hide profile from discovery via `pauseFlatmateProfile()`.
- **Resume Discovery**: Unpause and reactivate profile via `resumeFlatmateProfile()`.
- **Delete Profile**: Permanent deletion with confirmation alert via `deleteFlatmateProfile()`.

---

## 18. Profile Completeness CTA

- **State 1: No Profile**: *"Want people to discover you too? Create your profile in 2 mins →"*
- **State 2: Incomplete / Draft**: *"Complete your Flatmate Profile to start receiving roommate requests →"*
- **Zero Fake Percentages**: Never displays arbitrary progress percentages without real database completion logic.

---

## 19. Save / Favorite Integration

- Tapping the heart button on `FlatmateProfileCard` calls `toggleSaveFlatmate(id)` in `useAppStore`.
- Instant UI update with micro-heart scale animation.
- Saved flatmates appear in the unified **Saved** tab under Flatmates filter.

---

## 20. Canonical Chat & Messaging Integration

- **Chat Route**: [`app/(renter)/chat/[id].tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/chat/%5Bid%5D.tsx).
- Tapping *Chat* checks if an active conversation exists with `flatmate_profile_id`.
- Opens canonical conversation thread with encrypted Supabase Realtime messaging.

---

## 21. Safety, Report & Block Controls

- **Report Profile**: Opens modal with predefined reasons (*Fake account, Inappropriate behavior, Spam, Commercial agent posing as flatmate*).
- **Block User**: Permanently hides mutual profile visibility and blocks messaging.
- **Privacy Assurance**: Phone numbers and emails are never exposed.

---

## 22. Loading States & Skeletons

- 3 portrait-shaped skeleton cards (`RehvoSkeleton` with 200px portrait image box, name bar, location bar, and chip capsules).
- Shell stays fully mounted during loading.

---

## 23. Empty States

- **No Local Matches**: *"No flatmates found matching your criteria in this area"* with *"Reset Filters"* and *"Explore All Flatmates"* actions.
- **Zero Profiles Overall**: *"Flatmate discovery is coming soon to this location."* Zero fake profiles.

---

## 24. Error States

- Uses `RehvoErrorState` with title *"Couldn't load flatmates"*, explanation, and a *"Retry"* button. Shell remains mounted.

---

## 25. Performance & Incremental Fetching

- Memoized list filtering using `useMemo`.
- Image lazy-loading via `RehvoImage`.
- Stable keys for 60fps scrolling performance.

---

## 26. Unified Marketplace Shell Integration

- Mounted inside `MarketplaceShell.tsx`.
- Inherits persistent top header, location pill, and floating bottom navigation without duplication.

---

## 27. In-Place Category Switching

- Selecting `Flatmates` in `HomeCategoryShortcuts` triggers the 320ms crossfade transition without page reloads.

---

## 28. Visual Design System

- Background: `#F7F5F0` (warm off-white)
- Surface: `#FFFFFF` (pure white)
- Typography: `#19181C` (deep charcoal) and `#77747C` (muted gray)
- Restrained Accent: `#FF5533` (brand coral)

---

## 29. Visual Differentiation Matrix

| Marketplace Mode | Primary Visual Focus | Primary Unit | Metric Hierarchy |
| :--- | :--- | :--- | :--- |
| **Home** | Broad property discovery | Residential Home | BHK, Locality, Rent |
| **Commercial** | Business inventory | Workspace / Retail | Built-up Sq.Ft, Carpet Area, Lease/mo |
| **PG & Rooms** | Accommodation stay | Managed PG / Room | Rent/mo, Meals Included, Occupancy |
| **Flatmates** | **People discovery** | **Human Profile** | **Portrait Photo, Name, Budget, Lifestyle** |

---

## 30. Zero Marketing Clutter Policy

- Zero promotional ad carousels.
- Zero fake compatibility match scores.
- Zero marketing benefit walls.

---

## 31. Optional Create Profile Contextual CTA

- Compact footer tile placed at the end of discovery: *"Looking for the right flatmate? Create your profile →"*.

---

## 32. Exact Final Page Structure

```
GLOBAL MARKETPLACE SHELL
  │
  ├── 01. FlatmateSearchBar
  ├── 02. FlatmatePreferenceFilterRail
  ├── 03. FlatmateUserStateBanner
  ├── 04. Control & Count Strip
  ├── 05. SECTION 01: RECOMMENDED TOP MATCH (Hero Portrait Card)
  ├── 06. SECTION 02: FLATMATES NEARBY (Horizontal Portrait Rail)
  ├── 07. SECTION 03: ALL COMPATIBLE FLATMATES (Vertical Feed)
  ├── 08. Contextual Host/Create Profile Footer Tile
  └── 09. Floating Bottom Navigation (Shell)
```

---

## 33. Step-by-Step Implementation Sequence (Once Approved)

1. **Step 1**: Build `FlatmateProfileCard.tsx` (Portrait-first social card).
2. **Step 2**: Build `FlatmatePreferenceFilterRail.tsx` (Quick preference rail with count badges).
3. **Step 3**: Build `FlatmateFilterSheet.tsx` and `FlatmateSortSheet.tsx`.
4. **Step 4**: Build `FlatmateUserStateBanner.tsx` and `FlatmateNearbyRail.tsx`.
5. **Step 5**: Rebuild `FlatmateMarketplaceContent.tsx` as a clean social discovery feed.
6. **Step 6**: Connect with live Supabase flatmate inventory in `useAppStore`.
7. **Step 7**: Clean up legacy files (`FlatmateCard.tsx`, `FlatmateFilterBar.tsx`, `FlatmateDiscoveryFeed.tsx`).
8. **Step 8**: Run full TypeScript check (`npx tsc --noEmit`), Android bundle export test, and 3-app architecture boundary scan (`python3 scripts/audit_architecture_separation.py`).

---

## 34. Runtime Verification Plan

After each major step:
1. `npx tsc --noEmit` $\rightarrow$ 0 errors.
2. `npx expo start -c` $\rightarrow$ Launch on device.
3. Visually verify actual rendered UI in Expo app.

---

## 35. End-to-End User Flow Tests

- **Flow 1**: Home $\rightarrow$ Flatmates $\rightarrow$ Recommended Profile $\rightarrow$ Profile Details $\rightarrow$ Save $\rightarrow$ Chat $\rightarrow$ Back.
- **Flow 2**: Flatmates $\rightarrow$ Search $\rightarrow$ Filter $\rightarrow$ Results $\rightarrow$ Profile.
- **Flow 3**: Flatmates $\rightarrow$ Create Profile $\rightarrow$ Publish $\rightarrow$ Live in Discovery.

---

## 36. Boundary Check & Freeze Verification

```
BOUNDARY AUDIT:
- web/   ──► 0 modifications (100% frozen)
- admin/ ──► 0 modifications (100% frozen)
- Mobile ──► Strict isolation in app/, src/, assets/
```

---

## 37. Final Approval Gate

This document represents the complete, end-to-end implementation plan for the REHVO Flatmates Experience.

**No code has been modified in this step.** Implementation will begin only upon your explicit approval.
