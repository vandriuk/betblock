import { Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  canEdit: boolean
  onEdit: () => void
  onDelete: () => void
}

export function ProductCard({ product, canEdit, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-gray-900">{product.name}</h4>
        <p className="text-sm text-gray-500 mt-0.5">{formatCurrency(product.price)}</p>
      </div>
      {canEdit && (
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
