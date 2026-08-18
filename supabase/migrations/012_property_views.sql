-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 012_property_views.sql
-- Description: Real property view tracking, deduplication RPC, and RLS policies
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PROPERTY VIEWS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast analytics aggregation
CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON public.property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_viewer_id ON public.property_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_property_views_created_at ON public.property_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_property_views_dedupe ON public.property_views(property_id, viewer_id, session_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 2. TRIGGER: AUTO-INCREMENT properties.views_count
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_property_view_increment()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.properties
    SET views_count = COALESCE(views_count, 0) + 1
    WHERE id = NEW.property_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_property_view_increment ON public.property_views;
CREATE TRIGGER trg_property_view_increment
    AFTER INSERT ON public.property_views
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_property_view_increment();

-- ------------------------------------------------------------------------------
-- 3. DEDUPLICATED VIEW RECORDING RPC FUNCTION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.record_property_view(
    p_property_id UUID,
    p_viewer_id UUID DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_owner_id UUID;
    v_recent_count INT;
BEGIN
    -- 1. Check property existence & owner
    SELECT owner_id INTO v_owner_id FROM public.properties WHERE id = p_property_id;
    IF v_owner_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- 2. Prevent owners from inflating views on their own listings
    IF p_viewer_id IS NOT NULL AND p_viewer_id = v_owner_id THEN
        RETURN FALSE;
    END IF;

    -- 3. Deduplication rule: 1 legitimate view per viewer/session per property within 30 minutes
    SELECT COUNT(*) INTO v_recent_count
    FROM public.property_views
    WHERE property_id = p_property_id
      AND (
          (p_viewer_id IS NOT NULL AND viewer_id = p_viewer_id) OR
          (p_session_id IS NOT NULL AND session_id = p_session_id)
      )
      AND created_at >= NOW() - INTERVAL '30 minutes';

    IF v_recent_count > 0 THEN
        RETURN FALSE; -- Already counted recently
    END IF;

    -- 4. Record new view event
    INSERT INTO public.property_views (property_id, viewer_id, session_id)
    VALUES (p_property_id, p_viewer_id, p_session_id);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 4. ROW-LEVEL SECURITY POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

-- Allow any user (authenticated or anonymous) to record a view
DROP POLICY IF EXISTS "Allow public view logging" ON public.property_views;
CREATE POLICY "Allow public view logging"
    ON public.property_views
    FOR INSERT
    WITH CHECK (true);

-- Allow property owners to read view logs for their own listings
DROP POLICY IF EXISTS "Allow owners to view analytics for their properties" ON public.property_views;
CREATE POLICY "Allow owners to view analytics for their properties"
    ON public.property_views
    FOR SELECT
    USING (
        property_id IN (
            SELECT id FROM public.properties WHERE owner_id = auth.uid()
        )
    );

-- Allow admins to read all view records
DROP POLICY IF EXISTS "Allow admins to view all property views" ON public.property_views;
CREATE POLICY "Allow admins to view all property views"
    ON public.property_views
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE email = auth.jwt()->>'email' AND status = 'active'
        )
    );
