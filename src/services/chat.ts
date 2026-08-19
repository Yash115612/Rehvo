/**
 * REHVO Chat & Realtime Messaging Service
 * Centralized Supabase operations for in-app direct messaging, conversations, and realtime updates.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { createNotification } from './notifications';
import type { Conversation, Message, SupabaseConversation, SupabaseMessage } from '../types';

// ---------------------------------------------------------------------------
// Response Envelope
// ---------------------------------------------------------------------------

export interface ChatServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ---------------------------------------------------------------------------
// Error Mapping
// ---------------------------------------------------------------------------

function getUserFriendlyChatError(error: unknown, fallback: string): string {
  if (!error) return fallback;
  const msg = (error as { message?: string })?.message || String(error);

  if (msg.includes('Cannot start conversation with yourself') || msg.includes('with yourself') || msg.includes('self-chat')) {
    return 'You cannot chat with yourself.';
  }
  if (msg.includes('Not authenticated') || msg.includes('JWT') || msg.includes('session expired') || msg.includes('session')) {
    return 'Your session expired. Please log in again.';
  }
  if (msg.includes('Flatmate profile not found') || msg.includes('not found')) {
    return 'Flatmate information is unavailable.';
  }
  if (msg.includes('Recipient could not be resolved') || msg.includes('recipient')) {
    return 'Flatmate recipient could not be found.';
  }
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('ENOTFOUND')) {
    return "Couldn't connect to server. Please check your connection.";
  }
  if (msg.includes('row-level security') || msg.includes('policy') || msg.includes('42501')) {
    return 'You do not have access to this conversation.';
  }
  if (msg.includes('duplicate key') || msg.includes('uq_conversation_participant')) {
    return 'Conversation participant already registered.';
  }

  return fallback;
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

export function mapSupabaseMessageToApp(
  row: any,
  senderProfile?: any
): Message {
  const profile = senderProfile || row.sender_profile || row.profiles;

  return {
    id: row.id,
    conversation_id: row.conversation_id,
    sender_id: row.sender_id,
    sender_name: profile?.full_name || 'User',
    sender_avatar: profile?.profile_photo || undefined,
    text: row.message || '',
    message_type: row.message_type || 'text',
    created_at: row.created_at,
    is_read: !!row.read_at,
  };
}

export function mapSupabaseConversationToApp(
  row: any,
  currentUserId: string
): Conversation {
  const participants = row.conversation_participants || [];
  const myParticipant = participants.find((p: any) => p.user_id === currentUserId);
  const otherParticipant = participants.find((p: any) => p.user_id !== currentUserId) || participants[0];

  const myProfile = myParticipant?.profiles;
  const otherProfile = otherParticipant?.profiles;

  const prop = row.properties;
  const flatmate = row.flatmate_profiles;
  const flatmateName = flatmate?.profiles?.full_name || otherProfile?.full_name || 'Flatmate';

  const propImage =
    prop?.property_images?.find((img: any) => img.is_cover)?.image_url ||
    prop?.property_images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';

  const flatmateAvatar =
    flatmate?.photo ||
    otherProfile?.profile_photo ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  const mappedMessages: Message[] = (row.messages || [])
    .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((m: any) => mapSupabaseMessageToApp(m));

  return {
    id: row.id,
    property_id: prop ? prop.id : flatmate ? flatmate.id : undefined,
    property_title: prop
      ? prop.title
      : flatmate
      ? `Flatmate Connect · ${flatmateName}`
      : 'Direct Conversation',
    property_image: prop ? propImage : flatmateAvatar,
    property_locality: prop
      ? `${prop.locality}, ${prop.city || 'Mumbai'}`
      : flatmate
      ? `${flatmate.locality}, ${flatmate.city || 'Mumbai'}`
      : 'Mumbai',
    rent: prop?.price ?? prop?.rent,
    enquiry_id: row.enquiry_id || undefined,
    flatmate_profile_id: row.flatmate_profile_id || undefined,
    flatmate_name: flatmateName,
    flatmate_avatar: flatmateAvatar,
    renter_id: currentUserId,
    renter_name: myProfile?.full_name || 'You',
    renter_avatar: myProfile?.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    owner_id: otherParticipant?.user_id || '',
    owner_name: otherProfile?.full_name || (flatmate ? flatmateName : 'Property Owner'),
    owner_avatar: otherProfile?.profile_photo || (flatmate ? flatmateAvatar : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'),
    last_message: row.last_message_text || (mappedMessages.length > 0 ? mappedMessages[mappedMessages.length - 1].text : 'No messages yet'),
    updated_at: row.last_message_at || row.updated_at || row.created_at,
    unread_count: myParticipant?.unread_count || 0,
    messages: mappedMessages,
  };
}

// ---------------------------------------------------------------------------
// Conversations CRUD Operations
// ---------------------------------------------------------------------------

/** Get all conversations for the current authenticated user */
export async function getConversations(
  userId?: string
): Promise<ChatServiceResult<Conversation[]>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected', data: [] };
  }

  try {
    let currentUserId = userId;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) {
      return { success: false, error: 'User not signed in', data: [] };
    }

    // 1. Get all conversation IDs where current user is a participant
    const { data: participantRows, error: partError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', currentUserId);

    if (partError) {
      return {
        success: false,
        error: getUserFriendlyChatError(partError, "Couldn't load your conversations."),
        data: [],
      };
    }

    const conversationIds = (participantRows || []).map((p) => p.conversation_id);
    if (conversationIds.length === 0) {
      return { success: true, data: [] };
    }

    // 2. Fetch conversations with joined context & participants
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        properties (id, title, locality, city, price, property_images (*)),
        flatmate_profiles (id, user_id, photo, locality, city, budget_max, room_preference, profiles:profiles!flatmate_profiles_user_id_fkey (full_name)),
        conversation_participants (
          id,
          user_id,
          unread_count,
          last_read_at,
          profiles:profiles!conversation_participants_user_id_fkey (id, full_name, phone, profile_photo)
        ),
        messages (id, conversation_id, sender_id, message, message_type, read_at, created_at)
      `)
      .in('id', conversationIds)
      .order('last_message_at', { ascending: false });

    if (error) {
      return {
        success: false,
        error: getUserFriendlyChatError(error, "Couldn't load your conversations."),
        data: [],
      };
    }

    const conversations = (data || []).map((row) =>
      mapSupabaseConversationToApp(row, currentUserId!)
    );

    return { success: true, data: conversations };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyChatError(err, "Couldn't load your conversations."),
      data: [],
    };
  }
}

/** Get a single conversation by ID */
export async function getConversationById(
  conversationId: string,
  userId?: string
): Promise<ChatServiceResult<Conversation>> {
  if (!isSupabaseConfigured() || !conversationId) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    let currentUserId = userId;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) {
      return { success: false, error: 'User not signed in' };
    }

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        properties (id, title, locality, city, price, property_images (*)),
        flatmate_profiles (id, user_id, photo, locality, city, budget_max, room_preference, profiles:profiles!flatmate_profiles_user_id_fkey (full_name)),
        conversation_participants (
          id,
          user_id,
          unread_count,
          last_read_at,
          profiles:profiles!conversation_participants_user_id_fkey (id, full_name, phone, profile_photo)
        ),
        messages (id, conversation_id, sender_id, message, message_type, read_at, created_at)
      `)
      .eq('id', conversationId)
      .single();

    if (error || !data) {
      return {
        success: false,
        error: getUserFriendlyChatError(error, 'Conversation not found or access denied.'),
      };
    }

    // Verify user participation
    const isParticipant = (data.conversation_participants || []).some(
      (p: any) => p.user_id === currentUserId
    );
    if (!isParticipant) {
      return { success: false, error: 'You do not have access to this conversation.' };
    }

    return { success: true, data: mapSupabaseConversationToApp(data, currentUserId) };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyChatError(err, 'Conversation not found or access denied.'),
    };
  }
}

/** Get messages for a specific conversation */
export async function getMessages(
  conversationId: string
): Promise<ChatServiceResult<Message[]>> {
  if (!isSupabaseConfigured() || !conversationId) {
    return { success: false, error: 'Database not connected', data: [] };
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender_profile:profiles!messages_sender_id_fkey (id, full_name, profile_photo)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      return {
        success: false,
        error: getUserFriendlyChatError(error, "Couldn't load messages."),
        data: [],
      };
    }

    const messages = (data || []).map((row) => mapSupabaseMessageToApp(row));
    return { success: true, data: messages };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyChatError(err, "Couldn't load messages."),
      data: [],
    };
  }
}

/** Get or create conversation for a Property Listing */
export async function getOrCreatePropertyConversation(
  propertyId: string,
  enquiryId?: string
): Promise<ChatServiceResult<Conversation>> {
  if (!isSupabaseConfigured()) {
    if (__DEV__) console.warn('[REHVO CHAT DEBUG] Database not configured');
    return { success: false, error: 'Database not connected' };
  }

  try {
    if (__DEV__) {
      console.log('[REHVO CHAT DEBUG] STEP 2 resolving authenticated user');
    }
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData?.user?.id;
    if (!currentUserId) {
      if (__DEV__) console.warn('[REHVO CHAT DEBUG] STEP 2 FAILED: User session missing');
      return { success: false, error: 'Your session expired. Please log in again.' };
    }

    if (__DEV__) {
      console.log('[REHVO CHAT DEBUG] STEP 2 authenticated_user_resolved:', currentUserId);
      console.log('[REHVO CHAT DEBUG] STEP 5 & 6 calling create_or_get_conversation RPC for property:', propertyId);
    }

    // Call atomic RPC function in Supabase
    const { data: convId, error: rpcError } = await supabase.rpc(
      'create_or_get_conversation',
      {
        p_property_id: propertyId,
        p_enquiry_id: enquiryId || null,
      }
    );

    if (rpcError || !convId) {
      if (__DEV__) {
        console.warn('[REHVO CHAT DEBUG] STEP 5/6 FAILED:', {
          code: rpcError?.code,
          message: rpcError?.message,
        });
      }
      return {
        success: false,
        error: getUserFriendlyChatError(rpcError, "Couldn't initiate chat with host."),
      };
    }

    if (__DEV__) {
      console.log('[REHVO CHAT DEBUG] STEP 6 conversation_created_or_reused:', convId);
      console.log('[REHVO CHAT DEBUG] STEP 7 loading conversation details & verifying participants');
    }

    const convResult = await getConversationById(convId, currentUserId);
    if (__DEV__) {
      if (convResult.success) {
        console.log('[REHVO CHAT DEBUG] STEP 7 participants_verified for conv:', convId);
      } else {
        console.warn('[REHVO CHAT DEBUG] STEP 7 FAILED:', convResult.error);
      }
    }
    return convResult;
  } catch (err: any) {
    if (__DEV__) {
      console.warn('[REHVO CHAT DEBUG] Unexpected error:', err?.message);
    }
    return {
      success: false,
      error: getUserFriendlyChatError(err, "Couldn't initiate chat with host."),
    };
  }
}

/** Get or create conversation for a Flatmate Profile */
export async function getOrCreateFlatmateConversation(
  flatmateProfileId: string
): Promise<ChatServiceResult<Conversation>> {
  if (!isSupabaseConfigured()) {
    if (__DEV__) console.warn('[REHVO FLATMATE CHAT DEBUG] Database not configured');
    return { success: false, error: 'Database not connected' };
  }

  try {
    if (__DEV__) {
      console.log('[REHVO FLATMATE CHAT DEBUG] STEP 2 authenticated_user lookup');
    }
    const { data: authData, error: authError } = await supabase.auth.getUser();
    const currentUserId = authData?.user?.id;
    if (!currentUserId || authError) {
      if (__DEV__) console.warn('[REHVO FLATMATE CHAT DEBUG] STEP 2 FAILED: User session missing');
      return { success: false, error: 'Your session expired. Please log in again.' };
    }

    if (__DEV__) {
      console.log('[REHVO FLATMATE CHAT DEBUG] STEP 2 authenticated_user_resolved:', currentUserId);
      console.log('[REHVO FLATMATE CHAT DEBUG] STEP 3 flatmate_loaded');
    }

    // Step 3 & 4: Resolve flatmate profile and verify user_id
    const { data: flatmateProfile, error: fpError } = await supabase
      .from('flatmate_profiles')
      .select('id, user_id, status')
      .eq('id', flatmateProfileId)
      .maybeSingle();

    if (fpError || !flatmateProfile || !flatmateProfile.user_id) {
      if (__DEV__) {
        console.warn('[REHVO FLATMATE CHAT DEBUG] STEP 3/4 FAILED:', fpError?.message || 'Profile not found');
      }
      return { success: false, error: 'Flatmate information is unavailable.' };
    }

    if (__DEV__) {
      console.log('[REHVO FLATMATE CHAT DEBUG] STEP 4 recipient_resolved:', flatmateProfile.user_id);
    }

    // Step 5: Self-chat prevention
    if (currentUserId === flatmateProfile.user_id) {
      if (__DEV__) {
        console.warn('[REHVO FLATMATE CHAT DEBUG] STEP 5 BLOCKED: User attempting self-chat');
      }
      return { success: false, error: 'You cannot chat with yourself.' };
    }

    if (__DEV__) {
      console.log('[REHVO FLATMATE CHAT DEBUG] STEP 5 existing_conversation_lookup via RPC');
    }

    // Step 6: Call unified atomic RPC function in Supabase
    const { data: convId, error: rpcError } = await supabase.rpc(
      'create_or_get_conversation',
      {
        p_property_id: null,
        p_flatmate_profile_id: flatmateProfileId,
        p_enquiry_id: null,
        p_recipient_id: null,
      }
    );

    let finalConvId = convId;

    // Resilient fallback if RPC fails
    if (rpcError || !finalConvId) {
      if (__DEV__) {
        console.warn('[REHVO FLATMATE CHAT DEBUG] RPC error, trying direct lookup:', rpcError?.message);
      }

      // Check if conversation already exists between these 2 users for this flatmate profile
      const { data: existingConvs } = await supabase
        .from('conversations')
        .select(`
          id,
          conversation_participants!inner (user_id)
        `)
        .eq('flatmate_profile_id', flatmateProfileId)
        .limit(10);

      const existingMatch = existingConvs?.find((c) => {
        const pUserIds = c.conversation_participants?.map((p: any) => p.user_id) || [];
        return pUserIds.includes(currentUserId) && pUserIds.includes(flatmateProfile.user_id);
      });

      if (existingMatch) {
        finalConvId = existingMatch.id;
      } else {
        const { data: newConv, error: newConvErr } = await supabase
          .from('conversations')
          .insert({
            flatmate_profile_id: flatmateProfileId,
            last_message_text: 'Started conversation',
            last_message_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (newConvErr || !newConv) {
          return {
            success: false,
            error: getUserFriendlyChatError(newConvErr || rpcError, "Couldn't initiate chat with flatmate."),
          };
        }

        finalConvId = newConv.id;

        await supabase.from('conversation_participants').insert([
          { conversation_id: finalConvId, user_id: currentUserId, unread_count: 0 },
          { conversation_id: finalConvId, user_id: flatmateProfile.user_id, unread_count: 0 },
        ]);
      }
    }

    if (!finalConvId) {
      return { success: false, error: "Couldn't initiate chat with flatmate." };
    }

    if (__DEV__) {
      console.log('[REHVO FLATMATE CHAT DEBUG] STEP 6 conversation_created_or_reused:', finalConvId);
      console.log('[REHVO FLATMATE CHAT DEBUG] STEP 7 participants_verified for conv:', finalConvId);
      console.log('[REHVO FLATMATE CHAT DEBUG] STEP 8 conversation_id_received:', finalConvId);
    }

    const convResult = await getConversationById(finalConvId, currentUserId);
    return convResult;
  } catch (err: any) {
    if (__DEV__) {
      console.warn('[REHVO FLATMATE CHAT DEBUG] Unexpected error:', err?.message);
    }
    return {
      success: false,
      error: getUserFriendlyChatError(err, "Couldn't initiate chat with flatmate."),
    };
  }
}

/** Send a message in a conversation */
export async function sendMessage(
  conversationId: string,
  text: string,
  messageType: 'text' | 'image' | 'system' | 'visit_request' = 'text'
): Promise<ChatServiceResult<Message>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData?.user?.id;
    if (!currentUserId) {
      return { success: false, error: 'You must be signed in to send messages.' };
    }

    if (!text || !text.trim()) {
      return { success: false, error: 'Message cannot be empty.' };
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        message: text.trim(),
        message_type: messageType,
      })
      .select(`
        *,
        sender_profile:profiles!messages_sender_id_fkey (id, full_name, profile_photo)
      `)
      .single();

    if (error) {
      return {
        success: false,
        error: getUserFriendlyChatError(error, "Couldn't send this message."),
      };
    }

    const appMessage = mapSupabaseMessageToApp(data);

    // Asynchronously notify conversation recipient(s)
    (async () => {
      try {
        const { data: parts } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', conversationId);

        const recipientIds = (parts || [])
          .map((p: any) => p.user_id)
          .filter((uid: string) => uid !== currentUserId);

        const senderName = data.sender_profile?.full_name || 'Someone';
        for (const rId of recipientIds) {
          await createNotification({
            userId: rId,
            type: 'message',
            title: `New message from ${senderName}`,
            body: text.trim().length > 80 ? `${text.trim().slice(0, 77)}...` : text.trim(),
            data: { conversation_id: conversationId },
          });
        }
      } catch (_) {
        // Non-blocking notification dispatch
      }
    })();

    return { success: true, data: appMessage };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyChatError(err, "Couldn't send this message."),
    };
  }
}

/** Mark conversation as read for the current user */
export async function markConversationAsRead(
  conversationId: string,
  userId?: string
): Promise<ChatServiceResult<void>> {
  if (!isSupabaseConfigured() || !conversationId) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    let currentUserId = userId;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) return { success: true };

    const { error } = await supabase
      .from('conversation_participants')
      .update({
        unread_count: 0,
        last_read_at: new Date().toISOString(),
      })
      .eq('conversation_id', conversationId)
      .eq('user_id', currentUserId);

    if (error) {
      return {
        success: false,
        error: getUserFriendlyChatError(error, "Couldn't update read status."),
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyChatError(err, "Couldn't update read status."),
    };
  }
}

// ---------------------------------------------------------------------------
// Supabase Realtime Subscriptions
// ---------------------------------------------------------------------------

/** Subscribe to new messages for a specific conversation */
export function subscribeToMessages(
  conversationId: string,
  onNewMessage: (msg: Message) => void
): { unsubscribe: () => void } {
  if (!isSupabaseConfigured() || !conversationId) {
    return { unsubscribe: () => {} };
  }

  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        if (payload.new) {
          const mapped = mapSupabaseMessageToApp(payload.new);
          onNewMessage(mapped);
        }
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}

/** Subscribe to conversation participant updates for unread counts / list changes */
export function subscribeToConversations(
  userId: string,
  onUpdate: () => void
): { unsubscribe: () => void } {
  if (!isSupabaseConfigured() || !userId) {
    return { unsubscribe: () => {} };
  }

  const channel = supabase
    .channel(`user_conversations:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversation_participants',
        filter: `user_id=eq.${userId}`,
      },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}
