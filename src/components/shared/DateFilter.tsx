import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export type DatePreset = 'today' | 'week' | 'month' | 'all'

interface DateFilterProps {
  value: DatePreset | 'custom'
  onPreset: (preset: DatePreset) => void
  customFrom?: string
  customTo?: string
  onCustomChange?: (from: string, to: string) => void
}

const PRESETS: { id: DatePreset; label: string }[] = [
  { id: 'today', label: 'Сьогодні' },
  { id: 'week', label: 'Тиждень' },
  { id: 'month', label: 'Місяць' },
  { id: 'all', label: 'Все' },
]

export function getDateRange(preset: DatePreset): { from: string; to: string } | null {
  if (preset === 'all') return null
  const now = new Date()
  const to = now.toISOString().split('T')[0]

  if (preset === 'today') {
    return { from: to, to }
  }
  if (preset === 'week') {
    const d = new Date(now)
    d.setDate(d.getDate() - 6)
    return { from: d.toISOString().split('T')[0], to }
  }
  // month
  const d = new Date(now)
  d.setDate(d.getDate() - 29)
  return { from: d.toISOString().split('T')[0], to }
}

export function filterByDate<T extends { date: string }>(
  items: T[],
  preset: DatePreset,
  customFrom?: string,
  customTo?: string,
): T[] {
  if (preset === 'all') return items

  let from: string
  let to: string

  if (preset === 'today' || preset === 'week' || preset === 'month') {
    const range = getDateRange(preset)!
    from = range.from
    to = range.to
  } else {
    from = customFrom || ''
    to = customTo || ''
  }

  return items.filter((item) => {
    const d = item.date.split('T')[0]
    if (from && d < from) return false
    if (to && d > to) return false
    return true
  })
}

export function DateFilter({ value, onPreset, customFrom, customTo, onCustomChange }: DateFilterProps) {
  const [showCustom, setShowCustom] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 hide-scrollbar">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              onPreset(p.id)
              setShowCustom(false)
            }}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shrink-0 transition-all',
              value === p.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 active:bg-gray-200',
            )}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => {
            setShowCustom(!showCustom)
            if (!showCustom && onCustomChange) {
              onCustomChange(customFrom || '', customTo || '')
            }
          }}
          className={cn(
            'px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5',
            value === 'custom'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-600 active:bg-gray-200',
          )}
        >
          <Calendar className="w-3.5 h-3.5" />
          Період
        </button>
      </div>

      {showCustom && onCustomChange && (
        <div className="flex gap-2">
          <input
            type="date"
            value={customFrom || ''}
            onChange={(e) => onCustomChange(e.target.value, customTo || '')}
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
          <input
            type="date"
            value={customTo || ''}
            onChange={(e) => onCustomChange(customFrom || '', e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      )}
    </div>
  )
}
