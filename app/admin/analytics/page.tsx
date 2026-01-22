"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getOverviewMetrics,
  getTopPages,
  getTopEvents,
  getRealtimeData,
  getTrafficSources,
  getDeviceBreakdown,
  getConversions,
  type GAMetrics,
  type GAPageData,
  type GAEventData,
  type GARealtimeData,
} from "@/lib/analytics/ga4-data";

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<GAMetrics | null>(null);
  const [topPages, setTopPages] = useState<GAPageData[]>([]);
  const [topEvents, setTopEvents] = useState<GAEventData[]>([]);
  const [realtimeData, setRealtimeData] = useState<GARealtimeData | null>(null);
  const [trafficSources, setTrafficSources] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [conversions, setConversions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30); // days
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all analytics data in parallel
      const [
        metricsData,
        pagesData,
        eventsData,
        realtimeInfo,
        sourcesData,
        devicesData,
        conversionsData,
      ] = await Promise.all([
        getOverviewMetrics(dateRange),
        getTopPages(dateRange, 10),
        getTopEvents(dateRange, 10),
        getRealtimeData(),
        getTrafficSources(dateRange),
        getDeviceBreakdown(dateRange),
        getConversions(dateRange),
      ]);

      setMetrics(metricsData);
      setTopPages(pagesData);
      setTopEvents(eventsData);
      setRealtimeData(realtimeInfo);
      setTrafficSources(sourcesData);
      setDevices(devicesData);
      setConversions(conversionsData);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
    
    // Auto-refresh realtime data every 30 seconds
    const interval = setInterval(() => {
      getRealtimeData().then(setRealtimeData);
    }, 30000);
    
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  if (loading && !metrics) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="p-8 max-w-full">
      {/* Header with Date Range Selector */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Google Analytics 4
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive user behavior and engagement analytics
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDateRange(7)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              dateRange === 7
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setDateRange(30)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              dateRange === 30
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setDateRange(90)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              dateRange === 90
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            90 Days
          </button>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Real-time Stats Bar */}
      {realtimeData && (
        <div className="bg-linear-to-r from-green-500 to-emerald-500 p-6 rounded-lg shadow-lg mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
                </span>
              </div>
              <div>
                <div className="text-sm opacity-90">Active Users Right Now</div>
                <div className="text-3xl font-bold">{realtimeData.activeUsers}</div>
              </div>
            </div>
            <div className="flex gap-6">
              <div>
                <div className="text-sm opacity-90">Desktop</div>
                <div className="text-2xl font-bold">{realtimeData.activeDevices.desktop}</div>
              </div>
              <div>
                <div className="text-sm opacity-90">Mobile</div>
                <div className="text-2xl font-bold">{realtimeData.activeDevices.mobile}</div>
              </div>
              <div>
                <div className="text-sm opacity-90">Tablet</div>
                <div className="text-2xl font-bold">{realtimeData.activeDevices.tablet}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {metrics.totalUsers.toLocaleString()}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              {metrics.activeUsers} active users
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sessions</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {metrics.sessions.toLocaleString()}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-2">
              {(metrics.sessions / metrics.totalUsers).toFixed(1)} per user
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Session Duration</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatDuration(metrics.avgSessionDuration)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              User engagement time
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bounce Rate</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {metrics.bounceRate.toFixed(1)}%
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400 mt-2">
              {metrics.bounceRate < 40 ? "Excellent" : metrics.bounceRate < 55 ? "Good" : "Needs improvement"}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Pages */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Pages</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Most visited pages</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Avg Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {topPages.map((page, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      {page.path}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {page.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {page.uniqueUsers.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDuration(page.avgTimeOnPage)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Events */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Events</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Most triggered events</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Event Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Users
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {topEvents.map((event, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      {event.eventName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {event.count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {event.uniqueUsers.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Traffic Sources & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Traffic Sources */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Traffic Sources</h2>
          <div className="space-y-4">
            {trafficSources.slice(0, 5).map((source, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {source.source} / {source.medium}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {source.users.toLocaleString()} users
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {source.sessions.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Device Breakdown</h2>
          <div className="space-y-4">
            {devices.map((device, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {device.device}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {device.users.toLocaleString()} users · {device.bounceRate.toFixed(1)}% bounce
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {device.sessions.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversions */}
      {conversions.length > 0 && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Conversions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {conversions.map((conversion, idx) => (
              <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{conversion.name}</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {conversion.conversions}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  {conversion.conversionRate.toFixed(2)}% rate · ${conversion.value.toFixed(2)} value
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
