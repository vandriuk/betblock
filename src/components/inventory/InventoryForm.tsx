import { useState, type FormEvent } from 'react'
import type { InventoryItem } from '@/types'

type FormData = Omit<InventoryItem, 'id' | 'docId'>

interface InventoryFormProps {
  onSubmit: (data: FormData) => void
  initial?: Partial<FormData>
  submitLabel?: string
  formId?: string
}

export function InventoryForm({ onSubmit, initial, submitLabel = 'Додати', formId }: InventoryFormProps) {
  const [name, setName] = useState(initial?.name || '')
  const [unit, setUnit] = useState(initial?.unit || 'кг')
  const [quantity, setQuantity] = useState(initial?.quantity || 0)
  const [minQuantity, setMinQuantity] = useState(initial?.minQuantity || 0)
  const [price, setPrice] = useState(initial?.price || 0)
  const [notes, setNotes] = useState(initial?.notes || '')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), unit, quantity, minQuantity, price, notes })
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Назва</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="Цемент"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Кількість</label>
          <input
            type="number"
            inputMode="decimal"
            value={quantity || ''}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Одиниця</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
          >
            <option value="кг">кг</option>
            <option value="т">т</option>
            <option value="шт">шт</option>
            <option value="л">л</option>
            <option value="м³">м³</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Мін. запас</label>
          <input
            type="number"
            inputMode="decimal"
            value={minQuantity || ''}
            onChange={(e) => setMinQuantity(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Ціна (₴)</label>
          <input
            type="number"
            inputMode="decimal"
            value={price || ''}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Примітки</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
          rows={2}
          placeholder="Необов'язково"
        />
      </div>
      {!formId && (
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 active:scale-[0.98] transition-all"
        >
          {submitLabel}
        </button>
      )}
    </form>
  )
}
