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

  const propImage =
    prop?.property_images?.find((img: any) => img.is_cover)?.image_url ||
    prop?.property_images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';

  const flatmateAvatar =
    flatmate?.flatmate_images?.find((img: any) => img.is_primary)?.image_url ||
    flatmate?.flatmate_images?.[0]?.image_url ||
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
      ? `Flatmate Connect · ${flatmate.name}`
      : 'Direct Conversation',
    property_image: prop ? propImage : flatmateAvatar,
    property_locality: prop
      ? `${prop.locality}, ${prop.city || 'Mumbai'}`
      : flatmate
      ? `${flatmate.locality}, ${flatmate.city || 'Mumbai'}`
      : 'Mumbai',
    rent: prop?.rent,
    enquiry_id: row.enquiry_id || undefined,
    flatmate_profile_id: row.flatmate_profile_id || undefined,
    flatmate_name: flatmate?.name,
    flatmate_avatar: flatmateAvatar,
    renter_id: currentUserId,
    renter_name: myProfile?.full_name || 'You',
    renter_avatar: myProfile?.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    owner_id: otherParticipant?.user_id || '',
    owner_name: otherProfile?.full_name || (flatmate ? flatmate.name : 'Property Owner'),
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
        properties (id, title, locality, city, rent, property_images (*)),
        flatmate_profiles (id, user_id, name, display_name, locality, city, budget_max, room_preference, flatmate_images (*)),
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
        properties (id, title, locality, city, rent, property_images (*)),
        flatmate_profiles (id, user_id, name, display_name, locality, city, budget_max, room_preference, flatmate_images (*)),
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
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData?.user?.id;
    if (!currentUserId) {
      return { success: false, error: 'You must be signed in to send messages.' };
    }

    // 1. Fetch property to get authoritative owner_id
    const { data: prop, error: propError } = await supabase
      .from('properties')
      .select('id, title, owner_id')
      .eq('id', propertyId)
      .single();

    if (propError || !prop) {
      return { success: false, error: 'Property listing not found.' };
    }

    if (prop.owner_id === currentUserId) {
      return { success: false, error: 'You cannot start a chat on your own property listing.' };
    }

    // 2. Check if a conversation already exists between current user & property owner for this property
    const { data: existingConvs, error: checkError } = await supabase
      .from('conversations')
      .select(`
        id,
        conversation_participants (user_id)
      `)
      .eq('property_id', propertyId);

    if (!checkError && existingConvs && existingConvs.length > 0) {
      for (const conv of existingConvs) {
        const participantIds = (conv.conversation_participants || []).map((p: any) => p.user_id);
        if (participantIds.includes(currentUserId) && participantIds.includes(prop.owner_id)) {
          // Existing conversation found! Return full details
          return getConversationById(conv.id, currentUserId);
        }
      }
    }

    // 3. Create new conversation row
    const { data: newConv, error: createError } = await supabase
      .from('conversations')
      .insert({
        property_id: propertyId,
        enquiry_id: enquiryId || null,
        last_message_text: 'Started conversation',
        last_message_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError || !newConv) {
      return {
        success: false,
        error: getUserFriendlyChatError(createError, "Couldn't create conversation."),
      };
    }

    // 4. Add both participants
    const { error: partInsertError } = await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: newConv.id, user_id: currentUserId, unread_count: 0 },
        { conversation_id: newConv.id, user_id: prop.owner_id, unread_count: 0 },
      ]);

    if (partInsertError) {
      return {
        success: false,
        error: getUserFriendlyChatError(partInsertError, "Couldn't set up conversation participants."),
      };
    }

    return getConversationById(newConv.id, currentUserId);
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyChatError(err, "Couldn't initiate conversation."),
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
      return { success: false, error: 'You must be signed in to send messages.' };
    }

    // 1. Fetch flatmate profile to get target user_id
    const { data: flatmate, error: fmError } = await supabase
      .from('flatmate_profiles')
      .select('id, user_id, name')
      .eq('id', flatmateProfileId)
      .single();

    if (fmError || !flatmate) {
      return { success: false, error: 'Flatmate profile not found.' };
    }

    const targetUserId = flatmate.user_id;
    if (!targetUserId) {
      return { success: false, error: 'Target flatmate user account not found.' };
    }

    if (targetUserId === currentUserId) {
      return { success: false, error: 'You cannot start a chat with your own flatmate profile.' };
    }

    // 2. Check if a conversation already exists
    const { data: existingConvs, error: checkError } = await supabase
      .from('conversations')
      .select(`
        id,
        conversation_participants (user_id)
      `)
      .eq('flatmate_profile_id', flatmateProfileId);

    if (!checkError && existingConvs && existingConvs.length > 0) {
      for (const conv of existingConvs) {
        const participantIds = (conv.conversation_participants || []).map((p: any) => p.user_id);
        if (participantIds.includes(currentUserId) && participantIds.includes(targetUserId)) {
          // Existing conversation found!
          return getConversationById(conv.id, currentUserId);
        }
      }
    }

    // 3. Create new conversation row
    const { data: newConv, error: createError } = await supabase
      .from('conversations')
      .insert({
        flatmate_profile_id: flatmateProfileId,
        last_message_text: 'Started conversation',
        last_message_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError || !newConv) {
      return {
        success: false,
        error: getUserFriendlyChatError(createError, "Couldn't create conversation."),
      };
    }

    // 4. Add both participants
    const { error: partInsertError } = await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: newConv.id, user_id: currentUserId, unread_count: 0 },
        { conversation_id: newConv.id, user_id: targetUserId, unread_count: 0 },
      ]);

    if (partInsertError) {
      return {
        success: false,
        error: getUserFriendlyChatError(partInsertError, "Couldn't set up conversation participants."),
      };
    }

    return getConversationById(newConv.id, currentUserId);
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyChatError(err, "Couldn't initiate conversation."),
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
