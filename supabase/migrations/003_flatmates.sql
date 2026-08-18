-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 003_flatmates.sql
-- Description: Flatmate profiles for roommate discovery
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. FLATMATE PROFILES (Linked 1-to-1 with profiles.id)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flatmate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    photo TEXT,
    age INTEGER,
    gender TEXT CHECK (gender IN ('male', 'female', 'any', 'other')),
    profession TEXT NOT NULL,
    city TEXT NOT NULL,
    locality TEXT NOT NULL,
    preferred_locations TEXT[] DEFAULT '{}',
    bio TEXT,
    budget_min INTEGER NOT NULL DEFAULT 0,
    budget_max INTEGER NOT NULL,
    room_preference TEXT NOT NULL DEFAULT 'any' CHECK (room_preference IN ('private_room', 'shared_room', 'any')),
    move_in_date TEXT NOT NULL,
    lifestyle_preferences TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'paused')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for flatmate search
CREATE INDEX IF NOT EXISTS idx_flatmate_profiles_user_id ON public.flatmate_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_flatmate_profiles_status ON public.flatmate_profiles(status);
CREATE INDEX IF NOT EXISTS idx_flatmate_profiles_city ON public.flatmate_profiles(city);
CREATE INDEX IF NOT EXISTS idx_flatmate_profiles_locality ON public.flatmate_profiles(locality);
CREATE INDEX IF NOT EXISTS idx_flatmate_profiles_budget_max ON public.flatmate_profiles(budget_max);
CREATE INDEX IF NOT EXISTS idx_flatmate_profiles_created_at ON public.flatmate_profiles(created_at DESC);

CREATE TRIGGER set_flatmate_profiles_updated_at
    BEFORE UPDATE ON public.flatmate_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
