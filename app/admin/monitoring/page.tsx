'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SystemMetrics {
  cache: {
    connected: boolean
    keys: number
    memory: string
    hits?: number
    misses?: number
    hitRate?: string
  }
  health: {
    status: string
    uptime: number
    environment: string
    version: string
  }
  performance: {
    avgResponseTime: number
    requestsPerMinute: number
    errorRate: number
  }
}

interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: string | null
  user?: string
  status: 'success' | 'error' | 'warning'
}

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchMetrics = useCallback(async () => {
    try {
      // Fetch health check
      const healthRes = await fetch('/api/health')
      const health = await healthRes.json()

      // Fetch cache stats
      const cacheRes = await fetch('/api/cache/stats')
      const cache = await cacheRes.json()

      // Calculate hit rate
      const hits = cache.redis?.hits || 0
      const misses = cache.redis?.misses || 0
      const total = hits + misses
      const hitRate = total > 0 ? ((hits / total) * 100).toFixed(1) : '0'

      setMetrics({
        cache: {
          ...cache.redis,
          hitRate: hitRate + '%',
        },
        health,
        performance: {
          avgResponseTime: 150,
          requestsPerMinute: 45,
          errorRate: 0.1,
        },
      })
    } catch (error) {
      console.error('Error fetching metrics:', error)
    }
  }, [])

  const fetchActivities = useCallback(async () => {
    try {
      const supabase = createClient()

      // Get recent blog posts
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('id, title, created_at, is_published')
        .order('created_at', { ascending: false })
        .limit(5)

      // Get recent service inquiries
      const { data: inquiries } = await supabase
        .from('service_inquiries')
        .select('id, name, service_id, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      const recentActivities: RecentActivity[] = [
        ...(posts?.map((p) => ({
          id: p.id,
          type: 'Blog Post',
          description: `${p.is_published ? 'Published' : 'Created'}: ${p.title}`,
          timestamp: p.created_at,
          status: 'success' as const,
        })) || []),
        ...(inquiries?.map((i) => ({
          id: i.id,
          type: 'Inquiry',
          description: `New inquiry from ${i.name}`,
          timestamp: i.created_at,
          status: 'warning' as const,
        })) || []),
      ]
        .sort((a, b) => {
          const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0
          const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0
          return timeB - timeA
        })
        .slice(0, 10)

      setActivities(recentActivities)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching activities:', error)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMetrics()
    fetchActivities()

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchMetrics()
        fetchActivities()
      }, 30000) // Refresh every 30 seconds

      return () => clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh])

  const clearCache = async () => {
    if (!confirm('Are you sure you want to clear all cache?')) return

    try {
      const res = await fetch('/api/cache/stats', { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        alert('Cache cleared successfully!')
        fetchMetrics()
      } else {
        alert('Failed to clear cache')
      }
    } catch (error) {
      alert('Error clearing cache')
    }
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100'
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className='p-8'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-1/4 mb-4'></div>
          <div className='grid grid-cols-4 gap-4'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className='h-32 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='p-8 max-w-full'>
      {/* Header */}
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            System Monitoring
          </h1>
          <p className='text-gray-600'>
            Real-time system metrics and activity logs
          </p>
        </div>
        <div className='flex gap-3'>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg font-medium ${
              autoRefresh
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {autoRefresh ? '🟢 Auto-refresh ON' : '⚪ Auto-refresh OFF'}
          </button>
          <button
            onClick={() => {
              fetchMetrics()
              fetchActivities()
            }}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700'
          >
            🔄 Refresh Now
          </button>
        </div>
      </div>

      {/* System Health Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {/* Health Status */}
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='flex items-center justify-between mb-3'>
            <div className='text-sm font-medium text-gray-600'>
              System Health
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(metrics?.health.status || '')}`}
            >
              {metrics?.health.status?.toUpperCase()}
            </span>
          </div>
          <div className='text-2xl font-bold text-gray-900 mb-1'>
            {formatUptime(metrics?.health.uptime || 0)}
          </div>
          <div className='text-xs text-gray-500'>Uptime</div>
        </div>

        {/* Redis Cache */}
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='flex items-center justify-between mb-3'>
            <div className='text-sm font-medium text-gray-600'>Redis Cache</div>
            <span
              className={`w-3 h-3 rounded-full ${metrics?.cache.connected ? 'bg-green-500' : 'bg-red-500'}`}
            ></span>
          </div>
          <div className='text-2xl font-bold text-gray-900 mb-1'>
            {metrics?.cache.hitRate || '0%'}
          </div>
          <div className='text-xs text-gray-500'>
            {metrics?.cache.keys || 0} cached keys •{' '}
            {metrics?.cache.memory || '0'}
          </div>
        </div>

        {/* Performance */}
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='flex items-center justify-between mb-3'>
            <div className='text-sm font-medium text-gray-600'>Performance</div>
            <span className='text-green-600'>⚡</span>
          </div>
          <div className='text-2xl font-bold text-gray-900 mb-1'>
            {metrics?.performance.avgResponseTime || 0}ms
          </div>
          <div className='text-xs text-gray-500'>Avg response time</div>
        </div>

        {/* Error Rate */}
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='flex items-center justify-between mb-3'>
            <div className='text-sm font-medium text-gray-600'>Error Rate</div>
            <span className='text-green-600'>✓</span>
          </div>
          <div className='text-2xl font-bold text-gray-900 mb-1'>
            {metrics?.performance.errorRate || 0}%
          </div>
          <div className='text-xs text-gray-500'>
            {metrics?.performance.requestsPerMinute || 0} req/min
          </div>
        </div>
      </div>

      {/* Cache Management */}
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold text-gray-900'>Cache Management</h2>
          <button
            onClick={clearCache}
            className='px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700'
          >
            🗑️ Clear All Cache
          </button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='p-4 bg-blue-50 rounded-lg'>
            <div className='text-sm text-blue-600 mb-1'>Cache Hits</div>
            <div className='text-2xl font-bold text-blue-900'>
              {metrics?.cache.hits?.toLocaleString() || 0}
            </div>
          </div>
          <div className='p-4 bg-orange-50 rounded-lg'>
            <div className='text-sm text-orange-600 mb-1'>Cache Misses</div>
            <div className='text-2xl font-bold text-orange-900'>
              {metrics?.cache.misses?.toLocaleString() || 0}
            </div>
          </div>
          <div className='p-4 bg-green-50 rounded-lg'>
            <div className='text-sm text-green-600 mb-1'>Hit Rate</div>
            <div className='text-2xl font-bold text-green-900'>
              {metrics?.cache.hitRate || '0%'}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
        <h2 className='text-xl font-bold text-gray-900 mb-4'>
          Recent Activity
        </h2>
        <div className='space-y-3'>
          {activities.length === 0 ? (
            <p className='text-gray-500 text-center py-8'>No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition'
              >
                <div className='flex items-center gap-4'>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(activity.status)}`}
                  >
                    {activity.type}
                  </span>
                  <div>
                    <div className='font-medium text-gray-900'>
                      {activity.description}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {activity.timestamp
                        ? new Date(activity.timestamp).toLocaleString()
                        : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
