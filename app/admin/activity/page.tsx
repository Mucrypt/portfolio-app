'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  TrendingUp,
  Globe,
  MousePointer,
  Eye,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  RefreshCw,
  Calendar,
} from 'lucide-react'

interface UserSession {
  id: string
  userId: string
  startTime: string
  duration: number
  pages: number
  device: string
  browser: string
  location: string
  referrer: string
}

interface PageView {
  path: string
  views: number
  uniqueVisitors: number
  avgTime: number
  bounceRate: number
}

interface UserFlow {
  from: string
  to: string
  users: number
}

interface ActivityMetrics {
  activeUsers: number
  totalSessions: number
  avgSessionDuration: number
  pageViews: number
  bounceRate: number
  newUsers: number
  returningUsers: number
}

export default function UserActivityPage() {
  const [metrics, setMetrics] = useState<ActivityMetrics | null>(null)
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [pageViews, setPageViews] = useState<PageView[]>([])
  const [userFlows, setUserFlows] = useState<UserFlow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d'>(
    '7d',
  )

  useEffect(() => {
    fetchUserActivity()
  }, [selectedPeriod])

  const fetchUserActivity = async () => {
    setLoading(true)
    try {
      // Simulate fetching user activity data
      // In production, integrate with Google Analytics 4 Data API or Vercel Analytics API
      setMetrics({
        activeUsers: 23,
        totalSessions: 847,
        avgSessionDuration: 245, // seconds
        pageViews: 3542,
        bounceRate: 42.3,
        newUsers: 156,
        returningUsers: 691,
      })

      setSessions([
        {
          id: '1',
          userId: 'user_12345',
          startTime: new Date(Date.now() - 300000).toISOString(),
          duration: 420,
          pages: 5,
          device: 'Desktop',
          browser: 'Chrome 120',
          location: 'New York, US',
          referrer: 'google.com',
        },
        {
          id: '2',
          userId: 'user_67890',
          startTime: new Date(Date.now() - 600000).toISOString(),
          duration: 180,
          pages: 3,
          device: 'Mobile',
          browser: 'Safari 17',
          location: 'London, UK',
          referrer: 'direct',
        },
        {
          id: '3',
          userId: 'user_24680',
          startTime: new Date(Date.now() - 900000).toISOString(),
          duration: 540,
          pages: 8,
          device: 'Desktop',
          browser: 'Firefox 121',
          location: 'Toronto, CA',
          referrer: 'twitter.com',
        },
        {
          id: '4',
          userId: 'user_13579',
          startTime: new Date(Date.now() - 1200000).toISOString(),
          duration: 95,
          pages: 2,
          device: 'Tablet',
          browser: 'Chrome 120',
          location: 'Sydney, AU',
          referrer: 'linkedin.com',
        },
      ])

      setPageViews([
        {
          path: '/',
          views: 1245,
          uniqueVisitors: 892,
          avgTime: 45,
          bounceRate: 35.2,
        },
        {
          path: '/blog',
          views: 687,
          uniqueVisitors: 523,
          avgTime: 180,
          bounceRate: 28.5,
        },
        {
          path: '/projects',
          views: 542,
          uniqueVisitors: 412,
          avgTime: 120,
          bounceRate: 31.8,
        },
        {
          path: '/about',
          views: 398,
          uniqueVisitors: 321,
          avgTime: 90,
          bounceRate: 40.1,
        },
        {
          path: '/services',
          views: 312,
          uniqueVisitors: 245,
          avgTime: 75,
          bounceRate: 45.3,
        },
        {
          path: '/courses',
          views: 287,
          uniqueVisitors: 198,
          avgTime: 210,
          bounceRate: 25.7,
        },
        {
          path: '/shop',
          views: 213,
          uniqueVisitors: 167,
          avgTime: 95,
          bounceRate: 38.9,
        },
      ])

      setUserFlows([
        { from: '/', to: '/blog', users: 342 },
        { from: '/', to: '/projects', users: 289 },
        { from: '/blog', to: '/projects', users: 156 },
        { from: '/projects', to: '/services', users: 98 },
        { from: '/services', to: '/shop', users: 67 },
      ])

      setLoading(false)
    } catch (error) {
      console.error('Error fetching user activity:', error)
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Desktop':
        return <Monitor className='w-4 h-4' />
      case 'Mobile':
        return <Smartphone className='w-4 h-4' />
      default:
        return <Globe className='w-4 h-4' />
    }
  }

  if (loading) {
    return (
      <div className='p-8'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/3'></div>
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
    <div className='p-8 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h1 className='text-4xl font-bold text-gray-900 mb-2'>
              User Activity Tracking
            </h1>
            <p className='text-gray-600'>
              Sessions, page views, user flows, and behavior analysis
            </p>
          </div>
          <div className='flex gap-3'>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className='px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='24h'>Last 24 Hours</option>
              <option value='7d'>Last 7 Days</option>
              <option value='30d'>Last 30 Days</option>
            </select>
            <button
              onClick={fetchUserActivity}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition'
            >
              <RefreshCw className='w-4 h-4' />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Activity Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition'>
          <div className='flex items-center justify-between mb-3'>
            <div className='p-3 bg-green-100 rounded-lg'>
              <Users className='w-6 h-6 text-green-600' />
            </div>
            <span className='text-2xl font-bold text-gray-900'>
              {metrics?.activeUsers}
            </span>
          </div>
          <div className='text-sm font-medium text-gray-600'>Active Users</div>
          <div className='text-xs text-green-600 mt-1'>+8% from yesterday</div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition'>
          <div className='flex items-center justify-between mb-3'>
            <div className='p-3 bg-blue-100 rounded-lg'>
              <Eye className='w-6 h-6 text-blue-600' />
            </div>
            <span className='text-2xl font-bold text-gray-900'>
              {metrics?.pageViews.toLocaleString()}
            </span>
          </div>
          <div className='text-sm font-medium text-gray-600'>Page Views</div>
          <div className='text-xs text-green-600 mt-1'>
            +15% from last period
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition'>
          <div className='flex items-center justify-between mb-3'>
            <div className='p-3 bg-purple-100 rounded-lg'>
              <Clock className='w-6 h-6 text-purple-600' />
            </div>
            <span className='text-2xl font-bold text-gray-900'>
              {formatDuration(metrics?.avgSessionDuration || 0)}
            </span>
          </div>
          <div className='text-sm font-medium text-gray-600'>
            Avg Session Duration
          </div>
          <div className='text-xs text-green-600 mt-1'>
            +12s from last period
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition'>
          <div className='flex items-center justify-between mb-3'>
            <div className='p-3 bg-orange-100 rounded-lg'>
              <TrendingUp className='w-6 h-6 text-orange-600' />
            </div>
            <span className='text-2xl font-bold text-gray-900'>
              {metrics?.bounceRate}%
            </span>
          </div>
          <div className='text-sm font-medium text-gray-600'>Bounce Rate</div>
          <div className='text-xs text-green-600 mt-1'>
            -2.3% from last period
          </div>
        </div>
      </div>

      {/* User Breakdown */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
          <h3 className='text-lg font-bold text-gray-900 mb-4'>
            User Breakdown
          </h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-4 bg-blue-50 rounded-lg'>
              <div>
                <div className='font-medium text-gray-900'>New Users</div>
                <div className='text-sm text-gray-600'>First-time visitors</div>
              </div>
              <div className='text-2xl font-bold text-blue-900'>
                {metrics?.newUsers}
              </div>
            </div>
            <div className='flex items-center justify-between p-4 bg-green-50 rounded-lg'>
              <div>
                <div className='font-medium text-gray-900'>Returning Users</div>
                <div className='text-sm text-gray-600'>Previous visitors</div>
              </div>
              <div className='text-2xl font-bold text-green-900'>
                {metrics?.returningUsers}
              </div>
            </div>
            <div className='flex items-center justify-between p-4 bg-purple-50 rounded-lg'>
              <div>
                <div className='font-medium text-gray-900'>Total Sessions</div>
                <div className='text-sm text-gray-600'>All user sessions</div>
              </div>
              <div className='text-2xl font-bold text-purple-900'>
                {metrics?.totalSessions.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
          <h3 className='text-lg font-bold text-gray-900 mb-4'>
            User Distribution
          </h3>
          <div className='space-y-4'>
            <div>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm font-medium text-gray-600'>
                  New Users
                </span>
                <span className='text-sm font-bold text-gray-900'>
                  {(
                    ((metrics?.newUsers || 0) /
                      ((metrics?.newUsers || 0) +
                        (metrics?.returningUsers || 0))) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-3'>
                <div
                  className='bg-blue-500 h-3 rounded-full transition-all'
                  style={{
                    width: `${((metrics?.newUsers || 0) / ((metrics?.newUsers || 0) + (metrics?.returningUsers || 0))) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm font-medium text-gray-600'>
                  Returning Users
                </span>
                <span className='text-sm font-bold text-gray-900'>
                  {(
                    ((metrics?.returningUsers || 0) /
                      ((metrics?.newUsers || 0) +
                        (metrics?.returningUsers || 0))) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-3'>
                <div
                  className='bg-green-500 h-3 rounded-full transition-all'
                  style={{
                    width: `${((metrics?.returningUsers || 0) / ((metrics?.newUsers || 0) + (metrics?.returningUsers || 0))) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 mb-8'>
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-900'>Active Sessions</h2>
          <p className='text-sm text-gray-600 mt-1'>
            Real-time user sessions and activity
          </p>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  User
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Device
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Location
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Duration
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Pages
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Referrer
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {sessions.map((session) => (
                <tr key={session.id} className='hover:bg-gray-50 transition'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center gap-2'>
                      <div className='w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold'>
                        {session.userId.slice(5, 7).toUpperCase()}
                      </div>
                      <div>
                        <div className='text-sm font-medium text-gray-900'>
                          {session.userId}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {session.browser}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center gap-2 text-sm text-gray-900'>
                      {getDeviceIcon(session.device)}
                      {session.device}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center gap-2 text-sm text-gray-900'>
                      <MapPin className='w-4 h-4 text-gray-400' />
                      {session.location}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='text-sm text-gray-900'>
                      {formatDuration(session.duration)}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='text-sm text-gray-900'>
                      {session.pages} pages
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded'>
                      {session.referrer}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Pages */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 mb-8'>
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-900'>Top Pages</h2>
          <p className='text-sm text-gray-600 mt-1'>
            Most visited pages and engagement metrics
          </p>
        </div>
        <div className='p-6 space-y-4'>
          {pageViews.map((page, index) => (
            <div key={page.path} className='p-4 bg-gray-50 rounded-lg'>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold'>
                    {index + 1}
                  </div>
                  <div>
                    <div className='font-mono text-sm font-semibold text-gray-900'>
                      {page.path}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {page.views.toLocaleString()} views •{' '}
                      {page.uniqueVisitors.toLocaleString()} unique visitors
                    </div>
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-3 gap-4'>
                <div className='text-center p-3 bg-white rounded'>
                  <div className='text-lg font-bold text-gray-900'>
                    {page.avgTime}s
                  </div>
                  <div className='text-xs text-gray-500'>Avg Time</div>
                </div>
                <div className='text-center p-3 bg-white rounded'>
                  <div className='text-lg font-bold text-gray-900'>
                    {page.bounceRate}%
                  </div>
                  <div className='text-xs text-gray-500'>Bounce Rate</div>
                </div>
                <div className='text-center p-3 bg-white rounded'>
                  <div className='text-lg font-bold text-gray-900'>
                    {((page.uniqueVisitors / page.views) * 100).toFixed(1)}%
                  </div>
                  <div className='text-xs text-gray-500'>Unique Rate</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Flows */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-900'>User Flows</h2>
          <p className='text-sm text-gray-600 mt-1'>
            Common navigation paths through your site
          </p>
        </div>
        <div className='p-6 space-y-3'>
          {userFlows.map((flow, index) => (
            <div
              key={index}
              className='flex items-center justify-between p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg'
            >
              <div className='flex items-center gap-4'>
                <MousePointer className='w-5 h-5 text-blue-600' />
                <div className='flex items-center gap-3'>
                  <span className='font-mono text-sm font-medium text-gray-900'>
                    {flow.from}
                  </span>
                  <span className='text-gray-400'>→</span>
                  <span className='font-mono text-sm font-medium text-gray-900'>
                    {flow.to}
                  </span>
                </div>
              </div>
              <div className='text-right'>
                <div className='text-xl font-bold text-gray-900'>
                  {flow.users.toLocaleString()}
                </div>
                <div className='text-xs text-gray-500'>users</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
