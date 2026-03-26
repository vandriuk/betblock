import { ORDER_STATUS_COLORS } from '@/lib/constants'
import type { OrderStatus } from '@/types'

interface OrderStatusBadgeProps {
  status: OrderStatus
  onClick?: (e: React.MouseEvent) => void
}

export function OrderStatusBadge({ status, onClick }: OrderStatusBadgeProps) {
  const colors = ORDER_STATUS_COLORS[status]

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${colors} px-3 py-1 rounded-full text-xs font-semibold transition-opacity hover:opacity-80 active:scale-95`}
      >
        {status}
      </button>
    )
  }

  return (
    <span className={`${colors} px-3 py-1 rounded-full text-xs font-semibold`}>
      {status}
    </span>
  )
}
