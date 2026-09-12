// ==============================================================================
// REHVO V5.4 — REWARDS & BRAND COUPONS SERVICE
// Live Supabase integration with CRED / CredPay luxury perks
// ==============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  RewardCampaignRecord,
  RewardRedemptionRecord,
  RewardCategoryType,
} from '../types';
import { walletService } from './wallet';

const CAMPAIGNS_CACHE = 'rehvo_campaigns_cache';
const MY_REDEMPTIONS_CACHE = 'rehvo_my_redemptions_cache';

export const rewardsService = {
  // 1. GET ACTIVE REWARD CAMPAIGNS
  async getCampaigns(category?: RewardCategoryType): Promise<{ success: boolean; data: RewardCampaignRecord[] }> {
    try {
      if (isSupabaseConfigured()) {
        let query = supabase
          .from('reward_campaigns')
          .select('*')
          .eq('is_active', true);

        if (category) {
          query = query.eq('category', category);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && data) {
          await AsyncStorage.setItem(CAMPAIGNS_CACHE, JSON.stringify(data));
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(CAMPAIGNS_CACHE);
      if (cached) {
        const parsed: RewardCampaignRecord[] = JSON.parse(cached);
        return {
          success: true,
          data: category ? parsed.filter((c) => c.category === category) : parsed,
        };
      }

      return { success: true, data: [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  // 2. REDEEM A REWARD WITH R-CASH POINTS
  async redeemReward(
    userId: string,
    campaignId: string
  ): Promise<{ success: boolean; redemption?: RewardRedemptionRecord; error?: string }> {
    if (!userId) return { success: false, error: 'User not authenticated' };

    try {
      let campaign: RewardCampaignRecord | null = null;

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('reward_campaigns')
          .select('*')
          .eq('id', campaignId)
          .single();

        if (error || !data) {
          return { success: false, error: 'Reward campaign not found' };
        }
        campaign = data;
      }

      if (!campaign) {
        return { success: false, error: 'Reward campaign unavailable' };
      }

      // Check wallet balance
      const walletRes = await walletService.getOrCreateWallet(userId);
      const currentBalance = walletRes.data?.balance ?? 0;
      if (currentBalance < campaign.required_points) {
        return {
          success: false,
          error: `Insufficient R-Cash balance. Need ₹${campaign.required_points}, have ₹${currentBalance}`,
        };
      }

      const promoCode = `${campaign.promo_code}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      const newRedemption: RewardRedemptionRecord = {
        id: `rdm_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        user_id: userId,
        campaign_id: campaignId,
        campaign: campaign,
        points_spent: campaign.required_points,
        promo_code: promoCode,
        status: 'active',
        redeemed_at: new Date().toISOString(),
        expires_at: campaign.expires_at || new Date(Date.now() + 60 * 86400000).toISOString(),
      };

      if (isSupabaseConfigured()) {
        await supabase.from('reward_redemptions').insert(newRedemption);

        // Deduct points from user wallet
        await walletService.addTransaction(userId, {
          title: `Claimed ${campaign.brand} Voucher`,
          description: `Spent ${campaign.required_points} R-Cash for ${campaign.title}`,
          amount: campaign.required_points,
          type: 'debit',
          category: 'reward_redemption',
          reference_id: newRedemption.id,
        });

        // Decrement stock
        await supabase
          .from('reward_campaigns')
          .update({ stock_count: Math.max(0, campaign.stock_count - 1) })
          .eq('id', campaignId);
      }

      return { success: true, redemption: newRedemption };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to redeem reward' };
    }
  },

  // 3. GET USER'S REDEEMED VOUCHERS
  async getUserRedemptions(userId: string): Promise<{ success: boolean; data: RewardRedemptionRecord[] }> {
    if (!userId) return { success: false, data: [] };

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('reward_redemptions')
          .select('*, campaign:reward_campaigns(*)')
          .eq('user_id', userId)
          .order('redeemed_at', { ascending: false });

        if (!error && data) {
          await AsyncStorage.setItem(`${MY_REDEMPTIONS_CACHE}_${userId}`, JSON.stringify(data));
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${MY_REDEMPTIONS_CACHE}_${userId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: [] };
    } catch {
      return { success: true, data: [] };
    }
  },
};
