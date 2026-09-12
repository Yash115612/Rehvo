import { supabase } from '../lib/supabase';
import { SupportTicketMessage, SupportFaqItem } from '../types';

export interface SupportTicket {
  id: string;
  user_id?: string;
  subject: string;
  category: 'rent_payment' | 'agreement' | 'visit' | 'flatmate' | 'kyc' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
}

export const createSupportTicket = async (ticket: {
  user_id?: string;
  subject: string;
  category: SupportTicket['category'];
  initialMessage: string;
}): Promise<{ success: boolean; ticketId?: string }> => {
  try {
    const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    
    // Save initial message in support_ticket_messages
    await supabase.from('support_ticket_messages').insert({
      ticket_id: ticketId,
      sender_id: ticket.user_id,
      sender_role: 'user',
      message: ticket.initialMessage,
      attachments: [],
      created_at: new Date().toISOString(),
    });

    // Append automated concierge reply
    setTimeout(async () => {
      try {
        await supabase.from('support_ticket_messages').insert({
          ticket_id: ticketId,
          sender_role: 'bot',
          message: `Hello! Our Priority Mumbai Concierge has received your request regarding "${ticket.subject}". An executive is reviewing your account and will assist shortly.`,
          attachments: [],
          created_at: new Date().toISOString(),
        });
      } catch {
        // Safe failover
      }
    }, 1200);

    return { success: true, ticketId };
  } catch {
    return { success: false };
  }
};

export const getTicketMessages = async (ticketId: string): Promise<SupportTicketMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('support_ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) return [];
    return (data as SupportTicketMessage[]) ?? [];
  } catch {
    return [];
  }
};

export const sendSupportMessage = async (
  ticketId: string,
  message: string,
  userId?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('support_ticket_messages').insert({
      ticket_id: ticketId,
      sender_id: userId,
      sender_role: 'user',
      message: message.trim(),
      attachments: [],
      created_at: new Date().toISOString(),
    });

    return !error;
  } catch {
    return false;
  }
};

export const searchSupportFaqs = (query: string, allFaqs: SupportFaqItem[]): SupportFaqItem[] => {
  if (!query.trim()) return allFaqs;
  const q = query.toLowerCase();
  return allFaqs.filter(
    (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
  );
};
