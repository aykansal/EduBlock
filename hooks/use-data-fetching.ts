"use client";

import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { DEFAULT_WALLET_ID } from '@/lib/api';
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

  useEffect(() => {
    let isMounted = true;
    const startTime = performance.now();
    
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use wallet ID from account if available, otherwise use default
        const walletId = account ? account.address : DEFAULT_WALLET_ID;
        
        // Skip fetching if no wallet and skipIfNoWallet is true
        if (!account && options.skipIfNoWallet) {
          setIsLoading(false);
          return;
        }
        
        const result = await fetchFn(walletId);
        
        if (isMounted) {
          setData(result);
          logPerformanceMetric(`Data fetch: ${fetchFn.name}`, startTime);
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

  return { data, isLoading, error, refetch: () => setIsLoading(true) };
}
