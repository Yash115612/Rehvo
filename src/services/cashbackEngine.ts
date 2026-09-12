// ==============================================================================
// REHVO V5.4 — CASHBACK & SCRATCH CARD ENGINE
// CRED-inspired Gamified Rewards, Instant Wallet Credit & Realtime Sync
// ==============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ScratchCardRecord } from '../types';
import { walletService } from './wallet';

const SCRATCH_CARDS_CACHE = 'rehvo_scratch_cards_cache';

export const cashbackEngine = {
  // 1. GET ALL SCRATCH CARDS FOR USER
  async getUserScratchCards(userId: string): Promise<{ success: boolean; data: ScratchCardRecord[] }> {
    if (!userId) return { success: false, data: [] };

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('scratch_cards')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          await AsyncStorage.setItem(`${SCRATCH_CARDS_CACHE}_${userId}`, JSON.stringify(data));
          return { success: true, data };
        }
      }

      const cached = await AsyncStorage.getItem(`${SCRATCH_CARDS_CACHE}_${userId}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }

      return { success: true, data: [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  // 2. CREATE A SCRATCH CARD AFTER RENT PAYMENT OR EVENT
  async issueScratchCard(
    userId: string,
    eventRef: string,
    minReward: number = 25,
    maxReward: number = 500
  ): Promise<{ success: boolean; data?: ScratchCardRecord }> {
    if (!userId) return { success: false };

    try {
      // Pick a random reward in the range, skewed towards pleasant rounded amounts
      const rawReward = Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward;
      const roundedReward = Math.round(rawReward / 5) * 5 || minReward;

      const newCard: ScratchCardRecord = {
        id: `sc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        user_id: userId,
        title: 'Rent Cashback Mystery Card',
        subtitle: 'Scratch to reveal your REHVO R-Cash reward',
        min_reward: minReward,
        max_reward: maxReward,
        actual_reward: roundedReward,
        is_scratched: false,
        event_ref: eventRef,
        expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('scratch_cards')
          .insert(newCard)
          .select()
          .single();

        if (!error && data) {
          return { success: true, data };
        }
      }

      return { success: true, data: newCard };
    } catch {
      return { success: false };
    }
  },

  // 3. SCRATCH CARD REVEAL & INSTANT WALLET CREDIT
  async revealScratchCard(
    userId: string,
    cardId: string
  ): Promise<{ success: boolean; rewardAmount: number; error?: string }> {
    if (!userId || !cardId) return { success: false, rewardAmount: 0, error: 'Invalid parameters' };

    try {
      let rewardAmount = 50;

      if (isSupabaseConfigured()) {
        const { data: card, error: fetchErr } = await supabase
          .from('scratch_cards')
          .select('*')
          .eq('id', cardId)
          .eq('user_id', userId)
          .single();

        if (!fetchErr && card) {
          if (card.is_scratched) {
            return { success: true, rewardAmount: card.actual_reward };
          }

          rewardAmount = card.actual_reward;

          // Mark card as scratched
          await supabase
            .from('scratch_cards')
            .update({
              is_scratched: true,
              scratched_at: new Date().toISOString(),
            })
            .eq('id', cardId);
        }
      }

      // Credit wallet double-entry ledger with R-Cash
      await walletService.addTransaction(userId, {
        title: 'Mystery Rent Cashback',
        description: `Unlocked ₹${rewardAmount} R-Cash from scratch card`,
        amount: rewardAmount,
        type: 'credit',
        category: 'rent_cashback',
        reference_id: `SCRATCH-${cardId}`,
      });

      return { success: true, rewardAmount };
    } catch (err: any) {
      return { success: false, rewardAmount: 0, error: err?.message || 'Failed to reveal scratch card' };
    }
  },
};
