-- =============================================================================
-- REHVO V7.1: REAL MAPS + CAMERA + VOICE AI OPERATING SYSTEM MIGRATION
-- Migration: 040_maps_camera_voice_v71.sql
-- Description: Complete database schema for GPS location telemetry, saved places,
--              property route history, voice AI queries, OCR document extraction,
--              media upload tracking, and storage bucket configuration.
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. LOCATION HISTORY (Real-time GPS Telemetry)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.location_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    accuracy NUMERIC(8, 2),
    heading NUMERIC(6, 2),
    speed NUMERIC(8, 2),
    address TEXT,
    locality TEXT NOT NULL DEFAULT 'Bandra West',
    city TEXT NOT NULL DEFAULT 'Mumbai',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. SAVED PLACES (Home, Office, College, Gym, Favorites)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    place_type TEXT NOT NULL CHECK (place_type IN ('home', 'office', 'college', 'gym', 'favorite', 'custom')),
    label TEXT NOT NULL,
    address TEXT NOT NULL,
    locality TEXT NOT NULL DEFAULT 'Mumbai',
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'MapPin',
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. PROPERTY ROUTE HISTORY (Multi-Modal Transit & Navigation Analytics)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_route_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    property_id TEXT NOT NULL,
    origin_lat NUMERIC(10, 7) NOT NULL,
    origin_lng NUMERIC(10, 7) NOT NULL,
    origin_address TEXT,
    destination_lat NUMERIC(10, 7) NOT NULL,
    destination_lng NUMERIC(10, 7) NOT NULL,
    destination_address TEXT,
    transit_mode TEXT NOT NULL CHECK (transit_mode IN ('walk', 'bike', 'car', 'metro', 'bus', 'auto')),
    eta_minutes INTEGER NOT NULL,
    distance_km NUMERIC(8, 2) NOT NULL,
    fare_estimate NUMERIC(8, 2) NOT NULL DEFAULT 0,
    co2_grams NUMERIC(8, 2) NOT NULL DEFAULT 0,
    is_peak_hour BOOLEAN NOT NULL DEFAULT false,
    navigated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. VOICE QUERIES (Multi-lingual Speech Telemetry)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.voice_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    audio_duration_ms INTEGER NOT NULL DEFAULT 0,
    language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'hi', 'hinglish')),
    raw_transcript TEXT NOT NULL,
    detected_intent TEXT NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL DEFAULT 95.0,
    response_text TEXT,
    executed_action TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. OCR DOCUMENTS (Automated Verification & Extraction)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ocr_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    document_type TEXT NOT NULL CHECK (document_type IN (
        'aadhaar',
        'pan',
        'driving_license',
        'passport',
        'rent_agreement',
        'electricity_bill',
        'water_bill',
        'gas_bill'
    )),
    document_number_masked TEXT NOT NULL,
    extracted_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    ocr_raw_text TEXT,
    confidence_score NUMERIC(5, 2) NOT NULL DEFAULT 90.0,
    verification_status TEXT NOT NULL DEFAULT 'VERIFIED' CHECK (verification_status IN ('VERIFIED', 'REVIEW_NEEDED', 'REJECTED')),
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. MEDIA UPLOADS (Background Upload Pipeline & Offline Retry Queue)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    bucket_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    upload_status TEXT NOT NULL DEFAULT 'pending' CHECK (upload_status IN ('pending', 'uploading', 'completed', 'failed')),
    progress_percent INTEGER NOT NULL DEFAULT 0,
    public_url TEXT,
    thumbnail_url TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. PROPERTY MEDIA METADATA (High-Res Photos, 360, Floorplans, Videos)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_media_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id TEXT NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'photo' CHECK (media_type IN ('photo', 'video', '360', 'floorplan')),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    title TEXT,
    category TEXT NOT NULL DEFAULT 'living_room' CHECK (category IN (
        'living_room',
        'master_bedroom',
        'bedroom',
        'kitchen',
        'balcony',
        'bathroom',
        'exterior',
        'amenity',
        'floorplan',
        'other'
    )),
    sort_order INTEGER NOT NULL DEFAULT 0,
    ai_quality_score NUMERIC(4, 2) NOT NULL DEFAULT 9.2,
    is_cover BOOLEAN NOT NULL DEFAULT false,
    width INTEGER,
    height INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. CAMERA SESSIONS (Session Auditing & Watermarking)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.camera_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    session_type TEXT NOT NULL CHECK (session_type IN (
        'property_listing',
        'kyc_verification',
        'movein_inspection',
        'flatmate_profile',
        'document_scan'
    )),
    photos_captured_count INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- PERFORMANCE INDEXES
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_location_history_user ON public.location_history(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_places_user ON public.saved_places(user_id);
CREATE INDEX IF NOT EXISTS idx_property_route_user ON public.property_route_history(user_id, property_id);
CREATE INDEX IF NOT EXISTS idx_voice_queries_user ON public.voice_queries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ocr_documents_user ON public.ocr_documents(user_id, document_type);
CREATE INDEX IF NOT EXISTS idx_media_uploads_status ON public.media_uploads(upload_status, retry_count);
CREATE INDEX IF NOT EXISTS idx_property_media_prop ON public.property_media_metadata(property_id, sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_camera_sessions_user ON public.camera_sessions(user_id, session_type);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE public.location_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_route_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ocr_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_media_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camera_sessions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on location_history') THEN
        CREATE POLICY "Allow public access on location_history" ON public.location_history FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on saved_places') THEN
        CREATE POLICY "Allow public access on saved_places" ON public.saved_places FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on property_route_history') THEN
        CREATE POLICY "Allow public access on property_route_history" ON public.property_route_history FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on voice_queries') THEN
        CREATE POLICY "Allow public access on voice_queries" ON public.voice_queries FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on ocr_documents') THEN
        CREATE POLICY "Allow public access on ocr_documents" ON public.ocr_documents FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on media_uploads') THEN
        CREATE POLICY "Allow public access on media_uploads" ON public.media_uploads FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on property_media_metadata') THEN
        CREATE POLICY "Allow public access on property_media_metadata" ON public.property_media_metadata FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on camera_sessions') THEN
        CREATE POLICY "Allow public access on camera_sessions" ON public.camera_sessions FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- REALTIME PUBLICATION
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.location_history;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_places;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.media_uploads;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- STORAGE BUCKETS (Create and grant public access for media)
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('property-images', 'property-images', true),
    ('property-videos', 'property-videos', true),
    ('kyc-documents', 'kyc-documents', false),
    ('profile-images', 'profile-images', true),
    ('flatmate-images', 'flatmate-images', true),
    ('agreement-files', 'agreement-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read on public buckets') THEN
        CREATE POLICY "Allow public read on public buckets" ON storage.objects
        FOR SELECT USING (bucket_id IN ('property-images', 'property-videos', 'profile-images', 'flatmate-images'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated upload on storage objects') THEN
        CREATE POLICY "Allow authenticated upload on storage objects" ON storage.objects
        FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- SEED DATA (Curated Starter Places for Mumbai)
-- -----------------------------------------------------------------------------
INSERT INTO public.saved_places (id, place_type, label, address, locality, latitude, longitude, icon_name, is_default)
VALUES 
    ('b1000000-0000-0000-0000-000000000001', 'office', 'BKC Corporate Hub', 'Bandra Kurla Complex, G Block, Mumbai', 'BKC', 19.0657, 72.8687, 'Briefcase', true),
    ('b1000000-0000-0000-0000-000000000002', 'home', 'Bandra West (Favorite)', 'Pali Hill, Nargis Dutt Road, Mumbai', 'Bandra West', 19.0607, 72.8273, 'Home', false),
    ('b1000000-0000-0000-0000-000000000003', 'college', 'IIT Bombay', 'Main Gate Road, Powai, Mumbai', 'Powai', 19.1334, 72.9133, 'GraduationCap', false),
    ('b1000000-0000-0000-0000-000000000004', 'gym', 'Gold’s Gym Bandra', 'Turner Road, Bandra West, Mumbai', 'Bandra West', 19.0583, 72.8338, 'Dumbbell', false)
ON CONFLICT (id) DO NOTHING;
