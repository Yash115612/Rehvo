-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 010_storage_buckets.sql
-- Description: Storage buckets provisioning and storage RLS policies
-- ==============================================================================

-- 1. Create Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('profile-images', 'profile-images', TRUE, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
    ('property-images', 'property-images', TRUE, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp']),
    ('flatmate-images', 'flatmate-images', TRUE, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
    ('verification-documents', 'verification-documents', FALSE, 26214400, ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage RLS Policies for Property Images
CREATE POLICY "Public can view property images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

CREATE POLICY "Owners and admins can delete property images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'property-images' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin()));

-- 3. Storage RLS Policies for Profile & Flatmate Images
CREATE POLICY "Public can view profile and flatmate avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('profile-images', 'flatmate-images'));

CREATE POLICY "Users can upload their own avatars"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id IN ('profile-images', 'flatmate-images') AND 
        (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin())
    );

CREATE POLICY "Users can update their own avatars"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id IN ('profile-images', 'flatmate-images') AND 
        (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin())
    );

-- 4. Storage RLS Policies for Verification Documents (Private)
CREATE POLICY "Only document owners and admins can view verification files"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'verification-documents' AND 
        (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin())
    );

CREATE POLICY "Users can upload verification files to their folder"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'verification-documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );
