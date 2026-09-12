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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find visits scheduled for tomorrow that haven't had reminders sent
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const { data: upcomingVisits, error } = await supabase
      .from('visits')
      .select('*, properties(title, locality, address), profiles!visits_user_id_fkey(id, full_name, phone)')
      .eq('visit_date', tomorrowStr)
      .eq('status', 'confirmed');

    if (error) throw error;

    const dispatched: string[] = [];

    for (const visit of upcomingVisits || []) {
      // Create reminder notification
      await supabase.from('notifications').insert({
        user_id: visit.user_id,
        title: 'Upcoming Property Visit Tomorrow 📅',
        message: `Your visit for ${visit.properties?.title || 'property'} in ${visit.properties?.locality || 'Mumbai'} is scheduled for tomorrow at ${visit.visit_time || '11:00 AM'}.`,
        type: 'visit_reminder',
        data: { visit_id: visit.id, property_id: visit.property_id },
      });

      dispatched.push(visit.id);
    }

    return new Response(
      JSON.stringify({ success: true, count: dispatched.length, visitIds: dispatched }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
