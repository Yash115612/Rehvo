# REHVO — Phase 9: Chat & Realtime Messaging System Supabase Migration Report

> **Execution Date**: August 2026  
> **Status**: **MIGRATION COMPLETE (0 TypeScript Errors across Mobile & Admin)**  
> **Scope**: In-app direct messaging, conversation threads, participants, and Supabase Realtime message subscription migration from mock state to live Supabase PostgreSQL (`public.conversations`, `public.conversation_participants`, `public.messages`)

---

## 1. Chat Architecture & Data Flow

From Phase 9 onward, **Supabase is the authoritative source of truth for all conversations, messages, participant states, and unread counts**.

```mermaid
graph TD
    subgraph Supabase Backend [REHVO Mumbai Supabase]
        DB_Conv[(public.conversations)]
        DB_Part[(public.conversation_participants)]
        DB_Msg[(public.messages)]
        Realtime[Supabase Realtime Engine]
    end

    subgraph Service Layer [src/services/chat.ts]
        GetConvs[getConversations]
        GetConvById[getConversationById]
        GetMsgs[getMessages]
        GetOrCreatePropConv[getOrCreatePropertyConversation]
        GetOrCreateFmConv[getOrCreateFlatmateConversation]
        SendMsg[sendMessage]
        MarkRead[markConversationAsRead]
        SubMsgs[subscribeToMessages]
        SubConvs[subscribeToConversations]
    end

    subgraph Mobile UI & State [Zustand Store & Screens]
        Store[useAppStore.ts - conversations, fetchConversations, sendMessage, addRealtimeMessage, markConversationAsRead]
        RenterChatList[RenterChatListScreen.tsx / app/(renter)/chat/index.tsx]
        OwnerChatList[OwnerChatListScreen.tsx / app/(owner)/chat/index.tsx]
        SharedConv[SharedConversationScreen.tsx / app/(renter|owner)/chat/[id].tsx]
        PropDetails[PropertyDetailsScreen.tsx / PropertyBottomBar.tsx]
        FlatmateDetails[FlatmateDetailsScreen.tsx]
    end

    GetOrCreatePropConv --> DB_Conv
    GetOrCreatePropConv --> DB_Part
    GetOrCreateFmConv --> DB_Conv
    GetOrCreateFmConv --> DB_Part
    SendMsg --> DB_Msg
    MarkRead --> DB_Part
    GetConvs --> DB_Conv
    GetMsgs --> DB_Msg
    DB_Msg --> Realtime

    Store --> Service Layer
    Realtime -.-> SubMsgs
    SubMsgs -.-> Store
    RenterChatList --> Store
    OwnerChatList --> Store
    SharedConv --> Store
    PropDetails --> Store
    FlatmateDetails --> Store
```

---

## 2. Supported Conversation Contexts

### Context A: User $\leftrightarrow$ Property Lister
* Triggered from: **Property Details** (`onChatWithOwner`) or **Enquiry Sheet** (`handleOpenChat`).
* Resolves `owner_id` server-side from `public.properties.owner_id`.
* Prevents self-chat (`user_id === property.owner_id`).
* Retains `property_id` and optional `enquiry_id` on `public.conversations`.
* Renders compact Property Context Card with title, locality, and rent with direct navigation to Property Details.

### Context B: User $\leftrightarrow$ Flatmate Connection
* Triggered from: **Flatmate Details** (`handleStartChat`).
* Resolves flatmate user account server-side from `public.flatmate_profiles.user_id`.
* Prevents self-chat (`user_id === flatmate.user_id`).
* Retains `flatmate_profile_id` on `public.conversations`.
* Renders compact Flatmate Roommate Card with budget, locality, and room preference with direct navigation to Flatmate Profile.

---

## 3. Database Triggers & Automations

Postgres trigger `handle_new_message_sent` deployed in `005_chat.sql` automates message lifecycle management:
1. Updates `conversations.last_message_text = NEW.message`.
2. Updates `conversations.last_message_at = NEW.created_at`.
3. Updates `conversations.updated_at = NOW()`.
4. Automatically increments `unread_count` on `public.conversation_participants` for all participants except `NEW.sender_id`.

---

## 4. Supabase Realtime Architecture & Lifecycle

* **Per-Conversation Subscription**:
  - When opening a chat thread, `SharedConversationScreen.tsx` creates a scoped channel on `public.messages` filtered strictly to `conversation_id=eq.${conversationId}`.
  - Automatically unsubscribes on screen unmount to prevent memory leaks and duplicate listeners.
* **Stable Message Reconciliation**:
  - Optimistic UI appends a temporary message with ID `temp_${Date.now()}` immediately.
  - When the Supabase insertion succeeds or Realtime broadcast fires, the message is reconciled and replaced seamlessly by its persistent UUID without duplicate bubbles or UI jumps.
* **User-Level Invalidation**:
  - `RenterChatListScreen.tsx` and `OwnerChatListScreen.tsx` listen for `conversation_participants` changes for `user_id=eq.${userId}` to update unread badge counts and conversation ordering in realtime.

---

## 5. Security & Row Level Security (RLS)

* **Conversations**:
  ```sql
  CREATE POLICY "Conversation participants and admins can view conversations"
      ON public.conversations FOR SELECT
      USING (
          EXISTS (
              SELECT 1 FROM public.conversation_participants
              WHERE conversation_participants.conversation_id = conversations.id
                AND conversation_participants.user_id = auth.uid()
          ) OR public.is_admin()
      );
  ```
* **Messages**:
  ```sql
  CREATE POLICY "Participants can view messages"
      ON public.messages FOR SELECT
      USING (
          EXISTS (
              SELECT 1 FROM public.conversation_participants
              WHERE conversation_participants.conversation_id = messages.conversation_id
                AND conversation_participants.user_id = auth.uid()
          ) OR public.is_admin()
      );

  CREATE POLICY "Participants can send messages"
      ON public.messages FOR INSERT
      WITH CHECK (
          auth.uid() = sender_id AND
          EXISTS (
              SELECT 1 FROM public.conversation_participants
              WHERE conversation_participants.conversation_id = messages.conversation_id
                AND conversation_participants.user_id = auth.uid()
          )
      );
  ```
* **Enforcement**:
  - Renters and owners only receive and view messages for threads where they are verified participants.
  - Unauthorized direct URL/route attempts display an access denied message without leaking message or participant existence.

---

## 6. Session Isolation & Cleanup

* **Zero Mock Conversations**: Initial `conversations` defaults to `[]`. `SEED_CONVERSATIONS` is completely removed from production sessions.
* **Session Lifecycle**:
  - `logout()` and `deleteAccount()` reset `conversations: []` and `activeConversationId: null`.
  - `login()` and `switchRole()` trigger `fetchConversations()` to query the active user's threads.

---

## 7. Screen Integrations

| Screen / Component | File Path | Migration Status |
| :--- | :--- | :--- |
| **Shared Chat Screen** | [`src/components/chat/SharedConversationScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/chat/SharedConversationScreen.tsx) | Live chat thread with realtime messaging, quick replies, and context cards |
| **Renter Chat List** | [`src/components/chat/RenterChatListScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/chat/RenterChatListScreen.tsx) | Live list of renter conversations with search, unread badges, and pull-to-refresh |
| **Owner Chat List** | [`src/components/chat/OwnerChatListScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/chat/OwnerChatListScreen.tsx) | Live list of host conversations with search and pull-to-refresh |
| **Property Details Entry** | [`src/components/property/PropertyDetailsScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/property/PropertyDetailsScreen.tsx) | Connected bottom bar "Chat with Host" button |
| **Flatmate Details Entry** | [`src/components/flatmates/FlatmateDetailsScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/flatmates/FlatmateDetailsScreen.tsx) | Connected bottom bar "Chat with Flatmate" button |
| **Enquiries Sheet Entry** | [`src/components/profile/EnquiriesModal.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/profile/EnquiriesModal.tsx) | Connected "Open Chat" button retaining `enquiry_id` |

---

## 8. Verification Results

| # | Check | Expected Result | Status |
|---|---|---|---|
| 1 | Mobile TypeScript Compilation (`npx tsc --noEmit`) | 0 errors | **PASS** |
| 2 | Admin TypeScript Compilation (`npm run typecheck`) | 0 errors | **PASS** |
| 3 | Initial Conversation List | Empty `[]` for new users | **PASS** |
| 4 | Property Chat Initiation | Reuses existing or creates new conversation with property context | **PASS** |
| 5 | Flatmate Chat Initiation | Reuses existing or creates new conversation with flatmate context | **PASS** |
| 6 | Self-Chat Prevention | Blocked when `user_id === owner_id` | **PASS** |
| 7 | Send Message | Persisted in `public.messages` with authenticated `sender_id` | **PASS** |
| 8 | Unread Count & Last Message | Updated via trigger and cleared on open | **PASS** |
| 9 | Realtime Message Streaming | Incoming messages received via channel subscription without refresh | **PASS** |
| 10 | Duplicate Message Prevention | Optimistic temp IDs reconciled with server UUIDs | **PASS** |
| 11 | Direct Route Security | Blocks unauthorized conversation access gracefully | **PASS** |
| 12 | Session Isolation | Cleared on logout; reloaded on login | **PASS** |
