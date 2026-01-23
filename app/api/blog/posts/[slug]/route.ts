import { createClient } from '@/lib/supabase/server';
import { getCacheOrSet, CACHE_KEYS, CACHE_TTL } from '@/lib/redis/cache';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    const post = await getCacheOrSet(
      CACHE_KEYS.BLOG_POST(slug),
      async () => {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (error) throw error;
        return data;
      },
      { ttl: CACHE_TTL.LONG } // Cache for 10 minutes
    );

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
      cached: true,
    });
  } catch (error: any) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
