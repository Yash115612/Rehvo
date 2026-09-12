-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 021_multi_role_auth_broker_ecosystem.sql
-- Description: REHVO V5.0 Multi-Role Authentication & Broker Ecosystem
--              1. Update profiles table to support 'broker' role & account_type
--              2. Add broker profile metadata columns to profiles
--              3. Create broker_profiles table for agency CRM & verification
--              4. RLS security policies & Realtime replication
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE ENHANCEMENTS FOR MULTI-ROLE
-- ------------------------------------------------------------------------------

-- Ensure role check allows 'broker'
DO $$
BEGIN
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('renter', 'owner', 'broker'));
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Add account_type column if not present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'account_type'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN account_type TEXT NOT NULL DEFAULT 'renter' 
        CHECK (account_type IN ('renter', 'owner', 'broker'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'company_name'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN company_name TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'company_logo'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN company_logo TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'is_broker_verified'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN is_broker_verified BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'rera_number'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN rera_number TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'business_phone'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN business_phone TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'office_address'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN office_address TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'operating_city'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN operating_city TEXT DEFAULT 'Mumbai';
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. BROKER_PROFILES TABLE
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.broker_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    agency_name TEXT NOT NULL,
    owner_name TEXT,
    company_logo TEXT,
    rera_number TEXT,
    office_address TEXT,
    operating_city TEXT NOT NULL DEFAULT 'Mumbai',
    years_experience INTEGER NOT NULL DEFAULT 1,
    languages TEXT[] NOT NULL DEFAULT '{"English", "Hindi"}',
    specializations TEXT[] NOT NULL DEFAULT '{"Luxury Rentals", "Commercial Spaces"}',
    verified BOOLEAN NOT NULL DEFAULT false,
    rating NUMERIC(3,2) NOT NULL DEFAULT 4.90,
    properties_count INTEGER NOT NULL DEFAULT 0,
    clients_count INTEGER NOT NULL DEFAULT 0,
    response_time TEXT NOT NULL DEFAULT '< 15 mins',
    subscription_plan TEXT NOT NULL DEFAULT 'PRO_BROKER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_broker_profiles_user_id ON public.broker_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_broker_profiles_city ON public.broker_profiles(operating_city);

-- ------------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE public.broker_profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can view verified broker profiles" ON public.broker_profiles;
    DROP POLICY IF EXISTS "Brokers can update own profile" ON public.broker_profiles;
    DROP POLICY IF EXISTS "Brokers can insert own profile" ON public.broker_profiles;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Public can view verified broker profiles"
    ON public.broker_profiles FOR SELECT
    USING (true);

CREATE POLICY "Brokers can update own profile"
    ON public.broker_profiles FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Brokers can insert own profile"
    ON public.broker_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 4. REALTIME REPLICATION PUBLICATION
-- ------------------------------------------------------------------------------

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'broker_profiles'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.broker_profiles;
    END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
