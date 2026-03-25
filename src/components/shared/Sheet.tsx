import { useEffect, useRef, useCallback, type ReactNode, type TouchEvent as ReactTouchEvent } from 'react'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Sheet({ open, onClose, title, children }: SheetProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Block touch scroll on the overlay/backdrop only
  // Allow scroll inside scrollRef
  const handleOverlayTouch = useCallback((e: globalThis.TouchEvent) => {
    // If touch is inside the scroll area, allow it
    if (scrollRef.current?.contains(e.target as Node)) return
    // Otherwise prevent — this stops body from scrolling
    e.preventDefault()
  }, [])

  useEffect(() => {
    if (!open) return
    const el = overlayRef.current
    if (!el) return
    // passive: false is required to be able to preventDefault on touch
    el.addEventListener('touchmove', handleOverlayTouch, { passive: false })
    return () => el.removeEventListener('touchmove', handleOverlayTouch)
  }, [open, handleOverlayTouch])

  if (!open) return null

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      {/* Sheet — mobile: bottom sheet, desktop: centered modal */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl animate-slide-up md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:max-w-lg md:w-full md:max-h-[80vh] md:animate-none">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2 md:hidden" />
          <h3 className="text-lg font-semibold text-gray-900 mt-2 md:mt-0">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="sheet-scroll-area overflow-y-scroll px-5 py-4 pb-safe"
          style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom, 0px))' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
