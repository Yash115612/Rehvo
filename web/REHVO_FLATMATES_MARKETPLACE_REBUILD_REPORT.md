# REHVO Flatmates Marketplace Complete Rebuild Report

**Date:** August 23, 2026  
**Status:** Completed & Verified  
**Runtime:** web/ (Next.js 14 App Router)  
**URL:** http://localhost:3001/flatmates

---

## 1. Runtime Route & Architecture Trace
- **Route:** /flatmates -> src/app/flatmates/page.tsx
- **Container Architecture:** src/components/flatmates/FlatmatesContainer.tsx
- **Global Layout:** src/app/layout.tsx rendering RehvoHeader.tsx with capsule liquid-glass navigation.
- **Dynamic Detail Route:** /flatmates/[slug] -> src/app/flatmates/[slug]/page.tsx
- **Onboarding Route:** /flatmates/create -> src/app/flatmates/create/page.tsx
- **Profile Management Route:** /flatmates/profile -> src/app/flatmates/profile/page.tsx

---

## 2. Real Supported Data Model
- **Schema Columns Used:**
  - id: UUID string
  - user_id: UUID string referencing profiles
  - name: Full string name from profiles or flatmate profile
  - photo: URL string from Supabase Storage flatmate-images bucket
  - age: Integer number
  - gender: male | female | any | other
  - profession: String (e.g. Software Engineer, Product Designer)
  - city: Mumbai
  - locality: Specific neighborhood (e.g. Andheri West, Bandra West, Powai)
  - budget_min: Integer INR amount
  - budget_max: Integer INR amount
  - room_preference: private_room | shared_room | any
  - move_in_date: String (Immediate, Within 15 days, Within 30 days)
  - lifestyle_preferences: Array of strings (WFH, Non-Smoker, Vegetarian, Early Riser, Clean & Organized)
  - bio: Multi-line text bio
  - status: published | paused | draft

---

## 3. Core Principles Followed (No Social Network)
- **Explicitly Excluded:**
  - No Stories
  - No Followers / Following
  - No Likes
  - No Comments
  - No Public Social Feed
  - No Social Posts
  - No Public Activity Counters
  - No Fake Online Status
  - No Fake Compatibility Percentages
  - No Fake Follower Counts
- **Delivered Product:**
  - People-First Roommate Discovery Marketplace
  - High-trust profile cards, verified badges, matching status, locality & budget search, direct chat, and save profile.

---

## 4. Page Structure & Components

1. **Global Header (RehvoHeader.tsx):**
   - Approved liquid-glass capsule design with subtle green accent dot (#3C8D68) for Flatmates active state.
2. **Flatmates Hero (FlatmatesHero.tsx):**
   - Eyebrow: FLATMATE COMMUNITY • 0% BROKERAGE with green accent #3C8D68.
   - Main Heading: Find someone you will actually enjoy living with.
   - Supporting: Discover verified flatmates with compatible budgets, locations and lifestyles across Mumbai.
   - Integrated Liquid-Glass Search Dock with Locality input, Room Preference selector, Max Budget selector, and Coral Search button.
3. **Quick Filter Rail (FlatmatesQuickFilters.tsx):**
   - Horizontal scrolling pills: All Flatmates, Private Room, Shared Room, Under 15k, Under 25k, Move-in Soon, WFH Friendly, Vegetarian, and Filters drawer button.
4. **Advanced Filter Drawer (FlatmatesFilterDrawer.tsx):**
   - Liquid-glass frosted drawer on desktop / bottom sheet on mobile with Room type, Locality, Budget range slider, Move-in timing, and Lifestyle tags.
5. **Recommended Matches (RecommendedMatches.tsx):**
   - Curated co-living matches with portrait cards.
6. **Flatmates Near You (NearbyFlatmates.tsx):**
   - Horizontal swipeable card rail for neighborhood discovery.
7. **People Looking for a Room (RoomSeekersSection.tsx):**
   - Denser 3-column card format specifically showcasing room seekers with move-in dates and budget pills.
8. **Discover Flatmates Grid (FlatmateDiscoveryGrid.tsx):**
   - Main inventory with sorting (Recommended, Newest, Budget Low to High, Budget High to Low, Move-in Soon), empty state, and liquid-glass pagination.
9. **Create Profile CTA (CreateFlatmateCta.tsx):**
   - Conversion banner with Create Flatmate Profile button.
10. **Say Hi & Instant Connect (SayHiModal.tsx):**
    - Lightweight wave micro-interaction pre-filling a greeting into canonical REHVO Chat (/chat).

---

## 5. Build, Typecheck & Verification Results

- **TypeScript Typecheck:** npm run typecheck passed with 0 errors.
- **Production Build:** npm run build passed successfully for all 34 routes.
- **Repository Boundaries:** Verified with git status: 0 modifications outside web/.