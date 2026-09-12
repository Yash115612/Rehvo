-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 024_rental_operations.sql
-- Description: Rent Payments 2.0 (CRED RentPay Quality)
--              - payment_methods (UPI, Card, NetBanking, Wallet)
--              - autopay_mandates (AutoPay setup, limit, status, frequency)
--              - rent_receipts (HRA eligible, landlord PAN, QR verification)
--              - payment_failures (Error codes, retry logs)
--              - late_fee_rules (Grace periods, daily late fee, max cap)
--              - Extensions to rent_payments (split rent, EMI, autopay linkage)
-- ==============================================================================

-- 1. PAYMENT METHODS TABLE (Saved Cards, UPI IDs, NetBanking handles)
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('upi', 'credit_card', 'debit_card', 'netbanking', 'wallet')),
    provider TEXT NOT NULL, -- 'HDFC', 'ICICI', 'GooglePay', 'PhonePe', 'Paytm', etc.
    label TEXT NOT NULL, -- e.g. 'HDFC Regalia Card' or 'user@okicici'
    last4 TEXT,
    upi_id TEXT,
    expiry_month INTEGER,
    expiry_year INTEGER,
    card_network TEXT CHECK (card_network IN ('visa', 'mastercard', 'rupay', 'amex', 'other')),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    token_reference TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON public.payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON public.payment_methods(user_id, is_default);

-- 2. AUTOPAY MANDATES TABLE
CREATE TABLE IF NOT EXISTS public.autopay_mandates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE SET NULL,
    mandate_ref TEXT UNIQUE NOT NULL,
    max_amount NUMERIC NOT NULL CHECK (max_amount > 0),
    deduction_day INTEGER NOT NULL DEFAULT 1 CHECK (deduction_day BETWEEN 1 AND 28),
    frequency TEXT NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('monthly', 'quarterly', 'biannual', 'annual')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending_auth', 'active', 'paused', 'revoked', 'expired')),
    next_deduction_date DATE,
    last_deduction_date DATE,
    bank_mandate_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_autopay_mandates_user ON public.autopay_mandates(user_id);
CREATE INDEX IF NOT EXISTS idx_autopay_mandates_status ON public.autopay_mandates(status);

-- 3. RENT RECEIPTS TABLE (HRA Compliant)
CREATE TABLE IF NOT EXISTS public.rent_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.rent_payments(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receipt_number TEXT UNIQUE NOT NULL,
    month_year TEXT NOT NULL, -- e.g. 'September 2026'
    rent_amount NUMERIC NOT NULL CHECK (rent_amount > 0),
    maintenance_amount NUMERIC NOT NULL DEFAULT 0,
    tenant_name TEXT NOT NULL,
    tenant_email TEXT,
    tenant_pan TEXT,
    landlord_name TEXT NOT NULL,
    landlord_pan TEXT,
    landlord_signature_url TEXT,
    property_address TEXT NOT NULL,
    hra_eligible BOOLEAN NOT NULL DEFAULT TRUE,
    qr_code_payload TEXT NOT NULL,
    pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_rent_receipts_user ON public.rent_receipts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rent_receipts_number ON public.rent_receipts(receipt_number);

-- 4. PAYMENT FAILURES TABLE (Retry & Diagnostic Engine)
CREATE TABLE IF NOT EXISTS public.payment_failures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    payment_ref TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    error_code TEXT NOT NULL,
    error_message TEXT NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_payment_failures_user ON public.payment_failures(user_id, created_at DESC);

-- 5. LATE FEE RULES TABLE
CREATE TABLE IF NOT EXISTS public.late_fee_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    grace_period_days INTEGER NOT NULL DEFAULT 5,
    daily_late_fee NUMERIC NOT NULL DEFAULT 150 CHECK (daily_late_fee >= 0),
    max_late_fee NUMERIC NOT NULL DEFAULT 3000,
    interest_rate_percent NUMERIC NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. EXTEND RENT PAYMENTS TABLE
ALTER TABLE public.rent_payments
    ADD COLUMN IF NOT EXISTS split_rent_enabled BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS split_with JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS emi_eligible BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS emi_months INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS emi_interest NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS autopay_mandate_id UUID REFERENCES public.autopay_mandates(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS late_fee_applied NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS hra_receipt_id UUID REFERENCES public.rent_receipts(id) ON DELETE SET NULL;

-- 7. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.autopay_mandates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_failures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.late_fee_rules ENABLE ROW LEVEL SECURITY;

-- 8. RLS POLICIES
DROP POLICY IF EXISTS "Users can manage payment methods" ON public.payment_methods;
CREATE POLICY "Users can manage payment methods" ON public.payment_methods
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage autopay mandates" ON public.autopay_mandates;
CREATE POLICY "Users can manage autopay mandates" ON public.autopay_mandates
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own receipts" ON public.rent_receipts;
CREATE POLICY "Users can read own receipts" ON public.rent_receipts
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own receipts" ON public.rent_receipts;
CREATE POLICY "Users can insert own receipts" ON public.rent_receipts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read payment failures" ON public.payment_failures;
CREATE POLICY "Users can read payment failures" ON public.payment_failures
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can read late fee rules" ON public.late_fee_rules;
CREATE POLICY "Anyone can read late fee rules" ON public.late_fee_rules
    FOR SELECT USING (true);

-- 9. REALTIME PUBLICATION
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_methods;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.autopay_mandates;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rent_receipts;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
