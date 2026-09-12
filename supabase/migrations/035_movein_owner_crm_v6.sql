-- ==============================================================================
-- REHVO PRODUCTION SUPABASE MIGRATION
-- Migration: 035_movein_owner_crm_v6.sql
-- Description: Sprints V5.7 & V5.8 — Move-In Concierge & Owner CRM Pro
--              - key_handover
--              - damage_reports
--              - utility_transfers
--              - rent_invoices
--              - rent_payments
--              - late_fee_rules
--              - tenant_balances
--              - lease_renewals
-- ==============================================================================

-- 1. KEY HANDOVER TABLE
CREATE TABLE IF NOT EXISTS public.key_handover (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    lease_id UUID REFERENCES public.lease_agreements(id) ON DELETE SET NULL,
    handover_code TEXT NOT NULL,
    qr_code_data TEXT NOT NULL,
    physical_keys_count INTEGER NOT NULL DEFAULT 2,
    access_cards_count INTEGER NOT NULL DEFAULT 1,
    tenant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    handed_over_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'disputed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_key_handover_prop ON public.key_handover(property_id);
CREATE INDEX IF NOT EXISTS idx_key_handover_tenant ON public.key_handover(tenant_id);

-- 2. DAMAGE REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.damage_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    photo_urls TEXT[] DEFAULT ARRAY[]::text[],
    estimated_repair_cost NUMERIC DEFAULT 0,
    liability TEXT NOT NULL DEFAULT 'pre_existing' CHECK (liability IN ('tenant', 'owner', 'pre_existing')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_damage_reports_prop ON public.damage_reports(property_id);

-- 3. UTILITY TRANSFERS TABLE
CREATE TABLE IF NOT EXISTS public.utility_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    utility_type TEXT NOT NULL CHECK (utility_type IN ('electricity', 'water', 'piped_gas', 'broadband', 'maintenance')),
    provider_name TEXT NOT NULL,
    consumer_number TEXT NOT NULL,
    meter_reading_current NUMERIC DEFAULT 0,
    meter_photo_url TEXT,
    transfer_status TEXT NOT NULL DEFAULT 'pending' CHECK (transfer_status IN ('pending', 'in_progress', 'transferred', 'failed')),
    last_synced_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_utility_transfers_prop ON public.utility_transfers(property_id);

-- 4. RENT INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.rent_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id UUID REFERENCES public.lease_agreements(id) ON DELETE SET NULL,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL UNIQUE,
    month_year TEXT NOT NULL,
    base_rent NUMERIC NOT NULL,
    maintenance_fee NUMERIC DEFAULT 0,
    utility_charges NUMERIC DEFAULT 0,
    late_fees NUMERIC DEFAULT 0,
    discount_applied NUMERIC DEFAULT 0,
    total_amount_due NUMERIC NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'generated' CHECK (status IN ('generated', 'sent', 'paid', 'overdue', 'partially_paid')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_rent_invoices_owner ON public.rent_invoices(owner_id);
CREATE INDEX IF NOT EXISTS idx_rent_invoices_tenant ON public.rent_invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rent_invoices_status ON public.rent_invoices(status);

-- 5. RENT PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.rent_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.rent_invoices(id) ON DELETE CASCADE,
    amount_paid NUMERIC NOT NULL CHECK (amount_paid > 0),
    payment_method TEXT NOT NULL DEFAULT 'upi' CHECK (payment_method IN ('upi', 'netbanking', 'credit_card', 'wallet', 'offline_cash')),
    transaction_reference TEXT NOT NULL,
    gateway_order_id TEXT,
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'pending', 'failed')),
    paid_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_rent_payments_invoice ON public.rent_payments(invoice_id);

-- 6. LATE FEE RULES TABLE
CREATE TABLE IF NOT EXISTS public.late_fee_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    grace_period_days INTEGER NOT NULL DEFAULT 5,
    daily_penalty_amount NUMERIC NOT NULL DEFAULT 100,
    fixed_penalty_amount NUMERIC NOT NULL DEFAULT 500,
    max_penalty_cap NUMERIC NOT NULL DEFAULT 2000,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_late_fee_rules_owner ON public.late_fee_rules(owner_id);

-- 7. TENANT BALANCES TABLE
CREATE TABLE IF NOT EXISTS public.tenant_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    outstanding_balance NUMERIC NOT NULL DEFAULT 0,
    advance_paid NUMERIC NOT NULL DEFAULT 0,
    deposit_held NUMERIC NOT NULL DEFAULT 0,
    last_payment_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_tenant_property_balance UNIQUE (tenant_id, property_id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_balances_tenant ON public.tenant_balances(tenant_id);

-- 8. LEASE RENEWALS TABLE
CREATE TABLE IF NOT EXISTS public.lease_renewals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id UUID REFERENCES public.lease_agreements(id) ON DELETE CASCADE,
    current_rent NUMERIC NOT NULL,
    proposed_rent NUMERIC NOT NULL,
    effective_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'accepted', 'counter_offered', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_lease_renewals_agr ON public.lease_renewals(agreement_id);

-- 9. ROW LEVEL SECURITY
ALTER TABLE public.key_handover ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.damage_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utility_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.late_fee_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lease_renewals ENABLE ROW LEVEL SECURITY;

-- 10. RLS POLICIES
DROP POLICY IF EXISTS "Parties can view key handover" ON public.key_handover;
CREATE POLICY "Parties can view key handover" ON public.key_handover
    FOR SELECT USING (auth.uid() = tenant_id OR auth.uid() = owner_id);

DROP POLICY IF EXISTS "Parties can manage key handover" ON public.key_handover;
CREATE POLICY "Parties can manage key handover" ON public.key_handover
    FOR ALL USING (auth.uid() = tenant_id OR auth.uid() = owner_id);

DROP POLICY IF EXISTS "Parties can view damage reports" ON public.damage_reports;
CREATE POLICY "Parties can view damage reports" ON public.damage_reports
    FOR ALL USING (auth.uid() = reporter_id OR EXISTS (
        SELECT 1 FROM public.properties p WHERE p.id = damage_reports.property_id AND p.owner_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Parties can manage utility transfers" ON public.utility_transfers;
CREATE POLICY "Parties can manage utility transfers" ON public.utility_transfers
    FOR ALL USING (auth.uid() = tenant_id OR auth.uid() = owner_id);

DROP POLICY IF EXISTS "Parties can view rent invoices" ON public.rent_invoices;
CREATE POLICY "Parties can view rent invoices" ON public.rent_invoices
    FOR SELECT USING (auth.uid() = tenant_id OR auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can manage rent invoices" ON public.rent_invoices;
CREATE POLICY "Owners can manage rent invoices" ON public.rent_invoices
    FOR ALL USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Parties can view rent payments" ON public.rent_payments;
CREATE POLICY "Parties can view rent payments" ON public.rent_payments
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.rent_invoices ri
        WHERE ri.id = rent_payments.invoice_id AND (ri.tenant_id = auth.uid() OR ri.owner_id = auth.uid())
    ));

DROP POLICY IF EXISTS "Owners can manage late fee rules" ON public.late_fee_rules;
CREATE POLICY "Owners can manage late fee rules" ON public.late_fee_rules
    FOR ALL USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Parties can view tenant balances" ON public.tenant_balances;
CREATE POLICY "Parties can view tenant balances" ON public.tenant_balances
    FOR SELECT USING (auth.uid() = tenant_id OR EXISTS (
        SELECT 1 FROM public.properties p WHERE p.id = tenant_balances.property_id AND p.owner_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Parties can view lease renewals" ON public.lease_renewals;
CREATE POLICY "Parties can view lease renewals" ON public.lease_renewals
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.lease_agreements la
        WHERE la.id = lease_renewals.agreement_id AND la.user_id = auth.uid()
    ));

-- 11. REALTIME PUBLICATION
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.key_handover;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.damage_reports;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.rent_invoices;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.tenant_balances;
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;
