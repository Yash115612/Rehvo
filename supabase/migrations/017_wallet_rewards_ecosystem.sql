-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 017_wallet_rewards_ecosystem.sql
-- Description: Production tables for Wallets, Ledger Transactions, Reward Campaigns,
--              Redemptions, Referrals, Gamified Challenges, Cashback Rules,
--              RLS Policies, and Stored Procedures / RPCs.
-- ==============================================================================

-- 1. WALLETS TABLE (One wallet per user)
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    balance NUMERIC NOT NULL DEFAULT 0 CHECK (balance >= 0),
    pending_cashback NUMERIC NOT NULL DEFAULT 0 CHECK (pending_cashback >= 0),
    lifetime_earned NUMERIC NOT NULL DEFAULT 0 CHECK (lifetime_earned >= 0),
    lifetime_redeemed NUMERIC NOT NULL DEFAULT 0 CHECK (lifetime_redeemed >= 0),
    referral_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_wallets_user ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_referral_code ON public.wallets(referral_code);

-- 2. WALLET TRANSACTIONS TABLE (Double-entry ledger)
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
    category TEXT NOT NULL CHECK (category IN (
        'rent_cashback',
        'referral',
        'reward_redemption',
        'welcome_bonus',
        'listing_bonus',
        'flatmate_bonus',
        'kyc_bonus',
        'zero_deposit_bonus',
        'refund',
        'other'
    )),
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'expired', 'reversed')),
    reference_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_wallet_tx_wallet ON public.wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_user_created ON public.wallet_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_category ON public.wallet_transactions(category);

-- 3. REWARD CAMPAIGNS TABLE (CRED-inspired Brand Offers)
CREATE TABLE IF NOT EXISTS public.reward_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'food',
        'shopping',
        'travel',
        'furniture',
        'cleaning',
        'packers',
        'rent_cashback',
        'exclusive'
    )),
    description TEXT NOT NULL,
    discount_badge TEXT NOT NULL,
    required_points NUMERIC NOT NULL CHECK (required_points >= 0),
    promo_code TEXT NOT NULL,
    terms TEXT NOT NULL,
    image_url TEXT NOT NULL,
    brand_logo TEXT,
    stock_count INTEGER NOT NULL DEFAULT 100,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_exclusive BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_reward_campaigns_category ON public.reward_campaigns(category, is_active);

-- 4. REWARD REDEMPTIONS TABLE (User claimed coupons)
CREATE TABLE IF NOT EXISTS public.reward_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES public.reward_campaigns(id) ON DELETE CASCADE,
    points_spent NUMERIC NOT NULL,
    promo_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired', 'cancelled')),
    redeemed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_reward_redemptions_user ON public.reward_redemptions(user_id, redeemed_at DESC);

-- 5. REFERRALS TABLE (Share & Earn tracking)
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    referral_code TEXT NOT NULL,
    friend_name TEXT NOT NULL,
    friend_phone TEXT,
    friend_email TEXT,
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    reward_status TEXT NOT NULL DEFAULT 'pending' CHECK (reward_status IN ('pending', 'credited', 'expired', 'cancelled')),
    reward_amount NUMERIC NOT NULL DEFAULT 300,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);

-- 6. CHALLENGE PROGRESS TABLE (Gamified Missions)
CREATE TABLE IF NOT EXISTS public.challenge_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly')),
    current_progress INTEGER NOT NULL DEFAULT 0,
    target_progress INTEGER NOT NULL DEFAULT 1,
    reward_amount NUMERIC NOT NULL DEFAULT 50,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    is_claimed BOOLEAN NOT NULL DEFAULT FALSE,
    claimed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_challenge UNIQUE (user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_progress_user ON public.challenge_progress(user_id, period);

-- 7. CASHBACK RULES TABLE (Configurable cashback rates)
CREATE TABLE IF NOT EXISTS public.cashback_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL UNIQUE,
    percentage NUMERIC DEFAULT 0,
    flat_amount NUMERIC DEFAULT 0,
    max_cap NUMERIC DEFAULT 500,
    is_active BOOLEAN DEFAULT TRUE
);

-- Seed Default Cashback Rules
INSERT INTO public.cashback_rules (event_type, percentage, flat_amount, max_cap)
VALUES
    ('rent_payment', 1.0, 0, 500),
    ('referral_signup', 0, 300, 300),
    ('referral_first_rent', 0, 200, 200),
    ('first_listing', 0, 500, 500),
    ('tenant_verification', 0, 100, 100),
    ('zero_deposit_approval', 0, 250, 250),
    ('flatmate_profile', 0, 50, 50),
    ('flatmate_first_match', 0, 25, 25)
ON CONFLICT (event_type) DO UPDATE SET
    percentage = EXCLUDED.percentage,
    flat_amount = EXCLUDED.flat_amount,
    max_cap = EXCLUDED.max_cap;

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashback_rules ENABLE ROW LEVEL SECURITY;

-- Wallets RLS
CREATE POLICY "Users can view their own wallet"
    ON public.wallets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wallet"
    ON public.wallets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet"
    ON public.wallets FOR UPDATE
    USING (auth.uid() = user_id);

-- Transactions RLS
CREATE POLICY "Users can view their own transactions"
    ON public.wallet_transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
    ON public.wallet_transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Campaigns RLS (Public read for active campaigns)
CREATE POLICY "Anyone can view active reward campaigns"
    ON public.reward_campaigns FOR SELECT
    USING (is_active = TRUE);

-- Redemptions RLS
CREATE POLICY "Users can view their own redemptions"
    ON public.reward_redemptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own redemptions"
    ON public.reward_redemptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Referrals RLS
CREATE POLICY "Users can view their own referrals"
    ON public.referrals FOR SELECT
    USING (auth.uid() = referrer_id);

CREATE POLICY "Users can create referrals"
    ON public.referrals FOR INSERT
    WITH CHECK (auth.uid() = referrer_id);

-- Challenge Progress RLS
CREATE POLICY "Users can view their challenge progress"
    ON public.challenge_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their challenge progress"
    ON public.challenge_progress FOR ALL
    USING (auth.uid() = user_id);

-- Cashback Rules RLS
CREATE POLICY "Anyone can read cashback rules"
    ON public.cashback_rules FOR SELECT
    USING (is_active = TRUE);

-- 9. STORED PROCEDURES / RPCS

-- Redeem Reward Campaign Atomically
CREATE OR REPLACE FUNCTION public.redeem_reward_campaign(
    p_campaign_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_campaign RECORD;
    v_wallet RECORD;
    v_new_redemption_id UUID;
BEGIN
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Authentication required');
    END IF;

    -- Fetch campaign
    SELECT * INTO v_campaign FROM public.reward_campaigns
    WHERE id = p_campaign_id AND is_active = TRUE AND stock_count > 0;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Reward offer is currently unavailable or out of stock');
    END IF;

    -- Fetch user wallet
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_user_id;

    IF NOT FOUND OR v_wallet.balance < v_campaign.required_points THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient R-Cash balance to redeem this reward');
    END IF;

    -- Deduct balance & increment redeemed
    UPDATE public.wallets
    SET balance = balance - v_campaign.required_points,
        lifetime_redeemed = lifetime_redeemed + v_campaign.required_points,
        updated_at = timezone('utc'::text, now())
    WHERE id = v_wallet.id;

    -- Decrement campaign stock
    UPDATE public.reward_campaigns
    SET stock_count = stock_count - 1
    WHERE id = p_campaign_id;

    -- Create redemption record
    INSERT INTO public.reward_redemptions (
        user_id, campaign_id, points_spent, promo_code, expires_at
    )
    VALUES (
        v_user_id,
        p_campaign_id,
        v_campaign.required_points,
        v_campaign.promo_code,
        timezone('utc'::text, now()) + INTERVAL '30 days'
    )
    RETURNING id INTO v_new_redemption_id;

    -- Create ledger transaction
    INSERT INTO public.wallet_transactions (
        wallet_id, user_id, title, description, amount, type, category, status, reference_id, metadata
    )
    VALUES (
        v_wallet.id,
        v_user_id,
        v_campaign.title,
        'Redeemed ' || v_campaign.brand || ' voucher for ' || v_campaign.required_points || ' R-Cash',
        v_campaign.required_points,
        'debit',
        'reward_redemption',
        'completed',
        v_new_redemption_id::text,
        jsonb_build_object('campaign_id', p_campaign_id, 'promo_code', v_campaign.promo_code, 'brand', v_campaign.brand)
    );

    RETURN jsonb_build_object(
        'success', true,
        'redemption_id', v_new_redemption_id,
        'promo_code', v_campaign.promo_code,
        'points_spent', v_campaign.required_points,
        'new_balance', v_wallet.balance - v_campaign.required_points
    );
END;
$$;

-- Claim Challenge Reward Atomically
CREATE OR REPLACE FUNCTION public.claim_challenge_reward(
    p_challenge_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_challenge RECORD;
    v_wallet RECORD;
BEGIN
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Authentication required');
    END IF;

    SELECT * INTO v_challenge FROM public.challenge_progress
    WHERE user_id = v_user_id AND challenge_id = p_challenge_id;

    IF NOT FOUND OR NOT v_challenge.is_completed OR v_challenge.is_claimed THEN
        RETURN jsonb_build_object('success', false, 'error', 'Challenge is not ready to claim or has already been claimed');
    END IF;

    -- Fetch or create wallet
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_user_id;

    IF NOT FOUND THEN
        INSERT INTO public.wallets (user_id, balance, lifetime_earned, referral_code)
        VALUES (v_user_id, v_challenge.reward_amount, v_challenge.reward_amount, 'REHVO' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 6)))
        RETURNING * INTO v_wallet;
    ELSE
        UPDATE public.wallets
        SET balance = balance + v_challenge.reward_amount,
            lifetime_earned = lifetime_earned + v_challenge.reward_amount,
            updated_at = timezone('utc'::text, now())
        WHERE id = v_wallet.id;
    END IF;

    -- Mark challenge claimed
    UPDATE public.challenge_progress
    SET is_claimed = TRUE,
        claimed_at = timezone('utc'::text, now()),
        updated_at = timezone('utc'::text, now())
    WHERE id = v_challenge.id;

    -- Record transaction
    INSERT INTO public.wallet_transactions (
        wallet_id, user_id, title, description, amount, type, category, status, reference_id, metadata
    )
    VALUES (
        v_wallet.id,
        v_user_id,
        v_challenge.title || ' Reward',
        'Claimed challenge mission completion bonus',
        v_challenge.reward_amount,
        'credit',
        'welcome_bonus',
        'completed',
        v_challenge.id::text,
        jsonb_build_object('challenge_id', p_challenge_id, 'period', v_challenge.period)
    );

    RETURN jsonb_build_object(
        'success', true,
        'reward_amount', v_challenge.reward_amount,
        'new_balance', v_wallet.balance + v_challenge.reward_amount
    );
END;
$$;
