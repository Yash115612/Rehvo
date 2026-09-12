-- ==============================================================================
-- REHVO V5.5 & V6.0 — COMPLETE PUSH NOTIFICATION ECOSYSTEM MIGRATION
-- Tables: push_tokens, notification_preferences, notification_events,
--         scheduled_notifications, notification_delivery_logs
-- Indexes, RLS Policies, Realtime Publications
-- ==============================================================================

-- 1. PUSH TOKENS TABLE
CREATE TABLE IF NOT EXISTS public.push_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    push_token TEXT NOT NULL,
    device_os TEXT NOT NULL CHECK (device_os IN ('ios', 'android', 'web')),
    device_model TEXT,
    app_version TEXT DEFAULT '6.0.0',
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_push_token UNIQUE (user_id, push_token)
);

CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON public.push_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_active ON public.push_tokens(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_push_tokens_token ON public.push_tokens(push_token);

-- 2. NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    -- Category Toggles
    messages BOOLEAN NOT NULL DEFAULT true,
    visits BOOLEAN NOT NULL DEFAULT true,
    property_updates BOOLEAN NOT NULL DEFAULT true,
    price_changes BOOLEAN NOT NULL DEFAULT true,
    wallet_rewards BOOLEAN NOT NULL DEFAULT true,
    flatmates BOOLEAN NOT NULL DEFAULT true,
    owner_leads BOOLEAN NOT NULL DEFAULT true,
    rent_due BOOLEAN NOT NULL DEFAULT true,
    marketing BOOLEAN NOT NULL DEFAULT false,
    -- Quiet Hours
    quiet_hours_enabled BOOLEAN NOT NULL DEFAULT false,
    quiet_hours_start TEXT NOT NULL DEFAULT '22:00',
    quiet_hours_end TEXT NOT NULL DEFAULT '08:00',
    -- Sound & Haptics
    sound_enabled BOOLEAN NOT NULL DEFAULT true,
    sound_name TEXT NOT NULL DEFAULT 'emerald_chime',
    vibration_enabled BOOLEAN NOT NULL DEFAULT true,
    -- Privacy & Badges
    lock_screen_previews BOOLEAN NOT NULL DEFAULT true,
    badge_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. NOTIFICATION EVENTS STREAM
CREATE TABLE IF NOT EXISTS public.notification_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'default' CHECK (priority IN ('low', 'default', 'high', 'urgent')),
    data JSONB DEFAULT '{}'::jsonb,
    image_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    read_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_notif_events_recipient ON public.notification_events(recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_events_unread ON public.notification_events(recipient_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notif_events_category ON public.notification_events(category);

-- 4. SCHEDULED NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.scheduled_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    scheduled_for TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'cancelled', 'failed')),
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scheduled_notifs_pending ON public.scheduled_notifications(scheduled_for, status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_scheduled_notifs_user ON public.scheduled_notifications(recipient_id);

-- 5. NOTIFICATION DELIVERY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.notification_delivery_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID REFERENCES public.notification_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    push_token TEXT,
    channel TEXT NOT NULL DEFAULT 'expo' CHECK (channel IN ('expo', 'apns', 'fcm', 'whatsapp', 'email', 'in_app')),
    ticket_id TEXT,
    receipt_id TEXT,
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'suppressed_quiet_hours', 'suppressed_preference', 'invalid_token')),
    error_details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_delivery_logs_user ON public.notification_delivery_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_status ON public.notification_delivery_logs(status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_delivery_logs ENABLE ROW LEVEL SECURITY;

-- Push Tokens Policies
CREATE POLICY "Users can view own push tokens"
    ON public.push_tokens FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own push tokens"
    ON public.push_tokens FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own push tokens"
    ON public.push_tokens FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own push tokens"
    ON public.push_tokens FOR DELETE
    USING (auth.uid() = user_id);

-- Notification Preferences Policies
CREATE POLICY "Users can view own notification preferences"
    ON public.notification_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences"
    ON public.notification_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
    ON public.notification_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- Notification Events Policies
CREATE POLICY "Users can view own notification events"
    ON public.notification_events FOR SELECT
    USING (auth.uid() = recipient_id);

CREATE POLICY "Users can update own notification events"
    ON public.notification_events FOR UPDATE
    USING (auth.uid() = recipient_id);

CREATE POLICY "Users can delete own notification events"
    ON public.notification_events FOR DELETE
    USING (auth.uid() = recipient_id);

-- Scheduled Notifications Policies
CREATE POLICY "Users can view own scheduled notifications"
    ON public.scheduled_notifications FOR SELECT
    USING (auth.uid() = recipient_id);

-- Delivery Logs Policies
CREATE POLICY "Users can view own delivery logs"
    ON public.notification_delivery_logs FOR SELECT
    USING (auth.uid() = user_id);

-- ==============================================================================
-- SUPABASE REALTIME PUBLICATION
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
END $$;
