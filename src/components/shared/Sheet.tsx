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
    <div
      className="fixed inset-0 z-[60] bg-white overflow-y-auto"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4">
        <div className="flex items-center justify-between h-14">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-500 active:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Form content — just regular scrolling page */}
      <div className="px-4 py-5 pb-12">
        {children}
      </div>
    </div>
  )
}
