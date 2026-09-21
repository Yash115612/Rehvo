-- =====================================================================
-- REHVO Database Migration: 043_remove_broker_ecosystem.sql
-- Description: Permanently remove broker ecosystem, tables, columns,
--              and constraints for Owner + Renter Only architecture.
-- Version: V24.6
-- =====================================================================

-- 1. DROP BROKER POLICIES & TABLE
DO $$
BEGIN
    -- Remove from realtime publication if exists
    IF EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'broker_profiles'
    ) THEN
        ALTER PUBLICATION supabase_realtime DROP TABLE public.broker_profiles;
    END IF;

    -- Drop broker policies if table exists
    DROP POLICY IF EXISTS "Public can view verified broker profiles" ON public.broker_profiles;
    DROP POLICY IF EXISTS "Brokers can update own profile" ON public.broker_profiles;
    DROP POLICY IF EXISTS "Brokers can insert own profile" ON public.broker_profiles;
    DROP POLICY IF EXISTS "Users can view broker profiles" ON public.broker_profiles;
    DROP POLICY IF EXISTS "Brokers can manage own profile" ON public.broker_profiles;
END $$;

-- Drop broker_profiles table completely
DROP TABLE IF EXISTS public.broker_profiles CASCADE;

-- 2. CLEAN UP PROFILES TABLE
-- Drop broker-specific verification flag
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_broker_verified;

-- Update role check constraint to only allow renter, owner, admin
DO $$
BEGIN
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
        CHECK (role IN ('renter', 'owner', 'admin', 'RENTER', 'OWNER', 'ADMIN'));
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipping profiles_role_check replacement: %', SQLERRM;
END $$;

-- Update account_type check constraint to only allow renter, owner, admin
DO $$
BEGIN
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_account_type_check;
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_account_type_check 
        CHECK (account_type IN ('renter', 'owner', 'admin', 'RENTER', 'OWNER', 'ADMIN'));
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipping profiles_account_type_check replacement: %', SQLERRM;
END $$;

-- 3. CLEAN UP SUBSCRIPTION PLANS & CMS
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'owner_subscription_plans') THEN
        ALTER TABLE public.owner_subscription_plans DROP CONSTRAINT IF EXISTS owner_subscription_plans_plan_tier_check;
        ALTER TABLE public.owner_subscription_plans ADD CONSTRAINT owner_subscription_plans_plan_tier_check
            CHECK (plan_tier IN ('free', 'starter', 'pro', 'premium', 'enterprise'));
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipping plan_tier check replacement: %', SQLERRM;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cms_announcements') THEN
        ALTER TABLE public.cms_announcements DROP CONSTRAINT IF EXISTS cms_announcements_audience_check;
        ALTER TABLE public.cms_announcements ADD CONSTRAINT cms_announcements_audience_check
            CHECK (audience IN ('all', 'renter', 'owner', 'admin'));
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipping cms_announcements audience check replacement: %', SQLERRM;
END $$;
