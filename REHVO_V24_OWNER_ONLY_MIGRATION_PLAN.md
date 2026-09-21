# REHVO V24 — Owner-Only Mobile App Launch Migration Plan

**Strategy:** Zero-Risk Staged Scoping (Strict Non-Destructive Plan)  
**Launch Target:** Version 1 (V1) Owner-Centric Mobile App Experience  
**Core Rule:** Do NOT delete code or tables. Flag, gate, and convert.

---

## 1. Executive Summary

To deliver a laser-focused, high-converting launch for REHVO V1, the application must highlight **direct property owners, landlords, and tenants** with transparent 0-brokerage leasing.

By isolating the **Broker Ecosystem** without deleting files, the engineering team maintains full backwards compatibility, zero database downtime, and a clean path to introduce the **REHVO Pro Broker Network in Version 2 (V2)**.

---

## 2. Categorization Framework

```
               ┌──────────────────────────────────────────────┐
               │         REHVO CODEBASE & FEATURES            │
               └──────────────────────┬───────────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
         ▼                            ▼                            ▼
  ┌─────────────┐              ┌─────────────┐              ┌─────────────┐
  │    KEEP     │              │   CONVERT   │              │ REMOVE LATER│
  │ (Launch V1) │              │(Re-label/UX)│              │ (Ship in V2)│
  └─────────────┘              └─────────────┘              └─────────────┘
  • Direct Owner Studio        • Lead Pipeline Kanban       • Broker Tab Group
  • AI 3D Virtual Tour         • RERA / Title Badge         • Agency Registration
  • E-Leases & UPI Pay         • Bulk Inventory Portfolio   • Broker Commission
  • Renter Marketplace         • Dedicated Support Desk     • External Broker CRM
```

---

## 3. Detailed Classification Lists

### 3.1 KEEP (Launch Ready for V1)
*Everything required to deliver a world-class owner and tenant experience.*

#### Owner Experience
1. **Owner Dashboard**: (`app/(owner)/dashboard.tsx`, `src/components/v4/screens/V4OwnerDashboardScreen.tsx`)
2. **AI 3D Property Tour Studio**: (`app/(owner)/tour/upload.tsx`, `src/components/tour/*`)
   - 8-Card AI Recording Guide Modal with pre-recording readiness checklist
   - Camera & Gallery 1080p Video Upload Engine
   - Local AI Computer Vision Quality Scanner (Stability, Lighting, Sharpness, Room Coverage)
   - Hardware-Accelerated 5 Mbps Video Compression Pipeline
   - Supabase `tour-videos` Storage Upload with live speed (MB/s) and ETA
   - 12-Step AI 3D Reconstruction Pipeline with progress ring and timer
   - Interactive 3D Viewer with room teleportation, measuring tape, and sunlight simulator
3. **Property Listing Stepper**: (`app/(owner)/listing/*`, `V4ListPropertyScreen.tsx`, `V4UploadPropertyScreen.tsx`, `V4PropertyPreviewScreen.tsx`)
4. **Owner Leads Management**: (`app/(owner)/leads.tsx`, `V4OwnerLeadsScreen.tsx`, `V4OwnerLeadCard.tsx`)
5. **Direct Owner-Tenant Chat**: (`app/(owner)/chat/[id].tsx`, `V4OwnerChatRoomScreen.tsx`, `V4OwnerQuickReplies.tsx`)
6. **Rent Collection & UPI AutoPay**: (`app/(owner)/rent-collection.tsx`, `V4OwnerRentScreen.tsx`)
7. **Owner Business Suite & Plans**: (`app/(owner)/business-suite.tsx`, `V4OwnerBusinessSuiteScreen.tsx`, `V4HostPlansScreen.tsx`)
8. **Owner Rental Yield Estimator**: (`app/(owner)/rental-estimator.tsx`, `V4RentalIncomeEstimatorScreen.tsx`)
9. **Visit Management**: (`app/(owner)/visits.tsx`, `V4OwnerVisitsScreen.tsx`, `visit_slots` table)
10. **Digital E-Leases & Stamped Agreements**: (`src/services/agreements.ts`, `rental_agreements` table)
11. **Owner Payout Wallet**: (`app/(owner)/wallet.tsx`, `owner_payout_wallets` table)
12. **Owner KYC & Title Deed Verification**: (`src/services/kyc.ts`, `verification-documents` bucket)

#### Renter Marketplace & Experience
1. **Search & Explore**: (`app/(renter)/home.tsx`, `app/(renter)/search.tsx`, `V4ExploreScreen.tsx`)
2. **Property Details & Gallery**: (`app/(renter)/property/[id].tsx`, `V4PropertyDetailsScreen.tsx`)
3. **Interactive 3D Tour Viewer**: (`app/(renter)/tour/[id].tsx`, `TourViewer.tsx`)
4. **Visit Booking**: (`app/(renter)/booking/[id].tsx`, `V4BookingsScreen.tsx`)
5. **Flatmate Ecosystem**: (`app/(renter)/flatmates.tsx`, `V4FlatmatesHomeScreen.tsx`, all 14 flatmate screens)
6. **Direct Rent Payment**: (`app/(renter)/pay-rent.tsx`, `V4PayRentScreen.tsx`)
7. **Digital Gate Pass**: (`app/(renter)/society-pass.tsx`, `V4SocietyPassScreen.tsx`)
8. **Wallet & Cashback**: (`app/(renter)/wallet.tsx`, `V4WalletScreen.tsx`)

---

### 3.2 CONVERT (Repurpose for High-Yield Property Owners)
*Features originally built for brokers that enhance the experience of multi-property landlords, NRIs, and property management companies.*

| Original Broker Feature | Target Owner Feature | Rationale | Conversion Action |
|---|---|---|---|
| **Broker Client Pipeline CRM** (`V4BrokerClientsScreen.tsx`) | **High-Intent Tenant Screening Pipeline** | Owners with 3+ flats need a Kanban pipeline (Applied ➔ Viewing ➔ Agreement ➔ Moved In). | Rename stage badges from "Deal" to "Tenancy Status". |
| **Broker RERA Verification** (`rera_number`, `is_rera_verified`) | **Verified Landlord / Ownership Title Badge** | Owners can submit ownership deed or society maintenance bill to receive "Title Verified" badge. | Relabel input field in Profile from "RERA ID" to "Ownership Proof / RERA". |
| **Broker Inventory Broadsheet** (`V4BrokerInventoryScreen.tsx`) | **Owner Multi-Unit Portfolio Manager** | Allows commercial building owners and multi-flat owners to see all vacancies in one grid. | Already compatible with `properties` table where `owner_id = user.id`. |
| **Broker Performance Analytics** (`commission_earned`, `pipeline_value`) | **Gross Rental Yield & Portfolio Valuation** | Landlords track monthly rental cashflow rather than commissions. | Change formula from commission to `total_monthly_rent_collected`. |

---

### 3.3 REMOVE LATER / GATE FOR V2 (Broker-Only Features)
*Features to hide or conditionally disable during V1 launch without deleting any code.*

#### Navigation & Routing
1. **`app/(broker)/` Route Group**:
   - `app/(broker)/_layout.tsx`
   - `app/(broker)/dashboard.tsx`
   - `app/(broker)/inventory.tsx`
   - `app/(broker)/clients.tsx`
   - `app/(broker)/messages.tsx`
   - `app/(broker)/profile.tsx`
   *Action for V1:* In `app/_layout.tsx` and auth redirects, route all signups to either `(owner)` or `(renter)`. Keep `(broker)` in codebase behind `EXPO_PUBLIC_ENABLE_BROKER_PORTAL=false`.

2. **Role Selection Screen (`app/(auth)/role-selection.tsx`)**:
   - Currently presents 3 cards: Renter, Owner, Broker.
   *Action for V1:* Display only **Renter** and **Owner** options. (Add "Broker Partner? Register for V2 Waitlist" discrete footer link).

#### Components to Gate
1. `src/components/v4/navigation/V4BrokerTopHeader.tsx`
2. `src/components/v4/navigation/V4BrokerBottomNavigation.tsx`
3. `src/components/v4/screens/V4BrokerDashboardScreen.tsx`
4. `src/components/v4/screens/V4BrokerInventoryScreen.tsx`
5. `src/components/v4/screens/V4BrokerClientsScreen.tsx`
6. `src/components/v4/screens/V4BrokerMessagesScreen.tsx`
7. `src/components/v4/screens/V4BrokerProfileScreen.tsx`

#### Store & Services
1. `src/services/broker.ts` -> Keep intact; disable periodic polling in `src/store/useAppStore.ts` if `activeMode !== 'broker'`.
2. `useAppStore.ts`: Default `activeMode` fallback should strictly resolve to `'owner'` or `'renter'`.

---

## 4. Launch Day Execution Checklist (Zero-Risk)

- [x] **No Code Deletion**: Verified that no broker files are deleted or destroyed.
- [ ] **Role Selection Screen**: Filter `ROLE_OPTIONS` array in `V4RoleSelectionScreen.tsx` to omit the broker card during launch.
- [ ] **Auth Default Mode**: Set initial `activeMode` default to `'owner'` for landlords.
- [ ] **Deep Links**: Update `app.json` scheme routing so `rehvo://broker/*` redirects gracefully to `rehvo://owner/dashboard`.
- [ ] **Database Integrity**: Keep table `broker_profiles` and column `profiles.account_type` in place.
