-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 036_ai_recommendations.sql
-- Description: REHVO V6.2 Step 1 — AI Property Recommendation Engine
-- Tables: property_recommendations, user_property_views, saved_searches, recommendation_feedback
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SAVED SEARCHES & USER SEARCH PREFERENCES
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON public.saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_city ON public.saved_searches(city);

-- ------------------------------------------------------------------------------
-- 2. USER PROPERTY VIEWS & ENGAGEMENT HISTORY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_property_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    duration_seconds INT NOT NULL DEFAULT 0,
    view_count INT NOT NULL DEFAULT 1,
    last_viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_property_views UNIQUE(user_id, property_id)
);

CREATE INDEX IF NOT EXISTS idx_user_prop_views_user ON public.user_property_views(user_id);
CREATE INDEX IF NOT EXISTS idx_user_prop_views_prop ON public.user_property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_user_prop_views_recent ON public.user_property_views(user_id, last_viewed_at DESC);

-- ------------------------------------------------------------------------------
-- 3. RECOMMENDATION FEEDBACK (INTERESTED / NOT INTERESTED)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recommendation_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    interested BOOLEAN NOT NULL, -- true = interested / saved, false = not interested / dismissed
    feedback_reason TEXT, -- e.g. "Too expensive", "Wrong location", "Too small", "Not my vibe"
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_recommendation_feedback UNIQUE(user_id, property_id)
);

CREATE INDEX IF NOT EXISTS idx_rec_feedback_user ON public.recommendation_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_rec_feedback_interested ON public.recommendation_feedback(user_id, interested);

-- ------------------------------------------------------------------------------
-- 4. PROPERTY RECOMMENDATIONS CACHE / PERSISTENCE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) NOT NULL DEFAULT 0, -- 0.00 to 100.00
    match_reasons JSONB NOT NULL DEFAULT '[]'::jsonb, -- e.g. ["Within your ₹40k budget", "Matches Bandra West"]
    category TEXT NOT NULL DEFAULT 'recommended', -- 'recommended', 'similar_saved', 'near_office', 'trending', 'zero_deposit', 'luxury', 'weekend'
    is_dismissed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_property_recommendations UNIQUE(user_id, property_id, category)
);

CREATE INDEX IF NOT EXISTS idx_prop_rec_user_category ON public.property_recommendations(user_id, category, is_dismissed);
CREATE INDEX IF NOT EXISTS idx_prop_rec_score ON public.property_recommendations(user_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_prop_rec_prop ON public.property_recommendations(property_id);

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_recommendations ENABLE ROW LEVEL SECURITY;

-- Saved Searches Policies
DROP POLICY IF EXISTS "Users can view own saved searches" ON public.saved_searches;
CREATE POLICY "Users can view own saved searches"
    ON public.saved_searches FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own saved searches" ON public.saved_searches;
CREATE POLICY "Users can insert own saved searches"
    ON public.saved_searches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own saved searches" ON public.saved_searches;
CREATE POLICY "Users can update own saved searches"
    ON public.saved_searches FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own saved searches" ON public.saved_searches;
CREATE POLICY "Users can delete own saved searches"
    ON public.saved_searches FOR DELETE
    USING (auth.uid() = user_id);

-- User Property Views Policies
DROP POLICY IF EXISTS "Users can view own property views" ON public.user_property_views;
CREATE POLICY "Users can view own property views"
    ON public.user_property_views FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert/update own property views" ON public.user_property_views;
CREATE POLICY "Users can insert/update own property views"
    ON public.user_property_views FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Recommendation Feedback Policies
DROP POLICY IF EXISTS "Users can view own feedback" ON public.recommendation_feedback;
CREATE POLICY "Users can view own feedback"
    ON public.recommendation_feedback FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert/update own feedback" ON public.recommendation_feedback;
CREATE POLICY "Users can insert/update own feedback"
    ON public.recommendation_feedback FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Property Recommendations Policies
DROP POLICY IF EXISTS "Users can view own recommendations" ON public.property_recommendations;
CREATE POLICY "Users can view own recommendations"
    ON public.property_recommendations FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own recommendations" ON public.property_recommendations;
CREATE POLICY "Users can manage own recommendations"
    ON public.property_recommendations FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 6. REALTIME PUBLICATION
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.property_recommendations;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.recommendation_feedback;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
END $$;
