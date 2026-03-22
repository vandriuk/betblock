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
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.docId || item.id}
          className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900">{item.productName}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item.shift}</span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              <span>{formatDate(item.date)}</span>
              <span className="font-bold text-gray-900">{item.blocks} шт</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{item.createdBy}</p>
          </div>
          {canDelete && (
            <button
              onClick={() => onDelete(item)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
