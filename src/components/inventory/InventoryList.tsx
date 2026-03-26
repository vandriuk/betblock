import { Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { InventoryItem } from '@/types'

interface InventoryListProps {
  items: InventoryItem[]
  canEdit: boolean
  showPrices: boolean
  onEdit: (item: InventoryItem) => void
  onDelete: (item: InventoryItem) => void
}

export function InventoryList({ items, canEdit, showPrices, onEdit, onDelete }: InventoryListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isLow = item.quantity < item.minQuantity
        return (
          <div
            key={item.docId || item.id}
            className={`bg-white border rounded-xl p-4 ${isLow ? 'border-red-200 bg-red-50/50' : 'border-gray-200'}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  {isLow && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                  <span className="text-sm text-gray-600">
                    <span className={`font-bold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                      {item.quantity}
                    </span>
                    {' / '}{item.minQuantity} {item.unit}
                  </span>
                  {showPrices && (
                    <span className="text-sm text-gray-500">
                      {formatCurrency(item.price)}/{item.unit}
                    </span>
                  )}
                </div>
                {item.notes && (
                  <p className="text-xs text-gray-400 mt-1.5">{item.notes}</p>
                )}
              </div>
              {canEdit && (
                <div className="flex shrink-0 ml-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 active:text-primary-600 active:bg-primary-50"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 active:text-red-500 active:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
