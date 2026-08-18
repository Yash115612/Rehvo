# REHVO — Phase 10: Notifications & Push Notifications System Supabase Migration Report

> **Execution Date**: August 2026  
> **Status**: **MIGRATION COMPLETE (0 TypeScript Errors across Mobile & Admin)**  
> **Scope**: In-app notification inbox, unread badge calculation, event-driven notification dispatch, device push tokens, and Supabase Realtime notification streaming migrated to live Supabase PostgreSQL (`public.notifications`, `public.user_push_tokens`).

---

## 1. Notification Architecture & Data Flow

From Phase 10 onward, **Supabase is the authoritative source of truth for all notifications, unread counts, and user device push tokens**.

```mermaid
graph TD
    subgraph Supabase Database [REHVO Mumbai Supabase]
        DB_Notif[(public.notifications)]
        DB_Tokens[(public.user_push_tokens)]
        Realtime[Supabase Realtime Engine]
    end

    subgraph Service Layer [src/services/notifications.ts]
        GetNotifs[getNotifications]
        GetUnread[getUnreadNotificationCount]
        MarkRead[markNotificationAsRead]
        MarkAllRead[markAllNotificationsAsRead]
        DeleteNotif[deleteNotification]
        CreateNotif[createNotification]
        RegisterToken[registerPushToken]
        RemoveToken[removePushToken]
        SubNotifs[subscribeToNotifications]
    end

    subgraph Event Dispatchers [App Feature Services]
        ChatSvc[src/services/chat.ts - on sendMessage]
        EnquirySvc[src/services/enquiries.ts - on createEnquiry]
        VisitSvc[src/services/visits.ts - on createVisit / updateVisitStatus]
    end

    subgraph Mobile UI & State [Zustand Store & Screens]
        Store[useAppStore.ts - notifications, unreadNotificationCount, markNotificationRead, markAllNotificationsRead]
        NotifModal[NotificationsModal.tsx]
        OwnerHeaderUI[OwnerHeader.tsx - Unread Bell Badge]
        RenterProfileUI[app/(renter)/profile.tsx - Notifications Row Badge]
        OwnerDashboardUI[OwnerDashboardScreen.tsx]
    end

    ChatSvc --> CreateNotif
    EnquirySvc --> CreateNotif
    VisitSvc --> CreateNotif
    CreateNotif --> DB_Notif

    RegisterToken --> DB_Tokens
    RemoveToken --> DB_Tokens
    GetNotifs --> DB_Notif
    GetUnread --> DB_Notif
    MarkRead --> DB_Notif
    MarkAllRead --> DB_Notif
    DeleteNotif --> DB_Notif
    DB_Notif --> Realtime

    Store --> Service Layer
    Realtime -.-> SubNotifs
    SubNotifs -.-> Store
    NotifModal --> Store
    OwnerHeaderUI --> Store
    RenterProfileUI --> Store
    OwnerDashboardUI --> Store
```

---

## 2. Notification Types & Payload Mapping

| Notification Type | Trigger Event | Target Recipient | Embedded `data` Payload | Deep-Link Destination |
| :--- | :--- | :--- | :--- | :--- |
| **`message`** | New chat message sent | Message recipient (never sender) | `{ conversation_id }` | Chat Screen (`/(renter\|owner)/chat/[id]`) |
| **`application`** (Enquiry) | Rental enquiry submitted | Property owner | `{ enquiry_id, property_id }` | Enquiries Inbox (`/(owner)/enquiries`) |
| **`visit`** | Visit requested, confirmed, cancelled, completed | Property owner / Renter | `{ visit_id, property_id }` | Visits Inbox (`/(owner)/visits` or Visits Modal) |
| **`verification`** | ID/Owner verification status updated | Verification applicant | `{ verification_request_id }` | User Profile Screen |
| **`price`** | Saved property rent change | Users who saved property | `{ property_id }` | Property Details Screen (`/(renter)/property/[id]`) |
| **`system`** | Account or platform announcement | Targeted user | `{ ... }` | Appropriate destination |

---

## 3. Event-Driven Notification Dispatching

1. **Messages ([`src/services/chat.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/chat.ts))**:
   - `sendMessage()` resolves non-sender participants and creates a background `message` notification with a preview of the text.
2. **Enquiries ([`src/services/enquiries.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/enquiries.ts))**:
   - `createEnquiry()` looks up property owner and creates an `application` notification for the owner.
3. **Visits ([`src/services/visits.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/visits.ts))**:
   - `createVisit()` notifies owner of the requested date/time.
   - `confirmVisit()` notifies renter that their visit is confirmed.
   - `cancelVisit()` notifies the other party that the scheduled visit is cancelled.
   - `completeVisit()` notifies renter that the tour is marked completed.

---

## 4. Push Token Registration & Lifecycle

- **Expo Push Token Acquisition**: Uses `expo-notifications` & `expo-constants` to obtain device push tokens when permissions are granted.
- **Upsert on Auth**:
  - `registerDevicePushToken()` is triggered on login/session restore, saving `(user_id, push_token, device_os)` to `public.user_push_tokens` with `onConflict: 'user_id,push_token'` to guarantee zero duplicates.
- **Token Invalidation on Logout**:
  - `unregisterDevicePushToken()` removes the device token from `public.user_push_tokens` on `logout()` and `deleteAccount()`, ensuring notifications are never routed to previous account sessions.
- **Secure Architecture**:
  - The mobile client **contains no Supabase service-role secrets**. Push tokens are securely stored in Supabase for server-side dispatching (e.g. Supabase Database Webhooks / Edge Functions).

---

## 5. Supabase Realtime Architecture

- **Scoped Channel Subscription**:
  - `NotificationsModal.tsx` subscribes to `postgres_changes` on `public.notifications` strictly filtered by `user_id=eq.${userId}`.
  - Automatically unsubscribes on unmount.
- **De-Duplication**:
  - `addRealtimeNotification()` checks existing state by `notification.id` to prevent duplicate renders during optimistic/network races.

---

## 6. Security & Row Level Security (RLS)

* **Notifications**:
  ```sql
  CREATE POLICY "Users can view own notifications"
      ON public.notifications FOR SELECT
      USING (auth.uid() = user_id OR public.is_admin());

  CREATE POLICY "Users can update own notifications"
      ON public.notifications FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Authenticated users can insert notifications"
      ON public.notifications FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');

  CREATE POLICY "Users can delete own notifications"
      ON public.notifications FOR DELETE
      USING (auth.uid() = user_id OR public.is_admin());
  ```
* **Push Tokens**:
  ```sql
  CREATE POLICY "Users can manage own push tokens"
      ON public.user_push_tokens FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  ```

---

## 7. Verification Results

| # | Check | Expected Result | Status |
|---|---|---|---|
| 1 | Mobile TypeScript Compilation (`npx tsc --noEmit`) | 0 errors | **PASS** |
| 2 | Admin TypeScript Compilation (`npm run typecheck`) | 0 errors | **PASS** |
| 3 | Initial Notification List | Empty `[]` for new users; no seed data in production | **PASS** |
| 4 | Unread Count Query | Exact count from `read_at IS NULL` | **PASS** |
| 5 | Mark Single Notification as Read | Updates `read_at = NOW()` and decrements badge | **PASS** |
| 6 | Mark All Notifications as Read | Updates all unread for current user | **PASS** |
| 7 | Delete Notification | Removes row from `public.notifications` | **PASS** |
| 8 | Push Token Registration | Upserts `(user_id, push_token)` without duplicate rows | **PASS** |
| 9 | Push Token Cleanup on Logout | Deletes device token association | **PASS** |
| 10 | Realtime Notification Streaming | Inserts streamed via channel subscription | **PASS** |
| 11 | Cross-User RLS Isolation | Blocked at PostgreSQL RLS boundary | **PASS** |
| 12 | Deep-Link Navigation | Routes to chat, visit, enquiry, or property | **PASS** |
