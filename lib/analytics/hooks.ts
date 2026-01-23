import { useEffect, useRef, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import * as gtag from './gtag'

// Hook for automatic page view tracking
export function usePageTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const url =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      gtag.pageview(url)
    }
  }, [pathname, searchParams])
}

// Hook for tracking scroll depth
export function useScrollTracking(thresholds: number[] = [25, 50, 75, 100]) {
  const trackedDepths = useRef<Set<number>>(new Set())

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const scrollPercent = Math.round((scrolled / scrollHeight) * 100)

      thresholds.forEach((threshold) => {
        if (
          scrollPercent >= threshold &&
          !trackedDepths.current.has(threshold)
        ) {
          trackedDepths.current.add(threshold)
          gtag.trackScrollDepth(threshold)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [thresholds])
}

// Hook for tracking time on page
export function useTimeTracking() {
  const startTime = useRef<number>(0)
  const pathname = usePathname()

  // Initialize on mount
  if (startTime.current === 0) {
    startTime.current = Date.now()
  }

  useEffect(() => {
    startTime.current = Date.now()

    return () => {
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000)
      if (timeSpent > 3) {
        // Only track if user spent more than 3 seconds
        gtag.trackTimeOnPage(timeSpent, pathname || '')
      }
    }
  }, [pathname])
}

// Hook for tracking element visibility
export function useVisibilityTracking(
  elementRef: React.RefObject<HTMLElement>,
  eventName: string,
  eventParams?: Record<string, any>,
) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (!elementRef.current || hasTracked.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTracked.current) {
            hasTracked.current = true
            gtag.trackPortfolioEvent(eventName as any, eventParams)
          }
        })
      },
      { threshold: 0.5 },
    )

    observer.observe(elementRef.current)

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [elementRef, eventName, eventParams])
}

// Hook for tracking clicks with automatic event delegation
export function useClickTracking() {
  const trackClick = useCallback(
    (element: HTMLElement, eventData?: Record<string, any>) => {
      const tagName = element.tagName.toLowerCase()
      const href = element.getAttribute('href')
      const text = element.textContent?.trim() || ''

      // Track external links
      if (
        tagName === 'a' &&
        href &&
        (href.startsWith('http') || href.startsWith('//'))
      ) {
        const isExternal = !href.includes(window.location.hostname)
        if (isExternal) {
          gtag.trackExternalLink(href, text)
        }
      }

      // Track button clicks
      if (tagName === 'button' || element.getAttribute('role') === 'button') {
        gtag.event({
          action: 'button_click',
          category: 'engagement',
          label: text,
          ...eventData,
        })
      }

      // Track social media links
      const socialPlatforms = [
        'twitter',
        'linkedin',
        'github',
        'facebook',
        'instagram',
      ]
      if (href && socialPlatforms.some((platform) => href.includes(platform))) {
        const platform =
          socialPlatforms.find((p) => href.includes(p)) || 'unknown'
        gtag.trackSocialClick(platform, 'click')
      }
    },
    [],
  )

  return trackClick
}

// Hook for tracking form submissions
export function useFormTracking(formName: string) {
  const trackSubmit = useCallback(
    (formData?: Record<string, any>) => {
      gtag.trackFormSubmit(formName, formData)
    },
    [formName],
  )

  const trackFieldInteraction = useCallback(
    (fieldName: string, action: 'focus' | 'blur' | 'change') => {
      gtag.event({
        action: `form_field_${action}`,
        category: 'form_interaction',
        label: `${formName}:${fieldName}`,
      })
    },
    [formName],
  )

  return { trackSubmit, trackFieldInteraction }
}

// Hook for tracking errors
export function useErrorTracking() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      gtag.trackException(
        `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
        true,
      )
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      gtag.trackException(`Unhandled Promise Rejection: ${event.reason}`, true)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])
}

// Hook for tracking performance metrics
export function usePerformanceTracking() {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) return

    const reportPerformance = () => {
      const navigation = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming

      if (navigation) {
        // Track page load time
        const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart
        gtag.trackTiming(
          'page_load',
          Math.round(pageLoadTime),
          'performance',
          'full_page',
        )

        // Track DNS lookup time
        const dnsTime =
          navigation.domainLookupEnd - navigation.domainLookupStart
        gtag.trackTiming(
          'dns_lookup',
          Math.round(dnsTime),
          'performance',
          'dns',
        )

        // Track server response time
        const serverTime = navigation.responseEnd - navigation.requestStart
        gtag.trackTiming(
          'server_response',
          Math.round(serverTime),
          'performance',
          'server',
        )

        // Track DOM content loaded time
        const domContentLoadedTime =
          navigation.domContentLoadedEventEnd - navigation.fetchStart
        gtag.trackTiming(
          'dom_content_loaded',
          Math.round(domContentLoadedTime),
          'performance',
          'dom',
        )
      }

      // Track First Contentful Paint (FCP)
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0]
      if (fcpEntry) {
        gtag.trackTiming(
          'first_contentful_paint',
          Math.round(fcpEntry.startTime),
          'performance',
          'fcp',
        )
      }

      // Track Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        gtag.trackTiming(
          'largest_contentful_paint',
          Math.round(lastEntry.startTime),
          'performance',
          'lcp',
        )
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    }

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      reportPerformance()
    } else {
      window.addEventListener('load', reportPerformance)
      return () => window.removeEventListener('load', reportPerformance)
    }
  }, [])
}

// Hook for tracking user engagement
export function useEngagementTracking() {
  const isEngaged = useRef(false)
  const interactionCount = useRef(0)

  useEffect(() => {
    const trackEngagement = () => {
      interactionCount.current++

      if (!isEngaged.current && interactionCount.current >= 3) {
        isEngaged.current = true
        gtag.event({
          action: 'user_engaged',
          category: 'engagement',
          label: 'active_user',
          value: interactionCount.current,
        })
      }
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach((event) => {
      window.addEventListener(event, trackEngagement, { passive: true })
    })

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, trackEngagement)
      })
    }
  }, [])
}
