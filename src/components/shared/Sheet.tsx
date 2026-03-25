import { useEffect, type ReactNode } from 'react'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Sheet({ open, onClose, title, children }: SheetProps) {
  // Lock body scroll when sheet is open — critical for iOS Safari
  useEffect(() => {
    if (!open) return
    const scrollY = window.scrollY
    const body = document.body
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.overflow = 'hidden'
    return () => {
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={onClose}
      />
      {/* Sheet panel — positioned at bottom, scrollable content */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 bg-white rounded-t-2xl animate-slide-up
          flex flex-col max-h-[90vh]
          md:static md:max-w-lg md:mx-auto md:mt-[5vh] md:rounded-2xl md:max-h-[85vh] md:animate-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — non-scrollable */}
        <div className="shrink-0 border-b border-gray-100 px-5 py-4 rounded-t-2xl">
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
        {/* Content — THIS is the scroll container */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 pb-10"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
