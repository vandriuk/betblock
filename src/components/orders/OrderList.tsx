import { Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { ORDER_STATUSES } from '@/lib/constants'
import { OrderStatusBadge } from './OrderStatusBadge'
import type { Order, OrderStatus } from '@/types'

interface OrderListProps {
  items: Order[]
  canEdit: boolean
  onStatusChange: (order: Order, newStatus: OrderStatus) => void
  onDelete: (order: Order) => void
}

export function OrderList({ items, canEdit, onStatusChange, onDelete }: OrderListProps) {
  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    const idx = ORDER_STATUSES.indexOf(current)
    return idx < ORDER_STATUSES.length - 1 ? ORDER_STATUSES[idx + 1] : null
  }

  return (
    <div className="space-y-2">
      {items.map((order) => {
        const next = getNextStatus(order.status)
        return (
          <div
            key={order.docId || order.id}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900">{order.customer}</span>
                  <OrderStatusBadge
                    status={order.status}
                    onClick={canEdit && next ? () => onStatusChange(order, next) : undefined}
                  />
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span>{formatDate(order.date)}</span>
                  <span>{order.productName}</span>
                  <span className="font-bold text-gray-900">{order.quantity} шт</span>
                </div>
                {order.notes && (
                  <p className="text-xs text-gray-400 mt-1.5">{order.notes}</p>
                )}
              </div>
              {canEdit && (
                <button
                  onClick={() => onDelete(order)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
