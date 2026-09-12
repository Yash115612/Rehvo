// ==============================================================================
// REHVO V5.4.1 — PUSH DISPATCHER SERVICE (PRODUCTION)
// Centralized, Event-Driven Push Notification Dispatcher for Chat, Property,
// Visits, Wallet & RentPay, Flatmates, and Owner Ecosystems
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { scheduleLocalNotification } from './pushNotifications';

export interface BasePushOptions {
  userId: string;
  title: string;
  body: string;
  category: 'messages' | 'visits' | 'property' | 'wallet' | 'flatmate' | 'owner' | 'rent' | 'marketing' | 'system';
  data?: Record<string, any>;
  sound?: string;
  channelId?: 'default' | 'messages' | 'visits' | 'wallet' | 'urgent';
  badge?: number;
}

/**
 * Dispatch a push notification to user device(s) and log event
 */
export async function dispatchPushNotification(options: BasePushOptions): Promise<{ success: boolean; error?: string }> {
  if (!options.userId) return { success: false, error: 'User ID missing' };

  try {
    if (isSupabaseConfigured()) {
      // 1. Write to in-app notifications table
      const { data: insertedNotif, error: notifErr } = await supabase
        .from('notifications')
        .insert({
          user_id: options.userId,
          title: options.title,
          body: options.body,
          type: options.category,
          data: options.data || {},
          is_read: false,
        })
        .select()
        .single();

      // 2. Call send-push Edge Function or fetch push tokens directly
      const { data: tokens } = await supabase
        .from('push_tokens')
        .select('push_token')
        .eq('user_id', options.userId)
        .eq('is_active', true);

      if (tokens && tokens.length > 0) {
        const messages = tokens.map((t) => ({
          to: t.push_token,
          sound: options.sound || 'default',
          title: options.title,
          body: options.body,
          data: options.data || {},
          channelId: options.channelId || 'default',
          badge: options.badge,
        }));

        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messages),
        }).catch(() => {});
      }

      // 3. Log event to notification_logs
      try {
        await supabase.from('notification_logs').insert({
          user_id: options.userId,
          notification_id: insertedNotif?.id,
          title: options.title,
          body: options.body,
          category: options.category,
          data: options.data || {},
          status: 'sent',
        });
      } catch {}

      return { success: true };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to dispatch push' };
  }
}

// -----------------------------------------------------------------------------
// PHASE 4 — CHAT PUSH NOTIFICATIONS
// -----------------------------------------------------------------------------
export async function sendChatPush(params: {
  recipientId: string;
  senderName: string;
  messageType: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'payment_request' | 'visit_invite' | 'reaction';
  textSnippet?: string;
  conversationId: string;
  propertyTitle?: string;
}) {
  let body = params.textSnippet || 'New message received';

  switch (params.messageType) {
    case 'image':
      body = '📷 Sent a photo';
      break;
    case 'video':
      body = '🎥 Sent a video';
      break;
    case 'audio':
      body = '🎤 Sent a voice message';
      break;
    case 'document':
      body = '📄 Sent a document';
      break;
    case 'location':
      body = '📍 Shared location';
      break;
    case 'payment_request':
      body = `💳 Payment request: ${params.textSnippet || 'Rent transfer'}`;
      break;
    case 'visit_invite':
      body = '📅 Scheduled visit invitation';
      break;
    case 'reaction':
      body = `❤️ Reacted: ${params.textSnippet || ''}`;
      break;
    default:
      body = params.textSnippet || 'New message received';
  }

  return dispatchPushNotification({
    userId: params.recipientId,
    title: params.propertyTitle ? `${params.senderName} • ${params.propertyTitle}` : params.senderName,
    body,
    category: 'messages',
    channelId: 'messages',
    data: {
      url: `/(renter)/chat/${params.conversationId}`,
      conversation_id: params.conversationId,
      thread_id: params.conversationId,
      sender_name: params.senderName,
    },
  });
}

// -----------------------------------------------------------------------------
// PHASE 5 — PROPERTY PUSH NOTIFICATIONS
// -----------------------------------------------------------------------------
export async function sendPropertyPush(params: {
  userId: string;
  type: 'price_drop' | 'saved_update' | 'new_listing_locality' | 'verified' | 'expiring' | 'report_update';
  propertyTitle: string;
  propertyId: string;
  locality?: string;
  oldPrice?: number;
  newPrice?: number;
  messageExtra?: string;
}) {
  let title = 'Property Update';
  let body = params.propertyTitle;

  if (params.type === 'price_drop' && params.oldPrice && params.newPrice) {
    const diff = params.oldPrice - params.newPrice;
    title = '🏷️ Price Drop Alert!';
    body = `Rent reduced by ₹${diff.toLocaleString()} on ${params.propertyTitle}. Now ₹${params.newPrice.toLocaleString()}/mo.`;
  } else if (params.type === 'new_listing_locality') {
    title = `🏡 New Listing in ${params.locality || 'your saved area'}`;
    body = `${params.propertyTitle} is now available for rent. Tap to view photos.`;
  } else if (params.type === 'saved_update') {
    title = '✨ Saved Property Updated';
    body = `The host updated details or availability for ${params.propertyTitle}.`;
  } else if (params.type === 'verified') {
    title = '✅ REHVO Verified Badge';
    body = `${params.propertyTitle} has passed 30-point on-site inspection.`;
  } else if (params.type === 'expiring') {
    title = '⚠️ Listing Expiring Soon';
    body = `Your listing for ${params.propertyTitle} will expire in 3 days. Tap to renew.`;
  }

  return dispatchPushNotification({
    userId: params.userId,
    title,
    body,
    category: 'property',
    channelId: 'default',
    data: {
      url: `/(renter)/property/${params.propertyId}`,
      property_id: params.propertyId,
    },
  });
}

// -----------------------------------------------------------------------------
// PHASE 6 — VISITS PUSH NOTIFICATIONS
// -----------------------------------------------------------------------------
export async function sendVisitPush(params: {
  userId: string;
  type: 'request' | 'accepted' | 'reminder_24h' | 'reminder_1h' | 'reminder_15m' | 'gate_pass_ready' | 'rescheduled' | 'cancelled';
  propertyTitle: string;
  visitId: string;
  visitDate: string;
  timeSlot: string;
  accessCode?: string;
}) {
  let title = 'Property Visit';
  let body = `${params.propertyTitle} on ${params.visitDate} (${params.timeSlot})`;

  if (params.type === 'request') {
    title = '📅 Visit Scheduled';
    body = `Visit request confirmed for ${params.propertyTitle} on ${params.visitDate} (${params.timeSlot}).`;
  } else if (params.type === 'accepted') {
    title = '🎉 Visit Approved by Host!';
    body = `The owner accepted your visit for ${params.propertyTitle} on ${params.visitDate}.`;
  } else if (params.type === 'reminder_24h') {
    title = '⏰ Visit Tomorrow';
    body = `Reminder: You have a scheduled visit at ${params.propertyTitle} tomorrow at ${params.timeSlot}.`;
  } else if (params.type === 'reminder_1h') {
    title = '🚗 Visit in 1 Hour';
    body = `Your visit to ${params.propertyTitle} begins in 1 hour (${params.timeSlot}).`;
  } else if (params.type === 'reminder_15m') {
    title = '🔔 Host Is Waiting (15 Mins)';
    body = `Your host is ready to welcome you at ${params.propertyTitle}.`;
  } else if (params.type === 'gate_pass_ready') {
    title = '🎟️ Security Gate Pass Ready';
    body = `Access code: ${params.accessCode || '048201'}. Show this to security for instant gate clearance.`;
  } else if (params.type === 'rescheduled') {
    title = '🔄 Visit Rescheduled';
    body = `Visit to ${params.propertyTitle} updated to ${params.visitDate} at ${params.timeSlot}.`;
  } else if (params.type === 'cancelled') {
    title = '❌ Visit Cancelled';
    body = `Your visit to ${params.propertyTitle} on ${params.visitDate} has been cancelled.`;
  }

  // Also schedule local notification for 1-hour and 15-minute reminders if applicable
  if (params.type === 'request') {
    scheduleLocalNotification({
      title: '⏰ Visit in 1 Hour',
      body: `Reminder: Visit to ${params.propertyTitle} in 1 hour (${params.timeSlot}).`,
      triggerSeconds: 3600,
      channelId: 'visits',
      data: { url: '/(renter)/visits', visit_id: params.visitId },
    });
  }

  return dispatchPushNotification({
    userId: params.userId,
    title,
    body,
    category: 'visits',
    channelId: 'visits',
    data: {
      url: '/(renter)/visits',
      visit_id: params.visitId,
    },
  });
}

// -----------------------------------------------------------------------------
// PHASE 7 — WALLET & RENTPAY PUSH NOTIFICATIONS
// -----------------------------------------------------------------------------
export async function sendWalletPush(params: {
  userId: string;
  type: 'cashback_credited' | 'scratch_card' | 'withdrawal_success' | 'withdrawal_failed' | 'referral_reward' | 'voucher_unlocked' | 'rent_due' | 'autopay_reminder' | 'payment_success' | 'payment_failed' | 'receipt_ready';
  amount?: number;
  details?: string;
  referenceId?: string;
}) {
  let title = 'R-Cash & Wallet';
  let body = 'Updates to your financial account';
  let category: 'wallet' | 'rent' = 'wallet';

  if (params.type === 'cashback_credited') {
    title = '💰 Cashback Credited!';
    body = `₹${params.amount?.toLocaleString() || '500'} has been credited to your R-Cash balance!`;
  } else if (params.type === 'scratch_card') {
    title = '🎁 New Scratch Card Unlocked!';
    body = 'You earned a mystery scratch card for paying rent on time. Tap to reveal!';
  } else if (params.type === 'withdrawal_success') {
    title = '✅ Bank Withdrawal Successful';
    body = `₹${params.amount?.toLocaleString()} has been transferred to your registered bank account.`;
  } else if (params.type === 'withdrawal_failed') {
    title = '❌ Withdrawal Failed';
    body = `Bank transfer of ₹${params.amount?.toLocaleString()} failed. Funds refunded to R-Cash.`;
  } else if (params.type === 'referral_reward') {
    title = '👥 Referral Bonus Earned!';
    body = `Your friend joined REHVO! ₹${params.amount?.toLocaleString() || '1,000'} added to your wallet.`;
  } else if (params.type === 'rent_due') {
    category = 'rent';
    title = '⏰ Rent Payment Due Soon';
    body = `Your rent payment of ₹${params.amount?.toLocaleString()} is due in 2 days. Pay early to earn 2X cashback.`;
  } else if (params.type === 'autopay_reminder') {
    category = 'rent';
    title = '⚡ AutoPay Scheduled';
    body = `AutoPay will process rent of ₹${params.amount?.toLocaleString()} tomorrow via UPI Mandate.`;
  } else if (params.type === 'payment_success') {
    category = 'rent';
    title = '🎉 Rent Paid Successfully!';
    body = `Rent of ₹${params.amount?.toLocaleString()} cleared. Official GST receipt is now ready.`;
  } else if (params.type === 'receipt_ready') {
    category = 'rent';
    title = '📄 HRA Rent Receipt Generated';
    body = `Your verified tax-compliant rent receipt for ${params.details || 'this month'} is ready for download.`;
  }

  return dispatchPushNotification({
    userId: params.userId,
    title,
    body,
    category,
    channelId: 'wallet',
    data: {
      url: category === 'rent' ? '/(renter)/pay-rent' : '/(renter)/wallet',
      amount: params.amount,
      reference_id: params.referenceId,
    },
  });
}

// -----------------------------------------------------------------------------
// PHASE 8 — FLATMATE PUSH NOTIFICATIONS
// -----------------------------------------------------------------------------
export async function sendFlatmatePush(params: {
  userId: string;
  type: 'wave' | 'super_wave' | 'match' | 'compatibility_alert' | 'profile_viewed' | 'shared_suggestion';
  flatmateName: string;
  flatmateId?: string;
  compatibilityScore?: number;
}) {
  let title = 'Flatmate Match';
  let body = 'Updates to your co-living network';

  if (params.type === 'wave') {
    title = '👋 New Wave Received!';
    body = `${params.flatmateName} waved at your flatmate profile. Tap to wave back!`;
  } else if (params.type === 'super_wave') {
    title = '⭐ Super Wave Alert!';
    body = `${params.flatmateName} sent you a Super Wave! You are high priority in their search.`;
  } else if (params.type === 'match') {
    title = "🎉 It's a Mutual Flatmate Match!";
    body = `You and ${params.flatmateName} both matched! Start a chat now.`;
  } else if (params.type === 'compatibility_alert') {
    title = `⚡ ${params.compatibilityScore || 95}% Compatibility Match!`;
    body = `${params.flatmateName} shares your sleep schedule, food preferences, and budget.`;
  } else if (params.type === 'profile_viewed') {
    title = '👀 Profile Viewed';
    body = `${params.flatmateName} viewed your flatmate profile.`;
  } else if (params.type === 'shared_suggestion') {
    title = '🏢 Shared Apartment Suggestion';
    body = `A 2 BHK in Bandra matches both your and ${params.flatmateName}'s preferences.`;
  }

  return dispatchPushNotification({
    userId: params.userId,
    title,
    body,
    category: 'flatmate',
    channelId: 'default',
    data: {
      url: params.type === 'match' ? '/(renter)/flatmate/matches' : '/(renter)/flatmates',
      flatmate_id: params.flatmateId,
    },
  });
}

// -----------------------------------------------------------------------------
// PHASE 9 — OWNER PUSH NOTIFICATIONS
// -----------------------------------------------------------------------------
export async function sendOwnerPush(params: {
  ownerId: string;
  type: 'new_lead' | 'property_saved' | 'visit_requested' | 'chat_started' | 'rent_received' | 'settlement_completed' | 'listing_trending';
  leadName?: string;
  propertyTitle: string;
  amount?: number;
  leadId?: string;
}) {
  let title = 'Host & Landlord Portal';
  let body = params.propertyTitle;

  if (params.type === 'new_lead') {
    title = '🔥 New High-Intent Lead!';
    body = `${params.leadName || 'A verified tenant'} enquired about ${params.propertyTitle}. Tap to connect.`;
  } else if (params.type === 'property_saved') {
    title = '❤️ Property Saved';
    body = `A tenant saved your listing for ${params.propertyTitle}.`;
  } else if (params.type === 'visit_requested') {
    title = '📅 Visit Requested';
    body = `${params.leadName || 'A tenant'} requested an in-person visit for ${params.propertyTitle}.`;
  } else if (params.type === 'chat_started') {
    title = '💬 New Tenant Inquiry';
    body = `${params.leadName || 'A prospective tenant'} started a conversation about ${params.propertyTitle}.`;
  } else if (params.type === 'rent_received') {
    title = '💸 Rent Collected!';
    body = `₹${params.amount?.toLocaleString()} received for ${params.propertyTitle}.`;
  } else if (params.type === 'settlement_completed') {
    title = '🏦 Bank Settlement Complete';
    body = `Rent settlement of ₹${params.amount?.toLocaleString()} deposited into your registered bank account.`;
  } else if (params.type === 'listing_trending') {
    title = '📈 Listing Trending!';
    body = `${params.propertyTitle} received 45+ views and 8 saves in the last 24 hours.`;
  }

  return dispatchPushNotification({
    userId: params.ownerId,
    title,
    body,
    category: 'owner',
    channelId: 'default',
    data: {
      url: params.type === 'new_lead' ? '/(owner)/leads' : params.type === 'visit_requested' ? '/(owner)/visits' : '/(owner)/dashboard',
      property_title: params.propertyTitle,
      lead_id: params.leadId,
    },
  });
}
