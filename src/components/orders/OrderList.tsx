import { Trash2, ShoppingCart } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { ORDER_STATUSES } from '@/lib/constants'
import { OrderStatusBadge } from './OrderStatusBadge'
import type { Order, OrderStatus } from '@/types'

interface OrderListProps {
  items: Order[]
  canEdit: boolean
  onStatusChange: (order: Order, newStatus: OrderStatus) => void
  onEdit: (order: Order) => void
  onDelete: (order: Order) => void
  onCreateSale?: (order: Order) => void
}

export function OrderList({ items, canEdit, onStatusChange, onEdit, onDelete, onCreateSale }: OrderListProps) {
  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    const idx = ORDER_STATUSES.indexOf(current)
    return idx < ORDER_STATUSES.length - 1 ? ORDER_STATUSES[idx + 1] : null
  }

  return (
    <div className="space-y-2">
      {items.map((order) => {
        const next = getNextStatus(order.status)
        const canConvert = canEdit && order.status === 'Готово' && !order.saleId
        return (
          <div
            key={order.docId || order.id}
            className="bg-white border border-gray-200 rounded-xl p-4"
            onClick={canEdit ? () => onEdit(order) : undefined}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900">{order.customer}</span>
                  <OrderStatusBadge
                    status={order.status}
                    onClick={canEdit && next ? (e) => { e.stopPropagation(); onStatusChange(order, next) } : undefined}
                  />
                  {order.saleId && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      Продаж створено
                    </span>
                  )}
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
              <div className="flex items-center shrink-0" onClick={(e) => e.stopPropagation()}>
                {canConvert && onCreateSale && (
                  <button
                    onClick={() => onCreateSale(order)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 active:text-green-600 active:bg-green-50"
                    title="Створити продаж"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                )}
                {canEdit && (
                  <button
                    onClick={() => onDelete(order)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 active:text-red-500 active:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
