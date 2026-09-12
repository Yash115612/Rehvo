-- ==============================================================================
-- REHVO V5.5 — UTILITIES & TRUST & SAFETY PRODUCTION SCHEMA
-- ==============================================================================

-- 1. ELECTRICITY BILLS & REMINDERS
CREATE TABLE IF NOT EXISTS public.electricity_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  consumer_number TEXT NOT NULL,
  provider TEXT NOT NULL,
  billing_month TEXT NOT NULL,
  units_consumed NUMERIC DEFAULT 0,
  amount NUMERIC NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'due' CHECK (status IN ('due', 'paid', 'overdue')),
  paid_at TIMESTAMPTZ,
  payment_ref TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. BROADBAND CATALOG & BOOKINGS
CREATE TABLE IF NOT EXISTS public.broadband_plans (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  speed_mbps INTEGER NOT NULL,
  price_monthly NUMERIC NOT NULL,
  ott_benefits TEXT[] DEFAULT '{}',
  installation_fee NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 4.8,
  badge TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.broadband_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  plan_id TEXT REFERENCES public.broadband_plans(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  installation_address TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'technician_assigned', 'installed', 'cancelled')),
  technician_name TEXT,
  technician_phone TEXT,
  monthly_price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. WATER & GAS BOOKINGS
CREATE TABLE IF NOT EXISTS public.water_tanker_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  capacity_litres INTEGER NOT NULL DEFAULT 5000,
  water_type TEXT NOT NULL DEFAULT 'potable' CHECK (water_type IN ('potable', 'domestic')),
  delivery_address TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  delivery_slot TEXT NOT NULL,
  vendor_name TEXT NOT NULL DEFAULT 'Mumbai Municipal Water Logistics',
  vendor_phone TEXT DEFAULT '+91 98200 11223',
  amount NUMERIC NOT NULL DEFAULT 1200,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'dispatched', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.png_gas_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'Mahanagar Gas Limited (MGL)',
  consumer_bp_number TEXT,
  connection_type TEXT NOT NULL DEFAULT 'transfer' CHECK (connection_type IN ('new', 'transfer', 'meter_reading')),
  initial_meter_reading NUMERIC,
  meter_photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'under_review' CHECK (status IN ('under_review', 'verified', 'connected', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. EMERGENCY CONTACTS & SOS ALERTS
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT NOT NULL DEFAULT 'Family',
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sos_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude NUMERIC,
  longitude NUMERIC,
  location_address TEXT,
  alert_type TEXT NOT NULL DEFAULT 'general' CHECK (alert_type IN ('general', 'medical', 'police', 'fire', 'women_safety')),
  status TEXT NOT NULL DEFAULT 'triggered' CHECK (status IN ('triggered', 'acknowledged', 'resolved', 'false_alarm')),
  dispatched_services TEXT[] DEFAULT '{}',
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 5. SOCIETY ENTRY PASSES
CREATE TABLE IF NOT EXISTS public.society_entry_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  pass_type TEXT NOT NULL CHECK (pass_type IN ('guest', 'delivery', 'cab', 'service')),
  visitor_name TEXT NOT NULL,
  visitor_phone TEXT,
  company_name TEXT,
  vehicle_number TEXT,
  access_code TEXT NOT NULL,
  qr_payload TEXT NOT NULL,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_to TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'revoked')),
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. MAINTENANCE TICKETS & MESSAGES
CREATE TABLE IF NOT EXISTS public.maintenance_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('plumbing', 'electrical', 'carpentry', 'appliance', 'painting', 'society_common', 'other')),
  urgency TEXT NOT NULL DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'emergency')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'resolved', 'closed')),
  assigned_technician TEXT,
  technician_phone TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.maintenance_ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.maintenance_tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('tenant', 'technician', 'society_manager')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_elec_bills_user ON public.electricity_bills(user_id);
CREATE INDEX IF NOT EXISTS idx_broadband_bookings_user ON public.broadband_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_water_tanker_user ON public.water_tanker_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user ON public.emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_society_passes_user ON public.society_entry_passes(user_id);
CREATE INDEX IF NOT EXISTS idx_maint_tickets_user ON public.maintenance_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_maint_messages_ticket ON public.maintenance_ticket_messages(ticket_id);

-- RLS
ALTER TABLE public.electricity_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadband_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadband_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_tanker_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.png_gas_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.society_entry_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own electricity bills" ON public.electricity_bills
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view broadband plans" ON public.broadband_plans
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Users can manage broadband bookings" ON public.broadband_bookings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage water tanker bookings" ON public.water_tanker_bookings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage png gas bookings" ON public.png_gas_bookings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage emergency contacts" ON public.emergency_contacts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage sos alerts" ON public.sos_alerts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage society entry passes" ON public.society_entry_passes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage maintenance tickets" ON public.maintenance_tickets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view and send ticket messages" ON public.maintenance_ticket_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.maintenance_tickets t
      WHERE t.id = ticket_id AND (t.user_id = auth.uid() OR auth.uid() = sender_id)
    )
  );

-- SEED BROADBAND PLANS CATALOG
INSERT INTO public.broadband_plans (id, provider, plan_name, speed_mbps, price_monthly, ott_benefits, badge)
VALUES
  ('airtel_100', 'Airtel Xstream', 'Fiber Basic', 100, 799, ARRAY['Disney+ Hotstar', 'Xstream Play'], 'MOST POPULAR'),
  ('airtel_300', 'Airtel Xstream', 'Fiber Entertainment', 300, 1099, ARRAY['Netflix Basic', 'Disney+ Hotstar', 'Prime Video'], 'RECOMMENDED'),
  ('jio_100', 'JioFiber', 'JioFiber Silver', 100, 699, ARRAY['JioCinema Premium', 'SonyLIV', 'ZEE5'], 'BEST VALUE'),
  ('jio_300', 'JioFiber', 'JioFiber Gold', 300, 999, ARRAY['Netflix', 'Prime Video', 'Disney+ Hotstar', 'JioCinema'], 'HIGH SPEED'),
  ('act_300', 'ACT Fibernet', 'ACT Storm', 300, 1185, ARRAY['SonyLIV', 'ZEE5', 'Hungama'], 'LOWEST LATENCY'),
  ('tataplay_500', 'Tata Play Fiber', 'Ultra Stream 500', 500, 1499, ARRAY['Binge 25+ Apps', 'Apple TV+'], 'PRO GAMER')
ON CONFLICT (id) DO UPDATE SET
  price_monthly = EXCLUDED.price_monthly,
  ott_benefits = EXCLUDED.ott_benefits;
