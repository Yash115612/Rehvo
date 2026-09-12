-- ==============================================================================
-- REHVO V6.1 — COMPLETE PUSH NOTIFICATION OPERATING SYSTEM MIGRATION
-- Migration: 033_push_notification_os_v61.sql
-- Tables: notification_preferences, push_tokens, notification_events,
--         scheduled_notifications, notification_delivery_logs
-- Personas: Renter, Owner, Flatmate (Android, iOS, Web)
-- ==============================================================================

-- 1. NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    chat_enabled BOOLEAN NOT NULL DEFAULT true,
    property_enabled BOOLEAN NOT NULL DEFAULT true,
    visit_enabled BOOLEAN NOT NULL DEFAULT true,
    wallet_enabled BOOLEAN NOT NULL DEFAULT true,
    rewards_enabled BOOLEAN NOT NULL DEFAULT true,
    society_enabled BOOLEAN NOT NULL DEFAULT true,
    marketing_enabled BOOLEAN NOT NULL DEFAULT false,
    email_enabled BOOLEAN NOT NULL DEFAULT true,
    sms_enabled BOOLEAN NOT NULL DEFAULT true,
    quiet_hours_enabled BOOLEAN NOT NULL DEFAULT false,
    quiet_start TEXT NOT NULL DEFAULT '22:00',
    quiet_end TEXT NOT NULL DEFAULT '08:00',
    -- Backward compatibility fields
    messages BOOLEAN NOT NULL DEFAULT true,
    visits BOOLEAN NOT NULL DEFAULT true,
    property_updates BOOLEAN NOT NULL DEFAULT true,
    price_changes BOOLEAN NOT NULL DEFAULT true,
    wallet_rewards BOOLEAN NOT NULL DEFAULT true,
    flatmates BOOLEAN NOT NULL DEFAULT true,
    owner_leads BOOLEAN NOT NULL DEFAULT true,
    rent_due BOOLEAN NOT NULL DEFAULT true,
    marketing BOOLEAN NOT NULL DEFAULT false,
    quiet_hours_start TEXT NOT NULL DEFAULT '22:00',
    quiet_hours_end TEXT NOT NULL DEFAULT '08:00',
    sound_enabled BOOLEAN NOT NULL DEFAULT true,
    sound_name TEXT NOT NULL DEFAULT 'emerald_chime',
    vibration_enabled BOOLEAN NOT NULL DEFAULT true,
    lock_screen_previews BOOLEAN NOT NULL DEFAULT true,
    badge_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure columns exist if table was already created in earlier migration
DO $$
BEGIN
    ALTER TABLE public.notification_preferences ADD COLUMN IF NOT EXISTS chat_enabled BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE public.notification_preferences ADD COLUMN IF NOT EXISTS property_enabled BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE public.notification_preferences ADD COLUMN IF NOT EXISTS visit_enabled BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE public.notification_preferences ADD COLUMN IF NOT EXISTS wallet_enabled BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE public.notification_preferences ADD COLUMN IF NOT EXISTS rewards_enabled BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE public.notification_preferences ADD COLUMN IF NOT EXISTS society_enabled BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE public.notification_preferences ADD COLUMN IF NOT EXISTS marketing_enabled BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE public.notification_preferences ADD COLUMN IF NOT EXISTS email_enabled BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE public.notification_preferences ADD COLUMN IF NOT EXISTS sms_enabled BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE public.notification_preferences ADD COLUMN IF NOT EXISTS quiet_hours_enabled BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE public.notification_preferences ADD COLUMN IF NOT EXISTS quiet_start TEXT NOT NULL DEFAULT '22:00';
    ALTER TABLE public.notification_preferences ADD COLUMN IF NOT EXISTS quiet_end TEXT NOT NULL DEFAULT '08:00';
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- 2. PUSH TOKENS TABLE
CREATE TABLE IF NOT EXISTS public.push_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    expo_push_token TEXT NOT NULL,
    push_token TEXT,
    platform TEXT NOT NULL CHECK (platform IN ('android', 'ios', 'web')),
    device_os TEXT CHECK (device_os IN ('android', 'ios', 'web')),
    device_model TEXT,
    device_name TEXT,
    app_version TEXT DEFAULT '6.1.0',
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_expo_push_token UNIQUE (user_id, expo_push_token)
);

DO $$
BEGIN
    ALTER TABLE public.push_tokens ADD COLUMN IF NOT EXISTS expo_push_token TEXT;
    ALTER TABLE public.push_tokens ADD COLUMN IF NOT EXISTS push_token TEXT;
    ALTER TABLE public.push_tokens ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'android';
    ALTER TABLE public.push_tokens ADD COLUMN IF NOT EXISTS device_os TEXT DEFAULT 'android';
    ALTER TABLE public.push_tokens ADD COLUMN IF NOT EXISTS device_model TEXT;
    ALTER TABLE public.push_tokens ADD COLUMN IF NOT EXISTS device_name TEXT;
    ALTER TABLE public.push_tokens ADD COLUMN IF NOT EXISTS app_version TEXT DEFAULT '6.1.0';
    ALTER TABLE public.push_tokens ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ DEFAULT now();
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON public.push_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_active ON public.push_tokens(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_push_tokens_expo_token ON public.push_tokens(expo_push_token);

-- 3. NOTIFICATION EVENTS TABLE (CENTRAL FEED)
CREATE TABLE IF NOT EXISTS public.notification_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    event_type TEXT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    image_url TEXT,
    icon TEXT,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT false,
    priority TEXT NOT NULL DEFAULT 'default' CHECK (priority IN ('low', 'default', 'high', 'urgent')),
    category TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    read_at TIMESTAMPTZ
);

DO $$
BEGIN
    ALTER TABLE public.notification_events ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    ALTER TABLE public.notification_events ADD COLUMN IF NOT EXISTS recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    ALTER TABLE public.notification_events ADD COLUMN IF NOT EXISTS type TEXT;
    ALTER TABLE public.notification_events ADD COLUMN IF NOT EXISTS event_type TEXT;
    ALTER TABLE public.notification_events ADD COLUMN IF NOT EXISTS icon TEXT;
    ALTER TABLE public.notification_events ADD COLUMN IF NOT EXISTS image_url TEXT;
    ALTER TABLE public.notification_events ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::jsonb;
    ALTER TABLE public.notification_events ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;
    ALTER TABLE public.notification_events ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'default';
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_notif_events_user_created ON public.notification_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_events_user_unread ON public.notification_events(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notif_events_type ON public.notification_events(type);

-- 4. SCHEDULED NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.scheduled_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    schedule_time TIMESTAMPTZ NOT NULL,
    scheduled_for TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'cancelled', 'failed')),
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    sent_at TIMESTAMPTZ,
    error_message TEXT
);

DO $$
BEGIN
    ALTER TABLE public.scheduled_notifications ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    ALTER TABLE public.scheduled_notifications ADD COLUMN IF NOT EXISTS recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    ALTER TABLE public.scheduled_notifications ADD COLUMN IF NOT EXISTS schedule_time TIMESTAMPTZ;
    ALTER TABLE public.scheduled_notifications ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ;
    ALTER TABLE public.scheduled_notifications ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::jsonb;
    ALTER TABLE public.scheduled_notifications ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_scheduled_notifs_time_status ON public.scheduled_notifications(schedule_time, status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_scheduled_notifs_user ON public.scheduled_notifications(user_id);

-- 5. NOTIFICATION DELIVERY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.notification_delivery_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID REFERENCES public.notification_events(id) ON DELETE SET NULL,
    push_token TEXT,
    status TEXT NOT NULL,
    provider_response JSONB DEFAULT '{}'::jsonb,
    delivered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
    ALTER TABLE public.notification_delivery_logs ADD COLUMN IF NOT EXISTS provider_response JSONB DEFAULT '{}'::jsonb;
    ALTER TABLE public.notification_delivery_logs ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ DEFAULT now();
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_delivery_logs_notif_id ON public.notification_delivery_logs(notification_id);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_status ON public.notification_delivery_logs(status);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_time ON public.notification_delivery_logs(delivered_at DESC);

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_delivery_logs ENABLE ROW LEVEL SECURITY;

-- Preferences: Users can manage their own notification preferences
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

-- Push Tokens: Users can manage their own device tokens
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

-- Notification Events: Users can view and manage their in-app feed
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notification_events;
CREATE POLICY "Users can view own notifications"
    ON public.notification_events FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Users can insert notifications" ON public.notification_events;
CREATE POLICY "Users can insert notifications"
    ON public.notification_events FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notification_events;
CREATE POLICY "Users can update own notifications"
    ON public.notification_events FOR UPDATE
    USING (auth.uid() = user_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notification_events;
CREATE POLICY "Users can delete own notifications"
    ON public.notification_events FOR DELETE
    USING (auth.uid() = user_id OR auth.uid() = recipient_id);

-- Scheduled Notifications: Users can view and manage their schedules
DROP POLICY IF EXISTS "Users can view own scheduled notifications" ON public.scheduled_notifications;
CREATE POLICY "Users can view own scheduled notifications"
    ON public.scheduled_notifications FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Users can insert scheduled notifications" ON public.scheduled_notifications;
CREATE POLICY "Users can insert scheduled notifications"
    ON public.scheduled_notifications FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Delivery Logs: Service role can insert, authenticated users can view their logs
DROP POLICY IF EXISTS "Users can view own delivery logs" ON public.notification_delivery_logs;
CREATE POLICY "Users can view own delivery logs"
    ON public.notification_delivery_logs FOR SELECT
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "System can insert delivery logs" ON public.notification_delivery_logs;
CREATE POLICY "System can insert delivery logs"
    ON public.notification_delivery_logs FOR INSERT
    WITH CHECK (true);

-- ==============================================================================
-- REALTIME PUBLICATION
-- ==============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'notification_events'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.notification_events;
    END IF;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
