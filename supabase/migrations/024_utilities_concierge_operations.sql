-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 024_utilities_concierge_operations.sql
-- Description: Utilities Transfer, Move-in Concierge, Service Bookings & Digital Agreements
--              Tables:
--              1. utility_requests (Property-linked transfer, meter photo, bill PDF, timeline)
--              2. service_bookings (Movers & cleaning, live price estimate, invoice, slots)
--              3. lease_signatures (Aadhaar eSign, tenant/owner/witness, audit timestamps)
--              4. document_categories (Folders: identity, income, lease, receipts, utility bills)
--              Indexes, RLS Policies, Supabase Realtime, and Storage Policies.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. DOCUMENT CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.document_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL DEFAULT 'folder',
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_document_categories_slug ON public.document_categories(slug);

-- Seed Default Categories
INSERT INTO public.document_categories (name, slug, icon, description, sort_order)
VALUES
    ('Identity Proofs', 'identity', 'shield-check', 'Aadhaar, PAN, Passport & Driving License', 1),
    ('Income & Employment', 'income', 'briefcase', 'Salary slips, Offer letter & Form 16', 2),
    ('Lease Agreements', 'lease_agreements', 'file-check', 'Active, upcoming and expired registered tenancy contracts', 3),
    ('Rent Receipts', 'rent_receipts', 'receipt', 'HRA compliant monthly rental invoices with Landlord PAN', 4),
    ('Utility Bills', 'utility_bills', 'zap', 'Electricity, Piped Gas, Water & WiFi bills', 5),
    ('Property Documents', 'property_docs', 'building', 'Society NOC, Possession letters & Agreements', 6),
    ('Police Verification', 'police_noc', 'badge-check', 'Police tenant verification certificate & acknowledgement', 7),
    ('Miscellaneous', 'medical_other', 'folder', 'Moving bills, medical records & other papers', 8)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    icon = EXCLUDED.icon,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- ------------------------------------------------------------------------------
-- 2. ENHANCE UTILITY REQUESTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.utility_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    lease_id UUID REFERENCES public.lease_agreements(id) ON DELETE SET NULL,
    utility_type TEXT NOT NULL CHECK (utility_type IN ('electricity', 'wifi', 'gas', 'water', 'address_change', 'society_reg', 'furniture_rental', 'cleaning', 'movers')),
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_id UUID REFERENCES public.utility_providers(id) ON DELETE SET NULL,
    consumer_number TEXT,
    meter_reading_initial NUMERIC DEFAULT 0,
    reading_photo_url TEXT,
    bill_pdf_url TEXT,
    monthly_estimate NUMERIC DEFAULT 0,
    auto_pay_enabled BOOLEAN DEFAULT FALSE,
    account_id TEXT,
    billing_cycle TEXT DEFAULT 'monthly',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'in_progress', 'connected', 'completed', 'cancelled')),
    scheduled_date DATE,
    time_slot TEXT,
    cancellation_reason TEXT,
    timeline JSONB DEFAULT '[]'::jsonb,
    details JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.utility_requests
    ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS lease_id UUID REFERENCES public.lease_agreements(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS bill_pdf_url TEXT,
    ADD COLUMN IF NOT EXISTS reading_photo_url TEXT,
    ADD COLUMN IF NOT EXISTS time_slot TEXT,
    ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
    ADD COLUMN IF NOT EXISTS timeline JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_utility_requests_user ON public.utility_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_utility_requests_property ON public.utility_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_utility_requests_type ON public.utility_requests(utility_type);
CREATE INDEX IF NOT EXISTS idx_utility_requests_status ON public.utility_requests(status);

-- ------------------------------------------------------------------------------
-- 3. ENHANCE SERVICE BOOKINGS TABLE (Packers & Movers, Deep Cleaning)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
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
    tracking_stage TEXT DEFAULT 'booked' CHECK (tracking_stage IN (
        'quote_requested',
        'survey_scheduled',
        'quote_accepted',
        'crew_assigned',
        'in_transit',
        'delivered',
        'completed',
        'cancelled'
    )),
    crew_lead_name TEXT,
    crew_lead_phone TEXT,
    crew_vehicle_number TEXT,
    otp_start TEXT,
    otp_completion TEXT,
    insurance_covered BOOLEAN DEFAULT FALSE,
    insurance_amount NUMERIC DEFAULT 0,
    invoice_url TEXT,
    cancellation_reason TEXT,
    tracking_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.service_bookings
    ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS invoice_url TEXT,
    ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_service_bookings_user ON public.service_bookings(user_id, booking_date DESC);
CREATE INDEX IF NOT EXISTS idx_service_bookings_type ON public.service_bookings(service_type);
CREATE INDEX IF NOT EXISTS idx_service_bookings_status ON public.service_bookings(status);

-- ------------------------------------------------------------------------------
-- 4. ENHANCE LEASE SIGNATURES TABLE
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 5. STORAGE BUCKETS & POLICIES
-- ------------------------------------------------------------------------------
-- Ensure document-vault and utility-docs buckets exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('document-vault', 'document-vault', false, 26214400, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']::text[]),
    ('utility-docs', 'utility-docs', true, 15728640, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']::text[])
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policies for utility-docs
DROP POLICY IF EXISTS "Public utility docs read" ON storage.objects;
CREATE POLICY "Public utility docs read" ON storage.objects
    FOR SELECT USING (bucket_id = 'utility-docs');

DROP POLICY IF EXISTS "Users can upload utility docs" ON storage.objects;
CREATE POLICY "Users can upload utility docs" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'utility-docs' AND auth.uid() IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- ------------------------------------------------------------------------------
ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utility_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lease_signatures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read document categories" ON public.document_categories;
CREATE POLICY "Anyone can read document categories" ON public.document_categories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view own utility requests" ON public.utility_requests;
CREATE POLICY "Users can view own utility requests" ON public.utility_requests
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own utility requests" ON public.utility_requests;
CREATE POLICY "Users can insert own utility requests" ON public.utility_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own utility requests" ON public.utility_requests;
CREATE POLICY "Users can update own utility requests" ON public.utility_requests
    FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can view own service bookings" ON public.service_bookings;
CREATE POLICY "Users can view own service bookings" ON public.service_bookings
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own service bookings" ON public.service_bookings;
CREATE POLICY "Users can insert own service bookings" ON public.service_bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own service bookings" ON public.service_bookings;
CREATE POLICY "Users can update own service bookings" ON public.service_bookings
    FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. REALTIME PUBLICATION
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.document_categories;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.utility_requests;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.service_bookings;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.lease_signatures;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
