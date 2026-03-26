import { useState } from 'react'
import type { InventoryItem } from '@/types'

interface AdjustmentFormProps {
  item: InventoryItem
  formId: string
  onSubmit: (newQuantity: number, reason: string) => Promise<void>
}

export function AdjustmentForm({ item, formId, onSubmit }: AdjustmentFormProps) {
  const [quantity, setQuantity] = useState(String(item.quantity))
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const diff = Number(quantity) - item.quantity

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = Number(quantity)
    if (isNaN(q) || q < 0) return
    if (diff === 0) return
    if (!reason.trim()) return
    setSubmitting(true)
    try {
      await onSubmit(q, reason.trim())
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-sm text-gray-500">Матеріал</p>
        <p className="font-semibold text-gray-900">{item.name}</p>
        <p className="text-sm text-gray-500 mt-1">
          Поточна кількість: <span className="font-bold text-gray-900">{item.quantity} {item.unit}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Фактична кількість ({item.unit})
        </label>
        <input
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          autoFocus
        />
        {diff !== 0 && !isNaN(diff) && (
          <p className={`text-sm mt-1 font-semibold ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {diff > 0 ? '+' : ''}{diff} {item.unit}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Причина коригування</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Інвентаризація, пересортиця..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>

      {submitting && (
        <p className="text-sm text-gray-500 animate-pulse">Збереження...</p>
      )}
    </form>
  )
}
