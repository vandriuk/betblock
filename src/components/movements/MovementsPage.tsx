import { useState, useMemo } from 'react'
import { useData } from '@/contexts/DataContext'
import { SearchBar } from '@/components/shared/SearchBar'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatDate } from '@/lib/utils'
import { MOVEMENT_TYPE_LABELS, MOVEMENT_TYPE_COLORS } from '@/lib/constants'
import { ArrowDownCircle, ArrowUpCircle, Factory, Settings } from 'lucide-react'
import type { MovementType } from '@/types'

const ICON_MAP: Record<MovementType, typeof ArrowDownCircle> = {
  income: ArrowDownCircle,
  expense: ArrowUpCircle,
  production: Factory,
  adjustment: Settings,
}

export function MovementsPage() {
  const { movements } = useData()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<MovementType | null>(null)

  const filtered = useMemo(() => {
    let result = movements
    if (typeFilter) result = result.filter((m) => m.type === typeFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((m) =>
        m.materialName.toLowerCase().includes(q) || m.reason.toLowerCase().includes(q)
      )
    }
    return result
  }, [movements, search, typeFilter])

  const types: (MovementType | null)[] = [null, 'income', 'expense', 'production', 'adjustment']

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Рух складу</h2>
        <p className="text-sm text-gray-500 mt-0.5">Історія операцій з матеріалами</p>
      </div>

      {movements.length > 0 && (
        <div className="space-y-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Пошук за матеріалом..." />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {types.map((t) => (
              <button
                key={t || 'all'}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  typeFilter === t
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t ? MOVEMENT_TYPE_LABELS[t] : 'Всі'}
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={movements.length === 0 ? 'Немає записів' : 'Нічого не знайдено'}
          message={movements.length === 0 ? 'Записи з\'являться при виробництві' : 'Спробуйте інший пошук'}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((m) => {
            const Icon = ICON_MAP[m.type]
            const isPositive = m.quantity > 0
            return (
              <div
                key={m.docId || m.id}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isPositive ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <Icon className={`w-4 h-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">{m.materialName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${MOVEMENT_TYPE_COLORS[m.type]}`}>
                        {MOVEMENT_TYPE_LABELS[m.type]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{m.reason}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      <span className="text-gray-400">{formatDate(m.date)}</span>
                      <span className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{m.quantity.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
