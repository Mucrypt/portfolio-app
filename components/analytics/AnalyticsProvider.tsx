'use client'

import { Suspense } from 'react'
import {
  usePageTracking,
  useScrollTracking,
  useTimeTracking,
  useErrorTracking,
  usePerformanceTracking,
  useEngagementTracking,
} from '@/lib/analytics/hooks'

function PageAnalytics() {
  usePageTracking()
  useTimeTracking()
  return null
}

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // These hooks do not require Suspense and should never block rendering.
  useScrollTracking()
  useErrorTracking()
  usePerformanceTracking()
  useEngagementTracking()

  return (
    <>
      {/* Next.js can require Suspense around useSearchParams()-based hooks. */}
      <Suspense fallback={null}>
        <PageAnalytics />
      </Suspense>
      {children}
    </>
  )
}
