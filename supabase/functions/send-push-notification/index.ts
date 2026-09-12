// ==============================================================================
// REHVO V6.1 — SUPABASE EDGE FUNCTION: send-push-notification
// High-deliverability single notification sender via Expo Push API
// Evaluates user category preferences, quiet hours schedule, logs delivery
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushPayload {
  userId: string;
  title: string;
  body: string;
  category?: string;
  type?: string;
  priority?: 'low' | 'default' | 'high' | 'urgent';
  data?: Record<string, any>;
  imageUrl?: string;
  sound?: string;
  badge?: number;
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

    const payload: PushPayload = await req.json();
    const {
      userId,
      title,
      body,
      category = 'default',
      type = 'system',
      priority = 'default',
      data = {},
      imageUrl,
      sound,
      badge,
    } = payload;

    if (!userId || !title || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: userId, title, body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Fetch user notification preferences
    const { data: prefs } = await supabaseClient
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (prefs) {
      // Check category switch
      const effectiveCategory = category || type;
      if (
        (effectiveCategory === 'chat' && prefs.chat_enabled === false) ||
        (effectiveCategory === 'messages' && (prefs.chat_enabled === false || prefs.messages === false)) ||
        (effectiveCategory === 'property' && (prefs.property_enabled === false || prefs.property_updates === false)) ||
        (effectiveCategory === 'visits' && (prefs.visit_enabled === false || prefs.visits === false)) ||
        (effectiveCategory === 'wallet' && (prefs.wallet_enabled === false || prefs.wallet_rewards === false)) ||
        (effectiveCategory === 'rewards' && (prefs.rewards_enabled === false || prefs.wallet_rewards === false)) ||
        (effectiveCategory === 'society' && prefs.society_enabled === false) ||
        (effectiveCategory === 'marketing' && (prefs.marketing_enabled === false || prefs.marketing === false))
      ) {
        await supabaseClient.from('notification_delivery_logs').insert({
          push_token: 'none',
          status: 'suppressed_preference',
          provider_response: { reason: `Category '${effectiveCategory}' disabled by user` },
        });
        return new Response(
          JSON.stringify({ success: true, status: 'suppressed_preference' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check Quiet Hours (unless priority is urgent)
      if (prefs.quiet_hours_enabled && priority !== 'urgent') {
        const now = new Date();
        const currentHourMin = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;
        const quietStart = prefs.quiet_start || prefs.quiet_hours_start || '22:00';
        const quietEnd = prefs.quiet_end || prefs.quiet_hours_end || '08:00';

        let inQuietHours = false;
        if (quietStart > quietEnd) {
          inQuietHours = currentHourMin >= quietStart || currentHourMin < quietEnd;
        } else {
          inQuietHours = currentHourMin >= quietStart && currentHourMin < quietEnd;
        }

        if (inQuietHours) {
          await supabaseClient.from('notification_delivery_logs').insert({
            push_token: 'none',
            status: 'suppressed_quiet_hours',
            provider_response: { reason: `Quiet Hours window active (${quietStart} - ${quietEnd})` },
          });
          return new Response(
            JSON.stringify({ success: true, status: 'suppressed_quiet_hours' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // 2. Fetch active push tokens for this user
    const { data: tokens, error: tokenError } = await supabaseClient
      .from('push_tokens')
      .select('expo_push_token, push_token, platform, device_os')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (tokenError || !tokens || tokens.length === 0) {
      return new Response(
        JSON.stringify({ success: true, status: 'no_active_tokens' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract valid unique push tokens
    const validTokens = tokens
      .map((t) => t.expo_push_token || t.push_token)
      .filter((tok): tok is string => Boolean(tok && tok.startsWith('ExponentPushToken')));

    if (validTokens.length === 0) {
      return new Response(
        JSON.stringify({ success: true, status: 'no_valid_expo_tokens' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Dispatch to Expo Push API
    const messages = validTokens.map((token) => ({
      to: token,
      sound: prefs?.sound_enabled !== false ? sound || 'default' : null,
      title,
      body,
      data: { ...data, category, type, priority },
      badge: badge ?? undefined,
      channelId:
        category === 'messages' || type === 'chat_message'
          ? 'messages'
          : category === 'visits' || type === 'visit_booking'
          ? 'visits'
          : category === 'wallet' || type === 'cashback'
          ? 'wallet'
          : priority === 'urgent'
          ? 'urgent'
          : 'default',
      _displayInForeground: true,
    }));

    const expoResponse = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const expoResult = await expoResponse.json();

    // 4. Record event in notification_events & delivery logs
    const { data: notifEvent } = await supabaseClient
      .from('notification_events')
      .insert({
        user_id: userId,
        recipient_id: userId,
        type: type || category,
        event_type: category || type,
        title,
        body,
        category,
        priority,
        data,
        image_url: imageUrl,
      })
      .select('id')
      .maybeSingle();

    for (let i = 0; i < validTokens.length; i++) {
      const ticket = expoResult?.data?.[i];
      const isOk = ticket?.status === 'ok';
      await supabaseClient.from('notification_delivery_logs').insert({
        notification_id: notifEvent?.id,
        push_token: validTokens[i],
        status: isOk ? 'delivered' : 'failed',
        provider_response: ticket || {},
      });
    }

    return new Response(
      JSON.stringify({ success: true, tickets: expoResult?.data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
