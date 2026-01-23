// Google Analytics 4 Data API Integration
// Fetches real-time and historical analytics data for admin dashboard

export interface GAMetrics {
  activeUsers: number;
  totalUsers: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
  pageViews: number;
  eventsCount: number;
}

export interface GAPageData {
  path: string;
  views: number;
  uniqueUsers: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

export interface GAEventData {
  eventName: string;
  count: number;
  uniqueUsers: number;
}

export interface GAUserFlow {
  landingPage: string;
  exitPage: string;
  users: number;
}

export interface GAConversion {
  name: string;
  conversions: number;
  conversionRate: number;
  value: number;
}

export interface GARealtimeData {
  activeUsers: number;
  activePagesTop5: Array<{ page: string; users: number }>;
  activeLocations: Array<{ country: string; users: number }>;
  activeDevices: { desktop: number; mobile: number; tablet: number };
}

// Helper function to call GA4 Data API
async function fetchGA4Data(
  endpoint: string,
  dateRange: { startDate: string; endDate: string },
  dimensions: string[],
  metrics: string[]
) {
  // This would be called from your backend API route
  const response = await fetch('/api/analytics/ga4-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint, dateRange, dimensions, metrics }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch GA4 data');
  }

  return response.json();
}

// Get overview metrics
export async function getOverviewMetrics(days: number = 30): Promise<GAMetrics> {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const data = await fetchGA4Data(
      'runReport',
      { startDate, endDate },
      [],
      [
        'activeUsers',
        'totalUsers',
        'sessions',
        'bounceRate',
        'averageSessionDuration',
        'screenPageViews',
        'eventCount',
      ]
    );

    return {
      activeUsers: data.activeUsers || 0,
      totalUsers: data.totalUsers || 0,
      sessions: data.sessions || 0,
      bounceRate: parseFloat(data.bounceRate || '0'),
      avgSessionDuration: parseFloat(data.averageSessionDuration || '0'),
      pageViews: data.screenPageViews || 0,
      eventsCount: data.eventCount || 0,
    };
  } catch (error) {
    console.error('Error fetching overview metrics:', error);
    return {
      activeUsers: 0,
      totalUsers: 0,
      sessions: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
      pageViews: 0,
      eventsCount: 0,
    };
  }
}

// Get top pages
export async function getTopPages(days: number = 30, limit: number = 10): Promise<GAPageData[]> {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const data = await fetchGA4Data(
      'runReport',
      { startDate, endDate },
      ['pagePath'],
      ['screenPageViews', 'activeUsers', 'averageSessionDuration', 'bounceRate']
    );

    return data.rows?.slice(0, limit).map((row: any) => ({
      path: row.pagePath || '/',
      views: parseInt(row.screenPageViews || '0'),
      uniqueUsers: parseInt(row.activeUsers || '0'),
      avgTimeOnPage: parseFloat(row.averageSessionDuration || '0'),
      bounceRate: parseFloat(row.bounceRate || '0'),
    })) || [];
  } catch (error) {
    console.error('Error fetching top pages:', error);
    return [];
  }
}

// Get top events
export async function getTopEvents(days: number = 30, limit: number = 10): Promise<GAEventData[]> {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const data = await fetchGA4Data(
      'runReport',
      { startDate, endDate },
      ['eventName'],
      ['eventCount', 'activeUsers']
    );

    return data.rows?.slice(0, limit).map((row: any) => ({
      eventName: row.eventName || 'unknown',
      count: parseInt(row.eventCount || '0'),
      uniqueUsers: parseInt(row.activeUsers || '0'),
    })) || [];
  } catch (error) {
    console.error('Error fetching top events:', error);
    return [];
  }
}

// Get user flow data
export async function getUserFlow(days: number = 30): Promise<GAUserFlow[]> {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const data = await fetchGA4Data(
      'runReport',
      { startDate, endDate },
      ['landingPage', 'exitPage'],
      ['activeUsers']
    );

    return data.rows?.map((row: any) => ({
      landingPage: row.landingPage || '/',
      exitPage: row.exitPage || '/',
      users: parseInt(row.activeUsers || '0'),
    })) || [];
  } catch (error) {
    console.error('Error fetching user flow:', error);
    return [];
  }
}

// Get conversion data
export async function getConversions(days: number = 30): Promise<GAConversion[]> {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const data = await fetchGA4Data(
      'runReport',
      { startDate, endDate },
      ['conversionName'],
      ['conversions', 'conversionRate', 'conversionValue']
    );

    return data.rows?.map((row: any) => ({
      name: row.conversionName || 'unknown',
      conversions: parseInt(row.conversions || '0'),
      conversionRate: parseFloat(row.conversionRate || '0'),
      value: parseFloat(row.conversionValue || '0'),
    })) || [];
  } catch (error) {
    console.error('Error fetching conversions:', error);
    return [];
  }
}

// Get real-time data
export async function getRealtimeData(): Promise<GARealtimeData> {
  try {
    const data = await fetch('/api/analytics/realtime').then(res => res.json());

    return {
      activeUsers: data.activeUsers || 0,
      activePagesTop5: data.activePagesTop5 || [],
      activeLocations: data.activeLocations || [],
      activeDevices: data.activeDevices || { desktop: 0, mobile: 0, tablet: 0 },
    };
  } catch (error) {
    console.error('Error fetching realtime data:', error);
    return {
      activeUsers: 0,
      activePagesTop5: [],
      activeLocations: [],
      activeDevices: { desktop: 0, mobile: 0, tablet: 0 },
    };
  }
}

// Get time series data for charts
export async function getTimeSeriesData(
  metric: string,
  days: number = 30
): Promise<Array<{ date: string; value: number }>> {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const data = await fetchGA4Data(
      'runReport',
      { startDate, endDate },
      ['date'],
      [metric]
    );

    return data.rows?.map((row: any) => ({
      date: row.date || '',
      value: parseFloat(row[metric] || '0'),
    })) || [];
  } catch (error) {
    console.error('Error fetching time series data:', error);
    return [];
  }
}

// Get traffic sources
export async function getTrafficSources(days: number = 30) {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const data = await fetchGA4Data(
      'runReport',
      { startDate, endDate },
      ['sessionSource', 'sessionMedium'],
      ['sessions', 'activeUsers']
    );

    return data.rows?.map((row: any) => ({
      source: row.sessionSource || 'direct',
      medium: row.sessionMedium || 'none',
      sessions: parseInt(row.sessions || '0'),
      users: parseInt(row.activeUsers || '0'),
    })) || [];
  } catch (error) {
    console.error('Error fetching traffic sources:', error);
    return [];
  }
}

// Get device breakdown
export async function getDeviceBreakdown(days: number = 30) {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const data = await fetchGA4Data(
      'runReport',
      { startDate, endDate },
      ['deviceCategory'],
      ['sessions', 'activeUsers', 'bounceRate']
    );

    return data.rows?.map((row: any) => ({
      device: row.deviceCategory || 'unknown',
      sessions: parseInt(row.sessions || '0'),
      users: parseInt(row.activeUsers || '0'),
      bounceRate: parseFloat(row.bounceRate || '0'),
    })) || [];
  } catch (error) {
    console.error('Error fetching device breakdown:', error);
    return [];
  }
}

// Get geographic data
export async function getGeographicData(days: number = 30) {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const data = await fetchGA4Data(
      'runReport',
      { startDate, endDate },
      ['country', 'city'],
      ['activeUsers', 'sessions']
    );

    return data.rows?.map((row: any) => ({
      country: row.country || 'Unknown',
      city: row.city || 'Unknown',
      users: parseInt(row.activeUsers || '0'),
      sessions: parseInt(row.sessions || '0'),
    })) || [];
  } catch (error) {
    console.error('Error fetching geographic data:', error);
    return [];
  }
}
