"use client"

import { useState, useEffect, useRef } from 'react'

export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastExecuted = useRef<number>(Date.now())

  useEffect(() => {
    const handler = setTimeout(() => {
      const now = Date.now()
      const timeElapsed = now - lastExecuted.current
      
      if (timeElapsed >= delay) {
        setThrottledValue(value)
        lastExecuted.current = now
      }
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return throttledValue
} 