import { useState, useEffect, useRef, useCallback } from 'react'

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>
  threshold?: number
}

export function usePullToRefresh({ onRefresh, threshold = 80 }: UsePullToRefreshOptions) {
  const [pulling, setPulling] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    setPullDistance(0)
    try {
      await onRefresh()
    } finally {
      setRefreshing(false)
      setPulling(false)
    }
  }, [onRefresh])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      if (el.scrollTop === 0 && !refreshing) {
        startY.current = e.touches[0].clientY
        setPulling(true)
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!pulling || refreshing) return
      const diff = e.touches[0].clientY - startY.current
      if (diff > 0) {
        setPullDistance(Math.min(diff * 0.5, threshold * 1.5))
      }
    }

    const onTouchEnd = () => {
      if (!pulling || refreshing) return
      if (pullDistance >= threshold) {
        handleRefresh()
      } else {
        setPullDistance(0)
        setPulling(false)
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onTouchEnd)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [pulling, pullDistance, refreshing, threshold, handleRefresh])

  return { containerRef, pullDistance, refreshing, pulling }
}
