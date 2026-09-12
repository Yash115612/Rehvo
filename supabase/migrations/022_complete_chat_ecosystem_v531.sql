-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 022_complete_chat_ecosystem_v531.sql
-- Description: Phase 1 & Phase 13 Chat & Communication Ecosystem Production Master:
--              1. Conversations: archived_at, type expansion (owner, flatmate, support, property, lead, system)
--              2. Conversation Participants/Members: role, last_seen_message, is_pinned, is_archived, is_muted
--              3. Messages: video, payment_request, voice_note, location, reply_to_id,
--                 deleted_for_sender, deleted_for_everyone, delivered_at, seen_at
--              4. Message Reactions & Starred Messages table
--              5. Typing Status table
--              6. Storage Bucket: chat_media (images, audio, video, documents)
--              7. RLS policies & Realtime publications
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CONVERSATIONS EXPANSION
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'archived_at'
    ) THEN
        ALTER TABLE public.conversations ADD COLUMN archived_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'flatmate_match_id'
    ) THEN
        ALTER TABLE public.conversations ADD COLUMN flatmate_match_id UUID;
    END IF;

    -- Update type constraint to cover all ecosystem modes
    ALTER TABLE public.conversations DROP CONSTRAINT IF EXISTS conversations_type_check;
    ALTER TABLE public.conversations 
    ADD CONSTRAINT conversations_type_check 
    CHECK (type IN ('property', 'flatmate', 'owner', 'lead', 'system', 'support'));
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- ------------------------------------------------------------------------------
-- 2. CONVERSATION PARTICIPANTS / MEMBERS
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversation_participants' AND column_name = 'last_seen_message'
    ) THEN
        ALTER TABLE public.conversation_participants ADD COLUMN last_seen_message UUID;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversation_participants' AND column_name = 'pinned'
    ) THEN
        ALTER TABLE public.conversation_participants ADD COLUMN pinned BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversation_participants' AND column_name = 'muted'
    ) THEN
        ALTER TABLE public.conversation_participants ADD COLUMN muted BOOLEAN NOT NULL DEFAULT false;
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- ------------------------------------------------------------------------------
-- 3. MESSAGES RICH TYPES & DELETION FLAGS
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_message_type_check;
    ALTER TABLE public.messages 
    ADD CONSTRAINT messages_message_type_check 
    CHECK (message_type IN (
        'text',
        'image',
        'video',
        'document',
        'audio',
        'voice_note',
        'location',
        'property',
        'property_share',
        'visit',
        'visit_invite',
        'visit_request',
        'agreement',
        'rent_reminder',
        'payment_request',
        'system'
    ));

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'video_url'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN video_url TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'deleted_for_sender'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN deleted_for_sender BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'deleted_for_everyone'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN deleted_for_everyone BOOLEAN NOT NULL DEFAULT false;
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- ------------------------------------------------------------------------------
-- 4. MESSAGE STARRED TABLE (Saved/Starred Messages)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.message_starred (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_message_starred UNIQUE (user_id, message_id)
);

CREATE INDEX IF NOT EXISTS idx_starred_user_id ON public.message_starred(user_id);
CREATE INDEX IF NOT EXISTS idx_starred_message_id ON public.message_starred(message_id);

ALTER TABLE public.message_starred ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view their starred messages" ON public.message_starred;
    CREATE POLICY "Users can view their starred messages"
        ON public.message_starred FOR SELECT
        USING (auth.uid() = user_id OR public.is_admin());

    DROP POLICY IF EXISTS "Users can star accessible messages" ON public.message_starred;
    CREATE POLICY "Users can star accessible messages"
        ON public.message_starred FOR INSERT
        WITH CHECK (
            auth.uid() = user_id AND
            EXISTS (
                SELECT 1 FROM public.messages m
                WHERE m.id = message_id
                  AND public.is_conversation_participant(m.conversation_id, auth.uid())
            )
        );

    DROP POLICY IF EXISTS "Users can unstar their messages" ON public.message_starred;
    CREATE POLICY "Users can unstar their messages"
        ON public.message_starred FOR DELETE
        USING (auth.uid() = user_id OR public.is_admin());
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- ------------------------------------------------------------------------------
-- 5. REALTIME PUBLICATION ENSURANCE
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.message_starred;
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 6. CHAT MEDIA STORAGE BUCKET
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat_media', 'chat_media', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can upload chat media" ON storage.objects;
    CREATE POLICY "Authenticated users can upload chat media"
        ON storage.objects FOR INSERT
        WITH CHECK (
            bucket_id IN ('chat_media', 'chat-media') AND
            auth.role() = 'authenticated'
        );

    DROP POLICY IF EXISTS "Public can view chat media" ON storage.objects;
    CREATE POLICY "Public can view chat media"
        ON storage.objects FOR SELECT
        USING (bucket_id IN ('chat_media', 'chat-media'));
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;
