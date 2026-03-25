import { Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { ProductionRecord } from '@/types'

interface ProductionListProps {
  items: ProductionRecord[]
  canDelete: boolean
  onDelete: (item: ProductionRecord) => void
}

export function ProductionList({ items, canDelete, onDelete }: ProductionListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.docId || item.id}
          className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between gap-2"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900">{item.productName}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-lg font-semibold">{item.shift}</span>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
              <span>{formatDate(item.date)}</span>
              <span className="font-bold text-gray-900">{item.blocks} шт</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{item.createdBy}</p>
          </div>
          {canDelete && (
            <button
              onClick={() => onDelete(item)}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all shrink-0"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
