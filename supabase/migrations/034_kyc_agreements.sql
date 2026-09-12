-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 034_kyc_agreements.sql
-- Description: Sprint V5.6 — Complete KYC + Digital Agreement Ecosystem
--              - kyc_sessions
--              - aadhaar_documents
--              - pan_documents
--              - selfie_verifications
--              - rental_agreements (MTA 2021 compliant)
--              - agreement_signatures
--              - agreement_audit_logs
-- ==============================================================================

-- 1. KYC SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.kyc_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'verified', 'rejected')),
    trust_score NUMERIC DEFAULT 0,
    digilocker_request_id TEXT,
    aadhaar_verified BOOLEAN DEFAULT FALSE,
    pan_verified BOOLEAN DEFAULT FALSE,
    selfie_verified BOOLEAN DEFAULT FALSE,
    current_step TEXT DEFAULT 'home',
    failure_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_kyc_sessions_user ON public.kyc_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_sessions_status ON public.kyc_sessions(status);

-- 2. AADHAAR DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.aadhaar_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.kyc_sessions(id) ON DELETE CASCADE,
    masked_aadhaar_number TEXT NOT NULL,
    name TEXT NOT NULL,
    dob TEXT,
    gender TEXT,
    address JSONB DEFAULT '{}'::jsonb,
    front_url TEXT,
    back_url TEXT,
    verified_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_aadhaar_documents_user ON public.aadhaar_documents(user_id);

-- 3. PAN DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.pan_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.kyc_sessions(id) ON DELETE CASCADE,
    pan_number TEXT NOT NULL,
    name TEXT NOT NULL,
    father_name TEXT,
    dob TEXT,
    doc_url TEXT,
    verified_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_pan_documents_user ON public.pan_documents(user_id);

-- 4. SELFIE VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.selfie_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.kyc_sessions(id) ON DELETE CASCADE,
    selfie_url TEXT NOT NULL,
    liveness_score NUMERIC DEFAULT 98.5,
    match_score NUMERIC DEFAULT 96.0,
    verified_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_selfie_verifications_user ON public.selfie_verifications(user_id);

-- 5. RENTAL AGREEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.rental_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    renter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft',
        'pending_owner_signature',
        'pending_renter_signature',
        'signed',
        'registered',
        'stamp_paper_attached',
        'active',
        'terminated'
    )),
    monthly_rent NUMERIC NOT NULL,
    security_deposit NUMERIC NOT NULL,
    lease_start_date DATE NOT NULL,
    lease_end_date DATE NOT NULL,
    lock_in_period_months INTEGER DEFAULT 6,
    notice_period_days INTEGER DEFAULT 30,
    escalation_percentage NUMERIC DEFAULT 5.0,
    stamp_duty_amount NUMERIC DEFAULT 500,
    stamp_paper_number TEXT,
    state_code TEXT DEFAULT 'KA',
    agreement_pdf_url TEXT,
    signed_pdf_url TEXT,
    terms_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_rental_agreements_owner ON public.rental_agreements(owner_id);
CREATE INDEX IF NOT EXISTS idx_rental_agreements_renter ON public.rental_agreements(renter_id);
CREATE INDEX IF NOT EXISTS idx_rental_agreements_property ON public.rental_agreements(property_id);
CREATE INDEX IF NOT EXISTS idx_rental_agreements_status ON public.rental_agreements(status);

-- 6. AGREEMENT SIGNATURES TABLE
CREATE TABLE IF NOT EXISTS public.agreement_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id UUID NOT NULL REFERENCES public.rental_agreements(id) ON DELETE CASCADE,
    signer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'renter', 'witness')),
    signature_type TEXT NOT NULL DEFAULT 'aadhaar_esign' CHECK (signature_type IN ('aadhaar_esign', 'drawn', 'uploaded')),
    certificate_id TEXT,
    ip_address TEXT,
    device_fingerprint TEXT,
    sha256_hash TEXT,
    signed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_agreement_signatures_agr ON public.agreement_signatures(agreement_id);
CREATE INDEX IF NOT EXISTS idx_agreement_signatures_signer ON public.agreement_signatures(signer_id);

-- 7. AGREEMENT AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.agreement_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id UUID NOT NULL REFERENCES public.rental_agreements(id) ON DELETE CASCADE,
    event TEXT NOT NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_agreement_audit_logs_agr ON public.agreement_audit_logs(agreement_id);

-- 8. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.kyc_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aadhaar_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pan_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selfie_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agreement_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agreement_audit_logs ENABLE ROW LEVEL SECURITY;

-- 9. RLS POLICIES
DROP POLICY IF EXISTS "Users can manage own kyc_sessions" ON public.kyc_sessions;
CREATE POLICY "Users can manage own kyc_sessions" ON public.kyc_sessions
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own aadhaar_documents" ON public.aadhaar_documents;
CREATE POLICY "Users can manage own aadhaar_documents" ON public.aadhaar_documents
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own pan_documents" ON public.pan_documents;
CREATE POLICY "Users can manage own pan_documents" ON public.pan_documents
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own selfie_verifications" ON public.selfie_verifications;
CREATE POLICY "Users can manage own selfie_verifications" ON public.selfie_verifications
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Parties can view agreements" ON public.rental_agreements;
CREATE POLICY "Parties can view agreements" ON public.rental_agreements
    FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = renter_id);

DROP POLICY IF EXISTS "Parties can insert agreements" ON public.rental_agreements;
CREATE POLICY "Parties can insert agreements" ON public.rental_agreements
    FOR INSERT WITH CHECK (auth.uid() = owner_id OR auth.uid() = renter_id);

DROP POLICY IF EXISTS "Parties can update agreements" ON public.rental_agreements;
CREATE POLICY "Parties can update agreements" ON public.rental_agreements
    FOR UPDATE USING (auth.uid() = owner_id OR auth.uid() = renter_id);

DROP POLICY IF EXISTS "Parties can view signatures" ON public.agreement_signatures;
CREATE POLICY "Parties can view signatures" ON public.agreement_signatures
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.rental_agreements ra
            WHERE ra.id = agreement_signatures.agreement_id
            AND (ra.owner_id = auth.uid() OR ra.renter_id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Signers can insert signatures" ON public.agreement_signatures;
CREATE POLICY "Signers can insert signatures" ON public.agreement_signatures
    FOR INSERT WITH CHECK (auth.uid() = signer_id);

DROP POLICY IF EXISTS "Parties can view audit logs" ON public.agreement_audit_logs;
CREATE POLICY "Parties can view audit logs" ON public.agreement_audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.rental_agreements ra
            WHERE ra.id = agreement_audit_logs.agreement_id
            AND (ra.owner_id = auth.uid() OR ra.renter_id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Parties can insert audit logs" ON public.agreement_audit_logs;
CREATE POLICY "Parties can insert audit logs" ON public.agreement_audit_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.rental_agreements ra
            WHERE ra.id = agreement_audit_logs.agreement_id
            AND (ra.owner_id = auth.uid() OR ra.renter_id = auth.uid())
        )
    );

-- 10. REALTIME PUBLICATION
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.kyc_sessions;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.rental_agreements;
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;
