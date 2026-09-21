# REHVO V24.5 — Expo Router Complete Navigation Tree

**Framework:** Expo Router v6.0 (File-system based navigation built on React Navigation v7)  
**Total Route Files:** **154**  
**Role Segmentation:** Owner (21 routes), Broker (6 routes), Renter (115 routes), Auth (10 routes), Root (2 routes)

---

## 1. Visual Route Tree Hierarchy

```
app/
├── _layout.tsx                             [Platform Master Stack - Shared]
├── index.tsx                               [Initial Splash Director - Shared]
│
├── (auth)/                                 [Stack Group: Authentication - Shared]
│   ├── _layout.tsx                         # Gestures & Stack Options
│   ├── splash.tsx                          # App Launch & Brand Intro
│   ├── onboarding.tsx                      # 3-Slide Value Proposition
│   ├── role-selection.tsx                  # Choose: Renter / Owner / [Broker-Gated]
│   ├── login.tsx                           # Phone / Email / OAuth Login
│   ├── signup.tsx                          # Register New Account
│   ├── otp.tsx                             # 6-Digit SMS PIN Verification
│   ├── forgot-password.tsx                 # Account Recovery Initiation
│   ├── reset-password.tsx                  # Password Change Form
│   └── callback.tsx                        # OAuth Deep Link Receiver
│
├── (owner)/                                [Tab & Stack Group: Landlord - OWNER ONLY]
│   ├── _layout.tsx                         # Owner Bottom Navigation Tabs + Top Header
│   ├── dashboard.tsx                       # [TAB 1] Landlord Overview & Quick Actions
│   ├── listings.tsx                        # [TAB 2] Managed Property Portfolio
│   ├── leads.tsx                           # [TAB 3] High-Intent Tenant Inquiries
│   ├── inbox.tsx                           # [TAB 4] Direct Tenant Chat Channels
│   ├── profile.tsx                         # [TAB 5] Landlord Profile & KYC Status
│   ├── analytics.tsx                       # [STACK] Portfolio Yield & Impression Trends
│   ├── business-suite.tsx                  # [STACK] Tier Comparison & Enterprise Tools
│   ├── subscription.tsx                    # [MODAL] Plan Upgrade Checkout
│   ├── wallet.tsx                          # [STACK] Rental Income & Penny-Drop Payouts
│   ├── rent-collection.tsx                 # [STACK] Monthly Rent Invoicing & AutoPay
│   ├── rental-estimator.tsx                # [STACK] Locality Yield & Valuation Engine
│   ├── visits.tsx                          # [STACK] Property Viewing Schedules & Slots
│   ├── notifications.tsx                   # [STACK] Dedicated Landlord Event Alerts
│   ├── messages.tsx                        # [STACK] Alias to Inbox
│   ├── chat/
│   │   └── [id].tsx                        # [DYNAMIC] Direct 1-on-1 Tenant Messaging Room
│   ├── tour/
│   │   └── upload.tsx                      # [MULTI-STEP] REHVO AI Tour™ 3D Studio (V23.1)
│   └── listing/                            # [SUB-STACK] Property Upload Wizard
│       ├── _layout.tsx                     # Listing Stepper Coordinator
│       ├── index.tsx                       # Step 1: Specs, Pricing, Amenities
│       ├── photos.tsx                      # Step 2: Gallery Upload & Room Tagging
│       └── preview.tsx                     # Step 3: Verified Listing Preview Card
│
├── (broker)/                               [Tab Group: Real Estate Agency - BROKER ONLY]
│   ├── _layout.tsx                         # [GATED] Broker Tabs & Unauth Guest Landing
│   ├── dashboard.tsx                       # [GATED] Agency Deal Pipeline & Commission
│   ├── inventory.tsx                       # [GATED] Exclusive Listings & Co-broke Split
│   ├── clients.tsx                         # [GATED] Client CRM Kanban Pipeline
│   ├── messages.tsx                        # [GATED] Client Lead Inquiries & Chats
│   └── profile.tsx                         # [GATED] MahaRERA Credentials & Agency Team
│
└── (renter)/                               [Tab & Stack Group: Tenant & Marketplace]
    ├── _layout.tsx                         # Floating Renter Navigation Bar
    ├── home.tsx                            # [TAB 1] Curated Home Feed & Hero Spotlight
    ├── search.tsx                          # [TAB 2] Multi-Filter Discovery Feed
    ├── explore.tsx                         # Search Alias & Discovery
    ├── saved.tsx                           # [TAB 3] Bookmarked Homes & Flatmates
    ├── chat/                               # [TAB 4] Renter Messaging Center
    │   ├── index.tsx                       # Active Conversations
    │   └── [id].tsx                        # [DYNAMIC] Chat Room with Landlord
    ├── profile.tsx                         # [TAB 5] Tenant Profile, DigiLocker & Dues
    ├── map.tsx                             # [FULLSCREEN] Geolocation Map Search
    ├── ai.tsx                              # [FULLSCREEN] Conversational AI Concierge
    ├── property/
    │   ├── [id].tsx                        # [DYNAMIC] Verified Property Details
    │   └── [id]/gallery.tsx                # [MODAL] Full-Screen Photo Gallery
    ├── tour/
    │   └── [id].tsx                        # [DYNAMIC] Interactive 3D Virtual Tour
    ├── booking/
    │   ├── [id].tsx                        # [DYNAMIC] Visit Scheduling Checkout
    │   └── tour.tsx                        # 3D Tour Direct Link
    ├── compare.tsx                         # Side-by-side Feature Matrix
    ├── neighborhood/
    │   └── [locality].tsx                  # [DYNAMIC] AI Locality Radar & Commute
    ├── flatmates.tsx                       # Flatmates Portal Entry
    ├── flatmate/                           # Flatmate Ecosystem Sub-routes (14 routes)
    │   ├── discover.tsx                    # Swipe & Discovery Feed
    │   ├── explore.tsx                     # Grid Search
    │   ├── matches.tsx                     # Mutual Compatibility Matches
    │   ├── waves.tsx                       # Inbound & Outbound Wave Invites
    │   ├── saved.tsx                       # Saved Flatmate Profiles
    │   ├── [id].tsx                        # [DYNAMIC] Flatmate Detailed Profile
    │   ├── compatibility/[id].tsx          # [DYNAMIC] Breakdown Insights
    │   ├── create.tsx                      # Profile Creation Wizard
    │   ├── edit.tsx                        # Profile Editor
    │   ├── my-profile.tsx                  # Host Preview Card
    │   ├── verification.tsx                # Flatmate Trust & KYC Badges
    │   └── chat/                           # Flatmate Direct Messaging
    ├── pay-rent.tsx                        # Monthly UPI/Card Rent Payment
    ├── zero-deposit.tsx                    # Zero-Deposit Insurance Pass
    ├── rental-agreements.tsx               # Digital E-Lease Agreements
    ├── document-vault.tsx                  # Personal Document Storage
    ├── document-scanner.tsx                # OCR Document Scanner
    ├── document-center.tsx                 # HRA Receipts & Tax Center
    ├── wallet.tsx                          # REHVO Cash Wallet & Points
    ├── transactions.tsx                    # Ledger History
    ├── rewards.tsx                         # Gamification Scratch Cards
    ├── reward-history.tsx                  # Rewards Ledger
    ├── rcash.tsx                           # Cashback Redemption
    ├── share-earn.tsx                      # Referral Program
    ├── society-pass.tsx                    # QR Gate Entry Passes
    ├── society/                            # Society Resident Hub (8 routes)
    ├── utilities/                          # Utility Payments & Booking (8 routes)
    ├── services/                           # Concierge & Home Services (3 routes)
    ├── kyc.tsx                             # Aadhaar & DigiLocker Verification
    ├── settings.tsx                        # User Preferences & Security
    ├── terms.tsx & privacy.tsx             # Legal Policies
    │
    └── [LEGACY OWNER DUPLICATES IN RENTER] # 11 Routes Superseded by (owner)/*
        ├── owner-dashboard.tsx             # Duplicate of (owner)/dashboard
        ├── owner-properties.tsx            # Duplicate of (owner)/listings
        ├── owner-leads.tsx                 # Duplicate of (owner)/leads
        ├── owner-analytics.tsx             # Duplicate of (owner)/analytics
        ├── owner-rent.tsx                  # Duplicate of (owner)/rent-collection
        ├── owner-plans.tsx                 # Duplicate of (owner)/subscription
        ├── owner-visits.tsx                # Duplicate of (owner)/visits
        ├── owner-notifications.tsx         # Duplicate of (owner)/notifications
        ├── owner-documents.tsx             # Duplicate of (owner)/dashboard (Docs)
        ├── manage-properties.tsx           # Duplicate of (owner)/listings
        └── owner-performance.tsx           # Duplicate of (owner)/analytics
```

---

## 2. Route Classification Summary

| Group | Total Routes | Owner Access | Broker Access | Renter Access | Public / Shared |
|---|---|---|---|---|---|
| **`Root`** | 2 | Yes | Yes | Yes | **YES** |
| **`(auth)`** | 10 | Yes | Yes | Yes | **YES** |
| **`(owner)`** | 21 | **YES** | No | No | No |
| **`(broker)`** | 6 | No | **YES (Gated)** | No | No |
| **`(renter)`** | 115 | Subsumed | No | **YES** | Yes |
| **TOTAL** | **154** | **33** | **6** | **115** | **12** |

---

## 3. Duplicate Route Action Plan for Clean Launch

In `app/_layout.tsx`, redirect legacy duplicate paths:
- `/(renter)/owner-dashboard` ➔ `/(owner)/dashboard`
- `/(renter)/owner-properties` ➔ `/(owner)/listings`
- `/(renter)/owner-leads` ➔ `/(owner)/leads`
- `/(renter)/owner-analytics` ➔ `/(owner)/analytics`
- `/(renter)/owner-rent` ➔ `/(owner)/rent-collection`
- `/(renter)/owner-plans` ➔ `/(owner)/subscription`
- `/(renter)/owner-visits` ➔ `/(owner)/visits`
