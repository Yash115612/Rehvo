// ==============================================================================
// REHVO V6.1 — SUPABASE EDGE FUNCTION: send-bulk-notification
// High-throughput batch notification sender (100-item chunks) with automatic retries
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BulkPayload {
  userIds: string[];
  title: string;
  body: string;
  category?: string;
  type?: string;
  data?: Record<string, any>;
  imageUrl?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const {
      userIds,
      title,
      body,
      category = 'default',
      type = 'system',
      data = {},
      imageUrl,
    }: BulkPayload = await req.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0 || !title || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: userIds array, title, body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Fetch active push tokens for all recipient users
    const { data: tokens } = await supabaseClient
      .from('push_tokens')
      .select('user_id, expo_push_token, push_token')
      .in('user_id', userIds)
      .eq('is_active', true);

    if (!tokens || tokens.length === 0) {
      return new Response(
        JSON.stringify({ success: true, deliveredCount: 0, message: 'No active push tokens found.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Chunk into batches of 100 for Expo Push API guidelines
    const CHUNK_SIZE = 100;
    let successCount = 0;

    for (let i = 0; i < tokens.length; i += CHUNK_SIZE) {
      const chunk = tokens.slice(i, i + CHUNK_SIZE);
      const expoMessages = chunk
        .map((t) => ({
          to: t.expo_push_token || t.push_token,
          sound: 'default',
          title,
          body,
          data: { ...data, category, type },
        }))
        .filter((msg) => msg.to && msg.to.startsWith('ExponentPushToken'));

      if (expoMessages.length === 0) continue;

      let batchSuccess = false;
      let attempts = 0;

      while (!batchSuccess && attempts < 2) {
        attempts++;
        try {
          const res = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(expoMessages),
          });

          if (res.ok) {
            batchSuccess = true;
            const resJson = await res.json();
            const tickets = resJson?.data || [];
            successCount += tickets.filter((t: any) => t.status === 'ok').length;

            // Log deliveries
            for (let k = 0; k < chunk.length; k++) {
              const ticket = tickets[k];
              await supabaseClient.from('notification_delivery_logs').insert({
                push_token: chunk[k].expo_push_token || chunk[k].push_token,
                status: ticket?.status === 'ok' ? 'delivered' : 'failed',
                provider_response: ticket || {},
              });
            }
          }
        } catch {
          // Retry next iteration
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, deliveredCount: successCount, totalRecipients: userIds.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
