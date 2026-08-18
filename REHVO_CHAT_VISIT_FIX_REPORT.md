# REHVO — In-App Chat & Schedule Visit Fix Report

**Date**: August 18, 2026  
**Auditor**: Antigravity Assistant  
**Backend**: Supabase Production Cloud (Mumbai / `ap-south-1`) — `https://xoskechmxzgfajkfpssv.supabase.co`  
**Mobile Environment**: Expo React Native (iOS / Android / Expo Go)  
**APK Rebuild Required**: **NO** (All changes are database migrations, RLS policies, RPCs, and JS service layer logic)

---

## 1. Executive Summary & Root Cause Analysis

### Part A: In-App Chat System Failure
1. **PostgreSQL RLS Infinite Recursion (Error `42P17`)**:
   - In [`009_rls_policies.sql`](file:///Users/yashchoudhary/Downloads/rehvo/supabase/migrations/009_rls_policies.sql), the RLS policy on `public.conversation_participants` was:
     `USING (conversation_id IN (SELECT cp.conversation_id FROM public.conversation_participants cp WHERE cp.user_id = auth.uid()))`
   - Evaluating this policy recursively queried `public.conversation_participants`, causing PostgreSQL to abort with `42P17: infinite recursion detected in policy for relation "conversation_participants"`.
2. **Missing `INSERT` & `UPDATE` Policies**:
   - `public.conversations` and `public.conversation_participants` lacked explicit `FOR INSERT` and `FOR UPDATE` RLS policies.
   - When users tried to initiate a conversation, PostgREST blocked creation with `42501: new row violates row-level security policy for table "conversations"`.
3. **Database Column Mismatch in Service Layer**:
   - In [`src/services/chat.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/chat.ts), queries selected `properties(..., rent, ...)` instead of the PostgreSQL column `price`, resulting in `42703: column properties_1.rent does not exist`.

### Part B: Schedule Visit System Failure
1. **Database Column Mismatch in Queries**:
   - In [`src/services/visits.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/visits.ts), queries selected `properties(..., rent, ...)` instead of `price`.
   - Any attempt to book a visit or fetch scheduled visits triggered Postgres error `42703: column properties_1.rent does not exist`.
2. **Missing `isOwner` Validation on Backend**:
   - Renter-to-Owner booking was susceptible to client-side owner spoofing without database-level resolution from `public.properties.owner_id`.

---

## 2. Solutions Implemented

### 1. Database Migration: `014_chat_and_visits_rls.sql`
- **Non-Recursive Helper Function**:
  Created `is_conversation_participant(p_conversation_id, p_user_id)` with `SECURITY DEFINER` and `SET search_path = public` to cleanly break RLS recursion.
- **Complete RLS Policies**:
  - `public.conversations`: SELECT, INSERT, UPDATE, DELETE policies scoped to verified participants and admins.
  - `public.conversation_participants`: SELECT, INSERT, UPDATE, DELETE policies allowing authenticated users to manage participation and read/update their unread counts.
  - `public.messages`: SELECT, INSERT, UPDATE, DELETE policies ensuring only verified conversation participants can send and read messages.
  - `public.visits`: SELECT, INSERT, UPDATE, DELETE policies granting access exclusively to the renter (`user_id`) and property owner (`owner_id`).
- **Atomic Conversation Creator RPC**:
  Implemented `create_or_get_conversation(p_property_id, p_flatmate_profile_id, p_enquiry_id, p_recipient_id)`:
  - Resolves `owner_id` directly from `public.properties` or `flatmate_profiles` on the server.
  - Enforces self-chat prevention (`auth.uid() != target_user_id`).
  - Checks for existing conversation between the two users for that listing.
  - Atomically creates `conversations` row + both `conversation_participants` rows inside a single database transaction.
- **Security Definer Trigger**:
  Updated `handle_new_message_sent()` trigger function with `SECURITY DEFINER` so that incoming messages increment the recipient's `unread_count` without tripping RLS.
- **Realtime Publications**:
  Replication enabled for `conversations`, `conversation_participants`, `messages`, and `visits` on `supabase_realtime`.

### 2. Service Layer Updates
- **[`src/services/chat.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/chat.ts)**:
  - Replaced multi-step conversation creation with `supabase.rpc('create_or_get_conversation')`.
  - Replaced all `properties(rent)` selections with `properties(price)` and mapped `rent: prop?.price ?? prop?.rent`.
- **[`src/services/visits.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/visits.ts)**:
  - Replaced all `properties(rent)` selections with `properties(price)`.
  - Added strict date validation preventing past-date visit bookings.
- **[`src/components/chat/SharedConversationScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/chat/SharedConversationScreen.tsx)**:
  - Removed fallback `properties[0]` to ensure real property details are always rendered.

---

## 3. End-to-End Test Matrix & Verification

Automated live database validation matrix executed via [`test_chat_and_visits_e2e.js`](file:///Users/yashchoudhary/.gemini/antigravity/brain/15a6164c-db6f-4ac8-a471-38c7119d2e02/scratch/test_chat_and_visits_e2e.js) with authenticated **Renter User A** (`rehvo.beta.test.1787039573606@gmail.com`) and **Owner User B** (`rehvo.beta.test.1787039625735@gmail.com`):

### Part A: Chat System Results

| Test Scenario | Action / Validation | Live Database Result | Status |
|---|---|---|:---:|
| **TEST 1: Conversation Creation** | Renter calls `create_or_get_conversation` | Atomically created conversation + 2 participants | **PASS** |
| **TEST 2: Owner Inbox View** | Owner queries received conversations | Owner sees new conversation with renter info | **PASS** |
| **TEST 3: Renter Sends Message** | Renter sends text message | Message row inserted in `public.messages` | **PASS** |
| **TEST 4: Message Delivery & Unread Trigger** | DB trigger runs upon message insert | `last_message_text` updated, owner's `unread_count = 1` | **PASS** |
| **TEST 5: Owner Reply & Mark Read** | Owner marks read (`unread_count = 0`) & replies | Reply inserted in `messages`, renter receives it | **PASS** |
| **TEST 6: Self-Chat Prevention** | Owner attempts chat on own listing | Backend rejects with `"Cannot start conversation with yourself"` | **PASS** |
| **TEST 7: RLS Privacy Isolation** | Unauthorized third-party queries messages | Supabase RLS returns 0 messages | **PASS** |

### Part B: Schedule Visit System Results

| Test Scenario | Action / Validation | Live Database Result | Status |
|---|---|---|:---:|
| **TEST 8: Visit Booking** | Renter books future visit on property | Row inserted in `public.visits` with `status = 'pending'` | **PASS** |
| **TEST 9: Owner Views Visits** | Owner fetches received visit requests | Owner views visit with renter profile & property details | **PASS** |
| **TEST 10: Owner Confirms Visit** | Owner updates status to `confirmed` | `public.visits` updated to `status = 'confirmed'` | **PASS** |
| **TEST 11: Renter Sees Confirmation** | Renter queries their scheduled visits | Renter views confirmed visit status | **PASS** |
| **TEST 12: Visit Status Lifecycle** | Owner advances visit to `completed` | `public.visits` updated to `status = 'completed'` | **PASS** |
| **TEST 13: Visit Privacy & RLS Isolation** | Unauthorized third-party queries visits | Supabase RLS returns 0 visits | **PASS** |

---

## 4. Compilation & Verification

- **Mobile TypeScript (`npx tsc --noEmit`)**: **0 errors**
- **Admin Web TypeScript (`cd admin && npm run typecheck`)**: **0 errors**
