-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 029_wallet_rewards.sql
-- Description: Owner Payout Engine, Bank Accounts & Gamified Scratch Cards
--              - Owner Bank Accounts (Penny-drop verification, UPI/IMPS)
--              - Owner Payout Wallets & Settlements Ledger
--              - Gamified Scratch Cards for Renter Cashback
--              - RLS Policies & Realtime publication
-- ==============================================================================

-- 1. OWNER BANK ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.owner_bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    account_holder_name TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    account_number_masked TEXT NOT NULL,
    ifsc_code TEXT NOT NULL,
    account_type TEXT NOT NULL DEFAULT 'savings' CHECK (account_type IN ('savings', 'current')),
    upi_id TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    verification_penny_drop_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_penny_drop_status IN ('pending', 'verified', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_owner_bank_accounts_owner ON public.owner_bank_accounts(owner_id);

-- 2. OWNER PAYOUT WALLETS TABLE (One payout wallet per landlord)
CREATE TABLE IF NOT EXISTS public.owner_payout_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    current_balance NUMERIC NOT NULL DEFAULT 0 CHECK (current_balance >= 0),
    pending_settlement NUMERIC NOT NULL DEFAULT 0 CHECK (pending_settlement >= 0),
    lifetime_collected NUMERIC NOT NULL DEFAULT 0 CHECK (lifetime_collected >= 0),
    lifetime_paid_out NUMERIC NOT NULL DEFAULT 0 CHECK (lifetime_paid_out >= 0),
    last_payout_date TIMESTAMPTZ,
    auto_payout_frequency TEXT NOT NULL DEFAULT 'instant' CHECK (auto_payout_frequency IN ('instant', 'daily', 'weekly', 'monthly')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_owner_payout_wallets_owner ON public.owner_payout_wallets(owner_id);

-- 3. OWNER PAYOUT TRANSACTIONS (Settlements Ledger)
CREATE TABLE IF NOT EXISTS public.owner_payout_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES public.owner_payout_wallets(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    payout_type TEXT NOT NULL CHECK (payout_type IN ('rent_settlement', 'deposit_settlement', 'maintenance_settlement', 'bonus_credit')),
    reference_id TEXT UNIQUE NOT NULL,
    bank_account_id UUID REFERENCES public.owner_bank_accounts(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('initiated', 'processing', 'completed', 'failed', 'reversed')),
    utr_number TEXT,
    settled_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_owner_payout_tx_owner ON public.owner_payout_transactions(owner_id, settled_at DESC);

-- 4. SCRATCH CARDS TABLE (Gamified Renter Rewards)
CREATE TABLE IF NOT EXISTS public.scratch_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.reward_campaigns(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL DEFAULT 'Scratch to reveal your cashback',
    min_reward NUMERIC NOT NULL DEFAULT 20,
    max_reward NUMERIC NOT NULL DEFAULT 500,
    actual_reward NUMERIC NOT NULL DEFAULT 50,
    is_scratched BOOLEAN NOT NULL DEFAULT FALSE,
    scratched_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    event_ref TEXT, -- e.g. 'rent_paid_sep_2026'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_scratch_cards_user ON public.scratch_cards(user_id, is_scratched);

-- 5. ROW LEVEL SECURITY
ALTER TABLE public.owner_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_payout_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_payout_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scratch_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners can manage bank accounts" ON public.owner_bank_accounts;
CREATE POLICY "Owners can manage bank accounts" ON public.owner_bank_accounts
    FOR ALL USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can view their payout wallet" ON public.owner_payout_wallets;
CREATE POLICY "Owners can view their payout wallet" ON public.owner_payout_wallets
    FOR ALL USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can view payout transactions" ON public.owner_payout_transactions;
CREATE POLICY "Owners can view payout transactions" ON public.owner_payout_transactions
    FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can manage scratch cards" ON public.scratch_cards;
CREATE POLICY "Users can manage scratch cards" ON public.scratch_cards
    FOR ALL USING (auth.uid() = user_id);

-- 6. REALTIME PUBLICATION
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.owner_bank_accounts;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.owner_payout_wallets;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.owner_payout_transactions;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.scratch_cards;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
