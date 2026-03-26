import { cn } from '@/lib/utils'

interface StatusFilterProps<T extends string> {
  options: T[]
  selected: T | null
  onSelect: (value: T | null) => void
  colors?: Record<T, string>
}

export function StatusFilter<T extends string>({ options, selected, onSelect, colors }: StatusFilterProps<T>) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 hide-scrollbar">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap shrink-0',
          !selected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 active:bg-gray-200'
        )}
      >
        Всі
      </button>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(selected === opt ? null : opt)}
          className={cn(
            'px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap shrink-0',
            selected === opt
              ? (colors?.[opt] || 'bg-primary-600 text-white')
              : 'bg-gray-100 text-gray-600 active:bg-gray-200'
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
