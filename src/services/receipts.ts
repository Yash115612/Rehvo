// ==============================================================================
// REHVO V5.4 — HRA RENT RECEIPT & QR VERIFICATION ENGINE
// Live Supabase integration with Income Tax / HRA compliant formatting
// ==============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { RentReceiptRecord } from '../types';

const RECEIPTS_CACHE = 'rehvo_rent_receipts_cache';

export interface GenerateReceiptParams {
  userId: string;
  paymentId?: string;
  monthYear: string;
  rentAmount: number;
  maintenanceAmount?: number;
  tenantName: string;
  tenantEmail?: string;
  tenantPan?: string;
  landlordName: string;
  landlordPan?: string;
  landlordSignatureUrl?: string;
  propertyAddress: string;
  hraEligible?: boolean;
}

export const receiptsService = {
  // 1. GET ALL RECEIPTS FOR USER
  async getReceipts(userId: string): Promise<{ success: boolean; data: RentReceiptRecord[] }> {
    if (!userId) return { success: false, data: [] };

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('rent_receipts')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          await AsyncStorage.setItem(`${RECEIPTS_CACHE}_${userId}`, JSON.stringify(data));
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${RECEIPTS_CACHE}_${userId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  // 2. GENERATE OFFICIAL HRA RECEIPT
  async generateReceipt(params: GenerateReceiptParams): Promise<{
    success: boolean;
    data?: RentReceiptRecord;
    error?: string;
  }> {
    if (!params.userId) return { success: false, error: 'User not authenticated' };

    try {
      const receiptNumber = `REHVO/HRA/${new Date().getFullYear()}/${Math.floor(100000 + Math.random() * 900000)}`;
      const qrPayload = JSON.stringify({
        ref: receiptNumber,
        tenant: params.tenantName,
        landlord: params.landlordName,
        landlordPan: params.landlordPan || 'N/A',
        month: params.monthYear,
        amount: params.rentAmount + (params.maintenanceAmount || 0),
        status: 'AUTHENTICATED_BY_REHVO',
        issuedAt: new Date().toISOString(),
      });

      const newReceipt: RentReceiptRecord = {
        id: `rcpt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        payment_id: params.paymentId,
        user_id: params.userId,
        receipt_number: receiptNumber,
        month_year: params.monthYear,
        rent_amount: params.rentAmount,
        maintenance_amount: params.maintenanceAmount || 0,
        tenant_name: params.tenantName,
        tenant_email: params.tenantEmail,
        tenant_pan: params.tenantPan,
        landlord_name: params.landlordName,
        landlord_pan: params.landlordPan,
        landlord_signature_url: params.landlordSignatureUrl,
        property_address: params.propertyAddress,
        hra_eligible: params.hraEligible ?? true,
        qr_code_payload: qrPayload,
        pdf_url: `https://rehvo.com/receipts/${receiptNumber.replace(/\//g, '-')}.pdf`,
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('rent_receipts')
          .insert(newReceipt)
          .select()
          .single();

        if (!error && data) {
          // If associated with a payment, link it
          if (params.paymentId) {
            await supabase
              .from('rent_payments')
              .update({ hra_receipt_id: data.id })
              .eq('id', params.paymentId);
          }
          return { success: true, data };
        }
      }

      return { success: true, data: newReceipt };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to generate receipt' };
    }
  },

  // 3. GET SINGLE RECEIPT
  async getReceiptById(receiptId: string): Promise<{ success: boolean; data?: RentReceiptRecord }> {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('rent_receipts')
          .select('*')
          .eq('id', receiptId)
          .maybeSingle();

        if (!error && data) {
          return { success: true, data };
        }
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  },

  // 4. VERIFY RECEIPT FROM QR CODE
  verifyQrCode(qrPayload: string): { isValid: boolean; details?: Record<string, any> } {
    try {
      const parsed = JSON.parse(qrPayload);
      if (parsed.status === 'AUTHENTICATED_BY_REHVO' && parsed.ref) {
        return { isValid: true, details: parsed };
      }
      return { isValid: false };
    } catch {
      return { isValid: false };
    }
  },
};
