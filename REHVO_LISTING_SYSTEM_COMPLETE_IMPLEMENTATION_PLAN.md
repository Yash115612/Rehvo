# REHVO Mobile App — Property Listing & Creation System Complete Redesign & Implementation Plan

---

## 1. Executive Summary & Product Objective

The **REHVO Property Listing Creation System** is the end-to-end publishing pipeline that empowers property owners, hosts, and co-living operators to create and publish high-quality residential, commercial, and PG/room listings on REHVO.

$$\textbf{Listing Publishing Engine} \longrightarrow \begin{cases} \textbf{Guided Entry} & \text{(Floating (+), contextual category selector)} \\ \textbf{Category-Adaptive Wizard} & \text{(Dynamic fields for Residential, Commercial, PG/Rooms)} \\ \textbf{Atomic Multi-Step Validation} & \text{(Inline feedback per step, zero surprise errors)} \\ \textbf{Realistic Pre-Flight Preview} & \text{(High-fidelity listing preview before committing)} \\ \textbf{Atomic Supabase Publishing} & \text{(Dual-phase database insert + storage bucket upload)} \end{cases}$$

### Core Product Principles:
- **Guided Publishing, Not a Bureaucratic Form**: Every step is modular, focused on 2–4 related questions with clear progress indication (`Step X of 12`).
- **Category-Adaptive Logic**: Commercial listings ask for commercial fields (carpet area, power backup, floor loading, commercial types), while Residential listings ask for residential fields (BHK, bathrooms, furnishing).
- **Zero Data Loss**: Progress is auto-saved to AsyncStorage (`rehvo_listing_draft`) on every step transition; exit confirmation prevents accidental discard.
- **Realistic Listing Preview**: Owners inspect the exact visual representation of their listing (adapting canonical property cards and detail structures) before publishing.
- **Single Canonical Wizard Path**: Centralized in [`app/(renter)/listing/*`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/listing), accessible seamlessly by Renters, Owners, and Hosts with zero route duplication.

---

## 2. Current Listing Runtime Trace & Component Audit

### A. Current Runtime Architecture:
```
PRIMARY ENTRY: Floating Bottom Nav (+) Button / Owner Dashboard "Add Property"
  └── ContextualCreateSheet.tsx ("List a Property" CTA)
        └── ROUTE: app/(renter)/listing/property-type.tsx (Step 1)
              ├── ListingHeader.tsx (Step indicator, Back, Draft exit button)
              ├── ListingExitModal.tsx (Save Draft | Keep Editing | Discard)
              └── Step Navigation Sequence (12 Modular Steps):
                    ├── 01. property-type.tsx   (Residential vs Commercial + Sub-type)
                    ├── 02. details.tsx         (BHK/Commercial Type, Area, Bathrooms, Floor)
                    ├── 03. location.tsx        (City, Locality, Society/Building, Address)
                    ├── 04. pricing.tsx         (Rent, Deposit, Maintenance, Brokerage)
                    ├── 05. amenities.tsx       (Category-specific amenities grid)
                    ├── 06. photos.tsx          (Multi-image upload, Cover photo selector)
                    ├── 07. description.tsx     (Title, Description, Highlights)
                    ├── 08. availability.tsx    (Available from date, Lock-in, Notice)
                    ├── 09. contact.tsx         (Tenant/Business preferences, Timings)
                    ├── 10. preview.tsx         (Full realistic listing preview)
                    ├── 11. publish.tsx         (Pre-flight checklist & atomic upload)
                    └── 12. success.tsx         (Success screen + View/Manage CTAs)
```

### B. Component & Route Classification:

| Route / Component Path | Status | Role & Evaluation |
| :--- | :--- | :--- |
| [`app/(renter)/listing/_layout.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/%28renter%29/listing/_layout.tsx) | **CANONICAL WIZARD LAYOUT** | Houses standard Stack navigation for the 12 listing steps |
| [`src/components/listing/ListingHeader.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/listing/ListingHeader.tsx) | **CANONICAL HEADER** | Persistent progress indicator, back button, draft trigger |
| [`src/components/listing/ListingExitModal.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/listing/ListingExitModal.tsx) | **CANONICAL EXIT MODAL** | Three-tier exit confirmation (Save Draft, Keep Editing, Discard) |
| [`src/store/useAppStore.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/store/useAppStore.ts) | **CANONICAL STATE STORE** | Holds `listingDraft`, `updateListingDraft`, `resetListingDraft` |
| [`src/services/properties.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/properties.ts) | **CANONICAL BACKEND SERVICE** | Houses `createProperty` with atomic Supabase database insert & image upload |

---

## 3. Real Data Model & Supported Listing Types

The listing wizard writes directly to the Supabase `properties` and `property_images` tables.

### Supported Property Categories & Types:

```typescript
// 1. RESIDENTIAL CATEGORY:
export type ResidentialPropertyType = 
  | 'FLAT'           // Standard independent flat / apartment
  | 'PG'             // Managed co-living with meals & services
  | 'PRIVATE_ROOM'   // Private locked room in shared flat
  | 'SHARED_ROOM'    // Shared bedroom space for roommates
  | 'STUDIO';        // 1 RK / Studio self-contained unit

// 2. COMMERCIAL CATEGORY:
export type CommercialType =
  | 'OFFICE'              // Bare shell, warm shell, or fully-furnished office
  | 'SHOP'                // Retail street / mall store
  | 'SHOWROOM'            // Road-facing glass showroom
  | 'COWORKING'           // Managed desks / private team cabins
  | 'WAREHOUSE'           // Godown, storage facility, logistics hub
  | 'COMMERCIAL_BUILDING' // Whole independent commercial floor / building
  | 'COMMERCIAL_PLOT';    // Commercial land / plot
```

---

## 4. Owner vs Renter Access & Role Behavior

- **Renter Tapping `(+)`**:
  - Opens `ContextualCreateSheet` allowing the user to either "List a Property" or "Create a Flatmate Profile".
  - If selecting "List a Property", user enters the listing wizard directly.
  - Upon publishing their first listing, the user is elevated to `role = 'OWNER'` (or maintains dual capabilities).
- **Owner Tapping `(+)` / "Add Property"**:
  - Routes directly into `/(renter)/listing/property-type` with zero modal friction.
- **Single Source of Truth**: Renter and Owner flows share the exact same wizard routes and persistence engine.

---

## 5. Master 12-Step Listing Flow Specification

```
┌────────────────────────────────────────────────────────┐
│ [ ← ]                Step 4 of 12              [ Draft ]│  ◄── PERSISTENT WIZARD HEADER
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  ◄── ANIMATED PROGRESS TRACK
└────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────┐
│ Set Pricing & Charges                                  │
│ Be transparent to attract serious tenants faster.      │
│                                                        │
│ Expected Monthly Rent *                                │
│ [ ₹ 45,000 / month                                   ] │
│                                                        │
│ Security Deposit *                                     │
│ [ ₹ 1,50,000                                         ] │
│                                                        │
│ Monthly Maintenance Charges                            │
│ [ ₹ 3,500 / month                                    ] │
│                                                        │
│ Brokerage Terms                                        │
│ [ ✓ 0% Brokerage (Direct from Owner)                ] │
│                                                        │
│ [ Continue → ]                                         │  ◄── VALIDATED STEP ACTION
└────────────────────────────────────────────────────────┘
```

---

### Step 1: Property Type & High-Level Category
- **Category Switcher**: Segmented toggle between `Residential` and `Commercial`.
- **Property Type Grid**: Selectable cards with icons and descriptions (Flat, PG, Private Room, Studio vs Office, Shop, Showroom, Coworking, Warehouse).
- **State Updated**: `category`, `property_type`.

---

### Step 2: Basic Configuration & Floor Specs
- **Residential Flow**:
  - BHK Configuration (`1 RK`, `1 BHK`, `2 BHK`, `3 BHK`, `4+ BHK`)
  - Bathrooms (`1`, `2`, `3`, `4+`)
  - Super Built-up Area & Carpet Area (in sq ft)
  - Floor Number & Total Building Floors
  - Furnishing Status (`FULLY_FURNISHED`, `SEMI_FURNISHED`, `UNFURNISHED`)
- **Commercial Flow**:
  - Commercial Sub-Type
  - Carpet Area (sq ft)
  - Dedicated Washrooms Count
  - Floor Number & Total Floors
  - Furnishing Status (`BARE_SHELL`, `WARM_SHELL`, `FULLY_FURNISHED`)

---

### Step 3: Precise Location & Landmark
- **City**: Defaulted to `Mumbai` (MMR).
- **Locality**: Searchable auto-complete list for major MMR hubs (Andheri West, Bandra West, Powai, Worli, Lower Parel, Thane West, Navi Mumbai, etc.).
- **Building / Society Name**: Text input.
- **Flat / Unit Number**: (Stored privately for verified visits).
- **Full Address**: Textarea.
- **Nearby Landmark**: Metro station, highway, or landmark.

---

### Step 4: Transparent Financials & Pricing
- **Monthly Rent**: Required numeric input with real-time Indian comma formatting (`₹ 45,000 / month`).
- **Security Deposit**: Numeric input (`₹ 1,50,000`).
- **Monthly Maintenance**: Optional numeric input (`₹ 3,500 / mo` or Included).
- **0% Brokerage Toggle**: Switch toggle for verified zero-brokerage listings.

---

### Step 5: Category-Adaptive Amenities Grid
- **Residential Amenities**:
  - Lift, 100% Power Backup, Covered Car Parking, 24x7 Security Guard, Swimming Pool, Modern Gym, Gas Pipeline, Children Play Area, Pet Friendly, Clubhouse.
- **Commercial Amenities**:
  - High-Speed Elevators, 100% DG Backup, Central AC Provision, Reserved Car Parking, 24x7 CCTV Security, Fire Fighting Systems, Conference Room, Cafeteria.
- **PG & Room Amenities**:
  - High-Speed Wi-Fi, Daily Housekeeping, Attached Bathroom, AC Room, 3 Meals Included, RO Drinking Water, Washing Machine, Biometric Access.

---

### Step 6: High-Quality Photo Upload
- **Engine**: Integrated with `expo-image-picker` with camera/gallery choice.
- **Multi-Photo Support**: Upload up to 15 photos.
- **Cover Photo Designation**: One-tap cover badge indicator (`★ Cover Photo`).
- **Thumbnail Grid**: Delete (`Trash` icon), reorder, and image zoom preview.
- **Guidance Rule**: Minimum 1 cover photo required to continue; 3+ recommended.

---

### Step 7: Title & Compelling Description
- **Listing Title**: Suggested smart title (e.g. *"Spacious 2 BHK with Sea View in Bandra West"*) or custom text.
- **Description**: Textarea with helpful prompt (*"Tell renters about natural light, ventilation, society amenities, and transit connectivity"*).
- **Key Selling Highlights**: Chips for quick selection (*"Near Metro"*, *"Vastu Compliant"*, *"Gated Society"*, *"High Floor"*).

---

### Step 8: Availability & Lease Terms
- **Available From**: `Immediate` vs `Specific Date Picker`.
- **Lock-in Period**: `None`, `6 Months`, `12 Months`, `24 Months`.
- **Notice Period**: `1 Month`, `2 Months`, `3 Months`.

---

### Step 9: Tenant / Business Preferences & Timings
- **Residential Preferred Tenants**: `Family`, `Bachelors`, `Working Professionals`, `Company Lease`, `Any`.
- **Commercial Suitable Businesses**: `IT / Tech`, `Corporate Office`, `Consulting`, `Clinic / Diagnostic`, `Banking / NBFC`, `Retail Store`.
- **Visit Availability Timings**: `Anytime with notice`, `Weekends only`, `Evenings 5 PM - 8 PM`.

---

### Step 10: Realistic Live Listing Preview
- **High-Fidelity Preview**: Renders the exact visual structure that potential renters will see on the flagship property details screen:
  - Hero image carousel with cover badge
  - Pricing & deposit breakdown banner
  - Locality & society specs
  - Full amenities badge grid
  - Detailed description
  - Verification & contact preview

---

### Step 11: Pre-Flight Verification & Atomic Publish
- **Automated Pre-Flight Checklist**:
  - [x] Basic Configuration & Property Type Verified
  - [x] Location & Landmark Specified
  - [x] Rent & Security Deposit Validated
  - [x] Minimum 1 Photo Uploaded
  - [x] Title & Description Confirmed
- **Publish Action**: Single primary `Publish Listing` CTA with loading spinner, preventing accidental double submission.
- **Atomic Two-Phase Upload**:
  1. Inserts record into Supabase `properties` table.
  2. Uploads local images to Supabase storage bucket `property-images` and creates matching records in `property_images`.

---

### Step 12: Published Success Confirmation
- **Success Graphic**: Animated green verification checkmark.
- **Confirmation Message**: *"Your listing is now live on REHVO!"*
- **Primary Actions**:
  - `[ View Published Listing → ]` $\rightarrow$ routes to `/(renter)/property/[id]`.
  - `[ Manage in My Properties ]` $\rightarrow$ routes to `/(owner)/properties`.
  - `[ Go to Home ]` $\rightarrow$ routes to `/(renter)/home`.

---

## 6. Draft State Management & Exit Handling

### A. Persistence Architecture:
- Store state `listingDraft` is synchronized to AsyncStorage key `rehvo_listing_draft` on every step transition.
- App crashes, phone calls, or navigation interruptions preserve all entered form fields and selected photo URIs.

### B. Exit Confirmation (`ListingExitModal`):
- Tapping `Back` on Step 1 or `Draft` on any step opens `ListingExitModal`:
  1. **Save Draft**: Persists state and returns user safely to Home/Dashboard with a success toast (*"Listing draft saved"*).
  2. **Keep Editing**: Dismisses modal and resumes editing current step.
  3. **Discard Progress**: Wipes `listingDraft` and clears AsyncStorage draft key.

---

## 7. Mobile Form & Keyboard Handling Standards

- **`KeyboardAvoidingView`**: Configured with `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}` across all 12 step screens.
- **Floating Action Dock**: Step continue buttons are pinned above the keyboard or docked at the bottom with safe-area padding.
- **Input Geometry**: 48px height, 14px border radius, `#FFFFFF` background, `#E9E6E0` border, `#19181C` active focus highlight.

---

## 8. Integration with Owner Dashboard & My Properties

- When a property is published:
  1. Store state `properties` is updated optimistically with the new property.
  2. The listing automatically appears under the Owner's **My Properties** tab (`/(owner)/properties`).
  3. Real-time enquiries and scheduled visits route directly to the newly created property ID.

---

## 9. Exact Step-by-Step Implementation Sequence (Once Approved)

### STEP 1: Audit and Refine Listing Header & Exit Modal
- Update [`ListingHeader.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/listing/ListingHeader.tsx) and [`ListingExitModal.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/listing/ListingExitModal.tsx) with REHVO design tokens.

### STEP 2: Refine Step 1 (`property-type.tsx`)
- Perfect the Residential vs Commercial category toggle and type selector.

### STEP 3: Refine Step 2 (`details.tsx`)
- Ensure adaptive rendering of BHK/floors for residential vs carpet area/power backup for commercial.

### STEP 4: Refine Step 3 (`location.tsx`)
- Enhance MMR locality auto-suggest and clean address inputs.

### STEP 5: Refine Step 4 (`pricing.tsx`)
- Ensure Indian currency formatting, deposit validation, and 0% brokerage toggle.

### STEP 6: Refine Step 5 (`amenities.tsx`)
- Provide category-adaptive amenity chips with icon badges.

### STEP 7: Refine Step 6 (`photos.tsx`)
- Implement multi-photo upload, cover photo toggle, and delete actions.

### STEP 8: Refine Step 7 (`description.tsx`)
- Add smart title helper and rich description textarea.

### STEP 9: Refine Step 8 (`availability.tsx`)
- Add date pickers, lock-in, and notice period selections.

### STEP 10: Refine Step 9 (`contact.tsx`)
- Add tenant preference tags and visit timing slots.

### STEP 11: Refine Step 10 (`preview.tsx`)
- Build realistic preview rendering matching the flagship property detail view.

### STEP 12: Refine Step 11 (`publish.tsx`) & Step 12 (`success.tsx`)
- Implement pre-flight validation, atomic Supabase publish, and success redirection.

### STEP 13: Execute Automated Verification & QA Gates
- Run `npx tsc --noEmit` $\rightarrow$ 0 errors.
- Run Metro Android Export Bundle $\rightarrow$ 0 errors.
- Run 3-App Architecture Boundary Scanner $\rightarrow$ 0 violations.
- Verify `web/` and `admin/` 100% frozen.

---

## 10. Runtime Verification & Test Matrix

| Test Case | Interaction Flow | Expected Outcome |
| :--- | :--- | :--- |
| **TEST 1: Residential Flow** | List 2 BHK Apartment $\rightarrow$ Fill all 12 steps $\rightarrow$ Publish | Listing published to Supabase; appears in Home & Saved |
| **TEST 2: Commercial Flow** | List 1,200 sq ft Office $\rightarrow$ Fill commercial steps $\rightarrow$ Publish | Commercial listing published with commercial attributes |
| **TEST 3: Save Draft & Resume** | Fill Steps 1–4 $\rightarrow$ Tap Draft $\rightarrow$ Save $\rightarrow$ Re-open | All entered data restored accurately |
| **TEST 4: Image Upload** | Pick 3 photos $\rightarrow$ Set Cover $\rightarrow$ Delete 1 photo | Cover updated; storage uploads properly |
| **TEST 5: Pre-Flight Guard** | Leave required rent blank $\rightarrow$ Attempt to publish | Step blocks with focused error message |

---

## 11. Strict Boundary & Code Freeze Confirmation

```
BOUNDARY VERIFICATION:
- web/   ──► 0 modifications (100% frozen)
- admin/ ──► 0 modifications (100% frozen)
- Mobile ──► Strict isolation in app/(renter)/listing/* and src/components/listing/
```

---

## 12. Approval Request

This plan establishes a complete, guided, mobile-first property publishing system for REHVO Mobile.

**No code has been modified in this planning phase.** Implementation will begin only upon your explicit approval.
