-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 027_visit_booking.sql
-- Description: Physical & Virtual Visit Booking 2.0 (Airbnb + Gate Pass Grade)
--              - Morning / Afternoon / Evening slots
--              - QR Gate Pass & Visitor Entry Codes
--              - Calendar Sync & Host slot configuration
--              - Realtime check-in status
-- ==============================================================================

-- 1. VISIT SLOTS TABLE (Host/Owner Available Slots)
CREATE TABLE IF NOT EXISTS public.visit_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    slot_period TEXT NOT NULL CHECK (slot_period IN ('morning', 'afternoon', 'evening')),
    start_time TEXT NOT NULL, -- e.g. '10:00 AM'
    end_time TEXT NOT NULL,   -- e.g. '11:00 AM'
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_visit_slots_property ON public.visit_slots(property_id, day_of_week);

-- 2. EXTEND VISIT BOOKINGS TABLE
ALTER TABLE public.visit_bookings
    ADD COLUMN IF NOT EXISTS slot_period TEXT DEFAULT 'morning' CHECK (slot_period IN ('morning', 'afternoon', 'evening', 'custom')),
    ADD COLUMN IF NOT EXISTS slot_start_time TEXT,
    ADD COLUMN IF NOT EXISTS slot_end_time TEXT,
    ADD COLUMN IF NOT EXISTS society_gate_code TEXT,
    ADD COLUMN IF NOT EXISTS visitor_pass_number TEXT,
    ADD COLUMN IF NOT EXISTS pass_expires_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS calendar_synced BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS calendar_event_id TEXT,
    ADD COLUMN IF NOT EXISTS checkin_status TEXT DEFAULT 'pending' CHECK (checkin_status IN ('pending', 'checked_in', 'no_show', 'cancelled')),
    ADD COLUMN IF NOT EXISTS checkin_time TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS directions_url TEXT,
    ADD COLUMN IF NOT EXISTS escort_name TEXT,
    ADD COLUMN IF NOT EXISTS escort_phone TEXT;

CREATE INDEX IF NOT EXISTS idx_visit_bookings_slot_period ON public.visit_bookings(slot_period);
CREATE INDEX IF NOT EXISTS idx_visit_bookings_pass_number ON public.visit_bookings(visitor_pass_number);

-- 3. ROW LEVEL SECURITY
ALTER TABLE public.visit_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view visit slots" ON public.visit_slots;
CREATE POLICY "Anyone can view visit slots" ON public.visit_slots
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Hosts can manage their property visit slots" ON public.visit_slots;
CREATE POLICY "Hosts can manage their property visit slots" ON public.visit_slots
    FOR ALL USING (
        auth.uid() = host_id OR
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = visit_slots.property_id AND p.owner_id = auth.uid()
        )
    );

-- 4. REALTIME PUBLICATION
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.visit_slots;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.visit_bookings;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
