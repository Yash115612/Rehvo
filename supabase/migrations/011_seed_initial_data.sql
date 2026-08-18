-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 011_seed_initial_data.sql
-- Description: Seed initial service cities, system settings, and admin helper
-- ==============================================================================

-- 1. Seed Initial Service Cities
INSERT INTO public.service_cities (name, state, country, status, sort_order)
VALUES
    ('Mumbai', 'Maharashtra', 'India', 'active', 1),
    ('Bengaluru', 'Karnataka', 'India', 'active', 2),
    ('Delhi NCR', 'Delhi', 'India', 'active', 3),
    ('Pune', 'Maharashtra', 'India', 'coming_soon', 4),
    ('Hyderabad', 'Telangana', 'India', 'coming_soon', 5)
ON CONFLICT (name) DO UPDATE SET
    state = EXCLUDED.state,
    status = EXCLUDED.status,
    sort_order = EXCLUDED.sort_order;

-- 2. Seed Initial System Settings
INSERT INTO public.system_settings (key, value, description)
VALUES
    ('verification.require_deed_for_search', 'false'::jsonb, 'Enforce verified ownership deed before listing appears in public search'),
    ('verification.auto_verify_phone', 'true'::jsonb, 'Automatically mark phone as verified upon OTP verification'),
    ('platform.max_scheduled_visits_per_user', '5'::jsonb, 'Maximum concurrent active scheduled visits per renter'),
    ('platform.maintenance_mode', 'false'::jsonb, 'Put entire platform into maintenance mode for mobile users'),
    ('platform.zero_brokerage_guarantee', 'true'::jsonb, 'Enforce zero-brokerage direct owner listings only')
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    description = EXCLUDED.description;

-- 3. Helper Function to Provision Super Admin by Email
CREATE OR REPLACE FUNCTION public.provision_super_admin(target_email TEXT, target_name TEXT)
RETURNS VOID AS $$
DECLARE
    found_user_id UUID;
BEGIN
    SELECT id INTO found_user_id FROM auth.users WHERE email = target_email LIMIT 1;
    
    INSERT INTO public.admin_users (user_id, email, full_name, role, status)
    VALUES (found_user_id, target_email, target_name, 'super_admin', 'active')
    ON CONFLICT (email) DO UPDATE SET
        user_id = COALESCE(EXCLUDED.user_id, admin_users.user_id),
        role = 'super_admin',
        status = 'active',
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
