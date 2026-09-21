# REHVO V24 — Database Schema & Architecture Audit

**Status:** Completed  
**Scope:** Supabase PostgreSQL 15, Migrations 001–042, `schema.sql`, RLS Policies, Triggers, Storage Buckets  
**Objective:** Comprehensive database audit for Owner-Only Mobile App Launch (V1)

---

## 1. Executive Database Summary

| Metric | Count | Details |
|---|---|---|
| **Total Tables** | **172** | Core schema, listings, CRM, KYC, fintech, 3D tour, AI embeddings |
| **Broker-Specific Tables** | **1** (`broker_profiles`) | Stored in migration `021_multi_role_auth_broker_ecosystem.sql` |
| **Owner-Centric Tables** | **28** | Portfolios, payouts, leases, visit checkins, tenant leads, bank accounts |
| **Renter-Centric Tables** | **46** | Visits, flatmates, rewards, utilities, society passes, search history |
| **Shared / Platform Tables** | **97** | Profiles, properties, chat, notifications, audit logs, AI, storage |
| **Storage Buckets** | **19** | 12 Public, 7 Private (Encrypted/RLS protected) |
| **Row Level Security (RLS)** | **100% Enabled** | All tables have `ENABLE ROW LEVEL SECURITY` |
| **PostgreSQL Check Enums** | **60+ Categories** | Roles (`renter`, `owner`, `broker`), stages, listing categories |

---

## 2. Table-by-Table Schema Inventory

### 2.1 Core Identity & Profiles

| Table Name | Purpose | Est. Rows | Owner | Broker | Renter | Admin | Foreign Keys | RLS Policy | Triggers | Storage Ref |
|---|---|---|---|---|---|---|---|---|---|---|
| `profiles` | Master user identity, phone, role, verified badge | 100k+ | Yes | Yes | Yes | Yes | `auth.users(id)` | User self-manage, public read | `handle_new_user` | `profile-images` |
| `broker_profiles` | Agency name, RERA, office address, experience, rating | 5k | No | **YES** | Read | Yes | `profiles(id)` | Public read, broker write | `update_timestamp` | `profile-images` |
| `owner_profiles` | Landlord portfolio metadata, tax ID, business suite tier | 25k | **YES** | No | Read | Yes | `profiles(id)` | Public read, owner write | `update_timestamp` | `verification-documents` |
| `user_sessions` | Active device sessions, IP, user-agent, last active | 250k | Yes | Yes | Yes | Yes | `profiles(id)` | User self-read/delete | Auto-expire | None |
| `user_devices` | Push notification device tokens, OS, app version | 150k | Yes | Yes | Yes | Yes | `profiles(id)` | User self-insert | None | None |
| `user_security_settings` | Biometric lock, 2FA, session timeout | 100k | Yes | Yes | Yes | Yes | `profiles(id)` | User self-update | `update_timestamp` | None |
| `user_blocks` | Trust & safety blocklist between users | 5k | Yes | Yes | Yes | Yes | `profiles(id)` | User self-manage | None | None |

### 2.2 Property Listings & Marketplace

| Table Name | Purpose | Est. Rows | Owner | Broker | Renter | Admin | Foreign Keys | RLS Policy | Triggers | Storage Ref |
|---|---|---|---|---|---|---|---|---|---|---|
| `properties` | Master rental listings (flats, villas, commercial) | 50k | **YES** | Optional | Read | Yes | `profiles(id)` | Owner write, public read | `update_listing_stats` | `property-images` |
| `property_images` | Verified photos, cover images, sort order | 300k | **YES** | Optional | Read | Yes | `properties(id)` | Owner write, public read | None | `property-images` |
| `property_documents` | Title deeds, electricity bills, society NOCs | 60k | **YES** | No | No | Yes | `properties(id)` | Owner & Admin only | None | `verification-documents` |
| `property_views` | Unique daily view counts & impression tracking | 1M+ | Read | Read | Insert | Yes | `properties(id)` | Public insert, owner read | `agg_views_trigger` | None |
| `saved_properties` | User bookmarks & favorites collection | 100k | No | No | **YES** | Read | `profiles(id)`, `properties(id)` | User self-manage | None | None |
| `recent_searches` | Geo-queries, locality filters, price range cache | 500k | No | No | **YES** | Read | `profiles(id)` | User self-manage | Auto-clean | None |
| `property_compare_sessions`| Side-by-side AI feature comparisons | 50k | No | No | **YES** | Read | `profiles(id)` | User self-manage | None | None |

### 2.3 REHVO AI Tour™ (3D Virtual Engine)

| Table Name | Purpose | Est. Rows | Owner | Broker | Renter | Admin | Foreign Keys | RLS Policy | Triggers | Storage Ref |
|---|---|---|---|---|---|---|---|---|---|---|
| `property_3d_tours` | Interactive 3D tours, panoramas, room mesh | 20k | **YES** | Optional | Read | Yes | `properties(id)` | Owner write, public read | `sync_tour_to_listing`| `tour-meshes`, `tour-textures` |
| `tour_processing_jobs` | 12-step photogrammetry pipeline queue | 25k | **YES** | Optional | Read | Yes | `properties(id)` | Owner read/write | Status updater | `tour-videos` |
| `tour_measurements` | User AR dimension lines (length, width, sqft) | 100k | **YES** | Optional | **YES** | Yes | `properties(id)` | User self-manage | None | None |
| `tour_events` | 3D analytics: teleportations, watch time, VR | 250k | Read | Read | Insert | Yes | `properties(id)` | Append-only telemetry | None | None |

### 2.4 Owner CRM, Leads & Business Suite

| Table Name | Purpose | Est. Rows | Owner | Broker | Renter | Admin | Foreign Keys | RLS Policy | Triggers | Storage Ref |
|---|---|---|---|---|---|---|---|---|---|---|
| `tenant_leads` | Inbound tenant inquiries, high-intent lead cards | 150k | **YES** | No | Create | Yes | `properties(id)`, `profiles(id)`| Owner view & stage update | Lead alert trigger | None |
| `owner_property_analytics` | Monthly impressions, inquiries, vacancy rate | 50k | **YES** | No | No | Yes | `properties(id)` | Owner read-only | Nightly rollup | None |
| `owner_subscription_plans` | Business suite tier (`STARTER`, `PRO`, `ENTERPRISE`)| 10k | **YES** | No | No | Yes | `profiles(id)` | Owner read, system update| None | None |
| `owner_payout_wallets` | Rental yield wallet, pending settlements | 25k | **YES** | No | No | Yes | `profiles(id)` | Owner read-only | None | None |
| `owner_bank_accounts` | Verified bank account via Penny Drop for rent | 25k | **YES** | No | No | Yes | `profiles(id)` | Owner private write | Bank verification | None |
| `owner_payout_transactions`| Direct NEFT/IMPS payout transfer receipts | 100k | **YES** | No | No | Yes | `owner_payout_wallets(id)` | Owner private read | None | `receipts` |
| `owner_notifications` | Dedicated landlord alerts (rent, visits, leads) | 300k | **YES** | No | No | Yes | `profiles(id)` | Owner private read/update| None | None |
| `visit_checkins` | Physical GPS visit check-ins with geofence | 50k | **YES** | Optional | **YES** | Yes | `visits(id)` | Owner & Renter read/write| None | None |

### 2.5 Visits, Applications & Booking Engine

| Table Name | Purpose | Est. Rows | Owner | Broker | Renter | Admin | Foreign Keys | RLS Policy | Triggers | Storage Ref |
|---|---|---|---|---|---|---|---|---|---|---|
| `visits` | Scheduled physical visits with time slots | 200k | **YES** | Optional | **YES** | Yes | `properties(id)`, `profiles(id)`| Participant read/write | Push reminder | None |
| `visit_slots` | Owner recurring visit availability calendar | 50k | **YES** | No | Read | Yes | `properties(id)` | Owner write, public read | None | None |
| `visit_bookings` | Confirmed viewing appointments | 150k | **YES** | Optional | **YES** | Yes | `visit_slots(id)` | Participant read/write | Calendar sync | None |
| `zero_deposit_passes` | Institutional zero-deposit insurance certificates | 20k | **YES** | No | **YES** | Yes | `profiles(id)` | Tenant & Landlord read | Underwriting check | `verification-documents` |

### 2.6 KYC, Identity & Legal Agreements

| Table Name | Purpose | Est. Rows | Owner | Broker | Renter | Admin | Foreign Keys | RLS Policy | Triggers | Storage Ref |
|---|---|---|---|---|---|---|---|---|---|---|
| `rental_agreements` | 11-month state-stamped registered digital e-leases | 50k | **YES** | No | **YES** | Yes | `properties(id)`, `profiles(id)`| Landlord & Tenant read | Stamp duty audit | `agreement-files` |
| `agreement_signatures` | Aadhaar OTP eSign timestamps & biometric hashes | 100k | **YES** | No | **YES** | Yes | `rental_agreements(id)` | Signer & Admin only | Audit log append | `agreement-files` |
| `agreement_audit_logs` | Tamper-proof hash audit trail for government | 150k | **YES** | No | **YES** | Yes | `rental_agreements(id)` | Read-only | Immutable log | None |
| `pan_documents` | Tax PAN verification records for TDS compliance | 75k | **YES** | No | **YES** | Yes | `profiles(id)` | User private read/write | NSDL API sync | `kyc-documents` |
| `selfie_verifications` | Live liveness detection image & face match score | 75k | **YES** | No | **YES** | Yes | `profiles(id)` | User private read/write | Rekognition AI | `verification-selfies` |
| `tenant_verifications` | Police verification certificates & background checks| 40k | **YES** | No | **YES** | Yes | `profiles(id)` | Tenant & Landlord read | Status webhook | `verification-documents` |

### 2.7 Rent Collection & Fintech

| Table Name | Purpose | Est. Rows | Owner | Broker | Renter | Admin | Foreign Keys | RLS Policy | Triggers | Storage Ref |
|---|---|---|---|---|---|---|---|---|---|---|
| `rent_collections` | Monthly rent ledger, dues, payment reminders | 200k | **YES** | No | **YES** | Yes | `properties(id)` | Landlord & Tenant read | Auto-invoice | None |
| `rent_payments` | UPI AutoPay & payment gateway transaction receipts| 250k | **YES** | No | **YES** | Yes | `rent_collections(id)` | Landlord & Tenant read | Wallet credit | None |
| `rent_invoices` | Official monthly rent GST invoice with HRA receipt | 250k | **YES** | No | **YES** | Yes | `rent_payments(id)` | Landlord & Tenant read | PDF generate | `document-vault` |
| `autopay_mandates` | NPCI e-NACH & UPI recurring auto-debit mandates | 50k | **YES** | No | **YES** | Yes | `profiles(id)` | Tenant self-manage | Mandate webhook | None |
| `payment_methods` | Saved cards, UPI VPA handles, net banking | 100k | Yes | Yes | Yes | Yes | `profiles(id)` | User private write | None | None |
| `wallets` | REHVO Cash balance, cashback points, referral coins| 100k | Yes | Yes | Yes | Yes | `profiles(id)` | User private read | Ledger balance | None |
| `wallet_transactions` | Debit/credit entries for rent cashback & rewards | 500k | Yes | Yes | Yes | Yes | `wallets(id)` | User private read | Immutable ledger | None |

### 2.8 Chat, Messaging & Realtime Presence

| Table Name | Purpose | Est. Rows | Owner | Broker | Renter | Admin | Foreign Keys | RLS Policy | Triggers | Storage Ref |
|---|---|---|---|---|---|---|---|---|---|---|
| `conversations` | 1-on-1 direct messaging channels | 250k | **YES** | Optional | **YES** | Yes | `properties(id)` | Participants only | Updated_at trigger | None |
| `conversation_participants`| Unread message counters, mute settings | 500k | **YES** | Optional | **YES** | Yes | `conversations(id)` | Participant write | Unread reset | None |
| `messages` | Chat messages (text, image, audio, property card) | 5M+ | **YES** | Optional | **YES** | Yes | `conversations(id)` | Participant read/write | Notification fanout | `chat-media` |
| `message_reactions` | Emoji reactions on chat messages | 1M+ | **YES** | Optional | **YES** | Yes | `messages(id)` | Participant read/write | Realtime event | None |
| `chat_typing_status` | Ephemeral typing indicator presence state | Realtime| **YES**| Optional | **YES** | No | `conversations(id)` | Participant write | Auto-expire (5s) | None |

### 2.9 Flatmate Ecosystem

| Table Name | Purpose | Est. Rows | Owner | Broker | Renter | Admin | Foreign Keys | RLS Policy | Triggers | Storage Ref |
|---|---|---|---|---|---|---|---|---|---|---|
| `flatmate_profiles` | Lifestyle preferences, habits, food, sleep, budget | 30k | No | No | **YES** | Yes | `profiles(id)` | User write, public read | Vector embed | `flatmate-images` |
| `flatmate_gallery` | Verified lifestyle space photos & pet pictures | 100k | No | No | **YES** | Yes | `flatmate_profiles(id)` | User write, public read | None | `flatmate-images` |
| `flatmate_prompts` | Personality Q&A answers ("My ideal weekend...") | 90k | No | No | **YES** | Yes | `flatmate_profiles(id)` | User write, public read | None | None |
| `flatmate_waves` | Mutual interest waves & super-waves | 150k | No | No | **YES** | Yes | `flatmate_profiles(id)` | Sender/Receiver read | Match trigger | None |
| `flatmate_matches` | Mutual compatibility pairs with match percentage | 50k | No | No | **YES** | Yes | `flatmate_profiles(id)` | Matched users read | Auto-chat create | None |
| `saved_flatmates` | Bookmarked flatmate profiles | 40k | No | No | **YES** | Yes | `flatmate_profiles(id)` | User private read | None | None |

### 2.10 Resident Services, Utilities & Society Pass

| Table Name | Purpose | Est. Rows | Owner | Broker | Renter | Admin | Foreign Keys | RLS Policy | Triggers | Storage Ref |
|---|---|---|---|---|---|---|---|---|---|---|
| `service_categories` | Home cleaning, deep cleaning, pest control, movers | 20 | Read | No | Read | Yes | None | Public read | None | None |
| `service_bookings` | Professional service requests & dispatch status | 50k | **YES** | No | **YES** | Yes | `service_categories(id)`| User private read/write | Dispatch webhook | None |
| `technicians` | Verified background-checked service partners | 2k | No | No | Read | Yes | None | Public read | None | `profile-images` |
| `technician_reviews` | Ratings & reviews for completed home services | 30k | **YES** | No | **YES** | Yes | `technicians(id)` | Verified customer only | Rating re-compute | None |
| `society_entry_passes` | Digital QR visitor, cab & delivery passes | 200k | **YES** | No | **YES** | Yes | `properties(id)` | Resident create/read | Gatekeeper scan | None |
| `society_complaints` | Maintenance tickets & society grievance redressal | 30k | **YES** | No | **YES** | Yes | `properties(id)` | Resident & Society read | SLA alert trigger | None |
| `society_notices` | Digital society circulars & AGM announcements | 10k | **YES** | No | **YES** | Yes | None | Society members read | Push notification | None |
| `water_tanker_bookings`| Mumbai emergency water tanker ordering service | 15k | **YES** | No | **YES** | Yes | `properties(id)` | Resident create/read | Dispatch sync | None |
| `png_gas_bookings` | Piped Natural Gas (MGL) connection & bill pay | 20k | **YES** | No | **YES** | Yes | `properties(id)` | Resident create/read | MGL API sync | None |

---

## 3. Storage Buckets Inventory

| Bucket ID | Public? | File Size Limit | Allowed MIME Types | Purpose | Primary User Role |
|---|---|---|---|---|---|
| `property-images` | **TRUE** | 10 MB | `image/png, image/jpeg, image/webp` | Listing gallery & cover photos | **Owner** |
| `property-videos` | **TRUE** | 200 MB | `video/mp4, video/quicktime` | Walkthrough video reels | **Owner** |
| `tour-videos` | **TRUE** | 2 GB | `video/mp4, video/quicktime, video/hevc`| Walkthrough video for AI 3D tour | **Owner** |
| `tour-meshes` | **TRUE** | 50 MB | `model/gltf-binary, application/octet-stream` | Draco-compressed 3D glTF room meshes | **Platform AI** |
| `tour-textures` | **TRUE** | 25 MB | `image/png, image/jpeg, image/webp` | 360° Equirectangular room textures | **Platform AI** |
| `tour-thumbnails` | **TRUE** | 5 MB | `image/png, image/jpeg, image/webp` | 3D room preview thumbnails | **Platform AI** |
| `tour-floorplans` | **TRUE** | 10 MB | `image/svg+xml, image/png` | 2D AI synthesized floorplans | **Platform AI** |
| `profile-images` | **TRUE** | 5 MB | `image/png, image/jpeg, image/webp` | User avatars & company logos | **All Users** |
| `flatmate-images` | **TRUE** | 5 MB | `image/png, image/jpeg, image/webp` | Flatmate lifestyle & space photos | **Renter** |
| `flatmate-media` | **TRUE** | 20 MB | `image/*, video/*` | Video intros & pet pictures | **Renter** |
| `chat-media` | **TRUE** | 50 MB | `image/*, video/*, audio/*` | Messaging attachments & voice notes | **All Users** |
| `utility-docs` | **TRUE** | 10 MB | `application/pdf, image/*` | Utility bill payment receipts | **All Users** |
| `verification-documents` | **FALSE** | 25 MB | `application/pdf, image/*` | Title deeds, electricity bills, NOCs | **Owner & Admin** |
| `verification-selfies` | **FALSE** | 10 MB | `image/jpeg, image/png` | Biometric face matching selfie | **All Users** |
| `kyc-documents` | **FALSE** | 25 MB | `application/pdf, image/*` | Aadhaar cards, PAN cards, DigiLocker | **All Users** |
| `agreement-files` | **FALSE** | 50 MB | `application/pdf` | Registered e-Leases with digital seal | **Landlord & Tenant** |
| `document-vault` | **FALSE** | 25 MB | `application/pdf, image/*` | Personal user document storage | **All Users** |
| `agreements` | **FALSE** | 50 MB | `application/pdf` | Draft rental agreements | **Landlord & Tenant** |
| `analytics-data` | **FALSE** | 100 MB | `application/json, text/csv` | Nightly aggregated metrics exports | **Admin / System** |

---

## 4. Key Enums & Check Constraints

```sql
-- Role Enum (Currently 3-state, will be scoped to Owner & Renter in V1)
CHECK (role IN ('renter', 'owner', 'broker'))

-- Account Types
CHECK (account_type IN ('renter', 'owner', 'broker'))

-- Listing Verification Statuses
CHECK (verification_status IN ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'))

-- Property Categories
CHECK (category IN ('RESIDENTIAL', 'COMMERCIAL', 'PG', 'FLATMATE', 'STUDIO', 'PLOT'))

-- Visit Check-in Statuses
CHECK (checkin_status IN ('SCHEDULED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'NO_SHOW'))

-- Agreement Life Cycle
CHECK (status IN ('DRAFT', 'PENDING_SIGNATURES', 'BIOMETRICS_PENDING', 'ACTIVE', 'TERMINATED', 'EXPIRED'))
```

---

## 5. Broker Database Isolation Assessment

> [!IMPORTANT]
> Out of 172 database tables, exactly **one** table (`broker_profiles`) is explicitly dedicated to brokers.  
> There are **zero** database dependencies preventing an **Owner-Only Mobile App Launch**.  
> The schema can run in Owner-Only mode immediately without executing disruptive drop table migrations.
