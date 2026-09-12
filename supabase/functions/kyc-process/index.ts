import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { kycId, action, adminNotes, rejectionReason } = await req.json();

    if (!kycId || !action || !['approve', 'reject'].includes(action)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Valid kycId and action (approve/reject) required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const newStatus = action === 'approve' ? 'verified' : 'rejected';

    const { data: kycRecord, error: fetchErr } = await supabase
      .from('kyc_verifications')
      .select('user_id, full_legal_name')
      .eq('id', kycId)
      .single();

    if (fetchErr || !kycRecord) throw new Error('KYC record not found');

    // Update KYC verification table
    await supabase
      .from('kyc_verifications')
      .update({
        status: newStatus,
        admin_notes: adminNotes || null,
        rejection_reason: action === 'reject' ? (rejectionReason || 'Document clarity issue') : null,
        verified_at: action === 'approve' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', kycId);

    // Update profiles & flatmate_profiles tables
    await supabase
      .from('profiles')
      .update({
        verification_status: newStatus,
        kyc_verified: action === 'approve',
        kyc_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', kycRecord.user_id);

    await supabase
      .from('flatmate_profiles')
      .update({
        is_kyc_verified: action === 'approve',
        name: kycRecord.full_legal_name,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', kycRecord.user_id);

    // Send notification
    await supabase.from('notifications').insert({
      user_id: kycRecord.user_id,
      title: action === 'approve' ? 'Identity Verification Approved! 🎉' : 'Identity Verification Needs Review ⚠️',
      message: action === 'approve'
        ? 'Your Aadhaar KYC verification is now 100% complete. Your verified badge is live.'
        : `Your KYC could not be verified: ${rejectionReason || 'Please resubmit clear document photos.'}`,
      type: 'kyc_status',
      data: { kyc_id: kycId, status: newStatus },
    });

    return new Response(
      JSON.stringify({ success: true, status: newStatus }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
