-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 037_ai_search_maps.sql
-- Description: REHVO V6.2 Step 2 — AI Search + Smart Maps 2.0
-- Tables: search_history, saved_searches, property_views, locality_scores, commute_hubs
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SEARCH HISTORY TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    parsed_filters JSONB DEFAULT '{}'::jsonb,
    results_count INT DEFAULT 0,
    device_type TEXT DEFAULT 'mobile',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_history_user ON public.search_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_query ON public.search_history(query_text);

-- ------------------------------------------------------------------------------
-- 2. SAVED SEARCHES TABLE (Ensure full columns available)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT,
    city TEXT DEFAULT 'Mumbai',
    locality TEXT,
    min_price NUMERIC,
    max_price NUMERIC,
    bhk_types TEXT[] DEFAULT '{}',
    furnishing TEXT,
    office_address TEXT,
    office_lat NUMERIC,
    office_lng NUMERIC,
    max_commute_minutes INT DEFAULT 30,
    filters JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    notify_push BOOLEAN DEFAULT TRUE,
    notify_email BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user_v2 ON public.saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_active ON public.saved_searches(is_active);

-- ------------------------------------------------------------------------------
-- 3. PROPERTY VIEWS (Telemetry table)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    source_screen TEXT DEFAULT 'search',
    dwell_seconds INT DEFAULT 0,
    device_platform TEXT DEFAULT 'ios',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_property_views_prop ON public.property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_user ON public.property_views(user_id);
CREATE INDEX IF NOT EXISTS idx_property_views_created ON public.property_views(created_at DESC);

-- ------------------------------------------------------------------------------
-- 4. LOCALITY SCORES (Neighborhood Intelligence)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.locality_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    locality TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Mumbai',
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    walk_score INT NOT NULL DEFAULT 85 CHECK (walk_score BETWEEN 0 AND 100),
    safety_score INT NOT NULL DEFAULT 90 CHECK (safety_score BETWEEN 0 AND 100),
    noise_score INT NOT NULL DEFAULT 75 CHECK (noise_score BETWEEN 0 AND 100),
    greenery_score INT NOT NULL DEFAULT 80 CHECK (greenery_score BETWEEN 0 AND 100),
    nightlife_score INT NOT NULL DEFAULT 85 CHECK (nightlife_score BETWEEN 0 AND 100),
    family_friendly_score INT NOT NULL DEFAULT 88 CHECK (family_friendly_score BETWEEN 0 AND 100),
    internet_quality_score INT NOT NULL DEFAULT 95 CHECK (internet_quality_score BETWEEN 0 AND 100),
    water_supply_score INT NOT NULL DEFAULT 92 CHECK (water_supply_score BETWEEN 0 AND 100),
    average_rent_1bhk NUMERIC DEFAULT 35000,
    average_rent_2bhk NUMERIC DEFAULT 65000,
    average_rent_3bhk NUMERIC DEFAULT 110000,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_locality_city UNIQUE(locality, city)
);

CREATE INDEX IF NOT EXISTS idx_locality_scores_loc ON public.locality_scores(locality, city);

-- ------------------------------------------------------------------------------
-- 5. COMMUTE HUBS & POI OVERLAYS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.commute_hubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    hub_type TEXT NOT NULL CHECK (hub_type IN ('office', 'metro', 'airport', 'railway', 'college', 'hospital', 'gym', 'restaurant', 'grocery')),
    city TEXT NOT NULL DEFAULT 'Mumbai',
    locality TEXT,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    icon_name TEXT DEFAULT 'MapPin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commute_hubs_type ON public.commute_hubs(hub_type);
CREATE INDEX IF NOT EXISTS idx_commute_hubs_city ON public.commute_hubs(city);

-- ------------------------------------------------------------------------------
-- 6. SEED DATA FOR LOCALITIES & COMMUTE HUBS
-- ------------------------------------------------------------------------------
INSERT INTO public.locality_scores (
    locality, city, latitude, longitude,
    walk_score, safety_score, noise_score, greenery_score,
    nightlife_score, family_friendly_score, internet_quality_score, water_supply_score,
    average_rent_1bhk, average_rent_2bhk, average_rent_3bhk, description
) VALUES
('Bandra West', 'Mumbai', 19.0596, 72.8295, 96, 94, 68, 78, 98, 89, 98, 95, 45000, 85000, 160000, 'Queen of suburbs with world-class cafes, coastal promenades, and vibrant lifestyle.'),
('Khar West', 'Mumbai', 19.0700, 72.8339, 93, 92, 74, 80, 92, 90, 96, 94, 40000, 75000, 135000, 'Serene, leafy neighborhood right next to Bandra with premium boutique apartments.'),
('Powai', 'Mumbai', 19.1176, 72.9060, 89, 96, 85, 92, 82, 95, 98, 92, 38000, 68000, 110000, 'Planned European township overlooking Powai Lake, home to IIT Bombay & major tech MNCs.'),
('Andheri West', 'Mumbai', 19.1363, 72.8277, 95, 90, 65, 72, 95, 87, 97, 90, 35000, 62000, 95000, 'Dynamic entertainment hub connected via Versova-Ghatkopar & Metro Line 2A.'),
('Andheri East', 'Mumbai', 19.1136, 72.8697, 88, 88, 62, 70, 78, 85, 95, 92, 30000, 52000, 80000, 'Prime commercial nexus near MIDC, SEEPZ, Metro Line 1 & International Airport.'),
('Worli', 'Mumbai', 19.0178, 72.8181, 91, 95, 76, 84, 90, 92, 99, 96, 60000, 115000, 220000, 'Prestigious sea-facing luxury corridor with ultra-luxury sky villas and Sea Link access.'),
('Lower Parel', 'Mumbai', 18.9953, 72.8300, 94, 93, 70, 70, 96, 86, 99, 94, 50000, 90000, 165000, 'Corporate financial district with high-end dining, Palladium Mall, and high-rise towers.'),
('Juhu', 'Mumbai', 19.1075, 72.8263, 90, 93, 72, 85, 91, 91, 96, 93, 55000, 95000, 180000, 'Iconic beachfront haven famous for celebrities, boutique bistros, and coastal luxury.'),
('Goregaon East', 'Mumbai', 19.1663, 72.8526, 86, 90, 80, 88, 75, 92, 95, 91, 28000, 48000, 75000, 'Green suburban living near Aarey Colony, Nesco Exhibition Centre, and Western Express.')
ON CONFLICT (locality, city) DO UPDATE SET
    walk_score = EXCLUDED.walk_score,
    safety_score = EXCLUDED.safety_score,
    noise_score = EXCLUDED.noise_score,
    greenery_score = EXCLUDED.greenery_score,
    nightlife_score = EXCLUDED.nightlife_score,
    family_friendly_score = EXCLUDED.family_friendly_score,
    internet_quality_score = EXCLUDED.internet_quality_score,
    water_supply_score = EXCLUDED.water_supply_score,
    average_rent_1bhk = EXCLUDED.average_rent_1bhk,
    average_rent_2bhk = EXCLUDED.average_rent_2bhk,
    average_rent_3bhk = EXCLUDED.average_rent_3bhk,
    updated_at = NOW();

-- Seed Commute Hubs
INSERT INTO public.commute_hubs (name, hub_type, city, locality, latitude, longitude, icon_name) VALUES
-- Offices & Tech Parks
('BKC Commercial Complex', 'office', 'Mumbai', 'Bandra East', 19.0657, 72.8687, 'Briefcase'),
('Nesco IT Park', 'office', 'Mumbai', 'Goregaon East', 19.1551, 72.8530, 'Building2'),
('Mindspace Malad', 'office', 'Mumbai', 'Malad West', 19.1834, 72.8360, 'Building2'),
('One World Center', 'office', 'Mumbai', 'Lower Parel', 18.9986, 72.8277, 'Briefcase'),
('Hiranandani Business Park', 'office', 'Mumbai', 'Powai', 19.1197, 72.9051, 'Building2'),
-- Metro Stations
('DN Nagar Metro Station (Line 1 & 2A)', 'metro', 'Mumbai', 'Andheri West', 19.1303, 72.8329, 'Train'),
('Gundavali Metro Station (Line 7)', 'metro', 'Mumbai', 'Andheri East', 19.1172, 72.8596, 'Train'),
('Marol Naka Metro (Line 1 & 3)', 'metro', 'Mumbai', 'Andheri East', 19.1102, 72.8872, 'Train'),
('Ghatkopar Metro Station (Line 1)', 'metro', 'Mumbai', 'Ghatkopar East', 19.0856, 72.9080, 'Train'),
('Lower Parel Monorail', 'metro', 'Mumbai', 'Lower Parel', 18.9950, 72.8310, 'Train'),
-- Airports
('CSMIA Terminal 1 (Domestic)', 'airport', 'Mumbai', 'Santacruz East', 19.0896, 72.8528, 'Plane'),
('CSMIA Terminal 2 (International)', 'airport', 'Mumbai', 'Sahar', 19.0968, 72.8747, 'Plane'),
-- Railway Stations
('Bandra Terminus', 'railway', 'Mumbai', 'Bandra East', 19.0620, 72.8407, 'Navigation'),
('Andheri Railway Station', 'railway', 'Mumbai', 'Andheri West', 19.1197, 72.8464, 'Navigation'),
('Dadar Central Junction', 'railway', 'Mumbai', 'Dadar', 19.0178, 72.8478, 'Navigation'),
-- Colleges
('IIT Bombay Campus', 'college', 'Mumbai', 'Powai', 19.1334, 72.9133, 'GraduationCap'),
('NMIMS University', 'college', 'Mumbai', 'Vile Parle West', 19.1032, 72.8373, 'GraduationCap'),
('St. Xavier''s College', 'college', 'Mumbai', 'Fort', 18.9431, 72.8316, 'GraduationCap'),
-- Hospitals
('Lilavati Hospital & Research Centre', 'hospital', 'Mumbai', 'Bandra West', 19.0514, 72.8290, 'HeartPulse'),
('Kokilaben Dhirubhai Ambani Hospital', 'hospital', 'Mumbai', 'Andheri West', 19.1317, 72.8252, 'HeartPulse'),
('Hinduja Healthcare Surgical', 'hospital', 'Mumbai', 'Khar West', 19.0694, 72.8335, 'HeartPulse'),
-- Gyms & Fitness
('Gold''s Gym Bandra', 'gym', 'Mumbai', 'Bandra West', 19.0601, 72.8312, 'Dumbbell'),
('Cult.fit Powai Lake', 'gym', 'Mumbai', 'Powai', 19.1189, 72.9065, 'Dumbbell'),
-- Groceries
('Nature''s Basket Pali Hill', 'grocery', 'Mumbai', 'Bandra West', 19.0625, 72.8298, 'ShoppingBag'),
('Foodhall Linking Road', 'grocery', 'Mumbai', 'Santacruz West', 19.0820, 72.8380, 'ShoppingBag'),
-- Restaurants
('Bastian Bandra', 'restaurant', 'Mumbai', 'Bandra West', 19.0605, 72.8340, 'Utensils'),
('The Clearing House', 'restaurant', 'Mumbai', 'Ballard Estate', 18.9325, 72.8400, 'Utensils')
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locality_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commute_hubs ENABLE ROW LEVEL SECURITY;

-- search_history RLS
DROP POLICY IF EXISTS "Users can read own search history" ON public.search_history;
CREATE POLICY "Users can read own search history"
    ON public.search_history FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can insert search history" ON public.search_history;
CREATE POLICY "Users can insert search history"
    ON public.search_history FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can delete own search history" ON public.search_history;
CREATE POLICY "Users can delete own search history"
    ON public.search_history FOR DELETE
    USING (auth.uid() = user_id);

-- saved_searches RLS
DROP POLICY IF EXISTS "Users can manage own saved searches" ON public.saved_searches;
CREATE POLICY "Users can manage own saved searches"
    ON public.saved_searches FOR ALL
    USING (auth.uid() = user_id);

-- property_views RLS
DROP POLICY IF EXISTS "Users can record property views" ON public.property_views;
CREATE POLICY "Users can record property views"
    ON public.property_views FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can read own property views" ON public.property_views;
CREATE POLICY "Users can read own property views"
    ON public.property_views FOR SELECT
    USING (auth.uid() = user_id);

-- locality_scores & commute_hubs: Public read-only
DROP POLICY IF EXISTS "Public can view locality scores" ON public.locality_scores;
CREATE POLICY "Public can view locality scores"
    ON public.locality_scores FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public can view commute hubs" ON public.commute_hubs;
CREATE POLICY "Public can view commute hubs"
    ON public.commute_hubs FOR SELECT
    USING (true);

-- ------------------------------------------------------------------------------
-- 8. SUPABASE REALTIME PUBLICATION
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.search_history;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_searches;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.locality_scores;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.commute_hubs;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
END $$;
