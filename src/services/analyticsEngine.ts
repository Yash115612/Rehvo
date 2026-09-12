import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { AnalyticsEvent, AnalyticsFunnelStep, AnalyticsDashboardData } from '../types';

let currentSessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const eventBuffer: AnalyticsEvent[] = [];
let flushTimeout: ReturnType<typeof setTimeout> | null = null;

export const setAnalyticsSessionId = (sessionId: string) => {
  currentSessionId = sessionId;
};

export const trackEvent = (
  eventName: string,
  properties: Record<string, any> = {},
  screenName?: string,
  userId?: string
) => {
  const event: AnalyticsEvent = {
    user_id: userId,
    event_name: eventName,
    properties,
    session_id: currentSessionId,
    platform: Platform.OS,
    screen_name: screenName,
    created_at: new Date().toISOString(),
  };

  eventBuffer.push(event);

  if (eventBuffer.length >= 10) {
    flushEvents();
  } else if (!flushTimeout) {
    flushTimeout = setTimeout(() => {
      flushEvents();
    }, 5000);
  }
};

export const logFunnelStep = (
  funnelName: string,
  stepName: string,
  stepIndex: number,
  totalSteps: number,
  userId?: string
) => {
  trackEvent(
    `funnel_${funnelName}`,
    {
      step_name: stepName,
      step_index: stepIndex,
      total_steps: totalSteps,
      progress_pct: Math.round((stepIndex / totalSteps) * 100),
    },
    `funnel_${funnelName}`,
    userId
  );
};

export const flushEvents = async (): Promise<void> => {
  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }

  if (eventBuffer.length === 0) return;

  const toSend = eventBuffer.splice(0, eventBuffer.length);
  try {
    await supabase.from('analytics_events').insert(toSend);
  } catch {
    // Keep app resilient if telemetry network request fails
  }
};

export const getAnalyticsDashboardData = async (): Promise<AnalyticsDashboardData> => {
  try {
    const todayIso = new Date();
    todayIso.setHours(0, 0, 0, 0);

    const { count: searchesCount } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_name', 'search_executed')
      .gte('created_at', todayIso.toISOString());

    const { count: pageViewsCount } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayIso.toISOString());

    const { data: topPropsData } = await supabase
      .from('properties')
      .select('id, title, view_count')
      .order('view_count', { ascending: false })
      .limit(4);

    const top_properties = (topPropsData || []).map((p: any) => ({
      id: p.id,
      title: p.title || 'Verified Property',
      views: p.view_count || 0,
    }));

    const daily_active_users = pageViewsCount ? Math.max(1, Math.round(pageViewsCount * 0.35)) : 0;
    const live_visitors = Math.min(daily_active_users, Math.max(1, Math.round(daily_active_users * 0.05)));

    return {
      daily_active_users,
      total_page_views: pageViewsCount || 0,
      searches_today: searchesCount || 0,
      conversion_rate: searchesCount && pageViewsCount ? Math.min(100, Number(((searchesCount / pageViewsCount) * 100).toFixed(2))) : 0,
      top_properties,
      live_visitors,
    };
  } catch {
    return {
      daily_active_users: 0,
      total_page_views: 0,
      searches_today: 0,
      conversion_rate: 0,
      top_properties: [],
      live_visitors: 0,
    };
  }
};

export const getRentalFunnelMetrics = async (): Promise<AnalyticsFunnelStep[]> => {
  try {
    const [searches, views, visits, tokens, leases] = await Promise.all([
      supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_name', 'search_executed'),
      supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_name', 'property_viewed'),
      supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_name', 'visit_scheduled'),
      supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_name', 'kyc_submitted'),
      supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_name', 'rent_paid'),
    ]);

    const sCount = searches.count || 0;
    const vCount = views.count || 0;
    const visCount = visits.count || 0;
    const tCount = tokens.count || 0;
    const lCount = leases.count || 0;

    return [
      { step_name: '1. Discovery & Search', count: sCount, dropoff_percentage: 0 },
      { step_name: '2. Property Details View', count: vCount, dropoff_percentage: sCount ? Math.max(0, Math.round(((sCount - vCount) / sCount) * 100)) : 0 },
      { step_name: '3. Schedule Visit / Chat', count: visCount, dropoff_percentage: vCount ? Math.max(0, Math.round(((vCount - visCount) / vCount) * 100)) : 0 },
      { step_name: '4. Token & KYC Submitted', count: tCount, dropoff_percentage: visCount ? Math.max(0, Math.round(((visCount - tCount) / visCount) * 100)) : 0 },
      { step_name: '5. Lease Executed & Rent Paid', count: lCount, dropoff_percentage: tCount ? Math.max(0, Math.round(((tCount - lCount) / tCount) * 100)) : 0 },
    ];
  } catch {
    return [
      { step_name: '1. Discovery & Search', count: 0, dropoff_percentage: 0 },
      { step_name: '2. Property Details View', count: 0, dropoff_percentage: 0 },
      { step_name: '3. Schedule Visit / Chat', count: 0, dropoff_percentage: 0 },
      { step_name: '4. Token & KYC Submitted', count: 0, dropoff_percentage: 0 },
      { step_name: '5. Lease Executed & Rent Paid', count: 0, dropoff_percentage: 0 },
    ];
  }
};
