import { useEffect, useRef, type ReactNode } from 'react'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Sheet({ open, onClose, title, children }: SheetProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [open])

  // iOS: ensure scrollable area always has scroll room
  // This prevents iOS from "locking" scroll on the body
  useEffect(() => {
    if (!open || !scrollRef.current) return
    const el = scrollRef.current
    const handleTouchStart = () => {
      // If at top, nudge down 1px so iOS doesn't try to scroll body
      if (el.scrollTop <= 0) {
        el.scrollTop = 1
      }
      // If at bottom, nudge up 1px
      if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
        el.scrollTop = el.scrollHeight - el.clientHeight - 1
      }
    }
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    return () => el.removeEventListener('touchstart', handleTouchStart)
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:items-center md:justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={onClose}
        style={{ touchAction: 'none' }}
      />
      {/* Sheet container */}
      <div
        className="relative bg-white rounded-t-2xl flex flex-col animate-slide-up md:rounded-2xl md:max-w-lg md:w-full md:animate-none"
        style={{ maxHeight: 'calc(var(--app-height, 100dvh) - 2rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — fixed, not scrollable */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2 md:hidden" />
          <h3 className="text-lg font-semibold text-gray-900 mt-2 md:mt-0">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        {/* Scrollable content — min-h-0 is critical for flex overflow to work */}
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-4"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom, 0px))' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
