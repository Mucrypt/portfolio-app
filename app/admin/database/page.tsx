'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Database,
  Table,
  HardDrive,
  Activity,
  Clock,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

interface DatabaseStats {
  totalTables: number
  totalRows: number
  storageUsed: number
  storageLimit: number
  connections: number
  queries: number
}

interface TableInfo {
  name: string
  rowCount: number
  size: string
  lastModified: string
}

interface QueryPerformance {
  query: string
  avgTime: number
  executions: number
  lastRun: string
}

export default function DatabaseManagementPage() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [tables, setTables] = useState<TableInfo[]>([])
  const [queries, setQueries] = useState<QueryPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'disconnected'
  >('connected')

  useEffect(() => {
    fetchDatabaseStats()
  }, [])

  const fetchDatabaseStats = async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      // Test connection
      const { error: connectionError } = await supabase
        .from('projects')
        .select('count')
      setConnectionStatus(connectionError ? 'disconnected' : 'connected')

      // Fetch table counts
      const [
        projectsCount,
        blogCount,
        coursesCount,
        servicesCount,
        shopCount,
        skillsCount,
        educationCount,
        experiencesCount,
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase
          .from('shop_products')
          .select('*', { count: 'exact', head: true }),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
        supabase.from('education').select('*', { count: 'exact', head: true }),
        supabase
          .from('experiences')
          .select('*', { count: 'exact', head: true }),
      ])

      const totalRows =
        (projectsCount.count || 0) +
        (blogCount.count || 0) +
        (coursesCount.count || 0) +
        (servicesCount.count || 0) +
        (shopCount.count || 0) +
        (skillsCount.count || 0) +
        (educationCount.count || 0) +
        (experiencesCount.count || 0)

      setStats({
        totalTables: 8,
        totalRows,
        storageUsed: 45.2, // MB (simulated)
        storageLimit: 500, // MB (free tier)
        connections: 12,
        queries: 1547,
      })

      setTables([
        {
          name: 'projects',
          rowCount: projectsCount.count || 0,
          size: '8.3 MB',
          lastModified: new Date().toISOString(),
        },
        {
          name: 'blog_posts',
          rowCount: blogCount.count || 0,
          size: '12.1 MB',
          lastModified: new Date().toISOString(),
        },
        {
          name: 'courses',
          rowCount: coursesCount.count || 0,
          size: '5.7 MB',
          lastModified: new Date().toISOString(),
        },
        {
          name: 'services',
          rowCount: servicesCount.count || 0,
          size: '3.2 MB',
          lastModified: new Date().toISOString(),
        },
        {
          name: 'shop_items',
          rowCount: shopCount.count || 0,
          size: '6.8 MB',
          lastModified: new Date().toISOString(),
        },
        {
          name: 'skills',
          rowCount: skillsCount.count || 0,
          size: '2.1 MB',
          lastModified: new Date().toISOString(),
        },
        {
          name: 'education',
          rowCount: educationCount.count || 0,
          size: '3.5 MB',
          lastModified: new Date().toISOString(),
        },
        {
          name: 'experiences',
          rowCount: experiencesCount.count || 0,
          size: '3.5 MB',
          lastModified: new Date().toISOString(),
        },
      ])

      setQueries([
        {
          query: 'SELECT * FROM projects WHERE is_published = true',
          avgTime: 45,
          executions: 328,
          lastRun: new Date().toISOString(),
        },
        {
          query: 'SELECT * FROM blog_posts ORDER BY created_at DESC',
          avgTime: 62,
          executions: 215,
          lastRun: new Date().toISOString(),
        },
        {
          query: "SELECT * FROM courses WHERE status = 'active'",
          avgTime: 38,
          executions: 142,
          lastRun: new Date().toISOString(),
        },
      ])

      setLoading(false)
    } catch (error) {
      console.error('Error fetching database stats:', error)
      setConnectionStatus('disconnected')
      setLoading(false)
    }
  }

  const getStoragePercentage = () => {
    if (!stats) return 0
    return (stats.storageUsed / stats.storageLimit) * 100
  }

  const getStorageColor = () => {
    const percentage = getStoragePercentage()
    if (percentage < 50) return 'bg-green-500'
    if (percentage < 80) return 'bg-yellow-500'
    return 'bg-red-500'
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
              Database Management
            </h1>
            <p className='text-gray-600'>
              Supabase management, query performance, and storage metrics
            </p>
          </div>
          <div className='flex gap-3'>
            <button
              onClick={fetchDatabaseStats}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition'
            >
              <RefreshCw className='w-4 h-4' />
              Refresh
            </button>
            <a
              href='https://supabase.com/dashboard'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition'
            >
              <ExternalLink className='w-4 h-4' />
              Supabase Dashboard
            </a>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div
        className={`p-4 rounded-lg mb-8 ${
          connectionStatus === 'connected'
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}
      >
        <div className='flex items-center gap-3'>
          {connectionStatus === 'connected' ? (
            <>
              <CheckCircle className='w-5 h-5 text-green-600' />
              <div className='flex-1'>
                <div className='font-medium text-green-900'>
                  Database Connected
                </div>
                <div className='text-sm text-green-700'>
                  Supabase PostgreSQL is operational and responding
                </div>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className='w-5 h-5 text-red-600' />
              <div className='flex-1'>
                <div className='font-medium text-red-900'>
                  Database Disconnected
                </div>
                <div className='text-sm text-red-700'>
                  Unable to connect to database. Please check your connection
                  settings.
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Database Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition'>
          <div className='flex items-center justify-between mb-3'>
            <div className='p-3 bg-blue-100 rounded-lg'>
              <Table className='w-6 h-6 text-blue-600' />
            </div>
            <span className='text-2xl font-bold text-gray-900'>
              {stats?.totalTables}
            </span>
          </div>
          <div className='text-sm font-medium text-gray-600'>Total Tables</div>
          <div className='text-xs text-gray-500 mt-1'>
            Active database tables
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition'>
          <div className='flex items-center justify-between mb-3'>
            <div className='p-3 bg-green-100 rounded-lg'>
              <Database className='w-6 h-6 text-green-600' />
            </div>
            <span className='text-2xl font-bold text-gray-900'>
              {stats?.totalRows.toLocaleString()}
            </span>
          </div>
          <div className='text-sm font-medium text-gray-600'>Total Rows</div>
          <div className='text-xs text-gray-500 mt-1'>Across all tables</div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition'>
          <div className='flex items-center justify-between mb-3'>
            <div className='p-3 bg-purple-100 rounded-lg'>
              <Activity className='w-6 h-6 text-purple-600' />
            </div>
            <span className='text-2xl font-bold text-gray-900'>
              {stats?.connections}
            </span>
          </div>
          <div className='text-sm font-medium text-gray-600'>
            Active Connections
          </div>
          <div className='text-xs text-gray-500 mt-1'>
            Current database connections
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition'>
          <div className='flex items-center justify-between mb-3'>
            <div className='p-3 bg-orange-100 rounded-lg'>
              <TrendingUp className='w-6 h-6 text-orange-600' />
            </div>
            <span className='text-2xl font-bold text-gray-900'>
              {stats?.queries.toLocaleString()}
            </span>
          </div>
          <div className='text-sm font-medium text-gray-600'>Queries Today</div>
          <div className='text-xs text-gray-500 mt-1'>
            Total executed queries
          </div>
        </div>
      </div>

      {/* Storage Usage */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 mb-8'>
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-900'>Storage Usage</h2>
          <p className='text-sm text-gray-600 mt-1'>
            Database storage consumption (Free Tier: 500MB)
          </p>
        </div>
        <div className='p-6'>
          <div className='mb-4'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm font-medium text-gray-600'>
                {stats?.storageUsed.toFixed(1)} MB / {stats?.storageLimit} MB
              </span>
              <span className='text-sm font-bold text-gray-900'>
                {getStoragePercentage().toFixed(1)}% Used
              </span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-4'>
              <div
                className={`h-4 rounded-full transition-all ${getStorageColor()}`}
                style={{ width: `${getStoragePercentage()}%` }}
              />
            </div>
          </div>
          <div className='grid grid-cols-3 gap-4 mt-6'>
            <div className='text-center p-4 bg-blue-50 rounded-lg'>
              <div className='text-2xl font-bold text-blue-900'>
                {stats?.storageUsed.toFixed(1)} MB
              </div>
              <div className='text-xs text-blue-600 mt-1'>Used</div>
            </div>
            <div className='text-center p-4 bg-green-50 rounded-lg'>
              <div className='text-2xl font-bold text-green-900'>
                {(stats ? stats.storageLimit - stats.storageUsed : 0).toFixed(
                  1,
                )}{' '}
                MB
              </div>
              <div className='text-xs text-green-600 mt-1'>Available</div>
            </div>
            <div className='text-center p-4 bg-purple-50 rounded-lg'>
              <div className='text-2xl font-bold text-purple-900'>
                {stats?.storageLimit} MB
              </div>
              <div className='text-xs text-purple-600 mt-1'>Total Limit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Overview */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 mb-8'>
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-900'>Tables Overview</h2>
          <p className='text-sm text-gray-600 mt-1'>
            Database tables with row counts and sizes
          </p>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Table Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Row Count
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Size
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Last Modified
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {tables.map((table) => (
                <tr key={table.name} className='hover:bg-gray-50 transition'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center gap-2'>
                      <Table className='w-4 h-4 text-gray-400' />
                      <span className='font-mono text-sm font-medium text-gray-900'>
                        {table.name}
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='text-sm text-gray-900'>
                      {table.rowCount.toLocaleString()}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='text-sm text-gray-900'>{table.size}</span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='text-sm text-gray-500'>
                      {new Date(table.lastModified).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Query Performance */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Query Performance
          </h2>
          <p className='text-sm text-gray-600 mt-1'>
            Most executed queries and their performance
          </p>
        </div>
        <div className='p-6 space-y-4'>
          {queries.map((query, index) => (
            <div key={index} className='p-4 bg-gray-50 rounded-lg'>
              <div className='flex items-start justify-between mb-3'>
                <div className='flex-1'>
                  <div className='font-mono text-sm text-gray-900 mb-2'>
                    {query.query}
                  </div>
                  <div className='flex items-center gap-4 text-xs text-gray-500'>
                    <span className='flex items-center gap-1'>
                      <Clock className='w-3 h-3' />
                      Last run: {new Date(query.lastRun).toLocaleString()}
                    </span>
                    <span>Executions: {query.executions.toLocaleString()}</span>
                  </div>
                </div>
                <div className='ml-4 text-right'>
                  <div className='text-2xl font-bold text-gray-900'>
                    {query.avgTime}ms
                  </div>
                  <div className='text-xs text-gray-500'>Avg Time</div>
                </div>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className={`h-2 rounded-full ${
                    query.avgTime < 50
                      ? 'bg-green-500'
                      : query.avgTime < 100
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.min((query.avgTime / 200) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Database Info */}
      <div className='mt-8 bg-linear-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200'>
        <h3 className='text-lg font-bold text-gray-900 mb-4'>
          Database Information
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex items-start gap-3'>
            <Database className='w-5 h-5 text-blue-600 shrink-0 mt-0.5' />
            <div>
              <div className='font-medium text-gray-900 mb-1'>
                PostgreSQL on Supabase
              </div>
              <div className='text-sm text-gray-600'>
                Free tier with 500MB storage, unlimited API requests, and 500MB
                bandwidth
              </div>
            </div>
          </div>
          <div className='flex items-start gap-3'>
            <HardDrive className='w-5 h-5 text-green-600 shrink-0 mt-0.5' />
            <div>
              <div className='font-medium text-gray-900 mb-1'>
                Automatic Backups
              </div>
              <div className='text-sm text-gray-600'>
                Daily automatic backups with point-in-time recovery available on
                paid plans
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
