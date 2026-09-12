/**
 * REHVO Maintenance Tickets & Society Complaint Service
 * Live Supabase-backed ticket lifecycle and technician chat.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  MaintenanceTicketRecord,
  MaintenanceTicketMessageRecord,
  MaintenanceCategory,
  MaintenanceUrgency,
} from '../types';

const TICKETS_CACHE_KEY = 'rehvo_maintenance_tickets_cache';
const MESSAGES_CACHE_KEY = 'rehvo_ticket_messages_cache';

export const maintenanceService = {
  async getMaintenanceTickets(
    userId: string,
    propertyId?: string
  ): Promise<{ success: boolean; data: MaintenanceTicketRecord[] }> {
    if (!userId) return { success: true, data: [] };

    try {
      if (isSupabaseConfigured()) {
        let query = supabase
          .from('maintenance_tickets')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (propertyId) {
          query = query.eq('property_id', propertyId);
        }

        const { data, error } = await query;
        if (!error && data) {
          await AsyncStorage.setItem(`${TICKETS_CACHE_KEY}_${userId}`, JSON.stringify(data));
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${TICKETS_CACHE_KEY}_${userId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  async createMaintenanceTicket(
    userId: string,
    payload: {
      property_id?: string;
      category: MaintenanceCategory;
      urgency: MaintenanceUrgency;
      title: string;
      description: string;
      photos?: string[];
    }
  ): Promise<{ success: boolean; data?: MaintenanceTicketRecord; error?: string }> {
    if (!userId || !payload.title.trim() || !payload.description.trim()) {
      return { success: false, error: 'Title and description are required' };
    }

    try {
      const now = new Date().toISOString();
      const newTicket: MaintenanceTicketRecord = {
        id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        user_id: userId,
        property_id: payload.property_id,
        category: payload.category,
        urgency: payload.urgency,
        title: payload.title.trim(),
        description: payload.description.trim(),
        photos: payload.photos || [],
        status: 'open',
        created_at: now,
        updated_at: now,
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('maintenance_tickets')
          .insert(newTicket)
          .select()
          .single();

        if (!error && data) {
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${TICKETS_CACHE_KEY}_${userId}`);
      const list: MaintenanceTicketRecord[] = cached ? JSON.parse(cached) : [];
      list.unshift(newTicket);
      await AsyncStorage.setItem(`${TICKETS_CACHE_KEY}_${userId}`, JSON.stringify(list));

      return { success: true, data: newTicket };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to submit complaint' };
    }
  },

  async updateTicketStatus(
    userId: string,
    ticketId: string,
    status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed'
  ): Promise<{ success: boolean }> {
    if (!ticketId) return { success: false };

    try {
      const now = new Date().toISOString();
      const updates: any = { status, updated_at: now };
      if (status === 'resolved' || status === 'closed') {
        updates.resolved_at = now;
      }

      if (isSupabaseConfigured()) {
        await supabase.from('maintenance_tickets').update(updates).eq('id', ticketId);
      }

      if (userId) {
        const cached = await AsyncStorage.getItem(`${TICKETS_CACHE_KEY}_${userId}`);
        if (cached) {
          const list: MaintenanceTicketRecord[] = JSON.parse(cached);
          const updated = list.map((t) =>
            t.id === ticketId ? { ...t, ...updates } : t
          );
          await AsyncStorage.setItem(`${TICKETS_CACHE_KEY}_${userId}`, JSON.stringify(updated));
        }
      }

      return { success: true };
    } catch {
      return { success: false };
    }
  },

  async getTicketMessages(
    ticketId: string
  ): Promise<{ success: boolean; data: MaintenanceTicketMessageRecord[] }> {
    if (!ticketId) return { success: true, data: [] };

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('maintenance_ticket_messages')
          .select('*')
          .eq('ticket_id', ticketId)
          .order('created_at', { ascending: true });

        if (!error && data) {
          await AsyncStorage.setItem(`${MESSAGES_CACHE_KEY}_${ticketId}`, JSON.stringify(data));
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${MESSAGES_CACHE_KEY}_${ticketId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  async sendTicketMessage(
    ticketId: string,
    payload: {
      sender_id: string;
      sender_name: string;
      sender_role: 'tenant' | 'technician' | 'society_manager';
      message: string;
    }
  ): Promise<{ success: boolean; data?: MaintenanceTicketMessageRecord }> {
    if (!ticketId || !payload.message.trim()) {
      return { success: false };
    }

    try {
      const newMsg: MaintenanceTicketMessageRecord = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        ticket_id: ticketId,
        sender_id: payload.sender_id,
        sender_name: payload.sender_name,
        sender_role: payload.sender_role,
        message: payload.message.trim(),
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('maintenance_ticket_messages')
          .insert(newMsg)
          .select()
          .single();

        if (!error && data) {
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${MESSAGES_CACHE_KEY}_${ticketId}`);
      const list: MaintenanceTicketMessageRecord[] = cached ? JSON.parse(cached) : [];
      list.push(newMsg);
      await AsyncStorage.setItem(`${MESSAGES_CACHE_KEY}_${ticketId}`, JSON.stringify(list));

      return { success: true, data: newMsg };
    } catch {
      return { success: false };
    }
  },
};
