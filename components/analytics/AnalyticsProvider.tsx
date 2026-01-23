'use client';

import { useEffect } from 'react';
import {
  usePageTracking,
  useScrollTracking,
  useTimeTracking,
  useErrorTracking,
  usePerformanceTracking,
  useEngagementTracking,
} from '@/lib/analytics/hooks';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // Automatic page view tracking
  usePageTracking();
  
  // Track scroll depth at 25%, 50%, 75%, 100%
  useScrollTracking();
  
  // Track time spent on each page
  useTimeTracking();
  
  // Track JavaScript errors
  useErrorTracking();
  
  // Track performance metrics
  usePerformanceTracking();
  
  // Track user engagement
  useEngagementTracking();

  return <>{children}</>;
}
