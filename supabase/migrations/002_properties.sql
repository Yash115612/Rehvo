-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 002_properties.sql
-- Description: Properties and property images tables (Strictly flat, room, pg, studio)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PROPERTIES (Rental Listings)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('flat', 'room', 'pg', 'studio')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    deposit INTEGER NOT NULL DEFAULT 0,
    maintenance INTEGER NOT NULL DEFAULT 0,
    brokerage INTEGER NOT NULL DEFAULT 0,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    locality TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    bedrooms TEXT NOT NULL,
    bathrooms INTEGER NOT NULL DEFAULT 1,
    area INTEGER NOT NULL DEFAULT 0,
    furnishing TEXT NOT NULL CHECK (furnishing IN ('fully_furnished', 'semi_furnished', 'unfurnished')),
    parking TEXT DEFAULT 'None',
    availability TEXT DEFAULT 'Immediate',
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'paused', 'removed')),
    verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    amenities TEXT[] DEFAULT '{}',
    tenant_preferences TEXT[] DEFAULT '{}',
    views_count INTEGER DEFAULT 0,
    saves_count INTEGER DEFAULT 0,
    enquiries_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for high-throughput filtering & search
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_locality ON public.properties(locality);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at DESC);

CREATE TRIGGER set_properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 2. PROPERTY IMAGES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    storage_path TEXT,
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_sort ON public.property_images(property_id, sort_order ASC);
