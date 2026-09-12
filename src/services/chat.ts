/**
 * REHVO Chat & Realtime Messaging Service
 * Centralized Supabase operations for in-app direct messaging, conversations, and realtime updates.
 * Supports complete Owner <-> Renter Chat Ecosystem with rich message cards, typing, reactions, and offline caching.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { createNotification } from './notifications';
import { uploadFile } from './storage';
import type {
  Conversation,
  ConversationType,
  Message,
  ChatMessageType,
  PropertyMessageMeta,
  VisitMessageMeta,
  AgreementMessageMeta,
  RentReminderMeta,
  MessageReactionMap,
} from '../types';

// ---------------------------------------------------------------------------
// Storage Keys for Offline Fallbacks
// ---------------------------------------------------------------------------
const STORAGE_KEYS = {
  CONVERSATIONS: '@rehvo_chat_conversations_v46',
  MESSAGES_PREFIX: '@rehvo_chat_messages_v46_',
};

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
    return 'Recipient could not be found.';
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

  const reactions: MessageReactionMap = {};
  if (Array.isArray(row.message_reactions)) {
    for (const r of row.message_reactions) {
      if (!reactions[r.reaction]) {
        reactions[r.reaction] = [];
      }
      reactions[r.reaction].push(r.user_id);
    }
  } else if (row.reactions && typeof row.reactions === 'object') {
    Object.assign(reactions, row.reactions);
  }

  const isRead = Boolean(row.read_at || row.seen_at);
  const status: 'sending' | 'sent' | 'delivered' | 'read' = isRead
    ? 'read'
    : row.delivered_at
    ? 'delivered'
    : 'sent';

  const isDeleted = Boolean(row.is_deleted || row.metadata?.is_deleted || row.deleted_for_everyone);
  const isEdited = Boolean(row.is_edited || row.metadata?.is_edited);
  const isStarred = Boolean(row.is_starred || (Array.isArray(row.message_starred) && row.message_starred.length > 0));

  return {
    id: row.id,
    conversation_id: row.conversation_id,
    sender_id: row.sender_id,
    sender_name: profile?.full_name || row.sender_name || 'User',
    sender_avatar: profile?.profile_photo || row.sender_avatar || undefined,
    text: isDeleted ? '🚫 This message was deleted' : (row.message || row.text || ''),
    message_type: (row.message_type as ChatMessageType) || 'text',
    image_url: isDeleted ? undefined : (row.image_url || undefined),
    video_url: isDeleted ? undefined : (row.video_url || undefined),
    audio_url: isDeleted ? undefined : (row.audio_url || undefined),
    document_url: isDeleted ? undefined : (row.document_url || undefined),
    document_name: isDeleted ? undefined : (row.document_name || row.metadata?.document_name || undefined),
    location: isDeleted ? undefined : (row.location || undefined),
    metadata: row.metadata || {},
    reply_to: row.reply_to || undefined,
    reply_to_id: row.reply_to_id || undefined,
    reactions,
    is_starred: isStarred,
    is_edited: isEdited,
    edited_at: row.edited_at || row.metadata?.edited_at || undefined,
    is_deleted: isDeleted,
    deleted_for: row.deleted_for || [],
    deleted_for_sender: Boolean(row.deleted_for_sender),
    deleted_for_everyone: Boolean(row.deleted_for_everyone),
    seen_at: row.seen_at || undefined,
    delivered_at: row.delivered_at || undefined,
    status,
    created_at: row.created_at || new Date().toISOString(),
    is_read: isRead,
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

  const isProp = Boolean(prop);
  const isFm = Boolean(flatmate || row.flatmate_profile_id);
  const convType = row.type || (isProp ? 'property' : isFm ? 'flatmate' : 'owner');

  const otherRole = otherParticipant?.role || (isProp ? 'OWNER' : isFm ? 'FLATMATE' : 'USER');

  return {
    id: row.id,
    type: convType,
    property_id: prop ? prop.id : row.property_id || undefined,
    property_title: prop
      ? prop.title
      : row.property_title ||
        (flatmate ? `Flatmate Match · ${flatmateName}` : 'Direct Conversation'),
    property_image: prop ? propImage : row.property_image || flatmateAvatar,
    property_locality: prop
      ? `${prop.locality}, ${prop.city || 'Mumbai'}`
      : row.property_locality ||
        (flatmate ? `${flatmate.locality}, ${flatmate.city || 'Mumbai'}` : 'Mumbai'),
    property_rent: prop?.price ?? prop?.rent ?? row.property_rent,
    rent: prop?.price ?? prop?.rent ?? row.property_rent,
    enquiry_id: row.enquiry_id || undefined,
    flatmate_profile_id: row.flatmate_profile_id || flatmate?.id || undefined,
    flatmate_name: flatmateName,
    flatmate_avatar: flatmateAvatar,
    flatmate_locality: flatmate?.locality || 'Mumbai',
    flatmate_budget: flatmate?.budget_max,
    match_score: 96,
    other_user_id: otherParticipant?.user_id || row.owner_id || '',
    other_user_name: isFm ? flatmateName : (otherProfile?.full_name || row.owner_name || prop?.title || 'Property Host'),
    other_user_avatar: isFm ? flatmateAvatar : (otherProfile?.profile_photo || row.owner_avatar || propImage),
    other_user_role: otherRole,
    is_verified: true,
    is_pinned: Boolean(myParticipant?.is_pinned ?? row.is_pinned),
    is_archived: Boolean(myParticipant?.is_archived ?? row.is_archived),
    is_muted: Boolean(myParticipant?.is_muted),
    is_online: true,
    last_seen: 'Active now',
    is_typing: false,
    metadata: row.metadata || {},
    last_message_at: row.last_message_at || row.updated_at || row.created_at,
    renter_id: row.tenant_id || currentUserId,
    renter_name: myProfile?.full_name || 'You',
    renter_avatar: myProfile?.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    owner_id: row.owner_id || otherParticipant?.user_id || '',
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
  // 1. Check local cache first for fast display
  let cached: Conversation[] = [];
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (raw) cached = JSON.parse(raw);
  } catch {}

  if (!isSupabaseConfigured()) {
    return { success: true, data: cached };
  }

  try {
    let currentUserId = userId;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) {
      return { success: true, data: cached };
    }

    // 1. Get all conversation IDs where current user is a participant
    const { data: participantRows, error: partError } = await supabase
      .from('conversation_participants')
      .select('conversation_id, is_pinned, is_archived, is_muted, unread_count')
      .eq('user_id', currentUserId);

    if (partError) {
      return {
        success: cached.length > 0,
        data: cached,
        error: getUserFriendlyChatError(partError, "Couldn't load your conversations."),
      };
    }

    const conversationIds = (participantRows || []).map((p) => p.conversation_id);
    if (conversationIds.length === 0) {
      return { success: true, data: cached };
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
          is_pinned,
          is_archived,
          is_muted,
          profiles:profiles!conversation_participants_user_id_fkey (id, full_name, phone, profile_photo)
        ),
        messages (
          id,
          conversation_id,
          sender_id,
          message,
          message_type,
          image_url,
          document_url,
          metadata,
          reply_to_id,
          read_at,
          seen_at,
          delivered_at,
          created_at
        )
      `)
      .in('id', conversationIds)
      .order('last_message_at', { ascending: false });

    if (error) {
      return {
        success: cached.length > 0,
        data: cached,
        error: getUserFriendlyChatError(error, "Couldn't load your conversations."),
      };
    }

    const conversations = (data || []).map((row) =>
      mapSupabaseConversationToApp(row, currentUserId!)
    );

    // Merge with any cached conversations not yet present in supabase
    const remoteIds = new Set(conversations.map((c) => c.id));
    const merged = [...conversations, ...cached.filter((c) => !remoteIds.has(c.id))];

    // Persist to offline cache
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(merged));
    } catch {}

    return { success: true, data: merged };
  } catch (err) {
    return {
      success: cached.length > 0,
      data: cached,
      error: getUserFriendlyChatError(err, "Couldn't load your conversations."),
    };
  }
}

/** Get a single conversation by ID */
export async function getConversationById(
  conversationId: string,
  userId?: string
): Promise<ChatServiceResult<Conversation>> {
  // Check local cache first
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (raw) {
      const list: Conversation[] = JSON.parse(raw);
      const found = list.find((c) => c.id === conversationId);
      if (found && !isSupabaseConfigured()) {
        return { success: true, data: found };
      }
    }
  } catch {}

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
          is_pinned,
          is_archived,
          is_muted,
          profiles:profiles!conversation_participants_user_id_fkey (id, full_name, phone, profile_photo)
        ),
        messages (
          id,
          conversation_id,
          sender_id,
          message,
          message_type,
          image_url,
          document_url,
          metadata,
          reply_to_id,
          read_at,
          seen_at,
          delivered_at,
          created_at
        )
      `)
      .eq('id', conversationId)
      .single();

    if (error || !data) {
      return {
        success: false,
        error: getUserFriendlyChatError(error, 'Conversation not found or access denied.'),
      };
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
  // Check local cache first
  let cached: Message[] = [];
  try {
    const raw = await AsyncStorage.getItem(`${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`);
    if (raw) cached = JSON.parse(raw);
  } catch {}

  if (!isSupabaseConfigured() || !conversationId) {
    return { success: true, data: cached };
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender_profile:profiles!messages_sender_id_fkey (id, full_name, profile_photo),
        message_reactions (id, reaction, user_id)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      return {
        success: cached.length > 0,
        data: cached,
        error: getUserFriendlyChatError(error, "Couldn't load messages."),
      };
    }

    const messages = (data || []).map((row) => mapSupabaseMessageToApp(row));

    // Cache locally
    try {
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`,
        JSON.stringify(messages)
      );
    } catch {}

    return { success: true, data: messages };
  } catch (err) {
    return {
      success: cached.length > 0,
      data: cached,
      error: getUserFriendlyChatError(err, "Couldn't load messages."),
    };
  }
}

/** Upload image, document, or audio attachment to Supabase Storage 'chat-media' bucket */
export async function uploadChatAttachment(
  fileUri: string,
  fileName?: string,
  contentType?: string,
  conversationId?: string
): Promise<ChatServiceResult<string>> {
  try {
    const res = await uploadFile('chat-media', fileUri, {
      folder: conversationId || 'media',
      customFileName: fileName,
      contentType,
    });
    if (res.success && res.publicUrl) {
      return { success: true, data: res.publicUrl };
    }
    return { success: false, error: res.error || 'Failed to upload chat attachment' };
  } catch (err) {
    return { success: false, error: getUserFriendlyChatError(err, 'Failed to upload attachment') };
  }
}

/** Send a rich message (Text, Property Card, Visit, Agreement, Rent, Media) */
export async function sendRichMessage(
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
): Promise<ChatServiceResult<Message>> {
  const {
    text = '',
    messageType = 'text',
    imageUrl,
    videoUrl,
    audioUrl,
    documentUrl,
    documentName,
    location,
    metadata = {},
    replyToId,
  } = params;

  const defaultText =
    messageType === 'location'
      ? (location?.name ? `📍 ${location.name}` : '📍 Shared Location')
      : messageType === 'audio' || messageType === 'voice_note'
      ? '🎙️ Voice Note'
      : messageType === 'video'
      ? '🎥 Video'
      : messageType === 'payment_request'
      ? `💰 Payment Request: ₹${metadata?.payment_request?.amount || metadata?.amount || ''}`
      : (messageType !== 'text' ? `[${messageType.toUpperCase()}]` : '');

  const effectiveText = text.trim() || defaultText;

  if (
    !effectiveText &&
    !imageUrl &&
    !videoUrl &&
    !audioUrl &&
    !documentUrl &&
    !location &&
    !metadata?.property &&
    !metadata?.visit &&
    !metadata?.agreement &&
    !metadata?.rent_reminder &&
    !metadata?.payment_request
  ) {
    return { success: false, error: 'Message cannot be empty.' };
  }

  if (!isSupabaseConfigured()) {
    // Generate optimistic local message
    const localMsg: Message = {
      id: `local_msg_${Date.now()}`,
      conversation_id: conversationId,
      sender_id: 'me',
      sender_name: 'You',
      text: effectiveText,
      message_type: messageType,
      image_url: imageUrl,
      video_url: videoUrl,
      audio_url: audioUrl,
      document_url: documentUrl,
      document_name: documentName,
      location,
      metadata,
      reply_to_id: replyToId,
      status: 'sent',
      created_at: new Date().toISOString(),
      is_read: true,
    };
    return { success: true, data: localMsg };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData?.user?.id;
    if (!currentUserId) {
      return { success: false, error: 'You must be signed in to send messages.' };
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        message: effectiveText,
        message_type: messageType,
        image_url: imageUrl || null,
        video_url: videoUrl || null,
        audio_url: audioUrl || null,
        document_url: documentUrl || null,
        location: location || null,
        metadata: { ...metadata, document_name: documentName },
        reply_to_id: replyToId || null,
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
        const notifBody =
          messageType === 'property'
            ? `Shared property: ${metadata?.property?.title || 'Listing'}`
            : messageType === 'visit'
            ? `Site visit requested for ${metadata?.visit?.date || 'soon'}`
            : messageType === 'agreement'
            ? `Rental agreement sent for review`
            : messageType === 'rent_reminder'
            ? `Rent reminder: ₹${metadata?.rent_reminder?.amount || 0}`
            : messageType === 'location'
            ? `Shared location: ${location?.name || 'Live Location'}`
            : messageType === 'audio'
            ? `Sent a voice note 🎙️`
            : effectiveText.length > 80
            ? `${effectiveText.slice(0, 77)}...`
            : effectiveText;

        for (const rId of recipientIds) {
          await createNotification({
            userId: rId,
            type: 'message',
            title: `New message from ${senderName}`,
            body: notifBody,
            data: { conversation_id: conversationId },
          });
        }
      } catch (_) {}
    })();

    return { success: true, data: appMessage };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyChatError(err, "Couldn't send this message."),
    };
  }
}

/** Standard send text message */
export async function sendMessage(
  conversationId: string,
  text: string,
  messageType: ChatMessageType = 'text'
): Promise<ChatServiceResult<Message>> {
  return sendRichMessage(conversationId, { text, messageType });
}

/** Toggle emoji reaction on a message */
export async function toggleMessageReaction(
  messageId: string,
  reaction: string
): Promise<ChatServiceResult<boolean>> {
  if (!isSupabaseConfigured() || !messageId) {
    return { success: true, data: true };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) return { success: false, error: 'Sign in required' };

    // Check if user already added this reaction
    const { data: existing } = await supabase
      .from('message_reactions')
      .select('id')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .eq('reaction', reaction)
      .maybeSingle();

    if (existing) {
      await supabase.from('message_reactions').delete().eq('id', existing.id);
      return { success: true, data: false }; // removed
    } else {
      await supabase.from('message_reactions').insert({
        message_id: messageId,
        user_id: userId,
        reaction,
      });
      return { success: true, data: true }; // added
    }
  } catch (err) {
    return { success: false, error: getUserFriendlyChatError(err, 'Failed to update reaction') };
  }
}

/** Set typing status via Supabase Realtime broadcast with database fallback */
export async function setTypingStatus(
  conversationId: string,
  isTyping: boolean,
  userId?: string
): Promise<void> {
  if (!isSupabaseConfigured() || !conversationId) return;

  try {
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      const { data: authData } = await supabase.auth.getUser();
      effectiveUserId = authData?.user?.id;
    }
    if (!effectiveUserId) return;

    // 1. Broadcast via Realtime channel (Instant sub-10ms response)
    const topic = `typing:${conversationId}`;
    const channel = supabase.channel(topic);
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: effectiveUserId, isTyping },
    }).catch(() => {});

    // 2. Database record fallback
    supabase
      .from('chat_typing_status')
      .upsert(
        {
          conversation_id: conversationId,
          user_id: effectiveUserId,
          is_typing: isTyping,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'conversation_id,user_id' }
      )
      .then(
        () => {},
        () => {}
      );
  } catch (_) {}
}


/** Subscribe to typing changes for a conversation via Realtime broadcast */
export function subscribeToTyping(
  conversationId: string,
  onTypingChange: (typingUsers: { userId: string; isTyping: boolean }[]) => void
): { unsubscribe: () => void } {
  if (!isSupabaseConfigured() || !conversationId) {
    return { unsubscribe: () => {} };
  }

  const topic = `typing:${conversationId}`;
  const channel = supabase.channel(topic);

  // Broadcast event listener (instantaneous)
  channel.on('broadcast', { event: 'typing' }, (event) => {
    if (event.payload && event.payload.userId) {
      onTypingChange([{ userId: event.payload.userId, isTyping: Boolean(event.payload.isTyping) }]);
    }
  });

  // Postgres changes listener (fallback)
  channel.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'chat_typing_status',
      filter: `conversation_id=eq.${conversationId}`,
    },
    (payload) => {
      if (payload.new) {
        onTypingChange([{ userId: (payload.new as any).user_id, isTyping: (payload.new as any).is_typing }]);
      }
    }
  );

  channel.subscribe();

  return {
    unsubscribe: () => {
      try {
        supabase.removeChannel(channel);
      } catch (_) {}
    },
  };
}


/** Pin or unpin conversation */
export async function togglePinConversation(
  conversationId: string,
  isPinned: boolean
): Promise<ChatServiceResult<void>> {
  if (!isSupabaseConfigured() || !conversationId) return { success: true };

  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) return { success: true };

    await supabase
      .from('conversation_participants')
      .update({ is_pinned: isPinned })
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);

    return { success: true };
  } catch (err) {
    return { success: false, error: getUserFriendlyChatError(err, 'Could not pin conversation') };
  }
}

/** Archive or unarchive conversation */
export async function toggleArchiveConversation(
  conversationId: string,
  isArchived: boolean
): Promise<ChatServiceResult<void>> {
  if (!isSupabaseConfigured() || !conversationId) return { success: true };

  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) return { success: true };

    await supabase
      .from('conversation_participants')
      .update({ is_archived: isArchived })
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);

    return { success: true };
  } catch (err) {
    return { success: false, error: getUserFriendlyChatError(err, 'Could not archive conversation') };
  }
}

/** Delete conversation from user's view (and purge participant entry) */
export async function deleteConversation(
  conversationId: string,
  userId?: string
): Promise<ChatServiceResult<void>> {
  // Remove from local cache immediately
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (raw) {
      const list: Conversation[] = JSON.parse(raw);
      const filtered = list.filter((c) => c.id !== conversationId);
      await AsyncStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(filtered));
    }
    await AsyncStorage.removeItem(`${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`);
  } catch {}

  if (!isSupabaseConfigured() || !conversationId) {
    return { success: true };
  }

  try {
    let currentUserId = userId;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) return { success: true };

    // Delete participant row for this user
    await supabase
      .from('conversation_participants')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('user_id', currentUserId);

    return { success: true };
  } catch (err) {
    return { success: false, error: getUserFriendlyChatError(err, 'Could not delete conversation') };
  }
}

/** Edit a specific text message by ID */
export async function editMessage(
  messageId: string,
  conversationId: string,
  newText: string
): Promise<ChatServiceResult<Message>> {
  const editedAt = new Date().toISOString();

  // 1. Update local cache
  try {
    const raw = await AsyncStorage.getItem(`${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`);
    if (raw) {
      const msgs: Message[] = JSON.parse(raw);
      const updated = msgs.map((m) =>
        m.id === messageId
          ? {
              ...m,
              text: newText,
              is_edited: true,
              edited_at: editedAt,
              metadata: { ...(m.metadata || {}), is_edited: true, edited_at: editedAt },
            }
          : m
      );
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`,
        JSON.stringify(updated)
      );
    }
  } catch {}

  if (!isSupabaseConfigured() || !messageId) {
    return {
      success: true,
      data: {
        id: messageId,
        conversation_id: conversationId,
        sender_id: 'me',
        text: newText,
        is_edited: true,
        edited_at: editedAt,
        created_at: editedAt,
        is_read: true,
      },
    };
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .update({
        message: newText,
        is_edited: true,
        edited_at: editedAt,
      })
      .eq('id', messageId)
      .select()
      .single();

    if (error) {
      // Fallback update if is_edited column isn't ready
      const { data: fbData, error: fbError } = await supabase
        .from('messages')
        .update({ message: newText })
        .eq('id', messageId)
        .select()
        .single();
      if (fbError) {
        return { success: false, error: getUserFriendlyChatError(fbError, 'Could not edit message') };
      }
      return { success: true, data: mapSupabaseMessageToApp(fbData) };
    }

    return { success: true, data: mapSupabaseMessageToApp(data) };
  } catch (err) {
    return { success: false, error: getUserFriendlyChatError(err, 'Could not edit message') };
  }
}

/** Delete message for everyone (replaces content with tombstone) */
export async function deleteMessageForEveryone(
  messageId: string,
  conversationId: string
): Promise<ChatServiceResult<void>> {
  // 1. Update local cache with tombstone
  try {
    const raw = await AsyncStorage.getItem(`${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`);
    if (raw) {
      const msgs: Message[] = JSON.parse(raw);
      const updated = msgs.map((m) =>
        m.id === messageId
          ? {
              ...m,
              text: '🚫 This message was deleted',
              is_deleted: true,
              metadata: { ...(m.metadata || {}), is_deleted: true },
            }
          : m
      );
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`,
        JSON.stringify(updated)
      );
    }
  } catch {}

  if (!isSupabaseConfigured() || !messageId) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('messages')
      .update({
        message: '🚫 This message was deleted',
        is_deleted: true,
      })
      .eq('id', messageId);

    if (error) {
      // Fallback
      await supabase
        .from('messages')
        .update({ message: '🚫 This message was deleted' })
        .eq('id', messageId);
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: getUserFriendlyChatError(err, 'Could not delete message') };
  }
}

/** Delete a specific message by ID (Delete for Me) */
export async function deleteMessage(
  messageId: string,
  conversationId: string
): Promise<ChatServiceResult<void>> {
  // Update local cache
  try {
    const raw = await AsyncStorage.getItem(`${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`);
    if (raw) {
      const msgs: Message[] = JSON.parse(raw);
      const filtered = msgs.filter((m) => m.id !== messageId);
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`,
        JSON.stringify(filtered)
      );
    }
  } catch {}

  if (!isSupabaseConfigured() || !messageId) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      return { success: false, error: getUserFriendlyChatError(error, 'Could not delete message') };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: getUserFriendlyChatError(err, 'Could not delete message') };
  }
}

/** Mark conversation as read */
export async function markConversationAsRead(
  conversationId: string,
  userId?: string
): Promise<ChatServiceResult<void>> {
  if (!isSupabaseConfigured() || !conversationId) {
    return { success: true };
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

    // Also mark messages as seen
    await supabase
      .from('messages')
      .update({ seen_at: new Date().toISOString(), read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', currentUserId)
      .is('seen_at', null);

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

/** Get or create conversation for a Lead */
export async function getOrCreateLeadConversation(
  leadId: string,
  propertyId?: string,
  tenantId?: string,
  ownerId?: string
): Promise<ChatServiceResult<Conversation>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData?.user?.id;
    if (!currentUserId) {
      return { success: false, error: 'Your session expired. Please log in again.' };
    }

    const { data: convId, error } = await supabase.rpc('create_or_get_lead_conversation', {
      p_lead_id: leadId,
      p_property_id: propertyId || null,
      p_tenant_id: tenantId || null,
      p_owner_id: ownerId || null,
    });

    if (error || !convId) {
      return {
        success: false,
        error: getUserFriendlyChatError(error, "Couldn't start conversation for this lead."),
      };
    }

    return getConversationById(convId, currentUserId);
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyChatError(err, "Couldn't start conversation for this lead."),
    };
  }
}

/** Get or create conversation for a Property Listing */
export async function getOrCreatePropertyConversation(
  propertyId: string,
  enquiryId?: string
): Promise<ChatServiceResult<Conversation>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData?.user?.id;
    if (!currentUserId) {
      return { success: false, error: 'Your session expired. Please log in again.' };
    }

    const { data: convId, error: rpcError } = await supabase.rpc(
      'create_or_get_conversation',
      {
        p_property_id: propertyId,
        p_enquiry_id: enquiryId || null,
      }
    );

    if (rpcError || !convId) {
      return {
        success: false,
        error: getUserFriendlyChatError(rpcError, "Couldn't initiate chat with host."),
      };
    }

    return getConversationById(convId, currentUserId);
  } catch (err: any) {
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
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData?.user?.id;
    if (!currentUserId) {
      return { success: false, error: 'Your session expired. Please log in again.' };
    }

    const { data: convId, error: rpcError } = await supabase.rpc(
      'create_or_get_conversation',
      {
        p_property_id: null,
        p_flatmate_profile_id: flatmateProfileId,
        p_enquiry_id: null,
        p_recipient_id: null,
      }
    );

    if (rpcError || !convId) {
      return {
        success: false,
        error: getUserFriendlyChatError(rpcError, "Couldn't initiate chat with flatmate."),
      };
    }

    return getConversationById(convId, currentUserId);
  } catch (err: any) {
    return {
      success: false,
      error: getUserFriendlyChatError(err, "Couldn't initiate chat with flatmate."),
    };
  }
}

// ---------------------------------------------------------------------------
// Realtime Subscriptions
// ---------------------------------------------------------------------------

/** Subscribe to new messages for a specific conversation */
export function subscribeToMessages(
  conversationId: string,
  onNewMessage: (msg: Message) => void,
  onUpdateMessage?: (msg: Message) => void,
  onDeleteMessage?: (msgId: string) => void
): { unsubscribe: () => void } {
  if (!isSupabaseConfigured() || !conversationId) {
    return { unsubscribe: () => {} };
  }

  const topic = `messages:${conversationId}`;

  try {
    const existingChannels = supabase.getChannels();
    for (const ch of existingChannels) {
      if (ch.topic === topic || ch.topic === `realtime:${topic}`) {
        supabase.removeChannel(ch);
      }
    }
  } catch (_) {}

  const channel = supabase.channel(topic);

  channel.on(
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
  );

  channel.on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`,
    },
    (payload) => {
      if (payload.new && onUpdateMessage) {
        const mapped = mapSupabaseMessageToApp(payload.new);
        onUpdateMessage(mapped);
      }
    }
  );

  channel.on(
    'postgres_changes',
    {
      event: 'DELETE',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`,
    },
    (payload) => {
      if (payload.old && payload.old.id && onDeleteMessage) {
        onDeleteMessage(payload.old.id);
      }
    }
  );

  channel.subscribe();

  return {
    unsubscribe: () => {
      try {
        supabase.removeChannel(channel);
      } catch {}
    },
  };
}

/** Subscribe to conversation list updates for unread counts */
export function subscribeToConversations(
  userId: string,
  onUpdate: () => void
): { unsubscribe: () => void } {
  if (!isSupabaseConfigured() || !userId) {
    return { unsubscribe: () => {} };
  }

  const topic = `user_conversations:${userId}`;

  try {
    const existingChannels = supabase.getChannels();
    for (const ch of existingChannels) {
      if (ch.topic === topic || ch.topic === `realtime:${topic}`) {
        supabase.removeChannel(ch);
      }
    }
  } catch (_) {}

  const channel = supabase.channel(topic);

  channel.on(
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
  );

  channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
    },
    () => {
      onUpdate();
    }
  );

  channel.subscribe();

  return {
    unsubscribe: () => {
      try {
        supabase.removeChannel(channel);
      } catch {}
    },
  };
}

/** Subscribe to realtime presence (online/offline tracking) on a channel */
export function subscribeToPresence(
  channelKey: string,
  currentUser: { id: string; name: string; avatar?: string },
  onPresenceChange: (onlineUserIds: string[]) => void
): { unsubscribe: () => void } {
  if (!isSupabaseConfigured() || !channelKey || !currentUser.id) {
    return { unsubscribe: () => {} };
  }

  const topic = `presence:${channelKey}`;
  const channel = supabase.channel(topic, {
    config: {
      presence: {
        key: currentUser.id,
      },
    },
  });

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const onlineIds = Object.keys(state);
      onPresenceChange(onlineIds);
    })
    .on('presence', { event: 'join' }, () => {
      const state = channel.presenceState();
      onPresenceChange(Object.keys(state));
    })
    .on('presence', { event: 'leave' }, () => {
      const state = channel.presenceState();
      onPresenceChange(Object.keys(state));
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        try {
          await channel.track({
            user_id: currentUser.id,
            user_name: currentUser.name,
            online_at: new Date().toISOString(),
          });
        } catch (_) {}
      }
    });

  return {
    unsubscribe: () => {
      try {
        channel.untrack().catch?.(() => {});
        supabase.removeChannel(channel);
      } catch {}
    },
  };
}

/** Fetch or create dedicated 24x7 REHVO Priority Support Concierge conversation */
export async function getOrCreateSupportConversation(
  userId?: string,
  userName?: string
): Promise<ChatServiceResult<Conversation>> {
  let currentUserId = userId;
  if (!currentUserId && isSupabaseConfigured()) {
    const { data: authData } = await supabase.auth.getUser();
    currentUserId = authData?.user?.id;
  }
  const effectiveUserId = currentUserId || 'guest_user';
  const effectiveUserName = userName || 'REHVO Resident';

  const supportConvId = `conv_support_${effectiveUserId}`;
  const initialGreeting: Message = {
    id: `msg_support_welcome_${effectiveUserId}`,
    conversation_id: supportConvId,
    sender_id: 'rehvo_concierge_support',
    sender_name: 'REHVO Support Concierge',
    sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    text: `Hello ${effectiveUserName}! 👋 Welcome to REHVO 24x7 Priority Support Desk. How can our concierge team assist your stay, e-lease verification, visit schedule, or zero deposit pass today?`,
    message_type: 'text',
    status: 'read',
    created_at: new Date().toISOString(),
    is_read: true,
  };

  const supportConv: Conversation = {
    id: supportConvId,
    type: 'support',
    property_title: 'REHVO 24x7 Priority Support',
    other_user_id: 'rehvo_concierge_support',
    other_user_name: 'REHVO Support Concierge',
    other_user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    other_user_role: 'SUPPORT',
    is_verified: true,
    is_online: true,
    last_seen: 'Online now',
    renter_id: effectiveUserId,
    renter_name: effectiveUserName,
    renter_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
    owner_id: 'rehvo_concierge_support',
    owner_name: 'REHVO Support Concierge',
    owner_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    last_message: initialGreeting.text,
    updated_at: new Date().toISOString(),
    unread_count: 0,
    messages: [initialGreeting],
  };

  // Cache locally
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    const list: Conversation[] = raw ? JSON.parse(raw) : [];
    if (!list.some((c) => c.id === supportConvId)) {
      list.unshift(supportConv);
      await AsyncStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(list));
    }
  } catch {}

  return { success: true, data: supportConv };
}

// ---------------------------------------------------------------------------
// Phase 2 Production API & Function Aliases
// ---------------------------------------------------------------------------

export const getConversation = getConversationById;
export const getConversationMessages = getMessages;
export const subscribeInbox = subscribeToConversations;
export const markConversationRead = markConversationAsRead;
export const uploadAttachment = uploadChatAttachment;

export async function createConversation(params: {
  propertyId?: string;
  flatmateProfileId?: string;
  type?: ConversationType;
  otherUserId: string;
  initialMessage?: string;
}): Promise<ChatServiceResult<Conversation>> {
  const { propertyId, flatmateProfileId, type = 'property', otherUserId, initialMessage } = params;
  if (type === 'flatmate' && flatmateProfileId) {
    return getOrCreateFlatmateConversation(flatmateProfileId);
  }
  if (propertyId) {
    return getOrCreatePropertyConversation(propertyId);
  }
  return getOrCreateLeadConversation(otherUserId, propertyId, initialMessage);
}

export async function sendTextMessage(
  conversationId: string,
  text: string,
  replyToId?: string
): Promise<ChatServiceResult<Message>> {
  return sendRichMessage(conversationId, { text, messageType: 'text', replyToId });
}

export async function sendImageMessage(
  conversationId: string,
  imageUrl: string,
  caption?: string,
  replyToId?: string
): Promise<ChatServiceResult<Message>> {
  return sendRichMessage(conversationId, { text: caption, imageUrl, messageType: 'image', replyToId });
}

export async function sendVideoMessage(
  conversationId: string,
  videoUrl: string,
  caption?: string,
  replyToId?: string
): Promise<ChatServiceResult<Message>> {
  return sendRichMessage(conversationId, { text: caption, videoUrl, messageType: 'video', replyToId });
}

export async function sendDocumentMessage(
  conversationId: string,
  docUrl: string,
  docName: string,
  replyToId?: string
): Promise<ChatServiceResult<Message>> {
  return sendRichMessage(conversationId, {
    documentUrl: docUrl,
    documentName: docName,
    messageType: 'document',
    replyToId,
  });
}

export async function sendAudioMessage(
  conversationId: string,
  audioUrl: string,
  duration?: number,
  replyToId?: string
): Promise<ChatServiceResult<Message>> {
  return sendRichMessage(conversationId, {
    audioUrl,
    messageType: 'audio',
    metadata: { duration: duration || 14 },
    replyToId,
  });
}

export async function sendLocationMessage(
  conversationId: string,
  location: { latitude: number; longitude: number; name?: string },
  replyToId?: string
): Promise<ChatServiceResult<Message>> {
  return sendRichMessage(conversationId, {
    location,
    messageType: 'location',
    replyToId,
  });
}

export async function sendPropertyCard(
  conversationId: string,
  property: PropertyMessageMeta,
  replyToId?: string
): Promise<ChatServiceResult<Message>> {
  return sendRichMessage(conversationId, {
    messageType: 'property',
    metadata: { property },
    replyToId,
  });
}

export async function sendVisitInvite(
  conversationId: string,
  visit: VisitMessageMeta,
  replyToId?: string
): Promise<ChatServiceResult<Message>> {
  return sendRichMessage(conversationId, {
    messageType: 'visit',
    metadata: { visit },
    replyToId,
  });
}

export async function sendPaymentRequest(
  conversationId: string,
  payment: { amount: number; title: string; dueDate?: string; purpose?: string },
  replyToId?: string
): Promise<ChatServiceResult<Message>> {
  return sendRichMessage(conversationId, {
    messageType: 'payment_request',
    metadata: { payment_request: payment, amount: payment.amount },
    replyToId,
  });
}

export async function deleteMessageForMe(
  messageId: string,
  userId?: string,
  conversationId?: string
): Promise<ChatServiceResult<void>> {
  return deleteMessage(messageId, conversationId || '');
}

export async function reactToMessage(
  messageId: string,
  emoji: string
): Promise<ChatServiceResult<void>> {
  const res = await toggleMessageReaction(messageId, emoji);
  return { success: res.success, error: res.error };
}

export async function removeReaction(
  messageId: string,
  emoji: string
): Promise<ChatServiceResult<void>> {
  const res = await toggleMessageReaction(messageId, emoji);
  return { success: res.success, error: res.error };
}

export async function starMessage(
  messageId: string,
  userId?: string
): Promise<ChatServiceResult<void>> {
  if (!isSupabaseConfigured() || !messageId) return { success: true };
  try {
    let currentUserId = userId;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) return { success: true };

    await supabase
      .from('message_starred')
      .upsert({ user_id: currentUserId, message_id: messageId });
    return { success: true };
  } catch (err) {
    return { success: false, error: getUserFriendlyChatError(err, 'Could not star message') };
  }
}

export async function unstarMessage(
  messageId: string,
  userId?: string
): Promise<ChatServiceResult<void>> {
  if (!isSupabaseConfigured() || !messageId) return { success: true };
  try {
    let currentUserId = userId;
    if (!currentUserId) {
      const { data: authData } = await supabase.auth.getUser();
      currentUserId = authData?.user?.id;
    }
    if (!currentUserId) return { success: true };

    await supabase
      .from('message_starred')
      .delete()
      .eq('user_id', currentUserId)
      .eq('message_id', messageId);
    return { success: true };
  } catch (err) {
    return { success: false, error: getUserFriendlyChatError(err, 'Could not unstar message') };
  }
}

export async function archiveConversation(
  conversationId: string,
  isArchived = true
): Promise<ChatServiceResult<void>> {
  return toggleArchiveConversation(conversationId, isArchived);
}

export async function unarchiveConversation(
  conversationId: string
): Promise<ChatServiceResult<void>> {
  return toggleArchiveConversation(conversationId, false);
}

export async function pinConversation(
  conversationId: string,
  isPinned = true
): Promise<ChatServiceResult<void>> {
  return togglePinConversation(conversationId, isPinned);
}

export async function muteConversation(
  conversationId: string,
  isMuted = true
): Promise<ChatServiceResult<void>> {
  if (!isSupabaseConfigured() || !conversationId) return { success: true };
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) return { success: true };

    await supabase
      .from('conversation_participants')
      .update({ is_muted: isMuted })
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);

    return { success: true };
  } catch (err) {
    return { success: false, error: getUserFriendlyChatError(err, 'Could not mute conversation') };
  }
}

export function subscribeConversation(
  conversationId: string,
  onMessage: (msg: Message) => void,
  onUpdate?: (msg: Message) => void,
  onDelete?: (msgId: string) => void
): { unsubscribe: () => void } {
  return subscribeToMessages(conversationId, onMessage, onUpdate, onDelete);
}

// ---------------------------------------------------------------------------
// Offline Queue Manager
// ---------------------------------------------------------------------------
const OFFLINE_QUEUE_KEY = '@rehvo_offline_chat_queue';

export async function enqueueOfflineMessage(msg: {
  conversationId: string;
  params: Parameters<typeof sendRichMessage>[1];
}): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    const queue = raw ? JSON.parse(raw) : [];
    queue.push({ ...msg, queuedAt: Date.now() });
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch {}
}

export async function processOfflineQueue(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) return 0;
    const queue: Array<{ conversationId: string; params: Parameters<typeof sendRichMessage>[1] }> = JSON.parse(raw);
    if (queue.length === 0) return 0;

    let processed = 0;
    const remaining = [];
    for (const item of queue) {
      const res = await sendRichMessage(item.conversationId, item.params);
      if (res.success) {
        processed++;
      } else {
        remaining.push(item);
      }
    }
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
    return processed;
  } catch {
    return 0;
  }
}

// ---------------------------------------------------------------------------
// Push Notification Payload Generator
// ---------------------------------------------------------------------------
export function buildChatPushPayload(params: {
  conversationId: string;
  senderName: string;
  snippet: string;
  propertyId?: string;
  flatmateMatchId?: string;
}) {
  return {
    title: params.senderName,
    body: params.snippet,
    data: {
      url: `rehvo://chat/${params.conversationId}`,
      conversationId: params.conversationId,
      propertyId: params.propertyId,
      flatmateMatchId: params.flatmateMatchId,
    },
    sound: 'default',
    badge: 1,
  };
}
