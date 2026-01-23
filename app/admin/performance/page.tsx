'use client'

import { useState, useEffect } from 'react'
import {
  Zap,
  TrendingUp,
  Clock,
  Activity,
  CheckCircle,
  AlertTriangle,
  Target,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
} from 'lucide-react'

interface CoreWebVitals {
  lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  fid: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  fcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  ttfb: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
}

interface PerformanceMetrics {
  coreWebVitals: CoreWebVitals
  lighthouse: {
    performance: number
    accessibility: number
    bestPractices: number
    seo: number
  }
  speedIndex: number
  pageLoadTime: number
  domContentLoaded: number
  timeToInteractive: number
}

interface DevicePerformance {
  device: string
  avgLoadTime: number
  samples: number
}

export default function PerformancePage() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [deviceStats, setDeviceStats] = useState<DevicePerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d'>(
    '7d',
  )

  const fetchPerformanceMetrics = async () => {
    setLoading(true)
    try {
      // Simulate fetching performance metrics
      // In production, integrate with Vercel Speed Insights API or Web Vitals API
      setMetrics({
        coreWebVitals: {
          lcp: { value: 1.8, rating: 'good' },
          fid: { value: 85, rating: 'good' },
          cls: { value: 0.05, rating: 'good' },
          fcp: { value: 1.2, rating: 'good' },
          ttfb: { value: 450, rating: 'good' },
        },
        lighthouse: {
          performance: 95,
          accessibility: 98,
          bestPractices: 100,
          seo: 100,
        },
        speedIndex: 1.5,
        pageLoadTime: 1.8,
        domContentLoaded: 1.2,
        timeToInteractive: 2.1,
      })

      setDeviceStats([
        { device: 'Desktop', avgLoadTime: 1.5, samples: 3245 },
        { device: 'Mobile', avgLoadTime: 2.3, samples: 1876 },
        { device: 'Tablet', avgLoadTime: 1.9, samples: 542 },
      ])

      setLoading(false)
    } catch (error) {
      console.error('Error fetching performance metrics:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPerformanceMetrics()
  }, [selectedPeriod])

  const getRatingColor = (rating: CoreWebVitals['lcp']['rating']) => {
    switch (rating) {
      case 'good':
        return 'text-green-600 bg-green-100'
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-100'
      case 'poor':
        return 'text-red-600 bg-red-100'
    }
  }

  const getRatingIcon = (rating: CoreWebVitals['lcp']['rating']) => {
    switch (rating) {
      case 'good':
        return <CheckCircle className='w-5 h-5 text-green-600' />
      case 'needs-improvement':
        return <AlertTriangle className='w-5 h-5 text-yellow-600' />
      case 'poor':
        return <AlertTriangle className='w-5 h-5 text-red-600' />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <div className='p-8'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/3'></div>
          <div className='grid grid-cols-3 gap-4'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-32 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='p-8 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h1 className='text-4xl font-bold text-gray-900 mb-2'>
              Performance Metrics
            </h1>
            <p className='text-gray-600'>
              Core Web Vitals, Speed Insights, and optimization metrics
            </p>
          </div>
          <div className='flex gap-3'>
            <select
              value={selectedPeriod}
              onChange={(e) =>
                setSelectedPeriod(e.target.value as '24h' | '7d' | '30d')
              }
              className='px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='24h'>Last 24 Hours</option>
              <option value='7d'>Last 7 Days</option>
              <option value='30d'>Last 30 Days</option>
            </select>
            <button
              onClick={fetchPerformanceMetrics}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition'
            >
              <RefreshCw className='w-4 h-4' />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 mb-8'>
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-900'>Core Web Vitals</h2>
          <p className='text-sm text-gray-600 mt-1'>
            Google's metrics for user experience quality
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200'>
          {/* LCP */}
          <div className='p-6'>
            <div className='flex items-center gap-3 mb-4'>
              {getRatingIcon(metrics?.coreWebVitals.lcp.rating ?? 'good')}
              <div>
                <div className='text-sm font-medium text-gray-600'>LCP</div>
                <div className='text-xs text-gray-500'>
                  Largest Contentful Paint
                </div>
              </div>
            </div>
            <div className='text-3xl font-bold text-gray-900 mb-2'>
              {metrics?.coreWebVitals.lcp.value}s
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${getRatingColor(
                metrics?.coreWebVitals.lcp.rating ?? 'good',
              )}`}
            >
              {metrics?.coreWebVitals.lcp.rating?.toUpperCase()}
            </span>
            <div className='mt-4 text-xs text-gray-500'>Target: &lt; 2.5s</div>
          </div>

          {/* FID */}
          <div className='p-6'>
            <div className='flex items-center gap-3 mb-4'>
              {getRatingIcon(metrics?.coreWebVitals.fid.rating ?? 'good')}
              <div>
                <div className='text-sm font-medium text-gray-600'>FID</div>
                <div className='text-xs text-gray-500'>First Input Delay</div>
              </div>
            </div>
            <div className='text-3xl font-bold text-gray-900 mb-2'>
              {metrics?.coreWebVitals.fid.value}ms
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${getRatingColor(
                metrics?.coreWebVitals.fid.rating ?? 'good',
              )}`}
            >
              {metrics?.coreWebVitals.fid.rating?.toUpperCase()}
            </span>
            <div className='mt-4 text-xs text-gray-500'>Target: &lt; 100ms</div>
          </div>

          {/* CLS */}
          <div className='p-6'>
            <div className='flex items-center gap-3 mb-4'>
              {getRatingIcon(metrics?.coreWebVitals.cls.rating ?? 'good')}
              <div>
                <div className='text-sm font-medium text-gray-600'>CLS</div>
                <div className='text-xs text-gray-500'>
                  Cumulative Layout Shift
                </div>
              </div>
            </div>
            <div className='text-3xl font-bold text-gray-900 mb-2'>
              {metrics?.coreWebVitals.cls.value}
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${getRatingColor(
                metrics?.coreWebVitals.cls.rating ?? 'good',
              )}`}
            >
              {metrics?.coreWebVitals.cls.rating?.toUpperCase()}
            </span>
            <div className='mt-4 text-xs text-gray-500'>Target: &lt; 0.1</div>
          </div>

          {/* FCP */}
          <div className='p-6'>
            <div className='flex items-center gap-3 mb-4'>
              {getRatingIcon(metrics?.coreWebVitals.fcp.rating ?? 'good')}
              <div>
                <div className='text-sm font-medium text-gray-600'>FCP</div>
                <div className='text-xs text-gray-500'>
                  First Contentful Paint
                </div>
              </div>
            </div>
            <div className='text-3xl font-bold text-gray-900 mb-2'>
              {metrics?.coreWebVitals.fcp.value}s
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${getRatingColor(
                metrics?.coreWebVitals.fcp.rating ?? 'good',
              )}`}
            >
              {metrics?.coreWebVitals.fcp.rating?.toUpperCase()}
            </span>
            <div className='mt-4 text-xs text-gray-500'>Target: &lt; 1.8s</div>
          </div>

          {/* TTFB */}
          <div className='p-6'>
            <div className='flex items-center gap-3 mb-4'>
              {getRatingIcon(metrics?.coreWebVitals.ttfb.rating ?? 'good')}
              <div>
                <div className='text-sm font-medium text-gray-600'>TTFB</div>
                <div className='text-xs text-gray-500'>Time to First Byte</div>
              </div>
            </div>
            <div className='text-3xl font-bold text-gray-900 mb-2'>
              {metrics?.coreWebVitals.ttfb.value}ms
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${getRatingColor(
                metrics?.coreWebVitals.ttfb.rating ?? 'good',
              )}`}
            >
              {metrics?.coreWebVitals.ttfb.rating?.toUpperCase()}
            </span>
            <div className='mt-4 text-xs text-gray-500'>Target: &lt; 800ms</div>
          </div>
        </div>
      </div>

      {/* Lighthouse Scores */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 mb-8'>
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Lighthouse Scores
          </h2>
          <p className='text-sm text-gray-600 mt-1'>
            Automated auditing for quality and performance
          </p>
        </div>
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* Performance */}
            <div className='text-center'>
              <div className='relative inline-flex items-center justify-center mb-4'>
                <svg className='w-32 h-32 transform -rotate-90'>
                  <circle
                    cx='64'
                    cy='64'
                    r='56'
                    stroke='currentColor'
                    strokeWidth='8'
                    fill='none'
                    className='text-gray-200'
                  />
                  <circle
                    cx='64'
                    cy='64'
                    r='56'
                    stroke='currentColor'
                    strokeWidth='8'
                    fill='none'
                    strokeDasharray={`${(metrics?.lighthouse?.performance ?? 0 / 100) * 351.86} 351.86`}
                    className={getScoreBackground(
                      metrics?.lighthouse?.performance ?? 0,
                    )}
                  />
                </svg>
                <div className='absolute'>
                  <div
                    className={`text-3xl font-bold ${getScoreColor(metrics?.lighthouse?.performance ?? 0)}`}
                  >
                    {metrics?.lighthouse.performance}
                  </div>
                </div>
              </div>
              <div className='font-semibold text-gray-900'>Performance</div>
              <div className='text-sm text-gray-500 mt-1'>
                Speed & optimization
              </div>
            </div>

            {/* Accessibility */}
            <div className='text-center'>
              <div className='relative inline-flex items-center justify-center mb-4'>
                <svg className='w-32 h-32 transform -rotate-90'>
                  <circle
                    cx='64'
                    cy='64'
                    r='56'
                    stroke='currentColor'
                    strokeWidth='8'
                    fill='none'
                    className='text-gray-200'
                  />
                  <circle
                    cx='64'
                    cy='64'
                    r='56'
                    stroke='currentColor'
                    strokeWidth='8'
                    fill='none'
                    strokeDasharray={`${(metrics?.lighthouse?.accessibility ?? 0 / 100) * 351.86} 351.86`}
                    className={getScoreBackground(
                      metrics?.lighthouse?.accessibility ?? 0,
                    )}
                  />
                </svg>
                <div className='absolute'>
                  <div
                    className={`text-3xl font-bold ${getScoreColor(metrics?.lighthouse?.accessibility ?? 0)}`}
                  >
                    {metrics?.lighthouse.accessibility}
                  </div>
                </div>
              </div>
              <div className='font-semibold text-gray-900'>Accessibility</div>
              <div className='text-sm text-gray-500 mt-1'>WCAG compliance</div>
            </div>

            {/* Best Practices */}
            <div className='text-center'>
              <div className='relative inline-flex items-center justify-center mb-4'>
                <svg className='w-32 h-32 transform -rotate-90'>
                  <circle
                    cx='64'
                    cy='64'
                    r='56'
                    stroke='currentColor'
                    strokeWidth='8'
                    fill='none'
                    className='text-gray-200'
                  />
                  <circle
                    cx='64'
                    cy='64'
                    r='56'
                    stroke='currentColor'
                    strokeWidth='8'
                    fill='none'
                    strokeDasharray={`${(metrics?.lighthouse?.bestPractices ?? 0 / 100) * 351.86} 351.86`}
                    className={getScoreBackground(
                      metrics?.lighthouse?.bestPractices ?? 0,
                    )}
                  />
                </svg>
                <div className='absolute'>
                  <div
                    className={`text-3xl font-bold ${getScoreColor(metrics?.lighthouse?.bestPractices ?? 0)}`}
                  >
                    {metrics?.lighthouse.bestPractices}
                  </div>
                </div>
              </div>
              <div className='font-semibold text-gray-900'>Best Practices</div>
              <div className='text-sm text-gray-500 mt-1'>Code quality</div>
            </div>

            {/* SEO */}
            <div className='text-center'>
              <div className='relative inline-flex items-center justify-center mb-4'>
                <svg className='w-32 h-32 transform -rotate-90'>
                  <circle
                    cx='64'
                    cy='64'
                    r='56'
                    stroke='currentColor'
                    strokeWidth='8'
                    fill='none'
                    className='text-gray-200'
                  />
                  <circle
                    cx='64'
                    cy='64'
                    r='56'
                    stroke='currentColor'
                    strokeWidth='8'
                    fill='none'
                    strokeDasharray={`${(metrics?.lighthouse?.seo ?? 0 / 100) * 351.86} 351.86`}
                    className={getScoreBackground(
                      metrics?.lighthouse?.seo ?? 0,
                    )}
                  />
                </svg>
                <div className='absolute'>
                  <div
                    className={`text-3xl font-bold ${getScoreColor(metrics?.lighthouse?.seo ?? 0)}`}
                  >
                    {metrics?.lighthouse.seo}
                  </div>
                </div>
              </div>
              <div className='font-semibold text-gray-900'>SEO</div>
              <div className='text-sm text-gray-500 mt-1'>
                Search optimization
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        {/* Load Time Metrics */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
          <div className='p-6 border-b border-gray-200'>
            <h3 className='text-lg font-bold text-gray-900'>
              Load Time Metrics
            </h3>
          </div>
          <div className='p-6 space-y-4'>
            <div className='flex items-center justify-between p-4 bg-blue-50 rounded-lg'>
              <div className='flex items-center gap-3'>
                <Clock className='w-5 h-5 text-blue-600' />
                <div>
                  <div className='font-medium text-gray-900'>
                    Page Load Time
                  </div>
                  <div className='text-xs text-gray-500'>
                    Total time to load
                  </div>
                </div>
              </div>
              <div className='text-2xl font-bold text-blue-900'>
                {metrics?.pageLoadTime}s
              </div>
            </div>

            <div className='flex items-center justify-between p-4 bg-purple-50 rounded-lg'>
              <div className='flex items-center gap-3'>
                <Activity className='w-5 h-5 text-purple-600' />
                <div>
                  <div className='font-medium text-gray-900'>
                    DOM Content Loaded
                  </div>
                  <div className='text-xs text-gray-500'>HTML parsed</div>
                </div>
              </div>
              <div className='text-2xl font-bold text-purple-900'>
                {metrics?.domContentLoaded}s
              </div>
            </div>

            <div className='flex items-center justify-between p-4 bg-green-50 rounded-lg'>
              <div className='flex items-center gap-3'>
                <Zap className='w-5 h-5 text-green-600' />
                <div>
                  <div className='font-medium text-gray-900'>
                    Time to Interactive
                  </div>
                  <div className='text-xs text-gray-500'>Fully interactive</div>
                </div>
              </div>
              <div className='text-2xl font-bold text-green-900'>
                {metrics?.timeToInteractive}s
              </div>
            </div>

            <div className='flex items-center justify-between p-4 bg-orange-50 rounded-lg'>
              <div className='flex items-center gap-3'>
                <TrendingUp className='w-5 h-5 text-orange-600' />
                <div>
                  <div className='font-medium text-gray-900'>Speed Index</div>
                  <div className='text-xs text-gray-500'>Visual progress</div>
                </div>
              </div>
              <div className='text-2xl font-bold text-orange-900'>
                {metrics?.speedIndex}s
              </div>
            </div>
          </div>
        </div>

        {/* Device Performance */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
          <div className='p-6 border-b border-gray-200'>
            <h3 className='text-lg font-bold text-gray-900'>
              Device Performance
            </h3>
          </div>
          <div className='p-6 space-y-4'>
            {deviceStats.map((device) => {
              const Icon =
                device.device === 'Desktop'
                  ? Monitor
                  : device.device === 'Mobile'
                    ? Smartphone
                    : Globe
              return (
                <div key={device.device} className='p-4 bg-gray-50 rounded-lg'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-3'>
                      <Icon className='w-5 h-5 text-gray-600' />
                      <div className='font-medium text-gray-900'>
                        {device.device}
                      </div>
                    </div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {device.avgLoadTime}s
                    </div>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-gray-500'>Average load time</span>
                    <span className='text-gray-600'>
                      {device.samples.toLocaleString()} samples
                    </span>
                  </div>
                  <div className='mt-3 w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-blue-600 h-2 rounded-full transition-all'
                      style={{
                        width: `${Math.min((2.5 / device.avgLoadTime) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className='bg-linear-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200'>
        <h3 className='text-lg font-bold text-gray-900 mb-4'>
          Performance Insights
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='flex items-start gap-3 p-4 bg-white rounded-lg'>
            <CheckCircle className='w-5 h-5 text-green-600 shrink-0 mt-0.5' />
            <div>
              <div className='font-medium text-gray-900 mb-1'>
                Excellent Core Web Vitals
              </div>
              <div className='text-sm text-gray-600'>
                All metrics are in the "good" range, providing excellent user
                experience
              </div>
            </div>
          </div>
          <div className='flex items-start gap-3 p-4 bg-white rounded-lg'>
            <Zap className='w-5 h-5 text-purple-600 shrink-0 mt-0.5' />
            <div>
              <div className='font-medium text-gray-900 mb-1'>
                Fast Server Response
              </div>
              <div className='text-sm text-gray-600'>
                TTFB under 500ms indicates optimized backend performance
              </div>
            </div>
          </div>
          <div className='flex items-start gap-3 p-4 bg-white rounded-lg'>
            <Target className='w-5 h-5 text-blue-600 shrink-0 mt-0.5' />
            <div>
              <div className='font-medium text-gray-900 mb-1'>
                Lighthouse Excellence
              </div>
              <div className='text-sm text-gray-600'>
                High scores across all categories demonstrate quality
                implementation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
