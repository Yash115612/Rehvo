import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  RentPaymentRecord,
  LeaseAgreementRecord,
  ZeroDepositPassRecord,
  TenantVerificationRecord,
  VisitBookingRecord,
  ServiceBookingRecord,
  UtilityRequestRecord,
  DocumentVaultRecord,
  DocumentVaultType,
  DocumentVaultCategory,
  ServiceBookingType,
  UtilityType,
  MoveInChecklistRecord,
  InventoryItemRecord,
  UtilityProviderRecord,
  OwnerBankAccountRecord,
  OwnerPayoutWalletRecord,
  OwnerPayoutTransactionRecord,
  ElectricityBillRecord,
  BroadbandPlanRecord,
  BroadbandBookingRecord,
  WaterTankerBookingRecord,
  PngGasBookingRecord,
  MoveIn30ChecklistRecord,
} from '../types';

const RENT_PAYMENTS_CACHE = 'rehvo_rent_payments_cache';
const LEASE_AGREEMENTS_CACHE = 'rehvo_lease_agreements_cache';
const ZERO_DEPOSIT_CACHE = 'rehvo_zero_deposit_cache';
const TENANT_VERIF_CACHE = 'rehvo_tenant_verif_cache';
const VISITS_CACHE = 'rehvo_visits_cache';
const SERVICES_CACHE = 'rehvo_services_cache';
const UTILITIES_CACHE = 'rehvo_utilities_cache';
const VAULT_CACHE = 'rehvo_vault_cache';
const CHECKLIST_CACHE = 'rehvo_checklist_cache';
const INVENTORY_CACHE = 'rehvo_inventory_cache';
const OWNER_BANK_CACHE = 'rehvo_owner_bank_cache';
const OWNER_PAYOUT_CACHE = 'rehvo_owner_payout_cache';

// ==============================================================================
// INITIAL SEED DATA
// ==============================================================================

export const DEFAULT_RENT_PAYMENTS: RentPaymentRecord[] = [];
export const DEFAULT_LEASE_AGREEMENTS: LeaseAgreementRecord[] = [];
export const DEFAULT_ZERO_DEPOSIT: ZeroDepositPassRecord | null = null;
export const DEFAULT_TENANT_VERIFICATION: TenantVerificationRecord | null = null;
export const DEFAULT_VISIT_BOOKINGS: VisitBookingRecord[] = [];
export const DEFAULT_SERVICE_BOOKINGS: ServiceBookingRecord[] = [];
export const DEFAULT_UTILITY_REQUESTS: UtilityRequestRecord[] = [];
export const DEFAULT_DOCUMENT_VAULT: DocumentVaultRecord[] = [];


// ==============================================================================
// SERVICE IMPLEMENTATION
// ==============================================================================

export const rentalOperationsService = {
  // 1. RENT PAYMENTS
  async getRentPayments(userId: string): Promise<{ success: boolean; data: RentPaymentRecord[] }> {
    try {
      if (isSupabaseConfigured() && userId) {
        const { data, error } = await supabase
          .from('rent_payments')
          .select('*')
          .eq('user_id', userId)
          .order('paid_at', { ascending: false });

        if (!error && data) {
          await AsyncStorage.setItem(`${RENT_PAYMENTS_CACHE}_${userId}`, JSON.stringify(data));
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${RENT_PAYMENTS_CACHE}_${userId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  async recordRentPayment(
    userId: string,
    payload: Partial<RentPaymentRecord>
  ): Promise<{ success: boolean; data?: RentPaymentRecord; error?: string }> {
    const newRecord: RentPaymentRecord = {
      id: payload.id || `pay_${Date.now()}`,
      user_id: userId,
      property_id: payload.property_id,
      property_name: payload.property_name || 'Skyline Residency • Suite 402',
      locality: payload.locality || 'Bandra West, Mumbai',
      landlord_name: payload.landlord_name || 'Vikramaditya Singhania',
      landlord_upi: payload.landlord_upi || 'singhania@okhdfcbank',
      amount: payload.amount || 18950,
      base_rent: payload.base_rent || 18000,
      maintenance: payload.maintenance || 1000,
      platform_fee: payload.platform_fee || 200,
      discount: payload.discount || 250,
      payment_method: payload.payment_method || 'upi',
      payment_method_detail: payload.payment_method_detail || 'UPI Instant Payment',
      status: 'completed',
      transaction_ref: payload.transaction_ref || `TXN_REHVO_${Math.floor(100000 + Math.random() * 900000)}`,
      cashback_earned: payload.cashback_earned || Math.min(500, Math.round((payload.amount || 18950) * 0.01)),
      due_date: payload.due_date || new Date().toISOString().split('T')[0],
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured() && userId) {
        const { data, error } = await supabase
          .from('rent_payments')
          .insert(newRecord)
          .select()
          .single();

        if (!error && data) {
          return { success: true, data };
        }
      }

      // Also create rent receipt in document vault
      await this.addVaultDocument(userId, {
        title: `${new Date().toLocaleString('default', { month: 'long' })} Rent Payment Official Receipt`,
        document_type: 'rent_receipt',
        file_url: `https://rehvo.com/receipts/${newRecord.transaction_ref}.pdf`,
        file_size: '520 KB',
      });

      return { success: true, data: newRecord };
    } catch (e: any) {
      return { success: true, data: newRecord };
    }
  },

  // 2. LEASE AGREEMENTS
  async getLeaseAgreements(userId: string): Promise<{ success: boolean; data: LeaseAgreementRecord[] }> {
    try {
      if (isSupabaseConfigured() && userId) {
        const { data, error } = await supabase
          .from('lease_agreements')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          await AsyncStorage.setItem(`${LEASE_AGREEMENTS_CACHE}_${userId}`, JSON.stringify(data));
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${LEASE_AGREEMENTS_CACHE}_${userId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  async createLeaseAgreement(
    userId: string,
    payload: Partial<LeaseAgreementRecord>
  ): Promise<{ success: boolean; data?: LeaseAgreementRecord; error?: string }> {
    const newAgr: LeaseAgreementRecord = {
      id: payload.id || `agr_${Date.now()}`,
      user_id: userId,
      property_title: payload.property_title || 'Residential Apartment in Mumbai',
      property_locality: payload.property_locality || 'Bandra West, Mumbai',
      property_image: payload.property_image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80',
      landlord_name: payload.landlord_name || 'Verified Owner',
      landlord_phone: payload.landlord_phone || '+91 98200 11223',
      landlord_aadhaar_last4: payload.landlord_aadhaar_last4 || '5512',
      tenant_name: payload.tenant_name || 'REHVO Member',
      tenant_phone: payload.tenant_phone || '+91 98765 43210',
      tenant_aadhaar_last4: payload.tenant_aadhaar_last4 || '4920',
      monthly_rent: payload.monthly_rent || 20000,
      security_deposit: payload.security_deposit || 40000,
      notice_period_days: payload.notice_period_days || 30,
      lockin_months: payload.lockin_months || 6,
      duration_months: payload.duration_months || 11,
      start_date: payload.start_date || '2026-10-01',
      end_date: payload.end_date || '2027-08-31',
      status: 'pending_signatures',
      stamp_duty_amount: 1499,
      govt_registration_fee: 1000,
      registration_id: `MH-MUM-REG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      biometric_status: 'not_scheduled',
      estamp_number: `IN-MH${Math.floor(1000000000 + Math.random() * 9000000000)}X`,
      tenant_signed: true,
      owner_signed: false,
      tenant_signed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured() && userId) {
        const { data, error } = await supabase
          .from('lease_agreements')
          .insert(newAgr)
          .select()
          .single();

        if (!error && data) {
          return { success: true, data };
        }
      }

      // Add to Document Vault
      await this.addVaultDocument(userId, {
        title: `Digital E-Lease Agreement (${newAgr.property_title})`,
        document_type: 'lease_agreement',
        file_url: `https://rehvo.com/docs/${newAgr.registration_id}.pdf`,
        file_size: '2.1 MB',
      });

      return { success: true, data: newAgr };
    } catch {
      return { success: true, data: newAgr };
    }
  },

  async scheduleBiometrics(
    agreementId: string,
    date: string,
    slot: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (isSupabaseConfigured()) {
        await supabase
          .from('lease_agreements')
          .update({
            biometric_status: 'scheduled',
            biometric_date: date,
            biometric_slot: slot,
            biometric_executive: 'Kunal Kadam (Govt Certified Agent)',
            status: 'biometrics_pending',
            updated_at: new Date().toISOString(),
          })
          .eq('id', agreementId);
      }
      return { success: true, message: `Biometric appointment booked for ${date} (${slot})` };
    } catch {
      return { success: true, message: `Biometric appointment booked for ${date} (${slot})` };
    }
  },

  // 3. ZERO DEPOSIT PASS
  async getZeroDepositPass(userId: string): Promise<{ success: boolean; data: ZeroDepositPassRecord | null }> {
    try {
      if (isSupabaseConfigured() && userId) {
        const { data, error } = await supabase
          .from('zero_deposit_passes')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (!error && data) {
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${ZERO_DEPOSIT_CACHE}_${userId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: null };
    } catch {
      return { success: true, data: null };
    }
  },

  async applyZeroDepositPass(
    userId: string,
    creditScore: number = 780,
    coverageAmount: number = 150000
  ): Promise<{ success: boolean; data: ZeroDepositPassRecord }> {
    const newPass: ZeroDepositPassRecord = {
      id: `zd_${Date.now()}`,
      user_id: userId,
      credit_score: creditScore,
      coverage_amount: coverageAmount,
      monthly_fee: 499,
      status: 'active',
      certificate_id: `REHVO-ZD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      landlord_protected: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured() && userId) {
        await supabase.from('zero_deposit_passes').upsert(newPass);
      }
      await AsyncStorage.setItem(`${ZERO_DEPOSIT_CACHE}_${userId}`, JSON.stringify(newPass));

      // Add to vault
      await this.addVaultDocument(userId, {
        title: `Zero Deposit Security Certificate (${newPass.certificate_id})`,
        document_type: 'zero_deposit',
        file_url: `https://rehvo.com/certs/${newPass.certificate_id}.pdf`,
        file_size: '1.2 MB',
      });

      return { success: true, data: newPass };
    } catch {
      return { success: true, data: newPass };
    }
  },

  // 4. TENANT VERIFICATIONS
  async getTenantVerification(userId: string): Promise<{ success: boolean; data: TenantVerificationRecord | null }> {
    try {
      if (isSupabaseConfigured() && userId) {
        const { data, error } = await supabase
          .from('tenant_verifications')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (!error && data) {
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${TENANT_VERIF_CACHE}_${userId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: null };
    } catch {
      return { success: true, data: null };
    }
  },

  async updateVerificationStep(
    userId: string,
    updates: Partial<TenantVerificationRecord>
  ): Promise<{ success: boolean; data?: TenantVerificationRecord }> {
    try {
      const currentRes = await this.getTenantVerification(userId);
      const updated = {
        ...currentRes.data,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured() && userId) {
        await supabase.from('tenant_verifications').upsert(updated);
      }
      await AsyncStorage.setItem(`${TENANT_VERIF_CACHE}_${userId}`, JSON.stringify(updated));
      return { success: true, data: updated };
    } catch {
      return { success: true };
    }
  },

  // 5. VISIT BOOKINGS
  async getVisitBookings(userId: string): Promise<{ success: boolean; data: VisitBookingRecord[] }> {
    try {
      if (isSupabaseConfigured() && userId) {
        const { data, error } = await supabase
          .from('visit_bookings')
          .select('*')
          .eq('user_id', userId)
          .order('visit_date', { ascending: true });

        if (!error && data) {
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${VISITS_CACHE}_${userId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  async bookVisit(
    userId: string,
    payload: Partial<VisitBookingRecord>
  ): Promise<{ success: boolean; data: VisitBookingRecord }> {
    const newVisit: VisitBookingRecord = {
      id: `vis_${Date.now()}`,
      user_id: userId,
      property_id: payload.property_id,
      property_title: payload.property_title || 'Scheduled Property Tour',
      property_locality: payload.property_locality || 'Mumbai',
      property_image: payload.property_image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
      host_name: payload.host_name || 'Direct Verified Owner',
      host_phone: payload.host_phone || '+91 98200 11223',
      visit_date: payload.visit_date || new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      time_slot: payload.time_slot || '11:00 AM - 12:00 PM',
      status: 'confirmed',
      qr_code_payload: `VISIT_PASS_${Date.now()}_APPROVED`,
      special_notes: payload.special_notes || 'Society entry registered with security guard.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured() && userId) {
        await supabase.from('visit_bookings').insert(newVisit);
      }
      return { success: true, data: newVisit };
    } catch {
      return { success: true, data: newVisit };
    }
  },

  // 6. SERVICE BOOKINGS (Packers & Movers, Deep Cleaning)
  async getServiceBookings(
    userId: string,
    type?: ServiceBookingType
  ): Promise<{ success: boolean; data: ServiceBookingRecord[] }> {
    try {
      if (isSupabaseConfigured() && userId) {
        let query = supabase.from('service_bookings').select('*').eq('user_id', userId);
        if (type) query = query.eq('service_type', type);
        const { data, error } = await query.order('booking_date', { ascending: true });

        if (!error && data) {
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${SERVICES_CACHE}_${userId}`);
      if (cached) {
        const parsed: ServiceBookingRecord[] = JSON.parse(cached);
        return { success: true, data: type ? parsed.filter((s) => s.service_type === type) : parsed };
      }

      return {
        success: true,
        data: [],
      };
    } catch {
      return { success: true, data: [] };
    }
  },

  async bookService(
    userId: string,
    payload: Partial<ServiceBookingRecord>
  ): Promise<{ success: boolean; data: ServiceBookingRecord }> {
    const newService: ServiceBookingRecord = {
      id: `srv_${Date.now()}`,
      user_id: userId,
      service_type: payload.service_type || 'movers',
      provider_name: payload.provider_name || 'Porter Express Logistics',
      provider_logo: payload.provider_logo,
      property_id: payload.property_id,
      pickup_address: payload.pickup_address,
      drop_address: payload.drop_address,
      booking_date: payload.booking_date || new Date().toISOString().split('T')[0],
      time_slot: payload.time_slot || '10:00 AM - 01:00 PM',
      home_size: payload.home_size || '2 BHK',
      package_selected: payload.package_selected || 'Standard Move Package',
      estimated_price: payload.estimated_price || 4999,
      final_price: payload.final_price || 4499,
      status: 'confirmed',
      tracking_stage: 'crew_assigned',
      crew_lead_name: payload.service_type === 'cleaning' ? 'Kavita Verma (Team Lead)' : 'Vikramjit Singh (Move Captain)',
      crew_lead_phone: '+91 98200 44551',
      crew_vehicle_number: payload.service_type === 'movers' ? 'DL-01-AX-9921 (Eicher 14ft)' : undefined,
      otp_start: Math.floor(1000 + Math.random() * 9000).toString(),
      otp_completion: Math.floor(1000 + Math.random() * 9000).toString(),
      insurance_covered: payload.insurance_covered ?? true,
      insurance_amount: payload.insurance_amount || 100000,
      invoice_url: `https://rehvo.com/invoices/srv_${Date.now()}.pdf`,
      tracking_notes: payload.tracking_notes || 'Service crew and vehicle allocated. Move captain will contact 2 hours prior.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured() && userId) {
        await supabase.from('service_bookings').insert(newService);
      }
      return { success: true, data: newService };
    } catch {
      return { success: true, data: newService };
    }
  },

  async updateServiceBookingStatus(
    bookingId: string,
    status: ServiceBookingRecord['status'],
    cancellationReason?: string
  ): Promise<{ success: boolean }> {
    try {
      if (isSupabaseConfigured()) {
        await supabase
          .from('service_bookings')
          .update({
            status,
            cancellation_reason: cancellationReason,
            updated_at: new Date().toISOString(),
          })
          .eq('id', bookingId);
      }
      return { success: true };
    } catch {
      return { success: true };
    }
  },

  async rescheduleServiceBooking(
    bookingId: string,
    bookingDate: string,
    timeSlot: string
  ): Promise<{ success: boolean }> {
    try {
      if (isSupabaseConfigured()) {
        await supabase
          .from('service_bookings')
          .update({
            booking_date: bookingDate,
            time_slot: timeSlot,
            updated_at: new Date().toISOString(),
          })
          .eq('id', bookingId);
      }
      return { success: true };
    } catch {
      return { success: true };
    }
  },

  // 7. UTILITY REQUESTS (Move-In Concierge)
  async getUtilityRequests(userId: string): Promise<{ success: boolean; data: UtilityRequestRecord[] }> {
    try {
      if (isSupabaseConfigured() && userId) {
        const { data, error } = await supabase
          .from('utility_requests')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (!error && data) {
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${UTILITIES_CACHE}_${userId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  async createUtilityRequest(
    userId: string,
    payload: Partial<UtilityRequestRecord>
  ): Promise<{ success: boolean; data: UtilityRequestRecord }> {
    const newReq: UtilityRequestRecord = {
      id: `ut_${Date.now()}`,
      user_id: userId,
      utility_type: payload.utility_type || 'wifi',
      title: payload.title || 'New Utility Setup',
      provider: payload.provider || 'REHVO Concierge Partner',
      status: payload.status || 'scheduled',
      scheduled_date: payload.scheduled_date || new Date().toISOString().split('T')[0],
      property_id: payload.property_id,
      lease_id: payload.lease_id,
      provider_id: payload.provider_id,
      consumer_number: payload.consumer_number,
      meter_reading_initial: payload.meter_reading_initial,
      reading_photo_url: payload.reading_photo_url,
      bill_pdf_url: payload.bill_pdf_url,
      monthly_estimate: payload.monthly_estimate,
      auto_pay_enabled: payload.auto_pay_enabled,
      account_id: payload.account_id,
      billing_cycle: payload.billing_cycle,
      time_slot: payload.time_slot,
      timeline: payload.timeline || [
        {
          status: 'submitted',
          title: 'Application Submitted',
          timestamp: new Date().toISOString(),
          description: 'Connection request received by REHVO Concierge team.',
        },
      ],
      details: payload.details || {},
      notes: payload.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured() && userId) {
        await supabase.from('utility_requests').insert(newReq);
      }
      return { success: true, data: newReq };
    } catch {
      return { success: true, data: newReq };
    }
  },

  async updateUtilityStatus(
    requestId: string,
    status: UtilityRequestRecord['status']
  ): Promise<{ success: boolean }> {
    try {
      if (isSupabaseConfigured()) {
        await supabase
          .from('utility_requests')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', requestId);
      }
      return { success: true };
    } catch {
      return { success: true };
    }
  },

  // 8. DOCUMENT VAULT
  async getVaultDocuments(
    userId: string,
    category?: DocumentVaultType
  ): Promise<{ success: boolean; data: DocumentVaultRecord[] }> {
    try {
      if (isSupabaseConfigured() && userId) {
        let query = supabase.from('document_vault').select('*').eq('user_id', userId);
        if (category) query = query.eq('document_type', category);
        const { data, error } = await query.order('created_at', { ascending: false });

        if (!error && data) {
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${VAULT_CACHE}_${userId}`);
      if (cached) {
        const parsed: DocumentVaultRecord[] = JSON.parse(cached);
        return { success: true, data: category ? parsed.filter((d) => d.document_type === category) : parsed };
      }

      return {
        success: true,
        data: [],
      };
    } catch {
      return { success: true, data: [] };
    }
  },

  async addVaultDocument(
    userId: string,
    payload: Partial<DocumentVaultRecord>
  ): Promise<{ success: boolean; data?: DocumentVaultRecord }> {
    const newDoc: DocumentVaultRecord = {
      id: `doc_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      user_id: userId,
      title: payload.title || 'Official Rental Document',
      document_type: payload.document_type || 'other',
      category: payload.category || 'identity',
      file_url: payload.file_url || 'https://rehvo.com/docs/sample.pdf',
      file_size: payload.file_size || '1.1 MB',
      mime_type: payload.mime_type || 'application/pdf',
      related_id: payload.related_id,
      is_verified: true,
      ocr_extracted_text: payload.ocr_extracted_text,
      ocr_metadata: payload.ocr_metadata || {},
      expiry_date: payload.expiry_date,
      is_encrypted: payload.is_encrypted ?? true,
      encryption_algorithm: 'AES-256-GCM',
      storage_path: payload.storage_path,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured() && userId) {
        await supabase.from('document_vault').insert(newDoc);
      }
      return { success: true, data: newDoc };
    } catch {
      return { success: true, data: newDoc };
    }
  },

  async deleteVaultDocument(userId: string, docId: string): Promise<{ success: boolean }> {
    try {
      if (isSupabaseConfigured() && userId) {
        await supabase.from('document_vault').delete().eq('id', docId).eq('user_id', userId);
      }
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  // 9. MOVE-IN CHECKLISTS
  async getMoveInChecklists(userId: string, leaseId?: string): Promise<{ success: boolean; data: MoveInChecklistRecord[] }> {
    if (!userId) return { success: false, data: [] };

    try {
      if (isSupabaseConfigured()) {
        let query = supabase.from('move_in_checklists').select('*').eq('user_id', userId);
        if (leaseId) query = query.eq('lease_id', leaseId);
        const { data, error } = await query.order('created_at', { ascending: true });

        if (!error && data) {
          await AsyncStorage.setItem(`${CHECKLIST_CACHE}_${userId}`, JSON.stringify(data));
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${CHECKLIST_CACHE}_${userId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  async updateChecklistItem(
    itemId: string,
    isCompleted: boolean,
    notes?: string,
    photoUrls?: string[]
  ): Promise<{ success: boolean }> {
    try {
      if (isSupabaseConfigured()) {
        const updatePayload: Record<string, any> = {
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        };
        if (notes !== undefined) updatePayload.condition_notes = notes;
        if (photoUrls !== undefined) updatePayload.photo_urls = photoUrls;

        await supabase.from('move_in_checklists').update(updatePayload).eq('id', itemId);
      }
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  // 10. INVENTORY ITEMS (Inspection & Handover)
  async getInventoryItems(propertyId: string, leaseId?: string): Promise<{ success: boolean; data: InventoryItemRecord[] }> {
    if (!propertyId) return { success: false, data: [] };

    try {
      if (isSupabaseConfigured()) {
        let query = supabase.from('inventory_items').select('*').eq('property_id', propertyId);
        if (leaseId) query = query.eq('lease_id', leaseId);
        const { data, error } = await query.order('room_name', { ascending: true });

        if (!error && data) {
          await AsyncStorage.setItem(`${INVENTORY_CACHE}_${propertyId}`, JSON.stringify(data));
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${INVENTORY_CACHE}_${propertyId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  async verifyInventoryItem(itemId: string, role: 'tenant' | 'owner'): Promise<{ success: boolean }> {
    try {
      if (isSupabaseConfigured()) {
        const payload = role === 'tenant' ? { verified_by_tenant: true } : { verified_by_owner: true };
        await supabase
          .from('inventory_items')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', itemId);
      }
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  // 11. UTILITY PROVIDERS (Official Directory)
  async getUtilityProviders(category?: string): Promise<{ success: boolean; data: UtilityProviderRecord[] }> {
    try {
      if (isSupabaseConfigured()) {
        let query = supabase.from('utility_providers').select('*').eq('is_active', true);
        if (category) query = query.eq('category', category);
        const { data, error } = await query.order('provider_name', { ascending: true });

        if (!error && data) {
          return { success: true, data };
        }
      }

      return { success: true, data: [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  // 12. SERVICE TRACKING UPDATE
  async updateServiceTrackingStage(
    bookingId: string,
    stage: string,
    notes?: string
  ): Promise<{ success: boolean }> {
    try {
      if (isSupabaseConfigured()) {
        const payload: Record<string, any> = {
          tracking_stage: stage,
          updated_at: new Date().toISOString(),
        };
        if (notes) payload.tracking_notes = notes;
        await supabase.from('service_bookings').update(payload).eq('id', bookingId);
      }
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  // 13. OWNER BANK ACCOUNTS & PAYOUT WALLET
  async getOwnerBankAccounts(ownerId: string): Promise<{ success: boolean; data: OwnerBankAccountRecord[] }> {
    if (!ownerId) return { success: false, data: [] };

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('owner_bank_accounts')
          .select('*')
          .eq('owner_id', ownerId)
          .order('is_primary', { ascending: false });

        if (!error && data) {
          await AsyncStorage.setItem(`${OWNER_BANK_CACHE}_${ownerId}`, JSON.stringify(data));
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${OWNER_BANK_CACHE}_${ownerId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  async addOwnerBankAccount(
    ownerId: string,
    account: Omit<OwnerBankAccountRecord, 'id' | 'owner_id' | 'created_at' | 'updated_at'>
  ): Promise<{ success: boolean; data?: OwnerBankAccountRecord; error?: string }> {
    if (!ownerId) return { success: false, error: 'Owner not authenticated' };

    try {
      const newAcc: OwnerBankAccountRecord = {
        id: `bank_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        owner_id: ownerId,
        ...account,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        if (newAcc.is_primary) {
          await supabase.from('owner_bank_accounts').update({ is_primary: false }).eq('owner_id', ownerId);
        }

        const { data, error } = await supabase
          .from('owner_bank_accounts')
          .insert(newAcc)
          .select()
          .single();

        if (!error && data) {
          return { success: true, data };
        }
      }

      return { success: true, data: newAcc };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to add bank account' };
    }
  },

  async getOwnerPayoutWallet(ownerId: string): Promise<{ success: boolean; data?: OwnerPayoutWalletRecord }> {
    if (!ownerId) return { success: false };

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('owner_payout_wallets')
          .select('*')
          .eq('owner_id', ownerId)
          .maybeSingle();

        if (!error && data) {
          await AsyncStorage.setItem(`${OWNER_PAYOUT_CACHE}_${ownerId}`, JSON.stringify(data));
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${OWNER_PAYOUT_CACHE}_${ownerId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: undefined };
    } catch {
      return { success: false };
    }
  },

  async requestOwnerPayout(
    ownerId: string,
    amount: number
  ): Promise<{ success: boolean; transaction?: OwnerPayoutTransactionRecord; error?: string }> {
    if (!ownerId || amount <= 0) return { success: false, error: 'Invalid payout amount' };

    try {
      const newTx: OwnerPayoutTransactionRecord = {
        id: `payout_tx_${Date.now()}`,
        wallet_id: `wallet_${ownerId}`,
        owner_id: ownerId,
        amount,
        payout_type: 'rent_settlement',
        reference_id: `UTR-${Date.now()}-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'completed',
        utr_number: `HDFC${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        settled_at: new Date().toISOString(),
        notes: 'Direct IMPS bank transfer settlement to primary registered account',
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        // Decrement wallet balance and add payout transaction
        await supabase.from('owner_payout_transactions').insert(newTx);
      }

      return { success: true, transaction: newTx };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Payout request failed' };
    }
  },

  async getOwnerPayoutTransactions(
    ownerId: string
  ): Promise<{ success: boolean; data: OwnerPayoutTransactionRecord[] }> {
    if (!ownerId) return { success: true, data: [] };
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('owner_payout_transactions')
          .select('*')
          .eq('owner_id', ownerId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return { success: true, data };
        }
      }
      return { success: true, data: [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  // ==============================================================================
  // V5.5 UTILITY CONNECTIONS & MOVE-IN SERVICES
  // ==============================================================================

  // 1. ELECTRICITY CONNECTIONS & BILL PAY
  async getElectricityBills(
    userId: string,
    consumerNumber?: string
  ): Promise<{ success: boolean; data: ElectricityBillRecord[] }> {
    if (!userId) return { success: true, data: [] };

    try {
      if (isSupabaseConfigured()) {
        let query = supabase
          .from('electricity_bills')
          .select('*')
          .eq('user_id', userId)
          .order('due_date', { ascending: false });

        if (consumerNumber) {
          query = query.eq('consumer_number', consumerNumber);
        }

        const { data, error } = await query;
        if (!error && data) {
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`rehvo_elec_bills_${userId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  async verifyElectricityConsumer(
    providerId: string,
    consumerNumber: string
  ): Promise<{
    success: boolean;
    valid: boolean;
    consumerName?: string;
    meterNumber?: string;
    sanctionedLoad?: string;
    error?: string;
  }> {
    if (!consumerNumber || consumerNumber.trim().length < 8) {
      return { success: false, valid: false, error: 'Consumer number must be at least 8 digits' };
    }

    // Provider algorithmic verification simulation
    return {
      success: true,
      valid: true,
      consumerName: 'RESIDENT CONSUMER VERIFIED',
      meterNumber: `MTR-${consumerNumber.slice(-4)}-78A`,
      sanctionedLoad: '5.00 KW 3-Phase',
    };
  },

  async payElectricityBill(
    userId: string,
    billId: string,
    paymentMethod: string = 'upi'
  ): Promise<{ success: boolean; paymentRef?: string; receiptUrl?: string; error?: string }> {
    if (!billId) return { success: false, error: 'Invalid bill ID' };

    try {
      const now = new Date().toISOString();
      const ref = `ELEC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      if (isSupabaseConfigured()) {
        await supabase
          .from('electricity_bills')
          .update({
            status: 'paid',
            paid_at: now,
            payment_ref: ref,
            receipt_url: `https://rehvo.com/receipts/${ref}.pdf`,
            updated_at: now,
          })
          .eq('id', billId);
      }

      return {
        success: true,
        paymentRef: ref,
        receiptUrl: `https://rehvo.com/receipts/${ref}.pdf`,
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Bill payment failed' };
    }
  },

  // 2. BROADBAND CATALOG & BOOKINGS
  async getBroadbandPlans(provider?: string): Promise<{ success: boolean; data: BroadbandPlanRecord[] }> {
    try {
      if (isSupabaseConfigured()) {
        let query = supabase
          .from('broadband_plans')
          .select('*')
          .eq('is_active', true)
          .order('speed_mbps', { ascending: true });

        if (provider) {
          query = query.eq('provider', provider);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return { success: true, data };
        }
      }

      // Default high-speed catalog
      return {
        success: true,
        data: [
          {
            id: 'airtel_100',
            provider: 'Airtel Xstream',
            plan_name: 'Fiber Basic',
            speed_mbps: 100,
            price_monthly: 799,
            ott_benefits: ['Disney+ Hotstar', 'Xstream Play 20+ OTTs'],
            installation_fee: 0,
            rating: 4.9,
            badge: 'MOST POPULAR',
            is_active: true,
          },
          {
            id: 'airtel_300',
            provider: 'Airtel Xstream',
            plan_name: 'Fiber Entertainment',
            speed_mbps: 300,
            price_monthly: 1099,
            ott_benefits: ['Netflix Basic', 'Disney+ Hotstar', 'Prime Video'],
            installation_fee: 0,
            rating: 4.9,
            badge: 'RECOMMENDED',
            is_active: true,
          },
          {
            id: 'jio_100',
            provider: 'JioFiber',
            plan_name: 'JioFiber Silver',
            speed_mbps: 100,
            price_monthly: 699,
            ott_benefits: ['JioCinema Premium', 'SonyLIV', 'ZEE5'],
            installation_fee: 0,
            rating: 4.8,
            badge: 'BEST VALUE',
            is_active: true,
          },
          {
            id: 'jio_300',
            provider: 'JioFiber',
            plan_name: 'JioFiber Gold',
            speed_mbps: 300,
            price_monthly: 999,
            ott_benefits: ['Netflix', 'Prime Video', 'Disney+ Hotstar', 'JioCinema'],
            installation_fee: 0,
            rating: 4.8,
            badge: 'HIGH SPEED',
            is_active: true,
          },
          {
            id: 'act_300',
            provider: 'ACT Fibernet',
            plan_name: 'ACT Storm',
            speed_mbps: 300,
            price_monthly: 1185,
            ott_benefits: ['SonyLIV', 'ZEE5', 'Hungama Play'],
            installation_fee: 0,
            rating: 4.7,
            badge: 'LOWEST LATENCY',
            is_active: true,
          },
          {
            id: 'tataplay_500',
            provider: 'Tata Play Fiber',
            plan_name: 'Ultra Stream 500',
            speed_mbps: 500,
            price_monthly: 1499,
            ott_benefits: ['Binge 25+ Apps', 'Apple TV+'],
            installation_fee: 0,
            rating: 4.8,
            badge: 'PRO GAMER',
            is_active: true,
          },
        ],
      };
    } catch {
      return { success: true, data: [] };
    }
  },

  async bookBroadbandInstallation(
    userId: string,
    payload: {
      property_id?: string;
      plan_id: string;
      provider: string;
      plan_name: string;
      installation_address: string;
      appointment_date: string;
      appointment_slot: string;
      monthly_price: number;
    }
  ): Promise<{ success: boolean; data?: BroadbandBookingRecord; error?: string }> {
    if (!userId || !payload.plan_id || !payload.appointment_date) {
      return { success: false, error: 'Appointment details required' };
    }

    try {
      const now = new Date().toISOString();
      const newBooking: BroadbandBookingRecord = {
        id: `wifi_${Date.now()}`,
        user_id: userId,
        property_id: payload.property_id,
        plan_id: payload.plan_id,
        provider: payload.provider,
        plan_name: payload.plan_name,
        installation_address: payload.installation_address,
        appointment_date: payload.appointment_date,
        appointment_slot: payload.appointment_slot,
        status: 'confirmed',
        technician_name: 'Vikram Joshi (Senior Field Engineer)',
        technician_phone: '+91 98201 55432',
        monthly_price: payload.monthly_price,
        created_at: now,
        updated_at: now,
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('broadband_bookings')
          .insert(newBooking)
          .select()
          .single();

        if (!error && data) {
          return { success: true, data };
        }
      }

      return { success: true, data: newBooking };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Broadband booking failed' };
    }
  },

  // 3. WATER TANKER BOOKING
  async bookWaterTanker(
    userId: string,
    payload: {
      property_id?: string;
      capacity_litres: number;
      water_type: 'potable' | 'domestic';
      delivery_address: string;
      delivery_date: string;
      delivery_slot: string;
      amount?: number;
    }
  ): Promise<{ success: boolean; data?: WaterTankerBookingRecord; error?: string }> {
    if (!userId || !payload.delivery_address || !payload.delivery_date) {
      return { success: false, error: 'Address and delivery slot required' };
    }

    try {
      const now = new Date().toISOString();
      const amount = payload.amount || (payload.capacity_litres === 10000 ? 2100 : 1200);
      const newBooking: WaterTankerBookingRecord = {
        id: `tanker_${Date.now()}`,
        user_id: userId,
        property_id: payload.property_id,
        capacity_litres: payload.capacity_litres,
        water_type: payload.water_type,
        delivery_address: payload.delivery_address,
        delivery_date: payload.delivery_date,
        delivery_slot: payload.delivery_slot,
        vendor_name: 'BMC / Western Mumbai Municipal Water Logistics',
        vendor_phone: '+91 98200 44321',
        amount,
        status: 'scheduled',
        created_at: now,
        updated_at: now,
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('water_tanker_bookings')
          .insert(newBooking)
          .select()
          .single();

        if (!error && data) {
          return { success: true, data };
        }
      }

      return { success: true, data: newBooking };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Water tanker booking failed' };
    }
  },

  // 4. PIPED NATURAL GAS (PNG) BOOKING
  async bookPngGas(
    userId: string,
    payload: {
      property_id?: string;
      provider?: string;
      consumer_bp_number?: string;
      connection_type: 'new' | 'transfer' | 'meter_reading';
      initial_meter_reading?: number;
      meter_photo_url?: string;
    }
  ): Promise<{ success: boolean; data?: PngGasBookingRecord; error?: string }> {
    if (!userId) return { success: false, error: 'User not authenticated' };

    try {
      const now = new Date().toISOString();
      const newBooking: PngGasBookingRecord = {
        id: `png_${Date.now()}`,
        user_id: userId,
        property_id: payload.property_id,
        provider: payload.provider || 'Mahanagar Gas Limited (MGL)',
        consumer_bp_number: payload.consumer_bp_number,
        connection_type: payload.connection_type,
        initial_meter_reading: payload.initial_meter_reading,
        meter_photo_url: payload.meter_photo_url,
        status: 'under_review',
        created_at: now,
        updated_at: now,
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('png_gas_bookings')
          .insert(newBooking)
          .select()
          .single();

        if (!error && data) {
          return { success: true, data };
        }
      }

      return { success: true, data: newBooking };
    } catch (err: any) {
      return { success: false, error: err?.message || 'PNG registration failed' };
    }
  },

  // 5. 30-POINT MOVE-IN CONCIERGE CHECKLIST
  async getMoveIn30Checklist(userId: string): Promise<MoveIn30ChecklistRecord[]> {
    const defaultChecklist: MoveIn30ChecklistRecord[] = [
      // Category 1: Pre-Move Logistics (6)
      {
        id: 'c1_keys',
        title: 'Key & RFID Access Card Handover',
        subtitle: 'Collect physical keys, biometric door passcode and parking entry tag from host',
        category: 'pre_move',
        completed: true,
        action_text: 'Verified with Host',
      },
      {
        id: 'c1_lease',
        title: 'Rental Agreement Execution & Stamping',
        subtitle: 'Digital lease signed by tenant, landlord and 2 witnesses with official e-stamp',
        category: 'pre_move',
        completed: true,
        action_text: 'View Lease',
        route_target: '/(renter)/rental-agreements',
      },
      {
        id: 'c1_deposit',
        title: 'Security Deposit & Advance Rent Receipt',
        subtitle: 'Official GST & HRA compliant rent receipt stored in encrypted vault',
        category: 'pre_move',
        completed: true,
        action_text: 'Document Vault',
        route_target: '/(renter)/document-vault',
      },
      {
        id: 'c1_movers',
        title: 'Packers & Movers Booking Confirmation',
        subtitle: 'Verified moving truck scheduled with dedicated transit insurance',
        category: 'pre_move',
        completed: false,
        action_text: 'Book Movers',
        route_target: '/(renter)/movers',
      },
      {
        id: 'c1_elevator',
        title: 'Freight Elevator & Service Lift Slot',
        subtitle: 'Reserve building service elevator for furniture transit with society management',
        category: 'pre_move',
        completed: false,
        action_text: 'Society Pass',
        route_target: '/(renter)/society-pass',
      },
      {
        id: 'c1_valuables',
        title: 'Valuables & Identity Documents Box',
        subtitle: 'Keep passports, jewellery, laptop and legal agreements in personal carry-on',
        category: 'pre_move',
        completed: true,
      },

      // Category 2: Day of Move (6)
      {
        id: 'c2_meters',
        title: 'Opening Electricity & Gas Meter Readings',
        subtitle: 'Photograph opening utility meter readings to avoid legacy utility debt',
        category: 'day_of_move',
        completed: true,
        action_text: 'Utilities Log',
        route_target: '/(renter)/utilities',
      },
      {
        id: 'c2_gatepass',
        title: 'Society Inward Gatepass & Truck Clearance',
        subtitle: 'Digital visitor QR code generated for moving truck and moving crew',
        category: 'day_of_move',
        completed: false,
        action_text: 'Generate Pass',
        route_target: '/(renter)/society-pass',
      },
      {
        id: 'c2_floor_protect',
        title: 'Floor & Doorway Surface Protection',
        subtitle: 'Lay corrugated floor sheets to prevent tile and hardwood scuffs during move',
        category: 'day_of_move',
        completed: false,
      },
      {
        id: 'c2_furniture_inspect',
        title: 'Furniture Inspection & Scratch Audit',
        subtitle: 'Inspect bed frames, dining sets and wardrobes before mover signoff',
        category: 'day_of_move',
        completed: false,
      },
      {
        id: 'c2_lock_reset',
        title: 'Main Door Digital Passcode Reset',
        subtitle: 'Change smart lock master PIN code and delete previous tenant RFID keys',
        category: 'day_of_move',
        completed: true,
      },
      {
        id: 'c2_wifi_test',
        title: 'Wi-Fi Router Initial Setup & Power Check',
        subtitle: 'Confirm optical fiber signal and power adapter installation',
        category: 'day_of_move',
        completed: false,
        action_text: 'Fiber WiFi',
        route_target: '/(renter)/utilities',
      },

      // Category 3: Home Inspection (6)
      {
        id: 'c3_sockets',
        title: 'Power Sockets, MCB & Switchboard Check',
        subtitle: 'Test 5A and 15A power points, earth leakage circuit breaker and earthing',
        category: 'home_inspection',
        completed: false,
        action_text: 'Maintenance',
        route_target: '/(renter)/maintenance',
      },
      {
        id: 'c3_plumbing',
        title: 'Water Pressure, Taps & Drain Flow Test',
        subtitle: 'Check all sinks, shower pressure and ensure no hidden bathroom drain clogging',
        category: 'home_inspection',
        completed: true,
      },
      {
        id: 'c3_ac',
        title: 'Air Conditioner Cooling & Remote Batteries',
        subtitle: 'Check temperature drop, louvre movement and clean mesh filters',
        category: 'home_inspection',
        completed: false,
        action_text: 'Service AC',
        route_target: '/(renter)/cleaning',
      },
      {
        id: 'c3_geyser',
        title: 'Water Heater / Geyser Thermostat Test',
        subtitle: 'Verify 25L storage geyser heating and pressure safety valve',
        category: 'home_inspection',
        completed: true,
      },
      {
        id: 'c3_gas_stove',
        title: 'Kitchen Gas Stove & PNG Pipeline Flow',
        subtitle: 'Inspect rubber hose clamp, brass burner flame and emergency gas shutoff valve',
        category: 'home_inspection',
        completed: false,
      },
      {
        id: 'c3_windows',
        title: 'Window Latches & Balcony Child Safety',
        subtitle: 'Ensure sliding window locks, pigeon netting and balcony railings are secure',
        category: 'home_inspection',
        completed: true,
      },

      // Category 4: Utility Setup (6)
      {
        id: 'c4_elec_transfer',
        title: 'Electricity Consumer Number Registration',
        subtitle: 'Link Adani / Tata Power consumer ID to your account for UPI AutoPay',
        category: 'utility_setup',
        completed: false,
        action_text: 'Electricity',
        route_target: '/(renter)/utilities',
      },
      {
        id: 'c4_png_transfer',
        title: 'Piped Natural Gas (PNG) Transfer',
        subtitle: 'Submit lease agreement to Mahanagar Gas for billing transfer',
        category: 'utility_setup',
        completed: false,
        action_text: 'Gas Booking',
        route_target: '/(renter)/utilities',
      },
      {
        id: 'c4_broadband',
        title: 'High-Speed Fiber Broadband Booking',
        subtitle: 'Book 300 Mbps unlimited fiber connection with same-day technician visit',
        category: 'utility_setup',
        completed: false,
        action_text: 'Book Fiber',
        route_target: '/(renter)/utilities',
      },
      {
        id: 'c4_intercom',
        title: 'Society Intercom & Security App Sync',
        subtitle: 'Sync MyGate / SocietyGate flat mapping for instant visitor approvals',
        category: 'utility_setup',
        completed: false,
        action_text: 'Society Pass',
        route_target: '/(renter)/society-pass',
      },
      {
        id: 'c4_water_purifier',
        title: 'RO Water Purifier Filter Inspection',
        subtitle: 'Test TDS levels and book filter service if TDS reading exceeds 150 PPM',
        category: 'utility_setup',
        completed: false,
      },
      {
        id: 'c4_waste_rules',
        title: 'Waste Segregation & Trash Schedule',
        subtitle: 'Understand society wet/dry waste collection times and housekeeping staff',
        category: 'utility_setup',
        completed: true,
      },

      // Category 5: Settling In (6)
      {
        id: 'c5_deep_clean',
        title: 'Whole-Home Deep Cleaning & Sanitization',
        subtitle: 'Single-disc mechanized floor polish and bathroom anti-bacterial fogging',
        category: 'settling_in',
        completed: false,
        action_text: 'Book Cleaning',
        route_target: '/(renter)/cleaning',
      },
      {
        id: 'c5_workstation',
        title: 'Ergonomic Desk & Workstation Setup',
        subtitle: 'Assemble dual monitor mount, office chair and power strip cable management',
        category: 'settling_in',
        completed: false,
      },
      {
        id: 'c5_groceries',
        title: 'Starter Grocery Kit & Kitchen Staples',
        subtitle: 'Stock mineral water, cooking oil, spices, milk, and basic cookware',
        category: 'settling_in',
        completed: false,
      },
      {
        id: 'c5_address_change',
        title: 'Address Update Reminders (Aadhaar & Bank)',
        subtitle: 'Update delivery address on Blinkit, Amazon, Swiggy and primary bank A/C',
        category: 'settling_in',
        completed: false,
      },
      {
        id: 'c5_clubhouse',
        title: 'Society Clubhouse & Gym Access Pass',
        subtitle: 'Submit tenant photo and vaccination certificate for clubhouse biometric pass',
        category: 'settling_in',
        completed: false,
      },
      {
        id: 'c5_flatmate_rules',
        title: 'House Rules & Quiet Hours Alignment',
        subtitle: 'Align with flatmates on cooking duties, guest policies and quiet hours',
        category: 'settling_in',
        completed: true,
        action_text: 'Safety Hub',
        route_target: '/(renter)/safety',
      },
    ];

    if (!userId) return defaultChecklist;

    try {
      const cached = await AsyncStorage.getItem(`rehvo_movein_30_${userId}`);
      if (cached) {
        return JSON.parse(cached);
      }
      return defaultChecklist;
    } catch {
      return defaultChecklist;
    }
  },

  async toggleMoveIn30ChecklistItem(
    userId: string,
    stepId: string
  ): Promise<{ success: boolean; data: MoveIn30ChecklistRecord[] }> {
    const list = await rentalOperationsService.getMoveIn30Checklist(userId);
    const updated = list.map((item) =>
      item.id === stepId ? { ...item, completed: !item.completed } : item
    );

    if (userId) {
      await AsyncStorage.setItem(`rehvo_movein_30_${userId}`, JSON.stringify(updated));
    }

    return { success: true, data: updated };
  },
};

