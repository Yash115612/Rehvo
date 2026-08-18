-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 013_owner_dashboard_metrics.sql
-- Description: Real owner dashboard metrics aggregation RPC
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.get_owner_dashboard_metrics(p_owner_id UUID)
RETURNS JSON AS $$
DECLARE
    v_total_properties INT := 0;
    v_active_properties INT := 0;
    v_paused_properties INT := 0;
    v_draft_properties INT := 0;
    v_rented_properties INT := 0;
    v_total_views INT := 0;
    v_views_this_week INT := 0;
    v_views_last_week INT := 0;
    v_total_enquiries INT := 0;
    v_pending_enquiries INT := 0;
    v_contacted_enquiries INT := 0;
    v_scheduled_enquiries INT := 0;
    v_closed_enquiries INT := 0;
    v_total_visits INT := 0;
    v_pending_visits INT := 0;
    v_confirmed_visits INT := 0;
    v_completed_visits INT := 0;
    v_cancelled_visits INT := 0;
    v_total_saves INT := 0;
    v_result JSON;
BEGIN
    -- 1. Property Counts & Views
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'published'),
        COUNT(*) FILTER (WHERE status = 'paused'),
        COUNT(*) FILTER (WHERE status = 'draft'),
        COUNT(*) FILTER (WHERE status = 'removed'),
        COALESCE(SUM(views_count), 0),
        COALESCE(SUM(saves_count), 0)
    INTO 
        v_total_properties,
        v_active_properties,
        v_paused_properties,
        v_draft_properties,
        v_rented_properties,
        v_total_views,
        v_total_saves
    FROM public.properties
    WHERE owner_id = p_owner_id;

    -- 2. Weekly Views from property_views
    SELECT 
        COUNT(*) FILTER (WHERE pv.created_at >= NOW() - INTERVAL '7 days'),
        COUNT(*) FILTER (WHERE pv.created_at >= NOW() - INTERVAL '14 days' AND pv.created_at < NOW() - INTERVAL '7 days')
    INTO 
        v_views_this_week,
        v_views_last_week
    FROM public.property_views pv
    JOIN public.properties p ON p.id = pv.property_id
    WHERE p.owner_id = p_owner_id;

    -- 3. Enquiries Breakdown
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'pending'),
        COUNT(*) FILTER (WHERE status = 'replied'),
        COUNT(*) FILTER (WHERE status = 'scheduled'),
        COUNT(*) FILTER (WHERE status = 'closed')
    INTO 
        v_total_enquiries,
        v_pending_enquiries,
        v_contacted_enquiries,
        v_scheduled_enquiries,
        v_closed_enquiries
    FROM public.enquiries
    WHERE owner_id = p_owner_id;

    -- 4. Visits Breakdown
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'pending'),
        COUNT(*) FILTER (WHERE status = 'confirmed'),
        COUNT(*) FILTER (WHERE status = 'completed'),
        COUNT(*) FILTER (WHERE status = 'cancelled')
    INTO 
        v_total_visits,
        v_pending_visits,
        v_confirmed_visits,
        v_completed_visits,
        v_cancelled_visits
    FROM public.visits
    WHERE owner_id = p_owner_id;

    -- Construct JSON
    v_result := json_build_object(
        'total_properties', v_total_properties,
        'active_properties', v_active_properties,
        'paused_properties', v_paused_properties,
        'draft_properties', v_draft_properties,
        'rented_properties', v_rented_properties,
        'total_views', v_total_views,
        'views_this_week', v_views_this_week,
        'views_last_week', v_views_last_week,
        'total_enquiries', v_total_enquiries,
        'pending_enquiries', v_pending_enquiries,
        'contacted_enquiries', v_contacted_enquiries,
        'scheduled_enquiries', v_scheduled_enquiries,
        'closed_enquiries', v_closed_enquiries,
        'total_visits', v_total_visits,
        'pending_visits', v_pending_visits,
        'confirmed_visits', v_confirmed_visits,
        'completed_visits', v_completed_visits,
        'cancelled_visits', v_cancelled_visits,
        'total_saves', v_total_saves
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
