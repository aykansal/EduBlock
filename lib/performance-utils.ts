/**
 * Performance utilities for optimizing the EduBlock application
 */

// Used to track and debounce expensive operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}

// Used to throttle operations that might be called frequently
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Prefetch data for routes to improve navigation experience
export async function prefetchRouteData(route: string): Promise<void> {
  try {
    // Create a hidden link with prefetch attribute
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    link.as = 'document';
    document.head.appendChild(link);
    
    // Also prefetch the API data if applicable
    if (route === '/') {
      // Prefetch dashboard data
      fetch('/api/dashboard');
    } else if (route === '/courses') {
      // Prefetch courses data
      fetch('/api/course');
    } else if (route === '/schedule') {
      // Prefetch schedule data
      fetch('/api/schedule');
    }
  } catch (error) {
    console.error('Error prefetching route data:', error);
  }
}

// Optimize image loading
export function getOptimizedImageUrl(url: string, width: number = 400): string {
  if (!url) return '';
  
  // If it's a YouTube thumbnail, we can optimize it
  if (url.includes('youtube.com') || url.includes('ytimg.com')) {
    // Convert to lower resolution version
    return url.replace('maxresdefault', 'mqdefault');
  }
  
  return url;
}

// Measure and log performance metrics
export function logPerformanceMetric(label: string, startTime: number): void {
  const duration = performance.now() - startTime;
  console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
  
  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // This would be replaced with actual analytics code
    console.log(`[Analytics] ${label}: ${duration.toFixed(2)}ms`);
  }
}
