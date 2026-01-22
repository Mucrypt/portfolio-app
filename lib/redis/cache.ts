import Redis from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST || 'redis.portfolio-production.svc.cluster.local';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_ENABLED = process.env.REDIS_ENABLED !== 'false';

let redis: Redis | null = null;

// Initialize Redis client
if (REDIS_ENABLED) {
  try {
    redis = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });

    redis.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    redis.on('error', (err) => {
      console.error('❌ Redis connection error:', err.message);
    });

    redis.connect().catch((err) => {
      console.error('❌ Failed to connect to Redis:', err.message);
      redis = null;
    });
  } catch (error) {
    console.error('❌ Error initializing Redis:', error);
    redis = null;
  }
}

export type CacheOptions = {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Tags for cache invalidation
};

/**
 * Get value from cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) return null;

  try {
    const value = await redis.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Cache get error for key ${key}:`, error);
    return null;
  }
}

/**
 * Set value in cache
 */
export async function setCache<T>(
  key: string,
  value: T,
  options: CacheOptions = {}
): Promise<boolean> {
  if (!redis) return false;

  try {
    const { ttl = 300 } = options; // Default 5 minutes
    const serialized = JSON.stringify(value);
    
    if (ttl > 0) {
      await redis.setex(key, ttl, serialized);
    } else {
      await redis.set(key, serialized);
    }
    
    return true;
  } catch (error) {
    console.error(`Cache set error for key ${key}:`, error);
    return false;
  }
}

/**
 * Delete value from cache
 */
export async function deleteCache(key: string): Promise<boolean> {
  if (!redis) return false;

  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error(`Cache delete error for key ${key}:`, error);
    return false;
  }
}

/**
 * Delete multiple keys matching a pattern
 */
export async function deleteCachePattern(pattern: string): Promise<number> {
  if (!redis) return 0;

  try {
    const keys = await redis.keys(pattern);
    if (keys.length === 0) return 0;
    
    const deleted = await redis.del(...keys);
    return deleted;
  } catch (error) {
    console.error(`Cache pattern delete error for pattern ${pattern}:`, error);
    return 0;
  }
}

/**
 * Invalidate cache by tags
 */
export async function invalidateCacheTags(tags: string[]): Promise<void> {
  if (!redis || tags.length === 0) return;

  try {
    for (const tag of tags) {
      await deleteCachePattern(`*:${tag}:*`);
    }
  } catch (error) {
    console.error('Cache tag invalidation error:', error);
  }
}

/**
 * Get or set cache (fetch if not exists)
 */
export async function getCacheOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  // Try to get from cache first
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetcher();
  
  // Store in cache
  await setCache(key, data, options);
  
  return data;
}

/**
 * Clear all cache
 */
export async function clearAllCache(): Promise<boolean> {
  if (!redis) return false;

  try {
    await redis.flushdb();
    return true;
  } catch (error) {
    console.error('Cache clear all error:', error);
    return false;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  connected: boolean;
  keys: number;
  memory: string;
  hits?: number;
  misses?: number;
}> {
  if (!redis) {
    return { connected: false, keys: 0, memory: '0' };
  }

  try {
    const info = await redis.info('stats');
    const dbSize = await redis.dbsize();
    const memory = await redis.info('memory');
    
    // Parse stats
    const hits = parseInt(info.match(/keyspace_hits:(\d+)/)?.[1] || '0', 10);
    const misses = parseInt(info.match(/keyspace_misses:(\d+)/)?.[1] || '0', 10);
    const usedMemory = memory.match(/used_memory_human:([^\r\n]+)/)?.[1] || '0';

    return {
      connected: true,
      keys: dbSize,
      memory: usedMemory,
      hits,
      misses,
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return { connected: false, keys: 0, memory: '0' };
  }
}

// Cache key builders
export const CACHE_KEYS = {
  BLOG_POSTS_ALL: 'blog:posts:all',
  BLOG_POST: (slug: string) => `blog:post:${slug}`,
  BLOG_CATEGORIES: 'blog:categories:all',
  BLOG_CATEGORY: (slug: string) => `blog:category:${slug}`,
  SERVICES_ALL: 'services:all',
  SERVICE: (slug: string) => `service:${slug}`,
  PROJECTS_ALL: 'projects:all',
  PROJECT: (slug: string) => `project:${slug}`,
  SHOP_PRODUCTS: 'shop:products:all',
  SHOP_PRODUCT: (slug: string) => `shop:product:${slug}`,
  ABOUT_PAGE: 'about:page',
  SKILLS: 'skills:all',
  EXPERIENCE: 'experience:all',
};

// Cache TTLs (in seconds)
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 600, // 10 minutes
  HOUR: 3600, // 1 hour
  DAY: 86400, // 24 hours
};

export default redis;
