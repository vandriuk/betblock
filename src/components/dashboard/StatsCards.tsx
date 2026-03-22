import { Factory, ShoppingCart, Package, ClipboardList } from 'lucide-react'
import type { ProductStats } from '@/types'

interface StatsCardsProps {
  stats: ProductStats[]
}

export function StatsCards({ stats }: StatsCardsProps) {
  if (stats.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">По продукції</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.name} className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-3">{s.name}</h4>
            <div className="grid grid-cols-2 gap-3">
              <StatItem icon={Factory} label="Вироблено" value={s.produced} color="text-blue-600" bg="bg-blue-50" />
              <StatItem icon={ShoppingCart} label="Продано" value={s.sold} color="text-green-600" bg="bg-green-50" />
              <StatItem icon={Package} label="На складі" value={s.inStock} color="text-purple-600" bg="bg-purple-50" />
              <StatItem icon={ClipboardList} label="Замовлення" value={s.inOrders} color="text-orange-600" bg="bg-orange-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatItem({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: typeof Factory
  label: string
  value: number
  color: string
  bg: string
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div>
        <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  )
}
