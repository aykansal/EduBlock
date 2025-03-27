"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getOptimizedImageUrl } from '@/lib/performance-utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

/**
 * A component that optimizes image loading for better performance
 * - Uses blur placeholder
 * - Optimizes YouTube thumbnails
 * - Handles loading states
 */
export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = "" 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [optimizedSrc, setOptimizedSrc] = useState('');
  
  useEffect(() => {
    // Optimize the image URL
    setOptimizedSrc(getOptimizedImageUrl(src, width));
  }, [src, width]);
  
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse rounded-md"
          style={{ width, height }}
        />
      )}
      
      {optimizedSrc && (
        <Image
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          className={`rounded-md transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          priority={false}
          loading="lazy"
        />
      )}
    </div>
  );
}
