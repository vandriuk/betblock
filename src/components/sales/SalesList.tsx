import { Trash2 } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Sale } from '@/types'

interface SalesListProps {
  items: Sale[]
  onTogglePaid: (sale: Sale) => void
  onDelete: (sale: Sale) => void
}

export function SalesList({ items, onTogglePaid, onDelete }: SalesListProps) {
  return (
    <div className="space-y-2">
      {items.map((sale) => (
        <div
          key={sale.docId || sale.id}
          className="bg-white border border-gray-200 rounded-xl p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900">{sale.customer}</span>
                <button
                  onClick={() => onTogglePaid(sale)}
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                    sale.paid
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {sale.paid ? 'Оплачено' : 'Не оплачено'}
                </button>
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 flex-wrap">
                <span>{formatDate(sale.date)}</span>
                <span>{sale.productName}</span>
                <span>{sale.blocks} шт</span>
                {sale.pallets > 0 && <span>{sale.pallets} підд.</span>}
              </div>
              <div className="mt-1.5">
                <span className="text-sm text-gray-500">{formatCurrency(sale.price)}/шт</span>
                <span className="mx-2 text-gray-300">·</span>
                <span className="font-bold text-gray-900">{formatCurrency(sale.blocks * sale.price)}</span>
              </div>
            </div>
            <button
              onClick={() => onDelete(sale)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
