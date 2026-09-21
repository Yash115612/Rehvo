# REHVO V24 — Cloud Storage Architecture Audit

**Version:** REHVO V24.5 Infrastructure Audit  
**Target:** Supabase Cloud Storage Engine (S3-compatible)  
**Scope:** 19 Cloud Storage Buckets, Access Policies, File Size Constraints, MIME Filters, Lifecycle Management  
**Objective:** Comprehensive storage mapping for Owner-Only and AI Tour launch  

---

## 1. Storage Overview

REHVO provisions **19 cloud storage buckets** handling high-resolution real estate photography, mobile video walkthroughs, AI 3D Draco meshes, DigiLocker KYC documents, and encrypted legal lease agreements.

| Metric | Value | Architectural Status |
|---|---|---|
| **Total Storage Buckets** | **19 Buckets** | 100% Configured & Provisioned |
| **Public CDN Buckets** | **12 Buckets** | High-speed global edge caching via Cloudflare |
| **Encrypted Private Buckets** | **7 Buckets** | Signed URL access only; RLS & AES-256 encrypted |
| **Max Single File Limit** | **2.0 GB** | Dedicated to `tour-videos` (Raw 4K mobile walkthroughs) |
| **Broker-Specific Buckets** | **0 Buckets** | Brokers share platform avatar & KYC buckets; zero isolated buckets |
| **Owner-Exclusive Buckets** | **4 Buckets** | `property-images`, `property-videos`, `tour-videos`, `verification-documents` |
| **AI Photogrammetry Buckets** | **4 Buckets** | `tour-meshes`, `tour-textures`, `tour-thumbnails`, `tour-floorplans` |

---

## 2. Complete Storage Buckets Inventory

| # | Bucket ID | Access Level | Max File Size | Allowed MIME Types | Primary Role | Lifecycle / Retention | RLS Authorization Rule |
|---|---|---|---|---|---|---|---|
| 1 | `property-images` | **Public** | 10 MB | `image/png, image/jpeg, image/webp` | Owner | Permanent | Owner write (`auth.uid() = owner_id`), Public read |
| 2 | `property-videos` | **Public** | 200 MB | `video/mp4, video/quicktime` | Owner | Permanent | Owner write, Public read |
| 3 | `tour-videos` | **Public** | 2 GB | `video/mp4, video/quicktime, video/hevc` | Owner | 30-day raw archive | Owner write, Platform worker process |
| 4 | `tour-meshes` | **Public** | 50 MB | `model/gltf-binary, application/octet-stream` | AI Engine | Permanent | Platform service role write, Public read |
| 5 | `tour-textures` | **Public** | 25 MB | `image/png, image/jpeg, image/webp` | AI Engine | Permanent | Platform service role write, Public read |
| 6 | `tour-thumbnails` | **Public** | 5 MB | `image/png, image/jpeg, image/webp` | AI Engine | Permanent | Platform service role write, Public read |
| 7 | `tour-floorplans` | **Public** | 10 MB | `image/svg+xml, image/png` | AI Engine | Permanent | Platform service role write, Public read |
| 8 | `profile-images` | **Public** | 5 MB | `image/png, image/jpeg, image/webp` | Shared | Permanent | User self-manage (`folder_name = auth.uid()`), Public read |
| 9 | `flatmate-images` | **Public** | 5 MB | `image/png, image/jpeg, image/webp` | Renter | Permanent | Renter write, Public read |
| 10 | `flatmate-media` | **Public** | 20 MB | `image/*, video/*` | Renter | 90-day archive | Renter write, Public read |
| 11 | `chat-media` | **Public** | 50 MB | `image/*, video/*, audio/*` | Shared | 1-year archive | Chat room participant write & read |
| 12 | `utility-docs` | **Public** | 10 MB | `application/pdf, image/*` | Shared | 3-year archive | Tenant/Owner bill payment receipts |
| 13 | `verification-documents` | **Private** | 25 MB | `application/pdf, image/*` | Owner | 7-year legal | Owner write, Admin/Compliance read only |
| 14 | `verification-selfies` | **Private** | 10 MB | `image/jpeg, image/png` | Shared | Purge on KYC verify | Biometric liveness check; ephemeral storage |
| 15 | `kyc-documents` | **Private** | 25 MB | `application/pdf, image/*` | Shared | 7-year legal | User upload, Admin review; Encrypted at rest |
| 16 | `agreement-files` | **Private** | 50 MB | `application/pdf` | Shared | Permanent | Registered e-Leases; Landlord & Tenant signed URL only |
| 17 | `document-vault` | **Private** | 25 MB | `application/pdf, image/*` | Shared | User controlled | Personal locker; `auth.uid() = owner_id` |
| 18 | `agreements` | **Private** | 50 MB | `application/pdf` | Shared | Draft lifecycle | Temporary legal draft PDF generation |
| 19 | `analytics-data` | **Private** | 100 MB | `application/json, text/csv` | System | 30-day rollup | Nightly cron telemetry dump; Service role only |

---

## 3. Storage Security & Access Control

1. **Path Prefix Isolation**:
   - In all multi-tenant buckets (e.g. `profile-images`, `document-vault`, `kyc-documents`), file objects are prefixed with `${auth.uid()}/...`.
   - Supabase storage RLS strictly matches `(storage.foldername(name))[1] = auth.uid()::text`.
2. **Private File Delivery**:
   - Files in private buckets are served via signed URLs generated on-demand with a maximum TTL of 60 seconds.
3. **Malware & MIME Verification**:
   - The Supabase storage engine enforces strict MIME-type whitelists on ingress, rejecting file extension spoofing.

---

## 4. Storage Impact of Owner-Centric V1 Launch

- **Zero Storage Modifications Needed**: No storage bucket is dedicated to brokers.
- **AI 3D Tour Storage Readiness**: The 4 dedicated photogrammetry buckets (`tour-videos`, `tour-meshes`, `tour-textures`, `tour-floorplans`) are fully configured with appropriate MIME headers and 2GB limits to handle raw video uploads and glTF 3D scene streaming.
