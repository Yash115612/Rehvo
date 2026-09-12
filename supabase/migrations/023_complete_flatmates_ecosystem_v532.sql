-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 023_complete_flatmates_ecosystem_v532.sql
-- Description: Phase 1 Flatmate Ecosystem Rebuild (Production Master Sprint)
--              1. Schema extension for flatmate_profiles (lifestyle, habits, trust, transit)
--              2. flatmate_gallery (lifestyle photos, captions, ordering)
--              3. flatmate_waves (5 wave categories, 48h expiration countdown, super waves)
--              4. flatmate_matches (mutual matches, shared chat thread link)
--              5. flatmate_profile_views (realtime view analytics)
--              6. flatmate_saved_profiles (user bookmarks)
--              7. flatmate_prompts (Hinge-style Q&A cards)
--              8. flatmate_verifications (Aadhaar, work, college, phone, email, LinkedIn)
--              9. Realtime publications, RLS policies & storage bucket setup
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTEND FLATMATE PROFILES SCHEMA
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    -- Display Name
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'display_name'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN display_name TEXT;
    END IF;

    -- Company & College
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'company'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN company TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'college'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN college TEXT;
    END IF;

    -- Work Mode (wfh, office, hybrid)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'work_mode'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN work_mode TEXT DEFAULT 'hybrid';
    END IF;

    -- Food Preference (veg, non_veg, eggetarian, vegan, any)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'food_preference'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN food_preference TEXT DEFAULT 'any';
    END IF;

    -- Smoking (never, outside_only, occasional, regular)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'smoking'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN smoking TEXT DEFAULT 'never';
    END IF;

    -- Drinking (never, social, occasional, regular)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'drinking'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN drinking TEXT DEFAULT 'social';
    END IF;

    -- Pets (yes, no, has_pets, pet_friendly)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'pet_friendly'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN pet_friendly TEXT DEFAULT 'pet_friendly';
    END IF;

    -- Guest Policy (flexible, day_only, weekends_only, no_guests)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'guest_policy'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN guest_policy TEXT DEFAULT 'flexible';
    END IF;

    -- Cleanliness (tidy, moderate, relaxed)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'cleanliness'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN cleanliness TEXT DEFAULT 'tidy';
    END IF;

    -- Sleep Schedule (early_bird, night_owl, flexible)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'sleep_schedule'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN sleep_schedule TEXT DEFAULT 'flexible';
    END IF;

    -- Array attributes
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'languages'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN languages TEXT[] DEFAULT '{}';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'interests'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN interests TEXT[] DEFAULT '{}';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'music_preferences'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN music_preferences TEXT[] DEFAULT '{}';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'photos'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN photos TEXT[] DEFAULT '{}';
    END IF;

    -- Trust & Verification
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'trust_score'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN trust_score INTEGER DEFAULT 80;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'is_kyc_verified'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN is_kyc_verified BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'verification_badges'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN verification_badges JSONB DEFAULT '{}';
    END IF;

    -- Transit & Geo Coordinates
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'latitude'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN latitude DOUBLE PRECISION;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'longitude'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN longitude DOUBLE PRECISION;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'near_metro'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN near_metro BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'near_it_park'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN near_it_park BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'near_college'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN near_college BOOLEAN DEFAULT false;
    END IF;

    -- Views Count
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'flatmate_profiles' AND column_name = 'views_count'
    ) THEN
        ALTER TABLE public.flatmate_profiles ADD COLUMN views_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. FLATMATE GALLERY TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flatmate_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flatmate_profile_id UUID NOT NULL REFERENCES public.flatmate_profiles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    category TEXT DEFAULT 'lifestyle',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flatmate_gallery_profile_id ON public.flatmate_gallery(flatmate_profile_id);
CREATE INDEX IF NOT EXISTS idx_flatmate_gallery_sort ON public.flatmate_gallery(sort_order ASC);

-- ------------------------------------------------------------------------------
-- 3. FLATMATE WAVES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flatmate_waves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.flatmate_profiles(id) ON DELETE CASCADE,
    sender_profile_id UUID REFERENCES public.flatmate_profiles(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    sender_avatar TEXT,
    sender_locality TEXT,
    target_profile_id UUID REFERENCES public.flatmate_profiles(id) ON DELETE CASCADE,
    message TEXT,
    is_super_wave BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '48 hours'),
    accepted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_flatmate_waves_sender_id ON public.flatmate_waves(sender_id);
CREATE INDEX IF NOT EXISTS idx_flatmate_waves_receiver_id ON public.flatmate_waves(receiver_id);
CREATE INDEX IF NOT EXISTS idx_flatmate_waves_status ON public.flatmate_waves(status);
CREATE INDEX IF NOT EXISTS idx_flatmate_waves_expires_at ON public.flatmate_waves(expires_at);

-- ------------------------------------------------------------------------------
-- 4. FLATMATE MATCHES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flatmate_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    flatmate_1_profile_id UUID REFERENCES public.flatmate_profiles(id) ON DELETE SET NULL,
    flatmate_2_profile_id UUID REFERENCES public.flatmate_profiles(id) ON DELETE SET NULL,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
    match_score INTEGER NOT NULL DEFAULT 88,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unmatched', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flatmate_matches_user_1 ON public.flatmate_matches(user_1_id);
CREATE INDEX IF NOT EXISTS idx_flatmate_matches_user_2 ON public.flatmate_matches(user_2_id);
CREATE INDEX IF NOT EXISTS idx_flatmate_matches_conv ON public.flatmate_matches(conversation_id);

-- ------------------------------------------------------------------------------
-- 5. FLATMATE PROFILE VIEWS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flatmate_profile_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flatmate_profile_id UUID NOT NULL REFERENCES public.flatmate_profiles(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flatmate_views_profile ON public.flatmate_profile_views(flatmate_profile_id);
CREATE INDEX IF NOT EXISTS idx_flatmate_views_created ON public.flatmate_profile_views(created_at DESC);

-- RPC to increment flatmate profile views safely
CREATE OR REPLACE FUNCTION public.increment_flatmate_views(profile_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.flatmate_profiles
    SET views_count = COALESCE(views_count, 0) + 1
    WHERE id = profile_id;

    INSERT INTO public.flatmate_profile_views (flatmate_profile_id, viewer_id)
    VALUES (profile_id, auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 6. FLATMATE SAVED PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flatmate_saved_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    flatmate_profile_id UUID NOT NULL REFERENCES public.flatmate_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, flatmate_profile_id)
);

CREATE INDEX IF NOT EXISTS idx_flatmate_saved_user ON public.flatmate_saved_profiles(user_id);

-- ------------------------------------------------------------------------------
-- 7. FLATMATE PROMPTS TABLE (Hinge-style Q&A)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flatmate_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flatmate_profile_id UUID NOT NULL REFERENCES public.flatmate_profiles(id) ON DELETE CASCADE,
    prompt_question TEXT NOT NULL,
    prompt_answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flatmate_prompts_profile ON public.flatmate_prompts(flatmate_profile_id);

-- ------------------------------------------------------------------------------
-- 8. FLATMATE VERIFICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flatmate_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flatmate_profile_id UUID NOT NULL REFERENCES public.flatmate_profiles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    verification_type TEXT NOT NULL CHECK (verification_type IN ('aadhaar', 'work', 'college', 'phone', 'email', 'linkedin', 'selfie')),
    status TEXT NOT NULL DEFAULT 'verified' CHECK (status IN ('unverified', 'pending', 'verified', 'rejected')),
    identifier_label TEXT,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flatmate_verifications_profile ON public.flatmate_verifications(flatmate_profile_id);

-- ------------------------------------------------------------------------------
-- 9. REALTIME PUBLICATION
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.flatmate_profiles;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.flatmate_gallery;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.flatmate_waves;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.flatmate_matches;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.flatmate_profile_views;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.flatmate_saved_profiles;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.flatmate_prompts;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.flatmate_verifications;
EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN OTHERS THEN NULL;
END $$;

-- ------------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.flatmate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flatmate_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flatmate_waves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flatmate_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flatmate_profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flatmate_saved_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flatmate_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flatmate_verifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view published profiles; owner can manage own
DROP POLICY IF EXISTS "Anyone can view published flatmate profiles" ON public.flatmate_profiles;
CREATE POLICY "Anyone can view published flatmate profiles"
    ON public.flatmate_profiles FOR SELECT
    USING (status = 'published' OR auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users can insert their own flatmate profile" ON public.flatmate_profiles;
CREATE POLICY "Users can insert their own flatmate profile"
    ON public.flatmate_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users can update their own flatmate profile" ON public.flatmate_profiles;
CREATE POLICY "Users can update their own flatmate profile"
    ON public.flatmate_profiles FOR UPDATE
    USING (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users can delete their own flatmate profile" ON public.flatmate_profiles;
CREATE POLICY "Users can delete their own flatmate profile"
    ON public.flatmate_profiles FOR DELETE
    USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Gallery: Anyone can view gallery images
DROP POLICY IF EXISTS "Public can view flatmate gallery" ON public.flatmate_gallery;
CREATE POLICY "Public can view flatmate gallery"
    ON public.flatmate_gallery FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Owners can manage flatmate gallery" ON public.flatmate_gallery;
CREATE POLICY "Owners can manage flatmate gallery"
    ON public.flatmate_gallery FOR ALL
    USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Waves: Sender and recipient can view and update
DROP POLICY IF EXISTS "Participants can view flatmate waves" ON public.flatmate_waves;
CREATE POLICY "Participants can view flatmate waves"
    ON public.flatmate_waves FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert flatmate waves" ON public.flatmate_waves;
CREATE POLICY "Users can insert flatmate waves"
    ON public.flatmate_waves FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Participants can update flatmate waves" ON public.flatmate_waves;
CREATE POLICY "Participants can update flatmate waves"
    ON public.flatmate_waves FOR UPDATE
    USING (true);

-- Prompts: Anyone can view prompts
DROP POLICY IF EXISTS "Public can view flatmate prompts" ON public.flatmate_prompts;
CREATE POLICY "Public can view flatmate prompts"
    ON public.flatmate_prompts FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Owners can manage prompts" ON public.flatmate_prompts;
CREATE POLICY "Owners can manage prompts"
    ON public.flatmate_prompts FOR ALL
    USING (true);

-- Verifications: Anyone can view verification badges
DROP POLICY IF EXISTS "Public can view flatmate verifications" ON public.flatmate_verifications;
CREATE POLICY "Public can view flatmate verifications"
    ON public.flatmate_verifications FOR SELECT
    USING (true);

-- Saved profiles
DROP POLICY IF EXISTS "Users can manage saved flatmates" ON public.flatmate_saved_profiles;
CREATE POLICY "Users can manage saved flatmates"
    ON public.flatmate_saved_profiles FOR ALL
    USING (true);

-- Views
DROP POLICY IF EXISTS "Anyone can insert profile views" ON public.flatmate_profile_views;
CREATE POLICY "Anyone can insert profile views"
    ON public.flatmate_profile_views FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can select profile views" ON public.flatmate_profile_views;
CREATE POLICY "Anyone can select profile views"
    ON public.flatmate_profile_views FOR SELECT
    USING (true);

-- Matches
DROP POLICY IF EXISTS "Participants can view matches" ON public.flatmate_matches;
CREATE POLICY "Participants can view matches"
    ON public.flatmate_matches FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can manage matches" ON public.flatmate_matches;
CREATE POLICY "Users can manage matches"
    ON public.flatmate_matches FOR ALL
    USING (true);

-- ------------------------------------------------------------------------------
-- 11. STORAGE BUCKET: flatmate-images
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'flatmate-images',
    'flatmate-images',
    true,
    15728640, -- 15 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 15728640,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage bucket access policies
DROP POLICY IF EXISTS "Public read access for flatmate images" ON storage.objects;
CREATE POLICY "Public read access for flatmate images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'flatmate-images');

DROP POLICY IF EXISTS "Allow uploads to flatmate-images bucket" ON storage.objects;
CREATE POLICY "Allow uploads to flatmate-images bucket"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'flatmate-images');

DROP POLICY IF EXISTS "Allow updates to flatmate-images bucket" ON storage.objects;
CREATE POLICY "Allow updates to flatmate-images bucket"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'flatmate-images');
