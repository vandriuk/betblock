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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Sheet panel */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 bg-white rounded-t-3xl animate-slide-up
          flex flex-col max-h-[85vh]
          md:static md:max-w-lg md:mx-auto md:mt-[5vh] md:rounded-2xl md:max-h-[85vh] md:animate-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle + Header — non-scrollable */}
        <div className="shrink-0 px-5 pt-3 pb-4 border-b border-gray-100 rounded-t-3xl">
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4 md:hidden" />
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
        {/* Content — scroll container with safe bottom padding */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
