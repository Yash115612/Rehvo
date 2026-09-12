// ==============================================================================
// REHVO V5.4 — FINTECH RENT PAYMENT & AUTOPAY ENGINE
// Live Supabase integration with CRED RentPay quality
// ==============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  RentPaymentRecord,
  RentPaymentMethod,
  PaymentMethodRecord,
  AutoPayMandateRecord,
  AutoPayStatus,
  PaymentFailureRecord,
  LateFeeRuleRecord,
  SplitRentMember,
} from '../types';

const PAYMENT_METHODS_CACHE = 'rehvo_payment_methods_cache';
const AUTOPAY_CACHE = 'rehvo_autopay_cache';

export interface ProcessPaymentParams {
  userId: string;
  propertyId?: string;
  propertyName: string;
  locality: string;
  landlordName: string;
  landlordUpi?: string;
  amount: number;
  baseRent: number;
  maintenance?: number;
  platformFee?: number;
  discount?: number;
  paymentMethod: RentPaymentMethod;
  paymentMethodDetail?: string;
  dueDate?: string;
  splitRentEnabled?: boolean;
  splitWith?: SplitRentMember[];
  emiEligible?: boolean;
  emiMonths?: number;
  emiInterest?: number;
  autopayMandateId?: string;
  lateFeeApplied?: number;
}

export interface EmiOption {
  months: number;
  monthlyAmount: number;
  interestRate: number;
  totalInterest: number;
  totalPayable: number;
}

export const paymentsService = {
  // 1. PAYMENT METHODS (Saved UPI IDs, Cards)
  async getPaymentMethods(userId: string): Promise<{ success: boolean; data: PaymentMethodRecord[] }> {
    if (!userId) return { success: false, data: [] };

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', userId)
          .order('is_default', { ascending: false })
          .order('created_at', { ascending: false });

        if (!error && data) {
          await AsyncStorage.setItem(`${PAYMENT_METHODS_CACHE}_${userId}`, JSON.stringify(data));
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${PAYMENT_METHODS_CACHE}_${userId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  async addPaymentMethod(
    userId: string,
    method: Omit<PaymentMethodRecord, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<{ success: boolean; data?: PaymentMethodRecord; error?: string }> {
    if (!userId) return { success: false, error: 'User not authenticated' };

    try {
      const newMethod: PaymentMethodRecord = {
        id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        user_id: userId,
        ...method,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        // If this is default, reset other defaults
        if (newMethod.is_default) {
          await supabase
            .from('payment_methods')
            .update({ is_default: false })
            .eq('user_id', userId);
        }

        const { data, error } = await supabase
          .from('payment_methods')
          .insert(newMethod)
          .select()
          .single();

        if (!error && data) {
          return { success: true, data };
        }
      }

      return { success: true, data: newMethod };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to add payment method' };
    }
  },

  async setDefaultPaymentMethod(userId: string, methodId: string): Promise<{ success: boolean }> {
    try {
      if (isSupabaseConfigured() && userId) {
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', userId);

        await supabase
          .from('payment_methods')
          .update({ is_default: true, updated_at: new Date().toISOString() })
          .eq('id', methodId);
      }
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  async deletePaymentMethod(userId: string, methodId: string): Promise<{ success: boolean }> {
    try {
      if (isSupabaseConfigured() && userId) {
        await supabase.from('payment_methods').delete().eq('id', methodId).eq('user_id', userId);
      }
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  // 2. AUTOPAY MANDATES
  async getAutoPayMandate(userId: string, propertyId?: string): Promise<{ success: boolean; data?: AutoPayMandateRecord }> {
    if (!userId) return { success: false };

    try {
      if (isSupabaseConfigured()) {
        let query = supabase
          .from('autopay_mandates')
          .select('*')
          .eq('user_id', userId);

        if (propertyId) {
          query = query.eq('property_id', propertyId);
        }

        const { data, error } = await query.order('created_at', { ascending: false }).limit(1).maybeSingle();
        if (!error && data) {
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${AUTOPAY_CACHE}_${userId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: undefined };
    } catch {
      return { success: false };
    }
  },

  async createOrUpdateAutoPayMandate(
    userId: string,
    mandate: Partial<AutoPayMandateRecord>
  ): Promise<{ success: boolean; data?: AutoPayMandateRecord; error?: string }> {
    if (!userId) return { success: false, error: 'User not authenticated' };

    try {
      const payload: Partial<AutoPayMandateRecord> = {
        user_id: userId,
        mandate_ref: mandate.mandate_ref || `REHVO-MANDATE-${Date.now()}`,
        max_amount: mandate.max_amount || 50000,
        deduction_day: mandate.deduction_day || 1,
        frequency: mandate.frequency || 'monthly',
        status: mandate.status || 'active',
        next_deduction_date: mandate.next_deduction_date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        bank_mandate_id: mandate.bank_mandate_id || `NPCI-E-MANDATE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        updated_at: new Date().toISOString(),
      };

      if (mandate.property_id) payload.property_id = mandate.property_id;
      if (mandate.payment_method_id) payload.payment_method_id = mandate.payment_method_id;

      if (isSupabaseConfigured()) {
        if (mandate.id) {
          const { data, error } = await supabase
            .from('autopay_mandates')
            .update(payload)
            .eq('id', mandate.id)
            .select()
            .single();

          if (!error && data) {
            await AsyncStorage.setItem(`${AUTOPAY_CACHE}_${userId}`, JSON.stringify(data));
            return { success: true, data };
          }
        } else {
          const { data, error } = await supabase
            .from('autopay_mandates')
            .insert({ ...payload, created_at: new Date().toISOString() })
            .select()
            .single();

          if (!error && data) {
            await AsyncStorage.setItem(`${AUTOPAY_CACHE}_${userId}`, JSON.stringify(data));
            return { success: true, data };
          }
        }
      }

      const localResult: AutoPayMandateRecord = {
        id: mandate.id || `mandate_${Date.now()}`,
        user_id: userId,
        property_id: payload.property_id,
        payment_method_id: payload.payment_method_id,
        mandate_ref: payload.mandate_ref!,
        max_amount: payload.max_amount!,
        deduction_day: payload.deduction_day!,
        frequency: payload.frequency as any,
        status: payload.status as any,
        next_deduction_date: payload.next_deduction_date,
        bank_mandate_id: payload.bank_mandate_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await AsyncStorage.setItem(`${AUTOPAY_CACHE}_${userId}`, JSON.stringify(localResult));
      return { success: true, data: localResult };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update AutoPay mandate' };
    }
  },

  async updateAutoPayStatus(mandateId: string, status: AutoPayStatus): Promise<{ success: boolean }> {
    try {
      if (isSupabaseConfigured()) {
        await supabase
          .from('autopay_mandates')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', mandateId);
      }
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  // 3. PAYMENT EXECUTION & LIFECYCLE
  async processPayment(params: ProcessPaymentParams): Promise<{
    success: boolean;
    payment?: RentPaymentRecord;
    cashbackEarned: number;
    error?: string;
  }> {
    try {
      // Calculate 1% CRED-style cashback (capped at ₹500)
      const cashbackEarned = Math.min(500, Math.round(params.amount * 0.01));
      const txRef = `REHVO-RENT-${Date.now()}-${Math.floor(Math.random() * 8999 + 1000)}`;

      const newPayment: RentPaymentRecord = {
        id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        user_id: params.userId,
        property_id: params.propertyId,
        property_name: params.propertyName,
        locality: params.locality,
        landlord_name: params.landlordName,
        landlord_upi: params.landlordUpi,
        amount: params.amount,
        base_rent: params.baseRent,
        maintenance: params.maintenance || 0,
        platform_fee: params.platformFee || 0,
        discount: params.discount || 0,
        payment_method: params.paymentMethod,
        payment_method_detail: params.paymentMethodDetail || `${params.paymentMethod.toUpperCase()} Direct`,
        status: 'completed',
        transaction_ref: txRef,
        cashback_earned: cashbackEarned,
        due_date: params.dueDate,
        paid_at: new Date().toISOString(),
        split_rent_enabled: params.splitRentEnabled || false,
        split_with: params.splitWith || [],
        emi_eligible: params.emiEligible || false,
        emi_months: params.emiMonths || 0,
        emi_interest: params.emiInterest || 0,
        autopay_mandate_id: params.autopayMandateId,
        late_fee_applied: params.lateFeeApplied || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured() && params.userId) {
        const { data, error } = await supabase
          .from('rent_payments')
          .insert(newPayment)
          .select()
          .single();

        if (!error && data) {
          return { success: true, payment: data, cashbackEarned };
        }
      }

      return { success: true, payment: newPayment, cashbackEarned };
    } catch (err: any) {
      return { success: false, cashbackEarned: 0, error: err?.message || 'Payment failed' };
    }
  },

  // 4. LATE FEE CALCULATOR
  async getLateFeeRule(propertyId?: string): Promise<LateFeeRuleRecord | null> {
    try {
      if (isSupabaseConfigured() && propertyId) {
        const { data } = await supabase
          .from('late_fee_rules')
          .select('*')
          .eq('property_id', propertyId)
          .eq('is_active', true)
          .maybeSingle();

        if (data) return data;
      }

      return {
        id: 'default_rule',
        property_id: propertyId || 'general',
        grace_period_days: 5,
        daily_late_fee: 150,
        max_late_fee: 3000,
        interest_rate_percent: 0,
        is_active: true,
        created_at: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  },

  calculateLateFee(dueDateStr: string, rule?: LateFeeRuleRecord | null): { daysLate: number; fee: number; isLate: boolean } {
    if (!dueDateStr) return { daysLate: 0, fee: 0, isLate: false };

    const due = new Date(dueDateStr).getTime();
    const now = Date.now();
    const diffDays = Math.floor((now - due) / (1000 * 60 * 60 * 24));

    const graceDays = rule?.grace_period_days ?? 5;
    const dailyFee = rule?.daily_late_fee ?? 150;
    const maxFee = rule?.max_late_fee ?? 3000;

    if (diffDays <= graceDays) {
      return { daysLate: Math.max(0, diffDays), fee: 0, isLate: false };
    }

    const penalDays = diffDays - graceDays;
    const fee = Math.min(maxFee, penalDays * dailyFee);
    return { daysLate: diffDays, fee, isLate: true };
  },

  // 5. EMI OPTIONS ENGINE
  calculateEmiOptions(amount: number): EmiOption[] {
    const plans = [
      { months: 3, annualRate: 12 },
      { months: 6, annualRate: 13.5 },
      { months: 9, annualRate: 14 },
      { months: 12, annualRate: 15 },
    ];

    return plans.map((p) => {
      const monthlyRate = p.annualRate / 12 / 100;
      // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
      const factor = Math.pow(1 + monthlyRate, p.months);
      const monthlyAmount = Math.round((amount * monthlyRate * factor) / (factor - 1));
      const totalPayable = monthlyAmount * p.months;
      const totalInterest = totalPayable - amount;

      return {
        months: p.months,
        monthlyAmount,
        interestRate: p.annualRate,
        totalInterest,
        totalPayable,
      };
    });
  },

  // 6. RECORD FAILURE DIAGNOSTICS & RETRY
  async recordFailure(userId: string, failure: Omit<PaymentFailureRecord, 'id' | 'user_id' | 'created_at'>): Promise<void> {
    try {
      if (isSupabaseConfigured() && userId) {
        await supabase.from('payment_failures').insert({
          id: `pf_${Date.now()}`,
          user_id: userId,
          ...failure,
          created_at: new Date().toISOString(),
        });
      }
    } catch {
      // diagnostic logging fallback
    }
  },
};
