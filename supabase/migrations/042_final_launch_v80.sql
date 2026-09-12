-- =============================================================================
-- REHVO V8.0: FINAL LAUNCH COMPLETE PRODUCTION SPRINT MIGRATION
-- Migration: 042_final_launch_v80.sql
-- Description: Database schema for offline sync queue telemetry, AI feedback
--              ratings, and extended performance indexes.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. OFFLINE SYNC QUEUE (Persistent cloud mutation audit & retry ledger)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.offline_sync_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action_type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'synced', 'failed')),
    retry_count INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    synced_at TIMESTAMPTZ
);

-- -----------------------------------------------------------------------------
-- 2. AI FEEDBACK RATINGS (Continuous AI tuning & quality score)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_feedback_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    conversation_id UUID,
    message_id UUID,
    rating INTEGER NOT NULL CHECK (rating IN (1, 5)),
    feedback_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- INDEXES FOR LOW-LATENCY PRODUCTION PERFORMANCE
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_offline_sync_user ON public.offline_sync_queue (user_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_conv ON public.ai_feedback_ratings (conversation_id);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.offline_sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feedback_ratings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on offline_sync_queue') THEN
        CREATE POLICY "Allow public access on offline_sync_queue" ON public.offline_sync_queue FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on ai_feedback_ratings') THEN
        CREATE POLICY "Allow public access on ai_feedback_ratings" ON public.ai_feedback_ratings FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- REALTIME PUBLICATION SETUP
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.offline_sync_queue;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
