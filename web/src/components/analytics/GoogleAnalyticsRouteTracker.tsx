'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { trackPageView } from '@/lib/analytics';

function AnalyticsRouteWatcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;

    const queryString = searchParams?.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalyticsRouteTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsRouteWatcher />
    </Suspense>
  );
}

export const AnalyticsRouteTracker = GoogleAnalyticsRouteTracker;
