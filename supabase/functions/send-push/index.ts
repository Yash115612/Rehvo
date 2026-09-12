import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushMessagePayload {
  to: string;
  sound?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  badge?: number;
  channelId?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      userIds,
      userId,
      title,
      body,
      category = 'default',
      data = {},
      sound = 'default',
      badge,
      channelId = 'default',
    } = await req.json();

    const targetUserIds: string[] = userIds || (userId ? [userId] : []);

    if (targetUserIds.length === 0 || !title || !body) {
      return new Response(
        JSON.stringify({ success: false, error: 'Target userIds, title, and body are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Fetch preferences for all target users
    const { data: preferences } = await supabase
      .from('notification_preferences')
      .select('*')
      .in('user_id', targetUserIds);

    const prefsMap = new Map((preferences || []).map((p: any) => [p.user_id, p]));

    // 2. Fetch active push tokens
    const { data: tokens } = await supabase
      .from('push_tokens')
      .select('*')
      .in('user_id', targetUserIds)
      .eq('is_active', true);

    const now = new Date();
    const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const messagesToSend: PushMessagePayload[] = [];
    const logEntries: any[] = [];
    const inAppNotifications: any[] = [];

    for (const uid of targetUserIds) {
      const userPrefs = prefsMap.get(uid);

      // In-App Notification entry
      inAppNotifications.push({
        user_id: uid,
        title,
        body,
        type: category,
        data: data || {},
        is_read: false,
      });

      // Check category preference suppression
      let isCategorySuppressed = false;
      if (userPrefs) {
        if (category === 'messages' && userPrefs.messages === false) isCategorySuppressed = true;
        if (category === 'visits' && userPrefs.visits === false) isCategorySuppressed = true;
        if (category === 'property' && userPrefs.property_updates === false) isCategorySuppressed = true;
        if (category === 'wallet' && userPrefs.wallet_rewards === false) isCategorySuppressed = true;
        if (category === 'flatmate' && userPrefs.flatmates === false) isCategorySuppressed = true;
        if (category === 'owner' && userPrefs.owner_leads === false) isCategorySuppressed = true;
        if (category === 'rent' && userPrefs.rent_due === false) isCategorySuppressed = true;
        if (category === 'marketing' && userPrefs.marketing === false) isCategorySuppressed = true;
      }

      // Check Quiet Hours suppression
      let isQuietHours = false;
      if (userPrefs?.quiet_hours_enabled) {
        const start = userPrefs.quiet_hours_start || '22:00';
        const end = userPrefs.quiet_hours_end || '08:00';
        if (start > end) {
          // Crosses midnight, e.g. 22:00 to 08:00
          if (currentHourMin >= start || currentHourMin <= end) isQuietHours = true;
        } else {
          if (currentHourMin >= start && currentHourMin <= end) isQuietHours = true;
        }
      }

      const userTokens = (tokens || []).filter((t: any) => t.user_id === uid);

      for (const t of userTokens) {
        if (isCategorySuppressed) {
          logEntries.push({
            user_id: uid,
            push_token: t.push_token,
            title,
            body,
            category,
            data,
            status: 'suppressed_preference',
          });
          continue;
        }

        if (isQuietHours) {
          logEntries.push({
            user_id: uid,
            push_token: t.push_token,
            title,
            body,
            category,
            data,
            status: 'suppressed_quiet_hours',
          });
          continue;
        }

        messagesToSend.push({
          to: t.push_token,
          sound: userPrefs?.sound_enabled !== false ? sound : undefined,
          title,
          body,
          data,
          badge,
          channelId,
        });

        logEntries.push({
          user_id: uid,
          push_token: t.push_token,
          title,
          body,
          category,
          data,
          status: 'sent',
        });
      }
    }

    // 3. Send batches to Expo Push API
    if (messagesToSend.length > 0) {
      const CHUNK_SIZE = 100;
      for (let i = 0; i < messagesToSend.length; i += CHUNK_SIZE) {
        const chunk = messagesToSend.slice(i, i + CHUNK_SIZE);
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chunk),
        });
      }
    }

    // 4. Save to notifications and notification_logs
    if (inAppNotifications.length > 0) {
      await supabase.from('notifications').insert(inAppNotifications);
    }
    if (logEntries.length > 0) {
      await supabase.from('notification_logs').insert(logEntries);
    }

    return new Response(
      JSON.stringify({
        success: true,
        sentCount: messagesToSend.length,
        inAppCount: inAppNotifications.length,
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
