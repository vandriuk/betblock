import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  message?: string
}

export function EmptyState({ title = 'Поки що порожньо', message = 'Додайте перший запис' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-base font-medium text-gray-600">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{message}</p>
    </div>
  )
}
