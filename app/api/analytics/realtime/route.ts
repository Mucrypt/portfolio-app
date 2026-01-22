import { NextResponse } from 'next/server';

// Real-time analytics endpoint
// This would integrate with GA4 Realtime Reporting API

export async function GET() {
  try {
    // In production, use Google Analytics Realtime Reporting API
    // For now, return mock real-time data

    const mockRealtimeData = {
      activeUsers: Math.floor(Math.random() * 50) + 10,
      activePagesTop5: [
        { page: '/', users: Math.floor(Math.random() * 20) + 5 },
        { page: '/blog', users: Math.floor(Math.random() * 15) + 3 },
        { page: '/projects', users: Math.floor(Math.random() * 10) + 2 },
        { page: '/about', users: Math.floor(Math.random() * 8) + 1 },
        { page: '/contact', users: Math.floor(Math.random() * 5) + 1 },
      ],
      activeLocations: [
        { country: 'United States', users: Math.floor(Math.random() * 15) + 3 },
        { country: 'United Kingdom', users: Math.floor(Math.random() * 8) + 2 },
        { country: 'Canada', users: Math.floor(Math.random() * 6) + 1 },
        { country: 'Germany', users: Math.floor(Math.random() * 5) + 1 },
        { country: 'France', users: Math.floor(Math.random() * 4) + 1 },
      ],
      activeDevices: {
        desktop: Math.floor(Math.random() * 20) + 5,
        mobile: Math.floor(Math.random() * 25) + 8,
        tablet: Math.floor(Math.random() * 5) + 1,
      },
    };

    return NextResponse.json(mockRealtimeData);
  } catch (error) {
    console.error('Error fetching realtime data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch realtime data' },
      { status: 500 }
    );
  }
}
