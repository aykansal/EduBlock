// A simple client-side cache implementation to improve performance

type CacheItem<T> = {
  data: T;
  timestamp: number;
  expiresAt: number;
};

class ApiCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  
  // Default TTL is 5 minutes (300000 ms)
  constructor(private defaultTTL: number = 300000) {}
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if the cache item has expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }
  
  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const timestamp = Date.now();
    const expiresAt = timestamp + ttl;
    
    this.cache.set(key, {
      data,
      timestamp,
      expiresAt
    });
  }
  
  invalidate(key: string): boolean {
    return this.cache.delete(key);
  }
  
  invalidatePattern(pattern: RegExp): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    });
  }
  
  clear(): void {
    this.cache.clear();
  }
}

// Create a singleton instance
export const apiCache = new ApiCache();

// Utility function for caching API calls
export async function cachedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Try to get from cache first
  const cachedData = apiCache.get<T>(key);
  if (cachedData !== null) {
    return cachedData;
  }
  
  // If not in cache, fetch the data
  const data = await fetchFn();
  
  // Cache the result
  apiCache.set(key, data, ttl);
  
  return data;
}
