-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 016_production_backend_expansion.sql
-- Description: Production tables for KYC Verifications, Saved/Recent Searches,
--              Flatmate Social/Posts, Device Tracking, Safety Moderation,
--              Storage Buckets, RLS, and Stored Procedures / RPCs.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. KYC VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.kyc_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_legal_name TEXT NOT NULL,
    aadhaar_number_masked TEXT,
    aadhaar_front_url TEXT,
    aadhaar_back_url TEXT,
    pan_number_masked TEXT,
    pan_doc_url TEXT,
    selfie_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('unverified', 'pending', 'verified', 'rejected')),
    rejection_reason TEXT,
    admin_notes TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_kyc_verifications_user ON public.kyc_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_status ON public.kyc_verifications(status);

-- 3. SAVED SEARCHES TABLE
CREATE TABLE IF NOT EXISTS public.saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'residential',
    locality TEXT,
    city TEXT DEFAULT 'Mumbai',
    budget_min NUMERIC,
    budget_max NUMERIC,
    bhk TEXT[],
    furnishing TEXT[],
    property_types TEXT[],
    notify_email BOOLEAN DEFAULT TRUE,
    notify_push BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON public.saved_searches(user_id);

-- 4. RECENT SEARCHES TABLE
CREATE TABLE IF NOT EXISTS public.recent_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    filter_payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_recent_searches_user ON public.recent_searches(user_id, created_at DESC);

-- 5. USER DEVICES & PUSH TOKENS TABLE
CREATE TABLE IF NOT EXISTS public.user_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    push_token TEXT,
    platform TEXT CHECK (platform IN ('ios', 'android', 'web')),
    app_version TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_device UNIQUE (user_id, device_id)
);

CREATE INDEX IF NOT EXISTS idx_user_devices_token ON public.user_devices(push_token);

-- 6. FLATMATE POSTS, COMMENTS, LIKES & WAVES TABLES
CREATE TABLE IF NOT EXISTS public.flatmate_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_urls TEXT[] DEFAULT '{}',
    locality TEXT,
    city TEXT DEFAULT 'Mumbai',
    likes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_flatmate_posts_author ON public.flatmate_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_flatmate_posts_created ON public.flatmate_posts(created_at DESC);

CREATE TABLE IF NOT EXISTS public.flatmate_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.flatmate_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_flatmate_comments_post ON public.flatmate_comments(post_id);

CREATE TABLE IF NOT EXISTS public.flatmate_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.flatmate_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_post_user_like UNIQUE (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.flatmate_waves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    intro_message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_wave_sender_receiver UNIQUE (sender_id, receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_flatmate_waves_receiver ON public.flatmate_waves(receiver_id, status);

-- 7. SAFETY REPORTS & MODERATION TABLE
CREATE TABLE IF NOT EXISTS public.safety_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('property', 'user', 'chat_message', 'flatmate_post')),
    target_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_safety_reports_target ON public.safety_reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_safety_reports_status ON public.safety_reports(status);

-- 8. USER BLOCKS TABLE
CREATE TABLE IF NOT EXISTS public.user_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_block UNIQUE (blocker_id, blocked_id)
);

-- 9. PROVISION MISSING STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('chat-media', 'chat-media', FALSE, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf']),
    ('flatmate-media', 'flatmate-media', TRUE, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'video/mp4']),
    ('verification-selfies', 'verification-selfies', FALSE, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp']),
    ('agreements', 'agreements', FALSE, 20971520, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 10. ROW LEVEL SECURITY (RLS) POLICIES

-- kyc_verifications
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own KYC records"
    ON public.kyc_verifications FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert their own KYC record"
    ON public.kyc_verifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending KYC record"
    ON public.kyc_verifications FOR UPDATE
    USING (auth.uid() = user_id AND status = 'pending');

-- saved_searches
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved searches"
    ON public.saved_searches FOR ALL
    USING (auth.uid() = user_id);

-- recent_searches
ALTER TABLE public.recent_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own recent searches"
    ON public.recent_searches FOR ALL
    USING (auth.uid() = user_id);

-- user_devices
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own devices"
    ON public.user_devices FOR ALL
    USING (auth.uid() = user_id);

-- flatmate_posts & comments
ALTER TABLE public.flatmate_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flatmate_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flatmate_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flatmate_waves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view flatmate posts"
    ON public.flatmate_posts FOR SELECT
    USING (TRUE);

CREATE POLICY "Authenticated users can create posts"
    ON public.flatmate_posts FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update/delete their posts"
    ON public.flatmate_posts FOR ALL
    USING (auth.uid() = author_id OR public.is_admin());

CREATE POLICY "Public can view flatmate comments"
    ON public.flatmate_comments FOR SELECT
    USING (TRUE);

CREATE POLICY "Authenticated users can comment"
    ON public.flatmate_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their likes"
    ON public.flatmate_likes FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Wave participants can view their waves"
    ON public.flatmate_waves FOR SELECT
    USING (auth.uid() IN (sender_id, receiver_id));

CREATE POLICY "Users can send waves"
    ON public.flatmate_waves FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Receivers can update wave status"
    ON public.flatmate_waves FOR UPDATE
    USING (auth.uid() = receiver_id);

-- safety_reports & user_blocks
ALTER TABLE public.safety_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reporters can view their reports"
    ON public.safety_reports FOR SELECT
    USING (auth.uid() = reporter_id OR public.is_admin());

CREATE POLICY "Authenticated users can submit reports"
    ON public.safety_reports FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can manage their blocks"
    ON public.user_blocks FOR ALL
    USING (auth.uid() = blocker_id);

-- 11. STORED PROCEDURES / RPCS

-- Spatial & Multi-Parameter Property Search
CREATE OR REPLACE FUNCTION public.search_properties_advanced(
    p_category TEXT DEFAULT NULL,
    p_property_types TEXT[] DEFAULT NULL,
    p_locality TEXT DEFAULT NULL,
    p_city TEXT DEFAULT 'Mumbai',
    p_budget_min NUMERIC DEFAULT NULL,
    p_budget_max NUMERIC DEFAULT NULL,
    p_bhk TEXT[] DEFAULT NULL,
    p_furnishing TEXT[] DEFAULT NULL,
    p_verified_only BOOLEAN DEFAULT FALSE,
    p_sort_by TEXT DEFAULT 'newest',
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    owner_id UUID,
    title TEXT,
    description TEXT,
    price NUMERIC,
    deposit NUMERIC,
    locality TEXT,
    city TEXT,
    bedrooms TEXT,
    bathrooms INTEGER,
    area NUMERIC,
    furnishing TEXT,
    category TEXT,
    type TEXT,
    status TEXT,
    created_at TIMESTAMPTZ,
    views_count INTEGER,
    saves_count INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.owner_id,
        p.title,
        p.description,
        p.price,
        p.deposit,
        p.locality,
        p.city,
        p.bedrooms,
        p.bathrooms,
        p.area,
        p.furnishing::TEXT,
        p.category::TEXT,
        p.type::TEXT,
        p.status,
        p.created_at,
        p.views_count,
        p.saves_count
    FROM public.properties p
    WHERE p.status = 'published'
      AND (p_category IS NULL OR p.category::TEXT = p_category)
      AND (p_property_types IS NULL OR p.type::TEXT = ANY(p_property_types))
      AND (p_locality IS NULL OR p.locality ILIKE '%' || p_locality || '%')
      AND (p_city IS NULL OR p.city ILIKE '%' || p_city || '%')
      AND (p_budget_min IS NULL OR p.price >= p_budget_min)
      AND (p_budget_max IS NULL OR p.price <= p_budget_max)
      AND (p_bhk IS NULL OR p.bedrooms = ANY(p_bhk))
      AND (p_furnishing IS NULL OR p.furnishing::TEXT = ANY(p_furnishing))
    ORDER BY
        CASE WHEN p_sort_by = 'price_asc' THEN p.price END ASC,
        CASE WHEN p_sort_by = 'price_desc' THEN p.price END DESC,
        CASE WHEN p_sort_by = 'views' THEN p.views_count END DESC,
        p.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$;

-- Atomic Property Counter Increment
CREATE OR REPLACE FUNCTION public.increment_property_counter(
    p_property_id UUID,
    p_field TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF p_field = 'views' THEN
        UPDATE public.properties SET views_count = views_count + 1 WHERE id = p_property_id;
    ELSIF p_field = 'saves' THEN
        UPDATE public.properties SET saves_count = saves_count + 1 WHERE id = p_property_id;
    ELSIF p_field = 'shares' THEN
        -- Recorded in analytics
        NULL;
    END IF;
END;
$$;

-- Complete Account Purge (GDPR / Apple App Store Guideline 5.1.1(v))
CREATE OR REPLACE FUNCTION public.cleanup_user_account(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only the user or admin can trigger account deletion
    IF auth.uid() <> p_user_id AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized account deletion.';
    END IF;

    DELETE FROM public.profiles WHERE id = p_user_id;
    DELETE FROM auth.users WHERE id = p_user_id;
END;
$$;
