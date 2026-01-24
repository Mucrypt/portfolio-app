'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Globe, TrendingUp, Users, MapPin } from 'lucide-react'

interface CountryStats {
  country: string
  country_code: string
  visits: number
  unique_users: number
  percentage: number
}

export default function CountryStatsWidget() {
  const [countryStats, setCountryStats] = useState<CountryStats[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d')

  useEffect(() => {
    fetchCountryStats()
  }, [timeRange])

  async function fetchCountryStats() {
    setLoading(true)
    const supabase = createClient()

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    if (timeRange === '24h') {
      startDate.setHours(now.getHours() - 24)
    } else if (timeRange === '7d') {
      startDate.setDate(now.getDate() - 7)
    } else {
      startDate.setDate(now.getDate() - 30)
    }

    // Fetch activity logs with country data
    const { data: activities } = await supabase
      .from('user_activity_log')
      .select('activity_data, user_id, created_at')
      .gte('created_at', startDate.toISOString())

    // Process country data
    const countryMap = new Map<string, { visits: number; users: Set<string> }>()
    let totalVisits = 0

    activities?.forEach((activity) => {
      const activityData = activity.activity_data as {
        country?: string
        country_code?: string
      } | null
      const country = activityData?.country || 'Unknown'
      const countryCode = activityData?.country_code || 'XX'
      const userId = activity.user_id || 'anonymous'

      if (!countryMap.has(country)) {
        countryMap.set(country, { visits: 0, users: new Set() })
      }

      const stats = countryMap.get(country)!
      stats.visits++
      stats.users.add(userId)
      totalVisits++
    })

    // Convert to array and calculate percentages
    const stats: CountryStats[] = Array.from(countryMap.entries())
      .map(([country, data]) => ({
        country,
        country_code:
          (
            activities?.find(
              (a) =>
                (
                  a.activity_data as {
                    country?: string
                    country_code?: string
                  } | null
                )?.country === country,
            )?.activity_data as {
              country?: string
              country_code?: string
            } | null
          )?.country_code || 'XX',
        visits: data.visits,
        unique_users: data.users.size,
        percentage: totalVisits > 0 ? (data.visits / totalVisits) * 100 : 0,
      }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10) // Top 10 countries

    setCountryStats(stats)
    setLoading(false)
  }

  const getCountryFlag = (countryCode: string) => {
    if (countryCode === 'XX' || !countryCode) return '🌍'
    // Convert country code to flag emoji
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-blue-100 dark:bg-blue-900 rounded-lg'>
            <Globe className='w-6 h-6 text-blue-600 dark:text-blue-400' />
          </div>
          <div>
            <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
              Visitors by Country
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Geographic distribution of your users
            </p>
          </div>
        </div>

        {/* Time Range Selector */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as '24h' | '7d' | '30d')}
          className='px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        >
          <option value='24h'>Last 24h</option>
          <option value='7d'>Last 7 days</option>
          <option value='30d'>Last 30 days</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        </div>
      )}

      {/* Country List */}
      {!loading && countryStats.length > 0 && (
        <div className='space-y-3'>
          {countryStats.map((stat, index) => (
            <div
              key={stat.country}
              className='flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
            >
              shrink-0
              {/* Rank */}
              <div className='shrink-0 w-6 text-center'>
                <span className='text-sm font-bold text-gray-400'>
                  {index + 1}
                </span>
              </div>
              {/* Flag */}
              <div className='shrink-0 text-2xl'>
                {getCountryFlag(stat.country_code)}
              </div>
              {/* Country Name */}
              <div className='flex-1 min-w-0'>
                <div className='font-medium text-gray-900 dark:text-white truncate'>
                  {stat.country}
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  {stat.unique_users} unique{' '}
                  {stat.unique_users === 1 ? 'user' : 'users'}
                </div>
              </div>
              {/* Stats */}
              <div className='shrink-0 text-right'>
                <div className='font-bold text-gray-900 dark:text-white'>
                  {stat.visits}
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  {stat.percentage.toFixed(1)}%
                </div>
              </div>
              {/* Progress Bar */}
              <div className='shrink-0 w-16'>
                <div className='h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-blue-600 dark:bg-blue-500 rounded-full'
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && countryStats.length === 0 && (
        <div className='text-center py-12'>
          <MapPin className='w-12 h-12 text-gray-400 mx-auto mb-3' />
          <p className='text-gray-500 dark:text-gray-400'>
            No location data available yet
          </p>
          <p className='text-sm text-gray-400 dark:text-gray-500 mt-1'>
            Data will appear as users visit your site
          </p>
        </div>
      )}

      {/* Summary */}
      {!loading && countryStats.length > 0 && (
        <div className='mt-6 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-gray-500 dark:text-gray-400'>
              Total Countries
            </span>
            <span className='font-bold text-gray-900 dark:text-white'>
              {countryStats.length}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
