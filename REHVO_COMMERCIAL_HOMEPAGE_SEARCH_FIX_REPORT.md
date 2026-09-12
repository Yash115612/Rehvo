# REHVO Web — Commercial Homepage Search Fix Report

**Release Status**: Complete & Verified  
**Date**: August 20, 2026  
**Scope**: Homepage Search Dock + Public Hero Search + Search Results Routing + Dynamic Headings + Empty State Handling  

---

## 1. Why Commercial was Missing from Homepage Search

The homepage search dropdown (`RehvoHero.tsx`) was originally hardcoded with only 5 residential property types:
- `any` ("Any (Flat, Room, PG)")
- `flat` ("Full Flat / BHK")
- `room` ("Private Single Room")
- `pg` ("PG & Co-Living")
- `studio` ("Studio Apartment")
- `flatmate` ("Flatmates")

Commercial property options were not present in the select dropdown, and the submission handler did not attach `category=commercial` to the search parameters.

---

## 2. Dropdown UI & Search State Changes

1. **Structured Categorized Dropdown (`RehvoHero.tsx`)**:
   - Organized into clean, accessible `<optgroup>` sections:
     - **`── RESIDENTIAL ──`**:
       - All Residential (`residential:any`)
       - Flat / BHK (`residential:flat`)
       - Private Room (`residential:room`)
       - PG / Co-Living (`residential:pg`)
       - Studio (`residential:studio`)
       - Flatmates (`residential:flatmate`)
     - **`── COMMERCIAL ──`**:
       - All Commercial (`commercial:any`)
       - Office Space (`commercial:office`)
       - Retail Shop (`commercial:shop`)
       - Showroom (`commercial:showroom`)
       - Warehouse / Godown (`commercial:warehouse`)
       - Co-working & Managed (`commercial:coworking`)
       - Commercial Building / Floor (`commercial:commercial_building`)
       - Commercial Plot (`commercial:commercial_plot`)

2. **Context-Aware Visual Icons**:
   - Selecting a commercial type switches the left icon to `Store`, `Warehouse`, `Briefcase`, `Layers`, or `Building2`.
   - Selecting residential displays `Home` or `Users` (for flatmates).

3. **Public Search Dock (`HeroSearch.tsx`)**:
   - Added `Commercial Spaces` segmented tab with `Building2` icon.
   - Dynamically displays commercial types (`office`, `shop`, `showroom`, `warehouse`, `coworking`, `commercial_building`, `commercial_plot`) when the commercial tab is active.

4. **Expanded Budget Tiers**:
   - Accommodation for commercial leasing budgets: `Any Budget`, `Under ₹25k`, `Under ₹50k`, `Under ₹1 Lakh`, `Under ₹2 Lakhs`, `Under ₹5 Lakhs`.

---

## 3. Search Query & Routing Flow

When submitted, the search form generates standard URL parameters:
- **Commercial General**: `/search?category=commercial&city=mumbai`
- **Commercial Specific Type**: `/search?category=commercial&type=office&locality=andheri-east&city=mumbai`
- **Residential**: `/search?category=residential&type=flat&city=mumbai`
- **Flatmate**: `/flatmates/mumbai`

---

## 4. Search Results Page (`/search`) Enhancements

1. **Automatic Category Inference**:
   - If `category` is not explicitly set, but a known commercial type (`office`, `shop`, `showroom`, `warehouse`, `coworking`, `commercial_building`, `commercial_plot`) is present, it automatically infers `currentCategory = 'commercial'` and activates the Commercial tab.
2. **Dynamic Context-Aware Headings**:
   - For `type=office`: *"Office Spaces in [Locality]"* / *"Office Spaces for Rent in Mumbai"*
   - For `type=shop`: *"Retail Shops in [Locality]"* / *"Retail Shops for Rent in Mumbai"*
   - For `type=showroom`: *"Showrooms in [Locality]"* / *"Showrooms for Rent in Mumbai"*
   - For `type=warehouse`: *"Warehouses in [Locality]"* / *"Warehouses & Industrial in Mumbai"*
   - For `type=coworking`: *"Co-working Spaces in [Locality]"* / *"Co-working & Managed Spaces in Mumbai"*
   - For `type=commercial_building`: *"Commercial Buildings in [Locality]"*
   - For `type=commercial_plot`: *"Commercial Plots in [Locality]"*
   - For `category=commercial`: *"Commercial Spaces in [Locality]"* / *"All Commercial Properties in Mumbai"*
3. **Contextual Empty State**:
   - When no commercial results match the filter, shows: *"No commercial properties found"* with actions:
     - `Reset Filters` (`/search?category=commercial`)
     - `Explore Commercial Hubs` (`/commercial`)
     - `List Commercial Space` (`/owner/properties/new?category=commercial`)

---

## 5. Test Matrix & Verification

| Test Scenario | Action | Expected Output | Status |
| :--- | :--- | :--- | :---: |
| **TEST 1: Homepage Search Dropdown** | Open homepage | Grouped `RESIDENTIAL` and `COMMERCIAL` options visible | **PASSED** |
| **TEST 2: Commercial Selection** | Select "Office Space" | Dynamic `Building2` icon displayed | **PASSED** |
| **TEST 3: Search Submission** | Select Office + Mumbai + Search | Navigates to `/search?category=commercial&type=office&city=mumbai` | **PASSED** |
| **TEST 4: Commercial Results Page** | Inspect results page | Commercial tab active, "Office Spaces for Rent in Mumbai" title | **PASSED** |
| **TEST 5: Residential Regression** | Select "Flat / BHK" + Search | Navigates to `/search?category=residential&type=flat&city=mumbai` | **PASSED** |
| **TEST 6: Commercial Empty State** | Search non-existent criteria | Shows "No commercial properties found" with "Explore Commercial Hubs" | **PASSED** |
| **TEST 7: Navbar Integration** | Click "Commercial" in Navbar | Navigates to dedicated `/commercial` hub | **PASSED** |
| **TEST 8: TypeScript Typecheck** | `npm run typecheck` in `web/` | 0 errors | **PASSED** |
| **TEST 9: Next.js Production Build** | `npm run build` in `web/` | 31/31 routes compiled cleanly | **PASSED** |
