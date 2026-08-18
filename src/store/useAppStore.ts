import { create } from 'zustand';
import {
  UserProfile,
  Property,
  PropertyFilter,
  Visit,
  Application,
  Conversation,
  Message,
  FlatmateProfile,
  PG,
  PGBed,
  SafetyReport,
  NotificationItem,
  NotificationPreferences,
  UserRole,
  Enquiry,
  PropertyType,
  FurnishingType,
  PropertyImage,
  OwnerDashboardMetrics,
} from '../types';
import { getItem, setItem, removeItem, clearAll } from '../lib/storage';
import { supabase } from '../lib/supabase';
import * as profileService from '../services/profile';
import * as authService from '../services/auth';
import * as propertyService from '../services/properties';
import * as flatmateService from '../services/flatmates';
import * as savedService from '../services/saved';
import * as enquiryService from '../services/enquiries';
import * as visitService from '../services/visits';
import * as chatService from '../services/chat';
import * as notificationsService from '../services/notifications';

interface AppState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  currentRole: UserRole;
  role: UserRole;
  switchRole: (newRole: UserRole) => void;
  blockedUserIds: string[];
  initialized: boolean;

  properties: Property[];
  myProperties: Property[];
  savedPropertyIds: string[];
  activeFilter: PropertyFilter;
  selectedProperty: Property | null;

  pgs: PG[];
  flatmates: FlatmateProfile[];
  myFlatmateProfile: FlatmateProfile | null;
  flatmateDraft: Partial<FlatmateProfile> | null;
  savedFlatmateIds: string[];

  visits: Visit[];
  applications: Application[];
  enquiries: Enquiry[];

  conversations: Conversation[];
  activeConversationId: string | null;

  notifications: NotificationItem[];
  unreadNotificationCount: number;
  notificationPrefs: NotificationPreferences;
  reports: SafetyReport[];

  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';

  initializeFromStorage: () => Promise<void>;
  login: (user: Partial<UserProfile>) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  deleteAccount: () => void;

  setProperties: (properties: Property[]) => void;
  fetchProperties: (filter?: Partial<PropertyFilter>) => Promise<Property[]>;
  fetchMyProperties: () => Promise<Property[]>;
  addProperty: (property: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'saves_count' | 'enquiries_count'>, imagesToUpload?: { uri: string; isCover?: boolean }[]) => Promise<{ success: boolean; data?: Property; error?: string }>;
  updateProperty: (id: string, data: Partial<Property>) => Promise<{ success: boolean; data?: Property; error?: string }>;
  deleteProperty: (id: string) => Promise<{ success: boolean; error?: string }>;
  fetchSavedIds: () => Promise<{ propertyIds: string[]; flatmateIds: string[] }>;
  toggleSaveProperty: (id: string) => Promise<void>;
  setFilter: (filter: Partial<PropertyFilter>) => void;
  resetFilter: () => void;
  setSelectedProperty: (property: Property | null) => void;
  recordPropertyView: (propertyId: string) => Promise<void>;

  ownerMetrics: OwnerDashboardMetrics | null;
  fetchOwnerMetrics: () => Promise<OwnerDashboardMetrics | null>;

  fetchVisits: () => Promise<Visit[]>;
  scheduleVisit: (visitData: {
    property_id: string;
    date: string;
    time: string;
    notes?: string;
    property_title?: string;
    property_image?: string;
    property_locality?: string;
    rent?: number;
    renter_id?: string;
    renter_name?: string;
    renter_phone?: string;
    owner_id?: string;
    owner_name?: string;
    status?: Visit['status'];
  }) => Promise<{ success: boolean; data?: Visit; error?: string }>;
  updateVisitStatus: (id: string, status: Visit['status']) => Promise<{ success: boolean; error?: string }>;
  confirmVisit: (id: string) => Promise<{ success: boolean; error?: string }>;
  cancelVisit: (id: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  completeVisit: (id: string) => Promise<{ success: boolean; error?: string }>;
  submitApplication: (appData: Omit<Application, 'id' | 'created_at' | 'updated_at'>) => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  fetchEnquiries: () => Promise<Enquiry[]>;
  submitEnquiry: (propertyId: string, message: string) => Promise<{ success: boolean; data?: Enquiry; error?: string }>;
  updateEnquiryStatus: (id: string, status: Enquiry['status']) => Promise<{ success: boolean; error?: string }>;

  fetchPublishedFlatmates: (filter?: any) => Promise<FlatmateProfile[]>;
  fetchMyFlatmateProfile: () => Promise<FlatmateProfile | null>;
  addFlatmateProfile: (profile: Omit<FlatmateProfile, 'id' | 'created_at' | 'updated_at'>, photoUri?: string) => Promise<{ success: boolean; data?: FlatmateProfile; error?: string }>;
  updateFlatmateProfile: (id: string, data: Partial<FlatmateProfile>, photoUri?: string) => Promise<{ success: boolean; data?: FlatmateProfile; error?: string }>;
  pauseFlatmateProfile: (id: string) => Promise<{ success: boolean; error?: string }>;
  resumeFlatmateProfile: (id: string) => Promise<{ success: boolean; error?: string }>;
  deleteFlatmateProfile: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleSaveFlatmate: (id: string) => Promise<void>;
  saveFlatmateDraft: (draft: Partial<FlatmateProfile>) => void;
  clearFlatmateDraft: () => void;
  fetchConversations: () => Promise<Conversation[]>;
  fetchConversationById: (id: string) => Promise<Conversation | null>;
  startOrGetFlatmateConversation: (flatmate: FlatmateProfile) => Promise<string>;
  startOrGetConversation: (property: Property, enquiryId?: string) => Promise<string>;
  sendMessage: (conversationId: string, text: string) => Promise<{ success: boolean; data?: Message; error?: string }>;
  addRealtimeMessage: (conversationId: string, message: Message) => void;
  setActiveConversationId: (id: string | null) => void;
  markConversationAsRead: (conversationId: string) => Promise<void>;

  updateBedStatus: (pgId: string, roomId: string, bedId: string, status: PGBed['status'], tenantName?: string, tenantPhone?: string) => void;

  reportProperty: (reportData: Omit<SafetyReport, 'id' | 'created_at' | 'status' | 'reporter_id' | 'reporter_name'>) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  verifyOwnerOrProperty: (id: string, type: 'owner' | 'property', status: 'VERIFIED' | 'REJECTED') => void;

  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
  fetchNotifications: () => Promise<NotificationItem[]>;
  fetchUnreadNotificationCount: () => Promise<number>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  registerDevicePushToken: () => Promise<void>;
  unregisterDevicePushToken: () => Promise<void>;
  addRealtimeNotification: (notification: NotificationItem) => void;
  updateNotificationPrefs: (prefs: Partial<NotificationPreferences>) => void;

  listingDraft: {
    property_type: PropertyType | null;
    title: string;
    city: string;
    locality: string;
    address: string;
    rent: number;
    deposit: number;
    maintenance: number;
    brokerage: number;
    bhk: string;
    bathrooms: number;
    area_sqft: number;
    furnishing: FurnishingType;
    available_from: string;
    amenities: string[];
    images: PropertyImage[];
    description: string;
    additional_info: string;
    no_brokerage: boolean;
    tenant_preferences: string[];
  };
  updateListingDraft: (data: Partial<AppState['listingDraft']>) => void;
  resetListingDraft: () => void;
}

const DEFAULT_FILTER: PropertyFilter = {
  query: '',
  city: 'Mumbai',
  locality: 'ALL',
  property_type: 'ALL',
  bhk: 'ALL',
  rent_min: 0,
  rent_max: 200000,
  furnishing: 'ALL',
  brokerage_free_only: false,
  verified_only: false,
  amenities: [],
  sort_by: 'recommended',
};

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isOnboarded: false,
  currentRole: 'RENTER',
  role: 'RENTER',
  switchRole: (newRole: UserRole) => {
    set({ currentRole: newRole, role: newRole });
    if (newRole === 'OWNER') {
      get().fetchMyProperties();
      get().fetchOwnerMetrics();
    }
    get().fetchEnquiries();
    get().fetchVisits();
    get().fetchConversations();
    get().showToast(`Switched to ${newRole === 'OWNER' ? 'Owner' : 'Renter'} Mode`, 'info');
  },
  blockedUserIds: [],
  initialized: false,

  ownerMetrics: null,
  properties: [],
  myProperties: [],
  savedPropertyIds: [],
  activeFilter: DEFAULT_FILTER,
  selectedProperty: null,

  pgs: [],
  flatmates: [],
  myFlatmateProfile: null,
  flatmateDraft: null,
  savedFlatmateIds: [],

  visits: [],
  applications: [],
  enquiries: [],

  conversations: [],
  activeConversationId: null,

  notifications: [],
  unreadNotificationCount: 0,
  notificationPrefs: {
    messages: true,
    visits: true,
    property_updates: true,
    price_changes: true,
    applications: true,
    marketing: false,
  },
  reports: [],

  listingDraft: {
    property_type: null,
    title: '',
    city: 'Mumbai',
    locality: '',
    address: '',
    rent: 0,
    deposit: 0,
    maintenance: 0,
    brokerage: 0,
    bhk: '',
    bathrooms: 1,
    area_sqft: 0,
    furnishing: 'SEMI_FURNISHED',
    available_from: new Date().toISOString().split('T')[0],
    amenities: [],
    images: [],
    description: '',
    additional_info: '',
    no_brokerage: false,
    tenant_preferences: [],
  },

  toastMessage: null,
  toastType: 'info',

  initializeFromStorage: async () => {
    try {
      const savedOnboarded = await getItem('rehvo_onboarding_completed');
      const isOnboardedFlag = savedOnboarded === 'true';

      const savedFmProfile = await getItem('rehvo_my_flatmate_profile');
      const parsedFmProfile = savedFmProfile ? JSON.parse(savedFmProfile) : null;

      const savedFmDraft = await getItem('rehvo_flatmate_draft');
      const parsedFmDraft = savedFmDraft ? JSON.parse(savedFmDraft) : null;

      const savedProps = await getItem('rehvo_properties');
      const parsedProps: Property[] = savedProps ? JSON.parse(savedProps) : [];

      const savedMyProps = await getItem('rehvo_my_properties');
      const parsedMyProps: Property[] = savedMyProps ? JSON.parse(savedMyProps) : [];

      const savedIds = await getItem('rehvo_saved_ids');
      const parsedIds = savedIds ? JSON.parse(savedIds) : [];

      const savedFmIds = await getItem('rehvo_saved_flatmate_ids');
      const parsedFmIds = savedFmIds ? JSON.parse(savedFmIds) : [];

      const saved = await getItem('rehvo_auth_session');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id) {
            set({
              user: parsed,
              isAuthenticated: true,
              isOnboarded: isOnboardedFlag || !!parsed.onboarding_completed,
              currentRole: parsed.role || 'RENTER',
              role: parsed.role || 'RENTER',
              properties: parsedProps,
              myProperties: parsedMyProps,
              myFlatmateProfile: parsedFmProfile,
              flatmateDraft: parsedFmDraft,
              savedPropertyIds: parsedIds,
              savedFlatmateIds: parsedFmIds,
              visits: [],
              applications: [],
              enquiries: [],
              conversations: [],
              notifications: [],
              unreadNotificationCount: 0,
              initialized: true,
            });
            // Fetch live properties, flatmates, saved IDs, enquiries, visits, conversations & notifications from Supabase
            get().fetchProperties();
            get().fetchMyProperties();
            get().fetchPublishedFlatmates();
            get().fetchMyFlatmateProfile();
            get().fetchSavedIds();
            get().fetchEnquiries();
            get().fetchVisits();
            get().fetchConversations();
            get().fetchNotifications();
            get().fetchUnreadNotificationCount();
            get().registerDevicePushToken();
            return;
          }
        } catch (e) {
          console.warn('Failed to parse stored session:', e);
        }
      }

      set({
        isOnboarded: isOnboardedFlag,
        properties: parsedProps,
        myFlatmateProfile: parsedFmProfile,
        flatmateDraft: parsedFmDraft,
        savedPropertyIds: parsedIds,
        savedFlatmateIds: parsedFmIds,
        initialized: true,
      });
      // Fetch live published properties & flatmates from Supabase
      get().fetchProperties();
      get().fetchPublishedFlatmates();
    } catch (err) {
      console.warn('Storage init warning:', err);
      set({ initialized: true });
    }
  },

  login: (userData) => {
    const isCompleted = userData.onboarding_completed ?? true;
    // Build user from provided data — no seed data spreading
    const user: UserProfile = {
      id: userData.id || '',
      name: userData.name || 'New Member',
      avatar: userData.avatar || '',
      phone: userData.phone || '',
      email: userData.email || '',
      role: userData.role || 'RENTER',
      city: userData.city || '',
      locality: userData.locality || '',
      occupation: userData.occupation || '',
      user_type: userData.user_type || 'other',
      budget_min: userData.budget_min || 0,
      budget_max: userData.budget_max || 0,
      move_in_date: userData.move_in_date || '',
      verification_status: userData.verification_status || 'UNVERIFIED',
      is_blocked: userData.is_blocked || false,
      onboarding_completed: isCompleted,
      created_at: userData.created_at || new Date().toISOString(),
      updated_at: userData.updated_at || new Date().toISOString(),
    };
    // Cache profile locally for offline restore
    setItem('rehvo_auth_session', JSON.stringify(user));
    if (isCompleted) {
      setItem('rehvo_onboarding_completed', 'true');
    }
    set({
      user,
      isAuthenticated: true,
      isOnboarded: isCompleted,
      currentRole: user.role || 'RENTER',
      role: user.role || 'RENTER',
    });
    get().fetchSavedIds();
    get().fetchMyProperties();
    get().fetchOwnerMetrics();
    get().fetchMyFlatmateProfile();
    get().fetchEnquiries();
    get().fetchVisits();
    get().fetchConversations();
    get().fetchNotifications();
    get().fetchUnreadNotificationCount();
    get().registerDevicePushToken();
    get().showToast(`Welcome, ${user.name}!`, 'success');
  },

  logout: () => {
    // Sign out from Supabase first
    supabase.auth.signOut().catch(() => {
      // Best effort — continue clearing local state even if network fails
    });
    removeItem('rehvo_auth_session');
    removeItem('rehvo_saved_ids');
    removeItem('rehvo_saved_flatmate_ids');
    removeItem('rehvo_my_flatmate_profile');
    removeItem('rehvo_flatmate_draft');
    removeItem('rehvo_properties');
    removeItem('rehvo_my_properties');
    removeItem('rehvo_supabase_auth_token');
    get().unregisterDevicePushToken();
    set({
      user: null,
      isAuthenticated: false,
      isOnboarded: true,
      myFlatmateProfile: null,
      flatmateDraft: null,
      ownerMetrics: null,
      properties: [],
      myProperties: [],
      savedPropertyIds: [],
      savedFlatmateIds: [],
      visits: [],
      applications: [],
      enquiries: [],
      conversations: [],
      activeConversationId: null,
      notifications: [],
      unreadNotificationCount: 0,
      selectedProperty: null,
      currentRole: 'RENTER',
      role: 'RENTER',
    });
    get().showToast('Logged out successfully', 'info');
  },

  updateProfile: (data) => {
    const state = get();
    const updatedUser = state.user ? { ...state.user, ...data, updated_at: new Date().toISOString() } : null;

    // Optimistic local update
    if (updatedUser) {
      setItem('rehvo_auth_session', JSON.stringify(updatedUser));
    }
    const resolvedRole = data.role || state.currentRole;
    set({
      user: updatedUser,
      currentRole: resolvedRole,
      role: resolvedRole,
      isOnboarded: data.onboarding_completed !== undefined ? data.onboarding_completed : state.isOnboarded,
    });

    // Persist to Supabase (async, non-blocking)
    if (state.user?.id) {
      profileService.updateProfile(state.user.id, data).then((result) => {
        if (result.success && result.data) {
          // Sync any server-side computed fields back
          set({ user: { ...get().user!, ...result.data } });
          setItem('rehvo_auth_session', JSON.stringify(get().user));
        } else if (!result.success) {
          // Supabase update failed — keep optimistic local state but warn
          if (__DEV__) {
            console.warn('[Profile] Supabase update failed:', result.error);
          }
        }
      });
    }

    get().showToast('Profile updated successfully', 'success');
  },

  completeOnboarding: () => {
    setItem('rehvo_onboarding_completed', 'true');
    set((state) => {
      const updatedUser = state.user ? { ...state.user, onboarding_completed: true } : null;
      if (updatedUser) {
        setItem('rehvo_auth_session', JSON.stringify(updatedUser));
      }
      return {
        isOnboarded: true,
        user: updatedUser,
      };
    });
  },

  deleteAccount: () => {
    const currentUserId = get().user?.id;
    if (currentUserId) {
      authService.deleteAccount(currentUserId).catch(() => {});
    } else {
      supabase.auth.signOut().catch(() => {});
    }
    get().unregisterDevicePushToken();
    removeItem('rehvo_auth_session');
    removeItem('rehvo_onboarding_completed');
    removeItem('rehvo_my_flatmate_profile');
    removeItem('rehvo_flatmate_draft');
    removeItem('rehvo_saved_ids');
    removeItem('rehvo_saved_flatmate_ids');
    removeItem('rehvo_properties');
    removeItem('rehvo_my_properties');
    removeItem('rehvo_supabase_auth_token');
    set({
      user: null,
      isAuthenticated: false,
      isOnboarded: false,
      myFlatmateProfile: null,
      flatmateDraft: null,
      ownerMetrics: null,
      properties: [],
      myProperties: [],
      savedPropertyIds: [],
      savedFlatmateIds: [],
      visits: [],
      applications: [],
      enquiries: [],
      conversations: [],
      activeConversationId: null,
      notifications: [],
      unreadNotificationCount: 0,
      selectedProperty: null,
      currentRole: 'RENTER',
      role: 'RENTER',
    });
    get().showToast('Your account and associated data have been deleted.', 'info');
  },

  setProperties: (properties) => {
    set({ properties });
    setItem('rehvo_properties', JSON.stringify(properties));
  },

  fetchProperties: async (filter) => {
    const res = await propertyService.getPublishedProperties(filter);
    if (res.success && res.data) {
      set({ properties: res.data });
      setItem('rehvo_properties', JSON.stringify(res.data));
      return res.data;
    }
    return get().properties;
  },

  fetchMyProperties: async () => {
    const { user } = get();
    if (!user?.id) {
      set({ myProperties: [] });
      return [];
    }

    const res = await propertyService.getMyProperties(user.id);
    if (res.success && res.data) {
      set({ myProperties: res.data });
      setItem('rehvo_my_properties', JSON.stringify(res.data));
      return res.data;
    }
    return get().myProperties;
  },

  fetchOwnerMetrics: async () => {
    const { user } = get();
    if (!user?.id) {
      set({ ownerMetrics: null });
      return null;
    }

    const res = await propertyService.getOwnerDashboardMetrics(user.id);
    if (res.success && res.data) {
      set({ ownerMetrics: res.data });
      return res.data;
    }
    return get().ownerMetrics;
  },

  recordPropertyView: async (propertyId: string) => {
    const { user } = get();
    const res = await propertyService.recordPropertyView(propertyId, user?.id);
    if (res.success && res.counted) {
      set((state) => ({
        properties: state.properties.map((p) =>
          p.id === propertyId ? { ...p, views_count: (p.views_count || 0) + 1 } : p
        ),
        myProperties: state.myProperties.map((p) =>
          p.id === propertyId ? { ...p, views_count: (p.views_count || 0) + 1 } : p
        ),
      }));
    }
  },

  addProperty: async (propertyData, imagesToUpload) => {
    const { user } = get();
    const res = await propertyService.createProperty(propertyData as any, imagesToUpload);

    if (res.success && res.data) {
      const created = res.data;
      const updatedUser = user ? { ...user, role: 'OWNER' as const } : user;
      if (updatedUser) {
        setItem('rehvo_auth_session', JSON.stringify(updatedUser));
      }

      set((state) => ({
        myProperties: [created, ...state.myProperties.filter((p) => p.id !== created.id)],
        properties: [created, ...state.properties.filter((p) => p.id !== created.id)],
        user: updatedUser,
        currentRole: 'OWNER',
        role: 'OWNER',
      }));

      // Reconcile live properties and metrics with Supabase
      get().fetchMyProperties();
      get().fetchProperties();
      get().fetchOwnerMetrics();

      get().showToast('Property published successfully!', 'success');
      return { success: true, data: created };
    } else {
      const errorMsg = res.error || "Couldn't create this property.";
      get().showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  },

  updateProperty: async (id, data) => {
    // Optimistic local update
    const prevMyProps = get().myProperties;
    const prevProps = get().properties;
    const optimisticMy = prevMyProps.map((p) =>
      p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p
    );
    const optimisticProps = prevProps.map((p) =>
      p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p
    );
    set({ myProperties: optimisticMy, properties: optimisticProps });

    const res = await propertyService.updateProperty(id, data);
    if (res.success && res.data) {
      const syncedMy = get().myProperties.map((p) => (p.id === id ? res.data! : p));
      const syncedProps = get().properties.map((p) => (p.id === id ? res.data! : p));
      set({ myProperties: syncedMy, properties: syncedProps });
      get().fetchOwnerMetrics();
      get().showToast('Property updated successfully', 'success');
      return { success: true, data: res.data };
    } else {
      // Revert optimistic update on failure
      set({ myProperties: prevMyProps, properties: prevProps });
      const errorMsg = res.error || "Couldn't update this property.";
      get().showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  },

  deleteProperty: async (id: string) => {
    const { user, properties, myProperties, savedPropertyIds, visits, applications, enquiries } = get();

    const target = myProperties.find((p) => p.id === id) || properties.find((p) => p.id === id);
    if (!target) {
      get().showToast('Property not found', 'error');
      return { success: false, error: 'Property not found' };
    }

    if (user && target.owner_id && target.owner_id !== user.id) {
      get().showToast("You don't have permission to delete this property.", 'error');
      return {
        success: false,
        error: "You don't have permission to delete this property.",
      };
    }

    try {
      const res = await propertyService.deleteProperty(id);
      if (!res.success) {
        const errorMsg = res.error || "Couldn't delete this property.";
        get().showToast(errorMsg, 'error');
        return { success: false, error: errorMsg };
      }

      const updatedMyProperties = myProperties.filter((p) => p.id !== id);
      const updatedProperties = properties.filter((p) => p.id !== id);
      const updatedSavedIds = savedPropertyIds.filter((pid) => pid !== id);
      const updatedVisits = visits.filter((v) => v.property_id !== id);
      const updatedApps = applications.filter((a) => a.property_id !== id);
      const updatedEnquiries = enquiries.filter((e) => e.property_id !== id);

      await setItem('rehvo_my_properties', JSON.stringify(updatedMyProperties));
      await setItem('rehvo_properties', JSON.stringify(updatedProperties));
      await setItem('rehvo_saved_ids', JSON.stringify(updatedSavedIds));

      const willHaveNoProperties = updatedMyProperties.length === 0;

      set((state) => ({
        myProperties: updatedMyProperties,
        properties: updatedProperties,
        savedPropertyIds: updatedSavedIds,
        visits: updatedVisits,
        applications: updatedApps,
        enquiries: updatedEnquiries,
        selectedProperty:
          state.selectedProperty?.id === id ? null : state.selectedProperty,
        currentRole: willHaveNoProperties ? 'RENTER' : state.currentRole,
        role: willHaveNoProperties ? 'RENTER' : state.role,
      }));

      get().fetchOwnerMetrics();
      get().showToast('Property deleted.', 'info');
      return { success: true };
    } catch (e) {
      console.error('Failed to delete property:', e);
      get().showToast("Couldn't delete this property. Please try again.", 'error');
      return {
        success: false,
        error: "Couldn't delete this property. Please try again.",
      };
    }
  },

  fetchSavedIds: async () => {
    const { user } = get();
    if (!user?.id) return { propertyIds: [], flatmateIds: [] };

    const [propRes, fmRes] = await Promise.all([
      savedService.getSavedPropertyIds(user.id),
      savedService.getSavedFlatmateIds(user.id),
    ]);

    const propertyIds = propRes.success && propRes.data ? propRes.data : get().savedPropertyIds;
    const flatmateIds = fmRes.success && fmRes.data ? fmRes.data : get().savedFlatmateIds;

    set({
      savedPropertyIds: propertyIds,
      savedFlatmateIds: flatmateIds,
    });
    setItem('rehvo_saved_ids', JSON.stringify(propertyIds));
    setItem('rehvo_saved_flatmate_ids', JSON.stringify(flatmateIds));

    return { propertyIds, flatmateIds };
  },

  toggleSaveProperty: async (id: string) => {
    const { user, savedPropertyIds, properties } = get();
    if (!user?.id) {
      get().showToast('Please log in to save properties', 'info');
      return;
    }

    const exists = savedPropertyIds.includes(id);
    const updated = exists ? savedPropertyIds.filter((pId) => pId !== id) : [...savedPropertyIds, id];

    // Optimistic update
    set({
      savedPropertyIds: updated,
      properties: properties.map((p) =>
        p.id === id ? { ...p, saves_count: Math.max(0, p.saves_count + (exists ? -1 : 1)) } : p
      ),
    });
    setItem('rehvo_saved_ids', JSON.stringify(updated));
    get().showToast(exists ? 'Removed from Saved' : 'Saved to Collection', 'success');

    const res = exists ? await savedService.unsaveProperty(id) : await savedService.saveProperty(id);
    if (!res.success) {
      // Revert optimistic update
      set({
        savedPropertyIds,
        properties,
      });
      setItem('rehvo_saved_ids', JSON.stringify(savedPropertyIds));
      get().showToast(res.error || "Couldn't update saved status", 'error');
    }
  },

  setFilter: (filterData) => {
    set((state) => ({
      activeFilter: { ...state.activeFilter, ...filterData },
    }));
  },

  resetFilter: () => {
    set({ activeFilter: DEFAULT_FILTER });
  },

  setSelectedProperty: (property) => set({ selectedProperty: property }),

  fetchVisits: async () => {
    const { user } = get();
    if (!user?.id) {
      set({ visits: [] });
      return [];
    }

    const isOwner = user.role === 'OWNER' || get().currentRole === 'OWNER';
    const res = isOwner
      ? await visitService.getOwnerVisits(user.id)
      : await visitService.getMyVisits(user.id);

    if (res.success && res.data) {
      set({ visits: res.data });
      return res.data;
    }
    return get().visits;
  },

  scheduleVisit: async (visitData) => {
    const { user } = get();
    if (!user?.id) {
      get().showToast('Please sign in to schedule a visit', 'info');
      return { success: false, error: 'User not signed in' };
    }

    const res = await visitService.createVisit(
      visitData.property_id,
      visitData.date,
      visitData.time,
      visitData.notes
    );

    if (res.success && res.data) {
      set((state) => ({
        visits: [res.data!, ...state.visits],
      }));
      get().showToast(`Visit requested for ${visitData.date} at ${visitData.time}`, 'success');
      return { success: true, data: res.data };
    } else {
      const errorMsg = res.error || "Couldn't schedule this visit.";
      get().showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  },

  updateVisitStatus: async (id: string, status: Visit['status']) => {
    // Optimistic update
    const prevVisits = get().visits;
    set((state) => ({
      visits: state.visits.map((v) => (v.id === id ? { ...v, status } : v)),
    }));

    const res = await visitService.updateVisitStatus(id, status);
    if (res.success) {
      get().showToast(`Visit status updated to ${status}`, 'info');
      return { success: true };
    } else {
      // Revert
      set({ visits: prevVisits });
      const errorMsg = res.error || "Couldn't update visit status.";
      get().showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  },

  confirmVisit: async (id: string) => {
    return get().updateVisitStatus(id, 'CONFIRMED');
  },

  cancelVisit: async (id: string, reason?: string) => {
    const prevVisits = get().visits;
    set((state) => ({
      visits: state.visits.map((v) => (v.id === id ? { ...v, status: 'CANCELLED' } : v)),
    }));

    const res = await visitService.cancelVisit(id, reason);
    if (res.success) {
      get().showToast('Visit cancelled', 'info');
      return { success: true };
    } else {
      set({ visits: prevVisits });
      const errorMsg = res.error || "Couldn't cancel this visit.";
      get().showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  },

  completeVisit: async (id: string) => {
    return get().updateVisitStatus(id, 'COMPLETED');
  },

  submitApplication: (appData) => {
    const newApp: Application = {
      ...appData,
      id: `app_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    set((state) => ({
      applications: [newApp, ...state.applications],
    }));
    get().showToast('Rental application submitted to owner', 'success');
  },

  updateApplicationStatus: (id, status) => {
    set((state) => ({
      applications: state.applications.map((a) => (a.id === id ? { ...a, status, updated_at: new Date().toISOString() } : a)),
    }));
    get().showToast(`Application status updated to ${status}`, 'info');
  },

  fetchEnquiries: async () => {
    const { user } = get();
    if (!user?.id) {
      set({ enquiries: [] });
      return [];
    }

    const isOwner = user.role === 'OWNER' || get().currentRole === 'OWNER';
    const res = isOwner
      ? await enquiryService.getOwnerEnquiries(user.id)
      : await enquiryService.getMyEnquiries(user.id);

    if (res.success && res.data) {
      set({ enquiries: res.data });
      return res.data;
    }
    return get().enquiries;
  },

  submitEnquiry: async (propertyId: string, message: string) => {
    const { user } = get();
    if (!user?.id) {
      get().showToast('Please sign in to send an enquiry', 'info');
      return { success: false, error: 'User not signed in' };
    }

    const res = await enquiryService.createEnquiry(propertyId, message);
    if (res.success && res.data) {
      set((state) => ({
        enquiries: [res.data!, ...state.enquiries],
      }));
      get().showToast('Enquiry sent to property host', 'success');
      return { success: true, data: res.data };
    } else {
      const errorMsg = res.error || "Couldn't send this enquiry.";
      get().showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  },

  updateEnquiryStatus: async (id: string, status: Enquiry['status']) => {
    // Optimistic update
    const prevEnquiries = get().enquiries;
    set((state) => ({
      enquiries: state.enquiries.map((e) => (e.id === id ? { ...e, status } : e)),
    }));

    const res = await enquiryService.updateEnquiryStatus(id, status);
    if (res.success) {
      get().showToast(`Enquiry status updated to ${status}`, 'info');
      return { success: true };
    } else {
      // Revert
      set({ enquiries: prevEnquiries });
      const errorMsg = res.error || "Couldn't update enquiry status.";
      get().showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  },

  fetchPublishedFlatmates: async (filter) => {
    const res = await flatmateService.getPublishedFlatmates(filter);
    if (res.success && res.data) {
      set({ flatmates: res.data });
      return res.data;
    }
    return get().flatmates;
  },

  fetchMyFlatmateProfile: async () => {
    const { user } = get();
    if (!user?.id) return null;

    const res = await flatmateService.getMyFlatmateProfile(user.id);
    if (res.success) {
      set({ myFlatmateProfile: res.data || null });
      if (res.data) {
        setItem('rehvo_my_flatmate_profile', JSON.stringify(res.data));
      } else {
        removeItem('rehvo_my_flatmate_profile');
      }
      return res.data || null;
    }
    return get().myFlatmateProfile;
  },

  addFlatmateProfile: async (profileData, photoUri) => {
    const res = await flatmateService.createFlatmateProfile(profileData as any, photoUri);
    if (res.success && res.data) {
      const created = res.data;
      setItem('rehvo_my_flatmate_profile', JSON.stringify(created));
      removeItem('rehvo_flatmate_draft');
      set((state) => ({
        flatmates: [created, ...state.flatmates.filter((f) => f.id !== created.id)],
        myFlatmateProfile: created,
        flatmateDraft: null,
      }));
      get().showToast('Flatmate profile published successfully!', 'success');
      return { success: true, data: created };
    } else {
      const errorMsg = res.error || "Couldn't create your Flatmate Profile.";
      get().showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  },

  updateFlatmateProfile: async (id, data, photoUri) => {
    const prevMy = get().myFlatmateProfile;
    const prevList = get().flatmates;

    // Optimistic local update
    const optimisticMy = prevMy ? { ...prevMy, ...data, updated_at: new Date().toISOString() } : null;
    const optimisticList = prevList.map((f) =>
      f.id === id ? { ...f, ...data, updated_at: new Date().toISOString() } : f
    );
    set({ myFlatmateProfile: optimisticMy, flatmates: optimisticList });

    const res = await flatmateService.updateFlatmateProfile(id, data, photoUri);
    if (res.success && res.data) {
      const synced = res.data;
      setItem('rehvo_my_flatmate_profile', JSON.stringify(synced));
      set((state) => ({
        myFlatmateProfile: state.myFlatmateProfile?.id === id ? synced : state.myFlatmateProfile,
        flatmates: state.flatmates.map((f) => (f.id === id ? synced : f)),
      }));
      get().showToast('Profile updated successfully', 'success');
      return { success: true, data: synced };
    } else {
      // Revert optimistic update
      set({ myFlatmateProfile: prevMy, flatmates: prevList });
      const errorMsg = res.error || "Couldn't update your Flatmate Profile.";
      get().showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  },

  pauseFlatmateProfile: async (id) => {
    const res = await flatmateService.pauseFlatmateProfile(id);
    if (res.success && res.data) {
      const updated = res.data;
      setItem('rehvo_my_flatmate_profile', JSON.stringify(updated));
      set((state) => ({
        myFlatmateProfile: state.myFlatmateProfile?.id === id ? updated : state.myFlatmateProfile,
        flatmates: state.flatmates.map((f) => (f.id === id ? updated : f)),
      }));
      get().showToast('Profile paused and hidden from discovery', 'info');
      return { success: true };
    } else {
      const errorMsg = res.error || "Couldn't pause profile.";
      get().showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  },

  resumeFlatmateProfile: async (id) => {
    const res = await flatmateService.resumeFlatmateProfile(id);
    if (res.success && res.data) {
      const updated = res.data;
      setItem('rehvo_my_flatmate_profile', JSON.stringify(updated));
      set((state) => ({
        myFlatmateProfile: state.myFlatmateProfile?.id === id ? updated : state.myFlatmateProfile,
        flatmates: state.flatmates.map((f) => (f.id === id ? updated : f)),
      }));
      get().showToast('Profile published live in discovery', 'success');
      return { success: true };
    } else {
      const errorMsg = res.error || "Couldn't resume profile.";
      get().showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  },

  deleteFlatmateProfile: async (id) => {
    const res = await flatmateService.deleteFlatmateProfile(id);
    if (res.success) {
      removeItem('rehvo_my_flatmate_profile');
      set((state) => ({
        flatmates: state.flatmates.filter((f) => f.id !== id),
        myFlatmateProfile:
          state.myFlatmateProfile?.id === id ? null : state.myFlatmateProfile,
      }));
      get().showToast('Flatmate profile removed', 'info');
      return { success: true };
    } else {
      const errorMsg = res.error || "Couldn't delete your Flatmate Profile.";
      get().showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  },

  toggleSaveFlatmate: async (id: string) => {
    const { user, savedFlatmateIds } = get();
    if (!user?.id) {
      get().showToast('Please log in to save flatmates', 'info');
      return;
    }

    const isSaved = savedFlatmateIds.includes(id);
    const updated = isSaved
      ? savedFlatmateIds.filter((sid) => sid !== id)
      : [...savedFlatmateIds, id];

    // Optimistic update
    set({ savedFlatmateIds: updated });
    setItem('rehvo_saved_flatmate_ids', JSON.stringify(updated));
    get().showToast(
      isSaved ? 'Removed from saved flatmates' : 'Saved to favorite flatmates',
      'success'
    );

    const res = isSaved ? await savedService.unsaveFlatmate(id) : await savedService.saveFlatmate(id);
    if (!res.success) {
      // Revert
      set({ savedFlatmateIds });
      setItem('rehvo_saved_flatmate_ids', JSON.stringify(savedFlatmateIds));
      get().showToast(res.error || "Couldn't update saved status", 'error');
    }
  },

  saveFlatmateDraft: (draft) => {
    setItem('rehvo_flatmate_draft', JSON.stringify(draft));
    set({ flatmateDraft: draft });
  },

  clearFlatmateDraft: () => {
    removeItem('rehvo_flatmate_draft');
    set({ flatmateDraft: null });
  },

  fetchConversations: async () => {
    const { user } = get();
    if (!user?.id) {
      set({ conversations: [] });
      return [];
    }

    const res = await chatService.getConversations(user.id);
    if (res.success && res.data) {
      set({ conversations: res.data });
      return res.data;
    }
    return get().conversations;
  },

  fetchConversationById: async (id: string) => {
    const { user } = get();
    if (!user?.id || !id) return null;

    const res = await chatService.getConversationById(id, user.id);
    if (res.success && res.data) {
      const conv = res.data;
      set((state) => ({
        conversations: [
          conv,
          ...state.conversations.filter((c) => c.id !== conv.id),
        ],
        activeConversationId: conv.id,
      }));
      return conv;
    }
    return null;
  },

  startOrGetFlatmateConversation: async (flatmate) => {
    const { user } = get();
    if (!user?.id) {
      get().showToast('Please sign in to message this flatmate', 'info');
      return '';
    }

    const res = await chatService.getOrCreateFlatmateConversation(flatmate.id);
    if (res.success && res.data) {
      const conv = res.data;
      set((state) => ({
        conversations: [
          conv,
          ...state.conversations.filter((c) => c.id !== conv.id),
        ],
        activeConversationId: conv.id,
      }));
      return conv.id;
    } else {
      get().showToast(res.error || "Couldn't initiate chat with flatmate.", 'error');
      return '';
    }
  },

  startOrGetConversation: async (property, enquiryId) => {
    const { user } = get();
    if (!user?.id) {
      get().showToast('Please sign in to message this host', 'info');
      return '';
    }

    const res = await chatService.getOrCreatePropertyConversation(property.id, enquiryId);
    if (res.success && res.data) {
      const conv = res.data;
      set((state) => ({
        conversations: [
          conv,
          ...state.conversations.filter((c) => c.id !== conv.id),
        ],
        activeConversationId: conv.id,
      }));
      return conv.id;
    } else {
      get().showToast(res.error || "Couldn't initiate chat with host.", 'error');
      return '';
    }
  },

  sendMessage: async (conversationId, text) => {
    const { user, conversations } = get();
    if (!user?.id || !text.trim()) return { success: false, error: 'User not signed in' };

    const tempId = `temp_${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: user.id,
      sender_name: user.name,
      sender_avatar: user.avatar,
      text: text.trim(),
      created_at: new Date().toISOString(),
      is_read: true,
    };

    // Optimistic append
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              last_message: text.trim(),
              updated_at: new Date().toISOString(),
              messages: [...c.messages, optimisticMsg],
            }
          : c
      ),
    }));

    const res = await chatService.sendMessage(conversationId, text.trim());
    if (res.success && res.data) {
      const realMsg = res.data;
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === tempId ? realMsg : m
                ),
              }
            : c
        ),
      }));
      return { success: true, data: realMsg };
    } else {
      // Revert optimistic append
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: c.messages.filter((m) => m.id !== tempId),
              }
            : c
        ),
      }));
      get().showToast(res.error || "Couldn't send message", 'error');
      return { success: false, error: res.error };
    }
  },

  addRealtimeMessage: (conversationId, message) => {
    set((state) => ({
      conversations: state.conversations.map((c) => {
        if (c.id !== conversationId) return c;

        // Check if message ID already exists or replaces temp message
        const existingIdx = c.messages.findIndex(
          (m) =>
            m.id === message.id ||
            (m.id.startsWith('temp_') &&
              m.text === message.text &&
              m.sender_id === message.sender_id)
        );

        let updatedMessages = [...c.messages];
        if (existingIdx >= 0) {
          updatedMessages[existingIdx] = message;
        } else {
          updatedMessages.push(message);
        }

        return {
          ...c,
          last_message: message.text,
          updated_at: message.created_at,
          messages: updatedMessages,
        };
      }),
    }));
  },

  markConversationAsRead: async (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              unread_count: 0,
              messages: c.messages.map((m) => ({ ...m, is_read: true })),
            }
          : c
      ),
    }));
    await chatService.markConversationAsRead(conversationId);
  },

  setActiveConversationId: (id) => set({ activeConversationId: id }),

  updateBedStatus: (pgId, roomId, bedId, status, tenantName, tenantPhone) => {
    set((state) => ({
      pgs: state.pgs.map((pg) => {
        if (pg.id !== pgId) return pg;
        return {
          ...pg,
          rooms: pg.rooms.map((room) => {
            if (room.id !== roomId) return room;
            const updatedBeds = room.beds.map((bed) => {
              if (bed.id !== bedId) return bed;
              return {
                ...bed,
                status,
                tenant_name: tenantName ?? bed.tenant_name,
                tenant_phone: tenantPhone ?? bed.tenant_phone,
              };
            });
            const vacantCount = updatedBeds.filter((b) => b.status === 'VACANT').length;
            return {
              ...room,
              beds: updatedBeds,
              available_beds: vacantCount,
            };
          }),
        };
      }),
    }));
    get().showToast('Bed occupancy updated', 'success');
  },

  reportProperty: (reportData) => {
    const { user } = get();
    const newReport: SafetyReport = {
      ...reportData,
      id: `rep_${Date.now()}`,
      reporter_id: user?.id || 'guest',
      reporter_name: user?.name || 'Guest User',
      status: 'NEW',
      created_at: new Date().toISOString(),
    };
    set((state) => ({
      reports: [newReport, ...state.reports],
    }));
    get().showToast('Report submitted. Our safety team will review it shortly.', 'info');
  },

  blockUser: (userId) => {
    set((state) => ({
      blockedUserIds: [...state.blockedUserIds, userId],
    }));
    get().showToast('User blocked', 'info');
  },

  unblockUser: (userId) => {
    set((state) => ({
      blockedUserIds: state.blockedUserIds.filter((id) => id !== userId),
    }));
    get().showToast('User unblocked', 'info');
  },

  verifyOwnerOrProperty: (id, type, status) => {
    if (type === 'property') {
      set((state) => ({
        properties: state.properties.map((p) => (p.id === id ? { ...p, verification_status: status } : p)),
      }));
    }
    get().showToast(`${type.toUpperCase()} set to ${status}`, 'success');
  },

  showToast: (message, type = 'info') => {
    set({ toastMessage: message, toastType: type });
    setTimeout(() => {
      set({ toastMessage: null });
    }, 3500);
  },

  clearToast: () => set({ toastMessage: null }),

  fetchNotifications: async () => {
    const { user } = get();
    if (!user?.id) {
      set({ notifications: [], unreadNotificationCount: 0 });
      return [];
    }

    const res = await notificationsService.getNotifications(user.id);
    if (res.success && res.data) {
      const unread = res.data.filter((n) => !n.read).length;
      set({ notifications: res.data, unreadNotificationCount: unread });
      return res.data;
    }
    return get().notifications;
  },

  fetchUnreadNotificationCount: async () => {
    const { user } = get();
    if (!user?.id) {
      set({ unreadNotificationCount: 0 });
      return 0;
    }

    const res = await notificationsService.getUnreadNotificationCount(user.id);
    if (res.success && typeof res.data === 'number') {
      set({ unreadNotificationCount: res.data });
      return res.data;
    }
    return get().unreadNotificationCount;
  },

  markNotificationRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n
      ),
      unreadNotificationCount: Math.max(0, state.unreadNotificationCount - 1),
    }));
    await notificationsService.markNotificationAsRead(id);
  },

  markAllNotificationsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        read: true,
        read_at: new Date().toISOString(),
      })),
      unreadNotificationCount: 0,
    }));
    await notificationsService.markAllNotificationsAsRead();
    get().showToast('All notifications marked as read', 'info');
  },

  deleteNotification: async (id) => {
    const prev = get().notifications;
    const target = prev.find((n) => n.id === id);
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadNotificationCount:
        target && !target.read
          ? Math.max(0, state.unreadNotificationCount - 1)
          : state.unreadNotificationCount,
    }));

    const res = await notificationsService.deleteNotification(id);
    if (!res.success) {
      set({ notifications: prev });
      get().showToast(res.error || "Couldn't delete notification", 'error');
    }
  },

  registerDevicePushToken: async () => {
    try {
      const token = await notificationsService.getExpoPushToken();
      if (token) {
        await notificationsService.registerPushToken(token);
      }
    } catch (_) {}
  },

  unregisterDevicePushToken: async () => {
    try {
      const token = await notificationsService.getExpoPushToken();
      if (token) {
        await notificationsService.removePushToken(token);
      }
    } catch (_) {}
  },

  addRealtimeNotification: (notification) => {
    set((state) => {
      if (state.notifications.some((n) => n.id === notification.id)) {
        return state;
      }
      return {
        notifications: [notification, ...state.notifications],
        unreadNotificationCount: notification.read
          ? state.unreadNotificationCount
          : state.unreadNotificationCount + 1,
      };
    });
  },

  updateNotificationPrefs: (prefs) => {
    set((state) => ({
      notificationPrefs: { ...state.notificationPrefs, ...prefs },
    }));
    get().showToast('Notification settings updated', 'success');
  },

  updateListingDraft: (data) => {
    set((state) => ({
      listingDraft: { ...state.listingDraft, ...data },
    }));
  },

  resetListingDraft: () => {
    set({
      listingDraft: {
        property_type: null,
        title: '',
        city: 'Mumbai',
        locality: '',
        address: '',
        rent: 0,
        deposit: 0,
        maintenance: 0,
        brokerage: 0,
        bhk: '',
        bathrooms: 1,
        area_sqft: 0,
        furnishing: 'SEMI_FURNISHED',
        available_from: new Date().toISOString().split('T')[0],
        amenities: [],
        images: [],
        description: '',
        additional_info: '',
        no_brokerage: false,
        tenant_preferences: [],
      },
    });
  },
}));

export interface UserCapabilities {
  userProperties: Property[];
  hasPropertyListing: boolean;
  hasFlatmateProfile: boolean;
  hasPublishedFlatmateProfile: boolean;
  hasFlatmateDraft: boolean;
  isFlatmatePaused: boolean;
  isNormalUserOnly: boolean;
  isOwnerOnly: boolean;
  isFlatmateOnly: boolean;
  isBothOwnerAndFlatmate: boolean;
}

export const selectUserCapabilities = (state: {
  user: UserProfile | null;
  properties?: Property[];
  myProperties?: Property[];
  myFlatmateProfile: FlatmateProfile | null;
  flatmateDraft: Partial<FlatmateProfile> | null;
}): UserCapabilities => {
  const user = state.user;
  const sourceProps = state.myProperties || state.properties || [];
  const userProperties = user
    ? sourceProps.filter((p) => p.owner_id === user.id)
    : [];

  const hasPropertyListing = userProperties.length > 0;
  const hasFlatmateProfile = Boolean(state.myFlatmateProfile);
  const hasPublishedFlatmateProfile = Boolean(
    state.myFlatmateProfile && state.myFlatmateProfile.is_published && !state.myFlatmateProfile.is_paused
  );
  const isFlatmatePaused = Boolean(
    state.myFlatmateProfile && state.myFlatmateProfile.is_paused
  );
  const hasFlatmateDraft = Boolean(
    !hasFlatmateProfile && state.flatmateDraft
  );

  return {
    userProperties,
    hasPropertyListing,
    hasFlatmateProfile,
    hasPublishedFlatmateProfile,
    hasFlatmateDraft,
    isFlatmatePaused,
    isNormalUserOnly: !hasPropertyListing && !hasFlatmateProfile,
    isOwnerOnly: hasPropertyListing && !hasFlatmateProfile,
    isFlatmateOnly: !hasPropertyListing && hasFlatmateProfile,
    isBothOwnerAndFlatmate: hasPropertyListing && hasFlatmateProfile,
  };
};
