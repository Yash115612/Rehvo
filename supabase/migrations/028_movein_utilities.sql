-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 028_movein_utilities.sql
-- Description: Move-In Concierge, Utilities, Packers & Movers, Deep Cleaning
--              - Move-in Checklist & Inventory Inspection Engine
--              - Utility Providers & Meter Handover (BESCOM, BWSSB, ACT, Tata Play, GAIL)
--              - Live Service Tracking for Movers & Cleaning (OTP, Crew details, Insurance)
--              - RLS Policies & Realtime publication
-- ==============================================================================

-- 1. MOVE-IN CHECKLISTS TABLE
CREATE TABLE IF NOT EXISTS public.move_in_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lease_id UUID REFERENCES public.lease_agreements(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('keys_handover', 'meter_readings', 'inventory_check', 'deep_cleaning', 'wifi_setup', 'society_gatepass', 'amenity_access')),
    item_name TEXT NOT NULL,
    description TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    photo_urls TEXT[] DEFAULT ARRAY[]::text[],
    condition_notes TEXT,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_move_in_checklists_user ON public.move_in_checklists(user_id);
CREATE INDEX IF NOT EXISTS idx_move_in_checklists_lease ON public.move_in_checklists(lease_id);

-- 2. INVENTORY ITEMS TABLE (Room-by-Room Digital Asset Inspection)
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    lease_id UUID REFERENCES public.lease_agreements(id) ON DELETE SET NULL,
    room_name TEXT NOT NULL, -- e.g. 'Master Bedroom', 'Modular Kitchen', 'Living Area'
    item_name TEXT NOT NULL, -- e.g. 'Geyser 25L', 'Inverter 1.5kVA', 'Wardrobe 4-Door'
    quantity INTEGER NOT NULL DEFAULT 1,
    condition TEXT NOT NULL DEFAULT 'brand_new' CHECK (condition IN ('brand_new', 'excellent', 'good', 'minor_wear', 'needs_repair')),
    photo_urls TEXT[] DEFAULT ARRAY[]::text[],
    notes TEXT,
    verified_by_tenant BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by_owner BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_inventory_items_property ON public.inventory_items(property_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_lease ON public.inventory_items(lease_id);

-- 3. UTILITY PROVIDERS TABLE (Official & Verified Service Providers)
CREATE TABLE IF NOT EXISTS public.utility_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('electricity', 'water', 'gas', 'broadband', 'maintenance', 'parking')),
    provider_name TEXT NOT NULL,
    logo_url TEXT,
    region TEXT NOT NULL DEFAULT 'Bangalore', -- e.g. 'Bangalore', 'Mumbai', 'Delhi-NCR'
    customer_care TEXT,
    portal_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_utility_providers_cat_reg ON public.utility_providers(category, region);

-- Seed Essential Utility Providers
INSERT INTO public.utility_providers (category, provider_name, region, customer_care, portal_url)
VALUES
    ('electricity', 'BESCOM (Bangalore Electricity)', 'Bangalore', '1912', 'https://bescom.karnataka.gov.in'),
    ('electricity', 'MSEDCL (Mahavitaran)', 'Mumbai', '1800-233-3435', 'https://www.mahadiscom.in'),
    ('water', 'BWSSB (Bangalore Water Supply)', 'Bangalore', '1916', 'https://bwssb.karnataka.gov.in'),
    ('gas', 'GAIL Gas Limited', 'Bangalore', '1800-102-9282', 'https://gailgas.com'),
    ('gas', 'Mahanagar Gas (MGL)', 'Mumbai', '1917', 'https://www.mahanagargas.com'),
    ('broadband', 'Airtel Xstream Fiber', 'All India', '121', 'https://www.airtel.in'),
    ('broadband', 'JioFiber Ultra', 'All India', '1800-896-9999', 'https://www.jio.com/fiber'),
    ('broadband', 'ACT Fibernet', 'Bangalore', '080-4284-0000', 'https://www.actcorp.in'),
    ('maintenance', 'MyGate Society ERP', 'All India', 'contact@mygate.com', 'https://mygate.com'),
    ('maintenance', 'NoBrokerHood Society App', 'All India', 'contact@nobroker.in', 'https://nobrokerhood.com')
ON CONFLICT DO NOTHING;

-- 4. EXTEND UTILITY REQUESTS TABLE
ALTER TABLE public.utility_requests
    ADD COLUMN IF NOT EXISTS consumer_number TEXT,
    ADD COLUMN IF NOT EXISTS meter_reading_initial NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS reading_photo_url TEXT,
    ADD COLUMN IF NOT EXISTS monthly_estimate NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS auto_pay_enabled BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS account_id TEXT,
    ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT 'monthly';

-- 5. EXTEND SERVICE BOOKINGS TABLE (Mover & Deep Cleaning Tracking)
ALTER TABLE public.service_bookings
    ADD COLUMN IF NOT EXISTS tracking_stage TEXT DEFAULT 'booked' CHECK (tracking_stage IN (
        'quote_requested',
        'survey_scheduled',
        'quote_accepted',
        'crew_assigned',
        'in_transit',
        'delivered',
        'completed',
        'cancelled'
    )),
    ADD COLUMN IF NOT EXISTS crew_lead_name TEXT,
    ADD COLUMN IF NOT EXISTS crew_lead_phone TEXT,
    ADD COLUMN IF NOT EXISTS crew_vehicle_number TEXT,
    ADD COLUMN IF NOT EXISTS otp_start TEXT,
    ADD COLUMN IF NOT EXISTS otp_completion TEXT,
    ADD COLUMN IF NOT EXISTS insurance_covered BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS insurance_amount NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS inventory_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS inspection_checklist JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_service_bookings_tracking_stage ON public.service_bookings(tracking_stage);

-- 6. ROW LEVEL SECURITY
ALTER TABLE public.move_in_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utility_providers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own move-in checklists" ON public.move_in_checklists;
CREATE POLICY "Users can manage own move-in checklists" ON public.move_in_checklists
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view inventory items for their leases/properties" ON public.inventory_items;
CREATE POLICY "Users can view inventory items for their leases/properties" ON public.inventory_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.lease_agreements la
            WHERE la.id = inventory_items.lease_id AND la.user_id = auth.uid()
        ) OR EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = inventory_items.property_id AND p.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Anyone can view utility providers" ON public.utility_providers;
CREATE POLICY "Anyone can view utility providers" ON public.utility_providers
    FOR SELECT USING (true);

-- 7. REALTIME PUBLICATION
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.move_in_checklists;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory_items;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.service_bookings;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.utility_requests;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
