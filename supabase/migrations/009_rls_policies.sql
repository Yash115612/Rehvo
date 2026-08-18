-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 009_rls_policies.sql
-- Description: Complete Row Level Security (RLS) policies across all tables
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.service_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flatmate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_flatmates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 1. SERVICE CITIES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view active service cities"
    ON public.service_cities FOR SELECT
    USING (status = 'active' OR public.is_admin());

CREATE POLICY "Admins can manage service cities"
    ON public.service_cities FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 2. PROFILES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view non-blocked profiles"
    ON public.profiles FOR SELECT
    USING (is_blocked = FALSE OR public.is_admin());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin())
    WITH CHECK (auth.uid() = id OR public.is_admin());

-- ------------------------------------------------------------------------------
-- 3. PROPERTIES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Anyone can view published properties"
    ON public.properties FOR SELECT
    USING (status = 'published' OR auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Owners can insert properties"
    ON public.properties FOR INSERT
    WITH CHECK (auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Owners and admins can update properties"
    ON public.properties FOR UPDATE
    USING (auth.uid() = owner_id OR public.is_admin())
    WITH CHECK (auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Owners and admins can delete properties"
    ON public.properties FOR DELETE
    USING (auth.uid() = owner_id OR public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. PROPERTY IMAGES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Anyone can view property images"
    ON public.property_images FOR SELECT
    USING (TRUE);

CREATE POLICY "Property owners and admins can manage images"
    ON public.property_images FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.properties
            WHERE properties.id = property_images.property_id
              AND (properties.owner_id = auth.uid() OR public.is_admin())
        )
    );

-- ------------------------------------------------------------------------------
-- 5. FLATMATE PROFILES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Anyone can view published flatmate profiles"
    ON public.flatmate_profiles FOR SELECT
    USING (status = 'published' OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own flatmate profile"
    ON public.flatmate_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flatmate profile"
    ON public.flatmate_profiles FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can delete own flatmate profile"
    ON public.flatmate_profiles FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. SAVED PROPERTIES & FLATMATES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can manage own saved properties"
    ON public.saved_properties FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own saved flatmates"
    ON public.saved_flatmates FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 7. ENQUIRIES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Enquiry participants and admins can view enquiries"
    ON public.enquiries FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Authenticated users can create enquiries"
    ON public.enquiries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Participants and admins can update enquiry status"
    ON public.enquiries FOR UPDATE
    USING (auth.uid() = user_id OR auth.uid() = owner_id OR public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. VISITS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Visit participants and admins can view visits"
    ON public.visits FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Users can book visits"
    ON public.visits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Participants and admins can update visit status"
    ON public.visits FOR UPDATE
    USING (auth.uid() = user_id OR auth.uid() = owner_id OR public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. CHAT POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Conversation participants and admins can view conversations"
    ON public.conversations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.conversation_participants
            WHERE conversation_participants.conversation_id = conversations.id
              AND conversation_participants.user_id = auth.uid()
        ) OR public.is_admin()
    );

CREATE POLICY "Conversation participants can view participant rows"
    ON public.conversation_participants FOR SELECT
    USING (
        conversation_id IN (
            SELECT cp.conversation_id FROM public.conversation_participants cp WHERE cp.user_id = auth.uid()
        ) OR public.is_admin()
    );

CREATE POLICY "Participants can view messages"
    ON public.messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.conversation_participants
            WHERE conversation_participants.conversation_id = messages.conversation_id
              AND conversation_participants.user_id = auth.uid()
        ) OR public.is_admin()
    );

CREATE POLICY "Participants can send messages"
    ON public.messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM public.conversation_participants
            WHERE conversation_participants.conversation_id = messages.conversation_id
              AND conversation_participants.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------
-- 10. NOTIFICATIONS & TOKENS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own push tokens"
    ON public.user_push_tokens FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 11. TRUST & SAFETY POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view own verifications; Admins view all"
    ON public.verification_requests FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can submit verification requests"
    ON public.verification_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update verification requests"
    ON public.verification_requests FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Reporters and Admins can view safety reports"
    ON public.safety_reports FOR SELECT
    USING (auth.uid() = reporter_id OR public.is_admin());

CREATE POLICY "Authenticated users can submit safety reports"
    ON public.safety_reports FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can resolve safety reports"
    ON public.safety_reports FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Users can view own support tickets; Admins view all"
    ON public.support_tickets FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create support tickets"
    ON public.support_tickets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage support tickets"
    ON public.support_tickets FOR UPDATE
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 12. ADMIN GOVERNANCE POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Only active admins can view admin directory"
    ON public.admin_users FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Only admins can view audit logs"
    ON public.admin_audit_logs FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can insert audit logs"
    ON public.admin_audit_logs FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Public can view system settings; Admins can update"
    ON public.system_settings FOR SELECT
    USING (TRUE);

CREATE POLICY "Admins can update system settings"
    ON public.system_settings FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
