-- ==============================================================================
-- REHVO V5.4.1 — PRODUCTION PUSH NOTIFICATION & MESSAGING INFRASTRUCTURE
-- Tables: push_tokens, notification_preferences, notification_logs, scheduled_notifications
-- Complete RLS, Performance Indexes, and Supabase Realtime
-- ==============================================================================

-- 1. PUSH TOKENS TABLE (Device-to-user token mappings)
CREATE TABLE IF NOT EXISTS public.push_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    push_token TEXT NOT NULL,
    device_os TEXT CHECK (device_os IN ('ios', 'android', 'web')),
    device_name TEXT,
    app_version TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT push_tokens_user_token_unique UNIQUE (user_id, push_token)
);

CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON public.push_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_active ON public.push_tokens(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_push_tokens_token ON public.push_tokens(push_token);

ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own push tokens" ON public.push_tokens;
CREATE POLICY "Users can view own push tokens"
    ON public.push_tokens FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own push tokens" ON public.push_tokens;
CREATE POLICY "Users can insert own push tokens"
    ON public.push_tokens FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own push tokens" ON public.push_tokens;
CREATE POLICY "Users can update own push tokens"
    ON public.push_tokens FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own push tokens" ON public.push_tokens;
CREATE POLICY "Users can delete own push tokens"
    ON public.push_tokens FOR DELETE
    USING (auth.uid() = user_id);

-- 2. NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    messages BOOLEAN DEFAULT TRUE,
    visits BOOLEAN DEFAULT TRUE,
    property_updates BOOLEAN DEFAULT TRUE,
    price_changes BOOLEAN DEFAULT TRUE,
    wallet_rewards BOOLEAN DEFAULT TRUE,
    flatmates BOOLEAN DEFAULT TRUE,
    owner_leads BOOLEAN DEFAULT TRUE,
    rent_due BOOLEAN DEFAULT TRUE,
    marketing BOOLEAN DEFAULT FALSE,
    quiet_hours_enabled BOOLEAN DEFAULT FALSE,
    quiet_hours_start TEXT DEFAULT '22:00',
    quiet_hours_end TEXT DEFAULT '08:00',
    sound_enabled BOOLEAN DEFAULT TRUE,
    sound_name TEXT DEFAULT 'default',
    vibration_enabled BOOLEAN DEFAULT TRUE,
    lock_screen_previews BOOLEAN DEFAULT TRUE,
    badge_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can view own notification preferences"
    ON public.notification_preferences FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can insert own notification preferences"
    ON public.notification_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can update own notification preferences"
    ON public.notification_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- 3. NOTIFICATION LOGS TABLE (Delivery audits & suppression tracking)
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_id UUID,
    push_token TEXT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    category TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    status TEXT CHECK (status IN ('sent', 'failed', 'suppressed_quiet_hours', 'suppressed_preference')),
    error_message TEXT,
    ticket_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_user ON public.notification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created ON public.notification_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON public.notification_logs(status);

ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notification logs" ON public.notification_logs;
CREATE POLICY "Users can view own notification logs"
    ON public.notification_logs FOR SELECT
    USING (auth.uid() = user_id);

-- 4. SCHEDULED NOTIFICATIONS TABLE (Upcoming reminders: 24h, 1h, 15m)
CREATE TABLE IF NOT EXISTS public.scheduled_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    category TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    scheduled_for TIMESTAMPTZ NOT NULL,
    status TEXT CHECK (status IN ('pending', 'sent', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_pending ON public.scheduled_notifications(status, scheduled_for)
    WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_user ON public.scheduled_notifications(user_id);

ALTER TABLE public.scheduled_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own scheduled notifications" ON public.scheduled_notifications;
CREATE POLICY "Users can view own scheduled notifications"
    ON public.scheduled_notifications FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own scheduled notifications" ON public.scheduled_notifications;
CREATE POLICY "Users can insert own scheduled notifications"
    ON public.scheduled_notifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own scheduled notifications" ON public.scheduled_notifications;
CREATE POLICY "Users can update own scheduled notifications"
    ON public.scheduled_notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- 5. REALTIME REPLICATION SETUP
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'push_tokens'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.push_tokens;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'notification_preferences'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.notification_preferences;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'notification_logs'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.notification_logs;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;
