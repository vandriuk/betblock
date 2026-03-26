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
        'fixed bottom-20 right-4 md:bottom-6 md:right-6 z-30',
        'w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg',
        'flex items-center justify-center',
        'active:bg-primary-700 active:scale-95 transition-transform',
        className
      )}
    >
      <Plus className="w-6 h-6" />
    </button>
  )
}
