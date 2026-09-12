-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 025_wallet_rewards_fintech.sql
-- Description: Complete Wallet, Rewards, RentPay, Referrals & Gamification
--              - User Bank Accounts & Wallet Withdrawals
--              - Cashback Rewards Ledger
--              - AutoPay Mandates & Settings
--              - Payment Receipts (HRA & GST Invoices)
--              - Scratch Cards & Rewards Catalog
--              - Coupons & Brand Offers
--              - Referrals & Milestone Rewards
--              - User Challenges, Streaks & Achievement Badges
--              - User Gamification XP & Friend Leaderboard
--              - RLS Policies, Indexes, Triggers, and Realtime Publication
-- ==============================================================================

-- 1. USER BANK ACCOUNTS TABLE (For Renter R-Cash Withdrawals)
CREATE TABLE IF NOT EXISTS public.user_bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    account_holder_name TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    account_number_masked TEXT NOT NULL,
    account_number_encrypted TEXT,
    ifsc_code TEXT NOT NULL,
    account_type TEXT NOT NULL DEFAULT 'savings' CHECK (account_type IN ('savings', 'current')),
    upi_id TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    penny_drop_status TEXT NOT NULL DEFAULT 'verified' CHECK (penny_drop_status IN ('pending', 'verified', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_user_bank_accounts_user ON public.user_bank_accounts(user_id);

-- 2. WALLET WITHDRAWALS TABLE
CREATE TABLE IF NOT EXISTS public.wallet_withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE SET NULL,
    bank_account_id UUID REFERENCES public.user_bank_accounts(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    fee NUMERIC NOT NULL DEFAULT 0,
    net_amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('initiated', 'processing', 'completed', 'failed', 'reversed')),
    reference_id TEXT UNIQUE NOT NULL,
    utr_number TEXT,
    failure_reason TEXT,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_wallet_withdrawals_user ON public.wallet_withdrawals(user_id, created_at DESC);

-- 3. CASHBACK REWARDS TABLE
CREATE TABLE IF NOT EXISTS public.cashback_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    category TEXT NOT NULL CHECK (category IN ('rent_payment', 'referral', 'kyc_verification', 'challenge_completion', 'scratch_card', 'bonus')),
    status TEXT NOT NULL DEFAULT 'credited' CHECK (status IN ('pending', 'credited', 'expired', 'reversed')),
    title TEXT NOT NULL,
    description TEXT,
    reference_id TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_cashback_rewards_user ON public.cashback_rewards(user_id, created_at DESC);

-- 4. AUTOPAY SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.autopay_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lease_id UUID REFERENCES public.lease_agreements(id) ON DELETE CASCADE,
    is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    payment_method TEXT NOT NULL DEFAULT 'upi' CHECK (payment_method IN ('upi', 'card', 'netbanking')),
    upi_id TEXT,
    card_last4 TEXT,
    deduction_day INTEGER NOT NULL DEFAULT 1 CHECK (deduction_day BETWEEN 1 AND 28),
    max_amount NUMERIC NOT NULL DEFAULT 50000,
    mandate_reference TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'revoked', 'failed')),
    last_deduction_date TIMESTAMPTZ,
    next_deduction_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_autopay_settings_user ON public.autopay_settings(user_id);

-- 5. PAYMENT RECEIPTS TABLE (HRA & GST Compliant)
CREATE TABLE IF NOT EXISTS public.payment_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES public.rent_payments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receipt_number TEXT UNIQUE NOT NULL,
    receipt_type TEXT NOT NULL DEFAULT 'hra' CHECK (receipt_type IN ('hra', 'tax_invoice', 'standard')),
    receipt_url TEXT,
    total_amount NUMERIC NOT NULL CHECK (total_amount > 0),
    rent_amount NUMERIC NOT NULL CHECK (rent_amount > 0),
    maintenance_amount NUMERIC NOT NULL DEFAULT 0,
    tax_amount NUMERIC NOT NULL DEFAULT 0,
    landlord_name TEXT NOT NULL,
    landlord_pan TEXT,
    tenant_name TEXT NOT NULL,
    property_title TEXT NOT NULL,
    property_address TEXT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    qr_code_payload TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_payment_receipts_user ON public.payment_receipts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_receipts_payment ON public.payment_receipts(payment_id);

-- 6. BRAND COUPONS CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    brand_name TEXT NOT NULL,
    brand_logo TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('food', 'shopping', 'travel', 'furniture', 'cleaning', 'packers', 'rent_discount', 'exclusive')),
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'flat')),
    discount_value NUMERIC NOT NULL,
    min_order_amount NUMERIC DEFAULT 0,
    max_discount_cap NUMERIC,
    points_required NUMERIC NOT NULL DEFAULT 0,
    terms_conditions TEXT,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_coupons_category ON public.coupons(category, is_active);

-- Seed Initial Verified Brand Coupons
INSERT INTO public.coupons (code, brand_name, title, description, category, discount_type, discount_value, min_order_amount, max_discount_cap, points_required, terms_conditions, is_active)
VALUES
    ('SWIGGYREHVO150', 'Swiggy Gourmet', '₹150 Off Gourmet Dining', 'Valid on dining reservations and gourmet deliveries above ₹499.', 'food', 'flat', 150, 499, 150, 150, 'Valid once per user.', TRUE),
    ('UCxREHVO300', 'Urban Company', 'Flat ₹300 Off Deep Cleaning', 'Full house sanitization and deep kitchen cleaning.', 'cleaning', 'flat', 300, 1200, 300, 200, 'Valid on orders above ₹1200.', TRUE),
    ('BLINKREHVO100', 'Blinkit Instant', '₹100 Off House Groceries', 'Stock up pantry essentials in 10 minutes.', 'shopping', 'flat', 100, 399, 100, 100, 'New and existing users.', TRUE),
    ('IKEAxREHVO10', 'IKEA India', '10% Off Home Furniture', 'Ergonomic study desks, chairs and bedroom furnishings.', 'furniture', 'percentage', 10, 2500, 1500, 250, 'Max discount ₹1,500.', TRUE),
    ('MOVEWITHREHVO', 'Porter Logistics', '₹500 Off Interstate Movers', 'Bubble wrap packing with GPS live transit tracking.', 'packers', 'flat', 500, 3000, 500, 300, 'Residential shifting only.', TRUE),
    ('ZOOMREHVO400', 'Zoomcar', '₹400 Off Weekend Roadtrips', 'Self-drive SUVs and premium sedans for weekend getaways.', 'travel', 'flat', 400, 2000, 400, 250, 'Min booking 24 hours.', TRUE),
    ('RENTDISCOUNT500', 'REHVO RentPay', '₹500 Direct Rent Discount', 'Instant deduction on next month rent clearance on REHVO.', 'rent_discount', 'flat', 500, 15000, 500, 500, 'Applicable on active verified leases.', TRUE)
ON CONFLICT (code) DO NOTHING;

-- 7. REFERRAL MILESTONES TABLE
CREATE TABLE IF NOT EXISTS public.referral_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    milestone_tier TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    required_referrals INTEGER NOT NULL,
    bonus_cashback NUMERIC NOT NULL,
    perk_description TEXT NOT NULL,
    badge_name TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO public.referral_milestones (milestone_tier, name, required_referrals, bonus_cashback, perk_description, badge_name)
VALUES
    ('tier_1', 'Bronze Referrer', 1, 300, '₹300 Instant R-Cash for first verified roommate', 'Bronze Ambassador'),
    ('tier_2', 'Silver Referrer', 3, 1000, '₹1,000 Bonus + Free Urban Company Deep Cleaning', 'Silver Ambassador'),
    ('tier_3', 'Gold Ambassador', 5, 2500, '₹2,500 Bonus + 50% Off First Month Rent', 'Gold Ambassador'),
    ('tier_4', 'Emerald Legend', 10, 6000, '₹6,000 Bonus + VIP Club Access + 0 Brokerage Forever', 'Emerald Legend')
ON CONFLICT (milestone_tier) DO NOTHING;

-- 8. USER GAMIFICATION (XP, Levels, Streaks)
CREATE TABLE IF NOT EXISTS public.user_gamification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    current_xp INTEGER NOT NULL DEFAULT 100,
    current_level INTEGER NOT NULL DEFAULT 1,
    current_streak INTEGER NOT NULL DEFAULT 1,
    highest_streak INTEGER NOT NULL DEFAULT 1,
    last_active_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_challenges_completed INTEGER NOT NULL DEFAULT 0,
    total_rewards_claimed NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_user_gamification_user ON public.user_gamification(user_id);

-- 9. ACHIEVEMENT BADGES TABLE
CREATE TABLE IF NOT EXISTS public.achievement_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    badge_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    tier TEXT NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'emerald')),
    xp_reward INTEGER NOT NULL DEFAULT 50,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

INSERT INTO public.achievement_badges (badge_code, title, description, icon_name, tier, xp_reward)
VALUES
    ('verified_identity', 'Verified Resident', 'Completed DigiLocker Aadhaar & PAN verification', 'ShieldCheck', 'emerald', 150),
    ('punctual_payer', 'Punctual Payer', 'Cleared monthly rent on or before 1st of the month', 'Zap', 'gold', 200),
    ('super_roommate', 'Super Roommate', 'Completed 100% co-living profile and lifestyle habits', 'Users', 'silver', 100),
    ('lease_pioneer', 'Digital Lease Pioneer', 'Executed Aadhaar e-Signed legal rental contract', 'FileText', 'emerald', 250),
    ('emerald_referral', 'Community Builder', 'Referred 3 or more verified tenants to REHVO', 'Crown', 'emerald', 300),
    ('zero_deposit_pro', 'Zero Deposit Master', 'Approved for REHVO Shield zero deposit security pass', 'Award', 'gold', 150)
ON CONFLICT (badge_code) DO NOTHING;

-- 10. USER UNLOCKED BADGES (Join Table)
CREATE TABLE IF NOT EXISTS public.user_unlocked_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.achievement_badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_badge UNIQUE (user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_unlocked_badges_user ON public.user_unlocked_badges(user_id);

-- 11. ROW LEVEL SECURITY
ALTER TABLE public.user_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashback_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.autopay_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_unlocked_badges ENABLE ROW LEVEL SECURITY;

-- Bank Accounts RLS
DROP POLICY IF EXISTS "Users can manage their bank accounts" ON public.user_bank_accounts;
CREATE POLICY "Users can manage their bank accounts" ON public.user_bank_accounts
    FOR ALL USING (auth.uid() = user_id);

-- Withdrawals RLS
DROP POLICY IF EXISTS "Users can view and create withdrawals" ON public.wallet_withdrawals;
CREATE POLICY "Users can view and create withdrawals" ON public.wallet_withdrawals
    FOR ALL USING (auth.uid() = user_id);

-- Cashback Rewards RLS
DROP POLICY IF EXISTS "Users can view cashback rewards" ON public.cashback_rewards;
CREATE POLICY "Users can view cashback rewards" ON public.cashback_rewards
    FOR SELECT USING (auth.uid() = user_id);

-- AutoPay Settings RLS
DROP POLICY IF EXISTS "Users can manage autopay settings" ON public.autopay_settings;
CREATE POLICY "Users can manage autopay settings" ON public.autopay_settings
    FOR ALL USING (auth.uid() = user_id);

-- Receipts RLS
DROP POLICY IF EXISTS "Users can view their payment receipts" ON public.payment_receipts;
CREATE POLICY "Users can view their payment receipts" ON public.payment_receipts
    FOR SELECT USING (auth.uid() = user_id);

-- Coupons RLS (Public read for active)
DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupons;
CREATE POLICY "Anyone can view active coupons" ON public.coupons
    FOR SELECT USING (is_active = TRUE);

-- Milestones RLS (Public read)
DROP POLICY IF EXISTS "Anyone can view referral milestones" ON public.referral_milestones;
CREATE POLICY "Anyone can view referral milestones" ON public.referral_milestones
    FOR SELECT USING (is_active = TRUE);

-- Gamification RLS
DROP POLICY IF EXISTS "Users can manage their gamification stats" ON public.user_gamification;
CREATE POLICY "Users can manage their gamification stats" ON public.user_gamification
    FOR ALL USING (auth.uid() = user_id);

-- Badges RLS (Public read)
DROP POLICY IF EXISTS "Anyone can view achievement badges" ON public.achievement_badges;
CREATE POLICY "Anyone can view achievement badges" ON public.achievement_badges
    FOR SELECT USING (is_active = TRUE);

-- Unlocked Badges RLS
DROP POLICY IF EXISTS "Users can view their unlocked badges" ON public.user_unlocked_badges;
CREATE POLICY "Users can view their unlocked badges" ON public.user_unlocked_badges
    FOR ALL USING (auth.uid() = user_id);

-- 12. REALTIME PUBLICATION
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_bank_accounts') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_bank_accounts;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'wallet_withdrawals') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.wallet_withdrawals;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'cashback_rewards') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.cashback_rewards;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'autopay_settings') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.autopay_settings;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'payment_receipts') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_receipts;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'scratch_cards') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.scratch_cards;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_gamification') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_gamification;
    END IF;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
