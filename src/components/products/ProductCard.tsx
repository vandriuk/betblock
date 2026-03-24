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
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
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
      {product.recipe && product.recipe.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-400 mb-1">Рецептура на 1 блок:</p>
          <div className="flex flex-wrap gap-1.5">
            {product.recipe.map((r, i) => (
              <span key={i} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">
                {r.materialName}: {r.amountPerBlock}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
