-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 019_owner_landlord_ecosystem.sql
-- Description: Production tables for complete Owner & Landlord Ecosystem:
--              1. owner_profiles
--              2. owner_subscription_plans
--              3. owner_property_analytics
--              4. tenant_leads
--              5. rent_collections
--              6. visit_checkins
--              7. owner_notifications
--              8. property_documents
--              Row-Level Security (RLS), Triggers & RPCs.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. OWNER PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.owner_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name TEXT,
    profile_photo TEXT,
    owner_verification TEXT NOT NULL DEFAULT 'PENDING' CHECK (owner_verification IN ('VERIFIED', 'PENDING', 'UNVERIFIED', 'REJECTED')),
    gst_number TEXT,
    kyc_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (kyc_status IN ('VERIFIED', 'PENDING', 'SUBMITTED', 'REJECTED')),
    response_rate NUMERIC NOT NULL DEFAULT 98.0,
    avg_reply_time TEXT NOT NULL DEFAULT '15 mins',
    total_listings INT NOT NULL DEFAULT 0,
    years_on_rehvo NUMERIC NOT NULL DEFAULT 1.0,
    phone TEXT,
    email TEXT,
    office_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_owner_profiles_user ON public.owner_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_owner_profiles_verification ON public.owner_profiles(owner_verification);

-- ------------------------------------------------------------------------------
-- 2. OWNER SUBSCRIPTION PLANS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.owner_subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_tier TEXT NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'starter', 'pro', 'premium', 'broker', 'enterprise')),
    plan_name TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual')),
    listings_limit INT NOT NULL DEFAULT 1,
    featured_credits INT NOT NULL DEFAULT 0,
    ai_boost_enabled BOOLEAN NOT NULL DEFAULT false,
    priority_support BOOLEAN NOT NULL DEFAULT false,
    crm_enabled BOOLEAN NOT NULL DEFAULT true,
    digital_lease_included BOOLEAN NOT NULL DEFAULT false,
    zero_deposit_priority BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'trial')),
    starts_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMPTZ,
    auto_renew BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_owner_plans_user ON public.owner_subscription_plans(user_id, status);

-- ------------------------------------------------------------------------------
-- 3. OWNER PROPERTY ANALYTICS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.owner_property_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    views INT NOT NULL DEFAULT 0,
    saves INT NOT NULL DEFAULT 0,
    leads INT NOT NULL DEFAULT 0,
    visit_requests INT NOT NULL DEFAULT 0,
    chat_requests INT NOT NULL DEFAULT 0,
    rent_collected NUMERIC NOT NULL DEFAULT 0,
    occupancy_rate NUMERIC NOT NULL DEFAULT 100.0,
    interest_score NUMERIC NOT NULL DEFAULT 85.0,
    search_impressions INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_owner_analytics_owner_date ON public.owner_property_analytics(owner_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_owner_analytics_property ON public.owner_property_analytics(property_id);

-- ------------------------------------------------------------------------------
-- 4. TENANT LEADS CRM TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tenant_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    property_title TEXT NOT NULL,
    property_locality TEXT,
    tenant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    tenant_name TEXT NOT NULL,
    tenant_photo TEXT,
    tenant_phone TEXT NOT NULL,
    tenant_email TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    is_phone_verified BOOLEAN NOT NULL DEFAULT true,
    budget NUMERIC NOT NULL DEFAULT 0,
    move_in_date DATE,
    compatibility INT NOT NULL DEFAULT 90,
    wave_source TEXT NOT NULL DEFAULT 'Direct Search',
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'INTERESTED', 'VISIT_SCHEDULED', 'NEGOTIATION', 'APPROVED', 'REJECTED')),
    notes TEXT,
    rejection_reason TEXT,
    last_contacted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_tenant_leads_owner_status ON public.tenant_leads(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_tenant_leads_property ON public.tenant_leads(property_id);

-- ------------------------------------------------------------------------------
-- 5. RENT COLLECTIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rent_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    property_title TEXT NOT NULL,
    tenant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    tenant_name TEXT NOT NULL,
    tenant_phone TEXT,
    rent_amount NUMERIC NOT NULL CHECK (rent_amount > 0),
    due_date DATE NOT NULL,
    paid_date TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'COLLECTED', 'OVERDUE', 'PENDING')),
    autopay_enabled BOOLEAN NOT NULL DEFAULT false,
    cashback_generated NUMERIC NOT NULL DEFAULT 0,
    receipt_url TEXT,
    payment_method TEXT,
    transaction_ref TEXT,
    last_reminder_sent_at TIMESTAMPTZ,
    reminder_count INT NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_rent_collections_owner ON public.rent_collections(owner_id, due_date DESC);
CREATE INDEX IF NOT EXISTS idx_rent_collections_status ON public.rent_collections(status);

-- ------------------------------------------------------------------------------
-- 6. VISIT CHECKINS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.visit_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES public.visits(id) ON DELETE SET NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    property_title TEXT NOT NULL,
    property_locality TEXT,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    visitor_name TEXT NOT NULL,
    visitor_phone TEXT NOT NULL,
    visitor_avatar TEXT,
    scheduled_time TIMESTAMPTZ NOT NULL,
    qr_code_hash TEXT UNIQUE NOT NULL,
    checkin_status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK (checkin_status IN ('SCHEDULED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'RESCHEDULED')),
    attendance_notes TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_visit_checkins_owner ON public.visit_checkins(owner_id, scheduled_time ASC);
CREATE INDEX IF NOT EXISTS idx_visit_checkins_status ON public.visit_checkins(checkin_status);

-- ------------------------------------------------------------------------------
-- 7. OWNER NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.owner_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('LEADS', 'VISITS', 'RENT', 'WALLET', 'VERIFICATION', 'LISTINGS', 'REWARDS')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_owner_notifs_owner ON public.owner_notifications(owner_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_owner_notifs_category ON public.owner_notifications(category);

-- ------------------------------------------------------------------------------
-- 8. PROPERTY DOCUMENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    property_title TEXT,
    doc_type TEXT NOT NULL CHECK (doc_type IN ('PROPERTY_DOC', 'OWNERSHIP_PROOF', 'RENTAL_AGREEMENT', 'TENANT_DOC', 'RECEIPT', 'NOC')),
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size TEXT NOT NULL DEFAULT '1.2 MB',
    file_format TEXT NOT NULL DEFAULT 'PDF',
    status TEXT NOT NULL DEFAULT 'VERIFIED' CHECK (status IN ('VERIFIED', 'PENDING', 'EXPIRED')),
    expiry_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_property_documents_owner ON public.property_documents(owner_id, doc_type);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.owner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_property_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_documents ENABLE ROW LEVEL SECURITY;

-- Owner Profiles RLS
CREATE POLICY "Users can manage own owner profile"
    ON public.owner_profiles FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public read for verified owner badges"
    ON public.owner_profiles FOR SELECT
    USING (true);

-- Owner Subscription Plans RLS
CREATE POLICY "Users manage own subscription plan"
    ON public.owner_subscription_plans FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Analytics RLS
CREATE POLICY "Owners view own property analytics"
    ON public.owner_property_analytics FOR ALL
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- Tenant Leads RLS
CREATE POLICY "Owners manage own tenant leads"
    ON public.tenant_leads FOR ALL
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- Rent Collections RLS
CREATE POLICY "Owners manage rent collections"
    ON public.rent_collections FOR ALL
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- Visit Checkins RLS
CREATE POLICY "Owners manage visit checkins"
    ON public.visit_checkins FOR ALL
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- Owner Notifications RLS
CREATE POLICY "Owners manage own notifications"
    ON public.owner_notifications FOR ALL
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- Property Documents RLS
CREATE POLICY "Owners manage own property documents"
    ON public.property_documents FOR ALL
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);
