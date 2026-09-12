// ==============================================================================
// REHVO V6.1 — COMPLETE DOMAIN NOTIFICATION TRIGGERS (PRODUCTION)
// Domain event triggers for Chat, Flatmates, Property, Wallet, Owner, Society,
// Utilities, and Move-In OS.
// Persists directly into Supabase `notification_events` and dispatches local & push alerts.
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { scheduleLocalNotification } from './pushNotifications';
import { resolveNotificationDeepLink } from './notificationDeepLinks';

interface BaseTriggerOptions {
  recipientId: string;
  title: string;
  body: string;
  type: string;
  category?: string;
  priority?: 'low' | 'default' | 'high' | 'urgent';
  data?: Record<string, any>;
  imageUrl?: string;
  icon?: string;
  channelId?: 'default' | 'messages' | 'visits' | 'wallet' | 'urgent';
}

/**
 * Core internal helper to persist in Supabase and trigger notification locally
 */
async function dispatchDomainNotification(opts: BaseTriggerOptions): Promise<void> {
  const deepLink = resolveNotificationDeepLink({
    ...opts.data,
    type: opts.type,
    category: opts.category,
  });

  const payloadData = {
    ...(opts.data || {}),
    type: opts.type,
    category: opts.category || opts.type,
    deepLink,
    url: deepLink,
  };

  // 1. Persist in Supabase central `notification_events` feed
  if (isSupabaseConfigured() && opts.recipientId) {
    try {
      await supabase.from('notification_events').insert({
        user_id: opts.recipientId,
        recipient_id: opts.recipientId,
        type: opts.type,
        event_type: opts.category || opts.type,
        title: opts.title,
        body: opts.body,
        category: opts.category || opts.type,
        priority: opts.priority || 'default',
        image_url: opts.imageUrl,
        icon: opts.icon,
        data: payloadData,
        is_read: false,
      });
    } catch {
      // Fail silently without disrupting UI action
    }
  }

  // 2. Fire local notification alert
  await scheduleLocalNotification({
    title: opts.title,
    body: opts.body,
    data: payloadData,
    channelId: opts.channelId || 'default',
  });
}

export const notificationTriggers = {
  // ============================================================================
  // 1. CHAT NOTIFICATION OS
  // ============================================================================

  async notifyChatMessage(params: {
    recipientId: string;
    senderName: string;
    conversationId: string;
    messageSnippet: string;
    propertyTitle?: string;
  }): Promise<void> {
    const title = params.senderName;
    const body = params.propertyTitle
      ? `[${params.propertyTitle}] ${params.messageSnippet}`
      : params.messageSnippet;

    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title,
      body,
      type: 'chat_message',
      category: 'messages',
      data: {
        conversationId: params.conversationId,
        conversation_id: params.conversationId,
      },
      channelId: 'messages',
    });
  },

  async notifyChatImage(params: {
    recipientId: string;
    senderName: string;
    conversationId: string;
    imageUrl?: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: params.senderName,
      body: '📷 Sent a photo',
      type: 'chat_message',
      category: 'messages',
      imageUrl: params.imageUrl,
      data: { conversationId: params.conversationId },
      channelId: 'messages',
    });
  },

  async notifyChatVoice(params: {
    recipientId: string;
    senderName: string;
    conversationId: string;
    durationSec?: number;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: params.senderName,
      body: `🎤 Voice note (${params.durationSec ? `${params.durationSec}s` : 'audio'})`,
      type: 'chat_message',
      category: 'messages',
      data: { conversationId: params.conversationId },
      channelId: 'messages',
    });
  },

  async notifyChatPropertyShared(params: {
    recipientId: string;
    senderName: string;
    conversationId: string;
    propertyTitle: string;
    propertyId: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: params.senderName,
      body: `🏡 Shared a property: "${params.propertyTitle}"`,
      type: 'chat_message',
      category: 'messages',
      data: {
        conversationId: params.conversationId,
        propertyId: params.propertyId,
      },
      channelId: 'messages',
    });
  },

  async notifyChatPaymentRequest(params: {
    recipientId: string;
    senderName: string;
    conversationId: string;
    amount: number;
    purpose: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `💳 Payment Requested by ${params.senderName}`,
      body: `₹${params.amount.toLocaleString('en-IN')} for ${params.purpose}. Tap to pay securely.`,
      type: 'payment',
      category: 'wallet',
      data: { conversationId: params.conversationId, amount: params.amount },
      channelId: 'wallet',
    });
  },

  async notifyChatVisitInvite(params: {
    recipientId: string;
    senderName: string;
    propertyTitle: string;
    visitDate: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `📅 Visit Invitation: ${params.propertyTitle}`,
      body: `${params.senderName} invited you to view the property on ${params.visitDate}.`,
      type: 'visit_booking',
      category: 'visits',
      data: { deepLink: '/(renter)/visits' },
      channelId: 'visits',
    });
  },

  // ============================================================================
  // 2. FLATMATES NOTIFICATION OS
  // ============================================================================

  async notifyFlatmateWave(params: {
    recipientId: string;
    senderName: string;
    compatibilityScore: number;
    profileId: string;
    isSuperWave?: boolean;
  }): Promise<void> {
    const icon = params.isSuperWave ? '⚡ Super Wave!' : '👋 New Wave!';
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `${icon} from ${params.senderName}`,
      body: `${params.compatibilityScore}% Compatibility Match. Tap to connect and view their profile.`,
      type: 'flatmate_wave',
      category: 'flatmates',
      data: { profileId: params.profileId, profile_id: params.profileId },
      channelId: 'messages',
    });
  },

  async notifyFlatmateWaveAccepted(params: {
    recipientId: string;
    flatmateName: string;
    profileId: string;
    conversationId?: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `🎉 Wave Accepted!`,
      body: `${params.flatmateName} accepted your wave. Chat is now unlocked!`,
      type: 'flatmate_match',
      category: 'flatmates',
      data: {
        profileId: params.profileId,
        conversationId: params.conversationId,
      },
      channelId: 'messages',
    });
  },

  async notifyFlatmateMatch(params: {
    recipientId: string;
    flatmateName: string;
    compatibilityScore: number;
    profileId: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `🌟 It's a Match! ${params.compatibilityScore}% Synergy`,
      body: `You and ${params.flatmateName} matched on lifestyle, habits, and preferences!`,
      type: 'flatmate_match',
      category: 'flatmates',
      data: { profileId: params.profileId },
      channelId: 'messages',
    });
  },

  async notifyFlatmateProfileViewed(params: {
    recipientId: string;
    viewerName: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `👀 Someone checked your vibe!`,
      body: `${params.viewerName} viewed your flatmate profile today.`,
      type: 'flatmate_wave',
      category: 'flatmates',
      data: { deepLink: '/(renter)/flatmates' },
      channelId: 'default',
    });
  },

  async notifyApartmentSuggestion(params: {
    recipientId: string;
    propertyTitle: string;
    propertyId: string;
    flatmateName: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `🏢 Flat Suggestion for Flatmates`,
      body: `${params.flatmateName} suggested "${params.propertyTitle}" for co-living.`,
      type: 'property_saved',
      category: 'flatmates',
      data: { propertyId: params.propertyId },
      channelId: 'default',
    });
  },

  async notifyCompatibilityUpdated(params: {
    recipientId: string;
    profileId: string;
    newScore: number;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `✨ VibeScore Updated!`,
      body: `Your compatibility score increased to ${params.newScore}%. Discover updated matches!`,
      type: 'flatmate_match',
      category: 'flatmates',
      data: { profileId: params.profileId },
      channelId: 'default',
    });
  },

  // ============================================================================
  // 3. PROPERTY & VISIT NOTIFICATION OS
  // ============================================================================

  async notifyEnquiryReceived(params: {
    ownerId: string;
    tenantName: string;
    propertyTitle: string;
    propertyId: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.ownerId,
      title: `📩 New Enquiry: ${params.propertyTitle}`,
      body: `${params.tenantName} sent an enquiry for your property. Tap to view and respond.`,
      type: 'enquiry',
      category: 'owner_leads',
      data: { propertyId: params.propertyId },
      channelId: 'messages',
    });
  },

  async notifyOwnerReplied(params: {
    recipientId: string;
    ownerName: string;
    propertyTitle: string;
    conversationId: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `💬 ${params.ownerName} Replied`,
      body: `New response regarding "${params.propertyTitle}".`,
      type: 'chat_message',
      category: 'messages',
      data: { conversationId: params.conversationId },
      channelId: 'messages',
    });
  },

  async notifyVisitConfirmed(params: {
    recipientId: string;
    propertyTitle: string;
    visitDate: string;
    passCode?: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `✅ Visit Confirmed: ${params.propertyTitle}`,
      body: `Your viewing is confirmed for ${params.visitDate}.${params.passCode ? ` Passcode: ${params.passCode}.` : ''}`,
      type: 'visit_booking',
      category: 'visits',
      data: { deepLink: '/(renter)/visits' },
      channelId: 'visits',
    });
  },

  async notifyVisitCancelled(params: {
    recipientId: string;
    propertyTitle: string;
    reason?: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `❌ Visit Cancelled: ${params.propertyTitle}`,
      body: params.reason
        ? `The visit was cancelled: "${params.reason}".`
        : `Your scheduled visit has been cancelled. Tap to reschedule.`,
      type: 'visit_booking',
      category: 'visits',
      data: { deepLink: '/(renter)/visits' },
      channelId: 'visits',
    });
  },

  async notifyVisitReminder(params: {
    recipientId: string;
    propertyTitle: string;
    timeUntilVisit: string;
    passCode?: string;
    visitId?: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `📅 Visit Reminder: ${params.propertyTitle}`,
      body: params.passCode
        ? `Your property visit starts in ${params.timeUntilVisit}. Gate Entry Passcode: ${params.passCode}.`
        : `Your scheduled property viewing starts in ${params.timeUntilVisit}.`,
      type: 'visit_reminder',
      category: 'visits',
      data: { deepLink: '/(renter)/visits', visitId: params.visitId, visit_id: params.visitId },
      channelId: 'visits',
    });
  },

  async notifyPriceDrop(params: {
    recipientId: string;
    propertyTitle: string;
    propertyId: string;
    oldRent: number;
    newRent: number;
  }): Promise<void> {
    const diff = params.oldRent - params.newRent;
    const percent = Math.round((diff / params.oldRent) * 100);

    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `📉 Price Drop: ${params.propertyTitle}`,
      body: `Rent reduced by ₹${diff.toLocaleString('en-IN')} (${percent}% OFF). Now ₹${params.newRent.toLocaleString('en-IN')}/mo!`,
      type: 'price_drop',
      category: 'property_updates',
      data: { propertyId: params.propertyId },
      channelId: 'default',
    });
  },

  // ============================================================================
  // 4. WALLET & REWARDS NOTIFICATION OS
  // ============================================================================

  async notifyCashbackCredit(params: {
    recipientId: string;
    amount: number;
    source: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `✨ +₹${params.amount} R-Cash Credited!`,
      body: `You received ₹${params.amount} cashback from ${params.source}. Spend it on rent or services.`,
      type: 'cashback',
      category: 'wallet',
      data: { amount: params.amount },
      channelId: 'wallet',
    });
  },

  async notifyWithdrawalCompleted(params: {
    recipientId: string;
    amount: number;
    bankAccountMask: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `💸 Withdrawal Successful`,
      body: `₹${params.amount.toLocaleString('en-IN')} successfully transferred to ${params.bankAccountMask}.`,
      type: 'withdrawal',
      category: 'wallet',
      data: { amount: params.amount },
      channelId: 'wallet',
    });
  },

  async notifyWithdrawalFailed(params: {
    recipientId: string;
    amount: number;
    reason: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `⚠️ Withdrawal Failed`,
      body: `₹${params.amount.toLocaleString('en-IN')} could not be processed: ${params.reason}. Refunded to wallet.`,
      type: 'withdrawal',
      category: 'wallet',
      priority: 'high',
      data: { amount: params.amount },
      channelId: 'wallet',
    });
  },

  async notifyPaymentSuccess(params: {
    recipientId: string;
    amount: number;
    purpose: string;
    receiptId: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `✅ Payment of ₹${params.amount.toLocaleString('en-IN')} Confirmed`,
      body: `Receipt #${params.receiptId} generated for ${params.purpose}. R-Coins rewarded!`,
      type: 'payment',
      category: 'wallet',
      data: { receiptId: params.receiptId },
      channelId: 'wallet',
    });
  },

  async notifyPaymentFailed(params: {
    recipientId: string;
    amount: number;
    purpose: string;
    reason: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `❌ Payment Failed`,
      body: `₹${params.amount.toLocaleString('en-IN')} for ${params.purpose} failed: ${params.reason}.`,
      type: 'payment',
      category: 'wallet',
      priority: 'high',
      channelId: 'wallet',
    });
  },

  async notifyRewardUnlocked(params: {
    recipientId: string;
    rewardTitle: string;
    coinsEarned?: number;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `🎁 Reward Unlocked: ${params.rewardTitle}!`,
      body: params.coinsEarned
        ? `You earned +${params.coinsEarned} R-Coins. Scratch card ready to reveal!`
        : `Claim your new exclusive perk in the REHVO Club.`,
      type: 'reward',
      category: 'rewards',
      channelId: 'wallet',
    });
  },

  async notifyReferralEarned(params: {
    recipientId: string;
    friendName: string;
    coinsAmount: number;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `🤝 Referral Bonus Unlocked!`,
      body: `${params.friendName} signed up using your link. +${params.coinsAmount} R-Coins added!`,
      type: 'reward',
      category: 'rewards',
      channelId: 'wallet',
    });
  },

  // ============================================================================
  // 5. OWNER NOTIFICATION OS
  // ============================================================================

  async notifyOwnerLead(params: {
    ownerId: string;
    tenantName: string;
    propertyTitle: string;
    budget?: number;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.ownerId,
      title: `🎯 New Tenant Lead!`,
      body: `${params.tenantName} is interested in ${params.propertyTitle}${params.budget ? ` (Budget ₹${params.budget.toLocaleString('en-IN')})` : ''}.`,
      type: 'owner_lead',
      category: 'owner_leads',
      data: { deepLink: '/(owner)/leads' },
      channelId: 'messages',
    });
  },

  async notifyListingApproved(params: {
    ownerId: string;
    propertyTitle: string;
    propertyId: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.ownerId,
      title: `🚀 Listing is Live: ${params.propertyTitle}`,
      body: `Your property has been verified and published to thousands of active seekers.`,
      type: 'property_updates',
      category: 'owner_leads',
      data: { propertyId: params.propertyId, deepLink: '/(owner)/listings' },
      channelId: 'default',
    });
  },

  async notifyListingPaused(params: {
    ownerId: string;
    propertyTitle: string;
    reason?: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.ownerId,
      title: `⏸️ Listing Paused: ${params.propertyTitle}`,
      body: params.reason || `Your listing has been paused. Inquiries are temporarily closed.`,
      type: 'property_updates',
      category: 'owner_leads',
      data: { deepLink: '/(owner)/listings' },
      channelId: 'default',
    });
  },

  async notifyRentReceived(params: {
    ownerId: string;
    tenantName: string;
    propertyTitle: string;
    amount: number;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.ownerId,
      title: `💰 Rent Received: ₹${params.amount.toLocaleString('en-IN')}`,
      body: `${params.tenantName} paid rent for ${params.propertyTitle}. Funds settled to account.`,
      type: 'payment',
      category: 'wallet',
      data: { deepLink: '/(owner)/rent-collection' },
      channelId: 'wallet',
    });
  },

  async notifyRentOverdue(params: {
    ownerId: string;
    tenantName: string;
    propertyTitle: string;
    daysOverdue: number;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.ownerId,
      title: `⚠️ Rent Overdue (${params.daysOverdue} Days)`,
      body: `${params.tenantName} has not paid rent for ${params.propertyTitle}. 1-tap WhatsApp reminder ready.`,
      type: 'rent_due',
      category: 'wallet',
      priority: 'high',
      data: { deepLink: '/(owner)/rent-collection' },
      channelId: 'wallet',
    });
  },

  async notifySubscriptionExpiring(params: {
    ownerId: string;
    planName: string;
    daysLeft: number;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.ownerId,
      title: `⏳ ${params.planName} Plan Expiring in ${params.daysLeft} Days`,
      body: `Renew your listing booster plan to keep top search placement and verified badges.`,
      type: 'system',
      category: 'owner_leads',
      data: { deepLink: '/(owner)/subscription' },
      channelId: 'default',
    });
  },

  // ============================================================================
  // 6. SOCIETY NOTIFICATION OS (MYGATE STYLE)
  // ============================================================================

  async notifyVisitorArrived(params: {
    recipientId: string;
    visitorName: string;
    purpose?: string;
    vehicleNo?: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `🚪 Visitor at Society Gate: ${params.visitorName}`,
      body: `${params.purpose ? `${params.purpose}. ` : ''}Vehicle: ${params.vehicleNo || 'N/A'}. Tap to approve entry.`,
      type: 'visitor_arrived',
      category: 'society',
      priority: 'urgent',
      data: { deepLink: '/(renter)/society' },
      channelId: 'urgent',
    });
  },

  async notifyDeliveryArrived(params: {
    recipientId: string;
    companyName: string;
    passCode: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `📦 ${params.companyName} at Security Gate`,
      body: `Your delivery agent has arrived. Security Code: ${params.passCode}.`,
      type: 'delivery_arrived',
      category: 'society',
      priority: 'urgent',
      data: { deepLink: '/(renter)/society' },
      channelId: 'urgent',
    });
  },

  async notifySocietyNotice(params: {
    recipientId: string;
    societyName: string;
    noticeTitle: string;
    isUrgent?: boolean;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: params.isUrgent
        ? `🚨 Urgent Notice: ${params.societyName}`
        : `📢 Society Notice: ${params.societyName}`,
      body: params.noticeTitle,
      type: 'society_notice',
      category: 'society',
      priority: params.isUrgent ? 'urgent' : 'default',
      data: { deepLink: '/(renter)/society/notices' },
      channelId: params.isUrgent ? 'urgent' : 'default',
    });
  },

  async notifyMaintenanceReminder(params: {
    recipientId: string;
    societyName: string;
    amount: number;
    dueDate: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `🏢 Society Maintenance Due`,
      body: `₹${params.amount.toLocaleString('en-IN')} due on ${params.dueDate} for ${params.societyName}.`,
      type: 'maintenance_due',
      category: 'society',
      data: { deepLink: '/(renter)/society' },
      channelId: 'wallet',
    });
  },

  async notifySosAlert(params: {
    recipientId: string;
    senderName: string;
    flatNumber: string;
    coordinates?: { lat: number; lng: number };
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `🆘 SOS EMERGENCY ALERT`,
      body: `Emergency triggered by ${params.senderName} (Flat ${params.flatNumber}). Immediate assistance required!`,
      type: 'system',
      category: 'society',
      priority: 'urgent',
      data: { deepLink: '/(renter)/sos' },
      channelId: 'urgent',
    });
  },

  // ============================================================================
  // 7. UTILITIES NOTIFICATION OS
  // ============================================================================

  async notifyUtilityBillDue(params: {
    recipientId: string;
    utilityType: 'electricity' | 'water' | 'gas' | 'broadband';
    amount: number;
    dueDate: string;
  }): Promise<void> {
    const label = params.utilityType.toUpperCase();
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `⚡ ${label} Bill Due: ₹${params.amount}`,
      body: `Due on ${params.dueDate}. Pay with REHVO to earn 2% instant cashback.`,
      type: 'utility_due',
      category: 'property_updates',
      data: { deepLink: `/(renter)/utilities/${params.utilityType}` },
      channelId: 'wallet',
    });
  },

  async notifyAutopayStatus(params: {
    recipientId: string;
    utilityType: string;
    amount: number;
    success: boolean;
    reason?: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: params.success
        ? `✅ Autopay Success: ${params.utilityType}`
        : `⚠️ Autopay Failed: ${params.utilityType}`,
      body: params.success
        ? `₹${params.amount} automatically debited. Receipt saved to Document Vault.`
        : `Failed: ${params.reason || 'Insufficient funds'}. Please pay manually.`,
      type: 'payment',
      category: 'wallet',
      priority: params.success ? 'default' : 'high',
      data: { deepLink: '/(renter)/utilities' },
      channelId: 'wallet',
    });
  },

  // ============================================================================
  // 8. MOVE-IN CONCIERGE NOTIFICATION OS
  // ============================================================================

  async notifyMoveInChecklist(params: {
    recipientId: string;
    pendingCount: number;
    daysUntilMoveIn: number;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `📋 ${params.pendingCount} Move-In Items Pending`,
      body: `You have ${params.daysUntilMoveIn} days left. Complete your utility setup and furniture checks!`,
      type: 'checklist_reminder',
      category: 'property_updates',
      data: { deepLink: '/(renter)/move-in' },
      channelId: 'default',
    });
  },

  async notifyKeyHandoverReady(params: {
    recipientId: string;
    propertyTitle: string;
    ownerPhone?: string;
  }): Promise<void> {
    await dispatchDomainNotification({
      recipientId: params.recipientId,
      title: `🔑 Ready for Key Handover!`,
      body: `Keys are available for ${params.propertyTitle}. Verify inventory checklist on arrival.`,
      type: 'move_in_reminder',
      category: 'property_updates',
      data: { deepLink: '/(renter)/move-in' },
      channelId: 'visits',
    });
  },
};
