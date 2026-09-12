-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 021_chat_presence_and_editing.sql
-- Description: Complete Chat Ecosystem Polish:
--              1. Alter conversations (add 'support' to type check)
--              2. Alter messages (add 'audio' and 'location' to message_type check)
--              3. Alter messages (is_edited, edited_at, is_deleted, deleted_for)
--              4. Indexes & Realtime publication updates
-- ==============================================================================

-- 1. CONVERSATIONS TYPE EXPANSION
DO $$
BEGIN
    ALTER TABLE public.conversations DROP CONSTRAINT IF EXISTS conversations_type_check;
    ALTER TABLE public.conversations 
    ADD CONSTRAINT conversations_type_check 
    CHECK (type IN ('property', 'flatmate', 'owner', 'system', 'lead', 'support'));
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- 2. MESSAGES TYPE & EDITING COLUMNS
DO $$
BEGIN
    ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_message_type_check;
    ALTER TABLE public.messages 
    ADD CONSTRAINT messages_message_type_check 
    CHECK (message_type IN (
        'text',
        'image',
        'document',
        'property',
        'visit',
        'agreement',
        'rent_reminder',
        'system',
        'visit_request',
        'location',
        'audio'
    ));

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'is_edited'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN is_edited BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'edited_at'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN edited_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'is_deleted'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'deleted_for'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN deleted_for UUID[] DEFAULT ARRAY[]::UUID[];
    END IF;
END $$;

-- 3. INDEXES FOR RAPID RETRIEVAL & REALTIME
CREATE INDEX IF NOT EXISTS idx_messages_conv_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_deleted ON public.messages(is_deleted) WHERE is_deleted = true;
CREATE INDEX IF NOT EXISTS idx_conversations_type_support ON public.conversations(type) WHERE type = 'support';

-- 4. REALTIME PUBLICATION ENSURANCE
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_typing_status;
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
    END IF;
END $$;
