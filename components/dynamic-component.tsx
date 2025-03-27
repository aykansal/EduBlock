"use client";

import { Suspense, lazy, ComponentType } from 'react';
import { LoadingFallback } from './loading-fallback';

/**
 * A utility for dynamically importing components to improve performance
 * This reduces the initial bundle size and speeds up navigation
 * 
 * @param importFn - A function that imports the component
 * @returns A dynamically loaded component with a loading fallback
 */
export function createDynamicComponent<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>
) {
  const LazyComponent = lazy(importFn);
  
  return function DynamicComponent(props: T) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
