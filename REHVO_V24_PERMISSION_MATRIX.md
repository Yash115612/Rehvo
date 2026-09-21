# REHVO V24 — Role-Based Access Control (RBAC) & Permission Matrix

**Version:** REHVO V24.5 Architectural Audit  
**Scope:** Permissions across Database Tables, Storage Buckets, Mobile Navigation, Next.js Web Routes, and Edge Functions  
**Objective:** Formalize access boundaries for Anonymous, Renter, Owner, Broker, and Admin roles  

---

## 1. Role Hierarchy & Definitions

| Role Identifier | Description | V1 Launch Status |
|---|---|---|
| `anon` | Unauthenticated mobile visitor or search engine crawler | **ACTIVE** |
| `renter` | Authenticated tenant looking for rentals, flatmates, or community services | **ACTIVE** |
| `owner` | Authenticated individual landlord or multi-unit property manager | **ACTIVE (CORE FOCUS)** |
| `broker` | Real estate agent / agency managing listings for third parties | **GATED (V2)** |
| `service_role` | Backend Supabase Edge Functions & Admin CLI | **ACTIVE (INTERNAL)** |

---

## 2. Mobile Route Access Matrix

| Route Group | Path Pattern | `anon` | `renter` | `owner` | `broker` (V1) |
|---|---|---|---|---|---|
| **Public Discovery** | `app/(renter)/explore`, `app/(renter)/details/*` | Read | Read | Read | Read |
| **Authentication** | `app/(auth)/*` | Full | Full | Full | Full |
| **Tenant Portal** | `app/(renter)/visits`, `saved`, `chat`, `profile` | Redirect to Auth | Full | Full | Full |
| **Flatmates Hub** | `app/(renter)/flatmates/*` | View | Full | Full | Full |
| **Owner Listing Studio** | `app/(owner)/listings/new`, `tour/upload` | Redirect to Auth | Upgrades to Owner | **Full** | Blocked / Redirected |
| **Owner Business Suite** | `app/(owner)/dashboard`, `analytics`, `leads` | Redirect to Auth | Restricted | **Full** | Blocked / Redirected |
| **Broker Ecosystem** | `app/(broker)/*` | Blocked | Blocked | Blocked | **GATED (404 / Hidden)** |

---

## 3. Database Table Access Matrix (Key Domains)

| Domain | Table Name | `anon` | `renter` | `owner` | `broker` (V1) |
|---|---|---|---|---|---|
| **Identity** | `profiles` | Read | Read / Self-Update | Read / Self-Update | Read / Self-Update |
| **Identity** | `broker_profiles` | None | None | None | **Read Only / Gated** |
| **Identity** | `owner_profiles` | None | Read | **CRUD (Self)** | Read |
| **Listings** | `properties` | Read Verified | Read Verified | **CRUD (Owned)** | Read Verified |
| **Listings** | `property_images` | Read Verified | Read Verified | **CRUD (Owned)** | Read Verified |
| **Listings** | `property_documents` | None | None | **CRUD (Owned)** | None |
| **AI 3D Tour** | `property_3d_tours` | Read Verified | Read Verified | **CRUD (Owned)** | Read Verified |
| **AI 3D Tour** | `tour_processing_jobs`| None | None | **CRUD (Owned)** | None |
| **Leases** | `lease_agreements` | None | Read / Sign (Participant) | **CRUD (Owned)** | None |
| **Fintech** | `rent_payments` | None | Create / Read (Payer) | **Read / Payout (Payee)** | None |
| **Leads** | `property_leads` | Create (Inquire) | Read (Self) | **Full CRM (Owner)** | None |

---

## 4. Storage Bucket Access Matrix

| Bucket ID | `anon` Read | `renter` Upload | `owner` Upload | `broker` Upload (V1) | Service Role |
|---|---|---|---|---|---|
| `property-images` | Yes | No | **YES** | Blocked | Full |
| `property-videos` | Yes | No | **YES** | Blocked | Full |
| `tour-videos` | No | No | **YES** | Blocked | Full |
| `tour-meshes` | Yes | No | No | No | **Full (AI Worker)** |
| `tour-textures` | Yes | No | No | No | **Full (AI Worker)** |
| `tour-floorplans` | Yes | No | No | No | **Full (AI Worker)** |
| `verification-documents` | No | No | **YES** | Blocked | Full |
| `kyc-documents` | No | **YES** | **YES** | Blocked | Full |
| `agreement-files` | Signed Only | Signed Only | **Signed Only** | Blocked | Full |

---

## 5. Security & Isolation Conclusion

The permission matrix demonstrates airtight isolation:
1. **No Data Leakage**: Gating broker routes and hiding broker UI components guarantees that no broker features can be accessed by renters or owners.
2. **Owner Full Empowerment**: Owners possess complete, uninhibited CRUD authorization across listings, 3D tours, tenant leads, and rent agreements without any broker involvement.
