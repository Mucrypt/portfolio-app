import { getCacheStats, clearAllCache } from '@/lib/redis/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stats = await getCacheStats();
    
    return NextResponse.json({
      success: true,
      redis: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Clear cache endpoint (protected - add auth in production)
export async function DELETE() {
  try {
    const cleared = await clearAllCache();
    
    return NextResponse.json({
      success: cleared,
      message: cleared ? 'Cache cleared successfully' : 'Failed to clear cache',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
