-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 014_chat_and_visits_rls.sql
-- Description: Fix Chat RLS infinite recursion, enable conversation creation,
--              participant management, message sending, atomic RPC, and visits.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. HELPER FUNCTION WITH SECURITY DEFINER (NO RECURSION)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_conversation_participant(p_conversation_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = p_conversation_id AND user_id = p_user_id
  );
$$;

-- ------------------------------------------------------------------------------
-- 2. DROP OBSOLETE POLICIES
-- ------------------------------------------------------------------------------

DROP POLICY IF EXISTS "Conversation participants and admins can view conversations" ON public.conversations;
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Conversation participants and admins can update conversations" ON public.conversations;
DROP POLICY IF EXISTS "Admins can delete conversations" ON public.conversations;

DROP POLICY IF EXISTS "Conversation participants can view participant rows" ON public.conversation_participants;
DROP POLICY IF EXISTS "Authenticated users can insert conversation participants" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can update own participant record" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users and admins can delete participant record" ON public.conversation_participants;

DROP POLICY IF EXISTS "Participants can view messages" ON public.messages;
DROP POLICY IF EXISTS "Participants can send messages" ON public.messages;
DROP POLICY IF EXISTS "Senders and admins can update messages" ON public.messages;
DROP POLICY IF EXISTS "Senders and admins can delete messages" ON public.messages;

DROP POLICY IF EXISTS "Visit participants and admins can view visits" ON public.visits;
DROP POLICY IF EXISTS "Users can book visits" ON public.visits;
DROP POLICY IF EXISTS "Participants and admins can update visit status" ON public.visits;
DROP POLICY IF EXISTS "Participants and admins can delete visits" ON public.visits;

-- ------------------------------------------------------------------------------
-- 3. CONVERSATIONS POLICIES
-- ------------------------------------------------------------------------------

CREATE POLICY "Conversation participants and admins can view conversations"
    ON public.conversations FOR SELECT
    USING (public.is_conversation_participant(id, auth.uid()) OR public.is_admin());

CREATE POLICY "Authenticated users can create conversations"
    ON public.conversations FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Conversation participants and admins can update conversations"
    ON public.conversations FOR UPDATE
    USING (public.is_conversation_participant(id, auth.uid()) OR public.is_admin())
    WITH CHECK (public.is_conversation_participant(id, auth.uid()) OR public.is_admin());

CREATE POLICY "Conversation participants and admins can delete conversations"
    ON public.conversations FOR DELETE
    USING (public.is_conversation_participant(id, auth.uid()) OR public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. CONVERSATION PARTICIPANTS POLICIES
-- ------------------------------------------------------------------------------

CREATE POLICY "Conversation participants can view participant rows"
    ON public.conversation_participants FOR SELECT
    USING (user_id = auth.uid() OR public.is_conversation_participant(conversation_id, auth.uid()) OR public.is_admin());

CREATE POLICY "Authenticated users can insert conversation participants"
    ON public.conversation_participants FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own participant record"
    ON public.conversation_participants FOR UPDATE
    USING (user_id = auth.uid() OR public.is_admin())
    WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users and admins can delete participant record"
    ON public.conversation_participants FOR DELETE
    USING (user_id = auth.uid() OR public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. MESSAGES POLICIES
-- ------------------------------------------------------------------------------

CREATE POLICY "Participants can view messages"
    ON public.messages FOR SELECT
    USING (public.is_conversation_participant(conversation_id, auth.uid()) OR public.is_admin());

CREATE POLICY "Participants can send messages"
    ON public.messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        (public.is_conversation_participant(conversation_id, auth.uid()) OR public.is_admin())
    );

CREATE POLICY "Senders and admins can update messages"
    ON public.messages FOR UPDATE
    USING (auth.uid() = sender_id OR public.is_admin())
    WITH CHECK (auth.uid() = sender_id OR public.is_admin());

CREATE POLICY "Senders and admins can delete messages"
    ON public.messages FOR DELETE
    USING (auth.uid() = sender_id OR public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. VISITS POLICIES
-- ------------------------------------------------------------------------------

CREATE POLICY "Visit participants and admins can view visits"
    ON public.visits FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Users can book visits"
    ON public.visits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Participants and admins can update visit status"
    ON public.visits FOR UPDATE
    USING (auth.uid() = user_id OR auth.uid() = owner_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Participants and admins can delete visits"
    ON public.visits FOR DELETE
    USING (auth.uid() = user_id OR auth.uid() = owner_id OR public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. UPDATE MESSAGE TRIGGER FUNCTION WITH SECURITY DEFINER
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_message_sent()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.conversations
    SET last_message_text = NEW.message,
        last_message_at = NEW.created_at,
        updated_at = NOW()
    WHERE id = NEW.conversation_id;

    -- Increment unread count for other participants
    UPDATE public.conversation_participants
    SET unread_count = unread_count + 1
    WHERE conversation_id = NEW.conversation_id AND user_id != NEW.sender_id;

    RETURN NEW;
END;
$$;

-- ------------------------------------------------------------------------------
-- 8. ATOMIC CONVERSATION CREATION RPC (SECURITY DEFINER)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.create_or_get_conversation(
    p_property_id UUID DEFAULT NULL,
    p_flatmate_profile_id UUID DEFAULT NULL,
    p_enquiry_id UUID DEFAULT NULL,
    p_recipient_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_target_user_id UUID := p_recipient_id;
    v_conv_id UUID;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 1. If property_id is provided, resolve owner_id from public.properties
    IF p_property_id IS NOT NULL THEN
        SELECT owner_id INTO v_target_user_id FROM public.properties WHERE id = p_property_id;
        IF v_target_user_id IS NULL THEN
            RAISE EXCEPTION 'Property not found';
        END IF;
    ELSIF p_flatmate_profile_id IS NOT NULL THEN
        SELECT user_id INTO v_target_user_id FROM public.flatmate_profiles WHERE id = p_flatmate_profile_id;
        IF v_target_user_id IS NULL THEN
            RAISE EXCEPTION 'Flatmate profile not found';
        END IF;
    END IF;

    IF v_target_user_id IS NULL THEN
        RAISE EXCEPTION 'Recipient could not be resolved';
    END IF;

    IF v_user_id = v_target_user_id THEN
        RAISE EXCEPTION 'Cannot start conversation with yourself';
    END IF;

    -- 2. Check if conversation already exists between these 2 users for this property/flatmate
    IF p_property_id IS NOT NULL THEN
        SELECT c.id INTO v_conv_id
        FROM public.conversations c
        WHERE c.property_id = p_property_id
          AND EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = c.id AND cp.user_id = v_user_id)
          AND EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = c.id AND cp.user_id = v_target_user_id)
        LIMIT 1;
    ELSIF p_flatmate_profile_id IS NOT NULL THEN
        SELECT c.id INTO v_conv_id
        FROM public.conversations c
        WHERE c.flatmate_profile_id = p_flatmate_profile_id
          AND EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = c.id AND cp.user_id = v_user_id)
          AND EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = c.id AND cp.user_id = v_target_user_id)
        LIMIT 1;
    END IF;

    -- If existing found, return it
    IF v_conv_id IS NOT NULL THEN
        RETURN v_conv_id;
    END IF;

    -- 3. Create new conversation
    INSERT INTO public.conversations (property_id, flatmate_profile_id, enquiry_id, last_message_text, last_message_at)
    VALUES (p_property_id, p_flatmate_profile_id, p_enquiry_id, 'Started conversation', NOW())
    RETURNING id INTO v_conv_id;

    -- 4. Insert both participants
    INSERT INTO public.conversation_participants (conversation_id, user_id, unread_count)
    VALUES 
      (v_conv_id, v_user_id, 0),
      (v_conv_id, v_target_user_id, 0)
    ON CONFLICT (conversation_id, user_id) DO NOTHING;

    RETURN v_conv_id;
END;
$$;

-- ------------------------------------------------------------------------------
-- 9. REALTIME REPLICATION CONFIGURATION
-- ------------------------------------------------------------------------------

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.visits;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;
