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
            className={`bg-white border rounded-2xl p-4 transition-all ${isLow ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
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
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => onEdit(item)}
                    className="w-11 h-11 flex items-center justify-center rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 active:scale-95 transition-all"
                  >
                    <Pencil className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="w-11 h-11 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
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
