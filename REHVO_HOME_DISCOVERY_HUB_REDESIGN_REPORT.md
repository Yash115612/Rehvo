# REHVO Mobile App — Home Screen Redesign as Product Discovery Hub Report

**Release Status**: Complete & Verified  
**Date**: August 20, 2026  
**Scope**: Mobile App Home Screen (`RenterHomeScreen.tsx`), Information Architecture, Modular Discovery Sections, Live Supabase Querying, Brand Colors, Capability Routing  

---

## 1. Old Home Screen Audit & Problems

1. **Feed-Only Orientation**: The previous home screen operated essentially as a continuous property listing feed, with limited visual structure to communicate the full breadth of REHVO's ecosystem.
2. **Missing Commercial Prominence**: Commercial spaces were secondary or hidden within filters.
3. **Buried Flatmate Discovery**: Flatmates were treated as a simple filter tab rather than a vibrant social discovery pillar.
4. **Lack of Activity Visibility**: Users had no top-level view of their active saved listings, enquiries, scheduled visits, and unread chats.
5. **No Direct Creation Entry Points**: Users had to navigate to the Profile screen to discover "List Property" or "Create Flatmate Profile".

---

## 2. New Information Architecture (Deliberate Hierarchy)

The new mobile Home screen is architected in a prioritized sequence:

| Priority | Section | Description & Role |
| :--- | :--- | :--- |
| **1. Header & Identity** | **Top App Header** | REHVO Logo + 0% Brokerage badge, Bell icon with live unread badge, User Avatar, Time-aware greeting (*"Good morning/afternoon/evening, [User Name] 👋"*). |
| **2. Primary Entry** | **Search Dock** | High-contrast search bar launching full global search with pre-configured filters. |
| **3. Quick Switch** | **Quick Actions Row** | Horizontal category chips: `Homes`, `Commercial`, `Flatmates`, `PG & Co-Living`, `Private Rooms`, `Studios`. |
| **4. Alerts (Contextual)** | **Notifications Banner** | Subtle alert banner rendered only when `unreadNotificationCount > 0`. |
| **5. Core Pillar Map** | **"Explore REHVO" Grid** | 5 high-impact visual discovery tiles (*Find a Home*, *Commercial Space*, *Find a Flatmate*, *PG & Co-Living*, *Rooms & Studios*). |
| **6. Management** | **Capability Shortcuts** | Contextual cards: Owner Dashboard shortcut with active listing count, Flatmate Profile status (Live 🟢 / Paused 🟠). |
| **7. Residential** | **Places You May Like** | Real published residential listings with cover image, price, BHK, locality, furnishing, and instant save toggle. |
| **8. Commercial** | **Commercial Spaces** | Dedicated commercial properties carousel or Grade-A commercial discovery tile for business spaces. |
| **9. Social Discovery** | **Find Your Flatmate** | Social cards with avatar, name, occupation, budget, preferred area, and lifestyle match tags. |
| **10. Budget Stays** | **PG, Rooms & Studios** | Curated single rooms, PGs with food options, and compact studios. |
| **11. Localities** | **Popular Around Mumbai** | Direct locality cards (Andheri, Bandra, Powai, Goregaon, Thane, Borivali). |
| **12. User State** | **Your Activity** | 2x2 live counts: Saved places, Active Enquiries, Scheduled Visits, Unread Chats. |
| **13. Creation Hub** | **Start Something New** | Prominent action cards for `List Property` (Zero Brokerage) and `Find Roommates` (Create Profile). |

---

## 3. Modular Component Architecture

- [`HomeHeader.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeHeader.tsx): Clean top bar with REHVO brand badge, unread notification counter, avatar button, and time-aware greeting.
- [`HomeQuickActionsRow.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeQuickActionsRow.tsx): Horizontal quick action selector with custom icons and tint containers.
- [`HomeNotificationsCard.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeNotificationsCard.tsx): Conditional notification card triggered by live unread counts.
- [`HomeExploreGrid.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeExploreGrid.tsx): 5 visual category tiles mapping the REHVO product ecosystem.
- [`HomeCapabilitySection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeCapabilitySection.tsx): Dynamic owner management and flatmate profile status shortcuts.
- [`HomeResidentialSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeResidentialSection.tsx): Residential listings carousel with save toggles and specs.
- [`HomeCommercialSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeCommercialSection.tsx): Commercial property showcase with Grade-A discovery card.
- [`HomeFlatmatesSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeFlatmatesSection.tsx): Roommate discovery showcase with social profile cards.
- [`HomePgRoomsSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomePgRoomsSection.tsx): Budget-friendly PGs, rooms, and studios showcase.
- [`HomeActivitySection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeActivitySection.tsx): 2x2 live stats tracking Saved, Enquiries, Visits, and Chats.
- [`HomeCreationSection.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/HomeCreationSection.tsx): "Start Something New" creation entry points.
- [`RenterHomeScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/home/RenterHomeScreen.tsx): Master Discovery Hub screen orchestrating all sections with pull-to-refresh and skeleton states.

---

## 4. Brand Color & Design System Integration

- **Primary Accent**: Vibrant Coral `#FF5533`
- **Soft Tint / Containers**: Warm Peach `#FFF5F0` (Border `#FFD9CC`)
- **Global Canvas**: Warm Linen/Ivory `#FAF8F5`
- **Surfaces**: Pure White `#FFFFFF`
- **Dark Elements**: Charcoal `#171522`
- **Text Hierarchy**: `#171522` (Heading), `#5C5866` (Body), `#8E8A99` (Muted/Sub)
- **Status Semantic Accents**:
  - Success / Flatmates: `#059669` / `#EAF8F0` / `#A7F3D0`
  - PG / Amber: `#D97706` / `#FEF3C7` / `#FDE68A`
  - Rooms / Blue: `#3B82F6` / `#EFF6FF` / `#BAE6FD`

---

## 5. Navigation & Data Integrity

- **100% Real Supabase Data**: All dynamic content is fed from `useAppStore` (`properties`, `flatmates`, `enquiries`, `visits`, `conversations`, `savedPropertyIds`).
- **Zero Mock / Fake Fallbacks**: Empty sections render clean discovery CTAs instead of fabricated listings.
- **Route Validation**:
  - `Homes` $\rightarrow$ `/(renter)/search?property_type=FLAT`
  - `Commercial` $\rightarrow$ `/(renter)/search?category=commercial`
  - `Flatmates` $\rightarrow$ `/(renter)/flatmates`
  - `PG` $\rightarrow$ `/(renter)/pg`
  - `Rooms` $\rightarrow$ `/(renter)/rooms`
  - `Studios` $\rightarrow$ `/(renter)/studios`
  - `Saved` $\rightarrow$ `/(renter)/saved`
  - `Chat / Enquiries` $\rightarrow$ `/(renter)/chat`
  - `Visits` $\rightarrow$ `/(renter)/visit/schedule`
  - `Owner Dashboard` $\rightarrow$ `/(owner)/dashboard`
  - `List Property` $\rightarrow$ `/(renter)/listing/property-type`
  - `Create Flatmate` $\rightarrow$ `/(renter)/flatmate/create`

---

## 6. Verification & Typecheck

- **Mobile TypeScript Check**: `npx tsc --noEmit` $\rightarrow$ **0 errors (Exit code 0)**
- **Web TypeScript Check**: `npm run typecheck` $\rightarrow$ **0 errors (Exit code 0)**
