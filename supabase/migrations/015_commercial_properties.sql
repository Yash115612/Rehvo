-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 015_commercial_properties.sql
-- Description: Full first-class Commercial Property Marketplace support
-- ==============================================================================

-- 1. Add category column with 'residential' default for full backward compatibility
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'residential' 
CHECK (category IN ('residential', 'commercial'));

-- 2. Drop existing type check constraint and re-add with all residential and commercial types
ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_type_check;

ALTER TABLE public.properties 
ADD CONSTRAINT properties_type_check 
CHECK (type IN (
    -- Residential
    'flat', 'room', 'pg', 'studio',
    -- Commercial
    'office', 'shop', 'showroom', 'warehouse', 'commercial_building', 'coworking', 'commercial_plot', 'other_commercial'
));

-- 3. Allow bedrooms to be optional / default '0' (since commercial properties do not have bedrooms)
ALTER TABLE public.properties 
ALTER COLUMN bedrooms DROP NOT NULL;

ALTER TABLE public.properties 
ALTER COLUMN bedrooms SET DEFAULT '0';

-- 4. Drop and expand furnishing check constraint to support commercial fit-out statuses
ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_furnishing_check;

ALTER TABLE public.properties 
ADD CONSTRAINT properties_furnishing_check 
CHECK (furnishing IN (
    'fully_furnished', 
    'semi_furnished', 
    'unfurnished', 
    'bare_shell', 
    'warm_shell'
));

-- 5. Add Commercial-Specific Attributes
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS commercial_type TEXT 
CHECK (commercial_type IS NULL OR commercial_type IN (
    'office', 'shop', 'showroom', 'warehouse', 'commercial_building', 'coworking', 'commercial_plot', 'other_commercial'
));

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS floor_number TEXT DEFAULT NULL;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS total_floors INTEGER DEFAULT NULL;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS washrooms INTEGER DEFAULT 0;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS parking_spaces TEXT DEFAULT 'None';

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS power_backup BOOLEAN DEFAULT FALSE;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS lift BOOLEAN DEFAULT FALSE;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS carpet_area INTEGER DEFAULT NULL;

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS possession_status TEXT DEFAULT 'Immediate';

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS lease_type TEXT DEFAULT 'rent';

ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS road_width INTEGER DEFAULT NULL;

-- 6. Indexes for high-performance category filtering & commercial search
CREATE INDEX IF NOT EXISTS idx_properties_category ON public.properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_commercial_type ON public.properties(commercial_type);
CREATE INDEX IF NOT EXISTS idx_properties_category_city_status ON public.properties(category, city, status);
CREATE INDEX IF NOT EXISTS idx_properties_category_locality ON public.properties(category, locality);
