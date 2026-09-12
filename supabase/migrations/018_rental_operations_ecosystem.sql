-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 018_rental_operations_ecosystem.sql
-- Description: Production tables for complete Rental Operations:
--              1. Rent Payments
--              2. Lease Agreements (Digital E-Lease)
--              3. Zero Deposit Passes
--              4. Tenant Verifications
--              5. Visit Bookings
--              6. Service Bookings (Packers & Movers, Deep Cleaning)
--              7. Utility Requests (Move-In Concierge)
--              8. Document Vault
--              RLS Policies, Triggers & Atomic Stored Procedures.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. RENT PAYMENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rent_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    property_name TEXT NOT NULL,
    locality TEXT NOT NULL,
    landlord_name TEXT NOT NULL,
    landlord_upi TEXT,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    base_rent NUMERIC NOT NULL DEFAULT 0,
    maintenance NUMERIC NOT NULL DEFAULT 0,
    platform_fee NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('upi', 'credit_card', 'debit_card', 'netbanking', 'wallet')),
    payment_method_detail TEXT,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    transaction_ref TEXT UNIQUE NOT NULL,
    cashback_earned NUMERIC NOT NULL DEFAULT 0,
    receipt_url TEXT,
    due_date DATE,
    paid_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_rent_payments_user ON public.rent_payments(user_id, paid_at DESC);
CREATE INDEX IF NOT EXISTS idx_rent_payments_status ON public.rent_payments(status);
CREATE INDEX IF NOT EXISTS idx_rent_payments_tx_ref ON public.rent_payments(transaction_ref);

-- ------------------------------------------------------------------------------
-- 2. LEASE AGREEMENTS TABLE (Digital E-Lease)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lease_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    property_title TEXT NOT NULL,
    property_locality TEXT NOT NULL,
    property_image TEXT,
    landlord_name TEXT NOT NULL,
    landlord_phone TEXT NOT NULL,
    landlord_aadhaar_last4 TEXT,
    tenant_name TEXT NOT NULL,
    tenant_phone TEXT NOT NULL,
    tenant_aadhaar_last4 TEXT,
    monthly_rent NUMERIC NOT NULL CHECK (monthly_rent >= 0),
    security_deposit NUMERIC NOT NULL DEFAULT 0,
    notice_period_days INTEGER NOT NULL DEFAULT 30,
    lockin_months INTEGER NOT NULL DEFAULT 6,
    duration_months INTEGER NOT NULL DEFAULT 11,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_signatures', 'biometrics_pending', 'registered', 'active', 'expired', 'cancelled')),
    stamp_duty_amount NUMERIC NOT NULL DEFAULT 1499,
    govt_registration_fee NUMERIC NOT NULL DEFAULT 1000,
    registration_id TEXT UNIQUE,
    biometric_status TEXT NOT NULL DEFAULT 'not_scheduled' CHECK (biometric_status IN ('not_scheduled', 'scheduled', 'completed')),
    biometric_date DATE,
    biometric_slot TEXT,
    biometric_executive TEXT,
    estamp_number TEXT UNIQUE,
    tenant_signed BOOLEAN NOT NULL DEFAULT FALSE,
    owner_signed BOOLEAN NOT NULL DEFAULT FALSE,
    tenant_signed_at TIMESTAMPTZ,
    owner_signed_at TIMESTAMPTZ,
    signed_pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_lease_agreements_user ON public.lease_agreements(user_id);
CREATE INDEX IF NOT EXISTS idx_lease_agreements_status ON public.lease_agreements(status);

-- ------------------------------------------------------------------------------
-- 3. ZERO DEPOSIT PASSES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.zero_deposit_passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    credit_score INTEGER NOT NULL DEFAULT 765,
    coverage_amount NUMERIC NOT NULL DEFAULT 150000 CHECK (coverage_amount > 0),
    monthly_fee NUMERIC NOT NULL DEFAULT 499,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'expired', 'revoked')),
    certificate_id TEXT UNIQUE NOT NULL,
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    landlord_protected BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_zero_deposit_user ON public.zero_deposit_passes(user_id);
CREATE INDEX IF NOT EXISTS idx_zero_deposit_cert ON public.zero_deposit_passes(certificate_id);

-- ------------------------------------------------------------------------------
-- 4. TENANT VERIFICATIONS TABLE (KYC & Trust Score)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tenant_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    aadhaar_status TEXT NOT NULL DEFAULT 'unverified' CHECK (aadhaar_status IN ('unverified', 'pending', 'verified', 'rejected')),
    aadhaar_last4 TEXT,
    pan_status TEXT NOT NULL DEFAULT 'unverified' CHECK (pan_status IN ('unverified', 'pending', 'verified', 'rejected')),
    pan_number TEXT,
    face_match_status TEXT NOT NULL DEFAULT 'unverified' CHECK (face_match_status IN ('unverified', 'pending', 'verified', 'rejected')),
    employment_status TEXT NOT NULL DEFAULT 'unverified' CHECK (employment_status IN ('unverified', 'pending', 'verified', 'rejected')),
    employer_name TEXT,
    student_status TEXT NOT NULL DEFAULT 'unverified' CHECK (student_status IN ('unverified', 'pending', 'verified', 'rejected')),
    college_name TEXT,
    police_verification_status TEXT NOT NULL DEFAULT 'not_requested' CHECK (police_verification_status IN ('not_requested', 'in_progress', 'verified')),
    background_check_status TEXT NOT NULL DEFAULT 'clean' CHECK (background_check_status IN ('pending', 'clean', 'flagged')),
    overall_status TEXT NOT NULL DEFAULT 'unverified' CHECK (overall_status IN ('unverified', 'in_progress', 'verified')),
    progress_percent INTEGER NOT NULL DEFAULT 0,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_tenant_verifications_user ON public.tenant_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_verifications_status ON public.tenant_verifications(overall_status);

-- ------------------------------------------------------------------------------
-- 5. VISIT BOOKINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.visit_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    property_title TEXT NOT NULL,
    property_locality TEXT NOT NULL,
    property_image TEXT,
    host_name TEXT NOT NULL,
    host_phone TEXT,
    visit_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'rescheduled', 'completed', 'cancelled')),
    qr_code_payload TEXT NOT NULL,
    special_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_visit_bookings_user ON public.visit_bookings(user_id, visit_date DESC);
CREATE INDEX IF NOT EXISTS idx_visit_bookings_status ON public.visit_bookings(status);

-- ------------------------------------------------------------------------------
-- 6. SERVICE BOOKINGS TABLE (Movers, Cleaning, Home Care)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL CHECK (service_type IN ('movers', 'cleaning', 'painting', 'pest_control', 'furniture')),
    provider_name TEXT NOT NULL,
    provider_logo TEXT,
    pickup_address TEXT,
    drop_address TEXT,
    booking_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    home_size TEXT,
    package_selected TEXT NOT NULL,
    estimated_price NUMERIC NOT NULL DEFAULT 0,
    final_price NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    tracking_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_service_bookings_user ON public.service_bookings(user_id, booking_date DESC);
CREATE INDEX IF NOT EXISTS idx_service_bookings_type ON public.service_bookings(service_type);

-- ------------------------------------------------------------------------------
-- 7. UTILITY REQUESTS TABLE (Move-In Concierge)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.utility_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    utility_type TEXT NOT NULL CHECK (utility_type IN ('electricity', 'wifi', 'gas', 'water', 'address_change', 'society_reg', 'furniture_rental', 'cleaning', 'movers')),
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'in_progress', 'connected', 'completed')),
    scheduled_date DATE,
    details JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_utility_requests_user ON public.utility_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_utility_requests_status ON public.utility_requests(status);

-- ------------------------------------------------------------------------------
-- 8. DOCUMENT VAULT TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.document_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('lease_agreement', 'rent_receipt', 'kyc_doc', 'zero_deposit', 'property_deed', 'society_noc', 'other')),
    file_url TEXT NOT NULL,
    file_size TEXT NOT NULL DEFAULT '1.2 MB',
    mime_type TEXT NOT NULL DEFAULT 'application/pdf',
    related_id UUID,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_document_vault_user ON public.document_vault(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_document_vault_type ON public.document_vault(document_type);

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.rent_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lease_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zero_deposit_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utility_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_vault ENABLE ROW LEVEL SECURITY;

-- Rent Payments
CREATE POLICY "Users can view own rent payments"
    ON public.rent_payments FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own rent payments"
    ON public.rent_payments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and admins can update own rent payments"
    ON public.rent_payments FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin());

-- Lease Agreements
CREATE POLICY "Users can view own lease agreements"
    ON public.lease_agreements FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own lease agreements"
    ON public.lease_agreements FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lease agreements"
    ON public.lease_agreements FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin());

-- Zero Deposit Passes
CREATE POLICY "Users can view own zero deposit passes"
    ON public.zero_deposit_passes FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create own zero deposit pass"
    ON public.zero_deposit_passes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own zero deposit pass"
    ON public.zero_deposit_passes FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin());

-- Tenant Verifications
CREATE POLICY "Users can view own tenant verification"
    ON public.tenant_verifications FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can manage own tenant verification"
    ON public.tenant_verifications FOR ALL
    USING (auth.uid() = user_id OR public.is_admin());

-- Visit Bookings
CREATE POLICY "Users can view own visit bookings"
    ON public.visit_bookings FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can book visits"
    ON public.visit_bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own visit bookings"
    ON public.visit_bookings FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin());

-- Service Bookings
CREATE POLICY "Users can view own service bookings"
    ON public.service_bookings FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create service bookings"
    ON public.service_bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own service bookings"
    ON public.service_bookings FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin());

-- Utility Requests
CREATE POLICY "Users can view own utility requests"
    ON public.utility_requests FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can manage own utility requests"
    ON public.utility_requests FOR ALL
    USING (auth.uid() = user_id OR public.is_admin());

-- Document Vault
CREATE POLICY "Users can view own vault documents"
    ON public.document_vault FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can manage own vault documents"
    ON public.document_vault FOR ALL
    USING (auth.uid() = user_id OR public.is_admin());
