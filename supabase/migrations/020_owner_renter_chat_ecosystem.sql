-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 020_owner_renter_chat_ecosystem.sql
-- Description: Complete Owner <-> Renter Realtime Chat Ecosystem:
--              1. Alter conversations (type, owner_id, tenant_id, pinned, archived, metadata)
--              2. Alter conversation_participants (pinned, archived, muted, role)
--              3. Alter messages (rich message types, media URLs, metadata, reply_to, seen/delivered)
--              4. New table: message_reactions
--              5. New table: chat_typing_status
--              6. Storage bucket: chat-media
--              7. Realtime publications & RLS policies
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CONVERSATIONS ENHANCEMENTS
-- ------------------------------------------------------------------------------

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'type'
    ) THEN
        ALTER TABLE public.conversations 
        ADD COLUMN type TEXT NOT NULL DEFAULT 'property' 
        CHECK (type IN ('property', 'flatmate', 'owner', 'system', 'lead'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'owner_id'
    ) THEN
        ALTER TABLE public.conversations 
        ADD COLUMN owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'tenant_id'
    ) THEN
        ALTER TABLE public.conversations 
        ADD COLUMN tenant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'is_pinned'
    ) THEN
        ALTER TABLE public.conversations 
        ADD COLUMN is_pinned BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'is_archived'
    ) THEN
        ALTER TABLE public.conversations 
        ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversations' AND column_name = 'metadata'
    ) THEN
        ALTER TABLE public.conversations 
        ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_conversations_owner_id ON public.conversations(owner_id);
CREATE INDEX IF NOT EXISTS idx_conversations_tenant_id ON public.conversations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_conversations_type ON public.conversations(type);
CREATE INDEX IF NOT EXISTS idx_conversations_pinned ON public.conversations(is_pinned) WHERE is_pinned = true;
CREATE INDEX IF NOT EXISTS idx_conversations_archived ON public.conversations(is_archived) WHERE is_archived = true;

-- ------------------------------------------------------------------------------
-- 2. CONVERSATION PARTICIPANTS ENHANCEMENTS
-- ------------------------------------------------------------------------------

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversation_participants' AND column_name = 'is_pinned'
    ) THEN
        ALTER TABLE public.conversation_participants 
        ADD COLUMN is_pinned BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversation_participants' AND column_name = 'is_archived'
    ) THEN
        ALTER TABLE public.conversation_participants 
        ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversation_participants' AND column_name = 'is_muted'
    ) THEN
        ALTER TABLE public.conversation_participants 
        ADD COLUMN is_muted BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'conversation_participants' AND column_name = 'role'
    ) THEN
        ALTER TABLE public.conversation_participants 
        ADD COLUMN role TEXT DEFAULT 'member';
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_conv_part_pinned ON public.conversation_participants(user_id, is_pinned) WHERE is_pinned = true;
CREATE INDEX IF NOT EXISTS idx_conv_part_archived ON public.conversation_participants(user_id, is_archived) WHERE is_archived = true;

-- ------------------------------------------------------------------------------
-- 3. MESSAGES ENHANCEMENTS
-- ------------------------------------------------------------------------------

DO $$
BEGIN
    -- Drop old message_type constraint to support expanded rich message types
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
        'visit_request'
    ));

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN image_url TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'document_url'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN document_url TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'location'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN location JSONB;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'metadata'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'reply_to_id'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'seen_at'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN seen_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'delivered_at'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN delivered_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_messages_reply_to_id ON public.messages(reply_to_id);
CREATE INDEX IF NOT EXISTS idx_messages_type ON public.messages(message_type);

-- ------------------------------------------------------------------------------
-- 4. MESSAGE REACTIONS TABLE
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reaction TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_message_reaction UNIQUE (message_id, user_id, reaction)
);

CREATE INDEX IF NOT EXISTS idx_reactions_message_id ON public.message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON public.message_reactions(user_id);

ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view message reactions in their conversations"
    ON public.message_reactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.messages m
            WHERE m.id = message_reactions.message_id
              AND public.is_conversation_participant(m.conversation_id, auth.uid())
        ) OR public.is_admin()
    );

CREATE POLICY "Authenticated users can add reactions to accessible messages"
    ON public.message_reactions FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.messages m
            WHERE m.id = message_id
              AND public.is_conversation_participant(m.conversation_id, auth.uid())
        )
    );

CREATE POLICY "Users can delete own reactions"
    ON public.message_reactions FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. CHAT TYPING STATUS TABLE
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.chat_typing_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_typing BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_conversation_typing UNIQUE (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_typing_conv_user ON public.chat_typing_status(conversation_id, user_id);

ALTER TABLE public.chat_typing_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view typing status"
    ON public.chat_typing_status FOR SELECT
    USING (public.is_conversation_participant(conversation_id, auth.uid()) OR public.is_admin());

CREATE POLICY "Users can upsert own typing status"
    ON public.chat_typing_status FOR ALL
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. ATOMIC LEAD CONVERSATION CREATION RPC
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.create_or_get_lead_conversation(
    p_lead_id TEXT,
    p_property_id UUID DEFAULT NULL,
    p_tenant_id UUID DEFAULT NULL,
    p_owner_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_current_user UUID := auth.uid();
    v_owner UUID := p_owner_id;
    v_tenant UUID := p_tenant_id;
    v_conv_id UUID;
BEGIN
    IF v_current_user IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- If owner not provided, check if current user is owner or resolve from property
    IF v_owner IS NULL AND p_property_id IS NOT NULL THEN
        SELECT owner_id INTO v_owner FROM public.properties WHERE id = p_property_id;
    END IF;

    IF v_owner IS NULL THEN
        v_owner := v_current_user;
    END IF;

    -- Look for existing conversation by metadata lead_id or participants
    SELECT id INTO v_conv_id
    FROM public.conversations
    WHERE (metadata->>'lead_id' = p_lead_id)
       OR (property_id = p_property_id AND owner_id = v_owner AND tenant_id = v_tenant)
    LIMIT 1;

    IF v_conv_id IS NOT NULL THEN
        RETURN v_conv_id;
    END IF;

    -- Create new conversation linked to lead
    INSERT INTO public.conversations (
        property_id,
        owner_id,
        tenant_id,
        type,
        last_message_text,
        last_message_at,
        metadata
    )
    VALUES (
        p_property_id,
        v_owner,
        v_tenant,
        'owner',
        'Lead conversation started',
        NOW(),
        jsonb_build_object('lead_id', p_lead_id)
    )
    RETURNING id INTO v_conv_id;

    -- Add current user and other participant
    INSERT INTO public.conversation_participants (conversation_id, user_id, unread_count, role)
    VALUES (v_conv_id, v_current_user, 0, 'owner')
    ON CONFLICT (conversation_id, user_id) DO NOTHING;

    IF v_tenant IS NOT NULL AND v_tenant != v_current_user THEN
        INSERT INTO public.conversation_participants (conversation_id, user_id, unread_count, role)
        VALUES (v_conv_id, v_tenant, 0, 'tenant')
        ON CONFLICT (conversation_id, user_id) DO NOTHING;
    END IF;

    RETURN v_conv_id;
END;
$$;

-- ------------------------------------------------------------------------------
-- 7. STORAGE BUCKET: chat-media
-- ------------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'chat-media',
    'chat-media',
    true,
    26214400, -- 25MB
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'audio/mpeg',
        'audio/m4a',
        'audio/aac'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 26214400;

-- Storage RLS
CREATE POLICY "Public chat media view policy"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'chat-media');

CREATE POLICY "Authenticated users can upload chat media"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'chat-media' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Senders can delete own chat media"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'chat-media' AND
        auth.uid() = owner
    );

-- ------------------------------------------------------------------------------
-- 8. REALTIME REPLICATION CONFIGURATION
-- ------------------------------------------------------------------------------

DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_typing_status;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;
