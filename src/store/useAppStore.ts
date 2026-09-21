import { create } from 'zustand';
import {
  UserProfile,
  Property,
  PropertyCategory,
  CommercialType,
  PropertyFilter,
  Visit,
  Application,
  Conversation,
  Message,
  ChatMessageType,
  PropertyMessageMeta,
  VisitMessageMeta,
  AgreementMessageMeta,
  RentReminderMeta,
  FlatmateProfile,
  PG,
  PGBed,
  SafetyReport,
  NotificationItem,
  NotificationPreferences,
  UserRole,
  AppMode,
  Enquiry,
  PropertyType,
  FurnishingType,
  PropertyImage,
  OwnerDashboardMetrics,
  PropertySpecificAnalytics,
  IncomingWave,
  WalletRecord,
  WalletTransactionRecord,
  WalletTransactionCategory,
  RewardCampaignRecord,
  RewardRedemptionRecord,
  ReferralRecord,
  ChallengeRecord,
  CashbackSummary,
  RentPaymentRecord,
  LeaseAgreementRecord,
  ZeroDepositPassRecord,
  TenantVerificationRecord,
  VisitBookingRecord,
  ServiceBookingRecord,
  UtilityRequestRecord,
  DocumentVaultRecord,
  ServiceBookingType,
  DocumentVaultType,
  OwnerProfile,
  OwnerSubscriptionPlan,
  OwnerDashboardSummary,
  TenantLeadRecord,
  TenantLeadStatus,
  RentCollectionRecord,
  VisitCheckinRecord,
  VisitCheckinStatus,
  OwnerNotificationRecord,
  OwnerNotificationCategory,
  OwnerDocumentRecord,
  OwnerDocumentType,
  OwnerPlanTier,
  OwnerPlanCycle,
  ListingLifecycleStatus,
  UserBankAccountRecord,
  ScratchCardRecord,
  UserGamificationRecord,
  AchievementBadgeRecord,
  FriendLeaderboardItem,
  ElectricityBillRecord,
  BroadbandPlanRecord,
  BroadbandBookingRecord,
  WaterTankerBookingRecord,
  PngGasBookingRecord,
  EmergencyContactRecord,
  SosAlertRecord,
  SocietyEntryPassRecord,
  SocietyPassType,
  MaintenanceTicketRecord,
  MaintenanceTicketMessageRecord,
  MoveIn30ChecklistRecord,
  UtilityAccountRecord,
  UtilityTransactionRecord,
  AutopaySettingRecord,
  MaintenancePaymentRecord,
  ServiceCategoryRecord,
  TechnicianRecord,
  TechnicianReviewRecord,
  SocietyComplaintRecord,
  SocietyNoticeRecord,
  VisitorPassRecord,
  DeliveryPassRecord,
  AmenityBookingRecord,
  RecommendedPropertyItem,
  AdvancedFilterPayload,
  SavedSearchRecord,
  LocalityScoreRecord,
  CommuteHubRecord,
  CommuteHubType,
  NeighborhoodScoresRecord,
  LocalityCrimeStatsRecord,
  LocalityAirQualityRecord,
  AIConversationRecord,
  AIChatMessage,
  UserAIMemory,
  GeoPoint,
  SavedPlaceRecord,
  MediaUploadRecord,
  OCRDocumentRecord,
  VoiceQueryRecord,
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
import * as pushNotificationsService from '../services/pushNotifications';
import { CURATED_FLATMATES } from '../services/flatmatesData';
import {
  walletService,
  DEFAULT_REWARD_CAMPAIGNS,
  DEFAULT_CHALLENGES,
} from '../services/wallet';
import { cashbackEngine } from '../services/cashbackEngine';
import { campaignsService } from '../services/campaigns';
import { rentalOperationsService } from '../services/rentalOperations';
import { ownerEcosystemService } from '../services/ownerEcosystem';
import { safetyService } from '../services/safety';
import { societyPassService } from '../services/societyPass';
import { maintenanceService } from '../services/maintenance';
import { residentServices } from '../services/residentServices';
import * as recommendationsService from '../services/recommendations';
import * as smartSearchService from '../services/smartSearch';
import * as smartMapsService from '../services/smartMaps';
import * as propertyCompareService from '../services/propertyCompare';
import * as rehvoAIService from '../services/rehvoAI';

export interface PropertyDraft {
  id?: string;
  propType?: string;
  bhk?: string;
  title?: string;
  society?: string;
  locality?: string;
  city?: string;
  areaSqft?: string;
  rent?: string;
  deposit?: string;
  furnishing?: string;
  tenantType?: string;
  selectedAmenities?: string[];
  photos?: string[];
  coverIndex?: number;
  floorPlanUri?: string;
  virtualTourUri?: string;
  updatedAt?: string;
}

interface AppState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  currentRole: UserRole;
  role: UserRole;
  userRole: 'renter' | 'owner' | 'admin';
  activeMode: 'renter' | 'owner' | 'admin';
  pendingAuthRole: 'renter' | 'owner' | 'admin';
  setPendingAuthRole: (role: 'renter' | 'owner' | 'admin') => void;
  switchRole: (newRole: UserRole | 'renter' | 'owner' | 'admin') => Promise<void>;
  switchMode: (mode: 'renter' | 'owner' | 'admin') => Promise<void>;
  initializeRole: () => Promise<void>;
  fetchRoleProfile: () => Promise<void>;
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
  propertyDraft: PropertyDraft | null;
  savePropertyDraft: (draft: Partial<PropertyDraft>) => void;
  clearPropertyDraft: () => void;
  savedFlatmateIds: string[];
  followingFlatmateIds: string[];
  wavedFlatmateIds: string[];
  acceptedWaveFlatmateIds: string[];
  likedFlatmateIds: string[];
  superLikedFlatmateIds: string[];
  matchedFlatmateIds: string[];
  swipeHistory: { flatmate: FlatmateProfile; action: 'like' | 'skip' | 'superlike' }[];
  swipeFlatmate: (flatmateId: string, action: 'like' | 'skip' | 'superlike') => Promise<{ isMatch: boolean; flatmate?: FlatmateProfile }>;
  undoLastSwipe: () => FlatmateProfile | null;
  superWaveFlatmate: (flatmateId: string, message?: string) => Promise<{ success: boolean; isMatched?: boolean }>;
  myFlatmateAnalytics: flatmateService.FlatmateAnalytics | null;
  fetchMyFlatmateAnalytics: () => Promise<flatmateService.FlatmateAnalytics | null>;
  incomingWaves: IncomingWave[];

  visits: Visit[];
  applications: Application[];
  enquiries: Enquiry[];

  conversations: Conversation[];
  activeConversationId: string | null;
  onlineUserIds: string[];
  typingMap: Record<string, { userId: string; isTyping: boolean }>;

  notifications: NotificationItem[];
  unreadNotificationCount: number;
  badgeCount: number;
  pushToken: string | null;
  loadingNotifications: boolean;
  notificationPreferences: NotificationPreferences;
  notificationPrefs: NotificationPreferences;
  isNotificationPermissionModalVisible: boolean;
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
  recentlyViewedIds: string[];
  duplicateProperty: (id: string) => Promise<{ success: boolean; data?: Property; error?: string }>;
  markPropertyRented: (id: string) => Promise<{ success: boolean; error?: string }>;
  markPropertyExpired: (id: string) => Promise<{ success: boolean; error?: string }>;
  reportPropertyListing: (propertyId: string, reason: string, description: string) => Promise<{ success: boolean; error?: string }>;
  getPropertyAnalytics: (propertyId: string) => Promise<{ success: boolean; data?: PropertySpecificAnalytics; error?: string }>;

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
  fetchFlatmates: (filter?: any) => Promise<FlatmateProfile[]>;
  fetchMyFlatmateProfile: () => Promise<FlatmateProfile | null>;
  addFlatmateProfile: (profile: Omit<FlatmateProfile, 'id' | 'created_at' | 'updated_at'>, photoUri?: string) => Promise<{ success: boolean; data?: FlatmateProfile; error?: string }>;
  createFlatmateProfile: (profile: Partial<FlatmateProfile>, photoUri?: string) => Promise<{ success: boolean; data?: FlatmateProfile; error?: string }>;
  updateFlatmateProfile: (id: string, data: Partial<FlatmateProfile>, photoUri?: string) => Promise<{ success: boolean; data?: FlatmateProfile; error?: string }>;
  pauseFlatmateProfile: (id: string) => Promise<{ success: boolean; error?: string }>;
  resumeFlatmateProfile: (id: string) => Promise<{ success: boolean; error?: string }>;
  deleteFlatmateProfile: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleSaveFlatmate: (id: string) => Promise<void>;
  saveFlatmate: (id: string) => Promise<void>;
  unsaveFlatmate: (id: string) => Promise<void>;
  isFlatmateSaved: (id: string) => boolean;
  toggleFollowFlatmate: (id: string, flatmateName?: string) => Promise<boolean>;
  verifyFlatmateKyc: (id: string, kycData?: any) => Promise<boolean>;
  saveFlatmateDraft: (draft: Partial<FlatmateProfile>) => void;
  clearFlatmateDraft: () => void;
  fetchConversations: () => Promise<Conversation[]>;
  fetchConversationById: (id: string) => Promise<Conversation | null>;
  startOrGetFlatmateConversation: (flatmate: FlatmateProfile) => Promise<string>;
  sendFlatmateWave: (flatmateId: string, flatmateName: string, flatmateAvatar?: string, locality?: string) => Promise<{ success: boolean; conversationId?: string; isMatched?: boolean }>;
  acceptFlatmateWave: (waveId: string, flatmateId: string, flatmateName: string) => Promise<string | null>;
  declineFlatmateWave: (waveId: string) => void;
  isWaveMatchedWith: (flatmateId: string) => boolean;
  startOrGetConversation: (property: Property, enquiryId?: string) => Promise<string>;
  createOrGetLeadConversation: (lead: TenantLeadRecord) => Promise<string>;
  startOrGetSupportConversation: () => Promise<string>;
  sendMessage: (conversationId: string, text: string) => Promise<{ success: boolean; data?: Message; error?: string }>;
  sendRichMessage: (
    conversationId: string,
    params: {
      text?: string;
      messageType?: ChatMessageType;
      imageUrl?: string;
      videoUrl?: string;
      audioUrl?: string;
      documentUrl?: string;
      documentName?: string;
      location?: { latitude: number; longitude: number; name?: string };
      metadata?: any;
      replyToId?: string;
    }
  ) => Promise<{ success: boolean; data?: Message; error?: string }>;
  addRealtimeMessage: (conversationId: string, message: Message) => void;
  setActiveConversationId: (id: string | null) => void;
  markConversationAsRead: (conversationId: string) => Promise<void>;
  togglePinConversation: (conversationId: string) => Promise<void>;
  toggleArchiveConversation: (conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  deleteMessage: (conversationId: string, messageId: string) => Promise<void>;
  deleteMessageForEveryone: (conversationId: string, messageId: string) => Promise<boolean>;
  editMessage: (conversationId: string, messageId: string, newText: string) => Promise<boolean>;
  uploadChatAttachment: (fileUri: string, fileName?: string, contentType?: string, conversationId?: string) => Promise<{ success: boolean; data?: string; error?: string }>;
  toggleMuteConversation: (conversationId: string) => void;
  toggleMessageReaction: (conversationId: string, messageId: string, emoji: string) => Promise<void>;
  setTyping: (conversationId: string, isTyping: boolean) => Promise<void>;
  setOnlineUserIds: (userIds: string[]) => void;
  setTypingForConversation: (conversationId: string, userId: string, isTyping: boolean) => void;
  fetchMessages: (conversationId: string) => Promise<Message[]>;
  starMessage: (conversationId: string, messageId: string) => Promise<void>;
  unstarMessage: (conversationId: string, messageId: string) => Promise<void>;
  sendVideoMessage: (conversationId: string, videoUrl: string, caption?: string) => Promise<Message | null>;
  sendLocationMessage: (conversationId: string, location: { latitude: number; longitude: number; name?: string }) => Promise<Message | null>;
  sendPaymentRequest: (conversationId: string, payment: { amount: number; title: string; dueDate?: string; purpose?: string }) => Promise<Message | null>;

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
  clearNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<NotificationItem[]>;
  bulkMarkNotificationsRead: (ids: string[]) => Promise<void>;
  bulkDeleteNotifications: (ids: string[]) => Promise<void>;
  fetchNotificationPreferences: () => Promise<NotificationPreferences>;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  setNotificationPermissionModalVisible: (visible: boolean) => void;
  syncBadgeCount: () => Promise<void>;
  incrementBadge: () => void;
  clearBadge: () => void;
  registerPushToken: () => Promise<string | null>;
  registerDevicePushToken: () => Promise<void>;
  unregisterDevicePushToken: () => Promise<void>;
  addRealtimeNotification: (notification: NotificationItem) => void;
  updateNotificationPrefs: (prefs: Partial<NotificationPreferences>) => void;

  listingDraft: {
    category?: PropertyCategory;
    property_type: PropertyType | null;
    commercial_type?: CommercialType | null;
    title: string;
    city: string;
    locality: string;
    address: string;
    rent: number;
    deposit: number;
    maintenance: number;
    commission: number;
    bhk: string;
    bathrooms: number;
    washrooms?: number;
    area_sqft: number;
    carpet_area?: number;
    floor_number?: string;
    total_floors?: number;
    power_backup?: boolean;
    lift?: boolean;
    furnishing: FurnishingType;
    available_from: string;
    amenities: string[];
    images: PropertyImage[];
    description: string;
    additional_info: string;
    zero_commission: boolean;
    tenant_preferences: string[];
    lease_type?: string;
  };
  updateListingDraft: (data: Partial<AppState['listingDraft']>) => void;
  resetListingDraft: () => void;

  activeHostPlan: 'starter' | 'basic' | 'growth' | 'pro' | null;
  setActiveHostPlan: (plan: 'starter' | 'basic' | 'growth' | 'pro' | null) => void;
  canListNewProperty: () => { allowed: boolean; reason?: 'NO_PLAN' | 'LIMIT_REACHED' };

  // Wallet, R-Cash & Rewards Ecosystem
  wallet: WalletRecord | null;
  walletTransactions: WalletTransactionRecord[];
  rewardCampaigns: RewardCampaignRecord[];
  myRedemptions: RewardRedemptionRecord[];
  referrals: ReferralRecord[];
  challenges: ChallengeRecord[];
  cashbackSummary: CashbackSummary | null;

  fetchWallet: () => Promise<WalletRecord | null>;
  fetchWalletTransactions: (options?: { category?: string; type?: string; limit?: number }) => Promise<WalletTransactionRecord[]>;
  fetchRewardCampaigns: (category?: string) => Promise<RewardCampaignRecord[]>;
  redeemRewardCampaign: (campaignId: string) => Promise<{ success: boolean; promoCode?: string; error?: string }>;
  fetchMyRedemptions: () => Promise<RewardRedemptionRecord[]>;
  fetchReferrals: () => Promise<ReferralRecord[]>;
  fetchChallenges: () => Promise<ChallengeRecord[]>;
  claimChallengeReward: (challengeId: string) => Promise<{ success: boolean; rewardAmount?: number; error?: string }>;
  triggerCashback: (amount: number, category: WalletTransactionCategory, title: string, description?: string, refId?: string) => Promise<void>;
  fetchCashbackSummary: () => Promise<CashbackSummary | null>;
  transferToBank: (
    amount: number,
    bankDetails: { accountNumber: string; ifsc: string; beneficiaryName: string }
  ) => Promise<{ success: boolean; txnId?: string; error?: string }>;

  // Batch 2: Bank Accounts, Withdrawals, Scratch Cards, Gamification
  userBankAccounts: UserBankAccountRecord[];
  scratchCards: ScratchCardRecord[];
  gamification: UserGamificationRecord | null;
  achievementBadges: AchievementBadgeRecord[];

  fetchUserBankAccounts: () => Promise<UserBankAccountRecord[]>;
  addUserBankAccount: (bank: { accountHolderName: string; bankName: string; accountNumber: string; ifscCode: string; accountType?: 'savings' | 'current'; upiId?: string }) => Promise<{ success: boolean; data?: UserBankAccountRecord; error?: string }>;
  deleteUserBankAccount: (bankId: string) => Promise<{ success: boolean; error?: string }>;
  withdrawToBank: (amount: number, bankAccountId?: string) => Promise<{ success: boolean; txnId?: string; utr?: string; error?: string }>;
  fetchScratchCards: () => Promise<ScratchCardRecord[]>;
  revealScratchCard: (cardId: string) => Promise<{ success: boolean; rewardAmount: number; error?: string }>;
  spinRewardWheel: () => Promise<{ success: boolean; prize: string; rewardAmount: number; prizeType: string }>;
  fetchGamification: () => Promise<UserGamificationRecord | null>;
  fetchAchievementBadges: () => Promise<AchievementBadgeRecord[]>;
  unlockBadge: (badgeCode: string) => Promise<{ success: boolean; xpEarned?: number; badgeTitle?: string }>;

  // Rental Operations Ecosystem (V4.5)
  rentPayments: RentPaymentRecord[];
  leaseAgreements: LeaseAgreementRecord[];
  zeroDepositPass: ZeroDepositPassRecord | null;
  tenantVerification: TenantVerificationRecord | null;
  visitBookings: VisitBookingRecord[];
  serviceBookings: ServiceBookingRecord[];
  utilityRequests: UtilityRequestRecord[];
  vaultDocuments: DocumentVaultRecord[];

  fetchRentPayments: () => Promise<RentPaymentRecord[]>;
  payRent: (payload: Partial<RentPaymentRecord>) => Promise<{ success: boolean; data?: RentPaymentRecord; error?: string }>;
  fetchLeaseAgreements: () => Promise<LeaseAgreementRecord[]>;
  createLeaseAgreement: (payload: Partial<LeaseAgreementRecord>) => Promise<{ success: boolean; data?: LeaseAgreementRecord; error?: string }>;
  scheduleBiometrics: (agreementId: string, date: string, slot: string) => Promise<{ success: boolean; message: string }>;
  fetchZeroDepositPass: () => Promise<ZeroDepositPassRecord | null>;
  applyZeroDepositPass: (creditScore?: number, coverageAmount?: number) => Promise<{ success: boolean; data?: ZeroDepositPassRecord }>;
  fetchTenantVerification: () => Promise<TenantVerificationRecord | null>;
  updateTenantVerification: (updates: Partial<TenantVerificationRecord>) => Promise<{ success: boolean; data?: TenantVerificationRecord }>;
  fetchVisitBookings: () => Promise<VisitBookingRecord[]>;
  bookPropertyVisit: (payload: Partial<VisitBookingRecord>) => Promise<{ success: boolean; data?: VisitBookingRecord }>;
  fetchServiceBookings: (type?: ServiceBookingType) => Promise<ServiceBookingRecord[]>;
  bookService: (payload: Partial<ServiceBookingRecord>) => Promise<{ success: boolean; data?: ServiceBookingRecord }>;
  updateServiceBookingStatus: (bookingId: string, status: ServiceBookingRecord['status'], cancellationReason?: string) => Promise<{ success: boolean }>;
  rescheduleServiceBooking: (bookingId: string, bookingDate: string, timeSlot: string) => Promise<{ success: boolean }>;
  fetchUtilityRequests: () => Promise<UtilityRequestRecord[]>;
  createUtilityRequest: (payload: Partial<UtilityRequestRecord>) => Promise<{ success: boolean; data?: UtilityRequestRecord }>;
  updateUtilityStatus: (requestId: string, status: UtilityRequestRecord['status']) => Promise<{ success: boolean }>;
  fetchVaultDocuments: (category?: DocumentVaultType) => Promise<DocumentVaultRecord[]>;
  addVaultDocument: (payload: Partial<DocumentVaultRecord>) => Promise<{ success: boolean; data?: DocumentVaultRecord }>;
  deleteVaultDocument: (docId: string) => Promise<{ success: boolean }>;
  cancelVisitBooking: (visitId: string) => Promise<{ success: boolean }>;
  rescheduleVisitBooking: (visitId: string, newDate: string, newSlot: string) => Promise<{ success: boolean }>;
  toggleAutoPay: (mandateId: string, status: 'active' | 'paused' | 'revoked') => Promise<{ success: boolean }>;
  collectRent: (collectionId: string, method?: string) => Promise<boolean>;

  // V4.6 Owner Ecosystem State & Actions
  ownerProfile: OwnerProfile | null;
  ownerPlan: OwnerSubscriptionPlan | null;
  ownerDashboardSummary: OwnerDashboardSummary | null;
  tenantLeads: TenantLeadRecord[];
  ownerVisits: VisitCheckinRecord[];
  rentCollections: RentCollectionRecord[];
  ownerDocuments: OwnerDocumentRecord[];
  ownerNotifications: OwnerNotificationRecord[];
  unreadOwnerNotificationsCount: number;

  fetchOwnerEcosystemData: () => Promise<void>;
  updateOwnerProfileState: (updates: Partial<OwnerProfile>) => Promise<boolean>;
  upgradeOwnerPlanState: (tier: OwnerPlanTier, cycle?: OwnerPlanCycle) => Promise<boolean>;
  updateTenantLeadStatus: (leadId: string, status: TenantLeadStatus, notes?: string, rejectionReason?: string) => Promise<boolean>;
  addTenantLeadNote: (leadId: string, note: string) => Promise<boolean>;
  setTenantLeadReminder: (leadId: string, reminderDate: string) => Promise<boolean>;
  updateVisitCheckin: (visitId: string, status: VisitCheckinStatus, notes?: string) => Promise<boolean>;
  sendRentReminder: (collectionId: string) => Promise<{ success: boolean; reminderTier: string; message: string }>;
  recordRentPaymentCollected: (collectionId: string, method?: string) => Promise<boolean>;
  uploadOwnerDocument: (doc: Partial<OwnerDocumentRecord>) => Promise<boolean>;
  deleteOwnerDocument: (docId: string) => Promise<boolean>;
  markOwnerNotificationRead: (notifId: string) => Promise<void>;
  markAllOwnerNotificationsRead: () => Promise<void>;
  updateListingLifecycleStatus: (propertyId: string, status: ListingLifecycleStatus) => Promise<boolean>;

  // V5.5 Utilities + Trust & Safety Ecosystem
  emergencyContacts: EmergencyContactRecord[];
  societyPasses: SocietyEntryPassRecord[];
  maintenanceTickets: MaintenanceTicketRecord[];
  activeTicketMessages: MaintenanceTicketMessageRecord[];
  electricityBills: ElectricityBillRecord[];
  broadbandPlans: BroadbandPlanRecord[];
  broadbandBookings: BroadbandBookingRecord[];
  waterTankerBookings: WaterTankerBookingRecord[];
  pngGasBookings: PngGasBookingRecord[];
  moveIn30Checklist: MoveIn30ChecklistRecord[];

  fetchEmergencyContacts: () => Promise<EmergencyContactRecord[]>;
  addEmergencyContact: (contact: { name: string; phone: string; relationship: string; is_primary?: boolean }) => Promise<{ success: boolean; data?: EmergencyContactRecord; error?: string }>;
  deleteEmergencyContact: (contactId: string) => Promise<{ success: boolean }>;
  triggerSosAlert: (payload: { latitude?: number; longitude?: number; location_address?: string; alert_type?: 'general' | 'medical' | 'police' | 'fire' | 'women_safety' }) => Promise<{ success: boolean; data?: SosAlertRecord }>;
  resolveSosAlert: (alertId: string) => Promise<{ success: boolean }>;
  fetchSocietyPasses: () => Promise<SocietyEntryPassRecord[]>;
  createSocietyPass: (payload: { property_id?: string; pass_type: SocietyPassType; visitor_name: string; visitor_phone?: string; company_name?: string; vehicle_number?: string; valid_hours?: number }) => Promise<{ success: boolean; data?: SocietyEntryPassRecord; error?: string }>;
  cancelSocietyPass: (passId: string) => Promise<{ success: boolean; error?: string }>;
  fetchMaintenanceTickets: (propertyId?: string) => Promise<MaintenanceTicketRecord[]>;
  createMaintenanceTicket: (payload: { property_id?: string; category: MaintenanceTicketRecord['category']; urgency: MaintenanceTicketRecord['urgency']; title: string; description: string; photos?: string[] }) => Promise<{ success: boolean; data?: MaintenanceTicketRecord; error?: string }>;
  updateMaintenanceTicketStatus: (ticketId: string, status: MaintenanceTicketRecord['status']) => Promise<{ success: boolean }>;
  fetchTicketMessages: (ticketId: string) => Promise<MaintenanceTicketMessageRecord[]>;
  sendTicketMessage: (ticketId: string, message: string) => Promise<{ success: boolean; data?: MaintenanceTicketMessageRecord; error?: string }>;
  fetchElectricityBills: (consumerNumber?: string) => Promise<ElectricityBillRecord[]>;
  payElectricityBill: (billId: string, paymentMethod?: string) => Promise<{ success: boolean; paymentRef?: string; receiptUrl?: string; error?: string }>;
  fetchBroadbandPlans: (provider?: string) => Promise<BroadbandPlanRecord[]>;
  bookBroadbandInstallation: (payload: { property_id?: string; plan_id: string; provider: string; plan_name: string; installation_address: string; appointment_date: string; appointment_slot: string; monthly_price: number }) => Promise<{ success: boolean; data?: BroadbandBookingRecord; error?: string }>;
  bookWaterTanker: (payload: { property_id?: string; capacity_litres: number; water_type: 'potable' | 'domestic'; delivery_address: string; delivery_date: string; delivery_slot: string; amount?: number }) => Promise<{ success: boolean; data?: WaterTankerBookingRecord; error?: string }>;
  bookPngGas: (payload: { property_id?: string; provider?: string; consumer_bp_number?: string; connection_type: 'new' | 'transfer' | 'meter_reading'; initial_meter_reading?: number; meter_photo_url?: string }) => Promise<{ success: boolean; data?: PngGasBookingRecord; error?: string }>;
  fetchMoveIn30Checklist: () => Promise<MoveIn30ChecklistRecord[]>;
  toggleMoveIn30ChecklistItem: (itemId: string, completed: boolean) => Promise<{ success: boolean; error?: string }>;

  // Resident Services Ecosystem (V5.4.1 Production Sprint)
  utilityAccounts: UtilityAccountRecord[];
  utilityTransactions: UtilityTransactionRecord[];
  utilityAutopaySettings: AutopaySettingRecord[];
  serviceCategories: ServiceCategoryRecord[];
  technicians: TechnicianRecord[];
  homeServiceBookings: ServiceBookingRecord[];
  societyComplaints: SocietyComplaintRecord[];
  societyNotices: SocietyNoticeRecord[];
  visitorPasses: VisitorPassRecord[];
  deliveryPasses: DeliveryPassRecord[];
  amenityBookings: AmenityBookingRecord[];
  maintenancePayments: MaintenancePaymentRecord[];

  fetchUtilityAccounts: (category?: string) => Promise<UtilityAccountRecord[]>;
  saveUtilityAccount: (account: Partial<UtilityAccountRecord>) => Promise<{ success: boolean; data?: UtilityAccountRecord; error?: string }>;
  fetchUtilityTransactions: (accountId?: string) => Promise<UtilityTransactionRecord[]>;
  payUtilityBill: (payload: {
    accountId?: string;
    consumerNumber: string;
    billerName: string;
    category: UtilityAccountRecord['category'];
    amount: number;
    paymentMethod: string;
    transactionType?: string;
    referenceId?: string;
    meta?: Record<string, any>;
  }) => Promise<{ success: boolean; data?: UtilityTransactionRecord; error?: string }>;
  toggleUtilityAutopay: (accountId: string, isEnabled: boolean, maxAmount?: number) => Promise<{ success: boolean; data?: AutopaySettingRecord; error?: string }>;

  fetchServiceCategories: () => Promise<ServiceCategoryRecord[]>;
  fetchTechnicians: (categoryId?: string) => Promise<TechnicianRecord[]>;
  fetchHomeServiceBookings: () => Promise<ServiceBookingRecord[]>;
  bookHomeService: (payload: {
    category_id?: string;
    service_type: string;
    technician_id?: string;
    scheduled_date: string;
    time_slot: string;
    address: string;
    amount: number;
    payment_method?: string;
    notes?: string;
  }) => Promise<{ success: boolean; data?: ServiceBookingRecord; error?: string }>;
  cancelHomeService: (bookingId: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  verifyHomeServiceOtp: (bookingId: string, otp: string, type: 'start' | 'end') => Promise<{ success: boolean; error?: string }>;
  rateHomeService: (bookingId: string, technicianId: string, rating: number, review?: string) => Promise<{ success: boolean; error?: string }>;

  fetchSocietyComplaints: (societyName?: string) => Promise<SocietyComplaintRecord[]>;
  createSocietyComplaint: (payload: {
    society_name?: string;
    unit_number?: string;
    title: string;
    description: string;
    category: SocietyComplaintRecord['category'];
    priority?: SocietyComplaintRecord['priority'];
    images?: string[];
  }) => Promise<{ success: boolean; data?: SocietyComplaintRecord; error?: string }>;
  resolveSocietyComplaint: (complaintId: string) => Promise<{ success: boolean; error?: string }>;

  fetchSocietyNotices: (societyName?: string) => Promise<SocietyNoticeRecord[]>;
  fetchVisitorPasses: () => Promise<VisitorPassRecord[]>;
  createVisitorPass: (payload: {
    visitor_name: string;
    visitor_phone?: string;
    purpose?: string;
    visitor_type?: VisitorPassRecord['visitor_type'];
    unit_number?: string;
    society_name?: string;
    valid_from?: string;
    valid_until?: string;
    vehicle_number?: string;
  }) => Promise<{ success: boolean; data?: VisitorPassRecord; error?: string }>;

  fetchDeliveryPasses: () => Promise<DeliveryPassRecord[]>;
  createDeliveryPass: (payload: {
    company_name: string;
    delivery_person_name?: string;
    delivery_person_phone?: string;
    order_id?: string;
    unit_number?: string;
    society_name?: string;
    valid_until?: string;
  }) => Promise<{ success: boolean; data?: DeliveryPassRecord; error?: string }>;

  fetchAmenityBookings: () => Promise<AmenityBookingRecord[]>;
  bookSocietyAmenity: (payload: {
    amenity_name: string;
    booking_date: string;
    time_slot: string;
    society_name?: string;
    unit_number?: string;
    guest_count?: number;
    amount?: number;
  }) => Promise<{ success: boolean; data?: AmenityBookingRecord; error?: string }>;

  fetchMaintenancePayments: () => Promise<MaintenancePaymentRecord[]>;
  payMaintenanceBill: (payload: {
    society_name: string;
    unit_number: string;
    bill_month: string;
    amount: number;
    due_date?: string;
    payment_method?: string;
  }) => Promise<{ success: boolean; data?: MaintenancePaymentRecord; error?: string }>;

  // V6.2 AI Recommendations
  recommendations: RecommendedPropertyItem[];
  similarSavedProperties: RecommendedPropertyItem[];
  nearOfficeProperties: RecommendedPropertyItem[];
  trendingProperties: Property[];
  zeroDepositProperties: Property[];
  luxuryProperties: Property[];
  weekendPicks: Property[];
  recommendationLoading: boolean;
  refreshRecommendations: () => Promise<void>;
  trackPropertyView: (propertyId: string) => Promise<void>;
  markRecommendationInterested: (propertyId: string) => Promise<void>;
  markRecommendationNotInterested: (propertyId: string) => Promise<void>;

  // V6.2 AI Search & Smart Maps 2.0
  searchQuery: string;
  searchResults: Property[];
  mapProperties: Property[];
  advancedFilters: Partial<AdvancedFilterPayload>;
  savedSearches: SavedSearchRecord[];
  nearbyPlaces: CommuteHubRecord[];
  localityInsights: Record<string, LocalityScoreRecord>;
  setSearchQuery: (query: string) => void;
  performSmartSearch: (query?: string, filters?: Partial<AdvancedFilterPayload>) => Promise<void>;
  setAdvancedFilters: (filters: Partial<AdvancedFilterPayload>) => void;
  resetAdvancedFilters: () => void;
  fetchSavedSearches: () => Promise<void>;
  saveSearch: (name: string, filters?: Partial<AdvancedFilterPayload>) => Promise<boolean>;
  removeSavedSearch: (id: string) => Promise<boolean>;
  fetchLocalityScores: (locality: string) => Promise<LocalityScoreRecord>;
  fetchNearbyPlaces: (lat?: number, lng?: number, type?: CommuteHubType) => Promise<void>;

  // V6.3 AI Property Compare & Neighborhood Intelligence
  comparePropertyIds: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  localityScoresMap: Record<string, NeighborhoodScoresRecord>;
  crimeStatsMap: Record<string, LocalityCrimeStatsRecord>;
  aqiMap: Record<string, LocalityAirQualityRecord>;
  fetchNeighborhoodIntelligence: (locality: string) => Promise<void>;

  // V6.4 AI Assistant OS
  aiConversations: AIConversationRecord[];
  activeAiConversationId: string;
  aiMessages: AIChatMessage[];
  isAiTyping: boolean;
  userAIMemory: UserAIMemory;
  updateUserAIMemory: (memory: Partial<UserAIMemory>) => void;
  setAiConversations: (conversations: AIConversationRecord[]) => void;
  setActiveAiConversationId: (id: string) => void;
  addAiMessage: (message: AIChatMessage) => void;
  clearAiMessages: () => void;

  // V7.1 Real Maps + Camera + Voice AI Slices
  userLiveLocation: GeoPoint | null;
  savedPlaces: SavedPlaceRecord[];
  pendingMediaUploads: MediaUploadRecord[];
  activeUploadProgress: number;
  userOcrDocuments: OCRDocumentRecord[];
  recentVoiceQueries: VoiceQueryRecord[];
  voiceAILanguage: 'en-IN' | 'hi-IN' | 'hinglish';

  setUserLiveLocation: (location: GeoPoint | null) => void;
  setSavedPlaces: (places: SavedPlaceRecord[]) => void;
  addSavedPlace: (place: SavedPlaceRecord) => void;
  setPendingMediaUploads: (uploads: MediaUploadRecord[]) => void;
  setActiveUploadProgress: (progress: number) => void;
  setUserOcrDocuments: (docs: OCRDocumentRecord[]) => void;
  addOcrDocument: (doc: OCRDocumentRecord) => void;
  setRecentVoiceQueries: (queries: VoiceQueryRecord[]) => void;
  addVoiceQuery: (query: VoiceQueryRecord) => void;
  setVoiceAILanguage: (lang: 'en-IN' | 'hi-IN' | 'hinglish') => void;
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
  direct_owner_only: false,
  verified_only: false,
  amenities: [],
  sort_by: 'recommended',
};

const DEFAULT_INITIAL_CONVERSATIONS: Conversation[] = [];

const DEFAULT_INCOMING_WAVES: IncomingWave[] = [];

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isOnboarded: false,
  currentRole: 'RENTER',
  role: 'RENTER',
  userRole: 'renter',
  activeMode: 'renter',
  pendingAuthRole: 'renter',
  setPendingAuthRole: (role: 'renter' | 'owner' | 'admin') => set({ pendingAuthRole: role }),

  switchRole: async (newRole: UserRole | 'renter' | 'owner' | 'admin') => {
    const rawRole = (typeof newRole === 'string' ? newRole.toLowerCase() : 'renter') as 'renter' | 'owner' | 'admin';
    const normalizedMode: 'renter' | 'owner' | 'admin' =
      rawRole === 'owner' ? 'owner' : rawRole === 'admin' ? 'admin' : 'renter';
    const legacyRole: UserRole = (normalizedMode.toUpperCase() as any);

    set({
      activeMode: normalizedMode,
      currentRole: legacyRole,
      role: legacyRole,
    });
    await setItem('rehvo_active_mode', normalizedMode);

    if (normalizedMode === 'owner') {
      get().fetchMyProperties();
      get().fetchOwnerMetrics();
      get().fetchOwnerEcosystemData();
    }
    get().fetchEnquiries();
    get().fetchVisits();
    get().fetchConversations();
    get().showToast(
      `Switched to ${normalizedMode === 'owner' ? 'Owner' : normalizedMode === 'admin' ? 'Admin' : 'Renter'} Experience`,
      'info'
    );
  },

  switchMode: async (mode: 'renter' | 'owner' | 'admin') => {
    await get().switchRole(mode);
  },

  initializeRole: async () => {
    try {
      const savedActiveMode = (await getItem('rehvo_active_mode')) as string | null;
      if (savedActiveMode) {
        const mode = savedActiveMode.toLowerCase() as 'renter' | 'owner' | 'admin';
        if (mode === 'owner' || mode === 'renter' || mode === 'admin') {
          set({
            activeMode: mode,
            currentRole: (mode.toUpperCase() as any),
            role: (mode.toUpperCase() as any),
          });
        }
      }
    } catch {}
  },

  fetchRoleProfile: async () => {
    const { user, activeMode } = get();
    if (!user?.id) return;
     else if (activeMode === 'owner' || user.role?.toLowerCase() === 'owner') {
      await get().fetchOwnerEcosystemData();
    }
  },

  

  
  blockedUserIds: [],
  initialized: false,

  ownerMetrics: null,
  properties: [],
  myProperties: [],
  savedPropertyIds: [],
  activeFilter: DEFAULT_FILTER,
  selectedProperty: null,
  recentlyViewedIds: [],

  pgs: [],
  flatmates: CURATED_FLATMATES,
  myFlatmateProfile: null,
  flatmateDraft: null,
  propertyDraft: null,
  savedFlatmateIds: [],
  followingFlatmateIds: [],
  wavedFlatmateIds: [],
  acceptedWaveFlatmateIds: [],
  likedFlatmateIds: [],
  superLikedFlatmateIds: [],
  matchedFlatmateIds: [],
  swipeHistory: [],
  myFlatmateAnalytics: null,
  incomingWaves: DEFAULT_INCOMING_WAVES,

  visits: [],
  applications: [],
  enquiries: [],

  conversations: DEFAULT_INITIAL_CONVERSATIONS,
  activeConversationId: null,
  onlineUserIds: [],
  typingMap: {},

  notifications: [],
  unreadNotificationCount: 0,
  badgeCount: 0,
  pushToken: null,
  loadingNotifications: false,
  notificationPreferences: { ...notificationsService.DEFAULT_NOTIFICATION_PREFERENCES },
  notificationPrefs: { ...notificationsService.DEFAULT_NOTIFICATION_PREFERENCES },
  isNotificationPermissionModalVisible: false,
  reports: [],

  // Wallet, R-Cash & Rewards Ecosystem
  wallet: null,
  walletTransactions: [],
  rewardCampaigns: DEFAULT_REWARD_CAMPAIGNS,
  myRedemptions: [],
  referrals: [],
  challenges: DEFAULT_CHALLENGES,
  cashbackSummary: null,
  userBankAccounts: [],
  scratchCards: [],
  gamification: null,
  achievementBadges: [],

  // Rental Operations Ecosystem (V4.5)
  rentPayments: [],
  leaseAgreements: [],
  zeroDepositPass: null,
  tenantVerification: null,
  visitBookings: [],
  serviceBookings: [],
  utilityRequests: [],
  vaultDocuments: [],

  // V5.5 Utilities + Trust & Safety Ecosystem
  emergencyContacts: [],
  societyPasses: [],
  maintenanceTickets: [],
  activeTicketMessages: [],
  electricityBills: [],
  broadbandPlans: [],
  broadbandBookings: [],
  waterTankerBookings: [],
  pngGasBookings: [],
  moveIn30Checklist: [],

  // Resident Services Ecosystem (V5.4.1 Production Sprint)
  utilityAccounts: [],
  utilityTransactions: [],
  utilityAutopaySettings: [],
  serviceCategories: [],
  technicians: [],
  homeServiceBookings: [],
  societyComplaints: [],
  societyNotices: [],
  visitorPasses: [],
  deliveryPasses: [],
  amenityBookings: [],
  maintenancePayments: [],

  listingDraft: {
    category: 'residential',
    property_type: null,
    commercial_type: null,
    title: '',
    city: 'Mumbai',
    locality: '',
    address: '',
    rent: 0,
    deposit: 0,
    maintenance: 0,
    commission: 0,
    bhk: '',
    bathrooms: 1,
    washrooms: 2,
    area_sqft: 0,
    carpet_area: undefined,
    floor_number: undefined,
    total_floors: undefined,
    power_backup: false,
    lift: false,
    furnishing: 'SEMI_FURNISHED',
    available_from: new Date().toISOString().split('T')[0],
    amenities: [],
    images: [],
    description: '',
    additional_info: '',
    zero_commission: false,
    tenant_preferences: [],
    lease_type: undefined,
  },

  activeHostPlan: 'starter',
  setActiveHostPlan: (plan) => {
    set({ activeHostPlan: plan });
    if (plan) {
      setItem('rehvo_active_host_plan', plan);
    } else {
      removeItem('rehvo_active_host_plan');
    }
  },
  canListNewProperty: () => {
    const { myProperties, activeHostPlan } = get();
    if (myProperties.length === 0) {
      return { allowed: true };
    }
    if (!activeHostPlan) {
      return { allowed: false, reason: 'NO_PLAN' };
    }
    if (activeHostPlan === 'starter') {
      return { allowed: false, reason: 'LIMIT_REACHED' };
    }
    if (activeHostPlan === 'basic') {
      return myProperties.length < 1
        ? { allowed: true }
        : { allowed: false, reason: 'LIMIT_REACHED' };
    }
    if (activeHostPlan === 'growth') {
      return myProperties.length < 3
        ? { allowed: true }
        : { allowed: false, reason: 'LIMIT_REACHED' };
    }
    if (activeHostPlan === 'pro') {
      return myProperties.length < 10
        ? { allowed: true }
        : { allowed: false, reason: 'LIMIT_REACHED' };
    }
    return { allowed: true };
  },

  toastMessage: null,
  toastType: 'info',

  // V4.6 Owner Ecosystem initial state
  ownerProfile: null,
  ownerPlan: null,
  ownerDashboardSummary: null,
  tenantLeads: [],
  ownerVisits: [],
  rentCollections: [],
  ownerDocuments: [],
  ownerNotifications: [],
  unreadOwnerNotificationsCount: 0,

  initializeFromStorage: async () => {
    try {
      const savedOnboarded = await getItem('rehvo_onboarding_completed');
      const isOnboardedFlag = savedOnboarded === 'true';

      const savedFmProfile = await getItem('rehvo_my_flatmate_profile');
      const parsedFmProfile = savedFmProfile ? JSON.parse(savedFmProfile) : null;

      const savedFmDraft = await getItem('rehvo_flatmate_draft');
      const parsedFmDraft = savedFmDraft ? JSON.parse(savedFmDraft) : null;

      const savedPropDraft = await getItem('rehvo_property_draft');
      const parsedPropDraft = savedPropDraft ? JSON.parse(savedPropDraft) : null;

      const savedProps = await getItem('rehvo_properties');
      const parsedProps: Property[] = savedProps ? JSON.parse(savedProps) : [];

      const savedMyProps = await getItem('rehvo_my_properties');
      const parsedMyProps: Property[] = savedMyProps ? JSON.parse(savedMyProps) : [];

      const savedIds = await getItem('rehvo_saved_ids');
      const parsedIds = savedIds ? JSON.parse(savedIds) : [];

      const savedRecentlyViewed = await getItem('rehvo_recently_viewed_ids');
      const parsedRecentlyViewed: string[] = savedRecentlyViewed ? JSON.parse(savedRecentlyViewed) : [];

      const savedFmIds = await getItem('rehvo_saved_flatmate_ids');
      const parsedFmIds = savedFmIds ? JSON.parse(savedFmIds) : [];

      const savedFollowFmIds = await getItem('rehvo_following_flatmate_ids');
      const parsedFollowFmIds = savedFollowFmIds ? JSON.parse(savedFollowFmIds) : [];

      const savedWavedFmIds = await getItem('rehvo_waved_flatmate_ids');
      const parsedWavedFmIds = savedWavedFmIds ? JSON.parse(savedWavedFmIds) : [];

      const savedAcceptedFmIds = await getItem('rehvo_accepted_wave_flatmate_ids');
      const parsedAcceptedFmIds = savedAcceptedFmIds ? JSON.parse(savedAcceptedFmIds) : [];

      const savedIncomingWaves = await getItem('rehvo_incoming_waves');
      const parsedIncomingWaves: IncomingWave[] = savedIncomingWaves
        ? JSON.parse(savedIncomingWaves)
        : DEFAULT_INCOMING_WAVES;

      const savedHostPlan = (await getItem('rehvo_active_host_plan')) as 'starter' | 'basic' | 'growth' | 'pro' | null;
      const savedActiveMode = (await getItem('rehvo_active_mode')) as UserRole | null;

      const saved = await getItem('rehvo_auth_session');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id) {
            const rawSaved = (savedActiveMode || '').toLowerCase();
            const userPrimaryRole: 'renter' | 'owner' | 'admin' = parsed.role?.toLowerCase() === 'owner' ? 'owner' : parsed.role?.toLowerCase() === 'admin' ? 'admin' : 'renter';
            const normalizedMode: 'renter' | 'owner' | 'admin' = rawSaved === 'owner' ? 'owner' : rawSaved === 'admin' ? 'admin' : rawSaved === 'renter' ? 'renter' : userPrimaryRole;
            const effectiveRole: UserRole = (normalizedMode.toUpperCase() as any);

            set({
              user: parsed,
              isAuthenticated: true,
              isOnboarded: isOnboardedFlag || !!parsed.onboarding_completed,
              userRole: userPrimaryRole,
              activeMode: normalizedMode,
              currentRole: effectiveRole,
              role: effectiveRole,
              activeHostPlan: savedHostPlan || 'starter',
              properties: parsedProps,
              myProperties: parsedMyProps,
              myFlatmateProfile: parsedFmProfile,
              flatmateDraft: parsedFmDraft,
              propertyDraft: parsedPropDraft,
              savedPropertyIds: parsedIds,
              recentlyViewedIds: parsedRecentlyViewed,
              savedFlatmateIds: parsedFmIds,
              followingFlatmateIds: parsedFollowFmIds,
              wavedFlatmateIds: parsedWavedFmIds,
              acceptedWaveFlatmateIds: parsedAcceptedFmIds,
              incomingWaves: parsedIncomingWaves,
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
            get().fetchRoleProfile();
            get().fetchNotifications();
            get().fetchUnreadNotificationCount();
            get().fetchNotificationPreferences();
            get().registerDevicePushToken();
            get().syncBadgeCount();
            get().fetchWallet();
            get().fetchWalletTransactions();
            get().fetchRewardCampaigns();
            get().fetchMyRedemptions();
            get().fetchReferrals();
            get().fetchChallenges();
            get().fetchCashbackSummary();
            get().fetchRentPayments();
            get().fetchLeaseAgreements();
            get().fetchZeroDepositPass();
            get().fetchTenantVerification();
            get().fetchVisitBookings();
            get().fetchServiceBookings();
            get().fetchUtilityRequests();
            get().fetchVaultDocuments();
            get().fetchEmergencyContacts();
            get().fetchSocietyPasses();
            get().fetchMaintenanceTickets();
            get().fetchElectricityBills();
            get().fetchBroadbandPlans();
            get().fetchMoveIn30Checklist();
            get().fetchUtilityAccounts();
            get().fetchUtilityTransactions();
            get().fetchServiceCategories();
            get().fetchHomeServiceBookings();
            get().fetchSocietyComplaints();
            get().fetchSocietyNotices();
            get().fetchVisitorPasses();
            get().fetchDeliveryPasses();
            get().fetchAmenityBookings();
            get().fetchMaintenancePayments();
            return;
          }
        } catch {
          // Session parse error handled silently
        }
      }

      set({
        user: null,
        isAuthenticated: false,
        isOnboarded: isOnboardedFlag,
        activeHostPlan: 'starter',
        properties: parsedProps,
        myProperties: [],
        myFlatmateProfile: null,
        flatmateDraft: null,
        propertyDraft: null,
        savedPropertyIds: [],
        recentlyViewedIds: parsedRecentlyViewed,
        savedFlatmateIds: [],
        followingFlatmateIds: [],
        wavedFlatmateIds: [],
        acceptedWaveFlatmateIds: [],
        incomingWaves: [],
        visits: [],
        applications: [],
        enquiries: [],
        conversations: [],
        notifications: [],
        unreadNotificationCount: 0,
        initialized: true,
      });
      // Fetch live published properties & flatmates from Supabase for guest browsing
      get().fetchProperties();
      get().fetchPublishedFlatmates();
      get().fetchRewardCampaigns();
      get().fetchChallenges();
      get().fetchOwnerEcosystemData();
    } catch {
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
      kyc_verified: userData.kyc_verified ?? (userData.verification_status === 'VERIFIED'),
      kyc_status: userData.kyc_status || (userData.verification_status === 'VERIFIED' ? 'verified' : 'unverified'),
      aadhaar_last4: userData.aadhaar_last4 || undefined,
      pan_number: userData.pan_number || undefined,
      digilocker_verified: userData.digilocker_verified ?? false,
      digilocker_verified_at: userData.digilocker_verified_at || undefined,
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
    const userRoleLower: 'renter' | 'owner' | 'admin' = user.role?.toLowerCase() === 'owner' ? 'owner' : user.role?.toLowerCase() === 'admin' ? 'admin' : 'renter';
    const currentActiveMode = get().activeMode || userRoleLower;
    const legacyRole: UserRole = (currentActiveMode.toUpperCase() as any);

    set({
      user,
      isAuthenticated: true,
      isOnboarded: isCompleted,
      userRole: userRoleLower,
      activeMode: currentActiveMode,
      currentRole: legacyRole,
      role: legacyRole,
    });
    get().fetchRoleProfile();
    get().fetchSavedIds();
    get().fetchMyProperties();
    get().fetchOwnerMetrics();
    get().fetchMyFlatmateProfile();
    get().fetchEnquiries();
    get().fetchVisits();
    get().fetchConversations();
    get().fetchNotifications();
    get().fetchUnreadNotificationCount();
    get().fetchNotificationPreferences();
    get().registerDevicePushToken();
    get().syncBadgeCount();
    get().fetchWallet();
    get().fetchWalletTransactions();
    get().fetchRewardCampaigns();
    get().fetchMyRedemptions();
    get().fetchReferrals();
    get().fetchChallenges();
    get().fetchCashbackSummary();
    get().fetchRentPayments();
    get().fetchLeaseAgreements();
    get().fetchZeroDepositPass();
    get().fetchTenantVerification();
    get().fetchVisitBookings();
    get().fetchServiceBookings();
    get().fetchUtilityRequests();
    get().fetchVaultDocuments();
    get().fetchEmergencyContacts();
    get().fetchSocietyPasses();
    get().fetchMaintenanceTickets();
    get().fetchElectricityBills();
    get().fetchBroadbandPlans();
    get().fetchMoveIn30Checklist();
    get().fetchUtilityAccounts();
    get().fetchUtilityTransactions();
    get().fetchServiceCategories();
    get().fetchHomeServiceBookings();
    get().fetchSocietyComplaints();
    get().fetchSocietyNotices();
    get().fetchVisitorPasses();
    get().fetchDeliveryPasses();
    get().fetchAmenityBookings();
    get().fetchMaintenancePayments();
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
    removeItem('rehvo_active_mode');
    get().unregisterDevicePushToken();
    set({
      user: null,
      isAuthenticated: false,
      isOnboarded: true,
      userRole: 'renter',
      activeMode: 'renter',
      pendingAuthRole: 'renter',
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
      notificationPrefs: { ...notificationsService.DEFAULT_NOTIFICATION_PREFERENCES },
      isNotificationPermissionModalVisible: false,
      selectedProperty: null,
      currentRole: 'RENTER',
      role: 'RENTER',
      wallet: null,
      walletTransactions: [],
      myRedemptions: [],
      referrals: [],
      cashbackSummary: null,
      rentPayments: [],
      leaseAgreements: [],
      zeroDepositPass: null,
      tenantVerification: null,
      visitBookings: [],
      serviceBookings: [],
      utilityRequests: [],
      vaultDocuments: [],
      emergencyContacts: [],
      societyPasses: [],
      maintenanceTickets: [],
      activeTicketMessages: [],
      electricityBills: [],
      broadbandPlans: [],
      broadbandBookings: [],
      waterTankerBookings: [],
      pngGasBookings: [],
      moveIn30Checklist: [],
      utilityAccounts: [],
      utilityTransactions: [],
      utilityAutopaySettings: [],
      serviceCategories: [],
      technicians: [],
      homeServiceBookings: [],
      societyComplaints: [],
      societyNotices: [],
      visitorPasses: [],
      deliveryPasses: [],
      amenityBookings: [],
      maintenancePayments: [],
    });
    get().fetchProperties();
    get().fetchPublishedFlatmates();
    get().fetchRewardCampaigns();
    get().fetchChallenges();
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
    const { user, recentlyViewedIds } = get();
    const updatedRecentlyViewed = [
      propertyId,
      ...(recentlyViewedIds || []).filter((id) => id !== propertyId),
    ].slice(0, 20);
    set({ recentlyViewedIds: updatedRecentlyViewed });
    setItem('rehvo_recently_viewed_ids', JSON.stringify(updatedRecentlyViewed));

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

    const prevMyProperties = myProperties;
    const prevProperties = properties;
    const prevSavedIds = savedPropertyIds;
    const prevVisits = visits;
    const prevApps = applications;
    const prevEnquiries = enquiries;

    const updatedMyProperties = myProperties.filter((p) => p.id !== id);
    const updatedProperties = properties.filter((p) => p.id !== id);
    const updatedSavedIds = savedPropertyIds.filter((pid) => pid !== id);
    const updatedVisits = visits.filter((v) => v.property_id !== id);
    const updatedApps = applications.filter((a) => a.property_id !== id);
    const updatedEnquiries = enquiries.filter((e) => e.property_id !== id);
    const willHaveNoProperties = updatedMyProperties.length === 0;

    // Optimistic local update (<10ms response)
    set((state) => ({
      myProperties: updatedMyProperties,
      properties: updatedProperties,
      savedPropertyIds: updatedSavedIds,
      visits: updatedVisits,
      applications: updatedApps,
      enquiries: updatedEnquiries,
      selectedProperty: state.selectedProperty?.id === id ? null : state.selectedProperty,
      currentRole: willHaveNoProperties ? 'RENTER' : state.currentRole,
      role: willHaveNoProperties ? 'RENTER' : state.role,
    }));
    setItem('rehvo_my_properties', JSON.stringify(updatedMyProperties));
    setItem('rehvo_properties', JSON.stringify(updatedProperties));
    setItem('rehvo_saved_ids', JSON.stringify(updatedSavedIds));
    get().showToast('Property deleted.', 'info');

    try {
      const res = await propertyService.deleteProperty(id);
      if (!res.success) {
        // Rollback optimistic update
        set({
          myProperties: prevMyProperties,
          properties: prevProperties,
          savedPropertyIds: prevSavedIds,
          visits: prevVisits,
          applications: prevApps,
          enquiries: prevEnquiries,
        });
        setItem('rehvo_my_properties', JSON.stringify(prevMyProperties));
        setItem('rehvo_properties', JSON.stringify(prevProperties));
        setItem('rehvo_saved_ids', JSON.stringify(prevSavedIds));
        const errorMsg = res.error || "Couldn't delete this property.";
        get().showToast(errorMsg, 'error');
        return { success: false, error: errorMsg };
      }

      get().fetchOwnerMetrics();
      return { success: true };
    } catch {
      set({
        myProperties: prevMyProperties,
        properties: prevProperties,
        savedPropertyIds: prevSavedIds,
        visits: prevVisits,
        applications: prevApps,
        enquiries: prevEnquiries,
      });
      setItem('rehvo_my_properties', JSON.stringify(prevMyProperties));
      setItem('rehvo_properties', JSON.stringify(prevProperties));
      setItem('rehvo_saved_ids', JSON.stringify(prevSavedIds));
      get().showToast("Couldn't delete this property. Please try again.", 'error');
      return {
        success: false,
        error: "Couldn't delete this property. Please try again.",
      };
    }
  },

  duplicateProperty: async (id: string) => {
    const { user } = get();
    try {
      const res = await propertyService.duplicateProperty(id, user?.id);
      if (res.success && res.data) {
        const created = res.data;
        const updatedMyProperties = [created, ...get().myProperties];
        const updatedProperties = [created, ...get().properties];
        await setItem('rehvo_my_properties', JSON.stringify(updatedMyProperties));
        await setItem('rehvo_properties', JSON.stringify(updatedProperties));
        set({
          myProperties: updatedMyProperties,
          properties: updatedProperties,
        });
        get().showToast('Listing duplicated as draft', 'success');
        return { success: true, data: created };
      }
      const errMsg = res.error || 'Failed to duplicate property';
      get().showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    } catch (e: any) {
      const errMsg = e?.message || 'Failed to duplicate property';
      get().showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  },

  markPropertyRented: async (id: string) => {
    const prevMyProperties = get().myProperties;
    const prevProperties = get().properties;

    // Optimistic local update
    const updatedMyProperties = prevMyProperties.map((p) =>
      p.id === id ? { ...p, status: 'RENTED' as const } : p
    );
    const updatedProperties = prevProperties.map((p) =>
      p.id === id ? { ...p, status: 'RENTED' as const } : p
    );
    set({
      myProperties: updatedMyProperties,
      properties: updatedProperties,
    });
    setItem('rehvo_my_properties', JSON.stringify(updatedMyProperties));
    setItem('rehvo_properties', JSON.stringify(updatedProperties));
    get().showToast('Listing marked as rented', 'success');

    try {
      const res = await propertyService.markPropertyRented(id);
      if (res.success) {
        return { success: true };
      }
      // Revert if failed
      set({
        myProperties: prevMyProperties,
        properties: prevProperties,
      });
      setItem('rehvo_my_properties', JSON.stringify(prevMyProperties));
      setItem('rehvo_properties', JSON.stringify(prevProperties));
      const errMsg = res.error || 'Failed to update property status';
      get().showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    } catch (e: any) {
      set({
        myProperties: prevMyProperties,
        properties: prevProperties,
      });
      setItem('rehvo_my_properties', JSON.stringify(prevMyProperties));
      setItem('rehvo_properties', JSON.stringify(prevProperties));
      const errMsg = e?.message || 'Failed to update property status';
      get().showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  },

  markPropertyExpired: async (id: string) => {
    const prevMyProperties = get().myProperties;
    const prevProperties = get().properties;

    // Optimistic local update
    const updatedMyProperties = prevMyProperties.map((p) =>
      p.id === id ? { ...p, status: 'EXPIRED' as const } : p
    );
    const updatedProperties = prevProperties.map((p) =>
      p.id === id ? { ...p, status: 'EXPIRED' as const } : p
    );
    set({
      myProperties: updatedMyProperties,
      properties: updatedProperties,
    });
    setItem('rehvo_my_properties', JSON.stringify(updatedMyProperties));
    setItem('rehvo_properties', JSON.stringify(updatedProperties));
    get().showToast('Listing paused/expired', 'info');

    try {
      const res = await propertyService.markPropertyExpired(id);
      if (res.success) {
        return { success: true };
      }
      set({
        myProperties: prevMyProperties,
        properties: prevProperties,
      });
      setItem('rehvo_my_properties', JSON.stringify(prevMyProperties));
      setItem('rehvo_properties', JSON.stringify(prevProperties));
      const errMsg = res.error || 'Failed to expire property';
      get().showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    } catch (e: any) {
      set({
        myProperties: prevMyProperties,
        properties: prevProperties,
      });
      setItem('rehvo_my_properties', JSON.stringify(prevMyProperties));
      setItem('rehvo_properties', JSON.stringify(prevProperties));
      const errMsg = e?.message || 'Failed to expire property';
      get().showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  },

  reportPropertyListing: async (propertyId: string, reason: string, description: string) => {
    const { user } = get();
    try {
      const res = await propertyService.reportProperty(propertyId, reason, description, user?.id);
      if (res.success) {
        get().showToast('Report submitted for review. Thank you.', 'success');
        return { success: true };
      }
      const errMsg = res.error || 'Failed to submit report';
      get().showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    } catch (e: any) {
      const errMsg = e?.message || 'Failed to submit report';
      get().showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  },

  getPropertyAnalytics: async (propertyId: string) => {
    return propertyService.getPropertySpecificAnalytics(propertyId);
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
    } else if (!exists) {
      // Asynchronously notify property owner
      const prop = properties.find((p) => p.id === id);
      if (prop?.owner_id && prop.owner_id !== user.id) {
        notificationsService
          .createNotification({
            userId: prop.owner_id,
            type: 'property_saved',
            title: '❤️ Property Saved',
            body: `${user.name || 'A prospective tenant'} saved ${prop.title} to their wishlist.`,
            data: { property_id: id },
          })
          .catch(() => {});
      }
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
    const { user } = get();
    if (!user?.id) {
      get().showToast('Please sign in to submit a rental application', 'info');
      return;
    }
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

      // Asynchronously notify property owner
      const prop = get().properties.find((p) => p.id === propertyId);
      if (prop?.owner_id && prop.owner_id !== user.id) {
        notificationsService
          .createNotification({
            userId: prop.owner_id,
            type: 'enquiry',
            title: '📩 New Property Inquiry',
            body: `${user.name || 'A prospective tenant'} inquired about ${prop.title}: "${message.slice(0, 50)}..."`,
            data: { property_id: propertyId, enquiry_id: res.data.id },
          })
          .catch(() => {});
      }

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

  fetchFlatmates: async (filter) => {
    return get().fetchPublishedFlatmates(filter);
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

  createFlatmateProfile: async (profileData, photoUri) => {
    return get().addFlatmateProfile(profileData as any, photoUri);
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

  saveFlatmate: async (id: string) => {
    const { savedFlatmateIds } = get();
    if (!savedFlatmateIds.includes(id)) {
      await get().toggleSaveFlatmate(id);
    }
  },

  unsaveFlatmate: async (id: string) => {
    const { savedFlatmateIds } = get();
    if (savedFlatmateIds.includes(id)) {
      await get().toggleSaveFlatmate(id);
    }
  },

  isFlatmateSaved: (id: string) => {
    return (get().savedFlatmateIds || []).includes(id);
  },

  toggleFollowFlatmate: async (id: string, flatmateName?: string) => {
    const { user, followingFlatmateIds, flatmates } = get();
    if (!user?.id) {
      get().showToast('Please log in to follow flatmates', 'info');
      return false;
    }

    const isFollowing = followingFlatmateIds.includes(id);
    const updated = isFollowing
      ? followingFlatmateIds.filter((fid) => fid !== id)
      : [...followingFlatmateIds, id];

    // Optimistically update flatmates list with incremented/decremented follower count
    const updatedList = flatmates.map((f) => {
      if (f.id === id) {
        const currentCount = f.followers_count || 12;
        return {
          ...f,
          followers_count: Math.max(0, isFollowing ? currentCount - 1 : currentCount + 1),
        };
      }
      return f;
    });

    set({ followingFlatmateIds: updated, flatmates: updatedList });
    setItem('rehvo_following_flatmate_ids', JSON.stringify(updated));

    get().showToast(
      isFollowing
        ? `Unfollowed ${flatmateName || 'flatmate'}`
        : `🎉 You are now following ${flatmateName || 'flatmate'}!`,
      'success'
    );

    return !isFollowing;
  },

  verifyFlatmateKyc: async (id: string, kycData?: any) => {
    const { myFlatmateProfile, flatmates } = get();
    if (!myFlatmateProfile) {
      get().showToast('No flatmate profile found', 'error');
      return false;
    }

    const legalName = kycData?.legalName ? kycData.legalName.trim() : myFlatmateProfile.name;

    const updatedProfile: FlatmateProfile = {
      ...myFlatmateProfile,
      name: legalName,
      is_kyc_verified: true,
      kyc_status: 'verified',
    };

    const updatedList = flatmates.map((f) =>
      f.id === id ? { ...f, name: legalName, is_kyc_verified: true, kyc_status: 'verified' as const } : f
    );

    set({ myFlatmateProfile: updatedProfile, flatmates: updatedList });
    setItem('rehvo_my_flatmate_profile', JSON.stringify(updatedProfile));

    get().showToast(
      '🎉 Roommate Profile Verified! (Aadhaar name locked for security)',
      'success'
    );

    // Call backend profile update
    flatmateService.updateFlatmateProfile(id, {
      name: legalName,
      is_kyc_verified: true,
      kyc_status: 'verified',
    });

    return true;
  },

  saveFlatmateDraft: (draft) => {
    setItem('rehvo_flatmate_draft', JSON.stringify(draft));
    set({ flatmateDraft: draft });
  },

  clearFlatmateDraft: () => {
    removeItem('rehvo_flatmate_draft');
    set({ flatmateDraft: null });
  },

  swipeFlatmate: async (flatmateId, action) => {
    const { likedFlatmateIds, superLikedFlatmateIds, matchedFlatmateIds, flatmates, swipeHistory } = get();
    const target = flatmates.find((f) => f.id === flatmateId);

    if (target) {
      set({
        swipeHistory: [{ flatmate: target, action }, ...swipeHistory].slice(0, 30),
      });
    }

    if (action === 'skip') {
      return { isMatch: false, flatmate: target };
    }

    const updatedLikes = Array.from(new Set([...likedFlatmateIds, flatmateId]));
    let updatedSuper = superLikedFlatmateIds;
    if (action === 'superlike') {
      updatedSuper = Array.from(new Set([...superLikedFlatmateIds, flatmateId]));
      get().showToast(`⚡ Super Liked ${target?.name || 'profile'}!`, 'success');
    }

    const isMatch = (target?.match_score || 90) >= 92 || action === 'superlike';
    let updatedMatches = matchedFlatmateIds;
    if (isMatch && !matchedFlatmateIds.includes(flatmateId)) {
      updatedMatches = [...matchedFlatmateIds, flatmateId];
      if (target) {
        get().startOrGetFlatmateConversation(target);
      }
    }

    set({
      likedFlatmateIds: updatedLikes,
      superLikedFlatmateIds: updatedSuper,
      matchedFlatmateIds: updatedMatches,
    });

    setItem('rehvo_liked_flatmate_ids', JSON.stringify(updatedLikes));
    setItem('rehvo_super_flatmate_ids', JSON.stringify(updatedSuper));
    setItem('rehvo_matched_flatmate_ids', JSON.stringify(updatedMatches));

    return { isMatch, flatmate: target };
  },

  undoLastSwipe: () => {
    const { swipeHistory, likedFlatmateIds, superLikedFlatmateIds } = get();
    if (swipeHistory.length === 0) return null;

    const [lastSwiped, ...remainingHistory] = swipeHistory;
    const restoredId = lastSwiped.flatmate.id;

    const updatedLikes = likedFlatmateIds.filter((id) => id !== restoredId);
    const updatedSuper = superLikedFlatmateIds.filter((id) => id !== restoredId);

    set({
      swipeHistory: remainingHistory,
      likedFlatmateIds: updatedLikes,
      superLikedFlatmateIds: updatedSuper,
    });

    setItem('rehvo_liked_flatmate_ids', JSON.stringify(updatedLikes));
    setItem('rehvo_super_flatmate_ids', JSON.stringify(updatedSuper));

    get().showToast(`Restored ${lastSwiped.flatmate.name}'s profile`, 'info');
    return lastSwiped.flatmate;
  },

  superWaveFlatmate: async (flatmateId: string, message?: string) => {
    const { flatmates } = get();
    const target = flatmates.find((f) => f.id === flatmateId);
    const res = await flatmateService.sendWave(
      flatmateId,
      target?.name || 'Roommate',
      target?.avatar,
      target?.locality,
      message,
      true
    );

    if (res.success) {
      set((state) => ({
        superLikedFlatmateIds: Array.from(new Set([...state.superLikedFlatmateIds, flatmateId])),
        wavedFlatmateIds: Array.from(new Set([...state.wavedFlatmateIds, flatmateId])),
      }));
      get().showToast(`⭐ Super Wave sent to ${target?.name || 'roommate'}!`, 'success');
      return { success: true, isMatched: res.data?.isMatched };
    }

    get().showToast(res.error || 'Failed to send super wave', 'error');
    return { success: false };
  },

  fetchMyFlatmateAnalytics: async () => {
    const { myFlatmateProfile, user } = get();
    if (!myFlatmateProfile) return null;

    const res = await flatmateService.getFlatmateAnalytics(myFlatmateProfile.id, user?.id);
    if (res.success && res.data) {
      set({ myFlatmateAnalytics: res.data });
      return res.data;
    }
    return get().myFlatmateAnalytics;
  },

  savePropertyDraft: (draft) => {
    const current = get().propertyDraft || {};
    const merged: PropertyDraft = {
      ...current,
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    setItem('rehvo_property_draft', JSON.stringify(merged));
    set({ propertyDraft: merged });
  },

  clearPropertyDraft: () => {
    removeItem('rehvo_property_draft');
    set({ propertyDraft: null });
  },

  fetchConversations: async () => {
    let userId = get().user?.id;
    if (!userId) {
      const { data: authData } = await supabase.auth.getUser();
      userId = authData?.user?.id;
    }
    if (!userId) {
      return get().conversations;
    }

    const res = await chatService.getConversations(userId);
    if (res.success && res.data) {
      set({ conversations: res.data || [] });
      return res.data;
    }
    return get().conversations;
  },

  fetchConversationById: async (id: string) => {
    let userId = get().user?.id;
    if (!userId) {
      const { data: authData } = await supabase.auth.getUser();
      userId = authData?.user?.id;
    }
    if (!userId || !id) return null;

    const res = await chatService.getConversationById(id, userId);
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
    const { user, myFlatmateProfile, conversations } = get();

    if (
      (flatmate.user_id && user?.id && user.id === flatmate.user_id) ||
      (myFlatmateProfile && myFlatmateProfile.id === flatmate.id)
    ) {
      get().showToast('You cannot chat with yourself.', 'info');
      return '';
    }

    // 1. Ensure sender has a valid Supabase user session & profile
    const sessionRes = await authService.ensureUserSession();
    const effectiveUserId = sessionRes?.userId || user?.id;
    if (!effectiveUserId) {
      get().showToast('Please sign in to chat with flatmates', 'info');
      return '';
    }
    const effectiveUserName = user?.name || sessionRes?.name || 'REHVO Member';
    const effectiveUserAvatar = user?.avatar;

    try {
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
      }
    } catch {
      // Chat init fallback
    }

    // Fallback: create or retrieve local conversation for this exact flatmate
    const convId = `conv_flatmate_${flatmate.id}`;
    const existing = conversations.find(
      (c) => c.id === convId || c.flatmate_profile_id === flatmate.id
    );

    if (existing) {
      set({ activeConversationId: existing.id });
      return existing.id;
    }

    const newConv: Conversation = {
      id: convId,
      type: 'flatmate',
      flatmate_profile_id: flatmate.id,
      flatmate_name: flatmate.name,
      flatmate_avatar:
        flatmate.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      flatmate_locality: flatmate.locality || 'Mumbai',
      flatmate_budget: flatmate.budget_max,
      match_score: flatmate.match_score || 96,
      other_user_id: flatmate.user_id || flatmate.id,
      other_user_name: flatmate.name,
      other_user_avatar:
        flatmate.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      renter_id: effectiveUserId,
      renter_name: effectiveUserName,
      renter_avatar: effectiveUserAvatar,
      owner_id: flatmate.user_id || flatmate.id,
      owner_name: flatmate.name,
      owner_avatar:
        flatmate.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      property_locality: flatmate.locality || 'Mumbai',
      last_message: `👋 Hi ${flatmate.name}! Let's connect on REHVO.`,
      updated_at: new Date().toISOString(),
      unread_count: 0,
      messages: [
        {
          id: `msg_init_${Date.now()}`,
          conversation_id: convId,
          sender_id: 'other',
          sender_name: flatmate.name,
          sender_avatar: flatmate.avatar,
          text: `👋 Hi! Thanks for connecting. I'm looking for a flatmate in ${
            flatmate.locality || 'Mumbai'
          }. Feel free to ask anything!`,
          created_at: new Date().toISOString(),
          is_read: true,
        },
      ],
    };

    set((state) => ({
      conversations: [newConv, ...state.conversations.filter((c) => c.id !== convId)],
      activeConversationId: convId,
    }));

    return convId;
  },

  sendFlatmateWave: async (flatmateId, flatmateName, flatmateAvatar, locality) => {
    const { user, wavedFlatmateIds, conversations, flatmates } = get();

    if (wavedFlatmateIds.includes(flatmateId)) {
      get().showToast(`You already waved at ${flatmateName}!`, 'info');
      return { success: true };
    }

    // 1. Ensure active Supabase session for sender
    const sessionRes = await authService.ensureUserSession();
    const senderId = sessionRes?.userId || user?.id;
    if (!senderId) {
      get().showToast('Please sign in to wave at flatmates', 'info');
      return { success: false, error: 'User not signed in' };
    }
    const effectiveUserName = user?.name || sessionRes?.name || 'REHVO Member';
    const effectiveUserAvatar = user?.avatar;

    // 2. Resolve recipient user_id from flatmates list or Supabase
    let recipientUserId: string | undefined;
    const matchedFm = flatmates.find((f) => f.id === flatmateId);
    if (matchedFm?.user_id) {
      recipientUserId = matchedFm.user_id;
    } else {
      try {
        const { data: fpRow } = await supabase
          .from('flatmate_profiles')
          .select('user_id')
          .eq('id', flatmateId)
          .maybeSingle();
        if (fpRow?.user_id) {
          recipientUserId = fpRow.user_id;
        }
      } catch {
        // Recipient resolution fallback
      }
    }

    // 3. Create or find conversation thread in Supabase
    let realConvId: string | undefined;
    try {
      const convRes = await chatService.getOrCreateFlatmateConversation(flatmateId);
      if (convRes.success && convRes.data) {
        realConvId = convRes.data.id;
      }
    } catch {
      // Wave conversation creation fallback
    }

    const convId = realConvId || `conv_flatmate_${flatmateId}`;
    const existingConv = conversations.find(
      (c) => c.flatmate_profile_id === flatmateId || c.id === convId
    );

    const waveMsgText = `👋 Hey ${flatmateName}! I noticed we're looking in ${
      locality || 'Mumbai'
    }. Waved to connect!`;

    const waveMsg: Message = {
      id: `msg_wave_${Date.now()}`,
      conversation_id: convId,
      sender_id: senderId,
      sender_name: effectiveUserName,
      sender_avatar: effectiveUserAvatar,
      text: waveMsgText,
      created_at: new Date().toISOString(),
      is_read: true,
    };

    // 4. Send wave message into Supabase
    if (realConvId) {
      chatService.sendMessage(realConvId, waveMsgText).catch(() => {});
    }

    // 5. Create in-app notification in Supabase for the recipient
    if (recipientUserId && recipientUserId !== senderId) {
      notificationsService
        .createNotification({
          userId: recipientUserId,
          type: 'flatmate_wave',
          title: '👋 New Flatmate Wave!',
          body: `${effectiveUserName} waved at your roommate profile in ${
            locality || 'Mumbai'
          }. Tap to wave back and chat!`,
          data: {
            conversation_id: convId,
            flatmate_id: flatmateId,
            sender_id: senderId,
            sender_name: effectiveUserName,
            sender_avatar: effectiveUserAvatar,
          },
        })
        .catch(() => {});
    }

    let updatedConv: Conversation;
    if (existingConv) {
      updatedConv = {
        ...existingConv,
        id: convId,
        last_message: waveMsg.text,
        updated_at: waveMsg.created_at,
        messages: [...(existingConv.messages || []), waveMsg],
      };
    } else {
      updatedConv = {
        id: convId,
        type: 'flatmate',
        flatmate_profile_id: flatmateId,
        flatmate_name: flatmateName,
        flatmate_avatar:
          flatmateAvatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        flatmate_locality: locality || 'Mumbai',
        match_score: 96,
        other_user_id: recipientUserId || flatmateId,
        other_user_name: flatmateName,
        other_user_avatar:
          flatmateAvatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        renter_id: senderId,
        renter_name: effectiveUserName,
        renter_avatar: effectiveUserAvatar,
        owner_id: recipientUserId || flatmateId,
        owner_name: flatmateName,
        owner_avatar:
          flatmateAvatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        property_locality: locality || 'Mumbai',
        last_message: waveMsg.text,
        updated_at: waveMsg.created_at,
        unread_count: 0,
        messages: [waveMsg],
      };
    }

    // Local notification for self
    const waveNotification: NotificationItem = {
      id: `notif_wave_${Date.now()}`,
      user_id: senderId,
      title: '👋 Flatmate Wave Sent!',
      body: `You waved at ${flatmateName}'s profile in ${locality || 'Mumbai'}.`,
      type: 'flatmate_wave',
      data: {
        conversation_id: convId,
        flatmate_id: flatmateId,
        sender_name: effectiveUserName,
        sender_avatar: effectiveUserAvatar,
      },
      read: false,
      created_at: new Date().toISOString(),
    };

    // Check if other user already sent an incoming wave to us (Mutual Match!)
    const { incomingWaves, acceptedWaveFlatmateIds } = get();
    const hasIncomingWave = incomingWaves.some(
      (w) =>
        (w.flatmate_id === flatmateId ||
          w.sender_name.toLowerCase() === flatmateName.toLowerCase()) &&
        w.status === 'pending'
    );

    const newWavedIds = Array.from(new Set([...wavedFlatmateIds, flatmateId]));
    setItem('rehvo_waved_flatmate_ids', JSON.stringify(newWavedIds));

    let isMutualMatch = false;
    let newAcceptedIds = acceptedWaveFlatmateIds;
    let updatedIncoming = incomingWaves;

    if (hasIncomingWave) {
      isMutualMatch = true;
      newAcceptedIds = Array.from(new Set([...acceptedWaveFlatmateIds, flatmateId]));
      updatedIncoming = incomingWaves.map((w) =>
        w.flatmate_id === flatmateId ||
        w.sender_name.toLowerCase() === flatmateName.toLowerCase()
          ? { ...w, status: 'accepted' as const }
          : w
      );
      setItem('rehvo_accepted_wave_flatmate_ids', JSON.stringify(newAcceptedIds));
      setItem('rehvo_incoming_waves', JSON.stringify(updatedIncoming));
    }

    set((state) => ({
      wavedFlatmateIds: newWavedIds,
      acceptedWaveFlatmateIds: newAcceptedIds,
      incomingWaves: updatedIncoming,
      conversations: [
        updatedConv,
        ...state.conversations.filter((c) => c.id !== updatedConv.id),
      ],
      notifications: [waveNotification, ...state.notifications],
      unreadNotificationCount: state.unreadNotificationCount + 1,
    }));

    if (isMutualMatch) {
      get().showToast(
        `🎉 Mutual Wave Match! You both waved at each other. Chat is now unlocked!`,
        'success'
      );
    } else {
      get().showToast(
        `👋 Wave sent to ${flatmateName}! Chat will unlock when they accept or wave back.`,
        'info'
      );
    }

    return { success: true, conversationId: convId, isMatched: isMutualMatch };
  },

  isWaveMatchedWith: (flatmateId: string) => {
    const { acceptedWaveFlatmateIds } = get();
    return acceptedWaveFlatmateIds.includes(flatmateId);
  },

  acceptFlatmateWave: async (waveId: string, flatmateId: string, flatmateName: string) => {
    const {
      incomingWaves,
      acceptedWaveFlatmateIds,
      wavedFlatmateIds,
      flatmates,
      startOrGetFlatmateConversation,
      showToast,
    } = get();

    const updatedIncoming = incomingWaves.map((w) =>
      w.id === waveId || w.flatmate_id === flatmateId
        ? { ...w, status: 'accepted' as const }
        : w
    );

    const newAccepted = Array.from(new Set([...acceptedWaveFlatmateIds, flatmateId]));
    const newWaved = Array.from(new Set([...wavedFlatmateIds, flatmateId]));

    set({
      incomingWaves: updatedIncoming,
      acceptedWaveFlatmateIds: newAccepted,
      wavedFlatmateIds: newWaved,
    });

    setItem('rehvo_accepted_wave_flatmate_ids', JSON.stringify(newAccepted));
    setItem('rehvo_waved_flatmate_ids', JSON.stringify(newWaved));
    setItem('rehvo_incoming_waves', JSON.stringify(updatedIncoming));

    showToast?.(
      `🎉 Wave Accepted! You and ${flatmateName} are now matched. Chat is open!`,
      'success'
    );

    const targetFm = flatmates.find((f) => f.id === flatmateId) || {
      id: flatmateId,
      name: flatmateName,
      age: 25,
      occupation: 'Roommate',
      locality: 'Mumbai',
      budget_min: 25000,
      budget_max: 35000,
      room_preference: 'Private Room' as const,
      bio: 'Matched roommate on REHVO',
      move_in_date: new Date().toISOString(),
      lifestyle_preferences: ['Non-Smoker', 'Quiet & Clean'],
    };

    const convId = await startOrGetFlatmateConversation(targetFm as any);
    return convId;
  },

  declineFlatmateWave: (waveId: string) => {
    const { incomingWaves, showToast } = get();
    const updated = incomingWaves.map((w) =>
      w.id === waveId ? { ...w, status: 'declined' as const } : w
    );
    set({ incomingWaves: updated });
    setItem('rehvo_incoming_waves', JSON.stringify(updated));
    showToast?.('Wave dismissed', 'info');
  },

  startOrGetConversation: async (property, enquiryId) => {
    const { user, conversations } = get();

    const sessionRes = await authService.ensureUserSession();
    const effectiveUserId = sessionRes?.userId || user?.id;
    if (!effectiveUserId) {
      get().showToast('Please sign in to chat with property hosts', 'info');
      return '';
    }
    const effectiveUserName = user?.name || sessionRes?.name || 'REHVO Member';
    const effectiveUserAvatar = user?.avatar;

    try {
      const res = await chatService.getOrCreatePropertyConversation(
        property.id,
        enquiryId
      );
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
      }
    } catch {
      // Property chat notice
    }

    const convId = `conv_prop_${property.id}`;
    const existing = conversations.find(
      (c) => c.id === convId || c.property_id === property.id
    );

    if (existing) {
      set({ activeConversationId: existing.id });
      return existing.id;
    }

    const newConv: Conversation = {
      id: convId,
      type: 'property',
      property_id: property.id,
      property_title: property.title,
      property_image: property.images?.[0]?.url,
      property_locality: property.locality,
      property_rent: property.rent,
      other_user_id: property.owner_id || 'host',
      other_user_name: property.owner_name || 'Property Host',
      other_user_avatar: property.owner_avatar,
      renter_id: effectiveUserId,
      renter_name: effectiveUserName,
      renter_avatar: effectiveUserAvatar,
      owner_id: property.owner_id || 'host',
      owner_name: property.owner_name || 'Property Host',
      owner_avatar: property.owner_avatar,
      last_message: `Hello! I'm interested in ${property.title}.`,
      updated_at: new Date().toISOString(),
      unread_count: 0,
      messages: [
        {
          id: `msg_prop_${Date.now()}`,
          conversation_id: convId,
          sender_id: 'other',
          sender_name: property.owner_name || 'Property Host',
          sender_avatar: property.owner_avatar,
          text: `Hello! Thank you for inquiring about ${property.title} on REHVO. How can I help you?`,
          created_at: new Date().toISOString(),
          is_read: true,
        },
      ],
    };

    set((state) => ({
      conversations: [newConv, ...state.conversations.filter((c) => c.id !== convId)],
      activeConversationId: convId,
    }));

    return convId;
  },

  createOrGetLeadConversation: async (lead: TenantLeadRecord) => {
    const { user, conversations } = get();

    // 1. Check if conversation already exists for this lead
    const existing = conversations.find(
      (c) =>
        c.id === `conv_lead_${lead.id}` ||
        c.metadata?.lead_id === lead.id ||
        (c.other_user_id === lead.tenant_phone && c.property_id === lead.property_id)
    );

    if (existing) {
      set({ activeConversationId: existing.id });
      return existing.id;
    }

    // 2. Try Supabase lead conversation RPC if connected
    try {
      const res = await chatService.getOrCreateLeadConversation(
        lead.id,
        lead.property_id,
        undefined,
        user?.id
      );
      if (res.success && res.data) {
        const conv = res.data;
        set((state) => ({
          conversations: [conv, ...state.conversations.filter((c) => c.id !== conv.id)],
          activeConversationId: conv.id,
        }));
        return conv.id;
      }
    } catch (_) {}

    // 3. Create optimistic conversation linked to this lead
    const convId = `conv_lead_${lead.id}`;
    const newConv: Conversation = {
      id: convId,
      type: 'owner',
      property_id: lead.property_id,
      property_title: lead.property_title,
      property_image:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
      property_locality: lead.property_locality || 'Mumbai',
      property_rent: lead.budget,
      rent: lead.budget,
      other_user_id: lead.tenant_phone,
      other_user_name: lead.tenant_name,
      other_user_avatar: lead.tenant_photo,
      other_user_role: 'VERIFIED TENANT',
      is_verified: lead.is_verified,
      is_pinned: false,
      is_archived: false,
      is_muted: false,
      is_online: true,
      last_seen: 'Active now',
      renter_id: lead.tenant_phone,
      renter_name: lead.tenant_name,
      renter_avatar: lead.tenant_photo,
      owner_id: user?.id || 'host-user-1',
      owner_name: user?.name || 'You (Owner)',
      owner_avatar: user?.avatar,
      last_message: lead.notes || `Hi ${lead.tenant_name}, thank you for your application for ${lead.property_title}!`,
      updated_at: new Date().toISOString(),
      unread_count: 0,
      metadata: { lead_id: lead.id },
      messages: [
        {
          id: `msg_lead_init_${Date.now()}`,
          conversation_id: convId,
          sender_id: user?.id || 'host-user-1',
          sender_name: user?.name || 'You',
          text: `Hi ${lead.tenant_name}, thank you for your interest in ${lead.property_title}! I am the verified owner. How can I assist you with your move?`,
          message_type: 'text',
          created_at: new Date().toISOString(),
          is_read: true,
          status: 'sent',
        },
      ],
    };

    set((state) => ({
      conversations: [newConv, ...state.conversations.filter((c) => c.id !== convId)],
      activeConversationId: convId,
    }));

    return convId;
  },

  startOrGetSupportConversation: async () => {
    const { user, conversations } = get();
    const userId = user?.id || 'me';
    const userName = user?.name || 'You';

    try {
      const result = await chatService.getOrCreateSupportConversation(userId, userName);
      const conv = result?.data;
      if (conv) {
        set((state) => ({
          conversations: [conv, ...state.conversations.filter((c) => c.id !== conv.id)],
          activeConversationId: conv.id,
        }));
        return conv.id;
      }
    } catch {
      // Support conversation fetch error
    }

    const convId = `conv_support_${userId}`;
    const existing = conversations.find((c) => c.id === convId || c.type === 'support');
    if (existing) {
      set({ activeConversationId: existing.id });
      return existing.id;
    }

    const fallbackConv: Conversation = {
      id: convId,
      property_id: 'support',
      type: 'support',
      is_pinned: true,
      is_archived: false,
      is_muted: false,
      is_online: true,
      last_seen: 'Always active',
      renter_id: userId,
      renter_name: userName,
      renter_avatar: user?.avatar,
      owner_id: 'rehvo_support_agent',
      owner_name: 'REHVO Priority Support',
      owner_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      last_message: 'Hi! Welcome to REHVO Priority Support. How can we help you today?',
      updated_at: new Date().toISOString(),
      unread_count: 0,
      messages: [
        {
          id: `msg_support_init_${Date.now()}`,
          conversation_id: convId,
          sender_id: 'rehvo_support_agent',
          sender_name: 'REHVO Priority Support',
          sender_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          text: 'Hi! Welcome to REHVO Priority Support. How can we help you today? Our team is available 24x7 to assist with bookings, KYC, agreements, and flatmates.',
          message_type: 'text',
          created_at: new Date().toISOString(),
          is_read: true,
          status: 'delivered',
        },
      ],
    };

    set((state) => ({
      conversations: [fallbackConv, ...state.conversations],
      activeConversationId: convId,
    }));
    return convId;
  },

  sendMessage: async (conversationId, text) => {
    const { user, conversations } = get();
    if (!text.trim()) return { success: false, error: 'Empty message' };

    const sessionRes = await authService.ensureUserSession();
    const effectiveUserId = sessionRes?.userId || user?.id;
    if (!effectiveUserId) {
      get().showToast('Please sign in to send messages', 'info');
      return { success: false, error: 'User not signed in' };
    }
    const effectiveUserName = user?.name || sessionRes?.name || 'REHVO Member';
    const effectiveUserAvatar = user?.avatar;

    const tempId = `msg_${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: effectiveUserId,
      sender_name: effectiveUserName,
      sender_avatar: effectiveUserAvatar,
      text: text.trim(),
      created_at: new Date().toISOString(),
      is_read: true,
    };

    // Optimistic append
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ||
        c.flatmate_profile_id === conversationId ||
        c.property_id === conversationId
          ? {
              ...c,
              last_message: text.trim(),
              updated_at: new Date().toISOString(),
              messages: [...(c.messages || []), optimisticMsg],
            }
          : c
      ),
    }));

    try {
      // Resolve target conversation ID for Supabase
      let targetConvId = conversationId;
      const matchedConv = conversations.find(
        (c) =>
          c.id === conversationId ||
          c.flatmate_profile_id === conversationId ||
          c.property_id === conversationId
      );

      if (matchedConv && !targetConvId.startsWith('conv_')) {
        targetConvId = matchedConv.id;
      } else if (matchedConv?.flatmate_profile_id) {
        const convRes = await chatService.getOrCreateFlatmateConversation(
          matchedConv.flatmate_profile_id
        );
        if (convRes.success && convRes.data) {
          targetConvId = convRes.data.id;
        }
      } else if (matchedConv?.property_id) {
        const convRes = await chatService.getOrCreatePropertyConversation(
          matchedConv.property_id
        );
        if (convRes.success && convRes.data) {
          targetConvId = convRes.data.id;
        }
      }

      const res = await chatService.sendMessage(targetConvId, text.trim());
      if (res.success && res.data) {
        const realMsg = res.data;
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ||
            c.id === targetConvId ||
            c.flatmate_profile_id === conversationId ||
            c.property_id === conversationId
              ? {
                  ...c,
                  id: targetConvId,
                  messages: (c.messages || []).map((m) =>
                    m.id === tempId ? realMsg : m
                  ),
                }
              : c
          ),
        }));
        return { success: true, data: realMsg };
      }
    } catch {
      // Chat send notice ignored
    }
    return { success: true, data: optimisticMsg };
  },

  addRealtimeMessage: (conversationId, message) => {
    const { user, activeConversationId } = get();
    const currentUserId = user?.id;

    set((state) => {
      const convIndex = state.conversations.findIndex((c) => c.id === conversationId);
      if (convIndex === -1) return state;

      const targetConv = state.conversations[convIndex];
      const existingIdx = (targetConv.messages || []).findIndex(
        (m) =>
          m.id === message.id ||
          (m.id.startsWith('msg_rich_') &&
            m.text === message.text &&
            m.sender_id === message.sender_id)
      );

      let updatedMessages = [...(targetConv.messages || [])];
      if (existingIdx >= 0) {
        updatedMessages[existingIdx] = message;
      } else {
        updatedMessages.push(message);
      }

      const isCurrentActiveChat = activeConversationId === conversationId;
      const isFromMe = message.sender_id === currentUserId;
      const newUnread = isCurrentActiveChat || isFromMe ? targetConv.unread_count : (targetConv.unread_count || 0) + 1;

      const updatedConv: Conversation = {
        ...targetConv,
        last_message: message.text || targetConv.last_message,
        updated_at: message.created_at || new Date().toISOString(),
        unread_count: newUnread,
        messages: updatedMessages,
      };

      // Move updated conversation to the top
      const otherConvs = state.conversations.filter((c) => c.id !== conversationId);
      return {
        conversations: [updatedConv, ...otherConvs],
      };
    });
  },

  markConversationAsRead: async (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              unread_count: 0,
              messages: (c.messages || []).map((m) => ({ ...m, is_read: true, status: 'read' as const })),
            }
          : c
      ),
    }));
    await chatService.markConversationAsRead(conversationId);
  },

  setActiveConversationId: (id) => set({ activeConversationId: id }),

  sendRichMessage: async (conversationId, params) => {
    const { user } = get();
    const effectiveUserId = user?.id || 'me';
    const effectiveUserName = user?.name || 'You';
    const effectiveUserAvatar = user?.avatar;

    const tempId = `msg_rich_${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: effectiveUserId,
      sender_name: effectiveUserName,
      sender_avatar: effectiveUserAvatar,
      text: params.text?.trim() || '',
      message_type: params.messageType || 'text',
      image_url: params.imageUrl,
      video_url: params.videoUrl,
      audio_url: params.audioUrl,
      document_url: params.documentUrl,
      document_name: params.documentName,
      location: params.location,
      metadata: params.metadata || {},
      reply_to_id: params.replyToId,
      status: 'sending',
      created_at: new Date().toISOString(),
      is_read: true,
    };

    const snippet =
      params.text?.trim() ||
      (params.messageType === 'property'
        ? `Shared Property: ${params.metadata?.property?.title || ''}`
        : params.messageType === 'visit'
        ? `Site Visit Scheduled`
        : params.messageType === 'agreement'
        ? `Rental Agreement Draft`
        : params.messageType === 'rent_reminder'
        ? `Rent Reminder: ₹${params.metadata?.rent_reminder?.amount || 0}`
        : params.messageType === 'location'
        ? `📍 Shared Location`
        : params.messageType === 'audio'
        ? `🎙️ Voice Note`
        : 'Attachment');

    set((state) => {
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (!conv) return state;

      const updatedConv: Conversation = {
        ...conv,
        last_message: snippet,
        updated_at: new Date().toISOString(),
        messages: [...(conv.messages || []), optimisticMsg],
      };

      return {
        conversations: [updatedConv, ...state.conversations.filter((c) => c.id !== conversationId)],
      };
    });

    try {
      const res = await chatService.sendRichMessage(conversationId, params);
      if (res.success && res.data) {
        const realMsg = res.data;
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: (c.messages || []).map((m) =>
                    m.id === tempId ? { ...realMsg, status: 'sent' as const } : m
                  ),
                }
              : c
          ),
        }));
        return { success: true, data: realMsg };
      }
    } catch (_) {}

    // Mark as sent fallback if offline or confirmation delayed
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: (c.messages || []).map((m) =>
                m.id === tempId ? { ...m, status: 'sent' as const } : m
              ),
            }
          : c
      ),
    }));


    return { success: true, data: optimisticMsg };
  },

  togglePinConversation: async (conversationId) => {
    const { conversations, showToast } = get();
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return;

    const pinnedCount = conversations.filter((c) => c.is_pinned).length;
    if (!conv.is_pinned && pinnedCount >= 5) {
      showToast?.('Maximum 5 pinned conversations allowed', 'info');
      return;
    }

    const nextVal = !conv.is_pinned;
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, is_pinned: nextVal } : c
      ),
    }));
    await chatService.togglePinConversation(conversationId, nextVal);
  },

  toggleArchiveConversation: async (conversationId) => {
    const { conversations } = get();
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return;

    const nextVal = !conv.is_archived;
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, is_archived: nextVal } : c
      ),
    }));
    await chatService.toggleArchiveConversation(conversationId, nextVal);
  },

  deleteConversation: async (conversationId) => {
    const { conversations } = get();
    const prevConversations = conversations;
    // Optimistic removal
    set({
      conversations: conversations.filter((c) => c.id !== conversationId),
    });
    const res = await chatService.deleteConversation(conversationId);
    if (!res.success) {
      set({ conversations: prevConversations });
      get().showToast(res.error || 'Could not delete conversation', 'error');
    } else {
      get().showToast('Conversation deleted', 'info');
    }
  },

  deleteMessage: async (conversationId, messageId) => {
    const { conversations } = get();
    const prevConversations = conversations;
    // Optimistic removal
    set({
      conversations: conversations.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          messages: c.messages.filter((m) => m.id !== messageId),
        };
      }),
    });
    const res = await chatService.deleteMessage(messageId, conversationId);
    if (!res.success) {
      set({ conversations: prevConversations });
      get().showToast(res.error || 'Could not delete message', 'error');
    } else {
      get().showToast('Message deleted', 'info');
    }
  },

  deleteMessageForEveryone: async (conversationId, messageId) => {
    const { conversations } = get();
    const prevConversations = conversations;
    // Optimistic WhatsApp tombstone
    set({
      conversations: conversations.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          messages: c.messages.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  text: '🚫 This message was deleted',
                  is_deleted: true,
                  image_url: undefined,
                  document_url: undefined,
                  location: undefined,
                  reactions: {},
                }
              : m
          ),
        };
      }),
    });
    const res = await chatService.deleteMessageForEveryone(messageId, conversationId);
    if (!res.success) {
      set({ conversations: prevConversations });
      get().showToast?.(res.error || 'Could not delete message for everyone', 'error');
      return false;
    }
    get().showToast?.('Message deleted for everyone', 'info');
    return true;
  },

  editMessage: async (conversationId, messageId, newText) => {
    const trimmed = newText.trim();
    if (!trimmed) return false;
    const { conversations } = get();
    const prevConversations = conversations;

    set({
      conversations: conversations.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          messages: c.messages.map((m) =>
            m.id === messageId
              ? { ...m, text: trimmed, is_edited: true, edited_at: new Date().toISOString() }
              : m
          ),
        };
      }),
    });

    const res = await chatService.editMessage(messageId, conversationId, trimmed);
    if (!res.success) {
      set({ conversations: prevConversations });
      get().showToast?.(res.error || 'Could not edit message', 'error');
      return false;
    }
    return true;
  },

  uploadChatAttachment: async (fileUri, fileName, contentType, conversationId) => {
    return chatService.uploadChatAttachment(fileUri, fileName, contentType, conversationId);
  },

  toggleMuteConversation: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, is_muted: !c.is_muted } : c
      ),
    }));
  },

  toggleMessageReaction: async (conversationId, messageId, emoji) => {
    const { user } = get();
    const userId = user?.id || 'me';

    set((state) => ({
      conversations: state.conversations.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          messages: c.messages.map((m) => {
            if (m.id !== messageId) return m;
            const currentList = m.reactions?.[emoji] || [];
            const userIndex = currentList.indexOf(userId);
            const newList =
              userIndex >= 0
                ? currentList.filter((uid) => uid !== userId)
                : [...currentList, userId];

            const updatedReactions = { ...m.reactions };
            if (newList.length > 0) {
              updatedReactions[emoji] = newList;
            } else {
              delete updatedReactions[emoji];
            }

            return { ...m, reactions: updatedReactions };
          }),
        };
      }),
    }));

    await chatService.toggleMessageReaction(messageId, emoji);
  },

  setTyping: async (conversationId, isTyping) => {
    await chatService.setTypingStatus(conversationId, isTyping);
  },

  setOnlineUserIds: (userIds) => set({ onlineUserIds: userIds }),

  setTypingForConversation: (conversationId, userId, isTyping) => {
    set((state) => ({
      typingMap: {
        ...state.typingMap,
        [conversationId]: { userId, isTyping },
      },
    }));
  },

  fetchMessages: async (conversationId) => {
    const res = await chatService.getMessages(conversationId);
    if (res.success && res.data) {
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? { ...c, messages: res.data || [] } : c
        ),
      }));
      return res.data;
    }
    return [];
  },

  starMessage: async (conversationId, messageId) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, is_starred: true } : m
              ),
            }
          : c
      ),
    }));
    await chatService.starMessage(messageId);
  },

  unstarMessage: async (conversationId, messageId) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, is_starred: false } : m
              ),
            }
          : c
      ),
    }));
    await chatService.unstarMessage(messageId);
  },

  sendVideoMessage: async (conversationId, videoUrl, caption) => {
    const res = await chatService.sendVideoMessage(conversationId, videoUrl, caption);
    if (res.success && res.data) {
      get().addRealtimeMessage(conversationId, res.data);
      return res.data;
    }
    return null;
  },

  sendLocationMessage: async (conversationId, location) => {
    const res = await chatService.sendLocationMessage(conversationId, location);
    if (res.success && res.data) {
      get().addRealtimeMessage(conversationId, res.data);
      return res.data;
    }
    return null;
  },

  sendPaymentRequest: async (conversationId, payment) => {
    const res = await chatService.sendPaymentRequest(conversationId, payment);
    if (res.success && res.data) {
      get().addRealtimeMessage(conversationId, res.data);
      return res.data;
    }
    return null;
  },

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
    if (!user?.id) {
      get().showToast('Please sign in to submit a safety report', 'info');
      return;
    }
    const newReport: SafetyReport = {
      ...reportData,
      id: `rep_${Date.now()}`,
      reporter_id: user.id,
      reporter_name: user.name || 'REHVO User',
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
    let userId = get().user?.id;
    if (!userId) {
      const { data: authData } = await supabase.auth.getUser();
      userId = authData?.user?.id;
    }
    if (!userId) {
      return get().notifications;
    }

    const res = await notificationsService.getNotifications(userId);
    if (res.success && res.data) {
      const unread = res.data.filter((n) => !n.read).length;
      set((state) => {
        const fetched = res.data || [];
        const fetchedIds = new Set(fetched.map((n) => n.id));
        const locals = state.notifications.filter((n) => !fetchedIds.has(n.id));
        return {
          notifications: [...fetched, ...locals],
          unreadNotificationCount: unread,
        };
      });
      return res.data;
    }
    return get().notifications;
  },

  fetchUnreadNotificationCount: async () => {
    let userId = get().user?.id;
    if (!userId) {
      const { data: authData } = await supabase.auth.getUser();
      userId = authData?.user?.id;
    }
    if (!userId) {
      return get().unreadNotificationCount;
    }

    const res = await notificationsService.getUnreadNotificationCount(userId);
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
    get().syncBadgeCount();
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
    get().syncBadgeCount();
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
    get().syncBadgeCount();
  },

  bulkMarkNotificationsRead: async (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const idSet = new Set(ids);
    set((state) => {
      let newlyReadCount = 0;
      const updated = state.notifications.map((n) => {
        if (idSet.has(n.id) && !n.read) {
          newlyReadCount += 1;
          return { ...n, read: true, read_at: new Date().toISOString() };
        }
        return n;
      });
      return {
        notifications: updated,
        unreadNotificationCount: Math.max(0, state.unreadNotificationCount - newlyReadCount),
      };
    });
    await notificationsService.bulkMarkNotificationsAsRead(ids, get().user?.id);
    get().syncBadgeCount();
  },

  bulkDeleteNotifications: async (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const idSet = new Set(ids);
    const prev = get().notifications;
    set((state) => {
      let unreadDeleted = 0;
      const filtered = state.notifications.filter((n) => {
        if (idSet.has(n.id)) {
          if (!n.read) unreadDeleted += 1;
          return false;
        }
        return true;
      });
      return {
        notifications: filtered,
        unreadNotificationCount: Math.max(0, state.unreadNotificationCount - unreadDeleted),
      };
    });

    const res = await notificationsService.bulkDeleteNotifications(ids, get().user?.id);
    if (!res.success) {
      set({ notifications: prev });
      get().showToast(res.error || "Couldn't delete notifications", 'error');
    }
    get().syncBadgeCount();
  },

  fetchNotificationPreferences: async () => {
    const userId = get().user?.id;
    const res = await notificationsService.getNotificationPreferences(userId);
    if (res.success && res.data) {
      set({ notificationPrefs: res.data });
      return res.data;
    }
    return get().notificationPrefs;
  },

  updateNotificationPreferences: async (prefs: Partial<NotificationPreferences>) => {
    const current = get().notificationPreferences || get().notificationPrefs;
    const updated = { ...current, ...prefs };
    set({ notificationPreferences: updated, notificationPrefs: updated });
    const res = await notificationsService.updateNotificationPreferences(prefs, get().user?.id);
    if (res.success) {
      get().showToast('Notification settings saved', 'success');
      if (prefs.badge_enabled !== undefined) {
        get().syncBadgeCount();
      }
    } else {
      get().showToast(res.error || 'Failed to update preferences', 'error');
    }
  },

  registerPushToken: async () => {
    try {
      const user = get().user;
      if (!user?.id) return null;
      const res = await pushNotificationsService.registerForPushNotifications(user.id);
      if (res.success && res.token) {
        set({ pushToken: res.token });
        return res.token;
      }
      return null;
    } catch {
      return null;
    }
  },

  refreshNotifications: async () => {
    set({ loadingNotifications: true });
    try {
      const res = await get().fetchNotifications();
      set({ loadingNotifications: false });
      return res;
    } catch {
      set({ loadingNotifications: false });
      return get().notifications;
    }
  },

  clearNotifications: async () => {
    const prev = get().notifications;
    set({ notifications: [], unreadNotificationCount: 0, badgeCount: 0 });
    const ids = prev.map((n) => n.id);
    if (ids.length > 0) {
      await notificationsService.bulkDeleteNotifications(ids, get().user?.id);
    }
    get().clearBadge();
  },

  incrementBadge: () => {
    const newCount = get().badgeCount + 1;
    set({ badgeCount: newCount, unreadNotificationCount: newCount });
    pushNotificationsService.updateBadgeCount(newCount);
  },

  clearBadge: () => {
    set({ badgeCount: 0 });
    pushNotificationsService.clearBadge();
  },

  setNotificationPermissionModalVisible: (visible: boolean) => {
    set({ isNotificationPermissionModalVisible: visible });
  },

  syncBadgeCount: async () => {
    const unread = get().unreadNotificationCount;
    const prefs = get().notificationPreferences || get().notificationPrefs;
    set({ badgeCount: unread });
    if (prefs.badge_enabled !== false) {
      await pushNotificationsService.setAppBadgeCount(unread);
    } else {
      await pushNotificationsService.setAppBadgeCount(0);
    }
  },

  registerDevicePushToken: async () => {
    try {
      const user = get().user;
      if (!user?.id) return;
      const res = await pushNotificationsService.registerPushToken(user.id);
      if (res.success && res.token) {
        set({ pushToken: res.token });
      }
    } catch (_) {}
  },

  unregisterDevicePushToken: async () => {
    try {
      const user = get().user;
      await pushNotificationsService.unregisterPushToken(user?.id);
      set({ pushToken: null });
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
    get().syncBadgeCount();
  },

  updateNotificationPrefs: (prefs) => {
    get().updateNotificationPreferences(prefs);
  },

  updateListingDraft: (data) => {
    set((state) => ({
      listingDraft: { ...state.listingDraft, ...data },
    }));
  },

  resetListingDraft: () => {
    set({
      listingDraft: {
        category: 'residential',
        property_type: null,
        commercial_type: null,
        title: '',
        city: 'Mumbai',
        locality: '',
        address: '',
        rent: 0,
        deposit: 0,
        maintenance: 0,
        commission: 0,
        bhk: '',
        bathrooms: 1,
        washrooms: 2,
        area_sqft: 0,
        carpet_area: undefined,
        floor_number: undefined,
        total_floors: undefined,
        power_backup: false,
        lift: false,
        furnishing: 'SEMI_FURNISHED',
        available_from: new Date().toISOString().split('T')[0],
        amenities: [],
        images: [],
        description: '',
        additional_info: '',
        zero_commission: false,
        tenant_preferences: [],
        lease_type: undefined,
      },
    });
  },

  // Wallet, R-Cash & Rewards Ecosystem
  fetchWallet: async () => {
    const user = get().user;
    if (!user?.id) return null;
    try {
      const res = await walletService.getOrCreateWallet(user.id);
      if (res.success && res.data) {
        set({ wallet: res.data });
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  fetchWalletTransactions: async (options) => {
    const user = get().user;
    if (!user?.id) return get().walletTransactions;
    try {
      const res = await walletService.getWalletTransactions(user.id, options);
      if (res.success && res.data) {
        set({ walletTransactions: res.data });
        return res.data;
      }
      return get().walletTransactions;
    } catch {
      return get().walletTransactions;
    }
  },

  fetchRewardCampaigns: async (category) => {
    try {
      const res = await walletService.getRewardCampaigns(category);
      if (res.success && res.data) {
        set({ rewardCampaigns: res.data });
        return res.data;
      }
      return get().rewardCampaigns;
    } catch {
      return get().rewardCampaigns;
    }
  },

  redeemRewardCampaign: async (campaignId: string) => {
    const user = get().user;
    if (!user?.id) {
      get().showToast('Sign in to redeem luxury rewards', 'info');
      return { success: false, error: 'Authentication required' };
    }
    try {
      const res = await walletService.redeemCampaign(user.id, campaignId);
      if (res.success) {
        get().fetchWallet();
        get().fetchWalletTransactions();
        get().fetchMyRedemptions();
        get().fetchCashbackSummary();
        get().showToast('Reward claimed successfully! Code unlocked.', 'success');
        return res;
      } else {
        get().showToast(res.error || 'Could not redeem voucher', 'error');
        return res;
      }
    } catch (e: any) {
      get().showToast(e?.message || 'Reward redemption failed', 'error');
      return { success: false, error: e?.message };
    }
  },

  fetchMyRedemptions: async () => {
    const user = get().user;
    if (!user?.id) return [];
    try {
      const res = await walletService.getMyRedemptions(user.id);
      if (res.success && res.data) {
        set({ myRedemptions: res.data });
        return res.data;
      }
      return [];
    } catch {
      return [];
    }
  },

  fetchReferrals: async () => {
    const user = get().user;
    if (!user?.id) return [];
    try {
      const res = await walletService.getReferrals(user.id);
      if (res.success && res.data) {
        set({ referrals: res.data });
        return res.data;
      }
      return [];
    } catch {
      return [];
    }
  },

  fetchChallenges: async () => {
    const user = get().user;
    try {
      const res = await walletService.getChallenges(user?.id || '');
      if (res.success && res.data) {
        set({ challenges: res.data });
        return res.data;
      }
      return get().challenges;
    } catch {
      return get().challenges;
    }
  },

  claimChallengeReward: async (challengeId: string) => {
    const user = get().user;
    if (!user?.id) {
      get().showToast('Sign in to claim challenge rewards', 'info');
      return { success: false, error: 'Authentication required' };
    }
    try {
      const res = await walletService.claimChallenge(user.id, challengeId);
      if (res.success) {
        get().fetchWallet();
        get().fetchWalletTransactions();
        get().fetchChallenges();
        get().fetchCashbackSummary();
        get().showToast(`Claimed ₹${res.rewardAmount || 50} R-Cash!`, 'success');
        return res;
      } else {
        get().showToast(res.error || 'Failed to claim reward', 'error');
        return res;
      }
    } catch (e: any) {
      get().showToast(e?.message || 'Failed to claim reward', 'error');
      return { success: false, error: e?.message };
    }
  },

  triggerCashback: async (amount, category, title, description, refId) => {
    const user = get().user;
    if (!user?.id) return;
    try {
      const res = await walletService.recordCashback(user.id, amount, category, title, description, refId);
      if (res.success) {
        get().fetchWallet();
        get().fetchWalletTransactions();
        get().fetchCashbackSummary();
        get().showToast(`+₹${amount} R-Cash credited to your wallet!`, 'success');
      }
    } catch {
      // Cashback record error handled
    }
  },

  fetchCashbackSummary: async () => {
    const user = get().user;
    if (!user?.id) return null;
    try {
      const res = await walletService.getCashbackSummary(user.id);
      if (res.success && res.data) {
        set({ cashbackSummary: res.data });
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  transferToBank: async (amount, bankDetails) => {
    const user = get().user;
    const currentWallet = get().wallet;
    const currentBalance = currentWallet?.balance ?? user?.walletBalance ?? 0;

    if (amount <= 0) {
      return { success: false, error: 'Enter a valid transfer amount' };
    }
    if (amount > currentBalance) {
      return { success: false, error: 'Insufficient wallet balance' };
    }

    const txnId = `TXN_BANK_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newTxn: WalletTransactionRecord = {
      id: txnId,
      wallet_id: currentWallet?.id || 'wallet_user',
      user_id: user?.id || '',
      title: 'Transfer to Bank Account',
      description: `NEFT to ${bankDetails.beneficiaryName} • A/C ending in ${bankDetails.accountNumber.slice(-4)} (${bankDetails.ifsc.toUpperCase()})`,
      amount,
      type: 'debit',
      category: 'bank_transfer',
      status: 'completed',
      reference_id: txnId,
      metadata: {
        bank_account: bankDetails.accountNumber.slice(-4),
        ifsc: bankDetails.ifsc,
        beneficiary: bankDetails.beneficiaryName,
      },
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      wallet: state.wallet
        ? { ...state.wallet, balance: Math.max(0, state.wallet.balance - amount) }
        : null,
      user: state.user
        ? { ...state.user, walletBalance: Math.max(0, (state.user.walletBalance || 0) - amount) }
        : null,
      walletTransactions: [newTxn, ...state.walletTransactions],
    }));

    get().showToast(`₹${amount.toLocaleString('en-IN')} transferred to your bank account!`, 'success');
    return { success: true, txnId };
  },

  fetchUserBankAccounts: async () => {
    const user = get().user;
    if (!user?.id) return [];
    try {
      const res = await walletService.getUserBankAccounts(user.id);
      if (res.success && res.data) {
        set({ userBankAccounts: res.data });
        return res.data;
      }
      return [];
    } catch {
      return [];
    }
  },

  addUserBankAccount: async (bank) => {
    const user = get().user;
    if (!user?.id) return { success: false, error: 'Sign in required' };
    try {
      const res = await walletService.addUserBankAccount(user.id, bank);
      if (res.success && res.data) {
        set((state) => ({
          userBankAccounts: [res.data!, ...state.userBankAccounts.map((b) => ({ ...b, is_primary: false }))],
        }));
        get().showToast('Bank account linked successfully!', 'success');
        return res;
      }
      return { success: false, error: res.error || 'Failed to add bank account' };
    } catch (e: any) {
      return { success: false, error: e?.message };
    }
  },

  deleteUserBankAccount: async (bankId: string) => {
    try {
      const res = await walletService.deleteUserBankAccount(bankId);
      if (res.success) {
        set((state) => ({
          userBankAccounts: state.userBankAccounts.filter((b) => b.id !== bankId),
        }));
        get().showToast('Bank account removed', 'info');
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch (e: any) {
      return { success: false, error: e?.message };
    }
  },

  withdrawToBank: async (amount: number, bankAccountId?: string) => {
    const user = get().user;
    if (!user?.id) return { success: false, error: 'Sign in required' };
    try {
      const res = await walletService.withdrawToBank(user.id, amount, bankAccountId);
      if (res.success) {
        get().fetchWallet();
        get().fetchWalletTransactions();
        get().fetchCashbackSummary();
        get().showToast(`₹${amount} withdrawn via IMPS! UTR: ${res.utr || 'Generated'}`, 'success');
        return res;
      }
      get().showToast(res.error || 'Withdrawal failed', 'error');
      return res;
    } catch (e: any) {
      get().showToast(e?.message || 'Withdrawal failed', 'error');
      return { success: false, error: e?.message };
    }
  },

  fetchScratchCards: async () => {
    const user = get().user;
    if (!user?.id) return [];
    try {
      const res = await cashbackEngine.getUserScratchCards(user.id);
      if (res.success && res.data) {
        set({ scratchCards: res.data });
        return res.data;
      }
      return [];
    } catch {
      return [];
    }
  },

  revealScratchCard: async (cardId: string) => {
    const user = get().user;
    if (!user?.id) return { success: false, rewardAmount: 0, error: 'Sign in required' };
    try {
      const res = await cashbackEngine.revealScratchCard(user.id, cardId);
      if (res.success) {
        set((state) => ({
          scratchCards: state.scratchCards.map((c) =>
            c.id === cardId ? { ...c, is_scratched: true, actual_reward: res.rewardAmount } : c
          ),
        }));
        get().fetchWallet();
        get().fetchWalletTransactions();
        get().fetchCashbackSummary();
        get().showToast(`🎉 You revealed ₹${res.rewardAmount} R-Cash!`, 'success');
        return res;
      }
      return res;
    } catch (e: any) {
      return { success: false, rewardAmount: 0, error: e?.message };
    }
  },

  spinRewardWheel: async () => {
    const user = get().user;
    if (!user?.id) return { success: false, prize: '', rewardAmount: 0, prizeType: '' };
    try {
      const res = await campaignsService.spinLuckyWheel(user.id);
      if (res.success) {
        get().fetchWallet();
        get().fetchWalletTransactions();
        get().fetchCashbackSummary();
        get().showToast(`🎉 Lucky Wheel: You won ${res.prize}!`, 'success');
        return res;
      }
      return res;
    } catch {
      return { success: false, prize: '', rewardAmount: 0, prizeType: '' };
    }
  },

  fetchGamification: async () => {
    const user = get().user;
    if (!user?.id) return null;
    try {
      const res = await campaignsService.getGamificationStats(user.id);
      if (res.success && res.data) {
        set({ gamification: res.data });
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  fetchAchievementBadges: async () => {
    const user = get().user;
    try {
      const res = await campaignsService.getAchievementBadges(user?.id || '');
      if (res.success && res.data) {
        set({ achievementBadges: res.data });
        return res.data;
      }
      return [];
    } catch {
      return [];
    }
  },

  unlockBadge: async (badgeCode: string) => {
    const user = get().user;
    if (!user?.id) return { success: false };
    try {
      const res = await campaignsService.unlockBadge(user.id, badgeCode);
      if (res.success) {
        get().fetchAchievementBadges();
        get().fetchGamification();
        get().showToast(`🏅 Unlocked Badge: ${res.badgeTitle || badgeCode}! (+${res.xpEarned || 100} XP)`, 'success');
        return res;
      }
      return res;
    } catch {
      return { success: false };
    }
  },

  // Rental Operations Ecosystem Actions (V4.5)
  fetchRentPayments: async () => {
    const user = get().user;
    if (!user?.id) return get().rentPayments;
    try {
      const res = await rentalOperationsService.getRentPayments(user.id);
      if (res.success && res.data) {
        set({ rentPayments: res.data });
        return res.data;
      }
      return get().rentPayments;
    } catch {
      return get().rentPayments;
    }
  },

  payRent: async (payload) => {
    const user = get().user;
    if (!user?.id) {
      get().showToast('Sign in to pay rent and earn cashback', 'info');
      return { success: false, error: 'Authentication required' };
    }
    try {
      const res = await rentalOperationsService.recordRentPayment(user.id, payload);
      if (res.success && res.data) {
        set((state) => ({ rentPayments: [res.data!, ...state.rentPayments] }));
        const cashback = res.data.cashback_earned || 190;
        await get().triggerCashback(
          cashback,
          'rent_cashback',
          'Rent Payment Cashback',
          `1% instant cash on rent payment (${res.data.transaction_ref})`,
          res.data.transaction_ref
        );
        get().fetchVaultDocuments();
        return res;
      }
      return { success: false, error: 'Payment processing failed' };
    } catch (e: any) {
      return { success: false, error: e?.message };
    }
  },

  fetchLeaseAgreements: async () => {
    const user = get().user;
    if (!user?.id) return get().leaseAgreements;
    try {
      const res = await rentalOperationsService.getLeaseAgreements(user.id);
      if (res.success && res.data) {
        set({ leaseAgreements: res.data });
        return res.data;
      }
      return get().leaseAgreements;
    } catch {
      return get().leaseAgreements;
    }
  },

  createLeaseAgreement: async (payload) => {
    const user = get().user;
    if (!user?.id) {
      get().showToast('Sign in to create a legal rental agreement', 'info');
      return { success: false, error: 'Authentication required' };
    }
    try {
      const res = await rentalOperationsService.createLeaseAgreement(user.id, payload);
      if (res.success && res.data) {
        set((state) => ({ leaseAgreements: [res.data!, ...state.leaseAgreements] }));
        get().fetchVaultDocuments();
        get().showToast('Digital E-Lease draft created successfully!', 'success');
        return res;
      }
      return { success: false, error: 'Could not create agreement' };
    } catch (e: any) {
      return { success: false, error: e?.message };
    }
  },

  scheduleBiometrics: async (agreementId, date, slot) => {
    try {
      const res = await rentalOperationsService.scheduleBiometrics(agreementId, date, slot);
      if (res.success) {
        set((state) => ({
          leaseAgreements: state.leaseAgreements.map((a) =>
            a.id === agreementId
              ? {
                  ...a,
                  biometric_status: 'scheduled',
                  biometric_date: date,
                  biometric_slot: slot,
                  status: 'biometrics_pending',
                }
              : a
          ),
        }));
        get().showToast(res.message, 'success');
      }
      return res;
    } catch (e: any) {
      return { success: false, message: e?.message || 'Failed to schedule biometrics' };
    }
  },

  fetchZeroDepositPass: async () => {
    const user = get().user;
    if (!user?.id) return get().zeroDepositPass;
    try {
      const res = await rentalOperationsService.getZeroDepositPass(user.id);
      if (res.success && res.data) {
        set({ zeroDepositPass: res.data });
        return res.data;
      }
      return get().zeroDepositPass;
    } catch {
      return get().zeroDepositPass;
    }
  },

  applyZeroDepositPass: async (creditScore = 780, coverageAmount = 150000) => {
    const user = get().user;
    if (!user?.id) {
      get().showToast('Sign in to unlock Zero Deposit Pass', 'info');
      return { success: false };
    }
    try {
      const res = await rentalOperationsService.applyZeroDepositPass(user.id, creditScore, coverageAmount);
      if (res.success && res.data) {
        set({ zeroDepositPass: res.data });
        get().fetchVaultDocuments();
        await get().triggerCashback(
          100,
          'welcome_bonus',
          'Zero Deposit Security Pass Bonus',
          `Unlocked ₹${coverageAmount.toLocaleString('en-IN')} protection pass`,
          res.data.certificate_id
        );
        get().showToast('Zero Deposit Protection Pass Approved & Active!', 'success');
        return res;
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  },

  fetchTenantVerification: async () => {
    const user = get().user;
    if (!user?.id) return get().tenantVerification;
    try {
      const res = await rentalOperationsService.getTenantVerification(user.id);
      if (res.success && res.data) {
        set({ tenantVerification: res.data });
        return res.data;
      }
      return get().tenantVerification;
    } catch {
      return get().tenantVerification;
    }
  },

  updateTenantVerification: async (updates) => {
    const user = get().user;
    if (!user?.id) return { success: false };
    try {
      const res = await rentalOperationsService.updateVerificationStep(user.id, updates);
      if (res.success && res.data) {
        set({ tenantVerification: res.data });
        if (res.data.overall_status === 'verified') {
          get().updateProfile({ verification_status: 'VERIFIED', kyc_verified: true, kyc_status: 'verified' });
          await get().triggerCashback(100, 'kyc_bonus', 'Tenant Identity Verification Bonus', 'Aadhaar & PAN verified');
        }
        return res;
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  },

  fetchVisitBookings: async () => {
    const user = get().user;
    if (!user?.id) return get().visitBookings;
    try {
      const res = await rentalOperationsService.getVisitBookings(user.id);
      if (res.success && res.data) {
        set({ visitBookings: res.data });
        return res.data;
      }
      return get().visitBookings;
    } catch {
      return get().visitBookings;
    }
  },

  bookPropertyVisit: async (payload) => {
    const user = get().user;
    if (!user?.id) {
      get().showToast('Sign in to book a property tour', 'info');
      return { success: false };
    }
    try {
      const res = await rentalOperationsService.bookVisit(user.id, payload);
      if (res.success && res.data) {
        set((state) => ({ visitBookings: [res.data!, ...state.visitBookings] }));
        get().showToast('Visit appointment confirmed with owner! QR pass ready.', 'success');

        // Asynchronously notify property owner
        if (payload.property_id) {
          const prop = get().properties.find((p) => p.id === payload.property_id);
          if (prop?.owner_id && prop.owner_id !== user.id) {
            notificationsService
              .createNotification({
                userId: prop.owner_id,
                type: 'visit',
                title: '📅 New Site Tour Scheduled',
                body: `${user.name || 'A prospective tenant'} scheduled a tour for ${prop.title} on ${payload.visit_date} at ${payload.time_slot || 'scheduled time'}.`,
                data: { property_id: prop.id, visit_id: res.data.id },
              })
              .catch(() => {});
          }
        }

        return res;
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  },

  fetchServiceBookings: async (type) => {
    const user = get().user;
    if (!user?.id) return get().serviceBookings;
    try {
      const res = await rentalOperationsService.getServiceBookings(user.id, type);
      if (res.success && res.data) {
        set({ serviceBookings: res.data });
        return res.data;
      }
      return get().serviceBookings;
    } catch {
      return get().serviceBookings;
    }
  },

  bookService: async (payload) => {
    const user = get().user;
    if (!user?.id) {
      get().showToast('Sign in to book moving and cleaning services', 'info');
      return { success: false };
    }
    try {
      const res = await rentalOperationsService.bookService(user.id, payload);
      if (res.success && res.data) {
        set((state) => ({ serviceBookings: [res.data!, ...state.serviceBookings] }));
        get().showToast(`${payload.service_type === 'movers' ? 'Movers & Packers' : 'Deep Cleaning'} booked successfully!`, 'success');
        return res;
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  },

  updateServiceBookingStatus: async (bookingId, status, cancellationReason) => {
    try {
      const res = await rentalOperationsService.updateServiceBookingStatus(bookingId, status, cancellationReason);
      if (res.success) {
        set((state) => ({
          serviceBookings: state.serviceBookings.map((b) =>
            b.id === bookingId ? { ...b, status, cancellation_reason: cancellationReason, updated_at: new Date().toISOString() } : b
          ),
        }));
        return { success: true };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  },

  rescheduleServiceBooking: async (bookingId, bookingDate, timeSlot) => {
    try {
      const res = await rentalOperationsService.rescheduleServiceBooking(bookingId, bookingDate, timeSlot);
      if (res.success) {
        set((state) => ({
          serviceBookings: state.serviceBookings.map((b) =>
            b.id === bookingId ? { ...b, booking_date: bookingDate, time_slot: timeSlot, updated_at: new Date().toISOString() } : b
          ),
        }));
        return { success: true };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  },

  fetchUtilityRequests: async () => {
    const user = get().user;
    if (!user?.id) return get().utilityRequests;
    try {
      const res = await rentalOperationsService.getUtilityRequests(user.id);
      if (res.success && res.data) {
        set({ utilityRequests: res.data });
        return res.data;
      }
      return get().utilityRequests;
    } catch {
      return get().utilityRequests;
    }
  },

  createUtilityRequest: async (payload) => {
    const user = get().user;
    if (!user?.id) {
      get().showToast('Sign in to setup utilities', 'info');
      return { success: false };
    }
    try {
      const res = await rentalOperationsService.createUtilityRequest(user.id, payload);
      if (res.success && res.data) {
        set((state) => ({ utilityRequests: [res.data!, ...state.utilityRequests] }));
        get().showToast('Utility connection requested with concierge team!', 'success');
        return res;
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  },

  updateUtilityStatus: async (requestId, status) => {
    try {
      const res = await rentalOperationsService.updateUtilityStatus(requestId, status);
      if (res.success) {
        set((state) => ({
          utilityRequests: state.utilityRequests.map((u) =>
            u.id === requestId ? { ...u, status } : u
          ),
        }));
      }
      return res;
    } catch {
      return { success: false };
    }
  },

  fetchVaultDocuments: async (category) => {
    const user = get().user;
    if (!user?.id) return get().vaultDocuments;
    try {
      const res = await rentalOperationsService.getVaultDocuments(user.id, category);
      if (res.success && res.data) {
        set({ vaultDocuments: res.data });
        return res.data;
      }
      return get().vaultDocuments;
    } catch {
      return get().vaultDocuments;
    }
  },

  addVaultDocument: async (payload) => {
    const user = get().user;
    if (!user?.id) return { success: false };
    try {
      const res = await rentalOperationsService.addVaultDocument(user.id, payload);
      if (res.success && res.data) {
        set((state) => ({ vaultDocuments: [res.data!, ...state.vaultDocuments] }));
        return res;
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  },

  deleteVaultDocument: async (docId) => {
    const user = get().user;
    if (!user?.id) return { success: false };
    try {
      const res = await rentalOperationsService.deleteVaultDocument(user.id, docId);
      if (res.success) {
        set((state) => ({ vaultDocuments: state.vaultDocuments.filter((d) => d.id !== docId) }));
        get().showToast('Document removed from vault', 'info');
      }
      return res;
    } catch {
      return { success: false };
    }
  },

  cancelVisitBooking: async (visitId) => {
    try {
      set((state) => ({
        visitBookings: state.visitBookings.map((v) =>
          v.id === visitId ? { ...v, status: 'cancelled' as const } : v
        ),
      }));
      get().showToast('Visit cancelled successfully', 'info');
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  rescheduleVisitBooking: async (visitId, newDate, newSlot) => {
    try {
      set((state) => ({
        visitBookings: state.visitBookings.map((v) =>
          v.id === visitId
            ? {
                ...v,
                visit_date: newDate,
                time_slot: newSlot,
                status: 'rescheduled' as const,
              }
            : v
        ),
      }));
      get().showToast(`Visit rescheduled to ${newDate} (${newSlot})`, 'success');
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  toggleAutoPay: async (mandateId, status) => {
    try {
      // Optimistic update
      get().showToast(`AutoPay ${status === 'active' ? 'enabled' : 'paused'}`, 'success');
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  collectRent: async (collectionId, method = 'UPI') => {
    return get().recordRentPaymentCollected(collectionId, method);
  },

  // V5.5 Emergency & SOS
  fetchEmergencyContacts: async () => {
    const user = get().user;
    if (!user?.id) return get().emergencyContacts;
    try {
      const data = await safetyService.getEmergencyContacts(user.id);
      set({ emergencyContacts: data });
      return data;
    } catch {
      return get().emergencyContacts;
    }
  },

  addEmergencyContact: async (contact) => {
    const user = get().user;
    if (!user?.id) {
      get().showToast('Please sign in to add contacts', 'info');
      return { success: false, error: 'User not signed in' };
    }
    try {
      const res = await safetyService.addEmergencyContact(user.id, contact);
      if (res.success && res.data) {
        set((state) => ({
          emergencyContacts: [res.data!, ...state.emergencyContacts.filter((c) => c.id !== res.data!.id)],
        }));
        get().showToast('Emergency contact added', 'success');
      }
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to add contact' };
    }
  },

  deleteEmergencyContact: async (contactId) => {
    const user = get().user;
    if (!user?.id) return { success: false };
    try {
      const res = await safetyService.deleteEmergencyContact(user.id, contactId);
      if (res.success) {
        set((state) => ({
          emergencyContacts: state.emergencyContacts.filter((c) => c.id !== contactId),
        }));
        get().showToast('Contact removed', 'info');
      }
      return res;
    } catch {
      return { success: false };
    }
  },

  triggerSosAlert: async (payload) => {
    const user = get().user;
    const userId = user?.id || 'guest_user';
    try {
      const res = await safetyService.triggerSosAlert(userId, payload);
      if (res.success) {
        get().showToast('EMERGENCY SOS BROADCAST ACTIVE', 'success');
      }
      return res;
    } catch {
      return { success: false };
    }
  },

  resolveSosAlert: async (alertId) => {
    try {
      const res = await safetyService.resolveSosAlert(alertId);
      if (res.success) {
        get().showToast('SOS Alert marked resolved', 'info');
      }
      return res;
    } catch {
      return { success: false };
    }
  },

  // V5.5 Society Passes
  fetchSocietyPasses: async () => {
    const user = get().user;
    if (!user?.id) return get().societyPasses;
    try {
      const res = await societyPassService.getSocietyPasses(user.id);
      if (res.success) {
        set({ societyPasses: res.data });
        return res.data;
      }
      return get().societyPasses;
    } catch {
      return get().societyPasses;
    }
  },

  createSocietyPass: async (payload) => {
    const user = get().user;
    if (!user?.id) {
      get().showToast('Sign in to generate gate pass', 'info');
      return { success: false, error: 'Sign in required' };
    }
    try {
      const res = await societyPassService.createSocietyPass(user.id, payload);
      if (res.success && res.data) {
        set((state) => ({ societyPasses: [res.data!, ...state.societyPasses] }));
        get().showToast('Digital Gate Pass issued!', 'success');
      }
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Pass generation failed' };
    }
  },

  cancelSocietyPass: async (passId) => {
    const user = get().user;
    try {
      const res = await societyPassService.cancelSocietyPass(user?.id || '', passId);
      if (res.success) {
        set((state) => ({
          societyPasses: state.societyPasses.map((p) =>
            p.id === passId ? { ...p, status: 'revoked' as const } : p
          ),
        }));
        get().showToast('Gate pass revoked', 'info');
      }
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Revocation failed' };
    }
  },

  // V5.5 Maintenance Tickets & Chat
  fetchMaintenanceTickets: async (propertyId) => {
    const user = get().user;
    if (!user?.id) return get().maintenanceTickets;
    try {
      const res = await maintenanceService.getMaintenanceTickets(user.id, propertyId);
      if (res.success) {
        set({ maintenanceTickets: res.data });
        return res.data;
      }
      return get().maintenanceTickets;
    } catch {
      return get().maintenanceTickets;
    }
  },

  createMaintenanceTicket: async (payload) => {
    const user = get().user;
    if (!user?.id) {
      get().showToast('Sign in to raise maintenance ticket', 'info');
      return { success: false, error: 'Sign in required' };
    }
    try {
      const res = await maintenanceService.createMaintenanceTicket(user.id, payload);
      if (res.success && res.data) {
        set((state) => ({ maintenanceTickets: [res.data!, ...state.maintenanceTickets] }));
        get().showToast('Ticket raised with maintenance team!', 'success');
      }
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Ticket creation failed' };
    }
  },

  updateMaintenanceTicketStatus: async (ticketId, status) => {
    const user = get().user;
    try {
      const res = await maintenanceService.updateTicketStatus(user?.id || '', ticketId, status);
      if (res.success) {
        set((state) => ({
          maintenanceTickets: state.maintenanceTickets.map((t) =>
            t.id === ticketId ? { ...t, status } : t
          ),
        }));
        get().showToast(`Ticket status updated to ${status}`, 'success');
      }
      return res;
    } catch {
      return { success: false };
    }
  },

  fetchTicketMessages: async (ticketId) => {
    try {
      const res = await maintenanceService.getTicketMessages(ticketId);
      if (res.success) {
        set({ activeTicketMessages: res.data });
        return res.data;
      }
      return [];
    } catch {
      return [];
    }
  },

  sendTicketMessage: async (ticketId, message) => {
    const user = get().user;
    if (!user?.id || !message.trim()) return { success: false, error: 'Invalid message' };
    try {
      const res = await maintenanceService.sendTicketMessage(ticketId, {
        sender_id: user.id,
        sender_name: user.name || 'Tenant',
        sender_role: 'tenant',
        message: message.trim(),
      });
      if (res.success && res.data) {
        set((state) => ({
          activeTicketMessages: [...state.activeTicketMessages, res.data!],
        }));
      }
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to send message' };
    }
  },

  // V5.5 Electricity Bills
  fetchElectricityBills: async (consumerNumber) => {
    const user = get().user;
    if (!user?.id) return get().electricityBills;
    try {
      const res = await rentalOperationsService.getElectricityBills(user.id, consumerNumber);
      if (res.success && res.data) {
        set({ electricityBills: res.data });
        return res.data;
      }
      return get().electricityBills;
    } catch {
      return get().electricityBills;
    }
  },

  payElectricityBill: async (billId, paymentMethod = 'upi') => {
    const user = get().user;
    if (!user?.id) return { success: false, error: 'Sign in to pay bill' };
    try {
      const res = await rentalOperationsService.payElectricityBill(user.id, billId, paymentMethod);
      if (res.success) {
        set((state) => ({
          electricityBills: state.electricityBills.map((b) =>
            b.id === billId ? { ...b, status: 'paid' as const } : b
          ),
        }));
        get().showToast('Electricity bill paid successfully!', 'success');
      }
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Payment failed' };
    }
  },

  // V5.5 Broadband
  fetchBroadbandPlans: async (provider) => {
    try {
      const res = await rentalOperationsService.getBroadbandPlans(provider);
      if (res.success && res.data) {
        set({ broadbandPlans: res.data });
        return res.data;
      }
      return get().broadbandPlans;
    } catch {
      return get().broadbandPlans;
    }
  },

  bookBroadbandInstallation: async (payload) => {
    const user = get().user;
    if (!user?.id) return { success: false, error: 'Sign in required' };
    try {
      const res = await rentalOperationsService.bookBroadbandInstallation(user.id, payload);
      if (res.success && res.data) {
        set((state) => ({ broadbandBookings: [res.data!, ...state.broadbandBookings] }));
        get().showToast('Broadband installation booked!', 'success');
      }
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Booking failed' };
    }
  },

  // V5.5 Water Tanker & PNG Gas
  bookWaterTanker: async (payload) => {
    const user = get().user;
    if (!user?.id) return { success: false, error: 'Sign in required' };
    try {
      const res = await rentalOperationsService.bookWaterTanker(user.id, payload);
      if (res.success && res.data) {
        set((state) => ({ waterTankerBookings: [res.data!, ...state.waterTankerBookings] }));
        get().showToast('Water tanker dispatched!', 'success');
      }
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Booking failed' };
    }
  },

  bookPngGas: async (payload) => {
    const user = get().user;
    if (!user?.id) return { success: false, error: 'Sign in required' };
    try {
      const res = await rentalOperationsService.bookPngGas(user.id, payload);
      if (res.success && res.data) {
        set((state) => ({ pngGasBookings: [res.data!, ...state.pngGasBookings] }));
        get().showToast('Piped Natural Gas request submitted!', 'success');
      }
      return res;
    } catch (err: any) {
      return { success: false, error: err?.message || 'PNG request failed' };
    }
  },

  // V5.5 Move-In 30-Point Checklist
  fetchMoveIn30Checklist: async () => {
    const user = get().user;
    const userId = user?.id || 'guest_user';
    try {
      const list = await rentalOperationsService.getMoveIn30Checklist(userId);
      set({ moveIn30Checklist: list });
      return list;
    } catch {
      return get().moveIn30Checklist;
    }
  },

  toggleMoveIn30ChecklistItem: async (itemId, completed) => {
    const user = get().user;
    const userId = user?.id || 'guest_user';
    try {
      const res = await rentalOperationsService.toggleMoveIn30ChecklistItem(userId, itemId);
      if (res.success && res.data) {
        set({ moveIn30Checklist: res.data });
      } else {
        set((state) => ({
          moveIn30Checklist: state.moveIn30Checklist.map((item) =>
            item.id === itemId ? { ...item, completed } : item
          ),
        }));
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Checklist toggle failed' };
    }
  },
  fetchOwnerEcosystemData: async () => {
    const userId = get().user?.id || 'host-user-1';
    try {
      const [
        profile,
        plan,
        summary,
        leads,
        visits,
        rent,
        docs,
        notifs,
      ] = await Promise.all([
        ownerEcosystemService.getOwnerProfile(userId),
        ownerEcosystemService.getActiveOwnerPlan(userId),
        ownerEcosystemService.getDashboardSummary(userId),
        ownerEcosystemService.getTenantLeads(userId),
        ownerEcosystemService.getOwnerVisits(userId),
        ownerEcosystemService.getRentCollections(userId),
        ownerEcosystemService.getOwnerDocuments(userId),
        ownerEcosystemService.getOwnerNotifications(userId),
      ]);

      const unreadCount = (notifs || []).filter((n) => !n.is_read).length;

      set({
        ownerProfile: profile,
        ownerPlan: plan,
        ownerDashboardSummary: summary,
        tenantLeads: leads || [],
        ownerVisits: visits || [],
        rentCollections: rent || [],
        ownerDocuments: docs || [],
        ownerNotifications: notifs || [],
        unreadOwnerNotificationsCount: unreadCount,
      });
    } catch {
      // Owner ecosystem fetch fallback
    }
  },

  updateOwnerProfileState: async (updates) => {
    const userId = get().user?.id || 'host-user-1';
    try {
      const updated = await ownerEcosystemService.updateOwnerProfile(userId, updates);
      set({ ownerProfile: updated });
      get().showToast('Owner profile updated successfully', 'success');
      return true;
    } catch {
      return false;
    }
  },

  upgradeOwnerPlanState: async (tier, cycle = 'monthly') => {
    const userId = get().user?.id || 'host-user-1';
    try {
      const newPlan = await ownerEcosystemService.upgradeOwnerPlan(userId, tier, cycle);
      set({ ownerPlan: newPlan });

      // Trigger wallet transaction bonus or update
      get().showToast(`${newPlan.plan_name} activated! Enjoy host privileges.`, 'success');

      // Refresh dashboard summary
      get().fetchOwnerEcosystemData();
      return true;
    } catch {
      return false;
    }
  },

  updateTenantLeadStatus: async (leadId, status, notes, rejectionReason) => {
    try {
      const updated = await ownerEcosystemService.updateLeadStatus(leadId, status, notes, rejectionReason);
      if (updated) {
        set((state) => ({
          tenantLeads: state.tenantLeads.map((l) => (l.id === leadId ? updated : l)),
        }));
        if (status === 'APPROVED') {
          get().showToast(`Tenant lead approved! E-Lease draft initiated.`, 'success');
        } else if (status === 'REJECTED') {
          get().showToast('Lead marked as rejected', 'info');
        } else {
          get().showToast(`Lead status updated to ${status.replace('_', ' ')}`, 'info');
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  addTenantLeadNote: async (leadId, note) => {
    try {
      const updated = await ownerEcosystemService.addLeadNote(leadId, note);
      if (updated) {
        set((state) => ({
          tenantLeads: state.tenantLeads.map((l) => (l.id === leadId ? updated : l)),
        }));
        get().showToast('Lead note added', 'success');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  setTenantLeadReminder: async (leadId, reminderDate) => {
    try {
      set((state) => ({
        tenantLeads: state.tenantLeads.map((l) =>
          l.id === leadId ? { ...l, reminder_date: reminderDate, updated_at: new Date().toISOString() } : l
        ),
      }));
      get().showToast(`Follow-up reminder set for ${reminderDate}`, 'success');
      return true;
    } catch {
      return false;
    }
  },

  updateVisitCheckin: async (visitId, status, notes) => {
    try {
      const updated = await ownerEcosystemService.updateVisitCheckinStatus(visitId, status, notes);
      if (updated) {
        set((state) => ({
          ownerVisits: state.ownerVisits.map((v) => (v.id === visitId ? updated : v)),
        }));
        if (status === 'CHECKED_IN' || status === 'COMPLETED') {
          get().showToast('Visit verified & QR code checked in!', 'success');
        } else {
          get().showToast(`Visit updated: ${status}`, 'info');
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  sendRentReminder: async (collectionId) => {
    try {
      const res = await ownerEcosystemService.sendRentReminder(collectionId);
      if (res.success) {
        get().showToast(res.message, 'success');
        // Refresh collections and notifications
        const userId = get().user?.id || 'host-user-1';
        const [rent, notifs] = await Promise.all([
          ownerEcosystemService.getRentCollections(userId),
          ownerEcosystemService.getOwnerNotifications(userId),
        ]);
        set({
          rentCollections: rent,
          ownerNotifications: notifs,
          unreadOwnerNotificationsCount: notifs.filter((n) => !n.is_read).length,
        });
      }
      return res;
    } catch (err: any) {
      return { success: false, reminderTier: 'NORMAL', message: err.message || 'Error sending reminder' };
    }
  },

  recordRentPaymentCollected: async (collectionId, method) => {
    try {
      const updated = await ownerEcosystemService.recordOfflinePayment(collectionId, method);
      if (updated) {
        set((state) => ({
          rentCollections: state.rentCollections.map((c) => (c.id === collectionId ? updated : c)),
        }));
        get().showToast(`Rent payment recorded! ₹${updated.rent_amount.toLocaleString('en-IN')} marked collected.`, 'success');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  uploadOwnerDocument: async (doc) => {
    try {
      const created = await ownerEcosystemService.uploadOwnerDocument(doc);
      set((state) => ({
        ownerDocuments: [created, ...state.ownerDocuments],
      }));
      get().showToast('Document uploaded and stored in Vault', 'success');
      return true;
    } catch {
      return false;
    }
  },

  deleteOwnerDocument: async (docId) => {
    try {
      await ownerEcosystemService.deleteOwnerDocument(docId);
      set((state) => ({
        ownerDocuments: state.ownerDocuments.filter((d) => d.id !== docId),
      }));
      get().showToast('Document removed', 'info');
      return true;
    } catch {
      return false;
    }
  },

  markOwnerNotificationRead: async (notifId) => {
    await ownerEcosystemService.markNotificationRead(notifId);
    set((state) => {
      const updated = state.ownerNotifications.map((n) => (n.id === notifId ? { ...n, is_read: true } : n));
      return {
        ownerNotifications: updated,
        unreadOwnerNotificationsCount: updated.filter((n) => !n.is_read).length,
      };
    });
  },

  markAllOwnerNotificationsRead: async () => {
    const userId = get().user?.id || 'host-user-1';
    await ownerEcosystemService.markAllNotificationsRead(userId);
    set((state) => ({
      ownerNotifications: state.ownerNotifications.map((n) => ({ ...n, is_read: true })),
      unreadOwnerNotificationsCount: 0,
    }));
    get().showToast('All notifications marked read', 'info');
  },

  updateListingLifecycleStatus: async (propertyId, status) => {
    try {
      await get().updateProperty(propertyId, { status: status as any });
      get().showToast(`Property status updated to ${status}`, 'success');
      return true;
    } catch {
      return false;
    }
  },

  // ==========================================
  // Resident Services Ecosystem (V5.4.1 Sprint)
  // ==========================================

  fetchUtilityAccounts: async (category) => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.fetchUtilityAccounts(userId, category);
    if (res.success && res.data) {
      set({ utilityAccounts: res.data });
      return res.data;
    }
    return get().utilityAccounts;
  },

  saveUtilityAccount: async (account) => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.saveUtilityAccount({ ...account, user_id: userId });
    if (res.success && res.data) {
      set((state) => ({
        utilityAccounts: [res.data!, ...state.utilityAccounts.filter((a) => a.id !== res.data!.id)],
      }));
      get().showToast('Biller account saved', 'success');
      return { success: true, data: res.data };
    }
    return { success: false, error: res.error };
  },

  fetchUtilityTransactions: async (accountId) => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.fetchUtilityTransactions(userId, accountId);
    if (res.success && res.data) {
      set({ utilityTransactions: res.data });
      return res.data;
    }
    return get().utilityTransactions;
  },

  payUtilityBill: async (payload) => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.payUtilityBill({
      userId,
      accountId: payload.accountId,
      utilityType: (payload.category as any) || 'electricity',
      provider: payload.billerName,
      consumerNumber: payload.consumerNumber,
      amount: payload.amount,
      paymentMethod: (payload.paymentMethod as any) || 'upi',
    });
    if (res.success && res.data) {
      set((state) => ({
        utilityTransactions: [res.data!, ...state.utilityTransactions],
      }));
      const cashbackAmt = Math.round(payload.amount * 0.02);
      if (cashbackAmt > 0) {
        get().triggerCashback(cashbackAmt, 'rent_cashback', `Cashback for ${payload.billerName}`, `2% utility payment reward`, res.data.id).catch(() => {});
      }
      get().showToast(`Paid ₹${payload.amount.toLocaleString('en-IN')} to ${payload.billerName}!`, 'success');
      return { success: true, data: res.data };
    }
    get().showToast(res.error || 'Payment failed', 'error');
    return { success: false, error: res.error };
  },

  toggleUtilityAutopay: async (accountId, isEnabled, maxAmount) => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.toggleAutopay(accountId, userId, isEnabled, maxAmount);
    if (res.success && res.data) {
      set((state) => {
        const updatedAccounts = state.utilityAccounts.map((a) =>
          a.id === accountId ? { ...a, autopay_enabled: isEnabled } : a
        );
        const updatedAutopay = [res.data!, ...state.utilityAutopaySettings.filter((s) => s.account_id !== accountId)];
        return {
          utilityAccounts: updatedAccounts,
          utilityAutopaySettings: updatedAutopay,
        };
      });
      get().showToast(isEnabled ? 'Autopay enabled' : 'Autopay disabled', 'info');
      return { success: true, data: res.data };
    }
    return { success: false, error: res.error };
  },

  fetchServiceCategories: async () => {
    const res = await residentServices.fetchServiceCategories();
    if (res.success && res.data) {
      set({ serviceCategories: res.data });
      return res.data;
    }
    return get().serviceCategories;
  },

  fetchTechnicians: async (categoryId) => {
    const res = await residentServices.fetchTechnicians(categoryId);
    if (res.success && res.data) {
      set({ technicians: res.data });
      return res.data;
    }
    return get().technicians;
  },

  fetchHomeServiceBookings: async () => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.fetchServiceBookings(userId);
    if (res.success && res.data) {
      set({ homeServiceBookings: res.data });
      return res.data;
    }
    return get().homeServiceBookings;
  },

  bookHomeService: async (payload) => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.bookHomeService({ ...payload, user_id: userId });
    if (res.success && res.data) {
      set((state) => ({
        homeServiceBookings: [res.data!, ...state.homeServiceBookings],
      }));
      get().showToast(`Booking confirmed for ${payload.service_type}!`, 'success');
      return { success: true, data: res.data };
    }
    get().showToast(res.error || 'Booking failed', 'error');
    return { success: false, error: res.error };
  },

  cancelHomeService: async (bookingId, reason) => {
    const res = await residentServices.cancelServiceBooking(bookingId, reason);
    if (res.success) {
      set((state) => ({
        homeServiceBookings: state.homeServiceBookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        ),
      }));
      get().showToast('Booking cancelled', 'info');
      return { success: true };
    }
    return { success: false, error: res.error };
  },

  verifyHomeServiceOtp: async (bookingId, otp, type) => {
    const res = await residentServices.verifyServiceOtp(bookingId, otp, type);
    if (res.success && res.data) {
      set((state) => ({
        homeServiceBookings: state.homeServiceBookings.map((b) =>
          b.id === bookingId ? res.data! : b
        ),
      }));
      get().showToast(type === 'start' ? 'Service started' : 'Service completed successfully!', 'success');
      return { success: true };
    }
    get().showToast(res.error || 'Invalid OTP', 'error');
    return { success: false, error: res.error };
  },

  rateHomeService: async (bookingId, technicianId, rating, review) => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.submitReview({
      booking_id: bookingId,
      technician_id: technicianId,
      user_id: userId,
      rating,
      review,
    });
    if (res.success) {
      get().showToast('Thank you for your rating!', 'success');
      return { success: true };
    }
    return { success: false, error: res.error };
  },

  fetchSocietyComplaints: async (societyName) => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.fetchSocietyComplaints(userId, societyName);
    if (res.success && res.data) {
      set({ societyComplaints: res.data });
      return res.data;
    }
    return get().societyComplaints;
  },

  createSocietyComplaint: async (payload) => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.createSocietyComplaint({ ...payload, user_id: userId });
    if (res.success && res.data) {
      set((state) => ({
        societyComplaints: [res.data!, ...state.societyComplaints],
      }));
      get().showToast('Complaint registered with Society Admin', 'success');
      return { success: true, data: res.data };
    }
    get().showToast(res.error || 'Failed to lodge complaint', 'error');
    return { success: false, error: res.error };
  },

  resolveSocietyComplaint: async (complaintId) => {
    const res = await residentServices.updateComplaintStatus(complaintId, 'resolved');
    if (res.success) {
      set((state) => ({
        societyComplaints: state.societyComplaints.map((c) =>
          c.id === complaintId ? { ...c, status: 'resolved', resolved_at: new Date().toISOString() } : c
        ),
      }));
      get().showToast('Complaint marked resolved', 'success');
      return { success: true };
    }
    return { success: false, error: res.error };
  },

  fetchSocietyNotices: async (societyName) => {
    const res = await residentServices.fetchSocietyNotices(societyName);
    if (res.success && res.data) {
      set({ societyNotices: res.data });
      return res.data;
    }
    return get().societyNotices;
  },

  fetchVisitorPasses: async () => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.fetchVisitorPasses(userId);
    if (res.success && res.data) {
      set({ visitorPasses: res.data });
      return res.data;
    }
    return get().visitorPasses;
  },

  createVisitorPass: async (payload) => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.createVisitorPass({ ...payload, user_id: userId });
    if (res.success && res.data) {
      set((state) => ({
        visitorPasses: [res.data!, ...state.visitorPasses],
      }));
      get().showToast(`Visitor pass generated for ${payload.visitor_name}`, 'success');
      return { success: true, data: res.data };
    }
    get().showToast(res.error || 'Failed to generate pass', 'error');
    return { success: false, error: res.error };
  },

  fetchDeliveryPasses: async () => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.fetchDeliveryPasses(userId);
    if (res.success && res.data) {
      set({ deliveryPasses: res.data });
      return res.data;
    }
    return get().deliveryPasses;
  },

  createDeliveryPass: async (payload) => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.createDeliveryPass({ ...payload, user_id: userId });
    if (res.success && res.data) {
      set((state) => ({
        deliveryPasses: [res.data!, ...state.deliveryPasses],
      }));
      get().showToast(`Delivery pass approved for ${payload.company_name}`, 'success');
      return { success: true, data: res.data };
    }
    get().showToast(res.error || 'Failed to generate delivery pass', 'error');
    return { success: false, error: res.error };
  },

  fetchAmenityBookings: async () => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.fetchAmenityBookings(userId);
    if (res.success && res.data) {
      set({ amenityBookings: res.data });
      return res.data;
    }
    return get().amenityBookings;
  },

  bookSocietyAmenity: async (payload) => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.bookAmenity({ ...payload, user_id: userId });
    if (res.success && res.data) {
      set((state) => ({
        amenityBookings: [res.data!, ...state.amenityBookings],
      }));
      get().showToast(`Booking confirmed for ${payload.amenity_name}!`, 'success');
      return { success: true, data: res.data };
    }
    get().showToast(res.error || 'Failed to book amenity', 'error');
    return { success: false, error: res.error };
  },

  fetchMaintenancePayments: async () => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.fetchMaintenanceLedger(userId);
    if (res.success && res.data) {
      set({ maintenancePayments: res.data });
      return res.data;
    }
    return get().maintenancePayments;
  },

  payMaintenanceBill: async (payload) => {
    const userId = get().user?.id || 'demo-user-1';
    const res = await residentServices.payMaintenanceBill({ ...payload, user_id: userId });
    if (res.success && res.data) {
      set((state) => ({
        maintenancePayments: [res.data!, ...state.maintenancePayments],
      }));
      const cashbackAmt = Math.round(payload.amount * 0.015);
      if (cashbackAmt > 0) {
        get().triggerCashback(cashbackAmt, 'rent_cashback', `Cashback for Society Maintenance`, `1.5% maintenance payment reward`, res.data.id).catch(() => {});
      }
      get().showToast(`Paid maintenance ₹${payload.amount.toLocaleString('en-IN')}!`, 'success');
      return { success: true, data: res.data };
    }
    get().showToast(res.error || 'Maintenance payment failed', 'error');
    return { success: false, error: res.error };
  },

  // V6.2 AI Recommendations State
  recommendations: [],
  similarSavedProperties: [],
  nearOfficeProperties: [],
  trendingProperties: [],
  zeroDepositProperties: [],
  luxuryProperties: [],
  weekendPicks: [],
  recommendationLoading: false,

  refreshRecommendations: async () => {
    set({ recommendationLoading: true });
    const user = get().user;
    const userId = user?.id || 'guest_user';
    const city = get().activeFilter?.city || 'Mumbai';

    try {
      const [
        recPicks,
        simPicks,
        commutePicks,
        trendPicks,
        zeroPicks,
        luxPicks,
        wkndPicks,
      ] = await Promise.all([
        recommendationsService.generateRecommendations(userId),
        recommendationsService.getSimilarToSavedRecommendations(userId),
        recommendationsService.getNearOfficeRecommendations(userId),
        recommendationsService.getTrendingProperties(city),
        recommendationsService.getZeroDepositRecommendations(userId),
        recommendationsService.getLuxuryRecommendations(userId),
        recommendationsService.getWeekendPicks(city),
      ]);

      set({
        recommendations: recPicks,
        similarSavedProperties: simPicks,
        nearOfficeProperties: commutePicks,
        trendingProperties: trendPicks,
        zeroDepositProperties: zeroPicks,
        luxuryProperties: luxPicks,
        weekendPicks: wkndPicks,
        recommendationLoading: false,
      });
    } catch {
      set({ recommendationLoading: false });
    }
  },

  trackPropertyView: async (propertyId: string) => {
    const user = get().user;
    const userId = user?.id || 'guest_user';
    await recommendationsService.trackPropertyView(userId, propertyId);
  },

  markRecommendationInterested: async (propertyId: string) => {
    const user = get().user;
    const userId = user?.id || 'guest_user';
    await recommendationsService.trackRecommendationFeedback(userId, propertyId, true);
  },

  markRecommendationNotInterested: async (propertyId: string) => {
    // Optimistic UI update: immediately remove from all recommendation feeds
    set((state) => ({
      recommendations: state.recommendations.filter((r) => r.property.id !== propertyId),
      similarSavedProperties: state.similarSavedProperties.filter((r) => r.property.id !== propertyId),
      nearOfficeProperties: state.nearOfficeProperties.filter((r) => r.property.id !== propertyId),
      trendingProperties: state.trendingProperties.filter((p) => p.id !== propertyId),
      zeroDepositProperties: state.zeroDepositProperties.filter((p) => p.id !== propertyId),
      luxuryProperties: state.luxuryProperties.filter((p) => p.id !== propertyId),
      weekendPicks: state.weekendPicks.filter((p) => p.id !== propertyId),
    }));

    const user = get().user;
    const userId = user?.id || 'guest_user';
    await recommendationsService.trackRecommendationFeedback(
      userId,
      propertyId,
      false,
      'user_dismissed'
    );
  },

  // V6.2 AI Search & Smart Maps 2.0 State
  searchQuery: '',
  searchResults: [],
  mapProperties: [],
  advancedFilters: {},
  savedSearches: [],
  nearbyPlaces: [],
  localityInsights: {},

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  performSmartSearch: async (query?: string, filters?: Partial<AdvancedFilterPayload>) => {
    const q = query !== undefined ? query : get().searchQuery;
    const f = filters || get().advancedFilters;
    const user = get().user;

    const res = await smartSearchService.executeSmartSearch({
      query: q,
      filters: f,
      userId: user?.id,
    });

    set({
      searchQuery: q,
      searchResults: res.properties,
      mapProperties: res.properties,
    });
  },

  setAdvancedFilters: (filters: Partial<AdvancedFilterPayload>) => {
    set({ advancedFilters: filters });
    get().performSmartSearch(get().searchQuery, filters);
  },

  resetAdvancedFilters: () => {
    set({ advancedFilters: {} });
    get().performSmartSearch(get().searchQuery, {});
  },

  fetchSavedSearches: async () => {
    const user = get().user;
    if (!user) return;
    const list = await smartSearchService.getUserSavedSearches(user.id);
    set({ savedSearches: list });
  },

  saveSearch: async (name: string, filters?: Partial<AdvancedFilterPayload>) => {
    const user = get().user;
    if (!user) {
      get().showToast('Please sign in to save searches', 'info');
      return false;
    }
    const f = filters || get().advancedFilters;
    const res = await smartSearchService.saveUserSearch(user.id, name, f);
    if (res.success && res.data) {
      set((state) => ({ savedSearches: [res.data!, ...state.savedSearches] }));
      get().showToast('Search alert saved!', 'success');
      return true;
    }
    get().showToast(res.error || 'Failed to save search', 'error');
    return false;
  },

  removeSavedSearch: async (id: string) => {
    const success = await smartSearchService.deleteSavedSearch(id);
    if (success) {
      set((state) => ({
        savedSearches: state.savedSearches.filter((s) => s.id !== id),
      }));
      get().showToast('Search alert removed', 'info');
      return true;
    }
    return false;
  },

  fetchLocalityScores: async (locality: string) => {
    const cached = get().localityInsights[locality.toLowerCase()];
    if (cached) return cached;

    const score = await smartMapsService.getLocalityScores(locality);
    set((state) => ({
      localityInsights: { ...state.localityInsights, [locality.toLowerCase()]: score },
    }));
    return score;
  },

  fetchNearbyPlaces: async (lat = 19.0596, lng = 72.8295, type?: CommuteHubType) => {
    const hubs = await smartMapsService.getNearbyCommuteHubs(lat, lng, 10, type);
    set({ nearbyPlaces: hubs });
  },

  // V6.3 AI Property Compare & Neighborhood Intelligence
  comparePropertyIds: [],
  localityScoresMap: {},
  crimeStatsMap: {},
  aqiMap: {},

  addToCompare: (id: string) => {
    const current = get().comparePropertyIds;
    if (current.includes(id)) return;
    if (current.length >= 4) {
      get().showToast('You can compare up to 4 properties', 'info');
      return;
    }
    set({ comparePropertyIds: [...current, id] });
    get().showToast('Added to compare list', 'success');
  },

  removeFromCompare: (id: string) => {
    set({
      comparePropertyIds: get().comparePropertyIds.filter((pId) => pId !== id),
    });
  },

  clearCompare: () => {
    set({ comparePropertyIds: [] });
  },

  fetchNeighborhoodIntelligence: async (locality: string) => {
    try {
      const data = await propertyCompareService.getLocalityIntelligence(locality);
      set((state) => ({
        localityScoresMap: { ...state.localityScoresMap, [locality]: data.scores },
        crimeStatsMap: { ...state.crimeStatsMap, [locality]: data.crime },
        aqiMap: { ...state.aqiMap, [locality]: data.air },
      }));
    } catch {
      // Handled silently
    }
  },

  // V6.4 AI Assistant OS State
  aiConversations: [],
  activeAiConversationId: 'conv_default',
  aiMessages: [],
  isAiTyping: false,
  userAIMemory: {
    monthlyIncome: 140000,
    targetRent: 45000,
    maxRent: 55000,
    targetDeposit: 90000,
    preferredLocalities: ['BKC', 'Bandra West', 'Powai', 'Lower Parel'],
    officeLocation: 'BKC',
    commuteMode: 'metro',
    lifestyle: ['Gym enthusiast', 'Cooks daily', 'Prefers high floor'],
  },

  updateUserAIMemory: (memory: Partial<UserAIMemory>) => {
    set((state) => ({
      userAIMemory: { ...state.userAIMemory, ...memory },
    }));
  },

  setAiConversations: (conversations: AIConversationRecord[]) => {
    set({ aiConversations: conversations });
  },

  setActiveAiConversationId: (id: string) => {
    set({ activeAiConversationId: id });
  },

  addAiMessage: (message: AIChatMessage) => {
    set((state) => ({
      aiMessages: [...state.aiMessages, message],
    }));
  },

  clearAiMessages: () => {
    set({ aiMessages: [] });
  },

  // V7.1 Real Maps + Camera + Voice AI Slices
  userLiveLocation: null,
  savedPlaces: [],
  pendingMediaUploads: [],
  activeUploadProgress: 0,
  userOcrDocuments: [],
  recentVoiceQueries: [],
  voiceAILanguage: 'en-IN',

  setUserLiveLocation: (location) => set({ userLiveLocation: location }),
  setSavedPlaces: (places) => set({ savedPlaces: places }),
  addSavedPlace: (place) => set((state) => ({ savedPlaces: [place, ...state.savedPlaces] })),
  setPendingMediaUploads: (uploads) => set({ pendingMediaUploads: uploads }),
  setActiveUploadProgress: (progress) => set({ activeUploadProgress: progress }),
  setUserOcrDocuments: (docs) => set({ userOcrDocuments: docs }),
  addOcrDocument: (doc) => set((state) => ({ userOcrDocuments: [doc, ...state.userOcrDocuments] })),
  setRecentVoiceQueries: (queries) => set({ recentVoiceQueries: queries }),
  addVoiceQuery: (query) => set((state) => ({ recentVoiceQueries: [query, ...state.recentVoiceQueries] })),
  setVoiceAILanguage: (lang) => set({ voiceAILanguage: lang }),
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
