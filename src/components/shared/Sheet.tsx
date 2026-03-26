import { type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

/**
 * Sheet renders as a regular page (no position:fixed) via portal.
 * Hides #root and takes over the body — native browser scroll, works on all devices.
 */
export function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  useEffect(() => {
    if (!open) return
    const root = document.getElementById('root')
    if (root) root.style.display = 'none'
    window.scrollTo(0, 0)
    return () => {
      if (root) root.style.display = ''
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      style={{ minHeight: '100vh', background: 'white', position: 'relative', zIndex: 60 }}
    >
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', borderRadius: 12, color: '#6b7280', cursor: 'pointer' }}
          >
            <X style={{ width: 24, height: 24 }} />
          </button>
        </div>
      </div>

      {/* Content — regular page flow, browser handles scroll */}
      <div style={{ padding: '16px 16px 24px' }}>
        {children}
      </div>

      {/* Footer — always at the end of content */}
      {footer && (
        <div style={{ padding: '12px 16px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 8px))', borderTop: '1px solid #e5e7eb', background: 'white', position: 'sticky', bottom: 0 }}>
          {footer}
        </div>
      )}
    </div>,
    document.body
  )
}
