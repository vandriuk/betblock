import { useState, useRef, useEffect } from 'react'
import type { Customer } from '@/types'

interface CustomerSelectProps {
  customers: Customer[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function CustomerSelect({ customers, value, onChange, placeholder = "Ім'я або назва" }: CustomerSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const filtered = value
    ? customers.filter((c) => c.name.toLowerCase().includes(value.toLowerCase()))
    : customers

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        placeholder={placeholder}
        required
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {filtered.slice(0, 8).map((c) => (
            <button
              key={c.docId || c.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(c.name)
                setOpen(false)
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 active:bg-gray-100 border-b border-gray-100 last:border-b-0"
            >
              <span className="font-medium text-gray-900">{c.name}</span>
              {c.phone && <span className="text-gray-400 ml-2">{c.phone}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
