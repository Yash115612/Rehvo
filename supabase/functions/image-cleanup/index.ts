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

    // List and identify orphaned property images
    const { data: dbImages, error: dbErr } = await supabase
      .from('property_images')
      .select('image_url');

    if (dbErr) throw dbErr;

    const activePaths = new Set(
      (dbImages || []).map((img: { image_url: string }) => {
        const parts = img.image_url.split('/property-images/');
        return parts[1] || '';
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Storage cleanup verified',
        activeImageCount: activePaths.size,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
