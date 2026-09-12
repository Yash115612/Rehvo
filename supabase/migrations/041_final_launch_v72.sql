-- =============================================================================
-- REHVO V7.2: FINAL LAUNCH PRODUCTION SPRINT MIGRATION
-- Migration: 041_final_launch_v72.sql
-- Description: Complete enterprise database schema for Security Center Pro,
--              Analytics Engine, Admin CMS & Feature Flags, Support Ticket Chat,
--              Fintech Payment Transactions, Referral Streaks, and App Update OS.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. USER SESSIONS (Multi-device session manager & device trust)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    device_name TEXT NOT NULL,
    device_id TEXT NOT NULL,
    ip_address TEXT NOT NULL DEFAULT '127.0.0.1',
    platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_current BOOLEAN NOT NULL DEFAULT false,
    is_trusted BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. LOGIN HISTORY (Audit trail for security center)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.login_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    ip_address TEXT NOT NULL,
    device_name TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT 'Mumbai, India',
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'blocked')),
    login_method TEXT NOT NULL CHECK (login_method IN ('biometric', 'otp', 'pin', 'password')),
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. USER SECURITY SETTINGS (App lock, PIN, Biometrics, DPDP consent)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_security_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE,
    biometric_enabled BOOLEAN NOT NULL DEFAULT false,
    app_lock_enabled BOOLEAN NOT NULL DEFAULT false,
    pin_hash TEXT,
    auto_lock_duration INTEGER NOT NULL DEFAULT 30, -- seconds: 0, 30, 60, 300
    two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
    incognito_mode BOOLEAN NOT NULL DEFAULT false,
    dpdp_consent_given BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. ANALYTICS EVENTS (Telemetry, funnels, heatmaps, conversion)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    event_name TEXT NOT NULL,
    properties JSONB NOT NULL DEFAULT '{}'::jsonb,
    session_id TEXT,
    platform TEXT NOT NULL DEFAULT 'ios',
    screen_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. SUPPORT TICKET MESSAGES (Threaded Realtime Support)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.support_ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id TEXT NOT NULL,
    sender_id UUID,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'agent', 'bot', 'system')),
    message TEXT NOT NULL,
    attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. FEATURE FLAGS (Dynamic remote config)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feature_flags (
    key TEXT PRIMARY KEY,
    enabled BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    rollout_percentage INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. CMS ANNOUNCEMENTS (Broadcast banners & system alerts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    audience TEXT NOT NULL DEFAULT 'all' CHECK (audience IN ('all', 'renter', 'owner', 'broker')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. CMS BANNERS (Carousel banners & promotions)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    cta_text TEXT,
    cta_link TEXT,
    placement TEXT NOT NULL DEFAULT 'home' CHECK (placement IN ('home', 'search', 'wallet', 'owner')),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 9. APP VERSIONS (Force update & version gates)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
    latest_version TEXT NOT NULL,
    min_supported_version TEXT NOT NULL,
    force_update BOOLEAN NOT NULL DEFAULT false,
    release_notes TEXT,
    store_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 10. PAYMENT TRANSACTIONS V72 (Unified fintech ledger)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_transactions_v72 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    order_id TEXT NOT NULL UNIQUE,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('upi', 'card', 'netbanking', 'rcash', 'autopay')),
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL CHECK (status IN ('initiated', 'processing', 'completed', 'failed', 'refunded')),
    purpose TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    invoice_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 11. REFERRAL STREAKS (Growth multiplier & streak gamification)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.referral_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    streak_count INTEGER NOT NULL DEFAULT 0,
    last_invite_at TIMESTAMPTZ,
    milestones_completed JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_earned NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- INDEXES FOR ENTERPRISE QUERY PERFORMANCE
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON public.login_history (user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name_time ON public.analytics_events (event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON public.analytics_events (user_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket ON public.support_ticket_messages (ticket_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_cms_banners_placement ON public.cms_banners (placement, is_active, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_cms_announcements_active ON public.cms_announcements (is_active, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order ON public.payment_transactions_v72 (order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user ON public.payment_transactions_v72 (user_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions_v72 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_streaks ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on user_sessions') THEN
        CREATE POLICY "Allow public access on user_sessions" ON public.user_sessions FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on login_history') THEN
        CREATE POLICY "Allow public access on login_history" ON public.login_history FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on user_security_settings') THEN
        CREATE POLICY "Allow public access on user_security_settings" ON public.user_security_settings FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on analytics_events') THEN
        CREATE POLICY "Allow public access on analytics_events" ON public.analytics_events FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on support_ticket_messages') THEN
        CREATE POLICY "Allow public access on support_ticket_messages" ON public.support_ticket_messages FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on feature_flags') THEN
        CREATE POLICY "Allow public access on feature_flags" ON public.feature_flags FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on cms_announcements') THEN
        CREATE POLICY "Allow public access on cms_announcements" ON public.cms_announcements FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on cms_banners') THEN
        CREATE POLICY "Allow public access on cms_banners" ON public.cms_banners FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on app_versions') THEN
        CREATE POLICY "Allow public access on app_versions" ON public.app_versions FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on payment_transactions_v72') THEN
        CREATE POLICY "Allow public access on payment_transactions_v72" ON public.payment_transactions_v72 FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on referral_streaks') THEN
        CREATE POLICY "Allow public access on referral_streaks" ON public.referral_streaks FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- REALTIME PUBLICATION SETUP
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.support_ticket_messages;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_announcements;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.feature_flags;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_transactions_v72;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- SEED INITIAL FEATURE FLAGS & APP VERSIONS
-- -----------------------------------------------------------------------------
INSERT INTO public.feature_flags (key, enabled, description, rollout_percentage)
VALUES 
    ('biometric_auth_v72', true, 'Enables FaceID/Fingerprint biometric app lock', 100),
    ('voice_search_ai', true, 'Enables multi-lingual voice AI property discovery', 100),
    ('flashlist_optimization', true, 'High-fps FlashList rendering across all feeds', 100),
    ('instant_rent_autopay', true, 'Zero-fee recurring UPI AutoPay for monthly rent', 100),
    ('digital_agreement_signing', true, 'Legal stamp-duty rent agreements with Aadhaar e-sign', 100)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.app_versions (platform, latest_version, min_supported_version, force_update, release_notes, store_url)
VALUES 
    ('ios', '7.2.0', '7.0.0', false, 'REHVO V7.2 Production Release — Biometric Security, Realtime Analytics, Owner Business Suite, and Fast Payments', 'https://apps.apple.com/app/rehvo/id123456789'),
    ('android', '7.2.0', '7.0.0', false, 'REHVO V7.2 Production Release — Biometric Security, Realtime Analytics, Owner Business Suite, and Fast Payments', 'https://play.google.com/store/apps/details?id=com.rehvo.app'),
    ('web', '7.2.0', '7.0.0', false, 'REHVO V7.2 Web Release', 'https://rehvo.com')
ON CONFLICT DO NOTHING;
