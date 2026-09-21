# REHVO V24 — Unused Code, Dead Routes & Performance Audit

**Audit Focus:** Code redundancy, duplicate routes, memory footprint, and dead code analysis  
**Scope:** Mobile App (`app/`, `src/`), Web App (`web/`), Database (`supabase/`), Backend Services  
**Action Note:** Pure diagnostic audit. Do NOT delete files during this stage.

---

## 1. Duplicate & Superseded Routes (High Priority)

The migration to dedicated route groups (`(owner)`, `(renter)`, `(broker)`) left several legacy routes inside `app/(renter)/` that duplicate modern implementations in `app/(owner)/`.

| Legacy Duplicate Route | Modern Canonical Route | Duplicate Status | Recommended Action |
|---|---|---|---|
| `app/(renter)/owner-dashboard.tsx` | `app/(owner)/dashboard.tsx` | 100% duplicate | Redirect to `/(owner)/dashboard` |
| `app/(renter)/owner-properties.tsx` | `app/(owner)/listings.tsx` | 100% duplicate | Redirect to `/(owner)/listings` |
| `app/(renter)/owner-leads.tsx` | `app/(owner)/leads.tsx` | 100% duplicate | Redirect to `/(owner)/leads` |
| `app/(renter)/owner-analytics.tsx` | `app/(owner)/analytics.tsx` | 100% duplicate | Redirect to `/(owner)/analytics` |
| `app/(renter)/owner-rent.tsx` | `app/(owner)/rent-collection.tsx` | 100% duplicate | Redirect to `/(owner)/rent-collection` |
| `app/(renter)/owner-plans.tsx` | `app/(owner)/subscription.tsx` | 100% duplicate | Redirect to `/(owner)/subscription` |
| `app/(renter)/owner-visits.tsx` | `app/(owner)/visits.tsx` | 100% duplicate | Redirect to `/(owner)/visits` |
| `app/(renter)/owner-notifications.tsx`| `app/(owner)/notifications.tsx` | 100% duplicate | Redirect to `/(owner)/notifications` |
| `app/(renter)/owner-documents.tsx` | `app/(owner)/dashboard.tsx` | Subsumed by Docs tab | Redirect to `/(owner)/dashboard` |
| `app/(renter)/manage-properties.tsx` | `app/(owner)/listings.tsx` | Legacy wrapper | Redirect to `/(owner)/listings` |
| `app/(renter)/owner-performance.tsx` | `app/(owner)/analytics.tsx` | Subsumed by Analytics| Redirect to `/(owner)/analytics` |
| `app/(renter)/listing/*` | `app/(owner)/listing/*` | Duplicate entrypoint | Consolidate under `(owner)` |

---

## 2. Dead / Orphaned Components

Components created during early prototyping that are no longer imported by active navigation screens:

| Component Path | Size | Reason for Inactivity |
|---|---|---|
| `src/components/flatmates/FlatmateFilterBar.tsx` | 4.2 KB | Superseded by `V4FlatmatesFilterModal.tsx` |
| `src/components/v4/ui/V4CategoryIntakeModal.tsx` | 6.8 KB | Replaced by multi-step category selection in `V4ExploreScreen.tsx` |
| `src/components/v4/chat/V4AgreementMessageCard.tsx` | 5.1 KB | Replaced by inline digital lease viewer in `V4RentalAgreementsScreen.tsx` |
| `src/components/v4/services/V4ServiceBookingSheet.tsx` | 8.4 KB | Replaced by dedicated flow in `V4UtilitiesScreen.tsx` |
| `src/components/v4/services/V4OTPVerificationCard.tsx` | 3.6 KB | Replaced by native OTP input in `V4OtpScreen.tsx` |

---

## 3. Unused & Mocked APIs

Endpoints in services running on synthetic in-memory fixtures:

1. **`src/services/cashbackEngine.ts`**:
   - `getPendingCashbackClaims()`: Uses local mock data; needs Supabase RPC connection before real fiat disbursement.
2. **`src/services/commuteEngine.ts`**:
   - `calculateTransitETA()`: Uses synthetic Haversine speed formula when Google Maps Distance Matrix API key is unpopulated.
3. **`web/src/app/api/seo/overview/route.ts`**:
   - Returns mock GSC data (142,500 impressions, 8,920 clicks); ready to be bound to Google Search Console API.
4. **`web/src/app/api/seo/top-queries/route.ts`**:
   - Returns mock search keywords ("flats in bandra", "zero brokerage mumbai").

---

## 4. Unused Database Tables & Legacy Tables

Tables created in experimental migrations that currently store 0 active rows:

1. **`property_compare_sessions`**: Session comparisons are managed on the client in Zustand; database sync is optional.
2. **`offline_sync_queue`**: Replaced by AsyncStorage offline queue in `src/services/offlineEngine.ts`.
3. **`user_unlocked_badges`**: Gamification badges are currently computed client-side from `wallets`.
4. **`water_supply_schedule`**: Locality water timings are hardcoded in `src/services/nearbyEngine.ts`.

---

## 5. Memory-Heavy Screens & Performance Profiling

| Screen Route | Memory Profile | Primary Drivers | Optimization Recommendation |
|---|---|---|---|
| `/(renter)/map` | **High** (~140 MB) | 1,000+ custom map markers on React Native Maps | Use clustering via Supercluster & lazy marker rendering. |
| `/(renter)/tour/[id]` | **Moderate** (~85 MB) | High-res 360° panoramas & 3D raycasting | Unload inactive room panoramas when navigating between rooms. |
| `/(owner)/tour/upload` | **Moderate** (~95 MB) | Video frame extraction & 1080p compression | Free video buffer memory immediately after upload completion. |
| `/(renter)/search` | **Low-Moderate** (~60 MB)| FlatList with 50+ property cards | Already uses `initialNumToRender={10}` and `maxToRenderPerBatch={8}`. |

---

## 6. Environment Variables Audit

| Variable | Present in `.env`? | Present in `.env.example`? | Used By | Required for Launch? |
|---|---|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | **YES** | **YES** | Mobile & Web Supabase Client | **CRITICAL** |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | **YES** | **YES** | Mobile & Web Supabase Client | **CRITICAL** |
| `SUPABASE_SERVICE_ROLE_KEY` | **YES** | **YES** | Edge Functions / Backend | **CRITICAL** |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Optional | **YES** | Native Maps Autocomplete | Recommended |
| `GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL`| Optional | **YES** | Web SEO Analytics Dashboard | Post-launch |
| `BING_VERIFICATION_TOKEN` | Optional | **YES** | Web Bing Webmaster Tools | Post-launch |
| `INDEXNOW_KEY` | Optional | **YES** | Web Instant Indexing | Post-launch |
