import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FABProps {
  onClick: () => void
  className?: string
}

export function FAB({ onClick, className }: FABProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-22 right-4 md:bottom-6 md:right-6 z-30',
        'w-14 h-14 rounded-2xl bg-primary-600 text-white',
        'shadow-lg shadow-primary-600/25',
        'flex items-center justify-center',
        'hover:bg-primary-700 active:scale-90 transition-all duration-200',
        className
      )}
    >
      <Plus className="w-6 h-6" strokeWidth={2.5} />
    </button>
  )
}
