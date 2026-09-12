# REHVO Mobile App — Flatmates Marketplace Implementation Plan

---

## 1. Executive Summary & Product Objective

The **REHVO Flatmates Experience** is being completely redesigned into a **Human-Centric, Social Discovery & Roommate Matching Marketplace**.

### Core Product Principle:
$$\text{Flatmates Page} = \textbf{People Discovery} \quad (\text{NOT property listings}, \text{NOT commercial}, \text{NOT PG feed})$$

The user opens Flatmates and immediately gains the ability to:
1. **Discover compatible flatmates & room seekers** (*lifestyle, budget, room preference, locality*).
2. **Search by locality, occupation, or name** (*Bandra, Andheri, Powai, Tech Professional*).
3. **Filter by living preferences** (*Private vs Shared room, Budget up to ₹15k/₹25k, WFH, Non-Smoker, Near Metro*).
4. **Browse portrait-first social profile cards** (*photo, name, age, locality, budget, lifestyle tags*).
5. **View full Flatmate Profile details** (*bio, habits, move-in timing, preferences*).
6. **Save profiles & Start direct Chat** through canonical messaging.
7. **Create & Manage their own Flatmate Profile** (*live status, pause/resume, editing*).

---

## 2. Current Flatmates Route & Architecture Audit

### A. Current Runtime Route Trace:
```
app/(renter)/flatmates.tsx
  └── <MarketplaceShell initialCategory="flatmates" />
        └── <FlatmateMarketplaceContent />
              └── <FlatmateDiscoveryFeed />
```

### B. Current Component Tree & Problems Identified:
```
CURRENT STRUCTURE:
├── FlatmateMarketplaceContent.tsx (Thin wrapper)
├── FlatmateDiscoveryFeed.tsx (683-line feed with mixed layout logic)
├── FlatmateCard.tsx (Horizontal avatar row layout — looks like a list item rather than a social profile card)
├── FlatmateFilterBar.tsx (Basic filter pills)
├── FlatmateDetailsScreen.tsx (Profile details)
├── FlatmateCreateFlowScreen.tsx (Profile creation)
└── MyFlatmateProfileScreen.tsx (User profile management)
```

### Root Cause of Poor UX:
1. **List-Item Visuals**: `FlatmateCard` uses a small horizontal avatar thumbnail, making people look like database line items rather than a visual, portrait-first social discovery experience.
2. **Lack of Discovery Hierarchy**: All profiles are rendered in a flat vertical list without highlighting **Recommended Matches** or **Nearby Room Seekers**.
3. **Missing Stay/Profile Clarity**: Lifestyle badges are crammed into a generic meta grid rather than clean lifestyle tags (*WFH, Non-Smoker, Early Riser*).

---

## 3. Real Data Model & Supported Flatmate Attributes

The redesign strictly leverages existing Supabase schema and TypeScript domain models from [`src/types/index.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/types/index.ts). Zero fabricated attributes.

### Supported Flatmate Profile Attributes (`FlatmateProfile`):
- `id: string`: Unique flatmate profile ID.
- `user_id?: string`: Supabase user ID.
- `name: string` & `display_name?: string`: Display name.
- `age?: number`: Age (e.g. 24, 27).
- `gender?: 'Male' | 'Female' | 'Any' | 'Other'`: Gender identity.
- `occupation: string`: Occupation (e.g. *Product Designer, Software Engineer, Consultant, Student*).
- `city: string` & `locality: string`: Primary location (e.g. *Andheri West, Mumbai*).
- `preferred_locations?: string[]`: Preferred areas.
- `budget_min: number` & `budget_max: number`: Budget range in INR (e.g. *₹15,000 to ₹22,000*).
- `room_preference: 'Private Room' | 'Shared Room' | 'Any'`: Room type needed.
- `looking_for?: string`: Summary (e.g. *Private Room in 2 BHK*).
- `move_in_date: string` & `move_in_timing?: string`: Move-in timeline (*Immediate, Within 15 Days*).
- `bio: string`: Personal bio snippet.
- `avatar: string`: High-resolution portrait photograph.
- `lifestyle_preferences: string[]`: Lifestyle tags (*WFH, Non-Smoker, Early Riser, Pet Friendly, Vegetarian, Fitness Enthusiast*).
- `is_published?: boolean`: Profile live status.
- `is_paused?: boolean`: Profile pause status.

---

## 4. Target Flatmates Discovery Architecture

The new Flatmates experience provides a **portrait-first, social discovery layout**:

```
TARGET FLATMATE DISCOVERY ARCHITECTURE:
┌──────────────────────────────────────────────────────────┐
│ [TOP PERSISTENT SHELL]                                   │
│ Avatar  ·  "Good morning, Yash"  ·  📍 Mumbai  ·  Bell   │
├──────────────────────────────────────────────────────────┤
│ [FLATMATE SEARCH DOCK]                                   │
│ 🔍 "Search flatmates, occupation, locality..." [ Filter ]│
├──────────────────────────────────────────────────────────┤
│ [QUICK PREFERENCE FILTER RAIL (Horizontal Chips)]        │
│ [ All Flatmates ] [ Private Room ] [ Shared Room ]       │
│ [ Under ₹15k ] [ Under ₹25k ] [ WFH ] [ Near Metro ]     │
├──────────────────────────────────────────────────────────┤
│ [STATE-AWARE USER PROFILE BANNER]                        │
│ "Want people to discover you too? Create Profile →"      │
├──────────────────────────────────────────────────────────┤
│ [CONTROL & COUNT STRIP]                                  │
│ "14 Compatible Flatmates in Mumbai"  [ Sort: Recommended ]│
├──────────────────────────────────────────────────────────┤
│ [SECTION 01: RECOMMENDED MATCHES (Hero Portrait Card)]   │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ FlatmateProfileCard (Featured / Top Match)           │ │
│ │ • Large portrait photo (220px) + [VERIFIED] + [♥]    │ │
│ │ • Aarav Sharma, 24  ·  Product Designer              │ │
│ │ • Andheri West, Mumbai                               │ │
│ │ • Budget: Up to ₹18,000 / month                      │ │
│ │ • [ Private Room ] [ WFH ] [ Non-Smoker ]            │ │
│ │ • "Looking for a chilled flatmate near Metro line 1" │ │
│ │ • [ View Profile ] [ Chat ]                          │ │
│ └──────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────┤
│ [SECTION 02: FLATMATES NEARBY (Horizontal Portrait Rail)]│
│ [ (Avatar) Priya, 25 ]  [ (Avatar) Rohan, 27 ]  ...      │
├──────────────────────────────────────────────────────────┤
│ [SECTION 03: ALL COMPATIBLE FLATMATES (Vertical Feed)]   │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ FlatmateProfileCard #2 (Priya Desai, 25)             │ │
│ └──────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ FlatmateProfileCard #3 (Rohan Mehta, 27)             │ │
│ └──────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────┤
│ [FLOATING BOTTOM NAVIGATION (Persistent Shell)]          │
│ (Home)  (Search)  (+)  (Saved)  (Profile)                │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Detailed Component Specifications

### A. Flatmate Search Component (`FlatmateSearchBar`)
- **Visuals**: 54px capsule matching master tokens (`#FFFFFF` surface, `#E9E6E0` border, `#77747C` muted text).
- **Placeholder**: *"Search flatmates, occupation, locality..."*
- **Actions**:
  - Typing filters by locality, preferred area, occupation, or name.
  - Tapping filter button opens the dedicated **Flatmate Filter Bottom Sheet**.

### B. Quick Preference Selector (`FlatmatePreferenceFilterRail`)
- **Pills**: `All Flatmates`, `Private Room`, `Shared Room`, `Under ₹15k`, `Under ₹25k`, `WFH Friendly`, `Near Metro`.
- **Interaction**:
  - Tapping a pill immediately filters the feed in-place without page reload.
  - Active pill: `#19181C` background + `#FFFFFF` text + count badge.

### C. Dedicated Portrait Listing Card (`FlatmateProfileCard`)
- **Card Anatomy**:
  1. **Portrait Cover Image (200px)**: Uses [`RehvoImage`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/primitives/RehvoImage.tsx) with rounded 18px clipping, loading skeleton, and error fallback.
  2. **Top Overlay**: `[VERIFIED PROFILE]` badge on top-left, `[♥ Save]` heart on top-right.
  3. **Bottom Image Overlay**:
     - Name & Age: `Aarav Sharma, 24`
     - Occupation: `Product Designer at Tech Co`
  4. **Location & Budget Strip**:
     - Locality: `📍 Andheri West, Mumbai`
     - Budget: `Budget up to ₹18,000 / mo`
  5. **Lifestyle & Preference Chips**:
     - `Private Room`
     - `WFH Friendly`
     - `Non-Smoker`
     - `Early Riser`
  6. **Bio Snippet**: *"Looking for a chill flatmate near Metro Line 1. Coffee lover & tidy."*
  7. **Quick Action Buttons**:
     - *View Profile* (`RehvoButton` primary dark)
     - *Chat* (`RehvoButton` outline)

### D. Flatmate Filter Bottom Sheet (`FlatmateFilterSheet`)
- **Filter Controls**:
  1. **Budget Range Slider / Presets**: Under ₹12k, ₹12k–₹20k, ₹20k–₹30k, ₹30k+.
  2. **Room Type**: Any Room, Private Room Only, Shared Room.
  3. **Gender Preference**: Any Gender, Male Only, Female Only.
  4. **Move-in Timeline**: Immediate, Within 15 Days, Within 30 Days.
  5. **Lifestyle Preferences**: Work From Home (WFH), Non-Smoker, Pet Friendly, Vegetarian, Early Riser, Night Owl.
- **Actions**: *Clear All* and *Show {Count} Profiles*.

### E. Sort Control (`FlatmateSortSheet`)
- Options:
  1. **Recommended** (Default: Relevance, verified profiles, active seekers first)
  2. **Budget: Low to High**
  3. **Budget: High to Low**
  4. **Recently Active**

### F. State-Aware Profile Banner (`FlatmateUserStateBanner`)
- **State 1 (No Profile)**: *"Want people to discover you too? Create your profile in 2 mins →"*
- **State 2 (Profile Paused)**: *"Your profile is paused. Other flatmates cannot discover you. [Resume Profile]"*
- **State 3 (Profile Live)**: *"Your Flatmate Profile is Live in Mumbai. [Manage Profile]"*

### G. Empty & No-Results States (`RehvoEmptyState`)
- When no flatmates match active filters/location:
  - Icon: `Users`
  - Title: *"No flatmates found matching your criteria"*
  - Subtitle: *"Try expanding your budget range or clearing lifestyle filters."*
  - CTA Button: *"Reset Filters"* or *"Explore All Flatmates"*.

---

## 6. Safety, Privacy & Messaging Workflows

1. **Privacy Safeguards**:
   - Phone numbers, personal emails, and KYC documentation are **never exposed** on the profile card or public feed.
   - Users communicate exclusively through REHVO's encrypted in-app chat.
2. **Safety Actions in Profile Details**:
   - *Report Profile*: Modal to flag inappropriate behavior, fake profiles, or spam.
   - *Block User*: Instantly hides conversations and mutual profile visibility.
3. **Canonical Chat Integration**:
   - Tapping *Chat* navigates directly to `app/(renter)/chat/[id].tsx`, passing `flatmate_profile_id` and initial conversation metadata.

---

## 7. Mobile Responsiveness & Performance Plan

- **Viewport Standards**: Tested for 375px (iPhone SE/mini), 390px (iPhone 14/15), and 430px (iPhone Plus/Max).
- **Layout Safety**: Single vertical scroll container, zero horizontal overflow, 120px bottom clearance for floating navigation.
- **Memory & Rendering**:
  - Memoized filtering with `useMemo` based on active search, quick preference chip, and filter criteria.
  - Image lazy-loading via `RehvoImage`.
  - Incremental batch rendering to maintain 60fps scrolling.

---

## 8. Code Replacement & Cleanup Plan

| Target File | Current Role | Action |
| :--- | :--- | :--- |
| [`FlatmateMarketplaceContent.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/flatmates/FlatmateMarketplaceContent.tsx) | Thin wrapper | **REPLACE** with unified social discovery container |
| `FlatmateProfileCard.tsx` | New component | **CREATE** dedicated portrait-first social profile card |
| `FlatmatePreferenceFilterRail.tsx` | New component | **CREATE** quick preference filter rail with count badges |
| `FlatmateFilterSheet.tsx` | New component | **CREATE** dedicated flatmate filter bottom sheet |
| `FlatmateSortSheet.tsx` | New component | **CREATE** dedicated flatmate sort bottom sheet |
| `FlatmateUserStateBanner.tsx` | New component | **CREATE** state-aware user profile banner |
| `FlatmateNearbyRail.tsx` | New component | **CREATE** horizontal nearby flatmates rail |
| `FlatmateDiscoveryFeed.tsx` | 683-line monolithic feed | **REFACTOR / STREAMLINE** into modular components |

---

## 9. Step-by-Step Implementation Sequence (Once Approved)

### STEP 1: Engineer `FlatmateProfileCard.tsx`
- Build the portrait-first social card with photo cover, verified badge, name, age, occupation, locality, budget, lifestyle chips, bio snippet, and action buttons.

### STEP 2: Engineer `FlatmatePreferenceFilterRail.tsx`
- Build the quick preference selector (`All Flatmates`, `Private Room`, `Shared Room`, `Under ₹15k`, `Under ₹25k`, `WFH Friendly`, `Near Metro`) with count badges.

### STEP 3: Engineer `FlatmateFilterSheet.tsx` & `FlatmateSortSheet.tsx`
- Build the filter bottom sheet (Budget, Room type, Gender rule, Move-in, Lifestyle) and sort sheet.

### STEP 4: Engineer `FlatmateUserStateBanner.tsx` & `FlatmateNearbyRail.tsx`
- Build the state-aware profile creation/management banner and nearby flatmates horizontal rail.

### STEP 5: Rebuild `FlatmateMarketplaceContent.tsx`
- Assemble the unified social discovery feed:
  1. Quick preference filter rail
  2. State-aware user profile banner
  3. Control strip with real-time count
  4. Recommended Top Match hero profile card
  5. Nearby Flatmates horizontal rail
  6. Vertically scrollable listing feed rendering `FlatmateProfileCard`
  7. `RehvoEmptyState` for zero matching profiles.

### STEP 6: Connect with Supabase Data & Zustand State
- Query live flatmates from `useAppStore.flatmates` and `fetchPublishedFlatmates`.
- Connect save toggles, chat navigation (`app/(renter)/chat/[id].tsx`), profile creation (`app/(renter)/flatmate/create.tsx`), and profile detail navigation (`app/(renter)/flatmate/[id].tsx`).

### STEP 7: Verification & Testing Gates
1. Run `npx tsc --noEmit` $\rightarrow$ 0 errors.
2. Run Metro Android Export Bundle $\rightarrow$ 0 errors.
3. Architecture Separation Scanner $\rightarrow$ 0 violations.
4. Git Diff Check $\rightarrow$ `web/` and `admin/` 100% frozen.
5. Visually inspect on real Expo app across all flatmate categories.

---

## 10. Strict Boundary Compliance & Freeze Verification

```
BOUNDARY AUDIT:
- web/   ──► 0 modifications (100% frozen)
- admin/ ──► 0 modifications (100% frozen)
- Mobile ──► Strict isolation in app/, src/, assets/
```

---

## 11. Approval Request

This plan establishes a concrete, human-centric, portrait-first architecture for the REHVO Flatmates Marketplace.

**No code has been modified in this step.** Implementation will begin only upon your explicit approval of this plan.
