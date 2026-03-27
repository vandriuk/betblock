import { Factory, ShoppingCart, ClipboardList, AlertTriangle } from 'lucide-react'
import type { ProductStats } from '@/types'

interface ProductStockListProps {
  stats: ProductStats[]
}

export function ProductStockList({ stats }: ProductStockListProps) {
  return (
    <div className="space-y-3">
      {stats.map((s) => {
        const isNegative = s.inStock < 0
        const isLow = s.inStock >= 0 && s.inStock < s.inOrders
        return (
          <div
            key={s.name}
            className={`bg-white border rounded-xl p-4 ${
              isNegative ? 'border-red-200 bg-red-50/50' : isLow ? 'border-orange-200 bg-orange-50/50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">{s.name}</h4>
              <div className="flex items-center gap-1.5">
                {isNegative && <AlertTriangle className="w-4 h-4 text-red-500" />}
                <span className={`text-xl font-bold ${isNegative ? 'text-red-600' : 'text-gray-900'}`}>
                  {s.inStock} шт
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <Factory className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{s.produced}</p>
                  <p className="text-[10px] text-gray-500">Виробл.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{s.sold}</p>
                  <p className="text-[10px] text-gray-500">Продано</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <ClipboardList className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{s.inOrders}</p>
                  <p className="text-[10px] text-gray-500">Замовл.</p>
                </div>
              </div>
            </div>
            {isNegative && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Від'ємний залишок — перевірте дані або внесіть початковий залишок
              </p>
            )}
            {isLow && !isNegative && (
              <p className="text-xs text-orange-600 mt-2">
                Залишок менший за активні замовлення ({s.inOrders} шт)
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
