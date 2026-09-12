-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 025_lease_management.sql
-- Description: Digital Lease Management (E-Lease, eSign, Biometrics, Renewals)
--              - lease_documents (eStamp certificates, PDF attachments, annexures)
--              - lease_events (Audit timeline: creation, signatures, renewal, termination)
--              - lease_signatures (Aadhaar OTP eSign, biometric logs, IP verification)
--              - Extensions to lease_agreements (maintenance, renewal countdown, termination)
-- ==============================================================================

-- 1. LEASE DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.lease_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lease_id UUID NOT NULL REFERENCES public.lease_agreements(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('draft_contract', 'estamp_certificate', 'signed_pdf', 'annexure', 'biometric_slip', 'police_noc', 'termination_notice')),
    file_url TEXT NOT NULL,
    file_size_kb INTEGER DEFAULT 0,
    version INTEGER NOT NULL DEFAULT 1,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_lease_documents_lease ON public.lease_documents(lease_id);

-- 2. LEASE EVENTS TABLE (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS public.lease_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lease_id UUID NOT NULL REFERENCES public.lease_agreements(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN (
        'draft_created',
        'details_updated',
        'tenant_esign_requested',
        'tenant_signed',
        'owner_esign_requested',
        'owner_signed',
        'biometric_scheduled',
        'biometric_completed',
        'govt_registered',
        'renewal_requested',
        'renewal_approved',
        'termination_initiated',
        'lease_terminated',
        'deposit_refunded'
    )),
    description TEXT NOT NULL,
    performed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    performed_by_name TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_lease_events_lease ON public.lease_events(lease_id, created_at DESC);

-- 3. LEASE SIGNATURES TABLE (Legal eSign & Aadhaar Verification Logs)
CREATE TABLE IF NOT EXISTS public.lease_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lease_id UUID NOT NULL REFERENCES public.lease_agreements(id) ON DELETE CASCADE,
    signer_role TEXT NOT NULL CHECK (signer_role IN ('tenant', 'landlord', 'witness', 'executive')),
    signer_name TEXT NOT NULL,
    signer_email TEXT,
    signer_phone TEXT,
    signature_type TEXT NOT NULL DEFAULT 'aadhaar_otp' CHECK (signature_type IN ('aadhaar_otp', 'biometric', 'drawn', 'uploaded')),
    signature_image_url TEXT,
    certificate_id TEXT,
    aadhaar_masked TEXT,
    ip_address TEXT,
    signed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_lease_signatures_lease ON public.lease_signatures(lease_id);

-- 4. EXTEND LEASE AGREEMENTS TABLE
ALTER TABLE public.lease_agreements
    ADD COLUMN IF NOT EXISTS maintenance_fee NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS renewal_eligible BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS renewal_status TEXT DEFAULT 'none' CHECK (renewal_status IN ('none', 'requested', 'in_progress', 'renewed', 'declined')),
    ADD COLUMN IF NOT EXISTS renewal_requested_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS termination_requested_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS termination_reason TEXT,
    ADD COLUMN IF NOT EXISTS termination_status TEXT DEFAULT 'active' CHECK (termination_status IN ('active', 'notice_period', 'terminated', 'refund_pending'));

-- 5. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.lease_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lease_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lease_signatures ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES
DROP POLICY IF EXISTS "Users can read own lease documents" ON public.lease_documents;
CREATE POLICY "Users can read own lease documents" ON public.lease_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.lease_agreements la
            WHERE la.id = lease_documents.lease_id AND la.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can read own lease events" ON public.lease_events;
CREATE POLICY "Users can read own lease events" ON public.lease_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.lease_agreements la
            WHERE la.id = lease_events.lease_id AND la.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can read own lease signatures" ON public.lease_signatures;
CREATE POLICY "Users can read own lease signatures" ON public.lease_signatures
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.lease_agreements la
            WHERE la.id = lease_signatures.lease_id AND la.user_id = auth.uid()
        )
    );

-- 7. REALTIME PUBLICATION
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.lease_documents;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.lease_events;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.lease_signatures;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
