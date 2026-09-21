# REHVO V24 — Expo Router Navigation Map & Route Audit

**App Router Architecture:** Expo Router v6.0 + React Navigation v7  
**Total Route Files:** **154**  
**Route Groups:** `(auth)`, `(owner)`, `(broker)`, `(renter)`, and root `app/`

---

## 1. Top-Level Route Groups Overview

```
app/
├── _layout.tsx                 (Root App Stack, Auth Provider, Toast Container, Fonts)
├── index.tsx                   (Splash / App Launch Director)
├── (auth)/                     (Authentication & Onboarding Stack - 10 routes)
├── (owner)/                    (Dedicated Owner Experience - 21 routes)
├── (broker)/                   (Dedicated Broker CRM Experience - 6 routes)
└── (renter)/                   (Renter Marketplace, Flatmates & Legacy Owner - 115 routes)
```

---

## 2. Complete Navigation Hierarchy

### 2.1 Root Group (`app/`)
| Route | File Path | Layout / Type | Role Access | Purpose |
|---|---|---|---|---|
| `/` | `app/index.tsx` | Entry Redirect | Public | Directs to `/splash` or role dashboard |
| `/_layout` | `app/_layout.tsx` | Stack Master | Platform | Font loading, theme provider, global toast |

---

### 2.2 Authentication Stack (`app/(auth)/`)
*Protected by `(auth)/_layout.tsx` with slide animation.*

| Route | File Path | Type | Role Scope | Screen Component |
|---|---|---|---|---|
| `/(auth)/splash` | `app/(auth)/splash.tsx` | Screen | Public | `V4SplashScreen.tsx` |
| `/(auth)/onboarding` | `app/(auth)/onboarding.tsx` | Screen | Public | `V4OnboardingScreen.tsx` |
| `/(auth)/role-selection` | `app/(auth)/role-selection.tsx` | Screen | Public | `V4RoleSelectionScreen.tsx` |
| `/(auth)/login` | `app/(auth)/login.tsx` | Screen | Public | `V4LoginScreen.tsx` |
| `/(auth)/signup` | `app/(auth)/signup.tsx` | Screen | Public | `V4LoginScreen.tsx` (mode=signup) |
| `/(auth)/otp` | `app/(auth)/otp.tsx` | Screen | Public | `V4OtpScreen.tsx` |
| `/(auth)/forgot-password` | `app/(auth)/forgot-password.tsx` | Screen | Public | Password recovery flow |
| `/(auth)/reset-password` | `app/(auth)/reset-password.tsx` | Screen | Public | New password submission |
| `/(auth)/callback` | `app/(auth)/callback.tsx` | Redirect | Public | OAuth callback (Google/Apple) |
| `/(auth)/_layout` | `app/(auth)/_layout.tsx` | Stack | Public | Stack navigator with gestures |

---

### 2.3 Owner Experience Group (`app/(owner)/`)
*Protected by `(owner)/_layout.tsx` with role validation and Owner Floating Bottom Navigation.*

| Route | File Path | Type | Navigation Entry | Screen Component |
|---|---|---|---|---|
| `/(owner)/dashboard` | `app/(owner)/dashboard.tsx` | Tab Screen | Bottom Tab: Home | `V4OwnerDashboardScreen.tsx` |
| `/(owner)/listings` | `app/(owner)/listings.tsx` | Tab Screen | Bottom Tab: Listings | `V4OwnerPropertiesScreen.tsx` |
| `/(owner)/leads` | `app/(owner)/leads.tsx` | Tab Screen | Bottom Tab: Leads | `V4OwnerLeadsScreen.tsx` |
| `/(owner)/inbox` | `app/(owner)/inbox.tsx` | Tab Screen | Bottom Tab: Messages | `V4OwnerChatListScreen.tsx` |
| `/(owner)/profile` | `app/(owner)/profile.tsx` | Tab Screen | Bottom Tab: Profile | `V4OwnerProfileScreen.tsx` |
| `/(owner)/analytics` | `app/(owner)/analytics.tsx` | Stack Screen | Dashboard Quick Action | `V4OwnerAnalyticsScreen.tsx` |
| `/(owner)/business-suite` | `app/(owner)/business-suite.tsx` | Stack Screen | Dashboard Card | `V4OwnerBusinessSuiteScreen.tsx` |
| `/(owner)/subscription` | `app/(owner)/subscription.tsx` | Modal Screen | Plan Upgrade Banner | `V4HostPlansScreen.tsx` |
| `/(owner)/wallet` | `app/(owner)/wallet.tsx` | Stack Screen | Header Wallet Icon | `V4OwnerWalletScreen.tsx` |
| `/(owner)/rent-collection` | `app/(owner)/rent-collection.tsx` | Stack Screen | Finance Tab | `V4OwnerRentScreen.tsx` |
| `/(owner)/rental-estimator` | `app/(owner)/rental-estimator.tsx` | Tool Screen | Calculator Pill | `V4RentalIncomeEstimatorScreen.tsx` |
| `/(owner)/visits` | `app/(owner)/visits.tsx` | Stack Screen | Quick Action | `V4OwnerVisitsScreen.tsx` |
| `/(owner)/notifications` | `app/(owner)/notifications.tsx` | Stack Screen | Header Bell Icon | `V4OwnerNotificationsScreen.tsx` |
| `/(owner)/messages` | `app/(owner)/messages.tsx` | Stack Screen | Alias for Inbox | `V4OwnerChatListScreen.tsx` |
| `/(owner)/chat/[id]` | `app/(owner)/chat/[id].tsx` | Dynamic Route | Chat Item Tap | `V4OwnerChatRoomScreen.tsx` |
| `/(owner)/tour/upload` | `app/(owner)/tour/upload.tsx` | Multi-step Screen | 3D Tour Button | Owner 3D Studio (V23.1) |
| `/(owner)/listing` | `app/(owner)/listing/index.tsx` | Multi-step Screen | "+ Add Listing" FAB | `V4ListPropertyScreen.tsx` |
| `/(owner)/listing/photos` | `app/(owner)/listing/photos.tsx` | Stack Screen | Step 2 of Listing | `V4UploadPropertyScreen.tsx` |
| `/(owner)/listing/preview` | `app/(owner)/listing/preview.tsx` | Modal Screen | Step 3 of Listing | `V4PropertyPreviewScreen.tsx` |
| `/(owner)/listing/_layout` | `app/(owner)/listing/_layout.tsx` | Nested Stack | Sub-flow | Listing Stepper Coordinator |
| `/(owner)/_layout` | `app/(owner)/_layout.tsx` | Tab Navigator | Root Owner Tab | `V4OwnerBottomNavigation.tsx` |

---

### 2.4 Broker Experience Group (`app/(broker)/`) — [BROKER ONLY]
*Protected by `(broker)/_layout.tsx`. Guest fallback mode displays broker landing page.*

| Route | File Path | Type | Navigation Entry | Screen Component |
|---|---|---|---|---|
| `/(broker)/dashboard` | `app/(broker)/dashboard.tsx` | Tab Screen | Bottom Tab: Home | `V4BrokerDashboardScreen.tsx` |
| `/(broker)/inventory` | `app/(broker)/inventory.tsx` | Tab Screen | Bottom Tab: Inventory | `V4BrokerInventoryScreen.tsx` |
| `/(broker)/clients` | `app/(broker)/clients.tsx` | Tab Screen | Bottom Tab: CRM | `V4BrokerClientsScreen.tsx` |
| `/(broker)/messages` | `app/(broker)/messages.tsx` | Tab Screen | Bottom Tab: Chat | `V4BrokerMessagesScreen.tsx` |
| `/(broker)/profile` | `app/(broker)/profile.tsx` | Tab Screen | Bottom Tab: Agency | `V4BrokerProfileScreen.tsx` |
| `/(broker)/_layout` | `app/(broker)/_layout.tsx` | Tab Navigator | Master Broker Tabs | `V4BrokerBottomNavigation.tsx` |

---

### 2.5 Renter Marketplace & Experience (`app/(renter)/`)
*115 routes powering property search, AI recommendations, visits, flatmates, and utilities.*

#### Category 1: Discovery & Property Exploration
- `/(renter)/home`: Primary Renter Feed (`V4HomeScreen.tsx`)
- `/(renter)/search` & `/(renter)/explore`: Multi-parameter property search (`V4ExploreScreen.tsx`)
- `/(renter)/map`: Interactive Map Search with clusters (`V4MapScreen.tsx`)
- `/(renter)/ai`: AI Conversational Search Assistant (`V4AIChatScreen.tsx`)
- `/(renter)/property/[id]`: Full Property Details View (`V4PropertyDetailsScreen.tsx`)
- `/(renter)/property/[id]/gallery`: High-resolution Photo Grid (`V4GalleryScreen.tsx`)
- `/(renter)/tour/[id]`: Interactive 3D Virtual Tour Viewer (`TourViewer.tsx`)
- `/(renter)/saved`: Bookmarked Homes (`V4SavedScreen.tsx`)
- `/(renter)/compare`: Side-by-side Property Comparison (`V4PropertyCompareScreen.tsx`)
- `/(renter)/neighborhood/[locality]`: AI Neighborhood Radar (`V4NeighborhoodScreen.tsx`)

#### Category 2: Specialized Property Verticals
- `/(renter)/flats`: Apartment Rentals (`V4FlatsScreen.tsx`)
- `/(renter)/apartments`: High-rise residences (`V4FlatsScreen.tsx`)
- `/(renter)/studios`: Studio apartments (`V4CommercialScreen.tsx`)
- `/(renter)/pg`: Paying Guest accommodations (`V4PGScreen.tsx`)
- `/(renter)/hostel`: Student hostels (`V4PGScreen.tsx`)
- `/(renter)/commercial`: Office & Retail spaces (`V4CommercialScreen.tsx`)
- `/(renter)/office`: Commercial offices (`V4CommercialScreen.tsx`)
- `/(renter)/plots`: Commercial & warehouse land (`V4CommercialScreen.tsx`)

#### Category 3: Flatmate Ecosystem (14 routes)
- `/(renter)/flatmates`: Flatmate Landing Hub (`V4FlatmatesHomeScreen.tsx`)
- `/(renter)/flatmate/discover`: AI Discovery Feed (`V4DiscoverFlatmatesScreen.tsx`)
- `/(renter)/flatmate/explore`: Filtered Grid View
- `/(renter)/flatmate/matches`: Mutual Matches (`V4FlatmateMatchesScreen.tsx`)
- `/(renter)/flatmate/waves`: Wave invitations (`WavesInboxScreen.tsx`)
- `/(renter)/flatmate/saved`: Bookmarked Flatmates
- `/(renter)/flatmate/[id]`: Flatmate Profile View (`V4FlatmateProfileDetailsScreen.tsx`)
- `/(renter)/flatmate/compatibility/[id]`: Breakdown (`V4CompatibilityInsightsScreen.tsx`)
- `/(renter)/flatmate/create`: Intake wizard (`V4CreateFlatmateProfileScreen.tsx`)
- `/(renter)/flatmate/edit`: Profile editor (`V4EditFlatmateProfileScreen.tsx`)
- `/(renter)/flatmate/my-profile`: Host Card (`V4MyFlatmateProfileScreen.tsx`)
- `/(renter)/flatmate/chat/index`: Flatmate Chat List
- `/(renter)/flatmate/chat/[id]`: Direct Messaging Room
- `/(renter)/flatmate/verification`: Flatmate KYC & Trust badge

#### Category 4: Transactions, Leases & Utilities
- `/(renter)/pay-rent`: Monthly UPI/Card Rent Payment (`V4PayRentScreen.tsx`)
- `/(renter)/zero-deposit`: Zero Deposit Pass (`V4ZeroDepositScreen.tsx`)
- `/(renter)/rental-agreements`: Digital E-Leases (`V4RentalAgreementsScreen.tsx`)
- `/(renter)/document-vault`: Personal File Locker (`V4DocumentVaultScreen.tsx`)
- `/(renter)/document-scanner`: OCR Camera Scanner (`V4DocumentScannerScreen.tsx`)
- `/(renter)/document-center`: Tax & HRA Center (`V4DocumentCenterScreen.tsx`)
- `/(renter)/wallet`: REHVO Cash & Balance (`V4WalletScreen.tsx`)
- `/(renter)/transactions`: Ledger history (`V4TransactionsScreen.tsx`)
- `/(renter)/rewards`: Gamification scratch cards (`V4RewardsScreen.tsx`)
- `/(renter)/reward-history`: Rewards ledger (`V4RewardHistoryScreen.tsx`)
- `/(renter)/rcash`: Cashback redemption (`V4RCashScreen.tsx`)
- `/(renter)/share-earn`: Referral program (`V4ShareEarnScreen.tsx`)
- `/(renter)/society-pass`: Digital Gate Pass (`V4SocietyPassScreen.tsx`)
- `/(renter)/utilities/index`: All utility services (`V4UtilitiesScreen.tsx`)
- `/(renter)/utilities/electricity`: Power bill payment
- `/(renter)/utilities/water`: Water bill payment
- `/(renter)/utilities/gas`: Piped gas payment
- `/(renter)/utilities/wifi`: Home fiber setup
- `/(renter)/utilities/broadband`: ISP provider comparison
- `/(renter)/utilities/dth`: Cable & DTH recharge
- `/(renter)/utilities/mobile`: Postpaid mobile recharge

#### Category 5: Legacy Duplicate Owner Screens inside `(renter)`
*Notice: These 11 routes duplicate functionality now residing in `(owner)/`.*
1. `/(renter)/owner-dashboard` -> Superseded by `/(owner)/dashboard`
2. `/(renter)/owner-properties` -> Superseded by `/(owner)/listings`
3. `/(renter)/owner-leads` -> Superseded by `/(owner)/leads`
4. `/(renter)/owner-analytics` -> Superseded by `/(owner)/analytics`
5. `/(renter)/owner-rent` -> Superseded by `/(owner)/rent-collection`
6. `/(renter)/owner-plans` -> Superseded by `/(owner)/subscription`
7. `/(renter)/owner-visits` -> Superseded by `/(owner)/visits`
8. `/(renter)/owner-notifications` -> Superseded by `/(owner)/notifications`
9. `/(renter)/owner-documents` -> Superseded by `/(owner)/dashboard` (Docs tab)
10. `/(renter)/manage-properties` -> Superseded by `/(owner)/listings`
11. `/(renter)/owner-performance` -> Superseded by `/(owner)/analytics`

---

## 3. Deep Linking Schemes

*Configured in `app.json` under `scheme: "rehvo"` and `expo-linking`.*

- `rehvo://property/:id` -> Opens Property Details
- `rehvo://tour/:id` -> Opens Interactive 3D Tour
- `rehvo://flatmate/:id` -> Opens Flatmate Profile
- `rehvo://visit/:id` -> Opens Scheduled Visit Pass
- `rehvo://agreement/:id` -> Opens E-Lease Review
- `rehvo://pay-rent?id=:id` -> Opens Rent Payment Checkout
- `rehvo://owner/dashboard` -> Switches mode to Owner and opens Owner Home
- `rehvo://broker/dashboard` -> Opens Broker Portal (Disabled in V1)
