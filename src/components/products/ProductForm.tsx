import { useState, type FormEvent } from 'react'

interface ProductFormProps {
  onSubmit: (name: string, price: number) => void
  initial?: { name: string; price: number }
  submitLabel?: string
}

export function ProductForm({ onSubmit, initial, submitLabel = 'Додати' }: ProductFormProps) {
  const [name, setName] = useState(initial?.name || '')
  const [price, setPrice] = useState(initial?.price || 0)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit(name.trim(), price)
    if (!initial) {
      setName('')
      setPrice(0)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Назва</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="Шлакоблок"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Ціна (₴)</label>
        <input
          type="number"
          value={price || ''}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="25"
          min="0"
          step="0.01"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 active:scale-[0.98] transition-all"
      >
        {submitLabel}
      </button>
    </form>
  )
}
