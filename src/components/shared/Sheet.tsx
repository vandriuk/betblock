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
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Sheet panel — full screen overlay, no BottomNav conflict */}
      <div
        className="absolute inset-x-0 bottom-0 top-0 z-10 flex flex-col justify-end
          md:static md:flex md:items-center md:justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-t-3xl animate-slide-up flex flex-col max-h-[90vh]
            md:rounded-2xl md:max-w-lg md:w-full md:max-h-[85vh] md:mx-4 md:animate-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle + Header */}
          <div className="shrink-0 px-5 pt-3 pb-3 border-b border-gray-100 rounded-t-3xl">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3 md:hidden" />
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="w-11 h-11 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 active:scale-95 transition-all text-xl"
              >
                &times;
              </button>
            </div>
          </div>
          {/* Scrollable content */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
