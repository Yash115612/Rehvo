import { createClient } from '@/lib/supabase/client';
import { Conversation, Message } from '@/lib/types';

const supabase = createClient();

export interface ChatServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Get all conversations for a user */
export async function getConversations(
  userId: string
): Promise<ChatServiceResult<Conversation[]>> {
  try {
    // 1. Get participant conversation IDs
    const { data: partRows, error: partError } = await supabase
      .from('conversation_participants')
      .select('conversation_id, unread_count, last_read_at')
      .eq('user_id', userId);

    if (partError) {
      return { success: false, error: partError.message, data: [] };
    }

    const conversationIds = (partRows || []).map((p) => p.conversation_id);
    if (conversationIds.length === 0) {
      return { success: true, data: [] };
    }

    // 2. Fetch conversations
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
        )
      `)
      .in('id', conversationIds)
      .order('last_message_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    const conversations: Conversation[] = (data || []).map((conv: any) => {
      const participants = conv.conversation_participants || [];
      const myPart = participants.find((p: any) => p.user_id === userId);
      const otherPart = participants.find((p: any) => p.user_id !== userId) || participants[0];

      return {
        id: conv.id,
        property_id: conv.property_id,
        enquiry_id: conv.enquiry_id,
        flatmate_profile_id: conv.flatmate_profile_id,
        last_message_text: conv.last_message_text,
        last_message_at: conv.last_message_at,
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        properties: conv.properties,
        flatmate_profiles: conv.flatmate_profiles,
        unread_count: myPart?.unread_count || 0,
        other_participant: otherPart?.profiles
          ? {
              id: otherPart.user_id,
              full_name: otherPart.profiles.full_name,
              profile_photo: otherPart.profiles.profile_photo,
              phone: otherPart.profiles.phone,
            }
          : undefined,
      };
    });

    return { success: true, data: conversations };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}

/** Get a single conversation by ID */
export async function getConversationById(
  conversationId: string,
  userId: string
): Promise<ChatServiceResult<Conversation>> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        properties (id, title, locality, city, price, address, owner_id, property_images (*)),
        flatmate_profiles (id, user_id, photo, locality, city, budget_max, room_preference, profiles:profiles!flatmate_profiles_user_id_fkey (full_name)),
        conversation_participants (
          id,
          user_id,
          unread_count,
          last_read_at,
          profiles:profiles!conversation_participants_user_id_fkey (id, full_name, phone, profile_photo)
        )
      `)
      .eq('id', conversationId)
      .single();

    if (error || !data) {
      return { success: false, error: 'Conversation not found.' };
    }

    const participants = data.conversation_participants || [];
    const otherPart = participants.find((p: any) => p.user_id !== userId) || participants[0];

    const conv: Conversation = {
      id: data.id,
      property_id: data.property_id,
      enquiry_id: data.enquiry_id,
      flatmate_profile_id: data.flatmate_profile_id,
      last_message_text: data.last_message_text,
      last_message_at: data.last_message_at,
      created_at: data.created_at,
      updated_at: data.updated_at,
      properties: data.properties,
      flatmate_profiles: data.flatmate_profiles,
      other_participant: otherPart?.profiles
        ? {
            id: otherPart.user_id,
            full_name: otherPart.profiles.full_name,
            profile_photo: otherPart.profiles.profile_photo,
            phone: otherPart.profiles.phone,
          }
        : undefined,
    };

    return { success: true, data: conv };
  } catch (err: any) {
    return { success: false, error: err.message || 'Conversation not found.' };
  }
}

/** Get or create conversation for a Property Listing */
export async function getOrCreatePropertyConversation(
  propertyId: string,
  userId: string,
  enquiryId?: string
): Promise<ChatServiceResult<string>> {
  try {
    // 1. Call atomic RPC function in Supabase
    const { data: convId, error: rpcError } = await supabase.rpc(
      'create_or_get_conversation',
      {
        p_property_id: propertyId,
        p_enquiry_id: enquiryId || null,
      }
    );

    if (rpcError || !convId) {
      // Fallback manual lookup or create
      const { data: property } = await supabase
        .from('properties')
        .select('owner_id')
        .eq('id', propertyId)
        .single();

      if (!property) {
        return { success: false, error: 'Property not found.' };
      }

      // Check if conversation exists
      const { data: newConv, error: newConvErr } = await supabase
        .from('conversations')
        .insert({
          property_id: propertyId,
          enquiry_id: enquiryId || null,
        })
        .select('id')
        .single();

      if (newConvErr || !newConv) {
        return { success: false, error: 'Failed to start conversation with owner.' };
      }

      await supabase.from('conversation_participants').insert([
        { conversation_id: newConv.id, user_id: userId },
        { conversation_id: newConv.id, user_id: property.owner_id },
      ]);

      return { success: true, data: newConv.id };
    }

    return { success: true, data: convId as string };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to start conversation.' };
  }
}

/** Get or create conversation for a Flatmate Profile */
export async function getOrCreateFlatmateConversation(
  flatmateProfileId: string,
  userId: string
): Promise<ChatServiceResult<string>> {
  try {
    const { data: convId, error: rpcError } = await supabase.rpc(
      'create_or_get_flatmate_conversation',
      {
        p_flatmate_profile_id: flatmateProfileId,
      }
    );

    if (rpcError || !convId) {
      const { data: flatmate } = await supabase
        .from('flatmate_profiles')
        .select('user_id')
        .eq('id', flatmateProfileId)
        .single();

      if (!flatmate) {
        return { success: false, error: 'Flatmate profile not found.' };
      }

      const { data: newConv, error: newConvErr } = await supabase
        .from('conversations')
        .insert({
          flatmate_profile_id: flatmateProfileId,
        })
        .select('id')
        .single();

      if (newConvErr || !newConv) {
        return { success: false, error: 'Failed to start conversation with flatmate.' };
      }

      await supabase.from('conversation_participants').insert([
        { conversation_id: newConv.id, user_id: userId },
        { conversation_id: newConv.id, user_id: flatmate.user_id },
      ]);

      return { success: true, data: newConv.id };
    }

    return { success: true, data: convId as string };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to start conversation.' };
  }
}

/** Get messages for a specific conversation */
export async function getMessages(
  conversationId: string
): Promise<ChatServiceResult<Message[]>> {
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
      return { success: false, error: error.message, data: [] };
    }

    const messages: Message[] = (data || []).map((m: any) => ({
      id: m.id,
      conversation_id: m.conversation_id,
      sender_id: m.sender_id,
      sender_name: m.sender_profile?.full_name || 'User',
      sender_avatar: m.sender_profile?.profile_photo || undefined,
      message: m.message,
      message_type: m.message_type || 'text',
      read_at: m.read_at,
      created_at: m.created_at,
      is_read: !!m.read_at,
    }));

    return { success: true, data: messages };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}

/** Send message in conversation */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string,
  messageType: 'text' | 'image' | 'visit_request' = 'text'
): Promise<ChatServiceResult<Message>> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        message: text.trim(),
        message_type: messageType,
      })
      .select(`
        *,
        sender_profile:profiles!messages_sender_id_fkey (id, full_name, profile_photo)
      `)
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || 'Failed to send message.' };
    }

    return {
      success: true,
      data: {
        id: data.id,
        conversation_id: data.conversation_id,
        sender_id: data.sender_id,
        sender_name: data.sender_profile?.full_name || 'You',
        sender_avatar: data.sender_profile?.profile_photo,
        message: data.message,
        message_type: data.message_type,
        created_at: data.created_at,
        is_read: false,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to send message.' };
  }
}

/** Mark conversation as read */
export async function markMessagesAsRead(
  conversationId: string,
  userId: string
): Promise<void> {
  try {
    await supabase
      .from('conversation_participants')
      .update({
        unread_count: 0,
        last_read_at: new Date().toISOString(),
      })
      .match({ conversation_id: conversationId, user_id: userId });
  } catch {
    // Non-blocking
  }
}
