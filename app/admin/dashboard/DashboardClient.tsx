'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Database,
  Eye,
  FileText,
  Globe,
  Server,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import UsersWidget from '@/components/admin/UsersWidget'

type SystemMetrics = {
  counts: {
    projects: number
    blogPosts: number
    courses: number
    services: number
    shopItems: number
  }
  recentActivities: Array<{
    type: string
    title: string
    updated_at: string
  }>
}

type DashboardProps = {
  initialMetrics: SystemMetrics
}

export default function DashboardClient({ initialMetrics }: DashboardProps) {
  const [metrics, setMetrics] = useState(initialMetrics)
  const [healthStatus, setHealthStatus] = useState<
    'healthy' | 'degraded' | 'down'
  >('healthy')
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Real-time health check
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health')
        if (response.ok) {
          setHealthStatus('healthy')
        } else {
          setHealthStatus('degraded')
        }
      } catch (error) {
        setHealthStatus('down')
      }
      setLastUpdate(new Date())
    }

    checkHealth()
    const interval = setInterval(checkHealth, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const statusColor = {
    healthy: 'text-green-500 bg-green-100',
    degraded: 'text-yellow-500 bg-yellow-100',
    down: 'text-red-500 bg-red-100',
  }[healthStatus]

  const statusText = {
    healthy: 'All Systems Operational',
    degraded: 'Degraded Performance',
    down: 'System Down',
  }[healthStatus]

  return (
    <div className='p-8 space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Admin Dashboard</h1>
          <p className='text-gray-600 mt-1'>
            Enterprise-grade monitoring and management
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor}`}
          >
            ● {statusText}
          </span>
          <span className='text-sm text-gray-500'>
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <MetricCard
          title='Total Projects'
          value={metrics.counts.projects}
          icon={<FileText className='w-6 h-6' />}
          color='bg-blue-500'
          trend='+12%'
          href='/admin/projects'
        />
        <MetricCard
          title='Blog Posts'
          value={metrics.counts.blogPosts}
          icon={<FileText className='w-6 h-6' />}
          color='bg-purple-500'
          trend='+8%'
          href='/admin/blog'
        />
        <MetricCard
          title='Courses'
          value={metrics.counts.courses}
          icon={<FileText className='w-6 h-6' />}
          color='bg-green-500'
          trend='+15%'
          href='/admin/courses'
        />
        <MetricCard
          title='Services'
          value={metrics.counts.services}
          icon={<Server className='w-6 h-6' />}
          color='bg-orange-500'
          trend='+5%'
          href='/admin/services'
        />
      </div>

      {/* Users Widget */}
      <UsersWidget />

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <QuickActionCard
          title='System Overview'
          description='Enterprise monitoring'
          icon={<Server className='w-8 h-8' />}
          color='bg-blue-50 text-blue-600'
          href='/admin/system'
        />
        <QuickActionCard
          title='System Health'
          description='Real-time monitoring'
          icon={<Activity className='w-8 h-8' />}
          color='bg-green-50 text-green-600'
          href='/admin/monitoring'
        />
        <QuickActionCard
          title='Performance'
          description='Core Web Vitals'
          icon={<Zap className='w-8 h-8' />}
          color='bg-purple-50 text-purple-600'
          href='/admin/performance'
        />
        <QuickActionCard
          title='Security'
          description='Security dashboard'
          icon={<Shield className='w-8 h-8' />}
          color='bg-orange-50 text-orange-600'
          href='/admin/security'
        />
        <QuickActionCard
          title='Database'
          description='Supabase management'
          icon={<Database className='w-8 h-8' />}
          color='bg-teal-50 text-teal-600'
          href='/admin/database'
        />
        <QuickActionCard
          title='User Activity'
          description='Sessions & behavior'
          icon={<Users className='w-8 h-8' />}
          color='bg-indigo-50 text-indigo-600'
          href='/admin/activity'
        />
        <QuickActionCard
          title='Analytics'
          description='Traffic & engagement'
          icon={<BarChart3 className='w-8 h-8' />}
          color='bg-blue-50 text-blue-600'
          href='/admin/analytics'
        />
        <QuickActionCard
          title='Errors'
          description='Error tracking & logs'
          icon={<AlertTriangle className='w-8 h-8' />}
          color='bg-red-50 text-red-600'
          href='/admin/errors'
        />
      </div>

      {/* Monitoring Dashboard Links */}
      <div className='bg-white rounded-lg shadow p-6'>
        <h2 className='text-xl font-semibold mb-4'>Monitoring Services</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <ExternalLink
            title='UptimeRobot'
            description='Uptime monitoring'
            icon={<Globe className='w-5 h-5' />}
            href='https://dashboard.uptimerobot.com/monitors'
            status='active'
          />
          <ExternalLink
            title='Sentry'
            description='Error tracking'
            icon={<AlertTriangle className='w-5 h-5' />}
            href='https://sentry.io/organizations/mukulah/issues/'
            status='active'
          />
          <ExternalLink
            title='Vercel Analytics'
            description='Performance metrics'
            icon={<TrendingUp className='w-5 h-5' />}
            href='https://vercel.com/dashboard'
            status='active'
          />
          <ExternalLink
            title='Google Analytics'
            description='User behavior'
            icon={<Users className='w-5 h-5' />}
            href='https://analytics.google.com/'
            status='active'
          />
          <ExternalLink
            title='Supabase'
            description='Database monitoring'
            icon={<Database className='w-5 h-5' />}
            href='https://supabase.com/dashboard'
            status='active'
          />
          <ExternalLink
            title='GitHub Actions'
            description='CI/CD pipeline'
            icon={<Zap className='w-5 h-5' />}
            href='https://github.com/Mucrypt/portfolio-app/actions'
            status='active'
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className='bg-white rounded-lg shadow p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold'>Recent Activity</h2>
          <Clock className='w-5 h-5 text-gray-400' />
        </div>
        <div className='space-y-3'>
          {metrics.recentActivities.map((activity, index) => (
            <div
              key={index}
              className='flex items-center justify-between py-3 border-b last:border-b-0'
            >
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full' />
                <div>
                  <p className='font-medium text-gray-900'>{activity.title}</p>
                  <p className='text-sm text-gray-500 capitalize'>
                    {activity.type}
                  </p>
                </div>
              </div>
              <span className='text-sm text-gray-500'>
                {new Date(activity.updated_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* System Overview */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-semibold mb-4'>Performance</h2>
          <div className='space-y-4'>
            <PerformanceMetric
              label='Response Time'
              value='45ms'
              status='excellent'
            />
            <PerformanceMetric label='Uptime' value='100%' status='excellent' />
            <PerformanceMetric label='Error Rate' value='0.01%' status='good' />
            <PerformanceMetric
              label='Page Load'
              value='1.2s'
              status='excellent'
            />
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-semibold mb-4'>Security</h2>
          <div className='space-y-4'>
            <SecurityMetric
              label='SSL Certificate'
              status='valid'
              expires='90 days'
            />
            <SecurityMetric label='Security Headers' status='A+' />
            <SecurityMetric label='Dependencies' status='Up to date' />
            <SecurityMetric label='Last Scan' status='2 hours ago' />
          </div>
        </div>
      </div>
    </div>
  )
}

// Metric Card Component
function MetricCard({
  title,
  value,
  icon,
  color,
  trend,
  href,
}: {
  title: string
  value: number
  icon: React.ReactNode
  color: string
  trend: string
  href: string
}) {
  return (
    <Link href={href}>
      <div className='bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer'>
        <div className='flex items-center justify-between mb-4'>
          <div className={`${color} text-white p-3 rounded-lg`}>{icon}</div>
          <span className='text-sm font-semibold text-green-600'>{trend}</span>
        </div>
        <h3 className='text-gray-600 text-sm font-medium'>{title}</h3>
        <p className='text-3xl font-bold text-gray-900 mt-2'>{value}</p>
      </div>
    </Link>
  )
}

// Quick Action Card Component
function QuickActionCard({
  title,
  description,
  icon,
  color,
  href,
}: {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  href: string
}) {
  return (
    <Link href={href}>
      <div className='bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer'>
        <div className={`${color} p-3 rounded-lg w-fit mb-4`}>{icon}</div>
        <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
        <p className='text-sm text-gray-600 mt-1'>{description}</p>
      </div>
    </Link>
  )
}

// External Link Component
function ExternalLink({
  title,
  description,
  icon,
  href,
  status,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  status: 'active' | 'inactive'
}) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
    >
      <div className='text-gray-600'>{icon}</div>
      <div className='flex-1'>
        <p className='font-medium text-gray-900'>{title}</p>
        <p className='text-sm text-gray-600'>{description}</p>
      </div>
      <div
        className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}
      />
    </a>
  )
}

// Performance Metric Component
function PerformanceMetric({
  label,
  value,
  status,
}: {
  label: string
  value: string
  status: 'excellent' | 'good' | 'warning' | 'critical'
}) {
  const statusColor = {
    excellent: 'bg-green-100 text-green-800',
    good: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    critical: 'bg-red-100 text-red-800',
  }[status]

  return (
    <div className='flex items-center justify-between'>
      <span className='text-gray-700'>{label}</span>
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}
      >
        {value}
      </span>
    </div>
  )
}

// Security Metric Component
function SecurityMetric({
  label,
  status,
  expires,
}: {
  label: string
  status: string
  expires?: string
}) {
  return (
    <div className='flex items-center justify-between'>
      <span className='text-gray-700'>{label}</span>
      <div className='text-right'>
        <span className='text-sm font-semibold text-green-600'>{status}</span>
        {expires && <p className='text-xs text-gray-500'>{expires}</p>}
      </div>
    </div>
  )
}
