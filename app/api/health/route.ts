// Health check API endpoint for monitoring
// GET http://localhost:3000/api/health

import { getCacheStats } from '@/lib/redis/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get Redis status
    const redisStats = await getCacheStats();
    
    // Basic health check
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      redis: {
        connected: redisStats.connected,
        keys: redisStats.keys,
        memory: redisStats.memory,
      },
    };

    return Response.json(healthCheck, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    return Response.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}
