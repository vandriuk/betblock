import { cn } from '@/lib/utils'

interface StatusFilterProps<T extends string> {
  options: T[]
  selected: T | null
  onSelect: (value: T | null) => void
  colors?: Record<T, string>
}

export function StatusFilter<T extends string>({ options, selected, onSelect, colors }: StatusFilterProps<T>) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0',
          !selected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        )}
      >
        Всі
      </button>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(selected === opt ? null : opt)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0',
            selected === opt
              ? (colors?.[opt] || 'bg-primary-600 text-white')
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
