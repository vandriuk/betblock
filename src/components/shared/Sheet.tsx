import { type ReactNode } from 'react'
import { X } from 'lucide-react'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Pinned footer — always visible at the bottom, never scrolls away */
  footer?: ReactNode
}

/**
 * Full-screen modal with pinned footer.
 * The footer (submit button) is ALWAYS visible at the bottom — no scrolling needed to reach it.
 * Content area scrolls independently above the footer.
 */
export function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  if (!open) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[60] bg-white dark:bg-gray-900 flex flex-col" style={{ height: '60%' }}>
      {/* Header — fixed at top */}
      <div className="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4">
        <div className="flex items-center justify-between h-14">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-500 active:bg-gray-100 dark:active:bg-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="px-4 py-4">
          {children}
        </div>
      </div>

      {/* Pinned footer — always visible, never hidden by scroll */}
      {footer && (
        <div className="shrink-0 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom,8px))] border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          {footer}
        </div>
      )}
    </div>
  )
}
