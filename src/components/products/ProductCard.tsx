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
          <p className="text-sm text-gray-500 mt-0.5">
            {formatCurrency(product.price)}
            {product.initialStock ? <span className="ml-2 text-xs text-gray-400">поч. залишок: {product.initialStock} шт</span> : null}
          </p>
        </div>
        {canEdit && (
          <div className="flex">
            <button
              onClick={onEdit}
              className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 active:text-primary-600 active:bg-primary-50"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 active:text-red-500 active:bg-red-50"
            >
              <Trash2 className="w-5 h-5" />
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
