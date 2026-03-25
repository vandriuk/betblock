import type { ReactNode } from 'react'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Sheet({ open, onClose, title, children }: SheetProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Backdrop — inside scroll container so it doesn't steal touch events */}
      <div
        className="fixed inset-0 bg-black/40 animate-fade-in"
        aria-hidden="true"
        onClick={onClose}
      />
      {/* Flex layout: push sheet to bottom on mobile, center on desktop */}
      <div className="relative flex min-h-full items-end justify-center md:items-center md:p-4">
        {/* Sheet panel */}
        <div
          className="relative w-full bg-white rounded-t-2xl animate-slide-up md:rounded-2xl md:max-w-lg md:animate-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white rounded-t-2xl border-b border-gray-100 px-5 py-4 md:rounded-t-2xl">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2 md:hidden" />
            <div className="flex items-center justify-between mt-2 md:mt-0">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
          </div>
          {/* Content — normal flow, scrolls with the outer container */}
          <div className="px-5 py-4 pb-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
