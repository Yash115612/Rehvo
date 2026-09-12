-- ==============================================================================
-- REHVO V5.4.1 — RESIDENT SERVICES ECOSYSTEM MIGRATION
-- Production tables for Utilities, Society Services, Home Services & Booking Engine
-- ==============================================================================

-- 1. UTILITY ACCOUNTS
CREATE TABLE IF NOT EXISTS public.utility_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  utility_type TEXT NOT NULL CHECK (utility_type IN ('electricity', 'water', 'gas', 'broadband', 'mobile', 'dth', 'maintenance')),
  provider TEXT NOT NULL,
  consumer_number TEXT NOT NULL,
  nickname TEXT,
  autopay_enabled BOOLEAN DEFAULT FALSE,
  last_bill_amount NUMERIC DEFAULT 0,
  last_bill_date TIMESTAMPTZ,
  next_due_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending_verification')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. UTILITY TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.utility_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  utility_account_id UUID REFERENCES public.utility_accounts(id) ON DELETE SET NULL,
  utility_type TEXT NOT NULL,
  provider TEXT NOT NULL,
  consumer_number TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('wallet', 'upi', 'card', 'netbanking')),
  wallet_deduction NUMERIC DEFAULT 0,
  upi_ref TEXT,
  status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'pending', 'failed')),
  receipt_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. AUTOPAY SETTINGS
CREATE TABLE IF NOT EXISTS public.autopay_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  utility_account_id UUID REFERENCES public.utility_accounts(id) ON DELETE CASCADE,
  max_limit NUMERIC NOT NULL DEFAULT 5000,
  payment_source TEXT NOT NULL DEFAULT 'wallet' CHECK (payment_source IN ('wallet', 'upi_autopay', 'card')),
  is_active BOOLEAN DEFAULT TRUE,
  last_executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. MAINTENANCE PAYMENTS & LEDGER
CREATE TABLE IF NOT EXISTS public.maintenance_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  society_name TEXT NOT NULL,
  flat_number TEXT NOT NULL,
  billing_month TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  breakdown JSONB DEFAULT '{}',
  due_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'due' CHECK (status IN ('due', 'paid', 'overdue')),
  paid_at TIMESTAMPTZ,
  payment_ref TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SERVICE CATEGORIES (URBAN COMPANY STYLE CATALOG)
CREATE TABLE IF NOT EXISTS public.service_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon_name TEXT NOT NULL,
  color TEXT NOT NULL,
  starting_price NUMERIC NOT NULL,
  duration TEXT NOT NULL,
  rating NUMERIC DEFAULT 4.9,
  technician_count INTEGER DEFAULT 16,
  description TEXT,
  faqs JSONB DEFAULT '[]',
  badge TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TECHNICIANS & PARTNERS
CREATE TABLE IF NOT EXISTS public.technicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  photo_url TEXT,
  rating NUMERIC DEFAULT 4.9,
  total_jobs INTEGER DEFAULT 120,
  specialization TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT TRUE,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. SERVICE BOOKINGS & TRACKING ENGINE
CREATE TABLE IF NOT EXISTS public.service_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES public.service_categories(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  address TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_slot TEXT NOT NULL,
  notes TEXT,
  coupon_code TEXT,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'upi',
  status TEXT NOT NULL DEFAULT 'requested' CHECK (
    status IN ('requested', 'accepted', 'technician_assigned', 'on_the_way', 'in_progress', 'completed', 'cancelled')
  ),
  technician_id UUID REFERENCES public.technicians(id) ON DELETE SET NULL,
  start_otp TEXT NOT NULL DEFAULT '4819',
  end_otp TEXT NOT NULL DEFAULT '7231',
  rating INTEGER,
  review TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TECHNICIAN REVIEWS
CREATE TABLE IF NOT EXISTS public.technician_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.service_bookings(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES public.technicians(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  tags TEXT[] DEFAULT '{}',
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. SOCIETY COMPLAINTS
CREATE TABLE IF NOT EXISTS public.society_complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('water_leakage', 'lift', 'security', 'cleaning', 'electricity', 'parking', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'investigating', 'action_taken', 'resolved', 'closed')),
  timeline JSONB DEFAULT '[]',
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. SOCIETY NOTICES
CREATE TABLE IF NOT EXISTS public.society_notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_name TEXT NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  is_pinned BOOLEAN DEFAULT FALSE,
  attachments TEXT[] DEFAULT '{}',
  published_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. VISITOR PASSES
CREATE TABLE IF NOT EXISTS public.visitor_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  visitor_name TEXT NOT NULL,
  phone TEXT,
  vehicle_number TEXT,
  flat_number TEXT NOT NULL,
  visit_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  access_code TEXT NOT NULL,
  qr_payload TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'cancelled')),
  checked_in_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. DELIVERY PASSES
CREATE TABLE IF NOT EXISTS public.delivery_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL CHECK (company IN ('Amazon', 'Blinkit', 'Swiggy', 'Zomato', 'Flipkart', 'Other')),
  flat_number TEXT NOT NULL,
  access_code TEXT NOT NULL,
  qr_payload TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'cancelled')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. AMENITY BOOKINGS
CREATE TABLE IF NOT EXISTS public.amenity_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  society_name TEXT NOT NULL,
  amenity_type TEXT NOT NULL CHECK (amenity_type IN ('gym', 'pool', 'clubhouse', 'tennis_court', 'badminton_court', 'party_hall')),
  booking_date DATE NOT NULL,
  slot_time TEXT NOT NULL,
  participants_count INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled')),
  qr_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_utility_accounts_user ON public.utility_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_utility_tx_user ON public.utility_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_autopay_user ON public.autopay_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_maint_payments_user ON public.maintenance_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_user ON public.service_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_society_complaints_user ON public.society_complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_visitor_passes_user ON public.visitor_passes(user_id);
CREATE INDEX IF NOT EXISTS idx_delivery_passes_user ON public.delivery_passes(user_id);
CREATE INDEX IF NOT EXISTS idx_amenity_bookings_user ON public.amenity_bookings(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.utility_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utility_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.autopay_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.society_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.society_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenity_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their utility accounts" ON public.utility_accounts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view and record utility transactions" ON public.utility_transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their autopay settings" ON public.autopay_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view and pay maintenance bills" ON public.maintenance_payments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view service categories" ON public.service_categories
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Anyone can view available technicians" ON public.technicians
  FOR SELECT USING (is_verified = TRUE);

CREATE POLICY "Users can manage their service bookings" ON public.service_bookings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can leave and view reviews" ON public.technician_reviews
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their complaints" ON public.society_complaints
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Residents can view society notices" ON public.society_notices
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage their visitor passes" ON public.visitor_passes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their delivery passes" ON public.delivery_passes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their amenity bookings" ON public.amenity_bookings
  FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- REALTIME SUBSCRIPTIONS
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'service_bookings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.service_bookings;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'society_complaints'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.society_complaints;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'visitor_passes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.visitor_passes;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'society_notices'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.society_notices;
  END IF;
END $$;

-- ==============================================================================
-- SEED DATA: 12 URBAN COMPANY STYLE SERVICE CATEGORIES
-- ==============================================================================
INSERT INTO public.service_categories (id, name, slug, icon_name, color, starting_price, duration, rating, technician_count, description, badge)
VALUES
  ('clean_house', 'House Cleaning', 'house-cleaning', 'Sparkles', '#0F766E', 499, '60 mins', 4.92, 28, 'Standard room dusting, floor wiping, trash clearing and sanitization', 'MOST POPULAR'),
  ('clean_deep', 'Deep Cleaning', 'deep-cleaning', 'ShieldCheck', '#064E3B', 1499, '180 mins', 4.95, 20, 'Intensive machine scrub, kitchen chimney degreasing & balcony pressure wash', 'BEST VALUE'),
  ('repair_elec', 'Electrician', 'electrician', 'Zap', '#D97706', 199, '30 mins', 4.88, 34, 'Switches, wiring, MCB tripping, fan installation and chandelier mounting', 'INSTANT FIX'),
  ('repair_plumb', 'Plumber', 'plumber', 'Droplets', '#2563EB', 199, '30 mins', 4.89, 25, 'Pipe leakage, tap replacement, flush repair and water heater connection', 'EMERGENCY'),
  ('repair_carp', 'Carpenter', 'carpenter', 'Hammer', '#B45309', 249, '45 mins', 4.86, 18, 'Door lock repair, furniture assembly, shelf drilling and drawer sliders', NULL),
  ('repair_ac', 'AC Service & Repair', 'ac-repair', 'Wind', '#0284C7', 599, '60 mins', 4.91, 22, 'Jet pump foam wash, gas leak inspection and cooling coil check', 'SUMMER SPECIAL'),
  ('repair_app', 'Appliance Repair', 'appliance-repair', 'Wrench', '#7C3AED', 299, '45 mins', 4.87, 19, 'Washing machine, microwave, refrigerator and geyser diagnostics', NULL),
  ('home_paint', 'Express Painting', 'painting', 'Paintbrush', '#EA580C', 2999, '1-2 days', 4.90, 14, 'Waterproof wall touch-up, single accent wall or full home repainting', 'PREMIUM'),
  ('pest_control', 'Pest Control', 'pest-control', 'Bug', '#DC2626', 799, '90 mins', 4.93, 16, 'Herbal cockroach gel, anti-termite treatment and bedbug eradication', 'WARRANTY'),
  ('laundry_care', 'Laundry & Dry Clean', 'laundry', 'Shirt', '#4F46E5', 299, '24 hrs', 4.85, 12, 'Doorstep pickup, steam press, delicate garment care and shoe cleaning', NULL),
  ('water_purifier', 'Water Purifier RO', 'water-purifier', 'Filter', '#0D9488', 399, '45 mins', 4.94, 15, 'Filter candle replacement, membrane descaling and TDS water audit', NULL),
  ('home_sanit', 'Home Sanitization', 'home-sanitization', 'SprayCan', '#059669', 699, '60 mins', 4.90, 10, 'Hospital-grade surface fogging and touchpoint sterilization', NULL)
ON CONFLICT (id) DO UPDATE SET
  starting_price = EXCLUDED.starting_price,
  rating = EXCLUDED.rating;

-- ==============================================================================
-- SEED DATA: VERIFIED TECHNICIANS
-- ==============================================================================
INSERT INTO public.technicians (id, name, phone, photo_url, rating, total_jobs, specialization, is_verified, is_available)
VALUES
  ('33333333-3333-3333-3333-333333333301', 'Rameshwar Sharma', '+91 98201 55412', 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400', 4.94, 342, 'Deep Cleaning & Sanitization', TRUE, TRUE),
  ('33333333-3333-3333-3333-333333333302', 'Santosh Kadam', '+91 98199 43210', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 4.91, 510, 'Master Electrician', TRUE, TRUE),
  ('33333333-3333-3333-3333-333333333303', 'Mohammad Iqbal', '+91 98334 99124', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 4.89, 418, 'Plumbing & Leakage Specialist', TRUE, TRUE),
  ('33333333-3333-3333-3333-333333333304', 'Dinesh Prajapati', '+91 98670 12893', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400', 4.96, 275, 'HVAC & AC Jet Wash Expert', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
