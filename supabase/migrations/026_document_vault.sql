-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 026_document_vault.sql
-- Description: DigiLocker-Grade Document Vault System
--              - Expands document_vault with 8 categories, OCR metadata, expiry tracking
--              - Adds document encryption indicators & file checksum
--              - Private storage bucket setup for document-vault
--              - RLS Policies and Realtime publication
-- ==============================================================================

-- 1. EXTEND DOCUMENT VAULT TABLE WITH DIGILOCKER ATTRIBUTES
ALTER TABLE public.document_vault
    ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'identity' CHECK (category IN (
        'identity',
        'income',
        'employment',
        'lease_agreements',
        'rent_receipts',
        'property_docs',
        'police_noc',
        'medical_other'
    )),
    ADD COLUMN IF NOT EXISTS ocr_extracted_text TEXT,
    ADD COLUMN IF NOT EXISTS ocr_metadata JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS expiry_date DATE,
    ADD COLUMN IF NOT EXISTS expiry_reminder_sent BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_encrypted BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS encryption_algorithm TEXT DEFAULT 'AES-256-GCM',
    ADD COLUMN IF NOT EXISTS storage_path TEXT,
    ADD COLUMN IF NOT EXISTS file_checksum TEXT,
    ADD COLUMN IF NOT EXISTS doc_number_masked TEXT,
    ADD COLUMN IF NOT EXISTS issuing_authority TEXT;

CREATE INDEX IF NOT EXISTS idx_document_vault_category ON public.document_vault(category);
CREATE INDEX IF NOT EXISTS idx_document_vault_expiry ON public.document_vault(expiry_date) WHERE expiry_date IS NOT NULL;

-- 2. CREATE STORAGE BUCKET FOR DOCUMENT VAULT (IF NOT EXISTS)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'document-vault',
    'document-vault',
    false,
    26214400, -- 25MB limit
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 26214400,
    allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']::text[];

-- Storage RLS Policies for document-vault bucket
DROP POLICY IF EXISTS "Vault documents accessible only by owner" ON storage.objects;
CREATE POLICY "Vault documents accessible only by owner" ON storage.objects
    FOR ALL
    USING (
        bucket_id = 'document-vault'
        AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin())
    )
    WITH CHECK (
        bucket_id = 'document-vault'
        AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin())
    );

-- 3. REALTIME PUBLICATION
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.document_vault;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
