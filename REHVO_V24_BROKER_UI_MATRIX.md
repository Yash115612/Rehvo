# REHVO V24.5 — Complete Broker UI & Codebase Dependency Matrix

**Objective:** Map every broker touchpoint across UI, UX, state, navigation, services, and database.  
**Launch Strategy:** Owner-Only Launch (V1) — Zero Deletion, Clean Gating.

---

## 1. Master Broker Dependency Matrix

| Item Name | Item Type | File Location | Used By | Dependency Layer | Launch Action for V1 |
|---|---|---|---|---|---|
| **`(broker)` Route Group** | Navigation Layout | [`app/(broker)/_layout.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(broker)/_layout.tsx) | Broker | Expo Router `Tabs` | **Gate / Disable in V1** |
| **`BrokerDashboard`** | Route Screen | [`app/(broker)/dashboard.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(broker)/dashboard.tsx) | Broker | `V4BrokerDashboardScreen` | **Gate / Hide in V1** |
| **`BrokerInventory`** | Route Screen | [`app/(broker)/inventory.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(broker)/inventory.tsx) | Broker | `V4BrokerInventoryScreen` | **Gate / Hide in V1** |
| **`BrokerClients`** | Route Screen | [`app/(broker)/clients.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(broker)/clients.tsx) | Broker | `V4BrokerClientsScreen` | **Gate / Hide in V1** |
| **`BrokerMessages`** | Route Screen | [`app/(broker)/messages.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(broker)/messages.tsx) | Broker | `V4BrokerMessagesScreen` | **Gate / Hide in V1** |
| **`BrokerProfile`** | Route Screen | [`app/(broker)/profile.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/app/(broker)/profile.tsx) | Broker | `V4BrokerProfileScreen` | **Gate / Hide in V1** |
| **`V4BrokerTopHeader`** | Navigation Component | [`src/components/v4/navigation/V4BrokerTopHeader.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/v4/navigation/V4BrokerTopHeader.tsx) | Broker | `brokerProfile`, `router` | **Archive / Retain for V2** |
| **`V4BrokerBottomNavigation`** | Navigation Component | [`src/components/v4/navigation/V4BrokerBottomNavigation.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/v4/navigation/V4BrokerBottomNavigation.tsx) | Broker | `brokerClients`, `brokerMetrics`| **Archive / Retain for V2** |
| **`V4BrokerDashboardScreen`** | Full Screen Component | [`src/components/v4/screens/V4BrokerDashboardScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/v4/screens/V4BrokerDashboardScreen.tsx) | Broker | `useAppStore`, `brokerMetrics` | **Archive / Retain for V2** |
| **`V4BrokerInventoryScreen`** | Full Screen Component | [`src/components/v4/screens/V4BrokerInventoryScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/v4/screens/V4BrokerInventoryScreen.tsx) | Broker | `properties`, `brokerProfile` | **Convert to Landlord Portfolio** |
| **`V4BrokerClientsScreen`** | Full Screen Component | [`src/components/v4/screens/V4BrokerClientsScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/v4/screens/V4BrokerClientsScreen.tsx) | Broker | `brokerClients`, `brokerService` | **Convert to Owner Tenant CRM** |
| **`V4BrokerMessagesScreen`** | Full Screen Component | [`src/components/v4/screens/V4BrokerMessagesScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/v4/screens/V4BrokerMessagesScreen.tsx) | Broker | `conversations`, `chatService` | **Archive / Retain for V2** |
| **`V4BrokerProfileScreen`** | Full Screen Component | [`src/components/v4/screens/V4BrokerProfileScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/v4/screens/V4BrokerProfileScreen.tsx) | Broker | `brokerProfile`, `supabase` | **Archive / Retain for V2** |
| **`Broker Option Card`** | Auth Component | [`src/components/v4/screens/V4RoleSelectionScreen.tsx`](file:///Users/yashchoudhary/Downloads/rehvo/src/components/v4/screens/V4RoleSelectionScreen.tsx#L79) | Auth Users | `setPendingAuthRole` | **Hide in V1 (Show Renter/Owner)** |
| **`brokerService`** | API & Local Service | [`src/services/broker.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/services/broker.ts) | Broker | `supabase`, `AsyncStorage` | **Retain (No API calls in V1)** |
| **`brokerProfile` State** | Zustand Store Slice | [`src/store/useAppStore.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/store/useAppStore.ts#L179) | Broker | `useAppStore` | **Keep as fallback null in V1** |
| **`brokerMetrics` State** | Zustand Store Slice | [`src/store/useAppStore.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/store/useAppStore.ts#L180) | Broker | `useAppStore` | **Keep as fallback null in V1** |
| **`brokerClients` State** | Zustand Store Slice | [`src/store/useAppStore.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/store/useAppStore.ts#L181) | Broker | `useAppStore` | **Keep as empty array in V1** |
| **`activeMode: 'broker'`** | Role Switcher | [`src/store/useAppStore.ts`](file:///Users/yashchoudhary/Downloads/rehvo/src/store/useAppStore.ts#L176) | System | `switchMode()`, `switchRole()` | **Clamp to 'owner'/'renter'** |
| **`broker_profiles` Table** | Database Table | `supabase/migrations/021_multi_role_auth_broker_ecosystem.sql` | Broker | Supabase PostgreSQL | **Keep Table (0 breaking changes)**|
| **`rehvo://broker/*`** | Deep Link Scheme | `app.json` | Deep Linking | Native App Linking | **Redirect to `rehvo://owner`** |

---

## 2. Marketing vs Functional Broker References

It is critical to distinguish between **Functional Broker Code** and **Marketing "Zero Brokerage" Text**:

1. **Functional Code (To Gate in V1)**:
   - Dedicated screens in `app/(broker)/` and `src/components/v4/screens/V4Broker*`
   - Broker role selection card in `V4RoleSelectionScreen.tsx`
   - Store active mode `'broker'` in `useAppStore.ts`
   
2. **Marketing & Value Proposition Text (Keep 100% in V1)**:
   - Text banners proclaiming *"Zero Brokerage Homes"* across web landing pages and mobile search filters.
   - Savings calculator in `V4HiddenCostCard.tsx` showing: *"You save ₹35,000 in brokerage fees by renting directly from verified owners on REHVO"*.
   - Filter chip `brokerage_free_only` in search feeds.

---

## 3. Impact Assessment for V1 Launch

- **Zero Breaking Changes**: Gating the broker portal requires updating only **1 routing guard** in `app/_layout.tsx` and filtering the role selection options array in `V4RoleSelectionScreen.tsx`.
- **Zero Database Operations**: No tables or columns need to be dropped.
- **Zero Loss of Work**: All 6 broker screens and services remain intact in the repository, ready to be activated in Version 2.
