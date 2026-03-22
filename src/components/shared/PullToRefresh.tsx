import { RefreshCw } from 'lucide-react'

interface PullToRefreshProps {
  pullDistance: number
  refreshing: boolean
  threshold?: number
}

export function PullToRefreshIndicator({ pullDistance, refreshing, threshold = 80 }: PullToRefreshProps) {
  if (pullDistance === 0 && !refreshing) return null

  const progress = Math.min(pullDistance / threshold, 1)
  const rotation = pullDistance * 3

  return (
    <div
      className="flex items-center justify-center overflow-hidden transition-all"
      style={{ height: refreshing ? 48 : pullDistance > 0 ? pullDistance : 0 }}
    >
      <RefreshCw
        className={`w-5 h-5 text-primary-600 ${refreshing ? 'animate-spin' : ''}`}
        style={{
          opacity: refreshing ? 1 : progress,
          transform: refreshing ? undefined : `rotate(${rotation}deg)`,
        }}
      />
    </div>
  )
}
