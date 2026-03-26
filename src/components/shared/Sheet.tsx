import { type ReactNode } from 'react'
import { X } from 'lucide-react'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/**
 * Full-screen modal page — no body scroll lock, no vh tricks, no position:fixed hacks.
 * Just a regular page that scrolls naturally on any touch device.
 */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] bg-white dark:bg-gray-900 flex flex-col">
      {/* Fixed header — never scrolls */}
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

      {/* Scrollable content — iOS Safari scrolls this reliably because it's a flex child, not the fixed element itself */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="px-4 py-5 pb-[calc(env(safe-area-inset-bottom,20px)+20px)]">
          {children}
        </div>
      </div>
    </div>
  )
}
