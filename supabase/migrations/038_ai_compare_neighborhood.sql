-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 038_ai_compare_neighborhood.sql
-- Description: REHVO V6.3 — AI Property Compare + Neighborhood Intelligence Ecosystem
-- Tables:
--   1. property_compare_sessions
--   2. neighborhood_scores
--   3. locality_crime_stats
--   4. locality_air_quality
--   5. internet_providers
--   6. water_supply_schedule
--   7. locality_places
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PROPERTY COMPARE SESSIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_compare_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_ids TEXT[] NOT NULL DEFAULT '{}',
    winner_property_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_compare_sessions_user ON public.property_compare_sessions(user_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 2. NEIGHBORHOOD SCORES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.neighborhood_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    locality TEXT NOT NULL UNIQUE,
    city TEXT NOT NULL DEFAULT 'Mumbai',
    walk_score NUMERIC NOT NULL DEFAULT 8.0,
    safety_score NUMERIC NOT NULL DEFAULT 8.5,
    nightlife_score NUMERIC NOT NULL DEFAULT 7.5,
    greenery_score NUMERIC NOT NULL DEFAULT 7.0,
    internet_score NUMERIC NOT NULL DEFAULT 9.0,
    water_score NUMERIC NOT NULL DEFAULT 8.5,
    traffic_score NUMERIC NOT NULL DEFAULT 6.5,
    family_score NUMERIC NOT NULL DEFAULT 8.5,
    pollution_score NUMERIC NOT NULL DEFAULT 6.5,
    overall_grade TEXT NOT NULL DEFAULT 'A',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_neighborhood_scores_loc ON public.neighborhood_scores(locality);

-- ------------------------------------------------------------------------------
-- 3. LOCALITY CRIME STATS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.locality_crime_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    locality TEXT NOT NULL UNIQUE,
    crime_index NUMERIC NOT NULL DEFAULT 22.4,
    safety_grade TEXT NOT NULL DEFAULT 'A+',
    women_safety TEXT NOT NULL DEFAULT 'Very High',
    police_station TEXT NOT NULL DEFAULT 'Bandra Police Station',
    police_distance_km NUMERIC NOT NULL DEFAULT 1.2,
    cctv_coverage TEXT NOT NULL DEFAULT '94% Monitored',
    emergency_numbers TEXT[] NOT NULL DEFAULT ARRAY['100', '112', '1090', '1091'],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crime_stats_loc ON public.locality_crime_stats(locality);

-- ------------------------------------------------------------------------------
-- 4. LOCALITY AIR QUALITY TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.locality_air_quality (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    locality TEXT NOT NULL UNIQUE,
    aqi INT NOT NULL DEFAULT 82,
    pm25 NUMERIC NOT NULL DEFAULT 26.4,
    pm10 NUMERIC NOT NULL DEFAULT 52.0,
    humidity NUMERIC NOT NULL DEFAULT 64.0,
    temperature NUMERIC NOT NULL DEFAULT 29.0,
    noise_level_db NUMERIC NOT NULL DEFAULT 56.0,
    status TEXT NOT NULL DEFAULT 'Moderate',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_air_quality_loc ON public.locality_air_quality(locality);

-- ------------------------------------------------------------------------------
-- 5. INTERNET PROVIDERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.internet_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    locality TEXT NOT NULL,
    provider TEXT NOT NULL,
    speed_mbps INT NOT NULL DEFAULT 300,
    latency INT NOT NULL DEFAULT 8,
    reliability NUMERIC NOT NULL DEFAULT 99.4,
    rating NUMERIC NOT NULL DEFAULT 4.8,
    plan_starting_price INT NOT NULL DEFAULT 699,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_internet_providers_loc ON public.internet_providers(locality);

-- ------------------------------------------------------------------------------
-- 6. WATER SUPPLY SCHEDULE TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.water_supply_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    locality TEXT NOT NULL UNIQUE,
    tanker_frequency TEXT NOT NULL DEFAULT 'Rare / Summer Emergency Only',
    municipal_supply_hours TEXT NOT NULL DEFAULT '06:00 AM – 09:30 AM & 06:30 PM – 09:00 PM',
    borewell_available BOOLEAN NOT NULL DEFAULT TRUE,
    tds_level NUMERIC NOT NULL DEFAULT 165,
    pressure_rating TEXT NOT NULL DEFAULT 'High Pressure (2.4 Bar)',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_water_schedule_loc ON public.water_supply_schedule(locality);

-- ------------------------------------------------------------------------------
-- 7. LOCALITY PLACES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.locality_places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    locality TEXT NOT NULL UNIQUE,
    schools JSONB NOT NULL DEFAULT '[]'::jsonb,
    hospitals JSONB NOT NULL DEFAULT '[]'::jsonb,
    malls JSONB NOT NULL DEFAULT '[]'::jsonb,
    cafes JSONB NOT NULL DEFAULT '[]'::jsonb,
    gyms JSONB NOT NULL DEFAULT '[]'::jsonb,
    metro JSONB NOT NULL DEFAULT '[]'::jsonb,
    grocery JSONB NOT NULL DEFAULT '[]'::jsonb,
    parks JSONB NOT NULL DEFAULT '[]'::jsonb,
    pet_clinics JSONB NOT NULL DEFAULT '[]'::jsonb,
    coworking JSONB NOT NULL DEFAULT '[]'::jsonb,
    temples JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_locality_places_loc ON public.locality_places(locality);

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.property_compare_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhood_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locality_crime_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locality_air_quality ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internet_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_supply_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locality_places ENABLE ROW LEVEL SECURITY;

-- Compare Sessions: user can manage their own sessions; anon can read public
CREATE POLICY "Users can manage their compare sessions"
ON public.property_compare_sessions FOR ALL
USING (auth.uid() = user_id OR user_id IS NULL)
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Intelligence tables: readable by all authenticated and anon users
CREATE POLICY "Public read neighborhood scores" ON public.neighborhood_scores FOR SELECT USING (true);
CREATE POLICY "Public read locality crime stats" ON public.locality_crime_stats FOR SELECT USING (true);
CREATE POLICY "Public read locality air quality" ON public.locality_air_quality FOR SELECT USING (true);
CREATE POLICY "Public read internet providers" ON public.internet_providers FOR SELECT USING (true);
CREATE POLICY "Public read water schedule" ON public.water_supply_schedule FOR SELECT USING (true);
CREATE POLICY "Public read locality places" ON public.locality_places FOR SELECT USING (true);

-- ------------------------------------------------------------------------------
-- 9. SEED DATA (MUMBAI PRIME CORRIDORS)
-- ------------------------------------------------------------------------------
INSERT INTO public.neighborhood_scores (locality, city, walk_score, safety_score, nightlife_score, greenery_score, internet_score, water_score, traffic_score, family_score, pollution_score, overall_grade, description)
VALUES
('BKC', 'Mumbai', 8.8, 9.4, 8.6, 8.2, 9.8, 9.2, 7.8, 8.9, 7.2, 'A+', 'Mumbai’s premier financial fortress with world-class infrastructure and luxury residences.'),
('Bandra West', 'Mumbai', 9.5, 9.2, 9.8, 7.9, 9.6, 8.8, 6.2, 8.7, 7.0, 'A+', 'The cultural queen of Mumbai. High walkability, seaside promenades, and gourmet nightlife.'),
('Powai', 'Mumbai', 8.4, 9.0, 8.1, 9.4, 9.5, 8.6, 6.8, 9.3, 8.1, 'A+', 'Lakeside tech enclave with premier institutes (IIT Bombay) and lush Hiranandani architecture.'),
('Andheri East', 'Mumbai', 8.6, 8.5, 8.0, 6.5, 9.2, 8.0, 5.8, 8.2, 6.0, 'A', 'Unmatched connectivity nexus with Metro Line 1 & 7, international airport, and SEEPZ.'),
('Lower Parel', 'Mumbai', 8.9, 9.1, 9.5, 6.8, 9.7, 8.7, 5.5, 8.4, 6.2, 'A', 'Skyscraper living with ultra-luxury corporate towers, High Street Phoenix, and Michelin dining.'),
('Worli', 'Mumbai', 8.7, 9.3, 8.9, 8.5, 9.6, 9.0, 7.2, 9.1, 7.5, 'A+', 'Iconic sea-facing luxury stretch with Sea Link access and prestigious high-rise gated clubs.'),
('Goregaon East', 'Mumbai', 8.1, 8.6, 7.6, 8.8, 9.1, 8.4, 6.4, 8.8, 7.3, 'A', 'Surrounded by Aarey greenery, top CBSE/IB schools, and Oberoi Mall ecosystem.'),
('Malad West', 'Mumbai', 8.5, 8.4, 8.2, 7.0, 9.0, 8.1, 6.0, 8.5, 6.6, 'A-', 'Vibrant residential pocket with Inorbit Mall, Mindspace IT corridor, and metro access.')
ON CONFLICT (locality) DO UPDATE SET
    walk_score = EXCLUDED.walk_score,
    safety_score = EXCLUDED.safety_score,
    nightlife_score = EXCLUDED.nightlife_score,
    greenery_score = EXCLUDED.greenery_score,
    overall_grade = EXCLUDED.overall_grade;

INSERT INTO public.locality_crime_stats (locality, crime_index, safety_grade, women_safety, police_station, police_distance_km, cctv_coverage, emergency_numbers)
VALUES
('BKC', 14.2, 'A+', 'Exceptional', 'BKC Police Station', 0.8, '98% Monitored (24x7 Patrol)', ARRAY['100', '112', '022-26504000']),
('Bandra West', 18.5, 'A+', 'Very High', 'Bandra Police Station (Hill Rd)', 1.1, '95% Monitored', ARRAY['100', '112', '022-26422002']),
('Powai', 19.8, 'A+', 'Very High', 'Powai Police Station', 1.4, '92% Monitored', ARRAY['100', '112', '022-25702690']),
('Andheri East', 26.5, 'A', 'High', 'Andheri Police Station', 1.2, '88% Monitored', ARRAY['100', '112', '022-28325656']),
('Lower Parel', 20.1, 'A+', 'Very High', 'N.M. Joshi Marg Police Station', 0.9, '96% Monitored', ARRAY['100', '112', '022-23086788']),
('Worli', 16.4, 'A+', 'Exceptional', 'Worli Police Station', 1.0, '97% Monitored', ARRAY['100', '112', '022-24933222']),
('Goregaon East', 23.2, 'A', 'High', 'Vanrai Police Station', 1.3, '89% Monitored', ARRAY['100', '112', '022-26859000']),
('Malad West', 24.8, 'A', 'High', 'Malad Police Station', 1.5, '87% Monitored', ARRAY['100', '112', '022-28822200'])
ON CONFLICT (locality) DO NOTHING;

INSERT INTO public.locality_air_quality (locality, aqi, pm25, pm10, humidity, temperature, noise_level_db, status)
VALUES
('BKC', 76, 23.5, 48.0, 62.0, 29.5, 54.0, 'Good to Moderate'),
('Bandra West', 68, 20.2, 42.0, 68.0, 28.5, 52.0, 'Moderate / Ocean Breeze'),
('Powai', 59, 17.5, 36.0, 60.0, 27.5, 46.0, 'Good / Lake Valley Clean Air'),
('Andheri East', 92, 31.0, 62.0, 61.0, 30.0, 64.0, 'Moderate'),
('Lower Parel', 84, 27.5, 54.0, 63.0, 29.0, 58.0, 'Moderate'),
('Worli', 64, 19.0, 39.0, 69.0, 28.0, 50.0, 'Good / Seafront Fresh Air'),
('Goregaon East', 66, 19.5, 41.0, 63.0, 28.5, 48.0, 'Good / Aarey Forest Border'),
('Malad West', 88, 29.0, 58.0, 65.0, 29.5, 60.0, 'Moderate')
ON CONFLICT (locality) DO NOTHING;

INSERT INTO public.water_supply_schedule (locality, tanker_frequency, municipal_supply_hours, borewell_available, tds_level, pressure_rating)
VALUES
('BKC', '0% — Zero Tanker Zone', '24 Hours Regulated Continuous Flow', TRUE, 140, 'Ultra-High (2.8 Bar)'),
('Bandra West', 'Rare / Summer Peak Only', '05:30 AM – 09:30 AM & 06:00 PM – 09:30 PM', TRUE, 160, 'High Pressure (2.4 Bar)'),
('Powai', 'Zero Tanker (Hiranandani Grid)', '24 Hours Pressurized Filtered Supply', TRUE, 130, 'High Pressure (2.5 Bar)'),
('Andheri East', 'Occasional (5% in May)', '06:00 AM – 09:00 AM & 06:30 PM – 08:30 PM', TRUE, 185, 'Standard (2.0 Bar)'),
('Lower Parel', 'Zero Tanker in Gated Highrises', '24 Hours Dual-Line Supply', TRUE, 150, 'High Pressure (2.6 Bar)'),
('Worli', 'Zero Tanker', '24 Hours Municipal & Treated Dual-Line', TRUE, 145, 'High Pressure (2.7 Bar)'),
('Goregaon East', 'Rare (2% in Summer)', '06:00 AM – 10:00 AM & 06:00 PM – 09:00 PM', TRUE, 170, 'Standard High (2.2 Bar)'),
('Malad West', 'Occasional (6% in Summer)', '06:00 AM – 09:00 AM & 07:00 PM – 09:00 PM', TRUE, 190, 'Standard (2.0 Bar)')
ON CONFLICT (locality) DO NOTHING;

INSERT INTO public.locality_places (locality, schools, hospitals, malls, cafes, gyms, metro, grocery, parks, pet_clinics, coworking, temples)
VALUES
('BKC',
 '[{"name": "Dhirubhai Ambani International School", "distance_km": 1.2, "rating": 4.9}, {"name": "American School of Bombay", "distance_km": 1.5, "rating": 4.8}]'::jsonb,
 '[{"name": "Asian Heart Institute", "distance_km": 0.9, "rating": 4.8}, {"name": "Guru Nanak Hospital", "distance_km": 2.1, "rating": 4.5}]'::jsonb,
 '[{"name": "Jio World Drive", "distance_km": 0.6, "rating": 4.9}, {"name": "Jio World Plaza", "distance_km": 0.8, "rating": 4.9}]'::jsonb,
 '[{"name": "Blue Tokai BKC", "distance_km": 0.4, "rating": 4.7}, {"name": "Subko Mini BKC", "distance_km": 0.5, "rating": 4.8}, {"name": "Bastian at The Top", "distance_km": 1.1, "rating": 4.7}]'::jsonb,
 '[{"name": "Gold’s Gym BKC", "distance_km": 0.7, "rating": 4.7}, {"name": "Cult.fit BKC Center", "distance_km": 0.5, "rating": 4.8}]'::jsonb,
 '[{"name": "BKC Metro Station (Line 3 Aqua)", "distance_km": 0.4, "rating": 4.9}, {"name": "Bandra Kurla Complex Monorail", "distance_km": 1.2, "rating": 4.3}]'::jsonb,
 '[{"name": "Foodhall Jio World", "distance_km": 0.6, "rating": 4.8}, {"name": "Nature’s Basket BKC", "distance_km": 0.8, "rating": 4.7}]'::jsonb,
 '[{"name": "BKC City Park", "distance_km": 0.5, "rating": 4.6}, {"name": "MMRDA Grounds Promenades", "distance_km": 0.9, "rating": 4.5}]'::jsonb,
 '[{"name": "Crown Vet BKC", "distance_km": 1.4, "rating": 4.8}]'::jsonb,
 '[{"name": "WeWork Enam Sambhav", "distance_km": 0.3, "rating": 4.8}, {"name": "Awfis Platina", "distance_km": 0.6, "rating": 4.6}]'::jsonb,
 '[{"name": "Shree Siddhivinayak Temple (Dadar)", "distance_km": 5.4, "rating": 4.9}]'::jsonb
),
('Bandra West',
 '[{"name": "St. Stanislaus High School", "distance_km": 0.8, "rating": 4.7}, {"name": "Arya Vidya Mandir", "distance_km": 1.4, "rating": 4.8}]'::jsonb,
 '[{"name": "Lilavati Hospital & Research Centre", "distance_km": 1.2, "rating": 4.7}, {"name": "Holy Family Hospital", "distance_km": 0.6, "rating": 4.6}]'::jsonb,
 '[{"name": "Linking Road Luxury Boutiques", "distance_km": 0.5, "rating": 4.7}, {"name": "Palladium Lower Parel", "distance_km": 7.0, "rating": 4.9}]'::jsonb,
 '[{"name": "Subko Coffee Bandra", "distance_km": 0.4, "rating": 4.9}, {"name": "Kuckuck Cafe", "distance_km": 0.5, "rating": 4.7}, {"name": "The Bombay Canteen (Nearby)", "distance_km": 6.2, "rating": 4.8}]'::jsonb,
 '[{"name": "Nitrrro Fitness Bandra", "distance_km": 0.6, "rating": 4.8}, {"name": "Cult.fit Pali Hill", "distance_km": 0.7, "rating": 4.8}]'::jsonb,
 '[{"name": "Bandra Railway & Metro Station", "distance_km": 1.3, "rating": 4.5}, {"name": "Khar Road Metro (Line 2B)", "distance_km": 1.5, "rating": 4.6}]'::jsonb,
 '[{"name": "Nature’s Basket Hill Road", "distance_km": 0.3, "rating": 4.8}, {"name": "Godrej Nature’s Basket", "distance_km": 0.9, "rating": 4.7}]'::jsonb,
 '[{"name": "Bandstand Sea Promenade", "distance_km": 0.6, "rating": 4.8}, {"name": "Carter Road Joggers Park", "distance_km": 1.1, "rating": 4.9}]'::jsonb,
 '[{"name": "Happy Tails Vet Bandra", "distance_km": 0.7, "rating": 4.8}]'::jsonb,
 '[{"name": "Ministry of New Coworking", "distance_km": 0.9, "rating": 4.7}, {"name": "WeWork Bandra", "distance_km": 1.4, "rating": 4.8}]'::jsonb,
 '[{"name": "Mount Mary Basilica", "distance_km": 0.8, "rating": 4.9}]'::jsonb
)
ON CONFLICT (locality) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 10. REALTIME PUBLICATION REFRESH
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.property_compare_sessions;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.neighborhood_scores;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.locality_air_quality;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
