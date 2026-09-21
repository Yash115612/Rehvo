# REHVO V24 — API, Services & Edge Functions Audit

**Version:** REHVO V24.5 Architectural Audit  
**Scope:** 61 Mobile Client Services (`src/services/`), 25 Next.js Web Routes, 10 Supabase Edge Functions  
**Objective:** End-to-end API inventory, authentication mapping, and broker dependency elimination  

---

## 1. Executive Summary

| Layer | Component Count | Purpose | Broker Dependency |
|---|---|---|---|
| **Mobile Client Services** | **61 Services** | Supabase SDK, AI Photogrammetry, Push, Chat, KYC | **1 Service (`broker.ts`)** |
| **Next.js Web Routes** | **25 Routes** | XML Sitemaps, SEO APIs, Real Estate Landing Pages | **0 Endpoints (100% Zero-Broker)** |
| **Supabase Edge Functions** | **10 Functions** | Notification scheduler, OTP verification, KYC, cleanup | **0 Functions (100% Role Agnostic)** |

---

## 2. Mobile Client Services (61 Services)

| # | Service Name | File Path | Scope | Target User Role | Broker Impact |
|---|---|---|---|---|---|
| 1 | `adminCms.ts` | `src/services/adminCms.ts` | Shared / Platform | Shared / Platform | None |
| 2 | `agreements.ts` | `src/services/agreements.ts` | Owner Centric | Owner Centric | None |
| 3 | `analyticsEngine.ts` | `src/services/analyticsEngine.ts` | Shared / Platform | Shared / Platform | None |
| 4 | `apartmentSuggestions.ts` | `src/services/apartmentSuggestions.ts` | Shared / Platform | Shared / Platform | None |
| 5 | `appUpdateService.ts` | `src/services/appUpdateService.ts` | Shared / Platform | Shared / Platform | None |
| 6 | `auth.ts` | `src/services/auth.ts` | Shared / Platform | Shared / Platform | None |
| 7 | `broker.ts` | `src/services/broker.ts` | **Broker Only** | **Broker Only** | **DEPRECATE / GATE** |
| 8 | `cameraService.ts` | `src/services/cameraService.ts` | Shared / Platform | Shared / Platform | None |
| 9 | `campaigns.ts` | `src/services/campaigns.ts` | Shared / Platform | Shared / Platform | None |
| 10 | `cashbackEngine.ts` | `src/services/cashbackEngine.ts` | Shared / Platform | Shared / Platform | None |
| 11 | `chat.ts` | `src/services/chat.ts` | Shared / Platform | Shared / Platform | None |
| 12 | `commuteEngine.ts` | `src/services/commuteEngine.ts` | Renter Centric | Renter Centric | None |
| 13 | `documentCenter.ts` | `src/services/documentCenter.ts` | Shared / Platform | Shared / Platform | None |
| 14 | `enquiries.ts` | `src/services/enquiries.ts` | Shared / Platform | Shared / Platform | None |
| 15 | `flatmateCompatibility.ts` | `src/services/flatmateCompatibility.ts` | Renter Centric | Renter Centric | None |
| 16 | `flatmates.ts` | `src/services/flatmates.ts` | Renter Centric | Renter Centric | None |
| 17 | `flatmatesData.ts` | `src/services/flatmatesData.ts` | Renter Centric | Renter Centric | None |
| 18 | `kyc.ts` | `src/services/kyc.ts` | Owner Centric | Owner Centric | None |
| 19 | `localNotificationEngine.ts` | `src/services/localNotificationEngine.ts` | Shared / Platform | Shared / Platform | None |
| 20 | `location.ts` | `src/services/location.ts` | Shared / Platform | Shared / Platform | None |
| 21 | `maintenance.ts` | `src/services/maintenance.ts` | Shared / Platform | Shared / Platform | None |
| 22 | `mapsEngine.ts` | `src/services/mapsEngine.ts` | Shared / Platform | Shared / Platform | None |
| 23 | `nearbyEngine.ts` | `src/services/nearbyEngine.ts` | Renter Centric | Renter Centric | None |
| 24 | `notificationDeepLinks.ts` | `src/services/notificationDeepLinks.ts` | Shared / Platform | Shared / Platform | None |
| 25 | `notificationTriggers.ts` | `src/services/notificationTriggers.ts` | Shared / Platform | Shared / Platform | None |
| 26 | `notifications.ts` | `src/services/notifications.ts` | Shared / Platform | Shared / Platform | None |
| 27 | `ocrEngine.ts` | `src/services/ocrEngine.ts` | Shared / Platform | Shared / Platform | None |
| 28 | `offlineEngine.ts` | `src/services/offlineEngine.ts` | Shared / Platform | Shared / Platform | None |
| 29 | `ownerBusinessSuite.ts` | `src/services/ownerBusinessSuite.ts` | Owner Centric | Owner Centric | None |
| 30 | `ownerEcosystem.ts` | `src/services/ownerEcosystem.ts` | Owner Centric | Owner Centric | None |
| 31 | `paymentGateway.ts` | `src/services/paymentGateway.ts` | Shared / Platform | Shared / Platform | None |
| 32 | `payments.ts` | `src/services/payments.ts` | Shared / Platform | Shared / Platform | None |
| 33 | `performanceEngine.ts` | `src/services/performanceEngine.ts` | Shared / Platform | Shared / Platform | None |
| 34 | `profile.ts` | `src/services/profile.ts` | Shared / Platform | Shared / Platform | None |
| 35 | `properties.ts` | `src/services/properties.ts` | Shared / Platform | Shared / Platform | None |
| 36 | `propertyCompare.ts` | `src/services/propertyCompare.ts` | Owner Centric | Owner Centric | None |
| 37 | `propertySharing.ts` | `src/services/propertySharing.ts` | Owner Centric | Owner Centric | None |
| 38 | `pushDispatcher.ts` | `src/services/pushDispatcher.ts` | Shared / Platform | Shared / Platform | None |
| 39 | `pushNotifications.ts` | `src/services/pushNotifications.ts` | Shared / Platform | Shared / Platform | None |
| 40 | `realtimeSync.ts` | `src/services/realtimeSync.ts` | Shared / Platform | Shared / Platform | None |
| 41 | `receipts.ts` | `src/services/receipts.ts` | Shared / Platform | Shared / Platform | None |
| 42 | `recommendations.ts` | `src/services/recommendations.ts` | Shared / Platform | Shared / Platform | None |
| 43 | `referralEngine.ts` | `src/services/referralEngine.ts` | Shared / Platform | Shared / Platform | None |
| 44 | `rehvoAI.ts` | `src/services/rehvoAI.ts` | Shared / Platform | Shared / Platform | None |
| 45 | `rentEstimator.ts` | `src/services/rentEstimator.ts` | Shared / Platform | Shared / Platform | None |
| 46 | `rentalOperations.ts` | `src/services/rentalOperations.ts` | Shared / Platform | Shared / Platform | None |
| 47 | `residentServices.ts` | `src/services/residentServices.ts` | Shared / Platform | Shared / Platform | None |
| 48 | `rewards.ts` | `src/services/rewards.ts` | Shared / Platform | Shared / Platform | None |
| 49 | `safety.ts` | `src/services/safety.ts` | Shared / Platform | Shared / Platform | None |
| 50 | `saved.ts` | `src/services/saved.ts` | Shared / Platform | Shared / Platform | None |
| 51 | `search.ts` | `src/services/search.ts` | Renter Centric | Renter Centric | None |
| 52 | `securityEngine.ts` | `src/services/securityEngine.ts` | Shared / Platform | Shared / Platform | None |
| 53 | `smartMaps.ts` | `src/services/smartMaps.ts` | Shared / Platform | Shared / Platform | None |
| 54 | `smartSearch.ts` | `src/services/smartSearch.ts` | Renter Centric | Renter Centric | None |
| 55 | `societyPass.ts` | `src/services/societyPass.ts` | Shared / Platform | Shared / Platform | None |
| 56 | `storage.ts` | `src/services/storage.ts` | Shared / Platform | Shared / Platform | None |
| 57 | `supportService.ts` | `src/services/supportService.ts` | Shared / Platform | Shared / Platform | None |
| 58 | `trustSafety.ts` | `src/services/trustSafety.ts` | Shared / Platform | Shared / Platform | None |
| 59 | `visits.ts` | `src/services/visits.ts` | Shared / Platform | Shared / Platform | None |
| 60 | `voiceAI.ts` | `src/services/voiceAI.ts` | Shared / Platform | Shared / Platform | None |
| 61 | `wallet.ts` | `src/services/wallet.ts` | Shared / Platform | Shared / Platform | None |

---

## 3. Next.js Web API Routes (25 Endpoints)

The Next.js web application is entirely dedicated to organic zero-brokerage search acquisition, programmatic SEO, and Google Search Console compliance.

| # | Endpoint Route | File Path | HTTP Method | Functionality | Broker Dependency |
|---|---|---|---|---|---|
| 1 | `/BingSiteAuth.xml` | `web/src/app/BingSiteAuth.xml/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 2 | `/api/seo/core-web-vitals` | `web/src/app/api/seo/core-web-vitals/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 3 | `/api/seo/instant-index` | `web/src/app/api/seo/instant-index/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 4 | `/api/seo/overview` | `web/src/app/api/seo/overview/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 5 | `/api/seo/rich-results` | `web/src/app/api/seo/rich-results/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 6 | `/api/seo/status` | `web/src/app/api/seo/status/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 7 | `/api/seo/top-pages` | `web/src/app/api/seo/top-pages/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 8 | `/api/seo/top-queries` | `web/src/app/api/seo/top-queries/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 9 | `/e58f2d5930b847849e71e7d890538a7c.txt` | `web/src/app/e58f2d5930b847849e71e7d890538a7c.txt/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 10 | `/google1234567890abcdef.html` | `web/src/app/google1234567890abcdef.html/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 11 | `/image-sitemap.xml` | `web/src/app/image-sitemap.xml/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 12 | `/sitemap-blogs.xml` | `web/src/app/sitemap-blogs.xml/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 13 | `/sitemap-cities.xml` | `web/src/app/sitemap-cities.xml/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 14 | `/sitemap-commercial.xml` | `web/src/app/sitemap-commercial.xml/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 15 | `/sitemap-flatmates.xml` | `web/src/app/sitemap-flatmates.xml/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 16 | `/sitemap-index.xml` | `web/src/app/sitemap-index.xml/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 17 | `/sitemap-localities.xml` | `web/src/app/sitemap-localities.xml/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 18 | `/sitemap-pages.xml` | `web/src/app/sitemap-pages.xml/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 19 | `/sitemap-pg.xml` | `web/src/app/sitemap-pg.xml/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 20 | `/sitemap-properties.xml` | `web/src/app/sitemap-properties.xml/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 21 | `/sitemap-rent-pages.xml` | `web/src/app/sitemap-rent-pages.xml/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 22 | `/sitemap-reports.xml` | `web/src/app/sitemap-reports.xml/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 23 | `/sitemap-showreels.xml` | `web/src/app/sitemap-showreels.xml/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 24 | `/sitemap-stories.xml` | `web/src/app/sitemap-stories.xml/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |
| 25 | `/video-sitemap.xml` | `web/src/app/video-sitemap.xml/route.ts` | GET | Programmatic SEO / Sitemap / Web Vitals | None (Zero Broker) |

---

## 4. Supabase Deno Edge Functions (10 Functions)

All backend background tasks and real-time triggers execute in Supabase Edge Functions built in TypeScript/Deno.

| # | Function Name | Directory | Trigger Type | Description | Role Scope |
|---|---|---|---|---|---|
| 1 | `otp-verify` | `supabase/functions/otp-verify` | HTTPS POST | SMS / WhatsApp OTP authentication | All Users |
| 2 | `kyc-process` | `supabase/functions/kyc-process` | Webhook / Storage | Aadhaar OCR & biometric face matching | Owner & Renter |
| 3 | `send-push` | `supabase/functions/send-push` | Database Webhook | Instant Expo push notification dispatch | All Users |
| 4 | `send-push-notification` | `supabase/functions/send-push-notification` | Database Webhook | Direct APNs / FCM delivery | All Users |
| 5 | `send-bulk-notification` | `supabase/functions/send-bulk-notification` | Admin / Cron | Mass broadcast messaging | All Users |
| 6 | `notification-scheduler` | `supabase/functions/notification-scheduler` | pg_cron | Scheduled viewing & payment reminders | All Users |
| 7 | `notification-fanout` | `supabase/functions/notification-fanout` | Database Webhook | High-throughput notification queue worker | All Users |
| 8 | `visit-reminders` | `supabase/functions/visit-reminders` | pg_cron (Daily) | In-person property visit reminders | Owner & Renter |
| 9 | `image-cleanup` | `supabase/functions/image-cleanup` | pg_cron (Weekly) | Orphaned storage object garbage collector | System |
| 10 | `account-cleanup` | `supabase/functions/account-cleanup` | pg_cron (Monthly) | GDPR / DPDP soft-deleted account purger | System |

---

## 5. API Broker Isolation Conclusion

The backend API surface has **virtually zero broker entanglement**:
1. Only **1 client service** (`src/services/broker.ts`) interacts with broker data.
2. Web API routes have **zero broker logic**.
3. Edge functions have **zero broker logic**.
Gating `src/services/broker.ts` achieves **100% backend isolation** for the Owner-Only V1 launch.
