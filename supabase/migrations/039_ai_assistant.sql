-- =============================================================================
-- REHVO V6.4: AI ASSISTANT OPERATING SYSTEM MIGRATION
-- Migration: 039_ai_assistant.sql
-- Description: Complete database schema for REHVO AI ChatGPT-grade assistant,
--              property queries, budget profiles, negotiation sessions,
--              memory, and usage telemetry.
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. AI CONVERSATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    title TEXT NOT NULL DEFAULT 'New Property Inquiry',
    summary TEXT,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    context_type TEXT NOT NULL DEFAULT 'general' CHECK (context_type IN ('general', 'property', 'neighborhood', 'negotiation', 'agreement', 'flatmate', 'budget', 'movein')),
    context_id TEXT, -- e.g. property_id, locality name, or flatmate_id
    last_message_preview TEXT,
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. AI MESSAGES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'property_card', 'map_card', 'negotiation_card', 'agreement_card', 'wallet_card', 'checklist_card', 'voice_note')),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    audio_url TEXT,
    tokens_used INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. AI SAVED CHATS & BOOKMARKS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_saved_chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    tag TEXT NOT NULL DEFAULT 'Important',
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. AI PROPERTY QUERIES (Audit & History per listing)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_property_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    property_id TEXT NOT NULL,
    query_type TEXT NOT NULL CHECK (query_type IN (
        'overpriced_check',
        'safety_check',
        'bachelor_fit',
        'family_fit',
        'commute_analysis',
        'investment_analysis',
        'hidden_costs',
        'schools',
        'metro',
        'custom'
    )),
    user_question TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. AI BUDGET PROFILES (Personal Finance Memory)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_budget_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE,
    monthly_take_home NUMERIC NOT NULL DEFAULT 120000,
    target_rent NUMERIC NOT NULL DEFAULT 40000,
    max_rent NUMERIC NOT NULL DEFAULT 50000,
    target_deposit NUMERIC NOT NULL DEFAULT 80000,
    preferred_localities TEXT[] NOT NULL DEFAULT ARRAY['BKC', 'Bandra West', 'Powai']::TEXT[],
    work_location TEXT NOT NULL DEFAULT 'BKC',
    lifestyle_preferences JSONB NOT NULL DEFAULT '{"petFriendly": false, "cooksDaily": true, "gymEnthusiast": true, "wfhDays": 2}'::jsonb,
    estimated_monthly_bills JSONB NOT NULL DEFAULT '{"electricity": 2500, "gas": 800, "wifi": 999, "maintenance": 3500}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. AI NEGOTIATION SESSIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_negotiation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    property_id TEXT NOT NULL,
    asking_rent NUMERIC NOT NULL,
    target_rent NUMERIC NOT NULL,
    recommended_counter_rent NUMERIC NOT NULL,
    confidence_score NUMERIC NOT NULL DEFAULT 85,
    strategy TEXT NOT NULL DEFAULT 'Balanced Value',
    whatsapp_script_en TEXT NOT NULL,
    whatsapp_script_hi TEXT NOT NULL,
    call_script_en TEXT NOT NULL,
    call_script_hi TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'accepted', 'rejected', 'countered')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. AI RECOMMENDATION HISTORY
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_recommendation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    query_context TEXT NOT NULL,
    recommended_property_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    reasoning TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. AI USAGE METRICS & TELEMETRY
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_usage_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    feature_name TEXT NOT NULL,
    tokens_prompt INTEGER NOT NULL DEFAULT 0,
    tokens_completion INTEGER NOT NULL DEFAULT 0,
    latency_ms INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'success',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON public.ai_conversations(user_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_pinned ON public.ai_conversations(user_id, is_pinned);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conv ON public.ai_messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_ai_saved_chats_user ON public.ai_saved_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_property_queries_prop ON public.ai_property_queries(property_id, query_type);
CREATE INDEX IF NOT EXISTS idx_ai_negotiation_sessions_user ON public.ai_negotiation_sessions(user_id, property_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_metrics_feature ON public.ai_usage_metrics(feature_name, created_at DESC);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_saved_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_property_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_budget_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_negotiation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_metrics ENABLE ROW LEVEL SECURITY;

-- Permissive RLS Policies for authenticated and anon users
DO $$
BEGIN
    -- ai_conversations
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on ai_conversations') THEN
        CREATE POLICY "Allow public access on ai_conversations" ON public.ai_conversations FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- ai_messages
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on ai_messages') THEN
        CREATE POLICY "Allow public access on ai_messages" ON public.ai_messages FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- ai_saved_chats
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on ai_saved_chats') THEN
        CREATE POLICY "Allow public access on ai_saved_chats" ON public.ai_saved_chats FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- ai_property_queries
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on ai_property_queries') THEN
        CREATE POLICY "Allow public access on ai_property_queries" ON public.ai_property_queries FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- ai_budget_profiles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on ai_budget_profiles') THEN
        CREATE POLICY "Allow public access on ai_budget_profiles" ON public.ai_budget_profiles FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- ai_negotiation_sessions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on ai_negotiation_sessions') THEN
        CREATE POLICY "Allow public access on ai_negotiation_sessions" ON public.ai_negotiation_sessions FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- ai_recommendation_history
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on ai_recommendation_history') THEN
        CREATE POLICY "Allow public access on ai_recommendation_history" ON public.ai_recommendation_history FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- ai_usage_metrics
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on ai_usage_metrics') THEN
        CREATE POLICY "Allow public access on ai_usage_metrics" ON public.ai_usage_metrics FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- REALTIME PUBLICATION
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_conversations;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_messages;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_negotiation_sessions;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- SEED DATA (Default Starter Assistant Memory & Conversation)
-- -----------------------------------------------------------------------------
INSERT INTO public.ai_conversations (id, title, summary, is_pinned, context_type, last_message_preview)
VALUES (
    'a1000000-0000-0000-0000-000000000001',
    'Welcome to REHVO AI Concierge',
    'Personal assistant introduction and capability overview for luxury renting in Mumbai',
    true,
    'general',
    'Namaste! I am your REHVO AI Property Concierge. How can I help you find or negotiate your dream home today?'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.ai_messages (conversation_id, sender, content, message_type, metadata)
VALUES (
    'a1000000-0000-0000-0000-000000000001',
    'assistant',
    '👋 **Namaste! I am your REHVO AI Property Concierge.**

I am trained on Mumbai rental trends, 0% brokerage direct owner leases, Leave & License tenancy law, and neighborhood safety indices.

Here are a few things I can do for you:
* 🔍 **Smart Property Search**: *"Find me a 2BHK in Bandra West under ₹65k with gym & parking"*
* 🏷️ **AI Rent Negotiation**: Generate polite & highly persuasive WhatsApp messages or call scripts in Hindi & English
* ⚖️ **Lease Clause Explainer**: Scan any agreement clause for hidden penalties and non-refundable deductions
* 📦 **Move-In Planner**: Custom packing checklist, utility transfers & grocery starter packs
* 🚇 **Commute Intelligence**: Realistic peak hour travel times to BKC, Lower Parel, Powai & Cybercity

Tap one of the quick prompts below or type your question!',
    'text',
    '{"isWelcome": true}'::jsonb
) ON CONFLICT DO NOTHING;
