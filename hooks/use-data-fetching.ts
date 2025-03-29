"use client";

import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { logPerformanceMetric } from '@/lib/performance-utils';

type FetchFunction<T> = (walletId: string) => Promise<T>;

interface UseFetchDataOptions {
  skipIfNoWallet?: boolean;
  defaultValue: any;
}

/**
 * Custom hook for data fetching with loading states and wallet integration
 * This improves performance by centralizing data fetching logic and handling loading states
 */
export function useDataFetching<T>(
  fetchFn: FetchFunction<T>,
  options: UseFetchDataOptions
) {
  const [data, setData] = useState<T>(options.defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const account = useActiveAccount();

  // If no wallet is connected and skipIfNoWallet is true, return early
  if (!account && options.skipIfNoWallet) {
    return { 
      data: options.defaultValue, 
      isLoading: false, 
      error: null, 
      refetch: () => Promise.resolve() 
    };
  }

  useEffect(() => {
    let isMounted = true;
    const startTime = performance.now();

    async function fetchData() {
      // Don't fetch if no wallet is connected and skipIfNoWallet is true
      if (!account && options.skipIfNoWallet) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Only proceed with fetch if we have a wallet address
        if (account?.address) {
          const result = await fetchFn(account.address);

          if (isMounted) {
            setData(result);
            logPerformanceMetric(`Data fetch: ${fetchFn.name}`, startTime);
          }
        } else if (!options.skipIfNoWallet) {
          // If we don't have a wallet but skipIfNoWallet is false, throw error
          throw new Error('No wallet connected');
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching data:', err);
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetchFn, account, options.skipIfNoWallet]);

  const refetch = async () => {
    if (!account?.address) {
      if (options.skipIfNoWallet) {
        return;
      }
      throw new Error('No wallet connected');
    }
    setIsLoading(true);
  };

  return { data, isLoading, error, refetch };
}
