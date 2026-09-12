// ==============================================================================
// REHVO V6.1 — SUPABASE EDGE FUNCTION: notification-scheduler
// Cron-triggered edge function that evaluates scheduled_notifications
// Dispatches due visit reminders, rent dues, and maintenance alerts every minute
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const nowIso = new Date().toISOString();

    // 1. Fetch pending notifications due for delivery
    const { data: dueNotifs, error: fetchErr } = await supabaseClient
      .from('scheduled_notifications')
      .select('*')
      .eq('status', 'pending')
      .or(`schedule_time.lte.${nowIso},scheduled_for.lte.${nowIso}`)
      .limit(100);

    if (fetchErr || !dueNotifs || dueNotifs.length === 0) {
      return new Response(
        JSON.stringify({ success: true, processedCount: 0, message: 'No scheduled notifications due.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let sentCount = 0;

    for (const notif of dueNotifs) {
      const recipientId = notif.user_id || notif.recipient_id;
      if (!recipientId) continue;

      try {
        const { data: tokens } = await supabaseClient
          .from('push_tokens')
          .select('expo_push_token, push_token')
          .eq('user_id', recipientId)
          .eq('is_active', true);

        const activeTokens = (tokens || [])
          .map((t) => t.expo_push_token || t.push_token)
          .filter((tok): tok is string => Boolean(tok && tok.startsWith('ExponentPushToken')));

        if (activeTokens.length > 0) {
          const expoMessages = activeTokens.map((tok) => ({
            to: tok,
            sound: 'default',
            title: notif.title,
            body: notif.body,
            data: notif.data || {},
          }));

          const res = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(expoMessages),
          });

          const result = await res.json();
          const isOk = result?.data?.[0]?.status === 'ok';

          await supabaseClient.from('notification_delivery_logs').insert({
            push_token: activeTokens[0],
            status: isOk ? 'delivered' : 'failed',
            provider_response: result || {},
          });
        }

        // Also record in central notification_events feed
        await supabaseClient.from('notification_events').insert({
          user_id: recipientId,
          recipient_id: recipientId,
          type: notif.data?.type || 'system',
          title: notif.title,
          body: notif.body,
          data: notif.data || {},
        });

        // Mark scheduled record as sent
        await supabaseClient
          .from('scheduled_notifications')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('id', notif.id);

        sentCount++;
      } catch (err: any) {
        await supabaseClient
          .from('scheduled_notifications')
          .update({
            status: 'failed',
            error_message: err?.message || 'Dispatch error',
          })
          .eq('id', notif.id);
      }
    }

    return new Response(
      JSON.stringify({ success: true, processedCount: dueNotifs.length, sentCount }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
