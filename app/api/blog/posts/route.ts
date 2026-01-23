import { createClient } from '@/lib/supabase/server';
import { getCacheOrSet, CACHE_KEYS, CACHE_TTL } from '@/lib/redis/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Try cache first, fetch if miss
    const posts = await getCacheOrSet(
      CACHE_KEYS.BLOG_POSTS_ALL,
      async () => {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      { ttl: CACHE_TTL.MEDIUM } // Cache for 5 minutes
    );

    return NextResponse.json({
      success: true,
      data: posts,
      cached: true,
    });
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
